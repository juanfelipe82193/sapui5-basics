/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */

/**
 * @namespace reserved for Fiori Elements
 * @name sap.fe.core
 * @private
 * @experimental
 */

/**
 * Initialization Code and shared classes of library sap.fe.core
 */
sap.ui.define(
	[
		"sap/fe/core/services/TemplatedViewServiceFactory",
		"sap/fe/core/services/ResourceModelServiceFactory",
		"sap/fe/core/services/CacheHandlerServiceFactory",
		"sap/fe/core/services/NamedBindingModelServiceFactory",
		"sap/fe/core/services/DraftModelServiceFactory",
		"sap/fe/core/services/NavigationServiceFactory",
		"sap/ui/core/service/ServiceFactoryRegistry"
	],
	function(
		TemplatedViewServiceFactory,
		ResourceModelServiceFactory,
		CacheHandlerServiceFactory,
		NamedBindingModelService,
		DraftModelService,
		NavigationService,
		ServiceFactoryRegistry
	) {
		"use strict";

		/**
		 * @namespace
		 * @name sap.fe.core.actions
		 * @private
		 * @sap-restricted
		 * @experimental
		 */

		/**
		 * @namespace
		 * @name sap.fe.core.controllerextensions
		 * @private
		 * @sap-restricted
		 * @experimental
		 */

		/**
		 * @namespace
		 * @name sap.fe.core.model
		 * @private
		 * @sap-restricted
		 * @experimental
		 */

		/**
		 * @namespace
		 * @name sap.fe.core.navigation
		 * @private
		 * @sap-restricted
		 * @experimental
		 */

		/**
		 * Fiori Elements Core Library
		 *
		 * @namespace
		 * @name sap.fe.core
		 * @private
		 * @experimental
		 */

		// // library dependencies
		// // delegate further initialization of this library to the Core
		// sap.ui.getCore().initLibrary({
		// 	name: "sap.fe.core",
		// 	dependencies: ["sap.ui.core"],
		// 	types: [],
		// 	interfaces: [],
		// 	controls: [],
		// 	elements: [],
		// 	version: "1.74.0"
		// });

		var coreLibrary = {
			init: function() {
				ServiceFactoryRegistry.register("sap.fe.core.services.TemplatedViewService", new TemplatedViewServiceFactory());
				ServiceFactoryRegistry.register("sap.fe.core.services.ResourceModelService", new ResourceModelServiceFactory());
				ServiceFactoryRegistry.register("sap.fe.core.services.CacheHandlerService", new CacheHandlerServiceFactory());
				ServiceFactoryRegistry.register("sap.fe.core.services.NamedBindingModelService", new NamedBindingModelService());
				ServiceFactoryRegistry.register("sap.fe.core.services.DraftModelService", new DraftModelService());
				ServiceFactoryRegistry.register("sap.fe.core.services.NavigationService", new NavigationService());
			}
		};

		return coreLibrary;
	},
	/* bExport= */ false
);
