/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"./threejs/thirdparty/three",
	"./threejs/ThreeExtensions"
], function(threeJs, threeExtensions) {
	"use strict";

	/**
	 * Node utilities library.
	 *
	 * @private
	 * @author SAP SE
	 * @version 1.74.0
	 * @alias sap.ui.vk.NodeUtils
	 * @since 1.74
	 * @experimental Since 1.74 This class is experimental and might be modified or removed in future versions.
	 */
	var NodeUtils = {
		/**
		 * Calculates the geometrical center of nodes.
		 *
		 * @param {any[]} nodeRefs                 The array of node references.
		 * @param {sap.ui.vk.ViewStateManager} vsm The view state manager.
		 * @returns {float[]} The geometrical center of nodes.
		 * @public
		 * @static
		 */
		centerOfNodes: function(nodeRefs, vsm) {
			var boundingBox = new THREE.Box3();
			nodeRefs.forEach(function(nodeRef) {
				nodeRef._expandBoundingBox(boundingBox, null, true);
			});
			var center = new THREE.Vector3();
			boundingBox.getCenter(center);
			return center.toArray();
		}
	};

	return NodeUtils;
});
