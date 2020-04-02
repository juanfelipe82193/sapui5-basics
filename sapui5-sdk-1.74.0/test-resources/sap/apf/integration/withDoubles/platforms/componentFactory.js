/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */

sap.ui.define([
	'sap/apf/base/Component',
	'sap/apf/modeler/Component'
], function(BaseComponent, ModelerComponent) {
	'use strict';

	var manifest = {
		"_version": "1.3.0",
		"sap.app": {
			"_version": "1.3.0",
			"id": "toBePatchedByCorrectID",
			"type": "application",
			"i18n": "../../../../../test-resources/sap/apf/integration/withDoubles/platforms/i18n/texts.properties",
			"title": "{{title}}",
			"description": "{{description}}",
			"dataSources": {
				"PathPersistenceServiceRoot": {
					"uri": "/hugo-xs1",
					"type": "OData",
					"settings": {
						"odataVersion": "2.0"
					}
				},
				"apf.runtime.analysisPaths": {
					"uri": "/hugo-egon-analysisPaths",
					"type": "JSON"
				},
				"apf.runtime.analyticalConfigurationAndTextFiles": {
					"uri": "/hugo-cloud-foundry",
					"type": "JSON"
				}
			},
			"offline": false
		},
		"sap.apf": {
			"why": "sap.apf object required in test setup"
		},
		"sap.ui": {
			"_version": "1.1.0",
			"technology": "UI5"
		},
		"sap.ui5": {
			"_version": "1.1.0",
			"extends": {
				"component": "sap.apf.base"
			}
		}
	};
	/**
	 * @description Copies all members of a name space of a manifest into the target manifest, overwriting existing members.
	 * Shallow copy member by member, sub objects are copied by reference.
	 * @param {String} spaceName The name of a name space in the manifest.
	 * @param {Object} from A manifest
	 * @param {Object} to A manifest
	 */
	function copyToManifest(spaceName, from, to) {
		if (from[spaceName]) {
			to[spaceName] = to[spaceName] || {}; // defense
			Object.keys(from[spaceName]).forEach(function(key) {
				to[spaceName][key] = from[spaceName][key];
			});
		}
	}
	function createAComponent(name, Component, inlayCreateContent, inject, componentData, injectedManifest, suppressCreateContent) {
		injectedManifest = injectedManifest || {};
		inject = inject || {};
		componentData = componentData || {};

		name = name || "sap.apf.test.1";

		var manifestWithID = jQuery.extend(true, {}, manifest);
		manifestWithID['sap.app']['id'] = name;
		var componentName = name + ".Component";
		var extendedComponent = Component.extend(componentName, {
			oApi: null,
			metadata: {
				"manifest": manifestWithID
			},
			init: function() {
				var manifestBefore = jQuery.extend({}, true, this.getMetadata().getManifest());
				var fGetManifest = this.getMetadata().getManifest;
				this.getMetadata().getManifest = function() {
					if (injectedManifest["sap.apf"]) {
						copyToManifest("sap.apf", injectedManifest, manifestBefore);
					}
					if (injectedManifest["sap.app"]) {
						copyToManifest("sap.app", injectedManifest, manifestBefore);
					}
					return manifestBefore;
				};
				var base = Component.prototype.init.apply(this, arguments);
				this.getMetadata().getManifest = fGetManifest;
				return base;
			},
			createContent: function() {
				var api;
				if (inlayCreateContent) {
					if (this.getApi){
						api = this.getApi();
					}
					api = api || {};
					inlayCreateContent(api);
				}
				if (suppressCreateContent){
					return;
				}
				return Component.prototype.createContent.apply(this, arguments);
			},
			getInjections: function() {
				return {
					functions: inject.functions,
					constructors: inject.constructors
				};
			}
		});
		var oParameter = {
			id: "component_" + name,
			componentData: componentData
		};
		return new extendedComponent(oParameter);
	}

	var module = {
		/**
		 * @description Create a parameterized test component for APF runtime, based on a manifest set by the using module.
		 * If necessary, the manifest could be completely set by the using module, extending the manifest of the base class.
		 * @param {string} name  Unique component name.
		 * @param {Function} inlayCreateContent With parameter apf.api. Will be called by Component.createContent().
		 * @param {Object} inject Allows to inject constructors or function as stubs. Those stubs may use assert.
		 * @param {Object|undefined} componentData
		 * @param {Object|undefined} injectedManifest Supported namespaces are "dataSources" and "sap.apf"
		 * @param {boolean|undefined} suppressCreateContent When true the createContent of the base class is skipped
		 * @returns {sap.ui.Component} A parameterized sub class instance of sap.apf.ase.Component.
		 */
		createRuntimeComponent: function(name, inlayCreateContent, inject, componentData, injectedManifest, suppressCreateContent) {
			return createAComponent(name, BaseComponent, inlayCreateContent, inject, componentData, injectedManifest, suppressCreateContent);
		},
		/**
		 * @description Create a parameterized test component for APF modeler, based on a manifest set by the using module.
		 * If necessary, the manifest could be completely set by the using module, extending the manifest of the base class.
		 * @param {Function} inlayCreateContent With parameter apf.api. Will be called by Component.createContent().
		 * @param {Object} inject Allows to inject constructors or function as stubs. Those stubs may use assert.
		 * @param {Object|undefined} componentData
		 * @param {Object|undefined} injectedManifest Supported namespaces are "dataSources" and "sap.apf"
		 * @param {boolean|undefined} suppressCreateContent When true the createContent of the base class is skipped
		 * @returns {sap.ui.Component} A parameterized sub class instance of sap.apf.ase.Component.
		 */
		createModelerComponent: function(inlayCreateContent, inject, componentData, injectedManifest, suppressCreateContent) {
			return createAComponent(null, ModelerComponent, inlayCreateContent, inject, componentData, injectedManifest, suppressCreateContent);
		},
		applicationId: "AAAAAAAA05550175E10000000AAAAAAA",
		configurationId: "BBBBBBBB05550175E10000000BBBBBBB",
		analyticalConfigurationName: "configForTesting",
		createConfiguration: function() {
			return {
				analyticalConfigurationName: module.analyticalConfigurationName,
				configHeader: {
					AnalyticalConfigurationName: module.analyticalConfigurationName,
					AnalyticalConfiguration: module.configurationId,
					Application: module.applicationId
				},
				categories: [],
				steps: [],
				requests: [],
				bindings: [],
				navigationTargets: [],
				representationTypes: []
			};
		}
	};
	return module;
});
