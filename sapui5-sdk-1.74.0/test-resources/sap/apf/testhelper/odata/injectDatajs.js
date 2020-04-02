/*/
 * Created on 29.12.2018.
 * Copyright(c) 2018 SAP SE
 */
/*global sap */

sap.ui.define([], function() {
	'use strict';

	// using this singleton is not thread safe. However, getUriFromODataSpy is used in one test only.
	var sUri;
	function injectODataDouble() {
		sUri = '';
		function extractEntityType(sUri) {
			var oMatcher = /[^\/]\w+(?=(\(|Results))/;
			var aResults = oMatcher.exec(sUri);
			if (aResults) {
				return aResults[0];
			}
		}
		var datajs = {
			request : function(oRequest, fnSuccess) {
				sUri = oRequest.data.__batchRequests[0].requestUri;
				var data = {};
				var entityType = extractEntityType(sUri);
				if (entityType) {
					data.__batchResponses = [];
					data.__batchResponses.push({
						data : {}
					});
					data.__batchResponses[0].data.results = getSampleServiceData(entityType).data;
					fnSuccess(data);
				}
			}
		};
		return datajs;
	}

	function getSampleServiceData(sEntityType) {
		var aReturn = [];
		var addRow = function() {
			aReturn.push({

			});
		};
		var addProperty = function(sPropertyName, sPropertyValue) {
			var oRow = aReturn[(aReturn.length - 1)];
			oRow[sPropertyName.toString()] = sPropertyValue;
		};

		switch (sEntityType) {
			case "EntityType3":
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "1000");
				addProperty("Customer", "1001");
				addProperty("CustomerName", "Nelson Tax & Associates");
				addProperty("DaysSalesOutstanding", "54.66");
				addProperty("BestPossibleDaysSalesOutstndng", "38.82");
				//Dataset 2
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "1000");
				addProperty("Customer", "1002");
				addProperty("CustomerName", "Becker Berlin");
				addProperty("DaysSalesOutstanding", "43.73");
				addProperty("BestPossibleDaysSalesOutstndng", "60");
				//Dataset 3
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "1000");
				addProperty("Customer", "1003");
				addProperty("CustomerName", "ABACO, CASA DE BOLSA");
				addProperty("DaysSalesOutstanding", "43.4");
				addProperty("BestPossibleDaysSalesOutstndng", "35.44");
				//Dataset 4
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "1000");
				addProperty("Customer", "1004");
				addProperty("CustomerName", "ANDERSON CLAYTON &CO");
				addProperty("DaysSalesOutstanding", "43.39");
				addProperty("BestPossibleDaysSalesOutstndng", "34.71");
				//Dataset 5
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "1000");
				addProperty("Customer", "1005");
				addProperty("CustomerName", "BAYER DE MEXICO, S.A");
				addProperty("DaysSalesOutstanding", "40.46");
				addProperty("BestPossibleDaysSalesOutstndng", "35.09");
				//Dataset 6
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "1000");
				addProperty("Customer", "1006");
				addProperty("CustomerName", "BENTELER DE MEXICO");
				addProperty("DaysSalesOutstanding", "40.98");
				addProperty("BestPossibleDaysSalesOutstndng", "36.04");
				//Dataset 7
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "1000");
				addProperty("Customer", "1007");
				addProperty("CustomerName", "ARRENDADORA SOFIMEX");
				addProperty("DaysSalesOutstanding", "41.1");
				addProperty("BestPossibleDaysSalesOutstndng", "35.83");
				//Dataset 8
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "1000");
				addProperty("Customer", "1008");
				addProperty("CustomerName", "AUTOMOTRIZ CENTRAL");
				addProperty("DaysSalesOutstanding", "42.34");
				addProperty("BestPossibleDaysSalesOutstndng", "34.71");
				//Dataset 9
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "1000");
				addProperty("Customer", "1009");
				addProperty("CustomerName", "AVANTEL S.A.");
				addProperty("DaysSalesOutstanding", "43.11");
				addProperty("BestPossibleDaysSalesOutstndng", "37.13");
				//Dataset 10
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "1000");
				addProperty("Customer", "1010");
				addProperty("CustomerName", "BMW DE MEXICO, S.A.");
				addProperty("DaysSalesOutstanding", "44.36");
				addProperty("BestPossibleDaysSalesOutstndng", "36.15");
				//Dataset 11
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "2000");
				addProperty("Customer", "2001");
				addProperty("CustomerName", "CELANESE MEXICANA,SA");
				addProperty("DaysSalesOutstanding", "44.66");
				addProperty("BestPossibleDaysSalesOutstndng", "37.09");
				//Dataset 12
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "2000");
				addProperty("Customer", "2002");
				addProperty("CustomerName", "BASCULAS DEL CENTRO");
				addProperty("DaysSalesOutstanding", "44.11");
				addProperty("BestPossibleDaysSalesOutstndng", "36.52");
				//Dataset 13
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "2000");
				addProperty("Customer", "2003");
				addProperty("CustomerName", "Zuber AG");
				addProperty("DaysSalesOutstanding", "50.63");
				addProperty("BestPossibleDaysSalesOutstndng", "53.08");
				//Dataset 14
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "2000");
				addProperty("Customer", "2004");
				addProperty("CustomerName", "Feuerwehr Tuning AG");
				addProperty("DaysSalesOutstanding", "47.75");
				addProperty("BestPossibleDaysSalesOutstndng", "50.03");
				//Dataset 15
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "2000");
				addProperty("Customer", "2005");
				addProperty("CustomerName", "Schnelle Feuerwehr");
				addProperty("DaysSalesOutstanding", "48.62");
				addProperty("BestPossibleDaysSalesOutstndng", "37.78");
				//Dataset 16
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "2000");
				addProperty("Customer", "2006");
				addProperty("CustomerName", "ABC Marketing");
				addProperty("DaysSalesOutstanding", "51.55");
				addProperty("BestPossibleDaysSalesOutstndng", "48.94");
				//Dataset 17
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "2000");
				addProperty("Customer", "2007");
				addProperty("CustomerName", "CPD");
				addProperty("DaysSalesOutstanding", "41.79");
				addProperty("BestPossibleDaysSalesOutstndng", "36.48");
				//Dataset 18
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "2000");
				addProperty("Customer", "2008");
				addProperty("CustomerName", "Lampen-Markt GmbH");
				addProperty("DaysSalesOutstanding", "47.31");
				addProperty("BestPossibleDaysSalesOutstndng", "49.51");
				//Dataset 19
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "2000");
				addProperty("Customer", "2009");
				addProperty("CustomerName", "TOPCO Pacific");
				addProperty("DaysSalesOutstanding", "39.48");
				addProperty("BestPossibleDaysSalesOutstndng", "52.72");
				//Dataset 20
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "2000");
				addProperty("Customer", "2010");
				addProperty("CustomerName", "TOPCO Pacific");
				addProperty("DaysSalesOutstanding", "43.27");
				addProperty("BestPossibleDaysSalesOutstndng", "53.53");
				break;

			case "EntityType1":
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "1000");
				addProperty("Customer", "1001");
				addProperty("CustomerName", "Nelson Tax & Associates");
				addProperty("DaysSalesOutstanding", "54.66");
				addProperty("RevenueAmountInCoCodeCrcy_E", "3844.82");
				addProperty("CoArea", "1000");
				//Dataset 2
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "1000");
				addProperty("Customer", "1002");
				addProperty("CustomerName", "Becker Berlin");
				addProperty("DaysSalesOutstanding", "43.73");
				addProperty("RevenueAmountInCoCodeCrcy_E", "6044");
				addProperty("CoArea", "2000");
				//Dataset 3
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "1000");
				addProperty("Customer", "1003");
				addProperty("CustomerName", "ABACO, CASA DE BOLSA");
				addProperty("DaysSalesOutstanding", "43.4");
				addProperty("RevenueAmountInCoCodeCrcy_E", "3544.44");
				addProperty("CoArea", "3000");
				//Dataset 4
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "1000");
				addProperty("Customer", "1004");
				addProperty("CustomerName", "ANDERSON CLAYTON &CO");
				addProperty("DaysSalesOutstanding", "43.39");
				addProperty("RevenueAmountInCoCodeCrcy_E", "3444.71");
				addProperty("CoArea", "4000");
				//Dataset 5
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "1000");
				addProperty("Customer", "1005");
				addProperty("CustomerName", "BAYER DE MEXICO, S.A");
				addProperty("DaysSalesOutstanding", "40.46");
				addProperty("RevenueAmountInCoCodeCrcy_E", "3544.09");
				//Dataset 6
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "2000");
				addProperty("Customer", "2001");
				addProperty("CustomerName", "BENTELER DE MEXICO");
				addProperty("DaysSalesOutstanding", "40.98");
				addProperty("RevenueAmountInCoCodeCrcy_E", "3644.04");
				//Dataset 7
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "2000");
				addProperty("Customer", "2002");
				addProperty("CustomerName", "ARRENDADORA SOFIMEX");
				addProperty("DaysSalesOutstanding", "41.1");
				addProperty("RevenueAmountInCoCodeCrcy_E", "3544.83");
				//Dataset 8
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "2000");
				addProperty("Customer", "2003");
				addProperty("CustomerName", "AUTOMOTRIZ CENTRAL");
				addProperty("DaysSalesOutstanding", "42.34");
				addProperty("RevenueAmountInCoCodeCrcy_E", "3444.71");
				//Dataset 9
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "2000");
				addProperty("Customer", "2004");
				addProperty("CustomerName", "AVANTEL S.A.");
				addProperty("DaysSalesOutstanding", "43.11");
				addProperty("RevenueAmountInCoCodeCrcy_E", "3744.13");
				//Dataset 10
				addRow();
				addProperty("SAPClient", "777");
				addProperty("CompanyCode", "2000");
				addProperty("Customer", "2005");
				addProperty("CustomerName", "BMW DE MEXICO, S.A.");
				addProperty("DaysSalesOutstanding", "44.36");
				addProperty("RevenueAmountInCoCodeCrcy_E", "3644.15");
				//Dataset 11
				addRow();
				addProperty("SAPClient", "888");
				addProperty("CompanyCode", "2000");
				addProperty("Customer", "2005");
				addProperty("CustomerName", "BMW DE MEXICO, S.A.");
				addProperty("DaysSalesOutstanding", "44.36");
				addProperty("RevenueAmountInCoCodeCrcy_E", "3644.15");
				addProperty("CoArea", "4000");
				break;

			case "entityTypeWithParams":
				addRow();
				//Dataset 1
				addProperty("stringProperty", "stringValue1");
				addProperty("int32Property", "1");
				addProperty("decimalProperty", "1.1");
				//Dataset 2
				addRow();
				addProperty("stringProperty", "stringValue2");
				addProperty("int32Property", "2");
				addProperty("decimalProperty", "2.2");
				//Dataset 3
				addRow();
				addProperty("stringProperty", "stringValue3");
				addProperty("int32Property", "3");
				addProperty("decimalProperty", "3.3");
				//Dataset 4
				addRow();
				addProperty("stringProperty", "stringValue4");
				addProperty("int32Property", "4");
				addProperty("decimalProperty", "4.4");
				//Dataset 5
				addRow();
				addProperty("stringProperty", "stringValue5");
				addProperty("int32Property", "5");
				addProperty("decimalProperty", "5.5");
				//Dataset 6
				addRow();
				addProperty("stringProperty", "stringValue6");
				addProperty("int32Property", "6");
				addProperty("decimalProperty", "6.6");
				//Dataset 7
				addRow();
				addProperty("stringProperty", "stringValue7");
				addProperty("int32Property", "7");
				addProperty("decimalProperty", "7.7");
				//Dataset 8
				addRow();
				addProperty("stringProperty", "stringValue8");
				addProperty("int32Property", "8");
				addProperty("decimalProperty", "8.8");
				//Dataset 9
				addRow();
				addProperty("stringProperty", "stringValue9");
				addProperty("int32Property", "9");
				addProperty("decimalProperty", "9.9");
				//Dataset 10
				addRow();
				addProperty("stringProperty", "stringValue10");
				addProperty("int32Property", "10");
				addProperty("decimalProperty", "10.10");
				break;
		}
		return {
			data : aReturn
		};
	}

	function getUriFromODataSpy() {
		return sUri;
	}

	return {
		injectODataDouble: injectODataDouble,
		getSampleServiceData: getSampleServiceData,
		getUriFromODataSpy: getUriFromODataSpy
	};
});
