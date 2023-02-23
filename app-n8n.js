const wppconnect = require('@wppconnect-team/wppconnect');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const port = 8000;
const request = require('request');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

wppconnect.create({
    session: 'sessionName',
    statusFind: (statusSession, session) => {
      console.log('Status Session: ', statusSession);
      console.log('Session name: ', session);
    },
    headless: true,
    puppeteerOptions: {
      userDataDir: 'tokens/sessionName'
    }, 
  })
  .then((client) => start(client))
  .catch((error) => console.log(error));

async function start(client) {
    console.log('© BOT-ZDG - Iniciando o BOT...');

    //escuta mensagem
    client.onMessage(async (msg) => {
      try {
        const options = {
          'method': 'POST',
          'url': 'https://jqaur1m11ongj279cq9g0hes.hooks.n8n.cloud/webhook/30d79379-6092-483f-b656-1bb292bdd65a',
          'headers': {
            'Content-Type': 'application/json'
          },
          json: msg
        };
        request(options, function (error, response) {
          if (error) {
            throw new Error(error);
          }
          else {
            console.log(response.body);
          }
        });
      } catch (e) {
        console.log(e);
      }
    });

    //envia mensagem
    app.post('/send-message', async (req, res) => {
      const number = req.body.number;
      const message = req.body.message;
      client.sendText(number, message).then(response => {
        res.status(200).json({
          status: true,
          message: '© BOT-ZDG Mensagem enviada',
          response: response
        });
        }).catch(err => {
        res.status(500).json({
          status: false,
          message: '© BOT-ZDG Mensagem não enviada',
          response: err.text
        });
      });
    });

  }

server.listen(port, function() {
    console.log('© BOT-ZDG rodando na porta*: ' + port);
});