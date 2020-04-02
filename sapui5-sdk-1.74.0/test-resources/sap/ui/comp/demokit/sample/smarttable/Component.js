sap.ui.define([
	"sap/ui/core/UIComponent"

], function(UIComponent){
	"use strict";

	return UIComponent.extend("sap.ui.comp.sample.smarttable.Component", {

		metadata: {
			rootView: {
			"viewName": "sap.ui.comp.sample.smarttable.SmartTable",
			"type": "XML",
			"async": true
			},
			dependencies: {
				libs: [
					"sap.m", "sap.ui.comp"
				]
			},
			config: {
				sample: {
					stretch: true,
					files: [
						"SmartTable.view.xml",
						"SmartTable.controller.js",
						"mockserver/metadata.xml",
						"mockserver/LineItemsSet.json",
						"mockserver/VL_SH_H_T001.json",
						"mockserver/Companies.json",
						"mockserver/VL_CH_AUFK.json",
						"mockserver/VL_CT_TCURC.json",
						"mockserver/VL_FV_SHKZG.json",
						"mockserver/VL_SH_AANLA.json",
						"mockserver/VL_SH_DEBIA.json",
						"mockserver/VL_SH_DEBID.json",
						"mockserver/VL_SH_DEBIE.json",
						"mockserver/VL_SH_DEBIL.json",
						"mockserver/VL_SH_DEBIS.json",
						"mockserver/VL_SH_FICEPC.json",
						"mockserver/VL_SH_GL_ACCT_CA_KEY.json",
						"mockserver/VL_SH_GL_ACCT_CA_NO.json",
						"mockserver/VL_SH_GL_ACCT_CA_TEXT.json",
						"mockserver/VL_SH_GL_ACCT_CC_NO.json",
						"mockserver/VL_SH_GL_ACCT_CC_TEXT.json",
						"mockserver/VL_SH_H_T001.json",
						"mockserver/VL_SH_H_T003.json",
						"mockserver/VL_SH_H_T074U.json",
						"mockserver/VL_SH_H_TGSB.json"
					]
				}
			}
		}
	});
});