function isScript(a) {
	return ".js" === Path.extname(a).toLowerCase()
}

function isScriptResult(a) {
	return isScript(a.url)
}
var Path = require("path"),
	Ipc = require("ipc"),
	gulpInst = require("./gulp-compile"),
	RELOAD_WINDOW_SCRIPTS = "reload:window-scripts",
	COMPILE_AND_RELOAD = "compiler:compile-and-reload",
	needRecompile = !1,
	Compiler = {
		compileScripts: function (a) {
			var b = {
				project: Editor.projectPath,
				debug: !0
			};
			gulpInst.startWithArgs(b, function (b) {
				b ? Fire.error(b) : Fire.log("Compiled successfully"), a && a(!b)
			})
		},
		compileAndReload: function () {
			this.compileScripts(function (a) {
				Editor.sendToWindows(RELOAD_WINDOW_SCRIPTS, a)
			})
		}
	};
Ipc.on(COMPILE_AND_RELOAD, function () {
	Compiler.compileAndReload()
}), Ipc.on("assets:deleted", function (a) {
	var b = a.results;
	needRecompile = needRecompile || b.some(isScriptResult)
}), Ipc.on("asset:changed", function (a) {
	var b = a.uuid,
		c = Editor.AssetDB.uuidToFspath(b);
	needRecompile = needRecompile || isScript(c)
}), Ipc.on("asset:moved", function (a) {
	var b = a.uuid,
		c = a["dest-url"];
	needRecompile = needRecompile || isScript(c)
}), Ipc.on("asset:created", function (a) {
	var b = a.url;
	needRecompile = needRecompile || isScript(b)
}), Ipc.on("assets:created", function (a) {
	var b = a.results;
	needRecompile = needRecompile || b.some(isScriptResult)
}), Ipc.on("asset-db:synced", function () {
	needRecompile && (needRecompile = !1, Compiler.compileAndReload())
}), module.exports = Compiler;
