/*global sap, jQuery, JSONModel*/
sap.ui.controller("sap.ushell.demo.AppStateFormSample.view.Favorites", {


    /**
    * Called when a controller is instantiated and its View controls (if available) are already created.
    * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
    * @memberOf view.Detail
    */
    onInit: function () {
        "use strict";
        this.getView().setModel(this.getMyComponent().getModel("AppState"));
    },

    getMyComponent: function () {
        "use strict";
        var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
        return sap.ui.component(sComponentId);
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
        this.getRouter().navTo("IconFavoriteList", { iAppState : this.getMyComponent().getInnerAppStateKey()});
    },

    handleBtn2Press : function () {
        "use strict";
        this.getMyComponent().navTo("toDetail");
    },

    onTableItemPress: function (ev, ev2) {
        "use strict";
        var path, obj, record;
        // prepare editrecord 
        path = ev.oSource.getSelectedContextPaths()[0];
        record = ev.oSource.getModel().getProperty(path);
        obj = JSON.parse(JSON.stringify(record));
        obj.description = obj.description || "";
        obj.name = obj.semanticName || "";
        ev.oSource.getModel("AppState").setProperty("/appState/editRecord", obj);
        this.getMyComponent().navTo("displayIcon");
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