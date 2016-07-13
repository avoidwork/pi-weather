"use strict";

const weather = require("canada-weather"),
	mkdirp = require("mkdirp"),
	fs = require("fs"),
	JVSDisplayOTron = require("jvsdisplayotron"),
	dot3k = new JVSDisplayOTron.DOT3k(),
	path = require("path"),
	root = path.join(__dirname, "data"),
	config = require(path.join(__dirname, "config.json")),
	messages = require(path.join(__dirname, "lib", "messages.js"));

function lcd ({message = messages.default, backgroundColor = void 0} = {}) {
	dot3k.lcd.write(message);

	if (backgroundColor) {
		dot3k.backlight.setToRGB(...backgroundColor);
	}
}

lcd({message: "Data directory exists"});

mkdirp(root, e => {
	if (e) {
		console.error(e.stack);
		dot3k.kill(true);
		process.exit(1);
	} else {
		lcd({message: "Data directory exists", backgroundColor: config.colors.ideal});
	}
});

process.on("SIGINT", () => {
	dot3k.kill(true);
});
