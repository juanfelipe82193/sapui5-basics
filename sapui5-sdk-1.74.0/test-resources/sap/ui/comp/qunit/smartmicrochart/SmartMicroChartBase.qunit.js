/*global QUnit,sinon*/

sap.ui.require([
	"jquery.sap.global",
	"sap/ui/core/Control",
	"sap/ui/core/util/MockServer",
	"sap/ui/comp/smartmicrochart/SmartMicroChartBase",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/ui/model/json/JSONModel",
	"sap/m/Label",
	"sap/ui/core/format/DateFormat",
	"sap/ui/core/format/NumberFormat",
	"sap/base/Log"
], function (jQuery, Control, MockServer, SmartMicroChartBase, ODataModel, JSONModel, Label, DateFormat, NumberFormat, Log) {
	"use strict";

	//create mock prototype for SmartMicroChart
	var ChartPrototype = SmartMicroChartBase;
	ChartPrototype.prototype.getEntitySet = function () {
		return "entitySet";
	};
	ChartPrototype.prototype.getChartType = function () {
	};
	ChartPrototype.prototype.fireInitialize = function () {
	};
	ChartPrototype.prototype.getEnableAutoBinding = function () {
		return false;
	};
	ChartPrototype.prototype.getChartBindingPath = function () {
	};
	ChartPrototype.prototype._createAndBindInnerChart = function () {
	};
	ChartPrototype.prototype._getSupportedChartTypes = function () {
	};

	ChartPrototype.prototype._updateLabel = function () {
	};

	ChartPrototype.prototype._getLabelsMap = function () {
	};

	var oMockServer = new MockServer({
		rootUri: "smartmicrochart.SmartMicroChart/"
	});
	oMockServer.simulate("test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver/metadata.xml", {
		sMockdataBaseUrl: "test-resources/sap/ui/comp/demokit/sample/smartmicrochart/SmartMicroChart/exampleBase/mockserver"
	});
	oMockServer.start();

	QUnit.module("Function _hasMember", {
		beforeEach: function () {
			this.oChart = new ChartPrototype();
		}
	});

	QUnit.test("Empty object has single member", function (assert) {
		//Arrange
		//Act
		var bResult = this.oChart._hasMember({}, "a");
		//Assert
		assert.notOk(bResult);
	});

	QUnit.test("Empty object has nested member", function (assert) {
		//Arrange
		//Act
		var bResult = this.oChart._hasMember({}, "a.b");
		//Assert
		assert.notOk(bResult);
	});

	QUnit.test("Plain object has single member", function (assert) {
		//Arrange
		//Act
		var bResult = this.oChart._hasMember({a: false}, "a");
		//Assert
		assert.ok(bResult);
	});

	QUnit.test("Plain object has nested member", function (assert) {
		//Arrange
		//Act
		var bResult = this.oChart._hasMember({a: false}, "a.b");
		//Assert
		assert.notOk(bResult);
	});

	QUnit.test("Nested object has nested member", function (assert) {
		//Arrange
		//Act
		var bResult = this.oChart._hasMember({a: {b: undefined}}, "a.b");
		//Assert
		assert.ok(bResult);
	});

	QUnit.test("Nested object has nested member)", function (assert) {
		//Arrange
		//Act
		var bResult = this.oChart._hasMember({a: {b: {}}}, "a.b.c");
		//Assert
		assert.notOk(bResult);
	});

	QUnit.module("Function _initializeMetadata", {
		beforeEach: function () {
			this.oChart = new ChartPrototype();
			this.oChart._oChartProvider = {
				getChartViewMetadata: function () {
					return {};
				},
				getChartDataPointMetadata: function () {
					return {};
				}
			};
			sinon.stub(this.oChart, "_onMetadataInitialized");
		},
		afterEach: function () {
			this.oChart._onMetadataInitialized.restore();
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Metadata already initialized", function (assert) {
		//Arrange
		this.oChart._bIsInitialized = true;
		this.oChart._bMetaModelLoadAttached = true;

		//Act
		this.oChart._initializeMetadata.apply(this.oChart);

		//Assert
		assert.ok(this.oChart._onMetadataInitialized.notCalled, "Method _onMetadataInitialized is not called.");
	});

	QUnit.test("Metadata not yet initialized, an OData model is used and meta model load handler attached", function (assert) {
		//Arrange
		this.oChart._bIsInitialized = false;
		sinon.stub(this.oChart, "getModel").returns(new ODataModel("smartmicrochart.SmartMicroChart/", true));

		//Act
		this.oChart._initializeMetadata.apply(this.oChart);

		//Assert
		assert.ok(this.oChart._onMetadataInitialized.notCalled, "Method _onMetadataInitialized is not called.");
	});

	QUnit.test("Metadata not yet initialized, no model is attached", function (assert) {
		//Arrange
		this.oChart._bIsInitialized = false;
		this.oChart._bMetaModelLoadAttached = false;

		//Act
		this.oChart._initializeMetadata.apply(this.oChart);

		//Assert
		assert.ok(this.oChart._onMetadataInitialized.notCalled, "Method _onMetadataInitialized is not called.");
	});

	QUnit.test("Metadata not yet initialized, the attached model is no OData model", function (assert) {
		//Arrange
		this.oChart._bIsInitialized = false;
		this.oChart._bMetaModelLoadAttached = false;
		sinon.stub(this.oChart, "getModel").returns({
			getMetadata: function () {
				return {
					getName: function () {
					}
				};
			}
		});

		//Act
		this.oChart._initializeMetadata.apply(this.oChart);

		//Assert
		assert.ok(this.oChart._onMetadataInitialized.calledOnce, "Method _onMetadataInitialized is called once.");
	});

	QUnit.module("Function _onMetadataInitialized", {
		beforeEach: function () {
			this.oChart = new ChartPrototype();
			this.oChart._oChartProvider = {
				getChartViewMetadata: function () {
					return {};
				},
				getChartDataPointMetadata: function () {
					return {};
				}
			};
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("ChartProvider has been created", function (assert) {
		//Arrange
		sinon.spy(this.oChart, "_createAndBindInnerChart");
		sinon.stub(this.oChart, "_checkChartMetadata").returns(true);
		sinon.stub(this.oChart, "_checkDataPointAnnotation").returns(true);

		//Act
		this.oChart._onMetadataInitialized.apply(this.oChart);

		//Assert
		assert.ok(this.oChart._bIsInitialized, "Chart variable _bIsInitialized has been set correctly.");
		assert.ok(this.oChart._createAndBindInnerChart.calledOnce, "Function _createAndBindInnerChart has been called once.");

		this.oChart._checkChartMetadata.restore();
		this.oChart._checkDataPointAnnotation.restore();
	});

	QUnit.test("With Qualifier given", function (assert) {
		//Arrange
		sinon.spy(this.oChart, "_createAndBindInnerChart");
		sinon.stub(this.oChart, "_getDataPointQualifier").returns("Poo");
		sinon.stub(this.oChart._oChartProvider, "getChartDataPointMetadata").returns({
			additionalAnnotations: {Poo: {}}
		});
		sinon.stub(this.oChart, "_checkChartMetadata").returns(true);
		sinon.stub(this.oChart, "_checkDataPointAnnotation").returns(true);

		//Act
		this.oChart._onMetadataInitialized.apply(this.oChart);

		//Assert
		assert.ok(this.oChart._bIsInitialized, "Chart variable _bIsInitialized has been set correctly.");
		assert.ok(this.oChart._createAndBindInnerChart.calledOnce, "Function _createAndBindInnerChart has been called once.");

		this.oChart._checkChartMetadata.restore();
		this.oChart._checkDataPointAnnotation.restore();
		this.oChart._getDataPointQualifier.restore();
	});

	QUnit.test("Auto binding - binding context set", function (assert) {
		//Arrange
		sinon.stub(this.oChart, "getEnableAutoBinding").returns(true);
		sinon.stub(this.oChart, "getChartBindingPath").returns("/somePath");
		sinon.spy(this.oChart, "bindElement");

		//Action
		this.oChart._onMetadataInitialized.apply(this.oChart);

		//Assert
		assert.ok(this.oChart.bindElement.calledWith("/somePath"), "Chart has been bound to correct path.");
	});

	QUnit.module("Function _createChartProvider", {
		beforeEach: function () {
			this.oChart = new ChartPrototype();
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Without a model", function (assert) {
		//Arrange
		sinon.stub(this.oChart, "getModel").returns(undefined);

		//Act
		this.oChart._createChartProvider.apply(this.oChart);

		//Assert
		assert.notOk(this.oChart._oChartProvider, "No ChartProvider has been set.");
	});

	QUnit.test("With a model and entitySetName", function (assert) {
		//Arrange
		var oModel;
		sinon.stub(this.oChart, "getModel").returns(oModel = new ODataModel("smartmicrochart.SmartMicroChart/", true));
		sinon.stub(this.oChart, "getEntitySet").returns("Products");
		sinon.stub(this.oChart, "data").withArgs("chartQualifier").returns("DonutChartDataPoint");
		var done = assert.async();

		//Act
		oModel.getMetaModel().loaded().then(function () {
			this.oChart._createChartProvider.apply(this.oChart);

			//Assert
			assert.ok(this.oChart._oChartProvider, "A ChartProvider has been set.");
			done();
		}.bind(this));
	});

	QUnit.test("Function _getPropertyAnnotation", function (assert) {
		//Arrange
		var oModel;
		sinon.stub(this.oChart, "getModel").returns(oModel = new ODataModel("smartmicrochart.SmartMicroChart/", true));
		sinon.stub(this.oChart, "getEntitySet").returns("Sales");
		sinon.stub(this.oChart, "data").withArgs("chartQualifier").returns("DonutChartDataPoint");
		var done = assert.async();

		//Act
		oModel.getMetaModel().loaded().then(function () {
			this.oChart._createChartProvider.apply(this.oChart);
			var oResult = this.oChart._getPropertyAnnotation.apply(this.oChart, ["Sold"]);

			//Assert
			assert.equal(oResult["MEASURES.ISOCurrency"].Path, "Unit", "The correct path has been retrieved from the property annotations.");
			done();
		}.bind(this));
	});

	QUnit.module("Function _checkChartMetadata", {
		beforeEach: function () {
			this.oChart = new ChartPrototype();
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("No metadata", function (assert) {
		//Arrange
		this.oChart._oChartViewMetadata = {};
		this.oChart._oDataPointMetadata = null;
		var oSpyLog = sinon.spy(Log, "error");

		//Action
		var bReturn = this.oChart._checkChartMetadata.apply(this.oChart);

		//Assert
		assert.notOk(bReturn, "Metadata was successfully identified as invalid.");
		assert.ok(oSpyLog.calledOnce, "Function Log.error has been called once.");
		assert.equal(oSpyLog.firstCall.args[0], "DataPoint annotation must be provided if chart annotation is missing.", "Function Log.error has been called correctly.");

		oSpyLog.restore();
	});

	QUnit.test("Invalid metadata", function (assert) {
		//Arrange
		this.oChart._oChartViewMetadata = {};
		this.oChart._oChartViewMetadata.fields = null;
		this.oChart._oDataPointMetadata = {data: null};
		var oSpyLog = sinon.spy(Log, "error");

		//Action
		var bReturn = this.oChart._checkChartMetadata.apply(this.oChart);

		//Assert
		assert.notOk(bReturn, "Metadata was successfully identified as invalid.");
		assert.ok(oSpyLog.calledOnce, "Function Log.error has been called once.");
		assert.equal(oSpyLog.firstCall.args[0], "No fields exist in the metadata.");

		oSpyLog.restore();
	});

	QUnit.test("Invalid annotations", function (assert) {
		//Arrange
		this.oChart._oChartViewMetadata = {
			annotation: {},
			fields: [
				{
					name: "Day"
				}
			]
		};
		this.oChart._oDataPointMetadata = null;
		var oSpyLog = sinon.spy(Log, "error");

		//Action
		var bReturn = this.oChart._checkChartMetadata.apply(this.oChart);
		//Assert
		assert.notOk(bReturn, "Metadata was successfully identified as invalid.");
		assert.ok(oSpyLog.calledOnce, "Function Log.error has been called once.");
		assert.equal(oSpyLog.firstCall.args[0], "The Chart annotation is invalid.", "Function Log.error has been called correctly.");

		oSpyLog.restore();
	});

	QUnit.test("Invalid chartType", function (assert) {
		//Arrange
		//Arrange
		this.oChart._oChartViewMetadata = {
			annotation: {
				ChartType: {EnumMember: "com.sap.vocabularies.UI.v1.ChartType/Klaus Kleber"}
			},
			fields: [
				{
					name: "Day"
				}
			]
		};
		sinon.stub(this.oChart, "_getSupportedChartTypes").returns(["Donut"]);
		this.oChart._oDataPointMetadata = null;
		var oSpyLog = sinon.spy(Log, "error");

		//Action
		var bReturn = this.oChart._checkChartMetadata.apply(this.oChart);
		//Assert
		assert.notOk(bReturn, "Metadata was successfully identified as invalid.");
		assert.ok(oSpyLog.calledOnce, "Function Log.error has been called once.");
		assert.equal(oSpyLog.firstCall.args[0], "The ChartType property in the Chart annotation is not part of the list of valid types: \"Donut\".", "Function Log.error has been called correctly.");

		oSpyLog.restore();
	});

	QUnit.test("Valid chartType", function (assert) {
		//Arrange
		this.oChart._oChartViewMetadata = {
			annotation: {
				ChartType: {EnumMember: "com.sap.vocabularies.UI.v1.ChartType/Line"}
			},
			fields: [
				{
					name: "Day"
				}
			]
		};
		sinon.stub(this.oChart, "_getSupportedChartTypes").returns(["Area", "Line"]);
		this.oChart._oDataPointMetadata = null;
		var oSpyLog = sinon.spy(Log, "error");

		//Action
		var bReturn = this.oChart._checkChartMetadata.apply(this.oChart);
		//Assert
		assert.ok(bReturn, "Metadata was successfully identified as valid.");
		assert.ok(oSpyLog.notCalled, "Function Log.error has not been called.");

		oSpyLog.restore();
	});

	QUnit.test("Function _checkChartType", function (assert) {
		//Arrange
		this.oChart._oChartViewMetadata = {
			annotation: {
				ChartType: {EnumMember: "com.sap.vocabularies.UI.v1.ChartType/Line"}
			}
		};
		sinon.stub(this.oChart, "_getSupportedChartTypes").returns(["Area", "Line"]);
		//Action
		var bReturn = this.oChart._checkChartType.apply(this.oChart);
		//Assert
		assert.ok(bReturn, "The ChartType of annotation is valid");
	});

	QUnit.test("Function _checkChartType error message", function (assert) {
		//Arrange
		this.oChart._oChartViewMetadata = {
			annotation: {
				ChartType: {EnumMember: "com.sap.vocabularies.UI.v1.ChartType/Bullet"}
			}
		};
		sinon.stub(this.oChart, "_getSupportedChartTypes").returns(["Area", "Line"]);
		var oSpyLog = sinon.spy(Log, "error");
		//Action
		var bReturn = this.oChart._checkChartType.apply(this.oChart);
		//Assert
		assert.notOk(bReturn, "The ChartType of annotation is not valid");
		assert.equal(oSpyLog.firstCall.args[0], "The ChartType property in the Chart annotation is not part of the list of valid types: \"Area,Line\".", "The Function _checkChartType error message log is right");

		oSpyLog.restore();
	});

	QUnit.module("Function _checkDataPointAnnotation", {
		beforeEach: function () {
			this.oChart = new ChartPrototype();
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Valid annotations", function (assert) {
		//Arrange
		sinon.spy(this.oChart, "_checkCriticalityMetadata");
		sinon.spy(Log, "error");
		this.oChart._oChartViewMetadata = {data: null};

		//Action
		var bReturn = this.oChart._checkDataPointAnnotation.bind(this.oChart)({
			Value: {
				Path: "MyValue"
			}
		});

		//Assert
		assert.ok(bReturn, "Data Point Annotations were successfully identified as valid.");
		assert.ok(this.oChart._checkCriticalityMetadata.calledOnce, "Spy oSpyCheckCriticalityMetadata has been called once.");
		assert.ok(Log.error.notCalled, "Function Log.error has not been called.");

		Log.error.restore();
		this.oChart._checkCriticalityMetadata.restore();
	});

	QUnit.test("Empty annotations", function (assert) {
		//Arrange
		var oSpyLog = sinon.spy(Log, "error");
		this.oChart._oChartViewMetadata = {data: null};

		//Action
		var bReturn = this.oChart._checkDataPointAnnotation.bind(this.oChart)({});
		//Assert
		assert.notOk(bReturn, "Data Point Annotations were successfully identified as invalid.");
		assert.ok(oSpyLog.calledOnce, "Function Log.error has been called once.");
		assert.equal(oSpyLog.firstCall.args[0], "The DataPoint annotation is empty. Please check it!", "Function Log.error has been called correctly.");

		oSpyLog.restore();
	});

	QUnit.test("Missing Value annotation", function (assert) {
		//Arrange
		var oSpyLog = sinon.spy(Log, "error");
		this.oChart._oChartViewMetadata = {data: null};

		//Action
		var bReturn = this.oChart._checkDataPointAnnotation.bind(this.oChart)({
			TargetValue: {}
		}, {data: null});
		//Assert
		assert.notOk(bReturn, "Data Point Annotations were successfully identified as invalid.");
		assert.ok(oSpyLog.calledOnce, "Function Log.error has been called once.");
		assert.equal(oSpyLog.firstCall.args[0], "The Value property does not exist in the DataPoint annotation. This property is essential for creating the smart chart.", "Function Log.error has been called correctly.");

		oSpyLog.restore();
	});

	QUnit.module("Function _getDataPointQualifier", {
		beforeEach: function () {
			this.oChart = new ChartPrototype();
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Valid annotation data", function (assert) {
		this.oChart._oChartViewMetadata = {
			annotation: {
				MeasureAttributes: [{
					DataPoint: {AnnotationPath: "@com.sap.vocabularies.UI.v1.DataPoint#DonutChartDataPoint"}
				}]
			}
		};

		var sQualifier = this.oChart._getDataPointQualifier.apply(this.oChart);
		assert.equal(sQualifier, "DonutChartDataPoint", "The qualifier of datapoint in annotations was extracted successfully.");
	});

	QUnit.test("Invalid annotation data", function (assert) {
		this.oChart._oChartViewMetadata = {
			annotation: {
				MeasureAttributes: [{
					DataPoint: {AnnotationPath: "SomePath"}
				}]
			}
		};

		var sQualifier = this.oChart._getDataPointQualifier.apply(this.oChart);
		assert.notOk(sQualifier, "The return value is correct.");
	});

	QUnit.test("Invalid annotation data - Empty MeasureAttributes", function (assert) {
		this.oChart._oChartViewMetadata = {
			annotation: {
				MeasureAttributes: []
			}
		};

		var sQualifier = this.oChart._getDataPointQualifier.apply(this.oChart);
		assert.notOk(sQualifier, "The return value is correct.");
	});

	QUnit.module("Function _checkCriticalityMetadata", {
		beforeEach: function () {
			this.oChart = new ChartPrototype();
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Direction Minimize", function (assert) {
		//Arrange
		var oCriticality = {
			ImprovementDirection: {
				EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize"
			}
		};
		var oSpyCheckMinimize = sinon.spy(this.oChart, "_checkCriticalityMetadataForMinimize");

		//Action
		this.oChart._checkCriticalityMetadata(oCriticality);

		//Assert
		assert.ok(oSpyCheckMinimize.calledOnce, "Function _checkCriticalityMetadataForMinimize has been called once.");

		oSpyCheckMinimize.restore();
	});

	QUnit.test("Minimize - correct metadata", function (assert) {
		//Arrange
		var oCriticality = {
			ToleranceRangeHighValue: {
				Path: "Bla"
			},
			DeviationRangeHighValue: {
				Path: "Bla"
			}
		};

		//Action
		var bResult = this.oChart._checkCriticalityMetadataForMinimize(oCriticality);

		//Assert
		assert.ok(bResult, "Function _checkCriticalityMetadataForMinimize has returned the correct result.");
	});

	QUnit.test("Minimize - incorrect metadata - wrong ToleranceRangeHighValue", function (assert) {
		//Arrange
		var oCriticality = {
			ToleranceRangeHighValue: {
				Decimal: "100"
			}
		};

		//Action
		var bResult = this.oChart._checkCriticalityMetadataForMinimize(oCriticality);

		//Assert
		assert.notOk(bResult, "Function _checkCriticalityMetadataForMinimize has returned the correct result.");
	});

	QUnit.test("Minimize - incorrect metadata - wrong DeviationRangeHighValue", function (assert) {
		//Arrange
		var oCriticality = {
			ToleranceRangeHighValue: {
				Path: "Bla"
			},
			DeviationRangeHighValue: {}
		};

		//Action
		var bResult = this.oChart._checkCriticalityMetadataForMinimize(oCriticality);

		//Assert
		assert.notOk(bResult, "Function _checkCriticalityMetadataForMinimize has returned the correct result.");
	});

	QUnit.test("Direction Maximize", function (assert) {
		//Arrange
		var oCriticality = {
			ImprovementDirection: {
				EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize"
			}
		};
		var oSpyCheckMaximize = sinon.spy(this.oChart, "_checkCriticalityMetadataForMaximize");

		//Action
		this.oChart._checkCriticalityMetadata(oCriticality);

		//Assert
		assert.ok(oSpyCheckMaximize.calledOnce, "Function _checkCriticalityMetadataForMaximize has been called once.");

		oSpyCheckMaximize.restore();
	});

	QUnit.test("Maximize - correct metadata", function (assert) {
		//Arrange
		var oCriticality = {
			ToleranceRangeLowValue: {
				Path: "Bla"
			},
			DeviationRangeLowValue: {
				Path: "Bla"
			}
		};

		//Action
		var bResult = this.oChart._checkCriticalityMetadataForMaximize(oCriticality);

		//Assert
		assert.ok(bResult, "Function _checkCriticalityMetadataForMaximize has returned the correct result.");
	});

	QUnit.test("Maximize - incorrect metadata - wrong ToleranceRangeLowValue", function (assert) {
		//Arrange
		var oCriticality = {
			ToleranceRangeLowValue: {
				Decimal: "100"
			}
		};

		//Action
		var bResult = this.oChart._checkCriticalityMetadataForMaximize(oCriticality);

		//Assert
		assert.notOk(bResult, "Function _checkCriticalityMetadataForMaximize has returned the correct result.");
	});

	QUnit.test("Maximize - incorrect metadata - wrong DeviationRangeLowValue", function (assert) {
		//Arrange
		var oCriticality = {
			ToleranceRangeLowValue: {
				Path: "Bla"
			},
			DeviationRangeLowValue: {}
		};

		//Action
		var bResult = this.oChart._checkCriticalityMetadataForMaximize(oCriticality);

		//Assert
		assert.notOk(bResult, "Function _checkCriticalityMetadataForMaximize has returned the correct result.");
	});

	QUnit.test("Direction Target", function (assert) {
		//Arrange
		var oCriticality = {
			ImprovementDirection: {
				EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Target"
			}
		};
		var oSpyCheckTarget = sinon.spy(this.oChart, "_checkCriticalityMetadataForTarget");

		//Action
		this.oChart._checkCriticalityMetadata(oCriticality);

		//Assert
		assert.ok(oSpyCheckTarget.calledOnce, "Function _checkCriticalityMetadataForTarget has been called once.");

		oSpyCheckTarget.restore();
	});

	QUnit.test("Target - correct metadata", function (assert) {
		//Arrange
		var oCriticality = {
			ToleranceRangeLowValue: {
				Path: "Bla"
			},
			DeviationRangeLowValue: {
				Path: "Bla"
			},
			ToleranceRangeHighValue: {
				Path: "Bla"
			},
			DeviationRangeHighValue: {
				Path: "Bla"
			}
		};

		//Action
		var bResult = this.oChart._checkCriticalityMetadataForTarget(oCriticality);

		//Assert
		assert.ok(bResult, "Function _checkCriticalityMetadataForTarget has returned the correct result.");
	});

	QUnit.test("Target - incorrect metadata - missing ToleranceRangeLowValue", function (assert) {
		//Arrange
		var oCriticality = {};

		//Action
		var bResult = this.oChart._checkCriticalityMetadataForTarget(oCriticality);

		//Assert
		assert.notOk(bResult, "Function _checkCriticalityMetadataForTarget has returned the correct result.");
	});

	QUnit.test("Test function _checkCriticalityMetadataForTarget - incorrect metadata - missing ToleranceRangeHighValue", function (assert) {
		//Arrange
		var oCriticality = {
			ToleranceRangeLowValue: {
				Path: "Bla"
			}
		};

		//Action
		var bResult = this.oChart._checkCriticalityMetadataForTarget(oCriticality);

		//Assert
		assert.notOk(bResult, "Function _checkCriticalityMetadataForTarget has returned the correct result.");
	});

	QUnit.test("Target - incorrect metadata - missing DeviationRangeLowValue", function (assert) {
		//Arrange
		var oCriticality = {
			ToleranceRangeLowValue: {
				Path: "Bla"
			},
			ToleranceRangeHighValue: {
				Path: "Bla"
			}
		};

		//Action
		var bResult = this.oChart._checkCriticalityMetadataForTarget(oCriticality);

		//Assert
		assert.notOk(bResult, "Function _checkCriticalityMetadataForTarget has returned the correct result.");
	});

	QUnit.test("Target - incorrect metadata - missing DeviationRangeHighValue", function (assert) {
		//Arrange
		var oCriticality = {
			ToleranceRangeLowValue: {
				Path: "Bla"
			},
			ToleranceRangeHighValue: {
				Path: "Bla"
			},
			DeviationRangeLowValue: {
				Path: "Bla"
			}
		};

		//Action
		var bResult = this.oChart._checkCriticalityMetadataForTarget(oCriticality);

		//Assert
		assert.notOk(bResult, "Function _checkCriticalityMetadataForTarget has returned the correct result.");
	});

	QUnit.test("Error logging 1", function (assert) {
		//Arrange
		var oCriticality = {
			ImprovementDirection: {}
		};
		var oSpyWarning = sinon.spy(Log, "warning");

		//Action
		this.oChart._checkCriticalityMetadata(oCriticality);

		//Assert
		assert.ok(oSpyWarning.calledOnce, "Log function has been called once.");
		assert.ok(oSpyWarning.calledWith("The ImprovementDirection property in DataPoint annotation is not provided."), "Correct warning message has been logged.");

		oSpyWarning.restore();
	});

	QUnit.test("Error logging 2", function (assert) {
		//Arrange
		var oCriticality = {
			ImprovementDirection: {
				EnumMember: "Ich bin eine Biene!"
			}
		};
		var oSpyWarning = sinon.spy(Log, "warning");

		//Action
		this.oChart._checkCriticalityMetadata(oCriticality);

		//Assert
		assert.ok(oSpyWarning.calledOnce, "Log function has been called once.");
		assert.equal(oSpyWarning.firstCall.args[0], "The improvement direction in DataPoint annotation must be either Minimize, Maximize or Target.", "Correct warning message has been logged.");

		oSpyWarning.restore();
	});

	QUnit.module("Function _mapCriticalityTypeWithColor", {
		beforeEach: function () {
			this.oChart =  new ChartPrototype();
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Criticality given as string", function (assert) {
		assert.deepEqual(this.oChart._mapCriticalityTypeWithColor("Positive"), "Good", "Positive mapped correctly to 'Good'.");
	});

	QUnit.test("Criticality given as EnumMember", function (assert) {
		var sResult = this.oChart._mapCriticalityTypeWithColor("com.sap.vocabularies.UI.v1.CriticalityType/Positive");
		assert.deepEqual(sResult, "Good", "'com.sap.vocabularies.UI.v1.CriticalityType/Positive' mapped correctly to 'Good'.");
	});

	QUnit.test("Criticality given as number - Positive", function (assert) {
		assert.deepEqual(this.oChart._mapCriticalityTypeWithColor(3), "Good", "'3' mapped correctly to 'Good'.");
	});
	QUnit.test("Criticality given as number - Critical", function (assert) {
		assert.deepEqual(this.oChart._mapCriticalityTypeWithColor(2), "Critical", "'2' mapped correctly to 'Critical'.");
	});
	QUnit.test("Criticality given as number - Negative", function (assert) {
		assert.deepEqual(this.oChart._mapCriticalityTypeWithColor(1), "Error", "'1' mapped correctly to 'Error'.");
	});

	QUnit.test("Criticality given as number string", function (assert) {
		assert.deepEqual(this.oChart._mapCriticalityTypeWithColor("3"), "Good", "'3' mapped correctly to 'Good'.");
	});

	QUnit.test("Default to Neutral", function (assert) {
		assert.deepEqual(this.oChart._mapCriticalityTypeWithColor(), "Neutral", "Invalid parameter is mapped to Neutral.");
		assert.deepEqual(this.oChart._mapCriticalityTypeWithColor("Ultra Wichtig!"), "Neutral", "Invalid parameter is mapped to Neutral.");
	});

	QUnit.module("Function _getAnnotation", {
		beforeEach: function () {
			this.oChart = new ChartPrototype();
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Get annotation for invalid association", function (assert) {
		//Act
		var oAnnot = this.oChart._getAnnotation.apply(this.oChart, ["someOtherAssociation"]);

		//Assert
		assert.ok(jQuery.isEmptyObject(oAnnot));
	});

	QUnit.test("Get annotation for association without DataPointAnnotations", function (assert) {
		//Arrange

		//Act
		var oAnnot = this.oChart._getAnnotation.apply(this.oChart, ["chartTitle"]);

		//Assert
		assert.ok(jQuery.isEmptyObject(oAnnot));
	});

	QUnit.test("Get annotation for association with empty ISOCurrency annotation", function (assert) {
		//Arrange
		this.oChart._oChartViewMetadata = {
			annotation: {}
		};
		this.oChart._oDataPointAnnotations = {
			Value: {
				Path: ""
			}
		};
		sinon.stub(this.oChart, "_getPropertyAnnotation").returns({
			ISOCurrency: {}
		});
		sinon.spy(this.oChart, "_getValueFromPropertyAnnotation");

		//Act
		var oAnnot = this.oChart._getAnnotation.apply(this.oChart, ["unitOfMeasure"]);

		//Assert
		assert.ok(jQuery.isEmptyObject(oAnnot));
		assert.ok(this.oChart._getValueFromPropertyAnnotation.calledOnce);

		this.oChart._getPropertyAnnotation.restore();
		this.oChart._getValueFromPropertyAnnotation.restore();
	});

	QUnit.test("Get annotations for associations", function (assert) {
		//Arrange
		this.oChart._oChartViewMetadata = {
			annotation: {
				Title: {
					Path: "MyTitle"
				},
				Description: {
					Path: "MyDescription"
				}
			}
		};
		this.oChart._oDataPointAnnotations = {
			Value: {
				Path: ""
			}
		};
		sinon.stub(this.oChart, "_getPropertyAnnotation").returns({
			ISOCurrency: {
				Path: "MyUnitOfMeasure"
			},
			Label: {
				Path: "MyFreeText"
			}
		});

		//Act
		var oAnnotTitle = this.oChart._getAnnotation.apply(this.oChart, ["chartTitle"]);
		var oAnnotDesp = this.oChart._getAnnotation.apply(this.oChart, ["chartDescription"]);
		var oAnnotUOM = this.oChart._getAnnotation.apply(this.oChart, ["unitOfMeasure"]);
		var oAnnotFreeText = this.oChart._getAnnotation.apply(this.oChart, ["freeText"]);

		//Assert
		assert.equal(oAnnotTitle.Path, "MyTitle");
		assert.equal(oAnnotDesp.Path, "MyDescription");
		assert.equal(oAnnotUOM.Path, "MyUnitOfMeasure");
		assert.equal(oAnnotFreeText.Path, "MyFreeText");

		this.oChart._getPropertyAnnotation.restore();
	});

	QUnit.module("Function _updateAssociation", {
		beforeEach: function () {
			this.oChart = new ChartPrototype();
			this.oChart.setModel(new JSONModel({
				MyTitle: "Title",
				MyUnitOfMeasure: "Euro"
			}));
			this.oChart.bindElement("/");
			this.oChart._oChartViewMetadata = {
				annotation: {
					Title: {
						Path: "MyTitle"
					},
					Description: {
						String: "Description"
					}
				}
			};
			this.oChart._oDataPointAnnotations = {
				Value: {
					Path: "SomePath"
				}
			};
			sinon.stub(this.oChart, "_getPropertyAnnotation").returns({
				ISOCurrency: {
					Path: "MyUnitOfMeasure"
				},
				Label: {
					String: "Hello there!"
				}
			});
			sinon.stub(this.oChart.getMetadata(), "hasAssociation").returns(true);

			this.oLabel = new Label("MyLabel", {text: "DefaultText"});
			this.oLabel.setModel(this.oChart.getModel());
			this.oLabel.bindElement("/");
		},
		afterEach: function () {
			this.oChart._getPropertyAnnotation.restore();
			this.oChart.getMetadata().hasAssociation.restore();
			this.oChart.destroy();
			this.oLabel.destroy();
			this.oChart = null;
			this.oLabel = null;
		}
	});

	QUnit.test("chartTitle update - bound title", function (assert) {
		//Arrange
		sinon.stub(this.oChart, "getAssociation").withArgs("chartTitle").returns("MyLabel");

		//Act
		this.oChart._updateAssociation.apply(this.oChart, ["chartTitle"]);

		//Assert
		assert.equal(this.oLabel.getText(), "Title");
	});

	QUnit.test("chartDescription update - direct description", function (assert) {
		//Arrange
		sinon.stub(this.oChart, "getAssociation").withArgs("chartDescription").returns("MyLabel");

		//Act
		this.oChart._updateAssociation.apply(this.oChart, ["chartDescription"]);

		//Assert
		assert.equal(this.oLabel.getText(), "Description");
	});

	QUnit.test("unitOfMeasure update - bound unitOfMeasure", function (assert) {
		//Arrange
		sinon.stub(this.oChart, "getAssociation").withArgs("unitOfMeasure").returns("MyLabel");
		sinon.spy(this.oLabel, "invalidate");

		//Act
		this.oChart._updateAssociation.apply(this.oChart, ["unitOfMeasure"]);

		//Assert
		assert.equal(this.oLabel.getText(), "Euro");
		assert.ok(this.oLabel.invalidate.called, "In case of non OData Model it is needed to call invalidate on the label instance");
	});

	QUnit.test("freeText update - direct freeText", function (assert) {
		//Arrange
		sinon.stub(this.oChart, "getAssociation").withArgs("freeText").returns("MyLabel");

		//Act
		this.oChart._updateAssociation.apply(this.oChart, ["freeText"]);

		//Assert
		assert.equal(this.oLabel.getText(), "Hello there!");
	});

	QUnit.test("chartTitle update - using model name", function (assert) {
		//Arrange
		sinon.spy(this.oLabel, "invalidate");
		this.oLabel.setModel(this.oChart.getModel(), "namedModel");
		this.oLabel.bindElement("namedModel>/");
		sinon.stub(this.oChart, "getAssociation").withArgs("chartTitle").returns("MyLabel");
		this.oChart._oChartViewMetadata = {
			annotation: {
				Title: {
					String: "{namedModel>MyTitle}"
				}
			}
		};

		//Act
		this.oChart._updateAssociation.apply(this.oChart, ["chartTitle"]);

		//Assert
		assert.equal(this.oLabel.getText(), "Title");
		assert.ok(this.oLabel.invalidate.called, "In case of non OData Model it is needed to call invalidate on the label instance");
	});

	QUnit.test("Call of _updateAssociation on _updateAssociations", function (assert) {
		//Arrange
		sinon.spy(this.oChart, "_updateAssociation");
		sinon.stub(this.oChart, "getAssociation").withArgs("chartTitle").returns("MyLabel");
		this.oChart._oChartViewMetadata = {
			annotation: {
				Title: {
					Path: "MyTitle"
				}
			}
		};

		//Act
		this.oChart._updateAssociations.apply(this.oChart);

		//Assert
		assert.equal(this.oLabel.getText(), "Title");
		assert.equal(this.oChart._updateAssociation.callCount, 4);
		assert.ok(this.oChart._updateAssociation.calledWith("chartTitle"));

		this.oChart._updateAssociation.restore();
	});

	QUnit.test("With predefined data to be used", function (assert) {
		//Arrange
		sinon.spy(this.oChart, "_updateAssociation");
		sinon.stub(this.oChart, "getAssociation").withArgs("chartTitle").returns("MyLabel");
		this.oChart._oChartViewMetadata = {
			annotation: {
				Title: {
					Path: "MyTitle"
				}
			}
		};
		var oData = {
			MyTitle: "This is a title"
		};
		var oBinding = {
			getContexts: function() {
				return [{
					getObject: function() {
						return oData;
					}
				}];
			}
		};

		//Act
		this.oChart._updateAssociations(oBinding);

		//Assert
		assert.equal(this.oLabel.getText(), "This is a title");
		assert.ok(this.oChart._updateAssociation.calledWith("chartTitle", oData));

		this.oChart._updateAssociation.restore();
	});

	QUnit.module("Function _updateChartLabels", {
		beforeEach: function () {
			this.oChart = new ChartPrototype();
			this.oChart._oChartViewMetadata = {
				dimensionFields: ["Day", "Day"],
				measureFields: ["Price", "Price2"]
			};

			this.oChart._aDataPointAnnotations = [
				{
					Value: {
						Path: "Price"
					}
				},
				{
					Value: {
						Path: "Price2"
					}
				}
			];
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("updateChartLabels find min and max values", function (assert) {
		var oModel = new JSONModel({
			items: [
				{
					Day: 1,
					Price: 0,
					Price2: 10
				},
				{
					Day: 2,
					Price: 25,
					Price2: 30
				},
				{
					Day: 3,
					Price: 10,
					Price2: 20
				}
			]
		});
		var oBinding = {
			getContexts: function() {
				return [
					oModel.getContext("/items/0"),
					oModel.getContext("/items/1"),
					oModel.getContext("/items/2")
				];
			}
		};

		sinon.stub(this.oChart, "_getLabelsMap").returns("");
		sinon.stub(this.oChart, "_updateTopLabel");
		sinon.stub(this.oChart, "_updateBottomLabel");

		this.oChart.updateChartLabels.call(this.oChart, oBinding);

		assert.equal(this.oChart._updateTopLabel.args[0][2], 0, "left top label called with correct index");
		assert.equal(this.oChart._updateTopLabel.args[1][2], 1, "right top label icalled with correct index");
		assert.equal(this.oChart._updateBottomLabel.args[0][2], 0, "left bottom label called with correct index");
		assert.equal(this.oChart._updateBottomLabel.args[1][2], 0, "right bottom label icalled with correct index");

		oModel.destroy();
		this.oChart._getLabelsMap.restore();
		this.oChart._updateTopLabel.restore();
		this.oChart._updateBottomLabel.restore();
	});

	QUnit.test("updateChartLabels wont fail with no data contexts", function (assert) {
		var oBinding = {
			getContexts: function() {
				return [];
			}
		};

		sinon.stub(this.oChart, "_updateTopLabel");
		sinon.stub(this.oChart, "_updateBottomLabel");

		this.oChart.updateChartLabels.call(this.oChart, oBinding);

		assert.ok(this.oChart._updateTopLabel.notCalled, "update top label not called");
		assert.ok(this.oChart._updateBottomLabel.notCalled, "update bottom label not called");

		this.oChart._updateTopLabel.restore();
		this.oChart._updateBottomLabel.restore();
	});

	QUnit.test("Get instance of the number formatter", function (assert) {
		//Act
		sinon.stub(this.oChart, "_getPropertyAnnotation").returns({
			precision: 2
		});
		var oFormatter = this.oChart._getLabelNumberFormatter();
		//Assert
		assert.ok(oFormatter instanceof NumberFormat, "Returns a number formatter instance");
		this.oChart._getPropertyAnnotation.restore();
	});

	QUnit.test("Get instance of the date formatter", function (assert) {
		//Act
		var oFormatter = this.oChart._getLabelDateFormatter();
		//Assert
		assert.ok(oFormatter instanceof DateFormat, "Returns a date formatter instance");
	});

	QUnit.test("Update chart top labels", function (assert) {
		//Arrange
		var oData = {Price: "20000"};
		sinon.stub(this.oChart, "_getPropertyAnnotation").returns({
			precision: 2
		});
		var oStub = sinon.stub(this.oChart, "getAggregation");
		oStub.withArgs("_chart").returns(this.oChart);
		sinon.stub(this.oChart, "_getTopLabelColor").returns("Neutral");
		sinon.spy(this.oChart, "_updateLabel");

		//Act
		this.oChart._updateTopLabel.apply(this.oChart, ["firstYLabel", oData, 0]);
		var oNumberFormatter = NumberFormat.getInstance({
			style: "short",
			showScale: true,
			precision: 2
		});
		var sValue = oNumberFormatter.format(oData.Price);
		//Assert
		assert.ok(this.oChart._updateLabel.calledOnce, "Function _updateLabel has been called once");
		assert.equal(this.oChart._updateLabel.args[0][0], "firstYLabel", "_updateLabel is called for firstYLabel");
		assert.deepEqual(this.oChart._updateLabel.args[0][1], {text: sValue, color: "Neutral"}, "_updateLabel called with correct params");
		//Restore
		oStub.restore();
		this.oChart._getTopLabelColor.restore();
		this.oChart._getPropertyAnnotation.restore();
		this.oChart._updateLabel.restore();
	});

	QUnit.test("Update chart bottom labels", function (assert) {
		//Arrange
		var oData = {Day: new Date(1470037368000)};
		sinon.stub(this.oChart, "_getPropertyAnnotation").returns({
			precision: 2
		});
		var oStub = sinon.stub(this.oChart, "getAggregation");
		oStub.withArgs("_chart").returns(this.oChart);
		sinon.spy(this.oChart, "_updateLabel");
		//Act
		this.oChart._updateBottomLabel.apply(this.oChart, ["firstXLabel", oData, 0]);
		var oDateFormatter = DateFormat.getInstance({
			style: "short"
		});
		var sValue = oDateFormatter.format(oData.Day);
		//Assert
		assert.ok(this.oChart._updateLabel.calledOnce, "Function setProperty has been called once");
		assert.equal(this.oChart._updateLabel.args[0][0], "firstXLabel", "_updateLabel is called for firstXLabel");
		assert.deepEqual(this.oChart._updateLabel.args[0][1], {text: sValue}, "_updateLabel called with correct params");
		this.oChart._getPropertyAnnotation.restore();
		this.oChart._updateLabel.restore();
	});

	QUnit.test("When sap:text(V2) is available in property's annotations", function (assert) {
		//Arrange
		sinon.stub(this.oChart, "_getPropertyAnnotation").returns({
			precision: 2,
			"sap:text": "DateLabel"
		});
		var oData = {DateLabel: "A custom label"};
		var oStub = sinon.stub(this.oChart, "getAggregation");
		oStub.withArgs("_chart").returns(this.oChart);
		sinon.spy(this.oChart, "_updateLabel");
		//Act
		this.oChart._updateBottomLabel.apply(this.oChart, ["firstXLabel", oData, 0]);
		var sValue = "A custom label";
		//Assert
		assert.ok(this.oChart._updateLabel.calledOnce, "Function setProperty has been called once");
		assert.equal(this.oChart._updateLabel.args[0][0], "firstXLabel", "_updateLabel is called for firstXLabel");
		assert.deepEqual(this.oChart._updateLabel.args[0][1], {text: sValue}, "_updateLabel called with correct params");
		this.oChart._getPropertyAnnotation.restore();
		this.oChart._updateLabel.restore();
	});

	QUnit.test("When Common.Text(V4) is available in property's annotations", function (assert) {
		//Arrange
		sinon.stub(this.oChart, "_getPropertyAnnotation").returns({
			precision: 2,
			"com.sap.vocabularies.Common.v1.Text": {Path: "DateLabel"}
		});

		var oData = {DateLabel: "A custom label"};
		var oStub = sinon.stub(this.oChart, "getAggregation");
		oStub.withArgs("_chart").returns(this.oChart);
		sinon.spy(this.oChart, "_updateLabel");
		//Act
		this.oChart._updateBottomLabel.apply(this.oChart, ["firstXLabel", oData, 0]);
		var sValue = "A custom label";
		//Assert
		assert.ok(this.oChart._updateLabel.calledOnce, "Function setProperty has been called once");
		assert.equal(this.oChart._updateLabel.args[0][0], "firstXLabel", "_updateLabel is called for firstXLabel");
		assert.deepEqual(this.oChart._updateLabel.args[0][1], {text: sValue}, "_updateLabel called with correct params");
		this.oChart._updateLabel.restore();
		this.oChart._getPropertyAnnotation.restore();
	});

	QUnit.test("Function _formatBottomLabel (semantics pattern)", function (assert) {
		//Arrange
		sinon.stub(this.oChart, "_getSemanticsPattern").returns("yyyyMMdd");
		sinon.spy(this.oChart, "_formatSemanticsValue");
		var oAnnotation = {};
		//Act
		this.oChart._formatBottomLabel.call(this.oChart, "20110101", oAnnotation);
		//Assert
		assert.ok(this.oChart._formatSemanticsValue.calledOnce, "The semantic pattern has been returned and used");
		//Restore
		this.oChart._getSemanticsPattern.restore();
		this.oChart._formatSemanticsValue.restore();
	});

	QUnit.test("Function _formatBottomLabel (calendar pattern)", function (assert) {
		//Arrange
		sinon.stub(this.oChart, "_getCalendarPattern").returns("yyyyMMdd");
		sinon.spy(this.oChart, "_formatSemanticsValue");
		var oAnnotation = {};
		//Act
		this.oChart._formatBottomLabel.call(this.oChart, "20110101", oAnnotation);
		//Assert
		assert.ok(this.oChart._formatSemanticsValue.calledOnce, "The semantic pattern has been returned and used");
		//Restore
		this.oChart._getCalendarPattern.restore();
		this.oChart._formatSemanticsValue.restore();
	});

	QUnit.test("Function _formatBottomLabel (no pattern)", function (assert) {
		//Arrange
		sinon.stub(this.oChart, "_getPropertyAnnotation").returns({
			precision: 2
		});
		sinon.spy(this.oChart, "_formatDateAndNumberValue");
		var oAnnotation = {};
		//Act
		this.oChart._formatDateAndNumberValue.call(this.oChart, "123456", oAnnotation);
		//Assert
		assert.ok(this.oChart._formatDateAndNumberValue.calledOnce, "The value is handled according to its type");
		//Restore
		this.oChart._formatDateAndNumberValue.restore();
		this.oChart._getPropertyAnnotation.restore();
	});

	QUnit.test("Function _getSemanticsPattern", function (assert) {
		//Arrange
		var oAnnotation = {
			"sap:semantics": "yearmonthday"
		};
		//Act
		var sPattern = this.oChart._getSemanticsPattern(oAnnotation);
		//Assert
		assert.equal(sPattern, "yyyyMMdd", "The correct pattern has been returned");
	});

	QUnit.test("Formatter for string type with sap:semantics='yearmonthday'", function (assert) {
		//Arrange
		var sValue = "20161010";
		var sPattern = "yyyyMMdd";
		//Act
		var sFormattedValue = this.oChart._formatSemanticsValue(sValue, sPattern);
		//Assert
		assert.notEqual(sFormattedValue, sValue, "The string has been formatted"); // We do not exactly check formatted value because different locations have different date formats
	});

	QUnit.test("Formatter for string type with sap:semantics='yearmonth'", function (assert) {
		//Arrange
		var sValue = "201610";
		var sPattern = "yyyyMM";
		//Act
		var sFormattedValue = this.oChart._formatSemanticsValue(sValue, sPattern);
		//Assert
		assert.notEqual(sFormattedValue, sValue, "The string has been formatted");
	});

	QUnit.test("Formatter for string type with sap:semantics='year'", function (assert) {
		//Arrange
		var sValue = "2016";
		var sPattern = "yyyy";
		//Act
		var sFormattedValue = this.oChart._formatSemanticsValue(sValue, sPattern);
		//Assert
		assert.notEqual(sFormattedValue, sValue, "The string has been formatted");
	});

	QUnit.test("Function _getCalendarPattern", function (assert) {
		//Arrange
		var oAnnotation = {
			"com.sap.vocabularies.Common.v1.IsCalendarYear": {}
		};
		//Act
		var sPattern = this.oChart._getCalendarPattern(oAnnotation);
		//Assert
		assert.equal(sPattern, "yyyy", "The correct pattern has been returned");
	});

	QUnit.test("Formatter for date type", function (assert) {
		//Arrange
		var oDate = new Date(1470037368000);
		//Act
		var sFormattedValue = this.oChart._formatDateAndNumberValue.call(this.oChart, oDate);
		//Assert
		assert.notOk(sFormattedValue instanceof Date, "The date has been formatted");
	});

	QUnit.test("Formatter for number type", function (assert) {
		//Arrange
		var iValue = 123456;
		sinon.stub(this.oChart, "_getPropertyAnnotation").returns({
			precision: 2
		});

		//Act
		var sFormattedValue = this.oChart._formatDateAndNumberValue.call(this.oChart, iValue);

		//Assert
		assert.ok(typeof sFormattedValue === "string", "The number has been formatted");

		//Restore
		this.oChart._getPropertyAnnotation.restore();
	});

	QUnit.module("Function _getThresholdValues", {
		beforeEach: function () {
			this.oChart =  new ChartPrototype();

			var oData = {
				DeviationLow: 10,
				DeviationHigh: 110
			};
			this.oDummy = {
				getBindingContext: function () {
					return {
						getProperty: function (sProp) {
							return oData[sProp];
						}
					};
				}
			};
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("All correct thresholds - Decimal and Path in annotations", function (assert) {
		//Arrange
		var oCC = {
			DeviationRangeLowValue: {
				Path: "DeviationLow"
			},
			ToleranceRangeLowValue: {
				Decimal: "40"
			},
			ToleranceRangeHighValue: {
				Decimal: "60"
			},
			DeviationRangeHighValue: {
				Path: "DeviationHigh"
			}
		};

		//Action
		var oThresholds = this.oChart._getThresholdValues.apply(this.oDummy, [oCC]);

		//Assert
		assert.equal(oThresholds.DeviationRangeLowValue, 10, "Function _getThresholdValue retrieved correct value for DeviationRangeLowValue.");
		assert.equal(oThresholds.ToleranceRangeLowValue, 40, "Function _getThresholdValue retrieved correct value for ToleranceRangeLowValue.");
		assert.equal(oThresholds.ToleranceRangeHighValue, 60, "Function _getThresholdValue retrieved correct value for ToleranceRangeHighValue.");
		assert.equal(oThresholds.DeviationRangeHighValue, 110, "Function _getThresholdValue retrieved correct value for DeviationRangeHighValue.");
	});

	QUnit.test("Fallback to 0 for single values", function (assert) {
		//Arrange
		var oCC = {
			DeviationRangeHighValue: {}
		};

		//Action
		var oThresholds = this.oChart._getThresholdValues.apply(this.oDummy, [oCC]);

		//Assert
		assert.equal(oThresholds.DeviationRangeHighValue, 0, "Function _getThresholdValue retrieved correct value for DeviationRangeHighValue.");
	});

	QUnit.module("Function _getValueColor", {
		beforeEach: function () {
			this.oChart =  new ChartPrototype();
			sinon.spy(this.oChart, "_mapCriticalityTypeWithColor");

			this.oChart._oDataPointAnnotations = {
				CriticalityCalculation: {
					ImprovementDirection: {
						EnumMember: SmartMicroChartBase._MINIMIZE
					}
				}
			};
		},
		afterEach: function () {
			this.oChart._mapCriticalityTypeWithColor.restore();
			this.oChart.destroy();
		}
	});

	QUnit.test("No criticality or value", function (assert) {
		//Arrange

		//Act
		var sColor = this.oChart._getValueColor(undefined, null);

		//Assert
		assert.ok(this.oChart._mapCriticalityTypeWithColor.calledOnce, "Function _mapCriticalityTypeWithColor has not been called.");
		assert.equal(sColor, "Neutral", "Fallback to Neutral color for invalid parameters is correct.");
	});

	QUnit.test("Direct criticality", function (assert) {
		//Arrange

		//Act
		var sColor = this.oChart._getValueColor(undefined, "Negative");

		//Assert
		assert.ok(this.oChart._mapCriticalityTypeWithColor.calledOnce, "Function _mapCriticalityTypeWithColor has not been called.");
		assert.equal(sColor, "Error", "Direct criticality has been correctly mapped to color.");
	});

	QUnit.test("Criticality Calculation - use direct criticality first", function (assert) {
		//Arrange

		//Act
		var sColor = this.oChart._getValueColor(100, "Critical");

		//Assert
		assert.ok(this.oChart._mapCriticalityTypeWithColor.calledOnce, "Function _mapCriticalityTypeWithColor has not been called.");
		assert.equal(sColor, "Critical", "Direct criticality has been correctly mapped to color.");
	});

	QUnit.module("Function _getValueColor - Minimize", {
		beforeEach: function () {
			this.oChart =  new ChartPrototype();
			sinon.spy(this.oChart, "_mapCriticalityTypeWithColor");

			sinon.stub(this.oChart, "_getThresholdValues").returns({
				DeviationRangeLowValue: 10,
				ToleranceRangeLowValue: 40,
				ToleranceRangeHighValue: 60,
				DeviationRangeHighValue: 100
			});

			this.oChart._oDataPointAnnotations = {
				CriticalityCalculation: {
					ImprovementDirection: {
						EnumMember: SmartMicroChartBase._MINIMIZE
					}
				}
			};
		},
		afterEach: function () {
			this.oChart._getThresholdValues.restore();
			this.oChart._mapCriticalityTypeWithColor.restore();
			this.oChart.destroy();
		}
	});

	QUnit.test("Criticality Calculation - minimize without thresholds", function (assert) {
		//Arrange
		sinon.spy(this.oChart, "_getValueColorForMinimize");
		this.oChart._getThresholdValues.returns({});

		//Act
		var sColor = this.oChart._getValueColor(100);

		//Assert
		assert.ok(this.oChart._mapCriticalityTypeWithColor.calledOnce, "Function _mapCriticalityTypeWithColor has been called once.");
		assert.ok(this.oChart._getValueColorForMinimize.calledOnce, "Function _getValueColorForMinimize has been called once.");
		assert.equal(sColor, "Neutral", "Correct fallback.");

		this.oChart._getValueColorForMinimize.restore();
	});

	QUnit.test("Criticality Calculation - minimize with thresholds - good color", function (assert) {
		//Arrange
		sinon.spy(this.oChart, "_getValueColorForMinimize");

		//Act
		var sColor = this.oChart._getValueColor(50);

		//Assert
		assert.ok(this.oChart._mapCriticalityTypeWithColor.calledOnce, "Function _mapCriticalityTypeWithColor has been called once.");
		assert.ok(this.oChart._getValueColorForMinimize.calledOnce, "Function _getValueColorForMinimize has been called once.");
		assert.equal(sColor, "Good", "Correct color.");

		this.oChart._getValueColorForMinimize.restore();
	});

	QUnit.test("Criticality Calculation - minimize with thresholds - critical color", function (assert) {
		//Arrange
		//Act
		var sColor = this.oChart._getValueColor(75);

		//Assert
		assert.equal(sColor, "Critical", "Correct color.");
	});


	QUnit.test("Criticality Calculation - minimize with thresholds - error color", function (assert) {
		//Arrange
		//Act
		var sColor = this.oChart._getValueColor(110);

		//Assert
		assert.equal(sColor, "Error", "Correct color.");
	});

	QUnit.module("Function _getValueColor - Maximize", {
		beforeEach: function () {
			this.oChart =  new ChartPrototype();
			sinon.spy(this.oChart, "_mapCriticalityTypeWithColor");

			sinon.stub(this.oChart, "_getThresholdValues").returns({
				DeviationRangeLowValue: 10,
				ToleranceRangeLowValue: 40,
				ToleranceRangeHighValue: 60,
				DeviationRangeHighValue: 100
			});

			this.oChart._oDataPointAnnotations = {
				CriticalityCalculation: {
					ImprovementDirection: {
						EnumMember: SmartMicroChartBase._MAXIMIZE
					}
				}
			};

		},
		afterEach: function () {
			this.oChart._getThresholdValues.restore();
			this.oChart._mapCriticalityTypeWithColor.restore();
			this.oChart.destroy();
		}
	});

	QUnit.test("Criticality Calculation - Maximize without thresholds", function (assert) {
		//Arrange
		sinon.spy(this.oChart, "_getValueColorForMaximize");
		this.oChart._getThresholdValues.returns({});

		//Act
		var sColor = this.oChart._getValueColor(100);

		//Assert
		assert.ok(this.oChart._mapCriticalityTypeWithColor.calledOnce, "Function _mapCriticalityTypeWithColor has been called once.");
		assert.ok(this.oChart._getValueColorForMaximize.calledOnce, "Function _getValueColorForMaximize has been called once.");
		assert.equal(sColor, "Neutral", "Correct fallback.");

		this.oChart._getValueColorForMaximize.restore();
	});

	QUnit.test("Criticality Calculation - Maximize with thresholds - good color", function (assert) {
		//Arrange
		sinon.spy(this.oChart, "_getValueColorForMaximize");

		//Act
		var sColor = this.oChart._getValueColor(50);

		//Assert
		assert.ok(this.oChart._mapCriticalityTypeWithColor.calledOnce, "Function _mapCriticalityTypeWithColor has been called once.");
		assert.ok(this.oChart._getValueColorForMaximize.calledOnce, "Function _getValueColorForMaximize has been called once.");
		assert.equal(sColor, "Good", "Correct color.");

		this.oChart._getValueColorForMaximize.restore();
	});

	QUnit.test("Criticality Calculation - Maximize with thresholds - critical color", function (assert) {
		//Arrange
		//Act
		var sColor = this.oChart._getValueColor(30);

		//Assert
		assert.equal(sColor, "Critical", "Correct color.");
	});


	QUnit.test("Criticality Calculation - Maximize with thresholds - error color", function (assert) {
		//Arrange
		//Act
		var sColor = this.oChart._getValueColor(5);

		//Assert
		assert.equal(sColor, "Error", "Correct color.");
	});

	QUnit.module("Function _getValueColor - Target", {
		beforeEach: function () {
			this.oChart =  new ChartPrototype();
			sinon.spy(this.oChart, "_mapCriticalityTypeWithColor");

			sinon.stub(this.oChart, "_getThresholdValues").returns({
				DeviationRangeLowValue: 10,
				ToleranceRangeLowValue: 40,
				ToleranceRangeHighValue: 60,
				DeviationRangeHighValue: 100
			});

			this.oChart._oDataPointAnnotations = {
				CriticalityCalculation: {
					ImprovementDirection: {
						EnumMember: SmartMicroChartBase._TARGET
					}
				}
			};

		},
		afterEach: function () {
			this.oChart._getThresholdValues.restore();
			this.oChart._mapCriticalityTypeWithColor.restore();
			this.oChart.destroy();
		}
	});

	QUnit.test("Criticality Calculation - Target without thresholds", function (assert) {
		//Arrange
		sinon.spy(this.oChart, "_getValueColorForTarget");
		this.oChart._getThresholdValues.returns({});

		//Act
		var sColor = this.oChart._getValueColor(100);

		//Assert
		assert.ok(this.oChart._mapCriticalityTypeWithColor.calledOnce, "Function _mapCriticalityTypeWithColor has been called once.");
		assert.ok(this.oChart._getValueColorForTarget.calledOnce, "Function _getValueColorForTarget has been called once.");
		assert.equal(sColor, "Neutral", "Correct fallback.");

		this.oChart._getValueColorForTarget.restore();
	});

	QUnit.test("Criticality Calculation - Target with thresholds - good color", function (assert) {
		//Arrange
		sinon.spy(this.oChart, "_getValueColorForTarget");

		//Act
		var sColor = this.oChart._getValueColor(50);

		//Assert
		assert.ok(this.oChart._mapCriticalityTypeWithColor.calledOnce, "Function _mapCriticalityTypeWithColor has been called once.");
		assert.ok(this.oChart._getValueColorForTarget.calledOnce, "Function _getValueColorForTarget has been called once.");
		assert.equal(sColor, "Good", "Correct color.");

		this.oChart._getValueColorForTarget.restore();
	});

	QUnit.test("Criticality Calculation - Target with thresholds - critical color", function (assert) {
		//Arrange
		//Act
		var sColor = this.oChart._getValueColor(70);

		//Assert
		assert.equal(sColor, "Critical", "Correct color.");
	});


	QUnit.test("Criticality Calculation - Target with thresholds - error color", function (assert) {
		//Arrange
		//Act
		var sColor = this.oChart._getValueColor(110);

		//Assert
		assert.equal(sColor, "Error", "Correct color.");
	});

	QUnit.module("Function _getLabelNumberFormatter", {
		beforeEach: function () {
			this.oChart =  new ChartPrototype();
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Function returns NumberFormat Object", function (assert) {
		//Arrange
		sinon.stub(this.oChart, "_getPropertyAnnotation").returns({
			precision: 2
		});
		//Act
		var sDummyPath = "/ProductPrice";
		var oFormatter = this.oChart._getLabelNumberFormatter(sDummyPath);

		//Assert
		assert.ok(oFormatter instanceof NumberFormat, "Function returns correct Object");
		this.oChart._getPropertyAnnotation.restore();
	});

	QUnit.module("Function _getTopLabelColor - Target", {
		beforeEach: function () {
			this.oChart =  new ChartPrototype();
			this.oData = {
				PriceDeviationLowerBound: "0",
				PriceToleranceLowerBound: "10",
				PriceToleranceUpperBound: "30",
				PriceDeviationUpperBound: "50"
			};
			this.oChart._aDataPointAnnotations = [{
				CriticalityCalculation: {
					ImprovementDirection: {
						EnumMember: SmartMicroChartBase._TARGET
					},
					DeviationRangeHighValue: {
						Path: "PriceDeviationUpperBound"
					},
					DeviationRangeLowValue: {
						Path: "PriceDeviationLowerBound"
					},
					ToleranceRangeHighValue: {
						Path: "PriceToleranceUpperBound"
					},
					ToleranceRangeLowValue: {
						Path: "PriceToleranceLowerBound"
					}
				}
			}];
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("Criticality Calculation - Target with thresholds - good color", function (assert) {
		//Arrange
		sinon.spy(this.oChart, "_getValueColorForTarget");
		//Act
		var sColor = this.oChart._getTopLabelColor(20, this.oData, 0);
		//Assert
		assert.equal(sColor, "Good", "Correct color is calculated");
		assert.ok(this.oChart._getValueColorForTarget.calledOnce, "Function _getValueColorForTarget has been called once.");
		this.oChart._getValueColorForTarget.restore();
	});

	QUnit.test("Criticality Calculation - Target with thresholds - critical color", function (assert) {
		//Arrange
		sinon.spy(this.oChart, "_getValueColorForTarget");
		//Act
		var sColor = this.oChart._getTopLabelColor(40, this.oData, 0);
		//Assert
		assert.equal(sColor, "Critical", "Correct color is calculated");
		assert.ok(this.oChart._getValueColorForTarget.calledOnce, "Function _getValueColorForTarget has been called once.");
		this.oChart._getValueColorForTarget.restore();
	});

	QUnit.test("Criticality Calculation - Target with thresholds - error color", function (assert) {
		//Arrange
		sinon.spy(this.oChart, "_getValueColorForTarget");
		//Act
		var sColor = this.oChart._getTopLabelColor(60, this.oData, 0);
		//Assert
		assert.equal(sColor, "Error", "Correct color is calculated");
		assert.ok(this.oChart._getValueColorForTarget.calledOnce, "Function _getValueColorForTarget has been called once.");
		this.oChart._getValueColorForTarget.restore();
	});

	QUnit.module("Function _getTopLabelColor - Minimize", {
		beforeEach: function () {
			this.oChart =  new ChartPrototype();
			this.oData = {
				PriceDeviationLowerBound: "0",
				PriceToleranceLowerBound: "10",
				PriceToleranceUpperBound: "30",
				PriceDeviationUpperBound: "50"
			};

			this.oChart._aDataPointAnnotations = [{
				CriticalityCalculation: {
					ImprovementDirection: {
						EnumMember: SmartMicroChartBase._MINIMIZE
					},
					DeviationRangeHighValue: {
						Path: "PriceDeviationUpperBound"
					},
					DeviationRangeLowValue: {
						Path: "PriceDeviationLowerBound"
					},
					ToleranceRangeHighValue: {
						Path: "PriceToleranceUpperBound"
					},
					ToleranceRangeLowValue: {
						Path: "PriceToleranceLowerBound"
					}
				}
			}];
		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("Criticality Calculation - Minimize with thresholds - good color", function (assert) {
		//Arrange
		sinon.spy(this.oChart, "_getValueColorForMinimize");
		//Act
		var sColor = this.oChart._getTopLabelColor(20, this.oData, 0);
		//Assert
		assert.equal(sColor, "Good", "Correct color is calculated");
		assert.ok(this.oChart._getValueColorForMinimize.calledOnce, "Function _getValueColorForMinimize has been called once.");
		this.oChart._getValueColorForMinimize.restore();
	});

	QUnit.test("Criticality Calculation - Minimize with thresholds - critical color", function (assert) {
		//Arrange
		sinon.spy(this.oChart, "_getValueColorForMinimize");
		//Act
		var sColor = this.oChart._getTopLabelColor(40, this.oData, 0);
		//Assert
		assert.equal(sColor, "Critical", "Correct color is calculated");
		assert.ok(this.oChart._getValueColorForMinimize.calledOnce, "Function _getValueColorForMinimize has been called once.");
		this.oChart._getValueColorForMinimize.restore();
	});

	QUnit.test("Criticality Calculation - Minimize with thresholds - error color", function (assert) {
		//Arrange
		sinon.spy(this.oChart, "_getValueColorForMinimize");
		//Act
		var sColor = this.oChart._getTopLabelColor(60, this.oData, 0);
		//Assert
		assert.equal(sColor, "Error", "Correct color is calculated");
		assert.ok(this.oChart._getValueColorForMinimize.calledOnce, "Function _getValueColorForMinimize has been called once.");
		this.oChart._getValueColorForMinimize.restore();
	});

	QUnit.module("Function _getTopLabelColor - Maximize", {
		beforeEach: function () {
			this.oChart =  new ChartPrototype();
			this.oData = {
				PriceDeviationLowerBound: "0",
				PriceToleranceLowerBound: "10",
				PriceToleranceUpperBound: "30",
				PriceDeviationUpperBound: "50"
			};

			this.oChart._aDataPointAnnotations = [{
				CriticalityCalculation: {
					ImprovementDirection: {
						EnumMember: SmartMicroChartBase._MAXIMIZE
					},
					DeviationRangeHighValue: {
						Path: "PriceDeviationUpperBound"
					},
					DeviationRangeLowValue: {
						Path: "PriceDeviationLowerBound"
					},
					ToleranceRangeHighValue: {
						Path: "PriceToleranceUpperBound"
					},
					ToleranceRangeLowValue: {
						Path: "PriceToleranceLowerBound"
					}
				}
			}];

		},
		afterEach: function() {
			this.oChart.destroy();
		}
	});

	QUnit.test("Criticality Calculation - Maximize with thresholds - good color", function (assert) {
		//Arrange
		sinon.spy(this.oChart, "_getValueColorForMaximize");
		//Act
		var sColor = this.oChart._getTopLabelColor(20, this.oData, 0);
		//Assert
		assert.equal(sColor, "Good", "Correct color is calculated");
		assert.ok(this.oChart._getValueColorForMaximize.calledOnce, "Function _getValueColorForMaximize has been called once.");
		this.oChart._getValueColorForMaximize.restore();
	});

	QUnit.test("Criticality Calculation - Maximize with thresholds - critical color", function (assert) {
		//Arrange
		sinon.spy(this.oChart, "_getValueColorForMaximize");
		//Act
		var sColor = this.oChart._getTopLabelColor(5, this.oData, 0);
		//Assert
		assert.equal(sColor, "Critical", "Correct color is calculated");
		assert.ok(this.oChart._getValueColorForMaximize.calledOnce, "Function _getValueColorForMaximize has been called once.");
		this.oChart._getValueColorForMaximize.restore();
	});

	QUnit.test("Criticality Calculation - Maximize with thresholds - error color", function (assert) {
		//Arrange
		sinon.spy(this.oChart, "_getValueColorForMaximize");
		//Act
		var sColor = this.oChart._getTopLabelColor(-10, this.oData, 0);
		//Assert
		assert.equal(sColor, "Error", "Correct color is calculated");
		assert.ok(this.oChart._getValueColorForMaximize.calledOnce, "Function _getValueColorForMaximize has been called once.");
		this.oChart._getValueColorForMaximize.restore();
	});

	QUnit.module("Function _getAccessibilityInfo", {
		beforeEach: function () {
			this.oChart =  new ChartPrototype();
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Called in context of a SmartMicroChart, it returns the accessibility information of the underlying (inner) MicroChart", function (assert) {
		assert.expect(2);

		// Arrange
		var fnMicroChart = function () {
		};
		var oMicroChart = new fnMicroChart();
		var oExpectedAccessibilityInformation = {
			"type": "Type",
			"descrption": "Description"
		};

		fnMicroChart.prototype.getAccessibilityInfo = function () {
			assert.ok(true, "Called method getAccessibilityInfo of inner MicroChart");

			return oExpectedAccessibilityInformation;
		};
		this.oChart.getAggregation = function () {
			return oMicroChart;
		};
		// Act
		var oAccessibilityInformation = this.oChart.getAccessibilityInfo();

		// Assert
		assert.deepEqual(oAccessibilityInformation, oExpectedAccessibilityInformation, "Accessibility information of the inner MicroChart has been returned.");
	});


	QUnit.module("Function _getDataPointAnnotations", {
		beforeEach: function () {
			this.oChart =  new ChartPrototype();
		},
		afterEach: function () {
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Function returns one value", function (assert) {
		// Arrange
		var oDataPoint = {test: "test"};
		var aTestDataPoints = [oDataPoint];

		sinon.stub(this.oChart, "_getDataPointAnnotation").returns(oDataPoint);

		// Act
		var aDataPoints = this.oChart._getDataPointAnnotations();

		// Assert
		assert.deepEqual(aDataPoints, aTestDataPoints);

		// Clean
		this.oChart._getDataPointAnnotation.restore();
	});

	QUnit.test("Function returns multiple values", function (assert) {
		// Arrange
		var oDataPoint = {test: "test"};
		var aTestDataPoints = [oDataPoint, oDataPoint];
		this.oChart._oChartViewMetadata =  {measureFields: [1, 2]};

		sinon.stub(this.oChart, "_getDataPointAnnotation").returns(oDataPoint);

		// Act
		var aDataPoints = this.oChart._getDataPointAnnotations();

		// Assert
		assert.deepEqual(aDataPoints, aTestDataPoints);

		// Clean
		this.oChart._oChartViewMetadata = undefined;
		this.oChart._getDataPointAnnotation.restore();
	});

	QUnit.module("Function _getDataPointAnnotation", {
		beforeEach: function () {
			this.oChart =  new ChartPrototype();
			this.oChart._oDataPointMetadata = {
				primaryAnnotation: {obj: "primaryAnnotation"},
				additionalAnnotations: {
					"1": {obj: "1"}
				}
			};
		},
		afterEach: function () {
			this.oChart._oDataPointMetadata = undefined;
			this.oChart.destroy();
			this.oChart = null;
		}
	});

	QUnit.test("Function returns primaryAnnotation when no qualifier", function (assert) {
		// Arrange
		sinon.stub(this.oChart, "_getDataPointQualifier").returns("");

		// Act
		var oDataPoint = this.oChart._getDataPointAnnotation();

		// Assert
		assert.deepEqual(oDataPoint, this.oChart._oDataPointMetadata.primaryAnnotation);

		// Clean
		this.oChart._getDataPointQualifier.restore();
	});

	QUnit.test("Function returns primaryAnnotation when no qualifier", function (assert) {
		// Arrange
		sinon.stub(this.oChart, "_getDataPointQualifier").returns("1");

		// Act
		var oDataPoint = this.oChart._getDataPointAnnotation();

		// Assert
		assert.deepEqual(oDataPoint, this.oChart._oDataPointMetadata.additionalAnnotations["1"]);

		// Clean
		this.oChart._getDataPointQualifier.restore();
	});


	QUnit.start();
});
