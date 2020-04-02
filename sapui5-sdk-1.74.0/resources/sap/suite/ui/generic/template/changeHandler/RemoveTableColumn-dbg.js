/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/generic/RemoveElement"
], function(
	Utils,
	RemoveElement
) {
	"use strict";
	/**
	 * Change handler for removing a table column.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.RemoveTableColumn
	 * @author SAP SE
	 * @version 1.74.0
	 */

	var RemoveTableColumn = {};
	
	var iIndex;

	var LINEITEM = "com.sap.vocabularies.UI.v1.LineItem";

	function fnApplyUiState(oTable) {
		var oSmartTable = oTable.getParent();
		var oUIState = oSmartTable.getUiState();
		var oPresentationVariant = oUIState.getPresentationVariant();
		var aVisualization = oPresentationVariant.Visualizations[0];
		aVisualization.Content.splice(iIndex - 1, 1);
		oUIState.setPresentationVariant(oPresentationVariant);
		oSmartTable.setUiState(oUIState);
	}

	function fnAdaptTableChange(oTable) {
		if (oTable.isA("sap.m.Table")) {
			fnApplyUiState(oTable);
			Utils.fnAdaptTableStructures(oTable);
		} else {
			fnApplyUiState(oTable);
			var aColumn = oTable.getColumns();
			for (var i = 0; i < aColumn.length; i++) {
				if (!aColumn[i].getVisible()) {
					aColumn[i].destroy();
				}
			}
		}
	}

	RemoveTableColumn.applyChange = function (oChange, oControl, mPropertyBag) {
		var sRemovedElementId = oChange.getContent().customChanges[0].removedElementId;
		var oRemovedElement = mPropertyBag.modifier.bySelector(sRemovedElementId, mPropertyBag.appComponent);
		var oTable = oRemovedElement.getParent();
		fnAdaptTableChange(oTable);
	};

	RemoveTableColumn.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	RemoveTableColumn.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		var sRemovedElementId = oSpecificChangeInfo.removedElement.id;
		var oRemovedElement = mPropertyBag.modifier.bySelector(sRemovedElementId, mPropertyBag.appComponent);
		iIndex = Utils.getLineItemRecordIndex(oRemovedElement);
		oSpecificChangeInfo.custom = {};
		oSpecificChangeInfo.custom.annotation = LINEITEM;
		oSpecificChangeInfo.custom.fnGetAnnotationIndex = Utils.getLineItemRecordIndex;
		RemoveElement.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
	};

	return RemoveTableColumn;
},
/* bExport= */true);
