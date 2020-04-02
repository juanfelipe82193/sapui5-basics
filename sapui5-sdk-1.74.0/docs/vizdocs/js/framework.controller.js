sap.ui.controller("js.framework", {
    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of
     # the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf js.framework
     */
    onAfterRendering: function() {
        var self = this;

        window._menus.forEach(function(key) {
            $("#" + CONSTANT.MAINVERTICALLAYOUT).after("<div id=\"" + key + "LabelArrow\"" +
                " class=\"LabelArrow\"></div>");
            $("#" + key + "LabelArrow").css({
                'visibility': 'hidden'
            });
            $("#" + key + "Label").bind('click', function(e) {
                var url = util.urlRecorder.recordUrl(key, 0);
                util.updateLocation(url);
                sap.ui.core.BusyIndicator.show();
                self.selectMenu(key);
                sap.ui.core.BusyIndicator.hide();
            });
        });

        var iFrm = document.getElementById(CONSTANT.IFRAME);
        iFrm.addEventListener("switchPage", function(e) {
            util.log("Get switchPage event " + e.location + "in control page");
            window._nav = true;
            var url = util.analyseUrl(e.location);
            self.navigationHandler(url);
            util.updateLocation(url);
        });

        this.adjustElementPosition();

        //Time out is necessary, otherwise tree will not be drawn correctly.
        setTimeout(function() {
            var url = util.analyseUrl(util.getCurrentAddress());
            self.navigationHandler(url);
        }, 0);

        var timer = null;
        window.onresize = function(e) {
            // prevent that trigger resize event more than once;
            if (timer == null) {
                timer = setTimeout(function() {
                    self.resize();
                    timer = null;
                }, 200);
            }
        };
        util.addEvent(window, "popstate", function(e) {
            var url = util.analyseUrl(util.getCurrentAddress());
            self.navigationHandler(url);
        });
    },

    navigationHandler: function(url) {
        util.urlRecorder.recordUrl(url.menu ? url.menu : url, 0);
        this.selectMenu(url);
    },

    adjustElementPosition: function(initial) {
        this.changeLabelPosition();
        this.changeArrowPosition();
    },

    resize: function() {
        this.adjustContainerSize();
        this.changeLabelPosition();
        this.changeArrowPosition();
    },

    selectMenu: function(key) {
        this.highlightMenu(key.menu ? key.menu : key);
        this.loadMenuPage(key);
    },

    loadMenuPage: function(url) {
        var iFrm = document.getElementById(CONSTANT.IFRAME);
        if (!iFrm) {
            util.log(CONSTANT.IFRAME + " isn't found");
            return;
        }
        var key = url.menu ? url.menu : url;
        if (window._menus) {
            for (var i = 0; i < window._menus.length; i++) {
                if (window._menus[i] === key) {
                    var location = window._navItems[i]['url'];
                    if (!location && window._navItems[i]['path']) {
                        this.showSubmenuTree();
                        var docView = sap.ui.getCore().byId(CONSTANT.CONTENTVIEW);
                        docView.oController.readConfig(window._navItems[i]['path']);
                        docView.oController.navigationHandler(url.innerPageLoc);
                        //util.showSubMenuNarIfrm();
                        window._singlePage = false;
                    } else {
                        window._singlePage = true;
                        var docView = sap.ui.getCore().byId(CONSTANT.CONTENTVIEW);
                        this.hideSubmenuTree();
                        //util.hideSubMenuEpdIfrm();
                        if (url.innerPageLoc && url.innerPageLoc !== "/") {
                            location += "#" + url.innerPageLoc;
                        }
                        //iFrame.setAttribute("src", window._navItems[i]['url'] + (url.innerPageLoc?("?"+url.innerPageLoc):""));
                        //$(iFrame).replaceWith('<iframe id="iFrame" src="' + location + '"></iframe>');
                        //replace is only choice, otherwise browser will remember the new url and break the mechanism of ourself.
                        util.locReplace(iFrm, location);
                        util.log("location: " + location + " is loaded");
                        if (iFrm.contentWindow.location.pathname.indexOf(window._navItems[i]['url']) !== -1) {
                            //Force to reload if main page no changed.
                            iFrm.contentWindow.location.reload();
                        }
                    }
                    this.adjustContainerSize();
                    return;
                }
            }
        }
    },
    showSubmenuTree: function() {
        this._hideSubmenuTree(false);
    },
    hideSubmenuTree: function() {
        this._hideSubmenuTree(true);
    },
    _hideSubmenuTree: function(isHidden) {
        var leftPart = jQuery.sap.domById(CONSTANT.FILTERTREE);
        var submenuLayer = jQuery.sap.domById(CONSTANT.HTZ_LO_SUBMENULAYER);
        var splitter = sap.ui.getCore().byId(CONSTANT.SPLITTERV);
        if (isHidden) {
            leftPart.style.display = 'none';
            submenuLayer.style.display = 'none';
            splitter.setSplitterPosition("0%");
            splitter.setSplitterBarVisible(false);
            $("#splitterV").parent()[0].style.top = '50px';
        } else {
            leftPart.style.display = '';
            submenuLayer.style.display = '';
            splitter.setSplitterPosition("20%");
            splitter.setSplitterBarVisible(true);
            $("#splitterV").parent()[0].style.top = '111px';
        }
    },

    highlightMenu: function(key) {
        var clearSelectedLabel = function() {
            if (window._menus) {
                for (var i = 0; i < window._menus.length; i++) {
                    var label = $("#" + window._menus[i] + "Label");
                    label.removeClass('menuLabelOnSelect');
                    label.addClass('menuLabel');
                    $("#" + window._menus[i] + "LabelArrow").css({
                        'visibility': 'hidden'
                    });
                }
            }
        };

        clearSelectedLabel();
        $("#" + key + "LabelArrow").css({
            'visibility': 'visible'
        });
        $("#" + key + "Label").addClass('menuLabelOnSelect');
    },

    changeArrowPosition: function() {
        var list = window._menus;
        for (var i = 0; i < list.length; i++) {
            var key = list[i];
            var label = $("#" + key + "Label");
            if (label.length) {
                $("#" + key + "LabelArrow").css({
                    'position': 'absolute',
                    'top': label.height(),
                    'left': label.offset().left + (label.width() + 12) / 2
                });
            }
        }
    },

    changeLabelPosition: function() {
        var list = window._menus;
        var labelWidth = 0;
        for (var i = 0; i < list.length; i++) {
            var key = list[i];
            var label = $("#" + key + "Label");
            if (label.length) {
                labelWidth += label.parent().width();
            }
        }
        var headDiv = $("#" + CONSTANT.HEADERDIV);
        $("#" + CONSTANT.BLANKSPACE).css({
            width: $("#" + CONSTANT.MENUZONELAYER).width() - headDiv.width() - labelWidth - 20 + "px"
        });
    },

    adjustContainerSize: function() {
        //adjust size of doc's view 
        var docView = sap.ui.getCore().byId(CONSTANT.CONTENTVIEW);
        docView.oController.resize();
    },
    addLabels: function(menuZone) {
        var self = this;
        var gap = 0;
        for (var i = 0; i < window._menus.length; i++) {
            var key = window._menus[i];
            var text = window._navItems[i]["text"];
            var aLabel = util.createLabel(key + "Label", text,
                "menuLabel");
            menuZone.addContent(aLabel, {
                position: 'absolute',
                right: gap + 'px'
            });
            gap += 50;
        }
    }
});