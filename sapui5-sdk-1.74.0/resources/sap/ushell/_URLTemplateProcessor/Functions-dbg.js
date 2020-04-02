// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview contains methods to parse and execute functions defined for
 * the URL Template parameter language.
 *
 * @version 1.74.0
 *
 * @private
 */

sap.ui.define([
    "sap/ushell/utils/type",
    "sap/ushell/utils/clone",
    "sap/ushell/_URLTemplateProcessor/utils",
    "sap/ui/thirdparty/URI"
], function (oType, fnClone, oUtils, URI) {
    "use strict";

    var O_FUNCTION = {
        url: {
            args: ["urlPart?"],
            minValues: 0,
            maxValues: 0,
            fn: function (oArgs) {
                var oURL = new URI();
                var aAllowedPartArg = [
                    "protocol",
                    "scheme",
                    "username",
                    "password",
                    "hostname",
                    "port",
                    "host",
                    "userinfo",
                    "authority",
                    "origin",
                    "subdomain",
                    "domain",
                    "tld",
                    "pathname",
                    "path",
                    "directory",
                    "filename",
                    "suffix",
                    "search",
                    "query",
                    "hash",
                    "fragment",
                    "resource"
                ];

                var sMethod = "toString";
                if (oArgs.urlPart) {
                    if (aAllowedPartArg.indexOf(oArgs.urlPart) === -1) {
                        throw new Error("The URL part '" + oArgs.urlPart + "' is not valid. Please use one of " + aAllowedPartArg.join(", "));
                    }
                    sMethod = oArgs.urlPart;
                }

                return oURL[sMethod]();
            }
        },
        if: {
            args: ["trueCondition"],
            minValues: 1,
            maxValues: 2,
            fn: function (oArgs, vValues) {

                var aValues = getValuesAsArray(vValues);

                if (isEmpty(oArgs.trueCondition)) {
                    return aValues.length === 1
                        ? undefined
                        : aValues.pop();
                }

                return aValues[0];
            }
        },
        and: {
            args: ["emptyCondition?"],
            minValues: 1,
            fn: function (oArgs, vValues) {

                var aValues = getValuesAsArray(vValues);

                if (typeof oArgs.emptyCondition === "undefined" && oArgs.length > 0) {
                    return undefined;
                }

                if (typeof oArgs.emptyCondition !== "undefined" && isEmpty(oArgs.emptyCondition)) {
                    return undefined;
                }

                var sLastValue = aValues.pop();
                var bAllValuesDefined = aValues.every(oUtils.hasValue);
                return bAllValuesDefined
                    ? sLastValue
                    : undefined;
            }
        },
        or: {
            args: ["emptyCondition?"],
            minValues: 1,
            fn: function (oArgs, vValues) {
                var aValues = getValuesAsArray(vValues);

                if (typeof oArgs.emptyCondition === "undefined" && oArgs.length > 0) {
                    return undefined;
                }
                if (typeof oArgs.emptyCondition !== "undefined" && isEmpty(oArgs.emptyCondition)) {
                    return undefined;
                }

                return aValues.reduce(function (sPreviousVal, sNextVal) {
                    if (oUtils.hasValue(sPreviousVal)) {
                        return sPreviousVal;
                    }
                    return oUtils.hasValue(sNextVal)
                        ? sNextVal
                        : undefined;
                });
            }
        },
        join: {
            args: ["macroSeparator?", "microSeparator?"],
            minValues: 1,
            fnPipe: function (oArgs, oValues) {
                var aValues = [oValues];
                return O_FUNCTION.join.fn.call(this, oArgs, aValues);
            },
            fn: function (oArgs, aValues) {
                var sMacroSeparator = oArgs.macroSeparator || "";
                var sMicroSeparator = oArgs.microSeparator || "";

                aValues = aValues.map(function (vSimpleOrComplex) {
                    if (!oType.isPlainObject(vSimpleOrComplex) && !oType.isArray(vSimpleOrComplex)) {
                        return vSimpleOrComplex;
                    }

                    var sType = Object.prototype.toString.apply(vSimpleOrComplex);

                    if (sType === "[object Object]") {
                        var aSanitizedParameters = oUtils.removeArrayParameterNotation(vSimpleOrComplex);
                        return Object.keys(aSanitizedParameters).sort().map(function (sKey) {
                            return sKey + sMicroSeparator + vSimpleOrComplex[sKey];
                        }).join(sMacroSeparator);
                    }

                    if (sType === "[object Array]") {
                        return vSimpleOrComplex.join(sMacroSeparator);
                    }
                });

                return aValues.join(sMacroSeparator);
            }
        },
        match: {
            args: ["strRegex"],
            minValues: 1,
            fnPipe: function (oArgs, oValues) {
                var sStrRegex = oArgs.strRegex;
                var rRegex = new RegExp(sStrRegex);
                return Object.keys(oValues).reduce(function (o, sNextKey) {
                    if (rRegex.exec(sNextKey)) {
                        o[sNextKey] = oValues[sNextKey];
                    }
                    return o;
                }, {});
            },
            fn: function (oArgs, aValues) {
                if (aValues === undefined) {
                    // nothing matches nothing
                    return undefined;
                }

                var sStrRegex = oArgs.strRegex;
                var rRegex = new RegExp(sStrRegex);

                var aMatchedValues = aValues.filter(function (vValue) {
                    var aInnerValues;
                    if (oType.isPlainObject(vValue)) {
                        // there is at least one key matching
                        aInnerValues = Object.keys(vValue);
                    } else if (oType.isArray(vValue)) {
                        aInnerValues = vValue;
                    } else {
                        aInnerValues = ["" + vValue];
                    }

                    return aInnerValues.some(rRegex.exec.bind(rRegex));
                });

                return aMatchedValues.length === aValues.length
                    ? true
                    : undefined;
            }
        },
        not: {
            args: [],
            minValues: 1,
            fnPipe: function (oArgs, oValues) {
                return Object.keys(oValues).length > 0
                    ? undefined
                    : "";
            },
            fn: function (oArgs, aValues) {

                var vEndResult = O_FUNCTION.and.fn(oArgs, aValues);

                return vEndResult === undefined
                    ? ""
                    : undefined;
            }
        },
        encodeURIComponent: {
            args: [],
            minValues: 1,
            maxValues: 1,
            fnPipe: function (oArgs, oValues) {
                return Object.keys(oValues).reduce(function (o, sKey) {
                    o[sKey] = encodeURIComponent(oValues[sKey]);
                    return o;
                }, {});
            },
            fn: function (oArgs, aValues) {
                var aTransformedValues = aValues.map(function (vValue) {
                    return encodeURIComponent(vValue);
                });

                return aTransformedValues;
            }
        }
    };

    function isEmpty (v) {
        if (typeof v === "undefined") {
            return true;
        }
        if (typeof v === "string") {
            return v === "";
        }
        if (typeof v === "object") {
            return Object.keys(v).length === 0;
        }
        if (typeof v === "number") {
            return v === 0;
        }
        if (typeof v === "boolean") {
            return v === false;
        }

        throw new Error("Unexpected type for value");
    }

    function getValuesAsArray (vValues) {
        var aValues;
        if (oType.isArray(vValues)) {
            aValues = vValues;
        } else if (oType.isPlainObject(vValues)) {
            aValues = [vValues];
        } else if (vValues === undefined) {
            return [];
        } else {
            throw new Error("Unexpected type");
        }
        return aValues;
    }

    function validateFunctionValuesInPipeContext (sFunctionName, oFnDef, oValues) {
        if (oValues !== undefined && !oType.isPlainObject(oValues)) {
            throw new Error("Invalid value type passed to '" + sFunctionName + "' in pipe context. An object is expected.");
        }
    }

    function validateFunctionValuesInValueContext (sFunctionName, oFnDef, aValues) {
        if (aValues !== undefined && !oType.isArray(aValues)) {
            throw new Error("Invalid value type passed to '" + sFunctionName + "' in value context. An array is expected.");
        }

        var iNumValues = oType.isArray(aValues)
            ? aValues.length
            : 0;

        if (oUtils.hasValue(oFnDef.maxValues) && iNumValues > oFnDef.maxValues) {
            throw new Error("Too many values were passed to '" + sFunctionName + "'. Please pass maximum " + oFnDef.maxValues + " values.");
        }
        if (oUtils.hasValue(oFnDef.minValues) && iNumValues < oFnDef.minValues) {
            throw new Error("Too few values were passed to '" + sFunctionName + "'. Please pass minimum " + oFnDef.minValues + " values.");
        }
    }

    function isInvalidArgSignature (aArgsDef) {
        var bError = false;
        aArgsDef.map(isArgRequired).reduce(function (bRequired, bNextRequired) {
            if (!bRequired && bNextRequired) {
                bError = true;
            }
            return bNextRequired;
        }, true);

        return bError;
    }

    function isArgRequired (sArgWithSuffix) {
        return sArgWithSuffix.charAt(sArgWithSuffix.length - 1) !== "?";
    }

    function removeArgSuffix (sArgWithSuffix) {
        return sArgWithSuffix.substr(0, sArgWithSuffix.length - 1);
    }

    function parseFunctionArgs (sFunctionName, aArgs) {
        var aArgsDeclaration = fnClone(O_FUNCTION[sFunctionName].args);
        if (isInvalidArgSignature(aArgsDeclaration)) {
            throw new Error("Invalid argument signature. Make sure all optional arguments appear in the end.");
        }

        var oArgs = {
            length: aArgs.length
        };

        var iRequiredArgs = aArgsDeclaration.filter(isArgRequired);

        var bMoreParametersRequired = iRequiredArgs > aArgs.length;
        if (bMoreParametersRequired) {
            throw new Error(sFunctionName + " requires " + iRequiredArgs + " arguments but " + aArgs.length + " was specified");
        }

        aArgs.forEach(function (vValue) {
            var sNextExpectedArg = aArgsDeclaration.shift();
            var bIsArgOptional = !isArgRequired(sNextExpectedArg);
            if (bIsArgOptional) {
                sNextExpectedArg = removeArgSuffix(sNextExpectedArg);
            }

            if (aArgs.length > 0) {
                oArgs[sNextExpectedArg] = vValue;
            }
        });

        return oArgs;
    }

    function applyFunction (bPipeContext, sFunctionName, aFunctionArgs, aInitialValues) {
        if (!O_FUNCTION.hasOwnProperty(sFunctionName)) {
            throw "Invalid function: " + sFunctionName;
        }

        var oParsedArgs = parseFunctionArgs(sFunctionName, aFunctionArgs);
        if (bPipeContext) {
            validateFunctionValuesInPipeContext(sFunctionName, O_FUNCTION[sFunctionName], aInitialValues);
        } else {
            validateFunctionValuesInValueContext(sFunctionName, O_FUNCTION[sFunctionName], aInitialValues);
        }

        if (bPipeContext) {
            if (!O_FUNCTION[sFunctionName].fnPipe) {
                throw new Error("The function '" + sFunctionName + "' cannot be executed in pipe context");
            }
            return O_FUNCTION[sFunctionName].fnPipe(oParsedArgs, aInitialValues);
        }

        return O_FUNCTION[sFunctionName].fn(oParsedArgs, aInitialValues);
    }

    function toCharacterClass (s) {
        return s.split("").map(function (ch) {
            if (ch === "[") {
                return "[\\[]";
            }
            return "[" + ch + "]";
        }).join("");
    }

    function getPossibleFunctionsRegExpString () {
        var aAllFunctionSymbols = Object.keys(O_FUNCTION);
        return aAllFunctionSymbols.map(toCharacterClass).join("|");
    }


    return {
        getPossibleFunctionsRegExpString: getPossibleFunctionsRegExpString,
        applyFunctionInValueContext: applyFunction.bind(null, false),
        applyFunctionInPipeContext: applyFunction.bind(null, true),

        // for testing
        _setURIDependency: function (FakeURI) {
            URI = FakeURI;
        }
    };

}, false /* bExport */);
