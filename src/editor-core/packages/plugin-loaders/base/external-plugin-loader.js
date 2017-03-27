function ExternalPluginLoader(a, b) {
    PluginLoader.call(this, a),
    this.pluginDir = b
}
var Path = require("path"),
    gulp = require("gulp"),
    es = require("event-stream"),
    PluginLoader = require("./plugin-loader");
Fire
    .JS
    .extend(ExternalPluginLoader, PluginLoader),
ExternalPluginLoader.prototype.init = function () {
    var a = this;
    gulp
        .src("*/package.json", {
        cwd: this.pluginDir,
        nodir: !0,
        read: !0
    })
        .pipe(es.through(function (b) {
            var c;
            try {
                c = JSON.parse(b.contents)
            } catch (d) {
                return void Fire.error("Failed to load %s.\n%s", b.path, d)
            }
            a.load(c, b.path)
        }))
        .on("end", function () {
            a.inited = !0,
            a.emit("inited")
        })
},
ExternalPluginLoader.prototype._loadImpl = function (a) {
    PluginLoader
        .prototype
        ._loadImpl
        .call(this, a);
    var b = Path.join(a.path, "package.json");
    Editor
        .PackageManager
        .loadPlugin(a["package"], b, this.name)
},
module.exports = ExternalPluginLoader;