/*global sap, jQuery, JSONModel*/
sap.ui.controller("sap.ushell.demo.AppStateFormSample.view.EditIconForm", {
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Detail
*/
    onInit: function () {
        "use strict";
        var val,
            oModel = this.getView() && this.getView().getModel("AppState");
        if (oModel) {
            val = this.getRouter().getRoute().getName() === "editIconFavorite";
            oModel.setProperty("/appState/editRecord", val);
        }
    },

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.Detail
*/
//  onBeforeRendering: function () {
//
//},

    getRouter: function () {
        "use strict";
        return sap.ui.core.UIComponent.getRouterFor(this);
    },

    handleBtn1Press : function () {
        "use strict";
        this.getMyComponent().navTo("toView2");
    },

    getMyComponent: function () {
        "use strict";
        var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
        return sap.ui.component(sComponentId);
    },

    findIndex : function (sId, aArray) {
        "use strict";
        return aArray.reduce(function (prevValue, currentElement, index) {
            if (currentElement.Key === sId) {
                return index;
            }
            return prevValue;
        }, aArray.length);
    },

    onToggleEditMode : function () {
        "use strict";
        var oModel,
            state,
            oMyIconList,
            idx;
        oModel = this.getView().getModel("AppState");
        oModel.setProperty("/appState/editEnabled", !oModel.getProperty("/appState/editEnabled"));
        if (oModel.getProperty("/appState/editEnabled")) {
            oModel.setProperty("/other/editButtonText", "Cancel");
            oModel.setProperty("/appState/undoStack", []);
            oModel.setProperty("/appState/undoStackPresent", false);
            this.getMyComponent().navTo("editIconFavorite");
        } else {
            oModel.setProperty("/other/editButtonText", "Edit Icon");
            this.getMyComponent().navTo("displayIcon");
        }
    },

    onBtnBackPressed : function () {
        this.getMyComponent().navTo("displayFavorites");
    },

    onAddOrSavePress : function () {
        "use strict";
        // add the current model to the favorites (or update the values therein).
        var oModel,
            state,
            oMyIconList,
            idx;
        oModel = this.getView().getModel("AppState");
        state = oModel.getProperty("/appState/editRecord");
        oMyIconList = oModel.getProperty("/pers/myicons") || [];
        idx = this.findIndex(state.Key, oMyIconList);
        oMyIconList[idx] = state;
        oModel.setProperty("/pers/myicons", oMyIconList);
        oModel.setProperty("/appState/editEnabled", true);
        this.getMyComponent().updateBackend();
        this.onToggleEditMode();
    },

    onDeletePress : function () {
        "use strict";
        var oModel,
            state,
            oMyIconList,
            idx;
        oModel = this.getView().getModel("AppState");
        // add the current model to the favorites (or update the values therein).  
        state = oModel.getProperty("/appState/editRecord");
        oMyIconList = oModel.getProperty("/pers/myicons") || [];
        idx = this.findIndex(state.Key, oMyIconList);
        if (idx < oMyIconList.length) {
            oMyIconList.splice(idx, 1);
        }
        oModel.setProperty("/pers/myicons", oMyIconList);
        this.getMyComponent().updateBackend();
        this.onToggleEditMode();
    },

    onUndoPress : function () {
        "use strict";
        var aUndoStack,
            sLastKey,
            oModel;
        oModel = this.getView().getModel("AppState");
        this.getMyComponent().inEvent = true;
        // add the current model to the favorites (or update the values therein).  
        aUndoStack = oModel.getProperty("/appState/undoStack");
        aUndoStack.pop();
        this.getMyComponent().inEvent = false;
        if (aUndoStack.length > 0) {
            sLastKey = aUndoStack[aUndoStack.length - 1];
            this.getRouter().navTo("editIconFavorite", {iAppState : sLastKey});
        } else {
            this.getMyComponent().inEvent = true;
            oModel.setProperty("/appState/undoStackPresent", aUndoStack.length > 0);
            this.getMyComponent().inEvent = false;
        }
        //oModel.setProperty("/appState/undoStack", aUndoStack);
        //? pop sLastKey = oUndoStack.pop();
    }


/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.Detail
*/
//onAfterRendering: function() {
//
//},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.Detail
*/
//onExit: function() {
//
//}

});