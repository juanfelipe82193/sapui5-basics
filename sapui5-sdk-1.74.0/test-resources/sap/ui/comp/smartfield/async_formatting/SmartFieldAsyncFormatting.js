sap.ui.define([
    'sap/ui/core/ComponentContainer'
], function(
    ComponentContainer
) {
    "use strict";

    new ComponentContainer({
		name: 'test.sap.ui.comp.smartfield',
		height: "100%",
		manifest: true
	}).placeAt('content');
});