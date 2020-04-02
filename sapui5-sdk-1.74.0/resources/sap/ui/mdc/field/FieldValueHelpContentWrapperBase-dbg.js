/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

sap.ui.define([
	'sap/ui/core/Element'
	], function(
		Element
	) {
	"use strict";

	/**
	 * Constructor for a new FieldValueHelpContentWrapperBase.
	 *
	 * The <code>FieldValueHelp</code> supports different types of content. To map the content control
	 * API to the <code>FieldValueHelp</code>, a wrapper is needed. This base class just defines the API.
	 *
	 * <b>Note:</b> All events and functions must only be used by the corresponding field help.
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSettings] initial settings for the new control
	 * @class Base type for <code>FieldValueHelp</code> content control wrapper.
	 * @extends sap.ui.core.Element
	 * @version 1.74.0
	 * @constructor
	 * @abstract
	 * @private
	 * @since 1.60.0
	 * @alias sap.ui.mdc.field.FieldValueHelpContentWrapperBase
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var FieldValueHelpContentWrapperBase = Element.extend("sap.ui.mdc.field.FieldValueHelpContentWrapperBase", /** @lends sap.ui.mdc.field.FieldValueHelpContentWrapperBase.prototype */
	{
		metadata: {
			library: "sap.ui.mdc",
			properties: {
				/**
				 * The selected items.
				 *
				 * A item is an object with properties key and description.
				 *
				 * <b>Note:</b> This property must only be set by the <code>FieldHelp</code>, not by the application.
				 */
				selectedItems: {
					type: "object[]",
					defaultValue: []
				}
			},
			defaultProperty: "selectedItems",
			events: {
				/**
				 * This event is fired when a navigation was performed in the content
				 */
				navigate: {
					parameters: {

						/**
						 * The navigated <code>key</code>.
						 */
						key: { type: "any" },

						/**
						 * The navigated <code>description</code>.
						 */
						description: { type: "string" }
					}
				},
				/**
				 * This event is fired when the selection was changed
				 */
				selectionChange: {
					parameters: {
						/**
						 * array of selected items
						 *
						 * Each item is represented as object with properties key and description
						 */
						selectedItems: {type: "object[]"}
					}
				},
				/**
				 * This event is fired when the data of the FieldHelp has changed
				 *
				 * This is needed to determine the text of a key
				 */
				dataUpdate: {
					parameters: {
						/**
						 * If set the content control has changed. If not set only the data has changed
						 */
						contentChange: {type: "boolean"}
					}
				}
			}
		}
	});

	// define empty to add it to inherited wrappers, maybe later it might be filled and other wrappers must not changed.
	FieldValueHelpContentWrapperBase.prototype.init = function() {

	};

	// define empty to add it to inherited wrappers, maybe later it might be filled and other wrappers must not changed.
	FieldValueHelpContentWrapperBase.prototype.exit = function() {

	};

	/**
	 * Initializes the wrapper. This is called if the <code>FieldValueHelp</code> is opened. Here modules
	 * should be loaded that only needed if the help is open.
	 *
	 * @param {boolean} bSuggestion Flag if field help is opened as suggestion or dialog
	 * @return {sap.ui.mdc.field.FieldValueHelpContentWrapperBase} Reference to <code>this</code> in order to allow method chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FieldValueHelpContentWrapperBase.prototype.initialize = function(bSuggestion) {

		return this;

	};

	/**
	 * Returns the content shown in the value help dialog
	 *
	 * @return {sap.ui.core.Control} content to be shown in the value help
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FieldValueHelpContentWrapperBase.prototype.getDialogContent = function() {

		return undefined;

	};

	/**
	 * Returns the content shown in the value help suggestion popup
	 *
	 * @return {sap.ui.core.Control} content to be shown in the value help
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FieldValueHelpContentWrapperBase.prototype.getSuggestionContent = function() {

		return undefined;

	};

	/**
	 * This function is called if the field help is opened. Here the wrapper can focus the selected
	 * item or do similar things.
	 *
	 * @param {boolean} bSuggestion Flag if field help is opened as suggestion or dialog
	 * @return {sap.ui.mdc.field.FieldValueHelpContentWrapperBase} Reference to <code>this</code> in order to allow method chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FieldValueHelpContentWrapperBase.prototype.fieldHelpOpen = function(bSuggestion) {

		this._bSuggestion = bSuggestion;
		return this;

	};

	/**
	 * This function is called if the field help is closed. Here the wrapper can focus the selected
	 * item or do similar things.
	 *
	 * @return {sap.ui.mdc.field.FieldValueHelpContentWrapperBase} Reference to <code>this</code> in order to allow method chaining
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FieldValueHelpContentWrapperBase.prototype.fieldHelpClose = function() {

		delete this._bSuggestion;
		return this;

	};

	/**
	 * Returns true if filtering on the content is supported
	 *
	 * @return {boolean} true if filtering on the content is supported
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FieldValueHelpContentWrapperBase.prototype.getFilterEnabled = function() {

		return true;

	};

	/**
	 * triggers navigation in the content
	 *
	 * @param {int} iStep number of steps for navigation (e.g. 1 means next item, -1 means previous item)
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FieldValueHelpContentWrapperBase.prototype.navigate = function(iStep) {

	};

	/**
	 * Determines the description for an given key
	 *
	 * As the key might also change (uppercase) also an object with key and description is returned.
	 *
	 * @param {any} vKey key
	 * @param {object} oInParameters in-parameters for the key (as a key must not be unique.)
	 * @param {object} oOutParameters out-parameters for the key (as a key must not be unique.)
	 * @return {string|object|Promise} description for key or object containing description, key, in- and out-parameters. If it is not available right now (must be requested) a Promise is returned.
	 *
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FieldValueHelpContentWrapperBase.prototype.getTextForKey = function(vKey, oInParameters, oOutParameters) {

		return "";

	};

	/**
	 * Determines the key for an given description
	 *
	 * As the description might also change (uppercase) also an object with key and description is returned.
	 *
	 * @param {string} sText description
	 * @param {object} oInParameters in-parameters for the key (as a key must not be unique.)
	 * @return {any|object|Promise} key for description or object containing description, key, in- and out-parameters. If it is not available right now (must be requested) a Promise is returned.
	 *
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FieldValueHelpContentWrapperBase.prototype.getKeyForText = function(sText, oInParameters) {

		return undefined;

	};

	/**
	 * Returns the ListBinding used for the field help
	 *
	 * @return {sap.ui.model.ListBinding} ListBinding
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FieldValueHelpContentWrapperBase.prototype.getListBinding = function() {

		return undefined;

	};

	/**
	 * To check if the FieldHelp supports asynchronously loading for <code>getKeyForText</code>
	 * and <code>getTextForKey</code>.
	 *
	 * If key or description can be loaded asynchronously it not depends on the content of the
	 * table or filtering. So in this case no <code>datUpdate</code> event for the Field is needed.
	 *
	 * @return {boolean} Indicator if asynchronously loading is supported.
	 * @public
	 * @since 1.67.0
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FieldValueHelpContentWrapperBase.prototype.getAsyncKeyText = function() {

		return false;

	};

	/**
	 * Apply the entered filters and search string to the content control (table).
	 *
	 * As the way how filters and search is applied depends from the LisBinding and the used
	 * content control this needs to be done in the wrapper.
	 *
	 * If the ListBinding in the Wrapper is suspended it must resumed in this function after setting the filters.
	 * It will not be resumed in the FieldValueHelp. There applyFilters is only called if the filters should be really set.
	 *
	 * @param {sap.ui.model.Filter[]} aFilters filter objects
	 * @param {string} sSearch search string (for $search request)
	 * @public
	 * @since 1.73.0
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FieldValueHelpContentWrapperBase.prototype.applyFilters = function(aFilters, sSearch) {

	};

	/**
	 * Checks if the ListBinding of the Wrapper is suspended
	 *
	 * @return {boolean} true if the ListBindiong of the Wrapper is suspended
	 * @public
	 * @since 1.73.0
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	FieldValueHelpContentWrapperBase.prototype.isSuspended = function() {

		return false;

	};

/* get Information from FieldHelp. Do not use properties here as it would be difficult to keep them
 * in sync. Also some information depend on the connected field and the state of the field help.
 */

	FieldValueHelpContentWrapperBase.prototype._getFieldHelp = function() {

		var oFieldHelp = this.getParent();

		if (!oFieldHelp || !oFieldHelp.isA("sap.ui.mdc.field.FieldValueHelp")) {
			throw new Error(this.getId() + " must be assigned to a sap.ui.mdc.field.FieldValueHelp");
		}

		return oFieldHelp;

	};

	FieldValueHelpContentWrapperBase.prototype._getKeyPath = function() {

		var oFieldHelp = this._getFieldHelp();
		return oFieldHelp._getKeyPath();

	};

	FieldValueHelpContentWrapperBase.prototype._getDescriptionPath = function() {

		var oFieldHelp = this._getFieldHelp();
		return oFieldHelp.getDescriptionPath();

	};

	FieldValueHelpContentWrapperBase.prototype._getInParameters = function() {

		var oFieldHelp = this._getFieldHelp();
		var aHelpInParameters = [];

		if (oFieldHelp) {
			aHelpInParameters = _getParameters(oFieldHelp.getInParameters());
		}

		return aHelpInParameters;

	};

	FieldValueHelpContentWrapperBase.prototype._getOutParameters = function() {

		var oFieldHelp = this._getFieldHelp();
		var aHelpOutParameters = [];

		if (oFieldHelp) {
			aHelpOutParameters = _getParameters(oFieldHelp.getOutParameters());
		}

		return aHelpOutParameters;

	};

	function _getParameters(aParameters) {

		var aHelpParameters = [];

		for (var i = 0; i < aParameters.length; i++) {
			var oParameter = aParameters[i];
			var sHelpPath = oParameter.getHelpPath();
			if (sHelpPath) {
				aHelpParameters.push(sHelpPath);
			}
		}

		return aHelpParameters;

	}

	FieldValueHelpContentWrapperBase.prototype._getMaxConditions = function() {

		var oFieldHelp = this._getFieldHelp();
		return oFieldHelp.getMaxConditions();

	};

	FieldValueHelpContentWrapperBase.prototype._getDelegate = function() {

		var oFieldHelp = this._getFieldHelp();
		var oFormatOptions = oFieldHelp._getFormatOptions();
		return {delegate: oFormatOptions.delegate, payload: oFormatOptions.payload};

	};

	return FieldValueHelpContentWrapperBase;

});
