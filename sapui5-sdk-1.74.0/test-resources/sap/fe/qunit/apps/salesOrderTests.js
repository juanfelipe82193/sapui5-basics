sap.ui.define(["./../common/utility"], function(oUtility) {
	"use strict";
	var notInTestSuite = oUtility.isNotInTestSuite(),
		appName = "SALESORDER";

	var aTestList = [
		{
			name: "SalesOrder-Overview",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/Overview.qunit",
			title: "Opa tests for sap.fe SalesOrder Overview Journey",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "Create-SalesOrder",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/CreateSOJourney.qunit",
			title: "Opa tests for sap.fe SalesOrder Create Journey",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "SalesOrder-SideEffects",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/SideEffects.qunit",
			title: "Opa tests for sap.fe SalesOrder SideEffects Journey Journey",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "SalesOrder-Accessibility",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/Accessibility.qunit",
			title: "Opa tests for sap.fe Accessibility standards",
			group: [oUtility.getTestGroups().SANITY, oUtility.getTestGroups().REGRESSION],
			skip: notInTestSuite
		},
		{
			name: "SalesOrder-FilterByValueListSuggestion",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/FilterByValueListSuggestion.qunit",
			title: "Opa tests for sap.fe SalesOrder Overall status filter using value list suggestions",
			group: [oUtility.getTestGroups().SANITY, oUtility.getTestGroups().REGRESSION],
			skip: notInTestSuite
		},
		{
			name: "SalesOrder-AddRemoveColumns",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/AddRemoveColumn.qunit",
			title: "Opa tests for sap.fe SalesOrder Add/Remove Column Journey",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "SalesOrder-AddRemoveFilters",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/AddRemoveFilter.qunit",
			title: "Opa tests for sap.fe SalesOrder Add/Remove Filter Journey",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "SalesOrder-FilterUsingValueHelpDialog",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/FilterUsingValueHelpDialog.qunit",
			title: "Opa tests for sap.fe SalesOrder Overall status filter using selection made through value help dialog",
			group: [oUtility.getTestGroups().SANITY, oUtility.getTestGroups().REGRESSION],
			skip: notInTestSuite
		},
		{
			name: "SalesOrder-EditSalesOrder",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/EditSO.qunit",
			title: "Opa tests for sap.fe SalesOrder Edit Object Page Journey",
			group: [oUtility.getTestGroups().SANITY, oUtility.getTestGroups().REGRESSION],
			skip: notInTestSuite
		},
		{
			name: "SalesOrder-EditDiscardSalesOrder",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/EditDiscardSO.qunit",
			title: "Opa tests for sap.fe SalesOrder Edit a Sales Order and Don’t save",
			group: [oUtility.getTestGroups().SANITY, oUtility.getTestGroups().REGRESSION],
			skip: notInTestSuite
		},
		{
			name: "SalesOrder-EditSalesOrderItemFromOP",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/EditSOItemFromOP.qunit",
			title: "Opa tests for sap.fe SalesOrder - Editing Items in list on ObjectPage",
			group: [oUtility.getTestGroups().SANITY, oUtility.getTestGroups().REGRESSION],
			skip: notInTestSuite
		},
		{
			name: "SalesOrder-EditSalesOrderItemFromSubOP",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/EditSOItemFromSubOP.qunit",
			title: "Opa tests for sap.fe SalesOrder - Editing Items in detail page (sub OP)",
			group: [oUtility.getTestGroups().SANITY, oUtility.getTestGroups().REGRESSION],
			skip: notInTestSuite
		},
		{
			name: "SalesOrder-Search",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/Search.qunit",
			title: "Opa tests for sap.fe SalesOrder Search by entering ID",
			group: [oUtility.getTestGroups().SANITY, oUtility.getTestGroups().REGRESSION],
			skip: notInTestSuite
		},
		{
			name: "SalesOrder-Delete",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/Delete.qunit",
			title: "Opa tests for sap.fe SalesOrder Delete Journey",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "SalesOrderItems-Delete",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/DeleteItems.qunit",
			title: "Opa tests for sap.fe SalesOrder Delete Items Journey",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "SalesOrder-EditingStatusDropdown",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/FilterByEditingStatus.qunit",
			title: "Opa tests for sap.fe SalesOrder filter by editing status dropdown",
			group: [oUtility.getTestGroups().SANITY, oUtility.getTestGroups().REGRESSION],
			skip: notInTestSuite
		},
		{
			name: "SalesOrder-VariantManagement",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/VariantManagement.qunit",
			title: "Opa tests for sap.fe SalesOrder VariantManagement",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "SalesOrder-LiveModeAndInitialLoading",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/LiveModeAndInitialLoading.qunit",
			title: "Opa tests for sap.fe SalesOrder LiveMode and InitialLoading Journey",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "SalesOrder-ActionDialog",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/ActionDialog.qunit",
			title: "Opa tests for sap.fe SalesOrder Action Dialog Journey",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "SalesOrder-SemanticLinks",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/SemanticLinks.qunit",
			title: "Opa tests for sap.fe SalesOrder Check semantic links in quick view",
			group: [],
			skip: notInTestSuite
		},
		{
			name: "SalesOrder-ObjectPageVerifyUI",
			module: "test-resources/sap/fe/internal/integrations/SalesOrderRefactored/ObjectPageVerifyUI.qunit",
			title: "Opa tests for sap.fe SalesOrder ObjectPageVerifyUI Journey",
			group: [],
			skip: notInTestSuite
		}
	];

	return {
		aTestList: aTestList,
		appName: appName
	};
});
