// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define(
    [
        "sap/ushell/components/CatalogsManager",
        "sap/ushell/resources",
        "sap/ui/core/UIComponent",
        "sap/m/routing/Router",
        "sap/ushell/Config",
        "sap/ushell/bootstrap/common/common.load.model",
        "sap/ushell/components/SharedComponentUtils",
        "sap/base/util/UriParameters"
    ], function (
        CatalogsManager,
        resources,
        UIComponent,
        Router,
        Config,
        oModelWrapper,
        oSharedComponentUtils,
        UriParameters
    ) {
    "use strict";

    return UIComponent.extend("sap.ushell.components.appfinder.Component", {

        metadata: {
            manifest: "json"
        },

        parseOldCatalogParams: function (sUrl) {
            var mParameters = new UriParameters(sUrl).mParams,
                sValue,
                sKey;

            for (sKey in mParameters) {
                if (mParameters.hasOwnProperty(sKey)) {
                    sValue = mParameters[sKey][0];
                    mParameters[sKey] = sValue.indexOf("/") !== -1 ? encodeURIComponent(sValue) : sValue;
                }
            }
            return mParameters;
        },

        handleNavigationFilter: function (sNewHash) {
            var oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash(sNewHash),
                mParameters;

            if (oShellHash && oShellHash.semanticObject === "shell" && oShellHash.action === "catalog") {
                mParameters = this.parseOldCatalogParams(sNewHash);
                setTimeout(function () {
                    this.getRouter().navTo("catalog", {filters: JSON.stringify(mParameters)});
                }.bind(this), 0);
                return this.oShellNavigation.NavigationFilterStatus.Abandon;
            }
            return this.oShellNavigation.NavigationFilterStatus.Continue;
        },

        createContent: function () {
            this.oRouter = this.getRouter();

            // model instantiated by the model wrapper
            this.oModel = oModelWrapper.getModel();
            this.setModel(this.oModel);

            // Model defaults are set now --- let`s continue.

            var sHash,
                oShellHash,
                mParameters,
                oComponentConfig,
                bPersonalizationActive = Config.last("/core/shell/enablePersonalization"),
                bSpacesEnabled = Config.last("/core/spaces/enabled");

            // The catalog route should be added only if personalization or spaces is active.
            // We did not use the XOR operand on purpose for a better code readability.
            if (bPersonalizationActive && !bSpacesEnabled || bSpacesEnabled && !bPersonalizationActive) {
                this.oRouter.addRoute({
                    name: "userMenu",
                    pattern: "userMenu/:filters:"
                });
                this.oRouter.addRoute({
                    name: "sapMenu",
                    pattern: "sapMenu/:filters:"
                });
                this.oRouter.addRoute({
                    name: "catalog",
                    pattern: ["catalog/:filters:", "", ":filters:"]
                });

                // trigger the reading of the homepage group display personalization
                // this is also needed when the app finder starts directly as the tab mode disables
                // the blind loading which is already prepared in the homepage manager
                oSharedComponentUtils.getEffectiveHomepageSetting("/core/home/homePageGroupDisplay", "/core/home/enableHomePageSettings");
            }

            var oCatalogsMgrData = {
                model: this.oModel,
                router: this.oRouter
            };
            this.oCatalogsManager = new CatalogsManager("dashboardMgr", oCatalogsMgrData);
            this.setModel(resources.i18nModel, "i18n");

            oSharedComponentUtils.toggleUserActivityLog();

            this.oShellNavigation = sap.ushell.Container.getService("ShellNavigation");

            //handle direct navigation with the old catalog intent format
            /*global hasher*/
            sHash = hasher.getHash();
            oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash(sHash);
            if (oShellHash && oShellHash.semanticObject === "shell" && oShellHash.action === "catalog") {
                mParameters = this.parseOldCatalogParams(sHash);
                oComponentConfig = this.getMetadata().getConfig();
                this.oShellNavigation.toExternal({
                    target: {
                        semanticObject: oComponentConfig.semanticObject,
                        action: oComponentConfig.action
                    }
                });
                this.getRouter().navTo("catalog", {filters: JSON.stringify(mParameters)});
            }

            var oAppFinderView = sap.ui.view({
                id: "appFinderView",
                viewName: "sap.ushell.components.appfinder.AppFinder",
                type: "JS",
                async: true
            });

            return oAppFinderView;
        },

        exit: function () {
            this.oCatalogsManager.destroy();
        }
    });

});
