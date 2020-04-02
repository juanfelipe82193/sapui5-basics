sap.ui.define(["sap/ovp/cards/generic/Component"],
    function (CardComponent) {
        "use strict";

        return CardComponent.extend("sap.ovp.cards.custom.Component", {
            // use inline declaration instead of component.json to save 1 round trip
            metadata: {
                properties: {
                    "contentFragment": {
                        "type": "string"
                    },
                    "headerExtensionFragment": {
                        "type": "string"
                    },
                    "contentPosition": {
                        "type": "string",
                        "defaultValue": "Middle"
                    },
                    "footerFragment": {
                        "type": "string"
                    },
                    "identificationAnnotationPath": {
                        "type": "string",
                        "defaultValue": "com.sap.vocabularies.UI.v1.Identification"
                    },
                    "selectionAnnotationPath": {
                        "type": "string"
                    },
                    "filters": {
                        "type": "object"
                    },
                    "parameters": {
                        "type": "object"
                    },
                    "addODataSelect": {
                        "type": "boolean",
                        "defaultValue": false
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
