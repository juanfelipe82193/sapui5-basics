sap.ui.jsview("js.content", {
    /** Specifies the Controller belonging to this View.
     * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
     * @memberOf js.docs
     */
    getControllerName: function() {
        return "js.content";
    },

    /** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed.
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf js.docs
     */
    createContent: function(oController) {
        var mainVlayout = new sap.ui.layout.VerticalLayout(CONSTANT.DOCSPAGEMAINVLAYOUT, {
            width: "100%",
            height: "100%"
        });

        var subMenuZone = new sap.ui.layout.HorizontalLayout(CONSTANT.HTZ_LO_SUBMENULAYER);

        var contentHorizontalLayout = new sap.ui.layout.HorizontalLayout("contentHorizontalLayout");
        var leftPart = new sap.ui.view({
            id: CONSTANT.FILTERTREE,
            viewName: "js.filterTree",
            type: sap.ui.core.mvc.ViewType.JS
        });

        var innerPageIframe = new sap.ui.core.HTML({
            height: "100%",
            content: "<iframe id='" +
             CONSTANT.IFRAME +
             "' scrolling=auto frameborder=0 allowtransparency=true style='width:100%;height:100%;" +
             " border=\"none\" margin=\"0\" padding=\"0\" " +
            " position:relative;' ></iframe>"
        });

        //create a vertical Splitter
        var oSplitterV = new sap.ui.commons.Splitter(CONSTANT.SPLITTERV);
        oSplitterV.setSplitterOrientation(sap.ui.commons.Orientation.vertical);
        oSplitterV.setSplitterPosition("20%");
        var ratio = util.calSplitterPos();
        oSplitterV.setMinSizeFirstPane(ratio+"%");
        oSplitterV.setMinSizeSecondPane("50%");
        oSplitterV.setWidth("100%");
        oSplitterV.setHeight("100%");
        //adding Labels to both panes
        oSplitterV.addFirstPaneContent(leftPart);

        oSplitterV.addSecondPaneContent(innerPageIframe);

        mainVlayout.addContent(subMenuZone);

        mainVlayout.addContent(oSplitterV);

        return mainVlayout;
    }
});
