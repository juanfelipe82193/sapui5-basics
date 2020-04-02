// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/*global sap, jQuery */
sap.ui.define([
	"sap/ushell/appRuntime/ui5/AppRuntimeService",
	'sap/ui/core/mvc/Controller',
	'sap/ushell/Config',
	'sap/ui/model/json/JSONModel'
], function (AppRuntimeService, Controller, oConfig, JSONModel) {
    "use strict";

	return Controller.extend('sap.ushell.demo.AppNavSample.view.Detail', {
		oApplication: null,

		onCreateEndBtn: function() {
			var that = this;
			sap.ushell.renderers.fiori2.Renderer.addHeaderEndItem(
				"sap.ushell.ui.shell.ShellHeadItem",
				{
					id: "idButtonSub",
					icon: "sap-icon://flight",
					tooltip: "subtrut 2 numbers",
					click: function () {
						//alert("header button was clicked. This alert is executed inside the iframe");
						var oView = that.getView();
						oView.byId("idResult").setValue(Number(oView.byId("idNumber1").getValue()) - Number(oView.byId("idNumber2").getValue()));
					}
				},
				true,
				true,
				["app"]);
		},

		onInit: function () {
			var that = this,
				oModel = new JSONModel();
			this.oModel = oModel;
			this.contextualDisplayCoord = this.displayCoordinats.bind(this);
			// set the current user in the model (testing UserInfo service)
			this.getOwnerComponent().getCrossApplicationNavigationService().done(function (oCrossAppNavigator) {
				var bIsInitialNavigation = oCrossAppNavigator.isInitialNavigation(),
					oUserInfoService = sap.ushell.Container.getService("UserInfo");

				//create the setup
				var oProm = AppRuntimeService.sendMessageToOuterShell( "sap.ushell.registry.addHeaderBtn", {});

				oProm.done(function (oRetObj) {
					console.log(oRetObj);
					that.addHeaderBtn = oRetObj.addHeaderEndBtn;
				});


				oModel.setData({
					coordinates: 12,
					userId: oUserInfoService.getId(),
					isInitialNavigation: bIsInitialNavigation ? "yes" : "no",
					isInitialNavigationColor: bIsInitialNavigation ? "green" : "red"
				});
				that.getView().setModel(oModel, "detailView");
				that.getView().getModel("detailView").setProperty("/coordinates", 99);
			});

			this.getOwnerComponent().getService("Configuration").then( function (oService) {
				that.oEventRegistry = oService.attachSizeBehaviorUpdate(that._sizeBehaviorUpdate.bind(that));
			});
		},

		_sizeBehaviorUpdate : function (sSizeBehavior) {
			this.oModel.setProperty("/sizeBehavior", sSizeBehavior);
		},

		detachSizeBehavior : function () {
			this.oEventRegistry.detach();
		},
		attachSizeBehavior : function () {
			var that = this;
			this.getOwnerComponent().getService("Configuration").then( function (oService) {
				that.oEventRegistry = oService.attachSizeBehaviorUpdate(that._sizeBehaviorUpdate.bind(that));
			});
		},

		toggleSizeBehavior: function () {
			var oModel = this.getView().getModel("detailView"),
				sSizeBehavior = oModel.getProperty("/sizeBehavior");
			var sNewSizeBehavior = (sSizeBehavior === "Responsive" ? "Small" : "Responsive");
			oConfig.emit("/core/home/sizeBehavior", sNewSizeBehavior);
		},

		generateLinks: function () {
			this.getOwnerComponent().getRootControl().getController().generateLinks();
			this.byId("xapplist").setVisible(true);
		},
		onFlipPropertyClicked: function (oEvent) {
			var sConfig = oEvent.getSource().data().config;
			var bCurrent = oConfig.last(sConfig);
			oConfig.emit(sConfig, !bCurrent);
		},
		displayCoordinats: function (oEvent) {
			this.getView().getModel("detailView").setProperty("/coordinates", {
				screenX: oEvent.screenX,
				screenY: oEvent.screenY
			});
		},
		onAddEventListener: function (oEvent) {
			document.addEventListener("mousemove", this.contextualDisplayCoord);

		},
		onRemoveEventLister: function (oEvent) {
			document.removeEventListener("mousemove", this.contextualDisplayCoord);
		},

		onAddClickLister: function(oEvent) {
			document.addEventListener("click", this.contextualDisplayCoord);
		},

		onRemoveClickLister: function(oEvent) {
			document.removeEventListener("keypress", this.contextualDisplayCoord);
		},

		onCallTunnelFunction: function (oEvent) {

			this.addHeaderBtn("sap.ushell.ui.shell.ShellHeadItem", {
					id: "idButtonSub",
					icon: "sap-icon://flight",
					tooltip: "subtrut 2 numbers",
					press: function (oParam) {
						console.log(oParam);
						alert("Button pressed!");
						// var oView = that.getView();
						// oView.byId("idResult").setValue(Number(oView.byId("idNumber1").getValue()) - Number(oView.byId("idNumber2").getValue()));
					}
				},
				true,
				true

			);
		}
	});
});
