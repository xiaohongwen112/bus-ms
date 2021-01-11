﻿window.VTC = {
    "ditu": {
        "normal": {"version": "086", "updateDate": "20150810"},
        "satellite": {"version": "009", "updateDate": "20150601"},
        "normalTraffic": {"version": "080", "updateDate": "20150810"},
        "satelliteTraffic": {"version": "082", "updateDate": "20150810"},
        "mapJS": {"version": "103", "updateDate": "20150810"},
        "satelliteStreet": {"version": "082", "updateDate": "20150810"},
        "panoClick": {"version": "1033", "updateDate": "201400823"},
        "panoUdt": {"version": "20150810", "updateDate": "20150810"},
        "panoSwfAPI": {"version": "20150123", "updateDate": "20150123"},
        "panoSwfPlace": {"version": "20141112", "updateDate": "20141112"}
    },
    "webapp": {
        "high_normal": {"version": "001", "updateDate": "20141209"},
        "lower_normal": {"version": "002", "updateDate": "20150529"}
    },
    "api_for_mobile": {
        "vector": {"version": "002", "updateDate": "20150529"},
        "vectorIcon": {"version": "002", "updateDate": "20150529"}
    }
};
window.BMAP_AUTHENTIC_KEY = "ZUONbpqGBsYGXNIYHicvbAbM";
(function () {
    function aa(a) {
        throw a;
    }

    var j = void 0, o = !0, p = null, q = !1;

    function s() {
        return function () {
        }
    }

    function ba(a) {
        return function (b) {
            this[a] = b
        }
    }

    function u(a) {
        return function () {
            return this[a]
        }
    }

    function da(a) {
        return function () {
            return a
        }
    }

    var ea, fa = [];

    function ga(a) {
        return function () {
            return fa[a].apply(this, arguments)
        }
    }

    function ha(a, b) {
        return fa[a] = b
    }

    var ia, w = ia = w || {version: "1.3.4"};
    w.Q = "$BAIDU$";
    window[w.Q] = window[w.Q] || {};
    w.object = w.object || {};
    w.extend = w.object.extend = function (a, b) {
        for (var c in b)b.hasOwnProperty(c) && (a[c] = b[c]);
        return a
    };
    w.B = w.B || {};
    w.B.N = function (a) {
        return "string" == typeof a || a instanceof String ? document.getElementById(a) : a && a.nodeName && (1 == a.nodeType || 9 == a.nodeType) ? a : p
    };
    w.N = w.rc = w.B.N;
    w.B.J = function (a) {
        a = w.B.N(a);
        if (a === p)return a;
        a.style.display = "none";
        return a
    };
    w.J = w.B.J;
    w.lang = w.lang || {};
    w.lang.eg = function (a) {
        return "[object String]" == Object.prototype.toString.call(a)
    };
    w.eg = w.lang.eg;
    w.B.wj = function (a) {
        return w.lang.eg(a) ? document.getElementById(a) : a
    };
    w.wj = w.B.wj;
    w.B.getElementsByClassName = function (a, b) {
        var c;
        if (a.getElementsByClassName)c = a.getElementsByClassName(b); else {
            var d = a;
            d == p && (d = document);
            c = [];
            var d = d.getElementsByTagName("*"), e = d.length, f = RegExp("(^|\\s)" + b + "(\\s|$)"), g, i;
            for (i = g = 0; g < e; g++)f.test(d[g].className) && (c[i] = d[g], i++)
        }
        return c
    };
    w.getElementsByClassName = w.B.getElementsByClassName;
    w.B.contains = function (a, b) {
        var c = w.B.wj, a = c(a), b = c(b);
        return a.contains ? a != b && a.contains(b) : !!(a.compareDocumentPosition(b) & 16)
    };
    w.S = w.S || {};
    /msie (\d+\.\d)/i.test(navigator.userAgent) && (w.S.ba = w.ba = document.documentMode || +RegExp.$1);
    var la = {
        cellpadding: "cellPadding",
        cellspacing: "cellSpacing",
        colspan: "colSpan",
        rowspan: "rowSpan",
        valign: "vAlign",
        usemap: "useMap",
        frameborder: "frameBorder"
    };
    8 > w.S.ba ? (la["for"] = "htmlFor", la["class"] = "className") : (la.htmlFor = "for", la.className = "class");
    w.B.EF = la;
    w.B.vE = function (a, b, c) {
        a = w.B.N(a);
        if (a === p)return a;
        if ("style" == b)a.style.cssText = c; else {
            b = w.B.EF[b] || b;
            a.setAttribute(b, c)
        }
        return a
    };
    w.vE = w.B.vE;
    w.B.wE = function (a, b) {
        a = w.B.N(a);
        if (a === p)return a;
        for (var c in b)w.B.vE(a, c, b[c]);
        return a
    };
    w.wE = w.B.wE;
    w.uk = w.uk || {};
    (function () {
        var a = RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+$)", "g");
        w.uk.trim = function (b) {
            return ("" + b).replace(a, "")
        }
    })();
    w.trim = w.uk.trim;
    w.uk.lo = function (a, b) {
        var a = "" + a, c = Array.prototype.slice.call(arguments, 1), d = Object.prototype.toString;
        if (c.length) {
            c = c.length == 1 ? b !== p && /\[object Array\]|\[object Object\]/.test(d.call(b)) ? b : c : c;
            return a.replace(/#\{(.+?)\}/g, function (a, b) {
                var g = c[b];
                "[object Function]" == d.call(g) && (g = g(b));
                return "undefined" == typeof g ? "" : g
            })
        }
        return a
    };
    w.lo = w.uk.lo;
    w.B.Vb = function (a, b) {
        a = w.B.N(a);
        if (a === p)return a;
        for (var c = a.className.split(/\s+/), d = b.split(/\s+/), e, f = d.length, g, i = 0; i < f; ++i) {
            g = 0;
            for (e = c.length; g < e; ++g)if (c[g] == d[i]) {
                c.splice(g, 1);
                break
            }
        }
        a.className = c.join(" ");
        return a
    };
    w.Vb = w.B.Vb;
    w.B.Rw = function (a, b, c) {
        a = w.B.N(a);
        if (a === p)return a;
        var d;
        if (a.insertAdjacentHTML)a.insertAdjacentHTML(b, c); else {
            d = a.ownerDocument.createRange();
            b = b.toUpperCase();
            if (b == "AFTERBEGIN" || b == "BEFOREEND") {
                d.selectNodeContents(a);
                d.collapse(b == "AFTERBEGIN")
            } else {
                b = b == "BEFOREBEGIN";
                d[b ? "setStartBefore" : "setEndAfter"](a);
                d.collapse(b)
            }
            d.insertNode(d.createContextualFragment(c))
        }
        return a
    };
    w.Rw = w.B.Rw;
    w.B.show = function (a) {
        a = w.B.N(a);
        if (a === p)return a;
        a.style.display = "";
        return a
    };
    w.show = w.B.show;
    w.B.RC = function (a) {
        a = w.B.N(a);
        return a === p ? a : a.nodeType == 9 ? a : a.ownerDocument || a.document
    };
    w.B.Ta = function (a, b) {
        a = w.B.N(a);
        if (a === p)return a;
        for (var c = b.split(/\s+/), d = a.className, e = " " + d + " ", f = 0, g = c.length; f < g; f++)e.indexOf(" " + c[f] + " ") < 0 && (d = d + (" " + c[f]));
        a.className = d;
        return a
    };
    w.Ta = w.B.Ta;
    w.B.NA = w.B.NA || {};
    w.B.ll = w.B.ll || [];
    w.B.ll.filter = function (a, b, c) {
        for (var d = 0, e = w.B.ll, f; f = e[d]; d++)if (f = f[c])b = f(a, b);
        return b
    };
    w.uk.dN = function (a) {
        return a.indexOf("-") < 0 && a.indexOf("_") < 0 ? a : a.replace(/[-_][^-_]/g, function (a) {
            return a.charAt(1).toUpperCase()
        })
    };
    w.B.VY = function (a) {
        w.B.qs(a, "expand") ? w.B.Vb(a, "expand") : w.B.Ta(a, "expand")
    };
    w.B.qs = function (a) {
        if (arguments.length <= 0 || typeof a === "function")return this;
        if (this.size() <= 0)return q;
        var a = a.replace(/^\s+/g, "").replace(/\s+$/g, "").replace(/\s+/g, " "), b = a.split(" "), c;
        w.forEach(this, function (a) {
            for (var a = a.className, e = 0; e < b.length; e++)if (!~(" " + a + " ").indexOf(" " + b[e] + " ")) {
                c = q;
                return
            }
            c !== q && (c = o)
        });
        return c
    };
    w.B.Zi = function (a, b) {
        var c = w.B, a = c.N(a);
        if (a === p)return a;
        var b = w.uk.dN(b), d = a.style[b];
        if (!d)var e = c.NA[b], d = a.currentStyle || (w.S.ba ? a.style : getComputedStyle(a, p)), d = e && e.get ? e.get(a, d) : d[e || b];
        if (e = c.ll)d = e.filter(b, d, "get");
        return d
    };
    w.Zi = w.B.Zi;
    /opera\/(\d+\.\d)/i.test(navigator.userAgent) && (w.S.opera = +RegExp.$1);
    w.S.bL = /webkit/i.test(navigator.userAgent);
    w.S.BW = /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent);
    w.S.CD = "CSS1Compat" == document.compatMode;
    w.B.V = function (a) {
        a = w.B.N(a);
        if (a === p)return a;
        var b = w.B.RC(a), c = w.S, d = w.B.Zi;
        c.BW > 0 && b.getBoxObjectFor && d(a, "position");
        var e = {left: 0, top: 0}, f;
        if (a == (c.ba && !c.CD ? b.body : b.documentElement))return e;
        if (a.getBoundingClientRect) {
            a = a.getBoundingClientRect();
            e.left = Math.floor(a.left) + Math.max(b.documentElement.scrollLeft, b.body.scrollLeft);
            e.top = Math.floor(a.top) + Math.max(b.documentElement.scrollTop, b.body.scrollTop);
            e.left = e.left - b.documentElement.clientLeft;
            e.top = e.top - b.documentElement.clientTop;
            a = b.body;
            b = parseInt(d(a, "borderLeftWidth"));
            d = parseInt(d(a, "borderTopWidth"));
            if (c.ba && !c.CD) {
                e.left = e.left - (isNaN(b) ? 2 : b);
                e.top = e.top - (isNaN(d) ? 2 : d)
            }
        } else {
            f = a;
            do {
                e.left = e.left + f.offsetLeft;
                e.top = e.top + f.offsetTop;
                if (c.bL > 0 && d(f, "position") == "fixed") {
                    e.left = e.left + b.body.scrollLeft;
                    e.top = e.top + b.body.scrollTop;
                    break
                }
                f = f.offsetParent
            } while (f && f != a);
            if (c.opera > 0 || c.bL > 0 && d(a, "position") == "absolute")e.top = e.top - b.body.offsetTop;
            for (f = a.offsetParent; f && f != b.body;) {
                e.left = e.left - f.scrollLeft;
                if (!c.opera || f.tagName != "TR")e.top = e.top - f.scrollTop;
                f = f.offsetParent
            }
        }
        return e
    };
    /firefox\/(\d+\.\d)/i.test(navigator.userAgent) && (w.S.ag = +RegExp.$1);
    /BIDUBrowser/i.test(navigator.userAgent) && (w.S.A_ = o);
    var ma = navigator.userAgent;
    /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ma) && !/chrome/i.test(ma) && (w.S.yM = +(RegExp.$1 || RegExp.$2));
    /chrome\/(\d+\.\d)/i.test(navigator.userAgent) && (w.S.aJ = +RegExp.$1);
    w.Xb = w.Xb || {};
    w.Xb.yb = function (a, b) {
        var c, d, e = a.length;
        if ("function" == typeof b)for (d = 0; d < e; d++) {
            c = a[d];
            c = b.call(a, c, d);
            if (c === q)break
        }
        return a
    };
    w.yb = w.Xb.yb;
    w.lang.Q = function () {
        return "TANGRAM__" + (window[w.Q]._counter++).toString(36)
    };
    window[w.Q]._counter = window[w.Q]._counter || 1;
    window[w.Q]._instances = window[w.Q]._instances || {};
    w.lang.zs = function (a) {
        return "[object Function]" == Object.prototype.toString.call(a)
    };
    w.lang.ra = function (a) {
        this.Q = a || w.lang.Q();
        window[w.Q]._instances[this.Q] = this
    };
    window[w.Q]._instances = window[w.Q]._instances || {};
    w.lang.ra.prototype.Mh = ga(0);
    w.lang.ra.prototype.toString = function () {
        return "[object " + (this.cP || "Object") + "]"
    };
    w.lang.iy = function (a, b) {
        this.type = a;
        this.returnValue = o;
        this.target = b || p;
        this.currentTarget = p
    };
    w.lang.ra.prototype.addEventListener = function (a, b, c) {
        if (w.lang.zs(b)) {
            !this.mi && (this.mi = {});
            var d = this.mi, e;
            if (typeof c == "string" && c) {
                /[^\w\-]/.test(c) && aa("nonstandard key:" + c);
                e = b.DK = c
            }
            a.indexOf("on") != 0 && (a = "on" + a);
            typeof d[a] != "object" && (d[a] = {});
            e = e || w.lang.Q();
            b.DK = e;
            d[a][e] = b
        }
    };
    w.lang.ra.prototype.removeEventListener = function (a, b) {
        if (w.lang.zs(b))b = b.DK; else if (!w.lang.eg(b))return;
        !this.mi && (this.mi = {});
        a.indexOf("on") != 0 && (a = "on" + a);
        var c = this.mi;
        c[a] && c[a][b] && delete c[a][b]
    };
    w.lang.ra.prototype.dispatchEvent = function (a, b) {
        w.lang.eg(a) && (a = new w.lang.iy(a));
        !this.mi && (this.mi = {});
        var b = b || {}, c;
        for (c in b)a[c] = b[c];
        var d = this.mi, e = a.type;
        a.target = a.target || this;
        a.currentTarget = this;
        e.indexOf("on") != 0 && (e = "on" + e);
        w.lang.zs(this[e]) && this[e].apply(this, arguments);
        if (typeof d[e] == "object")for (c in d[e])d[e][c].apply(this, arguments);
        return a.returnValue
    };
    w.lang.ia = function (a, b, c) {
        var d, e, f = a.prototype;
        e = new Function;
        e.prototype = b.prototype;
        e = a.prototype = new e;
        for (d in f)e[d] = f[d];
        a.prototype.constructor = a;
        a.LY = b.prototype;
        if ("string" == typeof c)e.cP = c
    };
    w.ia = w.lang.ia;
    w.lang.Nd = function (a) {
        return window[w.Q]._instances[a] || p
    };
    w.platform = w.platform || {};
    w.platform.VK = /macintosh/i.test(navigator.userAgent);
    w.platform.Z0 = /MicroMessenger/i.test(navigator.userAgent);
    w.platform.cL = /windows/i.test(navigator.userAgent);
    w.platform.KW = /x11/i.test(navigator.userAgent);
    w.platform.fm = /android/i.test(navigator.userAgent);
    /android (\d+\.\d)/i.test(navigator.userAgent) && (w.platform.LI = w.LI = RegExp.$1);
    w.platform.EW = /ipad/i.test(navigator.userAgent);
    w.platform.yD = /iphone/i.test(navigator.userAgent);
    function na(a, b) {
        a.domEvent = b = window.event || b;
        a.clientX = b.clientX || b.pageX;
        a.clientY = b.clientY || b.pageY;
        a.offsetX = b.offsetX || b.layerX;
        a.offsetY = b.offsetY || b.layerY;
        a.screenX = b.screenX;
        a.screenY = b.screenY;
        a.ctrlKey = b.ctrlKey || b.metaKey;
        a.shiftKey = b.shiftKey;
        a.altKey = b.altKey;
        if (b.touches) {
            a.touches = [];
            for (var c = 0; c < b.touches.length; c++)a.touches.push({
                clientX: b.touches[c].clientX,
                clientY: b.touches[c].clientY,
                screenX: b.touches[c].screenX,
                screenY: b.touches[c].screenY,
                pageX: b.touches[c].pageX,
                pageY: b.touches[c].pageY,
                target: b.touches[c].target,
                identifier: b.touches[c].identifier
            })
        }
        if (b.changedTouches) {
            a.changedTouches = [];
            for (c = 0; c < b.changedTouches.length; c++)a.changedTouches.push({
                clientX: b.changedTouches[c].clientX,
                clientY: b.changedTouches[c].clientY,
                screenX: b.changedTouches[c].screenX,
                screenY: b.changedTouches[c].screenY,
                pageX: b.changedTouches[c].pageX,
                pageY: b.changedTouches[c].pageY,
                target: b.changedTouches[c].target,
                identifier: b.changedTouches[c].identifier
            })
        }
        if (b.targetTouches) {
            a.targetTouches = [];
            for (c = 0; c < b.targetTouches.length; c++)a.targetTouches.push({
                clientX: b.targetTouches[c].clientX,
                clientY: b.targetTouches[c].clientY,
                screenX: b.targetTouches[c].screenX,
                screenY: b.targetTouches[c].screenY,
                pageX: b.targetTouches[c].pageX,
                pageY: b.targetTouches[c].pageY,
                target: b.targetTouches[c].target,
                identifier: b.targetTouches[c].identifier
            })
        }
        a.rotation = b.rotation;
        a.scale = b.scale;
        return a
    }

    w.lang.ew = function (a) {
        var b = window[w.Q];
        b.hR && delete b.hR[a]
    };
    w.event = {};
    w.F = w.event.F = function (a, b, c) {
        if (!(a = w.N(a)))return a;
        b = b.replace(/^on/, "");
        a.addEventListener ? a.addEventListener(b, c, q) : a.attachEvent && a.attachEvent("on" + b, c);
        return a
    };
    w.je = w.event.je = function (a, b, c) {
        if (!(a = w.N(a)))return a;
        b = b.replace(/^on/, "");
        a.removeEventListener ? a.removeEventListener(b, c, q) : a.detachEvent && a.detachEvent("on" + b, c);
        return a
    };
    w.B.qs = function (a, b) {
        if (!a || !a.className || typeof a.className != "string")return q;
        var c = -1;
        try {
            c = a.className == b || a.className.search(RegExp("(\\s|^)" + b + "(\\s|$)"))
        } catch (d) {
            return q
        }
        return c > -1
    };
    w.LJ = function () {
        function a(a) {
            document.addEventListener && (this.element = a, this.OJ = this.dk ? "touchstart" : "mousedown", this.zC = this.dk ? "touchmove" : "mousemove", this.yC = this.dk ? "touchend" : "mouseup", this.Ug = q, this.ot = this.nt = 0, this.element.addEventListener(this.OJ, this, q), ia.F(this.element, "mousedown", s()), this.handleEvent(p))
        }

        a.prototype = {
            dk: "ontouchstart"in window || "createTouch"in document, start: function (a) {
                oa(a);
                this.Ug = q;
                this.nt = this.dk ? a.touches[0].clientX : a.clientX;
                this.ot = this.dk ? a.touches[0].clientY : a.clientY;
                this.element.addEventListener(this.zC, this, q);
                this.element.addEventListener(this.yC, this, q)
            }, move: function (a) {
                pa(a);
                var c = this.dk ? a.touches[0].clientY : a.clientY;
                if (10 < Math.abs((this.dk ? a.touches[0].clientX : a.clientX) - this.nt) || 10 < Math.abs(c - this.ot))this.Ug = o
            }, end: function (a) {
                pa(a);
                this.Ug || (a = document.createEvent("Event"), a.initEvent("tap", q, o), this.element.dispatchEvent(a));
                this.element.removeEventListener(this.zC, this, q);
                this.element.removeEventListener(this.yC, this, q)
            }, handleEvent: function (a) {
                if (a)switch (a.type) {
                    case this.OJ:
                        this.start(a);
                        break;
                    case this.zC:
                        this.move(a);
                        break;
                    case this.yC:
                        this.end(a)
                }
            }
        };
        return function (b) {
            return new a(b)
        }
    }();
    var z = window.BMap || {};
    z.version = "2.0";
    z.vI = 0.34 > Math.random();
    0 <= z.version.indexOf("#") && (z.version = "2.0");
    z.Tq = [];
    z.Fe = function (a) {
        this.Tq.push(a)
    };
    z.Jq = [];
    z.sm = function (a) {
        this.Jq.push(a)
    };
    z.tT = z.apiLoad || s();
    var qa = window.BMAP_AUTHENTIC_KEY;
    window.BMAP_AUTHENTIC_KEY = p;
    var ra = window.BMap_loadScriptTime, sa = (new Date).getTime(), ta = p, ua = o, va = p, wa = 5042, xa = 5002, za = 5003, Aa = "load_mapclick", Ba = 5038, Da = 5041, Ea = 5047, Fa = 5036, Ga = 5039, Ha = 5037, Ia = 5040, Ja = 5011, Ka = 7E3;

    function La(a, b) {
        if (a = w.N(a)) {
            var c = this;
            w.lang.ra.call(c);
            b = b || {};
            c.D = {
                tB: 200,
                Rb: o,
                ow: q,
                rC: o,
                jo: o,
                ko: o,
                JJ: o,
                tC: o,
                Vr: o,
                mw: o,
                Nl: o,
                ho: b.enable3DBuilding || q,
                Lc: 25,
                FZ: 240,
                hT: 450,
                Jb: F.Jb,
                md: F.md,
                Uw: !!b.Uw,
                Tb: Math.round(b.minZoom) || 1,
                Mb: Math.round(b.maxZoom) || 19,
                tb: b.mapType || Ma,
                M1: q,
                nw: o,
                kw: 500,
                OU: b.enableHighResolution !== q,
                Si: b.enableMapClick !== q,
                devicePixelRatio: b.devicePixelRatio || window.devicePixelRatio || 1,
                UE: b.vectorMapLevel || (G() ? 3 : 99),
                fe: b.mapStyle || p,
                TW: b.logoControl === q ? q : o,
                BT: [],
                Mv: b.beforeClickIcon || p
            };
            c.D.fe && (this.sW(c.D.fe.controls), this.PK(c.D.fe.geotableId));
            c.D.fe && c.D.fe.styleId && c.J0(c.D.fe.styleId);
            c.D.Fl = {
                dark: {backColor: "#2D2D2D", textColor: "#bfbfbf", iconUrl: "dicons"},
                normal: {backColor: "#F3F1EC", textColor: "#c61b1b", iconUrl: "icons"},
                light: {backColor: "#EBF8FC", textColor: "#017fb4", iconUrl: "licons"}
            };
            b.enableAutoResize && (c.D.mw = b.enableAutoResize);
            b.enableStreetEntrance === q && (c.D.Nl = b.enableStreetEntrance);
            b.enableDeepZoom === q && (c.D.JJ = b.enableDeepZoom);
            var d = c.D.BT;
            if (G())for (var e = 0, f = d.length; e < f; e++)if (w.S[d[e]]) {
                c.D.devicePixelRatio = 1;
                break
            }
            d = -1 < navigator.userAgent.toLowerCase().indexOf("android");
            e = -1 < navigator.userAgent.toLowerCase().indexOf("mqqbrowser");
            if (-1 < navigator.userAgent.toLowerCase().indexOf("UCBrowser") || d && e)c.D.UE = 99;
            c.Ia = a;
            c.GA(a);
            a.unselectable = "on";
            a.innerHTML = "";
            a.appendChild(c.la());
            b.size && this.td(b.size);
            d = c.Lb();
            c.width = d.width;
            c.height = d.height;
            c.offsetX = 0;
            c.offsetY = 0;
            c.platform = a.firstChild;
            c.ge = c.platform.firstChild;
            c.ge.style.width = c.width + "px";
            c.ge.style.height = c.height + "px";
            c.Yd = {};
            c.Qe = new H(0, 0);
            c.hc = new H(0, 0);
            c.wa = 3;
            c.vc = 0;
            c.MB = p;
            c.LB = p;
            c.Ib = "";
            c.Qv = "";
            c.th = {};
            c.th.custom = {};
            c.Ha = 0;
            c.G = new Na(a, {yf: "api"});
            c.G.J();
            c.G.yE(c);
            b = b || {};
            d = c.tb = c.D.tb;
            c.ie = d.wo();
            d === Oa && Pa(xa);
            d === Qa && Pa(za);
            d = c.D;
            d.wN = Math.round(b.minZoom);
            d.vN = Math.round(b.maxZoom);
            c.ju();
            c.H = {wc: q, Yb: 0, Ds: 0, hL: 0, c1: 0, lB: q, iE: -1, ze: []};
            c.platform.style.cursor = c.D.Jb;
            for (e = 0; e < z.Tq.length; e++)z.Tq[e](c);
            c.H.iE = e;
            c.P();
            J.load("map", function () {
                c.qb()
            });
            c.D.Si && (setTimeout(function () {
                Pa(Aa)
            }, 1E3), J.load("mapclick", function () {
                window.MPC_Mgr = window.MPC_Mgr || {};
                window.MPC_Mgr[c.Q] = new Ra(c)
            }, o));
            Sa() && J.load("oppc", function () {
                c.Cy()
            });
            G() && J.load("opmb", function () {
                c.Cy()
            });
            a = p;
            c.UA = []
        }
    }

    w.lang.ia(La, w.lang.ra, "Map");
    w.extend(La.prototype, {
        la: function () {
            var a = K("div"), b = a.style;
            b.overflow = "visible";
            b.position = "absolute";
            b.zIndex = "0";
            b.top = b.left = "0px";
            var b = K("div", {"class": "BMap_mask"}), c = b.style;
            c.position = "absolute";
            c.top = c.left = "0px";
            c.zIndex = "9";
            c.overflow = "hidden";
            c.WebkitUserSelect = "none";
            a.appendChild(b);
            return a
        }, GA: function (a) {
            var b = a.style;
            b.overflow = "hidden";
            "absolute" !== Ta(a).position && (b.position = "relative", b.zIndex = 0);
            b.backgroundColor = "#F3F1EC";
            b.color = "#000";
            b.textAlign = "left"
        }, P: function () {
            var a = this;
            a.qr = function () {
                var b = a.Lb();
                if (a.width !== b.width || a.height !== b.height) {
                    var c = new L(a.width, a.height), d = new M("onbeforeresize");
                    d.size = c;
                    a.dispatchEvent(d);
                    a.Mj((b.width - a.width) / 2, (b.height - a.height) / 2);
                    a.ge.style.width = (a.width = b.width) + "px";
                    a.ge.style.height = (a.height = b.height) + "px";
                    c = new M("onresize");
                    c.size = b;
                    a.dispatchEvent(c)
                }
            };
            a.D.mw && (a.H.ur = setInterval(a.qr, 80))
        }, Mj: function (a, b, c, d) {
            var e = this.ka().Ac(this.U()), f = this.ie, g = o;
            c && H.UK(c) && (this.Qe = new H(c.lng, c.lat), g = q);
            if (c = c && d ? f.jm(c, this.Ib) : this.hc)if (this.hc = new H(c.lng + a * e, c.lat - b * e), (a = f.Tg(this.hc, this.Ib)) && g)this.Qe = a
        }, og: function (a, b) {
            if (Ua(a) && (this.ju(), this.dispatchEvent(new M("onzoomstart")), a = this.qn(a).zoom, a !== this.wa)) {
                this.vc = this.wa;
                this.wa = a;
                var c;
                b ? c = b : this.Mg() && (c = this.Mg().V());
                c && (c = this.Ub(c, this.vc), this.Mj(this.width / 2 - c.x, this.height / 2 - c.y, this.mb(c, this.vc), o));
                this.dispatchEvent(new M("onzoomstartcode"))
            }
        }, Bc: function (a) {
            this.og(a)
        }, YE: function (a) {
            this.og(this.wa + 1, a)
        }, ZE: function (a) {
            this.og(this.wa - 1, a)
        }, Zh: function (a) {
            a instanceof H && (this.hc = this.ie.jm(a, this.Ib), this.Qe = H.UK(a) ? new H(a.lng, a.lat) : this.ie.Tg(this.hc, this.Ib))
        }, ig: function (a, b) {
            a = Math.round(a) || 0;
            b = Math.round(b) || 0;
            this.Mj(-a, -b)
        }, Cv: function (a) {
            a && Va(a.Me) && (a.Me(this), this.dispatchEvent(new M("onaddcontrol", a)))
        }, mM: function (a) {
            a && Va(a.remove) && (a.remove(), this.dispatchEvent(new M("onremovecontrol", a)))
        }, Pn: function (a) {
            a && Va(a.fa) && (a.fa(this), this.dispatchEvent(new M("onaddcontextmenu", a)))
        }, So: function (a) {
            a && Va(a.remove) && (this.dispatchEvent(new M("onremovecontextmenu", a)), a.remove())
        }, ya: function (a) {
            a && Va(a.Me) && (a.Me(this), this.dispatchEvent(new M("onaddoverlay", a)))
        }, Gb: function (a) {
            a && Va(a.remove) && (a.remove(), this.dispatchEvent(new M("onremoveoverlay", a)))
        }, dJ: function () {
            this.dispatchEvent(new M("onclearoverlays"))
        }, Dg: function (a) {
            a && this.dispatchEvent(new M("onaddtilelayer", a))
        }, bh: function (a) {
            a && this.dispatchEvent(new M("onremovetilelayer", a))
        }, kg: function (a) {
            if (this.tb !== a) {
                var b = new M("onsetmaptype");
                b.D1 = this.tb;
                this.tb = this.D.tb = a;
                this.ie = this.tb.wo();
                this.Mj(0, 0, this.Aa(), o);
                this.ju();
                var c = this.qn(this.U()).zoom;
                this.og(c);
                this.dispatchEvent(b);
                b = new M("onmaptypechange");
                b.wa = c;
                b.tb = a;
                this.dispatchEvent(b);
                (a === Wa || a === Qa) && Pa(za)
            }
        }, Gf: function (a) {
            var b = this;
            if (a instanceof H)b.Zh(a, {noAnimation: o}); else if (Xa(a))if (b.tb === Oa) {
                var c = F.pB[a];
                c && (pt = c.m, b.Gf(pt))
            } else {
                var d = this.IG();
                d.BE(function (c) {
                    0 === d.Vl() && 2 === d.ta.result.type && (b.Gf(c.bk(0).point), Oa.Xj(a) && b.xE(a))
                });
                d.search(a, {log: "center"})
            }
        }, $d: function (a, b) {
            "[object Undefined]" !== Object.prototype.toString.call(b) && (b = parseInt(b));
            va = G() ? Ya.ki.Sj(z.vI ? 102 : 101) : Ya.ki.Sj(1);
            va.ut();
            va.vy = +new Date;
            va.ac("script_loaded", sa - ra);
            va.ac("centerAndZoom");
            var c = this;
            if (Xa(a))if (c.tb === Oa) {
                var d = F.pB[a];
                d && (pt = d.m, c.$d(pt, b))
            } else {
                var e = c.IG();
                e.BE(function (d) {
                    if (0 === e.Vl() && (2 === e.ta.result.type || 11 === e.ta.result.type)) {
                        var d = d.bk(0).point, f = b || O.MC(e.ta.content.level, c);
                        c.$d(d, f);
                        Oa.Xj(a) && c.xE(a)
                    }
                });
                e.search(a, {log: "center"})
            } else if (a instanceof H && b) {
                b = c.qn(b).zoom;
                c.vc = c.wa || b;
                c.wa = b;
                d = c.Qe;
                c.Qe = new H(a.lng, a.lat);
                c.hc = c.ie.jm(c.Qe, c.Ib);
                c.MB = c.MB || c.wa;
                c.LB = c.LB || c.Qe;
                var f = new M("onload"), g = new M("onloadcode");
                f.point = new H(a.lng, a.lat);
                f.pixel = c.Ub(c.Qe, c.wa);
                f.zoom = b;
                c.loaded || (c.loaded = o, c.dispatchEvent(f), ta || (ta = Za()));
                c.dispatchEvent(g);
                f = new M("onmoveend");
                f.kG = "centerAndZoom";
                d.$a(c.Qe) || c.dispatchEvent(f);
                c.dispatchEvent(new M("onmoveend"));
                c.vc !== c.wa && (d = new M("onzoomend"), d.kG = "centerAndZoom", c.dispatchEvent(d));
                c.D.ho && c.ho()
            }
        }, IG: function () {
            this.H.nL || (this.H.nL = new ab(1));
            return this.H.nL
        }, reset: function () {
            this.$d(this.LB, this.MB, o)
        }, enableDragging: function () {
            this.D.Rb = o
        }, disableDragging: function () {
            this.D.Rb = q
        }, enableInertialDragging: function () {
            this.D.nw = o
        }, disableInertialDragging: function () {
            this.D.nw = q
        }, enableScrollWheelZoom: function () {
            this.D.ko = o
        }, disableScrollWheelZoom: function () {
            this.D.ko = q
        }, enableContinuousZoom: function () {
            this.D.jo = o
        }, disableContinuousZoom: function () {
            this.D.jo = q
        }, enableDoubleClickZoom: function () {
            this.D.rC = o
        }, disableDoubleClickZoom: function () {
            this.D.rC = q
        }, enableKeyboard: function () {
            this.D.ow = o
        }, disableKeyboard: function () {
            this.D.ow = q
        }, enablePinchToZoom: function () {
            this.D.Vr = o
        }, disablePinchToZoom: function () {
            this.D.Vr = q
        }, enableAutoResize: function () {
            this.D.mw = o;
            this.qr();
            this.H.ur || (this.H.ur = setInterval(this.qr, 80))
        }, disableAutoResize: function () {
            this.D.mw = q;
            this.H.ur && (clearInterval(this.H.ur), this.H.ur = p)
        }, ho: function () {
            this.D.ho = o;
            this.an || (this.an = new bb({SJ: o}), this.Dg(this.an))
        }, yU: function () {
            this.D.ho = q;
            this.an && (this.bh(this.an), this.an = p, delete this.an)
        }, Lb: function () {
            return this.Ir && this.Ir instanceof L ? new L(this.Ir.width, this.Ir.height) : new L(this.Ia.clientWidth, this.Ia.clientHeight)
        }, td: function (a) {
            a && a instanceof L ? (this.Ir = a, this.Ia.style.width = a.width + "px", this.Ia.style.height = a.height + "px") : this.Ir = p
        }, Aa: u("Qe"), U: u("wa"), TT: function () {
            this.qr()
        }, qn: function (a) {
            var b = this.D.Tb, c = this.D.Mb, d = q, a = Math.round(a);
            a < b && (d = o, a = b);
            a > c && (d = o, a = c);
            return {zoom: a, AC: d}
        }, Ea: u("Ia"), Ub: function (a, b) {
            b = b || this.U();
            return this.ie.Ub(a, b, this.hc, this.Lb(), this.Ib)
        }, mb: function (a, b) {
            b = b || this.U();
            return this.ie.mb(a, b, this.hc, this.Lb(), this.Ib)
        }, Ee: function (a, b) {
            if (a) {
                var c = this.Ub(new H(a.lng, a.lat), b);
                c.x -= this.offsetX;
                c.y -= this.offsetY;
                return c
            }
        }, cM: function (a, b) {
            if (a) {
                var c = new P(a.x, a.y);
                c.x += this.offsetX;
                c.y += this.offsetY;
                return this.mb(c, b)
            }
        }, pointToPixelFor3D: function (a, b) {
            var c = map.Ib;
            this.tb === Oa && c && cb.jJ(a, this, b)
        }, y1: function (a, b) {
            var c = map.Ib;
            this.tb === Oa && c && cb.iJ(a, this, b)
        }, z1: function (a, b) {
            var c = this, d = map.Ib;
            c.tb === Oa && d && cb.jJ(a, c, function (a) {
                a.x -= c.offsetX;
                a.y -= c.offsetY;
                b && b(a)
            })
        }, x1: function (a, b) {
            var c = map.Ib;
            this.tb === Oa && c && (a.x += this.offsetX, a.y += this.offsetY, cb.iJ(a, this, b))
        }, Md: function (a) {
            if (!this.Tw())return new db;
            var b = a || {}, a = b.margins || [0, 0, 0, 0], c = b.zoom || p, b = this.mb({
                x: a[3],
                y: this.height - a[2]
            }, c), a = this.mb({x: this.width - a[1], y: a[0]}, c);
            return new db(b, a)
        }, Tw: function () {
            return !!this.loaded
        }, qQ: function (a, b) {
            for (var c = this.ka(), d = b.margins || [10, 10, 10, 10], e = b.zoomFactor || 0, f = d[1] + d[3], d = d[0] + d[2], g = c.ro(), i = c = c.Sl(); i >= g; i--) {
                var k = this.ka().Ac(i);
                if (a.OE().lng / k < this.width - f && a.OE().lat / k < this.height - d)break
            }
            i += e;
            i < g && (i = g);
            i > c && (i = c);
            return i
        }, os: function (a, b) {
            var c = {center: this.Aa(), zoom: this.U()};
            if (!a || !a instanceof db && 0 === a.length || a instanceof db && a.fj())return c;
            var d = [];
            a instanceof db ? (d.push(a.zf()), d.push(a.Ce())) : d = a.slice(0);
            for (var b = b || {}, e = [], f = 0, g = d.length; f < g; f++)e.push(this.ie.jm(d[f], this.Ib));
            d = new db;
            for (f = e.length - 1; 0 <= f; f--)d.extend(e[f]);
            if (d.fj())return c;
            c = d.Aa();
            e = this.qQ(d, b);
            b.margins && (d = b.margins, f = (d[1] - d[3]) / 2, d = (d[0] - d[2]) / 2, g = this.ka().Ac(e), b.offset && (f = b.offset.width, d = b.offset.height), c.lng += g * f, c.lat += g * d);
            c = this.ie.Tg(c, this.Ib);
            return {center: c, zoom: e}
        }, eh: function (a, b) {
            var c;
            c = a && a.center ? a : this.os(a, b);
            var b = b || {}, d = b.delay || 200;
            if (c.zoom === this.wa && b.enableAnimation !== q) {
                var e = this;
                setTimeout(function () {
                    e.Zh(c.center, {duration: 210})
                }, d)
            } else this.$d(c.center, c.zoom)
        }, Bf: u("Yd"), Mg: function () {
            return this.H.ab && this.H.ab.Ja() ? this.H.ab : p
        }, getDistance: function (a, b) {
            if (a && b) {
                if (a.$a(b))return 0;
                var c = 0, c = Q.po(a, b);
                if (c === p || c === j)c = 0;
                return c
            }
        }, aD: function () {
            var a = [], b = this.ja, c = this.le;
            if (b)for (var d in b)b[d]instanceof eb && a.push(b[d]);
            if (c) {
                d = 0;
                for (b = c.length; d < b; d++)a.push(c[d])
            }
            return a
        }, ka: u("tb"), Cy: function () {
            for (var a = this.H.iE; a < z.Tq.length; a++)z.Tq[a](this);
            this.H.iE = a
        }, xE: function (a) {
            this.Ib = Oa.Xj(a);
            this.Qv = Oa.cK(this.Ib);
            this.tb === Oa && this.ie instanceof fb && (this.ie.FB = this.Ib)
        }, setDefaultCursor: function (a) {
            this.D.Jb = a;
            this.platform && (this.platform.style.cursor = this.D.Jb)
        }, getDefaultCursor: function () {
            return this.D.Jb
        }, setDraggingCursor: function (a) {
            this.D.md = a
        }, getDraggingCursor: function () {
            return this.D.md
        }, FK: function () {
            return this.D.OU && 1.5 <= this.D.devicePixelRatio
        }, Ev: function (a, b) {
            b ? this.th[b] || (this.th[b] = {}) : b = "custom";
            a.tag = b;
            a instanceof gb && (this.th[b][a.Q] = a, a.fa(this));
            var c = this;
            J.load("hotspot", function () {
                c.Cy()
            }, o)
        }, GX: function (a, b) {
            b || (b = "custom");
            this.th[b][a.Q] && delete this.th[b][a.Q]
        }, Dl: function (a) {
            a || (a = "custom");
            this.th[a] = {}
        }, ju: function () {
            var a = this.tb.ro(), b = this.tb.Sl(), c = this.D;
            c.Tb = c.wN || a;
            c.Mb = c.vN || b;
            c.Tb < a && (c.Tb = a);
            c.Mb > b && (c.Mb = b)
        }, setMinZoom: function (a) {
            a = Math.round(a);
            a > this.D.Mb && (a = this.D.Mb);
            this.D.wN = a;
            this.mI()
        }, setMaxZoom: function (a) {
            a = Math.round(a);
            a < this.D.Tb && (a = this.D.Tb);
            this.D.vN = a;
            this.mI()
        }, mI: function () {
            this.ju();
            var a = this.D;
            this.wa < a.Tb ? this.Bc(a.Tb) : this.wa > a.Mb && this.Bc(a.Mb);
            var b = new M("onzoomspanchange");
            b.Tb = a.Tb;
            b.Mb = a.Mb;
            this.dispatchEvent(b)
        }, L0: u("UA"), getKey: function () {
            return qa
        }, Zs: function (a) {
            var b = this;
            window.MPC_Mgr && window.MPC_Mgr[b.Q] && window.MPC_Mgr[b.Q].close();
            b.D.Si = q;
            if (a) {
                b = this;
                a.styleJson && (a.styleStr = b.IY(a.styleJson));
                G() && w.S.yM ? setTimeout(function () {
                    b.D.fe = a;
                    b.dispatchEvent(new M("onsetcustomstyles", a))
                }, 50) : (this.D.fe = a, this.dispatchEvent(new M("onsetcustomstyles", a)), this.PK(b.D.fe.geotableId));
                var c = {style: a.style};
                a.features && 0 < a.features.length && (c.features = o);
                a.styleJson && 0 < a.styleJson.length && (c.styleJson = o);
                Pa(5050, c);
                a.style && (c = b.D.Fl[a.style] ? b.D.Fl[a.style].backColor : b.D.Fl.normal.backColor) && (this.Ea().style.backgroundColor = c)
            }
        }, sW: function (a) {
            this.controls || (this.controls = {
                navigationControl: new hb,
                scaleControl: new jb,
                overviewMapControl: new kb,
                mapTypeControl: new lb
            });
            var b = this, c;
            for (c in this.controls)b.mM(b.controls[c]);
            a = a || [];
            w.Xb.yb(a, function (a) {
                b.Cv(b.controls[a])
            })
        }, PK: function (a) {
            a ? this.Gr && this.Gr.Pf === a || (this.bh(this.Gr), this.Gr = new mb({geotableId: a}), this.Dg(this.Gr)) : this.bh(this.Gr)
        }, Hb: function () {
            var a = this.U() >= this.D.UE && this.ka() === Ma && 18 >= this.U(), b = q;
            try {
                document.createElement("canvas").getContext("2d"), b = o
            } catch (c) {
                b = q
            }
            return a && b
        }, getCurrentCity: function () {
            return {name: this.Yn, code: this.iB}
        }, getPanorama: u("G"), setPanorama: function (a) {
            this.G = a;
            this.G.yE(this)
        }, IY: function (a) {
            for (var b = {
                featureType: "t",
                elementType: "e",
                visibility: "v",
                color: "c",
                lightness: "l",
                saturation: "s",
                weight: "w",
                zoom: "z",
                hue: "h"
            }, c = {
                all: "all",
                geometry: "g",
                "geometry.fill": "g.f",
                "geometry.stroke": "g.s",
                labels: "l",
                "labels.text.fill": "l.t.f",
                "labels.text.stroke": "l.t.s",
                "lables.text": "l.t",
                "labels.icon": "l.i"
            }, d = [], e = 0, f; f = a[e]; e++) {
                var g = f.stylers;
                delete f.stylers;
                w.extend(f, g);
                var g = [], i;
                for (i in b)f[i] && ("elementType" === i ? g.push(b[i] + ":" + c[f[i]]) : g.push(b[i] + ":" + f[i]));
                2 < g.length && d.push(g.join("|"))
            }
            return d.join(",")
        }
    });
    function Pa(a, b) {
        if (a) {
            var b = b || {}, c = "", d;
            for (d in b)c = c + "&" + d + "=" + encodeURIComponent(b[d]);
            var e = function (a) {
                a && (nb = o, setTimeout(function () {
                    ob.src = z.zc + "images/blank.gif?" + a.src
                }, 50))
            }, f = function () {
                var a = qb.shift();
                a && e(a)
            };
            d = (1E8 * Math.random()).toFixed(0);
            nb ? qb.push({src: "product=jsapi&sub_product=jsapi&v=" + z.version + "&sub_product_v=" + z.version + "&t=" + d + "&code=" + a + "&da_src=" + a + c}) : e({src: "product=jsapi&sub_product=jsapi&v=" + z.version + "&sub_product_v=" + z.version + "&t=" + d + "&code=" + a + "&da_src=" + a + c});
            rb || (w.F(ob, "load", function () {
                nb = q;
                f()
            }), w.F(ob, "error", function () {
                nb = q;
                f()
            }), rb = o)
        }
    }

    var nb, rb, qb = [], ob = new Image;
    Pa(5E3, {device_pixel_ratio: window.devicePixelRatio, platform: navigator.platform});
    z.JK = {
        TILE_BASE_URLS: ["ss0.baidu.com/5bwHcj7lABFU8t_jkk_Z1zRvfdw6buu", "ss0.baidu.com/5bwHcj7lABFV8t_jkk_Z1zRvfdw6buu", "ss0.baidu.com/5bwHcj7lABFS8t_jkk_Z1zRvfdw6buu", "ss0.bdstatic.com/5bwHcj7lABFT8t_jkk_Z1zRvfdw6buu", "ss0.bdstatic.com/5bwHcj7lABFY8t_jkk_Z1zRvfdw6buu"],
        TILE_ONLINE_URLS: ["ss0.bdstatic.com/8bo_dTSlR1gBo1vgoIiO_jowehsv", "ss0.bdstatic.com/8bo_dTSlRMgBo1vgoIiO_jowehsv", "ss0.bdstatic.com/8bo_dTSlRcgBo1vgoIiO_jowehsv", "ss0.bdstatic.com/8bo_dTSlRsgBo1vgoIiO_jowehsv", "ss0.bdstatic.com/8bo_dTSlQ1gBo1vgoIiO_jowehsv"],
        TIlE_PERSPECT_URLS: ["ss0.bdstatic.com/-OR1cTe9KgQFm2e88IuM_a", "ss0.bdstatic.com/-ON1cTe9KgQFm2e88IuM_a", "ss0.bdstatic.com/-OZ1cTe9KgQFm2e88IuM_a", "ss0.bdstatic.com/-OV1cTe9KgQFm2e88IuM_a"],
        geolocControl: "sp2.baidu.com/8LkJsjOpB1gCo2Kml5_Y_D3",
        TILES_YUN_HOST: ["sp0.baidu.com/-eR1bSahKgkFkRGko9WTAnF6hhy", "sp0.baidu.com/-eN1bSahKgkFkRGko9WTAnF6hhy", "sp0.baidu.com/-eZ1bSahKgkFkRGko9WTAnF6hhy", "sp0.baidu.com/-eV1bSahKgkFkRGko9WTAnF6hhy"],
        traffic: "sp0.baidu.com/7_AZsjOpB1gCo2Kml5_Y_D3",
        iw_pano: "ss0.bdstatic.com/5LUZemba_QUU8t7mm9GUKT-xh_",
        message: "sp0.baidu.com/7vo0bSba2gU2pMbgoY3K",
        baidumap: "sp0.baidu.com/80MWsjip0QIZ8tyhnq",
        wuxian: "sp0.baidu.com/6a1OdTeaKgQFm2e88IuM_a",
        pano: ["ss0.bdstatic.com/5LUZemba_QUU8t7mm9GUKT-xh_", "ss0.bdstatic.com/5LUZemfa_QUU8t7mm9GUKT-xh_", "ss0.bdstatic.com/5LUZemja_QUU8t7mm9GUKT-xh_"],
        main_domain_nocdn: {baidu: "sp0.baidu.com/9_Q4sjOpB1gCo2Kml5_Y_D3", other: "sapi.map.baidu.com"},
        main_domain_cdn: {
            baidu: ["ss0.bdstatic.com/9_Q4vHSd2RZ3otebn9fN2DJv", "ss0.baidu.com/9_Q4vXSd2RZ3otebn9fN2DJv", "ss0.bdstatic.com/9_Q4vnSd2RZ3otebn9fN2DJv"],
            other: ["sapi.map.baidu.com"]
        },
        map_click: "sp0.baidu.com/80MWbzKh2wt3n2qy8IqW0jdnxx1xbK",
        vector_traffic: "ss0.bdstatic.com/8aZ1cTe9KgQIm2_p8IuM_a"
    };
    z.oW = {
        TILE_BASE_URLS: ["shangetu0.map.bdimg.com", "shangetu1.map.bdimg.com", "shangetu2.map.bdimg.com", "shangetu3.map.bdimg.com", "shangetu4.map.bdimg.com"],
        TILE_ONLINE_URLS: ["online0.map.bdimg.com", "online1.map.bdimg.com", "online2.map.bdimg.com", "online3.map.bdimg.com", "online4.map.bdimg.com"],
        TIlE_PERSPECT_URLS: ["d0.map.baidu.com", "d1.map.baidu.com", "d2.map.baidu.com", "d3.map.baidu.com"],
        geolocControl: "loc.map.baidu.com",
        TILES_YUN_HOST: ["g0.api.map.baidu.com", "g1.api.map.baidu.com", "g2.api.map.baidu.com", "g3.api.map.baidu.com"],
        traffic: "its.map.baidu.com",
        iw_pano: "pcsv0.map.bdimg.com",
        message: "j.map.baidu.com",
        baidumap: "map.baidu.com",
        wuxian: "wuxian.baidu.com",
        pano: ["pcsv0.map.bdimg.com", "pcsv1.map.bdimg.com", "pcsv2.map.bdimg.com"],
        main_domain_nocdn: {baidu: "api.map.baidu.com"},
        main_domain_cdn: {baidu: ["api0.map.bdimg.com", "api1.map.bdimg.com", "api2.map.bdimg.com"]},
        map_click: "mapclick.map.baidu.com",
        vector_traffic: "or.map.bdimg.com"
    };
    z.lZ = {
        "0": {proto: "http://", domain: z.oW},
        1: {proto: "https://", domain: z.JK},
        2: {proto: "https://", domain: z.JK}
    };
    z.Xx = window.HOST_TYPE || "0";
    z.url = z.lZ[z.Xx];
    z.Ko = z.url.proto + z.url.domain.baidumap + "/";
    z.zc = z.url.proto + ("2" == z.Xx ? z.url.domain.main_domain_nocdn.other : z.url.domain.main_domain_nocdn.baidu) + "/";
    z.da = z.url.proto + ("2" == z.Xx ? z.url.domain.main_domain_cdn.other[0] : z.url.domain.main_domain_cdn.baidu[0]) + "/";
    z.dg = function (a, b) {
        var c, d, b = b || "";
        switch (a) {
            case "main_domain_nocdn":
                c = z.zc + b;
                break;
            case "main_domain_cdn":
                c = z.da + b;
                break;
            default:
                d = z.url.domain[a], "[object Array]" == Object.prototype.toString.call(d) ? (c = [], w.Xb.yb(d, function (a, d) {
                    c[d] = z.url.proto + a + "/" + b
                })) : c = z.url.proto + z.url.domain[a] + "/" + b
        }
        return c
    };
    function sb(a) {
        var b = {duration: 1E3, Lc: 30, bo: 0, cc: tb.lL, Ks: s()};
        this.Lf = [];
        if (a)for (var c in a)b[c] = a[c];
        this.k = b;
        if (Ua(b.bo)) {
            var d = this;
            setTimeout(function () {
                d.start()
            }, b.bo)
        } else b.bo != ub && this.start()
    }

    var ub = "INFINITE";
    sb.prototype.start = function () {
        this.cu = Za();
        this.iz = this.cu + this.k.duration;
        wb(this)
    };
    sb.prototype.add = function (a) {
        this.Lf.push(a)
    };
    function wb(a) {
        var b = Za();
        b >= a.iz ? (Va(a.k.la) && a.k.la(a.k.cc(1)), Va(a.k.finish) && a.k.finish(), 0 < a.Lf.length && (b = a.Lf[0], b.Lf = [].concat(a.Lf.slice(1)), b.start())) : (a.Dx = a.k.cc((b - a.cu) / a.k.duration), Va(a.k.la) && a.k.la(a.Dx), a.KE || (a.lr = setTimeout(function () {
            wb(a)
        }, 1E3 / a.k.Lc)))
    }

    sb.prototype.stop = function (a) {
        this.KE = o;
        for (var b = 0; b < this.Lf.length; b++)this.Lf[b].stop(), this.Lf[b] = p;
        this.Lf.length = 0;
        this.lr && (clearTimeout(this.lr), this.lr = p);
        this.k.Ks(this.Dx);
        a && (this.iz = this.cu, wb(this))
    };
    sb.prototype.cancel = ga(1);
    var tb = {
        lL: function (a) {
            return a
        }, reverse: function (a) {
            return 1 - a
        }, lC: function (a) {
            return a * a
        }, kC: function (a) {
            return Math.pow(a, 3)
        }, mC: function (a) {
            return -(a * (a - 2))
        }, HJ: function (a) {
            return Math.pow(a - 1, 3) + 1
        }, GJ: function (a) {
            return 0.5 > a ? 2 * a * a : -2 * (a - 2) * a - 1
        }, Y_: function (a) {
            return 0.5 > a ? 4 * Math.pow(a, 3) : 4 * Math.pow(a - 1, 3) + 1
        }, Z_: function (a) {
            return (1 - Math.cos(Math.PI * a)) / 2
        }
    };
    tb["ease-in"] = tb.lC;
    tb["ease-out"] = tb.mC;
    var F = {
        bF: 34,
        cF: 21,
        dF: new L(21, 32),
        MN: new L(10, 32),
        LN: new L(24, 36),
        KN: new L(12, 36),
        $E: new L(13, 1),
        ea: z.da + "images/",
        U0: "http://api0.map.bdimg.com/images/",
        aF: z.da + "images/markers_new.png",
        IN: 24,
        JN: 73,
        pB: {
            "\u5317\u4eac": {tx: "bj", m: new H(116.403874, 39.914889)},
            "\u4e0a\u6d77": {tx: "sh", m: new H(121.487899, 31.249162)},
            "\u6df1\u5733": {tx: "sz", m: new H(114.025974, 22.546054)},
            "\u5e7f\u5dde": {tx: "gz", m: new H(113.30765, 23.120049)}
        },
        fontFamily: "arial,sans-serif"
    };
    w.S.ag ? (w.extend(F, {
        wJ: "url(" + F.ea + "ruler.cur),crosshair",
        Jb: "-moz-grab",
        md: "-moz-grabbing"
    }), w.platform.cL && (F.fontFamily = "arial,simsun,sans-serif")) : w.S.aJ || w.S.yM ? w.extend(F, {
        wJ: "url(" + F.ea + "ruler.cur) 2 6,crosshair",
        Jb: "url(" + F.ea + "openhand.cur) 8 8,default",
        md: "url(" + F.ea + "closedhand.cur) 8 8,move"
    }) : w.extend(F, {
        wJ: "url(" + F.ea + "ruler.cur),crosshair",
        Jb: "url(" + F.ea + "openhand.cur),default",
        md: "url(" + F.ea + "closedhand.cur),move"
    });
    function xb(a, b) {
        var c = a.style;
        c.left = b[0] + "px";
        c.top = b[1] + "px"
    }

    function yb(a) {
        0 < w.S.ba ? a.unselectable = "on" : a.style.MozUserSelect = "none"
    }

    function zb(a) {
        return a && a.parentNode && 11 != a.parentNode.nodeType
    }

    function Ab(a, b) {
        w.B.Rw(a, "beforeEnd", b);
        return a.lastChild
    }

    function Bb(a) {
        for (var b = {
            left: 0,
            top: 0
        }; a && a.offsetParent;)b.left += a.offsetLeft, b.top += a.offsetTop, a = a.offsetParent;
        return b
    }

    function oa(a) {
        a = window.event || a;
        a.stopPropagation ? a.stopPropagation() : a.cancelBubble = o
    }

    function Cb(a) {
        a = window.event || a;
        a.preventDefault ? a.preventDefault() : a.returnValue = q;
        return q
    }

    function pa(a) {
        oa(a);
        return Cb(a)
    }

    function Db() {
        var a = document.documentElement, b = document.body;
        return a && (a.scrollTop || a.scrollLeft) ? [a.scrollTop, a.scrollLeft] : b ? [b.scrollTop, b.scrollLeft] : [0, 0]
    }

    function Eb(a, b) {
        if (a && b)return Math.round(Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)))
    }

    function Fb(a, b) {
        var c = [], b = b || function (a) {
                return a
            }, d;
        for (d in a)c.push(d + "=" + b(a[d]));
        return c.join("&")
    }

    function K(a, b, c) {
        var d = document.createElement(a);
        c && (d = document.createElementNS(c, a));
        return w.B.wE(d, b || {})
    }

    function Ta(a) {
        if (a.currentStyle)return a.currentStyle;
        if (a.ownerDocument && a.ownerDocument.defaultView)return a.ownerDocument.defaultView.getComputedStyle(a, p)
    }

    function Va(a) {
        return "function" == typeof a
    }

    function Ua(a) {
        return "number" == typeof a
    }

    function Xa(a) {
        return "string" == typeof a
    }

    function Gb(a) {
        return "undefined" != typeof a
    }

    function Hb(a) {
        return "object" == typeof a
    }

    var Ib = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    function Jb(a) {
        var b = "", c, d, e = "", f, g = "", i = 0;
        f = /[^A-Za-z0-9\+\/\=]/g;
        if (!a || f.exec(a))return a;
        a = a.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        do c = Ib.indexOf(a.charAt(i++)), d = Ib.indexOf(a.charAt(i++)), f = Ib.indexOf(a.charAt(i++)), g = Ib.indexOf(a.charAt(i++)), c = c << 2 | d >> 4, d = (d & 15) << 4 | f >> 2, e = (f & 3) << 6 | g, b += String.fromCharCode(c), 64 != f && (b += String.fromCharCode(d)), 64 != g && (b += String.fromCharCode(e)); while (i < a.length);
        return b
    }

    var M = w.lang.iy;

    function G() {
        return !(!w.platform.yD && !w.platform.EW && !w.platform.fm)
    }

    function Sa() {
        return !(!w.platform.cL && !w.platform.VK && !w.platform.KW)
    }

    function Za() {
        return (new Date).getTime()
    }

    function Kb() {
        var a = document.body.appendChild(K("div"));
        a.innerHTML = '<v:shape id="vml_tester1" adj="1" />';
        var b = a.firstChild;
        if (!b.style)return q;
        b.style.behavior = "url(#default#VML)";
        b = b ? "object" == typeof b.adj : o;
        a.parentNode.removeChild(a);
        return b
    }

    function Lb() {
        return !!document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Shape", "1.1")
    }

    function Mb() {
        return !!K("canvas").getContext
    }

    function Nb(a) {
        return a * Math.PI / 180
    }

    z.SW = function () {
        var a = o, b = o, c = o, d = o, e = 0, f = 0, g = 0, i = 0;
        return {
            nP: function () {
                e += 1;
                a && (a = q, setTimeout(function () {
                    Pa(5054, {pic: e});
                    a = o;
                    e = 0
                }, 1E4))
            }, RZ: function () {
                f += 1;
                b && (b = q, setTimeout(function () {
                    Pa(5055, {move: f});
                    b = o;
                    f = 0
                }, 1E4))
            }, TZ: function () {
                g += 1;
                c && (c = q, setTimeout(function () {
                    Pa(5056, {zoom: g});
                    c = o;
                    g = 0
                }, 1E4))
            }, SZ: function (a) {
                i += a;
                d && (d = q, setTimeout(function () {
                    Pa(5057, {tile: i});
                    d = o;
                    i = 0
                }, 5E3))
            }
        }
    }();
    var Ya;
    (function () {
        function a(a) {
            this.uT = a;
            this.timing = {};
            this.start = +new Date
        }

        function b(a, b) {
            if (a.length === +a.length)for (var c = 0, d = a.length; c < d && b.call(j, c, a[c], a) !== q; c++); else for (c in a)if (a.hasOwnProperty(c) && b.call(j, c, a[c], a) === q)break
        }

        var c = [], d = {
            push: function (a) {
                c.push(a);
                if (window.localStorage && window.JSON)try {
                    localStorage.setItem("WPO_NR", JSON.stringify(c))
                } catch (b) {
                }
            }, get: function (a) {
                var b = [];
                if (window.localStorage)try {
                    a && localStorage.removeItem("WPO_NR")
                } catch (d) {
                }
                b = c;
                a && (c = []);
                return b
            }
        }, e, f, g, i, k = {};
        (!window.localStorage || !window.JSON) && document.attachEvent && window.attachEvent("onbeforeunload", function () {
            l.send()
        });
        var l = {
            send: function (a) {
                var c = [], e = [], f = a || d.get(o), g;
                0 < f.length && (b(f, function (d, e) {
                    var f = [];
                    b(e.timing, function (a, b) {
                        f.push('"' + a + '":' + b)
                    });
                    c.push('{"t":{' + f.join(",") + '},"a":' + e.uT + "}");
                    !g && (a && e.start) && (g = e.start)
                }), b(k, function (a, b) {
                    e.push(a + "=" + b)
                }), e.push("d=[" + c.join(",") + "]"), g ? e.push("_st=" + g) : e.push("_t=" + +new Date), f = new Image, f.src = "http://static.tieba.baidu.com/tb/pms/spd_img/st.gif?" + e.join("&"), window["___pms_img_" + 1 * new Date] = f)
            }
        };
        a.prototype = {
            ac: function (a, b) {
                this.timing[a] = 0 <= b ? b : new Date - this.start
            }, ut: function () {
                this.start = +new Date
            }, lN: function () {
                this.ac("tt")
            }, Yx: function () {
                this.ac("vt")
            }, wm: function () {
                f && (d.push(this), d.get().length >= g && l.send())
            }, error: s()
        };
        Ya = {
            ki: {
                qD: function (a) {
                    var b = navigator.M_ || navigator.m1 || navigator.A2 || {type: 0};
                    f = Math.random() <= (a.QX || 0.01);
                    g = a.max || 5;
                    i = a.l1 || b.type;
                    k = {p: a.CX, mnt: i, b: 50};
                    window.localStorage && (window.JSON && window.addEventListener) && (e = d.get(o), window.addEventListener("load", function () {
                        l.send(e)
                    }, q))
                }, Sj: function (b) {
                    return new a(b)
                }
            }
        }
    })();
    Ya.ki.qD({CX: 18, QX: 0.1, max: 1});
    z.zp = {pF: "#83a1ff", Bp: "#808080"};
    function Ob(a, b, c) {
        b.mm || (b.mm = [], b.handle = {});
        b.mm.push({filter: c, Ol: a});
        b.addEventListener || (b.addEventListener = function (a, c) {
            b.attachEvent("on" + a, c)
        });
        b.handle.click || (b.addEventListener("click", function (a) {
            for (var c = a.target || a.srcElement; c != b;) {
                Pb(b.mm, function (b, g) {
                    RegExp(g.filter).test(c.getAttribute("filter")) && g.Ol.call(c, a, c.getAttribute("filter"))
                });
                c = c.parentNode
            }
        }, q), b.handle.click = o)
    }

    function Pb(a, b) {
        for (var c = 0, d = a.length; c < d; c++)b(c, a[c])
    };
    function Qb(a, b) {
        if (b) {
            var c = (1E5 * Math.random()).toFixed(0);
            z._rd["_cbk" + c] = function (a) {
                b && b(a);
                delete z._rd["_cbk" + c]
            };
            a += "&callback=BMap._rd._cbk" + c
        }
        var d = K("script", {type: "text/javascript"});
        d.charset = "utf-8";
        d.src = a;
        d.addEventListener ? d.addEventListener("load", function (a) {
            a = a.target;
            a.parentNode.removeChild(a)
        }, q) : d.attachEvent && d.attachEvent("onreadystatechange", function () {
            var a = window.event.srcElement;
            a && ("loaded" == a.readyState || "complete" == a.readyState) && a.parentNode.removeChild(a)
        });
        setTimeout(function () {
            document.getElementsByTagName("head")[0].appendChild(d);
            d = p
        }, 1)
    };
    var Rb = {
        map: "zbo0go",
        common: "egzsnq",
        style: "4lpoei",
        tile: "2dj3bo",
        vectordrawlib: "1qhyiq",
        newvectordrawlib: "cbof1x",
        groundoverlay: "2nozi1",
        pointcollection: "i1g5uk",
        marker: "fl4iru",
        symbol: "jb20c2",
        canvablepath: "roglxa",
        vmlcontext: "kjq2wm",
        markeranimation: "znptje",
        poly: "kilfie",
        draw: "ayygce",
        drawbysvg: "aiparg",
        drawbyvml: "lvjonl",
        drawbycanvas: "cau2mi",
        infowindow: "obh0qo",
        oppc: "tvxa3x",
        opmb: "dy2kw5",
        menu: "ebexm5",
        control: "pk0nz4",
        navictrl: "vptfiu",
        geoctrl: "wicvgf",
        copyrightctrl: "hqcj55",
        scommon: "rwtubb",
        local: "iwfzzi",
        route: "i424yt",
        othersearch: "waxoxg",
        mapclick: "1tw2sa",
        buslinesearch: "yixnv4",
        hotspot: "3zdzqm",
        autocomplete: "jdt5le",
        coordtrans: "s5w2ur",
        coordtransutils: "5rjf55",
        clayer: "yci1ch",
        pservice: "psqa0f",
        pcommon: "h3zuwp",
        panorama: "a0idde",
        panoramaflash: "ianf2b",
        vector: "clq0ea"
    };
    w.Rx = function () {
        function a(a) {
            return d && !!c[b + a + "_" + Rb[a]]
        }

        var b = "BMap_", c = window.localStorage, d = "localStorage"in window && c !== p && c !== j;
        return {
            GW: d, set: function (a, f) {
                if (d) {
                    for (var g = b + a + "_", i = c.length, k; i--;)k = c.key(i), -1 < k.indexOf(g) && c.removeItem(k);
                    try {
                        c.setItem(b + a + "_" + Rb[a], f)
                    } catch (l) {
                        c.clear()
                    }
                }
            }, get: function (e) {
                return d && a(e) ? c.getItem(b + e + "_" + Rb[e]) : q
            }, ZI: a
        }
    }();
    function J() {
    }

    w.object.extend(J, {
        oj: {rF: -1, rO: 0, up: 1},
        gK: function () {
            var a = "drawbysvg", b = "canvablepath", c = z.vI ? "newvectordrawlib" : "vectordrawlib";
            G() && Mb() ? a = "drawbycanvas" : Lb() ? a = "drawbysvg" : Kb() ? (a = "drawbyvml", b = "vmlcontext") : Mb() && (a = "drawbycanvas");
            return {
                tile: [c],
                control: [],
                marker: ["symbol"],
                symbol: ["canvablepath", "common"],
                canvablepath: "canvablepath" === b ? [] : [b],
                vmlcontext: [],
                style: [],
                poly: ["marker", a],
                drawbysvg: ["draw"],
                drawbyvml: ["draw"],
                drawbycanvas: ["draw"],
                infowindow: ["common", "marker"],
                menu: [],
                oppc: [],
                opmb: [],
                scommon: [],
                local: ["scommon"],
                route: ["scommon"],
                othersearch: ["scommon"],
                autocomplete: ["scommon"],
                mapclick: ["scommon"],
                buslinesearch: ["route"],
                hotspot: [],
                coordtransutils: ["coordtrans"],
                clayer: ["tile"],
                pservice: [],
                pcommon: ["style", "pservice"],
                panorama: ["pcommon"],
                panoramaflash: ["pcommon"]
            }
        },
        C1: {},
        jF: {GO: z.da + "getmodules?v=2.0&t=20140707", ZS: 5E3},
        NB: q,
        yd: {Tk: {}, Vm: [], hv: []},
        load: function (a, b, c) {
            var d = this.Va(a);
            if (d.kd == this.oj.up)c && b(); else {
                if (d.kd == this.oj.rF) {
                    this.fJ(a);
                    this.jM(a);
                    var e = this;
                    e.NB == q && (e.NB = o, setTimeout(function () {
                        for (var a = [], b = 0, c = e.yd.Vm.length; b < c; b++) {
                            var d = e.yd.Vm[b], l = "";
                            ia.Rx.ZI(d) ? l = ia.Rx.get(d) : (l = "", a.push(d + "_" + Rb[d]));
                            e.yd.hv.push({FL: d, RD: l})
                        }
                        e.NB = q;
                        e.yd.Vm.length = 0;
                        0 == a.length ? e.NJ() : Qb(e.jF.GO + "&mod=" + a.join(","))
                    }, 1));
                    d.kd = this.oj.rO
                }
                d.gu.push(b)
            }
        },
        fJ: function (a) {
            if (a && this.gK()[a])for (var a = this.gK()[a], b = 0; b < a.length; b++)this.fJ(a[b]), this.yd.Tk[a[b]] || this.jM(a[b])
        },
        jM: function (a) {
            for (var b = 0; b < this.yd.Vm.length; b++)if (this.yd.Vm[b] == a)return;
            this.yd.Vm.push(a)
        },
        PX: function (a, b) {
            var c = this.Va(a);
            try {
                eval(b)
            } catch (d) {
                return
            }
            c.kd = this.oj.up;
            for (var e = 0, f = c.gu.length; e < f; e++)c.gu[e]();
            c.gu.length = 0
        },
        ZI: function (a, b) {
            var c = this;
            c.timeout = setTimeout(function () {
                c.yd.Tk[a].kd != c.oj.up ? (c.remove(a), c.load(a, b)) : clearTimeout(c.timeout)
            }, c.jF.ZS)
        },
        Va: function (a) {
            this.yd.Tk[a] || (this.yd.Tk[a] = {}, this.yd.Tk[a].kd = this.oj.rF, this.yd.Tk[a].gu = []);
            return this.yd.Tk[a]
        },
        remove: function (a) {
            delete this.Va(a)
        },
        QT: function (a, b) {
            for (var c = this.yd.hv, d = o, e = 0, f = c.length; e < f; e++)"" == c[e].RD && (c[e].FL == a ? c[e].RD = b : d = q);
            d && this.NJ()
        },
        NJ: function () {
            for (var a = this.yd.hv, b = 0, c = a.length; b < c; b++)this.PX(a[b].FL, a[b].RD);
            this.yd.hv.length = 0
        }
    });
    function P(a, b) {
        this.x = a || 0;
        this.y = b || 0;
        this.x = this.x;
        this.y = this.y
    }

    P.prototype.$a = function (a) {
        return a && a.x == this.x && a.y == this.y
    };
    function L(a, b) {
        this.width = a || 0;
        this.height = b || 0
    }

    L.prototype.$a = function (a) {
        return a && this.width == a.width && this.height == a.height
    };
    function gb(a, b) {
        a && (this.wb = a, this.Q = "spot" + gb.Q++, b = b || {}, this.Ag = b.text || "", this.Ou = b.offsets ? b.offsets.slice(0) : [5, 5, 5, 5], this.oI = b.userData || p, this.wh = b.minZoom || p, this.kf = b.maxZoom || p)
    }

    gb.Q = 0;
    w.extend(gb.prototype, {
        fa: function (a) {
            this.wh == p && (this.wh = a.D.Tb);
            this.kf == p && (this.kf = a.D.Mb)
        }, ha: function (a) {
            a instanceof H && (this.wb = a)
        }, V: u("wb"), ct: ba("Ag"), fD: u("Ag"), setUserData: ba("oI"), getUserData: u("oI")
    });
    function Sb() {
        this.C = p;
        this.xb = "control";
        this.Da = this.TI = o
    }

    w.lang.ia(Sb, w.lang.ra, "Control");
    w.extend(Sb.prototype, {
        initialize: function (a) {
            this.C = a;
            if (this.A)return a.Ia.appendChild(this.A), this.A
        }, Me: function (a) {
            !this.A && (this.initialize && Va(this.initialize)) && (this.A = this.initialize(a));
            this.k = this.k || {Zg: q};
            this.GA();
            this.av();
            this.A && (this.A.Aq = this)
        }, GA: function () {
            var a = this.A;
            if (a) {
                var b = a.style;
                b.position = "absolute";
                b.zIndex = this.Gy || "10";
                b.MozUserSelect = "none";
                b.WebkitTextSizeAdjust = "none";
                this.k.Zg || w.B.Ta(a, "BMap_noprint");
                G() || w.F(a, "contextmenu", pa)
            }
        }, remove: function () {
            this.C = p;
            this.A && (this.A.parentNode && this.A.parentNode.removeChild(this.A), this.A = this.A.Aq = p)
        }, qa: function () {
            this.A = Ab(this.C.Ia, "<div unselectable='on'></div>");
            this.Da == q && w.B.J(this.A);
            return this.A
        }, av: function () {
            this.lc(this.k.anchor)
        }, lc: function (a) {
            if (this.w_ || !Ua(a) || isNaN(a) || a < Tb || 3 < a)a = this.defaultAnchor;
            this.k = this.k || {Zg: q};
            this.k.pa = this.k.pa || this.defaultOffset;
            var b = this.k.anchor;
            this.k.anchor = a;
            if (this.A) {
                var c = this.A, d = this.k.pa.width, e = this.k.pa.height;
                c.style.left = c.style.top = c.style.right = c.style.bottom = "auto";
                switch (a) {
                    case Tb:
                        c.style.top = e + "px";
                        c.style.left = d + "px";
                        break;
                    case Ub:
                        c.style.top = e + "px";
                        c.style.right = d + "px";
                        break;
                    case Vb:
                        c.style.bottom = e + "px";
                        c.style.left = d + "px";
                        break;
                    case 3:
                        c.style.bottom = e + "px", c.style.right = d + "px"
                }
                c = ["TL", "TR", "BL", "BR"];
                w.B.Vb(this.A, "anchor" + c[b]);
                w.B.Ta(this.A, "anchor" + c[a])
            }
        }, JC: function () {
            return this.k.anchor
        }, Ge: function (a) {
            a instanceof L && (this.k = this.k || {Zg: q}, this.k.pa = new L(a.width, a.height), this.A && this.lc(this.k.anchor))
        }, Af: function () {
            return this.k.pa
        }, od: u("A"), show: function () {
            this.Da != o && (this.Da = o, this.A && w.B.show(this.A))
        }, J: function () {
            this.Da != q && (this.Da = q, this.A && w.B.J(this.A))
        }, isPrintable: function () {
            return !!this.k.Zg
        }, Pg: function () {
            return !this.A && !this.C ? q : !!this.Da
        }
    });
    var Tb = 0, Ub = 1, Vb = 2;

    function hb(a) {
        Sb.call(this);
        a = a || {};
        this.k = {
            Zg: q,
            GE: a.showZoomInfo || o,
            anchor: a.anchor,
            pa: a.offset,
            type: a.type,
            NU: a.enableGeolocation || q
        };
        this.defaultAnchor = G() ? 3 : Tb;
        this.defaultOffset = new L(10, 10);
        this.lc(a.anchor);
        this.Fm(a.type);
        this.cf()
    }

    w.lang.ia(hb, Sb, "NavigationControl");
    w.extend(hb.prototype, {
        initialize: function (a) {
            this.C = a;
            return this.A
        }, Fm: function (a) {
            this.k.type = Ua(a) && 0 <= a && 3 >= a ? a : 0
        }, Ao: function () {
            return this.k.type
        }, cf: function () {
            var a = this;
            J.load("navictrl", function () {
                a.qg()
            })
        }
    });
    function Wb(a) {
        Sb.call(this);
        a = a || {};
        this.k = {
            anchor: a.anchor || Vb,
            pa: a.offset || new L(10, 30),
            a2: a.showAddressBar || q,
            a0: a.enableAutoLocation || q,
            sL: a.locationIcon || p
        };
        var b = this;
        this.Gy = 1200;
        b.nZ = [];
        this.Zd = [];
        J.load("geoctrl", function () {
            (function d() {
                if (0 !== b.Zd.length) {
                    var a = b.Zd.shift();
                    b[a.method].apply(b, a.arguments);
                    d()
                }
            })();
            b.FO()
        });
        Pa(Ka)
    }

    w.lang.ia(Wb, Sb, "GeolocationControl");
    w.extend(Wb.prototype, {
        location: function () {
            this.Zd.push({method: "location", arguments: arguments})
        }, getAddressComponent: da(p)
    });
    function Xb(a) {
        Sb.call(this);
        a = a || {};
        this.k = {Zg: q, anchor: a.anchor, pa: a.offset};
        this.Qb = [];
        this.defaultAnchor = Vb;
        this.defaultOffset = new L(5, 2);
        this.lc(a.anchor);
        this.TI = q;
        this.cf()
    }

    w.lang.ia(Xb, Sb, "CopyrightControl");
    w.object.extend(Xb.prototype, {
        initialize: function (a) {
            this.C = a;
            return this.A
        }, Dv: function (a) {
            if (a && Ua(a.id) && !isNaN(a.id)) {
                var b = {bounds: p, content: ""}, c;
                for (c in a)b[c] = a[c];
                if (a = this.Ql(a.id))for (var d in b)a[d] = b[d]; else this.Qb.push(b)
            }
        }, Ql: function (a) {
            for (var b = 0, c = this.Qb.length; b < c; b++)if (this.Qb[b].id == a)return this.Qb[b]
        }, QC: u("Qb"), jE: function (a) {
            for (var b = 0, c = this.Qb.length; b < c; b++)this.Qb[b].id == a && (r = this.Qb.splice(b, 1), b--, c = this.Qb.length)
        }, cf: function () {
            var a = this;
            J.load("copyrightctrl", function () {
                a.qg()
            })
        }
    });
    function kb(a) {
        Sb.call(this);
        a = a || {};
        this.k = {
            Zg: q,
            size: a.size || new L(150, 150),
            padding: 5,
            Ja: a.isOpen === o ? o : q,
            DZ: 4,
            pa: a.offset,
            anchor: a.anchor
        };
        this.defaultAnchor = 3;
        this.defaultOffset = new L(0, 0);
        this.Qp = this.Rp = 13;
        this.lc(a.anchor);
        this.td(this.k.size);
        this.cf()
    }

    w.lang.ia(kb, Sb, "OverviewMapControl");
    w.extend(kb.prototype, {
        initialize: function (a) {
            this.C = a;
            return this.A
        }, lc: function (a) {
            Sb.prototype.lc.call(this, a)
        }, ae: function () {
            this.ae.En = o;
            this.k.Ja = !this.k.Ja;
            this.A || (this.ae.En = q)
        }, td: function (a) {
            a instanceof L || (a = new L(150, 150));
            a.width = 0 < a.width ? a.width : 150;
            a.height = 0 < a.height ? a.height : 150;
            this.k.size = a
        }, Lb: function () {
            return this.k.size
        }, Ja: function () {
            return this.k.Ja
        }, cf: function () {
            var a = this;
            J.load("control", function () {
                a.qg()
            })
        }
    });
    function jb(a) {
        Sb.call(this);
        a = a || {};
        this.k = {Zg: q, color: "black", Qc: "metric", pa: a.offset};
        this.defaultAnchor = Vb;
        this.defaultOffset = new L(81, 18);
        this.lc(a.anchor);
        this.Fh = {
            metric: {name: "metric", hJ: 1, OK: 1E3, pN: "\u7c73", qN: "\u516c\u91cc"},
            us: {name: "us", hJ: 3.2808, OK: 5280, pN: "\u82f1\u5c3a", qN: "\u82f1\u91cc"}
        };
        this.Fh[this.k.Qc] || (this.k.Qc = "metric");
        this.NH = p;
        this.nH = {};
        this.cf()
    }

    w.lang.ia(jb, Sb, "ScaleControl");
    w.object.extend(jb.prototype, {
        initialize: function (a) {
            this.C = a;
            return this.A
        }, nk: function (a) {
            this.k.color = a + ""
        }, m0: function () {
            return this.k.color
        }, DE: function (a) {
            this.k.Qc = this.Fh[a] && this.Fh[a].name || this.k.Qc
        }, cW: function () {
            return this.k.Qc
        }, cf: function () {
            var a = this;
            J.load("control", function () {
                a.qg()
            })
        }
    });
    var Yb = 0;

    function lb(a) {
        Sb.call(this);
        a = a || {};
        this.defaultAnchor = Ub;
        this.defaultOffset = new L(10, 10);
        this.k = {
            Zg: q,
            Sg: [Ma, Wa, Qa, Oa],
            rU: ["B_DIMENSIONAL_MAP", "B_SATELLITE_MAP", "B_NORMAL_MAP"],
            type: a.type || Yb,
            pa: a.offset || this.defaultOffset,
            RU: o
        };
        this.lc(a.anchor);
        "[object Array]" == Object.prototype.toString.call(a.mapTypes) && (this.k.Sg = a.mapTypes.slice(0));
        this.cf()
    }

    w.lang.ia(lb, Sb, "MapTypeControl");
    w.object.extend(lb.prototype, {
        initialize: function (a) {
            this.C = a;
            return this.A
        }, Sx: function (a) {
            this.C.vn = a
        }, cf: function () {
            var a = this;
            J.load("control", function () {
                a.qg()
            }, o)
        }
    });
    function Zb(a) {
        Sb.call(this);
        a = a || {};
        this.k = {Zg: q, pa: a.offset, anchor: a.anchor};
        this.wi = q;
        this.lv = p;
        this.wH = new $b({yf: "api"});
        this.xH = new ac(p, {yf: "api"});
        this.defaultAnchor = Ub;
        this.defaultOffset = new L(10, 10);
        this.lc(a.anchor);
        this.cf();
        Pa(wa)
    }

    w.lang.ia(Zb, Sb, "PanoramaControl");
    w.extend(Zb.prototype, {
        initialize: function (a) {
            this.C = a;
            return this.A
        }, cf: function () {
            var a = this;
            J.load("control", function () {
                a.qg()
            })
        }
    });
    function bc(a) {
        w.lang.ra.call(this);
        this.k = {Ia: p, cursor: "default"};
        this.k = w.extend(this.k, a);
        this.xb = "contextmenu";
        this.C = p;
        this.na = [];
        this.of = [];
        this.me = [];
        this.bw = this.Dr = p;
        this.uh = q;
        var b = this;
        J.load("menu", function () {
            b.qb()
        })
    }

    w.lang.ia(bc, w.lang.ra, "ContextMenu");
    w.object.extend(bc.prototype, {
        fa: function (a, b) {
            this.C = a;
            this.Yk = b || p
        }, remove: function () {
            this.C = this.Yk = p
        }, Fv: function (a) {
            if (a && !("menuitem" != a.xb || "" == a.Ag || 0 >= a.Hi)) {
                for (var b = 0, c = this.na.length; b < c; b++)if (this.na[b] === a)return;
                this.na.push(a);
                this.of.push(a)
            }
        }, removeItem: function (a) {
            if (a && "menuitem" == a.xb) {
                for (var b = 0, c = this.na.length; b < c; b++)this.na[b] === a && (this.na[b].remove(), this.na.splice(b, 1), c--);
                b = 0;
                for (c = this.of.length; b < c; b++)this.of[b] === a && (this.of[b].remove(), this.of.splice(b, 1), c--)
            }
        }, $A: function () {
            this.na.push({xb: "divider", uj: this.me.length});
            this.me.push({B: p})
        }, lE: function (a) {
            if (this.me[a]) {
                for (var b = 0, c = this.na.length; b < c; b++)this.na[b] && ("divider" == this.na[b].xb && this.na[b].uj == a) && (this.na.splice(b, 1), c--), this.na[b] && ("divider" == this.na[b].xb && this.na[b].uj > a) && this.na[b].uj--;
                this.me.splice(a, 1)
            }
        }, od: u("A"), show: function () {
            this.uh != o && (this.uh = o)
        }, J: function () {
            this.uh != q && (this.uh = q)
        }, eY: function (a) {
            a && (this.k.cursor = a)
        }, getItem: function (a) {
            return this.of[a]
        }
    });
    var cc = F.ea + "menu_zoom_in.png", dc = F.ea + "menu_zoom_out.png";

    function ec(a, b, c) {
        if (a && Va(b)) {
            w.lang.ra.call(this);
            this.k = {width: 100, id: "", bm: ""};
            c = c || {};
            this.k.width = 1 * c.width ? c.width : 100;
            this.k.id = c.id ? c.id : "";
            this.k.bm = c.iconUrl ? c.iconUrl : "";
            this.Ag = a + "";
            this.Jy = b;
            this.C = p;
            this.xb = "menuitem";
            this.jr = this.Du = this.A = this.kh = p;
            this.oh = o;
            var d = this;
            J.load("menu", function () {
                d.qb()
            })
        }
    }

    w.lang.ia(ec, w.lang.ra, "MenuItem");
    w.object.extend(ec.prototype, {
        fa: function (a, b) {
            this.C = a;
            this.kh = b
        }, remove: function () {
            this.C = this.kh = p
        }, ct: function (a) {
            a && (this.Ag = a + "")
        }, Ob: function (a) {
            a && (this.k.bm = a)
        }, od: u("A"), enable: function () {
            this.oh = o
        }, disable: function () {
            this.oh = q
        }
    });
    function db(a, b) {
        a && !b && (b = a);
        this.qe = this.pe = this.ve = this.ue = this.ml = this.Wk = p;
        a && (this.ml = new H(a.lng, a.lat), this.Wk = new H(b.lng, b.lat), this.ve = a.lng, this.ue = a.lat, this.qe = b.lng, this.pe = b.lat)
    }

    w.object.extend(db.prototype, {
        fj: function () {
            return !this.ml || !this.Wk
        }, $a: function (a) {
            return !(a instanceof db) || this.fj() ? q : this.Ce().$a(a.Ce()) && this.zf().$a(a.zf())
        }, Ce: u("ml"), zf: u("Wk"), dU: function (a) {
            return !(a instanceof db) || this.fj() || a.fj() ? q : a.ve > this.ve && a.qe < this.qe && a.ue > this.ue && a.pe < this.pe
        }, Aa: function () {
            return this.fj() ? p : new H((this.ve + this.qe) / 2, (this.ue + this.pe) / 2)
        }, ws: function (a) {
            if (!(a instanceof db) || Math.max(a.ve, a.qe) < Math.min(this.ve, this.qe) || Math.min(a.ve, a.qe) > Math.max(this.ve, this.qe) || Math.max(a.ue, a.pe) < Math.min(this.ue, this.pe) || Math.min(a.ue, a.pe) > Math.max(this.ue, this.pe))return p;
            var b = Math.max(this.ve, a.ve), c = Math.min(this.qe, a.qe), d = Math.max(this.ue, a.ue), a = Math.min(this.pe, a.pe);
            return new db(new H(b, d), new H(c, a))
        }, yr: function (a) {
            return !(a instanceof H) || this.fj() ? q : a.lng >= this.ve && a.lng <= this.qe && a.lat >= this.ue && a.lat <= this.pe
        }, extend: function (a) {
            if (a instanceof H) {
                var b = a.lng, a = a.lat;
                this.ml || (this.ml = new H(0, 0));
                this.Wk || (this.Wk = new H(0, 0));
                if (!this.ve || this.ve > b)this.ml.lng = this.ve = b;
                if (!this.qe || this.qe < b)this.Wk.lng = this.qe = b;
                if (!this.ue || this.ue > a)this.ml.lat = this.ue = a;
                if (!this.pe || this.pe < a)this.Wk.lat = this.pe = a
            }
        }, OE: function () {
            return this.fj() ? new H(0, 0) : new H(Math.abs(this.qe - this.ve), Math.abs(this.pe - this.ue))
        }
    });
    function H(a, b) {
        isNaN(a) && (a = Jb(a), a = isNaN(a) ? 0 : a);
        Xa(a) && (a = parseFloat(a));
        isNaN(b) && (b = Jb(b), b = isNaN(b) ? 0 : b);
        Xa(b) && (b = parseFloat(b));
        this.lng = a;
        this.lat = b
    }

    H.UK = function (a) {
        return a && 180 >= a.lng && -180 <= a.lng && 74 >= a.lat && -74 <= a.lat
    };
    H.prototype.$a = function (a) {
        return a && this.lat == a.lat && this.lng == a.lng
    };
    function fc() {
    }

    fc.prototype.Qg = function () {
        aa("lngLatToPoint\u65b9\u6cd5\u672a\u5b9e\u73b0")
    };
    fc.prototype.ai = function () {
        aa("pointToLngLat\u65b9\u6cd5\u672a\u5b9e\u73b0")
    };
    function gc() {
    };
    var cb = {
        jJ: function (a, b, c) {
            J.load("coordtransutils", function () {
                cb.zT(a, b, c)
            }, o)
        }, iJ: function (a, b, c) {
            J.load("coordtransutils", function () {
                cb.yT(a, b, c)
            }, o)
        }
    };

    function Q() {
    }

    Q.prototype = new fc;
    w.extend(Q, {
        WN: 6370996.81,
        vF: [1.289059486E7, 8362377.87, 5591021, 3481989.83, 1678043.12, 0],
        Rt: [75, 60, 45, 30, 15, 0],
        bO: [[1.410526172116255E-8, 8.98305509648872E-6, -1.9939833816331, 200.9824383106796, -187.2403703815547, 91.6087516669843, -23.38765649603339, 2.57121317296198, -0.03801003308653, 1.73379812E7], [-7.435856389565537E-9, 8.983055097726239E-6, -0.78625201886289, 96.32687599759846, -1.85204757529826, -59.36935905485877, 47.40033549296737, -16.50741931063887, 2.28786674699375, 1.026014486E7], [-3.030883460898826E-8, 8.98305509983578E-6, 0.30071316287616, 59.74293618442277, 7.357984074871, -25.38371002664745, 13.45380521110908, -3.29883767235584, 0.32710905363475, 6856817.37], [-1.981981304930552E-8, 8.983055099779535E-6, 0.03278182852591, 40.31678527705744, 0.65659298677277, -4.44255534477492, 0.85341911805263, 0.12923347998204, -0.04625736007561, 4482777.06], [3.09191371068437E-9, 8.983055096812155E-6, 6.995724062E-5, 23.10934304144901, -2.3663490511E-4, -0.6321817810242, -0.00663494467273, 0.03430082397953, -0.00466043876332, 2555164.4], [2.890871144776878E-9, 8.983055095805407E-6, -3.068298E-8, 7.47137025468032, -3.53937994E-6, -0.02145144861037, -1.234426596E-5, 1.0322952773E-4, -3.23890364E-6, 826088.5]],
        sF: [[-0.0015702102444, 111320.7020616939, 1704480524535203, -10338987376042340, 26112667856603880, -35149669176653700, 26595700718403920, -10725012454188240, 1800819912950474, 82.5], [8.277824516172526E-4, 111320.7020463578, 6.477955746671607E8, -4.082003173641316E9, 1.077490566351142E10, -1.517187553151559E10, 1.205306533862167E10, -5.124939663577472E9, 9.133119359512032E8, 67.5], [0.00337398766765, 111320.7020202162, 4481351.045890365, -2.339375119931662E7, 7.968221547186455E7, -1.159649932797253E8, 9.723671115602145E7, -4.366194633752821E7, 8477230.501135234, 52.5], [0.00220636496208, 111320.7020209128, 51751.86112841131, 3796837.749470245, 992013.7397791013, -1221952.21711287, 1340652.697009075, -620943.6990984312, 144416.9293806241, 37.5], [-3.441963504368392E-4, 111320.7020576856, 278.2353980772752, 2485758.690035394, 6070.750963243378, 54821.18345352118, 9540.606633304236, -2710.55326746645, 1405.483844121726, 22.5], [-3.218135878613132E-4, 111320.7020701615, 0.00369383431289, 823725.6402795718, 0.46104986909093, 2351.343141331292, 1.58060784298199, 8.77738589078284, 0.37238884252424, 7.45]],
        r0: function (a, b) {
            if (!a || !b)return 0;
            var c, d, a = this.rb(a);
            if (!a)return 0;
            c = this.vk(a.lng);
            d = this.vk(a.lat);
            b = this.rb(b);
            return !b ? 0 : this.Be(c, this.vk(b.lng), d, this.vk(b.lat))
        },
        po: function (a, b) {
            if (!a || !b)return 0;
            a.lng = this.YC(a.lng, -180, 180);
            a.lat = this.cD(a.lat, -74, 74);
            b.lng = this.YC(b.lng, -180, 180);
            b.lat = this.cD(b.lat, -74, 74);
            return this.Be(this.vk(a.lng), this.vk(b.lng), this.vk(a.lat), this.vk(b.lat))
        },
        rb: function (a) {
            if (a === p || a === j)return new H(0, 0);
            var b, c;
            b = new H(Math.abs(a.lng), Math.abs(a.lat));
            for (var d = 0; d < this.vF.length; d++)if (b.lat >= this.vF[d]) {
                c = this.bO[d];
                break
            }
            a = this.kJ(a, c);
            return a = new H(a.lng.toFixed(6), a.lat.toFixed(6))
        },
        Fb: function (a) {
            if (a === p || a === j || 180 < a.lng || -180 > a.lng || 90 < a.lat || -90 > a.lat)return new H(0, 0);
            var b, c;
            a.lng = this.YC(a.lng, -180, 180);
            a.lat = this.cD(a.lat, -74, 74);
            b = new H(a.lng, a.lat);
            for (var d = 0; d < this.Rt.length; d++)if (b.lat >= this.Rt[d]) {
                c = this.sF[d];
                break
            }
            if (!c)for (d = this.Rt.length - 1; 0 <= d; d--)if (b.lat <= -this.Rt[d]) {
                c = this.sF[d];
                break
            }
            a = this.kJ(a, c);
            return a = new H(a.lng.toFixed(2), a.lat.toFixed(2))
        },
        kJ: function (a, b) {
            if (a && b) {
                var c = b[0] + b[1] * Math.abs(a.lng), d = Math.abs(a.lat) / b[9], d = b[2] + b[3] * d + b[4] * d * d + b[5] * d * d * d + b[6] * d * d * d * d + b[7] * d * d * d * d * d + b[8] * d * d * d * d * d * d, c = c * (0 > a.lng ? -1 : 1), d = d * (0 > a.lat ? -1 : 1);
                return new H(c, d)
            }
        },
        Be: function (a, b, c, d) {
            return this.WN * Math.acos(Math.sin(c) * Math.sin(d) + Math.cos(c) * Math.cos(d) * Math.cos(b - a))
        },
        vk: function (a) {
            return Math.PI * a / 180
        },
        i2: function (a) {
            return 180 * a / Math.PI
        },
        cD: function (a, b, c) {
            b != p && (a = Math.max(a, b));
            c != p && (a = Math.min(a, c));
            return a
        },
        YC: function (a, b, c) {
            for (; a > c;)a -= c - b;
            for (; a < b;)a += c - b;
            return a
        }
    });
    w.extend(Q.prototype, {
        jm: function (a) {
            return Q.Fb(a)
        }, Qg: function (a) {
            a = Q.Fb(a);
            return new P(a.lng, a.lat)
        }, Tg: function (a) {
            return Q.rb(a)
        }, ai: function (a) {
            a = new H(a.x, a.y);
            return Q.rb(a)
        }, Ub: function (a, b, c, d, e) {
            if (a)return a = this.jm(a, e), b = this.Ac(b), new P(Math.round((a.lng - c.lng) / b + d.width / 2), Math.round((c.lat - a.lat) / b + d.height / 2))
        }, mb: function (a, b, c, d, e) {
            if (a)return b = this.Ac(b), this.Tg(new H(c.lng + b * (a.x - d.width / 2), c.lat - b * (a.y - d.height / 2)), e)
        }, Ac: function (a) {
            return Math.pow(2, 18 - a)
        }
    });
    function fb() {
        this.FB = "bj"
    }

    fb.prototype = new Q;
    w.extend(fb.prototype, {
        jm: function (a, b) {
            return this.kP(b, Q.Fb(a))
        }, Tg: function (a, b) {
            return Q.rb(this.lP(b, a))
        }, lngLatToPointFor3D: function (a, b) {
            var c = this, d = Q.Fb(a);
            J.load("coordtrans", function () {
                var a = gc.$C(c.FB || "bj", d), a = new P(a.x, a.y);
                b && b(a)
            }, o)
        }, pointToLngLatFor3D: function (a, b) {
            var c = this, d = new H(a.x, a.y);
            J.load("coordtrans", function () {
                var a = gc.ZC(c.FB || "bj", d), a = new H(a.lng, a.lat), a = Q.rb(a);
                b && b(a)
            }, o)
        }, kP: function (a, b) {
            if (J.Va("coordtrans").kd == J.oj.up) {
                var c = gc.$C(a || "bj", b);
                return new H(c.x, c.y)
            }
            J.load("coordtrans", s());
            return new H(0, 0)
        }, lP: function (a, b) {
            if (J.Va("coordtrans").kd == J.oj.up) {
                var c = gc.ZC(a || "bj", b);
                return new H(c.lng, c.lat)
            }
            J.load("coordtrans", s());
            return new H(0, 0)
        }, Ac: function (a) {
            return Math.pow(2, 20 - a)
        }
    });
    function hc() {
        this.xb = "overlay"
    }

    w.lang.ia(hc, w.lang.ra, "Overlay");
    hc.Yl = function (a) {
        a *= 1;
        return !a ? 0 : -1E5 * a << 1
    };
    w.extend(hc.prototype, {
        Me: function (a) {
            if (!this.K && Va(this.initialize) && (this.K = this.initialize(a)))this.K.style.WebkitUserSelect = "none";
            this.draw()
        }, initialize: function () {
            aa("initialize\u65b9\u6cd5\u672a\u5b9e\u73b0")
        }, draw: function () {
            aa("draw\u65b9\u6cd5\u672a\u5b9e\u73b0")
        }, remove: function () {
            this.K && this.K.parentNode && this.K.parentNode.removeChild(this.K);
            this.K = p;
            this.dispatchEvent(new M("onremove"))
        }, J: function () {
            this.K && w.B.J(this.K)
        }, show: function () {
            this.K && w.B.show(this.K)
        }, Pg: function () {
            return !this.K || "none" == this.K.style.display || "hidden" == this.K.style.visibility ? q : o
        }
    });
    z.Fe(function (a) {
        function b(a, b) {
            var c = K("div"), g = c.style;
            g.position = "absolute";
            g.top = g.left = g.width = g.height = "0";
            g.zIndex = b;
            a.appendChild(c);
            return c
        }

        var c = a.H;
        c.$c = a.$c = b(a.platform, 200);
        a.Yd.DC = b(c.$c, 800);
        a.Yd.ND = b(c.$c, 700);
        a.Yd.UJ = b(c.$c, 600);
        a.Yd.GD = b(c.$c, 500);
        a.Yd.xL = b(c.$c, 400);
        a.Yd.yL = b(c.$c, 300);
        a.Yd.uZ = b(c.$c, 201);
        a.Yd.Fs = b(c.$c, 200)
    });
    function eb() {
        w.lang.ra.call(this);
        hc.call(this);
        this.map = p;
        this.Da = o;
        this.kb = p;
        this.fG = 0
    }

    w.lang.ia(eb, hc, "OverlayInternal");
    w.extend(eb.prototype, {
        initialize: function (a) {
            this.map = a;
            w.lang.ra.call(this, this.Q);
            return p
        }, Aw: u("map"), draw: s(), remove: function () {
            this.map = p;
            w.lang.ew(this.Q);
            hc.prototype.remove.call(this)
        }, J: function () {
            this.Da != q && (this.Da = q)
        }, show: function () {
            this.Da != o && (this.Da = o)
        }, Pg: function () {
            return !this.K ? q : !!this.Da
        }, Ea: u("K"), CM: function (a) {
            var a = a || {}, b;
            for (b in a)this.z[b] = a[b]
        }, dt: ba("zIndex"), Ti: function () {
            this.z.Ti = o
        }, AU: function () {
            this.z.Ti = q
        }, Pn: ba("Rf"), So: function () {
            this.Rf = p
        }
    });
    function ic() {
        this.map = p;
        this.ja = {};
        this.le = []
    }

    z.Fe(function (a) {
        var b = new ic;
        b.map = a;
        a.ja = b.ja;
        a.le = b.le;
        a.addEventListener("load", function (a) {
            b.draw(a)
        });
        a.addEventListener("moveend", function (a) {
            b.draw(a)
        });
        w.S.ba && 8 > w.S.ba || "BackCompat" == document.compatMode ? a.addEventListener("zoomend", function (a) {
            setTimeout(function () {
                b.draw(a)
            }, 20)
        }) : a.addEventListener("zoomend", function (a) {
            b.draw(a)
        });
        a.addEventListener("maptypechange", function (a) {
            b.draw(a)
        });
        a.addEventListener("addoverlay", function (a) {
            a = a.target;
            if (a instanceof eb)b.ja[a.Q] || (b.ja[a.Q] = a); else {
                for (var d = q, e = 0, f = b.le.length; e < f; e++)if (b.le[e] === a) {
                    d = o;
                    break
                }
                d || b.le.push(a)
            }
        });
        a.addEventListener("removeoverlay", function (a) {
            a = a.target;
            if (a instanceof eb)delete b.ja[a.Q]; else for (var d = 0, e = b.le.length; d < e; d++)if (b.le[d] === a) {
                b.le.splice(d, 1);
                break
            }
        });
        a.addEventListener("clearoverlays", function () {
            this.Jc();
            for (var a in b.ja)b.ja[a].z.Ti && (b.ja[a].remove(), delete b.ja[a]);
            a = 0;
            for (var d = b.le.length; a < d; a++)b.le[a].Ti != q && (b.le[a].remove(), b.le[a] = p, b.le.splice(a, 1), a--, d--)
        });
        a.addEventListener("infowindowopen", function () {
            var a = this.kb;
            a && (w.B.J(a.jc), w.B.J(a.Pb))
        });
        a.addEventListener("movestart", function () {
            this.Mg() && this.Mg().TH()
        });
        a.addEventListener("moveend", function () {
            this.Mg() && this.Mg().JH()
        })
    });
    ic.prototype.draw = function (a) {
        if (z.yp) {
            var b = z.yp.bs(this.map);
            "canvas" == b.xb && b.canvas && b.fP(b.canvas.getContext("2d"))
        }
        for (var c in this.ja)this.ja[c].draw(a);
        w.Xb.yb(this.le, function (a) {
            a.draw()
        });
        this.map.H.ab && this.map.H.ab.ha();
        z.yp && b.AE()
    };
    function jc(a) {
        eb.call(this);
        a = a || {};
        this.z = {
            strokeColor: a.strokeColor || "#3a6bdb",
            Zb: a.strokeWeight || 5,
            bd: a.strokeOpacity || 0.65,
            strokeStyle: a.strokeStyle || "solid",
            Ti: a.enableMassClear === q ? q : o,
            $j: p,
            Tl: p,
            xf: a.enableEditing === o ? o : q,
            GL: 5,
            mZ: q,
            Re: a.enableClicking === q ? q : o,
            Sh: a.icons && 0 < a.icons.length ? a.icons : p
        };
        0 >= this.z.Zb && (this.z.Zb = 5);
        if (0 > this.z.bd || 1 < this.z.bd)this.z.bd = 0.65;
        if (0 > this.z.$f || 1 < this.z.$f)this.z.$f = 0.65;
        "solid" != this.z.strokeStyle && "dashed" != this.z.strokeStyle && (this.z.strokeStyle = "solid");
        this.K = p;
        this.du = new db(0, 0);
        this.Oe = [];
        this.$b = [];
        this.Fa = {}
    }

    w.lang.ia(jc, eb, "Graph");
    jc.ww = function (a) {
        var b = [];
        if (!a)return b;
        Xa(a) && w.Xb.yb(a.split(";"), function (a) {
            a = a.split(",");
            b.push(new H(a[0], a[1]))
        });
        "[object Array]" == Object.prototype.toString.apply(a) && 0 < a.length && (b = a);
        return b
    };
    jc.YD = [0.09, 0.0050, 1.0E-4, 1.0E-5];
    w.extend(jc.prototype, {
        initialize: function (a) {
            this.map = a;
            return p
        }, draw: s(), cr: function (a) {
            this.Oe.length = 0;
            this.W = jc.ww(a).slice(0);
            this.hh()
        }, Ud: function (a) {
            this.cr(a)
        }, hh: function () {
            if (this.W) {
                var a = this;
                a.du = new db;
                w.Xb.yb(this.W, function (b) {
                    a.du.extend(b)
                })
            }
        }, de: u("W"), Em: function (a, b) {
            b && this.W[a] && (this.Oe.length = 0, this.W[a] = new H(b.lng, b.lat), this.hh())
        }, setStrokeColor: function (a) {
            this.z.strokeColor = a
        }, TV: function () {
            return this.z.strokeColor
        }, ip: function (a) {
            0 < a && (this.z.Zb = a)
        }, tK: function () {
            return this.z.Zb
        }, gp: function (a) {
            a == j || (1 < a || 0 > a) || (this.z.bd = a)
        }, UV: function () {
            return this.z.bd
        }, Xs: function (a) {
            1 < a || 0 > a || (this.z.$f = a)
        }, rV: function () {
            return this.z.$f
        }, hp: function (a) {
            "solid" != a && "dashed" != a || (this.z.strokeStyle = a)
        }, sK: function () {
            return this.z.strokeStyle
        }, setFillColor: function (a) {
            this.z.fillColor = a || ""
        }, qV: function () {
            return this.z.fillColor
        }, Md: u("du"), remove: function () {
            this.map && this.map.removeEventListener("onmousemove", this.Au);
            eb.prototype.remove.call(this);
            this.Oe.length = 0
        }, xf: function () {
            if (!(2 > this.W.length)) {
                this.z.xf = o;
                var a = this;
                J.load("poly", function () {
                    a.sl()
                }, o)
            }
        }, zU: function () {
            this.z.xf = q;
            var a = this;
            J.load("poly", function () {
                a.Qj()
            }, o)
        }
    });
    function kc(a) {
        eb.call(this);
        this.K = this.map = p;
        this.z = {
            width: 0,
            height: 0,
            pa: new L(0, 0),
            opacity: 1,
            background: "transparent",
            Zw: 1,
            jL: "#000",
            QW: "solid",
            point: p
        };
        this.CM(a);
        this.point = this.z.point
    }

    w.lang.ia(kc, eb, "Division");
    w.extend(kc.prototype, {
        Ck: function () {
            var a = this.z, b = this.content, c = ['<div class="BMap_Division" style="position:absolute;'];
            c.push("width:" + a.width + "px;display:block;");
            c.push("overflow:hidden;");
            "none" != a.borderColor && c.push("border:" + a.Zw + "px " + a.QW + " " + a.jL + ";");
            c.push("opacity:" + a.opacity + "; filter:(opacity=" + 100 * a.opacity + ")");
            c.push("background:" + a.background + ";");
            c.push('z-index:60;">');
            c.push(b);
            c.push("</div>");
            this.K = Ab(this.map.Bf().ND, c.join(""))
        }, initialize: function (a) {
            this.map = a;
            this.Ck();
            this.K && w.F(this.K, G() ? "touchstart" : "mousedown", function (a) {
                oa(a)
            });
            return this.K
        }, draw: function () {
            var a = this.map.Ee(this.z.point);
            this.z.pa = new L(-Math.round(this.z.width / 2) - Math.round(this.z.Zw), -Math.round(this.z.height / 2) - Math.round(this.z.Zw));
            this.K.style.left = a.x + this.z.pa.width + "px";
            this.K.style.top = a.y + this.z.pa.height + "px"
        }, V: function () {
            return this.z.point
        }, c_: function () {
            return this.map.Ub(this.V())
        }, ha: function (a) {
            this.z.point = a;
            this.draw()
        }, fY: function (a, b) {
            this.z.width = Math.round(a);
            this.z.height = Math.round(b);
            this.K && (this.K.style.width = this.z.width + "px", this.K.style.height = this.z.height + "px", this.draw())
        }
    });
    function lc(a, b, c) {
        a && b && (this.imageUrl = a, this.size = b, a = new L(Math.floor(b.width / 2), Math.floor(b.height / 2)), c = c || {}, a = c.anchor || a, b = c.imageOffset || new L(0, 0), this.imageSize = c.imageSize, this.anchor = a, this.imageOffset = b, this.infoWindowAnchor = c.infoWindowAnchor || this.anchor, this.printImageUrl = c.printImageUrl || "")
    }

    w.extend(lc.prototype, {
        lY: function (a) {
            a && (this.imageUrl = a)
        }, wY: function (a) {
            a && (this.printImageUrl = a)
        }, td: function (a) {
            a && (this.size = new L(a.width, a.height))
        }, lc: function (a) {
            a && (this.anchor = new L(a.width, a.height))
        }, Ys: function (a) {
            a && (this.imageOffset = new L(a.width, a.height))
        }, nY: function (a) {
            a && (this.infoWindowAnchor = new L(a.width, a.height))
        }, jY: function (a) {
            a && (this.imageSize = new L(a.width, a.height))
        }, toString: da("Icon")
    });
    function mc(a, b) {
        if (a) {
            b = b || {};
            this.style = {
                anchor: b.anchor || new L(0, 0),
                fillColor: b.fillColor || "#000",
                $f: b.fillOpacity || 0,
                scale: b.scale || 1,
                rotation: b.rotation || 0,
                strokeColor: b.strokeColor || "#000",
                bd: b.strokeOpacity || 1,
                Zb: b.strokeWeight
            };
            this.xb = "number" === typeof a ? a : "UserDefined";
            this.ni = this.style.anchor;
            this.Gq = new L(0, 0);
            this.anchor = p;
            this.tA = a;
            var c = this;
            J.load("symbol", function () {
                c.$m()
            }, o)
        }
    }

    w.extend(mc.prototype, {
        setPath: ba("tA"), setAnchor: function (a) {
            this.ni = this.style.anchor = a
        }, setRotation: function (a) {
            this.style.rotation = a
        }, setScale: function (a) {
            this.style.scale = a
        }, setStrokeWeight: function (a) {
            this.style.Zb = a
        }, setStrokeColor: function (a) {
            a = w.xr.AB(a, this.style.bd);
            this.style.strokeColor = a
        }, setStrokeOpacity: function (a) {
            this.style.bd = a
        }, setFillOpacity: function (a) {
            this.style.$f = a
        }, setFillColor: function (a) {
            this.style.fillColor = a
        }
    });
    function nc(a, b, c, d) {
        a && (this.Tu = {}, this.TJ = d ? !!d : q, this.Hc = [], this.MY = a instanceof mc ? a : p, this.CH = b === j ? o : !!(b.indexOf("%") + 1), this.Fj = isNaN(parseFloat(b)) ? 1 : this.CH ? parseFloat(b) / 100 : parseFloat(b), this.DH = !!(c.indexOf("%") + 1), this.repeat = c != j ? this.DH ? parseFloat(c) / 100 : parseFloat(c) : 0)
    };
    function oc(a, b) {
        w.lang.ra.call(this);
        this.content = a;
        this.map = p;
        b = b || {};
        this.z = {
            width: b.width || 0,
            height: b.height || 0,
            maxWidth: b.maxWidth || 730,
            pa: b.offset || new L(0, 0),
            title: b.title || "",
            OD: b.maxContent || "",
            Hg: b.enableMaximize || q,
            Ur: b.enableAutoPan === q ? q : o,
            pC: b.enableCloseOnClick === q ? q : o,
            margin: b.margin || [10, 10, 40, 10],
            vB: b.collisions || [[10, 10], [10, 10], [10, 10], [10, 10]],
            pW: q,
            kX: b.onClosing || da(o),
            KJ: q,
            uC: b.enableParano === o ? o : q,
            message: b.message,
            wC: b.enableSearchTool === o ? o : q,
            Lw: b.headerContent || "",
            qC: b.enableContentScroll || q
        };
        if (0 != this.z.width && (220 > this.z.width && (this.z.width = 220), 730 < this.z.width))this.z.width = 730;
        if (0 != this.z.height && (60 > this.z.height && (this.z.height = 60), 650 < this.z.height))this.z.height = 650;
        if (0 != this.z.maxWidth && (220 > this.z.maxWidth && (this.z.maxWidth = 220), 730 < this.z.maxWidth))this.z.maxWidth = 730;
        this.Od = q;
        this.ji = F.ea;
        this.Pa = p;
        var c = this;
        J.load("infowindow", function () {
            c.qb()
        })
    }

    w.lang.ia(oc, w.lang.ra, "InfoWindow");
    w.extend(oc.prototype, {
        setWidth: function (a) {
            !a && 0 != a || (isNaN(a) || 0 > a) || (0 != a && (220 > a && (a = 220), 730 < a && (a = 730)), this.z.width = a)
        }, setHeight: function (a) {
            !a && 0 != a || (isNaN(a) || 0 > a) || (0 != a && (60 > a && (a = 60), 650 < a && (a = 650)), this.z.height = a)
        }, FM: function (a) {
            !a && 0 != a || (isNaN(a) || 0 > a) || (0 != a && (220 > a && (a = 220), 730 < a && (a = 730)), this.z.maxWidth = a)
        }, qc: function (a) {
            this.z.title = a
        }, getTitle: function () {
            return this.z.title
        }, Pc: ba("content"), Yj: u("content"), $s: function (a) {
            this.z.OD = a + ""
        }, Td: s(), Ur: function () {
            this.z.Ur = o
        }, disableAutoPan: function () {
            this.z.Ur = q
        }, enableCloseOnClick: function () {
            this.z.pC = o
        }, disableCloseOnClick: function () {
            this.z.pC = q
        }, Hg: function () {
            this.z.Hg = o
        }, hw: function () {
            this.z.Hg = q
        }, show: function () {
            this.Da = o
        }, J: function () {
            this.Da = q
        }, close: function () {
            this.J()
        }, dx: function () {
            this.Od = o
        }, restore: function () {
            this.Od = q
        }, Pg: function () {
            return this.Ja()
        }, Ja: da(q), V: function () {
            if (this.Pa && this.Pa.V)return this.Pa.V()
        }, Af: function () {
            return this.z.pa
        }
    });
    La.prototype.zb = function (a, b) {
        if (a instanceof oc && b instanceof H) {
            var c = this.H;
            c.lm ? c.lm.ha(b) : (c.lm = new R(b, {
                icon: new lc(F.ea + "blank.gif", {width: 1, height: 1}),
                offset: new L(0, 0),
                clickable: q
            }), c.lm.hQ = 1);
            this.ya(c.lm);
            c.lm.zb(a)
        }
    };
    La.prototype.Jc = function () {
        var a = this.H.ab || this.H.Nk;
        a && a.Pa && a.Pa.Jc()
    };
    eb.prototype.zb = function (a) {
        this.map && (this.map.Jc(), a.Da = o, this.map.H.Nk = a, a.Pa = this, w.lang.ra.call(a, a.Q))
    };
    eb.prototype.Jc = function () {
        this.map && this.map.H.Nk && (this.map.H.Nk.Da = q, w.lang.ew(this.map.H.Nk.Q), this.map.H.Nk = p)
    };
    function pc(a, b) {
        eb.call(this);
        this.content = a;
        this.K = this.map = p;
        b = b || {};
        this.z = {
            width: 0,
            pa: b.offset || new L(0, 0),
            kp: {
                backgroundColor: "#fff",
                border: "1px solid #f00",
                padding: "1px",
                whiteSpace: "nowrap",
                font: "12px " + F.fontFamily,
                zIndex: "80",
                MozUserSelect: "none"
            },
            position: b.position || p,
            Ti: b.enableMassClear === q ? q : o,
            Re: o
        };
        0 > this.z.width && (this.z.width = 0);
        Gb(b.enableClicking) && (this.z.Re = b.enableClicking);
        this.point = this.z.position;
        var c = this;
        J.load("marker", function () {
            c.qb()
        })
    }

    w.lang.ia(pc, eb, "Label");
    w.extend(pc.prototype, {
        V: function () {
            return this.Iu ? this.Iu.V() : this.point
        }, ha: function (a) {
            a instanceof H && !this.Bw() && (this.point = this.z.position = new H(a.lng, a.lat))
        }, Pc: ba("content"), zE: function (a) {
            0 <= a && 1 >= a && (this.z.opacity = a)
        }, Ge: function (a) {
            a instanceof L && (this.z.pa = new L(a.width, a.height))
        }, Af: function () {
            return this.z.pa
        }, ud: function (a) {
            a = a || {};
            this.z.kp = w.extend(this.z.kp, a)
        }, ci: function (a) {
            return this.ud(a)
        }, qc: function (a) {
            this.z.title = a || ""
        }, getTitle: function () {
            return this.z.title
        }, EM: function (a) {
            this.point = (this.Iu = a) ? this.z.position = a.V() : this.z.position = p
        }, Bw: function () {
            return this.Iu || p
        }, Yj: u("content")
    });
    function qc(a, b) {
        if (0 !== arguments.length) {
            eb.apply(this, arguments);
            b = b || {};
            this.z = {
                Ua: a,
                opacity: b.opacity || 1,
                dm: b.dm || "",
                Mr: b.displayOnMinLevel || 1,
                Lr: b.displayOnMaxLevel || 19
            };
            var c = this;
            J.load("groundoverlay", function () {
                c.qb()
            })
        }
    }

    w.lang.ia(qc, eb, "GroundOverlay");
    w.extend(qc.prototype, {
        setBounds: function (a) {
            this.z.Ua = a
        }, getBounds: function () {
            return this.z.Ua
        }, setOpacity: function (a) {
            this.z.opacity = a
        }, getOpacity: function () {
            return this.z.opacity
        }, setImageURL: function (a) {
            this.z.dm = a
        }, getImageURL: function () {
            return this.z.dm
        }, setDisplayOnMinLevel: function (a) {
            this.z.Mr = a
        }, getDisplayOnMinLevel: function () {
            return this.z.Mr
        }, setDisplayOnMaxLevel: function (a) {
            this.z.Lr = a
        }, getDisplayOnMaxLevel: function () {
            return this.z.Lr
        }
    });
    var rc = 3, sc = 4;

    function tc() {
        var a = document.createElement("canvas");
        return !(!a.getContext || !a.getContext("2d"))
    }

    function uc(a, b) {
        var c = this;
        tc() && (a === j && aa(Error("\u6ca1\u6709\u4f20\u5165points\u6570\u636e")), "[object Array]" !== Object.prototype.toString.call(a) && aa(Error("points\u6570\u636e\u4e0d\u662f\u6570\u7ec4")), b = b || {}, eb.apply(c, arguments), c.R = {W: a}, c.z = {
            shape: b.shape || rc,
            size: b.size || sc,
            color: b.color || "#fa937e",
            Ti: o
        }, this.qA = [], this.Zd = [], J.load("pointcollection", function () {
            for (var a = 0, b; b = c.qA[a]; a++)c[b.method].apply(c, b.arguments);
            for (a = 0; b = c.Zd[a]; a++)c[b.method].apply(c, b.arguments)
        }))
    }

    w.lang.ia(uc, eb, "PointCollection");
    w.extend(uc.prototype, {
        initialize: function (a) {
            this.qA && this.qA.push({method: "initialize", arguments: arguments})
        }, setPoints: function (a) {
            this.Zd && this.Zd.push({method: "setPoints", arguments: arguments})
        }, setStyles: function (a) {
            this.Zd && this.Zd.push({method: "setStyles", arguments: arguments})
        }, clear: function () {
            this.Zd && this.Zd.push({method: "clear", arguments: arguments})
        }, remove: function () {
            this.Zd && this.Zd.push({method: "remove", arguments: arguments})
        }
    });
    var vc = new lc(F.ea + "marker_red_sprite.png", new L(19, 25), {
        anchor: new L(10, 25),
        infoWindowAnchor: new L(10, 0)
    }), wc = new lc(F.ea + "marker_red_sprite.png", new L(20, 11), {
        anchor: new L(6, 11),
        imageOffset: new L(-19, -13)
    });

    function R(a, b) {
        eb.call(this);
        b = b || {};
        this.point = a;
        this.Mp = this.map = p;
        this.z = {
            pa: b.offset || new L(0, 0),
            cj: b.icon || vc,
            pk: wc,
            title: b.title || "",
            label: p,
            SI: b.baseZIndex || 0,
            Re: o,
            D2: q,
            DD: q,
            Ti: b.enableMassClear === q ? q : o,
            Rb: q,
            lM: b.raiseOnDrag === o ? o : q,
            sM: q,
            md: b.draggingCursor || F.md,
            rotation: b.rotation || 0
        };
        b.icon && !b.shadow && (this.z.pk = p);
        b.enableDragging && (this.z.Rb = b.enableDragging);
        Gb(b.enableClicking) && (this.z.Re = b.enableClicking);
        var c = this;
        J.load("marker", function () {
            c.qb()
        })
    }

    R.Wt = hc.Yl(-90) + 1E6;
    R.nF = R.Wt + 1E6;
    w.lang.ia(R, eb, "Marker");
    w.extend(R.prototype, {
        Ob: function (a) {
            if (a instanceof lc || a instanceof mc)this.z.cj = a
        }, qo: function () {
            return this.z.cj
        }, Ix: function (a) {
            a instanceof lc && (this.z.pk = a)
        }, getShadow: function () {
            return this.z.pk
        }, Cm: function (a) {
            this.z.label = a || p
        }, WC: function () {
            return this.z.label
        }, Rb: function () {
            this.z.Rb = o
        }, UB: function () {
            this.z.Rb = q
        }, V: u("point"), ha: function (a) {
            a instanceof H && (this.point = new H(a.lng, a.lat))
        }, di: function (a, b) {
            this.z.DD = !!a;
            a && (this.JF = b || 0)
        }, qc: function (a) {
            this.z.title = a + ""
        }, getTitle: function () {
            return this.z.title
        }, Ge: function (a) {
            a instanceof L && (this.z.pa = a)
        }, Af: function () {
            return this.z.pa
        }, Bm: ba("Mp"), fp: function (a) {
            this.z.rotation = a
        }, qK: function () {
            return this.z.rotation
        }
    });
    function xc(a, b) {
        jc.call(this, b);
        b = b || {};
        this.z.$f = b.fillOpacity ? b.fillOpacity : 0.65;
        this.z.fillColor = "" == b.fillColor ? "" : b.fillColor ? b.fillColor : "#fff";
        this.Ud(a);
        var c = this;
        J.load("poly", function () {
            c.qb()
        })
    }

    w.lang.ia(xc, jc, "Polygon");
    w.extend(xc.prototype, {
        Ud: function (a, b) {
            this.Mn = jc.ww(a).slice(0);
            var c = jc.ww(a).slice(0);
            1 < c.length && c.push(new H(c[0].lng, c[0].lat));
            jc.prototype.Ud.call(this, c, b)
        }, Em: function (a, b) {
            this.Mn[a] && (this.Mn[a] = new H(b.lng, b.lat), this.W[a] = new H(b.lng, b.lat), 0 == a && !this.W[0].$a(this.W[this.W.length - 1]) && (this.W[this.W.length - 1] = new H(b.lng, b.lat)), this.hh())
        }, de: function () {
            var a = this.Mn;
            0 == a.length && (a = this.W);
            return a
        }
    });
    function yc(a, b) {
        jc.call(this, b);
        this.cr(a);
        var c = this;
        J.load("poly", function () {
            c.qb()
        })
    }

    w.lang.ia(yc, jc, "Polyline");
    function zc(a, b, c) {
        this.point = a;
        this.ma = Math.abs(b);
        xc.call(this, [], c)
    }

    zc.YD = [0.01, 1.0E-4, 1.0E-5, 4.0E-6];
    w.lang.ia(zc, xc, "Circle");
    w.extend(zc.prototype, {
        initialize: function (a) {
            this.map = a;
            this.W = this.wu(this.point, this.ma);
            this.hh();
            return p
        }, Aa: u("point"), Gf: function (a) {
            a && (this.point = a)
        }, oK: u("ma"), af: function (a) {
            this.ma = Math.abs(a)
        }, wu: function (a, b) {
            if (!a || !b || !this.map)return [];
            for (var c = [], d = b / 6378800, e = Math.PI / 180 * a.lat, f = Math.PI / 180 * a.lng, g = 0; 360 > g; g += 9) {
                var i = Math.PI / 180 * g, k = Math.asin(Math.sin(e) * Math.cos(d) + Math.cos(e) * Math.sin(d) * Math.cos(i)), i = new H(((f - Math.atan2(Math.sin(i) * Math.sin(d) * Math.cos(e), Math.cos(d) - Math.sin(e) * Math.sin(k)) + Math.PI) % (2 * Math.PI) - Math.PI) * (180 / Math.PI), k * (180 / Math.PI));
                c.push(i)
            }
            d = c[0];
            c.push(new H(d.lng, d.lat));
            return c
        }
    });
    var Ac = {};

    function Bc(a) {
        this.map = a;
        this.km = [];
        this.Hf = [];
        this.ng = [];
        this.MT = 300;
        this.hE = 0;
        this.gg = {};
        this.Li = {};
        this.Vg = 0;
        this.xD = o;
        this.qJ = {};
        this.xn = this.dn(1);
        this.Xc = this.dn(2);
        this.Xk = this.dn(3);
        a.platform.appendChild(this.xn);
        a.platform.appendChild(this.Xc);
        a.platform.appendChild(this.Xk)
    }

    z.Fe(function (a) {
        var b = new Bc(a);
        b.fa();
        a.ib = b
    });
    w.extend(Bc.prototype, {
        fa: function () {
            var a = this, b = a.map;
            b.addEventListener("loadcode", function () {
                a.$w()
            });
            b.addEventListener("addtilelayer", function (b) {
                a.Dg(b)
            });
            b.addEventListener("removetilelayer", function (b) {
                a.bh(b)
            });
            b.addEventListener("setmaptype", function (b) {
                a.kg(b)
            });
            b.addEventListener("zoomstartcode", function (b) {
                a.yc(b)
            });
            b.addEventListener("setcustomstyles", function (b) {
                a.Zs(b.target);
                a.Ef(o)
            })
        }, $w: function () {
            var a = this;
            if (w.S.ba)try {
                document.execCommand("BackgroundImageCache", q, o)
            } catch (b) {
            }
            this.loaded || a.Qw();
            a.Ef();
            this.loaded || (this.loaded = o, J.load("tile", function () {
                a.EO()
            }))
        }, Qw: function () {
            for (var a = this.map.ka().Bq, b = 0; b < a.length; b++) {
                var c = new Cc;
                w.extend(c, a[b]);
                this.km.push(c);
                c.fa(this.map, this.xn)
            }
            this.Zs()
        }, dn: function (a) {
            var b = K("div");
            b.style.position = "absolute";
            b.style.overflow = "visible";
            b.style.left = b.style.top = "0";
            b.style.zIndex = a;
            return b
        }, ef: function () {
            this.Vg--;
            var a = this;
            this.xD && (this.map.dispatchEvent(new M("onfirsttileloaded")), this.xD = q);
            0 == this.Vg && (this.qi && (clearTimeout(this.qi), this.qi = p), this.qi = setTimeout(function () {
                if (a.Vg == 0) {
                    a.map.dispatchEvent(new M("ontilesloaded"));
                    a.xD = o
                }
                a.qi = p
            }, 80))
        }, gD: function (a, b) {
            return "TILE-" + b.Q + "-" + a[0] + "-" + a[1] + "-" + a[2]
        }, Ow: function (a) {
            var b = a.sb;
            b && zb(b) && b.parentNode.removeChild(b);
            delete this.gg[a.name];
            a.loaded || (Dc(a), a.sb = p, a.nm = p)
        }, Xl: function (a, b, c) {
            var d = this.map, e = d.ka(), f = d.wa, g = d.hc, i = e.Ac(f), k = this.eK(), l = k[0], m = k[1], n = k[2], t = k[3], v = k[4], c = "undefined" != typeof c ? c : 0, e = e.k.Cb, k = d.Q.replace(/^TANGRAM_/, "");
            for (this.Dc ? this.Dc.length = 0 : this.Dc = []; l < n; l++)for (var x = m; x < t; x++) {
                var y = l, B = x;
                this.Dc.push([y, B]);
                y = k + "_" + b + "_" + y + "_" + B + "_" + f;
                this.qJ[y] = y
            }
            this.Dc.sort(function (a) {
                return function (b, c) {
                    return 0.4 * Math.abs(b[0] - a[0]) + 0.6 * Math.abs(b[1] - a[1]) - (0.4 * Math.abs(c[0] - a[0]) + 0.6 * Math.abs(c[1] - a[1]))
                }
            }([v[0] - 1, v[1] - 1]));
            g = [Math.round(-g.lng / i), Math.round(g.lat / i)];
            l = -d.offsetY + d.height / 2;
            a.style.left = -d.offsetX + d.width / 2 + "px";
            a.style.top = l + "px";
            this.we ? this.we.length = 0 : this.we = [];
            l = 0;
            for (d = a.childNodes.length; l < d; l++)x = a.childNodes[l], x.xq = q, this.we.push(x);
            if (l = this.qm)for (var A in l)delete l[A]; else this.qm = {};
            this.xe ? this.xe.length = 0 : this.xe = [];
            l = 0;
            for (d = this.Dc.length; l < d; l++) {
                A = this.Dc[l][0];
                i = this.Dc[l][1];
                x = 0;
                for (m = this.we.length; x < m; x++)if (n = this.we[x], n.id == k + "_" + b + "_" + A + "_" + i + "_" + f) {
                    n.xq = o;
                    this.qm[n.id] = n;
                    break
                }
            }
            l = 0;
            for (d = this.we.length; l < d; l++)n = this.we[l], n.xq || this.xe.push(n);
            this.Jm = [];
            x = (e + c) * this.map.D.devicePixelRatio;
            l = 0;
            for (d = this.Dc.length; l < d; l++)A = this.Dc[l][0], i = this.Dc[l][1], t = A * e + g[0] - c / 2, v = (-1 - i) * e + g[1] - c / 2, y = k + "_" + b + "_" + A + "_" + i + "_" + f, m = this.qm[y], n = p, m ? (n = m.style, n.left = t + "px", n.top = v + "px", m.Ke || this.Jm.push([A, i, m])) : (0 < this.xe.length ? (m = this.xe.shift(), m.getContext("2d").clearRect(-c / 2, -c / 2, x, x), n = m.style) : (m = document.createElement("canvas"), n = m.style, n.position = "absolute", n.width = e + c + "px", n.height = e + c + "px", this.Vw() && (n.WebkitTransform = "scale(1.001)"), m.setAttribute("width", x), m.setAttribute("height", x), a.appendChild(m)), m.id = y, n.left = t + "px", n.top = v + "px", -1 < y.indexOf("bg") && (t = "#F3F1EC", this.map.D.Un && (t = this.map.D.Un), n.background = t ? t : ""), this.Jm.push([A, i, m])), m.style.visibility = "";
            l = 0;
            for (d = this.xe.length; l < d; l++)this.xe[l].style.visibility = "hidden";
            return this.Jm
        }, Vw: function () {
            return /M040/i.test(navigator.userAgent)
        }, eK: function () {
            var a = this.map, b = a.ka(), c = b.kD(a.wa), d = a.hc, e = Math.ceil(d.lng / c), f = Math.ceil(d.lat / c), b = b.k.Cb, c = [e, f, (d.lng - e * c) / c * b, (d.lat - f * c) / c * b];
            return [c[0] - Math.ceil((a.width / 2 - c[2]) / b), c[1] - Math.ceil((a.height / 2 - c[3]) / b), c[0] + Math.ceil((a.width / 2 + c[2]) / b), c[1] + Math.ceil((a.height / 2 + c[3]) / b), c]
        }, CY: function (a, b, c, d) {
            var e = this;
            e.H_ = b;
            var f = this.map.ka(), g = e.gD(a, c), i = f.k.Cb, b = [a[0] * i + b[0], (-1 - a[1]) * i + b[1]], k = this.gg[g];
            k && k.sb ? (xb(k.sb, b), d && (d = new P(a[0], a[1]), f = this.map.D.fe ? this.map.D.fe.style : "normal", d = c.getTilesUrl(d, a[2], f), k.loaded = q, Ec(k, d)), k.loaded ? this.ef() : Fc(k, function () {
                e.ef()
            })) : (k = this.Li[g]) && k.sb ? (c.Db.insertBefore(k.sb, c.Db.lastChild), this.gg[g] = k, xb(k.sb, b), d && (d = new P(a[0], a[1]), f = this.map.D.fe ? this.map.D.fe.style : "normal", d = c.getTilesUrl(d, a[2], f), k.loaded = q, Ec(k, d)), k.loaded ? this.ef() : Fc(k, function () {
                e.ef()
            })) : (k = i * Math.pow(2, f.Sl() - a[2]), new H(a[0] * k, a[1] * k), d = new P(a[0], a[1]), f = this.map.D.fe ? this.map.D.fe.style : "normal", d = c.getTilesUrl(d, a[2], f), k = new Gc(this, d, b, a, c), Fc(k, function () {
                e.ef()
            }), Hc(k), this.gg[g] = k)
        }, ef: function () {
            this.Vg--;
            var a = this;
            0 == this.Vg && (this.qi && (clearTimeout(this.qi), this.qi = p), this.qi = setTimeout(function () {
                if (a.Vg == 0) {
                    a.map.dispatchEvent(new M("ontilesloaded"));
                    if (ua) {
                        if (ra && sa && ta) {
                            var b = Za(), c = a.map.Lb();
                            setTimeout(function () {
                                Pa(5030, {
                                    load_script_time: sa - ra,
                                    load_tiles_time: b - ta,
                                    map_width: c.width,
                                    map_height: c.height,
                                    map_size: c.width * c.height
                                })
                            }, 1E4);
                            va.ac("img_fisrt_loaded");
                            va.ac("map_width", c.width);
                            va.ac("map_height", c.height);
                            va.ac("map_size", c.width * c.height);
                            va.wm()
                        }
                        ua = q
                    }
                }
                a.qi = p
            }, 80))
        }, gD: function (a, b) {
            return this.map.ka() === Oa ? "TILE-" + b.Q + "-" + this.map.Qv + "-" + a[0] + "-" + a[1] + "-" + a[2] : "TILE-" + b.Q + "-" + a[0] + "-" + a[1] + "-" + a[2]
        }, Ow: function (a) {
            var b = a.sb;
            b && (Ic(b), zb(b) && b.parentNode.removeChild(b));
            delete this.gg[a.name];
            a.loaded || (Ic(b), Dc(a), a.sb = p, a.nm = p)
        }, Ef: function (a) {
            var b = this;
            if (b.map.ka() == Oa)J.load("coordtrans", function () {
                b.map.Ib || (b.map.Ib = Oa.Xj(b.map.Yn), b.map.Qv = Oa.cK(b.map.Ib));
                b.jH()
            }, o); else {
                if (a && a)for (var c in this.Li)delete this.Li[c];
                b.jH(a)
            }
        }, jH: function (a) {
            for (var b = this.km.concat(this.Hf), c = b.length, d = 0; d < c; d++) {
                var e = b[d];
                if (e.Tb && l.wa < e.Tb)break;
                if (e.Lv) {
                    var f = this.Db = e.Db;
                    if (a) {
                        var g = f;
                        if (g && g.childNodes)for (var i = g.childNodes.length, k = i - 1; 0 <= k; k--)i = g.childNodes[k], g.removeChild(i), i = p
                    }
                    if (this.map.Hb()) {
                        this.Xc.style.display = "block";
                        f.style.display = "none";
                        this.map.dispatchEvent(new M("vectorchanged"), {isvector: o});
                        continue
                    } else f.style.display = "block", this.Xc.style.display = "none", this.map.dispatchEvent(new M("vectorchanged"), {isvector: q})
                }
                if (!e.aH && !(e.Ho && !this.map.Hb() || e.aL && this.map.Hb())) {
                    var l = this.map, m = l.ka(), f = m.wo(), i = l.wa, n = l.hc;
                    m == Oa && n.$a(new H(0, 0)) && (n = l.hc = f.jm(l.Qe, l.Ib));
                    var t = m.Ac(i), i = m.kD(i), f = Math.ceil(n.lng / i), g = Math.ceil(n.lat / i), v = m.k.Cb, i = [f, g, (n.lng - f * i) / i * v, (n.lat - g * i) / i * v], k = i[0] - Math.ceil((l.width / 2 - i[2]) / v), f = i[1] - Math.ceil((l.height / 2 - i[3]) / v), g = i[0] + Math.ceil((l.width / 2 + i[2]) / v), x = 0;
                    m === Oa && 15 == l.U() && (x = 1);
                    m = i[1] + Math.ceil((l.height / 2 + i[3]) / v) + x;
                    this.OI = new H(n.lng, n.lat);
                    var y = this.gg, v = -this.OI.lng / t, x = this.OI.lat / t, t = [Math.ceil(v), Math.ceil(x)], n = l.U(), B;
                    for (B in y) {
                        var A = y[B], D = A.info;
                        (D[2] != n || D[2] == n && (k > D[0] || g <= D[0] || f > D[1] || m <= D[1])) && this.Ow(A)
                    }
                    y = -l.offsetX + l.width / 2;
                    A = -l.offsetY + l.height / 2;
                    e.Db && (e.Db.style.left = Math.ceil(v + y) - t[0] + "px", e.Db.style.top = Math.ceil(x + A) - t[1] + "px", e.Db.style.WebkitTransform = "translate3d(0,0,0)");
                    v = [];
                    for (l.UA = []; k < g; k++)for (x = f; x < m; x++)v.push([k, x]), l.UA.push({x: k, y: x});
                    v.sort(function (a) {
                        return function (b, c) {
                            return 0.4 * Math.abs(b[0] - a[0]) + 0.6 * Math.abs(b[1] - a[1]) - (0.4 * Math.abs(c[0] - a[0]) + 0.6 * Math.abs(c[1] - a[1]))
                        }
                    }([i[0] - 1, i[1] - 1]));
                    i = v.length;
                    this.Vg += i;
                    for (k = 0; k < i; k++)this.CY([v[k][0], v[k][1], n], t, e, a)
                }
            }
        }, Dg: function (a) {
            var b = this, c = a.target, a = b.map.Hb();
            if (c instanceof bb)a && !c.em && (c.fa(this.map, this.Xc), c.em = o); else if (c.If && this.map.Dg(c.If), c.Ho) {
                for (a = 0; a < b.ng.length; a++)if (b.ng[a] == c)return;
                J.load("vector", function () {
                    c.fa(b.map, b.Xc);
                    b.ng.push(c)
                }, o)
            } else {
                for (a = 0; a < b.Hf.length; a++)if (b.Hf[a] == c)return;
                c.fa(this.map, this.Xk);
                b.Hf.push(c)
            }
        }, bh: function (a) {
            var a = a.target, b = this.map.Hb();
            if (a instanceof bb)b && a.em && (a.remove(), a.em = q); else {
                a.If && this.map.bh(a.If);
                if (a.Ho)for (var b = 0, c = this.ng.length; b < c; b++)a == this.ng[b] && this.ng.splice(b, 1); else {
                    b = 0;
                    for (c = this.Hf.length; b < c; b++)a == this.Hf[b] && this.Hf.splice(b, 1)
                }
                a.remove()
            }
        }, kg: function () {
            for (var a = this.km, b = 0, c = a.length; b < c; b++)a[b].remove();
            delete this.Db;
            this.km = [];
            this.Li = this.gg = {};
            this.Qw();
            this.Ef()
        }, yc: function () {
            var a = this;
            a.dd && w.B.J(a.dd);
            setTimeout(function () {
                a.Ef();
                a.map.dispatchEvent(new M("onzoomend"))
            }, 10)
        }, s2: s(), Zs: function (a) {
            var b = this.map.ka();
            if (!this.map.Hb() && (a ? this.map.D.JY = a : a = this.map.D.JY, a))for (var c = p, c = "2" == z.Xx ? [z.url.proto + z.url.domain.main_domain_cdn.other[0] + "/"] : [z.url.proto + z.url.domain.main_domain_cdn.baidu[0] + "/", z.url.proto + z.url.domain.main_domain_cdn.baidu[1] + "/", z.url.proto + z.url.domain.main_domain_cdn.baidu[2] + "/"], d = 0, e; e = this.km[d]; d++)if (e.yY == o) {
                b.k.Mb = 18;
                e.getTilesUrl = function (b, d) {
                    var e = b.x, k = b.y, l = "customimage/tile?&x=" + e + "&y=" + k + "&z=" + d + "&udt=20150601", l = a.styleStr ? l + ("&styles=" + encodeURIComponent(a.styleStr)) : l + ("&customid=" + a.style);
                    return c[Math.abs(e + k) % c.length] + l
                };
                break
            }
        }
    });
    function Gc(a, b, c, d, e) {
        this.nm = a;
        this.position = c;
        this.hu = [];
        this.name = a.gD(d, e);
        this.info = d;
        this.lI = e.Cs();
        d = K("img");
        yb(d);
        d.WJ = q;
        var f = d.style, a = a.map.ka();
        f.position = "absolute";
        f.border = "none";
        f.width = a.k.Cb + "px";
        f.height = a.k.Cb + "px";
        f.left = c[0] + "px";
        f.top = c[1] + "px";
        f.maxWidth = "none";
        this.sb = d;
        this.src = b;
        Jc && (this.sb.style.opacity = 0);
        var g = this;
        this.sb.onload = function () {
            z.SW.nP();
            g.loaded = o;
            if (g.nm) {
                var a = g.nm, b = a.Li;
                if (!b[g.name]) {
                    a.hE++;
                    b[g.name] = g
                }
                if (g.sb && !zb(g.sb) && e.Db) {
                    e.Db.appendChild(g.sb);
                    if (w.S.ba <= 6 && w.S.ba > 0 && g.lI)g.sb.style.cssText = g.sb.style.cssText + (';filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + g.src + '",sizingMethod=scale);')
                }
                var c = a.hE - a.MT, d;
                for (d in b) {
                    if (c <= 0)break;
                    if (!a.gg[d]) {
                        b[d].nm = p;
                        var f = b[d].sb;
                        if (f && f.parentNode) {
                            f.parentNode.removeChild(f);
                            Ic(f)
                        }
                        f = p;
                        b[d].sb = p;
                        delete b[d];
                        a.hE--;
                        c--
                    }
                }
                Jc && new sb({
                    Lc: 20, duration: 200, la: function (a) {
                        if (g.sb && g.sb.style)g.sb.style.opacity = a * 1
                    }, finish: function () {
                        g.sb && g.sb.style && delete g.sb.style.opacity
                    }
                });
                Dc(g)
            }
        };
        this.sb.onerror = function () {
            Dc(g);
            if (g.nm) {
                var a = g.nm.map.ka();
                if (a.k.xC) {
                    g.error = o;
                    g.sb.src = a.k.xC;
                    g.sb && !zb(g.sb) && e.Db.appendChild(g.sb)
                }
            }
        };
        d = p
    }

    function Fc(a, b) {
        a.hu.push(b)
    }

    function Hc(a) {
        a.sb.src = 0 < w.S.ba && 6 >= w.S.ba && a.lI ? F.ea + "blank.gif" : "" !== a.src && a.sb.src == a.src ? a.src + "&t = " + Date.now() : a.src
    }

    function Dc(a) {
        for (var b = 0; b < a.hu.length; b++)a.hu[b]();
        a.hu.length = 0
    }

    function Ic(a) {
        if (a) {
            a.onload = a.onerror = p;
            var b = a.attributes, c, d, e;
            if (b) {
                d = b.length;
                for (c = 0; c < d; c += 1)e = b[c].name, Va(a[e]) && (a[e] = p)
            }
            if (b = a.children) {
                d = b.length;
                for (c = 0; c < d; c += 1)Ic(a.children[c])
            }
        }
    }

    function Ec(a, b) {
        a.src = b;
        Hc(a)
    }

    var Jc = !w.S.ba || 8 < w.S.ba;

    function Cc(a) {
        this.Wg = a || {};
        this.fU = this.Wg.copyright || p;
        this.iZ = this.Wg.transparentPng || q;
        this.Lv = this.Wg.baseLayer || q;
        this.zIndex = this.Wg.zIndex || 0;
        this.Q = Cc.WQ++
    }

    Cc.WQ = 0;
    w.lang.ia(Cc, w.lang.ra, "TileLayer");
    w.extend(Cc.prototype, {
        fa: function (a, b) {
            this.Lv && (this.zIndex = -100);
            this.map = a;
            if (!this.Db) {
                var c = K("div"), d = c.style;
                d.position = "absolute";
                d.overflow = "visible";
                d.zIndex = this.zIndex;
                d.left = Math.ceil(-a.offsetX + a.width / 2) + "px";
                d.top = Math.ceil(-a.offsetY + a.height / 2) + "px";
                b.appendChild(c);
                this.Db = c
            }
        }, remove: function () {
            this.Db && this.Db.parentNode && (this.Db.innerHTML = "", this.Db.parentNode.removeChild(this.Db));
            delete this.Db
        }, Cs: u("iZ"), getTilesUrl: function (a, b) {
            var c = "";
            this.Wg.tileUrlTemplate && (c = this.Wg.tileUrlTemplate.replace(/\{X\}/, a.x), c = c.replace(/\{Y\}/, a.y), c = c.replace(/\{Z\}/, b));
            return c
        }, Ql: u("fU"), ka: function () {
            return this.tb || Ma
        }
    });
    function Kc(a, b) {
        Hb(a) ? b = a || {} : (b = b || {}, b.databoxId = a);
        this.k = {
            rJ: b.databoxId,
            Jg: b.geotableId,
            vx: b.q || "",
            wt: b.tags || "",
            filter: b.filter || "",
            Px: b.sortby || "",
            HY: b.styleId || "",
            tl: b.ak || qa,
            Iv: b.age || 36E5,
            zIndex: 11,
            NW: "VectorCloudLayer",
            fk: b.hotspotName || "vector_md_" + (1E5 * Math.random()).toFixed(0),
            sT: "LBS\u4e91\u9ebb\u70b9\u5c42"
        };
        this.Ho = o;
        Cc.call(this, this.k);
        this.uU = z.zc + "geosearch/detail/";
        this.vU = z.zc + "geosearch/v2/detail/";
        this.Do = {}
    }

    w.ia(Kc, Cc, "VectorCloudLayer");
    function Lc(a) {
        a = a || {};
        this.k = w.extend(a, {zIndex: 1, NW: "VectorTrafficLayer", sT: "\u77e2\u91cf\u8def\u51b5\u5c42"});
        this.Ho = o;
        Cc.call(this, this.k);
        this.eZ = z.url.proto + z.url.domain.vector_traffic + "/gvd/?qt=lgvd&styles=pl&layers=tf";
        this.pb = {
            "0": [2, 1354709503, 2, 2, 0, [], 0, 0],
            1: [2, 1354709503, 3, 2, 0, [], 0, 0],
            10: [2, -231722753, 2, 2, 0, [], 0, 0],
            11: [2, -231722753, 3, 2, 0, [], 0, 0],
            12: [2, -231722753, 4, 2, 0, [], 0, 0],
            13: [2, -231722753, 5, 2, 0, [], 0, 0],
            14: [2, -231722753, 6, 2, 0, [], 0, 0],
            15: [2, -1, 4, 0, 0, [], 0, 0],
            16: [2, -1, 5.5, 0, 0, [], 0, 0],
            17: [2, -1, 7, 0, 0, [], 0, 0],
            18: [2, -1, 8.5, 0, 0, [], 0, 0],
            19: [2, -1, 10, 0, 0, [], 0, 0],
            2: [2, 1354709503, 4, 2, 0, [], 0, 0],
            3: [2, 1354709503, 5, 2, 0, [], 0, 0],
            4: [2, 1354709503, 6, 2, 0, [], 0, 0],
            5: [2, -6350337, 2, 2, 0, [], 0, 0],
            6: [2, -6350337, 3, 2, 0, [], 0, 0],
            7: [2, -6350337, 4, 2, 0, [], 0, 0],
            8: [2, -6350337, 5, 2, 0, [], 0, 0],
            9: [2, -6350337, 6, 2, 0, [], 0, 0]
        }
    }

    w.ia(Lc, Cc, "VectorTrafficLayer");
    function bb(a) {
        this.NT = [z.url.proto + z.url.domain.TILE_ONLINE_URLS[1] + "/gvd/?", z.url.proto + z.url.domain.TILE_ONLINE_URLS[2] + "/gvd/?", z.url.proto + z.url.domain.TILE_ONLINE_URLS[3] + "/gvd/?", z.url.proto + z.url.domain.TILE_ONLINE_URLS[4] + "/gvd/?"];
        this.k = {SJ: q};
        for (var b in a)this.k[b] = a[b];
        this.Eh = this.lh = this.Ka = this.A = this.C = p;
        this.gL = 0;
        var c = this;
        J.load("vector", function () {
            c.cf()
        })
    }

    w.extend(bb.prototype, {
        fa: function (a, b) {
            this.C = a;
            this.A = b
        }, remove: function () {
            this.A = this.C = p
        }
    });
    function Mc(a) {
        Cc.call(this, a);
        this.k = a || {};
        this.aL = o;
        this.If = new Lc;
        this.If.Vx = this;
        if (this.k.predictDate) {
            if (1 > this.k.predictDate.weekday || 7 < this.k.predictDate.weekday)this.k.predictDate = 1;
            if (0 > this.k.predictDate.hour || 23 < this.k.predictDate.hour)this.k.predictDate.hour = 0
        }
        this.YS = z.url.proto + z.url.domain.traffic + ":8002/traffic/"
    }

    Mc.prototype = new Cc;
    Mc.prototype.fa = function (a, b) {
        Cc.prototype.fa.call(this, a, b);
        this.C = a
    };
    Mc.prototype.Cs = da(o);
    Mc.prototype.getTilesUrl = function (a, b) {
        var c = "";
        this.k.predictDate ? c = "HistoryService?day=" + (this.k.predictDate.weekday - 1) + "&hour=" + this.k.predictDate.hour + "&t=" + (new Date).getTime() + "&" : (c = "TrafficTileService?time=" + (new Date).getTime() + "&", c += "label=web2D&v=016&");
        return (this.YS + c + "level=" + b + "&x=" + a.x + "&y=" + a.y).replace(/-(\d+)/gi, "M$1")
    };
    var Nc = [z.url.proto + z.url.domain.TILES_YUN_HOST[0] + "/georender/gss", z.url.proto + z.url.domain.TILES_YUN_HOST[1] + "/georender/gss", z.url.proto + z.url.domain.TILES_YUN_HOST[2] + "/georender/gss", z.url.proto + z.url.domain.TILES_YUN_HOST[3] + "/georender/gss"], Oc = 100;

    function mb(a, b) {
        Cc.call(this);
        var c = this;
        this.aL = o;
        var d = q;
        try {
            document.createElement("canvas").getContext("2d"), d = o
        } catch (e) {
            d = q
        }
        d && (this.If = new Kc(a, b), this.If.Vx = this);
        Hb(a) ? b = a || {} : (c.Zp = a, b = b || {});
        b.geotableId && (c.Pf = b.geotableId);
        b.databoxId && (c.Zp = b.databoxId);
        d = z.zc + "geosearch";
        c.oc = {
            yX: b.pointDensity || Oc,
            mW: d + "/detail/",
            nW: d + "/v2/detail/",
            Iv: b.age || 36E5,
            vx: b.q || "",
            SY: "png",
            S0: [5, 5, 5, 5],
            MW: {backgroundColor: "#FFFFD5", borderColor: "#808080"},
            tl: b.ak || qa,
            wt: b.tags || "",
            filter: b.filter || "",
            Px: b.sortby || "",
            fk: b.hotspotName || "tile_md_" + (1E5 * Math.random()).toFixed(0)
        };
        J.load("clayer", function () {
            c.zd()
        })
    }

    mb.prototype = new Cc;
    mb.prototype.fa = function (a, b) {
        Cc.prototype.fa.call(this, a, b);
        this.C = a
    };
    mb.prototype.getTilesUrl = function (a, b) {
        var c = a.x, d = a.y, e = this.oc, c = Nc[Math.abs(c + d) % Nc.length] + "/image?grids=" + c + "_" + d + "_" + b + "&q=" + e.vx + "&tags=" + e.wt + "&filter=" + e.filter + "&sortby=" + e.Px + "&ak=" + this.oc.tl + "&age=" + e.Iv + "&page_size=" + e.yX + "&format=" + e.SY;
        this.Pf ? c += "&geotable_id=" + this.Pf : this.Zp && (c += "&databox_id=" + this.Zp);
        return c
    };
    mb.vS = /^point\(|\)$/ig;
    mb.wS = /\s+/;
    mb.yS = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    function Pc(a, b, c) {
        this.Ne = a;
        this.Bq = b instanceof Cc ? [b] : b.slice(0);
        c = c || {};
        this.k = {
            TY: c.tips || "",
            HD: "",
            Tb: c.minZoom || 3,
            Mb: c.maxZoom || 18,
            R0: c.minZoom || 3,
            Q0: c.maxZoom || 18,
            Cb: 256,
            RY: c.textColor || "black",
            xC: c.errorImageUrl || "",
            ie: c.projection || new Q
        };
        1 <= this.Bq.length && (this.Bq[0].Lv = o);
        w.extend(this.k, c)
    }

    w.extend(Pc.prototype, {
        getName: u("Ne"), ns: function () {
            return this.k.TY
        }, x0: function () {
            return this.k.HD
        }, ZV: function () {
            return this.Bq[0]
        }, K0: u("Bq"), $V: function () {
            return this.k.Cb
        }, ro: function () {
            return this.k.Tb
        }, Sl: function () {
            return this.k.Mb
        }, setMaxZoom: function (a) {
            this.k.Mb = a
        }, ls: function () {
            return this.k.RY
        }, wo: function () {
            return this.k.ie
        }, s0: function () {
            return this.k.xC
        }, $V: function () {
            return this.k.Cb
        }, Ac: function (a) {
            return Math.pow(2, 18 - a)
        }, kD: function (a) {
            return this.Ac(a) * this.k.Cb
        }
    });
    var Qc = [z.url.proto + z.url.domain.TILE_BASE_URLS[0] + "/it/", z.url.proto + z.url.domain.TILE_BASE_URLS[1] + "/it/", z.url.proto + z.url.domain.TILE_BASE_URLS[2] + "/it/", z.url.proto + z.url.domain.TILE_BASE_URLS[3] + "/it/", z.url.proto + z.url.domain.TILE_BASE_URLS[4] + "/it/"], Rc = [z.url.proto + z.url.domain.TILE_ONLINE_URLS[0] + "/tile/", z.url.proto + z.url.domain.TILE_ONLINE_URLS[1] + "/tile/", z.url.proto + z.url.domain.TILE_ONLINE_URLS[2] + "/tile/", z.url.proto + z.url.domain.TILE_ONLINE_URLS[3] + "/tile/", z.url.proto + z.url.domain.TILE_ONLINE_URLS[4] + "/tile/"], Sc = {
        dark: "dl",
        light: "ll",
        normal: "pl"
    }, Tc = new Cc;
    Tc.yY = o;
    Tc.getTilesUrl = function (a, b, c) {
        var d = a.x, a = a.y, e = 1, c = Sc[c];
        this.map.FK() && (e = 2);
        return (Rc[Math.abs(d + a) % Rc.length] + "?qt=tile&x=" + (d + "").replace(/-/gi, "M") + "&y=" + (a + "").replace(/-/gi, "M") + "&z=" + b + "&styles=" + c + "&scaler=" + e + (6 == w.S.ba ? "&color_dep=32&colors=50" : "") + "&udt=20150528").replace(/-(\d+)/gi, "M$1")
    };
    var Ma = new Pc("\u5730\u56fe", Tc, {tips: "\u663e\u793a\u666e\u901a\u5730\u56fe", maxZoom: 19}), Uc = new Cc;
    Uc.aN = [z.url.proto + z.url.domain.TIlE_PERSPECT_URLS[0] + "/resource/mappic/", z.url.proto + z.url.domain.TIlE_PERSPECT_URLS[1] + "/resource/mappic/", z.url.proto + z.url.domain.TIlE_PERSPECT_URLS[2] + "/resource/mappic/", z.url.proto + z.url.domain.TIlE_PERSPECT_URLS[3] + "/resource/mappic/"];
    Uc.getTilesUrl = function (a, b) {
        var c = a.x, d = a.y, e = 256 * Math.pow(2, 20 - b), d = Math.round((9998336 - e * d) / e) - 1;
        return url = this.aN[Math.abs(c + d) % this.aN.length] + this.map.Ib + "/" + this.map.Qv + "/3/lv" + (21 - b) + "/" + c + "," + d + ".jpg"
    };
    var Oa = new Pc("\u4e09\u7ef4", Uc, {
        tips: "\u663e\u793a\u4e09\u7ef4\u5730\u56fe",
        minZoom: 15,
        maxZoom: 20,
        textColor: "white",
        projection: new fb
    });
    Oa.Ac = function (a) {
        return Math.pow(2, 20 - a)
    };
    Oa.Xj = function (a) {
        if (!a)return "";
        var b = F.pB, c;
        for (c in b)if (-1 < a.search(c))return b[c].tx;
        return ""
    };
    Oa.cK = function (a) {
        return {bj: 2, gz: 1, sz: 14, sh: 4}[a]
    };
    var Vc = new Cc({Lv: o});
    Vc.getTilesUrl = function (a, b) {
        var c = a.x, d = a.y;
        return (Qc[Math.abs(c + d) % Qc.length] + "u=x=" + c + ";y=" + d + ";z=" + b + ";v=009;type=sate&fm=46&udt=20141015").replace(/-(\d+)/gi, "M$1")
    };
    var Wa = new Pc("\u536b\u661f", Vc, {
        tips: "\u663e\u793a\u536b\u661f\u5f71\u50cf",
        minZoom: 1,
        maxZoom: 19,
        textColor: "white"
    }), Wc = new Cc({transparentPng: o});
    Wc.getTilesUrl = function (a, b) {
        var c = a.x, d = a.y;
        return (Rc[Math.abs(c + d) % Rc.length] + "?qt=tile&x=" + (c + "").replace(/-/gi, "M") + "&y=" + (d + "").replace(/-/gi, "M") + "&z=" + b + "&styles=sl" + (6 == w.S.ba ? "&color_dep=32&colors=50" : "") + "&udt=20141015").replace(/-(\d+)/gi, "M$1")
    };
    var Qa = new Pc("\u6df7\u5408", [Vc, Wc], {
        tips: "\u663e\u793a\u5e26\u6709\u8857\u9053\u7684\u536b\u661f\u5f71\u50cf",
        labelText: "\u8def\u7f51",
        minZoom: 1,
        maxZoom: 19,
        textColor: "white"
    });
    var Xc = 1, S = {};
    window.GZ = S;
    function T(a, b) {
        w.lang.ra.call(this);
        this.hd = {};
        this.Dm(a);
        b = b || {};
        b.aa = b.renderOptions || {};
        this.k = {
            aa: {
                va: b.aa.panel || p,
                map: b.aa.map || p,
                Eg: b.aa.autoViewport || o,
                Us: b.aa.selectFirstResult,
                ss: b.aa.highlightMode,
                Rb: b.aa.enableDragging || q
            },
            lx: b.onSearchComplete || s(),
            VL: b.onMarkersSet || s(),
            UL: b.onInfoHtmlSet || s(),
            XL: b.onResultsHtmlSet || s(),
            TL: b.onGetBusListComplete || s(),
            SL: b.onGetBusLineComplete || s(),
            QL: b.onBusListHtmlSet || s(),
            PL: b.onBusLineHtmlSet || s(),
            VD: b.onPolylinesSet || s(),
            To: b.reqFrom || ""
        };
        this.k.aa.Eg = "undefined" != typeof b && "undefined" != typeof b.renderOptions && "undefined" != typeof b.renderOptions.autoViewport ? b.renderOptions.autoViewport : o;
        this.k.aa.va = w.rc(this.k.aa.va)
    }

    w.ia(T, w.lang.ra);
    w.extend(T.prototype, {
        getResults: function () {
            return this.uc ? this.oi : this.$
        }, enableAutoViewport: function () {
            this.k.aa.Eg = o
        }, disableAutoViewport: function () {
            this.k.aa.Eg = q
        }, Dm: function (a) {
            a && (this.hd.src = a)
        }, BE: function (a) {
            this.k.lx = a || s()
        }, setMarkersSetCallback: function (a) {
            this.k.VL = a || s()
        }, setPolylinesSetCallback: function (a) {
            this.k.VD = a || s()
        }, setInfoHtmlSetCallback: function (a) {
            this.k.UL = a || s()
        }, setResultsHtmlSetCallback: function (a) {
            this.k.XL = a || s()
        }, Vl: u("kd")
    });
    var Yc = {
        xF: z.zc, fb: function (a, b, c, d, e) {
            var f = (1E5 * Math.random()).toFixed(0);
            z._rd["_cbk" + f] = function (b) {
                c = c || {};
                a && a(b, c);
                delete z._rd["_cbk" + f]
            };
            d = d || "";
            b = c && c.tN ? Fb(b, encodeURI) : Fb(b, encodeURIComponent);
            this.xF = c && c.Wr ? c.rM ? c.rM : z.Ko : z.zc;
            d = this.xF + d + "?" + b + "&ie=utf-8&oue=1&fromproduct=jsapi";
            e || (d += "&res=api");
            Qb(d + ("&callback=BMap._rd._cbk" + f))
        }
    };
    window.NZ = Yc;
    z._rd = {};
    var O = {};
    window.MZ = O;
    O.nM = function (a) {
        a = a.replace(/<\/?[^>]*>/g, "");
        return a = a.replace(/[ | ]* /g, " ")
    };
    O.sX = function (a) {
        return a.replace(/([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0|[1-9]\d*),([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0|[1-9]\d*)(,)/g, "$1,$2;")
    };
    O.tX = function (a, b) {
        return a.replace(RegExp("(((-?\\d+)(\\.\\d+)?),((-?\\d+)(\\.\\d+)?);)(((-?\\d+)(\\.\\d+)?),((-?\\d+)(\\.\\d+)?);){" + b + "}", "ig"), "$1")
    };
    var Zc = 2, $c = 3, ad = 0, bd = "bt", cd = "nav", dd = "walk", ed = "bl", fd = "bsl", gd = 14, hd = 15, id = 18, jd = 20, kd = 31;
    z.I = window.Instance = w.lang.Nd;
    function ld(a, b, c) {
        w.lang.ra.call(this);
        if (a) {
            this.Ia = "object" == typeof a ? a : w.rc(a);
            this.page = 1;
            this.qd = 100;
            this.QI = "pg";
            this.Ff = 4;
            this.VI = b;
            this.update = o;
            a = {page: 1, He: 100, qd: 100, Ff: 4, QI: "pg", update: o};
            c || (c = a);
            for (var d in c)"undefined" != typeof c[d] && (this[d] = c[d]);
            this.la()
        }
    }

    w.extend(ld.prototype, {
        la: function () {
            this.fa()
        }, fa: function () {
            this.ST();
            this.Ia.innerHTML = this.lU()
        }, ST: function () {
            isNaN(parseInt(this.page)) && (this.page = 1);
            isNaN(parseInt(this.qd)) && (this.qd = 1);
            1 > this.page && (this.page = 1);
            1 > this.qd && (this.qd = 1);
            this.page > this.qd && (this.page = this.qd);
            this.page = parseInt(this.page);
            this.qd = parseInt(this.qd)
        }, B0: function () {
            location.search.match(RegExp("[?&]?" + this.QI + "=([^&]*)[&$]?", "gi"));
            this.page = RegExp.$1
        }, lU: function () {
            var a = [], b = this.page - 1, c = this.page + 1;
            a.push('<p style="margin:0;padding:0;white-space:nowrap">');
            if (!(1 > b)) {
                if (this.page >= this.Ff) {
                    var d;
                    a.push('<span style="margin-right:3px"><a style="color:#7777cc" href="javascript:void(0)" onclick="{temp1}">\u9996\u9875</a></span>'.replace("{temp1}", "BMap.I('" + this.Q + "').toPage(1);"))
                }
                a.push('<span style="margin-right:3px"><a style="color:#7777cc" href="javascript:void(0)" onclick="{temp2}">\u4e0a\u4e00\u9875</a></span>'.replace("{temp2}", "BMap.I('" + this.Q + "').toPage(" + b + ");"))
            }
            if (this.page < this.Ff)d = 0 == this.page % this.Ff ? this.page - this.Ff - 1 : this.page - this.page % this.Ff + 1, b = d + this.Ff - 1; else {
                d = Math.floor(this.Ff / 2);
                var e = this.Ff % 2 - 1, b = this.qd > this.page + d ? this.page + d : this.qd;
                d = this.page - d - e
            }
            this.page > this.qd - this.Ff && this.page >= this.Ff && (d = this.qd - this.Ff + 1, b = this.qd);
            for (e = d; e <= b; e++)0 < e && (e == this.page ? a.push('<span style="margin-right:3px">' + e + "</span>") : 1 <= e && e <= this.qd && (d = '<span><a style="color:#7777cc;margin-right:3px" href="javascript:void(0)" onclick="{temp3}">[' + e + "]</a></span>", a.push(d.replace("{temp3}", "BMap.I('" + this.Q + "').toPage(" + e + ");"))));
            c > this.qd || a.push('<span><a style="color:#7777cc" href="javascript:void(0)" onclick="{temp4}">\u4e0b\u4e00\u9875</a></span>'.replace("{temp4}", "BMap.I('" + this.Q + "').toPage(" + c + ");"));
            a.push("</p>");
            return a.join("")
        }, toPage: function (a) {
            a = a ? a : 1;
            "function" == typeof this.VI && (this.VI(a), this.page = a);
            this.update && this.la()
        }
    });
    function ab(a, b) {
        T.call(this, a, b);
        b = b || {};
        b.renderOptions = b.renderOptions || {};
        this.ep(b.pageCapacity);
        "undefined" != typeof b.renderOptions.selectFirstResult && !b.renderOptions.selectFirstResult ? this.VB() : this.sC();
        this.ja = [];
        this.bf = [];
        this.Xa = -1;
        this.Ma = [];
        var c = this;
        J.load("local", function () {
            c.Ny()
        }, o)
    }

    w.ia(ab, T, "LocalSearch");
    ab.wp = 10;
    ab.KZ = 1;
    ab.Sm = 100;
    ab.mF = 2E3;
    ab.uF = 1E5;
    w.extend(ab.prototype, {
        search: function (a, b) {
            this.Ma.push({method: "search", arguments: [a, b]})
        }, Am: function (a, b, c) {
            this.Ma.push({method: "searchInBounds", arguments: [a, b, c]})
        }, $o: function (a, b, c, d) {
            this.Ma.push({method: "searchNearby", arguments: [a, b, c, d]})
        }, ye: function () {
            delete this.ta;
            delete this.kd;
            delete this.$;
            delete this.T;
            this.Xa = -1;
            this.gb();
            this.k.aa.va && (this.k.aa.va.innerHTML = "")
        }, Zl: s(), sC: function () {
            this.k.aa.Us = o
        }, VB: function () {
            this.k.aa.Us = q
        }, ep: function (a) {
            this.k.jk = "number" == typeof a && !isNaN(a) ? 1 > a ? ab.wp : a > ab.Sm ? ab.wp : a : ab.wp
        }, Ve: function () {
            return this.k.jk
        }, toString: da("LocalSearch")
    });
    var md = ab.prototype;
    U(md, {
        clearResults: md.ye,
        setPageCapacity: md.ep,
        getPageCapacity: md.Ve,
        gotoPage: md.Zl,
        searchNearby: md.$o,
        searchInBounds: md.Am,
        search: md.search,
        enableFirstResultSelection: md.sC,
        disableFirstResultSelection: md.VB
    });
    function nd(a, b) {
        T.call(this, a, b)
    }

    w.ia(nd, T, "BaseRoute");
    w.extend(nd.prototype, {ye: s()});
    function od(a, b) {
        T.call(this, a, b);
        b = b || {};
        this.bt(b.policy);
        this.ep(b.pageCapacity);
        this.ed = bd;
        this.St = gd;
        this.Tt = Xc;
        this.ja = [];
        this.Xa = -1;
        this.k.Sc = b.enableTraffic || q;
        this.Ma = [];
        var c = this;
        J.load("route", function () {
            c.zd()
        })
    }

    od.Sm = 100;
    od.YN = [0, 1, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 1, 1, 1];
    w.ia(od, nd, "TransitRoute");
    w.extend(od.prototype, {
        bt: function (a) {
            this.k.Oc = 0 <= a && 4 >= a ? a : 0
        }, Nz: function (a, b) {
            this.Ma.push({method: "_internalSearch", arguments: [a, b]})
        }, search: function (a, b) {
            this.Ma.push({method: "search", arguments: [a, b]})
        }, ep: function (a) {
            if ("string" === typeof a && (a = parseInt(a, 10), isNaN(a))) {
                this.k.jk = od.Sm;
                return
            }
            this.k.jk = "number" !== typeof a ? od.Sm : 1 <= a && a <= od.Sm ? Math.round(a) : od.Sm
        }, toString: da("TransitRoute"), KS: function (a) {
            return a.replace(/\(.*\)/, "")
        }
    });
    var pd = od.prototype;
    U(pd, {_internalSearch: pd.Nz});
    function qd(a, b) {
        T.call(this, a, b);
        this.ja = [];
        this.Xa = -1;
        this.Ma = [];
        var c = this, d = this.k.aa;
        1 !== d.ss && 2 !== d.ss && (d.ss = 1);
        this.hz = this.k.aa.Rb ? o : q;
        J.load("route", function () {
            c.zd()
        });
        this.uD && this.uD()
    }

    qd.kO = " \u73af\u5c9b \u65e0\u5c5e\u6027\u9053\u8def \u4e3b\u8def \u9ad8\u901f\u8fde\u63a5\u8def \u4ea4\u53c9\u70b9\u5185\u8def\u6bb5 \u8fde\u63a5\u9053\u8def \u505c\u8f66\u573a\u5185\u90e8\u9053\u8def \u670d\u52a1\u533a\u5185\u90e8\u9053\u8def \u6865 \u6b65\u884c\u8857 \u8f85\u8def \u531d\u9053 \u5168\u5c01\u95ed\u9053\u8def \u672a\u5b9a\u4e49\u4ea4\u901a\u533a\u57df POI\u8fde\u63a5\u8def \u96a7\u9053 \u6b65\u884c\u9053 \u516c\u4ea4\u4e13\u7528\u9053 \u63d0\u524d\u53f3\u8f6c\u9053".split(" ");
    w.ia(qd, nd, "DWRoute");
    w.extend(qd.prototype, {
        search: function (a, b, c) {
            this.Ma.push({method: "search", arguments: [a, b, c]})
        }
    });
    function rd(a, b) {
        qd.call(this, a, b);
        b = b || {};
        this.k.Sc = b.enableTraffic || q;
        this.bt(b.policy);
        this.ed = cd;
        this.St = jd;
        this.Tt = $c
    }

    w.ia(rd, qd, "DrivingRoute");
    rd.prototype.bt = function (a) {
        this.k.Oc = 0 <= a && 2 >= a ? a : 0
    };
    function td(a, b) {
        qd.call(this, a, b);
        this.ed = dd;
        this.St = kd;
        this.Tt = Zc;
        this.hz = q
    }

    w.ia(td, qd, "WalkingRoute");
    function ud(a, b) {
        w.lang.ra.call(this);
        this.Df = [];
        this.tm = [];
        this.k = b;
        this.Sb = a;
        this.map = this.k.aa.map || p;
        this.Cx = this.k.Cx;
        this.kb = p;
        this.Mi = 0;
        this.Qx = "";
        this.Ld = 1;
        this.qw = "";
        this.Uo = [0, 0, 0, 0, 0, 0, 0];
        this.KD = [];
        this.Cr = [1, 1, 1, 1, 1, 1, 1];
        this.iN = [1, 1, 1, 1, 1, 1, 1];
        this.Ss = [0, 0, 0, 0, 0, 0, 0];
        this.Vo = [0, 0, 0, 0, 0, 0, 0];
        this.Ca = [{o: "", vf: 0, Lm: 0, x: 0, y: 0, nc: -1}, {o: "", vf: 0, Lm: 0, x: 0, y: 0, nc: -1}, {
            o: "",
            vf: 0,
            Lm: 0,
            x: 0,
            y: 0,
            nc: -1
        }, {o: "", vf: 0, Lm: 0, x: 0, y: 0, nc: -1}, {o: "", vf: 0, Lm: 0, x: 0, y: 0, nc: -1}, {
            o: "",
            vf: 0,
            Lm: 0,
            x: 0,
            y: 0,
            nc: -1
        }, {o: "", vf: 0, Lm: 0, x: 0, y: 0, nc: -1}];
        this.Lh = -1;
        this.yt = [];
        this.zt = [];
        J.load("route", s())
    }

    w.lang.ia(ud, w.lang.ra, "RouteAddr");
    var vd = navigator.userAgent;
    /ipad|iphone|ipod|iph/i.test(vd);
    var wd = /android/i.test(vd);

    function xd(a) {
        this.Wg = a || {}
    }

    w.extend(xd.prototype, {
        xM: function (a, b, c) {
            var d = this;
            J.load("route", function () {
                d.zd(a, b, c)
            })
        }
    });
    function yd(a) {
        this.k = {};
        w.extend(this.k, a);
        this.Ma = [];
        var b = this;
        J.load("othersearch", function () {
            b.zd()
        })
    }

    w.ia(yd, w.lang.ra, "Geocoder");
    w.extend(yd.prototype, {
        Ul: function (a, b, c) {
            this.Ma.push({method: "getPoint", arguments: [a, b, c]})
        }, es: function (a, b, c) {
            this.Ma.push({method: "getLocation", arguments: [a, b, c]})
        }, toString: da("Geocoder")
    });
    var zd = yd.prototype;
    U(zd, {getPoint: zd.Ul, getLocation: zd.es});
    function Geolocation(a) {
        a = a || {};
        this.D = {timeout: a.timeout || 1E4, maximumAge: a.maximumAge || 6E5};
        this.Zd = [];
        var b = this;
        J.load("othersearch", function () {
            for (var a = 0, d; d = b.Zd[a]; a++)b[d.method].apply(b, d.arguments)
        })
    }

    w.extend(Geolocation.prototype, {
        getCurrentPosition: function (a, b) {
            this.Zd.push({method: "getCurrentPosition", arguments: arguments})
        }, getStatus: da(2)
    });
    function Ad(a) {
        a = a || {};
        a.aa = a.renderOptions || {};
        this.k = {aa: {map: a.aa.map || p}};
        this.Ma = [];
        var b = this;
        J.load("othersearch", function () {
            b.zd()
        })
    }

    w.ia(Ad, w.lang.ra, "LocalCity");
    w.extend(Ad.prototype, {
        get: function (a) {
            this.Ma.push({method: "get", arguments: [a]})
        }, toString: da("LocalCity")
    });
    function Bd() {
        this.Ma = [];
        var a = this;
        J.load("othersearch", function () {
            a.zd()
        })
    }

    w.ia(Bd, w.lang.ra, "Boundary");
    w.extend(Bd.prototype, {
        get: function (a, b) {
            this.Ma.push({method: "get", arguments: [a, b]})
        }, toString: da("Boundary")
    });
    function Cd(a, b) {
        T.call(this, a, b);
        this.hO = ed;
        this.jO = hd;
        this.gO = fd;
        this.iO = id;
        this.Ma = [];
        var c = this;
        J.load("buslinesearch", function () {
            c.zd()
        })
    }

    Cd.Eu = F.ea + "iw_plus.gif";
    Cd.bR = F.ea + "iw_minus.gif";
    Cd.US = F.ea + "stop_icon.png";
    w.ia(Cd, T);
    w.extend(Cd.prototype, {
        getBusList: function (a) {
            this.Ma.push({method: "getBusList", arguments: [a]})
        }, getBusLine: function (a) {
            this.Ma.push({method: "getBusLine", arguments: [a]})
        }, setGetBusListCompleteCallback: function (a) {
            this.k.TL = a || s()
        }, setGetBusLineCompleteCallback: function (a) {
            this.k.SL = a || s()
        }, setBusListHtmlSetCallback: function (a) {
            this.k.QL = a || s()
        }, setBusLineHtmlSetCallback: function (a) {
            this.k.PL = a || s()
        }, setPolylinesSetCallback: function (a) {
            this.k.VD = a || s()
        }
    });
    function Dd(a) {
        T.call(this, a);
        a = a || {};
        this.oc = {input: a.input || p, eB: a.baseDom || p, types: a.types || [], lx: a.onSearchComplete || s()};
        this.hd.src = a.location || "\u5168\u56fd";
        this.Ii = "";
        this.Wf = p;
        this.XG = "";
        this.vi();
        Pa(Ja);
        var b = this;
        J.load("autocomplete", function () {
            b.zd()
        })
    }

    w.ia(Dd, T, "Autocomplete");
    w.extend(Dd.prototype, {
        vi: s(), show: s(), J: s(), CE: function (a) {
            this.oc.types = a
        }, Dm: function (a) {
            this.hd.src = a
        }, search: ba("Ii"), Fx: ba("XG")
    });
    var Ra;

    function Na(a, b) {
        this.A = "string" == typeof a ? w.N(a) : a;
        this.k = {
            enableScrollWheelZoom: o,
            panoramaRenderer: "flash",
            swfSrc: z.dg("main_domain_nocdn", "res/swf/") + "APILoader.swf",
            visible: o,
            linksControl: o,
            clickOnRoad: o,
            navigationControl: o,
            closeControl: o,
            indoorSceneSwitchControl: o,
            albumsControl: q,
            albumsControlOptions: {},
            copyrightControlOptions: {}
        };
        var b = b || {}, c;
        for (c in b)this.k[c] = b[c];
        this.za = {heading: 0, pitch: 0};
        this.wn = [];
        this.wb = this.Na = p;
        this.Wq = this.yj();
        this.ja = [];
        this.yc = 1;
        this.nf = this.yR = this.Fk = "";
        this.re = {};
        this.sf = p;
        this.xg = [];
        this.Mq = [];
        this.Qq = q;
        var d = this;
        "flashRender" === this.yj() ? J.load("panoramaflash", function () {
            d.vi()
        }, o) : J.load("panorama", function () {
            d.qb()
        }, o);
        this.cS(this.A);
        "api" == b.yf ? Pa(Fa) : Pa(Ga);
        this.addEventListener("id_changed", function () {
            Pa(Ea, {from: b.yf})
        })
    }

    var Ed = 4, Fd = 1;
    w.lang.ia(Na, w.lang.ra, "Panorama");
    w.extend(Na.prototype, {
        cS: function (a) {
            var b, c;
            b = a.style;
            c = Ta(a).position;
            "absolute" != c && "relative" != c && (b.position = "relative", b.zIndex = 0);
            if ("absolute" === c || "relative" === c)if (a = Ta(a).zIndex, !a || "auto" === a)b.zIndex = 0
        },
        zV: u("wn"),
        Kb: u("Na"),
        aW: u("mv"),
        MM: u("mv"),
        V: u("wb"),
        sa: u("za"),
        U: u("yc"),
        Kg: u("Fk"),
        D0: function () {
            return this.j_ || []
        },
        z0: u("yR"),
        ks: u("nf"),
        Hx: function (a) {
            a !== this.nf && (this.nf = a, this.dispatchEvent(new M("onscene_type_changed")))
        },
        pc: function (a, b, c) {
            "object" === typeof b && (c = b, b = j);
            a != this.Na && (this.Qk = this.Na, this.Rk = this.wb, this.Na = a, this.nf = b || "street", this.wb = p, c && c.pov && this.sd(c.pov))
        },
        ha: function (a) {
            a.$a(this.wb) || (this.Qk = this.Na, this.Rk = this.wb, this.wb = a, this.Na = p)
        },
        sd: function (a) {
            a && (this.za = a, a = this.za.pitch, "cvsRender" == this.yj() || Gd() ? (90 < a && (a = 90), -90 > a && (a = -90)) : "cssRender" == this.yj() && (45 < a && (a = 45), -45 > a && (a = -45)), this.Qq = o, this.za.pitch = a)
        },
        Bc: function (a) {
            a != this.yc && (a > Ed && (a = Ed), a < Fd && (a = Fd), a != this.yc && (this.yc = a))
        },
        EA: function () {
            if (this.C)for (var a = this.C.aD(), b = 0; b < a.length; b++)(a[b]instanceof R || a[b]instanceof pc) && a[b].point && this.ja.push(a[b])
        },
        yE: ba("C"),
        at: function (a) {
            this.sf = a || "none"
        },
        dp: function (a) {
            for (var b in a) {
                if ("object" == typeof a[b])for (var c in a[b])this.k[b][c] = a[b][c]; else this.k[b] = a[b];
                switch (b) {
                    case "linksControl":
                        this.dispatchEvent(new M("onlinks_visible_changed"));
                        break;
                    case "clickOnRoad":
                        this.dispatchEvent(new M("onclickonroad_changed"));
                        break;
                    case "navigationControl":
                        this.dispatchEvent(new M("onnavigation_visible_changed"));
                        break;
                    case "indoorSceneSwitchControl":
                        this.dispatchEvent(new M("onindoor_default_switch_mode_changed"));
                        break;
                    case "albumsControl":
                        this.dispatchEvent(new M("onalbums_visible_changed"));
                        break;
                    case "albumsControlOptions":
                        this.dispatchEvent(new M("onalbums_options_changed"));
                        break;
                    case "copyrightControlOptions":
                        this.dispatchEvent(new M("oncopyright_options_changed"))
                }
            }
        },
        ek: function () {
            this.Zk.style.visibility = "hidden"
        },
        Lx: function () {
            this.Zk.style.visibility = "visible"
        },
        QU: function () {
            this.k.enableScrollWheelZoom = o
        },
        BU: function () {
            this.k.enableScrollWheelZoom = q
        },
        show: function () {
            this.k.visible = o
        },
        J: function () {
            this.k.visible = q
        },
        yj: function () {
            return Sa() && !G() && "javascript" != this.k.panoramaRenderer ? "flashRender" : !G() && Mb() ? "cvsRender" : "cssRender"
        },
        ya: function (a) {
            this.re[a.Uc] = a
        },
        Gb: function (a) {
            delete this.re[a]
        },
        yK: function () {
            return this.k.visible
        },
        Oh: function () {
            return new L(this.A.clientWidth, this.A.clientHeight)
        },
        Ea: u("A"),
        ZJ: function () {
            var a = z.dg("baidumap", "?"), b = this.Kb();
            if (b) {
                var b = {
                    panotype: this.ks(),
                    heading: this.sa().heading,
                    pitch: this.sa().pitch,
                    pid: b,
                    panoid: b,
                    from: "api"
                }, c;
                for (c in b)a += c + "=" + b[c] + "&"
            }
            return a.slice(0, -1)
        },
        Mw: function () {
            this.dp({copyrightControlOptions: {logoVisible: q}})
        },
        FE: function () {
            this.dp({copyrightControlOptions: {logoVisible: o}})
        },
        ZA: function (a) {
            function b(a, b) {
                return function () {
                    a.Mq.push({CL: b, BL: arguments})
                }
            }

            for (var c = a.getPanoMethodList(), d = "", e = 0, f = c.length; e < f; e++)d = c[e], this[d] = b(this, d);
            this.xg.push(a)
        },
        kE: function (a) {
            for (var b = this.xg.length; b--;)this.xg[b] === a && this.xg.splice(b, 1)
        }
    });
    var Hd = Na.prototype;
    U(Hd, {
        setId: Hd.pc,
        setPosition: Hd.ha,
        setPov: Hd.sd,
        setZoom: Hd.Bc,
        setOptions: Hd.dp,
        getId: Hd.Kb,
        getPosition: Hd.V,
        getPov: Hd.sa,
        getZoom: Hd.U,
        getLinks: Hd.zV,
        getBaiduMapUrl: Hd.ZJ,
        hideMapLogo: Hd.Mw,
        showMapLogo: Hd.FE,
        enableDoubleClickZoom: Hd.c0,
        disableDoubleClickZoom: Hd.S_,
        enableScrollWheelZoom: Hd.QU,
        disableScrollWheelZoom: Hd.BU,
        show: Hd.show,
        hide: Hd.J,
        addPlugin: Hd.ZA,
        removePlugin: Hd.kE,
        getVisible: Hd.yK,
        addOverlay: Hd.ya,
        removeOverlay: Hd.Gb,
        getSceneType: Hd.ks,
        setPanoramaPOIType: Hd.at
    });
    U(window, {
        BMAP_PANORAMA_POI_HOTEL: "hotel",
        BMAP_PANORAMA_POI_CATERING: "catering",
        BMAP_PANORAMA_POI_MOVIE: "movie",
        BMAP_PANORAMA_POI_TRANSIT: "transit",
        BMAP_PANORAMA_POI_INDOOR_SCENE: "indoor_scene",
        BMAP_PANORAMA_POI_NONE: "none",
        BMAP_PANORAMA_INDOOR_SCENE: "inter",
        BMAP_PANORAMA_STREET_SCENE: "street"
    });
    function Id() {
        w.lang.ra.call(this);
        this.Uc = "PanoramaOverlay_" + this.Q;
        this.G = p;
        this.Da = o
    }

    w.lang.ia(Id, w.lang.ra, "PanoramaOverlayBase");
    w.extend(Id.prototype, {
        A0: u("Uc"), fa: function () {
            aa("initialize\u65b9\u6cd5\u672a\u5b9e\u73b0")
        }, remove: function () {
            aa("remove\u65b9\u6cd5\u672a\u5b9e\u73b0")
        }, rf: function () {
            aa("_setOverlayProperty\u65b9\u6cd5\u672a\u5b9e\u73b0")
        }
    });
    function Jd(a, b) {
        Id.call(this);
        var c = {position: p, altitude: 2, displayDistance: o}, b = b || {}, d;
        for (d in b)c[d] = b[d];
        this.wb = c.position;
        this.sj = a;
        this.Lp = c.altitude;
        this.IP = c.displayDistance
    }

    w.lang.ia(Jd, Id, "PanoramaLabel");
    w.extend(Jd.prototype, {
        ha: function (a) {
            this.wb = a;
            this.rf("position", a)
        }, V: u("wb"), Pc: function (a) {
            this.sj = a;
            this.rf("content", a)
        }, Yj: u("sj"), uE: function (a) {
            this.Lp = a;
            this.rf("altitude", a)
        }, no: u("Lp"), sa: function () {
            var a = this.V(), b = p, c = p;
            this.G && (c = this.G.V());
            if (a && c)if (a.$a(c))b = this.G.sa(); else {
                b = {};
                b.heading = Kd(a.lng - c.lng, a.lat - c.lat) || 0;
                var a = b, c = this.no(), d = this.nn();
                a.pitch = Math.round(180 * (Math.atan(c / d) / Math.PI)) || 0
            }
            return b
        }, nn: function () {
            var a = 0, b, c;
            this.G && (b = this.G.V(), (c = this.V()) && !c.$a(b) && (a = Q.po(b, c)));
            return a
        }, J: function () {
            aa("hide\u65b9\u6cd5\u672a\u5b9e\u73b0")
        }, show: function () {
            aa("show\u65b9\u6cd5\u672a\u5b9e\u73b0")
        }, rf: s()
    });
    var Ld = Jd.prototype;
    U(Ld, {
        setPosition: Ld.ha,
        getPosition: Ld.V,
        setContent: Ld.Pc,
        getContent: Ld.Yj,
        setAltitude: Ld.uE,
        getAltitude: Ld.no,
        getPov: Ld.sa,
        show: Ld.show,
        hide: Ld.J
    });
    function Md(a, b) {
        Id.call(this);
        var c = {icon: "", title: "", panoInfo: p, altitude: 2}, b = b || {}, d;
        for (d in b)c[d] = b[d];
        this.wb = a;
        this.SG = c.icon;
        this.jI = c.title;
        this.Lp = c.altitude;
        this.PR = c.panoInfo;
        this.za = {heading: 0, pitch: 0}
    }

    w.lang.ia(Md, Id, "PanoramaMarker");
    w.extend(Md.prototype, {
        ha: function (a) {
            this.wb = a;
            this.rf("position", a)
        }, V: u("wb"), qc: function (a) {
            this.jI = a;
            this.rf("title", a)
        }, yo: u("jI"), Ob: function (a) {
            this.SG = icon;
            this.rf("icon", a)
        }, qo: u("SG"), uE: function (a) {
            this.Lp = a;
            this.rf("altitude", a)
        }, no: u("Lp"), bD: u("PR"), sa: function () {
            var a = p;
            if (this.G) {
                var a = this.G.V(), b = this.V(), a = Kd(b.lng - a.lng, b.lat - a.lat);
                isNaN(a) && (a = 0);
                a = {heading: a, pitch: 0}
            } else a = this.za;
            return a
        }, rf: s()
    });
    var Nd = Md.prototype;
    U(Nd, {
        setPosition: Nd.ha,
        getPosition: Nd.V,
        setTitle: Nd.qc,
        getTitle: Nd.yo,
        setAltitude: Nd.uE,
        getAltitude: Nd.no,
        getPanoInfo: Nd.bD,
        getIcon: Nd.qo,
        setIcon: Nd.Ob,
        getPov: Nd.sa
    });
    function Kd(a, b) {
        var c = 0;
        if (0 !== a && 0 !== b) {
            var c = 180 * (Math.atan(a / b) / Math.PI), d = 0;
            0 < a && 0 > b && (d = 90);
            0 > a && 0 > b && (d = 180);
            0 > a && 0 < b && (d = 270);
            c = (c + 90) % 90 + d
        } else 0 === a ? c = 0 > b ? 180 : 0 : 0 === b && (c = 0 < a ? 90 : 270);
        return Math.round(c)
    }

    function Gd() {
        if ("boolean" === typeof Od)return Od;
        if (!window.WebGLRenderingContext || w.platform.fm && -1 == navigator.userAgent.indexOf("Android 5"))return Od = q;
        var a = document.createElement("canvas"), b = p;
        try {
            b = a.getContext("webgl")
        } catch (c) {
            Od = q
        }
        return Od = b === p ? q : o
    }

    var Od;

    function ac(a, b) {
        this.G = a || p;
        var c = this;
        c.G && c.P();
        J.load("pservice", function () {
            c.aP()
        });
        "api" == (b || {}).yf ? Pa(Ha) : Pa(Ia);
        this.fd = {
            getPanoramaById: [],
            getPanoramaByLocation: [],
            getVisiblePOIs: [],
            getRecommendPanosById: [],
            getPanoramaVersions: [],
            checkPanoSupportByCityCode: [],
            getPanoramaByPOIId: [],
            getCopyrightProviders: []
        }
    }

    z.sm(function (a) {
        "flashRender" !== a.yj() && new ac(a, {yf: "api"})
    });
    w.extend(ac.prototype, {
        P: function () {
            function a(a) {
                if (a) {
                    if (a.id != b.mv) {
                        b.MM(a.id);
                        b.R = a;
                        b.Na != p && (b.Rk = b._position);
                        for (var c in a)if (a.hasOwnProperty(c))switch (b["_" + c] = a[c], c) {
                            case "position":
                                b.wb = a[c];
                                break;
                            case "id":
                                b.Na = a[c];
                                break;
                            case "links":
                                b.wn = a[c];
                                break;
                            case "zoom":
                                b.yc = a[c]
                        }
                        if (b.Rk) {
                            var f = b.Rk, g = b._position;
                            c = f.lat;
                            var i = g.lat, k = Nb(i - c), f = Nb(g.lng - f.lng);
                            c = Math.sin(k / 2) * Math.sin(k / 2) + Math.cos(Nb(c)) * Math.cos(Nb(i)) * Math.sin(f / 2) * Math.sin(f / 2);
                            b.gG = 6371E3 * 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
                        }
                        c = new M("ondataload");
                        c.data = a;
                        b.dispatchEvent(c);
                        b.dispatchEvent(new M("onposition_changed"));
                        b.dispatchEvent(new M("onlinks_changed"));
                        b.dispatchEvent(new M("oncopyright_changed"), {copyright: a.copyright});
                        a.Bl && b.k.closeControl ? w.B.show(b.su) : w.B.J(b.su)
                    }
                } else b.Na = b.Qk, b.wb = b.Rk, b.dispatchEvent(new M("onnoresult"))
            }

            var b = this.G, c = this;
            b.addEventListener("id_changed", function () {
                c.uo(b.Kb(), a)
            });
            b.addEventListener("iid_changed", function () {
                c.Bh(ac.Tm + "qt=idata&iid=" + b.Dz + "&fn=", function (b) {
                    if (b && b.result && 0 == b.result.error) {
                        var b = b.content[0].interinfo, e = {};
                        e.Bl = b.BreakID;
                        for (var f = b.Defaultfloor, g = p, i = 0; i < b.Floors.length; i++)if (b.Floors[i].Floor == f) {
                            g = b.Floors[i];
                            break
                        }
                        e.id = g.StartID || g.Points[0].PID;
                        c.uo(e.id, a, e)
                    }
                })
            });
            b.addEventListener("position_changed_inner", function () {
                c.Wi(b.V(), a)
            })
        }, uo: function (a, b) {
            this.fd.getPanoramaById.push(arguments)
        }, Wi: function (a, b, c) {
            this.fd.getPanoramaByLocation.push(arguments)
        }, jD: function (a, b, c, d) {
            this.fd.getVisiblePOIs.push(arguments)
        }, Hw: function (a, b) {
            this.fd.getRecommendPanosById.push(arguments)
        }, Gw: function (a) {
            this.fd.getPanoramaVersions.push(arguments)
        }, nB: function (a, b) {
            this.fd.checkPanoSupportByCityCode.push(arguments)
        }, Fw: function (a, b) {
            this.fd.getPanoramaByPOIId.push(arguments)
        }, dK: function (a) {
            this.fd.getCopyrightProviders.push(arguments)
        }
    });
    var Pd = ac.prototype;
    U(Pd, {getPanoramaById: Pd.uo, getPanoramaByLocation: Pd.Wi, getPanoramaByPOIId: Pd.Fw});
    function $b(a) {
        Cc.call(this);
        "api" == (a || {}).yf ? Pa(Ba) : Pa(Da)
    }

    $b.BF = z.dg("pano", "tile/");
    $b.prototype = new Cc;
    $b.prototype.getTilesUrl = function (a, b) {
        var c = $b.BF[(a.x + a.y) % $b.BF.length] + "?udt=20150114&qt=tile&styles=pl&x=" + a.x + "&y=" + a.y + "&z=" + b;
        w.S.ba && 6 >= w.S.ba && (c += "&color_dep=32");
        return c
    };
    $b.prototype.Cs = da(o);
    Qd.Ed = new Q;
    function Qd() {
    }

    w.extend(Qd, {
        CU: function (a, b, c) {
            c = w.lang.Nd(c);
            b = {data: b};
            "position_changed" == a && (b.data = Qd.Ed.ai(new P(b.data.mercatorX, b.data.mercatorY)));
            c.dispatchEvent(new M("on" + a), b)
        }
    });
    var Rd = Qd;
    U(Rd, {dispatchFlashEvent: Rd.CU});
    var Sd = {$N: 50};
    Sd.Ut = z.dg("pano")[0];
    Sd.Qt = {width: 220, height: 60};
    w.extend(Sd, {
        Fo: function (a, b, c, d) {
            if (!b || !c || !c.lngLat || !c.panoInstance)d(); else {
                this.Bn === j && (this.Bn = new ac(p, {yf: "api"}));
                var e = this;
                this.Bn.nB(b, function (b) {
                    b ? e.Bn.Wi(c.lngLat, Sd.$N, function (b) {
                        if (b && b.id) {
                            var f = b.id, k = b.Xg, b = b.Yg, l = ac.Ed.Qg(c.lngLat), m = e.FQ(l, {
                                x: k,
                                y: b
                            }), k = e.mK(f, m, 0, Sd.Qt.width, Sd.Qt.height);
                            a.content = e.GQ(a.content, k, c.titleTip, c.beforeDomId);
                            a.addEventListener("open", function () {
                                ia.F(w.rc("infoWndPano"), "click", function () {
                                    c.panoInstance.pc(f);
                                    c.panoInstance.show();
                                    c.panoInstance.sd({heading: m, pitch: 0})
                                })
                            })
                        }
                        d()
                    }) : d()
                })
            }
        }, GQ: function (a, b, c, d) {
            var c = c || "", e;
            !d || !a.split(d)[0] ? (d = a, a = "") : (d = a.split(d)[0], e = d.lastIndexOf("<"), d = a.substring(0, e), a = a.substring(e));
            e = [];
            var f = Sd.Qt.width, g = Sd.Qt.height;
            e.push(d);
            e.push("<div id='infoWndPano' class='panoInfoBox' style='height:" + g + "px;width:" + f + "px; margin-top: -19px;'>");
            e.push("<img class='pano_thumnail_img' width='" + f + "' height='" + g + "' border='0' alt='" + c + "\u5916\u666f' title='" + c + "\u5916\u666f' src='" + b + "' onerror='Pano.PanoEntranceUtil.thumbnailNotFound(this, " + f + ", " + g + ");' />");
            e.push("<div class='panoInfoBoxTitleBg' style='width:" + f + "px;'></div><a href='javascript:void(0)' class='panoInfoBoxTitleContent' >\u8fdb\u5165\u5168\u666f&gt;&gt;</a>");
            e.push("</div>");
            e.push(a);
            return e.join("")
        }, FQ: function (a, b) {
            var c = 90 - 180 * Math.atan2(a.y - b.y, a.x - b.x) / Math.PI;
            0 > c && (c += 360);
            return c
        }, mK: function (a, b, c, d, e) {
            var f = {panoId: a, panoHeading: b || 0, panoPitch: c || 0, width: d, height: e};
            return (Sd.Ut + "?qt=pr3d&fovy=75&quality=80&panoid={panoId}&heading={panoHeading}&pitch={panoPitch}&width={width}&height={height}").replace(/\{(.*?)\}/g, function (a, b) {
                return f[b]
            })
        }
    });
    var Td = document, Ud = Math, Vd = Td.createElement("div").style, Wd;
    a:{
        for (var Xd = ["t", "webkitT", "MozT", "msT", "OT"], $d, ae = 0, be = Xd.length; ae < be; ae++)if ($d = Xd[ae] + "ransform", $d in Vd) {
            Wd = Xd[ae].substr(0, Xd[ae].length - 1);
            break a
        }
        Wd = q
    }
    var ce = Wd ? "-" + Wd.toLowerCase() + "-" : "", ee = de("transform"), fe = de("transitionProperty"), ge = de("transitionDuration"), he = de("transformOrigin"), ie = de("transitionTimingFunction"), je = de("transitionDelay"), wd = /android/gi.test(navigator.appVersion), ke = /iphone|ipad/gi.test(navigator.appVersion), le = /hp-tablet/gi.test(navigator.appVersion), ne = de("perspective")in Vd, oe = "ontouchstart"in window && !le, pe = Wd !== q, qe = de("transition")in Vd, re = "onorientationchange"in window ? "orientationchange" : "resize", se = oe ? "touchstart" : "mousedown", te = oe ? "touchmove" : "mousemove", ue = oe ? "touchend" : "mouseup", ve = oe ? "touchcancel" : "mouseup", we = Wd === q ? q : {
        "": "transitionend",
        webkit: "webkitTransitionEnd",
        Moz: "transitionend",
        O: "otransitionend",
        ms: "MSTransitionEnd"
    }[Wd], xe = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (a) {
            return setTimeout(a, 1)
        }, ye = window.cancelRequestAnimationFrame || window.z2 || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.oCancelRequestAnimationFrame || window.msCancelRequestAnimationFrame || clearTimeout, ze = ne ? " translateZ(0)" : "";

    function Ae(a, b) {
        var c = this, d;
        c.Nm = "object" == typeof a ? a : Td.getElementById(a);
        c.Nm.style.overflow = "hidden";
        c.Bb = c.Nm.children[0];
        c.options = {
            Co: o,
            op: o,
            x: 0,
            y: 0,
            vr: o,
            JT: q,
            SD: o,
            tL: o,
            wk: o,
            fi: q,
            WY: 0,
            mB: q,
            mD: o,
            $i: o,
            jj: o,
            CC: wd,
            Nw: ke,
            VU: ke && ne,
            rE: "",
            zoom: q,
            xk: 1,
            rp: 4,
            EU: 2,
            FN: "scroll",
            kt: q,
            Ox: 1,
            WL: p,
            OL: function (a) {
                a.preventDefault()
            },
            ZL: p,
            NL: p,
            YL: p,
            ML: p,
            kx: p,
            $L: p,
            RL: p,
            Oo: p,
            aM: p,
            No: p
        };
        for (d in b)c.options[d] = b[d];
        c.x = c.options.x;
        c.y = c.options.y;
        c.options.wk = pe && c.options.wk;
        c.options.$i = c.options.Co && c.options.$i;
        c.options.jj = c.options.op && c.options.jj;
        c.options.zoom = c.options.wk && c.options.zoom;
        c.options.fi = qe && c.options.fi;
        c.options.zoom && wd && (ze = "");
        c.Bb.style[fe] = c.options.wk ? ce + "transform" : "top left";
        c.Bb.style[ge] = "0";
        c.Bb.style[he] = "0 0";
        c.options.fi && (c.Bb.style[ie] = "cubic-bezier(0.33,0.66,0.66,1)");
        c.options.wk ? c.Bb.style[ee] = "translate(" + c.x + "px," + c.y + "px)" + ze : c.Bb.style.cssText += ";position:absolute;top:" + c.y + "px;left:" + c.x + "px";
        c.options.fi && (c.options.CC = o);
        c.refresh();
        c.P(re, window);
        c.P(se);
        !oe && "none" != c.options.FN && (c.P("DOMMouseScroll"), c.P("mousewheel"));
        c.options.mB && (c.RT = setInterval(function () {
            c.ZO()
        }, 500));
        this.options.mD && (Event.prototype.stopImmediatePropagation || (document.body.removeEventListener = function (a, b, c) {
            var d = Node.prototype.removeEventListener;
            a === "click" ? d.call(document.body, a, b.GK || b, c) : d.call(document.body, a, b, c)
        }, document.body.addEventListener = function (a, b, c) {
            var d = Node.prototype.addEventListener;
            a === "click" ? d.call(document.body, a, b.GK || (b.GK = function (a) {
                    a.DX || b(a)
                }), c) : d.call(document.body, a, b, c)
        }), c.P("click", document.body, o))
    }

    Ae.prototype = {
        enabled: o,
        x: 0,
        y: 0,
        ij: [],
        scale: 1,
        IB: 0,
        JB: 0,
        De: [],
        $e: [],
        dB: p,
        Zx: 0,
        handleEvent: function (a) {
            switch (a.type) {
                case se:
                    if (!oe && 0 !== a.button)break;
                    this.fv(a);
                    break;
                case te:
                    this.AR(a);
                    break;
                case ue:
                case ve:
                    this.ru(a);
                    break;
                case re:
                    this.xA();
                    break;
                case "DOMMouseScroll":
                case "mousewheel":
                    this.eT(a);
                    break;
                case we:
                    this.aT(a);
                    break;
                case "click":
                    this.iP(a)
            }
        },
        ZO: function () {
            !this.Ug && (!this.yk && !(this.wl || this.Ex == this.Bb.offsetWidth * this.scale && this.Zo == this.Bb.offsetHeight * this.scale)) && this.refresh()
        },
        Wu: function (a) {
            var b;
            this[a + "Scrollbar"] ? (this[a + "ScrollbarWrapper"] || (b = Td.createElement("div"), this.options.rE ? b.className = this.options.rE + a.toUpperCase() : b.style.cssText = "position:absolute;z-index:100;" + ("h" == a ? "height:7px;bottom:1px;left:2px;right:" + (this.jj ? "7" : "2") + "px" : "width:7px;bottom:" + (this.$i ? "7" : "2") + "px;top:2px;right:1px"), b.style.cssText += ";pointer-events:none;" + ce + "transition-property:opacity;" + ce + "transition-duration:" + (this.options.VU ? "350ms" : "0") + ";overflow:hidden;opacity:" + (this.options.Nw ? "0" : "1"), this.Nm.appendChild(b), this[a + "ScrollbarWrapper"] = b, b = Td.createElement("div"), this.options.rE || (b.style.cssText = "position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);" + ce + "background-clip:padding-box;" + ce + "box-sizing:border-box;" + ("h" == a ? "height:100%" : "width:100%") + ";" + ce + "border-radius:3px;border-radius:3px"), b.style.cssText += ";pointer-events:none;" + ce + "transition-property:" + ce + "transform;" + ce + "transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);" + ce + "transition-duration:0;" + ce + "transform: translate(0,0)" + ze, this.options.fi && (b.style.cssText += ";" + ce + "transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)"), this[a + "ScrollbarWrapper"].appendChild(b), this[a + "ScrollbarIndicator"] = b), "h" == a ? (this.BK = this.CK.clientWidth, this.jW = Ud.max(Ud.round(this.BK * this.BK / this.Ex), 8), this.iW.style.width = this.jW + "px") : (this.xN = this.yN.clientHeight, this.qZ = Ud.max(Ud.round(this.xN * this.xN / this.Zo), 8), this.pZ.style.height = this.qZ + "px"), this.yA(a, o)) : this[a + "ScrollbarWrapper"] && (pe && (this[a + "ScrollbarIndicator"].style[ee] = ""), this[a + "ScrollbarWrapper"].parentNode.removeChild(this[a + "ScrollbarWrapper"]), this[a + "ScrollbarWrapper"] = p, this[a + "ScrollbarIndicator"] = p)
        },
        xA: function () {
            var a = this;
            setTimeout(function () {
                a.refresh()
            }, wd ? 200 : 0)
        },
        Pq: function (a, b) {
            this.yk || (a = this.Co ? a : 0, b = this.op ? b : 0, this.options.wk ? this.Bb.style[ee] = "translate(" + a + "px," + b + "px) scale(" + this.scale + ")" + ze : (a = Ud.round(a), b = Ud.round(b), this.Bb.style.left = a + "px", this.Bb.style.top = b + "px"), this.x = a, this.y = b, this.yA("h"), this.yA("v"))
        },
        yA: function (a, b) {
            var c = "h" == a ? this.x : this.y;
            this[a + "Scrollbar"] && (c *= this[a + "ScrollbarProp"], 0 > c ? (this.options.CC || (c = this[a + "ScrollbarIndicatorSize"] + Ud.round(3 * c), 8 > c && (c = 8), this[a + "ScrollbarIndicator"].style["h" == a ? "width" : "height"] = c + "px"), c = 0) : c > this[a + "ScrollbarMaxScroll"] && (this.options.CC ? c = this[a + "ScrollbarMaxScroll"] : (c = this[a + "ScrollbarIndicatorSize"] - Ud.round(3 * (c - this[a + "ScrollbarMaxScroll"])), 8 > c && (c = 8), this[a + "ScrollbarIndicator"].style["h" == a ? "width" : "height"] = c + "px", c = this[a + "ScrollbarMaxScroll"] + (this[a + "ScrollbarIndicatorSize"] - c))), this[a + "ScrollbarWrapper"].style[je] = "0", this[a + "ScrollbarWrapper"].style.opacity = b && this.options.Nw ? "0" : "1", this[a + "ScrollbarIndicator"].style[ee] = "translate(" + ("h" == a ? c + "px,0)" : "0," + c + "px)") + ze)
        },
        iP: function (a) {
            if (a.dQ === o)return this.WA = a.target, this.rw = Date.now(), o;
            if (this.WA && this.rw) {
                if (600 < Date.now() - this.rw)return this.rw = this.WA = p, o
            } else {
                for (var b = a.target; b != this.Bb && b != document.body;)b = b.parentNode;
                if (b == document.body)return o
            }
            for (b = a.target; 1 != b.nodeType;)b = b.parentNode;
            b = b.tagName.toLowerCase();
            if ("select" != b && "input" != b && "textarea" != b)return a.stopImmediatePropagation ? a.stopImmediatePropagation() : a.DX = o, a.stopPropagation(), a.preventDefault(), this.rw = this.WA = p, q
        },
        fv: function (a) {
            var b = oe ? a.touches[0] : a, c, d;
            if (this.enabled) {
                this.options.OL && this.options.OL.call(this, a);
                (this.options.fi || this.options.zoom) && this.kI(0);
                this.yk = this.wl = this.Ug = q;
                this.SB = this.RB = this.xv = this.wv = this.YB = this.XB = 0;
                this.options.zoom && (oe && 1 < a.touches.length) && (d = Ud.abs(a.touches[0].pageX - a.touches[1].pageX), c = Ud.abs(a.touches[0].pageY - a.touches[1].pageY), this.YY = Ud.sqrt(d * d + c * c), this.mx = Ud.abs(a.touches[0].pageX + a.touches[1].pageX - 2 * this.WE) / 2 - this.x, this.nx = Ud.abs(a.touches[0].pageY + a.touches[1].pageY - 2 * this.XE) / 2 - this.y, this.options.Oo && this.options.Oo.call(this, a));
                if (this.options.SD && (this.options.wk ? (c = getComputedStyle(this.Bb, p)[ee].replace(/[^0-9\-.,]/g, "").split(","), d = +(c[12] || c[4]), c = +(c[13] || c[5])) : (d = +getComputedStyle(this.Bb, p).left.replace(/[^0-9-]/g, ""), c = +getComputedStyle(this.Bb, p).top.replace(/[^0-9-]/g, "")), d != this.x || c != this.y))this.options.fi ? this.Gd(we) : ye(this.dB), this.ij = [], this.Pq(d, c), this.options.kx && this.options.kx.call(this);
                this.yv = this.x;
                this.zv = this.y;
                this.nt = this.x;
                this.ot = this.y;
                this.Xg = b.pageX;
                this.Yg = b.pageY;
                this.startTime = a.timeStamp || Date.now();
                this.options.ZL && this.options.ZL.call(this, a);
                this.P(te, window);
                this.P(ue, window);
                this.P(ve, window)
            }
        },
        AR: function (a) {
            var b = oe ? a.touches[0] : a, c = b.pageX - this.Xg, d = b.pageY - this.Yg, e = this.x + c, f = this.y + d, g = a.timeStamp || Date.now();
            this.options.NL && this.options.NL.call(this, a);
            if (this.options.zoom && oe && 1 < a.touches.length)e = Ud.abs(a.touches[0].pageX - a.touches[1].pageX), f = Ud.abs(a.touches[0].pageY - a.touches[1].pageY), this.XY = Ud.sqrt(e * e + f * f), this.yk = o, b = 1 / this.YY * this.XY * this.scale, b < this.options.xk ? b = 0.5 * this.options.xk * Math.pow(2, b / this.options.xk) : b > this.options.rp && (b = 2 * this.options.rp * Math.pow(0.5, this.options.rp / b)), this.Io = b / this.scale, e = this.mx - this.mx * this.Io + this.x, f = this.nx - this.nx * this.Io + this.y, this.Bb.style[ee] = "translate(" + e + "px," + f + "px) scale(" + b + ")" + ze, this.options.aM && this.options.aM.call(this, a); else {
                this.Xg = b.pageX;
                this.Yg = b.pageY;
                if (0 < e || e < this.Sd)e = this.options.vr ? this.x + c / 2 : 0 <= e || 0 <= this.Sd ? 0 : this.Sd;
                if (f > this.Ye || f < this.Zc)f = this.options.vr ? this.y + d / 2 : f >= this.Ye || 0 <= this.Zc ? this.Ye : this.Zc;
                this.XB += c;
                this.YB += d;
                this.wv = Ud.abs(this.XB);
                this.xv = Ud.abs(this.YB);
                6 > this.wv && 6 > this.xv || (this.options.tL && (this.wv > this.xv + 5 ? (f = this.y, d = 0) : this.xv > this.wv + 5 && (e = this.x, c = 0)), this.Ug = o, this.Pq(e, f), this.RB = 0 < c ? -1 : 0 > c ? 1 : 0, this.SB = 0 < d ? -1 : 0 > d ? 1 : 0, 300 < g - this.startTime && (this.startTime = g, this.nt = this.x, this.ot = this.y), this.options.YL && this.options.YL.call(this, a))
            }
        },
        ru: function (a) {
            if (!(oe && 0 !== a.touches.length)) {
                var b = this, c = oe ? a.changedTouches[0] : a, d, e, f = {oa: 0, time: 0}, g = {
                    oa: 0,
                    time: 0
                }, i = (a.timeStamp || Date.now()) - b.startTime;
                d = b.x;
                e = b.y;
                b.Gd(te, window);
                b.Gd(ue, window);
                b.Gd(ve, window);
                b.options.ML && b.options.ML.call(b, a);
                if (b.yk)d = b.scale * b.Io, d = Math.max(b.options.xk, d), d = Math.min(b.options.rp, d), b.Io = d / b.scale, b.scale = d, b.x = b.mx - b.mx * b.Io + b.x, b.y = b.nx - b.nx * b.Io + b.y, b.Bb.style[ge] = "200ms", b.Bb.style[ee] = "translate(" + b.x + "px," + b.y + "px) scale(" + b.scale + ")" + ze, b.yk = q, b.refresh(), b.options.No && b.options.No.call(b, a); else {
                    if (b.Ug) {
                        if (300 > i && b.options.SD) {
                            f = d ? b.iH(d - b.nt, i, -b.x, b.Ex - b.It + b.x, b.options.vr ? b.It : 0) : f;
                            g = e ? b.iH(e - b.ot, i, -b.y, 0 > b.Zc ? b.Zo - b.Om + b.y - b.Ye : 0, b.options.vr ? b.Om : 0) : g;
                            d = b.x + f.oa;
                            e = b.y + g.oa;
                            if (0 < b.x && 0 < d || b.x < b.Sd && d < b.Sd)f = {oa: 0, time: 0};
                            if (b.y > b.Ye && e > b.Ye || b.y < b.Zc && e < b.Zc)g = {oa: 0, time: 0}
                        }
                        f.oa || g.oa ? (c = Ud.max(Ud.max(f.time, g.time), 10), b.options.kt && (f = d - b.yv, g = e - b.zv, Ud.abs(f) < b.options.Ox && Ud.abs(g) < b.options.Ox ? b.scrollTo(b.yv, b.zv, 200) : (f = b.bI(d, e), d = f.x, e = f.y, c = Ud.max(f.time, c))), b.scrollTo(Ud.round(d), Ud.round(e), c)) : b.options.kt ? (f = d - b.yv, g = e - b.zv, Ud.abs(f) < b.options.Ox && Ud.abs(g) < b.options.Ox ? b.scrollTo(b.yv, b.zv, 200) : (f = b.bI(b.x, b.y), (f.x != b.x || f.y != b.y) && b.scrollTo(f.x, f.y, f.time))) : b.Dn(200)
                    } else {
                        if (oe)if (b.yJ && b.options.zoom)clearTimeout(b.yJ), b.yJ = p, b.options.Oo && b.options.Oo.call(b, a), b.zoom(b.Xg, b.Yg, 1 == b.scale ? b.options.EU : 1), b.options.No && setTimeout(function () {
                            b.options.No.call(b, a)
                        }, 200); else if (this.options.mD) {
                            for (d = c.target; 1 != d.nodeType;)d = d.parentNode;
                            e = d.tagName.toLowerCase();
                            "select" != e && "input" != e && "textarea" != e ? (e = Td.createEvent("MouseEvents"), e.initMouseEvent("click", o, o, a.view, 1, c.screenX, c.screenY, c.clientX, c.clientY, a.ctrlKey, a.altKey, a.shiftKey, a.metaKey, 0, p), e.dQ = o, d.dispatchEvent(e)) : d.focus()
                        }
                        b.Dn(400)
                    }
                    b.options.$L && b.options.$L.call(b, a)
                }
            }
        },
        Dn: function (a) {
            var b = 0 <= this.x ? 0 : this.x < this.Sd ? this.Sd : this.x, c = this.y >= this.Ye || 0 < this.Zc ? this.Ye : this.y < this.Zc ? this.Zc : this.y;
            if (b == this.x && c == this.y) {
                if (this.Ug && (this.Ug = q, this.options.kx && this.options.kx.call(this)), this.$i && this.options.Nw && ("webkit" == Wd && (this.CK.style[je] = "300ms"), this.CK.style.opacity = "0"), this.jj && this.options.Nw)"webkit" == Wd && (this.yN.style[je] = "300ms"), this.yN.style.opacity = "0"
            } else this.scrollTo(b, c, a || 0)
        },
        eT: function (a) {
            var b = this, c, d;
            if ("wheelDeltaX"in a)c = a.wheelDeltaX / 12, d = a.wheelDeltaY / 12; else if ("wheelDelta"in a)c = d = a.wheelDelta / 12; else if ("detail"in a)c = d = 3 * -a.detail; else return;
            if ("zoom" == b.options.FN) {
                if (d = b.scale * Math.pow(2, 1 / 3 * (d ? d / Math.abs(d) : 0)), d < b.options.xk && (d = b.options.xk), d > b.options.rp && (d = b.options.rp), d != b.scale)!b.Zx && b.options.Oo && b.options.Oo.call(b, a), b.Zx++, b.zoom(a.pageX, a.pageY, d, 400), setTimeout(function () {
                    b.Zx--;
                    !b.Zx && b.options.No && b.options.No.call(b, a)
                }, 400)
            } else c = b.x + c, d = b.y + d, 0 < c ? c = 0 : c < b.Sd && (c = b.Sd), d > b.Ye ? d = b.Ye : d < b.Zc && (d = b.Zc), 0 > b.Zc && b.scrollTo(c, d, 0)
        },
        aT: function (a) {
            a.target == this.Bb && (this.Gd(we), this.KA())
        },
        KA: function () {
            var a = this, b = a.x, c = a.y, d = Date.now(), e, f, g;
            a.wl || (a.ij.length ? (e = a.ij.shift(), e.x == b && e.y == c && (e.time = 0), a.wl = o, a.Ug = o, a.options.fi) ? (a.kI(e.time), a.Pq(e.x, e.y), a.wl = q, e.time ? a.P(we) : a.Dn(0)) : (g = function () {
                var i = Date.now(), k;
                if (i >= d + e.time) {
                    a.Pq(e.x, e.y);
                    a.wl = q;
                    a.options.jX && a.options.jX.call(a);
                    a.KA()
                } else {
                    i = (i - d) / e.time - 1;
                    f = Ud.sqrt(1 - i * i);
                    i = (e.x - b) * f + b;
                    k = (e.y - c) * f + c;
                    a.Pq(i, k);
                    if (a.wl)a.dB = xe(g)
                }
            }, g()) : a.Dn(400))
        },
        kI: function (a) {
            a += "ms";
            this.Bb.style[ge] = a;
            this.$i && (this.iW.style[ge] = a);
            this.jj && (this.pZ.style[ge] = a)
        },
        iH: function (a, b, c, d, e) {
            var b = Ud.abs(a) / b, f = b * b / 0.0012;
            0 < a && f > c ? (c += e / (6 / (6.0E-4 * (f / b))), b = b * c / f, f = c) : 0 > a && f > d && (d += e / (6 / (6.0E-4 * (f / b))), b = b * d / f, f = d);
            return {oa: f * (0 > a ? -1 : 1), time: Ud.round(b / 6.0E-4)}
        },
        Fj: function (a) {
            for (var b = -a.offsetLeft, c = -a.offsetTop; a = a.offsetParent;)b -= a.offsetLeft, c -= a.offsetTop;
            a != this.Nm && (b *= this.scale, c *= this.scale);
            return {left: b, top: c}
        },
        bI: function (a, b) {
            var c, d, e;
            e = this.De.length - 1;
            c = 0;
            for (d = this.De.length; c < d; c++)if (a >= this.De[c]) {
                e = c;
                break
            }
            e == this.IB && (0 < e && 0 > this.RB) && e--;
            a = this.De[e];
            d = (d = Ud.abs(a - this.De[this.IB])) ? 500 * (Ud.abs(this.x - a) / d) : 0;
            this.IB = e;
            e = this.$e.length - 1;
            for (c = 0; c < e; c++)if (b >= this.$e[c]) {
                e = c;
                break
            }
            e == this.JB && (0 < e && 0 > this.SB) && e--;
            b = this.$e[e];
            c = (c = Ud.abs(b - this.$e[this.JB])) ? 500 * (Ud.abs(this.y - b) / c) : 0;
            this.JB = e;
            e = Ud.round(Ud.max(d, c)) || 200;
            return {x: a, y: b, time: e}
        },
        P: function (a, b, c) {
            (b || this.Bb).addEventListener(a, this, !!c)
        },
        Gd: function (a, b, c) {
            (b || this.Bb).removeEventListener(a, this, !!c)
        },
        OB: ga(2),
        refresh: function () {
            var a, b, c, d = 0;
            b = 0;
            this.scale < this.options.xk && (this.scale = this.options.xk);
            this.It = this.Nm.clientWidth || 1;
            this.Om = this.Nm.clientHeight || 1;
            this.Ye = -this.options.WY || 0;
            this.Ex = Ud.round(this.Bb.offsetWidth * this.scale);
            this.Zo = Ud.round((this.Bb.offsetHeight + this.Ye) * this.scale);
            this.Sd = this.It - this.Ex;
            this.Zc = this.Om - this.Zo + this.Ye;
            this.SB = this.RB = 0;
            this.options.WL && this.options.WL.call(this);
            this.Co = this.options.Co && 0 > this.Sd;
            this.op = this.options.op && (!this.options.JT && !this.Co || this.Zo > this.Om);
            this.$i = this.Co && this.options.$i;
            this.jj = this.op && this.options.jj && this.Zo > this.Om;
            a = this.Fj(this.Nm);
            this.WE = -a.left;
            this.XE = -a.top;
            if ("string" == typeof this.options.kt) {
                this.De = [];
                this.$e = [];
                c = this.Bb.querySelectorAll(this.options.kt);
                a = 0;
                for (b = c.length; a < b; a++)d = this.Fj(c[a]), d.left += this.WE, d.top += this.XE, this.De[a] = d.left < this.Sd ? this.Sd : d.left * this.scale, this.$e[a] = d.top < this.Zc ? this.Zc : d.top * this.scale
            } else if (this.options.kt) {
                for (this.De = []; d >= this.Sd;)this.De[b] = d, d -= this.It, b++;
                this.Sd % this.It && (this.De[this.De.length] = this.Sd - this.De[this.De.length - 1] + this.De[this.De.length - 1]);
                b = d = 0;
                for (this.$e = []; d >= this.Zc;)this.$e[b] = d, d -= this.Om, b++;
                this.Zc % this.Om && (this.$e[this.$e.length] = this.Zc - this.$e[this.$e.length - 1] + this.$e[this.$e.length - 1])
            }
            this.Wu("h");
            this.Wu("v");
            this.yk || (this.Bb.style[ge] = "0", this.Dn(400))
        },
        scrollTo: function (a, b, c, d) {
            var e = a;
            this.stop();
            e.length || (e = [{x: a, y: b, time: c, EX: d}]);
            a = 0;
            for (b = e.length; a < b; a++)e[a].EX && (e[a].x = this.x - e[a].x, e[a].y = this.y - e[a].y), this.ij.push({
                x: e[a].x,
                y: e[a].y,
                time: e[a].time || 0
            });
            this.KA()
        },
        disable: function () {
            this.stop();
            this.Dn(0);
            this.enabled = q;
            this.Gd(te, window);
            this.Gd(ue, window);
            this.Gd(ve, window)
        },
        enable: function () {
            this.enabled = o
        },
        stop: function () {
            this.options.fi ? this.Gd(we) : ye(this.dB);
            this.ij = [];
            this.wl = this.Ug = q
        },
        zoom: function (a, b, c, d) {
            var e = c / this.scale;
            this.options.wk && (this.yk = o, d = d === j ? 200 : d, a = a - this.WE - this.x, b = b - this.XE - this.y, this.x = a - a * e + this.x, this.y = b - b * e + this.y, this.scale = c, this.refresh(), this.x = 0 < this.x ? 0 : this.x < this.Sd ? this.Sd : this.x, this.y = this.y > this.Ye ? this.Ye : this.y < this.Zc ? this.Zc : this.y, this.Bb.style[ge] = d + "ms", this.Bb.style[ee] = "translate(" + this.x + "px," + this.y + "px) scale(" + c + ")" + ze, this.yk = q)
        }
    };
    function de(a) {
        if ("" === Wd)return a;
        a = a.charAt(0).toUpperCase() + a.substr(1);
        return Wd + a
    }

    Vd = p;
    function Be(a) {
        this.k = {anchor: Vb, offset: new L(0, 0), maxWidth: "100%", imageHeight: 80};
        var a = a || {}, b;
        for (b in a)this.k[b] = a[b];
        this.il = new ac(p, {yf: "api"});
        this.Gj = [];
        this.G = p;
        this.si = {height: this.k.imageHeight, width: this.k.imageHeight * Ce};
        this.hj = this.zA = this.Bl = this.Kc = p
    }

    z.sm(function (a) {
        var b = p;
        a.addEventListener("position_changed", function () {
            a.k.albumsControl === o && (b ? b.yx(a.Kb()) : (b = new Be(a.k.albumsControlOptions), b.fa(a)))
        });
        a.addEventListener("albums_visible_changed", function () {
            a.k.albumsControl === o ? (b ? b.yx(a.Kb()) : (b = new Be(a.k.albumsControlOptions), b.fa(a)), b.show()) : b.J()
        });
        a.addEventListener("albums_options_changed", function () {
            b && b.dp(a.k.albumsControlOptions)
        })
    });
    var Ce = 1.8;
    w.extend(Be.prototype, {
        dp: function (a) {
            for (var b in a)this.k[b] = a[b];
            a = this.k.imageHeight + "px";
            this.lc(this.k.anchor);
            this.A.style.width = isNaN(Number(this.k.maxWidth)) === o ? this.k.maxWidth : this.k.maxWidth + "px";
            this.A.style.height = a;
            this.Kj.style.height = a;
            this.Ch.style.height = a;
            this.si = {height: this.k.imageHeight, width: this.k.imageHeight * Ce};
            this.Jj.style.height = this.si.height - 6 + "px";
            this.Jj.style.width = this.si.width - 6 + "px";
            this.yx(this.G.Kb(), o)
        }, fa: function (a) {
            this.G = a;
            this.Ar();
            this.KO();
            this.vW();
            this.yx(a.Kb())
        }, Ar: function () {
            var a = this.k.imageHeight + "px";
            this.A = K("div");
            var b = this.A.style;
            b.position = "absolute";
            b.zIndex = "2000";
            b.width = isNaN(Number(this.k.maxWidth)) === o ? this.k.maxWidth : this.k.maxWidth + "px";
            b.padding = "8px 0";
            b.background = "white";
            b.visibility = "hidden";
            b.height = a;
            this.Kj = K("div");
            b = this.Kj.style;
            b.position = "absolute";
            b.overflow = "hidden";
            b.width = "100%";
            b.height = a;
            this.Ch = K("div");
            b = this.Ch.style;
            b.height = a;
            this.Kj.appendChild(this.Ch);
            this.A.appendChild(this.Kj);
            this.G.A.appendChild(this.A);
            this.Jj = K("div", {"class": "pano_photo_item_seleted"});
            this.Jj.style.height = this.si.height - 6 + "px";
            this.Jj.style.width = this.si.width - 6 + "px";
            this.lc(this.k.anchor)
        }, DG: function (a) {
            for (var b = this.Gj, c = b.length - 1; 0 <= c; c--)if (b[c].panoId == a)return c;
            return -1
        }, yx: function (a, b) {
            if (b || !this.Gj[this.Kc] || !(this.Gj[this.Kc].panoId == a && 3 !== this.Gj[this.Kc].recoType)) {
                var c = this, d = this.DG(a);
                !b && -1 !== d && this.Gj[d] && 3 !== this.Gj[d].recoType ? this.cp(d) : this.NV(function (a) {
                    c.Gj = a;
                    c.Uq(a);
                    0 == a.length ? c.J() : c.show()
                })
            }
        }, Uq: function (a) {
            this.Ch.innerHTML = this.wV(a);
            this.Ch.style.width = (this.si.width + 8) * a.length + 8 + "px";
            var a = this.A.offsetWidth, b = this.Ch.offsetWidth;
            this.hj.as && (b += this.hj.as());
            b < a ? this.A.style.width = b + "px" : (this.A.style.width = isNaN(Number(this.k.maxWidth)) === o ? this.k.maxWidth : this.k.maxWidth + "px", b < this.A.offsetWidth && (this.A.style.width = b + "px"));
            this.hj.refresh();
            this.zA = this.Ch.children;
            this.Ch.appendChild(this.Jj);
            this.Jj.style.left = "-100000px";
            a = this.DG(this.G.Kb(), this.n_);
            -1 !== a && this.cp(a)
        }, wV: function (a) {
            for (var b, c, d, e, f = [], g = this.si.height, i = this.si.width, k = 0; k < a.length; k++)b = a[k], recoType = b.recoType, c = b.panoId, d = b.name, e = b.heading, b = b.pitch, c = Sd.mK(c, e, b, 198, 108), f.push('<a href="javascript:void(0);" class="pano_photo_item" data-index="' + k + '"><img style="width:' + (i - 2) + "px;height:" + (g - 2) + 'px;" data-index="' + k + '" name="' + d + '" src="' + c + '" alt="' + d + '"/><span class="pano_photo_decs" data-index="' + k + '" style="width:' + i + "px;font-size:" + Math.floor(g / 6) + "px; line-height:" + Math.floor(g / 6) + 'px;"><em class="pano_poi_' + recoType + '"></em>' + d + "</span></a>");
            return f.join("")
        }, NV: function (a) {
            var b = this, c = this.G.Kb();
            this.il.Hw(c, function (d) {
                b.G.Kb() === c && a(d)
            })
        }, lc: function (a) {
            if (!Ua(a) || isNaN(a) || a < Tb || 3 < a)a = this.defaultAnchor;
            var b = this.A, c = this.k.offset.width, d = this.k.offset.height;
            b.style.left = b.style.top = b.style.right = b.style.bottom = "auto";
            switch (a) {
                case Tb:
                    b.style.top = d + "px";
                    b.style.left = c + "px";
                    break;
                case Ub:
                    b.style.top = d + "px";
                    b.style.right = c + "px";
                    break;
                case Vb:
                    b.style.bottom = d + "px";
                    b.style.left = c + "px";
                    break;
                case 3:
                    b.style.bottom = d + "px", b.style.right = c + "px"
            }
        }, KO: function () {
            this.IO()
        }, IO: function () {
            var a = this;
            w.F(this.A, "touchstart", function (a) {
                a.stopPropagation()
            });
            w.F(this.Kj, "click", function (b) {
                if ((b = (b.srcElement || b.target).getAttribute("data-index")) && b != a.Kc)a.cp(b), a.G.pc(a.Gj[b].panoId)
            });
            w.F(this.Ch, "mouseover", function (b) {
                b = (b.srcElement || b.target).getAttribute("data-index");
                b !== p && a.gJ(b, o)
            });
            this.G.addEventListener("size_changed", function () {
                isNaN(Number(a.k.maxWidth)) && a.dp({maxWidth: a.k.maxWidth})
            })
        }, cp: function (a) {
            this.Jj.style.left = this.zA[a].offsetLeft + 8 + "px";
            this.Jj.setAttribute("data-index", this.zA[a].getAttribute("data-index"));
            this.Kc = a;
            this.gJ(a)
        }, gJ: function (a, b) {
            var c = this.si.width + 8, d = 0;
            this.hj.as && (d = this.hj.as() / 2);
            var e = this.Kj.offsetWidth - 2 * d, f = this.Ch.offsetLeft || this.hj.x, f = f - d, g = -a * c;
            g > f && this.hj.scrollTo(g + d);
            c = g - c;
            f -= e;
            c < f && (!b || b && 8 < g - f) && this.hj.scrollTo(c + e + d)
        }, vW: function () {
            this.hj = G() ? new Ae(this.Kj, {vr: q, SD: o, $i: q, jj: q, op: q, tL: o, mB: o, mD: o}) : new De(this.Kj)
        }, J: function () {
            this.A.style.visibility = "hidden"
        }, show: function () {
            this.A.style.visibility = "visible"
        }
    });
    function De(a) {
        this.A = a;
        this.zg = a.children[0];
        this.fr = p;
        this.Bk = 20;
        this.fa()
    }

    De.prototype = {
        fa: function () {
            this.zg.style.position = "relative";
            this.refresh();
            this.Ar();
            this.zl()
        }, refresh: function () {
            this.zn = this.A.offsetWidth - this.as();
            this.$z = -(this.zg.offsetWidth - this.zn - this.Bk);
            this.Ju = this.Bk;
            this.zg.style.left = this.Ju + "px";
            this.zg.children[0] && (this.fr = this.zg.children[0].offsetWidth);
            this.vh && (this.vh.children[0].style.marginTop = this.Xq.children[0].style.marginTop = this.vh.offsetHeight / 2 - this.vh.children[0].offsetHeight / 2 + "px")
        }, as: function () {
            return 2 * this.Bk
        }, Ar: function () {
            this.Xu = K("div");
            this.Xu.innerHTML = '<a class="pano_photo_arrow_l" href="javascript:void(0)" title="\u4e0a\u4e00\u9875"><span class="pano_arrow_l"></span></a><a class="pano_photo_arrow_r" href="javascript:void(0)" title="\u4e0b\u4e00\u9875"><span class="pano_arrow_r"></span></a>';
            this.vh = this.Xu.children[0];
            this.Xq = this.Xu.children[1];
            this.A.appendChild(this.Xu);
            this.vh.children[0].style.marginTop = this.Xq.children[0].style.marginTop = this.vh.offsetHeight / 2 - this.vh.children[0].offsetHeight / 2 + "px"
        }, zl: function () {
            var a = this;
            w.F(this.vh, "click", function () {
                a.scrollTo(a.zg.offsetLeft + a.zn)
            });
            w.F(this.Xq, "click", function () {
                a.scrollTo(a.zg.offsetLeft - a.zn)
            })
        }, bT: function () {
            w.B.Vb(this.vh, "pano_arrow_disable");
            w.B.Vb(this.Xq, "pano_arrow_disable");
            var a = this.zg.offsetLeft;
            a >= this.Ju && w.B.Ta(this.vh, "pano_arrow_disable");
            a - this.zn <= this.$z && w.B.Ta(this.Xq, "pano_arrow_disable")
        }, scrollTo: function (a) {
            a = a < this.zg.offsetLeft ? Math.ceil((a - this.Bk - this.zn) / this.fr) * this.fr + this.zn + this.Bk - 8 : Math.ceil((a - this.Bk) / this.fr) * this.fr + this.Bk;
            a < this.$z ? a = this.$z : a > this.Ju && (a = this.Ju);
            var b = this.zg.offsetLeft, c = this;
            new sb({
                Lc: 60, cc: tb.mC, duration: 300, la: function (d) {
                    c.zg.style.left = b + (a - b) * d + "px"
                }, finish: function () {
                    c.bT()
                }
            })
        }
    };
    z.Map = La;
    z.Hotspot = gb;
    z.MapType = Pc;
    z.Point = H;
    z.Pixel = P;
    z.Size = L;
    z.Bounds = db;
    z.TileLayer = Cc;
    z.Projection = fc;
    z.MercatorProjection = Q;
    z.PerspectiveProjection = fb;
    z.Copyright = function (a, b, c) {
        this.id = a;
        this.Ua = b;
        this.content = c
    };
    z.Overlay = hc;
    z.Label = pc;
    z.GroundOverlay = qc;
    z.PointCollection = uc;
    z.Marker = R;
    z.Icon = lc;
    z.IconSequence = nc;
    z.Symbol = mc;
    z.Polyline = yc;
    z.Polygon = xc;
    z.InfoWindow = oc;
    z.Circle = zc;
    z.Control = Sb;
    z.NavigationControl = hb;
    z.GeolocationControl = Wb;
    z.OverviewMapControl = kb;
    z.CopyrightControl = Xb;
    z.ScaleControl = jb;
    z.MapTypeControl = lb;
    z.PanoramaControl = Zb;
    z.TrafficLayer = Mc;
    z.CustomLayer = mb;
    z.ContextMenu = bc;
    z.MenuItem = ec;
    z.LocalSearch = ab;
    z.TransitRoute = od;
    z.DrivingRoute = rd;
    z.WalkingRoute = td;
    z.Autocomplete = Dd;
    z.RouteSearch = xd;
    z.Geocoder = yd;
    z.LocalCity = Ad;
    z.Geolocation = Geolocation;
    z.BusLineSearch = Cd;
    z.Boundary = Bd;
    z.VectorCloudLayer = Kc;
    z.VectorTrafficLayer = Lc;
    z.Panorama = Na;
    z.PanoramaLabel = Jd;
    z.PanoramaService = ac;
    z.PanoramaCoverageLayer = $b;
    z.PanoramaFlashInterface = Qd;
    function U(a, b) {
        for (var c in b)a[c] = b[c]
    }

    U(window, {
        BMap: z, _jsload2: function (a, b) {
            ia.Rx.GW && ia.Rx.set(a, b);
            J.QT(a, b)
        }, BMAP_API_VERSION: "2.0"
    });
    var V = La.prototype;
    U(V, {
        getBounds: V.Md,
        getCenter: V.Aa,
        getMapType: V.ka,
        getSize: V.Lb,
        setSize: V.td,
        getViewport: V.os,
        getZoom: V.U,
        centerAndZoom: V.$d,
        panTo: V.Zh,
        panBy: V.ig,
        setCenter: V.Gf,
        setCurrentCity: V.xE,
        setMapType: V.kg,
        setViewport: V.eh,
        setZoom: V.Bc,
        highResolutionEnabled: V.FK,
        zoomTo: V.og,
        zoomIn: V.YE,
        zoomOut: V.ZE,
        addHotspot: V.Ev,
        removeHotspot: V.GX,
        clearHotspots: V.Dl,
        checkResize: V.TT,
        addControl: V.Cv,
        removeControl: V.mM,
        getContainer: V.Ea,
        addContextMenu: V.Pn,
        removeContextMenu: V.So,
        addOverlay: V.ya,
        removeOverlay: V.Gb,
        clearOverlays: V.dJ,
        openInfoWindow: V.zb,
        closeInfoWindow: V.Jc,
        pointToOverlayPixel: V.Ee,
        overlayPixelToPoint: V.cM,
        getInfoWindow: V.Mg,
        getOverlays: V.aD,
        getPanes: function () {
            return {
                floatPane: this.Yd.DC,
                markerMouseTarget: this.Yd.ND,
                floatShadow: this.Yd.UJ,
                labelPane: this.Yd.GD,
                markerPane: this.Yd.xL,
                markerShadow: this.Yd.yL,
                mapPane: this.Yd.Fs
            }
        },
        addTileLayer: V.Dg,
        removeTileLayer: V.bh,
        pixelToPoint: V.mb,
        pointToPixel: V.Ub,
        setFeatureStyle: V.bp,
        selectBaseElement: V.Q1,
        setMapStyle: V.Zs,
        enable3DBuilding: V.ho,
        disable3DBuilding: V.yU
    });
    var Ee = Pc.prototype;
    U(Ee, {
        getTileLayer: Ee.ZV,
        getMinZoom: Ee.ro,
        getMaxZoom: Ee.Sl,
        getProjection: Ee.wo,
        getTextColor: Ee.ls,
        getTips: Ee.ns
    });
    U(window, {BMAP_NORMAL_MAP: Ma, BMAP_PERSPECTIVE_MAP: Oa, BMAP_SATELLITE_MAP: Wa, BMAP_HYBRID_MAP: Qa});
    var Fe = Q.prototype;
    U(Fe, {lngLatToPoint: Fe.Qg, pointToLngLat: Fe.ai});
    var Ge = fb.prototype;
    U(Ge, {lngLatToPoint: Ge.Qg, pointToLngLat: Ge.ai});
    var He = db.prototype;
    U(He, {
        equals: He.$a,
        containsPoint: He.yr,
        containsBounds: He.dU,
        intersects: He.ws,
        extend: He.extend,
        getCenter: He.Aa,
        isEmpty: He.fj,
        getSouthWest: He.Ce,
        getNorthEast: He.zf,
        toSpan: He.OE
    });
    var Ie = hc.prototype;
    U(Ie, {isVisible: Ie.Pg, show: Ie.show, hide: Ie.J});
    hc.getZIndex = hc.Yl;
    var Je = eb.prototype;
    U(Je, {
        openInfoWindow: Je.zb,
        closeInfoWindow: Je.Jc,
        enableMassClear: Je.Ti,
        disableMassClear: Je.AU,
        show: Je.show,
        hide: Je.J,
        getMap: Je.Aw,
        addContextMenu: Je.Pn,
        removeContextMenu: Je.So
    });
    var Ne = R.prototype;
    U(Ne, {
        setIcon: Ne.Ob,
        getIcon: Ne.qo,
        setPosition: Ne.ha,
        getPosition: Ne.V,
        setOffset: Ne.Ge,
        getOffset: Ne.Af,
        getLabel: Ne.WC,
        setLabel: Ne.Cm,
        setTitle: Ne.qc,
        setTop: Ne.di,
        enableDragging: Ne.Rb,
        disableDragging: Ne.UB,
        setZIndex: Ne.dt,
        getMap: Ne.Aw,
        setAnimation: Ne.Bm,
        setShadow: Ne.Ix,
        hide: Ne.J,
        setRotation: Ne.fp,
        getRotation: Ne.qK
    });
    U(window, {BMAP_ANIMATION_DROP: 1, BMAP_ANIMATION_BOUNCE: 2});
    var Oe = pc.prototype;
    U(Oe, {
        setStyle: Oe.ud,
        setStyles: Oe.ci,
        setContent: Oe.Pc,
        setPosition: Oe.ha,
        getPosition: Oe.V,
        setOffset: Oe.Ge,
        getOffset: Oe.Af,
        setTitle: Oe.qc,
        setZIndex: Oe.dt,
        getMap: Oe.Aw,
        getContent: Oe.Yj
    });
    var Pe = lc.prototype;
    U(Pe, {
        setImageUrl: Pe.lY,
        setSize: Pe.td,
        setAnchor: Pe.lc,
        setImageOffset: Pe.Ys,
        setImageSize: Pe.jY,
        setInfoWindowAnchor: Pe.nY,
        setPrintImageUrl: Pe.wY
    });
    var Qe = oc.prototype;
    U(Qe, {
        redraw: Qe.Td,
        setTitle: Qe.qc,
        setContent: Qe.Pc,
        getContent: Qe.Yj,
        getPosition: Qe.V,
        enableMaximize: Qe.Hg,
        disableMaximize: Qe.hw,
        isOpen: Qe.Ja,
        setMaxContent: Qe.$s,
        maximize: Qe.dx,
        enableAutoPan: Qe.Ur
    });
    var Re = jc.prototype;
    U(Re, {
        getPath: Re.de,
        setPath: Re.Ud,
        setPositionAt: Re.Em,
        getStrokeColor: Re.TV,
        setStrokeWeight: Re.ip,
        getStrokeWeight: Re.tK,
        setStrokeOpacity: Re.gp,
        getStrokeOpacity: Re.UV,
        setFillOpacity: Re.Xs,
        getFillOpacity: Re.rV,
        setStrokeStyle: Re.hp,
        getStrokeStyle: Re.sK,
        getFillColor: Re.qV,
        getBounds: Re.Md,
        enableEditing: Re.xf,
        disableEditing: Re.zU
    });
    var Se = zc.prototype;
    U(Se, {setCenter: Se.Gf, getCenter: Se.Aa, getRadius: Se.oK, setRadius: Se.af});
    var Te = xc.prototype;
    U(Te, {getPath: Te.de, setPath: Te.Ud, setPositionAt: Te.Em});
    var Ue = gb.prototype;
    U(Ue, {getPosition: Ue.V, setPosition: Ue.ha, getText: Ue.fD, setText: Ue.ct});
    H.prototype.equals = H.prototype.$a;
    P.prototype.equals = P.prototype.$a;
    L.prototype.equals = L.prototype.$a;
    U(window, {
        BMAP_ANCHOR_TOP_LEFT: Tb,
        BMAP_ANCHOR_TOP_RIGHT: Ub,
        BMAP_ANCHOR_BOTTOM_LEFT: Vb,
        BMAP_ANCHOR_BOTTOM_RIGHT: 3
    });
    var Ve = Sb.prototype;
    U(Ve, {
        setAnchor: Ve.lc,
        getAnchor: Ve.JC,
        setOffset: Ve.Ge,
        getOffset: Ve.Af,
        show: Ve.show,
        hide: Ve.J,
        isVisible: Ve.Pg,
        toString: Ve.toString
    });
    var We = hb.prototype;
    U(We, {getType: We.Ao, setType: We.Fm});
    U(window, {
        BMAP_NAVIGATION_CONTROL_LARGE: 0,
        BMAP_NAVIGATION_CONTROL_SMALL: 1,
        BMAP_NAVIGATION_CONTROL_PAN: 2,
        BMAP_NAVIGATION_CONTROL_ZOOM: 3
    });
    var Xe = kb.prototype;
    U(Xe, {changeView: Xe.ae, setSize: Xe.td, getSize: Xe.Lb});
    var Ye = jb.prototype;
    U(Ye, {getUnit: Ye.cW, setUnit: Ye.DE});
    U(window, {BMAP_UNIT_METRIC: "metric", BMAP_UNIT_IMPERIAL: "us"});
    var Ze = Xb.prototype;
    U(Ze, {addCopyright: Ze.Dv, removeCopyright: Ze.jE, getCopyright: Ze.Ql, getCopyrightCollection: Ze.QC});
    U(window, {BMAP_MAPTYPE_CONTROL_HORIZONTAL: Yb, BMAP_MAPTYPE_CONTROL_DROPDOWN: 1, BMAP_MAPTYPE_CONTROL_MAP: 2});
    var $e = Cc.prototype;
    U($e, {getMapType: $e.ka, getCopyright: $e.Ql, isTransparentPng: $e.Cs});
    var af = bc.prototype;
    U(af, {addItem: af.Fv, addSeparator: af.$A, removeSeparator: af.lE});
    var bf = ec.prototype;
    U(bf, {setText: bf.ct});
    var cf = T.prototype;
    U(cf, {
        getStatus: cf.Vl,
        setSearchCompleteCallback: cf.BE,
        getPageCapacity: cf.Ve,
        setPageCapacity: cf.ep,
        setLocation: cf.Dm,
        disableFirstResultSelection: cf.VB,
        enableFirstResultSelection: cf.sC,
        gotoPage: cf.Zl,
        searchNearby: cf.$o,
        searchInBounds: cf.Am,
        search: cf.search
    });
    U(window, {
        BMAP_STATUS_SUCCESS: 0,
        BMAP_STATUS_CITY_LIST: 1,
        BMAP_STATUS_UNKNOWN_LOCATION: 2,
        BMAP_STATUS_UNKNOWN_ROUTE: 3,
        BMAP_STATUS_INVALID_KEY: 4,
        BMAP_STATUS_INVALID_REQUEST: 5,
        BMAP_STATUS_PERMISSION_DENIED: 6,
        BMAP_STATUS_SERVICE_UNAVAILABLE: 7,
        BMAP_STATUS_TIMEOUT: 8
    });
    U(window, {
        BMAP_POI_TYPE_NORMAL: 0,
        BMAP_POI_TYPE_BUSSTOP: 1,
        BMAP_POI_TYPE_BUSLINE: 2,
        BMAP_POI_TYPE_SUBSTOP: 3,
        BMAP_POI_TYPE_SUBLINE: 4
    });
    U(window, {
        BMAP_TRANSIT_POLICY_LEAST_TIME: 0,
        BMAP_TRANSIT_POLICY_LEAST_TRANSFER: 2,
        BMAP_TRANSIT_POLICY_LEAST_WALKING: 3,
        BMAP_TRANSIT_POLICY_AVOID_SUBWAYS: 4,
        BMAP_LINE_TYPE_BUS: 0,
        BMAP_LINE_TYPE_SUBWAY: 1,
        BMAP_LINE_TYPE_FERRY: 2
    });
    var df = nd.prototype;
    U(df, {clearResults: df.ye});
    pd = od.prototype;
    U(pd, {setPolicy: pd.bt, toString: pd.toString, setPageCapacity: pd.ep});
    U(window, {
        BMAP_DRIVING_POLICY_LEAST_TIME: 0,
        BMAP_DRIVING_POLICY_LEAST_DISTANCE: 1,
        BMAP_DRIVING_POLICY_AVOID_HIGHWAYS: 2
    });
    U(window, {
        BMAP_MODE_DRIVING: "driving",
        BMAP_MODE_TRANSIT: "transit",
        BMAP_MODE_WALKING: "walking",
        BMAP_MODE_NAVIGATION: "navigation"
    });
    var ef = xd.prototype;
    U(ef, {routeCall: ef.xM});
    U(window, {BMAP_HIGHLIGHT_STEP: 1, BMAP_HIGHLIGHT_ROUTE: 2});
    U(window, {BMAP_ROUTE_TYPE_DRIVING: $c, BMAP_ROUTE_TYPE_WALKING: Zc});
    U(window, {BMAP_ROUTE_STATUS_NORMAL: ad, BMAP_ROUTE_STATUS_EMPTY: 1, BMAP_ROUTE_STATUS_ADDRESS: 2});
    var ff = rd.prototype;
    U(ff, {setPolicy: ff.bt});
    var gf = Dd.prototype;
    U(gf, {show: gf.show, hide: gf.J, setTypes: gf.CE, setLocation: gf.Dm, search: gf.search, setInputValue: gf.Fx});
    U(mb.prototype, {});
    var hf = Bd.prototype;
    U(hf, {get: hf.get});
    U($b.prototype, {});
    U(bb.prototype, {});
    U(window, {BMAP_POINT_DENSITY_HIGH: 200, BMAP_POINT_DENSITY_MEDIUM: Oc, BMAP_POINT_DENSITY_LOW: 50});
    U(window, {
        BMAP_POINT_SHAPE_STAR: 1,
        BMAP_POINT_SHAPE_WATERDROP: 2,
        BMAP_POINT_SHAPE_CIRCLE: rc,
        BMAP_POINT_SHAPE_SQUARE: 4,
        BMAP_POINT_SHAPE_RHOMBUS: 5
    });
    U(window, {
        BMAP_POINT_SIZE_TINY: 1,
        BMAP_POINT_SIZE_SMALLER: 2,
        BMAP_POINT_SIZE_SMALL: 3,
        BMAP_POINT_SIZE_NORMAL: sc,
        BMAP_POINT_SIZE_BIG: 5,
        BMAP_POINT_SIZE_BIGGER: 6,
        BMAP_POINT_SIZE_HUGE: 7
    });
    U(window, {
        BMap_Symbol_SHAPE_CAMERA: 11,
        BMap_Symbol_SHAPE_WARNING: 12,
        BMap_Symbol_SHAPE_SMILE: 13,
        BMap_Symbol_SHAPE_CLOCK: 14,
        BMap_Symbol_SHAPE_POINT: 9,
        BMap_Symbol_SHAPE_PLANE: 10,
        BMap_Symbol_SHAPE_CIRCLE: 1,
        BMap_Symbol_SHAPE_RECTANGLE: 2,
        BMap_Symbol_SHAPE_RHOMBUS: 3,
        BMap_Symbol_SHAPE_STAR: 4,
        BMap_Symbol_SHAPE_BACKWARD_CLOSED_ARROW: 5,
        BMap_Symbol_SHAPE_FORWARD_CLOSED_ARROW: 6,
        BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW: 7,
        BMap_Symbol_SHAPE_FORWARD_OPEN_ARROW: 8
    });
    U(window, {BMAP_CONTEXT_MENU_ICON_ZOOMIN: cc, BMAP_CONTEXT_MENU_ICON_ZOOMOUT: dc});
    z.tT();
})()