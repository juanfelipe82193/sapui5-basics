define("zen.rt.components/resources/js/absolutelayout_handler", ["sap/zen/basehandler"], function(BaseHandler) {
	"use strict";

		var AbsoluteLayoutHandler = function() {
		
			BaseHandler.apply(this, arguments);
		
			var dispatcher = BaseHandler.dispatcher;
		
			var that = this;
		
	
			function init (oAbsLayout, oControlProperties) {
				var aChildren = oControlProperties.content;
				
				if(oControlProperties.newurl){
					if(oControlProperties.newurl.length && oControlProperties.newurl.length >= 8 && oControlProperties.newurl.substring(0,7) === "mailto:"){
					window.location = oControlProperties.newurl;
					} else {
						if(sapbi_Mobile && (sapbi_Mobile.mobi.iPad || sapbi_Mobile.mobi.iPhone)){
							var mobiPrefix = "mobi://openNewWindow?url=";
							var encodedUrl = encodeURIComponent(oControlProperties.newurl);
							var mobiOpenUrl = mobiPrefix + encodedUrl;
							//MOBI has an issue with window.open calls. Blocked by iOS. Update this window.open when MOBI fix issue on their side. 
							window.location.href=mobiOpenUrl;
				}
				else{
							window.open(oControlProperties.newurl);
						}
					}
				}

				if(oControlProperties.afterRendering){
					eval(oControlProperties.afterRendering);
				}
		
				if(oControlProperties.loadingIndicatorDelay){
					sap.zen.getLoadingIndicator().setDelay(oControlProperties.loadingIndicatorDelay);
				}
		
				if (aChildren) {

					that.updateChildren(aChildren, oAbsLayout, function (oNewControl, iIndex) {
						dispatcher.insertIntoAbsoluteLayoutContainer(oAbsLayout, oNewControl, iIndex);
					}, function (oControlToDelete) {
						oAbsLayout.removeContent(oControlToDelete);
					});
		
				}
					
					}
				
			this.addD4LClasses = function(oAbsLayout){
				oAbsLayout.addStyleClass("designmodeborder");
			};
			
			this.rootNeedsToBeDropEnabled = function(oDispatcher) {
				// we need a drop-enabled ROOT_absolutelayout if we have at least one Crosstab with D&D enabled!
				// Otherwise, dragging something outside of the Crosstab (not on another component), e. g. to remove
				// a dimension from the drilldown, will not work.	
				var aComponentIds, i, sComponentId, oControl, bHasDDEnabledCrosstab = false;
				
				if (oDispatcher) {
					aComponentIds = oDispatcher.getComponentIds();
					for (i = 0; i < aComponentIds.length && !bHasDDEnabledCrosstab; i++) {
						sComponentId = aComponentIds[i];
						oControl = oDispatcher.getControlForId(sComponentId);
						if (oControl && oControl.zenControlType && oControl.zenControlType === "xtable") {
							bHasDDEnabledCrosstab = oControl.getPropertyBag().isDragDropEnabled();
						}
					}
				}
				return bHasDDEnabledCrosstab;
			};
			
			this.createAndAdd = function (oChainedControl, oControlProperties, oComponentProperties, fAppendToParentFunclet) {
				
				var id = oControlProperties["id"];
				var oAbsLayout = this.createAbsoluteLayout(id);
				oAbsLayout.addStyleClass("zenborder");
				this.addD4LClasses(oAbsLayout);
				fAppendToParentFunclet(oAbsLayout, oComponentProperties);
				init(oAbsLayout, oControlProperties);
				
				if (id === "ROOT_absolutelayout") {
						if (this.rootNeedsToBeDropEnabled(dispatcher) === true) {
							oAbsLayout.fOrigOnAfterRendering = oAbsLayout.onAfterRendering;
							oAbsLayout.fOrigDestroy = oAbsLayout.destroy;
		
							oAbsLayout.destroy = function () {
								$(document.getElementById(this.getId())).droppable("destroy");
								if (this.fOrigDestroy) {
									this.fOrigDestroy();
								}
							};
		
							oAbsLayout.onAfterRendering = function () {
								if (this.fOrigOnAfterRendering) {
									this.fOrigOnAfterRendering();
								}
								$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-core');
								$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-widget');
								$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-mouse');
								$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-draggable');
								$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-droppable');
								$(document.getElementById(this.getId())).droppable({
									greedy: true,
		
									accept: function () {
										return true;
									},
		
									drop: function (e, ui) {
										if (!e.buttons) {
											// avoid jQuery sortable logic to send a "drop" when sortable
											// is removed from list by just dragging, i. e. without the user
											// releasing the mouse button and hence triggering a "real" drop
											dispatcher.onUnhandledDrop(e, ui);
										}
									}
								});
							};
						}
				}
		
				return oAbsLayout;
			};
		
			this.updateComponent = function (oControl, oControlProperties) {
				if (oControlProperties) {
					init(oControl, oControlProperties);
				}
				return oControl;
			};
		
			this.applyForChildren = function (absLayout, funclet) {
				var positionContainers = absLayout.getPositions();
				for ( var i = 0; i < positionContainers.length; i++) {
					var oControl = positionContainers[i].getControl();
					if (oControl) {
						var result = funclet(oControl);
						if (result)
							return result;
					}
				}
				return null;
			};
			
			this.getDecorator = function() {
				return "RootDecorator";
			};
			
			this.getType = function() {
				return "absolutelayout";
			};
		

		};
return new AbsoluteLayoutHandler();
	
});

