//@ui5-bundle sap/ushell/demo/AppStateSample/Component-preload.js
sap.ui.require.preload({
	"sap/ushell/demo/AppStateSample/Component.js":function(){// define a root UIComponent which exposes the main view
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
},
	"sap/ushell/demo/AppStateSample/Main.controller.js":function(){/*global sap, jQuery, JSONModel*/
(function () {
    "use strict";
    sap.ui.controller("sap.ushell.demo.AppStateSample.Main", {
        /**
        * Called when a controller is instantiated and its View controls (if available) are already created.
        * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
        * @memberOf Main
        */
        onInit: function () {
            var listView =  sap.ui.view({ type: sap.ui.core.mvc.ViewType.XML,
                viewName: "sap.ushell.demo.AppStateSample.view.List",
                id : "List"
                }),
                oApp = this.byId("app");
            oApp.addMasterPage(listView);
        },

    /**
    * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
    * (NOT before the first rendering! onInit() is used for that one!).
    * @memberOf Main
    */
    // onBeforeRendering: function() {
    //
    //},

    /**
    * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
    * This hook is the same one that SAPUI5 controls get after being rendered.
    * @memberOf Main
    */
    //onAfterRendering: function() {
    //
    //},

    /**
    * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
    * @memberOf Main
    */
        onExit: function () {
            jQuery.sap.log.info("Main view destroyed");
        }
    });
}());
},
	"sap/ushell/demo/AppStateSample/Main.view.xml":'<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"\n\txmlns="sap.m" controllerName="sap.ushell.demo.AppStateSample.Main" xmlns:html="http://www.w3.org/1999/xhtml">\n\t<SplitApp id="app">\n\t\t<masterPages>\n\t\t\t<!-- filled dynamically in controller -->\n\t\t</masterPages>\n\t\t<detailPages>\n\t\t\t<!-- filled dynamically in controller -->\n\t\t</detailPages>\n\t</SplitApp>\n</core:View>',
	"sap/ushell/demo/AppStateSample/i18n/i18n.properties":'\r\n# Copyright (c) 2009-2015 SAP SE, All Rights Reserved\r\n# See Translation Guide for SAPUI5 Application Developers in the\r\n# sap help portal for details\r\n# http://help.sap.com/saphelp_uiaddon10/helpdata/en/b9/a2a70596e241ebad8901f1d19fe28e/content.htm?frameset=/en/0c/5f019e130e45ceb8914d72fb0257dd/frameset.htm&current_toc=/en/e4/843b8c3d05411c83f58033bac7f072/plain.htm&node_id=652\r\n\r\n# XTIT: Dialog title\r\ntitle=Application State Sample\r\n\r\n# XTXT: description\r\ndescription=application demonstrating the application state\r\n',
	"sap/ushell/demo/AppStateSample/manifest.json":'{\n\t"_version": "1.4.0",\n\t"sap.app": {\n\t\t"_version": "1.1.0",\n\t\t"i18n": "i18n/i18n.properties",\n\t\t"id": "sap.ushell.demo.AppStateSample",\n\t\t"type": "application",\n\t\t"title": "{{title}}",\n\t\t"description": "{{description}}",\n\t\t"applicationVersion": {\n\t\t\t"version": "1.1.0"\n\t\t},\n\t\t"ach": "CA-UI2-INT-FE",\n\t\t"dataSources": {},\n\t\t"cdsViews": [],\n\t\t"offline": true,\n\t\t"crossNavigation": {\n\t\t\t"inbounds": {\n\t\t\t\t"inb" :{\n\t\t\t\t\t"semanticObject": "Action",\n\t\t\t\t\t"action": "toAppStateSampleIcon",\n\t\t\t\t\t"signature": {\n\t\t\t\t\t\t"parameters": {},\n\t\t\t\t\t\t"additionalParameters": "allowed"\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\n\t\t}\n\t},\n\t"sap.ui": {\n\t\t"_version": "1.1.0",\n\t\t"technology": "UI5",\n\t\t"icons": {\n\t\t\t "icon": "sap-icon://Fiori2/F0005"\n\t\t},\n\t\t"deviceTypes": {\n\t\t\t"desktop": true,\n\t\t\t"tablet": true,\n\t\t\t"phone": true\n\t\t},\n\t\t"supportedThemes": [\n\t\t\t"sap_hcb",\n\t\t\t"sap_bluecrystal"\n\t\t],\n\t\t"fullWidth": false\n\t},\n\t"sap.ui5": {\n\t\t"_version": "1.1.0",\n\t\t"resources": {\n\t\t\t"js": [],\n\t\t\t"css": [{\n\t\t\t\t"uri": "css/custom.css",\n\t\t\t\t"id": "sap.ushell.demo.AppStateSample.stylesheet"\n\t\t\t}]\n\t\t},\n\t\t"dependencies": {\n\t\t\t"minUI5Version":"1.28",\n\t\t\t"libs": {\n\t\t\t\t"sap.m": {\n\t\t\t\t\t"minVersion": "1.28"\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t"models": {},\n\t\t"rootView": "",\n\t\t"handleValidation": false,\n\t\t"config": {},\n\t\t"routing": {\n\t\t\t"config": {\n\t\t\t\t"viewType" : "XML",\n\t\t\t\t"viewPath": "",\n\t\t\t\t"targetControl": "app",\n\t\t\t\t"targetAggregation": "detailPages",\n\t\t\t\t"clearTarget": false,\n\t\t\t\t"transition": "slide"\n\t\t\t},\n\t\t\t"routes": [\n\t\t\t\t{\n\t\t\t\t\t"pattern" : "ShowCollection/sap-iapp-state={iAppState}",\n\t\t\t\t\t"view" : "sap.ushell.demo.AppStateSample.view.CatIcons",\n\t\t\t\t\t"name" : "toCatIcons"\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\t"pattern" : ":all*:",\n\t\t\t\t\t"view" : "sap.ushell.demo.AppStateSample.view.CatIcons",\n\t\t\t\t\t"name" : "catchall"\n\t\t\t\t}\n\t\t\t]\n\t\t},\n\t\t"contentDensities": {\n\t\t\t"compact": false,\n\t\t\t"cozy": true\n\t\t}\n\t}\n}\n',
	"sap/ushell/demo/AppStateSample/view/CatIcons.controller.js":function(){// ${copyright}

(function () {
    "use strict";

    /**
     * Determines the total number of icon entries of all collections together.
     *
     * @returns {int} Returns the total number of icon entries of all collections together
     * @private
     */
    function determineTotalNumberOfCollectionItems() {
        var nTotalumber = 0,
            i,
            aAllCollectionNames;
        aAllCollectionNames = sap.ui.core.IconPool.getIconCollectionNames();
        for (i = 0; i < aAllCollectionNames.length; i++) {
            nTotalumber += sap.ui.core.IconPool.getIconNames(aAllCollectionNames[i]).length;
        }
        return nTotalumber;
    }

    /**
     * Builds the table rows for the given icon names and returns them in an array.
     *
     * @param {string} sCollectionName The collection or category name of the icons
     * @param {number} nIdxStart You can pass the start index for the rows
     * @returns {string[]} Returns the prepared table rows for the given collection name
     * @private
     */
    function buildTableRowsForCollectionName(sCollectionName, nIdxStart) {
        var sUri, oRes = [], sIconNames;
        //Names of the icons for one icon collection/category (e.g. 'undefined', 'Fiori2')
        sIconNames = sap.ui.core.IconPool.getIconNames(sCollectionName);
        if (sIconNames) {
            sIconNames.forEach(function (sIconName, nIdx) {
                sUri = "sap-icon://" + sCollectionName + "/" + sIconName;
                oRes.push({ key: sUri, index: nIdx + nIdxStart, collectionName: sCollectionName }); //JSON
            });
        }
        return oRes;
    }

    /**
     * Prepares the build of table rows by given collection name.
     *
     * @param {string} sCollectionName Name of icon collection/category (e.g. 'undefined', 'Fiori2')
     * @returns {string[]} Returns the prepared table rows for the given collection name
     * @private
     */
    function generateTableRows(sCollectionName) {
        var aRes = [],
            i,
            aAllCollectionNames;
        if (sCollectionName === "Show All") {
            aAllCollectionNames = sap.ui.core.IconPool.getIconCollectionNames();
            for (i = 0; i < aAllCollectionNames.length; i++) {
                // Array.push.apply because we have to concat JSON objects
                Array.prototype.push.apply(aRes, buildTableRowsForCollectionName(aAllCollectionNames[i], aRes.length + 1));
            }
        } else {
            Array.prototype.push.apply(aRes, buildTableRowsForCollectionName(sCollectionName, aRes.length + 1));
        }
        return aRes;
    }

    /**
     * Creates & assigns the table rows to the model.
     *
     * @private
     */
    function updateAppStateModel(oModel, oAppStateModel) {
        var sFilter = oAppStateModel.getProperty("/appState/filter"),
            aRes;
        aRes = generateTableRows(oAppStateModel.getProperty("/appState/CollectionName"));
        jQuery.sap.log.info("updateAppStateModel ... " + sFilter);
        sFilter.split(" ").forEach(function (nv) {
            aRes = aRes.filter(function (obj) {
                return obj.key.indexOf(nv) >= 0;
            });
        });
        oModel.getData().icons = aRes;
        oModel.refresh();
    }

    /**
     * Creates & assigns the table rows to the model.
     *
     * @private
     */
    function assignTableRowsToModel(oModel, oAppStateModel, oView) {
        oModel.setSizeLimit(determineTotalNumberOfCollectionItems());
        oModel.setData({ icons: generateTableRows(oAppStateModel.getProperty("/appState/CollectionName")) });
        oView.setModel(oModel);
        updateAppStateModel(oModel, oAppStateModel);
    }

    /**
     * Called when a controller is instantiated and its View controls (if available) are already created.
     * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
     * @memberOf view.CatIcons
     */
    sap.ui.controller("sap.ushell.demo.AppStateSample.view.CatIcons", {
        onInit: function () {
            var that = this;
            this.oModel = new sap.ui.model.json.JSONModel();
            assignTableRowsToModel(this.oModel, this.getMyComponent().getModel("AppState"), this.getView());
            // Register event handler for collection change
            // This takes place when user selects category and respective list Item Press handler changes AppState Model's collection name
            this.getMyComponent().getModel("AppState").bindProperty("/appState/CollectionName").attachChange(function () {
                assignTableRowsToModel(that.oModel, that.getMyComponent().getModel("AppState"), that.getView());

            });
            this.getView().byId("search").attachLiveChange(this.handleChange.bind(this));
            this.getMyComponent().getModel("AppState").bindProperty("/appState/filter").attachChange(function () {
                updateAppStateModel(that.oModel, that.getMyComponent().getModel("AppState"));
                // This navTo is needed to obtain the sap-iapp-state in the browser URL to be able to
                // get the current filter applied immediately when using the URL with this app state
                that.getMyComponent().navTo("toCatIcons");
            });
            //to ensure that during first time icon loading they get filtered
            updateAppStateModel(this.oModel, this.getMyComponent().getModel("AppState"));
        },

        handleChange: function (ev) {
            jQuery.sap.log.info("handleChange ..." + ev.oSource.getModel("AppState").getProperty("/appState/filter"));
            ev.oSource.getModel("AppState").setProperty("/appState/filter", ev.mParameters.newValue);
        },

        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        getMyComponent: function () {
            var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
            return sap.ui.component(sComponentId);
        }
    });
}());
},
	"sap/ushell/demo/AppStateSample/view/CatIcons.view.xml":'<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:uicore="sap.ui.core"\n        controllerName="sap.ushell.demo.AppStateSample.view.CatIcons" xmlns:html="http://www.w3.org/1999/xhtml">\n    <Page title="CatIcons" id="pgView2">\n        <content>\n             <Text text=" Collection view ..."></Text>\n                 <VBox>\n            <Toolbar>\n              <!-- <Label text="Container Name" /> -->\n              <Input id="search" value="{AppState>/appState/filter}"\n                type="Text" placeholder="Enter icon search criteria, e.g. \'Suite sub\' or \'Fiori7\'  " tooltip="split at space, search anywhere in key, AND operation  (e.g.  \'SuiteInApp sub\')" />\n<!--                data-change="handleChange" -->\n              <ToolbarSpacer />\n              <Button id="onClearSearch" text="clear" tooltip="clear search"\n                 press="onClearSearch" />\n            </Toolbar>\n\n            <Table id="itemTable" inset="false" items="{path: \'/icons\' }">\n              <columns>\n                <Column width="2em" hAlign="Center">\n                  <Text text="Icon" width="6em"/>\n                </Column>\n                <Column width="23em">\n                  <Text text="Key" />\n                </Column>\n                <Column width="15em">\n                  <Text text="CollectionName" />\n                </Column>\n                <Column width="10em" hAlign="Center">\n                  <Text text="index" tooltip="index in collection"/>\n                </Column>\n              </columns>\n              <items>\n                <ColumnListItem>\n                  <cells>\n                    <uicore:Icon src="{key}" tooltip="{key}"\n         height="38px" width="38px" size ="2rem" />\n                    <Text text="{key}" />\n                    <Text text="{collectionName}" />\n                    <Text text="{index}" />\n                  </cells>\n                </ColumnListItem>\n              </items>\n            </Table>\n          </VBox>\n        </content>\n    </Page>\n</core:View>',
	"sap/ushell/demo/AppStateSample/view/List.controller.js":function(){/*global sap, jQuery, JSONModel*/
(function () {
    "use strict";
    jQuery.sap.require("sap.ui.commons.Panel");
    jQuery.sap.require("sap.ushell.ui.footerbar.JamDiscussButton");
    jQuery.sap.require("sap.ushell.ui.footerbar.JamShareButton");
    jQuery.sap.require("sap.ushell.ui.footerbar.AddBookmarkButton");
    sap.ui.controller("sap.ushell.demo.AppStateSample.view.List", {
    /**
    * Called when a controller is instantiated and its View controls (if available) are already created.
    * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
    * @memberOf view.List
    */
        onInit: function () {
            var page = this.oView.getContent()[0],
                srvc = sap.ushell.services.AppConfiguration,
                oActionSheet,
                oActionsButton,
                that = this;

            this.getView().byId("MasterPage").setTitle("AppStateSample Instance #" + this.getMyComponent().INSTANCECOUNTER);
            if (srvc) {
                page.setShowFooter(true);
                oActionSheet = new sap.m.ActionSheet({ placement: sap.m.PlacementType.Top });
                oActionSheet.addButton(new sap.ushell.ui.footerbar.JamDiscussButton());
                oActionSheet.addButton(new sap.ushell.ui.footerbar.JamShareButton());
                oActionSheet.addButton(new sap.ushell.ui.footerbar.AddBookmarkButton());
                oActionsButton = new sap.m.Button({
                    press : function () {
                        oActionSheet.openBy(this);
                    },
                    icon : "sap-icon://action"
                });
                if (srvc && typeof srvc.getSettingsControl === "function") {
                    page.setFooter(new sap.m.Bar({
                        contentLeft: srvc.getSettingsControl(),
                        contentRight: oActionsButton
                    }));
                }
                this.oModel = new sap.ui.model.json.JSONModel({ icons: this.getIconCollections() });
                //register selectListItemByCollectionName on attachChange event
                this.getMyComponent().getModel("AppState").bindProperty("/appState/CollectionName").attachChange(function () {
                    try {
                        that.selectListItemByCollectionName((that.getMyComponent().getModel("AppState")).getProperty("/appState/CollectionName"));
                    } catch (e) {
                        jQuery.sap.log.warning("Could not excecute selectListItemByCollectionName (yet)",
                            e.toString(), "sap.ushell.demo.AppStateSample.view.List");
                    }
                });
                this.getView().setModel(this.oModel);
                //call it once to ensure that one item is selected -> after we set the model because ListItems have to be loaded!
                that.selectListItemByCollectionName(this.getMyComponent().getModel("AppState").getProperty("/appState/CollectionName"));
            }
        },

        handleCollectionItemSelect : function (ev) {
            var path,
                oBindContext = ev.getSource().getSelectedItem().getBindingContext(),
                sCollectionName = oBindContext.getObject().CollectionName;
            sCollectionName = sCollectionName || "";
            ev.oSource.getModel("AppState").setProperty("/appState/CollectionName", sCollectionName);
            this.getMyComponent().navTo("toCatIcons");
        },

        getIconCollections : function () {
            var res = [],
                nr,
                that;
            //add an "all" @ the very top of the list
            res.push({ CollectionName : "Show All" });
            sap.ui.core.IconPool.getIconCollectionNames().forEach(function (sCollectionName) {
                res.push({ CollectionName : sCollectionName });
            });
            return res;
        },

        //loop over the ListItems and select the item which matches to the passed collectionName
        selectListItemByCollectionName : function (sCollectionName) {
            this.getView().byId("categoryList").getItems().forEach(function (ListItem) {
                if (ListItem.getTitle() === sCollectionName) {
                    ListItem.setSelected(true); //select item
                }
            });
        },

        getMyComponent : function () {
            var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
            return sap.ui.component(sComponentId);
        },

        getRouter: function () {
            return sap.ui.core.UIComponent.getRouterFor(this);
        }
    });
}());
},
	"sap/ushell/demo/AppStateSample/view/List.view.xml":'<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"\n\txmlns="sap.m" controllerName="sap.ushell.demo.AppStateSample.view.List"\n\txmlns:html="http://www.w3.org/1999/xhtml">\n\t<Page id="MasterPage" title="AppStateSample(Master View) Instance #0">\n\t\t<content>\t\t\n<ToolbarSpacer />\n<ToolbarSpacer />\n\t\t   <List id="categoryList"\n\t\t         headerText="Icon Categories"\n\t\t         mode="SingleSelectMaster"\n\t\t         select="handleCollectionItemSelect"\n\t\t\t     items="{/icons}">\n\t            <items>\n\t                <StandardListItem\n\t                    title="{CollectionName}"\n\t                    type="Active"\n\t                    press="handleCollectionItemPress" >\n\t                </StandardListItem>\n\t            </items>\n            </List>\n      <Panel>\n          <Title text="Cross Application Navigation"></Title>\n          <content>\n\t\t      <ToolbarSpacer />\n\t\t      <Link text="navigate to OTHER app, passing context" href="{navTargets>/toCrossAppWithState}" tooltip="Go to CrossAppState sample app, passing current state"></Link>\n\t\t      <!-- this is not a recommended way to perform external navigation -->\n\t\t      <Link href="{navTargets>/toOurAppWithState}" text="navigate to THIS app, passing context"\n\t\t        tooltip="Restart our app, passing current state"></Link>\n\t\t       <ToolbarSpacer />\n\t\t      <!-- this is not a recommended way to perform external navigation -->\n\t\t      <Link href="{navTargets>/toOurAppNoState}" text="navigate to THIS app, passing no context"\n\t\t        tooltip="Restart our app, no context"></Link>\n          </content>\n      </Panel>          \n        </content>\n\t</Page>\n</core:View>'
},"sap/ushell/demo/AppStateSample/Component-preload"
);
