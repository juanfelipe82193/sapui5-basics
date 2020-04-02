/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	'sap/ui/mdc/XMLComposite'
], function(XMLComposite) {
	"use strict";
	return XMLComposite.extend("composites.MDCCell", {
		metadata: {
			specialSettings: {
				metadataContexts: {
					defaultValue: "{ model: 'column', path:'',  name: 'column'}"
				}
			},
			properties: {
				asLink: {
					type: "boolean",
					defaultValue: false,
					invalidate: "template"
				},
				value: {
					type: "string"
				}
			}
		}
	});
}, /* bExport= */true);