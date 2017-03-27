var Ipc = require("ipc"),
    PluginLoader = require("./base/plugin-loader"),
    loader = new PluginLoader("project plugins"),
    MSG_LOAD = "project-plugin:load",
    MSG_UNLOAD = "project-plugin:unload";
Ipc.on(MSG_LOAD, function (a, b) {
    loader.load(a, b)
}),
Ipc.on(MSG_UNLOAD, function (a) {
    loader.unload(a)
}),
module.exports = loader;