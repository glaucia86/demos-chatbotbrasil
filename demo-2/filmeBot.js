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

//Início da interação por diálogos com o usuário com o Bot: (http://locahost:3979/api/perguntaNome)
bot.dialog('/perguntaNome', [
  session =>
    builder.Prompts.text(session, `Olá! Tudo bem? Eu sou o FilmeBot. Qual é o seu nome?`),
  (session, results) => {
    //Aqui estou criando um local para guardar o nome do usuário:
    session.userData.nome = results.response;
    session.endDialog('Olá %s!', session.userData.nome);
  }
]);