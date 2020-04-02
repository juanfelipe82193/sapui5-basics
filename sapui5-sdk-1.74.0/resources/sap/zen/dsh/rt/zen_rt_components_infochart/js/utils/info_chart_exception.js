/* global define */

define("zen.rt.components.infochart/js/utils/info_chart_exception", [], function(){

	"use strict";

	function InfoChartException(key, context) {
		// Just a guard incase someone forgets the 'new' keyword
		if ( !(this instanceof InfoChartException) ) {
			return new InfoChartException(key, context);
		}
		this.message = key;
		this.context = context;
		if (Error.captureStackTrace) {
		 	Error.captureStackTrace(this, this.constructor);
		}
	}

	InfoChartException.prototype = new Error();
	InfoChartException.prototype.constructor = InfoChartException;
	InfoChartException.prototype.name = "InfoChartException";

	return InfoChartException;
});