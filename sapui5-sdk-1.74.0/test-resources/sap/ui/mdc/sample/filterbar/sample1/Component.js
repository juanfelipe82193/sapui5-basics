/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	'jquery.sap.global', 'sap/ui/core/UIComponent', "sap/ui/core/mvc/ViewType", 'sap/ui/fl/FakeLrepConnectorLocalStorage',  "sap/ui/model/odata/OperationMode", "sap/ui/model/odata/v4/ODataModel", 'sap/ui/core/mvc/View'
], function(jQuery, UIComponent, ViewType, FakeLrepConnectorLocalStorage, OperationMode, ODataModel, View) {
	"use strict";

	return UIComponent.extend("sap.ui.mdc.sample.filterbar.sample1.Component", {
		metadata: {
			manifest: "json"
		},

		init: function() {

			FakeLrepConnectorLocalStorage.enableFakeConnector();
			UIComponent.prototype.init.apply(this, arguments);
		},
		exit: function() {
			UIComponent.prototype.exit.apply(this, arguments);
			FakeLrepConnectorLocalStorage.disableFakeConnector();
		},
		createContent: function() {
			this._bCalled = true;
			return this.oView;
		},
		_addContent: function(oView) {
			this.oView = oView;
			if (this._bCalled) {
				this.setAggregation("rootControl", oView);
			}
		},
		createContent2 : function () {

//			var mModelOptions = {
//					serviceUrl: "/sap/opu/odata4/sap/sadl_gw_appmusicro_service/sadl_srvd/sap/sadl_gw_appmusicro_definition/0001/",
//					groupId: "$direct",
//					synchronizationMode: 'None',
//					autoExpandSelect: true,
//					operationMode: OperationMode.Server
//				};


//				var oModel = new ODataModel(mModelOptions), oMetaModel = oModel.getMetaModel();
//				this.setModel(oModel);
	//
//				oMetaModel.requestObject("/").then(function() {
//					this.setModel(oModel);
//				}.bind(this));

//			var oViewSettings = {
//				async: true,
//				id: "filterbarSampleView",
//				models: {
//					undefined: this.getModel(),
//					'sap.ui.mdc.metaModel': this.getModel().getMetaModel()
//				},
//				type: ViewType.XML,
//				viewName: "sap.ui.mdc.sample.filterbar.sample1.Test"
//			};
//
//			oViewSettings.preprocessors = jQuery.extend(oViewSettings.preprocessors, {
//				xml: {
//					bindingContexts: {},
//					models: {
//						'sap.ui.mdc.metaModel': this.getModel().getMetaModel()
//					}
//				}
//			});

			var oMetaModel = this.getModel().getMetaModel();
			return oMetaModel.requestObject("/").then(function() {
				var oViewSettings = {
						async: true,
						id: "filterbarSampleView",
						models: {
							undefined: this.getModel(),
							'sap.ui.mdc.metaModel': this.getModel().getMetaModel()
						},
						type: ViewType.XML,
						viewName: "sap.ui.mdc.sample.filterbar.sample1.Test"
					};

					oViewSettings.preprocessors = jQuery.extend(oViewSettings.preprocessors, {
						xml: {
							bindingContexts: {},
							models: {
								'sap.ui.mdc.metaModel': this.getModel().getMetaModel()
							}
						}
					});

//				var oViewPromise;
//				//oComp.runAsOwner(function(){
//					oViewPromise = View.create(oViewSettings);
//					oViewPromise.then(function(oView){
//						oComp._addContent(oView);
//						return oView;
//					});
//
//				//});
				return View.create(oViewSettings);
			});


		}
	});
});
