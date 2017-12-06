'use strict';
let path = require('path');

let admin = require('firebase-admin');

let serviceAccount = path.join(__dirname, 'cryptoping-d8897-firebase-adminsdk-514dv-e7963569c1.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cryptoping-d8897.firebaseio.com"
});

let db = admin.database();

let phudata = db.ref("server/phudata");

var saveNews = function saveNews(obj) {
	phudata.set(obj);
}

var readData = function(callBack) {
	
	phudata.once("value", function(snapshot) {
	  // console.log(snapshot.val());
	  callBack(null, snapshot.val())
	}, function (errorObject) {
	  // console.log("The read failed: " + errorObject.code);
	  callBack(errorObject, null)
	});
}

module.exports={
  readData:readData,
  saveNews:saveNews
}