/**
 * 
 * Arquivo: bot.js
 * Data: 25/02/2018
 * Descrição: Desenvolvimento de um Bot usando a api do The Movie Db
 * Author: Glaucia Lemos
 *
 */

const builder = require('botbuilder');

const connector = new builder.ConsoleConnector().listen();
const bot = new builder.UniversalBot(connector);

//Início da interação por diálogos com o usuário com o Bot:
bot.dialog('/', [
    session => 
        builder.Prompts.text(session, `Olá! Tudo bem? Eu sou o FilmeBot. Qual é o seu nome?`),
    (session, results) =>
        session.send('Olá %s', results.response),
]);