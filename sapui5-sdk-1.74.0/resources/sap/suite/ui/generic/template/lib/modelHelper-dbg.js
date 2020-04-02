/*
 * Static helper class to provide methods for easier access to ODataModel
 */

sap.ui.define(["sap/suite/ui/generic/template/lib/testableHelper", "sap/base/util/deepExtend"], function(testableHelper, deepExtend) {
	"use strict";

	// add Indirection to paths
	function addIndirection(oProperty, sPathSegment) {
		var aRelevantProperties = ["Path", "CollectionPath", "PropertyPath"];
		for (var i in aRelevantProperties){
			var sProperty = aRelevantProperties[i];

			if (oProperty[sProperty]) {
				if (oProperty[sProperty].String) { // CollectionPath
					if (oProperty[sProperty].String.charAt(0) !== "/") {
						oProperty[sProperty].String = sPathSegment + "/" + oProperty[sProperty].String;
					}
				} else {
					if (oProperty[sProperty].charAt(0) !== "/") {
						oProperty[sProperty] = sPathSegment + "/" + oProperty[sProperty];
					}
				}
			}

		}
		for (var property in oProperty){
			if (oProperty.hasOwnProperty(property) && typeof oProperty[property] === "object") {
				addIndirection(oProperty[property], sPathSegment);
			}
		}
		return oProperty;
	}

	// getODataProperty-method from ODataMetaModel is not able to follow paths containing navigation properties
	function getODataProperty(oMetaModel, oEntityType, sPath) {
		function fnFollowPath(oEntityType, aPath) {
			if (aPath.length === 0) { return oEntityType; }
			var sNavigationProperty = aPath.shift();
			return fnFollowPath(oMetaModel.getODataEntityType(oMetaModel.getODataAssociationEnd(oEntityType, sNavigationProperty).type), aPath);
		}
		var aPath = sPath.split("/");
		var sProperty = aPath.pop();
		var sIndirection = aPath.join("/");
		var oPropertyOrg = oMetaModel.getODataProperty(fnFollowPath(oEntityType, aPath), sProperty);
		if (sIndirection && typeof oPropertyOrg !== "string") {
			oPropertyOrg = deepExtend({}, oPropertyOrg);
			oPropertyOrg = addIndirection(oPropertyOrg, sIndirection);
		}
		return oPropertyOrg;
	}

	/* eslint-disable */
	var addIndirection = testableHelper.testableStatic(addIndirection, "modelHelper_addIndirection");
	/* eslint-enable */


	return {
		getODataProperty: getODataProperty
	};
});
