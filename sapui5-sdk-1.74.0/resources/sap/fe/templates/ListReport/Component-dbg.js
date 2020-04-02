/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(
	["sap/fe/core/TemplateComponent", "sap/base/Log", "sap/fe/templates/VariantManagement"],
	function(TemplateComponent, Log, VariantManagement) {
		"use strict";

		var ListReportComponent = TemplateComponent.extend("sap.fe.templates.ListReport.Component", {
			metadata: {
				properties: {
					initialLoad: {
						type: "boolean",
						defaultValue: true
					},
					liveMode: {
						type: "boolean",
						defaultValue: false
					},
					/**
					 * Defines if and on which level variants can be configured:
					 * 		None: no variant configuration at all
					 * 		Page: one variant configuration for the whole page
					 * 		Control: variant configuration on control level
					 */
					variantManagement: {
						type: "sap.fe.templates.VariantManagement",
						defaultValue: VariantManagement.None
					}
				},
				library: "sap.fe",
				manifest: "json"
			},
			onBeforeBinding: function(oContext) {},
			onAfterBinding: function(oContext, mParameters) {
				TemplateComponent.prototype.onAfterBinding.apply(this, arguments);
				// for now we just forward this to the list report controller
				this.getRootControl()
					.getController()
					.onAfterBinding(oContext, mParameters);
			},

			setVariantManagement: function(sVariantManagement) {
				if (sVariantManagement === VariantManagement.Control) {
					Log.error("ListReport does not support Control-level variant management yet");
					sVariantManagement = VariantManagement.None;
				}

				this.setProperty("variantManagement", sVariantManagement);
			}
		});
		return ListReportComponent;
	},
	/* bExport= */ true
);
