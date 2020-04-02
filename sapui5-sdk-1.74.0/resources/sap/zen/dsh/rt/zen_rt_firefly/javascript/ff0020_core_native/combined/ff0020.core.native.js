(function(oFF) {
	Object.keys = Object.keys
			|| (function() {
				var hasOwnProperty = Object.prototype.hasOwnProperty, hasDontEnumBug = !{
					toString : null
				}.propertyIsEnumerable("toString"), DontEnums = [ "toString",
						"toLocaleString", "valueOf", "hasOwnProperty",
						"isPrototypeOf", "propertyIsEnumerable", "constructor" ], DontEnumsLength = DontEnums.length;
				return function(o) {
					if (typeof o !== "object" && typeof o !== "function"
							|| o === null) {
						throw new TypeError(
								"Object.keys called on a non-object");
					}
					var result = [];
					for ( var name in o) {
						if (hasOwnProperty.call(o, name)) {
							result.push(name);
						}
					}
					if (hasDontEnumBug) {
						for (var i = 0; i < DontEnumsLength; i++) {
							if (hasOwnProperty.call(o, DontEnums[i])) {
								result.push(DontEnums[i]);
							}
						}
					}
					return result;
				};
			})();
	oFF.XArrayWrapper = function(copy) {
		this.m_list = [];
		if (copy) {
			this.m_list.push.apply(this.m_list, copy);
		}
	};
	oFF.XArrayWrapper.prototype = new oFF.XObject();
	oFF.XArrayWrapper.prototype.releaseObject = function() {
		this.m_list = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XArrayWrapper.prototype.size = function() {
		return this.m_list.length;
	};
	Object.defineProperty(oFF.XArrayWrapper.prototype, "length", {
		get : function() {
			return this.m_list.length;
		}
	});
	oFF.XArrayWrapper.prototype.isEmpty = function() {
		return this.m_list.length === 0;
	};
	oFF.XArrayWrapper.prototype.hasElements = function() {
		return this.m_list.length !== 0;
	};
	oFF.XArrayWrapper.prototype.toString = function() {
		return "[" + this.m_list.join(",") + "]";
	};
	oFF.XArrayWrapper.prototype.set = function(index, element) {
		if (index < 0 || index >= this.m_list.length) {
			throw new Error("Illegal Argument: illegal index");
		}
		this.m_list[index] = element;
	};
	oFF.XArrayWrapper.prototype.get = function(index) {
		if (index < 0 || index >= this.m_list.length) {
			throw new Error("Illegal Argument: illegal index");
		}
		return this.m_list[index];
	};
	oFF.XArrayWrapper.prototype.createArrayCopy = function() {
		return new oFF.XArray(-1, this.m_list);
	};
	oFF.XArrayWrapper.prototype.getListFromImplementation = function() {
		return this.m_list;
	};
	oFF.XArrayWrapper.prototype.concat = function() {
		return this.m_list.concat.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.copyWithin = function() {
		return this.m_list.copyWithin.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.entries = function() {
		return this.m_list.entries.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.every = function() {
		return this.m_list.every.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.fill = function() {
		return this.m_list.fill.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.filter = function() {
		return this.m_list.filter.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.find = function() {
		return this.m_list.find.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.findIndex = function() {
		return this.m_list.findIndex.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.forEach = function() {
		return this.m_list.forEach.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.includes = function() {
		return this.m_list.includes.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.indexOf = function() {
		return this.m_list.indexOf.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.map = function() {
		return this.m_list.map.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.pop = function() {
		return this.m_list.pop.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.push = function() {
		return this.m_list.push.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.reduce = function() {
		return this.m_list.reduce.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.reduceRight = function() {
		return this.m_list.reduceRight.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.reverse = function() {
		return this.m_list.reverse.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.shift = function() {
		return this.m_list.shift.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.slice = function() {
		return this.m_list.slice.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.some = function() {
		return this.m_list.some.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.sort = function() {
		return this.m_list.sort.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.splice = function() {
		return this.m_list.splice.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.toLocaleString = function() {
		return this.m_list.toLocaleString.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.unshift = function() {
		return this.m_list.unshift.apply(this.m_list, arguments);
	};
	oFF.XArrayWrapper.prototype.values = function() {
		return this.m_list.values.apply(this.m_list, arguments);
	};
	oFF.Base64 = {
		s_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		encode : function(input) {
			if (typeof btoa !== "undefined") {
				return btoa(encodeURIComponent(input).replace(
						/%([0-9A-F]{2})/g, function(match, p1) {
							return String.fromCharCode("0x" + p1);
						}));
			}
			var output = "";
			var i = 0;
			var keyStr = oFF.Base64.s_keyStr;
			do {
				var chr1 = input.charCodeAt(i++);
				var chr2 = input.charCodeAt(i++);
				var chr3 = input.charCodeAt(i++);
				var enc1 = chr1 >> 2;
				var enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				var enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				var enc4 = chr3 & 63;
				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else {
					if (isNaN(chr3)) {
						enc4 = 64;
					}
				}
				output += keyStr.charAt(enc1) + keyStr.charAt(enc2)
						+ keyStr.charAt(enc3) + keyStr.charAt(enc4);
			} while (i < input.length);
			return output;
		}
	};
	oFF.XStringTokenizer = {
		splitString : function(string, splitString) {
			if (string === null || splitString === null) {
				return null;
			}
			var splittedStrings = string.split(splitString);
			if (splittedStrings === null) {
				return null;
			}
			return new oFF.XListOfString(splittedStrings);
		}
	};
	oFF.XErrorHelper = {
		convertToString : function(error) {
			var sb = new oFF.XStringBuffer();
			if (error.hasCode()) {
				sb.append(error.getCode().toString()).appendNewLine();
			}
			var errorText = error.getText();
			if (errorText !== null) {
				sb.append(errorText).appendNewLine();
			}
			if (error.hasErrorCause()) {
				sb.append(error.getErrorCause().toString()).appendNewLine();
			}
			if (error.hasStackTrace()) {
				sb.append(error.getStackTrace().toString()).appendNewLine();
			}
			if (error.hasExtendedInfo()) {
				sb.append("Error with extended info").appendNewLine();
			}
			return sb.toString();
		},
		convertExceptionToString : function(throwable) {
			var sb = new oFF.XStringBuffer();
			if (throwable !== null) {
				if (typeof throwable.toString === "function") {
					sb.append(throwable.toString()).appendNewLine();
				}
				var json = JSON.stringify(throwable);
				if ("{}" !== json) {
					sb.append(json);
					sb.appendNewLine();
				}
			}
			return sb.toString();
		}
	};
	oFF.XStackTrace = function() {
		this.m_traces = new oFF.XListOfString();
		this._ff_c = "XStackTrace";
	};
	oFF.XStackTrace.prototype = new oFF.XObject();
	oFF.XStackTrace.create = function(removeLineCount) {
		var newError = new Error();
		var stackArray = newError.stack.split("\n");
		var len = stackArray.length;
		if (len > 1) {
			var newObj = new oFF.XStackTrace();
			if (len - 1 - removeLineCount > 0) {
				for (var i = 1 + removeLineCount; i < len; i++) {
					newObj.m_traces.add(stackArray[i].trim());
				}
			}
			return newObj;
		}
	};
	oFF.XStackTrace.supportsStackTrace = function() {
		return false;
	};
	oFF.XStackTrace.prototype.releaseObject = function() {
		this.m_traces = oFF.XObjectExt.release(this.m_traces);
		oFF.XStackTrace.$superclass.releaseObject.call(this);
	};
	oFF.XStackTrace.prototype.getStackTraceLines = function() {
		return this.m_traces.getValuesAsReadOnlyListOfString();
	};
	oFF.XStackTrace.prototype.toString = function() {
		return "";
	};
	oFF.XNativeStdio = function() {
	};
	oFF.XNativeStdio.prototype = new oFF.DfStdio();
	oFF.XNativeStdio.staticSetup = function() {
		oFF.XStdio.setInstance(new oFF.XNativeStdio());
	};
	oFF.XNativeStdio.prototype.println = function(text) {
		if (typeof jstestdriver !== "undefined" && jstestdriver.console) {
			jstestdriver.console.log(text);
		} else {
			if (oFF.XSystemUtils.isXS()) {
				$.trace.debug("Firefly: " + text);
			} else {
				if (console) {
					console.log(text);
				}
			}
		}
	};
	oFF.XNativeStdio.prototype.print = function(text) {
	};
	oFF.XHttpUtils = {
		s_reg1 : new RegExp("[\\\\]", "g"),
		s_reg2 : new RegExp('[\\"]', "g"),
		s_reg3 : new RegExp("[\\/]", "g"),
		s_reg4 : new RegExp("[\\b]", "g"),
		s_reg5 : new RegExp("[\\f]", "g"),
		s_reg6 : new RegExp("[\\n]", "g"),
		s_reg7 : new RegExp("[\\r]", "g"),
		s_reg8 : new RegExp("[\\t]", "g"),
		encodeURIComponent : function(unescaped) {
			return encodeURIComponent(unescaped);
		},
		decodeURIComponent : function(escaped) {
			return decodeURIComponent(escaped);
		},
		encodeByteArrayToBase64 : function(byteArray) {
			var nativeString = oFF.XByteArray.convertToString(byteArray);
			var encodedString;
			if (typeof Buffer !== "undefined" && typeof module !== "undefined"
					&& this.module !== module && module.exports) {
				encodedString = new Buffer(nativeString, "utf8")
						.toString("base64");
			} else {
				if (typeof window !== "undefined") {
					encodedString = window.btoa(oFF.XString
							.utf8Encode(nativeString));
				}
			}
			return encodedString;
		},
		decodeBase64ToByteArray : function(base64) {
			var decodedString = "";
			if (typeof Buffer !== "undefined" && typeof module !== "undefined"
					&& this.module !== module && module.exports) {
				decodedString = new Buffer(base64, "base64").toString();
			} else {
				if (typeof window !== "undefined") {
					decodedString = oFF.XString.utf8Decode(window.atob(base64));
				}
			}
			return oFF.XByteArray.convertFromString(decodedString);
		},
		escapeToJsonString : function(value) {
			var ref = oFF.XHttpUtils;
			if (value.indexOf("\\") !== -1) {
				value = value.replace(ref.s_reg1, "\\\\");
			}
			if (value.indexOf('"') !== -1) {
				value = value.replace(ref.s_reg2, '\\"');
			}
			if (value.indexOf("/") !== -1) {
				value = value.replace(ref.s_reg3, "\\/");
			}
			if (value.indexOf("\b") !== -1) {
				value = value.replace(ref.s_reg4, "\\b");
			}
			if (value.indexOf("\f") !== -1) {
				value = value.replace(ref.s_reg5, "\\f");
			}
			if (value.indexOf("\n") !== -1) {
				value = value.replace(ref.s_reg6, "\\n");
			}
			if (value.indexOf("\r") !== -1) {
				value = value.replace(ref.s_reg7, "\\r");
			}
			if (value.indexOf("\t") !== -1) {
				value = value.replace(ref.s_reg8, "\\t");
			}
			return value;
		}
	};
	oFF.QueuedCallbackProcessorHandle = function(nativeCallback,
			isErrorCallback) {
		if (nativeCallback === null) {
			throw new Error("Illegal State: illegal native callback");
		}
		this.m_nativeCallback = nativeCallback;
		this.m_isErrorCallback = isErrorCallback;
		this._ff_c = "QueuedCallbackProcessorHandle";
	};
	oFF.QueuedCallbackProcessorHandle.prototype = {
		releaseObject : function() {
			this.m_nativeCallback = null;
			oFF.QueuedCallbackProcessorHandle.$superclass.releaseObject
					.call(this);
		},
		processCallback : function() {
			this.m_nativeCallback();
		},
		isErrorCallback : function() {
			return this.m_isErrorCallback;
		}
	};
	oFF.QueuedCallbackProcessorHandle.create = function(nativeCallback,
			isErrorCallback) {
		return new oFF.QueuedCallbackProcessorHandle(nativeCallback,
				isErrorCallback);
	};
	oFF.env = oFF.env || {};
	oFF.XSystemUtils = {
		s_environmentProperties : null,
		getCurrentTimeInMilliseconds : function() {
			return new Date().getTime();
		},
		waitMillis : function(waitTimeInMillis) {
			if (waitTimeInMillis < 0) {
				throw new Error("Illegal Argument: illegal wait time");
			}
			var startTime = this.getCurrentTimeInMilliseconds();
			var currentTime = startTime;
			while (currentTime - startTime < waitTimeInMillis) {
				currentTime = this.getCurrentTimeInMilliseconds();
			}
		},
		processQueuedCallback : function(nativeQueue, callback) {
			if (nativeQueue === null) {
				throw new Error("Illegal Argument: illegal queue");
			}
			if (callback === null) {
				throw new Error("Illegal Argument: illegal callback");
			}
			nativeQueue.call("queued call", function(callbacks) {
				var nativeErrorCallback = callbacks.addErrback(function() {
				});
				var errorCallbackHandle = oFF.QueuedCallbackProcessorHandle
						.create(nativeErrorCallback, true);
				setTimeout(function() {
					callback.processCallback(errorCallbackHandle);
				}, 0);
				var nativeCallback = callbacks.add(function() {
				});
				var callbackHandle = oFF.QueuedCallbackProcessorHandle.create(
						nativeCallback, false);
				setTimeout(function() {
					callback.processCallback(callbackHandle);
				}, 0);
			});
			return true;
		},
		sleepMillisNonBlocking : function(sleepTimeInMillis, callback,
				customIdentifier) {
			if (sleepTimeInMillis < 0) {
				throw new Error("Illegal Argument: illegal sleep time");
			}
			if (callback === null) {
				throw new Error("Illegal Argument: illegal callback");
			}
			setTimeout(function() {
				callback.processCallback(customIdentifier);
			}, sleepTimeInMillis);
			return true;
		},
		getNativeEnvironment : function() {
			var oSystemUtils = oFF.XSystemUtils;
			var map;
			if (this.isNode()) {
				map = oSystemUtils.getNativeEnvironmentNodeJs();
			} else {
				if (this.isBrowser()) {
					map = oSystemUtils.getNativeEnvironmentBrowser();
				} else {
					map = oFF.XHashMapOfStringByString.create();
				}
			}
			oSystemUtils.addWiredEnvironment(map);
			return map;
		},
		getNativeEnvironmentBrowser : function() {
			var map = oFF.XHashMapOfStringByString.create();
			var search = new RegExp("([^&=]+)=?([^&]*)", "g");
			var decode = function(s) {
				return decodeURIComponent(s.replace(/[+]/g, " "));
			};
			var query = window.location.search.substring(1);
			var match;
			while (true) {
				match = search.exec(query);
				if (match === null) {
					break;
				}
				map.put(decode(match[1]), decode(match[2]));
			}
			return map;
		},
		getNativeEnvironmentNodeJs : function() {
			var oPrUtils = oFF.PrUtils;
			var parameters = oFF.XHashMapOfStringByString.create();
			var json = process.env;
			var jsonElementVariables = oFF.XJson.extractJsonContent(json);
			var jsonStructureVariables = oFF.PrStructure
					.createDeepCopy(jsonElementVariables);
			var variableNames = jsonStructureVariables
					.getKeysAsReadOnlyListOfString();
			if (variableNames !== null) {
				var len = variableNames.size();
				for (var variableIndex = 0; variableIndex < len; variableIndex++) {
					var variableName = variableNames.get(variableIndex);
					var variableValueString = oPrUtils.getStringProperty(
							jsonStructureVariables, variableName);
					if (variableValueString !== null) {
						parameters.put(variableName, variableValueString
								.getString());
					}
				}
			}
			process.argv.forEach(function(val) {
				var argument = val;
				var argumentSeparatorIndex = argument.indexOf("=");
				var argumentName;
				var argumentValue;
				if (argumentSeparatorIndex > -1) {
					argumentName = argument
							.substring(0, argumentSeparatorIndex);
					argumentValue = argument.substring(
							argumentSeparatorIndex + 1, argument.length);
					parameters.put(argumentName, argumentValue);
				}
			});
			return parameters;
		},
		addWiredEnvironment : function(map) {
			var oFireflyEnv = oFF.env;
			for ( var key in oFireflyEnv) {
				if (oFireflyEnv.hasOwnProperty(key)) {
					map.put(key, oFireflyEnv[key]);
				}
			}
		},
		isNode : function() {
			if (this.isNodeDetected === undefined) {
				try {
					this.isNodeDetected = Object.prototype.toString
							.call(typeof process !== "undefined" ? process : 0) === "[object process]";
				} catch (e) {
					this.isNodeDetected = false;
				}
			}
			return this.isNodeDetected;
		},
		isXS : function() {
			if (this.isXSDetected === undefined) {
				try {
					this.isXSDetected = (typeof $ !== "undefined" && $.db
							&& $.db.ina && $.trace);
				} catch (e) {
					this.isXSDetected = false;
				}
			}
			return this.isXSDetected;
		},
		isBrowser : function() {
			return ((typeof window !== "undefined")
					&& (window.location !== undefined) && (window.location.search !== undefined));
		},
		isGoogleAppsScript : function() {
			return oFF.GoogleUrlFetchApp !== undefined;
		},
		exit : function(exitCode) {
			if (oFF.XSystemUtils.isNode()) {
				process.exit(exitCode);
			}
		},
		getOsName : function() {
			if (oFF.XSystemUtils.isNode()) {
				return require("os").release();
			} else {
				if (oFF.XSystemUtils.isXS()) {
					return "XS";
				} else {
					if (oFF.XSystemUtils.isGoogleAppsScript()) {
						return "Google Apps";
					}
				}
			}
			var os = "Unknown";
			var userAgent = window.navigator.userAgent;
			if (userAgent.indexOf("Windows NT 10.0") !== -1) {
				os = "Windows 10";
			} else {
				if (userAgent.indexOf("Mac") !== -1) {
					os = "Mac/iOS";
				} else {
					if (userAgent.indexOf("Linux") !== -1) {
						os = "Linux";
					} else {
						if (userAgent.indexOf("X11") !== -1) {
							os = "UNIX";
						} else {
							if (userAgent.indexOf("Windows NT 5.1") !== -1) {
								os = "Windows XP";
							} else {
								if (userAgent.indexOf("Windows NT 6.0") !== -1) {
									os = "Windows Vista";
								} else {
									if (userAgent.indexOf("Windows NT 6.1") !== -1) {
										os = "Windows 7";
									} else {
										if (userAgent.indexOf("Windows NT 6.2") !== -1) {
											os = "Windows 8";
										} else {
											os = "Other";
										}
									}
								}
							}
						}
					}
				}
			}
			return os;
		}
	};
	oFF.XNativeDateTimeProvider = function() {
		oFF.XDateTimeProvider.call(this);
		this._ff_c = "XNativeDateTimeProvider";
	};
	oFF.XNativeDateTimeProvider.prototype = new oFF.XDateTimeProvider();
	oFF.XNativeDateTimeProvider.staticSetupNative = function() {
		var object = new oFF.XNativeDateTimeProvider();
		oFF.XDateTimeProvider.setInstance(object);
	};
	oFF.XNativeDateTimeProvider.prototype.getCurrentDateAtLocalTimezone = function() {
		var currentDate = new Date();
		var year = currentDate.getUTCFullYear();
		var month = currentDate.getUTCMonth() + 1;
		var day = currentDate.getUTCDate();
		return oFF.XDate.createDateWithValues(year, month, day);
	};
	oFF.XNativeDateTimeProvider.prototype.getCurrentDateTimeAtLocalTimezone = function() {
		var currentDate = new Date();
		var year = currentDate.getUTCFullYear();
		var month = currentDate.getUTCMonth() + 1;
		var day = currentDate.getUTCDate();
		var hour = currentDate.getUTCHours();
		var minute = currentDate.getUTCMinutes();
		var second = currentDate.getUTCSeconds();
		var millisecond = currentDate.getUTCMilliseconds();
		return oFF.XDateTime.createDateTimeWithValues(year, month, day, hour,
				minute, second, millisecond);
	};
	oFF.XNativeDateTimeProvider.prototype.getCurrentTimeAtLocalTimezone = function() {
		var currentDate = new Date();
		var hour = currentDate.getUTCHours();
		var minute = currentDate.getUTCMinutes();
		var second = currentDate.getUTCeconds();
		var millisecond = currentDate.getUTCMilliseconds();
		return oFF.XTime
				.createTimeWithValues(hour, minute, second, millisecond);
	};
	oFF.XNativeDateTimeProvider.prototype.getMillisecondsForDate = function(
			date) {
		var year = date.getYear();
		var month = date.getMonthOfYear();
		var day = date.getDayOfMonth();
		var backendDate = new Date(year, month - 1, day);
		var backendTime = backendDate.getTime();
		var userTimezoneOffset = backendDate.getTimezoneOffset() * 60000;
		var currentDate = backendTime - userTimezoneOffset;
		return currentDate;
	};
	oFF.XNativeDateTimeProvider.prototype.getMillisecondsForDateTime = function(
			dateTime) {
		var jsDate = new Date(dateTime.getYear(),
				dateTime.getMonthOfYear() - 1, dateTime.getDayOfMonth(),
				dateTime.getHourOfDay(), dateTime.getMinuteOfHour(), dateTime
						.getSecondOfMinute());
		var backendTime = jsDate.getTime();
		var userTimezoneOffset = jsDate.getTimezoneOffset() * 60000;
		var currentDate = backendTime - userTimezoneOffset;
		var currentDatetime = new Date(currentDate);
		return currentDatetime.getTime();
	};
	oFF.XNativeDateTimeProvider.prototype.getDateTimeFromMilliseconds = function(
			milliseconds) {
		var currentDate = new Date(milliseconds);
		var year = currentDate.getUTCFullYear();
		var month = currentDate.getUTCMonth() + 1;
		var day = currentDate.getUTCDate();
		var hour = currentDate.getUTCHours();
		var minute = currentDate.getUTCMinutes();
		var second = currentDate.getUTCSeconds();
		var millisecond = currentDate.getUTCMilliseconds();
		return oFF.XDateTime.createDateTimeWithValues(year, month, day, hour,
				minute, second, millisecond);
	};
	oFF.XNativeComparator = function(xComparator) {
		this.m_xComparator = xComparator;
		this.m_enclosing = null;
		this._ff_c = "XNativeComparator";
	};
	oFF.XNativeComparator.prototype = new oFF.XObject();
	oFF.XNativeComparator.prototype.releaseObject = function() {
		this.m_xComparator = null;
		this.m_enclosing = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XNativeComparator.prototype.compare = function(o1, o2) {
		return this.m_xComparator.compare(o1, o2);
	};
	oFF.XComparator = function(comparatorStrategy) {
		this._ff_c = "XComparator";
		this.m_comparatorStrategy = comparatorStrategy;
		this.m_nativeComparator = new oFF.XNativeComparator(this);
	};
	oFF.XComparator.prototype = new oFF.XObject();
	oFF.XComparator.create = function(comparatorStrategy) {
		return new oFF.XComparator(comparatorStrategy);
	};
	oFF.XComparator.prototype.releaseObject = function() {
		this.m_comparatorStrategy = null;
		this.m_nativeComparator = oFF.XObjectExt
				.release(this.m_nativeComparator);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XComparator.prototype.getComparatorStrategy = function() {
		return this.m_comparatorStrategy;
	};
	oFF.XComparator.prototype.compare = function(o1, o2) {
		return this.m_comparatorStrategy.compare(o1, o2);
	};
	oFF.XComparator.prototype.getNativeComparator = function() {
		return this.m_nativeComparator;
	};
	oFF.XNativeComparatorOfString = oFF.XNativeComparator;
	oFF.XComparatorOfString = function(comparatorStrategy) {
		this._ff_c = "XComparatorOfString";
		this.m_comparatorStrategy = comparatorStrategy;
		this.m_nativeComparator = new oFF.XNativeComparatorOfString(this);
	};
	oFF.XComparatorOfString.prototype = new oFF.XObject();
	oFF.XComparatorOfString.create = function(comparatorStrategy) {
		return new oFF.XComparatorOfString(comparatorStrategy);
	};
	oFF.XComparatorOfString.prototype.releaseObject = function() {
		this.m_comparatorStrategy = null;
		this.m_nativeComparator = oFF.XObjectExt
				.release(this.m_nativeComparator);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XComparatorOfString.prototype.getStringComparatorStrategy = function() {
		return this.m_comparatorStrategy;
	};
	oFF.XComparatorOfString.prototype.compare = function(s1, s2) {
		return this.m_comparatorStrategy.compare(s1, s2);
	};
	oFF.XComparatorOfString.prototype.getNativeComparator = function() {
		return this.m_nativeComparator;
	};
	oFF.XGuid = {
		getGuid : function() {
			var S4 = function() {
				return (((1 + Math.random()) * 65536) | 0).toString(16)
						.substring(1);
			};
			return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-"
					+ S4() + S4() + S4();
		}
	};
	oFF.XHashMap = function() {
		this._ff_c = "XHashMap";
		this.m_native = {};
	};
	oFF.XHashMap.prototype = new oFF.XObject();
	oFF.XHashMap.prototype.createMapCopyInternal = function() {
		var newMap = {};
		for ( var prop in this.m_native) {
			if (this.m_native.hasOwnProperty(prop)) {
				newMap[prop] = this.m_native[prop];
			}
		}
		return newMap;
	};
	oFF.XHashMap.prototype.releaseObject = function() {
		this.m_native = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XHashMap.prototype.clear = function() {
		this.m_native = {};
	};
	oFF.XHashMap.prototype.size = function() {
		return Object.keys(this.m_native).length;
	};
	oFF.XHashMap.prototype.isEmpty = function() {
		for ( var key in this.m_native) {
			if (this.m_native.hasOwnProperty(key)) {
				return false;
			}
		}
		return true;
	};
	oFF.XHashMap.prototype.hasElements = function() {
		for ( var key in this.m_native) {
			if (this.m_native.hasOwnProperty(key)) {
				return true;
			}
		}
		return false;
	};
	oFF.XHashMap.prototype.isEqualTo = function(other) {
		if (other === null) {
			return false;
		}
		if (this === other) {
			return true;
		}
		for ( var thisKey in this.m_native) {
			if (this.m_native.hasOwnProperty(thisKey)) {
				if (other.m_native.hasOwnProperty(thisKey) === false) {
					return false;
				}
				var thisValue = this.m_native[thisKey];
				var thatValue = other.m_native[thisKey];
				if (thisValue !== thatValue) {
					if (thisValue === null) {
						return false;
					}
					if (thisValue.isEqualTo(thatValue) === false) {
						return false;
					}
				}
			}
		}
		for ( var thatKey in other.m_native) {
			if (other.m_native.hasOwnProperty(thatKey)) {
				if (this.m_native.hasOwnProperty(thatKey) === false) {
					return false;
				}
			}
		}
		return true;
	};
	oFF.XHashMap.prototype.containsKey = function(key) {
		if (key === null) {
			return false;
		}
		return this.m_native.hasOwnProperty(key);
	};
	oFF.XHashMap.prototype.contains = function(value) {
		for ( var key in this.m_native) {
			if (this.m_native.hasOwnProperty(key)) {
				var element = this.m_native[key];
				if (element === value
						|| (element !== null && element.isEqualTo(value))) {
					return true;
				}
			}
		}
		return false;
	};
	oFF.XHashMap.prototype.getByKey = function(key) {
		var value = this.m_native[key];
		if (value === undefined) {
			return null;
		}
		return value;
	};
	oFF.XHashMap.prototype.putIfNotNull = function(key, element) {
		if (element !== null) {
			this.put(key, element);
		}
	};
	oFF.XHashMap.prototype.put = function(key, value) {
		if (key === null) {
			throw new Error("Illegal Argument: Key is null");
		}
		this.m_native[key] = value;
	};
	oFF.XHashMap.prototype.remove = function(key) {
		if (key !== null) {
			var element = this.m_native[key];
			delete this.m_native[key];
			return element;
		}
		return null;
	};
	oFF.XHashMap.prototype.getKeysAsReadOnlyList = function() {
		var list = new oFF.XListOfString();
		for ( var key in this.m_native) {
			if (this.m_native.hasOwnProperty(key)) {
				list.add(key);
			}
		}
		return list;
	};
	oFF.XHashMap.prototype.getValuesAsReadOnlyList = function() {
		var list = new oFF.XList();
		for ( var key in this.m_native) {
			if (this.m_native.hasOwnProperty(key)) {
				list.add(this.m_native[key]);
			}
		}
		return list;
	};
	oFF.XHashMap.prototype.getKeysAsIterator = function() {
		return new oFF.XIterator(this.getKeysAsReadOnlyList());
	};
	oFF.XHashMap.prototype.getIterator = function() {
		return new oFF.XIterator(this.getValuesAsReadOnlyList());
	};
	oFF.XHashMap.prototype.getMapFromImplementation = function() {
		return this.m_native;
	};
	oFF.XHashMap.prototype.toString = function() {
		return this.m_native.toString();
	};
	oFF.XHashMapByString = function() {
		oFF.XHashMap.call(this);
		this._ff_c = "XHashMapByString";
	};
	oFF.XHashMapByString.prototype = new oFF.XHashMap();
	oFF.XHashMapByString.create = function() {
		return new oFF.XHashMapByString();
	};
	oFF.XHashMapByString.prototype.createMapByStringCopy = function() {
		var hashMap = new oFF.XHashMapByString();
		hashMap.m_native = this.createMapCopyInternal();
		return hashMap;
	};
	oFF.XHashMapByString.prototype.clone = oFF.XHashMapByString.prototype.createMapByStringCopy;
	oFF.XHashMapByString.prototype.getKeysAsReadOnlyListOfString = oFF.XHashMapByString.prototype.getKeysAsReadOnlyList;
	oFF.XHashMapByString.prototype.getKeysAsIteratorOfString = oFF.XHashMapByString.prototype.getKeysAsIterator;
	oFF.XHashMapOfStringByString = function() {
		oFF.XHashMap.call(this);
		this._ff_c = "XHashMapOfStringByString";
	};
	oFF.XHashMapOfStringByString.prototype = new oFF.XHashMap();
	oFF.XHashMapOfStringByString.create = function() {
		return new oFF.XHashMapOfStringByString();
	};
	oFF.XHashMapOfStringByString.createMapOfStringByStringStaticCopy = function(
			map) {
		if (map === null || map === undefined) {
			return null;
		}
		var hashMap = new oFF.XHashMapOfStringByString();
		var keys = map.getKeysAsIteratorOfString();
		while (keys.hasNext()) {
			var key = keys.next();
			hashMap.put(key, map.getByKey(key));
		}
		return hashMap;
	};
	oFF.XHashMapOfStringByString.prototype.createMapOfStringByStringCopy = function() {
		var hashMap = new oFF.XHashMapOfStringByString();
		hashMap.m_native = this.createMapCopyInternal();
		return hashMap;
	};
	oFF.XHashMapOfStringByString.prototype.isEqualTo = function(other) {
		if (other === null) {
			return false;
		}
		if (this === other) {
			return true;
		}
		for ( var thisKey in this.m_native) {
			if (this.m_native.hasOwnProperty(thisKey)) {
				if (this.m_native[thisKey] !== other.m_native[thisKey]) {
					return false;
				}
			}
		}
		for ( var thatKey in other.m_native) {
			if (other.m_native.hasOwnProperty(thatKey)) {
				if (this.m_native.hasOwnProperty(thatKey) === false) {
					return false;
				}
			}
		}
		return true;
	};
	oFF.XHashMapOfStringByString.prototype.getValuesAsReadOnlyListOfString = function() {
		var list = new oFF.XListOfString();
		for ( var key in this.m_native) {
			if (this.m_native.hasOwnProperty(key)) {
				list.add(this.m_native[key]);
			}
		}
		return list;
	};
	oFF.XHashMapOfStringByString.prototype.getIterator = function() {
		return new oFF.XIterator(this.getValuesAsReadOnlyList());
	};
	oFF.XHashMapOfStringByString.prototype.getKeysAsReadOnlyListOfString = function() {
		var list = new oFF.XListOfString();
		for ( var key in this.m_native) {
			if (this.m_native.hasOwnProperty(key)) {
				list.add(key);
			}
		}
		return list;
	};
	oFF.XHashMapOfStringByString.prototype.getKeysAsIteratorOfString = oFF.XHashMapOfStringByString.prototype.getKeysAsIterator;
	oFF.XHashMapOfStringByString.prototype.toString = function() {
		var keyIterator = this.getKeysAsIterator();
		var buffer = new oFF.XStringBuffer();
		while (keyIterator.hasNext()) {
			var key = keyIterator.next();
			var value = this.getByKey(key);
			buffer.append(key + "=" + value);
			if (keyIterator.hasNext()) {
				buffer.append(",");
			}
		}
		return buffer.toString();
	};
	oFF.XHashSetOfString = function() {
		this.m_native = {};
		this._ff_c = "XHashSetOfString";
	};
	oFF.XHashSetOfString.prototype = new oFF.XObject();
	oFF.XHashSetOfString.create = function() {
		return new oFF.XHashSetOfString();
	};
	oFF.XHashSetOfString.prototype.createSetCopy = function() {
		var hashSet = new oFF.XHashSetOfString();
		for ( var key in this.m_native) {
			if (this.m_native.hasOwnProperty(key)) {
				hashSet.m_native[key] = this.m_native[key];
			}
		}
		return hashSet;
	};
	oFF.XHashSetOfString.prototype.clone = oFF.XHashSetOfString.prototype.createSetCopy;
	oFF.XHashSetOfString.prototype.releaseObject = function() {
		this.m_native = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XHashSetOfString.prototype.isEqualTo = function(other) {
		if (other === null) {
			return false;
		}
		if (this === other) {
			return true;
		}
		for ( var thisKey in this.m_native) {
			if (this.m_native.hasOwnProperty(thisKey)) {
				if (other.m_native.hasOwnProperty(thisKey) === false) {
					return false;
				}
			}
		}
		for ( var thatKey in other.m_native) {
			if (other.m_native.hasOwnProperty(thatKey)) {
				if (this.m_native.hasOwnProperty(thatKey) === false) {
					return false;
				}
			}
		}
		return true;
	};
	oFF.XHashSetOfString.prototype.clear = function() {
		for ( var key in this.m_native) {
			if (this.m_native.hasOwnProperty(key)) {
				delete this.m_native[key];
			}
		}
	};
	oFF.XHashSetOfString.prototype.size = function() {
		return Object.keys(this.m_native).length;
	};
	oFF.XHashSetOfString.prototype.isEmpty = function() {
		for ( var key in this.m_native) {
			if (this.m_native.hasOwnProperty(key)) {
				return false;
			}
		}
		return true;
	};
	oFF.XHashSetOfString.prototype.hasElements = function() {
		return this.isEmpty() === false;
	};
	oFF.XHashSetOfString.prototype.contains = function(key) {
		if (key === null) {
			return false;
		}
		return this.m_native.hasOwnProperty(key);
	};
	oFF.XHashSetOfString.prototype.add = function(key) {
		if (key === null) {
			throw new Error("Illegal Argument: null");
		}
		this.m_native[key] = true;
	};
	oFF.XHashSetOfString.prototype.putAll = function(elements) {
		if (elements !== null) {
			var size = elements.size();
			for (var i = 0; i < size; i++) {
				this.m_native[elements.get(i)] = true;
			}
		}
	};
	oFF.XHashSetOfString.prototype.removeElement = function(key) {
		if (key !== null) {
			delete this.m_native[key];
		}
		return key;
	};
	oFF.XHashSetOfString.prototype.getValuesAsReadOnlyListOfString = function() {
		var list = new oFF.XListOfString();
		for ( var key in this.m_native) {
			if (this.m_native.hasOwnProperty(key)) {
				list.add(key);
			}
		}
		return list;
	};
	oFF.XHashSetOfString.prototype.getValuesAsIterator = function() {
		return new oFF.XIterator(this.getValuesAsReadOnlyListOfString());
	};
	oFF.XHashSetOfString.prototype.getIterator = oFF.XHashSetOfString.prototype.getValuesAsIterator;
	oFF.XHashSetOfString.prototype.addAll = function(otherList) {
		oFF.XListUtils.addAllStrings(otherList, this);
	};
	oFF.XHashSetOfString.prototype.toString = function() {
		return this.m_native.toString();
	};
	oFF.XIterator = function(list) {
		this.m_readOnlyValues = list;
		this.m_position = -1;
		this._ff_c = "XIterator";
	};
	oFF.XIterator.prototype = new oFF.XObject();
	oFF.XIterator.createFromList = function(list) {
		return new oFF.XIterator(list);
	};
	oFF.XIterator.prototype.releaseObject = function() {
		this.m_readOnlyValues = null;
		this.m_position = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XIterator.prototype.hasNext = function() {
		return this.m_position + 1 < this.m_readOnlyValues.size();
	};
	oFF.XIterator.prototype.next = function() {
		return this.m_readOnlyValues.get(++this.m_position);
	};
	oFF.XList = function(copy) {
		oFF.XArrayWrapper.call(this, copy);
		this._ff_c = "XList";
	};
	oFF.XList.prototype = new oFF.XArrayWrapper();
	oFF.XList.create = function() {
		return new oFF.XList();
	};
	oFF.XList.nativeSortAscending = function(a, b) {
		return a.compareTo(b);
	};
	oFF.XList.nativeSortDescending = function(a, b) {
		return b.compareTo(a);
	};
	oFF.XList.prototype.createListCopy = function() {
		return new oFF.XList(this.m_list);
	};
	oFF.XList.prototype.sublist = function(beginIndex, endIndex) {
		var end = endIndex === -1 ? this.m_list.length : endIndex;
		return new oFF.XList(this.m_list.slice(beginIndex, end));
	};
	oFF.XList.prototype.addAll = function(elements) {
		oFF.XListUtils.addAllObjects(elements, this);
	};
	oFF.XList.prototype.add = function(oElement) {
		this.m_list[this.m_list.length] = oElement;
	};
	oFF.XList.prototype.isEqualTo = function(other) {
		if (other === null) {
			return false;
		}
		if (this === other) {
			return true;
		}
		var size = this.m_list.length;
		if (size !== other.m_list.length) {
			return false;
		}
		var thisEntry, thatEntry;
		for (var idx = 0; idx < size; idx++) {
			thisEntry = this.m_list[idx];
			thatEntry = other.m_list[idx];
			if (thisEntry === null && thatEntry === null) {
				continue;
			}
			if (thisEntry === null || thatEntry === null) {
				return false;
			}
			if (!thisEntry.isEqualTo(thatEntry)) {
				return false;
			}
		}
		return true;
	};
	oFF.XList.prototype.insert = function(index, element) {
		var i = this.m_list.length;
		if (index < 0 || index > i) {
			throw new Error("Illegal Argument: illegal index");
		}
		index = index || 0;
		while (i > index) {
			this.m_list[i] = this.m_list[--i];
		}
		this.m_list[index] = element;
	};
	oFF.XList.prototype.clear = function() {
		this.m_list.length = 0;
	};
	oFF.XList.prototype.getIndex = function(element) {
		var len = this.m_list.length;
		var i;
		var thisElement;
		for (i = 0; i < len; i++) {
			thisElement = this.m_list[i];
			if (thisElement === element) {
				return i;
			}
			if (thisElement !== null && thisElement.isEqualTo(element)) {
				return i;
			}
		}
		return -1;
	};
	oFF.XList.prototype.contains = function(element) {
		var len = this.m_list.length;
		var i;
		var thisElement;
		for (i = 0; i < len; i++) {
			thisElement = this.m_list[i];
			if (thisElement === element) {
				return true;
			}
			if (thisElement !== null && thisElement.isEqualTo(element)) {
				return true;
			}
		}
		return false;
	};
	oFF.XList.prototype.moveElement = function(fromIndex, toIndex) {
		var size = this.m_list.length;
		if (fromIndex < 0 || fromIndex >= size) {
			throw new Error("Illegal Argument: illegal fromIndex");
		}
		if (toIndex < 0 || toIndex >= size) {
			throw new Error("Illegal Argument: illegal toIndex");
		}
		if (toIndex !== fromIndex) {
			fromIndex = fromIndex || 0;
			toIndex = toIndex || 0;
			var oElement = this.m_list[fromIndex];
			while (fromIndex < size) {
				this.m_list[fromIndex] = this.m_list[++fromIndex];
			}
			--size;
			while (size > toIndex) {
				this.m_list[size] = this.m_list[--size];
			}
			this.m_list[toIndex] = oElement;
		}
	};
	oFF.XList.prototype.removeAt = function(index) {
		var size = this.m_list.length;
		if (index < 0 || index >= size) {
			throw new Error("Illegal Argument: illegal index");
		}
		index = index || 0;
		var oElement = this.m_list[index];
		while (index < size) {
			this.m_list[index] = this.m_list[++index];
		}
		--this.m_list.length;
		return oElement;
	};
	oFF.XList.prototype.removeElement = function(element) {
		var i;
		var len = this.m_list.length;
		var thisElement;
		for (i = 0; i < len; i++) {
			thisElement = this.m_list[i];
			if (thisElement === element) {
				break;
			}
			if (thisElement !== null && thisElement.isEqualTo(element)) {
				break;
			}
		}
		if (i < len) {
			while (i < len) {
				this.m_list[i] = this.m_list[++i];
			}
			--this.m_list.length;
		}
		return element;
	};
	oFF.XList.prototype.getIterator = function() {
		return new oFF.XIterator(this);
	};
	oFF.XList.prototype.getValuesAsReadOnlyList = function() {
		return this;
	};
	oFF.XList.prototype.sortByDirection = function(sortDirection) {
		var oFirefly = sap.firefly;
		if (sortDirection === oFirefly.XSortDirection.ASCENDING) {
			this.m_list.sort(oFirefly.XList.nativeSortAscending);
		} else {
			if (sortDirection === oFirefly.XSortDirection.DESCENDING) {
				this.m_list.sort(oFirefly.XList.nativeSortDescending);
			} else {
				throw new Error("Illegal Argument: illegal sort direction");
			}
		}
	};
	oFF.XList.prototype.sortByComparator = function(sortComparator) {
		this.m_list.sort(function(a, b) {
			return sortComparator.compare(a, b);
		});
	};
	oFF.XList.prototype.toString = function() {
		return "[" + this.m_list.join(", ") + "]";
	};
	oFF.XListOfString = function(copy) {
		oFF.XList.call(this, copy);
		this._ff_c = "XListOfString";
	};
	oFF.XListOfString.prototype = new oFF.XList();
	oFF.XListOfString.create = function() {
		return new oFF.XListOfString();
	};
	oFF.XListOfString.createFromReadOnlyList = function(readOnlyList) {
		return new oFF.XListOfString(readOnlyList.m_list);
	};
	oFF.XListOfString.prototype.createListOfStringCopy = function() {
		return new oFF.XListOfString(this.m_list);
	};
	oFF.XListOfString.prototype.getIndex = function(element) {
		var len = this.m_list.length;
		var i;
		for (i = 0; i < len; i++) {
			if (this.m_list[i] === element) {
				return i;
			}
		}
		return -1;
	};
	oFF.XListOfString.prototype.removeElement = function(element) {
		var i;
		var len = this.m_list.length;
		var thisElement;
		for (i = 0; i < len; i++) {
			thisElement = this.m_list[i];
			if (thisElement === element) {
				break;
			}
		}
		if (i < len) {
			while (i < len) {
				this.m_list[i] = this.m_list[++i];
			}
			--this.m_list.length;
		}
		return element;
	};
	oFF.XListOfString.prototype.contains = function(element) {
		var len = this.m_list.length;
		var i;
		for (i = 0; i < len; i++) {
			if (this.m_list[i] === element) {
				return true;
			}
		}
		return false;
	};
	oFF.XListOfString.prototype.isEqualTo = function(other) {
		if (other === null) {
			return false;
		}
		if (this === other) {
			return true;
		}
		var len = this.m_list.length;
		if (len !== other.m_list.length) {
			return false;
		}
		for (var idx = 0; idx < len; idx++) {
			if (this.m_list[idx] !== other.m_list[idx]) {
				return false;
			}
		}
		return true;
	};
	oFF.XListOfString.prototype.sortByDirection = function(sortDirection) {
		if (sortDirection === oFF.XSortDirection.ASCENDING) {
			this._quickSort(0, this.m_list.length);
		} else {
			if (sortDirection === oFF.XSortDirection.DESCENDING) {
				this._quickSort(0, this.m_list.length);
				this.m_list.reverse();
			} else {
				throw new Error("Illegal Argument: illegal sort direction");
			}
		}
	};
	oFF.XListOfString.prototype._partition = function(left, right) {
		var cmp = this.m_list[right - 1], minEnd = left, maxEnd;
		for (maxEnd = left; maxEnd < right - 1; maxEnd++) {
			if (this.m_list[maxEnd] <= cmp) {
				this._swap(maxEnd, minEnd);
				++minEnd;
			}
		}
		this._swap(minEnd, right - 1);
		return minEnd;
	};
	oFF.XListOfString.prototype._swap = function(i, j) {
		var temp = this.m_list[i];
		this.m_list[i] = this.m_list[j];
		this.m_list[j] = temp;
	};
	oFF.XListOfString.prototype._quickSort = function(left, right) {
		if (left < right) {
			var p = this._partition(left, right);
			this._quickSort(left, p);
			this._quickSort(p + 1, right);
		}
	};
	oFF.XListOfString.prototype.getIterator = function() {
		return new oFF.XIterator(this);
	};
	oFF.XListOfString.prototype.getValuesAsReadOnlyListOfString = function() {
		return this;
	};
	oFF.XListOfString.prototype.copyFrom = function(source, sourceIndex,
			destinationIndex, length) {
	};
	oFF.XListOfString.prototype.createCopyByIndex = function(sourceIndex,
			length) {
		return null;
	};
	oFF.XArray = function(size, copy) {
		this._ff_c = "XArray";
		oFF.XArrayWrapper.call(this, copy);
		var i;
		if (copy === undefined && size) {
			this.m_list.length = size;
			for (i = 0; i < size; i++) {
				this.m_list[i] = null;
			}
		}
	};
	oFF.XArray.prototype = new oFF.XArrayWrapper();
	oFF.XArray.create = function(size) {
		return new oFF.XArray(size);
	};
	oFF.XArray.prototype.assertIndexIsValid = function(index) {
		if (index >= this.m_list.length) {
			throw new Error(
					"Illegal Argument: Index exceeds size of this array");
		}
	};
	oFF.XArray.prototype.clear = function() {
		var len = this.m_list.length;
		var i;
		for (i = 0; i < len; i++) {
			this.m_list[i] = null;
		}
	};
	oFF.XArrayOfInt = function(size, copy) {
		oFF.XArray.call(this, size, copy);
		this._ff_c = "XArrayOfInt";
		var i;
		if (copy === undefined && size) {
			this.m_list.length = size;
			for (i = 0; i < size; i++) {
				this.m_list[i] = 0;
			}
		}
	};
	oFF.XArrayOfInt.prototype = new oFF.XArray();
	oFF.XArrayOfInt.create = function(size) {
		return new oFF.XArrayOfInt(size);
	};
	oFF.XArrayOfInt.prototype.clear = function() {
		var len = this.m_list.length;
		var i;
		for (i = 0; i < len; i++) {
			this.m_list[i] = 0;
		}
	};
	oFF.XArrayOfInt.prototype.copyFrom = function(source, sourceIndex,
			destinationIndex, length) {
		if (sourceIndex < 0 || destinationIndex < 0 || length < 0) {
			throw new Error("Illegal Argument: Index must be >= 0");
		}
		if (destinationIndex + length > this.m_list.length) {
			throw new Error(
					"Illegal Argument: DestinationIndex will exceed size of this array");
		}
		if (sourceIndex + length > source.m_list.length) {
			throw new Error(
					"Illegal Argument: SourceIndex will exceed size of source array");
		}
		var i;
		for (i = 0; i < length; i++) {
			this.m_list[i + destinationIndex] = source.m_list[i + sourceIndex];
		}
	};
	oFF.XArrayOfInt.prototype.clone = function() {
		return new oFF.XArrayOfInt(-1, this.m_list);
	};
	oFF.XArrayOfInt.prototype.createCopyByIndex = function(sourceIndex, length) {
		var copy = new oFF.XArrayOfInt(length);
		copy.copyFrom(this, sourceIndex, 0, length);
		return copy;
	};
	oFF.XArrayOfString = function(size, copy) {
		oFF.XArray.call(this, size, copy);
		this._ff_c = "XArrayOfString";
	};
	oFF.XArrayOfString.prototype = new oFF.XArray();
	oFF.XArrayOfString.create = function(size) {
		return new oFF.XArrayOfString(size);
	};
	oFF.XArrayOfString.prototype.copyFrom = function(source, sourceIndex,
			destinationIndex, length) {
		if (sourceIndex < 0 || destinationIndex < 0 || length < 0) {
			throw new Error("Illegal Argument: Index must be >= 0");
		}
		if (destinationIndex + length > this.m_list.length) {
			throw new Error(
					"Illegal Argument: DestinationIndex will exceed size of this array");
		}
		if (sourceIndex + length > source.m_list.length) {
			throw new Error(
					"Illegal Argument: SourceIndex will exceed size of source array");
		}
		var i;
		for (i = 0; i < length; i++) {
			this.m_list[i + destinationIndex] = source.m_list[i + sourceIndex];
		}
	};
	oFF.XArrayOfString.prototype.clone = function() {
		return new oFF.XArrayOfString(-1, this.m_list);
	};
	oFF.XArrayOfString.prototype.createCopyByIndex = function(sourceIndex,
			length) {
		var copy = new oFF.XArrayOfString(length);
		copy.copyFrom(this, sourceIndex, 0, length);
		return copy;
	};
	oFF.PlatformModule = function() {
		oFF.DfModule.call(this);
		this._ff_c = "PlatformModule";
	};
	oFF.PlatformModule.prototype = new oFF.DfModule();
	oFF.PlatformModule.s_module = null;
	oFF.PlatformModule.getInstance = function() {
		return oFF.PlatformModule.initVersion(oFF.XVersion.API_DEFAULT);
	};
	oFF.PlatformModule.initVersion = function(version) {
		if (oFF.PlatformModule.s_module === null) {
			if (oFF.CoreModule.initVersion(version) === null) {
				throw new Error("Initialization Exception");
			}
			oFF.XLanguage.setLanguage(oFF.XLanguage.JAVASCRIPT);
			oFF.XPlatform.setPlatform(oFF.XPlatform.BROWSER);
			oFF.XSyncEnv.setSyncEnv(oFF.XSyncEnv.EXTERNAL_MAIN_LOOP);
			oFF.XNativeDateTimeProvider.staticSetupNative();
			oFF.XNativeStdio.staticSetup();
			oFF.PlatformModule.s_module = new oFF.PlatformModule();
		}
		return oFF.PlatformModule.s_module;
	};
	oFF.PlatformModule.getInstance();
	oFF.XReflection = {
		getMethods : function() {
			return null;
		},
		getMembers : function() {
			return null;
		},
		invokeMethod : function(target, methodName, returnType) {
			var result = target[methodName]();
			return this.getBandungObject(result, returnType);
		},
		invokeMethodWithArgs : function(target, methodName, args, returnType) {
			var paramValues = [];
			for (var i = 0; i < args.size(); i++) {
				paramValues.push(this.getNativeObject(args.get(i)));
			}
			var result = target[methodName].apply(target, paramValues);
			return this.getBandungObject(result, returnType);
		},
		getNativeObject : function(param) {
			var obj = param.getValue();
			if (obj !== null && obj !== undefined && param.isWrapped()) {
				if (obj instanceof oFF.XStringValue) {
					return obj.getString();
				}
				if (obj instanceof oFF.XDoubleValue) {
					return obj.getDouble();
				}
				if (obj instanceof oFF.XIntegerValue) {
					return obj.getInteger();
				}
				if (obj instanceof oFF.XBooleanValue) {
					return obj.getBoolean();
				}
				if (obj instanceof oFF.XLongValue) {
					return obj.getLong();
				}
			}
			return obj;
		},
		getBandungObject : function(obj, returnType) {
			var xParam = oFF.XReflectionParam;
			if (typeof obj === "string" || typeof obj === "number"
					|| typeof obj === "boolean") {
				var xType = oFF.PrimitiveType;
				if (returnType === xType.STRING) {
					return xParam.createString(obj);
				}
				if (returnType === xType.DOUBLE) {
					return xParam.createDouble(obj);
				}
				if (returnType === xType.INTEGER) {
					return xParam.createInteger(obj);
				}
				if (returnType === xType.BOOLEAN) {
					return xParam.createBoolean(obj);
				}
				if (returnType === xType.LONG) {
					return xParam.createLong(obj);
				}
			}
			return xParam.create(obj);
		}
	};
	oFF.XSha1 = {
		createSHA1 : function(text) {
			if (text === null) {
				return null;
			}
			var blockstart;
			var i;
			var W = [];
			var H0 = 1732584193;
			var H1 = 4023233417;
			var H2 = 2562383102;
			var H3 = 271733878;
			var H4 = 3285377520;
			var A, B, C, D, E;
			var temp;
			var XSha1 = oFF.XSha1;
			var fnRotateLeft = XSha1.rotateLeft;
			var fnCvtHex = XSha1.cvtHex;
			var msg = oFF.XString.utf8Encode(text);
			var msgLen = msg.length;
			var wordArray = [];
			for (i = 0; i < msgLen - 3; i += 4) {
				wordArray.push(msg.charCodeAt(i) << 24
						| msg.charCodeAt(i + 1) << 16
						| msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3));
			}
			switch (msgLen % 4) {
			case 0:
				wordArray.push(2147483648);
				break;
			case 1:
				wordArray.push(msg.charCodeAt(msgLen - 1) << 24 | 8388608);
				break;
			case 2:
				wordArray.push(msg.charCodeAt(msgLen - 2) << 24
						| msg.charCodeAt(msgLen - 1) << 16 | 32768);
				break;
			default:
				wordArray.push(msg.charCodeAt(msgLen - 3) << 24
						| msg.charCodeAt(msgLen - 2) << 16
						| msg.charCodeAt(msgLen - 1) << 8 | 128);
				break;
			}
			while (wordArray.length % 16 !== 14) {
				wordArray.push(0);
			}
			wordArray.push(msgLen >>> 29);
			wordArray.push((msgLen << 3) & 4294967295);
			var wordArrayLen = wordArray.length;
			for (blockstart = 0; blockstart < wordArrayLen; blockstart += 16) {
				for (i = 0; i < 16; i++) {
					W[i] = wordArray[blockstart + i];
				}
				for (i = 16; i <= 79; i++) {
					W[i] = fnRotateLeft(W[i - 3] ^ W[i - 8] ^ W[i - 14]
							^ W[i - 16], 1);
				}
				A = H0;
				B = H1;
				C = H2;
				D = H3;
				E = H4;
				for (i = 0; i <= 19; i++) {
					temp = (fnRotateLeft(A, 5) + ((B & C) | (~B & D)) + E
							+ W[i] + 1518500249) & 4294967295;
					E = D;
					D = C;
					C = fnRotateLeft(B, 30);
					B = A;
					A = temp;
				}
				for (i = 20; i <= 39; i++) {
					temp = (fnRotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 1859775393) & 4294967295;
					E = D;
					D = C;
					C = fnRotateLeft(B, 30);
					B = A;
					A = temp;
				}
				for (i = 40; i <= 59; i++) {
					temp = (fnRotateLeft(A, 5) + ((B & C) | (B & D) | (C & D))
							+ E + W[i] + 2400959708) & 4294967295;
					E = D;
					D = C;
					C = fnRotateLeft(B, 30);
					B = A;
					A = temp;
				}
				for (i = 60; i <= 79; i++) {
					temp = (fnRotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 3395469782) & 4294967295;
					E = D;
					D = C;
					C = fnRotateLeft(B, 30);
					B = A;
					A = temp;
				}
				H0 = (H0 + A) & 4294967295;
				H1 = (H1 + B) & 4294967295;
				H2 = (H2 + C) & 4294967295;
				H3 = (H3 + D) & 4294967295;
				H4 = (H4 + E) & 4294967295;
			}
			return (fnCvtHex(H0) + fnCvtHex(H1) + fnCvtHex(H2) + fnCvtHex(H3) + fnCvtHex(H4))
					.toLowerCase();
		},
		cvtHex : function(val) {
			var str = "";
			var i;
			var v;
			for (i = 7; i >= 0; i--) {
				v = (val >>> (i * 4)) & 15;
				str += v.toString(16);
			}
			return str;
		},
		rotateLeft : function(n, s) {
			return (n << s) | (n >>> (32 - s));
		}
	};
})(sap.firefly);