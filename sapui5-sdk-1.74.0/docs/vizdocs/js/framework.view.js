sap.ui.jsview("js.framework", {
    /** Specifies the Controller belonging to this View. 
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf js.framework
     */
    getControllerName: function() {
        return "js.framework";
    },

    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf js.framework
     */
    createContent: function(oController) {
        this.readConfigFile();

        var mainVerticalLayout = new sap.ui.layout.VerticalLayout(CONSTANT.MAINVERTICALLAYOUT, {
            width: "100%",
            height: "100%"
        });

        var header = new sap.ui.core.HTML("header", {
            content: "<div id='" +
                CONSTANT.HEADERDIV +
                "'>" +
                "<span id='headerTitle'>CVOM</span>" +
                "<span id='headerTitle2'> Visualization</span>" +
                "</div>"
        });
        var bottom = new sap.ui.core.HTML("bottom", {
            content: "<div id='" +
                CONSTANT.BOTTOMDIV + "'>" +
                "<span id='bottomTitle'>© 2015 SAP Products & Innovation Analytics</span>" +
                "</div>"
        });

        var contentView = sap.ui.view({height:"100%", id:CONSTANT.CONTENTVIEW, viewName:"js.content", type:sap.ui.core.mvc.ViewType.JS});

        var menuZone = new sap.ui.layout.HorizontalLayout(CONSTANT.MENUZONELAYER);

        menuZone.addStyleClass(CONSTANT.MENUZONELAYER);

        //Split title and menu labels.
        var blankSpace = new sap.ui.core.HTML(CONSTANT.BLANKSPACE, {
            content: "<div style='position:relative;width:500px;'></div>",
        });
        menuZone.addContent(header);
        menuZone.addContent(blankSpace);

        oController.addLabels(menuZone);

        mainVerticalLayout.addContent(menuZone);
        mainVerticalLayout.addContent(contentView);
        mainVerticalLayout.addContent(bottom);

        return mainVerticalLayout;
    },

    readConfigFile: function() {
        $.ajaxSettings.async = false;
        var fileName = "configs/navItemRegistry.json";
        $.getJSON(fileName, function(data) {
            var keys = [];
            var datas = [];
            for (var i = 0; i < data.length; i++) {
                var key = data[i]["key"];
                if (key) {
                    keys.push(key);
                    datas.push(data[i]);
                }
            }
            if (!window._menus) {
                window._menus = keys;
            }
            if (!window._navItems) {
                window._navItems = datas;
            }
        })
        .fail(function(jqxhr){
            console.log("Reading file:"+fileName + " fails, please check the file");
        });

        $.ajaxSettings.async = true;
    }
});