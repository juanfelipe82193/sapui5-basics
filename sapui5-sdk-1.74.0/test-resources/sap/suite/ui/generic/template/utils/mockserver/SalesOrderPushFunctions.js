sap.ui.define([
		"../Utils",
		"sap/base/util/deepExtend",
		"sap/suite/ui/generic/template/lib/AjaxHelper"
	],
	function (Utils, deepExtend, AjaxHelper) {

		var getParamsFromURL = function (sURL) {
			var aUrl = sURL.split("?");
			var aUrlParams = aUrl && aUrl[1] && aUrl[1].split("&");
			var oObject = {};
			if (aUrlParams){
				for (var i = 0; i < aUrlParams.length; i++) {
					var sParamValue = aUrlParams[i];
					var rKeyValue = new RegExp("(.*)=(.*)");
					var aRes;
					if (sParamValue) {
						aRes = rKeyValue.exec(sParamValue);
						var name = aRes[1];
						var value = aRes[2];
						value = value.split(/'/i).join('');
						oObject[name] = value;
					}
				}
			}
			return oObject;
		};

		function _getEntry(sUrlPart, aFilter, oResponseReferenece) {
			oResponseReferenece.oResponse = AjaxHelper.sjax({
				url: sUrlPart + "?$filter=" + aFilter.join(" and "),
				dataType: "json"
			});
			if (!oResponseReferenece.oResponse.success || !oResponseReferenece.oResponse.data.d.results[0]) {
				return false;
			}
			return oResponseReferenece.oResponse.data.d.results[0];
		}

		function _setEntry(oMockserver, sEntitySet, oEntry) {
			var aData = oMockserver.getEntitySetData(sEntitySet);
			for (var i = 0; i < aData.length; i++) {
				if (aData[i].SalesOrder === oEntry.SalesOrder) {
					aData[i] = oEntry; // check for shallow copy
					break;
				}
			}
			for (var i = 0; i < aData.length; i++) {
				Utils.setAssociations(aData[i], oMockserver, sEntitySet, sEntitySet);
			}
			oMockserver.setEntitySetData(sEntitySet, aData);
		}

		function _handleEnableDisableRequest(oXhr, sUrlParams, oMockserver, bEnable) {

			var aFilter = Utils.getFiltersFromURL(oXhr.url);
			var sServiceName,sEntitySet,sUrlPart;
			sServiceName = oMockserver._oDraftMetadata.mockServerRootUri.split("/")[oMockserver._oDraftMetadata.mockServerRootUri.split("/").length-2];
			sEntitySet = oMockserver._oDraftMetadata.draftRootName;
			sUrlPart = oMockserver._oDraftMetadata.mockServerRootUri+sEntitySet;

			var oResponseReferenece = {
					oResponse: null
				};
			var oEntry = _getEntry(sUrlPart, aFilter, oResponseReferenece);

			if (oEntry) {
				if (bEnable) {
					oEntry.EnabledStatus = true;
					oEntry.Setenabledstatus_ac = false;
					oEntry.Setdisabledstatus_ac = true;
				} else {
					oEntry.EnabledStatus = false;
					oEntry.Setenabledstatus_ac = true;
					oEntry.Setdisabledstatus_ac = false;
				}

				var oResponse = oResponseReferenece.oResponse;
				oResponse = {
					"d": oEntry
				};
				//_setEntry(oMockserver, sEntitySet, oEntry);

				// to test the option of setting a result directly, _setEntry was deactivated. The system should not automatically navigate to the OP
				oXhr.respondJSON(200, {}, JSON.stringify(oResponse));
				//oXhr.respond(204);
			} else {
				oXhr.respond(404);
			}
			return true;
		}

		function _handleRaiseGrossAmount(oXhr, sUrlParams, oMockserver) {

			var aFilter = Utils.getFiltersFromURL(oXhr.url);
			var sServiceName,sEntitySet,sUrlPart;
			sServiceName = oMockserver._oDraftMetadata.mockServerRootUri.split("/")[oMockserver._oDraftMetadata.mockServerRootUri.split("/").length-2];
			sEntitySet = oMockserver._oDraftMetadata.draftRootName;
			sUrlPart = oMockserver._oDraftMetadata.mockServerRootUri+sEntitySet;

			var oResponseReferenece = {
				oResponse: null
			};
			var oEntry = _getEntry(sUrlPart, aFilter, oResponseReferenece);
			if (oEntry) {
				oEntry.GrossAmount = oEntry.GrossAmount + 5000;   // to provide a bigger amount than checked in the "Cheap" variant

				var oResponse = oResponseReferenece.oResponse;
				oResponse = {
					"d": oEntry
				};

				_setEntry(oMockserver, sEntitySet, oEntry);
				oXhr.respond(204);
			} else {
				oXhr.respond(404);
			}
			return true;
		}


		function fnSalesOrderPush(aRequests, oMockserver) {
			"use strict";
			var sPath = "";
			if (typeof oMockserver._oDraftMetadata === 'undefined'){
				//non-draft case
			} else {
				//draft
				sPath = oMockserver._oDraftMetadata.draftRootName+"(.*)";
			}

			aRequests.push({
				method: "POST",
				path: new RegExp(oMockserver._oDraftMetadata.draftRootName+"Setenabledstatus"+"(.*)"),
				response: function (oXhr, sUrlParams) {
					return _handleEnableDisableRequest(oXhr, sUrlParams, oMockserver, true);
					return false;
				}.bind(this)
			});
			aRequests.push({
				method: "POST",
				path: new RegExp(oMockserver._oDraftMetadata.draftRootName+"Setdisabledstatus"+"(.*)"),
				response: function (oXhr, sUrlParams) {
					return _handleEnableDisableRequest(oXhr, sUrlParams, oMockserver, false);
					return false;
				}.bind(this)
			});
			aRequests.push({
				method: "POST",
				path: new RegExp(oMockserver._oDraftMetadata.draftRootName+"Raisegrossamount"+"(.*)"),
				response: function (oXhr, sUrlParams) {
					return _handleRaiseGrossAmount(oXhr, sUrlParams, oMockserver);
					return false;
				}.bind(this)
			});
			aRequests.push({
				method: "POST",
				path: new RegExp(oMockserver._oDraftMetadata.draftRootName+"Create_simple"+"(.*)"),
				response: function (oXhr, sUrlParams) {
					var oDialog = new sap.m.Dialog({
						title: oMockserver._oDraftMetadata.draftRootName,
						beginButton: new sap.m.Button({
							text: 'OK',
							press: function () {
								oDialog.close();
							}
						})
					});
					oDialog.open();
					oXhr.respond(204);
					return true;
				}.bind(this)
			});
			aRequests.push({
				method: "POST",
				path: new RegExp(oMockserver._oDraftMetadata.draftRootName+"Showsinglemsg"+"(.*)"),
				response: function (oXhr, sUrlParams) {

					function wait(ms) {
						var waitDateOne = new Date();
						while ((new Date()) - waitDateOne <= ms) {
							//Nothing
						}
					}
					wait(3000);

					var oParams = getParamsFromURL(oXhr.url);
					var iNumberOfMessages = oParams.NumberOfMessages || 1;
					var sSeverity = oParams.Severity || "error";

					var oResultResponse = {};
					oResultResponse.data = {};
					oResultResponse.data.d = {};
					oResultResponse.data.d.results = {};

					//oXhr.respondJSON(200, {}, oResultResponse.data);
					//oXhr.respondJSON(400, {}, '{"error": {"severity": "Error", "message": "Not all mandatory fields filled"}}');
					//oResultResponse.data.d.message = { "sap-message" : {"code":"SEPMRA_PRODUCT/131","message":"Currency gg5 does not exist","severity":"error","target":"Currency","transition":false,"details":[]}};

					/*showing of message currently does not have an effect on the UI*/
					var sHeaderMsgString = JSON.stringify({
						"code": "ABC/0815",
						"message": "test message",
						//"longtext_url": oResult.message,
						"severity": sSeverity,
						"target": "",
						"transient": true, //"transition": true, both will be supported with https://git.wdf.sap.corp/3901598
						"details": []
					});

					oXhr.respondJSON(200, {"Content-Type": "application/json",
											"sap-message": sHeaderMsgString,
											"my-custom-header": "HelloWorld"  }, oResultResponse.data);

					return true;
				}.bind(this)
			});
		}

		function fnSave(aRequests, oMockServer) {
			"use strict";

			var sRootUri = oMockServer._getRootUri();
			var sRootUriRelative = sRootUri;
			if (sRootUriRelative.charAt(0) === "/"){
				sRootUriRelative = sRootUriRelative.replace("/", "");
			}

			// SiblingEntity
			aRequests.push({
				method: 'GET',
				path: new RegExp("C_STTA_SalesOrder_WD_20(.*)\\/SiblingEntity"),
				response: function (oXhr, SalesOrder, DraftUUID, IsActiveEntity) {
					var sSalesOrderID = SalesOrder.split("'")[1].split("'")[0];
					var oResponse = AjaxHelper.sjax({
						url: sRootUri + "C_STTA_SalesOrder_WD_20_Sibling?$filter=SalesOrder eq '" + sSalesOrderID +
						"'",
						dataType: "json"
					});
					var aSiblingData = oMockServer.getEntitySetData("C_STTA_SalesOrder_WD_20_Sibling");
					if (oResponse.data.d.results[0]) {
						oResponse.data.d.results[0].__metadata = {
								"id": sRootUriRelative + "C_STTA_SalesOrder_WD_20(SalesOrder='" + sSalesOrderID +
								"',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)",
								"type": "STTA_SALES_ORDER_WD_20_SRV.C_STTA_SalesOrder_WD_20Type",
								"uri": sRootUriRelative + "C_STTA_SalesOrder_WD_20(SalesOrder='" + sSalesOrderID +
								"',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)"
						};
					}
					oXhr.respondJSON(200, {}, JSON.stringify({
						d: oResponse.data.d.results[0]
					}));
					return true;
				}.bind(this)
			});

			// Preparation
			aRequests.push({
				method: 'POST',
				path: new RegExp("C_STTA_SalesOrder_WD_20Preparation\\?SalesOrder=(.*)&DraftUUID=(.*)&IsActiveEntity=(.*)"),
				response: function (oXhr, SalesOrder, DraftUUID, IsActiveEntity) {
					//TODO Use response object
					var oResponse = AjaxHelper.sjax({
						url: sRootUri + "C_STTA_SalesOrder_WD_20?$filter=SalesOrder eq '" + sSalesOrderID + "'",
						dataType: "json"
					});
					var aData = oMockServer.getEntitySetData("C_STTA_SalesOrder_WD_20");
					var sSalesOrderID = SalesOrder.replace(/'/g, "");
					var oEditDraft;
					for (var i = 0; i < aData.length; i++) {
						if (aData[i].SalesOrder === sSalesOrderID) {
							oEditDraft = aData[i];
							break;
						}
					}
					if (oResponse) {
						oXhr.respondJSON(200, {}, JSON.stringify({
							d: oEditDraft
						}));
						return true;
					}
				}.bind(this)
			});

			// Delete
			aRequests.push({
				method: 'DELETE',
				path: new RegExp(/C_STTA_SalesOrder_WD_20((.*))/),
				response: function (oXhr, SalesOrder, DraftUUID, IsActiveEntity) {
					var sSalesOrderID = SalesOrder.split("'")[1].split("'")[0];
					var aData = oMockServer.getEntitySetData("C_STTA_SalesOrder_WD_20");
					var oEditDraft, oRecord;
					for (var i = 0; i < aData.length; i++) {
						if (aData[i].SalesOrder === sSalesOrderID) {
							oRecord = deepExtend({}, aData[i]);
							aData.splice(i, 1);
							break;
						}
					}
					var oResponse = AjaxHelper.sjax({
						url: sRootUri + "C_STTA_SalesOrder_WD_20_Sibling?$filter=SalesOrder eq '" + sSalesOrderID +
						"'",
						dataType: "json"
					});
					if (oResponse.data.d.results[0] && (oRecord.IsActiveEntity.toString() === "false")) {
						oResponse.data.d.results[0].__metadata = {
								"id": sRootUriRelative + "C_STTA_SalesOrder_WD_20(SalesOrder='" + sSalesOrderID +
								"',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)",
								"type": "STTA_SALES_ORDER_WD_20_SRV.C_STTA_SalesOrder_WD_20Type",
								"uri": sRootUriRelative + "C_STTA_SalesOrder_WD_20(SalesOrder='" + sSalesOrderID +
								"',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)"
						};
						aData.push(oResponse.data.d.results[0]);
						Utils.setAssociations(oResponse.data.d.results[0], oMockServer, "C_STTA_SalesOrder_WD_20", "C_STTA_SalesOrder_WD_20");
					}
					for (var i = 0; i < aData.length; i++) {
						Utils.setAssociations(aData[i], oMockServer, "C_STTA_SalesOrder_WD_20", "C_STTA_SalesOrder_WD_20");
						aData[i].DraftAdministrativeData = {
								"__deferred": {
									"uri": sRootUri + "C_STTA_SalesOrder_WD_20(SalesOrder" + aData[i].SalesOrder +
									"',DraftUUID=guid'" + aData[i].DraftUUID + "',IsActiveEntity=" + aData[i].IsActiveEntity + ")/DraftAdministrativeData"
								}
						}
					}
					oMockServer.setEntitySetData("C_STTA_SalesOrder_WD_20", aData);
					if (sSalesOrderID === "500000013") {
						// SalesOrder "500000013" should never be deleted to check failing delete scenarios
						oXhr.respond(400);
					} else {
						oXhr.respond(204);
					}
					return true;
				}.bind(this)
			});

			// Activation
			aRequests.push({
				method: 'POST',
				path: new RegExp("C_STTA_SalesOrder_WD_20Activation\\?SalesOrder=(.*)&DraftUUID=(.*)&IsActiveEntity=(.*)"),
				response: function (oXhr, SalesOrder, DraftUUID, IsActiveEntity) {
					var sSalesOrderID = SalesOrder.replace(/'/g, "");
					//TODO Use response object
					var oResponse = AjaxHelper.sjax({
						url: sRootUri + "C_STTA_SalesOrder_WD_20?$filter=SalesOrder eq '" + sSalesOrderID + "'",
						dataType: "json"
					});
					var aData = oMockServer.getEntitySetData("C_STTA_SalesOrder_WD_20");
					var oEditDraft;
					for (var i = 0; i < aData.length; i++) {
						if (aData[i].SalesOrder === sSalesOrderID) {
							oEditDraft = aData[i];
							break;
						}
					}
					oEditDraft.DraftUUID = "00000000-0000-0000-0000-000000000000";
					oEditDraft.IsActiveEntity = true;
					oEditDraft.Activation_ac = false;
					oEditDraft.HasActiveEntity = false;
					oEditDraft.HasDraftEntity = false;
					Utils.setAssociations(oEditDraft, oMockServer, "C_STTA_SalesOrder_WD_20", "C_STTA_SalesOrder_WD_20");
					oResponse.data = JSON.stringify(oEditDraft);
					for (var i = 0; i < aData.length; i++) {
						if (aData[i].SalesOrder === sSalesOrderID) {
							aData[i] = oEditDraft;
						}
						aData[i].DraftAdministrativeData = {
								"__deferred": {
									"uri": sRootUri + "C_STTA_SalesOrder_WD_20(SalesOrder" + aData[i].SalesOrder +
									"',DraftUUID=guid'" + aData[i].DraftUUID + "',IsActiveEntity=" + aData[i].IsActiveEntity + ")/DraftAdministrativeData"
								}
						}
					}
					oMockServer.setEntitySetData("C_STTA_SalesOrder_WD_20", aData);
					oEditDraft.__metadata = {
							"id": sRootUriRelative + "C_STTA_SalesOrder_WD_20(SalesOrder='" + oEditDraft.SalesOrder +
							"',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)",
							"type": "STTA_SALES_ORDER_WD_20_SRV.C_STTA_SalesOrder_WD_20Type",
							"uri": sRootUriRelative + "C_STTA_SalesOrder_WD_20(SalesOrder='" + oEditDraft.SalesOrder +
							"',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)"
					};
					oResponse = {
							"d": oEditDraft
					};
					var oResponse = AjaxHelper.sjax({
						url: sRootUri + "C_STTA_SalesOrder_WD_20_Sibling?$filter=SalesOrder eq '" + sSalesOrderID +
						"'",
						dataType: "json"
					});
					var aSiblingData = oMockServer.getEntitySetData("C_STTA_SalesOrder_WD_20_Sibling");
					for (var i = 0; i < aSiblingData.length; i++) {
						if (sSalesOrderID === aSiblingData[i].SalesOrder) {
							aSiblingData[i] = oEditDraft;
						} else {
							aSiblingData.push(oEditDraft);
						}
					}
					for (var i = 0; i < aSiblingData.length; i++) {
						aSiblingData[i].DraftAdministrativeData = {
								"__deferred": {
									"uri": sRootUri + "C_STTA_SalesOrder_WD_20(SalesOrder" + aSiblingData[i].SalesOrder +
									"',DraftUUID=guid'" + aSiblingData[i].DraftUUID + "',IsActiveEntity=" + aSiblingData[i].IsActiveEntity +
									")/DraftAdministrativeData"
								}
						}
					}
					oMockServer.setEntitySetData("C_STTA_SalesOrder_WD_20_Sibling", aSiblingData);
					oXhr.respondJSON(200, {}, JSON.stringify({
						d: oEditDraft
					}));
					return true;
				}.bind(this)
			});
		}

		return {
			salesorderpush : fnSalesOrderPush,
			save: fnSave
		};
	});
