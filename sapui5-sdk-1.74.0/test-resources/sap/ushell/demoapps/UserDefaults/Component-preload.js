//@ui5-bundle sap/ushell/demo/UserDefaults/Component-preload.js
sap.ui.require.preload({
	"sap/ushell/demo/UserDefaults/Component.js":function(){// define a root UIComponent which exposes the main view
/*global sap, jQuery, JSONModel*/
jQuery.sap.declare("sap.ushell.demo.UserDefaults.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.UserDefaults.Component", {

    metadata : {
        manifest: "json"
    },

    getAutoPrefixId : function() {
        return true;
    },

    createContent : function() {

        var oMainView = sap.ui.view({
            type : sap.ui.core.mvc.ViewType.XML,
            viewName : "sap.ushell.demo.UserDefaults.view.Main"
        });

        return oMainView;
    },

    init : function() {
        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

        // this component should automatically initialize the router!
        this.getRouter().initialize();
    }

});

},
	"sap/ushell/demo/UserDefaults/manifest.json":'{\n\t"_version": "1.4.0",\n\n\t"sap.app": {\n\t\t"_version": "1.1.0",\n\t\t"i18n": "messagebundle.properties",\n\t\t"id": "sap.ushell.demo.UserDefaults",\n\t\t"type": "application",\n\t\t"embeddedBy": "",\n\t\t"title": "{{title}}",\n\t\t"description": "{{description}}",\n\t\t"applicationVersion": {\n\t\t\t"version": "1.1.0"\n\t\t},\n\t\t"ach": "CA-UI2-INT-FE",\n\t\t"dataSources": {},\n\t\t"cdsViews": [],\n\t\t"offline": true,\n\t\t"crossNavigation": {\n\t\t\t"inbounds": {\n\t\t\t\t"inb" :{\n\t\t\t\t\t"semanticObject": "Action",\n\t\t\t\t\t"action": "toUserDefaults",\n\t\t\t\t\t"signature": {\n\t\t\t\t\t\t"parameters": {\n\t\t\t\t\t\t\t  "GLAccount": {\n                                    "defaultValue": {\n                                        "value": "UserDefault.GLAccount",\n                                        "format": "reference"\n                                    },\n                                    "filter": {\n                                        "value": "\\\\d+",\n                                        "format": "regexp"\n                                    },\n                                    "required": false\n                                },\n\t\t\t\t\t\t\t  "CostCenter": {\n                                    "filter": {\n                                        "value": "UserDefault.CostCenter",\n                                        "format": "reference"\n                                    },\n                                    "required": false\n                                }\n\t\t\t\t\t\t},\n\t\t\t\t\t\t"additionalParameters": "allowed"\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\n\t\t}\n\t},\n\t"sap.ui": {\n\t\t"_version": "1.1.0",\n\n\t\t"technology": "UI5",\n\t\t"icons": {\n\t\t\t "icon": "sap-icon://undefined/favorite"\n\t\t},\n\t\t"deviceTypes": {\n\t\t\t"desktop": true,\n\t\t\t"tablet": true,\n\t\t\t"phone": true\n\t\t},\n\t\t"supportedThemes": [\n\t\t\t"sap_hcb",\n\t\t\t"sap_bluecrystal"\n\t\t],\n\t\t"fullWidth": false\n\t},\n\t"sap.ui5": {\n\t\t"_version": "1.1.0",\n\t\t"resources": {\n\t\t\t"js": []\n\t\t},\n\t\t"dependencies": {\n\t\t\t"minUI5Version":"1.28",\n\t\t\t"libs": {\n\t\t\t\t"sap.m": {\n\t\t\t\t\t"minVersion": "1.28"\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t\t"models": {},\n\t\t"rootView": {\n\t\t\t"viewName": "sap.ushell.demo.UserDefaults.view.Main",\n\t\t\t"type": "XML"\n\t\t},\n\t\t"handleValidation": false,\n\t\t"config": {},\n\t\t"routing": {\n\t\t\t\t"config": {\n\t\t\t\t\t"routerClass": "sap.m.routing.Router",\n\t\t\t\t\t"viewType": "XML",\n\t\t\t\t\t"viewPath": "sap.ushell.demo.UserDefaults.view",\n\t\t\t\t\t"controlId": "app",\n\t\t\t\t\t"controlAggregation": "detailPages",\n\t\t\t\t\t"async": true\n\t\t\t\t},\n\t\t\t\t"routes": [\n\t\t\t\t\t{\n\t\t\t\t\t\t"pattern": "SimpleEditor",\n\t\t\t\t\t\t"name": "toEditor",\n\t\t\t\t\t\t"target": "editor"\n\t\t\t\t\t},\n\t\t\t\t\t{\n\t\t\t\t\t\t"pattern": "UsedParams",\n\t\t\t\t\t\t"name": "toUsedParams",\n\t\t\t\t\t\t"target": "usedParams"\n\t\t\t\t\t},\n\t\t\t\t\t{\n\t\t\t\t\t\t"pattern": "ShowEvents",\n\t\t\t\t\t\t"name": "toShowEvents",\n\t\t\t\t\t\t"target": "showEvents"\n\t\t\t\t\t}\n\t\t\t\t],\n\t\t\t\t"targets": {\n\t\t\t\t\t"editor": {\n\t\t\t\t\t\t"viewName": "SimpleEditor"\n\t\t\t\t\t},\n\t\t\t\t\t"usedParams": {\n\t\t\t\t\t\t"viewName": "UsedParams"\n\t\t\t\t\t},\n\t\t\t\t\t"showEvents": {\n\t\t\t\t\t\t"viewName": "ShowEvents"\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t},\n\t\t"contentDensities": {\n\t\t\t"compact": false,\n\t\t\t"cozy": true\n\t\t}\n\t}\n}',
	"sap/ushell/demo/UserDefaults/messagebundle.properties":'\r\n# Copyright (c) 2009-2015 SAP SE, All Rights Reserved\r\n# See Translation Guide for SAPUI5 Application Developers in the\r\n# sap help portal for details\r\n# http://help.sap.com/saphelp_uiaddon10/helpdata/en/b9/a2a70596e241ebad8901f1d19fe28e/content.htm?frameset=/en/0c/5f019e130e45ceb8914d72fb0257dd/frameset.htm&current_toc=/en/e4/843b8c3d05411c83f58033bac7f072/plain.htm&node_id=652\r\n\r\n# XTIT: Dialog title\r\ntitle=User Default Application\r\n\r\n# XTXT: description\r\ndescription=application for user defaults\r\n',
	"sap/ushell/demo/UserDefaults/view/List.controller.js":function(){// ${copyright}

(function () {
    "use strict";

    sap.ui.controller("sap.ushell.demo.UserDefaults.view.List", {
        oApplication: null,
        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf view.List
         */
        onInit: function () {
            var page = this.oView.getContent()[0], srvc = sap.ushell.services.AppConfiguration, oActionSheet, oActionsButton;
            if (srvc) {
                page.setShowFooter(true);
                oActionSheet = new sap.m.ActionSheet({ placement: sap.m.PlacementType.Top });
                oActionSheet.addButton(new sap.ushell.ui.footerbar.JamDiscussButton());
                oActionSheet.addButton(new sap.ushell.ui.footerbar.JamShareButton());
                oActionSheet.addButton(new sap.ushell.ui.footerbar.AddBookmarkButton());
                oActionsButton = new sap.m.Button({
                    press: function () {
                        oActionSheet.openBy(this);
                    },
                    icon: "sap-icon://action"
                });

                page.setFooter(new sap.m.Bar({
                    contentRight: oActionsButton
                }));
            }
        },

        getRouter: function () {
            return this.getOwnerComponent().getRouter();
        },

        /**
         * handles changing of the view
         */
        onViewSelectionChange: function (oEvent) {
            var oItemParam = oEvent.getParameter("listItem");
            var oItem = (oItemParam) ? oItemParam : oEvt.getSource();

            if (/editor/.test(oItem.getId())) {
                this.getRouter().navTo("toEditor");
                return;
            }
            if (/usedParams/.test(oItem.getId())) {
                this.getRouter().navTo("toUsedParams");
                return;
            }
            if (/showEvents/.test(oItem.getId())) {
                this.getRouter().navTo("toShowEvents");
                return;
            }
        },
    });
}());
},
	"sap/ushell/demo/UserDefaults/view/List.view.xml":'<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"\n    xmlns="sap.m" controllerName="sap.ushell.demo.UserDefaults.view.List"\n    xmlns:html="http://www.w3.org/1999/xhtml">\n    <Page>\n        <content>\n            <List \n                includeItemInSelection="false"\n                mode="SingleSelectMaster"\n                selectionChange="onViewSelectionChange" >\n                <items>\n                    <StandardListItem\n                      id="editor"\n                      title="Simple Editor"\n                      description="Edit available user default values"/>\n                    <StandardListItem\n                      id="usedParams"\n                      title="Used Default Parameters"\n                      description="Shows defaults used in Target Mappings"/>\n                    <StandardListItem\n                      id="showEvents"\n                      title="Show User Default Store Events"\n                      description="Shows events"/>\n                </items>\n            </List>\n        </content>\n    </Page>\n</core:View>',
	"sap/ushell/demo/UserDefaults/view/Main.controller.js":function(){sap.ui.controller("sap.ushell.demo.UserDefaults.view.Main", {

    /**
    * Called when a controller is instantiated and its View controls (if available) are already created.
    * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
    * @memberOf Main
    */
    onInit: function() {
        var listView =  sap.ui.view({ type: sap.ui.core.mvc.ViewType.XML,
            viewName: "sap.ushell.demo.UserDefaults.view.List",
            id : "List"
          });
        var editorView =  sap.ui.view({ type: sap.ui.core.mvc.ViewType.XML,
            viewName: "sap.ushell.demo.UserDefaults.view.SimpleEditor",
            id : "SimpleEditor"
          });
        var oApp = this.byId("app");

        oApp.addMasterPage(listView);
        oApp.addDetailPage(editorView);
    },

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf Main
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf Main
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf Main
*/
//	onExit: function() {
//	}

});
},
	"sap/ushell/demo/UserDefaults/view/Main.view.xml":'<core:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc"\n\txmlns="sap.m" controllerName="sap.ushell.demo.UserDefaults.view.Main" xmlns:html="http://www.w3.org/1999/xhtml">\n\t<SplitApp id="app">\n\t\t<masterPages>\n\t\t\t<!-- filled dynamically in controller -->\n\t\t</masterPages>\n\t\t<detailPages>\n\t\t\t<!-- filled dynamically in controller -->\n\t\t</detailPages>\n\t</SplitApp>\n</core:View>',
	"sap/ushell/demo/UserDefaults/view/ShowEvents.controller.js":function(){/*global sap, jQuery */
sap.ui.controller("sap.ushell.demo.UserDefaults.view.ShowEvents", {

        /**
        * Called when a controller is instantiated and its View controls (if available) are already created.
        * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
        * @memberOf view.Detail
        */
        onInit: function () {
            "use strict";
            var that = this;
            this.oModel = new sap.ui.model.json.JSONModel({
                aParameterNames: [{name: "InitialParameterName1"}]
            });
            this.getView().setModel(this.oModel);

            if (!sap.ushell.demo.UserDefaults.Component.staticListener) {
                this.registerStaticListener();
                // map the static model into our
                this.getView().setModel(sap.ushell.demo.UserDefaults.Component.staticListener.getModel(), "storeEvent");
            }
            // fill the parameters directly on startup
            this.handleRefreshParameters();
       },

       registerStaticListener : function() {
           var oModel = new sap.ui.model.json.JSONModel({ count : 0, lastEvent : "no event"});
           sap.ushell.Container.getService("UserDefaultParameters").attachValueStored(function (oValue) {
               var newCount = (oModel.getProperty("/count") || 1) + 1;
               oModel.setProperty("/count", newCount);
               var newValue = "name:\"" + oValue.getParameter("parameterName") + "\" new value:" + JSON.stringify(oValue.getParameter("parameterValue")) + "";
               oModel.setProperty("/lastEvent", newValue);
           });
           sap.ushell.demo.UserDefaults.Component.staticListener = {
                   getModel : function() { return oModel; }
           };
       },
        /**
        * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
        * (NOT before the first rendering! onInit() is used for that one!).
        * @memberOf view.Detail
        */
        // onBeforeRendering: function() {
        //
        // },

        getRouter: function () {
            "use strict";
            return this.getOwnerComponent().getRouter();
        },

        handleRefreshParameters : function () {
            var that = this,
                oCSTRService = sap.ushell.Container.getService("ClientSideTargetResolution");
                //sParameterName = this.getView().getModel("UserDef").getProperty("/parameterName");

            oCSTRService.getUserDefaultParameterNames().done(function(aParameterNames) {
                //sap.ushell.Container.getService("Message").show(sap.ushell.services.Message.Type.INFO, " Value is " + JSON.stringify(oValue));
                that.updateParametersForModel(aParameterNames, that.oModel);
                //that.getView().getModel("UserDef").setProperty("/value",oParameters[sParameterName].valueObject.value);
            });
        },

        updateParametersForModel : function (aParameterNames, oModel) {
            var aParameterNamesTmp = [];
            for(i in aParameterNames) {
                aParameterNamesTmp.push({name : aParameterNames[i]});
            }
            oModel.setData({ "aParameterNames": aParameterNamesTmp}, false); // false -> do not merge
        }
    /**
    * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
    * This hook is the same one that SAPUI5 controls get after being rendered.
    * @memberOf view.Detail
    */
    // onAfterRendering: function() {
    //
    //  },

    /**
    * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
    * @memberOf view.Detail
    */
    // onExit: function() {
    //
    // }

});
},
	"sap/ushell/demo/UserDefaults/view/ShowEvents.view.xml":'<core:View \n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:mvc="sap.ui.core.mvc" \n    xmlns:uicore="sap.ui.core"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:layout="sap.ui.layout"\n    controllerName="sap.ushell.demo.UserDefaults.view.ShowEvents">\n\t <Page title="Show User Defaults Parameters Store Events">\n        <content>\n            <layout:VerticalLayout>\n                <layout:VerticalLayout>\n                  <MessageStrip\n                    class="description"\n                    text="This shows the event count and last event of the UserDefaultService"\n                    type="Information"\n                    showIcon="true">\n                  </MessageStrip>\n                </layout:VerticalLayout>\n                <Text text="{storeEvent>/count}"></Text>\n                <Text text="{storeEvent>/lastEvent}"></Text>\n            </layout:VerticalLayout>\n        </content>\n    </Page>\n</core:View>',
	"sap/ushell/demo/UserDefaults/view/SimpleEditor.controller.js":function(){/*global sap, jQuery, JSONModel*/
// ${copyright}
sap.ui.controller("sap.ushell.demo.UserDefaults.view.SimpleEditor", {


    /**
    * Called when a controller is instantiated and its View controls (if available) are already created.
    * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
    * @memberOf view.Detail
    */
    onInit: function () {
        "use strict";
        this.oModel = new sap.ui.model.json.JSONModel({
            aUserDef: [ //actually not used - is there to become an idea of the metaData structure
                       {
                            "parameterName" : "InitialParameterName",
                            "valueObject" : {
                                "value" : "InitialFromApplication"
                            },
                            "editorMetadata" : {
                                "displayText" : "InitialDisplayTextFromApp",
                                "description": "InitialDescriptionFromApp",
                                "parameterIndex": "InitialParameterIndex",
                                "groupId": "InitialGROUP-IDFromApp",
                                "groupTitle" : "InitialGroupTitleFromApp"
                            }
                       }
                    ]
        });
        this.getView().setModel(this.oModel);
        // fill the parameters directly on startup
        this.handleRefreshParameters();
   },

    getRouter: function () {
        "use strict";
        return this.getOwnerComponent().getRouter();
    },

    getParameterViaEvent: function (oEvent) {
        var sPath = oEvent.oSource.getParent().getBindingContext().sPath,
        oParameter;

        oParameter = this.oModel.getProperty(sPath);
        console.log(oParameter);
        return oParameter;
    },

    handleSaveParameters : function (oEvent) {
        var oParameter = jQuery.extend(true, {}, this.getParameterViaEvent(oEvent));

        if (oParameter.valueObject) {
            if (oParameter.valueObject.extendedValue) {
                oParameter.valueObject.extendedValue = JSON.parse(oParameter.valueObject.extendedValue);
            } else {
                delete oParameter.valueObject.extendedValue;
            }
        }

        sap.ushell.Container.getService("UserDefaultParameters")
              .editorSetValue(oParameter.parameterName, oParameter.valueObject);
    },
    handleResetParameters : function (oEvent) {
        var that = this,
            oParameter = this.getParameterViaEvent(oEvent);

        // set entire object to undefined means delete it from FES
        sap.ushell.Container.getService("UserDefaultParameters")
        .editorSetValue(oParameter.parameterName, {value: undefined})
            .done(function () {
                // refresh the related UI controls
                that.handleRefreshParameters();
            });
    },

    handleRefreshParameters : function () {
        var that = this;

        sap.ushell.Container.getService("UserDefaultParameters").editorGetParameters().done(function(oParameters) {
            that.updateParametersForModel(oParameters, that.oModel);
        });
    },

    updateParametersForModel : function (oParameters, oModel) {
        var aUserDefTmp = []; // use an empty array to be able to delete parameters

        //for each property name -> push all array elements into aUserDef
        for (var sParameter in oParameters) {
            //copy the parameter name because we want to show it in the UI later
            oParameters[sParameter].parameterName = sParameter;

            // if no display text is available, use the parameter name
            // note: save ignores the metadata
            if (!oParameters[sParameter].editorMetadata) {
                oParameters[sParameter].editorMetadata = {
                    "displayText" : oParameters[sParameter].parameterName
                };
            }
            if (oParameters[sParameter].valueObject && oParameters[sParameter].valueObject.extendedValue) {
                oParameters[sParameter].valueObject.extendedValue = JSON.stringify(oParameters[sParameter].valueObject.extendedValue);
            }
            aUserDefTmp.push(oParameters[sParameter]);
        }

        // sort by groupid, parameterindex
        aUserDefTmp.sort(function(oDefault1, oDefault2) {
            //first by groupId
            var returnValueOfCompareByGroupId = compareByGroupId(oDefault1, oDefault2);
            if (returnValueOfCompareByGroupId === 0) {
                //then by parameterIdx
                return compareByParameterIndex(oDefault1, oDefault2);
            }

            return returnValueOfCompareByGroupId;
        });
        
        // compare by groupId
        function compareByGroupId(oDefault1, oDefault2) {
            // handle default without metadata
            if (!(oDefault2.editorMetadata && oDefault2.editorMetadata.groupId)) {
                return -1; // keep order
            }
            if (!(oDefault1.editorMetadata && oDefault1.editorMetadata.groupId)) {
                return 1; // move oDefault1 to the end
            }

            if (oDefault1.editorMetadata.groupId < oDefault2.editorMetadata.groupId) return -1;
            if (oDefault1.editorMetadata.groupId > oDefault2.editorMetadata.groupId) return 1;

            return 0;
        };
        
        // compare by parameterIndex
        function compareByParameterIndex(oDefault1, oDefault2) {
            // handle default without metadata
            if (!(oDefault2.editorMetadata && oDefault2.editorMetadata.parameterIndex)) {
                return -1; // keep order
            }
            if (!(oDefault1.editorMetadata && oDefault1.editorMetadata.parameterIndex)) {
                return 1; // move oDefault1 to the end
            }
            return oDefault1.editorMetadata.parameterIndex - oDefault2.editorMetadata.parameterIndex;
        };

        oModel.setData({ "aUserDef": aUserDefTmp}, false); // false -> do not merge
    }

});
},
	"sap/ushell/demo/UserDefaults/view/SimpleEditor.view.xml":'<core:View\n        xmlns="sap.m"\n        xmlns:core="sap.ui.core"\n        xmlns:mvc="sap.ui.core.mvc"\n        xmlns:uimodel="sap.ui.model"\n        xmlns:form="sap.ui.layout.form"\n        xmlns:html="http://www.w3.org/1999/xhtml"\n        xmlns:layout="sap.ui.layout"\n        controllerName="sap.ushell.demo.UserDefaults.view.SimpleEditor">\n    <!-- ${copyright} -->\n    <Page title="User Default Parameters">\n        <content>\n            <layout:VerticalLayout>\n                <layout:VerticalLayout>\n                  <MessageStrip\n                    class="description"\n                    text="This is a sample editor allowing you to modify your User Default Parameters. Those are used for intent-based navigation."\n                    type="Information"\n                    showIcon="true">\n                  </MessageStrip>\n                  <MessageStrip\n                    class="description"\n                    text="To persist/save the modified parameter value please press enter inside of the input field."\n                    type="Information"\n                    showIcon="true">\n                  </MessageStrip>\n                  <MessageStrip\n                    class="description"\n                    text="Note: Only parameters are displayed which are configured in a Target Mapping assigned to a user."\n                    type="Warning"\n                    showIcon="true">\n                  </MessageStrip>\n                </layout:VerticalLayout>\n                <Button text="Refresh all" class="refreshBtn" press="handleRefreshParameters"/>\n                <List items="{  path: \'/aUserDef\',\n                                sorter: {\n                                    path: \'editorMetadata/groupId\',\n                                    descending: false,\n                                    group: true\n                                }\n                             }">\n                    <InputListItem label="{editorMetadata/displayText}" tooltip="(id: {parameterName}) {editorMetadata/description}">\n                    <HBox alignItems="Center" justifyContent="End">\n                        <Input id="UserDefaultValue" value="{valueObject/value}" type="Text"\n                        change="handleSaveParameters" placeholder="please enter value"/>\n                        <Input id="ExtendedUserDefaultValue" value="{valueObject/extendedValue}" type="Text"\n                        change="handleSaveParameters" placeholder="please enter an extended value"/>\n                        <Button text="Reset" press="handleResetParameters"/></HBox>\n                    </InputListItem>\n                </List>\n\n\n            </layout:VerticalLayout>\n        </content>\n    </Page>\n</core:View>\n',
	"sap/ushell/demo/UserDefaults/view/UsedParams.controller.js":function(){/*global sap, jQuery */
sap.ui.controller("sap.ushell.demo.UserDefaults.view.UsedParams", {

        /**
        * Called when a controller is instantiated and its View controls (if available) are already created.
        * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
        * @memberOf view.Detail
        */
        onInit: function () {
            "use strict";
            var that = this;
            this.oModel = new sap.ui.model.json.JSONModel({
                aParameterNames: [ {name: "InitialParameterName1"}]
            });
            this.getView().setModel(this.oModel);

            // fill the parameters directly on startup
            this.handleRefreshParameters();
       },


        /**
        * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
        * (NOT before the first rendering! onInit() is used for that one!).
        * @memberOf view.Detail
        */
        // onBeforeRendering: function() {
        //
        // },

        getRouter: function () {
            "use strict";
            return this.getOwnerComponent().getRouter();
        },

        handleRefreshParameters : function () {
            var that = this,
                oCSTRService = sap.ushell.Container.getService("ClientSideTargetResolution");
                //sParameterName = this.getView().getModel("UserDef").getProperty("/parameterName");

            oCSTRService.getUserDefaultParameterNames().done(function(aParameterNames) {
                //sap.ushell.Container.getService("Message").show(sap.ushell.services.Message.Type.INFO, " Value is " + JSON.stringify(oValue));
                that.updateParametersForModel(aParameterNames, that.oModel);
                //that.getView().getModel("UserDef").setProperty("/value",oParameters[sParameterName].valueObject.value);
            });
        },

        updateParametersForModel : function (aParameterNames, oModel) {
            var aParameterNamesTmp = [];
            for(i in aParameterNames) {
                aParameterNamesTmp.push({name : aParameterNames[i]});
            }
            oModel.setData({ "aParameterNames": aParameterNamesTmp}, false); // false -> do not merge
        }
    /**
    * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
    * This hook is the same one that SAPUI5 controls get after being rendered.
    * @memberOf view.Detail
    */
    // onAfterRendering: function() {
    //
    //  },

    /**
    * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
    * @memberOf view.Detail
    */
    // onExit: function() {
    //
    // }

});
},
	"sap/ushell/demo/UserDefaults/view/UsedParams.view.xml":'<core:View \n    xmlns="sap.m"\n    xmlns:core="sap.ui.core"\n    xmlns:mvc="sap.ui.core.mvc" \n    xmlns:uicore="sap.ui.core"\n    xmlns:html="http://www.w3.org/1999/xhtml"\n    xmlns:layout="sap.ui.layout"\n    controllerName="sap.ushell.demo.UserDefaults.view.UsedParams">\n\t <Page title="Assigned User Default Parameters">\n        <content>\n            <layout:VerticalLayout>\n                <layout:VerticalLayout>\n                  <MessageStrip\n                    class="description"\n                    text="This is a list of all User Default Parameters which are configured in Target Mappings assigned to the currently logged on user."\n                    type="Information"\n                    showIcon="true">\n                  </MessageStrip>\n                  <MessageStrip\n                    class="description"\n                    text="Note: Each parameter must be handled by a plugin to get its metadata. If that does not happen, no default value or display text is available."\n                    type="Warning"\n                    showIcon="true">\n                  </MessageStrip>\n                </layout:VerticalLayout>\n                <Button text="Refresh all" class="refreshBtn" press="handleRefreshParameters"/>\n                <List items="{ path: \'/aParameterNames\'}">\n                    <InputListItem label="{name}">\n                    </InputListItem>\n                </List>\n            </layout:VerticalLayout>\n        </content>\n    </Page>\n</core:View>'
},"sap/ushell/demo/UserDefaults/Component-preload"
);
