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
		lcd.message({message: "Real data would be awesome", backgroundColor: config.colors.ideal});
	}, config.ttl || 60);
}

process.on("uncaughtError", () => {
	lcd.kill(true);
});

process.on("SIGINT", () => {
	lcd.kill(true);
});

console.log("Setting LCD contrast & creating data directory");

lcd.contrast();
lcd.message({message: [messages.app, messages.dirCreate], backgroundColor: config.colors.ideal});

mkdirp(root, e => {
	if (e) {
		console.error(e.stack);
		lcd.kill(true);
		process.exit(1);
	} else {
		console.log(messages.dirCreated);
		lcd.message({message: [messages.app, messages.dirCreate]});
		poll();
	}
});
