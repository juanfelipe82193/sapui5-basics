sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/theming/Parameters"
], function (Controller, JSONModel, ThemingParameters) {
	var oPageController = Controller.extend("sap.suite.ui.commons.sample.NetworkGraphNodeDimensions.NetworkGraph", {
		onInit: function () {
			var oGraph = this.byId("graph"),
				oModel = new JSONModel(jQuery.sap.getModulePath("sap.suite.ui.commons.sample.NetworkGraphNodeDimensions", "/graph.json"));

			this.getView().setModel(oModel);
			oGraph.attachEvent("graphReady", function () {
				var BOT = 2500,
					RIGHT = 850;

				var aTexts = ["Default",
					"Width: 250",
					"Height: 100. For circle nodes it determines its diameter",
					"MaxWidth: 250. Computes the width by its content.",
					"Width: 100",
					"Height: 40",
					"MaxWidth with attributes. Attributes displayed only in box mode.",
					"Example of large label attribute. Usable only with MaxWidth (otherwise both columns have 50%)",
					"Example of large value attribute. Usable only with MaxWidth (otherwise both columns have 50%)",
					"Title spread to 2 lines (titleLineSize parameter)",
					"Title spread to unlimited lines (titleLineSize = 0)",
					"Description (descriptionLineSize parameter)"
				];

				var fnCreateLineH = function (iY) {
					var oElement = document.createElementNS('http://www.w3.org/2000/svg', "line");

					oElement.setAttribute("x1", 0);
					oElement.setAttribute("x2", RIGHT);
					oElement.setAttribute("y1", iY);
					oElement.setAttribute("y2", iY);
					var sColor = ThemingParameters.get("sapUiBaseText");
					oElement.setAttribute("stroke", sColor);

					svg.appendChild(oElement);
				};

				var fnCreateLineV = function (iX) {
					var oElement = document.createElementNS('http://www.w3.org/2000/svg', "line");

					oElement.setAttribute("x1", iX);
					oElement.setAttribute("x2", iX);
					oElement.setAttribute("y1", 0);
					oElement.setAttribute("y2", BOT);
					var sColor = ThemingParameters.get("sapUiBaseText");
					oElement.setAttribute("stroke", sColor);

					svg.appendChild(oElement);
				};

				var fnCreateText = function (iY, sText) {
					var oElement = document.createElementNS('http://www.w3.org/2000/svg', "text");
					oElement.textContent = sText;
					oElement.setAttribute("x", 10);
					oElement.setAttribute("y", iY);
					oElement.setAttribute("font-size", "0.8rem");
					var sColor = ThemingParameters.get("sapUiBaseText");
					oElement.setAttribute("fill", sColor);

					svg.appendChild(oElement);
				};

				var svg = oGraph.$("networkGraphSvg")[0];
				if (svg) {
					[1, 200, 400, 630, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2300, BOT].forEach(function (iY, i) {
						fnCreateLineH(iY);
						if (aTexts[i]) {
							fnCreateText(iY + 20, aTexts[i]);
						}
					});

					fnCreateLineV(1);
					fnCreateLineV(RIGHT);
				}
			});
		}
	});
	return oPageController;
});
