// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/model/SimpleType"
], function (SimpleType) {
    "use strict";

    return SimpleType.extend("sap.ushell.applications.PageComposer.controller.CustomString", {
        // called first, with the user's input
        parseValue: function (sValue) {
            return sValue.toUpperCase();
        },

        // called with "parseValue()" return value
        validateValue: function (sValue) {
            return undefined;
        },

        // called with "parseValue()" return value, returns what should be displayed
        formatValue: function (sValue) {
            return sValue;
        }
    });
});
