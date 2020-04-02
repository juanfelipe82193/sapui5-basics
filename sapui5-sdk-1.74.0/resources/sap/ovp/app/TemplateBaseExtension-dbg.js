sap.ui.define([
    "sap/ui/core/mvc/ControllerExtension",
    "sap/ui/core/mvc/OverrideExecution"
], function (
    ControllerExtension,
    OverrideExecution
) {
    "use strict";
    return ControllerExtension.extend("sap.ovp.app.TemplateBaseExtension", {
        metadata: {
            methods: {
                provideExtensionAppStateData: {
                    "public": true,
                    "final": false,
                    overrideExecution: OverrideExecution.After
                },
                restoreExtensionAppStateData: {
                    "public": true,
                    "final": false,
                    overrideExecution: OverrideExecution.After
                },
                addFilters: {
                    "public": true,
                    "final": false,
                    overrideExecution: OverrideExecution.After
                },
                provideStartupExtension: {
                    "public": true,
                    "final": false,
                    overrideExecution: OverrideExecution.After
                },
                provideExtensionNavigation: {
                    "public": true,
                    "final": false,
                    overrideExecution: OverrideExecution.After
                },
                provideCustomActionPress: {
                    "public": true,
                    "final": false,
                    overrideExecution: OverrideExecution.After
                },
                provideCustomParameter: {
                    "public": true,
                    "final": false,
                    overrideExecution: OverrideExecution.After
                }
            }
        },

        provideExtensionAppStateData: function (fnSetAppStateData) {
        },


        restoreExtensionAppStateData: function (fnGetAppStateData) {
        },
        // allows extension to add filters. They will be combined via AND with all other filters
        // For each filter the extension must call fnAddFilter(oControllerExtension, oFilter)
        // oControllerExtension must be the ControllerExtension instance which adds the filter
        // oFilter must be an instance of sap.ui.model.Filter
        addFilters: function(fnAddFilter){},
        //allow extension to modify iappStateData
        provideStartupExtension: function(oCustomSelectionVariant){
        },
        //allow extension to do custom navigation
        provideExtensionNavigation: function (sCardId, oContext, oNavigationEntry) {
        },
        //allow extension to add press event for custom actions added in the stack card
        provideCustomActionPress: function (sCustomAction) {
        },
        //allow extension to add custom parameters for navigation
        provideCustomParameter: function (sCustomParams) {
        }
    });
});
