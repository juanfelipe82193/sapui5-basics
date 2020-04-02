/* eslint-disable consistent-return */
/* global QUnit */
sap.ui.define(
	["sap/ui/thirdparty/sinon", "sap/fe/macros/microchart/MicroChartHelper", "sap/base/Log", "sap/ui/thirdparty/sinon-qunit"],
	function(sinon, MicroChartHelper, Log) {
		"use strict";
		// var sandbox = sinon.sandbox.create();

		QUnit.module("Unit Test for getCriticalityCalculationBinding");
		QUnit.test("Unit test to check getCriticalityCalculationBinding with the expression", function(assert) {
			[
				{
					improvementDirection: "UI.ImprovementDirectionType/Maximize",
					value: "{expV}",
					deviationLow: "{expDL}",
					toleranceLow: "{expTL}",
					acceptanceLow: "{expAL}",
					acceptanceHigh: "{expAH}",
					toleranceHigh: "{expTH}",
					deviationHigh: "{expDH}",
					bExpectedValue:
						"{= %{expV} >= %{expAL} ? 'Good' : %{expV} >= %{expTL} ? 'Neutral' : (%{expDL} && %{expV} >= %{expDL}) ? 'Critical' : 'Error' }",
					sMessage: "works with maximize direction"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Minimize",
					value: "{expV}",
					deviationLow: "{expDL}",
					toleranceLow: "{expTL}",
					acceptanceLow: "{expAL}",
					acceptanceHigh: "{expAH}",
					toleranceHigh: "{expTH}",
					deviationHigh: "{expDH}",
					bExpectedValue:
						"{= %{expV} <= %{expAH} ? 'Good' : %{expV} <= %{expTH} ? 'Neutral' : (%{expDH} && %{expV} <= %{expDH}) ? 'Critical' : 'Error' }",
					sMessage: "works with minimize direction"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Target",
					value: "{expV}",
					deviationLow: "{expDL}",
					toleranceLow: "{expTL}",
					acceptanceLow: "{expAL}",
					acceptanceHigh: "{expAH}",
					toleranceHigh: "{expTH}",
					deviationHigh: "{expDH}",
					bExpectedValue:
						"{= (%{expV} <= %{expAH} && %{expV} >= %{expAL}) ? 'Good' : ((%{expV} >= %{expTL} && %{expV} < %{expAL}) || (%{expV} > %{expAH} && %{expV} <= %{expTH})) ? 'Neutral' : ((%{expDL} && (%{expV} >= %{expDL}) && (%{expV} < %{expTL})) || ((%{expV} > %{expTH}) && %{expDH} && (%{expV} <= %{expDH}))) ? 'Critical' : 'Error' }",
					sMessage: "works with target direction"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Maximize",
					value: "{expV}",
					deviationLow: "{expDL}",
					toleranceLow: "{expTL}",
					toleranceHigh: "{expTH}",
					deviationHigh: "{expDH}",
					bExpectedValue:
						"{= %{expV} >= %{expTL} ? 'Good' : %{expV} >= %{expTL} ? 'Neutral' : (%{expDL} && %{expV} >= %{expDL}) ? 'Critical' : 'Error' }",
					sMessage: "works with maximize direction without acceptance values"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Maximize",
					value: "{expV}",
					deviationLow: "{expDL}",
					acceptanceLow: "{expAL}",
					acceptanceHigh: "{expAH}",
					deviationHigh: "{expDH}",
					bExpectedValue:
						"{= %{expV} >= %{expAL} ? 'Good' : %{expV} >= %{expDL} ? 'Neutral' : (%{expDL} && %{expV} >= %{expDL}) ? 'Critical' : 'Error' }",
					sMessage: "works with maximize direction without tolerance values"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Maximize",
					value: "{expV}",
					toleranceLow: "{expTL}",
					acceptanceLow: "{expAL}",
					acceptanceHigh: "{expAH}",
					toleranceHigh: "{expTH}",
					bExpectedValue:
						"{= %{expV} >= %{expAL} ? 'Good' : %{expV} >= %{expTL} ? 'Neutral' : (-Infinity && %{expV} >= -Infinity) ? 'Critical' : 'Error' }",
					sMessage: "works with maximize direction without deviation values"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Minimize",
					value: "{expV}",
					deviationLow: "{expDL}",
					toleranceLow: "{expTL}",
					toleranceHigh: "{expTH}",
					deviationHigh: "{expDH}",
					bExpectedValue:
						"{= %{expV} <= %{expTH} ? 'Good' : %{expV} <= %{expTH} ? 'Neutral' : (%{expDH} && %{expV} <= %{expDH}) ? 'Critical' : 'Error' }",
					sMessage: "works with minimize direction without acceptance values"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Minimize",
					value: "{expV}",
					deviationLow: "{expDL}",
					acceptanceLow: "{expAL}",
					acceptanceHigh: "{expAH}",
					deviationHigh: "{expDH}",
					bExpectedValue:
						"{= %{expV} <= %{expAH} ? 'Good' : %{expV} <= %{expDH} ? 'Neutral' : (%{expDH} && %{expV} <= %{expDH}) ? 'Critical' : 'Error' }",
					sMessage: "works with minimixe direction without tolerance values"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Minimize",
					value: "{expV}",
					toleranceLow: "{expTL}",
					acceptanceLow: "{expAL}",
					acceptanceHigh: "{expAH}",
					toleranceHigh: "{expTH}",
					bExpectedValue:
						"{= %{expV} <= %{expAH} ? 'Good' : %{expV} <= %{expTH} ? 'Neutral' : (Infinity && %{expV} <= Infinity) ? 'Critical' : 'Error' }",
					sMessage: "works with minimize direction without deviation values"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Target",
					value: "{expV}",
					deviationLow: "{expDL}",
					toleranceLow: "{expTL}",
					toleranceHigh: "{expTH}",
					deviationHigh: "{expDH}",
					bExpectedValue:
						"{= (%{expV} <= %{expTH} && %{expV} >= %{expTL}) ? 'Good' : ((%{expV} >= %{expTL} && %{expV} < %{expTL}) || (%{expV} > %{expTH} && %{expV} <= %{expTH})) ? 'Neutral' : ((%{expDL} && (%{expV} >= %{expDL}) && (%{expV} < %{expTL})) || ((%{expV} > %{expTH}) && %{expDH} && (%{expV} <= %{expDH}))) ? 'Critical' : 'Error' }",
					sMessage: "works with target direction without acceptance values"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Target",
					value: "{expV}",
					deviationLow: "{expDL}",
					acceptanceLow: "{expAL}",
					acceptanceHigh: "{expAH}",
					deviationHigh: "{expDH}",
					bExpectedValue:
						"{= (%{expV} <= %{expAH} && %{expV} >= %{expAL}) ? 'Good' : ((%{expV} >= %{expDL} && %{expV} < %{expAL}) || (%{expV} > %{expAH} && %{expV} <= %{expDH})) ? 'Neutral' : ((%{expDL} && (%{expV} >= %{expDL}) && (%{expV} < %{expDL})) || ((%{expV} > %{expDH}) && %{expDH} && (%{expV} <= %{expDH}))) ? 'Critical' : 'Error' }",
					sMessage: "works with target direction without tolerance values"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Target",
					value: "{expV}",
					toleranceLow: "{expTL}",
					acceptanceLow: "{expAL}",
					acceptanceHigh: "{expAH}",
					toleranceHigh: "{expTH}",
					bExpectedValue:
						"{= (%{expV} <= %{expAH} && %{expV} >= %{expAL}) ? 'Good' : ((%{expV} >= %{expTL} && %{expV} < %{expAL}) || (%{expV} > %{expAH} && %{expV} <= %{expTH})) ? 'Neutral' : ((-Infinity && (%{expV} >= -Infinity) && (%{expV} < %{expTL})) || ((%{expV} > %{expTH}) && Infinity && (%{expV} <= Infinity))) ? 'Critical' : 'Error' }",
					sMessage: "works with target direction without deviation values"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Maximize",
					value: "{expV}",
					deviationLow: 500,
					toleranceLow: 1000,
					acceptanceLow: 1500,
					acceptanceHigh: 2000,
					toleranceHigh: 2500,
					deviationHigh: 3000,
					bExpectedValue:
						"{= %{expV} >= 1500 ? 'Good' : %{expV} >= 1000 ? 'Neutral' : (500 && %{expV} >= 500) ? 'Critical' : 'Error' }",
					sMessage: "works with decimal and maximize direction"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Minimize",
					value: "{expV}",
					deviationLow: 500,
					toleranceLow: 1000,
					acceptanceLow: 1500,
					acceptanceHigh: 2000,
					toleranceHigh: 2500,
					deviationHigh: 3000,
					bExpectedValue:
						"{= %{expV} <= 2000 ? 'Good' : %{expV} <= 2500 ? 'Neutral' : (3000 && %{expV} <= 3000) ? 'Critical' : 'Error' }",
					sMessage: "works with decimal and minimize direction"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Target",
					value: "{expV}",
					deviationLow: 500,
					toleranceLow: 1000,
					acceptanceLow: 1500,
					acceptanceHigh: 2000,
					toleranceHigh: 2500,
					deviationHigh: 3000,
					bExpectedValue:
						"{= (%{expV} <= 2000 && %{expV} >= 1500) ? 'Good' : ((%{expV} >= 1000 && %{expV} < 1500) || (%{expV} > 2000 && %{expV} <= 2500)) ? 'Neutral' : ((500 && (%{expV} >= 500) && (%{expV} < 1000)) || ((%{expV} > 2500) && 3000 && (%{expV} <= 3000))) ? 'Critical' : 'Error' }",
					sMessage: "works with decimal and target direction"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Maximize",
					value: "{expV}",
					deviationLow: 500,
					toleranceLow: 1000,
					toleranceHigh: 2500,
					deviationHigh: 3000,
					bExpectedValue:
						"{= %{expV} >= 1000 ? 'Good' : %{expV} >= 1000 ? 'Neutral' : (500 && %{expV} >= 500) ? 'Critical' : 'Error' }",
					sMessage: "works with decimal and maximize direction without acceptance values"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Maximize",
					value: "{expV}",
					deviationLow: 500,
					acceptanceLow: 1500,
					acceptanceHigh: 2000,
					deviationHigh: 3000,
					bExpectedValue:
						"{= %{expV} >= 1500 ? 'Good' : %{expV} >= 500 ? 'Neutral' : (500 && %{expV} >= 500) ? 'Critical' : 'Error' }",
					sMessage: "works with decimal and maximize direction without tolerance values"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Maximize",
					value: "{expV}",
					toleranceLow: 1000,
					acceptanceLow: 1500,
					acceptanceHigh: 2000,
					toleranceHigh: 2500,
					bExpectedValue:
						"{= %{expV} >= 1500 ? 'Good' : %{expV} >= 1000 ? 'Neutral' : (-Infinity && %{expV} >= -Infinity) ? 'Critical' : 'Error' }",
					sMessage: "works with decimal and maximize direction without deviation values"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Minimize",
					value: "{expV}",
					deviationLow: 500,
					toleranceLow: 1000,
					toleranceHigh: 2500,
					deviationHigh: 3000,
					bExpectedValue:
						"{= %{expV} <= 2500 ? 'Good' : %{expV} <= 2500 ? 'Neutral' : (3000 && %{expV} <= 3000) ? 'Critical' : 'Error' }",
					sMessage: "works with decimal and minimize direction without acceptance values"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Minimize",
					value: "{expV}",
					deviationLow: 500,
					acceptanceLow: 1500,
					acceptanceHigh: 2000,
					deviationHigh: 3000,
					bExpectedValue:
						"{= %{expV} <= 2000 ? 'Good' : %{expV} <= 3000 ? 'Neutral' : (3000 && %{expV} <= 3000) ? 'Critical' : 'Error' }",
					sMessage: "works with decimal and minimixe direction without tolerance values"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Minimize",
					value: "{expV}",
					toleranceLow: 1000,
					acceptanceLow: 1500,
					acceptanceHigh: 2000,
					toleranceHigh: 2500,
					bExpectedValue:
						"{= %{expV} <= 2000 ? 'Good' : %{expV} <= 2500 ? 'Neutral' : (Infinity && %{expV} <= Infinity) ? 'Critical' : 'Error' }",
					sMessage: "works with decimal and minimize direction without deviation values"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Target",
					value: "{expV}",
					deviationLow: 500,
					toleranceLow: 1000,
					toleranceHigh: 2500,
					deviationHigh: 3000,
					bExpectedValue:
						"{= (%{expV} <= 2500 && %{expV} >= 1000) ? 'Good' : ((%{expV} >= 1000 && %{expV} < 1000) || (%{expV} > 2500 && %{expV} <= 2500)) ? 'Neutral' : ((500 && (%{expV} >= 500) && (%{expV} < 1000)) || ((%{expV} > 2500) && 3000 && (%{expV} <= 3000))) ? 'Critical' : 'Error' }",
					sMessage: "works with decimal and target direction without acceptance values"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Target",
					value: "{expV}",
					deviationLow: 500,
					acceptanceLow: 1500,
					acceptanceHigh: 2000,
					deviationHigh: 3000,
					bExpectedValue:
						"{= (%{expV} <= 2000 && %{expV} >= 1500) ? 'Good' : ((%{expV} >= 500 && %{expV} < 1500) || (%{expV} > 2000 && %{expV} <= 3000)) ? 'Neutral' : ((500 && (%{expV} >= 500) && (%{expV} < 500)) || ((%{expV} > 3000) && 3000 && (%{expV} <= 3000))) ? 'Critical' : 'Error' }",
					sMessage: "works with decimal and target direction without tolerance values"
				},
				{
					improvementDirection: "UI.ImprovementDirectionType/Target",
					value: "{expV}",
					toleranceLow: 1000,
					acceptanceLow: 1500,
					acceptanceHigh: 2000,
					toleranceHigh: 2500,
					bExpectedValue:
						"{= (%{expV} <= 2000 && %{expV} >= 1500) ? 'Good' : ((%{expV} >= 1000 && %{expV} < 1500) || (%{expV} > 2000 && %{expV} <= 2500)) ? 'Neutral' : ((-Infinity && (%{expV} >= -Infinity) && (%{expV} < 1000)) || ((%{expV} > 2500) && Infinity && (%{expV} <= Infinity))) ? 'Critical' : 'Error' }",
					sMessage: "works with decimal and target direction without deviation values"
				}
			].forEach(function(oProperty) {
				var actualValue = MicroChartHelper.getCriticalityCalculationBinding(
					oProperty.improvementDirection,
					oProperty.value,
					oProperty.deviationLow,
					oProperty.toleranceLow,
					oProperty.acceptanceLow,
					oProperty.acceptanceHigh,
					oProperty.toleranceHigh,
					oProperty.deviationHigh
				);
				assert.equal(
					actualValue,
					oProperty.bExpectedValue,
					"Unit test to check getCriticalityCalculationBinding " + oProperty.sMessage + " : ok"
				);
			});
		});

		QUnit.module("Unit Test for getCriticalityBinding");
		QUnit.test("Unit test to check getCriticalityBinding", function(assert) {
			[
				{
					dataPoint: {},
					bExpectedValue: "Neutral",
					sMessage: "works when no criticality property exists in datapoint"
				},
				{
					dataPoint: {
						Criticality: {
							$Path: "criticality"
						}
					},
					bExpectedValue:
						"{= (${criticality} === 'Negative' || ${criticality} === '1' || ${criticality} === 1 ) ? 'Error' : (${criticality} === 'Critical' || ${criticality} === '2' || ${criticality} === 2 ) ? 'Critical' : (${criticality} === 'Positive' || ${criticality} === '3' || ${criticality} === 3 ) ? 'Good' : 'Neutral'}",
					sMessage: "works when criticality property exists in datapoint"
				},
				{
					dataPoint: {
						Criticality: {
							$EnumMember: "com.sap.vocabularies.UI.v1.CriticalityType/Negative"
						}
					},
					bExpectedValue: "Error",
					sMessage: "works when criticality as enum exists in datapoint"
				}
			].forEach(function(oProperty) {
				var actualValue = MicroChartHelper.getCriticalityBinding(oProperty.dataPoint);
				assert.equal(
					actualValue,
					oProperty.bExpectedValue,
					"Unit test to check getCriticalityBinding " + oProperty.sMessage + " : ok"
				);
			});
		});

		QUnit.module("Unit Test for getThresholdColor");
		QUnit.test("Unit test to check getThresholdColor", function(assert) {
			[
				{
					value: undefined,
					iContext: {
						context: {
							getPath: function() {
								return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.Facets#MicroCharts/0/Target/$AnnotationPath/MeasureAttributes/0/DataPoint/$AnnotationPath/CriticalityCalculation/AcceptanceRangeLowValue";
							}
						}
					},
					bExpectedValue: "Neutral",
					sMessage: "works when no criticality calculation parameter is AcceptanceRangeLowValue"
				},
				{
					value: undefined,
					iContext: {
						context: {
							getPath: function() {
								return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.Facets#MicroCharts/0/Target/$AnnotationPath/MeasureAttributes/0/DataPoint/$AnnotationPath/CriticalityCalculation/DeviationRangeHighValue";
							}
						}
					},
					bExpectedValue: "Error",
					sMessage: "works when no criticality calculation parameter is DeviationRangeHighValue"
				},
				{
					value: undefined,
					iContext: {
						context: {
							getPath: function() {
								return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.Facets#MicroCharts/0/Target/$AnnotationPath/MeasureAttributes/0/DataPoint/$AnnotationPath/CriticalityCalculation/ToleranceRangeHighValue";
							}
						}
					},
					bExpectedValue: "Critical",
					sMessage: "works when no criticality calculation parameter is ToleranceRangeHighValue"
				}
			].forEach(function(oProperty) {
				var actualValue = MicroChartHelper.getThresholdColor(oProperty.value, oProperty.iContext);
				assert.equal(
					actualValue,
					oProperty.bExpectedValue,
					"Unit test to check getCriticalityBinding " + oProperty.sMessage + " : ok"
				);
			});
		});

		QUnit.module("Unit Test for _getCriticalityFromEnum");
		QUnit.test("Unit test to check _getCriticalityFromEnum", function(assert) {
			[
				{
					criticality: "",
					bExpectedValue: "Neutral",
					sMessage: "works when no criticality enum exists"
				},
				{
					criticality: "com.sap.vocabularies.UI.v1.CriticalityType/Negative",
					bExpectedValue: "Error",
					sMessage: "works when criticality enum is negative"
				},
				{
					criticality: "com.sap.vocabularies.UI.v1.CriticalityType/Positive",
					bExpectedValue: "Good",
					sMessage: "works when criticality enum is positive"
				},
				{
					criticality: "com.sap.vocabularies.UI.v1.CriticalityType/Critical",
					bExpectedValue: "Critical",
					sMessage: "works when criticality enum is critical"
				}
			].forEach(function(oProperty) {
				var actualValue = MicroChartHelper._getCriticalityFromEnum(oProperty.criticality);
				assert.equal(
					actualValue,
					oProperty.bExpectedValue,
					"Unit test to check _getCriticalityFromEnum " + oProperty.sMessage + " : ok"
				);
			});
		});

		QUnit.module("Unit Test for getMeasureAttributeForMeasure");
		QUnit.test("Unit test to check getMeasureAttributeForMeasure", function(assert) {
			var aPromises = [];
			[
				{
					context: {
						getModel: function() {
							return {
								requestObject: function(sPath) {
									return Promise.resolve({
										"MeasureAttributes": [
											{
												"Measure": {
													"$PropertyPath": "CustomerCreditLimitAmount"
												},
												"DataPoint": {
													"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditLimitAmount"
												}
											},
											{
												"Measure": {
													"$PropertyPath": "CustomerCreditExposureAmount"
												},
												"DataPoint": {
													"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditExposureAmount"
												}
											}
										],
										"Measures": [
											{
												"$PropertyPath": "CustomerCreditExposureAmount"
											},
											{
												"$PropertyPath": "CustomerCreditLimitAmount"
											}
										]
									});
								}
							};
						},
						getPath: function() {
							return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.Facets#MicroCharts/0/Target/$AnnotationPath/Measures/0";
						}
					},
					bExpectedValue:
						"/SalesOrderManage/@com.sap.vocabularies.UI.v1.Facets#MicroCharts/0/Target/$AnnotationPath/MeasureAttributes/1/",
					sMessage: "works when measure attribute exists for the measure"
				},
				{
					context: {
						getModel: function() {
							return {
								requestObject: function(sPath) {
									return Promise.resolve({
										"MeasureAttributes": [],
										"Measures": [
											{
												"$PropertyPath": "CustomerCreditExposureAmount"
											}
										]
									});
								}
							};
						},
						getPath: function() {
							return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.Facets#MicroCharts/0/Target/$AnnotationPath/Measures/0";
						}
					},
					bExpectedValue: undefined,
					sMessage: "works when measure attribute doesnot exists for the measure"
				},
				{
					context: {
						getModel: function() {
							return {
								requestObject: function(sPath) {
									return Promise.resolve({
										"MeasureAttributes": [],
										"Measures": []
									});
								}
							};
						},
						getPath: function() {
							return "/SalesOrderManage/@com.sap.vocabularies.UI.v1.Facets#MicroCharts/0/Target/$AnnotationPath/Measures/0";
						}
					},
					bExpectedValue: undefined,
					sMessage: "works when measure and measure attribute doesnot exists"
				}
			].forEach(function(oProperty) {
				aPromises.push(
					MicroChartHelper.getMeasureAttributeForMeasure(oProperty.context).then(function(actualValue) {
						assert.equal(
							actualValue,
							oProperty.bExpectedValue,
							"Unit test to check getMeasureAttributeForMeasure " + oProperty.sMessage + " : ok"
						);
					})
				);
			});
			return Promise.all(aPromises);
		});

		QUnit.module("Unit Test for formatDecimal");
		QUnit.test("Unit test to check formatDecimal", function(assert) {
			[
				{
					path: undefined,
					propertyConstraints: undefined,
					fractionDigits: undefined,
					bExpectedValue: undefined,
					sMessage: "works without path"
				},
				{
					path: "Property",
					propertyConstraints: {},
					fractionDigits: undefined,
					bExpectedValue:
						"{ path: 'Property', type: 'sap.ui.model.odata.type.Decimal', constraints: { scale: 1 }, formatOptions: { style: 'short' } }",
					sMessage: "works with path"
				},
				{
					path: "Property",
					propertyConstraints: {
						$Precision: 5,
						$Scale: 3,
						$Nullable: false
					},
					fractionDigits: undefined,
					bExpectedValue:
						"{ path: 'Property', type: 'sap.ui.model.odata.type.Decimal', constraints: { nullable: false,scale: 3 }, formatOptions: { style: 'short',precision: 5 } }",
					sMessage: "works with path, precision, scale, nullable"
				},
				{
					path: "Property",
					propertyConstraints: {
						$Precision: 5,
						$Scale: 3,
						$Nullable: true
					},
					fractionDigits: 2,
					bExpectedValue:
						"{ path: 'Property', type: 'sap.ui.model.odata.type.Decimal', constraints: { nullable: true,scale: 2 }, formatOptions: { style: 'short',precision: 5 } }",
					sMessage: "works with path, precision, scale, nullable and fraction digits less than scale"
				},
				{
					path: "Property",
					propertyConstraints: {
						$Precision: 5,
						$Scale: 3,
						$Nullable: false
					},
					fractionDigits: 4,
					bExpectedValue:
						"{ path: 'Property', type: 'sap.ui.model.odata.type.Decimal', constraints: { nullable: false,scale: 4 }, formatOptions: { style: 'short',precision: 5 } }",
					sMessage: "works with path, precision, scale, nullable and fraction digits more than scale"
				},
				{
					path: "Property",
					propertyConstraints: {
						$Precision: 5,
						$Scale: 3
					},
					fractionDigits: undefined,
					bExpectedValue:
						"{ path: 'Property', type: 'sap.ui.model.odata.type.Decimal', constraints: { scale: 3 }, formatOptions: { style: 'short',precision: 5 } }",
					sMessage: "works with path, precision and scale"
				},
				{
					path: "Property",
					propertyConstraints: {
						$Precision: 5,
						$Nullable: false
					},
					fractionDigits: undefined,
					bExpectedValue:
						"{ path: 'Property', type: 'sap.ui.model.odata.type.Decimal', constraints: { nullable: false,scale: 1 }, formatOptions: { style: 'short',precision: 5 } }",
					sMessage: "works with path, precision and nullable"
				},
				{
					path: "Property",
					propertyConstraints: {
						$Scale: 3,
						$Nullable: false
					},
					fractionDigits: undefined,
					bExpectedValue:
						"{ path: 'Property', type: 'sap.ui.model.odata.type.Decimal', constraints: { nullable: false,scale: 3 }, formatOptions: { style: 'short' } }",
					sMessage: "works without path, nullable and scale"
				}
			].forEach(function(oProperty) {
				var actualValue = MicroChartHelper.formatDecimal(oProperty.path, oProperty.propertyConstraints, oProperty.fractionDigits);
				assert.equal(actualValue, oProperty.bExpectedValue, "Unit test to check formatDecimal " + oProperty.sMessage + " : ok");
			});
		});

		QUnit.module("Unit Test for getSelectParameters");
		QUnit.test("Unit test to check getSelectParameters", function(assert) {
			[
				{
					arguments: [],
					bExpectedValue: "",
					sMessage: "works without any arguments"
				},
				{
					arguments: [undefined, undefined, undefined, "Path1", "Path2"],
					bExpectedValue: "$select : 'Path1,Path2'",
					sMessage: "works with only query parameters"
				},
				{
					arguments: [undefined, undefined, "Criticality"],
					bExpectedValue: "$select : 'Criticality'",
					sMessage: "works with only criticality"
				},
				{
					arguments: ["$auto.micro", undefined, "Criticality", "Path1", "Path2"],
					bExpectedValue: "$$groupId : '$auto.micro',$select : 'Criticality,Path1,Path2'",
					sMessage: "works with groupId, criticality and query parameters"
				},
				{
					arguments: [
						"$auto.micro",
						{
							Enum1: {
								$EnumMember: "enum1"
							},
							Path1: {
								$Path: "Path1"
							},
							Path2: {
								$Path: "Path1"
							}
						},
						"Criticality"
					],
					bExpectedValue: "$$groupId : '$auto.micro',$select : 'Criticality'",
					sMessage: "works with groupId, criticality and criticality calculation"
				},
				{
					arguments: [
						"",
						{
							Enum1: {
								$EnumMember: "enum1"
							},
							Path1: {
								$Path: "Path1"
							},
							Path2: {
								$Path: "Path1"
							}
						},
						"Criticality",
						"Path3",
						"Path4"
					],
					bExpectedValue: "$select : 'Criticality,Path3,Path4'",
					sMessage: "works with criticality, criticality calculation and query parameters"
				},
				{
					arguments: [
						"$auto.micro",
						{
							Enum1: {
								$EnumMember: "enum1"
							},
							Path1: {
								$Path: "Path1"
							},
							Path2: {
								$Path: "Path2"
							}
						},
						undefined,
						"Path3",
						"Path4"
					],
					bExpectedValue: "$$groupId : '$auto.micro',$select : 'Path1,Path2,Path3,Path4'",
					sMessage: "works with groupId, criticality calculation and query parameters"
				},
				{
					arguments: [
						undefined,
						{
							Enum1: {
								$EnumMember: "enum1"
							},
							Path1: {
								$Path: "Path1"
							},
							Path2: {
								$Path: "Path2"
							}
						}
					],
					bExpectedValue: "$select : 'Path1,Path2'",
					sMessage: "works with only criticality calculation"
				}
			].forEach(function(oProperty) {
				var actualValue = MicroChartHelper.getSelectParameters.apply(null, oProperty.arguments);
				assert.equal(
					actualValue,
					oProperty.bExpectedValue,
					"Unit test to check getSelectParameters " + oProperty.sMessage + " : ok"
				);
			});
		});

		QUnit.module("Unit Test for getMeasureAttributeIndex");
		QUnit.test("Unit test to check getMeasureAttributeIndex", function(assert) {
			[
				{
					chartAnnotations: {
						"MeasureAttributes": [
							{
								"Measure": {
									"$PropertyPath": "CustomerCreditLimitAmount"
								},
								"DataPoint": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditLimitAmountDP"
								}
							},
							{
								"Measure": {
									"$PropertyPath": "CustomerCreditExposureAmount"
								},
								"DataPoint": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditExposureAmountDP"
								}
							}
						],
						"Measures": [
							{
								"$PropertyPath": "CustomerCreditExposureAmount"
							},
							{
								"$PropertyPath": "CustomerCreditLimitAmount"
							}
						]
					},
					measureIndex: 0,
					bExpectedValue: 1,
					sMessage: "works when measure attribute exists for the measure"
				},
				{
					chartAnnotations: {
						"MeasureAttributes": [
							{
								"Measure": {
									"$PropertyPath": "CustomerCreditLimitAmount"
								},
								"DataPoint": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditLimitAmountDP"
								}
							},
							{
								"Measure": {
									"$PropertyPath": "CustomerCreditExposureAmount"
								},
								"DataPoint": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditExposureAmountDP"
								}
							}
						],
						"Measures": [
							{
								"$PropertyPath": "CustomerCreditExposureAmount"
							},
							{
								"$PropertyPath": "CustomerCreditLimitAmount"
							}
						]
					},
					measureIndex: 1,
					bExpectedValue: 0,
					sMessage: "works when measure attribute exists for the measure"
				},
				{
					chartAnnotations: {
						"MeasureAttributes": [
							{
								"Measure": {
									"$PropertyPath": "CustomerCreditExposureAmount"
								},
								"DataPoint": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditExposureAmountDP"
								}
							}
						],
						"Measures": [
							{
								"$PropertyPath": "CustomerCreditExposureAmount"
							},
							{
								"$PropertyPath": "CustomerCreditLimitAmount"
							}
						]
					},
					measureIndex: 1,
					bExpectedValue: false,
					sMessage: "works when a measure attribute doesnot exist for a measure"
				},
				{
					chartAnnotations: {
						"MeasureAttributes": [
							{
								"Measure": {
									"$PropertyPath": "CustomerCreditExposureAmount"
								},
								"DataPoint": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditExposureAmountDP"
								}
							}
						],
						"Measures": [
							{
								"$PropertyPath": "CustomerCreditExposureAmount"
							},
							{
								"$PropertyPath": "CustomerCreditLimitAmount"
							}
						]
					},
					measureIndex: 0,
					bExpectedValue: 0,
					sMessage: "works when a measure attribute doesnot exist for a measure"
				},
				{
					chartAnnotations: {
						"MeasureAttributes": [],
						"Measures": [
							{
								"$PropertyPath": "CustomerCreditExposureAmount"
							},
							{
								"$PropertyPath": "CustomerCreditLimitAmount"
							}
						]
					},
					measureIndex: 1,
					bExpectedValue: false,
					sMessage: "works when no measure attributes exists for the measures"
				}
			].forEach(function(oProperty) {
				var actualValue = MicroChartHelper.getMeasureAttributeIndex(oProperty.measureIndex, oProperty.chartAnnotations);
				assert.equal(
					actualValue,
					oProperty.bExpectedValue,
					"Unit test to check getMeasureAttributeIndex " + oProperty.sMessage + " : ok"
				);
			});
		});

		QUnit.module("Unit Test for getMeasurePropertyPaths");
		QUnit.test("Unit test to check getMeasurePropertyPaths", function(assert) {
			[
				{
					chartAnnotations: {
						"MeasureAttributes": [
							{
								"Measure": {
									"$PropertyPath": "CustomerCreditLimitAmount"
								},
								"DataPoint": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditLimitAmountDP"
								}
							},
							{
								"Measure": {
									"$PropertyPath": "CustomerCreditExposureAmount"
								},
								"DataPoint": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditExposureAmountDP"
								}
							}
						],
						"Measures": [
							{
								"$PropertyPath": "CustomerCreditExposureAmount"
							},
							{
								"$PropertyPath": "CustomerCreditLimitAmount"
							}
						]
					},
					entityTypeAnnotations: {
						"@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditExposureAmountDP": {
							"Value": {
								"$Path": "CustomerCreditExposureAmountP"
							}
						},
						"@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditLimitAmountDP": {
							"Value": {
								"$Path": "CustomerCreditLimitAmountP"
							}
						}
					},
					bExpectedValue: "CustomerCreditExposureAmountP,CustomerCreditLimitAmountP",
					sMessage: "works when measure attribute exists for the measure"
				},
				{
					chartAnnotations: {
						"MeasureAttributes": [
							{
								"Measure": {
									"$PropertyPath": "CustomerCreditExposureAmount"
								},
								"DataPoint": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditExposureAmountDP"
								}
							}
						],
						"Measures": [
							{
								"$PropertyPath": "CustomerCreditExposureAmount"
							},
							{
								"$PropertyPath": "CustomerCreditLimitAmount"
							}
						]
					},
					entityTypeAnnotations: {
						"@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditExposureAmountDP": {
							"Value": {
								"$Path": "CustomerCreditExposureAmountP"
							}
						}
					},
					bExpectedValue: "CustomerCreditExposureAmountP",
					sMessage: "works when a measure attribute doesnot exist for a measure"
				},
				{
					chartAnnotations: {
						"MeasureAttributes": [
							{
								"Measure": {
									"$PropertyPath": "CustomerCreditExposureAmount"
								},
								"DataPoint": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditExposureAmountDP"
								}
							}
						],
						"Measures": [
							{
								"$PropertyPath": "CustomerCreditExposureAmount"
							},
							{
								"$PropertyPath": "CustomerCreditLimitAmount"
							}
						]
					},
					entityTypeAnnotations: {},
					bExpectedValue: "",
					sMessage: "works when a measure attribute doesnot exist for a measure"
				},
				{
					chartAnnotations: {
						"MeasureAttributes": [],
						"Measures": [
							{
								"$PropertyPath": "CustomerCreditExposureAmount"
							},
							{
								"$PropertyPath": "CustomerCreditLimitAmount"
							}
						]
					},
					entityTypeAnnotations: {},
					bExpectedValue: "",
					sMessage: "works when no measure attributes exists for the measures"
				}
			].forEach(function(oProperty) {
				var actualValue = MicroChartHelper.getMeasurePropertyPaths(oProperty.chartAnnotations, oProperty.entityTypeAnnotations);
				assert.equal(
					actualValue,
					oProperty.bExpectedValue,
					"Unit test to check getMeasurePropertyPaths " + oProperty.sMessage + " : ok"
				);
			});
		});

		QUnit.module("Unit Test for getDataPointQualifiersForMeasures");
		QUnit.test("Unit test to check getDataPointQualifiersForMeasures", function(assert) {
			[
				{
					chartAnnotations: {
						"MeasureAttributes": [
							{
								"Measure": {
									"$PropertyPath": "CustomerCreditLimitAmount"
								},
								"DataPoint": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditLimitAmountDP"
								}
							},
							{
								"Measure": {
									"$PropertyPath": "CustomerCreditExposureAmount"
								},
								"DataPoint": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditExposureAmountDP"
								}
							}
						],
						"Measures": [
							{
								"$PropertyPath": "CustomerCreditExposureAmount"
							},
							{
								"$PropertyPath": "CustomerCreditLimitAmount"
							}
						]
					},
					entityTypeAnnotations: {
						"@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditExposureAmountDP": {},
						"@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditLimitAmountDP": {}
					},
					bExpectedValue: "CustomerCreditExposureAmountDP,CustomerCreditLimitAmountDP",
					sMessage: "works when measure attribute exists for the measure"
				},
				{
					chartAnnotations: {
						"MeasureAttributes": [
							{
								"Measure": {
									"$PropertyPath": "CustomerCreditExposureAmount"
								},
								"DataPoint": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditExposureAmountDP"
								}
							}
						],
						"Measures": [
							{
								"$PropertyPath": "CustomerCreditExposureAmount"
							},
							{
								"$PropertyPath": "CustomerCreditLimitAmount"
							}
						]
					},
					entityTypeAnnotations: {
						"@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditExposureAmountDP": {}
					},
					bExpectedValue: "CustomerCreditExposureAmountDP",
					sMessage: "works when a measure attribute doesnot exist for a measure"
				},
				{
					chartAnnotations: {
						"MeasureAttributes": [
							{
								"Measure": {
									"$PropertyPath": "CustomerCreditExposureAmount"
								},
								"DataPoint": {
									"$AnnotationPath": "@com.sap.vocabularies.UI.v1.DataPoint#CustomerCreditExposureAmountDP"
								}
							}
						],
						"Measures": [
							{
								"$PropertyPath": "CustomerCreditExposureAmount"
							},
							{
								"$PropertyPath": "CustomerCreditLimitAmount"
							}
						]
					},
					entityTypeAnnotations: {},
					bExpectedValue: "",
					sMessage: "works when a measure attribute doesnot exist for a measure"
				},
				{
					chartAnnotations: {
						"MeasureAttributes": [],
						"Measures": [
							{
								"$PropertyPath": "CustomerCreditExposureAmount"
							},
							{
								"$PropertyPath": "CustomerCreditLimitAmount"
							}
						]
					},
					entityTypeAnnotations: {},
					bExpectedValue: "",
					sMessage: "works when no measure attributes exists for the measures"
				}
			].forEach(function(oProperty) {
				var actualValue = MicroChartHelper.getDataPointQualifiersForMeasures(
					oProperty.chartAnnotations,
					oProperty.entityTypeAnnotations
				);
				assert.equal(
					actualValue,
					oProperty.bExpectedValue,
					"Unit test to check getDataPointQualifiersForMeasures " + oProperty.sMessage + " : ok"
				);
			});
		});

		QUnit.module("Unit Test for isNotAlwaysHidden");
		QUnit.test("Unit test to check isNotAlwaysHidden", function(assert) {
			[
				{
					sValueHidden: {
						$Path: "Delivered"
					},
					sMaxValueHidden: undefined,
					bExpectedValue: true,
					sMessage: "works for measure property with hidden path"
				},
				{
					sValueHidden: false,
					sMaxValueHidden: {
						$Path: "Delivered"
					},
					bExpectedValue: true,
					sMessage: "works for maximum value property with hidden path"
				}
			].forEach(function(oProperty) {
				var actualValue = MicroChartHelper.isNotAlwaysHidden(oProperty.sValueHidden, oProperty.sMaxValueHidden);
				assert.equal(actualValue, oProperty.bExpectedValue, "Unit test to check isNotAlwaysHidden " + oProperty.sMessage + " : ok");
			});
		});

		QUnit.module("Unit Test for getHiddenPathExpression");
		QUnit.test("Unit test to check getHiddenPathExpression", function(assert) {
			[
				{
					sHiddenValue: {
						$Path: "Delivered"
					},
					sHiddenMaxValue: undefined,
					bExpectedValue: "{= %{Delivered} === true ? false : true }",
					sMessage: "works for measure property with hidden path"
				},
				{
					sHiddenValue: {
						$Path: "Delivered"
					},
					sHiddenMaxValue: {
						$Path: "isHidden"
					},
					bExpectedValue: "{= %{Delivered} || %{isHidden} === true ? false : true }",
					sMessage: "works for measure and maximum value properties with hidden path"
				}
			].forEach(function(oProperty) {
				var actualValue = MicroChartHelper.getHiddenPathExpression(oProperty.sHiddenValue, oProperty.sHiddenMaxValue);
				assert.equal(actualValue, oProperty.bExpectedValue, "Unit test to check isNotAlwaysHidden " + oProperty.sMessage + " : ok");
			});
		});

		QUnit.module("Unit Test for getCurrencyOrUnit");
		QUnit.test("Unit test to check getCurrencyOrUnit", function(assert) {
			[
				{
					oMeasures: {},
					bExpectedValue: "",
					sMessage: "works when no currency and no unit exists for a measure"
				},
				{
					oMeasures: {
						"@Org.OData.Measures.V1.ISOCurrency": "TransactionCurrency"
					},
					bExpectedValue: "TransactionCurrency",
					sMessage: "works when a currency exists for a measure"
				},
				{
					oMeasures: {
						"@Org.OData.Measures.V1.ISOCurrency": {
							"$Path": "TransactionCurrency"
						}
					},
					bExpectedValue: "TransactionCurrency",
					sMessage: "works when a currency path exists for a measure"
				},
				{
					oMeasures: {
						"@Org.OData.Measures.V1.Unit": "TransactionUnit"
					},
					bExpectedValue: "TransactionUnit",
					sMessage: "works when a unit exists for a measure"
				},
				{
					oMeasures: {
						"@Org.OData.Measures.V1.Unit": {
							"$Path": "TransactionUnit"
						}
					},
					bExpectedValue: "TransactionUnit",
					sMessage: "works when a unit path exists for a measure"
				},
				{
					oMeasures: {
						"@Org.OData.Measures.V1.ISOCurrency": "TransactionCurrency",
						"@Org.OData.Measures.V1.Unit": "TransactionUnit"
					},
					bExpectedValue: "TransactionCurrency",
					sMessage: "works when a currency and a unit exists for a measure"
				},
				{
					oMeasures: {
						"@Org.OData.Measures.V1.ISOCurrency": {
							"$Path": "TransactionCurrency"
						},
						"@Org.OData.Measures.V1.Unit": {
							"$Path": "TransactionUnit"
						}
					},
					bExpectedValue: "TransactionCurrency",
					sMessage: "works when a currency path and a unit path exists for a measure"
				}
			].forEach(function(oProperty) {
				var actualValue = MicroChartHelper.getCurrencyOrUnit(oProperty.oMeasures);
				assert.equal(actualValue, oProperty.bExpectedValue, "Unit test to check getCurrencyOrUnit " + oProperty.sMessage + " : ok");
			});
		});
	}
);
