/*
 * tests for the sap.suite.ui.generic.template.support.lib.CommonChecks
 */
sap.ui.define([
	"sap/suite/ui/generic/template/support/lib/CommonChecks",
	"sap/ui/core/mvc/Controller"
], function (CommonChecks, Controller) {
	"use strict";

	var sId = "";
	var oManifest = {};
	var oMetadata = {
		getManifest: function () {
			return oManifest;
		}
	};
	var oOwnerComponent = {
		getMetadata: function () {
			return oMetadata;
		},
		getAppComponent: function () {
			return {
				getMetadata: function () {
					return oMetadata;
				}
			}
		}
	};
	var ControllerClass = Controller.extend("DummyController", {
		getOwnerComponent: function () {
			return oOwnerComponent;
		}
	});
	var oController = new ControllerClass();

	function addView(sId) {
		var oView = sap.ui.xmlview(sId, {
			viewName: "sap.suite.ui.generic.template.support.DiagnosticsTool.view.DiagnosticsTool",
			mSettings: {},
			controller: oController,
			async: false
		});
		var div = document.createElement("div");
		div.id = "anchor_div";
		document.body.appendChild(div);
		oView.placeAt("anchor_div");
		sap.ui.getCore().applyChanges();
		return oView;
	}

	function destroyView(sId) {
		sap.ui.getCore().byId(sId).destroy();
	}

	// ------------------------------------ Checks ------------------------------------
	QUnit.module("CommonChecks", {
		setup: function () {
		},
		teardown: function () {
		}
	});
	/**
	 * test getUI5VersionInfo of sap.suite.ui.generic.template.support.lib.CommonChecks
	 */
	QUnit.test("getUI5VersionInfo", function (assert) {
		assert.equal(CommonChecks.getUI5VersionInfo(), sap.ui.versioninfo, "Version info is equal");
	});

	/**
	 * test getComponentIDByStructure of sap.suite.ui.generic.template.support.lib.CommonChecks
	 */
	QUnit.test("getComponentIDByStructure", function (assert) {
		var oValidManifest = {"sap.app": {ach: "DummyComponent"}};
		var oInvalidManifest1 = {};
		var oInvalidManifest2 = [];
		var oInvalidManifest3 = undefined;
		var oInvalidManifest4 = {"sap.app": {}};
		var oInvalidManifest5 = {"sap.app": {ach: undefined}};
		assert.equal(CommonChecks.getApplicationComponentByManifest(oValidManifest), "DummyComponent", "Valid application component");
		assert.equal(CommonChecks.getApplicationComponentByManifest(oInvalidManifest1), "", "Invalid manifest, empty object");
		assert.equal(CommonChecks.getApplicationComponentByManifest(oInvalidManifest2), "", "Invalid manifest, empty array");
		assert.equal(CommonChecks.getApplicationComponentByManifest(oInvalidManifest3), "", "Invalid manifest, undefined");
		assert.equal(CommonChecks.getApplicationComponentByManifest(oInvalidManifest4), "", "Invalid manifest, missing ach");
		assert.equal(CommonChecks.getApplicationComponentByManifest(oInvalidManifest5), "", "Invalid manifest, invalid ach");
	});

	/**
	 * test getApplicationComponentByManifest of sap.suite.ui.generic.template.support.lib.CommonChecks
	 */
	QUnit.test("getApplicationComponentByManifest", function (assert) {
		var oValidManifest = {"sap.app": {ach: "DummyComponent"}};
		var oInvalidManifest1 = {};
		var oInvalidManifest2 = [];
		var oInvalidManifest3 = undefined;
		var oInvalidManifest4 = {"sap.app": {}};
		var oInvalidManifest5 = {"sap.app": {ach: undefined}};
		assert.equal(CommonChecks.getApplicationComponentByManifest(oValidManifest), "DummyComponent", "Valid application component");
		assert.equal(CommonChecks.getApplicationComponentByManifest(oInvalidManifest1), "", "Invalid manifest, empty object");
		assert.equal(CommonChecks.getApplicationComponentByManifest(oInvalidManifest2), "", "Invalid manifest, empty array");
		assert.equal(CommonChecks.getApplicationComponentByManifest(oInvalidManifest3), "", "Invalid manifest, undefined");
		assert.equal(CommonChecks.getApplicationComponentByManifest(oInvalidManifest4), "", "Invalid manifest, missing ach");
		assert.equal(CommonChecks.getApplicationComponentByManifest(oInvalidManifest5), "", "Invalid manifest, invalid ach");
	});

	/**
	 * test getApplicationIDByManifest of sap.suite.ui.generic.template.support.lib.CommonChecks
	 */
	QUnit.test("getApplicationIDByManifest", function (assert) {
		var oValidManifest = {"sap.app": {id: "DummyID"}};
		var oInvalidManifest1 = {};
		var oInvalidManifest2 = [];
		var oInvalidManifest3 = undefined;
		var oInvalidManifest4 = {"sap.app": {}};
		var oInvalidManifest5 = {"sap.app": {id: undefined}};
		assert.equal(CommonChecks.getApplicationIDByManifest(oValidManifest), "DummyID", "Valid application id");
		assert.equal(CommonChecks.getApplicationIDByManifest(oInvalidManifest1), "", "Invalid manifest, empty object");
		assert.equal(CommonChecks.getApplicationIDByManifest(oInvalidManifest2), "", "Invalid manifest, empty array");
		assert.equal(CommonChecks.getApplicationIDByManifest(oInvalidManifest3), "", "Invalid manifest, undefined");
		assert.equal(CommonChecks.getApplicationIDByManifest(oInvalidManifest4), "", "Invalid manifest, missing id");
		assert.equal(CommonChecks.getApplicationIDByManifest(oInvalidManifest5), "", "Invalid manifest, invalid id");
	});

	/**
	 * test getRegistrationIDsByManifest of sap.suite.ui.generic.template.support.lib.CommonChecks
	 */
	QUnit.test("getRegistrationIDsByManifest", function (assert) {
		var oValidManifest1 = {"sap.fiori": {registrationIds: ["Dummy1", "Dummy2", "Dummy3"]}};
		var oValidManifest2 = {"sap.fiori": {registrationIds: ["Dummy1"]}};
		var oInvalidManifest1 = {};
		var oInvalidManifest2 = [];
		var oInvalidManifest3 = undefined;
		var oInvalidManifest4 = {"sap.fiori": {}};
		var oInvalidManifest5 = {"sap.fiori": {registrationIds: undefined}};
		assert.deepEqual(CommonChecks.getRegistrationIDsByManifest(oValidManifest1), ["Dummy1", "Dummy2", "Dummy3"], "Valid application component");
		assert.deepEqual(CommonChecks.getRegistrationIDsByManifest(oValidManifest2), ["Dummy1"], "Valid application component");
		assert.deepEqual(CommonChecks.getRegistrationIDsByManifest(oInvalidManifest1), [], "Invalid manifest, empty object");
		assert.deepEqual(CommonChecks.getRegistrationIDsByManifest(oInvalidManifest2), [], "Invalid manifest, empty array");
		assert.deepEqual(CommonChecks.getRegistrationIDsByManifest(oInvalidManifest3), [], "Invalid manifest, undefined");
		assert.deepEqual(CommonChecks.getRegistrationIDsByManifest(oInvalidManifest4), [], "Invalid manifest, missing registrationIds");
		assert.deepEqual(CommonChecks.getRegistrationIDsByManifest(oInvalidManifest5), [], "Invalid manifest, invalid registrationIds");
	});

	/**
	 * test getComponentIDByStructure of sap.suite.ui.generic.template.support.lib.CommonChecks
	 */
	QUnit.test("getComponentIDByStructure", function (assert) {
		// valid LR view
		sId = "MockId1";
		oManifest = {
			"sap.app": {
				"id": sId,
				"dataSources": {
					"Z_OVP_DEMO_TESTING_CDS": {
						"uri": "/sap/opu/odata/sap/Z_OVP_DEMO_TESTING_CDS/",
						"type": "OData",
						"settings": {
							"annotations": [
								"Z_OVP_DEMO_TESTING_CDS_VAN",
								"annotation1"
							],
							"localUri": "webapp/localService/Z_OVP_DEMO_TESTING_CDS/metadata.xml"
						}
					}
				}
			},
			"sap.ovp": {
				"cards": {
					"ovp.test.tech_card05": {
						"model": "Z_OVP_DEMO_TESTING_CDS",
						"template": "sap.ovp.cards.stack",
						"settings": {
							"title": "Sales Order Stack Card",
							"subTitle": "past month",
							"entitySet": "Z_Ovp_Demo_Testing",
							"addODataSelect": "false",
							"annotationPath": "com.sap.vocabularies.UI.v1.LineItem#ordOverView"
						}
					},
					"ovp.test.tech_card05Duplicate": {
						"model": "Z_OVP_DEMO_TESTING_CDS",
						"template": "sap.ovp.cards.stack",
						"settings": {
							"title": "Sales Order Stack Card",
							"requireAppAuthorization": "NO-AUTH",
							"entitySet": "Z_Ovp_Demo_Testing",
							"addODataSelect": "false",
							"annotationPath": "com.sap.vocabularies.UI.v1.LineItem#ordOverView"
						}
					}
				}
			}
		};
		addView(sId + "::sap.suite.ui.generic.template.ListReport.view.ListReport::Mock_Product");
		assert.equal(CommonChecks.getComponentIDByStructure(), sId, "Valid ListReport view");
		destroyView(sId + "::sap.suite.ui.generic.template.ListReport.view.ListReport::Mock_Product");

		// invalid view id
		sId = "InvalidMockId";
		oManifest = {
			"sap.app": {
				"id": sId,
				"dataSources": {
					"Z_OVP_DEMO_TESTING_CDS": {
						"uri": "/sap/opu/odata/sap/Z_OVP_DEMO_TESTING_CDS/",
						"type": "OData",
						"settings": {
							"annotations": [
								"Z_OVP_DEMO_TESTING_CDS_VAN",
								"annotation1"
							],
							"localUri": "webapp/localService/Z_OVP_DEMO_TESTING_CDS/metadata.xml"
						}
					}
				}
			},
			"sap.ovp": {
				"cards": {
					"ovp.test.tech_card05": {
						"model": "Z_OVP_DEMO_TESTING_CDS",
						"template": "sap.ovp.cards.stack",
						"settings": {
							"title": "Sales Order Stack Card",
							"subTitle": "past month",
							"entitySet": "Z_Ovp_Demo_Testing",
							"addODataSelect": "false",
							"annotationPath": "com.sap.vocabularies.UI.v1.LineItem#ordOverView"
						}
					},
					"ovp.test.tech_card05Duplicate": {
						"model": "Z_OVP_DEMO_TESTING_CDS",
						"template": "sap.ovp.cards.stack",
						"settings": {
							"title": "Sales Order Stack Card",
							"requireAppAuthorization": "NO-AUTH",
							"entitySet": "Z_Ovp_Demo_Testing",
							"addODataSelect": "false",
							"annotationPath": "com.sap.vocabularies.UI.v1.LineItem#ordOverView"
						}
					}
				}
			}
		};
		addView(sId);
		assert.equal(CommonChecks.getComponentIDByStructure(), "", "Invalid ListReport view ID");
		destroyView(sId);

		// TODO: add test for OVP
	});

	/**
	 * test getManifestURL of sap.suite.ui.generic.template.support.lib.CommonChecks
	 */
	QUnit.test("getManifestURL", function (assert) {
		assert.equal(CommonChecks.getManifestURL("http://localhost:1337", "/test/case/", "manifest.json"), "", "Invalid path");
		assert.equal(CommonChecks.getManifestURL("http://localhost:1337", "/test/", "/path/to/manifest.json"), "http://localhost:1337/path/to/manifest.json", "Host-relative path");
		assert.equal(CommonChecks.getManifestURL("http://localhost:1337", "/test/", "./path/to/manifest.json"), "http://localhost:1337/test/./path/to/manifest.json", "Path-relative path");
		// failing tests, one parameter missing
		assert.equal(CommonChecks.getManifestURL("", "/test/", "/path/to/manifest.json"), "", "Missing host");
		assert.equal(CommonChecks.getManifestURL("http://localhost:1337", "/test/", ""), "", "Missing file");
		assert.equal(CommonChecks.getManifestURL("http://localhost:1337", "", "./path/to/manifest.json"), "", "Missing local path");
	});

	/**
	 * test getRootPath of sap.suite.ui.generic.template.support.lib.CommonChecks
	 */
	QUnit.test("getRootPath", function (assert) {
		assert.equal(CommonChecks.getRootPath("http://localhost:1337/manifest.json"), "http://localhost:1337/", "Normal use case #1");
		assert.equal(CommonChecks.getRootPath("http://localhost:1337/webapp/manifest.json"), "http://localhost:1337/webapp/", "Normal use case #2");
		assert.equal(CommonChecks.getRootPath("http://localhost:1337/manifest.js"), "http://localhost:1337/manifest.js", "Wrong file");
		assert.equal(CommonChecks.getRootPath(""), "", "Missing path");
	});

	/**
	 * test isValidFloorplan of sap.suite.ui.generic.template.support.lib.CommonChecks
	 */
	QUnit.test("isValidFloorplan", function (assert) {
		assert.equal(CommonChecks.isValidFloorplan(CommonChecks.mFloorplans.UNKNOWN), true, "Unknown floorplan, default");
		assert.equal(CommonChecks.isValidFloorplan(CommonChecks.mFloorplans.LISTREPORT), true, "List Report");
		assert.equal(CommonChecks.isValidFloorplan(CommonChecks.mFloorplans.ANALYTICALLISTPAGE), true, "Analytical List Page");
		assert.equal(CommonChecks.isValidFloorplan(CommonChecks.mFloorplans.OVERVIEWPAGE), true, "Overview Page");
		assert.equal(CommonChecks.isValidFloorplan("bla"), false, "Invalid floorplan");
		assert.equal(CommonChecks.isValidFloorplan(""), false, "Empty string");
		assert.equal(CommonChecks.isValidFloorplan(), false, "Empty Input");
	});

	/**
	 * test getTicketComponentForFloorplan of sap.suite.ui.generic.template.support.lib.CommonChecks
	 */
	QUnit.test("getTicketComponentForFloorplan", function (assert) {
		assert.equal(CommonChecks.getTicketComponentForFloorplan(CommonChecks.mFloorplans.UNKNOWN), CommonChecks.mTicketComponents.UNKNOWN, "Unknown floorplan, default");
		assert.equal(CommonChecks.getTicketComponentForFloorplan(CommonChecks.mFloorplans.LISTREPORT), CommonChecks.mTicketComponents.LISTREPORT, "List Report");
		assert.equal(CommonChecks.getTicketComponentForFloorplan(CommonChecks.mFloorplans.ANALYTICALLISTPAGE), CommonChecks.mTicketComponents.ANALYTICALLISTPAGE, "Analytical List Page");
		assert.equal(CommonChecks.getTicketComponentForFloorplan(CommonChecks.mFloorplans.OVERVIEWPAGE), CommonChecks.mTicketComponents.OVERVIEWPAGE, "Overview Page");
		assert.equal(CommonChecks.getTicketComponentForFloorplan("bla"), CommonChecks.mTicketComponents.UNKNOWN, "Invalid floorplan");
		assert.equal(CommonChecks.getTicketComponentForFloorplan(""), CommonChecks.mTicketComponents.UNKNOWN, "Empty string");
		assert.equal(CommonChecks.getTicketComponentForFloorplan(), CommonChecks.mTicketComponents.UNKNOWN, "Empty Input");
	});

	/**
	 * test isOverviewPageByManifest of sap.suite.ui.generic.template.support.lib.CommonChecks
	 */
	QUnit.test("isOverviewPageByManifest", function (assert) {
		var oValidManifest = {
			"sap.app": {
				"dataSources": {
					"Z_OVP_DEMO_TESTING_CDS": {
						"uri": "/sap/opu/odata/sap/Z_OVP_DEMO_TESTING_CDS/",
						"type": "OData",
						"settings": {
							"annotations": [
								"Z_OVP_DEMO_TESTING_CDS_VAN",
								"annotation1"
							],
							"localUri": "webapp/localService/Z_OVP_DEMO_TESTING_CDS/metadata.xml"
						}
					}
				}
			},
			"sap.ovp": {
				"cards": {
					"ovp.test.tech_card05": {
						"model": "Z_OVP_DEMO_TESTING_CDS",
						"template": "sap.ovp.cards.stack",
						"settings": {
							"title": "Sales Order Stack Card",
							"subTitle": "past month",
							"entitySet": "Z_Ovp_Demo_Testing",
							"addODataSelect": "false",
							"annotationPath": "com.sap.vocabularies.UI.v1.LineItem#ordOverView"
						}
					},
					"ovp.test.tech_card05Duplicate": {
						"model": "Z_OVP_DEMO_TESTING_CDS",
						"template": "sap.ovp.cards.stack",
						"settings": {
							"title": "Sales Order Stack Card",
							"requireAppAuthorization": "NO-AUTH",
							"entitySet": "Z_Ovp_Demo_Testing",
							"addODataSelect": "false",
							"annotationPath": "com.sap.vocabularies.UI.v1.LineItem#ordOverView"
						}
					}
				}
			}
		};
		var oInvalidManifest1 = {};
		var oInvalidManifest2 = {"sap.app": {}, "sap.ovp": {}};
		var oInvalidManifest3 = {"sap.app": {}};
		assert.equal(CommonChecks.isOverviewPageByManifest(oValidManifest), true, "Valid manifest");
		assert.equal(CommonChecks.isOverviewPageByManifest(oInvalidManifest1), false, "Invalid manifest, caused by empty manifest");
		assert.equal(CommonChecks.isOverviewPageByManifest(oInvalidManifest2), false, "Invalid manifest, caused by empty sap.ovp");
		assert.equal(CommonChecks.isOverviewPageByManifest(oInvalidManifest3), false, "Invalid manifest, caused by missing sap.ovp");
	});

	/**
	 * test isListReportByManifest of sap.suite.ui.generic.template.support.lib.CommonChecks
	 */
	QUnit.test("isListReportByManifest", function (assert) {
		var oValidManifest = {
			"sap.app": {},
			"sap.ui.generic.app": {
				"pages": [
					{
						"entitySet": "STTA_C_MP_Product",
						"component": {
							"name": "sap.suite.ui.generic.template.ListReport",
							"list": true,
							"settings": {
								"gridTable": false,
								"multiSelect": true,
								"smartVariantManagement": true
							}
						}
					}
				]
			}
		};
		var oInvalidManifest1 = {};
		var oInvalidManifest2 = {
			"sap.app": {},
			"sap.ui.generic.app": {
				"pages": {}
			}
		};
		var oInvalidManifest3 = {
			"sap.app": {},
			"sap.ui.generic.app": {
				"pages": []
			}
		};
		var oInvalidManifest4 = {
			"sap.app": {},
			"sap.ui.generic.app": {
				"pages": [
					{
						"entitySet": "STTA_C_MP_Product",
						"component": {
							"name": "sap.suite.ui.generic.template.AnalyticalListPage",
							"list": true,
							"settings": {
								"gridTable": false,
								"multiSelect": true,
								"smartVariantManagement": true
							}
						}
					}
				]
			}
		};
		assert.equal(CommonChecks.isListReportByManifest(oValidManifest), true, "Valid manifest");
		assert.equal(CommonChecks.isListReportByManifest(oInvalidManifest1), false, "Invalid manifest, caused by empty manifest");
		assert.equal(CommonChecks.isListReportByManifest(oInvalidManifest2), false, "Invalid manifest, caused by empty pages (object)");
		assert.equal(CommonChecks.isListReportByManifest(oInvalidManifest3), false, "Invalid manifest, caused by empty pages (array)");
		assert.equal(CommonChecks.isListReportByManifest(oInvalidManifest4), false, "ALP instead of LR, caused by wrong component name");
	});

	/**
	 * test isAnalyticalListPageByManifest of sap.suite.ui.generic.template.support.lib.CommonChecks
	 */
	QUnit.test("isAnalyticalListPageByManifest", function (assert) {
		var oValidManifest1 = {
			"sap.app": {},
			"sap.ui.generic.app": {
				"pages": {
					"AnalyticalListPage": {
						"entitySet": "ZEPM_C_SALESORDERITEMQUERYResults",
						"component": {
							"name": "sap.suite.ui.generic.template.AnalyticalListPage",
							"list": true,
							"settings": {
								"multiSelect": true,
								"dsQueryName": "what_is_this",
								"defaultContentView": "table",
								"defaultFilterMode": "compact",
								"detailTableNavigationTarget": "EmbedAnalyticsDetailListTest-display",
								"showAutoHide": true
							}
						}
					}
				}
			}
		};
		var oValidManifest2 = {
			"sap.app": {},
			"sap.ui.generic.app": {
				"pages": [
					{
						"entitySet": "STTA_C_MP_Product",
						"component": {
							"name": "sap.suite.ui.generic.template.AnalyticalListPage",
							"list": true,
							"settings": {
								"defaultContentView": "table",
								"tableType": "TreeTable",
								"uniqueHierarchyNodeIDForTreeTable": "HIERARCHY_NODE"
							}
						},
						"pages": [
							{
								"entitySet": "STTA_C_MP_Product",
								"component": {
									"name": "sap.suite.ui.generic.template.ObjectPage"
								},
								"pages": [
									{
										"navigationProperty": "to_ProductText",
										"entitySet": "SEPMRA_C_PD_ProductText",
										"component": {
											"name": "sap.suite.ui.generic.template.ObjectPage"
										}
									}
								]
							}
						]
					}
				]
			}
		};
		var oInvalidManifest1 = {};
		var oInvalidManifest2 = {
			"sap.app": {},
			"sap.ui.generic.app": {
				"pages": {}
			}
		};
		var oInvalidManifest3 = {
			"sap.app": {},
			"sap.ui.generic.app": {
				"pages": []
			}
		};

		assert.equal(CommonChecks.isAnalyticalListPageByManifest(oValidManifest1), true, "Valid manifest with pages as object");
		assert.equal(CommonChecks.isAnalyticalListPageByManifest(oValidManifest2), true, "Valid manifest with pages as array");
		assert.equal(CommonChecks.isAnalyticalListPageByManifest(oInvalidManifest1), false, "Invalid manifest, caused by empty manifest");
		assert.equal(CommonChecks.isAnalyticalListPageByManifest(oInvalidManifest2), false, "Invalid manifest, caused by empty pages (object)");
		assert.equal(CommonChecks.isAnalyticalListPageByManifest(oInvalidManifest3), false, "Invalid manifest, caused by empty pages (array)");
	});

	/**
	 * test getFloorplanByManifest of sap.suite.ui.generic.template.support.lib.CommonChecks
	 */
	QUnit.test("getFloorplanByManifest", function (assert) {
		var oManifestLR = {
			"sap.app": {},
			"sap.ui.generic.app": {
				"pages": [
					{
						"entitySet": "STTA_C_MP_Product",
						"component": {
							"name": "sap.suite.ui.generic.template.ListReport",
							"list": true,
							"settings": {
								"gridTable": false,
								"multiSelect": true,
								"smartVariantManagement": true
							}
						}
					}
				]
			}
		};
		var oManifestALP = {
			"sap.app": {},
			"sap.ui.generic.app": {
				"pages": {
					"AnalyticalListPage": {
						"entitySet": "ZEPM_C_SALESORDERITEMQUERYResults",
						"component": {
							"name": "sap.suite.ui.generic.template.AnalyticalListPage",
							"list": true,
							"settings": {
								"multiSelect": true,
								"dsQueryName": "what_is_this",
								"defaultContentView": "table",
								"defaultFilterMode": "compact",
								"detailTableNavigationTarget": "EmbedAnalyticsDetailListTest-display",
								"showAutoHide": true
							}
						}
					}
				}
			}
		};
		var oManifestOVP = {
			"sap.app": {
				"dataSources": {
					"Z_OVP_DEMO_TESTING_CDS": {
						"uri": "/sap/opu/odata/sap/Z_OVP_DEMO_TESTING_CDS/",
						"type": "OData",
						"settings": {
							"annotations": [
								"Z_OVP_DEMO_TESTING_CDS_VAN",
								"annotation1"
							],
							"localUri": "webapp/localService/Z_OVP_DEMO_TESTING_CDS/metadata.xml"
						}
					}
				}
			},
			"sap.ovp": {
				"cards": {
					"ovp.test.tech_card05": {
						"model": "Z_OVP_DEMO_TESTING_CDS",
						"template": "sap.ovp.cards.stack",
						"settings": {
							"title": "Sales Order Stack Card",
							"subTitle": "past month",
							"entitySet": "Z_Ovp_Demo_Testing",
							"addODataSelect": "false",
							"annotationPath": "com.sap.vocabularies.UI.v1.LineItem#ordOverView"
						}
					},
					"ovp.test.tech_card05Duplicate": {
						"model": "Z_OVP_DEMO_TESTING_CDS",
						"template": "sap.ovp.cards.stack",
						"settings": {
							"title": "Sales Order Stack Card",
							"requireAppAuthorization": "NO-AUTH",
							"entitySet": "Z_Ovp_Demo_Testing",
							"addODataSelect": "false",
							"annotationPath": "com.sap.vocabularies.UI.v1.LineItem#ordOverView"
						}
					}
				}
			}
		};
		var oInvalidManifest1 = {};
		var oInvalidManifest2 = {
			"test": {"dummy": 123}
		};

		assert.equal(CommonChecks.getFloorplanByManifest(oManifestLR), "sap.suite.ui.generic.template.ListReport", "Detect ListReport");
		assert.equal(CommonChecks.getFloorplanByManifest(oManifestALP), "sap.suite.ui.generic.template.AnalyticalListPage", "Detect AnalyticalListPage");
		assert.equal(CommonChecks.getFloorplanByManifest(oManifestOVP), "sap.ovp", "Detect OverviewPage");
		assert.equal(CommonChecks.getFloorplanByManifest(oInvalidManifest1), "Unknown", "Empty manifest");
		assert.equal(CommonChecks.getFloorplanByManifest(oInvalidManifest2), "Unknown", "Invalid manifest");
	});
});
