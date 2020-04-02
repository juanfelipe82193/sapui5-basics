/**
 * 
 */
/*global OData */
jQuery.sap.registerModulePath('sap.apf.testhelper', '../../testhelper');
jQuery.sap.require('sap.apf.testhelper.authTestHelper');
jQuery.sap.require('sap.apf.testhelper.modelerHelper');
jQuery.sap.require('sap.apf.testhelper.helper');
jQuery.sap.require('sap.apf.testhelper.doubles.messageHandler');
jQuery.sap.require('sap.apf.modeler.core.instance');
jQuery.sap.require('sap.apf.utils.hashtable');
jQuery.sap.require('sap.apf.modeler.ui.utils.textPoolHelper');
jQuery.sap.require('sap.apf.ui.utils.constants');
jQuery.sap.require('sap.apf.core.odataRequest');
jQuery.sap.require('sap.apf.utils.utils');
jQuery.sap.registerModulePath('sap.apf.internal', '../../internal');
jQuery.sap.require('sap.apf.internal.server.userData');
(function() {
	'use strict';
	//var WCAType = "DPO";             //Choose either DSO or DPO
	var WCAType = "DSO"; //Choose either DSO or DPO
	QUnit
	.module(
			"Setup " + WCAType,
			{
				appA : {
					ApplicationName : WCAType + " - Created by Converter on " + new Date(),
					SemanticObject : "SemanticObjectName"
				},
				beforeEach : function(assert) {
					var done = assert.async();
					var that = this;
					that.loadDataFromFile = function(url) {
						var returnValue;
						jQuery.ajax({
							url : url,
							dataType : "json",
							success : function(data) {
								returnValue = data;
							},
							error : function(oJqXHR, sStatus, sError) {
								assert.ok(false, "Error when retrieving data from: " + url);
								done();
							},
							async : false
						});
						return returnValue;
					};
					that.getTextKeyObjectsFromConfiguration = function getTextKeysFromConfiguration(configuration, path) {
						var resultValue = [], newPath;
						if (configuration.type && configuration.type === "label" && configuration.kind && configuration.kind === "text" && configuration.key) {
							return [ {
								key : configuration.key,
								path : path
							} ];
						}
						for( var item in configuration) {
							if (typeof configuration[item] !== "object" || !configuration.hasOwnProperty(item)) {
								continue;
							}
							if (parseInt(item, 10) + 1) {
								newPath = path;
							} else {
								newPath = path + "." + item;
							}
							Array.prototype.push.apply(resultValue, getTextKeysFromConfiguration(configuration[item], newPath));
						}
						return resultValue;
					};
					that.setTextKeysInConfiguration = function setTextKeysFromConfiguration(configuration, textKeyMapping) {
						var mappedText;
						if (configuration.type && configuration.type === "label" && configuration.kind && configuration.kind === "text" && configuration.key) {
							mappedText = textKeyMapping.getItem(configuration.key);
							if (!mappedText || !mappedText.TextElement) {
								assert.ok(false, "Key " + configuration.key + " could not be mapped.");
								return;
							}
							configuration.key = mappedText.TextElement;
						} else {
							for( var item in configuration) {
								if (typeof configuration[item] !== "object" || !configuration.hasOwnProperty(item)) {
									continue;
								}
								setTextKeysFromConfiguration(configuration[item], textKeyMapping);
							}
						}
					};
					that.getTextElementsFromResourceBundle = function(textKeyObjects) {
						var that = this, resultValue = [];
						textKeyObjects.forEach(function(textKeyObject) {
							if (!textKeyObject) {
								return;
							}
							var text = that.originalBundle.getText(textKeyObject.key);
							resultValue.push(that.createTextElement(text, that.getTextFormatFromPath(textKeyObject.path)));
						});
						return resultValue;
					};
					that.createTextElement = function(textElementDescription, format) {
						var that = this;
						return {
							TextElement : "", //key should be filled automatically
							Language : sap.apf.core.constants.developmentLanguage,
							TextElementType : format.TextElementType,
							TextElementDescription : textElementDescription,
							MaximumLength : format.MaximumLength || 10,
							Application : that.applicationCreatedForTest,
							TranslationHint : format.TranslationHint || ""
						};
					};
					that.getTextFormatFromPath = function(path) {
						var resultValue, formatForDate = {
								TextElementType : "XFLD",
								MaximumLength : 20
						}, formatForProperty = {
								TextElementType : "XFLD",
								MaximumLength : 40
						};
						switch (path) {
						case ".steps.title":
							resultValue = sap.apf.modeler.ui.utils.TranslationFormatMap.STEP_TITLE;
							break;
						case ".steps.longTitle":
							resultValue = sap.apf.modeler.ui.utils.TranslationFormatMap.STEP_LONG_TITLE;
							break;
						case ".steps.thumbnail.leftLower":
							resultValue = sap.apf.modeler.ui.utils.TranslationFormatMap.STEP_CORNER_TEXT;
							break;
						case ".steps.thumbnail.leftUpper":
							resultValue = sap.apf.modeler.ui.utils.TranslationFormatMap.STEP_CORNER_TEXT;
							break;
						case ".steps.thumbnail.rightLower":
							resultValue = sap.apf.modeler.ui.utils.TranslationFormatMap.STEP_CORNER_TEXT;
							break;
						case ".steps.thumbnail.rightUpper":
							resultValue = sap.apf.modeler.ui.utils.TranslationFormatMap.STEP_CORNER_TEXT;
							break;
						case ".categories.label":
							resultValue = sap.apf.modeler.ui.utils.TranslationFormatMap.CATEGORY_TITLE;
							break;
						case ".facetFilters.label":
							resultValue = sap.apf.modeler.ui.utils.TranslationFormatMap.FACETFILTER_LABEL;
							break;
						case ".bindings.representations.parameter.fromDateLabel":
							resultValue = formatForDate;
							break;
						case ".bindings.representations.parameter.toDateLabel":
							resultValue = formatForDate;
							break;
						case ".bindings.representations.parameter.measures.fieldDesc":
							resultValue = formatForProperty;
							break;
						case ".bindings.representations.parameter.dimensions.fieldDesc":
							resultValue = formatForProperty;
							break;
						default:
							if (path.indexOf(".bindings.representations.parameter.") === 0) {
								resultValue = formatForProperty;
							} else {
								assert.ok(false, "Could not determine format for path " + path);
							}
						break;
						}
						return resultValue;
					};
					that.generateBatchRequest = function(aCreateEntries) {
						var deferred = jQuery.Deferred();
						this.modelerCore.getXsrfToken(this.serviceRoot).done(function(sXsrfToken){
							var i, len, aChangeRequests = [], oBatchRequest;
							len = aCreateEntries.length;
							for(i = 0; i < len; i++) {
								var oChangeRequest = {
										requestUri : 'TextElementQueryResults',
										method : "POST",
										data : aCreateEntries[i],
										headers : {
											"Accept-Language" : sap.ui.getCore().getConfiguration().getLanguage(),
											"x-csrf-token" : sXsrfToken
										}
								};
								aChangeRequests.push(oChangeRequest);
							}
							oBatchRequest = {
									requestUri : this.serviceRoot + '/' + '$batch',
									method : "POST",
									headers : {
										"x-csrf-token" : sXsrfToken
									},
									data : {
										__batchRequests : [ {
											__changeRequests : aChangeRequests
										} ]
									},
									async : false
							};
							deferred.resolve(oBatchRequest);
						});
						return deferred.promise();
					};
					this.mapTextsFromRessourceBundleToTextPool = function(textKeyObjects) {
						var that = this, result = new sap.apf.utils.Hashtable(this.messageHandler), uniqueTextKeyObjects = [], ht = new sap.apf.utils.Hashtable(this.messageHandler), htPath = new sap.apf.utils.Hashtable(this.messageHandler), oBatchRequest, textElements, i;
						// make textKeyObjects unique and extract unique pathes
						textKeyObjects.forEach(function(textKeyObject) {
							if (textKeyObject.key !== sap.apf.core.constants.textKeyForInitialText && !ht.hasItem(textKeyObject.key)) {
								ht.setItem(textKeyObject.key, textKeyObject);
								htPath.setItem(textKeyObject.path, textKeyObject.path);
								uniqueTextKeyObjects.push(textKeyObject);
							}
						});
						assert.ok(true, uniqueTextKeyObjects.length + " text keys have been extracted from configuration: " + that.analyticalConfiguration.appDescription);
						assert.ok(true, "Formats for extracted text label pathes  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
						// report path mapping
						htPath.each(function(key, value) {
							assert.ok(true, key + " : " + JSON.stringify(that.getTextFormatFromPath(key)));
						});
						assert.ok(true, "<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
						// get texts from text resource bundle
						//uniqueTextKeyObjects = uniqueTextKeyObjects.slice(0,2); // ONLY FOR TESTING remove later
						textElements = this.getTextElementsFromResourceBundle(uniqueTextKeyObjects);
						//POST texts to text pool via oData batch request and retrieve the generated text element keys
						this.generateBatchRequest(textElements).done(function(oBatchRequest){
							var aTexts = [];
							OData.request(oBatchRequest, success, function(error) {
								assert.ok(false, "Error in batch request");
							}, OData.batchHandler);
							assert.equal(aTexts.length, textElements.length, "All " + uniqueTextKeyObjects.length + " text elements have been created in the text pool");
							// Build the text key mapping table
							for(i = 0; i < aTexts.length; i++) {
								result.setItem(uniqueTextKeyObjects[i].key, aTexts[i]);
							}
							return result;
						});
						//>>>>
						function success(data, response) {
							var changeResponse, url = "", i, j;
							if (!data || !data.__batchResponses) {
								return;
							}
							for(i = 0; i < data.__batchResponses.length; i++) {
								if (data.__batchResponses[i].message) {
									var message = data.__batchResponses[i].message;
									var httpStatusCode = "";
									url = response.requestUri;
									that.messageHandler.createMessageObject({
										code : "5001",
										aParameters : [ httpStatusCode, message, "", url ]
									});
									break;
								}
								for(j = 0; j < data.__batchResponses[i].__changeResponses.length; j++) {
									changeResponse = data.__batchResponses[i].__changeResponses[j];
									if (changeResponse.message) {
										var message = changeResponse.message;
										var errorDetails = changeResponse.data;
										var httpStatusCode = changeResponse.statusCode;
										url = response.requestUri;
										that.messageHandler.createMessageObject({
											code : "5001",
											aParameters : [ httpStatusCode, message, errorDetails, url ]
										});
										break;
									} else if (changeResponse.statusCode == "201") {
										aTexts.push(changeResponse.data);
									}
								}
							}
						}
					};
					that.startTime = new Date();
					this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
					this.serviceRoot = "/sap/hba/r/apf/core/odata/modeler/AnalyticalConfiguration.xsodata";
					var url1 = sap.apf.testhelper.determineTestResourcePath() + "/modeler/converter/" + WCAType + "ApplicationConfiguration.json", url2 = sap.apf.testhelper.determineTestResourcePath() + "/modeler/converter/" + WCAType
					+ "AnalyticalConfiguration.json", url3 = sap.apf.testhelper.determineTestResourcePath() + "/modeler/converter/" + WCAType + "Application.properties";
					this.originalBundle = jQuery.sap.resources({
						url : url3,
						includeInfo : sap.ui.getCore().getConfiguration().getOriginInfo()
					});
					this.applicationConfiguration = this.loadDataFromFile(url1).applicationConfiguration;
					this.messageHandler = new sap.apf.testhelper.doubles.MessageHandler().doubleCheckAndMessaging();
					this.analyticalConfiguration = this.loadDataFromFile(url2);
					sap.apf.utils.migrateConfigToCategoryStepAssignment(this.analyticalConfiguration, {
						instances : {
							messageHandler : this.messageHandler
						},
						constructors : {
							Hashtable : sap.apf.utils.Hashtable
						}
					});
					this.analyticalConfiguration.appDescription = that.originalBundle.getText(that.applicationConfiguration.appTitle);
					this.analyticalConfiguration.applicationTitle = {
							type : "label",
							kind : "text",
							key : ""
					};
					that.authTestHelper = new sap.apf.testhelper.AuthTestHelper(done, function() {
						sap.apf.testhelper.modelerHelper.createConfigurationEditor(that, that.appA, that.serviceRoot, function() {
							done();
						}, assert, done);
					});
				},
				afterEach : function() {
				}
			});
	QUnit.test("Convert " + WCAType + " config", function(assert) {
		var done1 = assert.async();
		var that = this;
		assert.ok(true, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
		assert.ok(true, "Application Name: " + that.appA.ApplicationName);
		assert.ok(true, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
		// Translations
		that.analyticalConfiguration.bindings.forEach(function(binding) {
			binding.representations.forEach(function(representation) {
				if (representation.representationTypeId === "ColumnChartSorted" || representation.representationTypeId === "ColumnChartClustered" || representation.representationTypeId === "ColumnChartClusteredSorted") {
					// ColumnChartSorted, ColumnChartClustered, ColumnChartClusteredSorted => ColumnChart.
					representation.representationTypeId = "ColumnChart";
				}
				if (representation.parameter.sort) {
					// sort => orderby.
					representation.parameter.orderby = [];
					representation.parameter.orderby.push({
						property : representation.parameter.sort.sortField,
						ascending : !representation.parameter.sort.descending
					});
				}
			});
		});
		// Text Key Conversion
		var originalTextKeyObjects = that.getTextKeyObjectsFromConfiguration(that.analyticalConfiguration, "" /*InitialPathValue*/);
		var textKeyMapping = that.mapTextsFromRessourceBundleToTextPool(originalTextKeyObjects);
		that.setTextKeysInConfiguration(that.analyticalConfiguration, textKeyMapping);
		// Reload configuration handler and Text Pool from DB.
		that.modelerCore.resetConfigurationHandler();
		that.modelerCore.getConfigurationHandler(that.applicationCreatedForTest, function(configurationHandler, messageObject) {
			var textPool = configurationHandler.getTextPool();
			if (messageObject) {
				assert.ok(false, "Failed to reload the configurationHandler");
				return;
			}
			assert.ok(true, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
			assert.ok(true, "Reload of configurationHandler and Text Pool");
			// Load configuration into configuration editor <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
			var tmpConfigId = "apf1972-toBeReplacedByNewServerId";
			configurationHandler.setConfiguration({
				AnalyticalConfigurationName : that.analyticalConfiguration.appDescription
			}, tmpConfigId);
			var configurationToLoad = {
					id : tmpConfigId,
					creationDate : "", // will be filled by server
					lastChangeDate : "", //will be filled by server
					content : that.analyticalConfiguration
			}, configurationEditor;
			configurationHandler.loadConfiguration(configurationToLoad, callbackLoadConfiguration);
			function callbackLoadConfiguration(configEditor, messageObject) {
				if (messageObject) {
					assert.ok(false, "Error retrieving configuration editor for analytical configuration");
				}
				configurationEditor = configEditor;
			}
			assert.ok(true, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
			assert.ok(true, configurationEditor.getCategories().length + " categories before conversion to internal IDs");
			assert.ok(true, configurationEditor.getSteps().length + " steps before conversion to internal IDs");
			assert.ok(true, configurationEditor.getFacetFilters().length + " facetFilters before conversion to internal IDs");
			assert.ok(true, configurationEditor.getNavigationTargets().length + " navigationTargets after conversion to internal IDs");
			// conversion to internal IDs <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
			// >>> for Categories and everything beneath
			configurationEditor.getCategories().forEach(function(category) {
				var catId = category.getId();
				configurationEditor.copyCategory(catId);
				configurationEditor.removeCategory(catId);
			});
			// >>> for facetFilters
			configurationEditor.getFacetFilters().forEach(function(facetFilter) {
				var facetFilterId = facetFilter.getId();
				configurationEditor.copyFacetFilter(facetFilterId);
				configurationEditor.removeFacetFilter(facetFilterId);
			});
			// >>> for navigation targets
			configurationEditor.getNavigationTargets().forEach(function(navigationTarget) {
				var navigationTargetId = navigationTarget.getId();
				configurationEditor.copyNavigationTarget(navigationTargetId);
				configurationEditor.removeNavigationTarget(navigationTargetId);
			});
			assert.ok(true, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
			assert.ok(true, configurationEditor.getCategories().length + " categories after conversion to internal IDs");
			assert.ok(true, configurationEditor.getSteps().length + " steps after conversion to internal IDs");
			assert.ok(true, configurationEditor.getFacetFilters().length + " facetFilters after conversion to internal IDs");
			assert.ok(true, configurationEditor.getNavigationTargets().length + " navigationTargets after conversion to internal IDs");
			assert.ok(true, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
			// save <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
			textPool.setText(that.analyticalConfiguration.appDescription, sap.apf.modeler.ui.utils.TranslationFormatMap.APPLICATION_TITLE).done(function(textKey){
				configurationEditor.setApplicationTitle(textKey);
				configurationEditor.save(function(configId, metaData, messageObject) {
					if (!messageObject) {
						assert.ok(true, "Application (" + that.applicationCreatedForTest + ") was saved without errors");
						assert.ok(true, "Converted configuration (" + configId + ") was saved without errors");
					} else {
						assert.ok(false, "Error during save");
					}
					assert.ok(true, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
					assert.ok(true, "Runtime: " + (new Date() - that.startTime));
					assert.ok(true, ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
					done1();
				});
			})

		});
	});
}());