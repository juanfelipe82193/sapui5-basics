/*global sap, jQuery, JSONModel*/
sap.ui.controller("sap.ushell.demo.AppNavSample2.view.View2", {

    renderIcons : function (sCollectionName) {
        "use strict";
        var sUri = "sap-icon://Fiori2/F0002",
            nr,
            that,
            names;
        if (sap.ui.core.IconPool.getIconCollectionNames().indexOf(sCollectionName) < 0) {
            // in the noshell use case, the icon collections are not registered
            return;
        }
        names = sap.ui.core.IconPool.getIconNames(sCollectionName);
        if (!names) {
            return;
        }
        nr = names.length;
        that = this;
        that.getView().byId("pgView2").addContent(new sap.m.Text({text: sCollectionName + ": " + nr + "icons"}));
        names.forEach(function (nm, idx) {
            sUri = "sap-icon://" + sCollectionName + "/" + nm;
            that.getView().byId("pgView2").addContent(new sap.ui.core.Icon({
                height: "38px",
                //press: chips.tiles.utils.onSelectIcon.bind(null, oController),
                size: "2rem",
                src: sUri,
                tooltip: sUri + "(" + idx + ")",
                width: "38px"
            }));
        });
    },

    /**
    * Called when a controller is instantiated and its View controls (if available) are already created.
    * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
    * @memberOf view.Detail
    */
    onInit: function () {
        "use strict";
        this.renderIcons("Fiori2");
        this.renderIcons("Fiori3");
        this.renderIcons("Fiori4");
        this.renderIcons("Fiori5");
        this.renderIcons("Fiori6");
        this.renderIcons("Fiori7");
        this.renderIcons("Fiori8");        
        this.renderIcons("BusinessSuiteInAppSymbols");
        this.renderIcons("FioriInAppIcons");
        this.renderIcons("FioriNonNative");
    },


    /**
    * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
    * (NOT before the first rendering! onInit() is used for that one!).
    * @memberOf view.Detail
    */
    // onBeforeRendering: function() {
    //
    // },

    getRouter: function () {
        "use strict";
        return sap.ui.core.UIComponent.getRouterFor(this);
    },

    handleBtn1Press : function () {
        "use strict";
        this.getRouter().navTo("toView1");
    },

    handleBtn2Press : function () {
        "use strict";
        this.getRouter().navTo("toDetail");
    }
/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.Detail
*/
// onAfterRendering: function() {
//
//  },

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.Detail
*/
// onExit: function() {
//
// }

});