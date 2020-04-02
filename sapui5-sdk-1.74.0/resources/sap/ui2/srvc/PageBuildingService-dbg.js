// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview A facade to the page building service, providing all needed
 * CRUD operations based on OData4SAP for the entities page, catalog, CHIP,
 * and CHIP instance.
 */

(function () {
  "use strict";
  /*global jQuery, OData, sap */
  jQuery.sap.declare("sap.ui2.srvc.PageBuildingService");

  jQuery.sap.require("sap.ui2.srvc.utils"); // call, Error
  jQuery.sap.require("sap.ui2.srvc.ODataService");
  jQuery.sap.require("sap.ui2.srvc.ODataWrapper");

  // Note: Only the section between @begin and @end is included in pbs-template.js.
  // In pbs-template fnRequire is differently initialized (in case UI5 is not available)!
  // Thus this variable is used in the coding below and not directly jQuery.sap.require.
  // avoid fnRequire = jQuery.sap.require as require cannot be spied on afterwards
  var fnRequire = function () {
    jQuery.sap.require.apply(this, arguments);
  };

  sap.ui2.srvc.testPublishAt = sap.ui2.srvc.testPublishAt || function () {
    // intentionally left blank
  };

/// @begin
  // "public class" ************************************************************

  /**
   * Constructs a facade to the page building service with the given
   * base URI, providing all needed CRUD operations based on OData for the
   * entities page, catalog, bag, CHIP, and CHIP instance.
   * <p>
   * <strong>Ensure that datajs library is available at runtime</strong>. If
   * SAPUI5 is available this script automatically imports their datajs implementation.
   * <p>
   * This facade automatically takes care of Gateway's CSRF protection mechanism
   * via a token. Please perform a read request first, because read requests acquire this token.
   * Otherwise write requests will have fail on first attempt, but automatically acquire this token
   * via reading the service document before repeating the write request. This is a slight
   * performance penalty.
   * <p>
   * The objects returned by this facade are <strong>de-serialized JSON representations</strong>
   * of the entities in question, as converted from the OData's response by datajs.
   * They may be decorated with new properties as long as the property names start with a dollar
   * symbol ("$"). This is needed to tell original properties and decorations apart for the purpose
   * of update operations.
   *
   * @param {string|sap.ui2.srvc.ODataWrapper} vODataBase
   *   either the base URI of the page building service or (since 1.19.0) a corresponding
   *   <code>sap.ui2.srvc.ODataWrapper</code>
   * @param {function (string, [object])} [fnDefaultFailure]
   *   error handler taking an error message and, since version 1.28.6, an
   *   optional object containing the complete error information as delivered
   *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
   *   for more details.
   * @param {boolean} [bIsPersonalization=false]
   *   defines the return value of {@link #isPersonalization}; nothing else (since 1.16.1)
   *
   * @class
   * @augments sap.ui2.srvc.ODataService
   * @since 1.2.0
   */
  sap.ui2.srvc.PageBuildingService = function (vODataBase, fnDefaultFailure, bIsPersonalization) {
    var oWrapper,
      that = this;

    // BEWARE: constructor code below!

    // "private" methods -------------------------------------------------------
    /**
    * Encodes a sting to be used in an OData $filter parameter.
    *
    * @param {string} sString
    *   string to be encoded.
    * @returns {string}
    *   the encoded string
    * @public
    * @since 1.28.0
    */
    function encodeODataFilterValue (sString) {
      return sString.replace(/'/g, "''").replace(/&/g, "%26");
    }

    /**
     * Returns the URL for accessing a bag.
     *
     * @param {string|object} vParent
     *   ID of the page or parent object (either page or page CHIP instance; must be the result
     *   of a previous create or read operation) of the bag to be read
     * @param {string} sBagId
     *  the bag ID
     * @param {boolean} bExpand
     *  tells if the properties of the bag should be expanded in the OData call
     * @returns {string}
     *  relative(!) URL
     *
     * @private
     */
    function getBagUrl (vParent, sBagId, bExpand) {
      var sPageId;

      if (typeof vParent === "string") {
        // for backwards compatibility, allow passing page ID
        sPageId = vParent;
      } else {
        if (vParent.instanceId) {
          // parent is a CHIP instance
          return "ChipInstanceBags(pageId='" + encodeURIComponent(vParent.pageId)
            + "',instanceId='" + encodeURIComponent(vParent.instanceId)
            + "',id='" + encodeURIComponent(sBagId) + "')"
            + (bExpand ? "?$expand=ChipInstanceProperties" : "");
        }
        // parent is a page
        sPageId = vParent.id;
      }
      return "Bags(pageId='" + encodeURIComponent(sPageId)
        + "',id='" + encodeURIComponent(sBagId) + "')"
        + (bExpand ? "?$expand=Properties" : "");
    }

    /**
     * Evaluates status code from OData batch response entry and returns the corresponding OData
     * entity or the status message.
     * @param oEntry The batch response entry which is an element of
     *     (For change) oData.__batchResponses[0]._changeResponses array
     *     (For read) oData.__batchResponses array (without the element for change responses)
     * @returns OData entity (object or undefined) or status message as string
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(that);
    function extractBatchResponseEntry (oEntry) {
      if (oEntry.statusCode === "201") {
        // POST was ok, return the new entity
        return oEntry.data;
      }
      if (oEntry.statusCode === "204") {
        // PUT or DELETE was ok, return nothing
        return undefined;
      }
      // request failed, return error message or empty string
      return oEntry.message || "";
    }

    /**
     * Sends a batch request to the OData server. The batch request contains a
     * sequence of change requests (PUT, POST) contained in a single changeset.
     *
     * @param {array} [aChangeRequests=[]]
     *   array of objects representing the change requests as specified by datajs. See
     *   <a href="http://datajs.codeplex.com/wikipage?title=OData%20Code%20Snippets&referringTitle=Documentation">
     *   datajs batch coding sample</a> and
     *   <a href="http://datajs.codeplex.com/wikipage?title=OData%20Payload%20Formats#Batch Requests">
     *   datajs payload format for batch</a>
     * @param {array} [aGetRequests]
     *   array of objects representing the read requests as specified by datajs
     * @param {function(array,array)} [fnSuccess]
     *   a callback function that is executed if the request succeeds, taking
     *   an array of response objects with responses for each change request
     *   and an array with responses for each read request. For a successful
     *   POST, the response object is the new entity, for a successful PUT it
     *   is undefined and for a successful GET it is the entity returned. For a
     *   failed request it is the corresponding error message.
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @private
     * @deprecated Used only by {@link sap.ui2.srvc.PageBuildingService#updateBagProperties}.
     */
    sap.ui2.srvc.testPublishAt(that);
    function batch (aChangeRequests, aGetRequests, fnSuccess, fnFailure) {
      /*jslint nomen:true */
      var aRequests = [];

      function extract (aResponses) {
        var i, aResult = [];

        for (i = 0; i < aResponses.length; i += 1) {
          aResult[i] = extractBatchResponseEntry(aResponses[i]);
        }
        return aResult;
      }

      fnSuccess = fnSuccess || function () { /* null object pattern */ };
      fnFailure = fnFailure || that.getDefaultErrorHandler();
      oWrapper.check(fnSuccess, fnFailure);

      aChangeRequests = aChangeRequests || [];
      aGetRequests = aGetRequests || [];
      if (aChangeRequests.length > 0) {
        aRequests.push({ __changeRequests: aChangeRequests});
      }
      aRequests = aRequests.concat(aGetRequests);
      if (aRequests.length === 0) {
        sap.ui2.srvc.call(fnSuccess.bind(null, [], []), fnFailure, true);
        return;
      }
      oWrapper.batch({ __batchRequests: aRequests },
        function (oData) {
          var aBatchResponses = oData.__batchResponses,
            aChangeResponses = aBatchResponses[0].__changeResponses;

          if (aBatchResponses[0].response && aBatchResponses[0].message) { // error
            oWrapper.onError("POST", oWrapper.getBaseUrl() + "$batch", fnFailure, undefined,
              oData.__batchResponses[0]);
            return;
          }
          if ((aChangeResponses && (aChangeResponses.length !== aChangeRequests.length))
              || (aBatchResponses.length !== aRequests.length)) {

            fnFailure("Number of requests differs from number of responses in $batch");
            return;
          }
          if (aChangeResponses) { // change requests and (maybe) additional read requests
            sap.ui2.srvc.call(
              fnSuccess.bind(null, extract(aChangeResponses), extract(aBatchResponses.slice(1))),
              fnFailure,
              false
            );
          } else { //read requests only
            sap.ui2.srvc.call(
              fnSuccess.bind(null, [], extract(aBatchResponses)),
              fnFailure,
              false
            );
          }
        },
        fnFailure);
    }

    // "public" methods --------------------------------------------------------

    /**
     * Tells whether this facade is reading from and writing to the "PERSONALIZATION" scope.
     *
     * @returns {boolean}
     *   whether this facade is reading from and writing to the "PERSONALIZATION" scope
     * @since 1.16.1
     */
    this.isPersonalization = function () {
      return !!bIsPersonalization;
    };

    /**
     * Reads the metadata document of the page building service.
     *
     * @param {function (object)} fnSuccess
     *   a callback function that is executed if the request succeeds, taking
     *   the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @param {boolean} bNoCache
     *   (since 1.5.0) whether to avoid caching
     * @since 1.2.0
     *
     * @deprecated Since 1.17.0 it is no longer necessary to fetch a CSRF token first; this is
     *   done automatically.
     */
    this.readMetadata = function (fnSuccess, fnFailure, bNoCache) {
      var sRequestUrl = oWrapper.getBaseUrl() + "$metadata" + (bNoCache ? "?" + Date.now() : "");

      fnFailure = fnFailure || this.getDefaultErrorHandler();
      oWrapper.check(fnSuccess, fnFailure);

      OData.read(sRequestUrl, function (oData) {
        // Note: drop excess parameters; try/catch
        sap.ui2.srvc.call(fnSuccess.bind(null, oData), fnFailure);
      }, oWrapper.onError.bind(oWrapper, "GET", sRequestUrl, fnFailure, /*oDeferred*/undefined),
        OData.metadataHandler);
    };

    /**
     * Deletes the bag with given IDs.
     * It is not an error if the bag does not exist.
     *
     * @param {string|object} vParent
     *   ID of the page or parent object (either page or page CHIP instance; must be the result
     *   of a previous create or read operation) of the bag to be deleted
     * @param {string} sBagId
     *   ID of the bag to be deleted
     * @param {function ()} [fnSuccess]
     *   a callback function that is executed if delete succeeds, taking no data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @since 1.3.0
     */
    this.deleteBag = function (vParent, sBagId, fnSuccess, fnFailure) {
      if (!vParent) {
        throw new sap.ui2.srvc.Error("Missing parent ID or object",
          "sap.ui2.srvc.PageBuildingService");
      }
      if (!sBagId) {
        throw new sap.ui2.srvc.Error("Missing bag ID", "sap.ui2.srvc.PageBuildingService");
      }

      oWrapper.del(getBagUrl(vParent, sBagId, false), fnSuccess, fnFailure);
    };

    /**
     * Reads the bag with the given IDs.
     *
     * @param {string|object} vParent
     *   ID of the page or parent object (either page or page CHIP instance; must be the result
     *   of a previous create or read operation) of the bag to be read
     * @param {string} sBagId
     *   ID of the bag to be read. If the bag does not exist the error handler will be called.
     * @param {function (object)} fnSuccess
     *   a callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @since 1.3.0
     */
    this.readBag = function (vParent, sBagId, fnSuccess, fnFailure) {
      if (!vParent) {
        throw new sap.ui2.srvc.Error("Missing parent ID or object",
          "sap.ui2.srvc.PageBuildingService");
      }
      if (!sBagId) {
        throw new sap.ui2.srvc.Error("Missing bag ID", "sap.ui2.srvc.PageBuildingService");
      }
      oWrapper.read(getBagUrl(vParent, sBagId, true), fnSuccess, fnFailure);
    };

    /**
     * Reads the "allCatalogs" collection (ordered by ID) that belongs to the page with the given
     * ID.
     *
     * @param {string} sPageId
     *   ID of the page
     * @param {function (object)} fnSuccess
     *   a callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @param {string} [sFilter]
     *   filter value as defined by OData specification e.g. "type eq 'H'" for HANA catalogs.
     *   Filter has been introduced with version 1.16.2.
     * @param {string} sSorting
     *   name of the field to be sorted on via $orderby as defined by OData specification.
     *   If not defined the dafault sorting would be on the field id (since 1.44)
     * @param {string} bCache
     * Use cache when true, added with 1.70 .0
     * @since 1.7.0
     */
    this.readAllCatalogs = function (sPageId, fnSuccess, fnFailure, sFilter, sSorting, bCache) {
      var sSortField = "id";
      bCache = bCache === undefined ? true : bCache;
      if (sSorting && typeof sSorting === "string") {
        sSortField = sSorting;
      }
      var sUrl = "Pages('" + encodeURIComponent(sPageId)
          + "')/allCatalogs?$expand=Chips/ChipBags/ChipProperties&"
          +  "$orderby=" + sSortField;
      if (sFilter && typeof sFilter === "string") {
        sUrl = sUrl + "&$filter=" + encodeURIComponent(sFilter);
      }
      if (this.readAllCatalogs.cacheBusterTokens && this.readAllCatalogs.cacheBusterTokens.get(sPageId)) {
        // There is a cache buster token maintained (!== "") for this ID, so add it to the URL
        sUrl += "&sap-cache-id=" + this.readAllCatalogs.cacheBusterTokens.get(sPageId);
      }
      oWrapper.read(sUrl, fnSuccess, fnFailure, bCache);
    };

    /**
     * Reads all catalogs ordered by ID.
     *
     * @param {function (object)} fnSuccess
     *   a callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @param {string} [sFilter]
     *   filter value as defined by OData specification e.g. "type eq 'H'" for HANA catalogs.
     *   Filter has been introduced with version 1.26.0
     * @since 1.2.0
     */
    this.readCatalogs = function (fnSuccess, fnFailure, sFilter) {
      var sUrl = "Catalogs?$orderby=id";
      if (sFilter && typeof sFilter === "string") {
        sUrl = sUrl + "&$filter=" + encodeURIComponent(sFilter);
      }
      oWrapper.read(sUrl, fnSuccess, fnFailure);
    };

    /**
     * Reads all catalogs for current user filtered by given expression.
     * @param {string} sFilter
     *   filter value as defined by OData specification e.g. "type eq 'H'" for HANA catalogs
     * @param {function (object)} fnSuccess
     *   a callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @private
     */
    this.readAllCatalogsForUser = function (sFilter, fnSuccess, fnFailure) {
      var sUrlParameter = sFilter ? "?$filter=" + encodeURIComponent(sFilter) : "";
      // Page ID for the allCatalogs relation is not relevant
      oWrapper.read("Pages('unused')/allCatalogs" + sUrlParameter, fnSuccess, fnFailure);
    };

    /**
     * Detect if a CHIP is referenced by other CHIPs, also within other catalogs.
     * The CHIP which is checked is specified by its ID (not the ID of its CHIP instance
     * representation on the catalog page).
     * The success handler receives an array of all catalog IDs which contain at least
     * one CHIP which references the CHIP with sReferenceChipId.
     * If the request fails, fnFailure is invoked.
     *
     * @param {string} sReferencedChipId
     *   ID of the CHIP for which references are searched
     * @param {function (array)} fnSuccess
     *   A callback function that is executed if the request succeeds. It is taking an array of
     *   catalog IDs which contain the referenced CHIP ID.
     *   The list may be in arbitrary order, notably not the order of the initial array
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @since 1.28.0
     */
    this.getReferencingCatalogIds = function (sReferencedChipId, fnSuccess, fnFailure) {
      // support SP11 interface: sReferencedChipId, aCatalogIds, fnSuccess, fnFailure
      if (typeof fnSuccess !== "function") {
        fnSuccess = fnFailure;
        // note: using arguments[3] leads to Lint warnings but a named arg will be visible in JSDoc
        fnFailure = arguments[3];
      }

      function success (oResponse) {
        var aRefCatalogIds = [],
          aReferenceChips = oResponse.results || [];

        aReferenceChips.forEach(function (oChip) {
          if (oChip.referenceChipId === sReferencedChipId) { //remove when CSN 1570015473 is solved
            // no redundant catalog Ids in aRefCatalogIds
            if (aRefCatalogIds.indexOf(oChip.catalogId) === -1) {
              aRefCatalogIds.push(oChip.catalogId);
            }
          }
        });

        fnSuccess(aRefCatalogIds);
      }

      // parameter checks
      if (typeof sReferencedChipId !== "string") {
        throw new sap.ui2.srvc.Error("sReferencedChipId must be a string",
          "sap.ui2.srvc.test.PageBuildingService");
      }
      if (typeof fnSuccess !== "function") {
        throw new sap.ui2.srvc.Error("fnSuccess is mandatory",
          "sap.ui2.srvc.test.PageBuildingService");
      }

      oWrapper.read("Chips?$filter=" + encodeURIComponent("referenceChipId eq '" +
        encodeODataFilterValue(sReferencedChipId) + "'"),
        success,
        function (sMsg /*, oErrorInformation */) {
          /* eslint-disable no-new */
          new sap.ui2.srvc.Error(sMsg, "sap.ui2.srvc.PageBuildingService");
          /* eslint-enable no-new */
          fnFailure.apply(null, arguments);
        });
    };

    /**
     * Creates a new catalog based on a catalog page, using the given domain ID and title. Note
     * that the page building service will default to a certain type (e.g. "CATALOG_PAGE" in case
     * of ABAP) and will create an ID from that type and the given domain-specific ID (e.g. by
     * adding the prefix "X-SAP-UI2-CATALOGPAGE:" in case of ABAP). Access the object passed to the
     * success callback in order to learn the resulting ID! Note that the catalog page has the
     * same ID as the corresponding catalog and can be retrieved by {@link #readPage}.
     *
     * @param {string} sDomainId
     *   the catalog's domain-specific ID
     * @param {string} [sTitle]
     *   the catalog's title, also used for the catalog page
     * @param {function (object)} [fnSuccess]
     *   a callback function that is executed if the request succeeds, taking the processed data
     *   (as a catalog, not as a page)
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   Default: see {@link #getDefaultErrorHandler}
     *
     * @since 1.19.1
     */
    this.createPageBasedCatalog = function (sDomainId, sTitle, fnSuccess, fnFailure) {
      if (!sDomainId) {
        throw new sap.ui2.srvc.Error("Missing domain ID", "sap.ui2.srvc.PageBuildingService");
      }
      // TODO: test if type: "CATALOG_PAGE" is the default so we dont need to set it here.
      oWrapper.create("Catalogs", {domainId: sDomainId, title: sTitle, type: "CATALOG_PAGE"},
          fnSuccess, fnFailure);
    };

    /**
     * Creates a new catalog based on the given raw data. Typically, this will be used to create
     * "remote catalogs", i.e. pointers to existing catalogs on a remote server.
     *
     * @param {object} oCatalog
     *   the raw catalog representation (<code>__metadata</code> not needed!), e.g.
     *   <pre>
     *   {
     *     baseUrl: "/sap/hba/apps/kpi/s/odata/hana_chip_catalog.xsodata/",
     *     domainId: "Z_REMOTE_HANA_CATALOG",
     *     remoteId: "HANA_CATALOG",
     *     systemAlias: "sanssouci",
     *     title: "Remote HANA catalog",
     *     type: "REMOTE"
     *   }
     *   </pre>
     * @param {function (object)} fnSuccess
     *   a callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *
     * @since 1.19.1
     */
    this.createCatalog = function (oCatalog, fnSuccess, fnFailure) {
      oWrapper.create("Catalogs", oCatalog, fnSuccess, fnFailure);
    };

    /**
     * Deletes the catalog with the given representation which must be the result of a previous
     * create or read operation. If the catalog is based on a catalog page
     * ({@link #createPageBasedCatalog}), that page is also deleted including all of its CHIP
     * instances and bags.
     *
     * @param {object} oCatalog
     *   the de-serialized JSON representing the catalog to be deleted
     * @param {function ()} [fnSuccess]
     *   a callback function that is executed if the request succeeds, taking no data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   Default: see {@link #getDefaultErrorHandler}
     *
     * @since 1.19.1
     */
    this.deleteCatalog = function (oCatalog, fnSuccess, fnFailure) {
      oWrapper.del(oCatalog, fnSuccess, fnFailure);
    };

    /**
     * Creates a new catalog in the backend as a clone of the catalog with given ID, using the
     * given new domain ID. Note that the page building service will create an ID from the
     * catalog's type and the given domain-specific ID (e.g. by adding the prefix
     * "X-SAP-UI2-CATALOGPAGE:" for type "CATALOG_PAGE" in case of ABAP). Access the object passed
     * to the success callback in order to learn the resulting ID!
     *
     * @param {string} sCatalogId
     *   the old catalog's ID as returned from the page building service
     * @param {string} sNewDomainId
     *   the new catalog's domain-specific ID which must not contain a colon
     * @param {string} [sNewTitle]
     *   the new catalog's title; if the parameter is <code>undefined</code>,
     *   the old catalog's title will be used
     * @param {function (object)} fnSuccess
     *   a callback function that is executed if the request succeeds, taking the processed data
     *   (BEWARE: the Chips relation is not expanded, but still deferred!)
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   Default: see {@link #getDefaultErrorHandler}
     * @since 1.19.1
     */
    this.cloneCatalog = function (sCatalogId, sNewDomainId, sNewTitle, fnSuccess, fnFailure) {
      if (!sCatalogId) {
        throw new sap.ui2.srvc.Error("Missing source catalog ID",
          "sap.ui2.srvc.PageBuildingService");
      }
      if (!sNewDomainId) {
        throw new sap.ui2.srvc.Error("Missing new domain ID", "sap.ui2.srvc.PageBuildingService");
      }
      if (sNewDomainId.indexOf(":") >= 0) {
        throw new sap.ui2.srvc.Error("Illegal domain ID: " + sNewDomainId,
          "sap.ui2.srvc.PageBuildingService");
      }

      oWrapper.create("CloneCatalog?sourceId='" + encodeURIComponent(sCatalogId)
        + "'&targetId='" + encodeURIComponent(sNewDomainId)
        + (sNewTitle !== undefined  ? "'&title='" + encodeURIComponent(sNewTitle) + "'" : "'"),
        {}, //payload
        fnSuccess,
        fnFailure);
    };

    /**
     * Adds a reference CHIP instance to the page with ID <code>sTargetPageId</code>. The new
     * reference refers to the CHIP instance with the given ID located on the source page with the
     * given ID.
     *
     * @param {string} sSourcePageId
     *   ID of the source page the CHIP instance with ID <code>sSourceChipInstanceId</code> is
     *   located on
     * @param {string} sSourceChipInstanceId
     *   ID of the CHIP instance referenced to
     * @param {string} sTargetPageId
     *   ID of the page where the reference CHIP Instance shall be added to
     * @param {function (object)} fnSuccess
     *   a callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   Default: see {@link #getDefaultErrorHandler}
     *
     * @since 1.21.1
     */
    this.clonePageChipInstance = function (sSourcePageId, sSourceChipInstanceId,
      sTargetPageId, fnSuccess, fnFailure) {

      if (!sSourcePageId) {
        throw new sap.ui2.srvc.Error("Missing source page ID",
          "sap.ui2.srvc.PageBuildingService");
      }
      if (!sSourceChipInstanceId) {
        throw new sap.ui2.srvc.Error("Missing source CHIP instance ID",
          "sap.ui2.srvc.PageBuildingService");
      }
      if (!sTargetPageId) {
        throw new sap.ui2.srvc.Error("Missing target page ID",
          "sap.ui2.srvc.PageBuildingService");
      }
      oWrapper.create("ClonePageChipInstance?sourcePageId='" + encodeURIComponent(sSourcePageId)
        + "'&sourceChipInstanceId='" + encodeURIComponent(sSourceChipInstanceId)
        + "'&targetPageId='" + encodeURIComponent(sTargetPageId) + "'",
        {}, //payload
        function (oRawChipInstance) {
          // ClonePageChipInstance cannot expand the result
          // Note: the CHIP instance cannot be remote and the CHIP has already been loaded
          oWrapper.read("PageChipInstances(pageId='" + encodeURIComponent(oRawChipInstance.pageId)
            + "',instanceId='" + encodeURIComponent(oRawChipInstance.instanceId) + "')"
            + "?$expand=ChipInstanceBags/ChipInstanceProperties",
            fnSuccess,
            fnFailure);
        },
        fnFailure);
    };

    /**
     * Reads the catalog with the given ID including all contained CHIPs (unless specified
     * otherwise). Note that the corresponding catalog page (if applicable) has the same ID and can
     * be retrieved by {@link #readPage}.
     *
     * @param {string} sCatalogId
     *   ID of the catalog to be loaded
     * @param {function (object)} fnSuccess
     *   a callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @param {boolean} [bNoChips=false]
     *   whether to avoid including all contained CHIPs
     * @param {boolean} [bNoChipBags=false]
     *   whether to avoid including CHIP bags and properties
     * @since 1.2.0
     */
    this.readCatalog = function (sCatalogId, fnSuccess, fnFailure, bNoChips, bNoChipBags) {
      var sUrl;

      if (!sCatalogId) {
        throw new sap.ui2.srvc.Error("Missing catalog ID", "sap.ui2.srvc.PageBuildingService");
      }

      sUrl = "Catalogs('" + encodeURIComponent(sCatalogId) + "')";
      if (!bNoChips) {
        sUrl += "?$expand=Chips";
        if (!bNoChipBags) {
          sUrl += "/ChipBags/ChipProperties";
        }
      }
      oWrapper.read(sUrl, fnSuccess, fnFailure);
    };

    /**
     * Updates the catalog with the given representation which must be the result of a previous
     * create or read operation. Note that you cannot update keys, in this case the "id" property.
     * Note that for a catalog based on a catalog page ({@link #createPageBasedCatalog}), the
     * "title" property is shared between the catalog and its corresponding catalog page!
     *
     * @param {object} oCatalog
     *   the de-serialized JSON representing the catalog to be updated
     * @param {function ()} [fnSuccess]
     *   a callback function that is executed if the request succeeds, taking no data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *
     * @since 1.19.1
     */
    this.updateCatalog = function (oCatalog, fnSuccess, fnFailure) {
      oWrapper.update(oCatalog, fnSuccess, fnFailure);
    };

    /**
     * Reads the given CHIPs from the catalog with the given ID.
     *
     * @param {string} sCatalogId
     *   ID of the catalog to be loaded
     * @param {string[]} [aChipIds]
     *   the IDs of the CHIPs to be loaded. If <code>undefined</code>, all CHIPs will be loaded.
     * @param {function (object)} fnSuccess
     *   a callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @throws Error if an empty array is given for filtering
     * @since 1.16.4
     */
    this.readCatalogChips = function (sCatalogId, aChipIds, fnSuccess, fnFailure) {
      var sUrl,
        sFilter = "",
        sPrefix = "?$filter=";

      if (!sCatalogId) {
        throw new sap.ui2.srvc.Error("Missing catalog ID", "sap.ui2.srvc.PageBuildingService");
      }

      // TODO: read also CHIP bags
      sUrl = "Catalogs('" + encodeURIComponent(sCatalogId) + "')/Chips";
      if (aChipIds) {
        if (!aChipIds.length) {
          throw new sap.ui2.srvc.Error("No CHIP IDs given", "sap.ui2.srvc.PageBuildingService");
        }
        aChipIds.forEach(function (sId) {
          sFilter = sFilter + sPrefix + "id%20eq%20'" + encodeURIComponent(sId) + "'";
          sPrefix = "%20or%20";
        });
        // ensure that the resulting URL does not exceed length limits
        if (oWrapper.getBaseUrl().length + sUrl.length + sFilter.length > 2000) {
          sFilter = "";
        }
      }
      oWrapper.read(sUrl + sFilter, fnSuccess, fnFailure);
    };

    /**
     * Creates a new page with the given properties.
     *
     * @param {string} sId
     *   ID of the new page
     * @param {string} sCatalogId
     *   ID of the catalog for the new page
     * @param {string} sLayout
     *   value of the layout property for the new page
     * @param {string} sTitle
     *   title of the new page
     * @param {function (object)} [fnSuccess]
     *   a callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @since 1.2.0
     */
    this.createPage = function (sId, sCatalogId, sLayout, sTitle, fnSuccess, fnFailure) {
      if (!sId) {
        throw new sap.ui2.srvc.Error("Missing page ID", "sap.ui2.srvc.PageBuildingService");
      }

      oWrapper.create("Pages", {
        id: sId,
        catalogId: sCatalogId,
        layout: sLayout,
        title: sTitle
      }, fnSuccess, fnFailure);
    };

    /**
     * Reads all pages ordered by ID including all contained catalogs (unless specified otherwise).
     *
     * @param {function (object)} fnSuccess
     *   a callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @param {boolean} [bNoCatalogs=false]
     *   whether to avoid including all contained catalogs
     * @since 1.2.0
     */
    this.readPages = function (fnSuccess, fnFailure, bNoCatalogs) {
      var sUrl = "Pages?";
      if (!bNoCatalogs) {
        sUrl += "$expand=Catalog&";
      }
      oWrapper.read(sUrl + "$orderby=id", fnSuccess, fnFailure);
    };

    /**
     * Reads the page with the given ID including all contained <br>
     * - CHIP instances and their CHIPs, <br>
     * - bags and properties (page, CHIP and CHIP instance bags), <br>
     * - RemoteCatalog data.
     * <p>
     * Via the parameter <code>sCustomExpand</code> you can specify a different $expand statement.
     *
     * @param {string} sId
     *   ID of the page to be read
     * @param {function (object)} fnSuccess
     *   a callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @param {string} [sCustomExpand="Bags/Properties,PageChipInstances/Chip/ChipBags/ChipProperties,PageChipInstances/RemoteCatalog,PageChipInstances/ChipInstanceBags/ChipInstanceProperties"]
     *   (since 1.30.0) can be used to overwrite the default $expand value. If "" is used, the
     *   entire $expand parameter will be skipped
     * @since 1.2.0
     */
    this.readPage = function (sId, fnSuccess, fnFailure, sCustomExpand) {
      var sUrl = "Pages('" + encodeURIComponent(sId) + "')";
      if (!sId) {
        throw new sap.ui2.srvc.Error("Missing page ID", "sap.ui2.srvc.PageBuildingService");
      }

      if (sCustomExpand === undefined) {
        // use default expand
        sUrl += "?$expand=Bags/Properties,PageChipInstances/Chip/ChipBags/ChipProperties,"
          + "PageChipInstances/RemoteCatalog,"
          + "PageChipInstances/ChipInstanceBags/ChipInstanceProperties";
      } else if (sCustomExpand !== "") {
        sUrl += "?$expand=" + sCustomExpand;
      }

      oWrapper.read(sUrl, fnSuccess, fnFailure);
    };

    /**
     * Reads the page set with the given ID including all contained pages and their CHIP instances.
     * Property bags are not loaded.
     * Note: Cache buster tokens (sap-cache-id), can be set via
     * <code>oPbs.readPageSet.cacheBusterTokens.put("PageSetId", "cbtoken")</code>
     *
     * @param {string} sId
     *   ID of the page set to be read
     * @param {function (object)} fnSuccess
     *   a callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @param {string} bCache
     *   Use cache when true, added with 1.70.0
     * @since 1.11.0
     * @private
     */
    this.readPageSet = function (sId, fnSuccess, fnFailure, bCache) {
      var sUrl;
      var that = this;
      var appendedParametersKeys;
      bCache = bCache === undefined ? true : bCache;

      if (!sId) {
        throw new sap.ui2.srvc.Error("Missing page set ID", "sap.ui2.srvc.PageBuildingService");
      }

      sUrl = "PageSets('" + encodeURIComponent(sId) + "')?$expand="
        + "Pages/PageChipInstances/Chip/ChipBags/ChipProperties,"
        + "Pages/PageChipInstances/RemoteCatalog,"
        + "Pages/PageChipInstances/ChipInstanceBags/ChipInstanceProperties,"
        + "AssignedPages,"
        + "DefaultPage";

      if (this.readPageSet.cacheBusterTokens && this.readPageSet.cacheBusterTokens.get(sId)) {
        // There is a cache buster token maintained (!== "") for this ID, so add it to the URL
        // Note: Same parameter order as in ABAP bootstrap must be used as the response is cached
        // in OData.read.$cache under exactly that URL string
        sUrl += "&sap-cache-id=" + this.readPageSet.cacheBusterTokens.get(sId);
      }
      if (this.readPageSet.appendedParameters) {
        appendedParametersKeys = Object.keys(this.readPageSet.appendedParameters);
        if (appendedParametersKeys.length > 0) {
          appendedParametersKeys.sort();
          appendedParametersKeys.forEach(function (key) {
            sUrl += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(that.readPageSet.appendedParameters[key]);
          });
        }
      }
      oWrapper.read(sUrl, fnSuccess, fnFailure, bCache);
    };

    /**
     * Updates the page set with the given representation which must be the result of
     * a previous read operation.
     *
     * @param {object} oPageSet
     *   the de-serialized JSON representing the page set to be updated
     * @param {function ()} [fnSuccess]
     *   a callback function that is executed if the request succeeds, taking no data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @since 1.11.0
     * @private
     */
    this.updatePageSet = function (oPageSet, fnSuccess, fnFailure) {
      oWrapper.update(oPageSet, fnSuccess, fnFailure);
    };

    /**
     * Creates a new page with given title in given page set.
     *
     * @param {string} sPageSetId
     *   ID of the page set
     * @param {string} sPageTitle
     *   title (might be an empty) of the new page
     * @param {string} sCatalogId
     *   ID of the default catalog of the new page
     * @param {function (object)} fnSuccess
     *   a callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @private
     */
    this.createPageInPageSet = function (sPageSetId, sPageTitle, sCatalogId, fnSuccess, fnFailure) {
      // TODO refactor parameters use one object instead of multiple strings
      if (!sPageSetId) {
        throw new sap.ui2.srvc.Error("Missing page set ID", "sap.ui2.srvc.PageBuildingService");
      }
      oWrapper.create("PageSets('" + encodeURIComponent(sPageSetId) + "')/Pages", {
        catalogId: sCatalogId || "",
        layout: "",
        title: sPageTitle || ""
      }, fnSuccess, fnFailure);
    };


    /**
     * Updates the page with the given representation which must be the result of
     * a previous create or read operation.
     *
     * @param {object} oPage
     *   the de-serialized JSON representing the page to be updated
     * @param {function ()} [fnSuccess]
     *   a callback function that is executed if the request succeeds, taking no data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @since 1.2.0
     */
    this.updatePage = function (oPage, fnSuccess, fnFailure) {
      oWrapper.update(oPage, fnSuccess, fnFailure);
    };

    /**
     * Deletes the page with the given ID.
     *
     * @param {string} sId
     *   ID of page to be deleted
     * @param {function ()} [fnSuccess]
     *   a callback function that is executed if the request succeeds, taking no data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @since 1.2.0
     */
    this.deletePage = function (sId, fnSuccess, fnFailure) {
      if (!sId) {
        throw new sap.ui2.srvc.Error("Missing page ID", "sap.ui2.srvc.PageBuildingService");
      }

      oWrapper.del("Pages('" + encodeURIComponent(sId) + "')",
        fnSuccess, fnFailure);
    };

    /**
     * Creates a CHIP instance with the given properties inside the page with given ID.
     *
     * @param {string} sPageId
     *   ID of page containing the new CHIP instance
     * @param {string} [sInstanceId]
     *   ID of new CHIP instance (optional, a UUID will be created as a default)
     * @param {string} sChipId
     *   ID of CHIP to be used
     * @param {string} sTitle
     *   title of CHIP instance
     * @param {string} sConfiguration
     *   configuration of CHIP instance
     * @param {string} sLayoutData
     *   layout data of CHIP instance
     * @param {function (object)} [fnSuccess]
     *   a callback function that is executed if the request succeeds, taking the processed data
     *   (Note: The instance's "Chips" relation will not be expanded!)
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @since 1.2.0
     */
    this.createPageChipInstance = function (sPageId, sInstanceId,
      sChipId, sTitle, sConfiguration, sLayoutData, fnSuccess, fnFailure) {
      this.createPageChipInstanceFromRawData({
        pageId: sPageId,
        instanceId: sInstanceId,
        chipId: sChipId,
        title: sTitle,
        configuration: sConfiguration,
        layoutData: sLayoutData
      }, fnSuccess, fnFailure);
    };

    /**
     * Creates a CHIP instance with the given properties inside the page with given ID.
     *
     * @param {object} oChipInstance
     *   the de-serialized JSON representing the CHIP instance to be created
     * @param {string} oChipInstance.pageId
     *   ID of page containing the new CHIP instance
     * @param {string} [oChipInstance.instanceId]
     *   ID of new CHIP instance (optional, a UUID will be created as a default)
     * @param {string} oChipInstance.chipId
     *   ID of CHIP to be used
     * @param {string} [oChipInstance.title]
     *   title of CHIP instance
     * @param {string} [oChipInstance.configuration]
     *   configuration of CHIP instance
     * @param {string} [oChipInstance.layoutData]
     *   layout data of CHIP instance
     * @param {function (object)} [fnSuccess]
     *   a callback function that is executed if the request succeeds, taking the processed data
     *   (Note: The instance's "Chips" relation will not be expanded!)
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @since 1.9.0
     */
    this.createPageChipInstanceFromRawData = function (oChipInstance, fnSuccess, fnFailure) {
      if (typeof oChipInstance !== "object") {
        throw new sap.ui2.srvc.Error("Invalid raw data", "sap.ui2.srvc.PageBuildingService");
      }
      if (!oChipInstance.pageId) {
        throw new sap.ui2.srvc.Error("Missing page ID", "sap.ui2.srvc.PageBuildingService");
      }
      if (!oChipInstance.chipId) {
        throw new sap.ui2.srvc.Error("Missing CHIP ID", "sap.ui2.srvc.PageBuildingService");
      }
      oChipInstance.instanceId = oChipInstance.instanceId || "";
      oChipInstance.title = oChipInstance.title || "";
      oChipInstance.configuration = oChipInstance.configuration || "";
      oChipInstance.layoutData = oChipInstance.layoutData || "";
      //oChipInstance.remoteCatalogId = oChipInstance.remoteCatalogId || "";

      //TODO the equivalent of "?$expand=Chips/ChipBags/ChipProperties" is missing!
      oWrapper.create("PageChipInstances", oChipInstance, fnSuccess, fnFailure);
    };

    /**
     * Updates the CHIP instance with the given representation which must be the
     * result of a previous create or read operation.
     *
     * @param {object} oChipInstance
     *   the de-serialized JSON representing the CHIP instance to be updated
     * @param {function ()} [fnSuccess]
     *   a callback function that is executed if the request succeeds, taking no data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @since 1.2.0
     */
    this.updatePageChipInstance = function (oChipInstance, fnSuccess, fnFailure) {
      oWrapper.update(oChipInstance, fnSuccess, fnFailure);
    };

    /**
     * Deletes the CHIP instance with the given ID inside the page with given ID.
     *
     * @param {string} sPageId
     *   ID of page from which CHIP instance is to be deleted
     * @param {string} sInstanceId
     *   ID of CHIP instance to be deleted
     * @param {function ()} [fnSuccess]
     *   a callback function that is executed if the request succeeds, taking no data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @since 1.2.0
     */
    this.deletePageChipInstance = function (sPageId, sInstanceId, fnSuccess, fnFailure) {
      if (!sPageId) {
        throw new sap.ui2.srvc.Error("Missing page ID", "sap.ui2.srvc.PageBuildingService");
      }
      if (!sInstanceId) {
        throw new sap.ui2.srvc.Error("Missing instance ID", "sap.ui2.srvc.PageBuildingService");
      }

      oWrapper.del("PageChipInstances(pageId='" + encodeURIComponent(sPageId)
        + "',instanceId='" + encodeURIComponent(sInstanceId) + "')",
        fnSuccess, fnFailure);
    };

    /**
     * Updates all changed properties for the specified bag using a single batch request.
     *
     * @param {object} oParent
     *   parent of the bag to be updated (either page or page CHIP instance)
     * @param {string} sBagId
     *   ID of the bag
     * @param {array} [aChangedProperties=[]]
     *   array of existing properties to be changed
     * @param {array} [aNewProperties=[]]
     *   array of properties to be created
     * @param {array} [aResetProperties=[]]
     *   array of properties to be reset (since 1.17.1)
     * @param {function(array,array,array)} [fnSuccess]
     *   a callback function that is executed if the request succeeds, taking three arrays of
     *   response objects for changed, new and reset properties respectively.
     *   For a successful creation, the response object is the new entity. For a successful
     *   change, it is undefined. For a successful reset it is the entity from the underlying scope
     *   or undefined if this does not exist.
     *   For a failed request, it is the corresponding error message.
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   <br/>
     *   <b>NOTE:</b> it is called only in case the whole
     *   <code>$batch</code> request fails!)
     *
     * @since 1.11.0
     * @deprecated Use {@link sap.ui2.srvc.ODataService#openBatchQueue} instead.
     */
    this.updateBagProperties = function (oParent, sBagId, aChangedProperties, aNewProperties,
      aResetProperties, fnSuccess, fnFailure) {
      var aChangeRequests = [],
        aGetRequests = [],
        i,
        pos,
        oProperty,
        sRequestUri,
        sMETADATA = "__metadata"; // constant to make JSLint happy

      /* @returns {object} */
      function extractPayload (oEntity) {
        var oResult = {
            "__metadata": {
              type: oEntity[sMETADATA].type,
              uri: oEntity[sMETADATA].uri
            }
          },
          sPropertyName;

        // filter out unnecessary properties
        for (sPropertyName in oEntity) {
          if (Object.prototype.hasOwnProperty.call(oEntity, sPropertyName)
              && sPropertyName !== sMETADATA
              && sPropertyName.indexOf('$') !== 0
              && typeof oEntity[sPropertyName] !== "object") {
            oResult[sPropertyName] = oEntity[sPropertyName];
          }
        }
        return oResult;
      }

      if (!oParent) {
        throw new sap.ui2.srvc.Error("Missing parent object",
          "sap.ui2.srvc.PageBuildingService");
      }

      if (!sBagId) {
        throw new sap.ui2.srvc.Error("Missing bag ID", "sap.ui2.srvc.PageBuildingService");
      }

      //Compatibility for callers not having newly inserted parameter aResetProperties
      if (typeof aResetProperties === "function") {
        this.updateBagProperties(oParent, sBagId, aChangedProperties, aNewProperties, [],
            /*fnSuccess=*/aResetProperties, /*fnFailure=*/fnSuccess);
        return;
      }

      aChangedProperties = aChangedProperties || [];
      aNewProperties = aNewProperties || [];
      aResetProperties = aResetProperties || [];

      if (aChangedProperties.length === 0 && aNewProperties.length === 0 &&
          aResetProperties.length === 0) {
        throw new sap.ui2.srvc.Error("No properties to update, create or reset",
          "sap.ui2.srvc.PageBuildingService");
      }

      // PUT requests
      for (i = 0; i < aChangedProperties.length; i += 1) {
        oProperty = aChangedProperties[i];
        sRequestUri = oProperty[sMETADATA].uri;
        // cut protocol, hostname and base URI from request URI
        pos = sRequestUri.indexOf(oWrapper.getBaseUrl());
        if (pos >= 0) {
          sRequestUri = sRequestUri.slice(pos + oWrapper.getBaseUrl().length);
        }
        aChangeRequests.push({
          requestUri: sRequestUri,
          method: "PUT",
          data: extractPayload(oProperty)
        });
      }

      // POST requests
      sRequestUri = oParent.instanceId ? "ChipInstanceProperties" : "Properties";
      for (i = 0; i < aNewProperties.length; i += 1) {
        oProperty = aNewProperties[i];
        if (!oProperty.name) {
          throw new sap.ui2.srvc.Error("Missing property name", "sap.ui2.srvc.PageBuildingService");
        }
        if (oParent.instanceId) {
          oProperty.instanceId = oParent.instanceId;
          oProperty.pageId = oParent.pageId;
        } else {
          oProperty.pageId = oParent.id;
        }
        oProperty.bagId = sBagId;
        aChangeRequests.push({
          requestUri: sRequestUri,
          method: "POST",
          data: oProperty
        });
      }

      // Reset property maps to DELETE and GET request
      for (i = 0; i < aResetProperties.length; i += 1) {
        oProperty = aResetProperties[i];
        sRequestUri = oProperty[sMETADATA].uri;
        // cut protocol, hostname and base URI from request URI
        pos = sRequestUri.indexOf(oWrapper.getBaseUrl());
        if (pos >= 0) {
          sRequestUri = sRequestUri.slice(pos + oWrapper.getBaseUrl().length);
        }
        aChangeRequests.push({
          requestUri: sRequestUri,
          method: "DELETE"
        });
        aGetRequests.push({
          requestUri: sRequestUri,
          method: "GET"
        });
      }

      batch(aChangeRequests, aGetRequests,
        function (aChangeResponses, aGetResponses) {
          var aResetResponses =
            aChangeResponses.slice(aNewProperties.length + aChangedProperties.length),
            i;

          for (i = 0; i < aResetResponses.length; i += 1) {
            if (aResetResponses[i] === undefined) { //DELETE ok
              if (typeof aGetResponses[i] === "object") { //GET ok
                aResetResponses[i] = aGetResponses[i];
              }
            }
          }
          if (fnSuccess) {
            fnSuccess(
              aChangeResponses.slice(0, aChangedProperties.length), // PUT responses
              aChangeResponses.slice(aChangedProperties.length,
                  aNewProperties.length + aChangedProperties.length), // POST responses
              aResetResponses
            );
          }
        }, fnFailure);
    };

    /**
     * Creates a new property with the given value.
     *
     * @param {string|object} vParent
     *   ID of the page or parent object (either page or page CHIP instance; must be the result
     *   of a previous create or read operation) of the bag for which a property needs to be
     *   created
     * @param {string} sBagId
     *   ID of the bag
     * @param {string} sPropertyName
     *   the property name
     * @param {string} sValue
     *   the property value
     * @param {string} [sTranslatable]
     *   determines if the new property is a translatable one (since 1.19.0)
     *   <b>Note:</b> this is treated here as a plain string by intent, although the backend will
     *   treat it like a boolean (<code>" "</code> vs. <code>"X"</code>)
     * @param {function (object)} [fnSuccess]
     *   a callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @since 1.3.0
     */
    this.createProperty = function (vParent, sBagId, sPropertyName, sValue, sTranslatable,
      fnSuccess, fnFailure) {
      var oProperty;

      if (!vParent) {
        throw new sap.ui2.srvc.Error("Missing parent ID or object",
          "sap.ui2.srvc.PageBuildingService");
      }
      if (!sBagId) {
        throw new sap.ui2.srvc.Error("Missing bag ID", "sap.ui2.srvc.PageBuildingService");
      }
      if (!sPropertyName) {
        throw new sap.ui2.srvc.Error("Missing property name", "sap.ui2.srvc.PageBuildingService");
      }
      if (typeof sTranslatable === "function") {
        // sTranslatable missing, shift arguments appropriately
        this.createProperty(vParent, sBagId, sPropertyName, sValue, undefined,
          /*fnSuccess=*/sTranslatable, /*fnFailure=*/fnSuccess);
        return;
      }

      oProperty = {
        bagId: sBagId,
        name: sPropertyName,
        pageId: vParent,
        translatable: sTranslatable,
        value: sValue
      };
      if (typeof vParent !== "string") {
        if (vParent.instanceId) {
          oProperty.instanceId = vParent.instanceId;
          oProperty.pageId = vParent.pageId;
        } else {
          oProperty.pageId = vParent.id;
        }
      }

      oWrapper.create((oProperty.instanceId ? "ChipInstanceProperties" : "Properties"),
        oProperty, fnSuccess, fnFailure);
    };

    /**
     * Updates the property with the given representation which must be the result of
     * a previous create or read operation.
     *
     * @param {object} oProperty
     *   the de-serialized JSON representing the property to be updated
     * @param {function ()} [fnSuccess]
     *   a callback function that is executed if the request succeeds, taking no data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @since 1.3.0
     */
    this.updateProperty = function (oProperty, fnSuccess, fnFailure) {
      oWrapper.update(oProperty, fnSuccess, fnFailure);
    };

    /**
     * Deletes the property with the given representation which must be the result of
     * a previous create or read operation.
     *
     * @param {object} oProperty
     *   the de-serialized JSON representing the property to be deleted
     * @param {function ()} [fnSuccess]
     *   a callback function that is executed if the request succeeds, taking no data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @since 1.19.0
     */
    this.deleteProperty = function (oProperty, fnSuccess, fnFailure) {
      oWrapper.del(oProperty, fnSuccess, fnFailure);
    };

    /**
     * Reads the CHIP with the given ID.
     *
     * @param {string} sChipId
     *   ID of the CHIP to be loaded
     * @param {function (object)} fnSuccess
     *   a callback function that is executed if the request succeeds, taking the processed data
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     * @since 1.2.0
     */
    this.readChip = function (sChipId, fnSuccess, fnFailure) {
      if (!sChipId) {
        throw new sap.ui2.srvc.Error("Missing CHIP ID", "sap.ui2.srvc.PageBuildingService");
      }

      oWrapper.read("Chips('" + encodeURIComponent(sChipId) + "')" +
        "?$expand=ChipBags/ChipProperties", fnSuccess, fnFailure);
    };

    // constructor code -------------------------------------------------------
    if (!sap.ui2.srvc.Error) {
      fnRequire("sap.ui2.srvc.error");
    }
    if (typeof vODataBase === "string") {
      oWrapper = new sap.ui2.srvc.ODataWrapper(vODataBase, this, /*bSupportsChangeSets=*/true);
    } else {
      oWrapper = vODataBase;
    }

    /*
     * Add cache buster token maps as property of the corresponding method.
     * Entries must look like:
     *  key: ID of entity
     *  value: cache buster token
     */
    this.readAllCatalogs.cacheBusterTokens = new sap.ui2.srvc.Map();
    this.readPageSet.cacheBusterTokens = new sap.ui2.srvc.Map();

    /*
     * Enable sticky session in non PERS scopes: All operations in PERS should be
     * faster and synchronous than in CONF and CUST. So the user must be really
     * fast to obtain an error because of load balancing inconsistencies. Another
     * reason is client-side caching. If the response is cached, the load balancing
     * mechanism may be bypassed. This may not be fine for users of the launchpad.
     */
    if (!oWrapper.isStickySessionEnabled() && !bIsPersonalization) {
        oWrapper.enableStickySession();
    }

    sap.ui2.srvc.ODataService.call(this, oWrapper, fnDefaultFailure);
  };

  // public factory function ***************************************************

  if (!sap.ui2.srvc.createPageBuildingService) {
    /**
     * Constructs a facade to the page building service with the given base URI.
     *
     * @param {string} sBaseUri
     *   base URI of the page building service
     * @param {function (string)} [fnDefaultFailure]
     *   default error handler, taking an error message
     * @param {boolean} [bIsPersonalization=false]
     *   defines the return value of {@link sap.ui2.srvc.PageBuildingService#isPersonalization} of
     *   the returned instance (since 1.16.1)
     * @returns {sap.ui2.srvc.PageBuildingService}
     *   a facade to the page building service
     * @since 1.2.0
     *
     * @see sap.ui2.srvc.PageBuildingService
     */
    sap.ui2.srvc.createPageBuildingService = function (sBaseUri, fnDefaultFailure,
      bIsPersonalization) {
      return new sap.ui2.srvc.PageBuildingService(sBaseUri, fnDefaultFailure, bIsPersonalization);
    };
  }
/// @end
}());
