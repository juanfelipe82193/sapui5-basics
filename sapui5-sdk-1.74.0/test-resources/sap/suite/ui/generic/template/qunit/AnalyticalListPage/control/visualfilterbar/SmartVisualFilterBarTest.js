/*
 * tests for the sap.suite.ui.generic.template.AnalyticalListPage.control.KpiTag
 */
sap.ui.define(
	[
	"sap/suite/ui/generic/template/AnalyticalListPage/control/visualfilterbar/VisualFilterProvider",
	"sap/suite/ui/generic/template/AnalyticalListPage/control/visualfilterbar/SmartVisualFilterBar",
	"sap/ui/model/json/JSONModel",
	"testUtils/sinonEnhanced",
	"sap/suite/ui/generic/template/lib/AjaxHelper"
	],
	function(VisualFilterProvider, SmartVisualFilterBar, JSONModel, sinon, AjaxHelper) {
		"use strict";
		var oSmartVisualFilterBar = new SmartVisualFilterBar(),
		sConfigUrl = "test-resources/sap/suite/ui/generic/template/qunit/AnalyticalListPage/control/visualfilterbar/testdata/Config.json",
		sVariantConfigUrl = "test-resources/sap/suite/ui/generic/template/qunit/AnalyticalListPage/control/visualfilterbar/testdata/VariantConfig.json",
		oConfig = AjaxHelper.syncGetJSON(sConfigUrl).data,
		oVariantConfig = AjaxHelper.syncGetJSON(sVariantConfigUrl).data,
		oSandbox,
		oAnnotationSettings;

		module("Test Smart Visual Filter Bar for Variant Mangement", {

			setup: function() {
				oAnnotationSettings = {};
				oSmartVisualFilterBar.setModel(new sap.ui.model.json.JSONModel(), '_visualFilterConfigModel');
				oSandbox = sinon.sandbox.create();
				oSandbox.stub(oSmartVisualFilterBar, "_getDimensionMap", function() {
					return {
						"ZCOSTCENTERCOSTSQUERY0021": {
							"CostElement": {
								"name": "CostElement",
								"fieldInfo": {
									"type": "Edm.String"
								}
							}
						}
					};
				});
				oSandbox.stub(oSmartVisualFilterBar, "_getMeasureMap", function() {
					return {
						"ZCOSTCENTERCOSTSQUERY0021": {
							"TotalCosts": {
								"name": "TotalCosts",
								"fieldInfo": {
									"unit": "M"
								}
							}
						}
					};
				});
				// mock annotation settings
				oSandbox.stub(oSmartVisualFilterBar, '_getAnnotationSettings', function(assert) {
					return oAnnotationSettings;
				});
				oSmartVisualFilterBar.setConfig(oConfig, true, true);
			},
			teardown: function() {
				oSandbox.restore();
			}
		});
		// check for variant save scenarios when fetchVariant is called
		QUnit.test("Check variant object to be saved in case there are no annotations", function(assert) {
			var oExpectedConfig = {
				config: null
			};
			// fetch variant is called on variant save
			var oActualConfig = oSmartVisualFilterBar.fetchVariant();
			assert.deepEqual(oExpectedConfig, oActualConfig, "variant object successfully returned null");
		});
/*		QUnit.test("Check variant object when there is no previous variant objects and annotations for filter item are present", function(assert) {
			// set annotations for this test only
			oAnnotationSettings = {
				"filterList": [{
					"type": "Donut",
					"selected": true,
					"dimension": {
						"field": "CostElement",
						"fieldDisplay": "CostElementText"
					},
					"measure": {
						"field": "ActualCosts",
						"descending": true
					},
					"sortOrder": [{
						"Field": {
							"String": "ActualCosts"
						},
						"Descending": {
							"Boolean": true
						}
					}],
					"collectionPath": "ZCOSTCENTERCOSTSQUERY0021",
					"outParameter": "CostElement",
					"inParameters": [{
						"localDataProperty": "CostCenter",
						"valueListProperty": "CostCenter"
					}],
					"parentProperty": "CostElement"
				}]
			};
			var oExpectedConfig = {
				config: {
					'CostElement': {
						shownInFilterBar: true,
						component: {
							type: 'Donut',
							properties: {
								sortOrder: [{
									"Field": {
										"String": "ActualCosts"
									},
									"Descending": {
										"Boolean": true
									}
								}],
								measureField: 'ActualCosts',
								parentProperty: 'CostElement'
							}
						}
					}
				}
			};
			// fetch variant is called on variant save
			var oActualConfig = oSmartVisualFilterBar.fetchVariant();
			assert.deepEqual(oExpectedConfig, oActualConfig, "variant config is derived from annotations as expected");
		});
		QUnit.test("Check variant object to be saved after any variant was saved or applied by the user", function(assert) {
			// in case the variant was saved or applied by the user then this._oCurrentVariant is already set to the last variant
			oSmartVisualFilterBar._oCurrentVariant = {
				config: {
					'CostElement': {
						shownInFilterBar: true,
						component: {
							type: 'Bar',
							properties: {
								sortOrder: [{
									"Field": {
										"String": "ActualCosts"
									},
									"Descending": {
										"Boolean": true
									}
								}],
								measureField: 'ActualCosts',
								parentProperty: 'CostElement'
							}
						}
					}
				}
			};
			// Expected variant config based on visual filter config being used (testdata/Config.json)
			var oExpectedConfig = {
				config: {
					'CostElement': {
						shownInFilterBar: true,
						component: {
							type: 'Donut',
							properties: {
								sortOrder: [{
									"Field": {
										"String": "ActualCosts"
									},
									"Descending": {
										"Boolean": true
									}
								}],
								measureField: 'ActualCosts',
								parentProperty: 'CostElement'
							}
						}
					}
				}
			};
			// fetch variant is called on variant save
			var oActualConfig = oSmartVisualFilterBar.fetchVariant();
			assert.deepEqual(oExpectedConfig, oActualConfig, "variant save returned object as expected");
		});
		QUnit.test("Check that the correct variant has been applied if different properties have changed", function(assert) {
			oAnnotationSettings = {
				"filterList": [{
					"type": "Donut",
					"selected": true,
					"dimension": {
						"field": "CostElement",
						"fieldDisplay": "CostElementText"
					},
					"measure": {
						"field": "ActualCosts",
						"descending": true
					},
					"sortOrder": [{
						"Field": {
							"String": "ActualCosts"
						},
						"Descending": {
							"Boolean": true
						}
					}],
					"collectionPath": "ZCOSTCENTERCOSTSQUERY0021",
					"outParameter": "CostElement",
					"inParameters": [{
						"localDataProperty": "CostCenter",
						"valueListProperty": "CostCenter"
					}],
					"parentProperty": "CostElement"
				}]
			};
			// Expected variant config based on visual filter config being used (testdata/Config.json)
			// showInFilterBar changed to false
			// chart type changed to Bar
			var oVariantJson = {
				config: {
					'CostElement': {
						shownInFilterBar: false,
						component: {
							type: 'Bar',
							properties: {
								sortOrder: [{
									"Field": {
										"String": "ActualCosts"
									},
									"Descending": {
										"Boolean": true
									}
								}],
								measureField: 'TotalCosts',
								parentProperty: 'CostElement'
							}
						}
					}
				}
			};
			// apply variant
			oSmartVisualFilterBar.applyVariant(oVariantJson);
			var bShowInFilterBar,
			sChartType,
			sMeasureField;
			// after applying variant is save is _oVariantConfig
			oSmartVisualFilterBar._oVariantConfig.filterCompList.forEach(function(element) {
				bShowInFilterBar = element.shownInFilterBar;
				sChartType = element.component.type;
				sMeasureField = element.component.properties.measureField;
			});
			assert.deepEqual(sChartType, 'Bar', "chart type successfully updated in config as per variant");
			assert.deepEqual(bShowInFilterBar, false, "shown in filter bar successfully updated in config as per variant");
			assert.deepEqual(sMeasureField, 'TotalCosts', "measure field successfully updated in config as per variant");
		});
		QUnit.test("Get Config object", function(assert) {
			QUnit.dump.maxDepth = 100;
			assert.equal(oSmartVisualFilterBar.getConfig(undefined), oConfig);
			assert.equal(oSmartVisualFilterBar.getConfig(false), oConfig);
			assert.deepEqual(oSmartVisualFilterBar.getConfig(true), oVariantConfig);
		});
		QUnit.test("combine filters from compact to visual", function(assert) {
			var filterList = [{
				"inParameters": [{
					"localDataProperty": "CostCenter",
					"valueListProperty": "CostCenter"
				}],
				"parentProperty": "CostElement"
			}, {
				"inParameters": undefined,
				"parentProperty": "CostCenter"
			}];

			function oFilters(multiFilter, bAnd, oVal1, oVal2, op, path) {
				this._bMultiFilter = multiFilter;
				this.aFilters = [];
				this.bAnd = bAnd;
				this.fnTest = undefined;
				this.oValue1 = oVal1;
				this.oValue2 = oVal2;
				this.sOperator = op;
				this.sPath = path;
			}
			oSmartVisualFilterBar._smartFilterContext = {
				getFilters: function(filterProperty) {
					var propertyFilters = new oFilters(true, true);
					propertyFilters.aFilters.push(new oFilters(false, undefined, "400020", undefined, "EQ", "CostElement"));
					propertyFilters = propertyFilters.aFilters;
					return propertyFilters;
				}
			};
			var expectedFilters = new oFilters(true, true);
			//testing for a property with no inparameter
			assert.propEqual(oSmartVisualFilterBar._combineFilterLists(filterList, 1), expectedFilters);
			expectedFilters.aFilters.push(new oFilters(false, undefined, "400020", undefined, "EQ", "CostElement"));
			//testing for a property with inParameter localDataProperty different from parent property
			assert.propEqual(oSmartVisualFilterBar._combineFilterLists(filterList, 0), expectedFilters);
			filterList = [{
				"inParameters": [{
					"localDataProperty": "CostElement",
					"valueListProperty": "CostElement"
				}],
				"parentProperty": "CostElement"
			}];
			expectedFilters = new oFilters(true, true);
			//testing for a property with inParameter localDataProperty same as parent property-
			assert.propEqual(oSmartVisualFilterBar._combineFilterLists(filterList, 0), expectedFilters);
		});
		QUnit.test("add filters from compact", function(assert) {
			oSmartVisualFilterBar._compactFilters["CostCenter"] = {
				items: [{
					key: "100-1100",
					text: "Consulting USA (100-1000)"
				}],
				ranges: [],
				value: null
			};

			var expectedFilters = [{
				dimValue: "100-1100",
				dimValueDisplay: "Consulting USA (100-1000)"
			}];
			//multi-value
			assert.deepEqual(oSmartVisualFilterBar._addToFiltersFromCompact("CostCenter"), expectedFilters);
			oSmartVisualFilterBar._compactFilters["CostCenter"] = {
				items: [],
				ranges: [{
					exclude: false,
					keyField: "CostElement",
					operation: "Contains",
					tokenText: "*400*",
					value1: "400",
					value2: ""
				}],
				value: null
			};
			expectedFilters = [{
				dimValue: "*400*",
				dimValueDisplay: "*400*",
				keyField: "CostElement",
				operation: "Contains",
				tokenText: "*400*",
				value1: "400",
				value2: ""
			}];
			//complex conditions
			assert.deepEqual(oSmartVisualFilterBar._addToFiltersFromCompact("CostCenter"), expectedFilters);
			oSmartVisualFilterBar._compactFilters["CostCenter"] = {
				items: [],
				ranges: [],
				value: "100-1100"
			};
			expectedFilters = [{
				"bIsUserTypedIn": true,
				"dimValue": "100-1100",
				"dimValueDisplay": "100-1100"
			}];
			//user typed value
			assert.deepEqual(oSmartVisualFilterBar._addToFiltersFromCompact("CostCenter"), expectedFilters);
		});*/
		QUnit.test('addVisualFiltersToBasicArea tests', function() {
			// check without config being set
			assert.equal(oSmartVisualFilterBar.addVisualFiltersToBasicArea(), false);

			// set config and then check
			oSmartVisualFilterBar.getModel('_visualFilterConfigModel').setData(oConfig);
			assert.equal(oSmartVisualFilterBar.addVisualFiltersToBasicArea(), false);
			assert.equal(oSmartVisualFilterBar.addVisualFiltersToBasicArea([]), false);
			assert.equal(oSmartVisualFilterBar.addVisualFiltersToBasicArea(['ControllingArea']), false);
			assert.equal(oSmartVisualFilterBar.addVisualFiltersToBasicArea(['CostElement']), false);
			assert.equal(oSmartVisualFilterBar.addVisualFiltersToBasicArea(['CostCenter']), true);
		});
	}
);
