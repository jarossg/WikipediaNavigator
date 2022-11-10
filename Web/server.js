'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const data = require('/data/result.json')

// App
const app = express();
app.get('/', (req, res) => {
  res.sendFile('/usr/src/app/public/index.html');
});
app.get('/Style.css', (req, res) => {
    res.sendFile('/usr/src/app/public/Style.css');
  });

  app.get('/Script.js', (req, res) => {
    res.sendFile('/usr/src/app/public/Script.js');
  });
  app.get('/Graph.js', (req, res) => {
    res.sendFile('/usr/src/app/public/Graph.js');
  });

  app.get('/data', (req, res) => {
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(data));
  });


app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});