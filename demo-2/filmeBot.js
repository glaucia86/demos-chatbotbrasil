/**
 * 
 * Arquivo: filmeBot.js
 * Data: 25/02/2018
 * Descrição: Desenvolvimento de um Bot usando a api do The Movie Db
 * Author: Glaucia Lemos
 *
 */

const builder = require('botbuilder');

const connector = new builder.ConsoleConnector().listen();
const bot = new builder.UniversalBot(connector);

//Aqui estou determinando a intenção do usuário quando forem fazer alguma pergunta ao Bot para fazer algo:
const intencoes = new builder.IntentDialog();
bot.dialog('/', intencoes);

intecoes.onDefault([
  (session, args, next) => {
    //Aqui irei validar se o nome do usuário já foi informado, caso contrário invocaremos o dialog '/perguntaNome':
    if (!session.userData.nome) {
      session.beginDialog("/perguntaNome");
    } else {
      next();
    }
  },

  session =>
    session.send(`Eu sou novo por aqui %s. Eu só reconheço o comando 'movie'. Me diga se você deseja recomendar algum filme.`,
        session.userData.nome),
]);

//Início da interação por diálogos com o usuário com o Bot: (http://locahost:3979/api/perguntaNome)
bot.dialog('/perguntaNome', [
  session =>
    builder.Prompts.text(session, `Olá! Tudo bem? Eu sou o FilmeBot. Qual é o seu nome?`),
  (session, results) => {
    //Aqui estou local data para guardar o nome do usuário:
    session.userData.nome = results.response;
    session.endDialog('Olá %s!', session.userData.nome);
  }
]);

//Aqui iremos criar uma lógica a qual iremos guardar as infos dos Id dos gêneros dos filmes:
intencoes.matches('/^filme/i', [
    session =>
        session.beginDialog('/generoPrompt'), 
    (session, results) => {
        if (results.response.id > 0) {
            session.dialogData.genero = results.response.id;
            session.beginDialog('/anoPrompt');
        } else {
            session.send('Tudo bem! Talvez numa próxima vez!');
            session.endDialog();
        }
    },
    //Aqui iremos guardar as infos sobre 'ano':
    (session, results) => {
        session.dialogData.ano = results.response;
        getFilme(session);
    }
]);

//Aqui estamos criando uma lista de opções para o usuário se interagir com a Api do MovieDb:
bot.dialog('/generoPrompt', [
    session => 
        builder.Prompts.choice(session,  'Que tipo de gênero de filme você gostaria de recomendar?', generos),
    (session, results) => {
        const opcao = generos[results.response.entity.toLowerCase()];

        //Aqui retornaremos a escolha do usuário:
        session.endDialogWithResult({ response: opcao });
    },
]);