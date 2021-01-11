/*
 *
 * Handlebars's helper
 *
 */
Handlebars.registerHelper('compare', function(lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");

    operator = options.hash.operator || "==";
    var operators = {
        '==':       function(l,r) { return l == r; },
        '===':      function(l,r) { return l === r; },
        '!=':       function(l,r) { return l != r; },
        '<':        function(l,r) { return l < r; },
        '>':        function(l,r) { return l > r; },
        '<=':       function(l,r) { return l <= r; },
        '>=':       function(l,r) { return l >= r; },
        'typeof':   function(l,r) { return typeof l == r; }
    }

    if (!operators[operator])
        throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);

    var result = operators[operator](lvalue,rvalue);

    if( result ) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper("key_value", function(obj, options) {
    var buffer = "";
    var key = "";

    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            buffer += options.fn({key: key, value: obj[key]});
        }
    }
    return buffer;
});

Handlebars.registerHelper("kvselect", function(obj, toselect, options) {
    var buffer = "";
    var key = "";

    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (key == toselect) {
                obj[key]['kv_isselected'] = true;
            } else {
                obj[key]['kv_isselected'] = false;
            }
            buffer += options.fn({key: key, value: obj[key]});
        }
    }
    return buffer;
});

Handlebars.registerHelper("foreach",function(arr, options) {
    if(options.inverse && !arr.length) {
        return options.inverse(this);
    }

    return arr.map(function(item, index) {
            item.$index = index;
            item.$first = index === 0;
            item.$last  = index === arr.length-1;
            return options.fn(item);
        }).join('');
});

Handlebars.registerHelper("axis_hour_left", function(index) {
    var pos = index * 20 + 1;
    return pos + "px";
});

/*

(function($, PROJECT) {
    PROJECT.Template.TemplateTool = $.extendclass(CBMS.Template.BaseObject, {
        __init__: function() {
            this.templates = {};
        },

        addTemplate: function(template_id) {
            if (!template_id) {
                throw new Error('Please assign template id');
            }
            tpl = Handlebars.compile($('#'+template_id).html()),
            this.templates[template_id] = {render:tpl, html:null};
            return this;
        },

        renderTemplate: function(template_id, data) {
            var render = null;

            try {
                render = this.templates[template_id].render;
            } catch(e) {
                alert('can not find template render');
                throw new Error('can not find template render[template_id:'+ template_id + ']');
            }

            try {
                this.$html = $(render(data));
                this.templates[template_id].html = this.$html;
            } catch(e) {
                this.$html = null;
                alert('render template error');
                throw new Error('render template fail');
            }
            return this;
        },

        appendTo: function(appendToContent) {
            appendToContent.html('');

            if (this.$html) {
                this.$html.appendTo(appendToContent);
            }
        }
    });
})(jQuery, CBMS);

*/
