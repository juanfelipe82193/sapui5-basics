sap.ui.require([
	'sap/ui/fl/FakeLrepConnectorLocalStorage',
	'sap/ui/core/ComponentContainer'

], function(
	FakeLrepConnectorLocalStorage,
	ComponentContainer) {
	'use strict';

	new ComponentContainer({
		name: 'applicationUnderTestSmartTable',
		manifest: true,
		settings: {
			id: "applicationUnderTestSmartTable"
		}
	}).placeAt('content');
});
