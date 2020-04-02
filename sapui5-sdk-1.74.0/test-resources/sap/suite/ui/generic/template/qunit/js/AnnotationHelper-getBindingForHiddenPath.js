sap.ui.define(["sap/suite/ui/generic/template/js/AnnotationHelper"],
	function (AnnotationHelper) {
		module("Test methods to check funtion getBindingForHiddenPath", {

			setup: function () {
				this.oAnnotationHelper = AnnotationHelper;
			},

			teardown: function () {
				this.oAnnotationHelper = null;
			}
		});

		test("Hidden annotation contains Path", function () {
			var oAnnotationHelper = this.oAnnotationHelper;
			var oHidden = {
				"com.sap.vocabularies.UI.v1.Hidden": {
					"Path": "Edit_ac"
				}
			};

			var bExpectedExpression = "{= !${Edit_ac} }";
			var bExpression = oAnnotationHelper.getBindingForHiddenPath(oHidden);
			equals(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);
		});

		test("Hidden annotation contains Bool:false", function () {
			var oAnnotationHelper = this.oAnnotationHelper;
			var oHidden = {
				"com.sap.vocabularies.UI.v1.Hidden": {
					"Bool": "false"
				}
			};

			var bExpectedExpression = true;
			var bExpression = oAnnotationHelper.getBindingForHiddenPath(oHidden);
			equals(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);
		});

		test("Hidden annotation contains Bool:true", function () {
			var oAnnotationHelper = this.oAnnotationHelper;
			var oHidden = {
				"com.sap.vocabularies.UI.v1.Hidden": {
					"Bool": "true"
				}
			};

			var bExpectedExpression = false;
			var bExpression = oAnnotationHelper.getBindingForHiddenPath(oHidden);
			equals(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);
		});

		test("Hidden annotation does not contain Bool or Path", function () {
			var oAnnotationHelper = this.oAnnotationHelper;
			var oHidden = {
				"com.sap.vocabularies.UI.v1.Hidden": {}
			};

			var bExpectedExpression = false;
			var bExpression = oAnnotationHelper.getBindingForHiddenPath(oHidden);
			equals(bExpression, bExpectedExpression, "Expected value is: " + bExpectedExpression);
		});
});
