'use strict';

const path = require('path');
const serveStatic = require('feathers').static;
const favicon = require('serve-favicon');
const compress = require('compression');
const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');
const cors = require('cors');
const socketio = require('feathers-socketio');
const middleware = require('./middleware');
const services = require('./services');

const app = feathers();

app.configure(configuration(path.join(__dirname, '..')));

app.use(compress())
  .options('*',cors())
  .use(cors())
 // .use(favicon( path.join(app.get('public'), 'favicon.ico') ))   // disabling until we get our own favicon
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(hooks())
  .configure(rest())
  .configure(socketio())
  .configure(services)
  // redirect all requests to index because routing is handled by client side js.
  .use('/', serveStatic(app.get('public')))
  .use((req, res) => res.sendFile(`${app.get('public')}/index.html`))
  .configure(middleware);

module.exports = app;
