sap.ui.define(["sap/ovp/cards/generic/Component"],
    function (CardComponent) {
        "use strict";

        return CardComponent.extend("sap.ovp.cards.stack.Component", {
            // use inline declaration instead of component.json to save 1 round trip
            metadata: {
                properties: {
                    "contentFragment": {
                        "type": "string",
                        "defaultValue": "sap.ovp.cards.stack.Stack"
                    },
                    "controllerName": {
                        "type": "string",
                        "defaultValue": "sap.ovp.cards.stack.Stack"
                    },
                    "contentPosition": {
                        "type": "string",
                        "defaultValue": "Right"
                    },
                    "objectStreamCardsSettings": {
                        "type": "object",
                        "defaultValue": {}
                    },
                    "objectStreamCardsTemplate": {
                        "type": "string",
                        "defaultValue": "sap.ovp.cards.quickview"
                    },
                    "objectStreamCardsNavigationProperty": {
                        "type": "string"
                    }
                },

                version: "1.74.0",

                library: "sap.ovp",

                includes: [],

                dependencies: {
                    libs: [],
                    components: []
                },
                config: {}
            }
        });
    }
);
