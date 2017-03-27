function reset() {
    Editor.sendToCore("main-menu:reset", "core-dynamic"),
    Fire
        .FObject
        ._deferredDestroy(),
    Fire._customAssetMenuItems = builtinCustomAssetMenus,
    Fire.JS._registeredClassIds = builtinClassIds,
    Fire.JS._registeredClassNames = builtinClassNames,
    Meta.reset()
}
var Ipc = require("ipc"),
    Meta = require("../asset-db-meta"),
    projectPluginLoader = require("./plugin-loaders/project-plugin-loader"),
    globalPluginLoader = require("./plugin-loaders/global-plugin-loader"),
    builtinPluginLoader = require("./plugin-loaders/builtin-plugin-loader"),
    LoadSequence = [
        builtinPluginLoader, globalPluginLoader, projectPluginLoader
    ],
    Reloader = exports,
    builtinClassIds,
    builtinClassNames,
    builtinCustomAssetMenus,
    inited = !1;
Reloader.init = function () {
    inited = !0,
    builtinClassIds = Fire.JS._registeredClassIds,
    builtinClassNames = Fire.JS._registeredClassNames,
    builtinCustomAssetMenus = Fire
        ._customAssetMenuItems
        .slice()
},
Reloader.reload = function (a) {
    var b = inited;
    if (inited || Reloader.init(), b) {
        for (var c = LoadSequence.length - 1; c >= 0; c--) 
            LoadSequence[c].unloadAll();
        reset()
    }
    for (var d = 0; d < LoadSequence.length; d++) 
        LoadSequence[d].loadAll();
    a && a()
},
Reloader.loadExternalPlugins = function (a) {
    function b() {
        return globalPluginLoader.inited && builtinPluginLoader.inited
            ? (Reloader.reload(a), !0)
            : !1
    }
    b() || (globalPluginLoader.inited || globalPluginLoader.once("inited", b), builtinPluginLoader.inited || builtinPluginLoader.once("inited", b))
},
Ipc.on("reload:core-plugins", Reloader.reload);