/*/
 * Created on 23.11.2018.
 * Copyright(c) 2018-2019 SAP SE
 */
/*global sap, Promise */

sap.ui.define([
	'sap/apf/modeler/ui/controller/previewContent.controller',
	'sap/apf/ui/utils/representationTypesHandler',
	'sap/apf/core/representationTypes',
	'sap/apf/testhelper/modelerUIHelper',
	'sap/m/VBox',
	'sap/ui/thirdparty/sinon'
], function(PreviewContent, RepresentationTypesHandler, representationTypes, modelerUIHelper, sapmVBox, sinon){
	'use strict';

	function _instantiateView(parameter, sRepresentationType, oRepresentationHandlerStub, bAscending, assert, bHasNoLongTitle) {
		parameter = parameter || {}; // fixme clean up that patch later
		var that = parameter.that || {};
		bHasNoLongTitle = bHasNoLongTitle || parameter.bHasNoLongTitle;
		assert = assert || parameter.assert;
		bAscending = bAscending || parameter.bAscending;
		sRepresentationType = sRepresentationType || parameter.sRepresentationType;
		oRepresentationHandlerStub = oRepresentationHandlerStub || parameter.oRepresentationHandlerStub;
		that.spy = that.spy || {};

		var oView;
		that.oPreviewContentController = new sap.ui.controller("sap.apf.modeler.ui.controller.previewContent");
		var oPreviewContentController = that.oPreviewContentController;
		that.spy.onInit = sinon.spy(oPreviewContentController, "onInit");
		var spyOnInit = that.spy.onInit;
		that.oRepresentation = that.oModelerInstance.unsavedStepWithoutFilterMapping.getRepresentations()[0];
		that.spy.getOrderbySpecifications = sinon.stub(that.oRepresentation, "getOrderbySpecifications", function() {
			return [ {
				ascending : bAscending,
				property : "Amount"
			} ];
		});
		that.spy.getRepresentationType = sinon.stub(that.oRepresentation, "getRepresentationType", function() {
			if(sRepresentationType === "sap.apf.ui.representations.columnChart"){
				return "ColumnChart";
			}
			return "TableRepresentation";
		});
		var oStepPropertyMetadataTypeHandlerStub = {
			getProperties : function() {
				return [ "ID", "AirlineCode", "Currency", "Amount" ];
			},
			getMeasures : function() {
				return [ "Amount" ];
			},
			getDimensionsProperties : function() {
				return [ "AirlineCode" ];
			},
			getDefaultLabel : function(entityTypeMetadata, oText) {
				return oText;
			},
			getEntityTypeMetadataAsPromise : function() {
				var deferred = jQuery.Deferred();
				deferred.resolve();
				return deferred.promise();
			}
		};
		var oRepresentationTypeHandlerStub = {
			getConstructorOfRepresentationType : function(oRepType) {
				return sRepresentationType;
			}
		};
		var oParentStep = bHasNoLongTitle ? that.oModelerInstance.unsavedStepWithFilterMapping : that.oModelerInstance.unsavedStepWithoutFilterMapping;
		oView = new sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.previewContent",
			type : sap.ui.core.mvc.ViewType.XML,
			controller : oPreviewContentController,
			viewData : {
				oParentStep : oParentStep,
				oRepresentation : that.oRepresentation,
				oConfigurationHandler : that.oModelerInstance.configurationHandler,
				oCoreApi : that.oModelerInstance.modelerCore,
				oRepresentationHandler : oRepresentationHandlerStub,
				oStepPropertyMetadataHandler : oStepPropertyMetadataTypeHandlerStub,
				oRepresentationTypeHandler : oRepresentationTypeHandlerStub
			}
		});
		assert.strictEqual(spyOnInit.calledOnce, true, "then preview onInit function is called and view is initialized");
		return oView;
	}
	QUnit.module("Given a Column Chart", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();
			that.spy = {};

			sinon.config = {
					useFakeTimers : false
			}; //because of setTimout usage in dialog.close()
			var oRepresentationHandlerStub = {
				getActualLegends : function() {
					return {
						sContext : "legend",
						sProperty : "None"
					};
				},
				getActualDimensions : function() {
					return {
						sContext : "xAxis",
						sProperty : "AirlineCode",
						concat : function(oPropLegend) {
							return [ {
								sContext : "xAxis",
								sProperty : "AirlineCode"
							}, oPropLegend ];
						}
					};
				},
				getActualMeasures : function() {
					return [ {
						sContext : "yAxis",
						sProperty : "Amount"
					} ];
				}
			};
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				that.oModelerInstance = modelerInstance;
				var parameter = {
					that : that,
					assert : assert,
					sRepresentationType : "sap.apf.ui.representations.columnChart",
					oRepresentationHandlerStub : oRepresentationHandlerStub,
					bHasNoLongTitle : undefined,
					bAscending : false
				};
				that.oPreviewContentView = _instantiateView(parameter);
				done();
			});
		},
		afterEach : function() {
			var that = this;
			Object.keys(that.spy).forEach(function(key){
				that.spy[key].restore()
			})
			that.oPreviewContentView.destroy();
		}
	});
	QUnit.test("when content preview is requested", function(assert) {
		assert.expect(9);
		//arrangement
		var that = this;
		var oMainChart = that.oPreviewContentView.byId("idMainChart");
		var sChartType = oMainChart.getItems()[0].getVizType();
		// Check dimensions and measures.
		var aDimensions = oMainChart.getItems()[0].getDataset().getDimensions();
		var aMeasures = oMainChart.getItems()[0].getDataset().getMeasures();
		var columnChartCode = "column";
		var aDimensionNames = aDimensions.map(function(oDimension) {
			return oDimension.getName();
		});
		var aMeasureNames = aMeasures.map(function(oMeasure) {
			return oMeasure.getName();
		});
		//assert
		assert.ok(that.oPreviewContentView.byId("idPreviewContentDialog"), "preview content dialog exist");
		assert.strictEqual(that.oPreviewContentView.byId("idPreviewContentDialog").isOpen(), true, "then preview content dialog is open");
		assert.ok(oMainChart.getItems()[0] instanceof sap.viz.ui5.controls.VizFrame, "then main chart is drawn on main chart holder.");
		assert.strictEqual(sChartType, columnChartCode, "and main chart is a column chart");
		assert.strictEqual(aDimensions.length, 1, " then one Dimensions are present in the chart.");
		assert.strictEqual(aMeasures.length, 1, "then one Measure is present in the chart.");
		//assert
		assert.strictEqual(aDimensionNames[0].toString(), "AirlineCode", "then AirlineCode available as dimensions.");
		assert.strictEqual(aMeasureNames[0].toString(), "Amount", "then Amount available as measure.");
	});
	QUnit.test("when random sample data is generated and sorted ", function(assert) {
		//arrangement
		var that = this;
		var oMainChart = that.oPreviewContentView.byId("idMainChart");
		var aData = oMainChart.getItems()[0].getModel().getData().data;
		// Check sort property
		var nCurrentMaxValue = 10000;
		var bIsSorted = aData.reduce(function(prev, current) {
			var bSortedTillNow = prev && (nCurrentMaxValue >= current.Amount);
			nCurrentMaxValue = current.Amount;
			return bSortedTillNow;
		}, true);
		//assert
		assert.strictEqual(aData.length, 3, "then chart has 3 data rows.");
		assert.strictEqual(bIsSorted, true, "then data presented is sorted in descending order");
	});
	QUnit.test("Close with close button", function(assert) {
		var done = assert.async();
		var that = this;
		var previewDialog = that.oPreviewContentView.byId("idPreviewContentDialog");
		var closeButton = previewDialog.getEndButton();
		previewDialog.attachAfterClose(function(){
			assert.strictEqual(that.oPreviewContentView.bIsDestroyed, true, "View is destroyed");
			assert.strictEqual(previewDialog.bIsDestroyed, true, "Dialog is destroyed");
			done();
		});
		closeButton.firePress();
	});
	QUnit.test("Close with escape button", function(assert) {
		var done = assert.async();
		var that = this;
		var previewDialog = that.oPreviewContentView.byId("idPreviewContentDialog");
		previewDialog.attachAfterClose(function(){
			assert.strictEqual(that.oPreviewContentView.bIsDestroyed, true, "View is destroyed");
			assert.strictEqual(previewDialog.bIsDestroyed, true, "Dialog is destroyed");
			done();
		});
		previewDialog.close();
	});
	QUnit.module("Given a Column Chart with no assigned dimension properties", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();
			that.spy = {};
			var oRepresentationHandlerStub = {
				getActualLegends : function() {
					return {
						sContext : "legend",
						sProperty : "None"
					};
				},
				getActualDimensions : function() {
					return {
						sContext : "xAxis",
						sProperty : "",
						concat : function(oPropLegend) {
							return [ {
								sContext : "xAxis",
								sProperty : ""
							}, oPropLegend ];
						}
					};
				},
				getActualMeasures : function() {
					return [ {
						sContext : "yAxis",
						sProperty : "Amount"
					} ];
				}
			};
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				var parameter = {
					that : that
				};
				that.oModelerInstance = modelerInstance;
				that.oPreviewContentView = _instantiateView(parameter, "sap.apf.ui.representations.columnChart", oRepresentationHandlerStub, false, assert);
				done();
			});
		},
		afterEach : function() {
			var that = this;
			Object.keys(that.spy).forEach(function(key){
				that.spy[key].restore()
			})
			that.oPreviewContentView.destroy();
		}
	});
	QUnit.test("when content preview is requested", function(assert) {
		assert.expect(9);
		//arrangement
		var that = this;
		var oMainChart = that.oPreviewContentView.byId("idMainChart");
		var sChartType = oMainChart.getItems()[0].getVizType();
		// Check dimensions and measures.
		var aDimensions = oMainChart.getItems()[0].getDataset().getDimensions();
		var aMeasures = oMainChart.getItems()[0].getDataset().getMeasures();
		var columnChartCode = "column";
		var aDimensionNames = aDimensions.map(function(oDimension) {
			return oDimension.getName();
		});
		var aMeasureNames = aMeasures.map(function(oMeasure) {
			return oMeasure.getName();
		});
		//assert
		assert.ok(that.oPreviewContentView.byId("idPreviewContentDialog"), "preview content dialog exist");
		assert.strictEqual(that.oPreviewContentView.byId("idPreviewContentDialog").isOpen(), true, "then preview content dialog is open");
		assert.ok(oMainChart.getItems()[0] instanceof sap.viz.ui5.controls.VizFrame, "then main chart is drawn on main chart holder.");
		assert.strictEqual(sChartType, columnChartCode, "and main chart is a column chart");
		assert.strictEqual(aDimensions.length, 0, " then no Dimensions are present in the chart.");
		assert.strictEqual(aMeasures.length, 1, "then one Measure is present in the chart.");
		//assert
		assert.strictEqual(aDimensionNames.toString(), "", "then an emptyString is available as dimension.");
		assert.strictEqual(aMeasureNames.toString(), "Amount", "then Amount available as measure.");
	});
	QUnit.module("Given a Column Chart with no assigned measure properties", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();
			that.spy = {};
			var oRepresentationHandlerStub = {
				getActualLegends : function() {
					return {
						sContext : "legend",
						sProperty : "None"
					};
				},
				getActualDimensions : function() {
					return {
						sContext : "xAxis",
						sProperty : "AirlineCode",
						concat : function(oPropLegend) {
							return [ {
								sContext : "xAxis",
								sProperty : "AirlineCode"
							}, oPropLegend ];
						}
					};
				},
				getActualMeasures : function() {
					return [ {
						sContext : "yAxis",
						sProperty : ""
					} ];
				}
			};
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				var parameter = {
					that : that
				};
				that.oModelerInstance = modelerInstance;
				that.oPreviewContentView = _instantiateView(parameter, "sap.apf.ui.representations.columnChart", oRepresentationHandlerStub, false, assert);
				done();
			});
		},
		afterEach : function() {
			var that = this;
			Object.keys(that.spy).forEach(function(key){
				that.spy[key].restore()
			})
			that.oPreviewContentView.destroy();
		}
	});
	QUnit.test("when content preview is requested", function(assert) {
		assert.expect(9);
		//arrangement
		var that = this;
		var oMainChart = that.oPreviewContentView.byId("idMainChart");
		var sChartType = oMainChart.getItems()[0].getVizType();
		// Check dimensions and measures.
		var aDimensions = oMainChart.getItems()[0].getDataset().getDimensions();
		var aMeasures = oMainChart.getItems()[0].getDataset().getMeasures();
		var columnChartCode = "column";
		var aDimensionNames = aDimensions.map(function(oDimension) {
			return oDimension.getName();
		});
		var aMeasureNames = aMeasures.map(function(oMeasure) {
			return oMeasure.getName();
		});
		//assert
		assert.ok(that.oPreviewContentView.byId("idPreviewContentDialog"), "preview content dialog exist");
		assert.strictEqual(that.oPreviewContentView.byId("idPreviewContentDialog").isOpen(), true, "then preview content dialog is open");
		assert.ok(oMainChart.getItems()[0] instanceof sap.viz.ui5.controls.VizFrame, "then main chart is drawn on main chart holder.");
		assert.strictEqual(sChartType, columnChartCode, "and main chart is a column chart");
		assert.strictEqual(aDimensions.length, 1, " then one Dimension is present in the chart.");
		assert.strictEqual(aMeasures.length, 0, "then no Measures are present in the chart.");
		//assert
		assert.strictEqual(aDimensionNames.toString(), "AirlineCode", "then AirlineCode available as dimensions.");
		assert.strictEqual(aMeasureNames.toString(), "", "then emptyString is available as measure.");
	});
	QUnit.module("Given a Table Representation", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();
			that.spy = {};
			var oRepresentationHandlerStub = {
				getActualProperties : function() {
					return [ {
						sContext : "column",
						sProperty : "AirlineCode"
					} ,{
						sContext : "column",
						sProperty : "Amount"
					} ];
				}
			};
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				that.oModelerInstance = modelerInstance;
				var parameter = {
					that : that
				};
				that.oPreviewContentView = _instantiateView(parameter, "sap.apf.ui.representations.table", oRepresentationHandlerStub, true, assert);
				done();
			});
		},
		afterEach : function() {
			var that = this;
			Object.keys(that.spy).forEach(function(key){
				that.spy[key].restore()
			})
			that.oPreviewContentView.destroy();
		}
	});
	QUnit.test("when content preview is requested", function(assert) {
		//arrangement
		var that = this;
		var vBoxAroundTable = that.oPreviewContentView.byId("idMainChart").getItems()[0];
		var oTable = vBoxAroundTable.getItems()[0];
		// Check properties of the table.
		var aProperties = oTable.getColumns();
		var aPropertyNames = oTable.getColumns().map(function(oColumn) {
			return oColumn.getLabel().getText();
		});
		var titleControl = oTable.getTitle();
		//assert
		assert.strictEqual(vBoxAroundTable.getHeight(), "330px", "Height correctly set to Vbox which is around the table");
		assert.strictEqual(oTable.getWidth(), "480px", "Width correctly set to table");
		assert.strictEqual(titleControl.getItems().length, 1, "TitleControl has 1 item");
		assert.strictEqual(titleControl.getItems()[0].getText(), "step A long title", "TitleControl has long title text as only item");
		assert.strictEqual(oTable.getColumns()[0].getMinWidth(), 125, "MinWidth set to 125 for table preview");
		assert.ok(that.oPreviewContentView.byId("idPreviewContentDialog"), "preview content dialog exist");
		assert.strictEqual(that.oPreviewContentView.byId("idPreviewContentDialog").isOpen(), true, "then preview content dialog is open");
		assert.strictEqual(aProperties.length, 2, "then two columns are present in the table");
		assert.strictEqual(aPropertyNames.toString(), "AirlineCode,Amount", "then AirlineCode,Amount are available as properties for table");
	});
	QUnit.test("when random sample data is generated and sorted ", function(assert) {
		//arrangement
		var that = this;
		var oTable = that.oPreviewContentView.byId("idMainChart").getItems()[0].getItems()[0];
		var aData = oTable.getModel().getData().tableData;
		// Check sort property
		var nCurrentMinValue = "Amount - 0";
		var bIsSorted = aData.reduce(function(prev, current) {
			var bSortedTillNow = prev && (nCurrentMinValue <= current.Amount);
			nCurrentMinValue = current.Amount;
			return bSortedTillNow;
		}, true);
		//assert
		assert.strictEqual(aData.length, 7, "then table has 7 data rows.");
		assert.strictEqual(bIsSorted, true, "then data presented is sorted in ascending order");
	});
	QUnit.module("Preview Content Tests for step with no long title", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();
			that.spy = {};
			var oRepresentationHandlerStub = {
				getActualLegends : function() {
					return {
						sContext : "legend",
						sProperty : "None"
					};
				},
				getActualDimensions : function() {
					return {
						sContext : "xAxis",
						sProperty : "AirlineCode",
						concat : function(oPropLegend) {
							return [ {
								sContext : "xAxis",
								sProperty : "AirlineCode"
							}, oPropLegend ];
						}
					};
				},
				getActualMeasures : function() {
					return [ {
						sContext : "yAxis",
						sProperty : "Amount"
					} ];
				}
			};
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				var parameter = {
					that : that
				};
				that.oModelerInstance = modelerInstance;
				that.oPreviewContentView = _instantiateView(parameter, "sap.apf.ui.representations.columnChart", oRepresentationHandlerStub, false, assert, true);
				done();
			});
		},
		afterEach : function() {
			var that = this;
			Object.keys(that.spy).forEach(function(key){
				that.spy[key].restore()
			})
			that.oPreviewContentView.destroy();
		}
	});
	QUnit.module("Preview Content Tests for step with long title as null", {
		beforeEach : function(assert) {
			var that = this;
			var done = assert.async();
			that.spy = {};
			var oRepresentationHandlerStub = {
				getActualLegends : function() {
					return {
						sContext : "legend",
						sProperty : "None"
					};
				},
				getActualDimensions : function() {
					return {
						sContext : "xAxis",
						sProperty : "AirlineCode",
						concat : function(oPropLegend) {
							return [ {
								sContext : "xAxis",
								sProperty : "AirlineCode"
							}, oPropLegend ];
						}
					};
				},
				getActualMeasures : function() {
					return [ {
						sContext : "yAxis",
						sProperty : "Amount"
					} ];
				}
			};
			sap.apf.testhelper.modelerUIHelper.getModelerInstance(function(modelerInstance) {
				that.spy.isInitialTextKey = sinon.stub(modelerInstance.configurationHandler.getTextPool(), "isInitialTextKey", function(oStepLongTitle) {
					return true;
				});
				that.oModelerInstance = modelerInstance;
				var parameter = {
					that : that
				};
				that.oPreviewContentView = _instantiateView(parameter,"sap.apf.ui.representations.columnChart", oRepresentationHandlerStub, false, assert, false);
				done();
			});
		},
		afterEach : function() {
			var that = this;
			Object.keys(that.spy).forEach(function(key){
				that.spy[key].restore()
			})
			that.oPreviewContentView.destroy();
		}
	});
	QUnit.test("when the step has a long title with null value", function(assert) {
		//arrangement
		var that = this;
		var oMainChart = that.oPreviewContentView.byId("idMainChart");
		var sChartType = oMainChart.getItems()[0].getVizType();
		// Check dimensions and measures.
		var aDimensions = oMainChart.getItems()[0].getDataset().getDimensions();
		var aMeasures = oMainChart.getItems()[0].getDataset().getMeasures();
		var columnChartCode = "column";
		var aDimensionNames = aDimensions.map(function(oDimension) {
			return oDimension.getName();
		});
		var aMeasureNames = aMeasures.map(function(oMeasure) {
			return oMeasure.getName();
		});
		//assert
		assert.ok(that.oPreviewContentView.byId("idPreviewContentDialog"), "preview content dialog exist");
		assert.strictEqual(that.oPreviewContentView.byId("idPreviewContentDialog").isOpen(), true, "then preview content dialog is open");
		assert.ok(oMainChart.getItems()[0] instanceof sap.viz.ui5.controls.VizFrame, "then main chart is drawn on main chart holder.");
		assert.strictEqual(sChartType, columnChartCode, "and main chart is a column chart");
		assert.strictEqual(aDimensions.length, 1, " then one Dimensions are present in the chart.");
		assert.strictEqual(aMeasures.length, 1, "then one Measure is present in the chart.");
		//assert
		assert.strictEqual(aDimensionNames.toString(), "AirlineCode", "then AirlineCode available as dimensions.");
		assert.strictEqual(aMeasureNames.toString(), "Amount", "then Amount available as measure.");
	});
	QUnit.module("Instantiation of PreviewContent", {
		beforeEach : function() {
			var that = this;
			that.spy = {};
			var representationHandler = {
				getActualDimensions : function(){
					return ["AirlineCode"];
				},
				getActualMeasures : function(){
					return [{
						sContext : "yAxis",
						sProperty : "Amount"
					},{
						sContext: "yAxis2",
						sProperty: "Revenue"
					}];
				},
				getActualLegends : function(){
					return [];
				},
				getActualProperties : function(){
					return [];
				}
			};
			var stepPropertyMetadataHandler = {
				getProperties : function() {
					return ["ID"];
				},
				getMeasures : function() {
					return ["Amount", "Revenue"];
				},
				getDimensionsProperties : function() {
					return ["AirlineCode"];
				},
				getDefaultLabel : function(entityTypeMetadata, oText) {
					return oText;
				},
				getEntityTypeMetadataAsPromise : function() {
					var deferred = jQuery.Deferred();
					deferred.resolve();
					return deferred.promise();
				}
			};
			this.oViewData = {
				oCoreApi : {
					getText : function(key){
						return key;
					}
				},
				oRepresentation : {
					getRepresentationType : function(){
						return that.representationType;
					},
					getDimensionTextLabelKey : function(property){
						return property;
					},
					getMeasureTextLabelKey : function(property){
						return property;
					},
					getOrderbySpecifications : function(){
						return [];
					},
					getLeftUpperCornerTextKey : function(){
						return "leftUpper";
					},
					getLeftLowerCornerTextKey : function(){
						return "leftLower";
					},
					getRightUpperCornerTextKey : function(){
						return "rightUpper";
					},
					getRightLowerCornerTextKey : function(){
						return "rightLower";
					},
					getMeasureDisplayOption : function(property){
						if (property === "Revenue") {
							return "bar";
						}
						return "line";
					}
				},
				oRepresentationTypeHandler : new RepresentationTypesHandler(),
				oStepPropertyMetadataHandler : stepPropertyMetadataHandler,
				oRepresentationHandler : representationHandler,
				oParentStep : {
					getLongTitleId : function(){
						return "longTitle";
					},
					getTitleId : function(){
						return "title";
					}
				},
				oConfigurationHandler : {
					getTextPool : function(){
						return {
							isInitialTextKey  : function(){
								return false;
							},
							get : function(key){
								return {
									TextElementDescription : key
								};
							}
						};
					}
				}
			};
		},
		afterEach : function() {
			var that = this;
			Object.keys(that.spy).forEach(function(key){
				that.spy[key].restore()
			})
		}
	});
	QUnit.test("For all representations", function(assert) {
		var done = assert.async();
		var that = this;
		var promises = [];
		representationTypes().forEach(function(representationType){
			if(representationType.id !== "TreeTableRepresentation"){ //TreeTable has no preview
				promises.push(new Promise(function(resolve){
					that.representationType = representationType.id;
					sap.ui.view({
						viewName : "sap.apf.modeler.ui.view.previewContent",
						type : sap.ui.core.mvc.ViewType.XML,
						viewData : that.oViewData
					}).loaded().then(function(oView){
						assert.ok(true, "PreviewContent successfully created for " + representationType.id);
						oView.destroy();
						resolve();
					});
				}));
			}
		});
		Promise.all(promises).then(function(){
			done();
		});
	});
	function checkVizProperty(assert, vizProperties, thumbnailVizProperties, property, name) {
		var value = vizProperties[property];
		if ( value.hasOwnProperty(name)
			&& thumbnailVizProperties[property].hasOwnProperty(name)
			&& value.title.visible === true
		){
			assert.strictEqual(thumbnailVizProperties[property][name].visible, false,
				"THEN the thumbnails vizProperty : " + property + "." + name + " shall be set invisible");
		} else {
			assert.strictEqual(thumbnailVizProperties[property].hasOwnProperty(name), false,
				"THEN the thumbnails vizProperty : " + property + "." + name + " shall be not existing");
		}
	}
	QUnit.test("Combination Chart with MeasureOptions", function(assert) {
		// prove contract: names of view IDs where mainChart and thumbnailChart are located.
		// prove that the main chart is there, and the thumbnail chart, and both share vizProperties which are
		// invisible in the thumbnail.
		assert.expect(16); // TODO may be instable since it depends on the chart type.
		var done = assert.async();
		var that = this;
		that.representationType = "DualCombinationChart";
		//act
		sap.ui.view({
			viewName : "sap.apf.modeler.ui.view.previewContent",
			type : sap.ui.core.mvc.ViewType.XML,
			viewData : that.oViewData
		}).loaded().then(function(oView){
			assert.ok(true, "PreviewContent successfully created");
			var expectedDataShape = {
				primaryAxis : ["line"],
				secondaryAxis : ["bar"]
			};
			var mainChart = oView.byId("idMainChart").getItems()[0];
			var dataShapeVizProperties = mainChart.getVizProperties().plotArea.dataShape;
			assert.deepEqual(dataShapeVizProperties, expectedDataShape, "MeasureOptions are handed over to the vizframe");

			var thumbnailChart = oView.byId("idThumbnail").getItems()[0].getItems()[1].getItems()[1].getItems()[0];
			var vizProperties = mainChart.getVizProperties();
			var thumbnailVizProperties = thumbnailChart.getVizProperties();
			Object.keys(vizProperties).forEach(function(property){
				if (property === "general"
					|| property === "plotArea"
					|| property === "tooltip"
					|| property === "interaction" ) {
					return;
				}
				if ( vizProperties[property].visible === true) {
					assert.strictEqual(thumbnailVizProperties[property].visible, false,
						"THEN the thumbnails vizProperty : " + property + " shall be set invisible");
				}
				checkVizProperty(assert, vizProperties, thumbnailVizProperties, property, "title");
				checkVizProperty(assert, vizProperties, thumbnailVizProperties, property, "label");
			});
			oView.destroy();
			done();
		});
	});
});
