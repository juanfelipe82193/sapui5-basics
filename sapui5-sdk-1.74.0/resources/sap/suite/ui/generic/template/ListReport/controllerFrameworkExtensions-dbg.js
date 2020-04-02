sap.ui.define([ ], function() {
		"use strict";
		
		/**
		 * This class contains all extension functions that have been defined for the ListReport floorplan.
		 * @namespace sap.suite.ui.generic.template.ListReport.controllerFrameworkExtensions
		 * @public
		 */
		
		return /** @lends sap.suite.ui.generic.template.ListReport.controllerFrameworkExtensions */ {

			/**
			 *
			 * @protected
			 */
			getVisibleSelectionsWithDefaults: function() {
				// We need a list of all selection fields in the SmartFilterBar for which defaults are defined
				// (see method setSmartFilterBarDefaults) and which are currently visible.
				// This is needed by _getBackNavigationParameters in the NavigationController.
				var aVisibleFields = [];
					// if(this.oView.byId(this.sPrefix + ".DateKeyDate").getVisible()){
				// aVisibleFields.push("KeyDate");
				// }
				return aVisibleFields;
			},

			/**
			 *
			 * @protected
			 */
			onInitSmartFilterBarExtension: function(oEvent) {},
			/**
			 *
			 * @protected
			 */			
			getCustomAppStateDataExtension: function(oCustomData) {},
			/**
			 *
			 * @protected
			 */			
			restoreCustomAppStateDataExtension: function(oCustomData) {},
			/**
			 *
			 * @protected
			 */			
			onBeforeRebindTableExtension: function(oEvent) {},
			/**
			 *
			 * @protected
			 */
			onBeforeRebindChartExtension: function(oEvent) {},
			/**
			 *
			 * @protected
			 */
			adaptNavigationParameterExtension: function(oSelectionVariant, oObjectInfo) {},
			/**
			 *
			 * @protected
			 */
			onListNavigationExtension: function(oEvent) {},
			/**
			 *
			 * @protected
			 */
			getPredefinedValuesForCreateExtension: function(oSmartFilterBar){},
			/**
			 *
			 * @protected
			 */
			adaptTransientMessageExtension: function(){},
			/**
			 *
			 * @protected
			 */
			onSaveAsTileExtension: function(oShareInfo) {},
			/**
			 *
			 * @protected
			 */
			beforeDeleteExtension: function(oBeforeDeleteProperties) {},
			/**
			 *
			 * @protected
			 */
			modifyStartupExtension: function(oStartupObject) {}
		};
	});