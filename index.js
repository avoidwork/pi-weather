"use strict";

const //weather = require("canada-weather"),
	mkdirp = require("mkdirp"),
	path = require("path"),
	os = require("os"),
	jsonpath = require("JSONPath"),
	moment = require("moment"),
	root = path.join(__dirname, "data"),
	config = require(path.join(__dirname, "config.json")),
	pkg = require(path.join(__dirname, "package.json")),
	messages = require(path.join(__dirname, "lib", "messages.js")),
	lcd = require(path.join(__dirname, "lib", "lcd.js")),
	defaultMessage = [messages.default, "v" + pkg.version],
	ipv4 = /IPv4/;

// Mutable state
let on = true,
	center = true,
	weather = {},
	fadeTimer;

function ip () {
	const ifaces = os.networkInterfaces();
	let result = "";

	Object.keys(ifaces).forEach(ifname => {
		ifaces[ifname].forEach(iface => {
			if (!ipv4.test(iface.family) || iface.internal) {
				return;
			}

			result += iface.address;
		});
	});

	return result;
}

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
	let paths = {
			up: "$..warnings.warnings",
			down: "$..weather.timestamp",
			left: "$..forecastGroup.regionalNormals.textSummary",
			right: "$..currentConditions.condition"
		},
		msg, match;

	match = jsonpath({json: weather, path: paths[key]})[0] || null;

	if (key === "up") {
		msg = [match ? match.event.description : messages.nowarning];
	} else if (key === "down") {
		msg = defaultMessage.concat([ip()]);
	} else if (key === "left") {
		msg = [match ? match[0] : messages.error];
	} else if (key === "right") {
		msg = [match ? "Updated " + moment.unix(match / 1000).fromNow() : messages.error];
	}

	if (msg) {
		lcd.message({msg: msg});
	}
}

function fade () {
	if (fadeTimer) {
		clearTimeout(fadeTimer);
	}

	fadeTimer = setTimeout(function () {
		on = false;
		lcd.dot3k.reset();
	}, config.fade * 1000);
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
		fade();
	});
});

// Joystick press (toggle LCD)
lcd.dot3k.joystick.on("button", () => {
	if (center) {
		toggle();
	} else {
		lcd.message({msg: defaultMessage});
		center = !center;
		fade();
	}
});

setTimeout(() => {
	mkdirp(root, e => {
		if (e) {
			console.error(e.stack);
			lcd.kill(true);
			process.exit(1);
		} else {
			fade();
		}
	});
}, 1000);
