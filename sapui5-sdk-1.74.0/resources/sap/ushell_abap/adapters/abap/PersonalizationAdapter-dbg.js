// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The Unified Shell's personalization adapter for the ABAP
 *               platform.
 *               The internal data structure of the AdapterContainer corresponds to the
 *               ABAP EDM.
 *               Container header properties transported via pseudo-items are mapped to the
 *               respective header properties in setItem/getItem/delItem
 *
 * @version 1.74.0
 */
sap.ui.define([
    "sap/ushell_abap/adapters/abap/AdapterContainer",
    "sap/ushell/services/Personalization",
    "sap/ushell/services/_Personalization/constants",
    "sap/ui2/srvc/ODataWrapper",
    "sap/ui2/srvc/ODataService",
    "sap/base/util/ObjectPath"
], function (AdapterContainer, Personalization, constants, ODataWrapper, ODataService, ObjectPath) {
    "use strict";

    // --- Adapter ---

    /**
     * This method MUST be called by the Unified Shell's personalization service only.
     * Constructs a new instance of the personalization adapter for the ABAP
     * platform.
     *
     * @param {object}
     *            oSystem the system served by the adapter
     *
     * @class The Unified Shell's personalization adapter for the ABAP platform.
     *
     * @constructor
     * @since 1.11.0
     * @private
     */
    var PersonalizationAdapter = function (oSystem, sParameters, oConfig) {
        this._oConfig = oConfig && oConfig.config;
        var sPersonalizationServiceURL = (ObjectPath.get("config.services.personalization.baseUrl", oConfig) || "/sap/opu/odata/UI2/INTEROP") + "/";
        var oODataWrapperSettings = {
            baseUrl: sPersonalizationServiceURL,
            "sap-language": sap.ushell.Container.getUser().getLanguage(),
            "sap-client": sap.ushell.Container.getLogonSystem().getClient()
        };
        this._oWrapper = sap.ui2.srvc.createODataWrapper(oODataWrapperSettings);
        function fnDefaultFailure (oMessage) {
            sap.ui2.srvc.Error(oMessage, "sap.ushell_abap.adapters.abap.PersonalizationAdapter");
        }
        sap.ui2.srvc.ODataService.call(this, this._oWrapper, fnDefaultFailure);
    };

    // historically, the service always called  getAdapterContainer and then load
    // thus an implementation was not required to initialize a fully implemented container on getAdapterContainer
    // if the following property is set to true, it indicates getAdapterContainer is sufficient and a load is not
    // required if an initial contain is requested.
    PersonalizationAdapter.prototype.supportsGetWithoutSubsequentLoad = true;

    PersonalizationAdapter.prototype.getAdapterContainer = function (sContainerKey, oScope, sAppName) {
        return new AdapterContainer(sContainerKey, this, oScope, sAppName);
    };

    PersonalizationAdapter.prototype.delAdapterContainer = function (sContainerKey, oScope) {
        return this.getAdapterContainer(sContainerKey, oScope).del();
    };

    /**
     * Determine the correct category resulting out of possible scope flag combinations
     * @returns {string}
     *  category information
     * @private
     */
    sap.ui2.srvc.testPublishAt(PersonalizationAdapter);
    PersonalizationAdapter.prototype._determineCategory = function (oScope) {
        if (!oScope) {
            return "U";
        }
        var oConstants = constants;
        if (oScope.keyCategory && oScope.keyCategory === oConstants.keyCategory.FIXED_KEY &&
                oScope.writeFrequency && oScope.writeFrequency === oConstants.writeFrequency.LOW &&
                    oScope.clientStorageAllowed && oScope.clientStorageAllowed === true) {
            return "P";
        }
        return "U";
    };

    return PersonalizationAdapter;

}, true /* bExport */);