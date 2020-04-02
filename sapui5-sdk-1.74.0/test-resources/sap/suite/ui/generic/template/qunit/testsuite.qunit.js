sap.ui.define(function () {

	"use strict";
	return {
		name: "QUnit TestSuite for sap.suite.ui.generic.template",
		defaults: {
			qunit: {
				version: 1
			},
			ui5: {
				noConflict: true,
				theme: "sap_belize",
				language: "en",
				libs: ["sap.m", "sap.ui.layout", "sap.ui.commons", "sap.ui.comp", "sap.ui.generic.app", "sap.ui.rta"],
				"xx-waitForTheme": true,
				resourceRoots: {
					"sap/suite/ui/generic/template/integration": "test-resources/sap/suite/ui/generic/template/integration",
					"sap/suite/ui/generic/template/demokit": "test-resources/sap/suite/ui/generic/template/demokit",
					"testUtils": "test-resources/sap/suite/ui/generic/template/qunit",
					"utils": "test-resources/sap/suite/ui/generic/template/utils"
				}
			},
			sinon: {
				version: 1
			},
			loader: {
				paths: {
					tests: "test-resources/sap/suite/ui/generic/template/qunit",
					qunit: "test-resources/sap/suite/ui/generic/template/qunit"
				}
			}
			//bootCore: true
		},
		tests: {
			"ReuseComponentSupportTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/extensionAPI/ReuseComponentSupportTest",
				title: "QUnit: /lib/extensionAPI/ReuseComponentSupportTest",
				group: "qunit @/extensionAPI"
			},
			"ExtensionAPINavigationControllerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/extensionAPI/NavigationControllerTest",
				title: "QUnit: /lib/extensionAPI/NavigationController",
				group: "qunit @/extensionAPI"
			},
			"AnnotationHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/js/AnnotationHelper.qunit",
				title: "QUnit: Annotation Helper",
				group: "qunit @/js",
				ui5: {
					resourceroots: {
						"tests": "test-resources/sap/suite/ui/generic/template/qunit/js"
					}
				}
			},
			"ExtensionPointTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/ExtensionPointTest",
				title: "QUnit: /lib/ExtensionPointTest",
				group: "qunit @/lib"
			},
			"AppComponentTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/AppComponentTest",
				title: "QUnit: /lib/AppComponentTest",
				group: "qunit @/lib"
			},
			"ApplicationTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/ApplicationTest",
				title: "QUnit: /lib/ApplicationTest",
				group: "qunit @/lib",
			},
			"SaveScenarioHandlerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/SaveScenarioHandlerTest",
				title: "QUnit: /lib/SaveScenarioHandlerTest",
				group: "qunit @/lib"
			},
			"BusyHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/BusyHelperTest",
				title: "QUnit: /lib/BusyHelperTest",
				group: "qunit @/lib"
			},
			"MetadataAnalyser": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/MetadataAnalyserTest",
				title: "QUnit: /lib/MetadataAnalyserTest",
				group: "qunit @/lib"
			},
			"CommonEventHandlersTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/CommonEventHandlersTest",
				title: "QUnit: /lib/CommonEventHandlersTest",
				group: "qunit @/lib"
			},
			"CommonUtilsTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/CommonUtilsTest.qunit",
				title: "QUnit: /lib/CommonUtilsTest",
				group: "qunit @/lib"
			},
			"CRUDHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/CRUDHelperTest",
				title: "QUnit: /CRUDHelper",
				group: "qunit @/lib"
			},
			"CRUDManagerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/CRUDManager.qunit",
				title: "QUnit: /CRUDManager",
				group: "qunit @/lib"
			},
			"FlexibleColumnLayoutHandlerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/FlexibleColumnLayoutHandlerTest",
				title: "QUnit: /lib/FlexibleColumnLayoutHandlerTest",
				group: "qunit @/lib"
			},
			"MessageButtonHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/MessageButtonHelperTest",
				title: "QUnit: /lib/MessageButtonHelperTest",
				group: "qunit @/lib"
			},
			"NavigationControllerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/NavigationControllerTest",
				title: "QUnit: /lib/NavigationControllerTest",
				group: "qunit @/lib"
			},
			"RoutingHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/routingHelperTest",
				title: "QUnit: /lib/routingHelperTest",
				group: "qunit @/lib"
			},
			"StatePreserverTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/StatePreserverTest",
				title: "QUnit: /lib/NavigationControllerTest",
				group: "qunit @/lib"
			},
			"TemplateComponent": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/TemplateComponent.qunit",
				title: "QUnit: TemplateComponent",
				group: "qunit @/lib",
			},
			"ViewDependencyHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/ViewDependencyHelperTest",
				title: "QUnit: /lib/ViewDependencyHelperTest",
				group: "qunit @/lib"
			},
			"ModelHelperTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/modelHelperTest",
				title: "QUnit: /lib/modelHelperTest",
				group: "qunit @/lib"
			},
			"ShareUtilsTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/lib/ShareUtilsTest",
				title: "QUnit: lib/ShareUtils Test",
				group: "qunit @/lib"
			},
			"ExampleTest": {
				module: "test-resources/sap/suite/ui/generic/template/internal/exampleTest",
				title: "MQUnit: Example",
				group: "qunit @/internal"
			},
			/* "21_MockServerTest": {
				module: "test-resources/sap/suite/ui/generic/template/internal/demokitErrTest",
				title: "MockServer Smoke Tests"
            },*/
			"MockFuctionTests": {
				module: "test-resources/sap/suite/ui/generic/template/internal/mockFunctionsTest",
				title: "QUnit: mockFunctionsTest",
				group: "qunit @/internal",
				ui5: {
					resourceroots: {
						"tests": "test-resources/sap/suite/ui/generic/template/internal",
						"demokits": "test-resources/sap/suite/ui/generic/template/demokit"
					}
				}
			},
			"ListReportControllerImplementationTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ListReport/controller/ControllerImplementationTest",
				title: "QUnit: ListReport/controller/ControllerImplementationTest",
				group: "qunit @/ListReport/controller",
				qunit: {
					version: 2
				}
			},
			"IappStateHandlerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ListReport/controller/IappStateHandlerTest",
				title: "QUnit: ListReport/controller/IappStateHandlerTest",
				group: "qunit @/ListReport/controller"
			},
			"MultipleViewsHandlerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ListReport/controller/MultipleViewsHandlerTest",
				title: "QUnit: ListReport/controller/MultipleViewsHandlerTest",
				group: "qunit @/ListReport/controller"
			},
			"ComponentTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ListReport/ComponentTests",
				title: "QUnit: /ListReport/Component.qunit",
				group: "qunit @/ListReport"
			},
			"NonDraftTransactionControllerTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ListReport/extensionAPI/NonDraftTransactionControllerTest",
				title: "QUnit: /ListReport/extensionAPI/NonDraftTransactionControllerTest",
				group: "qunit @/ListReport/extensionAPI"
			},
			"ExtensionAPITest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ListReport/extensionAPI/ExtensionAPITest",
				title: "QUnit: /ListReport/extensionAPI/ExtensionAPITest",
				group: "qunit @/ListReport/extensionAPI",
				qunit: {
					version: 2
				}
			},
			"AnnotationHelperSmartChartTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ListReport/AnnotationHelper-SmartChart",
				title: "QUnit: ListReport/AnnotationHelper Test",
				group: "qunit @/ListReport"
			},
			"ColumnDesigntimeTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/ColumnDesigntimeTest",
				title: "QUnit: /DesignTime/ColumnDesigntimeTest",
				group: "qunit @/designtime"
			},
			"HeaderFacetDesigntimeTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/HeaderFacetDesigntimeTest",
				title: "QUnit: /DesignTime/HeaderFacetDesigntimeTest",
				group: "qunit @/designtime"
			},
			"SmartTableDesigntimeTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/SmartTableDesigntimeTest",
				title: "QUnit: /DesignTime/SmartTableDesigntimeTest",
				group: "qunit @/designtime"
			},
			"DynamicPageDesigntimeTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/DynamicPageDesigntimeTest",
				title: "QUnit: /DesignTime/DynamicPageDesigntimeTest",
				group: "qunit @/designtime"
			},
			"ObjectPageDesigntimeTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/ObjectPageDesigntimeTest",
				title: "QUnit: /DesignTime/ObjectPageDesigntimeTest",
				group: "qunit @/designtime"
			},
			"ObjectPageHeaderDesigntimeTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/ObjectPageHeaderDesigntimeTest",
				title: "QUnit: /DesignTime/ObjectPageHeaderDesigntimeTest",
				group: "qunit @/designtime"
			},
			"ObjectPageDynamicHeaderTitleDesigntimeTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/ObjectPageDynamicHeaderTitleDesigntimeTest",
				title: "QUnit: /DesignTime/ObjectPageDynamicHeaderTitleDesigntimeTest",
				group: "qunit @/designtime"
			},
			"ObjectPageSectionDesigntimeTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/ObjectPageSectionDesigntimeTest",
				title: "QUnit: /DesignTime/ObjectPageSectionDesigntimeTest",
				group: "qunit @/designtime"
			},
			"ObjectPageLayoutDesigntimeTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/ObjectPageLayoutDesigntimeTest",
				title: "QUnit: /DesignTime/ObjectPageLayoutDesigntimeTest",
				group: "qunit @/designtime"
			},
			"GroupElementDesigntimeTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/GroupElementDesigntimeTest",
				title: "QUnit: /DesignTime/GroupElementDesigntimeTest",
				group: "qunit @/designtime"
			},
			"DesigntimeUtilsTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/DesigntimeUtilsTest",
				title: "QUnit: /DesignTime/DesigntimeUtilsTest",
				group: "qunit @/designtime"
			},
			"ChartMeasuresTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/virtualProperties/ChartMeasuresTest",
				title: "QUnit: /DesignTime/ChartMeasuresTest",
				group: "qunit @/designtime"
			},
			"ChartTypeTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/virtualProperties/ChartTypeTest",
				title: "QUnit: /DesignTime/ChartTypeTest",
				group: "qunit @/designtime"
			},
			"ColumnTypeTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/virtualProperties/ColumnTypeTest",
				title: "QUnit: /DesignTime/ColumnTypeTest",
				group: "qunit @/designtime"
			},
			"ConnectedFieldDataTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/virtualProperties/ConnectedFieldDataTest",
				title: "QUnit: /DesignTime/ConnectedFieldDataTest",
				group: "qunit @/designtime"
			},
			"DeterminingActionTypeTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/virtualProperties/DeterminingActionTypeTest",
				title: "QUnit: /DesignTime/DeterminingActionTypeTest",
				group: "qunit @/designtime"
			},
			"GroupElementTypeTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/virtualProperties/GroupElementTypeTest",
				title: "QUnit: /DesignTime/GroupElementTypeTest",
				group: "qunit @/designtime"
			},
			"SectionTypeTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/virtualProperties/SectionTypeTest",
				title: "QUnit: /DesignTime/SectionTypeTest",
				group: "qunit @/designtime"
			},
			"SmartTableToolbarDesigntimeTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/designtime/SmartTableToolbarDesigntimeTest",
				title: "QUnit: /DesignTime/SmartTableToolbarDesigntimeTest",
				group: "qunit @/designtime"
			},
			"AnnotationChangeUtilsV2Test": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/util/AnnotationChangeUtilsV2Test",
				title: "QUnit: /changeHandler/util/AnnotationChangeUtilsV2Test",
				group: "qunit @/changeHandlers/util"
			},
			"ChangeHandlerUtilsTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/util/ChangeHandlerUtilsTest",
				title: "QUnit: /changeHandler/util/ChangeHandlerUtilsTest",
				group: "qunit @/changeHandlers/util"
			},
			"AddElementTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/generic/AddElementTest",
				title: "QUnit: /changeHandler/generic/AddElementTest",
				group: "qunit @/changeHandlers/generic"
			},
			"MoveElementsTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/generic/MoveElementsTest",
				title: "QUnit: /changeHandler/generic/MoveElementsTest",
				group: "qunit @/changeHandlers/generic"
			},
			"RemoveElementTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/generic/RemoveElementTest",
				title: "QUnit: /changeHandler/generic/RemoveElementTest",
				group: "qunit @/changeHandlers/generic"
			},
			"RevealElementTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/generic/RevealElementTest",
				title: "QUnit: /changeHandler/generic/RevealElementTest",
				group: "qunit @/changeHandlers/generic"
			},
			"AddTableColumnTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/AddTableColumnTest",
				title: "QUnit: /changeHandler/AddTableColumnTest",
				group: "qunit @/changeHandlers"
			},
			"AddFilterItemTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/AddFilterItemTest",
				title: "QUnit: /changeHandler/AddFilterItemTest",
				group: "qunit @/changeHandlers"
			},
			"AddFooterActionButtonTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/AddFooterActionButtonTest",
				title: "QUnit: /changeHandler/AddFooterActionButtonTest",
				group: "qunit @/changeHandlers"
			},
			"AddGroupElementTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/AddGroupElementTest",
				title: "QUnit: /changeHandler/AddGroupElementTest",
				group: "qunit @/changeHandlers"
			},
			"AddGroupTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/AddGroupTest",
				title: "QUnit: /changeHandler/AddGroupTest",
				group: "qunit @/changeHandlers"
			},
			"AddHeaderActionButtonTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/AddHeaderActionButtonTest",
				title: "QUnit: /changeHandler/AddHeaderActionButtonTest",
				group: "qunit @/changeHandlers"
			},
			"AddHeaderFacetTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/AddHeaderFacetTest",
				title: "QUnit: /changeHandler/AddHeaderFacetTest",
				group: "qunit @/changeHandlers"
			},
			"AddSectionTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/AddSectionTest",
				title: "QUnit: /changeHandler/AddSectionTest",
				group: "qunit @/changeHandlers"
			},
			"AddSubSectionTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/AddSubSectionTest",
				title: "QUnit: /changeHandler/AddSubSectionTest",
				group: "qunit @/changeHandlers"
			},
			"AddToolbarActionButtonTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/AddToolbarActionButtonTest",
				title: "QUnit: /changeHandler/AddToolbarActionButtonTest",
				group: "qunit @/changeHandlers"
			},
			"MoveFilterItemsTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/MoveFilterItemsTest",
				title: "QUnit: /changeHandler/MoveFilterItemsTest",
				group: "qunit @/changeHandlers"
			},
			"MoveGroupElementTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/MoveGroupElementTest",
				title: "QUnit: /changeHandler/MoveGroupElementTest",
				group: "qunit @/changeHandlers"
			},
			"MoveGroupTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/MoveGroupTest",
				title: "QUnit: /changeHandler/MoveGroupTest",
				group: "qunit @/changeHandlers"
			},
			"MoveHeaderAndFooterActionButtonTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/MoveHeaderAndFooterActionButtonTest",
				title: "QUnit: /changeHandler/MoveHeaderAndFooterActionButtonTest",
				group: "qunit @/changeHandlers"
			},
			"MoveHeaderFacetTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/MoveHeaderFacetTest",
				title: "QUnit: /changeHandler/MoveHeaderFacetTest",
				group: "qunit @/changeHandlers"
			},
			"MoveSectionTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/MoveSectionTest",
				title: "QUnit: /changeHandler/MoveSectionTest",
				group: "qunit @/changeHandlers"
			},
			"MoveSubSectionTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/MoveSubSectionTest",
				title: "QUnit: /changeHandler/MoveSubSectionTest",
				group: "qunit @/changeHandlers"
			},
			"MoveTableColumnsTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/MoveTableColumnsTest",
				title: "QUnit: /changeHandler/MoveTableColumnsTest",
				group: "qunit @/changeHandlers"
			},
			"MoveToolbarActionButtonsTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/MoveToolbarActionButtonsTest",
				title: "QUnit: /changeHandler/MoveToolbarActionButtonsTest",
				group: "qunit @/changeHandlers"
			},
			"RemoveGroupElementTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/RemoveGroupElementTest",
				title: "QUnit: /changeHandler/RemoveGroupElementTest",
				group: "qunit @/changeHandlers"
			},
			"RemoveGroupTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/RemoveGroupTest",
				title: "QUnit: /changeHandler/RemoveGroupTest",
				group: "qunit @/changeHandlers"
			},
			"RemoveHeaderAndFooterActionButtonTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/RemoveHeaderAndFooterActionButtonTest",
				title: "QUnit: /changeHandler/RemoveHeaderAndFooterActionButtonTest",
				group: "qunit @/changeHandlers"
			},
			"RemoveHeaderFacetTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/RemoveHeaderFacetTest",
				title: "QUnit: /changeHandler/RemoveHeaderFacetTest",
				group: "qunit @/changeHandlers"
			},
			"RemoveSectionTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/RemoveSectionTest",
				title: "QUnit: /changeHandler/RemoveSectionTest",
				group: "qunit @/changeHandlers"
			},
			"RemoveSubSectionTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/RemoveSubSectionTest",
				title: "QUnit: /changeHandler/RemoveSubSectionTest",
				group: "qunit @/changeHandlers"
			},
			"RemoveTableColumnTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/RemoveTableColumnTest",
				title: "QUnit: /changeHandler/RemoveTableColumnTest",
				group: "qunit @/changeHandlers"
			},
			"RemoveToolbarActionButtonTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/RemoveToolbarActionButtonTest",
				title: "QUnit: /changeHandler/RemoveToolbarActionButtonTest",
				group: "qunit @/changeHandlers"
			},
			"RemoveFilterItemTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/RemoveFilterItemTest",
				title: "QUnit: /changeHandler/RemoveFilterItemTest",
				group: "qunit @/changeHandlers"
			},
			"RevealTableColumnTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/RevealTableColumnTest",
				title: "QUnit: /changeHandler/RevealTableColumnTest",
				group: "qunit @/changeHandlers"
			},
			"RevealHeaderFacetTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/RevealHeaderFacetTest",
				title: "QUnit: /changeHandler/RevealHeaderFacetTest",
				group: "qunit @/changeHandlers"
			},
			"RevealToolbarActionButtonTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/changeHandler/RevealToolbarActionButtonTest",
				title: "QUnit: /changeHandler/RevealToolbarActionButtonTest",
				group: "qunit @/changeHandlers"
			},
			"AnnotationHelperActionButtonsTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ObjectPage/annotationHelpers/AnnotationHelperActionButtonsTest",
				title: "QUnit: /ObjectPage/annotationHelpers/AnnotationHelperActionButtonsTest",
				group: "qunit @/ObjectPage/annotationHelpers"
			},
			"AnnotationHelperSideContentTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ObjectPage/annotationHelpers/AnnotationHelperSideContentTest",
				title: "QUnit: /ObjectPage/annotationHelpers/AnnotationHelperSideContentTest",
				group: "qunit @/ObjectPage/annotationHelpers"
			},
			"ControllerImplementationTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/ObjectPage/controller/ControllerImplementationTest",
				title: "QUnit: /ObjectPage/controller/ControllerImplementationTest",
				group: "qunit @/ObjectPage/controller"
			},
			"AlpTestSuite": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/AnalyticalListPage/alptestsuite",
				title: "QUnit TestSuite for sap.suite.ui.generic.template",
				group: "qunit @/AnalyticalListPage/control"
			},
			"DiagnosticsToolTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/support/DiagnosticsTool/DiagnosticsToolTest",
				title: "QUnit DiagnosticsTool",
				group: "qunit @/support/DiagnosticsTool"
			},
			"CommonFilesTest": {
				module: "test-resources/sap/suite/ui/generic/template/qunit/support/lib/CommonMethodsTest",
				title: "Qunit support",
				group: "qunit @/support/lib/CommonFiles"
			},
			"OPAManageProductsTreeTableListReportTest": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProductsTreeTable/journeys/AllJourneys",
				title: "OPA Tests for Manage Products tree table List Report",
				group: "OPATests @/integration/ManageProductsTreeTable",
				autostart: false
			},
			"OPATestsManageProductsExternalNavigation1": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysExtNav1",
				title: "OPA Tests Manage Products External Navigation 1",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			"OPATestsManageProductsExternalNavigation2": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysExtNav2",
				title: "OPA Tests Manage Products External Navigation 2",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			"OPATestsManageProductsExternalNavigation3": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysExtNav3",
				title: "OPA Tests Manage Products External Navigation 3",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			"OPATestsManageProductsExternalNavigation4": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysExtNav4",
				title: "OPA Tests Manage Products External Navigation 4",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			/*
			"OPATestsManageProductsExternalNavigation5": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysExtNav5",
				title: "OPA Tests Manage Products External Navigation 5",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			*/
			"OPATestsManageProductsExternalNavigation6": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysExtNav6",
				title: "OPA Tests Manage Products External Navigation 6",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			"OPATestsManageProductsExternalNavigation7": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysExtNav7",
				title: "OPA Tests Manage Products External Navigation 7",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false,
				qunit: {
					version: 2
				}
			},
			"OPATestsManageProductsExternalNavigation8": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysExtNav8",
				title: "OPA Tests Manage Products External Navigation 8",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			// TODO: The main test cases are not working becuase of wrong test data. Needs correction
			// "OPATestsManageProductsExternalNavigationSmLiQv": {
			//  	module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/SmLiQv",
			//  	title: "OPA Tests Manage Products External Navigation Semantic Link Quick View",
			//  	group: "OPATests @/integration/ManageProducts_new",
			//  	autostart: false
			// },
			"OPATestsForManageProductsListReportTest": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysLR",
				title: "OPA Tests for Manage Products List Report",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			"OPATestsForManageProductsObjectPageTest": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts_new/journeys/AllJourneysOP",
				title: "OPA Tests Manage Products ObjectPage Open",
				group: "OPATests @/integration/ManageProducts_new",
				autostart: false
			},
			"OpaTestsForManageProducts": {
				module: "test-resources/sap/suite/ui/generic/template/integration/ManageProducts/AllJourneys",
				title: "Opa tests for sap.suite.ui.generic.template ManageProducts",
				group: "OPATests @/integration/ManageProducts",
				autostart: false
			},
			// "OPATestsForSalesOrderNonDraft": {
			// 	module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNonDraft/journeys/AllJourneys",
			// 	title: "OPA Tests for Sales Order Non Draft",
			// 	group: "OPATests @/integration/SalesOrderNonDraft",
			// 	autostart: false
			// },
			"OPATestsforSalesOrderItemAggregation": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/journeys/AllJourneys",
				title: "OPA Tests for Sales Order Item Aggregation",
				group: "OPATests @/integration/SalesOrderItemAggregation",
				autostart: false,
				qunit: {
					version: 2
				}
			},
			"OPATestsforSalesOrderItemAggregationMultiSelect": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderItemAggregation/journeys/AllJourneysMS",
				title: "OPA Tests for Sales Order Item Aggregation",
				group: "OPATests @/integration/SalesOrderItemAggregation",
				autostart: false,
				qunit: {
					version: 2
				}
			},
			/*"59_MockServerTest": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/journeys/AllJourneysOP",
				title: "MockServer Smoke Tests"
            },*/
			/*"60_MockServerTest": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/journeys/AllJourneys",
				title: "MockServer Smoke Tests"
            },*/
			/* this is covered by separate tests for LR and OP
            "OPATestsforSalesOrderwithoutExtensionAllJourneys": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/journeys/AllJourneys",
				title: "OPA Tests for Sales Order without Extensions",
				group : "OPATests @/integration/SalesOrderNoExtensions",
				autostart:false
            },*/
			"OPATestsforSalesOrderwithoutExtensionsLR": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/journeys/AllJourneysLR",
				title: "OPA Tests for Sales Order without Extensions",
				group: "OPATests @/integration/SalesOrderNoExtensions",
				autostart: false,
				qunit: {
					version: 2
				}
			},
			"OPATestsforSalesOrderwithoutExtensionsOP": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/journeys/AllJourneysOP",
				title: "OPA Tests for Sales Order without Extensions",
				group: "OPATests @/integration/SalesOrderNoExtensions",
				autostart: false
			},
			"OPATestsforSalesOrderwithoutExtensionsOPCRUD": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderNoExtensions/journeys/AllJourneysOPCRUD",
				title: "OPA Tests for Sales Order without Extensions CRUD",
				group: "OPATests @/integration/SalesOrderNoExtensions",
				autostart: false
			},
			"OPATestsForSalesOrderTableTabs": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderTableTabs/journeys/AllJourneys",
				title: "OPA Tests for Table Tabs",
				group: "OPATests @/integration/SalesOrderTableTabs",
				autostart: false
			},
			"OPATestsForSegmentedButtonsAndFlexibleColumnLayout": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderSegButtons/journeys/AllJourneys",
				title: "OPA Tests for Segmented Buttons and Flexible Column Layout",
				group: "OPATests @/integration/SalesOrderSegButtons",
				autostart: false
			},
			"OPATestsForSalesOrderMultiEntitySets": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderMultiEntitySets/journeys/AllJourneys",
				title: "OPA Tests for Sales Order Multi Entity Sets",
				group: "OPATests @/integration/SalesOrderMultiEntitySets",
				autostart: false
			},
			"OPATestsForSalesOrderItemEditableFieldFor": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderItemEditableFieldFor/journeys/AllJourneys",
				title: "OPA Tests for Sales Order Items with EditableFieldFor",
				group: "OPATests @/integration/SalesOrderItemEditableFieldFor",
				autostart: false
			},
			"OPATestsForSalesOrderWorklist": {
				module: "test-resources/sap/suite/ui/generic/template/integration/SalesOrderWorklist/journeys/AllJourneys",
				title: "OPA Tests for Sales Order Worklist",
				group: "OPATests @/integration/SalesOrderWorklist",
				autostart: false
			}
			,
			"opaTestsAnalyticalList": {
				module: "test-resources/sap/suite/ui/generic/template/integration/AnalyticalListPage/AllJourneys",
				title: "Opa tests for AnalyticalListPage",
				group: "OPATests @/integration/AnalyticalListPage",
				autostart: false
			},
			"opaTestsALPWithExtension": {
				module: "test-resources/sap/suite/ui/generic/template/integration/AnalyticalListPage/ALPWithExtensionsAllJourneys",
				title: "Opa tests for AnalyticalListPage with Extensions",
				group: "OPATests @/integration/AnalyticalListPage",
				autostart: false
			},
			"opaTestsALPwithParams": {
				module: "test-resources/sap/suite/ui/generic/template/integration/AnalyticalListPage/ALPWithParamAllJourneys",
				title: "Opa tests for AnalyticalListPage with Params",
				group: "OPATests @/integration/AnalyticalListPage",
				autostart: false
			},
			"opaTestsALPWithSettings": {
				module: "test-resources/sap/suite/ui/generic/template/integration/AnalyticalListPage/ALPWithSettingsAllJourneys",
				title: "Opa tests for AnalyticalListPage with Settings",
				group: "OPATests @/integration/AnalyticalListPage",
				autostart: false
			},
			"opaTestsALPFilterBar": {
				module: "test-resources/sap/suite/ui/generic/template/integration/AnalyticalListPage/ALPFilterBarJourneys",
				title: "Opa tests for AnalyticalListPage",
				group: "OPATests @/integration/AnalyticalListPage",
				autostart: false
			},
			"opaTestsALPSanityTest": {
				module: "test-resources/sap/suite/ui/generic/template/integration/AnalyticalListPage/ALPSanityJourney",
				title: "Opa Sanity tests for AnalyticalListPage",
				group: "OPATests @/integration/AnalyticalListPage",
				autostart: false
			}
			/* "opaTestsALPWithTreeTable": {
				module: "test-resources/sap/suite/ui/generic/template/integration/AnalyticalListPage/ALPWithTreeTableAllJourneys",
				title: "Opa tests for AnalyticalListPage with Tree Table"
            }*/
		}
	};
});
