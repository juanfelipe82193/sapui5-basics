/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
        "sap/ovp/app/resources",
        "sap/ovp/cards/CommonUtils",
	    "sap/ovp/app/OVPUtils"
    ],
    function (OvpResources, CommonUtils, OVPUtils) {
        "use strict";
        return {
            'default': {
				//Template for Overview Page Extensibility via UI Adaptation Editor tool
                controllerExtensionTemplate: "sap/ovp/ui/OVPControllerExtensionTemplate",
                actions: { },
                aggregations: {
                    DynamicPage: {
                        propagateMetadata: function (oElement) {
                            var sType = oElement.getMetadata().getName();
                            var sLayer = CommonUtils._getLayer();
                            if (sType !== "sap.ovp.ui.EasyScanLayout" && sType !== "sap.ui.core.ComponentContainer"
                                && !((sLayer && (sLayer === OVPUtils.Layers.vendor || sLayer === OVPUtils.Layers.customer_base))
                                && sType === "sap.ui.comp.smartfilterbar.SmartFilterBar")) {
                                    return {
                                        actions: "not-adaptable"
                                    };
                            }
                        },
                        propagateRelevantContainer: false
                    }
                }
            },
            'strict': {
                actions: {
                    /*settings: function () {
                        return {
                            isEnabled: false, //Disabled as of now
                            handler: function (oElement, fGetUnsavedChanges) {
                                AppSettingsUtils.getDialogBox(oElement).then(function (oDialogBox) {
                                    oDialogBox.open();
                                });
                                return Promise.resolve([]);
                            }
                        };
                    }*/
                },
                name: {
                    singular: OvpResources && OvpResources.getText("Card"),
                    plural: OvpResources && OvpResources.getText("Cards")
                }
            }
        };
    }, false);
