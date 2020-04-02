jQuery.sap.declare("sap.apf.demokit.app.model.stubbedMethods");
sap.apf.demokit.app.model.stubbedMethods = function(oTokenForServices) {
	var fnStub = function() {
		// ajax stubing for xscrf token
		var fnOriginalAjax = jQuery.ajax;
		function ajaxStubbed(oConfig) {
			var fnOriginalSuccess = oConfig.success;
			var oXMLHttpRequest = {};
			var tmp = [];
			oXMLHttpRequest.getResponseHeader = function(arg) {
				if (arg === "x-sap-login-page") {
					return null;
				}
				return arg;
			};
			/*if (oConfig.type === "HEAD" && oConfig.url.search("annotation.xml") !== -1) {
				tmp = {};
				fnOriginalSuccess(tmp, "success", undefined);
			} else */
			var modPath = jQuery.sap.getModulePath('sap.apf.demokit.app');
			var oURLParameters = jQuery.sap.getUriParameters().mParams;
			if (oConfig.url === oTokenForServices.sAppOdataPath || oConfig.url === oTokenForServices.sPersistencyOdataPath) {
				fnOriginalSuccess(tmp, "success", oXMLHttpRequest);
			} else {
				if (oURLParameters.smartFilterBar != undefined && oURLParameters.smartFilterBar[0] === "true" && oConfig.url === modPath + "/config/AnalyticalConfiguration.json") {
					oConfig.url = modPath + "/config/AnalyticalConfigurationWithSFB.json";
				}
				return fnOriginalAjax(oConfig);
			}
		}
		this.stubJqueryAjax = sinon.stub(jQuery, "ajax", ajaxStubbed);
		// sjax stubbing for annotation.xml
		var fnOriginalSjax = jQuery.sap.sjax;
		function sjaxStubbed(oConfig) {
			/*if (oConfig.url.search("annotation.xml") !== -1) {
				var sAnnotationXmlPath = jQuery.sap.getModulePath('sap.apf.demokit.app') + "/model/metadata/annotation.xml";
				oConfig.url = sAnnotationXmlPath;
			}*/
			return fnOriginalSjax(oConfig);
		}
		this.stubJquerySjax = sinon.stub(jQuery.sap, "sjax", sjaxStubbed);
	};
	var fnRestore = function() {
		this.stubJquerySjax.restore();
		this.stubJqueryAjax.restore();
	};
	return {
		fnStub : fnStub,
		fnRestore : fnRestore
	};
};
