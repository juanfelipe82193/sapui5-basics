sap.ui.define([], function() {
	'use strict';

	function NavigationHandler(oInject){

		this.getNavigationTargets = function() {
			var deferred = jQuery.Deferred();
			deferred.resolve({
				global : [],
				stepSpecific : []
			});

			return deferred.promise();
		};
		this.checkMode = function() {
			var deferred = jQuery.Deferred();
			deferred.resolve({
				navigationMode : "forward"
			});
			return deferred.promise();
		};
		this.navigateToApp = function() {
			
		};
	}
	sap.apf.testhelper.doubles.NavigationHandler = NavigationHandler;
	return NavigationHandler;
}, true /*GLOBAL_EXPORT*/);