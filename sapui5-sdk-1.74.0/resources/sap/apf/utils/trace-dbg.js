/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2019 SAP SE. All rights reserved.
 */
/* global sap, window */

sap.ui.define([], function () {
	'use strict'

	var module = {
		apfLogStyle : "color: blue; font-style: italic; background-color: wheat;padding: 1px",
		apfWarningStyle : "color: DarkMagenta; font-style: bold; background-color: wheat;padding: 1px",
		apfErrorStyle : "color: white; font-style: bold; background-color: red;padding: 1px",
		logCounter : 0,
		_logBase : function(style, head, name, a1, a2, a3, a4, a5, a6) {
			if (jQuery.sap.log.apfTrace === undefined){//see newDemokit/runtime/Component.js
				return;
			}
			a1 = a1===undefined ? "" : a1 || a1;
			a2 = a2===undefined ? "" : a2 || a2;
			a3 = a3===undefined ? "" : a3 || a3;
			a4 = a4===undefined ? "" : a4 || a4;
			a5 = a5===undefined ? "" : a5 || a5;
			a6 = a6===undefined ? "" : a6 || a6;
			var formatting = "%c%s %s %s ";
			window.console.log(formatting, style, head, module.logCounter, name, a1, a2, a3, a4, a5, a6);
		},
		log : function(name, a1, a2, a3, a4, a5, a6) {
			module._logBase(module.apfLogStyle, "-APF-", name, a1, a2, a3, a4, a5, a6);
		},
		logCall : function(name, a1, a2, a3, a4, a5, a6) {
			++module.logCounter;
			module._logBase(module.apfLogStyle, ">APF>", name, a1, a2, a3, a4, a5, a6);
		},
		logReturn : function(name, a1, a2, a3, a4, a5, a6) {
			module._logBase(module.apfLogStyle, "<APF<", name, a1, a2, a3, a4, a5, a6);
			--module.logCounter;
		},
		emphasize : function(name, a1, a2, a3, a4, a5, a6) {
			module._logBase(module.apfWarningStyle, "-APF-", name, a1, a2, a3, a4, a5, a6);
		}
}	;
	return module;
});