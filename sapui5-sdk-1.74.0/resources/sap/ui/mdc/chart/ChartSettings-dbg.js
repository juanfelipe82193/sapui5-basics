/*
 * ! SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/mdc/p13n/Util", "sap/ui/mdc/library", "sap/base/util/merge"
], function (Util, MDCLib, merge) {
	"use strict";
	/**
	 * P13n/Settings helper class for sap.ui.mdc.Chart.
	 *
	 * @author SAP SE
	 * @private
	 * @experimental
	 * @since 1.60
	 * @alias sap.ui.mdc.chart.ChartSettings
	 */
	var MDCRb = sap.ui.getCore().getLibraryResourceBundle("sap.ui.mdc");
	var ChartSettings = {
		showPanel: function (oControl, sPanel, oSource, aProperties) {
			this.aProperties = aProperties;
			return new Promise(function(resolve, reject) {
				// Use case for more options
				ChartSettings["_getP13nStateOf" + sPanel](oControl).then(function(oP13nData) {
					Util["showP13n" + sPanel](oControl, oSource, oP13nData, resolve);
				});
			});
		},
		_getP13nStateOfChart: function(oControl) {
			return new Promise(function (resolve, reject) {

				var sDimension = MDCRb.getText('chart.PERSONALIZATION_DIALOG_TYPE_DIMENSION');
				var sMeasure = MDCRb.getText('chart.PERSONALIZATION_DIALOG_TYPE_MEASURE');
				var oP13nData = {};
				oP13nData.items = [];

				var aExistingProperties = ChartSettings.getCurrentState(oControl).visibleItems;
				var aPropertyInfo = this.aProperties;
				var mExistingProperties = aExistingProperties.reduce(function(mMap, oProperty, iIndex) {
					mMap[oProperty.name] = oProperty;
					mMap[oProperty.name].position = iIndex;
					return mMap;
				}, {});

				aPropertyInfo.forEach(function (oProperty) {

					var bPropertySelected = mExistingProperties[oProperty.name] ? true : false;

					oP13nData.items.push({
						id: bPropertySelected ? mExistingProperties[oProperty.name].id : undefined,
						name: oProperty.name,
						label: bPropertySelected ? mExistingProperties[oProperty.name].label || oProperty.label : oProperty.label || oProperty.name,
						sortOrder: bPropertySelected ? mExistingProperties[oProperty.name].sortOrder : "",
						selected: bPropertySelected,
						position: bPropertySelected ? mExistingProperties[oProperty.name].position : -1,
						kind: oProperty.kind == MDCLib.ChartItemType.Dimension ? sDimension : sMeasure,
						role: bPropertySelected ? mExistingProperties[oProperty.name].role : oProperty.role,
						propertyPath: oProperty.propertyPath,
						availableRoles: ChartSettings._getChartItemTextByKey(oProperty.kind)
					});

				});

				resolve(oP13nData);

			}.bind(this));
		},
		_getP13nStateOfSort: function(oControl) {
			return new Promise(function (resolve, reject) {
				var oP13nData = {};
				oP13nData.items = [];

				var aExistingProperties = ChartSettings.getCurrentState(oControl).visibleItems;
				var mExistingProperties = aExistingProperties.reduce(function(mMap, oProperty) {
					mMap[oProperty.name] = oProperty;
					return mMap;
				}, {});

				var mSortableMetadataItems = {};
				for (var i = 0; i < this.aProperties.length; i++) {
					if (this.aProperties[i].sortable && oControl._aInResultProperties.indexOf(this.aProperties[i].name) != -1) {
						mSortableMetadataItems[this.aProperties[i].name] = this.aProperties[i];
						mSortableMetadataItems[this.aProperties[i].name].label = mExistingProperties[this.aProperties[i].name].label || this.aProperties[i].label;
					}
				}

				oControl._aInResultProperties.forEach(function(sPropName){

					var iSortIndex = -1;
					var sSortOrder;

					/*
					* consider to avoid O(n^2) and check to rework
					* _aInResultProperties (only visible items can be sorted as of now)
					*/
					//Consider to change the position handling via 'oP13nData' and directly pass the correct order
					var mSorters = merge({}, ChartSettings.getCurrentState(oControl).sorters);
					Object.keys(mSorters).forEach(function(sName, iCurrentIndex){
						if (mSortableMetadataItems[sName] && sName === sPropName){
							iSortIndex = iCurrentIndex;
							sSortOrder = mSorters[sName].descending;
						}
					});

					oP13nData.items.push({
						name: sPropName,
						label: mSortableMetadataItems[sPropName].label || sPropName,
						descending: sSortOrder || mSortableMetadataItems[sPropName].descending,
						position: iSortIndex,
						selected: iSortIndex > -1
					});
				});

				resolve(oP13nData);

			}.bind(this));
		},

		/**
		 * Fetches the relevant metadata for the Chart and returns property info array
		 *
		 * @param {Object} oChart - the instance of MDC Chart
		 * @returns {Object} the current state
		 */
		getCurrentState: function (oChart) {
			return {
				visibleItems: this._getVisibleProperties(oChart),
				sorters: this._getSortedProperties(oChart)
			};
		},
		_getVisibleProperties: function (oChart) {
			var aProperties = [];
			if (oChart) {
				oChart.getItems().forEach(function (oChartItem) {
					aProperties.push({
						name: oChartItem.getKey(),
						id: oChartItem.getId(),
						label: oChartItem.getLabel(),
						role: oChartItem.getRole()
					});

				});
			}
			return aProperties;
		},
		_getSortedProperties: function(oChart) {
			return oChart.getSortConditions() || {};
		},
		_getChartItemTextByKey: function (sKey) {
			var oAvailableRoles = {
				Dimension: [
					{
						key: MDCLib.ChartItemRoleType.category,
						text: MDCRb.getText('chart.PERSONALIZATION_DIALOG_CHARTROLE_CATEGORY')
					}, {
						key: MDCLib.ChartItemRoleType.category2,
						text: MDCRb.getText('chart.PERSONALIZATION_DIALOG_CHARTROLE_CATEGORY2')
					}, {
						key: MDCLib.ChartItemRoleType.series,
						text: MDCRb.getText('chart.PERSONALIZATION_DIALOG_CHARTROLE_SERIES')
					}
				],
				Measure: [
					{
						key: MDCLib.ChartItemRoleType.axis1,
						text: MDCRb.getText('chart.PERSONALIZATION_DIALOG_CHARTROLE_AXIS1')
					}, {
						key: MDCLib.ChartItemRoleType.axis2,
						text: MDCRb.getText('chart.PERSONALIZATION_DIALOG_CHARTROLE_AXIS2')
					}, {
						key: MDCLib.ChartItemRoleType.axis3,
						text: MDCRb.getText('chart.PERSONALIZATION_DIALOG_CHARTROLE_AXIS3')
					}
				]
			};
			return oAvailableRoles[sKey];
		}

	};
	return ChartSettings;
});
