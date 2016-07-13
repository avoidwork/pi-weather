"use strict";

const //weather = require("canada-weather"),
	mkdirp = require("mkdirp"),
	path = require("path"),
	root = path.join(__dirname, "data"),
	config = require(path.join(__dirname, "config.json")),
	messages = require(path.join(__dirname, "lib", "messages.js")),
	lcd = require(path.join(__dirname, "lib", "lcd.js"));

let on = true;

function poll () {
	setTimeout(() => {
		lcd.message({msg: messages.dataLoading});
	}, config.ttl || 60);
}

function quit () {
	lcd.kill(true);

	setTimeout(() => {
		process.exit(1);
	}, 500);
}

process.on("uncaughtException", quit);
process.on("SIGINT", quit);

// Joystick (shows datums)
["up", "down", "left", "right"].forEach((i, idx) => {
	lcd.dot3k.joystick.on(i, () => {
		let msg;

		switch (idx) {
			default:
				msg = i.toUpperCase();
		}

		lcd.message({msg: msg});
	});
});

// Joystick press (toggle LCD)
lcd.dot3k.joystick.on("button", () => {
	on = !on;

	if (on) {
		lcd.last();
	} else {
		lcd.dot3k.reset();
	}
});

lcd.contrast();
lcd.message({msg: messages.default});

setTimeout(() => {
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
}, 1000);
