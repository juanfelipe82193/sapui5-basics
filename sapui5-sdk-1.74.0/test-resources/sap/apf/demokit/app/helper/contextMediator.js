jQuery.sap.declare('sap.apf.demokit.app.helper.contextMediator');
sap.apf.demokit.app.helper.ContextMediator = (function() {
	var ContextMediator = function(oApi) {
		var aContextChangedListeners = []; // List of contextChanged event listeners.
		/**
		 * Method to attach contextChanged Listeners.
		 * */
		var onContextChange = function(fnListener) {
			if (typeof fnListener === 'function') {
				aContextChangedListeners.push(fnListener);
			} else {
				jQuery.sap.log.error("Wrong argument for onContextChanged.");
			}
		};
		/**
		 * Invokes all registered Listeners on contextChanged event.
		 * */
		var fnCallbackForContextChange = function() {
			var self = this;
			aContextChangedListeners.forEach(function(fnListener) {
				fnListener.apply(self);
			});
		};
		/**
		 * Listen to sap.apf.contextChanged Event.
		 * */
		oApi.setEventCallback(oApi.constants.eventTypes.contextChanged, fnCallbackForContextChange);
		return {
			// Method to attach contextChanged Listeners.
			onContextChange : onContextChange
		};
	};
	var instance = null;
	var _static = {
		name : "ContextMediator",
		getInstance : function(oApi) {
			if (!instance) {
				instance = new ContextMediator(oApi);
			}
			return instance;
		},
		destroyInstance : function() {
			instance = null;
		}
	};
	return _static;
}());
