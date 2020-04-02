
sap.ui.define([
], function() {
	"use strict";

	/**
	 * Animation track binding types.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.AnimationTrackType
	 * @private
	 */
	var AnimationTrackType = {
		/**
		 * Animation track bound to the node's rotation.
		 * @public
		 */
		Rotate: "rotate",
		/**
		 * Animation track bound to the node's translation.
		 * @public
		 */
		Translate: "translate",
		/**
		 * Animation track bound to the node's scale.
		 * @public
		 */
		Scale: "scale",
		/**
		 * Animation track bound to the node's opacity.
		 * @public
		 */
		Opacity: "opacity",
		/**
		 * Animation track bound to the node's highlight.
		 * @public
		 */
		Color: "color"
	};

	return AnimationTrackType;
});
