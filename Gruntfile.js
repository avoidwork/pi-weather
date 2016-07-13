module.exports = function (grunt) {
	grunt.initConfig({
		eslint: {
			target: ["index.js", "lib/*.js"]
		},
		nsp: {
			package: grunt.file.readJSON("package.json")
		}
	});

	// tasks
	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-nsp");

	// aliases
	grunt.registerTask("test", ["eslint", "nsp"]);
	grunt.registerTask("default", ["test"]);
};
