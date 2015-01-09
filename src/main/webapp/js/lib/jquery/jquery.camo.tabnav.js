// custom plugin for tab navigation
(function($) {
    var _initialized = false;

    $.fn.tabnav = function(options) {

        // set configuration
        var conf = $.extend({}, $.fn.tabnav.defaults, options);

        // init the plugin - is called only one time per page, and not for every
        // call of *.tabnav()
        if (!_initialized) {
            // do all initialization here
            _initialized = true;
        }

        // set style of disabled tabs
        var arrLength = conf.disabledTabs.length;
        for (var index = 0; index < arrLength; index++) {
            $("#" + conf.disabledTabs[index]).attr('class', 'disabled-tab');
        }

        // select given tab
        if ("" != conf.openTabId) {
            var tabToSelect = $("#" + conf.openTabId);
            if (1 == tabToSelect.length) {
                switchTab(this, tabToSelect);
            }
        } else {
            // find first tab
            var firstTab = this.children("li:first");
            if (firstTab) {
                switchTab(this, firstTab);
            }
        }

        return this.each(function() {
            $thisTabbar = $(this);
            $thisTabbar.children("li").click(function() {
                var isDisabled = false;
                var arrLength = conf.disabledTabs.length;
                for (var index = 0; index < arrLength; index++) {
                    // check if tab is disabled
                    if ($(this).attr('id') == conf.disabledTabs[index]) {
                        isDisabled = true;
                    }
                }
                // check if there are unsaved changes - via callback function
                if (false == isDisabled && conf.validatorCallback.call(undefined, $(this).attr('id'))) {
                    // do switch
                    switchTab($thisTabbar, $(this));
                }
            });
        });

        /** ******************** */
        /** private functions * */
        /** ******************** */
        function switchTab(tabbar, tab) {
            // set all tabs deselected
            tabbar.children("li").removeClass("selected");
            // select new tab
            tab.addClass("selected");
            if ("true" == tab.attr("lazy") && "true" != tab.attr("loaded")) {

                var attr = tab.attr('url');
                if (typeof attr !== 'undefined' && attr !== false) {
                    $('#' + tab.attr("contentId")).load(contextPath + attr, function() {
                        var fn = tab.attr("initFunction");
                        if (fn in window) {
                            window[fn]();
                        }
                    });
                } else {
                    var fn = tab.attr("initFunction");
                    if (typeof fn !== 'undefined' && fn !== '') {
                        if (fn in window) {
                            window[fn]();
                        }
                    }
                }
                tab.attr("loaded", "true");
            }
            // hide all tab contents
            tabbar.children("li").each(function() {
                $("#" + $(this).attr("contentId")).css("display", "none");
            });
            // show new tab content
            $("#" + tab.attr("contentId")).css("display", "table");
            
            resetTabNavWidth(tabbar);
        }
        
        //after all initialization hack for IE9 -> reset tabs ul size
        resetTabNavWidth($(this));
        
        
    }; // end of: $.fn.tabnav

    // this function was implement only as hack for IE9 to reset tabs container width
    // for preventing strange behavior of IE9 by clicking on white space and jumping to first tab
    function resetTabNavWidth(tabbar){
        if (navigator.userAgent.search("MSIE 9") > 0 || navigator.userAgent.search("MSIE 8") > 0) {
            var sum = 0;
            var li = tabbar.children("li");
            for (var i = 0; i < li.length; i++) {
              sum += $(li[i]).width();
            }
            tabbar.width(sum + 15 + 'px');
        }
    };
    
    // default settings of the plugin
    $.fn.tabnav.defaults = {
        openTabId : "",
        validatorCallback : function() {
            return true;
        },
        disabledTabs : []
    };
})(jQuery);
