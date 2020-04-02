sap.ui.define(["./SampleNameProvider"], function(SampleNameProvider) {
	var sSampleQualifiedName = SampleNameProvider.getQualifiedName();
	sap.ui.jsview(sSampleQualifiedName + ".View", {
		_FeedComponentContainer: null,
		getControllerName: function() {
			return sSampleQualifiedName + ".Controller";
		},
		createContent: function() {
			return [(this._FeedComponentContainer =  (new sap.ui.core.ComponentContainer()).setHeight("100%"))];
		}
	});
}, /* bExport= */ false);