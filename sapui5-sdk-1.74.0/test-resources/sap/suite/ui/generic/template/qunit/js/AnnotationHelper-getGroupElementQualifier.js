sap.ui.define(["sap/suite/ui/generic/template/js/AnnotationHelper"],
	function (AnnotationHelper) {
		module("Test methods to check funtion getGroupElementQualifier", {
			beforeEach: function () {
				this.oAnnotationHelper = AnnotationHelper;
				this.aControlCustomData = [
					{
						getKey: function(){
							return "sap-ui-custom-settings";
						},
						getValue: function(){
							return {
								'sap.ui.dt': {
									annotation: {
										value: '@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation'
									}
								}
							}
						}
					},
					{
						getKey: function(){
							return "sap-ui-custom-settings1";
						},
						getValue: function(){
							return {
								'sap.ui.dt': {
									annotation: {
										value: '@com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation1'
									}
								}
							}
						}
					}
				];
			}
		});

		test("Test getGroupElementQualifier", function () {
			var oAnnotationHelper = this.oAnnotationHelper;
			var aControlCustomData = this.aControlCustomData;
			var sExpectedResult = "com.sap.vocabularies.UI.v1.FieldGroup#GeneralInformation";
			var oResult = oAnnotationHelper.getGroupElementQualifier(aControlCustomData);
			equals(oResult, sExpectedResult, "Result matches expected value: " + sExpectedResult);
		});


});
