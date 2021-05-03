require('dotenv/config')
var express = require('express');
var app = express();

const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const toneAnalyzer = new ToneAnalyzerV3({
  version: process.env.VERSION,
  authenticator: new IamAuthenticator({
    apikey: process.env.APIKEY,
  }),
  serviceUrl: process.env.URL,
});


app.get('/', function(req, res) {
  res.send('Olá Mundo!');
});

app.listen(3000, function() {
  console.log('App de Exemplo escutando na porta 3000!');
});