sap.ui.define(["sap/ui/generic/app/AppComponent",
               "utils/Utils"
               ],
	function(AppComponent, Utils) {
	return AppComponent.extend("sample.analytical.list.page.with.params.Component", {
		metadata: Utils.getManifest()
	});
});
