/*global QUnit */
sap.ui.define([
	"sap/gantt/control/Toolbar",
	"sap/gantt/control/AssociateContainer",
	"sap/gantt/axistime/StepwiseZoomStrategy"
], function (Toolbar, AssociateContainer, StepwiseZoomStrategy) {
	"use strict";

	QUnit.module("Test local toolbar", {
		beforeEach:  function () {
			this.aHierarchiesConfig = [];
			this.aHierarchiesConfig.push(new sap.gantt.config.Hierarchy({
				key: "TOL",
				text: "Freight Order",
				toolbarSchemeKey: "LOCAL_TOOLBAR",
				activeModeKey: "D"
			}));
			this.aHierarchiesConfig.push(new sap.gantt.config.Hierarchy({
				key: "TRUCK",
				text: "Truck",
				toolbarSchemeKey: "LOCAL_TOOLBAR",
				activeModeKey: "A"
			}));
			this.aHierarchiesConfig.push(new sap.gantt.config.Hierarchy({
				key: "RESOURCES",
				text: "Resources",
				toolbarSchemeKey: "LOCAL_TOOLBAR",
				activeModeKey: "A"
			}));
			this.aModesConfig = [
				sap.gantt.config.DEFAULT_MODE,
				new sap.gantt.config.Mode({
					key: "D",
					text: "Activity Mode",
					icon: "sap-icon://activity-items"
				}), new sap.gantt.config.Mode({
					key: "A",
					text: "Document Mode",
					icon: "sap-icon://document"
				})
			];
			this.aToolbarSchemesConfig = [
				new sap.gantt.config.ToolbarScheme({
					key: "LOCAL_TOOLBAR",
					sourceSelect: new sap.gantt.config.ToolbarGroup({
						position: "L1",
						overflowPriority: sap.m.OverflowToolbarPriority.High
					}),
					customToolbarItems: new sap.gantt.config.ToolbarGroup({
						position: "L3",
						overflowPriority: sap.m.OverflowToolbarPriority.High
					}),
					expandTree: new sap.gantt.config.ToolbarGroup({
						position: "L2",
						overflowPriority: sap.m.OverflowToolbarPriority.Low
					}),
					mode: new sap.gantt.config.ModeGroup({
						position: "R1",
						overflowPriority: sap.m.OverflowToolbarPriority.Low,
						modeKeys: ["A", "D"]
					})
				})
			];

			this.aToolbarSchemesConfig1 = [
				new sap.gantt.config.ToolbarScheme({
					key: "LOCAL_TOOLBAR",
					customToolbarItems: new sap.gantt.config.ToolbarGroup({
						position: "L1",
						overflowPriority: sap.m.OverflowToolbarPriority.High
					})
				})

			];
			this.oLocalToolbar = new Toolbar({
				sourceId: "TOL",
				modes: this.aModesConfig,
				toolbarSchemes: this.aToolbarSchemesConfig,
				hierarchies: this.aHierarchiesConfig,
				type: sap.gantt.control.ToolbarType.Local
			});
			this.oLocalToolbar.placeAt("content");
			this.oLocalToolbar1 = new Toolbar({
				sourceId: "TOL",
				modes: this.aModesConfig,
				toolbarSchemes: this.aToolbarSchemesConfig1,
				hierarchies: this.aHierarchiesConfig,
				type: sap.gantt.control.ToolbarType.Local
			});
			this.oLocalToolbar2 = new Toolbar({
				sourceId: "TOL",
				modes: this.aModesConfig,
				toolbarSchemes: this.aToolbarSchemesConfig1,
				hierarchies: this.aHierarchiesConfig,
				type: sap.gantt.control.ToolbarType.Local
			});
		},
		afterEach: function () {
			this.oLocalToolbar.destroy();
			this.oLocalToolbar1.destroy();
			this.oLocalToolbar2.destroy();
		}
	});

	QUnit.test("Test local toolbar", function (assert) {
		//test toolbar items created in correction position
		var oRb = sap.ui.getCore().getLibraryResourceBundle("sap.gantt");
		assert.strictEqual(this.oLocalToolbar.getAllToolbarItems().length, 5, "Toolbar items created successfully");
		assert.strictEqual(this.oLocalToolbar.getAllToolbarItems()[0].getSelectedItem().getText(), "Freight Order", "Source select Correct");
		assert.strictEqual(this.oLocalToolbar.getAllToolbarItems()[1].getTooltip_Text(), oRb.getText("TLTP_EXPAND"), "Expand button correct");
		assert.strictEqual(this.oLocalToolbar.getAllToolbarItems()[2].getTooltip_Text(), oRb.getText("TLTP_COLLAPSE"), "Collapse button correct");
		assert.strictEqual(this.oLocalToolbar.getAllToolbarItems()[4].getButtons()[0].getTooltip_Text(), "Document Mode", "Document mode button correct");
		assert.strictEqual(this.oLocalToolbar.getAllToolbarItems()[4].getButtons()[1].getTooltip_Text(), "Activity Mode", "Activity mode button correct");
		//test add, insert and remove custom toolbar items
		this.oCustomItem0 = new sap.m.Button({
			text: "CB0",
			icon: "sap-icon://search",
			width: "38px",
			tooltip: "Custom button"
		});
		this.oCustomItem1 = new sap.m.Label({
			text: "CB1",
			width: "40px"
		});
		this.oCustomItem2 = new sap.m.CheckBox({
			text: "CB2",
			width: "70px"
		});
		this.oCustomItem3 = new sap.m.Text({
			text: "CB3",
			width: "50px"
		});

		this.oLocalToolbar.addCustomToolbarItem(this.oCustomItem1);
		assert.strictEqual(this.oLocalToolbar.getAllToolbarItems()[3].getText(), "CB1", "Add custom item from scratch");
		assert.strictEqual(this.oLocalToolbar.getCustomToolbarItems().length, 1, "There is one custom item");

		this.oLocalToolbar.insertCustomToolbarItem(this.oCustomItem0, 0);
		assert.strictEqual(this.oLocalToolbar.getAllToolbarItems()[3].getText(), "CB0", "Insert custom item at begin");
		assert.strictEqual(this.oLocalToolbar.getCustomToolbarItems().length, 2, "There are two custom items");

		this.oLocalToolbar.insertCustomToolbarItem(this.oCustomItem3, 8);
		assert.strictEqual(this.oLocalToolbar.getAllToolbarItems()[5].getText(), "CB3", "Insert custom item at end");
		assert.strictEqual(this.oLocalToolbar.getCustomToolbarItems().length, 3, "There are three custom items");

		this.oLocalToolbar.insertCustomToolbarItem(this.oCustomItem2, 2);
		assert.strictEqual(this.oLocalToolbar.getAllToolbarItems()[5].getText(), "CB2", "Insert custom item at middle");
		assert.strictEqual(this.oLocalToolbar.getCustomToolbarItems().length, 4, "There are four custom items");

		sap.ui.getCore().getConfiguration().getFormatSettings().setLegacyDateFormat("2");
		assert.strictEqual(true, this.oLocalToolbar.getCustomToolbarItems().length != 0, "Framework update control's property didn't clear custom tool bar items");

		this.oLocalToolbar.removeCustomToolbarItem(this.oCustomItem0);
		assert.strictEqual(this.oLocalToolbar.getAllToolbarItems()[3].getText(), "CB1", "Remove custom item using control");
		assert.strictEqual(this.oLocalToolbar.getCustomToolbarItems().length, 3, "There are three custom items");

		this.oLocalToolbar.removeCustomToolbarItem(0);
		assert.strictEqual(this.oLocalToolbar.getAllToolbarItems()[2].getTooltip_Text(), oRb.getText("TLTP_COLLAPSE"), "Remove custom item using index");
		assert.strictEqual(this.oLocalToolbar.getAllToolbarItems()[3].getText(), "CB2", "Remove custom item using index");
		assert.strictEqual(this.oLocalToolbar.getCustomToolbarItems().length, 2, "There are two custom items");

		this.oLocalToolbar.removeAllCustomToolbarItems();
		assert.strictEqual(this.oLocalToolbar.getAllToolbarItems()[4].getButtons()[0].getTooltip_Text(), "Document Mode", "Remove all custom items");
		assert.strictEqual(this.oLocalToolbar.getCustomToolbarItems().length, 0, "There is no custom item");

		this.oLocalToolbar.insertCustomToolbarItem(this.oCustomItem0, 0);
		assert.strictEqual(this.oLocalToolbar.getAllToolbarItems()[3].getText(), "CB0", "Insert custom item from scratch");
		this.oLocalToolbar.addCustomToolbarItem(this.oCustomItem1);
		assert.strictEqual(this.oLocalToolbar.getAllToolbarItems()[4].getText(), "CB1", "Add custom item after insert");

		this.oLocalToolbar.setMode("A");
		assert.strictEqual(this.oLocalToolbar.getMode(), "A", "Mode set successfully");

		this.oLocalToolbar1.addCustomToolbarItem(this.oCustomItem1);
		assert.strictEqual(this.oLocalToolbar1.getAllToolbarItems()[0].getText(), "CB1", "Add custom item at first position");

		this.oLocalToolbar2.insertCustomToolbarItem(this.oCustomItem1);
		assert.strictEqual(this.oLocalToolbar2.getAllToolbarItems()[0].getText(), "CB1", "Insert custom item at first position");
	});

	QUnit.module("Test global toolbar's ZoomControlType", {
		beforeEach: function () {
			this.aToolbarSchemesConfig = [
				new sap.gantt.config.ToolbarScheme({
					key: "GLOBAL_TOOLBAR",
					timeZoom: new sap.gantt.config.TimeZoomGroup({
						position: "R1",
						overflowPriority: sap.m.OverflowToolbarPriority.NeverOverflow,
						zoomControlType: sap.gantt.config.ZoomControlType.SliderOnly
					})
				})];
			this.aContainerLayouts = [
				new sap.gantt.config.ContainerLayout({
					key: "d1",
					text: "Single: Resources",
					toolbarSchemeKey: "GLOBAL_TOOLBAR",
					ganttChartLayouts: [new sap.gantt.config.GanttChartLayout({
						activeModeKey: "D",
						hierarchyKey: "RESOURCES"
					})]
				})
			];
		},
		afterEach: function () {
			this.oGlobalToolbar.destroy();
		}
	});

	QUnit.test("Test slideronly", function (assert) {
		this.aToolbarSchemesConfig[0].getTimeZoom().setStepCountOfSlider(20);
		this.oGlobalToolbar = new Toolbar({
			sourceId: "d1",
			toolbarSchemes: this.aToolbarSchemesConfig,
			containerLayouts: this.aContainerLayouts,
			zoomLevel: 0,
			type: sap.gantt.control.ToolbarType.Global
		});
		this.oGlobalToolbar.placeAt("content");
		assert.ok(this.oGlobalToolbar.getAllToolbarItems()[0] instanceof sap.m.ToolbarSpacer, "ToolbarSpacer correct");
		assert.ok(this.oGlobalToolbar.getAllToolbarItems()[1] instanceof sap.m.Slider, "slider correct");
		assert.strictEqual(this.oGlobalToolbar.getAllToolbarItems()[1].getMax(), 19, "stepCountOfSlider is correct");

		assert.strictEqual(this.oGlobalToolbar._getCounterOfZoomLevels(), 20, "Counter Of default Slider levels is correct");
		var oTimeLineOptions = sap.gantt.axistime.StepwiseTimeLineOptions;
		var aItems = [],
			iIndex = 0;
		for (var i in oTimeLineOptions) {
			aItems.push({
				key: iIndex,
				text: i.text
			});
			iIndex++;
		}
		this.oGlobalToolbar._oToolbarScheme.getTimeZoom().setInfoOfSelectItems(aItems);
		assert.strictEqual(this.oGlobalToolbar._getCounterOfZoomLevels(), 11, "Counter Of setting Slider levels is correct");
	});

	QUnit.test("Test ButtonsOnly", function (assert) {
		this.aToolbarSchemesConfig[0].getTimeZoom().setZoomControlType(sap.gantt.config.ZoomControlType.ButtonsOnly);
		this.oGlobalToolbar = new Toolbar({
			sourceId: "d1",
			toolbarSchemes: this.aToolbarSchemesConfig,
			containerLayouts: this.aContainerLayouts,
			zoomLevel: 0,
			type: sap.gantt.control.ToolbarType.Global
		});
		this.oGlobalToolbar.placeAt("content");
		assert.ok(this.oGlobalToolbar.getAllToolbarItems()[0] instanceof sap.m.ToolbarSpacer, "ToolbarSpacer correct");
		assert.ok(this.oGlobalToolbar.getAllToolbarItems()[1] instanceof sap.m.Button, "Button correct");
		assert.ok(this.oGlobalToolbar.getAllToolbarItems()[2] instanceof sap.m.Button, "Button correct");
	});

	QUnit.test("Test Select", function (assert) {
		this.aToolbarSchemesConfig[0].getTimeZoom().setZoomControlType(sap.gantt.config.ZoomControlType.Select);
		var oSelectItems = [{ key: "item1", text: "small" }, { key: "item2", text: "middle" }, { key: "item3", text: "large" }];
		this.aToolbarSchemesConfig[0].getTimeZoom().setInfoOfSelectItems(oSelectItems);
		this.oGlobalToolbar = new Toolbar({
			sourceId: "d1",
			toolbarSchemes: this.aToolbarSchemesConfig,
			containerLayouts: this.aContainerLayouts,
			zoomLevel: 0,
			type: sap.gantt.control.ToolbarType.Global
		});
		this.oGlobalToolbar.placeAt("content");
		assert.ok(this.oGlobalToolbar.getAllToolbarItems()[0] instanceof sap.m.ToolbarSpacer, "ToolbarSpacer correct");
		assert.ok(this.oGlobalToolbar.getAllToolbarItems()[1] instanceof sap.m.Select, "Select correct");
		var oSelectItemsResult = this.oGlobalToolbar.getAllToolbarItems()[1].getItems();
		oSelectItemsResult.forEach(function (oItem, i) {
			assert.strictEqual(oItem.getProperty("key"), oSelectItems[i].key, "selectItem[" + i + "]'s key is correct");
			assert.strictEqual(oItem.getProperty("text"), oSelectItems[i].text, "selectItem[" + i + "]'s text is correct");
		});
	});

	QUnit.test("Test None", function (assert) {
		this.aToolbarSchemesConfig[0].getTimeZoom().setZoomControlType(sap.gantt.config.ZoomControlType.None);
		this.oGlobalToolbar = new Toolbar({
			sourceId: "d1",
			toolbarSchemes: this.aToolbarSchemesConfig,
			containerLayouts: this.aContainerLayouts,
			zoomLevel: 0,
			type: sap.gantt.control.ToolbarType.Global
		});
		this.oGlobalToolbar.placeAt("content");
		assert.strictEqual(this.oGlobalToolbar.getAllToolbarItems().length, 0, "there is nothing in the globalToolBar");
	});

	QUnit.module("Test global toolbar event", {
		beforeEach: function () {
			this.oSelectItems = [{ key: "item1", text: "small" }, { key: "item2", text: "middle" }, { key: "item3", text: "large" }];
			this.aToolbarSchemesConfig = [
				new sap.gantt.config.ToolbarScheme({
					key: "GLOBAL_TOOLBAR",
					timeZoom: new sap.gantt.config.TimeZoomGroup({
						position: "R1",
						overflowPriority: sap.m.OverflowToolbarPriority.NeverOverflow,
						zoomControlType: sap.gantt.config.ZoomControlType.Select,
						infoOfSelectItems: this.oSelectItems
					})
				})];
			this.aContainerLayouts = [
				new sap.gantt.config.ContainerLayout({
					key: "d1",
					text: "Single: Resources",
					toolbarSchemeKey: "GLOBAL_TOOLBAR",
					ganttChartLayouts: [new sap.gantt.config.GanttChartLayout({
						activeModeKey: "D",
						hierarchyKey: "RESOURCES"
					})]
				})
			];
			this.oGlobalToolbar = new Toolbar({
				sourceId: "d1",
				toolbarSchemes: this.aToolbarSchemesConfig,
				containerLayouts: this.aContainerLayouts,
				zoomLevel: 0,
				type: sap.gantt.control.ToolbarType.Global
			});
			this.oGlobalToolbar.placeAt("content");
		}
	});

	QUnit.test("Test ZoomStopChange Event", function (assert) {
		var done = assert.async();
		var oSelect = this.oGlobalToolbar.getAllToolbarItems()[1];
		var oSelectedItem = oSelect.getItems()[1];
		assert.strictEqual(oSelectedItem.getKey(), this.oSelectItems[1].key, "Key is correct");
		assert.strictEqual(oSelectedItem.getText(), this.oSelectItems[1].text, "Text is correct");
		this.oGlobalToolbar.attachZoomStopChange(function (oEvent) {
			var index = oEvent.getParameter("index");
			var oItem = oEvent.getParameter("selectedItem");
			assert.strictEqual(index, oSelect.indexOfItem(oSelectedItem), "index is set successfully after ZoomStopChange");
			assert.strictEqual(oItem, oSelectedItem, "Item is set successfully after ZoomStopChange");
			done();
		}, this);
		var oSelectionOnFocus = { selectedItem: oSelectedItem };
		oSelect.setSelectedItem(oSelectedItem);
		oSelect.fireChange(oSelectionOnFocus);
	});

	QUnit.test("Test zoomControlTypeChange Event", function (assert) {
		var sControlType = sap.gantt.config.ZoomControlType.SliderWithButtons;
		assert.strictEqual(sControlType, "SliderWithButtons", "ZoomControlType is correct");

		this.oGlobalToolbar.attachEvent("_zoomControlTypeChange", function (oEvent) {
			var sZoomControlType = oEvent.getParameter("zoomControlType");
			assert.strictEqual(sap.gantt.config.ZoomControlType.Select, sZoomControlType, "ZoomControlType change is set successfully");
		}, this);
		sControlType = sap.gantt.config.ZoomControlType.Select;
		this.oGlobalToolbar.fireEvent("_zoomControlTypeChange", { zoomControlType: sControlType });
	});

	QUnit.module("static button default id", {
		beforeEach: function () {
			this.oToolbar = new Toolbar({
				sourceId: "TOL", //TOL is the source hierarchy KEY
				hierarchies: [
					new sap.gantt.config.Hierarchy({
						key: "TOL",
						text: "Freight Order",
						toolbarSchemeKey: "LOCAL_TOOLBAR", // Point to the toolbar schemes Key
						activeModeKey: "D"
					})
				],
				toolbarSchemes: [
					new sap.gantt.config.ToolbarScheme({
						key: "LOCAL_TOOLBAR",
						timeZoom: new sap.gantt.config.TimeZoomGroup({
							id: "tz",
							position: "R3"
						})
					})
				],
				type: sap.gantt.control.ToolbarType.Local
			});
		},
		afterEach: function () {
			this.oToolbar.destroy();
		},
		hasUi5Id: function (oControl) {
			return oControl.getId().startsWith("__");
		}
	});

	QUnit.test("without parent all id is generated by UI5", function (assert) {
		assert.ok(this.oToolbar != null, "toolbar is not null");
		assert.ok(this.oToolbar._oZoomOutButton != null, "zoom out button generated");
		assert.ok(this.hasUi5Id(this.oToolbar._oZoomOutButton), "zoom out button id is still UI5 id");

		assert.ok(this.oToolbar._oZoomSlider != null, "zoom slider generated");
		assert.ok(this.hasUi5Id(this.oToolbar._oZoomSlider), "zoom slider id is UI5 id");

		assert.ok(this.oToolbar._oZoomInButton != null, "zoom in button generated");
		assert.ok(this.hasUi5Id(this.oToolbar._oZoomInButton), "zoom in button id is still UI5 id");

		// same appied for other toolbar group items
	});

	QUnit.module("static button id on toolbar", {
		beforeEach: function () {
			this.oContainer = new sap.gantt.GanttChartContainer({
				id: "container",
				containerLayouts: [
					new sap.gantt.config.ContainerLayout({
						key: "containerLayoutKey",
						text: "Single: Resources",
						toolbarSchemeKey: "GLOBAL_TOOLBAR"
					})
				],
				containerLayoutKey: "containerLayoutKey",
				toolbarSchemes: [
					new sap.gantt.config.ToolbarScheme({
						key: "GLOBAL_TOOLBAR",
						sourceSelect: new sap.gantt.config.ToolbarGroup({
							id: "sourceSelect",
							position: "L1"
						}),
						expandTree: new sap.gantt.config.ToolbarGroup({
							id: "expandTree",
							position: "L2"
						}),
						expandChart: new sap.gantt.config.ExpandChartGroup({
							id: "expandChart",
							position: "L3",
							expandCharts: [
								new sap.gantt.config.ExpandChart({
									id: "expandTrue",
									isExpand: true,
									icon: "sap-icon://expand"
								}),
								new sap.gantt.config.ExpandChart({
									id: "expandFalse",
									isExpand: false,
									icon: "sap-icon://collapse"
								}),
								new sap.gantt.config.ExpandChart({
									id: "whatever"
								})
							]
						}),
						birdEye: new sap.gantt.config.BirdEyeGroup({
							id: "birdEye",
							position: "R4"
						}),
						timeZoom: new sap.gantt.config.TimeZoomGroup({
							id: "timeZoom",
							position: "R3"
						}),
						legend: new sap.gantt.config.ToolbarGroup({
							id: "legend",
							position: "R2"
						}),
						settings: new sap.gantt.config.SettingGroup({
							id: "settings",
							position: "R1"
						})
					})
				],
				ganttCharts: [new sap.gantt.GanttChartWithTable()]
			});
		},
		afterEach: function () {
			this.oContainer.destroy();
		}
	});

	QUnit.test("global toolbar static buttons", function (assert) {
		var byId = sap.ui.getCore().byId;
		assert.ok(byId("container-sourceSelect") != null, "sourceSelect button can be found");
		assert.ok(byId("container-expandTree-expand") != null, "expandTree button `expand` can be found");
		assert.ok(byId("container-expandTree-collapse") != null, "expandTree button `collapse` can be found");
		assert.ok(byId("container-expandTrue") != null, "expand chart: `expandTrue` button can be found");
		assert.ok(byId("container-expandFalse") != null, "expand chart: `expandFalse` button can be found");
		assert.ok(byId("container-whatever") != null, "expand chart: `whatever` button can be found");

		assert.ok(byId("container-birdEye") != null, "`birdEye` button can be found");
		assert.ok(byId("container-timeZoom-zoomIn") != null, "Zoom: `zoomIn` button can be found");
		assert.ok(byId("container-timeZoom-slider") != null, "Zoom: `slider` button can be found");
		assert.ok(byId("container-timeZoom-zoomOut") != null, "Zoom: `zoomOut` button can be found");
		assert.ok(byId("container-legend") != null, "`legend` button can be found");
		assert.ok(byId("container-settings") != null, "`settings` button can be found");
	});

	QUnit.module("Test global toolbar", {
		beforeEach:  function () {
			this.oLegendContainer = new sap.gantt.legend.LegendContainer({
				width: "220px",
				legendSections: [new sap.m.Page({
					title: "Message",
					content: [new sap.m.FlexBox({
						direction: sap.m.FlexDirection.Row,
						alignItems: sap.m.FlexAlignItems.Center,
						items: [new sap.m.CheckBox({
							selected: true
						}), new sap.ui.core.Icon({
							src: "sap-icon://message-error",
							size: "15px",
							color: "red",
							width: "25px"
						}), new sap.m.Label({
							text: "Error"
						})]
					}), new sap.m.FlexBox({
						direction: sap.m.FlexDirection.Row,
						alignItems: sap.m.FlexAlignItems.Center,
						items: [new sap.m.CheckBox({
							selected: true
						}), new sap.ui.core.Icon({
							src: "sap-icon://message-warning",
							size: "15px",
							color: "yellow",
							width: "25px"
						}), new sap.m.Label({
							text: "Warning"
						})]
					}), new sap.m.FlexBox({
						direction: sap.m.FlexDirection.Row,
						alignItems: sap.m.FlexAlignItems.Center,
						items: [new sap.m.CheckBox({
							selected: true
						}), new sap.ui.core.Icon({
							src: "sap-icon://message-information",
							size: "15px",
							color: "green",
							width: "25px"
						}), new sap.m.Label({
							text: "Information"
						})]
					})]
				}), new sap.m.Page({
					title: "Calendar",
					content: [new sap.m.FlexBox({
						direction: sap.m.FlexDirection.Row,
						alignItems: sap.m.FlexAlignItems.Center,
						items: [new sap.m.CheckBox({
							selected: true
						}), new sap.ui.core.Icon({
							src: "sap-icon://appointment",
							size: "15px",
							color: "yellow",
							width: "25px"
						}), new sap.m.Label({
							text: "DT"
						})]
					}), new sap.m.FlexBox({
						direction: sap.m.FlexDirection.Row,
						alignItems: sap.m.FlexAlignItems.Center,
						items: [new sap.m.CheckBox({
							selected: true
						}), new sap.ui.core.Icon({
							src: "sap-icon://appointment-2",
							size: "15px",
							color: "blue",
							width: "25px"
						}), new sap.m.Label({
							text: "NWT"
						})]
					})]
				})
				]
			});

			this.oZoomInfo = {
				base: {
					fScale: 3840000,
					sGranularity: "4day"
				},
				determinedByChartWidth: {
					fMinRate: 0.05659875635251411,
					fSuitableRate: 1.5979355938783355
				},
				determinedByConfig: {
					fMaxRate: 384,
					fMinRate: 0.02185792349726776,
					fRate: 1
				},
				iChartWidth: 1312
			};

			this.aToolbarSchemesConfig = [
				new sap.gantt.config.ToolbarScheme({
					key: "GLOBAL_TOOLBAR",
					sourceSelect: new sap.gantt.config.ToolbarGroup({
						position: "L1",
						overflowPriority: sap.m.OverflowToolbarPriority.High
					}),
					layout: new sap.gantt.config.LayoutGroup({
						position: "L2",
						overflowPriority: sap.m.OverflowToolbarPriority.Low,
						enableRichStyle: false
					}),
					customToolbarItems: new sap.gantt.config.ToolbarGroup({
						position: "L3",
						overflowPriority: sap.m.OverflowToolbarPriority.High
					}),
					expandChart: new sap.gantt.config.ExpandChartGroup({
						position: "L4",
						overflowPriority: sap.m.OverflowToolbarPriority.Low,
						expandCharts: [
							new sap.gantt.config.ExpandChart({
								isExpand: true,
								icon: "sap-icon://expand",
								tooltip: "Show Utilization.",
								chartSchemeKeys: ["ulc_main"]
							}),
							new sap.gantt.config.ExpandChart({
								isExpand: false,
								icon: "sap-icon://collapse",
								tooltip: "Hide Utilization.",
								chartSchemeKeys: ["ulc_main"]
							}),
							new sap.gantt.config.ExpandChart({
								isExpand: true,
								icon: "sap-icon://arrow-bottom",
								tooltip: "Show Detail.",
								chartSchemeKeys: ["ac_expand_overlap", "bc_hr"]
							}),
							new sap.gantt.config.ExpandChart({
								isExpand: false,
								icon: "sap-icon://arrow-top",
								tooltip: "Hide Detail.",
								chartSchemeKeys: ["ac_expand_overlap", "bc_hr"]
							})
						]
					}),

					timeZoom: new sap.gantt.config.TimeZoomGroup({
						position: "R4",
						overflowPriority: sap.m.OverflowToolbarPriority.NeverOverflow,
						zoomControlType: sap.gantt.config.ZoomControlType.SliderWithButtons
					}),
					legend: new sap.gantt.config.ToolbarGroup({
						position: "R3",
						overflowPriority: sap.m.OverflowToolbarPriority.Low
					}),
					settings: new sap.gantt.config.SettingGroup({
						position: "R2",
						overflowPriority: sap.m.OverflowToolbarPriority.Low,
						items: sap.gantt.config.DEFAULT_TOOLBAR_SETTING_ITEMS.concat(new sap.gantt.config.SettingItem({
							key: "CUST_SETTING1",
							checked: true,
							displayText: "Customized Setting 1",
							tooltip: "Narrow Down"
						}))
					}),
					mode: new sap.gantt.config.ModeGroup({
						position: "R1",
						overflowPriority: sap.m.OverflowToolbarPriority.Low,
						modeKeys: ["A", "D"]
					})
				})];

			this.aContainerLayouts = [
				new sap.gantt.config.ContainerLayout({
					key: "d1",
					text: "Single: Resources",
					toolbarSchemeKey: "GLOBAL_TOOLBAR",
					ganttChartLayouts: [new sap.gantt.config.GanttChartLayout({
						activeModeKey: "D",
						hierarchyKey: "RESOURCES"
					})]
				}),
				new sap.gantt.config.ContainerLayout({
					key: "d2",
					text: "Dual: Resources & Orders",
					toolbarSchemeKey: "GLOBAL_TOOLBAR",
					ganttChartLayouts: [new sap.gantt.config.GanttChartLayout({
						activeModeKey: "A",
						hierarchyKey: "RESOURCES"
					}), new sap.gantt.config.GanttChartLayout({
						activeModeKey: "D",
						hierarchyKey: "TOL"
					})]
				}),
				new sap.gantt.config.ContainerLayout({
					key: "d3",
					text: "Single: Freight Order",
					toolbarSchemeKey: "GLOBAL_TOOLBAR",
					ganttChartLayouts: [new sap.gantt.config.GanttChartLayout({
						activeModeKey: "D",
						hierarchyKey: "TOL"
					})]
				})
			];
			this.oGlobalToolbar = new Toolbar({
				sourceId: "d2",
				toolbarSchemes: this.aToolbarSchemesConfig,
				containerLayouts: this.aContainerLayouts,
				zoomLevel: 0,
				legend: new AssociateContainer({
					content: this.oLegendContainer.getId()
				}),
				type: sap.gantt.control.ToolbarType.Global
			});
			this.oGlobalToolbar.placeAt("content");
			sap.ui.getCore().applyChanges();
		},
		afterEach: function () {
			this.oGlobalToolbar.destroy();
		}
	});

	QUnit.test("Test global toolbar", function (assert) {
		var done = assert.async();

		//Test toolbar items created in right position
		var oRb = sap.ui.getCore().getLibraryResourceBundle("sap.gantt");
		assert.strictEqual(this.oGlobalToolbar.getToolbarSchemeKey(), "GLOBAL_TOOLBAR", "Get Scheme key");
		assert.strictEqual(this.oGlobalToolbar.getAllToolbarItems().length, 15, "Toolbar created successfully");
		assert.strictEqual(this.oGlobalToolbar.getAllToolbarItems()[0].getSelectedItem().getText(), "Dual: Resources & Orders", "Layout select item correct");
		assert.strictEqual(this.oGlobalToolbar.getAllToolbarItems()[1].getTooltip_Text(), oRb.getText("TLTP_ADD_GANTTCHART"), "Add gannt chart button correct");
		assert.strictEqual(this.oGlobalToolbar.getAllToolbarItems()[2].getTooltip_Text(), oRb.getText("TLTP_REMOVE_GANTTCHART"), "Remove gannt chart button correct");
		assert.strictEqual(this.oGlobalToolbar.getAllToolbarItems()[3].getTooltip_Text(), oRb.getText("TLTP_ARRANGE_GANTTCHART_VERTICALLY"), "Switch layout button correct");
		assert.strictEqual(this.oGlobalToolbar.getAllToolbarItems()[4].getTooltip_Text(), "Show Utilization.", "Show utilization button correct");
		assert.strictEqual(this.oGlobalToolbar.getAllToolbarItems()[5].getTooltip_Text(), "Hide Utilization.", "Hide utilization button correct");
		assert.strictEqual(this.oGlobalToolbar.getAllToolbarItems()[6].getTooltip_Text(), "Show Detail.", "Show detail button correct");
		assert.strictEqual(this.oGlobalToolbar.getAllToolbarItems()[7].getTooltip_Text(), "Hide Detail.", "Hide detail button correct");
		assert.strictEqual(this.oGlobalToolbar.getAllToolbarItems()[9].getTooltip_Text(), oRb.getText("TLTP_SLIDER_ZOOM_OUT"), "Zoom out button correct");
		assert.notEqual(this.oGlobalToolbar.getAllToolbarItems()[10].getStep(), undefined, "Slider correct");
		assert.strictEqual(this.oGlobalToolbar.getAllToolbarItems()[11].getTooltip_Text(), oRb.getText("TLTP_SLIDER_ZOOM_IN"), "Zoom in button correct");
		assert.strictEqual(this.oGlobalToolbar.getAllToolbarItems()[12].getTooltip_Text(), oRb.getText("TLTP_SHOW_LEGEND"), "Legend button correct");
		assert.strictEqual(this.oGlobalToolbar.getAllToolbarItems()[13].getTooltip_Text(), oRb.getText("TXT_SETTING_BUTTON"), "Settings button correct");

		//test toolbar event
		this.oldIcon = this.oGlobalToolbar.getAllToolbarItems()[3].getIcon();
		this.oGlobalToolbar.getAllToolbarItems()[3].firePress();
		assert.notEqual(this.oGlobalToolbar.getAllToolbarItems()[3].getIcon(), this.oldIcon, "Switch layout button event processed");
		this.oGlobalToolbar.getAllToolbarItems()[0].setSelectedItem(this.oGlobalToolbar.getAllToolbarItems()[0].getItems()[2]);
		this.oGlobalToolbar.getAllToolbarItems()[0].fireChange({
			selectedItem: this.oGlobalToolbar.getAllToolbarItems()[0].getSelectedItem(),
			oSource: this.oGlobalToolbar
		});
		assert.strictEqual(this.oGlobalToolbar.getAllToolbarItems()[0].getSelectedItem().getKey(), "d3", "Source Select: single freight order");
		var FakeGanttChartContainer = function () { };
		FakeGanttChartContainer.prototype.getGanttCharts = function () {
			var FakeGanttChart = function () { };
			FakeGanttChart.prototype.getHierarchyKey = function () {
				return sap.gantt.config.DEFAULT_HIERARCHY_KEY;
			};
			return [new FakeGanttChart()];
		};
		FakeGanttChartContainer.prototype.getMaxNumOfGanttCharts = function () {
			return 3;
		};
		this.oGlobalToolbar.data("holder", new FakeGanttChartContainer());
		this.oGlobalToolbar.getAllToolbarItems()[1].setSelectedIndex(0);
		this.oGlobalToolbar.getAllToolbarItems()[1].fireChange({ selectedItem: this.oGlobalToolbar.getAllToolbarItems()[1].getSelectedItem() });
		assert.ok(true, "Add GanttChart triggered");
		this.oGlobalToolbar._fillLessGanttChartSelectItem();
		this.oGlobalToolbar.getAllToolbarItems()[2].setSelectedIndex(0);
		this.oGlobalToolbar.getAllToolbarItems()[2].fireChange({ selectedItem: this.oGlobalToolbar.getAllToolbarItems()[2].getSelectedItem() });
		assert.ok(true, "Remove GanttChart triggered");
		//Test zoom in button
		this.oldSliderValue = this.oGlobalToolbar.getAllToolbarItems()[10].getValue();
		this.oldSliderValue = (this.oldSliderValue === "NaN") ? 0 : this.oldSliderValue;
		var that = this;
		setTimeout(function () {
			that.oGlobalToolbar.getAllToolbarItems()[11].firePress();
			assert.notEqual(that.oGlobalToolbar.getAllToolbarItems()[10].getValue(), that.oldSliderValue, "zoom in button works");
			//Put legend button here, because the _oLegendPop may be not rendered yet after setup, it takes some time
			that.oGlobalToolbar.getAllToolbarItems()[12].firePress();
			assert.ok(that.oGlobalToolbar._oLegendPop.isOpen(), "Legend button pressed");
			done();
		}, 100);
	});

});
