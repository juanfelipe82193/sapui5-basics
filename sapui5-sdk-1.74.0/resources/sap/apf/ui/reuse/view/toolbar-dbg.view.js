/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/**
 * @class toolbar
 * @memberOf sap.apf.ui.reuse.view
 * @name toolbar
 * @description layout holds the Toolbar buttons: new , save, open, print
 */
sap.ui.define([
	'sap/m/List',
	'sap/m/ListType',
	'sap/m/StandardListItem'
], function(List, ListType, StandardListItem) {
	"use strict";
	sap.ui.jsview("sap.apf.ui.reuse.view.toolbar", {
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.toolbar";
		},
		createContent : function(oController) {
			// when metadata is not available, default values are set
			this.maxNumberOfSteps = 32;
			this.maxNumberOfPaths = 255;
			var self = this;
			var oViewData = this.getViewData();
			self.oCoreApi = oViewData.oCoreApi;
			self.oUiApi = oViewData.uiApi;
			var oTemplateNew = new StandardListItem({
				id : this.createId("idAnalysisPathMenuNewAnalysisPath"),
				icon : 'sap-icon://add-product',
				type : ListType.Active,
				title : self.oCoreApi.getTextNotHtmlEncoded("new"),
				press : function() {
					self.getParent().close();
					self.oUiApi.getLayoutView().setBusy(true);
					oController.getNewAnalysisPathDialog();
					self.oUiApi.getLayoutView().setBusy(false);
				}
			});
			var oTemplateOpen = new StandardListItem({
				id : this.createId("idAnalysisPathMenuOpenAnalysisPath"),
				icon : "sap-icon://open-folder",
				type : ListType.Active,
				title : self.oCoreApi.getTextNotHtmlEncoded("open"),
				press : function() {
					oController.bIsPathGalleryWithDelete = false;
					self.oUiApi.getLayoutView().setBusy(true);
					self.getParent().close();
					oController.onOpenPathGallery(oController.bIsPathGalleryWithDelete);
				}
			});
			var oTemplateSave = new StandardListItem({
				id : this.createId("idAnalysisPathMenuSaveAnalysisPath"),
				icon : "sap-icon://save",
				type : ListType.Active,
				title : self.oCoreApi.getTextNotHtmlEncoded("save"),
				press : function() {
					self.getParent().close();
					oController.onSaveAndSaveAsPress(false);
				}
			});
			var oTemplateSaveAs = new StandardListItem({
				id : this.createId("idAnalysisPathMenuSaveAnalysisPathAs"),
				icon : "sap-icon://save",
				type : ListType.Active,
				title : self.oCoreApi.getTextNotHtmlEncoded("savePathAs"),
				press : function() {
					self.getParent().close();
					oController.onSaveAndSaveAsPress(true);
				}
			});
			var oTemplateDelete = new StandardListItem({
				id : this.createId("idAnalysisPathMenuDeleteAnalysisPath"),
				icon : "sap-icon://delete",
				type : ListType.Active,
				title : self.oCoreApi.getTextNotHtmlEncoded("delete"),
				press : function() {
					oController.bIsPathGalleryWithDelete = true;
					self.getParent().close();
					self.oUiApi.getLayoutView().setBusy(true);
					oController.openPathGallery(oController.bIsPathGalleryWithDelete);
				}
			});
			var oTemplatePrint = new StandardListItem({
				id : this.createId("idAnalysisPathMenuPrintAnalysisPath"),
				icon : "sap-icon://print",
				type : ListType.Active,
				title : self.oCoreApi.getTextNotHtmlEncoded("print"),
				press : function() {
					self.getParent().close();
					oController.doPrint();
				}
			});
			this.oActionListItem = new List({
				items : [ oTemplateNew, oTemplateOpen, oTemplateSave, oTemplateSaveAs, oTemplateDelete, oTemplatePrint ]
			});
			return this.oActionListItem;
		}
	});
});