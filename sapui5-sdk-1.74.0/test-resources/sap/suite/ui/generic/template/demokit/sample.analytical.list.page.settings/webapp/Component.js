sap.ui.define(["sap/ui/generic/app/AppComponent",
               "utils/Utils"
               ],
	function(AppComponent, Utils) {
	return AppComponent.extend("analytics3.Component", {
		metadata: Utils.getManifest()
	});
});
