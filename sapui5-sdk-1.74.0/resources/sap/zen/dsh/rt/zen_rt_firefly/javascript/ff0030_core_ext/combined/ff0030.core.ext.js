(function(oFF) {
	oFF.XCache = function() {
	};
	oFF.XCache.prototype = new oFF.XObject();
	oFF.XCache.create = function() {
		var cache = new oFF.XCache();
		cache.m_cache = oFF.XHashMapByString.create();
		cache.m_counter = oFF.XHashMapByString.create();
		return cache;
	};
	oFF.XCache.prototype.m_cache = null;
	oFF.XCache.prototype.m_counter = null;
	oFF.XCache.prototype.releaseObject = function() {
		this.m_cache = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_cache);
		this.m_counter = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_counter);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XCache.prototype.addEntry = function(key, entry) {
		this.m_counter.put(key, oFF.XIntegerValue.create(1));
		this.m_cache.put(key, entry);
	};
	oFF.XCache.prototype.updateEntry = function(key, entry) {
		var keyCounter = this.m_counter.getByKey(key);
		if (oFF.isNull(keyCounter)) {
			this.addEntry(key, entry);
		} else {
			this.m_cache.put(key, entry);
			keyCounter.setInteger(keyCounter.getInteger() + 1);
		}
	};
	oFF.XCache.prototype.freeEntry = function(key) {
		var keyCounter = this.m_counter.getByKey(key);
		if (oFF.isNull(keyCounter)) {
			return;
		}
		if (keyCounter.getInteger() === 1) {
			oFF.XObjectExt.release(this.m_cache.getByKey(key));
			this.m_cache.remove(key);
			oFF.XObjectExt.release(keyCounter);
			this.m_counter.remove(key);
		} else {
			keyCounter.setInteger(keyCounter.getInteger() - 1);
		}
	};
	oFF.XCache.prototype.getEntry = function(key) {
		return this.m_cache.getByKey(key);
	};
	oFF.XCache.prototype.useEntry = function(key) {
		var keyCounter = this.m_counter.getByKey(key);
		if (oFF.isNull(keyCounter)) {
			return null;
		}
		keyCounter.setInteger(keyCounter.getInteger() + 1);
		return this.m_cache.getByKey(key);
	};
	oFF.XCache.prototype.containsEntry = function(key) {
		return this.m_cache.containsKey(key);
	};
	oFF.XCollectionUtils = {
		getByName : function(list, name) {
			var size;
			var i;
			var entry;
			if (oFF.isNull(list)) {
				return null;
			}
			size = list.size();
			for (i = 0; i < size; i++) {
				entry = list.get(i);
				if (oFF.XString.isEqual(name, entry.getName())) {
					return entry;
				}
			}
			return null;
		},
		getIndexByName : function(list, name) {
			var size;
			var i;
			var entry;
			if (oFF.isNull(list)) {
				return -1;
			}
			size = list.size();
			for (i = 0; i < size; i++) {
				entry = list.get(i);
				if (oFF.XString.isEqual(name, entry.getName())) {
					return i;
				}
			}
			return -1;
		},
		hasElements : function(collection) {
			return oFF.notNull(collection) && collection.hasElements();
		},
		releaseEntriesFromCollection : function(collection) {
			var iterator;
			if (oFF.notNull(collection)) {
				iterator = collection.getIterator();
				while (iterator.hasNext()) {
					oFF.XObjectExt.release(iterator.next());
				}
				oFF.XObjectExt.release(iterator);
			}
		},
		releaseEntriesAndCollectionIfNotNull : function(collection) {
			oFF.XCollectionUtils.releaseEntriesFromCollection(collection);
			oFF.XObjectExt.release(collection);
			return null;
		},
		createListCopy : function(other) {
			var list;
			if (oFF.isNull(other)) {
				return null;
			}
			list = oFF.XList.create();
			list.addAll(other);
			return list;
		},
		sortListAsIntegers : function(list, sortDirection) {
			var sortedList = oFF.XListOfString.createFromReadOnlyList(list);
			var comparator = new oFF.XCompararorStringAsNumber();
			comparator.setupExt(sortDirection);
			sortedList.sortByComparator(comparator);
			return sortedList;
		},
		join : function(list, separator) {
			var sb = oFF.XStringBuffer.create();
			var size;
			var i;
			var value;
			if (oFF.XCollectionUtils.hasElements(list)
					&& oFF.notNull(separator)) {
				sb.append(list.get(0));
				size = list.size();
				for (i = 1; i < size; i++) {
					value = list.get(i);
					if (oFF.XStringUtils.isNotNullAndNotEmpty(value)) {
						sb.append(separator).append(value);
					}
				}
			}
			return sb.toString();
		},
		concatenateByteArrays : function(a, b) {
			var c = oFF.XByteArray.create(null, a.size() + b.size());
			oFF.XByteArray.copy(a, 0, c, 0, a.size());
			oFF.XByteArray.copy(b, 0, c, a.size(), b.size());
			return c;
		},
		singletonList : function(element) {
			var list = oFF.XList.create();
			list.add(element);
			return list;
		},
		addIfNotPresent : function(list, value) {
			if (oFF.notNull(list)
					&& oFF.XStringUtils.isNotNullAndNotEmpty(value)
					&& !list.contains(value)) {
				list.add(value);
			}
		}
	};
	oFF.XCompararorStringAsNumber = function() {
	};
	oFF.XCompararorStringAsNumber.prototype = new oFF.XObject();
	oFF.XCompararorStringAsNumber.prototype.m_sortDirection = null;
	oFF.XCompararorStringAsNumber.prototype.setupExt = function(sortDirection) {
		this.m_sortDirection = sortDirection;
	};
	oFF.XCompararorStringAsNumber.prototype.compare = function(o1, o2) {
		var i1 = oFF.XInteger.convertFromString(o1);
		var i2 = oFF.XInteger.convertFromString(o2);
		var result;
		if (i1 === i2) {
			return 0;
		}
		result = 1;
		if (i1 < i2) {
			result = -1;
		}
		if (this.m_sortDirection === oFF.XSortDirection.DESCENDING) {
			result = result * -1;
		}
		return result;
	};
	oFF.JsonParserErrorCode = {
		JSON_PARSER_ROOT_ERROR : 2000,
		JSON_PARSER_ILLEGAL_STATE : 2001
	};
	oFF.XJson = function() {
	};
	oFF.XJson.prototype = new oFF.XObject();
	oFF.XJson.s_extractor = null;
	oFF.XJson.extractJsonContent = function(jsonObject) {
		var element = null;
		var xjson;
		if (oFF.notNull(jsonObject)) {
			if (oFF.notNull(oFF.XJson.s_extractor)) {
				element = oFF.XJson.s_extractor.extractJsonContent(jsonObject);
			} else {
				xjson = jsonObject;
				element = xjson.getElement();
			}
		}
		return element;
	};
	oFF.XJson.setJsonExtractor = function(extractor) {
		oFF.XJson.s_extractor = extractor;
	};
	oFF.XJson.prototype.toString = function() {
		return this.getElement().toString();
	};
	oFF.ListenerPair = function() {
	};
	oFF.ListenerPair.prototype = new oFF.XObject();
	oFF.ListenerPair.create = function(listener, customIdentifier) {
		var element = new oFF.ListenerPair();
		element.setupExt(listener, customIdentifier);
		return element;
	};
	oFF.ListenerPair.prototype.m_listenerWeakReference = null;
	oFF.ListenerPair.prototype.m_customIdentifier = null;
	oFF.ListenerPair.prototype.setupExt = function(listener, customIdentifier) {
		this.m_listenerWeakReference = oFF.XWeakReferenceUtil
				.getWeakRef(listener);
		this.m_customIdentifier = customIdentifier;
	};
	oFF.ListenerPair.prototype.releaseObject = function() {
		this.m_listenerWeakReference = null;
		this.m_customIdentifier = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.ListenerPair.prototype.getListener = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_listenerWeakReference);
	};
	oFF.ListenerPair.prototype.hasWeakReference = function() {
		return oFF.notNull(this.m_listenerWeakReference);
	};
	oFF.ListenerPair.prototype.getCustomIdentifier = function() {
		return this.m_customIdentifier;
	};
	oFF.ListenerPair.prototype.setCustomIdentifier = function(customIdentifier) {
		this.m_customIdentifier = customIdentifier;
	};
	oFF.ListenerPair.prototype.toString = function() {
		if (oFF.isNull(this.m_listenerWeakReference)) {
			return "[Empty]";
		}
		return this.m_listenerWeakReference.toString();
	};
	oFF.PrUtils = {
		asStructure : function(element) {
			return oFF.PrUtils.isElementValid(element,
					oFF.PrElementType.STRUCTURE) ? element : null;
		},
		asList : function(element) {
			return oFF.PrUtils.isElementValid(element, oFF.PrElementType.LIST) ? element
					: null;
		},
		isListEmpty : function(list) {
			return oFF.isNull(list) || list.isEmpty();
		},
		asString : function(element) {
			return oFF.PrUtils
					.isElementValid(element, oFF.PrElementType.STRING) ? element
					: null;
		},
		asBoolean : function(element) {
			return oFF.PrUtils.isElementValid(element,
					oFF.PrElementType.BOOLEAN) ? element : null;
		},
		asNumber : function(element) {
			if (!oFF.PrUtils.isElementValid(element, oFF.PrElementType.DOUBLE)
					&& !oFF.PrUtils.isElementValid(element,
							oFF.PrElementType.INTEGER)
					&& !oFF.PrUtils.isElementValid(element,
							oFF.PrElementType.LONG)) {
				return null;
			}
			return element.asNumber();
		},
		asDouble : function(element) {
			return oFF.PrUtils
					.isElementValid(element, oFF.PrElementType.DOUBLE) ? element
					: null;
		},
		asInteger : function(element) {
			return oFF.PrUtils.isElementValid(element,
					oFF.PrElementType.INTEGER) ? element : null;
		},
		asLong : function(element) {
			return oFF.PrUtils.isElementValid(element, oFF.PrElementType.LONG) ? element
					: null;
		},
		copyIntegerValues : function(parameterList, existingArray) {
			var size = parameterList.size();
			var localArray;
			var i;
			if (oFF.isNull(existingArray) || existingArray.size() !== size) {
				localArray = oFF.XArrayOfInt.create(size);
			} else {
				localArray = existingArray;
			}
			for (i = 0; i < size; i++) {
				localArray.set(i, parameterList.getIntegerAt(i));
			}
			return localArray;
		},
		copyStringValues : function(parameterList, existingList) {
			var output = oFF.isNull(existingList) ? oFF.XListOfString.create()
					: existingList;
			var i;
			var type;
			if (oFF.notNull(parameterList)) {
				for (i = 0; i < parameterList.size(); i++) {
					type = parameterList.getElementTypeAt(i);
					if (type === oFF.PrElementType.STRING) {
						output.add(parameterList.getStringAt(i));
					} else {
						if (type === oFF.PrElementType.THE_NULL) {
							output.add(null);
						}
					}
				}
			}
			return output;
		},
		copyValues : function(parameterList, existingList) {
			var output = oFF.isNull(existingList) ? oFF.XListOfString.create()
					: existingList;
			var i;
			if (oFF.notNull(parameterList)) {
				for (i = 0; i < parameterList.size(); i++) {
					output.add(oFF.PrUtils.getStringValueElement(parameterList,
							i, null));
				}
			}
			return output;
		},
		getProperty : function(structure, name) {
			if (oFF.isNull(structure) || oFF.isNull(name)) {
				return null;
			}
			return structure.getByKey(name);
		},
		isElementValid : function(element, type) {
			return oFF.isNull(element) ? false : element.getType() === type;
		},
		getStructureProperty : function(structure, name) {
			var element = oFF.PrUtils.getProperty(structure, name);
			return oFF.PrUtils.asStructure(element);
		},
		getListProperty : function(structure, name) {
			var element = oFF.PrUtils.getProperty(structure, name);
			return oFF.PrUtils.asList(element);
		},
		getPropertyAsList : function(structure, name) {
			return oFF.PrUtils.convertToList(oFF.PrUtils.getProperty(structure,
					name));
		},
		convertToList : function(element) {
			var list;
			if (oFF.isNull(element)) {
				return null;
			}
			if (element.isList()) {
				return element;
			}
			list = oFF.PrList.create();
			list.add(element);
			return list;
		},
		getStringProperty : function(structure, name) {
			var element = oFF.PrUtils.getProperty(structure, name);
			return oFF.PrUtils.convertElementToString(element);
		},
		getStringValueProperty : function(structure, name, defaultValue) {
			var element = oFF.PrUtils.getProperty(structure, name);
			return oFF.PrUtils.convertElementToStringValue(element,
					defaultValue);
		},
		getBooleanProperty : function(structure, name) {
			var element = oFF.PrUtils.getProperty(structure, name);
			return oFF.PrUtils.convertElementToBoolean(element);
		},
		getBooleanValueProperty : function(structure, name, defaultValue) {
			var element = oFF.PrUtils.getProperty(structure, name);
			return oFF.PrUtils.convertElementToBooleanValue(element,
					defaultValue);
		},
		getNumberProperty : function(structure, name) {
			var element = oFF.PrUtils.getProperty(structure, name);
			return oFF.PrUtils.convertElementToNumber(element);
		},
		getIntegerProperty : function(structure, name) {
			var element = oFF.PrUtils.getProperty(structure, name);
			return oFF.PrUtils.convertElementToInteger(element);
		},
		getIntegerValueProperty : function(structure, name, defaultValue) {
			var element = oFF.PrUtils.getProperty(structure, name);
			return oFF.PrUtils.convertElementToIntegerValue(element,
					defaultValue);
		},
		getDoubleProperty : function(structure, name) {
			var element = oFF.PrUtils.getProperty(structure, name);
			return oFF.PrUtils.convertElementToDouble(element);
		},
		getDoubleValueProperty : function(structure, name, defaultValue) {
			var element = oFF.PrUtils.getProperty(structure, name);
			return oFF.PrUtils.convertElementToDoubleValue(element,
					defaultValue);
		},
		getLongProperty : function(structure, name) {
			var element = oFF.PrUtils.getProperty(structure, name);
			return oFF.PrUtils.convertElementToLong(element);
		},
		getLongValueProperty : function(structure, name, defaultValue) {
			var element = oFF.PrUtils.getProperty(structure, name);
			return oFF.PrUtils.convertElementToLongValue(element, defaultValue);
		},
		getDateProperty : function(structure, name, isSapFormat, defaultValue) {
			var stringProperty = oFF.PrUtils.getStringProperty(structure, name);
			var result;
			if (oFF.isNull(stringProperty)) {
				return defaultValue;
			}
			result = oFF.XDate.createDateFromStringWithFlag(stringProperty
					.getString(), isSapFormat);
			return oFF.isNull(result) ? defaultValue : result;
		},
		getTimeProperty : function(structure, name, isSapFormat, defaultValue) {
			var stringProperty = oFF.PrUtils.getStringProperty(structure, name);
			var result;
			if (oFF.isNull(stringProperty)) {
				return defaultValue;
			}
			result = oFF.XTime.createTimeFromStringWithFlag(stringProperty
					.getString(), isSapFormat);
			return oFF.isNull(result) ? defaultValue : result;
		},
		getDateTimeProperty : function(structure, name, isSapFormat,
				defaultValue) {
			var stringProperty = oFF.PrUtils.getStringProperty(structure, name);
			var result;
			if (oFF.isNull(stringProperty)) {
				return defaultValue;
			}
			result = oFF.XDateTime.createDateTimeFromStringWithFlag(
					stringProperty.getString(), isSapFormat);
			return oFF.isNull(result) ? defaultValue : result;
		},
		getElement : function(list, index) {
			if (oFF.isNull(list) || index < 0 || index >= list.size()) {
				return null;
			}
			return list.get(index);
		},
		getStructureElement : function(list, index) {
			var element = oFF.PrUtils.getElement(list, index);
			return oFF.PrUtils.asStructure(element);
		},
		getListElement : function(list, index) {
			var element = oFF.PrUtils.getElement(list, index);
			return oFF.PrUtils.asList(element);
		},
		getStringElement : function(list, index) {
			var element = oFF.PrUtils.getElement(list, index);
			return oFF.PrUtils.convertElementToString(element);
		},
		getStringValueElement : function(list, index, defaultValue) {
			var element = oFF.PrUtils.getElement(list, index);
			return oFF.PrUtils.convertElementToStringValue(element,
					defaultValue);
		},
		getBooleanElement : function(list, index) {
			var element = oFF.PrUtils.getElement(list, index);
			return oFF.PrUtils.convertElementToBoolean(element);
		},
		getBooleanValueElement : function(list, index, defaultValue) {
			var element = oFF.PrUtils.getElement(list, index);
			return oFF.PrUtils.convertElementToBooleanValue(element,
					defaultValue);
		},
		getNumberElement : function(list, index) {
			var element = oFF.PrUtils.getElement(list, index);
			return oFF.PrUtils.convertElementToNumber(element);
		},
		getIntegerElement : function(list, index) {
			var element = oFF.PrUtils.getElement(list, index);
			return oFF.PrUtils.convertElementToInteger(element);
		},
		getIntegerValueElement : function(list, index, defaultValue) {
			var element = oFF.PrUtils.getElement(list, index);
			return oFF.PrUtils.convertElementToIntegerValue(element,
					defaultValue);
		},
		getDoubleElement : function(list, index) {
			var element = oFF.PrUtils.getElement(list, index);
			return oFF.PrUtils.convertElementToDouble(element);
		},
		getDoubleValueElement : function(list, index, defaultValue) {
			var element = oFF.PrUtils.getElement(list, index);
			return oFF.PrUtils.convertElementToDoubleValue(element,
					defaultValue);
		},
		getLongElement : function(list, index) {
			var element = oFF.PrUtils.getElement(list, index);
			return oFF.PrUtils.convertElementToLong(element);
		},
		getLongValueElement : function(list, index, defaultValue) {
			var element = oFF.PrUtils.getElement(list, index);
			return oFF.PrUtils.convertElementToLongValue(element, defaultValue);
		},
		getDateElement : function(list, index, isSapFormat, defaultValue) {
			var stringElement = oFF.PrUtils.getStringElement(list, index);
			var result;
			if (oFF.isNull(stringElement)) {
				return defaultValue;
			}
			result = oFF.XDate.createDateFromStringWithFlag(stringElement
					.getString(), isSapFormat);
			return oFF.isNull(result) ? defaultValue : result;
		},
		getTimeElement : function(list, index, isSapFormat, defaultValue) {
			var stringElement = oFF.PrUtils.getStringElement(list, index);
			var result;
			if (oFF.isNull(stringElement)) {
				return defaultValue;
			}
			result = oFF.XTime.createTimeFromStringWithFlag(stringElement
					.getString(), isSapFormat);
			return oFF.isNull(result) ? defaultValue : result;
		},
		getDateTimeElement : function(list, index, isSapFormat, defaultValue) {
			var stringElement = oFF.PrUtils.getStringElement(list, index);
			var result;
			if (oFF.isNull(stringElement)) {
				return defaultValue;
			}
			result = oFF.XDateTime.createDateTimeFromStringWithFlag(
					stringElement.getString(), isSapFormat);
			return oFF.isNull(result) ? defaultValue : result;
		},
		convertIntegerToString : function(element) {
			var integerElement = element;
			return oFF.XInteger.convertToString(integerElement.getInteger());
		},
		convertDoubleToString : function(element) {
			var doubleElement = element;
			return oFF.XDouble.convertToString(doubleElement.getDouble());
		},
		convertLongToString : function(element) {
			var longElement = element;
			return oFF.XLong.convertToString(longElement.getLong());
		},
		convertBoolToString : function(element) {
			var booleanElement = element;
			return oFF.XBoolean.convertToString(booleanElement.getBoolean());
		},
		getTypeFromElement : function(element) {
			return oFF.isNull(element) ? null : element.getType();
		},
		convertElementToString : function(element) {
			var type = oFF.PrUtils.getTypeFromElement(element);
			var stringValue;
			if (oFF.isNull(type)) {
				return null;
			}
			stringValue = null;
			if (type === oFF.PrElementType.STRING) {
				return element;
			} else {
				if (type === oFF.PrElementType.BOOLEAN) {
					stringValue = oFF.PrUtils.convertBoolToString(element);
				} else {
					if (type === oFF.PrElementType.INTEGER) {
						stringValue = oFF.PrUtils
								.convertIntegerToString(element);
					} else {
						if (type === oFF.PrElementType.DOUBLE) {
							stringValue = oFF.PrUtils
									.convertDoubleToString(element);
						} else {
							if (type === oFF.PrElementType.LONG) {
								stringValue = oFF.PrUtils
										.convertLongToString(element);
							} else {
								if (type === oFF.PrElementType.THE_NULL) {
									stringValue = oFF.ConstantValue.THE_NULL
											.toString();
								}
							}
						}
					}
				}
			}
			return oFF.PrString.createWithValue(stringValue);
		},
		convertElementToStringValue : function(element, defaultValue) {
			var prString;
			if (oFF.isNull(element)) {
				return defaultValue;
			}
			prString = oFF.PrUtils.convertElementToString(element);
			return oFF.isNull(prString) ? defaultValue : prString.getString();
		},
		convertElementToBoolean : function(element) {
			var type = oFF.PrUtils.getTypeFromElement(element);
			var booleanValue;
			if (oFF.isNull(type)) {
				return null;
			}
			if (type === oFF.PrElementType.BOOLEAN) {
				return element;
			}
			if (type === oFF.PrElementType.STRING) {
				try {
					booleanValue = oFF.XBoolean.convertFromString(element
							.getString());
					return oFF.PrFactory.createBoolean(booleanValue);
				} catch (t) {
					return null;
				}
			}
			return null;
		},
		convertElementToBooleanValue : function(element, defaultValue) {
			var elementAsBoolean = oFF.PrUtils.convertElementToBoolean(element);
			return oFF.isNull(elementAsBoolean) ? defaultValue
					: elementAsBoolean.getBoolean();
		},
		convertElementToNumber : function(element) {
			var type = oFF.PrUtils.getTypeFromElement(element);
			var doubleValue;
			if (oFF.isNull(type)) {
				return null;
			}
			if (type === oFF.PrElementType.STRING) {
				try {
					doubleValue = oFF.XDouble.convertFromString(element
							.getString());
					return oFF.PrDouble.createWithValue(doubleValue);
				} catch (t) {
					return null;
				}
			}
			if (type.isNumber()) {
				return element.asNumber();
			}
			return null;
		},
		convertElementToInteger : function(element) {
			var type = oFF.PrUtils.getTypeFromElement(element);
			var integerValue;
			if (oFF.isNull(type)) {
				return null;
			}
			if (type === oFF.PrElementType.INTEGER) {
				return element;
			}
			if (type.isNumber()) {
				return oFF.PrFactory.createInteger(element.asNumber()
						.getInteger());
			}
			if (type === oFF.PrElementType.STRING) {
				try {
					integerValue = oFF.XInteger.convertFromStringWithRadix(
							element.getString(), 10);
					return oFF.PrFactory.createInteger(integerValue);
				} catch (t1) {
					return null;
				}
			}
			return null;
		},
		convertElementToIntegerValue : function(element, defaultValue) {
			var elementAsInteger = oFF.PrUtils.convertElementToInteger(element);
			return oFF.isNull(elementAsInteger) ? defaultValue
					: elementAsInteger.getInteger();
		},
		convertElementToLong : function(element) {
			var type = oFF.PrUtils.getTypeFromElement(element);
			var longValue;
			if (oFF.isNull(type)) {
				return null;
			}
			if (type === oFF.PrElementType.LONG) {
				return element;
			}
			if (type.isNumber()) {
				return oFF.PrLong.createWithValue(element.asNumber().getLong());
			}
			if (type === oFF.PrElementType.STRING) {
				try {
					longValue = oFF.XLong
							.convertFromString(element.getString());
					return oFF.PrLong.createWithValue(longValue);
				} catch (t1) {
					return null;
				}
			}
			return null;
		},
		convertElementToLongValue : function(element, defaultValue) {
			var elementAsLong = oFF.PrUtils.convertElementToLong(element);
			return oFF.isNull(elementAsLong) ? defaultValue : elementAsLong
					.getLong();
		},
		convertElementToDouble : function(element) {
			var type = oFF.PrUtils.getTypeFromElement(element);
			var doubleValue;
			if (oFF.isNull(type)) {
				return null;
			}
			if (type === oFF.PrElementType.DOUBLE) {
				return element;
			}
			if (type.isNumber()) {
				return oFF.PrDouble.createWithValue(element.asNumber()
						.getDouble());
			}
			if (type === oFF.PrElementType.STRING) {
				try {
					doubleValue = oFF.XDouble.convertFromString(element
							.getString());
					return oFF.PrDouble.createWithValue(doubleValue);
				} catch (t1) {
					return null;
				}
			}
			return null;
		},
		convertElementToDoubleValue : function(element, defaultValue) {
			var elementAsDouble = oFF.PrUtils.convertElementToDouble(element);
			return oFF.isNull(elementAsDouble) ? defaultValue : elementAsDouble
					.getDouble();
		},
		getListSize : function(element, defaultSize) {
			return oFF.PrUtils.isElementValid(element, oFF.PrElementType.LIST) ? element
					.size()
					: defaultSize;
		},
		getKeysAsReadOnlyListOfString : function(element, defaultNames) {
			return oFF.PrUtils.isElementValid(element,
					oFF.PrElementType.STRUCTURE) ? element
					.getKeysAsReadOnlyListOfString() : defaultNames;
		},
		getStructureSize : function(element, defaultSize) {
			var elementNames = oFF.PrUtils.getKeysAsReadOnlyListOfString(
					element, null);
			return oFF.isNull(elementNames) ? defaultSize : elementNames.size();
		},
		createDeepCopy : function(element) {
			return oFF.PrUtils.createDeepCopyExt(element, null);
		},
		createDeepCopyExt : function(element, target) {
			var type = oFF.PrUtils.getTypeFromElement(element);
			var prStruct;
			var prList;
			var prBoolean;
			var prString;
			var prInt;
			var prLong;
			var prDouble;
			var childCopy;
			var originChild;
			var originStruct;
			var structure;
			var elementNames;
			var len;
			var i;
			var name;
			var originList;
			var list;
			var size;
			var k;
			var originBoolean;
			var originString;
			var originInt;
			var originLong;
			var originDouble;
			if (oFF.isNull(type)) {
				return null;
			}
			prStruct = oFF.PrElementType.STRUCTURE;
			prList = oFF.PrElementType.LIST;
			prBoolean = oFF.PrElementType.BOOLEAN;
			prString = oFF.PrElementType.STRING;
			prInt = oFF.PrElementType.INTEGER;
			prLong = oFF.PrElementType.LONG;
			prDouble = oFF.PrElementType.DOUBLE;
			if (type === prStruct) {
				originStruct = element;
				structure = target;
				if (oFF.isNull(structure)) {
					structure = oFF.PrFactory.createStructure();
				} else {
					structure.clear();
				}
				elementNames = originStruct.getKeysAsReadOnlyListOfString();
				len = elementNames.size();
				for (i = 0; i < len; i++) {
					name = elementNames.get(i);
					originChild = originStruct.getByKey(name);
					childCopy = oFF.PrUtils
							.createDeepCopyExt(originChild, null);
					structure.put(name, childCopy);
				}
				return structure;
			} else {
				if (type === prList) {
					originList = element;
					list = target;
					if (oFF.isNull(list)) {
						list = oFF.PrFactory.createList();
					} else {
						list.clear();
					}
					size = originList.size();
					for (k = 0; k < size; k++) {
						originChild = originList.get(k);
						childCopy = oFF.PrUtils.createDeepCopyExt(originChild,
								null);
						list.add(childCopy);
					}
					return list;
				} else {
					if (type === prBoolean) {
						originBoolean = element;
						return oFF.PrFactory.createBoolean(originBoolean
								.getBoolean());
					} else {
						if (type === prString) {
							originString = element;
							return oFF.PrFactory.createString(originString
									.getString());
						} else {
							if (type === prInt) {
								originInt = element;
								return oFF.PrFactory.createInteger(originInt
										.getInteger());
							} else {
								if (type === prLong) {
									originLong = element;
									return oFF.PrFactory.createLong(originLong
											.getLong());
								} else {
									if (type === prDouble) {
										originDouble = element;
										return oFF.PrFactory
												.createDouble(originDouble
														.getDouble());
									}
								}
							}
						}
					}
				}
			}
			return null;
		},
		removeProperty : function(structure, name) {
			if (oFF.notNull(structure)
					&& oFF.PrUtils.getProperty(structure, name) !== null) {
				structure.remove(name);
			}
		},
		createElementDeepCopy : function(element) {
			return oFF.isNull(element) ? null : oFF.PrUtils
					.copyElement(element);
		},
		copyElement : function(element) {
			var prElementType;
			if (oFF.isNull(element)) {
				return null;
			}
			prElementType = element.getType();
			if (oFF.PrElementType.BOOLEAN === prElementType) {
				return oFF.PrFactory.createBoolean(element.getBoolean());
			} else {
				if (oFF.PrElementType.THE_NULL === prElementType) {
					return null;
				} else {
					if (oFF.PrElementType.INTEGER === prElementType) {
						return oFF.PrFactory.createInteger(element.asNumber()
								.getInteger());
					} else {
						if (oFF.PrElementType.LONG === prElementType) {
							return oFF.PrFactory.createLong(element.asNumber()
									.getLong());
						} else {
							if (oFF.PrElementType.DOUBLE === prElementType) {
								return oFF.PrFactory.createDouble(element
										.asNumber().getDouble());
							} else {
								if (oFF.PrElementType.STRING === prElementType) {
									return oFF.PrFactory.createString(element
											.getString());
								} else {
									if (oFF.PrElementType.STRUCTURE === prElementType) {
										return oFF.PrUtils
												.copyStructure(element);
									} else {
										if (oFF.PrElementType.LIST === prElementType) {
											return oFF.PrUtils
													.copyList(element);
										}
									}
								}
							}
						}
					}
				}
			}
			throw oFF.XException.createIllegalStateException("unknown type");
		},
		copyStructure : function(structure) {
			var structureCopy = oFF.PrFactory.createStructure();
			var structureElementNames = structure
					.getKeysAsReadOnlyListOfString();
			var structureElementNamesSize = structureElementNames.size();
			var i;
			var structureElementName;
			var structureElement;
			var structureElementCopy;
			for (i = 0; i < structureElementNamesSize; i++) {
				structureElementName = structureElementNames.get(i);
				structureElement = structure.getByKey(structureElementName);
				structureElementCopy = oFF.PrUtils
						.copyElement(structureElement);
				structureCopy.put(structureElementName, structureElementCopy);
			}
			return structureCopy;
		},
		copyList : function(list) {
			var listCopy = oFF.PrFactory.createList();
			var listSize = list.size();
			var i;
			var listElement;
			var listElementCopy;
			for (i = 0; i < listSize; i++) {
				listElement = list.get(i);
				listElementCopy = oFF.PrUtils.copyElement(listElement);
				listCopy.add(listElementCopy);
			}
			return listCopy;
		},
		serialize : function(element, sortStructureElements, prettyPrint,
				indentation) {
			var buffer = oFF.XStringBuffer.create();
			oFF.PrUtils.appendElement(element, null, buffer,
					sortStructureElements, prettyPrint, indentation, 0);
			return buffer.toString();
		},
		appendIndentationString : function(buffer, indentation,
				indentationLevel) {
			var spaces;
			var i;
			if (indentation >= 1 && indentationLevel >= 1) {
				spaces = indentation * indentationLevel;
				for (i = 0; i < spaces; i++) {
					buffer.append(" ");
				}
			}
		},
		escapeQuote : function(name) {
			return oFF.XString.containsString(name, '"') ? oFF.XString.replace(
					name, '"', '\\"') : name;
		},
		appendElement : function(element, elementName, buffer,
				sortStructureElements, prettyPrint, indentation,
				indentationLevel) {
			var type;
			var stringValue;
			if (prettyPrint) {
				oFF.PrUtils.appendIndentationString(buffer, indentation,
						indentationLevel);
			}
			if (oFF.notNull(elementName)) {
				buffer.append('"');
				buffer.append(oFF.PrUtils.escapeQuote(elementName));
				buffer.append('":');
				if (prettyPrint) {
					buffer.append(" ");
				}
			}
			if (oFF.isNull(element)) {
				buffer.append("null");
			} else {
				type = element.getType();
				if (type === oFF.PrElementType.STRUCTURE) {
					oFF.PrUtils.appendStructure(element, buffer,
							sortStructureElements, prettyPrint, indentation,
							indentationLevel);
				} else {
					if (type === oFF.PrElementType.LIST) {
						oFF.PrUtils.appendList(element, buffer,
								sortStructureElements, prettyPrint,
								indentation, indentationLevel);
					} else {
						if (type === oFF.PrElementType.STRING) {
							stringValue = element.asString().getString();
							if (oFF.isNull(stringValue)) {
								buffer.append("null");
							} else {
								buffer.append('"');
								buffer.append(oFF.XHttpUtils
										.escapeToJsonString(stringValue));
								buffer.append('"');
							}
						} else {
							if (type === oFF.PrElementType.DOUBLE) {
								buffer.appendDouble(element.asNumber()
										.getDouble());
							} else {
								if (type.isNumber()) {
									buffer.appendLong(element.asNumber()
											.getLong());
								} else {
									if (type === oFF.PrElementType.BOOLEAN) {
										if (element.getBoolean()) {
											buffer.append("true");
										} else {
											buffer.append("false");
										}
									} else {
										if (type === oFF.PrElementType.THE_NULL) {
											buffer.append("null");
										}
									}
								}
							}
						}
					}
				}
			}
		},
		appendStructure : function(element, buffer, sortStructureElements,
				prettyPrint, indentation, indentationLevel) {
			var hasElements;
			var structure;
			var structureElementNames;
			var structureSize;
			var i;
			var structureElementName;
			var structureElement;
			var childIndentationLevel;
			buffer.append("{");
			hasElements = false;
			structure = element;
			structureElementNames = structure.getKeysAsReadOnlyListOfString();
			if (oFF.notNull(structureElementNames)) {
				structureSize = structureElementNames.size();
				if (sortStructureElements && structureSize > 1) {
					structureElementNames
							.sortByDirection(oFF.XSortDirection.ASCENDING);
				}
				for (i = 0; i < structureSize; i++) {
					if (hasElements) {
						buffer.append(",");
					}
					hasElements = true;
					structureElementName = structureElementNames.get(i);
					structureElement = structure.getByKey(structureElementName);
					if (prettyPrint) {
						buffer.appendNewLine();
						childIndentationLevel = indentationLevel + 1;
						oFF.PrUtils.appendElement(structureElement,
								structureElementName, buffer,
								sortStructureElements, prettyPrint,
								indentation, childIndentationLevel);
					} else {
						oFF.PrUtils.appendElement(structureElement,
								structureElementName, buffer,
								sortStructureElements, false, 0, 0);
					}
				}
			}
			if (prettyPrint && hasElements) {
				buffer.appendNewLine();
				oFF.PrUtils.appendIndentationString(buffer, indentation,
						indentationLevel);
			}
			buffer.append("}");
		},
		appendList : function(element, buffer, sortStructureElements,
				prettyPrint, indentation, indentationLevel) {
			var hasElements;
			var list;
			var size;
			var i;
			var listElement;
			var childIndentationLevel;
			buffer.append("[");
			hasElements = false;
			list = element;
			size = list.size();
			for (i = 0; i < size; i++) {
				if (hasElements) {
					buffer.append(",");
				}
				hasElements = true;
				listElement = list.get(i);
				if (prettyPrint) {
					buffer.appendNewLine();
					childIndentationLevel = indentationLevel + 1;
					oFF.PrUtils.appendElement(listElement, null, buffer,
							sortStructureElements, prettyPrint, indentation,
							childIndentationLevel);
				} else {
					oFF.PrUtils.appendElement(listElement, null, buffer,
							sortStructureElements, false, 0, 0);
				}
			}
			if (prettyPrint && hasElements) {
				buffer.appendNewLine();
				oFF.PrUtils.appendIndentationString(buffer, indentation,
						indentationLevel);
			}
			buffer.append("]");
		},
		deepCopyElement : function(origin) {
			var type;
			if (oFF.isNull(origin)) {
				return null;
			}
			type = origin.getType();
			if (type === oFF.PrElementType.STRUCTURE) {
				return oFF.PrStructure.createDeepCopy(origin);
			} else {
				if (type === oFF.PrElementType.LIST) {
					return oFF.PrList.createDeepCopy(origin);
				}
			}
			return origin.getPermaCopy();
		},
		contains : function(list, element) {
			return oFF.PrUtils.indexOf(list, element) > -1;
		},
		indexOf : function(list, element) {
			var size;
			var i;
			if (oFF.PrUtils.isListEmpty(list)) {
				return -1;
			}
			size = list.size();
			for (i = 0; i < size; i++) {
				if (oFF.XObjectExt.areEqual(list.get(i), element)) {
					return i;
				}
			}
			return -1;
		},
		getStructureWithKeyValuePair : function(list, key, value) {
			var size;
			var i;
			var structure;
			if (oFF.XCollectionUtils.hasElements(list)
					&& oFF.XStringUtils.isNotNullAndNotEmpty(key)
					&& oFF.XStringUtils.isNotNullAndNotEmpty(value)) {
				size = list.size();
				for (i = 0; i < size; i++) {
					structure = list.getStructureAt(i);
					if (oFF.XString.isEqual(oFF.PrUtils.getStringValueProperty(
							structure, key, null), value)) {
						return structure;
					}
				}
			}
			return null;
		}
	};
	oFF.ReplaceTagHandler = {
		charDot : 46,
		handle : function(element, value) {
			var result = value;
			while (oFF.XString.containsString(result, "<<")
					|| oFF.XString.containsString(result, ">>")) {
				result = oFF.ReplaceTagHandler.handleReplaceTags(element,
						result);
			}
			return result;
		},
		handleReplaceTags : function(element, value) {
			var buffer = oFF.XStringBuffer.create();
			var pieces = oFF.XStringTokenizer.splitString(value, "<<");
			var len = pieces.size();
			var i;
			var piece;
			var closeIndex;
			var tag;
			var replaceValue;
			for (i = 0; i < len; i++) {
				piece = pieces.get(i);
				if (oFF.XStringUtils.isNullOrEmpty(piece)) {
					continue;
				}
				closeIndex = oFF.XString.indexOf(piece, ">>");
				if (closeIndex === -1) {
					buffer.append(piece);
					continue;
				}
				tag = oFF.XString.substring(piece, 0, closeIndex);
				replaceValue = oFF.ReplaceTagHandler.findTagValue(element, tag);
				if (oFF.isNull(replaceValue)) {
					return null;
				}
				buffer.append(replaceValue);
				buffer.append(oFF.XString.substring(piece, closeIndex + 2, -1));
			}
			return buffer.toString();
		},
		findTagValue : function(startElement, tag) {
			var dots = 0;
			var tagLen = oFF.XString.size(tag);
			var current;
			var j;
			var tagName;
			while (dots < tagLen
					&& oFF.XString.getCharAt(tag, dots) === oFF.ReplaceTagHandler.charDot) {
				dots++;
			}
			current = startElement;
			for (j = 0; j < dots - 1; j++) {
				current = current.getParent();
				if (current.isList()) {
					current = current.getParent();
				}
			}
			tagName = oFF.XString.substring(tag, dots, -1);
			return oFF.PrUtils.convertElementToStringValue(current
					.asStructure().getByKey(tagName), null);
		}
	};
	oFF.TemplateWalker = {
		TEMPLATES : "templates",
		root : null,
		walk : function(root) {
			var copy;
			if (!root.containsKey(oFF.TemplateWalker.TEMPLATES)) {
				return root;
			}
			copy = oFF.PrUtils.deepCopyElement(root).asStructure();
			oFF.TemplateWalker.root = copy;
			oFF.TemplateWalker.walkStructure(copy);
			return copy;
		},
		walkStructure : function(parentStruct) {
			var elementNames = parentStruct.getKeysAsReadOnlyListOfString();
			var len = elementNames.size();
			var i;
			var childName;
			var childElement;
			var childType;
			var childStruct;
			var templateStructure;
			for (i = 0; i < len; i++) {
				childName = elementNames.get(i);
				childElement = parentStruct.getByKey(childName);
				if (oFF.isNull(childElement)
						|| oFF.XString.isEqual(childName,
								oFF.TemplateWalker.TEMPLATES)) {
					continue;
				}
				childType = childElement.getType();
				if (childType === oFF.PrElementType.STRUCTURE) {
					childStruct = childElement.asStructure();
					if (childStruct.containsKey("$ref")) {
						templateStructure = oFF.PrTemplateStructure
								.createStructureWrapper(
										oFF.TemplateWalker.root, parentStruct,
										childStruct);
						parentStruct.put(childName, templateStructure);
					} else {
						oFF.TemplateWalker.walkStructure(childStruct);
					}
				} else {
					if (childType === oFF.PrElementType.LIST) {
						oFF.TemplateWalker.walkList(childElement.asList());
					}
				}
			}
		},
		walkList : function(parentList) {
			var len = parentList.size();
			var i;
			var childElement;
			var childType;
			var childStruct;
			var templateStructure;
			for (i = 0; i < len; i++) {
				childElement = parentList.get(i);
				if (oFF.isNull(childElement)) {
					continue;
				}
				childType = childElement.getType();
				if (childType === oFF.PrElementType.STRUCTURE) {
					childStruct = childElement.asStructure();
					if (childStruct.containsKey("$ref")) {
						templateStructure = oFF.PrTemplateStructure
								.createStructureWrapper(
										oFF.TemplateWalker.root, parentList,
										childStruct);
						parentList.set(i, templateStructure);
					} else {
						oFF.TemplateWalker.walkStructure(childStruct);
					}
				} else {
					if (childType === oFF.PrElementType.LIST) {
						oFF.TemplateWalker.walkList(childElement.asList());
					}
				}
			}
		}
	};
	oFF.RegistrationEntry = function() {
	};
	oFF.RegistrationEntry.prototype = new oFF.XObject();
	oFF.RegistrationEntry.create = function() {
		return new oFF.RegistrationEntry();
	};
	oFF.RegistrationEntry.prototype.m_class = null;
	oFF.RegistrationEntry.prototype.m_serviceTypeName = null;
	oFF.RegistrationEntry.prototype.releaseObject = function() {
		this.m_class = null;
		this.m_serviceTypeName = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.RegistrationEntry.prototype.setXClass = function(clazz) {
		this.m_class = clazz;
	};
	oFF.RegistrationEntry.prototype.getXClass = function() {
		return this.m_class;
	};
	oFF.RegistrationEntry.prototype.getServiceTypeName = function() {
		return this.m_serviceTypeName;
	};
	oFF.RegistrationEntry.prototype.setServiceTypeName = function(name) {
		this.m_serviceTypeName = name;
	};
	oFF.RegistrationEntry.prototype.toString = function() {
		return this.m_serviceTypeName;
	};
	oFF.RegistrationService = function() {
	};
	oFF.RegistrationService.prototype = new oFF.XObject();
	oFF.RegistrationService.DEFAULT_NAME = "$$default$$";
	oFF.RegistrationService.SERVICE = "SERVICE";
	oFF.RegistrationService.SERVICE_CONFIG = "SERVICE_CONFIG";
	oFF.RegistrationService.PROGRAM = "PROGRAM";
	oFF.RegistrationService.WORKING_TASK_MGR = "WORKING_TASK_MGR";
	oFF.RegistrationService.COMMAND = "COMMAND";
	oFF.RegistrationService.s_registrationService = null;
	oFF.RegistrationService.getInstance = function() {
		if (oFF.isNull(oFF.RegistrationService.s_registrationService)) {
			oFF.RegistrationService.s_registrationService = new oFF.RegistrationService();
			oFF.RegistrationService.s_registrationService.setup();
		}
		return oFF.RegistrationService.s_registrationService;
	};
	oFF.RegistrationService.prototype.m_references = null;
	oFF.RegistrationService.prototype.m_qualifiedReferences = null;
	oFF.RegistrationService.prototype.setup = function() {
		oFF.XObject.prototype.setup.call(this);
		this.m_references = oFF.XList.create();
		this.m_qualifiedReferences = oFF.XHashMapByString.create();
	};
	oFF.RegistrationService.prototype.releaseObject = function() {
		this.m_qualifiedReferences = oFF.XObjectExt
				.release(this.m_qualifiedReferences);
		this.m_references = oFF.XObjectExt.release(this.m_references);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.RegistrationService.prototype.addService = function(name, clazz) {
		this.addReferenceWithType(oFF.RegistrationService.SERVICE, name, clazz);
	};
	oFF.RegistrationService.prototype.addStudioProgram = function(name, clazz) {
		this.addReferenceWithType(oFF.RegistrationService.PROGRAM, name, clazz);
	};
	oFF.RegistrationService.prototype.addServiceConfig = function(name, clazz) {
		this.addReferenceWithType(oFF.RegistrationService.SERVICE_CONFIG, name,
				clazz);
	};
	oFF.RegistrationService.prototype.addCommand = function(commandName, clazz) {
		this.addCommandWithType("CUSTOM", commandName, clazz);
	};
	oFF.RegistrationService.prototype.addCommandWithType = function(
			commandType, commandName, clazz) {
		var qualifiedCommandName = oFF.XStringUtils.concatenate3(commandType,
				".", commandName);
		this.addReferenceWithType(oFF.RegistrationService.COMMAND,
				qualifiedCommandName, clazz);
	};
	oFF.RegistrationService.prototype.addReference = function(
			fullQualifiedName, clazz) {
		var index = oFF.XString.indexOf(fullQualifiedName, ".");
		var type = oFF.XString.substring(fullQualifiedName, 0, index);
		var name = oFF.XString.substring(fullQualifiedName, index + 1, -1);
		this.addReferenceWithType(type, name, clazz);
	};
	oFF.RegistrationService.prototype.addReferenceWithType = function(type,
			name, clazz) {
		var accessName = name;
		var serviceTypeName;
		var registrationEntry;
		var clazzMap;
		var listOfClasses;
		if (oFF.isNull(accessName)) {
			accessName = oFF.RegistrationService.DEFAULT_NAME;
		}
		serviceTypeName = oFF.XStringUtils.concatenate3(type, ".", accessName);
		if (!this.hasEntry(serviceTypeName, clazz)) {
			registrationEntry = oFF.RegistrationEntry.create();
			registrationEntry.setXClass(clazz);
			registrationEntry.setServiceTypeName(serviceTypeName);
			this.m_references.add(registrationEntry);
			clazzMap = this.m_qualifiedReferences.getByKey(type);
			if (oFF.isNull(clazzMap)) {
				clazzMap = oFF.XHashMapByString.create();
				this.m_qualifiedReferences.put(type, clazzMap);
			}
			listOfClasses = clazzMap.getByKey(accessName);
			if (oFF.isNull(listOfClasses)) {
				listOfClasses = oFF.XList.create();
				clazzMap.put(accessName, listOfClasses);
			}
			listOfClasses.add(clazz);
		}
	};
	oFF.RegistrationService.prototype.hasEntry = function(serviceTypeName,
			clazz) {
		var i;
		var reference;
		for (i = 0; i < this.m_references.size(); i++) {
			reference = this.m_references.get(i);
			if (oFF.XString.isEqual(reference.getServiceTypeName(),
					serviceTypeName)
					&& reference.getXClass() === clazz) {
				return true;
			}
		}
		return false;
	};
	oFF.RegistrationService.prototype.getReferences = function(
			fullQualifiedName) {
		var registeredClasses = oFF.XList.create();
		var i;
		var reference;
		for (i = 0; i < this.m_references.size(); i++) {
			reference = this.m_references.get(i);
			if (oFF.XString.isEqual(reference.getServiceTypeName(),
					fullQualifiedName)) {
				registeredClasses.add(reference.getXClass());
			}
		}
		if (!oFF.XString.isEqual(fullQualifiedName,
				"RESULTSET_REQUEST_DECORATOR_PROVIDER.IMPLEMENTATION")) {
			oFF.XBooleanUtils
					.checkFalse(
							registeredClasses.isEmpty(),
							oFF.XStringUtils
									.concatenate2(
											"RegistrationService.getRegisteredClassesForServiceName: no class found for service name ",
											fullQualifiedName));
		}
		return registeredClasses;
	};
	oFF.RegistrationService.prototype.getFirstReference = function(type, name) {
		var accessName = name;
		var classMap;
		var classList;
		if (oFF.isNull(accessName)) {
			accessName = oFF.RegistrationService.DEFAULT_NAME;
		}
		classMap = this.m_qualifiedReferences.getByKey(type);
		if (oFF.notNull(classMap)) {
			classList = classMap.getByKey(accessName);
			if (oFF.XCollectionUtils.hasElements(classList)) {
				return classList.get(0);
			}
		}
		return null;
	};
	oFF.RegistrationService.prototype.getLastReference = function(type, name) {
		var accessName = name;
		var classMap;
		var classList;
		if (oFF.isNull(accessName)) {
			accessName = oFF.RegistrationService.DEFAULT_NAME;
		}
		classMap = this.m_qualifiedReferences.getByKey(type);
		if (oFF.notNull(classMap)) {
			classList = classMap.getByKey(accessName);
			if (oFF.XCollectionUtils.hasElements(classList)) {
				return classList.get(classList.size() - 1);
			}
		}
		return null;
	};
	oFF.XNumberFormatter = {
		asciiTable : "!\"#$%&'()*+,-./0123456789:;<=>?",
		digit : 35,
		zeroInAbsence : 48,
		charDot : 46,
		charComma : 44,
		negativePrefix : 45,
		positivePrefix : 43,
		formatDoubleToString : function(value, format) {
			var prefixSign = 0;
			var zeroInAbsenceLeft = 0;
			var zeroInAbsenceRight = 0;
			var digitsRight = 0;
			var digitsLeft = 0;
			var isRight = false;
			var thousandSeparators = 0;
			var i;
			var currentChar;
			var hasGroupingSeparator;
			var localValue;
			var valueString;
			var leftExpressionSb;
			var rightExpression;
			var y;
			var currentChar1;
			var currentCharString;
			var leftExpressionLength;
			var rightExpressionLength;
			var roundingRequired;
			var lastDigit;
			var roundingBase;
			var firstRightDigit;
			var leftExpression;
			var result;
			var mod;
			var b;
			var currentChar2;
			for (i = 0; i < oFF.XString.size(format); i++) {
				currentChar = oFF.XString.getCharAt(format, i);
				if (currentChar === oFF.XNumberFormatter.negativePrefix
						|| currentChar === oFF.XNumberFormatter.positivePrefix) {
					prefixSign = currentChar;
				}
				if (currentChar === oFF.XNumberFormatter.digit
						|| currentChar === oFF.XNumberFormatter.zeroInAbsence) {
					if (isRight) {
						digitsRight++;
					} else {
						digitsLeft++;
					}
				}
				if (currentChar === oFF.XNumberFormatter.zeroInAbsence) {
					if (isRight) {
						zeroInAbsenceRight++;
					} else {
						zeroInAbsenceLeft++;
					}
				}
				if (currentChar === oFF.XNumberFormatter.charDot) {
					isRight = true;
				}
				if (currentChar === oFF.XNumberFormatter.charComma) {
					thousandSeparators++;
				}
			}
			hasGroupingSeparator = digitsLeft > 1;
			localValue = value;
			if (digitsLeft === 1 && thousandSeparators > 0) {
				localValue = value
						/ oFF.XNumberFormatter.calculateExp(thousandSeparators);
			}
			valueString = oFF.XNumberFormatter.normalizeScientificFormat(
					oFF.XDouble.convertToString(localValue),
					oFF.XNumberFormatter.charDot);
			leftExpressionSb = oFF.XStringBuffer.create();
			rightExpression = "";
			isRight = false;
			for (y = 0; y < oFF.XString.size(valueString); y++) {
				currentChar1 = oFF.XString.getCharAt(valueString, y);
				if (currentChar1 === prefixSign) {
					continue;
				}
				if (currentChar1 === oFF.XNumberFormatter.charDot) {
					isRight = true;
				} else {
					currentCharString = oFF.XNumberFormatter
							.convertAsciiToString(currentChar1);
					if (isRight) {
						rightExpression = oFF.XStringUtils.concatenate2(
								rightExpression, currentCharString);
					} else {
						leftExpressionSb.append(currentCharString);
					}
				}
			}
			leftExpressionLength = leftExpressionSb.length();
			rightExpressionLength = oFF.XString.size(rightExpression);
			roundingRequired = false;
			if (digitsRight > 0) {
				if (rightExpressionLength > digitsRight) {
					lastDigit = oFF.XNumberFormatter.charToInt(oFF.XString
							.getCharAt(rightExpression, digitsRight - 1));
					roundingBase = oFF.XNumberFormatter.charToInt(oFF.XString
							.getCharAt(rightExpression, digitsRight));
					rightExpression = oFF.XString.substring(rightExpression, 0,
							digitsRight - 1);
					rightExpression = oFF.XStringUtils.concatenate2(
							rightExpression, oFF.XInteger
									.convertToString(lastDigit));
					roundingRequired = roundingBase >= 5;
				}
				if (rightExpressionLength < digitsRight
						&& zeroInAbsenceRight > 0) {
					rightExpression = oFF.XStringUtils.rightPad(
							rightExpression, "0", digitsRight
									- rightExpressionLength);
				}
			} else {
				firstRightDigit = oFF.XNumberFormatter.charToInt(oFF.XString
						.getCharAt(rightExpression, 0));
				roundingRequired = firstRightDigit >= 5;
				rightExpression = "";
			}
			rightExpressionLength = oFF.XString.size(rightExpression);
			leftExpression = leftExpressionSb.toString();
			oFF.XObjectExt.release(leftExpressionSb);
			if (zeroInAbsenceLeft > 0) {
				leftExpression = oFF.XStringUtils.leftPad(leftExpression, "0",
						digitsLeft - leftExpressionLength);
			}
			leftExpressionLength = oFF.XString.size(leftExpression);
			result = oFF.XStringBuffer.create();
			if (prefixSign !== 0) {
				result.append(oFF.XNumberFormatter
						.convertAsciiToString(prefixSign));
			}
			mod = oFF.XMath.mod(leftExpressionLength, 3);
			for (b = 0; b < leftExpressionLength; b++) {
				currentChar2 = oFF.XString.getCharAt(leftExpression, b);
				if (hasGroupingSeparator) {
					if (b > 0 && oFF.XMath.mod(b, 3) === mod) {
						result
								.append(oFF.XNumberFormatter
										.convertAsciiToString(oFF.XNumberFormatter.charComma));
					}
				}
				result.append(oFF.XNumberFormatter
						.convertAsciiToString(currentChar2));
			}
			if (rightExpressionLength > 0) {
				result.append(oFF.XNumberFormatter
						.convertAsciiToString(oFF.XNumberFormatter.charDot));
			}
			result.append(rightExpression);
			if (roundingRequired) {
				return oFF.XNumberFormatter.round(result.toString());
			}
			return result.toString();
		},
		charToInt : function(value) {
			return value - 48;
		},
		calculateExp : function(exponent) {
			var result = 1000;
			var i;
			for (i = 1; i < exponent; i++) {
				result = result * result;
			}
			return result;
		},
		normalizeScientificFormatString : function(value, decimalSeparator) {
			if (oFF.XStringUtils.isNotNullAndNotEmpty(value)
					&& oFF.XStringUtils.isNotNullAndNotEmpty(decimalSeparator)) {
				if (oFF.XString.isEqual(decimalSeparator, ".")) {
					return oFF.XNumberFormatter.normalizeScientificFormat(
							value, oFF.XNumberFormatter.charDot);
				}
				if (oFF.XString.isEqual(decimalSeparator, ",")) {
					return oFF.XNumberFormatter.normalizeScientificFormat(
							value, oFF.XNumberFormatter.charComma);
				}
			}
			return null;
		},
		stripCharsFromNumber : function(value, decimalSeparator, expIdx) {
			var cleanedValue = oFF.XString.substring(value, 0, expIdx);
			var decSep = oFF.XNumberFormatter
					.convertAsciiToString(decimalSeparator);
			var decSepIdx = oFF.XString.indexOf(cleanedValue, decSep);
			var currentValueStrSize;
			var j;
			var currentChar;
			if (decSepIdx > -1) {
				currentValueStrSize = oFF.XString.size(cleanedValue);
				for (j = currentValueStrSize - 1; j >= decSepIdx; j--) {
					currentChar = oFF.XNumberFormatter
							.convertAsciiToString(oFF.XString.getCharAt(
									cleanedValue, j));
					if (oFF.XString.isEqual(currentChar, "0")) {
						cleanedValue = oFF.XString
								.substring(cleanedValue, 0, j);
					} else {
						break;
					}
				}
			}
			cleanedValue = oFF.XString.replace(cleanedValue, decSep, "");
			return oFF.XString.replace(cleanedValue, "-", "");
		},
		normalizeScientificFormat : function(value, decimalSeparator) {
			var patternString = "e";
			var expIdx = oFF.XString.indexOf(value, patternString);
			var cleanedValue;
			var tokenizedString;
			var i;
			var charToAdd;
			var expStrValue;
			var expValue;
			var decSep;
			var currentDecSepPos;
			var newDecSepPos;
			var newStringValue;
			var n;
			if (expIdx === -1) {
				patternString = "E";
				expIdx = oFF.XString.indexOf(value, patternString);
			}
			if (expIdx === -1) {
				return value;
			}
			cleanedValue = oFF.XNumberFormatter.stripCharsFromNumber(value,
					decimalSeparator, expIdx);
			tokenizedString = oFF.XListOfString.create();
			for (i = 0; i < oFF.XString.size(cleanedValue); i++) {
				charToAdd = oFF.XNumberFormatter
						.convertAsciiToString(oFF.XString.getCharAt(
								cleanedValue, i));
				tokenizedString.add(charToAdd);
			}
			expStrValue = oFF.XString.substring(value, expIdx, -1);
			expValue = oFF.XInteger.convertFromStringWithRadix(oFF.XString
					.replace(expStrValue, patternString, ""), 10);
			decSep = oFF.XNumberFormatter
					.convertAsciiToString(decimalSeparator);
			currentDecSepPos = oFF.XString.indexOf(oFF.XString.replace(value,
					"-", ""), decSep);
			if (currentDecSepPos === -1) {
				currentDecSepPos = 1;
			}
			newDecSepPos = currentDecSepPos + expValue;
			if (expValue >= 0) {
				while (newDecSepPos > tokenizedString.size()) {
					tokenizedString.add("0");
				}
			} else {
				while (oFF.XString.size(cleanedValue) + expValue * -1 > tokenizedString
						.size()) {
					tokenizedString.insert(0, "0");
				}
				newDecSepPos = currentDecSepPos + expValue;
				if (newDecSepPos < 0) {
					newDecSepPos = 1;
				}
			}
			if (newDecSepPos < tokenizedString.size() - 1) {
				tokenizedString.insert(newDecSepPos, decSep);
			}
			if (oFF.XString.startsWith(value, "-")) {
				tokenizedString.insert(0, "-");
			}
			newStringValue = oFF.XStringBuffer.create();
			for (n = 0; n < tokenizedString.size(); n++) {
				newStringValue.append(tokenizedString.get(n));
			}
			return newStringValue.toString();
		},
		convertAsciiToString : function(value) {
			return oFF.XString.substring(oFF.XNumberFormatter.asciiTable,
					value - 33, value - 32);
		},
		round : function(value) {
			var result = oFF.XStringBuffer.create();
			var rest = 1;
			var i;
			var currentChar;
			var charInt;
			var resultString;
			var length;
			var returnValue;
			var y;
			var currentChar1;
			for (i = oFF.XString.size(value) - 1; i >= 0; i--) {
				currentChar = oFF.XString.getCharAt(value, i);
				if (currentChar === oFF.XNumberFormatter.charDot
						|| currentChar === oFF.XNumberFormatter.charComma
						|| currentChar === 45 || currentChar === 43) {
					result.append(oFF.XNumberFormatter
							.convertAsciiToString(currentChar));
					continue;
				}
				charInt = oFF.XNumberFormatter.charToInt(currentChar);
				if (rest === 1) {
					charInt++;
				}
				if (charInt > 9) {
					charInt = 0;
					rest = 1;
				} else {
					rest = 0;
				}
				result.appendInt(charInt);
				if (i === 0 && rest === 1) {
					result.append("1");
				}
			}
			resultString = result.toString();
			length = result.length();
			oFF.XObjectExt.release(result);
			returnValue = oFF.XStringBuffer.create();
			for (y = length - 1; y >= 0; y--) {
				currentChar1 = oFF.XNumberFormatter
						.convertAsciiToString(oFF.XString.getCharAt(
								resultString, y));
				returnValue.append(currentChar1);
			}
			return returnValue.toString();
		}
	};
	oFF.XPattern = {
		matches : function(value, pattern) {
			var testValue;
			var testPattern;
			var patternParts;
			var i;
			var part;
			var endIndexOfPatternInTestname;
			if (oFF.XStringUtils.isNullOrEmpty(value)
					|| oFF.XStringUtils.isNullOrEmpty(pattern)) {
				return false;
			}
			testValue = oFF.XString.toLowerCase(value);
			testPattern = oFF.XString.toLowerCase(pattern);
			patternParts = oFF.XStringTokenizer.splitString(testPattern, "*");
			for (i = 0; i < patternParts.size(); i++) {
				part = patternParts.get(i);
				if (oFF.XStringUtils.isNotNullAndNotEmpty(part)) {
					if (i === 0) {
						if (!oFF.XString.startsWith(testValue, part)) {
							return false;
						}
					} else {
						if (i === patternParts.size() - 1) {
							if (!oFF.XString.endsWith(testValue, part)) {
								return false;
							}
						} else {
							if (!oFF.XString.containsString(testValue, part)) {
								return false;
							}
						}
					}
					endIndexOfPatternInTestname = oFF.XString.indexOf(
							testValue, part)
							+ oFF.XString.size(part);
					testValue = oFF.XString.substring(testValue,
							endIndexOfPatternInTestname, oFF.XString
									.size(testValue));
				}
			}
			return true;
		}
	};
	oFF.XTrace = function() {
	};
	oFF.XTrace.prototype = new oFF.XObject();
	oFF.XTrace.create = function() {
		var param = new oFF.XTrace();
		param.setup();
		return param;
	};
	oFF.XTrace.prototype.m_valueTraces = null;
	oFF.XTrace.prototype.setup = function() {
		this.m_valueTraces = oFF.XListOfString.create();
	};
	oFF.XTrace.prototype.addNameObject = function(value) {
		if (oFF.isNull(value)) {
			return this.addString(null);
		}
		return this.addString(value.getName());
	};
	oFF.XTrace.prototype.addXValue = function(value) {
		if (oFF.isNull(value)) {
			return this.addString(null);
		}
		return this.addString(value.getStringRepresentation());
	};
	oFF.XTrace.prototype.addString = function(value) {
		this.m_valueTraces.add(value);
		return this;
	};
	oFF.XTrace.prototype.addBoolean = function(value) {
		return this.addString(oFF.XBoolean.convertToString(value));
	};
	oFF.XTrace.prototype.addInteger = function(value) {
		return this.addString(oFF.XInteger.convertToString(value));
	};
	oFF.XTrace.prototype.addDouble = function(value) {
		return this.addString(oFF.XDouble.convertToString(value));
	};
	oFF.XTrace.prototype.addLong = function(value) {
		return this.addString(oFF.XLong.convertToString(value));
	};
	oFF.XTrace.prototype.addStringList = function(list) {
		var buffer = oFF.XStringBuffer.create();
		var len = list.size();
		var i;
		buffer.append("[");
		for (i = 0; i < len; i++) {
			buffer.append(list.get(i));
			if (i + 1 < len) {
				buffer.append(",");
			}
		}
		buffer.append("]");
		this.addString(buffer.toString());
		return this;
	};
	oFF.XTrace.prototype.getTrace = function(index) {
		return this.m_valueTraces.get(index);
	};
	oFF.XTrace.prototype.hasElements = function() {
		return this.m_valueTraces.size() !== 0;
	};
	oFF.XTrace.prototype.size = function() {
		return this.m_valueTraces.size();
	};
	oFF.XTrace.prototype.releaseObject = function() {
		this.m_valueTraces = oFF.XObjectExt.release(this.m_valueTraces);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XTrace.prototype.toString = function() {
		return this.m_valueTraces.toString();
	};
	oFF.UiColor = function() {
	};
	oFF.UiColor.prototype = new oFF.XObject();
	oFF.UiColor.RED = null;
	oFF.UiColor.GREEN = null;
	oFF.UiColor.BLUE = null;
	oFF.UiColor.YELLOW = null;
	oFF.UiColor.ORANGE = null;
	oFF.UiColor.PURPLE = null;
	oFF.UiColor.CYAN = null;
	oFF.UiColor.MAGENTA = null;
	oFF.UiColor.LIME = null;
	oFF.UiColor.PINK = null;
	oFF.UiColor.TEAL = null;
	oFF.UiColor.LAVENDER = null;
	oFF.UiColor.BROWN = null;
	oFF.UiColor.BEIGE = null;
	oFF.UiColor.MAROON = null;
	oFF.UiColor.MINT = null;
	oFF.UiColor.OLIVE = null;
	oFF.UiColor.APRICOT = null;
	oFF.UiColor.NAVY = null;
	oFF.UiColor.GREY = null;
	oFF.UiColor.BLACK = null;
	oFF.UiColor.WHITE = null;
	oFF.UiColor.TRANSPARENT = null;
	oFF.UiColor.s_lookup = null;
	oFF.UiColor.staticSetup = function() {
		oFF.UiColor.s_lookup = oFF.XHashMapByString.create();
		oFF.UiColor.RED = oFF.UiColor.createStatic(230, 25, 75, 1, "red");
		oFF.UiColor.GREEN = oFF.UiColor.createStatic(60, 180, 75, 1, "green");
		oFF.UiColor.BLUE = oFF.UiColor.createStatic(67, 99, 216, 1, "blue");
		oFF.UiColor.YELLOW = oFF.UiColor
				.createStatic(255, 225, 25, 1, "yellow");
		oFF.UiColor.ORANGE = oFF.UiColor
				.createStatic(245, 130, 49, 1, "orange");
		oFF.UiColor.PURPLE = oFF.UiColor
				.createStatic(145, 30, 180, 1, "purple");
		oFF.UiColor.CYAN = oFF.UiColor.createStatic(66, 212, 244, 1, "cyan");
		oFF.UiColor.MAGENTA = oFF.UiColor.createStatic(240, 50, 230, 1,
				"magenta");
		oFF.UiColor.LIME = oFF.UiColor.createStatic(191, 239, 69, 1, "lime");
		oFF.UiColor.PINK = oFF.UiColor.createStatic(250, 190, 190, 1, "pink");
		oFF.UiColor.TEAL = oFF.UiColor.createStatic(70, 153, 144, 1, "teal");
		oFF.UiColor.LAVENDER = oFF.UiColor.createStatic(230, 190, 255, 1,
				"lavender");
		oFF.UiColor.BROWN = oFF.UiColor.createStatic(154, 99, 36, 1, "brown");
		oFF.UiColor.BEIGE = oFF.UiColor.createStatic(255, 250, 200, 1, "beige");
		oFF.UiColor.MAROON = oFF.UiColor.createStatic(128, 0, 0, 1, "maroon");
		oFF.UiColor.MINT = oFF.UiColor.createStatic(170, 255, 195, 1, "mint");
		oFF.UiColor.OLIVE = oFF.UiColor.createStatic(128, 128, 0, 1, "olive");
		oFF.UiColor.APRICOT = oFF.UiColor.createStatic(255, 216, 177, 1,
				"apricot");
		oFF.UiColor.NAVY = oFF.UiColor.createStatic(0, 0, 117, 1, "navy");
		oFF.UiColor.GREY = oFF.UiColor.createStatic(169, 169, 169, 1, "grey");
		oFF.UiColor.BLACK = oFF.UiColor.createStatic(0, 0, 0, 1, "black");
		oFF.UiColor.WHITE = oFF.UiColor.createStatic(255, 255, 255, 1, "white");
	};
	oFF.UiColor.create = function(red, green, blue, alpha) {
		var rgba = new oFF.UiColor();
		rgba.setColor(red, green, blue, alpha);
		return rgba;
	};
	oFF.UiColor.createStatic = function(red, green, blue, alpha, colorName) {
		var staticColor = oFF.UiColor.create(red, green, blue, alpha);
		staticColor.lock();
		if (oFF.UiColor.s_lookup.containsKey(colorName)) {
			throw oFF.XException
					.createIllegalArgumentException(oFF.XStringUtils
							.concatenate2(
									"Color with the specified name already exists: ",
									colorName));
		}
		oFF.UiColor.s_lookup.put(colorName, staticColor);
		return staticColor;
	};
	oFF.UiColor.createByString = function(colorString) {
		var rgba = new oFF.UiColor();
		rgba.setColorByString(colorString);
		return rgba;
	};
	oFF.UiColor.lookup = function(value) {
		var valueLower = oFF.XString.toLowerCase(value);
		return oFF.UiColor.s_lookup.getByKey(valueLower);
	};
	oFF.UiColor.prototype.m_red = 0;
	oFF.UiColor.prototype.m_green = 0;
	oFF.UiColor.prototype.m_blue = 0;
	oFF.UiColor.prototype.m_alpha = 0;
	oFF.UiColor.prototype.m_isLocked = false;
	oFF.UiColor.prototype.reset = function() {
		this.setColor(0, 0, 0, 0);
	};
	oFF.UiColor.prototype.lock = function() {
		this.m_isLocked = true;
	};
	oFF.UiColor.prototype.setColor = function(red, green, blue, alpha) {
		if (this.m_isLocked) {
			throw oFF.XException
					.createIllegalStateException("Color is locked and cannot be changed");
		}
		this.m_red = red;
		this.m_green = green;
		this.m_blue = blue;
		if (alpha > 1) {
			this.m_alpha = 1;
		} else {
			this.m_alpha = alpha;
		}
	};
	oFF.UiColor.prototype.setColorByString = function(colorString) {
		var tmpColor;
		if (oFF.notNull(colorString)) {
			if (oFF.XString.startsWith(colorString, "#")) {
				this.setColorByHex(colorString);
			} else {
				if (oFF.XString.startsWith(colorString, "rgb")
						|| oFF.XString.startsWith(colorString, "rgba")) {
					this.setColorByRgb(colorString);
				} else {
					tmpColor = oFF.UiColor.lookup(colorString);
					if (oFF.notNull(tmpColor)) {
						this.setColor(tmpColor.getRed(), tmpColor.getGreen(),
								tmpColor.getBlue(), tmpColor.getAlpha());
					}
				}
			}
		}
	};
	oFF.UiColor.prototype.setAlpha = function(alpha) {
		this.m_alpha = alpha;
	};
	oFF.UiColor.prototype.setRed = function(red) {
		this.m_red = red;
	};
	oFF.UiColor.prototype.setGreen = function(green) {
		this.m_green = green;
	};
	oFF.UiColor.prototype.setBlue = function(blue) {
		this.m_blue = blue;
	};
	oFF.UiColor.prototype.getAlpha = function() {
		return this.m_alpha;
	};
	oFF.UiColor.prototype.getRed = function() {
		return this.m_red;
	};
	oFF.UiColor.prototype.getGreen = function() {
		return this.m_green;
	};
	oFF.UiColor.prototype.getBlue = function() {
		return this.m_blue;
	};
	oFF.UiColor.prototype.getHexColor = function() {
		var rStr1 = oFF.XInteger.convertToHexString(this.m_red);
		var gStr1 = oFF.XInteger.convertToHexString(this.m_green);
		var bStr1 = oFF.XInteger.convertToHexString(this.m_blue);
		return oFF.XStringUtils.concatenate4("#", rStr1, gStr1, bStr1);
	};
	oFF.UiColor.prototype.getHexColorWithAlpha = function() {
		var newAlpha = oFF.XDouble.convertToInt(this.m_alpha * 255);
		var alphaStr2 = oFF.XInteger.convertToHexString(newAlpha);
		var rStr2 = oFF.XInteger.convertToHexString(this.m_red);
		var gStr2 = oFF.XInteger.convertToHexString(this.m_green);
		var bStr2 = oFF.XInteger.convertToHexString(this.m_blue);
		return oFF.XStringUtils.concatenate5("#", alphaStr2, rStr2, gStr2,
				bStr2);
	};
	oFF.UiColor.prototype.getRgbColor = function() {
		var rStr3 = oFF.XStringUtils.concatenate2(oFF.XInteger
				.convertToString(this.m_red), ",");
		var gStr3 = oFF.XStringUtils.concatenate2(oFF.XInteger
				.convertToString(this.m_green), ",");
		var bStr3 = oFF.XInteger.convertToString(this.m_blue);
		return oFF.XStringUtils.concatenate5("rgb(", rStr3, gStr3, bStr3, ")");
	};
	oFF.UiColor.prototype.getRgbaColor = function() {
		var rStr4 = oFF.XStringUtils.concatenate2(oFF.XInteger
				.convertToString(this.m_red), ",");
		var gStr4 = oFF.XStringUtils.concatenate2(oFF.XInteger
				.convertToString(this.m_green), ",");
		var bStr4 = oFF.XStringUtils.concatenate2(oFF.XInteger
				.convertToString(this.m_blue), ",");
		var alphaStr4 = oFF.XStringUtils.concatenate2(oFF.XDouble
				.convertToString(this.m_alpha), ")");
		return oFF.XStringUtils.concatenate5("rgba(", rStr4, gStr4, bStr4,
				alphaStr4);
	};
	oFF.UiColor.prototype.setColorByHex = function(hexString) {
		var offset = 1;
		var rCol1;
		var gCol1;
		var bCol1;
		var alpha2;
		var newAlpha;
		var rCol2;
		var gCol2;
		var bCol2;
		if (oFF.XString.size(hexString) === 6 + offset) {
			rCol1 = oFF.XInteger.convertFromStringWithRadix(oFF.XString
					.substring(hexString, 0 + offset, 2 + offset), 16);
			gCol1 = oFF.XInteger.convertFromStringWithRadix(oFF.XString
					.substring(hexString, 2 + offset, 4 + offset), 16);
			bCol1 = oFF.XInteger.convertFromStringWithRadix(oFF.XString
					.substring(hexString, 4 + offset, 6 + offset), 16);
			this.setColor(rCol1, gCol1, bCol1, 1);
		} else {
			if (oFF.XString.size(hexString) === 8 + offset) {
				alpha2 = oFF.XInteger.convertFromStringWithRadix(oFF.XString
						.substring(hexString, 0 + offset, 2 + offset), 16);
				newAlpha = alpha2 / 255;
				rCol2 = oFF.XInteger.convertFromStringWithRadix(oFF.XString
						.substring(hexString, 2 + offset, 4 + offset), 16);
				gCol2 = oFF.XInteger.convertFromStringWithRadix(oFF.XString
						.substring(hexString, 4 + offset, 6 + offset), 16);
				bCol2 = oFF.XInteger.convertFromStringWithRadix(oFF.XString
						.substring(hexString, 6 + offset, 8 + offset), 16);
				this.setColor(rCol2, gCol2, bCol2, newAlpha);
			}
		}
	};
	oFF.UiColor.prototype.setColorByRgb = function(rgbString) {
		var start;
		var end;
		var newString;
		var colorList;
		if (oFF.XString.startsWith(rgbString, "rgb") === false
				&& oFF.XString.startsWith(rgbString, "rgba") === false) {
			return;
		}
		start = oFF.XString.indexOf(rgbString, "(");
		end = oFF.XString.indexOf(rgbString, ")");
		if (start !== 0 && end !== 0 && start < end) {
			newString = oFF.XString.substring(rgbString, start + 1, end);
			colorList = oFF.XStringTokenizer.splitString(newString, ",");
			if (colorList.size() === 3) {
				this.m_red = oFF.XInteger.convertFromString(colorList.get(0));
				this.m_green = oFF.XInteger.convertFromString(colorList.get(1));
				this.m_blue = oFF.XInteger.convertFromString(colorList.get(2));
				this.m_alpha = 1;
			} else {
				if (colorList.size() === 4) {
					this.m_red = oFF.XInteger.convertFromString(colorList
							.get(0));
					this.m_green = oFF.XInteger.convertFromString(colorList
							.get(1));
					this.m_blue = oFF.XInteger.convertFromString(colorList
							.get(2));
					this.m_alpha = oFF.XDouble.convertFromString(colorList
							.get(3));
					if (this.m_alpha > 1) {
						this.m_alpha = 1;
					}
				}
			}
		}
	};
	oFF.XGeometryValue = function() {
	};
	oFF.XGeometryValue.prototype = new oFF.XObject();
	oFF.XGeometryValue.createGeometryValueWithWkt = function(wkt) {
		var point = oFF.XPointValue.createWithWkt(wkt);
		var multiPoint;
		var polygon;
		var multiPolygon;
		var lineString;
		var multiLineString;
		if (oFF.notNull(point)) {
			return point;
		}
		multiPoint = oFF.XMultiPointValue.createWithWkt(wkt);
		if (oFF.notNull(multiPoint)) {
			return multiPoint;
		}
		polygon = oFF.XPolygonValue.createWithWkt(wkt);
		if (oFF.notNull(polygon)) {
			return polygon;
		}
		multiPolygon = oFF.XMultiPolygonValue.createWithWkt(wkt);
		if (oFF.notNull(multiPolygon)) {
			return multiPolygon;
		}
		lineString = oFF.XLineStringValue.createWithWkt(wkt);
		if (oFF.notNull(lineString)) {
			return lineString;
		}
		multiLineString = oFF.XMultiLineStringValue.createWithWkt(wkt);
		if (oFF.notNull(multiLineString)) {
			return multiLineString;
		}
		return null;
	};
	oFF.XmlDocumentSerializer = function() {
	};
	oFF.XmlDocumentSerializer.prototype = new oFF.XObject();
	oFF.XmlDocumentSerializer.create = function() {
		var object = new oFF.XmlDocumentSerializer();
		object.initialize(false, false, 0);
		return object;
	};
	oFF.XmlDocumentSerializer.createSort = function() {
		var object = new oFF.XmlDocumentSerializer();
		object.initialize(true, false, 0);
		return object;
	};
	oFF.XmlDocumentSerializer.createPretty = function(indentation) {
		var object = new oFF.XmlDocumentSerializer();
		object.initialize(false, true, indentation);
		return object;
	};
	oFF.XmlDocumentSerializer.createSortPretty = function(indentation) {
		var object = new oFF.XmlDocumentSerializer();
		object.initialize(true, true, indentation);
		return object;
	};
	oFF.XmlDocumentSerializer.prototype.m_prettyPrint = false;
	oFF.XmlDocumentSerializer.prototype.m_indentation = 0;
	oFF.XmlDocumentSerializer.prototype.m_sortStructureElements = false;
	oFF.XmlDocumentSerializer.prototype.m_buffer = null;
	oFF.XmlDocumentSerializer.prototype.isPrettyPrint = function() {
		return this.m_prettyPrint;
	};
	oFF.XmlDocumentSerializer.prototype.setPrettyPrint = function(prettyPrint) {
		this.m_prettyPrint = prettyPrint;
	};
	oFF.XmlDocumentSerializer.prototype.getIndentation = function() {
		return this.m_indentation;
	};
	oFF.XmlDocumentSerializer.prototype.setIndentation = function(indentation) {
		this.m_indentation = indentation;
	};
	oFF.XmlDocumentSerializer.prototype.isSortStructureElements = function() {
		return this.m_sortStructureElements;
	};
	oFF.XmlDocumentSerializer.prototype.setSortStructureElements = function(
			sortStructureElements) {
		this.m_sortStructureElements = sortStructureElements;
	};
	oFF.XmlDocumentSerializer.prototype.getBuffer = function() {
		return this.m_buffer;
	};
	oFF.XmlDocumentSerializer.prototype.setBuffer = function(buffer) {
		this.m_buffer = buffer;
	};
	oFF.XmlDocumentSerializer.prototype.initialize = function(
			sortStructureElements, prettyPrint, indentation) {
		this.setBuffer(oFF.XStringBuffer.create());
		this.setSortStructureElements(sortStructureElements);
		this.setPrettyPrint(prettyPrint);
		this.setIndentation(indentation);
	};
	oFF.XmlDocumentSerializer.prototype.serialize = function(element) {
		var structure;
		var structureElementNames;
		var structureSize;
		var structureElementName;
		var structureElement;
		this.getBuffer().clear();
		if (!element.isStructure()) {
			throw oFF.XException
					.createIllegalArgumentException("INVALID ROOT ELEMENT: Must be Structure");
		}
		structure = element.asStructure();
		structureElementNames = structure.getKeysAsReadOnlyListOfString();
		if (oFF.isNull(structureElementNames)) {
			throw oFF.XException
					.createIllegalArgumentException("INVALID ROOT ELEMENT: Must be Structure");
		}
		structureSize = structureElementNames.size();
		if (structureSize !== 1) {
			throw oFF.XException
					.createIllegalArgumentException("INVALID ROOT ELEMENT: Must be at most one root element");
		}
		structureElementName = structureElementNames.get(0);
		structureElement = structure.getByKey(structureElementName);
		if (structureElement.isStructure()) {
			this.appendStructure(structureElement, structureElementName, 0);
		} else {
			throw oFF.XException
					.createIllegalArgumentException("INVALID ROOT ELEMENT: Must be Structure");
		}
		return this.getBuffer().toString();
	};
	oFF.XmlDocumentSerializer.prototype.appendIndentationString = function(
			indentationLevel) {
		var spaces;
		var i;
		if (this.getIndentation() >= 1 && indentationLevel >= 1) {
			spaces = this.getIndentation() * indentationLevel;
			for (i = 0; i < spaces; i++) {
				this.getBuffer().append(" ");
			}
		}
	};
	oFF.XmlDocumentSerializer.prototype.appendAttribute = function(element,
			elementName) {
		this.getBuffer().append(" ");
		if (oFF.isNull(elementName)) {
			this.getBuffer().append("null");
		} else {
			this.getBuffer().append(elementName);
		}
		this.getBuffer().append('="');
		this.appendTextContent(element, oFF.XmlUtils.ATTRIBUTE_ESCAPE);
		this.getBuffer().append('"');
	};
	oFF.XmlDocumentSerializer.prototype.appendElement = function(element,
			elementName, indentationLevel) {
		if (this.isPrettyPrint()) {
			this.appendIndentationString(indentationLevel);
		}
		if (oFF.isNull(element)) {
			this.getBuffer().append("null");
		} else {
			if (element.isStructure()) {
				this.appendStructure(element, elementName, indentationLevel);
			} else {
				if (element.isList()) {
					this.appendList(element, elementName, indentationLevel);
				} else {
					if (this.isPrettyPrint()) {
						this.getBuffer().appendNewLine();
						this.appendIndentationString(indentationLevel);
					}
					this.appendTextContent(element,
							oFF.XmlUtils.TEXT_NODE_ESCAPE);
				}
			}
		}
	};
	oFF.XmlDocumentSerializer.prototype.appendStructure = function(element,
			elementName, indentationLevel) {
		var i;
		var structureElementName;
		var structureElement;
		var structure;
		var structureElementNames;
		var emptyTag;
		var structureSize;
		if (this.isPrettyPrint()) {
			this.getBuffer().appendNewLine();
			this.appendIndentationString(indentationLevel);
		}
		this.getBuffer().append("<");
		this.getBuffer().append(elementName);
		if (element.isString() || element.isDouble() || element.isBoolean()
				|| element.isNumeric()
				|| element.getType() === oFF.PrElementType.THE_NULL) {
			this.getBuffer().append(">");
			if (this.isPrettyPrint()) {
				this.getBuffer().appendNewLine();
				this.appendIndentationString(indentationLevel + 1);
			}
			this.appendTextContent(element, oFF.XmlUtils.TEXT_NODE_ESCAPE);
			if (this.isPrettyPrint()) {
				this.getBuffer().appendNewLine();
				this.appendIndentationString(indentationLevel);
			}
			this.getBuffer().append("</");
			this.getBuffer().append(elementName);
			this.getBuffer().append(">");
			return;
		}
		structure = element.asStructure();
		structureElementNames = oFF.XListOfString
				.createFromReadOnlyList(structure
						.getKeysAsReadOnlyListOfString());
		emptyTag = true;
		if (oFF.notNull(structureElementNames)) {
			structureSize = structureElementNames.size();
			if (this.isSortStructureElements() && structureSize > 1) {
				structureElementNames
						.sortByDirection(oFF.XSortDirection.ASCENDING);
			}
			for (i = 0; i < structureSize; i++) {
				structureElementName = structureElementNames.get(i);
				structureElement = structure.getByKey(structureElementName);
				if (oFF.XString.startsWith(structureElementName, "-")
						&& (structureElement.isString()
								|| structureElement.isDouble()
								|| structureElement.isBoolean()
								|| structureElement.isNumeric() || structureElement
								.getType() === oFF.PrElementType.THE_NULL)) {
					this.appendAttribute(structureElement, oFF.XString
							.substring(structureElementName, 1, oFF.XString
									.size(structureElementName)));
				} else {
					emptyTag = false;
				}
			}
			if (emptyTag) {
				this.getBuffer().append("/");
			}
			this.getBuffer().append(">");
			for (i = 0; i < structureSize; i++) {
				structureElementName = structureElementNames.get(i);
				structureElement = structure.getByKey(structureElementName);
				if (oFF.XString.startsWith(structureElementName, "-")
						&& (structureElement.isString()
								|| structureElement.isDouble()
								|| structureElement.isBoolean()
								|| structureElement.isNumeric() || structureElement
								.getType() === oFF.PrElementType.THE_NULL)) {
					continue;
				}
				this.appendElement(structureElement, structureElementName,
						indentationLevel + 1);
			}
		} else {
			this.getBuffer().append("/");
			this.getBuffer().append(">");
		}
		if (!emptyTag) {
			if (this.isPrettyPrint()) {
				this.getBuffer().appendNewLine();
				this.appendIndentationString(indentationLevel);
			}
			this.getBuffer().append("</");
			this.getBuffer().append(elementName);
			this.getBuffer().append(">");
		}
	};
	oFF.XmlDocumentSerializer.prototype.appendTextContent = function(element,
			ESCAPE_LEVEL) {
		var stringValue;
		if (element.isString()) {
			stringValue = element.asString().getString();
			if (oFF.isNull(stringValue)) {
				this.getBuffer().append("null");
			} else {
				this.getBuffer().append(
						oFF.XmlUtils.escapeXml(oFF.XmlUtils
								.unescapeJson(stringValue), ESCAPE_LEVEL));
			}
		} else {
			if (element.isDouble()) {
				this.getBuffer().appendDouble(element.asNumber().getDouble());
			} else {
				if (element.isNumeric()) {
					this.getBuffer().appendLong(element.asNumber().getLong());
				} else {
					if (element.isBoolean()) {
						if (element.asBoolean().getBoolean()) {
							this.getBuffer().append("true");
						} else {
							this.getBuffer().append("false");
						}
					} else {
						if (element.getType() === oFF.PrElementType.THE_NULL) {
							this.getBuffer().append("null");
						}
					}
				}
			}
		}
	};
	oFF.XmlDocumentSerializer.prototype.appendList = function(element,
			elementName, indentationLevel) {
		var list = element.asList();
		var size = list.size();
		var i;
		for (i = 0; i < size; i++) {
			this.appendStructure(list.get(i), elementName, indentationLevel);
		}
	};
	oFF.XmlDomPrUtil = {
		createDocument : function() {
			return oFF.PrFactory.createStructure();
		},
		appendChildElementWithTextContent : function(baseElement, elementName,
				textNodeContent) {
			var baseElementType = baseElement.getElementTypeByKey(elementName);
			var newStructure = null;
			var existingElement;
			var newList;
			if (baseElementType === oFF.PrElementType.THE_NULL) {
				newStructure = baseElement.putNewStructure(elementName);
			} else {
				if (baseElementType === oFF.PrElementType.LIST) {
					newStructure = baseElement.getListByKey(elementName)
							.addNewStructure();
				} else {
					if (baseElementType === oFF.PrElementType.STRUCTURE) {
						existingElement = baseElement
								.getStructureByKey(elementName);
						newList = baseElement.putNewList(elementName);
						newList.add(existingElement);
						newStructure = newList.addNewStructure();
					}
				}
			}
			if (oFF.isNull(newStructure)) {
				throw oFF.XException
						.createIllegalStateException("Cannot mix element children types");
			} else {
				if (oFF.notNull(textNodeContent)) {
					newStructure.putString(elementName, textNodeContent);
				}
			}
			return newStructure;
		},
		appendChildElement : function(baseElement, elementName) {
			return oFF.XmlDomPrUtil.appendChildElementWithTextContent(
					baseElement, elementName, null);
		},
		setAttribute : function(baseElement, attributeName, attributeValue) {
			baseElement.putString(oFF.XStringUtils.concatenate2("-",
					attributeName), attributeValue);
			return baseElement;
		},
		getAttribute : function(baseElement, attributeName) {
			return baseElement.getStringByKey(oFF.XStringUtils.concatenate2(
					"-", attributeName));
		}
	};
	oFF.XmlUtils = {
		QUOT_CHAR : '"',
		AMP_CHAR : "&",
		APOS_CHAR : "'",
		LT_CHAR : "<",
		GT_CHAR : ">",
		QUOT_ENTITY : "&quot;",
		AMP_ENTITY : "&amp;",
		APOS_ENTITY : "&apos;",
		LT_ENTITY : "&lt;",
		GT_ENTITY : "&gt;",
		entityMappings : null,
		extendedEntityMappings : null,
		MUST_NOT_ESCAPE : 0,
		TEXT_NODE_ESCAPE : 1,
		ATTRIBUTE_ESCAPE : 2,
		FULL_ESCAPE : 3,
		staticSetup : function() {
			oFF.XmlUtils.entityMappings = oFF.XHashMapOfStringByString.create();
			oFF.XmlUtils.extendedEntityMappings = oFF.XHashMapOfStringByString
					.create();
			oFF.XmlUtils.entityMappings.put("&quot;", '"');
			oFF.XmlUtils.entityMappings.put("&apos;", "'");
			oFF.XmlUtils.entityMappings.put("&amp;", "&");
			oFF.XmlUtils.entityMappings.put("&lt;", "<");
			oFF.XmlUtils.entityMappings.put("&gt;", ">");
			oFF.XmlUtils.extendedEntityMappings.put("&Acirc;", "\u00C2");
			oFF.XmlUtils.extendedEntityMappings.put("&acirc;", "\u00E2");
			oFF.XmlUtils.extendedEntityMappings.put("&acute;", "\u00B4");
			oFF.XmlUtils.extendedEntityMappings.put("&AElig;", "\u00C6");
			oFF.XmlUtils.extendedEntityMappings.put("&aelig;", "\u00E6");
			oFF.XmlUtils.extendedEntityMappings.put("&Agrave;", "\u00C0");
			oFF.XmlUtils.extendedEntityMappings.put("&agrave;", "\u00E0");
			oFF.XmlUtils.extendedEntityMappings.put("&alefsym;", "\u2135");
			oFF.XmlUtils.extendedEntityMappings.put("&Alpha;", "\u0391");
			oFF.XmlUtils.extendedEntityMappings.put("&alpha;", "\u03B1");
			oFF.XmlUtils.extendedEntityMappings.put("&amp;", "&");
			oFF.XmlUtils.extendedEntityMappings.put("&and;", "\u2227");
			oFF.XmlUtils.extendedEntityMappings.put("&ang;", "\u2220");
			oFF.XmlUtils.extendedEntityMappings.put("&apos;", "'");
			oFF.XmlUtils.extendedEntityMappings.put("&Aring;", "\u00C5");
			oFF.XmlUtils.extendedEntityMappings.put("&aring;", "\u00E5");
			oFF.XmlUtils.extendedEntityMappings.put("&asymp;", "\u2248");
			oFF.XmlUtils.extendedEntityMappings.put("&Atilde;", "\u00C3");
			oFF.XmlUtils.extendedEntityMappings.put("&atilde;", "\u00E3");
			oFF.XmlUtils.extendedEntityMappings.put("&Auml;", "\u00C4");
			oFF.XmlUtils.extendedEntityMappings.put("&auml;", "\u00E4");
			oFF.XmlUtils.extendedEntityMappings.put("&bdquo;", "\u201E");
			oFF.XmlUtils.extendedEntityMappings.put("&Beta;", "\u0392");
			oFF.XmlUtils.extendedEntityMappings.put("&beta;", "\u03B2");
			oFF.XmlUtils.extendedEntityMappings.put("&brvbar;", "\u00A6");
			oFF.XmlUtils.extendedEntityMappings.put("&bull;", "\u2022");
			oFF.XmlUtils.extendedEntityMappings.put("&cap;", "\u2229");
			oFF.XmlUtils.extendedEntityMappings.put("&Ccedil;", "\u00C7");
			oFF.XmlUtils.extendedEntityMappings.put("&ccedil;", "\u00E7");
			oFF.XmlUtils.extendedEntityMappings.put("&cedil;", "\u00B8");
			oFF.XmlUtils.extendedEntityMappings.put("&cent;", "\u00A2");
			oFF.XmlUtils.extendedEntityMappings.put("&Chi;", "\u03A7");
			oFF.XmlUtils.extendedEntityMappings.put("&chi;", "\u03C7");
			oFF.XmlUtils.extendedEntityMappings.put("&circ;", "\u02C6");
			oFF.XmlUtils.extendedEntityMappings.put("&clubs;", "\u2663");
			oFF.XmlUtils.extendedEntityMappings.put("&cong;", "\u2245");
			oFF.XmlUtils.extendedEntityMappings.put("&copy;", "\u00A9");
			oFF.XmlUtils.extendedEntityMappings.put("&crarr;", "\u21B5");
			oFF.XmlUtils.extendedEntityMappings.put("&cup;", "\u222A");
			oFF.XmlUtils.extendedEntityMappings.put("&curren;", "\u00A4");
			oFF.XmlUtils.extendedEntityMappings.put("&Dagger;", "\u2021");
			oFF.XmlUtils.extendedEntityMappings.put("&dagger;", "\u2020");
			oFF.XmlUtils.extendedEntityMappings.put("&dArr;", "\u21D3");
			oFF.XmlUtils.extendedEntityMappings.put("&darr;", "\u2193");
			oFF.XmlUtils.extendedEntityMappings.put("&deg;", "\u00B0");
			oFF.XmlUtils.extendedEntityMappings.put("&Delta;", "\u0394");
			oFF.XmlUtils.extendedEntityMappings.put("&delta;", "\u03B4");
			oFF.XmlUtils.extendedEntityMappings.put("&diams;", "\u2666");
			oFF.XmlUtils.extendedEntityMappings.put("&divide;", "\u00F7");
			oFF.XmlUtils.extendedEntityMappings.put("&Eacute;", "\u00C9");
			oFF.XmlUtils.extendedEntityMappings.put("&eacute;", "\u00E9");
			oFF.XmlUtils.extendedEntityMappings.put("&Ecirc;", "\u00CA");
			oFF.XmlUtils.extendedEntityMappings.put("&ecirc;", "\u00EA");
			oFF.XmlUtils.extendedEntityMappings.put("&Egrave;", "\u00C8");
			oFF.XmlUtils.extendedEntityMappings.put("&egrave;", "\u00E8");
			oFF.XmlUtils.extendedEntityMappings.put("&empty;", "\u2205");
			oFF.XmlUtils.extendedEntityMappings.put("&emsp;", "\u2003");
			oFF.XmlUtils.extendedEntityMappings.put("&ensp;", "\u2002");
			oFF.XmlUtils.extendedEntityMappings.put("&Epsilon;", "\u0395");
			oFF.XmlUtils.extendedEntityMappings.put("&epsilon;", "\u03B5");
			oFF.XmlUtils.extendedEntityMappings.put("&equiv;", "\u2261");
			oFF.XmlUtils.extendedEntityMappings.put("&Eta;", "\u0397");
			oFF.XmlUtils.extendedEntityMappings.put("&eta;", "\u03B7");
			oFF.XmlUtils.extendedEntityMappings.put("&ETH;", "\u00D0");
			oFF.XmlUtils.extendedEntityMappings.put("&eth;", "\u00F0");
			oFF.XmlUtils.extendedEntityMappings.put("&Euml;", "\u00CB");
			oFF.XmlUtils.extendedEntityMappings.put("&euml;", "\u00EB");
			oFF.XmlUtils.extendedEntityMappings.put("&euro;", "\u20AC");
			oFF.XmlUtils.extendedEntityMappings.put("&exist;", "\u2203");
			oFF.XmlUtils.extendedEntityMappings.put("&fnof;", "\u0192");
			oFF.XmlUtils.extendedEntityMappings.put("&forall;", "\u2200");
			oFF.XmlUtils.extendedEntityMappings.put("&frac12;", "\u00BD");
			oFF.XmlUtils.extendedEntityMappings.put("&frac14;", "\u00BC");
			oFF.XmlUtils.extendedEntityMappings.put("&frac34;", "\u00BE");
			oFF.XmlUtils.extendedEntityMappings.put("&frasl;", "\u2044");
			oFF.XmlUtils.extendedEntityMappings.put("&Gamma;", "\u0393");
			oFF.XmlUtils.extendedEntityMappings.put("&gamma;", "\u03B3");
			oFF.XmlUtils.extendedEntityMappings.put("&ge;", "\u2265");
			oFF.XmlUtils.extendedEntityMappings.put("&gt;", ">");
			oFF.XmlUtils.extendedEntityMappings.put("&hArr;", "\u21D4");
			oFF.XmlUtils.extendedEntityMappings.put("&harr;", "\u2194");
			oFF.XmlUtils.extendedEntityMappings.put("&hearts;", "\u2665");
			oFF.XmlUtils.extendedEntityMappings.put("&hellip;", "\u2026");
			oFF.XmlUtils.extendedEntityMappings.put("&Iacute;", "\u00CD");
			oFF.XmlUtils.extendedEntityMappings.put("&iacute;", "\u00ED");
			oFF.XmlUtils.extendedEntityMappings.put("&Icirc;", "\u00CE");
			oFF.XmlUtils.extendedEntityMappings.put("&icirc;", "\u00EE");
			oFF.XmlUtils.extendedEntityMappings.put("&iexcl;", "\u00A1");
			oFF.XmlUtils.extendedEntityMappings.put("&Igrave;", "\u00CC");
			oFF.XmlUtils.extendedEntityMappings.put("&igrave;", "\u00EC");
			oFF.XmlUtils.extendedEntityMappings.put("&image;", "\u2111");
			oFF.XmlUtils.extendedEntityMappings.put("&infin;", "\u221E");
			oFF.XmlUtils.extendedEntityMappings.put("&int;", "\u222B");
			oFF.XmlUtils.extendedEntityMappings.put("&Iota;", "\u0399");
			oFF.XmlUtils.extendedEntityMappings.put("&iota;", "\u03B9");
			oFF.XmlUtils.extendedEntityMappings.put("&iquest;", "\u00BF");
			oFF.XmlUtils.extendedEntityMappings.put("&isin;", "\u2208");
			oFF.XmlUtils.extendedEntityMappings.put("&Iuml;", "\u00CF");
			oFF.XmlUtils.extendedEntityMappings.put("&iuml;", "\u00EF");
			oFF.XmlUtils.extendedEntityMappings.put("&Kappa;", "\u039A");
			oFF.XmlUtils.extendedEntityMappings.put("&kappa;", "\u03BA");
			oFF.XmlUtils.extendedEntityMappings.put("&Lambda;", "\u039B");
			oFF.XmlUtils.extendedEntityMappings.put("&lambda;", "\u03BB");
			oFF.XmlUtils.extendedEntityMappings.put("&lang;", "\u27E8");
			oFF.XmlUtils.extendedEntityMappings.put("&laquo;", "\u00AB");
			oFF.XmlUtils.extendedEntityMappings.put("&lArr;", "\u21D0");
			oFF.XmlUtils.extendedEntityMappings.put("&larr;", "\u2190");
			oFF.XmlUtils.extendedEntityMappings.put("&lceil;", "\u2308");
			oFF.XmlUtils.extendedEntityMappings.put("&ldquo;", "\u201C");
			oFF.XmlUtils.extendedEntityMappings.put("&le;", "\u2264");
			oFF.XmlUtils.extendedEntityMappings.put("&lfloor;", "\u230A");
			oFF.XmlUtils.extendedEntityMappings.put("&lowast;", "\u2217");
			oFF.XmlUtils.extendedEntityMappings.put("&loz;", "\u25CA");
			oFF.XmlUtils.extendedEntityMappings.put("&lsaquo;", "\u2039");
			oFF.XmlUtils.extendedEntityMappings.put("&lsquo;", "\u2018");
			oFF.XmlUtils.extendedEntityMappings.put("&lt;", "<");
			oFF.XmlUtils.extendedEntityMappings.put("&macr;", "\u00AF");
			oFF.XmlUtils.extendedEntityMappings.put("&mdash;", "\u2014");
			oFF.XmlUtils.extendedEntityMappings.put("&micro;", "\u00B5");
			oFF.XmlUtils.extendedEntityMappings.put("&middot;", "\u00B7");
			oFF.XmlUtils.extendedEntityMappings.put("&minus;", "\u2212");
			oFF.XmlUtils.extendedEntityMappings.put("&Mu;", "\u039C");
			oFF.XmlUtils.extendedEntityMappings.put("&mu;", "\u03BC");
			oFF.XmlUtils.extendedEntityMappings.put("&nabla;", "\u2207");
			oFF.XmlUtils.extendedEntityMappings.put("&nbsp;", " ");
			oFF.XmlUtils.extendedEntityMappings.put("&ndash;", "\u2013");
			oFF.XmlUtils.extendedEntityMappings.put("&ne;", "\u2260");
			oFF.XmlUtils.extendedEntityMappings.put("&ni;", "\u220B");
			oFF.XmlUtils.extendedEntityMappings.put("&not;", "\u00AC");
			oFF.XmlUtils.extendedEntityMappings.put("&notin;", "\u2209");
			oFF.XmlUtils.extendedEntityMappings.put("&nsub;", "\u2284");
			oFF.XmlUtils.extendedEntityMappings.put("&Ntilde;", "\u00D1");
			oFF.XmlUtils.extendedEntityMappings.put("&ntilde;", "\u00F1");
			oFF.XmlUtils.extendedEntityMappings.put("&Nu;", "\u039D");
			oFF.XmlUtils.extendedEntityMappings.put("&nu;", "\u03BD");
			oFF.XmlUtils.extendedEntityMappings.put("&Oacute;", "\u00D3");
			oFF.XmlUtils.extendedEntityMappings.put("&oacute;", "\u00F3");
			oFF.XmlUtils.extendedEntityMappings.put("&Ocirc;", "\u00D4");
			oFF.XmlUtils.extendedEntityMappings.put("&ocirc;", "\u00F4");
			oFF.XmlUtils.extendedEntityMappings.put("&OElig;", "\u0152");
			oFF.XmlUtils.extendedEntityMappings.put("&oelig;", "\u0153");
			oFF.XmlUtils.extendedEntityMappings.put("&Ograve;", "\u00D2");
			oFF.XmlUtils.extendedEntityMappings.put("&ograve;", "\u00F2");
			oFF.XmlUtils.extendedEntityMappings.put("&oline;", "\u203E");
			oFF.XmlUtils.extendedEntityMappings.put("&Omega;", "\u03A9");
			oFF.XmlUtils.extendedEntityMappings.put("&omega;", "\u03C9");
			oFF.XmlUtils.extendedEntityMappings.put("&Omicron;", "\u039F");
			oFF.XmlUtils.extendedEntityMappings.put("&omicron;", "\u03BF");
			oFF.XmlUtils.extendedEntityMappings.put("&oplus;", "\u2295");
			oFF.XmlUtils.extendedEntityMappings.put("&or;", "\u2228");
			oFF.XmlUtils.extendedEntityMappings.put("&ordf;", "\u00AA");
			oFF.XmlUtils.extendedEntityMappings.put("&ordm;", "\u00BA");
			oFF.XmlUtils.extendedEntityMappings.put("&Oslash;", "\u00D8");
			oFF.XmlUtils.extendedEntityMappings.put("&oslash;", "\u00F8");
			oFF.XmlUtils.extendedEntityMappings.put("&Otilde;", "\u00D5");
			oFF.XmlUtils.extendedEntityMappings.put("&otilde;", "\u00F5");
			oFF.XmlUtils.extendedEntityMappings.put("&otimes;", "\u2297");
			oFF.XmlUtils.extendedEntityMappings.put("&Ouml;", "\u00D6");
			oFF.XmlUtils.extendedEntityMappings.put("&ouml;", "\u00F6");
			oFF.XmlUtils.extendedEntityMappings.put("&para;", "\u00B6");
			oFF.XmlUtils.extendedEntityMappings.put("&part;", "\u2202");
			oFF.XmlUtils.extendedEntityMappings.put("&permil;", "\u2030");
			oFF.XmlUtils.extendedEntityMappings.put("&perp;", "\u22A5");
			oFF.XmlUtils.extendedEntityMappings.put("&Phi;", "\u03A6");
			oFF.XmlUtils.extendedEntityMappings.put("&phi;", "\u03C6");
			oFF.XmlUtils.extendedEntityMappings.put("&Pi;", "\u03A0");
			oFF.XmlUtils.extendedEntityMappings.put("&pi;", "\u03C0");
			oFF.XmlUtils.extendedEntityMappings.put("&piv;", "\u03D6");
			oFF.XmlUtils.extendedEntityMappings.put("&plusmn;", "\u00B1");
			oFF.XmlUtils.extendedEntityMappings.put("&pound;", "\u00A3");
			oFF.XmlUtils.extendedEntityMappings.put("&Prime;", "\u2033");
			oFF.XmlUtils.extendedEntityMappings.put("&prime;", "\u2032");
			oFF.XmlUtils.extendedEntityMappings.put("&prod;", "\u220F");
			oFF.XmlUtils.extendedEntityMappings.put("&prop;", "\u221D");
			oFF.XmlUtils.extendedEntityMappings.put("&Psi;", "\u03A8");
			oFF.XmlUtils.extendedEntityMappings.put("&psi;", "\u03C8");
			oFF.XmlUtils.extendedEntityMappings.put("&quot;", '"');
			oFF.XmlUtils.extendedEntityMappings.put("&radic;", "\u221A");
			oFF.XmlUtils.extendedEntityMappings.put("&rang;", "\u27E9");
			oFF.XmlUtils.extendedEntityMappings.put("&raquo;", "\u00BB");
			oFF.XmlUtils.extendedEntityMappings.put("&rArr;", "\u21D2");
			oFF.XmlUtils.extendedEntityMappings.put("&rarr;", "\u2192");
			oFF.XmlUtils.extendedEntityMappings.put("&rceil;", "\u2309");
			oFF.XmlUtils.extendedEntityMappings.put("&rdquo;", "\u201D");
			oFF.XmlUtils.extendedEntityMappings.put("&real;", "\u211C");
			oFF.XmlUtils.extendedEntityMappings.put("&reg;", "\u00AE");
			oFF.XmlUtils.extendedEntityMappings.put("&rfloor;", "\u230B");
			oFF.XmlUtils.extendedEntityMappings.put("&Rho;", "\u03A1");
			oFF.XmlUtils.extendedEntityMappings.put("&rho;", "\u03C1");
			oFF.XmlUtils.extendedEntityMappings.put("&rsaquo;", "\u203A");
			oFF.XmlUtils.extendedEntityMappings.put("&rsquo;", "\u2019");
			oFF.XmlUtils.extendedEntityMappings.put("&sbquo;", "\u201A");
			oFF.XmlUtils.extendedEntityMappings.put("&Scaron;", "\u0160");
			oFF.XmlUtils.extendedEntityMappings.put("&scaron;", "\u0161");
			oFF.XmlUtils.extendedEntityMappings.put("&sdot;", "\u22C5");
			oFF.XmlUtils.extendedEntityMappings.put("&sect;", "\u00A7");
			oFF.XmlUtils.extendedEntityMappings.put("&Sigma;", "\u03A3");
			oFF.XmlUtils.extendedEntityMappings.put("&sigma;", "\u03C3");
			oFF.XmlUtils.extendedEntityMappings.put("&sigmaf;", "\u03C2");
			oFF.XmlUtils.extendedEntityMappings.put("&sim;", "\u223C");
			oFF.XmlUtils.extendedEntityMappings.put("&spades;", "\u2660");
			oFF.XmlUtils.extendedEntityMappings.put("&sub;", "\u2282");
			oFF.XmlUtils.extendedEntityMappings.put("&sube;", "\u2286");
			oFF.XmlUtils.extendedEntityMappings.put("&sum;", "\u2211");
			oFF.XmlUtils.extendedEntityMappings.put("&sup;", "\u2283");
			oFF.XmlUtils.extendedEntityMappings.put("&sup1;", "\u00B9");
			oFF.XmlUtils.extendedEntityMappings.put("&sup2;", "\u00B2");
			oFF.XmlUtils.extendedEntityMappings.put("&sup3;", "\u00B3");
			oFF.XmlUtils.extendedEntityMappings.put("&supe;", "\u2287");
			oFF.XmlUtils.extendedEntityMappings.put("&szlig;", "\u00DF");
			oFF.XmlUtils.extendedEntityMappings.put("&Tau;", "\u03A4");
			oFF.XmlUtils.extendedEntityMappings.put("&tau;", "\u03C4");
			oFF.XmlUtils.extendedEntityMappings.put("&there4;", "\u2234");
			oFF.XmlUtils.extendedEntityMappings.put("&Theta;", "\u0398");
			oFF.XmlUtils.extendedEntityMappings.put("&theta;", "\u03B8");
			oFF.XmlUtils.extendedEntityMappings.put("&thetasym;", "\u03D1");
			oFF.XmlUtils.extendedEntityMappings.put("&thinsp;", "\u2009");
			oFF.XmlUtils.extendedEntityMappings.put("&THORN;", "\u00DE");
			oFF.XmlUtils.extendedEntityMappings.put("&thorn;", "\u00FE");
			oFF.XmlUtils.extendedEntityMappings.put("&tilde;", "\u02DC");
			oFF.XmlUtils.extendedEntityMappings.put("&times;", "\u00D7");
			oFF.XmlUtils.extendedEntityMappings.put("&trade;", "\u2122");
			oFF.XmlUtils.extendedEntityMappings.put("&Uacute;", "\u00DA");
			oFF.XmlUtils.extendedEntityMappings.put("&uacute;", "\u00FA");
			oFF.XmlUtils.extendedEntityMappings.put("&uArr;", "\u21D1");
			oFF.XmlUtils.extendedEntityMappings.put("&uarr;", "\u2191");
			oFF.XmlUtils.extendedEntityMappings.put("&Ucirc;", "\u00DB");
			oFF.XmlUtils.extendedEntityMappings.put("&ucirc;", "\u00FB");
			oFF.XmlUtils.extendedEntityMappings.put("&Ugrave;", "\u00D9");
			oFF.XmlUtils.extendedEntityMappings.put("&ugrave;", "\u00F9");
			oFF.XmlUtils.extendedEntityMappings.put("&uml;", "\u00A8");
			oFF.XmlUtils.extendedEntityMappings.put("&upsih;", "\u03D2");
			oFF.XmlUtils.extendedEntityMappings.put("&Upsilon;", "\u03A5");
			oFF.XmlUtils.extendedEntityMappings.put("&upsilon;", "\u03C5");
			oFF.XmlUtils.extendedEntityMappings.put("&Uuml;", "\u00DC");
			oFF.XmlUtils.extendedEntityMappings.put("&uuml;", "\u00FC");
			oFF.XmlUtils.extendedEntityMappings.put("&weierp;", "\u2118");
			oFF.XmlUtils.extendedEntityMappings.put("&Xi;", "\u039E");
			oFF.XmlUtils.extendedEntityMappings.put("&xi;", "\u03BE");
			oFF.XmlUtils.extendedEntityMappings.put("&Yacute;", "\u00DD");
			oFF.XmlUtils.extendedEntityMappings.put("&yacute;", "\u00FD");
			oFF.XmlUtils.extendedEntityMappings.put("&yen;", "\u00A5");
			oFF.XmlUtils.extendedEntityMappings.put("&Yuml;", "\u0178");
			oFF.XmlUtils.extendedEntityMappings.put("&yuml;", "\u00FF");
			oFF.XmlUtils.extendedEntityMappings.put("&Zeta;", "\u0396");
			oFF.XmlUtils.extendedEntityMappings.put("&zeta;", "\u03B6");
		},
		unescapeJson : function(string) {
			var buffer;
			if (oFF.isNull(string)) {
				return null;
			}
			buffer = oFF.XStringBuffer.create();
			oFF.XmlUtils.unescapeJsonToBuffer(string, buffer);
			return buffer.toString();
		},
		unescapeJsonToBuffer : function(string, buffer) {
			var startOfUnescaped;
			var escaper;
			if (oFF.isNull(string)) {
				return;
			}
			startOfUnescaped = 0;
			escaper = oFF.XString.indexOf(string, "\\");
			while (escaper > -1) {
				buffer.append(oFF.XString.substring(string, startOfUnescaped,
						escaper));
				if (escaper >= oFF.XString.size(string) - 1) {
					buffer.append("\\");
					return;
				}
				startOfUnescaped = escaper + 2;
				switch (oFF.XString.getCharAt(string, escaper + 1)) {
				case (110):
					buffer.append("\n");
					break;
				case (114):
					buffer.append("\r");
					break;
				case (116):
					buffer.append("\t");
					break;
				case (98):
					buffer.append("\b");
					break;
				case (102):
					buffer.append("\f");
					break;
				case (47):
					buffer.append("/");
					break;
				case (92):
					buffer.append("\\");
					break;
				case (34):
					buffer.append('"');
					break;
				default:
					buffer.append(oFF.XString.substring(string, escaper,
							escaper + 2));
				}
				if (startOfUnescaped >= oFF.XString.size(string)) {
					return;
				}
				escaper = oFF.XString.indexOfFrom(string, "\\",
						startOfUnescaped);
			}
			if (escaper === -1) {
				buffer.append(oFF.XString.substring(string, startOfUnescaped,
						oFF.XString.size(string)));
			} else {
				buffer.append(oFF.XString.substring(string, startOfUnescaped,
						escaper));
			}
		},
		escapeXml : function(string, ESCAPE_LEVEL) {
			if (oFF.isNull(string)) {
				return null;
			}
			switch (ESCAPE_LEVEL) {
			case (oFF.XmlUtils.MUST_NOT_ESCAPE):
				return string;
			case (oFF.XmlUtils.TEXT_NODE_ESCAPE):
				return oFF.XmlUtils.escapeXmlTextNodeLazy(string);
			case (oFF.XmlUtils.ATTRIBUTE_ESCAPE):
				return oFF.XmlUtils.escapeXmlAttributeLazy(string);
			default:
				return oFF.XmlUtils.escapeXmlString(string);
			}
		},
		escapeXmlString : function(string) {
			var result;
			if (oFF.isNull(string)) {
				return null;
			}
			result = oFF.XString.containsString(string, oFF.XmlUtils.AMP_CHAR) ? oFF.XString
					.replace(string, oFF.XmlUtils.AMP_CHAR,
							oFF.XmlUtils.AMP_ENTITY)
					: string;
			result = oFF.XString.containsString(result, oFF.XmlUtils.QUOT_CHAR) ? oFF.XString
					.replace(result, oFF.XmlUtils.QUOT_CHAR,
							oFF.XmlUtils.QUOT_ENTITY)
					: result;
			result = oFF.XString.containsString(result, oFF.XmlUtils.APOS_CHAR) ? oFF.XString
					.replace(result, oFF.XmlUtils.APOS_CHAR,
							oFF.XmlUtils.APOS_ENTITY)
					: result;
			result = oFF.XString.containsString(result, oFF.XmlUtils.LT_CHAR) ? oFF.XString
					.replace(result, oFF.XmlUtils.LT_CHAR,
							oFF.XmlUtils.LT_ENTITY)
					: result;
			return oFF.XString.containsString(result, oFF.XmlUtils.GT_CHAR) ? oFF.XString
					.replace(result, oFF.XmlUtils.GT_CHAR,
							oFF.XmlUtils.GT_ENTITY)
					: result;
		},
		escapeXmlAttributeLazy : function(string) {
			var result;
			if (oFF.isNull(string)) {
				return null;
			}
			result = oFF.XString.containsString(string, oFF.XmlUtils.AMP_CHAR) ? oFF.XString
					.replace(string, oFF.XmlUtils.AMP_CHAR,
							oFF.XmlUtils.AMP_ENTITY)
					: string;
			result = oFF.XString.containsString(result, oFF.XmlUtils.QUOT_CHAR) ? oFF.XString
					.replace(result, oFF.XmlUtils.QUOT_CHAR,
							oFF.XmlUtils.QUOT_ENTITY)
					: result;
			return oFF.XString.containsString(result, oFF.XmlUtils.LT_CHAR) ? oFF.XString
					.replace(result, oFF.XmlUtils.LT_CHAR,
							oFF.XmlUtils.LT_ENTITY)
					: result;
		},
		escapeXmlTextNodeLazy : function(string) {
			var result;
			if (oFF.isNull(string)) {
				return null;
			}
			result = oFF.XString.containsString(string, oFF.XmlUtils.AMP_CHAR) ? oFF.XString
					.replace(string, oFF.XmlUtils.AMP_CHAR,
							oFF.XmlUtils.AMP_ENTITY)
					: string;
			return oFF.XString.containsString(result, oFF.XmlUtils.LT_CHAR) ? oFF.XString
					.replace(result, oFF.XmlUtils.LT_CHAR,
							oFF.XmlUtils.LT_ENTITY)
					: result;
		},
		unescapeRawXmlString : function(string, extended) {
			var buffer;
			if (oFF.isNull(string)) {
				return null;
			}
			buffer = oFF.XStringBuffer.create();
			oFF.XmlUtils.unescapeRawXmlStringToBuffer(string, buffer, extended);
			return buffer.toString();
		},
		unescapeRawXmlStringToBuffer : function(string, buffer, extended) {
			var entityStartIndex;
			var entityEndIndex;
			var entityMatched;
			var entityDefinition;
			if (oFF.isNull(string)) {
				return;
			}
			entityStartIndex = oFF.XString.indexOf(string, "&");
			if (entityStartIndex > -1) {
				buffer.append(oFF.XString
						.substring(string, 0, entityStartIndex));
			} else {
				buffer.append(string);
				return;
			}
			while (entityStartIndex > -1) {
				entityEndIndex = oFF.XString.indexOfFrom(string, ";",
						entityStartIndex + 1);
				entityMatched = false;
				if (entityEndIndex > entityStartIndex + 1) {
					entityDefinition = oFF.XString.substring(string,
							entityStartIndex, entityEndIndex + 1);
					entityMatched = true;
					if (extended
							&& oFF.XmlUtils.extendedEntityMappings
									.containsKey(entityDefinition)) {
						buffer.append(oFF.XmlUtils.extendedEntityMappings
								.getByKey(entityDefinition));
					} else {
						if (!extended
								&& oFF.XmlUtils.entityMappings
										.containsKey(entityDefinition)) {
							buffer.append(oFF.XmlUtils.entityMappings
									.getByKey(entityDefinition));
						} else {
							if (oFF.XString.startsWith(entityDefinition, "&#x")) {
								try {
									buffer
											.appendChar(oFF.XInteger
													.convertFromStringWithRadix(
															oFF.XString
																	.substring(
																			entityDefinition,
																			3,
																			oFF.XString
																					.size(entityDefinition) - 1),
															16));
									entityMatched = true;
								} catch (t) {
									entityMatched = false;
								}
							} else {
								if (oFF.XString.startsWith(entityDefinition,
										"&#")) {
									try {
										buffer
												.appendChar(oFF.XInteger
														.convertFromStringWithRadix(
																oFF.XString
																		.substring(
																				entityDefinition,
																				2,
																				oFF.XString
																						.size(entityDefinition) - 1),
																10));
										entityMatched = true;
									} catch (t) {
										entityMatched = false;
									}
								} else {
									entityMatched = false;
								}
							}
						}
					}
				} else {
					buffer.append(oFF.XString.substring(string,
							entityStartIndex, oFF.XString.size(string)));
					break;
				}
				if (!entityMatched) {
					buffer.append("&");
					entityEndIndex = entityStartIndex;
				}
				if (entityEndIndex >= oFF.XString.size(string)) {
					break;
				}
				entityStartIndex = oFF.XString.indexOfFrom(string, "&",
						entityEndIndex + 1);
				if (entityStartIndex === -1) {
					buffer.append(oFF.XString.substring(string,
							entityEndIndex + 1, oFF.XString.size(string)));
					break;
				}
				buffer.append(oFF.XString.substring(string, entityEndIndex + 1,
						entityStartIndex));
			}
		}
	};
	oFF.XAbstractList = function() {
	};
	oFF.XAbstractList.prototype = new oFF.XObject();
	oFF.XAbstractList.prototype.m_list = null;
	oFF.XAbstractList.prototype.releaseObject = function() {
		this.m_list = oFF.XObjectExt.release(this.m_list);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XAbstractList.prototype.isEmpty = function() {
		return this.m_list.isEmpty();
	};
	oFF.XAbstractList.prototype.hasElements = function() {
		return this.m_list.hasElements();
	};
	oFF.XAbstractList.prototype.size = function() {
		return this.m_list.size();
	};
	oFF.XAbstractList.prototype.clear = function() {
		this.m_list.clear();
	};
	oFF.XAbstractList.prototype.toString = function() {
		return this.m_list.toString();
	};
	oFF.JsonParserFactory = function() {
	};
	oFF.JsonParserFactory.prototype = new oFF.XObject();
	oFF.JsonParserFactory.s_jsonParserFactoryNative = null;
	oFF.JsonParserFactory.s_jsonParserFactoryGeneric = null;
	oFF.JsonParserFactory.staticSetupJsonParserFactory = function() {
	};
	oFF.JsonParserFactory.newInstance = function() {
		if (oFF.notNull(oFF.JsonParserFactory.s_jsonParserFactoryNative)) {
			return oFF.JsonParserFactory.s_jsonParserFactoryNative
					.newParserInstance();
		} else {
			if (oFF.notNull(oFF.JsonParserFactory.s_jsonParserFactoryGeneric)) {
				return oFF.JsonParserFactory.s_jsonParserFactoryGeneric
						.newParserInstance();
			} else {
				return null;
			}
		}
	};
	oFF.JsonParserFactory.createFromString = function(simpleJson) {
		var json = oFF.XString.replace(simpleJson, "'", '"');
		var parser = oFF.JsonParserFactory.newInstance();
		var rootElement = parser.parse(json);
		if (parser.hasErrors() && oFF.isNull(rootElement)) {
			throw oFF.XException.createIllegalArgumentException(parser
					.getSummary());
		}
		oFF.XObjectExt.release(parser);
		return rootElement;
	};
	oFF.JsonParserFactory.createFromSafeString = function(simpleJson) {
		var parser = oFF.JsonParserFactory.newInstance();
		var rootElement = parser.parseUnsafe(simpleJson);
		if (parser.hasErrors() && oFF.isNull(rootElement)) {
			throw oFF.XException.createIllegalArgumentException(parser
					.getSummary());
		}
		oFF.XObjectExt.release(parser);
		return rootElement;
	};
	oFF.JsonParserFactory.setJsonParserFactory = function(jsonParserFactory) {
		oFF.JsonParserFactory.s_jsonParserFactoryNative = jsonParserFactory;
	};
	oFF.JsonParserFactory.setJsonParserFactoryGeneric = function(
			jsonParserFactory) {
		oFF.JsonParserFactory.s_jsonParserFactoryGeneric = jsonParserFactory;
	};
	oFF.PrFactory = function() {
	};
	oFF.PrFactory.prototype = new oFF.XObject();
	oFF.PrFactory.s_universalFactory = null;
	oFF.PrFactory.s_nativeFactory = null;
	oFF.PrFactory.s_activeFactory = null;
	oFF.PrFactory.createStructure = function() {
		return oFF.PrFactory.s_activeFactory.newStructure();
	};
	oFF.PrFactory.createList = function() {
		return oFF.PrFactory.s_activeFactory.newList();
	};
	oFF.PrFactory.createBoolean = function(value) {
		return oFF.PrFactory.s_activeFactory.newBoolean(value);
	};
	oFF.PrFactory.createString = function(string) {
		return oFF.PrFactory.s_activeFactory.newString(string);
	};
	oFF.PrFactory.createInteger = function(number) {
		return oFF.PrFactory.s_activeFactory.newInteger(number);
	};
	oFF.PrFactory.createLong = function(number) {
		return oFF.PrFactory.s_activeFactory.newLong(number);
	};
	oFF.PrFactory.createDouble = function(number) {
		return oFF.PrFactory.s_activeFactory.newDouble(number);
	};
	oFF.PrFactory.setNativeFactory = function(factory) {
		oFF.PrFactory.s_nativeFactory = factory;
	};
	oFF.PrFactory.getNativeParameterFactory = function() {
		return oFF.PrFactory.s_nativeFactory;
	};
	oFF.PrFactory.setUniversalFactory = function(factory) {
		oFF.PrFactory.s_universalFactory = factory;
	};
	oFF.PrFactory.getUniversalParameterFactory = function() {
		return oFF.PrFactory.s_universalFactory;
	};
	oFF.PrFactory.setActiveFactory = function(factory) {
		oFF.PrFactory.s_activeFactory = factory;
	};
	oFF.PrFactory.getActiveParameterFactory = function() {
		return oFF.PrFactory.s_activeFactory;
	};
	oFF.ProfileNode = function() {
	};
	oFF.ProfileNode.prototype = new oFF.XObject();
	oFF.ProfileNode.create = function(text, pointInTime) {
		var newObject = new oFF.ProfileNode();
		newObject.m_text = text;
		newObject.m_start = pointInTime;
		return newObject;
	};
	oFF.ProfileNode.createWithDuration = function(text, duration) {
		var newObject = new oFF.ProfileNode();
		newObject.m_text = text;
		newObject.m_duration = duration;
		return newObject;
	};
	oFF.ProfileNode.renderNode = function(buffer, node, indent, step) {
		var i;
		var text;
		var profileSteps;
		var j;
		for (i = 0; i < indent; i++) {
			buffer.append("|  ");
		}
		buffer.append("#").appendInt(step).append(": ");
		text = node.getProfileNodeText();
		if (oFF.isNull(text)) {
			buffer.append("Node");
		} else {
			buffer.append(node.getProfileNodeText());
		}
		buffer.append(" ").appendLong(node.getDuration()).append("ms");
		profileSteps = node.getProfileSteps();
		if (oFF.notNull(profileSteps)) {
			for (j = 0; j < profileSteps.size(); j++) {
				buffer.appendNewLine();
				oFF.ProfileNode.renderNode(buffer, profileSteps.get(j),
						indent + 1, j);
			}
		}
	};
	oFF.ProfileNode.prototype.m_steps = null;
	oFF.ProfileNode.prototype.m_start = 0;
	oFF.ProfileNode.prototype.m_end = 0;
	oFF.ProfileNode.prototype.m_duration = 0;
	oFF.ProfileNode.prototype.m_text = null;
	oFF.ProfileNode.prototype.m_lastOpenStep = null;
	oFF.ProfileNode.prototype.m_hasParent = false;
	oFF.ProfileNode.prototype.releaseObject = function() {
		this.m_lastOpenStep = oFF.XObjectExt.release(this.m_lastOpenStep);
		this.m_steps = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_steps);
		this.m_text = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.ProfileNode.prototype.clone = function() {
		var profileNode = oFF.ProfileNode.create(this.m_text, this.m_start);
		var i;
		profileNode.m_end = this.m_end;
		profileNode.m_duration = this.m_duration;
		profileNode.m_hasParent = this.m_hasParent;
		if (oFF.notNull(this.m_lastOpenStep)) {
			profileNode.m_lastOpenStep = this.m_lastOpenStep.clone();
		}
		if (oFF.notNull(this.m_steps)) {
			profileNode.m_steps = oFF.XList.create();
			for (i = 0; i < this.m_steps.size(); i++) {
				profileNode.m_steps.add(this.m_steps.get(i).clone());
			}
		}
		return profileNode;
	};
	oFF.ProfileNode.prototype.getProfilingStart = function() {
		return this.m_start;
	};
	oFF.ProfileNode.prototype.getProfilingEnd = function() {
		return this.m_end;
	};
	oFF.ProfileNode.prototype.setProfilingEnd = function(end) {
		this.m_end = end;
		return this.m_end;
	};
	oFF.ProfileNode.prototype.getDuration = function() {
		if (this.m_start === 0) {
			return this.m_duration;
		}
		if (this.m_end === 0) {
			return -2;
		}
		return this.m_end - this.m_start;
	};
	oFF.ProfileNode.prototype.getProfileSteps = function() {
		return this.m_steps;
	};
	oFF.ProfileNode.prototype.getProfileNodeText = function() {
		return this.m_text;
	};
	oFF.ProfileNode.prototype.renameLastProfileStep = function(text) {
		var lastNode;
		if (oFF.XCollectionUtils.hasElements(this.m_steps)) {
			lastNode = this.m_steps.get(this.m_steps.size() - 1);
			lastNode.m_text = text;
		}
	};
	oFF.ProfileNode.prototype.addProfileStep = function(text) {
		var pointInTime = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
		var newNode;
		if (oFF.isNull(this.m_steps)) {
			this.m_steps = oFF.XList.create();
			if (this.m_start === 0) {
				this.m_start = pointInTime;
			} else {
				this.m_lastOpenStep = oFF.ProfileNode.create("callWarmup",
						this.m_start);
				this.addNode(this.m_lastOpenStep);
			}
		}
		this.configureLast(pointInTime);
		newNode = oFF.ProfileNode.create(text, pointInTime);
		this.addNode(newNode);
		this.m_lastOpenStep = newNode;
	};
	oFF.ProfileNode.prototype.addProfileNode = function(node) {
		var pointInTime;
		if (!node.hasProfileParent()) {
			pointInTime = node.getProfilingStart();
			if (oFF.isNull(this.m_steps)) {
				this.m_steps = oFF.XList.create();
				if (pointInTime !== 0) {
					if (this.m_start === 0) {
						this.m_start = pointInTime;
					} else {
						this.m_lastOpenStep = oFF.ProfileNode.create(
								"callWarmup", this.m_start);
						this.addNode(this.m_lastOpenStep);
					}
				}
			}
			if (pointInTime !== 0) {
				this.configureLast(pointInTime);
			}
			this.addNode(node);
			this.m_lastOpenStep = null;
		}
	};
	oFF.ProfileNode.prototype.addNode = function(node) {
		var pn = node;
		pn.m_hasParent = true;
		this.m_steps.add(pn);
	};
	oFF.ProfileNode.prototype.endProfileStep = function() {
		var end = this.setProfilingEnd(oFF.XSystemUtils
				.getCurrentTimeInMilliseconds());
		this.configureLast(end);
	};
	oFF.ProfileNode.prototype.configureLast = function(pointInTime) {
		var size;
		var lastNode;
		var lastEnding;
		var delta;
		var deltaNode;
		if (oFF.notNull(this.m_lastOpenStep)) {
			this.m_lastOpenStep.setProfilingEnd(pointInTime);
		} else {
			if (oFF.notNull(this.m_steps)) {
				size = this.m_steps.size();
				if (size > 0) {
					lastNode = this.m_steps.get(size - 1);
					lastEnding = lastNode.getProfilingEnd();
					delta = pointInTime - lastEnding;
					if (delta > 0) {
						deltaNode = oFF.ProfileNode.create("delta", lastEnding);
						deltaNode.setProfilingEnd(pointInTime);
						this.addNode(deltaNode);
					}
				}
			}
		}
	};
	oFF.ProfileNode.prototype.detailProfileNode = function(name, detailNode,
			nameOfRest) {
		var foundNode = this.searchRecursive(name, this);
		var roundtripTime;
		var delta;
		var networkNode;
		if (oFF.notNull(foundNode)) {
			if (oFF.isNull(foundNode.m_steps)) {
				foundNode.m_steps = oFF.XList.create();
			} else {
				foundNode.m_steps.clear();
			}
			foundNode.addNode(detailNode);
			roundtripTime = foundNode.getDuration();
			delta = roundtripTime - detailNode.getDuration();
			networkNode = oFF.ProfileNode.createWithDuration(nameOfRest, delta);
			foundNode.addNode(networkNode);
		}
	};
	oFF.ProfileNode.prototype.searchRecursive = function(text, node) {
		var profileSteps = node.getProfileSteps();
		var size;
		var i;
		var foundNode;
		if (oFF.notNull(profileSteps)) {
			size = profileSteps.size();
			for (i = 0; i < size; i++) {
				foundNode = this.searchRecursive(text, profileSteps.get(i));
				if (oFF.notNull(foundNode)) {
					return foundNode;
				}
			}
		} else {
			if (oFF.XString.isEqual(text, node.getProfileNodeText())) {
				return node;
			}
		}
		return null;
	};
	oFF.ProfileNode.prototype.hasProfileParent = function() {
		return this.m_hasParent;
	};
	oFF.ProfileNode.prototype.toString = function() {
		var buffer = oFF.XStringBuffer.create();
		oFF.ProfileNode.renderNode(buffer, this, 0, 0);
		return buffer.toString();
	};
	oFF.XStringBufferExt = function() {
	};
	oFF.XStringBufferExt.prototype = new oFF.XObject();
	oFF.XStringBufferExt.create = function() {
		var buffer = new oFF.XStringBufferExt();
		buffer.setup();
		return buffer;
	};
	oFF.XStringBufferExt.prototype.m_buffer = null;
	oFF.XStringBufferExt.prototype.m_indent = 0;
	oFF.XStringBufferExt.prototype.m_indentString = null;
	oFF.XStringBufferExt.prototype.m_isNewLine = false;
	oFF.XStringBufferExt.prototype.setup = function() {
		this.m_buffer = oFF.XStringBuffer.create();
		this.m_indent = 0;
		this.m_indentString = " ";
		this.m_isNewLine = true;
	};
	oFF.XStringBufferExt.prototype.releaseObject = function() {
		this.m_buffer = oFF.XObjectExt.release(this.m_buffer);
		this.m_indentString = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XStringBufferExt.prototype.setupNewLine = function() {
		var i;
		for (i = 0; i < this.m_indent; i++) {
			this.m_buffer.append(this.m_indentString);
		}
		this.m_isNewLine = false;
	};
	oFF.XStringBufferExt.prototype.appendLine = function(value) {
		this.append(value);
		this.appendNewLine();
		return this;
	};
	oFF.XStringBufferExt.prototype.append = function(value) {
		if (this.m_isNewLine) {
			this.setupNewLine();
		}
		this.m_buffer.append(value);
		return this;
	};
	oFF.XStringBufferExt.prototype.appendChar = function(value) {
		if (this.m_isNewLine) {
			this.setupNewLine();
		}
		this.m_buffer.appendChar(value);
		return this;
	};
	oFF.XStringBufferExt.prototype.appendBoolean = function(value) {
		if (this.m_isNewLine) {
			this.setupNewLine();
		}
		this.m_buffer.appendBoolean(value);
		return this;
	};
	oFF.XStringBufferExt.prototype.appendInt = function(value) {
		if (this.m_isNewLine) {
			this.setupNewLine();
		}
		this.m_buffer.appendInt(value);
		return this;
	};
	oFF.XStringBufferExt.prototype.appendLong = function(value) {
		if (this.m_isNewLine) {
			this.setupNewLine();
		}
		this.m_buffer.appendLong(value);
		return this;
	};
	oFF.XStringBufferExt.prototype.appendDouble = function(value) {
		if (this.m_isNewLine) {
			this.setupNewLine();
		}
		this.m_buffer.appendDouble(value);
		return this;
	};
	oFF.XStringBufferExt.prototype.appendNewLine = function() {
		this.m_buffer.appendNewLine();
		this.m_isNewLine = true;
		return this;
	};
	oFF.XStringBufferExt.prototype.setIndentationString = function(
			indentationString) {
		this.m_indentString = indentationString;
		return this;
	};
	oFF.XStringBufferExt.prototype.getIndentationString = function() {
		return this.m_indentString;
	};
	oFF.XStringBufferExt.prototype.indent = function() {
		this.m_indent++;
		return this;
	};
	oFF.XStringBufferExt.prototype.outdent = function() {
		this.m_indent--;
		return this;
	};
	oFF.XStringBufferExt.prototype.getIndentation = function() {
		return this.m_indent;
	};
	oFF.XStringBufferExt.prototype.appendObject = function(value) {
		if (oFF.notNull(value)) {
			this.append(value.toString());
		} else {
			this.append("null");
		}
		return this;
	};
	oFF.XStringBufferExt.prototype.length = function() {
		return this.m_buffer.length();
	};
	oFF.XStringBufferExt.prototype.clear = function() {
		this.m_buffer.clear();
	};
	oFF.XStringBufferExt.prototype.flush = function() {
	};
	oFF.XStringBufferExt.prototype.toString = function() {
		return this.m_buffer.toString();
	};
	oFF.XStringBufferJson = function() {
	};
	oFF.XStringBufferJson.prototype = new oFF.XObject();
	oFF.XStringBufferJson.create = function() {
		var buffer = new oFF.XStringBufferJson();
		buffer.setup();
		return buffer;
	};
	oFF.XStringBufferJson.prototype.m_buffer = null;
	oFF.XStringBufferJson.prototype.m_isFirstElement = false;
	oFF.XStringBufferJson.prototype.setup = function() {
		this.m_buffer = oFF.XStringBufferExt.create();
		this.m_buffer.setIndentationString("    ");
		this.m_isFirstElement = true;
	};
	oFF.XStringBufferJson.prototype.releaseObject = function() {
		this.m_buffer = oFF.XObjectExt.release(this.m_buffer);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XStringBufferJson.prototype.appendLine = function(value) {
		this.append(value);
		this.appendNewLine();
		return this;
	};
	oFF.XStringBufferJson.prototype.append = function(value) {
		this.m_buffer.append('"').append(value).append('"');
		return this;
	};
	oFF.XStringBufferJson.prototype.appendChar = function(value) {
		this.m_buffer.append('"').appendChar(value).append('"');
		return this;
	};
	oFF.XStringBufferJson.prototype.appendBoolean = function(value) {
		this.m_buffer.appendBoolean(value);
		return this;
	};
	oFF.XStringBufferJson.prototype.appendInt = function(value) {
		this.m_buffer.appendInt(value);
		return this;
	};
	oFF.XStringBufferJson.prototype.appendLong = function(value) {
		this.m_buffer.appendLong(value);
		return this;
	};
	oFF.XStringBufferJson.prototype.appendDouble = function(value) {
		this.m_buffer.appendDouble(value);
		return this;
	};
	oFF.XStringBufferJson.prototype.appendNewLine = function() {
		this.m_buffer.appendNewLine();
		return this;
	};
	oFF.XStringBufferJson.prototype.appendLabel = function(label) {
		if (!this.m_isFirstElement) {
			this.m_buffer.append(",");
			this.appendNewLine();
		}
		this.m_buffer.append('"').append(label).append('":');
		this.m_isFirstElement = false;
		return this;
	};
	oFF.XStringBufferJson.prototype.openArrayWithLabel = function(label) {
		this.appendLabel(label);
		return this.open("[");
	};
	oFF.XStringBufferJson.prototype.openArray = function() {
		return this.open("[");
	};
	oFF.XStringBufferJson.prototype.closeArray = function() {
		return this.close("]");
	};
	oFF.XStringBufferJson.prototype.openStructureWithLabel = function(label) {
		this.appendLabel(label);
		return this.open("{");
	};
	oFF.XStringBufferJson.prototype.openStructure = function() {
		if (!this.m_isFirstElement) {
			this.m_buffer.append(",");
		}
		return this.open("{");
	};
	oFF.XStringBufferJson.prototype.closeStructure = function() {
		return this.close("}");
	};
	oFF.XStringBufferJson.prototype.open = function(bracket) {
		if (!this.m_isFirstElement) {
			this.appendNewLine();
		}
		this.m_buffer.append(bracket);
		this.appendNewLine();
		this.m_buffer.indent();
		this.m_isFirstElement = true;
		return this;
	};
	oFF.XStringBufferJson.prototype.close = function(bracket) {
		this.appendNewLine();
		this.m_buffer.outdent();
		this.m_buffer.append(bracket);
		this.m_isFirstElement = false;
		return this;
	};
	oFF.XStringBufferJson.prototype.appendLabelAndString = function(label,
			value) {
		this.appendLabel(label).append(value);
		return this;
	};
	oFF.XStringBufferJson.prototype.appendLabelAndBoolean = function(label,
			value) {
		this.appendLabel(label).appendBoolean(value);
		return this;
	};
	oFF.XStringBufferJson.prototype.appendLabelAndInt = function(label, value) {
		this.appendLabel(label).appendInt(value);
		return this;
	};
	oFF.XStringBufferJson.prototype.appendLabelAndLong = function(label, value) {
		this.appendLabel(label).appendLong(value);
		return this;
	};
	oFF.XStringBufferJson.prototype.appendLabelAndDouble = function(label,
			value) {
		this.appendLabel(label).appendDouble(value);
		return this;
	};
	oFF.XStringBufferJson.prototype.appendString = function(label) {
		if (!this.m_isFirstElement) {
			this.m_buffer.append(",");
			this.appendNewLine();
		}
		this.m_buffer.append('"').append(label).append('"');
		this.m_isFirstElement = false;
		return this;
	};
	oFF.XStringBufferJson.prototype.appendObject = function(value) {
		if (oFF.isNull(value)) {
			this.append("null");
		} else {
			this.append(value.toString());
		}
		return this;
	};
	oFF.XStringBufferJson.prototype.length = function() {
		return this.m_buffer.length();
	};
	oFF.XStringBufferJson.prototype.clear = function() {
		this.m_buffer.clear();
		this.m_isFirstElement = true;
	};
	oFF.XStringBufferJson.prototype.flush = function() {
	};
	oFF.XStringBufferJson.prototype.toString = function() {
		return this.m_buffer.toString();
	};
	oFF.XAbstractReadOnlyMap = function() {
	};
	oFF.XAbstractReadOnlyMap.prototype = new oFF.XObject();
	oFF.XAbstractReadOnlyMap.prototype.m_storage = null;
	oFF.XAbstractReadOnlyMap.prototype.setup = function() {
		this.m_storage = oFF.XHashMapByString.create();
	};
	oFF.XAbstractReadOnlyMap.prototype.releaseObject = function() {
		this.m_storage = oFF.XObjectExt.release(this.m_storage);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XAbstractReadOnlyMap.prototype.isEmpty = function() {
		return this.m_storage.isEmpty();
	};
	oFF.XAbstractReadOnlyMap.prototype.getByKey = function(key) {
		return this.m_storage.getByKey(key);
	};
	oFF.XAbstractReadOnlyMap.prototype.hasElements = function() {
		return this.m_storage.hasElements();
	};
	oFF.XAbstractReadOnlyMap.prototype.size = function() {
		return this.m_storage.size();
	};
	oFF.XAbstractReadOnlyMap.prototype.getValuesAsReadOnlyList = function() {
		return this.m_storage.getValuesAsReadOnlyList();
	};
	oFF.XAbstractReadOnlyMap.prototype.getIterator = function() {
		return this.m_storage.getIterator();
	};
	oFF.XAbstractReadOnlyMap.prototype.contains = function(element) {
		return this.m_storage.contains(element);
	};
	oFF.XAbstractReadOnlyMap.prototype.containsKey = function(key) {
		return this.m_storage.containsKey(key);
	};
	oFF.XAbstractReadOnlyMap.prototype.getKeysAsReadOnlyListOfString = function() {
		return this.m_storage.getKeysAsReadOnlyListOfString();
	};
	oFF.XAbstractReadOnlyMap.prototype.getKeysAsIteratorOfString = function() {
		return this.m_storage.getKeysAsIteratorOfString();
	};
	oFF.XAbstractReadOnlyMap.prototype.toString = function() {
		return this.m_storage.toString();
	};
	oFF.XArray2Dim = function() {
	};
	oFF.XArray2Dim.prototype = new oFF.XObject();
	oFF.XArray2Dim.create = function(dim0count, dim1count) {
		var object = new oFF.XArray2Dim();
		object.setupExt(dim0count, dim1count, null);
		return object;
	};
	oFF.XArray2Dim.prototype.m_dim0count = 0;
	oFF.XArray2Dim.prototype.m_dim1count = 0;
	oFF.XArray2Dim.prototype.m_list = null;
	oFF.XArray2Dim.prototype.setupExt = function(dim0count, dim1count, storage) {
		var size;
		this.m_dim0count = dim0count;
		this.m_dim1count = dim1count;
		if (oFF.isNull(storage)) {
			size = dim0count * dim1count;
			this.m_list = oFF.XArray.create(size);
		} else {
			this.m_list = storage;
		}
	};
	oFF.XArray2Dim.prototype.releaseObject = function() {
		this.m_dim0count = -1;
		this.m_dim1count = -1;
		this.m_list = oFF.XObjectExt.release(this.m_list);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XArray2Dim.prototype.createArrayCopy = function() {
		var copy = this.m_list.createArrayCopy();
		var object = new oFF.XArray2Dim();
		object.setupExt(this.m_dim0count, this.m_dim1count, copy);
		return object;
	};
	oFF.XArray2Dim.prototype.clear = function() {
		this.m_list.clear();
	};
	oFF.XArray2Dim.prototype.size = function() {
		return oFF.isNull(this.m_list) ? -1 : this.m_list.size();
	};
	oFF.XArray2Dim.prototype.isEmpty = function() {
		var size = this.m_list.size();
		var i;
		for (i = 0; i < size; i++) {
			if (this.m_list.get(i) !== null) {
				return false;
			}
		}
		return true;
	};
	oFF.XArray2Dim.prototype.hasElements = function() {
		return !this.isEmpty();
	};
	oFF.XArray2Dim.prototype.setByIndices = function(index0, index1, element) {
		var pos;
		if (index0 >= this.m_dim0count) {
			throw oFF.XException
					.createIllegalArgumentException("Index0 is too big");
		}
		if (index1 >= this.m_dim1count) {
			throw oFF.XException
					.createIllegalArgumentException("Index1 is too big");
		}
		pos = index0 + index1 * this.m_dim0count;
		this.m_list.set(pos, element);
	};
	oFF.XArray2Dim.prototype.getByIndices = function(index0, index1) {
		var pos;
		if (index0 >= this.m_dim0count || index1 >= this.m_dim1count) {
			return null;
		}
		pos = index0 + index1 * this.m_dim0count;
		return this.m_list.get(pos);
	};
	oFF.XArray2Dim.prototype.size0 = function() {
		return this.m_dim0count;
	};
	oFF.XArray2Dim.prototype.size1 = function() {
		return this.m_dim1count;
	};
	oFF.XArray2Dim.prototype.toString = function() {
		var stringBuffer = oFF.XStringBuffer.create();
		var index1;
		var index0;
		var element;
		stringBuffer.append("Size0: ").appendInt(this.m_dim0count)
				.appendNewLine();
		stringBuffer.append("Size1: ").appendInt(this.m_dim1count)
				.appendNewLine();
		stringBuffer.append("Values:");
		for (index1 = 0; index1 < this.m_dim1count; index1++) {
			stringBuffer.appendNewLine();
			stringBuffer.append("[");
			for (index0 = 0; index0 < this.m_dim0count; index0++) {
				element = this.getByIndices(index0, index1);
				stringBuffer.append(oFF.isNull(element) ? "null" : element
						.toString());
				if (index0 < this.m_dim0count - 1) {
					stringBuffer.append(", ");
				}
			}
			stringBuffer.append("]");
		}
		return stringBuffer.toString();
	};
	oFF.XEnvironment = function() {
	};
	oFF.XEnvironment.prototype = new oFF.XObjectExt();
	oFF.XEnvironment.VAR_START = "$[";
	oFF.XEnvironment.VAR_START_SIZE = 2;
	oFF.XEnvironment.VAR_END = "]$";
	oFF.XEnvironment.VAR_END_SIZE = 2;
	oFF.XEnvironment.SLASH = "/";
	oFF.XEnvironment.BACK_SLASH = "\\";
	oFF.XEnvironment.s_environmentObj = null;
	oFF.XEnvironment.getInstance = function() {
		if (oFF.isNull(oFF.XEnvironment.s_environmentObj)) {
			oFF.XEnvironment.s_environmentObj = oFF.XEnvironment
					.createFromSystemEnv();
		}
		return oFF.XEnvironment.s_environmentObj;
	};
	oFF.XEnvironment.create = function() {
		var newObj = new oFF.XEnvironment();
		newObj.setup();
		return newObj;
	};
	oFF.XEnvironment.createFromSystemEnv = function() {
		var newObj = new oFF.XEnvironment();
		newObj.setup();
		newObj.retrieveNativeEnv();
		return newObj;
	};
	oFF.XEnvironment.createCopy = function(env) {
		var newObj = oFF.XEnvironment.create();
		var variableNames = env.getVariableNames();
		var i;
		var key;
		var value;
		for (i = 0; i < variableNames.size(); i++) {
			key = variableNames.get(i);
			value = env.getVariable(key);
			newObj.setVariable(key, value);
		}
		return newObj;
	};
	oFF.XEnvironment.normalizeName = function(variable) {
		var name = variable;
		if (oFF.isNull(name)) {
			return null;
		}
		return oFF.XString.toLowerCase(variable);
	};
	oFF.XEnvironment.replaceEnvVar = function(source, env, logger,
			varResolveMode, smartPathConcatenate) {
		var target = source;
		var startIndex;
		var endIndex;
		var before;
		var varName;
		var after;
		var replaceValue;
		while (oFF.notNull(target)) {
			startIndex = oFF.XString.indexOfFrom(target, varResolveMode
					.getPrefix(), 0);
			if (startIndex >= 0) {
				endIndex = oFF.XString.indexOfFrom(target, varResolveMode
						.getPostfix(), startIndex
						+ varResolveMode.getPrefixSize());
				if (endIndex >= 0) {
					before = oFF.XString.substring(target, 0, startIndex);
					varName = oFF.XString.substring(target, startIndex
							+ varResolveMode.getPrefixSize(), endIndex);
					after = oFF.XString.substring(target, endIndex
							+ varResolveMode.getPostfixSize(), -1);
					replaceValue = env.getVariable(varName);
					if (oFF.notNull(replaceValue)) {
						if (smartPathConcatenate) {
							target = oFF.XEnvironment.smartPathConcatenate(
									before, replaceValue);
							target = oFF.XEnvironment.smartPathConcatenate(
									target, after);
						} else {
							target = oFF.XStringUtils.concatenate3(before,
									replaceValue, after);
						}
					} else {
						if (oFF.notNull(logger)) {
							logger.log4("Cannot resolve variable '", varName,
									"' used in ", source);
						}
						target = null;
						break;
					}
				}
			} else {
				break;
			}
		}
		return target;
	};
	oFF.XEnvironment.smartPathConcatenate = function(first, second) {
		var theSecond = second;
		if (oFF.XString.containsString(first, oFF.XEnvironment.BACK_SLASH)) {
			theSecond = oFF.XString.replace(second, oFF.XEnvironment.SLASH,
					oFF.XEnvironment.BACK_SLASH);
			if (oFF.XString.endsWith(first, oFF.XEnvironment.BACK_SLASH)
					&& oFF.XString.startsWith(theSecond,
							oFF.XEnvironment.BACK_SLASH)) {
				theSecond = oFF.XString.substring(theSecond, 1, -1);
			}
		} else {
			if (oFF.XString.containsString(first, oFF.XEnvironment.SLASH)) {
				theSecond = oFF.XString.replace(second,
						oFF.XEnvironment.BACK_SLASH, oFF.XEnvironment.SLASH);
				if (oFF.XString.endsWith(first, oFF.XEnvironment.SLASH)
						&& oFF.XString.startsWith(theSecond,
								oFF.XEnvironment.SLASH)) {
					theSecond = oFF.XString.substring(theSecond, 1, -1);
				}
			}
		}
		return oFF.XStringUtils.concatenate2(first, theSecond);
	};
	oFF.XEnvironment.prototype.m_properties = null;
	oFF.XEnvironment.prototype.m_logWriter = null;
	oFF.XEnvironment.prototype.setup = function() {
		this.m_properties = oFF.XHashMapOfStringByString.create();
		this.m_logWriter = oFF.XLogger.getInstance();
	};
	oFF.XEnvironment.prototype.releaseObject = function() {
		this.m_properties = oFF.XObjectExt.release(this.m_properties);
		this.m_logWriter = null;
		oFF.XObjectExt.prototype.releaseObject.call(this);
	};
	oFF.XEnvironment.prototype.retrieveNativeEnv = function() {
		var nativeEnvironment = oFF.XSystemUtils.getNativeEnvironment();
		var nativeEnvironmentKeys = nativeEnvironment
				.getKeysAsReadOnlyListOfString();
		var len = nativeEnvironmentKeys.size();
		var i;
		var key;
		for (i = 0; i < len; i++) {
			key = nativeEnvironmentKeys.get(i);
			this.m_properties.put(oFF.XString.toLowerCase(key),
					nativeEnvironment.getByKey(key));
		}
	};
	oFF.XEnvironment.prototype.setVariable = function(name, value) {
		if (oFF.XStringUtils.isNotNullAndNotEmpty(name) && oFF.notNull(value)) {
			this.m_properties.put(oFF.XEnvironment.normalizeName(name), value);
		}
	};
	oFF.XEnvironment.prototype.removeVariable = function(name) {
		if (oFF.XStringUtils.isNotNullAndNotEmpty(name)) {
			this.m_properties.remove(oFF.XEnvironment.normalizeName(name));
		}
	};
	oFF.XEnvironment.prototype.getVariable = function(name) {
		if (oFF.XStringUtils.isNotNullAndNotEmpty(name)) {
			return this.m_properties.getByKey(oFF.XEnvironment
					.normalizeName(name));
		} else {
			return null;
		}
	};
	oFF.XEnvironment.prototype.getVariableWithDefault = function(name,
			defaultValue) {
		return this.hasVariable(name) ? this.getVariable(name) : defaultValue;
	};
	oFF.XEnvironment.prototype.putString = function(name, stringValue) {
		if (oFF.XStringUtils.isNotNullAndNotEmpty(name)
				&& oFF.notNull(stringValue)) {
			this.m_properties.put(oFF.XEnvironment.normalizeName(name),
					stringValue);
		}
	};
	oFF.XEnvironment.prototype.putStringNotNull = function(name, stringValue) {
		if (oFF.XStringUtils.isNotNullAndNotEmpty(name)
				&& oFF.notNull(stringValue)) {
			this.m_properties.put(oFF.XEnvironment.normalizeName(name),
					stringValue);
		}
	};
	oFF.XEnvironment.prototype.putStringNotNullAndNotEmpty = function(name,
			stringValue) {
		if (oFF.XStringUtils.isNotNullAndNotEmpty(name)
				&& oFF.XStringUtils.isNotNullAndNotEmpty(stringValue)) {
			this.m_properties.put(oFF.XEnvironment.normalizeName(name),
					stringValue);
		}
	};
	oFF.XEnvironment.prototype.getBooleanByKey = function(name) {
		return this.getBooleanByKeyExt(name, false);
	};
	oFF.XEnvironment.prototype.getBooleanByKeyExt = function(name, defaultValue) {
		var value = this.getStringByKey(name);
		if (oFF.notNull(value)) {
			if (oFF.XString.isEqual(value, "true")
					|| oFF.XString.isEqual(value, "TRUE")) {
				return true;
			} else {
				if (oFF.XString.isEqual(value, "false")
						|| oFF.XString.isEqual(value, "FALSE")) {
					return false;
				}
			}
		}
		return defaultValue;
	};
	oFF.XEnvironment.prototype.putBoolean = function(key, booleanValue) {
		if (booleanValue) {
			this.putString(key, "true");
		} else {
			this.putString(key, "false");
		}
	};
	oFF.XEnvironment.prototype.putInteger = function(name, intValue) {
		this.putString(name, oFF.XInteger.convertToString(intValue));
	};
	oFF.XEnvironment.prototype.getIntegerByKey = function(name) {
		return this.getIntegerByKeyExt(name, 0);
	};
	oFF.XEnvironment.prototype.getIntegerByKeyExt = function(name, defaultValue) {
		var intValue = defaultValue;
		var value = this.getStringByKey(name);
		if (oFF.notNull(value)) {
			intValue = oFF.XInteger.convertFromStringWithDefault(value,
					defaultValue);
		}
		return intValue;
	};
	oFF.XEnvironment.prototype.getStringByKey = function(name) {
		return this.getStringByKeyExt(name, null);
	};
	oFF.XEnvironment.prototype.getStringByKeyExt = function(name, defaultValue) {
		var value = this.getVariable(name);
		if (oFF.notNull(value)) {
			return oFF.XEnvironment.replaceEnvVar(value, this, this,
					oFF.VarResolveMode.DOLLAR, false);
		} else {
			return defaultValue;
		}
	};
	oFF.XEnvironment.prototype.getPathByKey = function(name) {
		return this.getPathByKeyExt(name, null);
	};
	oFF.XEnvironment.prototype.getPathByKeyExt = function(name, defaultValue) {
		var value = this.getVariable(name);
		if (oFF.notNull(value)) {
			return oFF.XEnvironment.replaceEnvVar(value, this, this,
					oFF.VarResolveMode.DOLLAR, true);
		} else {
			return defaultValue;
		}
	};
	oFF.XEnvironment.prototype.resolvePath = function(path) {
		return oFF.XEnvironment.replaceEnvVar(path, this, this,
				oFF.VarResolveMode.DOLLAR, true);
	};
	oFF.XEnvironment.prototype.resolveString = function(value) {
		return oFF.XEnvironment.replaceEnvVar(value, this, this,
				oFF.VarResolveMode.DOLLAR, false);
	};
	oFF.XEnvironment.prototype.getLogWriter = function() {
		return this.m_logWriter;
	};
	oFF.XEnvironment.prototype.getLogWriterBase = function() {
		return this.m_logWriter;
	};
	oFF.XEnvironment.prototype.setLogWriter = function(logWriter) {
		this.m_logWriter = logWriter;
	};
	oFF.XEnvironment.prototype.getKeysAsReadOnlyListOfString = function() {
		return this.m_properties.getKeysAsReadOnlyListOfString();
	};
	oFF.XEnvironment.prototype.getKeysAsIteratorOfString = function() {
		return this.m_properties.getKeysAsIteratorOfString();
	};
	oFF.XEnvironment.prototype.isEmpty = function() {
		return this.m_properties.isEmpty();
	};
	oFF.XEnvironment.prototype.hasElements = function() {
		return this.m_properties.hasElements();
	};
	oFF.XEnvironment.prototype.size = function() {
		return this.m_properties.size();
	};
	oFF.XEnvironment.prototype.containsKey = function(key) {
		return this.m_properties.containsKey(oFF.XEnvironment
				.normalizeName(key));
	};
	oFF.XEnvironment.prototype.hasVariable = function(name) {
		if (oFF.XStringUtils.isNotNullAndNotEmpty(name)) {
			return this.m_properties.containsKey(oFF.XEnvironment
					.normalizeName(name));
		} else {
			return false;
		}
	};
	oFF.XEnvironment.prototype.getVariableNames = function() {
		return this.m_properties.getKeysAsReadOnlyListOfString();
	};
	oFF.PrFactoryUniversal = function() {
	};
	oFF.PrFactoryUniversal.prototype = new oFF.PrFactory();
	oFF.PrFactoryUniversal.staticSetup = function() {
		var factory = new oFF.PrFactoryUniversal();
		oFF.PrFactory.setUniversalFactory(factory);
		oFF.PrFactory.setActiveFactory(factory);
	};
	oFF.PrFactoryUniversal.prototype.newList = function() {
		return oFF.PrList.create();
	};
	oFF.PrFactoryUniversal.prototype.newBoolean = function(value) {
		return oFF.PrBoolean.createWithValue(value);
	};
	oFF.PrFactoryUniversal.prototype.newInteger = function(number) {
		return oFF.PrInteger.createWithValue(number);
	};
	oFF.PrFactoryUniversal.prototype.newLong = function(number) {
		return oFF.PrLong.createWithValue(number);
	};
	oFF.PrFactoryUniversal.prototype.newDouble = function(number) {
		return oFF.PrDouble.createWithValue(number);
	};
	oFF.PrFactoryUniversal.prototype.newString = function(string) {
		return oFF.PrString.createWithValue(string);
	};
	oFF.PrFactoryUniversal.prototype.newStructure = function() {
		return oFF.PrStructure.create();
	};
	oFF.PrFactoryUniversal.prototype.newNull = function() {
		return null;
	};
	oFF.XLinkedHashMapByString = function() {
	};
	oFF.XLinkedHashMapByString.prototype = new oFF.XAbstractReadOnlyMap();
	oFF.XLinkedHashMapByString.create = function() {
		var hashMap = new oFF.XLinkedHashMapByString();
		hashMap.setup();
		hashMap.m_order = oFF.XListOfString.create();
		return hashMap;
	};
	oFF.XLinkedHashMapByString.prototype.m_order = null;
	oFF.XLinkedHashMapByString.prototype.releaseObject = function() {
		this.m_order = oFF.XObjectExt.release(this.m_order);
		oFF.XAbstractReadOnlyMap.prototype.releaseObject.call(this);
	};
	oFF.XLinkedHashMapByString.prototype.clear = function() {
		this.m_storage.clear();
		this.m_order.clear();
	};
	oFF.XLinkedHashMapByString.prototype.remove = function(key) {
		if (oFF.isNull(key)) {
			return null;
		}
		this.m_order.removeElement(key);
		return this.m_storage.remove(key);
	};
	oFF.XLinkedHashMapByString.prototype.clone = function() {
		return this.createMapByStringCopy();
	};
	oFF.XLinkedHashMapByString.prototype.createMapByStringCopy = function() {
		var copy = oFF.XLinkedHashMapByString.create();
		var i;
		var next;
		for (i = 0; i < this.m_order.size(); i++) {
			next = this.m_order.get(i);
			copy.put(next, this.getByKey(next));
		}
		return copy;
	};
	oFF.XLinkedHashMapByString.prototype.getKeysAsReadOnlyListOfString = function() {
		return this.m_order.createListOfStringCopy();
	};
	oFF.XLinkedHashMapByString.prototype.putIfNotNull = function(key, element) {
		if (oFF.notNull(element)) {
			this.put(key, element);
		}
	};
	oFF.XLinkedHashMapByString.prototype.put = function(key, element) {
		if (oFF.notNull(key)) {
			if (!this.m_storage.containsKey(key)) {
				this.m_order.add(key);
			}
			this.m_storage.put(key, element);
		}
	};
	oFF.XLinkedHashMapByString.prototype.getValuesAsReadOnlyList = function() {
		var list = oFF.XList.create();
		var i;
		for (i = 0; i < this.m_order.size(); i++) {
			list.add(this.m_storage.getByKey(this.m_order.get(i)));
		}
		return list;
	};
	oFF.XLinkedHashMapByString.prototype.getIterator = function() {
		return this.getValuesAsReadOnlyList().getIterator();
	};
	oFF.XLinkedHashMapByString.prototype.getKeysAsIteratorOfString = function() {
		return this.m_order.getIterator();
	};
	oFF.XLinkedHashMapByString.prototype.isEqualTo = function(other) {
		var otherMap;
		var thisKeys;
		var thisValues;
		var otherKeys;
		var otherValues;
		var keyIdx;
		if (oFF.isNull(other)) {
			return false;
		}
		if (this === other) {
			return true;
		}
		otherMap = other;
		if (this.size() !== otherMap.size()) {
			return false;
		}
		thisKeys = this.getKeysAsReadOnlyListOfString();
		thisValues = this.getValuesAsReadOnlyList();
		otherKeys = otherMap.getKeysAsReadOnlyListOfString();
		otherValues = otherMap.getValuesAsReadOnlyList();
		for (keyIdx = 0; keyIdx < thisKeys.size(); keyIdx++) {
			if (!oFF.XString.isEqual(thisKeys.get(keyIdx), otherKeys
					.get(keyIdx))) {
				return false;
			}
			if (!thisValues.get(keyIdx).isEqualTo(otherValues.get(keyIdx))) {
				return false;
			}
		}
		return true;
	};
	oFF.XSimpleMap = function() {
	};
	oFF.XSimpleMap.prototype = new oFF.XAbstractList();
	oFF.XSimpleMap.create = function() {
		var map = new oFF.XSimpleMap();
		map.m_list = oFF.XList.create();
		return map;
	};
	oFF.XSimpleMap.prototype.containsKey = function(key) {
		return this.getByKey(key) !== null;
	};
	oFF.XSimpleMap.prototype.getByKey = function(key) {
		var i;
		var pair;
		var obj1;
		var obj2;
		for (i = 0; i < this.m_list.size(); i++) {
			pair = this.m_list.get(i);
			obj1 = pair.getFirstObject();
			obj2 = key;
			if (obj1 === obj2) {
				return pair.getSecondObject();
			}
		}
		return null;
	};
	oFF.XSimpleMap.prototype.contains = function(element) {
		var i;
		var pair;
		var obj1;
		var obj2;
		for (i = 0; i < this.m_list.size(); i++) {
			pair = this.m_list.get(i);
			obj1 = pair.getSecondObject();
			obj2 = element;
			if (obj1 === obj2) {
				return true;
			}
		}
		return false;
	};
	oFF.XSimpleMap.prototype.getKeysAsIterator = function() {
		return this.getKeysAsReadOnlyList().getIterator();
	};
	oFF.XSimpleMap.prototype.getKeysAsReadOnlyList = function() {
		var list = oFF.XList.create();
		var i;
		var pair;
		for (i = 0; i < this.m_list.size(); i++) {
			pair = this.m_list.get(i);
			list.add(pair.getFirstObject());
		}
		return list;
	};
	oFF.XSimpleMap.prototype.getIterator = function() {
		return this.getValuesAsReadOnlyList().getIterator();
	};
	oFF.XSimpleMap.prototype.getValuesAsReadOnlyList = function() {
		var list = oFF.XList.create();
		var i;
		var pair;
		for (i = 0; i < this.m_list.size(); i++) {
			pair = this.m_list.get(i);
			list.add(pair.getSecondObject());
		}
		return list;
	};
	oFF.XSimpleMap.prototype.put = function(key, element) {
		var pair;
		this.remove(key);
		pair = oFF.XPair.create(key, element);
		this.m_list.add(pair);
	};
	oFF.XSimpleMap.prototype.remove = function(key) {
		var i;
		var pair;
		var obj1;
		var obj2;
		for (i = 0; i < this.m_list.size(); i++) {
			pair = this.m_list.get(i);
			obj1 = pair.getFirstObject();
			obj2 = key;
			if (obj1 === obj2) {
				return this.m_list.removeAt(i).getSecondObject();
			}
		}
		return null;
	};
	oFF.XSimpleMap.prototype.createMapCopy = function() {
		var map = oFF.XSimpleMap.create();
		var i;
		var pair;
		for (i = 0; i < this.m_list.size(); i++) {
			pair = this.m_list.get(i);
			map.put(pair.getFirstObject(), pair.getSecondObject());
		}
		return map;
	};
	oFF.XUnmodSetOfNameObject = function() {
	};
	oFF.XUnmodSetOfNameObject.prototype = new oFF.XObject();
	oFF.XUnmodSetOfNameObject.create = function(bag) {
		var list = new oFF.XUnmodSetOfNameObject();
		list.m_storage = oFF.XWeakReferenceUtil.getWeakRef(bag);
		return list;
	};
	oFF.XUnmodSetOfNameObject.prototype.m_storage = null;
	oFF.XUnmodSetOfNameObject.prototype.releaseObject = function() {
		this.m_storage = oFF.XObjectExt.release(this.m_storage);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XUnmodSetOfNameObject.prototype.getHardStorage = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_storage);
	};
	oFF.XUnmodSetOfNameObject.prototype.getValuesAsReadOnlyList = function() {
		return this.getHardStorage().getValuesAsReadOnlyList();
	};
	oFF.XUnmodSetOfNameObject.prototype.getIterator = function() {
		return this.getHardStorage().getIterator();
	};
	oFF.XUnmodSetOfNameObject.prototype.size = function() {
		return this.getHardStorage().size();
	};
	oFF.XUnmodSetOfNameObject.prototype.isEmpty = function() {
		return this.getHardStorage().isEmpty();
	};
	oFF.XUnmodSetOfNameObject.prototype.hasElements = function() {
		return this.getHardStorage().hasElements();
	};
	oFF.XUnmodSetOfNameObject.prototype.contains = function(element) {
		return this.getHardStorage().contains(element);
	};
	oFF.XUnmodSetOfNameObject.prototype.containsKey = function(key) {
		return this.getHardStorage().containsKey(key);
	};
	oFF.XUnmodSetOfNameObject.prototype.getByKey = function(key) {
		return this.getHardStorage().getByKey(key);
	};
	oFF.XUnmodSetOfNameObject.prototype.getKeysAsReadOnlyListOfString = function() {
		return this.getHardStorage().getKeysAsReadOnlyListOfString();
	};
	oFF.XUnmodSetOfNameObject.prototype.getKeysAsIteratorOfString = function() {
		return this.getHardStorage().getKeysAsIteratorOfString();
	};
	oFF.XUnmodSetOfNameObject.prototype.toString = function() {
		return this.getHardStorage().toString();
	};
	oFF.XWeakMap = function() {
	};
	oFF.XWeakMap.prototype = new oFF.XObject();
	oFF.XWeakMap.create = function() {
		var hashMap = new oFF.XWeakMap();
		hashMap.m_storage = oFF.XHashMapByString.create();
		return hashMap;
	};
	oFF.XWeakMap.prototype.m_storage = null;
	oFF.XWeakMap.prototype.releaseObject = function() {
		this.m_storage = oFF.XObjectExt.release(this.m_storage);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XWeakMap.prototype.containsKey = function(key) {
		return this.m_storage.containsKey(key);
	};
	oFF.XWeakMap.prototype.contains = function(element) {
		var values = this.getValuesAsReadOnlyList();
		return values.contains(element);
	};
	oFF.XWeakMap.prototype.getByKey = function(key) {
		var weakRef;
		var hardRef;
		if (oFF.isNull(key)) {
			return null;
		}
		weakRef = this.m_storage.getByKey(key);
		hardRef = oFF.XWeakReferenceUtil.getHardRef(weakRef);
		return hardRef;
	};
	oFF.XWeakMap.prototype.remove = function(key) {
		var weakRef = this.m_storage.remove(key);
		return oFF.XWeakReferenceUtil.getHardRef(weakRef);
	};
	oFF.XWeakMap.prototype.clone = function() {
		return this.createMapByStringCopy();
	};
	oFF.XWeakMap.prototype.createMapByStringCopy = function() {
		var copy = oFF.XWeakMap.create();
		var iterator = this.getKeysAsIteratorOfString();
		var next;
		while (iterator.hasNext()) {
			next = iterator.next();
			copy.put(next, this.getByKey(next));
		}
		return copy;
	};
	oFF.XWeakMap.prototype.getKeysAsReadOnlyListOfString = function() {
		return this.m_storage.getKeysAsReadOnlyListOfString();
	};
	oFF.XWeakMap.prototype.getKeysAsIteratorOfString = function() {
		return this.m_storage.getKeysAsIteratorOfString();
	};
	oFF.XWeakMap.prototype.putIfNotNull = function(key, element) {
		if (oFF.notNull(element)) {
			this.put(key, element);
		}
	};
	oFF.XWeakMap.prototype.put = function(key, element) {
		if (oFF.isNull(key)) {
			throw oFF.XException
					.createIllegalArgumentException("Null cannot be key");
		}
		this.m_storage.put(key, oFF.XWeakReferenceUtil.getWeakRef(element));
	};
	oFF.XWeakMap.prototype.getValuesAsReadOnlyList = function() {
		var list = oFF.XList.create();
		var iterator = this.getKeysAsIteratorOfString();
		var next;
		var weakRef;
		var hardRef;
		while (iterator.hasNext()) {
			next = iterator.next();
			weakRef = this.m_storage.getByKey(next);
			hardRef = oFF.XWeakReferenceUtil.getHardRef(weakRef);
			list.add(hardRef);
		}
		return list;
	};
	oFF.XWeakMap.prototype.getIterator = function() {
		return this.getValuesAsReadOnlyList().getIterator();
	};
	oFF.XWeakMap.prototype.isEqualTo = function(other) {
		var otherMap;
		var keys;
		var key;
		var thisValue;
		var thatValue;
		if (oFF.isNull(other)) {
			return false;
		}
		if (this === other) {
			return true;
		}
		otherMap = other;
		if (this.size() !== otherMap.size()) {
			return false;
		}
		keys = this.getKeysAsIteratorOfString();
		while (keys.hasNext()) {
			key = keys.next();
			if (!otherMap.containsKey(key)) {
				return false;
			}
			thisValue = this.getByKey(key);
			thatValue = otherMap.getByKey(key);
			if (!oFF.XObjectExt.areEqual(thisValue, thatValue)) {
				return false;
			}
		}
		oFF.XObjectExt.release(keys);
		return true;
	};
	oFF.XWeakMap.prototype.isEmpty = function() {
		return this.m_storage.isEmpty();
	};
	oFF.XWeakMap.prototype.hasElements = function() {
		return this.m_storage.hasElements();
	};
	oFF.XWeakMap.prototype.size = function() {
		return this.m_storage.size();
	};
	oFF.XWeakMap.prototype.clear = function() {
		this.m_storage.clear();
	};
	oFF.XWeakMap.prototype.toString = function() {
		return this.m_storage.toString();
	};
	oFF.PrElement = function() {
	};
	oFF.PrElement.prototype = new oFF.XJson();
	oFF.PrElement.prototype.isProxy = function() {
		return false;
	};
	oFF.PrElement.prototype.getElement = function() {
		return this;
	};
	oFF.PrElement.prototype.asList = function() {
		return null;
	};
	oFF.PrElement.prototype.asStructure = function() {
		return null;
	};
	oFF.PrElement.prototype.asString = function() {
		return null;
	};
	oFF.PrElement.prototype.asNumber = function() {
		return null;
	};
	oFF.PrElement.prototype.asInteger = function() {
		return null;
	};
	oFF.PrElement.prototype.asLong = function() {
		return null;
	};
	oFF.PrElement.prototype.asDouble = function() {
		return null;
	};
	oFF.PrElement.prototype.asBoolean = function() {
		return null;
	};
	oFF.PrElement.prototype.asObject = function() {
		return null;
	};
	oFF.PrElement.prototype.getType = function() {
		return null;
	};
	oFF.PrElement.prototype.getValueType = function() {
		if (this.getType() === oFF.PrElementType.STRUCTURE) {
			return oFF.XValueType.STRUCTURE;
		}
		return null;
	};
	oFF.PrElement.prototype.getComponentType = function() {
		return this.getValueType();
	};
	oFF.PrElement.prototype.getPermaCopy = function() {
		return oFF.PrUtils.deepCopyElement(this);
	};
	oFF.PrElement.prototype.isStructure = function() {
		return this.getType() === oFF.PrElementType.STRUCTURE;
	};
	oFF.PrElement.prototype.isList = function() {
		return this.getType() === oFF.PrElementType.LIST;
	};
	oFF.PrElement.prototype.isString = function() {
		return this.getType() === oFF.PrElementType.STRING;
	};
	oFF.PrElement.prototype.isInteger = function() {
		return this.getType() === oFF.PrElementType.INTEGER;
	};
	oFF.PrElement.prototype.isDouble = function() {
		return this.getType() === oFF.PrElementType.DOUBLE;
	};
	oFF.PrElement.prototype.isLong = function() {
		return this.getType() === oFF.PrElementType.LONG;
	};
	oFF.PrElement.prototype.isObject = function() {
		return this.getType() === oFF.PrElementType.OBJECT;
	};
	oFF.PrElement.prototype.isBoolean = function() {
		return this.getType() === oFF.PrElementType.BOOLEAN;
	};
	oFF.PrElement.prototype.isNumeric = function() {
		return this.isLong() || this.isDouble() || this.isInteger();
	};
	oFF.PrElement.prototype.isEqualTo = function(other) {
		var otherElement;
		var myType;
		var otherType;
		var myList;
		var otherList;
		var sizeList;
		var i;
		var myListElement;
		var otherListElement;
		var myStructure;
		var otherStructure;
		var myNames;
		var otherNames;
		var sizeStruct;
		var k;
		var myName;
		var myStructureElement;
		var otherStructureElement;
		if (oFF.isNull(other)) {
			return false;
		}
		otherElement = other;
		myType = this.getType();
		otherType = otherElement.getType();
		if (myType.isNumber() && otherType.isNumber()) {
			return this.asNumber().getDouble() === otherElement.asNumber()
					.getDouble();
		}
		if (myType !== otherType) {
			return false;
		}
		if (myType === oFF.PrElementType.BOOLEAN) {
			return this.getBoolean() === otherElement.getBoolean();
		} else {
			if (myType === oFF.PrElementType.INTEGER) {
				return this.getInteger() === otherElement.getInteger();
			} else {
				if (myType === oFF.PrElementType.LONG) {
					return this.getLong() === otherElement.getLong();
				} else {
					if (myType === oFF.PrElementType.DOUBLE) {
						return this.getDouble() === otherElement.getDouble();
					} else {
						if (myType === oFF.PrElementType.STRING) {
							return oFF.XString.isEqual(this.getString(),
									otherElement.getString());
						} else {
							if (myType === oFF.PrElementType.OBJECT) {
								return this.asObject().getObject() === otherElement
										.asObject().getObject();
							} else {
								if (myType === oFF.PrElementType.THE_NULL) {
									return true;
								}
							}
						}
					}
				}
			}
		}
		if (myType === oFF.PrElementType.LIST) {
			myList = this;
			otherList = otherElement;
			sizeList = myList.size();
			if (sizeList !== otherList.size()) {
				return false;
			}
			for (i = 0; i < sizeList; i++) {
				myListElement = myList.get(i);
				otherListElement = otherList.get(i);
				if (oFF.isNull(myListElement) || oFF.isNull(otherListElement)) {
					return myListElement === otherListElement;
				} else {
					if (!myListElement.isEqualTo(otherListElement)) {
						return false;
					}
				}
			}
		} else {
			if (myType === oFF.PrElementType.STRUCTURE) {
				myStructure = this;
				otherStructure = otherElement;
				myNames = myStructure.getKeysAsReadOnlyListOfStringSorted();
				otherNames = otherStructure
						.getKeysAsReadOnlyListOfStringSorted();
				sizeStruct = myNames.size();
				if (sizeStruct !== otherNames.size()) {
					return false;
				}
				for (k = 0; k < sizeStruct; k++) {
					myName = myNames.get(k);
					if (!oFF.XString.isEqual(myName, otherNames.get(k))) {
						return false;
					}
					myStructureElement = myStructure.getByKey(myName);
					otherStructureElement = otherStructure.getByKey(myName);
					if (oFF.isNull(myStructureElement)
							&& oFF.notNull(otherStructureElement)
							|| oFF.notNull(myStructureElement)
							&& oFF.isNull(otherStructureElement)) {
						return false;
					}
					if (oFF.notNull(myStructureElement)) {
						if (!myStructureElement
								.isEqualTo(otherStructureElement)) {
							return false;
						}
					}
				}
			} else {
				throw oFF.XException
						.createIllegalStateException("Unknown type");
			}
		}
		return true;
	};
	oFF.PrElement.prototype.resetValue = oFF.noSupport;
	oFF.PrElement.prototype.getStringRepresentation = function() {
		return oFF.PrUtils.serialize(this, true, false, 0);
	};
	oFF.PrElement.prototype.convertToNative = function() {
		var parser = oFF.JsonParserFactory.newInstance();
		var nativeObject = parser.convertToNative(this);
		oFF.XObjectExt.release(parser);
		return nativeObject;
	};
	oFF.PrElement.prototype.copyFrom = function(origin) {
		oFF.PrUtils.createDeepCopyExt(origin, this);
	};
	oFF.PrElement.prototype.clone = function() {
		return oFF.PrUtils.createDeepCopyExt(this, null);
	};
	oFF.PrElement.prototype.toString = function() {
		return oFF.PrUtils.serialize(this, true, false, 0);
	};
	oFF.AbstractGeometry = function() {
	};
	oFF.AbstractGeometry.prototype = new oFF.XAbstractValue();
	oFF.AbstractGeometry.WKT_EMTPY = "EMPTY";
	oFF.AbstractGeometry.prototype.m_srid = null;
	oFF.AbstractGeometry.prototype.releaseObject = function() {
		this.m_srid = oFF.XObjectExt.release(this.m_srid);
		oFF.XAbstractValue.prototype.releaseObject.call(this);
	};
	oFF.AbstractGeometry.prototype.isEqualTo = function(other) {
		var xOther;
		if (!oFF.XAbstractValue.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		xOther = other;
		return oFF.XObjectExt.areEqual(this.getSrid(), xOther.getSrid());
	};
	oFF.AbstractGeometry.prototype.getStringRepresentation = function() {
		return this.toWKT();
	};
	oFF.AbstractGeometry.prototype.getSrid = function() {
		return this.m_srid;
	};
	oFF.AbstractGeometry.prototype.setSrid = function(srid) {
		this.m_srid = srid;
	};
	oFF.XLogWriter = function() {
	};
	oFF.XLogWriter.prototype = new oFF.DfLogWriter();
	oFF.XLogWriter.create = function(output) {
		var logWriter = new oFF.XLogWriter();
		logWriter.setupExt(output);
		return logWriter;
	};
	oFF.XLogWriter.prototype.m_severity = 0;
	oFF.XLogWriter.prototype.m_layers = null;
	oFF.XLogWriter.prototype.m_output = null;
	oFF.XLogWriter.prototype.setupExt = function(output) {
		this.m_output = output;
		this.m_layers = oFF.XHashSetOfString.create();
		this.m_severity = oFF.Severity.DEBUG.getLevel();
		this.enableAllLayers();
	};
	oFF.XLogWriter.prototype.releaseObject = function() {
		this.m_output = null;
		this.m_layers = oFF.XObjectExt.release(this.m_layers);
		oFF.DfLogWriter.prototype.releaseObject.call(this);
	};
	oFF.XLogWriter.prototype.setLogStream = function(output) {
		this.m_output = output;
	};
	oFF.XLogWriter.prototype.isLogWritten = function(layer, severity) {
		var isEnabled = false;
		var theSeverity;
		var theLayer;
		if (oFF.notNull(this.m_output)) {
			theSeverity = severity;
			if (oFF.isNull(theSeverity)) {
				theSeverity = oFF.Severity.DEBUG;
			}
			theLayer = layer;
			if (oFF.isNull(theLayer)) {
				theLayer = oFF.OriginLayer.MISC;
			}
			isEnabled = theSeverity.getLevel() >= this.m_severity;
			if (isEnabled === true) {
				isEnabled = this.m_layers.contains(oFF.OriginLayer.ALL
						.getName())
						|| this.m_layers.contains(theLayer.getName());
			}
		}
		return isEnabled;
	};
	oFF.XLogWriter.prototype.logExt = function(layer, severity, code, message) {
		var theSeverity;
		var text;
		if (oFF.notNull(this.m_output)) {
			theSeverity = severity;
			if (oFF.isNull(theSeverity)) {
				theSeverity = oFF.Severity.DEBUG;
			}
			if (this.isLogWritten(layer, severity)) {
				text = oFF.DfLogWriter.createLogString(layer, severity, code,
						message);
				this.m_output.println(text);
			}
		}
	};
	oFF.XLogWriter.prototype.enableAllLayers = function() {
		this.addLayer(oFF.OriginLayer.ALL);
	};
	oFF.XLogWriter.prototype.disableAllLayers = function() {
		this.m_layers.clear();
	};
	oFF.XLogWriter.prototype.addLayer = function(layer) {
		if (layer === oFF.OriginLayer.ALL) {
			this.clear();
		} else {
			if (this.m_layers.contains(oFF.OriginLayer.ALL.getName())) {
				this.m_layers.removeElement(oFF.OriginLayer.ALL.getName());
			}
		}
		this.m_layers.add(layer.getName());
	};
	oFF.XLogWriter.prototype.setFilterLevel = function(filterLevel) {
		this.m_severity = filterLevel;
	};
	oFF.XLogWriter.prototype.clear = function() {
		this.m_layers.clear();
	};
	oFF.XLogWriter.prototype.isEmpty = function() {
		return this.m_layers.isEmpty();
	};
	oFF.XLogWriter.prototype.hasElements = function() {
		return this.m_layers.hasElements();
	};
	oFF.XLogWriter.prototype.size = function() {
		return this.m_layers.size();
	};
	oFF.XSetOfNameObject = function() {
	};
	oFF.XSetOfNameObject.prototype = new oFF.XAbstractReadOnlyMap();
	oFF.XSetOfNameObject.create = function() {
		var list = new oFF.XSetOfNameObject();
		list.setup();
		return list;
	};
	oFF.XSetOfNameObject.prototype.createSetCopy = function() {
		var copy = oFF.XSetOfNameObject.create();
		var iterator = this.m_storage.getIterator();
		while (iterator.hasNext()) {
			copy.add(iterator.next());
		}
		return copy;
	};
	oFF.XSetOfNameObject.prototype.clone = function() {
		var clone = oFF.XSetOfNameObject.create();
		var iterator = this.m_storage.getIterator();
		while (iterator.hasNext()) {
			clone.add(iterator.next().clone());
		}
		return clone;
	};
	oFF.XSetOfNameObject.prototype.add = function(element) {
		this.m_storage.put(element.getName(), element);
	};
	oFF.XSetOfNameObject.prototype.removeElement = function(element) {
		this.m_storage.remove(element.getName());
		return element;
	};
	oFF.XSetOfNameObject.prototype.addAll = function(elements) {
		oFF.XListUtils.addAllObjects(elements, this);
	};
	oFF.XSetOfNameObject.prototype.unmodifiableSetOfNameObject = function() {
		return oFF.XUnmodSetOfNameObject.create(this);
	};
	oFF.XSetOfNameObject.prototype.clear = function() {
		this.m_storage.clear();
	};
	oFF.DocumentFormatType = function() {
	};
	oFF.DocumentFormatType.prototype = new oFF.XConstant();
	oFF.DocumentFormatType.JSON = null;
	oFF.DocumentFormatType.XML = null;
	oFF.DocumentFormatType.staticSetup = function() {
		oFF.DocumentFormatType.JSON = oFF.XConstant.setupName(
				new oFF.DocumentFormatType(), "Json");
		oFF.DocumentFormatType.XML = oFF.XConstant.setupName(
				new oFF.DocumentFormatType(), "Xml");
	};
	oFF.VarResolveMode = function() {
	};
	oFF.VarResolveMode.prototype = new oFF.XConstant();
	oFF.VarResolveMode.NONE = null;
	oFF.VarResolveMode.DOLLAR = null;
	oFF.VarResolveMode.PERCENT = null;
	oFF.VarResolveMode.DEFAULT_VALUE = null;
	oFF.VarResolveMode.staticSetup = function() {
		oFF.VarResolveMode.NONE = oFF.VarResolveMode.create("None", null, null);
		oFF.VarResolveMode.DOLLAR = oFF.VarResolveMode.create("Dollar",
				oFF.XEnvironment.VAR_START, oFF.XEnvironment.VAR_END);
		oFF.VarResolveMode.PERCENT = oFF.VarResolveMode.create("Percent", "%",
				"%");
		oFF.VarResolveMode.DEFAULT_VALUE = oFF.VarResolveMode.DOLLAR;
	};
	oFF.VarResolveMode.create = function(name, prefix, postfix) {
		var newConstant = new oFF.VarResolveMode();
		newConstant.setName(name);
		newConstant.m_prefix = prefix;
		newConstant.m_postfix = postfix;
		if (oFF.notNull(prefix)) {
			newConstant.m_prefixSize = oFF.XString.size(prefix);
		}
		if (oFF.notNull(postfix)) {
			newConstant.m_postfixSize = oFF.XString.size(postfix);
		}
		return newConstant;
	};
	oFF.VarResolveMode.prototype.m_prefix = null;
	oFF.VarResolveMode.prototype.m_postfix = null;
	oFF.VarResolveMode.prototype.m_prefixSize = 0;
	oFF.VarResolveMode.prototype.m_postfixSize = 0;
	oFF.VarResolveMode.prototype.getPrefix = function() {
		return this.m_prefix;
	};
	oFF.VarResolveMode.prototype.getPostfix = function() {
		return this.m_postfix;
	};
	oFF.VarResolveMode.prototype.getPrefixSize = function() {
		return this.m_prefixSize;
	};
	oFF.VarResolveMode.prototype.getPostfixSize = function() {
		return this.m_postfixSize;
	};
	oFF.PrBoolean = function() {
	};
	oFF.PrBoolean.prototype = new oFF.PrElement();
	oFF.PrBoolean.create = function() {
		return new oFF.PrBoolean();
	};
	oFF.PrBoolean.createWithValue = function(value) {
		var proxy = new oFF.PrBoolean();
		proxy.m_value = value;
		return proxy;
	};
	oFF.PrBoolean.prototype.m_value = false;
	oFF.PrBoolean.prototype.getPermaCopy = function() {
		return oFF.PrBoolean.createWithValue(this.m_value);
	};
	oFF.PrBoolean.prototype.getBoolean = function() {
		return this.m_value;
	};
	oFF.PrBoolean.prototype.setBoolean = function(value) {
		this.m_value = value;
	};
	oFF.PrBoolean.prototype.getType = function() {
		return oFF.PrElementType.BOOLEAN;
	};
	oFF.PrBoolean.prototype.asBoolean = function() {
		return this;
	};
	oFF.PrBoolean.prototype.asString = function() {
		return oFF.PrString.createWithValue(oFF.XBoolean
				.convertToString(this.m_value));
	};
	oFF.PrObject = function() {
	};
	oFF.PrObject.prototype = new oFF.PrElement();
	oFF.PrObject.create = function() {
		return new oFF.PrObject();
	};
	oFF.PrObject.prototype.m_value = null;
	oFF.PrObject.prototype.releaseObject = function() {
		this.m_value = null;
		oFF.PrElement.prototype.releaseObject.call(this);
	};
	oFF.PrObject.prototype.getObject = function() {
		return this.m_value;
	};
	oFF.PrObject.prototype.getObjectValue = function() {
		return this.getObject();
	};
	oFF.PrObject.prototype.setObject = function(value) {
		this.m_value = value;
	};
	oFF.PrObject.prototype.getType = function() {
		return oFF.PrElementType.OBJECT;
	};
	oFF.PrObject.prototype.asObject = function() {
		return this;
	};
	oFF.PrString = function() {
	};
	oFF.PrString.prototype = new oFF.PrElement();
	oFF.PrString.create = function() {
		return new oFF.PrString();
	};
	oFF.PrString.createWithValue = function(value) {
		var newObj;
		if (oFF.isNull(value)) {
			return null;
		}
		newObj = new oFF.PrString();
		newObj.m_value = value;
		return newObj;
	};
	oFF.PrString.prototype.m_value = null;
	oFF.PrString.prototype.getPermaCopy = function() {
		return oFF.PrString.createWithValue(this.m_value);
	};
	oFF.PrString.prototype.releaseObject = function() {
		this.m_value = null;
		oFF.PrElement.prototype.releaseObject.call(this);
	};
	oFF.PrString.prototype.getType = function() {
		return oFF.PrElementType.STRING;
	};
	oFF.PrString.prototype.getString = function() {
		return this.m_value;
	};
	oFF.PrString.prototype.setString = function(value) {
		this.m_value = oFF.XString.asString(value);
	};
	oFF.PrString.prototype.asString = function() {
		return this;
	};
	oFF.PrStructure = function() {
	};
	oFF.PrStructure.prototype = new oFF.PrElement();
	oFF.PrStructure.create = function() {
		var structure = new oFF.PrStructure();
		structure.setup();
		return structure;
	};
	oFF.PrStructure.createDeepCopy = function(origin) {
		return oFF.PrUtils.createDeepCopyExt(origin, null);
	};
	oFF.PrStructure.prototype.m_elementValueMap = null;
	oFF.PrStructure.prototype.setup = function() {
		this.m_elementValueMap = oFF.XLinkedHashMapByString.create();
	};
	oFF.PrStructure.prototype.releaseObject = function() {
		this.m_elementValueMap = oFF.XObjectExt.release(this.m_elementValueMap);
		oFF.PrElement.prototype.releaseObject.call(this);
	};
	oFF.PrStructure.prototype.getType = function() {
		return oFF.PrElementType.STRUCTURE;
	};
	oFF.PrStructure.prototype.asStructure = function() {
		return this;
	};
	oFF.PrStructure.prototype.getStringByKey = function(name) {
		return this.getStringByKeyExt(name, null);
	};
	oFF.PrStructure.prototype.putString = function(name, stringValue) {
		if (oFF.isNull(name)) {
			throw oFF.XException.createRuntimeException("Missing key");
		}
		this.m_elementValueMap.put(name, oFF.PrString
				.createWithValue(stringValue));
	};
	oFF.PrStructure.prototype.getIntegerByKey = function(name) {
		return this.getIntegerByKeyExt(name, 0);
	};
	oFF.PrStructure.prototype.getIntegerByKeyExt = function(name, defaultValue) {
		var element = this.m_elementValueMap.getByKey(name);
		if (oFF.notNull(element)) {
			if (element.isInteger()) {
				return element.getInteger();
			} else {
				if (element.isLong()) {
					return oFF.XLong.convertToInt(element.getLong());
				} else {
					if (element.isDouble()) {
						return oFF.XDouble.convertToInt(element.getDouble());
					}
				}
			}
		}
		return defaultValue;
	};
	oFF.PrStructure.prototype.putInteger = function(name, intValue) {
		if (oFF.XMath.isNaN(intValue)) {
			this.putNull(name);
		} else {
			this.m_elementValueMap.put(name, oFF.PrInteger
					.createWithValue(intValue));
		}
	};
	oFF.PrStructure.prototype.getLongByKey = function(name) {
		return this.getLongByKeyExt(name, 0);
	};
	oFF.PrStructure.prototype.putLong = function(name, longValue) {
		if (oFF.XMath.isNaN(longValue)) {
			this.putNull(name);
		} else {
			this.m_elementValueMap.put(name, oFF.PrLong
					.createWithValue(longValue));
		}
	};
	oFF.PrStructure.prototype.getDoubleByKey = function(name) {
		return this.getDoubleByKeyExt(name, 0);
	};
	oFF.PrStructure.prototype.putDouble = function(name, doubleValue) {
		if (oFF.XMath.isNaN(doubleValue)) {
			this.putNull(name);
		} else {
			this.m_elementValueMap.put(name, oFF.PrDouble
					.createWithValue(doubleValue));
		}
	};
	oFF.PrStructure.prototype.getBooleanByKey = function(name) {
		return this.getBooleanByKeyExt(name, false);
	};
	oFF.PrStructure.prototype.putBoolean = function(key, booleanValue) {
		this.m_elementValueMap.put(key, oFF.PrBoolean
				.createWithValue(booleanValue));
	};
	oFF.PrStructure.prototype.putNull = function(name) {
		this.m_elementValueMap.put(name, null);
	};
	oFF.PrStructure.prototype.hasNullByKey = function(name) {
		return this.m_elementValueMap.containsKey(name)
				&& this.m_elementValueMap.getByKey(name) === null;
	};
	oFF.PrStructure.prototype.getStructureByKey = function(name) {
		return this.m_elementValueMap.getByKey(name);
	};
	oFF.PrStructure.prototype.getListByKey = function(name) {
		return this.m_elementValueMap.getByKey(name);
	};
	oFF.PrStructure.prototype.putNotNullAndNotEmpty = function(name, element) {
		if (oFF.notNull(element)
				&& (!element.isList() || !element.asList().isEmpty())
				&& (!element.isStructure() || !element.asStructure().isEmpty())
				&& (!element.isString() || !oFF.XStringUtils
						.isNullOrEmpty(element.asString().getString()))) {
			this.put(name, element);
		}
	};
	oFF.PrStructure.prototype.remove = function(key) {
		return this.m_elementValueMap.remove(key);
	};
	oFF.PrStructure.prototype.getElementTypeByKey = function(name) {
		var element = this.m_elementValueMap.getByKey(name);
		return oFF.isNull(element) ? oFF.PrElementType.THE_NULL : element
				.getType();
	};
	oFF.PrStructure.prototype.hasElements = function() {
		return this.m_elementValueMap.hasElements();
	};
	oFF.PrStructure.prototype.isEmpty = function() {
		return this.m_elementValueMap.isEmpty();
	};
	oFF.PrStructure.prototype.getBooleanByKeyExt = function(name, defaultValue) {
		var element = this.m_elementValueMap.getByKey(name);
		if (oFF.notNull(element)) {
			if (element.isBoolean()) {
				return element.getBoolean();
			}
		}
		return defaultValue;
	};
	oFF.PrStructure.prototype.getStringByKeyExt = function(name, defaultValue) {
		var element;
		if (this.containsKey(name)) {
			element = this.m_elementValueMap.getByKey(name);
			if (oFF.notNull(element) && element.isString()) {
				return element.getString();
			} else {
				return null;
			}
		} else {
			return defaultValue;
		}
	};
	oFF.PrStructure.prototype.getLongByKeyExt = function(name, defaultValue) {
		var element = this.m_elementValueMap.getByKey(name);
		if (oFF.notNull(element)) {
			if (element.isLong()) {
				return element.getLong();
			} else {
				if (element.isInteger()) {
					return element.getInteger();
				} else {
					if (element.isDouble()) {
						return oFF.XDouble.convertToLong(element.getDouble());
					}
				}
			}
		}
		return defaultValue;
	};
	oFF.PrStructure.prototype.getDoubleByKeyExt = function(name, defaultValue) {
		var element = this.m_elementValueMap.getByKey(name);
		if (oFF.notNull(element)) {
			if (element.isDouble()) {
				return element.getDouble();
			} else {
				if (element.isInteger()) {
					return element.getInteger();
				} else {
					if (element.isLong()) {
						return element.getLong();
					}
				}
			}
		}
		return defaultValue;
	};
	oFF.PrStructure.prototype.putStringNotNull = function(name, stringValue) {
		if (oFF.notNull(stringValue)) {
			this.putString(name, stringValue);
		}
	};
	oFF.PrStructure.prototype.putStringNotNullAndNotEmpty = function(name,
			stringValue) {
		if (oFF.XStringUtils.isNotNullAndNotEmpty(stringValue)) {
			this.putString(name, stringValue);
		}
	};
	oFF.PrStructure.prototype.putNewList = function(name) {
		var list = oFF.PrFactory.createList();
		this.put(name, list);
		return list;
	};
	oFF.PrStructure.prototype.putNewStructure = function(name) {
		var structure = oFF.PrStructure.create();
		this.put(name, structure);
		return structure;
	};
	oFF.PrStructure.prototype.getKeysAsReadOnlyListOfStringSorted = function() {
		var structureElementNames = this.getKeysAsReadOnlyListOfString();
		var sorted;
		if (!oFF.XCollectionUtils.hasElements(structureElementNames)) {
			return structureElementNames;
		}
		sorted = oFF.XListOfString
				.createFromReadOnlyList(structureElementNames);
		sorted.sortByDirection(oFF.XSortDirection.ASCENDING);
		return sorted;
	};
	oFF.PrStructure.prototype.hasStringByKey = function(name) {
		return this.containsKey(name)
				&& this.getElementTypeByKey(name) === oFF.PrElementType.STRING;
	};
	oFF.PrStructure.prototype.size = function() {
		return this.m_elementValueMap.size();
	};
	oFF.PrStructure.prototype.containsKey = function(key) {
		return this.m_elementValueMap.containsKey(key);
	};
	oFF.PrStructure.prototype.contains = function(element) {
		return this.m_elementValueMap.contains(element);
	};
	oFF.PrStructure.prototype.getKeysAsIteratorOfString = function() {
		return this.m_elementValueMap.getKeysAsIteratorOfString();
	};
	oFF.PrStructure.prototype.getKeysAsReadOnlyListOfString = function() {
		return this.m_elementValueMap.getKeysAsReadOnlyListOfString();
	};
	oFF.PrStructure.prototype.put = function(key, element) {
		this.m_elementValueMap.put(key, element);
	};
	oFF.PrStructure.prototype.clear = function() {
		this.m_elementValueMap.clear();
	};
	oFF.PrStructure.prototype.getByKey = function(key) {
		return this.m_elementValueMap.getByKey(key);
	};
	oFF.PrStructure.prototype.getIterator = function() {
		return this.getValuesAsReadOnlyList().getIterator();
	};
	oFF.PrStructure.prototype.putIfNotNull = function(key, element) {
		if (oFF.notNull(element)) {
			this.m_elementValueMap.put(key, element);
		}
	};
	oFF.PrStructure.prototype.createMapByStringCopy = function() {
		return this.m_elementValueMap.createMapByStringCopy();
	};
	oFF.PrStructure.prototype.getValuesAsReadOnlyList = function() {
		var values = oFF.XList.create();
		var allValues = this.m_elementValueMap.getIterator();
		var next;
		var type;
		while (allValues.hasNext()) {
			next = allValues.next();
			if (oFF.isNull(next)) {
				continue;
			}
			type = next.getType();
			if (type.isNumber() || type === oFF.PrElementType.BOOLEAN
					|| type === oFF.PrElementType.STRING) {
				values.add(next);
			}
		}
		return values;
	};
	oFF.PrTemplateStructure = function() {
	};
	oFF.PrTemplateStructure.prototype = new oFF.PrElement();
	oFF.PrTemplateStructure.TEMPLATE_PATH_NAME = "$ref";
	oFF.PrTemplateStructure.TEMPLATE_REPLACE_NAME = "$replace";
	oFF.PrTemplateStructure.createStructureWrapper = function(root, parent,
			structure) {
		var obj = new oFF.PrTemplateStructure();
		obj.setupStructureWrapper(root, parent, structure, null);
		return obj;
	};
	oFF.PrTemplateStructure.createStructureWrapperWithTemplate = function(root,
			parent, structure, templateStruct) {
		var obj = new oFF.PrTemplateStructure();
		obj.setupStructureWrapper(root, parent, structure, templateStruct);
		return obj;
	};
	oFF.PrTemplateStructure.prototype.m_root = null;
	oFF.PrTemplateStructure.prototype.m_parent = null;
	oFF.PrTemplateStructure.prototype.m_structure = null;
	oFF.PrTemplateStructure.prototype.m_template = null;
	oFF.PrTemplateStructure.prototype.m_replaceTemplateFields = null;
	oFF.PrTemplateStructure.prototype.setupStructureWrapper = function(root,
			parent, structure, templateStruct) {
		var replaceList;
		var len;
		var i;
		this.m_parent = parent;
		this.m_structure = structure;
		replaceList = this.m_structure
				.getListByKey(oFF.PrTemplateStructure.TEMPLATE_REPLACE_NAME);
		if (oFF.notNull(replaceList)) {
			this.m_replaceTemplateFields = oFF.XHashSetOfString.create();
			len = replaceList.size();
			for (i = 0; i < len; i++) {
				this.m_replaceTemplateFields.add(replaceList.getStringAt(i));
			}
		}
		this.m_root = root;
		this.m_template = templateStruct;
		if (oFF.isNull(this.m_template)) {
			oFF.XObjectExt
					.checkNotNull(this.m_root, "root shall never be null");
			this.m_template = this.tryGetTemplateFromRoot();
		}
	};
	oFF.PrTemplateStructure.prototype.tryGetTemplateFromRoot = function() {
		var templatePath = this.m_structure
				.getStringByKey(oFF.PrTemplateStructure.TEMPLATE_PATH_NAME);
		var result;
		var splitPath;
		var len;
		var i;
		if (oFF.XStringUtils.isNullOrEmpty(templatePath)
				|| !oFF.XString.startsWith(templatePath, "#")) {
			return null;
		}
		result = this.m_root;
		splitPath = oFF.XStringTokenizer.splitString(templatePath, "/");
		len = splitPath.size();
		for (i = 1; i < len; i++) {
			result = result.getStructureByKey(splitPath.get(i));
		}
		return oFF.PrTemplateStructure.createStructureWrapper(this.m_root, this
				.getParent(), result);
	};
	oFF.PrTemplateStructure.prototype.isStructure = function() {
		return true;
	};
	oFF.PrTemplateStructure.prototype.getPermaCopy = oFF.noSupport;
	oFF.PrTemplateStructure.prototype.getType = function() {
		return this.m_structure.getType();
	};
	oFF.PrTemplateStructure.prototype.asStructure = function() {
		return this;
	};
	oFF.PrTemplateStructure.prototype.getStringRepresentation = function() {
		return this.m_structure.getStringRepresentation();
	};
	oFF.PrTemplateStructure.prototype.getValueType = function() {
		return this.m_structure.getValueType();
	};
	oFF.PrTemplateStructure.prototype.getComponentType = function() {
		return this.m_structure.getComponentType();
	};
	oFF.PrTemplateStructure.prototype.getByKey = function(key) {
		var result = this.m_structure.getByKey(key);
		if (oFF.isNull(result) && this.isTemplateAvailable(key)) {
			result = this.m_template.getByKey(key);
		}
		return result;
	};
	oFF.PrTemplateStructure.prototype.getValuesAsReadOnlyList = function() {
		var values = oFF.XList.create();
		values.addAll(this.m_structure.getValuesAsReadOnlyList());
		if (oFF.notNull(this.m_template)) {
			values.addAll(this.m_template.getValuesAsReadOnlyList());
		}
		return values;
	};
	oFF.PrTemplateStructure.prototype.getIterator = function() {
		return this.getValuesAsReadOnlyList().getIterator();
	};
	oFF.PrTemplateStructure.prototype.contains = function(element) {
		var result = this.m_structure.contains(element);
		if (!result && oFF.notNull(this.m_template)) {
			result = this.m_template.contains(element);
		}
		return result;
	};
	oFF.PrTemplateStructure.prototype.isEmpty = function() {
		var result = this.m_structure.isEmpty();
		if (!result && oFF.notNull(this.m_template)) {
			result = this.m_template.isEmpty();
		}
		return result;
	};
	oFF.PrTemplateStructure.prototype.hasElements = function() {
		var result = this.m_structure.hasElements();
		if (!result && oFF.notNull(this.m_template)) {
			result = this.m_template.hasElements();
		}
		return result;
	};
	oFF.PrTemplateStructure.prototype.size = function() {
		var result = this.m_structure.size();
		if (oFF.notNull(this.m_template)) {
			result = result + this.m_template.size();
		}
		return result;
	};
	oFF.PrTemplateStructure.prototype.containsKey = function(key) {
		var result = this.m_structure.containsKey(key);
		if (!result && this.isTemplateAvailable(key)) {
			result = this.m_template.containsKey(key);
		}
		return result;
	};
	oFF.PrTemplateStructure.prototype.getKeysAsReadOnlyListOfString = function() {
		var keys = oFF.XListOfString.create();
		keys.addAll(this.m_structure.getKeysAsReadOnlyListOfString());
		if (oFF.notNull(this.m_template)) {
			keys.addAll(this.m_template.getKeysAsReadOnlyListOfString());
		}
		return keys;
	};
	oFF.PrTemplateStructure.prototype.getKeysAsIteratorOfString = function() {
		return this.getKeysAsReadOnlyListOfString().getIterator();
	};
	oFF.PrTemplateStructure.prototype.getStringByKey = function(name) {
		var element = this.getByKey(name);
		if (oFF.isNull(element)
				|| element.getType() !== oFF.PrElementType.STRING) {
			return null;
		}
		return oFF.ReplaceTagHandler.handle(this, element.asString()
				.getString());
	};
	oFF.PrTemplateStructure.prototype.getStringByKeyExt = function(name,
			defaultValue) {
		var result = this.getStringByKey(name);
		return oFF.isNull(result) ? defaultValue : result;
	};
	oFF.PrTemplateStructure.prototype.getIntegerByKey = function(name) {
		return this.getByKey(name).asNumber().getInteger();
	};
	oFF.PrTemplateStructure.prototype.getIntegerByKeyExt = function(name,
			defaultValue) {
		var element = this.getByKey(name);
		return oFF.isNull(element) ? defaultValue : element.asNumber()
				.getInteger();
	};
	oFF.PrTemplateStructure.prototype.getLongByKey = function(name) {
		return this.getByKey(name).asNumber().getLong();
	};
	oFF.PrTemplateStructure.prototype.getLongByKeyExt = function(name,
			defaultValue) {
		var element = this.getByKey(name);
		return oFF.isNull(element) ? defaultValue : element.asNumber()
				.getLong();
	};
	oFF.PrTemplateStructure.prototype.getDoubleByKey = function(name) {
		return this.getByKey(name).asNumber().getDouble();
	};
	oFF.PrTemplateStructure.prototype.getDoubleByKeyExt = function(name,
			defaultValue) {
		var element = this.getByKey(name);
		return oFF.isNull(element) ? defaultValue : element.asNumber()
				.getDouble();
	};
	oFF.PrTemplateStructure.prototype.getBooleanByKey = function(name) {
		return this.getByKey(name).asBoolean().getBoolean();
	};
	oFF.PrTemplateStructure.prototype.getBooleanByKeyExt = function(name,
			defaultValue) {
		var element = this.getByKey(name);
		return oFF.isNull(element) ? defaultValue : element.asBoolean()
				.getBoolean();
	};
	oFF.PrTemplateStructure.prototype.hasNullByKey = function(name) {
		var result = this.m_structure.hasNullByKey(name);
		if (!result && this.isTemplateAvailable(name)) {
			result = this.m_template.hasNullByKey(name);
		}
		return result;
	};
	oFF.PrTemplateStructure.prototype.putString = oFF.noSupport;
	oFF.PrTemplateStructure.prototype.putStringNotNull = oFF.noSupport;
	oFF.PrTemplateStructure.prototype.putStringNotNullAndNotEmpty = oFF.noSupport;
	oFF.PrTemplateStructure.prototype.remove = oFF.noSupport;
	oFF.PrTemplateStructure.prototype.clear = oFF.noSupport;
	oFF.PrTemplateStructure.prototype.putInteger = oFF.noSupport;
	oFF.PrTemplateStructure.prototype.putLong = oFF.noSupport;
	oFF.PrTemplateStructure.prototype.putDouble = oFF.noSupport;
	oFF.PrTemplateStructure.prototype.putBoolean = oFF.noSupport;
	oFF.PrTemplateStructure.prototype.putNull = oFF.noSupport;
	oFF.PrTemplateStructure.prototype.put = oFF.noSupport;
	oFF.PrTemplateStructure.prototype.getStructureByKey = function(name) {
		var isOriginalAvailable = this.m_structure.containsKey(name);
		var isTemplateAvailable = this.isTemplateAvailable(name);
		var original;
		var templateStruct;
		if (isOriginalAvailable && isTemplateAvailable) {
			original = this.m_structure.getStructureByKey(name);
			templateStruct = oFF.PrTemplateStructure.createStructureWrapper(
					this.m_root, this, this.m_template.getByKey(name)
							.asStructure());
			return oFF.PrTemplateStructure.createStructureWrapperWithTemplate(
					this.m_root, this, original, templateStruct);
		}
		if (isTemplateAvailable) {
			return oFF.PrTemplateStructure.createStructureWrapper(this.m_root,
					this, this.m_template.getByKey(name).asStructure());
		}
		if (isOriginalAvailable) {
			return oFF.PrTemplateStructure.createStructureWrapper(this.m_root,
					this, this.m_structure.getStructureByKey(name));
		}
		return null;
	};
	oFF.PrTemplateStructure.prototype.getListByKey = function(name) {
		var isOriginalAvailable = this.m_structure.containsKey(name);
		var isTemplateAvailable = this.isTemplateAvailable(name);
		var original;
		var templateList;
		if (isOriginalAvailable && isTemplateAvailable) {
			original = this.m_structure.getListByKey(name);
			templateList = oFF.PrTemplateList.createListWrapper(this.m_root,
					this, this.m_template.getByKey(name).asList());
			return oFF.PrTemplateList.createListWrapperWithTemplate(
					this.m_root, this, original, templateList);
		}
		if (isTemplateAvailable) {
			return oFF.PrTemplateList.createListWrapper(this.m_root, this,
					this.m_template.getByKey(name).asList());
		}
		if (isOriginalAvailable) {
			return oFF.PrTemplateList.createListWrapper(this.m_root, this,
					this.m_structure.getListByKey(name));
		}
		return null;
	};
	oFF.PrTemplateStructure.prototype.putNotNullAndNotEmpty = function(name,
			element) {
		this.m_structure.putNotNullAndNotEmpty(name, element);
	};
	oFF.PrTemplateStructure.prototype.putNewList = oFF.noSupport;
	oFF.PrTemplateStructure.prototype.putNewStructure = oFF.noSupport;
	oFF.PrTemplateStructure.prototype.getElementTypeByKey = function(name) {
		var result = this.m_structure.getElementTypeByKey(name);
		if ((oFF.isNull(result) || result === oFF.PrElementType.THE_NULL)
				&& oFF.notNull(this.m_template)) {
			return this.m_template.getElementTypeByKey(name);
		}
		return result;
	};
	oFF.PrTemplateStructure.prototype.getCoreStructureElementNames = function() {
		return this.m_structure.getKeysAsReadOnlyListOfString();
	};
	oFF.PrTemplateStructure.prototype.getKeysAsReadOnlyListOfStringSorted = function() {
		var elementNames = this.getKeysAsReadOnlyListOfString();
		elementNames.sortByDirection(oFF.XSortDirection.ASCENDING);
		return elementNames;
	};
	oFF.PrTemplateStructure.prototype.hasStringByKey = function(name) {
		var result = this.m_structure.hasStringByKey(name);
		if (!result && this.isTemplateAvailable(name)) {
			return this.m_template.hasStringByKey(name);
		}
		return result;
	};
	oFF.PrTemplateStructure.prototype.getParent = function() {
		return this.m_parent;
	};
	oFF.PrTemplateStructure.prototype.setParent = function(parent) {
		this.m_parent = parent;
	};
	oFF.PrTemplateStructure.prototype.isTemplateAvailable = function(name) {
		return oFF.notNull(this.m_template)
				&& this.m_template.containsKey(name)
				&& (oFF.isNull(this.m_replaceTemplateFields) || !this.m_replaceTemplateFields
						.contains(name));
	};
	oFF.PrTemplateStructure.prototype.releaseObject = function() {
		this.m_structure = oFF.XObjectExt.release(this.m_structure);
		this.m_template = oFF.XObjectExt.release(this.m_template);
		this.m_replaceTemplateFields = oFF.XObjectExt
				.release(this.m_replaceTemplateFields);
		this.m_parent = null;
		this.m_root = null;
		oFF.PrElement.prototype.releaseObject.call(this);
	};
	oFF.PrTemplateStructure.prototype.putIfNotNull = oFF.noSupport;
	oFF.PrTemplateStructure.prototype.createMapByStringCopy = oFF.noSupport;
	oFF.DfUserSettings = function() {
	};
	oFF.DfUserSettings.prototype = new oFF.XAbstractValue();
	oFF.DfUserSettings.prototype.put = oFF.noSupport;
	oFF.DfUserSettings.prototype.remove = oFF.noSupport;
	oFF.DfUserSettings.prototype.containsKey = oFF.noSupport;
	oFF.DfUserSettings.prototype.getByKey = oFF.noSupport;
	oFF.DfUserSettings.prototype.getKeysAsReadOnlyListOfString = oFF.noSupport;
	oFF.DfUserSettings.prototype.getKeysAsIteratorOfString = oFF.noSupport;
	oFF.DfUserSettings.prototype.getValuesAsReadOnlyListOfString = oFF.noSupport;
	oFF.DfUserSettings.prototype.getIterator = oFF.noSupport;
	oFF.DfUserSettings.prototype.clear = oFF.noSupport;
	oFF.DfUserSettings.prototype.size = oFF.noSupport;
	oFF.DfUserSettings.prototype.isEmpty = oFF.noSupport;
	oFF.DfUserSettings.prototype.hasElements = oFF.noSupport;
	oFF.DfUserSettings.prototype.contains = oFF.noSupport;
	oFF.DfUserSettings.prototype.getIntegerByKeyExt = oFF.noSupport;
	oFF.DfUserSettings.prototype.putInteger = oFF.noSupport;
	oFF.DfUserSettings.prototype.getLongByKey = oFF.noSupport;
	oFF.DfUserSettings.prototype.getLongByKeyExt = oFF.noSupport;
	oFF.DfUserSettings.prototype.putLong = oFF.noSupport;
	oFF.DfUserSettings.prototype.getDoubleByKey = oFF.noSupport;
	oFF.DfUserSettings.prototype.getDoubleByKeyExt = oFF.noSupport;
	oFF.DfUserSettings.prototype.putDouble = oFF.noSupport;
	oFF.DfUserSettings.prototype.getBooleanByKey = oFF.noSupport;
	oFF.DfUserSettings.prototype.getBooleanByKeyExt = oFF.noSupport;
	oFF.DfUserSettings.prototype.putBoolean = oFF.noSupport;
	oFF.DfUserSettings.prototype.getStringByKey = oFF.noSupport;
	oFF.DfUserSettings.prototype.getStringByKeyExt = oFF.noSupport;
	oFF.DfUserSettings.prototype.putStringNotNull = oFF.noSupport;
	oFF.DfUserSettings.prototype.putString = oFF.noSupport;
	oFF.DfUserSettings.prototype.putNull = oFF.noSupport;
	oFF.DfUserSettings.prototype.hasNullByKey = oFF.noSupport;
	oFF.DfUserSettings.prototype.getValueType = function() {
		return oFF.XValueType.PROPERTIES;
	};
	oFF.DfUserSettings.prototype.isEqualTo = oFF.noSupport;
	oFF.DfUserSettings.prototype.resetValue = oFF.noSupport;
	oFF.DfUserSettings.prototype.serialize = oFF.noSupport;
	oFF.DfUserSettings.prototype.deserialize = oFF.noSupport;
	oFF.DfUserSettings.prototype.createMapOfStringByStringCopy = oFF.noSupport;
	oFF.XProperties = function() {
	};
	oFF.XProperties.prototype = new oFF.XAbstractValue();
	oFF.XProperties.create = function() {
		var properties = new oFF.XProperties();
		properties.setupExt(null);
		return properties;
	};
	oFF.XProperties.createPropertiesCopy = function(origin) {
		var properties = new oFF.XProperties();
		properties.setupExt(origin);
		return properties;
	};
	oFF.XProperties.prototype.m_storage = null;
	oFF.XProperties.prototype.releaseObject = function() {
		this.m_storage = oFF.XObjectExt.release(this.m_storage);
		oFF.XAbstractValue.prototype.releaseObject.call(this);
	};
	oFF.XProperties.prototype.createMapOfStringByStringCopy = function() {
		return this.m_storage.createMapOfStringByStringCopy();
	};
	oFF.XProperties.prototype.setupExt = function(origin) {
		if (oFF.isNull(origin)) {
			this.m_storage = oFF.XHashMapOfStringByString.create();
		} else {
			this.m_storage = oFF.XHashMapOfStringByString
					.createMapOfStringByStringStaticCopy(origin);
		}
	};
	oFF.XProperties.prototype.put = function(key, element) {
		if (oFF.isNull(element)) {
			this.m_storage.remove(key);
		} else {
			this.m_storage.put(key, element);
		}
	};
	oFF.XProperties.prototype.remove = function(key) {
		return this.m_storage.remove(key);
	};
	oFF.XProperties.prototype.containsKey = function(key) {
		return this.m_storage.containsKey(key);
	};
	oFF.XProperties.prototype.getByKey = function(key) {
		return this.m_storage.getByKey(key);
	};
	oFF.XProperties.prototype.getKeysAsReadOnlyListOfString = function() {
		return this.m_storage.getKeysAsReadOnlyListOfString();
	};
	oFF.XProperties.prototype.getKeysAsIteratorOfString = function() {
		return this.m_storage.getKeysAsIteratorOfString();
	};
	oFF.XProperties.prototype.getValuesAsReadOnlyListOfString = function() {
		return this.m_storage.getValuesAsReadOnlyListOfString();
	};
	oFF.XProperties.prototype.getIterator = function() {
		return this.m_storage.getIterator();
	};
	oFF.XProperties.prototype.clear = function() {
		this.m_storage.clear();
	};
	oFF.XProperties.prototype.size = function() {
		return this.m_storage.size();
	};
	oFF.XProperties.prototype.isEmpty = function() {
		return this.m_storage.isEmpty();
	};
	oFF.XProperties.prototype.hasElements = function() {
		return this.m_storage.hasElements();
	};
	oFF.XProperties.prototype.contains = function(element) {
		return this.m_storage.contains(element);
	};
	oFF.XProperties.prototype.assertNameAndGet = function(name) {
		var value = this.m_storage.getByKey(name);
		oFF.XStringUtils.checkStringNotEmpty(value, oFF.XStringUtils
				.concatenate2("Property cannot be found: ", name));
		return value;
	};
	oFF.XProperties.prototype.getIntegerByKey = function(name) {
		return oFF.XInteger.convertFromStringWithRadix(this
				.assertNameAndGet(name), 10);
	};
	oFF.XProperties.prototype.getIntegerByKeyExt = function(name, defaultValue) {
		var value = this.m_storage.getByKey(name);
		return oFF.isNull(value) ? defaultValue : oFF.XInteger
				.convertFromStringWithDefault(value, defaultValue);
	};
	oFF.XProperties.prototype.putInteger = function(name, intValue) {
		this.put(name, oFF.XInteger.convertToString(intValue));
	};
	oFF.XProperties.prototype.getLongByKey = function(name) {
		return oFF.XLong.convertFromString(this.assertNameAndGet(name));
	};
	oFF.XProperties.prototype.getLongByKeyExt = function(name, defaultValue) {
		var value = this.m_storage.getByKey(name);
		return oFF.isNull(value) ? defaultValue : oFF.XLong
				.convertFromStringWithDefault(value, defaultValue);
	};
	oFF.XProperties.prototype.putLong = function(name, longValue) {
		this.put(name, oFF.XLong.convertToString(longValue));
	};
	oFF.XProperties.prototype.getDoubleByKey = function(name) {
		return oFF.XDouble.convertFromString(this.assertNameAndGet(name));
	};
	oFF.XProperties.prototype.getDoubleByKeyExt = function(name, defaultValue) {
		var value = this.m_storage.getByKey(name);
		return oFF.isNull(value) ? defaultValue : oFF.XDouble
				.convertFromStringWithDefault(value, defaultValue);
	};
	oFF.XProperties.prototype.putDouble = function(name, doubleValue) {
		this.put(name, oFF.XDouble.convertToString(doubleValue));
	};
	oFF.XProperties.prototype.getBooleanByKey = function(name) {
		return oFF.XBoolean.convertFromString(this.assertNameAndGet(name));
	};
	oFF.XProperties.prototype.getBooleanByKeyExt = function(name, defaultValue) {
		var value = this.m_storage.getByKey(name);
		return oFF.isNull(value) ? defaultValue : oFF.XBoolean
				.convertFromStringWithDefault(value, defaultValue);
	};
	oFF.XProperties.prototype.putBoolean = function(key, booleanValue) {
		this.put(key, oFF.XBoolean.convertToString(booleanValue));
	};
	oFF.XProperties.prototype.getStringByKey = function(name) {
		return this.getByKey(name);
	};
	oFF.XProperties.prototype.getStringByKeyExt = function(name, defaultValue) {
		if (this.m_storage.containsKey(name)) {
			return this.m_storage.getByKey(name);
		}
		return defaultValue;
	};
	oFF.XProperties.prototype.putStringNotNull = function(name, stringValue) {
		if (oFF.notNull(stringValue)) {
			this.m_storage.put(name, stringValue);
		}
	};
	oFF.XProperties.prototype.putStringNotNullAndNotEmpty = function(name,
			stringValue) {
		if (oFF.XStringUtils.isNotNullAndNotEmpty(stringValue)) {
			this.putString(name, stringValue);
		}
	};
	oFF.XProperties.prototype.putString = function(name, stringValue) {
		if (oFF.isNull(stringValue)) {
			this.m_storage.remove(name);
		} else {
			this.m_storage.put(name, stringValue);
		}
	};
	oFF.XProperties.prototype.putNull = function(name) {
		this.m_storage.put(name, null);
	};
	oFF.XProperties.prototype.hasNullByKey = function(name) {
		return this.m_storage.containsKey(name)
				&& this.m_storage.getByKey(name) === null;
	};
	oFF.XProperties.prototype.getValueType = function() {
		return oFF.XValueType.PROPERTIES;
	};
	oFF.XProperties.prototype.clone = function() {
		return oFF.XProperties.createPropertiesCopy(this);
	};
	oFF.XProperties.prototype.isEqualTo = function(other) {
		var otherProperties;
		var keys;
		var key;
		if (!oFF.XAbstractValue.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		otherProperties = other;
		if (this.size() !== otherProperties.size()) {
			return false;
		}
		keys = this.getKeysAsIteratorOfString();
		while (keys.hasNext()) {
			key = keys.next();
			if (!oFF.XString.isEqual(this.getByKey(key), otherProperties
					.getByKey(key))) {
				return false;
			}
		}
		oFF.XObjectExt.release(keys);
		return true;
	};
	oFF.XProperties.prototype.resetValue = oFF.noSupport;
	oFF.XProperties.prototype.serialize = function() {
		var keys = oFF.XListOfString.create();
		var buffer;
		var i;
		var key;
		var value;
		keys.addAll(this.getKeysAsReadOnlyListOfString());
		keys.sortByDirection(oFF.XSortDirection.ASCENDING);
		buffer = oFF.XStringBuffer.create();
		for (i = 0; i < keys.size(); i++) {
			key = keys.get(i);
			value = this.m_storage.getByKey(key);
			buffer.append(key).append("=").append(value).append("\n");
		}
		return buffer.toString();
	};
	oFF.XProperties.prototype.deserialize = function(content) {
		var normalizedContent = oFF.XStringUtils.normalizeLineEndings(content);
		var lines = oFF.XStringTokenizer.splitString(normalizedContent, "\n");
		var i;
		var currentLine;
		var index;
		var value;
		var name;
		if (oFF.notNull(lines)) {
			for (i = 0; i < lines.size(); i++) {
				currentLine = lines.get(i);
				if (oFF.XStringUtils.isNotNullAndNotEmpty(currentLine)) {
					if (!oFF.XString.startsWith(currentLine, "#")) {
						index = oFF.XString.indexOf(currentLine, "=");
						if (index !== -1) {
							value = oFF.XString.substring(currentLine,
									index + 1, -1);
							name = oFF.XString.trim(oFF.XString.substring(
									currentLine, 0, index));
							this.put(name, value);
						}
					}
				}
			}
		}
	};
	oFF.XProperties.prototype.toString = function() {
		return this.m_storage.toString();
	};
	oFF.AbstractMultiGeometry = function() {
	};
	oFF.AbstractMultiGeometry.prototype = new oFF.AbstractGeometry();
	oFF.AbstractMultiGeometry.prototype.m_list = null;
	oFF.AbstractMultiGeometry.prototype.setup = function() {
		this.m_list = oFF.XList.create();
	};
	oFF.AbstractMultiGeometry.prototype.add = function(element) {
		this.m_list.add(element);
	};
	oFF.AbstractMultiGeometry.prototype.addAll = function(elements) {
		if (oFF.notNull(elements) && elements !== this) {
			this.m_list.addAll(elements);
		}
	};
	oFF.AbstractMultiGeometry.prototype.clear = function() {
		this.m_list.clear();
	};
	oFF.AbstractMultiGeometry.prototype.cloneInternal = function(clone) {
		var i;
		for (i = 0; i < this.m_list.size(); i++) {
			clone.add(this.m_list.get(i).clone());
		}
		clone.setSrid(this.getSrid());
	};
	oFF.AbstractMultiGeometry.prototype.contains = function(element) {
		return this.m_list.contains(element);
	};
	oFF.AbstractMultiGeometry.prototype.createArrayCopy = function() {
		return this.m_list.createArrayCopy();
	};
	oFF.AbstractMultiGeometry.prototype.get = function(index) {
		return this.m_list.get(index);
	};
	oFF.AbstractMultiGeometry.prototype.getIndex = function(element) {
		return this.m_list.getIndex(element);
	};
	oFF.AbstractMultiGeometry.prototype.getIterator = function() {
		return this.m_list.getIterator();
	};
	oFF.AbstractMultiGeometry.prototype.getValuesAsReadOnlyList = function() {
		return this.m_list.getValuesAsReadOnlyList();
	};
	oFF.AbstractMultiGeometry.prototype.hasElements = function() {
		return this.m_list.hasElements();
	};
	oFF.AbstractMultiGeometry.prototype.insert = function(index, element) {
		this.m_list.insert(index, element);
	};
	oFF.AbstractMultiGeometry.prototype.isEmpty = function() {
		return this.m_list.isEmpty();
	};
	oFF.AbstractMultiGeometry.prototype.releaseObject = function() {
		this.m_list = oFF.XObjectExt.release(this.m_list);
		oFF.AbstractGeometry.prototype.releaseObject.call(this);
	};
	oFF.AbstractMultiGeometry.prototype.removeAt = function(index) {
		return this.m_list.removeAt(index);
	};
	oFF.AbstractMultiGeometry.prototype.removeElement = function(element) {
		return this.m_list.removeElement(element);
	};
	oFF.AbstractMultiGeometry.prototype.resetValueInternal = function(value) {
		this.m_list.clear();
		this.m_list.addAll(value);
	};
	oFF.AbstractMultiGeometry.prototype.set = function(index, element) {
		this.m_list.set(index, element);
	};
	oFF.AbstractMultiGeometry.prototype.size = function() {
		return this.m_list.size();
	};
	oFF.AbstractMultiGeometry.prototype.toString = function() {
		var returnString = oFF.XStringBuffer.create();
		var i;
		var geometry;
		for (i = 0; i < this.m_list.size(); i++) {
			if (i > 0) {
				returnString.append(",");
			}
			geometry = this.m_list.get(i);
			returnString.append(geometry.toString());
		}
		return returnString.toString();
	};
	oFF.XPointValue = function() {
	};
	oFF.XPointValue.prototype = new oFF.AbstractGeometry();
	oFF.XPointValue.WKT_START = "POINT";
	oFF.XPointValue.createWithPosition = function(posX, posY) {
		var point = oFF.XPointValue.create();
		point.setXPosition(posX);
		point.setYPosition(posY);
		return point;
	};
	oFF.XPointValue.createWithPositionAndSrid = function(posX, posY, srid) {
		var point = oFF.XPointValue.create();
		point.setXPosition(posX);
		point.setYPosition(posY);
		point.setSrid(oFF.XIntegerValue.create(srid));
		return point;
	};
	oFF.XPointValue.createWithWkt = function(wkt) {
		var point;
		var openingParenthesis;
		var closingParenthesis;
		var stringCoordinates;
		var spaceIndex;
		var strX;
		var strY;
		var xPos;
		var yPos;
		if (oFF.XString.indexOf(wkt, oFF.XPointValue.WKT_START) === -1
				|| oFF.XString.startsWith(wkt, "MULTIPOINT")) {
			return null;
		}
		point = oFF.XPointValue.create();
		openingParenthesis = oFF.XString.indexOf(wkt, "(");
		closingParenthesis = oFF.XString.indexOf(wkt, ")");
		stringCoordinates = oFF.XString.trim(oFF.XString.substring(wkt,
				openingParenthesis + 1, closingParenthesis));
		spaceIndex = oFF.XString.indexOf(stringCoordinates, " ");
		strX = oFF.XString.substring(stringCoordinates, 0, spaceIndex);
		strY = oFF.XString.substring(stringCoordinates, spaceIndex + 1,
				oFF.XString.size(stringCoordinates));
		xPos = oFF.XDouble.convertFromString(strX);
		yPos = oFF.XDouble.convertFromString(strY);
		point.setXPosition(xPos);
		point.setYPosition(yPos);
		return point;
	};
	oFF.XPointValue.create = function() {
		return new oFF.XPointValue();
	};
	oFF.XPointValue.prototype.m_xPosition = 0;
	oFF.XPointValue.prototype.m_yPosition = 0;
	oFF.XPointValue.prototype.getXPosition = function() {
		return this.m_xPosition;
	};
	oFF.XPointValue.prototype.getYPosition = function() {
		return this.m_yPosition;
	};
	oFF.XPointValue.prototype.setXPosition = function(posX) {
		this.m_xPosition = posX;
	};
	oFF.XPointValue.prototype.setYPosition = function(posY) {
		this.m_yPosition = posY;
	};
	oFF.XPointValue.prototype.getValueType = function() {
		return oFF.XValueType.POINT;
	};
	oFF.XPointValue.prototype.resetValue = function(value) {
		var otherValue;
		oFF.AbstractGeometry.prototype.resetValue.call(this, value);
		if (this === value) {
			return;
		}
		otherValue = value;
		this.m_xPosition = otherValue.m_xPosition;
		this.m_yPosition = otherValue.m_yPosition;
	};
	oFF.XPointValue.prototype.isEqualTo = function(other) {
		var xOther;
		if (!oFF.AbstractGeometry.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		xOther = other;
		return this.getXPosition() === xOther.getXPosition()
				&& this.getYPosition() === xOther.getYPosition();
	};
	oFF.XPointValue.prototype.clone = function() {
		var clone = oFF.XPointValue.createWithPosition(this.m_xPosition,
				this.m_yPosition);
		clone.setSrid(this.getSrid());
		return clone;
	};
	oFF.XPointValue.prototype.toWKT = function() {
		return oFF.XStringUtils.concatenate4(oFF.XPointValue.WKT_START, " (",
				this.toString(), ")");
	};
	oFF.XPointValue.prototype.toString = function() {
		var sb = oFF.XStringBuffer.create();
		sb.appendDouble(this.m_xPosition).append(" ").appendDouble(
				this.m_yPosition);
		return sb.toString();
	};
	oFF.XPolygonValue = function() {
	};
	oFF.XPolygonValue.prototype = new oFF.AbstractGeometry();
	oFF.XPolygonValue.WKT_START = "POLYGON";
	oFF.XPolygonValue.WKT_END = "))";
	oFF.XPolygonValue.create = function() {
		var polygon = new oFF.XPolygonValue();
		polygon.setup();
		return polygon;
	};
	oFF.XPolygonValue.createWithWkt = function(wkt) {
		var polygon;
		var openingParenthesis;
		var closingParenthesis;
		var stringCoordinates;
		var stringCircuits;
		var circuitIterator;
		var isHull;
		var stringCircuit;
		var hole;
		var indexOf;
		var listCoordinates;
		var pointIterator;
		var pointString;
		var pointCoordinates;
		var point;
		if (!oFF.XString.startsWith(wkt, oFF.XPolygonValue.WKT_START)) {
			return null;
		}
		polygon = oFF.XPolygonValue.create();
		openingParenthesis = oFF.XString.indexOf(wkt, "((");
		closingParenthesis = oFF.XString
				.indexOf(wkt, oFF.XPolygonValue.WKT_END);
		stringCoordinates = oFF.XString.substring(wkt, openingParenthesis + 2,
				closingParenthesis);
		stringCircuits = oFF.XStringTokenizer.splitString(stringCoordinates,
				")");
		circuitIterator = stringCircuits.getIterator();
		isHull = true;
		while (circuitIterator.hasNext()) {
			stringCircuit = circuitIterator.next();
			hole = null;
			if (!isHull) {
				hole = oFF.XList.create();
			}
			indexOf = oFF.XString.indexOf(stringCircuit, "(");
			if (indexOf > 0) {
				stringCircuit = oFF.XString.substring(stringCircuit,
						indexOf + 1, oFF.XString.size(stringCircuit));
			}
			if (oFF.XString.indexOf(stringCircuit, ", ") !== -1) {
				listCoordinates = oFF.XStringTokenizer.splitString(
						stringCircuit, ", ");
			} else {
				listCoordinates = oFF.XStringTokenizer.splitString(
						stringCircuit, ",");
			}
			pointIterator = listCoordinates.getIterator();
			while (pointIterator.hasNext()) {
				pointString = pointIterator.next();
				pointCoordinates = oFF.XStringTokenizer.splitString(oFF.XString
						.trim(pointString), " ");
				point = oFF.XPointValue.create();
				point.setXPosition(oFF.XDouble
						.convertFromString(pointCoordinates.get(0)));
				point.setYPosition(oFF.XDouble
						.convertFromString(pointCoordinates.get(1)));
				if (isHull) {
					polygon.getHull().add(point);
				} else {
					hole.add(point);
				}
			}
			if (!isHull) {
				polygon.getHoles().add(hole);
			}
			isHull = false;
		}
		return polygon;
	};
	oFF.XPolygonValue.areCircuitsEqual = function(circuit1, circuit2) {
		var pointIdx;
		if (circuit1.size() !== circuit2.size()) {
			return false;
		}
		for (pointIdx = 0; pointIdx < circuit1.size(); pointIdx++) {
			if (!circuit1.get(pointIdx).isEqualTo(circuit2.get(pointIdx))) {
				return false;
			}
		}
		return true;
	};
	oFF.XPolygonValue.circuitToString = function(circuit) {
		var sb = oFF.XStringBuffer.create();
		var i;
		sb.append("(");
		for (i = 0; i < circuit.size(); i++) {
			if (i > 0) {
				sb.append(", ");
			}
			sb.append(circuit.get(i).toString());
		}
		sb.append(")");
		return sb.toString();
	};
	oFF.XPolygonValue.prototype.m_hull = null;
	oFF.XPolygonValue.prototype.m_holes = null;
	oFF.XPolygonValue.prototype.releaseObject = function() {
		this.m_holes = oFF.XObjectExt.release(this.m_holes);
		this.m_hull = oFF.XObjectExt.release(this.m_hull);
		oFF.AbstractGeometry.prototype.releaseObject.call(this);
	};
	oFF.XPolygonValue.prototype.setup = function() {
		this.m_hull = oFF.XList.create();
		this.m_holes = oFF.XList.create();
	};
	oFF.XPolygonValue.prototype.getPoints = function() {
		return this.m_hull;
	};
	oFF.XPolygonValue.prototype.getHull = function() {
		return this.m_hull;
	};
	oFF.XPolygonValue.prototype.resetValue = function(value) {
		var valuePolygon;
		oFF.AbstractGeometry.prototype.resetValue.call(this, value);
		if (this === value) {
			return;
		}
		valuePolygon = value;
		this.m_hull.clear();
		this.m_hull.addAll(valuePolygon.getPoints());
		this.m_holes.clear();
		this.m_holes.addAll(valuePolygon.getHoles());
	};
	oFF.XPolygonValue.prototype.isEqualTo = function(other) {
		var xOther;
		var holeIdx;
		var currentHole;
		var otherHole;
		if (!oFF.AbstractGeometry.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		xOther = other;
		if (!oFF.XPolygonValue.areCircuitsEqual(this.getPoints(), xOther
				.getPoints())) {
			return false;
		}
		for (holeIdx = 0; holeIdx < this.getHoles().size(); holeIdx++) {
			currentHole = this.getHoles().get(holeIdx);
			otherHole = xOther.getHoles().get(holeIdx);
			if (!oFF.XPolygonValue.areCircuitsEqual(currentHole, otherHole)) {
				return false;
			}
		}
		return true;
	};
	oFF.XPolygonValue.prototype.clone = function() {
		var clone = oFF.XPolygonValue.create();
		clone.getHull().addAll(this.m_hull);
		clone.getHoles().addAll(this.m_holes);
		clone.setSrid(this.getSrid());
		return clone;
	};
	oFF.XPolygonValue.prototype.toWKT = function() {
		return oFF.XStringUtils.concatenate3(oFF.XPolygonValue.WKT_START, " ",
				this.toString());
	};
	oFF.XPolygonValue.prototype.getValueType = function() {
		return oFF.XValueType.POLYGON;
	};
	oFF.XPolygonValue.prototype.getHoles = function() {
		return this.m_holes;
	};
	oFF.XPolygonValue.prototype.toString = function() {
		var sb = oFF.XStringBuffer.create();
		var circuitIterator;
		sb.append("(").append(oFF.XPolygonValue.circuitToString(this.m_hull));
		circuitIterator = this.m_holes.getIterator();
		while (circuitIterator.hasNext()) {
			sb.append(", ").append(
					oFF.XPolygonValue.circuitToString(circuitIterator.next()));
		}
		sb.append(")");
		return sb.toString();
	};
	oFF.XListWeakRef = function() {
	};
	oFF.XListWeakRef.prototype = new oFF.XAbstractList();
	oFF.XListWeakRef.create = function() {
		var list = new oFF.XListWeakRef();
		list.setup();
		return list;
	};
	oFF.XListWeakRef.prototype.setup = function() {
		this.m_list = oFF.XList.create();
	};
	oFF.XListWeakRef.prototype.add = function(element) {
		this.m_list.add(oFF.XWeakReferenceUtil.getWeakRef(element));
	};
	oFF.XListWeakRef.prototype.addAll = function(elements) {
		oFF.XListUtils.addAllObjects(elements, this);
	};
	oFF.XListWeakRef.prototype.insert = function(index, element) {
		this.m_list.insert(index, oFF.XWeakReferenceUtil.getWeakRef(element));
	};
	oFF.XListWeakRef.prototype.get = function(index) {
		var weakRef = this.m_list.get(index);
		return oFF.XWeakReferenceUtil.getHardRef(weakRef);
	};
	oFF.XListWeakRef.prototype.getIndex = oFF.noSupport;
	oFF.XListWeakRef.prototype.removeAt = function(index) {
		var weakRef = this.m_list.removeAt(index);
		return oFF.XWeakReferenceUtil.getHardRef(weakRef);
	};
	oFF.XListWeakRef.prototype.removeElement = oFF.noSupport;
	oFF.XListWeakRef.prototype.contains = oFF.noSupport;
	oFF.XListWeakRef.prototype.createListCopy = oFF.noSupport;
	oFF.XListWeakRef.prototype.sublist = oFF.noSupport;
	oFF.XListWeakRef.prototype.set = function(index, element) {
		this.m_list.set(index, oFF.XWeakReferenceUtil.getWeakRef(element));
	};
	oFF.XListWeakRef.prototype.getIterator = oFF.noSupport;
	oFF.XListWeakRef.prototype.getValuesAsReadOnlyList = function() {
		return this;
	};
	oFF.XListWeakRef.prototype.sortByComparator = oFF.noSupport;
	oFF.XListWeakRef.prototype.sortByDirection = oFF.noSupport;
	oFF.XListWeakRef.prototype.moveElement = function(fromIndex, toIndex) {
		this.m_list.moveElement(fromIndex, toIndex);
	};
	oFF.XListWeakRef.prototype.createArrayCopy = oFF.noSupport;
	oFF.DfPrProxyElement = function() {
	};
	oFF.DfPrProxyElement.prototype = new oFF.PrElement();
	oFF.DfPrProxyElement.prototype.isProxy = function() {
		return true;
	};
	oFF.DfPrProxyElement.prototype.getKeysAsIteratorOfString = function() {
		return this.getKeysAsReadOnlyListOfString().getIterator();
	};
	oFF.DfPrProxyElement.prototype.isEmpty = function() {
		return this.getKeysAsReadOnlyListOfString().size() === 0;
	};
	oFF.DfPrProxyElement.prototype.hasElements = function() {
		return this.getKeysAsReadOnlyListOfString().size() > 0;
	};
	oFF.DfPrProxyElement.prototype.size = function() {
		return this.getKeysAsReadOnlyListOfString().size();
	};
	oFF.PrDouble = function() {
	};
	oFF.PrDouble.prototype = new oFF.PrElement();
	oFF.PrDouble.create = function() {
		return new oFF.PrDouble();
	};
	oFF.PrDouble.createWithValue = function(value) {
		var proxy = new oFF.PrDouble();
		proxy.m_value = value;
		return proxy;
	};
	oFF.PrDouble.prototype.m_value = 0;
	oFF.PrDouble.prototype.getPermaCopy = function() {
		return oFF.PrDouble.createWithValue(this.m_value);
	};
	oFF.PrDouble.prototype.getType = function() {
		return oFF.PrElementType.DOUBLE;
	};
	oFF.PrDouble.prototype.getInteger = function() {
		return oFF.XDouble.convertToInt(this.m_value);
	};
	oFF.PrDouble.prototype.getLong = function() {
		return oFF.XDouble.convertToLong(this.m_value);
	};
	oFF.PrDouble.prototype.asNumber = function() {
		return this;
	};
	oFF.PrDouble.prototype.asDouble = function() {
		return this;
	};
	oFF.PrDouble.prototype.getDouble = function() {
		return this.m_value;
	};
	oFF.PrDouble.prototype.setDouble = function(value) {
		this.m_value = value;
	};
	oFF.PrDouble.prototype.asString = function() {
		return oFF.PrString.createWithValue(oFF.XDouble
				.convertToString(this.m_value));
	};
	oFF.PrInteger = function() {
	};
	oFF.PrInteger.prototype = new oFF.PrElement();
	oFF.PrInteger.create = function() {
		return new oFF.PrInteger();
	};
	oFF.PrInteger.createWithValue = function(value) {
		var proxy = new oFF.PrInteger();
		proxy.m_value = value;
		return proxy;
	};
	oFF.PrInteger.prototype.m_value = 0;
	oFF.PrInteger.prototype.getPermaCopy = function() {
		return oFF.PrInteger.createWithValue(this.m_value);
	};
	oFF.PrInteger.prototype.getType = function() {
		return oFF.PrElementType.INTEGER;
	};
	oFF.PrInteger.prototype.getInteger = function() {
		return this.m_value;
	};
	oFF.PrInteger.prototype.setInteger = function(value) {
		this.m_value = value;
	};
	oFF.PrInteger.prototype.getLong = function() {
		return this.m_value;
	};
	oFF.PrInteger.prototype.asNumber = function() {
		return this;
	};
	oFF.PrInteger.prototype.asInteger = function() {
		return this;
	};
	oFF.PrInteger.prototype.getDouble = function() {
		return this.m_value;
	};
	oFF.PrInteger.prototype.asString = function() {
		return oFF.PrString.createWithValue(oFF.XInteger
				.convertToString(this.m_value));
	};
	oFF.PrList = function() {
	};
	oFF.PrList.prototype = new oFF.PrElement();
	oFF.PrList.create = function() {
		var list = new oFF.PrList();
		list.setup();
		return list;
	};
	oFF.PrList.createDeepCopy = function(origin) {
		return oFF.PrUtils.createDeepCopyExt(origin, null);
	};
	oFF.PrList.prototype.m_list = null;
	oFF.PrList.prototype.setup = function() {
		this.m_list = oFF.XList.create();
	};
	oFF.PrList.prototype.releaseObject = function() {
		this.m_list = oFF.XObjectExt.release(this.m_list);
		oFF.PrElement.prototype.releaseObject.call(this);
	};
	oFF.PrList.prototype.getType = function() {
		return oFF.PrElementType.LIST;
	};
	oFF.PrList.prototype.getStructureAt = function(index) {
		var element = this.m_list.get(index);
		if (oFF.isNull(element) || !element.isStructure()) {
			return null;
		}
		return element;
	};
	oFF.PrList.prototype.getListAt = function(index) {
		var element = this.m_list.get(index);
		if (oFF.isNull(element) || !element.isList()) {
			return null;
		}
		return element;
	};
	oFF.PrList.prototype.get = function(index) {
		var element = this.m_list.get(index);
		if (oFF.notNull(element)
				&& element.getType() === oFF.PrElementType.THE_NULL) {
			return null;
		}
		return element;
	};
	oFF.PrList.prototype.getStringAt = function(index) {
		var element = this.m_list.get(index);
		if (oFF.isNull(element) || !element.isString()) {
			return null;
		}
		return element.getString();
	};
	oFF.PrList.prototype.getIntegerAt = function(index) {
		var element = this.m_list.get(index);
		if (oFF.isNull(element) || !element.isNumeric()) {
			return 0;
		}
		return element.getInteger();
	};
	oFF.PrList.prototype.getDoubleAt = function(index) {
		var element = this.m_list.get(index);
		if (oFF.isNull(element) || !element.isNumeric()) {
			return 0;
		}
		return element.getDouble();
	};
	oFF.PrList.prototype.getLongAt = function(index) {
		var element = this.m_list.get(index);
		if (oFF.isNull(element) || !element.isNumeric()) {
			return 0;
		}
		return element.getLong();
	};
	oFF.PrList.prototype.getElementTypeAt = function(index) {
		var element = this.m_list.get(index);
		return oFF.isNull(element) ? oFF.PrElementType.THE_NULL : element
				.getType();
	};
	oFF.PrList.prototype.addAll = function(elements) {
		this.m_list.addAll(elements);
	};
	oFF.PrList.prototype.addBoolean = function(booleanValue) {
		this.m_list.add(oFF.PrBoolean.createWithValue(booleanValue));
	};
	oFF.PrList.prototype.setBooleanAt = function(index, booleanValue) {
		this.m_list.set(index, oFF.PrBoolean.createWithValue(booleanValue));
	};
	oFF.PrList.prototype.addNull = function() {
		this.m_list.add(null);
	};
	oFF.PrList.prototype.setNullAt = function(index) {
		this.m_list.set(index, null);
	};
	oFF.PrList.prototype.addString = function(stringValue) {
		this.m_list.add(oFF.PrString.createWithValue(stringValue));
	};
	oFF.PrList.prototype.setStringAt = function(index, stringValue) {
		this.m_list.set(index, oFF.PrString.createWithValue(stringValue));
	};
	oFF.PrList.prototype.addInteger = function(intValue) {
		this.m_list.add(oFF.PrInteger.createWithValue(intValue));
	};
	oFF.PrList.prototype.setIntegerAt = function(index, intValue) {
		this.m_list.set(index, oFF.PrInteger.createWithValue(intValue));
	};
	oFF.PrList.prototype.addLong = function(longValue) {
		this.m_list.add(oFF.PrLong.createWithValue(longValue));
	};
	oFF.PrList.prototype.setLongAt = function(index, longValue) {
		this.m_list.set(index, oFF.PrLong.createWithValue(longValue));
	};
	oFF.PrList.prototype.set = function(index, element) {
		this.m_list.set(index, element);
	};
	oFF.PrList.prototype.addDouble = function(doubleValue) {
		this.m_list.add(oFF.PrDouble.createWithValue(doubleValue));
	};
	oFF.PrList.prototype.setDoubleAt = function(index, doubleValue) {
		this.m_list.set(index, oFF.PrDouble.createWithValue(doubleValue));
	};
	oFF.PrList.prototype.getBooleanAt = function(index) {
		return this.m_list.get(index).getBoolean();
	};
	oFF.PrList.prototype.hasNullAt = function(index) {
		return this.m_list.get(index) === null;
	};
	oFF.PrList.prototype.add = function(element) {
		this.m_list.add(element);
	};
	oFF.PrList.prototype.asList = function() {
		return this;
	};
	oFF.PrList.prototype.size = function() {
		return this.m_list.size();
	};
	oFF.PrList.prototype.isEmpty = function() {
		return this.m_list.isEmpty();
	};
	oFF.PrList.prototype.hasElements = function() {
		return this.m_list.hasElements();
	};
	oFF.PrList.prototype.addNewStructure = function() {
		var structure = oFF.PrStructure.create();
		this.add(structure);
		return structure;
	};
	oFF.PrList.prototype.addNewList = function() {
		var list = oFF.PrList.create();
		this.add(list);
		return list;
	};
	oFF.PrList.prototype.getStringAtExt = function(index, defaultValue) {
		if (this.isIndexValid(index)
				&& this.getElementTypeAt(index) === oFF.PrElementType.STRING) {
			return this.getStringAt(index);
		}
		return defaultValue;
	};
	oFF.PrList.prototype.isIndexValid = function(index) {
		return this.size() > index && index >= 0;
	};
	oFF.PrList.prototype.getIntegerAtExt = function(index, defaultValue) {
		if (this.isIndexValid(index) && this.getElementTypeAt(index).isNumber()) {
			return this.getIntegerAt(index);
		}
		return defaultValue;
	};
	oFF.PrList.prototype.getLongAtExt = function(index, defaultValue) {
		if (this.isIndexValid(index) && this.getElementTypeAt(index).isNumber()) {
			return this.getLongAt(index);
		}
		return defaultValue;
	};
	oFF.PrList.prototype.getDoubleAtExt = function(index, defaultValue) {
		if (this.isIndexValid(index) && this.getElementTypeAt(index).isNumber()) {
			return this.getDoubleAt(index);
		}
		return defaultValue;
	};
	oFF.PrList.prototype.getBooleanAtExt = function(index, defaultValue) {
		if (this.isIndexValid(index)
				&& this.getElementTypeAt(index) === oFF.PrElementType.BOOLEAN) {
			return this.getBooleanAt(index);
		}
		return defaultValue;
	};
	oFF.PrList.prototype.clear = function() {
		this.m_list.clear();
	};
	oFF.PrList.prototype.addAllStrings = function(listToAdd) {
		var size;
		var i;
		if (oFF.notNull(listToAdd)) {
			size = listToAdd.size();
			for (i = 0; i < size; i++) {
				this.addString(listToAdd.get(i));
			}
		}
		return this;
	};
	oFF.PrList.prototype.insert = function(index, element) {
		this.m_list.insert(index, element);
	};
	oFF.PrList.prototype.removeAt = function(index) {
		return this.m_list.removeAt(index);
	};
	oFF.PrList.prototype.removeElement = function(element) {
		return this.m_list.removeElement(element);
	};
	oFF.PrList.prototype.getValuesAsReadOnlyList = function() {
		return this.m_list.getValuesAsReadOnlyList();
	};
	oFF.PrList.prototype.getIterator = function() {
		return this.m_list.getIterator();
	};
	oFF.PrList.prototype.contains = function(element) {
		return this.m_list.contains(element);
	};
	oFF.PrList.prototype.getIndex = function(element) {
		return this.m_list.getIndex(element);
	};
	oFF.PrList.prototype.createArrayCopy = function() {
		return this.m_list.createArrayCopy();
	};
	oFF.PrLong = function() {
	};
	oFF.PrLong.prototype = new oFF.PrElement();
	oFF.PrLong.create = function() {
		return new oFF.PrLong();
	};
	oFF.PrLong.createWithValue = function(value) {
		var newObj = new oFF.PrLong();
		newObj.m_value = value;
		return newObj;
	};
	oFF.PrLong.prototype.m_value = 0;
	oFF.PrLong.prototype.getPermaCopy = function() {
		return oFF.PrLong.createWithValue(this.m_value);
	};
	oFF.PrLong.prototype.getType = function() {
		return oFF.PrElementType.LONG;
	};
	oFF.PrLong.prototype.getInteger = function() {
		return oFF.XInteger.convertFromStringWithDefault(oFF.XLong
				.convertToString(this.m_value), 0);
	};
	oFF.PrLong.prototype.setLong = function(value) {
		this.m_value = value;
	};
	oFF.PrLong.prototype.asNumber = function() {
		return this;
	};
	oFF.PrLong.prototype.getDouble = function() {
		return this.m_value;
	};
	oFF.PrLong.prototype.asLong = function() {
		return this;
	};
	oFF.PrLong.prototype.getLong = function() {
		return this.m_value;
	};
	oFF.PrTemplateList = function() {
	};
	oFF.PrTemplateList.prototype = new oFF.PrElement();
	oFF.PrTemplateList.TEMPLATE_DELETE_NAME = "$delete";
	oFF.PrTemplateList.createListWrapper = function(root, parent, list) {
		var obj = new oFF.PrTemplateList();
		obj.setupListWrapper(root, parent, list, null);
		return obj;
	};
	oFF.PrTemplateList.createListWrapperWithTemplate = function(root, parent,
			list, templateList) {
		var obj = new oFF.PrTemplateList();
		obj.setupListWrapper(root, parent, list, templateList);
		return obj;
	};
	oFF.PrTemplateList.prototype.m_root = null;
	oFF.PrTemplateList.prototype.m_parent = null;
	oFF.PrTemplateList.prototype.m_list = null;
	oFF.PrTemplateList.prototype.m_template = null;
	oFF.PrTemplateList.prototype.m_size = 0;
	oFF.PrTemplateList.prototype.setupListWrapper = function(root, parent,
			list, templateList) {
		var len;
		var i;
		var structure;
		this.m_parent = parent;
		this.m_list = list;
		this.m_root = root;
		this.m_template = templateList;
		if (oFF.isNull(this.m_template)) {
			this.m_size = this.m_list.size();
		} else {
			this.m_size = oFF.XMath.max(this.m_size, this.m_template.size());
			len = this.m_list.size();
			for (i = 0; i < len; i++) {
				structure = this.m_list.getStructureAt(i);
				if (oFF.isNull(structure)) {
					break;
				}
				if (structure.getBooleanByKeyExt(
						oFF.PrTemplateList.TEMPLATE_DELETE_NAME, false)) {
					this.m_size = i;
				}
			}
		}
	};
	oFF.PrTemplateList.prototype.isList = function() {
		return true;
	};
	oFF.PrTemplateList.prototype.getPermaCopy = function() {
		return this.m_list.getPermaCopy();
	};
	oFF.PrTemplateList.prototype.getType = function() {
		return this.m_list.getType();
	};
	oFF.PrTemplateList.prototype.asList = function() {
		return this;
	};
	oFF.PrTemplateList.prototype.getStringRepresentation = function() {
		return this.m_list.getStringRepresentation();
	};
	oFF.PrTemplateList.prototype.getValueType = function() {
		return this.m_list.getValueType();
	};
	oFF.PrTemplateList.prototype.getComponentType = function() {
		return this.m_list.getComponentType();
	};
	oFF.PrTemplateList.prototype.getIntegerAt = function(index) {
		return this.m_list.getIntegerAt(index);
	};
	oFF.PrTemplateList.prototype.getIntegerAtExt = function(index, defaultValue) {
		return this.m_list.getIntegerAtExt(index, defaultValue);
	};
	oFF.PrTemplateList.prototype.getBooleanAt = function(index) {
		return this.m_list.getBooleanAt(index);
	};
	oFF.PrTemplateList.prototype.getBooleanAtExt = function(index, defaultValue) {
		return this.m_list.getBooleanAtExt(index, defaultValue);
	};
	oFF.PrTemplateList.prototype.getDoubleAt = function(index) {
		return this.m_list.getDoubleAt(index);
	};
	oFF.PrTemplateList.prototype.getDoubleAtExt = function(index, defaultValue) {
		return this.m_list.getDoubleAtExt(index, defaultValue);
	};
	oFF.PrTemplateList.prototype.getStringAt = function(index) {
		var result = this.m_list.getStringAt(index);
		return oFF.ReplaceTagHandler.handle(this, result);
	};
	oFF.PrTemplateList.prototype.getStringAtExt = function(index, defaultValue) {
		var result = this.getStringAt(index);
		if (oFF.notNull(result)) {
			return result;
		}
		return defaultValue;
	};
	oFF.PrTemplateList.prototype.getLongAt = function(index) {
		return this.m_list.getLongAt(index);
	};
	oFF.PrTemplateList.prototype.getLongAtExt = function(index, defaultValue) {
		return this.m_list.getLongAtExt(index, defaultValue);
	};
	oFF.PrTemplateList.prototype.addInteger = oFF.noSupport;
	oFF.PrTemplateList.prototype.setIntegerAt = oFF.noSupport;
	oFF.PrTemplateList.prototype.clear = oFF.noSupport;
	oFF.PrTemplateList.prototype.isEmpty = function() {
		return this.m_list.isEmpty();
	};
	oFF.PrTemplateList.prototype.hasElements = function() {
		return this.m_list.hasElements();
	};
	oFF.PrTemplateList.prototype.size = function() {
		return this.m_size;
	};
	oFF.PrTemplateList.prototype.addLong = oFF.noSupport;
	oFF.PrTemplateList.prototype.setLongAt = oFF.noSupport;
	oFF.PrTemplateList.prototype.addBoolean = oFF.noSupport;
	oFF.PrTemplateList.prototype.setBooleanAt = oFF.noSupport;
	oFF.PrTemplateList.prototype.addDouble = oFF.noSupport;
	oFF.PrTemplateList.prototype.setDoubleAt = oFF.noSupport;
	oFF.PrTemplateList.prototype.addString = oFF.noSupport;
	oFF.PrTemplateList.prototype.setStringAt = oFF.noSupport;
	oFF.PrTemplateList.prototype.addNull = oFF.noSupport;
	oFF.PrTemplateList.prototype.setNullAt = oFF.noSupport;
	oFF.PrTemplateList.prototype.hasNullAt = function(index) {
		return this.m_list.hasNullAt(index);
	};
	oFF.PrTemplateList.prototype.addAll = oFF.noSupport;
	oFF.PrTemplateList.prototype.add = oFF.noSupport;
	oFF.PrTemplateList.prototype.get = function(index) {
		return this.m_list.get(index);
	};
	oFF.PrTemplateList.prototype.set = function(index, element) {
		this.m_list.set(index, element);
	};
	oFF.PrTemplateList.prototype.getElementTypeAt = function(index) {
		return this.m_list.getElementTypeAt(index);
	};
	oFF.PrTemplateList.prototype.getListAt = function(index) {
		return this.m_list.getListAt(index);
	};
	oFF.PrTemplateList.prototype.addNewList = oFF.noSupport;
	oFF.PrTemplateList.prototype.getStructureAt = function(index) {
		var isOriginalAvailable;
		var isTemplateAvailable;
		var original;
		var templateStruct;
		if (index >= this.m_size) {
			throw oFF.XException
					.createIllegalArgumentException("Index out of range");
		}
		isOriginalAvailable = index < this.m_list.size();
		isTemplateAvailable = oFF.notNull(this.m_template)
				&& index < this.m_template.size();
		if (isOriginalAvailable && isTemplateAvailable) {
			original = this.m_list.getStructureAt(index);
			templateStruct = oFF.PrTemplateStructure
					.createStructureWrapper(this.m_root, this, this.m_template
							.get(index).asStructure());
			return oFF.PrTemplateStructure.createStructureWrapperWithTemplate(
					this.m_root, this, original, templateStruct);
		}
		if (isTemplateAvailable) {
			return oFF.PrTemplateStructure.createStructureWrapper(this.m_root,
					this, this.m_template.get(index).asStructure());
		}
		if (isOriginalAvailable) {
			return oFF.PrTemplateStructure.createStructureWrapper(this.m_root,
					this, this.m_list.getStructureAt(index));
		}
		return null;
	};
	oFF.PrTemplateList.prototype.addNewStructure = oFF.noSupport;
	oFF.PrTemplateList.prototype.getParent = function() {
		return this.m_parent;
	};
	oFF.PrTemplateList.prototype.setParent = function(parent) {
		this.m_parent = parent;
	};
	oFF.PrTemplateList.prototype.addAllStrings = oFF.noSupport;
	oFF.PrTemplateList.prototype.toString = function() {
		return this.m_list.toString();
	};
	oFF.PrTemplateList.prototype.releaseObject = function() {
		this.m_list = oFF.XObjectExt.release(this.m_list);
		this.m_template = oFF.XObjectExt.release(this.m_template);
		this.m_parent = null;
		this.m_root = null;
		oFF.PrElement.prototype.releaseObject.call(this);
	};
	oFF.PrTemplateList.prototype.insert = oFF.noSupport;
	oFF.PrTemplateList.prototype.removeAt = oFF.noSupport;
	oFF.PrTemplateList.prototype.removeElement = oFF.noSupport;
	oFF.PrTemplateList.prototype.getValuesAsReadOnlyList = function() {
		return this.m_list.getValuesAsReadOnlyList();
	};
	oFF.PrTemplateList.prototype.getIterator = function() {
		return this.m_list.getIterator();
	};
	oFF.PrTemplateList.prototype.contains = function(element) {
		return this.m_list.contains(element);
	};
	oFF.PrTemplateList.prototype.getIndex = function(element) {
		return this.m_list.getIndex(element);
	};
	oFF.PrTemplateList.prototype.createArrayCopy = function() {
		return this.m_list.createArrayCopy();
	};
	oFF.XLineStringValue = function() {
	};
	oFF.XLineStringValue.prototype = new oFF.AbstractMultiGeometry();
	oFF.XLineStringValue.WKT_KEY = "LINESTRING";
	oFF.XLineStringValue.create = function() {
		var linestring = new oFF.XLineStringValue();
		linestring.setup();
		return linestring;
	};
	oFF.XLineStringValue.createWithWkt = function(wkt) {
		var newObj;
		var openingParenthesis;
		var stringPoints;
		var points;
		var i;
		var currentPoint;
		var singlePoint;
		var xPos;
		var yPos;
		if (oFF.XString.indexOf(wkt, oFF.XLineStringValue.WKT_KEY) === -1
				|| oFF.XString.startsWith(wkt, "MULTILINESTRING")) {
			return null;
		}
		newObj = oFF.XLineStringValue.create();
		openingParenthesis = oFF.XString.indexOf(wkt, "(");
		stringPoints = oFF.XString.substring(wkt, openingParenthesis + 1,
				oFF.XString.size(wkt) - 1);
		points = oFF.XStringTokenizer.splitString(stringPoints, ",");
		for (i = 0; i < points.size(); i++) {
			currentPoint = oFF.XString.trim(points.get(i));
			singlePoint = oFF.XStringTokenizer.splitString(currentPoint, " ");
			if (singlePoint.size() === 2) {
				xPos = oFF.XDouble.convertFromString(singlePoint.get(0));
				yPos = oFF.XDouble.convertFromString(singlePoint.get(1));
				newObj.createAndAddPoint(xPos, yPos);
			}
		}
		return newObj;
	};
	oFF.XLineStringValue.createWithPoints = function(points) {
		var newObj = new oFF.XLineStringValue();
		newObj.m_list = points;
		return newObj;
	};
	oFF.XLineStringValue.prototype.toWKT = function() {
		var wkt = oFF.XStringBuffer.create();
		wkt.append(oFF.XLineStringValue.WKT_KEY).append(" ");
		if (this.m_list.isEmpty()) {
			wkt.append(oFF.AbstractGeometry.WKT_EMTPY);
		} else {
			wkt.append("(").append(this.toString()).append(")");
		}
		return wkt.toString();
	};
	oFF.XLineStringValue.prototype.resetValue = function(value) {
		oFF.AbstractMultiGeometry.prototype.resetValue.call(this, value);
		if (this !== value) {
			this.resetValueInternal(value);
		}
	};
	oFF.XLineStringValue.prototype.clone = function() {
		var clone = oFF.XLineStringValue.create();
		this.cloneInternal(clone);
		return clone;
	};
	oFF.XLineStringValue.prototype.getValueType = function() {
		return oFF.XValueType.LINE_STRING;
	};
	oFF.XLineStringValue.prototype.createAndAddPoint = function(posX, posY) {
		this.m_list.add(oFF.XPointValue.createWithPosition(posX, posY));
	};
	oFF.XLineStringValue.prototype.isEqualTo = function(other) {
		var xOther;
		if (!oFF.AbstractMultiGeometry.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		xOther = other;
		return this.getValuesAsReadOnlyList().isEqualTo(
				xOther.getValuesAsReadOnlyList());
	};
	oFF.XLineStringValue.prototype.isClosed = function() {
		var firstPoint;
		var lastPoint;
		if (this.m_list.isEmpty()) {
			return false;
		}
		if (this.isValid()) {
			firstPoint = this.getStartPoint();
			lastPoint = this.getEndPoint();
			return oFF.XString.isEqual(firstPoint.toWKT(), lastPoint.toWKT());
		}
		return false;
	};
	oFF.XLineStringValue.prototype.getEndPoint = function() {
		if (this.m_list.isEmpty()) {
			return null;
		}
		return this.m_list.get(this.m_list.size() - 1);
	};
	oFF.XLineStringValue.prototype.getStartPoint = function() {
		if (this.m_list.isEmpty()) {
			return null;
		}
		return this.m_list.get(0);
	};
	oFF.XLineStringValue.prototype.isValid = function() {
		return this.m_list.size() >= 2;
	};
	oFF.XMultiLineStringValue = function() {
	};
	oFF.XMultiLineStringValue.prototype = new oFF.AbstractMultiGeometry();
	oFF.XMultiLineStringValue.WKT_KEY = "MULTILINESTRING";
	oFF.XMultiLineStringValue.create = function() {
		var newObj = new oFF.XMultiLineStringValue();
		newObj.setup();
		return newObj;
	};
	oFF.XMultiLineStringValue.createWithWkt = function(wkt) {
		var newObj;
		var openingParenthesis;
		var stringPoints;
		var lineStrings;
		var i;
		var currentLineString;
		var currentLineStringPoints;
		var newLineString;
		var n;
		var currentPoint;
		var singlePoint;
		var xPos;
		var yPos;
		if (oFF.XString.indexOf(wkt, oFF.XMultiLineStringValue.WKT_KEY) === -1) {
			return null;
		}
		newObj = oFF.XMultiLineStringValue.create();
		openingParenthesis = oFF.XString.indexOf(wkt, "((");
		stringPoints = oFF.XString.substring(wkt, openingParenthesis + 1,
				oFF.XString.size(wkt) - 1);
		lineStrings = oFF.XStringTokenizer.splitString(stringPoints, "),");
		for (i = 0; i < lineStrings.size(); i++) {
			currentLineString = oFF.XString.trim(lineStrings.get(i));
			currentLineString = oFF.XString.replace(currentLineString, "(", "");
			currentLineString = oFF.XString.replace(currentLineString, ")", "");
			currentLineStringPoints = oFF.XStringTokenizer.splitString(
					currentLineString, ",");
			if (oFF.notNull(currentLineStringPoints)) {
				if (currentLineStringPoints.size() > 0) {
					newLineString = oFF.XLineStringValue.create();
					for (n = 0; n < currentLineStringPoints.size(); n++) {
						currentPoint = oFF.XString.trim(currentLineStringPoints
								.get(n));
						singlePoint = oFF.XStringTokenizer.splitString(
								currentPoint, " ");
						if (singlePoint.size() === 2) {
							xPos = oFF.XDouble.convertFromString(singlePoint
									.get(0));
							yPos = oFF.XDouble.convertFromString(singlePoint
									.get(1));
							newLineString.createAndAddPoint(xPos, yPos);
						}
					}
					newObj.add(newLineString);
				}
			}
		}
		return newObj;
	};
	oFF.XMultiLineStringValue.createWithLineStrings = function(lineStrings) {
		var newObj = new oFF.XMultiLineStringValue();
		newObj.m_list = lineStrings;
		return newObj;
	};
	oFF.XMultiLineStringValue.prototype.toWKT = function() {
		var wkt = oFF.XStringBuffer.create();
		wkt.append(oFF.XMultiLineStringValue.WKT_KEY).append(" ");
		if (this.isEmpty()) {
			wkt.append(oFF.AbstractGeometry.WKT_EMTPY);
		} else {
			wkt.append("(").append(this.toString()).append(")");
		}
		return wkt.toString();
	};
	oFF.XMultiLineStringValue.prototype.isEqualTo = function(other) {
		var xOther;
		if (!oFF.AbstractMultiGeometry.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		xOther = other;
		return this.getValuesAsReadOnlyList().isEqualTo(
				xOther.getValuesAsReadOnlyList());
	};
	oFF.XMultiLineStringValue.prototype.resetValue = function(value) {
		oFF.AbstractMultiGeometry.prototype.resetValue.call(this, value);
		if (this !== value) {
			this.resetValueInternal(value);
		}
	};
	oFF.XMultiLineStringValue.prototype.clone = function() {
		var clone = oFF.XMultiLineStringValue.create();
		this.cloneInternal(clone);
		return clone;
	};
	oFF.XMultiLineStringValue.prototype.getValueType = function() {
		return oFF.XValueType.MULTI_LINE_STRING;
	};
	oFF.XMultiLineStringValue.prototype.createAndAddLineStringWithWKT = function(
			lineStringWkt) {
		var newLineString = oFF.XLineStringValue.createWithWkt(lineStringWkt);
		this.m_list.add(newLineString);
	};
	oFF.XMultiLineStringValue.prototype.toString = function() {
		var returnString = oFF.XStringBuffer.create();
		var i;
		var currentLineString;
		for (i = 0; i < this.m_list.size(); i++) {
			currentLineString = this.m_list.get(i);
			returnString.append("(").append(currentLineString.toString())
					.append(")");
			if (i + 1 < this.m_list.size()) {
				returnString.append(",");
			}
		}
		return returnString.toString();
	};
	oFF.XMultiPointValue = function() {
	};
	oFF.XMultiPointValue.prototype = new oFF.AbstractMultiGeometry();
	oFF.XMultiPointValue.WKT_START = "MULTIPOINT";
	oFF.XMultiPointValue.WKT_POINT = "POINT";
	oFF.XMultiPointValue.create = function() {
		var multiPoint = new oFF.XMultiPointValue();
		multiPoint.setup();
		return multiPoint;
	};
	oFF.XMultiPointValue.createWithWkt = function(wkt) {
		var multiPoint;
		var indexOf;
		var stringPoints;
		var splitString;
		var iterator;
		var stringPoint;
		var aPoint;
		if (oFF.XString.indexOf(wkt, oFF.XMultiPointValue.WKT_START) === -1) {
			return null;
		}
		multiPoint = oFF.XMultiPointValue.create();
		indexOf = oFF.XString.indexOf(wkt, "(");
		stringPoints = oFF.XString.substring(wkt, indexOf + 1, oFF.XString
				.size(wkt) - 1);
		splitString = oFF.XStringTokenizer.splitString(stringPoints, ",");
		iterator = splitString.getIterator();
		while (iterator.hasNext()) {
			stringPoint = iterator.next();
			if (!oFF.XString.containsString(stringPoints, "(")) {
				stringPoint = oFF.XStringUtils.concatenate2("(", stringPoint);
			}
			if (!oFF.XString.containsString(stringPoints, ")")) {
				stringPoint = oFF.XStringUtils.concatenate2(stringPoint, ")");
			}
			aPoint = oFF.XStringUtils.concatenate2(
					oFF.XMultiPointValue.WKT_POINT, stringPoint);
			multiPoint.add(oFF.XPointValue.createWithWkt(aPoint));
		}
		return multiPoint;
	};
	oFF.XMultiPointValue.prototype.getValueType = function() {
		return oFF.XValueType.MULTI_POINT;
	};
	oFF.XMultiPointValue.prototype.resetValue = function(value) {
		oFF.AbstractMultiGeometry.prototype.resetValue.call(this, value);
		if (this !== value) {
			this.resetValueInternal(value);
		}
	};
	oFF.XMultiPointValue.prototype.isEqualTo = function(other) {
		var xOther;
		var pointIdx;
		if (!oFF.AbstractMultiGeometry.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		xOther = other;
		if (this.m_list.size() !== xOther.size()) {
			return false;
		}
		for (pointIdx = 0; pointIdx < this.m_list.size(); pointIdx++) {
			if (!this.m_list.get(pointIdx).isEqualTo(xOther.get(pointIdx))) {
				return false;
			}
		}
		return true;
	};
	oFF.XMultiPointValue.prototype.clone = function() {
		var clone = oFF.XMultiPointValue.create();
		this.cloneInternal(clone);
		return clone;
	};
	oFF.XMultiPointValue.prototype.toWKT = function() {
		return oFF.XStringUtils.concatenate4(oFF.XMultiPointValue.WKT_START,
				" (", this.toString(), ")");
	};
	oFF.XMultiPolygonValue = function() {
	};
	oFF.XMultiPolygonValue.prototype = new oFF.AbstractMultiGeometry();
	oFF.XMultiPolygonValue.WKT_START = "MULTIPOLYGON";
	oFF.XMultiPolygonValue.WKT_POLY_START = "POLYGON ";
	oFF.XMultiPolygonValue.create = function() {
		var multiPolygon = new oFF.XMultiPolygonValue();
		multiPolygon.setup();
		return multiPolygon;
	};
	oFF.XMultiPolygonValue.createWithWkt = function(wkt) {
		var multiPolygon;
		var openingParenthesis;
		var stringPolygons;
		var polygons;
		var polyIterator;
		var buffer;
		var polygon;
		if (oFF.XString.indexOf(wkt, oFF.XMultiPolygonValue.WKT_START) === -1) {
			return null;
		}
		multiPolygon = oFF.XMultiPolygonValue.create();
		openingParenthesis = oFF.XString.indexOf(wkt, "(((");
		stringPolygons = oFF.XString.substring(wkt, openingParenthesis + 1,
				oFF.XString.size(wkt) - 1);
		polygons = oFF.XStringTokenizer.splitString(stringPolygons, ")),");
		polyIterator = polygons.getIterator();
		while (polyIterator.hasNext()) {
			buffer = oFF.XStringBuffer.create();
			buffer.append(oFF.XMultiPolygonValue.WKT_POLY_START).append(
					polyIterator.next()).append("))");
			polygon = oFF.XPolygonValue.createWithWkt(buffer.toString());
			multiPolygon.add(polygon);
		}
		return multiPolygon;
	};
	oFF.XMultiPolygonValue.prototype.clone = function() {
		var clone = oFF.XMultiPolygonValue.create();
		this.cloneInternal(clone);
		return clone;
	};
	oFF.XMultiPolygonValue.prototype.resetValue = function(value) {
		oFF.AbstractMultiGeometry.prototype.resetValue.call(this, value);
		if (this === value) {
			return;
		}
		this.resetValueInternal(value);
	};
	oFF.XMultiPolygonValue.prototype.isEqualTo = function(other) {
		var xOther;
		var polyIdx;
		if (!oFF.AbstractMultiGeometry.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		xOther = other;
		if (this.m_list.size() !== xOther.size()) {
			return false;
		}
		for (polyIdx = 0; polyIdx < this.m_list.size(); polyIdx++) {
			if (!this.m_list.get(polyIdx).isEqualTo(xOther.get(polyIdx))) {
				return false;
			}
		}
		return true;
	};
	oFF.XMultiPolygonValue.prototype.toWKT = function() {
		return oFF.XStringUtils.concatenate3(oFF.XMultiPolygonValue.WKT_START,
				" ", this.toString());
	};
	oFF.XMultiPolygonValue.prototype.getValueType = function() {
		return oFF.XValueType.MULTI_POLYGON;
	};
	oFF.XMultiPolygonValue.prototype.add = function(element) {
		this.m_list.add(element);
	};
	oFF.XMultiPolygonValue.prototype.insert = function(index, element) {
		this.m_list.insert(index, element);
	};
	oFF.XMultiPolygonValue.prototype.removeAt = function(index) {
		return this.m_list.removeAt(index);
	};
	oFF.XMultiPolygonValue.prototype.removeElement = function(element) {
		this.m_list.removeElement(element);
		return element;
	};
	oFF.XMultiPolygonValue.prototype.clear = function() {
		this.m_list.clear();
	};
	oFF.XMultiPolygonValue.prototype.set = function(index, element) {
		this.m_list.set(index, element);
	};
	oFF.XMultiPolygonValue.prototype.toString = function() {
		return oFF.XStringUtils.concatenate3("(",
				oFF.AbstractMultiGeometry.prototype.toString.call(this), ")");
	};
	oFF.XLinkedMap = function() {
	};
	oFF.XLinkedMap.prototype = new oFF.XAbstractList();
	oFF.XLinkedMap.create = function() {
		var list = new oFF.XLinkedMap();
		list.setup();
		return list;
	};
	oFF.XLinkedMap.prototype.m_map = null;
	oFF.XLinkedMap.prototype.setup = function() {
		this.m_map = oFF.XWeakMap.create();
		this.m_list = oFF.XList.create();
	};
	oFF.XLinkedMap.prototype.releaseObject = function() {
		this.m_map = oFF.XObjectExt.release(this.m_map);
		oFF.XAbstractList.prototype.releaseObject.call(this);
	};
	oFF.XLinkedMap.prototype.containsKey = function(key) {
		return this.m_map.containsKey(key);
	};
	oFF.XLinkedMap.prototype.getByKey = function(key) {
		return this.m_map.getByKey(key);
	};
	oFF.XLinkedMap.prototype.getKeysAsReadOnlyListOfString = function() {
		var keys = oFF.XListOfString.create();
		var size = this.m_list.size();
		var i;
		for (i = 0; i < size; i++) {
			keys.add(this.m_list.get(i).getName());
		}
		return keys;
	};
	oFF.XLinkedMap.prototype.getValuesAsReadOnlyList = function() {
		return this.m_list.getValuesAsReadOnlyList();
	};
	oFF.XLinkedMap.prototype.getKeysAsIteratorOfString = function() {
		return this.getKeysAsReadOnlyListOfString().getIterator();
	};
	oFF.XLinkedMap.prototype.getIterator = function() {
		return this.m_list.getIterator();
	};
	oFF.XLinkedMap.prototype._getName = function(element) {
		return oFF.isNull(element) ? null : element.getName();
	};
	oFF.XLinkedMap.prototype._getIndexByName = function(name) {
		if (this.m_map.containsKey(name)) {
			return oFF.XCollectionUtils.getIndexByName(this.m_list, name);
		}
		return -1;
	};
	oFF.XLinkedMap.prototype.add = function(element) {
		var name = this._getName(element);
		var oldPosition;
		if (oFF.notNull(name)) {
			oldPosition = this._getIndexByName(name);
			if (oldPosition !== -1) {
				this.m_list.removeAt(oldPosition);
			}
			this.m_list.add(element);
			this.m_map.put(name, element);
		}
	};
	oFF.XLinkedMap.prototype.addAll = function(elements) {
		oFF.XListUtils.addAllObjects(elements, this);
	};
	oFF.XLinkedMap.prototype.insert = function(index, element) {
		var name = this._getName(element);
		var oldPosition;
		var listSize;
		if (oFF.notNull(name)) {
			oldPosition = this._getIndexByName(name);
			if (oldPosition !== -1) {
				this.m_list.removeAt(oldPosition);
			}
			listSize = this.m_list.size();
			if (index >= listSize && oldPosition !== -1) {
				this.m_list.insert(listSize, element);
			} else {
				this.m_list.insert(index, element);
			}
			this.m_map.put(name, element);
		}
	};
	oFF.XLinkedMap.prototype.set = function(index, element) {
		var name = this._getName(element);
		var oldPosition;
		if (oFF.notNull(name)) {
			oldPosition = this._getIndexByName(name);
			this.m_list.set(index, element);
			if (oldPosition !== -1 && oldPosition !== index) {
				this.m_list.removeAt(oldPosition);
			}
			this.m_map.put(name, element);
		}
	};
	oFF.XLinkedMap.prototype.removeAt = function(index) {
		var removed = this.m_list.get(index);
		var objAtIndex = this.m_list.removeAt(index);
		this.m_map.remove(removed.getName());
		return objAtIndex;
	};
	oFF.XLinkedMap.prototype.removeElement = function(element) {
		var name = this._getName(element);
		if (oFF.notNull(name)) {
			this.m_list.removeElement(element);
			this.m_map.remove(name);
		}
		return element;
	};
	oFF.XLinkedMap.prototype.moveElement = function(fromIndex, toIndex) {
		this.m_list.moveElement(fromIndex, toIndex);
	};
	oFF.XLinkedMap.prototype.get = function(index) {
		return this.m_list.get(index);
	};
	oFF.XLinkedMap.prototype.getIndex = function(element) {
		return this.m_list.getIndex(element);
	};
	oFF.XLinkedMap.prototype.clear = function() {
		this.m_list.clear();
		this.m_map.clear();
	};
	oFF.XLinkedMap.prototype.sortByComparator = function(comparator) {
		this.m_list.sortByComparator(comparator);
	};
	oFF.XLinkedMap.prototype.sortByDirection = function(sortDirection) {
		this.m_list.sortByDirection(sortDirection);
	};
	oFF.XLinkedMap.prototype.createListCopy = function() {
		return this.m_list.createListCopy();
	};
	oFF.XLinkedMap.prototype.sublist = function(beginIndex, endIndex) {
		return this.m_list.sublist(beginIndex, endIndex);
	};
	oFF.XLinkedMap.prototype.contains = function(element) {
		return this.m_list.contains(element);
	};
	oFF.XLinkedMap.prototype.createArrayCopy = function() {
		return this.m_list.createArrayCopy();
	};
	oFF.XListOfNameObject = function() {
	};
	oFF.XListOfNameObject.prototype = new oFF.XAbstractList();
	oFF.XListOfNameObject.create = function() {
		var list = new oFF.XListOfNameObject();
		list.setup();
		return list;
	};
	oFF.XListOfNameObject.prototype.m_map = null;
	oFF.XListOfNameObject.prototype.setup = function() {
		this.m_map = oFF.XWeakMap.create();
		this.m_list = oFF.XList.create();
	};
	oFF.XListOfNameObject.prototype.releaseObject = function() {
		this.m_map = oFF.XObjectExt.release(this.m_map);
		oFF.XAbstractList.prototype.releaseObject.call(this);
	};
	oFF.XListOfNameObject.prototype.containsKey = function(key) {
		return this.m_map.containsKey(key);
	};
	oFF.XListOfNameObject.prototype.getByKey = function(key) {
		return this.m_map.getByKey(key);
	};
	oFF.XListOfNameObject.prototype.getKeysAsReadOnlyListOfString = function() {
		var result = oFF.XListOfString.create();
		var size = this.m_list.size();
		var i;
		var name;
		for (i = 0; i < size; i++) {
			name = this.m_list.get(i).getName();
			if (oFF.notNull(name)) {
				result.add(name);
			}
		}
		return result;
	};
	oFF.XListOfNameObject.prototype.getValuesAsReadOnlyList = function() {
		return this.m_list.getValuesAsReadOnlyList();
	};
	oFF.XListOfNameObject.prototype.getKeysAsIteratorOfString = function() {
		return this.m_map.getKeysAsIteratorOfString();
	};
	oFF.XListOfNameObject.prototype.getIterator = function() {
		return this.m_list.getIterator();
	};
	oFF.XListOfNameObject.prototype._putNameNotNull = function(element) {
		var name = element.getName();
		if (oFF.notNull(name)) {
			this.m_map.put(name, element);
		}
	};
	oFF.XListOfNameObject.prototype._removeNameNotNull = function(element) {
		var name = element.getName();
		if (oFF.notNull(name)) {
			this.m_map.remove(name);
		}
	};
	oFF.XListOfNameObject.prototype.add = function(element) {
		if (oFF.notNull(element)) {
			this.m_list.add(element);
			this._putNameNotNull(element);
		}
	};
	oFF.XListOfNameObject.prototype.addAll = function(elements) {
		oFF.XListUtils.addAllObjects(elements, this);
	};
	oFF.XListOfNameObject.prototype.insert = function(index, element) {
		if (oFF.notNull(element)) {
			this.m_list.insert(index, element);
			this._putNameNotNull(element);
		}
	};
	oFF.XListOfNameObject.prototype.set = function(index, element) {
		if (oFF.notNull(element)) {
			this.m_list.set(index, element);
			this._putNameNotNull(element);
		}
	};
	oFF.XListOfNameObject.prototype.removeAt = function(index) {
		var removed = this.m_list.get(index);
		var objAtIndex = this.m_list.removeAt(index);
		this._removeNameNotNull(removed);
		return objAtIndex;
	};
	oFF.XListOfNameObject.prototype.removeElement = function(element) {
		if (oFF.notNull(element)) {
			this.m_list.removeElement(element);
			this._removeNameNotNull(element);
		}
		return element;
	};
	oFF.XListOfNameObject.prototype.moveElement = function(fromIndex, toIndex) {
		this.m_list.moveElement(fromIndex, toIndex);
	};
	oFF.XListOfNameObject.prototype.get = function(index) {
		return this.m_list.get(index);
	};
	oFF.XListOfNameObject.prototype.getIndex = function(element) {
		return this.m_list.getIndex(element);
	};
	oFF.XListOfNameObject.prototype.clear = function() {
		this.m_list.clear();
		this.m_map.clear();
	};
	oFF.XListOfNameObject.prototype.sortByComparator = function(comparator) {
		this.m_list.sortByComparator(comparator);
	};
	oFF.XListOfNameObject.prototype.sortByDirection = function(sortDirection) {
		this.m_list.sortByDirection(sortDirection);
	};
	oFF.XListOfNameObject.prototype.createListCopy = function() {
		return this.m_list.createListCopy();
	};
	oFF.XListOfNameObject.prototype.sublist = function(beginIndex, endIndex) {
		return this.m_list.sublist(beginIndex, endIndex);
	};
	oFF.XListOfNameObject.prototype.contains = function(element) {
		return this.m_list.contains(element);
	};
	oFF.XListOfNameObject.prototype.createArrayCopy = function() {
		return this.m_list.createArrayCopy();
	};
	oFF.CoreExtModule = function() {
	};
	oFF.CoreExtModule.prototype = new oFF.DfModule();
	oFF.CoreExtModule.s_module = null;
	oFF.CoreExtModule.getInstance = function() {
		return oFF.CoreExtModule.initVersion(oFF.XVersion.API_DEFAULT);
	};
	oFF.CoreExtModule.initVersion = function(version) {
		var timestamp;
		var set;
		var stdio;
		var stdlog;
		var logWriter;
		if (oFF.isNull(oFF.CoreExtModule.s_module)) {
			oFF.DfModule.checkInitialized(oFF.CoreModule.initVersion(version));
			oFF.DfModule.checkInitialized(oFF.PlatformModule
					.initVersion(version));
			timestamp = oFF.DfModule.start("CoreExtModule...");
			oFF.CoreExtModule.s_module = new oFF.CoreExtModule();
			set = oFF.XSetOfNameObject.create();
			oFF.XComponentType.staticSetupComponentType(set);
			oFF.XValueType.staticSetup();
			oFF.UiColor.staticSetup();
			oFF.PrElementType.staticSetup();
			oFF.LifeCycleState.staticSetup();
			oFF.PrFactoryUniversal.staticSetup();
			oFF.XLogBufferNull.staticSetup();
			oFF.JsonParserFactory.staticSetupJsonParserFactory();
			oFF.XmlUtils.staticSetup();
			oFF.OriginLayer.staticSetup(oFF.XHashMapByString.create());
			stdio = oFF.XStdio.getInstance();
			if (oFF.notNull(stdio)) {
				stdlog = stdio.getStdlog();
				if (oFF.notNull(stdlog)) {
					logWriter = oFF.XLogWriter.create(stdlog);
					logWriter.setFilterLevel(0);
					logWriter.enableAllLayers();
					oFF.XLogger.setInstance(logWriter);
				}
			}
			oFF.DfModule.stop(timestamp);
		}
		return oFF.CoreExtModule.s_module;
	};
	oFF.CoreExtModule.getInstance();
})(sap.firefly);