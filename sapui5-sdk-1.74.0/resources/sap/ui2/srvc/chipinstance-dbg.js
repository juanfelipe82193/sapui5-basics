// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The <code>sap.ui2.srvc.ChipInstance</code> object with related functions.
 */

this.sap = this.sap || {};

(function () {
  "use strict";
  /*global jQuery, sap */

  sap.ui2 = sap.ui2 || {};
  sap.ui2.srvc = sap.ui2.srvc || {};

  // Only declare the module if jQuery.sap exists. Otherwise we do not even try to require assuming
  // that the script has been loaded manually (before SAPUI5).
  // Load time branching pattern
  var fnRequire = String; // NOP (String exists and is free of side-effects)
  if (typeof jQuery === "function" && jQuery.sap) {
    jQuery.sap.declare("sap.ui2.srvc.chipinstance");
    // avoid fnRequire = jQuery.sap.require as require cannot be spied on afterwards
    fnRequire = function () {
      jQuery.sap.require.apply(this, arguments);
    };
  }

  // "public class" -----------------------------------------------------------

  /**
   * Constructs a new representation (wrapper) of the CHIP instance with the given
   * CHIP instance data as loaded from the page building service. A CHIP instance is a usage of a
   * CHIP in a page
   * <p>
   * Initially a stub is created, which can later load its properties and related objects
   * asynchronously.
   * <p>
   * A CHIP instance is a mutable object and (page building service related) changes can be
   * persisted by the page building service.
   *
   * @param {sap.ui2.srvc.Factory} oFactory
   *  the factory
   * @param {object} oAlterEgo
   *  the CHIP instance data as loaded via the page building service, including embedded
   *  CHIP instance property bags
   * @param {sap.ui2.srvc.Chip} oChip
   *  the CHIP (which might still be a stub)
   * @param {sap.ui2.srvc.Page} [oPage]
   *  (since 1.9.0) the page to which this CHIP instance belongs
   *
   * @class
   * @see sap.ui2.srvc.PageBuildingService
   * @since 1.2.0
   */
  sap.ui2.srvc.ChipInstance = function (oFactory, oAlterEgo, oChip, oPage) {
    var oApi,
      oBags, // {sap.ui2.srvc.Map<string,sap.ui2.srvc.Bag>}
      oConfiguration,
      oContractsByName = new sap.ui2.srvc.Map(), // {sap.ui2.srvc.Map<string,object>}
      bFullscreen = false,
      aFullscreenHandlers = [],
      fnRefreshHandler,
      sTitle, // no own temporary title so far
      fnTitleChange,
      that = this;

    // BEWARE: constructor code below!

    // "private" methods ------------------------------------------------------

    /**
     * The alter ego object has some properties indicating that a CHIP instance is a reference.
     * This method modifies those properties in a way, that this CHIP instance becomes a
     * non-reference.
     * Should be called when an action was executed which made a reference CHIP instance a
     * non-reference in the backend.
     * @private
     */
    function makeNonReference() {
      // note: server sets "" (instead of undefined) for non-references
      oAlterEgo.referenceChipInstanceId = "";
      oAlterEgo.referencePageId = "";
    }

    /**
     * @see sap.ui2.srvc#Bag
     * @param {sap.ui2.srvc.Bag} oBag
     *   unused
     * @private
     */
    function bagChangeHandler() {
      // copy on write: cannot be a reference anymore!
      makeNonReference();

      if (oPage) {
        // bag changes may result in Scope changes of the page
        oPage.updateScope();
      }
    }

    /**
     * Makes sure this CHIP instance is not just a stub.
     *
     * @private
     */
    function checkStub() {
      if (!oApi) {
        throw new sap.ui2.srvc.Error(that + ": CHIP instance is just a stub",
          "sap.ui2.srvc.ChipInstance");
      }
    }

    /**
     * Complete the construction of a CHIP instance and make it ready for full use
     * within a page builder: create CHIP API.
     *
     * @param {function ()} fnSuccess
     *   no-args success handler
     * @param {function ([string])} [fnFailure]
     *   error handler, taking an optional error message
     *
     * @private
     */
    function initialize(fnSuccess, fnFailure) {
      if (!oApi) {
        oApi = oChip.createApi(that, oContractsByName);
      }

      jQuery.sap.log.debug("Initialized: " + that, null, "sap.ui2.srvc.ChipInstance");
      sap.ui2.srvc.call(fnSuccess, fnFailure); // Note: this method was already called async.
    }

    /**
     * Initialize the bags from raw CHIP instance bags array.
     * @param {object[]} aRawChipInstanceBags
     *   Array of raw CHIP instance bags
     *
     * @private
     */
    function initializeBags(aRawChipInstanceBags) {
      var i,
        aChipBagIds = oChip.getBagIds(),
        oRawBag;
      for (i = 0; i < aRawChipInstanceBags.length; i += 1) {
        // for each bag instance: create wrapper
        fnRequire("sap.ui2.srvc.bag");
        oBags.put(aRawChipInstanceBags[i].id,
          new sap.ui2.srvc.Bag(oFactory, aRawChipInstanceBags[i],
            oChip.getBag(aRawChipInstanceBags[i].id), bagChangeHandler));
      }
      for (i = 0; i < aChipBagIds.length; i += 1) {
        oRawBag = {
          pageId: oAlterEgo.pageId,
          instanceId: oAlterEgo.instanceId,
          id: aChipBagIds[i],
          $tmp: true
        };
        if (!oBags.containsKey(oRawBag.id)) { // do not overwrite CHIP instance bags!
          oBags.put(oRawBag.id,
            new sap.ui2.srvc.Bag(oFactory, oRawBag, oChip.getBag(oRawBag.id), bagChangeHandler));
        }
      }
    }

    /**
     * Lazily initialize this CHIP instance's configuration. Requires a complete
     * CHIP, not just a stub!
     *
     * @private
     */
    function initializeConfiguration() {
      if (oChip.isStub()) {
        // BCP 1780175765
        // fail early as updateConfiguration will also throw in this case which results in
        // oConfig being initialized wrongly to an empty object
        throw new sap.ui2.srvc.Error(this + ": initializeConfiguration expects that the CHIP is no stub anymore",
          "sap.ui2.srvc.ChipInstance", /*bLogError*/false);
      }

      if (!oConfiguration) {
        oConfiguration = {};
        oChip.updateConfiguration(oConfiguration, oAlterEgo.configuration);
      }
    }

    /**
     * Persists this CHIP instance.
     *
     * @param {function ()} [fnSuccess]
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
    function persist(fnSuccess, fnFailure) {
      oFactory.getPageBuildingService().updatePageChipInstance(oAlterEgo,
        function () {
          // copy on write: we cannot be a reference anymore!
          makeNonReference();

          if (oPage) {
            oPage.updateScope();
          }
          if (fnSuccess) {
            fnSuccess(); // no-args!
          }
        }, fnFailure);
    }

    // "public" methods -------------------------------------------------------

    /**
     * Attaches the given event handler to the "fullscreen" event which is fired whenever
     * fullscreen mode is toggled. There can be multiple handlers at any time.
     *
     * Use <code>Function.prototype.bind()</code> to determine the event handler's
     * <code>this</code> or some of its arguments.
     *
     * Note: Without such an event handler, the CHIP will simply continue to display the
     * same content, no matter whether fullscreen mode is on or off.
     *
     * @param {function} fnEventHandler
     *   the event handler for the "fullscreen" event
     * @since 1.2.0
     */
    this.attachFullscreen = function (fnEventHandler) {
      if (typeof fnEventHandler !== "function") {
        throw new sap.ui2.srvc.Error(this + ": fullscreen event handler is not a function",
          "sap.ui2.srvc.ChipInstance");
      }
      aFullscreenHandlers.push(fnEventHandler);
    };

    /**
     * Attaches the given event handler to the "refresh" event which is fired
     * whenever the user requests a refresh of this CHIP instance's content.
     *
     * Use <code>Function.prototype.bind()</code> to determine the event handler's
     * <code>this</code> or some of its arguments.
     *
     * Note: Without such an event handler, the CHIP will be recreated to enforce a refresh!
     *
     * @param {function} [fnEventHandler]
     *   the event handler for the "refresh" event
     * @since 1.2.0
     */
    this.attachRefresh = function (fnEventHandler) {
      if (fnEventHandler && typeof fnEventHandler !== "function") {
        throw new sap.ui2.srvc.Error(this + ": refresh event handler is not a function",
          "sap.ui2.srvc.ChipInstance");
      }
      fnRefreshHandler = fnEventHandler;
    };

    /**
     * Attaches the listener that is notified when setTitle is called. The caller
     * may be the page builder as well as the CHIP.
     *
     * @param {function (sap.ui2.srvc.ChipInstance)} fnNewTitleChange
     *     the listener function, it will be called with the instance as parameter;
     *     may be <code>null</code> to remove the listener
     * @since 1.2.0
     */
    this.attachTitleChange = function (fnNewTitleChange) {
      fnTitleChange = fnNewTitleChange;
    };

    /**
     * Detaches all event handlers from all events.
     *
     * @since 1.2.0
     */
    this.detachAll = function () {
      aFullscreenHandlers = [];
      fnRefreshHandler = null;
    };

    /**
     * Releases all resources associated with this CHIP instance. Call this method
     * just before you stop using it.
     *
     * @since 1.2.0
     */
    this.exit = function () {
      jQuery.sap.log.debug('Exit: ' + that, null, "sap.ui2.srvc.ChipInstance");

      // Note: CHIPs are shared objects, do not exit them!

      // reset to initial state
      oApi = null;
      oBags = new sap.ui2.srvc.Map();
      oConfiguration = null;
      sTitle = null;
      fnTitleChange = null;
    };

    /**
     * Returns this CHIP instance's specific API instance.
     *
     * @returns {object}
     *   this CHIP instance's specific API instance
     * @since 1.2.0
     */
    this.getApi = function () {
      return oApi;
    };

    /**
     * Returns an array of bag IDs attached to this CHIP instance.
     *
     * @returns {string[]}
     *   array of bag IDs
     * @since 1.5.0
     */
    this.getBagIds = function () {
      return oBags.keys();
    };

    /**
     * Returns the property bag with given ID attached to this CHIP instance.
     * <p>
     * If there is no bag with that ID an empty bag is returned.
     *
     * @param {string} sBagId
     *   the bag ID
     *
     * @returns {sap.ui2.srvc.Bag}
     *   the CHIP instance's bag for given ID
     * @since 1.5.0
     */
    this.getBag = function (sBagId) {
      var oBag;

      if (!sBagId) {
        throw new sap.ui2.srvc.Error("Missing bag ID", "sap.ui2.srvc.ChipInstance");
      }

      oBag = oBags.get(sBagId);
      if (oBag) {
        return oBag;
      }

      fnRequire("sap.ui2.srvc.bag");
      oBag = new sap.ui2.srvc.Bag(oFactory,
        {pageId: oAlterEgo.pageId, instanceId: oAlterEgo.instanceId, id: sBagId, $tmp: true},
        /*oParentBag*/null,
        bagChangeHandler);
      oBags.put(sBagId, oBag);
      return oBag;
    };

    /**
     * Returns this instance's CHIP.
     *
     * @returns {sap.ui2.srvc.Chip}
     *   this instance's CHIP
     * @since 1.2.0
     */
    this.getChip = function () {
      return oChip;
    };

    /**
     * Get the persisted CHIP instance configuration as string.
     *
     * @returns {string}
     *   the persisted configuration
     * @since 1.11.0
     * @private
     */
    this.getConfiguration = function () {
      return oAlterEgo.configuration;
    };

    /**
     * Retrieves a parameter value from the CHIP instance configuration, the
     * CHIP configuration or the CHIP definition.
     *
     * @param {string} sKey
     *   the key
     * @returns {string}
     *   the configuration parameter value or <code>undefined</code> if unknown
     * @since 1.2.0
     */
    this.getConfigurationParameter = function (sKey) {
      initializeConfiguration();
      if (Object.prototype.hasOwnProperty.call(oConfiguration, sKey)) {
        return oConfiguration[sKey];
      }
      return oChip.getConfigurationParameter(sKey);
    };

    /**
     * @namespace The (pseudo) namespace for the instance specific CHIP API. Note that there is no
     * global <code>window.chip</code> property. Instead, you can access the instance specific CHIP
     * API from the view data of the SAPUI5 view (<code>sap.ui.core.mvc.View#getViewData()</code>)
     * in the CHIP coding. For CHIPs based on components, call
     * <code>sap.ui.core.UIComponent#getComponentData()</code> instead. In both cases, the property
     * is simply called <code>chip</code>.
     * @name chip
     * @since 1.2.0
     *
     * @see sap.ui2.srvc.ChipInstance#getImplementationAsSapui5
     */

    /**
     * @namespace The (pseudo) namespace for contract interfaces (to be used by a page builder).
     * Note that there is no global <code>window.contract</code> property. Instead, you can access
     * contracts by {@link sap.ui2.srvc.ChipInstance#getContract}.
     *
     * @name contract
     * @since 1.11.0
     *
     * @see sap.ui2.srvc.ChipInstance#getContract
     */

    /**
     * Returns the contract interface (to be used by a page builder) for the given contract name.
     * Can only be called if the CHIP instance is not a stub anymore.
     * Note that a separate contract interface is optional and need not be available for each
     * and every contract!
     *
     * @param {string} sName
     *   the name of a contract, e.g. "url"
     * @returns {object}
     *   an optional contract interface to be used by a page builder; may be <code>undefined</code>
     * @since 1.11.0
     *
     * @see #isStub()
     */
    this.getContract = function (sName) {
      checkStub();
      return oContractsByName.get(sName);
    };

    /**
     * Tells whether the fullscreen mode is currently turned on.
     *
     * @returns {boolean}
     *   whether fullscreen mode is turned on
     * @since 1.2.0
     */
    this.getFullscreen = function () {
      return bFullscreen;
    };

    /**
     * Returns this CHIP instance's ID, as defined within the page building service.
     *
     * @returns {string}
     *   this CHIP instance's ID
     * @since 1.2.0
     */
    this.getId = function () {
      return oAlterEgo.instanceId;
    };

    /**
     * Returns this CHIP instance's implementation of type SAPUI5 as a control. This control
     * represents the root of this CHIP instance's UI from a page builder point of view. Can only
     * be called if the CHIP instance is not a stub anymore.
     *
     * @returns {sap.ui.core.Control}
     *   this CHIP instance's SAPUI5 implementation as a control
     * @since 1.2.0
     *
     * @see #isStub()
     */
    this.getImplementationAsSapui5 = function () {
      checkStub();
      return oChip.getImplementationAsSapui5(oApi);
    };

    /**
     * Returns this CHIP instance's layout data as defined by the page building service.
     *
     * @returns {string}
     *   this CHIP instance's layout data
     * @since 1.2.0
     */
    this.getLayoutData = function () {
      return oAlterEgo.layoutData;
    };

    /**
     * Returns this CHIP instance's page if it has been passed explicitly to our constructor or
     * the corresponding factory method, or if this CHIP instance has been created by its page.
     *
     * @returns {sap.ui2.srvc.Page}
     *   this CHIP instance's page, which might be unknown (<code>undefined</code>)
     * @since 1.9.0
     * @see sap.ui2.srvc.ChipInstance
     * @see sap.ui2.srvc.Factory#createChipInstance
     * @see sap.ui2.srvc.Page#addChipInstance
     * @see sap.ui2.srvc.Page#load
     * @see sap.ui2.srvc.Page#removeChipInstance
     */
    this.getPage = function () {
      return oPage;
    };

    /**
     * Returns this instance's title.
     *
     * @returns {string}
     *   this instance's title
     * @since 1.2.0
     */
    this.getTitle = function () {
      // Note: we cannot have a falsy temporary title nor can we persist one!
      return sTitle || oAlterEgo.title || oChip.getTitle();
    };

    /**
     * Returns the instance's latest update date, as given by the backend.
     * May return <code>undefined</code> in case the CHIP instance is a stub or the date could not
     * be parsed.
     *
     * @param {boolean} [bInRawFormat=false]
     *   When set to false (default), the date will be returned as <code>date</code>. When set to
     *   true, the value will be returned as given from the backend, which means as a
     *   <code>string</code> like <code>"/Date(1415104869000)/"</code>.
     * @returns {date|string}
     *   The latest update date returned as date or string. May be undefined in case of a stub.
     * @private
     */
    this.getUpdated = function (bInRawFormat) {
      //TODO after an update of the instance, the new value must be updated in oAlterEgo
      function parsingFailed() {
        jQuery.sap.log.error("Parse Error: CHIP instance's updated property has unexpected format",
          "value of updated property: '" + oAlterEgo.updated + "'", "sap.ui2.srvc.ChipInstance");
      }

      var aMatches, oResultDate;
      if (oAlterEgo.updated && !bInRawFormat) {
        // ODate V2: format looks like "/Date(1415104869000)/"
        aMatches = /\((\d*)\)/.exec(oAlterEgo.updated);

        if (!aMatches) {
          parsingFailed();
          return undefined;
        }

        // Note: parseInt does not throw but returns NaN, new Date(NaN) returns InvalidDate
        oResultDate = new Date(parseInt(aMatches[1], 10));

        if (isNaN(oResultDate.getTime())) {
          parsingFailed();
          return undefined;
        }
        return oResultDate;
      }
      return oAlterEgo.updated;
    };

    /**
     * Tells whether this CHIP instance is marked as outdated.
     *
     * @returns {boolean}
     *   whether this CHIP instance is marked as outdated
     * @since 1.9.1
     */
    this.isOutdated = function () {
      return oAlterEgo.outdated === "X";
    };

    /**
     * Tells whether this CHIP instance is readOnly.
     *
     * @throws Error if the CHIP instance is still a stub
     * @returns {boolean}
     *   whether this CHIP instance is readOnly
     * @since 1.32.0
     */
    this.isReadOnly = function () {
      checkStub();
      return oAlterEgo.isReadOnly === "X";
    };

    /**
     * Tells whether this CHIP instance is a reference, pointing to its original CHIP instance.
     *
     * @returns {boolean}
     *   whether this CHIP instance is a reference
     * @since 1.19.1
     * @see #getOriginalId()
     * @see #getOriginalPageId()
     * @see #isBrokenReference()
     */
    this.isReference = function () {
      // note in 1.36- and earlier broken references had the following properties:
      //    referencePageId: "O",
      //    referenceChipInstanceId: ""
      return !!oAlterEgo.referenceChipInstanceId || !!oAlterEgo.referencePageId;
    };

    /**
     * Tells whether this CHIP instance is a broken reference, which means the original has been deleted.
     *
     * @returns {boolean}
     *   whether this CHIP instance is a broken reference
     * @since 1.36.1
     * @see #isReference()
     */
    this.isBrokenReference = function () {
      // note in 1.36- and earlier broken references had the following properties:
      //    referencePageId: "O",
      //    referenceChipInstanceId: ""
      return oAlterEgo.referenceChipInstanceId === "O" || oAlterEgo.referencePageId === "O";
    };

    /**
     * If this CHIP instance is a reference, this method returns the ID of the original
     * CHIP instance. If not <code>undefined</code> is returned.
     *
     * @returns {string}
     *   The original CHIP instance ID or <code>undefined</code>
     * @since 1.34.0
     * @see #isReference()
     * @see #getOriginalPageId()
     */
    this.getOriginalId = function () {
      // the server returns "" for non-references but this is mapped to undefined here as this is
      // more JavaScript-like. In addition "O" is removed as it is indicating that the original was deleted.
      return (oAlterEgo.referenceChipInstanceId === "" || oAlterEgo.referenceChipInstanceId === "O") ?
        undefined : oAlterEgo.referenceChipInstanceId;
    };

    /**
     * If this CHIP instance is a reference, this method returns the page ID of the original CHIP
     * instance's page. If not <code>undefined</code> is returned.
     *
     * @returns {string}
     *   Page ID of the original CHIP instance's page or <code>undefined</code>
     * @since 1.34.0
     * @see #isReference()
     * @see #getOriginalId()
     */
    this.getOriginalPageId = function () {
      // the server returns "" for non-references but this is mapped to undefined here as this is
      // more JavaScript-like. In addition "O" is removed as it is indicating that the original was deleted.
      return (oAlterEgo.referencePageId === "" || oAlterEgo.referencePageId === "O") ?
        undefined : oAlterEgo.referencePageId;
    };

    /**
     * Tells whether this CHIP instance is still only a stub and needs to be loaded.
     *
     * @returns {boolean}
     *   whether this CHIP instance is still only a stub
     * @since 1.2.0
     *
     * @see #load()
     */
    this.isStub = function () {
      return !oApi;
    };

    /**
     * Completes the construction of a CHIP instance and makes it ready for full use
     * within a page builder: loads CHIP definition XML, creates CHIP API.
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
     */
    this.load = function (fnSuccess, fnFailure) {
      //TODO disallow multiple calls?
      var fnLoad;

      fnFailure = fnFailure || oFactory.getPageBuildingService().getDefaultErrorHandler();
      fnLoad = initialize.bind(null, fnSuccess, fnFailure);

      if (oChip.isStub()) {
        oChip.load(fnLoad, fnFailure);
      } else {
        sap.ui2.srvc.call(fnLoad, fnFailure, true);
      }
    };

    /**
     * Removes this CHIP instance from its page. This deletes the page CHIP instance
     * within the page building service! Since 1.9.0 it also removes it from the page to which this
     * CHIP instance belongs, as long as that page is known.
     * <p>
     * Note: Does not affect the page's layout.
     * <p>
     * Note (since 1.9.0): Call either {@link sap.ui2.srvc.ChipInstance#remove} or
     * {@link sap.ui2.srvc.Page#removeChipInstance}, the result will be the same!
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
     * @since 1.2.0
     *
     * @see #getPage
     * @see sap.ui2.srvc.Page#removeChipInstance
     */
    this.remove = function (fnSuccess, fnFailure) {
      if (oPage && oPage.removeChipInstance(that, fnSuccess, fnFailure)) {
        return; // wait, page will call us again!
      }

      this.exit();
      oFactory.getPageBuildingService().deletePageChipInstance(
        oAlterEgo.pageId,
        oAlterEgo.instanceId,
        fnSuccess,
        fnFailure
      );
    };

    /**
     * Calls refresh handler if registered. Returns <code>true</code> if refresh handler has been
     * called successfully.
     *
     * @returns {boolean}
     *   <code>true</code> if refresh handler has been called successfully
     * @since 1.2.0
     */
    this.refresh = function () {
      if (fnRefreshHandler) {
        try {
          fnRefreshHandler(); // Note: "this" is undefined
          return true;
        } catch (ex) {
          jQuery.sap.log.error(that + ": call to refresh handler failed: "
            + (ex.message || ex.toString()), null, "sap.ui2.srvc.ChipInstance");
          return false;
        }
      }
      return false;
    };

    /**
     * Turns the fullscreen mode on as indicated. Calls the attached listener in case the mode
     * has changed.
     *
     * @param {boolean} bOn
     *   whether fullscreen mode is turned on
     * @since 1.2.0
     */
    this.setFullscreen = function (bOn) {
      var i, n;

      if (bFullscreen !== bOn) {
        bFullscreen = bOn;

        for (i = 0, n = aFullscreenHandlers.length; i < n; i += 1) {
          aFullscreenHandlers[i]();
        }
      }
    };

    /**
     * Determines this CHIP instance's layout data (encoded as a string, for
     * example in JSON) and persists it.
     *
     * @param {string} sLayoutData
     *   the new layout data
     * @param {function ()} [fnSuccess]
     *   no-args success handler
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   Default: see {@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}
     * @since 1.2.0
     */
    this.setLayoutData = function (sLayoutData, fnSuccess, fnFailure) {
      if (oAlterEgo.layoutData === sLayoutData) {
        if (fnSuccess) {
          fnFailure = fnFailure || oFactory.getPageBuildingService().getDefaultErrorHandler();
          sap.ui2.srvc.call(fnSuccess, fnFailure, true);
        }
        return;
      }
      oAlterEgo.layoutData = sLayoutData;
      persist(fnSuccess, fnFailure);
    };

    /**
     * Changes this instance's title and persists it if requested. The title change
     * listener (see {@link #attachTitleChange}) is called.
     *
     * This method is not reentrant.
     *
     * @param {string} sNewTitle
     *   the new title
     * @param {boolean} [bDoPersist=false]
     *   whether the change shall be persisted
     * @param {function ()} [fnSuccess]
     *   no-args success handler
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   Default: see {@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}
     * @since 1.2.0
     *
     * @see #getPage()
     * @see sap.ui2.srvc.Page#getOriginalLanguage()
     */
    this.setTitle = function (sNewTitle, bDoPersist, fnSuccess, fnFailure) {
      var sOldTitle;
      fnFailure = fnFailure || oFactory.getPageBuildingService().getDefaultErrorHandler();

      if (sTitle !== sNewTitle) {
        // adjust temporary title
        sTitle = sNewTitle;

        if (fnTitleChange) {
          // if called by CHIP: make sure listener runs asynchronously
          // (thus not during initial rendering)
          sap.ui2.srvc.call(
            fnTitleChange.bind(null, this),
            fnFailure,
            !bDoPersist
          );
        }
      }

      if (bDoPersist && oAlterEgo.title !== sTitle) {
        sOldTitle = oAlterEgo.title;
        oAlterEgo.title = sTitle;
        sTitle = undefined;
        persist(fnSuccess, function () {
          // restore old title in case of failure
          oAlterEgo.title = sOldTitle;
          // reset temporary title too
          sTitle = undefined;

          fnFailure.apply(null, arguments);
        });
      } else if (fnSuccess) {
        sap.ui2.srvc.call(fnSuccess, fnFailure, true);
      }
    };

    /**
     * Returns this CHIP instance's string representation.
     *
     * @param {boolean} [bVerbose=false]
     *   flag whether to show all properties
     * @returns {string}
     *   this CHIP instance's string representation
     * @since 1.2.0
     */
    this.toString = function (bVerbose) {
      var aResult = ['sap.ui2.srvc.ChipInstance({oChip:', oChip.toString(bVerbose),
        ',bFullscreen:', bFullscreen
        ];
      if (bVerbose) {
        aResult.push(',oAlterEgo:', JSON.stringify(oAlterEgo),
            ',oApi:', JSON.stringify(oApi),
            ',oBags:', oBags.toString(),
            ',oConfiguration:', JSON.stringify(oConfiguration),
            ',oFactory:', oFactory.toString(bVerbose),
            ',aFullscreenHandlers.length:', aFullscreenHandlers.length,
            ',sTitle:"', sTitle, '"'
          );
      }
      aResult.push('})');
      return aResult.join('');
    };

    /**
     * Updates the configuration. All parameters that actually were defined in the CHIP definition
     * XML are accepted. All others will raise a warning to the log.
     * <p>
     * The configuration is maintained as JSON string in a single property. This has the following
     * consequences regarding the scopes:
     * <ul>
     * <li>If the CHIP instance has never been persisted in the current scope, the configuration is
     *   inherited from lower scopes. If there are no changes either, the properties have their
     *   default values from the CHIP definition.
     * <li>When persisting the CHIP instance in a given scope for the first time (may it be due to
     *   configuration changes or title changes...), the configuration changes are merged with
     *   inherited changes from lower scopes and persisted in the current scope. Subsequent changes
     *   in lower scopes will then remain invisible.
     * <li>A property for which never an update was supplied has the default value from the CHIP
     *   definition. This also applies if you delete the update again by setting it to
     *   <code>undefined</code>.
     * </ul>
     * <b>Example:</b><br>
     * The CHIP has two properties: <code>a</code> with default value "foo" and <code>b</code> with
     * default value "bar". The administrator changes <code>a</code> to "baz" in scope CUST. Later
     * a user changes <code>b</code> in PERS. Then the administrator decides to change
     * <code>a</code> back to "foo", but our user will never see this again, because the system
     * persisted both <code>a</code> and <code>b</code> in PERS.
     *
     * @param {map<String,String>} mConfigurationUpdates
     *   The configuration updates. The values must be strings. You can however set a value to
     *   <code>undefined</code>. This removes it from the list of updated property and effectively
     *   resets it to the default value.
     * @param {function ()} [fnSuccess]
     *   no-args success handler
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   Default: see {@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}
     * @since 1.7.0
     */
    this.updateConfiguration = function (mConfigurationUpdates, fnSuccess, fnFailure) {
      initializeConfiguration();
      oChip.updateConfiguration(oConfiguration, mConfigurationUpdates);
      oAlterEgo.configuration = JSON.stringify(oConfiguration);
      persist(fnSuccess, fnFailure);
    };

    // constructor code -------------------------------------------------------
    if (!sap.ui2.srvc.Map) {
      fnRequire("sap.ui2.srvc.utils");
    }
    oBags = new sap.ui2.srvc.Map();

    initializeBags((oAlterEgo.ChipInstanceBags && oAlterEgo.ChipInstanceBags.results)
      || []);

    delete oAlterEgo.Chip; //TODO do not modify caller's object!
    jQuery.sap.log.debug("Created: " + this, null, "sap.ui2.srvc.ChipInstance");
  };
}());
