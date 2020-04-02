/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
window.RequestRecorder = (function () {
    jQuery.sap.require("sap/ui/thirdparty/sinon"); 
	"use strict";
	var sModuleName = "RequestRecorder";

	function _privateObject() { }
	_privateObject.prototype = {

		//used for both modes
		bRecord: false,
		bPause: false,
		aEntriesUrlFilter: [],
		entriesUrlReplace: [],
		fnCustomGroupNameCallback: [],

		//used for record mode only
		sDefaultFilename: "Record",
		aRequests: [],
		mXhrNativeFunctions: {},
		sFilename: "",
		bDisableDownload: false,
		bPromptForDownloadFilename: false,

		//used in play mode only
		mHarFileContent: null,
		sDefaultMajorHarVersion: 1,
		sDefaultCustomGroup: "defaultCustomGroup",
		oSinonXhr: null,
		aRequestsStartTimestamp: [],
		mDelaySettings: false,

		// Set default logging and support for another logger
		log: (jQuery.sap.log) ? jQuery.sap.log : {
			info: function (label, text) {
				console.info(label, text);
			},
			debug: function (label, text) {
				console.debug(label, text);
			},
			warning: function (label, text) {
				console.warn(label, text);
			},
			error: function (label, text) {
				console.error(label, text);
			}
		},


		/**
		 * The function delivers a more precise timestamp with more decimal digits.
		 * This timestamp is used for a better determination of the correct request/response order,
		 * especially if requests are asynchronous.
		 *
		 * @returns {number}
		 */
		preciseDateNow: function () {
			if (!(window.performance && window.performance.now && window.performance.timing)) {
				return Date.now();
			} else {
				return window.performance.timing.navigationStart + window.performance.now();
			}
		},

		/**
		 * Tries to load a har file form the given location URL and validates the major version.
		 *
		 * @param {string} sLocationUrl
		 * @returns {null|object}
		 */
		loadFile: function (sLocationUrl) {
			// Try to request the har file from the given location url
			var mHarFileContent = null;
			var oRequest = new XMLHttpRequest();
			oRequest.open("GET", sLocationUrl, false);
			oRequest.onreadystatechange = function () {
				var that = this;
				if (that.readyState == 4 && that.status === 200) {
					mHarFileContent = JSON.parse(this.responseText);
				}
			};
			oRequest.send();

			// Validate version of the har file
			if (mHarFileContent && (!mHarFileContent.log || !mHarFileContent.log.version || parseInt(mHarFileContent.log.version, 10) != this.sDefaultMajorHarVersion)) {
				this.log.error(sModuleName, "Incompatible version. Please provide .har file with version " + this.sDefaultMajorHarVersion + ".x");
			}

			return mHarFileContent;
		},

		/**
		 * Sorts the entries of a har file by response and request order. After the entries are sorted, the function builds
		 * a map of the entries with the assigned custom and url groups.
		 *
		 * @param {object} mHarFileContent The loaded map from the har file.
		 */
		prepareEntries: function (mHarFileContent) {
			// Add start and end timestamps to determine the request and response order.
			var aEntries = mHarFileContent.log.entries;
			for (var i = 0; i < aEntries.length; i++) {
				aEntries[i]._timestampStarted = new Date(aEntries[i].startedDateTime).getTime();
				aEntries[i]._timestampFinished = aEntries[i]._timestampStarted + aEntries[i].time;
				aEntries[i]._initialOrder = i;
			}

			// Closure to sort the entries within by a field, if the timestamp equals, fallback to the initial order.
			var fnEntryOrder = function (sFieldToSort) {
				aEntries.sort(function (oAEntry, oBEntry) {
					var iResult = oAEntry[sFieldToSort] - oBEntry[sFieldToSort];
					if (iResult === 0) {
						return oAEntry._initialOrder - oBEntry._initialOrder;
					} else {
						return iResult;
					}
				});
			};

			// Sort by response first, then by request to ensure the correct order.
			fnEntryOrder("_timestampFinished");
			fnEntryOrder("_timestampStarted");

			// Build a map with the sorted entries in the correct custom groups and by URL groups.
			mHarFileContent._groupedEntries = {};
			for (var j = 0; j < aEntries.length; j++) {
				this.addPreparedEntryToMapping(mHarFileContent, aEntries, j);
			}

			mHarFileContent.log.entries = aEntries;
			return mHarFileContent;
		},

		/**
		 * @param {object} mHarFileContent
		 * @param {array} aEntries
		 * @param {int} iIndex
		 */
		addPreparedEntryToMapping: function (mHarFileContent, aEntries, iIndex) {
			var sUrlGroup = this.createUrlGroup(aEntries[iIndex].request.method, aEntries[iIndex].request.url);
			var customGroupName;
			if (aEntries[iIndex]._customGroupName) {
				customGroupName = aEntries[iIndex]._customGroupName;
			} else {
				customGroupName = this.sDefaultCustomGroup;
			}

			if (!mHarFileContent._groupedEntries[customGroupName]) {
				mHarFileContent._groupedEntries[customGroupName] = {};
			}
			if (!mHarFileContent._groupedEntries[customGroupName][sUrlGroup]) {
				mHarFileContent._groupedEntries[customGroupName][sUrlGroup] = [];
			}
			mHarFileContent._groupedEntries[customGroupName][sUrlGroup].push(iIndex);
		},


		createUrlGroup: function (sMethod, sUrl) {
			var sUrlResourcePart = new URI(sUrl).resource();
			sUrlResourcePart = this.replaceEntriesUrl(sUrlResourcePart);
			return sMethod + sUrlResourcePart;
		},

		replaceEntriesUrl: function (sUrl) {
			for (var i = 0; i < this.entriesUrlReplace.length; i++) {
				var oEntry = this.entriesUrlReplace[i];
				if (typeof oEntry.regex == "object" && oEntry.value !== undefined) {
					sUrl = sUrl.replace(
						new RegExp(oEntry.regex),
						oEntry.value
					);
				}
			}
			return sUrl;
		},

		/**
		 * Prepares the data from a XMLHttpRequest for saving into an har file. All needed data to replay the request
		 * is collected (e.g. time, headers, response).
		 *
		 * @param {Object} oXhr The finished XMLHttpRequest, from which the data for the har file is extracted.
		 * @param {number} iRequestsStartTimestampIndex The index of the tracked request start timestamp.
		 * @param {number} iResponseCounter The response order for the current XMLHttpRequest.
		 * @returns {Object} The prepared entry for the har file.
		 */
		prepareRequestForHar: function (oXhr, iRequestsStartTimestampIndex, iResponseCounter) {
			var oEntry = {
				startedDateTime: new Date(this.aRequestsStartTimestamp[iRequestsStartTimestampIndex]).toISOString(),
				time: this.preciseDateNow() - this.aRequestsStartTimestamp[iRequestsStartTimestampIndex],
				request: {
					_orderDebug: iRequestsStartTimestampIndex,
					headers: oXhr._requestParams.headers,
					url: new URI(oXhr._requestParams.url).absoluteTo(window.location.origin + window.location.pathname).readable(),
					method: oXhr._requestParams.method
				},
				response: {
					_orderDebug: iResponseCounter,
					status: oXhr.status,
					content: {
						text: oXhr.responseText
					}
				}
			};
			if (oXhr._requestParams.customGroupName) {
				oEntry._customGroupName = oXhr._requestParams.customGroupName;
			}

			// Transform the response headers into the expected format
			var aTemp = oXhr.getAllResponseHeaders().split("\r\n");
			var oHeaders = [];
			for (var i = 0; i < aTemp.length; i++) {
				if (aTemp[i]) {
					var aHeader = aTemp[i].split(":");
					oHeaders.push({
						name: aHeader[0].trim(),
						value: aHeader[1].trim()
					});
				}
			}
			oEntry.response.headers = oHeaders;
			return oEntry;
		},

		/**
		 * Transforms and delivers the recorded data for the har file.
		 * If the downloading is not disabled the file will be downloaded automatically or with an optional prompt for a filename.
		 *
		 * @returns {Object}
		 */
		getHarContent: function () {
			var sFilename = (this.sFilename || this.sDefaultFilename);
			if (this.bPromptForDownloadFilename) {
				sFilename = window.prompt("Enter file name", sFilename + ".har");
			} else {
				sFilename = sFilename + ".har";
			}

			var mHarContent = {
				log: {
					version: "1.2",
					creator: {
						name: "RequestRecorder",
						version: "1.0"
					},
					entries: this.aRequests
				}
			};

			if (!this.bDisableDownload) {
				var sString = JSON.stringify(mHarContent, null, 4);
				var a = document.createElement("a");
				document.body.appendChild(a);
				var oBlob = new window.Blob([sString], { type: "octet/stream" });
				var sUrl = window.URL.createObjectURL(oBlob);
				a.href = sUrl;
				a.download = sFilename;
				a.click();
				window.URL.revokeObjectURL(sUrl);
			}
			return mHarContent;
		},

		calculateDelay: function (mDelaySettings, iTime) {
			if (mDelaySettings) {
				if (mDelaySettings.factor !== undefined && typeof mDelaySettings.factor === 'number') {
					iTime *= mDelaySettings.factor;
				}
				if (mDelaySettings.offset !== undefined && typeof mDelaySettings.offset === 'number') {
					iTime += mDelaySettings.offset;
				}
				if (mDelaySettings.max !== undefined && typeof mDelaySettings.max === 'number') {
					iTime = Math.min(mDelaySettings.max, iTime);
				}
				if (mDelaySettings.min !== undefined && typeof mDelaySettings.min === 'number') {
					iTime = Math.max(mDelaySettings.min, iTime);
				}
			}
			return iTime;
		},

		/**
		 * Responds to a given FakeXMLHttpRequest object with an entry from a har file.
		 *
		 * @param {Object} oXhr FakeXMLHttpRequest to respond.
		 * @param {Object} oEntry Entry from the har file.
		 */
		respond: function (oXhr, oEntry) {
			var fnRespond = function () {
				if (oXhr.readyState !== 0) {
					var oHeaders = {};
					oEntry.response.headers.forEach(function (mHeader) {
						oHeaders[mHeader.name] = mHeader.value;
					});
					var sResponseText = "";
					if (oEntry.response.content.encoding === "base64") {
						sResponseText = window.atob(oEntry.response.content.text);
					} else {
						sResponseText = oEntry.response.content.text;
					}

					// Support for injected callbacks
					if (typeof sResponseText === "function") {
						sResponseText = sResponseText();
					}

					oXhr.respond(
						oEntry.response.status,
						oHeaders,
						sResponseText
					);
				}
			};
			if (oXhr.async) {
				// Create new browser task with the setTimeout function to make sure that responses of async requests are not delievered too fast.
				setTimeout(function () {
					fnRespond();
				}, this.calculateDelay(this.mDelaySettings, oEntry.time));
			} else {
				fnRespond();
			}
		},

		/**
		 * Checks an URL against an array of regex if its filtered.
		 *
		 * @param {string} sUrl URL to check.
		 * @param {RegExp[]} aEntriesUrlFilter Array of regex filters.
		 * @returns {boolean}
		 */
		isUrlFiltered: function (sUrl, aEntriesUrlFilter) {
			var bResult = aEntriesUrlFilter.every(function (regex) {
				if (regex instanceof RegExp) {
					return !regex.test(sUrl);
				} else {
					this.log.error(sModuleName, "Invalid regular expression for filter.");
				}
			});
			return !bResult;
		},

		init: function (mOptions) {
			mOptions = mOptions || {};
			if (typeof mOptions !== "object") {
				throw new Error("Parameter object isn't a valid object", "", this);
			}

			this.mHarFileContent = null;
			this.aRequests = [];
			this.aRequestsStartTimestamp = [];
			this.sFilename = "";
			this.bRecord = false;
			this.bPause = false;
			this.bDisableDownload = false;
			if (this.oSinonXhr) {
				this.oSinonXhr.filters = this.aSinonFilters;
				this.aSinonFilters = [];
				this.oSinonXhr.restore();
				this.oSinonXhr = null;
			}
			for (var sFunctionName in this.mXhrNativeFunctions) {
				if (this.mXhrNativeFunctions.hasOwnProperty(sFunctionName)) {
					window.XMLHttpRequest.prototype[sFunctionName] = this.mXhrNativeFunctions[sFunctionName];
				}
			}
			this.mXhrNativeFunctions = {};
			this.bDisableDownload = mOptions.disableDownload === true;
			this.bPromptForDownloadFilename = mOptions.promptForDownloadFilename === true;

			if (mOptions.delay) {
				if (mOptions.delay === true) {
					this.mDelaySettings = {}; // Use delay of recording
				} else {
					this.mDelaySettings = mOptions.delay;
				}
			} else {
				this.mDelaySettings = { max: 0 }; // default: no delay
			}
			if (mOptions.entriesUrlFilter) {
				if (mOptions.entriesUrlFilter.constructor === Array) {
					this.aEntriesUrlFilter = mOptions.entriesUrlFilter;
				} else {
					this.aEntriesUrlFilter = [mOptions.entriesUrlFilter];
				}
			} else {
				this.aEntriesUrlFilter = [new RegExp(".*")]; // default: no filtering
			}
			if (mOptions.entriesUrlReplace) {
				if (mOptions.entriesUrlReplace.constructor === Array) {
					this.entriesUrlReplace = mOptions.entriesUrlReplace;
				} else {
					this.entriesUrlReplace = [mOptions.entriesUrlReplace];
				}
			}

			if (mOptions.customGroupNameCallback && typeof mOptions.customGroupNameCallback === "function") {
				this.fnCustomGroupNameCallback = mOptions.customGroupNameCallback;
			} else {
				this.fnCustomGroupNameCallback = function () { return false; }; // default: Empty Callback function used
			}
		}
	};

	var _private = new _privateObject();

	var RequestRecorder = {

		/**
		 * Start with existing locationUrl or inline entries results in a playback. If the file does not exist, XMLHttpRequests are not faked and the recording starts.
		 *
		 * @param {string|Array} locationUrl Specifies from which location the file is loaded. If it is not found, the recording is started. The provided filename is the name of the output har file.
		 * 		This parameter can be the entries array for overloading the function.
		 * @param {map} [options] Contains optional parameters to config the RequestRecorder:
		 * @param {boolean|map} [options.delay] If a the parameter is equals true, the recorded delay timings are used, instead of the default delay equals zero. If a map as parameter is used, the delay is calculated with the delaysettings in the object. Possible settings are max, min, offset, factor.
		 * @param {function} [options.customGroupNameCallback] A callback is used to determine the custom groupname of the current XMLHttpRequest. If the callback returns a falsy value, the default groupname is used.
		 * @param {boolean} [options.disableDownload] Set this flag to true if you don´t want to download the recording after the recording is finished. This parameter is only used for testing purposes.
		 * @param {boolean} [options.promptForDownloadFilename] Activates a prompt popup after stop is called to enter a desired filename.
		 * @param {array|RegExp} [options.entriesUrlFilter] A list of regular expressions, if it matches the URL the request-entry is filtered.
		 * @param {array|object} [options.entriesUrlReplace] A list of objects with regex and value to replace. E.g.: "{ regex: new RegExp("RegexToSearchForInUrl"), "value": "newValueString" }"
		 */
		start: function (locationUrl, options) {
			// Try to start play-mode
			var playStarted = this.play(locationUrl, options);

			// If play-mode could not be started, try to record instead.
			if (!playStarted) {
				var oUri = new URI(locationUrl);
				var sExtension = oUri.suffix();
				// Check if the provided URL is a har file, maybe the wrong url is provided
				if (sExtension != "har") {
					_private.log.warning(sModuleName, "Invalid file extension: " + sExtension + ", please use '.har' files.");
				}
				this.record(oUri.filename().replace("." + sExtension, ""), options);
			}
		},

		/**
		 * @param {string|object} filename The name of the har file to be recorded.
		 * @param {object} [options] Contains optional parameters to config the RequestRecorder:
		 * @param {function} [options.customGroupNameCallback] A callback is used to determine the custom groupname of the current XMLHttpRequest. If the callback returns a falsy value, the default groupname is used.
		 * @param {boolean} [options.disableDownload] Set this flag to true if you don´t want to download the recording after the recording is finished. This parameter is only used for testing purposes.
		 * @param {boolean} [options.promptForDownloadFilename] Activates a prompt popup after stop is called to enter a desired filename.
		 * @param {array|RegExp} [options.entriesUrlFilter] A list of regular expressions, if it matches the URL the request-entry is filtered.
		 */
		record: function (filename, options) {
			_private.log.info(sModuleName, "Record");
			if (_private.bRecord) {
				_private.log.error(sModuleName, "not ready, still recording, please stop first..");
			}
			_private.init(options);

			var iResponseCounter = 0;
			_private.sFilename = filename;
			_private.bRecord = true;

			_private.mXhrNativeFunctions.open = window.XMLHttpRequest.prototype.open;
			window.XMLHttpRequest.prototype.open = function () {
				this._requestParams = {
					method: arguments[0],
					url: arguments[1],
					headers: [],
					customGroupName: _private.fnCustomGroupNameCallback()
				};
				_private.mXhrNativeFunctions.open.apply(this, arguments);
			};

			_private.mXhrNativeFunctions.setRequestHeader = window.XMLHttpRequest.prototype.setRequestHeader;
			window.XMLHttpRequest.prototype.setRequestHeader = function (sHeaderName, sHeaderValue) {
				this._requestParams.headers.push({
					name: sHeaderName,
					value: sHeaderValue
				});
				_private.mXhrNativeFunctions.setRequestHeader.apply(this, arguments);
			};

			_private.mXhrNativeFunctions.send = window.XMLHttpRequest.prototype.send;
			window.XMLHttpRequest.prototype.send = function () {
				if (!_private.bPause && _private.isUrlFiltered(this._requestParams.url, _private.aEntriesUrlFilter)) {
					var iIndex = _private.aRequestsStartTimestamp.push(_private.preciseDateNow()) - 1;

					// the onreadystatechange callback function is already specified in datajs.js for async requests
					var fnOldStateChanged = this.onreadystatechange;
					this.onreadystatechange = function () {
						if (this.readyState === 4) {
							_private.aRequests.push(_private.prepareRequestForHar(this, iIndex, iResponseCounter));
							iResponseCounter++;
						}
						if (fnOldStateChanged) {
							fnOldStateChanged.apply(this, arguments);
						}
					};
				}
				_private.mXhrNativeFunctions.send.apply(this, arguments);
			};
		},

		/**
		 * @param {string|Array} locationUrl Specifies from which location the file is loaded. This parameter is overloaded and can also be an entries array.
		 * @param {object} [options] Contains optional parameters to config the RequestRecorder:
		 * @param {boolean|map} [options.delay] If a the parameter is equals true, the recorded delay timings are used, instead of the default delay equals zero. If a map as parameter is used, the delay is calculated with the delaysettings in the object. Possible settings are max, min, offset, factor.
		 * @param {function} [options.customGroupNameCallback] A callback is used to determine the custom groupname of the current XMLHttpRequest. If the callback returns a falsy value, the default groupname is used.
		 * @param {array|RegExp} [options.entriesUrlFilter] A list of regular expressions, if it matches the URL the request-entry is filtered.
		 * @param {array|object} [options.entriesUrlReplace] A list of objects with regex and value to replace. E.g.: "{ regex: new RegExp("RegexToSearchForInUrl"), "value": "newValueString" }"
		 */
		play: function (locationUrl, options) {
			_private.log.info(sModuleName, "Play");
			if (_private.oSinonXhr) {
				throw new Error("not ready, still playing, please stop first..");
			}
			_private.init(options);
			var sLocationUrl = locationUrl;
			var aEntries;

			// Check if locationUrl parameter is entries array
			if (sLocationUrl && sLocationUrl.constructor === Array) {
				aEntries = sLocationUrl.slice(0);
			}

			// Decide if entries are provided or if a file needs to be loaded.
			if (aEntries) {
				_private.mHarFileContent = {};
				_private.mHarFileContent.log = { "entries": aEntries };
				sLocationUrl = "";
			} else {
				_private.mHarFileContent = _private.loadFile(sLocationUrl);
			}

			// Provided entries or har file entries must be prepared for usage with the ReqeustRecorder.
			if (_private.mHarFileContent) {
				_private.mHarFileContent = _private.prepareEntries(_private.mHarFileContent);
				_private.log.info(sModuleName, "Har file found, replay started (" + sLocationUrl + ")");
				// If entries are found, start the player
				_private.oSinonXhr = sinon.useFakeXMLHttpRequest();
				_private.oSinonXhr.useFilters = true;
				// Wrapping of Sinon filters, because also sap.ui.core.util.MockServer also use the same sinon instance
				_private.aSinonFilters = _private.oSinonXhr.filters;
				_private.oSinonXhr.filters = [];

				_private.oSinonXhr.addFilter(function (sMethod, sUrl, bAsync, sUsername, sPassword) {

					if (!_private.bPause && _private.isUrlFiltered(sUrl, _private.aEntriesUrlFilter)) {
						return false;
					}
					for (var i = 0; i < _private.aSinonFilters.length; i++) {
						if (_private.aSinonFilters[i](sMethod, sUrl, bAsync, sUsername, sPassword) === false) {
							return false;
						}
					}
					return true;
				});
				var fnOnCreate = _private.oSinonXhr.onCreate;
				_private.oSinonXhr.onCreate = function (oXhr) {
					var fnXhrSend = oXhr.send;
					oXhr.send = function () {
						if (!_private.bPause && _private.isUrlFiltered(oXhr.url, _private.aEntriesUrlFilter)) {
							var oEntry;
							var mCustomGroup;

							// Get next entry
							var sUrl = new URI(oXhr.url).absoluteTo(window.location.origin + window.location.pathname).resource();
							sUrl = _private.replaceEntriesUrl(sUrl);
							var sUrlGroup = oXhr.method + sUrl;

							var customGroupName = _private.fnCustomGroupNameCallback();
							if (!customGroupName) {
								customGroupName = _private.sDefaultCustomGroup;
							}
							if (!_private.mHarFileContent._groupedEntries[customGroupName]) {
								throw new Error("Custom group name does not exist: " + customGroupName);
							}

							mCustomGroup = _private.mHarFileContent._groupedEntries[customGroupName];
							if (!mCustomGroup[sUrlGroup]) {
								throw new Error("URL does not exist: " + sUrlGroup);
							}

							if (!mCustomGroup[sUrlGroup].length) {
								throw new Error("No more entries left for: " + sUrlGroup);
							}

							oEntry = _private.mHarFileContent.log.entries[mCustomGroup[sUrlGroup].shift()];
							_private.log.info(sModuleName, "Respond XMLHttpRequest. Method: " + oXhr.method + ", URL: " + sUrl);

							_private.respond(oXhr, oEntry);
						} else {
							fnXhrSend.apply(this, arguments);
						}
					};
					/*
					/ sinon oncreate call. MockServer use the onCreate hock to the onSend to the xhr.
					*/
					if (fnOnCreate) {
						fnOnCreate.apply(this, arguments);
					}
				};
				return true;
			}
			return false;
		},

		/**
		 * Stops the recording or the player.
		 * If downloading is not disabled, the har file is downloaded automatically.
		 *
		 * @returns {null|Object} In record mode the har file is returned as json, otherwise null is returned.
		 */
		stop: function () {
			_private.log.info(sModuleName, "Stop");
			var mHarContent = null;
			if (_private.bRecord) {
				mHarContent = _private.getHarContent();
			}

			// do this for a full cleanup
			_private.init();

			return mHarContent;
		},

		/**
		 * Pause the replay or recording.
		 * Can be used to exclude XMLHttpRequests.
		 */
		pause: function () {
			_private.log.info(sModuleName, "Pause");
			_private.bPause = true;
		},

		/**
		 * Continues the replay or recording.
		 */
		resume: function () {
			_private.log.info(sModuleName, "Resume");
			_private.bPause = false;
		},

		addResponseJson: function (url, response, method, status, headers) {
			var aHeaders = headers || [];
			aHeaders.push({
				"name": "Content-Type",
				"value": "application/json;charset=utf-8"
			});
			this.addResponse(url, response, method, status, aHeaders)
		},

		addResponse: function (url, response, method, status, headers) {
			if (!_private.oSinonXhr) {
				throw new Error("Start the player first before you add a response.");
			}
			var sMethod = method || "GET";
			var aHeaders = headers || [{
				"name": "Content-Type",
				"value": "text/plain;charset=utf-8"
			}];
			var iStatus = status || 200;
			var oEntry = {
				"startedDateTime": new Date().toISOString(),
				"time": 0,
				"request": {
					"headers": [],
					"url": url,
					"method": sMethod
				},
				"response": {
					"status": iStatus,
					"content": {
						"text": response
					},
					"headers": aHeaders
				}
			};
			var iIndex = _private.mHarFileContent.log.entries.push(oEntry) - 1;
			_private.addPreparedEntryToMapping(_private.mHarFileContent, _private.mHarFileContent.log.entries, iIndex);
		}
	};
	return RequestRecorder;
} ());
