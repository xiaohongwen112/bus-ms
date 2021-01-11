(function($) {

	var DropDownList = function(elem, settings) {
		this.$elem = $(elem);
		this.settings = settings;
		this.data = settings['data']||[];
		this._init();
	};


	DropDownList.prototype = {

		_init: function() {
			this._createDom();
			this._bindEvents();
		},

		_createDom: function() {

			var left = this.$elem.position().left;
			var top = this.$elem.position().top;

			this.$elem.addClass("dropdownlist");
			this.$elem.append('<span class="select-text"></span><input class="select-value" type="hidden" value=""><span class="arrow arrow-down"></span>');
			this.$elem.append('<ul class="dropdownlist-option hide"></ul>');
			this.selectText = this.$elem.find('.select-text');
			this.selectValue = this.$elem.find('.select-value');

			var dropdownOptions = this.$elem.find('.dropdownlist-option');
			if (!$.isEmptyObject(this.data)) {
				for (var i=0; i < this.data.length; i++) {
					if (i==0) {
						this._setSelectTextValue(this.data[i]);
					}

					var item = $('<li>'+this.data[i]['disp']+'<input type="hidden" value="'+this.data[i]['value']+'"/></li>');
					item.data('data', this.data[i]);
					dropdownOptions.append(item);
				}
			}
			dropdownOptions.hide();
		},

		_setSelectTextValue: function(obj) {
			if (obj) {
				this.selectText.text(obj['disp']);
				this.selectValue.val(obj['value']);
			}
		},

		_bindEvents: function() {
			this.$elem.unbind('click').click($.proxy(this._dropdownClickHandler, this));
			this.$elem.find('.dropdownlist-option li').unbind('click').click($.proxy(this._dropdownOptionClickHandler, this));
            $('body').click($.proxy(this._dropdownHideHandler, this));
		},

        _dropdownHideHandler: function() {
            this.$elem.find('.dropdownlist-option').hide();
        },

		_dropdownBlurHandler: function() {
            var options = this.$elem.find('.dropdownlist-option');
            var visible = options.is(':visible');
			if (!visible) {
				this.$elem.removeClass('focus');
            }
		},

		_dropdownClickHandler: function(e) {
            e.stopPropagation();
			var options = this.$elem.find('.dropdownlist-option');
			var opened = options.is(':visible');

            $('.dropdownlist-option').not(options).hide();
			if (opened) {
				options.hide();
			} else {
				options.show();
			}
		},

		_dropdownOptionClickHandler: function(e) {
            e.stopPropagation();
			var data = $(e.target).data('data');
			this._setSelectTextValue(data);

            if (this.settings['onselect']) {
                if (typeof(this.settings['onselect']) === 'function') {
                    this.settings['onselect'](data);
                }
            }

            this.$elem.find('.dropdownlist-option').hide();
		},

        setOptions: function(items) {
            var options = this.$elem.find('.dropdownlist-option');
            options.empty();
            for (var i in items) {
                if (i==0) {
					this._setSelectTextValue(items[i]);
                }
                var item = $('<li>'+items[i]['disp']+'<input type="hidden" value="'+items[i]['value']+'"/></li>');
                item.data('data', items[i]);
                options.append(item);
            }
			this.$elem.find('.dropdownlist-option li').click($.proxy(this._dropdownOptionClickHandler, this));
        },

        getValue: function() {
            return this.selectValue.val();
        },

        trigger: function(eventName) {
            var selected = this.selectText.text();
            var options = this.$elem.find('.dropdownlist-option li');

            $.each(options, function(index, item){
                item = $(item);
                if(item.text() == selected) {
                    item.trigger('click');
                    return false;
                }
            });
        }
	};

	$.fn.dropdownlist = function(settings, args) {
		settings = settings||{};
		if (typeof(settings) === 'object') {
			if ($._ddl == undefined) {
				$._ddl = {};
			}
			$._ddl[this.attr('id')] = new DropDownList(this, settings);
			return $._ddl[this.attr('id')];
		} else if (typeof(settings) === 'string') {
			if ($._ddl[this.attr('id')]) {
				if (typeof($._ddl[this.attr('id')][settings]) === 'function') {
					return $._ddl[this.attr('id')][settings](args);
				}
			}
		};
	};
})(jQuery);
