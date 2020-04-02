sap.ui.define([
    "sap/ovp/cards/generic/Component",
    "test-resources/sap/ovp/qunit/cards/utils",
    "test-resources/sap/ovp/mockservers",
    "jquery.sap.global"
], function (genComponent, utils, mockservers, jquery) {
    "use strict";
    /*global jQuery, sap */

    //jQuery.sap.declare("sap.ovp.test.qunit.cards.headerExtension.Component");
    //jQuery.sap.require("sap.ovp.cards.generic.Component");

    genComponent.extend("sap.ovp.test.qunit.cards.headerExtension.Component", {
        metadata: {
            properties: {
                "contentFragment": {
                    "type": "string",
                    "defaultValue": "sap.ovp.cards.list.List"
                },
                "headerExtensionFragment" : {
                    "type": "string",
                    "defaultValue": "sap.ovp.test.qunit.cards.headerExtension.headerExtension"
                }
            },

            version: "1.74.0",

            library: "sap.ovp",

            includes: [],

            dependencies: {
                libs: [ "sap.m" ],
                components: []
            },
            config: {},
            customizing: {
                "sap.ui.controllerExtensions": {
                    "sap.ovp.cards.generic.Card": {
                        controllerName: "sap.ovp.cards.list.List"
                    }
                }
            }
        }
    });
});
