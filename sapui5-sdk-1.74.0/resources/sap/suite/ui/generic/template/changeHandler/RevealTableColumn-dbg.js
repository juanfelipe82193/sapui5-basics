/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/generic/RevealElement"
], function(
	Utils,
	RevealElement
) {
	"use strict";

	/**
	 * Change handler for revealing a table column.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.RevealTableColumn
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var RevealTableColumn = {};

	var LINEITEM = "com.sap.vocabularies.UI.v1.LineItem";
	var DATAFIELD = "com.sap.vocabularies.UI.v1.DataField";

	var fnCreateRevealedAnnotationTerm = function(oChange, oSpecificChangeInfo, mPropertyBag) {
			var oColumn = mPropertyBag.modifier.bySelector(oSpecificChangeInfo.revealedElementId, mPropertyBag.appComponent);
			var sProperty = Utils.getPropertyOfColumn(oColumn);
			var oEntityType = Utils.getODataEntityType(oColumn);
			var aProperty = oEntityType && oEntityType.property;
			var i, oProperty;
			for (i = 0; i < aProperty.length; i++) {
				if (aProperty[i].name === sProperty) {
					oProperty = aProperty[i];
					break;
				}
			}
			var oLineItem = {
				Value: {
					Path: sProperty
				},
				RecordType: DATAFIELD,
				EdmType: oProperty && oProperty.type
			};
			return oLineItem;
		};

	RevealTableColumn.applyChange = function (oChange, oControl, mPropertyBag) {
		RevealElement.applyChange(oChange, oControl, mPropertyBag);
	};

	RevealTableColumn.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	RevealTableColumn.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		oSpecificChangeInfo.custom = {};
		oSpecificChangeInfo.custom.annotation = LINEITEM;
		oSpecificChangeInfo.custom.fnGetAnnotationIndex = Utils.getLineItemRecordIndex;
		oSpecificChangeInfo.custom.oRevealedAnnotationTerm = JSON.parse(JSON.stringify(fnCreateRevealedAnnotationTerm(oChange, oSpecificChangeInfo, mPropertyBag)));
		RevealElement.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
	};

	return RevealTableColumn;
},
/* bExport= */true);
