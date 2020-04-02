if (!window.sap) {
	window.sap = {};
}

if (!sap.zen) {
	sap.zen = {};
}

var sapbi_page = sapbi_page || {};

var sapbi_showUI5Measures = false;
var sapbi_statisticsStepCounter = 0;

var sapbi_zen_recordrequests = false;
var sapbi_dummy = {};
var sapbi_zen_slvLoaded = true;

function sapbi_getslv() {
	return sapbi_dummy;
}

sapbi_loadUi5 = function(includeURL, attributes) {
	if(!sap.ui || !sap.ui.core){		
		sap.zen.Dispatcher.instance.pauseDispatching();
		
		function onInit() {
			if (sapbi_isMobile === true) {
				$.sap.initMobile({
					"preventScroll" : true,
					//Design Studio already adds viewport tag - so stop UI5 adding another one
					//Viewport handling needs to be revisited for 1.7
					"viewport" : false
				});
			}
			
			sap.ui.getCore().getLibraryResourceBundle("sap.ui.core");
			function _continue() {
				if (! sap.ui.getCore().isThemeApplied() ) {
					setTimeout(_continue, 100);
				} else {
					if (sap.ui.loader && !require.config) {
						sap.ui.loader.config({noConflict: true});
					}
					sap.zen.Dispatcher.instance.resumeDispatching();
				}				
			}
			_continue();
		}
		

		window["sap-ui-config"] = {
			onInit: onInit
		};

		
		var se = document.createElement('script');
		se.type = "text/javascript";
		se.src = includeURL;
		se.charset = 'utf-8';
		se.async = false;
		for (var attribute in attributes) {
			if( attributes.hasOwnProperty(attribute) ) {
				se.setAttribute(attribute, attributes[attribute]);
			} 
		}
		se.setAttribute("data-sap-ui-xx-bindingSyntax", "complex");  // Usefull for SAPUI5 binding having multiple bindings per property
		document.getElementsByTagName('head')[0].appendChild(se);
	}
};

function sapbi_snippet(json, tag) {
	if (sap.zen.Dispatcher.instance.isPaused(function() {
		  sapbi_snippet(json, tag);
		})){
		return;
	}

	var callback = function() {
			sapbi_registerHandlers(arguments);
			sapbi_phx(tag, eval("(" + json + ")"));
	};
	require(sapbi_page.m_required, callback);
}

function sapbi_snippet_ROOT(json) {
	sapbi_snippet(json, "sapbi_snippet_ROOT");

}

function sapbi_snippet_ROOT_DIALOG(json) {
	sapbi_snippet(json, "sapbi_snippet_ROOT_DIALOG");
}


function sapbi_registerHandlers(modules) {
	for(var i=0; i<modules.length; i++) {
		var module = modules[i];
		if (module && module.getType) {
			if (module.getDecorator) {
				sap.zen.Dispatcher.instance.addHandlers(module.getType(), module, module.getDecorator());					
			} else {
				sap.zen.Dispatcher.instance.addHandlers(module.getType(), module);										
			}
		}
	}	
}


function sapbi_phx_process_json(divid, json) {
	var dispatcher = sap.zen.Dispatcher.instance;
	var addToDivFunc = function(oRootGrid) {
		oRootGrid.placeAt(divid, "only");
	};
	dispatcher.dispatch(json, addToDivFunc);
	sap.zen.getLoadingIndicator().hide();
}

sap.zen.iNumberOfJavascriptErrorsLogged = 0;
sap.zen.iMaxNumberOfJavascriptErrorsLogged = 10;

// TODO require.js: should be set via ui5 config object 
// jQuery.sap.log.setLevel(jQuery.sap.log.Level.ERROR);

// XmlHttpRequest sent empty body when called synchronously from onerror handler
function AsyncHandleJavascriptError(message) {

	if (sapbi_page.m_hasSendLock) {
		window.setTimeout(function() {
			AsyncHandleJavascriptError(message);
		}, 100);
		return;
	}
	sap.zen.MessageViewHandler.createMessage(sap.zen.MessageViewHandler.error, message,
			"Please contact your application designer");
	sap.zen.MessageViewHandler.logMessage(sap.zen.MessageViewHandler.error, "A JavaScript error occurred", message);
}

function sapbi_phx(divid, json) {

	if (sapbi_page.m_profileMode) {
		$.sap.measure.setActive(true);
	}
	
	var searchString = "SHOWDEBUGJSON";
	var url = window.location.search.indexOf(searchString);
	if (url !== -1 || sapbi_page.m_isDebugMode) {
		sap.zen.Dispatcher.instance.logJson(json, (url !== -1), divid);
	}

	$.sap.measure.start("zen dispatch", "dispatch");

	if ($.browser.msie) {
		window.onerror = function(msg, url, linenumber, pos) {
			if (sap.zen.iNumberOfJavascriptErrorsLogged < sap.zen.iMaxNumberOfJavascriptErrorsLogged) {
				var currentFunction = "";
				try {
					// arguments.callee.caller does not work in strict mode - so let's do this in a "try/catch"
					currentFunction = arguments.callee.caller;
				} catch (e) {
					currentFunction = "Unknown function name (strict mode)";
				}

				var fn = currentFunction.toString();
				if (!url) {
					url = "N/A";
				}
				if (!linenumber) {
					linenumber = "N/A";
				}
				fn = (fn + "").replace(/\r/g, " ");
				fn = (fn + "").replace(/\n/g, " ");

				var message = 'Error message: ' + msg + ' Line Number: ' + linenumber + ' Pos: ' + pos + " Function: "
						+ fn + ' URL: ' + url;

				// We log a detailed error in eclipse if available
				if (window.eclipse_sendZenUrl) {
					eclipse_sendZenUrl("zen://message?severity=E&message=" + message); // call browser function
					// injected by Eclipse code
				}

				// We log a detailed error in the log
				if ($ && $.sap && $.sap.log) {
					$.sap.log.error("A JavaScript error occurred. " + message);
				}

				// We give a general error message to the user
				if (sap && sap.zen && sap.zen.MessageViewHandler) {
					AsyncHandleJavascriptError(message);
				}

				sap.zen.getLoadingIndicator().hide();
				sap.zen.iNumberOfJavascriptErrorsLogged++;
			}
			return false;
		};

		sapbi_phx_process_json(divid, json);
	} else {

		try {
			sapbi_phx_process_json(divid, json);
		} catch (e) {
			if (sap.zen.iNumberOfJavascriptErrorsLogged < sap.zen.iMaxNumberOfJavascriptErrorsLogged) {
				var message = "A JavaScript error occurred. ";
				if (typeof e === "string") {
					message += e;
				} else {
					message += e.message + " ";
					if (e.stack) {
						message += e.stack + " ";
					}
					if (e.sourceURL) {
						message += e.sourceURL + " ";
					}
					if (e.line) {
						message += e.line + " ";
					}
					if (e.lineNumber) {
						message += e.lineNumber + " ";
					}
				}

				message = (message + "").replace(/\r/g, " ");
				message = (message + "").replace(/\n/g, " ");

				// We log a detailed error in the log
				if ($ && $.sap && $.sap.log) {
					$.sap.log.error(message);
				}

				if (sap.zen.designmode) {
					eclipse_logJavaScriptMessage(message, "error");
				}

				// We give a general error message to the user
				if (sap && sap.zen && sap.zen.MessageViewHandler) {
					sapbi_page.m_hasSendLock = false;
					sap.zen.MessageViewHandler.createMessage(sap.zen.MessageViewHandler.error, message,
							"Please contact your application designer");
					sap.zen.MessageViewHandler.logMessage(sap.zen.MessageViewHandler.error,
							"A JavaScript error occurred", message);
				}

				// We at least kill the loading indicator, so the user can see the message and act.
				sap.zen.getLoadingIndicator().hide();
				sap.zen.iNumberOfJavascriptErrorsLogged++;
			}
		}
	}

	$.sap.measure.end("zen dispatch");

}

if (typeof sapbi_ParameterList !== "undefined") {
	sapbi_ParameterList.prototype.getIndices = function(name) {
		var uppercase_name = name.toUpperCase();
		var p = [];
		var cnt = 0;
		var i;
		for (i in this.m_list[uppercase_name]) {
			if (!isNaN(i)) {
				var numValue = parseInt(i, 10);
				p[cnt++] = numValue;
			}
		}
		return p;
	};
}
