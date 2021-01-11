var Spd = CBMSFLOW.module('spd');

CBMSFLOW.module('spd.Menu');
Spd.Menu.FrameMenu = CBMSFLOW.klass({
    __init__: function(){
        var _this = this;
        this.menu_btn = $("#spd-body-menu li");
        this.menu_frame = $("#spd-body-content .spd-body-content-frame");
        this.active = this.menu_btn.filter(".active").attr("name");
        this.menu_btn.click(function(){
            var isRef = "true";
            window.localStorage.setItem("isRef",isRef);
            if($(this)[0].innerText === "对比") return;
            $('#flow-table-block .resizable-span').trigger("click");
            _this.toggle($(this).attr("name"));
            setTimeout(function(){
                $('#flow-table-block .resizable-span').trigger("click");
            },60)
        });
        this.menu_setting = $('#spd-body-menu li[name="settings"]');
    },
    toggle: function(name){
        if(name == this.active){
            return;
        }

        var settingsTab = this.menu_btn.filter("[name='settings']");
        if (name != 'settings') {
            settingsTab.find("a.spd-tab-close").hide();
            settingsTab.unbind('hover').hover(function(){
                $(this).find('a.spd-tab-close').show();
            }, function(){
                if (!settingsTab.hasClass('active')) {
                    $(this).find('a.spd-tab-close').hide();
                }
            });
        } else {
            this.menu_btn.filter("[name='settings']").find("a.spd-tab-close").show();
        }

        if (name != 'preview') {
            this.menu_btn.removeClass("active");
            this.menu_btn.filter("[name='"+name+"']").addClass("active");
        } else {
            this.menu_btn.removeClass("active");
            this.menu_btn.filter("[name='map']").addClass("active");
        }

        CBMSFLOW.util.to_hash_url(name);

        this.menu_frame.removeClass("active");
        this.menu_frame.filter("[name='"+name+"']").addClass("active");
        this.active = name;
        this.trigger("toggle", name);
        this.updateSettings(name);
    },
    activeFrame:function(){
        return this.menu_frame.filter(".active");
    },
    getFrame:function(name){
        return this.menu_frame.filter("[name='"+name+"']");
    },
    updateSettings:function(name){
        if(name == 'settings'){
            this.showSettings();
            this.menu_setting.find('.spd-tab-close').removeClass('black');
        }else{
            this.menu_setting.find('.spd-tab-close').addClass('black');
        }
    },
    showSettings:function(){
        this.menu_setting.show();
    },
    hideSettings:function(){
        this.menu_setting.hide();
    }
});


