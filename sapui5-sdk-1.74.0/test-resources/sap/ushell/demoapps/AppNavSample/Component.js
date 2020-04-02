// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
// define a root UIComponent which exposes the main view
/*global jQuery, sap */
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/Router",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, Router, JSONModel) {
    "use strict";

    // new Component
    return UIComponent.extend("sap.ushell.demo.AppNavSample.Component", {

        oMainView : null,
        oURLParsingDeferred: new jQuery.Deferred(),

        metadata : {
            "manifest": "json"
        },

        initModel: function () {
            var that = this;
            var oSOModel = new JSONModel();
            this.getCrossApplicationNavigationService().done(function (oCrossAppNavigator) {
                oCrossAppNavigator.getDistinctSemanticObjects().then( function ( aSO ) {

                    aSO = aSO.map( function ( sSO ) {
                        return {
                            name: sSO
                        };
                    } );

                    oSOModel.setProperty( "/suggestions", aSO );
                    that.setModel( oSOModel, "SOmodel" );
                }.bind( that ) );
            });
        },

        // important: override the standard method in UIComponent
        getRouter : function () {
            return this.oRouter;
        },

        getCrossApplicationNavigationService: function () {
            return this.oCrossApplicationNavigationDeferred.promise();
        },
        getURLParsingService: function () {
            return this.oURLParsingDeferred.promise();
        },

        /**
         * if a component implements this method, the Unified shell will invoke it during creation.
         * and, depending on the result proceed as follows:
         *
         * if the function returns undefined, the component is handled normally the component is put into the compntainer.
         * if the function returns a promise, it is not yet turned visible,
         *   when the promise is rejected, it is then turned visible.
         *   when the promise is successful, it returns a new shell (internal) shell hash to which the
         *   FLP navigates.
         *
         *   The whole navigation process in the promise success case appears like one navigation
         */
        navigationRedirect : function () {
            var sRedirectHash = this.getComponentData() &&
                this.getComponentData().startupParameters &&
                this.getComponentData().startupParameters.redirectIntent &&
                this.getComponentData().startupParameters.redirectIntent[0];

            var sTimeout = (this.getComponentData() &&
                this.getComponentData().startupParameters &&
                this.getComponentData().startupParameters.redirectDelay &&
                this.getComponentData().startupParameters.redirectDelay[0]) || "500";

            var iTimeout = 500;
            try {
                iTimeout = Number.parseInt(sTimeout, 10);
            } catch (e) {
                // do nothing
            }

            if (sRedirectHash) {
                var oDeferred = new jQuery.Deferred();
                if (sRedirectHash.indexOf("#") === 0) {
                    setTimeout(function () {
                        oDeferred.resolve(sRedirectHash);
                    }, iTimeout);
                } else {
                    setTimeout(function () {
                        oDeferred.reject();
                    }, iTimeout);
                }
                return oDeferred.promise();
            }
            return undefined;
        },

        createContent : function () {
            /* oCrossApplicationNavigationDeferred cannot be defined directly as a property in the Component definition,
             * because if we have different intents which all start this very same component, this promise would
             * directly be treated as resolved and thus the getDistinctSemanticObjects of the cross app navigation service
             * would be called. This in turn would lead to a wrong order in creating the cross app navigation service instance
             * together with setting the active component ID and the addCallAllowedCheck in the UI5ServiceFactory. With instantiating
             * this.oCrossApplicationNavigationDeferred each time getCrossApplicationNavigationService is called, we make
             * sure that addCallAllowedCheck is only called when the active component ID is updated in the UI5ServiceFactory.
             */
            this.oCrossApplicationNavigationDeferred = new jQuery.Deferred();

            this.initModel();
            var aRoutes,
                oModel,
                oModel2,
                oUserDefaultsModel,
                oUserDefaultsData = {
                    "firstName" : "",
                    "lastName" : "",
                    "communityActivityLow" : 0,
                    "communityActivityHigh" : 0
                },
                oComponentData,
                that = this;

            /* *Nav* (1)  declare a route config  */
            /* this example separate the actual view management from the route dispatch */
            /* we only specify route names and encoding here
             * we do not specify view names or model bindings
             * */
            aRoutes =  [
                {
                    /* we encode the viewname in the path */
                    pattern : "{viewName}/",
                    name : "toaView" // name of the single route
                },
                {
                    /* we encode the viewname in the path */
                    pattern : ":all*:", //catchall
                    name : "_home"// name of the single route
                }
            ];

            /* *Nav* (2) and construct the router instance */
            this.oRouter = new Router(aRoutes);
            this.oRouter.register("sap.ushell.demo.AppNavSample");  // unique name of router (!)


            this.getService("CrossApplicationNavigation").then(
                function (oService) {
                    that.oCrossApplicationNavigationDeferred.resolve(oService);
                },
                function (oError) {
                    jQuery.sap.log.error(
                        "Error while injecting CrossApplicationNavigation service",
                        oError,
                        "sap.ushell.ui5service.CrossApplicationNavigation"
                    );
                }
            );

            this.getService("URLParsing").then(
                function (oService) {
                    that.oURLParsingDeferred.resolve(oService);
                },
                function (oError) {
                    jQuery.sap.log.error(
                        "Error while injecting a URLParsing service",
                        oError,
                        "sap.ushell.ui5service.URLParsing"
                    );
                }
            );

            this.oMainView = sap.ui.view({
                type: sap.ui.core.mvc.ViewType.XML,
                viewName:  "sap.ushell.demo.AppNavSample.Main",
                id: this.createId("MainView")
            });
            this.oRouter.initialize(); // router initialization must be done after view construction

            oModel = new sap.ui.model.json.JSONModel();
            oUserDefaultsModel = new sap.ui.model.json.JSONModel(oUserDefaultsData);
            this.oMainView.setModel(oUserDefaultsModel, "UserDefaults");

            /* *StartupParameters* (2)   */
            /* http://localhost:8080/ushell/test-resources/sap/ushell/shells/sandbox/fioriSandbox.html#Action-toappnavsample?AAA=BBB&DEF=HIJ */
            /* results in   { AAA : [ "BBB"], DEF: ["HIJ"] }  */
            oComponentData = this.getComponentData && this.getComponentData();

            if (oComponentData && oComponentData.startupParameters) {
                if (oComponentData.startupParameters.FirstName) {
                    oUserDefaultsData.firstName = oComponentData.startupParameters.FirstName[0];
                }
                if (oComponentData.startupParameters.LastName) {
                    oUserDefaultsData.lastName = oComponentData.startupParameters.LastName[0];
                }
            }
            jQuery.sap.log.info("sap.ushell.demo.AppNavSample: app was started with parameters " + JSON.stringify(oComponentData.startupParameters || {}));

            oModel.setData(this.createStartupParametersData(oComponentData && oComponentData.startupParameters || {}));
            this.oMainView.setModel(oModel, "startupParameters");

            oModel2 = new sap.ui.model.json.JSONModel({ appstate : " no app state "});
            sap.ushell.Container.getService("CrossApplicationNavigation").getStartupAppState(this).done(function (oAppState) {
                var oAppStateData = oAppState.getData(),
                    oModelData = {"parameters": []};
                if ((typeof oAppStateData == "object") && oAppStateData.selectionVariant && oAppStateData.selectionVariant.SelectOptions) {
                    for (var j = 0; j < oAppStateData.selectionVariant.SelectOptions.length; j++) {
                        if (oAppStateData.selectionVariant.SelectOptions[j].PropertyName === "CommunityActivity") {
                            oUserDefaultsModel.setProperty("/communityActivityLow", parseInt(oAppStateData.selectionVariant.SelectOptions[j].Ranges[0].Low, 10));
                            oUserDefaultsModel.setProperty("/communityActivityHigh", parseInt(oAppStateData.selectionVariant.SelectOptions[j].Ranges[0].High, 10));
                            oUserDefaultsModel.refresh(true);
                        }
                    }
                }
                oModelData.stringifiedAppstate = JSON.stringify(oAppState.getData() || " no app state ");
                oModelData.appStateKey = oAppState.getKey();
                // array or object
                if (typeof oAppStateData === "object") {
                    Object.keys(oAppStateData).forEach(function (sParamName) {
                        oModelData.parameters.push({"name": sParamName, "value": JSON.stringify(oAppStateData[sParamName])});
                    });
                }
                oModel2.setProperty("/appstate", oModelData);
            });
            this.oMainView.setModel(oModel2, "AppState");

            // if we have a startup parameter View=, we want to navigate to this view
            // (but only if the route is _Home!");
            // we handle this when the _home route is handled

            return this.oMainView;
        },

        createStartupParametersData : function (oComponentData) {
            // convert the raw componentData into a model that is consumed by the UI
            var aParameters = [],
                sKey = null;
            if (oComponentData) {
                for (sKey in oComponentData) {
                    if (Object.prototype.hasOwnProperty.call(oComponentData, sKey)) {
                        if (sKey === "CRASHME") {
                            throw new Error("Deliberately crashed on startup");
                        }
                        aParameters.push({
                            key : sKey,
                            value : oComponentData[sKey].toString()
                        });
                    }
                }
            }
            return {
                "parameters" : aParameters
            };
        },

        exit : function () {
            jQuery.sap.log.error("sap.ushell.demo.AppNavSample: Component.js exit called : this.getId():" + this.getId());
            this.oMainView = null;
        }
    });
});
