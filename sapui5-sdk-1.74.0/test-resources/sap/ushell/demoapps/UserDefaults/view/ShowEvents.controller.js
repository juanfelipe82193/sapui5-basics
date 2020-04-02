/*global sap, jQuery */
sap.ui.controller("sap.ushell.demo.UserDefaults.view.ShowEvents", {

        /**
        * Called when a controller is instantiated and its View controls (if available) are already created.
        * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
        * @memberOf view.Detail
        */
        onInit: function () {
            "use strict";
            var that = this;
            this.oModel = new sap.ui.model.json.JSONModel({
                aParameterNames: [{name: "InitialParameterName1"}]
            });
            this.getView().setModel(this.oModel);

            if (!sap.ushell.demo.UserDefaults.Component.staticListener) {
                this.registerStaticListener();
                // map the static model into our
                this.getView().setModel(sap.ushell.demo.UserDefaults.Component.staticListener.getModel(), "storeEvent");
            }
            // fill the parameters directly on startup
            this.handleRefreshParameters();
       },

       registerStaticListener : function() {
           var oModel = new sap.ui.model.json.JSONModel({ count : 0, lastEvent : "no event"});
           sap.ushell.Container.getService("UserDefaultParameters").attachValueStored(function (oValue) {
               var newCount = (oModel.getProperty("/count") || 1) + 1;
               oModel.setProperty("/count", newCount);
               var newValue = "name:\"" + oValue.getParameter("parameterName") + "\" new value:" + JSON.stringify(oValue.getParameter("parameterValue")) + "";
               oModel.setProperty("/lastEvent", newValue);
           });
           sap.ushell.demo.UserDefaults.Component.staticListener = {
                   getModel : function() { return oModel; }
           };
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
            return this.getOwnerComponent().getRouter();
        },

        handleRefreshParameters : function () {
            var that = this,
                oCSTRService = sap.ushell.Container.getService("ClientSideTargetResolution");
                //sParameterName = this.getView().getModel("UserDef").getProperty("/parameterName");

            oCSTRService.getUserDefaultParameterNames().done(function(aParameterNames) {
                //sap.ushell.Container.getService("Message").show(sap.ushell.services.Message.Type.INFO, " Value is " + JSON.stringify(oValue));
                that.updateParametersForModel(aParameterNames, that.oModel);
                //that.getView().getModel("UserDef").setProperty("/value",oParameters[sParameterName].valueObject.value);
            });
        },

        updateParametersForModel : function (aParameterNames, oModel) {
            var aParameterNamesTmp = [];
            for(i in aParameterNames) {
                aParameterNamesTmp.push({name : aParameterNames[i]});
            }
            oModel.setData({ "aParameterNames": aParameterNamesTmp}, false); // false -> do not merge
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
