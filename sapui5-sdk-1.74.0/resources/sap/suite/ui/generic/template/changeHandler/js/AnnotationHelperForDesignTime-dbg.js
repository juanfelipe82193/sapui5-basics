sap.ui.define([],
	function() {
		"use strict";
		var iNextId = 0;

		function createInstanceMetadataWithPath(oInterface, sEntityType, sAnnotation, sPropertyPath, oAnnotationContext, oTargetEntitySet) {
			if (oTargetEntitySet && oTargetEntitySet.entityType) {
				sEntityType = oTargetEntitySet.entityType;
				sAnnotation = (sAnnotation.indexOf("/@") > 0) ? sAnnotation.split("/@")[1] : sAnnotation;
			}
			sAnnotation = sAnnotation.startsWith("@") ? sAnnotation.substr(1) : sAnnotation;
			var oContext = oInterface.getInterface(3);
			var sPath = oContext && oContext.getPath();
			var sStringForId = oAnnotationContext.ID ? oAnnotationContext.ID.String : sAnnotation;
			var sEndingNumber = sStringForId.match(/\d+$/);
			var iCurrentId = 0;
			if (sEndingNumber) {
				iCurrentId = sEndingNumber[0] * 1;
			}
			iNextId = iNextId > iCurrentId ? iNextId : iCurrentId + 1;
			var oRes = {
				"target": sEntityType,
				"annotation": sAnnotation,
				"value": sPropertyPath,
				"path": sPath,
				"annotationContext": oAnnotationContext
			};

			var sRes = JSON.stringify(oRes);
			return sRes;
		}

		function createInstanceMetadataForDesignTime(sEntityType, sAnnotation, sPropertyPath) {
			var oRes = {
				"target": sEntityType,
				"annotation": sAnnotation,
				"value": sPropertyPath
			};
			var sRes = JSON.stringify(oRes);
			return sRes;
		}

		createInstanceMetadataWithPath.requiresIContext = true;

		// @params {boolean} bIsUpdateRequired is boolean variable depending on which the next ID would be updated.
		// the suffix which it returns is never used earlier as suffix for any ID of any annotation.
		// suffix is the number in string format. A unique number.
		// returns the Unique suffix which can be used in the ID property of any annotation.

		function getNextIdSuffix(bIsUpdateRequired) {
			var iCreatedId = iNextId;
			if (bIsUpdateRequired) {
				iNextId++;
			}
			return iCreatedId + "";
		}
		return {
			createInstanceMetadataWithPath: createInstanceMetadataWithPath,
			createInstanceMetadataForDesignTime: createInstanceMetadataForDesignTime,
			getNextIdSuffix: getNextIdSuffix
		};
	},
	/* bExport= */
	true
);