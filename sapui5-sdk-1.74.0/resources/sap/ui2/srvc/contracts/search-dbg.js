// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/**
 * @fileOverview The <code>search</code> contract.
 */
(function () {
  "use strict";
  /*global jQuery, sap */

  // Note: jQuery might not yet be available!
  if (typeof jQuery === "function" && jQuery.sap) {
    jQuery.sap.declare("sap.ui2.srvc.contracts.search");
    jQuery.sap.require("sap.ui2.srvc.chip");
  }

  /**
   * @namespace The namespace for the CHIP API's <code>search</code> contract with
   * CHIP search-related functionality. With this contract, the CHIP can provide CHIP-specific
   * search keywords. In addition, it can highlight words from the search in its UI.
   * @name chip.search
   * @since 1.11.0
   */

  sap.ui2.srvc.Chip.addContract("search", function (oChipInstance) {
    var fnHighlight,
      aKeywords;

    /**
     * Determines specific keywords with which the CHIP wants to be found in a search over all
     * CHIPs from the page builder. If not set, the page builder executing a CHIP search can only
     * search based on CHIP metadata like the CHIP title.
     *
     * @name chip.search.setKeywords
     * @function
     * @since 1.11.0
     * @param {string[]} aNewKeywords
     *   the keywords of this CHIP
     */
    this.setKeywords = function (aNewKeywords) {
      if (!sap.ui2.srvc.isArray(aNewKeywords)) {
        throw new sap.ui2.srvc.Error("Not an array: " + aNewKeywords, "chip.search");
      }
      aKeywords = aNewKeywords.slice();
    };

    /**
     * Attaches the given event handler to the "highlight" event which is fired whenever the user
     * executes a search over all CHIPs using specific search terms. The event handler takes a
     * string array as parameter, containing the highlight words. These are derived from the
     * search terms. The CHIP can then highlight these in its UI.
     *
     * @name chip.search.attachHighlight
     * @function
     * @since 1.11.0
     * @param {function (string[])} fnEventHandler
     *   event handler for highlighting words in the CHIP UI which takes a string array with the
     *   highlight words as parameter
     */
    this.attachHighlight = function (fnEventHandler) {
      if (typeof fnEventHandler !== "function") {
        throw new sap.ui2.srvc.Error("Not a function: " + fnEventHandler,
          "chip.search");
      }
      fnHighlight = fnEventHandler;
    };

    /**
     * @namespace The namespace for the contract interface (to be used by a page builder) for
     * the <code>search</code> contract. This contract interface allows the pagebuilder to get
     * the CHIP-specific search keywords. In addition, it can have the CHIP highlight words
     * in its UI based on the search terms used.
     * @name contract.search
     * @since 1.11.0
     */
    return {
      /**
       * Returns the CHIP-specific search keywords.
       *
       * @name contract.search.getKeywords
       * @function
       * @since 1.11.0
       * @returns {string[]}
       *   CHIP-specific search keywords. Empty array if the CHIP has not set any keywords.
       *
       * @see chip.search.setKeywords
       */
      getKeywords: function () {
        return aKeywords ? aKeywords.slice() : [];
      },

      /**
       * Fires the "highlight" event which takes a string array with the words to
       * be highlighted as parameters.
       *
       * @name contract.search.fireHighlight
       * @function
       * @since 1.11.0
       * @param {string[]} aHighlightWords
       *   words to be highlighted
       *
       * @see chip.search.attachHighlight
       */
      fireHighlight: function (aHighlightWords) {
        if (fnHighlight) {
          fnHighlight(aHighlightWords);
        }
      }
    };
  });
}());