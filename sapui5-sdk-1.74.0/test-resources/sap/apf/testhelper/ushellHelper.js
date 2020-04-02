/*!
 * SAP APF Analysis Path Framework
 *
 * Copyright (C) 2009-2019 SAP AG or an SAP affiliate company. All rights reserved
 */
/*global sap */

sap.ui.define([
],
function(){
	'use strict';
	var sapApfCumulativeFilter;
	var selectionVariant;
	var externalNavigationConfiguration;
	var externalComponent;

	var ushellHelper = {};
	ushellHelper.spys = {};
	ushellHelper.setup = function(config) {
		ushellHelper.ushellOrig = sap.ushell;
		sapApfCumulativeFilter = 'UI5 filter expression';
		sap.ushell = {};
		sap.ushell.numberOfCallsForGetSemanticObjectLinks = 0;
		sap.ushell.sapApfState = {
			path : 'Alpha',
			filterIdHandler : {
				filterId1 : 'Beta'
			}
		};
		sap.ushell.Container = {
			getService : function(serviceName) {
				if (serviceName === "CrossApplicationNavigation") {
					return {
						hrefForExternal : function(configuration){
							sap.ushell.hrefConfiguration = configuration;
							return '#FioriApplication-executeAPFConfigurationS4HANA';
						},
						toExternal : function(configuration, component) {
							externalNavigationConfiguration = configuration;
							externalComponent = component;
						},
						createEmptyAppState : function(component) {
							return {
								setData : function(data) {
									ushellHelper.spys.setData = data;
								},
								save : function() {
									ushellHelper.spys.isSaved = true;
								},
								getKey : function() {
									return "AppStateKey1972";
								}
							};
						},
						getAppState : function(component, key) {
							if (config && config.functions && config.functions.getAppState) {
								return config.functions.getAppState();
							}
							ushellHelper.spys.getAppState = {
								component : component,
								key : key
							};
							var deferred = jQuery.Deferred();
							deferred.resolve({
								getData : function() {
									return {
										'sapApfState' : sap.ushell.sapApfState,
										'sapApfCumulativeFilter' : sapApfCumulativeFilter,
										'selectionVariant': selectionVariant
									};
								}
							});
							return deferred.promise();
						},
						getLinks : function(configObject) {
							sap.ushell.numberOfCallsForGetSemanticObjectLinks++;
							var deferred = jQuery.Deferred();
							if(configObject && typeof configObject.semanticObject === "string"){
								var intents;
								if (config && config.functions && config.functions.getSemanticObjectLinkIntents) {
									intents = config.functions.getSemanticObjectLinkIntents(configObject.semanticObject, configObject.action, configObject.params);
								} else {
									intents = [ {
										intent : "#aSemanticObject-action1",
										text : "action1"
									}, {
										intent : "#aSemanticObject-actionWithParam?a=b",
										text : "actionWithParam"
									} ];
								}
								deferred.resolve(intents);
								return deferred.promise();
							}
							return deferred.reject();
						}
					};
				}
				return undefined;
			}
		};
	};
	ushellHelper.setApfCumulativeFilter = function (newFilter){
		sapApfCumulativeFilter = newFilter;
	};
	ushellHelper.setSelectionVariant = function (newVariant){
		selectionVariant = newVariant;
	};
	ushellHelper.getExternalNavigationConfiguration = function(){
		return externalNavigationConfiguration;
	};
	ushellHelper.getExternalComponent = function(){
		return externalComponent;
	};
	ushellHelper.teardown = function() {
		ushellHelper.spys = {};
		sap.ushell = ushellHelper.ushellOrig;
	};
	return ushellHelper;
}, true /*Global_Export*/);