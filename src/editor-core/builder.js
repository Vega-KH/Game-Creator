var Path = require("fire-path"),
	Ipc = require("ipc"),
	gulpInst = require("./gulp-build");
Ipc.on("build-project", function (a, b, c, d) {
	console.log("@johnny start build"), Builder.build(a, b, c, d, function () {
		console.log("@johnny build finished")
	})
});
var Builder = {
	build: function (a, b, c, d, e) {
		var f = c.map(function (a) {
				var b = Editor.AssetDB.uuidToFspath(a);
				return {
					name: Path.basenameNoExt(b),
					uuid: a
				}
			}),
			g = {
				project: Editor.projectPath,
				projectName: d.projectName,
				dest: b,
				platform: a,
				scenes: f,
				debug: d.isDebug
			};
		gulpInst.startWithArgs(g, function (a) {
			a ? Fire.error(a) : Fire.log('Built to "' + b + '" successfully'), e && e(!a)
		})
	}
};
module.exports = Builder;
