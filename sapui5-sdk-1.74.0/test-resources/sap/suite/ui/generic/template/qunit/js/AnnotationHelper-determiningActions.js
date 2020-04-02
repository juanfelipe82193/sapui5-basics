sap.ui.define(["sap/suite/ui/generic/template/js/AnnotationHelper"],
	function (AnnotationHelper) {
		module("Tests for Determining Actions", {
			beforeEach: function () {
				this.oAnnotationHelper = AnnotationHelper;
				this.oInterface = {
					getInterface: function (iPart, sPath) {
						return {
							getModel: function () {
								return this.oModel;
							}.bind(this)
						}
					}.bind(this)
				};
				this.oModel = {
					getODataFunctionImport: function (sName) {
						return sName;
					},
					getObject: function (sPath) {
						var mFunctionImports = {
							"ActionFunctionNonDetermining": {
								"name": "FunctionImportNonDetermining"
							},
							"ActionFunctionDeterminingNoApplicablePath": {
								"name": "FunctionImportDeterminingNoApplicablePath"
							},
							"ActionFunctionDeterminingWithApplicablePath": {
								"name": "FunctionImportDeterminingWithApplicablePath",
								"sap:applicable-path": "DeterminingApplicablePath"
							}
						}
						return mFunctionImports[sPath];
					}
				};
				this.listReportManifestDetermining = {
					"sap.suite.ui.generic.template.ListReport.view.ListReport": {
						"sap.ui.generic.app": {
							"STTA_C_MP_Product": {
								"EntitySet": "STTA_C_MP_Product",
								"Actions": {
									"CustomAction": {
										"id": "customDeterminingAction",
										"text": "Custom Determining Action",
										"press": "onCustomDeterminingAction",
										"determining": true
									}
								}
							}
						}
					}
				};
				this.listReportManifestNonDetermining = {
					"sap.suite.ui.generic.template.ListReport.view.ListReport": {
						"sap.ui.generic.app": {
							"STTA_C_MP_Product": {
								"EntitySet": "STTA_C_MP_Product",
								"Actions": {
									"CustomAction": {
										"id": "customDeterminingAction",
										"text": "Custom Determining Action",
										"press": "onCustomDeterminingAction"
									}
								}
							}
						}
					}
				};
				this.objectPageManifestDetermining = {
					"sap.suite.ui.generic.template.ObjectPage.view.Details": {
						"sap.ui.generic.app": {
							"STTA_C_MP_Product": {
								"EntitySet": "STTA_C_MP_Product",
								"Header": {
									"Actions": {
										"CustomAction": {
											"id": "customDeterminingAction",
											"text": "Custom Determining Action",
											"press": "onCustomDeterminingAction",
											"determining": true
										}
									}
								}
							}
						}
					}
				};
				this.objectPageManifestNonDetermining = {
					"sap.suite.ui.generic.template.ObjectPage.view.Details": {
						"sap.ui.generic.app": {
							"STTA_C_MP_Product": {
								"EntitySet": "STTA_C_MP_Product",
								"Header": {
									"Actions": {
										"CustomAction": {
											"id": "customDeterminingAction",
											"text": "Custom Determining Action",
											"press": "onCustomDeterminingAction"
										}
									}
								}
							}
						}
					}
				};
				this.annotationDetermining = [{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
					Label: {
						String: "NonDeterminingActionButton"
					},
					Action: {
						String: "ActionFunctionNonDetermining"
					},
					Determining: {
						Bool: "false"
					}
				},
					{
						RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: {
							String: "DeterminingActionButtonNoApplicablePath"
						},
						Action: {
							String: "ActionFunctionDeterminingNoApplicablePath"
						},
						Determining: {
							Bool: "true"
						}
					},
					{
						RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: {
							String: "DeterminingActionButtonWithApplicablePath"
						},
						Action: {
							String: "ActionFunctionDeterminingWithApplicablePath"
						},
						Determining: {
							Bool: "true"
						}
					}];
				this.annotationNonDetermining = [{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
					Label: {
						String: "NonDeterminingActionButton"
					},
					Action: {
						String: "ActionFunctionNonDetermining"
					},
					Determining: {
						Bool: "false"
					}
				},
					{
						RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: {
							String: "NonDeterminingActionButton2"
						},
						Action: {
							String: "ActionFunctionNonDetermining2"
						}
					}];
				this.annotationDeterminingNoApplicablePath = [{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
					Label: {
						String: "NonDeterminingActionButton"
					},
					Action: {
						String: "ActionFunctionNonDetermining"
					},
					Determining: {
						Bool: "false"
					}
				},
					{
						RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: {
							String: "DeterminingActionButtonNoApplicablePath"
						},
						Action: {
							String: "ActionFunctionDeterminingNoApplicablePath"
						},
						Determining: {
							Bool: "true"
						}
					},
					{
						RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: {
							String: "DeterminingActionButtonWithApplicablePath"
						},
						Action: {
							String: "ActionFunctionDeterminingNoApplicablePath"
						},
						Determining: {
							Bool: "true"
						}
					}];
				this.annotationDeterminingWithApplicablePath = [{
					RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
					Label: {
						String: "NonDeterminingActionButton"
					},
					Action: {
						String: "ActionFunctionNonDetermining"
					},
					Determining: {
						Bool: "false"
					}
				},
					{
						RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: {
							String: "DeterminingActionButtonNoApplicablePath"
						},
						Action: {
							String: "ActionFunctionDeterminingWithApplicablePath"
						},
						Determining: {
							Bool: "true"
						}
					},
					{
						RecordType: "com.sap.vocabularies.UI.v1.DataFieldForAction",
						Label: {
							String: "DeterminingActionButtonWithApplicablePath"
						},
						Action: {
							String: "ActionFunctionDeterminingWithApplicablePath"
						},
						Determining: {
							Bool: "true"
						}
					}];
			},
			afterEach: function () {
				this.oAnnotationHelper = null;
				this.oInterface = {};
			}
		});

		QUnit.test("Function hasDeterminingActions", function () {
			equals(this.oAnnotationHelper.hasDeterminingActions(this.annotationNonDetermining, "STTA_C_MP_Product", this.listReportManifestDetermining), "true", "Returns 'true' when actions defined in manifest but not in annotations.");
			equals(this.oAnnotationHelper.hasDeterminingActions(this.annotationDetermining, "STTA_C_MP_Product", this.listReportManifestNonDetermining), "true", "Returns 'true' when actions defined in annotations but not in manifest.");
			equals(this.oAnnotationHelper.hasDeterminingActions(this.annotationDetermining, "STTA_C_MP_Product", this.listReportManifestDetermining), "true", "Returns 'true' when actions defined in manifest and in annotations.");
			equals(this.oAnnotationHelper.hasDeterminingActions(this.annotationNonDetermining, "STTA_C_MP_Product", this.listReportManifestNonDetermining), "false", "Returns 'false' when actions not defined in manifest and not defined in annotations.");
		});

		QUnit.test("Function hasDeterminingActionsRespectingApplicablePath", function () {
			equals(this.oAnnotationHelper.hasDeterminingActionsRespectingApplicablePath(this.oInterface, this.annotationNonDetermining, "STTA_C_MP_Product", this.objectPageManifestDetermining), "true", "Returns 'true' when actions defined in manifest but not in annotations.");
			equals(this.oAnnotationHelper.hasDeterminingActionsRespectingApplicablePath(this.oInterface, this.annotationDeterminingNoApplicablePath, "STTA_C_MP_Product", this.objectPageManifestNonDetermining), "true", "Returns 'true' when actions defined in annotations with no applicable path but not in manifest.");
			equals(this.oAnnotationHelper.hasDeterminingActionsRespectingApplicablePath(this.oInterface, this.annotationDeterminingWithApplicablePath, "STTA_C_MP_Product", this.objectPageManifestNonDetermining), "{= ${path: 'DeterminingApplicablePath'} || ${path: 'DeterminingApplicablePath'} || ${ui>/editable}}", "Returns applicable path expression when actions defined in annotations with applicable path but not in manifest.");
			equals(this.oAnnotationHelper.hasDeterminingActionsRespectingApplicablePath(this.oInterface, this.annotationDeterminingNoApplicablePath, "STTA_C_MP_Product", this.objectPageManifestDetermining), "true", "Returns 'true' when actions defined in manifest and in annotations with no applicable path.");
			equals(this.oAnnotationHelper.hasDeterminingActionsRespectingApplicablePath(this.oInterface, this.annotationDetermining, "STTA_C_MP_Product", this.objectPageManifestDetermining), "true", "Returns 'true' when actions defined in manifest and in annotations with applicable path.");
			equals(this.oAnnotationHelper.hasDeterminingActionsRespectingApplicablePath(this.oInterface, this.annotationNonDetermining, "STTA_C_MP_Product", this.objectPageManifestNonDetermining), "{ui>/editable}", "Returns '{ui>/editable}' when actions not defined in manifest and not defined in annotations.");
		});
});
