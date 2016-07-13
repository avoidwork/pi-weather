"use strict";

const //weather = require("canada-weather"),
	mkdirp = require("mkdirp"),
	path = require("path"),
	root = path.join(__dirname, "data"),
	config = require(path.join(__dirname, "config.json")),
	messages = require(path.join(__dirname, "lib", "messages.js")),
	lcd = require(path.join(__dirname, "lib", "lcd.js"));

let on = true,
	timer = void 0;

function poll () {
	setTimeout(() => {
		lcd.message({msg: messages.dataLoading});
	}, config.poll || 60);
}

function quit () {
	lcd.kill(true);
	process.nextTick(() => {
		process.exit(0);
	});
}

function toggle () {
	on = !on;

	if (on) {
		lcd.last();
		decay();
	} else {
		lcd.dot3k.reset();
	}
}

function decay () {
	if (timer) {
		clearTimeout(timer);
	}

	timer = setTimeout(() => {
		if (on) {
			toggle();
		}

		timer = void 0;
	}, config.decay);
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
		decay();
	});
});

// Joystick press (toggle LCD)
lcd.dot3k.joystick.on("button", toggle);

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
