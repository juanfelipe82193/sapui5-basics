/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2017 SAP SE. All rights reserved
 */
/*global sap, jQuery*/

sap.ui.define("sap.apf.newDemokit.modeler.Component", [
		'sap/apf/demokit/mockserver',
		'sap/apf/modeler/Component',
		'sap/apf/demokit/configuration/demokit',
		'sap/apf/demokit/configuration/demokitHierarchy',
		'sap/apf/demokit/configuration/demokitSFB'
	],
	function (MockServer, ModelerComponent, StandardConfig, SFBConfig, HierarchyConfig) {
		'use strict';

		var _mockServer = MockServer("../../../../../resources/sap/apf/demokit/");

		ModelerComponent.extend("sap.apf.newDemokit.modeler.Component", {
			metadata: {
				manifest: "json"
			},
			/**
			 * Initialize the application
			 */
			init: function () {
				this.modelerService = _mockServer.mockConfigurationService([StandardConfig, SFBConfig, HierarchyConfig]);
				_mockServer.mockDemokitService();
				_mockServer.mockHierarchyService();

				ModelerComponent.prototype.init.apply(this, arguments);
			},
			/**
			 * Creates the application layout and returns the outer layout of APF
			 */
			createContent: function () {
				var filePath = "../../../../../resources/sap/apf/demokit/runtime/i18n/app.properties";
				_mockServer.importTextsFromFile(filePath, this.modelerService);
				return ModelerComponent.prototype.createContent.apply(this, arguments);
			},
			/**
			 * destroy of the component
			 */
			destroy: function () {
				ModelerComponent.prototype.destroy.apply(this, arguments);
			},
			getInjections: function () {
				return {
					exits: {
						getRuntimeUrl: function (applicationId, configurationId) {
							var url = location.href;
							url = url.slice(0, url.indexOf("#"));
							url = url.replace("modeler", "runtime");
							if (_mockServer.getConfigurationFromLocalStorage(configurationId)) {
								if (url.indexOf('?') > -1) {
									url = url + "&";
								} else {
									url = url + "?";
								}
								url = url + "sap-apf-configuration-id=" + configurationId;
							}
							return url;
						}
					}
				};
			}
		});
	});
