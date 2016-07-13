module.exports = function (grunt) {
	grunt.initConfig({
		eslint: {
			target: ["lib/*.js"]
		},
		mochaTest : {
			options: {
				reporter: "spec"
			},
			test : {
				src : ["test/*.js"]
			}
		},
		nsp: {
			package: grunt.file.readJSON("package.json")
		}
	});

	// tasks
	grunt.loadNpmTasks("grunt-eslint");
	grunt.loadNpmTasks("grunt-mocha-test");
	grunt.loadNpmTasks("grunt-nsp");

	// aliases
	grunt.registerTask("test", ["eslint", "mochaTest", "nsp"]);
	grunt.registerTask("default", ["test"]);
};
