var Ipc = require("ipc"),
    Path = require("fire-path");
require("./reloader");
var SEND_PROJ_LOAD = "project-plugin:load",
    SEND_PROJ_UNLOAD = "project-plugin:unload",
    SEND_LOAD = "plugin:load",
    SEND_UNLOAD = "plugin:unload",
    PackageManager = exports,
    loadedPlugins = {},
    uuidToNames = {};
Ipc.on("window:reloaded", function (a) {
    if (a.isMainWindow) 
        for (var b in loadedPlugins) {
            var c = loadedPlugins[b];
            Editor.sendToMainWindow(SEND_LOAD, c["package"], c.path, c.type)
        }
    }),
PackageManager.loadPlugin = function (a, b, c) {
    var d = a.name;
    if (!d || "string" != typeof d) 
        return void Fire.error("Invalid name of package %s(%s)", d, b);
    var e = {
        path: b,
        "package": a,
        type: c
    };
    loadedPlugins[d] = e,
    Editor.mainWindow && Editor.mainWindow.isLoaded && Editor.sendToMainWindow(SEND_LOAD, a, b, c)
},
PackageManager.unloadPlugin = function (a, b) {
    Editor.sendToMainWindow(SEND_UNLOAD, a, b),
    delete loadedPlugins[a],
    Editor
        .Panel
        .closeAll(a)
},
PackageManager.getPackageInfo = function (a) {
    var b = loadedPlugins[a];
    return b
        ? b["package"]
        : null
},
PackageManager.getPackagePath = function (a) {
    var b = loadedPlugins[a];
    return b
        ? Path.dirname(b.path)
        : ""
},
Ipc.on("assets:deleted", function (a) {
    for (var b = a.results, c = 0; c < b.length; c++) 
        PackageManager.unloadProjectPlugin(b[c].uuid)
}),
PackageManager.unloadProjectPlugin = function (a) {
    var b = uuidToNames[a];
    delete uuidToNames[a],
    b && (this.unloadPlugin(b, "project plugins"), Editor.sendToCore(SEND_PROJ_UNLOAD, b))
},
PackageManager.loadProjectPlugin = function (a, b, c) {
    Editor.sendToCore(SEND_PROJ_LOAD, b, c),
    this.loadPlugin(b, c, "project plugins");
    var d = b.name;
    uuidToNames[a] = d
};