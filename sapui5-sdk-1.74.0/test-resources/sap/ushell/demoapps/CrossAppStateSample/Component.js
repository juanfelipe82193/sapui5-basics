// define a root UIComponent which exposes the main view
/*global sap, jQuery, JSONModel*/
(function () {
    "use strict";
    jQuery.sap.declare("sap.ushell.demo.CrossAppStateSample.Component");
    jQuery.sap.require("sap.ui.core.UIComponent");

    sap.ui.core.UIComponent.extend("sap.ushell.demo.CrossAppStateSample.Component", {
        metadata : {
            "library": "sap.ushell.demo.CrossAppStateSample",
            "version" : "1.74.0",
            "includes" : ["css/style.css"],
            "dependencies" : {
                "libs" : [
                    "sap.m"
                ],
                "components" : [
                ]
            },

            "config" : {
                "title": "Application state sample",
                "icon" : "sap-icon://Fiori2/F0002",
                "favIcon" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/favicon/F0002_My_Accounts.ico",
                "homeScreenIconPhone" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/57_iPhone_Desktop_Launch.png",
                "homeScreenIconPhone@2" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/114_iPhone-Retina_Web_Clip.png",
                "homeScreenIconTablet" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/72_iPad_Desktop_Launch.png",
                "homeScreenIconTablet@2" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0002_My_Accounts/144_iPad_Retina_Web_Clip.png",
                "startupImage320x460" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/320_x_460.png",
                "startupImage640x920" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/640_x_920.png",
                "startupImage640x1096" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/640_x_1096.png",
                "startupImage768x1004" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/768_x_1004.png",
                "startupImage748x1024" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/1024_x_748.png",
                "startupImage1536x2008" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/1536_x_2008.png",
                "startupImage1496x2048" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/2048_x_1496.png"
            },

            routing: {
                config: {
                    viewType : "XML",
                    viewPath: "",  // leave empty, common prefix
                    targetControl: "app",
                    clearTarget: false
                },
                routes: [
                    {
                        pattern : "ShowMain", // will be the url and from has to be provided in the data
                        view : "sap.ushell.demo.CrossAppStateSample.Main",
                        name : "toMain" // name used for listening or navigating to this route
                    }
                ]
            }
        },
        /**
         * Move application state data into the model.
         * This is called on startup of the application
         * for sap-xapp-state passed data.
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
            var oData = oAppState.getData();
            if (oData && (JSON.stringify(oData) !== JSON.stringify(oModel.getProperty("/appState"))) && oModel) {
                jQuery.sap.log.info(sComment);
                oModel.setProperty("/appState", oData);
                return true;
            }
            return false;
        },

        createContent : function () {
            var oMainView = sap.ui.view({
                type : sap.ui.core.mvc.ViewType.XML,
                viewName : "sap.ushell.demo.CrossAppStateSample.Main"
            });
            this.oMainView = oMainView;
            return oMainView;
        },

        init : function () {
            var that = this,
                sHref;

            jQuery.sap.log.setLevel(jQuery.sap.log.Level.INFO);
            // we create and register models prior to the createContent method invocation
            // note that actual population with model data is performed later
            this.oAppStateModel = new sap.ui.model.json.JSONModel({
                appState : {
                    filter : "",
                    CollectionName : "no collection name yet"
                }
            });
            this.setModel(this.oAppStateModel, "AppState");
            sap.ui.core.UIComponent.prototype.init.apply(this, arguments); //triggers createContent and by that initializes controllers that are mentioned there
            this.getRouter().initialize();
            sap.ushell.Container.getService("CrossApplicationNavigation").getStartupAppState(this).done(function (oStartupAppStateContainer) {
                that.updateModelFromAppstate(that.oAppStateModel, oStartupAppStateContainer, "Setting values for CrossAppState of CrossAppStateSample Application");
            });
        }
    });
}());
