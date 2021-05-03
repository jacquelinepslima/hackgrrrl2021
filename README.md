# hackgrrrl2021
Ariel - IA
## Objetivo e Motivações
- O objetivo do nosso projeto é fazer com que a sociedade se sinta mais incluída através das propagandas publicitárias.
- A partir do tema proposto pelo hackathon realizamos uma pesquisa, além do material de apoio já previamente postado, e percebemos que a maioria da população mundial tem algum preconceito contra a mulher (ONU, 2020).

## Que tecnologias vocês usaram no hackathon?
- HTML, CSS, Javascript, Node.js, Json, IBM - Tone Analyzer

## Por que vocês escolheram essas tecnologias?
- O HTML e CSS foram utilizados para apresentar ao cliente a plataformar da nossa IA - Ariel.
- JS, Node.js, Json foram utilizados para inicializar a parte do back end, porém ainda não foi finalizada.
- IBM - Tone Analyzer foi utilizado para analisar a tonacidade das palavras presentes no texto que poderá ser usado em propagandas publicitárias.

## Qual foi a maior desafio (da parte de desenvolvimento) durante o hackathon? Como vocês resolveram?
- O time teve alguns desafios, o primeiro foi conseguir entender qual era o problema que deveriamos suprir. O segundo foi conseguir codar em um dia e utilizar linguagens que ainda não havíamos trabalhado (back end).

## Qual foi o maior aprendizado (ou uma parte do código que vocês achem massa e estão orgulhosas)?
- Conseguimos aprender muito com as mentorias, as meninas sempre muito atenciosas e ajudando ao máximo.
- Conseguimos criar uma landpage em um dia, sem saber quase nada de código, e mostrar visualmente o que pretendiamos.
- O maior orgulho é conseguir inserir o código do Watson do Tone Analyzer da IBM:
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
  res.send('Olá Hack Grrrl!');
});

app.listen(3000, function() {
  console.log('App de Exemplo escutando na porta 3000!');
});

## Se vocês fossem participar de um hackathon semana que vem, fariam algo de diferente com relação às escolhas das tecnologias utilizadas?
- Analisariamos melhor a temática do hackathon, e a partir daí procurar conhecer melhor as tecnologias para que se adequem ao projeto.
