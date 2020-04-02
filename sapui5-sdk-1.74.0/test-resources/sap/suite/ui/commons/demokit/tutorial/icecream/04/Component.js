sap.ui.define(["sap/ui/core/UIComponent"], function(UIComponent) {
	"use strict";

	return UIComponent.extend("sap.suite.ui.commons.demokit.tutorial.icecream.04", {
		metadata: {
			config: {
				sample: {
					iframe: "webapp/index.html",
					stretch: true,
					files: [
						"webapp/controller/Startpage.controller.js",
						"webapp/fragment/VizChart.fragment.js",
						"webapp/i18n/i18n.properties",
						"webapp/images/Alain_Chevalier.png",
						"webapp/images/Donna_Moore.png",
						"webapp/images/Elena_Petrova.png",
						"webapp/images/ice-cream.jpg",
						"webapp/images/John_Miller.png",
						"webapp/images/Julie_Armstrong.png",
						"webapp/images/Laurent_Dubois.png",
						"webapp/images/Monique_Legrand.png",
						"webapp/images/New_Reviewer.png",
						"webapp/images/penguins.jpg",
						"webapp/images/Richard_Wilson.png",
						"webapp/model/models.js",
						"webapp/model/data/BusinessData.json",
						"webapp/model/data/IceCreamTestData.json",
						"webapp/model/data/News.json",
						"webapp/model/data/ProcessFlowData.json",
						"webapp/model/data/Reviews.json",
						"webapp/model/data/Suppliers.json",
						"webapp/view/App.view.xml",
						"webapp/view/Startpage.view.xml",
						"webapp/Component.js",
						"webapp/index.html",
						"webapp/manifest.json",
						"neo-app.json"
					]
				}
			}
		}
	});
});
