// Copyright (c) 2009-2017 SAP SE, All Rights Reserved

/**
 * @fileOverview The URL Template Processor.
 *
 * This module can be used to generate URLs, based on a template and a given
 * context. A URL template shows the structure of the desired URL, reporting
 * the name of the target parameters in the various parts of this structure.
 *
 * A URL template is expressed according to the proposed standard rfc6570, for
 * example:
 * <code>http://www.example.com{?queryParam}</code>
 *
 * The parameters that appear in the URL template are then resolved as specified
 * by a mini-language that expresses how the parameter can be recovered.
 *
 * For example, the set below allows to recover <code>queryParam</code> from
 * a specific path in the site:
 *
 * <pre>
 * {
 *    queryParam: "{/path/to/my/section}"
 * }
 * </pre>
 *
 * The following URL results when the template of the example above is expanded
 * with the above set of parameters:
 *
 * <code>http://www.example.com?queryParam=myValue</code>
 *
 * The language to define parameters in the URL Template parameter set contains
 * a minimal set of conditionals, logical operators, and functions that allow
 * to define the parameter set with a certain degree of control.
 *
 * @version 1.74.0
 *
 * @private
 *
 */
sap.ui.define([
    "sap/ui/thirdparty/URI",
    "sap/ui/thirdparty/URITemplate",  /* required to use URI#expand */
    "sap/ushell/utils/type",
    "sap/ushell/utils/clone",
    "sap/ushell/_URLTemplateProcessor/utils",
    "sap/ushell/_URLTemplateProcessor/Resolvers",
    "sap/ushell/_URLTemplateProcessor/DependencyGraph",
    "sap/ushell/_URLTemplateProcessor/TemplateParameterParser"
], function (URI, oURITemplate, oType, fnClone, oUtils, oResolvers, oDependencyGraph, oTemplateParameterParser) {
    "use strict";

    /* global jQuery */

    function log (s) {
        jQuery.sap.log.debug(s, "sap.ushell.URLTemplateProcessor");
    }

    function formatValueForLogging (vValue) {
        if (typeof vValue === "undefined") {
            return "<undefined>";
        }
        if (typeof vValue === "string") {
            if (vValue === "") {
                return "<empty string>";
            }
            return "'" + vValue + "'";
        }
        if (typeof vValue === "number") {
            return "(number) " + vValue;
        }
        if (typeof vValue === "boolean") {
            return "(bool) " + vValue;
        }

        var sSerializedObject;
        if (typeof vValue === "object") {
            sSerializedObject = JSON.stringify(vValue);
            if (sSerializedObject.length > 255) {
                sSerializedObject = sSerializedObject.substr(0, 255) + "...";
            }
        } else {
            sSerializedObject = "{other type}";
        }

        return sSerializedObject;
    }

    function mergeObject (o1, o2) {
        var o1Clone = fnClone(o1);
        var o2Clone = fnClone(o2);

        return Object.keys(o2Clone).reduce(function (o, sO2Key) {
            o[sO2Key] = o2Clone[sO2Key];
            return o;
        }, o1Clone);
    }

    function buildDefinitionParameterSet (oParamDefs, oSite, sDefaultNamespace) {
        var bMergeWithSpecified = oParamDefs && Array.isArray(oParamDefs.mergeWith);
        var oParamNames = oParamDefs && oParamDefs.names;
        if (!bMergeWithSpecified) {
            return oParamNames;
        }

        return oParamDefs.mergeWith.reduce(function (oParamNamesMerged, sMergeWithPath) {
            var oParsedPath = oTemplateParameterParser.parsePath(sDefaultNamespace, sMergeWithPath);
            if (oParsedPath.pathType === "relative") {
                throw new Error("Please only specify absolute paths via mergeWith");
            }

            oParsedPath.value.forEach(function (oPathPart) {
                if (oPathPart.type !== "literal") {
                    throw new Error("Please do not specify references in mergeWith paths");
                }
            });

            var oParamDefsBase = oResolvers.resolvePath(
                oParsedPath,  // oParamDef
                {},  // oResolvedParameters
                oSite,  // oSite
                {},  // oApplicationContext
                {}   // oRuntime
            );

            return mergeObject(oParamDefsBase, oParamNamesMerged);
        }, oParamNames);
    }

    function extractPostExpansionOperations (oParameterSet) {
        var aParametersWithOperations = Object.keys(oParameterSet).filter(function (sParamName) {
            return typeof oParameterSet[sParamName] === "object"
                && (
                    oParameterSet[sParamName].hasOwnProperty("renameTo")
                );
        });

        var aOperations = [];

        aParametersWithOperations.forEach(function (sParamName) {
            var oParamDef = oParameterSet[sParamName];
            if (oParamDef.hasOwnProperty("renameTo")) {
                aOperations.push(function (sUrlTemplate, sUrl) {
                    // limit replacement to query only
                    var sReplacedUrl = sUrl;

                    sReplacedUrl = sUrl.replace(
                        new RegExp(sParamName + "=", "g"),
                        oParamDef.renameTo + "="
                    );

                    return sReplacedUrl;
                });
            }
        });

        return aOperations;
    }


    /**
     * Expands a URL Template, logging any activity via
     * <code>jQuery.sap.log.debug</code>.
     *
     * @param {object} oTemplatePayload
     *   The template payload, an object including the url template and the url
     *   template parameter set.
     * @param {object} oSite
     *   The reference to the site containing all data. This is used to resolve
     *   parameters of (absolute) path types.
     * @param {object} oRuntime
     *   The runtime. It's an object containing namespaces defined by the runtime
     *   that exposes URL templating functionality (e.g., ClientSideTargetResolution).
     *   Each namespace can be a single string value, or an object containing
     *   a set of parameters, for example like:
     *   <pre>
     *   {
     *      innerAppRoute: "/some/app/route",
     *      intentParameters: {
     *          p1: ["v1"],
     *          p2: "v2"
     *      }
     *   }
     *   </pre>
     * @param {object} oApplicationContext
     *   The application context. This is an object used to resolve parameters
     *   with relative path type. It's normally a subset of the site, but this
     *   is not a necessity.  It can be a completely separate object.
     *
     * @param {string} sDefaultNamespace
     *   The default namespace from <code>oRuntime</code> where the values of
     *   parameters without specified namespace can be recovered.
     *
     * @returns {string}
     *   A URL expanded according to the given template.
     */
    function expand (oTemplatePayload, oSite, oRuntime, oApplicationContext, sDefaultNamespace) {

        log("[TEMPLATE EXPANSION] " + oTemplatePayload.urlTemplate);

        var oDefinitionParamsSet = buildDefinitionParameterSet(oTemplatePayload.parameters, oSite, sDefaultNamespace) || {};
        var oRuntimeParamsSimpleSet = oUtils.removeArrayParameterNotation(oRuntime[sDefaultNamespace] || {});
        var oDefinitionParameterSetParsed = oTemplateParameterParser.parseTemplateParameterSet(oDefinitionParamsSet, sDefaultNamespace);
        var oRuntimeParamsSimpleSetParsed = oTemplateParameterParser.parseTemplateParameterSetAsLiterals(oRuntimeParamsSimpleSet);
        var oParameterSetParsed = mergeObject(oRuntimeParamsSimpleSetParsed, oDefinitionParameterSetParsed);

        log("- parsed template parameters: " + JSON.stringify(oParameterSetParsed, null, 3));

        var oGraph = oDependencyGraph.buildDependencyGraph(oParameterSetParsed);

        log("- created dependency graph: " + JSON.stringify(oGraph, null, 3));

        var aResolutionOrder = oDependencyGraph.getDependencyResolutionOrder(oGraph);

        log("- resolving in order: " + aResolutionOrder.join(" > "));

        var oResolvedParameters = oResolvers.resolveAllParameters(
            oParameterSetParsed,
            aResolutionOrder,
            oSite,
            oRuntime,
            oApplicationContext,
            sDefaultNamespace
        );

        Object.keys(oResolvedParameters).forEach(function (sParamName) {
            var sParamValue = oResolvedParameters[sParamName];
            log(sParamName + " --> " + formatValueForLogging(sParamValue));
        });

        var aPostExpansionOperations = extractPostExpansionOperations(oDefinitionParamsSet || {});
        var sUrlTemplate = oTemplatePayload.urlTemplate;

        var sUrl = URI.expand(sUrlTemplate, oResolvedParameters).toString();
        log("- created URL: " + sUrl);

        aPostExpansionOperations.forEach(function (fnOperation) {
            sUrl = fnOperation(sUrlTemplate, sUrl);
        });

        if (aPostExpansionOperations.length > 0) {
            log("- created URL (post expansion): " + sUrl);
        }

        return sUrl;
    }

    return {
        expand: expand
    };

}, false /*bExport*/);
