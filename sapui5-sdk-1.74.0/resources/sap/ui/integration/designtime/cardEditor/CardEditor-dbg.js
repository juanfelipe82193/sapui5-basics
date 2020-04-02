/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([
	"sap/ui/integration/designtime/baseEditor/BaseEditor",
	"./config/index"
], function (
	BaseEditor,
	oDefaultCardConfig
) {
	"use strict";

	/**
	 * @constructor
	 * @private
	 * @experimental
	 */
	var CardEditor = BaseEditor.extend("sap.ui.integration.designtime.cardEditor.CardEditor", {
		constructor: function() {
			BaseEditor.prototype.constructor.apply(this, arguments);
			this.addDefaultConfig(oDefaultCardConfig);
		},
		renderer: BaseEditor.getMetadata().getRenderer()
	});

	return CardEditor;
});
