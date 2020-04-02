/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[
		"sap/fe/core/TemplateComponent",
		"sap/ui/model/odata/v4/ODataListBinding",
		"sap/fe/core/CommonUtils",
		"sap/base/Log",
		"sap/fe/templates/VariantManagement",
		"sap/fe/templates/ObjectPage/SectionLayout",
		"sap/fe/core/controllerextensions/FlexibleColumnLayout"
	],
	function(TemplateComponent, ODataListBinding, CommonUtils, Log, VariantManagement, SectionLayout, FlexibleColumnLayout) {
		"use strict";

		var ObjectPageComponent = TemplateComponent.extend("sap.fe.templates.ObjectPage.Component", {
			metadata: {
				properties: {
					/**
					 * Defines if and on which level variants can be configured:
					 * 		None: no variant configuration at all
					 * 		Page: one variant configuration for the whole page
					 * 		Control: variant configuration on control level
					 */
					variantManagement: {
						type: "sap.fe.templates.VariantManagement",
						defaultValue: VariantManagement.None
					},
					/**
					 * Defines how the sections are rendered
					 * 		Page: all sections are shown on one page
					 * 		Tabs: each top-level section is shown in an own tab
					 */
					sectionLayout: {
						type: "sap.fe.templates.ObjectPage.SectionLayout",
						defaultValue: SectionLayout.Page
					},
					/**
					 * Enables the related apps features
					 */
					showRelatedApps: {
						type: "boolean",
						defaultValue: false
					},
					/**
					 * Enables the editable object page header
					 */
					editableHeaderContent: {
						type: "boolean",
						defaultValue: true
					}
				},
				library: "sap.fe",
				manifest: "json"
			},

			onBeforeBinding: function(oContext, mParameters) {
				// for now we just forward this to the object page controller
				return this.getRootControl()
					.getController()
					.onBeforeBinding(oContext, mParameters);
			},

			onAfterBinding: function(oContext, mParameters) {
				// for now we just forward this to the object page controller
				this.getRootControl()
					.getController()
					.onAfterBinding(oContext, mParameters);
			},

			// TODO: this should be ideally be handled by the editflow/routing without the need to have this method in the
			// object page - for now keep it here
			createDeferredContext: function(sPath) {
				var oListBinding,
					that = this;

				oListBinding = new ODataListBinding(this.getModel(), sPath.replace("(...)", ""));

				// for now wait until the view and the controller is created
				that.getRootControl()
					.getController()
					.editFlow.createDocument(oListBinding, {
						creationMode: "Sync",
						noHistoryEntry: true
					})
					.catch(function() {
						// the creation failed or was aborted by the user - showing the object page doesn't make any sense
						// now - for now just use window.history.back to navigate back
						window.history.back();
					});
			},

			setVariantManagement: function(sVariantManagement) {
				if (sVariantManagement === VariantManagement.Page) {
					Log.error("ObjectPage does not support Page-level variant management yet");
					sVariantManagement = VariantManagement.None;
				}

				this.setProperty("variantManagement", sVariantManagement);
			},

			getViewData: function() {
				var oViewData = TemplateComponent.prototype.getViewData.apply(this, arguments);
				if (FlexibleColumnLayout.prototype.isFclEnabled()) {
					//add the  property fclenabled to oViewData. To be used by templates
					oViewData.fclEnabled = true;
				}
				return oViewData;
			},

			exit: function() {
				var oObjectPage = this.getRootControl();
				if (oObjectPage.getBindingContext() && oObjectPage.getBindingContext().hasPendingChanges()) {
					oObjectPage
						.getBindingContext()
						.getBinding()
						.resetChanges();
				}
			}
		});
		return ObjectPageComponent;
	},
	/* bExport= */ true
);
