//@ui5-bundle sap/ushell/demo/PersSrvTest/Component-preload.js
sap.ui.require.preload({
	"sap/ushell/demo/PersSrvTest/AddItemDialog.fragment.xml":'<core:FragmentDefinition xmlns="sap.m"\r\n\txmlns:core="sap.ui.core">\r\n\t<Dialog title="Add Container Item" class="sapUiPopupWithPadding">\r\n\t\t<content>\r\n\t\t\t<Input value="{Key}" type="Text" placeholder="Enter item key" />\r\n\t\t\t<Input value="{Value}" type="Text" placeholder="Enter item value" />\r\n\t\t\t<CheckBox text="JSON" tooltip="Save as object in JSON format" selected="{JSON}" />\r\n\t\t</content>\r\n\t\t<beginButton>\r\n\t\t\t<Button text="OK" press="onAddItemOK" />\r\n\t\t</beginButton>\r\n\t\t<endButton>\r\n\t\t\t<Button text="Cancel" press="onDialogClose" />\r\n\t\t</endButton>\r\n\t</Dialog>\r\n</core:FragmentDefinition>',
	"sap/ushell/demo/PersSrvTest/App.controller.js":function(){// ${copyright}

(function () {
    "use strict";

    jQuery.sap.require("sap.m.MessageBox");

    sap.ui.controller("sap.ushell.demo.PersSrvTest.App", {
        onInit: function () {
            this.oPersonalizationService = sap.ushell.Container.getService("Personalization");

            this.oModel = new sap.ui.model.json.JSONModel({
                "ContainerName": "",
                "ContainerValidity": "",
                "ContainerItems": [],
                "ContainerLoaded": false,
                "NewItem": {}
            });
            this.getView().setModel(this.oModel);
        },

        getMyComponent: function () {
            return sap.ui.core.Component.getOwnerComponentFor(this.getView());
        },

        /**
         * Called when "New" button in the Container life cycle test panel is pressed
         */
        onNewEmptyContainer: function () {
            var that = this,
                sContainerName = this.oModel.getProperty("/ContainerName");

            if (!sContainerName) {
                sap.m.MessageBox.alert("Enter a container name");
                return;
            }

            this.oPersonalizationService.createEmptyContainer(sContainerName,
                { validity: this._getContainerValidity() }, this.getMyComponent())
                .done(function (oContainer) {
                    jQuery.sap.log.info("Created new container '" + sContainerName + "'");

                    if (oContainer) {
                        that.oContainer = oContainer;
                        that.oModel.setProperty("/ContainerLoaded", true);
                        that.oModel.setProperty("/ContainerItems", []);
                    }
                }).fail(function (sError) {
                    jQuery.sap.log.error("Failed to create container '" + sContainerName + "': " + sError);
                    sap.m.MessageBox.alert("Failed to create container '" + sContainerName + "': " + sError);
                });
        },

        /**
         * Called when "Load" button in the Container life cycle test panel is pressed
         */
        onLoadContainer: function () {
            var that = this,
                sContainerName = this.oModel.getProperty("/ContainerName"),
                i,
                aItemKeys,
                oVal,
                sStringVal,
                bJSONFormat,
                aContainerItems = [];

            if (!sContainerName) {
                sap.m.MessageBox.alert("Enter a container name");
                return;
            }

            this.oPersonalizationService.getContainer(sContainerName,
                { validity: this._getContainerValidity() }, this.getMyComponent())
                .done(function (oContainer) {
                    jQuery.sap.log.info("Loaded container '" + sContainerName + "': " + (oContainer ? oContainer.toString() : oContainer));

                    if (oContainer) {
                        that.oContainer = oContainer;
                        that.oModel.setProperty("/ContainerLoaded", true);

                        aItemKeys = oContainer.getItemKeys();
                        for (i = 0; i < aItemKeys.length; i = i + 1) {
                            oVal = oContainer.getItemValue(aItemKeys[i]);
                            if (typeof oVal === "string") {
                                sStringVal = oVal;
                                bJSONFormat = false;
                            } else {
                                sStringVal = JSON.stringify(oVal);
                                bJSONFormat = true;
                            }
                            aContainerItems[i] = { Key: aItemKeys[i], Value: sStringVal, JSON: bJSONFormat };
                        }

                        that.oModel.setProperty("/ContainerItems", aContainerItems);
                    }
                }).fail(function (sError) {
                    jQuery.sap.log.error("Failed to load container '" + sContainerName + "': " + sError);
                    sap.m.MessageBox.alert("Failed to load container '" + sContainerName + "': " + sError);
                });
        },

        /**
         * Called when "Save" button in the Container life cycle test panel is pressed
         */
        onSaveContainer: function () {
            var sContainerName = this.oModel.getProperty("/ContainerName"),
                i,
                sItemKey,
                oVal,
                sStringVal,
                bJSONFormat,
                aContainerItems = [];

            // TODO: check if container name has been changed after load

            this._assertContainerExists();

            aContainerItems = this.oModel.getProperty("/ContainerItems");
            for (i = 0; i < aContainerItems.length; i = i + 1) {
                sItemKey = aContainerItems[i].Key;
                sStringVal = aContainerItems[i].Value;
                bJSONFormat = aContainerItems[i].JSON;

                if (bJSONFormat) {
                    try {
                        oVal = JSON.parse(sStringVal);
                    } catch (oError) {
                        sap.m.MessageBox.alert("Value for item '" + sItemKey + "' must be a valid JSON string; " + oError);
                        return;
                    }
                } else {
                    oVal = sStringVal;
                }

                this.oContainer.setItemValue(sItemKey, oVal);
            }
            this.oContainer.save().done(function () {
                // Before the next save is triggered the last one has to be finished.
                // Could be done by disabling the save button during the save.
            }).fail(function (sError) {
                jQuery.sap.log.error("Failed to save container '" + sContainerName + "': " + sError);
                sap.m.MessageBox.alert("Failed to save container '" + sContainerName + "': " + sError);
            });
        },

        /**
         * Called when "Save" button in the Container life cycle test panel is pressed
         */
        onLargePayload: function () {
            var i,
                s,
                sx = "",
                iSize,
                iValue,
                iVerify,
                reqSize,
                aContainerItems = [];

            // if an item "value" exists, check that it's size corresponds to "size"
            aContainerItems = this.oModel.getProperty("/ContainerItems");
            function findIndexAssurePresent(sStr, oInitial) {
                var idx = -1;
                idx = aContainerItems.reduce(function (prev, arg, i) {
                    if (aContainerItems[i].Key === sStr) {
                        return i;
                    }
                    return prev;
                }, -1);
                if (idx >= 0) {
                    return idx;
                }
                aContainerItems.push({ Key: sStr, Value: oInitial });
                return aContainerItems.length - 1;
            }
            iSize = findIndexAssurePresent("size", 256);
            iValue = findIndexAssurePresent("value", "");
            iVerify = findIndexAssurePresent("verify", "false");
            try {
                reqSize = parseInt(aContainerItems[iSize].Value, 10);
            } catch (e) {
            }
            if (reqSize >= 0) {
                aContainerItems[iVerify].Value = (aContainerItems[iValue].Value.length === reqSize);
            }
            if (reqSize >= 0) {
                s = "01234567890ABCDEFGHIJKLMNOPQURSTUVXYZ";
                for (i = 0; i < reqSize && sx.length <= reqSize; i = i + 1) {
                    sx = sx + ">>>" + sx.length + "<<<" + s;
                }
                sx = sx.substring(0, reqSize);
                aContainerItems[iValue].Value = sx;
            }
            this.oModel.setProperty("/ContainerItems", aContainerItems);
        },

        /**
         * Called when "Delete" button in the Container life cycle test panel is pressed
         */
        onDeleteContainer: function () {
            var that = this,
                sContainerName = this.oModel.getProperty("/ContainerName");

            if (!sContainerName) {
                sap.m.MessageBox.alert("Enter a container name");
                return;
            }

            sap.m.MessageBox.show("Deleting container '" + sContainerName + "'", {
                icon: "sap-icon://hint",
                title: "Confirm Deletion",
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: function (sAction) {
                    if (sAction === sap.m.MessageBox.Action.OK) {
                        that._deleteContainer(sContainerName);
                    } else {
                        jQuery.sap.log.debug("Deletion of container '" + sContainerName + "' canceled");
                    }
                }
            });
        },

        _deleteContainer: function (sContainerName) {
            var that = this;

            this.oPersonalizationService.delContainer(sContainerName,
                { validity: this._getContainerValidity() }, this.getMyComponent())
                .done(function (oContainer) {
                    sap.m.MessageToast.show("Container '" + sContainerName + "' deleted");
                    that.oModel.setProperty("/ContainerItems", []);
                }).fail(function (sError) {
                    jQuery.sap.log.error("Failed to load container '" + sContainerName + "': " + sError);
                    sap.m.MessageBox.alert("Failed to load container '" + sContainerName + "': " + sError);
                });
        },

        onOpenAddItemDialog: function () {
            if (!this.addItemDialog) {
                this.addItemDialog = sap.ui.xmlfragment(
                    "sap.ushell.demo.PersSrvTest.AddItemDialog",
                    this // associate controller with the fragment
                );
                this.getView().addDependent(this.addItemDialog);
            }

            this.addItemDialog.bindElement("/NewItem");
            this.addItemDialog.open();
        },

        onAddItemOK: function (oEvent) {
            var oNewItem = this.oModel.getProperty("/NewItem"),
                aContainerItems = this.oModel.getProperty("/ContainerItems");

            aContainerItems.push({
                Key: oNewItem.Key,
                Value: oNewItem.Value,
                JSON: oNewItem.JSON
            });

            this.oModel.setProperty("/ContainerItems", aContainerItems);

            oEvent.getSource().getParent().close();
        },

        onRemoveAllItems: function (/*oEvent*/) {
            this._assertContainerExists();

            // TODO: would expect that clear() -> save() works, but this is not the case (neither in sandbox nor in ABAP adapter)
            this.oContainer.clear();

            this.oModel.setProperty("/ContainerItems", []);
        },

        onRemoveSingleItem: function (oEvent) {
            var oBindingContext = oEvent.getSource().getBindingContext(),
                oItem = oBindingContext.getObject(),
                aMatches,
                i,
                aContainerItems = this.oModel.getProperty("/ContainerItems");

            this._assertContainerExists();

            // get index of deleted item from binding context
            aMatches = /\/ContainerItems\/(\d)/.exec(oBindingContext.getPath());
            if (!aMatches) {
                jQuery.sap.log.error("Internal error: expected binding context for table rows: " + oBindingContext.getPath());
            }
            i = parseInt(aMatches[1], 10);
            aContainerItems.splice(i, 1);
            this.oModel.setProperty("/ContainerItems", aContainerItems);

            this.oContainer.delItem(oItem.Key);
        },

        onDialogClose: function (oEvent) {
            oEvent.getSource().getParent().close();
        },

        _assertContainerExists: function () {
            if (!this.oContainer) {
                jQuery.sap.log.error("Illegal state: save container called but no container exists");
                sap.m.MessageBox.alert("Illegal state: save container called but no container exists");
                return;
            }
        },

        _clearContainerWorkaround: function () {
            var i,
                aItemKeys = this.oContainer.getItemKeys();

            for (i = 0; i < aItemKeys.length; i = i + 1) {
                this.oContainer.delItem(aItemKeys[i]);
            }
        },

        _getContainerValidity: function () {
            var iContainerValidity = parseInt(this.oModel.getProperty("/ContainerValidity"), 10);

            if (isNaN(iContainerValidity)) {
                iContainerValidity = undefined;
            }

            return iContainerValidity;
        }
    });
}());
},
	"sap/ushell/demo/PersSrvTest/App.view.xml":'<?xml version="1.0" encoding="UTF-8" ?>\n<!-- ${copyright} -->\n<mvc:View height="100%" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"\n\txmlns:l="sap.ui.layout" controllerName="sap.ushell.demo.PersSrvTest.App">\n\n\t<Page title="Manual test page for the personalization service"\n\t\tclass="marginBoxContent" showNavButton="false">\n\t\t<content>\n\t\t\t<VBox>\n\t\t\t\t<Panel headerText="Container life cycle test">\n\t\t\t\t\t<VBox>\n\t\t\t\t\t\t<Toolbar>\n\t\t\t\t\t\t\t<!-- <Label text="Container Name" /> -->\n\t\t\t\t\t\t\t<Input id="inputContainerName" value="{/ContainerName}"\n\t\t\t\t\t\t\t\ttype="Text" placeholder="Enter container name" />\n\t\t\t\t\t\t\t<Input id="inputContainerValidity" value="{/ContainerValidity}"\n\t\t\t\t\t\t\t\ttype="Number" placeholder="Enter validity" width="10em" />\n\t\t\t\t\t\t\t<ToolbarSpacer />\n\t\t\t\t\t\t\t<Button id="newEmptyContainer" text="New"\n\t\t\t\t\t\t\t\ttooltip="Create a new empty container" press="onNewEmptyContainer" />\n\t\t\t\t\t\t\t<Button id="loadContainer" text="Load" tooltip="Load the container"\n\t\t\t\t\t\t\t\tpress="onLoadContainer" />\n\t\t\t\t\t\t\t<Button id="saveContainer" text="Save" tooltip="Save the container"\n\t\t\t\t\t\t\t\tenabled="{/ContainerLoaded}" press="onSaveContainer" />\n\t\t\t\t\t\t\t<Button id="deleteContainer" text="Delete" tooltip="Delete the container"\n\t\t\t\t\t\t\t\tpress="onDeleteContainer" />\n\t\t\t\t\t\t <Button id="largerPayLoad" text="create large Payload" tooltip=" on click verify that \'size\' and \'value\'.length indicated in member \'verify\',  create a large payload according to key \'size\'"                press="onLargePayload" />\n\t\t\t\t\t\t</Toolbar>\n\n\t\t\t\t\t\t<Table id="itemTable" inset="false" items="{path: \'/ContainerItems\' }">\n\t\t\t\t\t\t\t<headerToolbar>\n\t\t\t\t\t\t\t\t<Toolbar>\n\t\t\t\t\t\t\t\t\t<Label text="Container Items"></Label>\n\t\t\t\t\t\t\t\t\t<ToolbarSpacer />\n\t\t\t\t\t\t\t\t\t<Button icon="sap-icon://add" tooltip="Add item" press="onOpenAddItemDialog" enabled="{/ContainerLoaded}"/>\n\t\t\t\t\t\t\t\t\t<Button icon="sap-icon://delete" tooltip="Remove all items" press="onRemoveAllItems" enabled="{/ContainerLoaded}"/>\n\t\t\t\t\t\t\t\t</Toolbar>\n\t\t\t\t\t\t\t</headerToolbar>\n\t\t\t\t\t\t\t<columns>\n\t\t\t\t\t\t\t\t<Column>\n\t\t\t\t\t\t\t\t\t<Text text="Key" />\n\t\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t\t<Column>\n\t\t\t\t\t\t\t\t\t<Text text="Value" />\n\t\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t\t<Column width="6em" hAlign="Right">\n\t\t\t\t\t\t\t\t\t<Text text="JSON" />\n\t\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t\t<Column width="6em" hAlign="Center">\n\t\t\t\t\t\t\t\t</Column>\n\t\t\t\t\t\t\t</columns>\n\t\t\t\t\t\t\t<items>\n\t\t\t\t\t\t\t\t<ColumnListItem>\n\t\t\t\t\t\t\t\t\t<cells>\n\t\t\t\t\t\t\t\t\t\t<Text text="{Key}" />\n\t\t\t\t\t\t\t\t\t\t<Input value="{Value}" />\n\t\t\t\t\t\t\t\t\t\t<CheckBox tooltip="Save as object in JSON format"\n\t\t\t\t\t\t\t\t\t\t\tselected="{JSON}" />\n\t\t\t\t\t\t\t\t\t\t<Button icon="sap-icon://delete" tooltip="Remove item" press="onRemoveSingleItem"/>\n\t\t\t\t\t\t\t\t\t</cells>\n\t\t\t\t\t\t\t\t</ColumnListItem>\n\t\t\t\t\t\t\t</items>\n\t\t\t\t\t\t</Table>\n\t\t\t\t\t</VBox>\n\t\t\t\t</Panel>\n\t\t\t</VBox>\n\t\t</content>\n\t</Page>\n</mvc:View>\n',
	"sap/ushell/demo/PersSrvTest/Component.js":function(){// define a root UIComponent which exposes the main view
/*global sap, jQuery */
jQuery.sap.declare("sap.ushell.demo.PersSrvTest.Component");
jQuery.sap.require("sap.ui.core.UIComponent");

// new Component
sap.ui.core.UIComponent.extend("sap.ushell.demo.PersSrvTest.Component", {

    oMainView : null,

    metadata : {
        manifest: "json"
    },

    createContent : function () {
        "use strict";
        var oComponentData = this.getComponentData && this.getComponentData();

        this.oMainView = sap.ui.xmlview("sap.ushell.demo.PersSrvTest.App");

        return this.oMainView;
    }

});
},
	"sap/ushell/demo/PersSrvTest/i18n/i18n.properties":'\r\n# Copyright (c) 2009-2015 SAP SE, All Rights Reserved\r\n# See Translation Guide for SAPUI5 Application Developers in the\r\n# sap help portal for details\r\n# http://help.sap.com/saphelp_uiaddon10/helpdata/en/b9/a2a70596e241ebad8901f1d19fe28e/content.htm?frameset=/en/0c/5f019e130e45ceb8914d72fb0257dd/frameset.htm&current_toc=/en/e4/843b8c3d05411c83f58033bac7f072/plain.htm&node_id=652\r\n\r\n# XTIT: Dialog title\r\ntitle=Personalization Service Test\r\n\r\n# XTIT: Dialog title\r\nsubtitle=Pers container life cycle\r\n\r\n# XTXT: description\r\ndescription=Sample app for testing the Personalization ushell service\r\n',
	"sap/ushell/demo/PersSrvTest/manifest.json":'{\n    "_version": "1.4.0",\n    "sap.app": {\n        "_version": "1.1.0",\n        "id": "sap.ushell.demo.PersSrvTest",\n        "type": "application",\n        "i18n": "i18n/i18n.properties",\n        "title": "{{title}}",\n        "subTitle": "{{subtitle}}",\n        "description": "{{description}}",\n        "applicationVersion": {\n            "version": "1.1.0"\n        },\n        "ach": "CA-UI2-INT-FE",\n        "crossNavigation": {\n            "inbounds": {\n                "inb" :{\n                    "semanticObject": "Action",\n                    "action": "toperssrvtest",\n                    "signature": {\n                        "parameters": {},\n                        "additionalParameters": "allowed"\n                    }\n                }\n            }\n        }\n    },\n    "sap.ui": {\n        "_version": "1.1.0",\n        "technology": "UI5",\n        "icons": {\n             "icon": "sap-icon://past"\n        },\n        "deviceTypes": {\n            "desktop": true,\n            "tablet": true,\n            "phone": true\n        }\n    },\n    "sap.ui5": {\n        "_version": "1.1.0",\n        "dependencies": {\n            "minUI5Version":"1.28",\n            "libs": {\n                "sap.m": {\n                    "minVersion": "1.28"\n                }\n            }\n        },\n        "contentDensities": {\n            "compact": false,\n            "cozy": true\n        },\n        "services": {\n            "Personalization": {\n                "factoryName": "sap.ushell.ui5service.Personalization"\n            }\n        }\n    }\n}\n'
},"sap/ushell/demo/PersSrvTest/Component-preload"
);
