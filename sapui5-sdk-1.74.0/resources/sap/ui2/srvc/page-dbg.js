// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview A wrapper for a page loaded from the page building service.
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
    jQuery.sap.declare("sap.ui2.srvc.page");
    // avoid fnRequire = jQuery.sap.require as require cannot be spied on afterwards
    fnRequire = function () {
      jQuery.sap.require.apply(this, arguments);
    };
  }

  // "public class" ************************************************************

  /**
   * Constructs a new representation (wrapper) of the page with the given ID
   * or the given page data to be loaded from the given factory's page building
   * service. Associated CHIP instances (see {@link sap.ui2.srvc.ChipInstance}), catalogs (see
   * {@link sap.ui2.srvc.Catalog} and {@link sap.ui2.srvc.AllCatalogs}), and bags (see
   * {@link sap.ui2.srvc.Bag}) are also constructed.
   * <p>
   * Initially a stub is created, which can later load its properties and related objects
   * asynchronously.
   *<p>
   * A page is a mutable object and changes can be persisted by the page building service.
   *
   * @param {sap.ui2.srvc.Factory} oFactory
   *  the factory
   * @param {string|object} vPageData
   *   the page's ID or its page data as loaded via page building service
   *
   * @class
   * @since 1.2.0
   * @see sap.ui2.srvc.PageBuildingService
   */
  sap.ui2.srvc.Page = function (oFactory, vPageData) {
    var sId, // the page ID
      oAllCatalogs, // {sap.ui2.srvc.AllCatalogs|undefined} the page's "allCatalogs" collection
      oAlterEgo, // page's representation with all relations removed
      mBags, // {sap.ui2.srvc.Map<string,sap.ui2.srvc.Bag|jQuery.Deferred>}
      oCatalog, // created on demand
      aChipInstances = [], // {sap.ui2.srvc.ChipInstance[]}
      bIsLoadingBagsOnDemand = true,
      bIsStub = true,
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
     * Initializes the page when the alter ego is known
     * @param {object} oNewAlterEgo
     *   the page data as loaded via page building service
     *
     * @private
     */
    function initialize(oNewAlterEgo) {
      var i,
        bBagsLoaded = !!(oNewAlterEgo.Bags && oNewAlterEgo.Bags.results),
        aRawBags = bBagsLoaded ? oNewAlterEgo.Bags.results : [],
        aRawChipInstances
          = (oNewAlterEgo.PageChipInstances && oNewAlterEgo.PageChipInstances.results) || [],
        iBagCount = aRawBags.length,
        iChipInstanceCount = aRawChipInstances.length;

      bIsLoadingBagsOnDemand = !bBagsLoaded;
      // remove relations and store page representation
      delete oNewAlterEgo.Bags;
      delete oNewAlterEgo.Catalog;
      delete oNewAlterEgo.PageChipInstances;
      oAlterEgo = oNewAlterEgo;
      bIsStub = false;

      // create bag instances
      if (iBagCount > 0) {
        fnRequire("sap.ui2.srvc.bag");
      }
      for (i = 0; i < iBagCount; i += 1) {
        // for each bag instance: create wrapper
        mBags.put(aRawBags[i].id, new sap.ui2.srvc.Bag(oFactory, aRawBags[i]));
      }

      // create CHIP instances
      for (i = 0; i < iChipInstanceCount; i += 1) {
        // for each CHIP instance: create wrapper
        aChipInstances[i] = oFactory.createChipInstance(aRawChipInstances[i], null, null, that);
      }
    }

    /**
     * Persists this page.
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
     *
     * @private
     */
    function persist(fnSuccess, fnFailure) {
      oFactory.getPageBuildingService().updatePage(oAlterEgo,
        function (oRawPage) {
          that.updateScope();
          if (fnSuccess) {
            fnSuccess(); // no-args!
          }
        }, fnFailure);
    }

    // "public" methods ----------------------------------------------------------

    /**
     * Adds a new instance for the given CHIP to this page and loads that CHIP
     * instance completely unless requested otherwise. Can only be called if the page is not a stub
     * anymore.
     * <p>
     * Note: Does not affect this page's layout.
     *
     * @param {sap.ui2.srvc.Chip|sap.ui2.srvc.ChipInstance} vTemplate
     *   the CHIP (or stub) which is to be used; (since 1.11.0) alternatively a CHIP instance, in
     *   this case a new CHIP instance is created referring to the same CHIP and having the same
     *   title and configuration. The layout data will not be copied. It is up to the caller to
     *   update that value.
     *   No bags will be copied!
     * @param {function (sap.ui2.srvc.ChipInstance)} fnSuccess
     *   success handler, taking the newly created CHIP instance which knows its page
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   If not given
     *   <code>{@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}</code> is used
     * @param {boolean} [bPartially=false]
     *   whether to create the new CHIP instance as a stub only
     * @since 1.2.0
     *
     * @throws Error if the page is still a stub
     * @see #isStub()
     * @see sap.ui2.srvc.ChipInstance#getPage
     */
    this.addChipInstance = function (vTemplate, fnSuccess, fnFailure, bPartially) {
      var oPbs = oFactory.getPageBuildingService(),
        oChip,
        oChipInstance;

      function update(oRawChipInstance) {
        var oChipInstance = oFactory.createChipInstance(oRawChipInstance,
            bPartially ? null : fnSuccess, fnFailure, that);
        aChipInstances.push(oChipInstance);
        that.updateScope();

        if (bPartially) {
          fnSuccess(oChipInstance);
        }
      }

      checkStub();
      if (vTemplate.getChip) {
        oChipInstance = vTemplate;
        oChip = oChipInstance.getChip();
      } else {
        oChip = vTemplate;
      }
      if (oChip.getRemoteCatalog()) {
        oPbs.createPageChipInstanceFromRawData({
          pageId: oAlterEgo.id,
          chipId: oChip.getId(),
          configuration: (oChipInstance && oChipInstance.getConfiguration()) || "",
          // layoutData will not be copied, it is up to the page builder to update that value
          title: oChipInstance && oChipInstance.getTitle(),
          remoteCatalogId: oChip.getRemoteCatalog().getId()
        }, update, fnFailure);
      } else {
        oPbs.createPageChipInstance(oAlterEgo.id, /*sInstanceId*/null, oChip.getId(),
            oChipInstance && oChipInstance.getTitle(),
            (oChipInstance && oChipInstance.getConfiguration()) || "",
            // layoutData will not be copied, it is up to the page builder to update that value
            /*sLayoutData*/"",
            update, fnFailure);
      }
    };

    /**
     * Adds a new CHIP instance to this page which refers to the given original CHIP instance and
     * loads the reference completely if and only if the original is not a stub anymore.
     * Can only be called if this page is not a stub anymore.
     * <p>
     * Note: Does not affect this page's layout.
     *
     * @param {sap.ui2.srvc.ChipInstance} oOriginal
     *   the CHIP instance (or stub) to refer to (which MUST know its page)
     * @param {function (sap.ui2.srvc.ChipInstance)} fnSuccess
     *   success handler, taking the newly created reference which knows its page
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   If not given
     *   <code>{@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}</code> is used
     * @since 1.21.1
     *
     * @throws Error if the page is still a stub
     * @see #isStub()
     * @see sap.ui2.srvc.ChipInstance#getPage
     */
    this.addChipInstanceReference = function (oOriginal, fnSuccess, fnFailure) {
      var oPbs = oFactory.getPageBuildingService();

      function update(oRawChipInstance) {
        var oChipInstance = oFactory.createChipInstance(oRawChipInstance,
          oOriginal.isStub() ? null : fnSuccess, fnFailure, that);

        aChipInstances.push(oChipInstance);
        // that.updateScope() is currently not necessary as this is a feature for catalog pages
        // and they are not maintained on scope PERS.
        // Scope changes from CONF -> CUST are not tracked

        if (oOriginal.isStub()) {
          fnSuccess(oChipInstance);
        }
      }

      checkStub();
      oPbs.clonePageChipInstance(oOriginal.getPage().getId(), oOriginal.getId(), this.getId(),
        update, fnFailure);
    };

    /**
     * Releases all resources associated with this page. Call this method
     * just before you stop using it.
     *
     * @since 1.2.0
     */
    this.exit = function () {
      var i, n;

      jQuery.sap.log.debug("Exiting: " + this, null, "sap.ui2.srvc.Page");
      // exit children
      for (i = 0, n = aChipInstances.length; i < n; i += 1) {
        aChipInstances[i].exit();
      }
      // reset to initial state
      oAlterEgo = null; // page's representation with all relations removed
      mBags = new sap.ui2.srvc.Map(); // all bags removed
      oCatalog = null; // created on demand
      aChipInstances = []; // {sap.ui2.srvc.ChipInstance[]}
      bIsStub = true;
      jQuery.sap.log.debug("Exited: " + this, null, "sap.ui2.srvc.Page");
    };

    /**
     * Returns this page's collection of all catalogs, which might still be a stub.
     * <p>
     * <b>Note:</b> Returns <code>undefined</code> in case the JavaScript file for
     * <code>sap.ui2.srvc.AllCatalogs</code> has not been included!
     *
     * @returns {sap.ui2.srvc.AllCatalogs}
     *   this page's collection of all catalogs
     * @since 1.7.0
     */
    this.getAllCatalogs = function () {
      if (!oAllCatalogs) {
        try {
          fnRequire("sap.ui2.srvc.allcatalogs");
        } catch (e) {
          //TODO this adds one 404 request?!
          // old application without registerModulePath and without allcatalogs.js
        }
        if (sap.ui2.srvc.AllCatalogs) {
          oAllCatalogs = new sap.ui2.srvc.AllCatalogs(oFactory, sId);
        } else {
          jQuery.sap.log.warning("sap.ui2.srvc.AllCatalogs is not available", null,
            "sap.ui2.srvc.Page");
        }
      }
      return oAllCatalogs;
    };

    /**
     * Returns an array of bag IDs attached to this page.
     *
     * @returns {string[]}
     *   array of bag IDs
     * @since 1.3.0
     */
    this.getBagIds = function () {
      if (bIsLoadingBagsOnDemand) {
        throw new sap.ui2.srvc.Error(that + ": page is just a stub, load bags on demand",
          "sap.ui2.srvc.Page");
      }
      return mBags.keys();
    };

    /**
     * Returns the property bag with given ID attached to this page.
     * <p>
     * If there is no bag with that ID an empty bag is returned.
     *
     * @param {string} sBagId
     *   the bag ID
     *
     * @returns {sap.ui2.srvc.Bag}
     *   the page's bag for given ID
     * @since 1.3.0
     */
    this.getBag = function (sBagId) {
      var oBag;

      if (bIsLoadingBagsOnDemand) {
        throw new sap.ui2.srvc.Error(that + ": page is just a stub, load bags on demand",
          "sap.ui2.srvc.Page");
      }

      if (!sBagId) {
        throw new sap.ui2.srvc.Error("Missing bag ID", "sap.ui2.srvc.Page");
      }

      if (mBags.containsKey(sBagId)) {
        return mBags.get(sBagId);
      }

      fnRequire("sap.ui2.srvc.bag");
      oBag = new sap.ui2.srvc.Bag(oFactory, {pageId: this.getId(), id: sBagId, $tmp: true});
      mBags.put(sBagId, oBag);
      return oBag;
    };

    /**
     * Asynchronously get the property bag with given ID attached to this page. If that bag has not
     * yet been loaded the bag is loaded first.
     * <p>
     * The <code>done</code> function will be called with a <code>sap.ui2.srvc.Bag</code> instance.
     * If there was no such bag an empty <code>sap.ui2.srvc.Bag</code> is passed.
     *
     * @param {string} sBagId
     *   the bag ID
     *
     * @returns {object}
     *  jQuery.promise object
     * @since 1.11.0
     */
    this.loadBag = function (sBagId) {
      var oDeferred;

      if (!sBagId) {
        throw new sap.ui2.srvc.Error("Missing bag ID", "sap.ui2.srvc.Page");
      }

      if (mBags.containsKey(sBagId)) {
        oDeferred = mBags.get(sBagId);
      } else {
        fnRequire("sap.ui2.srvc.bag");
        oDeferred = new jQuery.Deferred();
        mBags.put(sBagId, oDeferred);
        oFactory.getPageBuildingService().readBag(sId, sBagId, function (oRawBag) {
          oDeferred.resolve(new sap.ui2.srvc.Bag(oFactory, oRawBag));
        }, function () {
          oDeferred.resolve(new sap.ui2.srvc.Bag(oFactory, {pageId: sId, id: sBagId, $tmp: true}));
        });
      }
      return oDeferred.promise();
    };

    /**
     * Returns this page's catalog, which might still be a stub.  Can only be called if the page
     * itself is not a stub anymore.
     *
     * @returns {sap.ui2.srvc.Catalog}
     *   this page's catalog or <code>undefined</code> if the page has no catalog
     * @since 1.2.0
     *
     * @throws Error if the page is still a stub
     * @see #isStub()
     */
    this.getCatalog = function () {
      checkStub();
      if (!oCatalog && oAlterEgo.catalogId) {
        oCatalog = oFactory.createCatalog(oAlterEgo.catalogId);
      }
      return oCatalog;
    };

    /**
     * Returns this page's CHIP instances. Can only be called if the page is not a stub anymore.
     *
     * @returns {sap.ui2.srvc.ChipInstance[]}
     *   this page's CHIP instances
     * @since 1.2.0
     *
     * @throws Error if the page is still a stub
     * @see #isStub()
     */
    this.getChipInstances = function () {
      checkStub();
      return aChipInstances.slice();
    };

    /**
     * Returns this page's ID.
     *
     * @returns {string}
     *   this page's ID
     * @since 1.2.0
     */
    this.getId = function () {
      return sId;
    };

    /**
     * Returns the layout for this page. Can only be called if the page is not a stub anymore.
     *
     * @returns {string}
     *   the layout for this page
     * @since 1.2.0
     *
     * @throws Error if the page is still a stub
     * @see #isStub()
     */
    this.getLayout = function () {
      checkStub();
      return oAlterEgo.layout;
    };

    /**
     * Sets the layout (encoded as a string, for example in JSON) for this page and persists it.
     * Can only be called if the page is not a stub anymore.
     *
     * @param {string} sLayout
     *   the new layout
     * @param {function ()} fnSuccess
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
     * @throws Error if the page is still a stub
     * @see #isStub()
     */
    this.setLayout = function (sLayout, fnSuccess, fnFailure) {
      checkStub();
      if (oAlterEgo.layout === sLayout) {
        if (fnSuccess) {
          fnFailure = fnFailure || oFactory.getPageBuildingService().getDefaultErrorHandler();
          sap.ui2.srvc.call(fnSuccess, fnFailure, true);
        }
        return;
      }
      oAlterEgo.layout = sLayout;
      persist(fnSuccess, fnFailure);
    };

    /**
     * Returns this page's original language (in which the page has been created) as BCP-47.
     * If you are logged on in the same language or if the original language is empty, translatable
     * texts can be created and modified on this page and its bags. The same is valid for the
     * page's CHIP instances and their bags. See {@link sap.ui2.srvc.Bag#setText}.
     * <p>
     * Note: Handling of translatable texts depends on the layer used. In some layers the original
     * language is important; in others it does not matter. In the latter case the empty string
     * (<code>""</code>) is returned, which indicates that the user is allowed to edit the
     * translatable texts in any language.
     * <p>
     * The following code is a flexible way of checking the current situation without knowing the
     * current language or layer:
     * <pre>
     *  if (oPage.getOriginalLanguage() === "" ||
     *      oPage.getOriginalLanguage() === sap.ui.getCore().getConfiguration().getLanguage()) {
     *    // create and modify the page's texts
     *  }
     * </pre>
     * <p>
     * This method is intended to be only called in a design time use case.
     * Can only be called if the page is not a stub anymore.
     *
     * @returns {string}
     *   this page's original language (BCP-47) or <code>""</code>
     * @since 1.17.1
     *
     * @throws Error if the page is still a stub
     * @see #isStub()
     */
    this.getOriginalLanguage = function () {
      checkStub();
      return oAlterEgo.originalLanguage;
    };

    /**
     * Returns this page's scope. This method is intended to be only called on catalog pages (see
     * {@link sap.ui2.srvc.Catalog#getCatalogPage}), so only in a design time use case.
     * If you want to check if the page has been personalized (so in a runtime use case) you should
     * rather use {@link #isPersonalized}.
     * Can only be called if the page is not a stub anymore.
     *
     * @returns {string}
     *   returns "PERSONALIZATION", "CUSTOMIZATION" or "CONFIGURATION".
     * @since 1.34.0
     *
     * @throws Error if the page is still a stub
     * @see #isStub()
     * @see #isPersonalized()
     */
    this.getScope = function () {
      checkStub();
      return oAlterEgo.scope;
    };

    /**
     * Returns this page's title. Can only be called if the page is not a stub anymore.
     *
     * @returns {string}
     *   this page's title
     * @since 1.2.0
     *
     * @throws Error if the page is still a stub
     * @see #isStub()
     */
    this.getTitle = function () {
      checkStub();
      return oAlterEgo.title;
    };

    /**
     * Sets the title for this page and persists it. Can only be called if the page is not a stub
     * anymore.
     *
     * @param {string} sTitle
     *   the new title
     * @param {function ()} fnSuccess
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
     * @throws Error if the page is still a stub
     * @see #getOriginalLanguage()
     * @see #isStub()
     */
    this.setTitle = function (sTitle, fnSuccess, fnFailure) {
      checkStub();
      if (oAlterEgo.title === sTitle) {
        if (fnSuccess) {
          fnFailure = fnFailure || oFactory.getPageBuildingService().getDefaultErrorHandler();
          sap.ui2.srvc.call(fnSuccess, fnFailure, true);
        }
        return;
      }
      oAlterEgo.title = sTitle;
      persist(fnSuccess, fnFailure);
    };

    /**
     * Tells whether this page is a catalog page (see {@link sap.ui2.srvc.Catalog#getCatalogPage}
     * and {@link sap.ui2.srvc.Factory#createNewPageBasedCatalog}).
     * This method is intended to be only called in a design time use case.
     * Can only be called if the page is not a stub anymore (see {@link #isStub}).
     *
     * @returns {boolean}
     *   whether this page is a catalog page
     * @since 1.19.1

     * @throws Error if the page is still a stub
     * @see #isStub()
     */
    this.isCatalogPage = function () {
      checkStub();
      return oAlterEgo.isCatalogPage === "X";
    };

    /**
     * Tells whether this page can be altered on Personalization scope or not. Can only be called
     * if the page is not a stub anymore.
     *
     * @returns {boolean}
     *   true if this page is locked and false if not
     * @since 1.25.0
     *
     * @throws Error if the page is still a stub
     * @see #isStub()
     */
    this.isPersonalizationLocked = function () {
      checkStub();
      return oAlterEgo.isPersLocked === "X";
    };

    /**
     * Determines and persists the locking status of a page which determines if
     * a page can be altered on Personalization scope or not.
     * This method is intended to be only called in a design time use case.
     * Can only be called if the page is not a stub anymore.
     *
     * @param {boolean} bIsPersLocked
     *   Desired locking status
     * @param {function ()} fnSuccess
     *   no-args success handler
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   If not given
     *   <code>{@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}</code> is used
     * @since 1.25.0
     *
     * @throws Error if the page is still a stub
     * @see #isStub()
     */
    this.setPersonalizationLocked = function (bIsPersLocked, fnSuccess, fnFailure) {
      checkStub();

      if (oFactory.getPageBuildingService().isPersonalization()) {
        throw new sap.ui2.srvc.Error(
          "Personalization locking cannot be changed at personalization scope",
          "sap.ui2.srvc.Page"
        );
      }

      if ((oAlterEgo.isPersLocked === "X" && bIsPersLocked)
              || (oAlterEgo.isPersLocked !== "X" && !bIsPersLocked)) {
        if (fnSuccess) {
          fnFailure = fnFailure || oFactory.getPageBuildingService().getDefaultErrorHandler();
          sap.ui2.srvc.call(fnSuccess, fnFailure, true);
        }
        return;
      }

      oAlterEgo.isPersLocked = bIsPersLocked ? "X" : " ";

      persist(fnSuccess, fnFailure);
    };

    /**
     * Tells whether this page is marked as outdated.
     * This method is intended to be only called in a design time use case.
     * Can only be called if the page is not a stub anymore.
     *
     * @returns {boolean}
     *   whether this page is marked as outdated
     * @since 1.7.0
     *
     * @throws Error if the page is still a stub
     * @see #isStub()
     */
    this.isOutdated = function () {
      checkStub();
      return oAlterEgo.outdated === "X";
    };

    /**
     * Tells whether this page is read-only. Can only be called if the page is not a stub anymore.
     *
     * @returns {boolean}
     *   true if this page is read-only
     * @since 1.32.0
     *
     * @throws Error if the page is still a stub
     * @see #isStub()
     */
    this.isReadOnly = function () {
      checkStub();
      return oAlterEgo.isReadOnly === "X";
    };

    /**
     * Tells whether this page was originally read from 'PERSONALIZATION' scope or was modified in
     * a way that had copied the page to that scope. Such modifications include changes of layout
     * data and changes to CHIP instances, but not to property bags.
     * This method is intended to be only called in a runtime use case.
     * Can only be called if the page is not a stub anymore.
     *
     * @returns {boolean}
     *   whether this page is personalized
     * @since 1.16.1
     *
     * @throws Error if the page is still a stub
     * @see #isStub()
     * @see #addChipInstance()
     * @see #removeChipInstance()
     * @see #setLayout()
     * @see #setTitle()
     */
    this.isPersonalized = function () {
      checkStub();
      return oAlterEgo.scope === "PERSONALIZATION";
    };

    /**
     * Tells whether this page is still only a stub and does not yet know its properties or related
     * objects, for example layout, title, catalog, or CHIP instances.
     *
     * @returns {boolean}
     *   whether this page is still only a stub
     * @since 1.2.0
     *
     * @see #load()
     */
    this.isStub = function () {
      return bIsStub;
    };

    /**
     * Loads the current page including its layout, title, (stub) catalog, and CHIP instances (see
     * <code>bPartially</code> parameter). Notifies one of the given handlers. All CHIP instances
     * know their page, see {@link sap.ui2.srvc.ChipInstance#getPage}.
     * <p>
     * Note: Preferably, CHIP instances should be loaded individually as needed (e.g. as they
     * become visible).
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
     * @param {boolean} [bPartially=false]
     *   whether to load the page only partially (instead of completely, including its CHIP
     *   instances)
     * @since 1.2.0
     */
    this.load = function (fnSuccess, fnFailure, bPartially) {
      var iAsyncCount;

      if (!bIsStub) {
        throw new sap.ui2.srvc.Error("Page is not a stub anymore", "sap.ui2.srvc.Page");
      }

      function checkDone() {
        if (iAsyncCount === 0) {
          // all async operations done, call success handler
          jQuery.sap.log.debug("Initialized: " + that, null, "sap.ui2.srvc.Page");
          fnSuccess();
        }
      }

      function onLoad() {
        iAsyncCount -= 1;
        checkDone();
      }

      oFactory.getPageBuildingService().readPage(sId,
        function (oNewAlterEgo) {
          var i,
            aRawChipInstances
              = (oNewAlterEgo.PageChipInstances && oNewAlterEgo.PageChipInstances.results) || [],
            iChipInstanceCount = aRawChipInstances.length;

          jQuery.sap.log.debug("Loaded: " + that, null, "sap.ui2.srvc.Page");
          initialize(oNewAlterEgo);

          iAsyncCount = bPartially ? 0 : iChipInstanceCount;
          if (!bPartially) {
            for (i = 0; i < iChipInstanceCount; i += 1) {
              aChipInstances[i].load(onLoad, fnFailure);
            }
          }
          checkDone();
        }, fnFailure);
    };

    /**
     * Removes (in other words, deletes) this page from the page building service.
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
     * @since 1.2.0
     */
    this.remove = function (fnSuccess, fnFailure) {
      this.exit();
      oFactory.getPageBuildingService().deletePage(sId, fnSuccess, fnFailure);
    };

    /**
     * Removes the given page CHIP instance from this page's collection of CHIP instances, calls
     * the instance's <code>remove()</code> method and returns <code>true</code>.
     * If the given page CHIP instance does not belong to this page (any more), <code>false</code>
     * is returned and nothing else happens.
     * Can only be called if the page is not a stub anymore.
     *
     * @param {sap.ui2.srvc.ChipInstance} oChipInstance
     *   the CHIP instance to remove from this page
     * @param {function ()} [fnSuccess]
     *   no-args success handler
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   If not given
     *   <code>{@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}</code> is used
     * @returns {boolean}
     *   <code>true</code> iff. the given CHIP instance's <code>remove()</code> method has been
     *   called
     * @since 1.9.0
     *
     * @throws Error if the page is still a stub
     * @see #isStub()
     * @see sap.ui2.srvc.ChipInstance#getPage
     * @see sap.ui2.srvc.ChipInstance#remove
     */
    this.removeChipInstance = function (oChipInstance, fnSuccess, fnFailure) {
      var i = aChipInstances.indexOf(oChipInstance);

      checkStub();
      if (i >= 0) {
        // remove to avoid endless loops
        aChipInstances.splice(i, 1);

        oChipInstance.remove(function () {
          that.updateScope();
          if (fnSuccess) {
            fnSuccess.apply(this, arguments);
          }
        }, function () {
          // reinsert CHIP instance because backend call failed
          aChipInstances.splice(i, 0, oChipInstance);
          fnFailure = fnFailure || oFactory.getPageBuildingService().getDefaultErrorHandler();
          fnFailure.apply(this, arguments);
        });

        return true;
      }

      return false;
    };

    /**
     * Returns this page's string representation.
     *
     * @param {boolean} [bVerbose=false]
     *   flag whether to show all properties
     * @returns {string}
     *   this page's string representation
     * @since 1.2.0
     */
    this.toString = function (bVerbose) {
      var aResult = ['sap.ui2.srvc.Page({sId:"', sId, '",bIsStub:', bIsStub,
        ',bIsLoadingBagsOnDemand:', bIsLoadingBagsOnDemand];
      if (bVerbose) {
        aResult.push(',oAlterEgo:', JSON.stringify(oAlterEgo),
            ',oCatalog:', oCatalog ? oCatalog.toString(bVerbose) : oCatalog,
            ',oFactory:', oFactory.toString(bVerbose),
            ',aChipInstances:', JSON.stringify(aChipInstances)
          );
      }
      aResult.push('})');
      return aResult.join('');
    };

    /**
     * Changes to pages on CUSTOMIZING or CONFIGURATION scope will create a page copy on scope
     * PERSONALIZATION automatically in the backend; thus we update the scope accordingly.
     * Note: Can also be called by CHIP instances in case they are modified.
     *
     * @since 1.16.1
     * @private
     * @see #isPersonalized
     */
    this.updateScope = function () {
      if (oFactory.getPageBuildingService().isPersonalization()) {
        oAlterEgo.scope = "PERSONALIZATION";
      }
    };


    // constructor code -------------------------------------------------------
    if (!sap.ui2.srvc.Map) {
      fnRequire("sap.ui2.srvc.utils");
    }
    if (typeof vPageData === 'object') {
      // direct creation
      sId = vPageData.id;
      initialize(vPageData);
    } else if (typeof vPageData === 'string') {
      sId = vPageData;
    }
    if (!sId) {
      throw new sap.ui2.srvc.Error("Missing ID", "sap.ui2.srvc.Page");
    }
    mBags = new sap.ui2.srvc.Map();
    jQuery.sap.log.debug("Created: " + this, null, "sap.ui2.srvc.Page");
  };
}());
