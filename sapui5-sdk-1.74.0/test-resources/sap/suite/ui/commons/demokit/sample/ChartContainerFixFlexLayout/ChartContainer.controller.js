sap.ui.define([ 'sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/viz/ui5/data/FlattenedDataset', 'sap/viz/ui5/controls/common/feeds/FeedItem', 'sap/m/Label',
				'sap/m/ColumnListItem', 'sap/m/library', 'sap/m/MessageToast', 'sap/m/Column' ],
	function(Controller, JSONModel, FlattenedDataset, FeedItem, Label, ColumnListItem, MobileLibrary, MessageToast, Column) {
	"use strict";

	var oPageController = Controller.extend("sap.suite.ui.commons.sample.ChartContainerFixFlexLayout.ChartContainer", {
		/* ============================================================ */
		/* Constants                                                    */
		/* ============================================================ */
		/**
		 * Constants used in the example.
		 *
		 * @private
		 * @property {String} sampleName Name of the chart container sample
		 * @property {Object} vizFrame Viz Frame used in the view
		 * @property {String} vizFrame.id Id of the Viz Frame
		 * @property {Object} vizFrame.dataset Config used for the Viz Frame Flattened data
		 * @property {Object[]} vizFrame.dataset.dimensions Flattened data dimensions
		 * @property {Object[]} vizFrame.dataset.measures Flattened data measures
		 * @property {Object} vizFrame.dataset.data Flattened data other config
		 * @property {Object} vizFrame.dataset.data.path Flattened data path
		 * @property {String} vizFrame.modulePath Path to the module's data
		 * @property {String} vizFrame.type Viz Frame Type
		 * @property {Object} vizFrame.properties Viz Frame properties
		 * @property {Object} vizFrame.properties.plotArea Viz Frame plot area property
		 * @property {Object} vizFrame.properties.plotArea.showGap Viz Frame plot area property
		 * @property {Object[]} vizFrame.feedItems Viz Frame feed items
		 * @property {Object} table Table used in the view
		 * @property {String} table.id Id of the table
		 * @property {String} table.itemBindingPath Item binding path
		 * @property {String[]} table.columnLabelTexts Array of table column labels
		 * @property {String[]} table.columnLabelTexts Array of table template cell labels
		 * @property {String} table.modulePath Path to the table data
		 */
		_constants: {
			sampleName: "sap.suite.ui.commons.sample.ChartContainerFixFlexLayout",
			vizFrame: {
				id: "chartContainerVizFrame",
				dataset: {
					dimensions: [{
						name: 'Country',
						value: "{Country}"
					}],
					measures: [{
						group: 1,
						name: 'Profit',
						value: '{Revenue2}'
					}, {
						group: 1,
						name: 'Target',
						value: '{Target}'
					}, {
						group: 1,
						name: "Forcast",
						value: "{Forcast}"
					}, {
						group: 1,
						name: "Revenue",
						value: "{Revenue}"
					}, {
						group: 1,
						name: 'Revenue2',
						value: '{Revenue2}'
					}, {
						group: 1,
						name: "Revenue3",
						value: "{Revenue3}"
					}],
					data: {
						path: "/Products"
					}
				},
				modulePath: "/ChartContainerData1.json",
				type: "line",
				properties: {
					plotArea: {
						showGap: true
					}
				},
				feedItems: [{
					'uid': "primaryValues",
					'type': "Measure",
					'values': ["Revenue"]
				}, {
					'uid': "axisLabels",
					'type': "Dimension",
					'values': ["Country"]
				}, {
					'uid': "targetValues",
					'type': "Measure",
					'values': ["Target"]
				}]
			},
			table: {
				id: "chartContainerContentTable",
				itemBindingPath: "/businessData",
				columnLabelTexts: ["Sales Month", "Marital Status", "Customer Gender", "Sales Quarter", "Cost", "Unit Price", "Gross Profit", "Sales Revenue"],
				templateCellLabelTexts: ["{Sales_Month}", "{Marital Status}", "{Customer Gender}", "{Sales_Quarter}", "{Cost}", "{Unit Price}", "{Gross Profit}", "{Sales Revenue}"],
				modulePath: "/ChartContainerData2.json"
			}
		},
		/* ============================================================ */
		/* Life-cycle Handling                                          */
		/* ============================================================ */
		/**
		 * Method called when the application is initalized.
		 *
		 * @public
		 */
		onInit: function() {
			var oVizFrame = this.getView().byId(this._constants.vizFrame.id);
			var oTable = this.getView().byId(this._constants.table.id);

			this._updateVizFrame(oVizFrame);
			this._updateTable(oTable);
		},
		/* ============================================================ */
		/* Helper Methods                                               */
		/* ============================================================ */
		/**
		 * Updated the Viz Frame in the view.
		 *
		 * @private
		 * @param {sap.viz.ui5.controls.VizFrame} vizFrame Viz Frame that needs to be updated
		 */
		_updateVizFrame: function(vizFrame) {
			var oVizFrame = this._constants.vizFrame;
			var oVizFramePath = jQuery.sap.getModulePath(this._constants.sampleName, oVizFrame.modulePath);
			var oModel = new JSONModel(oVizFramePath);
			var oDataset = new FlattenedDataset(oVizFrame.dataset);

			vizFrame.setVizProperties(oVizFrame.properties);
			vizFrame.setDataset(oDataset);
			vizFrame.setModel(oModel);
			this._addFeedItems(vizFrame, oVizFrame.feedItems);
			vizFrame.setVizType(oVizFrame.type);
		},
		/**
		 * Updated the Table in the view.
		 *
		 * @private
		 * @param {sap.m.table} table Table that needs to be updated
		 */
		_updateTable: function(table) {
			var oTable = this._constants.table;
			var oTablePath = jQuery.sap.getModulePath(this._constants.sampleName, oTable.modulePath);
			var oTableModel = new JSONModel(oTablePath);
			var aColumns = this._createTableColumns(oTable.columnLabelTexts);

			for (var i = 0; i < aColumns.length; i++) {
				table.addColumn(aColumns[i]);
			}

			var oTableTemplate = new ColumnListItem({
				type: MobileLibrary.ListType.Active,
				cells: this._createLabels(oTable.templateCellLabelTexts)
			});

			table.bindItems(oTable.itemBindingPath, oTableTemplate);
			table.setModel(oTableModel);
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
		 * @private
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
		 * @param {String[]} labelTexts text array
		 * @returns {sap.m.Column[]} Array of columns
		 */
		_createLabels: function(labelTexts) {
			return this._createControls(Label, "text", labelTexts);
		},
		/**
		 * Creates an array of controls with the specified control type, property name and value.
		 *
		 * @private
		 * @param {sap.ui.core.Control} Control Control type to create
		 * @param {String} prop Property name
		 * @param {Array} propValues Value of the control's property
		 * @returns {sap.ui.core.Control[]} array of the new controls
		 */
		_createControls: function(Control, prop, propValues) {
			var aControls = [];
			var oProps = {};
			for (var i = 0; i < propValues.length; i++) {
				oProps[prop] = propValues[i];
				aControls.push(new Control(oProps));
			}
			return aControls;
		}
	});
	return oPageController;
});
