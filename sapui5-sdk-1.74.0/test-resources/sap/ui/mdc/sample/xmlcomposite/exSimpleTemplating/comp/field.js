/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	'jquery.sap.global', 'sap/ui/mdc/XMLComposite'
], function(jQuery, XMLComposite) {
	"use strict";
	var Field = XMLComposite.extend("sap.ui.mdc.sample.xmlcomposite.exSimpleTemplating.comp.field", {
		metadata: {
			properties: {
				text: {
					type: "string",
					defaultValue: "Default Value Text"
				},
				value: {
					type: "string",
					defaultValue: "Default Value Input"
				},
				textFirst: {
					type: "string",
					defaultValue: "y",
					invalidate: "template"
				}
			}
		},
		fragment: "sap.ui.mdc.sample.xmlcomposite.exSimpleTemplating.comp.field"
	});
	return Field;
}, /* bExport= */ true);
