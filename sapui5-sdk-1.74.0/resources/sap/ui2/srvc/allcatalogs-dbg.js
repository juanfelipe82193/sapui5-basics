// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview A wrapper for a page's <code>allCatalogs</code> collection loaded from the page
 * building service.
 */

this.sap = this.sap || {};

(function () {
  "use strict";
  /*global jQuery, sap */

  // namespace "sap.ui2.srvc" **************************************************
  sap.ui2 = sap.ui2 || {};
  sap.ui2.srvc = sap.ui2.srvc || {};

  // Only declare the module if jQuery.sap exists. Otherwise we do not even try to require assuming
  // that the script has been loaded manually (before SAPUI5).
  // Load time branching pattern
  var fnRequire = String; // NOP (String exists and is free of side-effects)
  if (typeof jQuery === "function" && jQuery.sap) {
    jQuery.sap.declare("sap.ui2.srvc.allcatalogs");
    // avoid fnRequire = jQuery.sap.require as require cannot be spied on afterwards
    fnRequire = function () {
      jQuery.sap.require.apply(this, arguments);
    };
  }

  // "public class" ************************************************************

  /**
   * Constructs a new representation (wrapper) for the given page's <code>allCatalogs</code>
   * collection to be loaded from the given factory's page building service. Note that this
   * collection does not contain the page's classic catalog as returned by
   * {@link sap.ui2.srvc.Page#getCatalog}).
   *
   * @param {sap.ui2.srvc.Factory} oFactory
   *  the factory
   * @param {string} sPageId
   *   ID of the page
   *
   * <p>
   * Initially a stub is created, which can later load its properties and related objects
   * asynchronously.
   * <p>
   * This collection and the contained catalogs are currently read-only and cannot be updated
   * through the page building service.
   * (see {@link sap.ui2.srvc.PageBuildingService}, {@link sap.ui2.srvc.Catalog})
   *
   * @class
   * @since 1.7.0
   */
  sap.ui2.srvc.AllCatalogs = function (oFactory, sPageId) {
    var aCatalogs = [],
      bIsStub = true,
      that = this;

    // BEWARE: constructor code below!

    // "private" methods ---------------------------------------------------------

    /**
     * Makes sure we are not just a stub.
     *
     * @private
     */
    function checkStub () {
      if (bIsStub) {
        throw new sap.ui2.srvc.Error(that + ": collection is just a stub",
          "sap.ui2.srvc.AllCatalogs");
      }
    }

    // "public" methods ----------------------------------------------------------

    /**
     * Returns this collection's catalog instances. Can only be called if the collection itself is
     * not a stub anymore.
     *
     * @returns {sap.ui2.srvc.Catalog[]}
     *   this collection's catalog instances
     * @since 1.7.0
     *
     * @see #isStub()
     */
    this.getCatalogs = function () {
      checkStub();
      return aCatalogs.slice();
    };

    /**
     * Tells whether this <code>allCatalogs</code> collection is still only a stub and does not yet
     * know its individual catalogs.
     *
     * @returns {boolean}
     *   whether this <code>allCatalogs</code> collection is still only a stub
     * @since 1.7.0
     *
     * @see #load()
     */
    this.isStub = function () {
      return bIsStub;
    };

    /**
     * Loads this <code>allCatalogs</code> collection including all of its catalogs and their CHIPs.
     * Notifies one of the given handlers.
     *
     * @param {function ()} fnSuccess
     *   no-args success handler
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   If not given, the default <code>{@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}</code> is used
     * @param {string} [sFilter]
     *   filter value as defined by OData specification e.g. "type eq 'H'" for HANA catalogs.
     *   Filter has been introduced with version 1.16.2.
     * @param {boolean} [bPartially=false]
     *   Whether to load the <code>allCatalogs</code> collection only partially instead of making
     *   sure that also remote catalogs are fully loaded (since 1.17.1). Note: Non-remote catalogs
     *   are not affected!
     * @param {string} sSorting
     *   name of the field to be sorted on via $orderby as defined by OData specification.
     *   If not defined the dafault sorting would be on the field id (since 1.44)
     * @param {boolean} bCache use cache when true
     * @since 1.7.0
     */
    this.load = function (fnSuccess, fnFailure, sFilter, bPartially, sSorting, bCache) {
      if (!bIsStub) {
        throw new sap.ui2.srvc.Error(that + ": collection is not a stub anymore",
          "sap.ui2.srvc.AllCatalogs");
      }

      function loadCatalogs () {
        var i, n, oCatalog;

        if (!bPartially) {
          // Note: If a catalog is still a stub here, it refers to a different system. We don't
          // expect to have many such catalogs, so we don't mind loading them serialized.
          for (i = 0, n = aCatalogs.length; i < n; i += 1) {
            oCatalog = aCatalogs[i];
            if (oCatalog.isStub()) {
              oCatalog.load(loadCatalogs, fnFailure);
              return;
            }
          }
        }
        fnSuccess();
      }

      function onSuccess (oAlterEgo) {
        var i, n;

        jQuery.sap.log.debug("Loaded: " + that, null, "sap.ui2.srvc.AllCatalogs");
        bIsStub = false;
        aCatalogs = [];
        for (i = 0, n = oAlterEgo.results.length; i < n; i += 1) {
          fnRequire("sap.ui2.srvc.catalog");
          aCatalogs.push(oFactory.createCatalog(oAlterEgo.results[i]));
        }
        jQuery.sap.log.debug("Initialized: " + that, null, "sap.ui2.srvc.AllCatalogs");
        loadCatalogs();
      }

      oFactory.getPageBuildingService().readAllCatalogs(sPageId, onSuccess, fnFailure, sFilter, sSorting, !!bCache /* false is the default */);
    };

    /**
     * Returns this <code>allCatalogs</code> collection's string representation.
     *
     * @param {boolean} [bVerbose=false]
     *   flag whether to show all properties
     * @returns {string}
     *   this <code>allCatalogs</code> collection's string representation
     * @since 1.7.0
     */
    this.toString = function (bVerbose) {
      var aResult = ['sap.ui2.srvc.AllCatalogs({sPageId:"', sPageId, '",bIsStub:', bIsStub];
      if (bVerbose) {
        aResult.push(',aCatalogs:', JSON.stringify(aCatalogs));
      }
      aResult.push('})');
      return aResult.join('');
    };


    // constructor code -------------------------------------------------------
    if (!sap.ui2.srvc.Error) {
      fnRequire("sap.ui2.srvc.error");
    }
    if (!sPageId) {
      throw new sap.ui2.srvc.Error("Missing page ID", "sap.ui2.srvc.AllCatalogs");
    }
    jQuery.sap.log.debug("Created: " + this, null, "sap.ui2.srvc.AllCatalogs");
  };
}());
