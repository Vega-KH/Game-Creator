(function () {
	function a(b, c) {
		if (b) {
			var d = Object.getOwnPropertyDescriptor(b, c);
			return d || a(Object.getPrototypeOf(b), c)
		}
	}

	function b(b, c, d) {
		var e = a(c, b);
		Object.defineProperty(d, b, e)
	}

	function c(a) {
		return "object" == typeof Node ? a instanceof Node : a && "object" == typeof a && "number" == typeof a.nodeType && "string" == typeof a.nodeName
	}

	function d(a, b, c) {
		return function (d, e) {
			var f = l.attr(d, e) || {};
			if (f.type !== a) return void l.warn("Can only indicate one type attribute for %s.%s.", B.getClassName(d), e);
			if (f.hasOwnProperty("default")) {
				var g = f["default"];
				if ("undefined" != typeof g) {
					var h = Array.isArray(g) || D(g);
					if (!h) {
						var i = typeof g;
						if (i === a)
							if ("object" === a) {
								if (!g || g instanceof c) return;
								l.warn("The default value of %s.%s is not instance of %s.", B.getClassName(d), e, B.getClassName(c))
							}
						else l.warn('No needs to indicate the "%s" attribute for %s.%s, which its default value is type of %s.', b, B.getClassName(d), e, a);
						else l.warn('Can not indicate the "%s" attribute for %s.%s, which its default value is type of %s.', b, B.getClassName(d), e, i);
						delete f.type
					}
				}
			}
		}
	}

	function e(a, b) {
		for (var c in G) Object.defineProperty(b, c, {
			value: G[c],
			writable: "__props__" === c,
			enumerable: "__props__" === c
		})
	}

	function f(a, b) {
		var c;
		l._isFireClass(b) ? (c = b.__ctors__, c && (c = c.slice())) : b && (c = [b]), c ? a && c.push(a) : a && (c = [a]);
		var d;
		if (c) switch (console.assert(c.length > 0), c.length) {
		case 1:
			d = function () {
				this._observing = !1, H(this, d);
				var a = d.__ctors__;
				a[0].apply(this, arguments)
			};
			break;
		case 2:
			d = function () {
				this._observing = !1, H(this, d);
				var a = d.__ctors__;
				a[0].apply(this, arguments), a[1].apply(this, arguments)
			};
			break;
		case 3:
			d = function () {
				this._observing = !1, H(this, d);
				var a = d.__ctors__;
				a[0].apply(this, arguments), a[1].apply(this, arguments), a[2].apply(this, arguments)
			};
			break;
		case 4:
			d = function () {
				this._observing = !1, H(this, d);
				var a = d.__ctors__;
				a[0].apply(this, arguments), a[1].apply(this, arguments), a[2].apply(this, arguments), a[3].apply(this, arguments)
			};
			break;
		default:
			d = function () {
				this._observing = !1, H(this, d);
				for (var a = d.__ctors__, b = 0, c = a.length; c > b; ++b) a[b].apply(this, arguments)
			}
		}
		else d = function () {
			this._observing = !1, H(this, d)
		};
		return Object.defineProperty(d, "__ctors__", {
			value: c || null,
			writable: !1,
			enumerable: !1
		}), d
	}

	function g(a) {
		return l._isFireClass(a) ? void l.error("Constructor can not be another FireClass") : "function" != typeof a ? void l.error("Constructor of FireClass must be function type") : a.length > 0 ? void l.warn("Can not instantiate FireClass with arguments.") : void 0
	}

	function h(a, b) {
		b && (a.toString = function () {
			var a = Function.toString.call(this);
			return a.replace("function ", "function " + B.getClassName(this))
		})
	}

	function i(a, b, c) {
		function d(d, e, g) {
			var h = a[d];
			h && (typeof h === e ? f.push("function" == typeof g ? g(h) : g) : l.error("The %s of %s.%s must be type %s", d, b, c, e))
		}
		var e = "The %s of %s must be type %s";
		I.length = 0;
		var f = I,
			g = a.type;
		g && (g === l.Integer ? f.push(l.Integer_Obsoleted) : g === l.Float || g === Number ? f.push(l.Float_Obsoleted) : g === l.Boolean || g === Boolean ? f.push(l.Boolean_Obsoleted) : g === l.String || g === String ? f.push(l.String_Obsoleted) : "Object" === g || g === Object ? l.error('Please define "type" parameter of %s.%s as the actual constructor.', b, c) : "object" == typeof g ? g.hasOwnProperty("__enums__") ? f.push(l.Enum(g)) : l.error('Please define "type" parameter of %s.%s as the constructor of %s.', b, c, g) : "function" == typeof g ? f.push(l.ObjectType(g)) : l.error('Unknown "type" parameter of %s.%s：%s', b, c, g)), d("rawType", "string", l.RawType), d("editorOnly", "boolean", l.EditorOnly), d("displayName", "string", l.DisplayName), d("multiline", "boolean", l.MultiText), d("readonly", "boolean", l.ReadOnly), d("tooltip", "string", l.Tooltip), a.serializable === !1 && f.push(l.NonSerialized);
		var h = a.visible;
		"undefined" != typeof h ? a.visible || f.push(l.HideInInspector) : 95 === c.charCodeAt(0) && f.push(l.HideInInspector);
		var i = a.range;
		i && (Array.isArray(i) ? i.length >= 2 ? f.push(l.Range(i[0], i[1])) : l.error("The length of range array must be 2") : l.error(e, '"range"', b + "." + c, "array"));
		var j = a.nullable;
		if (j)
			if ("object" == typeof j) {
				var k = j.propName;
				if ("string" == typeof k) {
					var m = j["default"];
					"boolean" == typeof m ? f.push(l.Nullable(k, m)) : l.error(e, '"default"', "nullable object", "boolean")
				}
				else l.error(e, '"propName"', "nullable object", "string")
			}
		else l.error(e, '"nullable"', b + "." + c, "object");
		var n = a.watch;
		if (n)
			if ("object" == typeof n)
				for (var o in n) {
					var p = n[o];
					"function" == typeof p ? f.push(l.Watch(o.split(" "), p)) : l.error(e, "value", "watch object", "function")
				}
		else l.error(e, "watch", b + "." + c, "object");
		return f
	}

	function j(a) {
		var b = a.constructor.prototype;
		return b.hasOwnProperty("__cid__") ? a.__cid__ : b.hasOwnProperty("__classname__") ? a.__classname__ : ""
	}
	var k = this,
		l = k.Fire || {},
		m = k.Editor || {};
	if (l.Editor = m, l._customAssetMenuItems = [], l.addCustomAssetMenu = function (a, b, c) {
			l._customAssetMenuItems.push({
				customAsset: a,
				menuPath: b,
				priority: c
			}), m.sendToWindows && m.sendToWindows("fire-assets:refresh-context-menu")
		}, l.isNode = !("undefined" == typeof process || !process.versions || !process.versions.node), l.isNodeWebkit = !!(l.isNode && "node-webkit" in process.versions), l.isAtomShell = !!(l.isNode && "atom-shell" in process.versions), l.isApp = l.isNodeWebkit || l.isAtomShell, l.isPureWeb = !l.isNode && !l.isApp, l.isEditor = l.isApp, l.isWeb = l.isAtomShell ? "undefined" != typeof process && "renderer" === process.type : "undefined" == typeof __dirname || null === __dirname, l.isEditorCore = l.isApp && !l.isWeb, l.isNode) l.isDarwin = "darwin" === process.platform, l.isWin32 = "win32" === process.platform;
	else {
		var n = window.navigator.platform;
		l.isDarwin = "Mac" === n.substring(0, 3), l.isWin32 = "Win" === n.substring(0, 3)
	}
	if (l.isPureWeb) {
		var o = window,
			p = o.navigator,
			q = document,
			r = q.documentElement,
			s = p.userAgent.toLowerCase();
		l.isMobile = -1 !== s.indexOf("mobile") || -1 !== s.indexOf("android"), l.isIOS = !!s.match(/(iPad|iPhone|iPod)/i), l.isAndroid = !(!s.match(/android/i) && !p.platform.match(/android/i))
	}
	else l.isAndroid = l.isIOS = l.isMobile = !1;
	Object.defineProperty(l, "isRetina", {
		get: function () {
			return l.isWeb && window.devicePixelRatio && window.devicePixelRatio > 1
		}
	}), l.isRetinaEnabled = (l.isIOS || l.isDarwin) && !l.isEditor && l.isRetina;
	var t = 1,
		u = 2,
		v = 4,
		w = 8,
		x = 16,
		y = 32,
		z = {
			DontSave: v,
			EditorOnly: w,
			Dirty: x,
			DontDestroy: y,
			Destroying: 512,
			HideInGame: 1024,
			HideInEditor: 2048,
			IsOnEnableCalled: 4096,
			IsOnLoadCalled: 8192,
			IsOnStartCalled: 16384,
			IsEditorOnEnabledCalled: 32768
		};
	z.Hide = z.HideInGame | z.HideInEditor, l._ObjectFlags = z;
	var A = ~(u | x | z.Destroying | y | z.IsOnEnableCalled | z.IsEditorOnEnabledCalled | z.IsOnLoadCalled | z.IsOnStartCalled),
		B = l.JS = {
			addon: function (a) {
				"use strict";
				a = a || {};
				for (var c = 1, d = arguments.length; d > c; c++) {
					var e = arguments[c];
					for (var f in e) f in a || b(f, e, a)
				}
				return a
			},
			mixin: function (a) {
				"use strict";
				a = a || {};
				for (var c = 1, d = arguments.length; d > c; c++) {
					var e = arguments[c];
					if (e) {
						if ("object" != typeof e) {
							l.error("Fire.mixin called on non-object:", e);
							continue
						}
						for (var f in e) b(f, e, a)
					}
				}
				return a
			},
			extend: function (a, b) {
				function c() {
					this.constructor = a
				}
				if (!b) return void l.error("The base class to extend from must be non-nil");
				if (!a) return void l.error("The class to extend must be non-nil");
				for (var d in b) b.hasOwnProperty(d) && (a[d] = b[d]);
				return c.prototype = b.prototype, a.prototype = new c, a
			},
			clear: function (a) {
				for (var b = Object.keys(a), c = 0; c < b.length; c++) delete a[b[c]]
			}
		};
	B.getClassName = function (a) {
			if ("function" == typeof a && a.prototype.__classname__) return a.prototype.__classname__;
			if (a && a.constructor) {
				if (a.constructor.prototype && a.constructor.prototype.hasOwnProperty("__classname__")) return a.__classname__;
				var b;
				if (a.constructor.name && (b = a.constructor.name), a.constructor.toString) {
					var c, d = a.constructor.toString();
					c = d.match("[" === d.charAt(0) ? /\[\w+\s*(\w+)\]/ : /function\s*(\w+)/), c && 2 === c.length && (b = c[1])
				}
				return "Object" !== b ? b : null
			}
			return null
		},
		function () {
			function a(a, b) {
				return function (c, d) {
					if (d.prototype.hasOwnProperty(a) && delete b[d.prototype[a]], d.prototype[a] = c, c) {
						var e = b[c];
						if (e && e !== d) {
							var f = "A Class already exists with the same " + a + ' : "' + c + '".';
							l.isEditor || (f += ' (This may be caused by error of unit test.) If you dont need serialization, you can set class id to "". You can also call Fire.unregisterClass to remove the id of unused class'), l.error(f)
						}
						else b[c] = d
					}
				}
			}
			var b = {},
				c = {};
			B._setClassId = a("__cid__", b);
			var d = a("__classname__", c);
			B.setClassName = function (a, b) {
				d(a, b), a && !b.prototype.hasOwnProperty("__cid__") && B._setClassId(a, b)
			}, B.unregisterClass = function (a) {
				"use strict";
				for (var d = 0; d < arguments.length; d++) {
					var e = arguments[d].prototype,
						f = e.__cid__;
					f && delete b[f];
					var g = e.__classname__;
					g && delete c[g]
				}
			}, B._getClassById = function (a) {
				var c = b[a];
				return c || 32 === a.length && (c = b[m.compressUuid(a)]), c
			}, B.getClassByName = function (a) {
				return c[a]
			}, B._getClassId = function (a) {
				return "function" == typeof a && a.prototype.__cid__ ? a.prototype.__cid__ : a && a.constructor && a.constructor.prototype && a.constructor.prototype.hasOwnProperty("__cid__") ? a.__cid__ : ""
			}, Object.defineProperty(B, "_registeredClassIds", {
				get: function () {
					var a = {};
					for (var c in b) a[c] = b[c];
					return a
				},
				set: function (a) {
					B.clear(b);
					for (var c in a) b[c] = a[c]
				}
			}), Object.defineProperty(B, "_registeredClassNames", {
				get: function () {
					var a = {};
					for (var b in c) a[b] = c[b];
					return a
				},
				set: function (a) {
					B.clear(c);
					for (var b in a) c[b] = a[b]
				}
			})
		}(), B.getset = function (a, b, c, d) {
			Object.defineProperty(a, b, {
				get: c,
				set: d
			})
		}, B.get = function (a, b, c) {
			Object.defineProperty(a, b, {
				get: c
			})
		}, B.set = function (a, b, c) {
			Object.defineProperty(a, b, {
				set: c
			})
		}, l.log = function () {
			console.log.apply(console, arguments)
		}, l.info = function () {
			(console.info || console.log).apply(console, arguments)
		}, l.warn = function () {
			console.warn.apply(console, arguments)
		}, l.error = console.error.bind ? console.error.bind(console) : function () {
			console.error.apply(console, arguments)
		}, l.defineEnum = function (a) {
			var b = {};
			Object.defineProperty(b, "__enums__", {
				value: void 0,
				writable: !0
			});
			var c = -1;
			for (var d in a) {
				var e = a[d]; - 1 === e ? e = ++c : c = e, b[d] = e;
				var f = "" + e;
				d !== f && Object.defineProperty(b, f, {
					value: d,
					enumerable: !1
				})
			}
			return b
		};
	var C = l.defineEnum({
		ZERO: -1,
		ONE: -1,
		TWO: -1,
		THREE: -1
	});
	(0 !== C.ZERO || 1 !== C.ONE || 2 !== C.TWO || 3 !== C.THREE) && l.error('Sorry, "Fire.defineEnum" not available on this platform, please report this error here: https://github.com/fireball-x/fireball/issues/new !'),
		function () {
			var a = Math.PI / 180,
				b = 180 / Math.PI;
			B.mixin(Math, {
				TWO_PI: 2 * Math.PI,
				HALF_PI: .5 * Math.PI,
				deg2rad: function (b) {
					return b * a
				},
				rad2deg: function (a) {
					return a * b
				},
				rad180: function (a) {
					return (a > Math.PI || a < -Math.PI) && (a = (a + Math.TOW_PI) % Math.TOW_PI), a
				},
				rad360: function (a) {
					return a > Math.TWO_PI ? a % Math.TOW_PI : 0 > a ? Math.TOW_PI + a % Math.TOW_PI : a
				},
				deg180: function (a) {
					return (a > 180 || -180 > a) && (a = (a + 360) % 360), a
				},
				deg360: function (a) {
					return a > 360 ? a % 360 : 0 > a ? 360 + a % 360 : a
				},
				randomRange: function (a, b) {
					return Math.random() * (b - a) + a
				},
				randomRangeInt: function (a, b) {
					return Math.floor(this.randomRange(a, b))
				},
				clamp: function (a, b, c) {
					return "number" != typeof b ? void l.error("[clamp] min value must be type number") : "number" != typeof c ? void l.error("[clamp] max value must be type number") : b > c ? void l.error("[clamp] max value must not less than min value") : Math.min(Math.max(a, b), c)
				},
				clamp01: function (a) {
					return Math.min(Math.max(a, 0), 1)
				},
				calculateMaxRect: function (a, b, c, d, e) {
					var f = Math.min(b.x, c.x, d.x, e.x),
						g = Math.max(b.x, c.x, d.x, e.x),
						h = Math.min(b.y, c.y, d.y, e.y),
						i = Math.max(b.y, c.y, d.y, e.y);
					return a.x = f, a.y = h, a.width = g - f, a.height = i - h, a
				}
			})
		}(), l.Intersection = function () {
			function a(a, b, c, d) {
				var e, f = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x),
					g = (b.x - a.x) * (a.y - c.y) - (b.y - a.y) * (a.x - c.x),
					h = (d.y - c.y) * (b.x - a.x) - (d.x - c.x) * (b.y - a.y);
				if (0 !== h) {
					var i = f / h,
						j = g / h;
					if (i >= 0 && 1 >= i && j >= 0 && 1 >= j) return !0
				}
				return !1
			}

			function b(b, c, d) {
				var e = new l.Vec2(d.x, d.y),
					f = new l.Vec2(d.x, d.yMax),
					g = new l.Vec2(d.xMax, d.yMax),
					h = new l.Vec2(d.xMax, d.y);
				return a(b, c, e, f) ? !0 : a(b, c, f, g) ? !0 : a(b, c, g, h) ? !0 : a(b, c, h, e) ? !0 : !1
			}

			function c(b, c, d) {
				for (var e = d.points.length, f = 0; e > f; ++f) {
					var g = d.points[f],
						h = d.points[(f + 1) % e];
					if (a(b, c, g, h)) return !0
				}
				return !1
			}

			function d(a, b) {
				var c = a.x,
					d = a.y,
					e = a.x + a.width,
					f = a.y + a.height,
					g = b.x,
					h = b.y,
					i = b.x + b.width,
					j = b.y + b.height;
				return i >= c && e >= g && j >= d && f >= h
			}

			function e(a, b) {
				var d, e = new l.Vec2(a.x, a.y),
					f = new l.Vec2(a.x, a.yMax),
					g = new l.Vec2(a.xMax, a.yMax),
					h = new l.Vec2(a.xMax, a.y);
				if (c(e, f, b)) return !0;
				if (c(f, g, b)) return !0;
				if (c(g, h, b)) return !0;
				if (c(h, e, b)) return !0;
				for (d = 0; d < b.points.length; ++d)
					if (a.contains(b.points[d])) return !0;
				return b.contains(e) ? !0 : b.contains(f) ? !0 : b.contains(g) ? !0 : b.contains(h) ? !0 : !1
			}

			function f(a, b) {
				var d;
				for (d = 0; d < length; ++d) {
					var e = a.points[d],
						f = a.points[(d + 1) % length];
					if (c(e, f, b)) return !0
				}
				for (d = 0; d < b.points.length; ++d)
					if (a.contains(b.points[d])) return !0;
				for (d = 0; d < a.points.length; ++d)
					if (b.contains(a.points[d])) return !0;
				return !1
			}
			var g = {};
			return g.lineLine = a, g.lineRect = b, g.linePolygon = c, g.rectRect = d, g.rectPolygon = e, g.polygonPolygon = f, g
		}(),
		function () {
			var a = function () {
				this._callbackTable = {}
			};
			l._CallbacksHandler = a, a.prototype.add = function (a, b) {
				var c = this._callbackTable[a];
				return "undefined" != typeof c ? (b && (null !== c ? c.push(b) : (c = [b], this._callbackTable[a] = c)), !1) : (c = b ? [b] : null, this._callbackTable[a] = c, !0)
			}, a.prototype.has = function (a, b) {
				var c = this._callbackTable[a];
				return c && c.length > 0 ? b ? -1 !== c.indexOf(b) : !0 : !1
			}, a.prototype.removeAll = function (a) {
				delete this._callbackTable[a]
			}, a.prototype.remove = function (a, b) {
				var c = this._callbackTable[a];
				if (c) {
					var d = c.indexOf(b);
					if (-1 !== d) return c.splice(d, 1), !0
				}
				return !1
			};
			var b = function () {
				this._callbackTable = {}
			};
			return B.extend(b, a), l.CallbacksInvoker = b, b.prototype.invoke = function (a, b, c, d, e, f) {
				var g = this._callbackTable[a];
				if (g)
					for (var h = 0; h < g.length; h++) g[h](b, c, d, e, f)
			}, b.prototype.invokeAndRemove = function (a, b, c, d, e, f) {
				var g = this._callbackTable[a];
				if (g)
					for (var h = 0; h < g.length; h++) g[h](b, c, d, e, f);
				this.removeAll(a)
			}, b.prototype.bindKey = function (a, b) {
				var c = this;
				return function d(e, f, g, h, i) {
					var j = c._callbackTable[a];
					if (j)
						for (var k = 0; k < j.length; k++) j[k](e, f, g, h, i);
					b && c.removeAll(a)
				}
			}, b
		}(), l.padLeft = function (a, b, c) {
			return a = a.toString(), b -= a.length, b > 0 ? new Array(b + 1).join(c) + a : a
		}, l.fitRatio = function (a, b, c) {
			var d, e;
			return a > 1 ? (d = b, e = d / a) : (e = c, d = e * a), l.fitSize(d, e, b, c)
		}, l.fitSize = function (a, b, c, d) {
			var e, f;
			return a > c && b > d ? (e = c, f = b * c / a, f > d && (f = d, e = a * d / b)) : a > c ? (e = c, f = b * c / a) : b > d ? (e = a * d / b, f = d) : (e = a, f = b), [e, f]
		}, l.getEnumList = function (a) {
			if (void 0 !== a.__enums__) return a.__enums__;
			var b = [];
			for (var c in a)
				if (a.hasOwnProperty(c)) {
					var d = a[c],
						e = "number" == typeof d && (0 | d) === d;
					e && b.push({
						name: c,
						value: d
					})
				}
			return b.sort(function (a, b) {
				return a.value - b.value
			}), a.__enums__ = b, b
		}, l.getVarFrom = function (a, b) {
			for (var c = b.split("."), d = a, e = 0; e < c.length; ++e) {
				var f = c[e];
				if (d = d[f], void 0 === d || null === d) return null
			}
			return d
		}, l.rgb2hsv = function (a, b, c) {
			var d = {
					h: 0,
					s: 0,
					v: 0
				},
				e = Math.max(a, b, c),
				f = Math.min(a, b, c),
				g = 0;
			return d.v = e, d.s = e ? (e - f) / e : 0, d.s ? (g = e - f, d.h = a === e ? (b - c) / g : b === e ? 2 + (c - a) / g : 4 + (a - b) / g, d.h /= 6, d.h < 0 && (d.h += 1)) : d.h = 0, d
		}, l.hsv2rgb = function (a, b, c) {
			var d = {
				r: 0,
				g: 0,
				b: 0
			};
			if (0 === b) d.r = d.g = d.b = c;
			else if (0 === c) d.r = d.g = d.b = 0;
			else {
				1 === a && (a = 0), a *= 6, b = b, c = c;
				var e = Math.floor(a),
					f = a - e,
					g = c * (1 - b),
					h = c * (1 - b * f),
					i = c * (1 - b * (1 - f));
				switch (e) {
				case 0:
					d.r = c, d.g = i, d.b = g;
					break;
				case 1:
					d.r = h, d.g = c, d.b = g;
					break;
				case 2:
					d.r = g, d.g = c, d.b = i;
					break;
				case 3:
					d.r = g, d.g = h, d.b = c;
					break;
				case 4:
					d.r = i, d.g = g, d.b = c;
					break;
				case 5:
					d.r = c, d.g = g, d.b = h
				}
			}
			return d
		};
	var D = function (a) {
			if (!a || a.constructor !== {}.constructor) return !1;
			for (var b in a) return !1;
			return !0
		},
		E = function (a) {
			return a && "function" == typeof a.clone && (a.constructor.prototype.hasOwnProperty("clone") || a.hasOwnProperty("clone"))
		};
	l.attr = function (a, b, c) {
		var d = "_attr$" + b,
			e, f, g;
		if ("function" == typeof a) {
			if (e = a.prototype, f = e[d], "undefined" != typeof c) {
				if ("object" != typeof c) return e[d] = c, c;
				f || (e[d] = f = {});
				for (g in c) "_" !== g[0] && (f[g] = c[g])
			}
			return f
		}
		if (e = a, "undefined" != typeof c) {
			if ("object" == typeof c) {
				e.hasOwnProperty(d) && (f = e[d]), f || (e[d] = f = {});
				for (g in c) "_" !== g[0] && (f[g] = c[g]);
				return B.addon({}, f, e.constructor.prototype[d])
			}
			return e[d] = c, c
		}
		return f = e[d], "object" == typeof f ? B.addon({}, f, e.constructor.prototype[d]) : f
	}, l.NonSerialized = {
		serializable: !1,
		_canUsedInGetter: !1
	}, l.EditorOnly = {
		editorOnly: !0,
		_canUsedInGetter: !1
	}, l.Integer = "Integer", l.Integer_Obsoleted = {
		type: "int"
	}, l.Float = "Float", l.Float_Obsoleted = {
		type: "float"
	}, l.SingleText = {
		textMode: "single"
	}, l.MultiText = {
		textMode: "multi"
	}, l.Boolean = "Boolean", l.Boolean_Obsoleted = {
		type: "boolean",
		_onAfterProp: d("boolean", "Fire.Boolean")
	}, l.String = "String", l.String_Obsoleted = {
		type: "string",
		_onAfterProp: d("string", "Fire.String")
	}, Object.defineProperty(l, "_ScriptUuid", {
		get: function () {
			var a = l.ObjectType(l.ScriptAsset);
			return a.type = "script-uuid", a
		}
	}), l.ObjectType = function (a) {
		return a ? "function" != typeof a ? void l.warn("Argument for Fire.ObjectType must be function type") : {
			type: "object",
			ctor: a,
			_onAfterProp: function (b, c) {
				var e = d("object", "Fire.ObjectType", a);
				e(b, c);
				var f = l.attr(b, c) || {};
				if (!Array.isArray(f["default"]) && "function" == typeof a.prototype.clone) {
					var g = B.getClassName(a),
						h = null === f["default"] || void 0 === f["default"];
					h ? l.warn('%s is a ValueType, no need to specify the "type" of "%s.%s", because the type information can obtain from its default value directly.', g, B.getClassName(b), c, g) : l.warn('%s is a ValueType, no need to specify the "type" of "%s.%s", just set the default value to "new %s()" and it will be handled properly.', g, B.getClassName(b), c, g)
				}
			}
		} : void l.warn("Argument for Fire.ObjectType must be non-nil")
	}, l.Enum = function (a) {
		return {
			type: "enum",
			enumList: l.getEnumList(a)
		}
	}, l.RawType = function (a) {
		var b = ["image", "json", "text", "audio"];
		return {
			rawType: a,
			serializable: !1,
			_canUsedInGetter: !1,
			_onAfterProp: function (a, c) {
				var d = function g(a) {
					if (!l.isChildClassOf(a, O)) return l.error("RawType is only available for Assets"), !1;
					for (var b = !1, c = 0; c < a.__props__.length; c++) {
						var d = a.__props__[c],
							e = l.attr(a, d),
							f = e.rawType;
						if (f) {
							var g = f.toLowerCase() !== f;
							if (g) return l.error("RawType name cannot contain uppercase"), !1;
							if (b) return l.error("Each asset cannot have more than one RawType"), !1;
							b = !0
						}
					}
					return !0
				}(a);
				if (d) {
					var e = l.attr(a, c) || {},
						f = -1 !== b.indexOf(e.rawType);
					f && a.prop("_rawext", "", l.HideInInspector)
				}
			}
		}
	}, l.Custom = function (a) {
		return {
			custom: a
		}
	}, l.HideInInspector = {
		hideInInspector: !0
	}, l.DisplayName = function (a) {
		return {
			displayName: a
		}
	}, l.ReadOnly = {
		readOnly: !0
	}, l.Tooltip = function (a) {
		return {
			tooltip: a
		}
	}, l.Nullable = function (a, b) {
		return {
			nullable: a,
			_onAfterProp: function (c, d) {
				c.prop(a, b, l.HideInInspector);
				var e = l.attr(c, d) || {};
				e.serializable === !1 ? l.attr(c, a, l.NonSerialized) : e.editorOnly && l.attr(c, a, l.EditorOnly)
			}
		}
	}, l.Watch = function (a, b) {
		return {
			watch: [].concat(a),
			watchCallback: b
		}
	}, l.Range = function (a, b) {
		return {
			min: a,
			max: b
		}
	};
	var F = function (a) {
			if (this.__props__) {
				var b = this.__props__.indexOf(a);
				0 > b && this.__props__.push(a)
			}
			else this.__props__ = [a]
		},
		G = {
			__props__: null,
			prop: function (a, b, c) {
				"use strict";
				if ("object" == typeof b && b)
					if (Array.isArray(b)) {
						if (b.length > 0) return l.error("Default array must be empty, set default value of " + B.getClassName(this) + '.prop("' + a + '", ...) to null or [], and initialize in constructor please. (just like "this.' + a + ' = [...];")'), this
					}
				else if (!D(b) && !E(b)) return l.error('Do not set default value to non-empty object, unless the object defines its own "clone" function. Set default value of ' + B.getClassName(this) + '.prop("' + a + '", ...) to null or {}, and initialize in constructor please. (just like "this.' + a + ' = {foo: bar};")'), this;
				for (var d = this.$super; d; d = d.$super)
					if (d.prototype.hasOwnProperty(a)) return void l.error("Can not declare " + B.getClassName(this) + "." + a + ", it is already defined in the prototype of " + B.getClassName(d));
				if (l.attr(this, a, {
						"default": b
					}), F.call(this, a), c) {
					for (var e = null, f = 2, g = f; g < arguments.length; g++) {
						var h = arguments[g];
						l.attr(this, a, h), h._onAfterProp && (e = e || [], e.push(h._onAfterProp))
					}
					if (e)
						for (var i = 0; i < e.length; i++) e[i](this, a)
				}
				return this
			},
			get: function (a, b, c) {
				"use strict";
				var d = Object.getOwnPropertyDescriptor(this.prototype, a);
				if (d && d.get) return l.error(B.getClassName(this) + ': the getter of "' + a + '" is already defined!'), this;
				if (c)
					for (var e = 2, f = e; f < arguments.length; f++) {
						var g = arguments[f];
						if (g._canUsedInGetter !== !1) {
							if (l.attr(this, a, g), (g.serializable === !1 || g.editorOnly === !0) && l.warn("No need to use Fire.NonSerialized or Fire.EditorOnly for the getter of " + B.getClassName(this) + "." + a + ", every getter is actually non-serialized."), g.hasOwnProperty("default")) return l.error(B.getClassName(this) + ": Can not set default value of a getter!"), this
						}
						else l.error('Can not apply the specified attribute to the getter of "' + B.getClassName(this) + "." + a + '", attribute index: ' + (f - e))
					}
				return l.attr(this, a, l.NonSerialized), F.call(this, a), Object.defineProperty(this.prototype, a, {
					get: b,
					configurable: !0
				}), l.attr(this, a, {
					hasGetter: !0
				}), this
			},
			set: function (a, b) {
				var c = Object.getOwnPropertyDescriptor(this.prototype, a);
				return c && c.set ? (l.error(B.getClassName(this) + ': the setter of "' + a + '" is already defined!'), this) : (Object.defineProperty(this.prototype, a, {
					set: function d(c) {
						this._observing && Object.getNotifier(this).notify({
							type: "update",
							name: a,
							oldValue: this[a]
						}), b.call(this, c)
					},
					configurable: !0
				}), l.attr(this, a, {
					hasSetter: !0
				}), this)
			},
			getset: function (a, b, c, d) {
				"use strict";
				if (d) {
					var e = [].slice.call(arguments);
					e.splice(2, 1), this.get.apply(this, e)
				}
				else this.get(a, b);
				return this.set(a, c), this
			}
		},
		H = function (a, b) {
			var c = b.__props__;
			if (c)
				for (var d = 0; d < c.length; d++) {
					var e = c[d],
						f = l.attr(b, e);
					if (f && f.hasOwnProperty("default")) {
						var g = f["default"];
						"object" == typeof g && g && (g = g.clone ? g.clone() : Array.isArray(g) ? [] : {}), a[e] = g
					}
				}
		};
	l._isFireClass = function (a) {
		return !!a && a.prop === G.prop
	}, l.isChildClassOf = function (a, b) {
		if (a && b) {
			if ("function" != typeof a) return l.warn("[isChildClassOf] subclass should be function type, not", a), !1;
			if ("function" != typeof b) return l.warn("[isChildClassOf] superclass should be function type, not", b), !1;
			for (; a && a.$super; a = a.$super)
				if (a === b) return !0;
			if (a === b) return !0;
			for (var c = Object.getPrototypeOf(a.prototype); c;) {
				if (a = c.constructor, a === b) return !0;
				c = Object.getPrototypeOf(a.prototype)
			}
		}
		return !1
	}, l._doDefine = function (a, b, c) {
		var d = f(c, b);
		return e(a, d), b && (B.extend(d, b), d.$super = b, b.__props__ && (d.__props__ = b.__props__.slice())), B.setClassName(a, d), h(d, a), d
	}, l.define = function (a, b) {
		return l.extend(a, null, b)
	}, l.extend = function (a, b, c) {
		if ("function" == typeof a) {
			if (c) return l.error("[Fire.extend] invalid type of arguments"), null;
			c = b, b = a, a = ""
		}
		return "string" == typeof a ? l._doDefine(a, b, c) : "undefined" == typeof a ? l._doDefine("", b, c) : (a && l.error("[Fire.extend] unknown typeof first argument:" + a), null)
	}, l._fastDefine = function (a, b, c) {
		B.setClassName(a, b), b.__props__ = c;
		for (var d = 0; d < c.length; d++) l.attr(b, c[d], l.HideInInspector)
	}, l.Class = function (a) {
		if (0 === arguments.length) return l.define();
		if (!a) return l.error("[Fire.Class] Option must be non-nil"), l.define();
		var b = a.name,
			c = a["extends"],
			d = a.hasOwnProperty("constructor") && a.constructor || void 0,
			e;
		c ? b ? e = l.extend(b, c, d) : (e = l.extend(c, d), b = l.JS.getClassName(e)) : b ? e = l.define(b, d) : (e = l.define(d), b = l.JS.getClassName(e));
		var f = a.properties;
		if (f)
			for (var g in f) {
				var h = f[g],
					j = h && "object" == typeof h && !Array.isArray(h),
					k = j && h.constructor === {}.constructor;
				k || (h = {
					"default": h
				});
				var m = i(h, b, g);
				if (h.hasOwnProperty("default")) e.prop.apply(e, [g, h["default"]].concat(m));
				else {
					var n = h.get,
						o = h.set;
					n || o || l.error('Property %s.%s must define at least one of "default", "get" or "set".', b, g), n && e.get.apply(e, [g, n].concat(m)), o && e.set(g, o)
				}
			}
		var p = a.statics;
		if (p) {
			var q = ["name", "__ctors__", "__props__", "arguments", "call", "apply", "caller", "get", "getset", "length", "prop", "prototype", "set"];
			for (var r in p) - 1 === q.indexOf(r) ? e[r] = p[r] : l.error('Cannot define %s.%s because static member name can not be "%s".', b, r, r)
		}
		var s = ["name", "extends", "constructor", "properties", "statics"];
		for (var t in a)
			if (-1 === s.indexOf(t)) {
				var u = a[t],
					v = typeof u;
				if ("function" === v) e.prototype[t] = u;
				else {
					var w = {
							extend: "extends",
							property: "properties",
							"static": "statics"
						},
						x = w[t];
					x ? l.warn('Unknown parameter of %s.%s, maybe you want is "%s".', b, t, x) : l.error("Unknown parameter of %s.%s", b, t)
				}
			}
		return e
	};
	var I = [];
	l.Path = l.isNode ? require("path") : function () {
		var a;
		if (l.isWin32) {
			var b = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/,
				c = /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;
			a = function (a) {
				var d = b.exec(a),
					e = (d[1] || "") + (d[2] || ""),
					f = d[3] || "",
					g = c.exec(f),
					h = g[1],
					i = g[2],
					j = g[3];
				return [e, h, i, j]
			}
		}
		else {
			var d = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
			a = function (a) {
				return d.exec(a).slice(1)
			}
		}
		return path = {
			basename: function (a) {
				return a.replace(/^.*(\\|\/|\:)/, "")
			},
			extname: function (a) {
				return a.substring((~-a.lastIndexOf(".") >>> 0) + 1)
			},
			dirname: function (b) {
				var c = a(b),
					d = c[0],
					e = c[1];
				return d || e ? (e && (e = e.substr(0, e.length - 1)), d + e) : "."
			},
			sep: l.isWin32 ? "\\" : "/"
		}, path
	}(), l.Path.setExtname = function (a, b) {
		var c = (~-a.lastIndexOf(".") >>> 0) + 1;
		return a.substring(0, c) + b
	}, l.Path.setEndWithSep = function (a, b) {
		b = "undefined" != typeof b ? b : !0;
		var c = a[a.length - 1],
			d = "\\" === c || "/" === c;
		return !d && b ? a += l.Path.sep : d && !b && (a = a.substring(0, a.length - 1)), a
	}, FObject = function () {
		function a() {
			this._name = "", this._objFlags = 0
		}
		l._fastDefine("Fire.FObject", a, ["_name", "_objFlags"]);
		var b = [];
		return Object.defineProperty(a, "_deferredDestroy", {
			value: function () {
				for (var a = b.length, c = 0; a > c; ++c) {
					var d = b[c];
					d._objFlags & t || d._destroyImmediate()
				}
				a === b.length ? b.length = 0 : b.splice(0, a)
			},
			enumerable: !1
		}), Object.defineProperty(a.prototype, "name", {
			get: function () {
				return this._name
			},
			set: function (a) {
				this._name = a
			},
			enumerable: !1
		}), Object.defineProperty(a.prototype, "isValid", {
			get: function () {
				return !(this._objFlags & t)
			}
		}), a.prototype.destroy = function () {
			return this._objFlags & t ? (l.error("object already destroyed"), !1) : this._objFlags & u ? !1 : (this._objFlags |= u, b.push(this), !0)
		}, a.prototype._destruct = function () {
			for (var a in this)
				if (this.hasOwnProperty(a)) {
					var b = typeof this[a];
					switch (b) {
					case "string":
						this[a] = "";
						break;
					case "object":
						this[a] = null;
						break;
					case "function":
						this[a] = null
					}
				}
		}, a.prototype._onPreDestroy = null, a.prototype._destroyImmediate = function () {
			return this._objFlags & t ? void l.error("object already destroyed") : (this._onPreDestroy && this._onPreDestroy(), this._destruct(), void(this._objFlags |= t))
		}, a
	}(), l.isValid = function (a) {
		return !(!a || a._objFlags & t)
	}, l.FObject = FObject;
	var J = function () {
		var a = l.extend("Fire.HashObject", l.FObject, function () {
				Object.defineProperty(this, "_hashCode", {
					value: 0,
					writable: !0,
					enumerable: !1
				}), Object.defineProperty(this, "_id", {
					value: "",
					writable: !0,
					enumerable: !1
				})
			}),
			b = 0;
		return Object.defineProperty(a.prototype, "hashCode", {
			get: function () {
				return this._hashCode || (this._hashCode = ++b)
			}
		}), Object.defineProperty(a.prototype, "id", {
			get: function () {
				return this._id || (this._id = "" + this.hashCode)
			}
		}), a
	}();
	l.HashObject = J, Vec2 = function () {
		function a(a, b) {
			this.x = "number" == typeof a ? a : 0, this.y = "number" == typeof b ? b : 0
		}
		return B.setClassName("Fire.Vec2", a), Object.defineProperty(a, "one", {
			get: function () {
				return new a(1, 1)
			}
		}), Object.defineProperty(a, "zero", {
			get: function () {
				return new a(0, 0)
			}
		}), Object.defineProperty(a, "up", {
			get: function () {
				return new a(0, 1)
			}
		}), Object.defineProperty(a, "right", {
			get: function () {
				return new a(1, 0)
			}
		}), a.prototype.clone = function () {
			return new a(this.x, this.y)
		}, a.prototype.set = function (a) {
			return this.x = a.x, this.y = a.y, this
		}, a.prototype.equals = function (b) {
			return b && b instanceof a ? this.x === b.x && this.y === b.y : !1
		}, a.prototype.toString = function () {
			return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ")"
		}, a.prototype.addSelf = function (a) {
			return this.x += a.x, this.y += a.y, this
		}, a.prototype.add = function (b, c) {
			return c = c || new a, c.x = this.x + b.x, c.y = this.y + b.y, c
		}, a.prototype.subSelf = function (a) {
			return this.x -= a.x, this.y -= a.y, this
		}, a.prototype.sub = function (b, c) {
			return c = c || new a, c.x = this.x - b.x, c.y = this.y - b.y, c
		}, a.prototype.mulSelf = function (a) {
			return this.x *= a, this.y *= a, this
		}, a.prototype.mul = function (b, c) {
			return c = c || new a, c.x = this.x * b, c.y = this.y * b, c
		}, a.prototype.scaleSelf = function (a) {
			return this.x *= a.x, this.y *= a.y, this
		}, a.prototype.scale = function (b, c) {
			return c = c || new a, c.x = this.x * b.x, c.y = this.y * b.y, c
		}, a.prototype.divSelf = function (a) {
			return this.x /= a.x, this.y /= a.y, this
		}, a.prototype.div = function (b, c) {
			return c = c || new a, c.x = this.x / b.x, c.y = this.y / b.y, c
		}, a.prototype.negSelf = function () {
			return this.x = -this.x, this.y = -this.y, this
		}, a.prototype.neg = function (b) {
			return b = b || new a, b.x = -this.x, b.y = -this.y, b
		}, a.prototype.dot = function (a) {
			return this.x * a.x + this.y * a.y
		}, a.prototype.cross = function (a) {
			return this.y * a.x - this.x * a.y
		}, a.prototype.mag = function () {
			return Math.sqrt(this.x * this.x + this.y * this.y)
		}, a.prototype.magSqr = function () {
			return this.x * this.x + this.y * this.y
		}, a.prototype.normalizeSelf = function () {
			var a = this.x * this.x + this.y * this.y;
			if (1 === a) return this;
			if (0 === a) return console.warn("Can't normalize zero vector"), this;
			var b = 1 / Math.sqrt(a);
			return this.x *= b, this.y *= b, this
		}, a.prototype.normalize = function (b) {
			return b = b || new a, b.x = this.x, b.y = this.y, b.normalizeSelf(), b
		}, a.prototype.angle = function (a) {
			var b = this.magSqr(),
				c = a.magSqr();
			if (0 === b || 0 === c) return console.warn("Can't get angle between zero vector"), 0;
			var d = this.dot(a),
				e = d / Math.sqrt(b * c);
			return e = Math.clamp(e, -1, 1), Math.acos(e)
		}, a.prototype.signAngle = function (a) {
			return Math.atan2(this.y, this.x) - Math.atan2(a.y, a.x)
		}, a.prototype.rotate = function (b, c) {
			return c = c || new a, c.x = this.x, c.y = this.y, c.rotateSelf(b)
		}, a.prototype.rotateSelf = function (a) {
			var b = Math.sin(a),
				c = Math.cos(a),
				d = this.x;
			return this.x = c * d - b * this.y, this.y = b * d + c * this.y, this
		}, a
	}(), l.Vec2 = Vec2, l.v2 = function ib(a, b) {
		return Array.isArray(a) ? new Vec2(a[0], a[1]) : new Vec2(a, b)
	};
	var K = function () {
		this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0
	};
	B.setClassName("Fire.Matrix23", K), l.Matrix23 = K, K.identity = new K, K.prototype.clone = function () {
		var a = new K;
		return a.a = this.a, a.b = this.b, a.c = this.c, a.d = this.d, a.tx = this.tx, a.ty = this.ty, a
	}, K.prototype.set = function (a) {
		return this.a = a.a, this.b = a.b, this.c = a.c, this.d = a.d, this.tx = a.tx, this.ty = a.ty, this
	}, K.prototype.equals = function (a) {
		return this.a === a.a && this.b === a.b && this.c === a.c && this.d === a.d && this.tx === a.tx && this.ty === a.ty
	}, K.prototype.toString = function () {
		return "|" + this.a.toFixed(2) + " " + this.c.toFixed(2) + " " + this.tx.toFixed(2) + "|\n|" + this.b.toFixed(2) + " " + this.d.toFixed(2) + " " + this.ty.toFixed(2) + "|\n|0.00 0.00 1.00|"
	}, K.prototype.identity = function () {
		return this.a = 1, this.b = 0, this.c = 0, this.d = 1, this.tx = 0, this.ty = 0, this
	}, K.prototype.prepend = function (a) {
		var b = a.a,
			c = a.b,
			d = a.c,
			e = a.d;
		if (1 !== b || 0 !== c || 0 !== d || 1 !== e) {
			var f = this.a,
				g = this.c;
			this.a = f * b + this.b * d, this.b = f * c + this.b * e, this.c = g * b + this.d * d, this.d = g * c + this.d * e;
			var h = this.tx;
			this.tx = h * b + this.ty * d + a.tx, this.ty = h * c + this.ty * e + a.ty
		}
		else this.tx += a.tx, this.ty += a.ty;
		return this
	}, K.prototype.invert = function () {
		var a = this.a,
			b = this.b,
			c = this.c,
			d = this.d,
			e = this.tx,
			f = 1 / (a * d - b * c);
		return this.a = d * f, this.b = -b * f, this.c = -c * f, this.d = a * f, this.tx = (c * this.ty - d * e) * f, this.ty = (b * e - a * this.ty) * f, this
	}, K.prototype.transformPoint = function (a, b) {
		b = b || new Vec2;
		var c = a.x;
		return b.x = this.a * c + this.c * a.y + this.tx, b.y = this.b * c + this.d * a.y + this.ty, b
	}, K.prototype.getScale = function (a) {
		return a = a || new Vec2, a.x = Math.sqrt(this.a * this.a + this.b * this.b), a.y = Math.sqrt(this.c * this.c + this.d * this.d), a
	}, K.prototype.setScale = function (a) {
		var b = this.getScale(),
			c = a.x / b.x,
			d = a.y / b.y;
		return this.a *= c, this.b *= c, this.c *= d, this.d *= d, this
	}, K.prototype.getRotation = function () {
		var a = this.b / this.a !== -this.c / this.d;
		return a ? .5 * (Math.atan2(this.b, this.a) + Math.atan2(-this.c, this.d)) : Math.atan2(-this.c, this.d)
	}, K.prototype.getTranslation = function (a) {
		return a = a || new Vec2, a.x = this.tx, a.y = this.ty, a
	}, K.prototype.rotate = function (a) {
		var b = Math.sin(a),
			c = Math.cos(a),
			d = this.a,
			e = this.b;
		return this.a = d * c + this.c * b, this.b = e * c + this.d * b, this.c = this.c * c - d * b, this.d = this.d * c - e * b, this
	};
	var L = function () {
		function a(a, b, c, d) {
			this.x = "number" == typeof a ? a : 0, this.y = "number" == typeof b ? b : 0, this.width = "number" == typeof c ? c : 0, this.height = "number" == typeof d ? d : 0
		}
		return B.setClassName("Fire.Rect", a), a.fromMinMax = function (b, c) {
			var d = Math.min(b.x, c.x),
				e = Math.min(b.y, c.y),
				f = Math.max(b.x, c.x),
				g = Math.max(b.y, c.y);
			return new a(d, e, f - d, g - e)
		}, a.fromVec2 = function (b, c) {
			return new a(b.x, b.y, c.x, c.y)
		}, a.contain = function b(a, c) {
			return a.x <= c.x && a.x + a.width >= c.x + c.width && a.y <= c.y && a.y + a.height >= c.y + c.height ? 1 : c.x <= a.x && c.x + c.width >= a.x + a.width && c.y <= a.y && c.y + c.height >= a.y + a.height ? -1 : 0
		}, a.prototype.clone = function () {
			return new a(this.x, this.y, this.width, this.height)
		}, a.prototype.equals = function (a) {
			return this.x === a.x && this.y === a.y && this.width === a.width && this.height === a.height
		}, a.prototype.toString = function () {
			return "(" + this.x.toFixed(2) + ", " + this.y.toFixed(2) + ", " + this.width.toFixed(2) + ", " + this.height.toFixed(2) + ")"
		}, Object.defineProperty(a.prototype, "xMin", {
			get: function () {
				return this.x
			},
			set: function (a) {
				this.width += this.x - a, this.x = a
			}
		}), Object.defineProperty(a.prototype, "yMin", {
			get: function () {
				return this.y
			},
			set: function (a) {
				this.height += this.y - a, this.y = a
			}
		}), Object.defineProperty(a.prototype, "xMax", {
			get: function () {
				return this.x + this.width
			},
			set: function (a) {
				this.width = a - this.x
			}
		}), Object.defineProperty(a.prototype, "yMax", {
			get: function () {
				return this.y + this.height
			},
			set: function (a) {
				this.height = a - this.y
			}
		}), Object.defineProperty(a.prototype, "center", {
			get: function () {
				return new l.Vec2(this.x + .5 * this.width, this.y + .5 * this.height)
			},
			set: function (a) {
				this.x = a.x - .5 * this.width, this.y = a.y - .5 * this.height
			}
		}), a.prototype.intersects = function (a) {
			return l.Intersection.rectRect(this, a)
		}, a.prototype.contains = function (a) {
			return this.x <= a.x && this.x + this.width >= a.x && this.y <= a.y && this.y + this.height >= a.y ? !0 : !1
		}, a.prototype.containsRect = function (a) {
			return this.x <= a.x && this.x + this.width >= a.x + a.width && this.y <= a.y && this.y + this.height >= a.y + a.height ? !0 : !1
		}, a
	}();
	l.Rect = L, l.rect = function jb(a, b, c, d) {
		return Array.isArray(a) ? new L(a[0], a[1], a[2], a[3]) : new L(a, b, c, d)
	}, l.Polygon = function () {
		function a(a) {
			this.points = a, this.points.length < 3 && console.warn("Invalid polygon, the data must contains 3 or more points.")
		}
		return B.setClassName("Fire.Polygon", a), a.prototype.intersects = function (a) {
			return Intersection.polygonPolygon(this, a)
		}, a.prototype.contains = function (a) {
			for (var b = !1, c = a.x, d = a.y, e = this.points.length, f = 0, g = e - 1; e > f; g = f++) {
				var h = this.points[f].x,
					i = this.points[f].y,
					j = this.points[g].x,
					k = this.points[g].y,
					l = i > d != k > d && (j - h) * (d - i) / (k - i) + h > c;
				l && (b = !b)
			}
			return b
		}, Object.defineProperty(a.prototype, "center", {
			get: function () {
				if (this.points.length < 3) return null;
				for (var a = this.points[0].x, b = this.points[0].y, c = this.points[0].x, d = this.points[0].y, e = 1; e < this.points.length; ++e) {
					var f = this.points[e].x,
						g = this.points[e].y;
					a > f ? a = f : f > c && (c = f), b > g ? b = g : g > d && (d = g)
				}
				return new l.Vec2(.5 * (c + a), .5 * (d + b))
			}
		}), a
	}();
	var M = function () {
		function a(a, b, c, d) {
			this.r = "number" == typeof a ? a : 0, this.g = "number" == typeof b ? b : 0, this.b = "number" == typeof c ? c : 0, this.a = "number" == typeof d ? d : 1
		}
		B.setClassName("Fire.Color", a);
		var b = {
			white: [1, 1, 1, 1],
			black: [0, 0, 0, 1],
			transparent: [0, 0, 0, 0],
			gray: [.5, .5, .5],
			red: [1, 0, 0],
			green: [0, 1, 0],
			blue: [0, 0, 1],
			yellow: [1, 235 / 255, 4 / 255],
			cyan: [0, 1, 1],
			magenta: [1, 0, 1]
		};
		for (var c in b) {
			var d = function (b, c, d, e) {
				return function () {
					return new a(b, c, d, e)
				}
			}.apply(null, b[c]);
			Object.defineProperty(a, c, {
				get: d
			})
		}
		return a.prototype.clone = function () {
			return new a(this.r, this.g, this.b, this.a)
		}, a.prototype.equals = function (a) {
			return this.r === a.r && this.g === a.g && this.b === a.b && this.a === a.a
		}, a.prototype.toString = function () {
			return "rgba(" + this.r.toFixed(2) + ", " + this.g.toFixed(2) + ", " + this.b.toFixed(2) + ", " + this.a.toFixed(2) + ")"
		}, a.prototype.toCSS = function (a) {
			return "rgba" === a ? "rgba(" + (255 * this.r | 0) + "," + (255 * this.g | 0) + "," + (255 * this.b | 0) + "," + this.a.toFixed(2) + ")" : "rgb" === a ? "rgb(" + (255 * this.r | 0) + "," + (255 * this.g | 0) + "," + (255 * this.b | 0) + ")" : "#" + this.toHEX(a)
		}, a.prototype.clamp = function () {
			this.r = Math.clamp01(this.r), this.g = Math.clamp01(this.g), this.b = Math.clamp01(this.b), this.a = Math.clamp01(this.a)
		}, a.prototype.fromHEX = function (a) {
			var b = parseInt(a.indexOf("#") > -1 ? a.substring(1) : a, 16);
			return this.r = b >> 16, this.g = (65280 & b) >> 8, this.b = 255 & b, this
		}, a.prototype.toHEX = function (a) {
			var b = [(255 * this.r | 0).toString(16), (255 * this.g | 0).toString(16), (255 * this.b | 0).toString(16)],
				c = -1;
			if ("#rgb" === a)
				for (c = 0; c < b.length; ++c) b[c].length > 1 && (b[c] = b[c][0]);
			else if ("#rrggbb" === a)
				for (c = 0; c < b.length; ++c) 1 === b[c].length && (b[c] = "0" + b[c]);
			return b.join("")
		}, a.prototype.toRGBValue = function () {
			return (255 * Math.clamp01(this.r) << 16) + (255 * Math.clamp01(this.g) << 8) + 255 * Math.clamp01(this.b)
		}, a.prototype.fromHSV = function (a, b, c) {
			var d = l.hsv2rgb(a, b, c);
			return this.r = d.r, this.g = d.g, this.b = d.b, this
		}, a.prototype.toHSV = function () {
			return l.rgb2hsv(this.r, this.g, this.b)
		}, a
	}();
	l.Color = M, l.color = function kb(a, b, c, d) {
		return Array.isArray(a) ? new M(a[0], a[1], a[2], a[3]) : new M(a, b, c, d)
	}, l.TextAlign = l.defineEnum({
		left: -1,
		center: -1,
		right: -1
	}), l.TextAnchor = function (a) {
		return a[a.topLeft = 0] = "Top Left", a[a.topCenter = 1] = "Top Center", a[a.topRight = 2] = "Top Right", a[a.midLeft = 3] = "Middle Left", a[a.midCenter = 4] = "Middle Center", a[a.midRight = 5] = "Middle Right", a[a.botLeft = 6] = "Bottom Left", a[a.botCenter = 7] = "Bottom Center", a[a.botRight = 8] = "Bottom Right", a
	}({});
	var N = function () {
		function a(a, b, c, d, e) {
			if (this._editor = d, this._classFinder = e, this._target = c, this._idList = [], this._idObjList = [], this._idPropList = [], this.result = b || new l._DeserializeInfo, Array.isArray(a)) {
				var h = a,
					i = h.length;
				this.deserializedList = new Array(i);
				for (var j = 0; i > j; j++)
					if (h[j]) {
						var k;
						k = 0 === j && c, this.deserializedList[j] = g(this, h[j], k)
					}
				this.deserializedData = i > 0 ? this.deserializedList[0] : []
			}
			else this.deserializedList = [null], this.deserializedData = a ? g(this, a, c) : null, this.deserializedList[0] = this.deserializedData;
			f(this)
		}

		function b(a, b, c, d, e) {
			var f = c.__id__;
			if ("undefined" == typeof f) {
				var h = c.__uuid__;
				h ? (a.result.uuidList.push(h), a.result.uuidObjList.push(b), a.result.uuidPropList.push(d)) : b[d] = g(a, c, e && e[d])
			}
			else {
				var i = a.deserializedList[f];
				i ? b[d] = i : (a._idList.push(f), a._idObjList.push(b), a._idPropList.push(d))
			}
		}

		function c(a, c, d) {
			for (var e in d)
				if (d.hasOwnProperty(e)) {
					var f = d[e];
					"object" != typeof f ? "__type__" !== e && (c[e] = f) : f ? f.__uuid__ || "undefined" != typeof f.__id__ ? b(a, c, f, e, a._target && c) : c[e] = g(a, f, a._target && c[e]) : c[e] = null
				}
		}

		function d(a, c, d) {
			for (var e in c) {
				var f = d[e];
				"undefined" != typeof f && d.hasOwnProperty(e) && ("object" != typeof f ? c[e] = f : f ? f.__uuid__ || "undefined" != typeof f.__id__ ? b(a, c, f, e, a._target && c) : c[e] = g(a, f, a._target && c[e]) : c[e] = null)
			}
		}

		function e(a, d, e, f, h) {
			var i = f.__props__;
			if (i) {
				for (var j = 0; j < i.length; j++) {
					var k = i[j],
						m = l.attr(f, k),
						n = m.rawType;
					if (n) a.result.rawProp && l.error("not support multi raw object in a file"), a.result.rawProp = k;
					else {
						if (m.serializable === !1) continue;
						if (!a._editor && m.editorOnly) continue;
						var o = e[k];
						"undefined" != typeof o && ("object" != typeof o ? d[k] = o : o ? o.__uuid__ || "undefined" != typeof o.__id__ ? b(a, d, o, k, h && d) : d[k] = g(a, o, h && h[k]) : d[k] = null)
					}
				}
				"_$erialized" === i[i.length - 1] && (d._$erialized = e, c(a, d._$erialized, e))
			}
		}
		var f = function (a) {
				for (var b = a.deserializedList, c = 0, d = a._idList.length; d > c; c++) {
					var e = a._idPropList[c],
						f = a._idList[c];
					a._idObjList[c][e] = b[f]
				}
			},
			g = function (a, f, h) {
				var i, j, k = null,
					m = null;
				if (f.__type__) {
					if (m = a._classFinder(f.__type__), !m) return l.error("[Fire.deserialize] unknown type: " + f.__type__), null;
					h ? (h instanceof m || l.warn("Type of target to deserialize not matched with data: target is %s, data is %s", B.getClassName(h), m), k = h) : k = new m, l._isFireClass(m) ? e(a, k, f, m, h) : d(a, k, f)
				}
				else if (Array.isArray(f)) {
					h ? (h.length = f.length, k = h) : k = new Array(f.length);
					for (var n = 0; n < f.length; n++) j = f[n], "object" == typeof j && j ? j.__uuid__ || "undefined" != typeof j.__id__ ? b(a, k, j, "" + n, h && h[n]) : k[n] = g(a, j, h && h[n]) : k[n] = j
				}
				else k = h || {}, c(a, k, f);
				return k
			};
		return a
	}();
	l.deserialize = function (a, b, c) {
		var d = c && "isEditor" in c ? c.isEditor : l.isEditor,
			e = c && c.classFinder || B._getClassById,
			f = c && c.createAssetRefs || l.isEditorCore,
			g;
		g = c && c.target, l.isNode && Buffer.isBuffer(a) && (a = a.toString()), "string" == typeof a && (a = JSON.parse(a)), f && !b && (b = new l._DeserializeInfo), l._isCloning = !0;
		var h = new N(a, b, g, d, e);
		return l._isCloning = !1, f && b.assignAssetsBy(m.serialize.asAsset), h.deserializedData
	}, l._DeserializeInfo = function () {
		this.uuidList = [], this.uuidObjList = [], this.uuidPropList = [], this.rawProp = ""
	}, l._DeserializeInfo.prototype.reset = function () {
		this.uuidList.length = 0, this.uuidObjList.length = 0, this.uuidPropList.length = 0, this.rawProp = ""
	}, l._DeserializeInfo.prototype.getUuidOf = function (a, b) {
		for (var c = 0; c < this.uuidObjList.length; c++)
			if (this.uuidObjList[c] === a && this.uuidPropList[c] === b) return this.uuidList[c];
		return ""
	}, l._DeserializeInfo.prototype.assignAssetsBy = function (a) {
		for (var b = !0, c = 0, d = this.uuidList.length; d > c; c++) {
			var e = this.uuidList[c],
				f = a(e);
			if (f) {
				var g = this.uuidObjList[c],
					h = this.uuidPropList[c];
				g[h] = f
			}
			else l.error("Failed to assign asset: " + e), b = !1
		}
		return b
	}, l.instantiate = function (a) {
		if ("object" != typeof a || Array.isArray(a)) return l.error("The thing you want to instantiate must be an object"), null;
		if (!a) return l.error("The thing you want to instantiate is nil"), null;
		if (a instanceof l.FObject && !a.isValid) return l.error("The thing you want to instantiate is destroyed"), null;
		var b;
		return a._instantiate ? (l._isCloning = !0, b = a._instantiate(), l._isCloning = !1, b) : a instanceof l.Asset ? (l.error("The instantiate method for given asset do not implemented"), null) : (l._isCloning = !0, b = l._doInstantiate(a), l._isCloning = !1, b)
	}, l._doInstantiate = function () {
		function a(a) {
			if (Array.isArray(a)) return l.error("Can not instantiate array"), null;
			if (c(a)) return l.error("Can not instantiate DOM element"), null;
			for (var b = e(a), f = 0, g = d.length; g > f; ++f) d[f]._iN$t = null;
			return d.length = 0, b
		}

		function b(a) {
			var f = a._iN$t;
			if (f) return f;
			if (a instanceof O) return a;
			if (Array.isArray(a)) {
				var g = a.length;
				f = new Array(g), a._iN$t = f;
				for (var h = 0; g > h; ++h) {
					var i = a[h],
						j = typeof i;
					f[h] = "object" === j ? i ? b(i) : i : "function" !== j ? i : null
				}
				return d.push(a), f
			}
			return c(a) ? null : e(a)
		}
		var d = [],
			e = function (a) {
				var c, e, f = a.constructor,
					g = new f;
				if (a._iN$t = g, d.push(a), l._isFireClass(f)) {
					var h = f.__props__;
					if (h)
						for (var i = 0; i < h.length; i++) {
							var j = h[i],
								k = l.attr(f, j);
							k.serializable !== !1 && (c = a[j], e = typeof c, g[j] = "object" === e ? c ? b(c) : c : "function" !== e ? c : null)
						}
				}
				else
					for (var m in a) a.hasOwnProperty(m) === !1 || 95 === m.charCodeAt(0) && 95 === m.charCodeAt(1) || (c = a[m], c !== g && (e = typeof c, g[m] = "object" === e ? c ? b(c) : c : "function" !== e ? c : null));
				return a instanceof FObject && (g._objFlags &= A), g
			};
		return a
	}(), l._isCloning = !1;
	var O = l.Class({
		name: "Fire.Asset",
		"extends": l.HashObject,
		constructor: function () {
			Object.defineProperty(this, "_uuid", {
				value: "",
				writable: !0,
				enumerable: !1
			}), this.dirty = !1
		},
		_setRawExtname: function (a) {
			this.hasOwnProperty("_rawext") ? ("." === a.charAt(0) && (a = a.substring(1)), this._rawext = a) : l.error("Have not defined any RawTypes yet, no need to set raw file's extname.")
		}
	});
	l.Asset = O;
	var P = function () {
		var a = l.extend("Fire.CustomAsset", l.Asset);
		return a
	}();
	l.CustomAsset = P, l.addCustomAssetMenu = l.addCustomAssetMenu || function (a, b, c) {}, l.ScriptAsset = function () {
		var a = l.extend("Fire.ScriptAsset", l.Asset);
		return a.prop("text", "", l.MultiText, l.RawType("text"), l.HideInInspector), a
	}(), l.Texture = function () {
		var a = l.extend("Fire.Texture", l.Asset, function () {
			var a = arguments[0];
			a && (this.image = a, this.width = a.width, this.height = a.height)
		});
		return a.WrapMode = l.defineEnum({
			Repeat: -1,
			Clamp: -1
		}), a.FilterMode = l.defineEnum({
			Point: -1,
			Bilinear: -1,
			Trilinear: -1
		}), a.prop("image", null, l.RawType("image"), l.HideInInspector), a.prop("width", 0, l.Integer_Obsoleted, l.ReadOnly), a.prop("height", 0, l.Integer_Obsoleted, l.ReadOnly), a.prop("wrapMode", a.WrapMode.Clamp, l.Enum(a.WrapMode), l.ReadOnly), a.prop("filterMode", a.FilterMode.Bilinear, l.Enum(a.FilterMode), l.ReadOnly), a
	}(), l.Sprite = function () {
		var a = l.extend("Fire.Sprite", l.Asset, function () {
			var a = arguments[0];
			a && (this.texture = new l.Texture(a), this.width = a.width, this.height = a.height)
		});
		return a.prop("pivot", new l.Vec2(.5, .5), l.Tooltip("The pivot is normalized, like a percentage.\n(0,0) means the bottom-left corner and (1,1) means the top-right corner.\nBut you can use values higher than (1,1) and lower than (0,0) too.")), a.prop("trimX", 0, l.Integer_Obsoleted), a.prop("trimY", 0, l.Integer_Obsoleted), a.prop("width", 0, l.Integer_Obsoleted), a.prop("height", 0, l.Integer_Obsoleted), a.prop("texture", null, l.ObjectType(l.Texture), l.HideInInspector), a.prop("rotated", !1, l.HideInInspector), a.prop("x", 0, l.Integer_Obsoleted, l.HideInInspector), a.prop("y", 0, l.Integer_Obsoleted, l.HideInInspector), a.prop("rawWidth", 0, l.Integer_Obsoleted, l.HideInInspector), a.prop("rawHeight", 0, l.Integer_Obsoleted, l.HideInInspector), Object.defineProperty(a.prototype, "rotatedWidth", {
			get: function () {
				return this.rotated ? this.height : this.width
			}
		}), Object.defineProperty(a.prototype, "rotatedHeight", {
			get: function () {
				return this.rotated ? this.width : this.height
			}
		}), a
	}(), l.Atlas = function () {
		var a = l.extend("Fire.Atlas", l.Asset);
		return a.Algorithm = l.defineEnum({
			Basic: -1,
			Tree: -1,
			MaxRect: -1
		}), a.SortBy = l.defineEnum({
			UseBest: -1,
			Width: -1,
			Height: -1,
			Area: -1,
			Name: -1
		}), a.SortOrder = l.defineEnum({
			UseBest: -1,
			Ascending: -1,
			Descending: -1
		}), a.prop("width", 512, l.Integer_Obsoleted, l.ReadOnly), a.prop("height", 512, l.Integer_Obsoleted, l.ReadOnly), a.prop("sprites", [], l.ObjectType(l.Sprite), l.HideInInspector), a.prototype.add = function (a) {
			for (var b = 0; b < this.sprites.length; ++b) {
				var c = this.sprites[b];
				if (c._uuid === a._uuid) return !1
			}
			return this.sprites.push(a), !0
		}, a.prototype.remove = function (a) {
			for (var b = 0; b < this.sprites.length; ++b) {
				var c = this.sprites[b];
				if (c._uuid === a._uuid) return this.sprites.splice(b, 1), !0
			}
			return !1
		}, a.prototype.clear = function () {
			this.sprites = []
		}, a.prototype.layout = function (a) {
			void 0 === a.algorithm && (a.algorithm = l.Atlas.Algorithm.MaxRect), void 0 === a.sortBy && (a.sortBy = l.Atlas.SortBy.UseBest), void 0 === a.sortOrder && (a.sortOrder = l.Atlas.SortOrder.UseBest), void 0 === a.allowRotate && (a.allowRotate = !0), void 0 === a.autoSize && (a.autoSize = !0), void 0 === a.padding && (a.padding = 2), m.AtlasUtils.sort(this, a.algorithm, a.sortBy, a.sortOrder, a.allowRotate), m.AtlasUtils.layout(this, a.algorithm, a.autoSize, a.padding, a.allowRotate)
		}, a
	}();
	var Q = {},
		R = function (a, b) {
			for (var c = 0, d = 0, e = 0, f = 0; f < a.sprites.length; ++f) {
				var g = a.sprites[f];
				if (c + g.rotatedWidth > a.width && (c = 0, d = d + e + b, e = 0), d + g.rotatedHeight > a.height) throw new Error("Warning: Failed to layout element " + g.name);
				g.x = c, g.y = d, c = c + g.rotatedWidth + b, g.rotatedHeight > e && (e = g.rotatedHeight)
			}
		},
		S = function (a, b, c, d) {
			if (null !== a.right) {
				var e = S(a.right, b, c, d);
				return null !== e ? e : S(a.bottom, b, c, d)
			}
			var f = b.rotatedWidth,
				g = b.rotatedHeight,
				h = f + c,
				i = g + c,
				j = a.rect;
			if (f > j.width || g > j.height) {
				if (d === !1) return null;
				if (g > j.width || f > j.height) return null;
				b.rotated = !b.rotated, f = b.rotatedWidth, g = b.rotatedHeight, h = f + c, i = g + c
			}
			return a.right = {
				rect: new l.Rect(j.x + h, j.y, j.width - h, g),
				right: null,
				bottom: null
			}, a.bottom = {
				rect: new l.Rect(j.x, j.y + i, j.width, j.height - i),
				right: null,
				bottom: null
			}, [j.x, j.y]
		},
		T = function (a, b, c) {
			for (var d = {
					rect: new l.Rect(0, 0, a.width, a.height),
					right: null,
					bottom: null
				}, e = 0; e < a.sprites.length; ++e) {
				var f = a.sprites[e],
					g = S(d, f, b, c);
				if (null === g) throw new Error("Warning: Failed to layout element " + f.name);
				f.x = g[0], f.y = g[1]
			}
		},
		U = function (a, b, c) {
			if (c.x >= b.x + b.width || c.x + c.width <= b.x || c.y >= b.y + b.height || c.y + c.height <= b.y) return !1;
			var d;
			return c.x < b.x + b.width && c.x + c.width > b.x && (c.y > b.y && c.y < b.y + b.height && (d = b.clone(), d.height = c.y - d.y, a.push(d)), c.y + c.height < b.y + b.height && (d = b.clone(), d.y = c.y + c.height, d.height = b.y + b.height - (c.y + c.height), a.push(d))), c.y < b.y + b.height && c.y + c.height > b.y && (c.x > b.x && c.x < b.x + b.width && (d = b.clone(), d.width = c.x - d.x, a.push(d)), c.x + c.width < b.x + b.width && (d = b.clone(), d.x = c.x + c.width, d.width = b.x + b.width - (c.x + c.width), a.push(d))), !0
		},
		V = function (a, b) {
			var c;
			for (c = 0; c < a.length; ++c) U(a, a[c], b) && (a.splice(c, 1), --c);
			for (c = 0; c < a.length; ++c)
				for (var d = c + 1; d < a.length; ++d) {
					if (a[d].containsRect(a[c])) {
						a.splice(c, 1), --c;
						break
					}
					a[c].containsRect(a[d]) && (a.splice(d, 1), --d)
				}
		},
		W = function (a, b, c) {
			var d = [];
			d.push(new l.Rect(0, 0, a.width + b, a.height + b));
			for (var e, f, g = function (a, b, c, d) {
					e = Number.MAX_VALUE, score2 = Number.MAX_VALUE;
					for (var f = new l.Rect(0, 0, 1, 1), g = !1, h = 0; h < a.length; ++h) {
						var i = a[h],
							j, k, m, n;
						i.width >= b && i.height >= c && (j = Math.abs(Math.floor(i.width) - b), k = Math.abs(Math.floor(i.height) - c), m = Math.min(j, k), n = Math.max(j, k), (e > m || m === e && n < score2) && (f.x = i.x, f.y = i.y, f.width = b, f.height = c, e = m, score2 = n, g = !0)), d && i.width >= c && i.height >= b && (j = Math.abs(Math.floor(i.width) - c), k = Math.abs(Math.floor(i.height) - b), m = Math.min(j, k), n = Math.max(j, k), (e > m || m === e && n < score2) && (f.x = i.x, f.y = i.y, f.width = c, f.height = b, e = m, score2 = n, g = !0))
					}
					return g === !1 && (e = Number.MAX_VALUE, score2 = Number.MAX_VALUE), f
				}, h = a.sprites.slice(); h.length > 0;) {
				for (var i = Number.MAX_VALUE, j = Number.MAX_VALUE, k = -1, m = new l.Rect(0, 0, 1, 1), n = 0; n < h.length; ++n) {
					var o = g(d, h[n].width + b, h[n].height + b, c);
					(i > e || e === i && score2 < j) && (i = e, j = score2, m = o, k = n)
				}
				if (-1 === k) throw new Error("Error: Failed to layout atlas element");
				V(d, m);
				var p = h[k];
				p.x = Math.floor(m.x), p.y = Math.floor(m.y), p.rotated = p.width + b !== m.width, h.splice(k, 1)
			}
		};
	Q.layout = function (a, b, c, d, e) {
		try {
			switch (b) {
			case l.Atlas.Algorithm.Basic:
				R(a, d);
				break;
			case l.Atlas.Algorithm.Tree:
				T(a, d, e);
				break;
			case l.Atlas.Algorithm.MaxRect:
				W(a, d, e)
			}
		}
		catch (f) {
			if (c === !1) return void l.error(f.message);
			if (4096 === a.width && 4096 === a.height) return void l.error(f.message);
			a.width === a.height ? a.width *= 2 : a.height = a.width, Q.layout(a, b, c, d, e)
		}
	};
	var X = function (a, b) {
			var c = a.width - b.width;
			return 0 === c && (c = a.name.localeCompare(b.name)), c
		},
		Y = function (a, b) {
			var c = a.height - b.height;
			return 0 === c && (c = a.name.localeCompare(b.name)), c
		},
		Z = function (a, b) {
			var c = a.width * a.height - b.width * b.height;
			return 0 === c && (c = a.name.localeCompare(b.name)), c
		},
		$ = function (a, b) {
			return a.name.localeCompare(b.name)
		},
		_ = function (a, b) {
			var c = a.width;
			a.height > a.width && (c = a.height, a.rotated = !0);
			var d = b.width;
			b.height > b.width && (d = b.height, b.rotated = !0);
			var e = c - d;
			return 0 === e && (e = a.name.localeCompare(b.name)), e
		},
		ab = function (a, b) {
			var c = a.height;
			a.width > a.height && (c = a.width, a.rotated = !0);
			var d = b.height;
			b.width > b.height && (d = b.width, b.rotated = !0);
			var e = c - d;
			return 0 === e && (e = a.name.localeCompare(b.name)), e
		};
	Q.sort = function (a, b, c, d, e) {
		for (var f = 0; f < a.sprites.length; ++f) {
			var g = a.sprites[f];
			g.rotated = !1
		}
		var h = c,
			i = d;
		if (h === l.Atlas.SortBy.UseBest) switch (b) {
		case l.Atlas.Algorithm.Basic:
			h = l.Atlas.SortBy.Height;
			break;
		case l.Atlas.Algorithm.Tree:
			h = l.Atlas.SortBy.Area;
			break;
		case l.Atlas.Algorithm.MaxRect:
			h = l.Atlas.SortBy.Area;
			break;
		default:
			h = l.Atlas.SortBy.Height
		}
		switch (i === l.Atlas.SortOrder.UseBest && (i = l.Atlas.SortOrder.Descending), h) {
		case l.Atlas.SortBy.Width:
			a.sprites.sort(e ? _ : X);
			break;
		case l.Atlas.SortBy.Height:
			a.sprites.sort(e ? ab : Y);
			break;
		case l.Atlas.SortBy.Area:
			a.sprites.sort(Z);
			break;
		case l.Atlas.SortBy.Name:
			a.sprites.sort($)
		}
		i === l.Atlas.SortOrder.Descending && a.sprites.reverse()
	}, m.AtlasUtils = Q;
	var bb = function () {
		var a = l.extend("Fire.JsonAsset", O).prop("json", null, l.RawType("json"));
		return a
	}();
	l.JsonAsset = bb, l.TextAsset = function () {
		var a = l.extend("Fire.TextAsset", l.Asset);
		return a.prop("text", "", l.MultiText, l.RawType("text")), a
	}();
	var cb = function () {
		var a = l.extend("Fire.BitmapFont", l.Asset);
		return a.prop("texture", null, l.ObjectType(l.Texture), l.HideInInspector), a.prop("charInfos", [], l.HideInInspector), a.prop("kernings", [], l.HideInInspector), a.prop("baseLine", 0, l.Integer_Obsoleted, l.ReadOnly), a.prop("lineHeight", 0, l.Integer_Obsoleted, l.ReadOnly), a.prop("size", 0, l.Integer_Obsoleted, l.ReadOnly), a.prop("face", null, l.HideInInspector), a
	}();
	l.BitmapFont = cb, l.AudioClip = function () {
		var a = l.Class({
			name: "Fire.AudioClip",
			"extends": l.Asset,
			properties: {
				rawData: {
					"default": null,
					rawType: "audio",
					visible: !1
				},
				buffer: {
					get: function () {
						return l.AudioContext.getClipBuffer(this)
					},
					visible: !1
				},
				length: {
					get: function () {
						return l.AudioContext.getClipLength(this)
					}
				},
				samples: {
					get: function () {
						return l.AudioContext.getClipSamples(this)
					}
				},
				channels: {
					get: function () {
						return l.AudioContext.getClipChannels(this)
					}
				},
				frequency: {
					get: function () {
						return l.AudioContext.getClipFrequency(this)
					}
				}
			}
		});
		return a
	}();
	var db = function () {
		function a(a, b) {
			this._exporting = b, this.serializedList = [], this._parsingObjs = [], this._parsingData = [], this._objsToResetId = [], h(this, a);
			for (var c = 0; c < this._objsToResetId.length; ++c) this._objsToResetId[c].__id__ = void 0;
			this._parsingObjs = null, this._parsingData = null, this._objsToResetId = null
		}
		var b = function (a, b) {
				var c = a._parsingObjs.indexOf(b),
					d = -1 !== c;
				if (d) {
					var e = a.serializedList.length;
					b.__id__ = e, a._objsToResetId.push(b);
					var f = a._parsingData[c];
					if (Array.isArray(b) === !1) {
						var g = j(b);
						g && (f.__type__ = g)
					}
					return a.serializedList.push(f), f
				}
			},
			d = function (a, b, c) {
				if (Array.isArray(b))
					for (var f = 0; f < b.length; ++f) {
						var g = e(a, b[f]);
						"undefined" != typeof g && c.push(g)
					}
				else {
					var h = b.constructor;
					if (l._isFireClass(h)) {
						var i = h.__props__;
						if (i)
							if ("_$erialized" !== i[i.length - 1])
								for (var j = 0; j < i.length; j++) {
									var k = i[j],
										m = l.attr(h, k);
									m.serializable !== !1 && (a._exporting && m.editorOnly || (c[k] = e(a, b[k])))
								}
						else c.__type__ = b._$erialized.__type__, d(a, b._$erialized, c)
					}
					else
						for (var n in b) !b.hasOwnProperty(n) || 95 === n.charCodeAt(0) && 95 === n.charCodeAt(1) || (c[n] = e(a, b[n]))
				}
			},
			e = function (a, b) {
				var c = typeof b;
				if ("object" === c) {
					if (b instanceof FObject) {
						var d = b._objFlags;
						if (d & v) return void 0;
						if (a._exporting && d & w) return void 0
					}
					return g(a, b)
				}
				return "function" !== c ? b : null
			},
			f = function (a, b) {
				var c;
				if (Array.isArray(b)) c = [];
				else {
					c = {};
					var e = j(b);
					e && (c.__type__ = e)
				}
				var f = a.serializedList.length;
				if (a._parsingObjs.push(b), a._parsingData.push(c), d(a, b, c), a._parsingObjs.pop(), a._parsingData.pop(), a.serializedList.length > f) {
					var g = a.serializedList.indexOf(c, f);
					if (-1 !== g) return {
						__id__: g
					}
				}
				return c
			},
			g = function (a, e) {
				if (!e) return null;
				var g = e.__id__;
				if ("undefined" != typeof g) return {
					__id__: g
				};
				if (e instanceof FObject) {
					if (!e.isValid) return null;
					var h = e._uuid;
					if (h) return {
						__uuid__: h
					};
					g = a.serializedList.length, e.__id__ = g, a._objsToResetId.push(e);
					var i = {};
					a.serializedList.push(i);
					var k = j(e);
					return k && (i.__type__ = k), d(a, e, i), i._objFlags &= A, {
						__id__: g
					}
				}
				if (c(e)) return null;
				var l = b(a, e);
				return l ? (g = e.__id__, {
					__id__: g
				}) : f(a, e)
			},
			h = function (a, b) {
				if (b instanceof FObject) {
					var e = b._uuid;
					"undefined" != typeof e && (b._uuid = null), g(a, b), "undefined" != typeof e && (b._uuid = e)
				}
				else if ("object" == typeof b && b) {
					if (c(b)) return l.warn("" + b + " won't be serialized"), void a.serializedList.push(null);
					var f;
					if (Array.isArray(b)) f = [];
					else {
						f = {};
						var h = j(b);
						h && (f.__type__ = h)
					}
					b.__id__ = 0, a._objsToResetId.push(b), a.serializedList.push(f), d(a, b, f)
				}
				else a.serializedList.push(g(a, b))
			};
		return a
	}();
	m.serialize = function (a, b) {
		var c = b && b.exporting,
			d = b && "stringify" in b ? b.stringify : !0,
			e = b && "minify" in b ? b.minify : !1,
			f = e || b && b.nicify,
			g = new db(a, c),
			h = g.serializedList;
		f && fb(h);
		var i = 1 === h.length ? h[0] : h;
		return d === !1 ? i : JSON.stringify(i, null, e ? 0 : 2)
	}, m.serialize.asAsset = function (a) {
		a || l.error("[Editor.serialize.asAsset] The uuid must be non-nil!");
		var b = new O;
		return b._uuid = a, b
	}, m.serialize.setName = function (a, b) {
		Array.isArray(a) ? a[0]._name = b : a._name = b
	};
	var eb = function () {
			this.objList = [], this.keyList = [], this.referncedIDList = [], this.referencedCounts = [], this.temporaryDataList = []
		},
		fb = function (a) {
			var b = a[0];
			if ("undefined" != typeof b) {
				var c = new eb;
				c.referencedCounts = new Array(a.length);
				var d, e, f, g, h, i = a.slice();
				gb(b, a, c);
				var j = 0;
				for (j = 0; j < c.temporaryDataList.length; j++) delete c.temporaryDataList[j]._iN$t;
				for (j = 0; j < c.objList.length; j++)
					if (e = c.objList[j], d = c.referncedIDList[j], f = c.keyList[j], g = i[d], h = c.referencedCounts[d] > 1, !h) {
						e[f] = g;
						var k = a.indexOf(g);
						a.splice(k, 1)
					}
				for (j = 0; j < c.objList.length; j++)
					if (d = c.referncedIDList[j], f = c.keyList[j], e = c.objList[j], h = c.referencedCounts[d] > 1) {
						g = i[d];
						var l = a.indexOf(g);
						e[f].__id__ = l
					}
			}
		};
	l._nicifySerialized = fb;
	var gb = function (a, b, c) {
			if ("object" == typeof a) {
				var d;
				if (a._iN$t = !0, c.temporaryDataList.push(a), Array.isArray(a))
					for (var e = 0; e < a.length; e++) d = a[e], d && hb(d, e, a, b, c);
				else
					for (var f in a) d = a[f], d && hb(d, f, a, b, c)
			}
		},
		hb = function (a, b, c, d, e) {
			var f, g = a.__id__,
				h = "undefined" != typeof g;
			h && (a = d[g], f = -1 !== e.referncedIDList.indexOf(g), f ? e.referencedCounts[g]++ : e.referencedCounts[g] = 1, e.referncedIDList.push(g), e.keyList.push(b), e.objList.push(c));
			var i = !a._iN$t;
			i ? gb(a, d, e) : h && e.referencedCounts[g]++
		};
	"undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = l), exports.Fire = l) : "undefined" != typeof define && define.amd ? define(l) : (k.Fire = l, k.Editor = m)
}).call(this);
