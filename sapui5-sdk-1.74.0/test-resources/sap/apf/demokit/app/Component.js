jQuery.sap.declare("sap.apf.demokit.app.Component");
sap.ui.getCore().loadLibrary("sap.apf");
jQuery.sap.require("sap.apf.base.Component");
jQuery.sap.require('sap.apf.demokit.app.helper.contextMediator');
jQuery.sap.require('sap.apf.demokit.app.helper.formatter');
jQuery.sap.require('sap.apf.demokit.app.helper.preselectionFunction');
jQuery.sap.require('sap.apf.demokit.app.representation.barChart');
jQuery.sap.require('sap.apf.demokit.app.representation.stackedBarChart');
jQuery.sap.require('sap.apf.demokit.app.model.initializeMockServer');
sap.apf.base.Component.extend("sap.apf.demokit.app.Component", {
	oApi : null,
	metadata : {
		"manifest": "json",
		"config" : {
			"fullWidth" : true
		},
		"name" : "Component",
		"version" : "1.3.0",
		"dependencies" : {
			"libs" : [ "sap.m", "sap.ui.layout", "sap.ui.comp"]
		}
	},
	/**
	 * Initialize the application
	 * 
	 * @returns {sap.ui.core.Control} the content
	 */
	init : function() {
		var modPath = jQuery.sap.getModulePath('sap.apf.demokit.app');
		
		// Load application css file
		jQuery.sap.includeStyleSheet(modPath + "/resources/css/app.css");
		this.oComponentData = {};
		this.oComponentData.startupParameters = {
			"evaluationId" : [ "com.sap.apf.receivables.america" ]
		};
		var oMockServerHelper = sap.apf.demokit.app.model.initializeMockServer.getInstance();
		oMockServerHelper.startApplicationMockServer();
		oMockServerHelper.startPersistencyMockServer();
		oMockServerHelper.startSmartBusinessMockServer();
		oMockServerHelper.startApplicationAnnotationMockServer();
		oMockServerHelper.startPersistencyAnnotationMockServer();
		sap.apf.base.Component.prototype.init.apply(this, arguments);
	},
	/**
	 * Creates the application layout and returns the outer layout of APF 
	 * @returns
	 */
	createContent : function() {
		this.oApi = this.getApi();	 
		// Calling parent Component's createContent method.
		var appLayout = sap.apf.base.Component.prototype.createContent.apply(this, arguments);

		try {
		var exchangeRateContent = sap.ui.view({
			viewName : "sap.apf.demokit.app.controls.view.exchangeRate",
			type : sap.ui.core.mvc.ViewType.JS,
			viewData : {
				oApi : this.oApi
			},
			width : "70%"
		});
		var currencyContent = sap.ui.view({
			viewName : "sap.apf.demokit.app.controls.view.reportingCurrency",
			type : sap.ui.core.mvc.ViewType.JS,
			viewData : {
				oApi : this.oApi
			}
		});
		
		this.oApi.addMasterFooterContent(currencyContent);
		this.oApi.addMasterFooterContent(exchangeRateContent);
		sap.apf.demokit.app.helper.formatter.getInstance(this.oApi);
		} catch(e) {}
		return appLayout;
	},
	destroy : function() {
		sap.apf.demokit.app.helper.ContextMediator.destroyInstance();
		sap.apf.demokit.app.helper.formatter.destroyInstance();
		sap.apf.demokit.app.model.initializeMockServer.destroyInstance();
		sap.apf.base.Component.prototype.destroy.apply(this, arguments);
	}
});
