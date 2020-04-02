sap.ui.define(["./SampleNameProvider", "sap/m/Button"], function(SampleNameProvider, Button) {
	var sQualifiedSampleName = SampleNameProvider.getQualifiedName();
	sap.ui.jsview(sQualifiedSampleName + ".View", {
		getControllerName: function() {
			return sQualifiedSampleName + ".Controller";
		},
		createContent: function(oController) {
			return new Button({
				"text": "Share External Object",
				"press": [oController.onPress, oController]
			});
		}
	});
}, /* bExport= */ false);