//(function mFn() {
//	"use strict";

/*eslint-disable no-unused-vars */

//jQuery.sap.declare("sap.suite.ui.generic.template.demokit.mockFunctions");

// some constants for the Mock Log
var MS_LOG_DEFAULT_IDENTIFER = "MSLog:"; // MockLog Prefix in the console
											// output
// sap.ui.require( [],function() {
// "use strict";

// helpfull filter values for console log
var MS_LOG_TAG_INPUT = "[INPUT]"; // incomming requests from the application
var MS_LOG_TAG_REQUESTPUSH = "[REQUESTPUSH]"; // enter the PUSH request
var MS_LOG_TAG_AJAXREQUEST = "[AJAXREQUEST]"; // created request for the mock server
var MS_LOG_TAG_REQUEST = "[REQUEST]"; // created request for the mock server
var MS_LOG_TAG_SETREQUEST = "[SETREQUEST]"; // Set all Requests back to Mockserver
var MS_LOG_TAG_BROWSER = "[BROWSER]"; // show the browser version
var MS_LOG_TAG_RESPONSE = "[RESPONSE]"; // response send to the application
var MS_LOG_TAG_AJAXRESPONSE = "[AJAXRESPONSE]"; // response send to the application
var MS_LOG_TAG_FLOW = "[FLOW]"; // mock server processing flow
var MS_LOG_TAG_ERROR = "[MESSAGE]"; // mock server message fot implementation
									// issues

var oML = new MockLog();

function _doAllLogTags() {
	"use strict";
	oML.log(MS_LOG_TAG_INPUT);
	oML.log(MS_LOG_TAG_REQUESTPUSH);
	oML.log(MS_LOG_TAG_REQUEST);
	oML.log(MS_LOG_TAG_AJAXREQUEST);
	oML.log(MS_LOG_TAG_SETREQUEST);
	oML.log(MS_LOG_TAG_BROWSER);
	oML.log(MS_LOG_TAG_RESPONSE);
	oML.log(MS_LOG_TAG_AJAXRESPONSE);
	oML.log(MS_LOG_TAG_FLOW);
	oML.log(MS_LOG_TAG_ERROR);
}


function _showAllRequestsInLog (aRequests) {
	for (var i = 0; i < aRequests.length ; i++ ) {
		var resp = aRequests[i];
		oML.log(MS_LOG_TAG_REQUEST, "[" + i + "]" + "method:" + resp.method.toString());
		oML.log(MS_LOG_TAG_REQUEST, "[" + i + "]" + "path:" + resp.path.toString());
		oML.log(MS_LOG_TAG_REQUEST, "[" + i + "]" + "cb:" + resp.response.toString());
	}
}


function _checkRegExp(sUrlPath, sTestUrl) {
	"use strict";
	oML.log(MS_LOG_TAG_FLOW, "_checkRegExp", "sTestUrl:", sTestUrl,
			"sUrlPath:", sUrlPath);

	if (!sTestUrl) {
		throw new Error("mandatory parameter is empty");
	}
	// no path for RegExp, anything is allowed
	if (!sUrlPath) {
		oML.log(MS_LOG_TAG_FLOW, "RegExp:", rExp
				+ " path is EMPTY: use local reply");
		return true;
	}
	// remodel real RegExp via string
	if (sUrlPath.search("/") !== -1) {
		var rExpSb = new RegExp(/^\//); // starts with "/"
		var rExpSe = new RegExp(/\/[igm?]?[igm?]?$/); // Regeg ends with "/"
		// and optinal flag
		// i,g,m
		if (rExpSb.test(sUrlPath) && rExpSe.test(sUrlPath)) {
			sUrlPath = sUrlPath.replace(/^\//, "");
			sUrlPath = sUrlPath.replace(/\/[igm?]?[igm?]?$/, "");
		}
	}

	var rExp = new RegExp(sUrlPath);
	if (rExp) {
		if (!rExp.test(sTestUrl)) {
			oML.log(MS_LOG_TAG_FLOW, "RegExp:", rExp
					+ " path does not match: USE_MOCKSERVER");
			return false;
		}
	}
	oML.log(MS_LOG_TAG_FLOW, "RegExp:", rExp
			+ " path does MATCH: use local reply");
	return true;
}

function _checkUseMockserver(sUrl) {
	"use strict";
	oML.log(MS_LOG_TAG_FLOW, "_checkUseMockserver", "sUrl:", sUrl);
	if (sUrl) {
		if (sUrl.indexOf("&USE_MOCKSERVER") !== -1) {
			oML.log(MS_LOG_TAG_FLOW, "USE_MOCKSERVER");
			return true;
		}
		oML.log(MS_LOG_TAG_FLOW, "use local reply");
		return false;
	} else {
		throw new Error("mandatory parameter is empty")
		oML.log(MS_LOG_TAG_FLOW, "throw error: mandatory parameter not set");
	}
}

function _getParametersfromURL(oUriParameters) {
	"use strict";
	oML.log(MS_LOG_TAG_FLOW, "_getParametersfromURL");
	return {
		sMethod : oUriParameters.get("method") || 'GET',
		iStatusCode : parseInt(oUriParameters.get("statusCode"), 10) || 200,
		sPath : oUriParameters.get("path") || "/.*/i",
		sMessages : oUriParameters.get("messages") || 'I',
		bMockLog : oUriParameters.get("mockLog") || false
	};
}

function _updateInputFromSelection(oUIPar, oURLPar) {
	"use strict";
	oML.log(MS_LOG_TAG_FLOW, "_updateInputFromSelection");

	oUIPar.oMethod.setSelectedKey(oURLPar.sMethod);
	oUIPar.oStatusCode.setSelectedKey(oURLPar.iStatusCode);
	oUIPar.oPath.setValue(oURLPar.sPath);
	oUIPar.oMessages.setSelectedKey(oURLPar.sMessages);
	oUIPar.bMockLog = oURLPar.bMockLog;
}

function _buildURL(oUIPar) {
	"use strict";
	oML.log(MS_LOG_TAG_FLOW, "_buildURL");
	var value = "?method=" + oUIPar.oMethod.getValue() + "&statusCode="
			+ oUIPar.oStatusCode.getValue() + "&path="
			+ oUIPar.oPath.getValue() + "&messages="
			+ oUIPar.oMessages.getValue() + "&mockLog=" + oUIPar.bMockLog;
	return value;
}

function MockLog(bWrite, bCaller) {
	"use strict";
	this.sName = MS_LOG_DEFAULT_IDENTIFER;
	if (bWrite != undefined) {
		this.bWrite = bWrite;
	} else {
		this.bWrite = true;
	}
	if (bCaller != undefined) {
		this.bCaller = bCaller;
	} else {
		this.bCaller = false;
	}
	this.bCallerLineNum = false;
	this.bTimeStamp = false;
}


MockLog.prototype.setName = function(sName) {
	this.sName = sName || MS_LOG_DEFAULT_IDENTIFER;
};


MockLog.prototype.setCaller = function(bCaller, bCallerLineNum) {
	if (bCaller) {
		this.bCaller = true;
		if (bCallerLineNum != undefined) {
			this.bCallerLineNum = bCallerLineNum;
		} else {
			this.bCallerLineNum = false;
		}
	} else {
		this.bCaller = false;
		this.bCallerLineNum = false;
	}
};


MockLog.prototype.setWrite = function(bWrite) {
	this.bWrite = bWrite;
};


MockLog.prototype.setTimeStamp = function(bTimeStamp) {
	this.bTimeStamp = bTimeStamp;
};


MockLog.prototype.getSourceName = function(stackDepth) {
	if (!stackDepth) {
		throw new Error("Mandatory Parameter not set");
	}
	if (this.bWrite) {
		// todo / remove console with sth. from sap library
		/* eslint-disable no-console */
		// console.info(this.sName + "[BROWSER]:userAgent:" +
		// window.navigator.userAgent);
		/* eslint-enable no-console */
	}
	// userAgent values to determine the browser
	// IE: MockLog:BROWSER:userAgent:Mozilla/5.0 (Windows NT 6.1; WOW64;
	// Trident/7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR
	// 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; InfoPath.3; rv:11.0)
	// like Gecko
	// Chrome: MockLog:BROWSER:userAgent:Mozilla/5.0 (Windows NT 6.1; Win64;
	// x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.103
	// Safari/537.36
	// Firefox: MockLog:BROWSER:userAgent:Mozilla/5.0 (Windows NT 6.1; WOW64;
	// rv:40.0) Gecko/20100101 Firefox/40.0
	// Safari: MockLog:BROWSER:userAgent:Mozilla/5.0 (Windows NT 6.1; WOW64)
	// AppleWebKit/534.57.2 (KHTML, like Gecko) Version/5.1.7 Safari/534.57.2
	if (window.navigator.userAgent.indexOf("Chrome/") > 0) {
		var eStack = new Error().stack;
		var sCaller = eStack.split("at ");
		var sLine = sCaller[parseInt(stackDepth, 10)].trim();
		if (stackDepth === 1) {
			if (!this.bCallerLineNum) {
				sLine = sLine.substr(0, sLine.lastIndexOf(".js"));
			}
		} else {
			if (!this.bCallerLineNum) {
				sLine = sLine.substr(0, sLine.lastIndexOf(".js:"));
			}
		}
		return sLine.substr(sLine.lastIndexOf("/") + 1);
	} else {
		return "";
	}
};


MockLog.prototype.timeStamp = function() {
	// produce this "2016-3-15 13:5:38.448"
	var now = new Date();
	var date = [ now.getFullYear(), now.getMonth() + 1, now.getDate() ];
	var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
	return date.join("-") + " " + time.join(":") + "." + now.getMilliseconds();
};


MockLog.prototype.log = function() { /* dynamic parameters within arguments */
	// todo @ SAP - verify call

	var sEntry = "";
	var aParameter = [];
	var sSeparator = " # ";
	var i = 0;
	aParameter[0] = this.sName;

	if (this.bTimeStamp) {
		aParameter.push(this.timeStamp());
	}

	if (this.bCaller) {
		var sSourceName = "";
		sSourceName = this.getSourceName(3);
		if (sSourceName && sSourceName.length > 0) {
			aParameter.push(sSourceName);
		}
	}

	for (i = 0; i < arguments.length; i++) {
		aParameter.push(arguments[i]);
	}

	if (this.bWrite) {
		if (aParameter && aParameter.length > 0) {
			i = 0;
			sEntry += aParameter[i++];
			while (aParameter[i]) {
				if (i > 1) {
					sEntry += sSeparator;
				}
				sEntry += JSON.stringify(aParameter[i++]);
			}
		}
		// sEntry = sPrefix + sPar;
		// todo / remove console with sth. from sap library
		/* eslint-disable no-console */
		console.info(sEntry);
		/* eslint-enable no-console */
		return sEntry;
	}
};

function _createMessage(sMessage, count, sSegment) {
	oML.log(MS_LOG_TAG_FLOW, "sMessage:", sMessage);
	if (!sMessage) {
		throw new Error("mandatory parameter missing")
	}
	var aMessage = sMessage.split("/");
	var sSeverity, sMessageText = "This is a &1 &2 message created by the mock server &3";
	var bTransient = false;
	var sTarget = aMessage[1] || '';

	if (sTarget === "TRANSIENT") {
		sTarget = "/" + sSegment;
		bTransient = true;
	}

	switch (aMessage[0]) {
	case 'E':
		sSeverity = 'error';
		break;
	case 'W':
		sSeverity = 'warning';
		break;
	case 'I':
		sSeverity = 'information';
		break;
	case 'S':
		sSeverity = 'success';
	}

	if (bTransient) {
		sMessageText = sMessageText.replace("&1", "transient");
	} else {
		sMessageText = sMessageText.replace("&1", "state");
	}

	sMessageText = sMessageText.replace("&2", sSeverity);

	if (sTarget) {
		sMessageText = sMessageText.replace("&3", "for target " + sTarget);
	} else {
		sMessageText = sMessageText.replace("&3", "without target");
	}

	var _oMessage = {
		"code" : "XXX/" + count + count + count,
		"message" : sMessageText,
		"severity" : sSeverity,
		"target" : sTarget
	};
	oML.log(MS_LOG_TAG_RESPONSE, "_oMessage:", _oMessage);
	return _oMessage;
}

function _handleMessages(sMessages, sSegment) {
	oML.log(MS_LOG_TAG_FLOW, "sMessages:", sMessages);
	if (!sMessages) {
		throw new Error("mandatory parameter missing")
	}

	var aMessages = sMessages.split(",");
	var aDetailMessages = [];
	var oMessage = {};

	if (aMessages && aMessages.length > 0) {
		for (var i = 1; i < aMessages.length; i++) {
			aDetailMessages.push(_createMessage(aMessages[i], i, sSegment));
		}

		oMessage = _createMessage(aMessages[0], 0, sSegment);
		oMessage.details = aDetailMessages;
	}
	return oMessage;
}
// }());
