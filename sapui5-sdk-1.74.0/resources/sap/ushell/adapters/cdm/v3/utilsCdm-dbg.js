// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/utils",
    "sap/ushell/adapters/cdm/v3/_LaunchPage/readVisualizations",
    "sap/ui/thirdparty/jquery",
    "sap/base/util/isEmptyObject",
    "sap/base/util/ObjectPath"
], function (oUshellUtils, oReadVisualization, jQuery, isEmptyObject, ObjectPath) {
    "use strict";

    // Helper functions
    function getMember (oObject, sAccessPath) {
        return oUshellUtils.getMember(oObject, sAccessPath);
    }

    function getNestedObjectProperty (aObjects, oAccessPath, oDefault) {
        return oUshellUtils.getNestedObjectProperty(aObjects, oAccessPath, oDefault);
    }

    /* eslint-disable complexity */

    /**
     * Compiles information about a given inbound, enriched with app
     * and visualization data
     *
     * @param  {string} sKey
     *         Inbound ID of UI5 app
     *
     * @param  {object} oSrc
     *         Inbound definition from the app's manifest
     *
     * @param  {object} oApp
     *         Other segments of the app's manifest
     *
     * @param  {object} oVisualization
     *         Visualization of the app
     *
     * @param  {object} oVisualizationType
     *         Visualization type of the visualization
     *
     * @param {object} oSite
     *         A reference to the whole CDM site
     *
     * @returns {object}
     *          Inbound information, enriched for further processing
     *
     * @private
     */
    function mapOne (sKey, oSrc, oApp, oVisualization, oVisualizationType, oSite) {
        var bIsCard = false,
            bIsPlatformVisualization = false;

        /* ---- Prepare and default inputs ---- */
        oSrc = oUshellUtils.clone(oSrc); // do not modify input parameters
        oApp = oUshellUtils.clone(oApp); // do not modify input parameters

        // ... Client side target resolution doesn't supply visualization data
        oVisualization = oVisualization || {};
        oVisualizationType = oVisualizationType || {};


        /* ---- Collect inbound information ---- */

        // Intent, title, info, icon, sub title, short title
        // ... from visualization, inbound, app or visualization type

        var oInbound = {};
        oInbound.semanticObject = getMember(oSrc, "semanticObject");
        oInbound.action = getMember(oSrc, "action");

        var oVizConfig = oReadVisualization.getConfig(oVisualization);

        oInbound.title = oReadVisualization.getTitle([undefined, oVizConfig, oSrc, oApp]);
        oInbound.info = oReadVisualization.getInfo([undefined, oVizConfig, oSrc, oApp]);
        oInbound.icon = oReadVisualization.getIcon([undefined, oVizConfig, oSrc, oApp]);
        oInbound.subTitle = oReadVisualization.getSubTitle([undefined, oVizConfig, oSrc, oApp]);
        oInbound.shortTitle = oReadVisualization.getShortTitle([undefined, oVizConfig, oSrc, oApp]);

        oInbound.deviceTypes = getMember(oApp, "sap|ui.deviceTypes") || {};

        //  Device types
        // ... if not supplied, default is true (!)
        ["desktop", "tablet", "phone"].forEach(function (sMember) {
            // we overwrite member by member if deviceType specified in oSrc!
            if (Object.prototype.hasOwnProperty.call(getMember(oSrc, "deviceTypes") || {}, sMember)) {
                oInbound.deviceTypes[sMember] = oSrc.deviceTypes[sMember];
            }
            if (!Object.prototype.hasOwnProperty.call(oInbound.deviceTypes, sMember)) {
                oInbound.deviceTypes[sMember] = true;
            }
            oInbound.deviceTypes[sMember] = !!oInbound.deviceTypes[sMember];
        });

        // Signature
        oInbound.signature = getMember(oSrc, "signature") || {};
        oInbound.signature.parameters = getMember(oInbound, "signature.parameters") || {};
        oInbound.signature.additionalParameters = getMember(oSrc, "signature.additionalParameters") || "allowed";


        /* ---- Build resolution result ---- */

        // Target app's runtime data (component url)
        var oSapPlatformRuntime = getMember(oApp, "sap|platform|runtime");
        oInbound.resolutionResult = jQuery.extend(true, {}, oSapPlatformRuntime);
        if (oSapPlatformRuntime) {
            oInbound.resolutionResult["sap.platform.runtime"] = jQuery.extend(true, {}, oSapPlatformRuntime);
        }

        // Segment "sap.gui", if this is a GUI app
        if (getMember(oApp, "sap|ui.technology") === "GUI") {
            oInbound.resolutionResult["sap.gui"] = getMember(oApp, "sap|gui");
        }

        // Segment "sap.wda", if this is a web dynpro app
        if (getMember(oApp, "sap|ui.technology") === "WDA") {
            oInbound.resolutionResult["sap.wda"] = getMember(oApp, "sap|wda");
        }

        // Url, taken from segment "sap.url" or "sap.platform.runtime", if this is an app specified by a URL
        if (getMember(oApp, "sap|ui.technology") === "URL") {
            if (oApp["sap.url"]) {
                oInbound.resolutionResult["sap.platform.runtime"] = oInbound.resolutionResult["sap.platform.runtime"] || {};
                oInbound.resolutionResult.url = oApp["sap.url"].uri;
                oInbound.resolutionResult["sap.platform.runtime"].url = oApp["sap.url"].uri;
            } else if (oSapPlatformRuntime && oSapPlatformRuntime.uri) {
                oInbound.resolutionResult["sap.platform.runtime"].url = oSapPlatformRuntime.uri;
                oInbound.resolutionResult.url = oSapPlatformRuntime.uri;
            }
        }

        // SAP ui technology
        if (!oInbound.resolutionResult["sap.ui"]) {
            oInbound.resolutionResult["sap.ui"] = {};
        }
        oInbound.resolutionResult["sap.ui"].technology = getMember(oApp, "sap|ui.technology");

        // Application type
        oInbound.resolutionResult.applicationType = this._formatApplicationType(oInbound.resolutionResult, oApp);

        // System Alias : used to interpolate the URL
        // ... ClientSideTargetResolution will de-interpolate the URL before applying sap-system
        oInbound.resolutionResult.systemAlias = oInbound.resolutionResult.systemAlias || getMember(oSrc, "systemAlias"); // NOTE: "" is the local system alias

        // System alias semantics
        // ... In the CDM platform the "systemAlias" value is meant as: "apply this
        // ... system alias to the resolved URL if no sap-system is given".
        oInbound.resolutionResult.systemAliasSemantics = "apply";

        // App ID, device types and title
        oInbound.resolutionResult.text = oInbound.title;
        oInbound.resolutionResult.appId = getMember(oApp, "sap|app.id");


        /* ---- Build tile resolution result ---- */
        var sTileTechnicalInformation,
            sAppId;

        // Pick indicator data source
        var oIndicatorDataSource =
            getMember(oVisualization, "vizConfig.sap|flp.indicatorDataSource");

        // Collect tile component data
        var oTempTileComponent = {};

        // Include manifest from visualization type
        if (!isEmptyObject(oVisualizationType)) {
            var sType = getMember(oVisualizationType, "sap|app.type");
            if (sType === "card") {
                bIsCard = true;
                // merge visualisation.vizConfig with vizType
                oTempTileComponent = jQuery.extend(true, {}, oVisualizationType, oVisualization.vizConfig);
            } else if (sType === "platformVisualization") {
                // This is needed in the pages scenario and indicates that a tile can not be instantiated by the CDM adapter
                // but has to be created by platform specific logic.
                bIsPlatformVisualization = true;
            } else {
                oTempTileComponent.componentName = getMember(oVisualizationType, "sap|ui5.componentName");
                var oComponentProperties = getMember(oVisualizationType, "sap|platform|runtime.componentProperties");
                if (oComponentProperties) {
                    oTempTileComponent.componentProperties = oComponentProperties;
                }

                if (getMember(oVisualizationType, "sap|platform|runtime.includeManifest")) {
                    // with includeManifest the server specifies that the application from CDM site
                    // includes the entire manifest (App Descriptor) properties and can directly
                    // be used for instantiation of the tile
                    oTempTileComponent.componentProperties = oTempTileComponent.componentProperties || {};
                    oTempTileComponent.componentProperties.manifest = jQuery.extend(true, {}, oVisualizationType);

                    // sap.platform.runtime needs to be removed because it is added by the server
                    // and is not part of the actual App Descriptor schema!
                    delete oTempTileComponent.componentProperties.manifest["sap.platform.runtime"];
                }
            }
        }

        // Application Type
        if (getMember(oApp, "sap|app.type") === "plugin" || getMember(oApp, "sap|flp.type") === "plugin") {
            return undefined;
        }

        // Tile size
        var sTileSize = getNestedObjectProperty([oVizConfig, oApp, oVisualizationType], "sap|flp.tileSize");

        // Tile description
        var sTileDescription =
            getNestedObjectProperty([oVizConfig, oApp, oVisualizationType], "sap|app.description");

        // TODO: Use getNestedObjectProperty for other response properties, where applicable

        // Tile technical information
        if (getMember(oApp, "sap|ui.technology") === "GUI" && getMember(oApp, "sap|gui.transaction")) {
            sTileTechnicalInformation = getMember(oApp, "sap|gui.transaction");
        }

        // UI technology
        if (getMember(oApp, "sap|ui.technology") === "WDA" &&
            getMember(oApp, "sap|wda.applicationId")) {
            sTileTechnicalInformation = getMember(oApp, "sap|wda.applicationId");
        }

        // Data sources
        var oDataSource =
            getNestedObjectProperty([oVizConfig, oApp, oVisualizationType], "sap|app.dataSources");

        // App ID
        if (getMember(oApp, "sap|app.id")) {
            sAppId = getMember(oApp, "sap|app.id");
        }

        oInbound.tileResolutionResult = {
            appId: sAppId,
            title: oInbound.title,
            subTitle: oInbound.subTitle,
            icon: oInbound.icon,
            size: sTileSize,
            info: oInbound.info,
            tileComponentLoadInfo: oTempTileComponent,
            indicatorDataSource: oIndicatorDataSource,
            dataSources: oDataSource,
            description: sTileDescription,
            runtimeInformation: oSapPlatformRuntime,
            technicalInformation: sTileTechnicalInformation,
            deviceTypes: oInbound.deviceTypes,
            isCard: bIsCard,
            isPlatformVisualization: bIsPlatformVisualization
        };

        // URL Template
        var sTemplateName = getMember(oApp, "sap|integration.urlTemplateId");
        var oTemplatePayload = getTemplatePayloadFromSite(sTemplateName, oSite);
        if (oTemplatePayload) {
            oInbound.templateContext = {
                payload: oTemplatePayload,
                site: oSite,
                siteAppSection: oApp
            };
        }

        return oInbound;
    }

    /**
     * Safely extract the template payload from a site.
     *
     * @param {string} [sTemplateName]
     *   The template name to extract from the Site.
     * @param {object} [oSite]
     *   The site.
     *
     * @returns {object}
     *   The template payload for the given template name or null if no
     *   template payload could be extracted.
     */
    function getTemplatePayloadFromSite (sTemplateName, oSite) {
        if (!oSite || typeof sTemplateName !== "string") {
            return null;
        }

        var sTemplateNameEscaped = sTemplateName.replace(/[.]/g, "|");

        return getMember(oSite.urlTemplates, sTemplateNameEscaped + ".payload");
    }

    /* eslint-enable complexity */

    /**
     * Extracts a valid <code>applicationType</code> field for
     * ClientSideTargetResolution from the site application resolution result.
     *
     * @param {object} oResolutionResult
     *   The application resolution result. An object like:
     * <pre>
     *   {
     *      "sap.platform.runtime": { ... },
     *      "sap.gui": { ... } // or "sap.wda" for wda applications
     *   }
     * </pre>
     * @param {object} oApp
     *   A site application object
     *
     * @returns {string}
     *   One of the following application types compatible with
     *   ClientSideTargetResolution service: "TR", "SAPUI5", "WDA", "URL".
     */
    function formatApplicationType (oResolutionResult, oApp) {
        var sApplicationType = oResolutionResult.applicationType;

        if (sApplicationType) {
            return sApplicationType;
        }

        var sComponentName = getMember(oApp, "sap|platform|runtime.componentProperties.self.name") || getMember(oApp, "sap|ui5.componentName");

        if (getMember(oApp, "sap|flp.appType") === "UI5" ||
            getMember(oApp, "sap|ui.technology") === "UI5") {

            oResolutionResult.applicationType = "SAPUI5";
            oResolutionResult.additionalInformation = "SAPUI5.Component=" + sComponentName;
            oResolutionResult.url = getMember(oApp, "sap|platform|runtime.componentProperties.url");
            oResolutionResult.applicationDependencies = getMember(oApp, "sap|platform|runtime.componentProperties");
            return "SAPUI5";
        }

        if (getMember(oApp, "sap|ui.technology") === "GUI") {
            oResolutionResult.applicationType = "TR";
            //oResult.url = getMember(oApp,"sap|platform|runtime.uri");
            oResolutionResult["sap.gui"] = getMember(oApp, "sap|gui");
            oResolutionResult.systemAlias = getMember(oApp, "sap|app.destination.name");
            return "TR";
        }

        if (getMember(oApp, "sap|ui.technology") === "WDA") {
            oResolutionResult.applicationType = "WDA";
            //oResult.url = getMember(oApp,"sap|platform|runtime.uri");
            oResolutionResult["sap.wda"] = getMember(oApp, "sap|wda");
            oResolutionResult.systemAlias = getMember(oApp, "sap|app.destination.name");
            return "WDA";
        }

        if (getMember(oApp, "sap|ui.technology") === "URL") {
            oResolutionResult.applicationType = "URL";
            oResolutionResult.systemAlias = getMember(oApp, "sap|app.destination.name");
        }

        return "URL";
    }

    /**
     * Formats the target mappings contained in the CDM site projection into inbounds
     *
     * @param {object} oSite
     *   the CDM site projection
     *
     * @return {object[]}
     *   <p>
     *   an array of inbounds suitable for ClientSideTargetResolution service
     *   consumption.
     *   </p>
     */
    function formatSite (oSite) {
        var that = this;

        if (!oSite) {
            return [];
        }


        var aInbounds = [];
        try {
            var aSiteApplications = Object.keys(oSite.applications || {}).sort();
            aSiteApplications.forEach(function (sApplicationKey) {
                try {
                    var oApp = oSite.applications[sApplicationKey];
                    var oApplicationInbounds = getMember(oApp, "sap|app.crossNavigation.inbounds");
                    if (oApplicationInbounds) {
                        var lst2 = Object.keys(oApplicationInbounds).sort();
                        lst2.forEach(function (sInboundKey) {
                            var oInbound = oApplicationInbounds[sInboundKey];
                            var r = that.mapOne(sInboundKey, oInbound, oApp, undefined, undefined, oSite);
                            if (r) {
                                aInbounds.push(r);
                            }
                        });
                    }
                } catch (oError1) {
                    // this is here until validation on the CDM site is done
                    jQuery.sap.log.error(
                        "Error in application " + sApplicationKey + ": " + oError1,
                        oError1.stack
                    );
                }
            });
        } catch (oError2) {
            jQuery.sap.log.error(oError2);
            jQuery.sap.log.error(oError2.stack);
            return [];
        }

        return aInbounds;
    }

    /**
     * Constructs a hash string from the given inbound.
     *
     * @param {object} oInbound
     *   oInbound structure as specified in App Descriptor schema
     *
     * @return {string}
     *   The constructed hash without leading '#' or undefined if not successful
     */
    function toHashFromInbound (oInbound) {
        var oShellHash,
            oParams,
            sConstructedHash;

        oShellHash = {
            target: {
                semanticObject: oInbound.semanticObject,
                action: oInbound.action
            },
            params: {}
        };

        oParams = ObjectPath.get("signature.parameters", oInbound) || {};

        Object.keys(oParams).forEach(function (sKey) {
            if (oParams[sKey].filter && Object.prototype.hasOwnProperty.call(oParams[sKey].filter, "value") &&
                (oParams[sKey].filter.format === undefined || oParams[sKey].filter.format === "plain")) {
                oShellHash.params[sKey] = [oParams[sKey].filter.value];
            }

            // TODO: CDM2.0: remove launcherValue
            if (oParams[sKey].launcherValue && Object.prototype.hasOwnProperty.call(oParams[sKey].launcherValue, "value") &&
                (oParams[sKey].launcherValue.format === undefined || oParams[sKey].launcherValue.format === "plain")) {
                oShellHash.params[sKey] = [oParams[sKey].launcherValue.value];
            }
        });

        sConstructedHash = sap.ushell.Container.getService("URLParsing").constructShellHash(oShellHash);

        if (!sConstructedHash) {
            return undefined;
        }
        return sConstructedHash;
    }

    /**
     * Constructs an hash string from the given outbound.
     *
     * @param {object} oOutbound
     *   oOutbound structure as specified in App Descriptor schema
     *
     * @return {string}
     *   The constructed hash without leading '#' or undefined if not successful
     */
    function toHashFromOutbound (oOutbound) {
        var oShellHash,
            oParams,
            sConstructedHash;

        oShellHash = {
            target: {
                semanticObject: oOutbound.semanticObject,
                action: oOutbound.action
            },
            params: {}
        };

        oParams = oOutbound.parameters || {};

        Object.keys(oParams).forEach(function (sKey) {
            if (oParams.hasOwnProperty(sKey) && typeof oParams[sKey].value === "object") {
                oShellHash.params[sKey] = [oParams[sKey].value.value];
            }
        });

        sConstructedHash = sap.ushell.Container.getService("URLParsing").constructShellHash(oShellHash);

        if (!sConstructedHash) {
            return undefined;
        }
        return sConstructedHash;
    }


    return {
        formatSite: formatSite,
        toHashFromInbound: toHashFromInbound,
        toHashFromOutbound: toHashFromOutbound,
        //
        // Expose private methods for testing:
        //
        // - test can stub these
        // - code in this module consumes the stubs because consumes
        //   this._method() [ instead of method() ]
        //
        mapOne: mapOne,
        _formatApplicationType: formatApplicationType
    };

}, /* bExport= */ true);
