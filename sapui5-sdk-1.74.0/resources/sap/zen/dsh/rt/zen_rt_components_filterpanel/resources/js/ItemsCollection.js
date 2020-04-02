/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

(c) Copyright 2009-2019 SAP SE. All rights reserved
 */

// EXC_ALL_CLOSURE_003
define("zen.rt.components.filterpanel/resources/js/ItemsCollection",  [], function() {
	"use strict";


	/**
	 * Constructs a class to map key/object pairs
	 * 
	 * @constructor
	 * @public
	 * @author Peter Harbusch
	 */
	var ItemsCollection = function() {
		this.items = {};
	};
	
	/**
	 * add or overwrite a key in the map and the associated obj
	 * 
	 * @param {string} sKey - the key of the obj in the map
	 * @param {object} obj - the obj which has to been stored in the map
	 * @public
	 */
	ItemsCollection.prototype.add = function(sKey, obj) {
		this.items[sKey] = obj;
	};
	
	/**
	 * removes the key in the map and the associated obj
	 * 
	 * @param {string} sKey - the key of the obj in the map
	 * @public
	 */
	ItemsCollection.prototype.remove = function(sKey) {
		delete this.items[sKey];
	};
	
	/**
	 * removes all the items
	 * 
	 * @public
	 */
	ItemsCollection.prototype.removeAll = function() {
		this.items = {};
	};
	
	/**
	 * returns the obj of the key on the map
	 * 
	 * @param {string} sKey - the key of the obj in the map
	 * @returns {object} the object with the given key
	 * @public
	 */
	ItemsCollection.prototype.getItem = function(sKey) {
		return this.items[sKey];
	};
	
	/**
	 * returns an array of all keys in the map
	 * 
	 * @returns {array} the array of all the map keys
	 * @public
	 */
	ItemsCollection.prototype.getItems = function() {
		var aKeys = [];
		for ( var item in this.items) {
			aKeys.push(item);
		}
		return aKeys;
	};
	
	/**
	 * returns an array of all selected tokens in the map
	 * 
	 * @param {string} sKey - the property name of the obj in the map which will be used for the Display Key in the tokens returned in the array
	 * @param {string} sDescriptionKey - the property name of the obj in the map which will be returned in the array
	 * @param {string} sDisplayBehaviour - the behaviour/format of the token text (See: sap.ui.comp.smartfilterbar.ControlConfiguration.DISPLAYBEHAVIOUR)
	 * @returns {array} array of objects with the given key and the text value
	 * @public
	 */
	ItemsCollection.prototype.getSelectedItemsTokenArray = function(sKey, sDescriptionKey, sDisplayBehaviour) {
		var aTokens = [];
		for ( var sItemKey in this.items) {
			var oItem = this.items[sItemKey];
			var sText, sDisplayKey;
			
			if (typeof oItem === "string") {
				sDisplayKey = sItemKey;
				sText = oItem;
			} else {
				sDisplayKey = oItem[sKey];
				sText = oItem[sDescriptionKey];
	
				if (sText === undefined) {
					sText = this.items[sItemKey];
				} else {
					if (sDisplayBehaviour) {
						sText = this.getFormattedExpressionFromDisplayBehaviour(sDisplayBehaviour, sDisplayKey, sText);
					} else {
						sText = sText + " (" + sDisplayKey + ")";
					}
				}
			}
			
			var oToken = new sap.m.Token({
				key: sDisplayKey,
				text: sText,
				tooltip: sText
			});
			
			if (typeof oItem !== "string") {
				oToken.data("row", oItem);
				oToken.data("longKey", sItemKey);
			}
			aTokens.push(oToken);
		}
		return aTokens;
	};
	
	ItemsCollection.prototype.getFormattedExpressionFromDisplayBehaviour = function(sDisplayBehaviour, sId, sDescription) {
		var sTextBinding;

		switch (sDisplayBehaviour) {
			case "TEXT_KEY":
				sTextBinding = sDescription + " (" + sId + ")";
				break;
			case "KEY_TEXT":
				sTextBinding = sId + " (" + sDescription + ")";
				break;
			case "TEXT":
				sTextBinding = sDescription;
				break;
			// fallback to Id in case nothing was specified
			default:
				sTextBinding = sId;
				break;
		}

		return sTextBinding;
	};
	
	/**
	 * returns an array of all objects in the map
	 * 
	 * @returns {array} the array of all the map objects
	 * @public
	 */
	ItemsCollection.prototype.getModelData = function() {
		var aModelItems = [];
		for ( var itemKey in this.items) {
			var item = this.items[itemKey];
			if (typeof item === "string") {
				item = {
					missing: itemKey
				};
			}
			aModelItems.push(item);
		}
		return aModelItems;
	};
	

	return ItemsCollection;

});