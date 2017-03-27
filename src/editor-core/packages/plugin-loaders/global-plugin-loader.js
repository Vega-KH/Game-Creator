var Path = require("path"),
    PluginLoader = require("./base/external-plugin-loader"),
    pluginDir = Editor.dataPath,
    loader = new PluginLoader("global plugins", pluginDir);
loader.init(),
module.exports = loader;