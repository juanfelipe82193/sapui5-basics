/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/mdc/Control",
	"./ChartRenderer",
	"sap/ui/base/ManagedObjectObserver",
	"sap/ui/model/json/JSONModel",
	"sap/ui/mdc/library",
	"sap/ui/model/base/ManagedObjectModel",
	"sap/ui/model/Sorter",
	"sap/base/Log",
	"sap/base/util/deepEqual",
	"sap/ui/Device",
	"sap/ui/mdc/chart/ToolbarHandler"
],
function(
	Control,
	ChartRenderer,
	ManagedObjectObserver,
	JSONModel,
	MDCLib,
	ManagedObjectModel,
	Sorter,
	Log,
	deepEqual,
	Device,
	ToolbarHandler
) {
	"use strict";

	var ChartClass, ChartRb, MDCRb, SelectionHandler,
		DrillStackHandler, ChartTypeButton, MeasureItemClass;

	/**
	 /**
	 * Constructor for a new Chart.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class The Chart control creates a chart based on metadata and the configuration specified.
	 * @extends sap.ui.mdc.Control
	 * @author SAP SE
	 * @version 1.74.0
	 * @constructor
	 * @experimental
	 * @private
	 * @since 1.61
	 * @alias sap.ui.mdc.Chart
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var Chart = Control.extend("sap.ui.mdc.Chart", /** @lends sap.ui.mdc.Chart.prototype */ {
		metadata: {
			library: "sap.ui.mdc",
			defaultAggregation: "items",
			properties: {

				/**
				 * Specifies header text that is shown in chart
				 */
				header: {
					type: "string",
					group: "Misc",
					defaultValue: null
				},

				/**
				 * Specifies the type of chart to be created by the SmartChart control.
				 */
				chartType: {
					type: "string",
					group: "Misc",
					defaultValue: "column"
				},

				/**
				 * the selection mode of the chart
				 */
				selectionMode: {
					type: "string",
					group: "Misc",
					defaultValue: "MULTIPLE"
				},

				/**
				 * Defines the name of the condition model {@link sap.ui.mdc.ConditionModel}.
				 */
				conditionModelName: {
					type: "string",
					defaultValue: null
				},

				/**
				 * Set chart's legend properties.
				 *
				 * @since 1.62
				 */
				legendVisible: {
					type: "boolean",
					group: "Misc",
					defaultValue: true
				},

				/**
				 * The vizProperties
				 *
				 * @since 1.62
				 */
				vizProperties: {
					type: "object",
					group: "Misc"
				},

				/**
				 * The coloring
				 *
				 * @since 1.64
				 */
				_colorings: {
					type: "object",
					visibility: "_hidden",
					byValue: true
				},

				/**
				 * Specifies which actions should not be available in the chart's toolbar.
				 *
				 * @since 1.64
				 */
				ignoreToolbarActions: {
					type: "sap.ui.mdc.ChartToolbarActionType[]",
					defaultValue: []
				},

				/**
				 * The minimal width
				 */
				minWidth: {
					type: "sap.ui.core.CSSSize",
					group: "Dimension",
					defaultValue: "240px",
					invalidate: true
				},

				/**
				 * The minimal height
				 */
				minHeight: {
					type: "sap.ui.core.CSSSize",
					group: "Dimension",
					defaultValue: "400px",
					invalidate: true
				},
				/**
				 * Defines the sort conditions.
				 *
				 * <b>Note:</b> This property is exclusively used for handling flexibility changes. Do not use it for anything else.
				 *
				 * @since 1.74
				 */
				sortConditions: {
					type: "object"
				}
			},
			aggregations: {
				data: {
					multiple: true
				},
				items: {
					type: "sap.ui.mdc.chart.Item",
					multiple: true
				},
				actions: {
					type: "sap.ui.core.Control",
					multiple: true,
					forwarding: {
						idSuffix: "--toolbar",
						aggregation: "actions"
					}
				},
				_chart: {
					type: "sap.chart.Chart",
					multiple: false
				},
				_toolbar: {
					type: "sap.ui.mdc.ActionToolbar",
					multiple: false
				},
				_breadcrumbs:{
					type: "sap.m.Breadcrumbs",
					multiple: false
				},
				selectionDetailsActions: {
					type: "sap.ui.mdc.chart.SelectionDetailsActions",
					multiple: false
				}
			},
			events: {
				selectionDetailsActionPressed: {
					parameters: {

						/**
						 * The action that has to be processed once the action has been pressed
						 */
						action: {
							type: "sap.ui.core.Item"
						},

						/**
						 * If the action is pressed on one of the {@link sap.m.SelectionDetailsItem items}, the parameter contains the
						 * {@link sap.ui.model.Context context} of the pressed {@link sap.m.SelectionDetailsItem item}. If a custom action or action
						 * group of the SelectionDetails popover is pressed, this parameter contains all {@link sap.ui.model.Context contexts} of the
						 * {@link sap.m.SelectionDetailsItem items}.
						 */
						itemContexts: {
							type: "sap.ui.model.Context"
						},

						/**
						 * The action level of action buttons. The available levels are Item, List and Group
						 */
						level: {
							type: "sap.m.SelectionDetailsActionLevel"
						}
					}
				}
			}
		}
	});

	Chart.prototype.init = function() {
		this._oObserver = new ManagedObjectObserver(this.update.bind(this));

		this._oObserver.observe(this, {
			aggregations: [
				"items", "_chart"
			],
			properties: [
				"ignoreToolbarActions"
			]
		});

		this._oManagedObjectModel = new ManagedObjectModel(this);
		this.setModel(this._oManagedObjectModel, "$mdcChart");

		if (!this.oDelegatePromise) {
			this.setDelegate({
				name: "sap/ui/mdc/ChartDelegate"
			});
		}
	};

	Chart.prototype.applySettings = function(mSettings) {
		mSettings = mSettings || {};

		//add actions later
		var aActions = mSettings.actions || [];
		delete mSettings.actions;

		this.oChartPromise = this._getLibraryPromise().then(function() {

			if (!this._bIsBeingDestroyed) {

				return this.oDelegatePromise.then(function(oDelegate) {
					return oDelegate.fetchProperties(this);
				}.bind(this)).then(function(aProperties) {
					//create a keyed map of the items
					var mItems = {};

					for (var i = 0; i < aProperties.length; i++) {
						mItems[aProperties[i].name] = aProperties[i];
					}

					ToolbarHandler.createToolbar(this, aActions);

					this._createDrillBreadcrumbs();
					return this._createInnerChart(mSettings, mItems);
				}.bind(this));
			} else {
				return null;
			}

		}.bind(this));

		Control.prototype.applySettings.apply(this, [
			mSettings
		]);
	};

	Chart.prototype.bindAggregation = function(sName, oBindingInfo) {

		if (sName == "data") {
			this.oDataInfo = oBindingInfo;
			var oChart = this.getAggregation("_chart");

			if (oChart) {
				oChart.bindAggregation("data", oBindingInfo);
			} else {
				this.oChartPromise.then(function(oChart) {
					oChart.bindAggregation("data", this.oDataInfo);
				}.bind(this));
			}

			return this;
		}

		return Control.bindAggregation(sName, oBindingInfo);
	};

	Chart.prototype.getBindingInfo = function(sName) {

		if (sName == "data") {
			return this.oDataInfo;
		}

		return Control.prototype.getBindingInfo.apply(this, [
			sName
		]);
	};

	Chart.prototype.setLegendVisible = function(bVisible) {

		// inherited from vizFrame
		this.setVizProperties({
			'legend': {
				'visible': bVisible
			},
			'sizeLegend': {
				'visible': bVisible
			}
		});

		return this.setProperty("legendVisible", bVisible);
	};

	Chart.prototype._createInnerChart = function(mSettings, mItems) {
		var mInitialChartSettings = {}, oItem, aVizItems = [],
			aColMeasures = [], aInSettings = [], mVizItemSettings = {};

		mInitialChartSettings.chartType = '{$mdcChart>/chartType}';
		mInitialChartSettings.dimensions = [];
		mInitialChartSettings.measures = [];
		mInitialChartSettings.id = this.getId() + "--innerChart";
		mInitialChartSettings.height = '100%';
		mInitialChartSettings.width = '100%';
		mInitialChartSettings.vizProperties = '{$mdcChart>/vizProperties}';

		mSettings.items = mSettings.items || [];

		function moveToSettings(oVizItem) {
			if (this && this.getVizItemType() == "Dimension") {
				mInitialChartSettings.dimensions.push(oVizItem);
			} else {
				mInitialChartSettings.measures.push(oVizItem);
			}
		}

		function prepareColoring(oItem, oChart) {
			//COLORING
			if (oItem.getCriticality()) {
				oChart._addCriticality(oItem);
			}

			aInSettings.push(oItem.getKey());

			if (oItem.getAdditionalColoringMeasures) {

				for (var j = 0; j < oItem.getAdditionalColoringMeasures().length; j++) {

					if (aColMeasures.indexOf(oItem.getAdditionalColoringMeasures()[j]) == -1) {
						aColMeasures.push(oItem.getAdditionalColoringMeasures()[j]);
					}
				}
			}
		}

		function addAdditionalColoringMeasures(Delegate) {
			var sKey, mColorItem;

			for (var i = 0; i < aColMeasures.length; i++) {
				sKey = aColMeasures[i];

				if (aInSettings.indexOf(sKey) == -1) {
					mColorItem = Delegate.retrieveAggregationItem("items", mItems[sKey]);
					mColorItem = MeasureItemClass.getVizItemSettings(mColorItem.settings);
					//only add the measure to the vizFrame not to the mdc chart
					aVizItems.push(MeasureItemClass.createVizChartItem(mColorItem).then(moveToSettings));
				}
			}
		}

		for (var i = 0; i < mSettings.items.length; i++) {
			oItem = mSettings.items[i];
			prepareColoring(oItem, this);

			if (mItems[oItem.getKey()]) {
				mVizItemSettings = this.DELEGATE.retrieveAggregationItem("items", mItems[oItem.getKey()]).settings;
			} else {
				mVizItemSettings = undefined;
			}

			aVizItems.push(oItem.toVizChartItem(mVizItemSettings).then(moveToSettings.bind(oItem)));
		}

		//After collecting all additional measure names for coloring we need to add them
		addAdditionalColoringMeasures(this.DELEGATE);

		// We have to wait until all flex changes have been applied to the mdc.Chart
		var oWaitForChangesPromise = new Promise(function(resolve) {
			sap.ui.require([
				"sap/ui/fl/apply/api/FlexRuntimeInfoAPI"
			], function(FlexRuntimeInfoAPI) {

				// If the condition, that a control is assigned to a AppComponent is not fulfilled, we can go ahead
				if (!FlexRuntimeInfoAPI.isFlexSupported({element: this})) {
					return Promise.resolve();
				}

				// Otherwise we wait until the changes are applied
				FlexRuntimeInfoAPI.waitForChanges({element: this}).then(function() {
					return resolve();
				});
			}.bind(this));
		}.bind(this));

		return Promise.all(aVizItems, oWaitForChangesPromise).then(function() {
			var oChart = new ChartClass(mInitialChartSettings);
			//initial setup
			oChart.setVisibleDimensions([]);
			oChart.setVisibleMeasures([]);
			oChart.setInResultDimensions([]);

			this._oObserver.observe(oChart, {
				bindings: [
					"data"
				],
				aggregations: [
					"dimensions", "measures"
				]
			});

			this.setAggregation("_chart", oChart);
			return oChart;
		}.bind(this));
	};

	Chart.prototype.setSelectionMode = function(vValue) {
		var oChart = this.getAggregation("_chart");

		if (oChart) {
			oChart.setSelectionMode(vValue);

			if (vValue !== "NONE") {
				this._prepareSelection();
			}
		} else {
			this.oChartPromise.then(function(oChart) {

				if (oChart) {
					oChart.setSelectionMode(vValue);

					if (vValue !== "NONE") {
						this._prepareSelection();
					}
				}
			}.bind(this));
		}

		return this.setProperty("selectionMode", vValue, true);
	};

	Chart.prototype._getLibraryPromise = function() {

		if (!this.oChartLibPromise) {

			this.oChartLibPromise = new Promise(function(resolve, reject) {

				if (!ChartClass) {
					sap.ui.require([
						"sap/chart/Chart", "sap/ui/mdc/chart/ChartTypeButton", "sap/ui/mdc/chart/MeasureItem"
					], function(Chart, ChartTypeButtonLoaded, MeasureItem) {
						ChartClass = Chart;
						ChartTypeButton = ChartTypeButtonLoaded;
						ChartRb = sap.ui.getCore().getLibraryResourceBundle("sap.chart.messages");
						MDCRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
						MeasureItemClass = MeasureItem;
						resolve(true);
					});
				} else {
					resolve(true);
				}
			});
		}

		return this.oChartLibPromise;
	};

	/**
	 * Adds a Item to the chart
	 *
	 * @param {sap.ui.mdc.chart.Item} oItem a chart Item
	 * @param bSuppressInvalidate Suppress invalidation of the control
	 * @returns {sap.ui.mdc.Chart} the chart
	 */
	Chart.prototype.addItem = function(oItem, bSuppressInvalidate) {
		var oChart = this.getAggregation("_chart");

		if (oChart) {
			oItem.toChart(oChart);
		} else {
			this.oChartPromise.then(function(oChart) {
				if (oChart) {
					this.toChart(oChart);
				}
			}.bind(oItem));
		}

		this._oObserver.observe(oItem, {
			properties: [
				"visible", "inResult", "role"
			]
		});

		return this.addAggregation("items", oItem, bSuppressInvalidate);
	};

	/**
	 * Inserts a Item into the chart+
	 * @param {sap.ui.mdc.chart.Item} oItem a chart Item
	 * @param {int} iIndex the index
	 * @param bSuppressInvalidate Suppress invalidation of the control
	 * @returns {sap.ui.mdc.Chart} the chart
	 */
	Chart.prototype.insertItem = function(oItem, iIndex, bSuppressInvalidate) {

		if (oItem.getCriticality()) {
			this._addCriticality(oItem);
		}

		var oChart = this.getAggregation("_chart");

		if (oChart) {
			oItem.toChart(oChart);
		} else {
			this.oChartPromise.then(function(oChart) {

				if (oChart) {
					this.toChart(oChart);
				}
			}.bind(oItem));
		}

		this._oObserver.observe(oItem, {
			properties: [
				"visible", "inResult", "role"
			]
		});

		return this.insertAggregation("items", oItem, iIndex, bSuppressInvalidate);
	};

	/**
	 * Removes the chart item
	 *
	 * @param oItem {sap.ui.mdc.chart.Item} oItem a chart Item
	 * @param bSuppressInvalidate Suppress invalidation of the control
	 * @returns {*}
	 */
	Chart.prototype.removeItem = function(oItem, bSuppressInvalidate) {
		this._oObserver.unobserve(oItem);
		return this.removeAggregation("items", oItem, bSuppressInvalidate);
	};

	Chart.prototype.exit = function() {
		var oChart = this.getAggregation("_chart");

		if (oChart) {
			oChart.destroy();
		} else {
			this._bIsBeingDestroyed = true;
			this.oChartPromise.finally(function() {
				var oChart = this.getAggregation("_chart");

				if (oChart) {
					oChart.destroy();
				}
			}.bind(this));
		}

		Control.prototype.exit.apply(this, []);
	};

	/**
	 * shows the drill-down popover for selection a dimension to drill down to.
	 * @private
	 */
	Chart.prototype._showDrillDown = function() {

		if (DrillStackHandler) {

			if (!this._oDrillDownPopover) {
				DrillStackHandler.createDrillDownPopover(this);
			}

			DrillStackHandler.showDrillDownPopover(this);
		} else {
			sap.ui.require([
				"sap/ui/mdc/chart/DrillStackHandler"
			], function(DrillStackHandlerLoaded) {
				DrillStackHandler = DrillStackHandlerLoaded;
				DrillStackHandler.createDrillDownPopover(this);
				DrillStackHandler.showDrillDownPopover(this, this.getDelegate().name);
			}.bind(this));
		}
	};

	/**
	 * shows the Breadcrumbs for current drill-path and drilling up.
	 * @private
	 */
	Chart.prototype._createDrillBreadcrumbs = function() {

		if (DrillStackHandler) {

			if (!this._oDrillBreadcrumbs) {
				DrillStackHandler.createDrillBreadcrumbs(this);
			}
		} else {
			sap.ui.require([
				"sap/ui/mdc/chart/DrillStackHandler"
			], function(DrillStackHandlerLoaded) {
				DrillStackHandler = DrillStackHandlerLoaded;
				DrillStackHandler.createDrillBreadcrumbs(this);
			}.bind(this));
		}
	};

	Chart.prototype._getPropertyData = function() {
		return new Promise(function (resolve, reject) {

			// check if the data already has been retrieved
			if (!this.aFetchedProperties) {
				//retrieve the data
				return this.oDelegatePromise.then(function(oDelegate) {
					return oDelegate.fetchProperties(this);
				}.bind(this)).then(function(aFetchedProperties) {
					this.aFetchedProperties = aFetchedProperties;
					resolve(aFetchedProperties);
				}.bind(this));

			} else {
				//take the already instantiated data
				resolve(this.aFetchedProperties);
			}
		}.bind(this));
	};

	Chart.prototype.getAvailableChartTypes = function() {
		var aChartTypes = [];
		var oChart = this.getAggregation("_chart");

		if (oChart) {
			var aAvailableChartTypes = oChart.getAvailableChartTypes().available;

			if (aChartTypes) {

				for (var i = 0; i < aAvailableChartTypes.length; i++) {
					var sType = aAvailableChartTypes[i].chart;
					aChartTypes.push({
						key: sType,
						icon: ChartTypeButton.mMatchingIcon[sType],
						text: ChartRb.getText("info/" + sType),
						selected: (sType == this.getChartType())
					});
				}
			}
		}

		return aChartTypes;
	};

	Chart.prototype.getTypeInfo = function() {
		var sType = this.getChartType();
		var mInfo = {
			icon: ChartTypeButton.mMatchingIcon[sType],
			text: MDCRb.getText("chart.CHART_TYPE_TOOLTIP", [
				sType
			])
		};

		return mInfo;
	};

	/**
	 *
	 * @return {oModel} the managed object model
	 */
	Chart.prototype.getManagedObjectModel = function() {
		return this._oManagedObjectModel;
	};

	Chart.prototype.update = function(oChanges) {
		var oChart = this.getAggregation("_chart");

		if (oChart) {
			this._update(oChart, oChanges);
		} else {
			this.oChartPromise.then(function(oChart) {

				if (oChart) {
					this._update(oChart, oChanges);
				}
			}.bind(this));
		}
	};

	Chart.prototype._update = function(oChart, oChanges) {
		var aItems = this.getItems(),
			oVizItem,
			oChartItem,
			aVisibleMeasures = [],
			aVisibleDimensions = [],
			aInResultDimensions = [],
			mDataPoints = {};

		if (oChanges.name === "ignoreToolbarActions") {
			ToolbarHandler.updateToolbar(this);
			return;
		}

		if (oChanges.name === "data" && oChanges.type === "binding" && oChanges.mutation === "prepare" && oChanges.object.isA("sap.chart.Chart")) {
			oChanges.bindingInfo.sorter = this._getSorters();
		}

		this._aInResultProperties = [];

		for (var i = 0; i < aItems.length; i++) {
			oChartItem = aItems[i];
			oVizItem = oChartItem.getVizItemType() == "Measure" ? oChart.getMeasureByName(oChartItem.getKey()) : oChart.getDimensionByName(oChartItem.getKey());

			if (!oVizItem) {
				continue;
			}

			if (oChartItem.getVisible()) {

				if (oChartItem.getVizItemType() == "Measure") {
					aVisibleMeasures.push(oVizItem.getName());

					if (oChartItem.getDataPoint()) {
						mDataPoints[oVizItem.getName()] = oChartItem.getDataPoint();
					}
				} else {
					aVisibleDimensions.push(oVizItem.getName());
				}

				this._aInResultProperties.push(oVizItem.getName());
			}

			//inResult only possible for dimensions
			if (oChartItem.getVizItemType() == "Dimension") {

				if (oChartItem.getInResult()) {
					aInResultDimensions.push(oVizItem.getName());
					this._aInResultProperties.push(oVizItem.getName());
				}
			}
		}

		var bRebind = false;

		if (!deepEqual(aVisibleDimensions, oChart.getVisibleDimensions())) {
			oChart.setVisibleDimensions(aVisibleDimensions);
			bRebind = true;
		}

		if (!deepEqual(aVisibleMeasures, oChart.getVisibleMeasures())) {
			oChart.setVisibleMeasures(aVisibleMeasures);
			bRebind = true;
		}

		if (!deepEqual(aInResultDimensions, oChart.getInResultDimensions())) {
			oChart.setInResultDimensions(aInResultDimensions);
			bRebind = true;
		}

		// Update binding with sorters
		if (bRebind) {
			this._rebind();
			this._updateSemanticalPattern(oChart, aVisibleMeasures, mDataPoints);
			this._updateColoring(oChart, aVisibleDimensions, aVisibleMeasures);
		}

		//TODO: Temporary Workaround
		//TODO: Investigate for a onUpdate event. Could save us effort in attaching to inner chart events
		if (DrillStackHandler && this.getAggregation("_breadcrumbs")){
			DrillStackHandler._updateDrillBreadcrumbs(this.getAggregation("_chart"), this.getAggregation("_breadcrumbs"));
		}

	};

	Chart.prototype._updateSemanticalPattern = function(oChart, aVisibleMeasures, mDataPoints) {

		for (var k = 0; k < aVisibleMeasures.length; k++) {
			//first draft only with semantic pattern
			var oDataPoint = mDataPoints[aVisibleMeasures[k]];

			if (oDataPoint) {

				if (oDataPoint.targetValue || oDataPoint.foreCastValue) {
					var oActualMeasure = oChart.getMeasureByName(aVisibleMeasures[k]);

					oActualMeasure.setSemantics("actual");

					if (oDataPoint.targetValue != null) {
						var oReferenceMeasure = oChart.getMeasureByName(oDataPoint.targetValue);

						if (oReferenceMeasure) {
							oReferenceMeasure.setSemantics("reference");
						} else {
							Log.error("sap.ui.mdc.Chart: " + oDataPoint.targetValue + " is not a valid measure");
						}
					}

					if (oDataPoint.foreCastValue) {
						var oProjectionMeasure = oChart.getMeasureByName(oDataPoint.foreCastValue);

						if (oProjectionMeasure) {
							oProjectionMeasure.setSemantics("projected");
						} else {
							Log.error("sap.ui.comp.SmartChart: " + oDataPoint.ForecastValue.Path + " is not a valid measure");
						}
					}

					oActualMeasure.setSemanticallyRelatedMeasures({
						referenceValueMeasure: oDataPoint.targetValue,
						projectedValueMeasure: oDataPoint.foreCastValue
					});
				}
			}
		}
	};

	Chart.prototype._updateColoring = function(oChart, aVisibleDimensions, aVisibleMeasures, mDataPoints) {
		var oColoring = this.getProperty("_colorings"), k;

		if (oColoring && oColoring.Criticality) {
			var oActiveColoring;

			//dimensions overrule
			for (k = 0; k < aVisibleDimensions.length; k++) {

				if (oColoring.Criticality.DimensionValues[aVisibleDimensions[k]]) {
					oActiveColoring = {
						coloring: "Criticality",
						parameters: {
							dimension: aVisibleDimensions[k]
						}
					};

					delete oColoring.Criticality.MeasureValues;
					break;
				}
			}

			if (!oActiveColoring) {
				delete oColoring.Criticality.DimensionValues;

				for (var sMeasure in oColoring.Criticality.MeasureValues) {

					if (aVisibleMeasures.indexOf(sMeasure) == -1) {
						delete oColoring.Criticality.MeasureValues[sMeasure];
					}
				}

				oActiveColoring = {
					coloring: "Criticality",
					parameters: {
						measure: aVisibleMeasures
					}
				};
			}

			if (oActiveColoring) {
				oChart.setColorings(oColoring);
				oChart.setActiveColoring(oActiveColoring);
			}
		}
	};

	Chart.prototype._prepareSelection = function() {

		if (SelectionHandler) {
			SelectionHandler.prepareChart(this);
		} else {

			if (!this.oSelectionHandlerPromise) {
				this.oSelectionHandlerPromise = new Promise(function(resolve, reject) {
					sap.ui.require([
						"sap/ui/mdc/chart/SelectionHandler"
					], function(SelectionHandlerLoaded) {
						SelectionHandler = SelectionHandlerLoaded;
						resolve(true);
					});
				});
			}

			this.oSelectionHandlerPromise.then(function() {
				SelectionHandler.prepareChart(this);
			}.bind(this));
		}
	};

	Chart.prototype._getSorters = function() {
		var aSorters, oSorter;
		var mSortedProperties = this.getSortConditions() || {};

		Object.keys(mSortedProperties).forEach(function(sName){
			if (this._aInResultProperties.indexOf(sName) != -1) {
				oSorter = new Sorter(sName, mSortedProperties[sName].descending);

				if (aSorters) {
					aSorters.push(oSorter);
				} else {
					aSorters = [
						oSorter
					];//[] has special meaning in sorting
				}
			}
		}, this);

		return aSorters;
	};

	Chart.prototype._rebind = function() {
		if (this.getAggregation("_chart") && this.getAggregation("_chart").getBinding("data")) {
			this.getAggregation("_chart").getBinding("data").sort(this._getSorters());
		}
	};

	Chart.prototype._addCriticality = function(oItem) {
		var oColoring = this.getProperty("_colorings");

		oColoring = oColoring || {
			Criticality: {
				DimensionValues: {},
				MeasureValues: {}
			}
		};

		var mCrit = oItem.getCriticality(), mChartCrit = {};

		if (oItem.getVizItemType() == "Dimension") {

			for (var sKey in mCrit) {

				mChartCrit[sKey] = {
					Values: mCrit[sKey]
				};
			}

			oColoring.Criticality.DimensionValues[oItem.getKey()] = mChartCrit;
		} else {

			for (var sKey in mCrit) {
				mChartCrit[sKey] = mCrit[sKey];
			}

			oColoring.Criticality.MeasureValues[oItem.getKey()] = mChartCrit;
		}

		this.setProperty("_colorings", oColoring);
	};

	Chart.prototype.getCollectionModel = function() {
		var oBindingInfo = this.getBindingInfo("data");
		return oBindingInfo ? this.getModel(oBindingInfo.model) : null;
	};

	Chart.prototype.getCollectionPath = function() {
		var oBindingInfo = this.getBindingInfo("data");
		return oBindingInfo ? oBindingInfo.path : null;
	};

	Chart.prototype.done = function() {
		return this.oChartPromise;
	};

	return Chart;
}, true);
