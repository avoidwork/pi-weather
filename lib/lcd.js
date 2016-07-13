"use strict";

const JVSDisplayOTron = require("jvsdisplayotron"),
	dot3k = new JVSDisplayOTron.DOT3k(),
	path = require("path"),
	messages = require(path.join(__dirname, "messages.js"));

function contrast (level = 45) {
	dot3k.lcd.setContrast(level);
}
function message ({str = [messages.default], backgroundColor = void 0} = {}) {
	str.forEach((msg, idx) => {
		dot3k.lcd.setCursorPosition(0, idx);
		dot3k.lcd.write(msg);
	});

	if (backgroundColor) {
		dot3k.backlight.setToRGB(...backgroundColor);
	}
}

function kill (reset = false) {
	dot3k.kill(reset);
}

module.exports = {
	contrast: contrast,
	message: message,
	kill: kill
};
