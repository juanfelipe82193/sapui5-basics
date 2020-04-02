/*!
 * SAPUI5

		(c) Copyright 2009-2020 SAP SE. All rights reserved
	
 */

/**
 * @fileOverview Application component to display information on entities from the
 *   zui5_epm_sample OData service.
 * @version @version@
 */
sap.ui.define([
	"jquery.sap.global",
	"sap/m/HBox",
	"sap/ui/core/UIComponent",
	"sap/ui/core/mvc/ViewType",
	"sap/ui/model/json/JSONModel"
], function (jQuery, HBox, UIComponent, ViewType, JSONModel)  {
	"use strict";
	return UIComponent.extend("sap.ui.mdc.performance.samples.table", {
		init : function() {
			UIComponent.prototype.init.apply(this);
		},
		_getCellEditorTemplate: function(i) {
			var sCellEditor = window._getUrlParameter("celleditor");
			var oItemTemplate;
			if (sCellEditor === "sap.m.Text") {
				oItemTemplate = new sap.m.Text({
					text: {path:"column" + i + "/value"}
				});
			} else if (sCellEditor === "sap.m.Input") {
				oItemTemplate = new sap.m.Input({
					value: {path:"column" + i + "/value"}
				});
			} else if (sCellEditor === "sap.ui.mdc.Field") {
				oItemTemplate = new sap.ui.mdc.Field({
					value: {path:"column" + i + "/value"},
					editMode: "Display"
				});
			}
			return oItemTemplate;
		},
		_createResponsiveTable: function() {
			var oTable = new sap.m.Table();
			var oItemTemplate = new sap.m.ColumnListItem();
			for (var i = 0; i < window._measure.cols.length; i++) {
				oItemTemplate.addCell(this._getCellEditorTemplate(i));
				var oColumnData = window._measure.cols[i];
				var oColumn = new sap.m.Column({
					header: new sap.m.Label({text:oColumnData.label})
				});
				oTable.addColumn(oColumn);
			}
			oTable.bindItems({path: "/rows", template: oItemTemplate});
			return oTable;
		},
		_createGridTable: function() {
			var oTable = new sap.ui.table.Table();
			for (var i = 0; i < window._measure.cols.length; i++) {
				var oColumnData = window._measure.cols[i];
				var oColumn = new sap.ui.table.Column({
					label: oColumnData.label,
					template: this._getCellEditorTemplate(i)
				});
				oTable.addColumn(oColumn);
			}
			oTable.bindRows({path: "/rows"});
			return oTable;
		},
		_createJSView : function() {
			var sTableType = window._getUrlParameter("tabletype");
			var oTable;
			if (sTableType === "sap.m.Table") {
				oTable = this._createResponsiveTable();
			} else {
				oTable = this._createGridTable();
			}
			var oView = sap.ui.jsview("samples.table.JSView", {  // this View file is called Address.view.js
				getControllerName: function() {
					return "samples.table.Main";     // the Controller lives in Address.controller.js
				},
				createContent: function(oController) {
					return [new sap.m.VBox({
						items: [
							oTable
						]
					})];
				}
			});
			oView = sap.ui.jsview("samples.table.JSView", true);
			return oView;
		},
		_createTemplatedXMLView: function(bUseIndexDBCache, sContent) {
			if (sContent) {
				var oViewSettings = {
					async: true,
					id: "samples.table",
					type: ViewType.XML,
					viewContent: sContent
				};
				return sap.ui.view(oViewSettings);
			} else {
				var oViewSettings = {
					async: true,
					id: "samples.table",
					type: ViewType.XML,
					viewName: "samples.table.Main"
				};
				if (bUseIndexDBCache) {
					oViewSettings.cache = {
						keys: [document.location.search.substring(1)]
					};
					window._measure.result["cache"] = "indexDB";
				}
				var oTemplateModel = new sap.ui.model.json.JSONModel(window._measure);
				oViewSettings.preprocessors = jQuery.extend(oViewSettings.preprocessors, {
					xml: {
						bindingContexts: {
							'parameters' : oTemplateModel.createBindingContext("/parameters"),
							'columns' : oTemplateModel.createBindingContext("/cols")
						},
						models: {
							'parameters': oTemplateModel,
							'columns' : oTemplateModel
						}
					}
				});
			}
			return sap.ui.view(oViewSettings);
		},
		createContent : function () {
			window._measure.result["view_start"] = performance.now();
			var bUseXML = window._getUrlParameter("usexml") === "yes",
				sCaching = bUseXML && window._getUrlParameter("caching");
			if (!bUseXML) {
				return this._createJSView();
			} else {
				var sCacheKey = document.location.search.substring(1);
				if (sCaching === "local") {
					var sCacheContent = localStorage.getItem(sCacheKey);
					if (sCacheContent) {
						window._measure.result["cache"] = "local";
						return this._createTemplatedXMLView(false, sCacheContent);
					}
				}
				return this._createTemplatedXMLView(sCaching === "indexDB");
			}
		}
	});
});
