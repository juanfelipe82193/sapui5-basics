sap.ui.define([
	'sap/ui/core/ComponentContainer',
	'sap/ui/thirdparty/sinon' // Sinon NEEDS to be loaded here as otherwise it will break becuase of sap.viz's require implementation
], function(
	ComponentContainer,
	sinon
) {
	'use strict';

	new ComponentContainer({
		name: 'applicationUnderTestDimeasure',
		height: "100%",
		settings: {
			id: "applicationUnderTestDimeasure"
		},
		manifest: true
	}).placeAt('content');
});