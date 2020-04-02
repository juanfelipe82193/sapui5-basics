/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/suite/ui/generic/template/changeHandler/util/AnnotationChangeUtilsV2",
	"sap/m/changeHandler/MoveTableColumns",
	"sap/suite/ui/generic/template/changeHandler/generic/MoveElements"
], function(
	Utils,
	AnnotationChangeUtils,
	MoveColumns,
	MoveElements
) {
	"use strict";

	/**
	 * Change handler for moving a table column.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.MoveTableColumns
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var MoveTableColumns = {};

	var LINEITEM = "com.sap.vocabularies.UI.v1.LineItem";

	function fnApplyUiState(oTable, iSource, iTarget) {
		var oSmartTable = oTable.getParent();
		var oUIState = oSmartTable.getUiState();
		var oPresentationVariant = oUIState.getPresentationVariant();
		if (oTable.isA("sap.m.Table")) {
			var oColumn = oTable.getColumns()[iTarget];
			oTable.removeColumn(oColumn);
			oTable.insertColumn(oColumn, iSource);
		}
		var aVisualization = oPresentationVariant.Visualizations[0];
		aVisualization.Content.splice(iTarget, 0, aVisualization.Content.splice(iSource, 1)[0]);
		oUIState.setPresentationVariant(oPresentationVariant);
		oSmartTable.setUiState(oUIState);
	}

	function fnAdaptTableChange(oTable, iSource, iTarget) {
		if (oTable.isA("sap.m.Table")) {
			fnApplyUiState(oTable, iSource, iTarget);
			Utils.fnAdaptTableStructures(oTable);
		} else {
			fnApplyUiState(oTable, iSource, iTarget);
		}
	}

	MoveTableColumns.applyChange = function (oChange, oControl, mPropertyBag) {
		var oTable = oChange.getDependentControl("source", mPropertyBag);
		var iSourceIndex = oChange.getContent().movedElements[0].sourceIndex;
		var iTargetIndex = oChange.getContent().movedElements[0].targetIndex;
		fnAdaptTableChange(oTable, iSourceIndex, iTargetIndex);
	};

	MoveTableColumns.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	MoveTableColumns.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		oSpecificChangeInfo.custom = {};
		oSpecificChangeInfo.custom.annotation = LINEITEM;
		oSpecificChangeInfo.custom.fnGetAnnotationIndex = Utils.getLineItemRecordIndex;
		oSpecificChangeInfo.custom.MoveConcreteElement = MoveColumns;
		MoveElements.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
	};

	return MoveTableColumns;
},
/* bExport= */true);
