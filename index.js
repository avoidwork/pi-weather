"use strict";

const //weather = require("canada-weather"),
	weather = {poll: () => void 0},
	mkdirp = require("mkdirp"),
	path = require("path"),
	root = path.join(__dirname, "data"),
	config = require(path.join(__dirname, "config.json")),
	messages = require(path.join(__dirname, "lib", "messages.js")),
	lcd = require(path.join(__dirname, "lib", "lcd.js"));

process.on("uncaughtError", () => {
	lcd.kill(true);
});

process.on("SIGTERM", () => {
	lcd.kill(true);
});

lcd({message: messages.dirCreate, backgroundColor: config.colors.ideal});

mkdirp(root, e => {
	if (e) {
		console.error(e.stack);
		lcd.kill(true);
		process.exit(1);
	} else {
		lcd.message({message: messages.dirCreated, backgroundColor: config.colors.ideal});
		weather.poll({ttl: config.ttl, city: config.city, lcd: lcd});
	}
});
