//@ui5-bundle sap/ushell/demo/AppPersSample/Component-preload.js
sap.ui.require.preload({
	"sap/ushell/demo/AppPersSample/App.controller.js":function(){// ${copyright}
/*global sap, jQuery */

sap.ui.define([
], function (Controller) {
    "use strict";

    sap.ui.controller("sap.ushell.demo.AppPersSample.App", {
        onInit: function () {
            // Read potentially existing personalization favorites.
            var that = this;
            var oId = {
                    container : "sap.ushell.demo.FruitFavorites",
                    item : "favorites"
                };

            this.oPersonalizationPromise = this.getOwnerComponent().getService("Personalization").then(function (oPersonalization) {
                var oPersonalizer,
                    oConstants;

                oConstants = oPersonalization.constants;
                oPersonalizer = oPersonalization.getPersonalizer(
                    oId, {
                        keyCategory: oConstants.keyCategory.FIXED_KEY,
                        writeFrequency: oConstants.writeFrequency.LOW,
                        clientStorageAllowed: true
                    }, that.getMyComponent()
                );

                return {
                    personalizer: oPersonalizer,
                    constants: oConstants,
                    service: oPersonalization
                };

            }, function (oError) {
                throw new Error("Cannot get Personalization service: " + oError);
            });

            this.applyExistingFruitFavorites(oId);
            this.initIceCreamFavorites();
            this.initMilkshakeFavorites();

        },

        getMyComponent: function () {
            var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
            return sap.ui.component(sComponentId);
        },


        initIceCreamFavorites : function () {
            var that = this;

            //retrieve constants from namespace 'constants' of personalization service
            this.oPersonalizationPromise.then(function (oPersonalization) {
                var oConstants;
                oConstants = oPersonalization.constants;

                // Ice cream favorites
                that.getView().byId("btnSaveIceCream").setEnabled(false);

                oPersonalization.service.getContainer("sap.ushell.IceCreamFavorites", { validity : 2, keyCategory : oConstants.keyCategory.FIXED_KEY, writeFrequency: oConstants.writeFrequency.LOW, clientStorageAllowed : false }, that.getMyComponent())
                    .done(function (oContainer) {
                        var i,
                            aPanelIceCreamFavorites = that.getView() && that.getView().byId("PanelIceCreamFavorites") && that.getView().byId("PanelIceCreamFavorites").getContent();
                        if (!aPanelIceCreamFavorites) {
                            jQuery.sap.log.error("View or control PanelIceCreamFavorites no longer present");
                            return;
                        }
                        that.oIceCreamContainer = oContainer;
                        for (i = 0; i < aPanelIceCreamFavorites.length; i = i + 1) {
                            if (aPanelIceCreamFavorites[i] instanceof sap.m.CheckBox) {
                                aPanelIceCreamFavorites[i].setSelected(that.oIceCreamContainer.getItemValue(String(i)) || false);
                            }
                        }
                        that.getView().byId("btnSaveIceCream").setEnabled(true);
                    });
                });
        },

        initMilkshakeFavorites : function () {
            // Ice cream favorites
            var that = this;

            //retrieve constants from namespace 'constants' of personalization service
            this.oPersonalizationPromise.then(function (oPersonalization) {
                var i,
                    aPanelMilkshakeFavorites = that.getView().byId("PanelMilkshakeFavorites").getContent(),
                    oConstants;

                oConstants = oPersonalization.constants;

                for (i = 0; i < aPanelMilkshakeFavorites.length; i = i + 1) {
                    //aPanelMilkshakeFavorites[i].setSelected(that.oIceCreamContainer.getItemValue(aPanelMilkshakeFavorites[i].getId()) || false);
                    aPanelMilkshakeFavorites[i].setEnabled(false);
                }

                oPersonalization.service.getContainer("sap.ushell.MilkshakeFavorites", { keyCategory : oConstants.keyCategory.FIXED_KEY, clientStorageAllowed : true, writeFrequency: oConstants.writeFrequency.LOW, validity : 0 /*FLP window!*/ }, that.getMyComponent())
                    .done(function (oContainer) {
                        var i,
                            aPanelMilkshakeFavorites = that.getView() && that.getView().byId("PanelMilkshakeFavorites") && that.getView().byId("PanelMilkshakeFavorites").getContent();
                        if (!aPanelMilkshakeFavorites) {
                            jQuery.sap.log.error("View or control aPanelMilkshakeFavorites no longer present");
                            return;
                        }
                        that.oMilkshakeContainer = oContainer;
                        for (i = 0; i < aPanelMilkshakeFavorites.length; i = i + 1) {
                            if (aPanelMilkshakeFavorites[i] instanceof sap.m.CheckBox) {
                                aPanelMilkshakeFavorites[i].setSelected(that.oMilkshakeContainer.getItemValue(String(i)) || false);
                            }
                            aPanelMilkshakeFavorites[i].setEnabled(true);
                        }
                    });
            });
        },

        /**
         * Gets the favorites from browser storage
         */
        applyExistingFruitFavorites : function (oId) {
            var that = this;
            this.oPersonalizationPromise.then(function (oPersonalization) {
                oPersonalization.personalizer.getPersData()
                    .done(that.onFruitFavoritesRead.bind(that))
                    .fail(
                    function () {
                        jQuery.sap.log
                                .error("Reading personalization data failed.");
                    });
            });
        },

        /**
         * Called by applyExistingFavorites Sets the check-boxes if
         * favorites were saved
         */
        onFruitFavoritesRead : function (aCheckBoxValues) {
            var i;

            if (!aCheckBoxValues) {
                // TODO The following string is never used...
                // sDisplayValue = "(Personalization data is not available from service)";
            } else {
                for (i = 0; i < aCheckBoxValues.length; i = i + 1) {
                    this.getView().byId("PanelFruitFavorites")
                            .getContent()[i]
                            .setSelected(aCheckBoxValues[i]);
                }
            }
        },

        /**
         * Called when "Save Fruit Favorites" button is pressed
         */
        onSaveFruitFavorites : function () {
            var aCheckBoxValues = [],
                i,
                aPanelFavorites = this.getView().byId("PanelFruitFavorites").getContent();

            for (i = 0; i < aPanelFavorites.length - 1; i = i + 1) {
                aCheckBoxValues[i] = aPanelFavorites[i]
                        .getSelected();
            }

            this.oPersonalizationPromise.then(function (oPersonalization) {
                oPersonalization.personalizer.setPersData(aCheckBoxValues);
            });
            // neither the done nor the fail is checked
        },

        /**
         * Called when "Save ice cream favorites is changed
         */
        onSaveIceCreamFavorites : function () {
            // the button is only available if we have loaded the data
            var aPanelIceCreamFavorites = this.getView().byId("PanelIceCreamFavorites").getContent(),
                i;
            for (i = 0; i < aPanelIceCreamFavorites.length; i = i + 1) {
                if (aPanelIceCreamFavorites[i] instanceof sap.m.CheckBox) {
                    this.oIceCreamContainer.setItemValue(String(i), aPanelIceCreamFavorites[i].getSelected());
                }
            }
            this.oIceCreamContainer.save();
            // neither the done nor the fail is checked
        },
        /**
         * Called when "Save ice cream favorites is changed
         */
        onMilkshakeChanged : function () {
            // the button is only available if we have loaded the data
            var aPanelMilkshakeFavorites = this.getView().byId("PanelMilkshakeFavorites").getContent(),
                i;
            for (i = 0; i < aPanelMilkshakeFavorites.length; i = i + 1) {
                if (aPanelMilkshakeFavorites[i] instanceof sap.m.CheckBox) {
                    this.oMilkshakeContainer.setItemValue(String(i), aPanelMilkshakeFavorites[i].getSelected());
                }
            }
            this.oMilkshakeContainer.save(); // TODO Deferred
            // neither the done nor the fail is checked
        },
        onDestroy : function () {
            this.oMilkshakeContainer.save();
        }
    });
});
},
	"sap/ushell/demo/AppPersSample/App.view.xml":'<?xml version="1.0" encoding="UTF-8" ?>\n<!-- ${copyright} -->\n<core:View controllerName="sap.ushell.demo.AppPersSample.App" xmlns:core="sap.ui.core"\n\txmlns="sap.m" xmlns:table="sap.ui.table">\n\n\t<VBox>\n\t\t<Panel headerText="Sample Application for Personalization">\n\n\t\t\t<Panel headerText="Favorites List of Fruit (Client Side HTTP Caching)" id="PanelFruitFavorites">\n\t\t\t\t<CheckBox text="Apple" id="checkFavorites0" />\n\t\t\t\t<CheckBox text="Banana" id="checkFavorites1" />\n\t\t\t\t<CheckBox text="Peach" id="checkFavorites2" />\n\t\t\t\t<CheckBox text="Orange" id="checkFavorites3" />\n\t\t\t\t<CheckBox text="Strawberry" id="checkFavorites4" />\n\n\t\t\t\t<Button text="Save Fruit Favorites" press="onSaveFruitFavorites" />\n\t\t\t</Panel>\n      <Panel headerText="Favorites List of Ice cream (validity 2min)" id="PanelIceCreamFavorites">\n        <CheckBox text="Apple" id="checkIceCreamShakeFavorites0" />\n        <CheckBox text="Banana" id="checkIceCreamFavorites1" />\n        <CheckBox text="Peach" id="checkIceCreamFavorites2" />\n        <CheckBox text="Orange" id="checkIceCreamFavorites3" />\n        <CheckBox text="Strawberry" id="checkIceCreamFavorites4" />\n        <Button text="Save Ice cream Favorites" id="btnSaveIceCream" press="onSaveIceCreamFavorites" />\n      </Panel>\n      <Panel headerText="Favorites List of Milkshakes (validity 0 [FLP Window content], saved on change)" id="PanelMilkshakeFavorites" title="axxx" headertooltip="abc">\n        <CheckBox text="Apple" id="checkMilkshakeFavorites0"  select="onMilkshakeChanged" />\n        <CheckBox text="Banana" id="checkMilkshakeFavorites1" select="onMilkshakeChanged" />\n        <CheckBox text="Peach" id="checkMilkshakeFavorites2" select="onMilkshakeChanged" />\n        <CheckBox text="Orange" id="checkMilkshakeFavorites3"  select="onMilkshakeChanged" />\n        <CheckBox text="Strawberry" id="checkMilkshakeFavorites4" select="onMilkshakeChanged" />\n      </Panel>\n\t\t</Panel>\n\t</VBox>\n</core:View>\n',
	"sap/ushell/demo/AppPersSample/Component.js":function(){/*global sap, jQuery */
// define a root UIComponent which exposes the main view

sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    "use strict";

    return UIComponent.extend("sap.ushell.demo.AppPersSample.Component", {

        oMainView : null,

        metadata : {
            manifest: "json"
        },

        createContent : function () {
            this.oMainView = sap.ui.xmlview("sap.ushell.demo.AppPersSample.App");
            return this.oMainView;
        }

    });

});

},
	"sap/ushell/demo/AppPersSample/i18n/i18n.properties":'\r\n# Copyright (c) 2009-2015 SAP SE, All Rights Reserved\r\n# See Translation Guide for SAPUI5 Application Developers in the\r\n# sap help portal for details\r\n# http://help.sap.com/saphelp_uiaddon10/helpdata/en/b9/a2a70596e241ebad8901f1d19fe28e/content.htm?frameset=/en/0c/5f019e130e45ceb8914d72fb0257dd/frameset.htm&current_toc=/en/e4/843b8c3d05411c83f58033bac7f072/plain.htm&node_id=652\r\n\r\n# XTIT: Dialog title\r\ntitle=App Personalization Sample 1\r\n\r\n# XTIT: Dialog title\r\nsubtitle=set favourites\r\n\r\n# XTXT: description\r\ndescription=Sample app for testing the personalization ushell service\r\n',
	"sap/ushell/demo/AppPersSample/manifest.json":'{\n    "_version": "1.4.0",\n\n    "sap.app": {\n        "_version": "1.1.0",\n        "id": "sap.ushell.demo.AppPersSample",\n        "type": "application",\n        "i18n": "i18n/i18n.properties",\n        "title": "{{title}}",\n        "subTitle": "{{subtitle}}",\n        "description": "{{description}}",\n        "applicationVersion": {\n            "version": "1.1.0"\n        },\n        "ach": "CA-UI2-INT-FE",\n        "dataSources": {},\n        "cdsViews": [],\n        "offline": true,\n        "crossNavigation": {\n            "inbounds": {\n                "inb" :{\n                    "semanticObject": "Action",\n                    "action": "toappperssample",\n                    "signature": {\n                        "parameters": {},\n                        "additionalParameters": "allowed"\n                    }\n                }\n            }\n\n        }\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n\n        "technology": "UI5",\n        "icons": {\n             "icon": "sap-icon://undefined/favorite"\n        },\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        },\n        "supportedThemes": [\n            "sap_hcb",\n            "sap_bluecrystal"\n        ],\n        "fullWidth": false\n    },\n    "sap.ui5": {\n        "_version": "1.1.0",\n        "resources": {\n            "js": [],\n            "css": [{\n                "uri": "css/custom.css",\n                "id": "sap.ushell.demo.AppPersSample.stylesheet"\n            }]\n        },\n        "dependencies": {\n            "minUI5Version":"1.28",\n            "libs": {\n                "sap.m": {\n                    "minVersion": "1.28"\n                }\n            }\n        },\n        "models": {},\n        "rootView": "",\n        "handleValidation": false,\n        "config": {},\n        "routing": {},\n        "contentDensities": {\n            "compact": false,\n            "cozy": true\n        },\n        "services": {\n            "Personalization": {\n                "factoryName": "sap.ushell.ui5service.Personalization"\n            }\n        }\n    }\n}\n'
},"sap/ushell/demo/AppPersSample/Component-preload"
);
