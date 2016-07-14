"use strict";

const //weather = require("canada-weather"),
	mkdirp = require("mkdirp"),
	path = require("path"),
	root = path.join(__dirname, "data"),
	config = require(path.join(__dirname, "config.json")),
	pkg = require(path.join(__dirname, "package.json")),
	messages = require(path.join(__dirname, "lib", "messages.js")),
	lcd = require(path.join(__dirname, "lib", "lcd.js")),
	defaultMessage = [messages.default, void 0, pkg.version];

let on = true,
	center = true;

function quit () {
	lcd.kill(true);
	setTimeout(() => {
		process.exit(0);
	}, 250);
}

function toggle () {
	on = !on;
	console.log(on);

	if (on) {
		lcd.last();
		console.log("last message");
	} else {
		lcd.dot3k.reset();
		console.log("reset");
	}
}

function datum (idx) {
	let temp = ["up", "down", "left", "right"],
		msg;

	switch (idx) {
		default:
			msg = temp[idx].toUpperCase();
	}

	lcd.message({msg: [msg]});
}

lcd.contrast(config.contrast);
lcd.message({msg: defaultMessage});

process.on("uncaughtException", quit);
process.on("SIGINT", quit);

// Joystick (shows datums)
["up", "down", "left", "right"].forEach((i, idx) => {
	lcd.dot3k.joystick.on(i, () => {
		console.log(i);
		datum(idx);
		center = false;
	});
});

// Joystick press (toggle LCD)
lcd.dot3k.joystick.on("button", () => {
	console.log("button");

	if (center) {
		lcd.clear();
		toggle();
		console.log("Toggling LCD");
	} else {
		lcd.message({msg: defaultMessage});
		center = !center;
		console.log("Returning to center");
	}
});

setTimeout(() => {
	mkdirp(root, e => {
		if (e) {
			console.error(e.stack);
			lcd.kill(true);
			process.exit(1);
		} else {
			console.log(messages.dirCreated);
			//poll();
		}
	});
}, 1000);
