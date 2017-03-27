(function () {
    function ImageLoader(a, b, c) {
        FireUrl && (a = FireUrl.addRandomQuery(a));
        var d = document.createElement("img");
        d.crossOrigin = "Anonymous";
        var e = function () {
                b && b(null, this),
                d.removeEventListener("load", e),
                d.removeEventListener("error", f),
                d.removeEventListener("progress", c)
            },
            f = function (a, g, h) {
                if (b) {
                    var i = "Failed to load image: " + a + " Url: " + h;
                    b(i, null)
                }
                d.removeEventListener("load", e),
                d.removeEventListener("error", f),
                d.removeEventListener("progress", c)
            };
        return d.addEventListener("load", e),
        d.addEventListener("error", f),
        c && d.addEventListener("progress", c),
        d.src = a,
        d
    }
    function _LoadFromXHR(a, b, c, d) {
        var e = new XMLHttpRequest,
            f = -1;
        e.onreadystatechange = function () {
            e.readyState === e.DONE
                ? (b && (200 === e.status || 0 === e.status
                    ? b(null, e)
                    : b('LoadFromXHR: Could not load "' + a + '", status: ' + e.status, null)), e.onreadystatechange = null, g && e.removeEventListener("progress", g))
                : (!c || e.readyState !== e.LOADING || "onprogress" in e || (-1 === f && (f = e.getResponseHeader("Content-Length")), c(e.responseText.length, f)), c && e.readyState === e.HEADERS_RECEIVED && (f = e.getResponseHeader("Content-Length")))
        },
        e.open("GET", a, !0),
        d && (e.responseType = d);
        var g;
        c && "onprogress" in e && (g = function (a) {
            a.lengthComputable && c(a.loaded, a.total)
        },
        e.addEventListener("progress", onprogress)),
        e.send()
    }
    function TextLoader(a, b, c) {
        var d = b && function (c, d) {
            d && d.responseText
                ? b(null, d.responseText)
                : b('TextLoader: "' + a + '" seems to be unreachable or the file is empty. InnerMessage: ' + c, null)
        };
        _LoadFromXHR(a, d, c)
    }
    function JsonLoader(a, b, c) {
        var d = b && function (c, d) {
            if (d && d.responseText) {
                var e;
                try {
                    e = JSON.parse(d.responseText)
                } catch (f) {
                    return void b(f, null)
                }
                b(null, e)
            } else 
                b('JsonLoader: "' + a + '" seems to be unreachable or the file is empty. InnerMessage: ' + c, null)
        };
        _LoadFromXHR(a, d, c)
    }
    function checkCompCtor(a, b) {
        if (a) {
            if (Fire.isChildClassOf(a, Component)) 
                return Fire.error(b + " Constructor can not be another Component"),
                !1;
            if (a.length > 0) 
                return Fire.error(b + " Can not instantiate Component with arguments."),
                !1
        }
        return !0
    }
    function ContainerStrategy() {}
    function ContentStrategy() {}
    var root = "undefined" != typeof global
            ? global
            : this,
        Fire = root.Fire || {},
        Editor = root.Editor || {},
        JS = Fire.JS,
        FObject = Fire.FObject,
        HashObject = Fire.HashObject,
        Asset = Fire.Asset,
        Vec2 = Fire.Vec2,
        v2 = Fire.v2,
        Matrix23 = Fire.Matrix23,
        Rect = Fire.Rect,
        Color = Fire.Color,
        Texture = Fire.Texture,
        Sprite = Fire.Sprite,
        Atlas = Fire.Atlas;
    Fire._throw = function (a) {
        Fire.error(a.stack)
    };
    var AssetsWatcher = {
        initComponent: function () {},
        start: function () {},
        stop: function () {}
    };
    Editor._AssetsWatcher = AssetsWatcher;
    var editorCallback = {
            onEnginePlayed: null,
            onEngineStopped: null,
            onEnginePaused: null,
            onEntityCreated: null,
            onEntityRemoved: null,
            onEntityParentChanged: null,
            onEntityIndexChanged: null,
            onEntityRenamed: null,
            onStartUnloadScene: null,
            onSceneLaunched: null,
            onComponentEnabled: null,
            onComponentDisabled: null,
            onComponentAdded: null,
            onComponentRemoved: null
        },
        Destroying = Fire._ObjectFlags.Destroying,
        DontDestroy = Fire._ObjectFlags.DontDestroy,
        Hide = Fire._ObjectFlags.Hide,
        HideInGame = Fire._ObjectFlags.HideInGame,
        HideInEditor = Fire._ObjectFlags.HideInEditor,
        ContentStrategyType = Fire.defineEnum({NoScale: -1, FixedHeight: -1});
    Fire.ContentStrategyType = ContentStrategyType;
    var __TESTONLY__ = {};
    Fire.__TESTONLY__ = __TESTONLY__,
    Fire._Runtime = {},
    JS.getset(Fire._Runtime, "RenderContext", function () {
        return RenderContext
    }, function (a) {
        RenderContext = a
    });
    var Time = function () {
        var a = {};
        a.time = 0,
        a.realTime = 0,
        a.deltaTime = 0,
        a.frameCount = 0,
        a.maxDeltaTime = .3333333;
        var b = 0,
            c = 0;
        return a._update = function (d, e) {
            if (!e) {
                var f = d - b;
                f = Math.min(a.maxDeltaTime, f),
                b = d,
                ++a.frameCount,
                a.deltaTime = f,
                a.time += f
            }
            a.realTime = d - c
        },
        a._restart = function (d) {
            a.time = 0,
            a.realTime = 0,
            a.deltaTime = 0,
            a.frameCount = 0,
            b = d,
            c = d
        },
        a
    }();
    Fire.Time = Time;
    var Event = function () {
        function a(a, b) {
            "undefined" == typeof b && (b = !1),
            this.type = a,
            this.target = null,
            this.currentTarget = null,
            this.eventPhase = 0,
            this.bubbles = b,
            this._defaultPrevented = !1,
            this._propagationStopped = !1,
            this._propagationImmediateStopped = !1
        }
        return a.NONE = 0,
        a.CAPTURING_PHASE = 1,
        a.AT_TARGET = 2,
        a.BUBBLING_PHASE = 3,
        a.prototype.stop = function (a) {
            this._propagationStopped = !0,
            a && (this._propagationImmediateStopped = !0)
        },
        a.prototype.preventDefault = function () {
            this._defaultPrevented = !0
        },
        a.prototype._reset = function () {
            this.target = null,
            this.currentTarget = null,
            this.eventPhase = 0,
            this._defaultPrevented = !1,
            this._propagationStopped = !1,
            this._propagationImmediateStopped = !1
        },
        a
    }();
    Fire.Event = Event;
    var EventListeners = function () {
            function a() {
                Fire
                    ._CallbacksHandler
                    .call(this)
            }
            return JS.extend(a, Fire._CallbacksHandler),
            a.prototype.invoke = function (a) {
                var b = this._callbackTable[a.type];
                if (b && b.length > 0) {
                    if (1 === b.length) 
                        return void b[0](a);
                    for (var c = b.length - 1, d = b[c], e = 0; c >= e; ++e) {
                        var f = b[e];
                        if (f(a), a._propagationImmediateStopped || e === c) 
                            break;
                        if (b[c] !== d) {
                            if (b[c - 1] !== d) 
                                return void Fire.error("Call event.stop(true) when you remove more than one callbacks in a event callbac" +
                                        "k.");
                            b[e] !== f && --e,
                            --c
                        }
                    }
                }
            },
            a
        }(),
        EventTarget = function () {
            function a() {
                HashObject.call(this),
                this._capturingListeners = null,
                this._bubblingListeners = null
            }
            JS.extend(a, HashObject),
            a.prototype.on = function (a, b, c) {
                if (c = "undefined" != typeof c
                    ? c
                    : !1, !b) 
                    return void Fire.error("Callback of event must be non-nil");
                var d = null;
                d = c
                    ? this._capturingListeners = this._capturingListeners || new EventListeners
                    : this._bubblingListeners = this._bubblingListeners || new EventListeners,
                d.has(a, b) || d.add(a, b)
            },
            a.prototype.off = function (a, b, c) {
                if (c = "undefined" != typeof c
                    ? c
                    : !1, b) {
                    var d = c
                        ? this._capturingListeners
                        : this._bubblingListeners;
                    d && d.remove(a, b)
                }
            },
            a.prototype.once = function (a, b, c) {
                var d = this,
                    e = function (f) {
                        d.off(a, e, c),
                        b(f)
                    };
                this.on(a, e, c)
            };
            var b = new Array(16);
            return b.length = 0,
            a.prototype._doDispatchEvent = function (a) {
                a.target = this,
                this._getCapturingTargets(a.type, b),
                a.eventPhase = 1;
                var c,
                    d;
                for (d = b.length - 1; d >= 0; --d) 
                    if (c = b[d], c.isValid && c._capturingListeners && (a.currentTarget = c, c._capturingListeners.invoke(a), a._propagationStopped)) 
                        return;
            if (b.length = 0, (!this.isValid || (this._doSendEvent(a), !a._propagationStopped)) && a.bubbles) 
                    for (this._getBubblingTargets(a.type, b), a.eventPhase = 3, d = 0; d < b.length; ++d) 
                        if (c = b[d], c.isValid && c._bubblingListeners && (a.currentTarget = c, c._bubblingListeners.invoke(a), a._propagationStopped)) 
                            return
            },
            a.prototype.dispatchEvent = function (a) {
                this._doDispatchEvent(a),
                b.length = 0;
                var c = !a._defaultPrevented;
                return a._reset(),
                c
            },
            a.prototype._doSendEvent = function (a) {
                a.eventPhase = 2,
                a.currentTarget = this,
                this._capturingListeners && (this._capturingListeners.invoke(a), a._propagationStopped) || this._bubblingListeners && this
                    ._bubblingListeners
                    .invoke(a)
            },
            a.prototype._getCapturingTargets = function (a, b) {},
            a.prototype._getBubblingTargets = function (a, b) {},
            a
        }();
    Fire.EventTarget = EventTarget;
    var Ticker = function () {
        var a = {},
            b = 60;
        return window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame,
        a.requestAnimationFrame = 60 === b && window.requestAnimationFrame
            ? function (a) {
                return window.requestAnimationFrame(a)
            }
            : function (a) {
                return window.setTimeout(a, 1e3 / b)
            },
        window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.msCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame,
        a.cancelAnimationFrame = window.cancelAnimationFrame
            ? function (a) {
                window.cancelAnimationFrame(a)
            }
            : function (a) {
                window.clearTimeout(a)
            },
        a.now = window.performance && window.performance.now
            ? function () {
                return window
                    .performance
                    .now() / 1e3
            }
            : function () {
                return Date.now() / 1e3
            },
        a
    }();
    __TESTONLY__.Ticker = Ticker;
    var RenderContext = function (a, b, c, d) {
        this._camera = null,
        this._size = Fire.v2(a, b),
        this._canvas = c || document.createElement("canvas")
    };
    RenderContext.initRenderer = function (a) {
        a._renderObj = null,
        a._renderObjInScene = null,
        a._tempMatrix = new Fire.Matrix23
    },
    Fire
        .JS
        .get(RenderContext.prototype, "canvas", function () {
            return this._canvas
        }),
    Fire
        .JS
        .getset(RenderContext.prototype, "size", function () {
            return this
                ._size
                .clone()
        }, function (a) {
            this._size = a.clone()
        }),
    Fire
        .JS
        .getset(RenderContext.prototype, "camera", function () {
            return this._camera
        }, function (a) {
            this._camera = a
        }),
    Fire
        .JS
        .mixin(RenderContext.prototype, {
            onSceneLoaded: function (a) {},
            onSceneLaunched: function (a) {},
            onEntityIndexChanged: function (a, b, c) {},
            onEntityParentChanged: function (a, b) {},
            onEntityRemoved: function (a) {},
            onRootEntityCreated: function (a) {},
            onEntityCreated: function (a, b) {},
            addSprite: function (a) {},
            show: function (a, b) {},
            remove: function (a) {},
            render: function () {},
            updateTransform: function (a, b) {},
            updateSpriteColor: function (a) {},
            updateMaterial: function (a) {},
            checkMatchCurrentScene: function () {}
        }),
    Fire._Runtime.RenderContext = RenderContext;
    var FireUrl = Fire.isNode
        ? require("fire-url")
        : null;
    Fire._JsonLoader = JsonLoader;
    var Component = function () {
        function call_FUNC_InTryCatch(a) {
            try {
                a._FUNC_()
            } catch (b) {
                Fire._throw(b)
            }
        }
        function _callOnEnable(a, b) {
            b
                ? a._objFlags & IsEditorOnEnabledCalled || (a._objFlags |= IsEditorOnEnabledCalled, editorCallback.onComponentEnabled && editorCallback.onComponentEnabled(a))
                : a._objFlags & IsEditorOnEnabledCalled && (a._objFlags &=~ IsEditorOnEnabledCalled, editorCallback.onComponentDisabled && editorCallback.onComponentDisabled(a)),
            (Fire.Engine.isPlaying || Fire.attr(a, "executeInEditMode")) && (b
                ? a._objFlags & IsOnEnableCalled || (a._objFlags |= IsOnEnableCalled, a.onEnable && callOnEnableInTryCatch(a))
                : a._objFlags & IsOnEnableCalled && (a._objFlags &=~ IsOnEnableCalled, a.onDisable && callOnDisableInTryCatch(a)))
        }
        var IsOnEnableCalled = Fire._ObjectFlags.IsOnEnableCalled,
            IsEditorOnEnabledCalled = Fire._ObjectFlags.IsEditorOnEnabledCalled,
            IsOnLoadCalled = Fire._ObjectFlags.IsOnLoadCalled,
            IsOnStartCalled = Fire._ObjectFlags.IsOnStartCalled,
            compCtor;
        compCtor = function () {
            Editor
                ._AssetsWatcher
                .initComponent(this)
        };
        var Component = Fire.extend("Fire.Component", HashObject, compCtor);
        Component.prop("entity", null, Fire.HideInInspector),
        Component.getset("_scriptUuid", function () {
            return this._cacheUuid || ""
        }, function (a) {
            if (this._cacheUuid !== a) 
                if (a && Editor.isUuid(a)) {
                    var b = Editor.compressUuid(a),
                        c = Fire
                            .JS
                            ._getClassById(b);
                    c
                        ? Fire.warn("Sorry, replacing component script is not yet implemented.")
                        : Fire.error('Can not find a component in the script which uuid is "%s".', a)
                } else 
                    Fire.error("invalid script")
        }, Fire.DisplayName("Script"), Fire._ScriptUuid),
        Component.prop("_enabled", !0, Fire.HideInInspector),
        Object.defineProperty(Component.prototype, "enabled", {
            get: function () {
                return this._enabled
            },
            set: function (a) {
                this._enabled != a && (this._enabled = a, this.entity._activeInHierarchy && _callOnEnable(this, a))
            }
        }),
        Object.defineProperty(Component.prototype, "enabledInHierarchy", {
            get: function () {
                return this._enabled && this.entity._activeInHierarchy
            }
        }),
        Object.defineProperty(Component.prototype, "transform", {
            get: function () {
                return this.entity.transform
            }
        }),
        Component.prototype.update = null,
        Component.prototype.lateUpdate = null,
        Component.prototype.onLoad = null,
        Component.prototype.start = null,
        Component.prototype.onEnable = null,
        Component.prototype.onDisable = null,
        Component.prototype.onDestroy = null,
        Component.prototype.onPreRender = null,
        Component.prototype.addComponent = function (a) {
            return this
                .entity
                .addComponent(a)
        },
        Component.prototype.getComponent = function (a) {
            return this
                .entity
                .getComponent(a)
        },
        Component.prototype.destroy = function () {
            FObject
                .prototype
                .destroy
                .call(this) && this._enabled && this.entity._activeInHierarchy && _callOnEnable(this, !1)
        };
        var execInTryCatchTmpl = "(" + call_FUNC_InTryCatch + ")",
            callOnEnableInTryCatch = eval(execInTryCatchTmpl.replace(/_FUNC_/g, "onEnable")),
            callOnDisableInTryCatch = eval(execInTryCatchTmpl.replace(/_FUNC_/g, "onDisable")),
            callOnLoadInTryCatch = eval(execInTryCatchTmpl.replace(/_FUNC_/g, "onLoad")),
            callOnStartInTryCatch = eval(execInTryCatchTmpl.replace(/_FUNC_/g, "start")),
            callOnDestroyInTryCatch = eval(execInTryCatchTmpl.replace(/_FUNC_/g, "onDestroy"));
        return Component.prototype._onEntityActivated = function (a) {
            this._objFlags & IsOnLoadCalled || !Fire.Engine.isPlaying && !Fire.attr(this, "executeInEditMode") || (this._objFlags |= IsOnLoadCalled, this.onLoad && callOnLoadInTryCatch(this), Editor._AssetsWatcher.start(this)),
            this._enabled && _callOnEnable(this, a)
        },
        Component._invokeStarts = function (a) {
            var b = a._components.length,
                c = 0,
                d = null;
            if (Fire.Engine.isPlaying) 
                for (; b > c; ++c) 
                    d = a._components[c],
                    d._objFlags & IsOnStartCalled || (d._objFlags |= IsOnStartCalled, d.start && callOnStartInTryCatch(d));
        else 
                for (; b > c; ++c) 
                    d = a._components[c],
                    d._objFlags & IsOnStartCalled || !Fire.attr(d, "executeInEditMode") || (d._objFlags |= IsOnStartCalled, d.start && callOnStartInTryCatch(d));
        for (var e = 0, f = a._children, g = f.length; g > e; ++e) {
                var h = f[e];
                h._active && Component._invokeStarts(h)
            }
        },
        Component.prototype._onPreDestroy = function () {
            _callOnEnable(this, !1),
            Editor
                ._AssetsWatcher
                .stop(this),
            (Fire.Engine.isPlaying || Fire.attr(this, "executeInEditMode")) && this.onDestroy && callOnDestroyInTryCatch(this),
            this
                .entity
                ._removeComponent(this)
        },
        Component
    }();
    Fire.Component = Component,
    Fire._componentMenuItems = [],
    Fire.addComponentMenu = function (a, b, c) {
        return Fire.isChildClassOf(a, Component)
            ? void Fire
                ._componentMenuItems
                .push({component: a, menuPath: b, priority: c})
            : void Fire.error("[Fire.addComponentMenu] constructor must inherit from Component")
    },
    Fire.attr(Component, "executeInEditMode", !1),
    Fire.executeInEditMode = function (a) {
        return Fire.isChildClassOf(a, Component)
            ? void Fire.attr(a, "executeInEditMode", !0)
            : void Fire.error("[Fire.executeInEditMode] constructor must inherit from Component")
    };
    var _requiringFrames = [];
    Fire._RFpush = function (a, b, c) {
        2 === arguments.length && (c = b, b = ""),
        _requiringFrames.push({uuid: b, script: c, module: a, exports: a.exports, comp: null})
    },
    Fire._RFpop = function () {
        var a = _requiringFrames.pop(),
            b = a.module,
            c = a.exports;
        if (c === b.exports) {
            for (var d in c) 
                return;
            b.exports = a.comp
        }
    },
    Fire._RFget = function () {
        return _requiringFrames[_requiringFrames.length - 1]
    };
    var doDefine = Fire._doDefine;
    Fire._doDefine = function (a, b, c) {
        if (Fire.isChildClassOf(b, Fire.Component)) {
            var d = Fire._RFget();
            if (d) {
                if (!checkCompCtor(c, "[Fire.extend]")) 
                    return null;
                if (d.comp) 
                    return void Fire.error("Sorry, each script can have at most one Component.");
                d.uuid && a && Fire.warn("Sorry, specifying class name for Component in project scripts is not allowed."),
                a = a || d.script;
                var e = doDefine(a, b, c);
                return d.uuid && JS._setClassId(d.uuid, e),
                d.comp = e,
                e
            }
        }
        return doDefine(a, b, c)
    };
    var Transform = function () {
        var a = Fire.extend("Fire.Transform", Component, function () {
            this._position = new Vec2(0, 0),
            this._scale = new Vec2(1, 1),
            this._worldTransform = new Matrix23,
            this._parent = null
        });
        Fire.executeInEditMode(a),
        a.prop("_position", null, Fire.HideInInspector),
        a.prop("_rotation", 0, Fire.HideInInspector),
        a.prop("_scale", null, Fire.HideInInspector);
        var b = "The %s must not be NaN";
        return a.getset("position", function () {
            return new Vec2(this._position.x, this._position.y)
        }, function (a) {
            var c = a.x,
                d = a.y;
            isNaN(c) || isNaN(d)
                ? Fire.error(b, "xy of new position")
                : (this._position.x = c, this._position.y = d)
        }, Fire.Tooltip("The local position in its parent's coordinate system")),
        Object.defineProperty(a.prototype, "x", {
            get: function () {
                return this._position.x
            },
            set: function (a) {
                isNaN(a)
                    ? Fire.error(b, "new x")
                    : (this._position.x = a, this._position = this._position)
            }
        }),
        Object.defineProperty(a.prototype, "y", {
            get: function () {
                return this._position.y
            },
            set: function (a) {
                isNaN(a)
                    ? Fire.error(b, "new y")
                    : (this._position.y = a, this._position = this._position)
            }
        }),
        Object.defineProperty(a.prototype, "worldPosition", {
            get: function () {
                var a = this.getLocalToWorldMatrix();
                return new Vec2(a.tx, a.ty)
            },
            set: function (a) {
                var c = a.x,
                    d = a.y;
                if (isNaN(c) || isNaN(d)) 
                    Fire.error(b, "xy of new worldPosition");
                else if (this._parent) {
                    var e = this
                        ._parent
                        .getWorldToLocalMatrix();
                    this.position = e.transformPoint(a)
                } else 
                    this.position = a
            }
        }),
        Object.defineProperty(a.prototype, "worldX", {
            get: function () {
                return this.worldPosition.x
            },
            set: function (a) {
                if (isNaN(a)) 
                    Fire.error(b, "new worldX");
                else {
                    if (this._parent) {
                        var c = this
                                ._parent
                                .getLocalToWorldMatrix(),
                            d = this
                                .getLocalMatrix()
                                .prepend(c);
                        d.tx !== a && (this._position.x = a, this._position.y = d.ty, c.invert().transformPoint(this._position, this._position))
                    } else 
                        this._position.x = a;
                    this._position = this._position
                }
            }
        }),
        Object.defineProperty(a.prototype, "worldY", {
            get: function () {
                return this.worldPosition.y
            },
            set: function (a) {
                if (isNaN(a)) 
                    Fire.error(b, "new worldY");
                else {
                    if (this._parent) {
                        var c = this
                                ._parent
                                .getLocalToWorldMatrix(),
                            d = this
                                .getLocalMatrix()
                                .prepend(c);
                        d.ty !== a && (this._position.x = d.tx, this._position.y = a, c.invert().transformPoint(this._position, this._position))
                    } else 
                        this._position.y = a;
                    this._position = this._position
                }
            }
        }),
        a.getset("rotation", function () {
            return this._rotation
        }, function (a) {
            isNaN(a)
                ? Fire.error(b, "new rotation")
                : this._rotation = a
        }, Fire.Tooltip("The counterclockwise degrees of rotation relative to the parent")),
        Object.defineProperty(a.prototype, "worldRotation", {
            get: function () {
                return this._parent
                    ? this.rotation + this._parent.worldRotation
                    : this.rotation
            },
            set: function (a) {
                isNaN(a)
                    ? Fire.error(b, "new worldRotation")
                    : this.rotation = this._parent
                        ? a - this._parent.worldRotation
                        : a
            }
        }),
        a.getset("scale", function () {
            return new Vec2(this._scale.x, this._scale.y)
        }, function (a) {
            var c = a.x,
                d = a.y;
            isNaN(c) || isNaN(d)
                ? Fire.error(b, "xy of new scale")
                : (this._scale.x = c, this._scale.y = d)
        }, Fire.Tooltip("The local scale factor relative to the parent")),
        Object.defineProperty(a.prototype, "scaleX", {
            get: function () {
                return this._scale.x
            },
            set: function (a) {
                isNaN(a)
                    ? Fire.error(b, "new scaleX")
                    : (this._scale.x = a, this._scale = this._scale)
            }
        }),
        Object.defineProperty(a.prototype, "scaleY", {
            get: function () {
                return this._scale.y
            },
            set: function (a) {
                isNaN(a)
                    ? Fire.error(b, "new scaleY")
                    : (this._scale.y = a, this._scale = this._scale)
            }
        }),
        Object.defineProperty(a.prototype, "worldScale", {
            get: function () {
                var a = this.getLocalToWorldMatrix();
                return a.getScale()
            }
        }),
        a.prototype.onLoad = function () {
            this._parent = this.entity._parent && this.entity._parent.transform
        },
        a.prototype.destroy = function () {
            Fire.error("Not allowed to destroy the transform. Please destroy the entity instead.")
        },
        a.prototype._updateTransform = function (a) {
            var b = this._worldTransform;
            this.getLocalMatrix(b),
            b.prepend(a);
            for (var c = this.entity._children, d = 0, e = c.length; e > d; d++) 
                c[d].transform._updateTransform(b)
        },
        a.prototype._updateRootTransform = function () {
            var a = this._worldTransform;
            this.getLocalMatrix(a);
            for (var b = this.entity._children, c = 0, d = b.length; d > c; c++) 
                b[c].transform._updateTransform(a)
        },
        a.prototype.getLocalMatrix = function (a) {
            a = a || new Matrix23;
            var b = .017453292519943295 * this._rotation,
                c = 0 === this._rotation
                    ? 0
                    : Math.sin(b),
                d = 0 === this._rotation
                    ? 1
                    : Math.cos(b);
            return a.a = this._scale.x * d,
            a.b = this._scale.x * c,
            a.c = this._scale.y * -c,
            a.d = this._scale.y * d,
            a.tx = this._position.x,
            a.ty = this._position.y,
            a
        },
        a.prototype.getLocalToWorldMatrix = function (a) {
            a = a || new Matrix23,
            this.getLocalMatrix(a);
            for (var b = new Fire.Matrix23, c = this._parent; null !== c; c = c._parent) 
                a.prepend(c.getLocalMatrix(b));
            return a
        },
        a.prototype.getWorldToLocalMatrix = function (a) {
            return this
                .getLocalToWorldMatrix(a)
                .invert()
        },
        a.prototype.rotateAround = function (a, b) {
            var c = this
                .worldPosition
                .subSelf(a);
            c.rotateSelf(Math.deg2rad(b)),
            this.worldPosition = a.addSelf(c),
            this.rotation = this._rotation + b
        },
        a.prototype.translate = function (a) {
            var b = a.rotate(Math.deg2rad(this._rotation));
            this.position = this
                ._position
                .add(b, b)
        },
        Object.defineProperty(a.prototype, "up", {
            get: function () {
                return new Vec2(0, 1).rotateSelf(Math.deg2rad(this.worldRotation))
            },
            set: function (a) {
                if (0 === a.x && 0 === a.y) 
                    return void Fire.warn("Can't get rotation from zero vector");
                var b = Math.atan2(a.y, a.x) - Math.HALF_PI;
                this.worldRotation = Math.rad2deg(b)
            }
        }),
        Object.defineProperty(a.prototype, "right", {
            get: function () {
                return new Vec2(1, 0).rotateSelf(Math.deg2rad(this.worldRotation))
            },
            set: function (a) {
                if (0 === a.x && 0 === a.y) 
                    return void Fire.warn("Can't get rotation from zero vector");
                var b = Math.atan2(a.y, a.x);
                this.worldRotation = Math.rad2deg(b)
            }
        }),
        a
    }();
    Fire.Transform = Transform;
    var Renderer = function () {
        function a(a, b, d, e, f) {
            var g = this.getWorldSize(),
                h = g.x,
                i = g.y;
            this.getSelfMatrix(c),
            a = c.prepend(a);
            var j = a.tx,
                k = a.ty,
                l = a.a * h,
                m = a.b * h,
                n = a.c * -i,
                o = a.d * -i;
            d.x = j,
            d.y = k,
            e.x = l + j,
            e.y = m + k,
            b.x = n + j,
            b.y = o + k,
            f.x = l + n + j,
            f.y = m + o + k
        }
        var b = Fire.extend("Fire.Renderer", Component),
            c = new Fire.Matrix23;
        return b.prototype.getWorldBounds = function (b) {
            var c = this
                    .entity
                    .transform
                    .getLocalToWorldMatrix(),
                d = new Vec2(0, 0),
                e = new Vec2(0, 0),
                f = new Vec2(0, 0),
                g = new Vec2(0, 0);
            return a.call(this, c, d, e, f, g),
            b = b || new Rect,
            Math.calculateMaxRect(b, d, e, f, g),
            b
        },
        b.prototype.getWorldOrientedBounds = function (b, c, d, e) {
            b = b || new Vec2(0, 0),
            c = c || new Vec2(0, 0),
            d = d || new Vec2(0, 0),
            e = e || new Vec2(0, 0);
            var f = this
                .entity
                .transform
                .getLocalToWorldMatrix();
            return a.call(this, f, b, c, d, e),
            [b, c, d, e]
        },
        b.prototype.getSelfMatrix = function (a) {},
        b.prototype.getWorldSize = function () {
            return new Vec2(0, 0)
        },
        b
    }();
    Fire.Renderer = Renderer;
    var SpriteRenderer = function () {
        var a = Fire.extend("Fire.SpriteRenderer", Renderer, function () {
            RenderContext.initRenderer(this),
            this._hasRenderObj = !1
        });
        Fire.addComponentMenu(a, "SpriteRenderer"),
        Fire.executeInEditMode(a),
        a.prop("_sprite", null, Fire.HideInInspector),
        a.getset("sprite", function () {
            return this._sprite
        }, function (a) {
            this._sprite = a,
            this._hasRenderObj && Engine
                ._renderContext
                .updateMaterial(this)
        }, Fire.ObjectType(Fire.Sprite)),
        a.prop("_color", new Fire.Color(1, 1, 1, 1), Fire.HideInInspector),
        a.getset("color", function () {
            return this._color
        }, function (a) {
            this._color = a,
            this._hasRenderObj && Engine
                ._renderContext
                .updateSpriteColor(this)
        }),
        a.prop("customSize_", !1, Fire.HideInInspector),
        a.getset("customSize", function () {
            return this.customSize_
        }, function (a) {
            this.customSize_ = a
        }),
        a.prop("width_", 100, Fire.DisplayName("Width"), Fire.Watch("customSize_", function (a, b) {
            b.disabled = !a.customSize_
        })),
        a.getset("width", function () {
            return this.customSize_
                ? this.width_
                : Fire.isValid(this._sprite)
                    ? this._sprite.width
                    : 0
        }, function (a) {
            this.width_ = a
        }, Fire.HideInInspector),
        a.prop("height_", 100, Fire.DisplayName("Height"), Fire.Watch("customSize_", function (a, b) {
            b.disabled = !a.customSize
        })),
        a.getset("height", function () {
            return this.customSize_
                ? this.height_
                : Fire.isValid(this._sprite)
                    ? this._sprite.height
                    : 0
        }, function (a) {
            this.height_ = a
        }, Fire.HideInInspector),
        a.prototype.onLoad = function () {
            Engine
                ._renderContext
                .addSprite(this),
            this._hasRenderObj = !0
        },
        a.prototype.onEnable = function () {
            Engine
                ._renderContext
                .show(this, !0)
        },
        a.prototype.onDisable = function () {
            Engine
                ._renderContext
                .show(this, !1)
        },
        a.prototype.getWorldSize = function () {
            return new Fire.Vec2(this.width, this.height)
        };
        var b = new Fire.Matrix23;
        return a.prototype.onPreRender = function () {
            this.getSelfMatrix(b),
            this._sprite && (b.a = this.width / this._sprite.width, b.d = this.height / this._sprite.height, this._sprite.rotated && (b.b = b.d, b.c = -b.a, b.a = 0, b.d = 0, b.ty -= this.height)),
            b.prepend(this.transform._worldTransform),
            Engine
                ._curRenderContext
                .updateTransform(this, b)
        },
        a.prototype.onDestroy = function () {
            Engine
                ._renderContext
                .remove(this)
        },
        a.prototype.getSelfMatrix = function (a) {
            var b = this.width,
                c = this.height,
                d = .5,
                e = .5;
            Fire.isValid(this._sprite) && (d = this._sprite.pivot.x, e = this._sprite.pivot.y),
            a.a = 1,
            a.b = 0,
            a.c = 0,
            a.d = 1,
            a.tx = -d * b,
            a.ty = (1 - e) * c
        },
        a
    }();
    Fire.SpriteRenderer = SpriteRenderer;
    var BitmapText = function () {
        var a = Fire.extend("Fire.BitmapText", Renderer, function () {
            RenderContext.initRenderer(this)
        });
        Fire.addComponentMenu(a, "BitmapText"),
        Fire.executeInEditMode(a),
        a.prop("_bitmapFont", null, Fire.HideInInspector),
        a.getset("bitmapFont", function () {
            return this._bitmapFont
        }, function (a) {
            this._bitmapFont = a,
            Engine
                ._renderContext
                .updateBitmapFont(this)
        }, Fire.ObjectType(Fire.BitmapFont)),
        a.prop("_text", "Text", Fire.HideInInspector),
        a.getset("text", function () {
            return this._text
        }, function (a) {
            this._text !== a && (this._text = "string" == typeof a
                ? a
                : "" + a, Engine._renderContext.setText(this, this._text))
        }, Fire.MultiText),
        a.prop("_anchor", Fire.TextAnchor.midCenter, Fire.HideInInspector),
        a.getset("anchor", function () {
            return this._anchor
        }, function (a) {
            this._anchor !== a && (this._anchor = a)
        }, Fire.Enum(Fire.TextAnchor)),
        a.prop("_align", Fire.TextAlign.left, Fire.HideInInspector),
        a.getset("align", function () {
            return this._align
        }, function (a) {
            this._align !== a && (this._align = a, Engine._renderContext.setAlign(this, a))
        }, Fire.Enum(Fire.TextAlign)),
        a.prototype.onLoad = function () {
            Engine
                ._renderContext
                .addBitmapText(this)
        },
        a.prototype.onEnable = function () {
            Engine
                ._renderContext
                .show(this, !0)
        },
        a.prototype.onDisable = function () {
            Engine
                ._renderContext
                .show(this, !1)
        },
        a.prototype.onDestroy = function () {
            Engine
                ._renderContext
                .remove(this)
        },
        a.prototype.getWorldSize = function () {
            return Engine
                ._renderContext
                .getTextSize(this)
        };
        var b = new Fire.Matrix23;
        return a.prototype.onPreRender = function () {
            this.getSelfMatrix(b),
            b.prepend(this.transform._worldTransform),
            RenderContext.updateBitmapTextTransform(this, b)
        },
        a.prototype.getSelfMatrix = function (a) {
            var b = Engine
                    ._renderContext
                    .getTextSize(this),
                c = b.x,
                d = b.y,
                e = 0,
                f = 0;
            switch (this._anchor) {
                case Fire.TextAnchor.topLeft:
                    break;
                case Fire.TextAnchor.topCenter:
                    e = c * -.5;
                    break;
                case Fire.TextAnchor.topRight:
                    e = -c;
                    break;
                case Fire.TextAnchor.midLeft:
                    f = .5 * d;
                    break;
                case Fire.TextAnchor.midCenter:
                    e = c * -.5,
                    f = .5 * d;
                    break;
                case Fire.TextAnchor.midRight:
                    e = -c,
                    f = .5 * d;
                    break;
                case Fire.TextAnchor.botLeft:
                    f = d;
                    break;
                case Fire.TextAnchor.botCenter:
                    e = c * -.5,
                    f = d;
                    break;
                case Fire.TextAnchor.botRight:
                    e = -c,
                    f = d
            }
            a.a = 1,
            a.b = 0,
            a.c = 0,
            a.d = 1,
            a.tx = e,
            a.ty = f
        },
        a
    }();
    Fire.BitmapText = BitmapText;
    var Text = function () {
        var a = Fire.defineEnum({Arial: -1, Custom: -1}),
            b = new Fire.Matrix23,
            c = Fire.Class({
                name: "Fire.Text",
                "extends": Renderer,
                constructor: function () {
                    RenderContext.initRenderer(this)
                },
                properties: {
                    _fontType: {
                        "default": a.Arial,
                        type: a
                    },
                    fontType: {
                        get: function () {
                            return this._fontType
                        },
                        set: function (a) {
                            this._fontType = a,
                            Engine
                                ._renderContext
                                .setTextStyle(this)
                        },
                        type: a
                    },
                    _customFontType: "Arial",
                    customFontType: {
                        get: function () {
                            return this._customFontType
                        },
                        set: function (a) {
                            this._customFontType = a,
                            Engine
                                ._renderContext
                                .setTextStyle(this)
                        },
                        watch: {
                            _fontType: function (b, c) {
                                c.disabled = b._fontType !== a.Custom
                            }
                        }
                    },
                    _text: "text",
                    text: {
                        get: function () {
                            return this._text
                        },
                        set: function (a) {
                            this._text = a,
                            Engine
                                ._renderContext
                                .setTextContent(this, this._text)
                        },
                        multiline: !0
                    },
                    _size: 30,
                    size: {
                        get: function () {
                            return this._size
                        },
                        set: function (a) {
                            a !== this._size && a > 0 && (this._size = a, Engine._renderContext.setTextStyle(this))
                        }
                    },
                    _color: Fire.Color.white,
                    color: {
                        get: function () {
                            return this._color
                        },
                        set: function (a) {
                            this._color = a,
                            Engine
                                ._renderContext
                                .setTextStyle(this)
                        }
                    },
                    _align: Fire.TextAlign.left,
                    align: {
                        get: function () {
                            return this._align
                        },
                        set: function (a) {
                            this._align = a,
                            Engine
                                ._renderContext
                                .setTextStyle(this)
                        },
                        type: Fire.TextAlign
                    },
                    _anchor: Fire.TextAnchor.midCenter,
                    anchor: {
                        get: function () {
                            return this._anchor
                        },
                        set: function (a) {
                            a !== this._anchor && (this._anchor = a)
                        },
                        type: Fire.TextAnchor
                    }
                },
                onLoad: function () {
                    Engine
                        ._renderContext
                        .addText(this)
                },
                onEnable: function () {
                    Engine
                        ._renderContext
                        .show(this, !0)
                },
                onDisable: function () {
                    Engine
                        ._renderContext
                        .show(this, !1)
                },
                onDestroy: function () {
                    Engine
                        ._renderContext
                        .remove(this)
                },
                getWorldSize: function () {
                    return Engine
                        ._renderContext
                        .getTextSize(this)
                },
                getSelfMatrix: function (a) {
                    var b = Engine
                            ._renderContext
                            .getTextSize(this),
                        c = b.x,
                        d = b.y,
                        e = 0,
                        f = 0;
                    switch (this._anchor) {
                        case Fire.TextAnchor.topLeft:
                            break;
                        case Fire.TextAnchor.topCenter:
                            e = c * -.5;
                            break;
                        case Fire.TextAnchor.topRight:
                            e = -c;
                            break;
                        case Fire.TextAnchor.midLeft:
                            f = .5 * d;
                            break;
                        case Fire.TextAnchor.midCenter:
                            e = c * -.5,
                            f = .5 * d;
                            break;
                        case Fire.TextAnchor.midRight:
                            e = -c,
                            f = .5 * d;
                            break;
                        case Fire.TextAnchor.botLeft:
                            f = d;
                            break;
                        case Fire.TextAnchor.botCenter:
                            e = c * -.5,
                            f = d;
                            break;
                        case Fire.TextAnchor.botRight:
                            e = -c,
                            f = d
                    }
                    a.a = 1,
                    a.b = 0,
                    a.c = 0,
                    a.d = 1,
                    a.tx = e,
                    a.ty = f
                },
                onPreRender: function () {
                    this.getSelfMatrix(b),
                    b.prepend(this.transform._worldTransform),
                    RenderContext.updateTextTransform(this, b)
                }
            });
        return c.FontType = a,
        Fire.addComponentMenu(c, "Text"),
        Fire.executeInEditMode(c),
        c
    }();
    Fire.Text = Text;
    var Camera = Fire.Class({
        name: "Fire.Camera",
        "extends": Component,
        constructor: function () {
            this._renderContext = null,
            this._contentStrategyInst = null
        },
        properties: {
            _background: Fire.Color.black,
            background: {
                get: function () {
                    return this._background
                },
                set: function (a) {
                    this._background = a,
                    this._renderContext && (this._renderContext.background = a)
                }
            },
            _size: 800,
            size: {
                get: function () {
                    return this._size
                },
                set: function (a) {
                    this._size = a
                },
                tooltip: "The height of design resolution. Width varies depending on viewport's aspect rat" +
                        "io",
                watch: {
                    _contentStrategy: function (a, b) {
                        b.disabled = a._contentStrategy === Fire.ContentStrategyType.NoScale
                    }
                }
            },
            _contentStrategy: Fire.ContentStrategyType.FixedHeight,
            contentStrategy: {
                type: Fire.ContentStrategyType,
                get: function () {
                    return this._contentStrategy
                },
                set: function (a) {
                    this._contentStrategy = a,
                    this._contentStrategyInst = Fire
                        .Screen
                        .ContentStrategy
                        .fromType(a)
                },
                displayName: "Scale Strategy",
                tooltip: "The type of scale strategy for this camera"
            },
            viewportInfo: {
                get: function (a) {
                    var b = (this._renderContext || Engine._renderContext).size;
                    return this
                        ._contentStrategyInst
                        .apply(new Vec2(0, this._size), b)
                },
                visible: !1
            },
            renderContext: {
                set: function (a) {
                    this._renderContext = a
                },
                visible: !1
            }
        },
        onLoad: function () {
            this.entity._objFlags & HideInGame || (this.renderContext = Engine._renderContext),
            this._contentStrategyInst = Fire
                .Screen
                .ContentStrategy
                .fromType(this._contentStrategy)
        },
        onEnable: function () {
            this.entity._objFlags & HideInGame || (Engine._scene.camera = this, this._applyRenderSettings())
        },
        onDisable: function () {
            Engine._scene.camera === this && (Engine._scene.camera = null),
            this._renderContext && (this._renderContext.camera = null)
        },
        viewportToScreen: function (a, b) {
            return this._renderContext
                ? b = this
                    ._renderContext
                    .size
                    .scale(a, b)
                : void Fire.error("Camera not yet inited.")
        },
        screenToViewport: function (a, b) {
            if (b = b || new Vec2, !this._renderContext) 
                return void Fire.error("Camera not yet inited.");
            var c = this._renderContext.size;
            return b.x = a.x / c.x,
            b.y = a.y / c.y,
            b
        },
        viewportToWorld: function (a, b) {
            return b = this.viewportToScreen(a, b),
            this.screenToWorld(b, b)
        },
        screenToWorld: function (a, b) {
            var c = (this._renderContext || Engine._renderContext)
                    .size
                    .mul(.5),
                d = a.sub(c, c);
            d.y = -d.y;
            var e = new Matrix23,
                f = new Vec2;
            return this._calculateTransform(e, f),
            e.invert(),
            e.tx = f.x,
            e.ty = f.y,
            e.transformPoint(d, b)
        },
        worldToScreen: function (a, b) {
            var c = new Matrix23,
                d = new Vec2;
            this._calculateTransform(c, d);
            var e = a.sub(d, d);
            b = c.transformPoint(e, b);
            var f = (this._renderContext || Engine._renderContext).size.y;
            return b.y = f - b.y,
            b
        },
        worldToViewport: function (a, b) {
            return b = this.worldToScreen(a, b),
            this.screenToViewport(b, b)
        },
        _calculateTransform: function (a, b) {
            var c = this.viewportInfo,
                d = c.scale,
                e = c.viewport,
                f = this.entity.transform,
                g = f.getLocalToWorldMatrix();
            b.x = g.tx,
            b.y = g.ty,
            a.identity(),
            a.tx = .5 * e.width,
            a.ty = .5 * e.height,
            a.a = d.x,
            a.d = d.y,
            a.rotate(g.getRotation())
        },
        _applyRenderSettings: function () {
            return this._renderContext
                ? void(this._renderContext.background = this._background)
                : void Fire.error("No corresponding render context for camera " + this.entity.name)
        }
    });
    Fire.addComponentMenu(Camera, "Camera"),
    Fire.executeInEditMode(Camera),
    Fire.Camera = Camera;
    var MissingScript = function () {
        var a = Fire.extend("Fire.MissingScript", Component);
        return a.prototype.onLoad = function () {
            Fire.warn("The referenced script on this Component is missing!")
        },
        a
    }();
    Fire._MissingScript = MissingScript;
    var InteractionContext = function () {
        function a() {
            this.entities = []
        }
        var b = {},
            c = {};
        return a.prototype._clear = function () {
            this.entities.length = 0
        },
        a.prototype.pick = function (a) {
            for (var d = this.entities.length - 1; d >= 0; --d) {
                var e = this.entities[d];
                if (e.isValid) {
                    var f = b[e.id];
                    if (f.contains(a)) {
                        var g = c[e.id],
                            h = new Fire.Polygon(g);
                        if (h.contains(a)) 
                            return e
                    }
                }
            }
            return null
        },
        a.prototype._updateRecursilvey = function (a) {
            var d = a.getComponent(Fire.Renderer);
            if (d && d._enabled) {
                this
                    .entities
                    .push(a);
                var e = a.id;
                if (!c[e]) {
                    var f = d.getWorldOrientedBounds(),
                        g = Math.calculateMaxRect(new Rect, f[0], f[1], f[2], f[3]);
                    c[e] = f,
                    b[e] = g
                }
            }
            for (var h = 0, i = a._children.length; i > h; ++h) {
                var j = a._children[h];
                j._active && this._updateRecursilvey(j)
            }
        },
        a.prototype.update = function (a) {
            var d = !Engine.isPlaying || this === Engine._interactionContext;
            d && (b = {}, c = {}),
            this._clear();
            for (var e = 0, f = a.length; f > e; ++e) {
                var g = a[e];
                g._active && this._updateRecursilvey(g)
            }
        },
        a.prototype.getAABB = function (a) {
            return b[a.id]
        },
        a.prototype.getOBB = function (a) {
            return c[a.id]
        },
        a
    }();
    Fire._InteractionContext = InteractionContext;
    var Entity = Fire.Class({
        name: "Fire.Entity",
        "extends": EventTarget,
        constructor: function () {
            var a = arguments[0];
            if (this._name = "undefined" != typeof a
                ? a
                : "New Entity", this._objFlags |= Entity._defaultFlags, Fire._isCloning) 
                this._activeInHierarchy = !1;
            else {
                this._activeInHierarchy = !0;
                var b = new Transform;
                b.entity = this,
                this._components = [b],
                this.transform = b,
                Engine._scene && Engine
                    ._scene
                    .appendRoot(this),
                Engine._canModifyCurrentScene && (Engine._renderContext.onRootEntityCreated(this), b._onEntityActivated(!0), editorCallback.onEntityCreated && editorCallback.onEntityCreated(this), editorCallback.onComponentAdded && editorCallback.onComponentAdded(this, b))
            }
        },
        properties: {
            name: {
                get: function () {
                    return this._name
                },
                set: function (a) {
                    this._name = a,
                    editorCallback.onEntityRenamed && editorCallback.onEntityRenamed(this)
                }
            },
            active: {
                get: function () {
                    return this._active
                },
                set: function (a) {
                    if (this._active != a) {
                        this._active = a;
                        var b = !this._parent || this._parent._activeInHierarchy;
                        b && this._onActivatedInHierarchy(a)
                    }
                }
            },
            activeInHierarchy: {
                get: function () {
                    return this._activeInHierarchy
                }
            },
            transform: {
                "default": null,
                visible: !1
            },
            parent: {
                get: function () {
                    return this._parent
                },
                set: function (a) {
                    if (this._parent !== a) {
                        if (a === this) 
                            return void Fire.warn("A entity can't be set as the parent of itself.");
                        if (a && !(a instanceof Entity)) 
                            return void Fire.error(a instanceof Transform
                                ? "Entity.parent can not be a Transform, use transform.entity instead."
                                : "Entity.parent must be instance of Entity (or must be null)");
                        var b = this._parent;
                        if (a) {
                            if (a._objFlags & HideInGame && !(this._objFlags & HideInGame)) 
                                return void Fire.error("Failed to set parent, the child's HideInGame must equals to parent's.");
                            if (a._objFlags & HideInEditor && !(this._objFlags & HideInEditor)) 
                                return void Fire.error("Failed to set parent, the child's HideInEditor must equals to parent's.");
                            b || Engine
                                ._scene
                                .removeRoot(this),
                            a
                                ._children
                                .push(this)
                        } else 
                            Engine
                                ._scene
                                .appendRoot(this);
                        this._parent = a || null,
                        this.transform._parent = this._parent && this._parent.transform,
                        !b || b._objFlags & Destroying || (b._children.splice(b._children.indexOf(this), 1), this._onHierarchyChanged(b)),
                        Engine
                            ._renderContext
                            .onEntityParentChanged(this, b),
                        editorCallback.onEntityParentChanged && editorCallback.onEntityParentChanged(this)
                    }
                }
            },
            childCount: {
                get: function () {
                    return this._children.length
                },
                visible: !1
            },
            dontDestroyOnLoad: {
                get: function () {
                    return !!(this._objFlags | DontDestroy)
                },
                set: function (a) {
                    a
                        ? this._objFlags |= DontDestroy
                        : this._objFlags &=~ DontDestroy
                }
            },
            _active: !0,
            _parent: null,
            _children: [],
            _components: null
        },
        destroy: function () {
            FObject
                .prototype
                .destroy
                .call(this) && this._activeInHierarchy && this._deactivateChildComponents()
        },
        _onPreDestroy: function () {
            var a = this._parent;
            this._objFlags |= Destroying;
            var b = !(a && a._objFlags & Destroying);
            b && (Engine._renderContext.onEntityRemoved(this), editorCallback.onEntityRemoved && editorCallback.onEntityRemoved(this));
            for (var c = 0; c < this._components.length; ++c) {
                var d = this._components[c];
                d._destroyImmediate()
            }
            a
                ? b && a
                    ._children
                    .splice(a._children.indexOf(this), 1)
                : Engine
                    ._scene
                    .removeRoot(this);
            for (var e = this._children, f = 0, g = e.length; g > f; ++f) 
                e[f]._destroyImmediate()
        },
        _getCapturingTargets: function (a, b) {
            for (var c = this._parent; c; c = c._parent) 
                c._activeInHierarchy && c._capturingListeners && c._capturingListeners.has(a) && b.push(c)
        },
        _getBubblingTargets: function (a, b) {
            for (var c = this._parent; c; c = c._parent) 
                c._activeInHierarchy && c._bubblingListeners && c._bubblingListeners.has(a) && b.push(c)
        },
        _doSendEvent: function (a) {
            this._activeInHierarchy && Entity
                .$super
                .prototype
                ._doSendEvent
                .call(this, a)
        },
        addComponent: function (a) {
            var b;
            if ("string" == typeof a) {
                if (b = JS.getClassByName(a), !b) 
                    return Fire.error('[addComponent] Failed to get class "%s"'),
                    _requiringFrames.length > 0 && Fire.error("You should not add component when the scripts are still loading.", a),
                    null
            } else {
                if (!a) 
                    return Fire.error("[addComponent] Type must be non-nil"),
                    null;
                b = a
            }
            if (this._objFlags & Destroying) 
                return Fire.error("isDestroying"),
                null;
            if ("function" != typeof b) 
                return Fire.error("The component to add must be a constructor"),
                null;
            var c = new b;
            return c.entity = this,
            this
                ._components
                .push(c),
            this._activeInHierarchy && c._onEntityActivated(!0),
            editorCallback.onComponentAdded && editorCallback.onComponentAdded(this, c),
            c
        },
        getComponent: function (a) {
            if (!a) 
                return void Fire.error("Argument must be non-nil");
            var b;
            b = "string" == typeof a
                ? JS.getClassByName(a)
                : a;
            for (var c = 0; c < this._components.length; ++c) {
                var d = this._components[c];
                if (d instanceof b) 
                    return d
            }
            return null
        },
        _removeComponent: function (a) {
            if (!(this._objFlags & Destroying)) {
                var b = this
                    ._components
                    .indexOf(a);
                -1 !== b
                    ? (this._components.splice(b, 1), a.entity = null, editorCallback.onComponentRemoved && editorCallback.onComponentRemoved(this, a))
                    : a.entity !== this && Fire.error("Component not owned by this entity")
            }
        },
        find: function (a) {
            if (!a && "" !== a) 
                return void Fire.error("Argument must be non-nil");
            if ("/" === a[0]) 
                return void Fire.error("Path should not start with a '/' character, please use \"Fire.Entity.find\" inst" +
                        "ead");
            for (var b = a.split("/"), c = this, d = 0, e = 0, f = null, g = null, h = 0; h < b.length; h++) {
                var i = b[h];
                if (".." === i) {
                    if (!c) 
                        return null;
                    c = c._parent
                } else {
                    for (f = c
                        ? c._children
                        : Engine._scene.entities, c = null, d = 0, e = f.length; e > d; ++d) 
                        g = f[d],
                        g.name === i && (c = g);
                    if (!c) 
                        return null
                }
            }
            return c
        },
        getChild: function (a) {
            return this._children[a]
        },
        getChildren: function () {
            return this
                ._children
                .slice()
        },
        isChildOf: function (a) {
            var b = this;
            do 
                {
                    if(b === a) 
                        return !0;
            b = b._parent
            } while (b);
            return !1
        },
        getSiblingIndex: function () {
            return this._parent
                ? this
                    ._parent
                    ._children
                    .indexOf(this)
                : Engine
                    ._scene
                    .entities
                    .indexOf(this)
        },
        getSibling: function (a) {
            return this._parent
                ? this._parent._children[a]
                : Engine._scene.entities[a]
        },
        setSiblingIndex: function (a) {
            var b = this._parent
                    ? this._parent._children
                    : Engine._scene.entities,
                c = this;
            a = -1 !== a
                ? a
                : b.length - 1;
            var d = b.indexOf(c);
            a !== d && (b.splice(d, 1), a < b.length
                ? b.splice(a, 0, c)
                : b.push(c), Engine._renderContext.onEntityIndexChanged(this, d, a), editorCallback.onEntityIndexChanged && editorCallback.onEntityIndexChanged(this, d, a))
        },
        setAsFirstSibling: function () {
            this.setSiblingIndex(0)
        },
        setAsLastSibling: function () {
            this.setSiblingIndex(-1)
        },
        _onActivatedInHierarchy: function (a) {
            this._activeInHierarchy = a;
            for (var b = this._components.length, c = 0; b > c; ++c) {
                var d = this._components[c];
                d._onEntityActivated(a)
            }
            for (var e = 0, f = this.childCount; f > e; ++e) {
                var g = this._children[e];
                g._active && g._onActivatedInHierarchy(a)
            }
        },
        _deactivateChildComponents: function () {
            for (var a = this._components.length, b = 0; a > b; ++b) {
                var c = this._components[b];
                c._onEntityActivated(!1)
            }
            for (var d = 0, e = this.childCount; e > d; ++d) {
                var f = this._children[d];
                f._active && f._deactivateChildComponents()
            }
        },
        _onHierarchyChanged: function (a) {
            var b = this._active && (!a || a._activeInHierarchy),
                c = this._active && (!this._parent || this._parent._activeInHierarchy);
            b !== c && this._onActivatedInHierarchy(c)
        },
        _instantiate: function (a, b) {
            var c = this._parent;
            this._parent = null;
            var d = Fire._doInstantiate(this);
            return this._parent = c,
            Engine.isPlaying && (d._name = this._name + "(Clone)"),
            a && (d.transform._position = a),
            b && (d.transform._rotation = b),
            Engine._scene && Engine
                ._scene
                .appendRoot(d),
            Engine
                ._renderContext
                .onEntityCreated(d, !0),
            editorCallback.onEntityCreated && editorCallback.onEntityCreated(d),
            d._active && d._onActivatedInHierarchy(!0),
            d
        }
    });
    Entity._defaultFlags = 0,
    Entity.find = function (a) {
        return a || "" === a
            ? "/" !== a[0]
                ? (Fire.error("Path must start with a '/' character"), null)
                : Engine
                    ._scene
                    .findEntity(a)
            : (Fire.error("Argument must be non-nil"), null)
    },
    Fire.Entity = Entity;
    var Scene = function () {
        function execInTryCatch(a) {
            try {
                a._FUNC_()
            } catch (b) {
                Fire._throw(b)
            }
        }
        var Scene = Fire.Class({
                name: "Fire.Scene",
                "extends": Asset,
                properties: {
                    entities: [],
                    camera: null
                }
            }),
            visitOperationTmpl = "if(c._enabled && c._FUNC_) c._FUNC_();";
        visitOperationTmpl = "if (c._enabled && c._FUNC_ &&    (Fire.Engine.isPlaying || Fire.attr(c,'executeI" +
                "nEditMode')) ) {    execInTryCatch(c);}";
        var visitFunctionTmpl = "(function(e){	var i, len=e._components.length;	for(i=0;i<len;++i){		var c=e._com" +
                "ponents[i];		" + visitOperationTmpl + "	}	var cs=e._children;	for(i=0,len=cs.length;i<len;++i){		var sub=cs[i];		if(sub" +
                "._active) _FUNC_Recursively(sub);	}})";
        visitFunctionTmpl = "(function () {" + execInTryCatch + "return " + visitFunctionTmpl + "})()";
        var updateRecursively = eval(visitFunctionTmpl.replace(/_FUNC_/g, "update")),
            lateUpdateRecursively = eval(visitFunctionTmpl.replace(/_FUNC_/g, "lateUpdate")),
            onPreRenderRecursively = eval(visitFunctionTmpl.replace(/_FUNC_/g, "onPreRender"));
        return Scene.prototype.update = function () {
            for (var a = this.entities, b = 0, c = a.length; c > b; ++b) 
                Component._invokeStarts(a[b]);
            for (b = 0, c = a.length; c > b; ++b) 
                a[b]._active && updateRecursively(a[b]);
            for (b = 0, c = a.length; c > b; ++b) 
                a[b]._active && lateUpdateRecursively(a[b])
        },
        Scene.prototype.render = function (a) {
            Engine._curRenderContext = a,
            this.updateTransform(a.camera || this.camera);
            for (var b = this.entities, c = 0, d = b.length; d > c; ++c) 
                b[c]._active && onPreRenderRecursively(b[c]);
            a.render(),
            Engine._curRenderContext = null
        },
        Scene.prototype.updateTransform = function (a) {
            var b = this.entities,
                c,
                d;
            if (a) {
                var e = new Matrix23,
                    f = new Vec2;
                a._calculateTransform(e, f);
                var g = -f.x,
                    h = -f.y;
                for (c = 0, d = b.length; d > c; ++c) {
                    var i = b[c].transform._position,
                        j = i.x,
                        k = i.y;
                    i.x += g,
                    i.y += h,
                    b[c]
                        .transform
                        ._updateTransform(e),
                    i.x = j,
                    i.y = k
                }
            } else 
                for (c = 0, d = b.length; d > c; ++c) 
                    b[c].transform._updateRootTransform()
        },
        Scene.prototype.appendRoot = function (a) {
            this
                .entities
                .push(a)
        },
        Scene.prototype.removeRoot = function (a) {
            var b = this.entities;
            if (b.length > 0 && b[b.length - 1] === a) 
                return void b.pop();
            var c = b.indexOf(a);
            -1 !== c
                ? b.splice(c, 1)
                : Fire.error("entity " + a + " not contains in roots of hierarchy, is may caused if entity not destroyed immed" +
                        "iate before current scene changed")
        },
        Scene.prototype.findEntity = function (a) {
            for (var b = a.split("/"), c = null, d = b[1], e = this.entities, f = 0; f < e.length; f++) 
                if (e[f].isValid && e[f]._name === d) {
                    c = e[f];
                    break
                }
            if (!c) 
                return null;
            var g = 2;
            for (g; g < b.length; g++) {
                d = b[g];
                var h = c._children;
                c = null;
                for (var i = 0, j = h.length; j > i; ++i) {
                    var k = h[i];
                    if (k.name === d) {
                        c = k;
                        break
                    }
                }
                if (!c) 
                    return null
            }
            return c
        },
        Scene.prototype.activate = function () {
            for (var a = this.entities, b = 0, c = a.length; c > b; ++b) {
                var d = a[b];
                d._active && d._onActivatedInHierarchy(!0)
            }
            if (Engine.isPlaying) 
                for (b = 0, c = a.length; c > b; ++b) 
                    Component._invokeStarts(a[b])
        },
        Scene.prototype.destroy = function () {
            for (var a = this.entities, b = 0, c = a.length; c > b; ++b) {
                var d = a[b];
                d.isValid && (d._objFlags & DontDestroy
                    ? Engine._dontDestroyEntities.push(d)
                    : d.destroy())
            }
            Asset
                .prototype
                .destroy
                .call(this)
        },
        Scene
    }();
    Fire._Scene = Scene;
    var LoadManager = function () {
        function a() {
            return {
                image: {
                    loader: ImageLoader,
                    defaultExtname: ".host"
                },
                json: {
                    loader: JsonLoader,
                    defaultExtname: ".json"
                },
                text: {
                    loader: TextLoader,
                    defaultExtname: ".txt"
                }
            }
        }
        function b(a, b, c) {
            f._curConcurrent += 1,
            a(b, function d(a, b) {
                c(a, b),
                f._curConcurrent = Math.max(0, f._curConcurrent - 1),
                e()
            })
        }
        var c = new Fire.CallbacksInvoker,
            d = [],
            e = function () {
                if (f._curConcurrent >= f.maxConcurrent) 
                    return void Fire.error("too many concurrent requests");
                var a = d.pop();
                a && b(a.loader, a.url, a.callback)
            },
            f = {
                maxConcurrent: 2,
                _curConcurrent: 0,
                loadByLoader: function (a, e, f) {
                    if (c.add(e, f)) {
                        var g = c.bindKey(e, !0);
                        this._curConcurrent < this.maxConcurrent
                            ? b(a, e, g)
                            : d.push({url: e, loader: a, callback: g})
                    }
                },
                load: function (a, b, c, d) {
                    "function" == typeof c && (d = c);
                    var e = this._rawTypes[b];
                    if (e) {
                        var f = c
                            ? "." + c
                            : e.defaultExtname;
                        if (f) {
                            var g = a + f;
                            this.loadByLoader(e.loader, g, d)
                        } else 
                            d("Undefined extname for the raw " + b + " file of " + a, null)
                    } else 
                        d('Unknown raw type "' + b + '" of ' + a, null)
                },
                _rawTypes: a(),
                registerRawTypes: function (a, b, c) {
                    return a
                        ? "string" != typeof a
                            ? void Fire.error("[AssetLibrary.registerRawTypes] rawType must be string")
                            : b
                                ? "function" != typeof b
                                    ? void Fire.error("[AssetLibrary.registerRawTypes] loader must be function")
                                    : this._rawTypes[a]
                                        ? void Fire.error('rawType "%s" has already defined', a)
                                        : (c && "." !== c[0] && (c = "." + c), void(this._rawTypes[a] = {
                                            loader: b,
                                            defaultExtname: c
                                        }))
                                : void Fire.error("[AssetLibrary.registerRawTypes] loader must be non-nil")
                                : void Fire.error("[AssetLibrary.registerRawTypes] rawType must be non-nil")
                },
                reset: function () {
                    this._rawTypes = a()
                },
                isLoading: function (a, b) {
                    if (0 === this._curConcurrent) 
                        return !1;
                    if (c.has(a)) 
                        return !0;
                    if (b) 
                        for (var d in c._callbackTable) 
                            if (0 === d.indexOf(a)) 
                                return !0;
                return !1
                },
                _loadFromXHR: _LoadFromXHR
            };
        return f._urlToCallbacks = c,
        f
    }();
    Fire.LoadManager = LoadManager;
    var AssetLibrary = function () {
        function a(a, b) {
            this.readMainCache = a,
            this.writeMainCache = b;
            var c = !(this.readMainCache && this.writeMainCache);
            this.taskIndieCache = c
                ? {}
                : null
        }
        var b = "",
            c = new Fire.CallbacksInvoker,
            d = new Fire._DeserializeInfo;
        a.prototype.readCache = function (a) {
            return this.readMainCache && this.writeMainCache
                ? e._uuidToAsset[a]
                : this.readMainCache
                    ? e._uuidToAsset[a] || this.taskIndieCache[a]
                    : this.taskIndieCache[a]
        },
        a.prototype.writeCache = function (a, b) {
            this.writeMainCache && (e._uuidToAsset[a] = b),
            this.taskIndieCache && (this.taskIndieCache[a] = b)
        };
        var e = {
            loadAsset: function (b, c, d, e, f) {
                d = "undefined" != typeof d
                    ? d
                    : !0,
                e = "undefined" != typeof e
                    ? e
                    : !0;
                var g = new a(d, e);
                this._loadAssetByUuid(b, c, g, f)
            },
            _LoadingHandle: a,
            _loadAssetByUuid: function (a, d, f, g) {
                if ("string" != typeof a) 
                    return void(d && d("[AssetLibrary] uuid must be string", null));
                if (!g) {
                    var h = f.readCache(a);
                    if (h) 
                        return void(d && d(null, h))
                }
                var i = f.readMainCache && !g;
                if (!i || c.add(a, d)) {
                    var j = b + a.substring(0, 2) + Fire.Path.sep + a;
                    LoadManager.loadByLoader(JsonLoader, j, function (b, h) {
                        function k(b, e) {
                            e && (e._uuid = a, f.writeCache(a, e)),
                            i
                                ? c.invokeAndRemove(a, b, e)
                                : d && d(b, e)
                        }
                        h
                            ? e._deserializeWithDepends(h, j, k, f, g)
                            : k(b, null)
                    })
                }
            },
            loadJson: function (b, c, d) {
                var e = new a(!d, !d);
                this._deserializeWithDepends(b, "", c, e)
            },
            _deserializeWithDepends: function (a, c, f, g, h) {
                var i = a && a[0] && a[0].__type__ === JS._getClassId(Scene),
                    j = i
                        ? Fire._MissingScript.safeFindClass
                        : function (a) {
                            var b = JS._getClassById(a);
                            return b
                                ? b
                                : (Fire.warn('Can not get class "%s"', a), Object)
                        };
                Engine._canModifyCurrentScene = !1;
                var k = Fire.deserialize(a, d, {
                    classFinder: j,
                    target: h
                });
                Engine._canModifyCurrentScene = !0;
                var l = d.uuidList.length,
                    m = d.rawProp;
                if (m) {
                    var n = Fire.attr(k.constructor, d.rawProp),
                        o = n.rawType;
                    ++l,
                    LoadManager.load(c, o, k._rawext, function w(a, b) {
                        a && Fire.error("[AssetLibrary] Failed to load %s of %s. %s", o, c, a),
                        k[m] = b,
                        --l,
                        0 === l && f(null, k)
                    })
                }
                0 === l && f(null, k);
                for (var p = !1, q = 0, r = d.uuidList.length; r > q; q++) {
                    var s = d.uuidList[q];
                    if (h) {
                        var t = d.uuidObjList[q][d.uuidPropList[q]];
                        if (t && t._uuid === s) {
                            var u = b + s.substring(0, 2) + Fire.Path.sep + s;
                            LoadManager.isLoading(u, !0)
                                ? !function (a) {
                                    var b = setInterval(function () {
                                        LoadManager.isLoading(a, !0) || (clearInterval(b), --l, 0 === l && f(null, k))
                                    }, 10)
                                }(u)
                                : --l;
                            continue
                        }
                    }
                    var v = function (a, b, c) {
                        return function (d, e) {
                            d && Editor.AssetDB && Editor
                                .AssetDB
                                .isValidUuid(a) && Fire.error('[AssetLibrary] Failed to load "%s", %s', a, d),
                            b[c] = e,
                            --l,
                            0 === l && f(null, k)
                        }
                    }(s, d.uuidObjList[q], d.uuidPropList[q]);
                    e._loadAssetByUuid(s, v, g),
                    p = !0
                }
                p || 0 !== l || f(null, k),
                d.reset()
            },
            getAssetByUuid: function (a) {
                return e._uuidToAsset[a] || null
            },
            unloadAsset: function (a, b) {
                var c;
                c = "string" == typeof a
                    ? e._uuidToAsset[a]
                    : a,
                c && (b && c.isValid && (c.destroy(), FObject._deferredDestroy()), delete e._uuidToAsset[c._uuid])
            },
            init: function (a) {
                return b && !Fire.isUnitTest
                    ? void Fire.error("AssetLibrary has already been initialized!")
                    : void(b = Fire.Path.setEndWithSep(a))
            }
        };
        return e._uuidToAsset = {},
        Asset.prototype._onPreDestroy && Fire.error("_onPreDestroy of Asset has already defined"),
        Asset.prototype._onPreDestroy = function () {
            e._uuidToAsset[this._uuid] === this && e.unloadAsset(this, !1)
        },
        e
    }();
    Fire.AssetLibrary = AssetLibrary;
    var Engine = function () {
        function a() {
            d
                ._scene
                .render(d._renderContext)
        }
        function b(b) {
            d._scene && (b && (d._scene.update(), FObject._deferredDestroy()), a(), d._interactionContext.update(d._scene.entities))
        }
        function c(a) {
            if (e) {
                i = Ticker.requestAnimationFrame(c);
                var d = !f || g;
                g = !1;
                var h = Ticker.now();
                Time._update(h, !d),
                b(d),
                __TESTONLY__.update && __TESTONLY__.update(d)
            }
        }
        var d = {
                _editorCallback: editorCallback
            },
            e = !1,
            f = !1,
            g = !1,
            h = "",
            i = -1;
        d._scene = null,
        d._dontDestroyEntities = [],
        d._renderContext = null,
        d._interactionContext = null,
        d._curRenderContext = null,
        d._inputContext = null,
        Object.defineProperty(d, "isPlaying", {
            get: function () {
                return e
            }
        }),
        Object.defineProperty(d, "isPaused", {
            get: function () {
                return f
            }
        }),
        Object.defineProperty(d, "loadingScene", {
            get: function () {
                return h
            }
        });
        var j = null;
        Object.defineProperty(d, "_canModifyCurrentScene", {
            get: function () {
                return !j
            },
            set: function (a) {
                a
                    ? (this._scene = j, j = null)
                    : (this._scene && j && Fire.error("another scene still locked: " + j.name), j = this._scene, this._scene = null)
            }
        });
        var k = !1;
        return Object.defineProperty(d, "inited", {
            get: function () {
                return k
            }
        }),
        d._sceneInfos = {},
        d.init = function (a, b, c, e) {
            return k
                ? void Fire.error("Engine already inited")
                : (k = !0, d._renderContext = new Fire._Runtime.RenderContext(a, b, c), d._interactionContext = new InteractionContext, Fire.isEditor === !1 && (d._scene = new Scene, editorCallback.onSceneLaunched && editorCallback.onSceneLaunched(d._scene)), e && JS.mixin(d._sceneInfos, e.scenes), d._renderContext)
        },
        d.play = function () {
            if (e && !f) 
                return void Fire.warn("Fireball is already playing");
            if (e && f) 
                return f = !1,
                void(editorCallback.onEnginePlayed && editorCallback.onEnginePlayed(!0));
            e = !0,
            d._inputContext = new InputContext(d._renderContext);
            var a = Ticker.now();
            Time._restart(a),
            c(),
            editorCallback.onEnginePlayed && editorCallback.onEnginePlayed(!1)
        },
        d.stop = function () {
            e && (FObject._deferredDestroy(), d._inputContext.destruct(), d._inputContext = null, Input._reset(), e = !1, f = !1, h = "", -1 !== i && (Ticker.cancelAnimationFrame(i), i = -1), editorCallback.onEngineStopped && editorCallback.onEngineStopped())
        },
        d.pause = function () {
            f = !0,
            editorCallback.onEnginePaused && editorCallback.onEnginePaused()
        },
        d.step = function () {
            this.pause(),
            g = !0,
            e || d.play()
        },
        d.update = c,
        d._launchScene = function (a, b) {
            if (!a) 
                return void Fire.error("Argument must be non-nil");
            d._dontDestroyEntities.length = 0;
            var c = d._scene;
            editorCallback.onStartUnloadScene && editorCallback.onStartUnloadScene(c),
            Fire.isValid(c) && AssetLibrary.unloadAsset(c, !0),
            FObject._deferredDestroy(),
            d._scene = null,
            b && b(),
            d
                ._renderContext
                .onSceneLoaded(a),
            a.entities = a
                .entities
                .concat(d._dontDestroyEntities),
            d._dontDestroyEntities.length = 0,
            d._scene = a,
            d
                ._renderContext
                .onSceneLaunched(a),
            editorCallback.onSceneLaunched && editorCallback.onSceneLaunched(a),
            a.activate()
        },
        d.loadScene = function (a, b, c) {
            if (h) 
                return Fire.error('[Engine.loadScene] Failed to load scene "%s" because "%s" is already loading', a, h),
                !1;
            var e = d._sceneInfos[a];
            return e
                ? (h = a, d._loadSceneByUuid(e, b, c), !0)
                : (Fire.error('[Engine.loadScene] The scene "%s" can not be loaded because it has not been adde' +
                        'd to the build settings.',
                a), !1)
        },
        d._loadSceneByUuid = function (a, b, c) {
            AssetLibrary.unloadAsset(a),
            AssetLibrary.loadAsset(a, function e(f, g) {
                f
                    ? (f = "Failed to load scene: " + f, console["throw"]("[test] Failed to load scene"))
                    : g instanceof Fire._Scene || (f = "The asset " + a + " is not a scene", g = null),
                g
                    ? d._launchScene(g, c)
                    : Fire.error(f),
                h = "",
                b && b(g, f)
            })
        },
        d.preloadScene = function (a, b) {
            var c = d._sceneInfos[a];
            c
                ? (AssetLibrary.unloadAsset(c), AssetLibrary.loadAsset(c, b))
                : Fire.error('[Engine.preloadScene] The scene "%s" could not be loaded because it has not been' +
                        ' added to the build settings.',
                a)
        },
        d
    }();
    Fire.Engine = Engine;
    var ModifierKeyStates = function () {
        function a(a, b) {
            Fire
                .Event
                .call(this, a, !0),
            this.nativeEvent = null,
            this.ctrlKey = !1,
            this.shiftKey = !1,
            this.altKey = !1,
            this.metaKey = !1
        }
        return JS.extend(a, Fire.Event),
        a.prototype.getModifierState = function (a) {
            return nativeEvent.getModifierState(a)
        },
        a.prototype.initFromNativeEvent = function (a) {
            this.nativeEvent = a,
            this.ctrlKey = a.ctrlKey,
            this.shiftKey = a.shiftKey,
            this.altKey = a.altKey,
            this.metaKey = a.metaKey
        },
        a.prototype._reset = function () {
            Event
                .prototype
                ._reset
                .call(this),
            this.nativeEvent = null,
            this.ctrlKey = !1,
            this.shiftKey = !1,
            this.altKey = !1,
            this.metaKey = !1
        },
        a
    }();
    Fire.ModifierKeyStates = ModifierKeyStates,
    Fire.KeyboardEvent = window.KeyboardEvent;
    var MouseEvent = function () {
        function a(a) {
            Fire
                .ModifierKeyStates
                .call(this, a),
            this.button = 0,
            this.buttonStates = 0,
            this.screenX = 0,
            this.screenY = 0,
            this.deltaX = 0,
            this.deltaY = 0,
            this.relatedTarget = null
        }
        return JS.extend(a, ModifierKeyStates),
        a.prototype.initFromNativeEvent = function (a) {
            ModifierKeyStates
                .prototype
                .initFromNativeEvent
                .call(this, a),
            this.button = a.button,
            this.buttonStates = a.buttons,
            this.screenX = a.offsetX,
            this.screenY = a.offsetY,
            this.deltaX = a.movementX,
            this.deltaY = a.movementY,
            this.relatedTarget = a.relatedTarget
        },
        a.prototype.clone = function () {
            var b = new a(this.type);
            return b.bubbles = this.bubbles,
            b.ctrlKey = this.ctrlKey,
            b.shiftKey = this.shiftKey,
            b.altKey = this.altKey,
            b.metaKey = this.metaKey,
            b.button = this.button,
            b.buttonStates = this.buttonStates,
            b.screenX = this.screenX,
            b.screenY = this.screenY,
            b.deltaX = this.deltaX,
            b.deltaY = this.deltaY,
            b.relatedTarget = this.relatedTarget,
            b
        },
        a.prototype._reset = function () {
            ModifierKeyStates
                .prototype
                ._reset
                .call(this),
            this.button = 0,
            this.buttonStates = 0,
            this.screenX = 0,
            this.screenY = 0,
            this.deltaX = 0,
            this.deltaY = 0,
            this.relatedTarget = null
        },
        a
    }();
    Fire.MouseEvent = MouseEvent;
    var InputContext = function () {
            function a(a) {
                this.target = a,
                this.events = []
            }
            function b(a) {
                a.screenX *= Fire.Screen.devicePixelRatio,
                a.screenY *= Fire.Screen.devicePixelRatio
            }
            a.prototype.addEventListener = function (a, b, c) {
                this
                    .target
                    .addEventListener(a, b, c),
                this
                    .events
                    .push([a, b, c])
            },
            a.prototype.removeAll = function () {
                for (var a = 0; a < this.events.length; a++) {
                    var b = this.events[a];
                    this
                        .target
                        .removeEventListener(b[0], b[1], b[2])
                }
                this.events.length = 0
            };
            var c = function (b) {
                function c(a) {
                    f.onDomInputEvent(a)
                }
                function d() {
                    e.focus()
                }
                var e = b.canvas;
                e.tabIndex = e.tabIndex || 0,
                this.renderContext = b,
                this.eventRegister = new a(e),
                this.hasTouch = "ontouchstart" in window;
                var f = this;
                for (var g in EventRegister.inputEvents) 
                    this.eventRegister.addEventListener(g, c, !0);
                this.hasTouch && this.simulateMouseEvent(),
                this.hasTouch
                    ? this
                        .eventRegister
                        .addEventListener("touchstart", d, !0)
                    : this
                        .eventRegister
                        .addEventListener("mousedown", d, !0)
            };
            return c.prototype.simulateMouseEvent = function () {
                function a(a, b) {
                    var c = new MouseEvent(a);
                    c.bubbles = !0;
                    var d = b.changedTouches[0] || b.touches[0];
                    return c.button = 0,
                    c.buttonStates = 1,
                    d && (c.screenX = d.pageX - e, c.screenY = d.pageY - f),
                    c
                }
                function c(c) {
                    var e = c.simulateType;
                    return e
                        ? function (c) {
                            var f = a(e, c);
                            b(f),
                            Input._dispatchEvent(f, d),
                            c.preventDefault(),
                            f._propagationStopped && (f._propagationImmediateStopped
                                ? c.stopImmediatePropagation()
                                : c.stopPropagation())
                        }
                        : function (a) {
                            a.preventDefault()
                        }
                }
                for (var d = this, e = 0, f = 0, g = d.renderContext.canvas; g;) 
                    e += parseInt(g.offsetLeft),
                    f += parseInt(g.offsetTop),
                    g = g.offsetParent;
                var h = {
                    touchstart: {
                        simulateType: "mousedown"
                    },
                    touchend: {
                        simulateType: "mouseup"
                    },
                    touchmove: {
                        simulateType: "mousemove"
                    },
                    touchcancel: {
                        simulateType: ""
                    }
                };
                for (var i in h) {
                    var j = h[i];
                    this
                        .eventRegister
                        .addEventListener(i, c(j), !0)
                }
            },
            c.prototype.destruct = function () {
                this
                    .eventRegister
                    .removeAll()
            },
            c.prototype.onDomInputEvent = function (a) {
                var c = EventRegister.inputEvents[a.type],
                    d = c.constructor,
                    e;
                d
                    ? (e = new d(a.type), e.initFromNativeEvent && e.initFromNativeEvent(a), e.bubbles = c.bubbles)
                    : e = a,
                e instanceof MouseEvent && b(e),
                Input._dispatchEvent(e, this),
                e._defaultPrevented && a.preventDefault(),
                e._propagationStopped && (e._propagationImmediateStopped
                    ? a.stopImmediatePropagation()
                    : a.stopPropagation())
            },
            c
        }(),
        Browser = function () {
            var a = window,
                b = a.navigator,
                c = document,
                d = c.documentElement,
                e = b
                    .userAgent
                    .toLowerCase(),
                f = {};
            f.BROWSER_TYPE_WECHAT = "wechat",
            f.BROWSER_TYPE_ANDROID = "androidbrowser",
            f.BROWSER_TYPE_IE = "ie",
            f.BROWSER_TYPE_QQ = "qqbrowser",
            f.BROWSER_TYPE_MOBILE_QQ = "mqqbrowser",
            f.BROWSER_TYPE_UC = "ucbrowser",
            f.BROWSER_TYPE_360 = "360browser",
            f.BROWSER_TYPE_BAIDU_APP = "baiduboxapp",
            f.BROWSER_TYPE_BAIDU = "baidubrowser",
            f.BROWSER_TYPE_MAXTHON = "maxthon",
            f.BROWSER_TYPE_OPERA = "opera",
            f.BROWSER_TYPE_OUPENG = "oupeng",
            f.BROWSER_TYPE_MIUI = "miuibrowser",
            f.BROWSER_TYPE_FIREFOX = "firefox",
            f.BROWSER_TYPE_SAFARI = "safari",
            f.BROWSER_TYPE_CHROME = "chrome",
            f.BROWSER_TYPE_LIEBAO = "liebao",
            f.BROWSER_TYPE_QZONE = "qzone",
            f.BROWSER_TYPE_SOUGOU = "sogou",
            f.BROWSER_TYPE_UNKNOWN = "unknown";
            var g = f.BROWSER_TYPE_UNKNOWN,
                h = e.match(/sogou|qzone|liebao|micromessenger|qqbrowser|ucbrowser|360 aphone|360browser|baiduboxapp|baidubrowser|maxthon|trident|oupeng|opera|miuibrowser|firefox/i) || e.match(/chrome|safari/i);
            return h && h.length > 0
                ? (g = h[0], "micromessenger" === g
                    ? g = f.BROWSER_TYPE_WECHAT
                    : "safari" === g && e.match(/android.*applewebkit/)
                        ? g = f.BROWSER_TYPE_ANDROID
                        : "trident" === g
                            ? g = f.BROWSER_TYPE_IE
                            : "360 aphone" === g && (g = f.BROWSER_TYPE_360))
                : e.indexOf("iphone") && e.indexOf("mobile") && (g = "safari"),
            f.type = g,
            f
        }(),
        BrowserGetter = function () {
            var a = {
                init: function () {
                    this.html = document.getElementsByTagName("html")[0]
                },
                availWidth: function (a) {
                    return a && a !== this.html
                        ? a.clientWidth
                        : window.innerWidth
                },
                availHeight: function (a) {
                    return a && a !== this.html
                        ? a.clientHeight
                        : window.innerHeight
                },
                adaptationType: Browser.type
            };
            switch (window.navigator.userAgent.indexOf("OS 8_1_") > -1 && (a.adaptationType = Browser.BROWSER_TYPE_MIUI), a.adaptationType) {
                case Browser.BROWSER_TYPE_SAFARI:
                    a.availWidth = function (a) {
                        return a.clientWidth
                    },
                    a.availHeight = function (a) {
                        return a.clientHeight
                    };
                    break;
                case Browser.BROWSER_TYPE_SOUGOU:
                case Browser.BROWSER_TYPE_UC:
                    a.availWidth = function (a) {
                        return a.clientWidth
                    },
                    a.availHeight = function (a) {
                        return a.clientHeight
                    }
            }
            return a.init(),
            a
        }(),
        Screen = {
            devicePixelRatio: Fire.isRetinaEnabled && window.devicePixelRatio || 1
        };
    Object.defineProperty(Screen, "size", {
        get: function () {
            return Engine._renderContext.size
        },
        set: function (a) {
            Engine._renderContext.size = a
        }
    }),
    Object.defineProperty(Screen, "width", {
        get: function () {
            return Engine._renderContext.width
        },
        set: function (a) {
            Engine._renderContext.width = a
        }
    }),
    Object.defineProperty(Screen, "height", {
        get: function () {
            return Engine._renderContext.height
        },
        set: function (a) {
            Engine._renderContext.height = a
        }
    }),
    Object.defineProperty(Screen, "_container", {
        get: function () {
            var a = Fire.Engine._renderContext.canvas;
            return a.parentNode
        }
    }),
    Object.defineProperty(Screen, "_frame", {
        get: function () {
            var a = this._container;
            return a.parentNode === document.body
                ? document.documentElement
                : a.parentNode
        }
    }),
    Object.defineProperty(Screen, "_frameSize", {
        get: function () {
            var a = this._frame;
            return Fire.v2(BrowserGetter.availWidth(a), BrowserGetter.availHeight(a))
        }
    }),
    Fire.Screen = Screen,
    ContainerStrategy.prototype.setupContainer = function (a) {
        var b = Fire.Engine._renderContext.canvas,
            c = Fire.Screen._container;
        c.style.width = b.style.width = a.x + "px",
        c.style.height = b.style.height = a.y + "py";
        var d = Fire.Screen.devicePixelRatio;
        if (Fire.Screen.size = a.mul(d), Fire.isMobile) {
            var e = document.body,
                f;
            e && (f = e.style) && [
                "paddingTop",
                    "paddingRight",
                    "paddingBottom",
                    "paddingLeft",
                    "borderTop",
                    "borderRight",
                    "borderBottom",
                    "borderLeft",
                    "marginTop",
                    "marginRight",
                    "marginBottom",
                    "marginLeft"
                ].forEach(function (a) {
                f[a] = f[a] || "0px"
            })
        }
    },
    Fire.Screen.ContainerStrategy = ContainerStrategy,
    ContentStrategy.prototype.apply = function (a) {},
    ContentStrategy.prototype.buildResult = function (a, b, c) {
        Math.abs(a.x - b.x) < 2 && (b.x = a.x),
        Math.abs(a.y - b.y) < 2 && (b.y = a.y);
        var d = new Fire.Rect(Math.round((a.x - b.x) / 2), Math.round((a.y - b.y) / 2), b.x, b.y);
        return {scale: c, viewport: d}
    },
    ContentStrategy.prototype.getContainerSize = function () {
        var a = Fire.Scene._container;
        return Fire.v2(a.clientWidth, a.clientHeight)
    },
    Fire.Screen.ContentStrategy = ContentStrategy,
    function () {
        function a() {
            ContainerStrategy.call(this)
        }
        function b() {
            ContentStrategy.call(this)
        }
        function c() {
            ContentStrategy.call(this)
        }
        Fire
            .JS
            .extend(a, ContainerStrategy),
        a.prototype.apply = function () {
            var a = Fire.Screen._frameSize;
            this.setupContainer(a)
        },
        ContainerStrategy.EqualToFrame = new a,
        Fire
            .JS
            .extend(b, ContentStrategy),
        b.prototype.apply = function (a, b) {
            return this.buildResult(b, b, Vec2.one)
        },
        Fire
            .JS
            .extend(c, ContentStrategy),
        c.prototype.apply = function (a, b) {
            var c = b.y / a.y,
                d = b;
            return this.buildResult(b, b, Fire.v2(c, c))
        };
        var d = [new b, new c];
        ContentStrategy.fromType = function (a) {
            var b = d[a];
            return b
                ? b
                : (Fire.error("Failed to get ContentStrategy from value", a), d[1])
        }
    }();
    var FireMouseEvent = Fire.MouseEvent,
        EventRegister = {
            inputEvents: {
                keydown: {
                    constructor: null,
                    bubbles: !0,
                    cancelable: !0
                },
                keyup: {
                    constructor: null,
                    bubbles: !0,
                    cancelable: !0
                },
                click: {
                    constructor: FireMouseEvent,
                    bubbles: !0,
                    cancelable: !0
                },
                dblclick: {
                    constructor: FireMouseEvent,
                    bubbles: !0,
                    cancelable: !1
                },
                mousedown: {
                    constructor: FireMouseEvent,
                    bubbles: !0,
                    cancelable: !0
                },
                mouseup: {
                    constructor: FireMouseEvent,
                    bubbles: !0,
                    cancelable: !0
                },
                mousemove: {
                    constructor: FireMouseEvent,
                    bubbles: !0,
                    cancelable: !0
                },
                mouseenter: {
                    constructor: FireMouseEvent,
                    bubbles: !1,
                    cancelable: !1
                },
                mouseleave: {
                    constructor: FireMouseEvent,
                    bubbles: !1,
                    cancelable: !1
                }
            }
        };
    Fire.EventRegister = EventRegister;
    var Input = function () {
        var a = {
            _eventListeners: new EventListeners,
            _lastTarget: null
        };
        return Object.defineProperty(a, "hasTouch", {
            get: function () {
                return !!Engine._inputContext && Engine._inputContext.hasTouch
            }
        }),
        a.on = function (a, b) {
            b
                ? this
                    ._eventListeners
                    .add(a, b)
                : Fire.error("Callback must be non-nil")
        },
        a.off = function (a, b) {
            b
                ? this
                    ._eventListeners
                    .remove(a, b) || Fire.warn("Callback not exists")
                : Fire.error("Callback must be non-nil")
        },
        a._reset = function () {
            this._eventListeners = new EventListeners,
            this._lastTarget = null
        },
        a._dispatchMouseEvent = function (a, b) {
            var c = b.renderContext.camera || Engine._scene.camera,
                d = c.screenToWorld(new Vec2(a.screenX, a.screenY)),
                e = Engine
                    ._interactionContext
                    .pick(d);
            if (a.target = e, this._eventListeners.invoke(a), this._lastTarget && this._lastTarget !== e) {
                var f = a.clone();
                f.type = "mouseleave",
                f.bubbles = EventRegister.inputEvents.mouseleave.bubbles,
                this
                    ._lastTarget
                    .dispatchEvent(f)
            }
            if (e && (e.dispatchEvent(a), this._lastTarget !== e)) {
                var g = a.clone();
                g.type = "mouseenter",
                g.bubbles = EventRegister.inputEvents.mouseenter.bubbles,
                e.dispatchEvent(g)
            }
            this._lastTarget = e
        },
        a._dispatchEvent = function (a, b) {
            a instanceof Fire.MouseEvent
                ? this._dispatchMouseEvent(a, b)
                : this
                    ._eventListeners
                    .invoke(a)
        },
        a
    }();
    Fire.Input = Input,
    Fire.isIOS && Fire
        .LoadManager
        .load("empty", "audio", "mp3", function (a, b) {
            var c = !1;
            window.addEventListener("touchstart", function d() {
                if (!c) {
                    c = !0;
                    var a = new Fire.AudioSource,
                        e = new Fire.AudioClip;
                    e.rawData = b,
                    a.clip = e,
                    Fire
                        .AudioContext
                        .play(a),
                    window.removeEventListener("touchstart", d)
                }
            })
        }),
    function () {
        function a(a, b, c) {
            var e = document.createElement("audio");
            if (Browser.type === Browser.BROWSER_TYPE_IE) 
                var f = setInterval(function () {
                    e.readyState === d && (b(null, e), clearInterval(f))
                }, 100);
            else 
                e
                    .addEventListener("canplaythrough", function () {
                        b(null, e)
                    }, !1);
            e
                .addEventListener("error", function (c) {
                    b('LoadAudioClip: "' + a + '" seems to be unreachable or the file is empty. InnerMessage: ' + c + "\n This may caused by fireball-x/dev#267", null)
                }, !1),
            e.src = a
        }
        var b = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
        if (!b) {
            var c = {},
                d = 4;
            Fire
                .LoadManager
                .registerRawTypes("audio", a),
            c.initSource = function (a) {
                a._audio = null
            },
            c.getCurrentTime = function (a) {
                return a && a._audio && a._playing
                    ? a._audio.currentTime
                    : 0
            },
            c.updateTime = function (a, b) {
                if (a && a._audio) {
                    var c = a._audio.duration;
                    a._audio.currentTime = b
                }
            },
            c.updateMute = function (a) {
                a && a._audio && (a._audio.muted = a.mute)
            },
            c.updateVolume = function (a) {
                a && a._audio && (a._audio.volume = a.volume)
            },
            c.updateLoop = function (a) {
                a && a._audio && (a._audio.loop = a.loop)
            },
            c.updatePlaybackRate = function (a) {
                this.isPaused || (this.pause(a), this.play(a))
            },
            c.updateAudioClip = function (a) {
                a && a.clip && (a._audio = a.clip.rawData)
            },
            c.pause = function (a) {
                a._audio && a
                    ._audio
                    .pause()
            },
            c.stop = function (a) {
                a._audio && (a._audio.pause(), a._audio.currentTime = 0, a._audio.onended && a._audio.removeEventListener("ended", a._audio.onended))
            },
            c.play = function (a, b) {
                a && a.clip && a.clip.rawData && (!a._playing || a._paused) && (this.updateAudioClip(a), this.updateVolume(a), this.updateLoop(a), this.updateMute(a), this.playbackRate = a.playbackRate, a._audio.play(), a._audio.onended = function () {
                    a
                        ._onPlayEnd()
                        .bind(a)
                }.bind(a),
                a._audio.addEventListener("ended", a._audio.onended))
            },
            c.getClipBuffer = function (a) {
                return Fire.error("Audio does not contain the <Buffer> attribute!"),
                null
            },
            c.getClipLength = function (a) {
                return a.rawData.duration
            },
            c.getClipSamples = function (a) {
                return Fire.error("Audio does not contain the <Samples> attribute!"),
                null
            },
            c.getClipChannels = function (a) {
                return Fire.error("Audio does not contain the <Channels> attribute!"),
                null
            },
            c.getClipFrequency = function (a) {
                return Fire.error("Audio does not contain the <Frequency> attribute!"),
                null
            },
            Fire.AudioContext = c
        }
    }();
    var AudioSource = function () {
        var a = Fire.Class({
            name: "Fire.AudioSource",
            "extends": Fire.Component,
            constructor: function () {
                this._playing = !1,
                this._paused = !1,
                this._startTime = 0,
                this._lastPlay = 0,
                this._buffSource = null,
                this._volumeGain = null,
                this.onEnd = null
            },
            properties: {
                isPlaying: {
                    get: function () {
                        return this._playing && !this._paused
                    },
                    visible: !1
                },
                isPaused: {
                    get: function () {
                        return this._paused
                    },
                    visible: !1
                },
                time: {
                    get: function () {
                        return Fire
                            .AudioContext
                            .getCurrentTime(this)
                    },
                    set: function (a) {
                        Fire
                            .AudioContext
                            .updateTime(this, a)
                    },
                    visible: !1
                },
                _clip: {
                    "default": null,
                    type: Fire.AudioClip
                },
                clip: {
                    get: function () {
                        return this._clip
                    },
                    set: function (a) {
                        this._clip !== a && (this._clip = a, Fire.AudioContext.updateAudioClip(this))
                    }
                },
                _loop: !1,
                loop: {
                    get: function () {
                        return this._loop
                    },
                    set: function (a) {
                        this._loop !== a && (this._loop = a, Fire.AudioContext.updateLoop(this))
                    }
                },
                _mute: !1,
                mute: {
                    get: function () {
                        return this._mute
                    },
                    set: function (a) {
                        this._mute !== a && (this._mute = a, Fire.AudioContext.updateMute(this))
                    }
                },
                _volume: 1,
                volume: {
                    get: function () {
                        return this._volume
                    },
                    set: function (a) {
                        this._volume !== a && (this._volume = Math.clamp01(a), Fire.AudioContext.updateVolume(this))
                    },
                    range: [0, 1]
                },
                _playbackRate: 1,
                playbackRate: {
                    get: function () {
                        return this._playbackRate
                    },
                    set: function (a) {
                        this._playbackRate !== a && (this._playbackRate = a, this._playing && Fire.AudioContext.updatePlaybackRate(this))
                    }
                },
                playOnLoad: !0
            },
            _onPlayEnd: function () {
                this.onEnd && this.onEnd(),
                this._playing = !1,
                this._paused = !1
            },
            pause: function () {
                this._paused || (Fire.AudioContext.pause(this), this._paused = !0)
            },
            play: function () {
                (!this._playing || this._paused) && (this._paused
                    ? Fire.AudioContext.play(this, this._startTime)
                    : Fire.AudioContext.play(this, 0), this._playing = !0, this._paused = !1)
            },
            stop: function () {
                this._playing && (Fire.AudioContext.stop(this), this._playing = !1, this._paused = !1)
            },
            onLoad: function () {
                this._playing && this.stop()
            },
            onEnable: function () {
                this.playOnLoad && this.play()
            },
            onDisable: function () {
                this.stop()
            }
        });
        return Fire.addComponentMenu(a, "AudioSource"),
        a
    }();
    Fire.AudioSource = AudioSource,
    function () {
        function a(a, b, c, e) {
            var f = !1,
                g = setTimeout(function () {
                    e('The operation of decoding audio data already timeout! Audio url: "' + c + '". Set Fire.AudioContext.MaxDecodeTime to a larger value if this error often occ' +
                            'ur. See fireball-x/dev#318 for details.',
                    null)
                }, d.MaxDecodeTime);
            a.decodeAudioData(b, function (a) {
                f || (e(null, a), clearTimeout(g))
            }, function (a) {
                f || (e(null, 'LoadAudioClip: "' + c + '" seems to be unreachable or the file is empty. InnerMessage: ' + a), clearTimeout(g))
            })
        }
        function b(b, c, d) {
            var e = c && function (d, e) {
                e
                    ? a(Fire.nativeAC, e.response, b, c)
                    : c('LoadAudioClip: "' + b + '" seems to be unreachable or the file is empty. InnerMessage: ' + d, null)
            };
            Fire
                .LoadManager
                ._loadFromXHR(b, e, d, "arraybuffer")
        }
        var c = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;
        if (c) {
            Fire.nativeAC || (Fire.nativeAC = new c),
            Fire
                .LoadManager
                .registerRawTypes("audio", b);
            var d = {};
            d.MaxDecodeTime = 4e3,
            d.getCurrentTime = function (a) {
                return a._paused
                    ? a._startTime
                    : a._playing
                        ? a._startTime + this.getPlayedTime(a)
                        : 0
            },
            d.getPlayedTime = function (a) {
                return (Fire.nativeAC.currentTime - a._lastPlay) * a._playbackRate
            },
            d.updateTime = function (a, b) {
                a._lastPlay = Fire.nativeAC.currentTime,
                a._startTime = b,
                a.isPlaying && (this.pause(a), this.play(a))
            },
            d.updateMute = function (a) {
                a._volumeGain && (a._volumeGain.gain.value = a.mute
                    ? -1
                    : a.volume - 1)
            },
            d.updateVolume = function (a) {
                a._volumeGain && (a._volumeGain.gain.value = a.volume - 1)
            },
            d.updateLoop = function (a) {
                a._buffSource && (a._buffSource.loop = a.loop)
            },
            d.updateAudioClip = function (a) {
                a.isPlaying && (this.stop(a, !1), this.play(a))
            },
            d.updatePlaybackRate = function (a) {
                this.isPaused || (this.pause(a), this.play(a))
            },
            d.pause = function (a) {
                a._buffSource && (a._startTime += this.getPlayedTime(a), a._buffSource.onended = null, a._buffSource.stop(0))
            },
            d.stop = function (a, b) {
                a._buffSource && (b || (a._buffSource.onended = null), a._buffSource.stop(0))
            },
            d.play = function (a, b) {
                if (a.clip && a.clip.rawData) {
                    var c = Fire
                            .nativeAC
                            .createBufferSource(),
                        d = Fire
                            .nativeAC
                            .createGain();
                    c.connect(d),
                    d.connect(Fire.nativeAC.destination),
                    c.connect(Fire.nativeAC.destination),
                    c.buffer = a.clip.rawData,
                    c.loop = a.loop,
                    c.playbackRate.value = a.playbackRate,
                    c.onended = a
                        ._onPlayEnd
                        .bind(a),
                    d.gain.value = a.mute
                        ? -1
                        : a.volume - 1,
                    a._buffSource = c,
                    a._volumeGain = d,
                    a._startTime = b || 0,
                    a._lastPlay = Fire.nativeAC.currentTime,
                    c.start(0, this.getCurrentTime(a))
                }
            },
            d.getClipBuffer = function (a) {
                return a.rawData
            },
            d.getClipLength = function (a) {
                return a.rawData
                    ? a.rawData.duration
                    : -1
            },
            d.getClipSamples = function (a) {
                return a.rawData
                    ? a.rawData.length
                    : -1
            },
            d.getClipChannels = function (a) {
                return a.rawData
                    ? a.rawData.numberOfChannels
                    : -1
            },
            d.getClipFrequency = function (a) {
                return a.rawData
                    ? a.rawData.sampleRate
                    : -1
            },
            Fire.AudioContext = d
        }
    }(),
    "undefined" != typeof exports
        ? ("undefined" != typeof module && module.exports && (exports = module.exports = Fire), exports.Fire = Fire)
        : "undefined" != typeof define && define.amd
            ? define(Fire)
            : (root.Fire = Fire, root.Editor = Editor)
}).call(this);