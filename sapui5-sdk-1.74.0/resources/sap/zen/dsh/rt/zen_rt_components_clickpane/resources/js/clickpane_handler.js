define("zen.rt.components.clickpane/resources/js/clickpane_handler", ["sap/zen/basehandler"], function(BaseHandler){
		"use strict";
	
	var dispatcher = BaseHandler.dispatcher;
	
	var ClickPaneHandler = function() {
	
		BaseHandler.apply(this, arguments);
	
	
		var setattributes = function(oImage, oControlProperties) {
			oImage.zenStandardVis = oControlProperties.standardVis;
			oImage.zenBlankUrl = oControlProperties.blankUrl;
			oImage.zenBackgroundColor = oControlProperties.backgroundColor;
			oImage.zenHoverVis = oControlProperties.hoverVis;
			oImage.zenClickVis = oControlProperties.clickVis;
			oImage.zenOpacity = oControlProperties.opacity;
		};
	
		function setOpacity(oImage) {
			var oDomImage = oImage.$();
			if (oImage.zenOpacity >= 0  && oImage.zenOpacity < 100) {
				oDomImage.css("opacity", oImage.zenOpacity / 100); // opacity: 0.8;
				oDomImage.css("filter", "alpha(opacity=" + oImage.zenOpacity + ")"); // filter:alpha(opacity=80);
			} else {
				oDomImage.css("opacity", ""); 
				oDomImage.css("filter", ""); 
			}
		}
		
		function setBorder(oImage) {
			if (oImage.zenBlankUrl && !oImage.zenBackgroundColor)  {
				var oDomImage = oImage.$();
				oDomImage.css("border-style", "dashed");
				oDomImage.css("border-width", "1px");
				oDomImage.css("border-color", "gray");
			}
		}
		
		var addevents = function(oImage, oControlProperties) {
	
			function aStartsWithB(a, b) {
				return !a.indexOf(b);
			}
			
			if(sapbi_isMobile){
				oImage.attachBrowserEvent("touchstart", function(evt) {
					if (oImage.zenClickVis) {
						evt.target.src = oImage.zenClickVis;
	
						if (evt.preventDefault) {
							evt.preventDefault();
						}
						if (evt.stopPropagation) {
							evt.stopPropagation();
						}
						if (evt.cancelBubble) {
							evt.cancelBubble = true;
						}
	
					}
				});
				oImage.attachBrowserEvent("touchend", function(evt) {
					if(evt.target.src.indexOf(oImage.zenStandardVis) === -1 && oImage.zenStandardVis.indexOf(evt.target.src) === -1){
					evt.target.src = oImage.zenStandardVis;
					}
					if (oControlProperties.onclick){
						eval(oControlProperties.onclick);
					}
				});
			} else {
				oImage.attachBrowserEvent("mouseover", function(evt) {
					if (oImage.zenHoverVis) {
						evt.target.src = oImage.zenHoverVis;
					}
				});
				oImage.attachBrowserEvent("mouseout", function(evt) {
					if(evt.target.src.indexOf(oImage.zenStandardVis) === -1 && oImage.zenStandardVis.indexOf(evt.target.src) === -1){
					evt.target.src = oImage.zenStandardVis;
					}
				});
				oImage.attachBrowserEvent("mousedown", function(evt) {
					if (oImage.zenClickVis) {
						evt.target.src = oImage.zenClickVis;
					}
				});
				oImage.attachBrowserEvent("mouseup", function(evt) {
					if (oImage.zenHoverVis) {
						evt.target.src = oImage.zenHoverVis;
					} else {
						if(evt.target.src.indexOf(oImage.zenStandardVis) === -1 && oImage.zenStandardVis.indexOf(evt.target.src) === -1){
							evt.target.src = oImage.zenStandardVis;
						}
					}
				});
				if (oControlProperties.onclick) { // enable onClick and execute the ZEN script specified
					oImage.attachBrowserEvent("click", function() {
						eval(oControlProperties.onclick);
					});
				}
			}
			
			oImage.onAfterRendering_org = oImage.onAfterRendering;
			oImage.onAfterRendering = function() {
				if (oImage.onAfterRendering_org) {
					oImage.onAfterRendering_org();
				}
				setOpacity(oImage);
				if (aStartsWithB(oImage.zenBackgroundColor, "#")) {
					oImage.$().css("background-color", oImage.zenBackgroundColor);
				}
				if (sap.zen.designmode) {
					setBorder(oImage);
				}
			};
		};
		
		var init = function(oImage,oControlProperties, oComponentProperties) {
			dispatcher.setWidthHeight(oImage, oComponentProperties.width, oComponentProperties.height);
			oImage.setSrc(oImage.zenStandardVis);
			if (oControlProperties) {
			  if(oControlProperties.onclick){
					oImage.addStyleClass("zenClickable");
			  }
	  		oImage.setTooltip(oControlProperties.tooltip);		  
			}
		};
	
		this.create = function(oChainedControl, oControlProperties, oComponentProperties) {
			var id = oControlProperties["id"];
			var oImage = this.createDefaultProxy(id);
			oImage.addStyleClass("sapFixIEBugThatMakesImageControlTwoPixelsTooHigh");
			setattributes(oImage, oControlProperties);
			addevents(oImage, oControlProperties);
			init(oImage,oControlProperties, oComponentProperties);
			return oImage;
		};
	
		this.update = function(oControl, oControlProperties, oComponentProperties) {
			if (oControlProperties) {
				setattributes(oControl, oControlProperties);
			}
			init(oControl, oControlProperties,  oComponentProperties);
			setOpacity(oControl);
			return oControl;
		};
		
		this.getDefaultProxyClass = function(){
			return ["sap.m.Image", "sap.ui.commons.Image"];
		};
		
		this.getType = function() {
			return "clickpane";
		};
		
		
	};

  return new ClickPaneHandler();
});

