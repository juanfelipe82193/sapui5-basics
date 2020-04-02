sap.ui.define(["sap/ui/base/Object", "../Utils", "sap/base/util/extend"], function(BaseObject, Utils, extend) {
	"use strict";

	function createEntity(oEntityType) {
		var oResult = {};
		oEntityType.property.forEach(function(oProperty) {
			var vValue;
			switch (oProperty.type) {
				case "Edm.String":
					vValue = "";
					break;
				case "Edm.Boolean":
					vValue = false;
					break;
				case "Edm.Decimal":
					vValue = 0;
					break;
				case "Edm.Guid":
					vValue = "00000000-0000-0000-0000-000000000000";
					break;
				case "Edm.DateTimeOffset":
					vValue = "/Date(0000000000000+0000)/";
					break;
				default:
					vValue = ""; // unknown datatype => treat as string for the time being
			}
			oResult[oProperty.name] = vValue;
		});
		return oResult;
	}

	function buildNavigationProperties(oEntity, oEntityType) {
		oEntityType.navigationProperty.forEach(function(oNavProp) {
			oEntity[oNavProp.name] = {
					__deferred: {
						uri: oEntity.__metadata.uri + "/" + oNavProp.name
					}
			};
		})
	}

	function getMethods(sComponentId, sBaseURL, oMockServer) {
		// private instance data
		var oMetaModel; // not yet available, can be retrieved with first request (when app is running)

		function getMetaModel() {
			oMetaModel = oMetaModel || sap.ui.getCore().getComponent(sComponentId).getModel().getMetaModel();
			return oMetaModel;
		}

		function ensureUniqueKey(oEntity, oEntityType){
			var oProperty = oEntityType.key.propertyRef.find(function(oProperty){
				return oMetaModel.getODataProperty(oEntityType, oProperty.name).type === "Edm.Guid";
			})
			if (oProperty){
				oEntity[oProperty.name] = Utils.getGUID();
				return;
			}
			// for the time being, let's assume there is always a guid in the key
			// alternatively, we could create a unique number (maximum of all existing entities + 1), or a unique string (add some character to the longest existing one),...
			debugger;
		}

		function enableDraftActions(oEntity, oEntityType){
			// set some technical properties to true:
			// tode: don't rely on property names!
			// applicable path for functions defined in DraftRoot
			// updateablePath defined in EntitySet
			oEntity.Update_mc = oEntity.Edit_ac = oEntity.Activation_ac = oEntity.Validation_ac = oEntity.Preparation_ac = true;
		}

		function addMockData(oEntity, sEntitySet) {
			var aEntities = oMockServer.getEntitySetData(sEntitySet);
			aEntities.push(oEntity);
			oMockServer.setEntitySetData(sEntitySet, aEntities);
		}

		function buildMetadata(oEntity, oEntitySet) {
			var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);
			oEntity.__metadata = {
					uri: sBaseURL + oEntitySet.name + "(",
					type: oEntitySet.entityType
			};
			oEntityType.key.propertyRef.forEach(function(oProperty) {
				oEntity.__metadata.uri += oProperty.name + "=";
				switch (oMetaModel.getODataProperty(oEntityType, oProperty.name).type) {
					case "Edm.Guid":
						oEntity.__metadata.uri += "guid'" + oEntity[oProperty.name] + "',";
						break;
					case "Edm.Boolean":
						oEntity.__metadata.uri += oEntity[oProperty.name] + ",";
						break;
					default:
						oEntity.__metadata.uri += "'" + oEntity[oProperty.name] + "',";
				}
			})
			oEntity.__metadata.uri = oEntity.__metadata.uri.slice(0, -1) + ")";
		}

		function handleDraftRootCreate(sEntitySet, oXhr, sUrlParams) {
			var oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
			var oEntityType = oMetaModel.getODataEntityType(oEntitySet.entityType);

			var oCreateDraft = createEntity(oEntityType);
			ensureUniqueKey(oCreateDraft, oEntityType);
			enableDraftActions(oCreateDraft, oEntityType);
			addMockData(oCreateDraft, sEntitySet);
			buildMetadata(oCreateDraft, oEntitySet);
			buildNavigationProperties(oCreateDraft, oEntityType);

			var sEntityTypeDraftAdminData = oMetaModel.getODataAssociationEnd(oEntityType, "DraftAdministrativeData").type;
			var oEntityTypeDraftAdminData = oMetaModel.getODataEntityType(sEntityTypeDraftAdminData);
			var oDraftAdminData = createEntity(oEntityTypeDraftAdminData);
			extend(oDraftAdminData, {
				DraftUUID: oCreateDraft.DraftUUID
			});

			var oEntitySetDraftAdminData = oMetaModel.getODataEntityContainer().entitySet.find(function(oEntitySet) {
				return oEntitySet.entityType === sEntityTypeDraftAdminData;
			});

			addMockData(oDraftAdminData, oEntitySetDraftAdminData.name);

			oXhr.respondJSON(201, {}, {
				d: oCreateDraft
			});

			return true;
		}

		function analyzeRequest(oXhr, sUrlParams) {
			var sHash = oXhr.url.split(sBaseURL)[1];
			if (sHash.match(/^\w+$/)) { // direct post on one entitySet => create
				var oEntitySet = oMetaModel.getODataEntitySet(sHash);
				if (oEntitySet && oEntitySet["com.sap.vocabularies.Common.v1.DraftRoot"]){
					return {
						type: "DraftRootCreate",
						entitySet: sHash
					};
				}
			}
			return {
				type: "unknown"
			};
		}

		function handleRequest(oXhr, sUrlParams) {
			getMetaModel(); // to ensure, oMetaModel is initialized
			var oMyRequest = analyzeRequest(oXhr, sUrlParams);
			switch (oMyRequest.type) {
				case "DraftRootCreate":
					return handleDraftRootCreate(oMyRequest.entitySet, oXhr, sUrlParams);
					break;
				default:
					return false; // request not handled => maybe Mockserver itself can handle it
			};
		}

		function getRequestHandler() {
			return {
				method: "POST",
				path: new RegExp(/\w+$/),
				response: handleRequest
			}
		}

		return {
			getRequestHandler: getRequestHandler
		};
	}

	return BaseObject.extend("test.sap.suite.ui.generic.template.utils.mockserver.RequestHandler", {
		constructor: function(sComponentId, sBaseURL, oMockServer) {
			extend(this, getMethods(sComponentId, sBaseURL, oMockServer));
		}
	});
});
