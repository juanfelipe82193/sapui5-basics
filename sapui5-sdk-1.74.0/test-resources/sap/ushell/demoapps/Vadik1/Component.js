(function () {
	"use strict";

	/*global jQuery, sap */
	jQuery.sap.declare("sap.ushell.demo.Vadik1.Component");
	jQuery.sap.require("sap.ui.core.Component");

	// new Component
	sap.ui.core.Component.extend("sap.ushell.demo.Vadik1.Component", {

		metadata : {
			"manifest": "json"
		},

		init: function () {

			var callbacks = {},
				oEvents = {
					"addmousemove": {
						oInterface: document,
						sFuncName: "addEventListener",
						fnProxy: function (type, fnCallback, useCapture) {
							var oCallback,
								nUUID,
								timeout = 500,
								inTimeout = false;
							if (fnCallback.getUUID) {
								nUUID = fnCallback.getUUID();
								if (callbacks[nUUID]) {
									oCallback = callbacks[nUUID]
								} else {
									oCallback = function(event) {
										if (!inTimeout) {
											fnCallback({
												screenX: event.screenX,
												screenY: event.screenY
											});
											inTimeout = true;
											setTimeout(function(){
												inTimeout = false;
											}, timeout);
										}
									};
									callbacks[nUUID] = oCallback;
								}
							} else {
								oCallback = fnCallback;
							}
							return [type, oCallback, useCapture];
						},
						fnSpy: function(type) {
							return type === "mousemove";
						}
					},

					"removemousemove": {
						oInterface: document,
						sFuncName: "removeEventListener",
						fnProxy: function(type, fnCallback, useCapture) {
							var original = fnCallback,
								nUUID = original.getUUID(),
								delegationCallback = callbacks[nUUID];

							return [type, delegationCallback, useCapture];
						},
						fnSpy: function(type) {
							return type === "mousemove";
						}
					}
				};



			this.getService("AppIsolationService").then(function (AppIsolationService) {

				AppIsolationService.registerEvents(oEvents);
			});
		}
	});
})();
