/* global QUnit, sinon */
QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/comp/providers/ChartProvider",
	"sap/ui/comp/odata/MetadataAnalyser"

], function(ChartProvider, MetadataAnalyser) {
	"use strict";

	// Due to a non-compliant behavior of the Chart Library in regards of async loading, this construct of
	// an "internal require" is needed to ensure the correct order of loading.
	// TODO: Remove, when chart Library works as expected
	sap.ui.require(["sap/chart/library"], function(chartLibrary){

		QUnit.module("sap.ui.comp.providers.ChartProvider", {
			beforeEach: function () {
				this.oChartProvider = new ChartProvider({
					entitySet: "foo",
					model: undefined,
					chartLibrary: chartLibrary
				});
			},
			afterEach: function () {
				this.oChartProvider.destroy();
			}
		});

		QUnit.test("Shall be instantiable", function (assert) {
			assert.ok(this.oChartProvider);
		});

		QUnit.test("Shall contain an instance of metadata analyser", function (assert) {
			assert.ok(this.oChartProvider._oMetadataAnalyser);
			assert.strictEqual(this.oChartProvider._oMetadataAnalyser instanceof MetadataAnalyser, true);
		});

		QUnit.test("_initialiseMetadata shall trigger getFieldsByEntitySetName on the Metadatanalyser _generateIgnoredFieldsArray ", function (assert) {
			this.oChartProvider._oMetadataAnalyser = sinon.createStubInstance(MetadataAnalyser);
			sinon.spy(this.oChartProvider, "_generateIgnoredFieldsArray");
			this.oChartProvider._intialiseMetadata();
			assert.ok(this.oChartProvider._oMetadataAnalyser.getFieldsByEntitySetName.calledOnce);
		});

		QUnit.test("_generateIgnoredFieldsArray shall create an array of hidden fields ", function (assert) {
			this.oChartProvider._generateIgnoredFieldsArray();
			assert.deepEqual(this.oChartProvider._aIgnoredFields, []);
			this.oChartProvider._sIgnoredFields = "ID,TechId,foo";
			this.oChartProvider._generateIgnoredFieldsArray();
			assert.strictEqual(this.oChartProvider._aIgnoredFields.length, 3);
			assert.deepEqual(this.oChartProvider._aIgnoredFields, [
				"ID", "TechId", "foo"
			]);
		});

		QUnit.test("_initialiseMetadata shall create ChartViewMetadata(getChartViewMetadata()) by ignoring the fields in _aIgnoredFields", function (assert) {
			var aBackendMetadata = [
				{
					name: "test",
					type: "Edm.String",
					visible: true
				}, {
					name: "foo",
					type: "Edm.String",
					visible: true
				}, {
					name: "ID",
					type: "Edm.String",
					visible: true
				}, {
					name: "test1",
					type: "Edm.String",
					visible: true
				}, {
					name: "test2",
					type: "Edm.String",
					visible: true
				}, {
					name: "test3",
					type: "Edm.String",
					visible: true
				}, {
					name: "test4",
					type: "Edm.String",
					visible: true
				}
			];
			var oResult = null;
			this.oChartProvider._oMetadataAnalyser = sinon.createStubInstance(MetadataAnalyser);
			this.oChartProvider._oMetadataAnalyser.getFieldsByEntitySetName.returns(aBackendMetadata);
			this.oChartProvider._oMetadataAnalyser.getChartAnnotation.returns({});
			//No fields to ignore
			this.oChartProvider._intialiseMetadata();

			oResult = this.oChartProvider.getChartViewMetadata();
			assert.ok(oResult);
			assert.ok(oResult.fields);

			assert.strictEqual(oResult.fields.length, aBackendMetadata.length);

			this.oChartProvider._aChartViewMetadata = {};

			this.oChartProvider._sIgnoredFields = "ID,TechId,foo";

			this.oChartProvider._intialiseMetadata();
			//ID and foo shall be ignored!
			oResult = this.oChartProvider.getChartViewMetadata();

			//Result shall not contain ignored fields!
			assert.strictEqual(oResult.fields.length, aBackendMetadata.length - 2);
		});

		QUnit.test("_initialiseMetadata shall create ChartViewMetadata(getChartViewMetadata()) by ignoring visible=false fields", function (assert) {
			var aBackendMetadata = [
				{
					name: "test",
					type: "Edm.String",
					visible: true
				}, {
					name: "foo",
					type: "Edm.String",
					visible: true
				}, {
					name: "ID",
					type: "Edm.String",
					visible: false
				}, {
					name: "test1",
					type: "Edm.String",
					visible: false
				}, {
					name: "test2",
					type: "Edm.String",
					visible: true
				}, {
					name: "test3",
					type: "Edm.String",
					visible: true
				}, {
					name: "test4",
					type: "Edm.String",
					visible: true
				}
			];
			var oResult = null;
			this.oChartProvider._oMetadataAnalyser = sinon.createStubInstance(MetadataAnalyser);
			this.oChartProvider._oMetadataAnalyser.getFieldsByEntitySetName.returns(aBackendMetadata);
			this.oChartProvider._oMetadataAnalyser.getChartAnnotation.returns({});

			this.oChartProvider._intialiseMetadata();
			//ID and test1 shall be ignored as they are visible=false!
			oResult = this.oChartProvider.getChartViewMetadata();

			//Result shall not contain visible=false fields!
			assert.strictEqual(oResult.fields.length, aBackendMetadata.length - 2);

			//visible=false along with ignord fields
			this.oChartProvider._aChartViewMetadata = [];

			this.oChartProvider._sIgnoredFields = "TechId,foo";

			this.oChartProvider._intialiseMetadata();
			//ID and test1 shall be ignored as they are visible=false!
			//And foo shall be ignored as it is in the ignored list!
			oResult = this.oChartProvider.getChartViewMetadata();

			//Result shall not contain ignored fields!
			assert.strictEqual(oResult.fields.length, aBackendMetadata.length - 3);
		});

		QUnit.test("check _initialiseMetadata with dimension and measures", function (assert) {
			var aBackendMetadata = [
				{
					name: "test",
					aggregationRole: "dimension",
					type: "Edm.String",
					visible: true
				}, {
					name: "foo",
					aggregationRole: "dimension",
					type: "Edm.String",
					visible: true
				}, {
					name: "ID",
					aggregationRole: "measure",
					type: "Edm.String",
					visible: true
				}, {
					name: "test1",
					type: "Edm.String",
					visible: true
				}, {
					name: "test2",
					type: "Edm.String",
					visible: true
				}, {
					name: "test3",
					type: "Edm.String",
					visible: true
				}, {
					name: "test4",
					type: "Edm.String",
					visible: true
				}
			];

			var oChartAnnotation = {
				semantics: "analytic",
				annotation: {},
				chartType: "com.sap.vocabularies.UI.v1.ChartType/Column",
				measureFields: [],
				dimensionFields: [],
				measureAttributes: {},
				dimensionAttributes: {}
			};
			var oResult = null;

			this.oChartProvider._oMetadataAnalyser = sinon.createStubInstance(MetadataAnalyser);
			this.oChartProvider._oMetadataAnalyser.getFieldsByEntitySetName.returns(aBackendMetadata);
			this.oChartProvider._oMetadataAnalyser.getChartAnnotation.returns(oChartAnnotation);

			//No fields to ignore
			this.oChartProvider._intialiseMetadata();

			oResult = this.oChartProvider.getChartViewMetadata();
			assert.ok(oResult);
			assert.strictEqual(oResult.chartType, "column");
			assert.ok(oResult.fields);
			assert.strictEqual(oResult.fields.length, 7);

			assert.ok(oResult.fields[0].isDimension);
			assert.ok(!oResult.fields[0].isMeasure);
			assert.ok(oResult.fields[1].isDimension);
			assert.ok(!oResult.fields[1].isMeasure);
			assert.ok(!oResult.fields[2].isDimension);
			assert.ok(oResult.fields[2].isMeasure);
			assert.ok(!oResult.fields[3].isDimension);
			assert.ok(!oResult.fields[3].isMeasure);

		});

		QUnit.test("DataPoint retrievement", function(assert) {
			var aBackendMetadata = [
				{
					name: "foo",
					aggregationRole: "dimension",
					type: "Edm.String",
					visible: true
				}, {
					name: "bar",
					aggregationRole: "measure",
					type: "Edm.String",
					visible: true
				}
			];

			var oChartAnnotation = {
				semantics: "analytic",
				annotation: {},
				chartType: "com.sap.vocabularies.UI.v1.ChartType/Column",
				measureFields: ["bar"],
				dimensionFields: ["foo"],
				measureAttributes: { bar: {
					measure: "bar",
					role: "com.sap.vocabularies.UI.v1.ChartMeasureRoleType/Axis1",
					dataPoint: "@com.sap.vocabularies.UI.v1.DataPoint#Bar"
				}},
				dimensionAttributes: { foo: {
					measure: "foo",
					role: "com.sap.vocabularies.UI.v1.ChartDimensionRoleType/Series",
					dataPoint: "@com.sap.vocabularies.UI.v1.DataPoint#Foo"
				}}
			};

			var oDataPoint = { dummy: true };
			var oResult = null;

			this.oChartProvider._oMetadataAnalyser = sinon.createStubInstance(MetadataAnalyser);
			this.oChartProvider._getMeasureDataPoint = sinon.stub();
			this.oChartProvider._oMetadataAnalyser.getFieldsByEntitySetName.returns(aBackendMetadata);
			this.oChartProvider._oMetadataAnalyser.getChartAnnotation.returns(oChartAnnotation);
			this.oChartProvider._getMeasureDataPoint.returns(oDataPoint);

			//No fields to ignore
			this.oChartProvider._intialiseMetadata();

			oResult = this.oChartProvider.getChartViewMetadata();
			assert.ok(oResult);
			assert.strictEqual(oResult.chartType, "column");
			assert.ok(oResult.fields);
			assert.strictEqual(oResult.fields.length, 2);

			assert.ok(oResult.fields[0].isDimension, "Foo is a dimension");
			assert.ok(oResult.fields[1].isMeasure, "Bar is a measure");
			assert.ok(!oResult.fields[0].dataPoint, "There is no data point for the dimension");
			assert.ok(oResult.fields[1].dataPoint, "There is a data point for the measure");
		});

		QUnit.test("Providing Datapoint.Criticality as constant the resulting Critically Coloring contains the Static entry", function (assert) {
			var oDataPoint = {
				Criticality: {
					EnumMember: "com.sap.vocabularies.UI.v1.CriticalityType/Negative"
				},
				CriticalityCalculation: {
					ImprovementDirection: {
						EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize"
					}
				}
			};

			var oCriticality = this.oChartProvider.provideSemanticColoring(oDataPoint);

			assert.ok(oCriticality.Static, "Static entry of Criticality is supplied");
			assert.ok(!oCriticality.Calculated, "Calculated entry of Criticality is not supplied");
			assert.ok(!oCriticality.ConstantThresholds, "ConstantThresholds entry of Criticality is not supplied");
			assert.ok(!oCriticality.DynamicThresholds, "DynamicThresholds entry of Criticality is not supplied");

			assert.equal(oCriticality.Static, chartLibrary.coloring.CriticalityType.Negative, "Static criticality is evaluated correctly");
		});

		QUnit.test("Providing Datapoint.Criticality as path the resulting Critically Coloring contains the Calculated entry", function (assert) {
			var oDataPoint = {
				Criticality: {
					Path: "PriceCalculation"
				},
				CriticalityCalculation: {
					ImprovementDirection: {
						EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize"
					}
				}
			};

			var oCriticality = this.oChartProvider.provideSemanticColoring(oDataPoint);

			assert.ok(!oCriticality.Static, "Static entry of Criticality is not supplied");
			assert.ok(oCriticality.Calculated, "Calculated entry of Criticality is supplied");
			assert.ok(!oCriticality.ConstantThresholds, "ConstantThresholds entry of Criticality is not supplied");
			assert.ok(!oCriticality.DynamicThresholds, "DynamicThresholds entry of Criticality is not supplied");

			assert.equal(oCriticality.Calculated, "PriceCalculation", "Calculated criticality is evaluated correctly");
		});

		QUnit.test("Providing Datapoint.Criticality neither ConstantThresholds nor DynamicThresholds entry is supplied", function (assert) {
			var oDataPoint = {
				Criticality: {
					EnumMember: "com.sap.vocabularies.UI.v1.CriticalityType/Negative",
					Path: "PriceCalculation"
				},
				CriticalityCalculation: {
					ImprovementDirection: {
						EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize"
					}
				}
			};

			var oCriticality = this.oChartProvider.provideSemanticColoring(oDataPoint);

			assert.ok(!oCriticality.ConstantThresholds);
			assert.ok(!oCriticality.DynamicThresholds);
		});

		QUnit.test("Providing Datapoint.Criticality the paths overrules the constant value", function (assert) {
			var oDataPoint = {
				Criticality: {
					EnumMember: "com.sap.vocabularies.UI.v1.CriticalityType/Negative",
					Path: "PriceCalculation"
				},
				CriticalityCalculation: {
					ImprovementDirection: {
						EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize"
					}
				}
			};

			var oCriticality = this.oChartProvider.provideSemanticColoring(oDataPoint);

			assert.ok(!oCriticality.Static, "Static entry of Criticality is not supplied");
			assert.ok(oCriticality.Calculated, "Calculated entry of Criticality is supplied");
		});

		QUnit.test("Providing only Datapoint.CriticallyCalculation neither Static nor Calculated entry is supplied", function (assert) {
			var oDataPoint = {
				CriticalityCalculation: {
					ImprovementDirection: {
						EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize"
					},
					ToleranceRangeLowValue: {
						Int: 50
					},
					ToleranceRangeHighValue: {
						Path: "ProductTolerance",
						String: "52.2"
					},
					DeviationRangeLowValue: {
						String: "52.2"
					},
					DeviationRangeHighValue: {
						Value: "52.2"
					}
				}
			};

			var oCriticality = this.oChartProvider.provideSemanticColoring(oDataPoint);

			assert.ok(!oCriticality.Static, "Static entry of Criticality is not supplied");
			assert.ok(!oCriticality.Calculated, "Calculated entry of Criticality is not supplied");
		});

		QUnit.test("Providing at least one path in Datapoint.CriticalityCalculation only the DynamicThresholds entry is supplied", function (assert) {
			var oDataPoint = {
				CriticalityCalculation: {
					ImprovementDirection: {
						EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize"
					},
					ToleranceRangeLowValue: {
						Int: 50
					},
					ToleranceRangeHighValue: {
						Path: "ProductTolerance",
						String: "52.2"
					},
					DeviationRangeLowValue: {
						String: "52.2"
					},
					DeviationRangeHighValue: {
						Value: "52.2"
					}
				}
			};

			var oCriticality = this.oChartProvider.provideSemanticColoring(oDataPoint);

			assert.ok(!oCriticality.Static, "Static entry of Criticality is not supplied");
			assert.ok(!oCriticality.Calculated, "Calculated entry of Criticality is not supplied");
			assert.ok(!oCriticality.ConstantThresholds, "ConstantThresholds entry of Criticality is not supplied");
			assert.ok(oCriticality.DynamicThresholds, "DynamicThresholds entry of Criticality is supplied");
			assert.equal(oCriticality.DynamicThresholds.ToleranceRangeHighValue, "ProductTolerance", "DynamicThresholds.ToleranceRangeHighValue property is supplied evaluated correctly");
		});

		QUnit.test("Providing no path but at least one constant value in Datapoint.CriticallyCalculation only the ConstantThresholds entry is supplied and AggregationLevels has one entry", function (assert) {
			var oDataPoint = {
				CriticalityCalculation: {
					ImprovementDirection: {
						EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize"
					},
					AcceptanceRangeLowValue: {
						Decimal: 60,//decimal shall overrule
						Int: 50,
						String: "90"
					},
					AcceptanceRangeHighValue: {
						Int: 50,//int shall overrule
						String: "90"
					},
					ToleranceRangeLowValue: {
						String: "90" // fallback
					},
					ToleranceRangeHighValue: {
						Decimal: 20,//decimal shall overrule
						String: "90"
					},
					DeviationRangeLowValue: {
						Any: "Dummy"
					},
					DeviationRangeHighValue: {}
				}
			};

			var oCriticality = this.oChartProvider.provideSemanticColoring(oDataPoint);

			assert.ok(!oCriticality.Static, "Static entry of Criticality is not supplied");
			assert.ok(!oCriticality.Calculated, "Calculated entry of Criticality is not supplied");
			assert.ok(oCriticality.ConstantThresholds, "ConstantThresholds entry of Criticality is supplied");
			assert.ok(!oCriticality.DynamicThresholds, "DynamicThresholds entry of Criticality is not supplied");

			assert.ok(oCriticality.ConstantThresholds.AggregationLevels, "AggregationLevels is not empty");
			assert.strictEqual(oCriticality.ConstantThresholds.ImprovementDirection, "Maximize", "ImprovementDirections is correct");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels.length, 1, "AggregationLevels has exactly one entry");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels[0].VisibleDimensions, null, "VisibleDimensions is null");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels[0].AcceptanceRangeLowValue, Number("60"), "AcceptanceRangeLowValue is evaluated correctly and a Decimal value overrules other constant values");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels[0].AcceptanceRangeHighValue, Number("50.0"), "AcceptanceRangeHighValue is evaluated correctly and Int value evaluation is used when no Decimal is found");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels[0].ToleranceRangeLowValue, Number("90.0"), "ToleranceRangeLowValue is evaluated correctly where the String value is used as fallback");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels[0].ToleranceRangeHighValue, Number("20"), "ToleranceRangeHighValue is evaluated correctly");

			assert.ok(!oCriticality.ConstantThresholds.AggregationLevels[0].DeviationRangeLowValue, "DeviationRangeLowValue is not supplied and only Decimal,Int or String are evaluated");
			assert.ok(!oCriticality.ConstantThresholds.AggregationLevels[0].DeviationRangeHighValue, "DeviationRangeHighValue is not supplied");
		});

		QUnit.test("Providing no path value and only Datapoint.CriticallyCalculation.ConstantsThresholds threshholds the ConstantThresholds contains entry the data as AggregationLevels", function (assert) {
			var oDataPoint = {
				CriticalityCalculation: {
					ImprovementDirection: {
						EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Minimize"
					},
					ConstantThresholds: [
						{
							ToleranceRangeLowValue: {
								Decimal: 120
							}
						}, {
							AggregationLevel: [],
							AcceptanceRangeLowValue: {
								Decimal: 60
							}

						}, {
							AggregationLevel: [
								{
									PropertyPath: "Name"
								}
							],
							AcceptanceRangeHighValue: {
								Decimal: 70
							}
						}, {
							AggregationLevel: [
								{
									PropertyPath: "Name"
								}, {
									PropertyPath: "Category"
								}
							],
							ToleranceRangeHighValue: {
								Decimal: 20
							}

						}

					]
				}
			};

			var oCriticality = this.oChartProvider.provideSemanticColoring(oDataPoint);

			assert.ok(oCriticality.ConstantThresholds.AggregationLevels, "AggregationLevels is not empty");
			assert.strictEqual(oCriticality.ConstantThresholds.ImprovementDirection, "Minimize", "ImprovementDirections is correct");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels.length, 4, "AggregationLevels has exactly four entry");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels[0].VisibleDimensions, null, "VisibleDimensions is null");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels[1].VisibleDimensions.length, 0, "VisibleDimensions is the empty array");
			assert.deepEqual(oCriticality.ConstantThresholds.AggregationLevels[2].VisibleDimensions, [
				"Name"
			], "VisibleDimensions is ths ['Name'] array");
			assert.deepEqual(oCriticality.ConstantThresholds.AggregationLevels[3].VisibleDimensions, [
				"Name", "Category"
			], "VisibleDimensions is ths ['Name','Category'] array");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels[0].ToleranceRangeLowValue, Number("120"), "ToleranceRangeLowValue is evaluated correctly");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels[1].AcceptanceRangeLowValue, Number("60"), "AcceptanceRangeLowValue is evaluated correctly");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels[2].AcceptanceRangeHighValue, Number("70"), "AcceptanceRangeHighValue is evaluated correctly");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels[3].ToleranceRangeHighValue, Number("20"), "ToleranceRangeLowValue is evaluated correctly");
		});

		QUnit.test("Providing Datapoint.CriticallyCalculation.ConstantsThresholds and at least one constant threshold outside, the ConstantsThreshold entry contains both information as AggregationLevels", function (assert) {
			var oDataPoint = {
				CriticalityCalculation: {
					ImprovementDirection: {
						EnumMember: "com.sap.vocabularies.UI.v1.ImprovementDirectionType/Maximize"
					},
					AcceptanceRangeLowValue: {
						Decimal: 56
					},
					ConstantThresholds: [
						{
							ToleranceRangeLowValue: {
								Decimal: 120
							}
						}, {
							AggregationLevel: [],
							AcceptanceRangeLowValue: {
								Decimal: 60
							}

						}, {
							AggregationLevel: [
								{
									PropertyPath: "Name"
								}
							],
							AcceptanceRangeHighValue: {
								Decimal: 70
							}
						}, {
							AggregationLevel: [
								{
									PropertyPath: "Name"
								}, {
									PropertyPath: "Category"
								}
							],
							ToleranceRangeHighValue: {
								Decimal: 20
							}

						}

					]
				}
			};

			var oCriticality = this.oChartProvider.provideSemanticColoring(oDataPoint);

			assert.ok(oCriticality.ConstantThresholds.AggregationLevels, "AggregationLevels is not empty");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels.length, 5, "AggregationLevels has exactly five entries");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels[0].VisibleDimensions, null, "VisibleDimensions is null");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels[1].VisibleDimensions, null, "VisibleDimensions is null");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels[2].VisibleDimensions.length, 0, "VisibleDimensions is the empty array");
			assert.deepEqual(oCriticality.ConstantThresholds.AggregationLevels[3].VisibleDimensions, [
				"Name"
			], "VisibleDimensions is ths ['Name'] array");
			assert.deepEqual(oCriticality.ConstantThresholds.AggregationLevels[4].VisibleDimensions, [
				"Name", "Category"
			], "VisibleDimensions is ths ['Name','Category'] array");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels[0].AcceptanceRangeLowValue, Number("56"), "AcceptanceRangeLowValue is evaluated correctly");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels[1].ToleranceRangeLowValue, Number("120"), "ToleranceRangeLowValue is evaluated correctly");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels[2].AcceptanceRangeLowValue, Number("60"), "AcceptanceRangeLowValue is evaluated correctly");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels[3].AcceptanceRangeHighValue, Number("70"), "AcceptanceRangeHighValue is evaluated correctly");
			assert.strictEqual(oCriticality.ConstantThresholds.AggregationLevels[4].ToleranceRangeHighValue, Number("20"), "ToleranceRangeLowValue is evaluated correctly");
		});

		QUnit.test("Dimension coloring retrievement", function(assert) {
			var oField = {
				name: "Fitness",
				"com.sap.vocabularies.UI.v1.ValueCriticality": [
					{
						Criticality: {
							EnumMember: "com.sap.vocabularies.UI.v1.CriticalityType/Negative"
						},
						RecordType: "com.sap.vocabularies.UI.v1.ValueCriticalityType",
						Value: {
							String: "Injured"
						}
					}, {
						Criticality: {
							EnumMember: "com.sap.vocabularies.UI.v1.CriticalityType/Critical"
						},
						RecordType: "com.sap.vocabularies.UI.v1.ValueCriticalityType",
						Value: {
							String: "Tired"
						}
					}, {
						Criticality: {
							EnumMember: "com.sap.vocabularies.UI.v1.CriticalityType/Positive"
						},
						RecordType: "com.sap.vocabularies.UI.v1.ValueCriticalityType",
						Value: {
							String: "Top"
						}
					}
				]
			};

			var oColoring = this.oChartProvider.calculateDimensionColoring(oField);

			assert.ok(oColoring, "There is a coloring");
			assert.deepEqual(oColoring.Positive.Values, ["Top"], "The array of positive values contains only the top fitness");
			assert.deepEqual(oColoring.Negative.Values, ["Injured"], "The array of negative values contains only the injured fitness");
			assert.deepEqual(oColoring.Critical.Values, ["Tired"], "The array of critical values contains only the tired fitness");
			assert.deepEqual(oColoring.Neutral.Values, [], "The array of neutral values contains nothing");

			delete oField["com.sap.vocabularies.UI.v1.ValueCriticality"];
			//now check if for no criticality is returned
			oColoring = this.oChartProvider.calculateDimensionColoring(oField);
			assert.notOk(oColoring, "There is no coloring");
		});

		QUnit.test("The number of maximal items for the chart binding is evaluated correct", function (assert) {
			assert.strictEqual(this.oChartProvider.getMaxItems(), -1, "If there is not presenation variant the maximal items are set to -1");

			this.oChartProvider._oPresentationVariant = {
				"maxItems": 5
			};

			assert.strictEqual(this.oChartProvider.getMaxItems(), 5, "The value for the maximal Items of the presenation Variant is used when less than 100");

			this.oChartProvider._oPresentationVariant.maxItems = 101;

			assert.strictEqual(this.oChartProvider.getMaxItems(), 100, "Even when setting a number that is higher then 100 the getMaximalItems returns at most 100");
		});

		QUnit.test("The sort order items in the presentation variant are reflected to the fields", function (assert) {
			this.oChartProvider._oPresentationVariant = {
				"sortOrderFields": [
					{ descending: true,
						name: "Name"
					}, { descending: false,
						name: "Category"
					}
				]
			};

			var oCategoryField = {
				name: "Category"
			};

			var oNameField = {
				name: "Name"
			};

			var oUnsortField = {
				name: "Any"
			};

			this.oChartProvider._setSortOrder(oCategoryField);
			this.oChartProvider._setSortOrder(oNameField);
			this.oChartProvider._setSortOrder(oUnsortField);

			assert.strictEqual(oCategoryField.sorted, true, "Category is sorted");
			assert.strictEqual(oCategoryField.sortOrder, "Ascending", "The sort order is ascending");
			assert.strictEqual(oCategoryField.sortIndex, 1, "The sort index is 1");

			assert.strictEqual(oNameField.sorted, true, "Name is sorted");
			assert.strictEqual(oNameField.sortOrder, "Descending", "The sort order is descending");
			assert.strictEqual(oNameField.sortIndex, 0, "The sort index is 0");

			assert.strictEqual(oUnsortField.sorted, false, "Any other field is unsorted");
		});

		QUnit.test("_getTimeUnitTypes", function (assert) {

			//CASE sap.chart.TimeUnitType.Date
			//Arrange
			var oField = {
				type: "Edm.Date",
				isCalendarDate: false,
				displayFormat: ""
			};
			//Act
			var fnTimeUnitType = this.oChartProvider._getTimeUnitType(oField);
			//Asssert
			assert.strictEqual(fnTimeUnitType, "Date", " Edm.Date: displayFormat for TimeDimension is 'Date'");

			//CASE sap.chart.TimeUnitType.Date
			//Arrange
			oField = {
				type: "Edm.DateTime",
				isCalendarDate: false,
				displayFormat: "Date"
			};
			//Act
			fnTimeUnitType = this.oChartProvider._getTimeUnitType(oField);
			//Asssert
			assert.strictEqual(fnTimeUnitType, "Date", "Edm.DateTime: displayFormat for TimeDimension is 'Date'");

			//CASE sap.chart.TimeUnitType.yearmonthday
			//Arrange
			oField.type = "Edm.String";
			oField.isCalendarDate = true;
			oField.displayFormat = "";
			//Act
			fnTimeUnitType = this.oChartProvider._getTimeUnitType(oField);
			//Asssert
			assert.strictEqual(fnTimeUnitType, "yearmonthday", "Edm.String: displayFormat for TimeDimension is 'yearmonthday'");

			//CASE undefined
			//Arrange
			oField.isCalendarDate = false;
			//Act
			fnTimeUnitType = this.oChartProvider._getTimeUnitType(oField);
			//Asssert
			assert.strictEqual(fnTimeUnitType, undefined, "displayFormat for TimeDimension is undefined");

			//CASE undefined
			//Arrange
			oField.isCalendarDate = false;
			//Act
			fnTimeUnitType = this.oChartProvider._getTimeUnitType(oField);
			//Asssert
			assert.strictEqual(fnTimeUnitType, undefined, "displayFormat for TimeDimension is undefined");

		});

		QUnit.test("_getDateFormatter", function (assert) {
			//Tue Apr 15 2014 00:00:25 PM GMT+0200 (W. Europe Daylight Time)
			var iTimeStamp = 1397512825000;
			var oField = {
				type: "Edm.Date"
			};

			this.oChartProvider.oDateFormatSettings = {"UTC": true};

			var fnDateFormatter = this.oChartProvider._getDateFormatter(oField);
			assert.ok(fnDateFormatter, "For fields of type Edm.Date there is a formatter function");
			var sResult = fnDateFormatter(iTimeStamp);
			assert.strictEqual(sResult, "Apr 14, 2014", "The time is truncated from the timestamp");

			oField.type = "Edm.Time";
			fnDateFormatter = this.oChartProvider._getDateFormatter(oField);
			assert.ok(fnDateFormatter, "For fields of type Edm.Time there is a formatter function");
			sResult = fnDateFormatter(iTimeStamp);
			assert.strictEqual(sResult, "10:00:25 PM", "The date is truncated from the time stamp");

			oField.type = "Edm.DateTime";
			fnDateFormatter = this.oChartProvider._getDateFormatter(oField);
			assert.ok(fnDateFormatter, "For fields of type Edm.DateTime without displayFormat there is a formatter function");
			sResult = fnDateFormatter(iTimeStamp);
			assert.strictEqual(sResult, "Apr 14, 2014, 10:00:25 PM", "The timestamp is correctly shown on the UI");

			oField.type = "Edm.DateTime";
			oField.displayFormat = "Date";
			fnDateFormatter = this.oChartProvider._getDateFormatter(oField);
			assert.ok(fnDateFormatter, "For fields of type Edm.DateTime without displayFormat there is a formatter function");
			sResult = fnDateFormatter(iTimeStamp);
			assert.strictEqual(sResult, "Apr 14, 2014", "The date is truncated from the time stamp");

			oField.type = "Edm.String";
			delete oField.displayFormat;
			oField.isCalendarDate = true;
			fnDateFormatter = this.oChartProvider._getDateFormatter(oField);
			assert.ok(fnDateFormatter, "For fields of type Edm.String with annotation Common.isCalendarDate there is a formatter function");
			sResult = fnDateFormatter(20140415);
			assert.strictEqual(sResult, "Apr 15, 2014", "The date correctly display from the input string");

			sResult = fnDateFormatter(null);
			assert.strictEqual(sResult, null, "Inserting no value the date formatter returns 'null'");
		});

		QUnit.test("Destroy", function (assert) {
			assert.equal(this.oChartProvider.bIsDestroyed, undefined);
			this.oChartProvider.destroy();
			assert.equal(this.oChartProvider._oMetadataAnalyser, null);
			assert.equal(this.oChartProvider._aChartViewMetadata, null);
			assert.strictEqual(this.oChartProvider.bIsDestroyed, true);
		});

		QUnit.start();
	});

});
