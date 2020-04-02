sap.ui.define(["sap/suite/ui/generic/template/lib/AppComponent",
               "utils/Utils"
               ],
	function(AppComponent, Utils) {
	return AppComponent.extend("anondraftapp.Component", {
		metadata: Utils.getManifest()
	});
});