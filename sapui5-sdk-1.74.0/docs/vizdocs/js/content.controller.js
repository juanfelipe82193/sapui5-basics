sap.ui.controller("js.content", {
    /**
     * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
     * This hook is the same one that SAPUI5 controls get after being rendered.
     * @memberOf js.docs
     */
    onAfterRendering: function() {
        var self = this;
        //if(!util.isApple()) {
            $("#splitterV").parent()[0].style.position ='absolute';
            $("#splitterV").parent()[0].style.top ='111px';
            $("#splitterV").parent()[0].style.bottom ='28px';
            $("#splitterV").parent()[0].style.right ='0px';
            $("#splitterV").parent()[0].style.left ='0px';
        //}
        this.registerOnloadAction();

        // Hard code: change the `overflow` of div#splitterV_firstPane
        $("#splitterV_firstPane").css("overflow", "hidden");
        $(CONSTANT.IFRAME).load(function() {
            window._loaded = true;
            util.hideLoading();
        });
    },

    registerOnloadAction: function() {
        var ifr = document.getElementById(CONSTANT.IFRAME);
        ifr.onload = function() {
            setTimeout(function(){
            var pageLength = util.getPageLength();
            var myFrame = document.getElementById(CONSTANT.IFRAME);
            var ifrmHeight = $(myFrame).height();
                //var ifrmHeight = $(window).height() - 111 - 28;
            if(pageLength>(ifrmHeight+28)){
                //hide bottom and expand iframe
                util.hideBtmEpdIfrm();
            }else{
                //show bottom and narrow iframe.
                util.showBtmClpsIfrm();
            }
            util.startSrollListener();
            }, 200);
        };
    },

    selectSubmenuHandler: function(subMenu, data, queryStr, treeSel) {
        var leftPart = jQuery.sap.domById(CONSTANT.FILTERTREE);
        var filterTree = sap.ui.getCore().byId(CONSTANT.FILTERTREE);
        var filterField = jQuery.sap.domById(CONSTANT.FILTERFIELD);
        if(subMenu==="chartProperty"){  //Chart property is special one. //Todo: conside a more common solution for it.
            leftPart.style.display = '';
            filterTree.oController.clearTree();
            filterTree.oController.addTree(parent.window._CHARTSET);
            if(data.url && (!treeSel || !treeSel.length)){
                util.loadPageToIframe(data.url + queryStr);
                filterTree.oController.expandRootNode();
            }else{
                //Expand tree and load url saved in the node..
                filterTree.oController.processSelection(treeSel, queryStr);
            }
        }else if (data.url && !(data.path&&data.path.length)) { //only url: load this url and hide leftpart
            util.loadPageToIframe(data.url + queryStr);
            leftPart.style.display = 'none';
        } else if (data.path&&data.path.length) {
            //add path to tree
            this.initTree(data);
            //submeu has url, load url and add path to tree, but don't load url in the leaf.
            if(data.url && (!treeSel || !treeSel.length)){
                util.loadPageToIframe(data.url + queryStr);
               filterTree.oController.expandRootNode();
            }else{
                //Expand tree according to path and load url in the leaf.
                filterTree.oController.processSelection(treeSel, queryStr);
            }
        } else {
            util.log('configure file has error.');
            return;
        }
        this.adjustIfrmSize();
    },
    initTree: function(data) {
        var leftPart = jQuery.sap.domById(CONSTANT.FILTERTREE);
        var filterTree = sap.ui.getCore().byId(CONSTANT.FILTERTREE);
        var filterField = jQuery.sap.domById(CONSTANT.FILTERFIELD);
            leftPart.style.display = '';
            filterTree.oController.clearTree();
            var treeData=[];
            $.ajaxSettings.async = false;
            for (var i = 0; i < data.path.length; i++) {
                $.getJSON(data.path[i], function(dt) {
                    if (dt && (dt instanceof Array)) {
                        util.mergeConfigData(dt, treeData);
                    }
                })
                .fail(function(jqxhr) {
                    console.log("Reading file:" + data.path[i] + " fails, please check the file");
                });
            }
            for (var j = 0; j < treeData.length; j++) {
                filterTree.oController.addTree(treeData[j]);
            };
            $.ajaxSettings.async = true;
    },

    navigationHandler: function(url) {
        var selections = util.analyseTreeNodeFromUrl(url);
        if(!selections.length){
            util.log("no submenu info in url in docs page, default page: "+this._keys[0] + " is loaded.");
            selections.push(this._keys[0]);
        }
        for (var i = 0; i < this._keys.length; i++) {
            if (selections[0] === this._keys[i]) { //first one is for submenu, others are for tree.
                this.selectedKey = this._keys[i];
                util.urlRecorder.recordUrl(this._keys[i], 1);
                var queryStr = util.getQueryStringFromUrl(url);
                this.selectSubmenuHandler(this._keys[i], this._datas[i], queryStr, selections.slice(1));
                break;
            }
        }
    },

    resize: function(initial) {
        this.adjustSubmenuPos();
        this.adjustIfrmSize();
    },

    highlightSubMenu: function(key) {
        var removeSelectedClassForSubTab = function() {
            var label = $(".subTabLabelOnSelect");
            label.removeClass('subTabLabelOnSelect');
            label.addClass('subTabLabel');
        };
        var showSubTabLabel = function(key) {
            var label = $("#" + key + "subTabLabel");
            label.removeClass('subTabLabel');
            label.addClass('subTabLabelOnSelect');
        };

        if(key || this.selectedKey){
        removeSelectedClassForSubTab();
            showSubTabLabel(key || this.selectedKey);
        }
    },

    adjustSubmenuPos: function() {
        var subTabLabelWidth = 0;
        if (this._keys) {
            this._keys.forEach(function(key, index) {
                var label = $("#" + key + "subTabLabel");
                if (label.length) {
                    subTabLabelWidth += label.parent().width();
                }
            });
        $("#htmlSubtabSpace").css({
                width: ($("#"+CONSTANT.HTZ_LO_SUBMENULAYER).width() - subTabLabelWidth) / 2 + "px"
        });
        }
    },

    adjustIfrmSize: function() {
        var submenuLayer = jQuery.sap.domById(CONSTANT.HTZ_LO_SUBMENULAYER);
        var filterTree = jQuery.sap.domById(CONSTANT.FILTERTREE);
        var filterField = jQuery.sap.domById(CONSTANT.FILTERFIELD);
        var splitter = sap.ui.getCore().byId(CONSTANT.SPLITTERV);
        if(submenuLayer.style.display!=='none'){
            if (filterTree.style.display === 'none') {
                //if leftpart is invisible, expand iframe width to 100%.
                splitter.setSplitterPosition("0%");
                splitter.setSplitterBarVisible(false);
            } else if(filterField.style.display == 'none'){
                //hidden button is pressed.
                var ratio = util.calSplitterPos();
                splitter.setSplitterPosition(ratio+"%");
                splitter.setSplitterBarVisible(true);
            } else {
                //normal case
                splitter.setSplitterPosition("20%");
                splitter.setSplitterBarVisible(true);
            }
        }

        this.adjustFilterTreeSize();
    },

    adjustFilterTreeSize: function () {
        var filterTree = sap.ui.getCore().byId(CONSTANT.FILTERTREE);
        var toolbar = sap.ui.getCore().byId(CONSTANT.FILTERTREE_TOOLBAR);
        var scrollPanelContainer = sap.ui.getCore().byId(CONSTANT.SCROLLPANELCONTAINER);
        var toolbarHeight = toolbar.$().outerHeight();
        var filterTreeHeight = filterTree.$().outerHeight();

        scrollPanelContainer.setHeight(filterTreeHeight - toolbarHeight + "px");
    },

    readConfig: function(pathName) {
        var self = this;
        $.ajaxSettings.async = false;
        $.getJSON(pathName, function(data) {
            var keys = [];
            var items = [];
            var prop;
            for (var i = 0; i < data.length; i++) {
                var key = data[i]['key'];
                if (key) {
                    keys.push(key);
                    items.push(data[i]);
                }
            }
            self._datas = items;
            window._subMenuItems = items;
            self._keys = keys;
            self.addLabels(self._datas);
        }).fail(function(jqxhr){
            console.log("Reading file:"+pathName + " fails, please check the file");
        });
        $.ajaxSettings.async = true;
    },
    addLabels : function(data){
        var self = this;
        var gap = 0;
        var subMenuZone = sap.ui.getCore().byId(CONSTANT.HTZ_LO_SUBMENULAYER);
        var contents = subMenuZone.getContent();
        contents.forEach(function(item){
            item.destroy();
        });
        subMenuZone.removeAllContent();
        var htmlSubtabSpace = sap.ui.getCore().byId("htmlSubtabSpace")
        if(htmlSubtabSpace){
            htmlSubtabSpace.destroy();
        }
        htmlSubtabSpace = new sap.ui.core.HTML("htmlSubtabSpace", {
            content: "<div style='position:relative;width:500px;height:60px;'></div>"
        });
        subMenuZone.addContent(htmlSubtabSpace);
        for (var i = 0; i < data.length; i++) {
            var key = data[i]["key"];
            var text = data[i]["text"];
            var aLabel;
            //if submenu has not url or path, disable it.
            if(data[i]["path"].length>0 || data[i]["url"]){
                aLabel = util.createLabel(key + "subTabLabel", text,
                "subTabLabel");
            }else{
                aLabel = util.createLabel(key + "subTabLabel", text,
                "subTabLabelDisabled");
            }
            if (i === (data.length - 1)) {
                aLabel.onAfterRendering = function() { //Something should be done after the last label is Rendered.
                    self._keys.forEach(function(key, index) {
                        $("#" + key + "subTabLabel.subTabLabel").bind('click', function(e) {
                            self.highlightSubMenu(key);
                            var url = util.urlRecorder.recordUrl(key, 1);
                            util.updateLocation(url);
                            self.selectSubmenuHandler(key, self._datas[index], "");
                        });
                    });
                    self.adjustSubmenuPos();
                    self.highlightSubMenu();
                };
            }
            var splitLabel;
            subMenuZone.addContent(aLabel, {
                position: 'absolute',
                right: gap + 'px'
            });
            gap += 50;
            if (i < data.length - 1) {
                splitLabel = util.createLabel(key + 'split' + "Label", "|",
                    "splitLabel");
                subMenuZone.addContent(splitLabel, {
                    position: 'absolute',
                    right: gap + 'px'
                });
                gap += 20;
            }
        }
    }
});
