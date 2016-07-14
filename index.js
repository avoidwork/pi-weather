"use strict";

const //weather = require("canada-weather"),
	mkdirp = require("mkdirp"),
	path = require("path"),
	JSONPath = require("JSONPath"),
	root = path.join(__dirname, "data"),
	config = require(path.join(__dirname, "config.json")),
	pkg = require(path.join(__dirname, "package.json")),
	messages = require(path.join(__dirname, "lib", "messages.js")),
	lcd = require(path.join(__dirname, "lib", "lcd.js")),
	defaultMessage = [messages.default, void 0, pkg.version];

// Mutable state
let on = true,
	center = true,
	weather = {};

function quit () {
	lcd.kill(true);
	setTimeout(() => {
		process.exit(0);
	}, 250);
}

function toggle () {
	on = !on;

	if (on) {
		lcd.last();
	} else {
		lcd.dot3k.reset();
	}
}

function datum (key) {
	let path = {
			up: '$..warnings.warnings',
			down: '$..weather.timestamp',
			left: '$..forecastGroup.regionalNormals.textSummary',
			right: '$..currentConditions.condition',
		},
		msg, match;

	match = JSONPath({json: weather, path: path[key]})[0] || null;

	if (key === "up") {
		msg = [match ? match.event.description : "No warning"];
	} else if (key === "down") {
		msg = [match ? "Updated " + moment.unix(match / 1000).fromNow() + " some time ago" : "Something went wrong"];
	} else if (key === "left") {
		msg = [match ? match[0] : "Something went wrong"];
	} else if (key === "right") {
		msg = [match ? "Updated " + moment.unix(match / 1000).fromNow() : "Something went wrong"];
	}

	if (msg) {
		lcd.message({msg: msg});
	}
}

// Screen setup!
lcd.contrast(config.contrast);
lcd.message({msg: defaultMessage});

// Shutdown handling
process.on("uncaughtException", quit);
process.on("SIGINT", quit);

// Joystick movements (shows datums)
["up", "down", "left", "right"].forEach(i => {
	lcd.dot3k.joystick.on(i, () => {
		datum(i);
		center = false;
	});
});

// Joystick press (toggle LCD)
lcd.dot3k.joystick.on("button", () => {
	if (center) {
		lcd.clear();
		toggle();
	} else {
		lcd.message({msg: defaultMessage});
		center = !center;
	}
});

setTimeout(() => {
	mkdirp(root, e => {
		if (e) {
			console.error(e.stack);
			lcd.kill(true);
			process.exit(1);
		} else {
			//poll();
			void 0;
		}
	});
}, 1000);
