sap.ui.controller("sap.ushell.demo.AppNavSample.view.View1", {
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