sap.ui.define(["sap/suite/ui/generic/template/lib/AppComponent",
               "utils/Utils"
               ],
	function(AppComponent, Utils) {
	return AppComponent.extend("nondraftshowcase.Component", {
		metadata: Utils.getManifest()
	});
});