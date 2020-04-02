/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/* global document, window*/
/**
 *@class carousel.view
 *@name carousel.view
 *@memberOf sap.apf.ui.reuse.view
 *@description Layout holds Analysis Steps
 *@returns {carousel.view}
 */
sap.ui.define([
	"sap/apf/ui/utils/constants",
	"sap/m/CustomListItem",
	"sap/m/List",
	"sap/m/ListType",
	"sap/m/Button",
	"sap/m/ScrollContainer"
], function(Constants, CustomListItem, mList, mListType, mButton, mScrollContainer) {
	'use strict';

	var view = sap.ui.jsview("sap.apf.ui.reuse.view.carousel", {

		/**
		 * List event handler: when a list item is selected in the path. Identify it and set it active,
		 * and render it in the main chart.
		 * The list and index of steps in oCustomItemList and the path must be consistent and equal.
		 * @param event
		 */
		onListItemPressed: function(event){
			this.getController().listItemPressed(event);
		},
		createCustomListItem: function(oChart) {
			var oCustomListItem = new CustomListItem({
				content: oChart,
				type : mListType.Active,
				press: this.onListItemPressed.bind(this)
			});
			oCustomListItem.addEventDelegate({
				onAfterRendering : function() {
					var oScrollContainer = this.getViewData().analysisPath.oCarousel.getContent()[0];
					var nItems = this.getViewData().analysisPath.oCarousel.getCustomItemList().length;
					var ocustomListItem = this.getViewData().analysisPath.oCarousel.getCustomItemList()[nItems-1];
					oScrollContainer.scrollToElement(ocustomListItem.getDomRef());
				}},this);
			return oCustomListItem;
		},
		/**
		 * Wrap the chart into a custom list item and add it to the list control.
		 * @param oCustomListItem
		 * @return {sap.m.CustomListItem} the item
		 */
		addCustomListItem: function(oCustomListItem) {
			this.oCustomItemList.addItem(oCustomListItem);
		},
		/**
		 * Delegate the event handled to the controller.
		 * @param event
		 */
		onDeleteCustomListItem : function(event) {
			this.getController().deleteCustomListItem(event.getParameters().listItem.sId);
		},
		/**
		 * Get the Items
		 * @returns {Array}
		 */
		getCustomItemList : function(){
			return this.oCustomItemList.getItems();
		},
		removeCustomItem : function(index){
			return this.oCustomItemList.removeItem(index);
		},
		insertCustomItem : function(customListItem, index){
			return this.oCustomItemList.insertItem(customListItem, index);
		},
		/**
		 *@memberOf sap.apf.ui.reuse.view.carousel
		 *@method getStepGallery
		 *@see sap.apf.ui.reuse.view.stepGallery
		 *@return {sap.apf.ui.reuse.view.stepGallery}
		 */
		getStepGallery : function() {
			return this.stepGalleryView;
		},
		oldCarouselContent : function(oController) {
		},
		getAddStepButton : function() {
			return this.addStepButton;
		},
		createCarouselContent : function(oController) {
			var that = this;
			/**
			 * Handles Event
			 * Add a new step at the end of the path. It gets the active step and it will be displayed in the main chart.
			 * Then update the path display.
			 * @type {sap.m.Button}
			 */
			this.addStepButton = new mButton({
				id : oController.createId("idAddAnalysisStepButtonInFooter"),
				//text : that.oCoreApi.getTextNotHtmlEncoded("add-step"),
				tooltip : that.oCoreApi.getTextNotHtmlEncoded("add-step"),
				icon : "sap-icon://add",
				press : function(evt) {
					oController.showStepGallery();
				}
			});
			this.moveUpButton = new mButton({
				id: oController.createId("idMoveStepUpButtonInFooter"),
				icon: "sap-icon://arrow-top",
				tooltip: that.oCoreApi.getTextNotHtmlEncoded("moveStepUp"),
				enabled: false,
				press : function(evt) {
					oController.handleMove({
						down : false
					});
				}
			});
			this.moveDownButton = new mButton({
				id: oController.createId("idMoveStepDownButtonInFooter"),
				icon: "sap-icon://arrow-bottom",
				tooltip: that.oCoreApi.getTextNotHtmlEncoded("moveStepDown"),
				enabled: false,
				press : function(evt) {
					oController.handleMove({
						down : true
					});
				}
			});
			// });
			/**
			 * Is the list of items that represent the path. Each item is a chart reduced in size.
			 * @type {sap.m.List}
			 */
			this.oCustomItemList = new mList({ // list for custom list items
				id: "stepList",
				mode: "Delete",
				delete: function(evt){
					that.onDeleteCustomListItem(evt);
				}
			});
			/**
			 * Wraps the list which represents the path.
			 * @type {null}
			 */
			this.oCarousel = new mScrollContainer({
				content : this.oCustomItemList,
				horizontal : false,
				vertical : true
			}).addStyleClass("scrollContainerEle");
			this.stepGalleryView = that.oUiApi.getStepGallery();
			return this.oCarousel;
		},
		getControllerName : function() {
			return "sap.apf.ui.reuse.controller.carousel";
		},
		createContent : function(oController) {
			var oViewData = this.getViewData().oInject;
			this.oController = oController;
			this.oCoreApi = oViewData.oCoreApi;
			this.oUiApi = oViewData.uiApi;
			return this.createCarouselContent(oController);
		}
	});
	return view;
});