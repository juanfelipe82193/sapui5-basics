sap.ui.define([ ], function() {
		"use strict";
		
		/**
		 * This class contains all extension functions that have been defined for the ObjectPage floorplan.
		 * @namespace sap.suite.ui.generic.template.ObjectPage.controllerFrameworkExtensions
		 * @public
		 */
		
		return /** @lends sap.suite.ui.generic.template.ObjectPage.controllerFrameworkExtensions */ {

			/**
			 *
			 * @protected
			 */
			adaptNavigationParameterExtension: function(oSelectionVariant, oObjectInfo) {},
			/**
			 * This method can be used to influence the data retrieval for tables on the object page.
			 * @param oEvent {sap.ui.base.Event} the {@link sap.ui.comp.smarttable.SmartTable.prototype.event:beforeRebindTable}  event. Use <code>getSource()</code> to retrieve the
			 * {@link sap.ui.comp.smarttable.SmartTable} for which the event was triggered. Use parameter <i>bindingParams</i> to get access to the binding parameters.
			 * @protected
			 */
			onBeforeRebindTableExtension: function(oEvent) {},
			/**
			 *
			 * @protected
			 */
			onListNavigationExtension: function(oEvent){},
			/**
			 *
			 * @protected
			 */
			provideCustomStateExtension: function(oState){},
			/**
			 *
			 * @protected
			 */
			applyCustomStateExtension: function(oState, bIsSameAsLast){},
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
			beforeDeleteExtension: function() {},
			/**
			 *
			 * @protected
			 */
			beforeLineItemDeleteExtension: function(oBeforeLineItemDeleteProperties) {}
		};
	});