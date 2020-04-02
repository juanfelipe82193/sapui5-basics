sap.ui.define([
	'sap/ui/core/mvc/Controller',
	'sap/ui/comp/personalization/Controller',
	'sap/ui/model/odata/v2/ODataModel',
	'personalization/Util',
	'./CustomController',
	'sap/m/Table',
	'sap/m/ColumnListItem'

], function(
	Controller,
	PersonalizationController,
	ODataModel,
	TestUtil,
	CustomController,
	Table,
	ColumnListItem
) {
	"use strict";

	return Controller.extend("view.Main", {

		onInit: function() {

			var oModel = new ODataModel("appUnderTestCustomControl");
			this.getView().setModel(oModel);

			oModel.getMetaModel().loaded().then(function(){
				var oTable = new Table();
				oTable._itemsTemplate = new ColumnListItem();
				TestUtil.addColumnsToMTable(oTable, oModel, "ProductCollection", false);
				setTimeout(function(){
					this.oP13nDialogController = new PersonalizationController({
						table: oTable,
						setting: {
							customColumns: {
								visible: true,
								controller: new CustomController()
							},
							sort: {
								visible: true
							},
							filter: {
								visible: false
							},
							group: {
								visible: false
							},
							columns: {
								visible: false
							}
						}
					});
					this.byId("IDVBox").addItem(oTable);
				}.bind(this),0);
			}.bind(this));
		},

		onP13nDialogPress: function() {
			this.oP13nDialogController.openDialog();
		}
	});
});
