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

//===> Configuração do Bot:
const connector = new builder.ChatConnector({
    appId: '',
    appPassword: ''
});

const bot = new builder.UniversalBot(connector);

//===> Configuração LUIS:
const recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
const intents = new builder.IntentDialog({ recognizers: [recognizer] });

//===> Configuração dos 'Intents'(Intenções):

//Endpoint - Saudar:
intents.matches('Saudar', (session, results) => {
    session.send('Oi! Tudo bem? Em que eu posso ajudar?');
});

//Endpoint - Pedir:
intents.matches('Pedir', [(session, args, next) => {
    const pizzas = ['Quatro Queijos', 'Calabreza', 'Frango Catupiri', 'Margarita', 'Portuguesa', 'Mussarela', 'Especialida'];
    const entityPizza = builder.EntityRecognizer.findEntity(args.entities, 'Pizza');

    //Aqui estaremos verificando com o LUIS os melhores 'matches' para a solicitação
    //do pedido da pizza através da Entidade: Pizza:
    if (entityPizza) {
        const match = builder.EntityRecognizer.findBestMatch(pizzas, entityPizza.entity);
    }
    
    if (!match) {

    }
}
]);