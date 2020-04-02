sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/util/MockServer",
	"sap/ui/model/odata/v2/ODataModel",
	"sap/gantt/config/TimeHorizon",
	"sap/gantt/axistime/StepwiseZoomStrategy",
	"sap/gantt/axistime/ProportionZoomStrategy",
	"sap/gantt/misc/Format",
	"sap/ui/core/format/DateFormat",
	"sap/gantt/axistime/FullScreenStrategy"
], function(Controller, JSONModel, MockServer, ODataModel, TimeHorizon, StepwiseZoomStrategy, ProportionZoomStrategy, Format,
            DateFormat, FullScreenStrategy) {
	"use strict";

	function setSelectedIcon(oMenu, sText) {
		oMenu.getItems().forEach(function (oItem) { oItem.getText() === sText ? oItem.setIcon("sap-icon://accept") : oItem.setIcon(""); });
	}

	var bRTL = sap.ui.getCore().getConfiguration().getRTL(),
		oDateFormat = DateFormat.getDateInstance({pattern: "yyyy.MM.dd"});

	function getX(oStartTime, oEndTime, oAxisTime) {
		if (!oAxisTime || !oEndTime || !oStartTime) { return 0; }
		var vTime = bRTL ? (oEndTime || oStartTime) : oStartTime;
		if (vTime) {
			return oAxisTime.timeToView(Format.abapTimestampToDate(vTime));
		}
		return 0;
	}

	function getWidth(oStartTime, oEndTime, oAxisTime) {
		if (!oAxisTime || !oEndTime || !oStartTime) { return 0; }

		var nRetVal,
			startTime = oAxisTime.timeToView(Format.abapTimestampToDate(oStartTime)),
			endTime = oAxisTime.timeToView(Format.abapTimestampToDate(oEndTime));

		//if nRetVal is not numeric, return itself
		if (!jQuery.isNumeric(startTime) || !jQuery.isNumeric(endTime)) {
			return 0;
		}

		nRetVal = Math.abs(endTime - startTime);

		// set minimum width 1 to at least make the shape visible
		nRetVal = nRetVal <= 0 ? 1 : nRetVal;

		return nRetVal;
	}

	var oCustomZoomSettings = {
		totalHorizon: new TimeHorizon({
			startTime: "20160501000000",
			endTime: "20170901000000"
		}),
		visibleHorizon: new TimeHorizon({
			startTime: "20160501000000",
			endTime: "20170601000000"
		}),
		timeLineOptions: {
			"Date": sap.gantt.axistime.StepwiseTimeLineOptions.Date,
			"WeekOfYear": sap.gantt.axistime.StepwiseTimeLineOptions.WeekOfYear,
			"TwoWeeks": {
				text: "Two Weeks",
				innerInterval: {
					unit: sap.gantt.config.TimeUnit.week,
					span: 2,
					range: 64
				},
				largeInterval: {
					unit: sap.gantt.config.TimeUnit.month,
					span: 1,
					pattern: "LLL yyyy"
				},
				smallInterval: {
					unit: sap.gantt.config.TimeUnit.week,
					span: 2,
					pattern: "ww"
				}
			},
			"Month": sap.gantt.axistime.StepwiseTimeLineOptions.Month,
			"Quarter": sap.gantt.axistime.StepwiseTimeLineOptions.Quarter,
			"Year": sap.gantt.axistime.StepwiseTimeLineOptions.Year
		},
		timeLineOption: sap.gantt.axistime.StepwiseTimeLineOptions.Month
	};

	return Controller.extend("sap.gantt.simple.test.GanttChartArtifacts", {

		onInit : function() {
			var sServiceUrl = "http://my.test.service.com/";
			var oMockServer = new MockServer({
				rootUri : sServiceUrl
			});

			oMockServer.simulate("odata/metadata.xml", {
				sMockdataBaseUrl : "odata/",
				bGenerateMissingMockData : false
			});

			oMockServer.start();
			var oDataModel = new ODataModel(sServiceUrl, {
				useBatch: true,
				refreshAfterChange: false
			});

			oDataModel.setDefaultBindingMode("TwoWay");
			this.getView().setModel(oDataModel, "data");

			var oLegendModel = new JSONModel();
			oLegendModel.loadData("json/Legend.json");
			this.getView().setModel(oLegendModel, "legend");

			var oModel = new JSONModel({
				"null": null
			});
			this.getView().setModel(oModel, "other");

			this.oGantt = this.getView().byId("gantt");

			var bProportion = jQuery.sap.getUriParameters().get("proportion");
			var oZoomSettings = {
				totalHorizon: new TimeHorizon({
					startTime: "20160401000000",
					endTime: "20170901000000"
				}),
				visibleHorizon: new TimeHorizon({
					startTime: "20160401000000",
					endTime: "20170601000000"
				}),
				timeLineOption: sap.gantt.axistime.StepwiseTimeLineOptions.Month
			};
			var oZoomStrategy;
			if (bProportion === "x" || bProportion === "true") {
				oZoomStrategy = new ProportionZoomStrategy(oZoomSettings);
			} else {
				oZoomStrategy = new StepwiseZoomStrategy(oZoomSettings);
			}
			this.oGantt.setAxisTimeStrategy(oZoomStrategy);
		},
		createTimeLineOptions: function () {
			var aInfoOfSelectItems = [];
			var timeLineOptions = sap.gantt.axistime.StepwiseTimeLineOptions;
			for (var selectItem in timeLineOptions){
				aInfoOfSelectItems.push(timeLineOptions[selectItem]);
			}
			return aInfoOfSelectItems;
		},
		rowSettingsSelected: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			var oParent = oItem.getParent();
			oParent.getItems().forEach(function (oItem) { oItem.setIcon(""); });
			oItem.setIcon("sap-icon://accept");
			if (oParent.getText() === "Selection Mode") {
				this.oGantt.getTable().setSelectionMode(oItem.getText());
			} else if (oParent.getText() === "Selection Behavior") {
				this.oGantt.getTable().setSelectionBehavior(oItem.getText());
			}
		},
		shapeSettingsSelected: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			var oParent = oItem.getParent();
			oParent.getItems().forEach(function (oItem) { oItem.setIcon(""); });
			oItem.setIcon("sap-icon://accept");
			if (oParent.getText() === "Selection Mode") {
				this.oGantt.setShapeSelectionMode(oItem.getText());
			}
		},
		activeShapeFormatter: function (sType, sId) {
			switch (sType) {
				case "Diamond":
					return (sId === "object-0-2-6") ? 1 : 0;
				case "Chevron":
					switch (sId) {
						case "object-0-3":
							return 3;
						case "object-0-1":
							return 4;
						case "object-0-2":
							return 5;
						default:
							return 2;
					}
					break;
				case "Rectangle":
					switch (sId) {
						case "object-0-3-1":
							return 6;
						case "object-0-2-2":
							return 8;
						case "object-0-2-4":
							return 9;
						default:
							return 7;
					}
					break;
				default:
					return 0;
			}
		},
		getAxisTime: function () {
			if (!this.oGantt) {
				return null;
			}
			return this.oGantt.getAxisTime();
		},
		getWidth: function (oStartTime, oEndTime) {
			return getWidth(oStartTime, oEndTime, this.getAxisTime());
		},
		xProducer: function (oStartTime, oEndTime) {
			var oAxisTime = this.getAxisTime(),
				x = getX(oStartTime, oEndTime, oAxisTime);
			return bRTL ? x + getWidth(oStartTime, oEndTime, oAxisTime) : x;
		},
		xEndProducer: function (oStartTime, oEndTime) {
			var oAxisTime = this.getAxisTime(),
				x = getX(oStartTime, oEndTime, oAxisTime);
			return bRTL ? x : x + getWidth(oStartTime, oEndTime, oAxisTime);
		},
		xProducer2: function (oStartTime, oEndTime) {
			var oAxisTime = this.getAxisTime(),
				x = getX(oStartTime, oEndTime, oAxisTime);
			return bRTL ? x - 4 : x + getWidth(oStartTime, oEndTime, oAxisTime) + 4;
		},
		formatDate: function (oDate) {
			if (!oDate) {
				return "";
			}
			return oDateFormat.format(oDate);
		},
		rectangleFillFormatter: function (sObjectID, sSeverity) {
			if (sObjectID === "object-0-2-1") {
				var id = this.getView().byId("pattern_backslashFilled_gray").getId();
				return "url('#" + id + "')";
			} else if (sObjectID === "object-0-1-1" || sObjectID === "object-0-1-2") {
				return "#D5DADC";
			} else {
				return sSeverity ? "#DC0D0E" : "#5CBAE5";
			}
		},
		itemSelected: function (oEvent) {
			var oItem = oEvent.getParameter("item");
			if (oItem.getIcon() === "sap-icon://accept") {
				return;
			}

			var oParent = oItem.getParent();
			setSelectedIcon(oParent, oItem.getText());
			var oZoomStrategy,
				oToolbar = this.getView().byId("containerToolbar"),
				oZoomControlTypeMenu = this.getView().byId("zoomStrategyMenu");

			switch (oItem.getText()) {
				case "Stepwise Zoom Strategy":
					oToolbar.setInfoOfSelectItems(this.createTimeLineOptions());
					oToolbar.setStepCountOfSlider(11);
					oZoomStrategy = new StepwiseZoomStrategy({
						totalHorizon: new TimeHorizon({
							startTime: "20160401000000",
							endTime: "20170901000000"
						}),
						visibleHorizon: new TimeHorizon({
							startTime: "20160401000000",
							endTime: "20170601000000"
						}),
						timeLineOption: sap.gantt.axistime.StepwiseTimeLineOptions.Month
					});
					this.oGantt.setAxisTimeStrategy(oZoomStrategy);
					oToolbar.setZoomControlType(sap.gantt.config.ZoomControlType.SliderWithButtons);
					setSelectedIcon(oZoomControlTypeMenu.getMenu(), "Slider with buttons");
					break;
				case "Stepwise Zoom Strategy (Custom)":
					var oTimeLineOptions = oCustomZoomSettings.timeLineOptions;
					var aSelectOptions = Object.keys(oTimeLineOptions).reduce(function(pre, cur) {
						pre.push(oTimeLineOptions[cur]);
						return pre;
					}, []);
					oToolbar.setInfoOfSelectItems(aSelectOptions);
					oToolbar.setStepCountOfSlider(6);
					oZoomStrategy = new StepwiseZoomStrategy(oCustomZoomSettings);
					this.oGantt.setAxisTimeStrategy(oZoomStrategy);
					oToolbar.setZoomControlType(sap.gantt.config.ZoomControlType.SliderWithButtons);
					setSelectedIcon(oZoomControlTypeMenu.getMenu(), "Slider with buttons");
					break;
				case "Full Screen Zoom Strategy":
					oZoomStrategy = new FullScreenStrategy({
						visibleHorizon: new TimeHorizon({
							startTime: "20160501000000",
							endTime: "20170601000000"
						})
					});
					this.oGantt.setAxisTimeStrategy(oZoomStrategy);
					oToolbar.setZoomControlType(sap.gantt.config.ZoomControlType.None);
					//setSelectedIcon(oZoomControlTypeMenu.getMenu(), "Slider with buttons");
					break;
				case "Proportion Zoom Strategy":
				default:
					oToolbar.setInfoOfSelectItems([]);
					oToolbar.setStepCountOfSlider(10);
					oZoomStrategy = new ProportionZoomStrategy({
						totalHorizon: new TimeHorizon({
							startTime: "20160501000000",
							endTime: "20170901000000"
						}),
						visibleHorizon: new TimeHorizon({
							startTime: "20160501000000",
							endTime: "20170601000000"
						})
					});
					this.oGantt.setAxisTimeStrategy(oZoomStrategy);
					oToolbar.setZoomControlType(sap.gantt.config.ZoomControlType.SliderWithButtons);
					setSelectedIcon(oZoomControlTypeMenu.getMenu(), "Slider with buttons");
					break;
			}
		}
	});
});
