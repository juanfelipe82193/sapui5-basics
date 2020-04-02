sap.ui.require([
	'sap/ui/core/ComponentContainer'
], function(
	ComponentContainer
) {
	'use strict';

	new ComponentContainer({
		name: 'applicationUnderTest',
		manifest: true,
		height: "100%",
		settings: {
			id: "applicationUnderTest"
		}
	}).placeAt('content');
});