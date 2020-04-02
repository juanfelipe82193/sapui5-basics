/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/ui/core/Element"
], function(Element) {
	"use strict";

	/**
	 * Constructor for a new Column.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class The column for the metadata driven table, that hold the template to be shown when the rows has data.
	 *        <h3><b>Note:</b></h3>
	 *        The control is experimental and the API/behaviour is not finalised and hence this should not be used for productive usage.
	 * @extends sap.ui.core.Element
	 * @author SAP SE
	 * @constructor The API/behaviour is not finalised and hence this control should not be used for productive usage.
	 * @private
	 * @experimental
	 * @since 1.58
	 * @alias sap.ui.mdc.table.Column
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */

	var Column = Element.extend("sap.ui.mdc.table.Column", {
		metadata: {
			defaultAggregation: "template",
			properties: {
				width: {
					type: "sap.ui.core.CSSSize",
					group: "Dimension",
					defaultValue: null
				},
				header: {
					type: "string"
				},
				hAlign: {
					type: "sap.ui.core.HorizontalAlign",
					defaultValue: "Begin"
				},
				/*
				 * Only used during creation of table for initial/1st rendering, 0 based index
				 */
				initialIndex: {
					type: "int",
					defaultValue: -1
				},
				dataProperties: {
					type: "string[]",
					defaultValue: []
				}
			},
			events: {},
			aggregations: {
				template: {
					type: "sap.ui.core.Control",
					multiple: false
				},
				creationTemplate: {
					type: "sap.ui.core.Control",
					multiple: false
				}
			}
		}
	});

	Column.prototype.init = function() {
		// Skip propagation of properties (models and bindingContexts).
		this.mSkipPropagation = {
			template: true,
			creationTemplate: true
		};
	};

	// Return the clone of the template set by the app on the column
	Column.prototype.getTemplate = function(bClone) {
		var oTemplate = this.getAggregation("template");

		if (bClone && this._oTemplateClone && this._oTemplateClone.bIsDestroyed) {
			this._oTemplateClone = null;
		}

		// clone the template control
		if (!this._oTemplateClone && oTemplate) {
			this._oTemplateClone = oTemplate.clone();
		}

		return bClone ? this._oTemplateClone : oTemplate;
	};

	Column.prototype.getCreationTemplate = function(bClone) {
		var oCreationTemplate = this.getAggregation("creationTemplate");

		if (bClone && this._oCreationTemplateClone && this._oCreationTemplateClone.bIsDestroyed) {
			this._oCreationTemplateClone = null;
		}

		// clone the creationTemplate control
		if (!this._oCreationTemplateClone && oCreationTemplate) {
			this._oCreationTemplateClone = oCreationTemplate.clone();
		}

		return bClone ? this._oCreationTemplateClone : oCreationTemplate;
	};

	Column.prototype.exit = function() {
		if (this._oTemplateClone) {
			this._oTemplateClone.destroy();
			this._oTemplateClone = null;
		}

		if (this._oCreationTemplateClone) {
			this._oCreationTemplateClone.destroy();
			this._oCreationTemplateClone = null;
		}
	};

	return Column;

});
