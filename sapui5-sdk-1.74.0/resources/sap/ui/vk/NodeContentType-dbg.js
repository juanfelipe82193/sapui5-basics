/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides type sap.ui.vk.NodeContentType.
sap.ui.define([], function() {
	"use strict";

	/**
	 * Node content type for {@link sap.ui.vk.NodeHierarchy.createNode}.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.NodeContentType
	 * @private
	 */
	var NodeContentType = {
		/**
		 * Regular node
		 * @public
		 */
		Regular: "Regular",
		/**
		 * Reference node
		 * @public
		 */
		Reference: "Reference"
	};

	return NodeContentType;

}, /* bExport= */ true);
