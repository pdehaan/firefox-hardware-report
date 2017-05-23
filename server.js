const express = require('express');
const forceSSL = require('express-force-ssl');
const hsts = require('hsts');
const morgan = require('morgan');
const serveStatic = require('serve-static');


const app = express();

// Log requests
app.use(morgan('common'));

// Permanently redirect from HTTP to HTTPS and add the HSTS header
app.use(forceSSL);
app.use(hsts());

// Serve the static site
app.use(serveStatic(__dirname));

// Listen on port process.env.PORT
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}...`);
});
