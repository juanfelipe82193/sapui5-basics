//@ui5-bundle sap/ushell/demo/AppNavSample/Component-preload.js
sap.ui.require.preload({
	"sap/ushell/demo/AppNavSample/Component.js":function(){// ${copyright}
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
},
	"sap/ushell/demo/AppNavSample/Main.controller.js":function(){// ${copyright}

(function () {
    "use strict";

    sap.ui.controller("sap.ushell.demo.AppNavSample.Main", {
        mViewNamesToViews: {},
        oInnerAppRouter: null,
        oApp: null, // the SplitApp Control instance of this view

        /* *Nav* (7) callback for route changes */

        /**
         * Callback for hash changes, this is registered with the navigation framework.
         * Our route has one argument, which is passed as the first argument.
         *
         * (for the _home route, sViewName is undefined)
         */
        _handleNavEvent: function (oEvent) {
            var sRouteName = oEvent.getParameter("name"),
                sStartupParameterView,
                sView;

            jQuery.sap.log.debug("AppNavSample: Navigate to route " + sRouteName);
            if (sRouteName === "toaView") {
                var sViewName = oEvent.getParameter("arguments").viewName;

                if (/ShowView.*/.test(sViewName)) {
                    // we use this for a specific test that the router of the previous app is correctly stopped during cross-app navigation
                    // see internal BCP incident 1670239548
                    jQuery.sap.require("sap.m.MessageBox");
                    sap.m.MessageBox.error("Recieved router event for pattern ShowView* which is used by AppNavSample2." +
                        "This means that it is likely that the router of this component was not stopped before the new component has been initialized.");
                }

                jQuery.sap.log.debug("AppNavSample: Navigate to view " + sViewName);
                this.doNavigate("toView", sViewName);
            }

            if (sRouteName === "_home") {
                // we have an unrecognizable route, use the startup parameter if we have a view name parameter
                sStartupParameterView = this.getMyComponent().getComponentData().startupParameters &&
                    this.getMyComponent().getComponentData().startupParameters.View &&
                    this.getMyComponent().getComponentData().startupParameters.View[0];
                if (sStartupParameterView === "Detail") {
                    sView = "Detail";
                }
                if (sStartupParameterView === "View1") {
                    sView = "View1";
                }
                if (sStartupParameterView === "View2") {
                    sView = "View2";
                }
                if (sStartupParameterView === "View3") {
                    sView = "View3";
                }
                if (sStartupParameterView === "View4") {
                    sView = "View4";
                }
                if (sStartupParameterView === "UserDefaultView") {
                    sView = "UserDefaultView";
                }
                if (sStartupParameterView && !sView) {
                    jQuery.sap.log.error("Unknown startup parameter value for View, legal values are Detail,View1,View2");
                }
                this.doNavigate("toView", sView || "Detail");
            }
        },

        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf Main
         */
        onInit: function () {
            var that = this;
            jQuery.sap.log.info("On Init of Main.XML.controller called : this.getView().getId()" + this.getView().getId());
            this.mViewNamesToViews = {};
            this.oApp = this.byId("app");
            var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
            this.oComponent = sap.ui.component(sComponentId);
            jQuery.sap.log.debug("located Component" + typeof this.oComponent);

            var vw = sap.ui.view({
                type: sap.ui.core.mvc.ViewType.XML,
                viewName: "sap.ushell.demo.AppNavSample.view.List",
                id: this.createId("List")
            });

            vw.getController().oApplication = this;

            this.oApp.addMasterPage(vw);

            vw = sap.ui.view({
                type: sap.ui.core.mvc.ViewType.XML,
                viewName: "sap.ushell.demo.AppNavSample.view.Detail"
            });
            this.mViewNamesToViews.Detail = vw;
            vw.getController().oApplication = this;
            this.oApp.addDetailPage(vw);

            this.oApp.setInitialDetail(vw); // use the object, not the (generated) id!

            /* obtain the (Controller) Navigator instance */
            this.oInnerAppRouter = this.getMyComponent().getRouter();

            /* *Nav* (4) register callback handler for routes */
            this.oInnerAppRouter.attachRouteMatched(this._handleNavEvent, this);
            /* *Nav* (5) */
            /* *Nav* (6) generate links, this may also be done later  */

            // *XNav* (1) obtain cross app navigation interface

            this.getOwnerComponent().getCrossApplicationNavigationService().done(
                function (oCrossAppNavigator) {
                    // we also have to call the shell's CrossAppNavigation service for creating correct links for inner-app navigation
                    // because the shell part of the hash has to be set
                    var toView1 = (oCrossAppNavigator && oCrossAppNavigator.hrefForAppSpecificHash("View1/")) || "";
                    var toView2 = (oCrossAppNavigator && oCrossAppNavigator.hrefForAppSpecificHash("View2/")) || "";
                    var toView3 = (oCrossAppNavigator && oCrossAppNavigator.hrefForAppSpecificHash("View3/")) || "";
                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData({
                        toView2_href: toView2,
                        toView1_href: toView1,
                        toView3_href: toView3
                    });
                    that.getView().setModel(oModel);
                }
            );

            sap.ui.require([
                "sap/ushell/Config",
                "sap/ui/model/json/JSONModel"
            ], function (oConfig, JSONModel) {
                var oConfigModel = oConfig.createModel({
                    prop1: "/core/navigation/enableInPlaceForClassicUIs/GUI",
                    prop2: "/core/navigation/enableWebguiLocalResolution"
                }, JSONModel);

                that.getView().setModel(oConfigModel, "configModel");
            });

            var sTitle = "Sample Application For Navigation";
            this.getOwnerComponent().getService("ShellUIService").then(
                function (oShellUIService) {
                    oShellUIService.setTitle(sTitle);
                });
        },

        generateLinks: function () {
            var that = this;
            jQuery.when(this.getOwnerComponent().getCrossApplicationNavigationService(), this.getOwnerComponent().getURLParsingService()).done(function (oCrossAppNavigator, oURLParsingService) {
                var toSU01html_href = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({ target: { semanticObject: "Action", action: "tosu01html" } })) || "";
                var toSU01_href = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({ target: { semanticObject: "Action", action: "tosu01" } })) || "";
                var towdapp_href = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({ target: { semanticObject: "Action", action: "towdapp" } })) || "";

                var oRenameParams = {
                    "P1": ["P1Value"],
                    "P2": ["P2Value"]
                };

                // TODO sap-xapp-state
                var WDANavTarget_display = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({ target: { semanticObject: "WDANavTarget", action: "display" }, params: oRenameParams }, that.oComponent)) || "";
                var WDANavTarget_display_X = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({ target: { semanticObject: "WDANavTarget", action: "display" }, params: oRenameParams })) || "";
                var WDANavSource_display = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({ target: { semanticObject: "WDANavSource", action: "display" }, params: oRenameParams })) || "";
                var Action_parameterRename1 = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({ target: { semanticObject: "Action", action: "parameterRename" }, params: oRenameParams })) || "";
                oRenameParams.Case = ["2"];
                var Action_parameterRename2 = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({ target: { semanticObject: "Action", action: "parameterRename" }, params: oRenameParams })) || "";
                oRenameParams.Case = ["3"];
                var Action_parameterRename3 = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({ target: { semanticObject: "Action", action: "parameterRename" }, params: oRenameParams })) || "";
                oRenameParams.Case = ["4"];
                var Action_parameterRename4 = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({ target: { semanticObject: "Action", action: "parameterRename" }, params: oRenameParams })) || "";
                oRenameParams.Case = ["5"];
                var Action_parameterRename5 = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({ target: { semanticObject: "Action", action: "parameterRename" }, params: oRenameParams })) || "";
                var thelongstring = "";
                var i = 0;
                for (i = 0; i < 4; i = i + 1) { //4000
                    thelongstring = thelongstring + "xx" + i;
                }
                // *XNav (2) generate cross application link
                var toDefaultApp = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({ target: { semanticObject: "Action", action: "todefaultapp" } })) || "";
                // an "external navigation" to the same app, as it has a different startup parameter
                // (date), it will be reloaded!
                var toOurApp = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: { semanticObject: "Action", action: "toappnavsample" },
                    params: { zval: thelongstring, date: new Date().toString() }
                }, that.oComponent)) || "";

                var sShellHash = "#Action~toappnavsample&date=" + encodeURIComponent(new Date().toString());

                var toOurApp2 = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: { "shellHash": sShellHash }
                }, that.oComponent)) || "";
                var toOurApp3 = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: { semanticObject: "Action", action: "toappnavsample" },
                    params: { "/ui2/par": "/VAL=VAL3/", "/ui=aaa/": "yyy", date: new Date().toString() }
                })) || "";
                var toOurApp3b = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: { semanticObject: "Action", action: "toappnavsampleParam" },
                    params: { "/ui2/par": "/VAL=VAL3/", "/ui2/zpar": "XXX", date: new Date().toString() }
                }, that.oComponent)) || "";

                var toOurApp4 = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: { semanticObject: "Action", action: "toappnavsample" },
                    params: { "View": "View1", date: new Date().toString() }
                }, that.oComponent)) || "";

                var toHome = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: { shellHash: "#" }
                }, that.oComponent)) || "";
                var toShellHome = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: { shellHash: "#Shell-home" }
                }, that.oComponent)) || "";
                var lParams = { "a": "aval", "esc": "A B&C=D", "zz": "XXX", date: Number(new Date()) };
                var s = "A123456789B123456789C123456789D123456789E12345689" +
                    "F123456789G123456789H123456789I123456789J12345689";
                for (i = 0; i < 50; i = i + 1) {
                    var su = "value" + i + ":" + s;
                    lParams["zp" + (i < 10 ? "0" : "") + i] = su;
                }
                var toOurApp_longurl = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: { semanticObject: "Action", action: "toappnavsample" },
                    params: lParams
                }, that.oComponent)) || "";

                var toNonExistentApp = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: { semanticObject: "Action", action: "notconfigured" },
                    params: { "a": "/VAL=VAL3/", "b": "XXX", date: new Date().toString() }
                }, that.oComponent)) || "";

                var toOurAppCrashing = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: { semanticObject: "Action", action: "toappnavsample" },
                    params: { "CRASHME": "/VAL=VAL3/", "/ui2/zpar": "XXX", date: new Date().toString() }
                }, that.oComponent)) || "";

                var anIsUrlSupportedUrl1 = oCrossAppNavigator.hrefForExternal({
                    target: { semanticObject: "Action", action: "toappnavsample" },
                    params: { date: new Date().toString() }
                }, that.oComponent);

                var anIsUrlSupportedUrl2 = oCrossAppNavigator.hrefForExternal({
                    target: { semanticObject: "Action", action: "notexisting" },
                    params: { date: new Date().toString() }
                }, that.oComponent);

                var appNavSample2WithInnerRoute = oCrossAppNavigator.hrefForExternal({
                    target: { semanticObject: "Action", action: "toappnavsample2" },
                    params: { navTo: "toView1" }
                }, that.oComponent);

                var toRedirectURL = oCrossAppNavigator.hrefForExternal({
                    target: { semanticObject: "Action", action: "toappnavsample" },
                    params: {
                        redirectIntent: ["#NavTarget-display"]
                    }
                });
                var toRedirectURL2 = oCrossAppNavigator.hrefForExternal({
                    target: { semanticObject: "Action", action: "toappnavsample" },
                    params: {
                        redirectIntent: ["#Action-toshowparameters?Added=true"]
                    }
                });
                var toRedirectURL3 = oCrossAppNavigator.hrefForExternal({
                    target: { semanticObject: "Action", action: "toappnavsample" },
                    params: {
                        redirectIntent: ["#WDANavTarget-display?Added=true"]
                    }
                });
                var toRedirectURL4 = oCrossAppNavigator.hrefForExternal({
                    target: { semanticObject: "Action", action: "toappnavsample" },
                    params: {
                        redirectIntent: ["#Action-toappnavsample?CRASHME=true"]
                    }
                });
                var toRedirectURL5 = oCrossAppNavigator.hrefForExternal({
                    target: { semanticObject: "Action", action: "toappnavsample" },
                    params: {
                        redirectIntent: ["#Action-notpresent"]
                    }
                });

                var anIsUrlSupportedUrl3 = "http://www.sap.com";

                var mdl = that.getView().getModel();
                mdl.setData({
                    WDANavTarget_display_X: WDANavTarget_display_X,
                    WDANavTarget_display: WDANavTarget_display,
                    WDANavSource_display: WDANavSource_display,
                    Action_parameterRename1: Action_parameterRename1,
                    Action_parameterRename2: Action_parameterRename2,
                    Action_parameterRename3: Action_parameterRename3,
                    Action_parameterRename4: Action_parameterRename4,
                    Action_parameterRename5: Action_parameterRename5,
                    DefaultApp_display_href: toDefaultApp, // "#DefaultApp-display"
                    AppNavSample_display_args_href: toOurApp,
                    AppNavSample_display_args_href2: toOurApp2,
                    AppNavSample_urlparamescaping_href: toOurApp3,
                    AppNavSample_urlparamescaping2_href: toOurApp3b,
                    AppNavSample_urlWrongEscaping: "tobeoverwritten",
                    AppNavSample_urlCorrectEscaping: "tobeoverwritten",
                    AppNavSample_toourupWithView1AsStartup: toOurApp4,
                    AppNavSample_longurl: toOurApp_longurl,
                    toWdaIntentNavigationTest: "aaa",
                    toWDANavTarget_display: "ccc",
                    toWDANavTarget_displayCompressed: "ddd",
                    toHome: toHome,
                    toShellHome: toShellHome,
                    toNonExistentApp: toNonExistentApp,
                    AppNavSample_crashing: toOurAppCrashing,
                    toSU01html_href: toSU01html_href,
                    toSU01_href: toSU01_href,
                    towdapp_href: towdapp_href,
                    anIsUrlSupportedUrl1: anIsUrlSupportedUrl1,
                    anIsUrlSupportedUrl1Enabled: true,
                    anIsUrlSupportedUrl2: anIsUrlSupportedUrl2,
                    anIsUrlSupportedUrl2Enabled: true,
                    anIsUrlSupportedUrl3: anIsUrlSupportedUrl3,
                    anIsUrlSupportedUrl3Enabled: true,
                    anIsUrlSupportedUrl4: "#justanhash",
                    anIsUrlSupportedUrl4Enabled: true,
                    appNavSample2WithInnerRoute: appNavSample2WithInnerRoute,
                    toRedirectURL: toRedirectURL,
                    toRedirectURL2: toRedirectURL2,
                    toRedirectURL3: toRedirectURL3,
                    toRedirectURL4: toRedirectURL4,
                    toRedirectURL5: toRedirectURL5
                }, true);

                [
                    "anIsUrlSupportedUrl1",
                    "anIsUrlSupportedUrl2",
                    "anIsUrlSupportedUrl3",
                    "anIsUrlSupportedUrl4"
                ].forEach(function (sName) {
                    var sUrl = mdl.getProperty("/" + sName);
                    oCrossAppNavigator.isUrlSupported(sUrl).fail(function () {
                        mdl.setProperty("/" + sName + "Enabled", false);
                    });
                });

                oCrossAppNavigator.getSemanticObjectLinks("Action", {
                    "A": 1, "B": "x",
                    "C": "ccc"
                }).done(function (oResult) {
                    if (oResult.length > 0) {
                        mdl.setProperty("/AppNavSample_urlWrongEscaping", oResult[0].intent);
                        mdl.setProperty("/AppNavSample_urlCorrectEscaping", oCrossAppNavigator.hrefForExternal({ target: { shellHash: oResult[0].intent } }, that.oComponent));
                    }
                });

                oCrossAppNavigator.getSemanticObjectLinks("Action", lParams, undefined, that.oComponent).done(function (aLinks) {
                    aLinks.forEach(function (aLink) {
                        jQuery.sap.log.warning("Result ShellHash (=internal) link     :" + aLink.intent);
                        jQuery.sap.log.warning("What to put in the link tag (external):" + oCrossAppNavigator.hrefForExternal({ target: { shellHash: aLink.intent } }, that.oComponent));
                        oCrossAppNavigator.expandCompactHash(aLink.intent).done(function (sExpandedHash) {
                            var oShellHash;
                            jQuery.sap.log.warning("Resolved expanded intent :" + sExpandedHash);
                            oShellHash = oURLParsingService.parseShellHash(sExpandedHash);
                            oShellHash.params = oShellHash.params || {};
                            oShellHash.params.addedPar = ["1234"];
                            jQuery.sap.log.warning("recoded:" + oCrossAppNavigator.hrefForExternal({
                                target: {
                                    semanticObject: oShellHash.semanticObject,
                                    action: oShellHash.action,
                                    contextRaw: oShellHash.contextRaw
                                },
                                params: oShellHash.params,
                                appSpecificHash: oShellHash.appSpecificHash
                            }, that.oComponent));
                        });
                    });
                });

                var as = oCrossAppNavigator.createEmptyAppState(that.oComponent);
                as.setData({
                    selectionVariant: {
                        Parameters: [{ "PropertyName": "PARAM1", "PropertyValue": "XZY" }],
                        SelectOptions: [{
                            "PropertyName": "UshellTest1",
                            "Ranges": [{ "Sign": "I", "Option": "E", "value": "x" }]
                        }]
                    }
                });
                function genStr(sStr, iCnt) {
                    var s = sStr;
                    while (s.length < iCnt) {
                        s = s + sStr;
                    }
                    return s;
                }
                as.save().done(function () {
                    var sUrl;
                    var asKey = as.getKey();
                    sUrl = oCrossAppNavigator.hrefForExternal({
                        target: {
                            semanticObject: "Action",
                            "action": "toWdaIntentNavigationTest"
                        },
                        params: {
                            "sap-xapp-state": [asKey],
                            "P1": ["PV1"]
                        }
                    }, that.oComponent);
                    mdl.setProperty("/toWdaIntentNavigationTest", sUrl);
                    sUrl = oCrossAppNavigator.hrefForExternal({
                        target: {
                            semanticObject: "WDANavTarget",
                            "action": "display"
                        },
                        params: {
                            "sap-xapp-state": [asKey],
                            "P1": ["PV1"]
                        }
                    }, that.oComponent);
                    mdl.setProperty("/toWDANavTarget_display", sUrl);
                    sUrl = oCrossAppNavigator.hrefForExternal({
                        target: {
                            semanticObject: "WDANavTarget",
                            "action": "display"
                        },
                        params: {
                            "sap-xapp-state": [asKey],
                            "P2": [genStr("ABAB", 2024)],
                            "P1": ["PV1"]
                        }
                    }, that.oCOmponent);
                    mdl.setProperty("/toWDANavTarget_displayCompressed", sUrl);
                });
                oCrossAppNavigator.getSemanticObjectLinks("Action", lParams, undefined, that.oComponent).done(function (aLinks) {
                    aLinks.forEach(function (aLink) {
                        jQuery.sap.log.warning("Result ShellHash (=internal) link     :" + aLink.intent);
                        jQuery.sap.log.warning("What to put in the link tag (external):" + oCrossAppNavigator.hrefForExternal({ target: { shellHash: aLink.intent } }, that.oComponent));
                        oCrossAppNavigator.expandCompactHash(aLink.intent).done(function (sExpandedHash) {
                            var oShellHash;
                            jQuery.sap.log.warning("Resolved expanded intent :" + sExpandedHash);
                            oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash(sExpandedHash);
                            oShellHash.params = oShellHash.params || {};
                            oShellHash.params.addedPar = ["1234"];
                            jQuery.sap.log.warning("recoded:" + oCrossAppNavigator.hrefForExternal({
                                target: {
                                    semanticObject: oShellHash.semanticObject,
                                    action: oShellHash.action,
                                    contextRaw: oShellHash.contextRaw
                                },
                                params: oShellHash.params,
                                appSpecificHash: oShellHash.appSpecificHash
                            }, that.oComponent));
                        });
                    });
                });

                if (toOurApp2 === sShellHash) {
                    jQuery.sap.log.error("Beware of the encoding changes");
                }

                /*
                 * elements of this model are bound to href tags in views, e.g. (Detail.view.xml):
                 * <Link href="{/DefaultApp_display_href}" text="cross app link (Default App)" tooltip="Back to Fiori Sandbox Default Application (note href is generated!)"></Link>
                 */

                that.getView().setModel(mdl);
            });
        },

        // construct and register a view if not yet present
        makeViewUilib: function (sViewname) {
            if (this.mViewNamesToViews[sViewname]) {
                return this.mViewNamesToViews[sViewname];
            }
            // construct
            jQuery.sap.log.info("sap.ushell.demo.AppNavSample: Creating view + " + sViewname + "... ");
            // run with owner to pass component!
            var oView = null;
            this.getMyComponent().runAsOwner(function () {
                /* create View */
                oView = sap.ui.view({
                    type: sap.ui.core.mvc.ViewType.XML,
                    viewName: "sap.ushell.demo.AppNavSample.view." + sViewname
                    // use a generated id!
                });
            }, this.oComponent);

            jQuery.sap.log.info("sap.ushell.demo.AppNavSample:  Creating view + " + sViewname + " assigned id : " + oView.getId());
            this.mViewNamesToViews[sViewname] = oView;
            return oView;
        },

        navigate: function (sEvent, sNavTarget) {
            var that = this;

            this.getOwnerComponent().getCrossApplicationNavigationService().done(function (oCrossAppNavigator) {
                if (sEvent === "toHome") {
                    // use external navigation to navigate to homepage
                    if (oCrossAppNavigator) {
                        oCrossAppNavigator.toExternal({ target: { shellHash: "#" } });
                    }
                    return;
                }
                if (sEvent === "toView") {
                    var sView = sNavTarget; // navtarget;
                    if (sView === "" || !that.isLegalViewName(sView)) {
                        var vw = that.mViewNamesToViews.Detail;
                        that.oApp.toDetail(vw);
                        return;
                    }
                    /* *Nav* (7) Trigger inner app navigation */
                    that.oInnerAppRouter.navTo("toaView", { viewName: sView }, true);
                    return;
                }
                if (sEvent === "back") {
                    that.oApp.back();
                } else if (sEvent === "backDetail") {
                    that.oApp.backDetail();
                } else {
                    jQuery.sap.log.info("sap.ushell.demo.AppNavSample: Unknown navigation");
                }
            });
        },

        isLegalViewName: function (sViewNameUnderTest) {
            return (typeof sViewNameUnderTest === "string") && (["Detail", "View1", "View2", "View3", "View4", "UserDefaultView", "SmartNavSample", "SapTagSample"].indexOf(sViewNameUnderTest) >= 0);
        },

        doNavigate: function (sEvent, sNavTarget) {
            var oView = null;
            if (sEvent === "toView") {
                var sView = sNavTarget; // navtarget;
                if (sView === "" || !this.isLegalViewName(sView)) {
                    var vw = this.mViewNamesToViews.Detail;
                    this.oApp.toDetail(vw);
                    return;
                }
                var bNew = !this.mViewNamesToViews[sView];
                oView = this.makeViewUilib(sView);
                if (bNew) {
                    this.oApp.addPage(oView);
                }
                this.oApp.toDetail(oView);
                oView.getController().oApplication = this;
                return;
            }
            if (sEvent === "back") {
                this.oApp.back();
            } else if (sEvent === "backDetail") {
                this.oApp.backDetail();
            } else {
                jQuery.sap.log.info("sap.ushell.demo.AppNavSample: Unknown navigation");
            }
        },

        /**
         * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
         * This hook is the same one that SAPUI5 controls get after being rendered.
         * @memberOf Main
         */
        onAfterRendering: function () {
            this.getOwnerComponent().getService("ShellUIService").then(
                function (oShellUIService) {
                    if (oShellUIService) {                        
                        var aRelatedApps = [
                            {
                                title: "Related App 1",
                                icon: "sap-icon://documents",
                                intent: "#Action-todefaultapp"
                            }, {
                                title: "Related App 2",
                                subtitle: "Application view number 2",
                                intent: "#Action-todefaultapp"
                            }, {
                                title: "Related App 3",
                                subtitle: "Application view number 3",
                                intent: "#Action-todefaultapp"
                            }, {
                                title: "Related App 4",
                                icon: "sap-icon://documents",
                                intent: "#Action-todefaultapp"
                            }, {
                                title: "Related App 5",
                                subtitle: "Application view number 2",
                                intent: "#Action-todefaultapp"
                            }, {
                                title: "Related App 6",
                                subtitle: "Application view number 3",
                                intent: "#Action-todefaultapp"
                            }, {
                                title: "Related App 7",
                                icon: "sap-icon://documents",
                                intent: "#Action-todefaultapp"
                            }, {
                                title: "Related App 8",
                                subtitle: "Application view number 2",
                                intent: "#Action-todefaultapp"
                            }, {
                                title: "Related App 9",
                                subtitle: "Application view number 3",
                                intent: "#Action-todefaultapp"
                            }, {
                                title: "Related App 10",
                                icon: "sap-icon://documents",
                                intent: "#Action-todefaultapp"
                            }
                        ];
                        var aHierarchy = [
                            {
                                title: "App View 3",
                                icon: "sap-icon://folder",
                                intent: "#Action-toappnavsample&/View3/"
                            }, {
                                title: "App View 2",
                                subtitle: "Application view number 2",
                                intent: "#Action-toappnavsample&/View2/"
                            }, {
                                title: "App View 1",
                                intent: "#Action-toappnavsample&/View1/"
                            }
                        ];                      
                        oShellUIService.setRelatedApps(aRelatedApps);
                        oShellUIService.setHierarchy(aHierarchy);
                    }
                },
                function (sError) {
                    jQuery.sap.log.error(
                        sError,
                        "perhaps the manifest.json of this application was misconfigured",
                        "sap.ushell.demo.AppNavSample.Main"
                    );
                });
        },

        getMyComponent: function () {
            return this.getOwnerComponent();
        },

        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberOf Main
         */
        onExit: function () {
            jQuery.sap.log.info("sap.ushell.demo.AppNavSample: On Exit of Main.XML.controller called : this.getView().getId():" + this.getView().getId());
            this.mViewNamesToViews = {};
            if (this.oInnerAppRouter) {
                this.oInnerAppRouter.destroy();
            }
        }
    });
}());
},
	"sap/ushell/demo/AppNavSample/Main.view.xml":'<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"\n\txmlns="sap.m" controllerName="sap.ushell.demo.AppNavSample.Main" xmlns:html="http://www.w3.org/1999/xhtml">\n\t<SplitApp id="app">\n\t\t<masterPages>\n\t\t\t<!-- filled dynamically in controller -->\n\t\t</masterPages>\n\t\t<detailPages>\n\t\t\t<!-- filled dynamically in controller -->\n\t\t</detailPages>\n\t</SplitApp>\n</core:View>',
	"sap/ushell/demo/AppNavSample/i18n/i18n.properties":'\r\n# Copyright (c) 2009-2015 SAP SE, All Rights Reserved\r\n# See Translation Guide for SAPUI5 Application Developers in the\r\n# sap help portal for details\r\n# http://help.sap.com/saphelp_uiaddon10/helpdata/en/b9/a2a70596e241ebad8901f1d19fe28e/content.htm?frameset=/en/0c/5f019e130e45ceb8914d72fb0257dd/frameset.htm&current_toc=/en/e4/843b8c3d05411c83f58033bac7f072/plain.htm&node_id=652\r\n\r\n# XTIT: Dialog title\r\ntitle=Application Navigation Sample\r\n\r\n# XTIT: Dialog title\r\nsubtitle=Navigation, params check\r\n\r\n# XTXT: description\r\ndescription=application demonstrating several edge cases of cross application navigation\r\n',
	"sap/ushell/demo/AppNavSample/i18n/i18n_de.properties":'# See Translation Guide for SAPUI5 Application Developers in the\r\n# sap help portal for details\r\n# http://help.sap.com/saphelp_uiaddon10/helpdata/en/b9/a2a70596e241ebad8901f1d19fe28e/content.htm?frameset=/en/0c/5f019e130e45ceb8914d72fb0257dd/frameset.htm&current_toc=/en/e4/843b8c3d05411c83f58033bac7f072/plain.htm&node_id=652\r\n\r\n# XTIT: Dialog title\r\ntitle=App Navigation Beispiel 1\r\n\r\n# XTIT: Dialog title\r\nsubtitle=Navigation, Parameterpruefung\r\n\r\n# XTXT: description\r\ndescription=Diese Anwendung zeigt diverse Aspekte der Cross Application Navigation\r\n',
	"sap/ushell/demo/AppNavSample/manifest.json":'{\n    "_version": "1.4.0",\n\n    "sap.fiori": {\n        "registrationIds": ["F9999999999999"]\n    },\n\n    "sap.app": {\n        "_version": "1.1.0",\n        "id": "sap.ushell.demo.AppNavSample",\n        "type": "application",\n        "i18n": "i18n/i18n.properties",\n        "title": "{{title}}",\n        "subTitle": "{{subtitle}}",\n        "description": "{{description}}",\n        "applicationVersion": {\n            "version": "1.1.0"\n        },\n        "ach": "CA-UI2-INT-FE",\n        "dataSources": {},\n        "cdsViews": [],\n        "offline": true,\n        "crossNavigation": {\n            "inbounds": {\n                "inb" :{\n                    "semanticObject": "Action",\n                    "action": "toappnavsample",\n                    "signature": {\n                        "parameters": {},\n                        "additionalParameters": "allowed"\n                    }\n                }\n            }\n        }\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n\n        "technology": "UI5",\n        "icons": {\n             "icon": "sap-icon://Fiori2/F0003"\n        },\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        },\n        "supportedThemes": [\n            "sap_hcb",\n            "sap_bluecrystal"\n        ],\n        "fullWidth": false\n    },\n    "sap.ui5": {\n        "_version": "1.1.0",\n        "resources": {\n            "js": [],\n            "css": [{\n                "uri": "css/custom.css",\n                "id": "sap.ushell.demo.AppNavSample.stylesheet"\n            }]\n        },\n        "dependencies": {\n            "minUI5Version":"1.28",\n            "libs": {\n                "sap.m": {\n                    "minVersion": "1.28"\n                }\n            }\n        },\n        "models": {},\n        "rootView": "",\n        "handleValidation": false,\n        "config": {},\n        "routing": {},\n        "contentDensities": {\n            "compact": false,\n            "cozy": true\n        },\n        "services": {\n            "ShellUIService": {\n                "factoryName": "sap.ushell.ui5service.ShellUIService"\n            },\n            "CrossApplicationNavigation": {\n                "factoryName": "sap.ushell.ui5service.CrossApplicationNavigation"\n            },\n            "URLParsing": {\n                "factoryName": "sap.ushell.ui5service.URLParsing"\n            },\n            "Configuration": {\n                "factoryName": "sap.ushell.ui5service.Configuration"\n            }\n        }\n    }\n}\n',
	"sap/ushell/demo/AppNavSample/view/Detail.controller.js":function(){// ${copyright}
/*global sap, jQuery */
sap.ui.define([
	"sap/ushell/appRuntime/ui5/AppRuntimeService",
	'sap/ui/core/mvc/Controller',
	'sap/ushell/Config',
	'sap/ui/model/json/JSONModel'
], function (AppRuntimeService, Controller, oConfig, JSONModel) {
    "use strict";

	return Controller.extend('sap.ushell.demo.AppNavSample.view.Detail', {
		oApplication: null,

		onCreateEndBtn: function() {
			var that = this;
			sap.ushell.renderers.fiori2.Renderer.addHeaderEndItem(
				"sap.ushell.ui.shell.ShellHeadItem",
				{
					id: "idButtonSub",
					icon: "sap-icon://flight",
					tooltip: "subtrut 2 numbers",
					click: function () {
						//alert("header button was clicked. This alert is executed inside the iframe");
						var oView = that.getView();
						oView.byId("idResult").setValue(Number(oView.byId("idNumber1").getValue()) - Number(oView.byId("idNumber2").getValue()));
					}
				},
				true,
				true,
				["app"]);
		},

		onInit: function () {
			var that = this,
				oModel = new JSONModel();
			this.oModel = oModel;
			this.contextualDisplayCoord = this.displayCoordinats.bind(this);
			// set the current user in the model (testing UserInfo service)
			this.getOwnerComponent().getCrossApplicationNavigationService().done(function (oCrossAppNavigator) {
				var bIsInitialNavigation = oCrossAppNavigator.isInitialNavigation(),
					oUserInfoService = sap.ushell.Container.getService("UserInfo");

				//create the setup
				var oProm = AppRuntimeService.sendMessageToOuterShell( "sap.ushell.registry.addHeaderBtn", {});

				oProm.done(function (oRetObj) {
					console.log(oRetObj);
					that.addHeaderBtn = oRetObj.addHeaderEndBtn;
				});


				oModel.setData({
					coordinates: 12,
					userId: oUserInfoService.getId(),
					isInitialNavigation: bIsInitialNavigation ? "yes" : "no",
					isInitialNavigationColor: bIsInitialNavigation ? "green" : "red"
				});
				that.getView().setModel(oModel, "detailView");
				that.getView().getModel("detailView").setProperty("/coordinates", 99);
			});

			this.getOwnerComponent().getService("Configuration").then( function (oService) {
				that.oEventRegistry = oService.attachSizeBehaviorUpdate(that._sizeBehaviorUpdate.bind(that));
			});
		},

		_sizeBehaviorUpdate : function (sSizeBehavior) {
			this.oModel.setProperty("/sizeBehavior", sSizeBehavior);
		},

		detachSizeBehavior : function () {
			this.oEventRegistry.detach();
		},
		attachSizeBehavior : function () {
			var that = this;
			this.getOwnerComponent().getService("Configuration").then( function (oService) {
				that.oEventRegistry = oService.attachSizeBehaviorUpdate(that._sizeBehaviorUpdate.bind(that));
			});
		},

		toggleSizeBehavior: function () {
			var oModel = this.getView().getModel("detailView"),
				sSizeBehavior = oModel.getProperty("/sizeBehavior");
			var sNewSizeBehavior = (sSizeBehavior === "Responsive" ? "Small" : "Responsive");
			oConfig.emit("/core/home/sizeBehavior", sNewSizeBehavior);
		},

		generateLinks: function () {
			this.getOwnerComponent().getRootControl().getController().generateLinks();
			this.byId("xapplist").setVisible(true);
		},
		onFlipPropertyClicked: function (oEvent) {
			var sConfig = oEvent.getSource().data().config;
			var bCurrent = oConfig.last(sConfig);
			oConfig.emit(sConfig, !bCurrent);
		},
		displayCoordinats: function (oEvent) {
			this.getView().getModel("detailView").setProperty("/coordinates", {
				screenX: oEvent.screenX,
				screenY: oEvent.screenY
			});
		},
		onAddEventListener: function (oEvent) {
			document.addEventListener("mousemove", this.contextualDisplayCoord);

		},
		onRemoveEventLister: function (oEvent) {
			document.removeEventListener("mousemove", this.contextualDisplayCoord);
		},

		onAddClickLister: function(oEvent) {
			document.addEventListener("click", this.contextualDisplayCoord);
		},

		onRemoveClickLister: function(oEvent) {
			document.removeEventListener("keypress", this.contextualDisplayCoord);
		},

		onCallTunnelFunction: function (oEvent) {

			this.addHeaderBtn("sap.ushell.ui.shell.ShellHeadItem", {
					id: "idButtonSub",
					icon: "sap-icon://flight",
					tooltip: "subtrut 2 numbers",
					press: function (oParam) {
						console.log(oParam);
						alert("Button pressed!");
						// var oView = that.getView();
						// oView.byId("idResult").setValue(Number(oView.byId("idNumber1").getValue()) - Number(oView.byId("idNumber2").getValue()));
					}
				},
				true,
				true

			);
		}
	});
});
},
	"sap/ushell/demo/AppNavSample/view/Detail.view.xml":'<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns:l="sap.ui.layout"\r\n\t\txmlns="sap.m" controllerName="sap.ushell.demo.AppNavSample.view.Detail"\r\n\t\txmlns:app="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"\r\n\t\txmlns:html="http://www.w3.org/1999/xhtml">\r\n\t<Page title="Detail">\r\n\t\t<subHeader>\r\n\t\t\t<Toolbar design="Transparent">\r\n\t\t\t\t<Title text="isInitialNavigation?" class="sapUiTinyMarginEnd"/>\r\n\t\t\t\t<core:Icon id="isInitialNavigationIcon" src="sap-icon://status-error" color="{detailView>/isInitialNavigationColor}"/>\r\n\t\t\t\t<Text id="isInitialNavigation" text="{detailView>/isInitialNavigation}"/>\r\n\t\t\t\t<ToolbarSpacer/>\r\n\t\t\t\t<Title text="Current user:"/>\r\n\t\t\t\t<Text text="{detailView>/userId}"/>\r\n\t\t\t</Toolbar>\r\n\t\t</subHeader>\r\n\t\t<content>\r\n\t\t\t<Panel>\r\n\t\t\t\t<List headerText="Application Startup Parameters" noDataText="No startup parameters passed"\r\n\t\t\t\t\t  items="{path: \'startupParameters>/parameters\'}">\r\n\t\t\t\t\t<DisplayListItem label="{startupParameters>key}" value="{startupParameters>value}"/>\r\n\t\t\t\t</List>\r\n\t\t\t\t<List headerText="App State Key (if present):">\r\n\t\t\t\t\t<DisplayListItem label="Key:" value="{AppState>/appstate/appStateKey}"/>\r\n\t\t\t\t</List>\r\n\t\t\t\t<List headerText="App State Parameters" noDataText="No appstate parameters"\r\n\t\t\t\t\t  items="{path: \'AppState>/appstate/parameters\'}">\r\n\t\t\t\t\t<InputListItem label="{AppState>name}" tooltip="{AppState>name}">\r\n\t\t\t\t\t\t<Input id="UserDefaultValue" value="{AppState>value}" type="Text"\r\n\t\t\t\t\t\t\t   enabled="false"/>\r\n\t\t\t\t\t</InputListItem>\r\n\t\t\t\t</List>\r\n\t\t\t\t<Label text="Received AppState (JSON.stringified)"/>\r\n\t\t\t\t<TextArea cols="90" rows="3" enabled="false" id="fas2"\r\n\t\t\t\t\t\t  value="{AppState>/appstate/stringifiedAppstate}"/>\r\n\t\t\t\t<List headerText="Configuration Service Properties:">\r\n\t\t\t\t\t<CustomListItem>\r\n\t\t\t\t\t\t<content>\r\n\t\t\t\t\t\t\t<HBox>\r\n\t\t\t\t\t\t\t\t<VBox>\r\n\t\t\t\t\t\t\t\t\t<Title class="sapUiSmallMarginBegin sapUiSmallMarginTopBottom" level="H1" text="Homepage Size Behavior:"/>\r\n\t\t\t\t\t\t\t\t\t<Title class="sapUiSmallMarginBegin " level="H1" text="{detailView>/sizeBehavior}"/>\r\n\t\t\t\t\t\t\t\t</VBox>\r\n\t\t\t\t\t\t\t\t<Button class="sapUiSmallMarginBegin sapUiSmallMarginTopBottom" text="Toggle sizeBehavior" press="toggleSizeBehavior"/>\r\n\t\t\t\t\t\t\t\t<Button class="sapUiSmallMarginBegin sapUiSmallMarginTopBottom" text="DetachSizeBehaviorUpdate" press="detachSizeBehavior"/>\r\n\t\t\t\t\t\t\t\t<Button class="sapUiSmallMarginBegin sapUiSmallMarginTopBottom" text="AttachSizeBehaviorUpdate" press="attachSizeBehavior"/>\r\n\t\t\t\t\t\t\t</HBox>\r\n\t\t\t\t\t\t</content>\r\n\t\t\t\t\t</CustomListItem>\r\n\t\t\t\t</List>\r\n\t\t\t\t<VBox>\r\n\t\t\t\t\t<Title level="H1" class="sapUiSmallMarginTop" text="Model bound to sap/ushell/Config" />\r\n\t\t\t\t\t<HBox>\r\n\t\t\t\t\t\t<Label class="sapUiSmallMargin" text="/core/navigation/enableInPlaceForClassicUIs/GUI: {configModel>/prop1}" />\r\n\t\t\t\t\t\t<Button press="onFlipPropertyClicked" app:config="/core/navigation/enableInPlaceForClassicUIs/GUI" text="Change" />\r\n\t\t\t\t\t</HBox>\r\n\t\t\t\t\t<HBox>\r\n\t\t\t\t\t\t<Label class="sapUiSmallMargin" text="/core/navigation/enableWebguiLocalResolution: {configModel>/prop2}" />\r\n\t\t\t\t\t\t<Button press="onFlipPropertyClicked" app:config="/core/navigation/enableWebguiLocalResolution" text="Change" />\r\n\t\t\t\t\t</HBox>\r\n\t\t\t\t</VBox>\r\n\t\t\t\t<VBox>\r\n\t\t\t\t\t<Title level="H1" class="sapUiSmallMarginTop" text="Display mouse coordinates" />\r\n\t\t\t\t\t<Label class="sapUiSmallMargin" text="Mouse coordinates:" />\r\n\t\t\t\t\t<Label class="sapUiSmallMargin" text="[{detailView>/coordinates/screenX}, {detailView>/coordinates/screenY}]" />\r\n\t\t\t\t\t<Button press="onAddClickLister" text="Add Click Listener" />\r\n\t\t\t\t\t<Button press="onRemoveClickLister" text="Remove Click Listener" />\r\n\t\t\t\t\t<Button press="onCallTunnelFunction" text="Call Tunnel Function" />\r\n\t\t\t\t</VBox>\r\n\t\t\t</Panel>\r\n\t\t</content>\r\n\t</Page>\r\n</core:View>\r\n',
	"sap/ushell/demo/AppNavSample/view/List.controller.js":function(){// ${copyright}
/*global sap, jQuery*/
sap.ui.controller("sap.ushell.demo.AppNavSample.view.List", {

    oApplication : null,
    oDialog: null,
    oPopover: null,
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.List
*/
    onInit: function () {
        "use strict";
        var that = this,
            bFallback = this._detectFallback(),
            srvc,
            page,
            myComponent,
            oAppSettingsButton;

        if (bFallback) {
            this.getView().byId("FallbackSwitch").setState(true);
        }


        myComponent = this.getMyComponent();
        if (myComponent.getComponentData().startupParameters) {
            jQuery.sap.log.debug("startup parameters of appnavsample are " + JSON.stringify(myComponent.getComponentData().startupParameters));
        }
        page = this.oView.getContent()[0];
        srvc = sap.ushell.services.AppConfiguration;
        if (srvc) {
            page.setShowFooter(true);
            oAppSettingsButton = new sap.m.Button({
                text: "App Settings",
                press: function () {
                    sap.ushell.Container.getService("Message").info("app settings button clicked");
                }
            });
            that = this;
            srvc.addApplicationSettingsButtons([oAppSettingsButton]);
            this.oActionSheet = new sap.m.ActionSheet({ id: this.getView().getId() + "actionSheet", placement: sap.m.PlacementType.Top });
            if (sap.ushell && sap.ushell.ui && sap.ushell.ui.footerbar) {
                this.oActionSheet.addButton(new sap.ushell.ui.footerbar.JamDiscussButton());
                this.oActionSheet.addButton(new sap.ushell.ui.footerbar.JamShareButton());
                this.oActionSheet.addButton(new sap.ushell.ui.footerbar.AddBookmarkButton({id: this.getView().getId() + "saveAsTile"}));
            }
            this.oActionsButton = new sap.m.Button({
                id: this.getView().getId() + "actionSheetButton",
                press : function () {
                    that.oActionSheet.openBy(this);
                },
                icon : "sap-icon://action"
            });
            if (srvc && typeof srvc.getSettingsControl === "function") {
                page.setFooter(new sap.m.Bar({
//                    contentLeft: srvc.getSettingsControl(),
                    contentRight: this.oActionsButton
                }));
            }

            this.getView().byId("idJamShareButton").setJamData({
                object: {
                    id: window.location.href,
                    share: "static text to share in JAM together with the URL"
                }
            });
        }

        // Store initial navigation in the model
        this.getOwnerComponent().getCrossApplicationNavigationService().done(function (oCrossAppNavigator) {
            var bIsInitialNavigation = oCrossAppNavigator.isInitialNavigation();

            that.oModel = new sap.ui.model.json.JSONModel({
                isInitialNavigation: bIsInitialNavigation ? "yes" : "no",
                isInitialNavigationColor: bIsInitialNavigation ? "green" : "red"
            });
            that.getView().setModel(that.oModel, "listModel");
        });
    },
    trackDataEvent : function () {
        "use strict";
        var inputFieldValue = this.getView().byId("dataInput").getValue(),
            srv = sap.ushell.Container.getService("UsageAnalytics");
        srv.logCustomEvent("Test", "Track Data Event", [inputFieldValue]);
    },
    getMyComponent: function () {
        "use strict";
        return this.getOwnerComponent();
    },

	handleHomePress : function () {
		"use strict";
		this.oApplication.navigate("toView", "Detail");
	},

	handleHomeWithParams : function () {
		"use strict";
        this.getOwnerComponent().getCrossApplicationNavigationService().done(function (oCrossAppNavigator) {
            oCrossAppNavigator.toExternal({
                target: { semanticObject : "Action", action: "toappnavsample" },
                params : { zval : "some data", date : new Date().toString()}
            });
        });
	},
	handleHomeWithLongUrl : function () {
		"use strict";
        var that = this,
            s =  new Date().toString(),
			i,
			params = { zval : "some data", date : Number(new Date()), "zzzdate" : Number(new Date())};

        for (i = 0; i < 20; i = i + 1) {
			s = s + "123456789" + "ABCDEFGHIJKLMNOPQRSTUVWXY"[i];
		}
		for (i = 0; i < 20; i = i + 1) {
			params["zz" + i] = "zz" + i + s;
		}

        this.getOwnerComponent().getCrossApplicationNavigationService().done(function (oCrossAppNavigator) {
            oCrossAppNavigator.toExternal({
				target: { semanticObject : "Action", action: "toappnavsample" },
				params : params
			},
			that.getOwnerComponent());
        });
	},

	handleBtnBackPress : function () {
		"use strict";
        this.getOwnerComponent().getCrossApplicationNavigationService().done(function (oCrossAppNavigator) {
            oCrossAppNavigator.backToPreviousApp();
        });
	},

	handleBtnHomePress : function () {
		"use strict";
        this.getOwnerComponent().getCrossApplicationNavigationService().done(function (oCrossAppNavigator) {
            oCrossAppNavigator.toExternal({
			    target: { shellHash : "#" }
		    });
        });
	},

    /*
        Inner app navigation handlers
     */
	handleView4Nav : function () {
		"use strict";
		this.oApplication.navigate("toView", "View4");
	},
	handleView1Nav : function () {
		"use strict";
		this.oApplication.navigate("toView", "View1");
	},
	handleSmartNavSampleBtnPress: function () {
		"use strict";
		this.oApplication.navigate("toView", "SmartNavSample");
	},

    handleSapTagPageNav: function () {
	    "use strict";
        this.oApplication.navigate("toView", "SapTagSample");
    },

	/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.List
*/
//  onBeforeRendering: function() {
//
//  },

    /*
        Testing Features Links
     */

	onDirtyStateChange : function (oEvt) {
        "use strict";
        var bState = oEvt.getParameter("state");
		sap.ushell.Container.setDirtyFlag(bState);
    },

    _detectFallback : function () {
        "use strict";
        var sURL = window.location.href;
	    return sURL.indexOf("?bFallbackToShellHome=true") > -1;
    },

    onFallbackChanged : function (oEvt) {
        "use strict";
	    var bState = oEvt.getParameter("state");
	    var sURL = window.location.href;
	    var sSplitter = this._detectFallback() ? "FioriLaunchpad.html?bFallbackToShellHome=true&" : "FioriLaunchpad.html";
	    var aURLParts = sURL.split(sSplitter);
	    sURL = aURLParts[0] + (bState ? "FioriLaunchpad.html?bFallbackToShellHome=true&" : "FioriLaunchpad.html") + aURLParts[1];
	    window.location.href = sURL;
    },

    handleBtn2Press : function () {
        "use strict";
        this.oApplication.navigate("toView", "View2");
    },
    handleBtn3Press : function () {
        "use strict";
        this.oApplication.navigate("toView", "View3");
    },


    handleBtnBackDetailPress : function () {
        "use strict";
        this.oApplication.navigate("backDetail", "");
    },
    handleBtnFwdPress : function () {
        "use strict";
        this.oApplication.navigate("Fwd", "");
    },
    handleSetDirtyFlagOn : function () {
        "use strict";
        sap.ushell.Container.setDirtyFlag(true);
    },
    handleSetDirtyFlagOff : function () {
        "use strict";
        sap.ushell.Container.setDirtyFlag(false);
    },
    handleSetFallBackToShellHomeOn : function () {
        "use strict";
        window.location.href = 'http://localhost:8080/ushell/test-resources/sap/ushell/shells/demo/FioriLaunchpad.html?bFallbackToShellHome=true#Action-toappnavsample';
    },
    handleSetFallBackToShellHomeOff : function () {
        "use strict";
        window.location.href = 'http://localhost:8080/ushell/test-resources/sap/ushell/shells/demo/FioriLaunchpad.html#Action-toappnavsample';
    },
    handleOpenDialogPress: function () {
        "use strict";
        if (!this.oDialog) {
            var that = this;
            this.oDialog = new sap.m.Dialog({
                id: this.getView().createId("dialog"),
                title : "Sample Dialog",
                type : sap.m.DialogType.Message,
                leftButton : new sap.m.Button({
                    text : "Cancel",
                    press : function () {
                        that.oDialog.close();
                    }
                }),
                content : [
                    new sap.m.Link({
                        id: "DialogCrossAppLinkID",
                        href: "{/DefaultApp_display_href}",
                        text: "Cross app link (Default App)",
                        tooltip: "Dialog should be closed automatically when navigating to another app"
                    })
                ]
            });
            this.oDialog.setModel(this.oApplication.oView.getModel());

        }
        this.oDialog.open();
    },
    handleOpenPopoverPress: function () {
        "use strict";
        var oModel, sHref;
        if (!this.oPopover) {
            oModel = this.oApplication.oView.getModel();
            sHref = oModel.getProperty("/DefaultApp_display_href");
            this.oPopover = new sap.m.Popover({
                id: this.getView().createId("popover"),
                title: "Sample Popover",
                content: [
                    new sap.m.Link({
                        href: sHref,
                        text: "Cross app link (Default App)",
                        tooltip: "Popover should be closed automatically when navigating to another app"
                    })
                ]
            });
        }
        if (!this.oPopover.isOpen()) {
            this.oPopover.openBy(this.getView().byId("openPopover"));
        } else {
            this.oPopover.close();
        }
    },

	handleSetHierarchy : function () {
		"use strict";

		var aHierarchyLevels = [{
			icon: "sap-icon://undefined/lead",
			title: "View X",
			link: "#Action-toappnavsample2" //app calls hrefForExternal, external format, direct link
		}, {
			icon: "sap-icon://FioriInAppIcons/Gift",
			title: "View Y",
			link: "#Action-toappstateformsample&/editForm/"
		}];

		this.getOwnerComponent().getService("ShellUIService").then(
			function (oShellUIService) {
				oShellUIService.setHierarchy(aHierarchyLevels);
			},
			function (sError) {
				jQuery.sap.log.error(sError, "perhaps manifest.json does not declare the service correctly",
					"sap.ushell.demo.AppNavSample.view.List");
			}
		);
	},

	handleSetRelatedApps : function () {
        "use strict";
		var aRelatedApps = [
			{
				title: "Related App X",
				icon: "sap-icon://documents",
				intent: "#Action-todefaultapp"
			},
			{
				title: "no icon or sub",
				intent: "#Action-todefaultapp"
			},
			{
				title: "Related App Z",
				subtitle: "Application view number 3",
				intent: "#Action-todefaultapp"
			}
		];
		this.getOwnerComponent().getService("ShellUIService").then(
			function (oShellUIService) {
				oShellUIService.setRelatedApps(aRelatedApps);
			},
			function (sError) {
				jQuery.sap.log.error(sError, "perhaps manifest.json does not declare the service correctly",
					"sap.ushell.demo.AppNavSample.view.List");
			}
		);


    },
    getThemeList: function () {
        sap.ui.define([
            "sap/ushell/appRuntime/ui5/AppRuntimeService",
        ], function (
            AppRuntimeService
        ) {
            AppRuntimeService.sendMessageToOuterShell("sap.ushell.services.UserInfo.getThemeList", { })
                .then(function (aList) {
                    console.log(aList);
                }, function (sError) {
                    console.log(sError);
                });
        });
    },

    handleSetTitle : function () {
        "use strict";
		this.getOwnerComponent().getService("ShellUIService").then(
			function (oShellUIService) {
				oShellUIService.setTitle("Custom title is set!");
			},
			function (sError) {
				jQuery.sap.log.error(sError, "perhaps manifest.json does not declare the service correctly",
					"sap.ushell.demo.AppNavSample.view.List");
			}
		);
	},

    handleSetTitleFromTargetMapping: function () {
        "use strict";
        var oShellUIServicePromise = this.getOwnerComponent().getService("ShellUIService"),
            oIntentPromise = sap.ushell.Container.getService("AppLifeCycle").getCurrentApplication().getIntent();

        Promise.all([oShellUIServicePromise, oIntentPromise]).then( function (aPromises) {
            var oShellUIService = aPromises[0],
                oIntent = aPromises[1];
            sap.ushell.Container.getService("CrossApplicationNavigation").getLinks(oIntent).then(function (aRes) {
                oShellUIService.setTitle(aRes[0].text);
            });
        });
    },

    handleOpenMessageToastPress: function () {
        "use strict";
        sap.m.MessageToast.show("Sample message toast", { duration: 5000});
    },

    sendAsEmailS4: function () {
        "use strict";
        sap.m.URLHelper.triggerEmail(
            null,
            "This is the email of FLP",
            document.URL
        );
    },

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.List
*/
//  onAfterRendering: function() {
//
//  },

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.List
*/
    onExit: function () {
        "use strict";
        // dialogs and popovers are not part of the UI composition tree and must
        // therefore be
        // destroyed explicitly in the exit handler
        if (this.oDialog) {
            this.oDialog.destroy();
        }
        if (this.oPopover) {
            this.oPopover.destroy();
        }
        if (this.oActionSheet) {
            this.oActionSheet.destroy();
        }
        if (this.oActionsButton) {
            this.oActionsButton.destroy();
        }
    }

});
},
	"sap/ushell/demo/AppNavSample/view/List.view.xml":'<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"\r\n           xmlns="sap.m" controllerName="sap.ushell.demo.AppNavSample.view.List"\r\n           xmlns:footerbar="sap.ushell.ui.footerbar"\r\n           xmlns:html="http://www.w3.org/1999/xhtml">\r\n    <Page title="Nav Samples Navigation">\r\n        <content>\r\n            <VBox class="sapUiTinyMargin">\r\n                <Panel headerText="To App Home Variations">\r\n                    <VBox>\r\n                        <Link text="App Home" press="handleHomePress"/>\r\n                        <Link text="App Home with params" press="handleHomeWithParams"/>\r\n                        <Link text="App Home with long Url" press="handleHomeWithLongUrl"/>\r\n                        <Link href="{/DefaultApp_display_href}" text="FLP home without intent"/>\r\n                    </VBox>\r\n                </Panel>\r\n                <Panel headerText="Cross App API usage">\r\n                    <VBox>\r\n                        <Link text="Cross App Navigation \'Back\'" press="handleBtnBackPress"/>\r\n                        <Link text="Cross App Navigation to FLP Home" press="handleBtnHomePress"/>\r\n                    </VBox>\r\n                </Panel>\r\n                <Panel headerText="Inner App Navigations">\r\n                    <VBox>\r\n                        <Link text="Start any Intent Page" press="handleView1Nav" class="testMasterView1Btn"/>\r\n                        <Link text="GetSemanticObjectLinks Page" press="handleView4Nav"/>\r\n                        <Link text="Smart Navigation Sample Page" press="handleSmartNavSampleBtnPress"/>\r\n                        <Link text="Calendar Example" press="handleBtn2Press" class="testMasterView2Btn"/>\r\n                        <Link text="Cross App Link Lists" press="handleBtn3Press"/>\r\n                        <Link text="sap-tag testpage" press="handleSapTagPageNav" />\r\n                    </VBox>\r\n                </Panel>\r\n                <Panel headerText="Feature Testing">\r\n                    <VBox>\r\n                        <Link text="Open Popover" id="openPopover" press="handleOpenPopoverPress"/>\r\n                        <Link id="OpenDialogLinkID" text="Open Dialog" press="handleOpenDialogPress"/>\r\n                        <Link text="Set Hierachy (ShellUIService)" press="handleSetHierarchy"/>\r\n                        <Link text="Set Related Apps (ShellUIService)" press="handleSetRelatedApps"/>\r\n                        <Link text="Set Title (ShellUIService)" press="handleSetTitle"/>\r\n                        <Link text="Get Theme List (Isolated Only)" id="getThemeList" press="getThemeList"/>\r\n                    </VBox>\r\n                </Panel>\r\n                <Panel headerText="Setting States">\r\n                    <HBox>\r\n                        <VBox class="sapUiMediumMarginEnd">\r\n                            <Button id="testDirtyFlagOn" text="Set Dirty Flag On" press="handleSetDirtyFlagOn"\r\n                                    class="testDirtyFlagOnBtn"/>\r\n                            <Button id="testDirtyFlagOff" text="Set Dirty Flag Off" press="handleSetDirtyFlagOff"\r\n                                    class="testDirtyFlagOffBtn"/>\r\n                            <Button id="testFallBackToShellHomeOn" text="Set FallBack To Shell-Home On"\r\n                                    press="handleSetFallBackToShellHomeOn" class="testFallBackToShellHomeOnBtn"/>\r\n                            <Button id="testFallBackToShellHomeOff" text="Set FallBack To Shell-Home Off"\r\n                                    press="handleSetFallBackToShellHomeOff" class="testFallBackToShellHomeOffBtn"/>\r\n                        </VBox>\r\n                    </HBox>\r\n                </Panel>\r\n            </VBox>\r\n            <HBox class="sapUiTinyMargin">\r\n                <Input id="dataInput" type="Text" placeholder="Enter Business Data..." showSuggestion="true"\r\n                       class="testDataInput"/>\r\n                <Button id="trackDataEvent" text="Track Business Data" press="trackDataEvent"\r\n                        class="testTrackDataEventButton"/>\r\n            </HBox>\r\n            <Panel headerText="ShellUIService">\r\n                    <VBox>\r\n                        <Link text="Set Title from Target Mapping (ShellUIService)" press="handleSetTitleFromTargetMapping"/>\r\n                    </VBox>\r\n                </Panel>\r\n            <Panel headerText="FLP Special Buttons">\r\n                <VBox>\r\n                    <footerbar:AddBookmarkButton id="idAddBookmarkButton" />\r\n                    <footerbar:SendAsEmailButton id="idSendAsEmailButton" />\r\n                    <footerbar:JamShareButton id="idJamShareButton" />\r\n                    <footerbar:JamDiscussButton id="idJamDiscussButton" />\r\n                    <footerbar:AboutButton id="idAboutButton" />\r\n                    <footerbar:ContactSupportButton id="idContactSupportButton" />\r\n                    <footerbar:EndUserFeedback id="idEndUserFeedback" />\r\n                    <footerbar:SettingsButton id="idSettingsButton" />\r\n                    <footerbar:UserPreferencesButton id="idUserPreferencesButton" />\r\n                </VBox>\r\n            </Panel>\r\n            <Panel headerText="Send URL As Email (old way)">\r\n                <VBox>\r\n                    <Button id="idSendAsEmailS4" text="Send As Email (S4)" press="sendAsEmailS4"/>\r\n                </VBox>\r\n            </Panel>\r\n        </content>\r\n    </Page>\r\n</core:View>\r\n',
	"sap/ushell/demo/AppNavSample/view/SapTagSample.controller.js":function(){sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Token"
], function (Controller, JSONModel, Token) {
    return Controller.extend("sap.ushell.demo.AppNavSample.view.SapTagSample", {
        
        onInit: function () {
            this.oModel = new JSONModel();
            this.getView().setModel(this.oModel, "tagModel");

            var oTagTokenizer = this.getView().byId("tagTokenizer");
            oTagTokenizer.addValidator( function(args) {
                var text = args.text;
                return new Token({key: text, text: text});
            });
        },

        onSemanticObjectSelected: function (oEvt) {
            var that = this,
                sSelectedSO = oEvt.getParameter( "selectedItem" ).getText();
            this.getOwnerComponent().getCrossApplicationNavigationService().done(function (oCrossAppNavigator) {
                oCrossAppNavigator.getPrimaryIntent(sSelectedSO, {}).done( function (oResult) {
                    that.oModel.setProperty("/primaryIntent", oResult);
                });
            });

        },
        onSemanticObjectSelectedForTags: function (oEvt) {
            sSelectedSO = oEvt.getParameter( "selectedItem" ).getText();
            this.sSelectedSoTags = sSelectedSO;
            this.onTokenUpdated();
        },

        onTokenUpdated: function () {
            var that = this;
            var aTokens = this.getView().byId("tagTokenizer").getTokens().map( function(elem, index) {
                return elem.getKey();
            });

            this.getOwnerComponent().getCrossApplicationNavigationService().done(function (oCrossAppNavigator) {
                var sSO = that.sSelectedSoTags || "Tagtesting";
                oCrossAppNavigator.getLinks({semanticObject: sSO, tags: aTokens}).done( function(oResult) {
                    that.oModel.setProperty("/taggedIntents", oResult);
                })

            })

        }
    });
});
},
	"sap/ushell/demo/AppNavSample/view/SapTagSample.view.xml":'<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns:l="sap.ui.layout"\n           xmlns="sap.m" controllerName="sap.ushell.demo.AppNavSample.view.SapTagSample"\n           xmlns:html="http://www.w3.org/1999/xhtml">\n    <Page title="SAP-tag Samples" class="sapUiContentPadding">\n        <MessageStrip\n                text="In this view you can test configured tags per semantic object via the parameter sap-tag added to intents/target mappings. Two cases are covered "\n                showIcon="false"\n                customIcon="sap-icon://tag"\n                showCloseButton="false"\n                class="sapUiMediumMarginBottom">\n        </MessageStrip>\n        <Panel id="link_tag_testing" headerText="Primary Action per semantic object">\n            <l:VerticalLayout>\n                <MessageStrip\n                        text="The primary action is an action either tagged via sap-tag as primary action or via the action naming convention \'displayFactSheet\' per Semantic Object. Put a name of an Semantic Object into the input below and see the name of the target displayed that is the primary action"\n                        showIcon="true"\n                        customIcon="sap-icon://tag"\n                        showCloseButton="false"\n                        class="sapUiMediumMarginBottom"/>\n                <Label text="Semantic Object"/>\n                <Input\n                        id="semanticObject"\n                        type="Text"\n                        width="400px"\n                        class="sapUiMediumMarginBottom"\n                        placeholder="Enter semantic object ..."\n                        showSuggestion="true"\n                        suggestionItems="{SOmodel>/suggestions}"\n                        suggestionItemSelected="onSemanticObjectSelected">\n                    <suggestionItems>\n                        <core:Item text="{SOmodel>name}" />\n                    </suggestionItems>\n                </Input>\n                <Label text="Primary Action:" />\n                <Text text="{tagModel>/primaryIntent/text}"/>\n            </l:VerticalLayout>\n\n            <!-- text area to display the primary link-->\n        </Panel>\n        <Panel id="arbitrary_tag_testing" headerText="Tag group testing">\n            <l:VerticalLayout>\n                <MessageStrip\n                        text="Here you can test arbitrary tagged navigation targets in the FLP content. You can determine via the Semantic Object as selected in the first input and in combination with sap-tag values as entered as tokens into the second input.."\n                        showIcon="true"\n                        customIcon="sap-icon://tag"\n                        showCloseButton="false"\n                        class="sapUiMediumMarginBottom"/>\n                <Label text="Semantic Object"/>\n                <Input\n                        value="Tagtesting"\n                        id="semanticObject1"\n                        type="Text"\n                        width="400px"\n                        placeholder="Enter semantic object ..."\n                        showSuggestion="true"\n                        suggestionItems="{SOmodel>/suggestions}"\n                        suggestionItemSelected="onSemanticObjectSelectedForTags">\n                    <suggestionItems>\n                        <core:Item text="{SOmodel>name}" />\n                    </suggestionItems>\n                </Input>\n                <Label text="Type in some tags here to filter"/>\n                <MultiInput placeholder="enter some tags here as tokens" width="400px" showValueHelp="false" tokenUpdate="onTokenUpdated" id="tagTokenizer" class="sapUiMediumMarginBottom"/>\n                <Text text="tagged links are:"/>\n                <List items="{tagModel>/taggedIntents}">\n                    <StandardListItem title="{tagModel>text}"/>\n                </List>\n            </l:VerticalLayout>\n\n\n        </Panel>\n\n    </Page>\n</core:View>',
	"sap/ushell/demo/AppNavSample/view/SmartNavSample.controller.js":function(){sap.ui.define( [
    'sap/ui/core/mvc/Controller',
    "sap/ushell/services/SmartNavigation",
    "sap/ui/model/json/JSONModel"
], function ( Controller, SmartNavigation, JSONModel ) {
    "use strict";

    var oSmartNavService;

    return Controller.extend( "sap.ushell.demo.AppNavSample.view.SmartNavSample", {

        onInit: function() {
            oSmartNavService = sap.ushell.Container.getService("SmartNavigation");
        },

        onBeforeRendering: function () {
            var that = this;

            oSmartNavService.getLinks( { semanticObject: "Action" } )
                .then( function ( links ) {
                    that.getView().getModel("SOmodel").setProperty( "/links", links );
                }.bind( this ) );
        },

        onSemanticObjectSelected: function ( oEvent ) {
            var that = this;
            var sSemObject = oEvent.getParameter( "selectedItem" ).getText();

            oSmartNavService.getLinks( { semanticObject: sSemObject } )
                    .then( function ( links ) {
                        that.getView().getModel("SOmodel").setProperty( "/links", links );
                    }.bind( this ) );
        },

        onItemPressed: function ( oEvt ) {
            var intent = oEvt.getSource().getText();
            oSmartNavService.toExternal( { target: { shellHash: intent } } );
        }

    } );
} );
},
	"sap/ushell/demo/AppNavSample/view/SmartNavSample.view.xml":'<core:View xmlns="sap.m"\n           xmlns:core="sap.ui.core"\n           xmlns:mvc="sap.ui.core.mvc"\n           controllerName="sap.ushell.demo.AppNavSample.view.SmartNavSample">\n\n    <Page title="AppNavSample: Smart Sample View">\n\n        <content>\n\n            <Input\n                id="semanticObject"\n                type="Text"\n                width="40%"\n                class="sapUiLargeMargin"\n                placeholder="Enter semantic object ..."\n                showSuggestion="true"\n                suggestionItems="{SOmodel>/suggestions}"\n                suggestionItemSelected="onSemanticObjectSelected">\n                <suggestionItems>\n                    <core:Item text="{SOmodel>name}" />\n                </suggestionItems>\n            </Input>\n                <Table\n                    inset="false"\n                    items="{SOmodel>/links}">\n                    <headerToolbar>\n                        <Toolbar>\n                            <Title text="Intents" level="H2"/>\n                        </Toolbar>\n                    </headerToolbar>\n                    <columns>\n                         <Column\n                            minScreenWidth="Tablet"\n                            demandPopin="true"\n                            width="3em">\n                            <Text text="Icon" />\n                        </Column>\n                         <Column\n                            minScreenWidth="Tablet"\n                            demandPopin="true">\n                            <Text text="Intent" />\n                        </Column>\n                        <Column\n                            minScreenWidth="Tablet"\n                            demandPopin="true">\n                            <Text text="Title" />\n                        </Column>\n                        <Column\n                            minScreenWidth="Tablet"\n                            demandPopin="true"\n                            width="8em">\n                            <Text text="Sub Title" />\n                        </Column>\n                        <Column\n                            minScreenWidth="Tablet"\n                            demandPopin="true"\n                            width="8em">\n                            <Text text="Short Title" />\n                        </Column>\n                        <Column\n                            minScreenWidth="Tablet"\n                            demandPopin="true">\n                            <Text text="Additional information" />\n                        </Column>\n                    </columns>\n                    <items>\n                        <ColumnListItem>\n                            <cells>\n                                <core:Icon\n                                    src="{SOmodel>icon}"/>\n                                <Link\n                                    text="{SOmodel>intent}"\n                                    press="onItemPressed"/>\n                                <Text\n                                    text="{SOmodel>text}" />\n                                <Text\n                                    text="{SOmodel>subTitle}" />\n                                <Text\n                                    text="{SOmodel>shortTitle}" />\n                                <Text\n                                    text="Frequency of visit in last 90 days: {SOmodel>clickCount}" />\n                            </cells>\n                        </ColumnListItem>\n                    </items>\n                </Table>\n        </content>\n    </Page>\n\n</core:View>',
	"sap/ushell/demo/AppNavSample/view/UserDefaultView.controller.js":function(){sap.ui.controller("sap.ushell.demo.AppNavSample.view.UserDefaultView", {
    oApplication : null,
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Detail
*/
    onInit: function() {
        var that = this;
    },

    updateContentFromModel : function () {

    },
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.Detail
*/
//	onBeforeRendering: function() {
//
//	},
    getMyComponent: function () {
        "use strict";
        var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
        return sap.ui.component(sComponentId);
    },

    /**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.Detail
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.Detail
*/
    onExit: function () {
        "use strict";
        jQuery.sap.log.info("sap.ushell.demo.AppNavSample: onExit of UserDefaultView");
    }

});
},
	"sap/ushell/demo/AppNavSample/view/UserDefaultView.view.xml":'<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m" controllerName="sap.ushell.demo.AppNavSample.view.UserDefaultView"\n    xmlns:form="sap.ui.layout.form"\n    xmlns:html="http://www.w3.org/1999/xhtml">\n    <Page title="User Default Scenario">\n        <content>\n        <form:SimpleForm id="PersonalInformationForm"\n                width="auto"\n                layout="ResponsiveGridLayout"\n                editable="true"\n                labelSpanL="3"\n                labelSpanM="3"\n                emptySpanL="4"\n                emptySpanM="4"\n                columnsL="1"\n                columnsM="1"\n                title="Personal Data"\n                minWidth="1024"\n                maxContainerCols="2">\n                  <Label text="Last Name" />\n                  <Input type="Text" enabled="true" id="lastNameInputField" value="{UserDefaults>/lastName}"/>\n                  <Label text="First Name" />\n                  <Input type="Text" enabled="true" id="firstNameInputField" value="{UserDefaults>/firstName}"/>\n                  <Label text="E-Mail address" />\n                  <Input type="Text" enabled="true" id="emailInputField" value=""/>\n                  <Label text="Phone Number" />\n                  <Input type="Text" enabled="true" id="phoneInputField" value=""/>\n            </form:SimpleForm>\n\t        <form:SimpleForm id="CommunityNetworking"\n                width="auto"\n                layout="ResponsiveGridLayout"\n                editable="true"\n                labelSpanL="3"\n                labelSpanM="3"\n                emptySpanL="4"\n                emptySpanM="4"\n                columnsL="1"\n                columnsM="1"\n                title="Community and Networking"\n                minWidth="1024"\n                maxContainerCols="2">\n                  <Label text="SAP JAM Activity" />\n                  <Slider enabled="true" min="0" valueLiveUpdate="true" max="2000" id="jamSlider" value="{UserDefaults>/communityActivityHigh}"/>\n            </form:SimpleForm>\n        </content>\n    </Page>\n</core:View>',
	"sap/ushell/demo/AppNavSample/view/View1.controller.js":function(){sap.ui.controller("sap.ushell.demo.AppNavSample.view.View1", {
    oApplication : null,
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Detail
*/
    onInit: function() {
        var that = this;
        var o;
        try {
            o = JSON.parse(jQuery.sap.storage(jQuery.sap.storage.Type.local).get("sap.ushell.AppNavSample.v1"));
        } catch (ex) {
        }
        this.oModel = new sap.ui.model.json.JSONModel(o || {
            SO : "Action",
            action: "toshowparameters",
            params : "A=B&C=D",
            addLongParams : false,
            appStateOn : false,
            appStateAsText : false,
            appStateText : "",
            P1 : true,
            P2 : false,
            P1New : false,
            PX : ""
        });
        this.getView().setModel(this.oModel, "v1");

        this.oModel2 = new sap.ui.model.json.JSONModel({
            textOK : "Success",
            tooltip : "Enter a valid json object",
            data : "",
            appStateAsSelectionVariant : false
        });
        this.getView().setModel(this.oModel2, "v2");


        // // that.updateAppStateFromModelInitial();
        // register an event handler on the model, to track future changes
        this.oModel.bindTree("/").attachChange(function () {
            that.updateUrlFromModel();
            jQuery.sap.storage(jQuery.sap.storage.Type.local).put("sap.ushell.AppNavSample.v1", JSON.stringify(that.oModel.getData()));
        });
        setTimeout(this.updateUrlFromModel.bind(this),200);
    },

    updateUrlFromModel : function () {
        var sSemanticObject,
            sAction,
            oParams,
            href,
            mdl,
            oAppState,
            oAppStateData,
            sAppStateKey,
            oRootComponent = this.getOwnerComponent();
        oRootComponent.getURLParsingService().done( function( oURLParsing) {
            sSemanticObject = this.getView().getModel("v1").getProperty("/SO");
            sAction = this.getView().getModel("v1").getProperty("/action");

            mdl = this.getView().getModel("v1");
            this.getView().getModel("v2").setProperty("/appStateAsSelectionVariant", this.getView().getModel("v1").getProperty("/appStateOn") && !this.getView().getModel("v1").getProperty("/appStateAsText"));
            this.getView().getModel("v2").setProperty("/appStateAsTextOn", this.getView().getModel("v1").getProperty("/appStateOn") && this.getView().getModel("v1").getProperty("/appStateAsText"));
            if (this.getView().getModel("v1").getProperty("/appStateOn")) {
                oAppState = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(this.getMyComponent());
                sAppStateKey = oAppState.getKey();
                if (this.getView().getModel("v1").getProperty("/appStateAsText")) {
                    try {
                        oAppStateData = JSON.parse(mdl.getProperty("/appStateText"));
                        this.getView().getModel("v2").setProperty("/textOK", "Success");
                        this.getView().getModel("v2").setProperty("/tooltip", "");
                    } catch (ex) {
                        this.getView().getModel("v2").setProperty("/textOK", "Error");
                        this.getView().getModel("v2").setProperty("/tooltip", ex.toString());
                    }
                } else {
                    oAppStateData = { selectionVariant : { SelectOptions : [] }};
                    if (mdl.getProperty("/P1")) {
                        oAppStateData.selectionVariant.SelectOptions.push({ PropertyName : "P1",
                            "Ranges" : [{
                                "Sign": "I",
                                "Option": "EQ",
                                "Low": "INT",
                                "High": null
                            }]
                        });
                    }
                    if (mdl.getProperty("/P2")) {
                            oAppStateData.selectionVariant.SelectOptions.push({ PropertyName : "P2",
                                "Ranges" : [{
                                    "Sign": "I",
                                    "Option": "BT",
                                    "Low": "P2ValueLow",
                                    "High": "P2ValueHigh"
                            }]
                        });
                    }
                    if (mdl.getProperty("/P1New")) {
                        oAppStateData.selectionVariant.SelectOptions.push({ PropertyName : "P1New",
                            "Ranges" : [{
                                "Sign": "I",
                                "Option": "BT",
                                "Low": "P1NewValueLow",
                                "High": "P1NewValueHigh"
                            }]
                        });
                    }
                    if (mdl.getProperty("/PX")) {
                        oAppStateData.selectionVariant.SelectOptions.push({ PropertyName : mdl.getProperty("/PX"),
                            "Ranges" : [{
                                "Sign": "I",
                                "Option": "BT",
                                "Low": "PXValueLow",
                                "High": "PXValueHigh"
                            }]
                        });
                    }
                }
                oAppState.setData(oAppStateData);
                this.getView().getModel("v2").setProperty("/data", JSON.stringify(oAppStateData));
                oAppState.save();
            }
            oParams = oURLParsing.parseParameters("?" + this.getView().getModel("v1").getProperty("/params") || "");
            if (this.getView().getModel("v1").getProperty("/addLongParams")) {
                var thelongstring, k, i;
                oParams.Cx = ["X"];
                thelongstring = "A1234";
                for ( k = 0; k < 20; k = k + 1 ) {
                    thelongString = "A" + i + thelongstring;
                    for (i = 0; i < 4; i = i + 1) { //4000
                        thelongstring = thelongstring + "xx" + i;
                    }
                    thelongString = thelongstring + i;
                    oParams.Cx.push(thelongstring);
                    oParams["C" + k ] = [ thelongstring ];
                }
            }
            this.args = {
                target: {
                    semanticObject : sSemanticObject,
                    action : sAction
                },
                appStateKey : sAppStateKey,
                params : oParams
            };
            href = sap.ushell.Container.getService("CrossApplicationNavigation").hrefForExternal(this.args, this.getMyComponent());
            if (this.getView().getModel()) {
                this.getView().getModel().setProperty("/toGeneratedLink", href);
            }
        }.bind(this));
    },
/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.Detail
*/
//	onBeforeRendering: function() {
//
//	},
    getMyComponent: function () {
        "use strict";
        var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
        return sap.ui.component(sComponentId);
    },

    handleBtn1Press : function() {
        this.oApplication.navigate("toView", "View2");
    },

    handleBtnGenPress : function() {
        sap.ushell.Container.getService("CrossApplicationNavigation").toExternal(this.args, this.getMyComponent());
    },

    /**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.Detail
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.Detail
*/
    onExit: function () {
        "use strict";
        jQuery.sap.log.info("sap.ushell.demo.AppNavSample: onExit of View1");
    }

});
},
	"sap/ushell/demo/AppNavSample/view/View1.view.xml":'<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"\n\txmlns="sap.m" controllerName="sap.ushell.demo.AppNavSample.view.View1"\n\txmlns:form="sap.ui.layout.form"\n\txmlns:html="http://www.w3.org/1999/xhtml">\n\t<Page title="Start any intent">\n\t\t<content>\n\t\t\t<form:SimpleForm id="form" minWidth="1024" maxContainerCols="2">\n              <Label text="Semantic Object" />\n              <Input id="f2" type="Text" value="{v1>/SO}" placeholder="Semantic Object"/>\n              <Label text="Action" />\n              <Input id="f3" value="{v1>/action}" type="Text"/>\n              <Label text="params" />\n              <Input id="f4" value="{v1>/params}" type="Text" placeholder="params" tooltip="parameter string" />\n              <Label text="Add long parameters" /> <Switch id="fx" state="{v1>/addLongParams}" />\n\t\t\t</form:SimpleForm>\n              <Panel headerText="invoke with application state" colwidth="2">\n              <Label text="add AppState:" labelFor="ason"/>\n              <Switch id="ason" state="{v1>/appStateOn}" />\n              <Label text="as text" />\n              <Switch state="{v1>/appStateAsText}" visible="{v1>/appStateOn}"/>\n              <form:SimpleForm id="formT" minWidth="1024" maxContainerCols="2"  visible="{v2>/appStateAsTextOn}">\n                <Label text="AppState content" />\n                <TextArea rows="4" enabled="{v1>/appStateAsText}" tooltip="{v2>/tooltip}" hidden="{v1>/appStateAsText}" id="txt2" value="{v1>/appStateText}" valueState="{v2>/textOK}"/>\n              </form:SimpleForm>\n\n              <form:SimpleForm id="form3" minWidth="1024" maxContainerCols="2" visible="{v2>/appStateAsSelectionVariant}">\n              <Label text="P1" />\n              <Switch state="{v1>/P1}" hidden="{v1>/appStateAsText}" />\n              <Label text="P2" />\n              <Switch state="{v1>/P2}" />\n              <Label text="P1New" />\n              <Switch state="{v1>/P1New}" />\n              <Label text="Free Select Option name:" />\n              <Input type="Text" value="{v1>/PX}" />\n\t\t      </form:SimpleForm>\n              <TextArea rows="4" cols="80" visible="{v1>/appStateOn}" value="{v2>/data}" enabled="false"/>\n             </Panel>\n\t\t\t<Link href="{/toGeneratedLink}" text="to generated link from Navigation target"\n\t\t\t\ttooltip="to generated link above"/>\n\t\t\t<Button id="btntoGeneratedLink" text="toGenerated Link" press="handleBtnGenPress" class="testToView2Btn"/>\n\t\t<form:SimpleForm id="appNavView1Form" minWidth="1024" maxContainerCols="2">\n              <Label text="Received AppState (JSON.stringified)" />\n              <Input type="Text" enabled="false" id="fas2" value="{AppState>/appstate/stringifiedAppstate}"/>\n\t\t</form:SimpleForm>\n\t\t</content>\n\t</Page>\n</core:View>',
	"sap/ushell/demo/AppNavSample/view/View2.controller.js":function(){sap.ui.controller("sap.ushell.demo.AppNavSample.view.View2", {
    oApplication: null,
    /**
     * Called when a controller is instantiated and its View controls (if available) are already created. Can be used to modify the View before it is
     * displayed, to bind event handlers and do other one-time initialization.
     * 
     * @memberOf view.Detail
     */
    onInit: function() {
        var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
        var myComponent = sap.ui.component(sComponentId);
        if (myComponent.getComponentData().startupParameters) {
            jQuery.sap.log.debug("startup parameters of appnavsample are " + JSON.stringify(myComponent.getComponentData().startupParameters));
        }
    },

    handleBtnDP2Press: function() {
        "use strict";
        var oDP2 = this.oView.byId("DP2");
        var sDate = oDP2.getDateValue();

        var dialog = new sap.m.Dialog({
            title: 'Date',
            type: 'Message',
            content: new sap.m.Text({
                text: sDate
            }),
            beginButton: new sap.m.Button({
                text: 'OK',
                press: function() {
                    dialog.close();
                }
            }),
            afterClose: function() {
                dialog.destroy();
            }
        });

        dialog.open();
    },

    handleBtnDP3Press: function() {
        "use strict";
        var oDP3 = this.oView.byId("DP3");
        var sDate = oDP3.getDateValue();

        var dialog = new sap.m.Dialog({
            title: 'Date',
            type: 'Message',
            content: new sap.m.Text({
                text: sDate
            }),
            beginButton: new sap.m.Button({
                text: 'OK',
                press: function() {
                    dialog.close();
                }
            }),
            afterClose: function() {
                dialog.destroy();
            }
        });

        dialog.open();
    }
});
},
	"sap/ushell/demo/AppNavSample/view/View2.view.xml":'<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m" xmlns:l="sap.ui.layout" controllerName="sap.ushell.demo.AppNavSample.view.View2"\n    xmlns:html="http://www.w3.org/1999/xhtml">\n    <Page title="View2">\n        <content>\n            <l:HorizontalLayout>\n                <Button text="toView1" press="handleBtn1Press"\n                    class="testToView1Btn"></Button>\n                <Label width="350px"\n                    text="DatePicker long - to test with Islamic Calendar set Date Format \'Islamic Date 1\' on FES"\n                    tooltip="DatePicker long - to test with Islamic Calendar set Date Format \'Islamic Date 1\' on FES"\n                    labelFor="DP2"/>\n                <DatePicker id="DP2" value="2014-03-26"\n                    valueFormat="yyyy-MM-dd" displayFormat="long"\n                    class="sapUiSmallMarginBottom" />\n                <Button id="btnDP2" text="Display Gregorian date"\n                    press="handleBtnDP2Press" />\n            </l:HorizontalLayout>\n            <l:HorizontalLayout>\n                <Label width="350px" text="DatePicker short"\n                    labelFor="DP3" />\n                <DatePicker id="DP3" displayFormat="short" />\n                <Button id="btnDP3" text="Display Gregorian date"\n                    press="handleBtnDP3Press" />\n            </l:HorizontalLayout>\n\n        </content>\n    </Page>\n</core:View>',
	"sap/ushell/demo/AppNavSample/view/View3.controller.js":function(){/*globals sap*/
sap.ui.controller("sap.ushell.demo.AppNavSample.view.View3", {
    oApplication : null,
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Detail
*/
    onInit: function () {
        "use strict";
        this.generateLinks();
    },
    handleRefresh : function () {
        "use strict";
        sap.ui.getCore().getEventBus().publish("sap.ui.core.UnrecoverableClientStateCorruption","RequestReload",{});
    },
	generateLinks : function() {
		this.getOwnerComponent().getRootControl().getController().generateLinks();
	}
});
},
	"sap/ushell/demo/AppNavSample/view/View3.view.xml":'<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"\r\n\t\t   xmlns="sap.m" controllerName="sap.ushell.demo.AppNavSample.view.View3"\r\n\t\t   xmlns:html="http://www.w3.org/1999/xhtml">\r\n\t<Page title="Cross App Link Lists">\r\n\t\t<content>\r\n\t\t\t<Panel class="">\r\n\t\t\t\t<headerToolbar>\r\n\t\t\t\t\t<Toolbar>\r\n\t\t\t\t\t\t<Title text="Links to WDA"/>\r\n\t\t\t\t\t\t<ToolbarSpacer/>\r\n\t\t\t\t\t\t<Button icon="sap-icon://refresh" press="handleWDARefresh"/>\r\n\t\t\t\t\t</Toolbar>\r\n\t\t\t\t</headerToolbar>\r\n\t\t\t\t<content>\r\n\t\t\t\t\t<VBox>\r\n\t\t\t\t\t\t<Label text="on View 3"/>\r\n\t\t\t\t\t\t<Label text="Navigation to other technologies ... (requires Action-tosu01 / Action-tosu01html to be configured)"/>\r\n\t\t\t\t\t\t<Link href="{/toView1_href}" text="to View 1 (via link)"\r\n\t\t\t\t\t\t\t  tooltip="to View 1 (via link, note the href generation!)"/>\r\n\t\t\t\t\t\t<Link href="{/toSU01html_href}" text="to SU01 SAPGui 4 HTML (via link)"\r\n\t\t\t\t\t\t\t  tooltip="to SU01 SAPGui 4 HTML (via link)"/>\r\n\t\t\t\t\t\t<Link href="{/toSU01_href}" text="to SU01 SAPGui (Win)"\r\n\t\t\t\t\t\t\t  tooltip="to SU01 SAPGui 4 Windows (via link)"/>\r\n\t\t\t\t\t\t<Link href="{/towdapp_href}" text="to WebDynpro application"\r\n\t\t\t\t\t\t\t  tooltip="to webdynpro application (via link)"/>\r\n\t\t\t\t\t\t<Link href="{/WDANavSource_display}" text="to WebDynpro application"\r\n\t\t\t\t\t\t\t  tooltip="to webdynpro NavSource application (may required systeam alias pointing e.g. to U1Y)"/>\r\n\t\t\t\t\t\t<Link href="{/WDANavTarget_display}" text="to WebDynpro display application"\r\n\t\t\t\t\t\t\t  tooltip="to webdynpro WDANavTarget application (may required systeam alias pointing e.g. to U1Y)"/>\r\n\t\t\t\t\t\t<Label text="Navigation with renaming"/>\r\n\t\t\t\t\t\t<Link href="{/Action_parameterRename1}" text="parameter renaming case 1"\r\n\t\t\t\t\t\t\t  tooltip="to webdynpro application (via link)"/>\r\n\t\t\t\t\t\t<Link href="{/Action_parameterRename2}" text="parameter renaming case 2"\r\n\t\t\t\t\t\t\t  tooltip="rename Parameters case 2"/>\r\n\t\t\t\t\t\t<Link href="{/Action_parameterRename3}" text="parameter renaming case 3"\r\n\t\t\t\t\t\t\t  tooltip="rename Parameters case 3"/>\r\n\t\t\t\t\t\t<Link href="{/Action_parameterRename4}" text="parameter renaming case 4"\r\n\t\t\t\t\t\t\t  tooltip="rename Parameters case 4"/>\r\n\t\t\t\t\t\t<Link href="{/Action_parameterRename5}" text="parameter renaming case 5"\r\n\t\t\t\t\t\t\t  tooltip="rename Parameters case 5 (to WDA!)"/>\r\n\t\t\t\t\t\t<Link href="{/WDANavTarget_display_X}" text="to WebDynpro display application"\r\n\t\t\t\t\t\t\t  tooltip="to webdynpro WDANavTarget application (may required systeam alias pointing e.g. to U1Y)"/>\r\n\t\t\t\t\t</VBox>\r\n\t\t\t\t</content>\r\n\t\t\t</Panel>\r\n\t\t\t<Panel>\r\n\t\t\t\t<headerToolbar>\r\n\t\t\t\t\t<Toolbar>\r\n\t\t\t\t\t\t<Title text="Generated Links from CrossAppService"/>\r\n\t\t\t\t\t\t<ToolbarSpacer/>\r\n\t\t\t\t\t\t<Button icon="sap-icon://refresh" press="generateLinks"/>\r\n\t\t\t\t\t</Toolbar>\r\n\t\t\t\t</headerToolbar>\r\n\t\t\t\t<content>\r\n\t\t\t\t\t<VBox>\r\n\t\t\t\t\t\t<Link href="{/DefaultApp_display_href}" text="cross app link (Default App)"\r\n\t\t\t\t\t\t\t  tooltip="Back to Fiori Sandbox Default Application (note href is generated!)"/>\r\n\t\t\t\t\t\t<Link href="{/AppNavSample_display_args_href}" text="our app other startup!"\r\n\t\t\t\t\t\t\t  tooltip="Same application, differen}t startup parameter ( new date), this triggers and application reload! (note href is generated!)"/>\r\n\t\t\t\t\t\t<Link href="{/AppNavSample_urlparamescaping_href}"\r\n\t\t\t\t\t\t\t  text="our app weird parameter name (encoding of parameters)!"\r\n\t\t\t\t\t\t\t  tooltip="Same application, different startup parameter (/UI2/PAR=...), this triggers and application reload! (note href is generated!)"/>\r\n\t\t\t\t\t\t<Link href="{/AppNavSample_urlparamescaping2_href}"\r\n\t\t\t\t\t\t\t  text="our app weird parameter name (encoding of parameters 2x)!"\r\n\t\t\t\t\t\t\t  tooltip="Same application, different startup parameter (/UI2/PAR=...&amp;/UI2/ZPAR=XXX ), this triggers and application reload! (note href is generated!)"/>\r\n\t\t\t\t\t\t<Link href="{/AppNavSample_toourupWithView1AsStartup}"\r\n\t\t\t\t\t\t\t  text="our app with explicit View Selection via Startup parameter! (View1 is selected)!"\r\n\t\t\t\t\t\t\t  tooltip="Same application, explicit View selection (View=View1) this triggers an application reload"/>\r\n\t\t\t\t\t\t<Link href="{/AppNavSample_longurl}" text="our app long URL parameters (URL Shortening)"\r\n\t\t\t\t\t\t\t  tooltip="Same application, different startup parameter with url shortening, trigger app reload"/>\r\n\t\t\t\t\t\t<Link href="{/toWdaIntentNavigationTest}" text="wda with appstate"\r\n\t\t\t\t\t\t\t  tooltip="WDA navigation with appstate"/>\r\n\t\t\t\t\t\t<Link href="{/toWDANavTarget_display}" text="other wda with appstate"\r\n\t\t\t\t\t\t\t  tooltip="#WDANavTarget-display with appstate and url shortening"/>\r\n\t\t\t\t\t\t<Link href="{/toWDANavTarget_displayCompressed}"\r\n\t\t\t\t\t\t\t  text="wda with appstate, compacted parameters"\r\n\t\t\t\t\t\t\t  tooltip="#WDANavTarget-display with appstate and url shortening"/>\r\n\t\t\t\t\t\t<Link href="{/toNonExistentApp}" text="non existent app -&gt; error dialog"\r\n\t\t\t\t\t\t\t  tooltip="Application does not exists"/>\r\n\t\t\t\t\t\t<Link href="{/AppNavSample_crashing}" text="our app, crash on startup"\r\n\t\t\t\t\t\t\t  tooltip="Same application, different parameter CRASHME triggers exception in startup"/>\r\n\t\t\t\t\t\t<Link href="{/toView1_href}" text="to View1" tooltip="to View2 (href generated!)"/>\r\n\t\t\t\t\t\t<Link href="{/toView2_href}" text="to View2" tooltip="to View2 (href generated!)"/>\r\n\t\t\t\t\t\t<Link href="{/toView3_href}" text="to View3" tooltip="to View3 (href generated!)"/>\r\n\t\t\t\t\t\t<Link href="{/toHome}" text="to Home" tooltip="to home (&quot;#&quot;)"/>\r\n\t\t\t\t\t\t<Link href="{/toShellHome}"\r\n\t\t\t\t\t\t\t  text="to Shell-home (bad way, not recommended, only for testing!)"\r\n\t\t\t\t\t\t\t  tooltip="to Shell-home"/>\r\n\t\t\t\t\t\t<Link href="{/anIsUrlSupportedUrl1}" text="a supported URL"\r\n\t\t\t\t\t\t\t  tooltip="a supported URL (FLP assigned to user)"\r\n\t\t\t\t\t\t\t  enabled="{/anIsUrlSupportedUrl1Enabled}"/>\r\n\t\t\t\t\t\t<Link href="{/anIsUrlSupportedUrl2}"\r\n\t\t\t\t\t\t\t  text="a not supported URL (intent Action-notexisting not configured for user)"\r\n\t\t\t\t\t\t\t  tooltip="a not supported URL" enabled="{/anIsUrlSupportedUrl2Enabled}"/>\r\n\t\t\t\t\t\t<Link href="{/anIsUrlSupportedUrl3}" text="a supported (foreign) URL"\r\n\t\t\t\t\t\t\t  tooltip="a supported (foreign) URL" enabled="{/anIsUrlSupportedUrl3Enabled}"/>\r\n\t\t\t\t\t\t<Link href="{/anIsUrlSupportedUrl4}" text="a supported URL (weird hash)"\r\n\t\t\t\t\t\t\t  tooltip="a weird hash, (supported!)" enabled="{/anIsUrlSupportedUrl4Enabled}"/>\r\n\t\t\t\t\t\t<Link href="{/AppNavSample_urlWrongEscaping}" text="link to some app, wrong escaped"\r\n\t\t\t\t\t\t\t  tooltip="result of getSemanticObject Link direclty in link, flawed usage"/>\r\n\t\t\t\t\t\t<Link href="{/AppNavSample_urlCorrectEscaping}" text="link to some app, correct escaped"\r\n\t\t\t\t\t\t\t  tooltip="result of getSemanticObjectLink transformed via hrefToExternal , correct pattern"/>\r\n\t\t\t\t\t\t<Link href="{/appNavSample2WithInnerRoute}"\r\n\t\t\t\t\t\t\t  text="link to another app with an inner-app route (only for testing, do not copy this pattern!)"\r\n\t\t\t\t\t\t\t  tooltip="for testing that the own component\'s router is stopped before the new component is initialized"/>\r\n\t\t\t\t\t\t<Link href="{/toRedirectURL}" text="link to redirect url (WDA)"\r\n\t\t\t\t\t\t\t  tooltip="to redirect url, new window"/>\r\n\t\t\t\t\t\t<Link href="{/toRedirectURL2}" text="link to redirect url"\r\n\t\t\t\t\t\t\t  tooltip="to redirect url, same window"/>\r\n\t\t\t\t\t\t<Link href="{/toRedirectURL3}" text="link to redirect url (WDA)"\r\n\t\t\t\t\t\t\t  tooltip="to redirect url, new window"/>\r\n\t\t\t\t\t\t<Link href="{/toRedirectURL4}" text="link to redirect url (same window, crashing)"\r\n\t\t\t\t\t\t\t  tooltip="to redirect url, same window, crashing"/>\r\n\t\t\t\t\t\t<Link href="{/toRedirectURL5}" text="link to redirect url (same window, no target)"\r\n\t\t\t\t\t\t\t  tooltip="to redirect url, same window, no target"/>\r\n\t\t\t\t\t</VBox>\r\n\t\t\t\t</content>\r\n\t\t\t</Panel>\r\n\t\t</content>\r\n\t</Page>\r\n</core:View>',
	"sap/ushell/demo/AppNavSample/view/View4.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"], function (oController) {

    function convertParametersToSimpleSyntax(oExtendedParameters) {
        try {
            return Object.keys(oExtendedParameters).map(function(sParameterName) {
                var vParameterValue = oExtendedParameters[sParameterName].value;

                if (Object.prototype.toString.apply(vParameterValue) === "[object Array]") {
                    return vParameterValue.map(function (sValue) {
                        return sParameterName + "=" + sValue;
                    }).join("&");
                }

                var sParameterValue = "" + vParameterValue;
                return sParameterName + "=" + sParameterValue;
            }).join("&");
        } catch (e) {
            return "cannot convert: check format";
        }
    }

    function convertParametersToExtendedSyntax(sParamsSimple) {
        var oParamsExtended = sParamsSimple.split("&").map(function (sNameValue) {
            var aNameValue = sNameValue.split("=");
            return {
                name: aNameValue[0],
                value: aNameValue[1]
            };
        }).reduce(function (oExtendedParams, oParamParsed) {

            if (oExtendedParams[oParamParsed.name]) {
                var vExistingValue = oExtendedParams[oParamParsed.name].value;

                if (Object.prototype.toString.apply(vExistingValue) === "[object Array]") {
                    vExistingValue.push(oParamParsed.value);
                } else {  // assume existing value is a string
                    oExtendedParams[oParamParsed.name].value = [
                        vExistingValue, oParamParsed.value
                    ];
                }

                return oExtendedParams;
            }

            oExtendedParams[oParamParsed.name] = { value: oParamParsed.value };
            return oExtendedParams;
        }, {});

        return JSON.stringify(oParamsExtended, null, 3);
    }

    return oController.extend("sap.ushell.demo.AppNavSample.view.View4", {

        oApplication : null,
        /**
        * Called when a controller is instantiated and its View controls (if available) are already created.
        * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
        * @memberOf view.Detail
        */
        onInit: function() {
            var that = this;

            this.oInputModel = new sap.ui.model.json.JSONModel({
                SO: "Action",
                action: "toappnavsample",
                params: "A=B&C=D",
                paramsExtended: "",
                compactIntents: false,
                ignoreFormFactor: false,
                useExtendedParamSyntax: false
            });

            this.oModel = new sap.ui.model.json.JSONModel({
                SO: "Action",
                action: "toappnavsample",
                params: "A=B&C=D",
                supported: false,
                supportedColor: "red",
                navSupportedColor: "red",
                compactIntents: false,
                treatTechHintAsFilter : false,
                withAtLeastOneUsedParam : false,
                hashFragment: "",
                hashFragmentLength: 0,
                callMethod: "getSemanticObjectLinks",
                callCount: 0,
                sortResultsBy: "intent",
                links : []
                //{ "name" : "x", "link" : "http://www.nytimes.com" , "escapedLink" : "http://www.nytimes.com" },
                //{ "name" : "yx", "link" : "http://www.nytimes.com", "escapedLink" : "http://www.nytimes.com" } ]
            });

            this.getView().setModel(this.oInputModel, "mdlInput");
            this.getView().setModel(this.oModel, "v1");

            this.updateFromInputModel();

            // register an event handler on the model, to track future changes
            this.oInputModel.bindTree("/").attachChange(function () {
                that.updateFromInputModel();
            });

        },
        onParamSyntaxChanged: function (oEvent) {
            var sExtendedParameters,
                sSimpleParameters,
                oExtendedParameters;

            if (oEvent.getSource().getState() === true) {
                sSimpleParameters = this.oInputModel.getProperty("/params");
                sExtendedParameters = convertParametersToExtendedSyntax(sSimpleParameters);
                this.oInputModel.setProperty("/paramsExtended", sExtendedParameters);
            } else {
                try {
                    oExtendedParameters = JSON.parse(this.oInputModel.getProperty("/paramsExtended"));
                } catch (e) {
                    oExtendedParameters = {};
                }
                sSimpleParameters = convertParametersToSimpleSyntax(oExtendedParameters);
                this.oInputModel.setProperty("/params", sSimpleParameters);
            }
        },
        onMethodSelected: function (oEvent) {
            var sMethod = oEvent.getSource().getSelectedButton().getText();
            this.oModel.setProperty("/callMethod", sMethod);
            if (sMethod === "getSemanticObjectLinks") {
                this.oInputModel.setProperty("/useExtendedParamSyntax", false);
            }
            this.updateFromInputModel();
        },
        onSortResultsByChanged: function (oEvent) {
            var sSortResultsBy = oEvent.getParameters().newValue;
            this.oModel.setProperty('/sortResultsBy', sSortResultsBy);
        },
        handleTextLiveChange: function (oEvent) {
            var oMdlV1 = this.getView().getModel("v1"),
                sSemanticObject = this.byId("f2").getValue() || "",
                sAction = this.byId("f3").getValue() || "",
                sParams = this.byId("f4").getValue() || "",
                sIntent = "#" + sSemanticObject + "-" + sAction + (sParams.length > 0 ? "?" + sParams : "" );

            oMdlV1.setProperty("/hashFragment", sIntent);
            oMdlV1.setProperty("/hashFragmentLength", sIntent.length);
        },
        updateFromInputModel: function () {
            var sSemanticObject = this.getView().getModel("mdlInput").getProperty("/SO"),
                sAction = this.getView().getModel("mdlInput").getProperty("/action"),
                bUseExtended = this.getView().getModel("mdlInput").getProperty("/useExtendedParamSyntax"),
                sExtendedParams = this.getView().getModel("mdlInput").getProperty("/paramsExtended"),
                sSimpleParams = this.getView().getModel("mdlInput").getProperty("/params"),
                bCompactIntents = this.getView().getModel("mdlInput").getProperty("/compactIntents"),
                bwithAtLeastOneUsedParam = this.getView().getModel("mdlInput").getProperty("/withAtLeastOneUsedParam"),
                bIgnoreFormFactor = this.getView().getModel("mdlInput").getProperty("/ignoreFormFactor"),
                sSortResultsBy = this.getView().getModel("v1").getProperty("/sortResultsBy"),
                btreatTechHintAsFilter = this.getView().getModel("mdlInput").getProperty("/treatTechHintAsFilter"),
                oRootComponent = this.getRootComponent(),
                that = this;

            oRootComponent.getURLParsingService().done( function( oURLParsing) {
                    var oExtendedParams;
                    if (bUseExtended) {
                        try {
                            oExtendedParams = JSON.parse(sExtendedParams);
                        } catch (oError) {
                            jQuery.sap.log.error(oError);
                            oExtendedParams = {};
                        }
                    }

                    var oSimpleParams = oURLParsing.parseParameters("?" + sSimpleParams || ""),
                        href;

                    // --- call hrefForExternal ---

                    that.args = {
                        target: {
                            semanticObject : sSemanticObject,
                            action : sAction
                        },
                        params : bUseExtended
                            ? convertParametersToSimpleSyntax(sSimpleParams)  // extended syntax not supported in this case
                            : sSimpleParams
                    };
                    href = sap.ushell.Container.getService("CrossApplicationNavigation").hrefForExternal(that.args, that.getRootComponent());
                    if (that.getView() && that.getView().getModel()) {
                        that.getView().getModel().setProperty("/toGeneratedLink", href);
                    }

                    // --- call getLinks or getSemanticObjectLinks ---

                    var sCallMethod = that.oModel.getProperty("/callMethod", sCallMethod);

                    var sCallArgsType,
                        vCallArgs;

                    if (sCallMethod === "getLinks") {
                        sCallArgsType = "nominal";
                        vCallArgs = {
                            semanticObject : sSemanticObject.length > 0 ? sSemanticObject : undefined,
                            action: sAction.length > 0 ? sAction : undefined,
                            params : bUseExtended ? oExtendedParams : oSimpleParams,
                            withAtLeastOneUsedParam : bwithAtLeastOneUsedParam,
                            treatTechHintAsFilter : btreatTechHintAsFilter,
                            ui5Component : oRootComponent,
                            compactIntents : bCompactIntents,
                            ignoreFormFactor: bIgnoreFormFactor,
                            sortResultsBy: sSortResultsBy
                        };

                    } else {
                        sCallArgsType = "positional";
                        vCallArgs = [
                            sSemanticObject,

                            bUseExtended       // oParams
                                ? oExtendedParams
                                : oSimpleParams,

                            bIgnoreFormFactor, // bIgnoreFormFactor
                            oRootComponent,
                            undefined, // sAppStateKey
                            bCompactIntents
                        ];
                    }

                    function fnCallDoneHandler (aRes) {
                        var aLinks = [];
                        aRes.forEach(function(oEntry) {
                            var sCorrectLink = sap.ushell.Container.getService("CrossApplicationNavigation").hrefForExternal({ target : { shellHash : oEntry.intent}}, oRootComponent);
                            aLinks.push( { name : oEntry.text, link : oEntry.intent, escapedLink : sCorrectLink });
                        });
                        that.oModel.setProperty("/links",aLinks);
                    }

                    var oCrossApplicationNavigation = sap.ushell.Container.getService("CrossApplicationNavigation");
                    if (sCallArgsType === "positional") {
                        oCrossApplicationNavigation[sCallMethod].apply(oCrossApplicationNavigation, vCallArgs)
                            .done(fnCallDoneHandler);
                    } else if (sCallArgsType === "nominal") {
                        oCrossApplicationNavigation[sCallMethod].call(oCrossApplicationNavigation, vCallArgs)
                            .done(fnCallDoneHandler);
                    } else {
                        throw new Error("Unknown call argument type '" + sCallArgsType + "'");
                    }

                    that.oModel.setProperty("/callArgsType", sCallArgsType);

                    // Remove the app root component before saving the arguments
                    var sRootComponentName = "<AppRootComponent " + oRootComponent.getId() + ">";
                    if (Object.prototype.toString.apply(vCallArgs) === "[object Array]") {
                        vCallArgs = vCallArgs.map(function (vArg) {
                            return vArg === oRootComponent
                                ? sRootComponentName
                                : vArg;
                        });
                        var sCallArgs = JSON.stringify(vCallArgs, null, 3);

                        // remove square brackets
                        sCallArgs = sCallArgs.slice(1, sCallArgs.length - 1);
                        that.oModel.setProperty("/callArgs", sCallArgs);
                    } else {
                        vCallArgs.ui5Component = sRootComponentName;
                        that.oModel.setProperty("/callArgs", JSON.stringify(vCallArgs, null, 3));
                    }


                    that.oModel.setProperty("/callCount", that.oModel.getProperty("/callCount") + 1);

                    //{
                    //    *   intent: "#AnObject-Action?A=B&C=e&C=j",
                    //    *   text: "Perform action"
                    //    * }
                    var sShellHash = "#" + sap.ushell.Container.getService("URLParsing").constructShellHash(that.args);
                    sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported([sShellHash]).done(function(oRes) {
                        if (oRes && oRes[sShellHash].supported === true){
                            that.oModel.setProperty("/supported", "supported");
                            that.oModel.setProperty("/supportedColor", "green");
                        } else {
                            that.oModel.setProperty("/supported", "not supported");
                            that.oModel.setProperty("/supportedColor", "red");
                        }
                    });
                    sap.ushell.Container.getService("CrossApplicationNavigation").isNavigationSupported([that.args]).done(function(oRes) {
                        if (oRes && oRes[0].supported === true){
                            that.oModel.setProperty("/navSupported", "supported");
                            that.oModel.setProperty("/navSupportedColor", "green");
                        } else {
                            that.oModel.setProperty("/navSupported", "not supported");
                            that.oModel.setProperty("/navSupportedColor", "red");
                        }
            });

            that.handleTextLiveChange();
        } )
},
        /**
         * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
         * (NOT before the first rendering! onInit() is used for that one!).
         * @memberOf view.Detail
         */
        //	onBeforeRendering: function() {
        //
        //	},
        getMyComponent: function () {
            "use strict";
            var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
            return sap.ui.component(sComponentId);
        },

        handleBtn1Press : function() {
            this.oApplication.navigate("toView", "View2");
        },

        handleBtnGSOPress : function() {
            this.updateFromInputModel();
            //sap.ushell.Container.getService("CrossApplicationNavigation").toExternal(this.args, this.getMyComponent());
        },

        handleListLinkPress : function (ev) {
            var sLink = ev.getSource().getSelectedItem().data("navigateTo");
            sap.ushell.Container.getService("CrossApplicationNavigation").toExternal({ target : { shellHash : sLink} });
        },

        handleBtnAddParamsPress: function (oEvent) {
            var sCurrentParams = this.getView().getModel("mdlInput").getProperty("/params"),
                iNumParamsCurrent = sCurrentParams.split("&").length,
                iNumParams = iNumParamsCurrent * 2,
                iLastNum = parseInt(sCurrentParams.split(/[a-zA-Z]/).pop(), 10);

            var iStartFrom = (iLastNum || 0) + 1,
                i,
                aParams = [];

            for (i = iStartFrom; i <= iStartFrom + iNumParams; i++) {
                aParams.push("p" + i + "=v" + i);
            }

            var sSep = "&";
            if (iNumParamsCurrent === 0 || sCurrentParams === "") {
                sSep = "";
            }

            this.getView().getModel("mdlInput").setProperty("/params", sCurrentParams + sSep + aParams.join("&"));
        },
        handleBtnExpandPress: function (oEvent) {
            // get link text
            var oButton = oEvent.getSource(),
                oModel = new sap.ui.model.json.JSONModel();

            oModel.setData({
                linkText: oButton.data("linkText")
            });

            // create popover
            if (!this._oPopover) {
                this._oPopover = sap.ui.xmlfragment("sap.ushell.demo.AppNavSample.view.View4Popover", this);
                this.getView().addDependent(this._oPopover);
            }
            this._oPopover.setModel(oModel);

            // delay because addDependent will do a async rerendering and the
            // actionSheet will immediately close without it.
            jQuery.sap.delayedCall(0, this, function() {
                this._oPopover.openBy(oButton);
            });
        },
        getRootComponent: function () {
            return sap.ui.core.Component.getOwnerComponentFor(this.getView());
        },
        /**
         * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
         * This hook is the same one that SAPUI5 controls get after being rendered.
         * @memberOf view.Detail
         */
         //	onAfterRendering: function() {
         //
         //	},

         /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberOf view.Detail
         */
        onExit: function () {
            "use strict";
            jQuery.sap.log.info("sap.ushell.demo.AppNavSample: onExit of View4");
        }

    });
});


},
	"sap/ushell/demo/AppNavSample/view/View4.view.xml":'<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"\n\txmlns="sap.m" controllerName="sap.ushell.demo.AppNavSample.view.View4"\n\txmlns:form="sap.ui.layout.form"\n\txmlns:l="sap.ui.layout"\n    xmlns:code="sap.ui.codeeditor"\n    xmlns:customData="http://schemas.sap.com/sapui5/extension/sap.ui.core.CustomData/1"\n\txmlns:html="http://www.w3.org/1999/xhtml">\n\t<Page title="Get semanticObjectLinks and isIntentSupported">\n\t\t<content>\n\t\t\t<form:SimpleForm \n                id="form"\n                width="auto"\n                layout="ResponsiveGridLayout"\n                editable="true"\n                labelSpanL="3"\n                labelSpanM="3"\n                emptySpanL="4"\n                emptySpanM="4"\n                columnsL="1"\n                columnsM="1"\n                title="Call Method"\n                minWidth="1024"\n                maxContainerCols="2">\n\n              <VBox>\n                  <HBox>\n                      <Label text="Method:" design="Bold" class="sapUiSmallMarginTop"/>\n                      <RadioButtonGroup select="onMethodSelected" columns="5">\n                        <buttons>\n                          <RadioButton id="getSemanticObjectLinks" text="getSemanticObjectLinks" />\n                          <RadioButton id="getLinks" text="getLinks"/>\n                        </buttons>\n                      </RadioButtonGroup>\n                  </HBox>\n                  <Label text="Call arguments:" design="Bold" class="sapUiSmallMarginTop sapUiSmallMarginBottom"/>\n\n                  <HBox>\n                      <Label textAlign="Right" width="100px" text="semanticObject" class="sapUiSmallMarginEnd sapUiSmallMarginTop"/>\n                      <Input id="f2" type="Text" value="{mdlInput>/SO}" placeholder="Semantic Object" liveChange="handleTextLiveChange" />\n                  </HBox>\n                  <HBox visible="{= ${v1>/callMethod} === \'getLinks\' }">\n                      <Label textAlign="Right" width="100px" text="action" class="sapUiSmallMarginTop sapUiSmallMarginEnd"/>\n                      <Input id="f3" value="{mdlInput>/action}" type="Text" liveChange="handleTextLiveChange" />\n                  </HBox>\n                  <HBox>\n                      <Label textAlign="Right" width="100px" text="params" class="sapUiSmallMarginTop sapUiSmallMarginEnd"/>\n                      <VBox visible="{= !${mdlInput>/useExtendedParamSyntax} }">\n                          <Input \n                              id="f4" value="{mdlInput>/params}" type="Text" placeholder="params" tooltip="parameter string" liveChange="handleTextLiveChange" />\n                      </VBox>\n                      <VBox visible="{mdlInput>/useExtendedParamSyntax}">\n                          <code:CodeEditor \n                              editable="true"\n                              height="200px" \n                              width="500px"\n                              id="extendedParams"\n                              type="javascript"\n                              value="{mdlInput>/paramsExtended}"\n                              lineNumbers="false"\n                          ></code:CodeEditor>\n                      </VBox>\n                      <HBox visible="{= ${v1>/callMethod} === \'getLinks\'}">\n                          <Switch change="onParamSyntaxChanged" class="sapUiSmallMarginBegin" state="{mdlInput>/useExtendedParamSyntax}" />\n                          <Label text="use extended syntax" class="sapUiSmallMarginTop sapUiTinyMarginBegin"/>\n                      </HBox>\n                      <VBox visible="{= !${mdlInput>/useExtendedParamSyntax} }">\n                          <Button \n                              id="btnAddParams" text="Add parameters" press="handleBtnAddParamsPress" class="sapUiSmallMarginBeginEnd"/>\n                      </VBox>\n                  </HBox>\n                  <HBox visible="{= ${v1>/callMethod} === \'getLinks\' }">\n                      <Label textAlign="Right" width="100px" text="sortResultsBy" class="sapUiSmallMarginTop sapUiSmallMarginEnd"/>\n                      <ComboBox value="intent" change="onSortResultsByChanged">\n                          <core:Item key="default" text="intent" />\n                          <core:Item text="text" />\n                          <core:Item text="priority" />\n                      </ComboBox>\n                  </HBox>\n                  <HBox visible="{= ${v1>/callMethod} === \'getLinks\' }">\n                      <Switch state="{mdlInput>/treatTechHintAsFilter}" />\n                      <Label class="sapUiTinyMarginBegin sapUiSmallMarginTop" text="treatTechHintAsFilter"/>\n                  </HBox>\n                  <HBox visible="{= ${v1>/callMethod} === \'getLinks\' }">\n                      <Switch state="{mdlInput>/withAtLeastOneUsedParam}" />\n                      <Label class="sapUiTinyMarginBegin sapUiSmallMarginTop" text="withAtLeastOneUsedParam" />\n                  </HBox>\n                  <HBox>\n                      <Switch state="{mdlInput>/ignoreFormFactor}" />\n                      <Label class="sapUiTinyMarginBegin sapUiSmallMarginTop" text="ignoreFormFactor" />\n                  </HBox>\n                  <HBox>\n                      <Switch state="{mdlInput>/compactIntents}" />\n                      <Label class="sapUiTinyMarginBegin sapUiSmallMarginTop" text="compactIntents" />\n                  </HBox>\n\n                  <Button id="btnGSOLinks" text="Call {v1>/callMethod}" press="handleBtnGSOPress" class="testToView2Btn"/>\n              </VBox>\n\t\t\t</form:SimpleForm>\n            <Panel expandable="true" expanded="false" headerText="Status">\n                <FlexBox direction="Column" alignItems="Start">\n                  <items>\n                    <HBox>\n                        <Label text="isIntentSupported?" class="sapUiTinyMarginEnd"/>\n                        <core:Icon src="sap-icon://status-error" color="{v1>/supportedColor}" />\n                        <Text text="{v1>/supported}"/>\n                    </HBox>\n                    <HBox>\n                        <Label text="isNavigationSupported?" class="sapUiTinyMarginEnd"/>\n                        <core:Icon src="sap-icon://status-error" color="{v1>/navSupportedColor}" />\n                        <Text text="{v1>/navSupported}"/>\n                    </HBox>\n                    <HBox>\n                        <Label text="Hash length:" class="sapUiTinyMarginEnd"/>\n                        <Text text="{v1>/hashFragmentLength} characters" />\n                    </HBox>\n                    <HBox>\n                        <Label text="Hash:" class="sapUiSmallMarginEnd"/>\n                        <Text text="{v1>/hashFragment}" />\n                    </HBox>\n                    <HBox>\n                        <Label text="Method Call Count:" class="sapUiSmallMarginEnd"/>\n                        <Text text="{v1>/callCount}" />\n                    </HBox>\n                    <VBox>\n                        <Label text="Method Call:" />\n                        <code:CodeEditor \n                            editable="false"\n                            height="300px" \n                            width="800px"\n                            id="callInfo"\n                            type="javascript"\n                            value="sap.ushell.Container.getService(\'CrossApplicationNavigation\').{v1>/callMethod}({v1>/callArgs});"\n                            lineNumbers="false"\n                        ></code:CodeEditor>\n                    </VBox>\n                  </items>\n                </FlexBox>\n            </Panel>\n            <Panel expandable="true" expanded="true"\n                   class="sapUiNoMargin sapUiNoPadding"\n\t\t        headerText="Results from call #{v1>/callCount} of {v1>/callMethod} ({= ${v1>/links}.length })">\n\n               <List id="categoryList"\n                   class="sapUiNoMargin"\n                   mode="SingleSelectMaster"\n                   items="{v1>/links}">\n                   <items>\n                       <InputListItem>\n                           <FlexBox alignItems="Center" justifyContent="SpaceBetween">\n                               <items>\n                                   <Text maxLines="2" width="250px" text="{v1>name}" />\n                                   <Link textAlign="Begin" text="{v1>link}" width="500px" href="{v1>escapedLink}" />\n                                   <Button icon="sap-icon://zoom-in" customData:linkText="{v1>link}" press="handleBtnExpandPress"/>\n                               </items>\n                           </FlexBox>\n                       </InputListItem>\n                   </items>\n                </List>\n            </Panel>\n\t\t</content>\n\t</Page>\n</core:View>\n',
	"sap/ushell/demo/AppNavSample/view/View4Popover.fragment.xml":'<core:FragmentDefinition xmlns="sap.m" xmlns:core="sap.ui.core">\n  <Popover bounce="true" title="Link Text" class="sapUiContentPadding" placement="Left">\n    <TextArea value="{/linkText}" rows="10" cols="80"/>\n  </Popover>\n</core:FragmentDefinition>\n'
},"sap/ushell/demo/AppNavSample/Component-preload"
);
