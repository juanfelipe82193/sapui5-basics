// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

// this application creates/reads/deletes multiple records in the Personalization service the used key
(function () {
    "use strict";

    jQuery.sap.require("sap.m.MessageBox");
    sap.ui.controller("sap.ushell.demo.PersSrv2Test.App", {
        onInit: function () {
            var sSrvURL;
            this.oPersonalizationService = sap.ushell.Container.getService("Personalization");
            sSrvURL = "/sap/opu/odata/sap/ZMF_PERSCO_SRV/";
            this.oDataModel = new sap.ui.model.odata.ODataModel(sSrvURL, true, { "sap-client": 120 });
            this.oModel = new sap.ui.model.json.JSONModel({
                "ContainerName": "",
                "Time": "0s",
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

        successSubmitBatch: function () { },

        errorSubmitBatch: function () { },

        oObj: {
            "Item1": "value1",
            "Item2": "value2"
        },

        savePersCOContainer: function (sKey, fndone) {
            var a,
                obj = {
                    "Containertype": "P",
                    "Containerid": sKey,
                    "Changedat": "\/Date(1402911849000)\/",
                    "Expiredat": "\/Date(1401109666000)\/",
                    "Achcomponent": "SCM-BAS-DF",
                    "Validity": 30,
                    "Changedby": "FORSTMANN",
                    "items": [
                        {
                            "Itemvalue": "Fiori Rocks" + new Date(),
                            "Itemid": "ITEM#ITEM1",
                            "Itemtype": " ",
                            "Containerid": sKey,
                            "Containertype": "P"
                        }, {
                            "Itemvalue": "3REALLLYCLIENTDF" + new Date(),
                            "Itemid": "ITEM#ITEM2",
                            "Itemtype": " ",
                            "Containerid": sKey,
                            "Containertype": "P"
                        }, {
                            "Itemvalue": "3REALLLYCLIENTDF" + new Date(),
                            "Itemid": "ITEM#ITEM3",
                            "Itemtype": " ",
                            "Containerid": sKey,
                            "Containertype": "P"
                        }, {
                            "Itemvalue": "3REALLLYCLIENTDF" + new Date(),
                            "Itemid": "ITEM#ITEM4",
                            "Itemtype": " ",
                            "Containerid": sKey,
                            "Containertype": "P"
                        }
                    ]
                };
            for (a in this.oObj) {
                if (this.oObj.hasOwnProperty(a)) {
                    obj.items.push({
                        "Itemvalue": "Fiori rocks" + new Date() + " " + this.oObj[a],
                        "Itemid": String(a),
                        "Itemtype": " ",
                        "Containerid": sKey,
                        "Containertype": "P"
                    });
                }
            }
            // "always post", get data from model, then post it :-)
            this.oDataModel.addBatchChangeOperations([
                this.oDataModel.createBatchOperation(
                    "/containers",
                    "POST",
                    obj
                )]
            );
            this.oDataModel.submitBatch(
                fndone,
                this.errorSubmitBatch,
                true
            );
        },

        // sets the Time model property
        setTime: function (currLength, initialLength, startTime) {
            this.oModel.setProperty("/Time", currLength + " : avg:" + ((new Date() - startTime) / 1000) / (initialLength - currLength) + " total: " + ((new Date() - startTime) / 1000) + "s ");
        },

        generateKeys: function () {
            var noStartIndex = this.oModel.getProperty("/StartIndex"),
                noRecords = this.oModel.getProperty("/NoRecords"),
                i,
                arr = [];
            noStartIndex = parseInt(noStartIndex, 10);
            noRecords = parseInt(noRecords, 10);
            for (i = noStartIndex; i < noStartIndex + noRecords; i = i + 1) {
                arr.push({ name: "theKey" + i });
            }
            return arr;
        },

        readPersCOContainer: function (sKey, fndone) {
            // "always post", get data from model, then post it :-)
            this.oDataModel.addBatchReadOperations([
                this.oDataModel.createBatchOperation(
                    "/containers(Containertype='',Containerid='" + encodeURI(sKey) + "')?$expand=items",
                    "GET"
                )
            ]);
            this.oDataModel.submitBatch(
                fndone,
                this.errorSubmitBatch,
                true
            );
        },

        delPersCOContainer: function (sKey, fndone) {
            // "always post", get data from model, then post it :-)
            this.oDataModel.addBatchChangeOperations([
                this.oDataModel.createBatchOperation(
                    "/containers(Containertype='',Containerid='" + encodeURI(sKey) + "')",
                    "DELETE"
                )
            ]);
            this.oDataModel.submitBatch(
                fndone,
                fndone, //we also delete on fail ! this.errorSubmitBatch,
                true
            );
        },

        onLoadPers: function () {
            var that = this,
                arr = this.generateKeys(),
                noRecords = arr.length,
                time = new Date(),
                i = 0;
            this.fn = function () {
                var key;
                if (arr.length === 0) {
                    return;
                }
                key = arr[0].name;
                arr.splice(0, 1);
                this.oPersonalizationService.getContainer(key,
                    { validity: this._getContainerValidity() }, this.getMyComponent())
                    .done(function (oContainer) {
                        jQuery.sap.log.warning("got container '" + key + "'");
                        that.setTime(arr.length, noRecords, time);
                        that.fn();
                    }).fail(function (sError) {
                        jQuery.sap.log.error("Failed to create container '" + key + "': " + sError);
                    });
            };
            that.fn();
        },

        onWritePers: function () {
            var that = this,
                arr = this.generateKeys(),
                noRecords = arr.length,
                time = new Date(),
                i = 0;
            this.fn = function () {
                var key;
                if (arr.length === 0) {
                    return;
                }
                key = arr[0].name;
                arr.splice(0, 1);
                this.oPersonalizationService.getContainer(key,
                    { validity: this._getContainerValidity() }, this.getMyComponent())
                    .done(function (oContainer) {
                        var a;
                        jQuery.sap.log.info("Created new container '" + key + "'");
                        for (a in that.oObj) {
                            if (that.oObj.hasOwnProperty(a)) {
                                oContainer.setItemValue(String(a), "Fiori rocks" + new Date() + " " + that.oObj[a]);
                            }
                        }
                        oContainer.setItemValue("Item2", "Fiori rocks" + new Date());
                        oContainer.setItemValue("Item3", "Fiori rocks" + new Date());
                        oContainer.setItemValue("Item4", "Fiori rocks" + new Date());
                        oContainer.save().done(function () {
                            that.setTime(arr.length, noRecords, time);
                            that.fn();
                        });
                    }).fail(function (sError) {
                        jQuery.sap.log.error("Failed to create container '" + key + "': " + sError);
                    });
            };
            that.fn();
        },

        onDelPers: function () {
            var that = this,
                arr = this.generateKeys(),
                noRecords = arr.length,
                time = new Date(),
                i = 0;
            this.fn = function () {
                var key;
                if (arr.length === 0) {
                    return;
                }
                key = arr[0].name;
                arr.splice(0, 1);
                this.oPersonalizationService.delContainer(key,
                    { validity: this._getContainerValidity() }, this.getMyComponent())
                    .done(function (oContainer) {
                        var a;
                        jQuery.sap.log.info("Delete container '" + key + "'");
                        that.setTime(arr.length, noRecords, time);
                        that.fn();
                    }).fail(function (sError) {
                        jQuery.sap.log.error("Failed to delete container '" + key + "': " + sError);
                    });
            };
            that.fn();
        },

        onWritePersCO: function () {
            var that = this,
                arr = this.generateKeys(),
                noRecords = arr.length,
                time = new Date(),
                i = 0;
            this.fn = function () {
                var key;
                if (arr.length === 0) {
                    return;
                }
                key = arr[0].name;
                arr.splice(0, 1);
                that.savePersCOContainer(key, function () {
                    that.setTime(arr.length, noRecords, time);
                    that.fn();
                });
            };
            that.fn();
        },

        onLoadPersCO: function () {
            var that = this,
                arr = this.generateKeys(),
                noRecords = arr.length,
                time = new Date(),
                i = 0;
            this.fn = function () {
                var key;
                if (arr.length === 0) {
                    return;
                }
                key = arr[0].name;
                arr.splice(0, 1);
                that.readPersCOContainer(key, function () {
                    that.setTime(arr.length, noRecords, time);
                    that.fn();
                });
            };
            that.fn();
        },

        onDelPersCO: function () {
            var that = this,
                arr = this.generateKeys(),
                noRecords = arr.length,
                time = new Date(),
                i = 0;
            this.fn = function () {
                var key;
                if (arr.length === 0) {
                    return;
                }
                key = arr[0].name;
                arr.splice(0, 1);
                that.delPersCOContainer(key, function () {
                    that.setTime(arr.length, noRecords, time);
                    that.fn();
                });
            };
            that.fn();
        },

        /**
         * Called when "Load" button in the Container life cycle test panel is pressed
         */
        onLoadContainer: function () {
            var that = this,
                sContainerName = this.oModel.getProperty("/ContainerName"),
                aItemKeys,
                sStringVal,
                bJSONFormat,
                aContainerItems = [];

            if (!sContainerName) {
                sap.m.MessageBox.alert("Enter a container name");
                return;
            }

            this.oDataModel.addBatchReadOperations([
                this.oDataModel.createBatchOperation(
                    "/containers(Containertype='',Containerid='" + encodeURI(sContainerName) + "')?$expand=items",
                    "GET"
                )]);
            this.oDataModel.submitBatch(
                function (oContainer) {
                    var aContainers,
                        i,
                        oVal,
                        j;
                    jQuery.sap.log.info("Loaded container '" + sContainerName + "': " + (oContainer ? oContainer.toString() : oContainer));
                    if (oContainer) {
                        that.oContainer = oContainer;
                        that.oModel.setProperty("/ContainerLoaded", true);
                        aItemKeys = that.oDataModel.getProperty("/containers");
                        aItemKeys = that.oDataModel.getProperty("/containers(Containertype='',Containerid='ABC')");
                        aContainers = that.oDataModel.getProperty("/containers");
                        for (j = 0; j < aContainers.length; j = j + 1) {
                            if (aContainers.getProperty('Containerid') === sContainerName) {
                                for (i = 0; i < aItemKeys.length; i = i + 1) {
                                    oVal = that.oDataModel.getProperty("/items(Containertype='',Containerid='ABC',key='" + aItemKeys[i] + "')");
                                    if (typeof oVal === "string") {
                                        sStringVal = oVal;
                                        bJSONFormat = false;
                                    } else {
                                        sStringVal = JSON.stringify(oVal);
                                        bJSONFormat = true;
                                    }
                                    aContainerItems[i] = { Key: aItemKeys[i], Value: sStringVal, JSON: bJSONFormat };
                                }
                            }
                            that.oModel.setProperty("/ContainerItems", aContainerItems);
                        }
                    }
                },
                this.errorSubmitBatch,
                true
            );
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
                obj,
                aContainerItems = [];

            obj = {
                "Containertype": "P",
                "Containerid": "ABC",
                "Changedat": "\/Date(1402911849000)\/",
                "Expiredat": "\/Date(1401109666000)\/",
                "Achcomponent": "SCM-BAS-DF",
                "Validity": 30,
                "Changedby": "FORSTMANN",
                "items": [
                    {
                        "Itemvalue": "11",
                        "Itemid": "ITEM#ITEM1",
                        "Itemtype": "",
                        "Containerid": "ABC",
                        "Containertype": ""
                    }, {
                        "Itemvalue": "3REALLLYCLIENTDF",
                        "Itemid": "ITEM#ITEM2",
                        "Itemtype": "",
                        "Containerid": "ABC",
                        "Containertype": ""
                    }
                ]
            };
            // "always post", get data from model, then post it :-)
            this.oDataModel.addBatchChangeOperations([
                this.oDataModel.createBatchOperation(
                    "/containers",
                    "POST",
                    obj
                )
            ]);
            this.oDataModel.submitBatch(this.successSubmitBatch, this.errorSubmitBatch, true);
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
