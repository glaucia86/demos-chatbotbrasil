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