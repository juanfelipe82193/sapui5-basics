sap.ui.define([ 'sap/ui/core/mvc/Controller', 'sap/suite/ui/commons/sample/ChartContainerActions/ChartContainerSelectionDetails', 'sap/viz/ui5/controls/common/feeds/AnalysisObject', 'sap/suite/ui/commons/ChartContainerContent', 'sap/viz/ui5/controls/VizFrame', 'sap/ui/model/json/JSONModel', 'sap/viz/ui5/data/FlattenedDataset', 'sap/viz/ui5/controls/common/feeds/FeedItem', 'sap/m/Label' ],
	function(Controller, ChartContainerSelectionDetails, AnalysisObject, ChartContainerContent, VizFrame, JSONModel, FlattenedDataset, FeedItem, Label) {
	"use strict";

	var pageController = Controller.extend("sap.suite.ui.commons.sample.ChartContainerActions.ChartContainer", {

		/* ============================================================ */
		/* Constants                                                    */
		/* ============================================================ */
		/**
		 * Constants used in the example.
		 *
		 * @private
		 * @property {string} sampleName Name of the chart container sample
		 * @property {string} chartContainerId Id of the chart container
		 * @property {object} vizFrames Data for Viz Frames by products, country 1, and country 2
		 * @property {object} vizFrames.config Common configuration applicable to all Viz Frames
		 * @property {object} vizFrames.config.height Height of the Viz Frame in pixels
		 * @property {object} vizFrames.config.width Relative (%) width of the Viz Frame
		 * @property {object} vizFrames.config.uiConfig UI specific config
		 * @property {object} vizFrames.config.uiConfig.applicationSet Application set
		 * @property {object} vizFrames.country Config
		 * @property {string} vizFrames.country.icon Icon used for the viz frame
		 * @property {string} vizFrames.country.title Title used for the viz frame
		 * @property {string} vizFrames.country.dataPath Data path
		 * @property {object} vizFrames.country.dataSet Data holder for information used by flattened data control
		 * @property {object[]} vizFrames.country.dataSet.dimensions Data dimensions
		 * @property {object[]} vizFrames.country.dataSet.measures Data measures
		 * @property {object} vizFrames.country.dataSet.data Other data
		 * @property {string} vizFrames.country.dataSet.data.path Path to flattened data
		 * @property {object[]} vizFrames.country.feedItems Feed items
		 * @property {object} vizFrames.country.analysisObjectProps Properties for the analysis object
		 * @property {string} vizFrames.country.analysisObjectProps.uid Analysis object uid
		 * @property {string} vizFrames.country.analysisObjectProps.type Analysis object type
		 * @property {string[]} vizFrames.country.analysisObjectProps.values Analysis object value array
		 * @property {object[]} vizFrames.country.vizType Viz Frame type
		 */
		_constants: {
			sampleName: "sap.suite.ui.commons.sample.ChartContainerActions",
			chartContainerId: "chartContainer",
			vizFrames: {
				config: {
					height: "700px",
					width: "100%",
					uiConfig: {
						applicationSet: "fiori"
					}
				},
				country: {
					icon: "sap-icon://vertical-bar-chart",
					title: "Bar Chart",
					dataPath: "/ChartContainerData.json",
					dataset: {
						dimensions: [{
							name: "Country",
							value: "{Country}"
						}],
						measures: [{
							name: "Profit",
							value: "{profit}"
						}],
						data: {
							path: "/businessData"
						}
					},
					feedItems: [{
						uid: "primaryValues",
						type: "Measure",
						values: [ "Profit" ]
					}, {
						uid: "axisLabels",
						type: "Dimension",
						values: []
					}],
					analysisObjectProps: {
						uid: "Country",
						type: "Dimension",
						name: "Country"
					},
					vizType: "column"
				}
			}
		},

		/**
		 * Method called when the application is initialized.
		 *
		 * @public
		 */
		onInit: function() {
			var oCountryVizFrame = this._constants.vizFrames.country;
			var oAnalysisObject = new AnalysisObject(oCountryVizFrame.analysisObjectProps);
			var aValues = oCountryVizFrame.feedItems[1].values;
			if (aValues.length === 0) {
				aValues.push(oAnalysisObject);
			}

			var oContent = new ChartContainerContent({
				icon: oCountryVizFrame.icon,
				title: oCountryVizFrame.title
			});
			oContent.setContent(this._createVizFrame(this._constants.vizFrames.country));
			var oChartContainer = this.getView().byId(this._constants.chartContainerId);
			oChartContainer.addContent(oContent);

			ChartContainerSelectionDetails._initializeSelectionDetails(oContent);
			oChartContainer.updateChartContainer();
		},

		/**
		 * Creates a Viz Frame based on the passed config.
		 *
		 * @param {object} vizFrameConfig Viz Frame config
		 * @returns {sap.viz.ui5.controls.VizFrame} Created Viz Frame
		 */
		_createVizFrame: function(vizFrameConfig) {
			var oVizFrame = new VizFrame(this._constants.vizFrames.config);
			var oDataPath = jQuery.sap.getModulePath(this._constants.sampleName, vizFrameConfig.dataPath);
			var oModel = new JSONModel(oDataPath);
			var oDataSet = new FlattenedDataset(vizFrameConfig.dataset);

			oVizFrame.setDataset(oDataSet);
			oVizFrame.setModel(oModel);
			this._addFeedItems(oVizFrame, vizFrameConfig.feedItems);
			oVizFrame.setVizType(vizFrameConfig.vizType);
			return oVizFrame;
		},

		/**
		 * Adds the passed feed items to the passed Viz Frame.
		 *
		 * @private
		 * @param {sap.viz.ui5.controls.VizFrame} vizFrame Viz Frame to add feed items to
		 * @param {object[]} feedItems Feed items to add
		 */
		_addFeedItems: function(vizFrame, feedItems) {
			for (var i = 0; i < feedItems.length; i++) {
				vizFrame.addFeed(new FeedItem(feedItems[i]));
			}
		},

		/**
		 * Creates label control array with the specified texts.
		 *
		 * @private
		 * @param {string[]} labelTexts Text array
		 * @returns {sap.m.Label[]} Array of labels
		 */
		_createLabels: function(labelTexts) {
			return this._createControls(Label, "text", labelTexts);
		},

		/**
		 * Creates an array of controls with the specified control type, property name and value.
		 *
		 * @private
		 * @param {function} constructor Contructor function of the control to be created.
		 * @param {string} prop Property name
		 * @param {Array} propValues Value of the control's property
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

	return pageController;
});
