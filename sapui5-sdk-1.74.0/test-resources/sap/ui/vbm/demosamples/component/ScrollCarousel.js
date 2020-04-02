sap.ui.define([
           	"sap/ui/core/Control"
], function (Control) {
	"use strict";

	return Control.extend("sap.ui.vbdemos.component.ScrollCarousel", {
		metadata: {
			library : "sap.m",
			properties : {
				"visible" : {type : "boolean", group : "Appearance", defaultValue : true},
				"width" : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : 'auto'},
				"height" : {type : "sap.ui.core.CSSSize", group : "Dimension", defaultValue : 'auto'},
				"horizontal" : {type : "boolean", group : "Behavior", defaultValue : true},
				"vertical" : {type : "boolean", group : "Behavior", defaultValue : false}
			},
			defaultAggregation : "content",
			aggregations : {
				"content" : {type : "sap.ui.core.Control", multiple : true, singularName : "content"}
			},
			events: {
				selectionChanged: {
					parameters: {
						selectedObject: {
							type: "object"
						}
					}
				},
			}
		},
		renderer: function(oRm, oControl) {
			if (!oControl.getVisible()) {
				return;
			}
	
			oRm.write("<div");
			oRm.writeControlData(oControl);
	
			var width = oControl.getWidth(),
			height = oControl.getHeight();
			if (width) {
				oRm.addStyle("width", width);
			}
			if (height) {
				oRm.addStyle("height", height);
			}
			oRm.writeStyles();
			var oFlexContainer = oControl._oFlexbox;
			if (oControl.getVertical()) {
				if (!oControl.getHorizontal()) {
					oFlexContainer.setDirection(sap.m.FlexDirection.Column);
					oRm.addClass("sapMScrollContV");
				} else {
					oRm.addClass("sapMScrollContVH");
					oFlexContainer.setDirection(sap.m.FlexDirection.Column);
				}
			} else if (oControl.getHorizontal()) {
				oRm.addClass("sapMScrollContH");
				//oFlexContainer.setDirection(sap.m.FlexDirection.Row);
			}
	
			oRm.addClass("sapMScrollCont");
			oRm.writeClasses();
			
			var sTooltip = oControl.getTooltip_AsString();
			if (sTooltip) {
				oRm.writeAttributeEscaped("title", sTooltip);
			}
			
			oRm.write("><div id='" + oControl.getId() + "-scroll' class='sapMScrollContScroll'>");
	
			// render child controls
			
			var aContent = oControl.getContent(),
			l = aContent.length;
			for (var i = 0; i < l; i++) {
				var oImage = aContent[i].addStyleClass("scrollImage");
				oImage.attachPress(function(e) {
					oControl.clickFindCorrespondingObject(e);
				});
				oFlexContainer.addContent(oImage);
			}
			oRm.renderControl(oFlexContainer);
			oRm.write("</div></div>");
		},
		init : function() {
			jQuery.sap.require("sap.ui.core.delegate.ScrollEnablement");
			this._oScroller = new sap.ui.core.delegate.ScrollEnablement(this, this.getId() + "-scroll", {
				horizontal: true,
				vertical: false,
				zynga: false,
				preventDefault: false,
				nonTouchScrolling: "iwas"
			});
			this._oFlexbox=new sap.ui.layout.HorizontalLayout();
				   
			// TODO: do the resize listening only when ScrollContainer becomes visible and unbind when getting visible
		},
		onBeforeRendering : function() {
			// properties are not known during init
			//this.entryFindCorrespondingObject();
			
			this._oScroller.setHorizontal(this.getHorizontal());
			this._oScroller.setVertical(this.getVertical());
		},
		exit : function() {
			if (this._oScroller) {
				this._oScroller.destroy();
				this._oScroller = null;
			}
		},
		getScrollDelegate : function() {
			return this._oScroller;
		},
		scrollInc : function(x, y) {
			if (this._oScroller) {
				this.scrollTo(this._oScroller._scrollX + x, this._oScroller._scrollY + y,0);
			}
		},
		scrollTo : function(x, y, time) {
			if (this._oScroller) {
				if (this.getDomRef()) { // only if rendered
					this._oScroller.scrollTo(x, y, time);
				} else {
					this._oScroller._scrollX = x; // remember for later rendering
					this._oScroller._scrollY = y;
				}
			}
			return this;
		},
		setHorizontal : function(horizontal) {
			this._oScroller.setHorizontal(horizontal);
			this.setProperty("horizontal", horizontal, true); // no rerendering
		},
		setVertical : function(vertical) {
			this._oScroller.setVertical(vertical);
			this.setProperty("vertical", vertical, true); // no rerendering
		},
		showSelection: function (){
			for (var sId in this._oPositions) {
				var imageleft = this._oPositions[sId].left; // based between 0 - 1620 (1920 minus image)
				var scrollerpoint = this._oScroller._scrollX;
			
			
				if ( imageleft > scrollerpoint) {
					$(".scrollImage.selected").removeClass("selected");
					$(".scrollImage#"+sId).addClass("selected");
					if (this.iRunningTimer) { clearTimeout(this.iRunningTimer);}
					var currcontrol = sap.ui.getCore().byId(sId);
					this.contextObject = currcontrol.getBindingContext().getObject();
				
					this.iRunningTimer = setTimeout(this.loadAsync.bind(this), 750);
					return;
				}
			}
			
				
		},
		iRunningTimer : null,
		loadAsync : function () {
			var obj = this.contextObject;
			this.fireSelectionChanged({selectedObject: obj});
		},
		clickFindCorrespondingObject : function (e) {
			this.contextObject = e.getSource().getBindingContext().getObject();
			
			var iRenderedItem = this._oFlexbox.indexOfContent(e.getSource());
			this.scrollToN(iRenderedItem);
		},
		entryFindCorrespondingObject : function (hash) {
			if (this._oFlexbox.getContent().length > 0) {
				var aEntries = this.getModel().getObject(this.getBindingPath("content"));
				var hash = hash.replace("#","");
				
				for ( var int in aEntries) {
					var result = aEntries[int].pattern.search(hash);
					if (0 <= result) {
						this.contextObject = aEntries[int];
						this.scrollToN(parseInt(int));
					}
				}
			}
			
		},
		scrollToN : function (iRenderedItem) {
			var shifter = this._factor * (iRenderedItem + (iRenderedItem/this._itemsLength)) ;
			++iRenderedItem;
			this._oScroller.scrollTo(shifter);
			$(".scrollImage.selected").removeClass("selected");
			$(".sapUiHLayoutChildWrapper:nth-of-type("+iRenderedItem+") .scrollImage").addClass("selected");
			this.loadAsync();
		},
		addContent : function(arg) {
			this.addAggregation("content", arg);
			this._refreshPositions();
		},
		_oPositions : {},
		_refreshPositions : function () {
			var aRenderedItems = this._oFlexbox.getContent();
			
			this._clientWidth = this.getDomRef().clientWidth;
			this._scrollWidth = this._oFlexbox.getDomRef().scrollWidth;
			this._maxscrollX = this._scrollWidth - this._clientWidth;
			this._itemsLength = aRenderedItems.length;
			this._factor = this._maxscrollX / aRenderedItems.length;
		
			if(aRenderedItems.length > 0) {
				
				
				for (var item in aRenderedItems) {
					this._oPositions[aRenderedItems[item].getId()] = { 
					       left : (parseInt(item) + 1) * this._factor 
					       };
				}
			}
			
		},
		onAfterRendering: function() {
			var oSource = this;
			var oDomRef = this.getDomRef();
			$(oDomRef).scroll(function (e) {
				oSource.showSelection();
				e.preventDefault();
			});
			$(oDomRef).on("wheel", function (e) {
		    	   if(e.originalEvent.type === "wheel"){
		    		   var delta = e.originalEvent.deltaY || 0;
		    		   oSource.scrollInc(delta,0,0);
		    		   oSource.showSelection();
		    		   e.preventDefault();
		    		   }
			  });
			this._refreshPositions();
		
		}		
	});
});
