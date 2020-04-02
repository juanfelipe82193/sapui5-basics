(function(oFF) {
	oFF.XComparatorDouble = function() {
	};
	oFF.XComparatorDouble.prototype = new oFF.XObject();
	oFF.XComparatorDouble.create = function() {
		return new oFF.XComparatorDouble();
	};
	oFF.XComparatorDouble.prototype.compare = function(o1, o2) {
		var s1 = o1.getDouble();
		var s2 = o2.getDouble();
		if (s1 === s2) {
			return 0;
		} else {
			if (s1 > s2) {
				return 1;
			} else {
				return -1;
			}
		}
	};
	oFF.XComparatorName = function() {
	};
	oFF.XComparatorName.prototype = new oFF.XObject();
	oFF.XComparatorName.create = function() {
		return new oFF.XComparatorName();
	};
	oFF.XComparatorName.prototype.compare = function(o1, o2) {
		var s1 = o1.getName();
		var s2 = o2.getName();
		return oFF.XString.compare(s1, s2);
	};
	oFF.XListUtils = {
		addAllObjects : function(source, target) {
			var list;
			var size;
			var i;
			if (oFF.notNull(source) && source !== target) {
				list = source.getValuesAsReadOnlyList();
				size = list.size();
				for (i = 0; i < size; i++) {
					target.add(list.get(i));
				}
			}
		},
		addAllStrings : function(source, target) {
			var list;
			var size;
			var i;
			if (oFF.notNull(source) && source !== target) {
				list = source.getValuesAsReadOnlyListOfString();
				size = list.size();
				for (i = 0; i < size; i++) {
					target.add(list.get(i));
				}
			}
		},
		isListEquals : function(thisObject, otherObject) {
			var idx;
			if (oFF.isNull(otherObject)) {
				return false;
			}
			if (thisObject === otherObject) {
				return true;
			}
			if (thisObject.size() !== otherObject.size()) {
				return false;
			}
			for (idx = 0; idx < thisObject.size(); idx++) {
				if (thisObject.get(idx) === null
						&& otherObject.get(idx) === null) {
					continue;
				} else {
					if (thisObject.get(idx) === null
							|| otherObject.get(idx) === null) {
						return false;
					} else {
						if (!thisObject.get(idx)
								.isEqualTo(otherObject.get(idx))) {
							return false;
						}
					}
				}
			}
			return true;
		}
	};
	oFF.PrimitiveType = {
		BOOLEAN : "Boolean",
		STRING : "String",
		INTEGER : "Integer",
		DOUBLE : "Double",
		LONG : "Long"
	};
	oFF.XVersion = {
		LIBRARY : 18111301,
		GIT_COMMIT_ID : "$$GitCommitId$$",
		MIN : 89,
		MAX : 114,
		DEFAULT_VALUE : 89,
		V89_DIMENSION_HIERARCHY_LEVELS_BW : 89,
		V90_CALCULATED_DIMENSIONS_REL : 90,
		V91_MEASURE_BASENAME : 91,
		V92_REPO_RS_EXPORT : 92,
		V93_PRESENTATION_LENGTH : 93,
		V94_VISUAL_AGGREGATION : 94,
		V95_NO_MEASURE_READMODE : 95,
		V96_NO_EMPTY_OPTIONS : 96,
		V97_NO_EMPTY_SORT : 97,
		V98_NO_NON_EMPTY : 98,
		V99_NO_DUPLICATED_READMODE : 99,
		V100_HIERARCHY_LEVEL : 100,
		V101_ACTIVATE_DEFAULT_HIERARCHY : 101,
		V102_UNIVERSAL_DISPLAY_HIERARCHY_ZERO_BASED : 102,
		V103_OPTIMIZE_HIERARCHY_EXPORT : 103,
		V104_IS_USED_CONDITION : 104,
		V105_ASSERT_RESULTSET_BOUNDARIES : 105,
		V106_CUBE_CACHE : 106,
		V107_EXT_KEYFIGURE_PROPERTIES : 107,
		V108_EXPORT_FREE_AXIS_FOR_PLANNING : 108,
		V109_NUMBER_AS_STRING : 109,
		V110_ABSOLUTE_HIERARCHY_LEVEL : 110,
		V111_QDATA_CELL_MODEL_DEFAULTS : 111,
		V112_CLIENT_INFO_METADATA : 112,
		V113_OPTIMIZE_MDS_CATALOG : 113,
		V114_DONT_REQUEST_PERFORMANCE_DATA_BY_DEFAULT : 114,
		V999_NEW_VAR_VALUE_HELP : 999,
		API_ACTIVE : 0,
		API_MAX : 3,
		API_MIN : 2,
		API_DEFAULT : 2,
		API_V2_COLLECTIONS : 2,
		API_V3_SYNC_ACTION : 3,
		staticSetupByVersion : function(version) {
			if (version === -1) {
				oFF.XVersion.API_ACTIVE = oFF.XVersion.API_MAX;
			} else {
				if (version === 0) {
					oFF.XVersion.API_ACTIVE = oFF.XVersion.API_MIN;
				} else {
					oFF.XVersion.API_ACTIVE = oFF.XMath
							.clamp(oFF.XVersion.API_MIN, oFF.XVersion.API_MAX,
									version);
				}
			}
		},
		check : function(trigger, replacement) {
			if (oFF.XVersion.API_ACTIVE >= trigger) {
				throw oFF.XException
						.createRuntimeException(oFF.XStringUtils
								.concatenate2(
										"Method is deprecated, suggested replacement: ",
										replacement));
			}
		},
		getLibVersion : function(versionContext) {
			var libVerBuffer = oFF.XStringBuffer.create();
			libVerBuffer.append("[FF-XV:").appendInt(
					versionContext.getVersion());
			libVerBuffer.append("/LV:").appendInt(oFF.XVersion.LIBRARY);
			libVerBuffer.append("/GC:").append(oFF.XVersion.GIT_COMMIT_ID);
			libVerBuffer.append("/LG:").append(
					oFF.XLanguage.getLanguage().getName()).append("]");
			return libVerBuffer.toString();
		}
	};
	oFF.XKeyValuePair = function() {
	};
	oFF.XKeyValuePair.prototype = new oFF.XObject();
	oFF.XKeyValuePair.create = function() {
		return new oFF.XKeyValuePair();
	};
	oFF.XKeyValuePair.prototype.m_key = null;
	oFF.XKeyValuePair.prototype.m_value = null;
	oFF.XKeyValuePair.prototype.m_valueType = null;
	oFF.XKeyValuePair.prototype.setKey = function(key) {
		this.m_key = key;
	};
	oFF.XKeyValuePair.prototype.setValue = function(value) {
		this.m_value = value;
	};
	oFF.XKeyValuePair.prototype.setKeyValue = function(key, value) {
		this.m_key = key;
		this.m_value = value;
	};
	oFF.XKeyValuePair.prototype.getKey = function() {
		return this.m_key;
	};
	oFF.XKeyValuePair.prototype.getValue = function() {
		return this.m_value;
	};
	oFF.XKeyValuePair.prototype.setValueType = function(valueType) {
		this.m_valueType = valueType;
	};
	oFF.XKeyValuePair.prototype.getValueType = function() {
		return this.m_valueType;
	};
	oFF.XKeyValuePair.prototype.toString = function() {
		var str = oFF.XStringBuffer.create();
		str.append("Key ");
		if (oFF.notNull(this.m_key)) {
			str.append(this.m_key.toString());
		}
		str.append("Value ");
		if (oFF.notNull(this.m_value)) {
			str.append(this.m_value.toString());
		}
		return str.toString();
	};
	oFF.XKeyValuePair.prototype.releaseObject = function() {
		this.m_key = null;
		this.m_value = null;
		this.m_valueType = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XKeyValuePair.prototype.clone = function() {
		var clone = oFF.XKeyValuePair.create();
		clone.setKey(this.m_key);
		clone.setValue(this.m_value);
		clone.setValueType(this.getValueType());
		return clone;
	};
	oFF.XKeyValuePair.prototype.isEqualTo = function(other) {
		var otherPair;
		if (oFF.isNull(other)) {
			return false;
		}
		if (this === other) {
			return true;
		}
		otherPair = other;
		if (otherPair.getValueType() !== this.getValueType()) {
			return false;
		}
		if (!otherPair.getKey().isEqualTo(this.m_key)) {
			return false;
		}
		if (!otherPair.getValue().isEqualTo(this.m_value)) {
			return false;
		}
		return true;
	};
	oFF.XEnvironmentConstants = {
		HTTP_PROXY_HOST : "http.proxy.host",
		HTTP_PROXY_PORT : "http.proxy.port",
		HTTP_USE_GZIP_ENCODING : "http_use_post_gzip",
		FIDDLER_HOST : "127.0.0.1",
		FIDDLER_PORT : "8888",
		HTTP_DISPATCHER_URI : "http_dispatcher_uri",
		DISPATCHER_PROTOCOL : "$protocol$",
		DISPATCHER_HOST : "$host$",
		DISPATCHER_PORT : "$port$",
		DISPATCHER_PATH : "$path$",
		DISPATCHER_ALIAS : "$alias$",
		DISPATCHER_PREFIX : "$prefix$",
		HTTP_ALLOW_URI_SESSION : "http_allow_uri_session",
		HTTP_DISPATCHER_URI_DOT : "http.dispatcher.uri",
		ENABLE_HTTP_FILE_TRACING : "com.oFF.tracing.enable",
		HTTP_FILE_TRACING_FOLDER : "com.oFF.tracing.folder",
		LANDSCAPE_CUSTOMIZATION : "ff_landscape_customization",
		SYSTEM_LANDSCAPE_URI : "system_landscape_uri",
		XVERSION : "xversion",
		FIREFLY_SDK : "ff_sdk",
		NETWORK_LOCATION : "ff_network_location",
		NETWORK_DIR : "ff_network_dir",
		FIREFLY_TMP : "ff_tmp",
		FIREFLY_CACHE : "ff_cache",
		FIREFLY_RESOURCES : "ff_resources",
		FIREFLY_MIMES : "ff_mimes",
		FIREFLY_SECURE : "ff_secure"
	};
	oFF.XBooleanUtils = {
		checkTrue : function(value, message) {
			if (!value) {
				throw oFF.XException.createRuntimeException(message);
			}
		},
		checkFalse : function(value, message) {
			if (value) {
				throw oFF.XException.createRuntimeException(message);
			}
		}
	};
	oFF.XDateTimeUtils = {
		compareDateTime : function(dateTime1, dateTime2) {
			var compareDate = oFF.XDateTimeUtils.compareDate(dateTime1
					.getDate(), dateTime2.getDate());
			if (compareDate !== 0) {
				return compareDate;
			}
			return oFF.XDateTimeUtils.compareTime(dateTime1.getTime(),
					dateTime2.getTime());
		},
		compareDate : function(firstDate, secondDate) {
			var yearCompare = oFF.XDateTimeUtils.compareInts(firstDate
					.getYear(), secondDate.getYear());
			var monthCompare;
			if (yearCompare !== 0) {
				return yearCompare;
			}
			monthCompare = oFF.XDateTimeUtils.compareInts(firstDate
					.getMonthOfYear(), secondDate.getMonthOfYear());
			if (monthCompare !== 0) {
				return monthCompare;
			}
			return oFF.XDateTimeUtils.compareInts(firstDate.getDayOfMonth(),
					secondDate.getDayOfMonth());
		},
		compareTime : function(firstTime, secondTime) {
			var hourCompare = oFF.XDateTimeUtils.compareInts(firstTime
					.getHourOfDay(), secondTime.getHourOfDay());
			var minuteCompare;
			var secondCompare;
			if (hourCompare !== 0) {
				return hourCompare;
			}
			minuteCompare = oFF.XDateTimeUtils.compareInts(firstTime
					.getMinuteOfHour(), secondTime.getMinuteOfHour());
			if (minuteCompare !== 0) {
				return minuteCompare;
			}
			secondCompare = oFF.XDateTimeUtils.compareInts(firstTime
					.getSecondOfMinute(), secondTime.getSecondOfMinute());
			if (secondCompare !== 0) {
				return secondCompare;
			}
			return oFF.XDateTimeUtils.compareInts(firstTime
					.getMillisecondOfSecond(), secondTime
					.getMillisecondOfSecond());
		},
		compareInts : function(value, compareTo) {
			if (value > compareTo) {
				return 1;
			}
			if (value < compareTo) {
				return -1;
			}
			return 0;
		}
	};
	oFF.XStringUtils = {
		checkStringNotEmpty : function(value, message) {
			if (oFF.XStringUtils.isNullOrEmpty(value)) {
				if (oFF.isNull(message)) {
					throw oFF.XException
							.createIllegalArgumentException("The value must not be null!");
				}
				throw oFF.XException.createIllegalArgumentException(message);
			}
		},
		stripChars : function(value, numberOfChars) {
			var size;
			if (numberOfChars < 1) {
				return value;
			}
			size = oFF.XString.size(value);
			if (numberOfChars * 2 > size) {
				return "";
			}
			return oFF.XString.substring(value, numberOfChars, size
					- numberOfChars);
		},
		stripRight : function(value, numberOfChars) {
			var size;
			if (numberOfChars < 1) {
				return value;
			}
			size = oFF.XString.size(value);
			if (numberOfChars > size) {
				return "";
			}
			return oFF.XString.substring(value, 0, size - numberOfChars);
		},
		leftPad : function(value, spacer, count) {
			var buffer = oFF.XStringBuffer.create();
			var i;
			for (i = 0; i < count; i++) {
				buffer.append(spacer);
			}
			buffer.append(value);
			return buffer.toString();
		},
		rightPad : function(value, spacer, count) {
			var buffer = oFF.XStringBuffer.create().append(value);
			var i;
			for (i = 0; i < count; i++) {
				buffer.append(spacer);
			}
			return buffer.toString();
		},
		isNullOrEmpty : function(value) {
			return oFF.isNull(value) || oFF.XString.isEqual(value, "");
		},
		isNotNullAndNotEmpty : function(value) {
			return oFF.notNull(value) && !oFF.XString.isEqual(value, "");
		},
		concatenate2 : function(s1, s2) {
			var buffer = oFF.XStringBuffer.create().append(s1).append(s2);
			return buffer.toString();
		},
		concatenate3 : function(s1, s2, s3) {
			var buffer = oFF.XStringBuffer.create().append(s1).append(s2)
					.append(s3);
			return buffer.toString();
		},
		concatenate4 : function(s1, s2, s3, s4) {
			var buffer = oFF.XStringBuffer.create().append(s1).append(s2)
					.append(s3).append(s4);
			return buffer.toString();
		},
		concatenate5 : function(s1, s2, s3, s4, s5) {
			var buffer = oFF.XStringBuffer.create().append(s1).append(s2)
					.append(s3).append(s4).append(s5);
			return buffer.toString();
		},
		concatenateWithInt : function(s1, s2) {
			var buffer = oFF.XStringBuffer.create().append(s1).appendInt(s2);
			return buffer.toString();
		},
		normalizeLineEndings : function(value) {
			var normalizedString;
			if (oFF.XStringUtils.isNullOrEmpty(value)) {
				return value;
			}
			normalizedString = oFF.XString.replace(value, "\r\n", "\n");
			return oFF.XString.replace(normalizedString, "\r", "\n");
		},
		normalizeLineEndingsToUnix : function(value) {
			return oFF.XStringUtils.normalizeLineEndings(value);
		},
		normalizeLineEndingsToWindows : function(value) {
			var normalizedString;
			if (oFF.XStringUtils.isNullOrEmpty(value)) {
				return value;
			}
			normalizedString = oFF.XString.replace(value, "\r\n", "\n");
			normalizedString = oFF.XString
					.replace(normalizedString, "\r", "\n");
			return oFF.XString.replace(normalizedString, "\n", "\r\n");
		},
		isAlphaNumeric : function(value) {
			var isCharPresent;
			var isNumPresent;
			var safeDefault;
			var len;
			var i;
			var s;
			var convertStringToIntegerWithDefault;
			if (oFF.XStringUtils.isNullOrEmpty(value)) {
				return true;
			}
			isCharPresent = false;
			isNumPresent = false;
			safeDefault = -999;
			len = oFF.XString.size(value);
			for (i = 0; i < len; i++) {
				s = oFF.XString.substring(value, i, i + 1);
				convertStringToIntegerWithDefault = oFF.XInteger
						.convertFromStringWithDefault(s, safeDefault);
				if (convertStringToIntegerWithDefault === safeDefault) {
					isCharPresent = true;
				} else {
					isNumPresent = true;
				}
				if (isNumPresent && isCharPresent) {
					return true;
				}
			}
			return false;
		},
		containsString : function(s1, s2, ignoreCase) {
			var isS1Empty;
			var isS2Empty;
			var s1UC;
			var s2UC;
			if (!ignoreCase) {
				return oFF.XString.containsString(s1, s2);
			}
			isS1Empty = oFF.XStringUtils.isNullOrEmpty(s1);
			isS2Empty = oFF.XStringUtils.isNullOrEmpty(s2);
			if (isS1Empty && isS2Empty) {
				return true;
			}
			if (isS1Empty !== isS2Empty) {
				return false;
			}
			s1UC = oFF.XString.toUpperCase(s1);
			s2UC = oFF.XString.toUpperCase(s2);
			return oFF.XString.containsString(s1UC, s2UC);
		},
		isWildcardPatternMatching : function(value, searchPattern) {
			var pos;
			var size;
			var starting;
			var ending;
			var isStarting;
			var isEnding;
			if (oFF.XString.containsString(searchPattern, "*")) {
				pos = oFF.XString.indexOf(searchPattern, "*");
				size = oFF.XString.size(searchPattern);
				starting = null;
				ending = null;
				if (pos > 0) {
					starting = oFF.XString.substring(searchPattern, 0, pos - 1);
				}
				if (pos < size - 1) {
					ending = oFF.XString.substring(searchPattern, pos + 1, -1);
				}
				isStarting = false;
				isEnding = false;
				if (oFF.notNull(starting)) {
					isStarting = oFF.XString.startsWith(value, starting);
				}
				if (oFF.notNull(ending)) {
					isEnding = oFF.XString.endsWith(value, ending);
				}
				if (oFF.notNull(starting) && oFF.notNull(ending)
						&& isStarting === true && isEnding === true) {
					return true;
				} else {
					if (oFF.notNull(starting) && isStarting === true) {
						return true;
					} else {
						if (oFF.notNull(ending) && isEnding === true) {
							return true;
						}
					}
				}
				return false;
			} else {
				return oFF.XString.isEqual(value, searchPattern);
			}
		},
		escapeHtml : function(text) {
			var result = oFF.XString.replace(text, "&", "&#38;");
			result = oFF.XString.replace(result, "<", "&#60;");
			result = oFF.XString.replace(result, ">", "&#62;");
			result = oFF.XString.replace(result, '"', "&#34;");
			return result;
		},
		escapeCodeString : function(text) {
			var result = oFF.XString.replace(text, "\r", "\\r");
			result = oFF.XString.replace(result, "\n", "\\n");
			result = oFF.XString.replace(result, '"', '\\"');
			return result;
		},
		camelCaseToUpperCase : function(name) {
			var convertedName = name;
			var size;
			var buffer;
			var mode;
			var i;
			var charAt;
			var newMode;
			if (oFF.notNull(convertedName)) {
				size = oFF.XString.size(convertedName);
				buffer = oFF.XStringBuffer.create();
				mode = 0;
				for (i = 0; i < size; i++) {
					charAt = oFF.XString.getCharAt(convertedName, i);
					newMode = 0;
					if (charAt >= 48 && charAt <= 57) {
						newMode = 1;
					} else {
						if (charAt >= 65 && charAt <= 90) {
							newMode = 2;
						} else {
							if (charAt >= 97 && charAt <= 122) {
								newMode = 3;
							}
						}
					}
					if (newMode !== mode && newMode !== 3 && i > 0) {
						buffer.append("_");
					}
					mode = newMode;
					buffer.appendChar(charAt);
				}
				convertedName = buffer.toString();
				convertedName = oFF.XString.toUpperCase(convertedName);
			}
			return convertedName;
		},
		camelCaseToDisplayText : function(name) {
			var convertedName = name;
			var size;
			var buffer;
			var mode;
			var i;
			var charAt;
			var newMode;
			if (oFF.notNull(convertedName)) {
				size = oFF.XString.size(convertedName);
				buffer = oFF.XStringBuffer.create();
				mode = 0;
				for (i = 0; i < size; i++) {
					charAt = oFF.XString.getCharAt(convertedName, i);
					newMode = 0;
					if (charAt >= 48 && charAt <= 57) {
						newMode = 1;
					} else {
						if (charAt >= 65 && charAt <= 90) {
							newMode = 2;
						} else {
							if (charAt >= 97 && charAt <= 122) {
								newMode = 3;
							}
						}
					}
					if (newMode !== mode && newMode !== 3 && i > 0) {
						buffer.append(" ");
					}
					mode = newMode;
					buffer.appendChar(charAt);
				}
				convertedName = buffer.toString();
			}
			return convertedName;
		}
	};
	oFF.XAutoReleaseManager = function() {
	};
	oFF.XAutoReleaseManager.prototype = new oFF.XObject();
	oFF.XAutoReleaseManager.s_manager = null;
	oFF.XAutoReleaseManager.staticSetup = function() {
		oFF.XAutoReleaseManager.setInstance(new oFF.XAutoReleaseManager());
	};
	oFF.XAutoReleaseManager.getInstance = function() {
		return oFF.XAutoReleaseManager.s_manager;
	};
	oFF.XAutoReleaseManager.setInstance = function(manager) {
		oFF.XAutoReleaseManager.s_manager = manager;
	};
	oFF.XAutoReleaseManager.prototype.execute = function(autoReleaseBlock) {
		autoReleaseBlock.executeAutoReleaseBlock();
	};
	oFF.XAutoReleaseManager.prototype.getMemoryUsage = function() {
		return -1;
	};
	oFF.XWeakReferenceUtil = {
		getHardRef : function(weakReference) {
			var reference;
			if (oFF.isNull(weakReference)) {
				return null;
			}
			reference = weakReference.getReference();
			if (oFF.isNull(reference) || reference.isReleased()) {
				return null;
			}
			return reference;
		},
		getWeakRef : function(context) {
			if (oFF.isNull(context) || context.isReleased()) {
				return null;
			}
			return oFF.XWeakReference.create(context);
		}
	};
	oFF.ErrorCodes = {
		OTHER_ERROR : 0,
		PARSER_ERROR : 10,
		IMPORT_FILTER_CAPABILITY_NOT_FOUND : 20,
		IMPORT_FILTER_CAPABILITY_UNSUPPORTED_OPERATORS : 21,
		IMPORT_VARIABE_NO_DIMENSION : 30,
		IMPORT_EXCEPTION_INACTIVE : 40,
		IMPORT_EXCEPTION_NO_THRESHOLDS : 41,
		IMPORT_EXCEPTION_INVALID_EVALUATE : 42,
		INVALID_STATE : 50,
		INVALID_DATATYPE : 51,
		INVALID_TOKEN : 52,
		INVALID_OPERATOR : 53,
		INVALID_DIMENSION : 54,
		INVALID_PARAMETER : 55,
		INVALID_FIELD : 56,
		INVALID_URL : 60,
		SYSTEM_IO : 70,
		SYSTEM_IO_READ_ACCESS : 71,
		SYSTEM_IO_WRITE_ACCESS : 72,
		SYSTEM_IO_HTTP : 73,
		INVALID_SYSTEM : 80,
		INVALID_SERVER_METADATA_JSON : 81,
		PARSING_ERROR_DOUBLE_VALUE : 85,
		PARSING_ERROR_INT_VALUE : 86,
		PARSING_ERROR_LONG_VALUE : 87,
		PARSING_ERROR_BOOLEAN_VALUE : 88,
		PARSING_ERROR_DATE_VALUE : 89,
		PARSING_ERROR_TIME_VALUE : 90,
		PARSING_ERROR_DATE_TIME_VALUE : 91,
		PARSING_ERROR_TIMESPAN : 92,
		PARSING_ERROR_LINESTRING : 93,
		PARSING_ERROR_MULTILINESTRING : 94,
		PARSING_ERROR_POINT : 95,
		PARSING_ERROR_MULTI_POINT : 96,
		PARSING_ERROR_POLYGON : 97,
		PARSING_ERROR_MULTI_POLYGON : 98,
		MODEL_INFRASTRUCTURE_TERMINATED : 300,
		SERVICE_ROOT_EXCEPTION : 2500,
		SERVICE_NOT_FOUND : 2501,
		SERVER_METADATA_NOT_FOUND : 2502,
		ET_WRONG_TYPE : 2600,
		ET_WRONG_VALUE : 2601,
		ET_ELEMENT_NOT_FOUND : 2602,
		ET_INVALID_CHILDREN : 2603,
		ET_INVALID_VALUE : 2604,
		ET_BLACK_CAP : 2605,
		ET_WHITE_CAP : 2606,
		QM_CUBE_ENTRY_NOT_FOUND : 2700,
		ABAP_PASSWORD_IS_INITIAL : 10023,
		NO_VARIABLE_PROCESSOR_AFFECTED : 3000
	};
	oFF.InfoCodes = {
		OTHER_INFO : 1000000,
		DIMENSION_LAZY_LOAD : 1000001
	};
	oFF.MessageUtil = {
		checkNoError : function(messages) {
			if (oFF.notNull(messages) && messages.hasErrors()) {
				throw oFF.XException.createRuntimeException(messages
						.getSummary());
			}
		}
	};
	oFF.DfModule = function() {
	};
	oFF.DfModule.prototype = new oFF.XObject();
	oFF.DfModule.USE_NATIVE_UI = true;
	oFF.DfModule.checkInitialized = function(module) {
		if (oFF.isNull(module)) {
			throw oFF.XException.createInitializationException();
		}
	};
	oFF.DfModule.start = function(output) {
		return 0;
	};
	oFF.DfModule.stop = function(startTimestamp) {
	};
	oFF.XReflectionParam = function() {
	};
	oFF.XReflectionParam.prototype = new oFF.XObject();
	oFF.XReflectionParam.create = function(obj) {
		var param = new oFF.XReflectionParam();
		param.m_value = obj;
		return param;
	};
	oFF.XReflectionParam.createBoolean = function(value) {
		var param = new oFF.XReflectionParam();
		param.m_value = oFF.XBooleanValue.create(value);
		param.m_isWrapped = true;
		return param;
	};
	oFF.XReflectionParam.createInteger = function(value) {
		var param = new oFF.XReflectionParam();
		param.m_value = oFF.XIntegerValue.create(value);
		param.m_isWrapped = true;
		return param;
	};
	oFF.XReflectionParam.createDouble = function(value) {
		var param = new oFF.XReflectionParam();
		param.m_value = oFF.XDoubleValue.create(value);
		param.m_isWrapped = true;
		return param;
	};
	oFF.XReflectionParam.createLong = function(value) {
		var param = new oFF.XReflectionParam();
		param.m_value = oFF.XLongValue.create(value);
		param.m_isWrapped = true;
		return param;
	};
	oFF.XReflectionParam.createString = function(value) {
		var param = new oFF.XReflectionParam();
		param.m_value = oFF.XStringValue.create(value);
		param.m_isWrapped = true;
		return param;
	};
	oFF.XReflectionParam.prototype.m_value = null;
	oFF.XReflectionParam.prototype.m_isWrapped = false;
	oFF.XReflectionParam.prototype.isWrapped = function() {
		return this.m_isWrapped;
	};
	oFF.XReflectionParam.prototype.getValue = function() {
		return this.m_value;
	};
	oFF.XReflectionParam.prototype.getBoolean = function() {
		return this.m_value.getBoolean();
	};
	oFF.XReflectionParam.prototype.getInteger = function() {
		return this.m_value.getInteger();
	};
	oFF.XReflectionParam.prototype.getDouble = function() {
		return this.m_value.getDouble();
	};
	oFF.XReflectionParam.prototype.getLong = function() {
		return this.m_value.getLong();
	};
	oFF.XReflectionParam.prototype.getString = function() {
		return this.m_value.getString();
	};
	oFF.XReflectionParam.prototype.releaseObject = function() {
		if (this.m_isWrapped) {
			this.m_value = oFF.XObjectExt.release(this.m_value);
		}
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XDateTimeProvider = function() {
	};
	oFF.XDateTimeProvider.prototype = new oFF.XObject();
	oFF.XDateTimeProvider.s_nativeInstance = null;
	oFF.XDateTimeProvider.getInstance = function() {
		return oFF.XDateTimeProvider.s_nativeInstance;
	};
	oFF.XDateTimeProvider.setInstance = function(prompt) {
		oFF.XDateTimeProvider.s_nativeInstance = prompt;
	};
	oFF.XDateTimeProvider.staticSetup = function() {
		var dateTimeProvider = new oFF.XDateTimeProvider();
		oFF.XDateTimeProvider.setInstance(dateTimeProvider);
	};
	oFF.XDateTimeProvider.prototype.getCurrentDateAtLocalTimezone = function() {
		return oFF.XDate.createDate();
	};
	oFF.XDateTimeProvider.prototype.getCurrentDateTimeAtLocalTimezone = function() {
		return oFF.XDateTime.createDateTime();
	};
	oFF.XDateTimeProvider.prototype.getCurrentTimeAtLocalTimezone = function() {
		return oFF.XTime.createTime();
	};
	oFF.XDateTimeProvider.prototype.getMillisecondsForDate = function(date) {
		return 0;
	};
	oFF.XDateTimeProvider.prototype.getMillisecondsForDateTime = function(
			dateTime) {
		return 0;
	};
	oFF.XDateTimeProvider.prototype.getDateTimeFromMilliseconds = function(
			milliseconds) {
		return null;
	};
	oFF.XLogBufferFlushing = function() {
	};
	oFF.XLogBufferFlushing.prototype = new oFF.XObject();
	oFF.XLogBufferFlushing.create = function(logWriter, layer, severity, code) {
		var bufferLog = new oFF.XLogBufferFlushing();
		bufferLog.m_logWriter = logWriter;
		bufferLog.m_layer = layer;
		bufferLog.m_severity = severity;
		bufferLog.m_code = code;
		bufferLog.m_buffer = oFF.XStringBuffer.create();
		return bufferLog;
	};
	oFF.XLogBufferFlushing.prototype.m_buffer = null;
	oFF.XLogBufferFlushing.prototype.m_logWriter = null;
	oFF.XLogBufferFlushing.prototype.m_layer = null;
	oFF.XLogBufferFlushing.prototype.m_severity = null;
	oFF.XLogBufferFlushing.prototype.m_code = 0;
	oFF.XLogBufferFlushing.prototype.append = function(value) {
		this.m_buffer.append(value);
		return this;
	};
	oFF.XLogBufferFlushing.prototype.appendChar = function(value) {
		this.m_buffer.appendChar(value);
		return this;
	};
	oFF.XLogBufferFlushing.prototype.appendBoolean = function(value) {
		this.m_buffer.appendBoolean(value);
		return this;
	};
	oFF.XLogBufferFlushing.prototype.appendInt = function(value) {
		this.m_buffer.appendInt(value);
		return this;
	};
	oFF.XLogBufferFlushing.prototype.appendLong = function(value) {
		this.m_buffer.appendLong(value);
		return this;
	};
	oFF.XLogBufferFlushing.prototype.appendDouble = function(value) {
		this.m_buffer.appendDouble(value);
		return this;
	};
	oFF.XLogBufferFlushing.prototype.appendObject = function(value) {
		this.m_buffer.appendObject(value);
		return this;
	};
	oFF.XLogBufferFlushing.prototype.appendNewLine = function() {
		this.m_buffer.appendNewLine();
		return this;
	};
	oFF.XLogBufferFlushing.prototype.appendLine = function(value) {
		this.m_buffer.appendLine(value);
		return this;
	};
	oFF.XLogBufferFlushing.prototype.length = function() {
		return this.m_buffer.length();
	};
	oFF.XLogBufferFlushing.prototype.clear = function() {
		this.m_buffer.clear();
	};
	oFF.XLogBufferFlushing.prototype.flush = function() {
		if (oFF.notNull(this.m_logWriter)
				&& this.m_logWriter.isLogWritten(this.m_layer, this.m_severity)) {
			this.m_logWriter.logExt(this.m_layer, this.m_severity, this.m_code,
					this.m_buffer.toString());
		}
	};
	oFF.XLogBufferNull = function() {
	};
	oFF.XLogBufferNull.prototype = new oFF.XObject();
	oFF.XLogBufferNull.SINGLETON = null;
	oFF.XLogBufferNull.staticSetup = function() {
		oFF.XLogBufferNull.SINGLETON = new oFF.XLogBufferNull();
	};
	oFF.XLogBufferNull.prototype.append = function(value) {
		return this;
	};
	oFF.XLogBufferNull.prototype.appendChar = function(value) {
		return this;
	};
	oFF.XLogBufferNull.prototype.appendBoolean = function(value) {
		return this;
	};
	oFF.XLogBufferNull.prototype.appendInt = function(value) {
		return this;
	};
	oFF.XLogBufferNull.prototype.appendLong = function(value) {
		return this;
	};
	oFF.XLogBufferNull.prototype.appendDouble = function(value) {
		return this;
	};
	oFF.XLogBufferNull.prototype.appendObject = function(value) {
		return this;
	};
	oFF.XLogBufferNull.prototype.appendNewLine = function() {
		return this;
	};
	oFF.XLogBufferNull.prototype.appendLine = function(value) {
		return this;
	};
	oFF.XLogBufferNull.prototype.length = function() {
		return 0;
	};
	oFF.XLogBufferNull.prototype.clear = function() {
	};
	oFF.XLogBufferNull.prototype.flush = function() {
	};
	oFF.XLogger = {
		s_logger : null,
		getInstance : function() {
			return oFF.XLogger.s_logger;
		},
		setInstance : function(logger) {
			oFF.XLogger.s_logger = logger;
		},
		println : function(logline) {
			oFF.XLogger.s_logger.logExt(null, null, 0, logline);
		}
	};
	oFF.DfStdio = function() {
	};
	oFF.DfStdio.prototype = new oFF.XObject();
	oFF.DfStdio.prototype.getStdin = function() {
		return this;
	};
	oFF.DfStdio.prototype.getStdout = function() {
		return this;
	};
	oFF.DfStdio.prototype.getStdlog = function() {
		return this;
	};
	oFF.DfStdio.prototype.println = function(text) {
	};
	oFF.DfStdio.prototype.print = function(text) {
	};
	oFF.DfStdio.prototype.readLine = function(listener) {
		return null;
	};
	oFF.DfStdio.prototype.supportsSyncType = function(syncType) {
		return false;
	};
	oFF.XStdio = {
		s_stdio : null,
		getInstance : function() {
			return oFF.XStdio.s_stdio;
		},
		setInstance : function(stdio) {
			oFF.XStdio.s_stdio = stdio;
		}
	};
	oFF.XIteratorWrapper = function() {
	};
	oFF.XIteratorWrapper.prototype = new oFF.XObject();
	oFF.XIteratorWrapper.create = function(list) {
		var newObject = new oFF.XIteratorWrapper();
		newObject.m_iterator = list;
		return newObject;
	};
	oFF.XIteratorWrapper.prototype.m_iterator = null;
	oFF.XIteratorWrapper.prototype.releaseObject = function() {
		this.m_iterator = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XIteratorWrapper.prototype.hasNext = function() {
		return this.m_iterator.hasNext();
	};
	oFF.XIteratorWrapper.prototype.next = function() {
		return this.m_iterator.next();
	};
	oFF.XObjectIterator = function() {
	};
	oFF.XObjectIterator.prototype = new oFF.XObject();
	oFF.XObjectIterator.create = function(list) {
		var newObject = new oFF.XObjectIterator();
		newObject.m_list = list;
		newObject.m_index = -1;
		return newObject;
	};
	oFF.XObjectIterator.prototype.m_list = null;
	oFF.XObjectIterator.prototype.m_index = 0;
	oFF.XObjectIterator.prototype.releaseObject = function() {
		this.m_list = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XObjectIterator.prototype.getList = function() {
		return this.m_list;
	};
	oFF.XObjectIterator.prototype.hasNext = function() {
		return this.m_index + 1 < this.getList().size();
	};
	oFF.XObjectIterator.prototype.next = function() {
		this.m_index++;
		return this.getList().get(this.m_index);
	};
	oFF.XUniversalIterator = function() {
	};
	oFF.XUniversalIterator.prototype = new oFF.XObject();
	oFF.XUniversalIterator.create = function(list) {
		var newObject = new oFF.XUniversalIterator();
		newObject.m_list = list;
		newObject.m_index = -1;
		return newObject;
	};
	oFF.XUniversalIterator.prototype.m_list = null;
	oFF.XUniversalIterator.prototype.m_index = 0;
	oFF.XUniversalIterator.prototype.releaseObject = function() {
		this.m_list = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XUniversalIterator.prototype.getList = function() {
		return this.m_list;
	};
	oFF.XUniversalIterator.prototype.hasNext = function() {
		return this.m_index + 1 < this.getList().size();
	};
	oFF.XUniversalIterator.prototype.next = function() {
		this.m_index++;
		return this.getList().get(this.m_index);
	};
	oFF.DfEnum = function() {
	};
	oFF.DfEnum.prototype = new oFF.XObject();
	oFF.DfEnum.prototype.m_enumValue = 0;
	oFF.DfEnum.prototype.setupExt = function(identifier) {
		oFF.XObject.prototype.setup.call(this);
		this.m_enumValue = identifier;
	};
	oFF.DfEnum.prototype.getEnum = function() {
		return this.m_enumValue;
	};
	oFF.DfEnum.prototype.setEnum = function(enumValue) {
		this.m_enumValue = enumValue;
	};
	oFF.DfEnum.prototype.toString = function() {
		return oFF.XInteger.convertToString(this.getEnum());
	};
	oFF.DfEnum.prototype.isEqualTo = function(other) {
		var dlt;
		if (this === other) {
			return true;
		}
		dlt = other;
		return this.getEnum() === dlt.getEnum();
	};
	oFF.DfEnum.prototype.releaseObject = function() {
		this.m_enumValue = 0;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.DfIdObject = function() {
	};
	oFF.DfIdObject.prototype = new oFF.XObject();
	oFF.DfIdObject.prototype.m_id = null;
	oFF.DfIdObject.prototype.setupExt = function(identifier) {
		oFF.XObject.prototype.setup.call(this);
		this.m_id = identifier;
	};
	oFF.DfIdObject.prototype.getId = function() {
		return this.m_id;
	};
	oFF.DfIdObject.prototype.setId = function(identifier) {
		this.m_id = identifier;
	};
	oFF.DfIdObject.prototype.toString = function() {
		return this.getId();
	};
	oFF.DfIdObject.prototype.releaseObject = function() {
		this.m_id = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XPair = function() {
	};
	oFF.XPair.prototype = new oFF.XObject();
	oFF.XPair.create = function(firstObject, secondObject) {
		var newObject = new oFF.XPair();
		newObject.m_firstObject = firstObject;
		newObject.m_secondObject = secondObject;
		return newObject;
	};
	oFF.XPair.prototype.m_firstObject = null;
	oFF.XPair.prototype.m_secondObject = null;
	oFF.XPair.prototype.releaseObject = function() {
		this.m_firstObject = null;
		this.m_secondObject = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XPair.prototype.getFirstObject = function() {
		return this.m_firstObject;
	};
	oFF.XPair.prototype.getSecondObject = function() {
		return this.m_secondObject;
	};
	oFF.XPair.prototype.setFirstObject = function(firstObject) {
		this.m_firstObject = firstObject;
	};
	oFF.XPair.prototype.setSecondObject = function(secondObject) {
		this.m_secondObject = secondObject;
	};
	oFF.XObjectExt = function() {
	};
	oFF.XObjectExt.prototype = new oFF.XObject();
	oFF.XObjectExt.s_allocationTracer = null;
	oFF.XObjectExt._setAllocationTracer = function(tracer) {
		oFF.XObjectExt.s_allocationTracer = tracer;
	};
	oFF.XObjectExt.release = function(theObject) {
		var ixobject = theObject;
		var xobject = ixobject;
		if (oFF.notNull(xobject) && xobject.isReleaseLocked() === false
				&& xobject.isReleased() === false) {
			xobject.releaseObject();
		}
		return null;
	};
	oFF.XObjectExt.checkNotNull = function(o1, message) {
		var theMessage;
		if (oFF.isNull(o1)) {
			theMessage = message;
			if (oFF.isNull(theMessage)) {
				theMessage = "The object must not be null!";
			}
			throw oFF.XException.createIllegalArgumentException(theMessage);
		}
	};
	oFF.XObjectExt.cloneIfNotNull = function(origin) {
		if (oFF.notNull(origin)) {
			return origin.clone();
		}
		return null;
	};
	oFF.XObjectExt.areEqual = function(o1, o2) {
		if (oFF.isNull(o1) && oFF.isNull(o2)) {
			return true;
		} else {
			if (oFF.isNull(o1) || oFF.isNull(o2)) {
				return false;
			} else {
				return o1.isEqualTo(o2);
			}
		}
	};
	oFF.XObjectExt.prototype.m_objectId = null;
	oFF.XObjectExt.prototype.setup = function() {
		oFF.XObject.prototype.setup.call(this);
		if (oFF.notNull(oFF.XObjectExt.s_allocationTracer)) {
			this.m_objectId = oFF.XObjectExt.s_allocationTracer.inc(this);
		}
	};
	oFF.XObjectExt.prototype.releaseObject = function() {
		oFF.XObject.prototype.releaseObject.call(this);
		if (oFF.notNull(oFF.XObjectExt.s_allocationTracer)) {
			oFF.XObjectExt.s_allocationTracer.dec(this, false);
		}
	};
	oFF.XObjectExt.prototype.destructor = function() {
		if (oFF.notNull(oFF.XObjectExt.s_allocationTracer)) {
			oFF.XObjectExt.s_allocationTracer.dec(this, true);
		}
	};
	oFF.XObjectExt.prototype.getObjectId = function() {
		return this.m_objectId;
	};
	oFF.XObjectExt.prototype.log = function(logline) {
		var logger = this.getLogWriter();
		if (oFF.notNull(logger)) {
			logger
					.logExt(this.getLogLayer(), this.getLogSeverity(), 0,
							logline);
		}
	};
	oFF.XObjectExt.prototype.logEmpty = function() {
		var logger = this.getLogWriter();
		if (oFF.notNull(logger)) {
			logger.logExt(this.getLogLayer(), this.getLogSeverity(), 0, null);
		}
	};
	oFF.XObjectExt.prototype.logObj = function(xobject) {
		var logger;
		var logSeverity;
		var logLayer;
		var logText;
		if (oFF.notNull(xobject)) {
			logger = this.getLogWriter();
			if (oFF.notNull(logger)) {
				logSeverity = this.getLogSeverity();
				logLayer = this.getLogLayer();
				if (logger.isLogWritten(logLayer, logSeverity)) {
					logText = xobject.toString();
					logger.logExt(logLayer, logSeverity, 0, logText);
				}
			}
		}
	};
	oFF.XObjectExt.prototype.log2 = function(log1, log2) {
		var logger = this.getLogWriter();
		if (oFF.notNull(logger)) {
			oFF.XLogBufferFlushing.create(logger, this.getLogLayer(),
					this.getLogSeverity(), 0).append(log1).append(log2).flush();
		}
	};
	oFF.XObjectExt.prototype.log3 = function(log1, log2, log3) {
		var logger = this.getLogWriter();
		if (oFF.notNull(logger)) {
			oFF.XLogBufferFlushing.create(logger, this.getLogLayer(),
					this.getLogSeverity(), 0).append(log1).append(log2).append(
					log3).flush();
		}
	};
	oFF.XObjectExt.prototype.log4 = function(log1, log2, log3, log4) {
		var logger = this.getLogWriter();
		if (oFF.notNull(logger)) {
			oFF.XLogBufferFlushing.create(logger, this.getLogLayer(),
					this.getLogSeverity(), 0).append(log1).append(log2).append(
					log3).append(log4).flush();
		}
	};
	oFF.XObjectExt.prototype.logMulti = function(logline) {
		var logger = this.getLogWriter();
		return oFF.XLogBufferFlushing.create(logger, this.getLogLayer(),
				this.getLogSeverity(), 0).append(logline);
	};
	oFF.XObjectExt.prototype.logBuffer = function(layer, severity, code) {
		var logger = this.getLogWriter();
		return oFF.XLogBufferFlushing.create(logger, layer, severity, code);
	};
	oFF.XObjectExt.prototype.logExt = function(layer, severity, code, message) {
		var logger = this.getLogWriter();
		if (oFF.notNull(logger)) {
			logger.logExt(layer, severity, code, message);
		}
	};
	oFF.XObjectExt.prototype.isLogWritten = function(layer, severity) {
		var logger = this.getLogWriter();
		if (oFF.notNull(logger)) {
			return logger.isLogWritten(layer, severity);
		} else {
			return false;
		}
	};
	oFF.XObjectExt.prototype.getLogWriter = function() {
		return null;
	};
	oFF.XObjectExt.prototype.getLogLayer = function() {
		return oFF.OriginLayer.MISC;
	};
	oFF.XObjectExt.prototype.getLogSeverity = function() {
		return oFF.Severity.DEBUG;
	};
	oFF.XObjectExt.prototype.toString = function() {
		var buffer = oFF.XStringBuffer.create();
		var className = this.getClassName();
		var objectId;
		if (oFF.notNull(className)) {
			buffer.append(className);
		} else {
			buffer.append("[unknown class]");
		}
		objectId = this.getObjectId();
		if (oFF.notNull(objectId)) {
			buffer.append(": ").append(objectId);
		}
		return buffer.toString();
	};
	oFF.XReadOnlyListWrapper = function() {
	};
	oFF.XReadOnlyListWrapper.prototype = new oFF.XObject();
	oFF.XReadOnlyListWrapper.create = function(list) {
		var newObject = new oFF.XReadOnlyListWrapper();
		newObject.m_originList = list;
		return newObject;
	};
	oFF.XReadOnlyListWrapper.prototype.m_originList = null;
	oFF.XReadOnlyListWrapper.prototype.releaseObject = function() {
		this.m_originList = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XReadOnlyListWrapper.prototype.getValuesAsReadOnlyList = function() {
		return this;
	};
	oFF.XReadOnlyListWrapper.prototype.getIterator = function() {
		return oFF.XUniversalIterator.create(this.m_originList);
	};
	oFF.XReadOnlyListWrapper.prototype.contains = function(element) {
		return this.m_originList.contains(element);
	};
	oFF.XReadOnlyListWrapper.prototype.size = function() {
		return this.m_originList.size();
	};
	oFF.XReadOnlyListWrapper.prototype.isEmpty = function() {
		return this.m_originList.isEmpty();
	};
	oFF.XReadOnlyListWrapper.prototype.hasElements = function() {
		return this.m_originList.hasElements();
	};
	oFF.XReadOnlyListWrapper.prototype.get = function(index) {
		return this.m_originList.get(index);
	};
	oFF.XReadOnlyListWrapper.prototype.getIndex = function(element) {
		return this.m_originList.getIndex(element);
	};
	oFF.XReadOnlyListWrapper.prototype.toString = function() {
		return this.m_originList.toString();
	};
	oFF.DfIdNameObject = function() {
	};
	oFF.DfIdNameObject.prototype = new oFF.XObject();
	oFF.DfIdNameObject.prototype.m_id = null;
	oFF.DfIdNameObject.prototype.m_name = null;
	oFF.DfIdNameObject.prototype.setupExt = function(identifier, name) {
		oFF.XObject.prototype.setup.call(this);
		this.m_id = identifier;
		this.m_name = name;
	};
	oFF.DfIdNameObject.prototype.getName = function() {
		return this.m_name;
	};
	oFF.DfIdNameObject.prototype.setName = function(name) {
		this.m_name = name;
	};
	oFF.DfIdNameObject.prototype.getId = function() {
		return this.m_id;
	};
	oFF.DfIdNameObject.prototype.setId = function(identifier) {
		this.m_id = identifier;
	};
	oFF.DfIdNameObject.prototype.toString = function() {
		var sb = oFF.XStringBuffer.create();
		sb.append(this.getId()).append(": ").append(this.getName());
		return sb.toString();
	};
	oFF.DfIdNameObject.prototype.releaseObject = function() {
		this.m_id = null;
		this.m_name = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.DfNameObject = function() {
	};
	oFF.DfNameObject.prototype = new oFF.XObjectExt();
	oFF.DfNameObject.prototype.m_name = null;
	oFF.DfNameObject.prototype.getName = function() {
		return this.m_name;
	};
	oFF.DfNameObject.prototype.setName = function(name) {
		this.m_name = name;
	};
	oFF.DfNameObject.prototype.toString = function() {
		return this.m_name;
	};
	oFF.DfNameObject.prototype.releaseObject = function() {
		this.m_name = null;
		oFF.XObjectExt.prototype.releaseObject.call(this);
	};
	oFF.XNameWeakGenericPair = function() {
	};
	oFF.XNameWeakGenericPair.prototype = new oFF.XObject();
	oFF.XNameWeakGenericPair.create = function(name, object) {
		var newObject = new oFF.XNameWeakGenericPair();
		newObject.m_name = name;
		newObject.m_object = oFF.XWeakReferenceUtil.getWeakRef(object);
		return newObject;
	};
	oFF.XNameWeakGenericPair.prototype.m_name = null;
	oFF.XNameWeakGenericPair.prototype.m_object = null;
	oFF.XNameWeakGenericPair.prototype.releaseObject = function() {
		this.m_name = null;
		this.m_object = oFF.XObjectExt.release(this.m_object);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XNameWeakGenericPair.prototype.getName = function() {
		return this.m_name;
	};
	oFF.XNameWeakGenericPair.prototype.getObject = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_object);
	};
	oFF.XNameWeakGenericPair.prototype.setName = function(name) {
		this.m_name = name;
	};
	oFF.XNameWeakGenericPair.prototype.setObject = function(object) {
		this.m_object = oFF.XWeakReferenceUtil.getWeakRef(object);
	};
	oFF.XAbstractValue = function() {
	};
	oFF.XAbstractValue.prototype = new oFF.XObject();
	oFF.XAbstractValue.prototype.getComponentType = function() {
		return this.getValueType();
	};
	oFF.XAbstractValue.prototype.assertValueType = function(valueType) {
		if (this.getValueType() !== valueType) {
			throw oFF.XException
					.createIllegalArgumentException("Valuetype missmatch!");
		}
	};
	oFF.XAbstractValue.prototype.resetValue = function(value) {
		oFF.XObjectExt.checkNotNull(value, "illegal value");
		this.assertValueType(value.getValueType());
	};
	oFF.XAbstractValue.prototype.isEqualTo = function(other) {
		if (oFF.isNull(other)) {
			return false;
		}
		if (this === other) {
			return true;
		}
		if (this.getValueType() !== other.getValueType()) {
			return false;
		}
		return true;
	};
	oFF.XAbstractValue.prototype.getStringRepresentation = function() {
		return this.toString();
	};
	oFF.DfLogWriter = function() {
	};
	oFF.DfLogWriter.prototype = new oFF.XObject();
	oFF.DfLogWriter.createLogString = function(layer, severity, code, message) {
		var buffer = oFF.XStringBuffer.create();
		if (oFF.notNull(severity)) {
			buffer.append("[").append(severity.getName()).append("] ");
		}
		if (oFF.notNull(layer)) {
			buffer.append(layer.toString()).append(": ");
		}
		if (code !== oFF.ErrorCodes.OTHER_ERROR) {
			buffer.append("(#");
			buffer.appendInt(code);
			buffer.append(") ");
		}
		if (oFF.notNull(message)) {
			buffer.append(message);
		}
		return buffer.toString();
	};
	oFF.DfLogWriter.prototype.isLogWritten = function(layer, severity) {
		return true;
	};
	oFF.DfLogWriter.prototype.setFilterSeverity = function(filterLevel) {
		this.setFilterLevel(filterLevel.getLevel());
	};
	oFF.DfLogWriter.prototype.setFilterLevel = function(filterLevel) {
	};
	oFF.DfLogWriter.prototype.disableAllLayers = function() {
	};
	oFF.DfLogWriter.prototype.enableAllLayers = function() {
	};
	oFF.DfLogWriter.prototype.addLayer = function(layer) {
	};
	oFF.XConstant = function() {
	};
	oFF.XConstant.prototype = new oFF.DfNameObject();
	oFF.XConstant.setupName = function(a, name) {
		a.setName(name);
		return a;
	};
	oFF.XConstant.prototype.isReleaseLocked = function() {
		return true;
	};
	oFF.XConstant.prototype.releaseObject = oFF.noSupport;
	oFF.DfNameTextObject = function() {
	};
	oFF.DfNameTextObject.prototype = new oFF.DfNameObject();
	oFF.DfNameTextObject.prototype.m_text = null;
	oFF.DfNameTextObject.prototype.getText = function() {
		return this.m_text;
	};
	oFF.DfNameTextObject.prototype.setText = function(text) {
		this.m_text = text;
	};
	oFF.DfNameTextObject.prototype.releaseObject = function() {
		this.m_text = null;
		oFF.DfNameObject.prototype.releaseObject.call(this);
	};
	oFF.XNameObjectPair = function() {
	};
	oFF.XNameObjectPair.prototype = new oFF.DfNameObject();
	oFF.XNameObjectPair.create = function() {
		return new oFF.XNameObjectPair();
	};
	oFF.XNameObjectPair.prototype.m_value = null;
	oFF.XNameObjectPair.prototype.m_valueType = null;
	oFF.XNameObjectPair.prototype.releaseObject = function() {
		this.m_value = null;
		this.m_valueType = null;
		oFF.DfNameObject.prototype.releaseObject.call(this);
	};
	oFF.XNameObjectPair.prototype.clone = function() {
		var clone = oFF.XNameObjectPair.create();
		clone.setName(this.getName());
		clone.setObject(this.m_value);
		clone.setValueType(this.m_valueType);
		return clone;
	};
	oFF.XNameObjectPair.prototype.setObject = function(object) {
		this.m_value = object;
	};
	oFF.XNameObjectPair.prototype.setNameAndObject = function(name, object) {
		this.setName(name);
		this.m_value = object;
	};
	oFF.XNameObjectPair.prototype.getObject = function() {
		return this.m_value;
	};
	oFF.XNameObjectPair.prototype.setValueType = function(valueType) {
		this.m_valueType = valueType;
	};
	oFF.XNameObjectPair.prototype.getComponentType = function() {
		return this.getValueType();
	};
	oFF.XNameObjectPair.prototype.getValueType = function() {
		return this.m_valueType;
	};
	oFF.XNameObjectPair.prototype.toString = function() {
		var response = oFF.XStringBuffer.create();
		response.append("Key ").append(this.getName());
		response.append("Value ");
		if (oFF.notNull(this.m_value)) {
			response.append(this.m_value.toString());
		}
		return response.toString();
	};
	oFF.XNameObjectPair.prototype.isEqualTo = function(other) {
		var otherPair;
		if (oFF.isNull(other)) {
			return false;
		}
		if (this === other) {
			return true;
		}
		otherPair = other;
		if (otherPair.getValueType() !== this.m_valueType) {
			return false;
		}
		if (!oFF.XString.isEqual(this.getName(), otherPair.getName())) {
			return false;
		}
		if (!otherPair.getObject().isEqualTo(this.m_value)) {
			return false;
		}
		return true;
	};
	oFF.XNameValuePair = function() {
	};
	oFF.XNameValuePair.prototype = new oFF.DfNameObject();
	oFF.XNameValuePair.create = function() {
		return new oFF.XNameValuePair();
	};
	oFF.XNameValuePair.createWithValues = function(name, value) {
		var object = new oFF.XNameValuePair();
		object.setName(name);
		object.setValue(value);
		return object;
	};
	oFF.XNameValuePair.prototype.m_value = null;
	oFF.XNameValuePair.prototype.releaseObject = function() {
		this.m_value = null;
		oFF.DfNameObject.prototype.releaseObject.call(this);
	};
	oFF.XNameValuePair.prototype.getValue = function() {
		return this.m_value;
	};
	oFF.XNameValuePair.prototype.setValue = function(value) {
		this.m_value = value;
	};
	oFF.XNameValuePair.prototype.compareTo = function(objectToCompare) {
		var other;
		var compare;
		if (oFF.isNull(objectToCompare)) {
			return -1;
		}
		if (this === objectToCompare) {
			return 0;
		}
		other = objectToCompare;
		compare = oFF.XString.compare(this.getName(), other.getName());
		if (compare === 0) {
			compare = oFF.XString.compare(this.getValue(), other.getValue());
		}
		return compare;
	};
	oFF.XNameValuePair.prototype.toString = function() {
		var tmp;
		if (oFF.isNull(this.m_value)) {
			return this.getName();
		}
		tmp = oFF.XStringUtils.concatenate2(this.getName(), "=");
		return oFF.XStringUtils.concatenate2(tmp, this.m_value);
	};
	oFF.XAmountValue = function() {
	};
	oFF.XAmountValue.prototype = new oFF.XAbstractValue();
	oFF.XAmountValue.create = function(value) {
		var object = new oFF.XAmountValue();
		object.setAmount(value);
		return object;
	};
	oFF.XAmountValue.prototype.m_amountValue = null;
	oFF.XAmountValue.prototype.releaseObject = function() {
		this.m_amountValue = null;
		oFF.XAbstractValue.prototype.releaseObject.call(this);
	};
	oFF.XAmountValue.prototype.getAmount = function() {
		return this.m_amountValue;
	};
	oFF.XAmountValue.prototype.setAmount = function(value) {
		this.m_amountValue = value;
	};
	oFF.XAmountValue.prototype.getValueType = function() {
		return oFF.XValueType.AMOUNT;
	};
	oFF.XAmountValue.prototype.isEqualTo = function(other) {
		var otherValue;
		if (!oFF.XAbstractValue.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		otherValue = other;
		return oFF.XString
				.isEqual(this.m_amountValue, otherValue.m_amountValue);
	};
	oFF.XAmountValue.prototype.resetValue = function(value) {
		var otherValue;
		oFF.XAbstractValue.prototype.resetValue.call(this, value);
		if (this === value) {
			return;
		}
		otherValue = value;
		this.m_amountValue = otherValue.m_amountValue;
	};
	oFF.XAmountValue.prototype.clone = function() {
		return oFF.XAmountValue.create(this.m_amountValue);
	};
	oFF.XAmountValue.prototype.toString = function() {
		return this.m_amountValue;
	};
	oFF.XBooleanValue = function() {
	};
	oFF.XBooleanValue.prototype = new oFF.XAbstractValue();
	oFF.XBooleanValue.create = function(value) {
		var objectBoolean = new oFF.XBooleanValue();
		objectBoolean.setBoolean(value);
		return objectBoolean;
	};
	oFF.XBooleanValue.prototype.m_booleanValue = false;
	oFF.XBooleanValue.prototype.getBoolean = function() {
		return this.m_booleanValue;
	};
	oFF.XBooleanValue.prototype.setBoolean = function(value) {
		this.m_booleanValue = value;
	};
	oFF.XBooleanValue.prototype.getValueType = function() {
		return oFF.XValueType.BOOLEAN;
	};
	oFF.XBooleanValue.prototype.resetValue = function(value) {
		var otherValue;
		oFF.XAbstractValue.prototype.resetValue.call(this, value);
		if (this === value) {
			return;
		}
		otherValue = value;
		this.m_booleanValue = otherValue.m_booleanValue;
	};
	oFF.XBooleanValue.prototype.isEqualTo = function(other) {
		var otherValue;
		if (!oFF.XAbstractValue.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		otherValue = other;
		return this.m_booleanValue === otherValue.m_booleanValue;
	};
	oFF.XBooleanValue.prototype.clone = function() {
		return oFF.XBooleanValue.create(this.m_booleanValue);
	};
	oFF.XBooleanValue.prototype.toString = function() {
		return oFF.XBoolean.convertToString(this.m_booleanValue);
	};
	oFF.XClassElement = function() {
	};
	oFF.XClassElement.prototype = new oFF.DfNameObject();
	oFF.XClassElement.prototype.m_accessModifier = null;
	oFF.XClassElement.prototype.getAccessModifier = function() {
		return this.m_accessModifier;
	};
	oFF.XDoubleValue = function() {
	};
	oFF.XDoubleValue.prototype = new oFF.XAbstractValue();
	oFF.XDoubleValue.create = function(value) {
		var objectDouble = new oFF.XDoubleValue();
		objectDouble.setDouble(value);
		return objectDouble;
	};
	oFF.XDoubleValue.prototype.m_doubleValue = 0;
	oFF.XDoubleValue.prototype.getDouble = function() {
		return this.m_doubleValue;
	};
	oFF.XDoubleValue.prototype.setDouble = function(value) {
		this.m_doubleValue = value;
	};
	oFF.XDoubleValue.prototype.getValueType = function() {
		return oFF.XValueType.DOUBLE;
	};
	oFF.XDoubleValue.prototype.isEqualTo = function(other) {
		if (!oFF.XAbstractValue.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		return this.m_doubleValue === other.m_doubleValue;
	};
	oFF.XDoubleValue.prototype.resetValue = function(value) {
		oFF.XAbstractValue.prototype.resetValue.call(this, value);
		if (this === value) {
			return;
		}
		this.m_doubleValue = value.m_doubleValue;
	};
	oFF.XDoubleValue.prototype.clone = function() {
		return oFF.XDoubleValue.create(this.m_doubleValue);
	};
	oFF.XDoubleValue.prototype.toString = function() {
		return oFF.XDouble.convertToString(this.m_doubleValue);
	};
	oFF.XIntegerValue = function() {
	};
	oFF.XIntegerValue.prototype = new oFF.XAbstractValue();
	oFF.XIntegerValue.create = function(value) {
		var objectInteger = new oFF.XIntegerValue();
		objectInteger.setInteger(value);
		return objectInteger;
	};
	oFF.XIntegerValue.prototype.m_integerValue = 0;
	oFF.XIntegerValue.prototype.getInteger = function() {
		return this.m_integerValue;
	};
	oFF.XIntegerValue.prototype.setInteger = function(value) {
		this.m_integerValue = value;
	};
	oFF.XIntegerValue.prototype.getValueType = function() {
		return oFF.XValueType.INTEGER;
	};
	oFF.XIntegerValue.prototype.isEqualTo = function(other) {
		if (!oFF.XAbstractValue.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		return this.m_integerValue === other.m_integerValue;
	};
	oFF.XIntegerValue.prototype.resetValue = function(value) {
		oFF.XAbstractValue.prototype.resetValue.call(this, value);
		if (this === value) {
			return;
		}
		this.m_integerValue = value.m_integerValue;
	};
	oFF.XIntegerValue.prototype.clone = function() {
		return oFF.XIntegerValue.create(this.m_integerValue);
	};
	oFF.XIntegerValue.prototype.toString = function() {
		return oFF.XInteger.convertToString(this.m_integerValue);
	};
	oFF.XLongValue = function() {
	};
	oFF.XLongValue.prototype = new oFF.XAbstractValue();
	oFF.XLongValue.create = function(value) {
		var objectLong = new oFF.XLongValue();
		objectLong.setLong(value);
		return objectLong;
	};
	oFF.XLongValue.prototype.m_longValue = 0;
	oFF.XLongValue.prototype.getLong = function() {
		return this.m_longValue;
	};
	oFF.XLongValue.prototype.setLong = function(value) {
		this.m_longValue = value;
	};
	oFF.XLongValue.prototype.getValueType = function() {
		return oFF.XValueType.LONG;
	};
	oFF.XLongValue.prototype.isEqualTo = function(other) {
		if (!oFF.XAbstractValue.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		return this.m_longValue === other.m_longValue;
	};
	oFF.XLongValue.prototype.resetValue = function(value) {
		oFF.XAbstractValue.prototype.resetValue.call(this, value);
		if (this === value) {
			return;
		}
		this.m_longValue = value.m_longValue;
	};
	oFF.XLongValue.prototype.clone = function() {
		return oFF.XLongValue.create(this.m_longValue);
	};
	oFF.XLongValue.prototype.toString = function() {
		return oFF.XLong.convertToString(this.m_longValue);
	};
	oFF.XNumcValue = function() {
	};
	oFF.XNumcValue.prototype = new oFF.XAbstractValue();
	oFF.XNumcValue.create = function(value) {
		var object = new oFF.XNumcValue();
		object.setNumc(value);
		return object;
	};
	oFF.XNumcValue.prototype.m_numcValue = null;
	oFF.XNumcValue.prototype.releaseObject = function() {
		this.m_numcValue = null;
		oFF.XAbstractValue.prototype.releaseObject.call(this);
	};
	oFF.XNumcValue.prototype.getNumc = function() {
		return this.m_numcValue;
	};
	oFF.XNumcValue.prototype.setNumc = function(value) {
		this.m_numcValue = value;
	};
	oFF.XNumcValue.prototype.getValueType = function() {
		return oFF.XValueType.NUMC;
	};
	oFF.XNumcValue.prototype.isEqualTo = function(other) {
		var otherValue;
		if (!oFF.XAbstractValue.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		otherValue = other;
		return oFF.XString.isEqual(this.m_numcValue, otherValue.m_numcValue);
	};
	oFF.XNumcValue.prototype.resetValue = function(value) {
		var otherValue;
		oFF.XAbstractValue.prototype.resetValue.call(this, value);
		if (this === value) {
			return;
		}
		otherValue = value;
		this.m_numcValue = otherValue.m_numcValue;
	};
	oFF.XNumcValue.prototype.clone = function() {
		return oFF.XNumcValue.create(this.m_numcValue);
	};
	oFF.XNumcValue.prototype.toString = function() {
		return this.m_numcValue;
	};
	oFF.XStringValue = function() {
	};
	oFF.XStringValue.prototype = new oFF.XAbstractValue();
	oFF.XStringValue.create = function(value) {
		var object = new oFF.XStringValue();
		object.setString(value);
		return object;
	};
	oFF.XStringValue.prototype.m_stringValue = null;
	oFF.XStringValue.prototype.releaseObject = function() {
		this.m_stringValue = null;
		oFF.XAbstractValue.prototype.releaseObject.call(this);
	};
	oFF.XStringValue.prototype.getString = function() {
		return this.m_stringValue;
	};
	oFF.XStringValue.prototype.setString = function(value) {
		this.m_stringValue = oFF.XString.asString(value);
	};
	oFF.XStringValue.prototype.getValueType = function() {
		return oFF.XValueType.STRING;
	};
	oFF.XStringValue.prototype.isEqualTo = function(other) {
		var otherValue;
		if (!oFF.XAbstractValue.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		otherValue = other;
		return oFF.XString
				.isEqual(this.m_stringValue, otherValue.m_stringValue);
	};
	oFF.XStringValue.prototype.resetValue = function(value) {
		var otherValue;
		oFF.XAbstractValue.prototype.resetValue.call(this, value);
		if (this === value) {
			return;
		}
		otherValue = value;
		this.m_stringValue = otherValue.m_stringValue;
	};
	oFF.XStringValue.prototype.clone = function() {
		return oFF.XStringValue.create(this.m_stringValue);
	};
	oFF.XStringValue.prototype.toString = function() {
		return this.m_stringValue;
	};
	oFF.XDate = function() {
	};
	oFF.XDate.prototype = new oFF.XAbstractValue();
	oFF.XDate.createDate = function() {
		return new oFF.XDate();
	};
	oFF.XDate.createCurrentLocalDate = function() {
		return oFF.XDateTimeProvider.getInstance()
				.getCurrentDateAtLocalTimezone();
	};
	oFF.XDate.createDateWithValues = function(year, month, day) {
		var date = new oFF.XDate();
		date.setYear(year);
		date.setMonthOfYear(month);
		date.setDayOfMonth(day);
		return date;
	};
	oFF.XDate.createDateFromStringWithFlag = function(date, isSapFormat) {
		if (oFF.isNull(date) || oFF.XString.isEqual(date, "")) {
			return null;
		}
		if (isSapFormat) {
			return oFF.XDate.createDateFromSAPFormat(date);
		}
		return oFF.XDate.createDateFromIsoFormat(date);
	};
	oFF.XDate.createDateFromString = function(date, valueFormat) {
		var strLen;
		if (oFF.isNull(date)) {
			return null;
		}
		if (valueFormat === oFF.XValueFormat.ISO_DATE) {
			return oFF.XDate.createDateFromIsoFormat(date);
		} else {
			if (valueFormat === oFF.XValueFormat.SAP_DATE) {
				return oFF.XDate.createDateFromSAPFormat(date);
			}
		}
		strLen = oFF.XString.size(date);
		if (strLen === 8) {
			return oFF.XDate.createDateFromSAPFormat(date);
		} else {
			if (strLen === 10) {
				return oFF.XDate.createDateFromIsoFormat(date);
			}
		}
		return null;
	};
	oFF.XDate.createDateFromIsoFormat = function(date) {
		var posDateTimeDelim;
		var yearString;
		var year;
		var monthString;
		var month;
		var dayString;
		var day;
		if (oFF.XString.size(date) !== 10) {
			posDateTimeDelim = oFF.XString.indexOf(date, "T");
			if (posDateTimeDelim > 0) {
				return oFF.XDate.createDateFromIsoFormat(oFF.XString.substring(
						date, 0, posDateTimeDelim));
			}
			posDateTimeDelim = oFF.XString.indexOf(date, " ");
			if (posDateTimeDelim > 0) {
				return oFF.XDate.createDateFromIsoFormat(oFF.XString.substring(
						date, 0, posDateTimeDelim));
			}
			return null;
		}
		try {
			yearString = oFF.XString.substring(date, 0, 4);
			year = oFF.XInteger.convertFromStringWithRadix(yearString, 10);
			monthString = oFF.XString.substring(date, 5, 7);
			month = oFF.XInteger.convertFromStringWithRadix(monthString, 10);
			dayString = oFF.XString.substring(date, 8, 10);
			day = oFF.XInteger.convertFromStringWithRadix(dayString, 10);
			return oFF.XDate.createDateWithValues(year, month, day);
		} catch (e) {
			throw oFF.XException
					.createIllegalArgumentException(oFF.XStringUtils
							.concatenate2("Not a valid ISO8601 date: ", date));
		}
	};
	oFF.XDate.createDateFromSAPFormat = function(date) {
		var yearString;
		var year;
		var monthString;
		var month;
		var dayString;
		var day;
		if (oFF.XString.size(date) !== 8) {
			return null;
		}
		try {
			yearString = oFF.XString.substring(date, 0, 4);
			year = oFF.XInteger.convertFromStringWithRadix(yearString, 10);
			monthString = oFF.XString.substring(date, 4, 6);
			month = oFF.XInteger.convertFromStringWithRadix(monthString, 10);
			dayString = oFF.XString.substring(date, 6, 8);
			day = oFF.XInteger.convertFromStringWithRadix(dayString, 10);
			return oFF.XDate.createDateWithValues(year, month, day);
		} catch (e) {
			throw oFF.XException
					.createIllegalArgumentException(oFF.XStringUtils
							.concatenate2(
									"Not a valid date format, expected 'YYYYMMDD': ",
									date));
		}
	};
	oFF.XDate.padWithZeros = function(buffer, start, end) {
		var i;
		for (i = start; i < end; i++) {
			buffer.append("0");
		}
	};
	oFF.XDate.prototype.m_year = 0;
	oFF.XDate.prototype.m_month = 0;
	oFF.XDate.prototype.m_day = 0;
	oFF.XDate.prototype.toIsoFormat = function() {
		var buffer = oFF.XStringBuffer.create();
		var year = oFF.XInteger.convertToString(this.m_year);
		var size = oFF.XString.size(year);
		var month;
		var day;
		oFF.XDate.padWithZeros(buffer, size, 4);
		buffer.append(year);
		buffer.append("-");
		month = oFF.XInteger.convertToString(this.m_month);
		size = oFF.XString.size(month);
		oFF.XDate.padWithZeros(buffer, size, 2);
		buffer.append(month);
		buffer.append("-");
		day = oFF.XInteger.convertToString(this.m_day);
		size = oFF.XString.size(day);
		oFF.XDate.padWithZeros(buffer, size, 2);
		buffer.append(day);
		return buffer.toString();
	};
	oFF.XDate.prototype.toSAPFormat = function() {
		var buffer = oFF.XStringBuffer.create();
		var year = oFF.XInteger.convertToString(this.m_year);
		var size = oFF.XString.size(year);
		var month;
		var day;
		oFF.XDate.padWithZeros(buffer, size, 4);
		buffer.append(year);
		month = oFF.XInteger.convertToString(this.m_month);
		size = oFF.XString.size(month);
		oFF.XDate.padWithZeros(buffer, size, 2);
		buffer.append(month);
		day = oFF.XInteger.convertToString(this.m_day);
		size = oFF.XString.size(day);
		oFF.XDate.padWithZeros(buffer, size, 2);
		buffer.append(day);
		return buffer.toString();
	};
	oFF.XDate.prototype.getMonthOfYear = function() {
		return this.m_month;
	};
	oFF.XDate.prototype.setMonthOfYear = function(month) {
		if (month < 0 || month > 12) {
			throw oFF.XException
					.createIllegalArgumentException("illegal month of year");
		}
		this.m_month = month;
	};
	oFF.XDate.prototype.getYear = function() {
		return this.m_year;
	};
	oFF.XDate.prototype.setYear = function(year) {
		if (year < 0) {
			throw oFF.XException.createIllegalArgumentException("illegal year");
		}
		this.m_year = year;
	};
	oFF.XDate.prototype.getDayOfMonth = function() {
		return this.m_day;
	};
	oFF.XDate.prototype.setDayOfMonth = function(day) {
		if (day < 0 || day > 31) {
			throw oFF.XException
					.createIllegalArgumentException("illegal day of month");
		}
		this.m_day = day;
	};
	oFF.XDate.prototype.getValueType = function() {
		return oFF.XValueType.DATE;
	};
	oFF.XDate.prototype.clone = function() {
		return oFF.XDate.createDateWithValues(this.m_year, this.m_month,
				this.m_day);
	};
	oFF.XDate.prototype.resetValue = function(value) {
		var originalValue;
		var otherValue;
		if (this === value) {
			return;
		}
		originalValue = value;
		if (oFF.notNull(value)
				&& value.getValueType() === oFF.XValueType.DATE_TIME) {
			originalValue = value.getDate();
		}
		oFF.XAbstractValue.prototype.resetValue.call(this, originalValue);
		otherValue = originalValue;
		this.setYear(otherValue.m_year);
		this.setMonthOfYear(otherValue.m_month);
		this.setDayOfMonth(otherValue.m_day);
	};
	oFF.XDate.prototype.isEqualTo = function(other) {
		var otherValue;
		if (!oFF.XAbstractValue.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		otherValue = other;
		return this.m_year === otherValue.m_year
				&& this.m_month === otherValue.m_month
				&& this.m_day === otherValue.m_day;
	};
	oFF.XDate.prototype.getMilliseconds = function() {
		var dtProvider = oFF.XDateTimeProvider.getInstance();
		return dtProvider.getMillisecondsForDate(this);
	};
	oFF.XDate.prototype.toString = function() {
		return this.toIsoFormat();
	};
	oFF.XTime = function() {
	};
	oFF.XTime.prototype = new oFF.XAbstractValue();
	oFF.XTime.FRACTIONS_MAX_VALUE = 9999999;
	oFF.XTime.FRACTIONS_MAX_SIZE = 7;
	oFF.XTime.MILLISECOND_MAX_VALUE = 999;
	oFF.XTime.MILLISECOND_MAX_SIZE = 3;
	oFF.XTime.createCurrentLocalTime = function() {
		return oFF.XDateTimeProvider.getInstance()
				.getCurrentTimeAtLocalTimezone();
	};
	oFF.XTime.createTime = function() {
		return new oFF.XTime();
	};
	oFF.XTime.createTimeWithValues = function(hour, minute, second, millisecond) {
		var time = new oFF.XTime();
		time.setHourOfDay(hour);
		time.setMinuteOfHour(minute);
		time.setSecondOfMinute(second);
		time.setMillisecondOfSecond(millisecond);
		return time;
	};
	oFF.XTime.createTimeWithFractions = function(hour, minute, second,
			secondFractions) {
		var time = new oFF.XTime();
		var millisecond;
		var fullFractions;
		var fullMillis;
		time.setHourOfDay(hour);
		time.setMinuteOfHour(minute);
		time.setSecondOfMinute(second);
		millisecond = 0;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(secondFractions)
				&& oFF.XString.size(secondFractions) >= oFF.XTime.MILLISECOND_MAX_SIZE) {
			fullFractions = oFF.XTime.addNumberPadded(oFF.XInteger
					.convertFromString(secondFractions),
					oFF.XTime.FRACTIONS_MAX_SIZE);
			fullMillis = oFF.XTime.addNumberPadded(oFF.XInteger
					.convertFromString(oFF.XString.substring(fullFractions, 0,
							oFF.XTime.MILLISECOND_MAX_SIZE)),
					oFF.XTime.MILLISECOND_MAX_SIZE);
			millisecond = oFF.XInteger.convertFromString(fullMillis);
		}
		time.setMillisecondOfSecond(millisecond);
		time.setSecondFractions(secondFractions);
		return time;
	};
	oFF.XTime.createTimeFromStringWithFlag = function(time, isSapFormat) {
		if (oFF.XStringUtils.isNullOrEmpty(time)) {
			return null;
		}
		if (isSapFormat) {
			return oFF.XTime.createTimeFromSAPFormat(time);
		}
		return oFF.XTime.createTimeFromIsoFormat(time);
	};
	oFF.XTime.createTimeFromString = function(time, valueFormat) {
		var timeLength;
		if (oFF.XStringUtils.isNullOrEmpty(time)) {
			return null;
		}
		if (valueFormat === oFF.XValueFormat.ISO_DATE) {
			return oFF.XTime.createTimeFromIsoFormat(time);
		}
		if (valueFormat === oFF.XValueFormat.SAP_DATE) {
			return oFF.XTime.createTimeFromSAPFormat(time);
		}
		timeLength = oFF.XString.size(time);
		if (timeLength === 8) {
			return oFF.XTime.createTimeFromIsoFormat(time);
		}
		if (timeLength === 6) {
			return oFF.XTime.createTimeFromSAPFormat(time);
		}
		return null;
	};
	oFF.XTime.createTimeFromIsoFormat = function(time) {
		var size;
		var hourString;
		var hour;
		var minuteString;
		var minute;
		var secondString;
		var second;
		var fractions;
		var fractionsString;
		if (oFF.XStringUtils.isNullOrEmpty(time)) {
			return null;
		}
		size = oFF.XString.size(time);
		if (size < 8) {
			throw oFF.XException
					.createIllegalArgumentException(oFF.XStringUtils
							.concatenate3("Illegal ISO time format (", time,
									"). Expected HH:MM:SS.fffffff"));
		}
		hourString = oFF.XString.substring(time, 0, 2);
		hour = oFF.XInteger.convertFromStringWithRadix(hourString, 10);
		minuteString = oFF.XString.substring(time, 3, 5);
		minute = oFF.XInteger.convertFromStringWithRadix(minuteString, 10);
		secondString = oFF.XString.substring(time, 6, 8);
		second = oFF.XInteger.convertFromStringWithRadix(secondString, 10);
		fractions = 0;
		if (size > 8) {
			if (oFF.XString.isEqual(oFF.XString.substring(time, 8, 9), ".")) {
				fractions = oFF.XTime.extractFractions(time, 9,
						oFF.XTime.FRACTIONS_MAX_SIZE);
			}
		}
		fractionsString = oFF.XInteger.convertToString(fractions);
		return oFF.XTime.createTimeWithFractions(hour, minute, second,
				fractionsString);
	};
	oFF.XTime.extractFractions = function(time, positionOfFirstFraction,
			desiredFractionSize) {
		var fractions = 0;
		var tSize = oFF.XString.size(time);
		var exponent;
		var i;
		var newFraction;
		if (tSize > positionOfFirstFraction) {
			exponent = desiredFractionSize - 1;
			for (i = positionOfFirstFraction; i < tSize; i++) {
				if (exponent < 0) {
					break;
				}
				newFraction = oFF.XInteger.convertFromStringWithDefault(
						oFF.XString.substring(time, i, i + 1), -1);
				if (newFraction > -1) {
					fractions = oFF.XDouble.convertToInt(fractions
							+ oFF.XMath.pow(10, exponent) * newFraction);
					exponent = exponent - 1;
				}
			}
		}
		return fractions;
	};
	oFF.XTime.createTimeFromSAPFormat = function(time) {
		var hourString;
		var hour;
		var minuteString;
		var minute;
		var secondString;
		var second;
		if (oFF.XStringUtils.isNullOrEmpty(time)) {
			return null;
		}
		if (oFF.XString.size(time) !== 6) {
			throw oFF.XException
					.createIllegalArgumentException(oFF.XStringUtils
							.concatenate3("Illegal SAP time format (", time,
									"). Expected HHMMSS"));
		}
		hourString = oFF.XString.substring(time, 0, 2);
		hour = oFF.XInteger.convertFromString(hourString);
		minuteString = oFF.XString.substring(time, 2, 4);
		minute = oFF.XInteger.convertFromString(minuteString);
		secondString = oFF.XString.substring(time, 4, 6);
		second = oFF.XInteger.convertFromString(secondString);
		return oFF.XTime.createTimeWithValues(hour, minute, second, 0);
	};
	oFF.XTime.addNumberPadded = function(number, digitSize) {
		var buffer = oFF.XStringBuffer.create();
		var numberAsString = oFF.XInteger.convertToString(number);
		var size = oFF.XString.size(numberAsString);
		var i;
		for (i = size; i < digitSize; i++) {
			buffer.append("0");
		}
		buffer.append(numberAsString);
		return buffer.toString();
	};
	oFF.XTime.prototype.m_hour = 0;
	oFF.XTime.prototype.m_minute = 0;
	oFF.XTime.prototype.m_second = 0;
	oFF.XTime.prototype.m_millisecond = 0;
	oFF.XTime.prototype.m_fractions = null;
	oFF.XTime.prototype.setSecondFractions = function(fractions) {
		var fractionsValueAsInt = 0;
		var fractionSize;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(fractions)) {
			fractionSize = oFF.XString.size(fractions);
			fractionsValueAsInt = oFF.XInteger.convertFromString(fractions);
			if (fractionsValueAsInt < 0
					|| fractionsValueAsInt > oFF.XTime.FRACTIONS_MAX_VALUE
					|| fractionSize > oFF.XTime.FRACTIONS_MAX_SIZE) {
				throw oFF.XException
						.createIllegalArgumentException("Illegal fractions of second");
			}
		}
		this.m_fractions = oFF.XTime.addNumberPadded(fractionsValueAsInt,
				oFF.XTime.FRACTIONS_MAX_SIZE);
	};
	oFF.XTime.prototype.updateFractionsOnMillisChange = function() {
		var fullMillis = oFF.XTime.addNumberPadded(this.m_millisecond,
				oFF.XTime.MILLISECOND_MAX_SIZE);
		this
				.setSecondFractions(oFF.XInteger.convertToString(oFF.XTime
						.extractFractions(fullMillis, 0,
								oFF.XTime.FRACTIONS_MAX_SIZE)));
	};
	oFF.XTime.prototype.getHourOfDay = function() {
		return this.m_hour;
	};
	oFF.XTime.prototype.setHourOfDay = function(hour) {
		if (hour < 0 || hour > 23) {
			throw oFF.XException
					.createIllegalArgumentException("Illegal hour of day");
		}
		this.m_hour = hour;
	};
	oFF.XTime.prototype.getMinuteOfHour = function() {
		return this.m_minute;
	};
	oFF.XTime.prototype.setMinuteOfHour = function(minute) {
		if (minute < 0 || minute > 59) {
			throw oFF.XException
					.createIllegalArgumentException("Illegal minute of hour");
		}
		this.m_minute = minute;
	};
	oFF.XTime.prototype.getSecondOfMinute = function() {
		return this.m_second;
	};
	oFF.XTime.prototype.setSecondOfMinute = function(second) {
		if (second < 0 || second > 59) {
			throw oFF.XException
					.createIllegalArgumentException("Illegal second of minute");
		}
		this.m_second = second;
	};
	oFF.XTime.prototype.getMillisecondOfSecond = function() {
		return this.m_millisecond;
	};
	oFF.XTime.prototype.setMillisecondOfSecond = function(millisecond) {
		if (millisecond < 0 || millisecond > oFF.XTime.MILLISECOND_MAX_VALUE) {
			throw oFF.XException
					.createIllegalArgumentException("Illegal millisecond of second");
		}
		this.m_millisecond = millisecond;
		this.updateFractionsOnMillisChange();
	};
	oFF.XTime.prototype.getFractionsOfSecond = function() {
		return this.m_fractions;
	};
	oFF.XTime.prototype.getValueType = function() {
		return oFF.XValueType.TIME;
	};
	oFF.XTime.prototype.toIsoFormat = function() {
		return this.toIsoFormatWithFractions(oFF.XTime.FRACTIONS_MAX_SIZE);
	};
	oFF.XTime.prototype.toIsoFormatWithFractions = function(fractionSize) {
		var buffer;
		var endPosition;
		var subFractions;
		if (fractionSize < 0) {
			throw oFF.XException
					.createIllegalArgumentException("Illegal fraction size.");
		}
		buffer = oFF.XStringBuffer.create();
		buffer.append(oFF.XTime.addNumberPadded(this.m_hour, 2));
		buffer.append(":");
		buffer.append(oFF.XTime.addNumberPadded(this.m_minute, 2));
		buffer.append(":");
		buffer.append(oFF.XTime.addNumberPadded(this.m_second, 2));
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_fractions)
				&& oFF.XInteger.convertFromString(this.m_fractions) > 0) {
			endPosition = fractionSize;
			if (fractionSize > oFF.XTime.FRACTIONS_MAX_SIZE) {
				endPosition = oFF.XTime.FRACTIONS_MAX_SIZE;
			}
			subFractions = oFF.XString.substring(this.m_fractions, 0,
					endPosition);
			if (oFF.XStringUtils.isNotNullAndNotEmpty(subFractions)
					&& oFF.XInteger.convertFromString(subFractions) > 0) {
				buffer.append(".");
				buffer.append(subFractions);
			}
		}
		return buffer.toString();
	};
	oFF.XTime.prototype.toSAPFormat = function() {
		var buffer = oFF.XStringBuffer.create();
		buffer.append(oFF.XTime.addNumberPadded(this.m_hour, 2));
		buffer.append(oFF.XTime.addNumberPadded(this.m_minute, 2));
		buffer.append(oFF.XTime.addNumberPadded(this.m_second, 2));
		return buffer.toString();
	};
	oFF.XTime.prototype.resetValue = function(value) {
		var otherValue;
		oFF.XAbstractValue.prototype.resetValue.call(this, value);
		if (this === value) {
			return;
		}
		otherValue = value;
		this.setHourOfDay(otherValue.m_hour);
		this.setMinuteOfHour(otherValue.m_minute);
		this.setSecondOfMinute(otherValue.m_second);
		this.setMillisecondOfSecond(otherValue.m_millisecond);
	};
	oFF.XTime.prototype.clone = function() {
		return oFF.XTime.createTimeWithFractions(this.m_hour, this.m_minute,
				this.m_second, this.m_fractions);
	};
	oFF.XTime.prototype.isEqualTo = function(other) {
		var otherValue;
		if (!oFF.XAbstractValue.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		otherValue = other;
		return this.m_hour === otherValue.m_hour
				&& this.m_minute === otherValue.m_minute
				&& this.m_second === otherValue.m_second
				&& this.m_millisecond === otherValue.m_millisecond
				&& oFF.XString.isEqual(this.m_fractions, this.m_fractions);
	};
	oFF.XTime.prototype.toString = function() {
		return this.toIsoFormat();
	};
	oFF.XTimeSpan = function() {
	};
	oFF.XTimeSpan.prototype = new oFF.XAbstractValue();
	oFF.XTimeSpan.create = function(timespan) {
		var object = new oFF.XTimeSpan();
		object.setTimeSpan(timespan);
		return object;
	};
	oFF.XTimeSpan.prototype.m_timeSpan = 0;
	oFF.XTimeSpan.prototype.getValueType = function() {
		return oFF.XValueType.TIMESPAN;
	};
	oFF.XTimeSpan.prototype.getTimeSpan = function() {
		return this.m_timeSpan;
	};
	oFF.XTimeSpan.prototype.setTimeSpan = function(value) {
		this.m_timeSpan = value;
	};
	oFF.XTimeSpan.prototype.resetValue = function(value) {
		var otherValue;
		oFF.XAbstractValue.prototype.resetValue.call(this, value);
		if (this === value) {
			return;
		}
		otherValue = value;
		this.m_timeSpan = otherValue.m_timeSpan;
	};
	oFF.XTimeSpan.prototype.clone = function() {
		return oFF.XTimeSpan.create(this.m_timeSpan);
	};
	oFF.XTimeSpan.prototype.isEqualTo = function(other) {
		if (!oFF.XAbstractValue.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		return this.m_timeSpan === other.m_timeSpan;
	};
	oFF.XTimeSpan.prototype.toString = function() {
		return oFF.XLong.convertToString(this.m_timeSpan);
	};
	oFF.XLanguageValue = function() {
	};
	oFF.XLanguageValue.prototype = new oFF.XAbstractValue();
	oFF.XLanguageValue.create = function(value) {
		var object = new oFF.XLanguageValue();
		object.setLanguage(value);
		return object;
	};
	oFF.XLanguageValue.prototype.m_languageValue = null;
	oFF.XLanguageValue.prototype.releaseObject = function() {
		this.m_languageValue = null;
		oFF.XAbstractValue.prototype.releaseObject.call(this);
	};
	oFF.XLanguageValue.prototype.getLanguage = function() {
		return this.m_languageValue;
	};
	oFF.XLanguageValue.prototype.setLanguage = function(languageValue) {
		this.m_languageValue = languageValue;
	};
	oFF.XLanguageValue.prototype.getValueType = function() {
		return oFF.XValueType.LANGUAGE;
	};
	oFF.XLanguageValue.prototype.isEqualTo = function(other) {
		var otherValue;
		if (!oFF.XAbstractValue.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		otherValue = other;
		return oFF.XString.isEqual(this.m_languageValue,
				otherValue.m_languageValue);
	};
	oFF.XLanguageValue.prototype.resetValue = function(value) {
		oFF.XAbstractValue.prototype.resetValue.call(this, value);
		if (this === value) {
			return;
		}
		this.m_languageValue = value.m_languageValue;
	};
	oFF.XLanguageValue.prototype.clone = function() {
		return oFF.XLanguageValue.create(this.m_languageValue);
	};
	oFF.XLanguageValue.prototype.toString = function() {
		return this.m_languageValue;
	};
	oFF.ConstantValue = function() {
	};
	oFF.ConstantValue.prototype = new oFF.XConstant();
	oFF.ConstantValue.THE_NULL = null;
	oFF.ConstantValue.staticSetup = function() {
		oFF.ConstantValue.THE_NULL = oFF.XConstant.setupName(
				new oFF.ConstantValue(), "null");
	};
	oFF.SignPresentation = function() {
	};
	oFF.SignPresentation.prototype = new oFF.XConstant();
	oFF.SignPresentation.BEFORE_NUMBER = null;
	oFF.SignPresentation.AFTER_NUMBER = null;
	oFF.SignPresentation.BRACKETS = null;
	oFF.SignPresentation.staticSetup = function() {
		oFF.SignPresentation.BEFORE_NUMBER = oFF.XConstant.setupName(
				new oFF.SignPresentation(), "BEFORE_NUMBER");
		oFF.SignPresentation.AFTER_NUMBER = oFF.XConstant.setupName(
				new oFF.SignPresentation(), "AFTER_NUMBER");
		oFF.SignPresentation.BRACKETS = oFF.XConstant.setupName(
				new oFF.SignPresentation(), "BRACKETS");
	};
	oFF.TraceType = function() {
	};
	oFF.TraceType.prototype = new oFF.XConstant();
	oFF.TraceType.NONE = null;
	oFF.TraceType.URL = null;
	oFF.TraceType.FILE = null;
	oFF.TraceType.JSON = null;
	oFF.TraceType.BW_STD = null;
	oFF.TraceType.BW_CATT = null;
	oFF.TraceType.staticSetup = function() {
		oFF.TraceType.NONE = oFF.XConstant.setupName(new oFF.TraceType(),
				"None");
		oFF.TraceType.URL = oFF.XConstant.setupName(new oFF.TraceType(), "Url");
		oFF.TraceType.FILE = oFF.XConstant.setupName(new oFF.TraceType(),
				"File");
		oFF.TraceType.JSON = oFF.XConstant.setupName(new oFF.TraceType(),
				"JsonEmbedded");
		oFF.TraceType.BW_STD = oFF.XConstant.setupName(new oFF.TraceType(),
				"BWStd");
		oFF.TraceType.BW_CATT = oFF.XConstant.setupName(new oFF.TraceType(),
				"BWCATT");
	};
	oFF.TraceType.lookup = function(name) {
		if (oFF.XStringUtils.isNullOrEmpty(name)) {
			return null;
		}
		switch (name) {
		case "None":
			return oFF.TraceType.NONE;
		case "Url":
			return oFF.TraceType.URL;
		case "File":
			return oFF.TraceType.FILE;
		case "JsonEmbedded":
			return oFF.TraceType.JSON;
		case "BWStd":
			return oFF.TraceType.BW_STD;
		case "BWCATT":
			return oFF.TraceType.BW_CATT;
		default:
			return null;
		}
	};
	oFF.TriStateBool = function() {
	};
	oFF.TriStateBool.prototype = new oFF.XConstant();
	oFF.TriStateBool._TRUE = null;
	oFF.TriStateBool._FALSE = null;
	oFF.TriStateBool._DEFAULT = null;
	oFF.TriStateBool.staticSetup = function() {
		oFF.TriStateBool._TRUE = oFF.TriStateBool.create("TRUE", true);
		oFF.TriStateBool._FALSE = oFF.TriStateBool.create("FALSE", false);
		oFF.TriStateBool._DEFAULT = oFF.TriStateBool.create("DEFAULT", false);
	};
	oFF.TriStateBool.create = function(constant, aequivalent) {
		var object = new oFF.TriStateBool();
		object.setupExt(constant, aequivalent);
		return object;
	};
	oFF.TriStateBool.lookup = function(value) {
		if (value) {
			return oFF.TriStateBool._TRUE;
		}
		return oFF.TriStateBool._FALSE;
	};
	oFF.TriStateBool.prototype.m_boolAequivalent = false;
	oFF.TriStateBool.prototype.setupExt = function(constant, aequivalent) {
		this.setName(constant);
		this.m_boolAequivalent = aequivalent;
	};
	oFF.TriStateBool.prototype.getBoolean = function() {
		return this.m_boolAequivalent;
	};
	oFF.XConstantWithParent = function() {
	};
	oFF.XConstantWithParent.prototype = new oFF.XConstant();
	oFF.XConstantWithParent.prototype.m_parent = null;
	oFF.XConstantWithParent.prototype.setupExt = function(name, parent) {
		this.m_parent = parent;
		this.setName(name);
	};
	oFF.XConstantWithParent.prototype.setParent = function(type) {
		this.m_parent = type;
	};
	oFF.XConstantWithParent.prototype.getParent = function() {
		return this.m_parent;
	};
	oFF.XConstantWithParent.prototype.isTypeOf = function(type) {
		if (oFF.isNull(type)) {
			return false;
		}
		if (this === type) {
			return true;
		}
		if (oFF.isNull(this.m_parent)) {
			return false;
		}
		return this.m_parent.isTypeOf(type);
	};
	oFF.XLanguage = function() {
	};
	oFF.XLanguage.prototype = new oFF.XConstant();
	oFF.XLanguage.JAVA = null;
	oFF.XLanguage.JAVASCRIPT = null;
	oFF.XLanguage.TYPESCRIPT = null;
	oFF.XLanguage.OBJECTIVE_C = null;
	oFF.XLanguage.CPP = null;
	oFF.XLanguage.CSHARP = null;
	oFF.XLanguage.ABAP = null;
	oFF.XLanguage.s_language = null;
	oFF.XLanguage.staticSetup = function() {
		oFF.XLanguage.JAVA = oFF.XConstant.setupName(new oFF.XLanguage(),
				"JAVA");
		oFF.XLanguage.JAVASCRIPT = oFF.XConstant.setupName(new oFF.XLanguage(),
				"JAVASCRIPT");
		oFF.XLanguage.TYPESCRIPT = oFF.XConstant.setupName(new oFF.XLanguage(),
				"TYPESCRIPT");
		oFF.XLanguage.OBJECTIVE_C = oFF.XConstant.setupName(
				new oFF.XLanguage(), "OBJECTIVE_C");
		oFF.XLanguage.CPP = oFF.XConstant.setupName(new oFF.XLanguage(), "CPP");
		oFF.XLanguage.CSHARP = oFF.XConstant.setupName(new oFF.XLanguage(),
				"CSHARP");
		oFF.XLanguage.ABAP = oFF.XConstant.setupName(new oFF.XLanguage(),
				"ABAP");
	};
	oFF.XLanguage.getLanguage = function() {
		return oFF.XLanguage.s_language;
	};
	oFF.XLanguage.setLanguage = function(language) {
		if (oFF.isNull(oFF.XLanguage.s_language)) {
			oFF.XLanguage.s_language = language;
		}
	};
	oFF.XSortDirection = function() {
	};
	oFF.XSortDirection.prototype = new oFF.XConstant();
	oFF.XSortDirection.ASCENDING = null;
	oFF.XSortDirection.DESCENDING = null;
	oFF.XSortDirection.NONE = null;
	oFF.XSortDirection.DISABLED = null;
	oFF.XSortDirection.DEFAULT_VALUE = null;
	oFF.XSortDirection.staticSetup = function() {
		oFF.XSortDirection.ASCENDING = oFF.XConstant.setupName(
				new oFF.XSortDirection(), "ASCENDING");
		oFF.XSortDirection.DESCENDING = oFF.XConstant.setupName(
				new oFF.XSortDirection(), "DESCENDING");
		oFF.XSortDirection.DEFAULT_VALUE = oFF.XConstant.setupName(
				new oFF.XSortDirection(), "DEFAULT");
		oFF.XSortDirection.NONE = oFF.XConstant.setupName(
				new oFF.XSortDirection(), "NONE");
		oFF.XSortDirection.DISABLED = oFF.XConstant.setupName(
				new oFF.XSortDirection(), "DISABLED");
	};
	oFF.XSyncEnv = function() {
	};
	oFF.XSyncEnv.prototype = new oFF.XConstant();
	oFF.XSyncEnv.EXTERNAL_MAIN_LOOP = null;
	oFF.XSyncEnv.INTERNAL_MAIN_LOOP = null;
	oFF.XSyncEnv.s_syncEnv = null;
	oFF.XSyncEnv.staticSetup = function() {
		oFF.XSyncEnv.EXTERNAL_MAIN_LOOP = oFF.XConstant.setupName(
				new oFF.XSyncEnv(), "EXTERNAL");
		oFF.XSyncEnv.INTERNAL_MAIN_LOOP = oFF.XConstant.setupName(
				new oFF.XSyncEnv(), "INTERNAL");
	};
	oFF.XSyncEnv.getSyncEnv = function() {
		return oFF.XSyncEnv.s_syncEnv;
	};
	oFF.XSyncEnv.setSyncEnv = function(syncEnv) {
		if (oFF.isNull(oFF.XSyncEnv.s_syncEnv)) {
			oFF.XSyncEnv.s_syncEnv = syncEnv;
		}
	};
	oFF.XAccessModifier = function() {
	};
	oFF.XAccessModifier.prototype = new oFF.XConstant();
	oFF.XAccessModifier.PRIVATE = null;
	oFF.XAccessModifier.PROTECTED = null;
	oFF.XAccessModifier.PUBLIC = null;
	oFF.XAccessModifier.staticSetup = function() {
		oFF.XAccessModifier.PRIVATE = oFF.XConstant.setupName(
				new oFF.XAccessModifier(), "Private");
		oFF.XAccessModifier.PROTECTED = oFF.XConstant.setupName(
				new oFF.XAccessModifier(), "Protected");
		oFF.XAccessModifier.PUBLIC = oFF.XConstant.setupName(
				new oFF.XAccessModifier(), "Public");
	};
	oFF.XMember = function() {
	};
	oFF.XMember.prototype = new oFF.XClassElement();
	oFF.XMember.create = function(name, accessModifier) {
		var member = new oFF.XMember();
		member.setName(name);
		member.m_accessModifier = accessModifier;
		return member;
	};
	oFF.XMethod = function() {
	};
	oFF.XMethod.prototype = new oFF.XClassElement();
	oFF.XMethod.create = function(name, accessModifier) {
		var method = new oFF.XMethod();
		method.setName(name);
		method.m_accessModifier = accessModifier;
		return method;
	};
	oFF.LifeCycleState = function() {
	};
	oFF.LifeCycleState.prototype = new oFF.XConstant();
	oFF.LifeCycleState.INITIAL = null;
	oFF.LifeCycleState.STARTING_UP = null;
	oFF.LifeCycleState.ACTIVE = null;
	oFF.LifeCycleState.SHUTTING_DOWN = null;
	oFF.LifeCycleState.TERMINATED = null;
	oFF.LifeCycleState.RELEASED = null;
	oFF.LifeCycleState.staticSetup = function() {
		oFF.LifeCycleState.INITIAL = oFF.LifeCycleState.create("Initial", 0);
		oFF.LifeCycleState.STARTING_UP = oFF.LifeCycleState.create(
				"StartingUp", 1);
		oFF.LifeCycleState.ACTIVE = oFF.LifeCycleState.create("Active", 2);
		oFF.LifeCycleState.SHUTTING_DOWN = oFF.LifeCycleState.create(
				"ShuttingDown", 3);
		oFF.LifeCycleState.TERMINATED = oFF.LifeCycleState.create("Terminated",
				4);
		oFF.LifeCycleState.RELEASED = oFF.LifeCycleState.create("Released", 5);
	};
	oFF.LifeCycleState.create = function(name, code) {
		var state = oFF.XConstant.setupName(new oFF.LifeCycleState(), name);
		state.m_code = code;
		return state;
	};
	oFF.LifeCycleState.prototype.m_code = 0;
	oFF.LifeCycleState.prototype.getCode = function() {
		return this.m_code;
	};
	oFF.ExtendedInfoType = function() {
	};
	oFF.ExtendedInfoType.prototype = new oFF.XConstant();
	oFF.ExtendedInfoType.UNKNOWN = null;
	oFF.ExtendedInfoType.CONTEXT_STRUCTURE = null;
	oFF.ExtendedInfoType.QUERY_MODEL_ID = null;
	oFF.ExtendedInfoType.staticSetup = function() {
		oFF.ExtendedInfoType.UNKNOWN = oFF.XConstant.setupName(
				new oFF.ExtendedInfoType(), "UNKNOWN");
		oFF.ExtendedInfoType.CONTEXT_STRUCTURE = oFF.XConstant.setupName(
				new oFF.ExtendedInfoType(), "CONTEXT_STRUCTURE");
		oFF.ExtendedInfoType.QUERY_MODEL_ID = oFF.XConstant.setupName(
				new oFF.ExtendedInfoType(), "QUERY_MODEL_ID");
	};
	oFF.OriginLayer = function() {
	};
	oFF.OriginLayer.prototype = new oFF.XConstant();
	oFF.OriginLayer.SERVER = null;
	oFF.OriginLayer.PROTOCOL = null;
	oFF.OriginLayer.IOLAYER = null;
	oFF.OriginLayer.DRIVER = null;
	oFF.OriginLayer.APPLICATION = null;
	oFF.OriginLayer.UTILITY = null;
	oFF.OriginLayer.TEST = null;
	oFF.OriginLayer.MISC = null;
	oFF.OriginLayer.ALL = null;
	oFF.OriginLayer.NONE = null;
	oFF.OriginLayer.s_lookup = null;
	oFF.OriginLayer.staticSetup = function(lookup) {
		oFF.OriginLayer.s_lookup = lookup;
		oFF.OriginLayer.SERVER = oFF.OriginLayer.create("Server");
		oFF.OriginLayer.PROTOCOL = oFF.OriginLayer.create("Protocol");
		oFF.OriginLayer.IOLAYER = oFF.OriginLayer.create("IOLayer");
		oFF.OriginLayer.DRIVER = oFF.OriginLayer.create("Driver");
		oFF.OriginLayer.APPLICATION = oFF.OriginLayer.create("Application");
		oFF.OriginLayer.UTILITY = oFF.OriginLayer.create("Utility");
		oFF.OriginLayer.TEST = oFF.OriginLayer.create("Test");
		oFF.OriginLayer.MISC = oFF.OriginLayer.create("Misc");
		oFF.OriginLayer.ALL = oFF.OriginLayer.create("All");
		oFF.OriginLayer.NONE = oFF.OriginLayer.create("None");
	};
	oFF.OriginLayer.create = function(name) {
		var tempLayer = oFF.XConstant.setupName(new oFF.OriginLayer(), name);
		oFF.OriginLayer.s_lookup.put(name, tempLayer);
		return tempLayer;
	};
	oFF.OriginLayer.lookup = function(value) {
		return oFF.OriginLayer.s_lookup.getByKey(value);
	};
	oFF.Severity = function() {
	};
	oFF.Severity.prototype = new oFF.XConstant();
	oFF.Severity.DEBUG = null;
	oFF.Severity.INFO = null;
	oFF.Severity.WARNING = null;
	oFF.Severity.ERROR = null;
	oFF.Severity.SEMANTICAL_ERROR = null;
	oFF.Severity.PRINT = null;
	oFF.Severity.staticSetup = function() {
		oFF.Severity.DEBUG = oFF.Severity.create("Debug", 0);
		oFF.Severity.INFO = oFF.Severity.create("Info", 1);
		oFF.Severity.WARNING = oFF.Severity.create("Warning", 2);
		oFF.Severity.ERROR = oFF.Severity.create("Error", 3);
		oFF.Severity.SEMANTICAL_ERROR = oFF.Severity.create("SemanticalError",
				3);
		oFF.Severity.PRINT = oFF.Severity.create("Print", 4);
	};
	oFF.Severity.create = function(name, level) {
		var newObj = new oFF.Severity();
		newObj.setName(name);
		newObj.m_level = level;
		return newObj;
	};
	oFF.Severity.prototype.m_level = 0;
	oFF.Severity.prototype.getLevel = function() {
		return this.m_level;
	};
	oFF.PrElementType = function() {
	};
	oFF.PrElementType.prototype = new oFF.XConstant();
	oFF.PrElementType.STRUCTURE = null;
	oFF.PrElementType.LIST = null;
	oFF.PrElementType.STRING = null;
	oFF.PrElementType.INTEGER = null;
	oFF.PrElementType.LONG = null;
	oFF.PrElementType.DOUBLE = null;
	oFF.PrElementType.BOOLEAN = null;
	oFF.PrElementType.OBJECT = null;
	oFF.PrElementType.THE_NULL = null;
	oFF.PrElementType.ANY = null;
	oFF.PrElementType.create = function(name, isNumber) {
		var newConstant = new oFF.PrElementType();
		newConstant.setName(name);
		newConstant.m_isNumber = isNumber;
		return newConstant;
	};
	oFF.PrElementType.staticSetup = function() {
		oFF.PrElementType.STRUCTURE = oFF.PrElementType.create("Structure",
				false);
		oFF.PrElementType.LIST = oFF.PrElementType.create("List", false);
		oFF.PrElementType.STRING = oFF.PrElementType.create("String", false);
		oFF.PrElementType.INTEGER = oFF.PrElementType.create("Integer", true);
		oFF.PrElementType.LONG = oFF.PrElementType.create("Long", true);
		oFF.PrElementType.DOUBLE = oFF.PrElementType.create("Double", true);
		oFF.PrElementType.BOOLEAN = oFF.PrElementType.create("Boolean", false);
		oFF.PrElementType.OBJECT = oFF.PrElementType.create("Object", false);
		oFF.PrElementType.THE_NULL = oFF.PrElementType.create("Null", false);
		oFF.PrElementType.ANY = oFF.PrElementType.create("Any", false);
	};
	oFF.PrElementType.prototype.m_isNumber = false;
	oFF.PrElementType.prototype.isNumber = function() {
		return this.m_isNumber;
	};
	oFF.SyncType = function() {
	};
	oFF.SyncType.prototype = new oFF.XConstant();
	oFF.SyncType.BLOCKING = null;
	oFF.SyncType.NON_BLOCKING = null;
	oFF.SyncType.DELAYED = null;
	oFF.SyncType.REGISTER = null;
	oFF.SyncType.UNREGISTER = null;
	oFF.SyncType.staticSetup = function() {
		oFF.SyncType.BLOCKING = oFF.XConstant.setupName(new oFF.SyncType(),
				"Blocking");
		oFF.SyncType.NON_BLOCKING = oFF.XConstant.setupName(new oFF.SyncType(),
				"NonBlocking");
		oFF.SyncType.DELAYED = oFF.XConstant.setupName(new oFF.SyncType(),
				"Delayed");
		oFF.SyncType.REGISTER = oFF.XConstant.setupName(new oFF.SyncType(),
				"Register");
		oFF.SyncType.UNREGISTER = oFF.XConstant.setupName(new oFF.SyncType(),
				"Unregister");
	};
	oFF.XValueFormat = function() {
	};
	oFF.XValueFormat.prototype = new oFF.XConstant();
	oFF.XValueFormat.ISO_DATE = null;
	oFF.XValueFormat.SAP_DATE = null;
	oFF.XValueFormat.staticSetup = function() {
		oFF.XValueFormat.ISO_DATE = oFF.XConstant.setupName(
				new oFF.XValueFormat(), "IsoDate");
		oFF.XValueFormat.SAP_DATE = oFF.XConstant.setupName(
				new oFF.XValueFormat(), "SapDate");
	};
	oFF.XDateTime = function() {
	};
	oFF.XDateTime.prototype = new oFF.XAbstractValue();
	oFF.XDateTime.createCurrentLocalDateTime = function() {
		return oFF.XDateTimeProvider.getInstance()
				.getCurrentDateTimeAtLocalTimezone();
	};
	oFF.XDateTime.createDateTime = function() {
		var result = new oFF.XDateTime();
		result.m_date = oFF.XDate.createDate();
		result.m_time = oFF.XTime.createTime();
		return result;
	};
	oFF.XDateTime.createDateTimeWithValues = function(year, month, day, hour,
			minute, second, millisecond) {
		var result = oFF.XDateTime.createDateTime();
		result.setYear(year);
		result.setMonthOfYear(month);
		result.setDayOfMonth(day);
		result.setHourOfDay(hour);
		result.setMinuteOfHour(minute);
		result.setSecondOfMinute(second);
		result.setMillisecondOfSecond(millisecond);
		return result;
	};
	oFF.XDateTime.createDateTimeFromStringWithFlag = function(dateTime,
			isSapFormat) {
		if (oFF.isNull(dateTime) || oFF.XString.isEqual(dateTime, "")) {
			return null;
		}
		if (isSapFormat) {
			return oFF.XDateTime.createDateTimeFromSAPFormat(dateTime);
		}
		return oFF.XDateTime.createDateTimeFromIsoFormat(dateTime);
	};
	oFF.XDateTime.createDateTimeFromString = function(dateTime, valueFormat) {
		if (valueFormat === oFF.XValueFormat.ISO_DATE
				|| oFF.isNull(valueFormat)) {
			return oFF.XDateTime.createDateTimeFromIsoFormat(dateTime);
		}
		return oFF.XDateTime.createDateTimeFromSAPFormat(dateTime);
	};
	oFF.XDateTime.createDateTimeFromIsoFormat = function(dateTime) {
		var result = new oFF.XDateTime();
		var dateString = oFF.XString.substring(dateTime, 0, 10);
		var timeString;
		result.m_date = oFF.XDate.createDateFromIsoFormat(dateString);
		if (oFF.isNull(result.m_date)) {
			return null;
		}
		if (oFF.XString.size(dateTime) <= oFF.XString.size(dateString)) {
			result.m_time = oFF.XTime.createTime();
		} else {
			timeString = oFF.XString.substring(dateTime, 11, oFF.XString
					.size(dateTime));
			result.m_time = oFF.XTime.createTimeFromIsoFormat(timeString);
		}
		return result;
	};
	oFF.XDateTime.createDateTimeFromSAPFormat = function(dateTime) {
		var result = new oFF.XDateTime();
		var dateString = oFF.XString.substring(dateTime, 0, 8);
		var timeString;
		result.m_date = oFF.XDate.createDateFromSAPFormat(dateString);
		if (oFF.isNull(result.m_date)) {
			return null;
		}
		timeString = oFF.XString.substring(dateTime, 8, 14);
		result.m_time = oFF.XTime.createTimeFromSAPFormat(timeString);
		return result;
	};
	oFF.XDateTime.prototype.m_date = null;
	oFF.XDateTime.prototype.m_time = null;
	oFF.XDateTime.prototype.releaseObject = function() {
		this.m_date = oFF.XObjectExt.release(this.m_date);
		this.m_time = oFF.XObjectExt.release(this.m_time);
		oFF.XAbstractValue.prototype.releaseObject.call(this);
	};
	oFF.XDateTime.prototype.getYear = function() {
		return this.m_date.getYear();
	};
	oFF.XDateTime.prototype.setYear = function(year) {
		this.m_date.setYear(year);
	};
	oFF.XDateTime.prototype.getMonthOfYear = function() {
		return this.m_date.getMonthOfYear();
	};
	oFF.XDateTime.prototype.setMonthOfYear = function(month) {
		this.m_date.setMonthOfYear(month);
	};
	oFF.XDateTime.prototype.getDayOfMonth = function() {
		return this.m_date.getDayOfMonth();
	};
	oFF.XDateTime.prototype.setDayOfMonth = function(day) {
		this.m_date.setDayOfMonth(day);
	};
	oFF.XDateTime.prototype.getHourOfDay = function() {
		return this.m_time.getHourOfDay();
	};
	oFF.XDateTime.prototype.setHourOfDay = function(hour) {
		this.m_time.setHourOfDay(hour);
	};
	oFF.XDateTime.prototype.getMinuteOfHour = function() {
		return this.m_time.getMinuteOfHour();
	};
	oFF.XDateTime.prototype.setMinuteOfHour = function(minute) {
		this.m_time.setMinuteOfHour(minute);
	};
	oFF.XDateTime.prototype.getSecondOfMinute = function() {
		return this.m_time.getSecondOfMinute();
	};
	oFF.XDateTime.prototype.setSecondOfMinute = function(second) {
		this.m_time.setSecondOfMinute(second);
	};
	oFF.XDateTime.prototype.getMillisecondOfSecond = function() {
		return this.m_time.getMillisecondOfSecond();
	};
	oFF.XDateTime.prototype.setMillisecondOfSecond = function(millisecond) {
		this.m_time.setMillisecondOfSecond(millisecond);
	};
	oFF.XDateTime.prototype.getFractionsOfSecond = function() {
		return this.m_time.getFractionsOfSecond();
	};
	oFF.XDateTime.prototype.toIsoFormat = function() {
		return oFF.XStringUtils.concatenate3(this.m_date.toIsoFormat(), "T",
				this.m_time.toIsoFormat());
	};
	oFF.XDateTime.prototype.toIsoFormatWithFractions = function(fractionSize) {
		return oFF.XStringUtils.concatenate3(this.m_date.toIsoFormat(), "T",
				this.m_time.toIsoFormatWithFractions(fractionSize));
	};
	oFF.XDateTime.prototype.toIso8601Format = function() {
		return oFF.XStringUtils.concatenate4(this.m_date.toIsoFormat(), "T",
				this.m_time.toIsoFormat(), "Z");
	};
	oFF.XDateTime.prototype.toSAPFormat = function() {
		return oFF.XStringUtils.concatenate2(this.m_date.toSAPFormat(),
				this.m_time.toSAPFormat());
	};
	oFF.XDateTime.prototype.getValueType = function() {
		return oFF.XValueType.DATE_TIME;
	};
	oFF.XDateTime.prototype.clone = function() {
		var result = new oFF.XDateTime();
		result.m_date = this.m_date.clone();
		result.m_time = this.m_time.clone();
		return result;
	};
	oFF.XDateTime.prototype.resetValue = function(value) {
		var otherValueType;
		var otherValue;
		oFF.XObjectExt.checkNotNull(value, "illegal value");
		if (this === value) {
			return;
		}
		otherValueType = value.getValueType();
		if (this.getValueType() !== otherValueType) {
			if (otherValueType === oFF.XValueType.DATE) {
				this.m_date.resetValue(value);
			} else {
				if (otherValueType === oFF.XValueType.TIME) {
					this.m_time.resetValue(value);
				} else {
					throw oFF.XException
							.createIllegalArgumentException("illegal value");
				}
			}
		} else {
			otherValue = value;
			this.m_date.resetValue(otherValue.m_date);
			this.m_time.resetValue(otherValue.m_time);
		}
	};
	oFF.XDateTime.prototype.isEqualTo = function(other) {
		var otherValue;
		if (!oFF.XAbstractValue.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		otherValue = other;
		return this.m_date.isEqualTo(otherValue.m_date)
				&& this.m_time.isEqualTo(otherValue.m_time);
	};
	oFF.XDateTime.prototype.getDate = function() {
		return this.m_date;
	};
	oFF.XDateTime.prototype.getTime = function() {
		return this.m_time;
	};
	oFF.XDateTime.prototype.getMilliseconds = function() {
		var dtProvider = oFF.XDateTimeProvider.getInstance();
		return dtProvider.getMillisecondsForDateTime(this);
	};
	oFF.XDateTime.prototype.toString = function() {
		return this.toIsoFormat();
	};
	oFF.XComponentType = function() {
	};
	oFF.XComponentType.prototype = new oFF.XConstantWithParent();
	oFF.XComponentType._ROOT = null;
	oFF.XComponentType._ACTION = null;
	oFF.XComponentType._UI = null;
	oFF.XComponentType._DATASOURCE = null;
	oFF.XComponentType._MODEL = null;
	oFF.XComponentType._VALUE = null;
	oFF.XComponentType._GENERIC = null;
	oFF.XComponentType.PROGRAM = null;
	oFF.XComponentType.s_lookupAll = null;
	oFF.XComponentType.createType = function(name, parent) {
		var newConstant = new oFF.XComponentType();
		newConstant.setupExt(name, parent);
		return newConstant;
	};
	oFF.XComponentType.staticSetupComponentType = function(set) {
		oFF.XComponentType.s_lookupAll = set;
		oFF.XComponentType._ROOT = oFF.XComponentType.createType("_root", null);
		oFF.XComponentType._ACTION = oFF.XComponentType.createType("_action",
				oFF.XComponentType._ROOT);
		oFF.XComponentType._UI = oFF.XComponentType.createType("_ui",
				oFF.XComponentType._ROOT);
		oFF.XComponentType._DATASOURCE = oFF.XComponentType.createType(
				"_datasource", oFF.XComponentType._ROOT);
		oFF.XComponentType._MODEL = oFF.XComponentType.createType("_model",
				oFF.XComponentType._ROOT);
		oFF.XComponentType._VALUE = oFF.XComponentType.createType("_value",
				oFF.XComponentType._ROOT);
		oFF.XComponentType._GENERIC = oFF.XComponentType.createType("_generic",
				oFF.XComponentType._ROOT);
		oFF.XComponentType.PROGRAM = oFF.XComponentType.createType("Program",
				oFF.XComponentType._ROOT);
	};
	oFF.XComponentType.lookupComponentType = function(name) {
		return oFF.XComponentType.s_lookupAll.getByKey(name);
	};
	oFF.XComponentType.prototype.setupExt = function(name, parent) {
		oFF.XConstantWithParent.prototype.setupExt.call(this, name, parent);
		oFF.XComponentType.s_lookupAll.add(this);
	};
	oFF.XPlatform = function() {
	};
	oFF.XPlatform.prototype = new oFF.XConstantWithParent();
	oFF.XPlatform.GENERIC = null;
	oFF.XPlatform.HANA = null;
	oFF.XPlatform.APPLE = null;
	oFF.XPlatform.IOS = null;
	oFF.XPlatform.IPHONE = null;
	oFF.XPlatform.IPAD = null;
	oFF.XPlatform.MAC_OS = null;
	oFF.XPlatform.WATCH_OS = null;
	oFF.XPlatform.MICROSOFT = null;
	oFF.XPlatform.WINDOWS = null;
	oFF.XPlatform.ANDROID = null;
	oFF.XPlatform.BROWSER = null;
	oFF.XPlatform.UI5 = null;
	oFF.XPlatform.REACT = null;
	oFF.XPlatform.ORCA_REACT = null;
	oFF.XPlatform.FABRIC_REACT = null;
	oFF.XPlatform.ORCA = null;
	oFF.XPlatform.SWING = null;
	oFF.XPlatform.SWT = null;
	oFF.XPlatform.s_platform = null;
	oFF.XPlatform.staticSetup = function() {
		oFF.XPlatform.GENERIC = oFF.XPlatform.create("Generic", null);
		oFF.XPlatform.HANA = oFF.XPlatform
				.create("Hana", oFF.XPlatform.GENERIC);
		oFF.XPlatform.APPLE = oFF.XPlatform.create("Apple",
				oFF.XPlatform.GENERIC);
		oFF.XPlatform.IOS = oFF.XPlatform.create("iOS", oFF.XPlatform.APPLE);
		oFF.XPlatform.IPAD = oFF.XPlatform.create("iPad", oFF.XPlatform.IOS);
		oFF.XPlatform.IPHONE = oFF.XPlatform
				.create("iPhone", oFF.XPlatform.IOS);
		oFF.XPlatform.MAC_OS = oFF.XPlatform.create("MacOS",
				oFF.XPlatform.APPLE);
		oFF.XPlatform.WATCH_OS = oFF.XPlatform.create("WatchOS",
				oFF.XPlatform.APPLE);
		oFF.XPlatform.MICROSOFT = oFF.XPlatform.create("Microsoft",
				oFF.XPlatform.GENERIC);
		oFF.XPlatform.WINDOWS = oFF.XPlatform.create("Windows",
				oFF.XPlatform.MICROSOFT);
		oFF.XPlatform.ANDROID = oFF.XPlatform.create("Android",
				oFF.XPlatform.GENERIC);
		oFF.XPlatform.BROWSER = oFF.XPlatform.create("Browser",
				oFF.XPlatform.GENERIC);
		oFF.XPlatform.UI5 = oFF.XPlatform.create("Ui5", oFF.XPlatform.BROWSER);
		oFF.XPlatform.REACT = oFF.XPlatform.create("React",
				oFF.XPlatform.BROWSER);
		oFF.XPlatform.ORCA_REACT = oFF.XPlatform.create("OrcaReact",
				oFF.XPlatform.REACT);
		oFF.XPlatform.FABRIC_REACT = oFF.XPlatform.create("FabricReact",
				oFF.XPlatform.REACT);
		oFF.XPlatform.ORCA = oFF.XPlatform.create("Orca", oFF.XPlatform.UI5);
		oFF.XPlatform.SWING = oFF.XPlatform.create("Swing",
				oFF.XPlatform.GENERIC);
		oFF.XPlatform.SWT = oFF.XPlatform.create("Swt", oFF.XPlatform.GENERIC);
		oFF.XPlatform.s_platform = oFF.XPlatform.GENERIC;
	};
	oFF.XPlatform.create = function(name, parent) {
		var pt = new oFF.XPlatform();
		pt.setupExt(name, parent);
		return pt;
	};
	oFF.XPlatform.getPlatform = function() {
		return oFF.XPlatform.s_platform;
	};
	oFF.XPlatform.setPlatform = function(platform) {
		oFF.XPlatform.s_platform = platform;
	};
	oFF.XPlatform.lookup = function(name) {
		if (oFF.XStringUtils.isNullOrEmpty(name)) {
			return oFF.XPlatform.GENERIC;
		}
		switch (name) {
		case "Hana":
			return oFF.XPlatform.HANA;
		case "Ui5":
			return oFF.XPlatform.UI5;
		case "Apple":
			return oFF.XPlatform.APPLE;
		case "iOS":
			return oFF.XPlatform.IOS;
		case "iPad":
			return oFF.XPlatform.IPAD;
		case "iPhone":
			return oFF.XPlatform.IPHONE;
		case "MacOS":
			return oFF.XPlatform.MAC_OS;
		case "WatchOS":
			return oFF.XPlatform.WATCH_OS;
		case "Microsoft":
			return oFF.XPlatform.MICROSOFT;
		case "Windows":
			return oFF.XPlatform.WINDOWS;
		case "Swing":
			return oFF.XPlatform.SWING;
		case "Swt":
			return oFF.XPlatform.SWT;
		case "Android":
			return oFF.XPlatform.ANDROID;
		case "Browser":
			return oFF.XPlatform.BROWSER;
		case "Orca":
			return oFF.XPlatform.ORCA;
		case "React":
			return oFF.XPlatform.REACT;
		case "OrcaReact":
			return oFF.XPlatform.ORCA_REACT;
		case "FabricReact":
			return oFF.XPlatform.FABRIC_REACT;
		default:
			return oFF.XPlatform.GENERIC;
		}
	};
	oFF.XValueType = function() {
	};
	oFF.XValueType.prototype = new oFF.XComponentType();
	oFF.XValueType.BOOLEAN = null;
	oFF.XValueType.KEY_VALUE = null;
	oFF.XValueType.BYTE_ARRAY = null;
	oFF.XValueType.LIST = null;
	oFF.XValueType.NUMBER = null;
	oFF.XValueType.INTEGER = null;
	oFF.XValueType.DOUBLE = null;
	oFF.XValueType.LONG = null;
	oFF.XValueType.NUMC = null;
	oFF.XValueType.CHAR = null;
	oFF.XValueType.DATE_TIME = null;
	oFF.XValueType.DATE = null;
	oFF.XValueType.TIME = null;
	oFF.XValueType.LANGUAGE = null;
	oFF.XValueType.DECIMAL_FLOAT = null;
	oFF.XValueType.CALENDAR_DAY = null;
	oFF.XValueType.TIMESPAN = null;
	oFF.XValueType.PERCENT = null;
	oFF.XValueType.STRING = null;
	oFF.XValueType.PROPERTIES = null;
	oFF.XValueType.STRUCTURE = null;
	oFF.XValueType.STRUCTURE_LIST = null;
	oFF.XValueType.UNSUPPORTED = null;
	oFF.XValueType.ERROR_VALUE = null;
	oFF.XValueType.POLYGON = null;
	oFF.XValueType.MULTI_POLYGON = null;
	oFF.XValueType.MULTI_POINT = null;
	oFF.XValueType.POINT = null;
	oFF.XValueType.LINE_STRING = null;
	oFF.XValueType.MULTI_LINE_STRING = null;
	oFF.XValueType.LOWER_CASE_STRING = null;
	oFF.XValueType.UPPER_CASE_STRING = null;
	oFF.XValueType.URI = null;
	oFF.XValueType.VARIABLE = null;
	oFF.XValueType.AMOUNT = null;
	oFF.XValueType.QUANTITY = null;
	oFF.XValueType.PRICE = null;
	oFF.XValueType.DIMENSION_MEMBER = null;
	oFF.XValueType.ENUM_CONSTANT = null;
	oFF.XValueType.CURRENT_MEMBER = null;
	oFF.XValueType.OPTION_LIST = null;
	oFF.XValueType.OPTION_VALUE = null;
	oFF.XValueType.ARRAY = null;
	oFF.XValueType.CUKY = null;
	oFF.XValueType.UNIT = null;
	oFF.XValueType.staticSetup = function() {
		oFF.XValueType.BOOLEAN = oFF.XValueType.create("Boolean");
		oFF.XValueType.NUMC = oFF.XValueType.create("Numc");
		oFF.XValueType.CHAR = oFF.XValueType.create("Char");
		oFF.XValueType.NUMBER = oFF.XValueType.create("Number");
		oFF.XValueType.INTEGER = oFF.XValueType.createExt("Integer",
				oFF.XValueType.NUMBER, 0, 0);
		oFF.XValueType.DOUBLE = oFF.XValueType.createExt("Double",
				oFF.XValueType.NUMBER, 7, 2);
		oFF.XValueType.DECIMAL_FLOAT = oFF.XValueType.createExt("DecimalFloat",
				oFF.XValueType.DOUBLE, 7, 2);
		oFF.XValueType.LONG = oFF.XValueType.createExt("Long",
				oFF.XValueType.NUMBER, 0, 0);
		oFF.XValueType.PERCENT = oFF.XValueType.createExt("Percent",
				oFF.XValueType.NUMBER, 7, 3);
		oFF.XValueType.AMOUNT = oFF.XValueType.createExt("Amount",
				oFF.XValueType.NUMBER, 7, 2);
		oFF.XValueType.QUANTITY = oFF.XValueType.createExt("Quantity",
				oFF.XValueType.NUMBER, 7, 2);
		oFF.XValueType.PRICE = oFF.XValueType.createExt("Price",
				oFF.XValueType.NUMBER, 7, 2);
		oFF.XValueType.STRING = oFF.XValueType.create("String");
		oFF.XValueType.LOWER_CASE_STRING = oFF.XValueType.createExt(
				"LowerCaseString", oFF.XValueType.STRING, 0, 0);
		oFF.XValueType.UPPER_CASE_STRING = oFF.XValueType.createExt(
				"UpperCaseString", oFF.XValueType.STRING, 0, 0);
		oFF.XValueType.DATE = oFF.XValueType.create("Date");
		oFF.XValueType.DATE_TIME = oFF.XValueType.create("DateTime");
		oFF.XValueType.CALENDAR_DAY = oFF.XValueType.create("CalendarDay");
		oFF.XValueType.TIMESPAN = oFF.XValueType.create("TimeSpan");
		oFF.XValueType.TIME = oFF.XValueType.create("Time");
		oFF.XValueType.DIMENSION_MEMBER = oFF.XValueType
				.create("DimensionMember");
		oFF.XValueType.LANGUAGE = oFF.XValueType.create("Language");
		oFF.XValueType.PROPERTIES = oFF.XValueType.create("Properties");
		oFF.XValueType.STRUCTURE = oFF.XValueType.create("Structure");
		oFF.XValueType.STRUCTURE_LIST = oFF.XValueType.create("StructureList");
		oFF.XValueType.KEY_VALUE = oFF.XValueType.create("KeyValue");
		oFF.XValueType.BYTE_ARRAY = oFF.XValueType.create("ByteArray");
		oFF.XValueType.URI = oFF.XValueType.create("Uri");
		oFF.XValueType.VARIABLE = oFF.XValueType.create("Variable");
		oFF.XValueType.UNSUPPORTED = oFF.XValueType.create("Unsupported");
		oFF.XValueType.ENUM_CONSTANT = oFF.XValueType.create("EnumConstant");
		oFF.XValueType.POLYGON = oFF.XValueType.create("Polygon");
		oFF.XValueType.MULTI_POLYGON = oFF.XValueType.create("MultiPolygon");
		oFF.XValueType.POINT = oFF.XValueType.create("Point");
		oFF.XValueType.MULTI_POINT = oFF.XValueType.create("MultiPoint");
		oFF.XValueType.LINE_STRING = oFF.XValueType.create("LineString");
		oFF.XValueType.MULTI_LINE_STRING = oFF.XValueType
				.create("MultiLineString");
		oFF.XValueType.CURRENT_MEMBER = oFF.XValueType.create("CurrentMember");
		oFF.XValueType.ARRAY = oFF.XValueType.create("Array");
		oFF.XValueType.OPTION_LIST = oFF.XValueType.create("OptionList");
		oFF.XValueType.OPTION_VALUE = oFF.XValueType.create("OptionValue");
		oFF.XValueType.UNIT = oFF.XValueType.create("Unit");
		oFF.XValueType.CUKY = oFF.XValueType.create("Cuky");
	};
	oFF.XValueType.create = function(constant) {
		return oFF.XValueType.createExt(constant, oFF.XComponentType._VALUE, 0,
				0);
	};
	oFF.XValueType.createExt = function(constant, parent, defaultPrecision,
			defaultDecimals) {
		var vt = new oFF.XValueType();
		if (oFF.notNull(parent)) {
			vt.setupExt(constant, parent);
		} else {
			vt.setupExt(constant, oFF.XComponentType._VALUE);
		}
		vt.m_decimals = defaultDecimals;
		vt.m_precision = defaultPrecision;
		return vt;
	};
	oFF.XValueType.prototype.m_decimals = 0;
	oFF.XValueType.prototype.m_precision = 0;
	oFF.XValueType.prototype.isBoolean = function() {
		return this === oFF.XValueType.BOOLEAN;
	};
	oFF.XValueType.prototype.isNumber = function() {
		return this === oFF.XValueType.INTEGER
				|| this === oFF.XValueType.DOUBLE
				|| this === oFF.XValueType.LONG
				|| this === oFF.XValueType.PERCENT
				|| this === oFF.XValueType.NUMC
				|| this === oFF.XValueType.DECIMAL_FLOAT;
	};
	oFF.XValueType.prototype.isString = function() {
		return this === oFF.XValueType.STRING
				|| this === oFF.XValueType.LOWER_CASE_STRING
				|| this === oFF.XValueType.UPPER_CASE_STRING;
	};
	oFF.XValueType.prototype.isDateBased = function() {
		return this === oFF.XValueType.DATE
				|| this === oFF.XValueType.DATE_TIME
				|| this === oFF.XValueType.CALENDAR_DAY;
	};
	oFF.XValueType.prototype.isDateTime = function() {
		return this.isDateBased() || this === oFF.XValueType.TIMESPAN
				|| this === oFF.XValueType.TIME;
	};
	oFF.XValueType.prototype.isSpatial = function() {
		return this === oFF.XValueType.POINT
				|| this === oFF.XValueType.MULTI_POINT
				|| this === oFF.XValueType.POLYGON
				|| this === oFF.XValueType.MULTI_POLYGON
				|| this === oFF.XValueType.LINE_STRING
				|| this === oFF.XValueType.MULTI_LINE_STRING;
	};
	oFF.XValueType.prototype.isVariable = function() {
		return this === oFF.XValueType.VARIABLE;
	};
	oFF.XValueType.prototype.getDefaultDecimalPlaces = function() {
		return this.m_decimals;
	};
	oFF.XValueType.prototype.getDefaultPrecision = function() {
		return this.m_precision;
	};
	oFF.CoreModule = function() {
	};
	oFF.CoreModule.prototype = new oFF.DfModule();
	oFF.CoreModule.s_module = null;
	oFF.CoreModule.getInstance = function() {
		return oFF.CoreModule.initVersion(oFF.XVersion.API_DEFAULT);
	};
	oFF.CoreModule.initVersion = function(version) {
		var timestamp;
		if (oFF.isNull(oFF.CoreModule.s_module)) {
			timestamp = oFF.DfModule.start("CoreModule...");
			oFF.CoreModule.s_module = new oFF.CoreModule();
			oFF.XVersion.staticSetupByVersion(version);
			oFF.XSyncEnv.staticSetup();
			oFF.XLanguage.staticSetup();
			oFF.XSortDirection.staticSetup();
			oFF.Severity.staticSetup();
			oFF.XValueFormat.staticSetup();
			oFF.XAutoReleaseManager.staticSetup();
			oFF.ConstantValue.staticSetup();
			oFF.XPlatform.staticSetup();
			oFF.TraceType.staticSetup();
			oFF.TriStateBool.staticSetup();
			oFF.ExtendedInfoType.staticSetup();
			oFF.XAccessModifier.staticSetup();
			oFF.DfModule.stop(timestamp);
		}
		return oFF.CoreModule.s_module;
	};
	oFF.CoreModule.getInstance();
})(sap.firefly);