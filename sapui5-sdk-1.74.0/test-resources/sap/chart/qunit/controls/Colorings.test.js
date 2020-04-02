/*global QUnit */

QUnit.config.autostart = false;

sap.ui.require([
	"sap/chart/coloring/Colorings",
	"sap/chart/data/Dimension",
	"sap/chart/data/Measure",
	"sap/chart/Chart",
	"sap/chart/ChartLog",
	"sap/chart/ColoringType",
	'sap/chart/utils/MeasureSemanticsUtils',
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
	'sap/ui/model/json/JSONModel',
	'sap/chart/coloring/ColorPalette'
], function(
	Colorings,
	Dimension,
	Measure,
	Chart,
	ChartLog,
	ColoringType,
	MeasureSemanticsUtils,
	Filter,
	FilterOperator,
	JSONModel,
	ColorPalette
) {
	"use strict";

	var oModel, oChart;
	var CalculdatedJSONData = {
		"businessData": [{
			"Player": "Player10",
			"CriticalityByPlayer": "Neutral",
			"CriticalityByPlayerM": 0,
			"CriticalityByPlayerD": "Crossbench",
			"Speed": 2884
		}, {
			"Player": "Player11",
			"CriticalityByPlayer": "Critical",
			"CriticalityByPlayerM": 2,
			"CriticalityByPlayerD": "Soso",
			"Speed": 1484
		}, {
			"Player": "Player12",
			"CriticalityByPlayer": "Critical",
			"CriticalityByPlayerM": 2,
			"CriticalityByPlayerD": "Soso",
			"Speed": 4261
		}, {
			"Player": "Player14",
			"CriticalityByPlayer": "Critical",
			"CriticalityByPlayerM": 2,
			"CriticalityByPlayerD": "Soso",
			"Speed": 4875
		}, {
			"Player": "Player15",
			"CriticalityByPlayer": "Negative",
			"CriticalityByPlayerM": 1,
			"CriticalityByPlayerD": "Weak",
			"Speed": 1298
		}, {
			"Player": "Player16",
			"CriticalityByPlayer": "Negative",
			"CriticalityByPlayerM": 1,
			"CriticalityByPlayerD": "Weak",
			"Speed": 4835
		}, {
			"Player": "Player17",
			"CriticalityByPlayer": "Neutral",
			"CriticalityByPlayerM": 0,
			"CriticalityByPlayerD": "Crossbench",
			"Speed": 2588
		}, {
			"Player": "Player19",
			"CriticalityByPlayer": "Critical",
			"CriticalityByPlayerM": 2,
			"CriticalityByPlayerD": "Soso",
			"Speed": 3501
		}, {
			"Player": "Player2",
			"CriticalityByPlayer": "Critical",
			"CriticalityByPlayerM": 2,
			"CriticalityByPlayerD": "Soso",
			"Speed": 2152
		}, {
			"Player": "Player20",
			"CriticalityByPlayer": "Negative",
			"CriticalityByPlayerM": 1,
			"CriticalityByPlayerD": "Weak",
			"Speed": 2165
		}, {
			"Player": "Player3",
			"CriticalityByPlayer": "Negative",
			"CriticalityByPlayerM": 1,
			"CriticalityByPlayerD": "Weak",
			"Speed": 3353
		}, {
			"Player": "Player4",
			"CriticalityByPlayer": "Negative",
			"CriticalityByPlayerM": 1,
			"CriticalityByPlayerD": "Weak",
			"Speed": 3712
		}, {
			"Player": "Player5",
			"CriticalityByPlayer": "Neutral",
			"CriticalityByPlayerM": 0,
			"CriticalityByPlayerD": "Crossbench",
			"Speed": 3293
		}, {
			"Player": "Player7",
			"CriticalityByPlayer": "Neutral",
			"CriticalityByPlayerM": 0,
			"CriticalityByPlayerD": "Crossbench",
			"Speed": 2289
		}]
	};

	QUnit.module("Coloring Test", {
		beforeEach: function() {

		},
		afterEach: function() {
			if (oModel) {
				oModel.destroy();
				oModel = null;
			}
			if (oChart) {
				oChart.destroy();
				oChart = null;
			}
			document.getElementById("qunit-fixture").innerHTML = "";
		}
	});
	var CriticalityType = sap.chart.coloring.CriticalityType;

	function compareStr(a, b) {
		if (a === b) {
			return 0;
		} else if (a < b) {
			return -1;
		} else {
			return 1;
		}
	}

	function msrs() {
		return [].slice.call(arguments).map(function(name) {
			return new Measure({
				name: name,
				label: name
			});
		});
	}

	function dims(names) {
		return [].slice.call(arguments).map(function(name) {
			return new Dimension({
				name: name,
				label: name
			});
		});
	}

	QUnit.test("Criticality.MeasureValues.Static", function(assert) {
		var oActiveColoring = {
			"coloring": ColoringType.Criticality
		};
		var oColorings = {
			Criticality: {
				MeasureValues: {
					Profit: {
						Static: CriticalityType.Negative
					}
				}
			}
		};

		var oDimMsr = {};
		oDimMsr.aMsr = msrs("Profit");
		oDimMsr.aDim = dims("Country");
		oDimMsr.aInResultDim = [];
		var aTuples = [{
			"actual": "Profit",
			"labels": {
				"actual": "Profit"
			},
			"index": 0,
			"order": ["actual", "projected", "reference"]
		}];

		var oCandidateColoringSetting = Colorings.getCandidateSetting(oColorings, oActiveColoring, aTuples, oDimMsr);
		var oResult = MeasureSemanticsUtils.getSemanticVizSettings(
			'column',
			aTuples,
			oCandidateColoringSetting,
			false
		);
		var rules = oResult.properties.plotArea.dataPointStyle.rules;
		assert.ok(rules[0].callback({
			Profit: 1000
		}), "Negative callback let through the specified measure according to static configuration");
		assert.equal(rules[0].displayName, "Profit", "matched legend item use measure label as displayName by default");
		assert.equal(rules[0].properties.color, "sapUiChartPaletteSemanticBad", "Negative color correct");
	});

	QUnit.test("Criticality.MeasureValues.Calculated - dimension", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'visibleDimensions': ["Player"],
			'visibleMeasures': ["Speed"]
		});
		oChart.bindData({
			path: "/businessData"
		});

		oChart.placeAt("qunit-fixture");
		var oActiveColoring = {
			"coloring": ColoringType.Criticality
		};
		var oColorings = {
			Criticality: {
				MeasureValues: {
					Speed: {
						Calculated: "CriticalityByPlayer"
					}
				}
			}
		};
		oModel = new JSONModel(CalculdatedJSONData);
		oChart.setModel(oModel);
		oChart.setColorings(oColorings);
		oChart.setActiveColoring(oActiveColoring);
		oChart.addMeasure(new Measure({
			"name": "Speed"
		}));
		oChart.addDimension(new Dimension({
			"name": "Player"
		}));
		oChart.addDimension(new Dimension({
			"name": "CriticalityByPlayer",
			"textProperty": "CriticalityByPlayerD"
		}));
		oChart.addDimension(new Dimension({
			"name": "CriticalityByPlayerD"
		}));
		oChart.attachEventOnce("renderComplete", null, checkCalculatedCb);

		function checkCalculatedCb() {
			var dpStyleRules = oChart._oSemanticVizSettings.properties.plotArea.dataPointStyle.rules;
			assert.equal(dpStyleRules.length, 3, "No Positive rules according to data");
			var oContext = {
				CriticalityByPlayer: "Neutral",
				Speed: 4000
			};
			assert.ok(dpStyleRules[0].callback(oContext), "Neutral dataPoints matched by callback");
			assert.equal(dpStyleRules[0].displayName, "Crossbench", "Neutral use textProperty as displayName");
			assert.equal(dpStyleRules[0].properties.color, "sapUiChartPaletteSemanticNeutral", "Neutral color correct");

			oContext = {
				CriticalityByPlayer: "Critical",
				Speed: 3000
			};
			assert.ok(dpStyleRules[1].callback(oContext), "Critical dataPoints matched by callback");
			assert.equal(dpStyleRules[1].displayName, "Soso", "Critical use textProperty as displayName");
			assert.equal(dpStyleRules[1].properties.color, "sapUiChartPaletteSemanticCritical", "Critical color correct");

			oContext = {
				CriticalityByPlayer: "Negative",
				Speed: 2000
			};
			assert.ok(dpStyleRules[2].callback(oContext), "Negative dataPoints matched by callback");
			assert.equal(dpStyleRules[2].displayName, "Weak", "Negative use textProperty as displayName");
			assert.equal(dpStyleRules[2].properties.color, "sapUiChartPaletteSemanticBad", "Negative color correct");

			oChart.detachRenderComplete(checkCalculatedCb);
			oChart.attachEventOnce("renderComplete", null, checkDefaultCb);
			var dim = oChart.getDimensionByName("CriticalityByPlayer");
			//dim.bindProperty("textProperty", "CriticalityByPlayerD");
			//dim.setProperty("textProperty", null);
			dim.setTextProperty(null);
		}
		function checkDefaultCb() {
			oChart.detachRenderComplete(checkDefaultCb);
			oChart.attachEventOnce("renderComplete", null, checkLocaleCb);
			sap.ui.getCore().getConfiguration().setLanguage("de_DE");
			var dpStyleRules = oChart._oSemanticVizSettings.properties.plotArea.dataPointStyle.rules;
			assert.equal(dpStyleRules[0].displayName, "Neutral", "Neutral shows right");
			assert.equal(dpStyleRules[1].displayName, "Warning", "Warning shows right");
			assert.equal(dpStyleRules[2].displayName, "Bad", "Bad shows right");
		}
		function checkLocaleCb() {
			oChart.detachRenderComplete(checkLocaleCb);
			sap.ui.getCore().getConfiguration().setLanguage("en");
			var dpStyleRules = oChart._oSemanticVizSettings.properties.plotArea.dataPointStyle.rules;
			assert.equal(dpStyleRules[0].displayName, "Neutral", "Neutral is localed");
			assert.equal(dpStyleRules[1].displayName, "Warnung", "Warning is localed");
			assert.equal(dpStyleRules[2].displayName, "Schlecht", "Bad is localed");
			done();
		}
	});

	QUnit.test("Criticality.MeasureValues.Calculated - Measure", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '100%',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'visibleDimensions': ["Player"],
			'visibleMeasures': ["Speed"]
		});
		oChart.bindData({
			path: "/businessData"
		});

		oChart.placeAt("qunit-fixture");
		var oActiveColoring = {
			"coloring": ColoringType.Criticality
		};
		var oColorings = {
			Criticality: {
				MeasureValues: {
					Speed: {
						Calculated: "CriticalityByPlayerM",
						Legend:  {
                            Title: "Legend Title",
                            Critical: "Soso",
                            Negative: "Weak",
                            Neutral:  "Crossbench"
                        }
					}
				}
			}
		};
		oModel = new JSONModel(CalculdatedJSONData);
		oChart.setModel(oModel);
		oChart.setColorings(oColorings);
		oChart.setActiveColoring(oActiveColoring);
		oChart.addMeasure(new Measure({
			"name": "Speed"
		}));
		oChart.addDimension(new Dimension({
			"name": "Player"
		}));
		oChart.addMeasure(new Measure({
			"name": "CriticalityByPlayerM"
		}));
		oChart.attachEventOnce("renderComplete", null, checkCalculatedCb);

		function checkCalculatedCb() {
			var dpStyleRules = oChart._oSemanticVizSettings.properties.plotArea.dataPointStyle.rules;
			assert.equal(dpStyleRules.length, 3, "No Positive rules according to data");
			var oContext = {
				CriticalityByPlayerM: 0,
				Speed: 4000
			};
			assert.ok(dpStyleRules[0].callback(oContext), "Neutral dataPoints matched by callback");
			assert.equal(dpStyleRules[0].displayName, "Crossbench", "Neutral use textProperty as displayName");
			assert.equal(dpStyleRules[0].properties.color, "sapUiChartPaletteSemanticNeutral", "Neutral color correct");

			oContext = {
				CriticalityByPlayerM: 2,
				Speed: 3000
			};
			assert.ok(dpStyleRules[1].callback(oContext), "Critical dataPoints matched by callback");
			assert.equal(dpStyleRules[1].displayName, "Soso", "Critical use textProperty as displayName");
			assert.equal(dpStyleRules[1].properties.color, "sapUiChartPaletteSemanticCritical", "Critical color correct");

			oContext = {
				CriticalityByPlayerM: 1,
				Speed: 2000
			};
			assert.ok(dpStyleRules[2].callback(oContext), "Negative dataPoints matched by callback");
			assert.equal(dpStyleRules[2].displayName, "Weak", "Negative use textProperty as displayName");
			assert.equal(dpStyleRules[2].properties.color, "sapUiChartPaletteSemanticBad", "Negative color correct");

			done();
		}
	});

	QUnit.test("[HeatMap] Criticality.MeasureValues.ConstantThresholds - [Maximize]", function(assert) {
		var oActiveColoring = {
			"coloring": ColoringType.Criticality
		};
		var oColorings = {
			Criticality: {
				MeasureValues: {
					Profit: {
						ConstantThresholds: {
							AggregationLevels: [{
								VisibleDimensions: ["Country"],
								AcceptanceRangeLowValue: 200,
								ToleranceRangeLowValue: 150,
								DeviationRangeLowValue: 50
							}],
							ImprovementDirection: "Maximize"
						}
					}
				}
			}
		};
		var oDimMsr = {};
		oDimMsr.aMsr = msrs("Profit");
		oDimMsr.aDim = dims("Country");
		oDimMsr.aInResultDim = [];
		var oCandidateColoringSetting = Colorings.getCandidateSetting(oColorings, oActiveColoring, [], oDimMsr, {}, "heatmap");
		var oResult = oCandidateColoringSetting.ruleGenerator();
		assert.equal(oResult.colorScale.legendValues.length, 3);
		assert.equal(oResult.colorScale.palette.length, 2);
	});

	QUnit.test("Criticality.MeasureValues.ConstantThresholds - [Maximize]", function(assert) {
		var oActiveColoring = {
			"coloring": ColoringType.Criticality
		};
		var oColorings = {
			Criticality: {
				MeasureValues: {
					Profit: {
						ConstantThresholds: {
							AggregationLevels: [{
								VisibleDimensions: ["Country"],
								ToleranceRangeLowValue: 150,
								DeviationRangeLowValue: 50
							}],
							ImprovementDirection: "Maximize"
						}
					}
				}
			}
		};
		var oDimMsr = {};
		oDimMsr.aMsr = msrs("Profit");
		oDimMsr.aDim = dims("Country");
		oDimMsr.aInResultDim = [];
		var aTuples = [{
			"actual": "Profit",
			"labels": {
				"actual": "Profit"
			},
			"index": 0,
			"order": ["actual", "projected", "reference"]
		}];
		var oCandidateColoringSetting = Colorings.getCandidateSetting(oColorings, oActiveColoring, aTuples, oDimMsr);
		var oResult = MeasureSemanticsUtils.getSemanticVizSettings(
			'column',
			aTuples,
			oCandidateColoringSetting,
			false
		);
		var rules = oResult.properties.plotArea.dataPointStyle.rules;

		assert.equal(rules.length, 3, "[Maximize no breakdown] number of rules is correct");

		assert.ok(rules[0].callback({Profit: 200}), "[Maximize no breakdown] Positive callback passes inrange value");
		assert.ok(rules[0].callback({Profit: 150}), "[Maximize no breakdown] Positive callback passes lower bound");
		assert.notOk(rules[0].callback({Profit: 100}), "[Maximize no breakdown] Positive callback rejects outofrange value");
		assert.equal(rules[0].properties.color, "sapUiChartPaletteSemanticGood", "[Maximize no breakdown] Positive color is correct");
		assert.equal(rules[0].displayName, "Profit \u2265 150", "[Maximize no breakdown] Positive label is correct");

		assert.ok(rules[1].callback({Profit: 100}), "[Maximize no breakdown] Critical callback passes inrange value");
		assert.ok(rules[1].callback({Profit: 50}), "[Maximize no breakdown] Critical callback passes lower bound");
		assert.notOk(rules[1].callback({Profit: 150}), "[Maximize no breakdown] Critical callback rejects upper bound");
		assert.notOk(rules[1].callback({Profit: 200}), "[Maximize no breakdown] Critical callback rejects outofrange value");
		assert.equal(rules[1].properties.color, "sapUiChartPaletteSemanticCritical", "[Maximize no breakdown] Critical color is correct");
		assert.equal(rules[1].displayName, "50 \u2264 Profit < 150", "[Maximize no breakdown] Critical label is correct");

		assert.ok(rules[2].callback({Profit: 20}), "[Maximize no breakdown] Negative callback passes inrange value");
		assert.notOk(rules[2].callback({Profit: 50}), "[Maximize no breakdown] Negative callback rejects upper bound");
		assert.notOk(rules[2].callback({Profit: 100}), "[Maximize no breakdown] Negative callback rejects outofrange value");
		assert.equal(rules[2].properties.color, "sapUiChartPaletteSemanticBad", "[Maximize no breakdown] Negkative color is correct");
		assert.equal(rules[2].displayName, "Profit < 50", "[Maximize no breakdown] Negative label is correct");
	});

	QUnit.test("Criticality.MeasureValues.ConstantThresholds - [Maximize] 2", function(assert) {
		var oActiveColoring = {
			"coloring": ColoringType.Criticality
		};
		var oColorings = {
			Criticality: {
				MeasureValues: {
					Profit: {
						ConstantThresholds: {
							AggregationLevels: [{
								VisibleDimensions: ["Country"],
								AcceptanceRangeLowValue: 155,
								ToleranceRangeLowValue: 150,
								DeviationRangeLowValue: 50
							}, {
								// noise configuration (aggregation level not match)
								VisibleDimensions: ["Country", "Year"],
								AcceptanceRangeLowValue: 210,
								ToleranceRangeLowValue: 200,
								DeviationRangeLowValue: 0
							}],
							ImprovementDirection: "Maximize"
						}
					}
				}
			}
		};
		var oDimMsr = {};
		oDimMsr.aMsr = msrs("Profit");
		oDimMsr.aDim = dims("Country");
		oDimMsr.aInResultDim = [];
		var aTuples = [{
			"actual": "Profit",
			"labels": {
				"actual": "Profit"
			},
			"index": 0,
			"order": ["actual", "projected", "reference"]
		}];
		var oCandidateColoringSetting = Colorings.getCandidateSetting(oColorings, oActiveColoring, aTuples, oDimMsr);
		var oResult = oCandidateColoringSetting.ruleGenerator();
		var rules = oResult.properties.plotArea.dataPointStyle.rules;

		assert.equal(rules.length, 4, "[Maximize no breakdown] number of rules is correct");

		assert.ok(rules[0].callback({Profit: 200}), "[Maximize no breakdown] Positive callback passes inrange value");
		assert.ok(rules[0].callback({Profit: 155}), "[Maximize no breakdown] Positive callback passes lower bound");
		assert.notOk(rules[0].callback({Profit: 100}), "[Maximize no breakdown] Positive callback rejects outofrange value");
		assert.equal(rules[0].properties.color, "sapUiChartPaletteSemanticGood", "[Maximize no breakdown] Positive color is correct");
		assert.equal(rules[0].displayName, "Profit \u2265 155", "[Maximize no breakdown] Positive label is correct");

		assert.ok(rules[1].callback({Profit: 154}), "[Maximize no breakdown] Neutral callback passes inrange value");
		assert.ok(rules[1].callback({Profit: 150}), "[Maximize no breakdown] Neutral callback passes lower bound");
		assert.notOk(rules[1].callback({Profit: 149}), "[Maximize no breakdown] Neutral callback rejects upper bound");
		assert.notOk(rules[1].callback({Profit: 200}), "[Maximize no breakdown] Neutral callback rejects outofrange value");
		assert.equal(rules[1].properties.color, "sapUiChartPaletteSemanticNeutral", "[Maximize no breakdown] Neutral color is correct");
		assert.equal(rules[1].displayName, "150 \u2264 Profit < 155", "[Maximize no breakdown] Neutral label is correct");

		assert.ok(rules[2].callback({Profit: 100}), "[Maximize no breakdown] Critical callback passes inrange value");
		assert.ok(rules[2].callback({Profit: 50}), "[Maximize no breakdown] Critical callback passes lower bound");
		assert.notOk(rules[2].callback({Profit: 150}), "[Maximize no breakdown] Critical callback rejects upper bound");
		assert.notOk(rules[2].callback({Profit: 200}), "[Maximize no breakdown] Critical callback rejects outofrange value");
		assert.equal(rules[2].properties.color, "sapUiChartPaletteSemanticCritical", "[Maximize no breakdown] Critical color is correct");
		assert.equal(rules[2].displayName, "50 \u2264 Profit < 150", "[Maximize no breakdown] Critical label is correct");

		assert.ok(rules[3].callback({Profit: 20}), "[Maximize no breakdown] Negative callback passes inrange value");
		assert.notOk(rules[3].callback({Profit: 50}), "[Maximize no breakdown] Negative callback rejects upper bound");
		assert.notOk(rules[3].callback({Profit: 100}), "[Maximize no breakdown] Negative callback rejects outofrange value");
		assert.equal(rules[3].properties.color, "sapUiChartPaletteSemanticBad", "[Maximize no breakdown] Negkative color is correct");
		assert.equal(rules[3].displayName, "Profit < 50", "[Maximize no breakdown] Negative label is correct");


	});

	QUnit.test("Criticality.MeasureValues.ConstantThresholds - [Minimize]", function(assert) {
		var oActiveColoring = {
			"coloring": ColoringType.Criticality
		};
		var oColorings = {
			Criticality: {
				MeasureValues: {
					Profit: {
						ConstantThresholds: {
							AggregationLevels: [{
								VisibleDimensions: ["Country"],
								ToleranceRangeHighValue: 50,
								DeviationRangeHighValue: 150
							}],
							ImprovementDirection: "Minimize"
						}
					}
				}
			}
		};
		var oDimMsr = {};
		oDimMsr.aMsr = msrs("Profit");
		oDimMsr.aDim = dims("Country");
		oDimMsr.aInResultDim = [];
		var aTuples = [{
			"actual": "Profit",
			"labels": {
				"actual": "Profit"
			},
			"index": 0,
			"order": ["actual", "projected", "reference"]
		}];
		var oCandidateColoringSetting = Colorings.getCandidateSetting(oColorings, oActiveColoring, aTuples, oDimMsr);
		var oResult = MeasureSemanticsUtils.getSemanticVizSettings(
			'column',
			aTuples,
			oCandidateColoringSetting,
			false
			);
		var rules = oResult.properties.plotArea.dataPointStyle.rules;

		assert.equal(rules.length, 3, "[Minimize no breakdown] number of rules is correct");

		assert.ok(rules[0].callback({Profit: 20}), "[Minimize no breakdown] Positive callback passes inrange value");
		assert.ok(rules[0].callback({Profit: 50}), "[Minimize no breakdown] Positive callback passes upper bound");
		assert.notOk(rules[0].callback({Profit: 100}), "[Minimize no breakdown] Positive callback rejects outofrange value");
		assert.equal(rules[0].properties.color, "sapUiChartPaletteSemanticGood", "[Maximize no breakdown] Positive color is correct");
		assert.equal(rules[0].displayName, "Profit \u2264 50", "[Minimize no breakdown] Positive label is correct");

		assert.ok(rules[1].callback({Profit: 100}), "[Minimize no breakdown] Critical callback passes inrange value");
		assert.notOk(rules[1].callback({Profit: 50}), "[Minimize no breakdown] Critical callback rejects lower bound");
		assert.ok(rules[1].callback({Profit: 150}), "[Minimize no breakdown] Critical callback passes upper bound");
		assert.notOk(rules[1].callback({Profit: 200}), "[Minimize no breakdown] Critical callback rejects outofrange value");
		assert.equal(rules[1].properties.color, "sapUiChartPaletteSemanticCritical", "[Maximize no breakdown] Critical color is correct");
		assert.equal(rules[1].displayName, "50 < Profit \u2264 150", "[Minimize no breakdown] Critical label is correct");

		assert.ok(rules[2].callback({Profit: 200}), "[Minimize no breakdown] Negative callback passes inrange value");
		assert.notOk(rules[2].callback({Profit: 150}), "[Minimize no breakdown] Negative callback rejects lower bound");
		assert.notOk(rules[2].callback({Profit: 100}), "[Minimize no breakdown] Negative callback rejects outofrange value");
		assert.equal(rules[2].properties.color, "sapUiChartPaletteSemanticBad", "[Minimize no breakdown] Negative color is correct");
		assert.equal(rules[2].displayName, "Profit > 150", "[Minimize no breakdown] Negative label is correct");
	});

	QUnit.test("Criticality.MeasureValues.ConstantThresholds - [Target]", function(assert) {
		var oActiveColoring = {
			"coloring": ColoringType.Criticality
		};
		var oColorings = {
			Criticality: {
				MeasureValues: {
					Profit: {
						ConstantThresholds: {
							AggregationLevels: [{
								VisibleDimensions: ["Country"],
								ToleranceRangeHighValue: 100,
								ToleranceRangeLowValue: 60,
								DeviationRangeHighValue: 140,
								DeviationRangeLowValue: 20
							}],
							ImprovementDirection: "Target"
						}
					}
				}
			}
		};
		var oDimMsr = {};
		oDimMsr.aMsr = msrs("Profit");
		oDimMsr.aDim = dims("Country");
		oDimMsr.aInResultDim = [];
		var aTuples = [{
			"actual": "Profit",
			"labels": {
				"actual": "Profit"
			},
			"index": 0,
			"order": ["actual", "projected", "reference"]
		}];
		var oCandidateColoringSetting = Colorings.getCandidateSetting(oColorings, oActiveColoring, aTuples, oDimMsr);
		var oResult = MeasureSemanticsUtils.getSemanticVizSettings(
			'column',
			aTuples,
			oCandidateColoringSetting,
			false
		);
		var rules = oResult.properties.plotArea.dataPointStyle.rules;

		assert.equal(rules.length, 3, "[Target no breakdown] number of rules is correct");

		assert.ok(rules[0].callback({Profit: 80}), "[Target no breakdown] Positive callback passes inrange value");
		assert.ok(rules[0].callback({Profit: 60}), "[Target no breakdown] Positive callback passes upper bound");
		assert.ok(rules[0].callback({Profit: 100}), "[Target no breakdown] Positive callback passes lower bound");
		assert.notOk(rules[0].callback({Profit: 110}), "[Target no breakdown] Positive callback rejects outofrange value");
		assert.equal(rules[0].properties.color, "sapUiChartPaletteSemanticGood", "[Target no breakdown] Positive color is correct");
		assert.equal(rules[0].displayName, "60 \u2264 Profit \u2264 100", "[Target no breakdown] Positive label is correct");

		assert.ok(rules[1].callback({Profit: 50}), "[Target no breakdown] Critical callback passes inrange (left) value");
		assert.ok(rules[1].callback({Profit: 110}), "[Target no breakdown] Critical callback passes inrange (right) value");
		assert.ok(rules[1].callback({Profit: 20}), "[Target no breakdown] Critical callback passes lower bound (left)");
		assert.notOk(rules[1].callback({Profit: 60}), "[Target no breakdown] Critical callback rejects upper bound (left)");
		assert.notOk(rules[1].callback({Profit: 100}), "[Target no breakdown] Critical callback rejects lower bound (right)");
		assert.ok(rules[1].callback({Profit: 140}), "[Target no breakdown] Critical callback passes upper bound (right)");
		assert.notOk(rules[1].callback({Profit: 200}), "[Target no breakdown] Critical callback rejects outofrange value");
		assert.equal(rules[1].properties.color, "sapUiChartPaletteSemanticCritical", "[Target no breakdown] Critical color is correct");
		assert.equal(rules[1].displayName, "20 \u2264 Profit < 60 , 100 < Profit \u2264 140", "[Target no breakdown] Critical label is correct");

		assert.ok(rules[2].callback({Profit: 10}), "[Target no breakdown] Negative callback passes inrange (left) value");
		assert.ok(rules[2].callback({Profit: 170}), "[Target no breakdown] Negative callback passes inrange (right) value");
		assert.notOk(rules[2].callback({Profit: 20}), "[Target no breakdown] Negative callback rejects upper (left) bound");
		assert.notOk(rules[2].callback({Profit: 140}), "[Target no breakdown] Negative callback rejects lower (right) bound");
		assert.notOk(rules[2].callback({Profit: 110}), "[Target no breakdown] Negative callback rejects outofrange value");
		assert.equal(rules[2].properties.color, "sapUiChartPaletteSemanticBad", "[Target no breakdown] Negative color is correct");
		assert.equal(rules[2].displayName, "Profit < 20 , Profit > 140", "[Target no breakdown] Negative label is correct");
	});

	QUnit.test("Criticality.MeasureValues.DynamicThresholds - [Maximize]", function(assert) {
		var oActiveColoring = {
			"coloring": ColoringType.Criticality
		};
		var oColorings = {
			Criticality: {
				MeasureValues: {
					Profit: {
						DynamicThresholds: {
							ImprovementDirection: "Maximize",
							ToleranceRangeLowValue: "ProfitTRLow",
							DeviationRangeLowValue: "ProfitDVLow"
						},
						Legend: {
							Title: "ProfitCriticality",
							Positive: "Good Profit",
							Negative: "Bad Profit",
							Critical: "Warning Profit"
						}
					}
				}
			}
		};

		var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.chart.messages");

		var oDimMsr = {};
		oDimMsr.aMsr = msrs("Profit");
		oDimMsr.aDim = dims("Country");
		oDimMsr.aInResultDim = [];
		oDimMsr.allMsr = ["Profit", "ProfitTRLow", "ProfitDVLow"];
		var aTuples = [{
			"actual": "Profit",
			"labels": {
				"actual": "Profit"
			},
			"index": 0,
			"order": ["actual", "projected", "reference"]
		}];
		var oCandidateColoringSetting = Colorings.getCandidateSetting(oColorings, oActiveColoring, aTuples, oDimMsr, null, null, oBundle);
		var oResult = MeasureSemanticsUtils.getSemanticVizSettings(
			'column',
			aTuples,
			oCandidateColoringSetting,
			false
			);
		var rules = oResult.properties.plotArea.dataPointStyle.rules;

		assert.deepEqual(oCandidateColoringSetting.additionalMeasures.sort(compareStr), ["ProfitDVLow", "ProfitTRLow", "ProfitTRLow"], "additional measures are detected");

		assert.equal(rules[0].displayName, "Good Profit", "Legend customization for Positive correct");
		assert.ok(rules[0].callback({
			Profit: 120,
			ProfitTRLow: 100
		}), "Positive callback passes inrange value using value from another measure as threshold");
		assert.notOk(rules[0].callback({
			Profit: 120,
			ProfitTRLow: 130
		}), "Positive callback rejects out of range value using value from another measure as threshold");

		assert.equal(rules[1].displayName, "Warning Profit", "Legend customization for Critical correct");
		assert.ok(rules[1].callback({
			Profit: 90,
			ProfitDVLow: 50,
			ProfitTRLow: 150
		}), "Critical callback passes inrange value using value from another measure as threshold");
		assert.notOk(rules[1].callback({
			Profit: 90,
			ProfitDVLow: 30,
			ProfitTRLow: 80
		}), "Critical callback rejects out of range value using value from another measure as threshold");

		assert.equal(rules[2].displayName, "Bad Profit", "Legend customization for Negative correct");
		assert.ok(rules[2].callback({
			Profit: 40,
			ProfitDVLow: 50
		}), "Negative callback passes inrange value using value from another measure as threshold");
		assert.notOk(rules[2].callback({
			Profit: 40,
			ProfitDVLow: 30
		}), "Negative callback rejects out of range value using value from another measure as threshold");
	});

	QUnit.test("Criticality.MeasureValues.DynamicThresholds - [Minimize]", function(assert) {
		var oActiveColoring = {
			"coloring": ColoringType.Criticality
		};
		var oColorings = {
			Criticality: {
				MeasureValues: {
					Profit: {
						DynamicThresholds: {
							ImprovementDirection: "Minimize",
							ToleranceRangeHighValue: "ProfitTRHigh",
							DeviationRangeHighValue: "ProfitDVHigh"
						},
						Legend: {
							Title: "ProfitCriticality",
							Positive: "Good Profit",
							Negative: "Bad Profit",
							Critical: "Warning Profit"
						}
					}
				}
			}
		};
		var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.chart.messages");

		var oDimMsr = {};
		oDimMsr.aMsr = msrs("Profit");
		oDimMsr.aDim = dims("Country");
		oDimMsr.aInResultDim = [];
		oDimMsr.allMsr = ["Profit", "ProfitTRHigh", "ProfitDVHigh"];
		var aTuples = [{
			"actual": "Profit",
			"labels": {
				"actual": "Profit"
			},
			"index": 0,
			"order": ["actual", "projected", "reference"]
		}];
		var oCandidateColoringSetting = Colorings.getCandidateSetting(oColorings, oActiveColoring, aTuples, oDimMsr, null, null, oBundle);
		var oResult = MeasureSemanticsUtils.getSemanticVizSettings(
			'column',
			aTuples,
			oCandidateColoringSetting,
			false
		);
		var rules = oResult.properties.plotArea.dataPointStyle.rules;

		assert.deepEqual(oCandidateColoringSetting.additionalMeasures.sort(compareStr), ["ProfitDVHigh", "ProfitTRHigh", "ProfitTRHigh"], "additional measures are detected");

		assert.equal(rules[0].displayName, "Good Profit", "Legend customization for Positive correct");
		assert.ok(rules[0].callback({
			Profit: 40,
			ProfitTRHigh: 50
		}), "Positive callback passes inrange value using value from another measure as threshold");
		assert.notOk(rules[0].callback({
			Profit: 40,
			ProfitTRHigh: 30
		}), "Positive callback rejects out of range value using value from another measure as threshold");

		assert.equal(rules[1].displayName, "Warning Profit", "Legend customization for Critical correct");
		assert.ok(rules[1].callback({
			Profit: 90,
			ProfitDVHigh: 150,
			ProfitTRHigh: 50
		}), "Critical callback passes inrange value using value from another measure as threshold");
		assert.notOk(rules[1].callback({
			Profit: 90,
			ProfitDVHigh: 80,
			ProfitTRHigh: 30
		}), "Critical callback rejects out of range value using value from another measure as threshold");

		assert.equal(rules[2].displayName, "Bad Profit", "Legend customization for Negative correct");
		assert.ok(rules[2].callback({
			Profit: 120,
			ProfitDVHigh: 100
		}), "Negative callback passes inrange value using value from another measure as threshold");
		assert.notOk(rules[2].callback({
			Profit: 120,
			ProfitDVHigh: 130
		}), "Negative callback rejects out of range value using value from another measure as threshold");
	});

	QUnit.test("Criticality.MeasureValues.DynamicThresholds - [Target]", function(assert) {
		var oActiveColoring = {
			"coloring": ColoringType.Criticality
		};
		var oColorings = {
			Criticality: {
				MeasureValues: {
					Profit: {
						DynamicThresholds: {
							ImprovementDirection: "Target",
							ToleranceRangeHighValue: "ProfitTRHigh",
							DeviationRangeHighValue: "ProfitDVHigh",
							ToleranceRangeLowValue: "ProfitTRLow",
							DeviationRangeLowValue: "ProfitDVLow"
						},
						Legend: {
							Title: "ProfitCriticality",
							Positive: "Good Profit",
							Negative: "Bad Profit",
							Critical: "Warning Profit"
						}
					}
				}
			}
		};
		var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.chart.messages");

		var oDimMsr = {};
		oDimMsr.aMsr = msrs("Profit");
		oDimMsr.aDim = dims("Country");
		oDimMsr.aInResultDim = [];
		oDimMsr.allMsr = ["Profit", "ProfitTRHigh", "ProfitDVHigh", "ProfitTRLow", "ProfitDVLow"];
		var aTuples = [{
			"actual": "Profit",
			"labels": {
				"actual": "Profit"
			},
			"index": 0,
			"order": ["actual", "projected", "reference"]
		}];
		var oCandidateColoringSetting = Colorings.getCandidateSetting(oColorings, oActiveColoring, aTuples, oDimMsr, null, null, oBundle);
		var oResult = MeasureSemanticsUtils.getSemanticVizSettings(
			'column',
			aTuples,
			oCandidateColoringSetting,
			false
		);
		var rules = oResult.properties.plotArea.dataPointStyle.rules;

		assert.deepEqual(oCandidateColoringSetting.additionalMeasures.sort(compareStr), ["ProfitDVHigh", "ProfitDVLow", "ProfitTRHigh",  "ProfitTRHigh", "ProfitTRLow", "ProfitTRLow"], "additional measures are detected");

		assert.equal(rules[0].displayName, "Good Profit", "Legend customization for Positive correct");
		assert.ok(rules[0].callback({
			Profit: 80,
			ProfitDVHigh: 140,
			ProfitDVLow: 20,
			ProfitTRHigh: 100,
			ProfitTRLow: 60
		}), "Positive callback passes inrange value using value from another measure as threshold");
		assert.notOk(rules[0].callback({
			Profit: 80,
			ProfitDVHigh: 140,
			ProfitDVLow: 20,
			ProfitTRHigh: 100,
			ProfitTRLow: 90
		}), "Positive callback rejects out of range value using value from another measure as threshold");

		assert.equal(rules[1].displayName, "Warning Profit", "Legend customization for Critical correct");
		assert.ok(rules[1].callback({
			Profit: 50,
			ProfitDVHigh: 140,
			ProfitDVLow: 20,
			ProfitTRHigh: 100,
			ProfitTRLow: 60
		}), "Critical callback passes inrange value using value from another measure as threshold (left)");
		assert.ok(rules[1].callback({
			Profit: 120,
			ProfitDVHigh: 140,
			ProfitDVLow: 20,
			ProfitTRHigh: 100,
			ProfitTRLow: 60
		}), "Critical callback passes inrange value using value from another measure as threshold (right)");
		assert.notOk(rules[1].callback({
			Profit: 50,
			ProfitDVHigh: 140,
			ProfitDVLow: 20,
			ProfitTRHigh: 100,
			ProfitTRLow: 40
		}), "Critical callback rejects out of range value using value from another measure as threshold (left)");
		assert.notOk(rules[1].callback({
			Profit: 120,
			ProfitDVHigh: 115,
			ProfitDVLow: 20,
			ProfitTRHigh: 100,
			ProfitTRLow: 40
		}), "Critical callback rejects out of range value using value from another measure as threshold (right)");

		assert.equal(rules[2].displayName, "Bad Profit", "Legend customization for Negative correct");
		assert.ok(rules[2].callback({
			Profit: 150,
			ProfitDVHigh: 140,
			ProfitDVLow: 20,
			ProfitTRHigh: 100,
			ProfitTRLow: 60
		}), "Negative callback passes inrange value using value from another measure as threshold (right)");
		assert.notOk(rules[2].callback({
			Profit: 150,
			ProfitDVHigh: 160,
			ProfitDVLow: 20,
			ProfitTRHigh: 100,
			ProfitTRLow: 60
		}), "Negative callback rejects out of range value using value from another measure as threshold (right)");

		assert.ok(rules[2].callback({
			Profit: 15,
			ProfitDVHigh: 140,
			ProfitDVLow: 20,
			ProfitTRHigh: 100,
			ProfitTRLow: 60
		}), "Negative callback passes inrange value using value from another measure as threshold (left)");
		assert.notOk(rules[2].callback({
			Profit: 15,
			ProfitDVHigh: 110,
			ProfitDVLow: 10,
			ProfitTRHigh: 100,
			ProfitTRLow: 60
		}), "Negative callback rejects out of range value using value from another measure as threshold (left)");
	});

	QUnit.test("Criticality.DimensionValues", function(assert) {
		var oActiveColoring = {
			coloring: ColoringType.Criticality,
			params: {
				dimension: "Country"
			}
		};
		var oColorings = {
			Criticality: {
				DimensionValues: {
					Country: {
						Positive: {
							Values: ["China", "USA", "Japan"],
							Legend: "CUA"
						},
						Critical: {
							Values: ["India"]
						},
						Negative: {
							Values: ["Iran", "North Korea"],
							Legend: "IN"
						}
					}
				}
			}
		};

		var oDimMsr = {};
		oDimMsr.aMsr = [];
		oDimMsr.aDim = dims("Country");
		oDimMsr.aInResultDim = [];
		var aTuples = [{
			"actual": "Profit",
			"labels": {
				"actual": "Profit"
			},
			"index": 0,
			"order": ["actual", "projected", "reference"]
		}];
		var oCandidateColoringSetting = Colorings.getCandidateSetting(oColorings, oActiveColoring, aTuples, oDimMsr);
		var oResult = MeasureSemanticsUtils.getSemanticVizSettings(
			'column',
			aTuples,
			oCandidateColoringSetting,
			false
		);
		var rules = oResult.properties.plotArea.dataPointStyle.rules;

		assert.equal(rules[0].displayName, "CUA", "Legend customization for Positive correct");
		assert.ok(rules[0].callback({
			Country: "Japan"
		}), "Positive [no breakdown] callback let through the specified value");
		assert.notOk(rules[0].callback({
			Country: "North Korea"
		}), "Positive [no breakdown] callback rejects the unspecified value");

		assert.equal(rules[1].displayName, "India", "Legend for Critical correct");
		assert.ok(rules[1].callback({
			Country: "India"
		}), "Critical [no breakdown] callback let through the specified value");
		assert.notOk(rules[1].callback({
			Country: "Singapore"
		}), "Critical [no breakdown] callback rejects the unspecified value");

		assert.equal(rules[2].displayName, "IN", "Legend customization for Negative correct");
		assert.ok(rules[2].callback({
			Country: "Iran"
		}), "Negative [no breakdown] callback let through the specified value");
		assert.notOk(rules[2].callback({
			Country: "India"
		}), "Negative [no breakdown] callback rejects the unspecified value");
	});

	QUnit.test("Criticality aggregation test", function(assert) {
		var oActiveColoring = {
			coloring: ColoringType.Criticality
		};
		var oColorings = {
			Criticality: {
				MeasureValues: {
					Profit: {
						ConstantThresholds: {
							ImprovementDirection: "Maximize",
							AggregationLevels: [{
								ToleranceRangeLowValue: 150,
								DeviationRangeLowValue: 50,
								VisibleDimensions: ["Country"]
							}]
						}
					}
				}
			}
		};

		var oDimMsr = {};
		oDimMsr.aMsr = msrs("Profit");
		oDimMsr.aDim = dims("City");
		oDimMsr.aInResultDim = [];
		var aTuples = [{
			"actual": "Profit",
			"labels": {
				"actual": "Profit"
			},
			"index": 0,
			"order": ["actual", "projected", "reference"]
		}];
		try {
			Colorings.getCandidateSetting(oColorings, oActiveColoring, aTuples, oDimMsr);
		} catch (e) {
			if (e instanceof ChartLog) {
				assert.ok(true, 'throw error log when aggregation level does not match');
			}
		}

	});

	QUnit.test("Emphasis.DimensionValues", function(assert) {
		var oActiveColoring = {
			coloring: ColoringType.Emphasis,
			parameters: {
				dimension: "Country"
			}
		};
		var oColorings = {
			Emphasis: {
				DimensionValues: {
					Country: {
						Values: ["China", "USA"],
						Legend: {
							Highlighted: "Highlighted Country",
							Others: "Other Country"
						}
					}
				}
			}
		};

		var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.chart.messages");

		var oDimMsr = {};
		oDimMsr.aMsr = [];
		oDimMsr.aDim = dims("Country");
		oDimMsr.aInResultDim = [];
		var aTuples = [{
			"actual": "Profit",
			"labels": {
				"actual": "Profit"
			},
			"index": 0,
			"order": ["actual", "projected", "reference"]
		}];
		var oCandidateColoringSetting = Colorings.getCandidateSetting(oColorings, oActiveColoring, aTuples, oDimMsr, null, null, oBundle);
		var oResult = MeasureSemanticsUtils.getSemanticVizSettings(
			'column',
			aTuples,
			oCandidateColoringSetting,
			false
		);
		var dataPointStyle = oResult.properties.plotArea.dataPointStyle;
		var rules = dataPointStyle.rules;
		var others = dataPointStyle.others;

		assert.equal(rules[0].displayName, "Highlighted Country", "Legend customization for Highlighted correct");
		assert.equal(rules[0].properties.color, "sapUiChartPaletteQualitativeHue2", "Highlighted color correct");
		assert.ok(rules[0].callback({
			Country: "China"
		}), "Positive [no breakdown] callback let through the specified value");
		assert.notOk(rules[0].callback({
			Country: "North Korea"
		}), "Positive [no breakdown] callback rejects the unspecified value");

		assert.equal(others.displayName, "Other Country", "Legend for Others correct");
		assert.equal(others.properties.color, "sapUiChartPaletteQualitativeHue1", "Others color correct");
	});

	QUnit.test("Criticality.MeasureValues.ConstantThresholds - [Maximize for Heatmap]", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '500px',
			'height': '600px',
			'chartType': 'heatmap',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'visibleDimensions': ["Player"],
			'visibleMeasures': ["Speed"]
		});
		oChart.bindData({
			path: "/businessData"
		});

		oChart.placeAt("qunit-fixture");
		var oColorings = {
			Criticality: {
				MeasureValues: {
					Speed: {
						ConstantThresholds: {
							AggregationLevels: [{
								// noise configuration (aggregation level not match)
								VisibleDimensions: ["Year"],
								ToleranceRangeLowValue: 100,
								DeviationRangeLowValue: 80
							}, {
								VisibleDimensions: ["Player"],
								ToleranceRangeLowValue: 3000,
								DeviationRangeLowValue: 2000
							}, {
								// noise configuration (aggregation level not match)
								VisibleDimensions: ["Country", "Year"],
								ToleranceRangeLowValue: 200,
								DeviationRangeLowValue: 0
							}],
							ImprovementDirection: "Maximize"
						}
					}
				}
			}
		};
		var oActiveColoring = {
			coloring: ColoringType.Criticality
		};
		oModel = new JSONModel(CalculdatedJSONData);
		oChart.setModel(oModel);
		oChart.setColorings(oColorings);
		oChart.setActiveColoring(oActiveColoring);
		oChart.addMeasure(new Measure({
			"name": "Speed"
		}));
		oChart.addDimension(new Dimension({
			"name": "Player"
		}));

		function checkCb() {
			var expectedScale = {
				"feed": "color",
				"palette": [
					"sapUiChartPaletteSemanticBad",
					"sapUiChartPaletteSemanticCritical",
					"sapUiChartPaletteSemanticGood"
				],
				"numOfSegments": 3,
				"legendValues": [1298, 2000, 3000, 4875]
			};
			assert.deepEqual(this.getVizScales()[0], expectedScale);
			oChart.detachRenderComplete(checkCb);
			done();
		}
		oChart.attachRenderComplete(null, checkCb);
	});

	QUnit.test("Criticality.MeasureValues.ConstantThresholds - [Test Filter]", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '500px',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'visibleDimensions': ["Player"],
			'visibleMeasures': ["Speed"]
		});

		var oFilter = new Filter({
			path: 'CriticalityByPlayer',
			operator: FilterOperator.EQ,
			value1: 'Critical'
		});

		oChart.bindData({
			path: "/businessData",
			filters: [oFilter]
		});

		oChart.placeAt("qunit-fixture");
		var oColorings = {
			Criticality: {
				MeasureValues: {
					Speed: {
						ConstantThresholds: {
							AggregationLevels: [{
								VisibleDimensions: ["Player"],
								ToleranceRangeLowValue: 3000,
								DeviationRangeLowValue: 2000
							}],
							ImprovementDirection: "Maximize"
						}
					}
				}
			}
		};
		var oActiveColoring = {
			coloring: ColoringType.Criticality
		};
		oModel = new JSONModel(CalculdatedJSONData);
		oChart.setModel(oModel);
		oChart.setColorings(oColorings);
		oChart.setActiveColoring(oActiveColoring);
		oChart.addMeasure(new Measure({
			"name": "Speed"
		}));
		oChart.addDimension(new Dimension({
			"name": "Player"
		}));

		function checkApplicationFilterCb() {
			assert.equal(oChart._oSemanticVizSettings.properties.plotArea.dataPointStyle.rules.length, 3, 'Application level filter initialized by bindData(), keep coloring');
			oFilter = new Filter({
				path: 'Player',
				operator: FilterOperator.EQ,
				value1: 'Player7'
			});
			oChart.getBinding('data').filter(oFilter);
			oChart.attachEventOnce('renderComplete', checkControlFilterCb);
		}

		function checkControlFilterCb() {
			assert.equal(oChart._oSemanticVizSettings.properties.plotArea.dataPointStyle.rules.length, 0, 'Control level filter set by user, clear coloring');
			done();
		}

		oChart.attachEventOnce('renderComplete', checkApplicationFilterCb);
	});

	QUnit.test("Gradation.RankedMeasureValues.SingleColorScheme - [NumberOfLevels]", function(assert) {
		var oActiveColoring = {
			"coloring": ColoringType.Gradation
		};
		var oColorings = {
			"Gradation": {
				"RankedMeasureValues": {
					"Age": {
						"SingleColorScheme": {
							"NumberOfLevels": 6
						}
					}
				}
			}
		};

		var oDimMsr = {};
		oDimMsr.aMsr = msrs("Age");
		oDimMsr.aDim = dims("Name");
		oDimMsr.aInResultDim = [];
		var aTuples = [{
			"actual": "Age",
			"labels": {
				"actual": "Age"
			},
			"index": 0,
			"order": ["actual", "projected", "reference"],
			"valueAxisID": "color"
		}];

		var oCandidateColoringSetting = Colorings.getCandidateSetting(oColorings, oActiveColoring, aTuples, oDimMsr, {}, 'heatmap');
		var oResult = MeasureSemanticsUtils.getSemanticVizSettings(
			'heatmap',
			aTuples,
			oCandidateColoringSetting,
			false
		);
		var scales = oResult.scales;
		assert.equal(scales[0].numOfSegments, 6, "The numOfSegments should be 6.");
		assert.deepEqual(scales[0].palette, ColorPalette.GRADATION.SingleColorScheme.NoSemantics, "The color palette should be ColorPalette.GRADATION.SingleColorScheme.NoSemantics by default.");
	});

	QUnit.test("Gradation.RankedMeasureValues.SingleColorScheme - [RankingPerAggregationLevel]", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '500px',
			'height': '600px',
			'chartType': 'heatmap',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'visibleDimensions': ["Player"],
			'visibleMeasures': ["Speed"]
		});
		oChart.bindData({
			path: "/businessData"
		});

		oChart.placeAt("qunit-fixture");
		var oColorings = {
			"Gradation": {
				"RankedMeasureValues": {
					"Speed": {
						"SingleColorScheme": {
							"Scheme": "Positive",
							"Saturation":"DarkToLight",
							"RankingPerAggregationLevel": [
								{
									"VisibleDimensions": ["Player"],
									"LevelBoundaries": [2000, 3000, 4000]
								}
							]
						}
					}
				}
			}
		};
		var oActiveColoring = {
			coloring: ColoringType.Gradation
		};
		oModel = new JSONModel(CalculdatedJSONData);
		oChart.setModel(oModel);
		oChart.setColorings(oColorings);
		oChart.setActiveColoring(oActiveColoring);
		oChart.addMeasure(new Measure({
			"name": "Speed"
		}));
		oChart.addDimension(new Dimension({
			"name": "Player"
		}));

		function checkCb() {
			var expectedScale = {
				"feed": "color",
				"legendValues": [
					1298,
					2000,
					3000,
					4000,
					4875
				],
				"numOfSegments": 4,
				"palette": [
					"sapUiChartPaletteSemanticGoodDark1",
					"sapUiChartPaletteSemanticGood",
					"sapUiChartPaletteSemanticGoodLight1",
					"sapUiChartPaletteSemanticGoodLight2"
				]
			};
			assert.deepEqual(this.getVizScales()[0], expectedScale, 'The color scale is not correct');
			oChart.detachRenderComplete(checkCb);
			done();
		}
		oChart.attachRenderComplete(null, checkCb);
	});

	QUnit.test("Gradation.RankedMeasureValues.DivergingColorScheme", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '500px',
			'height': '600px',
			'chartType': 'heatmap',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'visibleDimensions': ["Player"],
			'visibleMeasures': ["Speed"]
		});
		oChart.bindData({
			path: "/businessData"
		});

		oChart.placeAt("qunit-fixture");
		var oColorings = {
			"Gradation": {
				"RankedMeasureValues": {
					"Speed": {
						"DivergingColorScheme": {
							"Scheme": "PositiveToNegative",
							"NumberOfLevels": {
								"BelowMidArea": 3,
								"AboveMidArea": 3
							},
							"RankingPerAggregationLevel": [
								{
									"VisibleDimensions": ["Player"],
									"MidAreaLowValue": 2500,
									"MidAreaHighValue": 3500
								}
							]
						}
					}
				}
			}
		};
		var oActiveColoring = {
			coloring: ColoringType.Gradation
		};
		oModel = new JSONModel(CalculdatedJSONData);
		oChart.setModel(oModel);
		oChart.setColorings(oColorings);
		oChart.setActiveColoring(oActiveColoring);
		oChart.addMeasure(new Measure({
			"name": "Speed"
		}));
		oChart.addDimension(new Dimension({
			"name": "Player"
		}));

		function checkCb() {
			var expectedScale = {
				"feed": "color",
				"legendValues": [
					1298,
					1699,
					2100,
					2500,
					3500,
					3959,
					4418,
					4875
				],
				"maxNumOfSegments": 13,
				"numOfSegments": 7,
				"palette": [
					"sapUiChartPaletteSemanticGoodDark2",
					"sapUiChartPaletteSemanticGood",
					"sapUiChartPaletteSemanticGoodLight2",
					"sapUiChartPaletteSequentialNeutral",
					"sapUiChartPaletteSemanticBadLight2",
					"sapUiChartPaletteSemanticBad",
					"sapUiChartPaletteSemanticBadDark2"
				]
			};
			assert.deepEqual(this.getVizScales()[0], expectedScale, 'The color scale is not correct');
			oChart.detachRenderComplete(checkCb);
			done();
		}
		oChart.attachRenderComplete(null, checkCb);
	});

	QUnit.test("Gradation.RankedMeasureValues.TargetColorScheme", function(assert) {
		var done = assert.async();
		oChart = new Chart({
			'width': '500px',
			'height': '600px',
			'chartType': 'heatmap',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'visibleDimensions': ["Player"],
			'visibleMeasures': ["Speed"]
		});
		oChart.bindData({
			path: "/businessData"
		});

		oChart.placeAt("qunit-fixture");
		var oColorings = {
			"Gradation": {
				"RankedMeasureValues": {
					"Speed": {
						"TargetColorScheme": {
							"Scheme": "PositiveTarget",
							"NumberOfLevels": {
								"BelowTargetMidpoint": 6,
								"AboveTargetMidpoint": 6
							},
							"RankingPerAggregationLevel": [
								{
									"VisibleDimensions": ["Player"],
									"TargetMidpoint": 2800
								}
							]
						}
					}
				}
			}
		};
		var oActiveColoring = {
			coloring: ColoringType.Gradation
		};
		oModel = new JSONModel(CalculdatedJSONData);
		oChart.setModel(oModel);
		oChart.setColorings(oColorings);
		oChart.setActiveColoring(oActiveColoring);
		oChart.addMeasure(new Measure({
			"name": "Speed"
		}));
		oChart.addDimension(new Dimension({
			"name": "Player"
		}));

		function checkCb() {
			var expectedScale = {
				"feed": "color",
				"legendValues": [
					1298,
					1549,
					1800,
					2051,
					2302,
					2553,
					2800,
					3146,
					3492,
					3838,
					4184,
					4530,
					4875
				],
				"maxNumOfSegments": 13,
				"numOfSegments": 12,
				"palette": [
					"sapUiChartPaletteSemanticBad",
					"sapUiChartPaletteSemanticBadLight2",
					"sapUiChartPaletteSemanticCriticalLight1",
					"sapUiChartPaletteSemanticCriticalLight3",
					"sapUiChartPaletteSemanticGoodLight2",
					"sapUiChartPaletteSemanticGood",
					"sapUiChartPaletteSemanticGood",
					"sapUiChartPaletteSemanticGoodLight2",
					"sapUiChartPaletteSemanticCriticalLight3",
					"sapUiChartPaletteSemanticCriticalLight1",
					"sapUiChartPaletteSemanticBadLight2",
					"sapUiChartPaletteSemanticBad"
				]
			};
			assert.deepEqual(this.getVizScales()[0], expectedScale, 'The color scale is not correct');
			oChart.detachRenderComplete(checkCb);
			done();
		}
		oChart.attachRenderComplete(null, checkCb);
	});

	QUnit.test("Gradation.DelineatedMeasures", function(assert) {
		var oActiveColoring = {
			"coloring": ColoringType.Gradation
		};
		var oColorings = {
			"Gradation": {
				"DelineatedMeasures": {
					"Saturation": "DarkToLight",
					"Levels": ["Draw", "Lose", "Win"]
				}
			}
		};

		var oDimMsr = {};
		oDimMsr.aMsr = msrs("Win", "Draw", "Lose");
		oDimMsr.aDim = dims("Name");
		oDimMsr.aInResultDim = [];
		var aTuples = [{
			"actual": "Win",
			"labels": {
				"actual": "Win"
			},
			"index": 0,
			"order": ["actual", "projected", "reference"]
		}, {
			"actual": "Draw",
			"labels": {
				"actual": "Draw"
			},
			"index": 1,
			"order": ["actual", "projected", "reference"]
		}, {
			"actual": "Lose",
			"labels": {
				"actual": "Lose"
			},
			"index": 2,
			"order": ["actual", "projected", "reference"]
		}];

		var oCandidateColoringSetting = Colorings.getCandidateSetting(oColorings, oActiveColoring, aTuples, oDimMsr);
		var oResult = MeasureSemanticsUtils.getSemanticVizSettings(
			'column',
			aTuples,
			oCandidateColoringSetting,
			false
		);
		var rules = oResult.properties.plotArea.dataPointStyle.rules;
		assert.ok(rules[0].callback({
			Draw: 20
		}), "Draw callback should return true");
		assert.equal(rules[0].displayName, "Draw", "Draw displayName on legend should be Draw");
		assert.equal(rules[0].properties.color, "sapUiChartPaletteSemanticNeutralDark2", "Draw color should be sapUiChartPaletteSemanticNeutralDark2");
		assert.ok(rules[1].callback({
			Lose: 25
		}), "Lose callback should return true");
		assert.equal(rules[1].displayName, "Lose", "Lose displayName on legend should be Lose");
		assert.equal(rules[1].properties.color, "sapUiChartPaletteSemanticNeutral", "Lose color should be sapUiChartPaletteSemanticNeutral");
		assert.ok(rules[2].callback({
			Win: 30
		}), "Win callback should return true");
		assert.equal(rules[2].displayName, "Win", "Win displayName on legend should be Win");
		assert.equal(rules[2].properties.color, "sapUiChartPaletteSemanticNeutralLight2", "Win color should be sapUiChartPaletteSemanticNeutralLight2");
	});

	QUnit.test("Gradation.DelineatedDimensionValues", function(assert) {
		var oActiveColoring = {
			"coloring": ColoringType.Gradation
		};
		var oColorings = {
			"Gradation": {
				"DelineatedDimensionValues": {
					"Saturation": "DarkToLight",
					"Fitness": {
						"Levels": ["Injured", "Normal", "Superb", "Tired"]
					}
				}
			}
		};

		var oDimMsr = {};
		oDimMsr.aMsr = msrs("Age");
		oDimMsr.aDim = dims("Fitness");
		oDimMsr.aInResultDim = [];
		var aTuples = [{
			"actual": "Age",
			"labels": {
				"actual": "Age"
			},
			"index": 0,
			"order": ["actual", "projected", "reference"]
		}];

		var oCandidateColoringSetting = Colorings.getCandidateSetting(oColorings, oActiveColoring, aTuples, oDimMsr);
		var oResult = MeasureSemanticsUtils.getSemanticVizSettings(
			'column',
			aTuples,
			oCandidateColoringSetting,
			false
		);
		var rules = oResult.properties.plotArea.dataPointStyle.rules;
		assert.ok(rules[0].callback({
			Fitness: 'Injured'
		}), "Injured callback should return true");
		assert.equal(rules[0].displayName, "Injured", "Injured displayName on legend should be Injured");
		assert.equal(rules[0].properties.color, "sapUiChartPaletteSemanticNeutralDark1", "Injured color should be sapUiChartPaletteSemanticNeutralDark1");
		assert.ok(rules[1].callback({
			Fitness: 'Normal'
		}), "Normal callback should return true");
		assert.equal(rules[1].displayName, "Normal", "Normal displayName on legend should be Normal");
		assert.equal(rules[1].properties.color, "sapUiChartPaletteSemanticNeutral", "Normal color should be sapUiChartPaletteSemanticNeutral");
		assert.ok(rules[2].callback({
			Fitness: 'Superb'
		}), "Superb callback should return true");
		assert.equal(rules[2].displayName, "Superb", "Superb displayName on legend should be Superb");
		assert.equal(rules[2].properties.color, "sapUiChartPaletteSemanticNeutralLight1", "Superb color should be sapUiChartPaletteSemanticNeutralLight1");
		assert.ok(rules[3].callback({
			Fitness: 'Tired'
		}), "Tired callback should return true");
		assert.equal(rules[3].displayName, "Tired", "Tired displayName on legend should be Tired");
		assert.equal(rules[3].properties.color, "sapUiChartPaletteSemanticNeutralLight2", "Tired color should be sapUiChartPaletteSemanticNeutralLight2");
	});

	QUnit.start();

});
