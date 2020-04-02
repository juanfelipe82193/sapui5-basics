sap.ui.jsview("js.filterTree", {
    getControllerName: function() {
        return "js.filterTree";
    },

    /**
     * Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed.
     * Since the Controller is given to this method, its event handlers can be attached right away.
     * @memberOf js.leftPart
     */
    createContent: function(oController) {
        /**
         * ---Hierarchy of filterTree---
         * verticalLayout
         *   horizontalLayout
         *     btnHide
         *     filterLayout
         *       filterField
         *       btnClear
         *     btnExpand
         *     btnCollapse
         *   scrollPanelContainer
         *     panel
         *     ...
         *     panel
         */

        var self = this;
        var verticalLayout = new sap.ui.layout.VerticalLayout(CONSTANT.JS_FILTERTREE_VERTICALLAYOUT, {
            width: "100%"
        });

        var horizontalLayout,
            btnClear,
            filterField,
            btnExpand,
            btnCollapse;


        horizontalLayout = new sap.ui.layout.HorizontalLayout(CONSTANT.FILTERTREE_TOOLBAR);

        filterLayout = new sap.ui.commons.layout.AbsoluteLayout("filterLayout");

        filterField = new sap.ui.commons.TextField(CONSTANT.FILTERFIELD, {
            // width: "100%",
            /*height: "23px",*/
            placeholder: "Filter...",
            maxLength: 25,
            liveChange: function(event) {
                self.oController.filterFieldHandler(event);
                filterField.setValue(event.getParameter("liveValue"));
            }
        });

        btnClear = new sap.ui.commons.Image(CONSTANT.BTNCLEAR, {
          src: "resources/img/clearup.png",
          width: "16px",
          height: "16px",
          //visible: true,
          press: function(oEvent) {
            var filterField = sap.ui.getCore().byId(CONSTANT.FILTERFIELD);
            filterField.setValue("");
            oController.handleInputFilterString("");
          }
        });

        filterLayout
            .addContent(filterField)
            .addContent(btnClear, {
                top: "4px",
                right: "4px"
            });

        btnExpand = new sap.ui.commons.Button("btnExpand", {
            icon: "resources/img/expandall.png",
            lite: true,
            // height: "100%",
            width: "auto",
            tooltip: "expandAll",
            press: oController.expandAll()
        });

        btnCollapse = new sap.ui.commons.Button("btnCollapse", {
            icon: "resources/img/clapseall.png",
            lite: true,
            // height: "100%",
            width: "auto",
            tooltip: "collapseAll",
            press: oController.collapseAll()
        });

        var btnHide = new sap.ui.commons.Button("btnHide", {
            width: "26px",
            height: "26px",
            press: function(oEvent) {
                var leftPart = jQuery.sap.domById(CONSTANT.FILTERTREE);
                var btnExpand = jQuery.sap.domById("btnExpand");
                var btnCollapse = jQuery.sap.domById("btnCollapse");
                var filterField = jQuery.sap.domById(CONSTANT.FILTERFIELD);
                var filterTreeZone = jQuery.sap.domById(CONSTANT.FILTERTREE_TOOLBAR);
                var btnClear = jQuery.sap.domById(CONSTANT.BTNCLEAR);
                var container = sap.ui.getCore().byId(CONSTANT.JS_FILTERTREE_VERTICALLAYOUT);
                var splitter = sap.ui.getCore().byId(CONSTANT.SPLITTERV);
                var size = container.mAggregations.content.length;
                if (!filterField.style.display) {
                    btnExpand.style.display = 'none';
                    btnCollapse.style.display = 'none';
                    filterField.style.display = 'none';
                    btnClear.style.display = 'none';
                    for (var i = 1; i < size; i++) {
                        container.getContent()[i].addStyleClass("hidden");
                    };
                    filterTreeZone.style['border-bottom-style'] = 'hidden';
                    var ratio = util.calSplitterPos();
                    splitter.setSplitterPosition(ratio+"%");
                    splitter.setSplitterBarVisible(false);
                } else {
                    btnExpand.style.display = '';
                    btnCollapse.style.display = '';
                    filterField.style.display = '';
                    btnClear.style.display = '';
                    for (var i = 1; i < size; i++) {
                        container.getContent()[i].removeStyleClass("hidden");
                    };
                    filterTreeZone.style['border-bottom-style'] = 'solid';
                    splitter.setSplitterPosition("20%");
                    splitter.setSplitterBarVisible(true);
                }
                //sap.ui.getCore().byId(CONSTANT.DOCSPAGEMAINVLAYOUT).oParent.oController.adjustIfrmSize();
            }
        });

        horizontalLayout
            .addContent(btnHide)
            .addContent(filterLayout)
            .addContent(btnExpand)
            .addContent(btnCollapse);

        var scrollPanelContainer = new sap.m.ScrollContainer(CONSTANT.SCROLLPANELCONTAINER, {
            /*width: "275px",*/
            horizontal: true,
            vertical: true
        });

        verticalLayout
            .addContent(horizontalLayout)
            .addContent(scrollPanelContainer);

        return verticalLayout;
    }
});
