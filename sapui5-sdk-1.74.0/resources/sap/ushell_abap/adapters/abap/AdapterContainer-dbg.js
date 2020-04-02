// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/util/ObjectPath",
    "sap/base/Log",
    "sap/ui/thirdparty/jquery",
    "sap/ui/core/format/DateFormat"
], function (ObjectPath, Log, jQuery, DateFormat) {
    "use strict";

    var sCONTAINERCOLLECTIONNAME = "PersContainers",
        sABAPTIMESTAMPFORMAT = "yyyyMMddHHmmss",
        sInitialStorage = new Date(9999, 1, 1, 0, 0, 0),
        sInitialExpire = new Date(9999, 1, 1, 0, 0, 0, 0),
        sITEM_KEY_ADMIN_EXPIRE = "ADMIN#sap-ushell-container-expireUTCTimestamp",
        sITEM_KEY_ADMIN_STORAGEUTC = "ADMIN#sap-ushell-container-storageUTCTimestamp",
        sITEM_KEY_ADMIN_SCOPE = "ADMIN#sap-ushell-container-scope";

    function rectifyKey (sContainerKey) {
        var sCONTAINER_KEY_PREFIX = "sap.ushell.personalization#";
        if (sContainerKey.substring(0, sCONTAINER_KEY_PREFIX.length) !== sCONTAINER_KEY_PREFIX) {
            Log.error("Unexpected ContainerKey " + sContainerKey);
            return sContainerKey;
        }
        return sContainerKey.substring(sCONTAINER_KEY_PREFIX.length, sCONTAINER_KEY_PREFIX.length + 40);
    }

    var AdapterContainer = function (sContainerKey, oService, oScope, sAppName) {
        this._oService = oService;
        this._oScope = oScope;
        this["sap-cache-id"] = ObjectPath.get("_oService._oConfig.services.personalization.cacheId", this);

        this._sContainerKey = rectifyKey(sContainerKey);
        this._sAppName = sAppName || "";

        var PersonalizationAdapter = sap.ui.require("sap/ushell_abap/adapters/abap/PersonalizationAdapter");
        if (PersonalizationAdapter) {
            // Determine category resulting out of possible scope flag combinations
            this._category = PersonalizationAdapter.prototype._determineCategory(oScope);
        }

        this._oJSONContainer = {
            "category": this._category,
            "clientExpirationTime": sInitialExpire,
            "appName": this._sAppName,
            "component": "", // csn component
            "id": this._sContainerKey,
            PersContainerItems: []
        };
        this._oPropertyBag = {};
        this._aOperationQueue = [];
    };

    /**
     * Resets the container item values to initial ( retaining key, validity, etc!)
     */
    AdapterContainer.prototype._reset = function () {
        this._oJSONContainer.PersContainerItems = [];
    };

    AdapterContainer.prototype._obtainODataWrapper = function () {
        return this._oService._oWrapper;
    };

    // loads data from backend, when done, oPropertyBag contains the items
    AdapterContainer.prototype.load = function () {
        var oDeferred = new jQuery.Deferred(),
            that = this,
            oDataWrapper = this._obtainODataWrapper(),
            // load container data with _sContainerKey data into _oPoprertyBag
            sRelativeUrl = sCONTAINERCOLLECTIONNAME + "(category='" + this._category + "',id='" + encodeURIComponent(this._sContainerKey) + "')?$expand=PersContainerItems";
        if (this._category && this._category === "P" && this["sap-cache-id"]) {
            sRelativeUrl = sRelativeUrl + "&sap-cache-id=" + this["sap-cache-id"];
        }
        sap.ui2.srvc.ODataService.call(this, oDataWrapper, function () {
            return false;
        });

        oDataWrapper.read(sRelativeUrl, function (oData) {
            // TODO : align container id?
            that._oJSONContainer = oData;
            // overwrite key and category, do not trust server response
            that._oJSONContainer.category = that._category;
            that._oJSONContainer.id = that._sContainerKey;
            that._oJSONContainer.appName = that._sAppName;
            // response contains items.results (!)
            that._oJSONContainer.PersContainerItems = (that._oJSONContainer.PersContainerItems && that._oJSONContainer.PersContainerItems.results) || [];
            oDeferred.resolve(that);
        }, function (sErrorMessage) {
            Log.warning(sErrorMessage);
            // load errors are ok (at least 404), return empty(!) container
            that._reset();
            oDeferred.resolve(that);
        });
        return oDeferred.promise();
    };

    AdapterContainer.prototype.save = function () {
        var oDeferred = new jQuery.Deferred(),
            that = this,
            oDataWrapper = this._obtainODataWrapper(),
            sRelativeURL = sCONTAINERCOLLECTIONNAME;
        // serialize the current JSON
        sap.ui2.srvc.ODataService.call(this, oDataWrapper, function () {
            return false;
        });

        oDataWrapper.create(sRelativeURL, this._oJSONContainer, function (/*response*/) {
            oDeferred.resolve(that);
        }, function (sErrorMessage) {
            oDeferred.reject(sErrorMessage);
        });
        return oDeferred.promise();
    };

    AdapterContainer.prototype.del = function () {
        var oDeferred = new jQuery.Deferred(),
            that = this,
            oDataWrapper = this._obtainODataWrapper(),
            sRelativeURL = sCONTAINERCOLLECTIONNAME + "(category='" + this._category + "',id='" + encodeURIComponent(this._sContainerKey) + "')";
        // serialize the current JSON
        sap.ui2.srvc.ODataService.call(this, oDataWrapper, function () {
            return false;
        });

        oDataWrapper.del(sRelativeURL, function (response) {
            oDeferred.resolve(that);
        }, function (sErrorMessage) {
            oDeferred.reject(sErrorMessage);
        });
        this._reset();
        return oDeferred.promise();
    };

    AdapterContainer.prototype.getItemKeys = function () {
        var res = [];
        // collect item names from types
        this._oJSONContainer.PersContainerItems.forEach(function (oMember) {
            if (oMember.category === "V") {
                res.push("VARIANTSET#" + oMember.id);
            } else if (oMember.category === "I") {
                res.push("ITEM#" + oMember.id);
            }
        });
        // add "artifical item names if present
        if (this._oJSONContainer.validity >= 0) {
            res.push(sITEM_KEY_ADMIN_STORAGEUTC);
            res.push(sITEM_KEY_ADMIN_EXPIRE);
            res.push(sITEM_KEY_ADMIN_SCOPE);
        }
        return res;
    };
    AdapterContainer.prototype.containsItem = function (sItemKey) {
        return this.getItemKeys().indexOf(sItemKey) >= 0;
    };

    function fnABAPDateToEDMDate (sABAPDate) {
        if (sABAPDate === undefined || sABAPDate === null) {
            return null;
        }
        var oFormatter = DateFormat.getDateInstance({ pattern: sABAPTIMESTAMPFORMAT });
        return oFormatter.parse(JSON.parse(sABAPDate), true);
    }

    function fnEDMDateToABAPDate (oDate) {
        var oFormatter = DateFormat.getDateInstance({ pattern: sABAPTIMESTAMPFORMAT });
        if (oDate === null) {
            oDate = sInitialExpire;
        }
        if (typeof oDate === "string") {
            if (/\/Date\(([0-9]+)\)\//.exec(oDate)) {
                oDate = new Date(parseInt(/\/Date\(([0-9]+)\)\//.exec(oDate)[1], 10));
            } else {
                Log.error("Expected Date format " + oDate);
            }
        }
        // beware, Date comparision returns false, use + to compare the milliseconds values (!)
        if (+oDate === +sInitialExpire) {
            // undefined is mapped to sInitialExpire in ABAP OData representation
            return undefined;
        }
        return oFormatter.format(oDate, true);
    }

    AdapterContainer.prototype._findItemIndex = function (sItemId, sCategory) {
        var i;
        for (i = 0; i < this._oJSONContainer.PersContainerItems.length; i = i + 1) {
            if (this._oJSONContainer.PersContainerItems[i].id === sItemId && this._oJSONContainer.PersContainerItems[i].category === sCategory) {
                return i;
            }
        }
        return undefined;
    };

    /**
     * Locates an item for the key sItemKey,
     * returns { index : nr,  TrueItemKey : truekey,  containerProperty : }
     * either trueKey xor containerProperty is set.
     * index is filled iff it is a present item
     */
    AdapterContainer.prototype._locateItem = function (sItemKey) {
        var res = { index: -1 };
        if (sItemKey === sITEM_KEY_ADMIN_EXPIRE) {
            return {
                containerProperty: "clientExpirationTime",
                initialValue: sInitialExpire,
                convToABAP: fnABAPDateToEDMDate,
                convFromABAP: fnEDMDateToABAPDate
            };
        }
        if (sItemKey === sITEM_KEY_ADMIN_SCOPE) {
            // extract validity, and save as scope property
            return {
                containerProperty: "validity",
                initialValue: 0,
                convToABAP: function (oArg) {
                    if (!oArg) {
                        return null;
                    }
                    return JSON.parse(oArg).validity;
                },
                convFromABAP: function (oValue, oItem) {
                    if (oValue <= 0) {
                        return undefined;
                    }
                    oItem = oItem || {};
                    oItem.validity = oValue;
                    return oItem;
                }
                //// with the following lines uncommented, scope would be serialized as item 'A' 'scope' in addition!
                // currently in ABAP, only validity is stored in the Container Header
                // trueItemKey : "scope",
                // category : "A",
                // index : this._findItemIndex("scope", "A")
            };
        }
        // this is no longer present !
        if (sItemKey === sITEM_KEY_ADMIN_STORAGEUTC) {
            return {
                containerProperty: " ignore", // ChangedatNOLONGERPRESENT",
                initialValue: sInitialStorage,
                convToABAP: fnABAPDateToEDMDate,
                convFromABAP: fnEDMDateToABAPDate
            };
        }
        // Remove prefix, mapping into category,
        // Strip prefix from itemkey and truncate to 40 effective characters
        if (sItemKey.indexOf("ITEM#") === 0) {
            res.trueItemKey = sItemKey.substring("ITEM#".length, "ITEM#".length + 40);
            res.category = "I";
        } else if (sItemKey.indexOf("VARIANTSET#") === 0) {
            res.trueItemKey = sItemKey.substring("VARIANTSET#".length, "VARIANTSET#".length + 40);
            res.category = "V";
        } else if (sItemKey.indexOf("ADMIN#") !== 0) {
            Log.error("Unknown itemkey prefix" + sItemKey);
        }
        res.index = this._findItemIndex(res.trueItemKey, res.category);
        return res;
    };

    AdapterContainer.prototype.getItemValue = function (sItemKey) {
        var sItemValue = "",
            oItemValue,
            oItemRef = this._locateItem(sItemKey);
        if (oItemRef.containerProperty === " ignore") {
            return undefined; // not present in persistence
        }
        if (oItemRef.index >= 0) {
            sItemValue = this._oJSONContainer.PersContainerItems[oItemRef.index].value;
            try {
                oItemValue = JSON.parse(sItemValue);
            } catch (e) {
                // Workaround for
                // GW Bug "true" => "X" and false => "" at the backend
                // can be removed once Correction of Note 2013368 is implemented in landscape
                if (sItemValue === "X") {
                    oItemValue = true;
                } else {
                    oItemValue = undefined;
                }
            }
        }
        if (oItemRef.containerProperty) {
            if (typeof oItemRef.convFromABAP === "function") {
                return oItemRef.convFromABAP(this._oJSONContainer[oItemRef.containerProperty], oItemValue); // TODO Conversion!
            }
            return this._oJSONContainer[oItemRef.containerProperty];
        }
        return oItemValue;
    };

    /**
     * set oItemValue under sItemKey
     * returns undefined
     */
    AdapterContainer.prototype.setItemValue = function (sItemKey, oItemValue) {
        var sItemValue = JSON.stringify(oItemValue),
            oItemRef = this._locateItem(sItemKey);
        if (oItemRef.containerProperty === " ignore") {
            return; // not present in persistence
        }
        if (oItemRef.containerProperty) {
            if (typeof oItemRef.convToABAP === "function") {
                this._oJSONContainer[oItemRef.containerProperty] = oItemRef.convToABAP(sItemValue); // TODO Conversion!
            } else {
                this._oJSONContainer[oItemRef.containerProperty] = sItemValue; // TODO Conversion!
            }
            if (!oItemRef.trueItemKey) {
                return;
            }
        }
        if (oItemRef.index >= 0) {
            this._oJSONContainer.PersContainerItems[oItemRef.index].value = sItemValue;
            return;
        }
        // not yet present
        this._oJSONContainer.PersContainerItems.push({
            "value": sItemValue,
            "id": oItemRef.trueItemKey,
            "category": oItemRef.category,
            "containerId": this._sContainerKey,
            "containerCategory": this._category
        });
    };

    /**
     * delete (1st) item with key sItemKey
     */
    AdapterContainer.prototype.delItem = function (sItemKey) {
        var oItemRef = this._locateItem(sItemKey);
        if (oItemRef.containerProperty === " ignore") {
            return; // not present in persistence
        }
        if (oItemRef.containerProperty) {
            this._oJSONContainer[oItemRef.containerProperty] = oItemRef.initialValue;
            return;
        }
        if (oItemRef.index >= 0) {
            this._oJSONContainer.PersContainerItems.splice(oItemRef.index, 1);
            return;
        }
        // TODO throw?
    };

    return AdapterContainer;
}, true /* bExport */);
