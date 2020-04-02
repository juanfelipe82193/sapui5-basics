sap.ui.define([
           	"sap/ui/vbdemos/component/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.vbdemos.dragndrop.Main", {
		oVBI : null,
		oSpots : null,
		oRoutes : null,
		onInit : function () {
			this.oVBI = this.getView().byId("VBIDnD");
			this.oSpots = this.getView().byId("Spots");
			this.oRoutes = this.getView().byId("Routes");
		
		},
		onDrop : function( e ) {
			var oSrc = e.getParameter( "oDragSource" );	// get the old route object
			var spos = e.oSource.getPosition();	// new spot position
			if(oSrc){
				var aRpos = oSrc.getPosition().split(/;/);	// old route positions
				var rpos1 = aRpos.splice(0,3).join(";");
				var rpos2 = aRpos.join(";");
				var sName = e.oSource.getTooltip();
				
				// create two new routes splitting at the spots location
				this.createNewRoute(rpos1, spos, sName);
				this.createNewRoute(spos, rpos2, sName);
				
				// remove the old route
				this.oRoutes.removeItem(oSrc);
			}
		},
		// create a new spot at the click location, and allow a drop operation on the spot
		onCreateSpot : function() {
			this.oVBI.getPositionInteractive( false, function(pos) {
				var nItems = this.oSpots.getItems().length + 1;
				this.oSpots.addItem( new sap.ui.vbm.Spot( {
	            	position: pos, 
	            	tooltip: 'NewSpot ' + nItems, 
		            dropTarget: new sap.ui.vbm.DropTarget({type:'Route'}),
		            drop: this.onDrop.bind(this)
	            } ) 
				);
			}.bind(this) );
		},
		// create a new route from startPos to endPos
		createNewRoute : function(startPos, endPos, sName) {
			this.oRoutes.addItem( new sap.ui.vbm.Route({ position: startPos + "; " + endPos, 
													start: "0", end: "1", 
	                                                color: 'rgb(140, 211, 255)',
	                                            	tooltip: "Route splitting at " + sName
	                                       		})
			);
		}
	});
});
