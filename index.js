"use strict";

const //weather = require("canada-weather"),
	mkdirp = require("mkdirp"),
	path = require("path"),
	root = path.join(__dirname, "data"),
	config = require(path.join(__dirname, "config.json")),
	messages = require(path.join(__dirname, "lib", "messages.js")),
	lcd = require(path.join(__dirname, "lib", "lcd.js"));

let on = true,
	center = true,
	decayTimer = void 0;

function poll () {
	setTimeout(() => {
		lcd.message({msg: messages.dataLoading});
	}, config.poll || 60);
}

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
		decay();
		console.log("last message");
	} else {
		lcd.dot3k.reset();
		console.log("reset");
	}
}

function decay () {
	if (decayTimer) {
		clearTimeout(decayTimer);
	}

	decayTimer = setTimeout(() => {
		if (on) {
			toggle();
		}

		decayTimer = void 0;
	}, config.decay);
}

function datum (idx) {
	let temp = ["up", "down", "left", "right"],
		msg;

	switch (idx) {
		default:
			msg = temp[idx].toUpperCase();
	}

	lcd.message({msg: msg});
	decay();
}

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
		lcd.message({msg: messages.default});
		center = !center;
		console.log("Returning to center");
	}
});

lcd.contrast();
lcd.message({msg: messages.default});
decay();

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
