sap.ui.define([ ], function() {
		"use strict";
		/**
		 * This class contains all extension functions that have been defined for the AnalyticalListPage floorplan.
		 * @namespace sap.suite.ui.generic.template.AnalyticalListPage.controllerFrameworkExtensions
		 * @public
		 */
		 return /** @lends sap.suite.ui.generic.template.AnalyticalListPage.controllerFrameworkExtensions */ {
			/**
			 * This method is used to return an array of all selection fields in the SmartFilterBar for which defaults
			 * are defined (see method <code>setSmartFilterBarDefaults<code>) and which are currently visible. This is
			 * required by <code>_getBackNavigationParameters</code> in the NavigationController.
			 *
			 * @returns {Array} aVisibleFields - The array of visible selection fields on the SmartFilterBar.
			 * @protected
			 */
			getVisibleSelectionsWithDefaults: function() {
				var aVisibleFields = [];
				// if(this.oView.byId(this.sPrefix + ".DateKeyDate").getVisible()){
				// aVisibleFields.push("KeyDate");
				// }
				return aVisibleFields;
			},
			/**
			 * The custom field in the SmartFilterBar may be bound to a custom data model. Should a value change in
			 * these field trigger a follow up action, this method is the place to define and bind an event handler to
			 * the custom field. This method is triggered by ALP when the SmartFilterBar is initialized.
			 *
			 * @param {sap.ui.base.Event} oEvent - The initialise event of the SmartFilterBar.
			 * @protected
			 */
			onInitSmartFilterBarExtension: function(oEvent) {},
			/**
			 * The content of the custom field shall be stored in the app state, so that it can be restored later. For
			 * example, after a back navigation. The developer has to ensure that the content of the field is stored in
			 * the object that is returned by this method.
			 *
			 * @param {object} oCustomData - The object storing the custom data.
			 * @protected
			 */
			 getCustomAppStateDataExtension: function(oCustomData) {},
			/**
			 * This method is needed in order to restore the content of the custom field in the SmartFilterBar. For
			 * example, after a back navigation, an object with the content is handed over to this method and the
			 * develper has to ensure that the content of the custom field is set accordingly. Also, empty properties
			 * have to be set.
			 *
			 * @param {object} oCustomdata - The object storing the custom data.
			 * @protected
			 */
			 restoreCustomAppStateDataExtension: function(oCustomData) {},
			/**
			 * This method called before the table rebind can be used to define app-specific logic before the table is
			 * rendered. This allows for binding additional parameters from custom filters to the table query.
			 *
			 * @param {sap.ui.base.Event} oEvent - The {@link sap.ui.comp.smarttable.SmartTable.prototype.event:beforeRebindTable} event.
			 * @protected
			 */
			 onBeforeRebindTableExtension: function(oEvent) {},
			/**
			 * This method called before the chart rebind can be used to define app-specific logic before the chart is
			 * rendered. This allows for binding additional parameters, such as custom filters or chart queries.
			 *
			 * @param {sap.ui.base.Event} oEvent - The {@link sap.ui.comp.smartchart.SmartChart.prototype.event:beforeRebindChart} event.
			 * @protected
			 */
			onBeforeRebindChartExtension: function(oEvent) {},
			/**
			 * This method is needed to define the logic to handle the clear event for custom filters. This method is
			 * triggered by ALP when the Clear button is pressed on the filter bar or the filter dialog, which clears
			 * all filter dimensions.
			 *
			 * @param {sap.ui.base.Event} oEvent - The press event fired when the Clear button is pressed.
			 * @protected
			 */
			onClearFilterExtension: function(oEvent) {},
			/**
			 * This method can be called before external navigation to modify the target app info i.e. semanticObject
			 * and action along with the SelectionVariant to be passed.
			 *
			 * @param {sap.ui.generic.app.navigation.service.SelectionVariant} oSelectionVariant - The SelectionVariant.
			 * @param {object} oObjectInfo - The object storing target app info.
			 * @protected
			 */
			adaptNavigationParameterExtension: function(oSelectionVariant, oObjectInfo) {},
			/**
			 * This method is used to modify the data in the custom model (for custom model and custom views). This
			 * method is triggered by ALP after creating the custom model.
			 *
			 * @param {sap.ui.model.JSON.JSONModel} oCustomModel - The custom model.
			 * @private
			 */
			onAfterCustomModelCreation: function(oCustomModel) {},
			/**
			 * This method called before a filterable KPI rebind can be used to modify the existing filters or
			 * parameter values or custom filters for a filterable KPI.
			 *
			 * @param {sap.ui.generic.app.navigation.service.SelectionVariant} oSelectionVariant - The SelectionVariant.
			 * @param {string} sEntityType - The filterable KPI's entity type.
			 * @param {string} sKPIId - The filterable KPI's Id.
			 * @protected
			 */
			onBeforeRebindFilterableKPIExtension: function(oSelectionVariant, sEntityType, sKPIId) {},
			/**
			 * This method can be used to customize transient messages.
			 *
			 * @protected
			 */
			adaptTransientMessageExtension: function() {},
			/**
			 * This method can be used to perform conditional navigation from different rows of the SmartTable by
			 * choosing the target app based on the context available in the selected table record.
			 *
			 * @param {sap.ui.base.Event} oEvent - The press event fired when navigating from a row in the SmartTable.
			 * @protected
			 */
			onListNavigationExtension: function(oEvent) {},
			/**
			 * This method can be used to let the app decide the URL to be used for dynamic tiles. This method is called
			 * when Save as Tile is clicked.
			 *
			 * @param {object} oShareInfo - The tile info object.
			 * @protected
			 */
			onSaveAsTileExtension: function(oShareInfo) {},
			/**
			 * This method can be used to modify the SelectionVariant of the SmartFilterBar when launching the app.
			 *
			 * @param {object} oStartupObject - oStartupObject.selectionVariant used to modify the SelectionVariant.
			 * @protected
			 */
			modifyStartupExtension: function(oStartupObject) {},
			/**
			 * This method called before a visual filter rebind can be used to modify custom filter/parameter values to
			 * the visual filter, add a custom query parameter to the visual filter call or influence the sorting order
			 * of the visual filter. In this extension, app developer can aso access incoming navigation context of the
			 * app through <code>getNavigationContext</code> API.
			 *
			 * @param {string} sEntityType - The visual filter entity type.
			 * @param {string} sDimension - The visual filter dimension.
			 * @param {string} sMeasure - The visual filter measure.
			 * @param {object} oContext - The context to modify for the custom filter/parameter, query parameter or sort order.
			 * @param {object} oContext.entityParameters - The object can be modified for the entity set parameters to be applied
			 *        to the visual filter call.
			 * @param {object} oContext.queryParameter -  The object can be modified for the custom query parameters to be applied
			 *        to the visual filter call.
			 * @param {sap.ui.model.Filter[]} oContext.filters - The combined filter array can be modified by users to influence
			 *        the filters applied to the visual filter call.
			 * @param {sap.ui.model.Sorter[]} oContext.sorters - The combined sorter array can be modified by users to influence
			 * 	      the sorting order of the visual filter.
			 * @protected
			 */
			 onBeforeRebindVisualFilterExtension: function(sEntityType, sDimension, sMeasure, oContext) {}
		};
	});