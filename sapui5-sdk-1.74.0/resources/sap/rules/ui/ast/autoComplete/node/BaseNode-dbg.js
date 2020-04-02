sap.ui.define(function () {
    "use strict";

    var BaseNode = function () {
        // By Default all data types should be part of probableBusinessdataReturnType
        //this._probableBusinessDataReturnType = [];
        //this._probableDataObjectReturnTypeMap = [];
        this._name = "";
        this._label = "";
        this._previous = null;

    };

    BaseNode.prototype.getName = function () {
        return this._name;
    };


    BaseNode.prototype.setName = function (name) {
        this._name = name;
        return this;
    };

    BaseNode.prototype.setLabel = function (label) {
        this._label = label;
        return this;
    };

    BaseNode.prototype.getLabel = function () {
        return this._label;

    };

    BaseNode.prototype.setPrevious = function (previous) {
        this._previous = previous;
        return this;
    };

    BaseNode.prototype.getPrevious = function () {
        return this._previous;

    };

    return BaseNode;

}, true);