/**
 *
 * Arquivo: pizzariaItaliana.js
 * Data: 26/02/2018
 * Descrição: Desenvolvimento de um Bot de pedido de pizza integrado com o LUIS.
 * Author: Glaucia Lemos
 *
 */

//Aqui estou carregando os enviroments que estão vindo do
//arquivo 'env':
require('dotenv-extended').load()

const moment = require('moment');
const builder = require('botbuilder');
const restify = require('restify');

const server = restify.createServer();

//Configuração do Bot:
const connector = new builder.ChatConnector({
    appId: '',
    appPassword: ''
});

const bot = new builder.UniversalBot(connector);

//Configuração LUIS:
const recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
const intents = new builder.IntentDialog({ recognizers: [recognizer] });

