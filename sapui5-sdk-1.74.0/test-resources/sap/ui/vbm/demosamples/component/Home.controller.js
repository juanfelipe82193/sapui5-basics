sap.ui.define([
           	"sap/ui/vbdemos/component/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("sap.ui.vbdemos.component.Home", {

		onDisplayNotFound : function (oEvent) {
			// display the "notFound" target without changing the hash
			this.getRouter().getTargets().display("notFound", {
				fromTarget : "home"
			});
		},
		onInit : function () {
			var oModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(oModel);
			var oController = this;
			$.getJSON("./component/manifest.json",function (data) {
				var oData = {};
				
				var aRoutes = data["sap.ui5"].routing.routes.filter(function (route,index,routes) {
					return route.published === "true";
				});
				
				oData["routes"] = aRoutes;
				
				var aWorkinprogress = data["sap.ui5"].routing.routes.filter(function (route,index,routes) {
					return route.published === "wip";
				});
				oData["wip"] = aWorkinprogress;
				oModel.setData(oData);
			});
		},
		onTilePressed : function (oEvent){
			
			var sTarget = oEvent.getSource().getBindingContext().getObject().target;
			this.getRouter().navTo(sTarget);
		}

	});

});
