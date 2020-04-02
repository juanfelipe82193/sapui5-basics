sap.ui.define([
    "sap/ui/Device"
],function(Device){
    "use strict";
    var oUnitTest =  {
        name: "Library 'sap.ui.comp' - Personalization Tests",
        defaults: {
            group:"Library",
            qunit: {
                version: 2
            },
            sinon: {
                version: 4
            },
            ui5: {
                language: "en-US",
                rtl: false, //Whether to run the tests in RTL mode
                libs: [
					"sap.ui.comp"
				],
                "xx-waitForTheme": true
            },
            coverage: {
                only: "[sap/ui/comp]",
                branchCoverage: true
            },
            loader: {
                paths: {
                    "sap/ui/comp/qunit": "test-resources/sap/ui/comp/qunit",
                    "sap/ui/core/qunit": "test-resources/sap/ui/core/qunit/"
                }
            },
            autostart: false,
            module: "./{name}.qunit"
        },
        tests: {
			"Util": {
			},
			"Controller": {
				ui5: {
					libs: [
						"sap.m",
						"sap.ui.comp",
						"sap.ui.table"
					]
				}
			},
			"ColumnsController": {
			},
			"SelectionController": {
			},
			"SortController": {
			},
			"FilterController": {
			},
			"GroupController": {
            },
			"Validator": {
			},
			"ColumnHelper": {
			},
			"DimeasureController": {
			},


			"opaTests/Personalization.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationChart.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationChartRestore.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationChartVariants.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationColumnMenu.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationCustomController.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationDataSuiteFormat.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationDataSuiteFormatForSmartChart.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationFeatureToggle.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationFeatureToggleUsage.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationFilter.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationLoadVariants.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationLoadVariantsResponsiveTable.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationP13nColumnsPanel.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationPerformance.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationPresentationVariant.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationResponsive.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationRestore.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationRestoreCancel.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationRestoreColumns.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationRestoreGroup.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationRestoreWithVariant.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationRestoreWithVariantII.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationSelectionPanel00.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationSelectionPanel01.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationSelectionPanel02.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationSelectionPanelEndUser.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationSelectionPanelKeyUser.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			},
			"opaTests/PersonalizationSelectionPanelRestore.opa": {
				group: "Personalization",
				ui5: {
					resourceroots: {
						"sap.ui.comp.qunit.personalization.test": "test-resources/sap/ui/comp/qunit/personalization/test",
						"test.sap.ui.comp.personalization": "test-resources/sap/ui/comp/qunit/personalization"
					}
				}
			}
        }
    };

    return oUnitTest;

});




/*
(function() {
	"use strict";

	window.suite = function() {

		var oSuite = new parent.jsUnitTestSuite(), contextPath = "/" + window.location.pathname.split("/")[1];

			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/Personalization.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationCancel.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationChart.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationChartRestore.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationChartVariants.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationDataSuiteFormat.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationDataSuiteFormatForSmartChart.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationFeatureToggle.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationFeatureToggleUsage.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationLoadVariants.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationLoadVariantsResponsiveTable.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationP13nColumnsPanel.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationPerformance.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationPresentationVariant.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationResponsive.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationRestore.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationRestoreCancel.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationRestoreColumns.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationRestoreGroup.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationRestoreWithVariant.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationRestoreWithVariantII.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationSelectionPanel00.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationSelectionPanel01.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationSelectionPanel02.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationSelectionPanelEndUser.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationSelectionPanelKeyUser.opa.qunit.html");
			oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/personalization/test/PersonalizationSelectionPanelRestore.opa.qunit.html");

			//oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/navpopover/test/LinkContactAnnotation.opa.qunit.html");
			//oSuite.addTestPage(contextPath + "/test-resources/sap/ui/comp/qunit/navpopover/test/LinkPersonalization.opa.qunit.html");

			oSuite.addTestPage(contextPath + "/resources/sap/ui/test/starter/Test.qunit.html?testsuite=test-resources/sap/m/qunit/testsuite.mobile.qunit&test=P13nColumnsPanel");
			oSuite.addTestPage(contextPath + "/resources/sap/ui/test/starter/Test.qunit.html?testsuite=test-resources/sap/m/qunit/testsuite.mobile.qunit&test=P13nConditionPanel");
			oSuite.addTestPage(contextPath + "/resources/sap/ui/test/starter/Test.qunit.html?testsuite=test-resources/sap/m/qunit/testsuite.mobile.qunit&test=P13nFilterPanel");
			oSuite.addTestPage(contextPath + "/resources/sap/ui/test/starter/Test.qunit.html?testsuite=test-resources/sap/m/qunit/testsuite.mobile.qunit&test=P13nSortPanel");
			oSuite.addTestPage(contextPath + "/resources/sap/ui/test/starter/Test.qunit.html?testsuite=test-resources/sap/m/qunit/testsuite.mobile.qunit&test=P13nGroupPanel");
			oSuite.addTestPage(contextPath + "/resources/sap/ui/test/starter/Test.qunit.html?testsuite=test-resources/sap/m/qunit/testsuite.mobile.qunit&test=P13nDialog");
			oSuite.addTestPage(contextPath + "/resources/sap/ui/test/starter/Test.qunit.html?testsuite=test-resources/sap/m/qunit/testsuite.mobile.qunit&test=P13nDimMeasurePanel");
			oSuite.addTestPage(contextPath + "/resources/sap/ui/test/starter/Test.qunit.html?testsuite=test-resources/sap/m/qunit/testsuite.mobile.qunit&test=P13nSelectionPanel");
		}
		return oSuite;
	};

})();
*/
