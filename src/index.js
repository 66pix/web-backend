'use strict';

process.on('uncaughtException', function(err) {
  console.error('uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});

var http = require('http');
var express = require('express');
var cookieparser = require('cookie-parser');
var bodyparser = require('body-parser');
var session = require('express-session');
var csurf = require('csurf');
var seneca = require('seneca')();

// seneca.use(store, {
//   folder: 'company',
//   map: {
//     '-/company/-': '*'
//   },
//   name: 'companies',
//   port: 5432,
//   host: process.env.POSTGRES_COMPANIES_HOST,
//   username: process.env.POSTGRES_COMPANIES_USERNAME,
//   password: process.env.POSTGRES_COMPANIES_PASSWORD
// });

seneca.use('options', {

  main: {
    port: 3001,
    public:'/public'
  },

  auth: {
    sendemail: !process.env.DEVELOPMENT
  }
  // ,
  // log: {
  //     map: [
  //     {
  //       level: 'all',
  //       handler: 'print'
  //     }
  //     ]
  //   }
});

seneca.use('plugins/66pix-users');

seneca.ready(function(err) {
  if (err) {
    return process.exit(!console.error(err));
  }

  var options = seneca.export('options');

  // var u = seneca.pin({role:'user', cmd:'*'})
  // var projectpin = seneca.pin({role:'project', cmd:'*'})

  // seneca.act('role:settings, cmd:define_spec, kind:user', {spec:options.settings.spec})

  var web = seneca.export('web');

  var app = express();

  app.use(cookieparser());
  app.use(bodyparser.json());

  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  }));
  // app.use(csurf());
  // app.use(function(req, res, next) {
  //   res.cookie('XSRF-TOKEN', req.csrfToken());
  //   next();
  // });

  app.use(web);

  // app.use(function(req, res, next) {
  //   if (0 == req.url.indexOf('/reset') ||
  //       0 == req.url.indexOf('/confirm')) {
  //     req.url = '/'
  //   }

  //   next()
  // })

  var server = http.createServer(app);

  // seneca.use('admin', {server:server, local:true});

  server.listen(options.main.port);

  seneca.log.info('listen', options.main.port);
  seneca.log.info('listen', options.main.port);
  seneca.listen();
});

