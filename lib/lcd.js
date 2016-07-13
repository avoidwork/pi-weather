"use strict";

const JVSDisplayOTron = require("jvsdisplayotron"),
	dot3k = new JVSDisplayOTron.DOT3k(),
	path = require("path"),
	messages = require(path.join(__dirname, "messages.js"));

let timer = void 0;

function contrast (level = 45) {
	dot3k.lcd.setContrast(level);
}
function message ({debounce = 250, msg = messages.default, backgroundColor = void 0} = {}) {
	if (timer) {
		clearTimeout(timer);
	}

	timer = setTimeout(() => {
		dot3k.reset();
		dot3k.lcd.setCursorPosition(0, 0);
		dot3k.lcd.write(msg);

		if (backgroundColor) {
			dot3k.backlight.setToRGB(...backgroundColor);
		}

		timer = void 0;
	}, debounce);
}

function kill (reset = false) {
	dot3k.kill(reset);
}

module.exports = {
	contrast: contrast,
	message: message,
	kill: kill
};
