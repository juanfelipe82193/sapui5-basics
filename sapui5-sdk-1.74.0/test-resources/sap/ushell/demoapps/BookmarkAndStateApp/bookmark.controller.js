// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/thirdparty/jquery"
], function (jQuery) {
    "use strict";

    var sXKey,
        sIKey;

    sap.ui.controller("sap.ushell.demo.bookmarkstate.bookmark", {

        onInit: function () {
            var sHash = window.hasher && window.hasher.getHash(),
                aParams,
                oView = this.getView();

            oView.byId("txtXAppState").setValue("{\"a\":1, \"b\":2, \"c\":3, \"d\":4}");
            oView.byId("txtIAppState").setValue("This is a dummy state string");

            sXKey = undefined;
            sIKey = undefined;

            if (sHash && sHash.length > 0 && sHash.indexOf("sap-xapp-state=") > 0) {
                aParams = /(?:sap-xapp-state=)([^&/]+)/.exec(sHash);
                if (aParams && aParams.length === 2) {
                    sXKey = aParams[1];
                }
                aParams = /(?:sap-iapp-state=)([^&/]+)/.exec(sHash);
                if (aParams && aParams.length === 2) {
                    sIKey = aParams[1];
                }
            }

            this._loadStateData();
        },

        onCreateSaveStateTransient: function () {
            this.onCreateSaveState(true);
        },

        onCreateSaveStatePersistent: function () {
            this.onCreateSaveState(false);
        },

        onCreateSaveState: function (bTransient) {
            var oService = sap.ushell.Container.getService("AppState"),
                oState,
                sKey1,
                sKey2,
                oView = this.getView(),
                sHash;

            if (sXKey) {
                Promise.all([
                    oService.getAppState(sXKey),
                    oService.getAppState(sIKey)
                ]).then(function (values) {
                    var oXState = values[0],
                        oIState = values[1],
                        oNewXState = oService.createEmptyAppState(undefined, bTransient),
                        oNewIState = oService.createEmptyAppState(undefined, bTransient);

                    oNewXState._sKey = oXState._sKey;
                    oNewXState._iPersistencyMethod = "PersonalState";
                    oNewXState._oPersistencySettings = undefined;
                    oNewXState.setData(oView.byId("txtXAppState").getValue());
                    oNewXState.save();

                    oNewIState._sKey = oIState._sKey;
                    oNewIState._iPersistencyMethod = "PersonalState";
                    oNewIState._oPersistencySettings = undefined;
                    oNewIState.setData(oView.byId("txtIAppState").getValue());
                    oNewIState.save();
                });
            } else {
                oState = oService.createEmptyAppState(undefined, bTransient);
                oState.setData(oView.byId("txtXAppState").getValue());
                oState.save();
                sXKey = oState.getKey();
                oState = oService.createEmptyAppState(undefined, bTransient);
                oState.setData(oView.byId("txtIAppState").getValue());
                oState.save();
                sIKey = oState.getKey();

                sHash = window.hasher.getHash().split("&/")[0];
                sHash += "&/sap-xapp-state=" + sXKey + "/sap-iapp-state=" + sIKey;
                window.hasher.replaceHash(sHash);
            }
        },

        onLoadStateData: function () {
            this._showStateDataInCtrl(sXKey, "txtXAppStateRead");
            this._showStateDataInCtrl(sIKey, "txtIAppStateRead");
        },

        onDeleteStateData: function () {
            var oService = sap.ushell.Container.getService("AppState"),
                that = this;

            if (sXKey) {
                Promise.all([
                    oService.deleteAppState(sXKey),
                    oService.deleteAppState(sIKey)
                ]).then(function (values) {
                    that._loadStateData().then(function() {
                        sXKey = undefined;
                        sIKey = undefined;
                        window.hasher.replaceHash(window.hasher.getHash().split("&/")[0]);
                    });
                });
            }
        },

        _loadStateData: function () {
            var oDeferred = new jQuery.Deferred(),
                that = this;

            Promise.all([
                that._showStateDataInCtrl(sXKey, "txtXAppStateRead"),
                that._showStateDataInCtrl(sIKey, "txtIAppStateRead")
            ]).then(function () {
                oDeferred.resolve();
            });

            return oDeferred.promise();
        },

        _showStateDataInCtrl: function (sKey, sCtrlId) {
            var oDeferred = new jQuery.Deferred(),
                oService = sap.ushell.Container.getService("CrossApplicationNavigation"),
                oView = this.getView(),
                oEditCtrl = oView.byId(sCtrlId);

            if (sKey) {
                oService.getAppStateData(sKey).then(function (sValue) {
                    if (sValue === undefined) {
                        oEditCtrl.setValue("[ERROR] no value found for state key " + sKey);
                    } else if (typeof sValue === "string") {
                        oEditCtrl.setValue(sValue);
                    } else {
                        try {
                            oEditCtrl.setValue(JSON.stringify(sValue));
                        } catch (oError) {
                            oEditCtrl.setValue("[ERROR] value of state key " + sKey + " could not be converted to string");
                        }
                    }
                    oDeferred.resolve();
                });
            } else {
                oEditCtrl.setValue("[INFO] state key found in URL");
                oDeferred.resolve();
            }
            return oDeferred.promise();
        },

        sendAsEmailS4: function () {
            "use strict";
            sap.m.URLHelper.triggerEmail(
                null,
                "This is the email of FLP",
                document.URL
            );
        }
    });
}, false);