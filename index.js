"use strict";

const weather = require("canada-weather"),
	mkdirp = require("mkdirp"),
	fs = require("fs"),
	path = require("path"),
	root = path.join(__dirname, "data"),
	config = require(path.join(__dirname, "config.json"));

mkdirp(root, e => {
	if (e) {
		console.error(e.stack);
		process.exit(1);
	}
});