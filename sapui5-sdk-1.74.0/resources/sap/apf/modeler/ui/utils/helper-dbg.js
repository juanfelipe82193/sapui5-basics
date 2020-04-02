/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
/*global window*/
sap.ui.define(function(){
	"use strict";
	var helper = {
		/**
		 * @description callback on resize of the window
		 */
		onResize : function(callback) {
			window.addEventListener("resize", function() {
				callback();
			});
		}
	};
	return helper;
}, true /*GLOBAL_EXPORT*/);
