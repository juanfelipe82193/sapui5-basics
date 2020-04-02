/*global QUnit, mockADataService, timeYearmonthday */

QUnit.config.autostart = false;

sap.ui.require([
	'sap/chart/Chart',
	'sap/ui/model/odata/ODataModel',
	'sap/ui/model/json/JSONModel',
	'sap/chart/ColoringType',
	'sap/chart/data/Dimension',
	'sap/chart/data/TimeDimension',
	'sap/chart/TimeUnitType',
	'sap/chart/data/Measure'
], function(
	Chart,
	ODataModel,
	JSONModel,
	ColoringType,
	Dimension,
	TimeDimension,
	TimeUnitType,
	Measure
) {
	"use strict";

	var oModel, oChart;

	QUnit.module('PatternColoring Test', {
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

	function mockify(sOrignalUrl, sMockdsPath, bIsAnalytical) {
		var sDataUrl = sOrignalUrl.replace(/^(http|https):\/\//, 'http://mocked.');
		mockADataService({
			url: sDataUrl,
			metadata: '../qunit/mockds/' + sMockdsPath + '/metadata.xml',
			mockdata: '../qunit/mockds/' + sMockdsPath + '/data'
		}, bIsAnalytical);
		return sDataUrl;
	}

	var sDataURL = mockify('http://localhost:8000/UI5/ODataServices/football.xsodata','football', true);

	function createChart(bOData, aDims, aMsrs) {
		oChart = new Chart({
			'width': '800px',
			'height': '600px',
			'chartType': 'column',
			'uiConfig': {
				'applicationSet': 'fiori'
			},
			'visibleDimensions': aDims,
			'visibleMeasures': aMsrs
		});

		aDims.forEach(function(oDim) {
			if (oDim.type === 'TimeDimension') {
				oDim = new TimeDimension({
					name: oDim.name,
					label: oDim.name,
					timeUnit: oDim.timeUnit
				});
			} else {
				oDim = new Dimension({
					name: oDim,
					label: oDim
				});
			}
			oChart.addDimension(oDim);
		});

		aMsrs.forEach(function(sMsr) {
			var oMsr = new Measure({
				name: sMsr,
				label: sMsr
			});
			oChart.addMeasure(oMsr);
		});

		var oModel, sResultPath;
		if (bOData) {
			oModel = new ODataModel(sDataURL, true);
			sResultPath = '/football';
		} else {
			oModel = new JSONModel(timeYearmonthday);
			sResultPath = '/businessData';
		}
		oChart.setModel(oModel);
		oChart.bindData({
			path: sResultPath
		});
		oChart.placeAt('qunit-fixture');
	}

	QUnit.test('Criticality.MeasureValues.Static with Semantic Pattern', function(assert) {
		var done = assert.async();
		var aDims = ['Country'];
		var aMsrs = ['Win', 'Draw', 'Lose', 'Height', 'Weight', 'Goals', 'Assists', 'GoalsDLBoundary', 'GoalsTLBoundary'];
		createChart(true, aDims, aMsrs);
		oChart.setActiveColoring({
			'coloring': ColoringType.Criticality,
			'parameters': {
				'measure': [
					'Win',
					'Draw',
					'Weight',
					'Goals'
				]
			}
		});
		oChart.setColorings({
			'Criticality': {
				'MeasureValues': {
					'Weight': {
						'Static': 'Negative'
					},
					'Win': {
						'Static': 'Positive'
					},
					'Draw': {
						'Static': 'Critical'
					},
					'Goals': {
						'Static': 'Neutral'
					}
				}
			}
		});

		/*
		   Positive: #0_Win(ACT)* - #1_Height(PROJ)
		   Neutral: #2_Goals(PROJ)*
		   Critical: #3_Draw(REF)*
		   Negative: #4_Lose(ACT) - #5_Weight(REF)*
		   Unmentioned1: #6_Assists(ACT) - #7_GoalsDLBoundary(PROJ)
		   Unmentioned2: #8_GoalsTLBoundary(REF)
		*/
		oChart.getMeasureByName('Height').setSemantics('projected');
		oChart.getMeasureByName('Weight').setSemantics('reference');
		oChart.getMeasureByName('Draw').setSemantics('reference');
		oChart.getMeasureByName('Goals').setSemantics('projected');
		oChart.getMeasureByName('GoalsDLBoundary').setSemantics('projected');
		oChart.getMeasureByName('GoalsTLBoundary').setSemantics('reference');
		oChart.getMeasureByName('Win').setSemanticallyRelatedMeasures({
			'projectedValueMeasure': 'Height'
		});
		oChart.getMeasureByName('Lose').setSemanticallyRelatedMeasures({
			'referenceValueMeasure': 'Weight'
		});
		oChart.getMeasureByName('Assists').setSemanticallyRelatedMeasures({
			'projectedValueMeasure': 'GoalsDLBoundary'
		});

		oChart.attachEventOnce('renderComplete', function() {
			var aRules = this._oSemanticVizSettings.properties.plotArea.dataPointStyle.rules;
			var oRule;

			// #0_Win: Positive, ACT
			oRule = aRules[0];
			assert.ok(oRule.callback({'Win': 10}), '[Win] callback for checking specified measure');
			assert.equal(oRule.displayName, 'Win', '[Win] using measure name as legend item label');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticGood",
				'pattern': undefined
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Win] check semantic properties');

			// #1_Height: Positive, PROJ
			oRule = aRules[1];
			assert.ok(oRule.callback({'Height': 180}), '[Height] callback for checking specified measure');
			assert.equal(oRule.displayName, 'Height', '[Height] using measure name as legend item label');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticGood",
				'pattern': "diagonalLightStripe"
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Height] check semantic properties');

			// #2_Goals: Neutral, PROJ
			oRule = aRules[2];
			assert.ok(oRule.callback({'Goals': 30}), '[Goals] callback for checking specified measure');
			assert.equal(oRule.displayName, 'Goals', '[Goals] using measure name as legend item label');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticNeutral",
				'pattern': "diagonalLightStripe"
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Goals] check semantic properties');

			// #3_Draw: Critical, REF
			oRule = aRules[3];
			assert.ok(oRule.callback({'Draw': 5}), '[Draw] callback for checking specified measure');
			assert.equal(oRule.displayName, 'Draw', '[Draw] using measure name as legend item label');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticCritical",
				'pattern': "noFill"
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Draw] check semantic properties');

			// #4_Lose: Negative, ACT
			oRule = aRules[4];
			assert.ok(oRule.callback({'Lose': 2}), '[Lose] callback for checking specified measure');
			assert.equal(oRule.displayName, 'Lose', '[Lose] using measure name as legend item label');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticBad",
				'pattern': undefined
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Lose] check semantic properties');

			// #5_Weight: Negative, REF
			oRule = aRules[5];
			assert.ok(oRule.callback({'Weight': 70}), '[Weight] callback for checking specified measure');
			assert.equal(oRule.displayName, 'Weight', '[Weight] using measure name as legend item label');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticBad",
				'pattern': "noFill"
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Weight] check semantic properties');

			// #6_Assists: Unmentioned1, ACT
			oRule = aRules[6];
			assert.ok(oRule.callback({'Assists': 25}), '[Assists] callback for checking specified measure');
			assert.equal(oRule.displayName, 'Assists', '[Assists] using measure name as legend item label');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticNeutralLight2",
				'pattern': undefined
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Assists] check semantic properties');

			// #7_GoalsDLBoundary: Unmentioned1, PROJ
			oRule = aRules[7];
			assert.ok(oRule.callback({'GoalsDLBoundary': 15}), '[GoalsDLBoundary] callback for checking specified measure');
			assert.equal(oRule.displayName, 'GoalsDLBoundary', '[GoalsDLBoundary] using measure name as legend item label');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticNeutralLight2",
				'pattern': "diagonalLightStripe"
			};
			assert.deepEqual(oRule.properties, expectedProps, '[GoalsDLBoundary] check semantic properties');

			// #8_GoalsTLBoundary: Unmentioned2, REF
			oRule = aRules[8];
			assert.ok(oRule.callback({'GoalsTLBoundary': 25}), '[GoalsTLBoundary] callback for checking specified measure');
			assert.equal(oRule.displayName, 'GoalsTLBoundary', '[GoalsTLBoundary] using measure name as legend item label');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticNeutralDark2",
				'pattern': "noFill"
			};
			assert.deepEqual(oRule.properties, expectedProps, '[GoalsTLBoundary] check semantic properties');

			done();
		});
	});

	QUnit.test('Criticality.MeasureValues.Static with Semantic Pattern and projectedValueStartTime', function(assert) {
		var done = assert.async();
		var aDims = [{name: 'Date', type: 'TimeDimension', timeUnit: TimeUnitType.yearmonthday}];
		var aMsrs = ['Actual', 'Profit-Actual', 'Forecast'];
		createChart(false, aDims, aMsrs);

		/*
		Negative: [#0_Actual(ACT) - #1_Profit-Actual(PROJ)*] - #3_Forecast(REF)
		*/
		oChart.getMeasureByName('Profit-Actual').setSemantics('projected');
		oChart.getMeasureByName('Forecast').setSemantics('reference');
		oChart.getMeasureByName('Actual').setSemanticallyRelatedMeasures({
			'projectedValueMeasure': 'Profit-Actual',
			'referenceValueMeasure': 'Forecast'
		});
		oChart.getDimensionByName('Date').setProjectedValueStartTime('20120107');

		oChart.setActiveColoring({
			'coloring': ColoringType.Criticality,
			'parameters': {
				'measure': [
					'Profit-Actual'
				]
			}
		});
		oChart.setColorings({
			'Criticality': {
				'MeasureValues': {
					'Profit-Actual': {
						'Static': 'Negative'
					}
				}
			}
		});

		oChart.attachEventOnce('renderComplete', function() {
			var aRules = this._oSemanticVizSettings.properties.plotArea.dataPointStyle.rules;
			var oRule;

			// #0_Actual: Negative, ACT
			oRule = aRules[0];
			assert.ok(oRule.callback({
				'Actual': 70,
				'Actual-Profit-Actual': 70,
				'Profit-Actual': 80,
				'Date': 1325347200000
			}), '[Actual] callback for checking specified measure');
			assert.equal(oRule.displayName, 'Actual', '[Actual] using measure name as legend item label');
			assert.deepEqual(oRule.dataName, {'Actual-Profit-Actual': "Actual"}, '[Actual] use Actual as dataName');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticBad",
				'pattern': undefined
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Actual] check semantic properties');

			// #1_Profit-Actual: Negative, PRO
			oRule = aRules[1];
			assert.ok(oRule.callback({
				'Actual': 90,
				'Actual-Profit-Actual': 90,
				'Profit-Actual': 50,
				'Date': 1325952000000
			}), '[Profit-Actual] callback for checking specified measure');
			assert.equal(oRule.displayName, 'Profit-Actual', '[Profit-Actual] using measure name as legend item label');
			assert.deepEqual(oRule.dataName, {'Actual-Profit-Actual': "Profit-Actual"}, '[Profit-Actual] use Profit-Actual as dataName');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticBad",
				'pattern': 'diagonalLightStripe'
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Profit-Actual] check semantic properties');

			// #2_Forecast: Negative, REF
			oRule = aRules[2];
			assert.ok(oRule.callback({
				'Actual': 90,
				'Profit-Actual': 50,
				'Forecast': 100
			}), '[Forecast] callback for checking specified measure');
			assert.equal(oRule.displayName, 'Forecast', '[Forecast] using measure name as legend item label');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticBad",
				'pattern': 'noFill'
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Forecast] check semantic properties');

			done();
		});
	});

	QUnit.test('Criticality.MeasureValues.ConstantThresholds with Semantic Pattern', function(assert) {
		var done = assert.async();
		var aDims = ['Country'];
		var aMsrs = ['Age', 'Height', 'Weight', 'Win'];
		createChart(true, aDims, aMsrs);
		oChart.setActiveColoring({
			'coloring': ColoringType.Criticality
		});
		oChart.setColorings({
			"Criticality": {
				"MeasureValues": {
					"Age": {
						"ConstantThresholds": {
							"AggregationLevels": [{
								"VisibleDimensions": ["Country"],
								"DeviationRangeLowValue": 20,
								"ToleranceRangeLowValue": 25
							}],
							"ImprovementDirection": "Maximize"
						}
					}
				}
			}
		});

		/*
		   Coloring: #0_Age(PROJ)* - #1_Height(ACT) - #2_Weight(REF)
		   Unmentioned1: #3_Win(PROJ)
		*/
		oChart.getMeasureByName('Age').setSemantics('projected');
		oChart.getMeasureByName('Weight').setSemantics('reference');
		oChart.getMeasureByName('Win').setSemantics('projected');
		oChart.getMeasureByName('Height').setSemanticallyRelatedMeasures({
			'projectedValueMeasure': 'Age',
			'referenceValueMeasure': 'Weight'
		});

		oChart.attachEventOnce('renderComplete', function() {
			var aRules = this._oSemanticVizSettings.properties.plotArea.dataPointStyle.rules;
			var oRule;

			// #0_Age: Positive, PROJ
			oRule = aRules[0];
			assert.ok(oRule.callback({'Age': 25}), '[Age] callback for checking Positive');
			assert.equal(oRule.displayName, 'Age ' + '\u2265' + ' 25', '[Age] using range as legend item label');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticGood",
				'pattern': "diagonalLightStripe"
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Age] check semantic properties');

			// #0_Age: Critical, PROJ
			oRule = aRules[1];
			assert.ok(oRule.callback({'Age': 21}), '[Age] callback for checking Critical');
			assert.equal(oRule.displayName, "20 " + "\u2264" + " Age < 25", '[Age] using range as legend item label');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticCritical",
				'pattern': "diagonalLightStripe"
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Age] check semantic properties');

			// #0_Age: Negative, PROJ
			oRule = aRules[2];
			assert.ok(oRule.callback({'Age': 18}), '[Age] callback for checking Negative');
			assert.equal(oRule.displayName, "Age < 20", '[Age] using range as legend item label');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticBad",
				'pattern': "diagonalLightStripe"
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Age] check semantic properties');

			// #1_Height: Unmentioned, ACT
			oRule = aRules[3];
			assert.ok(oRule.callback({
				'Height': 180
			}), '[Height] callback for checking specified measure');
			assert.equal(oRule.displayName, 'Height', '[Height] using measure name as legend item label');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticNeutral",
				'pattern': undefined
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Height] check semantic properties');

			// #2_Weight: Unmentioned, REF
			oRule = aRules[4];
			assert.ok(oRule.callback({
				'Weight': 70
			}), '[Weight] callback for checking specified measure');
			assert.equal(oRule.displayName, 'Weight', '[Weight] using measure name as legend item label');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticNeutral",
				'pattern': 'noFill'
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Weight] check semantic properties');

			// #3_Win: Unmentioned, PROJ
			oRule = aRules[5];
			assert.ok(oRule.callback({
				'Win': 25
			}), '[Win] callback for checking specified measure');
			assert.equal(oRule.displayName, 'Win', '[Win] using measure name as legend item label');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticNeutralLight2",
				'pattern': 'diagonalLightStripe'
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Win] check semantic properties');

			done();
		});
	});

	QUnit.test('Criticality.MeasureValues.ConstantThresholds with Semantic Pattern and projectedValueStartTime', function(assert) {
		var done = assert.async();
		var aDims = [{name: 'Date', type: 'TimeDimension', timeUnit: TimeUnitType.yearmonthday}];
		var aMsrs = ['Actual', 'Profit-Actual', 'Forecast'];
		createChart(false, aDims, aMsrs);

		/*
		[#0_Actual(ACT)* - #1_Profit-Actual(PROJ)] - #2_Forecast(REF)
		*/
		oChart.getMeasureByName('Profit-Actual').setSemantics('projected');
		oChart.getMeasureByName('Forecast').setSemantics('reference');
		oChart.getMeasureByName('Actual').setSemanticallyRelatedMeasures({
			'projectedValueMeasure': 'Profit-Actual',
			'referenceValueMeasure': 'Forecast'
		});
		oChart.getDimensionByName('Date').setProjectedValueStartTime('20120107');

		oChart.setActiveColoring({
			'coloring': ColoringType.Criticality
		});
		oChart.setColorings({
			"Criticality": {
				"MeasureValues": {
					"Actual": {
						"ConstantThresholds": {
							"AggregationLevels": [{
								"DeviationRangeLowValue": 20,
								"ToleranceRangeLowValue": 25
							}],
							"ImprovementDirection": "Maximize"
						}
					}
				}
			}
		});

		oChart.attachEventOnce('renderComplete', function() {
			var aRules = this._oSemanticVizSettings.properties.plotArea.dataPointStyle.rules;
			var oRule;

			// #0_Actual: Positive, ACT
			oRule = aRules[0];
			assert.ok(oRule.callback({
				'Actual': 25,
				'Actual-Profit-Actual': 25,
				'Profit-Actual': 30,
				'Date': 1325635200000
			}), '[Actual] callback for checking Actual Positive');
			assert.equal(oRule.displayName, 'Actual ' + '\u2265' + ' 25', '[Actual] using range as legend item label');
			assert.deepEqual(oRule.dataName, {'Actual-Profit-Actual': "Actual"}, '[Actual] use Actual as dataName');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticGood",
				'pattern': undefined
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Actual] check semantic properties');

			// #0_Actual: Critical, ACT
			oRule = aRules[1];
			assert.ok(oRule.callback({
				'Actual': 21,
				'Actual-Profit-Actual': 21,
				'Profit-Actual': 40,
				'Date': 1325635200000
			}), '[Actual] callback for checking Actual Critical');
			assert.equal(oRule.displayName, "20 " + "\u2264" + " Actual < 25", '[Actual] using range as legend item label');
			assert.deepEqual(oRule.dataName, {'Actual-Profit-Actual': "Actual"}, '[Actual] use Actual as dataName');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticCritical",
				'pattern': undefined
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Actual] check semantic properties');

			// #0_Actual: Negative, ACT
			oRule = aRules[2];
			assert.ok(oRule.callback({
				'Actual': 18,
				'Actual-Profit-Actual': 18,
				'Profit-Actual': 20,
				'Date': 1325635200000
			}), '[Actual] callback for checking Actual Negative');
			assert.equal(oRule.displayName, 'Actual < 20', '[Actual] using range as legend item label');
			assert.deepEqual(oRule.dataName, {'Actual-Profit-Actual': "Actual"}, '[Actual] use Actual as dataName');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticBad",
				'pattern': undefined
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Actual] check semantic properties');

			// #1_Profit-Actual: Unmentioned, PROJ
			oRule = aRules[3];
			assert.ok(oRule.callback({
				'Actual': 18,
				'Actual-Profit-Actual': 30,
				'Profit-Actual': 30,
				'Date': 1326153600000
			}), '[Profit-Actual] callback for checking specified measure');
			assert.equal(oRule.displayName, 'Profit-Actual', '[Profit-Actual] using measure name as legend item label');
			assert.deepEqual(oRule.dataName, {'Actual-Profit-Actual': "Profit-Actual"}, '[Profit-Actual] use Profit-Actual as dataName');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticNeutral",
				'pattern': "diagonalLightStripe"
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Profit-Actual] check semantic properties');

			// #2_Forecast: Unmentioned, REF
			oRule = aRules[4];
			assert.ok(oRule.callback({
				'Forecast': 33,
				'Date': 1325635200000
			}), '[Forecast] callback for checking specified measure');
			assert.equal(oRule.displayName, 'Forecast', '[Forecast] using measure name as legend item label');
			var expectedProps = {
				"color": "sapUiChartPaletteSemanticNeutral",
				'pattern': "noFill"
			};
			assert.deepEqual(oRule.properties, expectedProps, '[Forecast] check semantic properties');

			done();
		});
	});

	QUnit.start();

});
