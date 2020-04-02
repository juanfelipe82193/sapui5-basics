sap.ui.controller("sap.ushell.demo.AppNavSample2.view.View1", {
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Detail
*/
    onInit: function() {
        var that = this;
        this.oModel = new sap.ui.model.json.JSONModel({
            parameterName : "UshellTest1",
            value : "",
        });
        this.getView().setModel(this.oModel, "UserDef");
    },

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.Detail
*/
//	onBeforeRendering: function() {
//
//	},

    getRouter: function() {
        return sap.ui.core.UIComponent.getRouterFor(this);
    },

    handleBtn1Press : function() {
        var v1 = "ABC_" + Number(new Date());
        this.getRouter().navTo("toView2");
    },
    handleBtnSavePress : function() {
        var sParameterName = this.getView().getModel("UserDef").getProperty("/parameterName");
        if (!sParameterName) {
            sParameterName = "UshellTest1";
        }
        var v1 = this.getView().getModel("UserDef").getProperty("/value");
        if (!v1) {
            v1 = "ABC_" + Number(new Date());
        }
        sap.ushell.Container.getService("UserDefaultParameterPersistence").saveParameterValue(sParameterName, { "value" : v1});
    },
    handleBtnDeletePress : function() {
        var sParameterName = this.getView().getModel("UserDef").getProperty("/parameterName");
        if (!sParameterName) {
            sParameterName = "UshellTest1";
        }
        sap.ushell.Container.getService("UserDefaultParameterPersistence").deleteParameter(sParameterName);
    },
    handleBtnLoadPress : function() {
        var that = this;
        var sParameterName = this.getView().getModel("UserDef").getProperty("/parameterName");
        if (!sParameterName) {
            sParameterName = "UshellTest1";
        }
        sap.ushell.Container.getService("UserDefaultParameterPersistence").loadParameterValue(sParameterName).done(function(oValue) {
            sap.ushell.Container.getService("Message").show(sap.ushell.services.Message.Type.INFO, " Value is " + JSON.stringify(oValue));
            that.getView().getModel("UserDef").setProperty("/value",oValue);
        }).fail(function(sMsg) {
            sap.ushell.Container.getService("Message").show(sap.ushell.services.Message.Type.INFO, " Fail: Msg is " + sMsg);
            that.getView().getModel("UserDef").setProperty("/value","<error>"+ sMsg);
        });
    },
    handleBtngetStoredParameterNamesPress : function() {
        sap.ushell.Container.getService("UserDefaultParameterPersistence").getStoredParameterNames().done(function(oValue) {
            sap.ushell.Container.getService("Message").show(sap.ushell.services.Message.Type.INFO, " Names are:" + JSON.stringify(oValue));
        }).fail(function(sMsg) {
            sap.ushell.Container.getService("Message").show(sap.ushell.services.Message.Type.INFO, " Fail: Msg is " + sMsg);
        });
    },

    handleBtn1DetermineValuePress : function() {
        var that = this;
        var sParameterName = this.getView().getModel("UserDef").getProperty("/parameterName");
        if (!sParameterName) {
            sParameterName = "UshellTest1";
        }
        sap.ushell.Container.getService("UserDefaultParameters").getValue(sParameterName).done(function(oValue) {
            sap.ushell.Container.getService("Message").show(sap.ushell.services.Message.Type.INFO, " Value is :" + JSON.stringify(oValue));
            that.getView().getModel("UserDef").setProperty("/value", oValue.value);
        }).fail(function(sMsg) {
            sap.ushell.Container.getService("Message").show(sap.ushell.services.Message.Type.INFO, " Fail: Msg is " + sMsg);
            that.getView().getModel("UserDef").setProperty("/value","<error>"+ sMsg);
        });
    },
/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.Detail
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.Detail
*/
//	onExit: function() {
//
//	}

});