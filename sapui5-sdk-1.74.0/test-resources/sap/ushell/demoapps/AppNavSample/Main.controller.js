// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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
