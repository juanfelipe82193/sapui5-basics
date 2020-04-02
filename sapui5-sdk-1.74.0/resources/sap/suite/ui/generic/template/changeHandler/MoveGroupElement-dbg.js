sap.ui.define([
		"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
		"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
		"sap/suite/ui/generic/template/changeHandler/generic/MoveElements",
		"sap/base/util/isEmptyObject"
	], function (
	Utils,
	AnnotationChangeUtils,
	MoveElements,
	isEmptyObject
	) {
		"use strict";

		/**
		 * Change handler for moving a form group element.
		 *
		 * @author SAP SE
		 * @version 1.74.0
		 * @experimental
		 */
		var MoveGroupElement = {};

		MoveGroupElement.applyChange = function (oChange, oControl, mPropertyBag) {
			if (!isEmptyObject(oChange.getContent().movedElements)) {
				MoveElements.applyChange(oChange, oControl, mPropertyBag);
			}
		};

		MoveGroupElement.revertChange = function (oChange, oControl, mPropertyBag) {
			//write revert change logic
		};

		MoveGroupElement.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
			var oMetaModel = Utils.getMetaModel(oSpecificChangeInfo, mPropertyBag),
				oSourceGroup = mPropertyBag.modifier.bySelector(oSpecificChangeInfo.source.id, mPropertyBag.appComponent),
				oTemplDataSource = Utils.getTemplatingInfo(oSourceGroup),
				oSourceEntityType = oMetaModel.getODataEntityType(oTemplDataSource.target),
				sSourceAnnotation = (oTemplDataSource.value.indexOf("/") > 0) ? oTemplDataSource.value.split("/")[1].substr(1) : oTemplDataSource.value
					.substr(1),
			aAnnotations = oSourceEntityType[sSourceAnnotation];
			oSpecificChangeInfo.custom = {};
			oSpecificChangeInfo.custom.elements = aAnnotations.Data;
			oSpecificChangeInfo.custom.fnGetAnnotationIndex = Utils.getGroupElementRecordIndex;
			MoveElements.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
		};

		return MoveGroupElement;
	},
	/* bExport= */true);
