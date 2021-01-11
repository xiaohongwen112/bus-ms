!function (a) {
  function b() {
    if (a.fn.ajaxSubmit.debug) {
      var b = "[jquery.form] " + Array.prototype.join.call(arguments, "");
      window.console && window.console.log ? window.console.log(b) : window.opera && window.opera.postError && window.opera.postError(b)
    }
  }
  a.fn.ajaxSubmit = function (c) {
    function d() {
      function d() {
        var b = m.attr("target"),
          c = m.attr("action");
        f.setAttribute("target", h), "POST" != f.getAttribute("method") && f.setAttribute("method", "POST"), f.getAttribute("action") != g.url && f.setAttribute("action", g.url), g.skipEncodingOverride || m.attr({
          encoding: "multipart/form-data",
          enctype: "multipart/form-data"
        }), g.timeout && (n = setTimeout(function () {
          o = !0, e(!0)
        }, g.timeout));
        var d = [];
        try {
          if (g.extraData)
            for (var k in g.extraData) d.push(a('<input type="hidden" name="' + k + '" value="' + g.extraData[k] + '" />').appendTo(f)[0]);
          i.appendTo("body"), j.attachEvent ? j.attachEvent("onload", e) : j.addEventListener("load", e, !1), f.submit()
        } finally {
          f.setAttribute("action", c), b ? f.setAttribute("target", b) : m.removeAttr("target"), a(d).remove()
        }
      }

      function e(c) {
        if (!k.aborted && !s) {
          if (c === !0 && k) return k.abort("timeout"), void 0;
          var d = j.contentWindow ? j.contentWindow.document : j.contentDocument ? j.contentDocument : j.document;
          if (d && d.location.href != g.iframeSrc || o) {
            j.detachEvent ? j.detachEvent("onload", e) : j.removeEventListener("load", e, !1);
            var f = !0;
            try {
              if (o) throw "timeout";
              var h = "xml" == g.dataType || d.XMLDocument || a.isXMLDoc(d);
              if (b("isXml=" + h), !h && window.opera && (null == d.body || "" == d.body.innerHTML) && --t) return b("requeing onLoad callback, DOM not available"), setTimeout(e, 250), void 0;
              k.responseText = d.body ? d.body.innerHTML : d.documentElement ? d.documentElement.innerHTML : null, k.responseXML = d.XMLDocument ? d.XMLDocument : d, h && (g.dataType = "xml"), k.getResponseHeader = function (a) {
                var b = {
                  "content-type": g.dataType
                };
                return b[a]
              };
              var m = /(json|script|text)/.test(g.dataType);
              if (m || g.textarea) {
                var p = d.getElementsByTagName("textarea")[0];
                if (p) k.responseText = p.value;
                else if (m) {
                  var q = d.getElementsByTagName("pre")[0],
                    v = d.getElementsByTagName("body")[0];
                  q ? k.responseText = q.textContent : v && (k.responseText = v.innerHTML)
                }
              } else "xml" != g.dataType || k.responseXML || null == k.responseText || (k.responseXML = u(k.responseText));
              r = w(k, g.dataType, g)
            } catch (c) {
              b("error caught:", c), f = !1, k.error = c, g.error && g.error.call(g.context, k, "error", c), l && a.event.trigger("ajaxError", [k, g, c])
            }
            k.aborted && (b("upload aborted"), f = !1), f && (g.success && g.success.call(g.context, r, "success", k), l && a.event.trigger("ajaxSuccess", [k, g])), l && a.event.trigger("ajaxComplete", [k, g]), l && !--a.active && a.event.trigger("ajaxStop"), g.complete && g.complete.call(g.context, k, f ? "success" : "error"), s = !0, g.timeout && clearTimeout(n), setTimeout(function () {
              i.removeData("form-plugin-onload"), i.remove(), k.responseXML = null
            }, 100)
          }
        }
      }
      var f = m[0];
      if (a(":input[name=submit],:input[id=submit]", f).length) return alert('Error: Form elements must not have name or id of "submit".'), void 0;
      var g = a.extend(!0, {}, a.ajaxSettings, c);
      g.context = g.context || g;
      var h = "jqFormIO" + (new Date).getTime(),
        i = a('<iframe id="' + h + '" name="' + h + '" src="' + g.iframeSrc + '" />'),
        j = i[0];
      i.css({
        position: "absolute",
        top: "-1000px",
        left: "-1000px"
      });
      var k = {
          aborted: 0,
          responseText: null,
          responseXML: null,
          status: 0,
          statusText: "n/a",
          getAllResponseHeaders: function () {},
          getResponseHeader: function () {},
          setRequestHeader: function () {},
          abort: function (c) {
            var d = "timeout" === c ? "timeout" : "aborted";
            b("aborting upload... " + d), this.aborted = 1, i.attr("src", g.iframeSrc), k.error = d, g.error && g.error.call(g.context, k, d, d), l && a.event.trigger("ajaxError", [k, g, d]), g.complete && g.complete.call(g.context, k, d)
          }
        },
        l = g.global;
      if (l && !a.active++ && a.event.trigger("ajaxStart"), l && a.event.trigger("ajaxSend", [k, g]), g.beforeSend && g.beforeSend.call(g.context, k, g) === !1) return g.global && a.active--, void 0;
      if (!k.aborted) {
        var n, o = 0,
          p = f.clk;
        if (p) {
          var q = p.name;
          q && !p.disabled && (g.extraData = g.extraData || {}, g.extraData[q] = p.value, "image" == p.type && (g.extraData[q + ".x"] = f.clk_x, g.extraData[q + ".y"] = f.clk_y))
        }
        g.forceSync ? d() : setTimeout(d, 10);
        var r, s, t = 50,
          u = a.parseXML || function (a, b) {
            return window.ActiveXObject ? (b = new ActiveXObject("Microsoft.XMLDOM"), b.async = "false", b.loadXML(a)) : b = (new DOMParser).parseFromString(a, "text/xml"), b && b.documentElement && "parsererror" != b.documentElement.nodeName ? b : null
          },
          v = a.parseJSON || function (a) {
            return window.eval("(" + a + ")")
          },
          w = function (b, c, d) {
            var e = b.getResponseHeader("content-type") || "",
              f = "xml" === c || !c && e.indexOf("xml") >= 0,
              g = f ? b.responseXML : b.responseText;
            return f && "parsererror" === g.documentElement.nodeName && a.error && a.error("parsererror"), d && d.dataFilter && (g = d.dataFilter(g, c)), "string" == typeof g && ("json" === c || !c && e.indexOf("json") >= 0 ? g = v(g) : ("script" === c || !c && e.indexOf("javascript") >= 0) && a.globalEval(g)), g
          }
      }
    }
    if (!this.length) return b("ajaxSubmit: skipping submit process - no element selected"), this;
    "function" == typeof c && (c = {
      success: c
    });
    var e = this.attr("action"),
      f = "string" == typeof e ? a.trim(e) : "";
    f && (f = (f.match(/^([^#]+)/) || [])[1]), f = f || window.location.href || "", c = a.extend(!0, {
      url: f,
      success: a.ajaxSettings.success,
      type: this[0].getAttribute("method") || "GET",
      iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank"
    }, c);
    var g = {};
    if (this.trigger("form-pre-serialize", [this, c, g]), g.veto) return b("ajaxSubmit: submit vetoed via form-pre-serialize trigger"), this;
    if (c.beforeSerialize && c.beforeSerialize(this, c) === !1) return b("ajaxSubmit: submit aborted via beforeSerialize callback"), this;
    var h, i, j = this.formToArray(c.semantic);
    if (c.data) {
      c.extraData = c.data;
      for (h in c.data)
        if (c.data[h] instanceof Array)
          for (var k in c.data[h]) j.push({
            name: h,
            value: c.data[h][k]
          });
        else i = c.data[h], i = a.isFunction(i) ? i() : i, j.push({
          name: h,
          value: i
        })
    }
    if (c.beforeSubmit && c.beforeSubmit(j, this, c) === !1) return b("ajaxSubmit: submit aborted via beforeSubmit callback"), this;
    if (this.trigger("form-submit-validate", [j, this, c, g]), g.veto) return b("ajaxSubmit: submit vetoed via form-submit-validate trigger"), this;
    var l = a.param(j);
    "GET" == c.type.toUpperCase() ? (c.url += (c.url.indexOf("?") >= 0 ? "&" : "?") + l, c.data = null) : c.data = l;
    var m = this,
      n = [];
    if (c.resetForm && n.push(function () {
        m.resetForm()
      }), c.clearForm && n.push(function () {
        m.clearForm()
      }), !c.dataType && c.target) {
      var o = c.success || function () {};
      n.push(function (b) {
        var d = c.replaceTarget ? "replaceWith" : "html";
        a(c.target)[d](b).each(o, arguments)
      })
    } else c.success && n.push(c.success);
    c.success = function (a, b, d) {
      for (var e = c.context || c, f = 0, g = n.length; g > f; f++) n[f].apply(e, [a, b, d || m, m])
    };
    var p = a("input:file", this).length > 0,
      q = "multipart/form-data",
      r = m.attr("enctype") == q || m.attr("encoding") == q;
    return c.iframe !== !1 && (p || c.iframe || r) ? c.closeKeepAlive ? a.get(c.closeKeepAlive, d) : d() : a.ajax(c), this.trigger("form-submit-notify", [this, c]), this
  }, a.fn.ajaxForm = function (c) {
    if (0 === this.length) {
      var d = {
        s: this.selector,
        c: this.context
      };
      return !a.isReady && d.s ? (b("DOM not ready, queuing ajaxForm"), a(function () {
        a(d.s, d.c).ajaxForm(c)
      }), this) : (b("terminating; zero elements found by selector" + (a.isReady ? "" : " (DOM not ready)")), this)
    }
    return this.ajaxFormUnbind().bind("submit.form-plugin", function (b) {
      b.isDefaultPrevented() || (b.preventDefault(), a(this).ajaxSubmit(c))
    }).bind("click.form-plugin", function (b) {
      var c = b.target,
        d = a(c);
      if (!d.is(":submit,input:image")) {
        var e = d.closest(":submit");
        if (0 == e.length) return;
        c = e[0]
      }
      var f = this;
      if (f.clk = c, "image" == c.type)
        if (void 0 != b.offsetX) f.clk_x = b.offsetX, f.clk_y = b.offsetY;
        else if ("function" == typeof a.fn.offset) {
        var g = d.offset();
        f.clk_x = b.pageX - g.left, f.clk_y = b.pageY - g.top
      } else f.clk_x = b.pageX - c.offsetLeft, f.clk_y = b.pageY - c.offsetTop;
      setTimeout(function () {
        f.clk = f.clk_x = f.clk_y = null
      }, 100)
    })
  }, a.fn.ajaxFormUnbind = function () {
    return this.unbind("submit.form-plugin click.form-plugin")
  }, a.fn.formToArray = function (b) {
    var c = [];
    if (0 === this.length) return c;
    var d = this[0],
      e = b ? d.getElementsByTagName("*") : d.elements;
    if (!e) return c;
    var f, g, h, i, j, k, l;
    for (f = 0, k = e.length; k > f; f++)
      if (j = e[f], h = j.name)
        if (b && d.clk && "image" == j.type) j.disabled || d.clk != j || (c.push({
          name: h,
          value: a(j).val()
        }), c.push({
          name: h + ".x",
          value: d.clk_x
        }, {
          name: h + ".y",
          value: d.clk_y
        }));
        else if (i = a.fieldValue(j, !0), i && i.constructor == Array)
      for (g = 0, l = i.length; l > g; g++) c.push({
        name: h,
        value: i[g]
      });
    else null !== i && "undefined" != typeof i && c.push({
      name: h,
      value: i
    });
    if (!b && d.clk) {
      var m = a(d.clk),
        n = m[0];
      h = n.name, h && !n.disabled && "image" == n.type && (c.push({
        name: h,
        value: m.val()
      }), c.push({
        name: h + ".x",
        value: d.clk_x
      }, {
        name: h + ".y",
        value: d.clk_y
      }))
    }
    return c
  }, a.fn.formSerialize = function (b) {
    return a.param(this.formToArray(b))
  }, a.fn.fieldSerialize = function (b) {
    var c = [];
    return this.each(function () {
      var d = this.name;
      if (d) {
        var e = a.fieldValue(this, b);
        if (e && e.constructor == Array)
          for (var f = 0, g = e.length; g > f; f++) c.push({
            name: d,
            value: e[f]
          });
        else null !== e && "undefined" != typeof e && c.push({
          name: this.name,
          value: e
        })
      }
    }), a.param(c)
  }, a.fn.fieldValue = function (b) {
    for (var c = [], d = 0, e = this.length; e > d; d++) {
      var f = this[d],
        g = a.fieldValue(f, b);
      null === g || "undefined" == typeof g || g.constructor == Array && !g.length || (g.constructor == Array ? a.merge(c, g) : c.push(g))
    }
    return c
  }, a.fieldValue = function (b, c) {
    var d = b.name,
      e = b.type,
      f = b.tagName.toLowerCase();
    if (void 0 === c && (c = !0), c && (!d || b.disabled || "reset" == e || "button" == e || ("checkbox" == e || "radio" == e) && !b.checked || ("submit" == e || "image" == e) && b.form && b.form.clk != b || "select" == f && -1 == b.selectedIndex)) return null;
    if ("select" == f) {
      var g = b.selectedIndex;
      if (0 > g) return null;
      for (var h = [], i = b.options, j = "select-one" == e, k = j ? g + 1 : i.length, l = j ? g : 0; k > l; l++) {
        var m = i[l];
        if (m.selected) {
          var n = m.value;
          if (n || (n = m.attributes && m.attributes.value && !m.attributes.value.specified ? m.text : m.value), j) return n;
          h.push(n)
        }
      }
      return h
    }
    return a(b).val()
  }, a.fn.clearForm = function () {
    return this.each(function () {
      a("input,select,textarea", this).clearFields()
    })
  }, a.fn.clearFields = a.fn.clearInputs = function () {
    return this.each(function () {
      var a = this.type,
        b = this.tagName.toLowerCase();
      "text" == a || "password" == a || "textarea" == b ? this.value = "" : "checkbox" == a || "radio" == a ? this.checked = !1 : "select" == b && (this.selectedIndex = -1)
    })
  }, a.fn.resetForm = function () {
    return this.each(function () {
      ("function" == typeof this.reset || "object" == typeof this.reset && !this.reset.nodeType) && this.reset()
    })
  }, a.fn.enable = function (a) {
    return void 0 === a && (a = !0), this.each(function () {
      this.disabled = !a
    })
  }, a.fn.selected = function (b) {
    return void 0 === b && (b = !0), this.each(function () {
      var c = this.type;
      if ("checkbox" == c || "radio" == c) this.checked = b;
      else if ("option" == this.tagName.toLowerCase()) {
        var d = a(this).parent("select");
        b && d[0] && "select-one" == d[0].type && d.find("option").selected(!1), this.selected = b
      }
    })
  }
}(jQuery);
