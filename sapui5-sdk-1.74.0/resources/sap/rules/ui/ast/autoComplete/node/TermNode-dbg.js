sap.ui.define(["sap/rules/ui/ast/autoComplete/node/BaseNode",
    "sap/rules/ui/ast/constants/Constants"], function (BaseNode, Constants) {
        "use strict";


        var TermNode = function () {
            BaseNode.apply(this, arguments);
            this._id = null;
            this._businessDataType = null;
            this._dataObjectType = null;
        };

        TermNode.prototype = new BaseNode();
        TermNode.prototype.constructor = BaseNode;

        TermNode.prototype.getId = function () {
            return this._id;
        };

        TermNode.prototype.setId = function (id) {
            this._id = id;
            return this;
        };

        TermNode.prototype.getBusinessDataType = function () {
            return this._businessDataType;
        };

        TermNode.prototype.setBusinessDataType = function (businessDataType) {
            this._businessDataType = businessDataType;
            return this;
        };

        TermNode.prototype.getDataObjectType = function () {
            return this._dataObjectType;
        };

        TermNode.prototype.setDataObjectType = function (dataObjectType) {
            this._dataObjectType = dataObjectType;
            return this;
        };

        TermNode.prototype.getNodeType = function () {
            return Constants.TERMNODE;
        };

        return TermNode;

    }, true);