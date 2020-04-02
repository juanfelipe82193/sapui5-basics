// define a root UIComponent which exposes the main view
/*global sap, jQuery, JSONModel, setTimeout*/
(function () {
    "use strict";
    jQuery.sap.declare("sap.ushell.demo.AppStateSample.Component");
    jQuery.sap.require("sap.ui.core.UIComponent");

    sap.ui.core.UIComponent.extend("sap.ushell.demo.AppStateSample.Component", {

        metadata : {
            manifest: "json"
        },

        // To implement autoprefixing, overwrite the getAutoPrefixId() method with {return true}
        getAutoPrefixId : function () {
            return true;
        },

        createContent : function () {
            var oMainView = sap.ui.view({
                type : sap.ui.core.mvc.ViewType.XML,
                viewName : "sap.ushell.demo.AppStateSample.Main"
            });
            this.oMainView = oMainView;
            return oMainView;
        },

        /**
         * Extract an inner AppState key from a present route
         *
         * @param {string} sInnerAppStateKey
         *   The InnerAppStateKey of Application
         * @param {string} sCurrentRouteName
         *   The currently route name e.g. "toCatIcons"
         *
         * @private
         */
        extractInnerAppStateFromURL : function (sInnerAppStateKey, sCurrentRouteName) {
            var that = this;
            // if the key is distinct from our (new instantiation key), it must be an old
            // "old" (= initial) key passed to us
            if (sInnerAppStateKey === this.getInnerAppStateKey()) {
                this.oInnerAppStatePromise.resolve(sCurrentRouteName);
                return;
            }
            // we have a distinct appstate key -> generate a new model
            that.createANewAppStateModel();
            // we must apply the inner App State *after* treating CrossAppState (x-app-state)
            jQuery.sap.log.info("applying inner app state " + sInnerAppStateKey + " in instance #" + that.INSTANCECOUNTER);
            this.oCrossAppStatePromise.done(function () {
                sap.ushell.Container.getService("CrossApplicationNavigation").getAppState(that, sInnerAppStateKey).done(function (oStartupInnerAppState) {
                    that.updateModelFromAppstate(that.oAppStateModel, oStartupInnerAppState, "Setting filter value from InnerAppState");
                    that.oInnerAppStatePromise.resolve(sCurrentRouteName);
                });
            });
            that.oInnerAppStatePromise.done(function () {
                that.setInnerAppStateIntoInnerAppHash(sCurrentRouteName);
            });
        },

        getInnerAppStateKey : function () {
            return (this.oAppState && this.oAppState.getKey()) || " key not set yet ";
        },


        /**
         * Move application state data into the model.
         * This is called on startup of the application
         * for sap-xapp-state passed data and sap-iapp-state passed data.
         *
         * @param {object} oModel
         *   Model which should be used to allocate the data from oAppState
         * @param {object} oAppState
         *   AppState including the data
         * @param {string} sComment
         *   Comment for logging purposes
         * @returns {boolean}
         *   Returns true if data of the AppState has been set to the model
         *
         * @private
         */
        updateModelFromAppstate : function (oModel, oAppState, sComment) {
            var that = this,
                oData = oAppState.getData();
            if (oData && (JSON.stringify(oData) !== JSON.stringify(oModel.getProperty("/appState"))) && oModel) {
                jQuery.sap.log.info(sComment + " in instance #" + that.INSTANCECOUNTER);
                oModel.setProperty("/appState", oData);
                return true;
            }
            return false;
        },
        /**
         * Update the application state with the current application data that is called on any model change
         *
         * @private
         */
        updateAppStateFromAppStateModel : function () {
            var oData;
            oData = this.oAppStateModel.getProperty("/appState");
            this.oAppState.setData(oData);
            this.oAppState.save().fail(function () {
                jQuery.sap.log.error("saving of application state failed");
            });
        },

        /**
         * Marks the component in case of initialization issues will happen
         *
         * @private
         */
        markOurComponent : function () {
            // don't use this in producive coding, global static!
            sap.ushell.demo.AppStateSample.Component.INSTANCECOUNTER = (sap.ushell.demo.AppStateSample.Component.INSTANCECOUNTER || 0) + 1;
            this.INSTANCECOUNTER = sap.ushell.demo.AppStateSample.Component.INSTANCECOUNTER;
        },

        /**
         * Creates a new AppState and calculate links for the bottom section of List.controller.js
         *
         * @private
         */
        createANewAppStateModel : function () {
            // create a new Application state (this.oAppState) for this Application instance
            this.oAppState = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(this);
            // now that we know the key, we can calculate the CrossApplication links
            this.calculateCrossAppLinks(); //we recalculate the model as the links are updated
            jQuery.sap.log.info("Create a new appstate model " + this.oAppState.getKey() +  " in instance #" + this.INSTANCECOUNTER);
        },

        /**
         * Initialization phase of component
         *
         * @private
         */
        init : function () {
            var that = this,
                sHref,
                oCrossApplicationNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");

            jQuery.sap.log.setLevel(jQuery.sap.log.Level.INFO);
            this.markOurComponent();

            // Model creation
            // we create and register models prior to the createContent method invocation
            // note that actual population with model data is performed later
            this.oAppStateModel = new sap.ui.model.json.JSONModel({
                appState : {
                    filter : "",
                    CollectionName : (sap.ui.core.IconPool.getIconCollectionNames())[0] || "no collection name"
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

            // two promises to manage the life cycle and race conditions
            this.oCrossAppStatePromise = new jQuery.Deferred(); // Done when startup CrossAppState has been transferred into the model
            this.oInnerAppStatePromise = new jQuery.Deferred(); // Done when above and startup InnerAppState transferred into the model

            // create a new Application state (this.oAppState) for this Application instance
            this.oAppState = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(this);
            // now that we know the key, we can calculate the CrossApplication links
            this.calculateCrossAppLinks(); //because we have the same key for the whole session we need to initialize it only once

            sap.ushell.Container.getService("CrossApplicationNavigation").getStartupAppState(this).done(function (oStartupCrossAppState) {
                that.updateModelFromAppstate(that.oAppStateModel, oStartupCrossAppState, "Set Model from StartupAppState");
                that.oCrossAppStatePromise.resolve();
            });

            jQuery.sap.log.info("Router initialized for instance #" + that.INSTANCECOUNTER);

            this.getRouter().getRoute("toCatIcons").attachMatched(function(oEvt) {
                that.extractInnerAppStateFromURL(oEvt.getParameter("arguments").iAppState, oEvt.getParameter("name"));
            });
            // this component should automatically initialize the router!
            this.getRouter().initialize();

            // register a handler to set the current InnerAppStateKey into the inner-app-hash
            // (via a navigation to the "same/inital" route but with a different inner-app-state)
            // This must be done *after* we have processed a potential inner app state from initial invocation (thus the promise)
            this.oInnerAppStatePromise.done(function (sInitialRouteName) {
                //saving data on the current application state after it has been initialized by the "passed" application state
                //to assure that even in case user has not changed anything newly created application state is saved in the backend
                that.updateAppStateFromAppStateModel();

                // register an event handler on the model, to track future changes
                that.oAppStateModel.bindTree("/").attachChange(function () {
                    that.updateAppStateFromAppStateModel();
                });
            });
        },

        setInnerAppStateIntoInnerAppHash : function (sInitialRouteName) {
            var that = this;
            // we have to set a current route, if there is no correct inner app state key in the url
            if (sInitialRouteName === "catchall") {
                sInitialRouteName = "toCatIcons";
            }
            // A previous application is still active while the new application is started,
            // the old application will "see" the hash-change too, and attempt to react on it, as the hashchanger is a global entity.
            // Applications are thus advised not to trigger a navto synchronously!
            //
            setTimeout(function () {
                jQuery.sap.log.info("Setting inner app hash " + that.getInnerAppStateKey() + " in URL in instance #" + that.INSTANCECOUNTER);
                that.navTo(sInitialRouteName, true);
            }, 0); //400
        },

        // calculate links for cross application navigation targets
        calculateCrossAppLinks : function () {
            var sHref,
                oCrossApplicationNavigationService = sap.ushell.Container.getService("CrossApplicationNavigation");

            sHref = oCrossApplicationNavigationService.hrefForExternal({
                target: {
                    semanticObject : "Action",
                    action : "toappstatesample"
                },
                params : { "zdate" : Number(new Date())}, // assures distinct, not relevant for functionality!
                appStateKey : this.oAppState.getKey() //<<< pass x-app state!
            }, this) || "";
            this.oNavTargetsModel.setProperty("/toOurAppWithState", sHref);
            // 2nd link, no app state transferred
            sHref = oCrossApplicationNavigationService.hrefForExternal({
                target: {
                    semanticObject : "Action",
                    action : "toappstatesample"
                },
                params : { "date" : Number(new Date()) } // assures distinct
            }, this) || "";
            this.oNavTargetsModel.setProperty("/toOurAppNoState", sHref);

            sHref = oCrossApplicationNavigationService.hrefForExternal({
                target: {
                    semanticObject : "Action",
                    action : "tocrossappstatesample"
                },
                params : { "date" : Number(new Date()) }, // assures distinct
                appStateKey : this.oAppState.getKey() // pass x-app state to external app!
            }, this) || "";
            this.oNavTargetsModel.setProperty("/toCrossAppWithState", sHref);
        },

        // note how this central navTo route takes care of setting the current inner app state key correctly
        navTo : function (sRouteName, noHistory) {
            jQuery.sap.log.info("NavTo " + sRouteName + "with AppStateKey" + this.getInnerAppStateKey() + " in URL in instance #" + this.INSTANCECOUNTER);
            if (this.getRouter()) {
                this.getRouter().navTo(sRouteName, { iAppState : this.getInnerAppStateKey()}, noHistory);
            }
        }
    });
}());
