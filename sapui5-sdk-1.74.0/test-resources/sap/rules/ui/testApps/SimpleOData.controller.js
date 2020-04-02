sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/util/MockServer"
], function (Controller, JSONModel, MockServer) {
	"use strict";
	return Controller.extend("sap.rules.ui.testApps.SimpleOData", {

		onInit: function () {
			var oFormData = {
				serviceURL: "",
				isMockData: true,
				overall: 0,
				onBeforeRendering: 0,
				rendering: 0,
				onAfterRendering: 0,
				ruleCreate: 0,
				factor: 0,
				createRows: 0,
				updateTableContent: 0,
				updateRowHeader: 0,
				syncColumnHeaders: 0
			};
			var oModel = new JSONModel(oFormData);
			this.getView().setModel(oModel);

			this.aRenderResults = [];
			this.aFunctionResults = [];
			this.aVisibleRow = [];
			
			var sUrl = "/sap/opu/odata/SAP/RULE_SRV/";
			this.oMockServer = new sap.ui.core.util.MockServer({
				rootUri: sUrl
			});
			this.oMockServer.simulate("../localService/data/static/rule/metadata.xml","../localService/data/static/rule");
		},

		onCreateRuleClick: function () {
			var oView = this.getView(),
			oDataModel = oView.getModel();

			var sRuleId = oDataModel.getProperty("/ruleId");
			//sServiceUrl = "../../../../../proxy/" + sServiceUrl.replace("://", "/");
			
			var bIsMockData = oDataModel.getProperty("/isMockData");
			if (bIsMockData === true || bIsMockData === "true"){
				this.oMockServer.start();
			} else {
				this.oMockServer.stop();
			}
			
			/**
			 * Clear the Table and rebind it
			 */
			var oRuleBuilderContainer = oView.byId("ruleBuilderContainerPanel");
			var oRuleBuilder = oRuleBuilderContainer.getContent()[0];
			var oTable;
			//clean up
			if (oRuleBuilder) {
				if (oRuleBuilder.getAggregation("_rule")){
					oTable = oRuleBuilder.getAggregation("_rule").getAggregation("_table");
					if (oTable){
						oTable.unbindRows();
						oTable.destroyColumns();
					}
				}
				oRuleBuilderContainer.removeContent(oRuleBuilder);
				oRuleBuilder.destroy();
			}

			jQuery.sap.measure.start("createRule");
			oRuleBuilder = new sap.rules.ui.RuleBuilder({
				types: [sap.rules.ui.RuleType.DecisionTable]
			});
			
			oRuleBuilderContainer.addContent(oRuleBuilder);

			oRuleBuilder.addDelegate({
				onBeforeRendering: function () {
					jQuery.sap.measure.start("onBeforeRendering","",["Render"]);
					jQuery.sap.measure.start("rendering","",["Render"]);
				},
				onAfterRendering: function () {
					jQuery.sap.measure.start("onAfterRendering","",["Render"]);
				}
			}, true);
			
			var that = this;
			var fnRowsUpdated = function() {
				//var oDataModel = that.getView().getModel();
				oTable.detachEvent("_rowsUpdated", fnRowsUpdated);

				var iOverall =  Math.round(jQuery.sap.measure.end("createRule").duration * 1) / 1;
				var iRendering =  Math.round(jQuery.sap.measure.getMeasurement("rendering").duration * 1) / 1;
				var iBeforeRendering =  Math.round(jQuery.sap.measure.getMeasurement("onBeforeRendering").duration * 100) / 100;
				var iAfterRendering =  Math.round(jQuery.sap.measure.getMeasurement("onAfterRendering").duration * 1) / 1;

				var iRuleCreate =  Math.round((iOverall - iRendering) * 1) / 1;
				var iFactor = Math.round(iAfterRendering / iRendering * 100);

				oDataModel.setProperty("/overall",iOverall);
				oDataModel.setProperty("/onBeforeRendering",iBeforeRendering);
				oDataModel.setProperty("/rendering",iRendering);
				oDataModel.setProperty("/onAfterRendering",iAfterRendering);
				oDataModel.setProperty("/ruleCreate",iRuleCreate);
				oDataModel.setProperty("/factor", iFactor);

				var oRenderResult = {
					overall: iOverall,
					onBeforeRendering: iBeforeRendering,
					rendering: iRendering,
					onAfterRendering: iAfterRendering,
					ruleCreate: iRuleCreate,
					factor: iFactor
				};

				that.aRenderResults.push(oRenderResult);
			};

			oRuleBuilder.addDelegate({
				onBeforeRendering: function () {
					jQuery.sap.measure.end("onBeforeRendering");
					oTable = oRuleBuilder.getAggregation("_rule").getAggregation("_table");
					oTable.attachEvent("_rowsUpdated", fnRowsUpdated);
				},
				onAfterRendering: function () {
					jQuery.sap.measure.end("onAfterRendering");
					jQuery.sap.measure.end("rendering");
				}
			}, false);
			

			

			
			//var oModel = new sap.ui.model.odata.v2.ODataModel(sServiceUrl, true);
			//oModel.setDefaultCountMode("Inline");

			var oModel = new sap.ui.model.odata.v2.ODataModel({
					serviceUrl: "/sap/opu/odata/SAP/RULE_SRV/",
					defaultBindingMode: sap.ui.model.BindingMode.TwoWay
			});

			oRuleBuilder.setModel(oModel);
			sRuleId = sRuleId || "005056912EC51EE68784F49CA61EF8EC";
			var sRulePath = "/Rules(\'" + sRuleId + "\')";
			oRuleBuilder.setBindingContextPath(sRulePath);
			
			window.oTable = oTable;

			var aJSMeasure = jQuery.sap.measure.filterMeasurements(function(oMeasurement) {
				return oMeasurement.categories.indexOf("JS") > -1? oMeasurement : null;
			});

			var aRenderMeasure = jQuery.sap.measure.filterMeasurements(function(oMeasurement) {
				return oMeasurement.categories.indexOf("Render") > -1? oMeasurement : null;
			});

			function getValue(attributeName, oObject) {
				if (oObject) {
					return oObject[attributeName];
				} else {
					return "";
				}
			}

			//set test result
			var iCreateRows = Math.round(getValue("duration", aJSMeasure[0])* 1) / 1;
			var iUpdateTableContent = Math.round(getValue("duration", aJSMeasure[1]) * 1) / 1;
			var iUpdateRowHeader = Math.round(getValue("duration", aJSMeasure[2]) * 1) / 1;
			var iSyncColumnHeaders = Math.round(getValue("duration", aJSMeasure[3]) * 1) / 1;

			oDataModel.setProperty("/createRows",iCreateRows);
			oDataModel.setProperty("/updateTableContent", iUpdateTableContent);
			oDataModel.setProperty("/updateRowHeader", iUpdateRowHeader);
			oDataModel.setProperty("/syncColumnHeaders", iSyncColumnHeaders);

			var oFunctionResult = {
				createRows: iCreateRows,
				updateTableContent: iUpdateTableContent,
				updateRowHeader: iUpdateRowHeader,
				syncColumnHeaders: iSyncColumnHeaders
			};

			this.aFunctionResults.push(oFunctionResult);
		},

		onDownload: function() {

			var overallAve = 0,
			onBeforeRenderingAve = 0,
			renderingAve = 0,
			onAfterRenderingAve = 0,
			ruleCreateAve = 0,
			factorAve = 0,
			createRowsAve = 0,
			updateTableContentAve = 0,
			updateRowHeaderAve = 0,
			syncColumnHeadersAve = 0,
			overallSum = 0,
			onBeforeRenderingSum = 0,
			renderingSum = 0,
			onAfterRenderingSum = 0,
			ruleCreateSum = 0,
			factorSum = 0,
			createRowsSum = 0,
			updateTableContentSum = 0,
			updateRowHeaderSum = 0,
			syncColumnHeadersSum = 0,
			iRun = this.aRenderResults.length;

			var sCSV = "Run;VisibleRowCount;VisibleRowCountMode;Overall;Before Rendering;Rendering;After Rendering;Table Create;Factor of After Rendering in Rendering;Table._createRows;Table._updateTableContent;Table._syncColumnHeaders;Table._updateRowHeader\n";

			for (var i = 0; i < iRun; i++) {
				sCSV += (i+1) + ";"
						+ this.aRenderResults[i].overall + ";"
						+ this.aRenderResults[i].onBeforeRendering + ";"
						+ this.aRenderResults[i].rendering + ";"
						+ this.aRenderResults[i].onAfterRendering + ";"
						+ this.aRenderResults[i].ruleCreate + ";"
						+ this.aRenderResults[i].factor + ";"
						+ this.aFunctionResults[i].createRows + ";"
						+ this.aFunctionResults[i].updateTableContent + ";"
						+ this.aFunctionResults[i].updateRowHeader + ";"
						+ this.aFunctionResults[i].syncColumnHeaders + "\n";

				overallSum += this.aRenderResults[i].overall;
				onBeforeRenderingSum += this.aRenderResults[i].onBeforeRendering;
				renderingSum += this.aRenderResults[i].rendering;
				onAfterRenderingSum += this.aRenderResults[i].onAfterRendering;
				ruleCreateSum += this.aRenderResults[i].ruleCreate;
				factorSum += this.aRenderResults[i].factor;
				createRowsSum += this.aFunctionResults[i].createRows;
				updateTableContentSum += this.aFunctionResults[i].updateTableContent;
				updateRowHeaderSum += this.aFunctionResults[i].updateRowHeader;
				syncColumnHeadersSum += this.aFunctionResults[i].syncColumnHeaders;
			}

			overallAve += Math.round(overallSum / iRun * 1) / 1;
			onBeforeRenderingAve += Math.round(onBeforeRenderingSum / iRun * 100) / 100;
			renderingAve += Math.round(renderingSum / iRun * 1) / 1;
			onAfterRenderingAve += Math.round(onAfterRenderingSum / iRun * 1) / 1;
			ruleCreateAve += Math.round(ruleCreateSum / iRun * 1) / 1;
			factorAve += Math.round(factorSum / iRun * 1) / 1;
			createRowsAve += Math.round(createRowsSum / iRun * 1) / 1;
			updateTableContentAve += Math.round(updateTableContentSum / iRun * 1) / 1;
			updateRowHeaderAve += Math.round(updateRowHeaderSum / iRun * 1) / 1;
			syncColumnHeadersAve += Math.round(syncColumnHeadersSum / iRun * 1) / 1;

			sCSV += "average (ms)" + ";" +
					"-" + ";" +
					"-" + ";" +
					overallAve + ";" +
					onBeforeRenderingAve + ";" +
					renderingAve + ";" +
					onAfterRenderingAve + ";" +
					ruleCreateAve + ";" +
					factorAve + ";" +
					createRowsAve + ";" +
					updateTableContentAve + ";" +
					updateRowHeaderAve + ";" +
					syncColumnHeadersAve + "\n";

			var sFileName = "TableODataPerformanceTestResults.csv";
			var oBlob = new Blob([sCSV], { type: 'application/csv;charset=utf-8' });

			if (navigator.appVersion.toString().indexOf('.NET') > 0){
				window.navigator.msSaveBlob(oBlob, sFileName);
			} else {
				var oLink = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
				oLink.href = URL.createObjectURL(oBlob);
				oLink.download = sFileName;
				oLink.click();
			}
		}
	});
});