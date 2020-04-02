jQuery.sap.declare('sap.apf.testhelper.doubles.binding');

/**
 * @description Constructor, simply clones the configuration object and sets
 * @param oBindingConfig
 */
sap.apf.testhelper.doubles.Binding = function(oInject, oBindingConfig) {
	this.type = "binding";

//	var oTestFilter = new sap.apf.core.utils.Filter(oInject.messageHandler);
//
//	this.getFilter = function() {       
//		return oTestFilter;
//	};

	this.setData = function(oDataResponse) {
		// sets the data
	};
	
	this.getRepresentationInfo = function() {

	};

	this.getSelectedRepresentationInfo = function() { 
	};
	
	this.getRequestOptions = function() { 
	};
};