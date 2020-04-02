// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview A wrapper for a page set loaded from the page building service.
 */

this.sap = this.sap || {};

(function () {
  "use strict";
  /*global jQuery, sap */

  // namespace "sap.ui2.srvc" **************************************************
  sap.ui2 = sap.ui2 || {};
  sap.ui2.srvc = sap.ui2.srvc || {};

  var O_PAGE_TYPES = {
      // don't start with 0 because it is falsy
      assigned: 1, // contained in AssignedPages and scope is not PERSONALIZATION
      userCreated: 2, // not contained in AssignedPages or DefaultPage
      personalized: 3, // contained in AssignedPages and scope is PERSONALIZATION
      defaultPage: 4 // assigned as DefaultPage
    };

  jQuery.sap.declare("sap.ui2.srvc.pageset");
  // we cannot call jQuery.sap.require here because of our qunit.html environment

  // "public class" ************************************************************

  /**
   * Constructs for the given ID a new representation (wrapper) of the page set with associated
   * pages (see {@link sap.ui2.srvc.Page}).
   * A page set is a mutable object and changes can be persisted by the page building service (see
   * {@link sap.ui2.srvc.PageBuildingService}).
   *
   * @param {sap.ui2.srvc.Factory} oFactory
   *  the factory
   * @param {string} sPageSetId
   *   the page set's ID
   * @class
   * @since 1.11.0
   * @private
   */
  sap.ui2.srvc.PageSet = function (oFactory, sPageSetId) {
    var sId, // the page set ID
      oAlterEgo, // page set's representation with all relations removed
      oDefaultPage,
      aPages = [], // {sap.ui2.srvc.Page[]}
      oPageTypes, // {sap.ui2.srvc.Map}
      bIsStub = true,
      that = this;

    /**
     * Makes sure the given page set is not just a stub.
     *
     * @private
     */
    function checkStub () {
      if (bIsStub) {
        throw new sap.ui2.srvc.Error(that + ": page set is just a stub", "sap.ui2.srvc.PageSet");
      }
    }

    /**
     * Returns the type of the given page.
     *
     * @param {sap.ui2.srvc.Page} oPage
     *   any page of this page set
     * @returns {int}
     *   the page type as defined privately
     * @private
     */
    sap.ui2.srvc.testPublishAt(that);
    function getPageType (oPage) {
      var sId = oPage.getId(),
        iPageType;

      checkStub();
      if (!oPageTypes.containsKey(sId)) {
        throw new sap.ui2.srvc.Error("Unknown page " + sId, "sap.ui2.srvc.PageSet");
      }

      iPageType = oPageTypes.get(sId);
      if (iPageType === O_PAGE_TYPES.assigned && oPage.isPersonalized()) {
        iPageType = O_PAGE_TYPES.personalized;
      }
      return iPageType;
    }

    /**
     * Initializes the page set when the alter ego is known
     * @param {object} oNewAlterEgo
     *  JSON representation of the page set (as received from the OData service)
     * @private
     */
    function initialize (oNewAlterEgo) {
      var sDefaultPageId = oNewAlterEgo.DefaultPage.id,
        aRawAssignedPages = (oNewAlterEgo.AssignedPages && oNewAlterEgo.AssignedPages.results)
          || [];

      oAlterEgo = oNewAlterEgo;

      // initialize type for assigned pages
      oPageTypes = new sap.ui2.srvc.Map();
      aRawAssignedPages.forEach(function (oRawAssignedPage) {
        // assume only ID is present
        oPageTypes.put(oRawAssignedPage.id, O_PAGE_TYPES.assigned);
      });

      // initialize already loaded pages
      oAlterEgo.Pages.results.forEach(function (oRawPage) {
        var oPage = new sap.ui2.srvc.Page(oFactory, oRawPage), //TODO oFactory.createPage()
          sPageId = oPage.getId();

        aPages.push(oPage);

        if (sDefaultPageId === sPageId) {
          oDefaultPage = oPage;
          oPageTypes.put(sPageId, O_PAGE_TYPES.defaultPage);
        } else if (!oPageTypes.containsKey(sPageId)) { // not AssignedPage
          oPageTypes.put(sPageId, O_PAGE_TYPES.userCreated);
        }
      });

      // remove relations
      delete oAlterEgo.AssignedPages;
      delete oAlterEgo.DefaultPage;
      delete oAlterEgo.Pages;

      bIsStub = false;
      jQuery.sap.log.debug("Initialized: " + that, null, "sap.ui2.srvc.PageSet");
    }

    /**
     * Appends a new page with given title to this page set.
     *
     * @param {string} [sPageTitle]
     *   title for the new page
     * @param {string} sCatalogId
     *   id of the default catalog of the new page
     * @param {function (sap.ui2.srvc.Page)} fnSuccess
     *   success handler taking new page that has been appended to this page set
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   If not given
     *   <code>{@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}</code> is used
     * @since 1.11.0
     */
    this.appendPage = function (sPageTitle, sCatalogId, fnSuccess, fnFailure) {
      checkStub();
      if (typeof fnSuccess !== "function") {
        throw new sap.ui2.srvc.Error("Missing success handler", "sap.ui2.srvc.PageSet");
      }

      oFactory.getPageBuildingService().createPageInPageSet(sId, sPageTitle, sCatalogId,
        function (oNewRawPage) {
          var oNewPage = new sap.ui2.srvc.Page(oFactory, oNewRawPage); //TODO oFactory.createPage()
          aPages.push(oNewPage);
          // all new pages are user created:
          oPageTypes.put(oNewPage.getId(), O_PAGE_TYPES.userCreated);
          jQuery.sap.log.debug("Appended new page with ID " + oNewPage.getId() + " to pageset "
            + that, null, "sap.ui2.srvc.PageSet");

          fnSuccess(oNewPage);
        }, fnFailure);
    };

    /**
     * Returns true if oPage can entirely be deleted (without a page shining through afterwards).
     * See also <code>isPageResettable</code>.
     *
     *@param {sap.ui2.srvc.Page} oPage
     *   the page to be checked
     * @returns {boolean}
     *   true if page can be removed
     * @since 1.11.0
     *
     * @see #isPageResettable
     * @see #removePage
     */
    this.isPageRemovable = function (oPage) {
      return getPageType(oPage) === O_PAGE_TYPES.userCreated;
    };

    /**
     * Returns true if a delete on oPage only has effect like a reset (with a page shining
     * through afterwards). However, check also method <code>isPageRemovable</code>.
     *
     *@param {sap.ui2.srvc.Page} oPage
     *   the page to be checked
     * @returns {boolean}
     *   true if page can be reset
     * @since 1.11.0
     *
     * @see #isPageRemovable
     * @see #removePage
     */
    this.isPageResettable = function (oPage) {
      return getPageType(oPage) === O_PAGE_TYPES.personalized;
    };

    /**
     * Remove given page from this page set; fails if the page is not removable.
     *
     * @param {sap.ui2.srvc.Page} oPage
     *   the page to be removed
     * @param {function ()} [fnSuccess]
     *   no-args success handler
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   If not given
     *   <code>{@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}</code> is used
     * @see #isPageRemovable
     * @since 1.11.0
     */
    this.removePage = function (oPage, fnSuccess, fnFailure) {
      if (!this.isPageRemovable(oPage)) {
        throw new sap.ui2.srvc.Error("Cannot remove page " + oPage.getId(),
          "sap.ui2.srvc.PageSet");
      }

      oPage.remove(function () {
        aPages.splice(aPages.indexOf(oPage), 1);
        oPageTypes.remove(oPage.getId());
        if (fnSuccess) {
          fnSuccess();
        }
      }, fnFailure);
    };

    /**
     * Reset given page from this page set; fails if the page is not resettable.
     *
     * @param {sap.ui2.srvc.Page} oPage
     *   the page to be reset
     * @param {function ()} [fnSuccess]
     *   no-args success handler
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   If not given
     *   <code>{@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}</code> is used
     * @see #isPageResettable
     * @since 1.16.1
     */
    this.resetPage = function (oPage, fnSuccess, fnFailure) {
      if (!this.isPageResettable(oPage)) {
        throw new sap.ui2.srvc.Error("Cannot reset page " + oPage.getId(),
          "sap.ui2.srvc.PageSet");
      }

      // remove page copy from PERSONALIZATION scope
      oPage.remove(function () {
        // reload page from underlying scope
        oPage.load(fnSuccess, fnFailure, /*bPartially*/true);
      }, fnFailure);
    };

    /**
     * Removes all pages from pageset which does not match given page ID or catalog ID.
     * If the pageset is not loaded an error is thrown.
     *
     * @param {string[]} aPageIds
     *   array of valid page IDs
     * @param {string[]} aCatalogIds
     *   array of valid catalog IDs
     * @since 1.16.2
     *
     * @see #isStub()
     * @private
     */
    this.filter = function (aPageIds, aCatalogIds) {
      var i,
        aResult = [],
        oCurrentPage;

      checkStub();
      aPageIds = aPageIds || [];
      aCatalogIds = aCatalogIds || [];

      for (i = 0; i < aPages.length; i += 1) {
        oCurrentPage = aPages[i];
        if (aPageIds.indexOf(oCurrentPage.getId()) !== -1) {
          aResult.push(oCurrentPage);
        } else if (oCurrentPage.getCatalog()
            && aCatalogIds.indexOf(oCurrentPage.getCatalog().getId()) !== -1) {
          aResult.push(oCurrentPage);
        }
      }
      aPages = aResult;
    };

    /**
     * Returns this page set's configuration.
     *
     * @returns {string}
     *   this page set's configuration
     * @since 1.11.0
     *
     * @see #isStub()
     */
    this.getConfiguration = function () {
      checkStub();
      return oAlterEgo.configuration;
    };

    /**
     * Sets this page set's configuration.
     *
     * @param {string} sConfiguration
     *   new configuration string for this page set
     * @param {function ()} fnSuccess
     *   no-args success handler
     * @param {function (string, [object])} [fnFailure]
     *   error handler taking an error message and, since version 1.28.6, an
     *   optional object containing the complete error information as delivered
     *   by the ODataService. See fnFailure parameter of {@link sap.ui2.srvc.ODataWrapper#onError}
     *   for more details.
     *   If not given
     *   <code>{@link sap.ui2.srvc.ODataService#getDefaultErrorHandler}</code> is used
     * @since 1.11.0
     *
     * @see #isStub()
     */
    this.setConfiguration = function (sConfiguration, fnSuccess, fnFailure) {
      checkStub();
      if (typeof fnSuccess !== "function") {
        throw new sap.ui2.srvc.Error("Missing success handler", "sap.ui2.srvc.PageSet");
      }

      if (oAlterEgo.configuration === sConfiguration) {
        // no change: call success handler async
        sap.ui2.srvc.call(fnSuccess, fnFailure, true);
        return;
      }

      oAlterEgo.configuration = sConfiguration;
      oFactory.getPageBuildingService().updatePageSet(oAlterEgo, function (oNewAlterEgo) {
        fnSuccess();
      }, fnFailure);
    };

    /**
     * Returns this page set's default page. Can only be called if the page set is not a stub
     * anymore.
     *
     * @returns {sap.ui2.srvc.Page}
     *   this page set's default page
     * @since 1.11.0
     *
     * @see #isStub()
     */
    this.getDefaultPage = function () {
      checkStub();
      return oDefaultPage;
    };

    /**
     * Returns this page set's ID.
     *
     * @returns {string}
     *   this page set's ID
     * @since 1.11.0
     */
    this.getId = function () {
      return sId;
    };

    /**
     * Returns this page set's pages. Can only be called if the page set is not a stub anymore.
     *
     * @returns {sap.ui2.srvc.Page[]}
     *   this page set's pages
     * @since 1.11.0
     *
     * @see #isStub()
     */
    this.getPages = function () {
      checkStub();
      return aPages.slice();
    };

    /**
     * Tells whether this page set is still only a stub and does not yet know its properties or
     * related objects, for example pages.
     *
     * @returns {boolean}
     *   whether this page set is still only a stub
     * @since 1.11.0
     *
     * @see #load()
     */
    this.isStub = function () {
      return bIsStub;
    };

    /**
     * Loads the current page set including its configuration, title and pages (aka groups).
     * Property bags of the pages are not loaded. The function <code>loadBag</code> (see
     * {@link sap.ui2.srvc.Page#loadBag}) of the page objects needs to be used to get a property
     * bag.
     * Notifies one of the given handlers.
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
     * @since 1.11.0
     */
    this.load = function (fnSuccess, fnFailure) {
      if (!bIsStub) {
        throw new sap.ui2.srvc.Error("Page set is not a stub anymore", "sap.ui2.srvc.PageSet");
      }

      oFactory.getPageBuildingService().readPageSet(sId,
        function (oNewAlterEgo) {
          jQuery.sap.log.debug("Loaded: " + that, null, "sap.ui2.srvc.PageSet");
          initialize(oNewAlterEgo);

          fnSuccess();
        }, fnFailure, /*bCache*/true);
    };

    /**
     * Returns this page set's string representation.
     *
     * @param {boolean} [bVerbose=false]
     *   flag whether to show all properties
     * @returns {string}
     *   this page set's string representation
     * @since 1.11.0
     */
    this.toString = function (bVerbose) {
      var aResult = ['sap.ui2.srvc.PageSet({sId:"', sId, '",bIsStub:', bIsStub];
      if (bVerbose) {
        aResult.push(',oAlterEgo:', JSON.stringify(oAlterEgo),
          ',oFactory:', oFactory.toString(bVerbose),
          ',aPages:', JSON.stringify(aPages)
          );
      }
      aResult.push('})');
      return aResult.join('');
    };

    // constructor code -------------------------------------------------------
    jQuery.sap.require("sap.ui2.srvc.page");
    jQuery.sap.require("sap.ui2.srvc.utils");
    sId = sPageSetId;
    if (!sId) {
      throw new sap.ui2.srvc.Error("Missing page set ID", "sap.ui2.srvc.PageSet");
    }
    jQuery.sap.log.debug("Created: " + this, null, "sap.ui2.srvc.PageSet");
  };
}());
