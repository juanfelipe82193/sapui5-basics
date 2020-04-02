
sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/vbm/GeoMap", "sap/m/FlexItemData", "sap/ui/commons/RichTooltip"
], function(Controller, GeoMap, FlexItemData, RichTooltip) {
	"use strict";
	return Controller.extend("vbm-regression.tests.04.controller.App", {

		onInit: function() {
			jQuery.sap.require("sap.suite.ui.microchart.ColumnMicroChart");

			var oData =
			{
				Containers:
				[
					{
						"key": "10", "pos": "0;0;0", "alignment": "2", "label": "Label",
						ChartCols: [{ "value": 60, "color": "Neutral" },
						{ "value": 10, "color": "Error" },
						{ "value": 20, "color": "Error" }]
					}
				],
				Spots:
				[

					{ "key": "0", "pos": "-74.007103;40.711815;0", "tooltip": "New York", "pin": "pin_blue.png" },
					{ "key": "1", "pos": "-75.176263;39.953823;0", "tooltip": "Philadelphia", "pin": "pin_blue.png" },
					{ "key": "2", "pos": "-76.617321;39.292630;0", "tooltip": "Baltimore", "pin": "pin_blue.png" },
					{ "key": "3", "txt": "+261", "pos": "46.379346;-19.324747;0", "tooltip": "madəˈgaskər", "type": sap.ui.vbm.SemanticType.Success },
					{ "key": "4", "pos": "-3.704601;40.418332;0", "tooltip": "Madrid-مدريد - מדריד - मैड्रिड", "labeltext": "Spot -مدريد - מדריד - मैड्रिड \r\nError",  "type": sap.ui.vbm.SemanticType.Error },
					{ "key": "5", "txt": "北京", "pos": "116.404290;39.918538;0", "tooltip": "Beijing",  "type": sap.ui.vbm.SemanticType.Default},
					{ "key": "6", "txt": "+994", "pos": "46.379346;40.324747;0", "tooltip": "Azərbaycan",  "type": sap.ui.vbm.SemanticType.Success},
				],
				LegendItems:
				[
					{ "color": "rgb(204,25,25)", "text": "грешка" },
					{ "color": "rgb(0,124,192)", "text": "Default" },
					{ "color": "rgb(128,184,119)", "text": "ä € 愛 لآ ह ที่ 𥄫 இ اور" },
					{ "color": "rgb(225,123,36)", "text": "ë í î Æ Ø æ å Џ Љ タ ჳ უ" }
				]

			};

			var oClustering = new sap.ui.vbm.ClusterDistance({
				rule: "",
				vizTemplate: new sap.ui.vbm.Cluster({ type: "Warning", icon: "shipping-status" })
			});

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData(oData);

			var oGeomap = new sap.ui.vbm.GeoMap('map', {
				width: "100%",
				height: "100%",
				resources:
				[
					new sap.ui.vbm.Resource({ "name": "pin_blue.png", "value": "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" })
				],
				legend: new sap.ui.vbm.Legend(
					{
						caption: "אגדה জন্য スポット טייפּס",
						items: {
							path: "/LegendItems",
							template: new sap.ui.vbm.LegendItem({ text: "{text}", color: '{color}' })
						}
					}
				),
	
				vos: [
					new sap.ui.vbm.Containers("containers1", {
						items: {
							path: "/Containers",
							template: new sap.ui.vbm.Container({
								position: '{pos}', alignment: '{alignment}',
								item: new sap.suite.ui.microchart.ColumnMicroChart({
									size: "S",
									columns: {
										path: "ChartCols",
										template: new sap.suite.ui.microchart.ColumnMicroChartData({ value: '{value}', color: '{color}' })
									},
									rightTopLabel: new sap.suite.ui.microchart.ColumnMicroChartLabel({ label: '{label}' })
								}).addStyleClass("chart-bg")
							})
						}
					}),
					new sap.ui.vbm.Spots("spots1", {
						items: {
							path: "/Spots",
							template: new sap.ui.vbm.Spot({ key: '{key}', text: '{txt}', position: '{pos}', labelText: '{labeltext}', image: '{pin}', tooltip: '{tooltip}', type: '{type}', click: this.onClickSpot, contextMenu: this.onContextMenuSpot })
						}
					})
				]
				,
				clusters: [oClustering]
			});

			oGeomap.setModel(oModel);

			oGeomap.setMapConfiguration(GLOBAL_MAP_CONFIG);
			oGeomap.setLayoutData(new FlexItemData({
				baseSize: "100%"
			}));
			this.getView().byId("flexBox").insertItem(oGeomap);
		},

		onClickSpot: function(evt) {
			var detailSpot = this.getTooltip();
			this.openDetailWindow("Spot " + detailSpot);
		},

		onContextMenuSpot: function(evt) {
			var activeSpot = this.getTooltip();

			// Create the menu
			var oMenu11 = evt.mParameters.menu;
			//Create the items and add them to the menu
			var oMenuItem11 = new sap.ui.unified.MenuItem({ text: "First Item" });
			oMenu11.addItem(oMenuItem11);
			var oMenuItem12 = new sap.ui.unified.MenuItem({ text: "Second Item" });
			oMenu11.addItem(oMenuItem12);
			var oMenuItem13 = new sap.ui.unified.MenuItem({ text: "Disabled Item", enabled: false });
			oMenu11.addItem(oMenuItem13);

			//Create a sub menu for second item
			var oMenu21 = new sap.ui.unified.Menu({ ariaDescription: "a sub menu" });
			oMenuItem12.setSubmenu(oMenu21);
			//Create the items and add them to the sub menu
			var oMenuItem14 = new sap.ui.unified.MenuItem({ text: "New TXT file", tooltip: "Creates a new TXT file." });
			oMenu21.addItem(oMenuItem14);
			var oMenuItem15 = new sap.ui.unified.MenuItem({ text: "New RAR file", tooltip: "Creates a new RAR file." });
			oMenu21.addItem(oMenuItem15);


			this.openContextMenu(oMenu11);
		},

		onPressArabic: function() {
			window.location.href = window.location.origin + window.location.pathname + "?component=" + controller.tests.tests[controller.currentTest].componentName + "&sap-ui-language=ar-AR"
		},

		onPressHindi: function() {
			window.location.href = window.location.origin + window.location.pathname + "?component=" + controller.tests.tests[controller.currentTest].componentName + "&sap-ui-language=hi-HI"
		},

		onPressHebrew: function() {
			window.location.href = window.location.origin + window.location.pathname + "?component=" + controller.tests.tests[controller.currentTest].componentName + "&sap-ui-language=he-HE"
		},

		onPressDefault: function() {
			window.location.href = window.location.origin + window.location.pathname
		}


	});
});

