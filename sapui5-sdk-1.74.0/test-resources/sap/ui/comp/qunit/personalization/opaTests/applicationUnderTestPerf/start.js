sap.ui.require([
	'sap/ui/core/ComponentContainer',
	'sap/ui/thirdparty/sinon' // Sinon NEEDS to be loaded here as otherwise it will break becuase of sap.viz's require implementation
], function(
	ComponentContainer,
	sinon
) {
	'use strict';

	new ComponentContainer({
		name: 'applicationUnderTestPerf',
		manifest: true,
		settings: {
			id: "applicationUnderTestPerf"
		}
	}).placeAt('content');
});