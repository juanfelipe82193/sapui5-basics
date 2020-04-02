/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/util/ChangeHandlerUtils",
	"sap/m/changeHandler/AddTableColumn",
	"sap/suite/ui/generic/template/changeHandler/generic/AddElement",
	"sap/suite/ui/generic/template/lib/testableHelper"
], function (
	Utils,
	AddColumn,
	AddElement,
	testableHelper
) {
	"use strict";
	/**
	 * Change handler for adding a table column.
	 *
	 * @alias sap.suite.ui.generic.template.changeHandler.AddTableColumn
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental
	 */
	var AddTableColumn = {};

	var LINEITEM = "com.sap.vocabularies.UI.v1.LineItem";
	var DATAFIELD = "com.sap.vocabularies.UI.v1.DataField";
	var IMPORTANCE = "com.sap.vocabularies.UI.v1.Importance";
	var IMPORTANCEHIGH = "com.sap.vocabularies.UI.v1.ImportanceType/High";
	var iUIIndex = -1;

	var getAnnotationIndex = function (oOwningElement, aAnnotations) {
		var aParentAggregationElements = oOwningElement.getAggregation("columns");
		var oHelpElement = aParentAggregationElements[iUIIndex];
		var iAnnotationIndex = Utils.getLineItemRecordIndex(oHelpElement, aAnnotations);
		if (!iAnnotationIndex || iAnnotationIndex < 0) {
			iAnnotationIndex = aParentAggregationElements.length;
		}
		return iAnnotationIndex;
	};

	AddTableColumn.applyChange = function (oChange, oControl, mPropertyBag) {
		var oDefinition = oChange.getDefinition();
		if (!oDefinition.transferred) {
			var oParentSelector = oChange.getContent().customChanges[0].oParentSelector;
			var oSapMTable = mPropertyBag.modifier.bySelector(oParentSelector);
			AddElement.applyChange(oChange, oSapMTable, mPropertyBag);
		}
	};

	AddTableColumn.revertChange = function(oChange, oControl, mPropertyBag) {
		//write revert change logic
	};

	AddTableColumn.completeChangeContent = function (oChange, oSpecificChangeInfo, mPropertyBag) {
		var oMetaModel = Utils.getMetaModel(oSpecificChangeInfo, mPropertyBag),
			oTable = mPropertyBag.modifier.bySelector(oSpecificChangeInfo.parentId, mPropertyBag.appComponent),
			sEntityType = Utils.getEntityType(oTable),
			oEntityType = oMetaModel.getODataEntityType(sEntityType),
			oNewColumnProperty;

		for (var i = 0; i < oEntityType.property.length; i++) {
			if (oEntityType.property[i].name === oSpecificChangeInfo.bindingPath) {
				oNewColumnProperty = oEntityType.property[i];
				break;
			}
		}
		var oNewColumn = {
			Value: {
				Path: oSpecificChangeInfo.bindingPath
			},
			RecordType: DATAFIELD,
			EdmType: oNewColumnProperty && oNewColumnProperty.type
		};
		oNewColumn[IMPORTANCE] = {
			EnumMember: IMPORTANCEHIGH
		};

		iUIIndex = oSpecificChangeInfo.index;
		oSpecificChangeInfo.custom = {};
		oSpecificChangeInfo.custom.annotation = LINEITEM;
		oSpecificChangeInfo.custom.oAnnotationTermToBeAdded = oNewColumn;
		oSpecificChangeInfo.custom.AddConcreteElement = AddColumn;
		oSpecificChangeInfo.custom.fnGetAnnotationIndex = getAnnotationIndex;
		AddElement.completeChangeContent(oChange, oSpecificChangeInfo, mPropertyBag);
	};

	testableHelper.testableStatic(getAnnotationIndex, "AddTableColumn_getAnnotationIndex");

	return AddTableColumn;
},
/* bExport= */
true);
