sap.ui.define([
	"sap/suite/ui/generic/template/changeHandler/RemoveFilterItem",
	"sap/suite/ui/generic/template/changeHandler/MoveFilterItems",
	"sap/suite/ui/generic/template/changeHandler/AddFilterItem"
], function(
	RemoveFilterItem,
	MoveFilterItems,
	AddFilterItem
) {
	"use strict";
	return {
		// instance-specific flexibility does not seem to be loaded
		// temp solution: put change handler to ListReport.flexibility
		"moveFilterItems": MoveFilterItems,
		"addFilterItem": AddFilterItem,
		"removeFilterItem": RemoveFilterItem
	};
}, /* bExport= */ true);
