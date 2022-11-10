'use strict';

const express = require('express');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.sendFile('/usr/src/app/public/index.html');
});
app.get('/Style.css', (req, res) => {
    res.sendFile('/usr/src/app/public/Style.css');
  });
  
app.listen(PORT, HOST, () => {
  console.log(`Running on http://${HOST}:${PORT}`);
});