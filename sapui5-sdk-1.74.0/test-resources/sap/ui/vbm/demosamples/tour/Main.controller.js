sap.ui.define([
               "sap/ui/vbdemos/component/BaseController"
               ], function(BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.vbdemos.tour.Main", {

		onInit: function() {
			//saving a reference to the current instance of GeoMap
			this.geoMap = this.getView().byId(this.createId("VBITour"));

			//creating an enum of valid cities
			this.VALID_CITIES = {
				"Heidelberg": 0,
				"Wien": 1,
				"Zürich": 2,
				"Paris": 3,
				"Berlin": 4
			};

			//Remote service url used for calculating routes
			this.ROUTING_SERVICE_URL = "http://www.yournavigation.org/api/1.0/gosmore.php?format=geojson&flat={flat}&flon={flon}&tlat={tlat}1&tlon={tlon}&v={transport}&fast={routing}&layer=mapnik&lang=en-US";

			//Requesting the JSON Tour data
			$.getJSON("media/Tour.json", function(data) {
				//creating a new model based on the retrieved data
				var oModel = new sap.ui.model.json.JSONModel(data);
				//saving a reference to the data object
				this.oData = data;
				//attaching the JSON model to the current view
				this.getView().setModel(oModel);
				sap.ui.getCore().setModel(oModel);
			}.bind(this));

		},

		onClickSpot: function(event) {
			//getting the label of the clicked city
			var sLabelText = event.getSource().getLabelText();
			//creating a window for the clicked city
			this.generateDetailWindow(event, this.VALID_CITIES[sLabelText]);
		},

		generateDetailWindow: function(evt, sourceIndex) {
			//retrieve the clicked spot
			var spot = evt.getSource(),
				//get chart information for the current spot
				oChart = this.oData.Charts[sourceIndex];

			this.oData.Chart = oChart;
			spot.openDetailWindow(oChart.title);

			this.geoMap.attachEventOnce("openWindow", this.onOpenDetail, {
				oController: this,
				spot: spot
			});
		},

		onOpenDetail: function(e) {
			var oController = this.oController,
				oModel = oController.getView().getModel(),
				oSpot = this.spot,
				sLabelText = oSpot.getProperty("labelText"),
				oData = oModel.getData();

			if ((oData.Routes[0].color == "RGB(97,166,86)") && (sLabelText === 'Berlin')) {
				oData.Chart.Data[3].value = 150;
				oData.Chart.Data[3].color = sap.m.ValueColor.Good;
				oData.Chart.Labels1[1].color = sap.m.ValueColor.Good;
			}
			var oContent = new sap.ui.layout.VerticalLayout({
				width: "100%",
				content: [
						            new sap.suite.ui.microchart.ColumnMicroChart({
						"size": "M",
						leftTopLabel: new sap.suite.ui.microchart.ColumnMicroChartLabel({
							"label": "{/Chart/Labels1/0/label}",
							"color": "{/Chart/Labels1/0/color}"
						}),
						rightTopLabel: new sap.suite.ui.microchart.ColumnMicroChartLabel({
							"label": "{/Chart/Labels1/1/label}",
							"color": "{/Chart/Labels1/1/color}"
						}),
						columns: {
							path: "/Chart/Data",
							template: new sap.suite.ui.microchart.ColumnMicroChartData({
								value: '{value}',
								color: '{color}'
							})
						}
					}),
						            new sap.m.Label({
						text: "{/Chart/Label2}"
					}),
						            new sap.ui.layout.HorizontalLayout({
						content: {
							path: "/Chart/Buttons",
							template: new sap.m.Button({
								text: '{text}',
								press: function() {
									oController.planRoute(oSpot)
								}
							})
						}
					})
						         ]
			});
			oContent.placeAt(e.getParameter("contentarea").id, "only");
		},

		planRoute: function(oSpot) {
			if (oSpot.getProperty("labelText") === "Berlin") {
				this.planBerlinRoute(oSpot);
			}
		},

		planBerlinRoute: function(oSpot) {
			this.geoMap.closeAnyDetailWindow();
			//Harcoded route from Heidelberg to Berlin
			var oRouteStart = {
					// Heidelberg
					coord: this.oData.Spots[0].position.split(";"),
					name: this.oData.Spots[0].labelText
				},
				oRouteEnd = {
					// Berlin
					coord: this.oData.Spots[4].position.split(";"),
					name: this.oData.Spots[4].labelText
				};

			var sColor = "RGB(97,166,86)";
			var oModel = sap.ui.getCore().getModel();
			this.calculateRoute(oRouteStart, oRouteEnd, 'motorcar', '1', sColor, oModel, oSpot);
		},


		calculateRoute: function(oRouteStart, oRouteEnd, sTypeOfTransport, sRoutingMethod, sColor, oModel, oSpot) {
			var sRoutingService = this.ROUTING_SERVICE_URL;
			sRoutingService = sRoutingService.replace(/{flat}/, oRouteStart.coord[1].toString());
			sRoutingService = sRoutingService.replace(/{flon}/, oRouteStart.coord[0].toString());
			sRoutingService = sRoutingService.replace(/{tlat}/, oRouteEnd.coord[1].toString());
			sRoutingService = sRoutingService.replace(/{tlon}/, oRouteEnd.coord[0].toString());
			sRoutingService = sRoutingService.replace(/{transport}/, sTypeOfTransport);
			sRoutingService = sRoutingService.replace(/{routing}/, sRoutingMethod);
			var PlannedRoute = {};

			var oRoute = $.getJSON(sRoutingService, function(oRoute) {

				//Reducing the coordinates array to a string in the format of: x1;y1;0;x2;y2;0
				var sRoute = oRoute.coordinates.reduce(function(previousElement, currentElement) {
					return previousElement + currentElement[0] + ";" + currentElement[1] + ";0;";
				});

				//Removing the trailing semi-colon
				sRoute = sRoute.slice(0, -1);

				var sTooltip = 'This is your planned Route from ' + oRouteStart.name + ' to ' + oRouteEnd.name,
					oData = oModel.getData();

				// set Berlin Spot
				oData.Spots[4].image = 'GreenPin';
				// set Berlin Route
				var oRoute = oModel.oData.Routes[0];
				oRoute.poslist = sRoute;
				oRoute.linewidth = "5";
				oRoute.color = "RGB(97,166,86)";
				oRoute.colorBorder = "RGBA(255,255,255,255)";
				oRoute.tooltip = sTooltip;
				oModel.setData(oData);
			})

		}

	});
});
