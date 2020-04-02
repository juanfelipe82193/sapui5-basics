sap.ui.define(["sap/ui/generic/app/AppComponent",
               "utils/Utils"
               ],
	function(AppComponent, Utils) {
	return AppComponent.extend("analytics4.Component", {
		metadata: Utils.getManifest()
	});
});
