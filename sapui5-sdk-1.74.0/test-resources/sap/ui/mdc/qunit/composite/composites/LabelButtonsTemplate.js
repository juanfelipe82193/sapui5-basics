/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	'sap/ui/mdc/XMLComposite'
], function(XMLComposite) {
	"use strict";
	return XMLComposite.extend("composites.LabelButtonsTemplate", {
		metadata: {
			properties: {
				labelFirst: {
					type: "boolean",
					defaultValue: true,
					invalidate: "template"
				}
			},
			aggregations: {
				items: {
					type: "TemplateMetadataContext",
					multiple: true,
					invalidate: "template"
				}
			}
		},
		alias: "myFC"
	});
}, /* bExport= */true);
