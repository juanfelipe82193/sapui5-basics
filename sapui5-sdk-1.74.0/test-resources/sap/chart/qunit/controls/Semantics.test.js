/*global QUnit, $, d3, normal, time, timeYearmonthday */

QUnit.config.autostart = false;

sap.ui.require([
	"sap/chart/Chart",
	"sap/chart/ChartType",
	"sap/chart/TimeUnitType",
	"sap/chart/data/Measure",
	"sap/chart/data/MeasureSemantics",
	"sap/chart/data/Dimension",
	"sap/chart/data/TimeDimension",
	"sap/chart/utils/MeasureSemanticsUtils",
	"sap/chart/utils/RoleMapper",
	"sap/chart/utils/RoleFitter",
	"sap/ui/model/json/JSONModel"
], function(
	Chart,
	ChartType,
	TimeUnitType,
	Measure,
	MeasureSemantics,
	Dimension,
	TimeDimension,
	MeasureSemanticsUtils,
	RoleMapper,
	RoleFitter,
	JSONModel
) {
	"use strict";

	var createChart = function(config){
		var model = new JSONModel(config.url);

		var oChart = new Chart({
			chartType : "line",
			isAnalytical : true,
			width : "100%"
		});

		config.defaults.visibleDimensions.forEach(function(dimName){
			oChart.addDimension(dimName === 'Date' ?
			  new TimeDimension({name : dimName, projectedValueStartTime: 1420588800000, timeUnit: TimeUnitType.Date}) :
			  new Dimension({name : dimName}));
		});

		config.defaults.measures.forEach(function(measName){
			oChart.addMeasure(new Measure({
				name : measName,
				role : "axis1"
			}));
		});

		oChart.setModel(model);
		oChart.setVisibleDimensions(config.defaults.visibleDimensions);
		oChart.setVisibleMeasures(config.defaults.visibleMeasures);

		oChart.bindData({
			path : config.resultPath,
			parameters : {
				entitySet : config.resultSet,
				useBatchRequests : true,
				provideGrandTotals : true,
				provideTotalResultSize : true,
				noPaging : true
			}
		});

		return oChart;
	};

	var createLineChart = function(){
		var lineConfig = {
			url: normal,
			resultPath : '/businessData',
			resultSet : 'businessData',
			defaults: {
				visibleDimensions: [ "Sales_Quarter" ],
				visibleMeasures: [ "Cost", "Unit Price" ],
				measures : [ "Cost", "Unit Price", "Gross Profit" ]
			},
			credential: "eyJ1c2VyIjoiU1lTVEVNIiwicGFzcyI6IkJvMTIzNDU2In0="
		};
		return createChart(lineConfig);
	};

	var createTimeChart = function(visibleMeasures){
		var timeSemanticConfig =  {
		  url: time,
		  resultSet : "businessData",
		  resultPath : "/businessData",
		  defaults: {
			visibleDimensions : ["Date"],
			visibleMeasures : visibleMeasures || ["Actual", "Forecast"],
			measures :  ["Actual","Profit-Actual","Revenue-Actual","Profit-Target","Profit-Forecast","Revenue-Forecast","Revenue-Target","Forecast"]
		  }
		};
		var oChart = createChart(timeSemanticConfig);
		oChart.getMeasureByName('Actual').setSemanticallyRelatedMeasures({
			projectedValueMeasure : 'Forecast'
		});
		oChart.getMeasureByName("Forecast").setSemantics("projected");
		return oChart;
	};

	var createTimeChartWithYearmonthday = function(){
		var timeSemanticConfig =  {
		  url: timeYearmonthday,
		  resultSet : "businessData",
		  resultPath : "/businessData",
		  defaults: {
			visibleDimensions : ["Date"],
			visibleMeasures : ["Actual", "Forecast"],
			measures :  ["Actual","Profit-Actual","Revenue-Actual","Profit-Target","Profit-Forecast","Revenue-Forecast","Revenue-Target","Forecast"]
		  }
		};
		var oChart = createChart(timeSemanticConfig);
		oChart.getDimensionByName('Date').setTimeUnit(TimeUnitType.yearmonthday);
		oChart.getMeasureByName('Actual').setSemanticallyRelatedMeasures({
			projectedValueMeasure : 'Forecast'
		});
		oChart.getMeasureByName("Forecast").setSemantics("projected");
		return oChart;
	};

	function newMsr(cfg) {
		if (cfg && cfg.sem) {
			cfg.semantics = cfg.sem;
			delete cfg.sem;
		}

		if (cfg && cfg.rel) {
			cfg.semanticallyRelatedMeasures = {};
			if (cfg.rel.projected) {
				cfg.semanticallyRelatedMeasures.projectedValueMeasure = cfg.rel.projected;
			}
			if (cfg.rel.reference) {
				cfg.semanticallyRelatedMeasures.referenceValueMeasure = cfg.rel.reference;
			}
			delete cfg.rel;
		}

		return new Measure(cfg);
	}
	function newTimeDim(cfg){
		return new TimeDimension(cfg);
	}
	function newDim(cfg){
		return new Dimension(cfg);
	}

	QUnit.module("Semantics Data/Property transfer Test");

	QUnit.test("Semantics relation matching test", function(assert) {
		assert.equal(newMsr({
			name: "m1"
		}).getSemantics(), MeasureSemantics.Actual, "\"actual\" is the default semantics value for Measure");

		var m1, m2, m3;

		m1 = newMsr({
			name: "m1",
			sem: MeasureSemantics.Projected
		});
		m2 = newMsr({
			name: "m2",
			sem: MeasureSemantics.Actual,
			rel: {
				projected: "m1",
				reference: "m3"
			}
		});
		m3 = newMsr({
			name: "m3",
			sem: MeasureSemantics.Reference
		});

		assert.deepEqual(MeasureSemanticsUtils.getTuples([m1, m2, m3]), [{
			actual: "m2",
			projected: "m1",
			reference: "m3",
			index : 0,
			"order": [
			"actual",
			"projected",
			"reference"
			]
		}], "semantic and relation matched");

		m1 = newMsr({
			name: "m1",
			sem: MeasureSemantics.Reference
		});
		m2 = newMsr({
			name: "m2",
			sem: MeasureSemantics.Actual,
			rel: {
				projected: "m1",
				reference: "m3"
			}
		});
		m3 = newMsr({
			name: "m3",
			sem: MeasureSemantics.Reference
		});

		assert.deepEqual(MeasureSemanticsUtils.getTuples([m1, m2, m3]), [{
			actual: "m2",
			reference: "m3",
			index : 0,
			"order": [
			"actual",
			"projected",
			"reference"
			]
		}, {
			reference: "m1",
			index : 1,
			"order": [
			"actual",
			"projected",
			"reference"
			]
		}], "contradicting semantic and relation not matched");

		m1 = newMsr({
			name: "m1",
			sem: MeasureSemantics.Projected
		});
		m2 = newMsr({
			name: "m2",
			sem: MeasureSemantics.Actual,
			rel: {
				projected: "m1"
			}
		});
		m3 = newMsr({
			name: "m3",
			sem: MeasureSemantics.Actual,
			rel: {
				projected: "m1"
			}
		});

		assert.deepEqual(MeasureSemanticsUtils.getTuples([m1, m2, m3]), [{
			actual: "m2",
			projected: "m1",
			index : 0,
			"order": [
			"actual",
			"projected",
			"reference"
			]
		}, {
			actual: "m3",
			index : 1,
			"order": [
			"actual",
			"projected",
			"reference"
			]
		}], "racing semantic relation first win");
	});

	QUnit.test("Bullet semantics based feeding test", function(assert) {
		var m1, m2, m3, oFeeds;

		m1 = newMsr({
			name: "m1",
			sem: MeasureSemantics.Actual
		});
		m2 = newMsr({
			name: "m2",
			sem: MeasureSemantics.Actual
		});
		m3 = newMsr({
			name: "m3",
			sem: MeasureSemantics.Actual
		});

		oFeeds = {
			dims : {
				categoryAxis : []
			},
			msrs: {
				"@semanticBulletMsrs" : [m1, m2, m3]
			}
		};
		RoleMapper.semantics.semanticPatternMsrs(oFeeds, 'bullet');

		assert.equal(oFeeds.msrs.actualValues.length, 3, "Three measures should be feed as actualValues.");

		assert.deepEqual(oFeeds.msrs.actualValues.map(function(key){
			return key.getName();
		}), ['m1', 'm2', 'm3'], "feeding is generated from semantics");

		m1 = newMsr({
			name: "m1",
			sem: MeasureSemantics.Projected
		});
		m2 = newMsr({
			name: "m2",
			sem: MeasureSemantics.Actual,
			rel: {
				projected: "m1"
			}
		});
		m3 = newMsr({
			name: "m3",
			sem: MeasureSemantics.Reference
		});

		oFeeds = {
			dims : {
				categoryAxis : []
			},
			msrs: {
				"@semanticBulletMsrs" : [m1, m2, m3]
			}
		};
		RoleMapper.semantics.semanticPatternMsrs(oFeeds, 'bullet');

		assert.deepEqual(oFeeds.msrs.actualValues.map(function(key){
			return key.getName();
		}), ['m2', 'm1', 'm3'], "projected/reference measure should be feed as actualValues.");


		m1 = newMsr({
			name: "m1",
			sem: MeasureSemantics.Projected
		});
		m2 = newMsr({
			name: "m2",
			sem: MeasureSemantics.Actual,
			rel: {
				projected: "m1",
				reference : 'm3'
			}
		});
		m3 = newMsr({
			name: "m3",
			sem: MeasureSemantics.Reference
		});

		oFeeds = {
			dims : {
				categoryAxis : []
			},
			msrs: {
				"@semanticBulletMsrs" : [m1, m2, m3]
			}
		};
		RoleMapper.semantics.semanticPatternMsrs(oFeeds, 'bullet');

		assert.deepEqual(oFeeds.msrs.actualValues.map(function(key){
			return key.getName();
		}), ['m2', 'm1'], "feeding is generated from semantics");

		assert.deepEqual(oFeeds.msrs.targetValues.map(function(key){
			return key.getName();
		}), ['m3'], "targetValues should be feed.");
	});

	QUnit.test("Semantics pattern based feeding test", function(assert) {
		var m1, m2, m3, m4, m5, m6, oFeeds, result, properties;

		m1 = newMsr({
			name: "m1",
			sem: MeasureSemantics.Projected
		});
		m2 = newMsr({
			name: "m2",
			sem: MeasureSemantics.Actual,
			rel: {
				projected: "m1",
				reference : 'm3'
			}
		});
		m3 = newMsr({
			name: "m3",
			sem: MeasureSemantics.Reference
		});
		m4 = newMsr({
			name: "m4",
			sem: MeasureSemantics.Reference
		});
		m5 = newMsr({
			name: "m5",
			sem: MeasureSemantics.Actual
		});
		m6 = newMsr({
			name: "m6",
			sem: MeasureSemantics.Projected
		});

		oFeeds = {
			dims : {
				categoryAxis : []
			},
			msrs : {
				valueAxis : [m1, m2, m3, m4, m5, m6]
			}
		};
		result = RoleMapper.semantics.semanticPatternMsrs(oFeeds);

		assert.deepEqual(result, {
			semanticTuples : [{
				actual : "m2",
				projected : "m1",
				reference : "m3",
				index : 0,
				valueAxisID: "valueAxis",
				"order": [
				"actual",
				"projected",
				"reference"
				]
			}, {
				actual : "m5",
				index : 1,
				valueAxisID: "valueAxis",
				"order": [
				"actual",
				"projected",
				"reference"
				]
			}, {
				projected : "m6",
				index : 2,
				valueAxisID: "valueAxis",
				"order": [
				"actual",
				"projected",
				"reference"
				]
			},{
				reference : "m4",
				index : 3,
				valueAxisID: "valueAxis",
				"order": [
				"actual",
				"projected",
				"reference"
				]
			}],
			contexts : []
		}, "Semantic tuples should be correct.");

		assert.deepEqual(oFeeds.msrs.valueAxis.map(function(key){
			return key.getName();
		}), ["m2", "m1", "m3", "m5", "m6", "m4"], "valueAxis should be re-order.");

		properties = MeasureSemanticsUtils.getSemanticVizSettings('line', result.semanticTuples, null, true).properties.plotArea;
		assert.ok(properties.dataPointStyle.rules.length === 6, "It should have 6 dataPointStyle rules.");
		assert.deepEqual(properties.dataPointStyle.rules.map(function(rule){
			return rule.properties.color;
		}), ["sapUiChartPaletteQualitativeHue1", "sapUiChartPaletteQualitativeHue1", "sapUiChartPaletteQualitativeHue1",
			"sapUiChartPaletteQualitativeHue2", "sapUiChartPaletteQualitativeHue3", "sapUiChartPaletteQualitativeHue4"
		], "Default color palette should be used.");

		oFeeds = {
			dims : {
				categoryAxis : []
			},
			msrs : {
				valueAxis : [m1, m2, m4, m6],
				valueAxis2 : [m3, m5]
			}
		};
		result = RoleMapper.semantics.semanticPatternMsrs(oFeeds, 'dual_column');

		assert.deepEqual(result, {
			semanticTuples : [{
				actual : "m2",
				projected : "m1",
				valueAxisID : 'valueAxis',
				index : 0,
				"order": [
				"actual",
				"projected",
				"reference"
				]
			}, {
				projected : "m6",
				valueAxisID : 'valueAxis',
				index : 1,
				"order": [
				"actual",
				"projected",
				"reference"
				]
			}, {
				reference : "m4",
				valueAxisID : 'valueAxis',
				index : 2,
				"order": [
				"actual",
				"projected",
				"reference"
				]
			}, {
				actual : "m5",
				valueAxisID : 'valueAxis2',
				index : 0,
				"order": [
				"actual",
				"projected",
				"reference"
				]
			}, {
				reference : "m3",
				valueAxisID : 'valueAxis2',
				index : 1,
				"order": [
				"actual",
				"projected",
				"reference"
				]
			}],
			contexts : []
		}, "Dual feeding's semantic tuples should be correct.");

		assert.deepEqual(oFeeds.msrs.valueAxis.map(function(key){
			return key.getName();
		}), ["m2", "m1", "m6", "m4"], "Dual feeding's valueAxis should be re-order.");

		assert.deepEqual(oFeeds.msrs.valueAxis2.map(function(key){
			return key.getName();
		}), ["m5", "m3"], "Dual feeding's valueAxis2 should be re-order.");

		properties = MeasureSemanticsUtils.getSemanticVizSettings('dual_column', result.semanticTuples, null, true).properties.plotArea;

		assert.deepEqual(properties.dataPointStyle.rules.map(function(rule){
			return rule.properties.color;
		}), ['sapUiChartPaletteSequentialHue1', 'sapUiChartPaletteSequentialHue1',
			'sapUiChartPaletteSequentialHue1Light2','sapUiChartPaletteSequentialHue1Dark1',
			'sapUiChartPaletteSequentialHue2', 'sapUiChartPaletteSequentialHue2Light2'
		], "Default Dual Color should be set for dual chart.");

		m2 = newMsr({
			name: "m2",
			sem: MeasureSemantics.Actual,
			rel: {
				projected: "m1"
			}
		});

		m6 = newMsr({
			name: "m6",
			sem: MeasureSemantics.Reference
		});

		oFeeds = {
			dims : {
				categoryAxis : []
			},
			msrs : {
				valueAxis : [m1, m2, m3, m4, m5, m6]
			}
		};
		result = RoleMapper.semantics.semanticPatternMsrs(oFeeds);

		assert.deepEqual(result, {
			semanticTuples : [{
				actual : "m2",
				projected : "m1",
				index : 0,
				valueAxisID: "valueAxis",
				"order": [
				"actual",
				"projected",
				"reference"
				]
			}, {
				actual : "m5",
				index : 1,
				valueAxisID: "valueAxis",
				"order": [
				"actual",
				"projected",
				"reference"
				]
			}, {
				reference : "m3",
				index : 2,
				valueAxisID: "valueAxis",
				"order": [
				"actual",
				"projected",
				"reference"
				]
			}, {
				reference : "m4",
				index : 3,
				valueAxisID: "valueAxis",
				"order": [
				"actual",
				"projected",
				"reference"
				]
			}, {
				reference : "m6",
				index : 4,
				valueAxisID: "valueAxis",
				"order": [
				"actual",
				"projected",
				"reference"
				]
			}],
			contexts : []
		}, "Semantic tuples should be correct.");

		properties = MeasureSemanticsUtils.getSemanticVizSettings('line', result.semanticTuples, null, true).properties.plotArea;
		assert.deepEqual(properties.dataPointStyle.rules.map(function(rule){
			return rule.properties.color;
		}), ['sapUiChartPaletteQualitativeHue1', 'sapUiChartPaletteQualitativeHue1', 'sapUiChartPaletteQualitativeHue2',
			'sapUiChartPaletteQualitativeHue3', 'sapUiChartPaletteQualitativeHue4', 'sapUiChartPaletteQualitativeHue5'
		], "Default color palette should be used.");

		m1 = newMsr({
			name: "m1",
			sem: MeasureSemantics.Reference
		});
		m2 = newMsr({
			name: "m2",
			sem: MeasureSemantics.Actual,
			rel: {
				reference: "m1"
			}
		});
		oFeeds = {
			dims : {
				categoryAxis : []
			},
			msrs : {
				valueAxis : [m1, m2]
			}
		};
		result = RoleMapper.semantics.semanticPatternMsrs(oFeeds);
		assert.deepEqual(result, {
			semanticTuples : [{
				actual : "m2",
				reference : "m1",
				index : 0,
				valueAxisID: "valueAxis",
				"order": [
				"actual",
				"projected",
				"reference"
				]
			}],
			contexts : []
		}, "Semantic tuples should be correct.");

		properties = MeasureSemanticsUtils.getSemanticVizSettings('line', result.semanticTuples, null, true).properties.plotArea;
		assert.deepEqual(properties.dataPointStyle.rules.map(function(rule){
			return rule.properties.color;
		}), ['sapUiChartPaletteQualitativeHue1', 'sapUiChartPaletteSequentialNeutralDark2'
		], "First Color and reference color should be used.");

		oFeeds = {
			dims : {
				categoryAxis : []
			},
			msrs : {
				valueAxis : [m1, m2, m5]
			}
		};
		result = RoleMapper.semantics.semanticPatternMsrs(oFeeds);
		assert.deepEqual(result, {
			semanticTuples : [{
				actual : "m2",
				reference : "m1",
				index : 0,
				valueAxisID: "valueAxis",
				"order": [
				"actual",
				"projected",
				"reference"
				]
			}, {
				actual : "m5",
				index : 1,
				valueAxisID: "valueAxis",
				"order": [
				"actual",
				"projected",
				"reference"
				]
			}],
			contexts : []
		}, "Semantic tuples should be correct.");

		properties = MeasureSemanticsUtils.getSemanticVizSettings('line', result.semanticTuples, null, true).properties.plotArea;
		assert.deepEqual(properties.dataPointStyle.rules.map(function(rule){
			return rule.properties.color;
		}), ['sapUiChartPaletteQualitativeHue1', 'sapUiChartPaletteSequentialNeutralDark2', 'sapUiChartPaletteQualitativeHue2'
		], "Reference color should be used.");

		oFeeds = {
			dims : {
				categoryAxis : []
			},
			msrs : {
				valueAxis : [m5, m3]
			}
		};
		result = RoleMapper.semantics.semanticPatternMsrs(oFeeds);
		assert.deepEqual(result, {
			semanticTuples : [{
				actual : "m5",
				index : 0,
				valueAxisID: "valueAxis",
				"order": [
				"actual",
				"projected",
				"reference"
				]
			}, {
				reference : "m3",
				index : 1,
				valueAxisID: "valueAxis",
				"order": [
				"actual",
				"projected",
				"reference"
				]
			}],
			contexts : []
		}, "Semantic tuples should be correct.");

		properties = MeasureSemanticsUtils.getSemanticVizSettings('line', result.semanticTuples, null, true).properties.plotArea;
		assert.deepEqual(properties.dataPointStyle.rules.map(function(rule){
			return rule.properties.color;
		}), ['sapUiChartPaletteQualitativeHue1', 'sapUiChartPaletteSequentialNeutralDark2'
		], "First Color and reference color should be used.");

		m1 = newMsr({
			name: "m1",
			sem: MeasureSemantics.Actual
		});
		m2 = newMsr({
			name: "m2",
			sem: MeasureSemantics.Actual
		});
		m3 = newMsr({
			name: "m3",
			sem: MeasureSemantics.Projected
		});

		oFeeds = {
			dims : {
				categoryAxis : []
			},
			msrs : {
				valueAxis : [m1, m2, m3]
			}
		};
		result = RoleMapper.semantics.semanticPatternMsrs(oFeeds,'stacked_column');
		assert.deepEqual(result, {
			semanticTuples : [{
				actual : "m1",
				index : 0,
				valueAxisID: "valueAxis",
				"order": [
					"actual",
					"projected",
					"reference"
				]
			}, {
				actual : "m2",
				index : 1,
				valueAxisID: "valueAxis",
				"order": [
					"actual",
					"projected",
					"reference"
				]
			},{
				actual : "m3",
				index : 2,
				valueAxisID: "valueAxis",
				"order": [
					"actual",
					"projected",
					"reference"
				]
			}],
			contexts : []
		}, "Actual, forecast and/or target in one bar/column should not be possible.");

		m1 = newMsr({
			name: "m1",
			sem: MeasureSemantics.Projected
		});
		m2 = newMsr({
			name: "m2",
			sem: MeasureSemantics.Projected
		});
		m3 = newMsr({
			name: "m3",
			sem: MeasureSemantics.Projected
		});

		oFeeds = {
			dims : {
				categoryAxis : []
			},
			msrs : {
				valueAxis : [m1, m2, m3]
			}
		};
		result = RoleMapper.semantics.semanticPatternMsrs(oFeeds,'stacked_column');
		assert.deepEqual(result, {
			semanticTuples : [{
				projected : "m1",
				index : 0,
				valueAxisID: "valueAxis",
				"order": [
					"actual",
					"projected",
					"reference"
				]
			}, {
				projected : "m2",
				index : 1,
				valueAxisID: "valueAxis",
				"order": [
					"actual",
					"projected",
					"reference"
				]
			},{
				projected : "m3",
				index : 2,
				valueAxisID: "valueAxis",
				"order": [
					"actual",
					"projected",
					"reference"
				]
			}],
			contexts : []
		}, "Only same semanticRole can be in one bar/column");

		m1 = newMsr({
			name: "m1",
			sem: MeasureSemantics.Actual,
			rel: {
				projected: "m2",
				reference : 'm3'
			}
		});
		m2 = newMsr({
			name: "m2",
			sem: MeasureSemantics.Projected
		});
		m3 = newMsr({
			name: "m3",
			sem: MeasureSemantics.Reference
		});

		oFeeds = {
			dims : {
				categoryAxis : []
			},
			msrs : {
				valueAxis : [m1, m2, m3]
			}
		};
		result = RoleMapper.semantics.semanticPatternMsrs(oFeeds,'stacked_combination');
		assert.deepEqual(result, {
			semanticTuples : [{
				actual : "m1",
				projected : "m2",
				reference : "m3",
				index : 0,
				valueAxisID: "valueAxis",
				"order": [
					"actual",
					"projected",
					"reference"
				]
			}],
			contexts : []
		}, "Semantic tuples should be correct in stacked_combination");

		properties = MeasureSemanticsUtils.getSemanticVizSettings('stacked_combination', result.semanticTuples, null, true).properties.plotArea;
		assert.ok(properties.dataPointStyle.rules.length === 3, "It should have 3 dataPointStyle rules.");
		assert.deepEqual(properties.dataPointStyle.rules.map(function(rule){
			return rule.properties.color;
		}), ["sapUiChartPaletteQualitativeHue1", "sapUiChartPaletteQualitativeHue1", "sapUiChartPaletteSequentialNeutralDark2"
		], "Default color palette should be used.");

		assert.deepEqual(properties.dataPointStyle.rules.map(function(rule){
			return rule.properties.pattern;
		}), [ undefined, '', 'noFill'
		], "reference pattern be noFill");

		assert.deepEqual(properties.dataPointStyle.rules.map(function(rule){
			return rule.properties.lineType;
		}), [ undefined, 'dash', 'dot'
		], "projected line be dash, reference line be dot");

		m1 = newMsr({
			name: "m1",
			sem: MeasureSemantics.Actual
		});
		m2 = newMsr({
			name: "m2",
			sem: MeasureSemantics.Actual
		});
		m3 = newMsr({
			name: "m3",
			sem: MeasureSemantics.Actual
		});

		oFeeds = {
			dims : {
				categoryAxis : []
			},
			msrs : {
				valueAxis : [m1, m2, m3]
			}
		};
		result = RoleMapper.semantics.semanticPatternMsrs(oFeeds,'combination');
		assert.deepEqual(result, {
			semanticTuples : [{
				actual : "m1",
				index : 0,
				valueAxisID: "valueAxis",
				"order": [
					"actual",
					"projected",
					"reference"
				]
			}, {
				actual : "m2",
				index : 1,
				valueAxisID: "valueAxis",
				"order": [
					"actual",
					"projected",
					"reference"
				]
			},{
				actual : "m3",
				index : 2,
				valueAxisID: "valueAxis",
				"order": [
					"actual",
					"projected",
					"reference"
				]
			}],
			contexts : []
		}, "Semantic tuples should be correct in combination chart");

		properties = MeasureSemanticsUtils.getSemanticSettingsForCombination(result.semanticTuples, 'combination');
		assert.deepEqual(properties, undefined, "When all measures are actual, do not set dataShape property");


		m1 = newMsr({
			name: "m1",
			sem: MeasureSemantics.Actual
		});
		m2 = newMsr({
			name: "m2",
			sem: MeasureSemantics.Actual
		});
		m3 = newMsr({
			name: "m3",
			sem: MeasureSemantics.Projected
		});

		oFeeds = {
			dims : {
				categoryAxis : []
			},
			msrs : {
				valueAxis : [m1, m2, m3]
			}
		};
		result = RoleMapper.semantics.semanticPatternMsrs(oFeeds,'combination');
		assert.deepEqual(result, {
			semanticTuples : [{
				actual : "m1",
				index : 0,
				valueAxisID: "valueAxis",
				"order": [
					"actual",
					"projected",
					"reference"
				]
			}, {
				actual : "m2",
				index : 1,
				valueAxisID: "valueAxis",
				"order": [
					"actual",
					"projected",
					"reference"
				]
			},{
				projected : "m3",
				index : 2,
				valueAxisID: "valueAxis",
				"order": [
					"actual",
					"projected",
					"reference"
				]
			}],
			contexts : []
		}, "Semantic tuples should be correct in combination chart");

		properties = MeasureSemanticsUtils.getSemanticSettingsForCombination(result.semanticTuples, 'combination').plotArea.dataShape;
		assert.deepEqual(properties.primaryAxis,['bar','bar','line'], "actual as bar, others as line in combination");

	});

	QUnit.test("Semantics Pattern after BVR", function(assert){
		var m1, m2, m3, dim, result;

		m1 = newMsr({
			name: "m1",
			sem: MeasureSemantics.Projected
		});
		m2 = newMsr({
			name: "m2",
			sem: MeasureSemantics.Actual,
			rel: {
				projected: "m1",
				reference: 'm3'
			}
		});
		m3 = newMsr({
			name: "m3",
			sem: MeasureSemantics.Reference
		});
		dim = newDim({
			name : 'Country'
		});
		result = RoleFitter.fit('dual_column', [dim], [m1, m2, m3], [], true);
		assert.deepEqual(result._semanticTuples, [{
			actual : "m2",
			projected : "m1",
			index : 0,
			valueAxisID : 'valueAxis',
			"order": [
			"actual",
			"projected",
			"reference"
			]
		}, {
			reference : "m3",
			index : 0,
			valueAxisID : "valueAxis2",
			"order": [
			"actual",
			"projected",
			"reference"
			]
		}], "Should have two semantic rule.");
	});

	QUnit.test("Semantics pattern based feeding test - with projectedValueStartTime", function(assert) {
		var m1, m2, m3, m4, dim, oFeeds, result;

		m1 = newMsr({
			name: "m1",
			sem: MeasureSemantics.Projected
		});
		m2 = newMsr({
			name: "m2",
			sem: MeasureSemantics.Actual,
			rel: {
				projected: "m1"
			}
		});
		m3 = newMsr({
			name: "m3",
			sem: MeasureSemantics.Reference
		});
		m4 = newMsr({
			name: "m4",
			sem: MeasureSemantics.Reference
		});
		dim = newTimeDim({
			name : 'Date',
			projectedValueStartTime : 1452038400000
		});
		oFeeds = {
			dims : {
				timeAxis : [dim]
			},
			msrs : {
				valueAxis : [m1, m2, m3, m4]
			}
		};
		result = RoleMapper.semantics.semanticPatternMsrs(oFeeds, "timeseries_line");

		assert.deepEqual(result.semanticTuples, [{
			actual : "m2",
			projected : "m1",
			projectedValueStartTime : 1452038400000,
			semanticMsrName : "m2-m1",
			timeAxis : 'Date',
			index : 0,
			valueAxisID: "valueAxis",
			"order": [
			"actual",
			"projected",
			"reference"
			]
		}, {
			reference : "m3",
			index : 1,
			valueAxisID: "valueAxis",
			"order": [
			"actual",
			"projected",
			"reference"
			]
		}, {
			reference : "m4",
			index : 2,
			valueAxisID: "valueAxis",
			"order": [
			"actual",
			"projected",
			"reference"
			]
		}], "Measures should be continues if projectedValueStartTime is set.");

		assert.deepEqual(result.contexts.map(function(key){
			return key.getName();
		}), ["m1", "m2"], "Unbound meausre should be set.");

		var properties = MeasureSemanticsUtils.getSemanticVizSettings('line', result.semanticTuples, null, true).properties.plotArea;

		assert.ok(properties.dataPointStyle.rules.length === 4, "It should have 4 dataPointStyle rules.");
		assert.deepEqual(properties.dataPointStyle.rules.map(function(rule){
			return rule.properties.color;
		}), ['sapUiChartPaletteQualitativeHue1', 'sapUiChartPaletteQualitativeHue1',
			'sapUiChartPaletteQualitativeHue2', 'sapUiChartPaletteQualitativeHue3'
		], "Default color palette should be used.");
		assert.equal(properties.dataPointStyle.rules[0].displayName, 'm2', 'Actual measure name should be m2.');
		assert.equal(properties.dataPointStyle.rules[1].displayName, 'm1', 'Projected measure name should be m1.');

		assert.deepEqual(properties.dataPointStyle.rules[0].dataName, {
			"m2-m1" : "m2"
		}, 'Actual dataName should be m2.');
		assert.deepEqual(properties.dataPointStyle.rules[1].dataName, {
			"m2-m1" : "m1"
		}, 'Projected dataName should be m1.');

		m2 = newMsr({
			name: "m2",
			sem: MeasureSemantics.Actual,
			rel: {
				projected: "m1",
				reference : 'm3'
			}
		});
		oFeeds = {
			dims : {
				timeAxis : [dim]
			},
			msrs : {
				valueAxis : [m1, m2, m3, m4]
			}
		};
		result = RoleMapper.semantics.semanticPatternMsrs(oFeeds, 'timeseries_line');

		assert.deepEqual(result.semanticTuples, [{
			actual : "m2",
			projected : "m1",
			projectedValueStartTime : 1452038400000,
			semanticMsrName : "m2-m1",
			timeAxis : 'Date',
			reference : "m3",
			index : 0,
			valueAxisID: "valueAxis",
			"order": [
			"actual",
			"projected",
			"reference"
			]
		}, {
			reference : "m4",
			index : 1,
			valueAxisID: "valueAxis",
			"order": [
			"actual",
			"projected",
			"reference"
			]
		}], "Continues series can also have reference measure.");

		assert.deepEqual(result.contexts.map(function(key){
			return key.getName();
		}), ["m1", "m2"], "Unbound meausre should be set.");

		properties = MeasureSemanticsUtils.getSemanticVizSettings('line', result.semanticTuples, null, true).properties.plotArea;

		assert.ok(properties.dataPointStyle.rules.length === 4, "It should have 4 dataPointStyle rules.");
		assert.deepEqual(properties.dataPointStyle.rules.map(function(rule){
			return rule.properties.color;
		}), ['sapUiChartPaletteQualitativeHue1', 'sapUiChartPaletteQualitativeHue1', 'sapUiChartPaletteQualitativeHue1',
			'sapUiChartPaletteQualitativeHue2'
		], "Default color palette should be used.");

		m1 = newMsr({
			name: "m1",
			sem: MeasureSemantics.Projected
		});
		m2 = newMsr({
			name: "m2",
			sem: MeasureSemantics.Actual,
			rel: {
				projected: "m1"
			}
		});
		m3 = newMsr({
			name: "m3",
			sem: MeasureSemantics.Reference
		});

		dim = newTimeDim({
			name : 'Date',
			projectedValueStartTime : 1452038400000
		});

		oFeeds = {
			dims : {
				timeAxis : [dim]
			},
			msrs : {
				valueAxis : [m1, m2, m3]
			}
		};

		result = RoleMapper.semantics.semanticPatternMsrs(oFeeds, "timeseries_combination");
		assert.deepEqual(result.semanticTuples, [{
			actual : "m2",
			projected : "m1",
			projectedValueStartTime : 1452038400000,
			semanticMsrName : "m2-m1",
			timeAxis : 'Date',
			index : 0,
			valueAxisID: "valueAxis",
			"order": [
				"actual",
				"projected",
				"reference"
			]
		}, {
			reference : "m3",
			index : 1,
			valueAxisID: "valueAxis",
			"order": [
				"actual",
				"projected",
				"reference"
			]
		}], "timeseries_combination with projectedValueStartTime.");

		assert.deepEqual(result.contexts.map(function(key){
			return key.getName();
		}), ["m1", "m2"], "Unbound meausre should be set.");

		properties = MeasureSemanticsUtils.getSemanticVizSettings('timeseries_combination', result.semanticTuples, null, true).properties.plotArea;
		assert.ok(properties.dataPointStyle.rules.length === 3, "It should have 3 dataPointStyle rules.");
		assert.deepEqual(properties.dataPointStyle.rules.map(function(rule){
			return rule.properties.color;
		}), ['sapUiChartPaletteQualitativeHue1', 'sapUiChartPaletteQualitativeHue1',
			'sapUiChartPaletteSequentialNeutralDark2'
		], "Default color palette should be used.");

		assert.deepEqual(properties.dataPointStyle.rules.map(function(rule){
			return rule.properties.pattern;
		}), [ undefined, 'diagonalLightStripe', 'noFill'
		], "Pattern for column and line should be used.");

		m1 = newMsr({
			name: "m1",
			sem: MeasureSemantics.Projected
		});
		m2 = newMsr({
			name: "m2",
			sem: MeasureSemantics.Actual,
			rel: {
				projected: "m1"
			}
		});

		dim = newTimeDim({
			name : 'Date',
			projectedValueStartTime : 1452038400000
		});

		oFeeds = {
			dims : {
				timeAxis : [dim]
			},
			msrs : {
				valueAxis : [m1, m2]
			}
		};

		result = RoleMapper.semantics.semanticPatternMsrs(oFeeds, "timeseries_stacked_column");
		assert.deepEqual(result.semanticTuples, [{
			actual : "m2",
			projected : "m1",
			projectedValueStartTime : 1452038400000,
			semanticMsrName : "m2-m1",
			timeAxis : 'Date',
			index : 0,
			valueAxisID: "valueAxis",
			"order": [
				"actual",
				"projected",
				"reference"
			]
		}], "timeseries_stacked_column with projectedValueStartTime.");

		properties = MeasureSemanticsUtils.getSemanticVizSettings('timeseries_stacked_column', result.semanticTuples, null, true).properties.plotArea;
		assert.deepEqual(properties.dataPointStyle.rules.map(function(rule){
			return rule.properties.color;
		}), ['sapUiChartPaletteQualitativeHue1', 'sapUiChartPaletteQualitativeHue1'], "Default color palette should be used.");

		assert.deepEqual(properties.dataPointStyle.rules.map(function(rule){
			return rule.properties.pattern;
		}), [ undefined, 'diagonalLightStripe'], "Pattern for column should be used.");
	});


	var oChart;
	QUnit.module('Semantics Chart With Continues Series Testing');

	QUnit.test('get/setSelectedDataPoints API', function(assert){
		assert.expect(4);
		var done = assert.async();

		oChart = createTimeChart();
		oChart.placeAt("content");
		oChart.attachEventOnce("renderComplete", function() {

			assert.equal(oChart.getSelectionBehavior(), 'DATAPOINT', 'Default selection behavior should be DATAPOINT.');

			oChart.setSelectedDataPoints([{index: 1, measures:["Actual"]},{index: 7, measures:['Actual', 'Forecast']}]);
			assert.deepEqual(parseDataPoints(oChart.getSelectedDataPoints()), {
				count: 2,
				dataPoints:[{index: 1, measures:["Actual"]}, {index: 7, measures: ["Forecast"]}]
			}, 'Two data points should be selected.');

			oChart.addSelectedDataPoints([{index: 9, measures:["Actual"]}]);
			assert.deepEqual(parseDataPoints(oChart.getSelectedDataPoints()), {
				count: 3,
				dataPoints:[{index: 1, measures:["Actual"]}, {index: 7, measures: ["Forecast"]}, {index: 9, measures: ["Forecast"]}]
			}, 'Three data points should be selected.');

			oChart.removeSelectedDataPoints([{index: 9, measures:["Actual"]}]);
			assert.deepEqual(parseDataPoints(oChart.getSelectedDataPoints()), {
				count: 2,
				dataPoints:[{index: 1, measures:["Actual"]}, {index: 7, measures: ["Forecast"]}]
			}, 'Two data points should be selected.');

			done();
		});
	});

	QUnit.test('get/setSelectedDataPoints API - with more measures', function(assert){
		assert.expect(3);
		var done = assert.async();

		oChart.setVisibleMeasures(["Actual", "Forecast", "Profit-Actual"]);
		oChart.attachEventOnce('renderComplete', function(){
			oChart.setSelectedDataPoints([{index: 0, measures:["Actual"]},{index: 1, measures:["Profit-Actual"]}]);
			assert.deepEqual(parseDataPoints(oChart.getSelectedDataPoints()), {
				count: 2,
				dataPoints:[{"index":0,"measures":["Actual"]},{"index":1,"measures":["Profit-Actual"]}]
			}, 'Two data points should be selected.');

			oChart.addSelectedDataPoints([{index: 9, measures:["Actual"]}]);
			assert.deepEqual(parseDataPoints(oChart.getSelectedDataPoints()), {
				count: 3,
				dataPoints:[{index:0, measures:["Actual"]}, {index:1,measures:["Profit-Actual"]}, {index: 9, measures: ["Forecast"]}]
			}, 'Three data points should be selected.');

			oChart.removeSelectedDataPoints([{index: 0, measures:["Actual"]}]);
			assert.deepEqual(parseDataPoints(oChart.getSelectedDataPoints()), {
				count: 2,
				dataPoints:[{index:1,measures:["Profit-Actual"]}, {index: 9, measures: ["Forecast"]}]
			}, 'Two data points should be selected.');

			done();
		});
	});

	QUnit.test('selectData event - with more measures', function(assert){
		assert.expect(2);
		var done = assert.async();

		oChart.setVisibleMeasures(["Actual", "Forecast", "Profit-Actual"]);
		oChart.attachEventOnce('renderComplete', function(){
			oChart.setSelectedDataPoints([{index: 0, measures:["Actual"]},{index: 1, measures:["Profit-Actual"]}]);
		});

		oChart.attachEventOnce('selectData', function(e){
			var data = e.getParameter('data');
			assert.deepEqual(data[0].data, {
				Date: 1420070400000, 'Date.parsedValue': 1420070400000, measureNames: "Actual", _context_row_number: 0, Actual: 199.12280727427256
			}, 'selectData should not have internal measure name');
			assert.deepEqual(data[1].data, {
				Date: 1420156800000, 'Date.parsedValue': 1420156800000, measureNames: "Profit-Actual", 'Profit-Actual': 724.9862705796602, _context_row_number: 1
			}, 'selectData should not have internal measure name');

			oChart.setVisibleMeasures(["Actual", "Forecast"]);
			done();
		});
	});


	QUnit.test('get/setSelectedSeries API', function(assert){
		assert.expect(3);
		var done = assert.async();

		oChart.setSelectionBehavior('SERIES');

		oChart.attachEventOnce("renderComplete", function() {
			assert.equal(oChart.getSelectionBehavior(), 'SERIES', 'Default selection behavior should be SERIES.');

			oChart.setSelectedSeries([{measures: 'Actual'}]);
			assert.deepEqual(oChart.getSelectedSeries(), {
				count: 0,
				series: []
			}, "Non data points should be selected.");

			oChart.setSelectedSeries([{measures: 'Actual'}, {measures: 'Forecast'}]);
			assert.deepEqual(oChart.getSelectedSeries(),{
				count: 151,
				series:[{
					measures: 'Actual'
				}, {
					measures: 'Forecast'
				}]
			}, "Actual-Forecast series should be selected.");

			done();
		});
	});

	QUnit.test('get/setSelectedSeries API - with more measures', function(assert){
		assert.expect(5);
		var done = assert.async();

		oChart.setVisibleMeasures(["Actual", "Forecast", "Profit-Actual"]);

		oChart.attachEventOnce("renderComplete", function() {
			assert.equal(oChart.getSelectionBehavior(), 'SERIES', 'Default selection behavior should be SERIES.');

			oChart.setSelectedSeries([{measures: 'Profit-Actual'}]);
			assert.deepEqual(oChart.getSelectedSeries(), {
				count: 151,
				series: [{
					measures : 'Profit-Actual'
				}]
			}, "Profit-Actual should be selected.");

			oChart.setSelectedSeries([{measures: 'Actual'}, {measures: 'Forecast'}, {measures: 'Profit-Actual'}]);
			assert.deepEqual(oChart.getSelectedSeries(),{
				count: 302,
				series:[{
					measures: 'Profit-Actual'
				},{
					measures: 'Actual'
				}, {
					measures: 'Forecast'
				}]
			}, "Both Actual-Forecast, Profit-Actual series should be selected.");

			oChart.removeSelectedSeries([{measures: 'Actual'}]);
			assert.equal(oChart.getSelectedSeries().count, 302, 'Non datapoint is unselected.');

			oChart.removeSelectedSeries([{measures: 'Profit-Actual'}]);
			assert.deepEqual(oChart.getSelectedSeries(),{
				count: 151,
				series:[{
					measures: 'Actual'
				}, {
					measures: 'Forecast'
				}]
			}, "Profit should be unseleced");

			done();
			oChart.destroy();
		});
	});

	QUnit.module('Semantics Chart With Continues Series and yearmonthday timeUnit');

	QUnit.test('Draw chart with an invalid projectedValueStartTime', function(assert){
		assert.expect(3);
		var done = assert.async();

		oChart = createTimeChartWithYearmonthday();
		oChart.placeAt("content");

		oChart.attachEventOnce("renderComplete", function(){
			var dashLine = $('#content .v-legend-marker line[stroke-dasharray]');
			assert.equal(dashLine.length, 1, 'Projected measures should be shown.');
			assert.equal(dashLine.attr('stroke'), "#5899da", 'Should use actual measure color.');

			assert.equal($('#content .v-lines-group').length, 2, "projectedValueStartTime shouldn't work. Two series should be drawn.");
			done();
		});
	});

	QUnit.test('Draw chart with valid projectedValueStartTime', function(assert){
		assert.expect(4);
		var done = assert.async();

		oChart.getDimensionByName('Date').setProjectedValueStartTime("20120109");

		oChart.attachEventOnce('renderComplete', function(){
			assert.equal($('#content .v-lines-group').length, 1, "One series should be drawn.");

			var data = d3.selectAll('#content .v-datapoint').data();
			assert.equal(data[0]['Actual'], data[0]['Actual-Forecast'], "It should be actual value.");
			assert.equal(data[1]['Actual'], data[1]['Actual-Forecast'], "It should be actual value.");
			assert.equal(data[2]['Forecast'], data[2]['Actual-Forecast'], "It should be projected value.");

			done();
			oChart.destroy();
		});
	});

	QUnit.module("Check edge case.");

	QUnit.test('Set semantic relation with invalidate measure name.', function(assert){
		assert.expect(3);
		var done = assert.async();

		oChart = createLineChart();
		oChart.getMeasureByName('Cost').setSemanticallyRelatedMeasures({
			projectedValueMeasure : 'Unit Price'
		});
		oChart.getMeasureByName("Unit Price").setSemantics("projected");

		oChart.placeAt("content");

		assert.ok(true, "Set chart with valid semantic relation.");

		oChart.attachEventOnce("renderComplete", function() {
			var dashLine = $('#content .v-legend-marker line[stroke-dasharray]');
			assert.equal(dashLine.length, 1, 'Projected measures should be shown.');
			assert.equal(dashLine.attr('stroke'), "#5899da", 'Should use actual measure color.');

			done();
		});
	});

	QUnit.test('Reset semantic relation with undefined tag', function(assert){
		assert.expect(2);
		var done = assert.async();

		oChart.getMeasureByName('Cost').setSemanticallyRelatedMeasures({
			projectedValueMeasure : undefined
		});

		oChart.attachEventOnce("renderComplete", function(){
			var dashLine = $('#content .v-legend-marker line[stroke-dasharray]');
			assert.equal(dashLine.length, 1, 'Semantic relationship should be reset.');
			assert.equal(dashLine.attr('stroke'), "#e8743b", 'No relation projected measure should use default color.');
			done();
		});
	});

	QUnit.test('Switch chart type from line to bar.', function(assert){
		assert.expect(1);
		var done = assert.async();

		oChart.getMeasureByName('Cost').setSemanticallyRelatedMeasures({
			projectedValueMeasure : 'Unit Price'
		});

		oChart.setChartType(ChartType.Bar);

		oChart.attachEventOnce("renderComplete", function(){
			var hashedBar = $('#content .v-legend-marker[fill*="url"]');
			assert.equal(hashedBar.length, 1, 'Relationship should be kept after switching chart type. Projected measures should be shown as hash bar.');
			done();
		});
	});

	QUnit.test('Switch chart type from bar to stacked column which does not support semantic pattern.', function(assert){
		assert.expect(1);
		var done = assert.async();

		oChart.setChartType(ChartType.StackedColumn);

		oChart.attachEventOnce("renderComplete", function(){
			var hashedBar = $('#content .v-legend-marker[fill*="url"]');
			assert.equal(hashedBar.length, 0, 'Semantic Relation should be reset.');
			done();
		});
	});

	QUnit.test('User set its own datapointStyle', function(assert){
		assert.expect(1);
		var done = assert.async();

		oChart.setChartType(ChartType.Bar);

		oChart.setVizProperties({
			"plotArea": {
				"dataPointStyle": {
					"rules": [{
						"properties": {
							"color": "purple",
							"pattern": "solid",
							"lineColor": "purple",
							"dataLabel": true
						},
						"dataContext": [{
							"DATE_S": {
								"min": "2016-01-03"
							},
							"TARGET": "*"
						}],
						"displayName": "Future Target"
					}],
					"others": {
						"properties": {
							"color": "gray",
							"lineColor": "gray"
						}
					}
				}
			}
		});

		oChart.attachEventOnce("renderComplete", function(){
			var hashedBar = $('#content .v-legend-marker[fill*="url"]');
			assert.equal(hashedBar.length, 0, 'User datapointStyle should be apply.');
			done();
			oChart.destroy();
		});
	});


	var parseDataPoints = function(aSelectedDatapoints){
		aSelectedDatapoints.dataPoints.forEach(function(d){
			delete d.context;
		});
		return aSelectedDatapoints;
	};


	QUnit.start();

});
