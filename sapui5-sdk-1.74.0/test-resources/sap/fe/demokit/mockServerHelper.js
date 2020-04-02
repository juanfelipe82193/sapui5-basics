sap.ui.define(["sap/fe/core/AppComponent", "sap/base/Log"], function(AppComponent, Log) {
	"use strict";
	/* global hasher */

	// Here we maintain dataSources, extraPaths and serviceRegex to be made available using the URL param serviceMode = ['READONLY, 'DRAFT']
	// If mocked data, it is used by the mock server
	// If using backend url, it is used in app's Component.js to modify the manifest before it is used
	// dataSources	- override service Url and mock data path
	// extraPaths	- additional mock data paths apart from mainService
	// serviceRegex	- match requests and provide responses in mock server
	var oSettings = {
		"v4gwsamplebasic-display": {
			"serviceRegex": "V4_GW_SAMPLE_BASIC",
			"extraPaths": {
				"PRODUCT_ID": "./apps/gwsamplebasic/webapp/localService/metadata_product.xml",
				"CATEGORY": "./apps/gwsamplebasic/webapp/localService/metadata_category.xml",
				"CURRENCY_CODE": "./apps/gwsamplebasic/webapp/localService/metadata_currency.xml"
			},
			"dataSources": {
				"mainService": {
					"uri": "/sap/opu/odata4/IWBEP/V4_SAMPLE/default/IWBEP/V4_GW_SAMPLE_BASIC/0001/",
					"type": "OData",
					"settings": {
						"annotations": ["localAnnotations"],
						"odataVersion": "4.0",
						"localUri": "localService/metadata.xml"
					}
				},
				"localAnnotations": {
					"uri": "annotations/annotations.xml",
					"type": "ODataAnnotation",
					"settings": {
						"localUri": "annotations/annotations.xml"
					}
				}
			}
		},
		"iteloABAP-display": {
			"serviceRegex": "/sap/opu/odata4/sap/zd025386/srvd/sap/abmp_man_product/0001/",
			"dataSources": {
				"mainService": {
					"uri": "/sap/opu/odata4/sap/zd025386/srvd/sap/abmp_man_product/0001/",
					"type": "OData",
					"settings": {
						"annotations": [],
						"odataVersion": "4.0",
						"localUri": "localService/draft/metadata.xml"
					}
				}
			}
		},
		"v4musicNode-display": {
			"serviceRegex": "/sap/opu/odata4/sap/sadl_gw_appmusic_draft/",
			"extraPaths": {
				"publications": "./apps/music/webapp/localService/publications/metadata.xml",
				"country": "./apps/music/webapp/localService/country/metadata.xml",
				"countryoforigin": "./apps/music/webapp/localService/draft/metadata_countryoforigin.xml",
				"regionoforigin": "./apps/music/webapp/localService/draft/metadata_regionoforigin.xml",
				"I_MDBU_V4_ArtistPerson": "./apps/music/webapp/localService/metadata_name_i_mdbu_v4_artistperson.xml",
				"I_MDBU_V4_ArtistName": "./apps/music/webapp/localService/metadata_name_i_mdbu_v4_artistname.xml"
			},
			"dataSources": {
				"mainService": {
					"uri": "/sap/opu/odata4/sap/sadl_gw_appmusic_draft/srvd/sap/sadl_gw_appmusicdr_definition/0001/",
					"type": "OData",
					"settings": {
						"annotations": [],
						"odataVersion": "4.0",
						"localUri": "localService/draft/metadata.xml"
					}
				},
				"localAnnotations": {
					"uri": "annotations/annotations.xml",
					"type": "ODataAnnotation",
					"settings": {
						"localUri": "annotations/annotations.xml"
					}
				}
			}
		},
		"v4music-display": {
			"serviceRegex": "/sap/opu/odata4/sap/sadl_gw_appmusic_draft/",
			"extraPaths": {
				"publications": "./apps/music/webapp/localService/publications/metadata.xml",
				"country": "./apps/music/webapp/localService/country/metadata.xml",
				"countryoforigin": "./apps/music/webapp/localService/draft/metadata_countryoforigin.xml",
				"regionoforigin": "./apps/music/webapp/localService/draft/metadata_regionoforigin.xml",
				"I_MDBU_V4_ArtistPerson": "./apps/music/webapp/localService/metadata_name_i_mdbu_v4_artistperson.xml",
				"I_MDBU_V4_ArtistName": "./apps/music/webapp/localService/metadata_name_i_mdbu_v4_artistname.xml"
			},
			"dataSources": {
				"mainService": {
					"uri": "/sap/opu/odata4/sap/sadl_gw_appmusic_draft/srvd/sap/sadl_gw_appmusicdr_definition/0001/",
					"type": "OData",
					"settings": {
						"annotations": ["localAnnotations"],
						"odataVersion": "4.0",
						"localUri": "localService/draft/metadata.xml"
					}
				},
				"localAnnotations": {
					"uri": "annotations/annotations.xml",
					"type": "ODataAnnotation",
					"settings": {
						"localUri": "annotations/annotations.xml"
					}
				}
			}
		},
		"v4musicReadOnly-display": {
			"serviceRegex": "/sap/opu/odata4/sap/sadl_gw_appmusicro_service",
			"extraPaths": {
				"publications": "./apps/music/webapp/localService/publications/metadata.xml",
				"country": "./apps/music/webapp/localService/country/metadata.xml",
				"countryoforigin": "./apps/music/webapp/localService/readonly/metadata_countryoforigin.xml",
				"regionoforigin": "./apps/music/webapp/localService/readonly/metadata_regionoforigin.xml",
				"I_MDBU_V4_ArtistPerson": "./apps/music/webapp/localService/metadata_name_i_mdbu_v4_artistperson.xml",
				"I_MDBU_V4_ArtistName": "./apps/music/webapp/localService/metadata_name_i_mdbu_v4_artistname.xml"
			},
			"dataSources": {
				"mainService": {
					"uri": "/sap/opu/odata4/sap/sadl_gw_appmusicro_service/srvd/sap/sadl_gw_appmusicro_definition/0001/",
					"type": "OData",
					"settings": {
						"annotations": ["localAnnotations"],
						"odataVersion": "4.0",
						"localUri": "localService/readonly/metadata.xml"
					}
				},
				"localAnnotations": {
					"uri": "annotations/annotations.xml",
					"type": "ODataAnnotation",
					"settings": {
						"localUri": "annotations/annotations.xml"
					}
				}
			}
		},
		"v4musicNonDraft-display": {
			"serviceRegex": "/sap/opu/odata4/sap/sadl_gw_appmusictr_service",
			"extraPaths": {
				"publications": "./apps/music/webapp/localService/publications/metadata.xml",
				"country": "./apps/music/webapp/localService/country/metadata.xml",
				"countryoforigin": "./apps/music/webapp/localService/nondraft/metadata_countryoforigin.xml",
				"regionoforigin": "./apps/music/webapp/localService/nondraft/metadata_regionoforigin.xml"
			},
			"dataSources": {
				"mainService": {
					"uri": "/sap/opu/odata4/sap/sadl_gw_appmusictr_service/srvd/sap/sadl_gw_appmusictr_definition/0001/",
					"type": "OData",
					"settings": {
						"annotations": ["localAnnotations"],
						"odataVersion": "4.0",
						"localUri": "localService/nondraft/metadata.xml"
					}
				},
				"localAnnotations": {
					"uri": "annotations/annotations.xml",
					"type": "ODataAnnotation",
					"settings": {
						"localUri": "annotations/annotations.xml"
					}
				}
			}
		}
	};

	function getSetting(sApp, sSetting) {
		if (!sApp) {
			Log.error("sap.fe mockServerHelper:getSettings(...) No parameter sApp provided", "sap.fe.demokit.MockServerHelper");
			return {};
		}
		return oSettings[sApp] && oSettings[sApp][sSetting];
	}

	var fnOrg = AppComponent.prototype._initCompositeSupport;
	AppComponent.prototype._initCompositeSupport = function() {
		//This approach can be replaced by metadata: {"manifest": fnGetManifest()} above
		var oManifest = this.getMetadata().getManifest(),
			oManifestSettings = oManifest["sap.app"],
			sHash = hasher.getHash(),
			//Remove appState and other trailing path for object pages we only want to send the semanticObject-action
			sAppHash = sHash.indexOf("&/") > -1 ? sHash.substr(0, sHash.indexOf("&/")) : sHash,
			oDataSource = getSetting(sAppHash, "dataSources");

		oManifestSettings["dataSources"] = oDataSource || oManifestSettings["dataSources"];
		return fnOrg.apply(this, arguments);
	};

	var MockServerHelper = {
		getSetting: getSetting
	};

	return MockServerHelper;
});
