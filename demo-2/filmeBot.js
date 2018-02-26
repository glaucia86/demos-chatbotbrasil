/**
 * 
 * Arquivo: filmeBot.js
 * Data: 25/02/2018
 * Descrição: Desenvolvimento de um Bot usando a api do The Movie Db
 * Author: Glaucia Lemos
 * Observação: as informações inerentes a API do 'MovieDb' podem ser adquiridas através da documentação do site que
 * se encontra: https://developers.themoviedb.org
 *
 */

const builder = require("botbuilder");
const moviedb = require("moviedb"); //(process.env.MOVIE_DB_API_KEY);
const restify = require('restify');
const apiKey = require('../../demos-chatbotbrasil/.env');

// Configuração do Server via Restify:
const server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log("%s Aplicação executando na porta %s", server.name, server.url);
});

// Desenvolvimento do ChatBot:
const connector = new builder.ChatConnector({
  appId: process.env.MICROSOFT_APP_ID,
  appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

const intents = new builder.IntentDialog();
bot.dialog('/', intents);

//Aqui iremos resgatar as informações de maneira dinâmica da API 'MovieDb':
//Site: https://developers.themoviedb.org/3/getting-started/images
const imagesBaseUrl = 'https://image.tmdb.org/t/p/';
const posterSize = 'w185';

//Aqui iremos retornar os gêneros com mdb.genreList()
//https://developers.themoviedb.org/3/genres/get-movie-list
const generos = {
  action: {
    id: 28
  },
  adventure: {
    id: 12
  },
  animation: {
    id: 16
  },
  comedy: {
    id: 35
  },
  documentary: {
    id: 99
  },
  drama: {
    id: 18
  },
  horror: {
    id: 27
  },
  mystery: {
    id: 9648
  },
  romance: {
    id: 10749
  },
  "(sair)": {
    id: 0
  }
};

const getFilme = session => {
  // Send typing message
  session.sendTyping();

//Aqui iremos invocar a API do 'MovieDb' passando o 'gênero' e o 'ano de lançamento' pela 
//classificação e popularidade:y
  moviedb.descobrirFilme(
    {
      ordernarPor: "popularidade.desc",
      generos: session.dialogData.generos,
      anoLancamento: session.dialogData.ano
    },
    (err, res) => {
      const msg = new builder.Message(session);
      // Se não houver error:
      if (!err) {
        const filmes = res.results;        
        const index = Math.floor(Math.random() * filmes.length);

        msg.text("Encontrei esse filme aqui: \n\n**%(title)s**\n\n*%(overview)s*", filmes[index]);

        // Se o filme possuir poster:
        if (filmes[index].poster_path) {
          // Adicionaremos a imagem
          msg.attachments([
            {
              contentType: "image/jpeg",
              contentUrl: `${imagesBaseUrl}${posterSize}${filmes[index].poster_path }`
            }]);
        }
      } else {
        msg.text(`Perdão! Ocorreu um erro. Pode falar 'filme' novamente?`);
      }
      session.endDialog(msg);
    });
};

intents.onDefault([
(session, args, next) => {
    //Aqui irei validar se o nome do usuário já foi informado, caso contrário invocaremos o dialog '/perguntaNome':
    if (!session.userData.nome) {
      session.beginDialog("/perguntaNome");
    } else {
      next();
    }
  },
  session =>
    session.send(`Eu sou novo por aqui %s. Eu só reconheço o comando 'movie'. Me diga se você deseja recomendar algum filme.`, session.userData.nome)
]);

//Início da interação por diálogos com o usuário com o Bot: (http://locahost:3979/api/perguntaNome)
bot.dialog('/perguntaNome', [
  session =>
    builder.Prompts.text(session, `Olá! Tudo bem? Eu sou o FilmeBot. Qual é o seu nome?`),
  (session, results) => {
    //Aqui estou local data para guardar o nome do usuário:
    session.userData.nome = results.response;
    session.endDialog('Olá %s!', session.userData.nome);
}]);

//Aqui iremos criar uma lógica a qual iremos guardar as infos dos Id dos gêneros dos filmes:
intents.matches('/^filme/i', [
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
    }
]);

//Aqui estamos criando uma lógica de validação do ano digitado pelo usuário de um determinado filme:
bot.dialog('/anoPrompt', [
    session => 
        builder.Prompts.text
            (session, `Digite o ano de lançamento do filme (no formato yyyy) se você quiser especificar algum filme. Caso contrário, responda como 'não'`),
    (session, results) => {
        const coincide = results.response.match(/\d{4}/g);

        session.endDialogWithResult({ response: coincide });
    }
]);
