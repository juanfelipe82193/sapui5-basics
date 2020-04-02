sap.ui.define(
	[
		"jquery.sap.global",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/Fragment",
		"sap/m/MessageToast",
		"sap/suite/ui/commons/statusindicator/LibraryShape"
	],
	function (jQuery, JSONModel, Controller, Fragment, MessageToast, LibraryShape) {
		"use strict";

		var Ids = Object.freeze({
			INPUT_ID: "shapeIdInput",
			TEXT_AREA_FRAGMENT: "shapeFragmentTextArea",
			POPOVER_FRAGMENT: "popoverFragment"
		});

		return Controller.extend("sap.suite.ui.commons.sample.StatusIndicatorShapesLibrary.App", {
			onInit: function () {
				var oModel = new JSONModel(jQuery.sap.getModulePath("sap.suite.ui.commons.sample.StatusIndicatorShapesLibrary", "/Data.json")),
					oModelSettings = new JSONModel({
						value: 0
					});

				this.getView().setModel(oModel);
				this.getView().setModel(oModelSettings, "settingsData");
			},
			onPressStatusIndicator: function (oEvent) {
				var oSI = oEvent.getSource(),
					sShapeId = oSI.getGroups()[0].getShapes()[0].getShapeId();

				if (!this._oPopover) {
					this._oPopover = sap.ui.xmlfragment(Ids.POPOVER_FRAGMENT, "sap.suite.ui.commons.sample.StatusIndicatorShapesLibrary.Popover", this);
					this.getView().addDependent(this._oPopover);
				}

				this._byIdFromPopoverFragment(Ids.INPUT_ID).setValue(sShapeId);
				this._byIdFromPopoverFragment(Ids.TEXT_AREA_FRAGMENT).setValue("<StatusIndicator>\n<ShapeGroup>\n" +
					"<LibraryShape shapeId=\"" + sShapeId + "\" />\n</ShapeGroup>\n</StatusIndicator>");
				this._oPopover.openBy(oSI);
			},
			onPressCloseButton: function () {
				this._oPopover.close();
			},
			onPressCopyButton: function (sId) {
				this._byIdFromPopoverFragment(sId).$("inner").select();
				document.execCommand("copy");
				MessageToast.show("Copied to clipboard");
			},
			_byIdFromPopoverFragment: function (sId) {
				return Fragment.byId(Ids.POPOVER_FRAGMENT, sId);
			}

		});
	});
