sap.ui.define([
	'sap/ui/core/ComponentContainer',
	'sap/ui/thirdparty/sinon' // Sinon NEEDS to be loaded here as otherwise it will break becuase of sap.viz's require implementation
], function(
	ComponentContainer,
	sinon
) {
	'use strict';

	new ComponentContainer({
		name: 'appUnderTestCustomControl',
		height: "100%",
		settings: {
			id: "appUnderTestCustomControl"
		},
		manifest: true
	}).placeAt('content');
});