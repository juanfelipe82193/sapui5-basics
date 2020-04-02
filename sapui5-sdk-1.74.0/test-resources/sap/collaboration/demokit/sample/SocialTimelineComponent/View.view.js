sap.ui.define(["./SampleNameProvider"], function(SampleNameProvider) {
	var sQualifiedSampleName = SampleNameProvider.getQualifiedName();
	sap.ui.jsview(sQualifiedSampleName + ".View", {
		_socialTimelineComponentContainer: null,
		getControllerName: function() {
			return sQualifiedSampleName + ".Controller";
		},
		createContent: function() {
			return [(this._socialTimelineComponentContainer =  (new sap.ui.core.ComponentContainer()).setHeight("100%"))];
		}
	});
}, /* bExport= */ false);