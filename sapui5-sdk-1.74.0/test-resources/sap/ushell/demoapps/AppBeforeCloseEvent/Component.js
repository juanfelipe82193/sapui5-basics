// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
	"sap/ui/core/Component",
	"sap/ui/core/UIComponent",
	"sap/ui/core/ComponentContainer"
], function (Component, UIComponent, ComponentContainer) {
	"use strict";

	var bInQBS = false,
		iValue = 0;

	return Component.extend("sap.ushell.demo.AppBeforeCloseEvent.Component", {
		metadata : {
			manifest: "json"
		},

		init: function () {
			var that = this;
			//if ((new URI()).query(true).hasOwnProperty("sap-flp-qbs")) {
				bInQBS = true;
				this._processPostMessageEvent = this.processPostMessageEvent.bind(null, that);
				addEventListener("message", this._processPostMessageEvent);
			//}
		},

		processPostMessageEvent: function (oThisPlugin, oMessage) {
			var oMessageData = oMessage.data;

			if (typeof oMessageData === "string") {
				try {
					oMessageData = JSON.parse(oMessage.data);
				} catch (e) {
					oMessageData = {
						service: ""
					};
				}
			}

			if (oMessageData.service === "qbs.AppBeforeCloseEvent.resetValue") {
				iValue = 0;
				oThisPlugin.setState(iValue);
			} else if (oMessageData.service === "qbs.AppBeforeCloseEvent.onBeforeClose") {
				iValue++;
				oThisPlugin.setState(iValue);
			} else if (oMessageData.service === "qbs.AppBeforeCloseEvent.oniFrameClose") {
				iValue++;
				oThisPlugin.setState(iValue);
			}
		},

		setState: function (iNewState) {
			window.flpQBSAppOnCloseState = iNewState;
		},

		exit: function () {
			if (bInQBS) {
				removeEventListener("message", this._processPostMessageEvent);
			}
		}
	});
});
