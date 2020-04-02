/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
/* global jQuery, sap */
jQuery.sap.declare("sap.apf.ui.representations.utils.paginationDisplayOptionHandler");
jQuery.sap.require("sap.apf.ui.representations.utils.displayOptionHandler");
jQuery.sap.require("sap.apf.utils.utils");
jQuery.sap.require("sap.apf.core.metadataProperty");
(function() {
	"use strict";
	sap.apf.ui.representations.utils.PaginationDisplayOptionHandler = function() {
		this.oKeyTextForProperties = {};
		this.oDisplayValueForProperties = {};
	};
	/**
	 * @description creates a lookup for the filters in table and treetable.
	 * @param sKeyValue - Value of the key property
	 * @param sTextPropertyValue - Text value of the key property
	 * @param sKeyDisplayValue (optional) - Display value of the key property (for treeTable where the key for filtering is not the displayed key)
	 * These representations might not load all the data response at once, hence the lookup is created whenever the data response comes.
	**/
	sap.apf.ui.representations.utils.PaginationDisplayOptionHandler.prototype.createDisplayValueLookupForPaginatedFilter = function(sKeyValue, sTextPropertyValue, sKeyDisplayValue) {
		this.oKeyTextForProperties[sKeyValue] = sTextPropertyValue;
		if(sKeyDisplayValue) {
			this.oDisplayValueForProperties[sKeyValue] = sKeyDisplayValue;
		}
	};
	/**
	 * @param  sPropertyKey - filter propertyvalue 
	 * @param oRequiredFilteroptions - display option for filter
	 * @param sRequiredFilter - filter property
	 * @param oFormatter - formatter instance
	 * @param {sap.apf.core.EntityTypeMetadata} metadata
	 * @description based on the display option(key/text/keyAndText) it generates the display name which is used by selection pop up dialog to display the selected filters. 
	 * This is used for for table and treetable in case of the values, coming from pagination(table)/expansion(tree table).
	 * @returns sSelectionDisplayText -  filter display name.
	**/
	sap.apf.ui.representations.utils.PaginationDisplayOptionHandler.prototype.getDisplayNameForPaginatedFilter = function(sPropertyKey, oRequiredFilteroptions, sRequiredFilter, oFormatter, metadata) {
		var sSelectionDisplayText = sPropertyKey, oValueToBeFormatted;
		var propertyMetadata = new sap.apf.core.MetadataProperty(metadata.getPropertyMetadata(sRequiredFilter));
		if(this.oDisplayValueForProperties[sPropertyKey]){
			sSelectionDisplayText = this.oDisplayValueForProperties[sPropertyKey];
		}
		if (oRequiredFilteroptions && oRequiredFilteroptions.labelDisplayOption) {
			if (oRequiredFilteroptions.labelDisplayOption === sap.apf.core.constants.representationMetadata.labelDisplayOptions.TEXT && this.oKeyTextForProperties[sPropertyKey]) {
				return this.oKeyTextForProperties[sPropertyKey];
			} else if (oRequiredFilteroptions.labelDisplayOption === sap.apf.core.constants.representationMetadata.labelDisplayOptions.KEY_AND_TEXT && this.oKeyTextForProperties[sPropertyKey]) {
				oValueToBeFormatted = {
					key : sap.apf.utils.convertToExternalFormat(sSelectionDisplayText, propertyMetadata),
					text : this.oKeyTextForProperties[sPropertyKey]
				};
				return oFormatter.getFormattedValueForTextProperty(sRequiredFilter, oValueToBeFormatted);
			}
		} 
		return sap.apf.utils.convertToExternalFormat(sSelectionDisplayText, propertyMetadata);
	};
}());