/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2017 SAP SE. All rights reserved
 */
/* global sap, jQuery, QUnit, sinon */

sap.ui.define([
		'sap/apf/demokit/mockserver',
		'sap/apf/demokit/configuration/demokit',
		'sap/apf/demokit/configuration/demokitHierarchy',
		'sap/apf/demokit/configuration/demokitSFB'
	],
function (MockServer, StandardConfiguration, SFBConfiguration, HierarchyConfiguration) {
	'use strict';

	var _mockServer = MockServer("../../../../resources/sap/apf/demokit/");

	_mockServer.constants.LOCAL_STORAGE_CONFIGURATION = "TEST_APF_CONFIG###";
	_mockServer.constants.LOCAL_STORAGE_TEXTS = "TEST_APF_TEXTS###";
	var TEST_NAME = "--test--";
	var TEST_ID = "abcdef1789";
	var STANDARD_CONFIG_ID = "57FCA36EC3D350DEE10000000A442AF4";
	function getConfigurationByName(result, name){
		var match;
		result.forEach(function(row){
			if( row.AnalyticalConfigurationName.indexOf(name) === 0){
				match = row;
			}
		});
		return match;
	}
	function isContainedInResponse(result, name){
		return getConfigurationByName(result.d.results, name) !== undefined;
	}
	function createSerializedConfiguration(id){
		return JSON.stringify(createConfiguration(id));
	}
	function createConfiguration(id){
		var configuration = {
			configHeader: {
				AnalyticalConfiguration: id ? id : "",
				AnalyticalConfigurationName: TEST_NAME
			}
		};
		return configuration;
	}
	function createConfigurationRow(){
		return {
			AnalyticalConfiguration: TEST_ID,
			Application: STANDARD_CONFIG_ID, //standard
			AnalyticalConfigurationName: TEST_NAME,
			SerializedAnalyticalConfiguration: createSerializedConfiguration(),
			CreationUTCDateTime: "test",
			LastChangeUTCDateTime: "test",
			CreatedByUser: "test",
			LastChangedByUser: "test"
		};
	}
	function getConfigurationInServerByID(id, mockServer) {
		var result;
		var entitySet = mockServer.getEntitySetData(_mockServer.constants.CONFIGURATION_ENTITYSET);
		entitySet.forEach(function(configuration){
			if( configuration.AnalyticalConfiguration === id){
				result = configuration;
			}
		});
		return result;
	}

	QUnit.module("sap.apf.demokit mockserver", {
		beforeEach: function(assert){
			localStorage.clear();
			sessionStorage.clear();
		},
		afterEach: function(){
			_mockServer.teardownMockserver();
		}
	});
	QUnit.test("Given 0 content in session storage, When getAllConfigurationIdsInStorage", function(assert) {
		assert.strictEqual(_mockServer.getAllConfigurationIdsInStorage().length, 0, "is empty list");
	});
	QUnit.test("getConfigurationId on session key", function(assert) {
		var id = STANDARD_CONFIG_ID;
		var sessionKey = "state.key_-" + _mockServer.constants.LOCAL_STORAGE_CONFIGURATION + id;
		assert.strictEqual(_mockServer.getConfigurationId(sessionKey), id, "id extracted");
	});
	QUnit.test("Given * content in session storage, When getAllConfigurationIdsInStorage", function(assert) {
		function createConfigInStorage(configId1) {
			var config1 = {configHeader: {AnalyticalConfiguration : configId1}, test: true};
			var localStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
			localStorage.put(_mockServer.constants.LOCAL_STORAGE_CONFIGURATION + configId1, config1);
		}
		createConfigInStorage(42);
		createConfigInStorage(77);

		assert.strictEqual(_mockServer.getAllConfigurationIdsInStorage().length, 2, "result non empty");
	});
	QUnit.test("Given * content in session storage, When getConfigurationFromLocalStorage", function(assert) {
		function createConfigInStorage(configId1) {
			var config1 = {configHeader: {AnalyticalConfiguration : configId1}, test: "matched"};
			var localStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
			localStorage.put(_mockServer.constants.LOCAL_STORAGE_CONFIGURATION + configId1, config1);
		}
		createConfigInStorage(42);
		createConfigInStorage(77);
		assert.strictEqual(_mockServer.getConfigurationFromLocalStorage(42).test, "matched", "then an id matches");
	});

	QUnit.test("Given * content in session storage, When idIsContained()", function(assert){
		var configList = [
			{AnalyticalConfiguration : 1},
			{AnalyticalConfiguration : 2},
			{AnalyticalConfiguration : 3}
		];
		var _idIsContained = _mockServer.idIsContained;
		assert.strictEqual(_idIsContained(configList, 1), true, "then id 1 is found");
		assert.strictEqual(_idIsContained(configList, 3), true, "id 3 is found");
		assert.strictEqual(_idIsContained(configList, 42), false, "id 42 is NOT found");
	});

	/* ----------------- */
	QUnit.module("mockConfigurationService parameterized with empty configuration list", {
		beforeEach: function(assert){
			var localStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
			localStorage.clear();
			sessionStorage.clear();
			this.mockServer = _mockServer.mockConfigurationService([]);
		},
		afterEach: function(){
			localStorage.clear();
			sessionStorage.clear();
			_mockServer.teardownMockserver();
		}
	});
	QUnit.test("Given 0 configurations, When sending GET entitySet", function(assert){
		// catches a former error in _replaceSerializedConfiguration: must not replace by null when corresponding file is not loaded.
		var doneLoad = assert.async();

		var select1 = "?$select=AnalyticalConfiguration,AnalyticalConfigurationName,Application,SerializedAnalyticalConfiguration";
		var query1 = "&$filter=(Application eq '57FCA36EC3D350DEE10000000A442AF5')";
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.CONFIGURATION_SERVICE +
			"AnalyticalConfigurationQueryResults" + select1 + query1,
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			assert.equal(result.d.results.length, 0, "all configurations returned");
			doneLoad();
		}
	});

	QUnit.test("Given * configurations and 0 content in session storage, when _initialLoadConfigurationsToMockServer", function(assert){
		// load configurations, no session content
		_mockServer._initialLoadConfigurationsToMockServer(this.mockServer, [StandardConfiguration, SFBConfiguration, HierarchyConfiguration]);
		var entitySet = this.mockServer.getEntitySetData(_mockServer.constants.CONFIGURATION_ENTITYSET);

		assert.strictEqual(entitySet.length, 3, "then all configurations loaded to MockServer");
		assert.strictEqual(_mockServer.getAllConfigurationIdsInStorage().length, 3, "and all have been loaded to session storage");

		var row1 = getConfigurationInServerByID(StandardConfiguration.configHeader.AnalyticalConfiguration, this.mockServer);
		var row2 = getConfigurationInServerByID(HierarchyConfiguration.configHeader.AnalyticalConfiguration, this.mockServer);
		var row3 = getConfigurationInServerByID(SFBConfiguration.configHeader.AnalyticalConfiguration, this.mockServer);
		assert.strictEqual( row1.SerializedAnalyticalConfiguration, JSON.stringify(StandardConfiguration), "StandardConfiguration: serial payload is unchanged");
		assert.strictEqual( row2.SerializedAnalyticalConfiguration, JSON.stringify(HierarchyConfiguration), "HierarchyModel: serial payload is unchanged");
		assert.strictEqual( row3.SerializedAnalyticalConfiguration, JSON.stringify(SFBConfiguration), "2SFBModel: serial payload is unchanged");

		var serial1 = _mockServer.getConfigurationFromLocalStorage(StandardConfiguration.configHeader.AnalyticalConfiguration);
		var serial2 = _mockServer.getConfigurationFromLocalStorage(HierarchyConfiguration.configHeader.AnalyticalConfiguration);
		var serial3 = _mockServer.getConfigurationFromLocalStorage(SFBConfiguration.configHeader.AnalyticalConfiguration);
		assert.strictEqual( serial1, JSON.stringify(StandardConfiguration), "StandardConfiguration: serial payload is unchanged");
		assert.strictEqual( serial2, JSON.stringify(HierarchyConfiguration), "HierarchyModel: serial payload is unchanged");
		assert.strictEqual( serial3, JSON.stringify(SFBConfiguration), "2SFBModel: serial payload is unchanged");
	});
	QUnit.test("Given * configs and 1 content in sessionStorage, when calling _initialLoadConfigurationsToMockServer", function(assert){
		// load 3 configurations, one configuration in sessionStorage which gets into the entitySet in mockServer
		var raw = createSerializedConfiguration(TEST_ID); // payload must contain ID!
		var localStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
		localStorage.put(_mockServer.constants.LOCAL_STORAGE_CONFIGURATION + TEST_ID, raw);

		_mockServer._initialLoadConfigurationsToMockServer(this.mockServer, [StandardConfiguration, SFBConfiguration, HierarchyConfiguration]);
		var entitySet = this.mockServer.getEntitySetData(_mockServer.constants.CONFIGURATION_ENTITYSET);
		assert.strictEqual(entitySet.length, 4, "one configuration added");
		var row = getConfigurationByName(entitySet, TEST_NAME);
		assert.ok(row !== undefined, "row has been created and matches by configuration name");
		var oConfiguration = JSON.parse(row.SerializedAnalyticalConfiguration);
		assert.strictEqual(row.AnalyticalConfiguration, oConfiguration.configHeader.AnalyticalConfiguration, "row has been created with ID in the serialized configuration");
		assert.strictEqual(row.AnalyticalConfiguration, TEST_ID, "ID of sessionStorage key");
	});
	QUnit.test("Given * configs and * content in sessionStorage, When calling _initialLoadConfigurationsToMockServer", function(assert){
		// load 3 configurations, one configuration in sessionStorage which gets into the entitySet in mockServer
		var localStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
		localStorage.put(_mockServer.constants.LOCAL_STORAGE_CONFIGURATION + TEST_ID, createSerializedConfiguration(TEST_ID));
		localStorage.put(_mockServer.constants.LOCAL_STORAGE_CONFIGURATION + "42", createSerializedConfiguration("42"));

		_mockServer._initialLoadConfigurationsToMockServer(this.mockServer, [StandardConfiguration, SFBConfiguration, HierarchyConfiguration]);
		var entitySet = this.mockServer.getEntitySetData(_mockServer.constants.CONFIGURATION_ENTITYSET);
		assert.strictEqual(entitySet.length, 5, " * configuration added");
	});
	QUnit.test("Given * configurations and 1 content in sessionStorage overriding a config, when calling _initialLoadConfigurationsToMockServer", function(assert) {
		// test that a configuration in sessionStorage overrides the one in the entitySet in mockServer, by same ID
		var serialized = createSerializedConfiguration(STANDARD_CONFIG_ID);
		var localStorage = jQuery.sap.storage(jQuery.sap.storage.Type.session);
		localStorage.put(_mockServer.constants.LOCAL_STORAGE_CONFIGURATION + STANDARD_CONFIG_ID, serialized);

		_mockServer._initialLoadConfigurationsToMockServer(this.mockServer, [StandardConfiguration, SFBConfiguration, HierarchyConfiguration]);
		var entitySet = this.mockServer.getEntitySetData(_mockServer.constants.CONFIGURATION_ENTITYSET);
		assert.strictEqual(entitySet.length, 3, "no additional configuration");
		var row = getConfigurationByName(entitySet, TEST_NAME);
		assert.notStrictEqual(row, undefined, "row has been overwritten");
		var oConfiguration = JSON.parse(row.SerializedAnalyticalConfiguration);
		assert.strictEqual(row.AnalyticalConfiguration, oConfiguration.configHeader.AnalyticalConfiguration, "row has been created with ID from the serialized configuration");
		assert.strictEqual(oConfiguration.steps, undefined, "payload correctly overridden: no steps");
	});
	QUnit.test("Given 1 configuration and 0 session storage, When calling _initialLoadConfigurationsToMockServer", function(assert) {
		// test writing a configuration to session storage
		var oConfiguration = createConfiguration(TEST_ID);
		var prevLength = this.mockServer.getEntitySetData(_mockServer.constants.CONFIGURATION_ENTITYSET).length;
		var raw = _mockServer.getConfigurationFromLocalStorage(TEST_ID);
		var preLoad = [oConfiguration];
		assert.strictEqual( raw, null, "Before: is not yet contained in session storage");
		_mockServer._initialLoadConfigurationsToMockServer(this.mockServer, preLoad);
		var entitySet = this.mockServer.getEntitySetData(_mockServer.constants.CONFIGURATION_ENTITYSET);
		assert.strictEqual(entitySet.length, prevLength + 1, "After: entitySet 1 row added");
		raw = _mockServer.getConfigurationFromLocalStorage(TEST_ID);
		assert.notStrictEqual( raw, null, "and loaded configuration (payload) is contained in session storage");
	});
	QUnit.test("Given 1 configuration and one with the same ID in session storage, When calling _initialLoadConfigurationsToMockServer", function(assert) {
		// ... but only when not yet existing is session storage
		var serialized = JSON.stringify(StandardConfiguration);
		var localStorage = _mockServer._getStorage();
		localStorage.put(_mockServer.constants.LOCAL_STORAGE_CONFIGURATION + STANDARD_CONFIG_ID, serialized);

		var stubConfiguration = createConfiguration(STANDARD_CONFIG_ID); // incomplete stub, no steps!
		this.mockServer.setEntitySetData(_mockServer.constants.CONFIGURATION_ENTITYSET, [stubConfiguration]);

		var entitySet = this.mockServer.getEntitySetData(_mockServer.constants.CONFIGURATION_ENTITYSET);
		assert.strictEqual(entitySet.length, 1, "Before: 1 row");
		var raw = _mockServer.getConfigurationFromLocalStorage(STANDARD_CONFIG_ID);
		var preLoad = [stubConfiguration];

		_mockServer._initialLoadConfigurationsToMockServer(this.mockServer, preLoad);
		//THEN
		entitySet = this.mockServer.getEntitySetData(_mockServer.constants.CONFIGURATION_ENTITYSET);
		assert.strictEqual(entitySet.length, 1, "After: no row added");
		var config = getConfigurationInServerByID(STANDARD_CONFIG_ID, this.mockServer);
		var payload = JSON.parse(config.SerializedAnalyticalConfiguration);
		assert.ok(payload.steps.length > 2, "then the stub has been overwritten by the content in session storage ");

		raw = _mockServer.getConfigurationFromLocalStorage(STANDARD_CONFIG_ID);
		assert.notStrictEqual( raw, null, "and original still contained in session storage");
		assert.strictEqual(payload.steps.length, JSON.parse(raw).steps.length, "and both are equal");
	});

	QUnit.module("mockConfigurationService", {
		beforeEach: function(assert){
			this.spy_saveText = sinon.spy(_mockServer, "saveText");
			this.spy_loadTexts = sinon.spy(_mockServer, "loadTexts");
			this.spy_saveAnalyticalConfiguration = sinon.spy(_mockServer, "saveAnalyticalConfiguration");
			var localStorage = _mockServer._getStorage();
			localStorage.clear();
			sessionStorage.clear();
			this.mockServer = _mockServer.mockConfigurationService([StandardConfiguration, SFBConfiguration, HierarchyConfiguration]);
		},
		afterEach: function(){
			localStorage.clear();
			sessionStorage.clear();
			_mockServer.teardownMockserver();
			this.spy_saveText.restore();
			this.spy_loadTexts.restore();
			this.spy_saveAnalyticalConfiguration.restore();
		}
	});
	QUnit.test("when sending GET entitySet", function(assert){
		var doneLoad = assert.async();

		var select1 = "?$select=AnalyticalConfiguration,AnalyticalConfigurationName,Application,CreatedByUser,CreationUTCDateTime,LastChangeUTCDateTime,LastChangedByUser";
		var query1 = "&$filter=(Application eq '57FCA36EC3D350DEE10000000A442AF5')";
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.CONFIGURATION_SERVICE +
			"AnalyticalConfigurationQueryResults" + select1 + query1,
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			assert.equal(result.d.results.length, 3, "Three configurations returned");
			assert.equal(isContainedInResponse(result, "APF Standard Demo"), true, "Normal demokit configuration returned");
			assert.equal(isContainedInResponse(result, "APF Hierarchy Demo"), true, "Hierarchy demokit configuration returned");
			assert.equal(isContainedInResponse(result, "APF Smart Filter Bar Demo"), true, "Smart Filter Bar demokit configuration returned");

			doneLoad();
		}
	});
	QUnit.test("When requesting the 1st config with $select SerializedAnalyticalConfiguration", function(assert){
		var doneLoad = assert.async();
		var path = "AnalyticalConfigurationQueryResults('57FCA36EC3D350DEE10000000A442AF4')";
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.CONFIGURATION_SERVICE + path,
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			assert.strictEqual(result.d.AnalyticalConfiguration, '57FCA36EC3D350DEE10000000A442AF4', "is selected configuration");
			var oConfig = JSON.parse( result.d.SerializedAnalyticalConfiguration);
			assert.ok(oConfig.steps.length > 1, "Standard - qualifies the complete configuration");

			doneLoad();
		}
	});
	QUnit.test("When requesting the 2nd config with $select SerializedAnalyticalConfiguration", function(assert){
		var doneLoad = assert.async();

		var path = "AnalyticalConfigurationQueryResults('57FCA36EC3D350DEE10000000A442AF6')";
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.CONFIGURATION_SERVICE + path,
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			assert.strictEqual(result.d.AnalyticalConfiguration, '57FCA36EC3D350DEE10000000A442AF6', "is selected configuration");
			var oConfig = JSON.parse( result.d.SerializedAnalyticalConfiguration);
			assert.ok(oConfig.steps.length > 1, "Standard - qualifies the complete configuration");

			doneLoad();
		}
	});

	QUnit.test("When requesting the 3rd config with $select SerializedAnalyticalConfiguration", function(assert){
		var doneLoad = assert.async();
		var path = "AnalyticalConfigurationQueryResults('57FCA36EC3D350DEE10000000A442AF7')";
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.CONFIGURATION_SERVICE + path,
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			assert.strictEqual(result.d.AnalyticalConfiguration, '57FCA36EC3D350DEE10000000A442AF7', "is selected configuration");
			var oConfig = JSON.parse( result.d.SerializedAnalyticalConfiguration);
			assert.ok(oConfig.steps.length > 1, "Standard - qualifies the complete configuration");

			doneLoad();
		}
	});
    QUnit.test("When exporting  1st analytical configuration", function(assert){
        var doneLoad = assert.async();
        var path = "AnalyticalConfigurationQueryResults('57FCA36EC3D350DEE10000000A442AF4')";
        var select = "?$select=CreationUTCDateTime,LastChangeUTCDateTime";
        jQuery.ajax({
            dataType: "json",
            url: _mockServer.constants.CONFIGURATION_SERVICE +
            path + select,
            success: assertResult,
            error: assertResult
        });
        function assertResult(result, message, object){
            assert.equal(object.status, 200, "Then HTTP status equals 200");
            assert.strictEqual(result.d.CreationUTCDateTime, '/Date(1478533989544)/', "Then CreationUTCDateTime of configuration is set for the export");
            assert.strictEqual(result.d.LastChangeUTCDateTime, '/Date(1478533989544)/', "Then LastChangeUTCDateTime of configuration is set for the export");
            doneLoad();
        }
    });
    QUnit.test("When exporting  2nd analytical configuration", function(assert){
        var doneLoad = assert.async();
        var path = "AnalyticalConfigurationQueryResults('57FCA36EC3D350DEE10000000A442AF6')";
        var select = "?$select=CreationUTCDateTime,LastChangeUTCDateTime";
        jQuery.ajax({
            dataType: "json",
            url: _mockServer.constants.CONFIGURATION_SERVICE +
            path + select,
            success: assertResult,
            error: assertResult
        });
        function assertResult(result, message, object){
            assert.equal(object.status, 200, "Then HTTP status equals 200");
            assert.strictEqual(result.d.CreationUTCDateTime, '/Date(1478533989544)/', "Then CreationUTCDateTime of configuration is set for the export");
            assert.strictEqual(result.d.LastChangeUTCDateTime, '/Date(1478533989544)/', "Then LastChangeUTCDateTime of configuration is set for the export");
            doneLoad();
        }
    });
    QUnit.test("When exporting  3rd analytical configuration", function(assert){
        var doneLoad = assert.async();
        var path = "AnalyticalConfigurationQueryResults('57FCA36EC3D350DEE10000000A442AF7')";
        var select = "?$select=CreationUTCDateTime,LastChangeUTCDateTime";
        jQuery.ajax({
            dataType: "json",
            url: _mockServer.constants.CONFIGURATION_SERVICE +
            path + select,
            success: assertResult,
            error: assertResult
        });
        function assertResult(result, message, object){
            assert.equal(object.status, 200, "Then HTTP status equals 200");
            assert.strictEqual(result.d.CreationUTCDateTime, '/Date(1478533989544)/', "Then CreationUTCDateTime of configuration is set for the export");
            assert.strictEqual(result.d.LastChangeUTCDateTime, '/Date(1478533989544)/', "Then LastChangeUTCDateTime of configuration is set for the export");
            doneLoad();
        }
    });
	QUnit.test("when POST configuration", function(assert) {
		var that = this;
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.CONFIGURATION_SERVICE + _mockServer.constants.CONFIGURATION_ENTITYSET,
			method: "POST",
			data: JSON.stringify(createConfigurationRow()),
			success: afterPost,
			error: afterPost
		});
		function afterPost(result, message, object) {
			assert.strictEqual( that.spy_saveAnalyticalConfiguration.callCount, 1, "exit called once");
			done();
		}
	});
	QUnit.test("when creating by POST configuration", function(assert) {
		var that = this;
		// required: row created, ID consistent, saved to local storage
		var done = assert.async();
		var raw = JSON.stringify(createConfigurationRow());
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.CONFIGURATION_SERVICE + _mockServer.constants.CONFIGURATION_ENTITYSET,
			method: "POST",
			data: raw,
			success: afterPost,
			error: afterPost
		});
		function afterPost(result, message, object) {
			var oConfiguration = JSON.parse(result.d.SerializedAnalyticalConfiguration);
			var entitySet = that.mockServer.getEntitySetData(_mockServer.constants.CONFIGURATION_ENTITYSET);
			var row = getConfigurationByName(entitySet, TEST_NAME);
			var id = result.d.AnalyticalConfiguration;
			var persisted = _mockServer.getConfigurationFromLocalStorage(id);

			assert.ok(id !== TEST_ID, "new id has been created");
			assert.strictEqual(result.d.AnalyticalConfiguration, oConfiguration.configHeader.AnalyticalConfiguration, "id has been set in payload === row id");
			assert.ok(row !== undefined, "a row in entitySet matches by configuration name");
			assert.ok( persisted !== undefined, "has been put to sessionStorage");
			done();
		}
	});
	QUnit.test("request metadata", function(assert){
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.CONFIGURATION_SERVICE + "$metadata",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result){
			assert.equal(result.status, 200, "HTTP status 200");
			assert.ok(result.responseText.search(_mockServer.constants.CONFIGURATION_ENTITYSET) > -1, "EntityType contained in metadata");
			done();
		}
	});
	QUnit.test("Application list", function(assert){
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.CONFIGURATION_SERVICE + "ApplicationQueryResults?$orderby=ApplicationName",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			assert.equal(result.d.results.length, 1, "One application returned");
			done();
		}
	});
	QUnit.test("Configuration list", function(assert){
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.CONFIGURATION_SERVICE + "AnalyticalConfigurationQueryResults?$select=AnalyticalConfiguration,AnalyticalConfigurationName,Application,CreatedByUser,CreationUTCDateTime,LastChangeUTCDateTime,LastChangedByUser&$filter=(Application%20eq%20%2757FCA36EC3D350DEE10000000A442AF5%27)",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			assert.equal(result.d.results.length, 3, "Three configurations returned");
			assert.equal(isContainedInResponse(result, "APF Standard Demo"), true, "Normal demokit configuration returned");
			assert.equal(isContainedInResponse(result, "APF Hierarchy Demo"), true, "Hierarchy demokit configuration returned");
			assert.equal(isContainedInResponse(result, "APF Smart Filter Bar Demo"), true, "Smart Filter Bar demokit configuration returned");
			done();
		}
	});
	QUnit.test("When save text by label creation/update in Modeler", function(assert) {
		// prove that saveText create a new textElement in local storage
		var textElementForSave =   {
				"TextElement": "TextElement 110",
				"Language": "",
				"TextElementType": "XTIT",
				"TextElementDescription": "Revenue by Country (with normal Service)",
				"Application": "57FCA36EC3D350DEE10000000A442AF5",
				"MaximumLength": 100,
				"TranslationHint": ""
		};
		var requestObject = {
				mParameters : {
					oEntity : {
						"TextElement": "TextElement 110",
						"Language": "",
						"TextElementType": "XTIT",
						"TextElementDescription": "Revenue by Country (with normal Service)",
						"Application": "57FCA36EC3D350DEE10000000A442AF5",
						"MaximumLength": 100,
						"TranslationHint": ""
					}
				}
		};
		var localStorage = _mockServer._getStorage();
		var stored = localStorage.get(_mockServer.constants.LOCAL_STORAGE_TEXTS);
		assert.strictEqual(stored, null, "Then this session storage entry is not existing at the beginning");
		_mockServer.saveText(requestObject);
		_mockServer.loadTexts(requestObject);
		var results = requestObject.mParameters.oFilteredData.results;
		assert.notStrictEqual(results, undefined, "Then local storage is filled");
		assert.strictEqual(results.length, 1, "Then local storage is filled with one element");
		assert.notStrictEqual(results[0].TextElement, undefined, "Then the element has a GUID");
		assert.notStrictEqual(results[0].TextElement, textElementForSave.TextElement, "Then the GUID is created");
	});
	QUnit.test("When save text by import of property file in Modeler", function(assert) {
		// prove that saveText create a new textElement in local storage
		var textElementForSave =   {
				"TextElement": "14822374366121819634218359677717",
				"Language": "",
				"TextElementType": "XTIT",
				"TextElementDescription": "Revenue by Country (with normal Service)",
				"Application": "57FCA36EC3D350DEE10000000A442AF5",
				"MaximumLength": 100,
				"TranslationHint": "",
				"LastChangeUTCDateTime": "/Date(1479315241000)/"
		};
		var requestObject = {
				mParameters : {
					oEntity : {
						"TextElement": "14822374366121819634218359677717",
						"Language": "",
						"TextElementType": "XTIT",
						"TextElementDescription": "Revenue by Country (with normal Service)",
						"Application": "57FCA36EC3D350DEE10000000A442AF5",
						"MaximumLength": 100,
						"TranslationHint": ""
					}
				}
		};
		var localStorage = _mockServer._getStorage();
		var stored = localStorage.get(_mockServer.constants.LOCAL_STORAGE_TEXTS);
		assert.strictEqual(stored, null, "Then this session storage entry is not existing at the beginning");
		_mockServer.saveText(requestObject);
		_mockServer.loadTexts(requestObject);
		var results = requestObject.mParameters.oFilteredData.results;
		assert.notStrictEqual(results, undefined, "Then local storage is filled");
		assert.strictEqual(results.length, 1, "Then local storage is filled with one element");
		assert.notStrictEqual(results[0].TextElement, undefined, "Then the element has a GUID");
		assert.strictEqual(results[0].TextElement, textElementForSave.TextElement, "Then the GUID is not recreated");
	});
	QUnit.test("given empty session storage when loadTexts", function(assert) {
		// prove that loadText sets an empty list
		var requestObject = {
			mParameters : {
			}
		};
		_mockServer.loadTexts(requestObject);
		assert.strictEqual(requestObject.mParameters.oFilteredData, undefined, "then returns nothing");
	});
	QUnit.test("given texts in session storage when loadTexts", function(assert) {
		// prove that loadText sets a list of texts
		var requestObject = {
			mParameters : {
			}
		};
		var content = ["hugo", "otto"];
		var localStorage = _mockServer._getStorage();
		localStorage.put(_mockServer.constants.LOCAL_STORAGE_TEXTS, JSON.stringify(content));
		_mockServer.loadTexts(requestObject);
		var results = requestObject.mParameters.oFilteredData.results;
		assert.strictEqual(results.length, 2, "then returns 2 elements");
	});
	QUnit.test("GET texts, POST Text, GET Text", function(assert){
		var that = this;
		var done = assert.async();
		var textElement =   {
				"TextElement": "14822374366121819634218359677717",
				"Language": "",
				"TextElementType": "XTIT",
				"TextElementDescription": "Revenue by Country (with normal Service)",
				"Application": "57FCA36EC3D350DEE10000000A442AF5",
				"MaximumLength": 100,
				"TranslationHint": "",
				"LastChangeUTCDateTime": "/Date(1479315241000)/"
			};
		var entitySet = [textElement];
		this.mockServer.setEntitySetData("TextElementQueryResults", entitySet);
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.CONFIGURATION_SERVICE +  "TextElementQueryResults?$filter=((Language%20eq%20%27%27)%20and%20(Application%20eq%20%2757FCA36EC3D350DEE10000000A442AF5%27))",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			assert.equal(result.d.results.length, entitySet.length, "texts returned");
			jQuery.ajax({
				dataType: "json",
				url: _mockServer.constants.CONFIGURATION_SERVICE +  "TextElementQueryResults",
				method: "POST",
				data: '{"TextElement":"","Language":"","TextElementType":"XTIT","TextElementDescription":"AddedText","MaximumLength":60,"Application":"57FCA36EC3D350DEE10000000A442AF5","TranslationHint":""}',
				success: assertAddingText,
				error: assertAddingText
			});
			function assertAddingText(result, message, object){
				assert.strictEqual( that.spy_saveText.callCount, 1, "exit called once");
				assert.equal(object.status, 201, "HTTP status 201 for adding text");
				jQuery.ajax({
					dataType: "json",
					url: _mockServer.constants.CONFIGURATION_SERVICE +  "TextElementQueryResults?$filter=((Language%20eq%20%27%27)%20and%20(Application%20eq%20%2757FCA36EC3D350DEE10000000A442AF5%27))",
					success: assertAddedText,
					error: assertAddedText
				});
				function assertAddedText (result, message, object){
					assert.equal(object.status, 200, "HTTP status 200");
					assert.equal(result.d.results.length, entitySet.length + 1, "texts returned");
					done();
				}
			}
		}
	});
	QUnit.test("GET Hierarchy configuration", function(assert){
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.CONFIGURATION_SERVICE + "AnalyticalConfigurationQueryResults('57FCA36EC3D350DEE10000000A442AF6')",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			assert.equal(result.d.AnalyticalConfigurationName, "APF Hierarchy Demo", "Hierarchy demokit configuration returned");
			done();
		}
	});
	QUnit.test("GET Smart Filter Bar configuration", function(assert){
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.CONFIGURATION_SERVICE + "AnalyticalConfigurationQueryResults('57FCA36EC3D350DEE10000000A442AF7')",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			assert.equal(result.d.AnalyticalConfigurationName, "APF Smart Filter Bar Demo", "Smart Filter Bar demokit configuration returned");
			done();
		}
	});
	QUnit.test("GET normal configuration, change save and GET again", function(assert){
		var newConfiguration = {AnalyticalConfiguration:STANDARD_CONFIG_ID,AnalyticalConfigurationName:"APF Standard Demo",Application:"57FCA36EC3D350DEE10000000A442AF5",CreatedByUser:"",CreationUTCDateTime:null,LastChangeUTCDateTime:null,LastChangedByUser:"",SerializedAnalyticalConfiguration:"{\"analyticalConfigurationName\":\"APF Standard Demo\",\"applicationTitle\":{\"type\":\"label\",\"kind\":\"text\",\"key\":\"57FCA4E2C3D350DEE10000000A442AF5\"},\"steps\":[],\"requests\":[],\"bindings\":[],\"representationTypes\":[],\"categories\":[{\"type\":\"category\",\"description\":\"Just one Category\",\"id\":\"Category-10\",\"label\":{\"type\":\"label\",\"kind\":\"text\",\"key\":\"14840634288642628333823947991554\"},\"steps\":[]}],\"navigationTargets\":[],\"facetFilters\":[],\"configHeader\":{\"AnalyticalConfiguration\":\"57FCA36EC3D350DEE10000000A442AF4\",\"AnalyticalConfigurationName\":\"APF Standard Demo\",\"Application\":\"57FCA36EC3D350DEE10000000A442AF5\",\"CreatedByUser\":\"\",\"CreationUTCDateTime\":null,\"LastChangeUTCDateTime\":null,\"LastChangedByUser\":\"\"}}"};
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.CONFIGURATION_SERVICE + "AnalyticalConfigurationQueryResults('57FCA36EC3D350DEE10000000A442AF4')",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			assert.equal(result.d.AnalyticalConfigurationName, "APF Standard Demo", "Normal demokit configuration returned");
			jQuery.ajax({
				dataType: "json",
				url: _mockServer.constants.CONFIGURATION_SERVICE +  "AnalyticalConfigurationQueryResults('57FCA36EC3D350DEE10000000A442AF4')",
				method: "PUT",
				data: JSON.stringify(newConfiguration),
				success: assertChangingConfig,
				error: assertChangingConfig
			});
			function assertChangingConfig(result, message, object){
				assert.equal(object.status, 204, "HTTP status 204");
				jQuery.ajax({
					dataType: "json",
					url: _mockServer.constants.CONFIGURATION_SERVICE +  "AnalyticalConfigurationQueryResults('57FCA36EC3D350DEE10000000A442AF4')",
					success: assertChangedConfig,
					error: assertChangedConfig
				});
				function assertChangedConfig (result, message, object){
					assert.equal(object.status, 200, "HTTP status 200");
					assert.equal(result.d.SerializedAnalyticalConfiguration, newConfiguration.SerializedAnalyticalConfiguration, "Saved configuration returned");
					done();
				}
			}
		}
	});
	QUnit.module("Demokit Service", {
		beforeEach: function(){
			var localStorage = _mockServer._getStorage();
			localStorage.remove(_mockServer.constants.LOCAL_STORAGE_TEXTS);
			localStorage.remove(_mockServer.constants.LOCAL_STORAGE_CONFIGURATION);
			this.mockServer = _mockServer.mockDemokitService();
		},
		afterEach: function(){
			_mockServer.teardownMockserver();
		}
	});

	QUnit.test("Metadata", function(assert){
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.DEMOKIT_SERVICE_URL + "$metadata",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result){
			assert.equal(result.status, 200, "HTTP status 200");
			assert.ok(result.responseText.search('RevenueQueryResultsType') > -1, "EntityType contained in metadata");
			done();
		}
	});
	QUnit.test("Metadata of rows in ResultSet includes GUIDs", function(assert){
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.DEMOKIT_SERVICE_URL + "RevenueQuery(P_Currency=%27USD%27)/Results?$select=Revenue,Customer,CustomerName,Currency&$format=json",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			var regex = /tmp\/demokit\/demokit\.xsodata\/RevenueQueryResults\('\d{32}'\)/;
			var aWithoutGuid = result.d.results.filter(function(result) {
				return !(result.__metadata.id.match(regex) && result.__metadata.uri.match(regex));
			});
			assert.equal(aWithoutGuid.length, 0, "All rows include GUID-metadata");
			done();
		}
	});
	QUnit.test("Data request, aggregation and sorting", function(assert){
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.DEMOKIT_SERVICE_URL + "RevenueQuery(P_Currency=%27USD%27)/Results?$select=Revenue,Customer,CustomerName,Currency&$orderby=Revenue%20desc&$format=json",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			assert.equal(result.d.results.length, 12, "12 Customers returned");
			assert.equal(result.d.results[0].Revenue, 12818628, "Customer with highest revenue correct");
			assert.equal(result.d.results[1].Revenue, 8194896, "Customer with second highest revenue correct");
			done();
		}
	});
	QUnit.test("Aggregation always turns measures into numbers", function(assert) {
		var done = assert.async();
		// Previously measures were not casted, when no aggregation took place for a combination of dimensions that just one item of data was provided for.
		// As this case is not in the test-data, we need our own
		this.mockServer.setEntitySetData("RevenueQueryResults", [
			{
				Customer: "1001",
				Revenue: "2",
				Currency: "USD"
			},
			{
				Customer: "1001",
				Revenue: "2",
				Currency: "USD"
			},
			{
				Customer: "1002",
				Revenue: "3",
				Currency: "USD"
			}
		]);
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.DEMOKIT_SERVICE_URL + "RevenueQuery(P_Currency=%27USD%27)/Results?$orderby=Revenue%20desc&$format=json",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			assert.equal(result.d.results.length, 2, "2 TestEntities returned");
			assert.equal(typeof result.d.results[0].Revenue, "number", "Measures of aggregated entries are of type Number");
			assert.equal(typeof result.d.results[1].Revenue, "number", "Measures of non-aggregated entries are of type Number");
			done();
		}
	});
	QUnit.test("With pagination option $top (should operate on aggregated data)", function(assert){
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.DEMOKIT_SERVICE_URL + "RevenueQuery(P_Currency=%27USD%27)/Results?$select=Revenue,Customer,CustomerName,Currency&$orderby=Revenue%20desc&$format=json&$top=10",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			assert.equal(result.d.results.length, 10, "10 Customers returned");
			assert.equal(result.d.results[0].Revenue, 12818628, "Customer with highest revenue correct (orderby works)");
			assert.equal(result.d.results[1].Revenue, 8194896, "Customer with second highest revenue correct (orderby works)");
			done();
		}
	});
	QUnit.test("With pagination option $skip (should operate on aggregated data)", function(assert){
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.DEMOKIT_SERVICE_URL + "RevenueQuery(P_Currency=%27USD%27)/Results?$select=Revenue,Customer,CustomerName,Currency&$orderby=Revenue%20desc&$format=json&$skip=1",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			assert.equal(result.d.results.length, 11, "11 Customers returned");
			assert.equal(result.d.results[0].Revenue, 8194896, "Customer with highest revenue was skipped");
			done();
		}
	});
	QUnit.test("With pagination option $top and $skip (should operate on aggregated data)", function(assert){
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.DEMOKIT_SERVICE_URL + "RevenueQuery(P_Currency=%27USD%27)/Results?$select=Revenue,Customer,CustomerName,Currency&$orderby=Revenue%20desc&$format=json&$skip=1&$top=5",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			assert.equal(result.d.results.length, 5, "5 Customers returned");
			assert.equal(result.d.results[0].Revenue, 8194896, "Customer with highest revenue was skipped");
			done();
		}
	});
	QUnit.test("With $orderby as first parameter", function(assert) {
		var done = assert.async();

		/*
		 * The data are sorted twice:
		 * Once by the SAPUI MockServer. This happens before aggregation,
		 * is thus error-prone.
		 * After aggregation it is sorted again by the APF MockServer.
		 * This is the part we want to test especially, but with the default
		 * sample data the SAPUI MockServer accidentally does the correct sorting.
		 * Hence, we need our own sample data:
		 */
		this.mockServer.setEntitySetData("RevenueQueryResults", [
			{
				Customer: "1001",
				Revenue: "2",
				Currency: "USD"
			},
			{
				Customer: "1001",
				Revenue: "2",
				Currency: "USD"
			},
			{
				Customer: "1002",
				Revenue: "3",
				Currency: "USD"
			}
		]);
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.DEMOKIT_SERVICE_URL + "RevenueQuery(P_Currency=%27USD%27)/Results?$orderby=Revenue%20desc&$format=json",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			assert.equal(result.d.results.length, 2, "2 TestEntities returned");
			assert.equal(result.d.results[0].Customer, "1001", "Customer with highest revenue correct");
			done();
		}
	});
	QUnit.test("With multiple columns in $orderby (only measures)", function(assert) {
		var done = assert.async();
		// Own Mock Data, cause available data has no duplicate measures in aggregated form
		this.mockServer.setEntitySetData("RevenueQueryResults", [
			{
				Customer: "1001",
				Revenue: 2,
				ShippingCosts: 100,
				Currency: "USD"
			},
			{
				Customer: "1001",
				Revenue: 2,
				ShippingCosts: 100,
				Currency: "USD"
			},
			{
				Customer: "1002",
				Revenue: 4,
				ShippingCosts: 250,
				Currency: "USD"
			},
			{
				Customer: "1003",
				Revenue: 5,
				ShippingCosts: 150,
				Currency: "USD"
			}
		]);
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.DEMOKIT_SERVICE_URL + "RevenueQuery(P_Currency=%27USD%27)/Results?$select=Revenue,Customer,ShippingCosts&$orderby=Revenue%20desc,ShippingCosts&$format=json",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			assert.equal(result.d.results.length, 3, "3 TestEntities returned");
			assert.equal(result.d.results[0].Customer, "1003", "Customer with highest revenue correct");
			assert.equal(result.d.results[1].Customer, "1001", "Customer with second highest revenue and lowest shipping costs correct");
			done();
		}
	});
	QUnit.test("With multiple columns in $orderby (measures and dimension)", function(assert) {
		var done = assert.async();
		// Own Mock Data, cause available data has no duplicate measures in aggregated form
		this.mockServer.setEntitySetData("RevenueQueryResults", [
			{
				Customer: "1002",
				Revenue: 2,
				ShippingCosts: 100,
				Currency: "USD"
			},
			{
				Customer: "1002",
				Revenue: 2,
				ShippingCosts: 100,
				Currency: "USD"
			},
			{
				Customer: "1001",
				Revenue: 4,
				ShippingCosts: 250,
				Currency: "USD"
			},
			{
				Customer: "1003",
				Revenue: 5,
				ShippingCosts: 150,
				Currency: "USD"
			}
		]);
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.DEMOKIT_SERVICE_URL + "RevenueQuery(P_Currency=%27USD%27)/Results?$select=Revenue,Customer,ShippingCosts&$orderby=Revenue%20desc,Customer,ShippingCosts&$format=json",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			assert.equal(result.d.results.length, 3, "3 TestEntities returned");
			assert.equal(result.d.results[0].Customer, "1003", "Customer with highest revenue correct");
			assert.equal(result.d.results[1].Customer, "1001", "Customer with second highest revenue and lowest Customer-Number correct");
			done();
		}
	});
	QUnit.test("Smart Filter Bar entitySets", function(assert){
		var entities = ["Product", "Customer", "CompanyCode", "Country"];
		var expectedReults = [6, 12, 5, 3];
		var counter = 0;
		testEntity(entities[counter], expectedReults[counter]);
		var done = assert.async();
		function testEntity(entity, expectedReult) {
			jQuery.ajax({
				dataType: "json",
				url: _mockServer.constants.DEMOKIT_SERVICE_URL + entity + "?$select= " + entity + "&$format=json",
				success: assertResult,
				error: assertResult
			});
			function assertResult(result, message, object){
				assert.equal(object.status, 200, "HTTP status 200");
				assert.equal(result.d.results.length, expectedReult, expectedReult + " " + entity + "returned");
				counter++;
				if(counter === entities.length){
					done();
				} else {
					testEntity(entities[counter], expectedReults[counter]);
				}
			}
		}
	});
	QUnit.test("GET without any URL parameters", function(assert) {
		var result = jQuery.sap.sjax({
			dataType: "json",
			url: _mockServer.constants.DEMOKIT_SERVICE_URL + "RevenueQuery(P_Currency=%27USD%27)/Results"
		});

		assert.strictEqual(result.status, "success", "query was successful");
	});

	QUnit.test("GET aggregated query with inlinecount", function(assert) {
		var result = jQuery.sap.sjax({
			dataType: "json",
			url: _mockServer.constants.DEMOKIT_SERVICE_URL + "RevenueQuery(P_Currency=%27USD%27)/Results?$select=Country&$inlinecount=allpages"
		});

		assert.strictEqual(result.status, "success",
			"then query was successful");

		assert.notStrictEqual(result.data.d.__count, undefined,
			"then the inline count is present");

		assert.strictEqual(result.data.d.results.length, result.data.d.__count,
			"then the inline count equals the number of results");
	});

	QUnit.test("GET aggregated query with paging and inlinecount", function(assert) {
		var resultWithoutPaging = jQuery.sap.sjax({
			dataType: "json",
			url: _mockServer.constants.DEMOKIT_SERVICE_URL + "RevenueQuery(P_Currency=%27USD%27)/Results?$select=Country&$inlinecount=allpages"
		});

		var resultWithPaging = jQuery.sap.sjax({
			dataType: "json",
			url: _mockServer.constants.DEMOKIT_SERVICE_URL + "RevenueQuery(P_Currency=%27USD%27)/Results?$select=Country&$top=1&$inlinecount=allpages"
		});

		assert.notStrictEqual(resultWithoutPaging.data.d.results.length, resultWithPaging.data.d.results.length,
			"then we get less results with paging");

		assert.notStrictEqual(resultWithPaging.data.d.__count, undefined,
			"then the inline count is present");

		assert.strictEqual(resultWithoutPaging.data.d.__count, resultWithPaging.data.d.__count,
			"then the inline count is independent from paging");
	});

	QUnit.module("Hierarchy Service with exit", {
		beforeEach: function(){
			var localStorage = _mockServer._getStorage();
			localStorage.remove(_mockServer.constants.LOCAL_STORAGE_TEXTS);
			localStorage.remove(_mockServer.constants.LOCAL_STORAGE_CONFIGURATION);
			_mockServer.mockHierarchyService();
		},
		afterEach: function(){
			_mockServer.teardownMockserver();
		}
	});
	QUnit.test("request metadata", function(assert){
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.DEMOKIT_HIERARCHY_SERVICE_URL + "$metadata",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result){
			assert.equal(result.status, 200, "HTTP status 200");
			Object.keys(_mockServer.constants.HIERARCHY_SERVICE_SPEC).forEach(function(neededProperty){
				assert.ok(result.responseText.search(_mockServer.constants.HIERARCHY_SERVICE_SPEC[neededProperty]) > -1, "Needed property " + _mockServer.constants.HIERARCHY_SERVICE_SPEC[neededProperty] + " contained in metadata");
			});
			done();
		}
	});
	QUnit.test("Count request", function(assert){
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.DEMOKIT_HIERARCHY_SERVICE_URL + "RevenueHryQuery(P_Currency=%27USD%27)/Results/$count?$filter=Customer_Level%20eq%200",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.equal(object.status, 200, "HTTP status 200");
			done();
		}
	});
	QUnit.test("Get Root node and expand root node", function(assert){
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.DEMOKIT_HIERARCHY_SERVICE_URL + "RevenueHryQuery(P_Currency=%27USD%27)/Results?$filter=Customer_Level%20eq%200&$select=Customer%2cCustomer_NodeID%2cCustomer_ParentID%2cCustomer_Level%2cCustomer_Drillstate%2cCurrency%2cCustomer_NodeText%2cRevenue&$skip=0&$top=110",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result, message, object){
			assert.strictEqual(result.d.results.length, 1, "1 root node returned");
			assert.equal(result.d.results[0].Revenue, 61627992, "Correct aggregated revenue returned");
			assert.equal(object.status, 200, "HTTP status 200");

			jQuery.ajax({
				dataType: "json",
				url: _mockServer.constants.DEMOKIT_HIERARCHY_SERVICE_URL + "RevenueHryQuery(P_Currency=%27USD%27)/Results?$filter=Customer_ParentID%20eq%20%27Customer%3a%20CG05%27&$select=Customer%2cCustomer_NodeID%2cCustomer_ParentID%2cCustomer_Level%2cCustomer_Drillstate%2cCurrency%2cCustomer_NodeText%2cRevenue&$skip=0&$top=133",
				success: assertExpansionResult,
				error: assertExpansionResult
			});
			function assertExpansionResult(result, message, object){
				assert.strictEqual(result.d.results.length, 2, "2 child nodes returned");
				assert.equal(result.d.results[0].Revenue, 28722972, "Correct aggregated revenue for first child returned");
				assert.equal(result.d.results[1].Revenue, 32905020, "Correct aggregated revenue for second child returned");
				assert.equal(object.status, 200, "HTTP status 200");
				done();
			}
		}
	});
	QUnit.module("Runtime Service", {
		beforeEach: function(assert){
			this.spy_savePath = sinon.spy(_mockServer, "savePath");
			var localStorage = _mockServer._getStorage();
			localStorage.remove(_mockServer.constants.LOCAL_STORAGE_TEXTS);
			localStorage.remove(_mockServer.constants.LOCAL_STORAGE_CONFIGURATION);
			_mockServer.mockRuntimeService([StandardConfiguration, SFBConfiguration, HierarchyConfiguration]);
		},
		afterEach: function(){
			_mockServer.teardownMockserver();
			this.spy_savePath.restore();
		}
	});

	QUnit.test("request metadata", function(assert){
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.RUNTIME_SERVICE_URL + "$metadata",
			success: assertResult,
			error: assertResult
		});
		function assertResult(result){
			assert.equal(result.status, 200, "HTTP status 200");
			assert.ok(result.responseText.search('AnalysisPathQueryResults') > -1, "is defined contained in metadata");
			assert.ok(result.responseText.search('AnalysisPathCountQueryResults') > -1, "is defined contained in metadata");
			assert.ok(result.responseText.search('AnalyticalConfigurationQueryResults') > -1, "is defined contained in metadata");
			assert.ok(result.responseText.search('TextElementQueryResults') > -1, "is defined contained in metadata");
			done();
		}
	});
	QUnit.test("request empty path list", function(assert) {
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.RUNTIME_SERVICE_URL + "AnalysisPathQueryResults?$filter=(LogicalSystem%20eq%20%27%27%20and%20ApplicationConfigurationURL%20eq%20%27sap.apf.demokit.runtime%27)",
			success: assertListPaths,
			error: assertListPaths
		});

		function assertListPaths(result, message, object) {
			assert.equal(object.status, 200, "HTTP status 200");
			assert.equal(result.d.results.length, 0, "Empty Path List returned");
			done();
		}
	});
	QUnit.test("request configuration list", function(assert) {
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			url: _mockServer.constants.RUNTIME_SERVICE_URL + "AnalyticalConfigurationQueryResults",
			success: assertListPaths,
			error: assertListPaths
		});

		function assertListPaths(result, message, object) {
			assert.equal(object.status, 200, "HTTP status 200");
			assert.equal(result.d.results.length, 3, "3 configs returned");
			done();
		}
	});
	QUnit.test("request POST (saving path)", function(assert) {
		// prove success and that the exit method savePath is called
		var that = this;
		var apfPath = {
			AnalysisPath: "14849222420201577969590884123744",
			AnalysisPathName: "Test",
			ApplicationConfigurationURL: "sap.apf.demokit.runtime",
			CreationUTCDateTime: "/Date(1484916865544)/",
			LastChangeUTCDateTime: "/Date(1484916865544)/",
			LogicalSystem: "",
			SerializedAnalysisPath: '{"startFilterHandler":{"startFilters":[{"propertyName":"P_Currency","selectedValues":["USD"]},{"propertyName":"CompanyCode","selectedValues":["CA01","CH01","DE01","IN01","US01"]},{"propertyName":"Country","selectedValues":[]},{"propertyName":"CustomerGroup","selectedValues":[]},{"propertyName":"Customer","selectedValues":[]}],"restrictionsSetByApplication":{}},"filterIdHandler":{},"path":{"steps":[{"stepId":"Step-5","binding":{"selectedRepresentation":{"oFilter":[]},"selectedRepresentationId":"Step-5-Representation-1"}}],"indicesOfActiveSteps":[0]}}"',
			StructuredAnalysisPath: '{"steps":[{"stepId":"Step-5","selectedRepresentationId":"Step-5-Representation-1"}],"indexOfActiveStep":0}"'

		};
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			method: "POST",
			url: _mockServer.constants.RUNTIME_SERVICE_URL + "AnalysisPathQueryResults('14849222420201577969590884123744')",
			data: JSON.stringify(apfPath),
			success: assertCreatePath,
			error: assertCreatePath
		});

		function assertCreatePath(result, message, object) {
			assert.equal(object.status, 201, "HTTP status 200");
			assert.strictEqual(that.spy_savePath.callCount, 1, "savePath() called");
			done();
		}
	});
	QUnit.test("request POST (saving path) and loading updated path list", function(assert){
		var apfPath = {
			AnalysisPath:"14849222420201577969590884123744",
			AnalysisPathName:"Test",
			ApplicationConfigurationURL:"sap.apf.demokit.runtime",
			CreationUTCDateTime:"/Date(1484916865544)/",
			LastChangeUTCDateTime:"/Date(1484916865544)/",
			LogicalSystem:"",
			SerializedAnalysisPath:'{"startFilterHandler":{"startFilters":[{"propertyName":"P_Currency","selectedValues":["USD"]},{"propertyName":"CompanyCode","selectedValues":["CA01","CH01","DE01","IN01","US01"]},{"propertyName":"Country","selectedValues":[]},{"propertyName":"CustomerGroup","selectedValues":[]},{"propertyName":"Customer","selectedValues":[]}],"restrictionsSetByApplication":{}},"filterIdHandler":{},"path":{"steps":[{"stepId":"Step-5","binding":{"selectedRepresentation":{"oFilter":[]},"selectedRepresentationId":"Step-5-Representation-1"}}],"indicesOfActiveSteps":[0]}}"',
			StructuredAnalysisPath:'{"steps":[{"stepId":"Step-5","selectedRepresentationId":"Step-5-Representation-1"}],"indexOfActiveStep":0}"'
		};
		var done = assert.async();
		jQuery.ajax({
			dataType: "json",
			method: "POST",
			url: _mockServer.constants.RUNTIME_SERVICE_URL + "AnalysisPathQueryResults('14849222420201577969590884123744')",
			data: JSON.stringify(apfPath),
			success: assertCreatePath,
			error: assertCreatePath
		});
		function assertCreatePath(result, message, object){
			assert.equal(object.status, 201, "HTTP status 200");
			jQuery.ajax({
				dataType: "json",
				url: _mockServer.constants.RUNTIME_SERVICE_URL + "AnalysisPathQueryResults?$filter=(LogicalSystem%20eq%20%27%27%20and%20ApplicationConfigurationURL%20eq%20%27sap.apf.demokit.runtime%27)",
				success: assertResult,
				error: assertResult
			});
			function assertResult(result, message, object){
				assert.strictEqual(object.status, 200, "HTTP status 200");
				assert.strictEqual(result.d.results.length, 1, "One Path returned");
				assert.strictEqual(result.d.results[0].AnalysisPath, apfPath.AnalysisPath, "GUID is unchanged in payload");
				done();
			}
		}
	});
	QUnit.test("given incomplete path data (GUID) when savePath ", function(assert) {
		var apfPath = {
		};
		var requestObject = {
			mParameters : {
				oXhr : {
					requestBody : JSON.stringify(apfPath)
				}
			}
		};
		_mockServer.savePath(requestObject);
		var oBody = JSON.parse(requestObject.mParameters.oXhr.requestBody);
		assert.notStrictEqual( oBody.AnalysisPath, undefined, "then GUID has been set");
		assert.notStrictEqual( oBody.CreationUTCDateTime, undefined, "and creation date has been set");
		assert.notStrictEqual( oBody.LastChangeUTCDateTime, undefined, "and change date has been set");
	});
	QUnit.module("given importTextsFromFile", {
		beforeEach: function(assert){
			// Shall be a file which is result of modeler export
			this.filePath = "../resources/i18n/demokitTest.properties";
			this.mockServerInstance = _mockServer.mockConfigurationService([StandardConfiguration]);
		},
		afterEach: function(){
			_mockServer.teardownMockserver();
		}
	});
	QUnit.test("when loading non existing text file", function(assert) {
		var that = this;
		var done = assert.async();
		_mockServer.importTextsFromFile("hugo", this.mockServerInstance, callback);
		function callback(error){
			assert.strictEqual(error.filePath, "hugo", "callback is called with error object");
			assert.notStrictEqual(error.errorText, "undefined", "with error object");
			var entitySet = that.mockServerInstance.getEntitySetData(_mockServer.constants.TEXTS_ENTITYSET);
			assert.strictEqual( entitySet.length, 0, "empty text pool");
			done();
		}
	});
	QUnit.test("when loading text file", function(assert) {
		var that = this;
		var done = assert.async();
		_mockServer.importTextsFromFile(this.filePath, this.mockServerInstance, callback);
		function callback(result){
			assert.strictEqual(Array.isArray(result), true, "callback is called on success");
			var entitySet = that.mockServerInstance.getEntitySetData(_mockServer.constants.TEXTS_ENTITYSET);
			assert.notEqual( entitySet.length, 0, "non-empty text pool");
			done();
		}
	});

	QUnit.module("Direct tests of functions");
	QUnit.test("Sorting: _sortData()", function(assert) {
		function getCustomer(el) {
			return el.Customer;
		}
		var data = [
			{
				Customer: "1001",
				Revenue: 1,
				ShippingCosts: 100,
				Currency: "USD"
			}, {
				Customer: "1002",
				Revenue: 2,
				ShippingCosts: 100,
				Currency: "USD"
			}, {
				Customer: "1003",
				Revenue: 4,
				ShippingCosts: 250,
				Currency: "USD"
			}, {
				Customer: "1004",
				Revenue: 5,
				ShippingCosts: 150,
				Currency: "USD"
			}
		];
		assert.deepEqual(_mockServer._sortData(data, "").map(getCustomer), ["1001", "1002", "1003", "1004"], "[anchor] Empty orderby-option does not sort");
		assert.deepEqual(_mockServer._sortData(data, "ShippingCosts").map(getCustomer), ["1001", "1002", "1004", "1003"], "[anchor] Orderby-option with just one attribute and implicit direction");
		assert.deepEqual(_mockServer._sortData(data, "ShippingCosts%20asc").map(getCustomer), ["1001", "1002", "1004", "1003"], "[anchor] Orderby-option with just one attribute and explicit direction ascending");
		assert.deepEqual(_mockServer._sortData(data, "Customer%20desc").map(getCustomer), ["1004", "1003", "1002", "1001"], "[anchor] Orderby-option with just one attribute and explicit direction descending");
		assert.deepEqual(_mockServer._sortData(data, "Currency").map(getCustomer), ["1001", "1002", "1003", "1004"], "[anchor] Orderby-option with just one attribute that is equal in all rows does not sort");
		assert.deepEqual(_mockServer._sortData(data, "Currency,ShippingCosts"), _mockServer._sortData(data, "ShippingCosts"), "[i+1] Orderby-option with one attribute that is equal in all rows and a secondary attribute (that is not equal) sorts just like sorting only by the secondary attribute");
		assert.deepEqual(_mockServer._sortData(data, "Currency,Currency,Currency,Currency,Currency,Currency,Currency,ShippingCosts"), _mockServer._sortData(data, "ShippingCosts"), "[i+7] The same is true for an arbitrary number of equal attributes (here example 7)");
		assert.deepEqual(_mockServer._sortData(data, "Currency,ShippingCosts,Revenue%20desc").map(getCustomer), ["1002", "1001", "1004", "1003"], "Full, more complex hierarchical Sorting");
	});
	QUnit.test("Aggregation: _aggregateData()", function(assert) {
		var noAggregation = [
			{
				Customer: "1001",
				Revenue: 1,
				ShippingCosts: 100
			}, {
				Customer: "1002",
				Revenue: 2,
				ShippingCosts: 100
			}, {
				Customer: "1003",
				Revenue: 4,
				ShippingCosts: 250
			}, {
				Customer: "1004",
				Revenue: 5,
				ShippingCosts: 150
			}
		];
		assert.deepEqual(_mockServer._aggregateData(noAggregation), noAggregation, "[anchor] Nothing to aggregate -> no aggregation");
		var data2d = [
			{
				Customer: "1001",
				ProductName: "Laptop",
				Revenue: 1,
				ShippingCosts: 100
			}, {
				Customer: "1001",
				ProductName: "Laptop",
				Revenue: 2,
				ShippingCosts: 100
			}, {
				Customer: "1002",
				ProductName: "Laptop",
				Revenue: 4,
				ShippingCosts: 250
			}, {
				Customer: "1002",
				ProductName: "Smartphone",
				Revenue: 5,
				ShippingCosts: 150
			}
		];
		function removeProductName(entry) {
			var copy = jQuery.extend(true, {}, entry);
			delete copy.ProductName;
			return copy;
		}
		var data1d = data2d.map(removeProductName);
		var expectedAggregation1d = [
			{
				Customer: "1001",
				Revenue: 3,
				ShippingCosts: 200
			}, {
				Customer: "1002",
				Revenue: 9,
				ShippingCosts: 400
			}
		];
		assert.deepEqual(_mockServer._aggregateData(data1d), expectedAggregation1d, "[anchor] Aggregation on one dimension");
		assert.deepEqual(_mockServer._aggregateData(_mockServer._aggregateData(data1d)), _mockServer._aggregateData(data1d), "[i+1] Aggregating already aggregated data doesn't change anything");
		assert.deepEqual(_mockServer._aggregateData(_mockServer._aggregateData(data2d).map(removeProductName)), _mockServer._aggregateData(data1d), "[i+1] Aggregating the 'aggregation on two dimensions' on just one of these dimensions equals a direct aggregation on this dimension");
	});
	QUnit.test("URL-Parsing: _parseUrl()", function(assert) {
		assert.equal(_mockServer._parseUrl(12).couldParse, false, "Non-string isn't URL and won't be parsed");
		assert.equal(_mockServer._parseUrl("").couldParse, true, "Empty URL will be parsed");
		assert.equal(_mockServer._parseUrl("test?test?").couldParse, false, "Invalid URL won't be parsed");
		assert.deepEqual(_mockServer._parseUrl(""), {couldParse: true, path: "", parameters: {}}, "Empty URL will be parsed");
		assert.deepEqual(_mockServer._parseUrl("test"), {couldParse: true, path: "test", parameters: {}}, "URL without params parsed correctly");
		assert.deepEqual(_mockServer._parseUrl("test?a=b&c=d"), {couldParse: true, path: "test", parameters: {a:"b",c:"d"}}, "URL with params parsed correctly");
	});
	QUnit.test("URL-Parsing: _generateUrlString()", function(assert) {
		assert.equal(_mockServer._generateUrlString("test", {}), "test?", "URL without parameters properly generated");
		assert.equal(_mockServer._generateUrlString("test", {a:"b",c:"d"}), "test?a=b&c=d", "URL with parameters properly generated");
	});
	QUnit.test("URL-Parsing: _parseOrderBy()", function(assert) {
		assert.deepEqual(_mockServer._parseOrderBy(12), [], "Non-string is no orderby-clause --> no sorting");
		assert.deepEqual(_mockServer._parseOrderBy(""), [], "empty string --> no sorting");
		assert.deepEqual(_mockServer._parseOrderBy("test"), [{attr: "test", direction: 1}], "One property w/o direction");
		assert.deepEqual(_mockServer._parseOrderBy("test%20asc"), [{attr: "test", direction: 1}], "One property, direction ascending");
		assert.deepEqual(_mockServer._parseOrderBy("test%20desc"), [{attr: "test", direction: -1}], "One property, direction descending");
		assert.deepEqual(_mockServer._parseOrderBy("test%20DESC"), [{attr: "test", direction: -1}], "One property, direction descending, different capitalisation of direction");
		assert.deepEqual(_mockServer._parseOrderBy("a,b"), [{attr: "a", direction: 1},{attr: "b", direction: 1}], "Two properties");
	});
});