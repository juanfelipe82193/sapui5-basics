jQuery.sap.declare('sap.apf.testhelper.doubles.step');
jQuery.sap.require('sap.apf.utils.filter');
sap.apf.testhelper.doubles.Step = function(messageHandler, oStepConfig, oFactory) {
	this.type = 'step';
	this.update = function() {
	};
	this.title = {
		type : "label", // optional
		kind : "text",
		file : "resources/i18n/test_texts.properties",
		key : "localTextReference2"
	};
	this.longTitle = {
		type : "label", // optional
		kind : "text",
		file : "resources/i18n/test_texts.properties",
		key : "localTextReference3"
	};
	this.thumbnail = {
		type : "thumbnail",
		leftUpper : {
			type : "label", // optional
			kind : "text",
			file : "resources/i18n/test_texts.properties",
			key : "localTextReferenceStepTemplate1LeftUpper"
		},
		leftLower : {
			type : "label", // optional
			kind : "text",
			file : "resources/i18n/test_texts.properties",
			key : "localTextReferenceStepTemplate1LeftLower"
		},
		rightUpper : {
			type : "label", // optional
			kind : "text",
			file : "resources/i18n/test_texts.properties",
			key : "localTextReferenceStepTemplate1RightUpper"
		},
		rightLower : {
			type : "label", // optional
			kind : "text",
			file : "resources/i18n/test_texts.properties",
			key : "localTextReferenceStepTemplate1RightLower"
		}
	};
	this.categories = [ {
		type : "category", // optional
		id : "categoryTemplate1"
	} ];
};