
sap.ui.define([
], function() {
	"use strict";

	/**
	 * Value type used by keys in the {@link sap.ui.vk.AnimationTrack}.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.AnimationTrackValueType
	 * @private
	 */
	var AnimationTrackValueType = {
		/**
		 * Scalar
		 * @public
		 */
		Scalar: "Scalar",
		/**
		 * Vector3
		 * @public
		 */
		Vector3: "Vector3",
		/**
		 * Axis-Angle
		 * @public
		 */
		AngleAxis: "AngleAxis",
		/**
		 * Quaternion
		 * @public
		 */
		Quaternion: "Quaternion",
		/**
		 * Euler Angles
		 * @public
		 */
		Euler: "Euler"
	 };

	return AnimationTrackValueType;
});
