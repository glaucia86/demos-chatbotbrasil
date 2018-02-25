/**
 * Arquivo: bot.js
 * Data: 25/02/2018
 * Descrição: Desenvolvimento de um Bot usando a api do The Movie Db
 * Author: Glaucia Lemos
 *
 */

const builder = require('botbuilder');

const connector = new builder.ConsoleConnector().listen();
const bot = new builder.UniversalBot(connector);

bot.dialog('/', )