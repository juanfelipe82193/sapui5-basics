var $Global;
if (Object.prototype.toString
		.call(typeof process !== "undefined" ? process : 0) === "[object process]") {
	$Global = module.exports;
} else {
	if (typeof window !== "undefined") {
		$Global = this;
	} else {
		$Global = $Global || {};
	}
}
var sap = sap || {};
if (!sap.firefly) {
	sap["firefly"] = {};
}
var UrlFetchApp = UrlFetchApp || undefined;
if (typeof UrlFetchApp !== "undefined") {
	sap.firefly["GoogleUrlFetchApp"] = UrlFetchApp;
}
$Global.sap = sap;
sap.firefly.isNull = function(o) {
	return o === null || o === undefined;
};
sap.firefly.notNull = function(o) {
	return o !== undefined && o !== null;
};
sap.firefly.noSupport = function() {
	throw new Error("Unsupported Operation Exception");
};
sap.firefly.XObject = function() {
};
sap.firefly.XObject.prototype = {
	_ff_c : "XObject",
	m_isReleased : false,
	setup : function() {
		this.m_isReleased = false;
	},
	releaseObject : function() {
		this.m_isReleased = true;
	},
	destructor : function() {
	},
	isReleaseLocked : function() {
		return false;
	},
	isReleased : function() {
		return this.m_isReleased;
	},
	addOwnership : function() {
	},
	isEqualTo : function(other) {
		return this === other;
	},
	getObjectId : function() {
		return null;
	},
	getClassName : function() {
		return this._ff_c;
	},
	compareTo : sap.firefly.noSupport,
	clone : sap.firefly.noSupport,
	toString : function() {
		return "[???]";
	},
};
sap.firefly.XObject.castFromNative = function(nativeObject) {
	return nativeObject;
};
sap.firefly.XWeakReference = function(reference) {
	this.m_reference = reference;
	this._ff_c = "XWeakReference";
};
sap.firefly.XWeakReference.prototype = new sap.firefly.XObject();
sap.firefly.XWeakReference.create = function(reference) {
	return new sap.firefly.XWeakReference(reference);
};
sap.firefly.XWeakReference.prototype.releaseObject = function() {
	this.m_reference = null;
	sap.firefly.XObject.prototype.releaseObject.call(this);
};
sap.firefly.XWeakReference.prototype.getReference = function() {
	return this.m_reference;
};
sap.firefly.XWeakReference.prototype.toString = function() {
	return this.m_reference && this.m_reference.toString();
};
sap.firefly.XException = {
	createInitializationException : function() {
		return new Error("Initialization Exception");
	},
	createUnsupportedOperationException : sap.firefly.noSupport,
	createRuntimeException : function(message) {
		return new Error("Runtime Exception: " + message);
	},
	createIllegalStateException : function(message) {
		return new Error("Illegal State: " + message);
	},
	createIllegalArgumentException : function(message) {
		return new Error("Illegal Argument: " + message);
	},
	supportsStackTrace : function() {
		return true;
	},
	getStackTrace : function(excp) {
		if (excp.stack === undefined) {
			return excp.m_message
					+ "\r\n(No call stack available; please search source code for exception message)";
		}
		return excp.stack;
	}
};
sap.firefly.XString = {
	isEqual : function(firstValue, secondValue) {
		return firstValue === secondValue;
	},
	getCharAt : function(value, index) {
		return value.charCodeAt(index);
	},
	replace : function(value, searchPattern, replaceValue) {
		return value && value.split(searchPattern).join(replaceValue);
	},
	containsString : function(s1, s2) {
		if (s1 === null && s2 === null) {
			return true;
		}
		if (s1 === null) {
			return false;
		}
		if (s2 === null) {
			return true;
		}
		return s1.indexOf(s2) !== -1;
	},
	startsWith : function(value, startsWithString) {
		return value.indexOf(startsWithString) === 0;
	},
	endsWith : function(value, endsWithString) {
		var lastIndexOf = value.lastIndexOf(endsWithString);
		if (lastIndexOf === -1) {
			return false;
		}
		if (lastIndexOf + endsWithString.length === value.length) {
			return true;
		}
		return false;
	},
	size : function(value) {
		return value.length;
	},
	compare : function(value, compareTo) {
		if (value === compareTo) {
			return 0;
		}
		if (value === null) {
			return -1;
		}
		if (compareTo === null) {
			return 1;
		}
		return (value > compareTo) ? 1 : -1;
	},
	indexOf : function(text, pattern) {
		return text.indexOf(pattern);
	},
	indexOfFrom : function(text, pattern, fromIndex) {
		return text.indexOf(pattern, fromIndex);
	},
	lastIndexOf : function(text, pattern) {
		return text.lastIndexOf(pattern);
	},
	lastIndexOfFrom : function(text, pattern, indexFrom) {
		return text.lastIndexOf(pattern, indexFrom);
	},
	substring : function(text, beginIndex, endIndex) {
		if (endIndex === -1) {
			return text.substring(beginIndex);
		}
		return text.substring(beginIndex, endIndex);
	},
	toLowerCase : function(value) {
		return value && value.toLowerCase();
	},
	toUpperCase : function(value) {
		return value && value.toUpperCase();
	},
	trim : function(value) {
		return value && value.trim();
	},
	getStringResource : function() {
		return null;
	},
	utf8Encode : function(value) {
		return unescape(encodeURIComponent(value));
	},
	utf8Decode : function(value) {
		return decodeURIComponent(escape(value));
	},
	asString : function(value) {
		if (value === null || value === undefined) {
			return value;
		}
		return value.toString();
	}
};
sap.firefly.XBoolean = {
	TRUE : "true",
	FALSE : "false",
	convertToString : function(value) {
		if (value === true) {
			return this.TRUE;
		}
		return this.FALSE;
	},
	convertFromString : function(value) {
		if (this.TRUE === value) {
			return true;
		}
		if (this.FALSE === value) {
			return false;
		}
		throw new Error("Illegal Argument:" + value);
	},
	convertFromStringWithDefault : function(value, defaultValue) {
		if (this.TRUE === value) {
			return true;
		}
		if (this.FALSE === value) {
			return false;
		}
		return defaultValue;
	},
};
sap.firefly.XInteger = {
	convertToString : function(value) {
		if (value === null || value === undefined) {
			return null;
		}
		return value.toString();
	},
	convertFromString : function(value) {
		return sap.firefly.XInteger.convertFromStringWithRadix(value, 10);
	},
	convertFromStringWithRadix : function(value, radix, defaultValue) {
		if (typeof value === "number") {
			return parseInt(value, radix);
		}
		var hasDefault = typeof defaultValue !== "undefined";
		var v = sap.firefly.isNull(value) ? "" : value.trim();
		if ("" === v || !/(^[\-+]?\d*\.?\d*$)|(^[0-9a-fA-F]*$)/.test(v)) {
			if (hasDefault) {
				return defaultValue;
			}
			throw new Error("Value is not a number");
		}
		var intValue = parseInt(v, radix);
		if (isNaN(intValue)) {
			if (hasDefault) {
				return defaultValue;
			}
			throw new Error("Value is not a number: " + value);
		}
		return intValue;
	},
	convertFromStringWithDefault : function(value, defaultValue) {
		return sap.firefly.XInteger.convertFromStringWithRadix(value, 10,
				defaultValue);
	},
	convertToDouble : function(value) {
		return value;
	},
	convertToInt : function(value) {
		return value;
	},
	convertToHexString : function(value) {
		var hexStr = Number(value).toString(16).toUpperCase();
		return hexStr.length === 1 ? "0" + hexStr : hexStr;
	},
	getNthLeastSignificantByte : function(intValue, bytePosition) {
		return (intValue >> (bytePosition * 8)) & 255;
	}
};
sap.firefly.XLong = sap.firefly.XInteger;
sap.firefly.XDouble = {
	convertToString : function(value) {
		if (value === null || value === undefined) {
			return null;
		}
		return value.toString();
	},
	convertFromString : function(value) {
		if (value === null || value.length === 0 || isNaN(value)) {
			throw new Error("Illegal Argument: Value is not a number: " + value);
		}
		var numberValue = parseFloat(value);
		if (isNaN(numberValue)) {
			throw new Error("Illegal Argument: Value is not a number: " + value);
		}
		return numberValue;
	},
	convertFromStringWithDefault : function(value, defaultValue) {
		if (value === null || value.length === 0 || isNaN(value)) {
			return defaultValue;
		}
		var numberValue = parseFloat(value);
		if (isNaN(numberValue)) {
			return defaultValue;
		}
		return numberValue;
	},
	convertToLong : function(value) {
		return Math.floor(value);
	},
	convertToInt : function(value) {
		return parseInt(value, 10);
	}
};
sap.firefly.XStringBuffer = function() {
	this._ff_c = "XStringBuffer";
	this.m_stringBuffer = [];
};
sap.firefly.XStringBuffer.prototype = new sap.firefly.XObject();
sap.firefly.XStringBuffer.create = function() {
	return new sap.firefly.XStringBuffer();
};
sap.firefly.XStringBuffer.prototype.releaseObject = function() {
	this.m_stringBuffer = null;
	sap.firefly.XObject.prototype.releaseObject.call(this);
};
sap.firefly.XStringBuffer.prototype.appendLine = function(value) {
	if (value !== null) {
		this.m_stringBuffer.push(value);
	}
	this.m_stringBuffer.push("\n");
	return this;
};
sap.firefly.XStringBuffer.prototype.append = function(value) {
	if (value !== null) {
		this.m_stringBuffer.push(value);
	}
	return this;
};
sap.firefly.XStringBuffer.prototype.appendChar = function(value) {
	return this.append(String.fromCharCode(value));
};
sap.firefly.XStringBuffer.prototype.appendInt = sap.firefly.XStringBuffer.prototype.append;
sap.firefly.XStringBuffer.prototype.appendDouble = sap.firefly.XStringBuffer.prototype.append;
sap.firefly.XStringBuffer.prototype.appendLong = sap.firefly.XStringBuffer.prototype.append;
sap.firefly.XStringBuffer.prototype.appendBoolean = function(value) {
	return this.append(sap.firefly.XBoolean.convertToString(value));
};
sap.firefly.XStringBuffer.prototype.appendObject = function(value) {
	if (value !== null) {
		this.append(value.toString());
	} else {
		this.append("null");
	}
};
sap.firefly.XStringBuffer.prototype.appendNewLine = function() {
	this.m_stringBuffer.push("\n");
	return this;
};
sap.firefly.XStringBuffer.prototype.toString = function() {
	return this.m_stringBuffer.join("");
};
sap.firefly.XStringBuffer.prototype.length = function() {
	return this.toString().length;
};
sap.firefly.XStringBuffer.prototype.clear = function() {
	this.m_stringBuffer.length = 0;
};
sap.firefly.XStringBuffer.prototype.flush = function() {
};
sap.firefly.XClass = function(clazzPrototype) {
	this.m_clazzPrototype = clazzPrototype;
	this._ff_c = "XClass";
};
sap.firefly.XClass.prototype = new sap.firefly.XObject();
sap.firefly.XClass.create = function(clazzPrototype) {
	return new sap.firefly.XClass(clazzPrototype);
};
sap.firefly.XClass.createByName = function(clazzName) {
	if (clazzName === null || clazzName === undefined) {
		return null;
	}
	return this.create(sap.firefly[clazzName]);
};
sap.firefly.XClass.getCanonicalClassName = function(object) {
	if (object === undefined || object.clazzName === undefined) {
		return "[unknown class]";
	}
	return object.clazzName;
};
sap.firefly.XClass.isXObjectReleased = function(targetObject) {
	if (targetObject === null) {
		return true;
	}
	return targetObject.isReleased ? targetObject.isReleased() : false;
};
sap.firefly.XClass.callFunction = function(functionObj, param1, param2, param3) {
	var getType = {};
	var isFunction = functionObj
			&& getType.toString.call(functionObj) === "[object Function]";
	if (isFunction) {
		if (param1 === null && param2 === null && param3 === null) {
			functionObj();
		} else {
			functionObj(param1, param2, param3);
		}
		return true;
	}
	return false;
};
sap.firefly.XClass.initializeClass = function() {
};
sap.firefly.XClass.prototype.releaseObject = function() {
	this.m_clazzPrototype = null;
	sap.firefly.XObject.prototype.releaseObject.call(this);
};
sap.firefly.XClass.prototype.getNativeName = function() {
	return "Prototype";
};
sap.firefly.XClass.prototype.getNativeElement = function() {
	return this.m_clazzPrototype;
};
sap.firefly.XClass.prototype.newInstance = function() {
	var F = function() {
	};
	F.prototype = this.m_clazzPrototype.prototype;
	return new F();
};
sap.firefly.XClass.prototype.toString = function() {
	return "Prototype";
};
sap.firefly.XCharset = {
	USASCII : 0,
	_USASCII : "US-ASCII",
	UTF8 : 1,
	_UTF8 : "UTF-8",
	lookupCharsetName : function(theConstant) {
		if (theConstant === this.UTF8) {
			return this._UTF8;
		}
		return this._USASCII;
	}
};
sap.firefly.XByteArray = function(nativeByteArrayObject) {
	this.m_nativeByteArray = nativeByteArrayObject;
	this._ff_c = "XByteArray";
};
sap.firefly.XByteArray.prototype = new sap.firefly.XObject();
sap.firefly.XByteArray.create = function(nativeByteArrayObject, size) {
	if (nativeByteArrayObject === null) {
		var byteArray = new Array(size);
		for (var i = 0; i < size; i++) {
			byteArray[i] = 0;
		}
		return new sap.firefly.XByteArray(byteArray);
	}
	return new sap.firefly.XByteArray(nativeByteArrayObject);
};
sap.firefly.XByteArray.copy = function(src, srcPos, dest, destPos, length) {
	var srcBytes = src.getNative();
	var destBytes = dest.getNative();
	var srcIndex = srcPos;
	var destIndex = destPos;
	var count = 0;
	while (count++ < length) {
		destBytes[destIndex++] = srcBytes[srcIndex++];
	}
};
sap.firefly.XByteArray.convertFromString = function(value) {
	return sap.firefly.XByteArray.convertFromStringWithCharset(value,
			sap.firefly.XCharset.UTF8);
};
sap.firefly.XByteArray.convertFromStringWithCharset = function(value, charset) {
	var array = [];
	if (charset === sap.firefly.XCharset.UTF8) {
		if (typeof Buffer !== "undefined" && typeof module !== "undefined"
				&& this.module !== module && module.exports) {
			array = new Buffer(value, "utf8");
		} else {
			var c;
			for (var n = 0; n < value.length; n++) {
				c = value.charCodeAt(n);
				if (c < 128) {
					array.push(c);
				} else {
					if (c > 127 && c < 2048) {
						array.push((c >> 6) | 192);
						array.push((c & 63) | 128);
					} else {
						array.push((c >> 12) | 224);
						array.push(((c >> 6) & 63) | 128);
						array.push((c & 63) | 128);
					}
				}
			}
		}
	}
	return new sap.firefly.XByteArray(array);
};
sap.firefly.XByteArray.convertToString = function(byteArray) {
	return sap.firefly.XByteArray.convertToStringWithCharset(byteArray,
			sap.firefly.XCharset.UTF8);
};
sap.firefly.XByteArray.convertToStringWithCharset = function(byteArray, charset) {
	if (sap.firefly.XCharset.UTF8 !== charset) {
		throw new Error("Runtime Exception: Unsupported charset");
	}
	var array = byteArray.getNative();
	if (typeof Buffer !== "undefined" && typeof module !== "undefined"
			&& this.module !== module && module.exports) {
		return new Buffer(array, "binary").toString("utf8");
	}
	var buffer = new sap.firefly.XStringBuffer();
	var i = 0;
	var c1 = 0;
	var c2 = 0;
	var c3 = 0;
	while (i < array.length) {
		c1 = array[i];
		if (c1 < 128) {
			buffer.append(String.fromCharCode(c1));
			++i;
		} else {
			if (c1 > 191 && c1 < 224) {
				c2 = array[i + 1];
				buffer
						.append(String.fromCharCode(((c1 & 31) << 6)
								| (c2 & 63)));
				i += 2;
			} else {
				c2 = array[i + 1];
				c3 = array[i + 2];
				buffer.append(String.fromCharCode(((c1 & 15) << 12)
						| ((c2 & 63) << 6) | (c3 & 63)));
				i += 3;
			}
		}
	}
	return buffer.toString();
};
sap.firefly.XByteArray.isEqual = function(firstValue, secondValue) {
	return firstValue === secondValue;
};
sap.firefly.XByteArray.prototype.releaseObject = function() {
	this.m_nativeByteArray = null;
	sap.firefly.XObject.prototype.releaseObject.call(this);
};
sap.firefly.XByteArray.prototype.size = function() {
	if (this.m_nativeByteArray === null) {
		return 0;
	}
	return this.m_nativeByteArray.length;
};
sap.firefly.XByteArray.prototype.getByteAt = function(index) {
	return this.m_nativeByteArray[index];
};
sap.firefly.XByteArray.prototype.setByteAt = function(index, value) {
	this.m_nativeByteArray[index] = value;
};
sap.firefly.XByteArray.prototype.getNative = function() {
	return this.m_nativeByteArray;
};
sap.firefly.XByteArray.prototype.setNative = function(nativeByteArrayObject) {
	this.m_nativeByteArray = nativeByteArrayObject;
};
sap.firefly.XByteArray.prototype.resetValue = sap.firefly.XObject.noSupport;
sap.firefly.XByteArray.prototype.toString = sap.firefly.XObject.noSupport;
sap.firefly.XMath = {
	isNaN : function(value) {
		if (value === null || value === undefined) {
			return true;
		}
		return isNaN(value);
	},
	abs : function(value) {
		return Math.abs(value);
	},
	mod : function(i1, i2) {
		if (i2 === 0) {
			throw new Error("Illegal Argument: division by 0");
		}
		if (i1 === 0) {
			return 0;
		}
		return i1 % i2;
	},
	div : function(i1, i2) {
		if (i2 === 0) {
			throw new Error("Illegal Argument: division by 0");
		}
		if (i1 === 0) {
			return 0;
		}
		if (i1 < 0 !== i2 < 0) {
			return Math.ceil(i1 / i2);
		}
		return Math.floor(i1 / i2);
	},
	binaryAnd : function(value1, value2) {
		return value1 & value2;
	},
	binaryOr : function(value1, value2) {
		return value1 | value2;
	},
	binaryXOr : function(value1, value2) {
		return value1 ^ value2;
	},
	min : function(firstInteger, secondInteger) {
		if (firstInteger > secondInteger) {
			return secondInteger;
		}
		return firstInteger;
	},
	max : function(firstInteger, secondInteger) {
		if (firstInteger > secondInteger) {
			return firstInteger;
		}
		return secondInteger;
	},
	clamp : function(lowerBound, upperBound, value) {
		var xMath = sap.firefly.XMath;
		var lowerBoundary = xMath.min(lowerBound, upperBound);
		var upperBoundary = xMath.max(lowerBound, upperBound);
		return xMath.max(lowerBoundary, xMath.min(value, upperBoundary));
	},
	pow : function(a, b) {
		return Math.pow(a, b);
	},
	random : function(upperBound) {
		return Math.floor(Math.random() * upperBound);
	}
};