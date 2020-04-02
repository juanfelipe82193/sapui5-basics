sap.ui.define([
	"sap/ui/core/mvc/Controller", "sap/ui/core/mvc/ControllerExtension", "sap/m/MessageToast"],
	function (Controller, ControllerExtension, MessageToast) {
		"use strict";
			return ControllerExtension.extend("{{controllerExtensionName}}", {
		// metadata: {
		// 	// extension can declare the public methods
		// 	// in general methods that starts with "_" are private
		// 	methods: {
		// 		publicMethod: {
		// 			public: true /*default*/ ,
		// 			final: false /*default*/ ,
		// 			overrideExecution: OverrideExecution.Instead /*default*/
		// 		},
		// 		finalPublicMethod: {
		// 			final: true
		// 		},
		// 		onMyHook: {
		// 			public: true /*default*/ ,
		// 			final: false /*default*/ ,
		// 			overrideExecution: OverrideExecution.After
		// 		},
		// 		couldBePrivate: {
		// 			public: false
		// 		}
		// 	}
		// },

		// // adding a private method, only accessible from this controller extension
		// _privateMethod: function() {},
		// // adding a public method, might be called or overridden from other controller extensions as well
		// publicMethod: function() {},
		// // adding final public method, might be called but not overridden from other controller extensions as well
		// finalPublicMethod: function() {},
		// // adding a hook method, might be called or overridden from other controller extensions.
		// // override these method does not replace the implementation, but executes after the original method.
		// onMyHook: function() {},
		// // method per default public, but made private per metadata
		// couldBePrivate: function() {},
		// // this section allows to extend lifecycle hooks or override public methods of the base controller
		// override: {
		// 	/**
		// 	 * Called when a controller is instantiated and its View controls (if available) are already created.
		// 	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		// 	 * @memberOf {{controllerExtensionName}}
		// 	 */
		// 	onInit: function() {
		// 	},

		// 	/**
		// 	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		// 	 * (NOT before the first rendering! onInit() is used for that one!).
		// 	 * @memberOf {{controllerExtensionName}}
		// 	 */
		// 	onBeforeRendering: function() {
		// 	},

		// 	/**
		// 	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		// 	 * This hook is the same one that SAPUI5 controls get after being rendered.
		// 	 * @memberOf {{controllerExtensionName}}
		// 	 */
		// 	onAfterRendering: function() {
		// 	},

		// 	/**
		// 	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		// 	 * @memberOf {{controllerExtensionName}}
		// 	 */
		// 	onExit: function() {
		// 	},

		// 	override public method of the base controller
		//	"templateBaseExtension": {
		//  /**
		//	* Can be used to store specific state. Therefore, the implementing controller extension must call fnSetAppStateData(oControllerExtension, oAppState).
		//	* oControllerExtension must be the ControllerExtension instance for which the state should be stored. oAppState is the content of the custom field to be stored, 
		//	* so that it can be restored later. For example, after a back navigation.
		//	* The developer must ensure, that the content of the field is stored in the oAppState.
		//	* Note that the call is ignored if oAppState is faulty
		//	*/
                //	provideExtensionAppStateData: function(fnSetAppStateData){
                //		var oAppState = {};
                //		var oCustomField = this.byId("SalesOrderID");
                //		if (oCustomField) {
                //			oAppState.SalesOrder = oCustomField.getValue();
                //		}
                //		fnSetAppStateData(ControllerExtension, oAppState);
                //	},
		//	/**
		//	 * allows extensions to restore their state according to a state which was previously stored.
		//	 * Therefore, the implementing controller extension can call fnGetAppStateData(oControllerExtension) 
		//	 * in order to retrieve the state information which has been stored in the current state for this controller extension.
		//	 * undefined is returned by this function if no state or a faulty state is stored.
		//	 */		
				// 	restoreExtensionAppStateData: function(fnGetAppStateData){
                // 		this.oExtensionData = fnGetAppStateData(this);
                //  		var oCustomField = this.byId("SalesOrderID");
                //  		oCustomField.setValue();
                //  		if (this.oExtensionData) {
                //      		if (this.oExtensionData.SalesOrder) {
                //          			oCustomField.setValue(this.oExtensionData.SalesOrder);
                //      		}
                //  		}
				//	},
		//	/**
		//	 * allows extension to add filters. They will be combined using AND with all other filters
		//	 * For each filter the extension must call fnAddFilter(oControllerExtension, oFilter)
		//	 */
				// 	addFilters: function(fnAddFilter){
                // 		var oValue1 = this.byId("PurchaseContract").getValue();
                // 		var aFilters = [], oFilter1;
                // 		if (oValue1) {
                //     			oFilter1 = new sap.ui.model.Filter({
                //         		path: "PurchaseContract",
                //         		operator: "EQ",
                //         		value1: oValue1
                //     			});
                //     			aFilters.push(oFilter1);
                // 		}
                // 		if (aFilters && aFilters.length > 0) {
                //      		fnAddFilter(this, new sap.ui.model.Filter(aFilters, true));
                // 		}				
				//	},
		//	/**
		//	* Modifies the selection variant to be set to the SFB
		//	   	* @param oCustomData  : reference to the custom selection variant expected by OVP library
		//	*/				
                // 	provideStartupExtension: function(oCustomSelectionVariant){
                //     		return new Promise(function (resolve, reject) {
                //         	setTimeout(function () {
                //             		oCustomSelectionVariant.addSelectOption("SalesOrder", "I", "EQ", "500000334");
                //             		resolve();
                //         	}, 10);
                //     		});
                // 	},
		//	/**
		//	* This function takes the standard navigation entry details (if present) for a particular card and context.
		//	* Returns a new/modified custom navigation entry to the core. The core will then uses the custom
		//	* navigation entry to perform navigation
		//		* @param sCardId  : Card id as defined in manifest for a card
		//		* @param oContext : Context of line item that is clicked (empty for header click)
		//		* @param oNavigationEntry : Custom navigation entry to be used for navigation
		//		* @returns {object} : Properties are {type, semanticObject, action, url, label}
		//	*/
                // 	provideExtensionNavigation: function (sCardId, oContext, oNavigationEntry) {
                //    		var oCustomNavigationEntry;
                //    		var oEntity = oContext && oContext.sPath && oContext.getProperty && oContext.getProperty(oContext.sPath);
                //    		if (sCardId === "card00" && oEntity && oEntity.SalesOrder === "500000334") {
                //        	oCustomNavigationEntry = {};
                //        	oCustomNavigationEntry.type = "com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation";
                //        	oCustomNavigationEntry.semanticObject = "Action";
                //        	oCustomNavigationEntry.action = "toappnavsample";
                //        	oCustomNavigationEntry.url = ""; //Only required when type is DataFieldWithUrl
                //        	oCustomNavigationEntry.label = ""; //Optional
                //  		}
                //  	return oCustomNavigationEntry;
			//	},
		//	/**
		//	* This function takes the press event text and returns the event corresponsing to it
		//	* The method you are defining should also be defined in the controller extension
		//		* @param sCustomAction  : The press event name
		//		* @returns {function} : Event Corresponding to the name passed
		//	*/
				// 	provideCustomActionPress: function (sCustomAction) {
				//		if (sCustomAction === "press1") {
				//			return this.base.templateBaseExtension.press1;
				//		} else if (sCustomAction === "press2") {
				//			return this.base.templateBaseExtension.press2;
				//		}
				//	},
				//	press1: function(oEvent) {
		        //		window.open("https://www.google.co.in");
		        //	},
				//	press2: function(oEvent) {
				//		window.open("http://www.sap.com/index.html");
				//	},
		// /**
		// * This function takes the name or key corresponding to a method that is then returned
		// * The method that is returned will resolve to give the custom parameters
		// * The method to be returned should also be defined in the extension controller
		//	* @param sCustomParams  : Name or key corresponding to a method
		// 	* @returns {object} : Method that will resolve to give the Custom parameter required for navigation
		// */
                // 	provideCustomParameter: function (sCardId, oContext, oNavigationEntry) {
				//		if (sCustomParams === "getParameters") {
				//			return this.base.templateBaseExtension.getParameters;
				//		} else if (sCustomParams === "param2") {
				//			return this.base.templateBaseExtension.param2;
				//		}
				//	},
				//	getParameters: function(oNavigateParams,oSelectionVariantParams) {
				//		var aCustomSelectionVariant = [];
				//		var aSelectOptions = oSelectionVariantParams.getSelectOptionsPropertyNames();
				//		if (aSelectOptions.indexOf("SupplierName")!=-1) {
				//			var aSupplierFilter = oSelectionVariantParams.getSelectOption("SupplierName");
				//			var sSupplierFilterValue = aSupplierFilter[0].Low;
				//			aSupplierFilter[0].Low = "";
				//		}
				//		var oSupplierName = {
				//	  		path: "SupplierName",
				//			operator: "EQ",
				//			value1: "",
				//			value2: null,
				//			sign: "I"
				//		};
				//		var oLandFilter = {
				//			path: "Land1",
				//			operator: "EQ",
				//			value1: sSupplierFilterValue,
				//			value2: null,
				//			sign: "I"
				//		};
				//		var oCustomSelectionVariant = {
				//			path: "TaxTarifCode",
				//			operator: "EQ",
				//			value1: 5,
				//			value2: null,
				//			sign: "I"
				//		};
				//		aCustomSelectionVariant.push(oCustomSelectionVariant);
				//		aCustomSelectionVariant.push(oLandFilter);
				//		aCustomSelectionVariant.push(oSupplierName);
				//		return {
				//			selectionVariant: aCustomSelectionVariant,
				//			ignoreEmptyString: true
				//		};
				//	},
				//	param2: function(oNavigateParams) {
				//		oNavigateParams.TaxTarifCode = '3';
				//		return oNavigateParams;
				//	}
		//	}
	//	}
	});
});

