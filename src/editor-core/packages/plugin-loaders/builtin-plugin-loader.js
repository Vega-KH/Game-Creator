var Path = require("path"),
    PluginLoader = require("./base/external-plugin-loader"),
    pluginDir = Path.join(Editor.cwd, "builtin"),
    loader = new PluginLoader("builtin plugins", pluginDir);
loader.init(),
module.exports = loader;