'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var express = require('express');

var app = express();
var port = 12345;

function readConfig(callback) {
	fs.readFile(__dirname + '/config.json', function(err, data) {
		callback(err, JSON.parse(data));
	});
}

app.post('/:key/:scriptName', function(req, res) {
	var key = req.params.key;
	var scriptName = req.params.scriptName;

	readConfig(function (err, config) {
		if (err) {
			res.status(500).send(err.message);
		}
		if (config[key]) {
			if ((config[key])[scriptName]) {
				var path = ((config[key])[scriptName]).path;
				console.log('Running ' + scriptName + '\n' + path);
				exec(path);
				res.status(200).end();
			}
			else {
				res.status(404).end();
			}
		}
		else {
			res.status(404).end();
		}
	});


});

readConfig(function(err, config) {
	var port = config.port;
	app.listen(port);
	console.log('Listening on port ' + port);
});
