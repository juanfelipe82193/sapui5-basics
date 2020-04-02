// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview Util module for ClientSideTargetResolution's tests
 */
sap.ui.define([
    "sap/ushell/services/_ClientSideTargetResolution/Formatter"
], function (oFormatter) {
    "use strict";

    // the virtual inbounds defined in client side target resolution
    var A_VIRTUAL_INBOUNDS = [
        {
            "action": "search",
            "deviceTypes": {
                "desktop": true,
                "phone": true,
                "tablet": true
            },
            "hideIntentLink": true,
            "resolutionResult": {
                "additionalInformation": "SAPUI5.Component=sap.ushell.renderers.fiori2.search.container",
                "applicationType": "SAPUI5",
                "loadCoreExt": true,
                "loadDefaultDependencies": false,
                "ui5ComponentName": "sap.ushell.renderers.fiori2.search.container",
                "url": "../../../../../resources/sap/ushell/renderers/fiori2/search/container"
            },
            "semanticObject": "Action",
            "signature": {
                "additionalParameters": "notallowed",
                "parameters": {}
            }
        },
        // #Shell-compose used for CONF layer
        {
            hideIntentLink: true, // don't show in getLinks
            semanticObject: "Shell",
            action: "compose",
            deviceTypes: {
                desktop: true, tablet: true, phone: true
            },
            signature: {
                parameters: {
                    roleId: {
                        required: false,
                        defaultValue: {
                            value: ""
                        }
                    },
                    pageId: {
                        required: false,
                        defaultValue: {
                            value: ""
                        }
                    },
                    mode: {
                        required: false,
                        defaultValue: {
                            value: "view"
                        }
                    }
                },
                additionalParameters: "notallowed"
            },
            resolutionResult: {
                applicationType: "SAPUI5",
                ui5ComponentName: "sap.ushell.applications.PageComposer",
                additionalInformation: "SAPUI5.Component=sap.ushell.applications.PageComposer",
                url: sap.ui.require.toUrl("sap/ushell/applications/PageComposer"),
                loadCoreExt: true,
                loadDefaultDependencies: false
            }
        },
        // #FLPSpace-maintain used for CONF layer
        {
            hideIntentLink: true, // don't show in getLinks
            semanticObject: "FLPSpace",
            action: "maintain",
            deviceTypes: {
                desktop: true, tablet: true, phone: true
            },
            signature: {
                parameters: {
                    roleId: {
                        required: false,
                        defaultValue: {
                            value: ""
                        }
                    },
                    spaceId: {
                        required: false,
                        defaultValue: {
                            value: ""
                        }
                    },
                    mode: {
                        required: false,
                        defaultValue: {
                            value: "view"
                        }
                    }
                },
                additionalParameters: "notallowed"
            },
            resolutionResult: {
                applicationType: "SAPUI5",
                ui5ComponentName: "sap.ushell.applications.SpaceDesigner",
                additionalInformation: "SAPUI5.Component=sap.ushell.applications.SpaceDesigner",
                url: sap.ui.require.toUrl("sap/ushell/applications/SpaceDesigner"),
                loadCoreExt: true,
                loadDefaultDependencies: false
            }
        }

    ];

    /**
     * Used to create inbound
     *
     * To convert inbound to function call the following tool can be used: test/js/sap/ushell/tools/InboundFormatter.html
     *
     * @param {string} sInbound inbound string based on _ClientSideTargetResolution/Formatter
     * @param {object} [oResolutionResult] resolution result which should be added in inbound
     * @param {object} [oExtraProperties] extra parameters which should be overwritten in created inbound
     *
     * @returns {object} inbound
     * @private
     */
    function createInbound (sInbound, oResolutionResult /* optional */, oExtraProperties /* optional */) {
        var oInbound = oFormatter.parseInbound(sInbound);
        oResolutionResult = oResolutionResult || {};

        oInbound.resolutionResult = jQuery.extend(true, {}, oResolutionResult);

        if (oResolutionResult.hasOwnProperty("url") && oResolutionResult.url === undefined) {
            oInbound.resolutionResult.url = undefined;
        }

        jQuery.extend(true, oInbound, oExtraProperties || {});

        return oInbound;
    }

    function getLocalSystemAlias () {
        return {
            http: {
                id: "",
                host: "",
                port: 0,
                pathPrefix: "/sap/bc/"
            },
            https: {
                id: "",
                host: "",
                port: 0,
                pathPrefix: "/sap/bc/"
            },
            rfc: {},
            id: "",
            client: "",
            language: ""
        };
    }

    /**
     * Create a system alias based on the local system alias. In order to
     * overwrite some property use oExtraProperties.
     * @param {Object} oExtraProperties contain the property which should be overwrite:
     *      - http
     *      - https
     *      - rfc
     *      - client
     *      - language
     *
     * @returns {Object} new system alias
     * @private
     *
     */
    function createSystemAlias (oExtraProperties /* optional */) {
        return jQuery.extend(getLocalSystemAlias(), oExtraProperties || {});
    }


    function createHttpConnection (host, port, pathPrefix) {
        return {
            id: "",
            host: host || "",
            port: port || 0,
            pathPrefix: pathPrefix || ""
        };
    }

    function createRfcConnection (systemId, host, service, loginGroup, sncNameR3, sncQoPR3) {
        return {
            id: "",
            systemId: systemId || "",
            host: host || "",
            service: service || 0,
            loginGroup: loginGroup || "",
            sncNameR3: sncNameR3 || "",
            sncQoPR3: sncQoPR3 || ""
        };
    }

    var testHelper = {};
    testHelper.createInbound = createInbound;
    testHelper.getVirtualInbounds = function () {
        return A_VIRTUAL_INBOUNDS;
    };
    testHelper.getLocalSystemAlias = getLocalSystemAlias;
    testHelper.createSystemAlias = createSystemAlias;
    testHelper.createHttpConnection = createHttpConnection;
    testHelper.createRfcConnection = createRfcConnection;

    return testHelper;

});