//@ui5-bundle sap/ushell/demoapps/ReceiveParametersTestApp/Component-preload.js
sap.ui.require.preload({
	"sap/ushell/demoapps/ReceiveParametersTestApp/Main.controller.js":function(){// ${copyright}

(function () {
    "use strict";

    sap.ui.controller("sap.ushell.demo.ReceiveParametersTestApp.Main", {
        getMyComponent: function () {
            var sComponentId = sap.ui.core.Component.getOwnerIdFor(this.getView());
            var myComponent = sap.ui.component(sComponentId);
            return myComponent;
        },

        /**
         * Called when a controller is instantiated and its View controls (if available) are already created.
         * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
         * @memberOf Main
         */
        onInit: function () { },

        navigate: function (/*sEvent, sNavTarget*/) { },

        isLegalViewName: function (sViewNameUnderTest) {
            return (typeof sViewNameUnderTest === "string") && (["Detail", "View1", "View2", "View3", "View4"].indexOf(sViewNameUnderTest) >= 0);
        },

        doNavigate: function (/*sEvent, sNavTarget*/) { },

        /**
         * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
         * @memberOf Main
         */
        onExit: function () {
            jQuery.sap.log.info("sap.ushell.demo.ReceiveParametersTestApp: On Exit of Main.XML.controller called : this.getView().getId():" + this.getView().getId());
            this.mViewNamesToViews = {};
            if (this.oInnerAppRouter) {
                this.oInnerAppRouter.destroy();
            }
        }
    });
}());
},
	"sap/ushell/demoapps/ReceiveParametersTestApp/Main.view.xml":'<?xml version="1.0" encoding="UTF-8" ?>\n<!-- ${copyright} -->\n<core:View\n\txmlns:core="sap.ui.core"\n\txmlns:mvc="sap.ui.core.mvc"\n\txmlns="sap.m"\n\txmlns:l="sap.ui.layout"\n\txmlns:t="sap.ui.codeeditor"\n\txmlns:form="sap.ui.layout.form" controllerName="sap.ushell.demo.ReceiveParametersTestApp.Main"\n\txmlns:html="http://www.w3.org/1999/xhtml">\n\t<Page showHeader="false">\n\t\t<content>\n\t\t\t<l:Grid class="sapUiSmallMarginTop"\thSpacing="2" defaultSpan="L6 M12 S12">\n\t\t\t\t<l:content>\n\t\t\t\t\t<VBox class="sapUiSmallMarginTop">\n\t\t\t\t\t\t<Title text="Received AppState (JSON.stringified)" titleStyle="H4"/>\n\t\t\t\t\t\t<t:CodeEditor editable="false" width="40em" height="30em" value="{AppState>/appstate}" />\n\t\t\t\t\t</VBox>\n\t\t\t\t\t<Table headerText="Application Startup Parameters" noDataText="No startup parameters passed" items="{path: \'startupParameters>/parameters\'}">\n\t\t\t\t\t\t<columns>\n\t\t\t\t\t\t\t<Column\twidth="30%">\n\t\t\t\t\t\t\t\t<Text text="Name" />\n\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t<Column minScreenWidth="Tablet" demandPopin="true">\n\t\t\t\t\t\t\t\t<Text text="Value" />\n\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t</columns>\n\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t<ColumnListItem>\n\t\t\t\t\t\t\t\t<cells>\n\t\t\t\t\t\t\t\t\t<Text text="{startupParameters>key}" />\n\t\t\t\t\t\t\t\t\t<Text text="{startupParameters>value}" />\n\t\t\t\t\t\t\t\t</cells>\n\t\t\t\t\t\t\t</ColumnListItem>\n\t\t\t\t\t\t</items>\n\t\t\t\t\t</Table>\n\t\t\t\t</l:content>\n\t\t\t</l:Grid>\n\t\t</content>\n\t</Page>\n</core:View>',
	"sap/ushell/demoapps/ReceiveParametersTestApp/manifest.json":'{\n    "_version": "1.1.0",\n    "start_url": "start.html",\n\n    "sap.app": {\n        "_version": "1.1.0",\n        "i18n": "messagebundle.properties",\n        "id": "sap.ushell.demoapps.ReceiveParametersTestApp",\n        "type": "component",\n        "embeddedBy": "",\n        "title": "{{title}}",\n        "description": "{{description}}",\n        "ach": "CA-UI2-INT-FE",\n        "dataSources": {},\n        "cdsViews": [],\n        "offline": true\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n\n        "technology": "UI5",\n        "icons": {\n            "icon" : "sap-icon://Fiori5/F0818",\n            "favIcon" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/favicon/F0818_KPI_Workspace.ico",\n            "phone" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0818_KPI_Workspace/57_iPhone_Desktop_Launch.png",\n            "phone@2" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0818_KPI_Workspace/114_iPhone-Retina_Web_Clip.png",\n            "tablet" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0818_KPI_Workspace/72_iPad_Desktop_Launch.png",\n            "tablet@2" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0818_KPI_Workspace/144_iPad_Retina_Web_Clip.png",\n            "homeScreenIconPhone" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0818_KPI_Workspace/57_iPhone_Desktop_Launch.png",\n            "homeScreenIconPhone@2" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0818_KPI_Workspace/114_iPhone-Retina_Web_Clip.png",\n            "homeScreenIconTablet" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0818_KPI_Workspace/72_iPad_Desktop_Launch.png",\n            "homeScreenIconTablet@2" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/launchicon/F0818_KPI_Workspace/144_iPad_Retina_Web_Clip.png",\n            "startupImage320x460" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/320_x_460.png",\n            "startupImage640x920" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/640_x_920.png",\n            "startupImage640x1096" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/640_x_1096.png",\n            "startupImage768x1004" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/768_x_1004.png",\n            "startupImage748x1024" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/1024_x_748.png",\n            "startupImage1536x2008" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/1536_x_2008.png",\n            "startupImage1496x2048" : "/sap/public/bc/ui5_ui5/resources/sap/ca/ui/themes/base/img/splashscreen/2048_x_1496.png"\n        },\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        },\n        "fullWidth": true,\n        "supportedThemes": [\n            "sap_hcb",\n            "sap_bluecrystal",\n            "sap_belize"\n        ]\n    },\n    "sap.ui5": {\n        "_version": "1.1.0",\n        "resources": {\n            "js": [],\n            "css": [ ]\n        },\n        "dependencies": {\n            "libs": {\n                "sap.m": {\n                    "minVersion": "1.28"\n                }\n            }\n        },\n        "models": {},\n        "rootView": "",\n        "handleValidation": false,\n        "config": {},\n        "routing": {},\n        "contentDensities": { "compact": true, "cozy": true }\n    }\n}',
	"sap/ushell/demoapps/ReceiveParametersTestApp/messagebundle.properties":'\r\n# Copyright (c) 2009-2015 SAP SE, All Rights Reserved\r\n# See Translation Guide for SAPUI5 Application Developers in the\r\n# sap help portal for details\r\n# http://help.sap.com/saphelp_uiaddon10/helpdata/en/b9/a2a70596e241ebad8901f1d19fe28e/content.htm?frameset=/en/0c/5f019e130e45ceb8914d72fb0257dd/frameset.htm&current_toc=/en/e4/843b8c3d05411c83f58033bac7f072/plain.htm&node_id=652\r\n\r\n# XTIT: Dialog title\r\ntitle=Application Navigation Parameter display\r\n\r\n# XTXT: description\r\ndescription=application displaying received parameters of an navigation\r\n',
	"sap/ushell/demoapps/ReceiveParametersTestApp/messagebundle_de.properties":'\r\n# See Translation Guide for SAPUI5 Application Developers in the\r\n# sap help portal for details\r\n# http://help.sap.com/saphelp_uiaddon10/helpdata/en/b9/a2a70596e241ebad8901f1d19fe28e/content.htm?frameset=/en/0c/5f019e130e45ceb8914d72fb0257dd/frameset.htm&current_toc=/en/e4/843b8c3d05411c83f58033bac7f072/plain.htm&node_id=652\r\n\r\n# XTIT: Dialog title\r\ntitle=Appplication Navigation Parameteranzeige\r\n\r\n# XTXT: description\r\ndescription=Diese Anwendung zeigt die empfangenen Parameter einer App an\r\n'
},"sap/ushell/demoapps/ReceiveParametersTestApp/Component-preload"
);
