sap.ui.define([
    "sap/ushell/utils"
], function (utils) {
    "use strict";

    var AdapterContainerMock = function (sContainerKey) {
        this._sContainerKey = sContainerKey;
        this._oItemMap = new utils.Map();
        this._oErrorMap = new utils.Map();
    };

    AdapterContainerMock.prototype.load = function () {
        var oDeferred = new jQuery.Deferred();
        if (this._oErrorMap.get(this._sContainerKey)) {
            oDeferred.reject();
        } else {
            oDeferred.resolve();
        }
        return oDeferred.promise();
    };

    AdapterContainerMock.prototype.save = function () {
        var oDeferred = new jQuery.Deferred();
        if (this._oErrorMap.get(this._sContainerKey)) {
            oDeferred.reject();
        } else {
            oDeferred.resolve();
        }
        return oDeferred.promise();
    };

    AdapterContainerMock.prototype.getItemKeys = function () {
        return this._oItemMap.keys();
    };

    AdapterContainerMock.prototype.containsItem = function (sItemKey) {
        return this._oItemMap.containsKey(sItemKey);
    };

    AdapterContainerMock.prototype.getItemValue = function (sItemKey) {
        return this._oItemMap.get(sItemKey);
    };

    AdapterContainerMock.prototype.setItemValue = function (sItemKey, oItemValue) {
        this._oItemMap.put(sItemKey, oItemValue);
    };

    AdapterContainerMock.prototype.delItem = function (sItemKey) {
        this._oItemMap.remove(sItemKey);
    };

    return AdapterContainerMock;

}, false /* bExport */);
