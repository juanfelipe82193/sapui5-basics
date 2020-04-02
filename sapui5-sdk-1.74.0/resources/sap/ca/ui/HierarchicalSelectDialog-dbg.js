/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2014 SAP SE. All rights reserved
 */

// Provides control sap.ca.ui.HierarchicalSelectDialog.
jQuery.sap.declare("sap.ca.ui.HierarchicalSelectDialog");
jQuery.sap.require("sap.ca.ui.library");
jQuery.sap.require("sap.m.Dialog");


/**
 * Constructor for a new HierarchicalSelectDialog.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given 
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * Select an item in a dialog from a hierarchical list
 * @extends sap.m.Dialog
 *
 * @author Bruno Vicente
 *
 * @constructor
 * @public
 * @deprecated Since version 1.24.1. 
 * HierarchicalSelectDialog is deprecated as per central UX requirements. This control will not be supported anymore.
 * @name sap.ca.ui.HierarchicalSelectDialog
 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
 */
sap.m.Dialog.extend("sap.ca.ui.HierarchicalSelectDialog", /** @lends sap.ca.ui.HierarchicalSelectDialog.prototype */ { metadata : {

	deprecated : true,
	library : "sap.ca.ui",
	defaultAggregation : "items",
	aggregations : {

		/**
		 * Type checker, only HierarchicalSelectDialogItem are allowed. Please do NOT use the "content" aggregation of the dialog
		 */
		items : {type : "sap.ca.ui.HierarchicalSelectDialogItem", multiple : true, singularName : "item"}
	},
	events : {

		/**
		 * Thrown when user selects an item
		 */
		select : {}, 

		/**
		 * Thrown when user clicks cancel
		 */
		cancel : {}
	}
}});

jQuery.sap.require("sap.ca.ui.utils.resourcebundle");
jQuery.sap.require("sap.m.NavContainer");

sap.ca.ui.HierarchicalSelectDialog.prototype.init = function() {

	sap.m.Dialog.prototype.init.apply(this);
    this.addStyleClass("sapCaUiHSD");

	// internal Navigation Container
	this._oNavContainer = new sap.m.NavContainer(this.getId() + 'hsAppContainer', {
		pages : []
	});
	this._pageIdx = 0;

	sap.m.Dialog.prototype.addContent.apply(this, [this._oNavContainer]);

	// create Cancel button
	this.setEndButton(new sap.m.Button({
		text : sap.ca.ui.utils.resourcebundle.getText("hsd.cancelButton"),
		press : jQuery.proxy(function() {

			// close the ResponsivePopover
			this.close();

			// fire cancel event
			this.fireCancel();
		}, this) ,
        width: "100%"
	}));

	this.setShowHeader(false);
	this.setContentWidth('250px');
	this.setContentHeight('350px');

    // "beforeOpen", "afterClose" and "beforeClose" does *NOT* work
    // because the transition never ends and then the NavContainer is
    // in a instable state
    this.attachAfterOpen(function(){

        this._oNavContainer.backToTop();

        // iterate through every pages to clean the search
        var aPages = this._oNavContainer.getPages();
        var i;
        for (i = 0; i < aPages.length; ++i){
            var page = aPages[i];
            var oSearchField = sap.ui.getCore().byId(page.getId()+"-searchfield");
            if (oSearchField){
                oSearchField.clear();
            }
        }
    });
};


/**
 * "content" is an aggregation of the ResponsivePopover, we override it to add the content
 * the "items" aggregation but only if the instance is a @see sap.ca.ui.HierarchicalSelectDialogItem
 *
 * Otherwise nothing is done
 *
 * @override
 *
 * @param oContent
 */
sap.ca.ui.HierarchicalSelectDialog.prototype.addContent = function(oContent) {
	if (oContent instanceof sap.ca.ui.HierarchicalSelectDialogItem) {
		this.addItem(oContent);
	} else {
		jQuery.sap.log.error("Only sap.ca.ui.HierarchicalSelectDialogItem are authorized in HierarchicalSelectDialog, also please use the items aggregation");
	}
};

sap.ca.ui.HierarchicalSelectDialog.prototype.addItem = function(oItem) {
	this.insertItem(oItem, this.getItems().length);
};

/**
 * When adding a new item to the aggregation, a sap.m.Page is actually created
 * with its own ID and added to the internal NavContainer.
 *
 * This method calls @see _getPageContent() to build the page content
 *
 * Unless it is the first page, a back button is added
 *
 * @override
 *
 * @param oItem
 * @returns this
 */
sap.ca.ui.HierarchicalSelectDialog.prototype.insertItem = function(oItem, iIndex) {
	// Read the content to parse the HierarchicalSelectDialogItem
	// Generate the pages of the sap.m.App based on those item

	var pageId = this.getId() + "p" + this._pageIdx;
	var pageTitle = oItem.getTitle();
	var entityToBind = oItem.getEntityName();
	var itemTemplate = oItem.getListItemTemplate();
	var nextPageId = this.getId() + "p" + (this._pageIdx + 1);
	// Page Creation
	var list = this._getPageContent(pageId, nextPageId, entityToBind, itemTemplate);
	var page = new sap.m.Page(pageId, {
		title : pageTitle,
		content : list
	});

	var listData = new sap.ui.core.CustomData({
		key : 'list',
		value : list
	});

	var itemTemplateData = new sap.ui.core.CustomData({
		key : 'itemTemplate',
		value : itemTemplate
	});
	// create searchField
	page.setSubHeader(new sap.m.Bar({
		contentMiddle : [new sap.m.SearchField(page.getId() + "-searchfield", {
			placeholder : sap.ca.ui.utils.resourcebundle.getText("hsd.searchTextField"),
			width : "100%",
			liveChange : this._onSearchItem,
			customData : [listData, itemTemplateData]
		})]
	}));

	if (this._pageIdx != 0) {
		page.setShowNavButton(true);
		page.attachNavButtonPress(jQuery.proxy(this._onNavigateBack, this));
		page.onBeforeShow = function(oEvent) {
			jQuery.each(oEvent.data, function(modelName, context) {
				page.setBindingContext(context, modelName);
			});
		};
	}
    else{
        this._oNavContainer.setInitialPage(page);
    }
	if (this._pageIdx > 0) {
		var items = this.getItems();
		items[items.length - 1].getListItemTemplate().setType(sap.m.ListType.Navigation);
	}

	this._oNavContainer.addPage(page);
	this._pageIdx++;

    this.insertAggregation("items", oItem, iIndex);

	return this;
};

/**
 * Adds filter from the searchfield to the list. This is liveSearch (as you type)
 *
 * @param evt
 * @private
 */
sap.ca.ui.HierarchicalSelectDialog.prototype._onSearchItem = function(evt) {
	var searchValue = evt.getParameter("newValue");
	var itemTemplate = evt.getSource().data("itemTemplate");

    var aListItems = evt.getSource().data("list").getBinding("items");
	if (searchValue !== null && searchValue !== "") {
        var availableProperties = itemTemplate.getMetadata().getProperties();
        var aFilterList = [];
        jQuery.each(availableProperties, function(propName, propValue) {
            var bindingInfo = itemTemplate.getBindingInfo(propName);
            if(bindingInfo != null) {
                aFilterList.push(new sap.ui.model.Filter(bindingInfo.binding.getPath(), sap.ui.model.FilterOperator.Contains, searchValue));
             }
        });

		aListItems.filter(new sap.ui.model.Filter(aFilterList, false));
	}
    else {
        aListItems.filter(null);
    }
};

/**
 *
 * Takes the pageId and the nextPageId (for navigation purpose) and creates
 * a sap.m.List bound to the data defined by the user
 *
 * When clicking a item, the navigation is triggered
 *
 * @param pageId
 * @param nextPageId
 * @param entityToBind
 * @param itemTemplate
 * @returns {sap.m.List}
 * @private
 */
sap.ca.ui.HierarchicalSelectDialog.prototype._getPageContent = function(pageId, nextPageId, entityToBind, itemTemplate) {
	var list = new sap.m.List(pageId + "list");
	var data = new sap.ui.core.CustomData({
		key : 'pageId',
		value : nextPageId
	});

	itemTemplate.setType(sap.m.ListType.Active);

	itemTemplate.setIconInset(true);
	itemTemplate.attachPress(jQuery.proxy(this._onItemSelected, this));
	itemTemplate.addCustomData(data);
	list.bindItems(entityToBind, itemTemplate);

	return list;
};

/**
 * Navigates one page back
 *
 * @param channelId
 * @param eventId
 * @param data
 * @private
 */
sap.ca.ui.HierarchicalSelectDialog.prototype._onNavigateBack = function(channelId, eventId, data) {
	this._oNavContainer.back();
};

/**
 * Navigates to the next page
 *
 * @param evt
 * @private
 */
sap.ca.ui.HierarchicalSelectDialog.prototype._onItemSelected = function(evt) {
	var item = evt.getSource();
	var nextPageId = item.data("pageId");
	var nextPage = this._oNavContainer.getPage(nextPageId);
	if (nextPage) {
		//Show Selected Item Label in page header
		nextPage.setTitle(item.getTitle());
		//Navigate
		this._oNavContainer.to(nextPageId, "slide", item.oBindingContexts);
	}
    else {
		this.fireSelect({ selectedItem : item});
		this.close();
	}

};
