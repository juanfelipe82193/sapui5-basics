/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2019 SAP SE. All rights reserved
 */sap.ui.define([
	'sap/apf/api',
	'sap/apf/testhelper/doubles/Representation',
	'sap/apf/Component',
	'sap/ui/core/ComponentContainer'
],function(
	ApfApi,
	RepresentationDouble,
	ApfComponent,
	ComponentContainer
) {
	'use strict';

	/*BEGIN_COMPATIBILITY*/
	RepresentationDouble = RepresentationDouble || sap.apf.testhelper.doubles.Representation;
	/*END_COMPATIBILITY*/

	var componentCounter = 0;
	/**
	 * creates a component, that extends from the sap.apf.Component
	 * The ajax is automatically adjusted to find the resource paths
	 * @param {object} oContext the context is enhanced with component and componentContainter
	 * @param {object} sComponentId is the id of the component
	 * @param {object} inject is the inject structure
	 * @param {string} applicationConfigurationPath
	 * @param {componentData} is component data
	 * @returns {sap.apf.testhelper.doubles.component.Component}
	 */
	function create(oContext, sComponentId, inject, applicationConfigurationPath, componentData,
					onBeforeStartApfCallback, onAfterStartApfCallback) {

		var probeContext;

		var Component = ApfComponent.extend("sap.apf.testhelper.doubles.component.Component", {
			oApi : null,
			metadata : {
				"config" : {
					"fullWidth" : true
				},
				"name" : "CoreComponent",
				"version" : "0.0.1",
				"publicMethods" : [ "getApi", "getProbe", "getInjections" ],
				"dependencies" : {
					"libs" : [ "sap.apf" ]
				}
			},

			init: function() {
				this.oApi = new ApfApi(this, inject);
				if (inject && inject.exits && inject.exits.afterApiCreation){
					inject.exits.afterApiCreation(probeContext)
				}
				return ApfComponent.prototype.init.apply(this, arguments);
			},

			createContent: function() {
				this.oApi = this.getApi();
				if (applicationConfigurationPath !== "") {
					this.oApi.loadApplicationConfig(applicationConfigurationPath);
				}
				if(onBeforeStartApfCallback && typeof onBeforeStartApfCallback === "function"){
					this.oApi.setCallbackBeforeApfStartup(onBeforeStartApfCallback);
				}
				if(onAfterStartApfCallback && typeof onAfterStartApfCallback === "function"){
					this.oApi.setCallbackAfterApfStartup(onAfterStartApfCallback);
				}
				return ApfComponent.prototype.createContent.apply(this, arguments);
			},
			getProbe : function() {
				return probeContext;
			},
			getInjections : function() {
				function probe(dependencies) {
					probeContext = dependencies;
				}
				inject = inject || {};
				inject.probe = probe;
				return inject;
			}
		});

		var sId = (sComponentId || "Comp1") + componentCounter++;

		var oComponent = new Component({
			id : sId,
			componentData : componentData
		});

		var sContainerId = "Cont" + sId;
		oContext.oCompContainer = new ComponentContainer(sContainerId, {
			component : oComponent
		});
		oContext.oCompContainer.setComponent(oComponent);

		return oComponent;
	}

	/*BEGIN_COMPATIBILITY*/
	sap.apf.testhelper.doubles.component = sap.apf.testhelper.doubles.component || {};
	sap.apf.testhelper.doubles.component.create = create;
	/*END_COMPATIBILITY*/

	return {
		create: create
	}
}, true /*GLOBAL_EXPORT*/);