sap.ui.define(
	["sap/ui/thirdparty/sinon", "sap/fe/core/model/DraftModel", "local/mockServerHelper", "sap/ui/util/XMLHelper", "sap/base/Log"],
	function(sinon, DraftModel, mockServerHelper, XMLHelper, Log) {
		"use strict";

		/* Borrow definitions from DraftModel to avoid code duplications */

		function filterEditState(sEditState, aData) {
			switch (sEditState) {
				case DraftModel.EDITSTATE.ALL:
					return aData;
				case DraftModel.EDITSTATE.UNCHANGED:
					return aData.filter(function(oEntry) {
						return oEntry.IsActiveEntity && !oEntry.HasDraftEntity;
					});
				case DraftModel.EDITSTATE.OWN_DRAFT:
					return aData.filter(function(oEntry) {
						return !oEntry.IsActiveEntity;
					});
				case DraftModel.EDITSTATE.LOCKED:
					return aData.filter(function(oEntry) {
						return (
							oEntry.IsActiveEntity && oEntry.DraftAdministrativeData && oEntry.DraftAdministrativeData.InProcessByUser !== ""
						);
					});
				case DraftModel.EDITSTATE.UNSAVED_CHANGES:
					return aData.filter(function(oEntry) {
						return (
							oEntry.IsActiveEntity && oEntry.DraftAdministrativeData && oEntry.DraftAdministrativeData.InProcessByUser === ""
						);
					});
				default:
					return aData;
			}
		}

		function _getBracketIndices(sString) {
			var aStack = [];
			var bReserved = false;
			var iStartIndex,
				iEndIndex = 0;
			for (var character = 0; character < sString.length; character++) {
				if (sString[character] === "(") {
					if (/[endswith|startswith|contains]$/.test(sString.substring(0, character))) {
						bReserved = true;
					} else {
						aStack.push(sString[character]);
						if (iStartIndex === undefined) {
							iStartIndex = character;
						}
					}
				} else if (sString[character] === ")") {
					if (!bReserved) {
						aStack.pop();
						iEndIndex = character;
						if (aStack.length === 0) {
							return {
								start: iStartIndex,
								end: iEndIndex
							};
						}
					} else {
						bReserved = false;
					}
				}
			}
			return {
				start: iStartIndex,
				end: iEndIndex
			};
		}

		function trim(sString) {
			return sString && sString.replace(/^\s+|\s+$/g, "");
		}

		function escapeStringForRegExp(sString) {
			return sString.replace(/[\\\/\[\]\{\}\(\)\-\*\+\?\.\^\$\|]/g, "\\$&");
		}

		function arrayUnique(array) {
			var a = array.concat();
			for (var i = 0; i < a.length; ++i) {
				for (var j = i + 1; j < a.length; ++j) {
					if (a[i] === a[j]) {
						a.splice(j--, 1);
					}
				}
			}
			return a;
		}

		function recursiveOdataQueryFilter(aDataSet, sODataQueryValue) {
			if (sODataQueryValue) {
				// check for wrapping brackets, e.g. (A), (A op B), (A op (B)), (((A)))
				var oIndices = _getBracketIndices(sODataQueryValue);
				if (oIndices.start === 0 && oIndices.end === sODataQueryValue.length - 1) {
					sODataQueryValue = trim(sODataQueryValue.substring(oIndices.start + 1, oIndices.end));
					return recursiveOdataQueryFilter(aDataSet, sODataQueryValue);
				}

				// find brackets that are not related to the reserved words
				var rExp = /([^endswith|startswith|contains]|^)\((.*)\)/,
					aSet2,
					aParts;

				var sOperator;
				if (rExp.test(sODataQueryValue)) {
					var sBracketed = sODataQueryValue.substring(oIndices.start, oIndices.end + 1);
					var rExp1 = new RegExp("(.*) +(or|and) +(" + trim(escapeStringForRegExp(sBracketed)) + ".*)");
					if (oIndices.start === 0) {
						rExp1 = new RegExp("(" + trim(escapeStringForRegExp(sBracketed)) + ") +(or|and) +(.*)");
					}

					var aExp1Parts = rExp1.exec(sODataQueryValue);
					// remove brackets around values
					if (aExp1Parts === null) {
						sODataQueryValue = sODataQueryValue.replace(/[\(\)]/g, "");
						return filterData(aDataSet, trim(sODataQueryValue));
					}
					var sExpression = aExp1Parts[1];
					sOperator = aExp1Parts[2];
					var sExpression2 = aExp1Parts[3];

					var aSet1 = recursiveOdataQueryFilter(aDataSet, sExpression);
					if (sOperator === "or") {
						aSet2 = recursiveOdataQueryFilter(aDataSet, sExpression2);
						return arrayUnique(aSet1.concat(aSet2));
					}
					if (sOperator === "and") {
						return recursiveOdataQueryFilter(aSet1, sExpression2);
					}
				} else {
					//there are only brackets with the reserved words
					// e.g. A or B and C or D
					aParts = sODataQueryValue.split(/ +and | or +/);

					// base case
					if (aParts.length === 1) {
						// IE8 handling
						if (sODataQueryValue.match(/ +and | or +/)) {
							throw new Error("400");
						}

						return filterData(aDataSet, trim(sODataQueryValue));
					}

					var aResult = recursiveOdataQueryFilter(aDataSet, aParts[0]);
					var rRegExp;
					var fnFilter = function(oEntry) {
						return this.indexOf(oEntry) < 0;
					};
					for (var i = 1; i < aParts.length; i++) {
						rRegExp = new RegExp(
							trim(escapeStringForRegExp(aParts[i - 1])) + " +(and|or) +" + trim(escapeStringForRegExp(aParts[i]))
						);
						sOperator = rRegExp.exec(sODataQueryValue)[1];

						if (sOperator === "or") {
							aSet2 = recursiveOdataQueryFilter(aDataSet, aParts[i]);
							aResult = aResult.concat(aSet2.filter(fnFilter, aResult));
						}
						if (sOperator === "and") {
							aResult = recursiveOdataQueryFilter(aResult, aParts[i]);
						}
					}
					return aResult;
				}
			}
		}

		/**
		 * Example considered -
		 * "(startswith(BreakupYear,'2017')) and (startswith(CountryOfOrigin,'IN')) and (IsActiveEntity eq true and SiblingEntity/IsActiveEntity eq null and DraftAdministrativeData/InProcessByUser ne '')"
		 * initial filter array - ["startswith", "BreakupYear,'2017'", " and ", "startswith", "CountryOfOrigin,'IN'", " and ", "IsActiveEntity eq true and SiblingEntity/IsActiveEntity eq null and DraftAdministrativeData/InProcessByUser ne ''"]
		 * --> apply ["startswith", "BreakupYear,'2017'"]
		 * --> apply ["startswith", "CountryOfOrigin,'IN'"]
		 * --> apply ["IsActiveEntity eq true and SiblingEntity/IsActiveEntity eq null and DraftAdministrativeData/InProcessByUser ne ''"]
		 */
		// Extract filters and return filtered data
		function filterData(aData, sODataQueryValue) {
			if (aData.length === 0) {
				return aData;
			}

			var rExp = new RegExp("(.*) (eq|ne|gt|lt|le|ge) (.*)");
			var rExp2 = new RegExp("(endswith|startswith|contains)\\((.*)\\)(.*)");
			var sODataFilterMethod = null;
			var aODataFilterValues = rExp.exec(sODataQueryValue);
			if (aODataFilterValues) {
				sODataFilterMethod = aODataFilterValues[2];
			} else {
				aODataFilterValues = rExp2.exec(sODataQueryValue);
				if (aODataFilterValues) {
					sODataFilterMethod = aODataFilterValues[1];
				}
			}

			// startsWith
			if (sODataFilterMethod === "startswith" || sODataFilterMethod === "contains" || sODataFilterMethod === "endswith") {
				var aKeyValue = aODataFilterValues[2].split(",");
				// remove quotes from value
				if (typeof aKeyValue[1] === "string" && aKeyValue[1].indexOf("'") === 0) {
					aKeyValue[1] = aKeyValue[1].slice(1, -1);
				}
				switch (sODataFilterMethod) {
					case "contains":
						return aData.filter(function(oEntry) {
							// return false if not found
							return oEntry.hasOwnProperty(aKeyValue[0]) ? oEntry[aKeyValue[0]].toString().includes(aKeyValue[1]) : false;
						});
					case "startswith":
						return aData.filter(function(oEntry) {
							// return false if not found
							return oEntry.hasOwnProperty(aKeyValue[0]) ? oEntry[aKeyValue[0]].toString().startsWith(aKeyValue[1]) : false;
						});
					default:
						//endswith
						return aData.filter(function(oEntry) {
							// return false if not found
							return oEntry.hasOwnProperty(aKeyValue[0]) ? oEntry[aKeyValue[0]].toString().endsWith(aKeyValue[1]) : false;
						});
				}
			}

			//eq, ne
			if (sODataFilterMethod === "eq") {
				return aData.filter(function(oEntry) {
					// return false if not found
					return oEntry.hasOwnProperty(aODataFilterValues[1])
						? oEntry[aODataFilterValues[1]].toString() === aODataFilterValues[3].match(/'([^']+)'/)[1]
						: false;
				});
			}
			if (sODataFilterMethod === "ne") {
				return aData.filter(function(oEntry) {
					// return false if not found
					return oEntry.hasOwnProperty(aODataFilterValues[1])
						? oEntry[aODataFilterValues[1]].toString() !== aODataFilterValues[3].match(/'([^']+)'/)[1]
						: false;
				});
			}

			return aData;
		}

		function searchData(sValue, aData, aSearchableProperties) {
			return aData.filter(function(oEntry) {
				var aKeys = Object.keys(oEntry),
					bHit = false;
				aKeys.forEach(function(sKey) {
					if (oEntry[sKey] && aSearchableProperties.indexOf(sKey) > -1 && oEntry[sKey].indexOf(sValue) > -1) {
						bHit = true;
						return;
					}
				});
				return bHit;
			});
		}

		function sortData(sFieldName, aData, aSearchableProperties, bDesc) {
			if (aSearchableProperties.indexOf(sFieldName) === -1) {
				// data type 'number'
				aData.sort(function(oEntry1, oEntry2) {
					return oEntry2[sFieldName] - oEntry1[sFieldName];
				});
			} else {
				// data type 'string'
				aData.sort(function(oEntry1, oEntry2) {
					return oEntry1[sFieldName].localeCompare(oEntry2[sFieldName]);
				});
			}
			if (bDesc) {
				return aData.reverse();
			}
			return aData;
		}

		function logMockedRequests(url) {
			var aParts = url.split("?");
			Log.info(
				"sap.fe mock-served url: " + aParts[0],
				aParts[1] && "\n\t" + aParts[1].replace(/[\&]/g, "\n\t"),
				"sap.fe.demokit.MockServer"
			);
		}

		//Getting JSON data and applying parameters
		function fnGetResponseData(sUrl, oApp) {
			for (var i = 0; i < oApp.mockDataSets.length; i++) {
				if (sUrl.indexOf(oApp.mockDataSets[i]) > -1) {
					var oFilteredData = Object.assign({}, JSON.parse(oApp.mockData[oApp.mockDataSets[i]])),
						oParams = jQuery.sap.getUriParameters(sUrl),
						sKey;
					//filter
					if (sUrl.indexOf("$filter") > -1) {
						var sFilterString = oParams.get("$filter");

						// check edit state filter
						var sFilter, sEditState, sEditStateKey, aEditState;
						aEditState = Object.keys(DraftModel.EDITSTATE);
						for (var i = 0; i < aEditState.length; i++) {
							sFilter = DraftModel._getFilterForEditState(i.toString());
							if (sFilterString.indexOf(sFilter) > -1) {
								sEditStateKey = aEditState[i];
								break;
							}
						}
						if (sEditStateKey) {
							sEditState = DraftModel.EDITSTATE[sEditStateKey];
						}
						sFilter = DraftModel._getFilterForEditState(sEditState);
						sFilterString = sFilterString.replace(sFilter, "");

						//remove unwanted filters caused becuase of removal of draft filters
						sFilterString = sFilterString.replace(/ and \(+\)+/, "");
						// filter based on edit state
						oFilteredData.value = filterEditState(sEditState, oFilteredData.value);

						if (sFilterString) {
							// incase there is a filter string then only filter data
							oFilteredData.value = recursiveOdataQueryFilter(oFilteredData.value, sFilterString);
						}
					}

					if (sUrl.indexOf("v4_gw_sample_basic.v0001.ET-PRODUCT") > -1) {
						sKey = sUrl.match(/v4_gw_sample_basic.v0001.ET-PRODUCT.(.*?)%/)[1];
					} else if (sUrl.indexOf("sadl_srvd.sadl_gw_appmusicro_definition.v0001.et-c_mdbu_v4_artist.name") > -1) {
						// Name in field has search template
						sKey = sUrl.match(/sadl_srvd.sadl_gw_appmusicro_definition.v0001.et-c_mdbu_v4_artist.name\%27\/(.*?)\?/)[1];
					} else if (sUrl.indexOf("sadl_srvd.sadl_gw_appmusicro_definition.v0001.et-c_mdbu_v4_artist") > -1) {
						sKey = sUrl.match(/sadl_srvd.sadl_gw_appmusicro_definition.v0001.et-c_mdbu_v4_artist.(.*?)%/)[1];
					} else if (sUrl.indexOf("srvd.sadl_gw_appmusicdr_definition.v0001.et-c_mdbu_v4_artisttp") > -1) {
						sKey = sUrl.match(/srvd.sadl_gw_appmusicdr_definition.v0001.et-c_mdbu_v4_artisttp.(.*?)%/)[1];
					}

					//search
					if (sUrl.indexOf("$search") > -1) {
						var sSearchString = oParams.get("$search"),
							sEntitySet = sUrl.match(/\/[a-zA-Z0-9\_]+\?/g),
							sEntityType,
							aSearchableProperties;

						// remove the '/' and '?'
						sEntitySet = sEntitySet[0].slice(1, -1);

						// get the entity type for the concerned entity set of this service request
						if (sKey) {
							sEntityType = oApp.entitySetToTypeMap[sKey][sEntitySet];
							aSearchableProperties = oApp.searchableProperties[sKey][sEntityType];
						} else {
							sEntityType = oApp.entitySetToTypeMap[sEntitySet];
							aSearchableProperties = oApp.searchableProperties[sEntityType];
						}

						oFilteredData.value = searchData(sSearchString, oFilteredData.value, aSearchableProperties);
					}
					//sort
					if (sUrl.indexOf("$orderby") > -1) {
						var bDesc = false;
						if (sUrl.indexOf("desc") > -1) {
							bDesc = true;
						}
						var sOrderByString = oParams.get("$orderby"),
							sEntitySet = sUrl.match(/\/[a-zA-Z0-9\_]+\?/g),
							sEntityType,
							aSearchableProperties;

						// remove the '/' and '?'
						sEntitySet = sEntitySet[0].slice(1, -1);

						// If desc is present, take only the orderby key
						sOrderByString = sOrderByString.split(" ")[0];

						// get the entity type for the concerned entity set of this service request
						if (sKey) {
							sEntityType = oApp.entitySetToTypeMap[sKey][sEntitySet];
							aSearchableProperties = oApp.searchableProperties[sKey][sEntityType];
						} else {
							sEntityType = oApp.entitySetToTypeMap[sEntitySet];
							aSearchableProperties = oApp.searchableProperties[sEntityType];
						}

						oFilteredData.value = sortData(sOrderByString, oFilteredData.value, oApp.searchableProperties[sEntityType], bDesc);
					}

					return oFilteredData;
				}
			}
		}

		// Building string for each GET response in $batch request
		function fnBuildResponseString(oResponse, sContentType) {
			var sResponseData;

			sResponseData = JSON.stringify(oResponse) || "";
			// default the content type to application/json
			sContentType = sContentType || "application/json;ieee754compatible=true;odata.metadata=minimal";

			// if a content type is defined we override the incoming response content type
			return (
				"HTTP/1.1 " +
				"200 OK" +
				"\r\nContent-Type: " +
				sContentType +
				"\r\nContent-Length: " +
				sResponseData.length +
				"\r\nodata-version: 4.0" +
				"\r\ncache-control: no-cache, no-store, must-revalidate\r\n\r\n" +
				sResponseData +
				"\r\n"
			);
		}

		// Response generator,
		// runs once for each app
		function generateResponses(fServer, aAppProcessedParams) {
			Object.keys(aAppProcessedParams).forEach(function(sApp) {
				var oApp = aAppProcessedParams[sApp];
				//Mocking GET requests
				fServer.respondWith("GET", RegExp(oApp.serviceRegex, "i"), function(xhr, id) {
					logMockedRequests(xhr.url);
					if (xhr.url.indexOf("metadata") > -1) {
						// gwsamplebasic extra metadata
						if (xhr.url.indexOf("v4_gw_sample_basic.v0001.ET-PRODUCT.PRODUCT_ID") > -1) {
							return xhr.respond(200, { "Content-Type": "application/xml" }, oApp.extraData["PRODUCT_ID"]);
						}
						if (xhr.url.indexOf("v4_gw_sample_basic.v0001.ET-PRODUCT.CATEGORY") > -1) {
							return xhr.respond(200, { "Content-Type": "application/xml" }, oApp.extraData["CATEGORY"]);
						}
						if (xhr.url.indexOf("v4_gw_sample_basic.v0001.ET-PRODUCT.CURRENCY_CODE") > -1) {
							return xhr.respond(200, { "Content-Type": "application/xml" }, oApp.extraData["CURRENCY_CODE"]);
						}
						// music extra metadata
						if (xhr.url.indexOf("c_aivs_mdbu_publicationtp") > -1) {
							return xhr.respond(200, { "Content-Type": "application/xml" }, oApp.extraData["publications"]);
						}
						if (xhr.url.indexOf("i_aivs_countrycode") > -1) {
							if (xhr.url.indexOf("srvd.sadl_gw_appmusicdr_definition.v0001.et-c_mdbu_v4_artisttp.countryoforigin") > -1) {
								return xhr.respond(200, { "Content-Type": "application/xml" }, oApp.extraData["countryoforigin"]);
							}
							if (xhr.url.indexOf("sadl_srvd.sadl_gw_appmusicro_definition.v0001.et-c_mdbu_v4_artist.countryoforigin") > -1) {
								return xhr.respond(200, { "Content-Type": "application/xml" }, oApp.extraData["countryoforigin"]);
							}
							return xhr.respond(200, { "Content-Type": "application/xml" }, oApp.extraData["country"]);
						}
						if (xhr.url.indexOf("i_aivs_region") > -1) {
							if (xhr.url.indexOf("srvd.sadl_gw_appmusicdr_definition.v0001.et-c_mdbu_v4_artisttp.regionoforigin") > -1) {
								return xhr.respond(200, { "Content-Type": "application/xml" }, oApp.extraData["regionoforigin"]);
							}
							if (xhr.url.indexOf("sadl_srvd.sadl_gw_appmusicro_definition.v0001.et-c_mdbu_v4_artist.regionoforigin") > -1) {
								return xhr.respond(200, { "Content-Type": "application/xml" }, oApp.extraData["regionoforigin"]);
							}
						}
						if (xhr.url.indexOf("i_mdbu_v4_artistperson") > -1) {
							if (xhr.url.indexOf("sadl_srvd.sadl_gw_appmusicro_definition.v0001.et-c_mdbu_v4_artist.name") > -1) {
								return xhr.respond(200, { "Content-Type": "application/xml" }, oApp.extraData["I_MDBU_V4_ArtistPerson"]);
							}
						}
						if (xhr.url.indexOf("i_mdbu_v4_artistname") > -1) {
							if (xhr.url.indexOf("sadl_srvd.sadl_gw_appmusicro_definition.v0001.et-c_mdbu_v4_artist.name") > -1) {
								return xhr.respond(200, { "Content-Type": "application/xml" }, oApp.extraData["I_MDBU_V4_ArtistName"]);
							}
						}
						return xhr.respond(
							200,
							{ "Content-Type": "application/xml", "ETag": oApp.metadataETag, "Last-Modified": oApp.metadataLastModified },
							oApp.metadata
						);
					} else {
						//Getting the JSON data
						var oFilteredData = fnGetResponseData(xhr.url, oApp);
						//Trigger the final response
						return xhr.respond(
							200,
							{ "Content-Type": "application/json", "OData-Version": "4.0" },
							JSON.stringify(oFilteredData)
						);
					}
				});
				//Mocking POST requests
				fServer.respondWith("POST", RegExp(oApp.serviceRegex, "i"), function(xhr, id) {
					logMockedRequests(xhr.url);
					var rBatch = new RegExp("\\$batch([?#].*)?");
					//Check for Batch request
					if (rBatch.test(xhr.url)) {
						var sRequestBody = xhr.requestBody;
						var oBoundaryRegex = new RegExp("--batch_[a-z0-9-]*");
						//Check for boudaries of the request
						var sBoundary = oBoundaryRegex.exec(sRequestBody)[0];
						if (!!sBoundary) {
							//split requests by boundary
							var aBatchRequests = sRequestBody.split(sBoundary);
							var sServiceURL = xhr.url.split("$")[0];
							var rGet = new RegExp("GET (.*) HTTP");
							var sRespondData = "--ejjeeffe0";
							//Processing requests
							aBatchRequests.forEach(function(sBatchRequest, index) {
								//Processing GET requests of the batch
								if (rGet.exec(sBatchRequest)) {
									var sResponseString;
									//Getting JSON Data and creating the Response string
									var oResponse = fnGetResponseData(sServiceURL + rGet.exec(sBatchRequest)[1], oApp);
									if (xhr.url.indexOf("$count") !== -1) {
										sResponseString = fnBuildResponseString(oResponse, "text/plain");
									} else {
										sResponseString = fnBuildResponseString(oResponse);
									}
									sRespondData =
										sRespondData +
										"\r\nContent-Type: application/http\r\n" +
										"Content-Length: " +
										sResponseString.length +
										"\r\n" +
										"content-transfer-encoding: binary\r\n\r\n" +
										sResponseString +
										"--ejjeeffe0";
								}
							});
							sRespondData += "--";
							//Trigger the final response
							return xhr.respond(
								200,
								{ "Content-Type": "multipart/mixed; boundary=ejjeeffe0", "OData-Version": "4.0" },
								sRespondData
							);
						}
					}
				});
			});
		}

		// To check if mock data is defined for an app
		function isAppWithMockData(oApp) {
			return oApp && Array.isArray(oApp.mockDataSets);
		}

		function mockIt() {
			var aManifestPromises = [],
				aDataSourceMetadataPromises = [],
				aDataPromises = [],
				aAppPreProcessingParams = [],
				/**
				 * aExtraPaths needs to be maintained for each request
				 * that does not have its origin in the datasource of the manifest of the apps
				 * For eg. call for extra metadata due to navigation property
				 * in metadata from datasource of the manifest of the app
				 */
				aExtraPaths = [],
				oApps = window["sap-ushell-config"].services.NavTargetResolution.adapter.config.applications,
				oXmlSerializer = new XMLSerializer();

			// Whatever is given here in aExtraPaths[] will be made available as a parameter while generating responses for the corresponding app as extraData
			Object.keys(oApps).forEach(function(sApp) {
				var oApp = oApps[sApp];
				// Load mock data only for apps that have mock data
				if (isAppWithMockData(oApp)) {
					aExtraPaths[sApp] = mockServerHelper.getSetting(sApp, "extraPaths");
				}
			});

			var oPreProcessingPromise = new Promise(function(resolve, reject) {
				// Get manifests
				Object.keys(oApps).forEach(function(sApp) {
					var oApp = oApps[sApp],
						sProject = oApp.url;
					// Load mock data only for apps that have mock data
					if (isAppWithMockData(oApp)) {
						aAppPreProcessingParams[sApp] = {
							mockDataSets: oApp.mockDataSets,
							url: sProject,
							serviceRegex: mockServerHelper.getSetting(sApp, "serviceRegex")
						};
						aManifestPromises.push(
							jQuery.get(sProject + "/manifest.json").then(function(data, status, jqXHR) {
								if (typeof data === "string") {
									data = JSON.parse(data);
								}
								data["sap.app"]["dataSources"] = mockServerHelper.getSetting(sApp, "dataSources");
								aAppPreProcessingParams[sApp].manifest = data;
								return Promise.resolve(data);
							})
						);
					}
				});

				Promise.all(aManifestPromises).then(function(aManifests) {
					var oDataSources, oDataSource, aEntitySets;

					// Get Metadata
					Object.keys(aAppPreProcessingParams).forEach(function(sApp) {
						oDataSources = aAppPreProcessingParams[sApp].manifest["sap.app"]["dataSources"];
						var fnAddEntitySet = function(index, element) {
							this[element.getAttribute("Name")] = element.getAttribute("EntityType").match(/[a-zA-Z0-9\_]+$/g)[0];
						};
						var fnAddParams = function(data, status, jqXHR) {
							this.metadata = oXmlSerializer.serializeToString(data);
							this.metadataETag = jqXHR.getResponseHeader("etag");
							this.metadataLastModified = jqXHR.getResponseHeader("last-modified");
							aEntitySets = jQuery("EntitySet", data);
							// create a mapping from entity set name to entity type name to be used later for $search fake response
							this.entitySetToTypeMap = [];
							aEntitySets.each(fnAddEntitySet.bind(this.entitySetToTypeMap));
							return Promise.resolve(data);
						};
						for (var property in oDataSources) {
							if (oDataSources.hasOwnProperty(property)) {
								oDataSource = oDataSources[property];
								if (oDataSource.settings && oDataSource.settings.localUri) {
									if (property === "mainService") {
										aAppPreProcessingParams[sApp].localUri = oDataSource.settings.localUri.slice(
											0,
											oDataSource.settings.localUri.indexOf("metadata") - 1
										);
										aDataSourceMetadataPromises.push(
											jQuery
												.get(aAppPreProcessingParams[sApp].url + "/" + oDataSource.settings.localUri)
												.then(fnAddParams.bind(aAppPreProcessingParams[sApp]))
										);
									}
								}
							}
						}
					});

					Promise.all(aDataSourceMetadataPromises).then(function(aMetadata) {
						// Get Data
						Object.keys(aAppPreProcessingParams).forEach(function(sApp) {
							var oApp = aAppPreProcessingParams[sApp];

							aAppPreProcessingParams[sApp].mockData = {};

							oApp.mockDataSets.forEach(function(sKey) {
								aDataPromises.push(
									jQuery.get(oApp.url + "/" + oApp.localUri + "/" + sKey + ".json").then(function(data, status, jqXHR) {
										// eslint-disable-line no-loop-func
										if (typeof data === "object") {
											data = JSON.stringify(data);
										}
										aAppPreProcessingParams[sApp].mockData[sKey] = data;
										return Promise.resolve(data);
									})
								);
							});
						});

						//Also get the extra data paths and add their promises
						//This is an exceptional case where a call is made for additional metadata or data
						Object.keys(aExtraPaths).forEach(function(sApp) {
							var oAppPaths = aExtraPaths[sApp],
								oApp = aAppPreProcessingParams[sApp];
							oApp.extraData = {};
							Object.keys(oAppPaths).forEach(function(sKey) {
								aDataPromises.push(
									jQuery.get(oAppPaths[sKey]).then(function(data, status, jqXHR) {
										// eslint-disable-line no-loop-func
										var sResponseType = jqXHR.getResponseHeader("content-type");
										if (sResponseType.indexOf("xml") > -1 && typeof data !== "string") {
											// XML
											data = oXmlSerializer.serializeToString(data);
										} else if (sResponseType.indexOf("json") > -1 && typeof data === "object") {
											// JSON
											data = JSON.stringify(data);
										}
										oApp.extraData[sKey] = data;

										//Updating searchable properties and entityset to entitytype mapping for ExtraData(metadata)
										var oMetadata = XMLHelper.parse(oApp.extraData[sKey]),
											aEntityTypes = oMetadata.getElementsByTagName("EntityType"),
											aEntitySets = jQuery("EntitySet", oApp.extraData[sKey]),
											oSearchableProperties = {};
										for (var i = 0; i < aEntityTypes.length; i++) {
											var oEntityType = aEntityTypes[i],
												sEntityTypeName = oEntityType.getAttribute("Name"),
												oProperties = oEntityType.getElementsByTagName("Property");

											oSearchableProperties[sEntityTypeName] = [];

											//for each property in this entity type
											for (var j = 0; j < oProperties.length; j++) {
												var oProperty = oProperties[j];
												if (oProperty.getAttribute("Type") === "Edm.String") {
													oSearchableProperties[sEntityTypeName].push(oProperty.getAttribute("Name"));
												}
											}
										}
										oApp.searchableProperties[sKey] = oSearchableProperties;
										oApp.entitySetToTypeMap[sKey] = [];
										aEntitySets.each(function() {
											oApp.entitySetToTypeMap[sKey][this.getAttribute("Name")] = this.getAttribute(
												"EntityType"
											).match(/[a-zA-Z0-9\_]+$/g)[0];
										});
									})
								);
							});
						});

						// Get the searchable properties so they can be referred to later for $search in requests
						Object.keys(aAppPreProcessingParams).forEach(function(sApp) {
							var oApp = aAppPreProcessingParams[sApp],
								oMetadata = jQuery.parseXML(oApp.metadata),
								aEntityTypes = oMetadata.getElementsByTagName("EntityType"),
								aSearchableProperties = {};
							//for each entity type
							for (var i = 0; i < aEntityTypes.length; i++) {
								var oEntityType = aEntityTypes[i],
									sEntityTypeName = oEntityType.getAttribute("Name"),
									oProperties = oEntityType.getElementsByTagName("Property");

								aSearchableProperties[sEntityTypeName] = [];

								//for each property in this entity type
								for (var j = 0; j < oProperties.length; j++) {
									var oProperty = oProperties[j];
									if (oProperty.getAttribute("Type") === "Edm.String") {
										aSearchableProperties[sEntityTypeName].push(oProperty.getAttribute("Name"));
									}
								}
							}
							oApp.searchableProperties = aSearchableProperties;
						});

						Promise.all(aDataPromises).then(function(aData) {
							resolve(aAppPreProcessingParams);
						});
					});
				});
			});

			return oPreProcessingPromise.then(function(aAppProcessedParams) {
				/**
				 * Structure of each entry in aAppProcessedParams looks like -
				 * <sApp> : {
				 * 				localUri: <string>									- from the main dataSource in manifest
				 * 				manifest: <object>									- manifest object of the app
				 *				metadata: <string>									- metadata of the main service
				 *				mockData: {
				 *							<sMockDataSet> : <string>				- eg. "productList" : {...}
				 *						 }
				 *				mockDataSets : <array>								- array of mock data sets required, this will be used to form the mockData above
				 *				serviceRegex: <string>								- string to create regex to map service call URL with appropriate response
				 *				url: <string>										- relative path to the app
				 *				extraData: <array>									- any extra data for the app received
				 *				searchableProperties: {
				 *										<sEntityTypeName> : <array>	- array of names of all properties of type Edm.String for this entity type
				 *									}
				 *			}
				 */

				// start the sinon fake server here at this point
				var fServer = sinon.fakeServer.create();
				fServer.autoRespond = true;
				fServer.xhr.useFilters = true;

				fServer.xhr.addFilter(function(method, url) {
					var bNeedMock = false;
					Object.keys(aAppProcessedParams).forEach(function(sApp) {
						var oApp = aAppProcessedParams[sApp];
						bNeedMock = bNeedMock || url.indexOf(oApp.serviceRegex) !== -1;
					});
					//whenever the this returns true the request will not faked
					return !bNeedMock;
				});

				generateResponses(fServer, aAppProcessedParams);

				/**
				 * There are service calls coming in for following URLs which require responses as well -
				 *
				 * 1. "/sap/opu/odata4/IWBEP/V4_SAMPLE/default/IWBEP/V4_GW_SAMPLE_BASIC/0001/ProductList?$count=true&$expand=PRODUCT_2_BP&$filter=startswith(ProductID,'HT-1022')&$skip=0&$top=50"
				 * 2. "/sap/opu/odata4/IWBEP/V4_SAMPLE/default/IWBEP/f4/sap/h_epm_pr-sh/0001;ps=%27default-%2Aiwbep%2Av4_gw_sample_basic-0001%27;va=%27com.sap.gateway.default.iwbep.v4_gw_sample_basic.v0001.ET-PRODUCT.PRODUCT_ID%27/$metadata"
				 */
			});
		}

		var MockServer = {
			mockIt: mockIt
		};

		return MockServer;
	}
);
