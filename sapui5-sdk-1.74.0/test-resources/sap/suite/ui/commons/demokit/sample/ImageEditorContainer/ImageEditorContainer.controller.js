sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/m/upload/Uploader"
], function (Controller, MessageToast, JSONModel, Device, Uploader) {
	"use strict";

	var oPageController = Controller.extend("sap.suite.ui.commons.sample.ImageEditorContainer.ImageEditorContainer", {
		onInit: function () {
			var oImageEditor = this.getView().byId("image"),
				oModel = new JSONModel({
					blocked: true
				});

			this.getView().setModel(oModel);

			oImageEditor.setSrc(
				sap.ui.require.toUrl("sap/m/sample/") + "../../images/demo/nature/ALotOfElephants.jpg"
			);

			if (!Device.browser.msie) {
				// svg files are not supported in Internet Explorer
				oImageEditor.setCustomShapeSrc(sap.ui.require.toUrl("sap/suite/ui/commons/statusindicator") + "/shapes/bulb.svg");
			}
		},

		onImageLoaded: function() {
			var oImageEditor = this.getView().byId("image");

			this.getView().getModel().setProperty("/blocked", !oImageEditor.getSrc());
		},

		onSaveAsPress: function() {
			var oImageEditor = this.getView().byId("image");

			oImageEditor.openSaveDialog();
		},

		onUploadPress: function() {
			var oImageEditor = this.getView().byId("image");

			oImageEditor.getImageAsBlob().then(function(oBlob) {
				Uploader.uploadFile(oBlob, "upload/").then(function(oReq) {
					MessageToast.show("File uploaded completed: " + oReq.status);
				}, function(oReq) {
					MessageToast.show("File uploaded failed: " + oReq.status);
				});
			});
		},

		onFileChange: function(oEvent) {
			var oFile = oEvent.getParameter("files")[0],
				oImageEditor = this.getView().byId("image");

			if (!oFile) {
				return;
			}

			this.getView().getModel().setProperty("/blocked", true);
			oImageEditor.setSrc(oFile);
		}
	});

	return oPageController;
});
