sap.ui.define([
	"sap/ui/demo/chartdemo/controller/BaseController",
	"sap/base/Log",
	"sap/viz/ui5/controls/Popover",
	"sap/viz/ui5/controls/common/feeds/FeedItem",
	"sap/viz/ui5/data/FlattenedDataset",
	"sap/viz/ui5/controls/common/helpers/DefaultPropertiesHelper"
], function(Controller, Log, Popover, FeedItem, FlattenedDataset, DefaultPropertiesHelper) {
	"use strict";

	return Controller.extend("sap.ui.demo.chartdemo.controller.Detail", {
		//test
		onRouteMatched: function(oEvent) {
			var urlInfo = this.parseURL(oEvent);
			this.switchChartInfo(urlInfo);
		},
		switchChartInfo: function(urlInfo) {
			this.switchChartByIndex(urlInfo.chartIndex.value);
			this.switchColorByColorIndex(urlInfo.colorIndex.value);
			this.switchPopoverByIndex(urlInfo.popoverIndex.value);
			if (urlInfo.measureIndex) {
				var parameters = urlInfo.measureIndex.value;
				var temp = [];
				var startIdx = 0;
				parameters.split('').forEach(function(elem, idx) {
					if (elem.toLowerCase() !== elem && idx !== startIdx) {
						temp.push(parameters.substring(startIdx, idx));
						startIdx = idx;
					}
					if (idx === parameters.length - 1) {
						temp.push(parameters.substring(startIdx, parameters.length));
					}
				});

				this.switchMeasuresByIndex(temp);
			}
		},
		switchChartByIndex: function(chartIndex) {
			if (new RegExp('Bar|Line|Column|Stacked_Column').test(chartIndex)) {
				this.oVizFrame.setVizType(chartIndex.toLowerCase());
			}
		},
		switchColorByColorIndex: function(colorIndex) {
			if (colorIndex === "Default_Color") {
				this.oVizFrame.setVizProperties({
					plotArea: {
						colorPalette: DefaultPropertiesHelper._general.plotArea.colorPalette
			     	}
				});
			}
			if (colorIndex === "Semantic_Color") {
				this.oVizFrame.setVizProperties({
					plotArea: {
						colorPalette: ['#d32030', '#e17b24', '#61a656', '#848f94']
					}
				});
			}
		},
		switchPopoverByIndex: function(popoverIndex) {
			var popoverProps = {};
			if (popoverIndex === "Customer_Popover") {
				this.chartPopover = new Popover(popoverProps);
				this.chartPopover.setActionItems([{
					type: 'navigation',
					text: 'Action Item 2',
					children: [{
						text: 'subActionItem 2 - 1',
						press: function() {
							Log.info('Action Item 2 - 1');
						}
					}]
				}, {
					type: 'navigation',
					text: 'Action Item 3',
					children: [{
						text: 'subActionItem 3-1',
						press: function() {
							Log.info('Action Item 3 - 1');
						}
					}, {
						text: 'subActionItem 3-2',
						press: function() {
							Log.info('Action Item 3 - 2');
						}
					}]
				}]);
				this.oVizFrame.attachSelectData(this.fnSwitchPop, this);
			}
			if (popoverIndex === "Default") {
				this.chartPopover = new Popover(popoverProps);
				this.chartPopover.setActionItems();
				this.oVizFrame.attachSelectData(this.fnSwitchPop, this);
			}
		},
		switchMeasuresByIndex: function(measureIndex) {
			this.oVizFrame.destroyDataset();
			this.oVizFrame.destroyFeeds();
			var vizInfo = this.getVizInfo(measureIndex);
			var feedItem = vizInfo.feedItem;
			var oDataset = vizInfo.dataset;
			var title = vizInfo.title;
			this.oVizFrame.setVizProperties({
				title: title
			});
			this.oVizFrame.setDataset(oDataset);
			var oVizFrame = this.oVizFrame;
			feedItem.forEach(function(item) {
				oVizFrame.addFeed(item);
			});
		},
		fnSwitchPop: function() {
			this.chartPopover.connect(this.oVizFrame.getVizUid());
		},
		getVizInfo: function(measureIndex) {
			var vizInfo = {
				feedItem: this.getFeedItem(measureIndex),
				title: this.getTitle(measureIndex),
				dataset: this.getFlattenedDataset(measureIndex)
			};
			return vizInfo;
		},
		isExist: function(o) {
			if ((typeof(o) === 'undefined') || (o === null)) {
				return false;
			}
			return true;
		},
		getFeedItem: function(measureIndex) {
			if (!this.isExist(measureIndex)) {
				measureIndex = ['Profit', 'Cost', 'Revenue'];
			}
			var feedPrimaryValues = {
				uid: 'primaryValues',
				type: 'Measure',
				values: measureIndex
			};
			var feedAxisLabels = {
				uid: 'axisLabels',
				type: 'Dimension',
				values: ['Item Category']
			};
			return [new FeedItem(feedPrimaryValues), new FeedItem(feedAxisLabels)];
		},
		getFlattenedDataset: function(measureIndex) {
			if (!this.isExist(measureIndex)) {
				measureIndex = ['Profit', 'Cost', 'Revenue'];
			}
			var measures = [];
			measureIndex.map(function(item) {
				var obj = {
					name: item,
					value: '{' + item + '}'
				};
				measures.push(obj);
			});
			var dataset = {
				dimensions: [{
					name: 'Item Category',
					value: "{Item Category}"
				}],
				measures: measures,
				data: {
					path: "/book"
				}
			};
			return new FlattenedDataset(dataset);
		},
		getTitle: function(measureIndex) {
			if (!this.isExist(measureIndex)) {
				measureIndex = ['Profit', 'Cost', 'Revenue'];
			}
			var text = null;
			for (var i = 0; i < measureIndex.length; ++i) {
				text = measureIndex[i];
				if (i < measureIndex.length - 1) {
					text += ' and ';
				}
			}
			text += ' by Item Category';
			return {
				visible: true,
				text: text
			};
		},
		navButtonPress: function() {
			// This is only relevant when running on phone devices
			this.getRouter().myNavBack("main");
		},
		onInit: function() {
			//way 1: use the route
			this.getRouter().attachRoutePatternMatched(this.onRouteMatched, this);
			var vizInfo = this.getVizInfo();
			var oDataset = vizInfo.dataset;
			var feedItem = vizInfo.feedItem;
			var title = vizInfo.title;
			// -------- VizFrame ----------------
			this.chartPopover = this.getView().byId("idPopOver");
			this.oVizFrame = this.getView().byId("idoVizFrame");
			this.oVizFrame.setDataset(oDataset);
			var oVizFrame = this.oVizFrame;
			feedItem.forEach(function(item) {
				oVizFrame.addFeed(item);
			});
			this.oVizFrame.setVizType('bar');
			this.oVizFrame.setVizProperties({
				plotArea: {
					dataLabel: {
						visible: true
					},
					colorPalette: this.colorPalette
				},
				legend: {
					title: {
						visible: false
					}
				},
				title: title
			});

			var popoverProps = {};
			this.chartPopover = new Popover(popoverProps);

			this.chartPopover.setActionItems();
			this.chartPopover.connect(this.oVizFrame.getVizUid());
			this.oVizFrame.attachEventOnce('renderComplete', function(){
				this.colorPalette = this.oVizFrame.getVizProperties().plotArea.colorPalette;
			}.bind(this));
		},
		attachContentChange: function(evt) {
			var itemId = evt.getParameter("selectedItemId");
			sap.m.MessageToast.show("ContentChange event was fired. Selected Item was changed to:" + itemId);
		}
	});

});
