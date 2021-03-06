"use strict";

const JVSDisplayOTron = require("jvsdisplayotron"),
	dot3k = new JVSDisplayOTron.DOT3k(),
	path = require("path"),
	config = require(path.join(__dirname, "..", "config.json")),
	messages = require(path.join(__dirname, "messages.js"));

let timer = void 0,
	last = void 0;

function clear () {
	if (timer) {
		clearTimeout(timer);
		timer = void 0;
	}
}

function contrast (level = 55) {
	dot3k.lcd.setContrast(level);
}
function message ({debounce = 250, msg = [messages.default], backgroundColor = config.colors.ideal} = {}) {
	last = {
		debounce: debounce,
		msg: msg,
		backgroundColor: backgroundColor
	};

	clear();
	timer = setTimeout(() => {
		dot3k.lcd.clear();

		msg.forEach((i, idx) => {
			if (i) {
				dot3k.lcd.setCursorPosition(0, idx);
				dot3k.lcd.write(i);
			}
		});

		if (backgroundColor) {
			dot3k.backlight.setToRGB(...backgroundColor);
		}

		timer = void 0;
	}, debounce);
}

function kill (reset = false) {
	if (reset) {
		dot3k.reset();
	}

	dot3k.kill();
}

module.exports = {
	clear: clear,
	contrast: contrast,
	dot3k: dot3k,
	message: message,
	kill: kill,
	last: () => {
		message(last);
	}
};
