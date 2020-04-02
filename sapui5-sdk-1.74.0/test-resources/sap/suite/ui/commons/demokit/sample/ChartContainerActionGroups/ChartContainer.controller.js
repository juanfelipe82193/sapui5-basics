sap.ui.define([ 'sap/ui/core/mvc/Controller', 'sap/suite/ui/commons/sample/ChartContainerActionGroups/ChartContainerSelectionDetails', 'sap/ui/model/json/JSONModel', 'sap/viz/ui5/data/FlattenedDataset', 'sap/m/ColumnListItem', 'sap/viz/ui5/controls/common/feeds/FeedItem', 'sap/m/Column', 'sap/m/Label' ],
	function(Controller, ChartContainerSelectionDetails, JSONModel, FlattenedDataset, ColumnListItem, FeedItem, Column, Label) {
	"use strict";

	var oPageController = Controller.extend("sap.suite.ui.commons.sample.ChartContainerActionGroups.ChartContainer", {
		/* ============================================================ */
		/* Constants                                                    */
		/* ============================================================ */
		/**
		 * Constants used in the example.
		 *
		 * @private
		 * @property {String} sampleName Name of the chart container sample
		 * @property {String} chartContainer.id ID of the chart container
		 * @property {Object} table Configuration for the table used in the view
		 * @property {String} table.id Id of the table
		 * @property {String} table.dataPath Data path
		 * @property {String} table.itemBindingPath Table item binding path
		 * @property {String[]} table.columnLabelTexts Label texts used for the table columns
		 * @property {String[]} table.templateCellLabelTexts Label texts used for the table template cells
		 * @property {Object} vizFrame Configuration for the vizFrame used in the view
		 * @property {Object} vizFrame.id ID of the vizFrame
		 * @property {String} vizFrame.dataPath Data path
		 * @property {Object} vizFrame.dataSet Data holder for information used by flattened data control
		 * @property {Object[]} vizFrame.dataSet.dimensions Data dimensions
		 * @property {Object[]} vizFrame.dataSet.measures Data measures
		 * @property {Object} vizFrame.dataSet.data Other data
		 * @property {String} vizFrame.dataSet.data.path Path to flattened data
		 * @property {Object[]} vizFrame.feedItems Feed items
		 * @property {Object[]} vizFrame.vizType Viz Frame type
		 */
		_constants: {
			sampleName: "sap.suite.ui.commons.sample.ChartContainerActionGroups",
			chartContainer: {
				id: "chartContainer"
			},
			table: {
				id: "chartContainerContentTable",
				dataPath: "/ChartContainerData.json",
				itemBindingPath: "/businessData",
				columnLabelTexts: [ "Sales Month", "Marital Status", "Customer Gender", "Sales Quarter", "Cost", "Unit Price", "Gross Profit", "Sales Revenue" ],
				templateCellLabelTexts: [ "{Sales Month}", "{Marital Status}", "{Customer Gender}", "{Sales Quarter}", "{Cost}", "{Unit Price}", "{Gross Profit}", "{Sales Revenue}" ]
			},
			vizFrame: {
				id: "chartContainerContentVizFrame",
				dataPath: "/ChartContainerData.json",
				dataset: {
					dimensions: [{
						name: "Sales Quarter",
						value: "{Sales Quarter}"
					}, {
						name: "Customer Gender",
						value: "{Customer Gender}"
					}, {
						name: "Sales Month",
						value: "{Sales Month}"
					}, {
						name: "Marital Status",
						value: "{Marital Status}"
					}],
					measures: [{
						name: "Cost",
						value: "{Cost}"
					}, {
						name: "Unit Price",
						value: "{Unit Price}"
					}, {
						name: "Gross Profit",
						value: "{Gross Profit}"
					}, {
						name: "Sales Revenue2",
						value: "{Sales Revenue}"
					}],
					data: {
						path: "/businessData"
					}
				},
				feedItems: [{
					uid: "primaryValues",
					type: "Measure",
					values: [ "Cost" ]
				}, {
					uid: "secondaryValues",
					type: "Measure",
					values: [ "Unit Price" ]
				}, {
					uid: "bubbleWidth",
					type: "Measure",
					values: [ "Gross Profit" ]
				}, {
					uid: "bubbleHeight",
					type: "Measure",
					values: [ "Sales Revenue" ]
				}, {
					uid: "regionColor",
					type: "Dimension",
					values: [ "Sales Month", "Sales Quarter", "Customer Gender" ]
				}, {
					uid: "regionShape",
					type: "Dimension",
					values: [ "Marital Status" ]
				}],
				vizType: "bubble"
			}
		},

		/* ============================================================ */
		/* Life-cycle Handling                                          */
		/* ============================================================ */
		/**
		 * Method called when the application is initialized.
		 *
		 * @public
		 */
		onInit: function() {
			var oVizFrame = this.getView().byId(this._constants.vizFrame.id);
			var oTable = this.getView().byId(this._constants.table.id);
			var oChartContainer = this.getView().byId(this._constants.chartContainer.id);

			this._updateVizFrame(oVizFrame);
			this._updateTable(oTable);
			ChartContainerSelectionDetails.initializeSelectionDetails(oChartContainer.getContent()[0]);
		},

		/* ============================================================ */
		/* Helper Methods                                               */
		/* ============================================================ */
		/**
		 * Updated the vizFrame in the view.
		 *
		 * @private
		 * @param {sap.viz.ui5.controls.VizFrame} vizFrame Viz Frame that needs to be updated
		 */
		_updateVizFrame: function(vizFrame) {
			var oVizFrame = this._constants.vizFrame;
			var oDataPath = jQuery.sap.getModulePath(this._constants.sampleName, oVizFrame.dataPath);
			var oModel = new JSONModel(oDataPath);
			var oDataSet = new FlattenedDataset(oVizFrame.dataset);

			vizFrame.setDataset(oDataSet);
			vizFrame.setModel(oModel);
			this._addFeedItems(vizFrame, oVizFrame.feedItems);
			vizFrame.setVizType(oVizFrame.vizType);
		},

		/**
		 * Updated the table in the view.
		 *
		 * @private
		 * @param {sap.m.Table} table Table that needs to be updated
		 */
		_updateTable: function(table) {
			var oTable = this._constants.table;
			var oDataPath = jQuery.sap.getModulePath(this._constants.sampleName, oTable.dataPath);
			var oModel = new JSONModel(oDataPath);

			var aColumns = this._createTableColumns(oTable.columnLabelTexts);
			for (var i = 0; i < aColumns.length; i++) {
				table.addColumn(aColumns[i]);
			}

			var oTableTemplate = new ColumnListItem({
				type: sap.m.ListType.Active,
				cells: this._createLabels(oTable.templateCellLabelTexts)
			});

			table.bindItems(oTable.itemBindingPath, oTableTemplate, null, null);
			table.setModel(oModel);
		},

		/**
		 * Adds the passed feed items to the passed Viz Frame.
		 *
		 * @private
		 * @param {sap.viz.ui5.controls.VizFrame} vizFrame Viz Frame to add feed items to
		 * @param {Object[]} feedItems Feed items to add
		 */
		_addFeedItems: function(vizFrame, feedItems) {
			for (var i = 0; i < feedItems.length; i++) {
				vizFrame.addFeed(new FeedItem(feedItems[i]));
			}
		},

		/**
		 * Creates table columns with labels as headers.
		 *
		 * @param {String[]} labels Column labels
		 * @returns {sap.m.Column[]} Array of columns
		 */
		_createTableColumns: function(labels) {
			var aLabels = this._createLabels(labels);

			return this._createControls(Column, "header", aLabels);
		},

		/**
		 * Creates label control array with the specified texts.
		 *
		 * @private
		 * @param {String[]} labelTexts Text array
		 * @returns {sap.m.Column[]} Array of columns
		 */
		_createLabels: function(labelTexts) {
			return this._createControls(Label, "text", labelTexts);
		},

		/**
		 * Creates an array of controls with the specified control type, property name and value.
		 *
		 * @private
		 * @param {function} constructor Contructor function of the control to be created.
		 * @param {String} prop Property name.
		 * @param {Array} propValues Values of the control's property.
		 * @returns {sap.ui.core.control[]} Array of the new controls
		 */
		_createControls: function(constructor, prop, propValues) {
			var aControls = [];
			var oProps = {};

			for (var i = 0; i < propValues.length; i++) {
				oProps[prop] = propValues[i];
				aControls.push(new constructor(oProps));
			}

			return aControls;
		}
	});

	return oPageController;
});
