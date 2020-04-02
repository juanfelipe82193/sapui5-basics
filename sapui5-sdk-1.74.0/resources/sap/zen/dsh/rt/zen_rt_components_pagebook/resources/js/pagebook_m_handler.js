define("zen.rt.components.pagebook/resources/js/pagebook_m_handler", ["sap/zen/basehandler"], function(BaseHandler){

	var dispatcher = BaseHandler.dispatcher;

var PagebookHandler = function() {
	"use strict";

	BaseHandler.apply(this, arguments);

	var that = this;

	this.create = function(oChainedControl, oControlProperties) {
		var id = oControlProperties.id;
		var oPagebook = new sap.m.Carousel(id);
		init(oPagebook, oControlProperties);
		if(sap.zen.designmode){
		oPagebook.addStyleClass("zenborder");
		}
		
		if(oControlProperties.command){
			oPagebook.attachPageChanged(function(e){
				var newId = e.getParameters().newActivePageId;
				var aPages = this.getPages();
				var iIndex = 0;
				for ( var i = 0; i < aPages.length; i++) {
					if(aPages[i].sId === newId){
						iIndex = i;
						break;
					}
				}
				var command = that.prepareCommand(oControlProperties.command,"__KEY__", iIndex);
				eval(command);
			})
		}
		return oPagebook;
	};
	
	this.update = function(oControl, oControlProperties) {
		init(oControl, oControlProperties);
		return oControl;
	};

	function init(oPagebook, oControlProperties) {
		
		if (oControlProperties) {
			
			oPagebook.setShowPageIndicator(!!oControlProperties.showpageindicator);
			
			var aChildren = oControlProperties.content;
			if (aChildren) {
				that.updateChildren(aChildren, oPagebook, function(oPage, i) {
					oPagebook.insertPage(oPage, i);
				}, function(oPageToDelete) {
					oPagebook.removePage(oPageToDelete);
				});
			}
			oPagebook.setActivePage(oPagebook.getPages()[oControlProperties.selectedpageindex]);
		}

	}


	this.applyForChildren = function(oPagebook, fFunclet) {
		var children = oPagebook.getPages();
		for ( var i = 0; i < children.length; i++) {
			var oControl = children[i];
			if (oControl) {
				fFunclet(oControl);
			}
		}
	};
	
	this.getType = function() {
		return "pagebook";
	};
	
	this.getDecorator = function() {
		return "GroupDecorator";
	};

};

// //////////////////////////////////////////////////////

var PageHandler = function() {
	"use strict";

	BaseHandler.apply(this, arguments);

	var dispatcher = BaseHandler.dispatcher;
	var that = this;

	
	this.create = function(oChainedControl, oControlProperties) {
		var controlId = oControlProperties["id"];

		var oControl = this.createAbsoluteLayout(controlId);
		init(oControl, oControlProperties);
		
		return oControl;
	};
	
	this.update = function(oControl, oControlProperties){
		init(oControl, oControlProperties);
	}

	function init(oControl, oControlProperties) {
		if (oControlProperties) {

			var oAbsLayout = oControl;

			var aChildren = oControlProperties.content;

			if (aChildren) {
				that.updateChildren(aChildren, oControl, function(oNewControl, iIndex, componentData) {
					// workaround: set width & height here
					//otherwise absolute layout container will be renderedd twice
					if(componentData){
						var args = dispatcher.createAbsoluteLayoutInfo(componentData);
						var width = dispatcher.calcWidthUseOrderOfPriority(args.left, args.right, componentData.width);
						var height = dispatcher.calcHeightUseOrderOfPriority(args.top, args.bottom, componentData.height);
						dispatcher.setWidthHeight(oNewControl, width, height);
					}
					dispatcher.insertIntoAbsoluteLayoutContainer(oAbsLayout, oNewControl, iIndex);
				}, function(oControlToRemove){
					oAbsLayout.removeContent(oControlToRemove);
				});
				oControl.zenPageUpdated = true;
			}

		}
	}

	this.applyForChildren = function(oPage, fFunclet) {
		var children = oPage.getContent();
		for ( var i = 0; i < children.length; i++) {
			var oControl = children[i];
			if (oControl) {
				fFunclet(oControl);
			}
		}
	};


};

var PagebookHandlerInstance = new PagebookHandler();
var PageHandlerInstance = new PageHandler();

var PageDecorator = function(decoratorManager, phxControl) {
	this.iRelativeLevel = 1; // Ensure that we are placed inside of parent Group decorator

	sap.zen.designmode.Decorator.apply(this, arguments);
	sap.zen.designmode.GroupDecorator.apply(this, arguments);
	sap.zen.designmode.ContainerDecorator.apply(this, arguments);
	this._debugInfo = "PageDecorator";

	this.showAdorner = function() {
		if(decoratorManager.decoratorMultiSelectLength() > 1){
			return this.jqDecorator;
		}
		
		var pageBook = phxControl.getParent();
		pageBook.setActivePage(this.getPhxControl());
	};
	
	this.updateAdornerVisualisation = function(){
		this.showAdorner();
	};

	var super_visible = this.visible;
	this.visible = function(bSetVisile) {
		var pageBook = phxControl.getParent();
		super_visible.call(this, bSetVisile && (pageBook.getActivePage() === this.getPhxControl().sId));
	};

};

dispatcher.addHandlers("page", PageHandlerInstance, PageDecorator);

return PagebookHandlerInstance;

});
