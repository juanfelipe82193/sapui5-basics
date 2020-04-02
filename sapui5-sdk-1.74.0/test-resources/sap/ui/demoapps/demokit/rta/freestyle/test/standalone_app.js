(function () {
	sap.ui.getCore().attachInit(function() {
		sap.ui.require([
			"sap/m/Shell",
			"sap/ui/core/ComponentContainer"
		], function (Shell, ComponentContainer) {
			// initialize the UI component
			new Shell({
				app: new ComponentContainer({
					height : "100%",
					component : sap.ui.component({
						name: "sap.ui.demoapps.rta.freestyle",
						settings: {
							id : "freestyle"
						},
						componentData: {
							"showAdaptButton" : true
						}
					})
				})
			}).placeAt("content");
		});
	});
})();