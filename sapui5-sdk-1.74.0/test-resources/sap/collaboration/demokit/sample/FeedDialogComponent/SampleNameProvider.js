sap.ui.define(function() {
	var SampleNameProvider = {};
	var sNamespace = "sap.collaboration.sample";
	var sName = "FeedDialogComponent";
	SampleNameProvider.getQualifiedName = function() {
		return sNamespace + "." + sName;
	}
	SampleNameProvider.getName = function() {
		return sName;
	}
	return SampleNameProvider;
}, /* bExport= */ true);