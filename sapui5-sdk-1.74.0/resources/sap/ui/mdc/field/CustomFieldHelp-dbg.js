/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	'sap/ui/mdc/field/FieldHelpBase'
], function(FieldHelpBase) {
	"use strict";

	/**
	 * Constructor for a new CustomFieldHelp.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class A field help used in the <code>FieldHelp</code> association in <code>Field</code> controls that allows to add custom content.
	 * @extends sap.ui.mdc.field.FieldHelpBase
	 * @version 1.74.0
	 * @constructor
	 * @private
	 * @since 1.54.0
	 * @alias sap.ui.mdc.field.CustomFieldHelp
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var CustomFieldHelp = FieldHelpBase.extend("sap.ui.mdc.field.CustomFieldHelp", /** @lends sap.ui.mdc.field.CustomFieldHelp.prototype */
	{
		metadata: {
			library: "sap.ui.mdc",
			properties: {
				},
			aggregations: {
				/**
				 * content of the Field help
				 */
				content: {
					type: "sap.ui.core.Control",
					multiple: false
				}
			},
			defaultAggregation: "content",
			events: {
				/**
				 * This event is fired before the field help opens
				 */
				beforeOpen: {
				}
			}
		}
	});

	CustomFieldHelp.prototype._createPopover = function() {

		var oPopover = FieldHelpBase.prototype._createPopover.apply(this, arguments);

		if (oPopover) { // empty if loaded async
			// use FieldHelps content in Popover -> overwrite hook
			oPopover._getAllContent = function(){
				var oFieldHelp = this.getParent();
				if (oFieldHelp) {
					var aContent = [];
					aContent.push(oFieldHelp.getContent());
					return aContent;
				} else {
					return this.getContent();
				}
			};
		}

		return oPopover;

	};

	/**
	 * Close the fieldHelp and fires the <code>select</code> event of the field help
	 *
	 * @param {object[]} aConditions selected conditions
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	CustomFieldHelp.prototype.fireSelectEvent = function(aConditions) {

		this.close();
		this.fireSelect({conditions: aConditions});

	};

	CustomFieldHelp.prototype.open = function(bSuggestion) {

		this.fireBeforeOpen();
		FieldHelpBase.prototype.open.apply(this, arguments);

	};

	return CustomFieldHelp;

});
