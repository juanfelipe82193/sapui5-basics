define("zen.rt.components.ui5/fragmentgallery/js/fragmentgallery", [], function() {
sap.ui.commons.Carousel.extend("com.sap.ip.bi.FragmentGallery",{

	initDesignStudio: function() {
		this.setAnimationDuration(100);
	},
	
	previousContentLength: {
		
	},

	renderer: {
	},	

	orientations: {
		HORIZONTAL : "horizontal",
		VERTICAL : "vertical"
	},	

	mode: {
		IMAGE : "image",
		TEXT : "text",
		IMAGETEXT : "imagetext"
	},	

	afterDesignStudioUpdate: function() {

		var defaultSize = this.getItemSize();

		if(this.orientation === this.orientations.HORIZONTAL) {
			this.removeStyleClass("zenFragmentGallery-Vertical");
			this.addStyleClass("zenFragmentGallery-Horizontal");

			if (defaultSize !== undefined) {
				this.setDefaultItemWidth(defaultSize);
			}
		} else {
			this.removeStyleClass("zenFragmentGallery-Horizontal");
			this.addStyleClass("zenFragmentGallery-Vertical");

			if (defaultSize !== undefined) {
				this.setDefaultItemHeight(defaultSize);
			}
		}

		this.setOrientation(this.orientation);
		
		this.addStyleClass("zenFragmentGallery");

		var galleryItems = this.items;

		if (!galleryItems || galleryItems.length === 0) {	// gallery has just been cleared  - initialize with a blank item which is not draggable
			this.destroyContent();
			var blankItem = this.createItem("", "", "");
			this.addContent(blankItem);
			this.setProperty("firstVisibleIndex", 0);
			this.previousContentLength = JSON.parse(galleryItems).length;// We need to set this manually as it is not reset automatically and  the carousels inherent setFirstVisibleIndex disallows this based on content length.
		} else {
			// Destroy old content
			this.destroyContent();
			var itemArray = JSON.parse(galleryItems);
			this.createItemContent(itemArray, this.oControlProperties.dragDrop);	// TODO possibly need to register dragging here instead
			this.refreshSelection();
			if (this.previousContentLength > JSON.parse(galleryItems).length && this.getFirstVisibleIndex()>0) {
				var contentLengthDifference = this.previousContentLength-JSON.parse(galleryItems).length;
				if(contentLengthDifference > 0){
					this.setProperty("firstVisibleIndex",this.getFirstVisibleIndex()-(contentLengthDifference));
				} else {
					this.setProperty("firstVisibleIndex",0);
				}
				
			}
			this.previousContentLength = JSON.parse(galleryItems).length;
			return this;
		}
		this.refreshSelection();
	},

	refreshSelection: function(){
		var content = this.getContent();
		for(var i = 0; i < content.length; i++) {
			var oLayout = content[i];

			if(oLayout.zenKey === this.selectedId) {
				oLayout.zenSelected = true;
			} else {
				oLayout.zenSelected = false;
			}

			if(oLayout.getDomRef() != null) {
				// dom ref is null if not yet rendered, then the setting onAfterRendering will change the selection
				if(oLayout.zenSelected) {
					$(oLayout.getDomRef().parentElement).addClass("selectedItem");	
				} else {
					$(oLayout.getDomRef().parentElement).removeClass("selectedItem");
				}
			}
		}
	},

	createItemContent: function(itemArray, dragEnabled){

		var galleryMode = this.getGalleryMode().toLowerCase();

		if (this.orientation === this.orientations.HORIZONTAL) {
			this.removeStyleClass("zenFragmentGallery-Vertical");
			this.addStyleClass("zenFragmentGallery-Horizontal");
		} else {
			this.removeStyleClass("zenFragmentGallery-Horizontal");
			this.addStyleClass("zenFragmentGallery-Vertical");
		}

		for (var i = 0; i < itemArray.length; i++ ) {
			var galleryItem;

			if (galleryMode === this.mode.IMAGE) {
				galleryItem = this.createItem(itemArray[i].key, itemArray[i].text, itemArray[i].image, "");
			} else if (galleryMode === this.mode.TEXT || galleryMode === this.mode.IMAGETEXT) {
				galleryItem = this.createItem(itemArray[i].key, itemArray[i].text, itemArray[i].image, itemArray[i].description);
			}

			if(dragEnabled) {
				var dragArea = new sap.zen.Dispatcher.instance.dragArea(galleryItem, "", {bmid:itemArray[i].key,title:itemArray[i].text}, null, null, null, null, null, null);
				sap.zen.Dispatcher.instance.dragHandlerInstance.registerDragArea(dragArea);
			}
			this.addContent(galleryItem);
		}
	},

	createImage: function(iKey, iText, iImage, options, description) {
		if (iImage === "" || iImage.indexOf("/aad/") === 0 || iImage.indexOf("http") === 0) {
			// use default blank image || use image from zen repository || keep as is, plain HTTP URL 
		} else {
			// image from application repository, use the passed URL to get prefix
			iImage = this.ImagePrefix + iImage;
		}

		options.src = iImage;
		options.alt = iText;

		if (description != null && description.length > 0) {
			options.tooltip = description;
		} else {
			options.tooltip = iText;
		}

		var oImage = new sap.ui.commons.Image(options);

		oImage.addStyleClass("zenFragmentGallery-Image-thumb");

		oImage.addDelegate({
			onAfterRendering: function(delegateData) {								
				jQuery(delegateData.srcControl.getFocusDomRef()).attr('draggable', 'false');
			}
		});	

		oImage.zenKey = iKey;	

		return oImage;
	},

	createText: function(iKey, iText, iImage, description) {
		var oText = new sap.ui.commons.TextView(this.sId + "txt-" +iKey,{
			text: iText,
			width: '100%',
			height: '100%',
			wrapping : true,
			enabled: true,
			visible: true,
			textAlign: sap.ui.core.TextAlign.Center,
			tooltip : description});		
		oText.zenKey = iKey;

		return oText;
	},

	// Used for horizontal and vertical gallery items
	createItem: function(iKey, iText, iImage, description){
		var that = this;

		var galleryItems = that.items;
		if (galleryItems) {
			var itemArray = JSON.parse(galleryItems);

			if (itemArray.length > 0 && itemArray[0].key === "ZEN_BLANK") {
				// Clear the blank item in the component which shows only in the Designer
				itemArray.splice(0,1);
				this.setItems(JSON.stringify(itemArray));
			}
		}

		var galleryMode = this.getGalleryMode().toLowerCase();

		var itemTooltip;
		if (galleryMode === this.mode.IMAGE) {
			itemTooltip = iText;
		} else {
			itemTooltip = description;
		}

		var oLayout = new sap.zen.commons.layout.AbsoluteLayout(this.sId + "ly-" + iKey,{
			width: '100%',
			height: '100%',
			tooltip: itemTooltip
		}).attachBrowserEvent('click', function() {
			that.setSelectedId(iKey);
			that.fireDesignStudioPropertiesChanged(["selectedId"]);
			that.fireDesignStudioEvent("onSelectionChange");}
		);

		var image, text;
		if (galleryMode === this.mode.IMAGE) {
			image = this.createImage(iKey, iText, iImage, {width:"80%", height:"80%"}, "");
			if (image != null) {
				oLayout.addContent(image);
				oLayout.zenImage = image;
				oLayout.addStyleClass("zenFragmentGallery-Image");
			}
		} else if (galleryMode === this.mode.TEXT) {
			text = this.createText(iKey, iText, iImage, description);
			if(text != null) {
				oLayout.addStyleClass("zenFragmentGallery-Txt");
				oLayout.addContent(text,{});
			}
		} else if (galleryMode === this.mode.IMAGETEXT) {
			oLayout.addStyleClass("zenFragmentGallery-ImgTxt");
			var imageLayout = new sap.zen.commons.layout.AbsoluteLayout(this.sId + "image" + iKey,{
				width: '50%',
				height: '100%'
			});
			var textLayout = new sap.zen.commons.layout.AbsoluteLayout(this.sId + "text" + iKey,{
				width: '50%',
				height: '100%'
			});

			image = this.createImage(iKey, iText, iImage, {width:"50%", height:"50%"}, description);
			text = this.createText(iKey, iText, iImage, description);
			imageLayout.addContent(image, {top:"25%",left:"25%"});
			textLayout.addContent(text);

			//DELETION
			var deleteIconImageGrey = new sap.ui.commons.Image({
				src: "zen.rt.components.ui5/fragmentgallery/images/delete/delete_normal.svg",
				visible: true
			});
			
			//Because IE doesnt like mouseover/out and webkit doesn't mind
			oLayout.attachBrowserEvent('mouseenter', function() {
				deleteIconImageGrey.setVisible(true);
			}).attachBrowserEvent('mouseleave', function() {
				deleteIconImageGrey.setVisible(false);
			});

			deleteIconImageGrey.attachBrowserEvent('mouseenter', function() {
				deleteIconImageGrey.setVisible(true);
				deleteIconImageGrey.setSrc("zen.rt.components.ui5/fragmentgallery/images/delete/delete_hover.svg");
			});
			deleteIconImageGrey.attachBrowserEvent('mouseleave', function() {
				deleteIconImageGrey.setSrc("zen.rt.components.ui5/fragmentgallery/images/delete/delete_normal.svg");
			});

			deleteIconImageGrey.attachPress(function() {	
				that.setSelectedId(iKey);
				that.fireDesignStudioPropertiesChanged(["selectedId"]);
				that.fireDesignStudioEvent("onDeletion");	
				// Remove the current Viz Gallery element
			});

			//DELETION

			oLayout.addContent(imageLayout,{left:"0px"}).addContent(textLayout,{right:"0px"});

			if(iKey !== "" && this.oControlProperties.deletionAllowed) {
				textLayout.addContent(deleteIconImageGrey, {right: "0px"});
				deleteIconImageGrey.setVisible(false);
			}
			oLayout.zenImage = image;
		}

		oLayout.onAfterRendering = function () {
			// Only on first-time render of the layout, then refreshSelection() takes over
			if (oLayout.zenSelected) {
				$(oLayout.getDomRef().parentElement).addClass("selectedItem");	
			} else {
				$(oLayout.getDomRef().parentElement).removeClass("selectedItem");
			}
		};

		oLayout.layoutID = this.sId + "ly-" + iKey;
		oLayout.zenKey = iKey;
		oLayout.zenText = iText;
		oLayout.zenURL = iImage;

		return oLayout;
	},	

	createImageLayout: function(item){
		var that = this;

		if (item != null) {
			var oItemLayout = new sap.zen.commons.layout.AbsoluteLayout(this.sId + "ly-" + item.key,{
				width: '45%',
			}).attachBrowserEvent('click', function() {
				that.setSelectedId(item.key);
				that.fireDesignStudioPropertiesChanged(["selectedId"]);
				that.fireDesignStudioEvent("onSelectionChange");}
			);

			var oImage = this.createImage(item.key, item.text, item.image, {width:"100%", height:"100%"}, "");
			oItemLayout.addContent(oImage);
			oItemLayout.addStyleClass("hover");



			oItemLayout.onAfterRendering = function () {
				// Only on first-time render of the layout, then refreshSelection() takes over
				if(oItemLayout.zenSelected){
					$(oItemLayout.getDomRef().parentElement).addClass("selectedItem");	
				} else {
					$(oItemLayout.getDomRef().parentElement).removeClass("selectedItem");
				}
			};

			oItemLayout.zenKey = item.key;
			oItemLayout.zenText = item.text;

			return oItemLayout;
		}
	},

	//three modes - image, imagetext, text
	setGalleryMode: function(value) {
		value = value.toLowerCase();
		if (value === "") {
			value = this.mode.IMAGE;
		}

		if (this.galleryMode !== value) {
			this.galleryMode = value;
		}
	},

	setItems: function(value) {
		if (this.items === value) {
			return;
		} else {
			this.items = value;
		}
	},

	getItems: function() {
		return this.items;
	},

	removeItem: function (iKey) {
		if (this.itemKeyExists(iKey)) {
			var items = this.items;
			var itemArray = JSON.parse(items);
			for (var i = 0; i < itemArray.length; i++) {
				if (itemArray[i].key === iKey){
					this.setDeletionKey(itemArray[i].key);
				}
			}
			this.setItems(JSON.stringify(itemArray));

			this.fireDesignStudioPropertiesChanged(["deletionKey"]);
		}
	},

	itemKeyExists: function(iKey) {
		if (this.items !== undefined){
			var itemArray = JSON.parse(this.items);
			for (var i = 0; i < itemArray.length; i++) {
				if (itemArray[i].key === iKey){
					return true;
				}	
			}
		}
		return false;
	},

	getGalleryMode: function() {
		return this.galleryMode.toLowerCase();
	},

	getItemSize: function() {
		return this.itemSize;
	},

	setItemSize: function(value) {		
		this.itemSize = value;
	},

	setImageUrl: function(value) {
		this.ImageUrl = value;
		this.ImagePrefix = this.ImageUrl.substring(0, this.ImageUrl.indexOf("DUMMY.PNG"));
	},

	getImageUrl: function() {
		return this.ImageUrl;
	},

	setGalleryOrientation: function(value) {
		if (!value) {
			value = this.orientations.HORIZONTAL;
		}
		this.orientation = value;
	},

	getGalleryOrientation: function() {
		return this.orientation;
	},

	setSelectedId: function(value) {		
		if (value) {
			this.selectedId = value;
		}
	},

	getSelectedId: function() {
		return this.selectedId;
	},

	selectedIdExists: function(iKey) {
		var that = this;
		var content = that.getContent();
		for (var i = 0; i < content.length; i++) {
			if (content[i].zenKey === iKey){
				return true;
			}
		}

		return false;
	},

	setDeletionKey: function(value) {
		if (value == null){
			value = "";
		}
		this.deletionKey = value;	
	},

	getDeletionKey: function() {
		if (this.deletionKey == null || this.deletionKey === undefined){
			return "";
		}

		return this.deletionKey;
	},

	// Add a 10px gap to right / bottom if the last item visible, so that it isn't truncated as in the Carousel
	updateLastItemStyle: function() {			
		var mAnimationArguments_margin = {};
		var contentarea = $(document.getElementById(this.sId + "-contentarea"));
		var sapCrslScl = $(document.getElementById(this.sId + "-scrolllist"));

		var margins = 10;	// px
		var i, contentBarSize, numVisibleItems;


		if (this.orientation === this.orientations.HORIZONTAL) {	
			for (i = 0; i < this.getContent().length; i++) {
				var childWidth;
				try {
					childWidth = this.getContent()[i].getWidth();
					if (childWidth.substr(-1) === "%") {
						childWidth = this.getItemSize();
					}
				} catch (e) {
					childWidth = this.getItemSize();
				}
			}

			var	maxWidth = Math.max(0, parseInt(childWidth, margins));
			var thisWidth = Math.floor(this.getDomRef().clientWidth);
			contentBarSize = thisWidth - this.getHandleSize() * 2 - 1;

			numVisibleItems = this.getVisibleItems();
			if (numVisibleItems === 0) {
				numVisibleItems = Math.floor(contentBarSize / maxWidth);
			}

			// Get width: if the width of every items +  10px margin-top + 22px button < width of contentarea, don't append margin-left - all items are visible already
			var contentareaWidth = contentarea.width();
			var visibleGalleryItemsWidth = ( (this._iMaxWidth * numVisibleItems) + (numVisibleItems * margins) );

			if ((visibleGalleryItemsWidth + margins) > contentareaWidth) {
				if(this.getFirstVisibleIndex() === 0){
					mAnimationArguments_margin["margin-left"] = 0;
				} else {
				mAnimationArguments_margin["margin-left"] = -((visibleGalleryItemsWidth + margins) - contentareaWidth);
				}
			}
		} else {
			for (i = 0; i < this.getContent().length; i++) {
				var childHeight;
				try {
					childHeight = this.getContent()[i].getHeight();
					if (childHeight.substr(-1) === "%") {
						childHeight = this.getItemSize();
					}
				} catch (e) {
					childHeight = this.getItemSize();
				}
			}

			var	maxHeight = Math.max(0, parseInt(childHeight, margins));
			var thisHeight = Math.floor(this.getDomRef().clientHeight);
			contentBarSize = thisHeight - this.getHandleSize() * 2 - 1;

			numVisibleItems = this.getVisibleItems();
			if (numVisibleItems === 0) {
				numVisibleItems = Math.floor(contentBarSize / maxHeight);
			}

			this._iMaxHeight = contentBarSize / numVisibleItems;

			// Get height: if the height of every item + 10px margin-bottom + 22px button < height of contentarea, don't append margin-bottom - all items are visible already
			var contentareaHeight = contentarea.height();
			var visibleGalleryItemsHeight = ( (this._iMaxHeight * numVisibleItems) + (numVisibleItems * margins) );

			if ((visibleGalleryItemsHeight + 10) > contentareaHeight) {
				if(this.getFirstVisibleIndex() === 0){
					mAnimationArguments_margin["margin-top"] = 0;
				} else {
					mAnimationArguments_margin["margin-top"] = -((visibleGalleryItemsHeight + margins) - contentareaHeight);
				}
			}
		}
		sapCrslScl.animate(mAnimationArguments_margin, this.getAnimationDuration());
	},

	// Override to stop looping scroll. 
	showPrevious: function() {
		if (this.getFirstVisibleIndex() > 0 && this.getContent()[this.getFirstVisibleIndex()] !== this.getContent()[0]) {
			var mAnimationArguments = {};
			mAnimationArguments[this._sAnimationAttribute] = 0;
			var $ScrollList = jQuery.sap.byId(this.getId() + '-scrolllist');

			if ($ScrollList.children('li').length < 2) {
				return;
			}

			$ScrollList.stop(true, true);
			$ScrollList.css(this._sAnimationAttribute, -this._iMaxWidth);
			var $lastItem = $ScrollList.children('li:last');
			var $firstItem = $ScrollList.children('li:first');
			this._showAllItems();
			$lastItem.insertBefore($firstItem);
			$ScrollList.append($lastItem.sapExtendedClone(true));
			var that = this;
			$ScrollList.children('li:last').remove();
			that.setProperty("firstVisibleIndex", that._getContentIndex($ScrollList.children('li:first').attr('id')), true);
			that._hideInvisibleItems();
			$ScrollList.animate(mAnimationArguments, this.getAnimationDuration());
		} 
	},
	
	// Override to stop looping scroll. 
	showNext: function() {
		// Calculate the number of currently visible items
		var margins = 10;	// px
		var thisWidth = {};
		var childWidth, i;
		if (this.orientation === this.orientations.HORIZONTAL) {	
			
			thisWidth = this.getDomRef().clientWidth;
			
			for (i = 0; i < this.getContent().length; i++) {
				try {
					childWidth = this.getContent()[i].getWidth();
					if (childWidth.substr(-1) === "%") {
						childWidth = this.getItemSize();
					}
				} catch (e) {
					childWidth = this.getItemSize();
				}
			}
		} else if (this.orientation === this.orientations.VERTICAL) {
			thisWidth = this.getDomRef().clientHeight;
			
			for (i = 0; i < this.getContent().length; i++) {
				try {
					childWidth = this.getContent()[i].getHeight();
					if (childWidth.substr(-1) === "%") {
						childWidth = this.getItemSize();
					}
				} catch (e) {
					childWidth = this.getItemSize();
				}
			}
		}

		var	maxWidth = Math.max(0, parseInt(childWidth, margins));
		
		var contentBarSize = thisWidth - this.getHandleSize() * 2 - 1;

		var numVisibleItems = this.getVisibleItems();

		if (numVisibleItems === 0) {
			numVisibleItems = Math.floor(contentBarSize / maxWidth);
		}

		
		if ((this.getFirstVisibleIndex() + numVisibleItems) < this.getContent().length) {	// showNext
			
			var mAnimationArguments = {};
			mAnimationArguments[this._sAnimationAttribute] = -this._iMaxWidth;
			var $ScrollList = jQuery.sap.byId(this.getId() + '-scrolllist');

			$ScrollList.stop(true, true);
			var sAnimationAttribute = this._sAnimationAttribute;
			var $firstItem = $ScrollList.children('li:first');
			var that = this;
			this._showAllItems();
			$firstItem.appendTo($ScrollList);
			$firstItem.sapExtendedClone(true).insertBefore($ScrollList.children('li:first'));

			$ScrollList.animate(mAnimationArguments, this.getAnimationDuration(), function() {
				$ScrollList.children('li:first').remove();
				jQuery(this).css(sAnimationAttribute, '0px');
				that.setProperty("firstVisibleIndex", that._getContentIndex($ScrollList.children('li:first').attr('id')), true);
				that._hideInvisibleItems();
			});
		} else {	// at the end, cannot scroll forward anymore; apply margin styling to last item
			this.updateLastItemStyle();
		}
	}

});
});
