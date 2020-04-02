/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define(['sap/ui/core/Renderer'],
	function () {
		"use strict";

		return {
			render: function (oRM, oNode) {
				var sHtml = oNode._render({
					renderManager: oRM
				});

				if (sHtml) {
					oRM.write(sHtml);
				}
			}
		};
	}, true);
