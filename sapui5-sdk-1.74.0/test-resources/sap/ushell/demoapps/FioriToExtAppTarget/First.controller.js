
sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ushell/services/ShellNavigationHashChanger"
    ],
    function (Controller, ShellNavigationHashChanger) {

        "use strict";

        return Controller.extend("sap.ushell.demo.FioriToExtAppTarget.First", {

            onInit: function () {

                var oData = {param1: "[default1]", param2: "[default2]", param3: "0"},
                    oModel = new sap.ui.model.json.JSONModel(oData);

                this.getView().setModel(oModel);

                var oComponentData = this.getOwnerComponent().getComponentData();
                if (oComponentData) {
                    var oStartupParameters = oComponentData.startupParameters;
                    if(oStartupParameters.param1){
                        this.getView().getModel().setProperty("/param1", oStartupParameters.param1[0]);
                    }
                    if(oStartupParameters.param2){
                        this.getView().getModel().setProperty("/param2", oStartupParameters.param2[0]);
                    }
                    if(oStartupParameters.param3){
                        this.getView().getModel().setProperty("/param3", oStartupParameters.param3[0]);
                    }
                }
            },

            onSubmit: function() {
                this.getOwnerComponent().getRouter().navTo(
                    "Second",
                    {index: this.getView().getModel().getProperty("/param3")}
                );
            }
        });


    }, /* bExport= */ false);
