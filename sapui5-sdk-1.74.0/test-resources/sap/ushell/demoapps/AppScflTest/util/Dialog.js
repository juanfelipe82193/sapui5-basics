jQuery.sap.declare("AppScflTest.util.Dialog");
jQuery.sap.require("sap.ca.ui.quickoverview.EmployeeLaunch");
jQuery.sap.require("sap.ca.ui.quickoverview.CompanyLaunch");
jQuery.sap.require("sap.ca.ui.utils.busydialog");

AppScflTest.util.Dialog = {

	showEmployeeBusinessCard : function(sTitle, sEmployeeIdId, oControl, sOrigin, oApplicationFacade) {
		if (true) { // the Gateway service does not provide employee data in wave 1
			var oEBCData = {
				title : sTitle,
				name : "Matthew Wentworth",
				imgurl : "img/home/Employee_48x48.jpg" ,
				department : "Corporate Functions",
				contactmobile : "01 6502 4040",
				contactphone : "01 6502 6809",
				contactemail : "matthew.wentworth@sct.com",
				contactemailsubj : "Attn to",
				companyname : "SCT Inc.",
				companyaddress : "134 Proctor Hill Rd, Hollis, NH 03049"
			};
			var oEmployeeBusinessCard = new sap.ca.ui.quickoverview.EmployeeLaunch(oEBCData);
			oEmployeeBusinessCard.openBy(oControl);
		}
	},
		
	showSupplierBusinessCard : function(sTitle, sSupplierId, oControl, sOrigin, oApplicationFacade) {
		if (oApplicationFacade.isMock()) {
			var oSBCData = {
				title : sTitle,
				imgurl : "img/home/Company_48x48.jpg" ,
				companyname : "SCT Inc.",
				companyphone : "01 6502 8088",
				companyaddress : "134 Proctor Hill Rd, Hollis, NH 03049",
				maincontactname : "Matthew Wentworth",
				maincontactmobile : "01 6502 4040",
				maincontactphone : "01 6502 6809",
				maincontactemail : "sales@sct.com"
			};
			var oSupplierBusinessCard = new sap.ca.ui.quickoverview.CompanyLaunch(oSBCData);
			oSupplierBusinessCard.openBy(oControl);
		} else {
			var sSupplierDetailsCollection = "SupplierInfoes(SupplierID='" + sSupplierId + "',SAP__Origin='" + sOrigin + "')";
			var aParam = [ "$expand=SupplierContacts" ];
			sap.ca.ui.utils.busydialog.requireBusyDialog();
			oApplicationFacade.getODataModel().read(sSupplierDetailsCollection, null, aParam, true, function(oData, response) {
				sap.ca.ui.utils.busydialog.releaseBusyDialog();
				var hasContacts = (oData.SupplierContacts && (oData.SupplierContacts.length > 0));
				var oSBCData = {
					title : sTitle,
					imgurl : "img/home/Company_48x48.jpg" ,
					companyname : oData.SupplierName,
					companyphone : oData.WorkPhone,
					companyaddress : oData.AddressString,
					maincontactname : hasContacts ? oData.SupplierContacts[0].ContactName : "",
					maincontactmobile : hasContacts ? oData.SupplierContacts[0].MobilePhone : oData.WorkPhone,
					maincontactphone : hasContacts ? oData.SupplierContacts[0].WorkPhone : oData.WorkPhone,
					maincontactemail : hasContacts ? oData.SupplierContacts[0].oData.EMail : oData.EMail,
				};
				var oSupplierBusinessCard = new sap.ca.ui.quickoverview.CompanyLaunch(oSBCData);
				oSupplierBusinessCard.openBy(oControl);
			}, function(oError) {
				sap.ca.ui.utils.busydialog.releaseBusyDialog();
			});
		}
	},

};