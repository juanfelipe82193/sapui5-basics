sap.ui.define(["sap/ui/core/util/MockServer", "sap/ui/model/odata/v2/ODataModel"],
	function (MockServer, ODataModel) {
		"use strict";
		
		var oMockModel, oMetaModel;
		
		var getMockModel = function() {
			var oModel, oMockServer;
			// the mockservice to get a suitable MetadataModel

			oMockServer = new MockServer({
				rootUri: "/sap/opu/odata/sap/SEPMRA_PROD_MAN/"
			});
			// take the mock meta data file from the demokit product application
			oMockServer.simulate("test-resources/sap/suite/ui/generic/template/demokit/sample.stta.manage.products/webapp/localService/metadata.xml", {
				sMockdataBaseUrl: "test-resources/sap/suite/ui/generic/template/demokit/sample.stta.manage.products/webapp/localService/",
				bGenerateMissingMockData: true
			});
			oMockServer.start();

			// setting up model
			oModel = new ODataModel("/sap/opu/odata/sap/SEPMRA_PROD_MAN/", {
				// both annotations files are needed to have a suitable meta model
				annotationURI: [
					"test-resources/sap/suite/ui/generic/template/demokit/sample.stta.manage.products/webapp/localService/STTA_PROD_MAN_ANNO_MDL.xml",
					"test-resources/sap/suite/ui/generic/template/demokit/sample.stta.manage.products/webapp/annotations/annotations.xml"
				]
			});

			oModel.setSizeLimit(10);
			return oModel;
		};
		
		oMockModel = getMockModel();
		oMetaModel = oMockModel.getMetaModel();
		
		var fnGetODataEntityType = function (sEntityType) {
			return oMetaModel.getODataEntityType("STTA_PROD_MAN.STTA_C_MP_ProductType");	
		};
		
		var fnGetODataProperty = function (oType, sPath, bAsPath){
			if (sPath.indexOf("/") !== -1){ 
				var aAssociationParts = sPath.split("/");
				var oAssociationEnd = oMetaModel.getODataAssociationEnd(oType, aAssociationParts[0]);
				var oEntityType = oMetaModel.getODataEntityType(oAssociationEnd.type, bAsPath);
				return oMetaModel.getODataProperty(oEntityType, aAssociationParts[1]);
			}
			else {
				return oMetaModel.getODataProperty(oType, sPath, bAsPath);
			}	
		};
		
		var fnGetODataEntitySet = function (sName, bAsPath) {
			return oMetaModel.getODataEntitySet(sName, bAsPath);
		};
		
		return {
			"model": oMockModel,
			"metaModel": oMetaModel,
			"getEntityType": fnGetODataEntityType,
			"getEntityProperty": fnGetODataProperty,
			"getEntitySet": fnGetODataEntitySet
		}
	}
);