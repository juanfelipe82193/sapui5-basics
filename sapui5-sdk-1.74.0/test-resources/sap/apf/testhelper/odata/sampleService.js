/*
 * Copyright (C) 2009-2013 SAP AG or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare('sap.apf.testhelper.odata.getSampleService');
sap.apf.testhelper.odata.getSampleService = function(oApi, sRequestId) {
	var aReturn = [];
	var serviceUrl = "";
	switch (sRequestId) {
		case 'sampleData':
			serviceUrl = "../../../test-resources/sap/apf/testhelper/odata/sampleData.json";
			break;
		case 'sampleDataRevenue':
			serviceUrl = "../../../test-resources/sap/apf/testhelper/odata/sampleDataRevenue.json";
			break;
		case 'sampleDataForCharts':
			serviceUrl = "../../../test-resources/sap/apf/testhelper/odata/sampleDataForCharts.json";
			break;
		case 'smallSampleData':
			serviceUrl = "../../../test-resources/sap/apf/testhelper/odata/smallSampleData.json";
			break;
		default:
			break;
	}
	var onDataError = function(oJqXHR, sStatus, sErrorThrown) {
		console.log("fetch data fail");
	};
	var onDataFetchResponse = function(data, textStatus, XMLHttpRequest) {
		aReturn = data.d.results;
	};
	var fetchData = function() {
		var finalUrlString = oApi.getApfLocation() + serviceUrl;
		jQuery.ajax({
			url : finalUrlString,
			type : "GET",
			//			beforeSend : function() {
			//				//xhr.setRequestHeader("X-CSRF-Token", "Fetch");
			//			},
			async : false,
			dataType : "json",
			success : onDataFetchResponse,
			error : onDataError
		});
	};
	fetchData();
	return aReturn;
};
 