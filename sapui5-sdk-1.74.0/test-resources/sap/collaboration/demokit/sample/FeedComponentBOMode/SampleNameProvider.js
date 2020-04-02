sap.ui.define(function() {
	var SampleNameProvider = {};
	var sNamespace = "sap.collaboration.sample";
	var sName = "FeedComponentBOMode";
	SampleNameProvider.getQualifiedName = function() {
		return sNamespace + "." + sName;
	}
	SampleNameProvider.getName = function() {
		return sName;
	}
	return SampleNameProvider;
}, /* bExport= */ true);