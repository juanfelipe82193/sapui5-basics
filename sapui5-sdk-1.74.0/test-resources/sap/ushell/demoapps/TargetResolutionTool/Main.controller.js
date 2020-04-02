sap.ui.define([
    "jquery.sap.global",
    "sap/m/MessageToast",
    "sap/ui/core/mvc/Controller"

], function (jQuery, oMessageToast, oController) {
    "use strict";

    var S_DEFAULT_VIEW_NAME = "Detail",
        O_ALLOWED_VIEW_NAMES = {
            "IntentResolution": true,
            "ShowInbound": true,
            "ShowResolvedTarget": true,
            "Detail": true,
            "Settings": true,
            "InboundsBrowser": true,
            "GetEasyAccessSystems": true
        };

    return oController.extend("sap.ushell.demo.TargetResolutionTool.Main", {
        oInnerAppRouter : null,
        oApp : null, // the SplitApp Control instance of this view

        getMyComponent : function () {
            var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
            var myComponent = sap.ui.component(sComponentId);
            return myComponent;
        },

        /*
         * Callback for hash changes, this is registered with the navigation framework
         *
         * our route has one argument, which is passed as the first argument
         *
         *  (for the _home route, sViewName is undefined)
         */
        _handleNavEvent : function (oEvent) {
            var sRouteName = oEvent.getParameter("name"),
                sStartupParameterView,
                sView;

            if (sRouteName === "toaView") {
                this.doNavigate("toView", oEvent.getParameter("arguments").viewName);
            }

            if (sRouteName === "_home") {
                // we have an unrecognizable route,
                // use the startup parameterif we have a viewname prameter
                sStartupParameterView = this.getMyComponent().getComponentData().startupParameters &&
                   this.getMyComponent().getComponentData().startupParameters.View &&
                   this.getMyComponent().getComponentData().startupParameters.View[0];

                if (O_ALLOWED_VIEW_NAMES[sStartupParameterView]) {
                    sView = O_ALLOWED_VIEW_NAMES[sStartupParameterView];
                }

                if (sStartupParameterView && !sView) {
                    jQuery.sap.log.error("Unknown startup parameter value for View, legal values are "
                        + Object.keys(O_ALLOWED_VIEW_NAMES).join(", "));

                    return;
                }

                this.doNavigate("toView", sView || S_DEFAULT_VIEW_NAME);
            }
        },


        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf Main
         */
        onInit: function () {
            // var that = this;
            this.mViewNamesToViews = {};
            this.oApp = this.byId("app");

            this.oViewDataModel = new sap.ui.model.json.JSONModel({});

            var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
            this.oComponent = sap.ui.component(sComponentId);

            var oSideView = sap.ui.view({
                type: sap.ui.core.mvc.ViewType.XML,
                viewName: "sap.ushell.demo.TargetResolutionTool.view.Side",
                id: this.createId("List")
            });
            oSideView.getController().oApplication = this;

            this.oApp.addMasterPage(oSideView);

            var oDetailView =  sap.ui.view({
                type: sap.ui.core.mvc.ViewType.XML,
                viewName: "sap.ushell.demo.TargetResolutionTool.view." + S_DEFAULT_VIEW_NAME
            });

            this.mViewNamesToViews.Detail = oDetailView;

            oDetailView.getController().oApplication = this;
            this.oApp.addDetailPage(oDetailView);

            this.oApp.setInitialDetail(oDetailView); // use the object, not the (generated) id!

            /* obtain the (Controller) Navigator instance */
            this.oInnerAppRouter = this.getMyComponent().getInnerAppRouter();

            this.oInnerAppRouter.attachRouteMatched(this._handleNavEvent, this);

            //// // *XNav* (1) obtain cross app navigation interface
            //// var fgetService =  sap.ushell && sap.ushell.Container && sap.ushell.Container.getService;
            //// this.oCrossAppNavigator = fgetService && fgetService("CrossApplicationNavigation");

            //// // we also have to call the shell's CrossAppNavigation service for creating correct links for inner-app navigation
            //// // because the shell part of the hash has to be set
            //// var toView1 = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForAppSpecificHash("View1/")) || "";
            //// var toView2 = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForAppSpecificHash("View2/")) || "";
            //// var toView3 = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForAppSpecificHash("View3/")) || "";

            //// var toSU01html_href = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ target: { semanticObject : "Action", action: "tosu01html"}})) || "";
            //// var toSU01_href = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ target: { semanticObject : "Action", action: "tosu01"}})) || "";
            //// var towdapp_href = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ target: { semanticObject : "Action", action: "towdapp" }})) || "";

            //// var oRenameParams = { "P1" : ["P1Value"],
            ////                       "P2" : ["P2Value"]};
            //// // TODO sap-xapp-state
            //// var WDANavTarget_display = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ target: { semanticObject : "WDANavTarget", action: "display"}, params: oRenameParams})) || "";
            //// var WDANavTarget_display_X = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ target: { semanticObject : "WDANavTarget", action: "display"}, params: oRenameParams})) || "";
            //// var WDANavSource_display = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ target: { semanticObject : "WDANavSource", action: "display"}, params: oRenameParams})) || "";
            //// var Action_parameterRename1 = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ target: { semanticObject : "Action", action: "parameterRename"}, params: oRenameParams})) || "";
            //// oRenameParams.Case = ["2"];
            //// var Action_parameterRename2 = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ target: { semanticObject : "Action", action: "parameterRename"}, params: oRenameParams})) || "";
            //// oRenameParams.Case = ["3"];
            //// var Action_parameterRename3 = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ target: { semanticObject : "Action", action: "parameterRename"}, params: oRenameParams})) || "";
            //// oRenameParams.Case = ["4"];
            //// var Action_parameterRename4 = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ target: { semanticObject : "Action", action: "parameterRename"}, params: oRenameParams})) || "";
            //// oRenameParams.Case = ["5"];
            //// var Action_parameterRename5 = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ target: { semanticObject : "Action", action: "parameterRename"}, params: oRenameParams})) || "";
            //// var thelongstring = "";
            //// var i = 0;
            //// for (i = 0; i < 4; i = i + 1) { //4000
            ////     thelongstring = thelongstring + "xx" + i;
            //// }
            //// // *XNav (2) generate cross application link
            //// var toDefaultApp = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({ target: { semanticObject : "Action", action: "todefaultapp" }})) || "";
            //// // an "external navigation" to the same app, as it has a different startup parameter
            //// // (date), it will be reloaded!
            //// var toOurApp = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({
            ////     target: { semanticObject : "Action", action: "toappnavsample" },
            ////     params : { zval : thelongstring, date : new Date().toString()}
            //// }, this.oComponent)) || "";

            //// var sShellHash =  "#Action~toappnavsample&date=" + encodeURIComponent(new Date().toString());

            //// var toOurApp2 = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({
            ////     target: { "shellHash" : sShellHash }
            //// }, this.oComponent)) || "";
            //// var toOurApp3 = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({
            ////     target: { semanticObject : "Action", action: "toappnavsample" },
            ////     params : { "/ui2/par" : "/VAL=VAL3/", "/ui=aaa/" : "yyy", date : new Date().toString()}
            //// })) || "";
            //// var toOurApp3b = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({
            ////     target: { semanticObject : "Action", action: "toappnavsampleParam" },
            ////     params : { "/ui2/par" : "/VAL=VAL3/",  "/ui2/zpar" : "XXX", date : new Date().toString()}
            //// }, this.oComponent)) || "";

            //// var toOurApp4 = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({
            ////     target: { semanticObject : "Action", action: "toappnavsample" },
            ////     params : { "View" : "View1", date : new Date().toString()}
            //// }, this.oComponent)) || "";


            //// var toHome = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({
            ////     target: { shellHash : "#" }}, this.oComponent)) || "";
            //// var toShellHome = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({
            ////     target: { shellHash : "#Shell-home" }}, this.oComponent)) || "";
            //// var lParams = { "a" : "aval", "esc" : "A B&C=D", "zz" : "XXX", date : Number(new Date())};
            //// var s = "A123456789B123456789C123456789D123456789E12345689" +
            ////         "F123456789G123456789H123456789I123456789J12345689";
            //// for (i = 0; i  < 50; i = i + 1) {
            ////     var su = "value" + i + ":"  + s;
            ////     lParams["zp" + (i < 10 ? "0" : "") +  i] = su;
            //// }
            //// var toOurApp_longurl = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({
            ////     target: { semanticObject : "Action", action: "toappnavsample" },
            ////     params : lParams
            //// }, this.oComponent)) || "";

            //// var toNonExistentApp = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({
            ////     target: { semanticObject : "Action", action: "notconfigured" },
            ////     params : { "a" : "/VAL=VAL3/",  "b" : "XXX", date : new Date().toString()}
            //// }, this.oComponent)) || "";

            //// var toOurAppCrashing = (this.oCrossAppNavigator && this.oCrossAppNavigator.hrefForExternal({
            ////     target: { semanticObject : "Action", action: "toappnavsample" },
            ////     params : { "CRASHME" : "/VAL=VAL3/",  "/ui2/zpar" : "XXX", date : new Date().toString()}
            //// }, this.oComponent)) || "";

            //// var anIsUrlSupportedUrl1 = this.oCrossAppNavigator.hrefForExternal({
            ////     target: { semanticObject : "Action", action: "toappnavsample" },
            ////     params : { date : new Date().toString()}
            //// }, this.oComponent);

            //// var anIsUrlSupportedUrl2 = this.oCrossAppNavigator.hrefForExternal({
            ////     target: { semanticObject : "Action", action: "notexisting" },
            ////     params : { date : new Date().toString()}
            //// }, this.oComponent);

            //// var anIsUrlSupportedUrl3 = "http://www.sap.com";

            //// var mdl = new sap.ui.model.json.JSONModel(
            ////         {
            ////             toView2_href : toView2,
            ////             toView1_href : toView1,
            ////             toView3_href : toView3,
            ////             WDANavTarget_display_X : WDANavTarget_display_X,
            ////             WDANavTarget_display : WDANavTarget_display,
            ////             WDANavSource_display : WDANavSource_display,
            ////             Action_parameterRename1 : Action_parameterRename1,
            ////             Action_parameterRename2 : Action_parameterRename2,
            ////             Action_parameterRename3 : Action_parameterRename3,
            ////             Action_parameterRename4 : Action_parameterRename4,
            ////             Action_parameterRename5 : Action_parameterRename5,
            ////             DefaultApp_display_href :  toDefaultApp, // "#DefaultApp-display"
            ////             AppNavSample_display_args_href : toOurApp,
            ////             AppNavSample_display_args_href2 : toOurApp2,
            ////             AppNavSample_urlparamescaping_href : toOurApp3,
            ////             AppNavSample_urlparamescaping2_href : toOurApp3b,
            ////             AppNavSample_urlWrongEscaping : "tobeoverwritten",
            ////             AppNavSample_urlCorrectEscaping : "tobeoverwritten",
            ////             AppNavSample_toourupWithView1AsStartup : toOurApp4,
            ////             AppNavSample_longurl : toOurApp_longurl,
            ////             toWdaIntentNavigationTest : "aaa",
            ////             toWDANavTarget_display : "ccc",
            ////             toWDANavTarget_displayCompressed : "ddd",
            ////             toHome : toHome,
            ////             toShellHome : toShellHome,
            ////             toNonExistentApp : toNonExistentApp,
            ////             AppNavSample_crashing : toOurAppCrashing,
            ////             toSU01html_href : toSU01html_href,
            ////             toSU01_href : toSU01_href,
            ////             towdapp_href : towdapp_href,
            ////             anIsUrlSupportedUrl1 : anIsUrlSupportedUrl1,
            ////             anIsUrlSupportedUrl1Enabled : true,
            ////             anIsUrlSupportedUrl2 : anIsUrlSupportedUrl2,
            ////             anIsUrlSupportedUrl2Enabled : true,
            ////             anIsUrlSupportedUrl3 : anIsUrlSupportedUrl3,
            ////             anIsUrlSupportedUrl3Enabled : true,
            ////             anIsUrlSupportedUrl4 : "#justanhash",
            ////             anIsUrlSupportedUrl4Enabled : true
            ////        }
            ////     );
            //// ["anIsUrlSupportedUrl1",
            ////  "anIsUrlSupportedUrl2",
            ////  "anIsUrlSupportedUrl3",
            ////  "anIsUrlSupportedUrl4"].forEach(function (sName) {
            ////     var sUrl = mdl.getProperty("/" +sName);
            ////     that.oCrossAppNavigator.isUrlSupported(sUrl).fail(function() {
            ////         mdl.setProperty("/" + sName + "Enabled", false);
            ////     });
            //// });

            //// this.oCrossAppNavigator.getSemanticObjectLinks("Action", { "A" : 1, "B" :  "x",
            ////     "C" : "ccc"
            ////         }).done(function(oResult) {
            ////         if ( oResult.length > 0) {
            ////             mdl.setProperty("/AppNavSample_urlWrongEscaping", oResult[0].intent);
            ////             mdl.setProperty("/AppNavSample_urlCorrectEscaping", that.oCrossAppNavigator.hrefForExternal({ target : { shellHash : oResult[0].intent}}, that.oComponent));
            ////         }
            //// });

            //// this.oCrossAppNavigator.getSemanticObjectLinks("Action", lParams, undefined, this.oComponent).done(function (aLinks) {
            ////     aLinks.forEach(function (aLink) {
            ////         jQuery.sap.log.warning("Result ShellHash (=internal) link     :" + aLink.intent);
            ////         jQuery.sap.log.warning("What to put in the link tag (external):" + that.oCrossAppNavigator.hrefForExternal({ target : { shellHash : aLink.intent}}, that.oComponent));
            ////         that.oCrossAppNavigator.expandCompactHash(aLink.intent).done( function (sExpandedHash) {
            ////             var oShellHash;
            ////             jQuery.sap.log.warning("Resolved expanded intent :" + sExpandedHash);
            ////             oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash(sExpandedHash);
            ////             oShellHash.params = oShellHash.params || {};
            ////             oShellHash.params.addedPar = [ "1234" ];
            ////             jQuery.sap.log.warning("recoded:" + that.oCrossAppNavigator.hrefForExternal({
            ////                 target : { semanticObject : oShellHash.semanticObject,
            ////                         action: oShellHash.action,
            ////                         contextRaw : oShellHash.contextRaw
            ////                 },
            ////                 params : oShellHash.params,
            ////                 appSpecificHash : oShellHash.appSpecificHash
            ////             }, that.oComponent));
            ////         });
            ////     });
            //// });

            //// var as = this.oCrossAppNavigator.createEmptyAppState(that.oComponent);
            //// as.setData({
            ////     selectionVariant: {
            ////         Parameters : [{ "PropertyName" : "PARAM1", "PropertyValue" : "XZY" }],
            ////         SelectOptions : [{ "PropertyName" : "UshellTest1",
            ////                            "Ranges" : [{ "Sign" : "I", "Option": "E", "value" : "x"}]
            ////                         }]
            ////     }
            //// });
            //// function genStr(sStr, iCnt) {
            ////     var s = sStr;
            ////     while (s.length < iCnt) {
            ////         s = s + sStr;
            ////     }
            ////     return s;
            //// }
            //// as.save().done(function(){
            ////     var sUrl;
            ////     var asKey = as.getKey();
            ////     sUrl = that.oCrossAppNavigator.hrefForExternal({
            ////             target: { semanticObject: "Action",
            ////                 "action" : "toWdaIntentNavigationTest"
            ////             },
            ////             params : {
            ////                 "sap-xapp-state" : [asKey],
            ////                 "P1" : ["PV1"]
            ////             }}, that.oComponent);
            ////     mdl.setProperty("/toWdaIntentNavigationTest", sUrl);
            ////     sUrl = that.oCrossAppNavigator.hrefForExternal({
            ////         target: { semanticObject: "WDANavTarget",
            ////             "action" : "display"
            ////         },
            ////         params : {
            ////             "sap-xapp-state" : [asKey],
            ////             "P1" : ["PV1"]
            ////         }}, that.oComponent);
            ////     mdl.setProperty("/toWDANavTarget_display", sUrl);
            ////     sUrl = that.oCrossAppNavigator.hrefForExternal({
            ////         target: { semanticObject: "WDANavTarget",
            ////             "action" : "display"
            ////         },
            ////         params : {
            ////             "sap-xapp-state" : [asKey],
            ////             "P2" : [genStr("ABAB",2024) ],
            ////             "P1" : ["PV1"]
            ////         }}, that.oCOmponent);
            ////     mdl.setProperty("/toWDANavTarget_displayCompressed", sUrl);
            //// });
            //// this.oCrossAppNavigator.getSemanticObjectLinks("Action", lParams, undefined, this.oComponent).done(function (aLinks) {
            ////     aLinks.forEach(function (aLink) {
            ////         jQuery.sap.log.warning("Result ShellHash (=internal) link     :" + aLink.intent);
            ////         jQuery.sap.log.warning("What to put in the link tag (external):" + that.oCrossAppNavigator.hrefForExternal({ target : { shellHash : aLink.intent}}, that.oComponent));
            ////         that.oCrossAppNavigator.expandCompactHash(aLink.intent).done( function (sExpandedHash) {
            ////             var oShellHash;
            ////             jQuery.sap.log.warning("Resolved expanded intent :" + sExpandedHash);
            ////             oShellHash = sap.ushell.Container.getService("URLParsing").parseShellHash(sExpandedHash);
            ////             oShellHash.params = oShellHash.params || {};
            ////             oShellHash.params.addedPar = [ "1234" ];
            ////             jQuery.sap.log.warning("recoded:" + that.oCrossAppNavigator.hrefForExternal({
            ////                 target : { semanticObject : oShellHash.semanticObject,
            ////                         action: oShellHash.action,
            ////                         contextRaw : oShellHash.contextRaw
            ////                 },
            ////                 params : oShellHash.params,
            ////                 appSpecificHash : oShellHash.appSpecificHash
            ////             }, that.oComponent));
            ////         });
            ////     });
            //// });

            //// if (toOurApp2 === sShellHash) {
            ////     jQuery.sap.log.error("Beware of the encoding changes");
            //// }

            //// /*
            ////  * elements of this model are bound to href tags in views :
            ////  * e.g. (Detail.view.xml) :
            ////  * <Link href="{/DefaultApp_display_href}" text="cross app link (Default App)" tooltip="Back to Fiori Sandbox Default Application (note href is generated!)"></Link>
            ////  */

            //// this.getView().setModel(mdl);

        },

        // construct and register a view if not yet present
        makeViewUilib : function (sViewname) {
            var that = this;

            if (this.mViewNamesToViews[sViewname]) {
                return this.mViewNamesToViews[sViewname];
            }

            //construct
            jQuery.sap.log.info("sap.ushell.demo.AppNavSample: Creating view + " + sViewname + "... ");

            // run with owner to pass component!
            var oView = null;
            this.getMyComponent().runAsOwner(function () {
                /* create View */
                oView =  sap.ui.view({ type: sap.ui.core.mvc.ViewType.XML,
                    viewName: "sap.ushell.demo.TargetResolutionTool.view." + sViewname,
                    viewData: that.oViewDataModel
                });
            }, this.oComponent);

            jQuery.sap.log.info("sap.ushell.demo.AppNavSample:  Creating view + " + sViewname + " assigned id : " + oView.getId());
            this.mViewNamesToViews[sViewname] = oView;
            return oView;
        },

        navigate : function (sEvent, sNavTarget, oViewData) {
            this.oViewDataModel.setData(oViewData || {});

            if (sEvent === "toHome") {
                // use external navigation to navigate to homepage
                if (this.oCrossAppNavigator) {
                    this.oCrossAppNavigator.toExternal({ target : { shellHash : "#" }});
                }
                return;
            }
            if (sEvent === "toView") {
                var sView = sNavTarget; // navtarget;
                if (sView === "" || !this.isLegalViewName(sView)) {
                    var vw = this.mViewNamesToViews.Detail;
                    this.oApp.toDetail(vw);
                    return;
                }
                /* *Nav* (7) Trigger inner app navigation */
                this.oInnerAppRouter.navTo("toaView", { viewName : sView}, true);
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

        isLegalViewName : function (sViewNameUnderTest) {
            return !!O_ALLOWED_VIEW_NAMES[sViewNameUnderTest];
        },

        doNavigate : function (sEvent, sNavTarget) {
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
                if (!oView.getControllerName()) {
                    oMessageToast.show("Target view has no controller associated");
                    return;
                }
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
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberOf Main
         */
        onExit: function () {
            this.mViewNamesToViews = {};
            if (this.oInnerAppRouter) {
                this.oInnerAppRouter.destroy();
            }
        }

    });
});
