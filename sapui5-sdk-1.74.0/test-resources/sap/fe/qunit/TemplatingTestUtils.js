/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2017 SAP SE. All rights reserved
    
 */
/* global XPathResult */
sap.ui.define(
	[
		"sap/ui/model/odata/v4/ODataMetaModel",
		"sap/ui/core/util/XMLPreprocessor",
		"sap/ui/core/XMLTemplateProcessor",
		"sap/fe/macros/macroLibrary"
	],
	function(ODataMetaModel, XMLPreprocessor, XMLTemplateProcessor, macroLibrary) {
		"use strict";

		//Switch of all plugins as we only template individual fragments in the test
		macroLibrary.deregister();

		/**
		 * Unit Test parts of XML fragments for mocked metadata against expected results
		 * @param {Object} QUnit Global Qunit Object
		 * @param {String} sTitle A title as QUnit needs unique module titles
		 * @param {Object} oMetaMockData A javascript object as defined by sap.ui.model.odata.v4.lib._Requestor.read
		 * @param {*} aFragmentTests An array that specifies the fragments and the elements that should be tested
		 * 							 and the expected results as defined here:
		 *  [
		 * 	{
		 * 		sFragmentName: "sap.fe.templates.ObjectPage.view.fragments.HeaderProgressIndicator",
		 * 		mModels: { //global models for the test e.g. ResourceBundles processed during templating
		 * 			"some.libs.i18n": new ResourceBundle(...)
		 * 		},
		 * 		tests: [
		 * 			{
		 * 				mBindingContexts: { //All contexts (metadata and others) that are used in the fragment
		 *			 		"someContext": "/someEntitySet/@someTerm#someQualifier"
		 * 					"someEntityType": "/someEntitySet/"
		 *		 	},
		 * 			oExpectedResultsPerTest:  { // expected attribute values per qunittest:id
		 * 				"a": { //Attributes of the element marked as qunittest:id="a"
		 * 					"someAttribute": "{PropertyInt16} of {PropertyInt32}",
		 *  				"otherAttribute": "{= ((${PropertyInt32} > 0) ? ((${PropertyInt16} > ${PropertyInt32}) ? 100 : ((${PropertyInt16} < 0) ? 0 : (${PropertyInt16} / ${PropertyInt32} * 100))) : 0) }"
		 * 				},
		 * 				"b": { //Attributes of the element marked as qunittest:id="b"
		 * 					"someAttribute": "Property of Type Int16"
		 * 				}
		 * 			}
		 * 		}
		 * 	}
		 * 	]
		 */
		function testFragments(QUnit, sTitle, oMetaMockData, aFragmentTests) {
			var sServiceUrl = "./test/",
				//Mock the requestor for metadata only
				oRequestor = {
					read: function() {
						return Promise.resolve(oMetaMockData);
					},
					mHeaders: {}
				},
				oMetaModel = new ODataMetaModel(oRequestor, sServiceUrl + "$metadata", undefined, null);

			function templateFragment(assert, oDocumentElement, mBindingContexts, mModels) {
				var oPreprocessorSettings = {
					models: Object.assign({}, mModels),
					bindingContexts: {}
				};

				//Inject models and bindingContexts
				Object.keys(mBindingContexts).forEach(function(sKey) {
					/* Assert to make sure the annotations are in the test metadata -> avoid misleading tests */
					assert.ok(
						typeof oMetaModel.getObject(mBindingContexts[sKey]) !== "undefined",
						sKey + ": " + mBindingContexts[sKey] + " exists"
					);
					oPreprocessorSettings.bindingContexts[sKey] = oMetaModel.createBindingContext(mBindingContexts[sKey]); //Value is sPath
					oPreprocessorSettings.models[sKey] = oMetaModel; //We are all metaModels
				});

				//This context for macro testing
				if (oPreprocessorSettings.models["this"]) {
					oPreprocessorSettings.bindingContexts["this"] = oPreprocessorSettings.models["this"].createBindingContext("/");
				}

				return XMLPreprocessor.process(oDocumentElement, {}, oPreprocessorSettings);
			}

			QUnit.module("Smoke Tests for " + sTitle);

			QUnit.test("Check if metadata is available", function(assert) {
				return Promise.all([
					oMetaModel.requestObject("/").then(function(oEntityContainer) {
						assert.ok(oEntityContainer, "Entity Container found");
					}),
					oMetaModel.requestObject("/$").then(function(oMetadataDocument) {
						assert.ok(oMetadataDocument, "Metadata Document found");
					})
				]);
			});

			/*
				Test expressions in fragments
			*/
			function fragmentTest(oFragment) {
				oFragment.fileType = oFragment.fileType || "fragment";
				QUnit.module(
					"Tests for " +
						sTitle +
						" against " +
						oFragment.fileType +
						" " +
						oFragment.sFragmentName +
						(oFragment.sDescription ? " (" + oFragment.sDescription + ")" : "")
				);

				oFragment.tests.forEach(function(oScope, index) {
					QUnit.test(oScope.description || "Test " + oFragment.fileType + " scope: " + index, function(assert) {
						return oMetaModel
							.requestObject("/$")
							.then(function() {
								return XMLTemplateProcessor.loadTemplatePromise(oFragment.sFragmentName, oFragment.fileType);
							})
							.then(function(oDocumentElement) {
								return templateFragment(
									assert,
									oDocumentElement,
									oScope.mBindingContexts,
									Object.assign({}, oFragment.mModels, oScope.mModels)
								);
							})
							.then(function(oDocumentElement) {
								var nsResolver = document.createNSResolver(oDocumentElement),
									iElements = oDocumentElement.ownerDocument.evaluate(
										"//*[@unittest:id]",
										oDocumentElement.ownerDocument,
										nsResolver,
										XPathResult.ANY_TYPE,
										null
									),
									oElement = iElements.iterateNext(),
									sTestId,
									iNumberOfTestsPerformed = 0;

								function testAttributes(oElement, oExpectedResults, sTestId) {
									function testSingleAttribute(sAttributeName) {
										if (oExpectedResults[sAttributeName] === undefined) {
											assert.ok(
												!oElement.hasAttribute(sAttributeName),
												'unittest:id="' +
													sTestId +
													"\": attribute '" +
													sAttributeName +
													"' is expected not to be rendered"
											);
										} else {
											var sResult = oElement.getAttribute(sAttributeName);
											assert.strictEqual(
												sResult,
												oExpectedResults[sAttributeName],
												'unittest:id="' +
													sTestId +
													"\": attribute '" +
													sAttributeName +
													"' properly created as " +
													sResult
											);
										}
									}
									if (oExpectedResults) {
										iNumberOfTestsPerformed++;
										Object.keys(oExpectedResults).forEach(testSingleAttribute);
									}
								}

								while (oElement) {
									sTestId = oElement.getAttribute("unittest:id");
									testAttributes(oElement, oScope.oExpectedResultsPerTest[sTestId], sTestId);
									oElement = iElements.iterateNext();
								}

								assert.equal(
									iNumberOfTestsPerformed,
									Object.keys(oScope.oExpectedResultsPerTest).length,
									"All tests have been executed for this test case"
								);
							})
							.catch(function(vException) {
								var sExpectedException = oScope.sExpectedException;
								if (vException && sExpectedException) {
									assert.strictEqual(
										vException.message || vException,
										sExpectedException,
										"expected exception occurred: " + sExpectedException
									);
								} else {
									throw vException;
								}
							});
					});
				});
			}

			//Run the tests
			aFragmentTests.forEach(fragmentTest);
		}

		return {
			testFragments: testFragments
		};
	}
);
