// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview pure utility functions for modules of <code>URLTemplateProcessor</code>
 *
 * @version 1.74.0
 *
 * @private
 */

sap.ui.define([
    "sap/ushell/utils/type"
], function (oType) {
    "use strict";

    function hasValue (vValue) {
        return vValue !== null && typeof vValue !== "undefined";
    }

    function removeArrayParameterNotation (oParams) {
        return Object.keys(oParams).reduce(function (o, sParamName) {
            var vParamValue = oParams[sParamName];
            if (Object.prototype.toString.apply(vParamValue) === "[object Array]") {
                o[sParamName] = vParamValue[0];
            } else if (typeof vParamValue === "string") {
                o[sParamName] = vParamValue;
            } else {
                throw new Error("Parameters should be passed as strings or array of strings");
            }

            return o;
        }, {});
    }


    return {
        hasValue: hasValue,
        removeArrayParameterNotation: removeArrayParameterNotation
    };

}, false /* bExport */);
