sap.ui.define([
    "test-resources/sap/ovp/qunit/cards/utils",
    "/sap/ovp/cards/ActionUtils",
    "test-resources/sap/ovp/mockservers"
],function (utils, ActionUtils, mockservers) {
            "use strict";
            console.log("OVP - Actionutil");
            module("sap.ovp.app.Main", {
                /**
                 * This method is called before each test
                 */
                setup: function () {
                    //jQuery.sap.require("sap.ovp.test.mockservers");
                    console.log("OVP - Actionutil - setup" + utils.toString());
                    mockservers.loadMockServer(utils.odataBaseUrl_salesOrder, utils.odataRootUrl_salesOrder);

                },
                /**
                 * This method is called after each test. Add every restoration code here
                 *
                 */
                teardown: function () {
                    console.log("OVP - Actionutil -- teardown");
                    mockservers.close();
                }
            });

            test("Action Utils - _toBoolean tests", function () {

                console.log("OVP - Actionutil -- first test");

                ok(!ActionUtils._toBoolean("false"));
                ok(!ActionUtils._toBoolean(""));
                ok(ActionUtils._toBoolean("true"));
                ok(!ActionUtils._toBoolean(false));
                ok(!ActionUtils._toBoolean());
                ok(!ActionUtils._toBoolean(null));
                ok(!ActionUtils._toBoolean(undefined));
                ok(ActionUtils._toBoolean(true));
            });

            test("Action Utils - _isMandatoryParameter tests", function () {
                var parameter = {};
                parameter.nullable = false;
                ok(ActionUtils._isMandatoryParameter(parameter));
                parameter.nullable = true;
                ok(!ActionUtils._isMandatoryParameter(parameter));
                parameter.nullable = undefined;
                ok(ActionUtils._isMandatoryParameter(parameter));
                parameter.nullable = "";
                ok(ActionUtils._isMandatoryParameter(parameter));
            });

            test("Action Utils - Validate Parameters Value  &  mandatory-Params-Missing", function() {

                // preparing function import Mock
                var functionImportMock = {};
                functionImportMock.entitySet = "entitySet";
                functionImportMock.httpMethod = "POST";
                functionImportMock.name = "functionImport_example";
                functionImportMock.returnType = "namespace.entitySet";
                functionImportMock.parameter = [];
                functionImportMock.parameter[0] = {
                    isKey : true,
                    maxLength : "10",
                    mode : "In",
                    name : "entityTypeProperty_1",
                    nullable : false,
                    type : "Edm.String",
                    "com.sap.vocabularies.Common.v1.Label" : {
                        String : "entity type property 1"
                    }
                };
                functionImportMock.parameter[1] = {
                    maxLength : "255",
                    mode : "In",
                    name : "entityTypeProperty_2",
                    nullable : false,
                    type : "Edm.String",
                    "com.sap.vocabularies.Common.v1.Label" : {
                        String : "entity type property 2"
                    }
                };
                functionImportMock.parameter[2] = {
                    maxLength : "255",
                    name : "entityTypeProperty_3",
                    nullable : true,
                    type : "Edm.String"
                };

                // TEST - first set of tests - all is valid
                var oModelParameterDataMock = {};
                oModelParameterDataMock.metaData = [];
                oModelParameterDataMock.metaData["entityTypeProperty_1"] = "value 1";
                oModelParameterDataMock.metaData["entityTypeProperty_2"] = "value 2";
                oModelParameterDataMock.metaData["entityTypeProperty_3"] = "value 3";
                oModelParameterDataMock.getObject = function() { return this.metaData; }
                oModelParameterDataMock.metaData.hasOwnProperty = function(sKey) { return !!this[sKey]; }
                var result = ActionUtils._validateParametersValue(oModelParameterDataMock, functionImportMock);
                ok(result.missingMandatoryParameters.length === 0);
                ok(result.preparedParameterData["entityTypeProperty_1"] && result.preparedParameterData["entityTypeProperty_1"] === "value 1");
                ok(result.preparedParameterData["entityTypeProperty_2"] && result.preparedParameterData["entityTypeProperty_2"] === "value 2");
                ok(result.preparedParameterData["entityTypeProperty_3"] && result.preparedParameterData["entityTypeProperty_3"] === "value 3");

                // TEST - validate no mandatory parameters missing
                ok(!ActionUtils.mandatoryParamsMissing(oModelParameterDataMock, functionImportMock));

                // TEST - getParameters
                result = ActionUtils.getParameters(oModelParameterDataMock, functionImportMock);
                ok(result["entityTypeProperty_1"] && result["entityTypeProperty_1"] === "value 1");
                ok(result["entityTypeProperty_2"] && result["entityTypeProperty_2"] === "value 2");
                ok(result["entityTypeProperty_3"] && result["entityTypeProperty_3"] === "value 3");

                // TEST - second set of tests - all is valid - 3rd parameter not exist but is nullable so is still valid
                oModelParameterDataMock = {};
                oModelParameterDataMock.metaData = [];
                oModelParameterDataMock.metaData["entityTypeProperty_1"] = "value 1";
                oModelParameterDataMock.metaData["entityTypeProperty_2"] = "value 2";
                oModelParameterDataMock.metaData["entityTypeProperty_3"] = "";
                oModelParameterDataMock.getObject = function() { return this.metaData; }
                oModelParameterDataMock.metaData.hasOwnProperty = function(sKey) { return this[sKey] !== undefined; }
                result = ActionUtils._validateParametersValue(oModelParameterDataMock, functionImportMock);
                ok(result.missingMandatoryParameters.length === 0);
                ok(result.preparedParameterData["entityTypeProperty_1"] && result.preparedParameterData["entityTypeProperty_1"] === "value 1");
                ok(result.preparedParameterData["entityTypeProperty_2"] && result.preparedParameterData["entityTypeProperty_2"] === "value 2");

                // TEST - validate no mandatory parameters missing
                ok(!ActionUtils.mandatoryParamsMissing(oModelParameterDataMock, functionImportMock));

                // TEST - getParameters
                result = ActionUtils.getParameters(oModelParameterDataMock, functionImportMock);
                ok(result["entityTypeProperty_1"] && result["entityTypeProperty_1"] === "value 1");
                ok(result["entityTypeProperty_2"] && result["entityTypeProperty_2"] === "value 2");
                ok(!result["entityTypeProperty_3"]);

                // TEST - third set of tests - one missing mandatory parameter
                oModelParameterDataMock = {};
                oModelParameterDataMock.metaData = [];
                oModelParameterDataMock.metaData["entityTypeProperty_1"] = "value 1";
                oModelParameterDataMock.metaData["entityTypeProperty_2"] = "";
                oModelParameterDataMock.metaData["entityTypeProperty_3"] = "";
                oModelParameterDataMock.getObject = function() { return this.metaData; }
                oModelParameterDataMock.metaData.hasOwnProperty = function(sKey) { return this[sKey] !== undefined; }
                result = ActionUtils._validateParametersValue(oModelParameterDataMock, functionImportMock);
                ok(result.preparedParameterData["entityTypeProperty_1"] && result.preparedParameterData["entityTypeProperty_1"] === "value 1");
                ok(result.missingMandatoryParameters.length === 1);
                ok(result.missingMandatoryParameters[0].name === "entityTypeProperty_2");

                // TEST - validate no mandatory parameters missing
                ok(ActionUtils.mandatoryParamsMissing(oModelParameterDataMock, functionImportMock));

                // TEST - getParameters
                result = ActionUtils.getParameters(oModelParameterDataMock, functionImportMock);
                ok(result["entityTypeProperty_1"] && result["entityTypeProperty_1"] === "value 1");
                ok(!result["entityTypeProperty_2"]);
                ok(!result["entityTypeProperty_3"]);
            });

            test("Action Utils - buildParametersForm ", function() {

                var actionData = {};
                actionData.allParameters = [];
                actionData.allParameters[0] = {
                    isKey : true,
                    maxLength : "10",
                    mode : "In",
                    name : "entityTypeProperty_1",
                    nullable : false,
                    type : "Edm.String",
                    "com.sap.vocabularies.Common.v1.Label" : {
                        String : "entity type property 1"
                    }
                };
                actionData.allParameters[1] = {
                    maxLength : "255",
                    mode : "In",
                    name : "entityTypeProperty_2",
                    nullable : false,
                    type : "Edm.String",
                    "com.sap.vocabularies.Common.v1.Label" : {
                        String : "entity type property 2"
                    }
                };
                actionData.allParameters[2] = {
                    maxLength : "255",
                    name : "entityTypeProperty_3",
                    nullable : true,
                    type : "Edm.String"
                };

                // TEST - build the parameters form according to the actionData passed
                var result = ActionUtils.buildParametersForm(actionData);
                ok(result);

                // validating form's content
                var formContent = result.getContent();
                ok(formContent && formContent.length === 6);

                ok(formContent[0].getProperty('text') === "entity type property 1");
                ok(formContent[1].getProperty('mandatory') == true);
                ok(formContent[1].getProperty('maxLength') == 10);

                ok(formContent[2].getProperty('text') === "entity type property 2");
                ok(formContent[3].getProperty('mandatory') == true);
                ok(formContent[3].getProperty('maxLength') == 255);

                ok(formContent[4].getProperty('text') === "entityTypeProperty_3");
                ok(formContent[5].getProperty('mandatory') == false);
                ok(formContent[5].getProperty('maxLength') == 255);

            });

            test("Action Utils - _getKeyProperties tests", function () {
                var cardTestData = {
                    card: {
                        "id": "card_11",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.list",
                        "settings": {
                            "entitySet": "SalesOrderSet",
                            "category": "Static Category",
                            "title": "Static Title",
                            "description": "Static Description"
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations.xml"
                    },
                    expectedResult: {
                        key : {
                            SalesOrderID: true
                        }
                    }
                };
                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {
                    start();
                    var metaModel = oModel.getMetaModel();
                    var entitySet = metaModel.getODataEntitySet("SalesOrderSet");
                    var entityType = metaModel.getODataEntityType(entitySet.entityType);

                    var oKeyMap = ActionUtils._getKeyProperties(entityType);

                    deepEqual(oKeyMap, cardTestData.expectedResult.key)

                });
            });

            test("Action Utils - _getKeyProperties tests (more then one key)", function () {
                var cardTestData = {
                    card: {
                        "id": "card_11",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.list",
                        "settings": {
                            "entitySet": "SalesOrderLineItemSet",
                            "category": "Static Category",
                            "title": "Static Title",
                            "description": "Static Description"
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations.xml"
                    },
                    expectedResult: {
                        key : {
                            SalesOrderID: true,
                            ItemPosition: true
                        }
                    }
                };
                var oModel = utils.createCardModel(cardTestData);
                stop();
                oModel.getMetaModel().loaded().then(function () {
                    start();
                    var metaModel = oModel.getMetaModel();
                    var entitySet = metaModel.getODataEntitySet("SalesOrderLineItemSet");
                    var entityType = metaModel.getODataEntityType(entitySet.entityType);

                    var oKeyMap = ActionUtils._getKeyProperties(entityType);

                    deepEqual(oKeyMap, cardTestData.expectedResult.key)

                });
            });

            test("Action Utils - _addParamLabel tests", function () {
                var cardTestData = {
                    card: {
                        "id": "card_11",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.list",
                        "settings": {
                            "entitySet": "SalesOrderSet",
                            "category": "Static Category",
                            "title": "Static Title",
                            "description": "Static Description"
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations.xml"
                    },
                    expectedResult: {}
                };
                var oModel = utils.createCardModel(cardTestData);
                stop();

                oModel.getMetaModel().loaded().then(function () {
                    start();
                    var metaModel = oModel.getMetaModel();
                    var entitySet = metaModel.getODataEntitySet("SalesOrderSet");
                    var entityType = metaModel.getODataEntityType(entitySet.entityType);
                    var oParameter = {name: "SalesOrderID"};

                    ActionUtils._addParamLabel(oParameter, entityType, metaModel);

                    equal(oParameter["com.sap.vocabularies.Common.v1.Label"].String, "Sa. Ord. ID")

                });
            });

            test("Action Utils - _addParamLabel tests (No label)", function () {
                var cardTestData = {
                    card: {
                        "id": "card_11",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.list",
                        "settings": {
                            "entitySet": "SalesOrderSet",
                            "category": "Static Category",
                            "title": "Static Title",
                            "description": "Static Description"
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations.xml"
                    },
                    expectedResult: {}
                };
                var oModel = utils.createCardModel(cardTestData);
                stop();

                oModel.getMetaModel().loaded().then(function () {
                    start();
                    var metaModel = oModel.getMetaModel();
                    var entitySet = metaModel.getODataEntitySet("SalesOrderSet");
                    var entityType = metaModel.getODataEntityType(entitySet.entityType);
                    var oParameter = {name: "SalesOrderNoLabelTest"};

                    ActionUtils._addParamLabel(oParameter, entityType, metaModel);

                    ok(!oParameter.hasOwnProperty("com.sap.vocabularies.Common.v1.Label"));
                    ok(!oParameter.hasOwnProperty("sap:label"));

                });
            });

            test("Action Utils - getActionInfo tests", function () {
                var cardTestData = {
                    card: {
                        "id": "card_11",
                        "model": "salesOrder",
                        "template": "sap.ovp.cards.quickview",
                        "settings": {
                            "entitySet": "ContactSet",
                            "entityPath": "(guid'0050568D-393C-1EE4-9882-CEC33E1530CD')",
                            "category": "Static Category",
                            "title": "Static Title",
                            "description": "Static Description"
                        }
                    },
                    dataSource: {
                        baseUrl: utils.odataBaseUrl_salesOrder,
                        rootUri: utils.odataRootUrl_salesOrder,
                        annoUri: utils.testBaseUrl + "data/annotations.xml"
                    },
                    expectedResult: {}
                };
                var oModel = utils.createCardModel(cardTestData);
                stop();

                oModel.getMetaModel().loaded().then(function () {

                    start();

                    var metaModel = oModel.getMetaModel();
                    var entitySet = metaModel.getODataEntitySet("SalesOrderSet");
                    var entityType = metaModel.getODataEntityType(entitySet.entityType);
                    var contextMock = new utils.ContextMock({
                        model: oModel,
                        object:{"SalesOrderID":"12345679"}
                    });
                    var actionMock = {
                        action:"GWSAMPLE_BASIC.GWSAMPLE_BASIC_Entities/SalesOrder_Confirm",
                        label:"Confirm"
                    };

                    var actionData = ActionUtils.getActionInfo(contextMock, actionMock, entityType);
                    var sFunctionName = actionMock.action.split('/')[1];
                    var functionImport = metaModel.getODataFunctionImport(sFunctionName);

                    equal(actionData.sFunctionImportPath, "GWSAMPLE_BASIC.GWSAMPLE_BASIC_Entities/SalesOrder_Confirm");
                    equal(actionData.parameterData.SalesOrderID, "12345679");
                    deepEqual(actionData.oFunctionImport, functionImport);
                    ok(actionData.allParameters.length == 1);
                    ok(actionData.parameterData.hasOwnProperty("SalesOrderID"));

                });
            });


            /*
             unhandled methods

             ActionUtils.getActionInfo
             */

        });