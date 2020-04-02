sap.ui.define(["demokits/mockFunctions", "sap/base/util/UriParameters"],
	function(mockFunctions, UriParameters) {
		"use strict";
	oML.log(MS_LOG_TAG_FLOW, "demokitErr:loading:");

	var oUriParameters = new UriParameters(window.location.href);
	var bMockLog = oUriParameters.get("mockLog") || false;
	var bMockBox = oUriParameters.get("mockBox") || false;
	var sMethod = oUriParameters.get("method") || 'GET';
	var iStatusCode = parseInt(oUriParameters.get("statusCode"),10) || 200;
	var sPath = oUriParameters.get("path") || "/.*/";
	var sMessages = oUriParameters.get("messages") || '';

	// show dialog only when requested
	if (bMockBox) {
		var oUpdate = new sap.m.Button({
			press : onChange,
			text : 'Update URL'
		});
		// to prevent checkmarx from finding client cross frame scripting attacks -->
		var oMethodLabel = new sap.m.Label({
			text : "Http-Method"
		});
		var oMethod = new sap.m.ComboBox({
			items : [new sap.ui.core.Item({
				key : 'GET',
				text : "GET"
			}), new sap.ui.core.Item({
				key : 'POST',
				text : "POST"
			}), new sap.ui.core.Item({
				key : 'PUT',
				text : "PUT"
			}), new sap.ui.core.Item({
				key : 'DELETE',
				text : "DELETE"
			})]
		});

		var oStatusCodeLabel = new sap.m.Label({
			text : "Status Code"
		});
		var oStatusCode = new sap.m.ComboBox({
			items : [new sap.ui.core.Item({
				key : 200,
				text : "200"
			}), new sap.ui.core.Item({
				key : 201,
				text : "201"
			}), new sap.ui.core.Item({
				key : 202,
				text : "202"
			}), new sap.ui.core.Item({
				key : 400,
				text : "400"
			}), new sap.ui.core.Item({
				key : 401,
				text : "401"
			}), new sap.ui.core.Item({
				key : 403,
				text : "403"
			}), new sap.ui.core.Item({
				key : 404,
				text : "404"
			}), new sap.ui.core.Item({
				key : 423,
				text : "423"
			}), new sap.ui.core.Item({
				key : 500,
				text : "500"
			})]
		});

		var oPathLabel = new sap.m.Label({
			text : "Path"
		});

		var oPath = new sap.m.ComboBox({
			items : [new sap.ui.core.Item({
				key : '.*',
				text : ".*"
			}), new sap.ui.core.Item({
				key : '(Create|Copy|Delete|)',
				text : "(Create|Copy|Delete|)"
			}), new sap.ui.core.Item({
				key : '.*$expand.*',
				text : ".*$expand.*"
			}), new sap.ui.core.Item({
				key : '.*_ToCustomer.*',
				text : ".*ToCustomer.*"
			}), new sap.ui.core.Item({
				key : '.*$metadata.*',
				text : ".*$metadata.*"
			})]
		});

		var oMessagesLabel = new sap.m.Label({
			text : "Messages"
		});

		var oMessage = new sap.m.ComboBox({
			items : [new sap.ui.core.Item({
				key : 'E',
				text : "E"
			}), new sap.ui.core.Item({
				key : 'W',
				text : "W"
			}), new sap.ui.core.Item({
				key : 'I',
				text : "I"
			}), new sap.ui.core.Item({
				key : 'S',
				text : "S"
			}), new sap.ui.core.Item({
				key : 'W/Product',
				text : "W/Product"
			}), new sap.ui.core.Item({
				key : 'E/TRANSIENT',
				text : "E/TRANSIENT"
			}), new sap.ui.core.Item({
				key : 'W/TRANSIENT',
				text : "W/TRANSIENT"
			}), new sap.ui.core.Item({
				key : 'I/TRANSIENT',
				text : "I/TRANSIENT"
			}), new sap.ui.core.Item({
				key : 'S/TRANSIENT',
				text : "S/TRANSIENT"
			}), new sap.ui.core.Item({
				key : 'E,W,I,S',
				text : "E,W,I,S"
			})]
		});


		oMethod.setSelectedKey(sMethod);
		oStatusCode.setSelectedKey(iStatusCode);
		oPath.setValue(sPath);
		// oPath.setSelectedKey(sPath);
		oMessage.setValue(sMessages);
		// oMessage.setSelectedKey(sMessages);

		var oHBox = new sap.m.HBox({
			items : [oMethodLabel, oMethod, oStatusCodeLabel, oStatusCode, oPathLabel, oPath, oMessagesLabel, oMessage, oUpdate]
		});
		oHBox.addStyleClass("mockSettings");
		oHBox.placeAt("content");
	} else {
		var oLabel = new sap.m.Label({
			text : "Mock Server"
		});

		var oHBox = new sap.m.HBox({
			items : [oLabel]
		});
		oHBox.addStyleClass("mockSettings");
		oHBox.placeAt("content");

	}


	function onChange() {
		oML.log(MS_LOG_TAG_FLOW, "demokitErr:onChange:");
		window.location.search = "?method=" + oMethod.getValue() + "&statusCode=" + oStatusCode.getValue() + "&path="
			+ oPath.getValue() + "&messages=" + oMessage.getValue() + "&mockLog=" + bMockLog + "&mockBox=" + bMockBox;
	}

},true);
