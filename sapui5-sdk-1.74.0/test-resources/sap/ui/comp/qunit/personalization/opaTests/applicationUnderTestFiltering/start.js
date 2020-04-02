sap.ui.define([
	'sap/ui/core/ComponentContainer'
], function(
	ComponentContainer
) {
	'use strict';

	new ComponentContainer({
		name: 'applicationUnderTestFiltering',
		manifest: true,
		height: "100%",
		settings: {
			id: "applicationUnderTestFiltering"
		}
	}).placeAt('content');
});
