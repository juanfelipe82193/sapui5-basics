(function () {
	jQuery.sap.declare("sap.ca.scfld.tpo.sample.Configuration");
	jQuery.sap.require("sap.ca.scfld.md.ConfigurationBase");
	jQuery.sap.require("sap.ca.scfld.md.app.Application");
    jQuery.sap.require("sap.ui.thirdparty.URI");
    var URI = sap.ui.require('sap/ui/thirdparty/URI');
	sap.ca.scfld.md.ConfigurationBase.extend("AppScflTest.Configuration", {

		oServiceParams: {
			serviceList: [
				{
					name: "SRA020_PO_TRACKING_SRV",
					masterCollection: "POLists",
					serviceUrl: URI("/sap/opu/odata/sap/SRA020_PO_TRACKING_SRV;mo/").directory(),
					isDefault: true,
					mockedDataSource: "model/metadata.xml"
				}
			]
		},

		getServiceParams: function () {
			return {};//this.oServiceParams;
		},

		/**
		 * @inherit
		 */
		getServiceList: function () {
			return []//this.getServiceParams().serviceList;
		},


		getMasterKeyAttributes: function () {
			return ["SAP__Origin", "PONumber"];
		},

		getDetailTitleKey : function () {
			return "XTIT_PurchaseOrderItems"
		}
	});
})();


