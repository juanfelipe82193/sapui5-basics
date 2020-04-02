sap.apf.testhelper.injectURLParameters({
			"key1" : "value1",
			"key2" : "value2"
		});
QUnit.module("Contained in Array");
QUnit.test("function contained in array 1", function(assert) {
	var aContained = [ {
		customer : '1000',
		country : 'BRA'
	}, {
		customer : '1002',
		country : 'ARG'
	} ];
	var aData = [ {
		customer : '1000',
		country : 'BRA',
		kfig : 1000
	}, {
		customer : '1002',
		country : 'ARG',
		kfig : 1200
	} ];
	var bContained = sap.apf.testhelper.isContainedInArray(aContained, aData);
	assert.equal(bContained, true, "Data contained in array");
});
QUnit.test("negative test - one record not contained", function(assert) {
	var aContained = [ {
		customer : '1002',
		country : 'BRA'
	}, {
		customer : '1002',
		country : 'ARG'
	} ];
	var aData = [ {
		customer : '1000',
		country : 'BRA',
		kfig : 1000
	}, {
		customer : '1002',
		country : 'ARG',
		kfig : 1200
	} ];
	var bContained = sap.apf.testhelper.isContainedInArray(aContained, aData);
	assert.equal(bContained, false, "Data not contained in array");
});
QUnit.test("negative test - property is missing in data", function(assert) {
	var aContained = [ {
		customer : '1002',
		country : 'BRA'
	}, {
		customer : '1002',
		country : 'ARG'
	} ];
	var aData = [ {
		customer : '1000',
		wrongProperty : 'BRA',
		kfig : 1000
	}, {
		customer : '1002',
		country : 'ARG',
		kfig : 1200
	} ];
	var bContained = sap.apf.testhelper.isContainedInArray(aContained, aData);
	assert.equal(bContained, false, "Data not contained in array");
});
QUnit.test("positive test with more records", function(assert) {
	var aContained = [ {
		customer : '1000',
		country : 'BRA'
	}, {
		customer : '1002',
		country : 'ARG'
	} ];
	var aData = [ {
		customer : '1002',
		country : 'BRA',
		kfig : 1000
	}, {
		customer : '1002',
		country : 'ARG',
		kfig : 1200
	}, {
		customer : '1000',
		country : 'BRA',
		kfig : 1200
	} ];
	var bContained = sap.apf.testhelper.isContainedInArray(aContained, aData);
	assert.equal(bContained, true, "Data  contained in array");
});


/*
QUnit.module("Path persistence proxy", {
	sLogicalSystem : "logicalSystem",
	sApplicationConfigurationURL : "pathToApplication",
beforeEach : function() {
		this.helper = sap.apf.testhelper.createIsolation().initPathPersistenceProxy();
	},
afterEach : function() {
		this.helper.deletePathPersistenceProxy();
	},
	createSerializablePathWithSteps : function(nSteps) {
		var oPath = {
			steps : []
		};
		for( var i = 1; i <= nSteps; i++) {
			oPath.steps.push({
				step : "step" + i
			});
		}
		return oPath;
	},
	createPath : function(oPath, oStructuredPath, assertPost) {
		var oData = {
			AnalysisPathName : "path",
			LogicalSystem : this.sLogicalSystem,
			ApplicationConfigurationURL : this.sApplicationConfigurationURL,
			SerializedAnalysisPath : oPath,
			StructuredAnalysisPath : oStructuredPath
		};
		var oRequest = {
			url : "path.xsjs",
			type : "POST",
			data : JSON.stringify(oData),
			success : assertPost,
			error : function(oJqXHR, sStatus, sError) {
				throw new Error();
			}
		};
		sap.apf.core.ajax(oRequest);
	},
	readPaths : function() {
		var oData;
		oRequest = {
			type : 'GET',
			url : "path.xsjs?LogicalSystem='" + this.sLogicalSystem + "'&ApplicationConfigurationURL='" + this.sApplicationConfigurationURL + "'",
			error : function(oJqXHR, sStatus, sErrorThrown) {
				throw new Error();
			},
			success : function(data) {
				oData = data;
			},
		};

		sap.apf.core.ajax(oRequest);
		return oData;
	},
	openPath : function(sPathId) {
		var oData;
		oRequest = {
			type : 'GET',
			url : "path.xsjs?AnalysisPath='" + sPathId + "'",
			error : function(oJqXHR, sStatus, sErrorThrown) {
				throw new Error();
			},
			success : function(data) {
				oData = data.path;
				oData.SerializedAnalysisPath = JSON.parse(oData.SerializedAnalysisPath);
			},
		};

		sap.apf.core.ajax(oRequest);
		return oData;
	},
	modifyPath : function(sPathId, oPath, oStructuredPath, assertPut) {
		var oData = {
			AnalysisPath : sPathId,
			AnalysisPathName : "modifiedPath",
			LogicalSystem : this.sLogicalSystem,
			ApplicationConfigurationURL : this.sApplicationConfigurationURL,
			SerializedAnalysisPath : oPath,
			StructuredAnalysisPath : oStructuredPath
		};
		var oRequest = {
			url : "path.xsjs",
			type : "PUT",
			data : JSON.stringify(oData),
			success : assertPut,
			error : function(oJqXHR, sStatus, sError) {
				throw new Error();
			}
		};
		sap.apf.core.ajax(oRequest);
	},
	deletePath : function(sPathId, assertPut) {
		oRequest = {
			type : 'DELETE',
			url : "path.xsjs?AnalysisPath='" + sPathId + "'",
			success : assertPut,
			error : function(oJqXHR, sStatus, sErrorThrown) {
				throw new Error();
			}
		};
		sap.apf.core.ajax(oRequest);
	}
});
QUnit.test("Send simple requests for createPath and readPaths", function() {
assert.expect(8);
	var oPath = this.createSerializablePathWithSteps(1);
	var oStructuredPath = {};

	var assertPost = function(data, textStatus, jqXHR) {
		sGuid = data.AnalysisPath;
assert.equal(sGuid, "guid1", "POST: Correct GUID expected");

	};
	this.createPath(oPath, oStructuredPath, assertPost);
	var oData = this.readPaths();
	sGuid = oData.paths[0].AnalysisPath;
assert.equal(sGuid, "guid1", "Returned path has correct GUID");
assert.deepEqual(JSON.parse(oData.paths[0].StructuredAnalysisPath), oStructuredPath, "Returned path has correct structured StructuredAnalysisPath");
assert.ok(!oData.paths[0].SerializedAnalysisPath, "SerializedAnalysisPath deleted in returned path");
assert.ok(oData.paths[0].AnalysisPathName, "Returned path has property AnalysisPathName");
assert.ok(oData.paths[0].CreationUtcDateTime, "Returned path has property CreationUtcDateTime");
assert.ok(!oData.paths[0].ApplicationConfigurationURL, "ApplicationConfigurationURL" + " deleted in returned path");
assert.ok(!oData.paths[0].LogicalSystem, "LogicalSystem deleted in returned path");
});
QUnit.test("Save three paths and open second", function() {
	var oPath1 = this.createSerializablePathWithSteps(1);
	var oPath2 = this.createSerializablePathWithSteps(2);
	var oPath3 = this.createSerializablePathWithSteps(3);

	this.createPath(oPath1, {}, function() {
	});
	this.createPath(oPath2, {}, function() {
	});
	this.createPath(oPath3, {}, function() {
	});

	var oData = this.readPaths();
assert.equal(oData.paths.length, 3, "Three saved paths expected");

	var sPathId = oData.paths[1].AnalysisPath;
	var oOpenedPath = this.openPath(sPathId);
assert.deepEqual(oOpenedPath.SerializedAnalysisPath, oPath2, "Second saved path expected");
});
QUnit.test("Modify 2nd path", function() {
	var oPath1 = this.createSerializablePathWithSteps(1);
	var oPath2 = this.createSerializablePathWithSteps(2);
	var oPath3 = this.createSerializablePathWithSteps(3);

	this.createPath(oPath1, {}, function() {
	});
	this.createPath(oPath2, {}, function() {
	});
	this.createPath(oPath3, {}, function() {
	});

	var oData = this.readPaths();

	var sPathId = oData.paths[1].AnalysisPath;
	this.modifyPath(sPathId, oPath3, {}, assertPut);
	var oOpenedPath = this.openPath(sPathId);
assert.deepEqual(oOpenedPath.SerializedAnalysisPath, oPath3, "Second saved path equal 3rd saved path");
	function assertPut() {
	}
	;
});
QUnit.test("Delete first path", function() {
	var oPath1 = this.createSerializablePathWithSteps(1);
	var oPath2 = this.createSerializablePathWithSteps(2);
	var oPath3 = this.createSerializablePathWithSteps(3);

	this.createPath(oPath1, {}, function() {
	});
	this.createPath(oPath2, {}, function() {
	});
	this.createPath(oPath3, {}, function() {
	});

	var oData = this.readPaths();
assert.equal(oData.paths.length, 3, "Three saved paths expected");

	var sPathId = oData.paths[0].AnalysisPath;
	this.deletePath(sPathId, assertDelete);
	var oData = this.readPaths();
assert.equal(oData.paths.length, 2, "Two saved paths expected");

	function assertDelete() {
	}
	;
});
QUnit.test("Ensure that local storage is cleared at the beginning of a test", function() {
	var aResult = this.readPaths();
assert.equal(aResult, null, "No saved data expected");
});

/*
QUnit.module("Proxy for Logical System", {
beforeEach : function() {
		QUnit.stop();
		sap.apf.testhelper.doubleCheckAndMessaging();
		this.helper = sap.apf.testhelper.createIsolation().initLogicalSystemRequestProxy().initCoreUriGenerator();
		this.oAuthTestHelper = new sap.apf.testhelper.AuthTestHelper(function() {
			this.oSessionHandler = new sap.apf.core.SessionHandler();
			QUnit.start();
		}.bind(this));
	},
afterEach : function() {
		this.helper.deleteLogicalSystemRequestProxy().deleteCoreUriGenerator();
		sap.apf.testhelper.resetDoubleCheckAndMessaging();
	}
});
QUnit.test("Retrieve expected logical System", function() {
	var oRequest = {
		requestUri : "/path/to/logicalSystem/LogicalSystemEntity?$select=LogicalSystem$filter=(SAPClient%20eq%20%27777%27",
		method : "GET"
	};
	
	var fnAssertCorrectLogicalSystemOnSuccess = function(oData) {
assert.equal(oData.results instanceof Array && oData.results.length === 1 && oData.results[0].LogicalSystem && oData.results[0].LogicalSystem === "Q63CLNT777", true, "Correct LogicalSystem returned");
	};
	var fnError = function(oError) {
assert.equal(1, 2, "Unexpected Error");
	};
	sap.apf.core.odataRequest(oRequest, fnAssertCorrectLogicalSystemOnSuccess, fnError, {});
});
QUnit.test("Token Double", function() {
assert.ok(typeof this.oSessionHandler.getXsrfToken() === "string", 'XSRF token expected');
assert.equal(this.oSessionHandler.getXsrfToken(),"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", 'XSRF token has content of double.');
});
QUnit.test("Lougout Double", function() {
assert.equal(this.oSessionHandler.logoutHanaXse(), undefined, "Logout doesn't throw an error. Not better testable.");
});

*/
QUnit.module("URL Parameter Injector", {
	beforeEach : function(assert) {

	}
});
QUnit.test("Injection of URL Parameters",function(assert) {
	var oUriParams = sap.apf.utils.getUriParameters();
	assert.equal(oUriParams.key1[0],"value1","First value");
	assert.equal(oUriParams.key2[0],"value2","Second value");
});

