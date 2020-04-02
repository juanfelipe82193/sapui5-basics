define("zen.rt.components.filterpanel/resources/js/emptyComponent", [], function() {
	return sap.ui.core.Control.extend("sap.zen.components.Empty", {
	    renderer : function(oRm, oControl) {
	    	oRm.write('<div');
	    	oRm.writeControlData(oControl);
	    	oRm.write('></div>');
	    },

		insertPage : function() {
			
		},
	    
	    setSelectedIndex : function(){
	    	
	    }
	});	
		
});
