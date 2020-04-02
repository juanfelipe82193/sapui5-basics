// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The extensions which plugins can use to customise the launchpad
 *
 * @version 1.74.0
 * @private
 */
sap.ui.define([
    'sap/ushell/services/_PluginManager/HeaderExtensions'
], function (HeaderExtensions) {
    "use strict";

    var O_AVALIABLE_EXTENSIONS = {
        "Header": getHeaderExtensions
    };

    /**
     * Get the HeaderExtensions object, which contains all possible
     * customisazion methods for the Shell Header.
     *
     * @returns {sap.ushell.services._PluginManager.HeaderExtensions}
     *    The API to customise the ShellHeader.
     *
     * @private
     * @since 1.63
     */
    function getHeaderExtensions () {
        // When ShellHeader will be implemented as standalone, need to add some listener and resolve when header is ready
        return Promise.resolve(HeaderExtensions);
    }

    function getExtensions (sExtensionName) {
        var fnExtensionFactory = O_AVALIABLE_EXTENSIONS[sExtensionName];
        if (!fnExtensionFactory) {
            return Promise.reject("Unsupported extension: '" + sExtensionName + "'");
        }
        return fnExtensionFactory();
    }

    return getExtensions;
});
