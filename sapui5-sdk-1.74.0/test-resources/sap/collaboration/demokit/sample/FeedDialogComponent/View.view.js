sap.ui.define(["./SampleNameProvider", "sap/m/Image"], function(SampleNameProvider, Image) {
	var sQualifiedSampleName = SampleNameProvider.getQualifiedName();
	sap.ui.jsview(sQualifiedSampleName + ".View", {
		createContent: function(oController) {
			return new Image({
				"src": "test-resources/sap/collaboration/demokit/sample/" + SampleNameProvider.getName() + "/discuss_dialog_screenshot.png"
			});
		}
	});
}, /* bExport= */ false);