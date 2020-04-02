sap.ui.define(["sap/ovp/cards/generic/Component"],
    function (CardComponent) {
        "use strict";

        var oErrorComponent = CardComponent.extend("sap.ovp.cards.error.Component", {
            // use inline declaration instead of component.json to save 1 round trip
            metadata: {
                properties: {
                    "contentFragment": {
                        "type": "string",
                        "defaultValue": "sap.ovp.cards.error.Error"
                    },
                    "state": {
                        "type": "string",
                        "defaultValue": "Error"
                    },
                    "controllerName": {
                        "type": "string",
                        "defaultValue": "sap.ovp.cards.error.Error"
                    }
                },

                version: "1.74.0",
                library: "sap.ovp"

            }
        });

        return oErrorComponent;
    });

