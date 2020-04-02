// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/thirdparty/URI",
    "sap/ushell/utils",
    "sap/ushell/_ApplicationType/systemAlias"
], function (URI, oUtils, oSystemAlias) {
    "use strict";

    var oURLParsing;
    function getURLParsing () {
        if (!oURLParsing) {
            oURLParsing = sap.ushell.Container.getService("URLParsing");
        }
        return oURLParsing;
    }

    /**
     * Checks whether an absolute URL was typed in some configuration of the
     * inbound by the User or it's absolute becaus of a system alias was
     * provided.<br />
     *
     * @param {object} oURI
     *  The URI object to check.
     *
     * @param {string} sSystemAlias
     *  The system alias configured for this URL.
     *
     * @param {string} sSystemAliasSemantics
     *  How to interpret the system alias in relation to a configured URL. This
     *  can be one of the following two strings:
     *  <ul>
     *  <li>applied (default): the system alias was already applied to the URL</li>
     *  <li>apply: the system alias is to be applied to the URL</li>
     *  </ul>
     *
     * @returns {boolean}
     *  Whether the URL provided was defined as absolute by the user.
     *
     * @throws
     *  An error with a message is thrown if an invalid value of
     *  sSystemAliasSemantics is provided.
     *
     * @private
     */
    function absoluteUrlDefinedByUser (oURI, sSystemAlias, sSystemAliasSemantics) {
        if (!sSystemAliasSemantics  // default semantics is 'applied'
            || sSystemAliasSemantics === oSystemAlias.SYSTEM_ALIAS_SEMANTICS.applied) {

            // In 'applied' semantics, the system alias is already
            // applied to the URL. Therefore it has protocol,
            // port and (part of the) path because the system alias was already
            // given as pre-interpolated.

            return oSystemAlias.isAbsoluteURI(oURI)
                && !sSystemAlias; // no system alias -> user has typed in the absolute URL
        }

        if (sSystemAliasSemantics === oSystemAlias.SYSTEM_ALIAS_SEMANTICS.apply) {

            // In 'apply' semantic, the system alias is not pre-interpolated to
            // the URL, but must be applied to the URL.  This excludes the
            // possibility that the URL is absolute because a system alias was
            // provided... and therefore it MUST have been typed in as absolute
            // URL by the user!

            return oSystemAlias.isAbsoluteURI(oURI);
        }

        throw new Error("Invalid system alias semantics: '" + sSystemAliasSemantics + "'");
    }

    /**
     * Append the given parameters to the URL.
     *
     * @param {object} sParameters
     *   a string of parameters to append to the url. For example like:
     *   <code>A=1&B=2&C=3</code>
     *
     * @param {string} sUrl
     *   the URL to append parameters to
     *
     * @returns {string}
     *   the URL with the parameters appended.
     *
     * @private
     */
    function appendParametersToUrl (sParameters, sUrl) {
        var sSapSystemUrlWoFragment,
            sFragment;

        if (sParameters) {

            var sUrlFragment = sUrl.match(/#.*/);
            if (sUrlFragment) {
                sFragment = sUrlFragment;
                sSapSystemUrlWoFragment = sUrl.replace(sUrlFragment, "");
            } else {
                sSapSystemUrlWoFragment = sUrl;
                sFragment = "";
            }

            sUrl = sSapSystemUrlWoFragment + ((sUrl.indexOf("?") < 0) ? "?" : "&") + sParameters + sFragment;
        }

        return sUrl;
    }

    /**
     * Append the given parameters to a remote FLP URL.
     *
     * @param {object} sParameters
     *   a string of parameters to append to the url. For example like:
     *   <code>A=1&B=2&C=3</code>
     *
     * @param {string} sUrl
     *   the Intent URL to append parameters to. For example,
     *   `/path/to/FioriLaunchpad.html#Employee-display`.
     *
     * @returns {string}
     *   the URL with the parameters appended.
     *
     * @private
     */
    function appendParametersToIntentURL (oParameters, sUrl) {
        var oURLParsing = getURLParsing();
        var aUrlFragment = sUrl.match(/#.*/);

        var sUrlFragment = aUrlFragment && aUrlFragment[0];
        if (!sUrlFragment) {
            var sParameters = oURLParsing.paramsToString(oParameters);

            return appendParametersToUrl(sParameters, sUrl);
        }

        var oParsedShellHash = oURLParsing.parseShellHash(sUrlFragment);
        Object.keys(oParameters).forEach(function (sParameterName) {
            var sParameterValue = oParameters[sParameterName];
            oParsedShellHash.params[sParameterName] = [sParameterValue];
        });

        var oParsedShellHashDoubleEncoded = Object.keys(oParsedShellHash.params).reduce(function (o, sKey) {
            var aValue = oParsedShellHash.params[sKey];
            var aValueEncoded = aValue.map(function (sValue) {
                return encodeURIComponent(sValue);
            });

            o[encodeURIComponent(sKey)] = aValueEncoded;
            return o;
        }, {});

        oParsedShellHash.params = oParsedShellHashDoubleEncoded;


        var sUrlFragmentNoHash = sUrl.replace(sUrlFragment, "");
        var sUpdatedShellHash = oURLParsing.constructShellHash(oParsedShellHash);

        return sUrlFragmentNoHash + "#" + sUpdatedShellHash;
    }

    return {
        getURLParsing: getURLParsing,
        appendParametersToUrl: appendParametersToUrl,
        appendParametersToIntentURL: appendParametersToIntentURL,
        absoluteUrlDefinedByUser: absoluteUrlDefinedByUser
    };

}, false /*bExport*/);
