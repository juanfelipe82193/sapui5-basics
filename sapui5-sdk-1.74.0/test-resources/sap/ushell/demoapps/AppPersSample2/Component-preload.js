//@ui5-bundle sap/ushell/demo/AppPersSample2/Component-preload.js
sap.ui.require.preload({
	"sap/ushell/demo/AppPersSample2/App.controller.js":function(){// ${copyright}

/*global sap, jQuery*/
jQuery.sap.require("sap.ushell.demo.AppPersSample2.util.TablePersonalizer");

sap.ui.controller("sap.ushell.demo.AppPersSample2.App", {
    onInit : function () {
        var oDummyData,
            oPersId,
            oDummyModel,
            oConstants,
            oScope,
            oComponent,
            oMobileTable,
            oStartPersButton,
            oTablePersonalizer;

        // Dummy model with test data
        oDummyData = {
            rows : [ {
                cell1 : "Cell 1",
                cell2 : "Cell 2",
                cell3 : "Cell 3"
            }, {
                cell1 : "Cell 4",
                cell2 : "Cell 5",
                cell3 : "Cell 6"
            }, {
                cell1 : "Cell 7",
                cell2 : "Cell 8",
                cell3 : "Cell 9"
            } ]
        };
        oPersId = {
            container : "sap.ushell.demo.AppPersSample2",
            item : "mobiletable"
        };
        oDummyModel = new sap.ui.model.json.JSONModel(oDummyData);
        this.getView().setModel(oDummyModel);
        // Apply existing personalization for mobile table.
        oMobileTable = this.getView().byId("SampleTableMobile");
        oStartPersButton = this.getView().byId("personalize");
        oConstants = sap.ushell.Container.getService("Personalization").constants;
        oScope = {
            validity : 2,
                // Store the data for 2 minutes. In real table personalization
                // scenarios a validity Infinity may be more appropriate.
            keyCategory : oConstants.keyCategory.FIXED_KEY, // See oPersId.container.
            writeFrequency: oConstants.writeFrequency.LOW,
                // We expect that the user changes his table settings rarely
            clientStorageAllowed : true
               // This table personalization data does not contain any sensitive data
        };
        oComponent = sap.ui.core.Component.getOwnerComponentFor(this.getView());
        oTablePersonalizer = new sap.ushell.demo.AppPersSample2.util.TablePersonalizer(oMobileTable,
                oStartPersButton, oPersId, oScope, oComponent);
    }
});
},
	"sap/ushell/demo/AppPersSample2/App.view.xml":'<?xml version="1.0" encoding="UTF-8" ?>\n<!-- ${copyright} -->\n<core:View controllerName="sap.ushell.demo.AppPersSample2.App" xmlns:core="sap.ui.core"\n\txmlns="sap.m" xmlns:table="sap.m.table">\n\t<VBox>\n\t\t<Panel headerText="Sample Application for Personalization: Case 2: Table">\n\t\t\t<Table id="SampleTableMobile" headerText="Table header"\n\t\t\t\tshowSeparators="Inner" items="{ path : \'/rows\' }">\n\t\t\t\t<headerToolbar>\n\t\t\t\t\t<Toolbar>\n\t\t\t\t\t\t<Label text="Test Table for Personalization"></Label>\n\t\t\t\t\t\t<ToolbarSpacer></ToolbarSpacer>\n\t\t\t\t\t\t<Button id="personalize" icon="sap-icon://table-view" />\n\t\t\t\t\t</Toolbar>\n\t\t\t\t</headerToolbar>\n\t\t\t\t<columns>\n\t\t\t\t\t<Column id="column1" width="100px">\n\t\t\t\t\t\t<Label text="Column 1" />\n\t\t\t\t\t</Column>\n\t\t\t\t\t<Column id="column2" width="150px">\n\t\t\t\t\t\t<Label text="Column 2" />\n\t\t\t\t\t</Column>\n\t\t\t\t\t<Column id="column3" width="200px">\n\t\t\t\t\t\t<Label text="Column 3"/>\n\t\t\t\t\t</Column>\n\t\t\t\t</columns>\n\t\t\t\t<items>\n\t\t\t\t\t<ColumnListItem>\n\t\t\t\t\t\t<cells>\n\t\t\t\t\t\t\t<Text text="{cell1}" />\n\t\t\t\t\t\t\t<Text text="{cell2}" />\n\t\t\t\t\t\t\t<Text text="{cell3}" />\n\t\t\t\t\t\t</cells>\n\t\t\t\t\t</ColumnListItem>\n\t\t\t\t</items>\n\t\t\t</Table>\n\t\t</Panel>\n\t</VBox>\n</core:View>\n',
	"sap/ushell/demo/AppPersSample2/Component.js":function(){// ${copyright}
// define a root UIComponent which exposes the main view
jQuery.sap.declare("sap.ushell.demo.AppPersSample2.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.AppPersSample2.Component", {

    oMainView : null,

    metadata : {
        manifest: "json"
    },

    createContent : function () {
        this.oMainView = sap.ui.xmlview("sap.ushell.demo.AppPersSample2.App");
        return this.oMainView;
    }

});

},
	"sap/ushell/demo/AppPersSample2/i18n/i18n.properties":'\r\n# Copyright (c) 2009-2015 SAP SE, All Rights Reserved\r\n# See Translation Guide for SAPUI5 Application Developers in the\r\n# sap help portal for details\r\n# http://help.sap.com/saphelp_uiaddon10/helpdata/en/b9/a2a70596e241ebad8901f1d19fe28e/content.htm?frameset=/en/0c/5f019e130e45ceb8914d72fb0257dd/frameset.htm&current_toc=/en/e4/843b8c3d05411c83f58033bac7f072/plain.htm&node_id=652\r\n\r\n# XTIT: Dialog title\r\ntitle=App Personalization Sample 2\r\n\r\n# XTIT: Dialog title\r\nsubtitle=Table Pers\r\n\r\n# XTXT: description\r\ndescription=Sample app for testing the table personalization\r\n',
	"sap/ushell/demo/AppPersSample2/manifest.json":'{\r\n  "_version": "1.4.0",\r\n  "sap.app": {\r\n    "_version": "1.1.0",\r\n    "id": "sap.ushell.demo.AppPersSample2",\r\n    "type": "application",\r\n    "i18n": "i18n/i18n.properties",\r\n    "title": "{{title}}",\r\n    "subTitle": "{{subtitle}}",\r\n    "description": "{{description}}",\r\n    "applicationVersion": {\r\n      "version": "1.1.0"\r\n    },\r\n    "ach": "CA-UI2-INT-FE",\r\n    "crossNavigation": {\r\n      "inbounds": {\r\n        "inb" :{\r\n          "semanticObject": "Action",\r\n          "action": "toappperssample2",\r\n          "signature": {\r\n            "parameters": {},\r\n            "additionalParameters": "allowed"\r\n          }\r\n        }\r\n      }\r\n    }\r\n  },\r\n  "sap.ui": {\r\n    "_version": "1.1.0",\r\n    "technology": "UI5",\r\n    "icons": {\r\n      "icon": "sap-icon://provision"\r\n    },\r\n    "deviceTypes": {\r\n      "desktop": true,\r\n      "tablet": true,\r\n      "phone": true\r\n    }\r\n  },\r\n  "sap.ui5": {\r\n    "_version": "1.1.0",\r\n    "dependencies": {\r\n      "minUI5Version":"1.28",\r\n      "libs": {\r\n        "sap.m": {\r\n          "minVersion": "1.28"\r\n        }\r\n      }\r\n    },\r\n    "contentDensities": {\r\n      "compact": false,\r\n      "cozy": true\r\n    },\r\n    "services": {\r\n      "Personalization": {\r\n        "factoryName": "sap.ushell.ui5service.Personalization"\r\n      }\r\n    }\r\n  }\r\n}',
	"sap/ushell/demo/AppPersSample2/util/TablePersonalizer.js":function(){// ${copyright}
(function () {
    "use strict";
    /*global jQuery, sap */
    jQuery.sap.declare("sap.ushell.demo.AppPersSample2.util.TablePersonalizer");
    jQuery.sap.require("sap.ushell.services.Personalization");
    jQuery.sap.require("sap.m.TablePersoController");

    /**
     * Glues the table and the button to the respective table personalization control
     * and attaches that one to the personalization storage
     */
    sap.ushell.demo.AppPersSample2.util.TablePersonalizer = function (oTableControl,
            oStartPersonalizationButton, oPersId, oScope, oComponent) {
        var oPersonalizer,
            oTablePersoController;

        oPersonalizer = sap.ushell.Container.getService("Personalization")
            .getPersonalizer(oPersId, oScope, oComponent);
        oTablePersoController = new sap.m.TablePersoController({
            table : oTableControl,
            persoService : oPersonalizer
        });
        oTablePersoController.activate();
        oStartPersonalizationButton.attachPress(function () {
            oTablePersoController.openDialog();
        });
    };
}());
}
},"sap/ushell/demo/AppPersSample2/Component-preload"
);
