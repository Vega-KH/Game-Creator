(function () {
    function a(a) {
        return a.bitmapFont && a.bitmapFont._uuid
            ? {
                font: a.bitmapFont.size + " " + a.bitmapFont._uuid,
                align: g
                    .TextAlign[a.align]
                    .toLowerCase()
            }
            : {
                font: "1 " + E,
                align: "left"
            }
    }
    function b(b) {
        var c = a(b);
        b._renderObj && b
            ._renderObj
            .setStyle(c),
        b._renderObjInScene && b
            ._renderObjInScene
            .setStyle(c)
    }
    function c(a, b) {
        var c = new g.Matrix23;
        return c.a = a.scale.x,
        c.b = 0,
        c.c = 0,
        c.d = a.scale.y,
        c.tx = a.position.x,
        c.ty = -a.position.y,
        c.prepend(b),
        c.b = -c.b,
        c.c = -c.c,
        c.ty = g.Engine._curRenderContext.renderer.height - c.ty,
        c
    }
    function d(a) {
        var b = {};
        if (a && a._uuid) {
            if (b.face = a._uuid, b.size = a.size, b.lineHeight = a.lineHeight, b.chars = {}, a.texture) 
                for (var c = new PIXI.BaseTexture(a.texture.image), d = a.charInfos, e = d.length, f = 0; e > f; f++) {
                    var h = d[f],
                        i = h.id,
                        j = new PIXI.Rectangle(h.x, h.y, h.width, h.height);
                    if (j.x + j.width > c.width || j.y + j.height > c.height) {
                        g.error("Character in %s does not fit inside the dimensions of texture %s", a.name, a.texture.name);
                        break
                    }
                    var k = new PIXI.Texture(c, j);
                    b.chars[i] = {
                        xOffset: h.xOffset,
                        yOffset: h.yOffset,
                        xAdvance: h.xAdvance,
                        kerning: {},
                        texture: k
                    }
                } else 
                    g.error("Invalid texture of bitmapFont: %s", a.name);
        for (var l = a.kernings, m = 0; m < l.length; m++) {
                var n = l[m],
                    o = n.first,
                    p = n.second,
                    q = n.amount;
                b.chars[p].kerning[o] = q
            }
        } else 
            b = F;
        PIXI.BitmapText.fonts[b.face] = b
    }
    function e(a) {
        if (a._renderObj || a._renderObjInScene) {
            var b = {
                fill: "#" + a
                    .color
                    .toHEX("#rrggbb"),
                align: g
                    .TextAlign[a.align]
                    .toLowerCase()
            };
            return b.font = a.fontType !== g.Text.FontType.Custom
                ? a.size + "px " + g
                    .Text
                    .FontType[a.fontType]
                    .toLowerCase()
                : a.size + "px " + a.customFontType,
            b
        }
        return {font: "30px Arial", fill: "white", align: "left"}
    }
    var f = "undefined" != typeof global
            ? global
            : this,
        g = f.Fire || {},
        h = g.JS,
        i = g.FObject,
        j = g.HashObject,
        k = g.Asset,
        l = g.Vec2,
        m = g.v2,
        n = g.Matrix23,
        o = g.Rect,
        p = g.Color,
        q = g.Texture,
        r = g.Sprite,
        s = g.Atlas,
        t = g.Engine,
        u = g._ObjectFlags.Destroying,
        v = g._ObjectFlags.DontDestroy,
        w = g._ObjectFlags.Hide,
        x = g._ObjectFlags.HideInGame,
        y = g._ObjectFlags.HideInEditor,
        z = g.__TESTONLY__,
        A = g.ContentStrategyType,
        B = g.BitmapText,
        C = g.BitmapFont;
    !function () {
        PIXI.dontSayHello = !0;
        var a = function () {};
        PIXI.DisplayObject.prototype.updateTransform = a,
        PIXI.DisplayObject.prototype.displayObjectUpdateTransform = a,
        PIXI.DisplayObjectContainer.prototype.displayObjectContainerUpdateTransform = a
    }();
    var D = function () {
        function a(a, b, c, d) {
            a = a || 800,
            b = b || 600,
            d = d || !1;
            var e = !1;
            this.stage = new PIXI.Stage(0),
            this.stage.interactive = !1,
            this.root = this.stage,
            this.renderer = PIXI.autoDetectRenderer(a, b, {
                view: c,
                transparent: d,
                antialias: e
            }),
            this.sceneView = null,
            this.isSceneView = !1,
            this._camera = null
        }
        function b(a) {
            if (a && a.texture && a.texture.image) {
                var b = new PIXI.BaseTexture(a.texture.image),
                    d = new PIXI.Rectangle(a.x, a.y, Math.min(b.width - a.x, a.rotatedWidth), Math.min(b.height - a.y, a.rotatedHeight));
                return new PIXI.Texture(b, d)
            }
            return c
        }
        var c = new PIXI.Texture(new PIXI.BaseTexture);
        a.initRenderer = function (a) {
            a._renderObj = null,
            a._renderObjInScene = null,
            a._tempMatrix = new g.Matrix23
        },
        Object.defineProperty(a.prototype, "canvas", {
            get: function () {
                return this.renderer.view
            }
        }),
        Object.defineProperty(a.prototype, "width", {
            get: function () {
                return this.renderer.width
            },
            set: function (a) {
                this
                    .renderer
                    .resize(a, this.renderer.height)
            }
        }),
        Object.defineProperty(a.prototype, "height", {
            get: function () {
                return this.renderer.height
            },
            set: function (a) {
                this
                    .renderer
                    .resize(this.renderer.width, a)
            }
        }),
        Object.defineProperty(a.prototype, "size", {
            get: function () {
                return new l(this.renderer.width, this.renderer.height)
            },
            set: function (a) {
                this
                    .renderer
                    .resize(a.x, a.y)
            }
        }),
        Object.defineProperty(a.prototype, "background", {
            set: function (a) {
                this
                    .stage
                    .setBackgroundColor(a.toRGBValue())
            }
        }),
        Object.defineProperty(a.prototype, "camera", {
            get: function () {
                return this._camera
            },
            set: function (a) {
                this._camera = a,
                g.isValid(a) && (a.renderContext = this)
            }
        }),
        a.prototype.render = function () {
            this
                .renderer
                .render(this.stage)
        },
        a.prototype.onRootEntityCreated = function (a) {
            a._pixiObj = this._createNode(),
            this.sceneView && (a._pixiObjInScene = this.sceneView._createNode())
        },
        a.prototype._createNode = function () {
            var a = new PIXI.DisplayObjectContainer;
            return t._canModifyCurrentScene && this
                .root
                .addChild(a),
            a
        },
        a.prototype.onEntityRemoved = function (a) {
            this._removeNode(a._pixiObj),
            a._pixiObj = null,
            this.sceneView && (this.sceneView._removeNode(a._pixiObjInScene), a._pixiObjInScene = null)
        },
        a.prototype._removeNode = function (a) {
            a && a.parent && a
                .parent
                .removeChild(a)
        },
        a.prototype.onEntityParentChanged = function (a, b) {
            this._setParentNode(a._pixiObj, a._parent && a._parent._pixiObj),
            this.sceneView && this
                .sceneView
                ._setParentNode(a._pixiObjInScene, a._parent && a._parent._pixiObjInScene)
        },
        a.prototype._setParentNode = function (a, b) {
            a && (b
                ? b.addChild(a)
                : this.root.addChild(a))
        },
        a.prototype._getChildrenOffset = function (a, b) {
            if (a) {
                var c = this.isSceneView
                        ? a._pixiObjInScene
                        : a._pixiObj,
                    d = b || a._children[0];
                if (d) {
                    var e = this.isSceneView
                            ? d._pixiObjInScene
                            : d._pixiObj,
                        f = c
                            .children
                            .indexOf(e);
                    return -1 !== f
                        ? f
                        : b
                            ? c.children.length
                            : (g.error("%s's pixi object not contains in its pixi parent's children", d.name), -1)
                }
                return c.children.length
            }
            return 0
        },
        a.prototype.onEntityIndexChanged = function (a, b, c) {
            var d;
            0 === c && b > 0
                ? d = a.getSibling(1)
                : 0 === b && c > 0 && (d = a),
            a._pixiObj && this._setNodeIndex(a, b, c, d),
            this.sceneView && this
                .sceneView
                ._setNodeIndex(a, b, c, d)
        },
        a.prototype._setNodeIndex = function (a, b, c, d) {
            var e = this._getChildrenOffset(a._parent, d),
                f = this.isSceneView
                    ? a._pixiObjInScene
                    : a._pixiObj;
            if (f) {
                var g = f.parent.children;
                g.splice(b + e, 1);
                var h = c + e;
                h < g.length
                    ? g.splice(h, 0, f)
                    : g.push(f)
            }
        },
        a.prototype.onSceneLaunched = function (a) {
            this._addToScene(a),
            this.sceneView && this
                .sceneView
                ._addToScene(a)
        },
        a.prototype._addToScene = function (a) {
            for (var b = a.entities, c = 0, d = b.length; d > c; c++) {
                var e = this.isSceneView
                    ? b[c]._pixiObjInScene
                    : b[c]._pixiObj;
                e && this
                    .root
                    .addChild(e)
            }
        },
        a.prototype.onSceneLoaded = function (a) {
            for (var b = a.entities, c = 0, d = b.length; d > c; c++) 
                this.onEntityCreated(b[c], !1)
        };
        var d = function (a, b) {
            a._pixiObj = new PIXI.DisplayObjectContainer,
            a
                ._parent
                ._pixiObj
                .addChild(a._pixiObj),
            b && (a._pixiObjInScene = new PIXI.DisplayObjectContainer, a._parent._pixiObjInScene.addChild(a._pixiObjInScene));
            for (var c = a._children, e = 0, f = c.length; f > e; e++) 
                d(c[e], b)
        };
        return a.prototype.onEntityCreated = function (a, b) {
            a._pixiObj = new PIXI.DisplayObjectContainer,
            a._parent
                ? a
                    ._parent
                    ._pixiObj
                    .addChild(a._pixiObj)
                : b && this
                    .root
                    .addChild(a._pixiObj),
            this.sceneView && (a._pixiObjInScene = new PIXI.DisplayObjectContainer, a._parent
                ? a._parent._pixiObjInScene.addChild(a._pixiObjInScene)
                : b && this.sceneView.root.addChild(a._pixiObjInScene));
            for (var c = a._children, e = 0, f = c.length; f > e; e++) 
                d(c[e], this.sceneView)
        },
        a.prototype._addSprite = function (a, b) {
            var c = new PIXI.Sprite(a);
            return b.addChildAt(c, 0),
            c
        },
        a.prototype.addSprite = function (a) {
            var c = b(a._sprite),
                d = !(a.entity._objFlags & x);
            d && (a._renderObj = this._addSprite(c, a.entity._pixiObj)),
            this.sceneView && (a._renderObjInScene = this.sceneView._addSprite(c, a.entity._pixiObjInScene)),
            this.updateSpriteColor(a)
        },
        a.prototype.show = function (a, b) {
            a._renderObj && (a._renderObj.visible = b),
            a._renderObjInScene && (a._renderObjInScene.visible = b)
        },
        a.prototype.remove = function (a) {
            this._removeNode(a._renderObj),
            a._renderObj = null,
            this.sceneView && (this.sceneView._removeNode(a._renderObjInScene), a._renderObjInScene = null)
        },
        a.prototype.updateSpriteColor = function (a) {
            var b = a
                ._color
                .toRGBValue();
            a._renderObj && (a._renderObj.tint = b),
            a._renderObjInScene && (a._renderObjInScene.tint = b),
            a._renderObj || a._renderObjInScene || g.error("" + a + " must be added to render context first!")
        },
        a.prototype.updateMaterial = function (a) {
            var c = b(a._sprite);
            a._renderObj && a
                ._renderObj
                .setTexture(c),
            a._renderObjInScene && a
                ._renderObjInScene
                .setTexture(c),
            a._renderObj || a._renderObjInScene || g.error("" + a + " must be added to render context first!")
        },
        a.prototype.updateTransform = function (a, b) {
            var c = a._tempMatrix;
            c.a = b.a,
            c.b = -b.b,
            c.c = -b.c,
            c.d = b.d,
            c.tx = b.tx,
            c.ty = this.renderer.height - b.ty;
            var d = Math.clamp01(a._color.a);
            this.isSceneView
                ? a._renderObjInScene && (a._renderObjInScene.worldTransform = c, a._renderObjInScene.worldAlpha = d)
                : a._renderObj && (a._renderObj.worldTransform = c, a._renderObj.worldAlpha = d)
        },
        a
    }();
    D.prototype.checkMatchCurrentScene = function () {
        function a(b, c, d) {
            if (d && b._pixiObjInScene !== d) 
                throw new Error("entity does not match pixi scene node: " + b.name);
            if (b._pixiObj !== c) 
                throw new Error("entity does not match pixi game node: " + b.name);
            var f = b._children.length,
                g;
            if (d && (g = e.sceneView._getChildrenOffset(b), d.children.length !== f + g)) 
                throw console.error("Mismatched list of child elements in Scene view, entity: %s,\npixi childCount: %" +
                        "s, entity childCount: %s, rcOffset: %s",
                b.name, d.children.length, f, g),
                new Error("(see above error)");
            var h = e._getChildrenOffset(b);
            if (c.children.length !== f + h) 
                throw new Error("Mismatched list of child elements in Game view, entity: " + b.name);
            for (var i = 0; f > i; i++) 
                a(b._children[i], c.children[h + i], d && d.children[i + g])
        }
        var b = t._scene.entities,
            c = this.stage.children,
            d;
        this.sceneView && (d = this.sceneView.stage.children, d = d[1].children);
        for (var e = this, f = 0; f < b.length; f++) {
            if (d && d.length !== b.length) 
                throw new Error("Mismatched list of root elements in scene view");
            if (c.length !== b.length) 
                throw new Error("Mismatched list of root elements in game view");
            a(b[f], c[f], d && d[f])
        }
    },
    g._Runtime.RenderContext = D,
    PIXI.BitmapText.prototype.updateTransform = function () {},
    g.BitmapFont.prototype._onPreDestroy = function () {
        this._uuid && (PIXI.BitmapText.fonts[this._uuid] = null)
    };
    var E = "None",
        F = {
            face: E,
            size: 1,
            chars: {},
            lineHeight: 1
        },
        G = function (a) {
            return a
                ? PIXI.BitmapText.fonts[a._uuid]
                : null
        };
    D.prototype.getTextSize = function (a) {
        var b = !(a.entity._objFlags & x),
            c = 0,
            d = 0;
        return b && a._renderObj
            ? (a._renderObj.dirty && (a._renderObj.updateText(), a._renderObj.dirty = !1), c = a._renderObj.textWidth, d = a._renderObj.textHeight)
            : a._renderObjInScene && (a._renderObjInScene.dirty && (a._renderObjInScene.updateText(), a._renderObjInScene.dirty = !1), c = a._renderObjInScene.textWidth, d = a._renderObjInScene.textHeight),
        new l(c, d)
    },
    D.prototype.setText = function (a, b) {
        a._renderObj && a
            ._renderObj
            .setText(b),
        this.sceneView && a._renderObjInScene && a
            ._renderObjInScene
            .setText(b)
    },
    D.prototype.setAlign = function (a) {
        b(a)
    },
    D.prototype.updateBitmapFont = function (a) {
        d(a.bitmapFont),
        b(a)
    },
    D.prototype.addBitmapText = function (b) {
        d(b.bitmapFont);
        var c = a(b),
            e = !(b.entity._objFlags & x);
        e && (b._renderObj = new PIXI.BitmapText(b.text, c), b.entity._pixiObj.addChildAt(b._renderObj, 0)),
        this.sceneView && (b._renderObjInScene = new PIXI.BitmapText(b.text, c), b.entity._pixiObjInScene.addChildAt(b._renderObjInScene, 0))
    },
    D.updateBitmapTextTransform = function (a, b) {
        var d = 0,
            e = null,
            f = 0,
            g = null,
            h = t._curRenderContext === t._renderContext;
        if (h && a._renderObj) 
            for (a._renderObj.dirty && (a._renderObj.updateText(), a._renderObj.dirty = !1), e = a._renderObj.children, f = e.length; f > d; d++) 
                g = e[d],
                g.worldTransform = c(g, b);
            else if (a._renderObjInScene) 
                for (a._renderObjInScene.dirty && (a._renderObjInScene.updateText(), a._renderObjInScene.dirty = !1), e = a._renderObjInScene.children, d = 0, f = e.length; f > d; d++) 
                    g = e[d],
                    g.worldTransform = c(g, b)
    },
    PIXI.Text.prototype.updateTransform = function () {};
    var H = {};
    D.prototype.setTextContent = function (a, b) {
        a._renderObj && a
            ._renderObj
            .setText(b),
        this.sceneView && a._renderObjInScene && a
            ._renderObjInScene
            .setText(b)
    },
    D.prototype.setTextStyle = function (a) {
        var b = e(a);
        a._renderObj && a
            ._renderObj
            .setStyle(b),
        a._renderObjInScene && a
            ._renderObjInScene
            .setStyle(b)
    },
    D.prototype.addText = function (a) {
        var b = e(a),
            c = !(a.entity._objFlags & x);
        c && (a._renderObj = new PIXI.Text(a.text, b), a.entity._pixiObj.addChildAt(a._renderObj, 0)),
        this.sceneView && (a._renderObjInScene = new PIXI.Text(a.text, b), a.entity._pixiObjInScene.addChildAt(a._renderObjInScene, 0))
    },
    D.prototype.getTextSize = function (a) {
        var b = !(a.entity._objFlags & x),
            c = 0,
            d = 0;
        return b && a._renderObj
            ? (a._renderObj.dirty && (a._renderObj.updateText(), a._renderObj.dirty = !1), c = a._renderObj.textWidth | a._renderObj._width, d = a._renderObj.textHeight | a._renderObj._height)
            : a._renderObjInScene && (a._renderObjInScene.dirty && (a._renderObjInScene.updateText(), a._renderObjInScene.dirty = !1), c = a._renderObjInScene.textWidth | a._renderObjInScene._width, d = a._renderObjInScene.textHeight | a._renderObjInScene._height),
        new l(c, d)
    },
    D.updateTextTransform = function (a, b) {
        var d = 0,
            e = null,
            f = 0,
            g = null,
            h = t._curRenderContext === t._renderContext;
        h && a._renderObj
            ? (a._renderObj.dirty && (a._renderObj.updateText(), a._renderObj.dirty = !1), a._renderObj.worldTransform = c(a._renderObj, b))
            : a._renderObjInScene && (a._renderObjInScene.dirty && (a._renderObjInScene.updateText(), a._renderObjInScene.dirty = !1), a._renderObjInScene.worldTransform = c(a._renderObjInScene, b))
    },
    "undefined" != typeof exports
        ? ("undefined" != typeof module && module.exports && (exports = module.exports = g), exports.Fire = g)
        : "undefined" != typeof define && define.amd
            ? define(g)
            : (f.Fire = g, f.Editor = Editor)
}).call(this);