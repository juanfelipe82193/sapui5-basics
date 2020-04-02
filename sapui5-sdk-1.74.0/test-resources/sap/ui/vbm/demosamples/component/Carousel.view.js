sap.ui.define([
           	"sap/ui/vbdemos/component/ScrollCarousel"
], function (ScrollCarousel) {
	"use strict";

	sap.ui.jsview("sap.ui.vbdemos.component.Carousel", {
	  getControllerName: function() {
	    return "sap.ui.vbdemos.component.Carousel";
	  },
	  createContent: function(oController) {
	
		  sap.m.Image.extend("sap.ui.vbdemos.component.ScrollCarouselImage", {
				metadata: {
					properties : {
						"title" : {type : "string"}
					}
				},
				renderer : function (oRm, oControl){
					oRm.write("<div class='sapScrollChr'>");
					sap.m.ImageRenderer.render(oRm,oControl);
					oRm.write("<div class='sapScrollChrCaption'>");
					oRm.writeEscaped(oControl.getTitle());
					oRm.write("</div>");
					oRm.write("</div>");
				}
			});
			
				  
		var scrollcont = new ScrollCarousel({
	    	   content: {
	    		   path: "/routes",
	    		   template : new sap.ui.vbdemos.component.ScrollCarouselImage({
	    			   width: "300px",
	    			   src : "{image}",
	    			   title : "{description}"
	    		   })
	    	   },
	    	   vertical: false,
	    	   horizontal: true,
	    	   selectionChanged : oController.onSelectionChange
	       });
	       
	       
	       this.ScrollContainer = scrollcont;
	       return scrollcont;
	
	  }
	});
});
