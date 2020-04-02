sap.ui.define(
		['sap/ui/core/XMLComposite'],
		function (XMLComposite) {
	"use strict";

	var oSearchField = XMLComposite.extend("test.control.SearchFieldXML", {
		metadata: {
			properties: {
				placeholder: { type: "string", defaultValue: "Enter Search Term..." },
				buttonText: { type: "string", defaultValue: "Search" }
			},
			events: {
				search: {
					parameters: {
						value: {type: "string"}
					}
				}
			}
		},

		fragmentContent: jQuery('#myXml').html(), // only for Snippix: get XML from this document

		handleSearch: function() { // button was pressed, retrieve Input value + fire event
			var sSearchString = this.byId("innerInput").getValue();
			this.fireEvent("search", {value: sSearchString});
		}
	});
	return oSearchField;
}, /* bExport= */ true);