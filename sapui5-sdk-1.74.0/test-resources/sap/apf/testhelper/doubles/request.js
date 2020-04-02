sap.ui.define([
	'sap/apf/utils/hashtable',
	'sap/apf/testhelper/doubles/metadata',
	'sap/apf/testhelper/odata/sampleServiceData'
], function(Hashtable, Metadata, SampleServiceData){
	'use strict';


	function Request(oInject, oConfig) {
		'use strict';
		oInject.constructors = oInject.constructors || {};
		oInject.constructors.Hashtable = oInject.constructors.Hashtable || Hashtable;
		var entityType = oConfig.entityType;
		this.type = oConfig.type;
		var aTestData = SampleServiceData.getSampleServiceData(entityType).data;
		this.sendGetInBatch = function(oFilter, fnCallback) {
			var oMetadata = new Metadata(oInject, "");
			var aSelectedData =  oFilter.filterArray(aTestData);
			fnCallback({ data : aSelectedData, metadata : oMetadata }, true);
		};

		this.getData = function(){
			oInject.instances.messageHandler.check((aTestData instanceof Array), "TestData not initialized");
			return aTestData;
		};

		/* no productive usage HL 24.09.2015, used in tests only
		 * Moved to test-area as of 07.12.2015 so that tests remain stable*/

		/**
		 * @description Filters the array aData according to the filter condition. It is expected, that aData is array in
		 * json format.
		 * @param {object[]} aData Array in json format (value : prop).
		 * @returns {object[]} aFilteredData Array in json format with filtered values.
		 */
		sap.apf.core.utils.Filter.prototype.filterArray = function(aData) {
			var aFilteredData = [];
			var i;
			var j = 0;
			var len = aData.length;
			if (len === 0) {
				return aFilteredData;
			}
			var oProp;
			var bContained = false;
			// determine which properties have to be filtered
			var aFilterProperties = this.getProperties();
			var aDataPropertiesToTest = [];
			for(oProp in aData[0]) {
				if (jQuery.inArray(oProp, aFilterProperties) > -1) {
					aDataPropertiesToTest.push(oProp);
				}
			}
			// nothing to be filtered
			if (aDataPropertiesToTest.length === 0) {
				return aData;
			}
			// filter against the relevant properties
			for(i = 0; i < len; i++) {
				bContained = true;
				for(j = 0; j < aDataPropertiesToTest.length; ++j) {
					oProp = aDataPropertiesToTest[j];
					if (this.isConsistentWithFilter(oProp, aData[i][oProp]) === false) {
						bContained = false;
						break;
					}
				}
				if (bContained) {
					aFilteredData.push(aData[i]);
				}
			}
			return aFilteredData;
		};
	}

	sap.apf.testhelper.doubles.Request = Request;
	return Request;
}, true /*GLOBAL_EXPORT*/);
