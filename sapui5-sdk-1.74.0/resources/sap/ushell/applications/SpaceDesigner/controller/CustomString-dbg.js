// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/model/SimpleType"
], function (SimpleType) {
    "use strict";

    return SimpleType.extend("sap.ushell.applications.SpaceDesigner.controller.CustomString", {
        formatValue: function (sValue) {
            return sValue;
        },

        parseValue: function (sValue) {
            return sValue.toUpperCase();
        },

        validateValue: function (sValue) {
        }
    });
});