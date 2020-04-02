sap.ui.define([
		"../Utils",
		"sap/base/util/deepExtend",
		"sap/suite/ui/generic/template/lib/AjaxHelper"
	],
	function(Utils, deepExtend, AjaxHelper) {
		"use strict";

		/**
		 * Handle an OData create Request for given app
		 * @param {object} oXhr xhr object to send the response
		 * @param {string} sUrlParams optional URL parameter
		 * @returns {boolean} true
		 */
		function _handleCreateRequest(oXhr, sUrlParams, oMockserver, oMockServerStandard) {

			var sMainEntitySet = oMockserver._oDraftMetadata.draftRootName;
			var sObjectPageEntitySet = oXhr.requestBody.split(".")[1].replace('Type"}}','');
			var sServiceName = oXhr.requestBody.split(".")[0].split(":")[2].replace('"','');
			var sEntitySetForMetadataSetup = sMainEntitySet === sObjectPageEntitySet? sMainEntitySet : sObjectPageEntitySet;

			if(sUrlParams === "" || typeof  sUrlParams === "undefined"){
				var sItemKey = oMockserver._findEntitySets(oMockserver._oMetadata)[sMainEntitySet].keys[0];
				var sItemKeyValue = "4711";
			}
			else{
				var anItem = Utils.getURLParamValue(sUrlParams, 0);
				sItemKey = anItem.key;
				sItemKeyValue = anItem.value.replace(/(')/g, '');

				/*var sItemKey = sUrlParams.split(",")[0].split("=")[0].slice(1);
				var sItemKeyValue = sUrlParams.split(",")[0].split("=")[1].slice(1,-1);*/
			}

			var aData = sap.ui.core.util.MockServer.prototype.getEntitySetData.apply(oMockserver, [sEntitySetForMetadataSetup]);
			var oNewEntry = Utils.getNewEntry(oMockserver,sEntitySetForMetadataSetup,sItemKey,sItemKeyValue);

			// add the navigation properties
			Utils.setAssociations(oNewEntry, oMockserver, sMainEntitySet, sObjectPageEntitySet);
			// adjust mock data field control to reflect a real backend response
			_setC_DefaultEditEnabledFieldControl(oNewEntry);

			oMockserver.setEntitySetData(sEntitySetForMetadataSetup, aData);
			// create the response
			oNewEntry.__metadata = {
				"id": "/sap/opu/odata/sap/"+sServiceName+"/"+sEntitySetForMetadataSetup+"(" + Utils.getKeyString(oNewEntry,oMockserver,sMainEntitySet) + ")",
				"uri": "/sap/opu/odata/sap/"+sServiceName+"/"+sEntitySetForMetadataSetup+"(" + Utils.getKeyString(oNewEntry,oMockserver,sMainEntitySet) + ")",
				"type": sServiceName+"."+sEntitySetForMetadataSetup+"Type"
			};
			aData.unshift(oNewEntry);
			var oResponse = {
				"d": oNewEntry
			};
			oXhr.respondJSON(200, {}, JSON.stringify(oResponse));

			return true;
		}

		/**
		 * Handle an intercepted OData edit Request
		 * @param {object} oXhr xhr object to send the response
		 * @param {object} oMockserver which contains draft specific information
		 * @returns {boolean} true
		 */
		function _handleEditRequest(oXhr, oMockserver) {

			var aFilter = Utils.getFiltersFromURL(oXhr.url);

			//determine the path & the entityset
			var sServiceName,sEntitySet,sUrlPart;
			sServiceName = oMockserver._oDraftMetadata.mockServerRootUri.split("/")[oMockserver._oDraftMetadata.mockServerRootUri.split("/").length-2];
			sEntitySet = oMockserver._oDraftMetadata.draftRootName;
			sUrlPart = oMockserver._oDraftMetadata.mockServerRootUri+sEntitySet;
			var sObjectPageEntitySet = oXhr.requestBody === null ? "" :  oXhr.requestBody.split(".")[1].replace('Type"}}','');
			//url: "/sap/opu/odata/sap/STTA_SALES_ORDER_WD_20_SRV/C_STTA_SalesOrder_WD_20?$filter=" + aFilter.join(" and "),
			var oResponse = AjaxHelper.sjax({
				url: sUrlPart + "?$filter=" + aFilter.join(" and "),
				dataType: "json"
			});

			if (!oResponse.success || !oResponse.data.d.results[0]) {
				// respond negative - no entity found
				oXhr.respond(404);
			}
			var oEntry = oResponse.data.d.results[0];
			if (!oEntry.IsActiveEntity || oEntry.HasDraftEntity) {
				// respond negative - edit draft is only valid for an active document. If a business document already has an edit draft,
				// the Edit action fails; there can be at most one edit draft per active business document.
				oXhr.respond(400);
			}
			//  creates a deep copy of the business document.
			var oDraftEntry = deepExtend({}, oEntry);
			oDraftEntry.IsActiveEntity = false; // true for active documents
			oDraftEntry.HasActiveEntity = true; // false for new drafts and active documents
			oDraftEntry.HasDraftEntity = false;
			oDraftEntry.DraftUUID = Utils.getGUID();

			// add the navigation properties
			Utils.setAssociations(oDraftEntry, oMockserver, sEntitySet, sObjectPageEntitySet);

			// add the metadata for the entry
			oDraftEntry.__metadata = {
				"id": sUrlPart + "(" + Utils.getKeyString(oDraftEntry, oMockserver, sEntitySet) + ")",
				"uri": sUrlPart + "(" + Utils.getKeyString(oDraftEntry, oMockserver, sEntitySet) + ")",
				"type": sServiceName + "." + sEntitySet + "Type"
			};


			// adjust mock data field control to reflect a real backend response
			_setC_DefaultEditEnabledFieldControl(oDraftEntry);

			//TODO Generic way to handle this.
			// Specific Enable/Disable added for maintaining status of Edit requests
			if (Boolean(oDraftEntry.Setenabledstatus_ac)) {
				oDraftEntry.Setenabledstatus_ac = oEntry.Setenabledstatus_ac;
			}

			if (Boolean(oDraftEntry.Setenabledstatus_ac)) {
				oDraftEntry.Setdisabledstatus_ac = oEntry.Setdisabledstatus_ac;
			}

			//var aData = oMockserver.getEntitySetData(sEntitySet);
			var aData = sap.ui.core.util.MockServer.prototype.getEntitySetData.apply(oMockserver, [sEntitySet]);

			if (oDraftEntry.SalesOrder) { //for SAVE specific implementation in Sales order app
				for (var i = 0; i < aData.length; i++) {
					if (aData[i].SalesOrder === oDraftEntry.SalesOrder) {
						aData[i] = oDraftEntry;
						break;
					}
				}
			} else {
				aData.push(oDraftEntry);
			}

			for (var i = 0; i < aData.length; i++) {
				Utils.setAssociations(aData[i], oMockserver, sEntitySet, sEntitySet);
			}
			oMockserver.setEntitySetData(sEntitySet, aData);
			// update the active with HasDraftEntity = true
			oResponse = AjaxHelper.sjax({
				url: oEntry.__metadata.uri,
				type: "PATCH",
				data: JSON.stringify({
					HasDraftEntity: true
				})
			});
			oXhr.respondJSON(200, {}, JSON.stringify({
				d: oDraftEntry
			}));
			return true;
		}


		/**
		 * Define or redefine all field control properties of the given C_STTA_SalesOrder_WD_20 entry to reflect
		 * a backend response for an EDIT request. Thus enabling the fields for edit.
		 * @param {object} oDraftEntry C_STTA_SalesOrder_WD_20 json object
		 *
		 */
		function _setC_DefaultEditEnabledFieldControl(oDraftEntry) {
			/*eslint-disable camelcase
			oDraftEntry.Activation_ac = true;
			oDraftEntry.Edit_ac = false;
			oDraftEntry.Messageval_ac = true;
			oDraftEntry.Preparation_ac = true;
			oDraftEntry.Setcurrency_ac = true;
			oDraftEntry.Setopportunityid_ac = true;
			oDraftEntry.Showsinglemsg_ac = true;
			oDraftEntry.Validation_ac = true;
			oDraftEntry.Delete_mc = true;
			oDraftEntry.Update_mc = true;
			/*eslint-enable camelcase*/
			$.each(oDraftEntry, function (key) {
				if(typeof key.split("_")[1] !== 'undefined' && key.split("_")[1].length === 2 ){
					oDraftEntry[key] = true;
				}
			});
		}

		function fnCreate(aRequests, oMockserver) {
			"use strict";
			var sPath = "";
			if (typeof oMockserver._oDraftMetadata === 'undefined'){
				//non-draft case
			} else {
				//draft
				sPath = oMockserver._oDraftMetadata.draftRootName+"(.*)\/|"+oMockserver._oDraftMetadata.draftRootName+"$";
			}
			aRequests.push({
				method: "POST",
				//path: new RegExp("C_STTA_SalesOrder_WD_20(.*)\\/to_Item"),
				path: new RegExp(sPath),
				response: function (oXhr, sUrlParams) {
					return _handleCreateRequest(oXhr, sUrlParams, oMockserver);

				}.bind(this)
			});
		}

		function fnEdit(aRequests, oMockServer) {
			"use strict";

			var sPath = "";
			if (typeof oMockServer._oDraftMetadata === 'undefined'){
				//non-draft case
			} else {
				//draft
				sPath = oMockServer._oDraftMetadata.draftRootEditName+"(\\?(.*))?";
			}

			aRequests.push({
				method: "POST",
				//path: new RegExp(/C_STTA_SalesOrder_WD_20Edit(\?(.*))?/),
				path: new RegExp(sPath),
				response: function (oXhr) {
					return _handleEditRequest(oXhr,oMockServer);
				}.bind(this)
			});

		}

		function fnMerge(aRequests, oMockServer){
			var sPath = "";
			if (typeof oMockServer._oDraftMetadata === 'undefined'){
				//non-draft case
			} else {
				//draft
				sPath = oMockServer._oDraftMetadata.draftNodes[1] === undefined ? oMockServer._oDraftMetadata.draftNodes[0]+"(.*)" :oMockServer._oDraftMetadata.draftNodes[1]+"(.*)";
			}
			aRequests.push({
				method: "MERGE",
				//path: new RegExp(/C_STTA_SalesOrder_WD_20Edit(\?(.*))?/),
				path: new RegExp(sPath),
				response: function () {
					return true;
				}.bind(this)
			});
		}

		return {
			create : fnCreate,
			edit : fnEdit,
			merge: fnMerge
		};
	});
