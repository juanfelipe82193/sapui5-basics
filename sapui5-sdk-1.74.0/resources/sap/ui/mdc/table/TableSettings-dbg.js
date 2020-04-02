/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

// TODO: this is just a draft version and is not yet finalized --> just for verifying flex/p13n concepts. We could move some code here to a base
// implementaton for re-use elsewhere
// ---------------------------------------------------------------------------------------
// Helper class used to help handle p13n related tasks in the table and provide change
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define([
	"sap/ui/mdc/p13n/Util", "sap/m/OverflowToolbarButton", "sap/m/OverflowToolbarLayoutData", "sap/base/util/merge"
], function(Util, OverflowToolbarButton, OverflowToolbarLayoutData, merge) {
	"use strict";

	// TODO: this is just a draft version and is not final --> just for verifying flex/p13n concepts
	var oRb;
	/**
	 * P13n/Settings helper class for sap.ui.mdc.Table.
	 * <h3><b>Note:</b></h3>
	 * The class is experimental and the API/behaviour is not finalised and hence this should not be used for productive usage.
	 *
	 * @author SAP SE
	 * @private
	 * @experimental
	 * @since 1.60
	 * @alias sap.ui.mdc.table.TableSettings
	 */
	var TableSettings = {
		createSortButton: function(sIdPrefix, aEventInfo) {
			if (!oRb) {
				this._loadResourceBundle();
			}
			return this._createButton(sIdPrefix + "-sort", {
				icon: "sap-icon://sort",
				text: oRb.getText("table.SETTINGS_SORT", "Sort"),
				press: aEventInfo,
				tooltip: oRb.getText("table.SETTINGS_SORT", "Sort"),
				layoutData: new OverflowToolbarLayoutData({
					closeOverflowOnInteraction: false
				})
			});
		},
		createColumnsButton: function(sIdPrefix, aEventInfo) {
			if (!oRb) {
				this._loadResourceBundle();
			}
			return this._createButton(sIdPrefix + "-settings", {
				icon: "sap-icon://action-settings",
				text: oRb.getText("table.SETTINGS_COLUMN", "Add/Remove Columns"),
				press: aEventInfo,
				tooltip: oRb.getText("table.SETTINGS_COLUMN", "Add/Remove Columns"),
				layoutData: new OverflowToolbarLayoutData({
					closeOverflowOnInteraction: false
				})
			});
		},
		_createButton: function(sId, mSettings) {
			return new OverflowToolbarButton(sId, mSettings);
		},
		_loadResourceBundle: function() {
			oRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
		},
		showPanel: function(oControl, sPanel, oSource, bIsRTAAction) {
			return new Promise(function(resolve, reject) {
				// Use case for more options
				TableSettings["_getP13nStateOf" + sPanel](oControl).then(function(oP13nData) {
					Util["showP13n" + sPanel](oControl, oSource, oP13nData, resolve);
				});
			});
		},
		_getP13nStateOfSort: function (oControl) {
			return new Promise(function (resolve) {
				sap.ui.require([
					this.getDelegate().name
				], function(Delegate) {
					if (!Delegate || !Delegate.fetchProperties || !Delegate.getCurrentState) {
						return resolve([]);
					}

					var oP13nData = {};
					oP13nData.items = [];

					//Consider to change the position handling via 'oP13nData' and directly pass the correct order
					var mExistingProperties = merge({}, Delegate.getCurrentState(this).sorters);
					Object.keys(mExistingProperties).forEach(function(sName, iCurrentIndex){
						mExistingProperties[sName].index = iCurrentIndex;
					});

					Delegate.fetchProperties(this).then(function(aPropertyInfo) {
						aPropertyInfo.forEach(function (oProperty) {

							var bPropertySelected = mExistingProperties[oProperty.name] ? true : false;
							if (oProperty.sortable) {
								oP13nData.items.push({
									name: oProperty.name,
									label: oProperty.label || oProperty.name,
									descending:bPropertySelected ? mExistingProperties[oProperty.name].descending : null,
									selected: bPropertySelected,
									groupLabel: oProperty.groupLabel,
									position: bPropertySelected ? mExistingProperties[oProperty.name].index : -1
								});
							}

						});
						resolve(oP13nData);
					});

				}.bind(this));
			}.bind(oControl));
		},
		_getP13nStateOfColumns: function(oControl) {
			return new Promise(function(resolve) {
				sap.ui.require([
					this.getDelegate().name
				], function(Delegate) {

					var oP13nData = {};
					oP13nData.items = [];

					var aExistingProperties = Delegate.getCurrentState(this).visibleFields;
					var mExistingProperties = aExistingProperties.reduce(function(mMap, oProperty, iIndex) {
						mMap[oProperty.name] = oProperty;
						mMap[oProperty.name].position = iIndex;
						return mMap;
					}, {});

					Delegate.fetchProperties(this).then(function(aPropertyInfo) {
						aPropertyInfo.forEach(function (oProperty) {

							var bPropertySelected = mExistingProperties[oProperty.name] ? true : false;
							oP13nData.items.push({
								id: bPropertySelected ? mExistingProperties[oProperty.name].id : undefined,
								name: oProperty.name,
								label: bPropertySelected ? mExistingProperties[oProperty.name].label || mExistingProperties[oProperty.name].name : oProperty.label || oProperty.name,
								selected: bPropertySelected,
								groupLabel: oProperty.groupLabel,
								position: bPropertySelected ? mExistingProperties[oProperty.name].position : -1
							});
						});
						resolve(oP13nData);
					});

				}.bind(this));
			}.bind(oControl));
		},
		createSort: function(oControl, sProperty, bRemoveAllExisting) {
			sap.ui.require([
				oControl.getDelegate().name
			], function(Delegate) {
				if (!Delegate || !Delegate.getCurrentState) {
					return;
				}
				var aChanges = [], bDescending = false;
				// remove all existing sorters, if remove all is set
				var mExistingProperties = Delegate.getCurrentState(oControl).sorters;
				for (var sName in mExistingProperties) {
					var oProp = mExistingProperties[sName];
					if (sProperty === sName) {
						bDescending = oProp.descending;
					}
					if (bRemoveAllExisting) {
						aChanges.push({
							selectorElement: oControl,
							changeSpecificData: {
								changeType: "removeSort",
								content: {
									name: sName,
									descending: oProp.descending
								}
							}
						});
					}
				}
				// add the provided sorter
				aChanges.push({
					selectorElement: oControl,
					changeSpecificData: {
						changeType: "addSort",
						content: {
							name: sProperty,
							descending: bDescending
						}
					}
				});

				Util.handleUserChanges(aChanges);
			});
		},
		moveColumn: function(oControl, iDraggedIndex, iNewIndex) {
			this._moveItem(oControl, iDraggedIndex, iNewIndex, "moveColumn");
		},
		_moveItem: function(oControl, iDraggedIndex, iNewIndex, sMoveOperation) {
			sap.ui.require([
				oControl.getDelegate().name
			], function(Delegate) {
				if (!Delegate || !Delegate.getCurrentState) {
					return;
				}
				var aChanges = [];
				var aVisibleFields = Delegate.getCurrentState(oControl).visibleFields || [];
				var oMovedField = aVisibleFields[iDraggedIndex];
				aChanges.push(Util.createMoveChange(oMovedField.id, oMovedField.name, iNewIndex, sMoveOperation, oControl));

				Util.handleUserChanges(aChanges);
			});
		}
	};
	return TableSettings;
});
