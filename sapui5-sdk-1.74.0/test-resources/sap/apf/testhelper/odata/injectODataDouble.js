/*/
 * Created on 29.12.2018.
 * Copyright(c) 2018 SAP SE
 */
/*global sap */

sap.ui.define(['sap/apf/testhelper/odata/injectDatajs'], function(Module) {
	'use strict';

	sap.apf.testhelper.odata = sap.apf.testhelper.odata || {};
	sap.apf.testhelper.odata.injectODataDouble = Module.injectODataDouble;
	return {
		injectODataDouble: Module.injectODataDouble
	};
});
