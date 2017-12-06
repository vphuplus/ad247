'use strict';
var webAPI = require('./RequestAPI/requestAPI.js')
var express = require('express'),
  app = express(),
  port = process.env.PORT || 4030,
  // mongoose = require('mongoose'),
  // Task = require('./api/models/todoListModel'),
  bodyParser = require('body-parser');
  
// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost/Tododb3'); 


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(function(req, res) {
//   res.status(404).send({url: req.originalUrl + ' not found'})
// });

var routes = require('./api/routes/todoListRoutes');
routes(app);

app.listen(port, function() {
  webAPI.Run();
  webAPI.ForMe();
});


console.log('todo list RESTful API server started on: ' + port);