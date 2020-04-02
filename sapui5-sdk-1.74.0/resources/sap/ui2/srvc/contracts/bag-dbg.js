// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The <code>bag</code> contract.
 */
(function () {
  "use strict";
  /*global jQuery, sap */

  // Note: jQuery might not yet be available!
  if (typeof jQuery === "function" && jQuery.sap) {
    jQuery.sap.declare("sap.ui2.srvc.contracts.bag");
    jQuery.sap.require("sap.ui2.srvc.chip");
    jQuery.sap.require("sap.ui2.srvc.utils");
  }

  /**
   * @namespace The namespace for the CHIP API's <code>bag</code> contract, which allows you to
   * access property bags attached to a CHIP instance and read or write properties in these bags.
   * @name chip.bag
   * @since 1.5.0
   */

  sap.ui2.srvc.Chip.addContract("bag", function (oChipInstance) {
    var fnBagsUpdatedHandler;
    /**
     * Returns the associated property bag for a given ID. If no bag with the given ID exists, a
     * new, empty bag is created on the fly.
     *
     * @name chip.bag.getBag
     * @function
     * @since 1.5.0
     * @param {string} sBagId
     *   The ID of the bag to be returned
     * @returns {sap.ui2.srvc.Bag}
     *   The associated bag
     */
    this.getBag = function (sBagId) {
      return oChipInstance.getBag(sBagId);
    };

    /**
     * Returns an array of IDs of all associated property bags which currently exist.
     * Note that new bags are created on the fly if you call <code>getBag</code> with any other ID.
     *
     * @name chip.bag.getBagIds
     * @function
     * @since 1.5.0
     * @returns {string[]}
     *   IDs of associated bags
     */
    this.getBagIds = function () {
      return oChipInstance.getBagIds();
    };

    /**
     * Returns this CHIP instance's original language as BCP-47.
     * If you are logged on in the same language or if the original language is empty, translatable
     * texts can be created and modified for this CHIP instance and its bags.
     * See {@link sap.ui2.srvc.Bag#setText}.
     * <p>
     * Note: Handling of translatable texts depends on the layer used. In some layers the original
     * language is important; in others it does not matter. In the latter case the empty string
     * (<code>""</code>) is returned, which indicates that the user is allowed to edit the
     * translatable texts in any language.
     * <p>
     * The following code is a flexible way of checking the current situation without knowing the
     * current language or layer:
     * <pre>
     *  if (oChipInstance.getOriginalLanguage() === "" || oChipInstance.getOriginalLanguage() ===
     *      sap.ui.getCore().getConfiguration().getLanguage()) {
     *    // create and modify the CHIP instance's texts
     *  }
     * </pre>
     * <p>
     *
     * @name chip.bag.getOriginalLanguage
     * @function
     * @returns {string}
     *   this CHIP instance's original language (BCP-47) or <code>""</code>
     * @since 1.17.1
     */
    this.getOriginalLanguage = function () {
      return oChipInstance.getPage() && oChipInstance.getPage().getOriginalLanguage();
    };

    /**
     * Usually the Page Builder does not know about the internals of a CHIP, but there are special
     * CHIPs (e.g. SAP Fiori Launchpad app launcher tiles, also serving as bookmark tiles) the
     * Page Builder knows about the internals. In certain cases the Page Builder changes the bag
     * data of the CHIP and is able to notify the CHIP Instance what bag(s) have been updated,
     * so the CHIP instance can update the view.
     *
     * Note: The event must be explicitly triggered by the Page Builder. There is no automatic mechanism.
     *
     * @name chip.bag.attachBagsUpdated
     * @function
     * @param {function(string[])} fnHandler
     *   Handler which is called if the Page Builder updates one or multiple related bags. The
     *   receives as first parameter an array containing all the IDs of the updated bags
     * @since 1.34.0
     * @private
     * @see contract.bag.fireBagsUpdated
     */
    this.attachBagsUpdated = function (fnHandler) {
      // Back channel for FLP bookmark tiles, as they are managed by the FLP Bookmark Service.
      // The FLP directly changes the bag data of the bookmark tile and can notify the bookmark
      // tiles afterwards about the changes, so the bookmark tiles can update their views with
      // the new bag data
      if (typeof fnHandler !== "function") {
        throw new sap.ui2.srvc.Error("The given handler is not a function", "chip.bag");
      }
      fnBagsUpdatedHandler = fnHandler;
    };

    /**
     * @namespace The namespace for the contract interface (to be used by a page builder) for
     * the <code>bag</code> contract.
     * @name contract.bag
     * @private
     */
    return { // contract - private as only used by Fiori Launchpad
      /**
       * Allows the page builder to inform the CHIP about changes in certain bags.
       * Note: Usually the page builder should not care about the content of the bags; however, for bookmark tiles
       * in the Fiori Launchpad this is required as the Fiori Launchpad manages them.
       *
       * @name contract.bag.fireBagsUpdated
       * @function
       * @param {string[]} aUpdatedBagIds
       *   array of bag IDs which have been updated by the page builder
       * @since 1.34.0
       * @private
       * @see chip.bag.attachBagsUpdated
       */
      fireBagsUpdated : function (aUpdatedBagIds) {
        if (!sap.ui2.srvc.isArray(aUpdatedBagIds) || aUpdatedBagIds.length < 1) {
          throw new sap.ui2.srvc.Error("At least one bag ID must be given", "contract.bag");
        }
        if (fnBagsUpdatedHandler) {
          fnBagsUpdatedHandler(aUpdatedBagIds);
        }
      }
    };
  });
}());
