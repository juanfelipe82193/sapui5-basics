//@ui5-bundle sap/ushell/demo/AppNavSample/Component-h2-preload.js
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
	"sap/ushell/demo/AppNavSample/manifest.json":'{\n    "_version": "1.4.0",\n\n    "sap.fiori": {\n        "registrationIds": ["F9999999999999"]\n    },\n\n    "sap.app": {\n        "_version": "1.1.0",\n        "id": "sap.ushell.demo.AppNavSample",\n        "type": "application",\n        "i18n": "i18n/i18n.properties",\n        "title": "{{title}}",\n        "subTitle": "{{subtitle}}",\n        "description": "{{description}}",\n        "applicationVersion": {\n            "version": "1.1.0"\n        },\n        "ach": "CA-UI2-INT-FE",\n        "dataSources": {},\n        "cdsViews": [],\n        "offline": true,\n        "crossNavigation": {\n            "inbounds": {\n                "inb" :{\n                    "semanticObject": "Action",\n                    "action": "toappnavsample",\n                    "signature": {\n                        "parameters": {},\n                        "additionalParameters": "allowed"\n                    }\n                }\n            }\n        }\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n\n        "technology": "UI5",\n        "icons": {\n             "icon": "sap-icon://Fiori2/F0003"\n        },\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        },\n        "supportedThemes": [\n            "sap_hcb",\n            "sap_bluecrystal"\n        ],\n        "fullWidth": false\n    },\n    "sap.ui5": {\n        "_version": "1.1.0",\n        "resources": {\n            "js": [],\n            "css": [{\n                "uri": "css/custom.css",\n                "id": "sap.ushell.demo.AppNavSample.stylesheet"\n            }]\n        },\n        "dependencies": {\n            "minUI5Version":"1.28",\n            "libs": {\n                "sap.m": {\n                    "minVersion": "1.28"\n                }\n            }\n        },\n        "models": {},\n        "rootView": "",\n        "handleValidation": false,\n        "config": {},\n        "routing": {},\n        "contentDensities": {\n            "compact": false,\n            "cozy": true\n        },\n        "services": {\n            "ShellUIService": {\n                "factoryName": "sap.ushell.ui5service.ShellUIService"\n            },\n            "CrossApplicationNavigation": {\n                "factoryName": "sap.ushell.ui5service.CrossApplicationNavigation"\n            },\n            "URLParsing": {\n                "factoryName": "sap.ushell.ui5service.URLParsing"\n            },\n            "Configuration": {\n                "factoryName": "sap.ushell.ui5service.Configuration"\n            }\n        }\n    }\n}\n'
},"sap/ushell/demo/AppNavSample/Component-h2-preload"
);
sap.ui.loader.config({depCacheUI5:{
"sap/ushell/demo/AppNavSample/Component.js":["sap/ui/core/UIComponent.js","sap/ui/core/routing/Router.js","sap/ui/model/json/JSONModel.js"],
"sap/ushell/demo/AppNavSample/Main.view.xml":["sap/m/SplitApp.js","sap/ui/core/mvc/XMLView.js","sap/ushell/demo/AppNavSample/Main.controller.js"],
"sap/ushell/demo/AppNavSample/view/Detail.controller.js":["sap/ui/core/mvc/Controller.js","sap/ui/model/json/JSONModel.js","sap/ushell/Config.js","sap/ushell/appRuntime/ui5/AppRuntimeService.js"],
"sap/ushell/demo/AppNavSample/view/Detail.view.xml":["sap/m/Button.js","sap/m/CustomListItem.js","sap/m/DisplayListItem.js","sap/m/HBox.js","sap/m/Input.js","sap/m/InputListItem.js","sap/m/Label.js","sap/m/List.js","sap/m/Page.js","sap/m/Panel.js","sap/m/Text.js","sap/m/TextArea.js","sap/m/Title.js","sap/m/Toolbar.js","sap/m/ToolbarSpacer.js","sap/m/VBox.js","sap/ui/core/Icon.js","sap/ui/core/mvc/XMLView.js","sap/ushell/demo/AppNavSample/view/Detail.controller.js"],
"sap/ushell/demo/AppNavSample/view/List.view.xml":["sap/m/Button.js","sap/m/HBox.js","sap/m/Input.js","sap/m/Link.js","sap/m/Page.js","sap/m/Panel.js","sap/m/VBox.js","sap/ui/core/mvc/XMLView.js","sap/ushell/demo/AppNavSample/view/List.controller.js"],
"sap/ushell/demo/AppNavSample/view/SapTagSample.controller.js":["sap/m/Token.js","sap/ui/core/mvc/Controller.js","sap/ui/model/json/JSONModel.js"],
"sap/ushell/demo/AppNavSample/view/SapTagSample.view.xml":["sap/m/Input.js","sap/m/Label.js","sap/m/List.js","sap/m/MessageStrip.js","sap/m/MultiInput.js","sap/m/Page.js","sap/m/Panel.js","sap/m/StandardListItem.js","sap/m/Text.js","sap/ui/core/Item.js","sap/ui/core/mvc/XMLView.js","sap/ui/layout/VerticalLayout.js","sap/ushell/demo/AppNavSample/view/SapTagSample.controller.js"],
"sap/ushell/demo/AppNavSample/view/SmartNavSample.controller.js":["sap/ui/core/mvc/Controller.js","sap/ui/model/json/JSONModel.js","sap/ushell/services/SmartNavigation.js"],
"sap/ushell/demo/AppNavSample/view/SmartNavSample.view.xml":["sap/m/Column.js","sap/m/ColumnListItem.js","sap/m/Input.js","sap/m/Link.js","sap/m/Page.js","sap/m/Table.js","sap/m/Text.js","sap/m/Title.js","sap/m/Toolbar.js","sap/ui/core/Icon.js","sap/ui/core/Item.js","sap/ui/core/mvc/XMLView.js","sap/ushell/demo/AppNavSample/view/SmartNavSample.controller.js"],
"sap/ushell/demo/AppNavSample/view/UserDefaultView.view.xml":["sap/m/Input.js","sap/m/Label.js","sap/m/Page.js","sap/m/Slider.js","sap/ui/core/mvc/XMLView.js","sap/ui/layout/form/SimpleForm.js","sap/ushell/demo/AppNavSample/view/UserDefaultView.controller.js"],
"sap/ushell/demo/AppNavSample/view/View1.view.xml":["sap/m/Button.js","sap/m/Input.js","sap/m/Label.js","sap/m/Link.js","sap/m/Page.js","sap/m/Panel.js","sap/m/Switch.js","sap/m/TextArea.js","sap/ui/core/mvc/XMLView.js","sap/ui/layout/form/SimpleForm.js","sap/ushell/demo/AppNavSample/view/View1.controller.js"],
"sap/ushell/demo/AppNavSample/view/View2.view.xml":["sap/m/Button.js","sap/m/DatePicker.js","sap/m/Label.js","sap/m/Page.js","sap/ui/core/mvc/XMLView.js","sap/ui/layout/HorizontalLayout.js","sap/ushell/demo/AppNavSample/view/View2.controller.js"],
"sap/ushell/demo/AppNavSample/view/View3.view.xml":["sap/m/Button.js","sap/m/Label.js","sap/m/Link.js","sap/m/Page.js","sap/m/Panel.js","sap/m/Title.js","sap/m/Toolbar.js","sap/m/ToolbarSpacer.js","sap/m/VBox.js","sap/ui/core/mvc/XMLView.js","sap/ushell/demo/AppNavSample/view/View3.controller.js"],
"sap/ushell/demo/AppNavSample/view/View4.controller.js":["sap/ui/core/mvc/Controller.js"],
"sap/ushell/demo/AppNavSample/view/View4.view.xml":["sap/m/Button.js","sap/m/ComboBox.js","sap/m/FlexBox.js","sap/m/HBox.js","sap/m/Input.js","sap/m/InputListItem.js","sap/m/Label.js","sap/m/Link.js","sap/m/List.js","sap/m/Page.js","sap/m/Panel.js","sap/m/RadioButton.js","sap/m/RadioButtonGroup.js","sap/m/Switch.js","sap/m/Text.js","sap/m/VBox.js","sap/ui/codeeditor/CodeEditor.js","sap/ui/core/Icon.js","sap/ui/core/Item.js","sap/ui/core/mvc/XMLView.js","sap/ui/layout/form/SimpleForm.js","sap/ushell/demo/AppNavSample/view/View4.controller.js"],
"sap/ushell/demo/AppNavSample/view/View4Popover.fragment.xml":["sap/m/Popover.js","sap/m/TextArea.js","sap/ui/core/Fragment.js"]
}});
