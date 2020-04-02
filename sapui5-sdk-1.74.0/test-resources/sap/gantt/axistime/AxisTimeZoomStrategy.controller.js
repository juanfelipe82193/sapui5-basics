sap.ui.define([
		'jquery.sap.global',
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel',
		'test/sap/gantt/axistime/settingsModel',
		'test/sap/gantt/axistime/ganttConfig',
		'sap/gantt/misc/Format',
		'sap/gantt/axistime/StepwiseZoomStrategy',
		'sap/gantt/axistime/FullScreenStrategy',
		'sap/gantt/config/TimeHorizon',
	], function(jQuery, Controller, JSONModel, settingsModel, ganttConfig, Format, StepwiseZoomStrategy, FullScreenStrategy, TimeHorizon) {
	"use strict";

	var Controller = Controller.extend("test.sap.gantt.axistime.AxisTimeZoomStrategy", {
		onInit: function(){
			this._oSettingModel = new JSONModel(settingsModel);
			var oView = this.getView();
			oView.setModel(this._oSettingModel);

			//for simplification, we use the same data for all zoom strategies
			var sDataFilePath = "/StrategyDemo.json";
			var oStrategyDemoData = new JSONModel(jQuery.sap.getModulePath("test.sap.gantt.axistime", sDataFilePath));
			//for simplification, we use the same configuration (except for zoom strategy) for all zoom strategies
			this._oGanttChartContainer = oView.byId("GanttChartContainer");
			this._oGanttChartContainer.setModel(oStrategyDemoData, "test");
			this._oGanttChartWithTable = this._oGanttChartContainer.getGanttCharts()[0];
			this._oGanttChartWithTable.bindAggregation("rows",
					{
						path: "test>/root",
						parameters: {
							arrayNames: ["children"]
						}
					}
			);
			this._oGanttChartWithTable.setShapeDataNames(ganttConfig["shapeDataNames"]);
			this._oGanttChartWithTable.setShapes(ganttConfig.configShape());
			this._oControlTypeSelect = sap.ui.getCore().byId("idView--zoomControlTypeSelect");
			this._oStrategyTypeSelect = sap.ui.getCore().byId("idView--zoomStrategyTypeSelect");
			this._oTypeHelpPopover = sap.ui.xmlfragment({
				fragmentContent: jQuery.sap.byId("fragment1").html()
			});
			this._oControlTypeHelpPopover = sap.ui.xmlfragment({
				fragmentContent: jQuery.sap.byId("fragment2").html()
			});
			oView.addDependent(this._oTypeHelpPopover);
			oView.addDependent(this._oControlTypeHelpPopover);
		},

		onAfterRendering: function(){
			this.onZoomStrategyChanged();//set default zoom strategy according to select
		},

		getConfigProperty: function(sContextPath){
			return this._oSettingModel.getProperty(sContextPath);
		},

		onZoomStrategyChanged: function(oControlEvent) {
			if (oControlEvent) {
				this._sSelectedStrategyTypeContextPath = oControlEvent.getParameters().selectedItem.getBindingContext().getPath();
			} else {
				this._sSelectedStrategyTypeContextPath = this._oStrategyTypeSelect.getSelectedItem().getBindingContext().getPath();
			}

			//set new zoom strategy
			this._oGanttChartWithTable.setAxisTimeStrategy(this.getConfigProperty(this._sSelectedStrategyTypeContextPath + "/axisTimeStrategy"));
			//re-bind the control type select
			this._oControlTypeSelect.bindItems({
				path: this._sSelectedStrategyTypeContextPath + "/zoomControlType/values",
				template: new sap.ui.core.Item({
					key: "{key}",
					text: "{name}"
				})
			});
			this._oControlTypeSelect.bindProperty("selectedKey", {path: this._sSelectedStrategyTypeContextPath + "/zoomControlType/defaultSelected"});
			this.onZoomControlChanged();
			//need to add custom toolbar items again because setting toolbar schemes will clear them
			if (this._oGanttChartWithTable.getAxisTimeStrategy() instanceof StepwiseZoomStrategy && !this._customToolbarItemAdded) {
				this._oGanttChartContainer.addCustomToolbarItem(this.getCustomToolbarItemsForStepwiseStrategy());
				this._customToolbarItemAdded = true;
			}
		},

		onZoomControlChanged: function(oControlEvent) {
			if (oControlEvent) {
				this._sSelectedControlTypeContextPath = oControlEvent.getParameters().selectedItem.getBindingContext().getPath();
			} else {
				this._sSelectedControlTypeContextPath = this._oControlTypeSelect.getSelectedItem().getBindingContext().getPath();
			}

			//set zoom control type
			var oCurrentToolbarScheme = this.getCurrentToolbarScheme();
			oCurrentToolbarScheme.getTimeZoom().setZoomControlType(this.getConfigProperty(this._sSelectedControlTypeContextPath + "/value"));
			//set infoOfSelectItems
			var aInfoOfSelectItems;
			if (this._oGanttChartWithTable.getAxisTimeStrategy() instanceof sap.gantt.axistime.StepwiseZoomStrategy){
				aInfoOfSelectItems = this.createInfoOfSelectItemsByTimeLineOptions(this._oGanttChartWithTable.getAxisTimeStrategy().getTimeLineOptions());
			} else {
				aInfoOfSelectItems = [];
			}
			oCurrentToolbarScheme.getTimeZoom().setInfoOfSelectItems(aInfoOfSelectItems);
			//this is very strange: why set the property from its current value?
			//because neither oCurrentToolbarScheme.invalidate nor this._oGanttChartContainer.invalidate works.
			this._oGanttChartContainer.setToolbarSchemes(this._oGanttChartContainer.getToolbarSchemes());
		},

		onVisibleHorizonStartTimeChange: function(oControlEvent) {
			var oVisibleHorizon = this._oGanttChartWithTable.getAxisTimeStrategy().getVisibleHorizon();
			var sNewStartTime = oControlEvent.getParameters().value;
			var dNewStartTime = sap.ui.core.format.DateFormat.getDateTimeInstance().parse(sNewStartTime, false, false);
			oVisibleHorizon.setStartTime(Format.dateToAbapTimestamp(dNewStartTime));
			this._oGanttChartWithTable.getAxisTimeStrategy().setVisibleHorizon(oVisibleHorizon);
		},

		//TODO: the fit view feature is unfinished because after clicking the button and switching to the full screen strategy, the dropdown of stepwise
		//strategy don't work.
		getCustomToolbarItemsForStepwiseStrategy: function() {
			var that = this;
			var oCurrentStrategy = that._oGanttChartWithTable.getAxisTimeStrategy();
			return new sap.m.Button({
				text: "Fit View",
				press: function() {
					var oTimeHorizon = new TimeHorizon({
						startTime: that.getConfigProperty("/zoomStrategyType/totalHorizonStartTime"),
						endTime: that.getConfigProperty("/zoomStrategyType/totalHorizonEndTime")
					});
					that._oGanttChartWithTable.setAxisTimeStrategy(new FullScreenStrategy({
						totalHorizon: oTimeHorizon,
						visibleHorizon: oTimeHorizon,
						timeLineOptions: oCurrentStrategy.getTimeLineOptions(),
						calendarType: oCurrentStrategy.getCalendarType(),
						locale: oCurrentStrategy.getLocale()
					}));
				}
			});
		},

		onCalendarTypeSelected: function(oControlEvent) {
			var oAxisTimeStrategy = this._oGanttChartWithTable.getAxisTimeStrategy();
			var oSelectedCalendarType = this.getConfigProperty(oControlEvent.getSource().getBindingPath('buttons') + "/" + oControlEvent.getParameters().selectedIndex);
			oAxisTimeStrategy.setLocale(oSelectedCalendarType.locale);
			var oTimeLineOptions = oAxisTimeStrategy.getTimeLineOptions();
			if (oSelectedCalendarType.type === sap.ui.core.CalendarType.Gregorian) {
				sap.m.URLHelper.redirect(window.location.href, false);
			} else {
				//adjust the formats for special calendar types such as Japanese, Islamic and Persian.
				for (var i in oTimeLineOptions) {
					var oInnerInterval = oTimeLineOptions[i].innerInterval;
					delete oTimeLineOptions[i].largeInterval.pattern;
					switch (oInnerInterval.unit) {
						case sap.gantt.config.TimeUnit.minute:
							oTimeLineOptions[i].largeInterval.format = "yyMMMEEEEd";
							break;
						case sap.gantt.config.TimeUnit.hour:
							oTimeLineOptions[i].largeInterval.format = "yyMMMEEEEd";
							break;
						case sap.gantt.config.TimeUnit.day:
							oTimeLineOptions[i].largeInterval.format = "yyyyMMMM";
							break;
						case sap.gantt.config.TimeUnit.week:
							oTimeLineOptions[i].largeInterval.format = "yyyyMMMM";
							break;
						case sap.gantt.config.TimeUnit.month:
							if (oInnerInterval.span < 3) {
								oTimeLineOptions[i].largeInterval.format = "yyyyMMMM";
							} else {
								oTimeLineOptions[i].largeInterval.format = "yyyy";
							}
							break;
						case sap.gantt.config.TimeUnit.year:
							oTimeLineOptions[i].largeInterval.format = "yyyy";
							break;
						default:
							oTimeLineOptions[i].largeInterval.format = "yyMMMEEEEd";
							break;
					}
				}
				oAxisTimeStrategy.setCalendarType(oSelectedCalendarType.type);
				this._oGanttChartWithTable.invalidate();
			}
		},

		showTypeHelpPopover: function(oControlEvent) {
			this._oTypeHelpPopover.openBy(oControlEvent.getSource());
		},

		showControlTypeHelpPopover: function(oControlEvent) {
			this._oControlTypeHelpPopover.openBy(oControlEvent.getSource());
		},

		createInfoOfSelectItemsByTimeLineOptions: function(oTimeLineOptions){
			var aInfoOfSelectItems = [];
			for (var i in oTimeLineOptions) {
				var oStepwiseTimeLineOption = oTimeLineOptions[i];
				aInfoOfSelectItems.push(new sap.ui.core.Item({
					key: i,
					text: oStepwiseTimeLineOption.text
				}));
			}
			return aInfoOfSelectItems;
		},

		getCurrentToolbarScheme: function() {
			var sContainerLayoutKey = this._oGanttChartContainer.getContainerLayoutKey();
			var aContainerLayouts = this._oGanttChartContainer.getContainerLayouts();
			var oCurrentContainerLayout;
			for (var i = 0; i < aContainerLayouts.length; i++) {
				if (aContainerLayouts[i].getKey() == sContainerLayoutKey) {
					oCurrentContainerLayout = aContainerLayouts[i];
					break;
				}
			}
			var sToolbarSchemeKey = oCurrentContainerLayout.getToolbarSchemeKey();
			var aToolbarSchemes = this._oGanttChartContainer.getToolbarSchemes();
			var oCurrentToolbarScheme;
			for (var i = 0; i < aToolbarSchemes.length; i++) {
				if (aToolbarSchemes[i].getKey() == sToolbarSchemeKey) {
					oCurrentToolbarScheme = aToolbarSchemes[i];
					break;
				}
			}

			return oCurrentToolbarScheme;
		}


	});
});
