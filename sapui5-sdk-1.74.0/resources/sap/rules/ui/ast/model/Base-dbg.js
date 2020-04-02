sap.ui.define([], function () {
    'use strict';
    // Allowed Databject types
    // S - Struture
    // T - Table
    // E - Element

    // BusinessDataTypes Supported
    // B - Boolean
    // D - Date and TimeStamp
    // T - Time
    // N - Number
    // S - String
    // TS - TimeSpan

    var Base = function () {
        this._name = null;
        this._label = null;
        this._numberOfArguments = 0;
        this._category = null;
        // Bussiness/DataObject Return Type
        this._returnValueBussinessDataTypeCollection = null;
        this._returnValueDataObjecteTypeCollection = null;
    };

    Base.prototype._basicSetterValuesValidation = function (setterValue) {
        if (setterValue === null && name === undefined) {
            //TODO :: throw exception
        }
    }

    Base.prototype.setName = function (name) {
        this._basicSetterValuesValidation(name);
        this._name = name;
        return this;
    };

    Base.prototype.getName = function () {
        return this._name;
    };

    Base.prototype.setLabel = function (label) {
        this._label = label;
        return this;
    };

    Base.prototype.getLabel = function () {
        return this._label;
    };

    Base.prototype.setCategory = function (category) {
        this._category = category;
        return this;
    };

    Base.prototype.getCategory = function () {
        return this._category;
    };

    Base.prototype.setNumberOfArguments = function (numberOfArguments) {
        this._basicSetterValuesValidation(numberOfArguments);
        this._numberOfArguments = numberOfArguments;
        return this;
    };

    Base.prototype.getNumberOfArguments = function () {
        return this._numberOfArguments;
    };

    Base.prototype.setReturnValueBussinessDataTypeCollection = function (returnValueBusinessDataTypeCollectionValues) {
        this._basicSetterValuesValidation(returnValueBusinessDataTypeCollectionValues);
        this._returnValueBussinessDataTypeCollection = returnValueBusinessDataTypeCollectionValues;
        return this;
    };

    Base.prototype.getReturnValueBussinessDataTypeCollection = function () {
        return this._returnValueBussinessDataTypeCollection;
    };

    Base.prototype.setReturnValueDataObjectTypeCollection = function (returnValueDataObjectTypeCollectionValues) {
        this._basicSetterValuesValidation(returnValueDataObjectTypeCollectionValues);
        this._returnValueDataObjecteTypeCollection = returnValueDataObjectTypeCollectionValues;
        return this;
    };

    Base.prototype.getReturnValueDataObjectTypeCollection = function () {
        return this._returnValueDataObjecteTypeCollection;
    };

    return Base;



});
