var Fire = Fire || {},
    Editor = Editor || {};
process && "renderer" !== process.type && (Fire = global.Fire, Editor = global.Editor),
function (a, b) {
    !function () {
        b.arrayCmpFilter = function (a, b) {
            var c,
                d,
                e,
                f;
            for (c = [], e = 0; e < a.length; ++e) {
                d = a[e];
                var g = !0;
                for (f = 0; f < c.length; ++f) {
                    var h = c[f];
                    if (d === h) {
                        g = !1;
                        break
                    }
                    var i = b(h, d);
                    if (i > 0) {
                        g = !1;
                        break
                    }
                    0 > i && (c.splice(f, 1), --f)
                }
                g && c.push(d)
            }
            return c
        },
        b.arrayResize = function (a, b) {
            if (a.length >= b) 
                return void(a.length = b);
            var c = a.length,
                d = a[a.length - 1];
            a.length = b;
            for (var e = c; b > e; ++e) 
                a[e] = d.clone
                    ? d.clone()
                    : d
            },
        b.arrayFillUndefined = function (a, b) {
            for (var c = 0; c < a.length; ++c) 
                void 0 === a[c] && (a[c] = null !== b && b.clone
                    ? b.clone()
                    : b)
            },
        function () {
            for (var a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", c = new Array(128), d = 0; 128 > d; ++d) 
                c[d] = 0;
            for (d = 0; 64 > d; ++d) 
                c[a.charCodeAt(d)] = d;
            var e = /-/g;
            b.compressUuid = function (b) {
                for (var c = b.replace(e, ""), d = c.slice(0, 5), f = [], g = 5; 32 > g; g += 3) {
                    var h = parseInt(c[g], 16),
                        i = parseInt(c[g + 1], 16),
                        j = parseInt(c[g + 2], 16);
                    f.push(a[h << 2 | i >> 2]),
                    f.push(a[(3 & i) << 4 | j])
                }
                return d + f.join("")
            },
            b.decompressUuid = function (a) {
                if (23 === a.length) {
                    for (var b = [], d = 5; 23 > d; d += 2) {
                        var e = c[a.charCodeAt(d)],
                            f = c[a.charCodeAt(d + 1)];
                        b.push((e >> 2).toString(16)),
                        b.push(((3 & e) << 2 | f >> 4).toString(16)),
                        b.push((15 & f).toString(16))
                    }
                    a = a.slice(0, 5) + b.join("")
                }
                return [
                    a.slice(0, 8),
                    a.slice(8, 12),
                    a.slice(12, 16),
                    a.slice(16, 20),
                    a.slice(20)
                ].join("-")
            };
            var f = /^[0-9a-fA-F]{32}$/,
                g = /^[0-9a-zA-Z+/]{23}$/;
            b.isUuid = function (a) {
                return 36 === a.length && (a = a.replace(e, "")),
                g.test(a) || f.test(a)
            }
        }()
    }(),
    function () {
        if (a.isNode) {
            var c = require("fs"),
                d = require("path"),
                e = function (a, b) {
                    for (var f = c.readdirSync(a), g = null, h = "", i = 0; i < f.length; i++) {
                        h = d.join(a, f[i]);
                        try {
                            g = c.statSync(h)
                        } catch (j) {
                            continue
                        }
                        g.isFile()
                            ? b.push(h)
                            : g.isDirectory() && e(h, b)
                    }
                };
            b.readDirRecursively = function (a) {
                var d = [];
                if (Array.isArray(a)) {
                    for (var f = 0; f < a.length; f++) 
                        d = d.concat(b.readDirRecursively(a[f]));
                    return d
                }
                var g = null;
                try {
                    g = c.statSync(a)
                } catch (h) {
                    return []
                }
                return g.isFile()
                    ? d.push(a)
                    : g.isDirectory() && e(a, d),
                d
            }
        } else {
            var f = function () {
                throw new Error("This function can only be used in atom-shell or server")
            };
            b.readDirRecursively = f
        }
        if (a.isAtomShell) 
            b.askSavePath = function (c, d, e, f, g) {
                var h = b.loadProfile("fireball", "global");
                h.lastOpenedPath = h.lastOpenedPath || {};
                var i = h.lastOpenedPath[d],
                    j = null;
                i && "string" == typeof i && (i = a.Path.dirname(i), j = a.Path.join(i, c));
                var k;
                if (a.isWeb) {
                    var l = require("remote");
                    k = l.require("dialog"),
                    g || (g = l.getCurrentWindow())
                } else if (k = require("dialog"), !g) {
                    var m = require("browser-window");
                    g = m.getFocusedWindow()
                }
                var n = {
                    title: e,
                    defaultPath: j
                };
                k.showSaveDialog(g, n, function (a) {
                    a && (h.lastOpenedPath[d] = a, h.save()),
                    f(a)
                })
            }
        ,
        b.askDirPath = function (c, d, e, f, g) {
            var h = b.loadProfile("fireball", "global");
            h.lastOpenedPath = h.lastOpenedPath || {};
            var i = h.lastOpenedPath[d];
            i && "string" == typeof i && (c = i);
            var j;
            if (a.isWeb) {
                var k = require("remote");
                j = k.require("dialog"),
                g || (g = k.getCurrentWindow())
            } else if (j = require("dialog"), !g) {
                var l = require("browser-window");
                g = l.getFocusedWindow()
            }
            var m = {
                title: e,
                defaultPath: c,
                properties: ["openDirectory"]
            };
            j.showOpenDialog(g, m, function (a) {
                a = a && a[0],
                a && (h.lastOpenedPath[d] = a, h.save()),
                f(a)
            })
        },
        b.showItemInFolder = require("shell").showItemInFolder;
        else {
            var f = function () {
                throw new Error("This function can only be used in atom-shell")
            };
            b.askSavePath = f,
            b.askDirPath = f,
            b.showItemInFolder = f
        }
    }(),
    function () {
        b.UUID = {
            AssetsRoot: "b4145302-f47b-49a5-ba5e-049f41ee4915"
        },
        b.selfExcluded = {
            __is_ipc_option__: !0,
            "self-excluded": !0
        },
        b.requireIpcEvent = {
            __is_ipc_option__: !0,
            "require-ipc-event": !0
        }
    }(),
    function () {
        function a() {
            this.listeningIpcs = []
        }
        var c = require("ipc");
        a.prototype.on = function (a, b) {
            c.on(a, b),
            this
                .listeningIpcs
                .push([a, b])
        },
        a.prototype.once = function (a, b) {
            c.once(a, b),
            this
                .listeningIpcs
                .push([a, b])
        },
        a.prototype.clear = function () {
            for (var a = 0; a < this.listeningIpcs.length; a++) {
                var b = this.listeningIpcs[a];
                c.removeListener(b[0], b[1])
            }
            this.listeningIpcs.length = 0
        },
        b.IpcListener = a
    }(),
    function () {
        var c = require("ipc");
        b.Selection = function () {
            var d = "selection:entity:selected",
                e = "selection:asset:selected",
                f = "selection:entity:unselected",
                g = "selection:asset:unselected",
                h = "selection:entity:activated",
                i = "selection:asset:activated",
                j = "selection:entity:hover",
                k = "selection:asset:hover",
                l = "selection:entity:hoverout",
                m = "selection:asset:hoverout",
                n = function () {
                    function a(a) {
                        this.lastActive = "",
                        this.selection = [],
                        this.lastHover = "",
                        this._context = "",
                        this.msg_selected = "selection:" + a + ":selected",
                        this.msg_unselected = "selection:" + a + ":unselected",
                        this.msg_activate = "selection:" + a + ":activated",
                        this.msg_deactivate = "selection:" + a + ":deactivated",
                        this.msg_hover = "selection:" + a + ":hover",
                        this.msg_hoverout = "selection:" + a + ":hoverout"
                    }
                    return a.prototype._activate = function (a) {
                        this.lastActive !== a && (this.lastActive && r._sendToAll(this.msg_deactivate, {id: a}), this.lastActive = a, r._sendToAll(this.msg_activate, {id: a}))
                    },
                    a.prototype._unselectOthers = function (a) {
                        if (Array.isArray(a)) {
                            for (var b = [], c = this.selection.length - 1; c >= 0; c--) {
                                var d = this.selection[c];
                                -1 === a.indexOf(d) && (this.selection.splice(c, 1), b.push(d))
                            }
                            b.length > 0 && r._sendToAll(this.msg_unselected, {"id-list": b})
                        } else {
                            var e = this
                                .selection
                                .indexOf(a);
                            -1 !== e
                                ? (this.selection.splice(e, 1), this.selection.length > 0 && r._sendToAll(this.msg_unselected, {"id-list": this.selection}), this.selection = [a])
                                : (this.selection.length > 0 && r._sendToAll(this.msg_unselected, {"id-list": this.selection}), this.selection.length = 0)
                        }
                    },
                    a.prototype.select = function (a, b) {
                        if (b && this._unselectOthers(a), Array.isArray(a)) {
                            if (a.length > 0) {
                                for (var c = [], d = 0; d < a.length; d++) 
                                    -1 === this.selection.indexOf(a[d]) && (this.selection.push(a[d]), c.push(a[d]));
                                c.length > 0 && r._sendToAll(this.msg_selected, {"id-list": c}),
                                this._activate(a[a.length - 1])
                            }
                        } else - 1 === this
                                .selection
                                .indexOf(a) && (this.selection.push(a), r._sendToAll(this.msg_selected, {"id-list": [a]})),
                            this._activate(a)
                    },
                    a.prototype.unselect = function (a) {
                        var b = !1;
                        if (Array.isArray(a)) {
                            if (a.length > 0) {
                                for (var c = [], d = 0; d < a.length; d++) {
                                    var e = this
                                        .selection
                                        .indexOf(a[d]);
                                    -1 !== e && (this.selection.splice(e, 1), c.push(a[d]), b = b || a[d] === this.lastActive)
                                }
                                c.length > 0 && r._sendToAll(this.msg_unselected, {"id-list": c})
                            }
                        } else {
                            var f = this
                                .selection
                                .indexOf(a);
                            -1 !== f && (this.selection.splice(f, 1), r._sendToAll(this.msg_unselected, {"id-list": [a]}), b = a === this.lastActive)
                        }
                        b && this._activate(this.selection.length > 0
                            ? this.selection[this.selection.length - 1]
                            : "")
                    },
                    a.prototype.hover = function (a) {
                        a = "string" == typeof a
                            ? a
                            : "",
                        this.lastHover !== a && (this.lastHover && r._sendToAll(this.msg_hoverout, {id: this.lastHover}), this.lastHover = a, a && r._sendToAll(this.msg_hover, {id: a}))
                    },
                    a.prototype.setContext = function (a) {
                        this._context = a
                    },
                    Object.defineProperty(a.prototype, "contexts", {
                        get: function () {
                            var a = this._context;
                            if (a) {
                                var b = this
                                    .selection
                                    .indexOf(a);
                                if (-1 !== b) {
                                    var c = this
                                            .selection
                                            .slice(0),
                                        d = c[0];
                                    return c[0] = a,
                                    c[b] = d,
                                    c
                                }
                                return [a]
                            }
                            return []
                        },
                        enumerable: !0
                    }),
                    a.prototype.clear = function () {
                        r._sendToAll(this.msg_unselected, {"id-list": this.selection}),
                        this.selection.length = 0,
                        this._activate("")
                    },
                    a
                }(),
                o = function () {
                    function b(a) {
                        d.call(this, a),
                        this.confirmed = !0,
                        this._confirmedSnapShot = []
                    }
                    function c(a) {
                        !this.confirmed && a
                            ? this.confirm()
                            : this.confirmed && !a && (this._confirmedSnapShot = this.selection.slice(), this.confirmed = !1)
                    }
                    var d = n;
                    return a
                        .JS
                        .extend(b, d),
                    b.prototype._activate = function (a) {
                        this.confirmed && d
                            .prototype
                            ._activate
                            .call(this, a)
                    },
                    b.prototype.select = function (a, b, e) {
                        c.call(this, e),
                        d
                            .prototype
                            .select
                            .call(this, a, b)
                    },
                    b.prototype.unselect = function (a, b) {
                        c.call(this, b),
                        d
                            .prototype
                            .unselect
                            .call(this, a)
                    },
                    b.prototype.confirm = function () {
                        this.confirmed || (this._confirmedSnapShot.length = 0, this.confirmed = !0, this._activate(this.selection[this.selection.length - 1]))
                    },
                    b.prototype.cancel = function () {
                        this.confirmed || (d.prototype.select.call(this, this._confirmedSnapShot, !0), this._confirmedSnapShot.length = 0, this.confirmed = !0)
                    },
                    b
                }(),
                p = new o("entity"),
                q = new o("asset"),
                r = {
                    confirm: function () {
                        p.confirm(),
                        q.confirm()
                    },
                    cancel: function () {
                        p.cancel(),
                        q.cancel()
                    },
                    selectEntity: function (b, c, d) {
                        return "string" == typeof b || Array.isArray(b)
                            ? (c = "undefined" != typeof c
                                ? c
                                : !0, d = "undefined" != typeof d
                                ? d
                                : !0, p.select(b, c, d), void(this._lastGlobalActive !== p && p.confirmed && p.lastActive && (this._lastGlobalActive = p, this._doSend("selection:activated", "entity", p.lastActive))))
                            : void a.error("entity selection argument must be id(string) or array")
                    },
                    unselectEntity: function (b, c) {
                        "string" == typeof b || Array.isArray(b)
                            ? (c = "undefined" != typeof c
                                ? c
                                : !0, p.unselect(b, c))
                            : a.error("entity selection argument must be id(string) or array")
                    },
                    selectAsset: function (b, c, d) {
                        return "string" == typeof b || Array.isArray(b)
                            ? (c = "undefined" != typeof c
                                ? c
                                : !0, d = "undefined" != typeof d
                                ? d
                                : !0, q.select(b, c, d), void(this._lastGlobalActive !== q && q.confirmed && q.lastActive && (this._lastGlobalActive = q, this._doSend("selection:activated", "asset", q.lastActive))))
                            : void a.error("asset selection argument must be uuid(string) or array")
                    },
                    unselectAsset: function (b, c) {
                        "string" == typeof b || Array.isArray(b)
                            ? (c = "undefined" != typeof c
                                ? c
                                : !0, q.unselect(b, c))
                            : a.error("asset selection argument must be uuid(string) or array")
                    },
                    hoverEntity: function (a) {
                        p.hover(a)
                    },
                    hoverAsset: function (a) {
                        q.hover(a)
                    },
                    setContextEntity: function (a) {
                        p.setContext(a)
                    },
                    setContextAsset: function (a) {
                        q.setContext(a)
                    },
                    clearEntity: function () {
                        p.clear(),
                        p.confirm()
                    },
                    clearAsset: function () {
                        q.clear(),
                        q.confirm()
                    },
                    _lastGlobalActive: null,
                    _doSend: function (a, c, d) {
                        b.sendToAll(a, {
                            type: c,
                            id: d
                        })
                    },
                    _sendToAll: function (a, c) {
                        switch (b.sendToAll(a, c), a) {
                            case "selection:asset:activated":
                                this._doSend("selection:activated", "asset", c.id),
                                this._lastGlobalActive = q;
                                break;
                            case "selection:asset:deactivated":
                                this._lastGlobalActive === q && (this._doSend("selection:deactivated", "asset", c.id), this._lastGlobalActive = null);
                                break;
                            case "selection:entity:activated":
                                this._doSend("selection:activated", "entity", c.id),
                                this._lastGlobalActive = p;
                                break;
                            case "selection:entity:deactivated":
                                this._lastGlobalActive === p && (this._doSend("selection:deactivated", "entity", c.id), this._lastGlobalActive = null)
                        }
                    }
                };
            return c.on("window:reloaded", function (a) {
                a.isMainWindow && (r.clearEntity(), r.clearAsset())
            }),
            c.on(d, function (a) {
                var b = a["id-list"];
                b = b.filter(function (a) {
                    return -1 === p
                        .selection
                        .indexOf(a)
                }),
                1 === b.length
                    ? p
                        .selection
                        .push(b[0])
                    : b.length > 1 && (p.selection = p.selection.concat(b))
            }),
            c.on(e, function (a) {
                var b = a["id-list"];
                b = b.filter(function (a) {
                    return -1 === q
                        .selection
                        .indexOf(a)
                }),
                1 === b.length
                    ? q
                        .selection
                        .push(b[0])
                    : b.length > 1 && (q.selection = q.selection.concat(b))
            }),
            c.on(f, function (a) {
                var b = a["id-list"];
                p.selection = p
                    .selection
                    .filter(function (a) {
                        return -1 === b.indexOf(a)
                    })
            }),
            c.on(g, function (a) {
                var b = a["id-list"];
                q.selection = q
                    .selection
                    .filter(function (a) {
                        return -1 === b.indexOf(a)
                    })
            }),
            c.on(h, function (a) {
                var b = a.id;
                p.lastActive = b
            }),
            c.on(i, function (a) {
                var b = a.id;
                q.lastActive = b
            }),
            c.on(j, function (a) {
                var b = a.id;
                p.lastHover = b
            }),
            c.on(k, function (a) {
                var b = a.id;
                q.lastHover = b
            }),
            c.on(l, function (a) {
                p.lastHover = ""
            }),
            c.on(m, function (a) {
                q.lastHover = ""
            }),
            Object.defineProperty(r, "hoveringEntityId", {
                get: function () {
                    return p.lastHover
                },
                enumerable: !0
            }),
            Object.defineProperty(r, "hoveringAssetUuid", {
                get: function () {
                    return q.lastHover
                },
                enumerable: !0
            }),
            Object.defineProperty(r, "contextEntities", {
                get: function () {
                    return p.contexts
                },
                enumerable: !0
            }),
            Object.defineProperty(r, "contextAssets", {
                get: function () {
                    return q.contexts
                },
                enumerable: !0
            }),
            Object.defineProperty(r, "activeEntityId", {
                get: function () {
                    return p.lastActive
                },
                enumerable: !0
            }),
            Object.defineProperty(r, "activeAssetUuid", {
                get: function () {
                    return q.lastActive
                },
                enumerable: !0
            }),
            Object.defineProperty(r, "entities", {
                get: function () {
                    return p
                        .selection
                        .slice()
                },
                enumerable: !0
            }),
            Object.defineProperty(r, "assets", {
                get: function () {
                    return q
                        .selection
                        .slice()
                },
                enumerable: !0
            }),
            r.filter = function (a, b, c) {
                var d,
                    e,
                    f,
                    g;
                if ("name" === b) 
                    d = a.filter(c);
                else 
                    for (d = [], f = 0; f < a.length; ++f) {
                        e = a[f];
                        var h = !0;
                        for (g = 0; g < d.length; ++g) {
                            var i = d[g];
                            if (e === i) {
                                h = !1;
                                break
                            }
                            var j = c(i, e);
                            if (j > 0) {
                                h = !1;
                                break
                            }
                            0 > j && (d.splice(g, 1), --g)
                        }
                        h && d.push(e)
                    }
                return d
            },
            r
        }()
    }(),
    function () {
        function c(a, c, d, e) {
            this["package"] = c,
            this.name = a,
            this.path = d,
            this._mainPath = e,
            this._ipc = new b.IpcListener
        }
        var d = require("path");
        c.prototype.openPanel = function (c, d) {
            var e = this.config,
                f = e.panels && e.panels[c];
            if (!f) 
                return void a.error("Can not find the panel %s in %s's package.json.", c, this.name);
            if (!f.view) 
                return void a.error("Can not find 'view' property in panel %s in %s's package.json.", c, this.name);
            var g = c + "@" + this.name;
            b
                .Panel
                .open(g, f, d)
        },
        c.prototype.on = function (a, b) {
            this
                ._ipc
                .on(a, b)
        },
        c.prototype.sendToPlugin = function (a) {
            var c = []
                .slice
                .call(arguments);
            b
                .sendToPlugin
                .apply(b, [this.name].concat(c))
        },
        c.prototype.sendToPanel = function (a, c) {
            var d = []
                .slice
                .call(arguments, 1);
            b
                .sendToPanel
                .apply(b, [a + "@" + this.name].concat(d))
        },
        c.prototype._destruct = function () {
            this
                ._ipc
                .clear()
        },
        Object.defineProperty(c.prototype, "config", {
            get: function () {
                var a = this["package"].fireball;
                return console.assert(a),
                a
            }
        }),
        b.Plugin = c
    }(),
    function () {
        b._PluginLoaderBase = function () {
            function c(a) {
                e.call(this),
                this.name = a,
                this.nameToPlugin = {},
                this.launched = !1
            }
            var d = require("fire-path"),
                e = require("events").EventEmitter;
            return a
                .JS
                .extend(c, e),
            c.prototype.onAfterUnload = function () {},
            c.prototype._loadImpl = function () {},
            c.prototype._unloadImpl = function () {},
            c.prototype.loadAll = function (a) {
                for (var b in this.nameToPlugin) 
                    this._loadImpl(this.nameToPlugin[b]);
                this.launched = !0,
                a && a()
            },
            c.prototype.unloadAll = function () {
                for (var a in this.nameToPlugin) 
                    this.doUnload(this.nameToPlugin[a])
            },
            c.prototype.load = function (c, e) {
                var f = c.name,
                    g = c.fireball;
                if (g) {
                    var h = d.dirname(e),
                        i = "";
                    g.main && ("string" == typeof g.main
                        ? i = d.resolve(h, g.main)
                        : a.warn('The "main" data in package.json must be a string'));
                    var j = new b.Plugin(f, c, h, i);
                    this.nameToPlugin[f] = j,
                    this.launched && this._loadImpl(j)
                }
            },
            c.prototype.unload = function (b) {
                console.log("unload", b);
                var c = this.nameToPlugin[b];
                c
                    ? (this.doUnload(c), delete this.nameToPlugin[b], this.onAfterUnload())
                    : a.error("Plugin not loaded:", b)
            },
            c.prototype.doUnload = function (a) {
                this._unloadImpl(a),
                a._destruct()
            },
            c.parseMeta = function (b, c) {
                var e = b.config.asset;
                if (e) {
                    var f = d.join(b.path, "package.json");
                    e = [].concat(e);
                    for (var g in e) {
                        var h = e[g];
                        h.pattern
                            ? h.meta
                                ? h.asset
                                    ? c(h)
                                    : a.error('Undefined "fireball/asset/asset" in %s', f)
                                : a.error('Undefined "fireball/asset/meta" in %s', f)
                            : a.error('Undefined "fireball/asset/pattern" in %s', f)
                    }
                }
            },
            c
        }()
    }(),
    function () {
        var c = require("fire-fs"),
            d = require("events");
        b.AssetMeta = a.Class({
            name: "Editor.AssetMeta",
            "extends": d,
            constructor: function () {
                this.dirty = !1
            },
            statics: {
                assetType: a.Asset
            },
            properties: {
                ver: {
                    "default": 0,
                    type: a.Integer,
                    visible: !1
                },
                uuid: {
                    "default": "",
                    visible: !1
                },
                subRawData: {
                    "default": void 0,
                    type: Array,
                    visible: !1
                }
            },
            setDirty: function () {
                this.dirty = !0
            },
            done: function () {
                this.emit("end")
            },
            error: function (a) {
                this.emit("error", a)
            },
            exportToJson: function (a, b) {
                c
                    .writeFile(a.path, b, function (a) {
                        return a
                            ? void this.error(a)
                            : void this.done()
                    }.bind(this))
            },
            startImport: function (a) {
                return setImmediate(function () {
                    var b = require("fire-path");
                    if (!a.meta) 
                        return void this.error(new Error("file.meta is not assigned."));
                    if (a.asset) 
                        a.asset.name = b.basenameNoExt(a.path),
                        this["import"](a);
                    else {
                        if (!this.createAsset) 
                            return void this.done();
                        this
                            .createAsset(a.path, function (c, d) {
                                return c
                                    ? void this.error(new Error("Failed to create asset for " + a.path + " Error Message: " + c.message))
                                    : (d && (a.asset = d, a.asset.name = b.basenameNoExt(a.path)), void this["import"](a))
                            }.bind(this))
                    }
                }.bind(this)),
                this
            },
            startExport: function (a, b, c) {
                return setImmediate(function () {
                    return a.meta
                        ? void this["export"](a, b, c)
                        : void this.error(new Error("file.meta is not assigned."))
                }.bind(this)),
                this
            },
            createAsset: function (a, b) {
                b()
            },
            "import": function (a) {
                this.done()
            },
            "export": function (a, b, c) {
                this.done()
            }
        })
    }(),
    function () {
        b.FolderMeta = a.Class({
            name: "Editor.FolderMeta",
            "extends": b.AssetMeta,
            constructor: function () {
                this.createAsset = null,
                this["import"] = null,
                this["export"] = null
            },
            statics: {
                assetType: null
            }
        })
    }(),
    function () {
        b.SceneMeta = a.Class({
            name: "Editor.SceneMeta",
            "extends": b.AssetMeta,
            constructor: function () {},
            statics: {
                assetType: null
            },
            properties: {
                binary: {
                    "default": !1
                }
            },
            createAsset: function (a, b) {
                b()
            },
            "import": function (a) {
                var c = this;
                b
                    .AssetDB
                    .saveJsonToLibrary(a.meta.uuid, a.path, function (a) {
                        return a
                            ? void c.error(a)
                            : void c.done()
                    })
            },
            "export": function (a, b, c) {
                this.exportToJson(a, b)
            }
        })
    }(),
    function () {
        b.JsonMeta = a.Class({
            name: "Editor.JsonMeta",
            "extends": b.AssetMeta,
            constructor: function () {},
            statics: {
                assetType: a.JsonAsset
            },
            properties: {
                binary: {
                    "default": !1
                }
            },
            createAsset: function (b, c) {
                var d = require("fire-fs");
                d.readFile(b, function (d, e) {
                    if (d) 
                        return void this.error(d);
                    var f = new a.JsonAsset;
                    try {
                        f.json = JSON.parse(e)
                    } catch (g) {
                        var h = require("util");
                        return void this.error(new Error(h.format("Failed to parse %s:\n%s", b, g)))
                    }
                    c(null, f)
                }.bind(this))
            },
            "import": function (a) {
                var c = this,
                    d = require("async");
                d.parallel([
                    function (c) {
                        b
                            .AssetDB
                            .saveAssetToLibrary(a.meta.uuid, a.asset, c)
                    },
                    function (c) {
                        b
                            .AssetDB
                            .copyToLibrary(a.meta.uuid, ".json", a.path, c)
                    }
                ], function (a) {
                    return a
                        ? void c.error(a)
                        : void c.done()
                })
            },
            "export": function (a, b, c) {
                this.exportToJson(a, b)
            }
        })
    }(),
    function () {
        b.PackageMeta = a.Class({
            name: "Editor.PackageMeta",
            "extends": b.JsonMeta,
            properties: {
                enable: {
                    "default": !0
                }
            },
            "import": function (a) {
                b
                    .PackageManager
                    .unloadProjectPlugin(a.meta.uuid),
                a.meta.enable && a.asset && (console.assert(a.asset.json), b.PackageManager.loadProjectPlugin(a.meta.uuid, a.asset.json, a.path)),
                b
                    .JsonMeta
                    .prototype["import"]
                    .call(this, a)
            }
        })
    }(),
    function () {
        var c = require("fire-path"),
            d = require("fire-fs");
        b.TextAssetMeta = a.Class({
            name: "Editor.TextAssetMeta",
            "extends": b.AssetMeta,
            constructor: function () {},
            statics: {
                assetType: a.TextAsset
            },
            properties: {
                binary: {
                    "default": !1
                }
            },
            createAsset: function (b, e) {
                d
                    .readFile(b, function (d, f) {
                        if (d) 
                            return void e(d);
                        var g = new a.TextAsset;
                        g.text = f,
                        g._setRawExtname(c.extname(b)),
                        e(null, g)
                    })
            },
            "import": function (a) {
                var d = this,
                    e = require("async");
                e.parallel([
                    function (c) {
                        b
                            .AssetDB
                            .saveAssetToLibrary(a.meta.uuid, a.asset, c)
                    },
                    function (d) {
                        b
                            .AssetDB
                            .copyToLibrary(a.meta.uuid, c.extname(a.path), a.path, d)
                    }
                ], function (a) {
                    return a
                        ? void d.error(a)
                        : void d.done()
                })
            }
        })
    }(),
    function () {
        var c = require("async"),
            d = require("fire-path"),
            e = require("fire-fs");
        b.ScriptAssetMeta = a.Class({
            name: "Editor.ScriptAssetMeta",
            "extends": b.AssetMeta,
            constructor: function () {},
            statics: {
                assetType: a.ScriptAsset
            },
            createAsset: function (b, c) {
                var e = new a.ScriptAsset;
                e._setRawExtname(d.extname(b)),
                c(null, e)
            },
            "import": function (a) {
                var e = this;
                c.parallel([
                    function (c) {
                        b
                            .AssetDB
                            .saveAssetToLibrary(a.meta.uuid, a.asset, c)
                    },
                    function (c) {
                        b
                            .AssetDB
                            .copyToLibrary(a.meta.uuid, d.extname(a.path), a.path, c)
                    }
                ], function (a) {
                    return a
                        ? void e.error(a)
                        : void e.done()
                })
            },
            "export": function (a, b, c) {
                var d = this;
                e.writeFile(a.path, c, function (a) {
                    return a
                        ? void d.error(a)
                        : void d.done()
                })
            }
        })
    }(),
    function () {
        b.CustomAssetMeta = a.Class({
            name: "Editor.CustomAssetMeta",
            "extends": b.AssetMeta,
            constructor: function () {},
            statics: {
                assetType: a.CustomAsset
            },
            properties: {
                binary: {
                    "default": !1
                }
            },
            createAsset: function (a, b) {
                b()
            },
            "import": function (a) {
                var c = this;
                b
                    .AssetDB
                    .saveJsonToLibrary(a.meta.uuid, a.path, function (a) {
                        return a
                            ? void c.error(a)
                            : void c.done()
                    })
            },
            "export": function (a, b, c) {
                this.exportToJson(a, b)
            }
        })
    }(),
    function () {
        var c = require("fire-path"),
            d = require("fire-fs"),
            e = function (a, d, e, f, g) {
                a
                    .contain(f, f, {
                        r: 255,
                        g: 255,
                        b: 255,
                        a: 0
                    }, "grid", function (a, f) {
                        if (a) 
                            return void(g && g(a));
                        var h = b
                            .AssetDB
                            .mkdirForUuid(d);
                        if (h) {
                            var i = c.join(h, d + ".thumb" + e);
                            f.writeFile(i, function (a) {
                                g && g(a)
                            })
                        }
                    })
            };
        a.TextureType = a.defineEnum({Texture: -1, Sprite: -1, NormalMap: -1}),
        b.TextureMeta = a.Class({
            name: "Editor.TextureMeta",
            "extends": b.AssetMeta,
            constructor: function () {
                this["export"] = null
            },
            statics: {
                assetType: a.Texture
            },
            properties: {
                type: {
                    "default": a.TextureType.Sprite,
                    type: a.TextureType
                },
                wrapMode: {
                    "default": a.Texture.WrapMode.Clamp,
                    type: a.Texture.WrapMode
                },
                filterMode: {
                    "default": a.Texture.FilterMode.Bilinear,
                    type: a.Texture.FilterMode
                }
            },
            createAsset: function (b, d) {
                var e = require("lwip");
                e.open(b, function (e, f) {
                    if (e) 
                        return void d(e);
                    var g = new a.Texture;
                    g.width = f.width(),
                    g.height = f.height(),
                    g._setRawExtname(c.extname(b)),
                    g.lwipImage = f,
                    d(null, g)
                })
            },
            "import": function (f) {
                var g = f.meta,
                    h = f.asset,
                    i = c.extname(f.path),
                    j = c.basename(f.path, i);
                if (h.wrapMode = g.wrapMode, h.filterMode = g.filterMode, g.type === a.TextureType.Sprite) {
                    var k = !1;
                    if (g.subRawData && 0 !== g.subRawData.length || (g.subRawData = [], k = !0), k) {
                        var l = require("node-uuid"),
                            m = new a.Sprite;
                        m.name = j,
                        m.texture = b
                            .serialize
                            .asAsset(g.uuid),
                        m.width = h.width,
                        m.height = h.height,
                        m.rawWidth = h.width,
                        m.rawHeight = h.height;
                        var n = new b.SpriteMeta;
                        n.uuid = l.v4(),
                        n.rawTextureUuid = g.uuid,
                        g
                            .subRawData
                            .push({asset: m, meta: n})
                    }
                } else 
                    g.subRawData && g.subRawData.length > 0 && (g.subRawData = []);
                var o = this,
                    p = "." + h._rawext,
                    q = require("async");
                q.series([
                    function (a) {
                        b
                            .AssetDB
                            .saveAssetToLibrary(g.uuid, h, a)
                    },
                    function (a) {
                        if (d.existsSync(f.path)) 
                            b.AssetDB.copyToLibrary(f.meta.uuid, p, f.path, a);
                        else {
                            var c = b
                                .AssetDB
                                .uuidToLibraryPath(g.uuid);
                            h
                                .lwipImage
                                .writeFile(c + p, a)
                        }
                    },
                    function (a) {
                        e(h.lwipImage, g.uuid, p, 32, a)
                    }
                ], function (a, b) {
                    return a
                        ? void o.error(a)
                        : void o.done()
                })
            }
        })
    }(),
    function () {
        var c = require("fire-path");
        b.AudioClipMeta = a.Class({
            name: "Editor.AudioClipMeta",
            "extends": b.AssetMeta,
            constructor: function () {},
            statics: {
                assetType: a.AudioClip
            },
            createAsset: function (b, d) {
                var e = new a.AudioClip;
                e._setRawExtname(c.extname(b)),
                d(null, e)
            },
            "import": function (a) {
                var d = this,
                    e = require("async");
                e.parallel([
                    function (c) {
                        b
                            .AssetDB
                            .saveAssetToLibrary(a.meta.uuid, a.asset, c)
                    },
                    function (d) {
                        b
                            .AssetDB
                            .copyToLibrary(a.meta.uuid, c.extname(a.path), a.path, d)
                    }
                ], function (a) {
                    return a
                        ? void d.error(a)
                        : void d.done()
                })
            }
        })
    }(),
    function () {
        var c = require("fire-fs"),
            d = function (a, b, c, d) {
                var e = d,
                    f = b,
                    g = c,
                    h = 0,
                    i = 0,
                    j,
                    k;
                for (k = 0; c > k; k++) 
                    for (j = 0; b > j; j++) 
                        if (a.getPixel(j, k).a >= e) {
                            g = k,
                            k = c;
                            break
                        }
                    for (k = c - 1; k >= g; k--) 
                    for (j = 0; b > j; j++) 
                        if (a.getPixel(j, k).a >= e) {
                            i = k - g + 1,
                            k = 0;
                            break
                        }
                    for (j = 0; b > j; j++) 
                    for (k = g; g + i > k; k++) 
                        if (a.getPixel(j, k).a >= e) {
                            f = j,
                            j = b;
                            break
                        }
                    for (j = b - 1; j >= f; j--) 
                    for (k = g; g + i > k; k++) 
                        if (a.getPixel(j, k).a >= e) {
                            h = j - f + 1,
                            j = 0;
                            break
                        }
                    return [f, g, h, i]
            };
        b.TrimType = a.defineEnum({Auto: -1, Custom: -1}),
        b.SpriteMeta = a.Class({
            name: "Editor.SpriteMeta",
            "extends": b.AssetMeta,
            constructor: function () {},
            statics: {
                assetType: a.Sprite
            },
            properties: {
                atlasTag: {
                    "default": "default"
                },
                trimType: {
                    "default": b.TrimType.Auto,
                    type: b.TrimType
                },
                trimThreshold: {
                    "default": 1
                },
                rawTextureUuid: {
                    "default": "",
                    visible: !1
                }
            },
            createAsset: function (b, d) {
                c
                    .readFile(b, function (b, c) {
                        if (b) 
                            return void d(b);
                        var e = a.deserialize(c);
                        d(null, e)
                    })
            },
            "import": function (a) {
                var c = this,
                    e = a.meta,
                    f = b
                        .AssetDB
                        .uuidToFspath(e.rawTextureUuid);
                if (!f) 
                    return void c.error(new Error("Can not find raw texture for " + a.path + ", uuid not found: " + e.rawTextureUuid));
                var g = require("async"),
                    h = require("lwip");
                g.waterfall([
                    function (a) {
                        h.open(f, a)
                    },
                    function (c, f) {
                        var g = c.width(),
                            h = c.height(),
                            i = a.asset;
                        if (i.rawWidth = g, i.rawHeight = h, b.AssetDB.isValidUuid(i.texture._uuid) || (i.texture = null), i.texture || (i.texture = b.serialize.asAsset(e.rawTextureUuid)), e.trimType === b.TrimType.Auto) {
                            var j = d(c, g, h, e.trimThreshold);
                            i.trimX = j[0],
                            i.trimY = j[1],
                            i.width = j[2],
                            i.height = j[3]
                        } else 
                            i.trimX = Math.clamp(i.trimX, 0, i.rawWidth),
                            i.trimY = Math.clamp(i.trimY, 0, i.rawHeight),
                            i.width = Math.clamp(i.width, 0, i.rawWidth - i.trimX),
                            i.height = Math.clamp(i.height, 0, i.rawHeight - i.trimY);
                        i.texture._uuid === e.rawTextureUuid && (i.x = i.trimX, i.y = i.trimY),
                        f(null, i)
                    },
                    function (a, c) {
                        b
                            .AssetDB
                            .saveAssetToLibrary(e.uuid, a, c)
                    }
                ], function (a) {
                    return a
                        ? void c.error(a)
                        : void c.done()
                })
            },
            "export": function (b, d, e) {
                var f = a.deserialize(d),
                    g = b.meta;
                g.rawTextureUuid = f.texture._uuid,
                c.writeFile(b.path, d, function (a) {
                    return a
                        ? void this.error(a)
                        : void this.done()
                }.bind(this))
            }
        })
    }(),
    function () {
        var c = require("fire-fs"),
            d = require("readline"),
            e = require("fire-url"),
            f = require("path"),
            g = function (a, b) {
                var e = a.asset,
                    f = a.meta;
                e.charInfos = [],
                e.kernings = [];
                var g = c.createReadStream(a.path, {encoding: "utf8"}),
                    i = d.createInterface({
                        input: g,
                        output: process.stdout,
                        terminal: !1
                    });
                i.on("line", function (c) {
                    h(c, e, f, a.path) || b(new Error("Error: Failed to parse at line " + c))
                })
                    .on("close", function () {
                        b()
                    })
            },
            h = function (d, e, g, h) {
                var j = {};
                j.chars = {};
                var k = d.trimLeft(),
                    l = k.split(" ");
                if ("info" === l[0]) {
                    var m = i(l, "face");
                    m && (e.face = m.substring(1, m.length - 1));
                    var n = Math.floor(i(l, "size"));
                    n && (e.size = n)
                } else if ("common" === l[0]) {
                    e.lineHeight = Math.floor(i(l, "lineHeight")),
                    e.baseLine = Math.floor(i(l, "base"));
                    var o = Math.floor(i(l, "pages"));
                    if (1 != o) 
                        return a.error("Parse Error: only support one page"),
                        !1
                } else if ("page" === l[0]) {
                    var p = i(l, "file");
                    if (g.texture) 
                        e.texture = g.texture;
                    else {
                        var q = p.substring(1, p.length - 1),
                            r = f.join(f.dirname(h), q);
                        if (c.existsSync(r)) {
                            var s = b
                                .AssetDB
                                .fspathToUuid(r);
                            e.texture = b
                                .serialize
                                .asAsset(s),
                            g.texture = e.texture
                        }
                    }
                } else if ("char" === l[0]) {
                    var t = {
                        id: Math.floor(i(l, "id")),
                        y: Math.floor(i(l, "y")),
                        x: Math.floor(i(l, "x")),
                        width: Math.floor(i(l, "width")),
                        height: Math.floor(i(l, "height")),
                        xOffset: Math.floor(i(l, "xoffset")),
                        yOffset: Math.floor(i(l, "yoffset")),
                        xAdvance: Math.floor(i(l, "xadvance")),
                        rotated: !1
                    };
                    e
                        .charInfos
                        .push(t)
                } else 
                    "kerning" === l[0] && e
                        .kernings
                        .push({
                            first: Math.floor(i(l, "first")),
                            second: Math.floor(i(l, "second")),
                            amount: Math.floor(i(l, "amount"))
                        });
                return !0
            },
            i = function (a, b) {
                for (var c = b.length + 1, d = 0; d < a.length; ++d) {
                    var e = a[d];
                    if (e.length > c && e.substring(0, b.length) === b) {
                        var f = e.substring(c);
                        if ('"' === f[0]) {
                            if ('"' === f[f.length - 1]) 
                                return f;
                            for (var g = d + 1; g < a.length; ++g) {
                                var h = a[g];
                                if (f = f + " " + h, '"' === f[f.length - 1]) 
                                    return f
                            }
                        }
                        return f
                    }
                }
                return ""
            };
        b.BitmapFontMeta = a.Class({
            name: "Editor.BitmapFontMeta",
            "extends": b.AssetMeta,
            constructor: function () {},
            statics: {
                assetType: a.BitmapFont
            },
            properties: {
                texture: {
                    "default": null,
                    type: a.Texture
                }
            },
            createAsset: function (b, c) {
                var d = new a.BitmapFont;
                c(null, d)
            },
            "import": function (a) {
                var c = this,
                    d = require("async");
                d.waterfall([
                    function (b) {
                        g(a, b)
                    },
                    function (c) {
                        b
                            .AssetDB
                            .saveAssetToLibrary(a.meta.uuid, a.asset, c)
                    }
                ], function (a) {
                    return a
                        ? void c.error(a)
                        : void c.done()
                })
            }
        })
    }(),
    function () {
        var c = require("fire-fs"),
            d = a.defineEnum({
                128: 128,
                256: 256,
                512: 512,
                1024: 1024,
                2048: 2048,
                4096: 4096
            });
        b.AtlasMeta = a.Class({
            name: "Editor.AtlasMeta",
            "extends": b.AssetMeta,
            constructor: function () {},
            statics: {
                assetType: a.Atlas
            },
            properties: {
                autoSize: {
                    "default": !0
                },
                width: {
                    "default": 512,
                    type: d
                },
                height: {
                    "default": 512,
                    type: d
                },
                algorithm: {
                    "default": a.Atlas.Algorithm.MaxRect,
                    type: a.Atlas.Algorithm
                },
                sortBy: {
                    "default": a.Atlas.SortBy.UseBest,
                    type: a.Atlas.SortBy
                },
                sortOrder: {
                    "default": a.Atlas.SortOrder.UseBest,
                    type: a.Atlas.SortOrder
                },
                allowRotate: {
                    "default": !0
                },
                useContourBleed: {
                    "default": !0,
                    displayName: "Contour Bleed",
                    tooltip: "reduce border artifacts"
                },
                usePaddingBleed: {
                    "default": !0,
                    displayName: "Padding Bleed",
                    tooltip: "extrude"
                },
                customPadding: {
                    "default": 2,
                    type: a.Integer
                },
                buildColor: {
                    "default": new a.Color(1, 1, 1, 1),
                    nullable: {
                        propName: "customBuildColor",
                        "default": !1
                    }
                }
            },
            createAsset: function (d, e) {
                var f = require("async");
                f.waterfall([
                    function (a) {
                        c.readFile(d, a)
                    },
                    function (d, e) {
                        var g = a.deserialize(d);
                        f.each(g.sprites, function (d, e) {
                            var f = g
                                    .sprites
                                    .indexOf(d),
                                h = d._uuid,
                                i = b
                                    .AssetDB
                                    .uuidToLibraryPath(h);
                            c.readFile(i, function (b, c) {
                                if (b) 
                                    return "ENOENT" === b.code
                                        ? (g.sprites[f] = null, void e())
                                        : void e(b);
                                var d = a.deserialize(c);
                                d._uuid = h,
                                g.sprites[f] = d,
                                e()
                            })
                        }, function (a) {
                            for (var b = g.sprites.length - 1; b >= 0; --b) 
                                null === g.sprites[b] && g.sprites.splice(b, 1);
                            e(a, g)
                        })
                    }
                ], function (a, b) {
                    e(a, b)
                })
            },
            "import": function (c) {
                var d = this,
                    e = c.asset,
                    f = c.meta,
                    g = require("lwip"),
                    h = require("async"),
                    i = require(b.url("editor-core://meta"));
                h.waterfall([
                    function (a) {
                        f.layout(e),
                        a(null)
                    },
                    function (a) {
                        h
                            .each(e.sprites, function (a, c) {
                                h
                                    .waterfall([
                                        function (c) {
                                            var d = i.loadByUuid(a._uuid);
                                            if (!d) 
                                                return void c(new Error("Failed to load sprite meta by uuid " + uuid));
                                            var e = b
                                                .AssetDB
                                                .uuidToFspath(d.rawTextureUuid);
                                            c(null, e, a)
                                        },
                                        function (a, b, c) {
                                            g
                                                .open(a, function (a, d) {
                                                    c(a, d, b)
                                                })
                                        },
                                        function (a, b, c) {
                                            a
                                                .crop(b.trimX, b.trimY, b.trimX + b.width - 1, b.trimY + b.height - 1, function (a, d) {
                                                    c(a, d, b)
                                                })
                                        },
                                        function (a, b, c) {
                                            return b.rotated
                                                ? void a.rotate(90, function (a, d) {
                                                    c(a, d, b)
                                                })
                                                : void c(null, a, b)
                                        },
                                        function (a, b, c) {
                                            b.lwipImage = a,
                                            c(null)
                                        }
                                    ], function (a) {
                                        c(a)
                                    })
                            }, function (b) {
                                a(null)
                            })
                    },
                    function (a) {
                        var b = {
                            r: 0,
                            g: 0,
                            b: 0,
                            a: 0
                        };
                        e.customBuildColor && (b = {
                            r: e.buildColor.r,
                            g: e.buildColor.g,
                            b: e.buildColor.b,
                            a: e.buildColor.a / 255 *100
                        }),
                        g.create(e.width, e.height, b, function (b, c) {
                            a(b, c)
                        })
                    },
                    function (b, c) {
                        h
                            .eachSeries(e.sprites, function (c, d) {
                                try {
                                    b.paste(c.x, c.y, c.lwipImage, d)
                                } catch (e) {
                                    a.warn("Failed to paste sprite %s, message: %s", c.name, e.message),
                                    d()
                                }
                            }, function (a) {
                                c(a, b)
                            })
                    },
                    function (c, d) {
                        var g = null,
                            h = null;
                        if (f.subRawData) 
                            g = f.subRawData[0].asset,
                            h = f.subRawData[0].meta;
                        else {
                            var i = require("node-uuid");
                            f.subRawData = [],
                            g = new a.Texture,
                            h = new b.TextureMeta,
                            h.uuid = i.v4(),
                            f
                                .subRawData
                                .push({asset: g, meta: h})
                        }
                        g.name = e.name,
                        g.width = c.width(),
                        g.height = c.height(),
                        g._setRawExtname(".png"),
                        g.lwipImage = c,
                        h.type = a.TextureType.Texture,
                        h.wrapMode = a.Texture.WrapMode.Clamp,
                        h.filterMode = a.Texture.FilterMode.Bilinear,
                        d(null, h.uuid)
                    },
                    function (a, c) {
                        h
                            .each(e.sprites, function (c, d) {
                                c.texture = b
                                    .serialize
                                    .asAsset(a);
                                var e = b
                                    .AssetDB
                                    .uuidToUrl(c._uuid);
                                b
                                    .AssetDB
                                    .saveAsset(e, b.serialize(c), null)
                                    .on("end", function (a, c) {
                                        for (var e = 0; e < c.length; ++e) {
                                            var f = c[e];
                                            b.sendToAll("asset:saved", {
                                                url: f.url,
                                                uuid: f.uuid
                                            })
                                        }
                                        d()
                                    })
                            }, function (a) {
                                c(a)
                            })
                    },
                    function (a) {
                        b
                            .AssetDB
                            .saveAssetToLibrary(f.uuid, e, a)
                    }
                ], function (a) {
                    return a
                        ? void d.error(a)
                        : void d.done()
                })
            },
            "export": function (b, d, e) {
                var f = a.deserialize(d);
                c.writeFile(b.path, d, function (a) {
                    return a
                        ? void this.error(a)
                        : void this.done()
                }.bind(this))
            },
            layout: function (a) {
                a.width = this.width,
                a.height = this.height,
                a.layout({
                    algorithm: this.algorithm,
                    sortBy: this.sortBy,
                    sortOrder: this.sortOrder,
                    allowRotate: this.allowRotate,
                    autoSize: this.autoSize,
                    padding: this.customPadding
                })
            }
        })
    }()
}(Fire, Editor),
"undefined" != typeof module && module
    ? module.exports = Fire
    : "function" == typeof define && define && define.amd && define([], function () {
        return Fire
    });