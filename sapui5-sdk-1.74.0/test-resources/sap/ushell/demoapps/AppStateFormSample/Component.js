// define a root UIComponent which exposes the main view
/*global sap, jQuery, window, JSONModel*/
jQuery.sap.declare("sap.ushell.demo.AppStateFormSample.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.AppStateFormSample.Component", {

    metadata : {
        "manifest": "json"
    },
//    metadatax : {
//
//        "library": "sap.ushell.demo.AppStateFormSample",
//
//        "version" : "1.74.0",
//
//        "includes" : [
//
//        ],
//
//        "dependencies" : {
//            "libs" : [
//                "sap.m"
//            ],
//            "components" : [
//            ]
//        },
//
//        "config" : {
//            "title": "Application state with Forms and Undo Example",
//            //"resourceBundle" : "i18n/i18n.properties",
//            //"titleResource" : "shellTitle",
//            "icon" : "sap-icon://Fiori2/F0002",
//            // In real Fiori apps, don't use absolute paths, but reference your icons/images
//            // as shown in sap.ca's scfld.md.sample app.
//            "favIcon" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/favicon/F0002_My_Accounts.ico",
//            "homeScreenIconPhone" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/57_iPhone_Desktop_Launch.png",
//            "homeScreenIconPhone@2" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/114_iPhone-Retina_Web_Clip.png",
//            "homeScreenIconTablet" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/72_iPad_Desktop_Launch.png",
//            "homeScreenIconTablet@2" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/144_iPad_Retina_Web_Clip.png",
//            "startupImage320x460" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/320_x_460.png",
//            "startupImage640x920" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/640_x_920.png",
//            "startupImage640x1096" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/640_x_1096.png",
//            "startupImage768x1004" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/768_x_1004.png",
//            "startupImage748x1024" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/1024_x_748.png",
//            "startupImage1536x2008" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/1536_x_2008.png",
//            "startupImage1496x2048" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/2048_x_1496.png"
//        },
//
//        routing: {
//            config: {
//                viewType : "XML",
//                viewPath: "",  // leave empty, common prefix
//                targetControl: "app",
//                targetAggregation: "detailPages",
//                clearTarget: false,
//                callback: function (oRoute, oArguments, oConfig, oControl, oView) {
//                    "use strict";
//                    return;
//                    // AppState (1.1) Route handling extracts inner app state
//                    // Note: if further arguments are used, all arguments would have to be passed here
//                    // to able to reconstruct the same route with a different iAppStateKey
//                    oView.oController.getMyComponent().setInnerAppState(oArguments.iAppState, oConfig.name);
//                    if (typeof oView.oController.setTab === "function") {
//                        oView.oController.setTab(oConfig.name);
//                    }
//                    oControl.toDetail(oView.getId());
//                }
//            },
//            // AppState (1.2) All Routes are amended with an inner app state parameter (!)
//            routes: [
//                {
//                    pattern : "editForm/sap-iapp-state={iAppState}", // will be the url and from has to be provided in the data
//                    view : "sap.ushell.demo.AppStateFormSample.view.EditForm",
//                    name : "editForm" // name used for listening or navigating to this route
//                },
//                {
//                    pattern : "displayForm/sap-iapp-state={iAppState}", // will be the url and from has to be provided in the data
//                    view : "sap.ushell.demo.AppStateFormSample.view.EditForm",
//                    name : "displayForm" // name used for listening or navigating to this route
//                },
//                {
//                    pattern : "EditIconFavorite/sap-iapp-state={iAppState}", // will be the url and from has to be provided in the data
//                    view : "sap.ushell.demo.AppStateFormSample.view.EditIconForm",
//                    name : "editIconFavorite" // name used for listening or navigating to this route
//                },
//                {
//                    pattern : "DisplayIcon/sap-iapp-state={iAppState}", // will be the url and from has to be provided in the data
//                    view : "sap.ushell.demo.AppStateFormSample.view.EditIconForm",
//                    name : "displayIcon" // name used for listening or navigating to this route
//                },
//                {
//                    pattern : "favorites/sap-iapp-state={iAppState}", // will be the url and from has to be provided in the data
//                    view : "sap.ushell.demo.AppStateFormSample.view.Tabs",
//                    name : "favorites" // name used for listening or navigating to this route
//                },
//                {
//                    pattern : "allicons/sap-iapp-state={iAppState}", // will be the url and from has to be provided in the data
//                    view : "sap.ushell.demo.AppStateFormSample.view.Tabs",
//                    name : "allicons" // name used for listening or navigating to this route
//                },
//                {
//                    pattern : "info/sap-iapp-state={iAppState}", // will be the url and from has to be provided in the data
//                    view : "sap.ushell.demo.AppStateFormSample.view.Tabs",
//                    name : "info" // name used for listening or navigating to this route
//                },
//                {
//                    pattern : ":all*:", // catchall
//                    view : "sap.ushell.demo.AppStateFormSample.view.EditForm",
//                    name : "catchall" // name used for listening or navigating to this route
//                }
//            ]
//        }
//    },

    getAutoPrefixId : function () {
        "use strict";
        return true;
    },

    createContent : function () {
        "use strict";
        // we initialize a JSON Model for the application state and set it as a
        // named model (resolvable for all child views);
        var oMainView = sap.ui.view({
            type : sap.ui.core.mvc.ViewType.XML,
            viewName : "sap.ushell.demo.AppStateFormSample.Main"
        });
        this.oMainView = oMainView;
        return oMainView;
    },

    // extract an inner Appstate key from a present route
    setInnerAppState : function (sInnerAppStateKey, sCurrentRouteName) {
        "use strict";
        var that = this;
        this.sCurrentRouteName = sCurrentRouteName;
        // if the key is distinct from our (new instantiation key), it must be an old
        // "old" (= initial) key passed to us
        if (sInnerAppStateKey === this.getInnerAppStateKey()) {
            this.oInnerAppStateKeyProcessed.resolve(sCurrentRouteName);
            return;
        }
        // we must apply the inner app state *after* treating a startup xAppState
        this.oAppStateModelInitializationPromise.done(function () {
            sap.ushell.Container.getService("CrossApplicationNavigation").getAppState(that, sInnerAppStateKey).done(function (oStartupInnerAppState) {
                that.updateModelFromAppState(oStartupInnerAppState, "Setting filter value from InnerAppState");
                that.oInnerAppStateKeyProcessed.resolve(sCurrentRouteName);
            });
        });
        //on every initial start, we have to set the innerAppState key to our new key!
    },



    getInnerAppStateKey : function () {
        "use strict";
        return (this.oAppStateContainer && this.oAppStateContainer.getKey()) || " key not set yet ";
    },

    /**
     * Move application state data into the model
     * This is called on startup of the application
     * for an sap-xapp-state passed data and sap-iapp-state passed data
     */
    updateModelFromAppState : function (oAppState, sComment) {
        "use strict";
        var that = this,
            data = oAppState.getData();
        if (data) {
            this.inEvent = true;
            jQuery.sap.log.error(sComment);
            that.oAppStateModel.setProperty("/appState", data || "");
            this.getEventBus().publish("sap.ushell.demoapps", "restoreUIState", {});
            this.inEvent = false;
        }
    },

    /**
     * Update the application state container with the current application data
     * this is called on any model change
     */
    updateAppStateFromModelInitial : function () {
        "use strict";
        this.oAppStateContainer.setData(this.oAppStateModel.getProperty("/appState"));
    },

    updateAppStateFromModel : function () {
        "use strict";
        var aUndoStack,
            significant,
            oData;
        if (this.inEvent) {
            return;
        }


        this.inEvent = true;

        // push a history state
        // get the ui state!
        this.getEventBus().publish("sap.ushell.demoapps", "serializeUIState", {});

        // do we have a significant change? 
        oData = this.oAppStateModel.getProperty("/appState");
        aUndoStack = this.oAppStateModel.getProperty("/appState/uiState/editForm/undoStack");
        if (JSON.stringify(this.oLastEditFormUndoRelevantData) === JSON.stringify(oData.chatList)) {
            // no relevant change 
            this.inEvent = false; 
            return;
        }
        // create a new container!
        this.oAppStateContainer = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(this);
        aUndoStack = this.oAppStateModel.getProperty("/appState/undoStack") || [];
        aUndoStack.push(this.oAppStateContainer.getKey());
        jQuery.sap.log.error("pushing undo stack");
        this.oAppStateModel.setProperty("/appState/uiState/editForm/undoStack", aUndoStack);
        this.oAppStateModel.setProperty("/appState/uiState/editForm/undoStackPresent", true);
        this.oLastEditFormUndoRelevantData = (oData.chatList === undefined) ? undefined : JSON.parse(JSON.stringify(oData.chatList));
        this.oAppStateContainer.setData(oData);
        this.oAppStateContainer.save();
        this.calculateCrossAppLinks();
        this.inEvent = false;
        this.updateHashInURL();
    },

    updateHashInURL : function () {
        "use strict";
        this.navTo(this.sCurrentRouteName);
    },

    init : function () {
        "use strict";
        var that = this,
            sHref,
            oCrossApplicationNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");

        // Model creation
        // we create and register models prior to the createContent method invocation
        // note that actual population with model data is performed later
        this.oAppStateModel = new sap.ui.model.json.JSONModel({
            appState : {
                filter : "",
                editEnabled : false,
                undoStack : [],
                focusInfo1 : { },
                focusInfo2 : { },
                chatList : [ { text : "What do we do?"},
                         { text : "Save the state before it's to late!"},
                         { text : "When do we save?"},
                         { text : "Always, always, on every state change!"},
                         { text : ""},
                         { text : "If it's worth asking the user, it's worth remembering."},
                         { text : "  Alan Cooper"},
                         ],
                uiState : {
                    editForm : {
                        undoStack : [],
                        undoStackPresent : true,
                        chatList  : {
                            focusInfos : [],
                            focusInfo : null,
                        },
                        focusIndex : 1,
                        focusInfo : {},
                    }
                },
                editRecord : { Key : "AKEY", "CollectionName" : "Fury1", id : "ABC", name: "a name", description : "a description", semanticName : "a semantic name"},
                editForm : { T01: "SAP UI5 is the new UI technology for SAP",
                             T02: "Fiori is T222 222"
                           }
            },
            other : { editButtonText : "Edit Icon" },
            pers : {
                myicons : [
                    { Key : "ABC", "CollectionName" : "XXX", name : "aaaa", description : "jjjj"},
                    { Key : "HIJ", "CollectionName" : "XXX", name : "sss", description : "xxxxs"}
                ]
            }
        });
        this.setModel(this.oAppStateModel, "AppState");

        // create a model containing the generated links for cross application navigation in our model
        // we use the Application state key to pass information to the called applications
        // the actual links of the model are filled below, using the application state key
        this.oNavTargetsModel = new sap.ui.model.json.JSONModel({ toOurAppWithState : "", toOurAppNoState : "" });
        this.setModel(this.oNavTargetsModel, "navTargets");

        sap.ui.core.UIComponent.prototype.init.apply(this, arguments); // invokes createContent of Component
        // and thus creation of the child tree

        // two promises to manage the lifecycle and race conditions
        this.oAppStateModelInitializationPromise = new jQuery.Deferred();
        this.oInnerAppStateKeyProcessed = new jQuery.Deferred();
        //
        // execution order
        //
        // oAppStateModelInitializationPromise  : Done when startup appstate has been transferred into the model
        // oInnerAppStateKeyProcessed : Done when above and innerAppStateKey processed
        //

        // create a new Application state (this.oAppStateContainer) for this Application instance
        this.oAppStateContainer = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(this);
        // now that we know the key, we can calculate the CrossApplication links
        this.calculateCrossAppLinks();

        sap.ushell.Container.getService("CrossApplicationNavigation").getStartupAppState(this).done(function (oStartupAppStateContainer) {
            var fFilter = oStartupAppStateContainer.getData() && oStartupAppStateContainer.getData().filter;
            that.oAppStateModel.setProperty("/appState/filter", fFilter || ""); //TODO!
            that.oAppStateModelInitializationPromise.resolve();
        });


        // this component should automatically initialize the router!
        this.getRouter().initialize();

        this.getRouter().attachRouteMatched(function(oRoute, oArguments, oConfig, oControl, oView) {
            oArguments = oRoute.mParameters.arguments;
            oView = oRoute.mParameters.view;
            oConfig = oRoute.mParameters.config;
            oControl = oRoute.mParameters.targetControl;
            // AppState (1.1) Route handling extracts inner app state
            // Note: if further arguments are used, all arguments would have to be passed here
            // to able to reconstruct the same route with a different iAppStateKey
            oView.oController.getMyComponent().setInnerAppState(oArguments.iAppState, oConfig.name);
            if (typeof oView.oController.setTab === "function") {
                oView.oController.setTab(oConfig.name);
            }
            oControl.toDetail(oView.getId());
        });

        // register a handler to set the current InnerAppStateKey into the inner-app-hash 
        // (via a navigation to the "same/inital" route but with a different inner-app-state) 
        // This must be done
        // *after* we have processed a potential inner app state from initial invokation (thus the promise) 
        //
        this.oInnerAppStateKeyProcessed.done(function (sInitialRouteName) {
            // we have to set a current route, as there is no correct inner app state key in the url
            if (sInitialRouteName === "catchall") {
                sInitialRouteName = "editForm";
            }
            // we must assure the current state is persisted at least once, even if no data is changed
            // TODO: check whether this can be avoided by properly timing the registration of the initial model update
            // to avoid "double" initial update sometimes
        // // that.updateAppStateFromModelInitial();
            // register an event handler on the model, to track future changes
            that.oAppStateModel.bindTree("/").attachChange(function () {
                that.updateAppStateFromModel();
            });
            that.navTo(sInitialRouteName, true);
        });
        this.loadFromBackend();
    },

    loadFromBackend : function () {
        "use strict";
        var that = this;
        sap.ushell.Container.getService("Personalization").getContainer("sap.ushell.demo.AppStateForm", undefined, this).done(function (oContainer) {
            var data = oContainer.getItemValue("myicons");
            that.oPersContainer = oContainer;
            that.getModel("AppState").setProperty("/pers/myicons", data);
        });
    },

    updateBackend : function () {
        "use strict";
        var oMyIconList,
            i;
        oMyIconList = this.getModel("AppState").getProperty("/pers/myicons");
        this.oPersContainer.setItemValue("myicons", oMyIconList);
        this.oPersContainer.save();
    },

    calculateCrossAppLinks : function () {
        "use strict";
        var sHref,
            oCrossApplicationNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");
        // calculate links for cross application navigation targets
        sHref = oCrossApplicationNavigationService.hrefForExternal({
            target: {
                semanticObject : "Action",
                action : "toappstatesample"
            },
            params : { "zdate" : Number(new Date())}, // assures distinct
            appStateKey : this.oAppStateContainer.getKey() //<<< pass x-app state!
        }, this) || "";
        this.oNavTargetsModel.setProperty("/toOurAppWithState", sHref);
        // 2nd link, no app state transferred
        sHref = oCrossApplicationNavigationService.hrefForExternal({
            target: {
                semanticObject : "Action",
                action : "toappstatesample"
            },
            params : { "date" : Number(new Date()) } // assures distinct
            // appStateKey : this.oAppStateContainer.getKey() // example no state passsed
        }, this) || "";
        this.oNavTargetsModel.setProperty("/toOurAppNoState", sHref);
    },

    // note how this central navTo route takes care of setting the current inner app state key correctly
    navTo : function (sRouteName, noHistory) {
        "use strict";
        this.getRouter().navTo(sRouteName, { iAppState : this.getInnerAppStateKey()}, noHistory);
    }

});

