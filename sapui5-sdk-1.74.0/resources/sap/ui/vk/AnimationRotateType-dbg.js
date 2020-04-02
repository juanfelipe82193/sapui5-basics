
sap.ui.define([
], function() {
	"use strict";

	/**
	 * Animation rotation type.
	 * @enum {string}
	 * @readonly
	 * @alias sap.ui.vk.AnimationRotateType
	 * @private
	 */
	var AnimationRotateType = {
		AngleAxis: "AngleAxis",
		Euler: "Euler",
		Quaternion: "Quaternion"
	};

	return AnimationRotateType;
});
