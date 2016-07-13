"use strict";

const //weather = require("canada-weather"),
	mkdirp = require("mkdirp"),
	path = require("path"),
	root = path.join(__dirname, "data"),
	config = require(path.join(__dirname, "config.json")),
	messages = require(path.join(__dirname, "lib", "messages.js")),
	lcd = require(path.join(__dirname, "lib", "lcd.js"));

function poll () {
	setTimeout(() => {
		lcd.message({str: ["Real data would be awesome"]});
	}, config.ttl || 60);
}

function quit () {
	lcd.kill(true);
	process.exit(1);
}

process.on("uncaughtError", quit);
process.on("SIGINT", quit);

lcd.contrast();
lcd.message({msg: messages.dirCreate, backgroundColor: config.colors.ideal});

mkdirp(root, e => {
	if (e) {
		console.error(e.stack);
		lcd.kill(true);
		process.exit(1);
	} else {
		console.log(messages.dirCreated);
		lcd.message({msg: messages.dirCreated});
		poll();
	}
});
