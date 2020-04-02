// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview A catalog service which is able to read CHIPs from a remote server.
 */

(function () {
  "use strict";
  /*global jQuery, sap */

  jQuery.sap.declare("sap.ui2.srvc.RemoteCatalogService");

  jQuery.sap.require("sap.ui2.srvc.PageBuildingService");

  // "public class" ************************************************************

  /**
   * Constructs a remote catalog service which is able to read CHIPs from a remote server.
   *
   * @class
   * @constructor
   * @since 1.19.1
   */
  sap.ui2.srvc.RemoteCatalogService = function () {

    // "public" methods --------------------------------------------------------

    /**
     * Reads the CHIPs with given IDs from the catalog with the given ID, using the given base URL.
     *
     * @param {string} sBaseUrl
     *   the base URL of the remote catalog
     * @param {string} sCatalogId
     *   the ID of the remote catalog
     * @param {string[]} [aChipIds]
     *   the IDs of the CHIPs to be loaded; if <code>undefined</code>, all CHIPs are loaded
     * @param {function (object)} fnSuccess
     *   a callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @throws Error if <code>aChipIds === []</code>
     * @since 1.19.1
     */
    this.readChips = function (sBaseUrl, sCatalogId, aChipIds, fnSuccess, fnFailure) {
      sap.ui2.srvc.createPageBuildingService(sBaseUrl)
        .readCatalogChips(sCatalogId, aChipIds, fnSuccess, fnFailure);
    };
  };
}());
