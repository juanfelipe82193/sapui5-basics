/*
 * This module is the root of the CDM bootstrap, to be used ONLY in DEVELOPMENT
 * ENVIRONMENT.
 *
 * In summary, it configures the ushell and UI5.
 * This starts the homepage component standalone and allows to run it without the renderer around it
 *
 */
sap.ui.define([
    "../common/common.configure.ui5",
    "../common/common.override.registermodulepath",
    "../homepage/mockContainer",
    "sap/ushell/renderers/fiori2/FlpMeasure" // just added here to create the namespace early...
], function (fnConfigureUI5, fnOverrideRegisterModulePath, MockContainer) {
    "use strict";

    if (performance && performance.mark) {
        performance.mark("FLP first paint!");
    }

    function LoadComponent () {
        sap.ui.require([
            "sap/ui/core/ComponentContainer",
            "sap/ushell/iconfonts"
        ], function (ComponentContainer, IconFonts) {
            var oCompContainer = new ComponentContainer({
                height: "100%"
            }).placeAt("canvas", 0);

            var oComp = sap.ui.component({
                name: "sap.ushell.components.appfinder",
                componentData: {
                    // use additional settings here as needed...
                    config: {
                        optimizeTileLoadingThreshold: 200,
                        enableEasyAccess: true,
                        enableEasyAccessSAPMenu: true,
                        enableEasyAccessSAPMenuSearch: true,
                        enableEasyAccessUserMenu: true,
                        enableEasyAccessUserMenuSearch: true,
                        enableCatalogSearch: true,
                        enableCatalogTagFilter: true,
                        enableActionModeMenuButton: true,
                        disableSortedLockedGroups: false,
                        enableTileActionsIcon: false,
                        enableHideGroups: true,
                        enableTilesOpacity: false,
                        homePageGroupDisplay: "scroll",
                        enableHomePageSettings: true,
                        rootIntent: "Shell-home"
                    }
                }
            });
            oCompContainer.setComponent(oComp);
            IconFonts.registerFiori2IconFont();

        });
    }

    function foo (fnContinue) {
        fnContinue();
    }

    fnConfigureUI5({
        libs: ["sap.m", "sap.ushell"],
        platform: "cdm",
        bootTask: foo,
        theme: "sap_belize",
        onInitCallback: LoadComponent
    });

    fnOverrideRegisterModulePath();
    sap.ushell.Container = new MockContainer();
});
