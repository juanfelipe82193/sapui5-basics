sap.ui.define(["sap/suite/ui/generic/template/lib/AjaxHelper", "sap/base/util/UriParameters"], function (AjaxHelper, UriParameters) {
	"use strict";

	var Utils = {};

	/*
	 * Return the name and the path for an app specified via sDemoApp
	 *
	 */
	Utils.getAppInfo = function (sDemoApp, sCalledFromOpt) {
		var sModuleName, sModulePath;
		switch (sDemoApp) {
			case "sttaproductstreetable":
				sModuleName = "STTAMPTT";
				sModulePath = "./sample.stta.prod.man.treetable/webapp";
				break;
			case "salesorderdepr":
				sModuleName = "sap.suite.prototype.salesorder";
				sModulePath = "./sample.application";
				break;
			case "sttaproducts":
				sModuleName = "STTA_MP";
				sModulePath = "./sample.stta.manage.products/webapp";
				break;
			case "sttasalesordernd":
				sModuleName = "STTA_SO_ND";
				sModulePath = "./sample.stta.sales.order.nd/webapp";
				break;
			case "sttasalesorderitemaggr":
				sModuleName = "SOITMAGGR";
				sModulePath = "./sample.stta.sales.order.item.aggregation/webapp";
				break;
			case "sttasalesordernoext":
				sModuleName = "SOwoExt";
				sModulePath = "./sample.stta.sales.order.no.extensions/webapp";
				break;
			case "sttasalesordertt":
				sModuleName = "ManageSalesOrderWithTableTabs";
				sModulePath = "./sample.stta.sales.order.tabletabs/webapp";
				break;
			case "sttasalesordersb":
				sModuleName = "ManageSalesOrderWithSegButtons";
				sModulePath = "./sample.stta.sales.order.segbuttons/webapp";
				break;
			case "nondraftsalesorder":
				sModuleName = "anondraftapp";
				sModulePath = "./sample.nondraft.sales.orders/webapp";
				break;
			case "sttasalesorderwklt":
				sModuleName = "sttasalesorderwklt";
				sModulePath = "./sample.stta.sales.order.worklist/webapp";
				break;
			case "sttasalesordermultientity":
				sModuleName = "SOMULTIENTITY";
				sModulePath = "./sample.stta.sales.order.multi.entitysets/webapp";
				break;
			case "analytics2":
				sModuleName = "analytics2";
				sModulePath = "./sample.analytical.list.page/webapp";
				break;
			case "alpWithParams":
				sModuleName = "sample.analytical.list.page.with.params";
				sModulePath = "./sample.analytical.list.page.with.params/webapp";
				break;
			case "analytics3":
				sModuleName = "analytics3";
				sModulePath = "./sample.analytical.list.page.settings/webapp";
				break;
			case "analytics4":
				sModuleName = "analytics4";
				sModulePath = "./sample.analytical.list.page.ext/webapp";
				break;
			case "analytics5":
				sModuleName = "analytics5";
				sModulePath = "./sample.analytical.list.page.treetable/webapp";
				break;
			case "products":
				sModuleName = "ManageProductsNS2";
				sModulePath = "./sample.manage.products/webapp";
				break;
			case "salesorder":
				sModuleName = "SalesOrdersNS";
				sModulePath = "./sample.sales.orders/webapp";
				break;
			case "tmplsttasalesorder":
				sModuleName = "SODKTsodemokittemplate";
				sModulePath = "./template.stta.sales.order/webapp";
				break;
			case "SalesOrderItemEditableFieldFor":
				sModuleName = "SalesOrderItemEditableFieldFor";
				sModulePath = "./stta.sales.order.item.editableFieldFor/webapp";
				break;
			case "epmmanageproducts":
				sModuleName = "epmprodman";
				sModulePath = "./sample.epm.manage.products/webapp";
				break;
			default:
				sModuleName = "ManageProductsNS2";
				sModulePath = "./sample.manage.products/webapp";
				break;
		}
		if (sCalledFromOpt === "integration") {
			sModulePath = sModulePath.replace('./', '../../demokit/');
		}
		return {
			moduleName: sModuleName,
			modulePath: sModulePath
		};
	};

	Utils.getFlpConfiguredAppInfo = function (sSemanticObjectAction) {
		var sModuleName, sModulePath;

		var aConfiguredFlpSandboxApps =
			window["sap-ushell-config"] &&
			window["sap-ushell-config"].services &&
			window["sap-ushell-config"].services.NavTargetResolution &&
			window["sap-ushell-config"].services.NavTargetResolution.adapter &&
			window["sap-ushell-config"].services.NavTargetResolution.adapter.config &&
			window["sap-ushell-config"].services.NavTargetResolution.adapter.config.applications;
		if (aConfiguredFlpSandboxApps){
			var oConfiguredFlpSandboxApps = aConfiguredFlpSandboxApps[sSemanticObjectAction];
			sModuleName = sSemanticObjectAction;
			sModulePath = oConfiguredFlpSandboxApps && oConfiguredFlpSandboxApps.url;
		}
		return {
			moduleName: sModuleName,
			modulePath: sModulePath
		};
	};

	/**
	 * This method returns the manifest object needed for creating the AppComponent (see a demokit app's Component.js).
	 * This is either the manifest file specified via ushell, via URL parameter or (if there is no URL parameter) the default manifest.json.
	 */
	Utils.getManifest = function () {
		var oManifestObject = Utils.getManifestObject();
		var oManifest = {};
		if (oManifestObject.modulePath){
			if (oManifestObject.manifest) {
				oManifest = AjaxHelper.sjax({
					url: oManifestObject.modulePath + "/" + oManifestObject.manifest + ".json"
				});
			} else {
				oManifest = AjaxHelper.sjax({
					url: oManifestObject.modulePath + "/manifest.json"
				});
			}
			oManifest.data = Utils.uniquificationOfDataSourcesInManifest(oManifestObject.modulePath, oManifest.data);
			return {
				"manifest": oManifest.data
			};
		} else {
			return {
				"manifest": "json"
			};
		}
	};

	/*
	* there were difference between demokit.html and flpSandbox.html call
	* reason: in flpSandbox.html multiple apps with different manifest are started; for each dataSource in there the mockserver creates a regex
	* to deal with the requests; these regex are sometimes the same cross multiple apps; the the app looks different
	* with adjustDataSourcesInManifest the dataSource entries are made unique
	* */
	Utils.uniquificationOfDataSourcesInManifest = function (sModulePath, oManifest) {
		var sManifestDynamic = Utils.getManifestObject(sModulePath).manifest || "";
		var oDataSources = oManifest && oManifest["sap.app"] && oManifest["sap.app"]["dataSources"];
		for (var property in oDataSources) {
			if (oDataSources.hasOwnProperty(property)) {
				var oDataSource = oDataSources[property];
				//console.log("oDataSource.uri_BEFORE: " + oDataSource.uri);
				if (oDataSource.uri ) {
					oDataSource.uri = "/DynamicallyUniquificatedPath__" + sModulePath+ "__" + sManifestDynamic + "__" + oDataSource.uri;
					//console.log("oDataSource.uri_AFTER: " + oDataSource.uri);
				}
			}
		}
		return oManifest;
	};

	Utils.getManifestObject = function (sRequiredForModulePath) {
		var oManifestObject = {};
		/*flpSandbox.html scenario - app configuration expected*/
		var oUshellContainer = sap.ushell && sap.ushell.Container;
		if (oUshellContainer) {
			if (document.location.hash) {
				var oURLParsing = oUshellContainer && oUshellContainer.getService("URLParsing");
				var oParsedUrl = oURLParsing.parseShellHash(document.location.hash);
				var sSemanticObjectAction = oParsedUrl.semanticObject + "-" + oParsedUrl.action;
				oManifestObject.modulePath = Utils.getFlpConfiguredAppInfo(sSemanticObjectAction).modulePath;
				if (!sRequiredForModulePath ||
					sRequiredForModulePath &&
					sRequiredForModulePath === oManifestObject.modulePath) {
					oManifestObject.manifest = oParsedUrl &&
						oParsedUrl.params &&
						oParsedUrl.params.manifest &&
						oParsedUrl.params.manifest[0];
				}
			}
		} else {
			/*demokit.html scenario - parameter demoApp expected*/
			var oUriParameters = new UriParameters(window.location.href);
			var sDemoApp = oUriParameters.get("demoApp");
			oManifestObject.modulePath = Utils.getAppInfo(sDemoApp).modulePath;
			oManifestObject.manifest = oUriParameters.get("manifest");
		}
		return oManifestObject;
	};
	/**
	 * Create a new GUID and return as string
	 * * @param {string} sURL from where the filter data will be extracted
	 */
	Utils.getFiltersFromURL = function (sURL) {
		var aFilter = [];
		var aUrlParams = sURL.split("?")[1].split("&");
		for (var i = 0; i < aUrlParams.length; i++) {
			var sParamValue = aUrlParams[i];
			var rKeyValue = new RegExp("(.*)=(.*)");
			var aRes;
			if (sParamValue) {
				aRes = rKeyValue.exec(sParamValue);
				if (aRes[1] !== "PreserveChanges") {
					aFilter.push(aRes[1] + " eq " + aRes[2]);
				}
			}
		}
		return aFilter;
	};

	/**
	 * Create a new GUID and return as string
	 * @returns {string} GUID
	 */
	Utils.getGUID = function () {
		var _get4Char = function () {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		};
		return _get4Char() + _get4Char() + "-" + _get4Char() + "-" + _get4Char() + "-" + _get4Char() + "-" + _get4Char() + _get4Char() +
			_get4Char();
	};

	/**
	 * Generates the key string for the OData entity to be used in URLs.
	 * @constructor
	 * @param {object} oEntity OData C_STTA_SalesOrder_WD_20 Entity for which the key string shall be generated
	 * @param {object} oMockserver object from where the metadata will be accessed
	 * @param {string} sEntitySet OData Entity for which the key string shall be generated
	 */
	Utils.getKeyString = function (oEntity, oMockserver, sEntitySet) {
		var metadata = oMockserver._oMetadata;
		var entitySets = oMockserver._findEntitySets(metadata);
		var sKeys = oMockserver._createKeysString(entitySets[sEntitySet], oEntity);

		return sKeys;
	};

	Utils.setAssociations = function (oEntry, oMockserver, sEntitySet, sObjectPageEntitySet) {

		if(sObjectPageEntitySet === "") {
			sObjectPageEntitySet = sEntitySet;
		}

		var oMetadata = oMockserver._oMetadata;
		var entitySets = oMockserver._findEntitySets(oMetadata);
		var entitySet = entitySets[sObjectPageEntitySet];
		var serviceName = entitySet.schema;
		//var entityName = entitySet.name;
		var aAssociations = [];
		$.each(entitySet.navprops
			, function (key) {
				aAssociations.push(key);
			});

		var sKey = Utils.getKeyString(oEntry, oMockserver, sEntitySet);
		for (var i = 0; i < aAssociations.length; i++) {
			oEntry[aAssociations[i]] = {
				"__deferred": {
					"uri": "/sap/opu/odata/sap/" + serviceName + "/" + sEntitySet + "(" + sKey + ")/" + aAssociations[i]
				}
			};
		}
		sObjectPageEntitySet = "";
	};

	Utils.getNewEntry = function(oMockserver,sEntitySet,sItemKey,sItemKeyValue){
		var oNewEntry,property,value;
		var sEntitySetType = oMockserver._findEntityTypes(oMockserver._oMetadata)[sEntitySet+"Type"];
		oNewEntry = "{";
		for(var i = 0; i < sEntitySetType.properties.length; i++){
			if(sEntitySetType.properties[i]["type"] === "Boolean" ) {
				if(
					sEntitySetType.properties[i]["name"] === "Copy_ac" ||
					sEntitySetType.properties[i]["name"] === "Edit_ac" ||
					sEntitySetType.properties[i]["name"] === "Delete_mc" ||
					sEntitySetType.properties[i]["name"] === "Update_mc"
				   ) {
					oNewEntry += '"'+sEntitySetType.properties[i]["name"]+'"'+':'+true+",";
				}
				else{
					oNewEntry += '"'+sEntitySetType.properties[i]["name"]+'"'+':'+false+",";
				}

			}
			else if (sEntitySetType.properties[i]["type"] === "DateTimeOffset"){
				oNewEntry += '"'+sEntitySetType.properties[i]["name"]+'"'+':"/Date(1485471600000+0000)/",';
			}
			else if (sEntitySetType.properties[i]["type"] === "Guid"){
				oNewEntry += '"'+sEntitySetType.properties[i]["name"]+'"'+':"'+Utils.getGUID()+'",';
			}
			else if(sEntitySetType.properties[i]["name"] === sItemKey){
				if(sEntitySetType.properties[i]["name"] === "Product" && sItemKeyValue === "4711"){
					oNewEntry += '"'+sEntitySetType.properties[i]["name"]+'"'+':"",';
				}
				else{
					oNewEntry += '"'+sEntitySetType.properties[i]["name"]+'"'+':"'+sItemKeyValue+'",';
				}

			}
			else {
				oNewEntry += '"'+sEntitySetType.properties[i]["name"]+'"'+':"",';
			}
		}
		oNewEntry += "}";
		oNewEntry = JSON.parse(oNewEntry.replace(",}","}"));
		return oNewEntry;
	};

	Utils.getURLParamValue = function(sUrlParams,index) {
		//removes first and last parentheses, if there are any
		sUrlParams = sUrlParams.replace(/[()]/g, '');

		//stores the key-value-pairs of the params in a list of objects
		var sUrlParamsArray = sUrlParams.split(",");
		var sUrlParamsByKey = [];
		sUrlParamsArray.forEach(function (param, loopIndex) {
			var aKeyValuePair = {};
			var aSplittedParam = param.split("=");
			aKeyValuePair["key"] = aSplittedParam[0];
			aKeyValuePair["value"] = aSplittedParam[1];
			sUrlParamsByKey.push(aKeyValuePair);
		});
		if(index!==-1){return sUrlParamsByKey[index];}
		else if(index===-1){return sUrlParamsByKey;}
	};

	return Utils;
});
