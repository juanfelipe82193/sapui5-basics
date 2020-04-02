// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

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
