
sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";
	return Controller.extend("vbm-regression.tests.64.controller.App", {

		onInit: function() {
			var data = {
				mapConfiguration: GLOBAL_MAP_CONFIG
			};
			var model = new sap.ui.model.json.JSONModel(data);
			this.getView().setModel(model);
		},

		onClickOne: function (e) {
			var oVBI = this.getView().byId("vbi");
			var AreaOne = this.getView().byId("AreaOne").getId();
			oVBI.zoomToAreasById([AreaOne], 0.99);
		},

		onClickTwo: function (e){
			var oVBI = this.getView().byId("vbi");
			var AreaTwo = this.getView().byId("AreaTwo").getId();
			oVBI.zoomToAreasById([AreaTwo], 0.99);
		},

		onClickMultiple: function (e){
			var oVBI = this.getView().byId("vbi");
			var AreaOne = this.getView().byId("AreaOne").getId();
			var AreaTwo = this.getView().byId("AreaTwo").getId();
			oVBI.zoomToAreasById([AreaOne, AreaTwo], 0.99);
		}
	});
});
