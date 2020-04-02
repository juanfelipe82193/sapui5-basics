/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/generic/AddElement"
], function(Utils, AddElement) {
	"use strict";
	var SELECTIONFIELDS = "com.sap.vocabularies.UI.v1.SelectionFields";

	// TODO - Remove this function once RTA fixes the logic to hide item if already present in aggregation
	// As this is a temp function, not test case are written for this
	var fnCheckAnnotationExists = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		var sOwningElementId = oSpecificChangeInfo.parentId || oSpecificChangeInfo.selector.id;
		var oOwningElement =  mPropertyBag.modifier.bySelector(sOwningElementId, mPropertyBag.appComponent);
		var oMetaModel = Utils.getMetaModel(oSpecificChangeInfo, mPropertyBag);
		var sEntityType = Utils.getEntityType(oOwningElement);
		var oEntityType = oMetaModel.getODataEntityType(sEntityType);
		var aAnnotations = oEntityType[SELECTIONFIELDS];
		var bExists = aAnnotations.some( function(oAnnotation){
			return oAnnotation.PropertyPath == oSpecificChangeInfo.addElementInfo.name;
		});
		return bExists;
	};

	/**
	 * Change handler for adding a filter item.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.AddFilterItem
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var AddFilterItem = {};

	AddFilterItem.applyChange = function (oChange, oControl, mPropertyBag) {
		//write apply change logic
	};

	AddFilterItem.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	AddFilterItem.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		// TODO - Remove this check once RTA fixes the logic to hide item if already present in aggregation
		if (!fnCheckAnnotationExists(oChange, oSpecificChangeInfo, mPropertyBag)){
			//write complete change logic
			oSpecificChangeInfo.custom = { } ;
			var oNewFilter = { PropertyPath : oSpecificChangeInfo.addElementInfo.name };
			oSpecificChangeInfo.custom.annotation = SELECTIONFIELDS;
			oSpecificChangeInfo.custom.index = oSpecificChangeInfo.index;
			oSpecificChangeInfo.custom.oAnnotationTermToBeAdded = oNewFilter;
			oSpecificChangeInfo.custom.fnGetAnnotationIndex = Utils.getRecordIndexForSelectionFieldFromAnnotation;
			AddElement.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
		}
	};

	return AddFilterItem;
},
/* bExport= */true);
