require('dotenv').config();
const express = require('express');
const next = require('next');
const compression = require('compression');

const port = parseInt(process.env.PORT, 10) | 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(compression());

  server.get('/name', (req, res) => {
    return app.render(req, res, '/');
  });

  server.get('/name/:name', (req, res) => {
    return app.render(req, res, '/nameDetail', { name: req.params.name });
  });

  server.get('/change/:name', (req, res) => {
    return app.render(req, res, '/changeDetail', { name: req.params.name });
  });

  server.get('/surname/:surname', (req, res) => {
    return app.render(req, res, '/surnameDetail', { surname: req.params.surname });
  });

  server.get('/ads.txt', (req, res) => {
    res.sendFile(`${__dirname}/static/ads.txt`);
  });

  server.get('/robots.txt', (req, res) => {
    res.sendFile(`${__dirname}/static/robots.txt`);
  });

  server.get('/sitemap.xml', (req, res) => {
    res.sendFile(`${__dirname}/static/sitemap.xml`);
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
