
'use strict';
// let model = require('../api/models/todoListModel');
let todoList = require('../api/controllers/todoListController');
var utf8 = require('utf8');
const runNow = require('../examples/index')


let mongoose = require('mongoose');

var aesjs = require('aes-js');
let fs = require('fs');

var Run = function run() {
	runNow.testFunc()	
}

var ForMe = function forMe() {

}

module.exports={
  Run:Run,
  ForMe:ForMe
}