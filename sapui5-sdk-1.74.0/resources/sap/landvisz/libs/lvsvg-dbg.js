/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2013 SAP AG. All rights reserved
 */
sap.ui.define(["sap/ui/thirdparty/d3"], function(d3) {
	"use strict";

	/* global html2canvas */

	var lvsvg = function(){
	};

	lvsvg.getSVG = function(w,h,id){
	    var viewerSVG = d3.select('#'+id)
		.append("svg")
		.attr("width", w)
		.attr("height", h);

		return viewerSVG;
	}

	lvsvg.convertHtmltoCanvas = function(container,navigator){

		html2canvas(container, {
			allowTaint : true,
			useCORS: true,
			onrendered : function(canvas) {
				navigator.show(1000);

				navigator.css({
					'background-image' : "url(" + canvas.toDataURL("image/png") + ")",
					'background-size' : "100% 100%"
				});
			}
		});
	}

	return lvsvg;

}, /* bExport = */ true);
