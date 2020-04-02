// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The <code>sap.ui2.srvc.Chip</code> object with related functions.
 */

this.sap = this.sap || {};

(function () {
  "use strict";
  /*global jQuery, sap */

  sap.ui2 = sap.ui2 || {};
  sap.ui2.srvc = sap.ui2.srvc || {};

  /*
   * A map of all registered contracts by name.
   * @see sap.ui2.srvc.Chip.addContract
   */
  var mContractsByName = {},
    fnRequire = String; // NOP (String exists and is free of side-effects)

  // Only declare the module if jQuery.sap exists. Otherwise we do not even try to require assuming
  // that the script has been loaded manually (before SAPUI5).
  // Load time branching pattern
  if (typeof jQuery === "function" && jQuery.sap) {
    jQuery.sap.declare("sap.ui2.srvc.chip");
    // avoid fnRequire = jQuery.sap.require as require cannot be spied on afterwards
    fnRequire = function () {
      jQuery.sap.require.apply(this, arguments);
    };
  }

  // We cannot require utils (module path possibly unset), but we urgently need testPublishAt
  sap.ui2.srvc.testPublishAt = sap.ui2.srvc.testPublishAt || function () {/*NOP*/};

  // "private" methods (static) without need to access properties -------------

  /**
   * Returns the initializer function for the given contract name or <code>null</code> if not found.
   *
   * @param {string} sName
   *   name of the contract to be return
   * @returns {function}
   *   function to be called to initialize the contract or null if none was found
   */
  function getContractInitializer(sName) {
    return Object.prototype.hasOwnProperty.call(mContractsByName, sName) ?
        mContractsByName[sName] : null;
  }

  // "public class" -----------------------------------------------------------

  /**
   * Constructs a new representation (wrapper) of the CHIP with the given CHIP data as loaded from
   * the page building service.
   * <p>
   * Initially a stub is created which can load its CHIP definition XML later on in an asynchronous
   * fashion.
   * <p>
   * CHIPs are currently read-only and cannot be updated through the page building service.
   * (see {@link sap.ui2.srvc.PageBuildingService})
   *
   * @param {object} oAlterEgo
   *   the CHIP data as loaded via page building service
   * @param {sap.ui2.srvc.Factory} oFactory
   *  the factory
   *
   * @class
   * @since 1.2.0
   */
  sap.ui2.srvc.Chip = function (oAlterEgo, oFactory) {
    var that = this,
      oBags, // {sap.ui2.srvc.Map<string,sap.ui2.srvc.Bag>}
      /*
       * {string}
       * The URL of the CHIP definition XML (as base for the referenced files)
       */
      sChipUrl,
      /*
       * {map<string,string>}
       * The configuration as read from the CHIP spec in the page building service.
       * The values are already validated and typed correctly. (Must be initialized
       * after the CHIP definition XML has been parsed.)
       */
      oConfiguration,
      /*
       * {sap.ui2.srvc.ChipDefinition}
       * The data from the CHIP definition XML. If undefined, the CHIP is still a stub.
       */
      oDefinition,
      /*
       * {string}
       * Cached error message in case loading fails.
       */
      sErrorMessage,
      /*
       * {object}
       * Cached error information in case loading fails.
       */
      oErrorInformation,
      /*
       * List of all success and failure handlers passed to a <code>load()</code> call while this
       * CHIP is already loading its XML; these will all be called after initialization has
       * finished. This list is non-<code>null</code> iff. this CHIP is currently loading its XML.
       *
       * @see #load()
       */
      aLoadHandlers,
      /*
       * The remote catalog if there is one.
       */
      oRemoteCatalog,
      /*
       * whether the chip expects to be updated from a (remote) catalog
       */
      bWaitingForUpdateViaCatalog;

    // BEWARE: constructor code below!

    // "private" or hidden methods --------------------------------------------

    /**
     * Makes sure this CHIP is not just a stub.
     *
     * @private
     */
    function checkStub() {
      if (!oDefinition) {
        throw new sap.ui2.srvc.Error(that + ": CHIP is just a stub", "sap.ui2.srvc.Chip");
      }
    }

    /**
     * Initialize the bags from raw CHIP bags array.
     *
     * @param {object[]} aRawChipBags
     *   Array of raw CHIP bags
     *
     * @private
     */
    function initBags(aRawChipBags) {
      var i;

      oBags = new sap.ui2.srvc.Map();
      if (!aRawChipBags) {
        return;
      }
      for (i = 0; i < aRawChipBags.length; i += 1) {
        // for each bag instance: create wrapper
        fnRequire("sap.ui2.srvc.bag");
        oBags.put(aRawChipBags[i].id,
          new sap.ui2.srvc.Bag(oFactory, aRawChipBags[i]));
      }
    }

    /**
     * Initialize some details (which need only be computed once) in the given SAPUI5
     * implementation by decorating it with additional properties starting with "$".
     *
     * @param {object} oImplementation
     *   UI5 inplementation
     * @private
     */
    function initSAPUI5(oImplementation) {
      /*jslint regexp: true */
      var sBasePath = oImplementation.basePath,
        iLastSlash,
        aMatches,
        sNamespace,
        sViewName = oImplementation.viewName;

      if (oImplementation.componentName) {
        oImplementation.$Namespace = oImplementation.componentName;
      } else {
        // (namespace)/(viewName).view.(viewType)
        aMatches = /^(?:([^\/]+)\/)?(.*)\.view\.(.*)$/.exec(sViewName);
        if (!aMatches) {
          throw new sap.ui2.srvc.Error(that + ": Illegal view name: " + sViewName,
            "sap.ui2.srvc.Chip");
        }

        // determine namespace, view name, and view type
        sNamespace = aMatches[1];
        sViewName = aMatches[2];
        oImplementation.$ViewType = aMatches[3].toUpperCase(); // @see sap.ui.core.mvc.ViewType
        if (sNamespace) {
          // prefix view name with namespace
          sViewName = sNamespace + "." + sViewName;
        } else {
          // derive namespace from view name's "package"
          iLastSlash = sViewName.lastIndexOf(".");
          if (iLastSlash < 1) {
            throw new sap.ui2.srvc.Error(that + ": Missing namespace: " + sViewName,
              "sap.ui2.srvc.Chip");
          }
          sNamespace = sViewName.substring(0, iLastSlash);
        }
        oImplementation.$Namespace = sNamespace;
        oImplementation.$ViewName = sViewName;
      }

      // URL prefix to load module for given namespace relative to CHIP definition XML
      oImplementation.$UrlPrefix = oImplementation.$Namespace.replace(/\./g, "/");
      if (sBasePath !== ".") {
        sBasePath = sBasePath.replace(/\/?$/, '/'); // ensure it ends with a slash
        oImplementation.$UrlPrefix = sBasePath + oImplementation.$UrlPrefix;
      }
      oImplementation.$UrlPrefix = that.toAbsoluteUrl(oImplementation.$UrlPrefix);
    }

    /**
     * Initializes the configuration, considers defaults set in the CHIP definition XML.
     *
     * @private
     */
    function initConfiguration() {
      oConfiguration = {};
      if (oDefinition.contracts.configuration && oDefinition.contracts.configuration.parameters) {
        // clone the parameters so that we can merge in oAlterEgo.configuration
        oConfiguration = JSON.parse(JSON.stringify(oDefinition.contracts.configuration.parameters));
      }
      that.updateConfiguration(oConfiguration, oAlterEgo.configuration);
    }

    /**
     * Initialize this CHIP using the given CHIP definition.
     *
     * @param {sap.ui2.srvc.ChipDefinition} oNewDefinition
     *   the CHIP definition
     *
     * @private
     */
    function initialize(oNewDefinition) {
      var i1, n1;

      if (oDefinition) {
        throw new sap.ui2.srvc.Error(that + ": cannot initialize twice", null, "sap.ui2.srvc.Chip");
      }
      oDefinition = oNewDefinition;
      oDefinition.contracts = oDefinition.contracts || {};

      if (!oDefinition.implementation || !oDefinition.implementation.sapui5) {
        throw new sap.ui2.srvc.Error(that + ": Missing SAPUI5 implementation",
          "sap.ui2.srvc.Chip");
      }
      initSAPUI5(oDefinition.implementation.sapui5);

      initConfiguration();

      jQuery.sap.log.debug("Initialized: " + that, null, "sap.ui2.srvc.Chip");
      if (aLoadHandlers) {
        // initialization has finished, call all waiting success handlers
        for (i1 = 0, n1 = aLoadHandlers.length; i1 < n1; i1 += 2) {
          aLoadHandlers[i1]();
        }
        aLoadHandlers = null;
      }
    }

    /**
     * Updates property bags with given raw data.
     *
     * @param {object[]} aRawChipBags
     *   Array of raw CHIP bags
     *
     * @private
     */
    sap.ui2.srvc.testPublishAt(that);
    function updateBags(aRawChipBags) {
      var i, sKey, aExistingKeys = oBags.keys();
      for (i = 0; i < aRawChipBags.length; i += 1) {
        sKey = aRawChipBags[i].id;
        if (oBags.containsKey(sKey)) {
          oBags.get(sKey).update(aRawChipBags[i]);
          aExistingKeys.splice(aExistingKeys.indexOf(sKey), 1);
        } else {
          oBags.put(sKey, new sap.ui2.srvc.Bag(oFactory, aRawChipBags[i]));
        }
      }
      for (i = 0; i < aExistingKeys.length; i += 1) {
        oBags.remove(aExistingKeys[i]);
      }
    }

    // "public" methods -------------------------------------------------------

    /**
     * Creates the API object for a CHIP instance. Can only be called if the CHIP is not a stub
     * anymore.
     *
     * @param {sap.ui2.srvc.ChipInstance} oChipInstance
     *   the CHIP instance
     * @param {sap.ui2.srvc.Map} [oContractsByName]
     *   CHIP instance's map from contract name to contract interface for page builder
     *   (since 1.11.0)
     * @return {object}
     *   the API object
     * @since 1.2.0
     *
     * @see #isStub()
     * @see sap.ui2.srvc.ChipInstance#getContract()
     */
    this.createApi = function (oChipInstance, oContractsByName) {
      var oApi = {},
        oContract,
        fnInitializer,
        sName,
        mRequestedContracts;

      checkStub();
      mRequestedContracts = oDefinition.contracts;
      if (mRequestedContracts) {
        for (sName in mRequestedContracts) {
          if (Object.prototype.hasOwnProperty.call(mRequestedContracts, sName)) {
            fnInitializer = getContractInitializer(sName);
            if (!fnInitializer) {
              throw new sap.ui2.srvc.Error(this + ": Contract '" + sName + "' is not supported",
                "sap.ui2.srvc.Chip");
            }
            oApi[sName] = {};
            oContract = fnInitializer.call(oApi[sName], oChipInstance);
            if (oContractsByName) {
              oContractsByName.put(sName, oContract);
            }
          }
        }
      }
      return oApi;
    };

    /**
     * Returns the list of available types of visualization. The types are always lower case.
     *
     * @returns {string[]}
     *   the available tile types in lower case, e.g. <code>["tile", "link"]</code>
     * @private
     * @see chip.types.getAvailableTypes
     */
    this.getAvailableTypes = function () {
      var sTypes;
      checkStub();
      if (oDefinition.contracts.types &&
          oDefinition.contracts.types.parameters &&
          typeof oDefinition.contracts.types.parameters.supportedTypes === "string" &&
          oDefinition.contracts.types.parameters.supportedTypes !== "") {
        // convert all supported types to lower case to make comparison easier
        sTypes = oDefinition.contracts.types.parameters.supportedTypes.toLowerCase();
        // types are comma separated
        return sTypes.split(",");
      }
      return [];
    };

    /**
     * Returns the property bag with given ID attached to this CHIP.
     * <p>
     * If there is no bag with that ID <code>undefined</code> is returned.
     *
     * @param {string} sBagId
     *   the bag ID
     *
     * @returns {sap.ui2.srvc.Bag}
     *   the CHIP's bag for given ID
     * @private
     */
    this.getBag = function (sBagId) {
      if (!sBagId) {
        throw new sap.ui2.srvc.Error("Missing bag ID", "sap.ui2.srvc.Chip");
      }

      return oBags.get(sBagId);
    };

    /**
     * Returns an array of bag IDs attached to this CHIP.
     *
     * @returns {string[]}
     *   array of bag IDs
     * @private
     */
    this.getBagIds = function () {
      return oBags.keys();
    };

    /**
     * Returns the id of this CHIP's base CHIP as defined by the page building service. Returns
     * the empty String if the CHIP does not have a base CHIP.
     *
     * @returns {string}
     *   the id of this CHIP's base CHIP. Empty string in case the CHIP has no base CHIP.
     * @see #isBasedOn()
     * @since 1.11.0
     */
    this.getBaseChipId = function () {
      return oAlterEgo.baseChipId;
    };

    /**
     * Returns the catalog by which this CHIP was loaded. The result may be
     * <code>undefined</code> if the CHIP is only a proxy and the actual
     * instance has been deleted in the backend server. This may happen for
     * CHIPs referenced by a chip instance.
     *
     * @returns {sap.ui2.srvc.Catalog}
     *   this CHIP's catalog or <code>undefined</code>
     * @since 1.19.0
     */
    this.getCatalog = function () {
      // CHIP from remote catalog
      if (oRemoteCatalog) {
        return oRemoteCatalog;
      }

      return oAlterEgo.$proxy ? undefined : oFactory.createCatalog(oAlterEgo.catalogId);
    };

    /**
     * Gets the value of a configuration parameter. Can only be called if the CHIP is not a stub
     * anymore.
     *
     * @param {string} sKey
     *   the name of the parameter
     * @returns {string}
     *   the value of the parameter or <code>undefined</code> if it does not exist
     * @since 1.2.0
     *
     * @see #isStub()
     */
    this.getConfigurationParameter = function (sKey) {
      checkStub();
      return oConfiguration[sKey];
    };


    /**
     * Returns the raw configuration of the OData CHIP entity ignoring defaults from
     * CHIP Definition XML.
     *
     * @returns {string}
     *   raw configuration of the OData CHIP entity; may be undefined
     * @private
     */
    this._getChipRawConfigurationString = function () {
      return oAlterEgo.configuration;
    };

    /**
     * Returns this CHIP's description as defined by the page building service.
     *
     * @returns {string}
     *   this CHIP's description
     * @since 1.2.0
     */
    this.getDescription = function () {
      return oAlterEgo.description;
    };

    /**
     * Returns this CHIP's ID.
     *
     * @returns {string}
     *   this CHIP's ID
     * @since 1.2.0
     */
    this.getId = function () {
      return oAlterEgo.id;
    };

    /**
     * Returns this CHIP instance's implementation of type SAPUI5 as a control. This control
     * represents the root of this CHIP instance's UI from a page builder point of view. Can only
     * be called if the CHIP is not a stub anymore.
     *
     * @param {object} oApi
     *   the CHIP instance specific API
     * @returns {sap.ui.core.Control}
     *   this CHIP instance's SAPUI5 implementation as a control
     * @since 1.2.0
     *
     * @see #isStub()
     */
    this.getImplementationAsSapui5 = function (oApi) {
      var oData, oImplementation, sBaseChipId;

      checkStub();
      oData = {
        /*
         * @namespace The namespace for the instance specific CHIP API, which allows you to
         * access the various contracts consumed by your CHIP instance.
         * @name chip
         */
        chip: oApi
      };
      oImplementation = oDefinition.implementation.sapui5;

      // In case the chip is used in FLP wave 2 or later context we load it from the standard path
      sBaseChipId = this.getBaseChipId();
      if ((sBaseChipId !== "X-SAP-UI2-CHIP:/UI2/STATIC_APPLAUNCHER") && (sBaseChipId !== "X-SAP-UI2-CHIP:/UI2/DYNAMIC_APPLAUNCHER")) {
          jQuery.sap.registerModulePath(oImplementation.$Namespace, oImplementation.$UrlPrefix);
      }

      if (oImplementation.componentName) {
        // SAPUI5 component
        return new sap.ui.core.ComponentContainer({
          component: sap.ui.getCore().createComponent({
            componentData: oData,
            name: oImplementation.componentName
          })
        });
      }

      // SAPUI5 MVC
      return sap.ui.view({
        type: oImplementation.$ViewType,
        viewName: oImplementation.$ViewName,
        viewData: oData
      });
    };

    /**
     * Returns the catalog by which this remote CHIP was loaded. This catalog is
     * <code>undefined</code> if the CHIP is from the same system as the catalog.
     *
     * @returns {sap.ui2.srvc.Catalog}
     *   this CHIP's remote catalog or <code>undefined</code>
     * @since 1.9.0
     */
    this.getRemoteCatalog = function () {
      return oRemoteCatalog;
    };

    /**
     * Returns this CHIP's title as defined by the page building service or the CHIP definition XML
     * (if available).
     *
     * @returns {string}
     *   this CHIP's title
     * @since 1.2.0
     */
    this.getTitle = function () {
      return oAlterEgo.title
         || (oDefinition && oDefinition.appearance && oDefinition.appearance.title);
    };

    /**
     * Checks whether this CHIP is based on the given CHIP instance. This can happen because there
     * is a catalog type which is built on a catalog page. In such a case the ABAP backend maps
     * each CHIP instance on that page to a CHIP in the resulting catalog.
     * <p>
     * Note: This CHIP's <code>baseChipId</code> is exactly non-empty if the CHIP is catalog-page
     * based. Then it is the ID of the CHIP used to build the CHIP instance. (This is recursive.
     * So if that CHIP is again catalog-page based...)
     *
     * @param {sap.ui2.srvc.ChipInstance} oChipInstance
     *   the CHIP instance to compare with
     * @returns {boolean}
     *   <code>true</code> iff the CHIP is based on the given CHIP instance
     * @since 1.19.1
     * @see #refresh()
     */
    this.isBasedOn = function (oChipInstance) {
      var sExpectedId
          = "X-SAP-UI2-PAGE:" + oChipInstance.getPage().getId()
          + ":" + oChipInstance.getId();

      /*
       * @param {string} sActualId
       * @returns {boolean}
       * @private
       */
      function matchesExpectation(sActualId) {
        // TODO use oAlterEgo.catalogPageChipInstanceId
        return sActualId === sExpectedId
          || sActualId.indexOf(sExpectedId + ':') === 0; // old IDs still contain the scope
      }

      return (oAlterEgo.referenceChipId && matchesExpectation(oAlterEgo.referenceChipId))
        || matchesExpectation(oAlterEgo.id);
    };

    /**
     * Tells whether this CHIP is a reference, pointing to its original CHIP.
     * Note: A refresh on the CHIP may be needed before calling this method, but only if the CHIP
     * is based on a catalog page and that corresponding catalog page may be updated in your use
     * case after the CHIP has been loaded.
     *
     * @returns {boolean}
     *   whether this CHIP is a reference
     * @since 1.19.1
     * @see #refresh()
     *
     */
    this.isReference = function () {
      return !!oAlterEgo.referenceChipId;
    };

    /**
     * Tells whether this CHIP is a broken reference,
     * as indicated by referenceChipId being set to "O" (Orphaned)
     *
     * @returns {boolean}
     *   whether this CHIP is a broken reference
     * @since 1.23.1
     *
     */
    this.isBrokenReference = function () {
      // If an underlying chip of a reference is deleted, the property referenceChipId is set
      // to "O" (Orphaned)
      return oAlterEgo.referenceChipId === "O";
    };

    /**
     * Tells whether this CHIP is still only a stub and does not yet know its CHIP definition XML.
     *
     * @returns {boolean}
     *   whether this CHIP is still only a stub
     * @since 1.2.0
     *
     * @see #load()
     */
    this.isStub = function () {
      return !oDefinition;
    };

    /**
     * Loads the CHIP definition XML in case this has not yet been done. If this CHIP is not a stub
     * anymore this method fails!
     *
     * @param {function ()} fnSuccess
     *   no-args success handler
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   If not given
     *   <code>{@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}</code> is used.
     * @since 1.2.0
     *
     * @see #isStub()
     */
    this.load = function (fnSuccess, fnFailure) {
      function onError(sErrMessage, oErrDetails) {
        // loading has failed, call all waiting error handlers
        sErrorMessage = sErrMessage;
        oErrorInformation = oErrDetails;
        var i, n;
        if (aLoadHandlers) {
          for (i = 1, n = aLoadHandlers.length; i < n; i += 2) {
            aLoadHandlers[i](sErrMessage, oErrDetails);
          }
          aLoadHandlers = null;
        }
      }

      // Note: might fail synchronously!
      function createChipDefinition() {
        if (oFactory) { // Note: factory is optional!
          oFactory.createChipDefinition(oAlterEgo.url, initialize, onError);
          return;
        }
        sap.ui2.srvc.get(oAlterEgo.url, /*XML=*/true,
          function (oXml) {
            jQuery.sap.log.debug("Loaded: " + that, null, "sap.ui2.srvc.Chip");
            initialize(new sap.ui2.srvc.ChipDefinition(oXml));
          }, onError);
      }

      function onChipUpdated() {
        if (!oAlterEgo.url) {
          if (bWaitingForUpdateViaCatalog) {
            throw new sap.ui2.srvc.Error("Remote catalog did not deliver CHIP '" + oAlterEgo.id
              + "'", "sap.ui2.srvc.Chip");
          }
          throw new sap.ui2.srvc.Error("Missing module URL", "sap.ui2.srvc.Chip");
        }
        bWaitingForUpdateViaCatalog = false;
        sChipUrl = sap.ui2.srvc.absoluteUrl(oAlterEgo.url);
        createChipDefinition();
      }

      if (!this.isStub()) {
        throw new sap.ui2.srvc.Error("Chip is not a stub anymore", "sap.ui2.srvc.Chip");
      }
      if (typeof fnSuccess !== "function") {
        throw new sap.ui2.srvc.Error("Missing success handler", "sap.ui2.srvc.Chip");
      }
      fnFailure = fnFailure || oFactory.getPageBuildingService().getDefaultErrorHandler();

      if (sErrorMessage) { // NOTE: check sErrorMessage only
        sap.ui2.srvc.call(fnFailure.bind(null, sErrorMessage, oErrorInformation), null, true);
        return;
      }

      if (aLoadHandlers) {
        // wait until loading has finished (one way or the other)
        aLoadHandlers.push(fnSuccess, fnFailure);
        return;
      }

      // start loading
      if (oAlterEgo.url) {
        createChipDefinition();
      } else if (oAlterEgo.remoteCatalogId) {
        // a remote chip, request the catalog to update all registered CHIPs (incl. this one)
        this.getRemoteCatalog().readRegisteredChips(onChipUpdated, onError);
        bWaitingForUpdateViaCatalog = true;
      } else {
        // this looks like a null object, try to read our raw data and expect a failure
        // Note: might fail synchronously!
        oFactory.getPageBuildingService().readChip(
          oAlterEgo.id,
          function (oRawChip) {
            oAlterEgo = oRawChip;
            onChipUpdated();
          },
          onError
        );
      }
      aLoadHandlers = [fnSuccess, fnFailure];
    };

    /**
     * Refreshes the CHIP from the OData service. Use this only for CHIPs that you received via a
     * catalog. When called on a CHIP received via a page, the function may fail.
     * <p>
     * This method is intended to refresh a CHIP in a catalog based on a catalog page. Such a CHIP
     * is based on a CHIP instance of this catalog page. If such a CHIP instance is changed this
     * method can be used to refresh the corresponding CHIP.
     * <p>
     * Note: This method does not replace the {@link #load} method, as the CHIP definition is not
     * loaded. Thus, if the CHIP was a stub before the refresh, it is still a stub afterwards.
     *
     * @param {function ()} fnSuccess
     *   no-args success handler
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   If not given
     *   <code>{@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}</code> is used
     * @since 1.16.5
     *
     * @see #load()
     * @see #isStub()
     * @see #isBasedOn()
     */
    this.refresh = function (fnSuccess, fnFailure) {

      function updateChip(oNewAlterEgo) {
        oAlterEgo.title = oNewAlterEgo.title;
        oAlterEgo.configuration = oNewAlterEgo.configuration;
        oAlterEgo.referenceChipId = oNewAlterEgo.referenceChipId;
        initBags(oNewAlterEgo.ChipBags && oNewAlterEgo.ChipBags.results);
        // All other fields cannot be changed via the corresponding CHIP instance.
        // TODO throw exception if URL changes?
        if (!that.isStub()) {
          that.updateConfiguration(oConfiguration, oAlterEgo.configuration);
        }
        fnSuccess();
      }

      function updateRemoteChip(oResult) {
        if (oResult.results[0]) {
          updateChip(oResult.results[0]);
        } else {
          fnFailure = fnFailure || oFactory.getPageBuildingService().getDefaultErrorHandler();
          fnFailure("Could not refresh CHIP. No update received from catalog "
            + oAlterEgo.remoteCatalogId);
        }
      }

      if (typeof fnSuccess !== "function") {
        throw new sap.ui2.srvc.Error("Missing success handler", "sap.ui2.srvc.Chip");
      }
      if (!oAlterEgo.url) {
        throw new sap.ui2.srvc.Error(that + ": CHIP is just a stub", "sap.ui2.srvc.Chip");
      }
      if (oAlterEgo.remoteCatalogId) {
        this.getRemoteCatalog().readChips([oAlterEgo.id], updateRemoteChip, fnFailure);
      } else {
        oFactory.getPageBuildingService().readChip(oAlterEgo.id, updateChip, fnFailure);
      }
    };

    /**
     * Updates the CHIP. This is an internal function, used when a "preliminary" object has been
     * created and the data from the page building service are delivered together with another
     * object (e.g. the catalog).
     *
     * @param {object} oNewAlterEgo
     *   the CHIP data as loaded via page building service
     * @private
     * @throws Error when the update data do not match or when the CHIP already is complete
     */
    this.update = function (oNewAlterEgo) {
      // was erroneously publicly documented in 1.18 and made @private in 1.19.0
      if (typeof oNewAlterEgo !== "object" || oNewAlterEgo.id !== this.getId()) {
        throw new sap.ui2.srvc.Error("Invalid update data: " + this, "sap.ui2.srvc.Chip");
      }
      // update bags if available
      if (oNewAlterEgo.ChipBags && oNewAlterEgo.ChipBags.results) {
        updateBags(oNewAlterEgo.ChipBags && oNewAlterEgo.ChipBags.results);
      }

      if (oAlterEgo.url) {
        return; // No more update, please!
      }
      if (!oNewAlterEgo.url) {
        return; // This is not really an update!
      }
      oAlterEgo = oNewAlterEgo;
      sChipUrl = sap.ui2.srvc.absoluteUrl(oAlterEgo.url);
      jQuery.sap.log.debug("Updated: " + this, null, "sap.ui2.srvc.Chip");
    };

    /**
     * Updates the given parameter map from the given JSON string. All parameters that actually were
     * defined in the CHIP definition XML are accepted. All others will raise a warning to the log.
     *
     * @param {map<String,String>} mParameters
     *   the parameter map to fill
     * @param {map<String,String>|string} vConfigurationUpdates
     *   the configuration updates as parameter map or as JSON string
     *   <p>If one parameter value is <code>undefined</code> (which can only happen by supplying a
     *   map) then this property is removed from <code>mParameters</code>.
     *
     * @since 1.2.0
     */
    this.updateConfiguration = function (mParameters, vConfigurationUpdates) {
      var mConfigurationUpdates,
        sKey,
        sValue;
      if (!vConfigurationUpdates) {
        return;
      }
      if (typeof vConfigurationUpdates === 'string') {
        try {
          mConfigurationUpdates = JSON.parse(vConfigurationUpdates);
        } catch (e) {
          // configuration as a whole is incorrect and will be ignored
          // Note: toString(true) will also output configuration, thus it is no secret
          jQuery.sap.log.warning(this + ': ignoring invalid configuration "'
              + vConfigurationUpdates + '"', null, "sap.ui2.srvc.Chip");
          return;
        }
      } else {
        mConfigurationUpdates = vConfigurationUpdates;
      }
      for (sKey in mConfigurationUpdates) {
        if (Object.prototype.hasOwnProperty.call(mConfigurationUpdates, sKey)) {
          if (Object.prototype.hasOwnProperty.call(oConfiguration, sKey)) {
            sValue = mConfigurationUpdates[sKey];
            if (sValue === undefined) {
              delete mParameters[sKey];
            } else if (typeof sValue !== 'string') {
              throw new sap.ui2.srvc.Error("Value for '" + sKey + "' must be a string",
                "sap.ui2.srvc.Chip");
            } else {
              mParameters[sKey] = sValue;
            }
          } else {
            jQuery.sap.log.warning(this + ': ignoring unknown configuration parameter ' + sKey,
              null, "sap.ui2.srvc.Chip");
          }
        }
      }
    };

    /**
     * Makes the given relative URL absolute. URLs containing host and/or protocol
     * and URLs with an absolute path remain unchanged. The URL is in no way
     * normalized; the function takes the URL of the CHIP definition XML as base.
     *
     * @param {string} sUrl
     *   the (possibly server-relative) URL
     * @returns {string}
     *   the absolute URL
     * @since 1.2.0
     */
    this.toAbsoluteUrl = function (sUrl) {
      return sap.ui2.srvc.absoluteUrl(sUrl, sChipUrl);
    };

    /**
     * Returns this CHIP's string representation.
     *
     * @param {boolean} [bVerbose=false]
     *   flag whether to show all properties
     * @returns {string}
     *   this CHIP's string representation
     * @since 1.2.0
     */
    this.toString = function (bVerbose) {
      var aResult = [
          'sap.ui2.srvc.Chip({sChipUrl:"', sChipUrl, '"'
        ];
      if (bVerbose) {
        aResult.push(',oAlterEgo:', JSON.stringify(oAlterEgo),
            ',oBags:', oBags.toString(),
            ',oDefinition:', JSON.stringify(oDefinition)
          );
      }
      aResult.push('})');
      return aResult.join('');
    };

    /**
     * This method can be used to figure out if the CHIP initially existed.
     * This is only relevant when the CHIP navigation property was expanded
     * (OData $expand).
     *
     * @returns {boolean}
     *    Whether the CHIP initially existed.
     *
     * @private
     */
    this.isInitiallyDefined = function (bDefined) {
      return bDefined;
    }.bind(
      null,
      oAlterEgo && !oAlterEgo.hasOwnProperty("$proxy") // $proxy (set from factory) when null
    );

    // constructor code -------------------------------------------------------
    if (!sap.ui2.srvc.Map) {
      fnRequire("sap.ui2.srvc.utils");
    }
    if (!oAlterEgo) {
      throw new sap.ui2.srvc.Error("Missing CHIP description", "sap.ui2.srvc.Chip");
    }

    sChipUrl = sap.ui2.srvc.absoluteUrl(oAlterEgo.url);
    if (oAlterEgo.remoteCatalogId) {
      oRemoteCatalog = oFactory.createCatalog(oAlterEgo.remoteCatalogId);
      if (!oAlterEgo.url) {
        oRemoteCatalog.registerChip(this);
      }
    }
    initBags(oAlterEgo.ChipBags && oAlterEgo.ChipBags.results);
    jQuery.sap.log.debug("Created: " + this, null, "sap.ui2.srvc.Chip");
  };

  // "public" methods (static) ------------------------------------------------

  /**
   * Adds a contract to the list of known contracts which can be consumed by CHIPs.
   *
   * @param {string} sName
   *   The name of the contract.
   * @param {function (sap.ui2.srvc.ChipInstance)} fnInitializer
   *   This function will initialize the contract for a CHIP instance. When the API object for a
   *   CHIP instance requesting this contract is initialized, a sub-object with the contract's name
   *   is added to the API. The initializer is then called with this sub-object as <code>this</code>
   *   and the CHIP instance as parameter.
   * @since 1.2.0
   */
  sap.ui2.srvc.Chip.addContract = function (sName, fnInitializer) {
    if (getContractInitializer(sName)) {
      if (!sap.ui2.srvc.Error) {
        fnRequire("sap.ui2.srvc.error");
      }
      throw new sap.ui2.srvc.Error("Cannot register contract '" + sName + "' twice",
        "sap.ui2.srvc.Chip");
    }
    mContractsByName[sName] = fnInitializer;
  };

  /* eslint-disable no-unused-vars*/
  /**
   * Removes a contract from the list of known contracts which can be consumed by CHIPs. Does not
   * fail even if the contract was not known before!
   * Note: Only used in test code via testPublishAt
   *
   * @param {string} sName
   *   The name of the contract.
   * @since 1.11.0
   * @private
   */
  sap.ui2.srvc.testPublishAt(sap.ui2.srvc.Chip);
  function removeContract(sName) {
    delete mContractsByName[sName];
  }
  /* eslint-enable no-unused-vars*/
}());
