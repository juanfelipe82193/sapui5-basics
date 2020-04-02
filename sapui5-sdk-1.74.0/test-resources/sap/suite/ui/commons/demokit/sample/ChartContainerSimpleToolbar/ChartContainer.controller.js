sap.ui.define([ 'sap/ui/core/mvc/Controller', 'sap/ui/model/json/JSONModel', 'sap/viz/ui5/data/FlattenedDataset', 'sap/viz/ui5/controls/common/feeds/FeedItem' ],
	function(Controller, JSONModel, FlattenedDataset, FeedItem) {
	"use strict";

	var oPageController = Controller.extend("sap.suite.ui.commons.sample.ChartContainerSimpleToolbar.ChartContainer", {
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
		 */
		_constants: {
			sampleName: "sap.suite.ui.commons.sample.ChartContainerSimpleToolbar",
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
					},
						{
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
				modulePath: "/ChartContainerData.json",
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
			this._updateVizFrame(oVizFrame);
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
		}
	});
	return oPageController;
});
