sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ushell/services/ShellNavigationHashChanger",
        'sap/ushell/components/container/ApplicationContainer'
    ],
    function (Controller, ShellNavigationHashChanger, ApplicationContainer) {

        "use strict";

        return Controller.extend("sap.ushell.demo.FioriToExtAppTarget.Second", {

            onInit: function () {

                var oData = {param1: "[default1]", param2: "[default2]", param3: "0"},
                    oModel = new sap.ui.model.json.JSONModel(oData);

                this.getView().setModel(oModel);
                this.getOwnerComponent().getRouter().getRoute("Second").attachMatched(this._onRouteMatched, this);
            },

            _onRouteMatched : function (oEvent) {
                var oArgs = oEvent.getParameter("arguments");

                var oComponentData = this.getOwnerComponent().getComponentData();
                if (oComponentData) {
                    var oStartupParameters = oComponentData.startupParameters;
                    if(oStartupParameters.param1){
                        this.getView().getModel().setProperty("/param1", oStartupParameters.param1[0]);
                    }
                    if(oStartupParameters.param2){
                        this.getView().getModel().setProperty("/param2", oStartupParameters.param2[0]);
                    }
                }
                this.getView().getModel().setProperty("/param3", oArgs.index);
            }
        });
    }, /* bExport= */ false);

