//@ui5-bundle sap/ushell/demo/AppPersSample3/Component-preload.js
sap.ui.require.preload({
	"sap/ushell/demo/AppPersSample3/App.controller.js":function(){// ${copyright}

(function () {
    "use strict";
    /*global jQuery, sap*/

    jQuery.sap.require("sap.ushell.services.Personalization");
    jQuery.sap.require("sap.m.TablePersoController");

    /* global sap */
    sap.ui.controller("sap.ushell.demo.AppPersSample3.App", {
        onInit : function () {
            var that = this,
                /*
                 * Create dummy model content for the view
                 */
                oDummyModel = new sap.ui.model.json.JSONModel({
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
                }),
                oTable = this.oView.byId("SampleTableMobile"),
                oStartTablePersButton = this.oView.byId("personalize"),
                sVARIANT_SET = "DemoVariantSet",
                sCONTAINER_KEY = "sap.ushell.demo.AppPersSample3.Container",
                oPersonalizationService = sap.ushell.Container.getService("Personalization"),
                sCurrentVariantKey,
                oComponent = sap.ui.core.Component.getOwnerComponentFor(this.getView());

            // member variables
            this.oView = this.getView();
            this.oView.setModel(oDummyModel);
            this.sTABLE_ITEM_NAME = "DemoMobileTable";
            this.sITEM_NAME = "DemoItem";
            this.oMessageService = sap.ushell.Container.getService("Message");
            this.oPersoContainer = null;
            this.oPersoVariantSet  = null;
            this.oTablePersonalizer  = null;
            this.oTablePersoController  = null;
            this.sCurrentVariant  = null;

            this.oTablePersonalizer = oPersonalizationService.getTransientPersonalizer();
            this.oTablePersoController = new sap.m.TablePersoController({
                table : oTable,
                persoService : this.oTablePersonalizer,
                componentName : "sap.ushell.demo.AppPersSample3"
                    // TODO: report bug to UI5; if componentName is not set, the reset does not work, because the initial column state uses empty_component
            });

            this.oTablePersoController.activate();
            oStartTablePersButton.attachPress(function () {
                that.oTablePersoController.openDialog();
            });

            oPersonalizationService.getContainer(sCONTAINER_KEY, {}, oComponent).fail(function () {
                that.oMessageService.error("Loading of personalization data failed");
            }).done(function (oContainer) {
                that.oPersoContainer = new sap.ushell.services.Personalization.VariantSetAdapter(oContainer);

                if (!that.oPersoContainer.containsVariantSet(sVARIANT_SET)) {
                    that.oPersoContainer.addVariantSet(sVARIANT_SET);
                }

                that.oPersoVariantSet = that.oPersoContainer.getVariantSet(sVARIANT_SET);

                that.fillSelectionList();

                sCurrentVariantKey = that.oPersoVariantSet.getCurrentVariantKey();
                that.applyVariant(sCurrentVariantKey);
            });
        },

        /***************************************************************************
         * Event Handlers
         **************************************************************************/
        handleSelectChange : function (oEvent) {
            var sVariantKey = oEvent.getParameter("selectedItem").getKey();

            this.applyVariant(sVariantKey);
        },

        handleSaveVariant : function () {
            var oVariantNameInput = this.oView.byId("variantName"),
                sVariantName = oVariantNameInput.getValue(),
                oVariant,
                oTablePersoValue,
                sVariantKey,
                oTableHeaderInput = this.oView.byId("tableHeaderInput"),
                sTableHeader = oTableHeaderInput.getValue(),
                that = this,
                bNewVariant = false;

            if (!sVariantName) {
                sVariantKey = this.oPersoVariantSet.getCurrentVariantKey();
                if (!sVariantKey) {
                    this.oMessageService.error("Please enter a name for the variant");
                    return;
                }
            } else {
                // if variant with that name already exists, we silently overwrite it
                sVariantKey = this.oPersoVariantSet.getVariantKeyByName(sVariantName);
            }

            if (!sVariantKey) {
                // add new variant
                oVariant = this.oPersoVariantSet.addVariant(sVariantName);
                bNewVariant = true;
                sVariantKey = oVariant.getVariantKey();
            } else {
                // update existing variant
                oVariant = this.oPersoVariantSet.getVariant(sVariantKey);
            }

            sVariantName = oVariant.getVariantName();

            oTablePersoValue = this.oTablePersonalizer.getValue();
            oVariant.setItemValue(this.sITEM_NAME, sTableHeader);
            oVariant.setItemValue(this.sTABLE_ITEM_NAME, oTablePersoValue);
            this.oPersoVariantSet.setCurrentVariantKey(sVariantKey);

            this.oPersoContainer.save()
                .fail(function () {
                    that.oMessageService.error("Save failed");
                })
                .done(function () {
                    that.addVariantToUi(sVariantKey, sVariantName, sTableHeader, bNewVariant);
                    that.oMessageService.info("Personalization variant '" + sVariantName + "' saved!");
                    // clear input fields after save
                    oVariantNameInput.setValue("");
                    oTableHeaderInput.setValue("");
                });
        },

        handleDelVariant : function (oEvent) {
            var oDropDownBox = this.oView.byId("dropDownBox"),
                oItem = oDropDownBox.getSelectedItem(),
                sNextVariantKey,
                sVariantKey = oItem.getKey(),
                that = this;

            oDropDownBox.removeItem(oItem);
            sNextVariantKey = oDropDownBox.getSelectedKey();

            this.oPersoVariantSet.delVariant(sVariantKey);
            this.oPersoVariantSet.setCurrentVariantKey(sNextVariantKey);
            this.oPersoContainer.save().fail(function () {
                that.oMessageService.error("Deletion Failed");
            }).done(function () {
                if (sNextVariantKey) {
                    that.applyVariant(sNextVariantKey);
                } // else {
//              // TODO: reset initial table state; request API from UI5
//              }
            });
        },

        applyVariant : function (sVariantKey) {
            var oVariant,
                oTablePersoValue,
                sTableHeader;

            if (sVariantKey) {
                oVariant = this.oPersoVariantSet.getVariant(sVariantKey);

                sTableHeader = oVariant.getItemValue(this.sITEM_NAME);
                this.oView.byId("tableTitle").setText(sTableHeader);

                oTablePersoValue = oVariant.getItemValue(this.sTABLE_ITEM_NAME);
                this.oTablePersonalizer.setValue(oTablePersoValue);
                this.oTablePersoController.refresh();

                this.oPersoVariantSet.setCurrentVariantKey(sVariantKey);
                this.oPersoContainer.save().fail(function () {
                }).done(function () {
                    // saved current variant!
                });
                this.sCurrentVariant = this.oPersoVariantSet
                    .getVariant(sVariantKey).getVariantName();
            }
        },

        fillSelectionList : function () {
            var oDropDownBox = this.oView.byId("dropDownBox"),
                aVariantKeys = this.oPersoVariantSet.getVariantKeys(),
                sCurrentVariantKey = this.oPersoVariantSet.getCurrentVariantKey(),
                oVariant,
                oItem,
                oCurrentVariantItem,
                that = this;

            aVariantKeys.forEach(function (sVariantKey) {
                oVariant = that.oPersoVariantSet.getVariant(sVariantKey);
                oItem = new sap.ui.core.Item({
                    key: oVariant.getVariantKey(),
                    text : oVariant.getVariantName()
                });
                oDropDownBox.insertItem(oItem, -1);

                if (oVariant.getVariantKey() === sCurrentVariantKey) {
                    oCurrentVariantItem = oItem;
                }
            });

            if (oCurrentVariantItem) {
                oDropDownBox.setSelectedItem(oCurrentVariantItem);
            }
        },

        addVariantToUi : function (sVariantKey, sVariantName, sTableHeader, bIsNewVariant) {
            var oDropDownBox = this.oView.byId("dropDownBox");

            if (bIsNewVariant) {
                oDropDownBox.insertItem(new sap.ui.core.Item("", {
                    key: sVariantKey,
                    text : sVariantName
                }), -1);
            }
            oDropDownBox.setSelectedKey(sVariantKey);
            this.oView.byId("tableTitle").setText(sTableHeader);
        }
    });

}());
},
	"sap/ushell/demo/AppPersSample3/App.view.xml":'<?xml version="1.0" encoding="UTF-8" ?>\n<!-- ${copyright} -->\n<core:View controllerName="sap.ushell.demo.AppPersSample3.App" xmlns:core="sap.ui.core"\n\txmlns="sap.m" xmlns:table="sap.m.table">\n\t<VBox class="marginBoxContent">\n\t\t<Panel headerText="Sample Application for Personalization: Case 3: Variants">\n\t\t\t<List>\n\t\t\t\t<headerToolbar>\n\t\t\t\t\t<Toolbar>\n\t\t\t\t\t\t<content>\n\t\t\t\t\t\t\t<Label text="Variants"></Label>\n\t\t\t\t\t\t\t<Select id="dropDownBox" selectedKey="MultiSelect" change="handleSelectChange">\n\t\t\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t\t</items>\n\t\t\t\t\t\t\t</Select>\n\t\t\t\t\t\t\t<Button id="delVariant" icon="sap-icon://delete" press="handleDelVariant" />\n\t\t\t\t\t\t\t<HBox>\n\t\t\t\t\t\t\t\t<Input id="variantName" type="Text" placeholder="Enter Variant Name..." />\n\t\t\t\t\t\t\t\t<Button id="variant" icon="sap-icon://save" press="handleSaveVariant" />\n\t\t\t\t\t\t\t</HBox>\n\t\t\t\t\t\t</content>\n\t\t\t\t\t</Toolbar>\n\t\t\t\t</headerToolbar>\n\t\t\t\t<StandardListItem iconInset="false" />\n\t\t\t</List>\n\n\t\t\t<Input id="tableHeaderInput" type="Text" placeholder="Enter personalized table header..." />\n\n\t\t\t<Table id="SampleTableMobile" showSeparators="Inner"\n\t\t\t\titems="{ path : \'/rows\' }">\n\t\t\t\t<headerToolbar>\n\t\t\t\t\t<Toolbar>\n\t\t\t\t\t\t<Label id="tableTitle" text=""></Label>\n\t\t\t\t\t\t<ToolbarSpacer></ToolbarSpacer>\n\t\t\t\t\t\t<Button id="personalize" icon="sap-icon://table-view" />\n\t\t\t\t\t</Toolbar>\n\t\t\t\t</headerToolbar>\n\t\t\t\t<columns>\n\t\t\t\t\t<Column id="column1" width="100px">\n\t\t\t\t\t\t<Label text="Column 1" />\n\t\t\t\t\t</Column>\n\t\t\t\t\t<Column id="column2" width="150px">\n\t\t\t\t\t\t<Label text="Column 2" />\n\t\t\t\t\t</Column>\n\t\t\t\t\t<Column id="column3" width="200px">\n\t\t\t\t\t\t<Label text="Column 3"/>\n\t\t\t\t\t</Column>\n\t\t\t\t</columns>\n\t\t\t\t<items>\n\t\t\t\t\t<ColumnListItem>\n\t\t\t\t\t\t<cells>\n\t\t\t\t\t\t\t<Text text="{cell1}" />\n\t\t\t\t\t\t\t<Text text="{cell2}" />\n\t\t\t\t\t\t\t<Text text="{cell3}" />\n\t\t\t\t\t\t</cells>\n\t\t\t\t\t</ColumnListItem>\n\t\t\t\t</items>\n\t\t\t</Table>\n\t\t</Panel>\n\n\t</VBox>\n</core:View>\n',
	"sap/ushell/demo/AppPersSample3/Component.js":function(){// ${copyright}

(function () {
    "use strict";
    /*global jQuery, sap*/

    // define a root UIComponent which exposes the main view
    jQuery.sap.declare("sap.ushell.demo.AppPersSample3.Component");
    jQuery.sap.require("sap.ui.core.UIComponent");

    // new Component
    sap.ui.core.UIComponent.extend("sap.ushell.demo.AppPersSample3.Component", {

        oMainView : null,

        metadata : {
            manifest: "json"
        },

        createContent : function () {
            this.oMainView = sap.ui.xmlview("sap.ushell.demo.AppPersSample3.App");
            return this.oMainView;
        }
    });

}());
},
	"sap/ushell/demo/AppPersSample3/i18n/i18n.properties":'\r\n# Copyright (c) 2009-2015 SAP SE, All Rights Reserved\r\n# See Translation Guide for SAPUI5 Application Developers in the\r\n# sap help portal for details\r\n# http://help.sap.com/saphelp_uiaddon10/helpdata/en/b9/a2a70596e241ebad8901f1d19fe28e/content.htm?frameset=/en/0c/5f019e130e45ceb8914d72fb0257dd/frameset.htm&current_toc=/en/e4/843b8c3d05411c83f58033bac7f072/plain.htm&node_id=652\r\n\r\n# XTIT: Dialog title\r\ntitle=App Personalization Sample 3\r\n\r\n# XTIT: Dialog title\r\nsubtitle=Variants and Table\r\n\r\n# XTXT: description\r\ndescription=Sample app for testing the table personalization and variants\r\n',
	"sap/ushell/demo/AppPersSample3/manifest.json":'{\n    "_version": "1.4.0",\n    "sap.app": {\n        "_version": "1.1.0",\n        "id": "sap.ushell.demo.AppPersSample3",\n        "type": "application",\n        "applicationVersion": {\n            "version": "1.1.0"\n        },\n        "i18n": "i18n/i18n.properties",\n        "title": "{{title}}",\n        "subTitle": "{{subtitle}}",\n        "description": "{{description}}",\n        "ach": "CA-UI2-INT-FE",\n        "crossNavigation": {\n            "inbounds": {\n                "inb" :{\n                    "semanticObject": "Action",\n                    "action": "toappperssample3",\n                    "signature": {\n                        "parameters": {},\n                        "additionalParameters": "allowed"\n                    }\n                }\n            }\n        }\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n        "technology": "UI5",\n        "icons": {\n            "icon": "sap-icon://table-chart"\n        },\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        }\n    },\n    "sap.ui5": {\n        "_version": "1.1.0",\n        "dependencies": {\n            "minUI5Version":"1.28",\n            "libs": {\n                "sap.m": {\n                    "minVersion": "1.28"\n                }\n            }\n        },\n        "contentDensities": {\n            "compact": false,\n            "cozy": true\n        },\n        "services": {\n            "Personalization": {\n                "factoryName": "sap.ushell.ui5service.Personalization"\n            }\n        }\n    }\n}\n'
},"sap/ushell/demo/AppPersSample3/Component-preload"
);
