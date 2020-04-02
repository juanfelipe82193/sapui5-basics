jQuery.sap.declare('sap.apf.demokit.app.helper.formatter');
sap.apf.demokit.app.helper.formatter = (function() {
	var FormatHelper = function(oApi) {
		this.oApi = oApi;
		var self = this;
		var callbackForFormatter = function(metadataObject, fieldName, fieldValue, formatedFieldValue) {
			var dateFormat;
			if (metadataObject.type === "Edm.DateTime") { //dateTime
				if (fieldValue === null) {
					return "-";
				}
				if(fieldValue instanceof Date){
					dateFormat = fieldValue;
				} else {
					dateFormat = new Date(parseInt(fieldValue.slice(6, fieldValue.length - 2), 10));
				}
				dateFormat = dateFormat.toLocaleDateString("de"); // german date
				if (dateFormat === "Invalid Date") {
					return "-";
				}
				formatedFieldValue = dateFormat;
			}
			return formatedFieldValue;
		};
		
		self.oApi.setEventCallback(oApi.constants.eventTypes.format, callbackForFormatter);
	};
	var instance;
	var _static = {
		name : "FormatHelper",
		getInstance : function(oApi) {
			if (instance === undefined) {
				instance = new FormatHelper(oApi);
			}
			return instance;
		},
		destroyInstance : function() {
			instance = undefined;
		}
	};
	return _static;
})();
