sap.ui.define(["./SampleNameProvider", "sap/m/Button"], function(SampleNameProvider, Button) {
	var sSampleQualifiedName = SampleNameProvider.getQualifiedName();
	sap.ui.jsview(sSampleQualifiedName + ".View", {
		getControllerName: function() {
			return sSampleQualifiedName + ".Controller";
		},
		createContent: function(oController) {
			return new Button({
				"text": "Share Link and Comments",
				"press": [oController.onPress, oController]
			});
		}
	});
}, /* bExport= */ false);