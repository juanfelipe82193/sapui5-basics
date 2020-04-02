sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/suite/ui/commons/imageeditor/ImageEditor",
	"sap/suite/ui/commons/imageeditor/ImageEditorContainer"
], function (Controller, Dialog, Button, ImageEditor, ImageEditorContainer) {
	"use strict";

	var oPageController = Controller.extend("sap.suite.ui.commons.sample.ImageEditorContainerDialog.ImageEditorContainer", {
		onPress: function () {
			if (!this.oDialog) {
				this.oDialog = new Dialog({
					title: 'Image Editor',
					verticalScrolling: false,
					stretch: true,
					content: [
						new ImageEditorContainer({
							imageEditor: new ImageEditor({
								src: sap.ui.require.toUrl("sap/m/sample/") + "../../images/demo/nature/ALotOfElephants.jpg"
							})
						})
					],
					beginButton: new Button({
						text: 'Close',
						press: function () {
							this.oDialog.close();
						}.bind(this)
					})
				});
			}

			this.oDialog.open();
		}
	});

	return oPageController;
});
