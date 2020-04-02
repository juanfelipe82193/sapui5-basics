sap.ui.define(["sap/base/util/LoaderExtensions", "sap/base/util/UriParameters", "sap/base/util/merge"], function(
	LoaderExtensions,
	UriParameters,
	mergeObjects
) {
	"use strict";

	var _oStateCheckFn = {
		focus: function(oElement) {
			// Need to also test the class sapMFocus for some elements that don't match with default jQuery focus selector (sap.m.InputBase)
			return oElement.$().is(":focus") || oElement.$().hasClass("sapMFocus");
		}
	};

	var Utils = {};

	Utils.checkControlState = function(oElement, mExepectedState) {
		var bIsCompliant = false;
		if (mExepectedState) {
			bIsCompliant = Object.keys(mExepectedState).some(function(sProperty) {
				return _oStateCheckFn[sProperty](oElement) !== mExepectedState[sProperty];
			});
		}
		return !bIsCompliant;
	};

	Utils.getManifest = function(sComponentName) {
		var oUriParams = new UriParameters(window.location.href),
			sDeltaManifest = oUriParams.get("manifest"),
			oDefaultManifest = LoaderExtensions.loadResource(sComponentName + "/manifest.json");

		if (sDeltaManifest) {
			if (sDeltaManifest.indexOf("/") !== 0) {
				sDeltaManifest = sComponentName + "/" + sDeltaManifest;
			}
			return mergeObjects({}, oDefaultManifest, LoaderExtensions.loadResource(sDeltaManifest));
		}
		return oDefaultManifest;
	};

	return Utils;
});
