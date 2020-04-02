/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/**
 *@class analysisPath
 *@name analysisPath
 *@memberOf sap.apf.ui.reuse.view
 *@description Layout holds title of Analysis Path, saved path name, Toolbar and Carousel
 *@returns  {AnalysisPath}
 */
sap.ui.define([
	'sap/m/Popover',
	'sap/m/PlacementType',
	'sap/m/ObjectHeader',
	'sap/ui/layout/VerticalLayout',
	'sap/ui/core/mvc/ViewType'
], function(Popover, PlacementType, ObjectHeader, VerticalLayout, ViewType) {
	"use strict";

	return sap.ui.jsview("sap.apf.ui.reuse.view.analysisPath", {
		/**
		 *@this {sap.apf.ui.reuse.view.analysisPath}
		 *@description anlaysisPath view
		 */
		/**
		 * @method getCarouselView
		 * @returns {sap.apf.ui.reuse.view.carousel}
		 * @memberOf sap.apf.ui.reuse.view.analysisPath
		 * @see sap.apf.ui.reuse.view.carousel
		 *  KLS why no returns directive in the JSDOC. I also would propose to rename to getCarouselView TODO
		 */
		getCarouselView : function() {
			return this.oCarousel;
		},
		/**
		 *@method getToolbar
		 *@see sap.apf.ui.reuse.view.analysisPath
		 *@memberOf sap.apf.ui.reuse.view.analysisPath
		 */
		getToolbar : function() {
			return this.oActionListItem;
		},
		/**
		 *@method getPathGallery
		 *@memberOf sap.apf.ui.reuse.view.analysisPath
		 */
		getPathGallery : function() {
			return this.pathGallery;
		},
		/**
		 *@method getPathGalleryWithDeleteMode
		 *@memberOf sap.apf.ui.reuse.view.analysisPath
		 */
		getPathGalleryWithDeleteMode : function() {
			return this.deleteAnalysisPath;
		},
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.analysisPath";
		},
		createContent : function(oController) {
			var self = this;
			this.oController = oController;
			this.oActionListPopover = new Popover({
				id : this.createId("idAnalysisPathMenuPopOver"),
				showHeader : false,
				placement : PlacementType.Bottom,
				contentWidth : "165px"
			});
			var oViewData = this.getViewData();
			self.oCoreApi = oViewData.oCoreApi;
			self.oUiApi = oViewData.uiApi;
			this.oActionListItem = self.oUiApi.getToolbar().addStyleClass("toolbarView");
			this.oActionListPopover.addContent(this.oActionListItem);
			this.oSavedPathName = new ObjectHeader({
				title : this.oCoreApi.getTextNotHtmlEncoded("unsaved"),
				showTitleSelector : true,
				condensed : true,
				responsive : true,
				fullScreenOptimized : true,
				tooltip : this.oCoreApi.getTextNotHtmlEncoded("unsaved"),
				titleSelectorPress : function(oEvent) {
					self.oActionListPopover.openBy(oEvent.getParameter("domRef"));
				}
			}).addStyleClass("sapApfObjectHeader sapUiContainer-Narrow");
			//accessing private variable to change the icon in the object header title selector, since there is no API for it.
			if (this.oSavedPathName._oTitleArrowIcon) {
				this.oSavedPathName._oTitleArrowIcon.setSrc("sap-icon://drop-down-list");
			}
			this.oCarousel = self.oUiApi.createCarouselSingleton();
			this.oCarousel.getViewData().analysisPath = self;
			this.pathGallery = self.oUiApi.getPathGallery();
			this.deleteAnalysisPath = self.oUiApi.getDeleteAnalysisPath();
			this.oAnalysisPath = new VerticalLayout({
				content : [ self.oContentTitle, self.oSavedPathName, self.oCarousel ],
				width : '100%'
			});
			return this.oAnalysisPath;
		}
	});
});