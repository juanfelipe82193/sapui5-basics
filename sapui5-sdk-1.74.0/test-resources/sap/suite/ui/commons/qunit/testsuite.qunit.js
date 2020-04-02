sap.ui.define(function () {
	"use strict";

	return {
		// Just for a nice title on the pages
		name: "QUnit TestSuite for sap.suite.ui.commons",
		defaults: {
			ui5: {
				language: "en-US",
				// Libraries to load upfront in addition to the library which is tested (sap.ui.export), if null no libs are loaded
				libs: "sap.ui.core,sap.m,sap.suite.ui.commons",
				theme: "sap_belize",
				noConflict: true,
				preload: "auto",
				resourceroots: {"test": "../test-resources"},
				"xx-waitForTheme": "init"
			}, // Whether QUnit should be loaded and if so, what version
			qunit: {
				version: 2
			},
			// Whether Sinon should be loaded and if so, what version
			sinon: {
				version: 1,
				qunitBridge: true,
				useFakeTimers: false
			},
			coverage: {
				// Which files to show in the coverage report, if null, no files are excluded from coverage
				only: "//sap\/suite\/ui\/commons\/.*/"
			},
			module: "./{name}.qunit"
		},
		tests: {
			/*
			 * ChartContainer
			 */
			ChartContainer: {
				group: "ChartContainer",
				coverage: {
					only: "//sap\/suite\/ui\/commons\/ChartContainer.*/"
				},
				module: [
					"./ChartContainerEventHandling.qunit",
					"./ChartContainerDimensionSelectors.qunit",
					"./ChartContainerGetSetPrivateMethods.qunit",
					"./ChartContainerSegmentedButton.qunit",
					"./ChartContainerHelperMethods.qunit",
					"./ChartContainerLifecycleMethods.qunit",
					"./ChartContainerPublicAggregationGetSet.qunit",
					"./ChartContainerPublicMethods.qunit",
					"./ChartContainerPublicPropertyGetSet.qunit",
					"./ChartContainerAggregationBinding.qunit",
					"./ChartContainerSelectionDetails.qunit",
					"./ChartContainerRendering.qunit"
				]
			},
			/*
			 * ChartContainerContent
			 */
			"ChartContainerContent": {
				group: "ChartContainerContent"
			},
			/*
			 * ProcessFlow
			 */
			ProcessFlow: {
				group: "ProcessFlow",
				coverage: {
					only: "//sap\/suite\/ui\/commons\/ProcessFlow.*/"
				},
				module: [
					"./ProcessFlow.qunit",
					"./ProcessFlowKeyboardInteraction.qunit",
					"./ProcessFlowChevrons.qunit",
					"./ProcessFlowChildren.qunit",
					"./ProcessFlowMatrix.qunit",
					"./ProcessFlowNodeElement.qunit",
					"./ProcessFlowAggregation.qunit"
				]
			},
			/*
			 * ProcessFlowConnection
			 */
			"ProcessFlowConnection": {
				group: "ProcessFlowConnection",
				module: [
					"./ProcessFlowConnection.qunit",
					"./ProcessFlowConnectionTypes.qunit"
				]
			},
			/*
			 * ProcessFlowConnectionLabel
			 */
			"ProcessFlowConnectionLabel": {
				group: "ProcessFlowConnectionLabel"
			},
			/*
			 * ProcessFlowNode
			 */
			"ProcessFlowNode": {
				group: "ProcessFlowNode"
			},
			/*
			 * ProcessFlowLaneHeader
			 */
			"ProcessFlowLaneHeader": {
				groups: "ProcessFlowLaneHeader"
			},
			/*
			 * MicroProcessFlow
			 */
			"MicroProcessFlow": {
				group: "MicroProcessFlow",
				coverage: {
					only: "//sap\/suite\/ui\/commons\/MicroProcessFlow.*/"
				}
			},
			/*
			 * DateUtils
			 */
			"DateUtils": {
				group: "DateUtils"
			},
			/*
			 * StatusIndicator
			 */
			StatusIndicator: {
				group: "StatusIndicator",
				coverage: {
					only: "//sap\/suite\/ui\/commons\/statusindicator\/.*/"
				},
				module: [
					"./statusindicator/StatusIndicator.basic.qunit",
					"./statusindicator/ShapeGroup.qunit",
					"./statusindicator/Shape.qunit",
					"./statusindicator/Path.qunit",
					"./statusindicator/Rectangle.qunit",
					"./statusindicator/Circle.qunit",
					"./statusindicator/CustomShape.qunit",
					"./statusindicator/util/ProgressHandler.qunit",
					"./statusindicator/SimpleShape.qunit",
					"./statusindicator/LibraryShape.qunit",
					"./statusindicator/util/ThemingUtil.qunit",
					"./statusindicator/util/AnimationPropertiesResolver.qunit"
				]
			},
			/*
			 * RenderUtils
			 */
			"RenderUtils": {
				group: "RenderUtils",
				qunit: {
					version: 1
				}
			},
			/*
			 * Timeline
			 */
			Timeline: {
				group: "Timeline",
				coverage: {
					only: "//sap\/suite\/ui\/commons\/Timeline.*/"
				},
				module: [
					"./Timeline.qunit",
					"./TimelineOldIssues.qunit",
					"./TimelineProperties.qunit",
					"./TimelineItem.qunit",
					"./TimelineDataBinding.qunit",
					"./TimelineItemRenderer.qunit",
					"./TimelineGrouping.qunit",
					"./TimelineFunctions.qunit",
					"./TimelineShowMore.qunit",
					"./TimelineCustomization.qunit",
					"./TimelineRenderManagerTimestamp.qunit"
				]
			},
			/*
			 * Util
			 */
			Util: {
				group: "Util",
				module: [
					"./util/DateUtils.qunit",
					"./util/HtmlElement.qunit",
					"./util/HtmlElementRenderer.qunit",
					"./util/ManagedObjectRegister.qunit"
				]
			},
			/*
			 * NetworkGraph
			 */
			NetworkGraph: {
				group: "NetworkGraph",
				coverage: {
					only: "//sap\/suite\/ui\/commons\/networkgraph\/.*/"
				},
				module: [
					"./networkgraph/CustomStatus.qunit",
					"./networkgraph/DataBindingTest.qunit",
					"./networkgraph/ColExpTest.qunit",
					"./networkgraph/GeometryTest.qunit",
					"./networkgraph/GroupingTest.qunit",
					"./networkgraph/LayoutTest.qunit",
					"./networkgraph/LineTest.qunit",
					"./networkgraph/NegativeTest.qunit",
					"./networkgraph/NoDataBindingTest.qunit",
					"./networkgraph/NodeTest.qunit",
					"./networkgraph/GraphTest.qunit",
					"./networkgraph/SelectionTest.qunit",
					"./networkgraph/UtilsTest.qunit",
					"./networkgraph/GraphMapTest.qunit",
					"./networkgraph/KeyboardNavigator.qunit",
					"./networkgraph/NestedGroupsTest.qunit",
					"./networkgraph/util/Dijkstra.qunit"
				]
			},
			/*
			 * penetrationTests/PenetrationTest
			 */
			"penetrationTests/PenetrationTest": {
				group: "PenetrationTest"
			},
			/*
			 * CalculationBuilder
			 */
			CalculationBuilder: {
				group: "CalculationBuilder",
				coverage: {
					only: "//sap\/suite\/ui\/commons\/CalculationBuilder.*/"
				},
				module: [
					"./CalculationBuilder.qunit",
					"./CalculationBuilderExpression.qunit",
					"./CalculationBuilderInput.qunit",
					"./CalculationBuilderItem.qunit"
				]
			},
			/*
			 * TAccount
			 */
			TAccount: {
				group: "TAccount",
				coverage: {
					only: "//sap\/suite\/ui\/commons\/taccount\/.*/"
				},
				module: [
					"./TAccount.qunit",
					"./TAccountItem.qunit",
					"./TAccountItemProperty.qunit"
				]
			},
			ImageEditor: {
				group: "ImageEditor",
				coverage: {
					only: "//sap\/suite\/ui\/commons\/imageeditor\/.*/"
				},
				module: [
					"./imageeditor/ImageEditor.qunit",
					"./imageeditor/ImageEditorContainer.qunit"
				],
				sinon: {
					version: 4
				}
			},
			SettersContextReturn: {
				group: "SettersContextReturn"
			}
		}
	};
});
