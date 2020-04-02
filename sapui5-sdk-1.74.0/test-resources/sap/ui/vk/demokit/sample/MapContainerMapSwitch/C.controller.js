sap.ui.define([
				"sap/ui/model/json/JSONModel",
				"sap/ui/Device"
               ],function(JSONModel, Device) {
	"use strict";

	sap.ui.controller("sap.ui.vk.sample.MapContainerMapSwitch.C", {
		
		onInit : function () 
		{
//			var oModel = new sap.ui.model.json.JSONModel("test-resources/sap/ui/vk/demokit/sample/MapContainerMapSwitch/Data.json");
//			this.getView().setModel(oModel);
		 // set the device model
			var oDeviceModel = new JSONModel(Device);
			oDeviceModel.setDefaultBindingMode("OneWay");
			this.getView().setModel(oDeviceModel, "device");
		 }
	});


}, /* bExport= */ true);
