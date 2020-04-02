sap.ui.define([
           	"sap/ui/vbdemos/component/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.vbdemos.travel.Main", {
			onInit: function() {
				var oModel = new sap.ui.model.json.JSONModel();
				var oController = this;
				this.getView().setModel(oModel);
				$.getJSON("travel/cars.json", function(data) {
					oModel.setData(data);
					var oContext = oModel.getContext("/timeentries/0");
					oController.getView().setBindingContext(oContext);
				});
				
			},
//			onSlide : function(oEv) {
//				sap.m.MessageToast.show("slide");
//			},
			onLiveSlide : function(oEv) {
				var oModel = this.getView().getModel();
				var iSelectValue = oEv.getParameter("value");
				var oContext = oModel.getContext("/timeentries/"+iSelectValue);
				
				this.getView().setBindingContext(oContext);
			//	sap.m.MessageToast.show("liveslide");
			}
	});

});