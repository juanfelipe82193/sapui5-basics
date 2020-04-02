// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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