// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview A wrapper for a catalog loaded from the page building service.
 */

this.sap = this.sap || {};

(function () {
  "use strict";
  /*global jQuery, sap */

  // namespace "sap.ui2.srvc" **************************************************
  sap.ui2 = sap.ui2 || {};
  /**
   * @namespace The namespace for services related to page building and CHIP implementation.
   * @since 1.2.0
   */
  sap.ui2.srvc = sap.ui2.srvc || {};

  // Only declare the module if jQuery.sap exists. Otherwise we do not even try to require assuming
  // that the script has been loaded manually (before SAPUI5).
  // Load time branching pattern
  var fnRequire = String; // NOP (String exists and is free of side-effects)
  if (typeof jQuery === "function" && jQuery.sap) {
    jQuery.sap.declare("sap.ui2.srvc.catalog");
    // avoid fnRequire = jQuery.sap.require as require cannot be spied on afterwards
    fnRequire = function () {
      jQuery.sap.require.apply(this, arguments);
    };
  }

  //TODO We cannot require utils (module path possibly unset)?!, but we need testPublishAt
  sap.ui2.srvc.testPublishAt = sap.ui2.srvc.testPublishAt || function () {/*NOP*/};

  // "public class" ************************************************************

  /**
   * Constructs a new representation (wrapper) of the CHIP catalog with the given
   * ID to be loaded from the given factory's page building service.
   * <p>
   * Initially a stub is created, which can later load its properties and related objects
   * asynchronously.
   * <p>
   * Catalogs are currently read-only and cannot be updated through the page building service.
   *
   * @param {sap.ui2.srvc.Factory} oFactory
   *  the factory
   * @param {object|string} vCatalogData
   *   the catalog's ID or its catalog data as loaded via page building service
   *
   * @class
   * @see sap.ui2.srvc.PageBuildingService
   * @see sap.ui2.srvc.Chip
   * @since 1.2.0
   */
  sap.ui2.srvc.Catalog = function (oFactory, vCatalogData) {
    var oAlterEgo, // catalog's representation with all relations removed
      oCatalogPage, // {sap.ui2.srvc.Page}
      aChips = [], // {sap.ui2.srvc.Chip[]}
      oReadPromise, // if existing and in state "pending", a load/refresh is running; see read
      bIsStub = true, //TODO replace by aChips === undefined
      oCachedRemoteErrorArgs,
      sId,
      oReadRegisteredChipsPromise, // see readRegisteredChips
      aRegisteredChipIds = [],
      that = this;

    // BEWARE: constructor code below!

    // "private" methods ---------------------------------------------------------
    /**
     * Makes sure the given page is not just a stub.
     *
     * @private
     */
    function checkStub() {
      if (bIsStub) {
        throw new sap.ui2.srvc.Error(that + ": page is just a stub", "sap.ui2.srvc.Page");
      }
    }

    /**
     * Makes sure that not only the catalog's ID is known, but at least its alter ego.
     *
     * @private
     */
    function checkAlterEgo() {
      if (!oAlterEgo) {
        throw new sap.ui2.srvc.Error(that + ": catalog is just an ID", "sap.ui2.srvc.Catalog");
      }
    }

    /**
     * Releases all resources associated with this catalog. Call this method just before you stop
     * using it.
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(that);
    function exit() {
      var sToString = that.toString();

      //TODO exit() catalog's CHIPs?! what about oReadRegisteredChipsPromise then?
      if (oCatalogPage) {
        oCatalogPage.exit(); //TODO make sap.ui2.srvc.Page#exit also remove its API?! cf. below
      }

      // reset to initial state, but leave ID intact!
      oAlterEgo = undefined;
      vCatalogData = undefined;
      aChips = [];
      bIsStub = true;
      oReadPromise = undefined;
      oReadRegisteredChipsPromise = undefined;
      aRegisteredChipIds = [];

      // delete methods on deleted catalog to prevent wrong behavior
      Object.keys(that).forEach(function (sFunctionName) {
        if (!/getCatalogData|getId|isStub|toString/.test(sFunctionName)) {
          delete that[sFunctionName];
        }
      });

      oFactory.forgetCatalog(that);

      jQuery.sap.log.debug("Exited: " + sToString, null, "sap.ui2.srvc.Catalog");
    }

    /**
     * Gets this catalog's remote base URL.
     * @returns {string}
     * @private
     */
    sap.ui2.srvc.testPublishAt(that);
    function getRemoteBaseUrl() {
      return that.addSystemToServiceUrl(oAlterEgo.type === 'H'
        ? "/sap/hba/apps/kpi/s/odata/hana_chip_catalog.xsodata/"
        : oAlterEgo.baseUrl);
    }

    /**
     * Gets the remote catalog service.
     *
     * @returns {sap.ui2.srvc.RemoteCatalogService}
     * @private
     */
    sap.ui2.srvc.testPublishAt(that);
    function getRemoteCatalogService() {
      return oFactory.getRemoteCatalogService(oAlterEgo) || {
        readChips: function (sBaseUrl, sCatalogId, aChipIds, fnSuccess, fnFailure) {
          jQuery.sap.log.error("Catalog '" + oAlterEgo.id + "', type '" + oAlterEgo.type
            + "' not supported", null, "sap.ui2.srvc.Catalog");
          // fake an empty response to make the catalog valid
          // When created with alterEgo, we're still synchronous, so make it async
          sap.ui2.srvc.call(fnSuccess.bind(null, {results: []}), undefined, /*async=*/true);
        }
      };
    }

    /**
     * Success handler for loading a catalog.
     *
     * @private
     */
    function initialize() {
      var i, n,
        aResults;

      jQuery.sap.log.debug("Loaded: " + that, null, "sap.ui2.srvc.Catalog");
      if (oAlterEgo.Chips) {
        // fallback for HANA
        aResults = oAlterEgo.Chips.results || oAlterEgo.Chips;
        // remove relations and store catalog representation
        delete oAlterEgo.Chips;

        // create CHIP stubs
        aChips = [];
        for (i = 0, n = aResults.length; i < n; i += 1) {
          aChips[i] = oFactory.createChip(aResults[i]);
        }
        bIsStub = false;
        jQuery.sap.log.debug("Initialized: " + that, null, "sap.ui2.srvc.Catalog");
      }

      delete oAlterEgo.CatalogPage;
    }

    /**
     * Loads the catalog from the page building service, including its title and its contained
     * CHIPs (at least as stubs).
     *
     * If the catalog is a remote catalog, an attempt to load its chips is made.
     * In this case, if the loading fails, the catalog is fully initialized ( with an empty chips collection ) and
     * returned as 2nd argument of the reject handler (note that it is no longer a stub!)
     *
     * @param {function ()} fnSuccess
     *   no-args success handler
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   Default: see {@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(that);
    function read(bRefresh, fnSuccess, fnFailure) {
      var oDeferred;

      /*
       * @param {object} oResult
       *   the OData result from readCatalog
       */
      function onCatalogLoaded(oResult) {
        oAlterEgo = oResult;
        initialize();
        oDeferred.resolve();
      }

      /*
       * @param {object} oResult
       *   the OData result from readCatalogChips
       */
      function onChipsLoaded(oResult) {
        oAlterEgo.Chips = oResult;
        initialize();
        oDeferred.resolve();
      }

      /*
       * Processes the remote response from readCatalogChips.
       * @param {object} oResult
       *   the OData result from readCatalogChips
       */
      function processRemoteResponse(oResult) {
        oResult.results.forEach(function (oRawChip) {
          oRawChip.remoteCatalogId = sId;
        });
        onChipsLoaded(oResult);
      }

      /*
       * initialize the chip and reject the promise,
       * called when subsequent loading from a remote catalog fails
       * @param {string} sErrMsg
       *   an error message from a failure
       * @param {object} [oErrDetails]
       *   (since version 1.28.6) an optional object containing the complete
       *   error information as
       *   delivered by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
       *   for more details.
       */
      function couldNotLoadRemoteChips() {
        initialize(); // fail gracefully
        oCachedRemoteErrorArgs = arguments;
        oDeferred.reject.apply(this, arguments);
      }
      /*
       * Processes the local response from readCatalog. Passes it on to initialize or requests the
       * CHIPS from the remote server.
       * @param {object} oResult
       *   the OData result from the readCatalog
       */
      function processLocalResponse(oResult) {
        var sRemoteBaseUrl;
        if (oResult.remoteId) { //TODO || oResult.type === "REMOTE"
          oAlterEgo = oResult;
          try {
            sRemoteBaseUrl = getRemoteBaseUrl();
          } catch (e) {
            couldNotLoadRemoteChips(e.toString());
            return;
          }
          getRemoteCatalogService().readChips(sRemoteBaseUrl, oAlterEgo.remoteId, undefined,
            processRemoteResponse, couldNotLoadRemoteChips);
        } else if (oAlterEgo && bRefresh) {
          onChipsLoaded(oResult.Chips);
        } else {
          onCatalogLoaded(oResult);
        }
      }

      if (!oReadPromise || oReadPromise.state() !== 'pending') {
        oDeferred = new jQuery.Deferred();
        oReadPromise = oDeferred.promise();
        if (!oAlterEgo || (bRefresh && !oAlterEgo.remoteId)) {
          // read the local catalog if it is unknown yet or if refreshing a non-remote catalog
          oFactory.getPageBuildingService().readCatalog(sId, processLocalResponse,
            oDeferred.reject.bind(oDeferred));
        } else {
          processLocalResponse(oAlterEgo);
        }
      }
      fnFailure = fnFailure || oFactory.getPageBuildingService().getDefaultErrorHandler();
      //TODO this needs "sap.ui2.srvc.utils" which is never required!
      oReadPromise.done(sap.ui2.srvc.call.bind(null, fnSuccess, fnFailure));
      oReadPromise.fail(fnFailure);
    }

    // "public" methods ----------------------------------------------------------

    /**
     * Makes the given server-relative service URL point to the system given as parameter
     * <code>sSystem</code> or to the system from which the catalog
     * loaded its CHIPs if <code>sSystem</code> is empty.
     * <em>Server-relative URL</em> means a URL starting with exactly one "/" (also known as
     * absolute-path URL).
     * <p>
     *
     * The system is added via segment parameter <code>o</code> to the last URL segment of the
     * service URL. It is also possible to make this function put the system to a different
     * URL path segment of the service URL by specifying the empty segment parameter
     * <code>o</code>. If both <code>sSystem</code> is empty and the catalog is a local
     * catalog, no system is added and the empty segment parameter <code>o</code> is removed.
     * <br/>
     * <b>Example 1:</b> <code>/sap/opu/odata/MyService/?p1=v1</code> is converted to
     * <code>/sap/opu/odata/MyService;o=SYS/?p1=v1</code> if the catalog is a remote catalog with
     * system ID &quot;SYS&quot;.
     * However it remains unchanged if the catalog is not remote <em>and</em>
     * the parameter <code>sSystem</code> is empty.<br/>
     * <b>Example 2:</b> <code>/sap/opu/odata/MyService;o=/MyEntities/$count?p1=v1</code> is
     * converted to <code>/sap/opu/odata/MyService;o=sid(SYS.123)/MyEntities/$count?p1=v1</code> if
     * parameter <code>sSystem</code> is set to &quot;sid(SYS.123)&quot;</code>.
     *
     * The URL is in no way normalized.
     *
     * @private
     * @param {string} sServiceUrl
     *   a server-relative service URL (to be used when addressing the system directly)
     * @param {string} [sSystem]
     *   a system specification like <code>SYS</code> or <code>sid(SYS.123)</code>; if empty the
     *   system from which the catalog loaded its CHIPs is used
     * @returns {string}
     *   the service URL pointing to the system specified in parameter <code>sSystem</code> or to
     *   the catalog's system
     * @throws Error if the URL is not server-relative (such as <code>./something</code>,
     *   <code>http://foo.bar/something</code>, ...)
     */
    this.addSystemToServiceUrl = function (sServiceUrl, sSystem) {
      /*jslint regexp:true */
      if (sServiceUrl.indexOf('/') !== 0 || sServiceUrl.indexOf('//') === 0) {
        throw new sap.ui2.srvc.Error("addSystemToServiceUrl: Invalid URL: " + sServiceUrl,
          "sap.ui2.srvc.Catalog");
      }
      sSystem = sSystem || this.getSystemAlias();
      if (/^[^?]*(;o=([\/;?]|$))/.test(sServiceUrl)) {
        // URL with ";o=" *not* followed by system: insert system
        sServiceUrl = sServiceUrl.replace(/;o=([\/;?]|$)/,
            (sSystem ? ";o=" + sSystem : "") + "$1");
      } else if (!/^[^?]*;o=/.test(sServiceUrl) && sSystem) {
        // URL without ";o=": append system
        sServiceUrl = sServiceUrl.replace(/(\/[^?]*?)(\/$|$|(\/?\?.*))/,
            "$1;o=" + sSystem + "$2");
      }
      if (sap.ui) {
        sap.ui.getCore().getEventBus().publish("sap.ushell.Container",
          "addRemoteSystemForServiceUrl", sServiceUrl); //{ sValue : sServiceUrl }
      }
      return sServiceUrl;
    };

    /**
     * Creates a new catalog in the backend as a clone of this catalog, using the given domain ID.
     * All copied catalog CHIPs are references (see {@link sap.ui2.srvc.Chip#isReference})
     * until they are changed (copy on write).
     * Changes to the original CHIPs will be visible in the catalog copy after the next read.
     * The success handler is called as soon as the clone has been created and the new
     * <code>sap.ui2.srvc.Catalog</code> object is not a stub anymore. Access the
     * <code>sap.ui2.srvc.Catalog</code> instance passed to the success callback in order to learn
     * the resulting ID!
     * <p>
     * Can be called no matter whether this catalog is still a stub. For remote catalogs where
     * only the ID is known, this method currently fails!
     *
     * @param {string} sNewDomainId
     *   the new catalog's domain-specific ID which must not contain a colon
     * @param {string} [sNewTitle]
     *   the new catalog's title; if <code>undefined</code>, this catalog's title will be used
     * @param {function (sap.ui2.srvc.Catalog)} fnSuccess
     *   success handler for asynchronous creation
     * @param {function (string, [sap.ui2.srvc.Catalog], [object])} fnFailure
     *   error handler, taking an error message, an optional {@link sap.ui2.srvc.Catalog}
     *   instance and, since version 1.28.6, an optional object containing the
     *   complete error information.<br />
     *   See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details about the complete error information parameter.
     *
     * @see #getCatalogPage
     * @since 1.19.1
     */
    this.clone = function (sNewDomainId, sNewTitle, fnSuccess, fnFailure) {
      var oCatalogData,
        /*
         * keeps calls to failure handler consistent with failure handler calls
         * in sap.ui2.srvc.Factory#createNewCatalog
         */
        fnFailureWrapper = function (sErrorMessage, oMaybeErrorInformation) {
          return fnFailure(sErrorMessage, /*sap.ui2.srvc.Catalog*/undefined,
            oMaybeErrorInformation);
        };

      if (oAlterEgo && oAlterEgo.type === "REMOTE") {
        oCatalogData = this.getCatalogData();
        delete oCatalogData.id;
        oCatalogData.domainId = sNewDomainId;
        if (sNewTitle !== undefined) {
          oCatalogData.title = sNewTitle;
        }
        oFactory.createNewCatalog(oCatalogData, fnSuccess, fnFailure);
      } else {
        oFactory.getPageBuildingService().cloneCatalog(this.getId(), sNewDomainId, sNewTitle,
          function (oRawCatalog) {
            // Note: Chips relation is deferred, Catalog cannot handle this, thus use ID only!
            oFactory.createCatalog(oRawCatalog.id, fnSuccess, fnFailureWrapper);
          }, fnFailureWrapper);
      }
    };

    /**
     * Returns all of this catalog's properties or <code>undefined</code> if only the catalog's ID
     * is known.
     *
     * @returns {object}
     *   all of this catalog's properties, e.g.
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
     * @since 1.19.1
     *
     * @see #update
     * @see sap.ui2.srvc.Factory#createNewCatalog
     */
    this.getCatalogData = function () {
      /*jslint nomen:true */
      var oCatalogData;

      if (!oAlterEgo) {
        return undefined; // only ID is known!
      }

      oCatalogData = JSON.parse(JSON.stringify(oAlterEgo));
      delete oCatalogData.__metadata;
      return oCatalogData;
    };

    /**
     * Returns this catalog's corresponding catalog page (typically a stub only), if any
     * (see {@link sap.ui2.srvc.Factory#createNewPageBasedCatalog}).
     * This method is intended to be called in a design time use case only.
     * <p>
     * Catalog pages are an easy way to modify catalogs. A catalog based on a catalog page is not
     * only represented by a {@link sap.ui2.srvc.Catalog}, but also by a {@link sap.ui2.srvc.Page}.
     * This means that you can use the {@link sap.ui2.srvc.Page} and
     * {@link sap.ui2.srvc.ChipInstance} APIs to modify the catalog.
     * For example, you can add a new {@link sap.ui2.srvc.Chip} as a
     * {@link sap.ui2.srvc.ChipInstance} using the
     * {@link sap.ui2.srvc.Page#createNewPageBasedCatalog} method.
     * <p>
     * Can safely be called if the catalog itself is not a stub anymore ({@link #isStub}). Must
     * not be called if only the catalog's ID is known (see {@link #getCatalogData})!
     *
     * @returns {sap.ui2.srvc.Page}
     *   this catalog's corresponding catalog page, or <code>undefined</code> if this catalog is
     *   not based on a catalog page
     * @since 1.19.1
     */
    this.getCatalogPage = function () {
      checkAlterEgo();
      if (oAlterEgo.type !== "P" && oAlterEgo.type !== "CATALOG_PAGE") {
        return undefined; // this catalog is not based on a catalog page
      }

      if (!oCatalogPage) {
        oCatalogPage = oFactory.createPage(sId);
      }
      return oCatalogPage;
    };

    /**
     * Returns this catalog's CHIPs (typically stubs only). Can be called only if the catalog
     * itself is not a stub anymore.
     *
     * @returns {sap.ui2.srvc.Chip[]}
     *   this catalog's CHIPs
     * @since 1.2.0
     *
     * @see #isStub
     */
    this.getChips = function () {
      if (bIsStub) {
        throw new sap.ui2.srvc.Error(that + ": catalog is just a stub", "sap.ui2.srvc.Catalog");
      }
      return aChips.slice();
    };

    /**
     * Returns this catalog's domain ID which represents the catalog ID without any type-specific
     * prefixes (like "X-SAP-REMOTE:"). The domain ID is better human-readable than the ID (see
     * {@link #getId()}). Returns <code>undefined</code> as long as only the ID of this catalog
     * is known.
     *
     * @returns {string}
     *   this catalog's domain ID
     * @since 1.19.1
     *
     * @see sap.ui2.srvc.Factory#createNewPageBasedCatalog
     * @see sap.ui2.srvc.PageBuildingService#createPageBasedCatalog
     */
    this.getDomainId = function () {
      return oAlterEgo && oAlterEgo.domainId;
    };

    /**
     * Returns this catalog's technical ID. In contrast to {@link #getDomainId} this method returns
     * the ID including type-specific prefixes (like "X-SAP-REMOTE:"). Those should not be
     * displayed on a UI, for example.
     *
     * @returns {string}
     *   this catalog's technical ID including type-specific prefixes (like "X-SAP-REMOTE:")
     * @since 1.2.0
     */
    this.getId = function () {
      return sId;
    };

    /**
     * Returns this catalog's system alias.
     *
     * @returns {string}
     *   this catalog's system alias
     * @private
     */
    this.getSystemAlias = function () {
      return (oAlterEgo && oAlterEgo.systemAlias) || undefined;
    };

    /**
     * Returns this catalog's title.
     * <p>
     * Can safely be called if the catalog itself is not a stub anymore ({@link #isStub}). Must
     * not be called if only the catalog's ID is known (see {@link #getCatalogData})!
     *
     * @returns {string}
     *   this catalog's title
     * @since 1.2.0
     *
     * @see #isStub
     */
    this.getTitle = function () {
      checkAlterEgo();
      return oAlterEgo.title;
    };

    /**
     * Returns this catalog's type.
     * <p>
     * Can safely be called if the catalog itself is not a stub anymore ({@link #isStub}). Must
     * not be called if only the catalog's ID is known (see {@link #getCatalogData})!
     *
     * @returns {string}
     *   this catalog's type
     * @since 1.16.4
     */
    this.getType = function () {
      checkAlterEgo();
      return oAlterEgo && oAlterEgo.type;
    };

    /**
     * Tells whether this catalog is marked as outdated. For a catalog based on a catalog page
     * (see {@link #getCatalogPage}), this means that the catalog page is marked as outdated
     * (see {@link sap.ui2.srvc.Page#isOutdated}).
     * <p>
     * Can safely be called if the catalog itself is not a stub anymore ({@link #isStub}). Must
     * not be called if only the catalog's ID is known (see {@link #getCatalogData})!
     *
     * @returns {boolean}
     *   whether this catalog is marked as outdated
     * @since 1.19.1
     */
    this.isOutdated = function () {
      checkAlterEgo();

      // Note: no use calling getCatalogPage(), it could only create a new stub
      return (oCatalogPage && !oCatalogPage.isStub() && oCatalogPage.isOutdated())
        || oAlterEgo.outdated === "X";
    };

    /**
     * Tells whether this catalog is readOnly.
     * <p>
     * Can safely be called if the catalog itself is not a stub anymore ({@link #isStub}). Must
     * not be called if only the catalog's ID is known (see {@link #getCatalogData})!
     *
     * @returns {boolean}
     *   true if this catalog is in read only mode
     * @since 1.32.0
     */
    this.isReadOnly = function () {
      checkStub();
      return oAlterEgo.isReadOnly === "X";
    };

    /**
     * Tells whether this catalog is still only a stub and does not yet know its CHIPs or title.
     *
     * @returns {boolean}
     *   whether this catalog is still only a stub
     * @since 1.2.0
     *
     * @see #load
     */
    this.isStub = function () {
      return bIsStub;
    };

    /**
     * In case of a remote catalog which failed for some reason to read its CHIPs
     * (see {@link #readChips}), this method can be used to retrieve the original failure
     * handler arguments. This is needed because of the graceful degradation (the catalog
     * keeps usable and simply behaves as if it would be empty).
     * Will be reset on call of {@link #update}.
     *
     * @returns {arguments}
     *  the arguments as originally received by the {@link #readChips} failure handler
     * @since 1.34.0
     *
     * @see #readChips
     */
    this.getCachedRemoteFailureArguments = function () {
      return oCachedRemoteErrorArgs;
    };

    /**
     * Loads the catalog from the page building service, including its title and its contained CHIPs
     * (at least as stubs). Must not be called twice! If needed, call <code>refresh()</code>.
     *
     * @param {function ()} fnSuccess
     *   no-args success handler
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   Default: see {@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}
     * @since 1.2.0
     *
     * @see #isStub
     * @see #refresh
     */
    this.load = function (fnSuccess, fnFailure) {
      if (!bIsStub) {
        throw new sap.ui2.srvc.Error("Catalog is not a stub anymore", "sap.ui2.srvc.Catalog");
      }
      read(false, fnSuccess, fnFailure);
    };

    /**
     * Reads all CHIPs into the factory's CHIP cache. The catalog itself remains unchanged. This
     * method may be called even if the catalog is a stub.
     *
     * @param {string[]} aChipIds
     *   the IDs of the CHIPs to be read.
     * @param {function ()} fnSuccess
     *   no-args success handler
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details. Please see also {@link #getCachedRemoteFailureArguments}.
     *   Default: see {@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}
     * @since 1.16.4
     *
     * @see #getCachedRemoteFailureArguments
     */
    this.readChips = function (aChipIds, fnSuccess, fnFailure) {

      function createChips(oRawData) {
        oRawData.results.forEach(function (oRawChipData) {
          oFactory.createChip(oRawChipData);
        });
        //TODO this needs "sap.ui2.srvc.utils" which is never required!
        sap.ui2.srvc.call(fnSuccess, fnFailure);
      }

      function createRemoteChips(oRawData) {
        // add remoteCatalogId to each CHIP
        oRawData.results.forEach(function (oRawChipData) {
          oRawChipData.remoteCatalogId = sId;
        });
        createChips(oRawData);
      }

      function requestChips(oResult) {
        oAlterEgo = oResult;
        if (oAlterEgo.remoteId) {
          getRemoteCatalogService().readChips(getRemoteBaseUrl(), oAlterEgo.remoteId, aChipIds,
            createRemoteChips, fnFailure);
        } else {
          oFactory.getPageBuildingService().readCatalogChips(sId, aChipIds, createChips, fnFailure);
        }
      }

      if (!oAlterEgo) {
        // ensure that we have the alter ego to know type and remoteId, but do not load CHIPs
        oFactory.getPageBuildingService().readCatalog(sId, requestChips, fnFailure, true);
      } else {
        requestChips(oAlterEgo);
      }
    };

    /**
     * Reads all registered CHIPs using {@link #readChips}. The catalog itself remains unchanged.
     * This method may be called even if the catalog is a stub.
     * @param {function ()} fnSuccess
     *   no-args success handler
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   Default: see {@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}
     * @since 1.19.0
     * @private

     * @see #readChips
     * @see #registerChip
     */
    this.readRegisteredChips = function (fnSuccess, fnFailure) {

      function start() {
        var oDeferred = new jQuery.Deferred(),
          aChipIds = aRegisteredChipIds;

        aRegisteredChipIds = [];
        if (aChipIds.length) {
          that.readChips(aChipIds, oDeferred.resolve.bind(oDeferred),
              oDeferred.reject.bind(oDeferred));
        } else {
          oDeferred.resolve();
        }
        return oDeferred.promise();
      }

      if (!oReadRegisteredChipsPromise || oReadRegisteredChipsPromise.state() !== "pending") {
        oReadRegisteredChipsPromise = start();
      }
      fnFailure = fnFailure || oFactory.getPageBuildingService().getDefaultErrorHandler();
      //TODO this needs "sap.ui2.srvc.utils" which is never required!
      oReadRegisteredChipsPromise.fail(fnFailure)
        .done(sap.ui2.srvc.call.bind(null, fnSuccess, fnFailure));
    };

    /**
     * Refreshes the catalog's CHIPs by reading them (again) from the backend. The catalog may be a
     * stub before refresh (since 1.19.0), but is not a stub anymore once refresh succeeds.
     * <p>
     * When a catalog is still a stub, <code>refresh</code> is the same as <code>load</code>. When
     * the catalog has been loaded before, <code>refresh</code> fetches only the CHIPs.
     *
     * @param {function ()} fnSuccess
     *   no-args success handler
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   Default: see {@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}
     * @since 1.11.0
     *
     * @see #load
     */
    this.refresh = function (fnSuccess, fnFailure) {
      read(true, fnSuccess, fnFailure);
    };

    /**
     * Registers a CHIP to be read later via {@link #readRegisteredChips}.
     *
     * @param {sap.ui2.srvc.Chip} oChip
     *   the CHIP to be registered
     * @since 1.19.0
     * @private
     */
    this.registerChip = function (oChip) {
      if (oReadRegisteredChipsPromise && oReadRegisteredChipsPromise.state() === "pending") {
        throw new sap.ui2.srvc.Error(
          "Invalid state: registerChip while readRegisteredChips pending",
          "sap.ui2.srvc.Catalog"
        );
      }
      aRegisteredChipIds.push(oChip.getId());
    };

    /**
     * Removes this catalog by deleting it within the page building service. Also deletes the
     * corresponding catalog page, if applicable (see {@link #getCatalogPage} and
     * {@link sap.ui2.srvc.Factory#createNewPageBasedCatalog}).
     * <p>
     * <b>BEWARE:</b> Do not continue to use this object afterwards!
     * <p>
     * Can safely be called if the catalog itself is not a stub anymore ({@link #isStub}). Must
     * not be called if only the catalog's ID is known (see {@link #getCatalogData}) or if the
     * catalog is being refreshed currently (see {@link #refresh})!
     *
     * @param {function ()} [fnSuccess]
     *   no-args success handler
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   If not given
     *   <code>{@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}</code> is used
     * @since 1.19.1
     */
    this.remove = function (fnSuccess, fnFailure) {
      checkAlterEgo();
      if (oReadPromise && oReadPromise.state() === 'pending') {
        throw new sap.ui2.srvc.Error("Catalog is being refreshed: " + this,
          "sap.ui2.srvc.Catalog");
      }

      jQuery.sap.log.debug("Removing: " + this, null, "sap.ui2.srvc.Catalog");
      oFactory.getPageBuildingService().deleteCatalog(oAlterEgo, function () {
        exit();
        fnSuccess();
      }, fnFailure);
    };

    /**
     * Returns this catalog's string representation.
     *
     * @param {boolean} [bVerbose=false]
     *   flag whether to show all properties
     * @returns {string}
     *   this catalog's string representation
     * @since 1.2.0
     */
    this.toString = function (bVerbose) {
      var aResult = ['sap.ui2.srvc.Catalog({sId:"', sId, '"', ',bIsStub:', bIsStub];
      if (bVerbose) {
        aResult.push(',oAlterEgo:', JSON.stringify(oAlterEgo),
          ',oFactory:', oFactory.toString(bVerbose),
          ',aChips:', JSON.stringify(aChips)
          );
      }
      aResult.push('})');
      return aResult.join('');
    };

    /**
     * Updates one or more properties of this catalog in the backend based on the given raw data.
     * Properties which are not given keep their current value. Keys cannot be updated this way!
     * Note that for a catalog based on a catalog page ({@link #getCatalogPage}), the "title"
     * property is shared between the catalog and its corresponding catalog page!
     * <p>
     * Can safely be called if the catalog itself is not a stub anymore ({@link #isStub}). Must
     * not be called if only the catalog's ID is known (see {@link #getCatalogData})!
     * <p>
     * The catalog becomes a stub immediately. As soon as the update succeeds, the catalog is
     * loaded automatically and only after that, the success handler is called.
     * It is not wise to keep references to old CHIPs loaded from this catalog before an update
     * that changes the catalog's "identity", e.g. the "remoteId" property of a remote catalog.
     *
     * @param {object} oCatalogData
     *   any subset of the catalog's properties, e.g.
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
     * @param {function ()} fnSuccess
     *   no-args success handler
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   Default: see {@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}
     * @throws Error when trying to update the "__metadata" property.
     * @since 1.19.1
     *
     * @see #getCatalogData
     */
    this.update = function (oCatalogData, fnSuccess, fnFailure) {
      var oNewAlterEgo;

      checkAlterEgo();
      if (Object.hasOwnProperty.call(oCatalogData, "__metadata")) {
        // sap.ui2.srvc.ODataWrapper#update() relies on __metadata!
        throw new sap.ui2.srvc.Error("Unsupported __metadata update", "sap.ui2.srvc.Catalog");
      }
      oNewAlterEgo = JSON.parse(JSON.stringify(oAlterEgo));
      Object.keys(oCatalogData).forEach(function (sName) {
        oNewAlterEgo[sName] = oCatalogData[sName];
      });

      bIsStub = true;
      oCachedRemoteErrorArgs = undefined;

      oFactory.getPageBuildingService().updateCatalog(oNewAlterEgo, function () {
        oAlterEgo = oNewAlterEgo; // update head data
        read(true, fnSuccess, fnFailure); // if this fails, we are stuck with a stub!
      }, function () {
        bIsStub = false; // update failed, e.g. wrong properties --> no change to catalog!
        fnFailure = fnFailure || oFactory.getPageBuildingService().getDefaultErrorHandler();
        fnFailure.apply(null, arguments); // forward call
      });
    };

    // constructor code -------------------------------------------------------
    if (!sap.ui2.srvc.Error) {
      fnRequire("sap.ui2.srvc.error");
    }
    if (typeof vCatalogData === "object") {
      // direct creation
      sId = vCatalogData.id;
      // Robustness: we prefer remoteId over Chips in case there is both
      if (vCatalogData.remoteId) {
        delete vCatalogData.Chips;
      }
      oAlterEgo = vCatalogData;
      initialize();
    } else if (typeof vCatalogData === "string") {
      sId = vCatalogData;
    }
    if (!sId) {
      throw new sap.ui2.srvc.Error("Missing ID", "sap.ui2.srvc.Catalog");
    }
    jQuery.sap.log.debug("Created: " + this, null, "sap.ui2.srvc.Catalog");
  };
}());
