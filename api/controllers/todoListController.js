'use strict';

var webAPI = require('../../RequestAPI/requestAPI.js')

// var mongoose = require('mongoose'),
//   Task = mongoose.model('Tasks');

exports.run = function(req, res) {
  webAPI.Run();
};

exports.forme = function(req, res) {
  webAPI.ForMe();
};

exports.list_all_tasks = function(req, res) {
  // Task.find({}, function(err, task) {
  //   if (err)
  //     res.send(err);
  //   res.json(task);
  // });
};
