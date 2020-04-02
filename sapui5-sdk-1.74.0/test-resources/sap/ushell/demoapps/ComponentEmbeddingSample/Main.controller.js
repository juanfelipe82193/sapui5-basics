/*global sap, jQuery*/

(function () {
    "use strict";
    sap.ui.controller("sap.ushell.demo.ComponentEmbeddingSample.Main", {

        /**
         * Trigger loading of component.
         */
        handleLoadComponent: function () {
            var sIntent = this.getView().byId("inputNavigationIntent").getValue(),
                bAsync = this.getView().byId("checkBoxAsync").getSelected(),
                oComponentContainer = this.getView().byId("componentContainer"),
                oConfig = bAsync ? {
                        "async": true,
                        "asyncHints": {
                            "libs": ["sap.ca.scfld.md", "sap.ca.ui", "sap.me", "sap.ui.unified"]
                        }
                    } : undefined;

            sap.ushell.Container.getService("CrossApplicationNavigation").createComponentInstance(sIntent, oConfig)
                .done(function (oComponent) {
                    oComponentContainer.setComponent(oComponent);
                })
                .fail(function (oError) {
                    sap.m.MessageToast.show(oError);
                    jQuery.sap.log.error(oError);
                });
        }

    });
}());