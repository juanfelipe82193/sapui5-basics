define("zen.rt.components.crosstab/resources/js/crosstab_handler", ["sap/zen/basehandler"], function(BaseHandler){
	
	var CrosstabHandler = function() {
	    "use strict";
	    
	    sap.zen.crosstab = sap.zen.crosstab || {};
	    
	    sap.zen.crosstab.VHLP_STATUS_INACTIVE = 0;
	    
	    sap.zen.crosstab.VHLP_STATUS_OPENING = 1;
	    
	    sap.zen.crosstab.VHLP_STATUS_OK = 2;
	    
	    sap.zen.crosstab.VHLP_STATUS_CANCEL = 3;
	    
		BaseHandler.apply(this, arguments);
		
	    this.createAndAdd = function(oControl, oCrosstabControlProperties, oCrosstabComponentProperties, fAppendToParentFunclet, index) {
	        var oCrosstab = this.create(oControl, oCrosstabControlProperties, oCrosstabComponentProperties);
	        fAppendToParentFunclet(oCrosstab, index);
	        sap.zen.Dispatcher.instance.updateComponentProperties(oCrosstab, oCrosstabComponentProperties, fAppendToParentFunclet);
	        return oCrosstab;
	    };
	    
	    this.create = function(oChainedControl, oCrosstabControlProperties, oCrosstabComponentProperties) {
	    	// Drag and Drop support from jQuery
			$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-core');
			$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-widget');
			$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-mouse');
			$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-draggable');
			$.sap.require('sap.ui.thirdparty.jqueryui.jquery-ui-droppable');
			
	        var oCrosstab = new sap.zen.crosstab.Crosstab(oCrosstabComponentProperties.id);
	        oCrosstab.getPropertyBag().setMobileMode(sapbi_isMobile);
	        oCrosstab.getPropertyBag().setCozyMode(sap.zen.crosstab.utils.Utils.isCozyMode());
	        sap.zen.Dispatcher.instance.registerResizeHandler(oCrosstab, {
	            beginResize : function(e) {
					if (e && (oCrosstab.getWidth() === "auto" || oCrosstab.getHeight() === "auto")) {
						oCrosstab.resize(e);
						oCrosstab.renderResizeOutline();
					}
	            },
	            endResize : function(e) {
					if (e && (oCrosstab.getWidth() === "auto" || oCrosstab.getHeight() === "auto")) {
						oCrosstab.resize(e);
						oCrosstab.removeResizeOutline();
						oCrosstab.expectOnAfterRenderingCall();
						triggerCrosstabReRendering(oCrosstab);
					}
	            }
	        });
	        oCrosstab.applyControlProperties(oCrosstabControlProperties);
	        
	        return oCrosstab;
	    };
	    
	    this.getContextMenuAction = function(sContextMenuComponentId, oClickedUI5Component, oDomClickedElement) {
	        var fContextMenuAction = oClickedUI5Component.getContextMenuAction(sContextMenuComponentId, oDomClickedElement);
	        return fContextMenuAction;
	    }
	
	    this.updateComponent = function(oCrosstab, oCrosstabControlProperties, oCrosstabComponentProperties, fAppendToParentFunclet) {
	        var bNoRenderingRequired = false;
	        var bIsOnlySizeChange, bHasContentChange;
	        
	        oCrosstab.getPropertyBag().setCozyMode(sap.zen.crosstab.utils.Utils.isCozyMode());
	        if (oCrosstabControlProperties) {
	            oCrosstab.setValueHelpStatus(oCrosstabControlProperties.vlhlpstatus);
	            if (oCrosstabControlProperties.vlhlpstatus === sap.zen.crosstab.VHLP_STATUS_OPENING || oCrosstabControlProperties.vlhlpstatus === sap.zen.crosstab.VHLP_STATUS_CANCEL) {
	                // no rendering of the crosstab since it is just the valuehelp
	                // coming up or being closed with a cancel
	                oCrosstab.restoreFocusOnCell();
	                return;
	            }
	            if (oCrosstabControlProperties.removeselection && oCrosstabControlProperties.removeselection === true) {
	                bNoRenderingRequired = true;
	            }
	        }
	        
	        sap.zen.Dispatcher.instance.updateComponentProperties(oCrosstab, oCrosstabComponentProperties, fAppendToParentFunclet);
	        if (oCrosstabControlProperties) {
	            oCrosstab.expectOnAfterRenderingCall();
	            oCrosstab.updateControlProperties(oCrosstabControlProperties);
	        }
	        
	        if (oCrosstabControlProperties && oCrosstabControlProperties.pvcheck) {
	            // planning check info was aleady handled in
	            // updateControlProperties. Do not continue rendering!
	            oCrosstab.restoreFocusOnCell();
	            bNoRenderingRequired = true;
	        }
	        
	        if (bNoRenderingRequired === true) {
	            return;
	        }
	        
	        // This check is necessary here due to new databinding feature and the associated Dispatcher
	        // singleDelta-logic. With data binding, it might be possible that based on paging, a non-single-Delta response is being received.
	        // In that case, the control properties were already applied and we don't do any rendering here but just wait for the
	        // deferred rendering call from the Dispatcher
	        if (oCrosstab.isRenderingPossible() === true) {
	            bIsOnlySizeChange = (isNullOrUndefined(oCrosstabControlProperties) && !isNullOrUndefined(oCrosstabComponentProperties) && (!isNullOrUndefined(oCrosstabComponentProperties.width) || !isNullOrUndefined(oCrosstabComponentProperties.height)));
	            bHasContentChange = !isNullOrUndefined(oCrosstabControlProperties) && !isNullOrUndefined(oCrosstabControlProperties.changed) && oCrosstabControlProperties.changed;
	            
	            if (oCrosstabControlProperties && oCrosstabControlProperties.ispaging) {
	                oCrosstab.expectOnAfterRenderingCall();
	                triggerCrosstabUpdate(oCrosstab);
	            } else if (bIsOnlySizeChange || bHasContentChange || !sap.zen.Dispatcher.instance.isSingleDelta(oCrosstab.getId())) {
	                // in case of only size change, scrollbars will have to be
	                // re-rendered => full cycle
	                oCrosstab.expectOnAfterRenderingCall();
	                triggerCrosstabReRendering(oCrosstab);
	            } else if (!isNullOrUndefined(oCrosstabControlProperties)) {
	                // e. g. for paging, no content change, no size change =>
	                // preserve
	                // scrollbars
	                oCrosstab.expectOnAfterRenderingCall();
	                triggerCrosstabUpdate(oCrosstab);
	            }
	            // In other cases nothing has changed for the crosstab. Wait for the
	            // normal onAfterRendering call and do nothing.
	        }
	    };
	    
	    function isNullOrUndefined(obj) {
	        if (obj == null) { //checks null and undefined
	            return true;
	        }
	        return false;
	    }
	    
	    function triggerCrosstabReRendering(oCrosstab) {
	        oCrosstab.invalidate();
	        sap.ui.getCore().applyChanges();
	        oCrosstab.doRendering();
	    }
	    
	    function triggerCrosstabUpdate(oCrosstab) {
	        oCrosstab.prepareExistingDom();
	        oCrosstab.doRendering();
	    }
	    
		this.getDecorator = function() {
			return "DataSourceControlDecorator";
		};
	    
		this.getType = function() {
			return "xtable";
		};
	    
	};
	
	return new CrosstabHandler();
});
