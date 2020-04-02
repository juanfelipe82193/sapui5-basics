// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([
	"sap/ushell/appRuntime/ui5/services/TunnelsAgent",
	"sap/ushell/appRuntime/ui5/AppRuntimePostMessageAPI",
	'jquery.sap.global',
	'sap/ui/Device',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/json/JSONModel'
], function (tunnelsAgent, postMessageAPI, jQuery, Device, Controller, JSONModel) {
    "use strict";

    var that;
	var outerShellClickHandler = tunnelsAgent.usePairedInterface({
		sService: "sap.ushell.pairedInterface",
		sMethodName: "clickCallback",
		fnPackArgs: function(event) {
			return {
				screenX: event.screenX,
				screenY: event.screenY
			}
		}
	});

	var outerShellFunction = function () {
		var text = that.byId("demoText").getValue(),
			textValue = text ? text : "No text entered";
		tunnelsAgent.callTunnel({
			tunnelName: "demoFunction",
			oData: [{demo: textValue}]
		}).then(function(data) {
			that.getView().getModel("data").setProperty("/textFromOuterShellFunction", data);
		});
	};
	
	var innerShellClickHandler = function (event) {
		that.getView().getModel("data").setProperty("/localCoordinates", {
			screenX: event.screenX,
			screenY: event.screenY
		});
	};

	var innerShellMouseMoveHandler = function (event) {
		that.getView().getModel("data").setProperty("/moveCoordinates", {
			screenX: event.screenX,
			screenY: event.screenY
		});
	};

    sap.ui.controller("sap.ushell.demo.EventDelegationDemoApp.App", {
        onInit: function () {
            var oData = new JSONModel({
	            localCoordinates: {
		            screenX: undefined,
		            screenY: undefined
	            },
	            remoteCoordinates: {
		            screenX: undefined,
		            screenY: undefined
	            },
	            moveCoordinates: {
		            screenX: undefined,
		            screenY: undefined
	            },
	            textFromOuterShellFunction: ""
            });
	        that = this;
            this.getView().setModel(oData, "data");

	        postMessageAPI.registerCommHandlers({
		        "sap.ushell.demo": {
			        "oInboundActions": {
				        "passCoordinates": {
					        executeServiceCallFn: function (oMessageData) {
						        var oData = JSON.parse(oMessageData.oMessage.data);
						        that.getView().getModel("data").setProperty("/remoteCoordinates", {
							        screenX: oData.body.screenX,
							        screenY: oData.body.screenY
						        });
					        }
				        }
			        }
		        }
	        });

	        tunnelsAgent.reflectEvents({
		        "addmousemove": {
			        iInterface: document,
			        sFuncName: "addEventListener",
			        fnProxy: function (eventType, fnCallback, useCapture) {
				        var oCallback = {};
				        if (fnCallback.getPairedInterface) {
					        oCallback = {
						        pairedInterface: fnCallback.getPairedInterface()
					        };
				        } else {
					        oCallback = fnCallback;
				        }
				        return [eventType, oCallback, useCapture];
			        },
			        fnSpy: function (eventType) {
				        return eventType === "mousemove";
			        }
		        },
		        "removemousemove": {
			        iInterface: document,
			        sFuncName: "removeEventListener",
			        fnProxy: function (eventType, fnCallback, useCapture) {
				        var oCallback = {};
				        if (fnCallback.getPairedInterface) {
					        oCallback = {
						        pairedInterface: fnCallback.getPairedInterface()
					        };
				        } else {
					        oCallback = fnCallback;
				        }
				        return [eventType, oCallback, useCapture];
			        },
			        fnSpy: function (eventType) {
				        return eventType === "mousemove";
			        }
		        }
	        });
        },

	    onAddInnerShellListener: function () {
		    document.addEventListener("click", innerShellClickHandler);
	    },

		onRemoveInnerShellListener: function () {
			document.removeEventListener("click", innerShellClickHandler);
	    },

	    onAddOuterShellListener: function () {
		    document.addEventListener("click", outerShellClickHandler);
	    },

		onRemoveOuterShellListener: function () {
			document.removeEventListener("click", outerShellClickHandler);
	    },

	    onAddMouseMoveListener: function () {
			document.addEventListener("mousemove", innerShellMouseMoveHandler)
	    },

	    onRemoveMouseMoveListener: function () {
		    document.removeEventListener("mousemove", innerShellMouseMoveHandler)
	    },

	    onCallOuterShellFunction: function () {
		    outerShellFunction();
	    }

    });


}, /* bExport= */ false);
