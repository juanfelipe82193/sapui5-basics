/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */

sap.ui.define([
	'jquery.sap.global',
	'sap/rules/ui/RuleBuilder',
	'sap/rules/ui/DecisionTable',
	'sap/rules/ui/services/ExpressionLanguage'
], function (jQuery, RuleBuilder, DecisionTable, ExpressionLanguage) {

	"use strict";

	var Utils = {};

	var sRuleServiceURL = "/rules-service/rule_srv/";
	var sVocaServiceURL = "/rules-service/vocabulary_srv/";

	/**
	 * Sets the service URLs
	 * @param {string} sRuleService - the rule service URL
	 * @param {string} sVocaService - the vocabulary service URL
	 */
	Utils.setServiceURLs = function (sRuleService, sVocaService) {
		sRuleServiceURL = sRuleService;
		sVocaServiceURL = sVocaService;
	};

	/**
	 * Gets the value of URL parameter
	 * @param {string} paramName - name of a parameter to get from the URL. If empty, then all the parameters are returned
	 * @returns {string | Array} - parameter value or values
	 */
	Utils.getURLParams = function (paramName) {
		var params = {},
			URL = jQuery(window.location).attr("href"),
			paramsIndex = URL.indexOf("?"),
			hashIndex = URL.indexOf("#");

		if (paramsIndex > -1) {
			var paramsString = URL.slice(paramsIndex + 1, hashIndex);
			var paramsArray = paramsString.split("&");

			for (var i = 0, len = paramsArray.length; i < len; ++i) {
				var param = paramsArray[i].split("=");
				if (param.length > 1) {
					params[param[0]] = param[1];
				}
			}
		}

		return paramName ? params[paramName] : params;
	};

	/**
	 * Start Request Recorder
	 * @param {object} params - configuration-parameters object
	 * @param {string} params.filePath - path to mockData file
	 * @param {string} params.fileName - name of mockData file
	 * @param {string} params.mode - "play" or "record" mode. deafult is play
	 */
	Utils.startRequestRecorder = function (params) {
		// var entriesUrlFilter = [new RegExp("\.js"), new RegExp("\.json"), new RegExp("\.less"), new RegExp("\.properties")];
		var entriesUrlFilter = [
			new RegExp("\/rules-service\/rule_srv\/"),
			new RegExp("\/rules-service\/vocabulary_srv\/")

			/*new RegExp("\/sap\/opu\/odata\/SAP\/VOCABULARY_SRV\/"),
				new RegExp("\/sap\/opu\/odata\/SAP\/RULE_SRV\/"),
				new RegExp("\/sap\/opu\/odata\/SAP\/ZFDT_VOCABULARY\/"),
				new RegExp("\/sap\/opu\/odata\/SAP\/ZFDT_RULE\/"),
				new RegExp("\/sap\/opu\/odata\/SAP\/FDT_TEST_FLIGHT_CDS_CDS\/"),
 				new RegExp("\/sap\/opu\/odata\/sap\/FDT_TEST_FLIGHT_CDS_CDS\/")*/
		];

		var path = params.filePath + params.fileName + ".har";
		if (params.mode === "record") {
			window.RequestRecorder.record(params.fileName, {
				entriesUrlFilter: entriesUrlFilter
			});
		} else if (params.mode === "play") {
			window.RequestRecorder.play(path, {
				entriesUrlFilter: entriesUrlFilter
			});
		} else {
			window.RequestRecorder.start(path, {
				entriesUrlFilter: entriesUrlFilter
			});
		}
	};

	/**
	 * Stop Request Recorder
	 */
	Utils.stopRequestRecorder = function () {
		window.RequestRecorder.stop();
	};

	/**
	 * Create Rule ODataModel
	 * @return {object} oModel
	 */
	Utils.createRuleOdataModel = function () {
		var oModel = new sap.ui.model.odata.v2.ODataModel({
			serviceUrl: sRuleServiceURL,
			defaultBindingMode: sap.ui.model.BindingMode.TwoWay
		});
		return oModel;
	};

	/**
	 * Create Vocabulary ODataModel
	 * @return {object} oModel
	 */
	Utils.createVocabularyOdataModel = function () {
		var oModel = new sap.ui.model.odata.v2.ODataModel(sVocaServiceURL);
		return oModel;
	};

	/** 
	 * Manage QUint stop/start sequence to ensure all data fetched before proceed with tests.
	 * @param {object} dataSyncPromise - deferred object for ongoing data calls that should be synchronized
	 */
	Utils.qUnitWaitForData = function (dataSyncPromise) {

		QUnit.stop();

		jQuery.when(dataSyncPromise).done(function () {
			QUnit.start();
		});
	};

	/**
	 * Open Rule for edit (Draft created in the backend)
	 * @param {object} params - parameters object
	 * @param {object} params.model - oDataModel for data request.
	 * @param {string} params.ruleId - rule Id
	 * @param {string} params.version - rule version or null
	 * @return {object} deferredData - deferred data promise
	 */
	Utils.openRuleForEdit = function (params) {
		var deferredData = new jQuery.Deferred();

		params.model.callFunction("/EditRule", {
			method: "POST",
			urlParameters: {
				"RuleId": params.ruleId
			},
			success: function (data) {
				params.model.refresh(true);
				return deferredData.resolve(data);
			}
		});

		return deferredData.promise();
	};

	/**
	 * Cancel Rule's Draft
	 * @param {object} params - parameters object
	 * @param {object} params.model - oDataModel for data request.
	 * @param {string} params.ruleId - rule Id
	 * @param {string} params.version - rule version or null
	 * @return {object} deferredData - deferred data promise
	 */
	Utils.cancelRuleDraft = function (params) {
		var deferredData = new jQuery.Deferred();

		params.model.callFunction("/DeleteRuleDraft", {
			method: "POST",
			urlParameters: {
				"RuleId": params.ruleId
			},
			success: function (data) {
				params.model.resetChanges();
				params.model.refresh(true);
				return deferredData.resolve(data);
			}
		});

		return deferredData.promise();
	};

	/**
	 * Load rule's data into ODataModel
	 * @param {object} params - parameters object
	 * @param {object} params.model - oDataModel for data request.
	 * @param {string} params.ruleId - rule Id
	 * @param {string} params.version - rule version or null
	 * @return {object} deferredData - deferred data promise
	 */
	Utils.readRuleData = function (params) {

		var deferredData = new jQuery.Deferred();

		params.model.metadataLoaded().then(function (oMetadata) {
			var oModel = params.model,
				sRulePath = "/" + oModel.createKey("Rules", {
					Id: params.ruleId,
					Version: params.version || "000001"
				});
			params.model.read(sRulePath + "DecisionTable/DecisionTableColumns/Condition", {
				success: function (data) {
					deferredData.resolve(data);
				}
			});
			params.model.read(sRulePath + "DecisionTable/DecisionTableColumns/Result", {
				success: function (data) {
					deferredData.resolve(data);
				}
			});
			params.model.read(sRulePath + "DecisionTable/DecisionTableRows/Cells", {
				success: function (data) {
					deferredData.resolve(data);
				}
			});
			/*params.model.read(sRulePath, {
				urlParameters: {
					"$expand": "DecisionTable/DecisionTableColumns/Condition," +
						"DecisionTable/DecisionTableColumns/Result," +
						"DecisionTable/DecisionTableRows/Cells"
				},
				success: function(data) {
					deferredData.resolve(data);
				}
			});*/
		});

		return deferredData.promise();
	};

	/**
	 * Create Ast Expression Language control with data loaded.
	 * Data will be set in asyncronius way.
	 * @param {object} params - configuration-parameters object
	 * @param {string} params.vocaId - optional; vocabulary Id. If not supplied, data will
	 * @param {object} params.model - optional; ODataModel to load data
	 * @return {object} creatures
	 * @return {object} creatures.expressionLanguage - Expression Language loaded with data
	 * @return {object} creatures.deferredVocaData - deferred data promise
	 */
	Utils.createAstExpressionLanguageWithData = function (params) {

		var oExpressionLanguage = new sap.rules.ui.services.AstExpressionLanguage();

		if (!params.vocaId) {
			return {
				expressionLanguage: oExpressionLanguage,
				deferredVocaData: new jQuery.Deferred().resolve({}).promise()
			};
		}

		var vocabularyModel = params.model || Utils.createVocabularyOdataModel();
		oExpressionLanguage.setBindingContextPath("/Vocabularies('" + params.vocaId + "')");
		oExpressionLanguage.setModel(vocabularyModel);

		var deferredVocaData = new jQuery.Deferred();

		oExpressionLanguage.attachDataChange(function () {
			deferredVocaData.resolve();
		});

		return {
			expressionLanguage: oExpressionLanguage,
			deferredVocaData: deferredVocaData
		};
	};

	/**
	 * Ui Controls factory
	 * @param {string} uiControlType - type of UI control: RuleBuilder, DecisionTable, etc.
	 * @param {object} controlConfig - configuration object for uiControl
	 * @return {object} uiControl
	 */
	Utils.createUIControlByType = function (uiControlType, controlConfig) {

		var uiControl = null;
		var dataSyncPromise = null;
		var configuration = controlConfig || {};

		switch (uiControlType) {

		case "DecisionTable":
			uiControl = new sap.rules.ui.DecisionTable(configuration);
			dataSyncPromise = uiControl._getDataLoadedPromise();
			break;

		default:
			uiControl = new sap.rules.ui.RuleBuilder(configuration);
			var deferred = new jQuery.Deferred();
			dataSyncPromise = deferred.promise();
			uiControl.addEventDelegate({
				onAfterRendering: function (oEvent) {
					var dtPromise = oEvent.srcControl.getAggregation("_rule")._getDataLoadedPromise();
					jQuery.when(dtPromise).done(function (oData) {
						deferred.resolve(oData);
					});
				}
			});
		}

		return {
			uiControl: uiControl,
			dataSyncPromise: dataSyncPromise
		};
	};

	/**
	 * Create UI control with ODataModel.
	 * Data will be loaded in asyncronius way.
	 * @param {object} params - configuration-parameters object
	 * @param {string} params.uiControlType - type of UI control: RuleBuilder, DecisionTable, etc.
	 * @param {string} params.controlConfig - optional; confuguration object for uiControl
	 * @param {object} params.model - optional; ODataModel to load data
	 * @param {string} params.ruleId - optional; If supplied, rule's data will be loaded into ODataModel, 
	 *								otherwise rule's data will be loaded later, after UI control will be rendered.
	 * @return {object} creatures
	 * @return {object} creatures.uiControl - UI Control with ODataModel
	 * @return {object} creatures.deferredRuleData - deferred data promise
	 */
	Utils.createUIControlWithModel = function (params) {

		// create uiControl
		var oSynchedControl = Utils.createUIControlByType(params.uiControlType, params.controlConfig);

		// create rules' model
		var oModel = params.model || Utils.createRuleOdataModel();
		oSynchedControl.uiControl.setModel(oModel);

		return oSynchedControl;
	};

	/**
	 * Create Expression Language control with data loaded.
	 * Data will be set in asyncronius way.
	 * @param {object} params - configuration-parameters object
	 * @param {string} params.vocaId - optional; vocabulary Id. If not supplied, data will
	 * @param {object} params.model - optional; ODataModel to load data
	 * @return {object} creatures
	 * @return {object} creatures.expressionLanguage - Expression Language loaded with data
	 * @return {object} creatures.deferredVocaData - deferred data promise
	 */
	Utils.createExpressionLanguageWithData = function (params) {

		var oExpressionLanguage = new sap.rules.ui.services.ExpressionLanguage();

		if (!params.vocaId) {
			return {
				expressionLanguage: oExpressionLanguage,
				deferredVocaData: new jQuery.Deferred().resolve({}).promise()
			};
		}

		var vocabularyModel = params.model || Utils.createVocabularyOdataModel();
		oExpressionLanguage.setBindingContextPath("/Vocabularies('" + params.vocaId + "')");
		oExpressionLanguage.setModel(vocabularyModel);

		var deferredVocaData = new jQuery.Deferred();

		oExpressionLanguage.attachDataChange(function () {
			deferredVocaData.resolve();
		});

		return {
			expressionLanguage: oExpressionLanguage,
			deferredVocaData: deferredVocaData
		};
	};

	/**
	 * Create UI controls for Rules with Expression Language instance filled with data.
	 * 
	 * @param {object} params - configuration-parameters object
	 * @param {string} params.uiControlType - type of UI control: RuleBuilder, DecisionTable, etc.
	 * @param {string} params.controlConfig - optional; confuguration object for uiControl
	 * @param {array} params.ruleIds - rules' Id
	 * @param {string} params.vocaId - vocabulary Id
	 * @param {boolean} params.loadRuleData - whether to load rule's data into ODataModel. 
	 *		If the value is false, data for the rules will be loaded later, after UI control will be rendered.
	 * 
	 * @return {object} creatures
	 * @return {array} creatures.uiControls - array of created uiControls 
	 * @return {object} creatures.dataSyncPromise - deferred data promise for all deferred data calls
	 */
	Utils.createRuleControlPack = function (params) {

		var uiControls = [];
		var deferredDataCalls = [];

		// create EL and load its data
		var oExpressionLanguage = Utils.createExpressionLanguageWithData({
			vocaId: params.vocaId
		});
		//deferredDataCalls.push(oExpressionLanguage.deferredVocaData);

		// create rules' model
		var oModel = Utils.createRuleOdataModel();

		// clone uiControl params
		var parameters = jQuery.extend({}, params);
		parameters.model = oModel;

		// create uiControls for each ruleId
		params.ruleIds.forEach(function (sRuleId, index) {

			if (params.loadRuleData) {
				parameters.ruleId = sRuleId;
				parameters.version = params.ruleVersions[index] || "000001";
			}

			var oSynchedControl = Utils.createUIControlWithModel(parameters);
			var control = oSynchedControl.uiControl;
			control.setExpressionLanguage(oExpressionLanguage.expressionLanguage);

			var sVersion = params.ruleVersions[index] || "000001";
			var sRulePath = "/Rules(Id='" + sRuleId + "',Version='" + sVersion + "')";
			control.setBindingContextPath(sRulePath);

			uiControls.push(control);
			deferredDataCalls.push(oSynchedControl.dataSyncPromise);
		});

		var dataSyncPromise = jQuery.when.apply(jQuery, deferredDataCalls).then();

		return {
			uiControls: uiControls,
			dataSyncPromise: dataSyncPromise
		};
	};

	return Utils;
}, /* bExport= */ true);