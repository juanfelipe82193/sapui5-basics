/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([], function() {
  "use strict";
  /**
	 * Base Delegate for {@link sap.ui.mdc.Link}. Extend this object in your project to use all functionalites of the {@link sap.ui.mdc.Link}.
	 * <b>Note:</b>
	 * The class is experimental and the API/behaviour is not finalized and hence this should not be used for productive usage.
	 * @author SAP SE
	 * @private
	 * @experimental
	 * @since 1.74
	 * @alias sap.ui.mdc.LinkDelegate
	 */
  var LinkDelegate = {
    /**
     * Fetches the relevant {@link sap.ui.mdc.link.LinkItem} for the Link and returns them.
     * @public
     * @returns {Promise} once resolved an array of {@link sap.ui.mdc.link.LinkItem} is returned
     */
    fetchLinkItems: function() {
      return Promise.resolve([]);
    },
    /**
     * Fetches the relevant additionalContent for the Link and retuns it as an array.
     * @public
     * @returns {Promise} once resolved an array of {@link sap.ui.core.Control} is returned
     */
    fetchAdditionalContent: function() {
      return Promise.resolve([]);
    }
  };
  return LinkDelegate;
}, /* bExport= */ true);