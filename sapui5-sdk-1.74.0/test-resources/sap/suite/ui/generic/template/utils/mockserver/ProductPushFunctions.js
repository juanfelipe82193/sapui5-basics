function ProductPush(aRequests, oMockserver, AjaxHelper) {
	"use strict";

	//Delete
	aRequests.push({
		method: 'DELETE',
		path: /STTA_C_MP_Product\(ProductDraftUUID=(.*),ActiveProduct=('HT-1003'|'HT-1020')\)/g,
		response: function (oXhr, oResponse) {
			oXhr.respondJSON(403, {}, '{"error": {"severity": "Error", "message": "no good"}}');
			return true;
		}
	});

	// push STTA_C_MP_Product Draft
	aRequests.push({
		method: 'GET',
		//                    STTA_C_MP_Product  (Product='HT-1000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)?$expand=SiblingEntity%2CDraftAdministrativeData
		path: new RegExp("(.*)STTA_C_MP_Product\\(Product='HT-1022',DraftUUID=guid'(.*)',IsActiveEntity=(.*)\\)(.*)expand(.*)SiblingEntity(.*)DraftAdministrativeData"),
		response: function(oXhr, sPre, sDraftUUID, sIsActiveEntity, sAfter) {
			var oResponse, oSiblingEntity, sSiblingEntityPath, oCorrespondingSiblingEntityObject;
			var sProduct = 'HT-1022';
			oResponse = AjaxHelper.sjax({
				url: "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_Product(Product='" + sProduct + "',DraftUUID=guid'" + sDraftUUID + "',IsActiveEntity=" + sIsActiveEntity + ")?$expand=DraftAdministrativeData&dummy"
			});

			var sTempIsActiveEntity;
			if ( sDraftUUID === '00000000-0000-0000-0000-000000000000' && sIsActiveEntity === "true" ){
				//add the Draft
				sTempIsActiveEntity = !sIsActiveEntity;
			} else {
				//add the active object
				sTempIsActiveEntity = sIsActiveEntity;
			}
			oSiblingEntity = AjaxHelper.sjax({
				url: "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_Product?$skip=0&$top=25&$filter=(Product eq '" + sProduct + "' and IsActiveEntity eq " + sTempIsActiveEntity + ")&$expand=DraftAdministrativeData&dummy"
			});
			for (var i = 0; i < oSiblingEntity.data.d.results.length; i++){
				oCorrespondingSiblingEntityObject = oSiblingEntity.data.d.results[i];
				if (oResponse.data.d.DraftAdministrativeData.DraftUUID === oCorrespondingSiblingEntityObject.DraftUUID){
					break;
				} else {
					oCorrespondingSiblingEntityObject = {}
				}
			}
			sSiblingEntityPath = "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_Product(Product='" + sProduct + "',DraftUUID=guid'" + oCorrespondingSiblingEntityObject.DraftUUID + "',IsActiveEntity=" + oCorrespondingSiblingEntityObject.IsActiveEntity + ")";

			oResponse.data.d.SiblingEntity = oCorrespondingSiblingEntityObject;
			oResponse.data.d.SiblingEntity.__metadata = {
				uri : sSiblingEntityPath
			};
			oXhr.respondJSON(200, {}, JSON.stringify(oResponse.data));
			if (oResponse) {
				return true;
			}
		}
	});

	// push STTA_C_MP_Product locked Draft
	aRequests.push({
		method: 'GET',
		//                    STTA_C_MP_Product  (Product='HT-1000',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=true)?$expand=SiblingEntity%2CDraftAdministrativeData
		path: new RegExp("(.*)STTA_C_MP_Product\\(Product='HT-1030',DraftUUID=guid'00000000-0000-0000-0000-000000000000',IsActiveEntity=(.*)\\)(.*)expand(.*)DraftAdministrativeData"),
		response: function(oXhr, sPre, sIsActiveEntity, sAfter) {
			var oResponse;
			var sProduct = 'HT-1030';
			var sDraftUUID = '00000000-0000-0000-0000-000000000000';
			oResponse = AjaxHelper.sjax({
				url: "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_Product(Product='" + sProduct + "',DraftUUID=guid'" + sDraftUUID + "',IsActiveEntity=" + sIsActiveEntity + ")?$expand=DraftAdministrativeData&dummy"
			});

			var sJsonFilesModulePath = "STTA_MP/localService";
			var sJsonFilesUrl = sap.ui.require.toUrl(sJsonFilesModulePath);
			var oDraftResponse = AjaxHelper.sjax({
				url: sJsonFilesUrl + "/I_DraftAdministrativeData.json",
				dataType: "json"
			});
			var oDraftData = {};
			if (oDraftResponse.data){
				for(var i = 0; i < oDraftResponse.data.length; i++){
					var oObject = oDraftResponse.data[i];
					if (oObject.DraftUUID == "00505691-2ec5-1ed6-ab93-4fe8b0702b55"){
						oDraftData = oDraftResponse.data[i];
						//oDraftData.DraftIsCreatedByMe = false;
						oResponse.data.d.DraftAdministrativeData = oDraftData;
						break;
					}
				}
			}

			oXhr.respondJSON(200, {}, JSON.stringify(oResponse.data));
			if (oResponse) {
				return true;
			}
		}
	});

	// push STTA_C_MP_ProductEdit
	/*aRequests.push({
		method: 'POST',
		//STTA_C_MP_ProductEdit?PreserveChanges=true&Product='(/(HT)(-)/i)'&DraftUUID=guid'(/(00000000-0000-0000-0000-000000000000)/i(00000000-0000-0000-0000-000000000000))'&IsActiveEntity=true
		//path: new RegExp("STTA_C_MP_ProductEdit\\?ProductDraftUUID=(.*)&ActiveProduct=(.*)"),
		//path: new RegExp("STTA_C_MP_ProductEdit\\?PreserveChanges=true&Product='HT-(\\d{4})'&DraftUUID=guid'(\\d{8})-(\\d{4})-(\\d{4})-(\\d{4})-(\\d{12})'&IsActiveEntity=true"),
		path: new RegExp("STTA_C_MP_ProductEdit\\?PreserveChanges=true&Product='(.*)'&DraftUUID=guid'(.*)'&IsActiveEntity=true"),
		response: function(oXhr) {

			/*var oResponse = jQuery.sap.sjax({
				url: "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_ProductEdit",
				data: JSON.stringify({
					ProductDraftUUID: ProductDraftUUID,
					ActiveProduct: ActiveProduct
				})
			});
			if (oResponse) {
				return true;
			}
			return _handleEditRequest(oXhr,oMockserver);
		}.bind(this)
	});
   */
	// push STTA_C_MP_ProductPreparation
	aRequests.push({
		method: 'POST',
		path: new RegExp("STTA_C_MP_ProductPreparation\\?ProductDraftUUID=(.*)&ActiveProduct=(.*)"),
		response: function (oXhr, ProductDraftUUID, ActiveProduct) {
			var oResponse = AjaxHelper.sjax({
				url : "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_Product?$filter=ActiveProduct eq " + ActiveProduct,
				dataType : "json"
			});
			if (oResponse) {
				return true;
			};
		}
	});

	// push STTA_C_MP_ProductCopywithparams
	aRequests.push({
		method: 'POST',
		path: new RegExp("STTA_C_MP_ProductCopywithparams\\?Supplier=(.*)&ProductDraftUUID=(.*)&ActiveProduct=(.*)"),
		response: function (oXhr, Supplier, ProductDraftUUID, ActiveProduct) {

			if (!Supplier || !ProductDraftUUID || !ActiveProduct) {
				oXhr.respondJSON(400, {}, '{"error": {"severity": "Error", "message": "Not all mandatory fields filled"}}');
				return true;
			}

			var oResponse = AjaxHelper.sjax({
				url:  "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_Product(ProductDraftUUID=" + ProductDraftUUID + ",ActiveProduct=" + ActiveProduct+")",
				dataType : "json"
			});
			oResponse.data.d.Supplier = Supplier;
			oResponse.data.d.ProductDraftUUID = "12345678-1234-0000-0000-000000000000";
			oXhr.respondJSON(200,{}, oResponse.data);
		}
	});

	// push STTA_C_MP_ProductActivation
	aRequests.push({
		method: 'POST',
		path: new RegExp("STTA_C_MP_ProductActivation\\?ProductDraftUUID=(.*)&ActiveProduct=(.*)"),
		response: function (oXhr, ProductDraftUUID, ActiveProduct) {

			// get draft version
			var oResponse = AjaxHelper.sjax({
				url : "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_Product?$filter=IsActiveEntity eq false and HasActiveEntity eq true and ActiveProduct eq " + ActiveProduct,
				dataType : "json"
			});

			var oEditDraft = oResponse.data.d.results[0];

			oResponse = AjaxHelper.sjax({
				url : "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_ProductActivation", // access to sibling not working
				type : 'POST',
				data : JSON.stringify({
					ProductDraftUUID: oEditDraft.ProductDraftUUID,
					ActiveProduct: oEditDraft.ActiveProduct
				})
			});

			if (oResponse && (oResponse.success))  {
				//oXhr.respond(204);
				oXhr.respondJSON(200,{}, oResponse.data);
				return true;
			}
		}
	});
	// push STTA_C_MP_ProductCopy
	aRequests.push({
		method: 'POST',
		path: new RegExp("STTA_C_MP_ProductCopy\\?ProductDraftUUID=(.*)&ActiveProduct=(.*)"),
		response: function (oXhr, ProductDraftUUID, ActiveProduct) {

			if (!ProductDraftUUID || !ActiveProduct) {
				oXhr.respondJSON(400, {}, '{"error": {"severity": "Error", "message": "Not all mandatory fields filled"}}');
				return true;
			}

			var oResponse = AjaxHelper.sjax({
				url:  "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_Product(ProductDraftUUID=" + ProductDraftUUID + ",ActiveProduct=" + ActiveProduct+")",
				dataType : "json"
			});
			oResponse.data.d.ProductDraftUUID = "12345678-1234-0000-0000-000000000000";
			oXhr.respondJSON(200,{}, oResponse.data);
		}
	});
	// push STTA_C_MP_ProductCopyText
	aRequests.push({
		method: 'POST',
		path: new RegExp("STTA_C_MP_ProductCopyText\\?ProductTextDraftUUID=(.*)&ActiveProduct=(.*)&ActiveLanguage=(.*)"),
		response: function (oXhr, ProductTextDraftUUID, ActiveProduct, ActiveLanguage) {

			if (!ProductTextDraftUUID || !ActiveProduct || !ActiveLanguage) {
				oXhr.respondJSON(400, {}, '{"error": {"severity": "Error", "message": "Not all mandatory fields filled"}}');
				return true;
			}

			ProductTextDraftUUID = "guid'00000000-0000-0000-0000-000000000000'";
			var oResponse = AjaxHelper.sjax({
				url:  "/sap/opu/odata/sap/STTA_PROD_MAN/STTA_C_MP_ProductText(ProductTextDraftUUID=" + ProductTextDraftUUID + ",ActiveProduct=" + ActiveProduct + ",ActiveLanguage=" + ActiveLanguage + ")",
				dataType: "json"
			});
			oResponse.data.d.ProductTextDraftUUID = "12345678-1234-0000-0000-000000000000";
			oXhr.respondJSON(200,{}, oResponse.data);
		}
	});
	//For generating auth error in KPI
	aRequests.push({
		method: 'GET',
		path: new RegExp("(KPIERROR)*\\?(.*)"),
		response: function(oXhr) {
			oXhr.respond(403, {"Content-Type": "text/plain;charset=utf-8"}, "Authorization issue");
			return true;
		}
	});

}
