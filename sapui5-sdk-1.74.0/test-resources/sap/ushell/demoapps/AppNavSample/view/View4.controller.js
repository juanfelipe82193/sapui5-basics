sap.ui.define(["sap/ui/core/mvc/Controller"], function (oController) {

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


