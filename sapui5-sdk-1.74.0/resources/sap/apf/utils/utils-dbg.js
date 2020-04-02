/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2018 SAP AG. All rights reserved
 */
/*global sap, jQuery, window */
/**
 * Static helper functions
 */
sap.ui.define([
	'sap/ui/core/format/DateFormat',
	"sap/apf/utils/hashtable",
	"sap/m/ViewSettingsDialog" // TODO apfhl2018 very unfortunate dependency to sap.m
], function(uiCoreDateFormat, Hashtable, ViewSettingsDialog) {
	'use strict';

	function correctToTwoDigitNumber(digits) {
		var number = parseInt(digits, 10);
		if (number < 10) {
			return "0" + number;
		}
		return digits;
	}

	var bFormatInformationIsMissing;
	var saltCounterForPseudoGuidSeparation = 0;
	var utils = {
		renderHeaderOfTextPropertyFile: function(applicationId, messageHandler) {
			var translationUuid = applicationId.toLowerCase();
			var checkValidFormatRegex = /^[0-9a-f]+$/;
			var isValid = checkValidFormatRegex.test(translationUuid);
			if (!isValid || applicationId.length !== 32) {
				messageHandler.putMessage(messageHandler.createMessageObject({
					code: "5409",
					aParameters: [applicationId]
				}));
				translationUuid = "<please enter valid translation uuid, if you want to upload into a SAP translation system>";
			} else {
				translationUuid = translationUuid.substring(0, 8) + '-' + translationUuid.substring(8, 12) + '-' + translationUuid.substring(12, 16) + '-' + translationUuid.substring(16, 20) + '-' + translationUuid.substring(20);
			}
			return "#FIORI: insert Fiori-Id\n" + "# __ldi.translation.uuid=" + translationUuid + "\n" + "#ApfApplicationId=" + applicationId + "\n\n";
		},
		/**
		 * @description Returns the URL parameters. Is a wrapper function for the jQuery.sap.getUriParameters function. For more details, please see SAPUI5 documentation
		 * @returns {object}
		 */
		getUriParameters: function() {
			return jQuery.sap.getUriParameters().mParams;
		},
		/**
		 * returns a promise with resolve value
		 */
		createPromise: function(valueToBeResolved, delay) {
			var deferred = jQuery.Deferred();
			if(!delay){
				deferred.resolve(valueToBeResolved);
			} else {
				setTimeout(function(){
					deferred.resolve(valueToBeResolved);
				}, delay);
			}
			return deferred.promise();
		},
		renderTextEntries: function(hashTableForTexts, messageHandler) {
			bFormatInformationIsMissing = false;
			var keys = hashTableForTexts.getKeys();
			keys.sort(function(a, b) {
				var valueA = hashTableForTexts.getItem(a);
				var valueB = hashTableForTexts.getItem(b);
				if (valueA.LastChangeUTCDateTime < valueB.LastChangeUTCDateTime) {
					return -1;
				}
				if (valueA.LastChangeUTCDateTime > valueB.LastChangeUTCDateTime) {
					return 1;
				}
				return 0;
			});
			var length = keys.length;
			var result = '';
			var i;
			for (i = 0; i < length; i++) {
				result = result + utils.renderEntryOfTextPropertyFile(hashTableForTexts.getItem(keys[i]), messageHandler);
			}
			return result;
		},
		renderEntryOfTextPropertyFile: function(textData, messageHandler) {
			var dateString, oDate;
			if (!bFormatInformationIsMissing && (!textData.TextElementType || !textData.MaximumLength)) {
				bFormatInformationIsMissing = true;
				messageHandler.putMessage(messageHandler.createMessageObject({
					code: "5408",
					aParameters: [textData.TextElement]
				}));
			}
			var entry = "#" + (textData.TextElementType || "<Add text type>") + "," + (textData.MaximumLength || "<Add maximum length>");
			if (textData.TranslationHint && textData.TranslationHint !== "") {
				entry = entry + ':' + textData.TranslationHint;
			}
			entry = entry + "\n" + textData.TextElement + "=" + textData.TextElementDescription + "\n";
			var oDateFormat = uiCoreDateFormat.getDateTimeInstance({
				pattern: "yyyy/MM/dd HH:mm:ss"
			});
			if (textData.LastChangeUTCDateTime && textData.LastChangeUTCDateTime !== "") {
				dateString = textData.LastChangeUTCDateTime.replace(/\/Date\(/, '').replace(/\)\//, '');
				oDate = new Date(parseInt(dateString, 10));
			} else {
				oDate = new Date();
			}
			entry = entry + "# LastChangeDate=" + oDateFormat.format(oDate) + '\n\n';
			return entry;
		},
		/**
		 * @description Eliminates duplicate values in an array. To be used for elementary types only!
		 * @param {*[]} oMsgHandler
		 * @param {*[]} aWithDuplicates
		 * @returns {*[]}
		 */
		eliminateDuplicatesInArray: function(oMsgHandler, aWithDuplicates) {
			oMsgHandler.check((aWithDuplicates !== undefined && typeof aWithDuplicates === 'object'
				&& aWithDuplicates.hasOwnProperty('length') === true), 'Error - aArray is undefined');
			var aReturn = [];
			var i, j;
			for (i = 0; i < aWithDuplicates.length; i++) {
				for (j = i + 1; j < aWithDuplicates.length; j++) {
					// If this[i] is found later in the array
					if (aWithDuplicates[i] === aWithDuplicates[j]) {
						j = ++i;
					}
				}
				aReturn.push(aWithDuplicates[i]);
			}
			return aReturn;
		},
		/**
		 * @description Returns a hash code of a string
		 * @param {string} sValue
		 * @returns {number}
		 */
		hashCode: function(sValue) {
			var nHash = 0;
			var i;
			var nCharCode = 0;
			sValue = sValue.toString();
			var len = sValue.length;
			for (i = 0; i < len; i++) {
				nCharCode = sValue.charCodeAt(i);
				nHash = (17 * nHash + nCharCode) << 0;
			}
			return Math.abs(nHash);
		},
		/**
		 * @description Escapes data according to the SAP XSE OData specification, that is doubling the single quote
		 * @param {string} sValue
		 * @returns {string} || {object}
		 */
		escapeOdata: function(sValue) {
			if (typeof sValue === "string") {
				return sValue.replace("'", "''");
			}
			return sValue;
		},
		/**
		 * @description Formats a value in json format in the javascript object.
		 * @param {object} value some value
		 * @param {string} sType edm type name
		 * @returns {object} javascriptValue
		 */
		json2javascriptFormat: function(value, sType) {
			var intermediateValue;
			switch (sType) {
				case "Edm.Boolean":
					if (typeof value === "boolean") {
						return value;
					}
					if (typeof value === "string") {
						return value.toLowerCase() === "true";
					}
					return false;
				case "Edm.Decimal":
				case "Edm.Guid":
				case "Edm.Int64":
				case "Edm.String":
					return value;
				case "Edm.Int16":
				case "Edm.Int32":
					return parseInt(value, 10);
				case "Edm.Single":
				case "Edm.Float":
					return parseFloat(value);
				case "Edm.Time":
					return value;
				case "Edm.DateTime":
					intermediateValue = value.replace('/Date(', '').replace(')/', '');
					intermediateValue = parseFloat(intermediateValue);
					return new Date(intermediateValue);
				case "Edm.DateTimeOffset":
					intermediateValue = value.replace('/Date(', '');
					intermediateValue = intermediateValue.replace(')/', '');
					intermediateValue = parseFloat(intermediateValue);
					return new Date(intermediateValue);
				default:
					return value;
			}
		},
		/**
		 * @description Formats a value for usage in odata conformant url as filter or parameter with given Edm type
		 * @param {object} value some value
		 * @param {sap.apf.core.MetadataProperty} oPropertyMetadata with EDM type name and annotation "sap-semantics"
		 * @returns {string} sFormattedValue
		 */
		formatValue: function(value, oPropertyMetadata) {
			function convertValueToDate(v) {
				var val;
				var reg = new RegExp("^[0-9]*$");
				if (v instanceof Date) {
					return v;
				}
				if (typeof v === 'string') {
					if (v.substring(0, 6) === '/Date(') {
						val = v.replace('/Date(', '');
						val = val.replace(')/', '');
						val = parseInt(val, 10);
						return new Date(val);
					} else if (v.length === 8 && reg.test(v)) {
						return utils.convertFiscalYearMonthDayToDate(v);
					}
					return new Date(v);
				}
				return undefined;
			}

			var oDate;
			var sFormatedValue = "";
			// null values should return the null literal
			if (value === null || value === undefined) {
				return "null";
			}
			var sType = oPropertyMetadata.dataType.type;
			switch (sType) {
				case "Edm.String":
					// quote
					if (oPropertyMetadata["sap-semantics"] === "yearmonthday") {
						if (typeof value === 'object' && value instanceof Date) {
							var year = value.getUTCFullYear() + "";
							var month = correctToTwoDigitNumber(value.getUTCMonth() + 1 + "");
							var day = correctToTwoDigitNumber(value.getUTCDate() + "");
							value = year + month + day;
						}
					}
					sFormatedValue = "'" + String(value).replace(/'/g, "''") + "'";
					break;
				case "Edm.Time":
					if (typeof value === 'number') {
						oDate = new Date();
						oDate.setTime(value);
						var hours = oDate.getUTCHours();
						if (hours < 10) {
							hours = '0' + hours;
						}
						var minutes = oDate.getUTCMinutes();
						if (minutes < 10) {
							minutes = '0' + minutes;
						}
						var seconds = oDate.getUTCSeconds();
						if (seconds < 10) {
							seconds = '0' + seconds;
						}
						sFormatedValue = "time'" + hours + ':' + minutes + ':' + seconds + "'";
					} else {
						sFormatedValue = "time'" + value + "'";
					}
					break;
				case "Edm.DateTime":
					if (!utils.formatValue.oDateTimeFormat) {
						utils.formatValue.oDateTimeFormat = uiCoreDateFormat.getDateInstance({
							pattern: "'datetime'''yyyy-MM-dd'T'HH:mm:ss''"
						});
					}

					oDate = convertValueToDate(value);
					sFormatedValue = utils.formatValue.oDateTimeFormat.format(oDate, true);
					break;
				case "Edm.DateTimeOffset":
					if (!utils.formatValue.oDateTimeOffsetFormat) {
						utils.formatValue.oDateTimeOffsetFormat = uiCoreDateFormat.getDateInstance({
							pattern: "'datetimeoffset'''yyyy-MM-dd'T'HH:mm:ss'Z'''"
						});
					}
					oDate = convertValueToDate(value); //
					sFormatedValue = utils.formatValue.oDateTimeOffsetFormat.format(oDate, true);
					break;
				case "Edm.Guid":
					sFormatedValue = "guid'" + value + "'";
					break;
				case "Edm.Decimal":
					sFormatedValue = value + "M";
					break;
				case "Edm.Int64":
					sFormatedValue = String(value) + "L";
					break;
				case "Edm.Single":
					sFormatedValue = value + "f";
					break;
				case "Edm.Binary":
					sFormatedValue = "binary'" + value + "'";
					break;
				default:
					sFormatedValue = value;
					break;
			}
			return sFormatedValue;
		},
		/**
		 * @description Transforms a string into a callable function. Method should only be called internally by APF.
		 * @param {string} sFunctionPath
		 * @returns {function|undefined}
		 */
		extractFunctionFromModulePathString: function(sFunctionPath) {
			if (jQuery.isFunction(sFunctionPath)) {
				return sFunctionPath;
			}
			var oDeepestNameSpaceLevel, aNameSpaceParts, sFunction;
			aNameSpaceParts = sFunctionPath.split('.');
			oDeepestNameSpaceLevel = window;
			var i;
			for (i = 0; i < aNameSpaceParts.length - 1; i++) {
				oDeepestNameSpaceLevel = oDeepestNameSpaceLevel[aNameSpaceParts[i]];
				if (!oDeepestNameSpaceLevel) {
					return undefined;
				}
			}
			sFunction = aNameSpaceParts[aNameSpaceParts.length - 1];
			return oDeepestNameSpaceLevel[sFunction];
		},
		/**
		 * @description Checks whether a give string is a valid server guid: exactly 32 digits long and characters only from 0-9 or A-F
		 * @param {string} guid
		 * @returns {boolean}
		 */
		isValidGuid: function(guid) {
			//noinspection JSLint
			return /^[0-9A-F]{32}$/.test(guid);
		},
		/**
		 * @description Checks whether a give string is a valid server guid: exactly 32 digits long and characters only from 0-9 or A-F
		 * @param {string} guid
		 * @returns {boolean}
		 */
		isValidPseudoGuid: function(guid) {
			//noinspection JSLint
			return /^[0-9A-F]{32}$/.test(guid);
		},
		/**
		 * @description Creates a pseudo guid: exactly 32 digits long and created with the date and a random number
		 * @param {number} len, length of guid to be created, default is 32
		 * @returns {boolean}
		 */
		createPseudoGuid: function(len) {
			if (!len && len !== 0) {
				len = 32;
			}
			var guid = Date.now().toString();
			var digitsToAdd = len - guid.length;
			guid += utils.createRandomNumberString(digitsToAdd);
			return guid;
		},
		/*
		 * returns a string of random numbers of a specified length
		 */
		createRandomNumberString: function(len) {
			var result = "";
			var addOnLength, mathLen, randomNumberBetweenZeroAndOne;
			while (result.length < len) {
				addOnLength = Math.min(10, len - result.length);
				mathLen = Math.pow(10, addOnLength);
				randomNumberBetweenZeroAndOne = getRandomNumberBetweenZeroAndOne(new Date().getTime());
				result += Math.floor(randomNumberBetweenZeroAndOne * mathLen);
			}
			return result;
		}
		,
		/**
		 * @description In old analytical configurations categories were assigned to step objects. To enable an individual sorting of steps beneath categories category objects have now step assignments
		 * @param {object} analyticalConfiguration - configuration to migrate, if needed
		 * @param {object} inject - inject logic
		 * @param {object} inject.instances.messageHandler - constructor for messageHandler
		 * @param {object} inject.constructors.HashTable - constructor for hashTable
		 */
		migrateConfigToCategoryStepAssignment: function(analyticalConfiguration, inject) {
			var Hashtable = (inject.constructors && inject.constructors.Hashtable) || Hashtable;
			var categoryStepAssignments = new Hashtable(inject.instances.messageHandler);
			if (analyticalConfiguration.steps) {
				analyticalConfiguration.steps.forEach(function(step) {
					if (step.categories) {
						step.categories.forEach(function(category) {
							var categoryStepAssignment = categoryStepAssignments.getItem(category.id);
							if (!categoryStepAssignment) {
								categoryStepAssignment = {
									category: category.id,
									steps: [{
										type: "step",
										id: step.id
									}]
								};
								categoryStepAssignments.setItem(category.id, categoryStepAssignment);
							} else {
								categoryStepAssignment.steps.push({
									type: "step",
									id: step.id
								});
							}
						});
						delete step.categories;
					}
				});
			}
			if (analyticalConfiguration.categories) {
				analyticalConfiguration.categories.forEach(function(category) {
					if (!category.steps) {
						var categoryStepAssignment = categoryStepAssignments.getItem(category.id);
						if (categoryStepAssignment) {
							category.steps = categoryStepAssignment.steps;
						} else {
							category.steps = [];
						}
					}
				});
			}
		},
		/**
		 * gets the component name from a manifest. Either from sap.app/id or from sap.ui5/componentName
		 * @param {object} manifest
		 * @returns {string} componentName
		 */
		getComponentNameFromManifest: function(manifest) {
			var name;
			if (manifest["sap.ui5"] && manifest["sap.ui5"].componentName) {
				name = manifest["sap.ui5"].componentName;
			} else {
				name = manifest["sap.app"].id;
			}
			if (name.search('Component') > -1) {
				return name;
			}
			return name + '.Component';
		},
		/**
		 * Gets a list of selected values and a list of available values and returns an object with a list of valid and invalid (selected) properties.
		 * Valid is the intersection of selectedValues and availableValues and invalid is the rest of the selectedValues
		 * @param {string []} selectedValues
		 * @param {string []} availableValues
		 * @returns {object} object with properties: {string []} valid, {string []} invalid
		 */
		validateSelectedValues: function(selectedValues, availableValues) {
			var returnObject = {
				valid: [],
				invalid: []
			};
			if (!selectedValues || !jQuery.isArray(selectedValues) || selectedValues.length === 0) {
				return returnObject;
			}
			if (!availableValues || !jQuery.isArray(availableValues) || availableValues.length === 0) {
				returnObject.invalid = selectedValues;
				return returnObject;
			}
			selectedValues.forEach(function(selectedValue) {
				if (jQuery.inArray(selectedValue, availableValues) === -1) {
					returnObject.invalid.push(selectedValue);
				} else {
					returnObject.valid.push(selectedValue);
				}
			});
			return returnObject;
		},
		/**
		 * removes the server and port information from an url
		 * @param {string} url
		 * @returns {string} urlWithoutProtocolServerPort
		 */
		extractPathnameFromUrl: function(url) {
			var elementName = 'a';
			var pathname;
			var element = document.createElement(elementName);
			element.href = url;
			if (element.pathname) {
				pathname = element.pathname;
				if (pathname && pathname[0] !== '/') {
					pathname = '/' + pathname;
				}
				return pathname;
			}
			return url;
		},
		/**
		 * evaluates a error response of type odata 2.0 or 4.0 and returns the messages
		 * @param {string} response
		 * @returns {string} errorMessage
		 */
		extractOdataErrorResponse: function(response) {
			var responseObject;
			if (typeof response === 'string') {
				responseObject = JSON.parse(response);
			} else {
				responseObject = response;
			}
			var message = (responseObject && responseObject.error && responseObject.error.message && responseObject.error.message.value) || (responseObject && responseObject.error && responseObject.error.message && responseObject.error.message)
				|| response;
			if (responseObject && responseObject.error && responseObject.error.innererror && responseObject.error.innererror.errordetails) {
				message = message + '\n';
				responseObject.error.innererror.errordetails.forEach(function(detail) {
					message = message + detail.message + '\n';
				});
			} else if (responseObject && responseObject.error && responseObject.error.details) {
				message = message + '\n';
				responseObject.error.details.forEach(function(detail) {
					message = message + detail.message + '\n';
				});
			}
			return message;
		},
		/**
		 * Generic way to close dialogs
		 * @param {Object} dialog
		 */
		checkAndCloseDialog: function(dialog) {
			if (dialog !== undefined) {
				if (dialog instanceof ViewSettingsDialog) {
					dialog.destroy();
				} else if (dialog.isOpen()) {
					dialog.close();
				}
			}
		},

		/**
		 * convert a string value of format YYYYMMDD to javascript date object. Example value is 20121231
		 * we construct the utc date
		 * @param {String} yearMonthDay
		 * @returns {Date} date
		 */
		convertFiscalYearMonthDayToDate: function(yearMonthDay) {
			var year = parseInt(yearMonthDay.substr(0, 4), 10);
			var month = parseInt(yearMonthDay.substr(4, 2), 10);
			var day = parseInt(yearMonthDay.substr(6, 2), 10);
			//month january = 0, december = 11 !!!
			return new Date(Date.UTC(year, month - 1, day));
		},
		/**
		 * convert a string value of format YYYYMMDD to javascript date string. Example value is 20121231
		 * @param {String} yearMonthDay
		 * @returns {string} date
		 */
		convertFiscalYearMonthDayToDateString: function(yearMonthDay) {
			return utils.convertFiscalYearMonthDayToDate(yearMonthDay).toUTCString();
		},
		/** Converts a configured list of values for date into a list, that is accepted by facet filter
		 * Supported input formats:
		 * dd.mm.yyyy
		 * mm/dd/yyyy
		 * @param {string[]} dates [ "20111231", "31.12.2012", "21/31/2011"]
		 * @param {sap.apf.core.MetadataProperty} property
		 * @returns {string[]} - ["20111231", "20121231"]
		 */
		convertDateListToInternalFormat: function(dates, property) {

			function correctToFourDigitNumber(digits) {
				var number = parseInt(digits, 10);
				if (number < 10) {
					return "200" + number;
				} else if (number < 100) {
					return "20" + number;
				}
				return digits;
			}

			if (!dates || !dates.length) {
				return dates;
			}
			var datesInInternalFormat = [];
			dates.forEach(function(externalFormatDate) {
				var year, month, day, components, date;
				if (new RegExp('^[0-9]{1,2}\\.[0-9]{1,2}\\.[0-9]+$').test(externalFormatDate)) { // 30.12.2018
					components = externalFormatDate.split(".");
					day = correctToTwoDigitNumber(components[0]);
					month = correctToTwoDigitNumber(components[1]);
					year = correctToFourDigitNumber(components[2]);
				} else if (new RegExp("^[0-9]{1,2}/[0-9]{1,2}/[0-9]+$").test(externalFormatDate)) { //12/30/2018
					components = externalFormatDate.split("/");
					month = correctToTwoDigitNumber(components[0]);
					day = correctToTwoDigitNumber(components[1]);
					year = correctToFourDigitNumber(components[2]);
				} else if (new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}").test(externalFormatDate)) { //2018-12-30; everything after this pattern is ignored
					year = externalFormatDate.slice(0, 4);
					month = externalFormatDate.slice(5, 7);
					day = externalFormatDate.slice(8, 10);
				}
				if (year !== undefined && month !== undefined && day !== undefined) {
					if (property.getAttribute('type') === "Edm.String") {
						datesInInternalFormat.push(year + month + day);
					} else {
						date = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10)));
						datesInInternalFormat.push(date);
					}
				} else {
					datesInInternalFormat.push(externalFormatDate);
				}
			});
			return datesInInternalFormat;
		},
		/**
		 * converts a value into external format
		 * @param {string|int|Date} internalValue value in internal format
		 * @param {sap.apf.core.MetadataProperty} metadataProperty
		 * @returns {string|int} externalValue
		 */
		convertToExternalFormat: function(internalValue, metadataProperty) {
			var type = metadataProperty.getAttribute("type");
			var dateInstance, dateValue;
			var attribute;
			switch (type) {
				case "Edm.DateTime":
					attribute = metadataProperty.getAttribute("sap:display-format");
					if (attribute === "Date" && internalValue instanceof Date) {
						dateInstance = uiCoreDateFormat.getDateInstance({style: "short"});
						return dateInstance.format(internalValue, true);
					} else if (attribute === "Date" && (typeof internalValue === 'string')) {
						if (internalValue.length === 8) {
							dateValue = utils.convertFiscalYearMonthDayToDate(internalValue);
							dateInstance = uiCoreDateFormat.getDateInstance({style: "short"});
							return dateInstance.format(dateValue, true);
						}
						dateValue = new Date(Date.parse(internalValue));
						if (isNaN(dateValue.getTime())) {
							return internalValue;
						}
						dateInstance = uiCoreDateFormat.getDateInstance({style: "short"});
						return dateInstance.format(dateValue, true);
					}
					return internalValue.toString();
				case "Edm.String":
					attribute = metadataProperty.getAttribute('sap:semantics');
					if (attribute === "yearmonthday") {
						if (internalValue.length === 8) {
							dateValue = utils.convertFiscalYearMonthDayToDate(internalValue);
						} else {
							dateValue = new Date(Date.parse(internalValue));
						}
						if (isNaN(dateValue.getTime())) {
							return internalValue;
						}
						dateInstance = uiCoreDateFormat.getDateInstance({style: "short"});
						return dateInstance.format(dateValue, true);
					}
					return internalValue;
				default:
					return internalValue;
			}
		},
		/**
		 * sorts an array of objects by property and with the help of propertyMetadata
		 * @param {Object[]} unsortedArray arrays with objects
		 * @param {string} propertyName
		 * @param {sap.apf.core.MetadataProperty} propertyMetadata object with property metadata
		 * @returns {Object[]} sortedArray arrays with objects
		 */
		sortByProperty: function(unsortedArray, propertyName, propertyMetadata) {
			if (unsortedArray.length === 0) {
				return [];
			}
			var propertyType = propertyMetadata ? propertyMetadata.type : undefined;
			var propertyValue = unsortedArray[0][propertyName];
			var metadataAttribute;

			if (typeof propertyValue === 'number') {
				return unsortedArray.sort(function(valueA, valueB) {
					return valueA[propertyName] - valueB[propertyName];
				});
			} else if (typeof propertyValue === 'object' && propertyValue instanceof Date) {
				return unsortedArray.sort(function(valueA, valueB) {
					return valueA[propertyName].getTime() - valueB[propertyName].getTime();
				});
			} else if (typeof propertyValue === 'string') {
				switch (propertyType) {
					case "Edm.DateTime":
						return unsortedArray.sort(function(valueA, valueB) {
							return Date.parse(valueA[propertyName]) - Date.parse(valueB[propertyName]);
						});
					case "Edm.String":
						metadataAttribute = propertyMetadata["sap:semantics"];
						if (metadataAttribute === "yearmonthday" && propertyValue.length === 8) {
							return unsortedArray.sort(function(valueA, valueB) {
								return valueA[propertyName].localeCompare(valueB[propertyName]);
							});
						} else if (metadataAttribute === "yearmonthday") {
							return unsortedArray.sort(function(valueA, valueB) {
								return Date.parse(valueA[propertyName]) - Date.parse(valueB[propertyName]);
							});
						}
						return unsortedArray.sort(function(valueA, valueB) {
							return valueA[propertyName].localeCompare(valueB[propertyName]);
						});
					default:
						return unsortedArray.sort(function(valueA, valueB) {
							return valueA[propertyName].localeCompare(valueB[propertyName]);
						});
				}
			}
		},

		/**
		 * @param {object} propertyMetadata
		 * @returns {boolean} true, if date type or string with yearmonthday semantics
		 */
		isPropertyTypeWithDateSemantics: function(propertyMetadata) {
			var type = propertyMetadata['type'];
			var format = propertyMetadata['sap:display-format'];
			return (type === 'Edm.DateTime' && format === 'Date') || (type === 'Edm.String' && propertyMetadata['sap:semantics'] === 'yearmonthday');
		}
	};

	/**
	 * @description Returns a random number between zero and one by hashing the input
	 * @param {number, string} input,
	 * @returns {number}
	 */
	function getRandomNumberBetweenZeroAndOne(input) {
		saltCounterForPseudoGuidSeparation++;
		var randomNumber, randomNumberLen, randomNumberBetweenZeroAndOne;
		input = saltCounterForPseudoGuidSeparation.toString() + input.toString();
		randomNumber = utils.hashCode(input);
		randomNumberLen = randomNumber.toString().length;
		randomNumberBetweenZeroAndOne = randomNumber / Math.pow(10, randomNumberLen);
		return randomNumberBetweenZeroAndOne;
	}

	/*BEGIN_COMPATIBILITY*/
	Object.keys(utils).forEach(function(key) {
		sap.apf.utils[key] = utils[key];
	});
	/*END_COMPATIBILITY*/
	return utils;
}, true/*GLOBAL_EXPORT*/);
