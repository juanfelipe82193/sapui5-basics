/*global QUnit,sinon*/

sap.ui.require([
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/comp/smartmicrochart/SmartMicroChart",
	"sap/ui/comp/smartmicrochart/SmartComparisonMicroChart",
	"sap/m/Label",
	"sap/m/library",
	"sap/ui/core/CustomData",
	"sap/ui/model/Model",
	"sap/suite/ui/microchart/ComparisonMicroChart",
	"sap/ui/comp/smartmicrochart/SmartMicroChartBase",
	"sap/base/Log",
	"sap/m/Button"
], function (MockServer, ODataModel, SmartMicroChart, SmartComparisonMicroChart, Label, MLibrary, CustomData, Model,
			 ComparisonMicroChart, SmartMicroChartBase, Log, Button) {
	"use strict";

	var oSandbox = sinon.sandbox.create();
	var Size = MLibrary.Size;

	QUnit.module("SmartMicroChart on ChartType/Bullet", {
		beforeEach: function() {
			this.oMockServer = new MockServer({
				rootUri: "smartmicrochart.SmartMicroChart/"
			});
			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver"
			});
			this.oMockServer.start();
			this.oModel = new ODataModel("smartmicrochart.SmartMicroChart/", true);
			this.oSmartMicroChart = new SmartMicroChart({
				entitySet: "Products"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oMockServer.stop();
			this.oMockServer.destroy();
			this.oModel.destroy();
			this.oSmartMicroChart.destroy();
		}
	});

	QUnit.test("Shall have an entitySet property from constructor", function(assert) {
		assert.deepEqual(this.oSmartMicroChart.getEntitySet(), "Products");
	});

	QUnit.test("Check default values", function(assert) {
		assert.deepEqual(this.oSmartMicroChart.getWidth(), undefined);
		assert.deepEqual(this.oSmartMicroChart.getHeight(), undefined);
		assert.ok(this.oSmartMicroChart.getShowLabel());
		assert.ok(!this.oSmartMicroChart.getIsResponsive());
	});

	QUnit.test("Check chartType delegation to _chart Aggregation", function(assert) {
		var done = assert.async();
		//Arrange
		this.oSmartMicroChart.attachInitialize(handleInit.bind(this));
		this.oSmartMicroChart.data("chartQualifier", "BulletChartQualifier");
		//Act
		this.oSmartMicroChart.setModel(this.oModel);

		//Assert
		function handleInit() {
			assert.deepEqual(this.oSmartMicroChart.getChartType(), "Bullet");
			done();
		}
	});

	QUnit.module("SmartMicroChart on ChartType/Pie", {
		beforeEach: function() {
			this.oMockServer = new MockServer({
				rootUri: "smartmicrochart.SmartMicroChart/"
			});
			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver"
			});
			this.oMockServer.start();
			this.oModel = new ODataModel("smartmicrochart.SmartMicroChart/", true);
			this.oSmartMicroChart = new SmartMicroChart({
				entitySet: "Products"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oMockServer.stop();
			this.oMockServer.destroy();
			this.oModel.destroy();
			this.oSmartMicroChart.destroy();
		}
	});

	QUnit.test("Shall have an entitySet property from constructor", function(assert) {
		assert.deepEqual(this.oSmartMicroChart.getEntitySet(), "Products");
	});

	QUnit.test("Check default values", function(assert) {
		assert.deepEqual(this.oSmartMicroChart.getWidth(), undefined);
		assert.deepEqual(this.oSmartMicroChart.getHeight(), undefined);
		assert.ok(this.oSmartMicroChart.getShowLabel());
		assert.ok(!this.oSmartMicroChart.getIsResponsive());
	});

	QUnit.test("Check chartType delegation to _chart Aggregation", function(assert) {
		var done = assert.async();
		//Arrange
		this.oSmartMicroChart.attachInitialize(handleInit.bind(this));
		this.oSmartMicroChart.data("chartQualifier", "PieChartQualifier");
		//Act
		this.oSmartMicroChart.setModel(this.oModel);

		//Assert
		function handleInit() {
			assert.deepEqual(this.oSmartMicroChart.getChartType(), "Pie");
			done();
		}
	});

	QUnit.module("SmartMicroChart on ChartType/Area", {
		beforeEach: function() {
			this.oMockServer = new MockServer({
				rootUri: "smartmicrochart.SmartMicroChart/"
			});
			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver"
			});
			this.oMockServer.start();
			this.oModel = new ODataModel("smartmicrochart.SmartMicroChart/", true);
			this.oSmartMicroChart = new SmartMicroChart({
				entitySet: "Series"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oMockServer.stop();
			this.oMockServer.destroy();
			this.oModel.destroy();
			this.oSmartMicroChart.destroy();
		}
	});

	QUnit.test("Check chartType delegation to _chart Aggregation", function(assert) {
		var done = assert.async();
		//Arrange
		this.oSmartMicroChart.attachInitialize(handleInit.bind(this));
		//Act
		this.oSmartMicroChart.setModel(this.oModel);
		sap.ui.getCore().applyChanges();

		//Assert
		function handleInit() {
			assert.deepEqual(this.oSmartMicroChart.getChartType(), "Area");
			done();
		}
	});

	QUnit.module("SmartMicroChart on ChartType/Line", {
		beforeEach: function() {
			this.oMockServer = new MockServer({
				rootUri: "smartmicrochart.SmartMicroChart/"
			});
			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver"
			});
			this.oMockServer.start();
			this.oModel = new ODataModel("smartmicrochart.SmartMicroChart/", true);
			this.oSmartMicroChart = new SmartMicroChart({
				entitySet: "StockPrices"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oMockServer.stop();
			this.oMockServer.destroy();
			this.oModel.destroy();
			this.oSmartMicroChart.destroy();
		}
	});

	QUnit.test("Check chartType delegation to _chart Aggregation", function(assert) {
		var done = assert.async();
		//Arrange
		this.oSmartMicroChart.attachInitialize(handleInit.bind(this));
		//Act
		this.oSmartMicroChart.setModel(this.oModel);
		sap.ui.getCore().applyChanges();

		//Assert
		function handleInit() {
			assert.deepEqual(this.oSmartMicroChart.getChartType(), "Line");
			done();
		}
	});

	QUnit.module("Aria test delegeting", {
		beforeEach: function() {
			this.oSmartMicroChart = new SmartMicroChart();
			this.oSCMC = new SmartComparisonMicroChart();
			this.oMC = new ComparisonMicroChart();
			this.oSCMC.setAggregation("_chart", this.oMC);
			this.oSmartMicroChart.setAggregation("_chart", this.oSCMC);
			this.oButton1 = new Button();
			this.oButton2 = new Button();
			this.oButton3 = new Button();
		},
		afterEach: function() {
			this.oMC.destroy();
			this.oSCMC.destroy();
			this.oSmartMicroChart.destroy();
		}
	});

	QUnit.test("Test addAriaLabelledBy", function(assert) {
		var oSpySmartAriaLabelledBy = sinon.spy(this.oSCMC, "addAriaLabelledBy");
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "addAriaLabelledBy");

		this.oSmartMicroChart.addAriaLabelledBy(this.oButton1);
		assert.ok(this.oSCMC.addAriaLabelledBy.calledOnce, "If addAriaLabelledBy function was called in SmartComparisonMicroChart from SmartMicroChart exactly once");
		assert.ok(this.oMC.addAriaLabelledBy.calledOnce, "If addAriaLabelledBy function was called in ComparisonMicroChart from SmartMicroChart exactly once");
		oSpySmartAriaLabelledBy.restore();
		oSpyAriaLabelledBy.restore();
	});

	QUnit.test("Test removeAriaLabelledBy", function(assert) {
		var oSpySmartAriaLabelledBy = sinon.spy(this.oSCMC, "removeAriaLabelledBy");
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "removeAriaLabelledBy");

		this.oSmartMicroChart.addAriaLabelledBy(this.oButton1);
		this.oSmartMicroChart.removeAriaLabelledBy(this.oButton1);
		assert.ok(this.oSCMC.removeAriaLabelledBy.calledOnce, "If removeAriaLabelledBy function was called in SmartComparisonMicroChart from SmartMicroChart exactly once");
		assert.ok(this.oMC.removeAriaLabelledBy.calledOnce, "If removeAriaLabelledBy function was called in ComparisonMicroChart from SmartMicroChart exactly once");
		oSpySmartAriaLabelledBy.restore();
		oSpyAriaLabelledBy.restore();
	});

	QUnit.test("Test removeAllAriaLabelledBy", function(assert) {
		var oSpySmartAriaLabelledBy = sinon.spy(this.oSCMC, "removeAllAriaLabelledBy");
		var oSpyAriaLabelledBy = sinon.spy(this.oMC, "removeAllAriaLabelledBy");

		this.oSmartMicroChart.addAriaLabelledBy(this.oButton1);
		this.oSmartMicroChart.addAriaLabelledBy(this.oButton2);
		this.oSmartMicroChart.addAriaLabelledBy(this.oButton3);

		this.oSmartMicroChart.removeAllAriaLabelledBy();
		assert.ok(this.oSCMC.removeAllAriaLabelledBy.calledOnce, "If removeAllAriaLabelledBy function was called in SmartComparisonMicroChart from SmartMicroChart exactly once");
		assert.ok(this.oMC.removeAllAriaLabelledBy.calledOnce, "If removeAllAriaLabelledBy function was called in ComparisonMicroChart from SmartMicroChart exactly once");
		oSpySmartAriaLabelledBy.restore();
		oSpyAriaLabelledBy.restore();
	});

	QUnit.module("SmartMicroChart on ChartType/Donut", {
		beforeEach: function() {
			this.oMockServer = new MockServer({
				rootUri: "smartmicrochart.SmartMicroChart/"
			});
			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver"
			});
			this.oMockServer.start();
			this.oModel = new ODataModel("smartmicrochart.SmartMicroChart/", true);
			this.oSmartMicroChart = new SmartMicroChart({
				entitySet: "Sales"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oMockServer.stop();
			this.oMockServer.destroy();
			this.oModel.destroy();
			this.oSmartMicroChart.destroy();
		}
	});

	QUnit.test("Check chartType delegation to _chart Aggregation", function(assert) {
		var done = assert.async();
		//Arrange
		this.oSmartMicroChart.attachInitialize(handleInit.bind(this));
		this.oSmartMicroChart.data("chartQualifier", "DonutChartQualifier");
		//Act
		this.oSmartMicroChart.setModel(this.oModel);
		sap.ui.getCore().applyChanges();

		//Assert
		function handleInit() {
			assert.deepEqual(this.oSmartMicroChart.getChartType(), "Donut");
			done();
		}
	});

	QUnit.module("SmartMicroChart on ChartType/BarStacked", {
		beforeEach: function() {
			this.oMockServer = new MockServer({
				rootUri: "smartmicrochart.SmartMicroChart/"
			});
			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver"
			});
			this.oMockServer.start();
			this.oModel = new ODataModel("smartmicrochart.SmartMicroChart/", true);
			this.oSmartMicroChart = new SmartMicroChart({
				entitySet: "Revenues"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oMockServer.stop();
			this.oMockServer.destroy();
			this.oModel.destroy();
			this.oSmartMicroChart.destroy();
		}
	});

	QUnit.test("Check chartType delegation to _chart Aggregation", function(assert) {
		var done = assert.async();
		//Arrange
		this.oSmartMicroChart.attachInitialize(handleInit.bind(this));
		//Act
		this.oSmartMicroChart.setModel(this.oModel);
		sap.ui.getCore().applyChanges();

		//Assert
		function handleInit() {
			assert.deepEqual(this.oSmartMicroChart.getChartType(), "BarStacked");
			done();
		}
	});

	QUnit.module("SmartMicroChart on ChartType/Column", {
		beforeEach: function() {
			this.oMockServer = new MockServer({
				rootUri: "smartmicrochart.SmartMicroChart2/"
			});
			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver/metadata2.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver"
			});
			this.oMockServer.start();
			this.oModel = new ODataModel("smartmicrochart.SmartMicroChart2/", true);
			this.oSmartMicroChart = new SmartMicroChart({
				entitySet: "StockPrices"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oMockServer.stop();
			this.oMockServer.destroy();
			this.oModel.destroy();
			this.oSmartMicroChart.destroy();
		}
	});

	QUnit.test("Check chartType delegation to _chart Aggregation", function(assert) {
		var done = assert.async();
		//Arrange
		this.oSmartMicroChart.attachInitialize(handleInit.bind(this));
		//Act
		this.oSmartMicroChart.setModel(this.oModel);
		sap.ui.getCore().applyChanges();

		//Assert
		function handleInit() {
			assert.deepEqual(this.oSmartMicroChart.getChartType(), "Column");
			done();
		}
	});

	QUnit.module("check bindElement", {
		beforeEach: function() {
			this.oMockServer = new MockServer({
				rootUri: "smartmicrochart.SmartMicroChart/"
			});
			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver"
			});
			this.oMockServer.start();
			this.oModel = new ODataModel("smartmicrochart.SmartMicroChart/", true);
			this.oSmartMicroChart = new SmartMicroChart({
				entitySet: "Products"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oMockServer.stop();
			this.oMockServer.destroy();
			this.oModel.destroy();
			this.oSmartMicroChart.destroy();
		}
	});

	QUnit.test("Check if _chart aggregation was bound", function(assert) {
		var done = assert.async();
		//Arrange
		this.oSmartMicroChart.attachInitialize(handleInit.bind(this));
		this.oSmartMicroChart.data("chartQualifier", "BulletChartQualifier");
		//Act
		this.oSmartMicroChart.setModel(this.oModel);

		//Assert
		function handleInit() {
			this.oSmartMicroChart.bindElement("/Products('PC')");
			assert.equal(this.oSmartMicroChart.getObjectBinding().getPath(), "/Products('PC')");
			done();
		}
	});

	QUnit.module("Check Metadata", {
		beforeEach: function() {
			this.oSmartMicroChart = new SmartMicroChart({
				entitySet: "Products"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function() {
			this.oSmartMicroChart.destroy();
		}
	});

	QUnit.test("_checkChartMetadata works correctly", function(assert) {
		//Arrange
		this.oSmartMicroChart._oChartViewMetadata = {
			chartType: "area",
			annotation: {
				ChartType: {
					EnumMember: "UiVoca/Area"
				}
			}
		};
		//Act
		//Assert
		assert.ok(this.oSmartMicroChart._checkChartMetadata());
	});

	QUnit.test("_checkChartMetadata works correctly is case incorrect 'chartType.EnumMember' is provided", function(assert) {
		//Arrange
		this.oSmartMicroChart._oChartViewMetadata = {
			chartType: {},
			annotation: {
				ChartType: {
					EnumMember: {}
				}
			}
		};
		//Act
		//Assert
		assert.ok(!this.oSmartMicroChart._checkChartMetadata());
	});

	QUnit.test("_checkChartMetadata works correctly is case incorrect 'chartType' is provided", function(assert) {
		//Arrange
		this.oSmartMicroChart._oChartViewMetadata = {
			chartType: {},
			annotation: {}
		};
		//Act
		//Assert
		assert.ok(!this.oSmartMicroChart._checkChartMetadata());
	});

	QUnit.test("_checkChartMetadata works correctly is case nothing is provided", function(assert) {
		//Arrange
		this.oSmartMicroChart._oChartViewMetadata = {};
		//Act
		//Assert
		assert.ok(!this.oSmartMicroChart._checkChartMetadata());
	});

	QUnit.module("createInnerChart", {
		beforeEach: function() {
			this.oSmartMicroChart = new SmartMicroChart({
				entitySet: "Products"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			this.oSpy = sinon.spy(Log, "error");
		},
		afterEach: function() {
			this.oSmartMicroChart.destroy();
			this.oSpy.restore();
		}
	});

	QUnit.test("_createInnerChart works correctly in case of not supported 'ChartType'", function(assert) {
		//Arrange
		this.oSmartMicroChart._oChartViewMetadata = {
			chartType: "scatter",
			annotation: {
				ChartType: {
					EnumMember: "UiVoca/Scatter"
				}
			}
		};
		//Act
		this.oSmartMicroChart._createInnerChart();
		//Assert
		assert.ok(!this.oSmartMicroChart.getAggregation("_chart"));
		assert.ok(this.oSpy.calledOnce);
	});

	QUnit.test("_createInnerChart works correctly in case of not correct 'chartType.EnumMember'", function(assert) {
		//Arrange
		this.oSmartMicroChart._oChartViewMetadata = {
			chartType: "line",	// AreaChart is mapped to LineChart
			annotation: {
				ChartType: {
					EnumMember: {}
				}
			}
		};
		//Act
		this.oSmartMicroChart._createInnerChart();
		//Assert
		assert.ok(!this.oSmartMicroChart.getAggregation("_chart"));
		assert.ok(this.oSpy.calledOnce);
	});

	QUnit.test("_createInnerChart works correctly in case of LineChart mapping but not Area'", function(assert) {
		//Arrange
		this.oSmartMicroChart._oChartViewMetadata = {
			chartType: "line",	// AreaChart is mapped to LineChart
			annotation: {
				ChartType: {
					EnumMember: "UiVoca/Scatter"
				}
			}
		};
		//Act
		this.oSmartMicroChart._createInnerChart();
		//Assert
		assert.ok(!this.oSmartMicroChart.getAggregation("_chart"));
		assert.ok(this.oSpy.calledOnce);
	});

	QUnit.test("_createInnerChart works correctly in case of Line ChartType", function(assert) {
		//Arrange
		var oMock = {
			chartType: "line",
			annotation: {
				ChartType: {
					EnumMember: "UiVoca/Line"
				}
			}
		};
		var oSpyBuild = sinon.spy(this.oSmartMicroChart, "_buildSmartLineMicroChart");
		this.oSmartMicroChart._oChartViewMetadata = oMock;
		//Act
		this.oSmartMicroChart._createInnerChart();
		//Assert
		assert.ok(oSpyBuild.calledOnce, "_buildSmartLineMicroChart has been created in case of ChartType 'Line'");
		assert.ok(this.oSmartMicroChart.getAggregation("_chart"), "_buildSmartLineMicroChart has been added to the aggregation");
	});

	QUnit.module("_createInnerChartFromDataPoint", {
		beforeEach: function() {
			this.oSmartMicroChart = new SmartMicroChart({
				entitySet: "Products"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

			this.oBuildSpy = oSandbox.spy(this.oSmartMicroChart, "_buildSmartBulletMicroChart");
			this.oLogSpy = oSandbox.spy(Log, "error");
		},
		afterEach: function() {
			oSandbox.restore();
			this.oSmartMicroChart.destroy();
		}
	});

	QUnit.test("_buildSmartBulletMicroChart called when type BULLET", function(assert) {
		//Arrange
		var oDataPoint = {
			Visualization: {
				EnumMember: SmartMicroChartBase._BULLET
			}
		};

		this.oSmartMicroChart._createInnerChartFromDataPoint(oDataPoint);

		assert.ok(this.oBuildSpy.calledOnce, "function was called once");
		assert.notOk(this.oLogSpy.called, "error log was not called");
	});

	QUnit.test("_buildSmartBulletMicroChart called when type DELTABULLET", function(assert) {
		//Arrange
		var oDataPoint = {
			Visualization: {
				EnumMember: SmartMicroChartBase._DELTABULLET
			}
		};

		this.oSmartMicroChart._createInnerChartFromDataPoint(oDataPoint);

		assert.ok(this.oBuildSpy.calledOnce, "function was called once");
		assert.notOk(this.oLogSpy.called, "error log was not called");
	});

	QUnit.test("_buildSmartBulletMicroChart not when type other", function(assert) {
		//Arrange
		var oDataPoint = {
			Visualization: {
				EnumMember: "other"
			}
		};

		this.oSmartMicroChart._createInnerChartFromDataPoint(oDataPoint);

		assert.notOk(this.oBuildSpy.called, "function was not called");
		assert.ok(this.oLogSpy.called, "error log was called");
	});


	QUnit.module("Delegation of association", {
		beforeEach: function() {
			this.oTitleLabel = new Label("TitleLabel");
			this.oDescriptionLabel = new Label("DescriptionLabel");
			this.oUnitOfMeasureLabel = new Label("UnitOfMeasureLabel");
			this.oFreeText = new Label("FreeTextLabel");
			this.oSmartMicroChart = new SmartMicroChart({
				entitySet: "Products",
				chartTitle: this.oTitleLabel,
				chartDescription: this.oDescriptionLabel,
				unitOfMeasure: this.oUnitOfMeasureLabel,
				freeText: this.oFreeText
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();
			this.oSpy = sinon.spy(Log, "error");
		},
		afterEach: function() {
			this.oSmartMicroChart.destroy();
			this.oTitleLabel.destroy();
			this.oDescriptionLabel.destroy();
			this.oUnitOfMeasureLabel.destroy();
			this.oFreeText.destroy();
			this.oSpy.restore();
		}
	});

	QUnit.test("Title, Description and UnitOfMeasure in case of SmartBulletMicroChart", function(assert) {
		//Arrange
		this.oSmartMicroChart._oChartViewMetadata = {
			chartType: "bullet",
			annotation: {
				ChartType: {
					EnumMember: "UiVoca/Bullet"
				}
			}
		};
		//Act
		this.oSmartMicroChart._createInnerChart();
		this.oSmartMicroChart.invalidate();
		sap.ui.getCore().applyChanges();
		//Assert
		var oInnerChart = this.oSmartMicroChart.getAggregation("_chart");
		assert.deepEqual(oInnerChart.getAssociation("chartTitle"), "TitleLabel");
		assert.deepEqual(oInnerChart.getAssociation("chartDescription"), "DescriptionLabel");
		assert.deepEqual(oInnerChart.getAssociation("unitOfMeasure"), "UnitOfMeasureLabel");
	});

	QUnit.test("Title, Description and UnitOfMeasure in case of SmartAreaMicroChart", function(assert) {
		//Arrange
		this.oSmartMicroChart._oChartViewMetadata = {
			chartType: "line",	// AreaChart is mapped to LineChart
			annotation: {
				ChartType: {
					EnumMember: "UiVoca/Area"
				}
			}
		};
		//Act
		this.oSmartMicroChart._createInnerChart();
		this.oSmartMicroChart.invalidate();
		sap.ui.getCore().applyChanges();
		//Assert
		var oInnerChart = this.oSmartMicroChart.getAggregation("_chart");
		assert.deepEqual(oInnerChart.getAssociation("chartTitle"), "TitleLabel");
		assert.deepEqual(oInnerChart.getAssociation("chartDescription"), "DescriptionLabel");
		assert.deepEqual(oInnerChart.getAssociation("unitOfMeasure"), "UnitOfMeasureLabel");
	});

	QUnit.test("Title, Description, UnitOfMeasure and FreeText in case of SmartRadialMicroChart", function(assert) {
		//Arrange
		this.oSmartMicroChart._oChartViewMetadata = {
			chartType: "donut",
			annotation: {
				ChartType: {
					EnumMember: "UiVoca/Donut"
				}
			}
		};

		//Act
		this.oSmartMicroChart._createInnerChart();
		this.oSmartMicroChart.invalidate();
		sap.ui.getCore().applyChanges();

		//Assert
		var oInnerChart = this.oSmartMicroChart.getAggregation("_chart");
		assert.deepEqual(oInnerChart.getAssociation("chartTitle"), "TitleLabel");
		assert.deepEqual(oInnerChart.getAssociation("chartDescription"), "DescriptionLabel");
		assert.deepEqual(oInnerChart.getAssociation("unitOfMeasure"), "UnitOfMeasureLabel");
		assert.deepEqual(oInnerChart.getAssociation("freeText"), "FreeTextLabel");
	});

	QUnit.module("Passing parent context to the child in case of using responsiveness for annotated charts", {
		beforeEach: function() {
			this.oSmartMicroChart = new SmartMicroChart({
				entitySet: "Products",
				isResponsive: true
			});
			this.oSmartMicroChart._oChartViewMetadata = {
				chartType: "bullet",
				annotation: {
					ChartType: {
						EnumMember: "UiVoca/Bullet"
					}
				}
			};
		},
		afterEach: function() {
			this.oSmartMicroChart.destroy();
			sap.suite.ui.microchart._passParentContextToChild.restore();
		}
	});

	QUnit.test("Passing parent context from SmartMicroChart to SmartBulletMicroChart", function(assert) {
		//Arrange
		sinon.spy(sap.suite.ui.microchart, "_passParentContextToChild");
		//Act
		this.oSmartMicroChart._createInnerChart();
		this.oSmartMicroChart.onBeforeRendering();
		//Assert
		assert.ok(sap.suite.ui.microchart._passParentContextToChild.calledOnce, "The function that passes parent rendering context to the child has been called.");
	});

	QUnit.test("Passing parent context from SmartMicroChart to SmartAreaMicroChart", function(assert) {
		//Arrange
		sinon.spy(sap.suite.ui.microchart, "_passParentContextToChild");
		this.oSmartMicroChart._oChartViewMetadata.chartType = "area";
		this.oSmartMicroChart._oChartViewMetadata.annotation.ChartType.EnumMember = "UiVoca/Area";
		//Act
		this.oSmartMicroChart._createInnerChart();
		this.oSmartMicroChart.onBeforeRendering();
		//Assert
		assert.ok(sap.suite.ui.microchart._passParentContextToChild.calledOnce, "The function that passes parent rendering context to the child has been called.");
	});

	QUnit.test("Passing parent context from SmartMicroChart to SmartRadialMicroChart", function(assert) {
		//Arrange
		sinon.spy(sap.suite.ui.microchart, "_passParentContextToChild");
		this.oSmartMicroChart._oChartViewMetadata.chartType = "donut";
		this.oSmartMicroChart._oChartViewMetadata.annotation.ChartType.EnumMember = "UiVoca/Donut";
		//Act
		this.oSmartMicroChart._createInnerChart();
		this.oSmartMicroChart.onBeforeRendering();
		//Assert
		assert.ok(sap.suite.ui.microchart._passParentContextToChild.calledOnce, "The function that passes parent rendering context to the child has been called.");
	});

	QUnit.module("Qualifier Support", {
		beforeEach: function() {
			this.oMockServer = new MockServer({
				rootUri: "smartmicrochart.SmartMicroChart/"
			});
			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver"
			});
			this.oMockServer.start();
			this.oModel = new ODataModel("smartmicrochart.SmartMicroChart/", true);

			this.oSmartMicroChart = new SmartMicroChart({
				entitySet: "Products",
				customData: [new CustomData({
					key: "chartQualifier",
					value: "BulletChartQualifier"
				})]
			});
		},
		afterEach: function() {
			this.oMockServer.stop();
			this.oMockServer.destroy();
			this.oModel.destroy();
			this.oSmartMicroChart.destroy();
		}
	});

	QUnit.test("Qualifier is passed correctly to ChartProvider", function(assert) {
		//Arrange
		sinon.stub(this.oSmartMicroChart, "getModel").returns(new Model());
		//Act
		this.oSmartMicroChart._createChartProvider();
		//Assert
		assert.ok(this.oSmartMicroChart._oChartProvider, "ChartProvider was created successfully");
		assert.strictEqual(this.oSmartMicroChart._oChartProvider._sChartQualifier, "BulletChartQualifier", "chartQualifier was set in ChartProvider successfully");
	});

	QUnit.test("Qualifier is passed correctly to inner chart in case of SmartBulletMicroChart", function(assert) {
		//Arrange
		var done = assert.async();
		//Arrange
		this.oSmartMicroChart.attachInitialize(handleInit.bind(this));
		//Act
		this.oSmartMicroChart.setModel(this.oModel);
		sap.ui.getCore().applyChanges();

		//Assert
		function handleInit() {
			assert.deepEqual(this.oSmartMicroChart.getAggregation("_chart").data("chartQualifier"), "BulletChartQualifier", "chartQualifier was delegated to inner chart");
			done();
		}
	});

	QUnit.module("Rendering", {
		beforeEach: function() {
			this.oMockServer = new MockServer({
				rootUri: "smartmicrochart.SmartMicroChart/"
			});
			this.oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver"
			});
			this.oMockServer.start();
			this.oModel = new ODataModel("smartmicrochart.SmartMicroChart/", true);

			this.oSmartMicroChart = new SmartMicroChart({
				entitySet: "Products",
				customData: [new CustomData({
					key: "chartQualifier",
					value: "BulletChartQualifier"
				})]
			}).placeAt("qunit-fixture");
		},
		afterEach: function() {
			this.oMockServer.stop();
			this.oMockServer.destroy();
			this.oModel.destroy();
			this.oSmartMicroChart.destroy();
		}
	});

	QUnit.test("Css class is set when isResponsive", function(assert) {
		//Arrange
		var done = assert.async();
		//Arrange
		this.oSmartMicroChart.attachInitialize(handleInit.bind(this));
		//Act
		this.oSmartMicroChart.setModel(this.oModel);
		sap.ui.getCore().applyChanges();

		//Assert
		function handleInit() {
			this.oSmartMicroChart.setIsResponsive(false);

			sap.ui.getCore().applyChanges();

			assert.notOk(this.oSmartMicroChart.$().hasClass("sapSuiteUiSmartMicroChartResponsive"), "responsive class is not set");

			this.oSmartMicroChart.setIsResponsive(true);

			sap.ui.getCore().applyChanges();

			assert.ok(this.oSmartMicroChart.$().hasClass("sapSuiteUiSmartMicroChartResponsive"), "responsive class is set");

			done();
		}
	});

	QUnit.module("Handling of size and isResponsive", {
		beforeEach: function() {
			this.oSmartMicroChart = new SmartMicroChart({
				entitySet: "Products"
			}).placeAt("qunit-fixture");
			sap.ui.getCore().applyChanges();

		},
		afterEach: function() {
			this.oSmartMicroChart.destroy();
		}
	});

	QUnit.test("Setting size property to sap.m.Size.Responsive leads to isResponsive === true", function(assert) {
		//Arrange
		//Act
		this.oSmartMicroChart.setSize(Size.Responsive);
		//Assert
		assert.ok(this.oSmartMicroChart.getIsResponsive(), "Chart is in Responsive mode for size 'Responsive'");
	});


	QUnit.test("sap.m.Size.Responsive changed to sap.m.Size.L leads to isResponsive === false", function(assert) {
		//Arrange
		this.oSmartMicroChart.setSize(Size.Responsive);
		//Act
		this.oSmartMicroChart.setSize(Size.L);
		//Assert
		assert.notOk(this.oSmartMicroChart.getIsResponsive(), "Chart is in not Responsive mode for size 'L'");
	});

	QUnit.test("isResponsive true leads to size Responsive", function(assert) {
		//Arrange
		//Act
		this.oSmartMicroChart.setIsResponsive(true);
		//Assert
		assert.equal(this.oSmartMicroChart.getSize(), Size.Responsive, "Chart has size Responsive for isResponsive true'");
	});

	QUnit.test("isResponsive false sets size Auto", function(assert) {
		//Arrange
		this.oSmartMicroChart.setSize(Size.Responsive);
		//Act
		this.oSmartMicroChart.setIsResponsive(false);
		//Assert
		assert.equal(this.oSmartMicroChart.getSize(), Size.Auto, "Chart has size Auto for isResponsive false'");
	});

	QUnit.test("isResponsive false keeps size", function(assert) {
		//Arrange
		this.oSmartMicroChart.setSize(Size.L);
		//Act
		this.oSmartMicroChart.setIsResponsive(false);
		//Assert
		assert.equal(this.oSmartMicroChart.getSize(), Size.L, "Chart keeps size L'");
	});

	QUnit.start();
});
