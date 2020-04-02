/*/
 * Copyright(c) 2018 SAP SE
 */
/*global sap */

sap.ui.define(['sap/apf/testhelper/odata/injectDatajs'], function(Module) {
	'use strict';

	sap.apf.testhelper.odata = sap.apf.testhelper.odata || {};
	sap.apf.testhelper.odata.getSampleServiceData = Module.getSampleServiceData;
	return {
		getSampleServiceData: Module.getSampleServiceData
	};
});
