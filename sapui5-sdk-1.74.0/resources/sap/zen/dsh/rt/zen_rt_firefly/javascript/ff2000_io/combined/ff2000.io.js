(function(oFF) {
	oFF.XHierarchyComparator = function() {
	};
	oFF.XHierarchyComparator.prototype = new oFF.XObject();
	oFF.XHierarchyComparator.create = function() {
		return new oFF.XHierarchyComparator();
	};
	oFF.XHierarchyComparator.prototype.compare = function(o1, o2) {
		var s1;
		var s2;
		if (o1.isNode()) {
			if (o2.isLeaf()) {
				return -1;
			}
		} else {
			if (o2.isNode()) {
				return 1;
			}
		}
		s1 = o1.getName();
		s2 = o2.getName();
		return oFF.XString.compare(s1, s2);
	};
	oFF.XHierarchyResult = function() {
	};
	oFF.XHierarchyResult.prototype = new oFF.XObject();
	oFF.XHierarchyResult.create = function(parentNode, list) {
		var newObj = new oFF.XHierarchyResult();
		newObj.m_list = list;
		newObj.m_parentNode = parentNode;
		return newObj;
	};
	oFF.XHierarchyResult.prototype.m_parentNode = null;
	oFF.XHierarchyResult.prototype.m_list = null;
	oFF.XHierarchyResult.prototype.getChildren = function() {
		return this.m_list;
	};
	oFF.XHierarchyResult.prototype.getHierarchyParentNode = function() {
		return this.m_parentNode;
	};
	oFF.SyncActionListenerPair = function() {
	};
	oFF.SyncActionListenerPair.prototype = new oFF.XObject();
	oFF.SyncActionListenerPair.create = function(listener, type,
			customIdentifier) {
		var pair;
		oFF.XObjectExt.checkNotNull(listener, "Listener is null!");
		pair = new oFF.SyncActionListenerPair();
		pair.setupExt(listener, type, customIdentifier);
		return pair;
	};
	oFF.SyncActionListenerPair.prototype.m_listener = null;
	oFF.SyncActionListenerPair.prototype.m_customIdentifier = null;
	oFF.SyncActionListenerPair.prototype.m_type = null;
	oFF.SyncActionListenerPair.prototype.setupExt = function(listener, type,
			customIdentifier) {
		this.m_listener = listener;
		this.m_type = type;
		this.m_customIdentifier = customIdentifier;
	};
	oFF.SyncActionListenerPair.prototype.releaseObject = function() {
		this.m_customIdentifier = null;
		this.m_listener = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.SyncActionListenerPair.prototype.getListener = function() {
		return this.m_listener;
	};
	oFF.SyncActionListenerPair.prototype.getListenerType = function() {
		return this.m_type;
	};
	oFF.SyncActionListenerPair.prototype.getCustomIdentifier = function() {
		return this.m_customIdentifier;
	};
	oFF.XFileSystemFactory = function() {
	};
	oFF.XFileSystemFactory.prototype = new oFF.XObject();
	oFF.XFileSystemFactory.s_factory = null;
	oFF.XFileSystemFactory.staticSetupFactory = function() {
		oFF.XFileSystemFactory.s_factory = oFF.XHashMapByString.create();
	};
	oFF.XFileSystemFactory.registerFactory = function(type, factory) {
		if (oFF.notNull(type)) {
			oFF.XFileSystemFactory.s_factory.put(type.getName(), factory);
		}
	};
	oFF.XFileSystemFactory.create = function(session, type) {
		var factory = oFF.XFileSystemFactory.s_factory.getByKey(type.getName());
		if (oFF.notNull(factory)) {
			return factory.newFileSystem(session);
		} else {
			return null;
		}
	};
	oFF.GzipFileHelper = function() {
	};
	oFF.GzipFileHelper.prototype = new oFF.XObject();
	oFF.GzipFileHelper.BREAK_LINE = null;
	oFF.GzipFileHelper.create = function() {
		var obj = new oFF.GzipFileHelper();
		obj.setupExt(oFF.PrFactory.createStructure(), null);
		return obj;
	};
	oFF.GzipFileHelper.getBreakLineArray = function() {
		if (oFF.isNull(oFF.GzipFileHelper.BREAK_LINE)) {
			oFF.GzipFileHelper.BREAK_LINE = oFF.XByteArray
					.convertFromString("\n");
		}
		return oFF.GzipFileHelper.BREAK_LINE;
	};
	oFF.GzipFileHelper.createWithContent = function(contentTable, content) {
		var obj = new oFF.GzipFileHelper();
		obj.setupExt(contentTable, content);
		return obj;
	};
	oFF.GzipFileHelper.prototype.m_previousEndIndex = 0;
	oFF.GzipFileHelper.prototype.m_contentTable = null;
	oFF.GzipFileHelper.prototype.m_content = null;
	oFF.GzipFileHelper.prototype.setupExt = function(contentTable, content) {
		this.m_contentTable = contentTable;
		this.m_content = content;
	};
	oFF.GzipFileHelper.prototype.putContent = function(key, content) {
		var binaryContent;
		var entry;
		var endIndex;
		var all;
		if (oFF.isNull(content) || this.isFileContentEmpty(content)) {
			return;
		}
		binaryContent = this.extractBytes(content);
		entry = this.m_contentTable.putNewStructure(key);
		endIndex = -1;
		if (oFF.isNull(this.m_content)) {
			this.m_content = binaryContent;
			endIndex = binaryContent.size();
		} else {
			all = oFF.XByteArray.create(null, this.m_content.size()
					+ binaryContent.size() + 1);
			oFF.XByteArray.copy(this.m_content, 0, all, 0, this.m_content
					.size());
			oFF.XByteArray.copy(oFF.GzipFileHelper.getBreakLineArray(), 0, all,
					this.m_content.size(), oFF.GzipFileHelper
							.getBreakLineArray().size());
			this.m_previousEndIndex = this.m_previousEndIndex
					+ oFF.GzipFileHelper.getBreakLineArray().size();
			oFF.XByteArray.copy(binaryContent, 0, all, this.m_content.size()
					+ oFF.GzipFileHelper.getBreakLineArray().size(),
					binaryContent.size());
			this.m_content = all;
			endIndex = this.m_previousEndIndex + binaryContent.size();
		}
		entry.putInteger("startIndex", this.m_previousEndIndex);
		entry.putInteger("endIndex", endIndex);
		if (content.getContentType() !== null) {
			entry.putString("contentType", content.getContentType().getName());
		}
		this.m_previousEndIndex = endIndex;
	};
	oFF.GzipFileHelper.prototype.isFileContentEmpty = function(content) {
		return !content.isBinaryContentSet() && !content.isStringContentSet()
				&& !content.isJsonContentSet();
	};
	oFF.GzipFileHelper.prototype.extractBytes = function(content) {
		var serialize;
		if (content.isBinaryContentSet()) {
			return content.getByteArray();
		}
		if (content.isStringContentSet()) {
			return oFF.XByteArray.convertFromString(content.getString());
		}
		if (content.isJsonContentSet()) {
			serialize = oFF.PrUtils.serialize(content.getJsonContent(), false,
					false, 0);
			return oFF.XByteArray.convertFromString(serialize);
		}
		throw oFF.XException
				.createIllegalArgumentException("file content was empty!");
	};
	oFF.GzipFileHelper.prototype.getCompleteContent = function() {
		return this.m_content;
	};
	oFF.GzipFileHelper.prototype.getKeys = function() {
		return this.m_contentTable.getKeysAsReadOnlyListOfString();
	};
	oFF.GzipFileHelper.prototype.getContentByKey = function(key) {
		var result = oFF.XFileContent.createFileContent();
		var entry;
		var startIndex;
		var endIndex;
		var binaryContent;
		var stringContent;
		var contentType;
		result.setMessageCollection(oFF.MessageManager.createMessageManager());
		entry = this.m_contentTable.getStructureByKey(key);
		if (oFF.isNull(entry)) {
			result.getMessageCollection().addError(0,
					oFF.XStringUtils.concatenate2("No entry for key ", key));
			return result;
		}
		startIndex = entry.getIntegerByKey("startIndex");
		endIndex = entry.getIntegerByKey("endIndex");
		binaryContent = oFF.XByteArray.create(null, endIndex - startIndex);
		oFF.XByteArray.copy(this.m_content, startIndex, binaryContent, 0,
				binaryContent.size());
		result.setByteArray(binaryContent);
		stringContent = oFF.XByteArray.convertToString(binaryContent);
		result.setString(stringContent);
		result.getJsonContent();
		contentType = oFF.ContentType.lookup(entry
				.getStringByKey("contentType"));
		if (oFF.notNull(contentType)) {
			result.setContentType(contentType);
		}
		return result;
	};
	oFF.GzipFileHelper.prototype.getContentTableAsJson = function() {
		return this.m_contentTable;
	};
	oFF.GzipFileHelper.prototype.releaseObject = function() {
		oFF.XObject.prototype.releaseObject.call(this);
		this.m_content = oFF.XObjectExt.release(this.m_content);
		this.m_contentTable = oFF.XObjectExt.release(this.m_contentTable);
	};
	oFF.JsonParserGenericStackElement = function() {
	};
	oFF.JsonParserGenericStackElement.prototype = new oFF.XObject();
	oFF.JsonParserGenericStackElement.create = function() {
		var jsonLevelInfo = new oFF.JsonParserGenericStackElement();
		jsonLevelInfo.reset();
		return jsonLevelInfo;
	};
	oFF.JsonParserGenericStackElement.prototype.m_element = null;
	oFF.JsonParserGenericStackElement.prototype.m_name = null;
	oFF.JsonParserGenericStackElement.prototype.m_valueSet = false;
	oFF.JsonParserGenericStackElement.prototype.m_hasElements = false;
	oFF.JsonParserGenericStackElement.prototype.m_isPreparedForNextElement = false;
	oFF.JsonParserGenericStackElement.prototype.reset = function() {
		this.m_element = null;
		this.m_name = null;
		this.m_valueSet = false;
		this.m_hasElements = false;
		this.m_isPreparedForNextElement = false;
	};
	oFF.JsonParserGenericStackElement.prototype.getElement = function() {
		return this.m_element;
	};
	oFF.JsonParserGenericStackElement.prototype.setElement = function(element) {
		this.m_element = element;
	};
	oFF.JsonParserGenericStackElement.prototype.getName = function() {
		return this.m_name;
	};
	oFF.JsonParserGenericStackElement.prototype.setName = function(name) {
		this.m_name = name;
	};
	oFF.JsonParserGenericStackElement.prototype.isNameSet = function() {
		return oFF.notNull(this.m_name);
	};
	oFF.JsonParserGenericStackElement.prototype.setValueSet = function(valueSet) {
		this.m_valueSet = valueSet;
	};
	oFF.JsonParserGenericStackElement.prototype.isValueSet = function() {
		return this.m_valueSet;
	};
	oFF.JsonParserGenericStackElement.prototype.addElement = function() {
		if (this.m_hasElements === false) {
			if (this.m_isPreparedForNextElement) {
				return false;
			}
			this.m_hasElements = true;
			return true;
		}
		if (this.m_isPreparedForNextElement === false) {
			return false;
		}
		this.m_isPreparedForNextElement = false;
		return true;
	};
	oFF.JsonParserGenericStackElement.prototype.nextElement = function() {
		if (this.m_isPreparedForNextElement) {
			return false;
		}
		if (this.m_hasElements === false) {
			return false;
		}
		this.m_isPreparedForNextElement = true;
		return true;
	};
	oFF.JsonParserGenericStackElement.prototype.finishElements = function() {
		if (this.m_isPreparedForNextElement) {
			return false;
		}
		return true;
	};
	oFF.SystemMapping = function() {
	};
	oFF.SystemMapping.prototype = new oFF.XObject();
	oFF.SystemMapping.create = function(serializeTable, serializeSchema,
			deserializeTable, deserializeSchema) {
		var systemMappingData = new oFF.SystemMapping();
		systemMappingData.setupExt(serializeTable, serializeSchema,
				deserializeTable, deserializeSchema);
		return systemMappingData;
	};
	oFF.SystemMapping.prototype.m_serializeTable = null;
	oFF.SystemMapping.prototype.m_serializeSchema = null;
	oFF.SystemMapping.prototype.m_deserializeTable = null;
	oFF.SystemMapping.prototype.m_deserializeSchema = null;
	oFF.SystemMapping.prototype.setupExt = function(serializeTable,
			serializeSchema, deserializeTable, deserializeSchema) {
		this.m_serializeTable = serializeTable;
		this.m_serializeSchema = serializeSchema;
		this.m_deserializeTable = deserializeTable;
		this.m_deserializeSchema = deserializeSchema;
	};
	oFF.SystemMapping.prototype.releaseObject = function() {
		this.m_serializeTable = null;
		this.m_serializeSchema = null;
		this.m_deserializeTable = null;
		this.m_deserializeSchema = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.SystemMapping.prototype.getSerializeTable = function() {
		return this.m_serializeTable;
	};
	oFF.SystemMapping.prototype.getSerializeSchema = function() {
		return this.m_serializeSchema;
	};
	oFF.SystemMapping.prototype.getDeserializeTable = function() {
		return this.m_deserializeTable;
	};
	oFF.SystemMapping.prototype.getDeserializeSchema = function() {
		return this.m_deserializeSchema;
	};
	oFF.SystemMapping.prototype.isValid = function(remoteSystemMapping) {
		if (this.isDataNullOrEmpty(this)
				|| this.isDataNullOrEmpty(remoteSystemMapping)) {
			return false;
		}
		if (!oFF.XString.isEqual(this.getSerializeTable(), remoteSystemMapping
				.getDeserializeTable())
				|| !oFF.XString.isEqual(this.getSerializeSchema(),
						remoteSystemMapping.getDeserializeSchema())) {
			return false;
		}
		if (!oFF.XString.isEqual(this.getDeserializeTable(),
				remoteSystemMapping.getSerializeTable())
				|| !oFF.XString.isEqual(this.getDeserializeSchema(),
						remoteSystemMapping.getSerializeSchema())) {
			return false;
		}
		return true;
	};
	oFF.SystemMapping.prototype.isDataNullOrEmpty = function(systemMapping) {
		return oFF.XStringUtils
				.isNullOrEmpty(systemMapping.getSerializeTable())
				|| oFF.XStringUtils.isNullOrEmpty(systemMapping
						.getSerializeSchema())
				|| oFF.XStringUtils.isNullOrEmpty(systemMapping
						.getDeserializeTable())
				|| oFF.XStringUtils.isNullOrEmpty(systemMapping
						.getDeserializeSchema());
	};
	oFF.SystemMapping.prototype.toString = function() {
		var s = oFF.XStringBuffer.create();
		s.append("{serializeTable=").append(this.m_serializeTable);
		s.append(", serializeSchema=").append(this.m_serializeSchema);
		s.append(", deserializeTable=").append(this.m_deserializeTable);
		s.append(", deserializeSchema=").append(this.m_deserializeSchema);
		return s.append("}").toString();
	};
	oFF.TraceInfo = function() {
	};
	oFF.TraceInfo.prototype = new oFF.XObject();
	oFF.TraceInfo.create = function() {
		var newObject = new oFF.TraceInfo();
		newObject.m_traceType = oFF.TraceType.NONE;
		return newObject;
	};
	oFF.TraceInfo.prototype.m_traceType = null;
	oFF.TraceInfo.prototype.m_traceName = null;
	oFF.TraceInfo.prototype.m_traceFolderPath = null;
	oFF.TraceInfo.prototype.m_traceFolderInternal = null;
	oFF.TraceInfo.prototype.m_traceIndex = 0;
	oFF.TraceInfo.prototype.releaseObject = function() {
		this.m_traceFolderInternal = null;
		this.m_traceFolderPath = null;
		this.m_traceName = null;
		this.m_traceType = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.TraceInfo.prototype.getTraceType = function() {
		return this.m_traceType;
	};
	oFF.TraceInfo.prototype.setTraceType = function(traceType) {
		this.m_traceType = traceType;
	};
	oFF.TraceInfo.prototype.getTraceName = function() {
		return this.m_traceName;
	};
	oFF.TraceInfo.prototype.setTraceName = function(traceName) {
		this.m_traceName = traceName;
	};
	oFF.TraceInfo.prototype.getTraceFolderPath = function() {
		return this.m_traceFolderPath;
	};
	oFF.TraceInfo.prototype.setTraceFolderPath = function(traceFolderPath) {
		this.m_traceFolderPath = traceFolderPath;
	};
	oFF.TraceInfo.prototype.getTraceFolderInternal = function() {
		return this.m_traceFolderInternal;
	};
	oFF.TraceInfo.prototype.setTraceFolderInternal = function(
			traceFolderInternal) {
		this.m_traceFolderInternal = traceFolderInternal;
	};
	oFF.TraceInfo.prototype.getTraceIndex = function() {
		return this.m_traceIndex;
	};
	oFF.TraceInfo.prototype.incrementTraceIndex = function() {
		this.m_traceIndex++;
	};
	oFF.XConnectHelper = {
		copyUri : function(source, target) {
			oFF.XConnectHelper.copyConnection(source, target);
			target.setPath(source.getPath());
			target.setQuery(source.getQuery());
			target.setFragment(source.getFragment());
		},
		copyConnection : function(source, target) {
			oFF.XConnectHelper.copyConnectionCore(source, target);
			oFF.XConnectHelper.copyConnectionCredentials(source, target);
		},
		copyConnectionInfo : function(source, target) {
			oFF.XConnectHelper.copyConnectionCore(source, target);
			oFF.XConnectHelper.copyConnectionPersonalization(source, target);
			oFF.XConnectHelper.copyProxySettings(source, target);
			target.setTimeout(source.getTimeout());
			target.setSystemName(source.getSystemName());
			target.setSystemText(source.getSystemText());
			target.setSystemType(source.getSystemType());
			target.setPrefix(source.getPrefix());
			target.setNativeConnection(source.getNativeConnection());
			target.setAlias(source.getAlias());
		},
		copyProxySettings : function(source, target) {
			var proxyHttpHeaders;
			var i;
			var header;
			target.setProxyHost(source.getProxyHost());
			target.setProxyPort(source.getProxyPort());
			target.setProxyAuthorization(source.getProxyAuthorization());
			target.setWebdispatcherTemplate(source.getWebdispatcherTemplate());
			target.setSccLocationId(source.getSccLocationId());
			proxyHttpHeaders = source.getProxyHttpHeaders();
			if (oFF.notNull(proxyHttpHeaders)) {
				for (i = 0; i < proxyHttpHeaders.size(); i++) {
					header = proxyHttpHeaders.get(i);
					target.setProxyHttpHeader(header.getName(), header
							.getValue());
				}
			}
			target.setProxyType(source.getProxyType());
		},
		copyConnectionPersonalization : function(source, target) {
			oFF.XConnectHelper.copyConnectionCredentials(source, target);
			target.setLanguage(source.getLanguage());
		},
		copyConnectionCore : function(source, target) {
			target.setScheme(source.getScheme());
			target.setHost(source.getHost());
			target.setPort(source.getPort());
		},
		copyConnectionCredentials : function(source, target) {
			target.setAuthenticationType(source.getAuthenticationType());
			target.setUser(source.getUser());
			target.setPassword(source.getPassword());
			target.setX509Certificate(source.getX509Certificate());
			target.setSecureLoginProfile(source.getSecureLoginProfile());
			target.setAuthenticationToken(source.getAuthenticationToken());
			target.setAccessToken(source.getAccessToken());
			target.setOrganization(source.getOrganization());
			target.setElement(source.getElement());
		},
		applyProxySettings : function(connection, session) {
			var proxySettings;
			if (connection.getProxyType() === oFF.ProxyType.DEFAULT) {
				proxySettings = session.getProxySettings();
				if (proxySettings.isProxyApplicable(connection) === true) {
					oFF.XConnectHelper.copyProxySettings(proxySettings,
							connection);
				}
			}
		},
		applyWebdispatcherTemplate : function(source, target,
				webdispatcherProperty, session) {
			var networkLocation;
			var sysWebDispatcherTemplate;
			var prefix;
			var path;
			var useAlias;
			var usePrefix;
			var webdispatcherUri;
			var dpHost;
			var dpPort;
			var sysHost;
			var sysPort;
			var isSameServer;
			var newUrlString;
			var newUrl;
			var newPath;
			if (source.getProtocolType() !== oFF.ProtocolType.FILE) {
				networkLocation = session.getNetworkLocation();
				sysWebDispatcherTemplate = webdispatcherProperty
						.getWebdispatcherTemplate();
				prefix = source.getPrefix();
				path = source.getPath();
				if (oFF.XStringUtils
						.isNotNullAndNotEmpty(sysWebDispatcherTemplate)) {
					useAlias = oFF.XString.containsString(
							sysWebDispatcherTemplate,
							oFF.XEnvironmentConstants.DISPATCHER_ALIAS);
					usePrefix = oFF.XString.containsString(
							sysWebDispatcherTemplate,
							oFF.XEnvironmentConstants.DISPATCHER_PREFIX);
					webdispatcherUri = oFF.XUri.createFromUriWithParent(
							sysWebDispatcherTemplate, networkLocation, false);
					dpHost = webdispatcherUri.getHost();
					dpPort = webdispatcherUri.getPort();
					sysHost = source.getHost();
					sysPort = source.getPort();
					isSameServer = oFF.XString.isEqual(dpHost, sysHost)
							&& dpPort === sysPort;
					if (isSameServer === false || useAlias || usePrefix) {
						newUrlString = sysWebDispatcherTemplate;
						newUrlString = oFF.XConnectHelper.safeReplace(
								newUrlString,
								oFF.XEnvironmentConstants.DISPATCHER_PROTOCOL,
								source.getScheme());
						newUrlString = oFF.XConnectHelper.safeReplace(
								newUrlString,
								oFF.XEnvironmentConstants.DISPATCHER_HOST,
								sysHost);
						newUrlString = oFF.XConnectHelper.safeReplace(
								newUrlString,
								oFF.XEnvironmentConstants.DISPATCHER_PORT,
								oFF.XInteger.convertToString(sysPort));
						newUrlString = oFF.XConnectHelper.safeReplace(
								newUrlString,
								oFF.XEnvironmentConstants.DISPATCHER_ALIAS,
								source.getSystemName());
						newUrlString = oFF.XConnectHelper.safeReplace(
								newUrlString,
								oFF.XEnvironmentConstants.DISPATCHER_PREFIX,
								prefix);
						newUrlString = oFF.XConnectHelper
								.safeReplace(
										newUrlString,
										oFF.XEnvironmentConstants.DISPATCHER_PATH,
										path);
						newUrl = oFF.XUri.createFromUriWithParent(newUrlString,
								networkLocation, false);
						target.setProtocolType(newUrl.getProtocolType());
						target.setHost(newUrl.getHost());
						target.setPort(newUrl.getPort());
						target.setPath(newUrl.getPath());
					}
				} else {
					if (oFF.XStringUtils.isNotNullAndNotEmpty(prefix)) {
						newPath = oFF.XStringUtils.concatenate2(prefix, path);
						target.setPath(newPath);
					}
				}
			}
		},
		safeReplace : function(value, searchPattern, replaceValue) {
			var safeReplaceValue = replaceValue;
			if (oFF.isNull(safeReplaceValue)) {
				safeReplaceValue = "";
			}
			return oFF.XString.replace(value, searchPattern, safeReplaceValue);
		}
	};
	oFF.RpcRequestConstants = {
		REQUEST_PARAM_TIMESTAMP : "timestamp",
		REQUEST_PARAM_TRACE_NAME : "traceName",
		REQUEST_PARAM_TRACE_PATH : "tracePath",
		REQUEST_PARAM_TRACE_REQ_INDEX : "traceRequestIndex"
	};
	oFF.HtmlForm = function() {
	};
	oFF.HtmlForm.prototype = new oFF.XObject();
	oFF.HtmlForm.create = function(originSite, html) {
		var newObject = new oFF.HtmlForm();
		newObject.setupHttpForm(originSite, html);
		return newObject;
	};
	oFF.HtmlForm.findHtmlValue = function(html, offset, prefixMarker, parameter) {
		var myOffset = offset;
		var value;
		var fullParameter;
		var valueStart;
		var valueEnd;
		if (oFF.notNull(prefixMarker)) {
			myOffset = oFF.XString.indexOfFrom(html, prefixMarker, myOffset);
		}
		value = null;
		if (myOffset >= 0) {
			fullParameter = oFF.XStringUtils.concatenate2(parameter, '="');
			valueStart = oFF.XString.indexOfFrom(html, fullParameter, myOffset);
			if (valueStart >= 0) {
				valueStart = valueStart + oFF.XString.size(fullParameter);
				valueEnd = oFF.XString.indexOfFrom(html, '"', valueStart);
				if (valueEnd !== -1) {
					value = oFF.XString.substring(html, valueStart, valueEnd);
				}
			} else {
				fullParameter = oFF.XStringUtils.concatenate2(parameter, "='");
				valueStart = oFF.XString.indexOfFrom(html, fullParameter,
						myOffset);
				if (valueStart >= 0) {
					valueStart = valueStart + oFF.XString.size(fullParameter);
					valueEnd = oFF.XString.indexOfFrom(html, "'", valueStart);
					if (valueEnd !== -1) {
						value = oFF.XString.substring(html, valueStart,
								valueEnd);
					}
				}
			}
		}
		return oFF.XmlUtils.unescapeRawXmlString(value, true);
	};
	oFF.HtmlForm.prototype.m_isValid = false;
	oFF.HtmlForm.prototype.m_values = null;
	oFF.HtmlForm.prototype.m_types = null;
	oFF.HtmlForm.prototype.m_action = null;
	oFF.HtmlForm.prototype.m_target = null;
	oFF.HtmlForm.prototype.m_originSite = null;
	oFF.HtmlForm.prototype.setupHttpForm = function(originSite, html) {
		var formStart;
		var formEnd;
		var theForm;
		var offset;
		var nextOffset;
		var endOffset;
		var inputTag;
		var inputType;
		var inputName;
		var inputValue;
		this.m_originSite = originSite;
		this.m_values = oFF.XProperties.create();
		this.m_types = oFF.XProperties.create();
		if (oFF.notNull(html)) {
			formStart = oFF.XString.indexOf(html, "<form");
			if (formStart !== -1) {
				formEnd = oFF.XString.indexOfFrom(html, "</form>", formStart);
				if (formEnd !== -1) {
					theForm = oFF.XString.substring(html, formStart, formEnd);
					this.m_action = oFF.HtmlForm.findHtmlValue(theForm, 0,
							null, "action");
					if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_action)) {
						this.m_isValid = true;
						offset = oFF.XString.indexOf(theForm, ">");
						while (offset !== -1) {
							nextOffset = oFF.XString.indexOfFrom(theForm,
									"<input", offset);
							if (nextOffset === -1) {
								break;
							}
							endOffset = oFF.XString.indexOfFrom(theForm, ">",
									nextOffset);
							inputTag = oFF.XString.substring(theForm,
									nextOffset, endOffset);
							inputType = oFF.HtmlForm.findHtmlValue(inputTag, 0,
									null, "type");
							if (oFF.isNull(inputType)) {
								inputType = "";
							}
							inputName = oFF.HtmlForm.findHtmlValue(inputTag, 0,
									null, "name");
							inputValue = oFF.HtmlForm.findHtmlValue(inputTag,
									0, null, "value");
							if (oFF.isNull(inputValue)) {
								inputValue = "";
							}
							if (oFF.notNull(inputName)) {
								this.m_values.put(inputName, inputValue);
								this.m_types.put(inputName, inputType);
							}
							offset = endOffset;
						}
					}
				}
			}
		}
	};
	oFF.HtmlForm.prototype.getParameters = function() {
		return this.m_values;
	};
	oFF.HtmlForm.prototype.getAction = function() {
		return this.m_action;
	};
	oFF.HtmlForm.prototype.getParameterValue = function(key) {
		return this.m_values.getByKey(key);
	};
	oFF.HtmlForm.prototype.getParameterType = function(key) {
		return this.m_types.getByKey(key);
	};
	oFF.HtmlForm.prototype.getNames = function() {
		return this.m_values.getKeysAsIteratorOfString();
	};
	oFF.HtmlForm.prototype.getTarget = function() {
		if (oFF.isNull(this.m_target)) {
			this.m_target = oFF.XUri.createFromUriWithParent(this.m_action,
					this.m_originSite, false);
		}
		return this.m_target;
	};
	oFF.HtmlForm.prototype.setTarget = function(target) {
		this.m_target = target;
	};
	oFF.HtmlForm.prototype.getOriginSite = function() {
		return this.m_originSite;
	};
	oFF.HtmlForm.prototype.set = function(name, value) {
		this.m_values.put(name, value);
	};
	oFF.HtmlForm.prototype.isValid = function() {
		return this.m_isValid;
	};
	oFF.HtmlForm.prototype.toString = function() {
		var buffer = oFF.XStringBuffer.create();
		var iterator;
		var key;
		var type;
		buffer.append("action=").appendLine(this.m_action);
		iterator = this.m_values.getKeysAsIteratorOfString();
		while (iterator.hasNext()) {
			key = iterator.next();
			type = this.m_types.getByKey(key);
			buffer.append(key).append("[").append(type).append("]=")
					.appendLine(this.m_values.getByKey(key));
		}
		return buffer.toString();
	};
	oFF.HttpConstants = {
		FIREFLY_USER_AGENT : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.99 Safari/537.36",
		HTTP_11 : "HTTP/1.1",
		UTF_8 : "UTF-8",
		GZIP : "GZIP",
		HTTP_CRLF : "\r\n",
		HD_CONTENT_LENGTH : "Content-Length",
		HD_SET_COOKIE : "Set-Cookie",
		HD_COOKIE : "Cookie",
		HD_HOST : "Host",
		HD_ACCEPT : "Accept",
		HD_ACCEPT_LANGUAGE : "Accept-Language",
		HD_ACCEPT_CHARSET : "Accept-Charset",
		VA_LANGUAGE_ENGLISH : "en",
		HD_ACCEPT_ENCODING : "Accept-Encoding",
		HD_USER_AGENT : "User-Agent",
		HD_CACHE_CONTROL : "Cache-Control",
		HD_CONNECTION : "Connection",
		HD_REFERER : "Referer",
		HD_ORIGIN : "Origin",
		VA_CONNECTION_CLOSE : "close",
		VA_CONNECTION_KEEP_ALIVE : "keep-alive",
		HD_CONTENT_TYPE : "Content-Type",
		HD_CONTENT_ENCODING : "Content-Encoding",
		HD_LOCATION : "Location",
		HD_AUTHORIZATION : "Authorization",
		VA_AUTHORIZATION_BASIC : "Basic",
		VA_AUTHORIZATION_BEARER : "Bearer",
		HD_TRANSFER_ENCODING : "Transfer-Encoding",
		VA_TRANSFER_ENCODING_CHUNKED : "Chunked",
		HD_WWW_AUTHENTICATE : "WWW-Authenticate",
		HD_CSRF_TOKEN : "X-Csrf-Token",
		HD_BOE_SESSION_TOKEN : "X-Boe-Session-Token",
		VA_CSRF_FETCH : "Fetch",
		VA_CSRF_REQUIRED : "Required",
		HD_SAP_URL_SESSION_ID : "sap-url-session-id",
		HD_E_TAG : "ETag",
		HD_LAST_MODIFIED : "Last-Modified",
		HD_MYSAPSSO2 : "mysapsso2",
		HD_SAP_CLIENT_ID : "x-sap-cid",
		HD_USER : "User",
		HD_ORGANIZATION : "Organization",
		HD_ELEMENT : "Element",
		HD_PROXY_AUTHORIZATION : "Proxy-Authorization",
		HD_SCC_LOCATION_ID : "SAP-Connectivity-SCC-Location_ID",
		HD_SAP_CONNECTIVITY_AUTHENTICATION : "SAP-Connectivity-Authentication",
		s_camelCaseLookupByLowerCase : null,
		staticSetup : function() {
			oFF.HttpConstants.s_camelCaseLookupByLowerCase = oFF.XHashMapOfStringByString
					.create();
			oFF.HttpConstants.store(oFF.HttpConstants.HD_CONTENT_LENGTH);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_SET_COOKIE);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_COOKIE);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_HOST);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_ACCEPT);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_ACCEPT_LANGUAGE);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_ACCEPT_CHARSET);
			oFF.HttpConstants.store(oFF.HttpConstants.VA_LANGUAGE_ENGLISH);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_ACCEPT_ENCODING);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_USER_AGENT);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_CACHE_CONTROL);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_CONNECTION);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_REFERER);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_ORIGIN);
			oFF.HttpConstants.store(oFF.HttpConstants.VA_CONNECTION_CLOSE);
			oFF.HttpConstants.store(oFF.HttpConstants.VA_CONNECTION_KEEP_ALIVE);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_CONTENT_TYPE);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_CONTENT_ENCODING);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_LOCATION);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_AUTHORIZATION);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_TRANSFER_ENCODING);
			oFF.HttpConstants
					.store(oFF.HttpConstants.VA_TRANSFER_ENCODING_CHUNKED);
			oFF.HttpConstants.store(oFF.HttpConstants.VA_AUTHORIZATION_BASIC);
			oFF.HttpConstants.store(oFF.HttpConstants.VA_AUTHORIZATION_BEARER);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_WWW_AUTHENTICATE);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_CSRF_TOKEN);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_BOE_SESSION_TOKEN);
			oFF.HttpConstants.store(oFF.HttpConstants.VA_CSRF_FETCH);
			oFF.HttpConstants.store(oFF.HttpConstants.VA_CSRF_REQUIRED);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_SAP_URL_SESSION_ID);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_E_TAG);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_LAST_MODIFIED);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_MYSAPSSO2);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_SAP_CLIENT_ID);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_USER);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_ORGANIZATION);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_ELEMENT);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_PROXY_AUTHORIZATION);
			oFF.HttpConstants.store(oFF.HttpConstants.HD_SCC_LOCATION_ID);
		},
		store : function(theConstant) {
			oFF.HttpConstants.s_camelCaseLookupByLowerCase.put(oFF.XString
					.toLowerCase(theConstant), theConstant);
		},
		lookupCamelCase : function(anyCaseConstant) {
			var lowerCaseConstant = oFF.XString.toLowerCase(anyCaseConstant);
			var camelCaseKey = oFF.HttpConstants.s_camelCaseLookupByLowerCase
					.getByKey(lowerCaseConstant);
			if (oFF.isNull(camelCaseKey)) {
				return anyCaseConstant;
			}
			return camelCaseKey;
		}
	};
	oFF.HttpEncodings = {
		EN_DEFLATE : "deflate",
		EN_GZIP : "gzip"
	};
	oFF.HttpErrorCode = {
		HTTP_ROOT_EXCEPTION : 1000,
		HTTP_MISSING_NATIVE_DRIVER : 1001,
		HTTP_MISSING_BLOCKING_SUPPORT : 1002,
		HTTP_TIMEOUT : 1003,
		HTTP_CLIENT_CANCEL_REQUEST : 1004,
		HTTP_IO_EXCEPTION : 1005,
		HTTP_UNKNOWN_HOST_EXCEPTION : 1006,
		HTTP_WRONG_STATUS_CODE : 1007,
		HTTP_WRONG_CONTENT_TYPE : 1008,
		HTTP_EXCEPTION_WITH_NATIVE_CAUSE : 1009
	};
	oFF.HttpStatusCode = {
		SC_CONTINUE : 100,
		SC_SWITCHING : 101,
		SC_PROCESSING : 102,
		SC_OK : 200,
		SC_CREATED : 201,
		SC_ACCEPTED : 202,
		SC_NON_AUTHORITATIVE : 203,
		SC_NO_CONTENT : 204,
		SC_RESET_CONTENT : 205,
		SC_PARTIAL_CONTENT : 206,
		SC_MULTI_STATUS : 207,
		SC_ALREADY_REPORTED : 208,
		SC_IM_USED : 226,
		SC_MULTIPLE_CHOICES : 300,
		SC_MOVED_PERMANENTLY : 301,
		SC_FOUND : 302,
		SC_SEE_OTHER : 303,
		SC_UNAUTHORIZED : 401,
		SC_NOT_FOUND : 404,
		SC_NOT_ACCEPTABLE : 406,
		SC_INTERNAL_SERVER_ERROR : 500,
		SC_JSON_PARSE_ERROR : 607,
		isOk : function(code) {
			return code >= 200 && code < 300;
		}
	};
	oFF.HttpCookiesMasterStore = function() {
	};
	oFF.HttpCookiesMasterStore.prototype = new oFF.XObject();
	oFF.HttpCookiesMasterStore.create = function() {
		var newObj = new oFF.HttpCookiesMasterStore();
		newObj.m_domains = oFF.XHashMapByString.create();
		return newObj;
	};
	oFF.HttpCookiesMasterStore.prototype.m_domains = null;
	oFF.HttpCookiesMasterStore.prototype.getCookies = function(domain, path) {
		var cookiesStorage = oFF.HttpCookies.create();
		var currentDomain = domain;
		var currentPath = oFF.XStringBuffer.create();
		var domainCookies;
		var folders;
		var k;
		var pathCookies;
		var cookies;
		var i;
		var nextSubDomain;
		var lastSubDomain;
		while (oFF.notNull(currentDomain) && oFF.notNull(path)) {
			domainCookies = this.m_domains.getByKey(currentDomain);
			if (oFF.notNull(domainCookies)) {
				folders = oFF.XStringTokenizer.splitString(path, "/");
				while (folders.size() > 0) {
					for (k = 0; k < folders.size(); k++) {
						currentPath.append(folders.get(k)).append("/");
					}
					pathCookies = domainCookies
							.getByKey(currentPath.toString());
					currentPath.clear();
					if (oFF.notNull(pathCookies)) {
						cookies = pathCookies.getValuesAsReadOnlyList();
						for (i = 0; i < cookies.size(); i++) {
							cookiesStorage.addCookie(cookies.get(i));
						}
					}
					folders.removeAt(folders.size() - 1);
				}
			}
			nextSubDomain = oFF.XString.indexOfFrom(currentDomain, ".", 1);
			lastSubDomain = oFF.XString.lastIndexOf(currentDomain, ".");
			if (nextSubDomain === lastSubDomain) {
				break;
			}
			currentDomain = oFF.XString.substring(currentDomain, nextSubDomain,
					-1);
		}
		return cookiesStorage;
	};
	oFF.HttpCookiesMasterStore.prototype.applyCookies = function(domain, path,
			cookies) {
		var allNewCookies = cookies.getCookies();
		var i;
		var cookie;
		var currentDomain;
		var domainCookies;
		var currentPath;
		var pathCookies;
		for (i = 0; i < allNewCookies.size(); i++) {
			cookie = allNewCookies.get(i);
			currentDomain = cookie.getDomain();
			if (oFF.isNull(currentDomain)) {
				currentDomain = domain;
			}
			domainCookies = this.m_domains.getByKey(currentDomain);
			if (oFF.isNull(domainCookies)) {
				domainCookies = oFF.XHashMapByString.create();
				this.m_domains.put(currentDomain, domainCookies);
			}
			currentPath = cookie.getPath();
			if (oFF.isNull(currentPath)) {
				currentPath = path;
			}
			if (!oFF.XString.endsWith(currentPath, "/")) {
				currentPath = oFF.XStringUtils.concatenate2(currentPath, "/");
			}
			pathCookies = domainCookies.getByKey(currentPath);
			if (oFF.isNull(pathCookies)) {
				pathCookies = oFF.XHashMapByString.create();
				domainCookies.put(currentPath, pathCookies);
			}
			pathCookies.put(cookie.getName(), cookie);
		}
	};
	oFF.HttpCookiesMasterStore.prototype.toString = function() {
		var buffer = oFF.XStringBuffer.create();
		var domains = this.m_domains.getKeysAsReadOnlyListOfString();
		var sortedDomains = oFF.XListOfString.createFromReadOnlyList(domains);
		var i;
		var domain;
		var currentDomainStore;
		var paths;
		var sortedPath;
		var k;
		var path;
		var currentPathStore;
		var names;
		var sortedNames;
		var m;
		var cookie;
		sortedDomains.sortByDirection(oFF.XSortDirection.ASCENDING);
		for (i = 0; i < sortedDomains.size(); i++) {
			if (i > 0) {
				buffer.appendNewLine();
			}
			domain = sortedDomains.get(i);
			buffer.appendLine(domain);
			buffer.appendLine("=====================================");
			currentDomainStore = this.m_domains.getByKey(domain);
			paths = currentDomainStore.getKeysAsReadOnlyListOfString();
			sortedPath = oFF.XListOfString.createFromReadOnlyList(paths);
			for (k = 0; k < sortedPath.size(); k++) {
				path = sortedPath.get(k);
				buffer.appendLine(path);
				buffer.appendLine("-------------------------------------");
				currentPathStore = currentDomainStore.getByKey(path);
				names = currentPathStore.getKeysAsReadOnlyListOfString();
				sortedNames = oFF.XListOfString.createFromReadOnlyList(names);
				for (m = 0; m < sortedNames.size(); m++) {
					cookie = currentPathStore.getByKey(sortedNames.get(m));
					buffer.appendLine(cookie.toString());
				}
			}
		}
		return buffer.toString();
	};
	oFF.HttpCoreUtils = {
		setAuthentication : function(connectionInfo, httpHeader) {
			var authenticationType = connectionInfo.getAuthenticationType();
			var base64EncodeValue;
			var userPwdValue;
			var byteArray;
			var base64Encoded;
			var authentication;
			var theToken;
			var authenticationToken;
			var authentication2;
			var user;
			var organization;
			var element;
			var authentication3;
			var accessToken;
			var proxyAuthorization;
			var sccLocationId;
			var proxyHttpHeaders;
			var k;
			var singleHeader;
			if (authenticationType === oFF.AuthenticationType.BASIC) {
				base64EncodeValue = oFF.XStringBuffer.create();
				base64EncodeValue.append(connectionInfo.getUser());
				base64EncodeValue.append(":");
				base64EncodeValue.append(connectionInfo.getPassword());
				userPwdValue = base64EncodeValue.toString();
				byteArray = oFF.XByteArray.convertFromStringWithCharset(
						userPwdValue, oFF.XCharset.USASCII);
				base64Encoded = oFF.XHttpUtils
						.encodeByteArrayToBase64(byteArray);
				authentication = oFF.XStringBuffer.create();
				authentication.append(oFF.HttpConstants.VA_AUTHORIZATION_BASIC);
				authentication.append(" ");
				authentication.append(base64Encoded);
				httpHeader.setString(oFF.HttpConstants.HD_AUTHORIZATION,
						authentication.toString());
			} else {
				if (authenticationType === oFF.AuthenticationType.BEARER) {
					theToken = connectionInfo.getAccessToken();
					if (oFF.isNull(theToken)) {
						authenticationToken = connectionInfo
								.getAuthenticationToken();
						theToken = authenticationToken.getAccessToken();
					}
					if (oFF.notNull(theToken)) {
						authentication2 = oFF.XStringBuffer.create();
						authentication2
								.append(oFF.HttpConstants.VA_AUTHORIZATION_BEARER);
						authentication2.append(" ");
						authentication2.append(theToken);
						httpHeader.setString(
								oFF.HttpConstants.HD_AUTHORIZATION,
								authentication2.toString());
					}
				} else {
					if (authenticationType === oFF.AuthenticationType.SCP_OPEN_CONNECTORS) {
						user = connectionInfo.getUser();
						organization = connectionInfo.getOrganization();
						element = connectionInfo.getElement();
						authentication3 = oFF.XStringBuffer.create();
						authentication3.append(oFF.HttpConstants.HD_USER)
								.append(" ").append(user);
						authentication3.append(", ");
						authentication3.append(
								oFF.HttpConstants.HD_ORGANIZATION).append(" ")
								.append(organization);
						authentication3.append(", ");
						authentication3.append(oFF.HttpConstants.HD_ELEMENT)
								.append(" ").append(element);
						httpHeader.setString(
								oFF.HttpConstants.HD_AUTHORIZATION,
								authentication3.toString());
					} else {
						if (authenticationType === oFF.AuthenticationType.SCP_OAUTH_BEARER) {
							accessToken = connectionInfo.getAccessToken();
							if (oFF.notNull(accessToken)) {
								httpHeader
										.setString(
												oFF.HttpConstants.HD_SAP_CONNECTIVITY_AUTHENTICATION,
												accessToken);
							}
						}
					}
				}
			}
			if (connectionInfo.getProxyType() === oFF.ProxyType.PROXY) {
				proxyAuthorization = connectionInfo.getProxyAuthorization();
				if (oFF.notNull(proxyAuthorization)) {
					httpHeader.setString(
							oFF.HttpConstants.HD_PROXY_AUTHORIZATION,
							proxyAuthorization);
				}
				sccLocationId = connectionInfo.getSccLocationId();
				if (oFF.notNull(sccLocationId)) {
					httpHeader.setString(oFF.HttpConstants.HD_SCC_LOCATION_ID,
							sccLocationId);
				}
				proxyHttpHeaders = connectionInfo.getProxyHttpHeaders();
				if (oFF.notNull(proxyHttpHeaders)
						&& proxyHttpHeaders.size() > 0) {
					for (k = 0; k < proxyHttpHeaders.size(); k++) {
						singleHeader = proxyHttpHeaders.get(k);
						httpHeader.setString(singleHeader.getName(),
								singleHeader.getValue());
					}
				}
			}
		},
		setHostName : function(systemDescription, httpHeader) {
			var hostNameBuf = oFF.XStringBuffer.create();
			var port;
			var protocolType;
			var isHttp80;
			var isHttps443;
			hostNameBuf.append(systemDescription.getHost());
			port = systemDescription.getPort();
			if (port !== 0) {
				protocolType = systemDescription.getProtocolType();
				isHttp80 = protocolType === oFF.ProtocolType.HTTP
						&& port === 80;
				isHttps443 = protocolType === oFF.ProtocolType.HTTPS
						&& port === 443;
				if (!isHttp80 && !isHttps443) {
					hostNameBuf.append(":");
					hostNameBuf.append(oFF.XInteger.convertToString(port));
				}
			}
			httpHeader.setString(oFF.HttpConstants.HD_HOST, hostNameBuf
					.toString());
		},
		setLanguage : function(systemDescription, httpHeader) {
			var lang = systemDescription.getLanguage();
			if (oFF.XStringUtils.isNullOrEmpty(lang)) {
				lang = oFF.HttpConstants.VA_LANGUAGE_ENGLISH;
			}
			httpHeader.setString(oFF.HttpConstants.HD_ACCEPT_LANGUAGE, lang);
		},
		setAccept : function(httpHeader, request) {
			var acceptContentType = request.getAcceptContentType();
			httpHeader.setString(oFF.HttpConstants.HD_ACCEPT, acceptContentType
					.getName());
			httpHeader.setString(oFF.HttpConstants.HD_ACCEPT_CHARSET,
					oFF.HttpConstants.UTF_8);
			if (request.isAcceptGzip()) {
				httpHeader.setString(oFF.HttpConstants.HD_ACCEPT_ENCODING,
						oFF.HttpEncodings.EN_GZIP);
			}
		},
		addCookies : function(request, httpHeader) {
			var cookies = request.getCookies();
			var cookieNames = cookies.getCookieNames();
			var buffer;
			var hasEntry;
			var k;
			var name;
			var selectedCookies;
			var j;
			var selectedCookie;
			var cookiePath;
			var requestPath;
			var cookiePathLength;
			var nextRequestPathChar;
			var value;
			if (cookieNames.isEmpty()) {
				return;
			}
			buffer = oFF.XStringBuffer.create();
			hasEntry = false;
			for (k = 0; k < cookieNames.size(); k++) {
				name = cookieNames.get(k);
				selectedCookies = cookies.getCookiesByName(name);
				for (j = 0; j < selectedCookies.size(); j++) {
					selectedCookie = selectedCookies.get(j);
					cookiePath = selectedCookie.getPath();
					if (!oFF.XStringUtils.isNullOrEmpty(cookiePath)) {
						requestPath = request.getPath();
						if (oFF.XStringUtils.isNullOrEmpty(requestPath)) {
							throw oFF.XException
									.createIllegalStateException("no request path");
						}
						if (!oFF.XString.isEqual(requestPath, cookiePath)) {
							if (!oFF.XString
									.startsWith(requestPath, cookiePath)) {
								continue;
							}
							if (!oFF.XString.endsWith(cookiePath, "/")) {
								cookiePathLength = oFF.XString.size(cookiePath);
								nextRequestPathChar = oFF.XString.substring(
										requestPath, cookiePathLength,
										cookiePathLength + 1);
								if (!oFF.XString.isEqual(nextRequestPathChar,
										"/")) {
									continue;
								}
							}
						}
					}
					if (hasEntry) {
						buffer.append(";");
					} else {
						hasEntry = true;
					}
					value = selectedCookies.get(j).getValue();
					buffer.append(name);
					buffer.append("=");
					buffer.append(value);
				}
			}
			httpHeader
					.setString(oFF.HttpConstants.HD_COOKIE, buffer.toString());
		},
		populateHeaderFromRequest : function(systemDescription, httpHeader,
				request, postDataUtf8Len, handleAuthentication) {
			var requestMethod;
			var bufferContentType;
			var headerFields;
			var keys;
			var key;
			if (handleAuthentication) {
				oFF.HttpCoreUtils.setAuthentication(systemDescription,
						httpHeader);
			}
			oFF.HttpCoreUtils.setHostName(systemDescription, httpHeader);
			oFF.HttpCoreUtils.setLanguage(systemDescription, httpHeader);
			oFF.HttpCoreUtils.setAccept(httpHeader, request);
			httpHeader.setString(oFF.HttpConstants.HD_USER_AGENT,
					oFF.HttpConstants.FIREFLY_USER_AGENT);
			httpHeader.setString(oFF.HttpConstants.HD_CONNECTION,
					oFF.HttpConstants.VA_CONNECTION_CLOSE);
			requestMethod = request.getMethod();
			if ((requestMethod === oFF.HttpRequestMethod.HTTP_POST || requestMethod === oFF.HttpRequestMethod.HTTP_PUT)
					&& (request.getString() !== null || request.getByteArray() !== null)) {
				bufferContentType = oFF.XStringBuffer.create();
				bufferContentType.append(request.getContentType().getName());
				bufferContentType.append(";charset=utf-8");
				httpHeader.setString(oFF.HttpConstants.HD_CONTENT_TYPE,
						bufferContentType.toString());
				httpHeader.setInteger(oFF.HttpConstants.HD_CONTENT_LENGTH,
						postDataUtf8Len);
			}
			if (request.getCookies() !== null) {
				oFF.HttpCoreUtils.addCookies(request, httpHeader);
			}
			headerFields = request.getHeaderFields();
			keys = headerFields.getKeysAsIteratorOfString();
			while (keys.hasNext()) {
				key = keys.next();
				httpHeader.setString(key, headerFields.getByKey(key));
			}
			return httpHeader;
		},
		createHttpRequestString : function(request, httpHeader) {
			var httpBuffer = oFF.XStringBuffer.create();
			var escapedQuery;
			httpBuffer.append(request.getMethod().getName());
			httpBuffer.append(" ");
			httpBuffer.append(request.getPath());
			escapedQuery = request.getQuery();
			if (oFF.notNull(escapedQuery)) {
				httpBuffer.append("?");
				httpBuffer.append(escapedQuery);
			}
			httpBuffer.append(" ");
			httpBuffer.append(oFF.HttpConstants.HTTP_11);
			httpBuffer.append(oFF.HttpConstants.HTTP_CRLF);
			httpBuffer.append(httpHeader.generateHttpHeaderString());
			httpBuffer.append(oFF.HttpConstants.HTTP_CRLF);
			httpBuffer.append(oFF.HttpConstants.HTTP_CRLF);
			return httpBuffer.toString();
		}
	};
	oFF.HttpErrorCause = function() {
	};
	oFF.HttpErrorCause.prototype = new oFF.XObject();
	oFF.HttpErrorCause.prototype.m_httpResponse = null;
	oFF.HttpErrorCause.prototype.m_extendedInfo = null;
	oFF.HttpErrorCause.prototype.m_errorCode = 0;
	oFF.HttpErrorCause.prototype.m_httpRequest = null;
	oFF.HttpErrorCause.prototype.releaseObject = function() {
		this.m_httpRequest = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.HttpErrorCause.prototype.setHttpRequest = function(httpRequest) {
		this.m_httpRequest = httpRequest;
	};
	oFF.HttpErrorCause.prototype.getHttpRequest = function() {
		return this.m_httpRequest;
	};
	oFF.HttpErrorCause.prototype.setHttpResponse = function(httpResponse) {
		this.m_httpResponse = httpResponse;
	};
	oFF.HttpErrorCause.prototype.getHttpResponse = function() {
		return this.m_httpResponse;
	};
	oFF.HttpErrorCause.prototype.setExtendedInfo = function(extendedInfo) {
		this.m_extendedInfo = extendedInfo;
	};
	oFF.HttpErrorCause.prototype.getExtendedInfo = function() {
		return this.m_extendedInfo;
	};
	oFF.HttpErrorCause.prototype.setErrorCode = function(errorCode) {
		this.m_errorCode = errorCode;
	};
	oFF.HttpErrorCause.prototype.getErrorCode = function() {
		return this.m_errorCode;
	};
	oFF.HttpErrorCause.prototype.toString = function() {
		var sb = oFF.XStringBuffer.create();
		var requestString;
		var responseString;
		if (this.m_errorCode !== 0) {
			sb.appendInt(this.m_errorCode).appendNewLine();
		}
		if (oFF.notNull(this.m_httpRequest)) {
			requestString = this.m_httpRequest.toString();
			if (oFF.notNull(requestString)) {
				sb.appendLine(requestString);
			}
		}
		if (oFF.notNull(this.m_httpResponse)) {
			responseString = this.m_httpResponse.toString();
			if (oFF.notNull(responseString)) {
				sb.appendLine(responseString);
			}
		}
		if (oFF.notNull(this.m_extendedInfo)) {
			sb.appendLine("Native error cause is available.");
		}
		return sb.toString();
	};
	oFF.HttpHeader = function() {
	};
	oFF.HttpHeader.prototype = new oFF.XObject();
	oFF.HttpHeader.create = function() {
		var header = new oFF.HttpHeader();
		header.setup();
		return header;
	};
	oFF.HttpHeader.prototype.m_headerMap = null;
	oFF.HttpHeader.prototype.setup = function() {
		this.m_headerMap = oFF.XProperties.create();
	};
	oFF.HttpHeader.prototype.releaseObject = function() {
		this.m_headerMap = oFF.XObjectExt.release(this.m_headerMap);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.HttpHeader.prototype.getString = function(propertyName) {
		return this.m_headerMap.getByKey(propertyName);
	};
	oFF.HttpHeader.prototype.setString = function(propertyName, value) {
		this.m_headerMap.put(propertyName, value);
	};
	oFF.HttpHeader.prototype.setInteger = function(propertyName, value) {
		this.m_headerMap.put(propertyName, oFF.XInteger.convertToString(value));
	};
	oFF.HttpHeader.prototype.getIntValue = function(propertyName) {
		var value = this.m_headerMap.getByKey(propertyName);
		return oFF.XInteger.convertFromString(value);
	};
	oFF.HttpHeader.prototype.getProperties = function() {
		return this.m_headerMap;
	};
	oFF.HttpHeader.prototype.generateHttpHeaderString = function() {
		var sb;
		var iterator;
		var i;
		var key;
		var value;
		if (oFF.isNull(this.m_headerMap) || this.m_headerMap.isEmpty()) {
			return "";
		}
		sb = oFF.XStringBuffer.create();
		iterator = this.m_headerMap.getKeysAsIteratorOfString();
		for (i = 0; iterator.hasNext(); i++) {
			if (i > 0) {
				sb.append(oFF.HttpConstants.HTTP_CRLF);
			}
			key = iterator.next();
			value = this.m_headerMap.getByKey(key);
			sb.append(key);
			sb.append(": ");
			sb.append(value);
		}
		return sb.toString();
	};
	oFF.HttpHeader.prototype.toString = function() {
		return this.generateHttpHeaderString();
	};
	oFF.HttpRawData = function() {
	};
	oFF.HttpRawData.prototype = new oFF.XObject();
	oFF.HttpRawData.create = function(protocol, host, port, data) {
		var object = new oFF.HttpRawData();
		object.setupExt(protocol, host, port, data);
		return object;
	};
	oFF.HttpRawData.prototype.m_host = null;
	oFF.HttpRawData.prototype.m_port = 0;
	oFF.HttpRawData.prototype.m_protocolType = null;
	oFF.HttpRawData.prototype.m_data = null;
	oFF.HttpRawData.prototype.setupExt = function(protocol, host, port, data) {
		this.m_protocolType = protocol;
		this.m_host = host;
		this.m_port = port;
		this.m_data = data;
	};
	oFF.HttpRawData.prototype.releaseObject = function() {
		this.m_host = null;
		this.m_protocolType = null;
		this.m_data = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.HttpRawData.prototype.getHost = function() {
		return this.m_host;
	};
	oFF.HttpRawData.prototype.getPort = function() {
		return this.m_port;
	};
	oFF.HttpRawData.prototype.getProtocolType = function() {
		return this.m_protocolType;
	};
	oFF.HttpRawData.prototype.getByteArray = function() {
		return this.m_data;
	};
	oFF.RpcFunctionFactory = function() {
	};
	oFF.RpcFunctionFactory.prototype = new oFF.XObject();
	oFF.RpcFunctionFactory.s_factoryByProtocol = null;
	oFF.RpcFunctionFactory.s_factoryBySystemType = null;
	oFF.RpcFunctionFactory.staticSetupFunctionFactory = function() {
		oFF.RpcFunctionFactory.s_factoryByProtocol = oFF.XHashMapByString
				.create();
		oFF.RpcFunctionFactory.s_factoryBySystemType = oFF.XHashMapByString
				.create();
	};
	oFF.RpcFunctionFactory.registerFactory = function(protocolType, systemType,
			factory) {
		if (oFF.notNull(protocolType)) {
			oFF.RpcFunctionFactory.s_factoryByProtocol.put(protocolType
					.getName(), factory);
		}
		if (oFF.notNull(systemType)) {
			oFF.RpcFunctionFactory.s_factoryBySystemType.put(systemType
					.getName(), factory);
		}
	};
	oFF.RpcFunctionFactory.create = function(context, connectionInfo, name,
			systemType, protocolType) {
		var factory = null;
		if (oFF.notNull(systemType)) {
			factory = oFF.RpcFunctionFactory.s_factoryBySystemType
					.getByKey(systemType.getName());
		}
		if (oFF.isNull(factory)) {
			factory = oFF.RpcFunctionFactory.s_factoryByProtocol
					.getByKey(protocolType.getName());
		}
		if (oFF.isNull(factory)) {
			return null;
		}
		return factory.newRpcFunction(context, connectionInfo, name,
				systemType, protocolType);
	};
	oFF.RpcRequest = function() {
	};
	oFF.RpcRequest.prototype = new oFF.XObject();
	oFF.RpcRequest.create = function(ocpFunction, connectionInfo) {
		var request = new oFF.RpcRequest();
		request.setupExt(ocpFunction, connectionInfo);
		return request;
	};
	oFF.RpcRequest.prototype.m_type = null;
	oFF.RpcRequest.prototype.m_function = null;
	oFF.RpcRequest.prototype.m_connectionInfo = null;
	oFF.RpcRequest.prototype.m_mainParameterStructure = null;
	oFF.RpcRequest.prototype.m_method = null;
	oFF.RpcRequest.prototype.m_additionalParameters = null;
	oFF.RpcRequest.prototype.m_acceptContentType = null;
	oFF.RpcRequest.prototype.m_requestContentType = null;
	oFF.RpcRequest.prototype.m_isFireAndForgetCall = false;
	oFF.RpcRequest.prototype.m_userToken = null;
	oFF.RpcRequest.prototype.m_organizationToken = null;
	oFF.RpcRequest.prototype.m_elementToken = null;
	oFF.RpcRequest.prototype.setupExt = function(ocpFunction, connectionInfo) {
		this.m_type = oFF.RpcRequestType.NONE;
		this.m_method = oFF.HttpRequestMethod.HTTP_POST;
		this.m_acceptContentType = oFF.ContentType.APPLICATION_JSON;
		this.m_requestContentType = oFF.ContentType.APPLICATION_JSON;
		this.m_additionalParameters = oFF.XProperties.create();
		this.setFunction(ocpFunction);
		this.setConnectionInfo(connectionInfo);
	};
	oFF.RpcRequest.prototype.releaseObject = function() {
		this.m_type = null;
		this.m_function = null;
		this.m_connectionInfo = null;
		this.m_mainParameterStructure = null;
		this.m_method = null;
		this.m_acceptContentType = null;
		this.m_requestContentType = null;
		this.m_additionalParameters = oFF.XObjectExt
				.release(this.m_additionalParameters);
		this.m_userToken = null;
		this.m_organizationToken = null;
		this.m_elementToken = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.RpcRequest.prototype.getRequestStructure = function() {
		return this.m_mainParameterStructure;
	};
	oFF.RpcRequest.prototype.getRequestType = function() {
		return this.m_type;
	};
	oFF.RpcRequest.prototype.setRequestStructure = function(requestStructure) {
		this.m_mainParameterStructure = requestStructure;
		this.m_type = oFF.RpcRequestType.detectTypeFromJson(requestStructure);
	};
	oFF.RpcRequest.prototype.getMethod = function() {
		return this.m_method;
	};
	oFF.RpcRequest.prototype.setMethod = function(method) {
		this.m_method = method;
	};
	oFF.RpcRequest.prototype.getAdditionalParameters = function() {
		return this.m_additionalParameters;
	};
	oFF.RpcRequest.prototype.getAcceptContentType = function() {
		return this.m_acceptContentType;
	};
	oFF.RpcRequest.prototype.setAcceptContentType = function(contentType) {
		this.m_acceptContentType = contentType;
	};
	oFF.RpcRequest.prototype.getRequestContentType = function() {
		return this.m_requestContentType;
	};
	oFF.RpcRequest.prototype.setRequestContentType = function(contentType) {
		this.m_requestContentType = contentType;
	};
	oFF.RpcRequest.prototype.getFunction = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_function);
	};
	oFF.RpcRequest.prototype.setFunction = function(ocpFunction) {
		this.m_function = oFF.XWeakReferenceUtil.getWeakRef(ocpFunction);
	};
	oFF.RpcRequest.prototype.getConnectionInfo = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_connectionInfo);
	};
	oFF.RpcRequest.prototype.setConnectionInfo = function(connectionInfo) {
		this.m_connectionInfo = oFF.XWeakReferenceUtil
				.getWeakRef(connectionInfo);
	};
	oFF.RpcRequest.prototype.isFireAndForgetCall = function() {
		return this.m_isFireAndForgetCall;
	};
	oFF.RpcRequest.prototype.setIsFireAndForgetCall = function(
			isFireAndForgetCall) {
		this.m_isFireAndForgetCall = isFireAndForgetCall;
	};
	oFF.RpcRequest.prototype.setTokens = function(user, organization, element) {
		this.m_userToken = user;
		this.m_organizationToken = organization;
		this.m_elementToken = element;
	};
	oFF.RpcRequest.prototype.getUserToken = function() {
		return this.m_userToken;
	};
	oFF.RpcRequest.prototype.getOrganizationToken = function() {
		return this.m_organizationToken;
	};
	oFF.RpcRequest.prototype.getElementToken = function() {
		return this.m_elementToken;
	};
	oFF.RpcResponse = function() {
	};
	oFF.RpcResponse.prototype = new oFF.XObject();
	oFF.RpcResponse.create = function(ocpFunction) {
		var request = new oFF.RpcResponse();
		request.setupExt(ocpFunction);
		return request;
	};
	oFF.RpcResponse.prototype.m_function = null;
	oFF.RpcResponse.prototype.m_rootElement = null;
	oFF.RpcResponse.prototype.m_rootElementString = null;
	oFF.RpcResponse.prototype.setupExt = function(ocpFunction) {
		this.setFunction(ocpFunction);
	};
	oFF.RpcResponse.prototype.releaseObject = function() {
		this.m_function = null;
		this.m_rootElement = null;
		this.m_rootElementString = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.RpcResponse.prototype.getRootElement = function() {
		if (oFF.notNull(this.m_rootElement) && this.m_rootElement.isStructure()) {
			return this.m_rootElement;
		}
		return null;
	};
	oFF.RpcResponse.prototype.getRootElementGeneric = function() {
		return this.m_rootElement;
	};
	oFF.RpcResponse.prototype.setRootElement = function(rootElement,
			rootElementAsString) {
		this.m_rootElement = rootElement;
		this.m_rootElementString = rootElementAsString;
	};
	oFF.RpcResponse.prototype.getRootElementAsString = function() {
		return this.m_rootElementString;
	};
	oFF.RpcResponse.prototype.getFunction = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_function);
	};
	oFF.RpcResponse.prototype.setFunction = function(ocpFunction) {
		this.m_function = oFF.XWeakReferenceUtil.getWeakRef(ocpFunction);
	};
	oFF.RpcResponse.prototype.toString = function() {
		if (oFF.isNull(this.m_rootElement)) {
			return "Ocp response: No element defined.\n";
		}
		return oFF.XStringUtils.concatenate2(this.m_rootElement.toString(),
				"\n");
	};
	oFF.XUserSettingsFactory = function() {
	};
	oFF.XUserSettingsFactory.prototype = new oFF.XObject();
	oFF.XUserSettingsFactory.s_factory = null;
	oFF.XUserSettingsFactory.create = function(session) {
		if (oFF.isNull(oFF.XUserSettingsFactory.s_factory)) {
			return oFF.XProperties.create();
		}
		return oFF.XUserSettingsFactory.s_factory.newUserSettings(session);
	};
	oFF.XUserSettingsFactory.registerFactory = function(factory) {
		oFF.XUserSettingsFactory.s_factory = factory;
	};
	oFF.SqlDriverFactory = function() {
	};
	oFF.SqlDriverFactory.prototype = new oFF.XObject();
	oFF.SqlDriverFactory.s_driverFactory = null;
	oFF.SqlDriverFactory.create = function(driverName) {
		if (oFF.notNull(oFF.SqlDriverFactory.s_driverFactory)) {
			return oFF.SqlDriverFactory.s_driverFactory
					.newSqlDriver(driverName);
		}
		return null;
	};
	oFF.SqlDriverFactory.registerFactory = function(driverFactory) {
		oFF.SqlDriverFactory.s_driverFactory = driverFactory;
	};
	oFF.NetworkEnv = function() {
	};
	oFF.NetworkEnv.prototype = new oFF.XObject();
	oFF.NetworkEnv.s_nativeEnvironment = null;
	oFF.NetworkEnv.staticSetup = function() {
		oFF.NetworkEnv.setNative(new oFF.NetworkEnv());
	};
	oFF.NetworkEnv.setNative = function(nativeNetworkEnv) {
		oFF.NetworkEnv.s_nativeEnvironment = nativeNetworkEnv;
	};
	oFF.NetworkEnv.getLocation = function() {
		return oFF.NetworkEnv.s_nativeEnvironment.getNativeLocation();
	};
	oFF.NetworkEnv.setLocation = function(location) {
		oFF.NetworkEnv.s_nativeEnvironment.setNativeLocation(location);
	};
	oFF.NetworkEnv.getFragment = function() {
		return oFF.NetworkEnv.s_nativeEnvironment.getNativeFragment();
	};
	oFF.NetworkEnv.setFragment = function(fragment) {
		oFF.NetworkEnv.s_nativeEnvironment.setNativeFragment(fragment);
	};
	oFF.NetworkEnv.setDomain = function(domain) {
		oFF.NetworkEnv.s_nativeEnvironment.setNativeDomain(domain);
	};
	oFF.NetworkEnv.prototype.m_location = null;
	oFF.NetworkEnv.prototype.m_fragment = null;
	oFF.NetworkEnv.prototype.getNativeLocation = function() {
		return this.m_location;
	};
	oFF.NetworkEnv.prototype.setNativeLocation = function(location) {
		this.m_location = location;
	};
	oFF.NetworkEnv.prototype.getNativeFragment = function() {
		return this.m_fragment;
	};
	oFF.NetworkEnv.prototype.setNativeFragment = function(fragment) {
		this.m_fragment = fragment;
	};
	oFF.NetworkEnv.prototype.setNativeDomain = function(domain) {
	};
	oFF.Dispatcher = {
		s_singleton : null,
		staticSetup : function() {
			oFF.Dispatcher.s_singleton = oFF.DispatcherSingleThread.create();
		},
		getInstance : function() {
			return oFF.Dispatcher.s_singleton;
		},
		setInstance : function(dispatcher) {
			oFF.Dispatcher.s_singleton = dispatcher;
		},
		replaceInstance : function(dispatcher) {
			var oldDispatcher = oFF.Dispatcher.getInstance();
			if (oFF.notNull(oldDispatcher)) {
				oFF.XObjectExt.release(oldDispatcher);
			}
			oFF.Dispatcher.setInstance(dispatcher);
		}
	};
	oFF.ProgramArgs = function() {
	};
	oFF.ProgramArgs.prototype = new oFF.XObject();
	oFF.ProgramArgs.createWithString = function(argString) {
		var startDef = new oFF.ProgramArgs();
		startDef.setArgumentString(argString);
		return startDef;
	};
	oFF.ProgramArgs.createWithList = function(argList) {
		var startDef = new oFF.ProgramArgs();
		startDef.setArgumentList(argList);
		return startDef;
	};
	oFF.ProgramArgs.createWithStructure = function(argStructure) {
		var startDef = new oFF.ProgramArgs();
		startDef.setArgumentStructure(argStructure);
		return startDef;
	};
	oFF.ProgramArgs.create = function() {
		var startDef = new oFF.ProgramArgs();
		return startDef;
	};
	oFF.ProgramArgs.prototype.m_argString = null;
	oFF.ProgramArgs.prototype.m_argList = null;
	oFF.ProgramArgs.prototype.m_argStructure = null;
	oFF.ProgramArgs.prototype.m_isArgumentStringOrigin = false;
	oFF.ProgramArgs.prototype.m_isArgumentListOrigin = false;
	oFF.ProgramArgs.prototype.m_isArgumentStructureOrigin = false;
	oFF.ProgramArgs.prototype.m_argDefs = null;
	oFF.ProgramArgs.prototype.releaseObject = function() {
		this.m_argDefs = null;
		this.m_argString = null;
		this.m_argList = null;
		this.m_argStructure = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.ProgramArgs.prototype.setArgumentString = function(argString) {
		this.m_argString = argString;
		this.m_isArgumentStringOrigin = true;
	};
	oFF.ProgramArgs.prototype.getArgumentString = function() {
		return this.m_argString;
	};
	oFF.ProgramArgs.prototype.setArgumentList = function(argList) {
		this.m_argList = argList;
		this.m_isArgumentListOrigin = true;
	};
	oFF.ProgramArgs.prototype.getArgumentList = function() {
		if (oFF.isNull(this.m_argList) && oFF.notNull(this.m_argString)) {
			this.m_argList = oFF.ProgramUtils
					.createArgValueList(this.m_argString);
		}
		if (oFF.isNull(this.m_argList)) {
			this.m_argList = oFF.XListOfString.create();
		}
		return this.m_argList;
	};
	oFF.ProgramArgs.prototype.setArgumentStructure = function(argStructure) {
		this.m_argStructure = argStructure;
		this.m_isArgumentStructureOrigin = true;
	};
	oFF.ProgramArgs.prototype.getArgumentStructure = function() {
		var initArgumentsList;
		if (oFF.isNull(this.m_argStructure) && oFF.notNull(this.m_argDefs)) {
			initArgumentsList = this.getArgumentList();
			if (oFF.notNull(initArgumentsList)) {
				this.m_argStructure = oFF.ProgramUtils
						.createArgStructureFromList(this.m_argDefs,
								initArgumentsList, 0);
			}
		}
		if (oFF.isNull(this.m_argStructure)) {
			this.m_argStructure = oFF.PrFactory.createStructure();
		}
		return this.m_argStructure;
	};
	oFF.ProgramArgs.prototype.setArgumentDefinitions = function(argDefs) {
		this.m_argDefs = argDefs;
	};
	oFF.ProgramArgs.prototype.getArgumentDefinitions = function() {
		return this.m_argDefs;
	};
	oFF.ProgramArgs.prototype.isArgumentStringOrigin = function() {
		return this.m_isArgumentStringOrigin;
	};
	oFF.ProgramArgs.prototype.isArgumentListOrigin = function() {
		return this.m_isArgumentListOrigin;
	};
	oFF.ProgramArgs.prototype.isArgumentStructureOrigin = function() {
		return this.m_isArgumentStructureOrigin;
	};
	oFF.ProgramContainer = function() {
	};
	oFF.ProgramContainer.prototype = new oFF.XObject();
	oFF.ProgramContainer.prototype.m_title = null;
	oFF.ProgramContainer.prototype.m_listener = null;
	oFF.ProgramContainer.prototype.m_startCfg = null;
	oFF.ProgramContainer.prototype.m_program = null;
	oFF.ProgramContainer.prototype.setupContainer = function(startCfg, program) {
		this.m_startCfg = startCfg;
		this.m_program = program;
	};
	oFF.ProgramContainer.prototype.releaseObject = function() {
		this.m_startCfg = null;
		this.m_program = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.ProgramContainer.prototype.getTitle = function() {
		return this.m_title;
	};
	oFF.ProgramContainer.prototype.setTitle = function(title) {
		this.m_title = title;
	};
	oFF.ProgramContainer.prototype.registerOnSigTerm = function(listener) {
		this.m_listener = listener;
	};
	oFF.ProgramContainer.prototype.getListenerOnSigTerm = function() {
		return this.m_listener;
	};
	oFF.ProgramContainer.prototype.getStartCfg = function() {
		return this.m_startCfg;
	};
	oFF.ProgramContainer.prototype.getProgram = function() {
		return this.m_program;
	};
	oFF.ProgramRegistration = {
		s_appFactories : null,
		staticSetup : function() {
			oFF.ProgramRegistration.s_appFactories = oFF.XHashMapByString
					.create();
		},
		setProgramFactory : function(name, uiProgramFactory) {
			oFF.ProgramRegistration.s_appFactories.put(name, uiProgramFactory);
		},
		getProgramFactory : function(name) {
			return oFF.ProgramRegistration.s_appFactories.getByKey(name);
		}
	};
	oFF.ProgramUtils = {
		createArgStructureFromString : function(programMetadata, argLine) {
			var argList = oFF.ProgramUtils.createArgValueList(argLine);
			var argStructure = oFF.ProgramUtils.createArgStructureFromList(
					programMetadata.getArgDefinitions(), argList, 0);
			return argStructure;
		},
		createArgStructureFromList : function(argDefList, argList, startOffset) {
			var initArgsStructure = oFF.PrStructure.create();
			var offset;
			var value;
			var delim;
			var leftSide;
			var rightSide;
			var argMd;
			var valueType;
			var intValue;
			var theParameters;
			var i;
			var parameter;
			var value2;
			var theList;
			var m;
			if (argList.size() > startOffset) {
				offset = startOffset;
				for (; offset < argList.size(); offset++) {
					value = argList.get(offset);
					if (oFF.XString.startsWith(value, "-")) {
						delim = oFF.XString.indexOf(value, ":");
						leftSide = null;
						rightSide = null;
						if (delim !== -1) {
							leftSide = oFF.XString.trim(oFF.XString.substring(
									value, 1, delim));
							rightSide = oFF.XString.trim(oFF.XString.substring(
									value, delim + 1, -1));
						} else {
							delim = oFF.XString.indexOf(value, "=");
							if (delim !== -1) {
								leftSide = oFF.XString.trim(oFF.XString
										.substring(value, 1, delim));
								rightSide = oFF.XString.trim(oFF.XString
										.substring(value, delim + 1, -1));
							} else {
								leftSide = oFF.XString.trim(oFF.XString
										.substring(value, 1, -1));
							}
						}
						argMd = argDefList.getByKey(leftSide);
						if (oFF.notNull(argMd)) {
							valueType = argMd.getValueType();
							if (valueType === oFF.XValueType.BOOLEAN) {
								if (oFF.XStringUtils.isNullOrEmpty(rightSide)) {
									initArgsStructure
											.putBoolean(leftSide, true);
								} else {
									initArgsStructure.putBoolean(leftSide,
											oFF.XString.isEqual(rightSide,
													"true"));
								}
							} else {
								if (valueType === oFF.XValueType.INTEGER) {
									if (oFF.XStringUtils
											.isNullOrEmpty(rightSide)) {
										initArgsStructure.putInteger(leftSide,
												0);
									} else {
										intValue = oFF.XInteger
												.convertFromStringWithDefault(
														rightSide, 0);
										initArgsStructure.putInteger(leftSide,
												intValue);
									}
								} else {
									initArgsStructure.putString(leftSide,
											rightSide);
								}
							}
						}
					} else {
						break;
					}
				}
				theParameters = oFF.ProgramUtils.getParameters(argDefList);
				for (i = 0; i + offset < argList.size()
						&& i < theParameters.size(); i++) {
					parameter = theParameters.get(i);
					if (parameter.getValueType() === oFF.XValueType.ARRAY) {
						theList = initArgsStructure.putNewList(parameter
								.getName());
						for (m = i + offset; m < argList.size(); m++) {
							value2 = argList.get(m);
							theList.addString(value2);
						}
						break;
					} else {
						value2 = argList.get(i + offset);
						initArgsStructure
								.putString(parameter.getName(), value2);
					}
				}
			}
			return initArgsStructure;
		},
		generateHelp : function(programMetadata) {
			var buffer = oFF.XStringBuffer.create();
			var argumentMetadata = programMetadata.getArgDefinitions();
			var hasOptions = false;
			var hasParams = false;
			var k;
			var argMd3;
			var firstLine;
			var i;
			var argMd;
			var innerBuffer;
			var m;
			var argMd4;
			var innerBuffer2;
			var j;
			var argMd2;
			for (k = 0; k < argumentMetadata.size(); k++) {
				argMd3 = argumentMetadata.get(k);
				if (argMd3.isParameter()) {
					hasParams = true;
				} else {
					hasOptions = true;
				}
			}
			buffer.append("SYNTAX ").appendNewLine();
			buffer.append("   prgName ");
			if (hasOptions) {
				buffer.append("[OPTIONS] ");
			}
			if (hasParams) {
				for (i = 0; i < argumentMetadata.size(); i++) {
					argMd = argumentMetadata.get(i);
					if (argMd.isParameter() === true) {
						buffer.append(argMd.getName()).append(" ");
					}
				}
				buffer.appendNewLine();
				buffer.appendNewLine();
				innerBuffer = oFF.TwoColumnBuffer.create();
				firstLine = true;
				for (m = 0; m < argumentMetadata.size(); m++) {
					argMd4 = argumentMetadata.get(m);
					if (argMd4.isParameter() === true) {
						if (firstLine === false) {
							innerBuffer.appendNewLine();
						} else {
							firstLine = false;
						}
						innerBuffer.append("   ").append(argMd4.getName());
						innerBuffer.nextColumn();
						innerBuffer.append(argMd4.getText());
					}
				}
				buffer.append(innerBuffer.toString());
			}
			if (hasOptions) {
				buffer.appendNewLine();
				buffer.appendNewLine();
				buffer.append("OPTIONS").appendNewLine();
				innerBuffer2 = oFF.TwoColumnBuffer.create();
				firstLine = true;
				for (j = 0; j < argumentMetadata.size(); j++) {
					argMd2 = argumentMetadata.get(j);
					if (argMd2.isParameter() === false) {
						if (firstLine === false) {
							innerBuffer2.appendNewLine();
						} else {
							firstLine = false;
						}
						innerBuffer2.append("  -").append(argMd2.getName());
						if (argMd2.getValueType() === oFF.XValueType.BOOLEAN) {
							innerBuffer2.append("[:");
							innerBuffer2.append(argMd2.getPossibleValues());
							innerBuffer2.append("]");
						} else {
							innerBuffer2.append(":");
							innerBuffer2.append(argMd2.getPossibleValues());
						}
						innerBuffer2.nextColumn();
						innerBuffer2.append(argMd2.getText());
					}
				}
				buffer.append(innerBuffer2.toString());
			}
			return buffer.toString();
		},
		createArgValueList : function(argLine) {
			var result = null;
			var trimmed;
			if (oFF.XStringUtils.isNotNullAndNotEmpty(argLine)) {
				trimmed = oFF.XString.trim(argLine);
				if (oFF.XStringUtils.isNotNullAndNotEmpty(trimmed)) {
					result = oFF.XStringTokenizer.splitString(trimmed, " ");
				}
			}
			if (oFF.isNull(result)) {
				result = oFF.XListOfString.create();
			}
			return result;
		},
		getParameters : function(argDefList) {
			var parameterList = oFF.XList.create();
			var i;
			var arg;
			for (i = 0; i < argDefList.size(); i++) {
				arg = argDefList.get(i);
				if (arg.isParameter()) {
					parameterList.add(arg);
				}
			}
			return parameterList;
		}
	};
	oFF.TwoColumnBuffer = function() {
	};
	oFF.TwoColumnBuffer.prototype = new oFF.XObject();
	oFF.TwoColumnBuffer.create = function() {
		var newObj = new oFF.TwoColumnBuffer();
		newObj.setup();
		return newObj;
	};
	oFF.TwoColumnBuffer.prototype.m_lines = null;
	oFF.TwoColumnBuffer.prototype.m_currentLine = null;
	oFF.TwoColumnBuffer.prototype.m_currentColumn = null;
	oFF.TwoColumnBuffer.prototype.m_spaceCount = 0;
	oFF.TwoColumnBuffer.prototype.setup = function() {
		this.clear();
		this.m_spaceCount = 2;
	};
	oFF.TwoColumnBuffer.prototype.appendLine = function(value) {
		this.m_currentColumn.append(value);
		this.appendNewLine();
		return this;
	};
	oFF.TwoColumnBuffer.prototype.append = function(value) {
		this.m_currentColumn.append(value);
		return this;
	};
	oFF.TwoColumnBuffer.prototype.appendChar = function(value) {
		this.m_currentColumn.appendChar(value);
		return this;
	};
	oFF.TwoColumnBuffer.prototype.appendBoolean = function(value) {
		this.m_currentColumn.appendBoolean(value);
		return this;
	};
	oFF.TwoColumnBuffer.prototype.appendInt = function(value) {
		this.m_currentColumn.appendInt(value);
		return this;
	};
	oFF.TwoColumnBuffer.prototype.appendLong = function(value) {
		this.m_currentColumn.appendLong(value);
		return this;
	};
	oFF.TwoColumnBuffer.prototype.appendDouble = function(value) {
		this.m_currentColumn.appendDouble(value);
		return this;
	};
	oFF.TwoColumnBuffer.prototype.appendObject = function(value) {
		this.m_currentColumn.appendObject(value);
		return this;
	};
	oFF.TwoColumnBuffer.prototype.appendNewLine = function() {
		this.m_currentLine = oFF.XPair.create(oFF.XStringBuffer.create(),
				oFF.XStringBuffer.create());
		this.m_currentColumn = this.m_currentLine.getFirstObject();
		this.m_lines.add(this.m_currentLine);
		return this;
	};
	oFF.TwoColumnBuffer.prototype.nextColumn = function() {
		this.m_currentColumn = this.m_currentLine.getSecondObject();
		return this;
	};
	oFF.TwoColumnBuffer.prototype.length = function() {
		var value = this.toString();
		return oFF.XString.size(value);
	};
	oFF.TwoColumnBuffer.prototype.clear = function() {
		this.m_lines = oFF.XList.create();
		this.appendNewLine();
	};
	oFF.TwoColumnBuffer.prototype.flush = function() {
	};
	oFF.TwoColumnBuffer.prototype.toString = function() {
		var maxWidthCol0 = 0;
		var pair;
		var column0;
		var len;
		var i;
		var target;
		var j;
		var k;
		for (i = 0; i < this.m_lines.size(); i++) {
			pair = this.m_lines.get(i);
			column0 = pair.getFirstObject();
			len = column0.length();
			if (len > maxWidthCol0) {
				maxWidthCol0 = len;
			}
		}
		target = oFF.XStringBuffer.create();
		for (j = 0; j < this.m_lines.size(); j++) {
			if (j > 0) {
				target.appendNewLine();
			}
			pair = this.m_lines.get(j);
			column0 = pair.getFirstObject();
			target.append(column0.toString());
			len = column0.length();
			for (k = len; k < maxWidthCol0 + this.m_spaceCount; k++) {
				target.append(" ");
			}
			target.append(pair.getSecondObject().toString());
		}
		return target.toString();
	};
	oFF.TimerItem = function() {
	};
	oFF.TimerItem.prototype = new oFF.XObject();
	oFF.TimerItem.create = function(milliseconds, listener, customIdentifier) {
		var object = new oFF.TimerItem();
		object.setupExt(milliseconds, listener, customIdentifier, false);
		return object;
	};
	oFF.TimerItem.createInterval = function(milliseconds, listener,
			customIdentifier) {
		var object = new oFF.TimerItem();
		object.setupExt(milliseconds, listener, customIdentifier, true);
		return object;
	};
	oFF.TimerItem.prototype.m_deltaMilliseconds = 0;
	oFF.TimerItem.prototype.m_targetPointInTime = 0;
	oFF.TimerItem.prototype.m_listener = null;
	oFF.TimerItem.prototype.m_customIdentifier = null;
	oFF.TimerItem.prototype.m_isInterval = false;
	oFF.TimerItem.prototype.setupExt = function(milliseconds, listener,
			customIdentifier, isInterval) {
		this.m_deltaMilliseconds = milliseconds;
		this.m_listener = listener;
		this.m_customIdentifier = customIdentifier;
		this.m_isInterval = isInterval;
		this.setTargetPointInTime();
	};
	oFF.TimerItem.prototype.releaseObject = function() {
		this.m_customIdentifier = null;
		this.m_listener = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.TimerItem.prototype.setTargetPointInTime = function() {
		this.m_targetPointInTime = oFF.XSystemUtils
				.getCurrentTimeInMilliseconds()
				+ this.m_deltaMilliseconds;
	};
	oFF.TimerItem.prototype.isMatching = function(pointInTime) {
		return this.m_targetPointInTime <= pointInTime;
	};
	oFF.TimerItem.prototype.isInterval = function() {
		return this.m_isInterval;
	};
	oFF.TimerItem.prototype.execute = function() {
		this.m_listener.onTimerEvent(this, this.m_customIdentifier);
	};
	oFF.WorkingTaskManagerFactory = function() {
	};
	oFF.WorkingTaskManagerFactory.prototype = new oFF.XObject();
	oFF.WorkingTaskManagerFactory.s_factory1 = null;
	oFF.WorkingTaskManagerFactory.s_factory2 = null;
	oFF.WorkingTaskManagerFactory.s_factory3 = null;
	oFF.WorkingTaskManagerFactory.create = function(type, allocatorScope) {
		var factory = null;
		if (type === oFF.WorkingTaskManagerType.MULTI_THREADED) {
			factory = oFF.WorkingTaskManagerFactory.s_factory1;
		} else {
			if (type === oFF.WorkingTaskManagerType.SINGLE_THREADED) {
				factory = oFF.WorkingTaskManagerFactory.s_factory2;
			} else {
				if (type === oFF.WorkingTaskManagerType.UI_DRIVER) {
					factory = oFF.WorkingTaskManagerFactory.s_factory3;
				}
			}
		}
		if (oFF.notNull(factory)) {
			return factory.newWorkingTaskManager(allocatorScope);
		} else {
			return null;
		}
	};
	oFF.WorkingTaskManagerFactory.registerFactoryViaClass = function(type,
			clazz) {
		var newObj = new oFF.WorkingTaskManagerFactory();
		newObj.m_clazz = clazz;
		oFF.WorkingTaskManagerFactory.registerFactory(type, newObj);
	};
	oFF.WorkingTaskManagerFactory.registerFactory = function(type, factory) {
		if (type === oFF.WorkingTaskManagerType.MULTI_THREADED) {
			oFF.WorkingTaskManagerFactory.s_factory1 = factory;
		} else {
			if (type === oFF.WorkingTaskManagerType.SINGLE_THREADED) {
				oFF.WorkingTaskManagerFactory.s_factory2 = factory;
			} else {
				if (type === oFF.WorkingTaskManagerType.UI_DRIVER) {
					oFF.WorkingTaskManagerFactory.s_factory3 = factory;
				}
			}
		}
	};
	oFF.WorkingTaskManagerFactory.prototype.m_clazz = null;
	oFF.WorkingTaskManagerFactory.prototype.newWorkingTaskManager = function(
			allocatorScope) {
		return this.m_clazz.newInstance(allocatorScope);
	};
	oFF.ExtResult = function() {
	};
	oFF.ExtResult.prototype = new oFF.XObject();
	oFF.ExtResult.createWithExternalMessages = function(data, messages) {
		var list = new oFF.ExtResult();
		list.setupExt(data, messages, true);
		return list;
	};
	oFF.ExtResult.create = function(data, messages) {
		var list = new oFF.ExtResult();
		list.setupExt(data, messages, false);
		return list;
	};
	oFF.ExtResult.createCopyExt = function(other) {
		var list = new oFF.ExtResult();
		if (oFF.isNull(other)) {
			list.setupExt(null, null, false);
		} else {
			list.setupExt(other.getData(), other, false);
		}
		return list;
	};
	oFF.ExtResult.createWithErrorMessage = function(errorMessage) {
		var list = new oFF.ExtResult();
		var messageManager = oFF.MessageManager.createMessageManager();
		messageManager.addError(oFF.ErrorCodes.OTHER_ERROR, errorMessage);
		list.setupExt(null, messageManager, false);
		return list;
	};
	oFF.ExtResult.createWithInfoMessage = function(infoMessage) {
		var list = new oFF.ExtResult();
		var messageManager = oFF.MessageManager.createMessageManager();
		messageManager.addInfo(oFF.ErrorCodes.OTHER_ERROR, infoMessage);
		list.setupExt(null, messageManager, false);
		return list;
	};
	oFF.ExtResult.createWithMessage = function(message) {
		var list = new oFF.ExtResult();
		var messageManager = oFF.MessageManager.createMessageManager();
		messageManager.addMessage(message);
		list.setupExt(null, messageManager, false);
		return list;
	};
	oFF.ExtResult.prototype.m_messageCollection = null;
	oFF.ExtResult.prototype.m_data = null;
	oFF.ExtResult.prototype.releaseObject = function() {
		this.m_data = null;
		this.m_messageCollection = oFF.XObjectExt
				.release(this.m_messageCollection);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.ExtResult.prototype.setupExt = function(data, messages,
			externalMessages) {
		this.m_data = data;
		if (externalMessages && oFF.notNull(messages)) {
			this.m_messageCollection = messages;
		} else {
			this.m_messageCollection = oFF.MessageManager
					.createMessageManager();
			if (oFF.notNull(messages)) {
				this.m_messageCollection.addAllMessages(messages);
			}
		}
	};
	oFF.ExtResult.prototype.getData = function() {
		return this.m_data;
	};
	oFF.ExtResult.prototype.hasErrors = function() {
		return this.m_messageCollection.hasErrors();
	};
	oFF.ExtResult.prototype.isValid = function() {
		return this.m_messageCollection.isValid();
	};
	oFF.ExtResult.prototype.getNumberOfErrors = function() {
		return this.m_messageCollection.getNumberOfErrors();
	};
	oFF.ExtResult.prototype.hasSeverity = function(severity) {
		return this.m_messageCollection.hasSeverity(severity);
	};
	oFF.ExtResult.prototype.getNumberOfSeverity = function(severity) {
		return this.m_messageCollection.getNumberOfSeverity(severity);
	};
	oFF.ExtResult.prototype.getFirstWithSeverity = function(severity) {
		return this.m_messageCollection.getFirstWithSeverity(severity);
	};
	oFF.ExtResult.prototype.getErrors = function() {
		return this.m_messageCollection.getErrors();
	};
	oFF.ExtResult.prototype.getWarnings = function() {
		return this.m_messageCollection.getWarnings();
	};
	oFF.ExtResult.prototype.getInfos = function() {
		return this.m_messageCollection.getInfos();
	};
	oFF.ExtResult.prototype.getSemanticalErrors = function() {
		return this.m_messageCollection.getSemanticalErrors();
	};
	oFF.ExtResult.prototype.getMessages = function() {
		return this.m_messageCollection.getMessages();
	};
	oFF.ExtResult.prototype.getFirstError = function() {
		return this.m_messageCollection.getFirstError();
	};
	oFF.ExtResult.prototype.getSummary = function() {
		return this.m_messageCollection.getSummary();
	};
	oFF.ExtResult.prototype.getRootProfileNode = function() {
		return this.m_messageCollection.getRootProfileNode();
	};
	oFF.ExtResult.prototype.getClientStatusCode = function() {
		return this.m_messageCollection.getClientStatusCode();
	};
	oFF.ExtResult.prototype.getServerStatusCode = function() {
		return this.m_messageCollection.getServerStatusCode();
	};
	oFF.ExtResult.prototype.getServerStatusDetails = function() {
		return this.m_messageCollection.getServerStatusDetails();
	};
	oFF.ExtResult.prototype.toString = function() {
		return this.m_messageCollection.toString();
	};
	oFF.XWebDAVFactory = function() {
	};
	oFF.XWebDAVFactory.prototype = new oFF.XFileSystemFactory();
	oFF.XWebDAVFactory.staticSetup = function() {
		oFF.XFileSystemFactory.registerFactory(oFF.XFileSystemType.OS,
				new oFF.XWebDAVFactory());
	};
	oFF.XWebDAVFactory.prototype.newFileSystem = function(session) {
		return oFF.XWebDAV.createWebDav(session, null);
	};
	oFF.XAuthenticationToken = function() {
	};
	oFF.XAuthenticationToken.prototype = new oFF.XObject();
	oFF.XAuthenticationToken.create = function(accessToken) {
		var token = new oFF.XAuthenticationToken();
		token.m_accessToken = accessToken;
		return token;
	};
	oFF.XAuthenticationToken.prototype.m_accessToken = null;
	oFF.XAuthenticationToken.prototype.getAccessToken = function() {
		return this.m_accessToken;
	};
	oFF.XAuthenticationToken.prototype.setAccessToken = function(token) {
		this.m_accessToken = token;
	};
	oFF.HttpClientFactory = function() {
	};
	oFF.HttpClientFactory.prototype = new oFF.XObject();
	oFF.HttpClientFactory.s_clientFactoryMap = null;
	oFF.HttpClientFactory.staticSetupClientFactory = function() {
		oFF.HttpClientFactory.s_clientFactoryMap = oFF.XHashMapByString
				.create();
	};
	oFF.HttpClientFactory.newInstanceByConnection = function(session,
			connection) {
		var uri = connection.getUriStringExt(true, false, false, false, true,
				false, false, false);
		var clientFactory = oFF.HttpClientFactory.s_clientFactoryMap
				.getByKey(uri);
		if (oFF.notNull(clientFactory)) {
			return clientFactory.newHttpClientInstance(session);
		}
		uri = connection.getUriStringExt(true, false, false, true, false,
				false, false, false);
		clientFactory = oFF.HttpClientFactory.s_clientFactoryMap.getByKey(uri);
		if (oFF.notNull(clientFactory)) {
			return clientFactory.newHttpClientInstance(session);
		}
		uri = connection.getUriStringExt(true, false, false, false, false,
				false, false, false);
		clientFactory = oFF.HttpClientFactory.s_clientFactoryMap.getByKey(uri);
		if (oFF.notNull(clientFactory)) {
			return clientFactory.newHttpClientInstance(session);
		}
		return null;
	};
	oFF.HttpClientFactory.setHttpClientFactoryForProtocol = function(
			protocolType, httpClientFactory) {
		var uri = oFF.XUri.create();
		uri.setProtocolType(protocolType);
		return oFF.HttpClientFactory.setHttpClientFactoryForConnection(uri,
				httpClientFactory);
	};
	oFF.HttpClientFactory.setHttpClientFactoryForConnection = function(
			connection, httpClientFactory) {
		var uriValue = connection.getUriStringExt(true, false, false, true,
				true, false, false, false);
		var oldFactory = oFF.HttpClientFactory.s_clientFactoryMap
				.getByKey(uriValue);
		oFF.HttpClientFactory.s_clientFactoryMap.put(uriValue,
				httpClientFactory);
		return oldFactory;
	};
	oFF.HttpServerFactory = function() {
	};
	oFF.HttpServerFactory.prototype = new oFF.XObject();
	oFF.HttpServerFactory.s_httpServerFactory = null;
	oFF.HttpServerFactory.staticSetupHttpClientFactory = function() {
		var defaultFactory = new oFF.HttpServerFactory();
		oFF.HttpServerFactory.registerFactory(defaultFactory);
	};
	oFF.HttpServerFactory.newInstance = function(session, serverConfig,
			useLocalLoop) {
		var localLoopFactory;
		var uri;
		var port;
		var host;
		if (!useLocalLoop) {
			oFF.HttpServerFactory.s_httpServerFactory.newHttpServerInstance(
					session, serverConfig);
		} else {
			localLoopFactory = oFF.HttpLocalLoopFactory.create(serverConfig);
			uri = oFF.XUri.createFromConnection(serverConfig);
			if (uri.getProtocolType() === null) {
				uri.setProtocolType(oFF.ProtocolType.HTTP);
			}
			oFF.HttpClientFactory.setHttpClientFactoryForConnection(uri,
					localLoopFactory);
			port = uri.getPort();
			if (port !== 0) {
				host = uri.getHost();
				if (oFF.isNull(host) || oFF.XString.isEqual("0.0.0.0", host)) {
					uri.setHost("localhost");
					oFF.HttpClientFactory.setHttpClientFactoryForConnection(
							uri, localLoopFactory);
				}
			}
		}
	};
	oFF.HttpServerFactory.registerFactory = function(httpServerFactory) {
		oFF.HttpServerFactory.s_httpServerFactory = httpServerFactory;
	};
	oFF.HttpServerFactory.prototype.newHttpServerInstance = function(session,
			serverConfig) {
	};
	oFF.HttpCookies = function() {
	};
	oFF.HttpCookies.prototype = new oFF.XObject();
	oFF.HttpCookies.create = function() {
		var cookies = new oFF.HttpCookies();
		cookies.setup();
		return cookies;
	};
	oFF.HttpCookies.prototype.m_cookies = null;
	oFF.HttpCookies.prototype.setup = function() {
		oFF.XObject.prototype.setup.call(this);
		this.m_cookies = oFF.XHashMapByString.create();
	};
	oFF.HttpCookies.prototype.releaseObject = function() {
		var iterator;
		var next;
		if (oFF.notNull(this.m_cookies)) {
			iterator = this.m_cookies.getIterator();
			while (iterator.hasNext()) {
				next = iterator.next();
				oFF.XCollectionUtils.releaseEntriesFromCollection(next);
				oFF.XObjectExt.release(next);
			}
			oFF.XObjectExt.release(iterator);
			oFF.XObjectExt.release(this.m_cookies);
			this.m_cookies = null;
		}
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.HttpCookies.prototype.isEmpty = function() {
		if (oFF.isNull(this.m_cookies)) {
			return true;
		}
		return this.m_cookies.isEmpty();
	};
	oFF.HttpCookies.prototype.hasElements = function() {
		return !this.isEmpty();
	};
	oFF.HttpCookies.prototype.size = function() {
		var count = 0;
		var iterator = this.m_cookies.getIterator();
		var cookieList;
		while (iterator.hasNext()) {
			cookieList = iterator.next();
			count = count + cookieList.size();
		}
		return count;
	};
	oFF.HttpCookies.prototype.clear = function() {
		this.m_cookies.clear();
	};
	oFF.HttpCookies.prototype.getCookieNames = function() {
		return this.m_cookies.getKeysAsReadOnlyListOfString();
	};
	oFF.HttpCookies.prototype.getCookieValueByName = function(name) {
		var values = this.m_cookies.getByKey(name);
		if (oFF.XCollectionUtils.hasElements(values)) {
			return values.get(0).getValue();
		}
		return null;
	};
	oFF.HttpCookies.prototype.getCookiesByName = function(name) {
		return this.m_cookies.getByKey(name);
	};
	oFF.HttpCookies.prototype.add = function(name, value) {
		var cookie = oFF.HttpCookie.createCookie();
		cookie.setName(name);
		cookie.setValue(value);
		return this.addCookie(cookie);
	};
	oFF.HttpCookies.prototype.addByHttpServerResponseValue = function(
			httpHeaderValue) {
		var cookie = oFF.HttpCookie.createCookie();
		cookie.setByHttpServerResponseValue(httpHeaderValue);
		return this.addCookie(cookie);
	};
	oFF.HttpCookies.prototype.addByHttpClientRequestValue = function(
			httpHeaderValue) {
		var start;
		var end;
		var subValue;
		var assignIndex;
		var cookieName;
		var cookieValue;
		var newCookie;
		if (oFF.notNull(httpHeaderValue)) {
			start = 0;
			while (true) {
				end = oFF.XString.indexOfFrom(httpHeaderValue, ";", start);
				subValue = oFF.XString.substring(httpHeaderValue, start, end);
				assignIndex = oFF.XString.indexOf(subValue, "=");
				if (assignIndex === -1) {
					cookieName = subValue;
					cookieValue = "";
				} else {
					cookieName = oFF.XString
							.substring(subValue, 0, assignIndex);
					cookieValue = oFF.XString.substring(subValue,
							assignIndex + 1, -1);
				}
				cookieName = oFF.XString.trim(cookieName);
				cookieValue = oFF.XString.trim(cookieValue);
				newCookie = oFF.HttpCookie.createCookie();
				newCookie.setName(cookieName);
				newCookie.setValue(cookieValue);
				this.addCookie(newCookie);
				if (end === -1) {
					break;
				}
				start = end + 1;
			}
		}
	};
	oFF.HttpCookies.prototype.addCookie = function(cookie) {
		var name = cookie.getName();
		var valueList = this.m_cookies.getByKey(name);
		if (oFF.isNull(valueList)) {
			valueList = oFF.XList.create();
			this.m_cookies.put(name, valueList);
		}
		valueList.add(cookie);
		return cookie;
	};
	oFF.HttpCookies.prototype.merge = function(cookies) {
		var cookieNames = cookies.getCookieNames();
		var i;
		var name;
		var valueList;
		var cookieValuesByName;
		var j;
		for (i = 0; i < cookieNames.size(); i++) {
			name = cookieNames.get(i);
			valueList = this.m_cookies.getByKey(name);
			if (oFF.isNull(valueList)) {
				valueList = oFF.XList.create();
				this.m_cookies.put(name, valueList);
			} else {
				valueList.clear();
			}
			cookieValuesByName = cookies.getCookiesByName(name);
			for (j = 0; j < cookieValuesByName.size(); j++) {
				valueList.add(cookieValuesByName.get(j));
			}
		}
	};
	oFF.HttpCookies.prototype.getCookies = function() {
		var allCookies = oFF.XList.create();
		var cookieNames = this.getCookieNames();
		var i;
		var name;
		var valueList;
		for (i = 0; i < cookieNames.size(); i++) {
			name = cookieNames.get(i);
			valueList = this.m_cookies.getByKey(name);
			allCookies.addAll(valueList);
		}
		return allCookies;
	};
	oFF.HttpCookies.prototype.toString = function() {
		var buffer = oFF.XStringBuffer.create();
		var cookieNames = this.getCookieNames();
		var i;
		var name;
		var valueList;
		var j;
		for (i = 0; i < cookieNames.size(); i++) {
			if (i > 0) {
				buffer.append("\r\n");
			}
			name = cookieNames.get(i);
			buffer.append(name);
			buffer.append("=");
			valueList = this.m_cookies.getByKey(name);
			for (j = 0; j < valueList.size(); j++) {
				if (j > 0) {
					buffer.append(";");
				}
				buffer.append(valueList.get(j).getValue());
			}
		}
		return buffer.toString();
	};
	oFF.HttpFileFactory = function() {
	};
	oFF.HttpFileFactory.prototype = new oFF.XObject();
	oFF.HttpFileFactory.staticSetup = function() {
		var httpFileFactory = oFF.HttpFileFactory.create();
		oFF.HttpClientFactory.setHttpClientFactoryForProtocol(
				oFF.ProtocolType.FILE, httpFileFactory);
	};
	oFF.HttpFileFactory.create = function() {
		return new oFF.HttpFileFactory();
	};
	oFF.HttpFileFactory.prototype.newHttpClientInstance = function(session) {
		return oFF.HttpFileClient.create(session);
	};
	oFF.HttpLocalLoopFactory = function() {
	};
	oFF.HttpLocalLoopFactory.prototype = new oFF.XObject();
	oFF.HttpLocalLoopFactory.create = function(serverConfig) {
		var newObj = new oFF.HttpLocalLoopFactory();
		newObj.m_serverConfig = serverConfig;
		return newObj;
	};
	oFF.HttpLocalLoopFactory.prototype.m_serverConfig = null;
	oFF.HttpLocalLoopFactory.prototype.releaseObject = function() {
		this.m_serverConfig = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.HttpLocalLoopFactory.prototype.newHttpClientInstance = function(session) {
		return oFF.HttpLocalLoopClient.create(session, this.m_serverConfig);
	};
	oFF.XmlParserFactory = function() {
	};
	oFF.XmlParserFactory.prototype = new oFF.XObject();
	oFF.XmlParserFactory.s_xmlParserFactory = null;
	oFF.XmlParserFactory.staticSetupXmlParserFactory = function() {
		oFF.XmlParserFactory.s_xmlParserFactory = new oFF.XmlParserFactory();
	};
	oFF.XmlParserFactory.newInstance = function() {
		return oFF.XmlParserFactory.s_xmlParserFactory.newParserInstance();
	};
	oFF.XmlParserFactory.createFromString = function(xml) {
		var parser = oFF.XmlParserFactory.newInstance();
		var rootElement = parser.parse(xml);
		if (parser.isValid()) {
			return rootElement;
		}
		throw oFF.XException
				.createIllegalArgumentException(parser.getSummary());
	};
	oFF.XmlParserFactory.prototype.newParserInstance = function() {
		return oFF.XmlParser.create();
	};
	oFF.DfDispatcher = function() {
	};
	oFF.DfDispatcher.prototype = new oFF.XObject();
	oFF.DfDispatcher.prototype.registerInterval = function(
			intervalMilliseconds, listener, customIdentifier) {
		return null;
	};
	oFF.DfDispatcher.prototype.unregisterInterval = function(handle) {
	};
	oFF.ProgramMetadata = function() {
	};
	oFF.ProgramMetadata.prototype = new oFF.XObject();
	oFF.ProgramMetadata.create = function(factory) {
		var newPrg = new oFF.ProgramMetadata();
		newPrg.setup();
		newPrg.m_factory = factory;
		newPrg.m_argMetadata = oFF.XListOfNameObject.create();
		return newPrg;
	};
	oFF.ProgramMetadata.prototype.m_factory = null;
	oFF.ProgramMetadata.prototype.m_argMetadata = null;
	oFF.ProgramMetadata.prototype.getFactory = function() {
		return this.m_factory;
	};
	oFF.ProgramMetadata.prototype.getArgDefinitions = function() {
		return this.m_argMetadata;
	};
	oFF.ProgramMetadata.prototype.getArgDefinitionsList = function() {
		return this.m_argMetadata;
	};
	oFF.ProgramMetadata.prototype.addOption = function(name, text, values,
			valueType) {
		var theValues = values;
		var newObj;
		if (oFF.XStringUtils.isNullOrEmpty(values)
				&& valueType === oFF.XValueType.BOOLEAN) {
			theValues = "true|false";
		}
		newObj = oFF.ProgramArgDef.createOption(name, text, theValues,
				valueType);
		this.m_argMetadata.add(newObj);
		return newObj;
	};
	oFF.ProgramMetadata.prototype.addParameter = function(name, text) {
		var newObj = oFF.ProgramArgDef.createStringParameter(name, text);
		this.m_argMetadata.add(newObj);
		return newObj;
	};
	oFF.ProgramMetadata.prototype.addParameterList = function(name, text) {
		var newObj = oFF.ProgramArgDef.createStringArrayParameter(name, text);
		this.m_argMetadata.add(newObj);
		return newObj;
	};
	oFF.XFileContent = function() {
	};
	oFF.XFileContent.prototype = new oFF.XObject();
	oFF.XFileContent.createFileContent = function() {
		return new oFF.XFileContent();
	};
	oFF.XFileContent.createFileContentWithError = function(errorMessage) {
		var fileContent = new oFF.XFileContent();
		var messageManager = oFF.MessageManager.createMessageManager();
		messageManager.addError(oFF.ErrorCodes.SYSTEM_IO, errorMessage);
		fileContent.m_messageCollection = messageManager;
		return fileContent;
	};
	oFF.XFileContent.copy = function(source, target) {
		if (source.isBinaryContentSet()) {
			target.setByteArray(source.getByteArray());
		}
		if (source.isStringContentSet()) {
			target.setString(source.getString());
		}
		if (source.isJsonContentSet()) {
			target.setJsonObject(source.getJsonContent());
		}
	};
	oFF.XFileContent.prototype.m_contentType = null;
	oFF.XFileContent.prototype.m_binaryContent = null;
	oFF.XFileContent.prototype.m_stringContent = null;
	oFF.XFileContent.prototype.m_jsonContent = null;
	oFF.XFileContent.prototype.m_messageCollection = null;
	oFF.XFileContent.prototype.releaseObject = function() {
		this.m_jsonContent = oFF.XObjectExt.release(this.m_jsonContent);
		this.m_messageCollection = null;
		this.m_binaryContent = null;
		this.m_stringContent = null;
		this.m_contentType = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XFileContent.prototype.setContentTypeAutodetect = function(
			fallbackType, path, ignoreZipEnding) {
		var lastDot;
		var correctedPath;
		var extension;
		var lookup;
		this.m_contentType = fallbackType;
		if (oFF.notNull(path)) {
			correctedPath = path;
			if (ignoreZipEnding) {
				lastDot = oFF.XString.lastIndexOf(path, ".");
				if (lastDot !== -1) {
					correctedPath = oFF.XString.substring(path, 0, lastDot);
				}
			}
			lastDot = oFF.XString.lastIndexOf(correctedPath, ".");
			if (lastDot !== -1) {
				extension = oFF.XString.substring(correctedPath, lastDot + 1,
						-1);
				lookup = oFF.ContentType.lookupByFileEnding(oFF.XString
						.toLowerCase(extension));
				if (oFF.notNull(lookup)) {
					this.m_contentType = lookup;
				}
			}
		}
		return this.m_contentType;
	};
	oFF.XFileContent.prototype.getContentType = function() {
		return this.m_contentType;
	};
	oFF.XFileContent.prototype.setContentType = function(contentType) {
		this.m_contentType = contentType;
	};
	oFF.XFileContent.prototype.getByteArray = function() {
		return this.m_binaryContent;
	};
	oFF.XFileContent.prototype.setByteArray = function(value) {
		this.m_binaryContent = value;
	};
	oFF.XFileContent.prototype.isBinaryContentSet = function() {
		return oFF.notNull(this.m_binaryContent);
	};
	oFF.XFileContent.prototype.getString = function() {
		return this.getStringContentExt(true, -1);
	};
	oFF.XFileContent.prototype.getStringContentExt = function(
			enforceConversion, encoding) {
		var binaryContent;
		var internalEncoding;
		var jsonContent;
		if (oFF.isNull(this.m_stringContent) && enforceConversion) {
			binaryContent = this.getByteArray();
			if (oFF.notNull(binaryContent)) {
				internalEncoding = encoding;
				if (internalEncoding === -1) {
					internalEncoding = this.getInternalTextEncoding();
				}
				this.m_stringContent = oFF.XByteArray
						.convertToStringWithCharset(binaryContent,
								internalEncoding);
			} else {
				if (this.isJsonContentSet()) {
					jsonContent = this.getJsonContent();
					this.m_stringContent = oFF.PrUtils.serialize(jsonContent,
							false, false, 0);
				}
			}
		}
		return this.m_stringContent;
	};
	oFF.XFileContent.prototype.getInternalTextEncoding = function() {
		return oFF.XCharset.UTF8;
	};
	oFF.XFileContent.prototype.setString = function(value) {
		this.m_stringContent = value;
	};
	oFF.XFileContent.prototype.isStringContentSet = function() {
		return oFF.notNull(this.m_stringContent);
	};
	oFF.XFileContent.prototype.getStringContentWithCharset = function(encoding) {
		return this.getStringContentExt(true, encoding);
	};
	oFF.XFileContent.prototype.isJsonContentSet = function() {
		return oFF.notNull(this.m_jsonContent);
	};
	oFF.XFileContent.prototype.setJsonObject = function(json) {
		this.m_jsonContent = json;
	};
	oFF.XFileContent.prototype.getJsonContent = function() {
		var contentType;
		var parser;
		var stringContent;
		var rootElement;
		var binaryContent;
		var rootElementJson;
		if (oFF.isNull(this.m_jsonContent)) {
			contentType = this.getContentType();
			parser = null;
			if (oFF.notNull(contentType)
					&& contentType.isTypeOf(oFF.ContentType.XML)) {
				parser = oFF.XmlParserFactory.newInstance();
			}
			if (oFF.isNull(parser)) {
				parser = oFF.JsonParserFactory.newInstance();
			}
			if (oFF.notNull(parser)) {
				if (this.isStringContentSet()) {
					stringContent = this.getStringContentExt(true, -1);
					if (oFF.XStringUtils.isNotNullAndNotEmpty(stringContent)) {
						rootElement = parser.parse(stringContent);
						if (parser.isValid()) {
							this.m_jsonContent = rootElement;
						}
					}
				} else {
					if (this.isBinaryContentSet()) {
						binaryContent = this.getByteArray();
						rootElementJson = parser.parseByteArray(binaryContent);
						if (parser.isValid()) {
							this.m_jsonContent = rootElementJson;
						}
					}
				}
				oFF.XObjectExt.release(parser);
			}
		}
		return this.m_jsonContent;
	};
	oFF.XFileContent.prototype.getMessageCollection = function() {
		return this.m_messageCollection;
	};
	oFF.XFileContent.prototype.setMessageCollection = function(
			messageCollection) {
		this.m_messageCollection = messageCollection;
	};
	oFF.XFileContent.prototype.isEmpty = function() {
		return !this.isBinaryContentSet() && !this.isStringContentSet()
				&& !this.isJsonContentSet();
	};
	oFF.XFileSystemManager = function() {
	};
	oFF.XFileSystemManager.prototype = new oFF.XObjectExt();
	oFF.XFileSystemManager.prototype.getActiveFileSystem = function() {
		return null;
	};
	oFF.XFileSystemManager.prototype.getAllFileSystems = function() {
		return null;
	};
	oFF.JsonParserGenericFactory = function() {
	};
	oFF.JsonParserGenericFactory.prototype = new oFF.JsonParserFactory();
	oFF.JsonParserGenericFactory.staticSetup = function() {
		var factory = new oFF.JsonParserGenericFactory();
		oFF.JsonParserFactory.setJsonParserFactoryGeneric(factory);
	};
	oFF.JsonParserGenericFactory.prototype.newParserInstance = function() {
		return oFF.JsonParserGeneric.create();
	};
	oFF.HttpSamlClientFactory = function() {
	};
	oFF.HttpSamlClientFactory.prototype = new oFF.HttpClientFactory();
	oFF.HttpSamlClientFactory.staticSetupSamlFactory = function() {
		var factory = new oFF.HttpSamlClientFactory();
		var samlPwd = oFF.XUri.create();
		var samlCert;
		var samlKerb;
		var samlPwd1;
		var samlCert1;
		var samlKerb1;
		samlPwd.setProtocolType(oFF.ProtocolType.HTTPS);
		samlPwd
				.setAuthenticationType(oFF.AuthenticationType.SAML_WITH_PASSWORD);
		oFF.HttpClientFactory.setHttpClientFactoryForConnection(samlPwd,
				factory);
		samlCert = oFF.XUri.create();
		samlCert.setProtocolType(oFF.ProtocolType.HTTPS);
		samlCert
				.setAuthenticationType(oFF.AuthenticationType.SAML_WITH_CERTIFICATE);
		oFF.HttpClientFactory.setHttpClientFactoryForConnection(samlCert,
				factory);
		samlKerb = oFF.XUri.create();
		samlKerb.setProtocolType(oFF.ProtocolType.HTTPS);
		samlKerb
				.setAuthenticationType(oFF.AuthenticationType.SAML_WITH_KERBEROS);
		oFF.HttpClientFactory.setHttpClientFactoryForConnection(samlKerb,
				factory);
		samlPwd1 = oFF.XUri.create();
		samlPwd1.setProtocolType(oFF.ProtocolType.HTTP);
		samlPwd1
				.setAuthenticationType(oFF.AuthenticationType.SAML_WITH_PASSWORD);
		oFF.HttpClientFactory.setHttpClientFactoryForConnection(samlPwd1,
				factory);
		samlCert1 = oFF.XUri.create();
		samlCert1.setProtocolType(oFF.ProtocolType.HTTP);
		samlCert1
				.setAuthenticationType(oFF.AuthenticationType.SAML_WITH_CERTIFICATE);
		oFF.HttpClientFactory.setHttpClientFactoryForConnection(samlCert1,
				factory);
		samlKerb1 = oFF.XUri.create();
		samlKerb1.setProtocolType(oFF.ProtocolType.HTTP);
		samlKerb1
				.setAuthenticationType(oFF.AuthenticationType.SAML_WITH_KERBEROS);
		oFF.HttpClientFactory.setHttpClientFactoryForConnection(samlKerb1,
				factory);
	};
	oFF.HttpSamlClientFactory.prototype.newHttpClientInstance = function(
			session) {
		return oFF.HttpSamlClient.create(session);
	};
	oFF.ProxySettings = function() {
	};
	oFF.ProxySettings.prototype = new oFF.XObject();
	oFF.ProxySettings.create = function(parent) {
		var newObj = new oFF.ProxySettings();
		newObj.setupExt(parent);
		return newObj;
	};
	oFF.ProxySettings.prototype.m_parent = null;
	oFF.ProxySettings.prototype.m_webdispatcherTemplate = null;
	oFF.ProxySettings.prototype.m_proxyHost = null;
	oFF.ProxySettings.prototype.m_proxyPort = 0;
	oFF.ProxySettings.prototype.m_authorization = null;
	oFF.ProxySettings.prototype.m_sccLocationId = null;
	oFF.ProxySettings.prototype.m_excludeList = null;
	oFF.ProxySettings.prototype.m_type = null;
	oFF.ProxySettings.prototype.m_header = null;
	oFF.ProxySettings.prototype.setupExt = function(parent) {
		this.m_parent = parent;
		this.m_type = oFF.ProxyType.DEFAULT;
		this.m_excludeList = oFF.XListOfString.create();
		this.m_header = oFF.XSetOfNameObject.create();
	};
	oFF.ProxySettings.prototype.loadFromEnvironment = function() {
		var webdispatcherTemplate;
		var proxyHost;
		var proxyPort;
		this.setProxyType(oFF.ProxyType.NONE);
		webdispatcherTemplate = oFF.XEnvironment.getInstance().getVariable(
				oFF.XEnvironmentConstants.HTTP_DISPATCHER_URI);
		if (oFF.XStringUtils.isNullOrEmpty(webdispatcherTemplate)) {
			webdispatcherTemplate = oFF.XEnvironment.getInstance().getVariable(
					oFF.XEnvironmentConstants.HTTP_DISPATCHER_URI_DOT);
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(webdispatcherTemplate)) {
			this.setWebdispatcherTemplate(webdispatcherTemplate);
			this.setProxyType(oFF.ProxyType.WEBDISPATCHER);
		}
		proxyHost = oFF.XEnvironment.getInstance().getVariable(
				oFF.XEnvironmentConstants.HTTP_PROXY_HOST);
		if (oFF.XStringUtils.isNotNullAndNotEmpty(proxyHost)) {
			this.setProxyType(oFF.ProxyType.PROXY);
			this.setProxyHost(proxyHost);
			proxyPort = oFF.XEnvironment.getInstance().getVariable(
					oFF.XEnvironmentConstants.HTTP_PROXY_PORT);
			if (oFF.isNull(proxyPort)) {
				this.setProxyPort(80);
			} else {
				try {
					this
							.setProxyPort(oFF.XInteger
									.convertFromString(proxyPort));
				} catch (e) {
					this.setProxyType(oFF.ProxyType.NONE);
					this.setProxyHost(null);
					this.setProxyPort(0);
				}
			}
		}
	};
	oFF.ProxySettings.prototype.getWebdispatcherTemplate = function() {
		if (this.m_type === oFF.ProxyType.DEFAULT && oFF.notNull(this.m_parent)) {
			return this.m_parent.getWebdispatcherTemplate();
		}
		return this.m_webdispatcherTemplate;
	};
	oFF.ProxySettings.prototype.setWebdispatcherTemplate = function(template) {
		this.m_webdispatcherTemplate = template;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(template)) {
			this.setProxyType(oFF.ProxyType.WEBDISPATCHER);
		}
	};
	oFF.ProxySettings.prototype.getProxyHost = function() {
		if (this.m_type === oFF.ProxyType.DEFAULT && oFF.notNull(this.m_parent)) {
			return this.m_parent.getProxyHost();
		}
		return this.m_proxyHost;
	};
	oFF.ProxySettings.prototype.setProxyHost = function(host) {
		this.m_proxyHost = host;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(host)) {
			this.setProxyType(oFF.ProxyType.PROXY);
		}
	};
	oFF.ProxySettings.prototype.getProxyPort = function() {
		if (this.m_type === oFF.ProxyType.DEFAULT && oFF.notNull(this.m_parent)) {
			return this.m_parent.getProxyPort();
		}
		return this.m_proxyPort;
	};
	oFF.ProxySettings.prototype.setProxyPort = function(port) {
		this.m_proxyPort = port;
	};
	oFF.ProxySettings.prototype.getProxyAuthorization = function() {
		if (this.m_type === oFF.ProxyType.DEFAULT && oFF.notNull(this.m_parent)) {
			return this.m_parent.getProxyAuthorization();
		} else {
			return this.m_authorization;
		}
	};
	oFF.ProxySettings.prototype.setProxyAuthorization = function(authorization) {
		this.m_authorization = authorization;
	};
	oFF.ProxySettings.prototype.getSccLocationId = function() {
		if (this.m_type === oFF.ProxyType.DEFAULT && oFF.notNull(this.m_parent)) {
			return this.m_parent.getSccLocationId();
		} else {
			return this.m_sccLocationId;
		}
	};
	oFF.ProxySettings.prototype.setSccLocationId = function(sccLocationId) {
		this.m_sccLocationId = sccLocationId;
	};
	oFF.ProxySettings.prototype.getProxyExcludes = function() {
		return this.m_excludeList;
	};
	oFF.ProxySettings.prototype.getProxyExcludesBase = function() {
		return this.m_excludeList;
	};
	oFF.ProxySettings.prototype.getProxyType = function() {
		if (this.m_type === oFF.ProxyType.DEFAULT && oFF.notNull(this.m_parent)) {
			return this.m_parent.getProxyType();
		}
		return this.m_type;
	};
	oFF.ProxySettings.prototype.setProxyType = function(type) {
		this.m_type = type;
	};
	oFF.ProxySettings.prototype.isProxyApplicable = function(connection) {
		var host;
		var i;
		var excludeLine;
		if (this.m_type === oFF.ProxyType.DEFAULT && oFF.notNull(this.m_parent)) {
			return this.m_parent.isProxyApplicable(connection);
		}
		if (this.m_type === oFF.ProxyType.DEFAULT) {
			return false;
		} else {
			host = connection.getHost();
			for (i = 0; i < this.m_excludeList.size(); i++) {
				excludeLine = this.m_excludeList.get(i);
				if (oFF.XStringUtils.isWildcardPatternMatching(host,
						excludeLine) === true) {
					return false;
				}
			}
			return true;
		}
	};
	oFF.ProxySettings.prototype.getProxyHttpHeaders = function() {
		return this.m_header.getValuesAsReadOnlyList();
	};
	oFF.ProxySettings.prototype.setProxyHttpHeader = function(name, value) {
		this.m_header.add(oFF.XNameValuePair.createWithValues(name, value));
	};
	oFF.DispatcherSingleThread = function() {
	};
	oFF.DispatcherSingleThread.prototype = new oFF.DfDispatcher();
	oFF.DispatcherSingleThread.create = function() {
		var object = new oFF.DispatcherSingleThread();
		object.setup();
		return object;
	};
	oFF.DispatcherSingleThread.prototype.m_procTimeReceiverList = null;
	oFF.DispatcherSingleThread.prototype.m_timeoutItems = null;
	oFF.DispatcherSingleThread.prototype.m_syncLock = false;
	oFF.DispatcherSingleThread.prototype.m_countDown = 0;
	oFF.DispatcherSingleThread.prototype.setup = function() {
		oFF.DfDispatcher.prototype.setup.call(this);
		this.m_procTimeReceiverList = oFF.XList.create();
		this.m_timeoutItems = oFF.XList.create();
		this.m_countDown = -1;
	};
	oFF.DispatcherSingleThread.prototype.releaseObject = function() {
		this.m_procTimeReceiverList = null;
		this.m_timeoutItems = null;
	};
	oFF.DispatcherSingleThread.prototype.process = function() {
		var needsMoreProcessing = true;
		var isEnabled = true;
		var current;
		var i;
		var currentTimeoutItem;
		var now;
		while (needsMoreProcessing && isEnabled) {
			if (this.m_countDown !== -1) {
				if (this.m_countDown === 0) {
					isEnabled = false;
				} else {
					this.m_countDown--;
				}
			}
			if (this.m_syncLock) {
				throw oFF.XException.createIllegalStateException("Sync lock");
			}
			needsMoreProcessing = false;
			this.m_syncLock = true;
			i = 0;
			while (i < this.m_procTimeReceiverList.size()) {
				current = this.m_procTimeReceiverList.get(i);
				current.processSynchronization(oFF.SyncType.NON_BLOCKING);
				if (current.getSyncState().isNotInSync()) {
					needsMoreProcessing = true;
					i++;
				} else {
					this.m_procTimeReceiverList.removeAt(i);
				}
			}
			now = oFF.XSystemUtils.getCurrentTimeInMilliseconds();
			for (i = this.m_timeoutItems.size() - 1; i >= 0; i--) {
				if (this.m_timeoutItems.size() > i) {
					currentTimeoutItem = this.m_timeoutItems.get(i);
					if (currentTimeoutItem.isMatching(now)) {
						currentTimeoutItem.execute();
						if (currentTimeoutItem.isInterval() === true) {
							currentTimeoutItem.setTargetPointInTime();
						} else {
							this.m_timeoutItems
									.removeElement(currentTimeoutItem);
						}
					}
				}
			}
			if (this.m_timeoutItems.size() > 0) {
				needsMoreProcessing = true;
			}
			this.m_syncLock = false;
		}
	};
	oFF.DispatcherSingleThread.prototype.registerProcessingTimeReceiver = function(
			processingTimeReceiver) {
		if (!this.m_procTimeReceiverList.contains(processingTimeReceiver)) {
			this.m_procTimeReceiverList.add(processingTimeReceiver);
		}
	};
	oFF.DispatcherSingleThread.prototype.unregisterProcessingTimeReceiver = function(
			processingTimeReceiver) {
		if (oFF.notNull(this.m_procTimeReceiverList)) {
			this.m_procTimeReceiverList.removeElement(processingTimeReceiver);
		}
	};
	oFF.DispatcherSingleThread.prototype.getSyncState = function() {
		var state = oFF.SyncState.IN_SYNC;
		var current;
		var currentState;
		var i;
		for (i = 0; i < this.m_procTimeReceiverList.size(); i++) {
			current = this.m_procTimeReceiverList.get(i);
			currentState = current.getSyncState();
			if (currentState.getLevel() < state.getLevel()) {
				state = currentState;
			}
		}
		return state;
	};
	oFF.DispatcherSingleThread.prototype.getProcessingTimeReceiverCount = function() {
		return this.m_procTimeReceiverList.size();
	};
	oFF.DispatcherSingleThread.prototype.registerTimer = function(
			delayMilliseconds, listener, customIdentifier) {
		var timeout = oFF.TimerItem.create(delayMilliseconds, listener,
				customIdentifier);
		this.m_timeoutItems.add(timeout);
		return timeout;
	};
	oFF.DispatcherSingleThread.prototype.unregisterTimer = function(handle) {
		this.m_timeoutItems.removeElement(handle);
	};
	oFF.DispatcherSingleThread.prototype.shutdown = function() {
		if (this.m_countDown === -1) {
			this.m_countDown = 1000;
		}
	};
	oFF.DispatcherSingleThread.prototype.registerInterval = function(
			intervalMilliseconds, listener, customIdentifier) {
		var timeout = oFF.TimerItem.createInterval(intervalMilliseconds,
				listener, customIdentifier);
		this.m_timeoutItems.add(timeout);
		return timeout;
	};
	oFF.DispatcherSingleThread.prototype.unregisterInterval = function(handle) {
		this.m_timeoutItems.removeElement(handle);
	};
	oFF.DfProgram = function() {
	};
	oFF.DfProgram.prototype = new oFF.XObjectExt();
	oFF.DfProgram.PARAM_SHOW_HELP = "help";
	oFF.DfProgram.PARAM_SYNC_TYPE = "SyncType";
	oFF.DfProgram.PARAM_VALUE_BLOCKING = "Blocking";
	oFF.DfProgram.PARAM_VALUE_NON_BLOCKING = "NonBlocking";
	oFF.DfProgram.PARAM_LOG_LEVEL = "loglevel";
	oFF.DfProgram.PARAM_LOG_LAYER = "loglayer";
	oFF.DfProgram.prototype.m_session = null;
	oFF.DfProgram.prototype.m_showHelp = false;
	oFF.DfProgram.prototype.getProgramMetadata = function() {
		var metadata = oFF.ProgramMetadata.create(this);
		this.doSetupProgramMetadata(metadata);
		return metadata;
	};
	oFF.DfProgram.prototype.doSetupProgramMetadata = function(metadata) {
		metadata.addOption(oFF.DfProgram.PARAM_SYNC_TYPE,
				"The Synchronization type.", "Blocking|NonBlocking",
				oFF.XValueType.ENUM_CONSTANT);
		metadata.addOption(oFF.DfProgram.PARAM_SHOW_HELP,
				"Print the help text.", null, oFF.XValueType.BOOLEAN);
		metadata.addOption(oFF.DfProgram.PARAM_LOG_LEVEL,
				"Log level, 0-3. Default is 3.",
				"0: Debug, 1: Info, 2: Warning, 3: Error",
				oFF.XValueType.INTEGER);
		metadata
				.addOption(
						oFF.DfProgram.PARAM_LOG_LAYER,
						"Log layer, comma-separated. Default is all",
						"Server|Protocol|IOLayer|Driver|Application|Utility|Test|Misc|All|None",
						oFF.XValueType.STRING);
	};
	oFF.DfProgram.prototype.setup = function() {
		oFF.XObjectExt.prototype.setup.call(this);
	};
	oFF.DfProgram.prototype.releaseObject = function() {
		this.m_session = null;
		oFF.XObjectExt.prototype.releaseObject.call(this);
	};
	oFF.DfProgram.prototype.getComponentType = function() {
		return oFF.XComponentType.PROGRAM;
	};
	oFF.DfProgram.prototype.getLogLayer = function() {
		return oFF.OriginLayer.APPLICATION;
	};
	oFF.DfProgram.prototype.runFull = function() {
		this.evalArguments();
		this.initializeProgram();
		this.runProgram();
	};
	oFF.DfProgram.prototype.evalArguments = function() {
		var session = this.getSession();
		var argStructure;
		var syncParam;
		var logLevel;
		var logWriterWithFilter;
		var logLayerName;
		var logWriterWithFilter2;
		var tempOriginLayer;
		if (oFF.isNull(session)) {
			throw oFF.XException
					.createIllegalStateException("No session given at startup time");
		}
		argStructure = this.getArgumentStructure();
		syncParam = argStructure.getStringByKeyExt(
				oFF.DfProgram.PARAM_SYNC_TYPE, null);
		if (oFF.notNull(syncParam)) {
			if (oFF.XString.isEqual(syncParam,
					oFF.DfProgram.PARAM_VALUE_BLOCKING)) {
				session.setDefaultSyncType(oFF.SyncType.BLOCKING);
			} else {
				session.setDefaultSyncType(oFF.SyncType.NON_BLOCKING);
			}
		}
		logLevel = argStructure.getIntegerByKeyExt(
				oFF.DfProgram.PARAM_LOG_LEVEL, -1);
		if (logLevel !== -1) {
			logWriterWithFilter = session.getLogWriterBase();
			logWriterWithFilter.setFilterLevel(logLevel);
		}
		logLayerName = argStructure.getStringByKeyExt(
				oFF.DfProgram.PARAM_LOG_LAYER, null);
		if (oFF.notNull(logLayerName)) {
			logWriterWithFilter2 = session.getLogWriterBase();
			tempOriginLayer = oFF.OriginLayer.lookup(logLayerName);
			if (oFF.notNull(tempOriginLayer)) {
				logWriterWithFilter2.addLayer(tempOriginLayer);
			}
		}
		this.setShowHelp(argStructure.getBooleanByKeyExt(
				oFF.DfProgram.PARAM_SHOW_HELP, this.m_showHelp));
	};
	oFF.DfProgram.prototype.initializeProgram = function() {
	};
	oFF.DfProgram.prototype.runProgram = function() {
		var programMetadata;
		var helpText;
		if (this.m_showHelp === true) {
			programMetadata = this.getProgramMetadata();
			helpText = oFF.ProgramUtils.generateHelp(programMetadata);
			this.println(helpText);
			this.exitNow(1);
		} else {
			this.runProcess();
		}
	};
	oFF.DfProgram.prototype.exitNow = function(code) {
		var session = this.getSession();
		var programExecutor = session.getWindow();
		if (oFF.notNull(programExecutor)) {
			programExecutor.signalExit(0);
		}
	};
	oFF.DfProgram.prototype.getProgramExecutor = function() {
		return this.getSession().getProgramExecutor();
	};
	oFF.DfProgram.prototype.getWindow = function() {
		return this.getSession().getWindow();
	};
	oFF.DfProgram.prototype.getArgumentList = function() {
		return this.getArguments().getArgumentList();
	};
	oFF.DfProgram.prototype.getArgumentStructure = function() {
		return this.getArguments().getArgumentStructure();
	};
	oFF.DfProgram.prototype.getArguments = function() {
		var args = this.getSession().getArguments();
		var argDefs;
		if (args.getArgumentDefinitions() === null) {
			argDefs = this.getProgramMetadata().getArgDefinitions();
			args.setArgumentDefinitions(argDefs);
		}
		return args;
	};
	oFF.DfProgram.prototype.getProcessId = function() {
		return this.m_session.getProcessId();
	};
	oFF.DfProgram.prototype.setSession = function(session) {
		this.m_session = session;
	};
	oFF.DfProgram.prototype.getSession = function() {
		return this.m_session;
	};
	oFF.DfProgram.prototype.setDefaultSyncType = oFF.noSupport;
	oFF.DfProgram.prototype.getDefaultSyncType = function() {
		return this.m_session.getDefaultSyncType();
	};
	oFF.DfProgram.prototype.isShowHelp = function() {
		return this.m_showHelp;
	};
	oFF.DfProgram.prototype.setShowHelp = function(hasShowHelp) {
		this.m_showHelp = hasShowHelp;
	};
	oFF.DfProgram.prototype.getLogWriter = function() {
		return this.getSession().getLogWriter();
	};
	oFF.DfProgram.prototype.getStdout = function() {
		return this.getSession().getStdout();
	};
	oFF.DfProgram.prototype.getStdin = function() {
		return this.getSession().getStdin();
	};
	oFF.DfProgram.prototype.getStdlog = function() {
		return this.getSession().getStdlog();
	};
	oFF.DfProgram.prototype.print = function(text) {
		var outputWriteStream = this.getStdout();
		if (oFF.notNull(outputWriteStream)) {
			outputWriteStream.print(text);
		}
	};
	oFF.DfProgram.prototype.println = function(text) {
		var outputWriteStream = this.getStdout();
		if (oFF.notNull(outputWriteStream)) {
			outputWriteStream.println(text);
		}
	};
	oFF.DfProgram.prototype.readLine = function(listener) {
		return null;
	};
	oFF.DfProgram.prototype.supportsSyncType = function(syncType) {
		return false;
	};
	oFF.DfSessionContext = function() {
	};
	oFF.DfSessionContext.prototype = new oFF.XObjectExt();
	oFF.DfSessionContext.prototype.m_session = null;
	oFF.DfSessionContext.prototype.setupSessionContext = function(session) {
		oFF.XObjectExt.prototype.setup.call(this);
		this.setSession(session);
	};
	oFF.DfSessionContext.prototype.releaseObject = function() {
		this.m_session = null;
		oFF.XObjectExt.prototype.releaseObject.call(this);
	};
	oFF.DfSessionContext.prototype.getSession = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_session);
	};
	oFF.DfSessionContext.prototype.setSession = function(session) {
		this.m_session = oFF.XWeakReferenceUtil.getWeakRef(session);
	};
	oFF.DfSessionContext.prototype.getLogWriter = function() {
		var session = this.getSession();
		if (oFF.notNull(session)) {
			return session.getLogWriter();
		} else {
			return null;
		}
	};
	oFF.DfSessionContext.prototype.getStdout = function() {
		var session = this.getSession();
		if (oFF.notNull(session)) {
			return session.getStdout();
		} else {
			return null;
		}
	};
	oFF.DfSessionContext.prototype.getStdin = function() {
		var session = this.getSession();
		if (oFF.notNull(session)) {
			return session.getStdin();
		} else {
			return null;
		}
	};
	oFF.DfSessionContext.prototype.getStdlog = function() {
		var session = this.getSession();
		if (oFF.notNull(session)) {
			return session.getStdlog();
		} else {
			return null;
		}
	};
	oFF.DfSessionContext.prototype.getEnvironment = function() {
		return this.getSession().getEnvironment();
	};
	oFF.MessageManager = function() {
	};
	oFF.MessageManager.prototype = new oFF.DfSessionContext();
	oFF.MessageManager.createMessageManagerExt = function(session) {
		var object = new oFF.MessageManager();
		object.setupSessionContext(session);
		return object;
	};
	oFF.MessageManager.createMessageManager = function() {
		var object = new oFF.MessageManager();
		object.setupSessionContext(null);
		return object;
	};
	oFF.MessageManager.shouldMessageBeAdded = function(message) {
		var messageCode;
		var severity;
		if (oFF.notNull(message)) {
			messageCode = message.getCode();
			if (messageCode === 42021) {
				severity = message.getSeverity();
				if (severity === oFF.Severity.WARNING) {
					return false;
				}
			}
		}
		return true;
	};
	oFF.MessageManager.prototype.m_messages = null;
	oFF.MessageManager.prototype.m_profileNode = null;
	oFF.MessageManager.prototype.m_clientStatusCode = 0;
	oFF.MessageManager.prototype.m_serverStatusCode = 0;
	oFF.MessageManager.prototype.m_serverStatusDetails = null;
	oFF.MessageManager.prototype.setupSessionContext = function(session) {
		oFF.DfSessionContext.prototype.setupSessionContext.call(this, session);
		this.m_messages = oFF.XList.create();
		this.m_profileNode = oFF.ProfileNode.create(this.getComponentName(), 0);
	};
	oFF.MessageManager.prototype.releaseObject = function() {
		this.m_messages = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_messages);
		this.m_profileNode = oFF.XObjectExt.release(this.m_profileNode);
		oFF.DfSessionContext.prototype.releaseObject.call(this);
	};
	oFF.MessageManager.prototype.addAllMessages = function(messages) {
		var rootProfileNode;
		if (oFF.notNull(messages)) {
			this.m_messages.addAll(messages.getMessages());
			rootProfileNode = messages.getRootProfileNode();
			this.addProfileNode(rootProfileNode);
			this.setClientStatusCode(messages.getClientStatusCode());
			this.setServerStatusCode(messages.getServerStatusCode());
			this.setServerStatusDetails(messages.getServerStatusDetails());
		}
	};
	oFF.MessageManager.prototype.copyAllMessages = function(messages) {
		var messageList;
		var i;
		var rootProfileNode;
		if (oFF.notNull(messages)) {
			messageList = messages.getMessages();
			if (oFF.notNull(messageList)) {
				for (i = 0; i < messageList.size(); i++) {
					this.m_messages.add(messageList.get(i).clone());
				}
			}
			rootProfileNode = messages.getRootProfileNode();
			this.addProfileNode(rootProfileNode.clone());
			this.setClientStatusCode(messages.getClientStatusCode());
			this.setServerStatusCode(messages.getServerStatusCode());
			this.setServerStatusDetails(messages.getServerStatusDetails());
		}
	};
	oFF.MessageManager.prototype.getDefaultMessageLayer = function() {
		return oFF.OriginLayer.APPLICATION;
	};
	oFF.MessageManager.prototype.getComponentName = function() {
		return "MessageManager";
	};
	oFF.MessageManager.prototype.isValid = function() {
		return !this.hasErrors();
	};
	oFF.MessageManager.prototype.hasErrors = function() {
		return this.hasSeverity(oFF.Severity.ERROR);
	};
	oFF.MessageManager.prototype.getNumberOfErrors = function() {
		return this.getNumberOfSeverity(oFF.Severity.ERROR);
	};
	oFF.MessageManager.prototype.hasSeverity = function(severity) {
		var size = this.m_messages.size();
		var i;
		for (i = 0; i < size; i++) {
			if (this.m_messages.get(i).getSeverity() === severity) {
				return true;
			}
		}
		return false;
	};
	oFF.MessageManager.prototype.getNumberOfSeverity = function(severity) {
		var count = 0;
		var size = this.m_messages.size();
		var i;
		for (i = 0; i < size; i++) {
			if (this.m_messages.get(i).getSeverity() === severity) {
				count++;
			}
		}
		return count;
	};
	oFF.MessageManager.prototype.getFirstError = function() {
		return this.getFirstWithSeverity(oFF.Severity.ERROR);
	};
	oFF.MessageManager.prototype.getFirstWithSeverity = function(severity) {
		var size = this.m_messages.size();
		var i;
		var msg;
		for (i = 0; i < size; i++) {
			msg = this.m_messages.get(i);
			if (msg.getSeverity() === severity) {
				return msg;
			}
		}
		return null;
	};
	oFF.MessageManager.prototype.getErrors = function() {
		return this.getMessagesBySeverity(oFF.Severity.ERROR);
	};
	oFF.MessageManager.prototype.getWarnings = function() {
		return this.getMessagesBySeverity(oFF.Severity.WARNING);
	};
	oFF.MessageManager.prototype.getInfos = function() {
		return this.getMessagesBySeverity(oFF.Severity.INFO);
	};
	oFF.MessageManager.prototype.getSemanticalErrors = function() {
		return this.getMessagesBySeverity(oFF.Severity.SEMANTICAL_ERROR);
	};
	oFF.MessageManager.prototype.getMessagesBySeverity = function(severity) {
		var returnList = oFF.XList.create();
		var size = this.m_messages.size();
		var i;
		var msg;
		for (i = 0; i < size; i++) {
			msg = this.m_messages.get(i);
			if (msg.getSeverity() === severity) {
				returnList.add(msg);
			}
		}
		return returnList;
	};
	oFF.MessageManager.prototype.getMessages = function() {
		return this.m_messages;
	};
	oFF.MessageManager.prototype.addInfo = function(code, message) {
		return this.addInfoExt(this.getDefaultMessageLayer(), code, message);
	};
	oFF.MessageManager.prototype.addInfoExt = function(originLayer, code,
			message) {
		return this.addNewMessage(originLayer, oFF.Severity.INFO, code,
				message, true, null);
	};
	oFF.MessageManager.prototype.addWarning = function(code, message) {
		return this.addWarningExt(this.getDefaultMessageLayer(), code, message);
	};
	oFF.MessageManager.prototype.addWarningExt = function(originLayer, code,
			message) {
		return this.addNewMessage(originLayer, oFF.Severity.WARNING, code,
				message, true, null);
	};
	oFF.MessageManager.prototype.addErrorWithMessage = function(message) {
		return this.addErrorExt(this.getDefaultMessageLayer(),
				oFF.ErrorCodes.OTHER_ERROR, message, null);
	};
	oFF.MessageManager.prototype.addError = function(code, message) {
		return this.addErrorExt(this.getDefaultMessageLayer(), code, message,
				null);
	};
	oFF.MessageManager.prototype.addErrorExt = function(originLayer, code,
			message, extendedInfo) {
		return this.addNewMessage(originLayer, oFF.Severity.ERROR, code,
				message, true, extendedInfo);
	};
	oFF.MessageManager.prototype.addSemanticalError = function(originLayer,
			code, message) {
		return this.addNewMessage(originLayer, oFF.Severity.SEMANTICAL_ERROR,
				code, message, true, null);
	};
	oFF.MessageManager.prototype.addNewMessage = function(originLayer,
			severity, code, message, withStackTrace, extendedInfo) {
		var newMessage = oFF.XMessage.createMessage(originLayer, severity,
				code, message, null, withStackTrace, extendedInfo);
		this.logExt(originLayer, severity, code, message);
		this.addMessage(newMessage);
		return newMessage;
	};
	oFF.MessageManager.prototype.getLogWriter = function() {
		var logger = null;
		var session = this.getSession();
		if (oFF.notNull(session)) {
			logger = session.getLogWriter();
		}
		return logger;
	};
	oFF.MessageManager.prototype.addMessage = function(message) {
		var code;
		if (oFF.MessageManager.shouldMessageBeAdded(message)) {
			code = message.getCode();
			if (this.m_clientStatusCode === 0 && code !== 0) {
				this.setClientStatusCode(code);
			}
			this.m_messages.add(message);
		}
	};
	oFF.MessageManager.prototype.clearMessages = function() {
		this.m_messages.clear();
		this.m_clientStatusCode = 0;
		this.m_serverStatusCode = 0;
		this.m_serverStatusDetails = null;
	};
	oFF.MessageManager.prototype.getDuration = function() {
		return this.m_profileNode.getDuration();
	};
	oFF.MessageManager.prototype.getProfilingStart = function() {
		return this.m_profileNode.getProfilingStart();
	};
	oFF.MessageManager.prototype.getProfilingEnd = function() {
		return this.m_profileNode.getProfilingEnd();
	};
	oFF.MessageManager.prototype.getProfileSteps = function() {
		return this.m_profileNode.getProfileSteps();
	};
	oFF.MessageManager.prototype.getProfileNodeText = function() {
		return this.m_profileNode.getProfileNodeText();
	};
	oFF.MessageManager.prototype.addProfileStep = function(text) {
		this.m_profileNode.addProfileStep(text);
	};
	oFF.MessageManager.prototype.hasProfileParent = function() {
		return this.m_profileNode.hasProfileParent();
	};
	oFF.MessageManager.prototype.detailProfileNode = function(name, detailNode,
			nameOfRest) {
		this.m_profileNode.detailProfileNode(name, detailNode, nameOfRest);
	};
	oFF.MessageManager.prototype.renameLastProfileStep = function(text) {
		this.m_profileNode.renameLastProfileStep(text);
	};
	oFF.MessageManager.prototype.addProfileNode = function(node) {
		if (oFF.notNull(node) && node.getProfilingStart() !== 0) {
			this.m_profileNode.addProfileNode(node);
		}
	};
	oFF.MessageManager.prototype.endProfileStep = function() {
		this.m_profileNode.endProfileStep();
	};
	oFF.MessageManager.prototype.getRootProfileNode = function() {
		return this.m_profileNode;
	};
	oFF.MessageManager.prototype.getClientStatusCode = function() {
		return this.m_clientStatusCode;
	};
	oFF.MessageManager.prototype.setClientStatusCode = function(statusCode) {
		this.m_clientStatusCode = statusCode;
	};
	oFF.MessageManager.prototype.getServerStatusCode = function() {
		return this.m_serverStatusCode;
	};
	oFF.MessageManager.prototype.setServerStatusCode = function(statusCode) {
		this.m_serverStatusCode = statusCode;
	};
	oFF.MessageManager.prototype.getServerStatusDetails = function() {
		return this.m_serverStatusDetails;
	};
	oFF.MessageManager.prototype.setServerStatusDetails = function(
			statusDetails) {
		this.m_serverStatusDetails = statusDetails;
	};
	oFF.MessageManager.prototype.getSummary = function() {
		var sb = oFF.XStringBuffer.create();
		var iterator;
		var first;
		if (this.m_messages.hasElements()) {
			iterator = this.m_messages.getIterator();
			first = true;
			while (iterator.hasNext()) {
				if (first) {
					first = false;
				} else {
					sb.appendNewLine();
				}
				sb.append(iterator.next().toString());
			}
			oFF.XObjectExt.release(iterator);
		}
		return sb.toString();
	};
	oFF.MessageManager.prototype.toString = function() {
		var sb = oFF.XStringBuffer.create();
		if (this.m_messages.isEmpty()) {
			sb.appendLine("No errors - everything OK");
		} else {
			sb.appendLine("Messages");
			sb.append(this.getSummary());
		}
		return sb.toString();
	};
	oFF.XMessage = function() {
	};
	oFF.XMessage.prototype = new oFF.XAbstractValue();
	oFF.XMessage.createMessage = function(originLayer, severity, code, message,
			errorCause, withStackTrace, extendedInfo) {
		var msg = new oFF.XMessage();
		msg.setupMsg(originLayer, severity, code, message, errorCause,
				withStackTrace, extendedInfo);
		return msg;
	};
	oFF.XMessage.createError = function(originLayer, message, errorCause,
			withStackTrace, extendedInfo) {
		return oFF.XMessage.createMessage(originLayer, oFF.Severity.ERROR,
				oFF.ErrorCodes.OTHER_ERROR, message, errorCause,
				withStackTrace, extendedInfo);
	};
	oFF.XMessage.createErrorWithCode = function(originLayer, errorCode,
			message, errorCause, withStackTrace, extendedInfo) {
		return oFF.XMessage.createMessage(originLayer, oFF.Severity.ERROR,
				errorCode, message, errorCause, withStackTrace, extendedInfo);
	};
	oFF.XMessage.prototype.m_text = null;
	oFF.XMessage.prototype.m_severity = null;
	oFF.XMessage.prototype.m_originLayer = null;
	oFF.XMessage.prototype.m_errorCause = null;
	oFF.XMessage.prototype.m_stackTrace = null;
	oFF.XMessage.prototype.m_extendedInfo = null;
	oFF.XMessage.prototype.m_extendedInfoType = null;
	oFF.XMessage.prototype.m_messageClass = null;
	oFF.XMessage.prototype.m_olapMessageClass = 0;
	oFF.XMessage.prototype.m_code = 0;
	oFF.XMessage.prototype.setupMsg = function(originLayer, severity,
			errorCode, message, errorCause, withStackTrace, nativeCause) {
		this.setText(message);
		this.m_originLayer = originLayer;
		this.m_severity = severity;
		this.m_code = errorCode;
		this.m_extendedInfoType = oFF.ExtendedInfoType.UNKNOWN;
		this.m_errorCause = errorCause;
		if (withStackTrace && oFF.XStackTrace.supportsStackTrace()) {
			this.m_stackTrace = oFF.XStackTrace.create(3);
		}
		this.m_extendedInfo = nativeCause;
		this.m_olapMessageClass = -1;
	};
	oFF.XMessage.prototype.releaseObject = function() {
		this.m_errorCause = oFF.XObjectExt.release(this.m_errorCause);
		this.m_stackTrace = oFF.XObjectExt.release(this.m_stackTrace);
		this.m_extendedInfo = null;
		this.m_extendedInfoType = null;
		this.m_messageClass = null;
		this.m_originLayer = null;
		this.m_severity = null;
		this.m_text = null;
		oFF.XAbstractValue.prototype.releaseObject.call(this);
	};
	oFF.XMessage.prototype.setExtendendInfo = function(extendedInfo) {
		this.m_extendedInfo = extendedInfo;
	};
	oFF.XMessage.prototype.setExtendendInfoType = function(extendedInfoType) {
		this.m_extendedInfoType = extendedInfoType;
	};
	oFF.XMessage.prototype.setMessageClass = function(msgClass) {
		this.m_messageClass = msgClass;
	};
	oFF.XMessage.prototype.getMessageClass = function() {
		return this.m_messageClass;
	};
	oFF.XMessage.prototype.hasErrorCause = function() {
		return oFF.notNull(this.m_errorCause);
	};
	oFF.XMessage.prototype.getErrorCause = function() {
		return this.m_errorCause;
	};
	oFF.XMessage.prototype.hasStackTrace = function() {
		return oFF.notNull(this.m_stackTrace);
	};
	oFF.XMessage.prototype.getStackTrace = function() {
		return this.m_stackTrace;
	};
	oFF.XMessage.prototype.hasExtendedInfo = function() {
		return oFF.notNull(this.m_extendedInfo);
	};
	oFF.XMessage.prototype.getExtendedInfo = function() {
		return this.m_extendedInfo;
	};
	oFF.XMessage.prototype.getExtendedInfoType = function() {
		return this.m_extendedInfoType;
	};
	oFF.XMessage.prototype.hasCode = function() {
		return this.m_code !== oFF.ErrorCodes.OTHER_ERROR;
	};
	oFF.XMessage.prototype.getCode = function() {
		return this.m_code;
	};
	oFF.XMessage.prototype.getValueType = function() {
		return oFF.XValueType.ERROR_VALUE;
	};
	oFF.XMessage.prototype.getSeverity = function() {
		return this.m_severity;
	};
	oFF.XMessage.prototype.getOriginLayer = function() {
		return this.m_originLayer;
	};
	oFF.XMessage.prototype.resetValue = function(value) {
		var valueMessage;
		var stackTrace;
		oFF.XAbstractValue.prototype.resetValue.call(this, value);
		if (this === value) {
			return;
		}
		valueMessage = value;
		this.m_code = valueMessage.getCode();
		this.m_errorCause = valueMessage.getErrorCause();
		this.m_extendedInfo = valueMessage.getExtendedInfo();
		this.m_extendedInfoType = valueMessage.getExtendedInfoType();
		this.m_messageClass = valueMessage.getMessageClass();
		this.m_severity = valueMessage.getSeverity();
		stackTrace = valueMessage.getStackTrace();
		this.m_stackTrace = oFF.XObjectExt.cloneIfNotNull(stackTrace);
	};
	oFF.XMessage.prototype.clone = function() {
		var message = oFF.XMessage.createMessage(this.m_originLayer,
				this.m_severity, this.m_code, this.getText(),
				this.m_errorCause, oFF.notNull(this.m_stackTrace),
				this.m_extendedInfo);
		message.setExtendendInfoType(this.m_extendedInfoType);
		return message;
	};
	oFF.XMessage.prototype.isEqualTo = function(other) {
		var otherMessage;
		if (!oFF.XAbstractValue.prototype.isEqualTo.call(this, other)) {
			return false;
		}
		otherMessage = other;
		if (!this.getSeverity().isEqualTo(otherMessage.getSeverity())) {
			return false;
		}
		if (this.getCode() !== otherMessage.getCode()) {
			return false;
		}
		return true;
	};
	oFF.XMessage.prototype.toString = function() {
		var buffer = oFF.XStringBuffer.create();
		var extendedInfoType;
		buffer.append(this.m_severity.getName());
		buffer.append(" [").append(this.m_originLayer.getName()).append("]:");
		if (this.m_code !== oFF.ErrorCodes.OTHER_ERROR) {
			buffer.append(" (#").appendInt(this.m_code).append(")");
		}
		if (this.getText() !== null) {
			buffer.append(" ").append(this.getText());
		}
		if (oFF.notNull(this.m_messageClass)) {
			buffer.append("; MsgClass: ").append(this.m_messageClass).append(
					";");
		}
		if (this.m_olapMessageClass !== -1) {
			buffer.append("; OlapMsgClass: ")
					.appendInt(this.m_olapMessageClass).append(";");
		}
		if (this.getExtendedInfo() !== null) {
			extendedInfoType = this.getExtendedInfoType();
			if (extendedInfoType !== oFF.ExtendedInfoType.QUERY_MODEL_ID) {
				if (oFF.notNull(extendedInfoType)
						&& extendedInfoType !== oFF.ExtendedInfoType.UNKNOWN) {
					buffer.append(" ").append(extendedInfoType.getName());
				}
				buffer.append(" [").append(this.getExtendedInfo().toString())
						.append("]");
			}
		}
		return buffer.toString();
	};
	oFF.XMessage.prototype.getOlapMessageClass = function() {
		return this.m_olapMessageClass;
	};
	oFF.XMessage.prototype.setOlapMessageClass = function(olapMessageClass) {
		this.m_olapMessageClass = olapMessageClass;
	};
	oFF.XMessage.prototype.setText = function(text) {
		this.m_text = text;
	};
	oFF.XMessage.prototype.getText = function() {
		return this.m_text;
	};
	oFF.XValueAccess = function() {
	};
	oFF.XValueAccess.prototype = new oFF.XObject();
	oFF.XValueAccess.create = function() {
		return new oFF.XValueAccess();
	};
	oFF.XValueAccess.createWithType = function(valueType) {
		var newObj = new oFF.XValueAccess();
		newObj.m_type = valueType;
		return newObj;
	};
	oFF.XValueAccess.createWithValue = function(value) {
		var newObj = new oFF.XValueAccess();
		newObj.m_value = value;
		newObj.m_type = value.getValueType();
		return newObj;
	};
	oFF.XValueAccess.copy = function(source, dest) {
		var valueType = source.getValueType();
		if (valueType === oFF.XValueType.INTEGER) {
			dest.setInteger(source.getInteger());
		} else {
			if (valueType === oFF.XValueType.LONG) {
				dest.setLong(source.getLong());
			} else {
				if (valueType === oFF.XValueType.DOUBLE) {
					dest.setDouble(source.getDouble());
				} else {
					if (valueType === oFF.XValueType.STRING) {
						dest.setString(source.getString());
					} else {
						if (valueType === oFF.XValueType.BOOLEAN) {
							dest.setBoolean(source.getBoolean());
						} else {
							if (valueType === oFF.XValueType.DATE) {
								dest.setDate(source.getDate().clone());
							} else {
								if (valueType === oFF.XValueType.TIME) {
									dest.setTime(source.getTime().clone());
								} else {
									if (valueType === oFF.XValueType.DATE_TIME) {
										dest.setDateTime(source.getDateTime()
												.clone());
									} else {
										if (valueType === oFF.XValueType.TIMESPAN) {
											dest.setTimeSpan(source
													.getTimeSpan());
										} else {
											if (valueType === oFF.XValueType.LINE_STRING) {
												dest.setLineString(source
														.getLineString()
														.clone());
											} else {
												if (valueType === oFF.XValueType.MULTI_LINE_STRING) {
													dest
															.setMultiLineString(source
																	.getMultiLineString()
																	.clone());
												} else {
													if (valueType === oFF.XValueType.POINT) {
														dest.setPoint(source
																.getPoint()
																.clone());
													} else {
														if (valueType === oFF.XValueType.MULTI_POINT) {
															dest
																	.setMultiPoint(source
																			.getMultiPoint()
																			.clone());
														} else {
															if (valueType === oFF.XValueType.POLYGON) {
																dest
																		.setPolygon(source
																				.getPolygon()
																				.clone());
															} else {
																if (valueType === oFF.XValueType.MULTI_POLYGON) {
																	dest
																			.setMultiPolygon(source
																					.getMultiPolygon()
																					.clone());
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};
	oFF.XValueAccess.prototype.m_type = null;
	oFF.XValueAccess.prototype.m_value = null;
	oFF.XValueAccess.prototype.releaseObject = function() {
		this.m_type = null;
		this.m_value = oFF.XObjectExt.release(this.m_value);
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.XValueAccess.prototype.isEqualTo = function(other) {
		var xOther;
		if (oFF.isNull(other)) {
			return false;
		}
		if (this === other) {
			return true;
		}
		xOther = other;
		if (this.hasValue() !== xOther.hasValue()) {
			return false;
		}
		if (this.getValue() === null && xOther.getValue() === null) {
			return this.getValueType() === xOther.getValueType();
		}
		return this.getValue().isEqualTo(xOther.getValue());
	};
	oFF.XValueAccess.prototype.getValueType = function() {
		return this.m_type;
	};
	oFF.XValueAccess.prototype.getValue = function() {
		return this.m_value;
	};
	oFF.XValueAccess.prototype.getString = function() {
		if (oFF.isNull(this.m_value)) {
			return null;
		}
		if (this.m_type.isSpatial()) {
			return this.m_value.toWKT();
		}
		return this.m_value.toString();
	};
	oFF.XValueAccess.prototype.assertValueType = function(expected) {
		if (oFF.notNull(this.m_type) && this.m_type !== expected) {
			throw oFF.XException
					.createIllegalArgumentException(oFF.XStringUtils
							.concatenate2("ValueAccess is not of type ",
									expected.getName()));
		}
		this.m_type = expected;
	};
	oFF.XValueAccess.prototype.setString = function(value) {
		this.assertValueType(oFF.XValueType.STRING);
		this.m_value = oFF.XStringValue.create(value);
	};
	oFF.XValueAccess.prototype.getInteger = function() {
		if (this.m_type === oFF.XValueType.INTEGER) {
			return this.m_value.getInteger();
		}
		return 0;
	};
	oFF.XValueAccess.prototype.setInteger = function(value) {
		this.assertValueType(oFF.XValueType.INTEGER);
		this.m_value = oFF.XIntegerValue.create(value);
	};
	oFF.XValueAccess.prototype.getBoolean = function() {
		if (this.m_type === oFF.XValueType.BOOLEAN) {
			return this.m_value.getBoolean();
		}
		if (this.m_type === oFF.XValueType.INTEGER) {
			return this.getInteger() !== 0;
		}
		if (this.m_type === oFF.XValueType.LONG) {
			return this.getLong() !== 0;
		}
		if (this.m_type === oFF.XValueType.DOUBLE) {
			return this.getDouble() !== 0;
		}
		if (this.m_type === oFF.XValueType.STRING) {
			return oFF.XString.isEqual(oFF.XString.toUpperCase(oFF.XString
					.trim(this.getString())), "TRUE");
		}
		return false;
	};
	oFF.XValueAccess.prototype.setBoolean = function(value) {
		this.assertValueType(oFF.XValueType.BOOLEAN);
		this.m_value = oFF.XBooleanValue.create(value);
	};
	oFF.XValueAccess.prototype.getLong = function() {
		if (this.m_type === oFF.XValueType.LONG) {
			return this.m_value.getLong();
		}
		if (this.m_type === oFF.XValueType.INTEGER) {
			return this.m_value.getInteger();
		}
		if (this.m_type === oFF.XValueType.DOUBLE) {
			return oFF.XDouble.convertToLong(this.m_value.getDouble());
		}
		if (this.m_type === oFF.XValueType.STRING) {
			return oFF.XLong.convertFromString(this.m_value.toString());
		}
		if (this.m_type === oFF.XValueType.TIMESPAN) {
			return this.m_value.getTimeSpan();
		}
		return 0;
	};
	oFF.XValueAccess.prototype.setLong = function(value) {
		this.assertValueType(oFF.XValueType.LONG);
		this.m_value = oFF.XLongValue.create(value);
	};
	oFF.XValueAccess.prototype.getDouble = function() {
		if (this.m_type === oFF.XValueType.DOUBLE) {
			return this.m_value.getDouble();
		}
		if (this.m_type === oFF.XValueType.STRING) {
			return oFF.XDouble.convertFromString(this.getString());
		}
		if (this.m_type === oFF.XValueType.INTEGER) {
			return oFF.XInteger.convertToDouble(this.getInteger());
		}
		if (this.m_type === oFF.XValueType.LONG) {
			return oFF.XLong.convertToDouble(this.getLong());
		}
		if (this.m_type === oFF.XValueType.TIMESPAN) {
			return oFF.XLong.convertToDouble(this.m_value.getTimeSpan());
		}
		return 0;
	};
	oFF.XValueAccess.prototype.setDouble = function(value) {
		this.assertValueType(oFF.XValueType.DOUBLE);
		this.m_value = oFF.XDoubleValue.create(value);
	};
	oFF.XValueAccess.prototype.setDate = function(value) {
		this.assertValueType(oFF.XValueType.DATE);
		this.m_value = value;
	};
	oFF.XValueAccess.prototype.getDate = function() {
		return this.m_value;
	};
	oFF.XValueAccess.prototype.setDateTime = function(value) {
		this.assertValueType(oFF.XValueType.DATE_TIME);
		this.m_value = value;
	};
	oFF.XValueAccess.prototype.getDateTime = function() {
		return this.m_value;
	};
	oFF.XValueAccess.prototype.getTime = function() {
		return this.m_value;
	};
	oFF.XValueAccess.prototype.setTime = function(value) {
		this.assertValueType(oFF.XValueType.TIME);
		this.m_value = value;
	};
	oFF.XValueAccess.prototype.getTimeSpan = function() {
		return this.m_value;
	};
	oFF.XValueAccess.prototype.setTimeSpan = function(value) {
		this.assertValueType(oFF.XValueType.TIMESPAN);
		this.m_value = value;
	};
	oFF.XValueAccess.prototype.getGeometry = function() {
		return this.m_value;
	};
	oFF.XValueAccess.prototype.getPolygon = function() {
		return this.m_value;
	};
	oFF.XValueAccess.prototype.setPolygon = function(value) {
		this.assertValueType(oFF.XValueType.POLYGON);
		this.m_value = value;
	};
	oFF.XValueAccess.prototype.getPoint = function() {
		return this.m_value;
	};
	oFF.XValueAccess.prototype.setPoint = function(value) {
		this.assertValueType(oFF.XValueType.POINT);
		this.m_value = value;
	};
	oFF.XValueAccess.prototype.setMultiPoint = function(value) {
		this.assertValueType(oFF.XValueType.MULTI_POINT);
		this.m_value = value;
	};
	oFF.XValueAccess.prototype.getMultiPoint = function() {
		return this.m_value;
	};
	oFF.XValueAccess.prototype.setMultiPolygon = function(value) {
		this.assertValueType(oFF.XValueType.MULTI_POLYGON);
		this.m_value = value;
	};
	oFF.XValueAccess.prototype.getMultiPolygon = function() {
		return this.m_value;
	};
	oFF.XValueAccess.prototype.setLineString = function(value) {
		this.assertValueType(oFF.XValueType.LINE_STRING);
		this.m_value = value;
	};
	oFF.XValueAccess.prototype.getLineString = function() {
		return this.m_value;
	};
	oFF.XValueAccess.prototype.setMultiLineString = function(value) {
		this.assertValueType(oFF.XValueType.MULTI_LINE_STRING);
		this.m_value = value;
	};
	oFF.XValueAccess.prototype.getMultiLineString = function() {
		return this.m_value;
	};
	oFF.XValueAccess.prototype.getNull = function() {
		return null;
	};
	oFF.XValueAccess.prototype.setNullByType = function(nullValueType) {
		this.m_value = null;
		this.m_type = nullValueType;
	};
	oFF.XValueAccess.prototype.hasValue = function() {
		return oFF.notNull(this.m_value);
	};
	oFF.XValueAccess.prototype.copyFrom = function(source) {
		oFF.XValueAccess.copy(source, this);
	};
	oFF.XValueAccess.prototype.parseString = function(value) {
		var messages = oFF.MessageManager.createMessageManager();
		var valueType = this.getValueType();
		var doubleValue;
		var intValue;
		var longValue;
		var booleanValue;
		var dateValue;
		var timeValue;
		var dateTimeValue;
		var timespan;
		var timeSpanValue;
		var geometryType;
		var geometryValue;
		var message;
		if (valueType === oFF.XValueType.STRING) {
			this.setString(value);
		} else {
			if (valueType === oFF.XValueType.DOUBLE
					|| valueType === oFF.XValueType.DECIMAL_FLOAT) {
				try {
					doubleValue = oFF.XDouble.convertFromString(value);
					this.setDouble(doubleValue);
				} catch (a) {
					messages.addError(
							oFF.ErrorCodes.PARSING_ERROR_DOUBLE_VALUE,
							"Cannot parse double value");
				}
			} else {
				if (valueType === oFF.XValueType.INTEGER) {
					try {
						intValue = oFF.XInteger.convertFromStringWithRadix(
								value, 10);
						this.setInteger(intValue);
					} catch (b) {
						messages.addError(
								oFF.ErrorCodes.PARSING_ERROR_INT_VALUE,
								"Cannot parse integer value");
					}
				} else {
					if (valueType === oFF.XValueType.LONG) {
						try {
							longValue = oFF.XLong.convertFromString(value);
							this.setLong(longValue);
						} catch (c) {
							messages.addError(
									oFF.ErrorCodes.PARSING_ERROR_LONG_VALUE,
									"Cannot parse long value");
						}
					} else {
						if (valueType === oFF.XValueType.BOOLEAN) {
							try {
								booleanValue = oFF.XBoolean
										.convertFromString(value);
								this.setBoolean(booleanValue);
							} catch (d) {
								messages
										.addError(
												oFF.ErrorCodes.PARSING_ERROR_BOOLEAN_VALUE,
												"Cannot parse boolean value");
							}
						} else {
							if (valueType === oFF.XValueType.DATE) {
								try {
									dateValue = oFF.XDate.createDateFromString(
											value, oFF.XValueFormat.ISO_DATE);
									if (oFF.isNull(dateValue)) {
										messages
												.addError(
														oFF.ErrorCodes.PARSING_ERROR_DATE_VALUE,
														"Cannot parse date value");
									} else {
										this.setDate(dateValue);
									}
								} catch (e) {
									messages
											.addError(
													oFF.ErrorCodes.PARSING_ERROR_DATE_VALUE,
													"Cannot parse date value");
								}
							} else {
								if (valueType === oFF.XValueType.TIME) {
									try {
										timeValue = oFF.XTime
												.createTimeFromString(
														value,
														oFF.XValueFormat.ISO_DATE);
										this.setTime(timeValue);
									} catch (f) {
										messages
												.addError(
														oFF.ErrorCodes.PARSING_ERROR_TIME_VALUE,
														"Cannot parse time value");
									}
								} else {
									if (valueType === oFF.XValueType.DATE_TIME) {
										try {
											dateTimeValue = oFF.XDateTime
													.createDateTimeFromString(
															value,
															oFF.XValueFormat.ISO_DATE);
											if (oFF.isNull(dateTimeValue)) {
												messages
														.addError(
																oFF.ErrorCodes.PARSING_ERROR_DATE_TIME_VALUE,
																"Cannot parse date time value");
											} else {
												this.setDateTime(dateTimeValue);
											}
										} catch (g) {
											messages
													.addError(
															oFF.ErrorCodes.PARSING_ERROR_DATE_TIME_VALUE,
															"Cannot parse date time value");
										}
									} else {
										if (valueType === oFF.XValueType.TIMESPAN) {
											try {
												timespan = oFF.XLong
														.convertFromString(value);
												timeSpanValue = oFF.XTimeSpan
														.create(timespan);
												this.setTimeSpan(timeSpanValue);
											} catch (h) {
												messages
														.addError(
																oFF.ErrorCodes.PARSING_ERROR_TIMESPAN,
																"Cannot parse timespan value");
											}
										} else {
											if (valueType.isSpatial()) {
												geometryType = null;
												try {
													geometryValue = oFF.XGeometryValue
															.createGeometryValueWithWkt(value);
													oFF.XObjectExt
															.checkNotNull(
																	geometryValue,
																	"Cannot parse spatial value");
													geometryType = geometryValue
															.getValueType();
													if (geometryType === oFF.XValueType.POINT) {
														this
																.setPoint(geometryValue);
													} else {
														if (geometryType === oFF.XValueType.MULTI_POINT) {
															this
																	.setMultiPoint(geometryValue);
														} else {
															if (geometryType === oFF.XValueType.LINE_STRING) {
																this
																		.setLineString(geometryValue);
															} else {
																if (geometryType === oFF.XValueType.MULTI_LINE_STRING) {
																	this
																			.setMultiLineString(geometryValue);
																} else {
																	if (geometryType === oFF.XValueType.POLYGON) {
																		this
																				.setPolygon(geometryValue);
																	} else {
																		this
																				.setMultiPolygon(geometryValue);
																	}
																}
															}
														}
													}
												} catch (i) {
													message = oFF.XStringBuffer
															.create();
													if (oFF
															.isNull(geometryType)) {
														message
																.append("Coudn't parse value");
													} else {
														message
																.append(
																		"Expected valuetype '")
																.append(
																		this.m_type
																				.getName())
																.append(
																		"' but got '")
																.append(
																		geometryType
																				.getName())
																.append(
																		"' instead.");
													}
													messages
															.addError(
																	oFF.ErrorCodes.INVALID_DATATYPE,
																	message
																			.toString());
													oFF.XObjectExt
															.release(message);
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		return messages;
	};
	oFF.XValueAccess.prototype.toString = function() {
		return this.getString();
	};
	oFF.XValueAccess.prototype.setXValue = function(value) {
		oFF.XValueAccess.copy(oFF.XValueAccess.createWithValue(value), this);
	};
	oFF.XValueAccess.prototype.getFormattedValue = function() {
		return this.getString();
	};
	oFF.DfXFileSystem = function() {
	};
	oFF.DfXFileSystem.prototype = new oFF.DfSessionContext();
	oFF.DfXFileSystem.prototype.getFileSystemType = function() {
		return oFF.XFileSystemType.OS;
	};
	oFF.DfXFileSystem.prototype.isExisting = oFF.noSupport;
	oFF.DfXFileSystem.prototype.isHidden = oFF.noSupport;
	oFF.DfXFileSystem.prototype.mkdir = oFF.noSupport;
	oFF.DfXFileSystem.prototype.mkdirs = oFF.noSupport;
	oFF.DfXFileSystem.prototype.getChildren = oFF.noSupport;
	oFF.DfXFileSystem.prototype.getRoots = oFF.noSupport;
	oFF.DfXFileSystem.prototype.isWriteable = oFF.noSupport;
	oFF.DfXFileSystem.prototype.setWritable = oFF.noSupport;
	oFF.DfXFileSystem.prototype.isReadable = oFF.noSupport;
	oFF.DfXFileSystem.prototype.isExecutable = oFF.noSupport;
	oFF.DfXFileSystem.prototype.save = oFF.noSupport;
	oFF.DfXFileSystem.prototype.saveGzipped = oFF.noSupport;
	oFF.DfXFileSystem.prototype.deleteFile = oFF.noSupport;
	oFF.DfXFileSystem.prototype.renameTo = oFF.noSupport;
	oFF.DfXFileSystem.prototype.isDirectory = oFF.noSupport;
	oFF.DfXFileSystem.prototype.isFile = oFF.noSupport;
	oFF.DfXFileSystem.prototype.getLastModifiedTimestamp = oFF.noSupport;
	oFF.DfXFileSystem.prototype.loadGzipped = oFF.noSupport;
	oFF.ConnectionPersonalization = function() {
	};
	oFF.ConnectionPersonalization.prototype = new oFF.XObject();
	oFF.ConnectionPersonalization.createPersonalization = function() {
		return new oFF.ConnectionPersonalization();
	};
	oFF.ConnectionPersonalization.prototype.m_type = null;
	oFF.ConnectionPersonalization.prototype.m_user = null;
	oFF.ConnectionPersonalization.prototype.m_password = null;
	oFF.ConnectionPersonalization.prototype.m_language = null;
	oFF.ConnectionPersonalization.prototype.m_x509Certificate = null;
	oFF.ConnectionPersonalization.prototype.m_secureLoginProfile = null;
	oFF.ConnectionPersonalization.prototype.m_token = null;
	oFF.ConnectionPersonalization.prototype.m_token2 = null;
	oFF.ConnectionPersonalization.prototype.m_organization = null;
	oFF.ConnectionPersonalization.prototype.m_element = null;
	oFF.ConnectionPersonalization.prototype.releaseObject = function() {
		this.m_type = null;
		this.m_user = null;
		this.m_password = null;
		this.m_language = null;
		this.m_x509Certificate = null;
		this.m_secureLoginProfile = null;
		this.m_token = null;
		this.m_token2 = null;
		this.m_organization = null;
		this.m_element = null;
	};
	oFF.ConnectionPersonalization.prototype.setFromPersonalization = function(
			personalization) {
		oFF.XConnectHelper.copyConnectionPersonalization(personalization, this);
	};
	oFF.ConnectionPersonalization.prototype.getUser = function() {
		return this.m_user;
	};
	oFF.ConnectionPersonalization.prototype.setUser = function(user) {
		this.m_user = user;
	};
	oFF.ConnectionPersonalization.prototype.getOrganization = function() {
		return this.m_organization;
	};
	oFF.ConnectionPersonalization.prototype.setOrganization = function(
			organization) {
		this.m_organization = organization;
	};
	oFF.ConnectionPersonalization.prototype.getElement = function() {
		return this.m_element;
	};
	oFF.ConnectionPersonalization.prototype.setElement = function(element) {
		this.m_element = element;
	};
	oFF.ConnectionPersonalization.prototype.getPassword = function() {
		return this.m_password;
	};
	oFF.ConnectionPersonalization.prototype.setPassword = function(password) {
		this.m_password = password;
	};
	oFF.ConnectionPersonalization.prototype.getLanguage = function() {
		return this.m_language;
	};
	oFF.ConnectionPersonalization.prototype.setLanguage = function(language) {
		this.m_language = language;
	};
	oFF.ConnectionPersonalization.prototype.getX509Certificate = function() {
		return this.m_x509Certificate;
	};
	oFF.ConnectionPersonalization.prototype.setX509Certificate = function(
			x509Certificate) {
		this.m_x509Certificate = x509Certificate;
	};
	oFF.ConnectionPersonalization.prototype.setAuthenticationToken = function(
			token) {
		this.m_token = token;
		if (oFF.notNull(token)) {
			this.m_token2 = token.getAccessToken();
		}
	};
	oFF.ConnectionPersonalization.prototype.getAuthenticationToken = function() {
		return this.m_token;
	};
	oFF.ConnectionPersonalization.prototype.getAccessToken = function() {
		return this.m_token2;
	};
	oFF.ConnectionPersonalization.prototype.setAccessToken = function(token) {
		this.m_token2 = token;
		if (oFF.notNull(token)) {
			this.m_token = oFF.XAuthenticationToken.create(token);
		}
	};
	oFF.ConnectionPersonalization.prototype.getSecureLoginProfile = function() {
		return this.m_secureLoginProfile;
	};
	oFF.ConnectionPersonalization.prototype.setSecureLoginProfile = function(
			secureLoginProfile) {
		this.m_secureLoginProfile = secureLoginProfile;
	};
	oFF.ConnectionPersonalization.prototype.getAuthenticationType = function() {
		return this.m_type;
	};
	oFF.ConnectionPersonalization.prototype.setAuthenticationType = function(
			type) {
		this.m_type = type;
	};
	oFF.ConnectionPersonalization.prototype.toString = function() {
		var buffer = oFF.XStringBuffer.create();
		buffer.append("Type:     ");
		if (oFF.notNull(this.m_type)) {
			buffer.append(this.m_type.toString());
		}
		buffer.appendNewLine();
		buffer.append("User:     ").appendLine(this.m_user);
		buffer.append("Language: ").append(this.m_language);
		return buffer.toString();
	};
	oFF.HttpExchange = function() {
	};
	oFF.HttpExchange.prototype = new oFF.XFileContent();
	oFF.HttpExchange.prototype.m_properties = null;
	oFF.HttpExchange.prototype.m_headerLines = null;
	oFF.HttpExchange.prototype.m_cookies = null;
	oFF.HttpExchange.prototype.m_cookiesMasterStore = null;
	oFF.HttpExchange.prototype.m_mimeType = null;
	oFF.HttpExchange.prototype.m_textContentEncoding = null;
	oFF.HttpExchange.prototype.m_gzipContentEncoding = false;
	oFF.HttpExchange.prototype.m_rawSummary = null;
	oFF.HttpExchange.prototype.setup = function() {
		oFF.XFileContent.prototype.setup.call(this);
		this.m_properties = oFF.XProperties.create();
		this.m_headerLines = oFF.XListOfString.create();
		this.setContentType(oFF.ContentType.APPLICATION_JSON);
	};
	oFF.HttpExchange.prototype.releaseObject = function() {
		this.m_properties = oFF.XObjectExt.release(this.m_properties);
		this.m_headerLines = oFF.XObjectExt.release(this.m_headerLines);
		this.m_cookies = oFF.XObjectExt.release(this.m_cookies);
		this.m_mimeType = null;
		this.m_textContentEncoding = null;
		this.m_rawSummary = null;
		oFF.XFileContent.prototype.releaseObject.call(this);
	};
	oFF.HttpExchange.prototype.setFromHttpExchange = function(httpExchange) {
		var sourceHeaders;
		var targetHeaders;
		var iterator;
		var key;
		var value;
		this.setContentType(httpExchange.getContentType());
		this.setTextContentEncoding(httpExchange.getTextContentEncoding());
		this.setString(httpExchange.getString());
		this.setByteArray(httpExchange.getByteArray());
		this.setJsonObject(httpExchange.getJsonContent());
		this.setCookiesMasterStore(httpExchange.getCookiesMasterStore());
		sourceHeaders = httpExchange.getHeaderFields();
		targetHeaders = this.getHeaderFieldsBase();
		iterator = sourceHeaders.getKeysAsIteratorOfString();
		while (iterator.hasNext()) {
			key = iterator.next();
			value = sourceHeaders.getByKey(key);
			targetHeaders.put(key, value);
		}
	};
	oFF.HttpExchange.prototype.getHeaderFieldsBase = function() {
		return this.m_properties;
	};
	oFF.HttpExchange.prototype.getHeaderFields = function() {
		return this.m_properties;
	};
	oFF.HttpExchange.prototype.getHeaderLines = function() {
		return this.m_headerLines;
	};
	oFF.HttpExchange.prototype.setHeaderLines = function(headerLines) {
		this.m_headerLines = headerLines;
	};
	oFF.HttpExchange.prototype.addHeaderLine = function(headerLine) {
		this.m_headerLines.add(headerLine);
	};
	oFF.HttpExchange.prototype.setCookies = function(cookies) {
		this.m_cookies = cookies;
	};
	oFF.HttpExchange.prototype.getCookies = function() {
		return this.m_cookies;
	};
	oFF.HttpExchange.prototype.addCookie = function(cookie) {
		if (oFF.isNull(this.m_cookies)) {
			this.m_cookies = oFF.HttpCookies.create();
		}
		this.m_cookies.addCookie(cookie);
	};
	oFF.HttpExchange.prototype.getInternalTextEncoding = function() {
		var encoding = oFF.XFileContent.prototype.getInternalTextEncoding
				.call(this);
		var textContentEncoding = this.getTextContentEncoding();
		if (oFF.notNull(textContentEncoding)) {
			textContentEncoding = oFF.XString.toUpperCase(textContentEncoding);
			if (oFF.XString.isEqual(textContentEncoding, "US-ASCII")) {
				encoding = oFF.XCharset.USASCII;
			}
		}
		return encoding;
	};
	oFF.HttpExchange.prototype.setString = function(value) {
		oFF.XFileContent.prototype.setString.call(this, value);
	};
	oFF.HttpExchange.prototype.setContentType = function(contentType) {
		oFF.XFileContent.prototype.setContentType.call(this, contentType);
		if (oFF.notNull(contentType)) {
			this.m_mimeType = contentType.getName();
		}
	};
	oFF.HttpExchange.prototype.getContentTypeValue = function() {
		return this.m_mimeType;
	};
	oFF.HttpExchange.prototype.setContentTypeValue = function(contentType) {
		this.m_mimeType = contentType;
	};
	oFF.HttpExchange.prototype.getTextContentEncoding = function() {
		return this.m_textContentEncoding;
	};
	oFF.HttpExchange.prototype.setTextContentEncoding = function(encoding) {
		this.m_textContentEncoding = encoding;
	};
	oFF.HttpExchange.prototype.getGzipContentEncoding = function() {
		return this.m_gzipContentEncoding;
	};
	oFF.HttpExchange.prototype.setGzipContentEncoding = function(encoding) {
		this.m_gzipContentEncoding = encoding;
	};
	oFF.HttpExchange.prototype.getRawSummary = function() {
		var buffer;
		var i;
		var content;
		var jsonContent;
		if (oFF.isNull(this.m_rawSummary)) {
			buffer = oFF.XStringBuffer.create();
			for (i = 0; i < this.m_headerLines.size(); i++) {
				buffer.appendLine(this.m_headerLines.get(i));
			}
			buffer.appendNewLine();
			content = null;
			jsonContent = this.getJsonContent();
			if (oFF.notNull(jsonContent)) {
				content = oFF.PrUtils.serialize(jsonContent, true, true, 2);
			}
			if (oFF.isNull(content)) {
				content = this.getString();
			}
			if (oFF.notNull(content)) {
				buffer.append(content);
			}
			this.m_rawSummary = buffer.toString();
		}
		return this.m_rawSummary;
	};
	oFF.HttpExchange.prototype.getCookiesMasterStore = function() {
		return this.m_cookiesMasterStore;
	};
	oFF.HttpExchange.prototype.setCookiesMasterStore = function(masterStore) {
		this.m_cookiesMasterStore = masterStore;
	};
	oFF.HttpExchange.prototype.isEmpty = function() {
		return !this.isBinaryContentSet() && !this.isStringContentSet()
				&& !this.isJsonContentSet();
	};
	oFF.DfWorkingTask = function() {
	};
	oFF.DfWorkingTask.prototype = new oFF.DfSessionContext();
	oFF.DfWorkingTask.prototype.processInputOnWorkerThread = function(handle) {
	};
	oFF.DfWorkingTask.prototype.processOutputOnMainThread = function(handle) {
	};
	oFF.DfWorkingTask.prototype.isFinishedOnWorkerThread = function(handle) {
		return true;
	};
	oFF.WorkingTaskHandle = function() {
	};
	oFF.WorkingTaskHandle.prototype = new oFF.XObject();
	oFF.WorkingTaskHandle.create = function(manager, task) {
		var handle = new oFF.WorkingTaskHandle();
		handle.setupWorkingTaskHandle(manager, task);
		return handle;
	};
	oFF.WorkingTaskHandle.prototype.m_outputChunks = null;
	oFF.WorkingTaskHandle.prototype.m_inputChunks = null;
	oFF.WorkingTaskHandle.prototype.m_isCancellingRequested = false;
	oFF.WorkingTaskHandle.prototype.m_task = null;
	oFF.WorkingTaskHandle.prototype.m_workingTaskManager = null;
	oFF.WorkingTaskHandle.prototype.setupWorkingTaskHandle = function(manager,
			task) {
		this.m_workingTaskManager = manager;
		this.m_task = task;
		this.m_outputChunks = oFF.XList.create();
		this.m_inputChunks = oFF.XList.create();
	};
	oFF.WorkingTaskHandle.prototype.releaseObject = function() {
		this.m_inputChunks = null;
		this.m_outputChunks = null;
		this.m_task = null;
		this.m_workingTaskManager = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.WorkingTaskHandle.prototype.processSynchronization = function(syncType) {
		this.m_workingTaskManager.addHandleToProcessingQueue(this);
		if (syncType === oFF.SyncType.BLOCKING) {
			this.m_workingTaskManager.waitUntilFinished(this, syncType);
			return false;
		}
		return true;
	};
	oFF.WorkingTaskHandle.prototype.processWorkerThread = function() {
		var task = this.getTask();
		task.processInputOnWorkerThread(this);
	};
	oFF.WorkingTaskHandle.prototype.processMainThread = function() {
		var task = this.getTask();
		task.processOutputOnMainThread(this);
	};
	oFF.WorkingTaskHandle.prototype.isFinished = function() {
		var task = this.getTask();
		var isFinished = task.isFinishedOnWorkerThread(this);
		var hasNextInputChunk = this.hasNextInputChunk();
		var hasNextOutputChunk = this.hasNextOutputChunk();
		return isFinished && !hasNextInputChunk && !hasNextOutputChunk;
	};
	oFF.WorkingTaskHandle.prototype.isCancellingRequested = function() {
		return this.m_isCancellingRequested;
	};
	oFF.WorkingTaskHandle.prototype.requestCancelling = function() {
		this.m_isCancellingRequested = true;
	};
	oFF.WorkingTaskHandle.prototype.getTask = function() {
		return this.m_task;
	};
	oFF.WorkingTaskHandle.prototype.getInputChunks = function() {
		return this.m_inputChunks;
	};
	oFF.WorkingTaskHandle.prototype.addInputChunk = function(inputChunk) {
		this.m_inputChunks.add(inputChunk);
	};
	oFF.WorkingTaskHandle.prototype.hasNextInputChunk = function() {
		return this.m_inputChunks.size() > 0;
	};
	oFF.WorkingTaskHandle.prototype.nextInputChunk = function() {
		var inputChunk = this.m_inputChunks.get(0);
		this.m_inputChunks.removeAt(0);
		return inputChunk;
	};
	oFF.WorkingTaskHandle.prototype.publishOutputChunk = function(outputChunk) {
		this.m_outputChunks.add(outputChunk);
	};
	oFF.WorkingTaskHandle.prototype.hasNextOutputChunk = function() {
		return this.m_outputChunks.size() > 0;
	};
	oFF.WorkingTaskHandle.prototype.nextOutputChunk = function() {
		var outputChunk = this.m_outputChunks.get(0);
		this.m_outputChunks.removeAt(0);
		return outputChunk;
	};
	oFF.WorkingTaskHandle.prototype.getSyncState = function() {
		if (this.isFinished()) {
			return oFF.SyncState.IN_SYNC;
		}
		return oFF.SyncState.PROCESSING;
	};
	oFF.WorkingTaskManager = function() {
	};
	oFF.WorkingTaskManager.prototype = new oFF.DfSessionContext();
	oFF.WorkingTaskManager.staticSetup = function() {
		var clazz = oFF.XClass.create(oFF.WorkingTaskManager);
		oFF.WorkingTaskManagerFactory.registerFactoryViaClass(
				oFF.WorkingTaskManagerType.SINGLE_THREADED, clazz);
	};
	oFF.WorkingTaskManager.prototype.m_handles = null;
	oFF.WorkingTaskManager.prototype.m_syncState = null;
	oFF.WorkingTaskManager.prototype.m_workerThreadNumber = 0;
	oFF.WorkingTaskManager.prototype.setupWorkingTaskManager = function(session) {
		oFF.DfSessionContext.prototype.setupSessionContext.call(this, session);
		this.m_handles = oFF.XList.create();
		this.m_syncState = oFF.SyncState.IN_SYNC;
	};
	oFF.WorkingTaskManager.prototype.releaseObject = function() {
		var dispatcher = oFF.Dispatcher.getInstance();
		if (oFF.notNull(dispatcher)) {
			dispatcher.unregisterProcessingTimeReceiver(this);
		}
		this.m_handles = oFF.XObjectExt.release(this.m_handles);
		this.m_syncState = null;
		oFF.DfSessionContext.prototype.releaseObject.call(this);
	};
	oFF.WorkingTaskManager.prototype.getType = function() {
		return oFF.WorkingTaskManagerType.SINGLE_THREADED;
	};
	oFF.WorkingTaskManager.prototype.createHandle = function(task) {
		return oFF.WorkingTaskHandle.create(this, task);
	};
	oFF.WorkingTaskManager.prototype.addHandleToProcessingQueue = function(
			handle) {
		if (!this.m_handles.contains(handle)) {
			this.m_handles.add(handle);
		}
		if (this.m_syncState.isInSync()) {
			this.m_syncState = oFF.SyncState.OUT_OF_SYNC;
		}
		if (this.m_syncState === oFF.SyncState.OUT_OF_SYNC) {
			oFF.Dispatcher.getInstance().registerProcessingTimeReceiver(this);
		}
	};
	oFF.WorkingTaskManager.prototype.processSynchronization = function(syncType) {
		var i;
		var taskHandle;
		var isFinished;
		for (i = 0; i < this.m_handles.size();) {
			taskHandle = this.m_handles.get(i);
			taskHandle.processWorkerThread();
			taskHandle.processMainThread();
			isFinished = taskHandle.isFinished();
			if (isFinished) {
				this.removeHandle(taskHandle);
			} else {
				i++;
			}
		}
		if (this.m_handles.isEmpty()) {
			this.m_syncState = oFF.SyncState.IN_SYNC;
		}
		return true;
	};
	oFF.WorkingTaskManager.prototype.getSyncState = function() {
		return this.m_syncState;
	};
	oFF.WorkingTaskManager.prototype.waitUntilFinished = function(handle,
			syncType) {
		var isFinished = false;
		while (!isFinished) {
			handle.processWorkerThread();
			handle.processMainThread();
			isFinished = handle.isFinished();
		}
		this.removeHandle(handle);
	};
	oFF.WorkingTaskManager.prototype.removeHandle = function(handle) {
		this.m_handles.removeElement(handle);
	};
	oFF.WorkingTaskManager.prototype.getNextWorkerThreadName = function() {
		var buffer = oFF.XStringBuffer.create();
		buffer.append("WorkerThread");
		buffer.appendInt(this.m_workerThreadNumber);
		this.m_workerThreadNumber = this.m_workerThreadNumber + 1;
		return buffer.toString();
	};
	oFF.WorkingTaskManager.prototype.setMainSleepTime = function(milliseconds) {
	};
	oFF.DfDocumentParser = function() {
	};
	oFF.DfDocumentParser.prototype = new oFF.MessageManager();
	oFF.DfDocumentParser.prototype.parseByteArray = function(byteContent) {
		var content = oFF.XByteArray.convertToString(byteContent);
		return this.parse(content);
	};
	oFF.DfDocumentParser.prototype.parseUnsafe = function(content) {
		return this.parse(content);
	};
	oFF.DfDocumentParser.prototype.convertFromNative = function(content) {
		return oFF.XObject.castFromNative(content);
	};
	oFF.DfDocumentParser.prototype.convertToNative = function(element) {
		return element;
	};
	oFF.ChildSetState = function() {
	};
	oFF.ChildSetState.prototype = new oFF.XConstant();
	oFF.ChildSetState.NONE = null;
	oFF.ChildSetState.INITIAL = null;
	oFF.ChildSetState.INCOMPLETE = null;
	oFF.ChildSetState.COMPLETE = null;
	oFF.ChildSetState.staticSetup = function() {
		oFF.ChildSetState.NONE = oFF.XConstant.setupName(
				new oFF.ChildSetState(), "None");
		oFF.ChildSetState.INITIAL = oFF.XConstant.setupName(
				new oFF.ChildSetState(), "Initial");
		oFF.ChildSetState.INCOMPLETE = oFF.XConstant.setupName(
				new oFF.ChildSetState(), "Incomplete");
		oFF.ChildSetState.COMPLETE = oFF.XConstant.setupName(
				new oFF.ChildSetState(), "Complete");
	};
	oFF.ChildSetState.prototype.needsMoreFetching = function() {
		return this === oFF.ChildSetState.INITIAL
				|| this === oFF.ChildSetState.INCOMPLETE;
	};
	oFF.XHierarchyElement = function() {
	};
	oFF.XHierarchyElement.prototype = new oFF.DfNameTextObject();
	oFF.XHierarchyElement.createHierarchyElement = function(componentType,
			name, text) {
		var newObj = new oFF.XHierarchyElement();
		newObj.setName(name);
		newObj.setText(text);
		newObj.m_componentType = componentType;
		return newObj;
	};
	oFF.XHierarchyElement.prototype.m_componentType = null;
	oFF.XHierarchyElement.prototype.getComponentType = function() {
		return this.m_componentType;
	};
	oFF.XHierarchyElement.prototype.isNode = function() {
		return false;
	};
	oFF.XHierarchyElement.prototype.isLeaf = function() {
		return !this.isNode();
	};
	oFF.XHierarchyElement.prototype.getTagValue = function(tagName) {
		return null;
	};
	oFF.XHierarchyElement.prototype.getContentElement = function() {
		return this;
	};
	oFF.XHierarchyElement.prototype.getContentConstant = function() {
		return null;
	};
	oFF.ListenerType = function() {
	};
	oFF.ListenerType.prototype = new oFF.XConstant();
	oFF.ListenerType.SPECIFIC = null;
	oFF.ListenerType.SYNC_LISTENER = null;
	oFF.ListenerType.OLAP_COMPONENT_CHANGED = null;
	oFF.ListenerType.staticSetup = function() {
		oFF.ListenerType.SPECIFIC = oFF.XConstant.setupName(
				new oFF.ListenerType(), "Specific");
		oFF.ListenerType.SYNC_LISTENER = oFF.XConstant.setupName(
				new oFF.ListenerType(), "SyncListener");
		oFF.ListenerType.OLAP_COMPONENT_CHANGED = oFF.XConstant.setupName(
				new oFF.ListenerType(), "OlapComponentChanged");
	};
	oFF.SyncAction = function() {
	};
	oFF.SyncAction.prototype = new oFF.MessageManager();
	oFF.SyncAction.prototype.m_syncState = null;
	oFF.SyncAction.prototype.m_syncType = null;
	oFF.SyncAction.prototype.m_isSyncCanceled = false;
	oFF.SyncAction.prototype.m_actionContext = null;
	oFF.SyncAction.prototype.m_dataHardRef = null;
	oFF.SyncAction.prototype.m_dataWeakRef = null;
	oFF.SyncAction.prototype.m_convertDataToWeak = false;
	oFF.SyncAction.prototype.m_listeners = null;
	oFF.SyncAction.prototype.m_isInsideListenerCall = false;
	oFF.SyncAction.prototype.m_syncChild = null;
	oFF.SyncAction.prototype.m_checkWeakConversion = false;
	oFF.SyncAction.prototype.m_queue = null;
	oFF.SyncAction.prototype.setupActionAndRun = function(syncType, context,
			listener, customIdentifier) {
		this.setupSynchronizingObject(context);
		this.processSyncAction(syncType, listener, customIdentifier);
	};
	oFF.SyncAction.prototype.setupSynchronizingObject = function(context) {
		var session = oFF.isNull(context) ? null : context.getSession();
		this.setupSessionContext(session);
		this.m_syncState = oFF.SyncState.OUT_OF_SYNC;
		this.m_syncType = null;
		this.m_listeners = oFF.XList.create();
		this.m_convertDataToWeak = false;
		this.setActionContext(context);
	};
	oFF.SyncAction.prototype.releaseObject = function() {
		if (!this.m_isInsideListenerCall) {
			this.m_actionContext = null;
			this.m_dataHardRef = null;
			this.m_dataWeakRef = null;
			this.m_listeners = oFF.XObjectExt.release(this.m_listeners);
			this.m_queue = oFF.XObjectExt.release(this.m_queue);
			this.m_syncChild = null;
			this.m_syncState = null;
			this.m_syncType = null;
			oFF.MessageManager.prototype.releaseObject.call(this);
		}
	};
	oFF.SyncAction.prototype.processSyncAction = function(syncType, listener,
			customIdentifier) {
		var activeSyncType;
		var continueProcessing;
		this.attachListener(listener, oFF.ListenerType.SPECIFIC,
				customIdentifier);
		if (this.m_syncState === oFF.SyncState.OUT_OF_SYNC) {
			activeSyncType = this.startSyncAndClearErrors(syncType);
			if (activeSyncType !== oFF.SyncType.DELAYED) {
				continueProcessing = this
						.processSynchronizationInternal(activeSyncType);
				if (!continueProcessing) {
					this.endSync();
				}
			}
		}
		return this;
	};
	oFF.SyncAction.prototype.processSyncGeneric = function(syncType, listener,
			customIdentifier) {
		var activeSyncType;
		var continueProcessing;
		if (this.m_syncState === oFF.SyncState.OUT_OF_SYNC) {
			this.attachListener(listener, oFF.ListenerType.SYNC_LISTENER,
					customIdentifier);
			activeSyncType = this.startSyncAndClearErrors(syncType);
			if (activeSyncType !== oFF.SyncType.DELAYED) {
				continueProcessing = this
						.processSynchronizationInternal(activeSyncType);
				if (!continueProcessing) {
					this.endSync();
				}
			}
		}
	};
	oFF.SyncAction.prototype.processSynchronizationInternal = function(syncType) {
		return this.processSynchronization(syncType);
	};
	oFF.SyncAction.prototype.processSynchronization = function(syncType) {
		return false;
	};
	oFF.SyncAction.prototype.startSyncAndClearErrors = function(syncType) {
		var activeSyncType;
		this.addProfileStep("processSynchronization");
		this.m_isSyncCanceled = false;
		this.clearMessages();
		activeSyncType = this.setActiveSyncType(syncType);
		if (syncType !== oFF.SyncType.DELAYED) {
			if (this.m_syncState !== oFF.SyncState.PROCESSING) {
				if (!this.m_isSyncCanceled) {
					this.endProfileStep();
				}
				this.m_syncState = oFF.SyncState.PROCESSING;
			}
		}
		return activeSyncType;
	};
	oFF.SyncAction.prototype.getActiveSyncType = function() {
		return this.m_syncType;
	};
	oFF.SyncAction.prototype.setActiveSyncType = function(syncType) {
		var session;
		if (syncType === oFF.SyncType.REGISTER
				|| syncType === oFF.SyncType.UNREGISTER) {
			throw oFF.XException
					.createIllegalArgumentException("Register/Unregister not supported here");
		}
		if (oFF.isNull(this.m_syncType)
				|| this.m_syncType === oFF.SyncType.DELAYED) {
			if (oFF.isNull(syncType)) {
				session = this.getSession();
				this.m_syncType = oFF.isNull(session) ? oFF.SyncType.BLOCKING
						: session.getDefaultSyncType();
			} else {
				this.m_syncType = syncType;
			}
		}
		return this.m_syncType;
	};
	oFF.SyncAction.prototype.cancelSynchronization = function() {
		var cancellingChild;
		this.endProfileStep();
		this.m_isSyncCanceled = true;
		cancellingChild = this.getChildSynchronizer();
		if (oFF.notNull(cancellingChild)) {
			cancellingChild.abort();
			cancellingChild.cancelSynchronization();
		}
		this.endSync();
	};
	oFF.SyncAction.prototype.isSyncCanceled = function() {
		return this.m_isSyncCanceled;
	};
	oFF.SyncAction.prototype.processQueue = function() {
		var i;
		var currentSyncAction;
		while (this.m_queue.size() > 0) {
			for (i = 0; i < this.m_queue.size();) {
				currentSyncAction = this.m_queue.get(i);
				if (currentSyncAction.callListeners(false)) {
					i++;
				} else {
					this.m_queue.removeAt(i);
				}
			}
		}
	};
	oFF.SyncAction.prototype.onInSync = function() {
		var session;
		var listenerProcessor;
		if (this.m_isInsideListenerCall) {
			return;
		}
		this.m_isInsideListenerCall = true;
		if (oFF.XCollectionUtils.hasElements(this.m_listeners)) {
			this.m_checkWeakConversion = true;
			if (this.getActiveSyncType() === oFF.SyncType.NON_BLOCKING) {
				session = this.getSession();
				if (oFF.isNull(session)) {
					this.callListeners(true);
				} else {
					listenerProcessor = session.getListenerProcessor();
					if (oFF.isNull(listenerProcessor)) {
						this.processQueueAsListener(session);
					} else {
						listenerProcessor.addToQueue(this);
					}
				}
			} else {
				this.callListeners(true);
			}
		}
		this.m_isInsideListenerCall = false;
	};
	oFF.SyncAction.prototype.processQueueAsListener = function(session) {
		session.setListenerProcessor(this);
		this.m_queue = oFF.XList.create();
		this.m_queue.add(this);
		if (oFF.XVersion.API_ACTIVE >= oFF.XVersion.API_V3_SYNC_ACTION) {
			this.processQueue();
		} else {
			try {
				this.processQueue();
			} catch (e) {
				this.addError(oFF.ErrorCodes.OTHER_ERROR, oFF.XException
						.getStackTrace(e, 0));
				if (oFF.XPlatform.getPlatform().isTypeOf(oFF.XPlatform.BROWSER)) {
					this.log(oFF.XException.getStackTrace(e, 0));
				}
			}
		}
		this.m_queue = null;
		session.setListenerProcessor(null);
	};
	oFF.SyncAction.prototype.addToQueue = function(syncAction) {
		if (!this.m_queue.contains(syncAction)) {
			this.m_queue.add(syncAction);
		}
	};
	oFF.SyncAction.prototype.getSyncState = function() {
		return this.m_syncState;
	};
	oFF.SyncAction.prototype.endSync = function() {
		this.endSyncInternal();
	};
	oFF.SyncAction.prototype.endSyncInternal = function() {
		if (this.m_syncState.isNotInSync()) {
			this.endProfileStep();
			this.m_syncState = this.hasErrors() ? oFF.SyncState.IN_SYNC_WITH_ERROR
					: oFF.SyncState.IN_SYNC;
			this.onInSync();
		}
		this.setActiveSyncType(null);
	};
	oFF.SyncAction.prototype.resetSyncState = function() {
		if (this.m_syncState.isInSync()) {
			this.m_syncState = oFF.SyncState.OUT_OF_SYNC;
			this.m_isSyncCanceled = false;
			this.m_syncType = null;
			this.clearMessages();
			if (oFF.notNull(this.m_listeners)) {
				this.m_listeners.clear();
			}
			this.m_syncChild = null;
			this.m_dataHardRef = null;
			this.m_dataWeakRef = null;
			return true;
		}
		if (this.m_syncState === oFF.SyncState.PROCESSING) {
			throw oFF.XException
					.createIllegalStateException("Action is still in processing, it cannot be reset.");
		}
		return false;
	};
	oFF.SyncAction.prototype.attachAllListeners = function(listenerPairs) {
		var i;
		var pair;
		for (i = 0; i < listenerPairs.size(); i++) {
			pair = listenerPairs.get(i);
			this.attachListener(pair.getFirstObject(),
					oFF.ListenerType.SPECIFIC, pair.getSecondObject());
		}
	};
	oFF.SyncAction.prototype.attachListener = function(listener, type,
			customIdentifier) {
		var pair;
		var isExisting;
		var i;
		var existingPair;
		if (oFF.notNull(listener) && oFF.notNull(this.m_listeners)) {
			pair = oFF.SyncActionListenerPair.create(listener, type,
					customIdentifier);
			isExisting = false;
			for (i = 0; i < this.m_listeners.size(); i++) {
				existingPair = this.m_listeners.get(i);
				if (existingPair.getListener() === listener) {
					if (existingPair.getCustomIdentifier() !== customIdentifier) {
						throw oFF.XException
								.createIllegalStateException("Twice listener registration with different custom identifiers");
					}
					isExisting = true;
				}
			}
			if (!isExisting) {
				this.m_listeners.add(pair);
			}
		}
		if (this.m_syncState.isInSync()) {
			this.onInSync();
		}
	};
	oFF.SyncAction.prototype.detachListener = function(listener) {
		var i;
		var pair;
		if (oFF.notNull(this.m_listeners)) {
			for (i = 0; i < this.m_listeners.size(); i++) {
				pair = this.m_listeners.get(i);
				if (pair.getListener() === listener) {
					this.m_listeners.removeAt(i);
					break;
				}
			}
		}
	};
	oFF.SyncAction.prototype.callListeners = function(allowNewListeners) {
		var sizeOfListeners;
		var offset;
		var pair;
		var listener;
		var data;
		var customIdentifier;
		this.beforeListenerCall();
		if (oFF.isNull(this.m_listeners)) {
			return false;
		}
		sizeOfListeners = this.m_listeners.size();
		offset = 0;
		while (sizeOfListeners > offset) {
			pair = this.m_listeners.get(offset);
			this.m_listeners.removeAt(offset);
			listener = pair.getListener();
			oFF.XObjectExt
					.checkNotNull(listener,
							"Listener is not valid. Might be a reference counter problem");
			data = this.getData();
			customIdentifier = pair.getCustomIdentifier();
			if (!oFF.XClass.isXObjectReleased(listener)
					&& !oFF.XClass.callFunction(listener, this, data,
							customIdentifier)) {
				this.callTypedListener(this, pair.getListenerType(), listener,
						data, customIdentifier);
			}
			oFF.XObjectExt.release(pair);
			if (allowNewListeners) {
				sizeOfListeners = this.m_listeners.size();
			} else {
				--sizeOfListeners;
			}
		}
		if (oFF.isNull(this.m_listeners)) {
			return false;
		}
		sizeOfListeners = this.m_listeners.size();
		if (sizeOfListeners === 0) {
			if (this.m_checkWeakConversion) {
				this.checkConversion();
				this.m_checkWeakConversion = false;
			}
			return false;
		}
		return true;
	};
	oFF.SyncAction.prototype.beforeListenerCall = function() {
	};
	oFF.SyncAction.prototype.callTypedListener = function(extResult, type,
			listener, data, customIdentifier) {
		var specificListener;
		var syncListener;
		if (type === oFF.ListenerType.SPECIFIC) {
			specificListener = listener;
			this.callListener(this, specificListener, data, customIdentifier);
		} else {
			if (type === oFF.ListenerType.SYNC_LISTENER) {
				syncListener = listener;
				syncListener.onSynchronized(this, data, customIdentifier);
			}
		}
	};
	oFF.SyncAction.prototype.callListener = oFF.noSupport;
	oFF.SyncAction.prototype.getData = function() {
		var data;
		if (oFF.notNull(this.m_dataWeakRef)) {
			return oFF.XWeakReferenceUtil.getHardRef(this.m_dataWeakRef);
		}
		data = this.m_dataHardRef;
		if (!this.m_isInsideListenerCall) {
			this.checkConversion();
		}
		return data;
	};
	oFF.SyncAction.prototype.setData = function(data) {
		var otherData = data;
		if (otherData === this) {
			this.m_dataWeakRef = oFF.XWeakReferenceUtil.getWeakRef(data);
		} else {
			this.m_dataHardRef = data;
		}
	};
	oFF.SyncAction.prototype.checkConversion = function() {
		if (this.m_convertDataToWeak) {
			this.m_dataWeakRef = oFF.XWeakReferenceUtil
					.getWeakRef(this.m_dataHardRef);
			this.m_dataHardRef = null;
		}
	};
	oFF.SyncAction.prototype.setAutoConvertDataToWeakRef = function(
			convertDataToWeakRef) {
		this.m_convertDataToWeak = convertDataToWeakRef;
	};
	oFF.SyncAction.prototype.getActionContext = function() {
		return oFF.XWeakReferenceUtil.getHardRef(this.m_actionContext);
	};
	oFF.SyncAction.prototype.setActionContext = function(parent) {
		this.m_actionContext = oFF.XWeakReferenceUtil.getWeakRef(parent);
	};
	oFF.SyncAction.prototype.getChildSynchronizer = function() {
		return this.m_syncChild;
	};
	oFF.SyncAction.prototype.setSyncChild = function(syncChild) {
		this.m_syncChild = syncChild;
	};
	oFF.SyncAction.prototype.abort = function() {
	};
	oFF.SyncAction.prototype.toString = function() {
		var buffer = oFF.XStringBuffer.create();
		var activeSyncType;
		var summary;
		buffer.append("SyncState: ").append(this.m_syncState.toString());
		activeSyncType = this.getActiveSyncType();
		if (oFF.notNull(activeSyncType)) {
			buffer.appendNewLine();
			buffer.append("SyncType: ").append(activeSyncType.toString());
		}
		summary = this.getSummary();
		if (oFF.XStringUtils.isNotNullAndNotEmpty(summary)) {
			buffer.append(summary);
		}
		return buffer.toString();
	};
	oFF.RpcRequestType = function() {
	};
	oFF.RpcRequestType.prototype = new oFF.XConstant();
	oFF.RpcRequestType.NONE = null;
	oFF.RpcRequestType.UNKNOWN = null;
	oFF.RpcRequestType.ANALYTICS = null;
	oFF.RpcRequestType.METADATA = null;
	oFF.RpcRequestType.LIST_REPORTING = null;
	oFF.RpcRequestType.PLANNING = null;
	oFF.RpcRequestType.BATCH = null;
	oFF.RpcRequestType.s_lookup = null;
	oFF.RpcRequestType.staticSetup = function() {
		oFF.RpcRequestType.s_lookup = oFF.XHashMapByString.create();
		oFF.RpcRequestType.NONE = oFF.RpcRequestType.create("None");
		oFF.RpcRequestType.UNKNOWN = oFF.RpcRequestType.create("Unknown");
		oFF.RpcRequestType.ANALYTICS = oFF.RpcRequestType.create("Analytics");
		oFF.RpcRequestType.LIST_REPORTING = oFF.RpcRequestType
				.create("ListReporting");
		oFF.RpcRequestType.METADATA = oFF.RpcRequestType.create("Metadata");
		oFF.RpcRequestType.PLANNING = oFF.RpcRequestType.create("Planning");
		oFF.RpcRequestType.BATCH = oFF.RpcRequestType.create("Batch");
	};
	oFF.RpcRequestType.create = function(name) {
		var constant = oFF.XConstant.setupName(new oFF.RpcRequestType(), name);
		oFF.RpcRequestType.s_lookup.put(name, constant);
		return constant;
	};
	oFF.RpcRequestType.lookup = function(name) {
		if (oFF.RpcRequestType.s_lookup.containsKey(name)) {
			return oFF.RpcRequestType.s_lookup.getByKey(name);
		}
		return oFF.RpcRequestType.UNKNOWN;
	};
	oFF.RpcRequestType.detectTypeFromJson = function(structure) {
		var structureNames;
		var keys;
		var len;
		var i;
		var typeName;
		var element;
		if (oFF.isNull(structure)) {
			return oFF.RpcRequestType.NONE;
		}
		structureNames = structure.getKeysAsReadOnlyListOfString();
		if (structureNames.size() === 1) {
			return oFF.RpcRequestType.lookup(structureNames.get(0));
		}
		keys = oFF.RpcRequestType.s_lookup.getKeysAsReadOnlyListOfString();
		len = keys.size();
		for (i = 0; i < len; i++) {
			typeName = keys.get(i);
			element = structure.getByKey(typeName);
			if (oFF.notNull(element) && element.isStructure()) {
				return oFF.RpcRequestType.s_lookup.getByKey(typeName);
			}
		}
		return oFF.RpcRequestType.UNKNOWN;
	};
	oFF.PathFormat = function() {
	};
	oFF.PathFormat.prototype = new oFF.XConstant();
	oFF.PathFormat.AUTO_DETECT = null;
	oFF.PathFormat.NORMALIZED = null;
	oFF.PathFormat.NATIVE = null;
	oFF.PathFormat.URL = null;
	oFF.PathFormat.staticSetup = function() {
		oFF.PathFormat.AUTO_DETECT = oFF.XConstant.setupName(
				new oFF.PathFormat(), "AutoDetect");
		oFF.PathFormat.NORMALIZED = oFF.XConstant.setupName(
				new oFF.PathFormat(), "Normalized");
		oFF.PathFormat.NATIVE = oFF.XConstant.setupName(new oFF.PathFormat(),
				"Native");
		oFF.PathFormat.URL = oFF.XConstant.setupName(new oFF.PathFormat(),
				"Url");
	};
	oFF.XFileSystemType = function() {
	};
	oFF.XFileSystemType.prototype = new oFF.XConstant();
	oFF.XFileSystemType.OS = null;
	oFF.XFileSystemType.WEBDAV = null;
	oFF.XFileSystemType.SIMPLE_WEB = null;
	oFF.XFileSystemType.staticSetup = function() {
		oFF.XFileSystemType.OS = oFF.XConstant.setupName(
				new oFF.XFileSystemType(), "OperatingSystem");
		oFF.XFileSystemType.WEBDAV = oFF.XConstant.setupName(
				new oFF.XFileSystemType(), "WebDAV");
		oFF.XFileSystemType.SIMPLE_WEB = oFF.XConstant.setupName(
				new oFF.XFileSystemType(), "SimpleWeb");
	};
	oFF.DfXFile = function() {
	};
	oFF.DfXFile.prototype = new oFF.MessageManager();
	oFF.DfXFile.prototype.deleteRecursive = function() {
		this.deleteChildren();
		if (this.isExisting()) {
			this.deleteFile();
		}
	};
	oFF.DfXFile.prototype.deleteChildren = function() {
		var children;
		var i;
		var child;
		if (this.isDirectory()) {
			children = this.getChildren();
			for (i = 0; i < children.size(); i++) {
				child = children.get(i);
				child.deleteRecursive();
			}
		}
	};
	oFF.DfXFile.prototype.compareTo = function(objectToCompare) {
		var other = objectToCompare;
		var otherName = other.getName();
		var myName = this.getName();
		return oFF.XString.compare(myName, otherName);
	};
	oFF.XWebDAV = function() {
	};
	oFF.XWebDAV.prototype = new oFF.DfXFileSystem();
	oFF.XWebDAV.createWebDav = function(Session, uri) {
		var newObject = new oFF.XWebDAV();
		newObject.setupExt(Session, uri);
		return newObject;
	};
	oFF.XWebDAV.prototype.m_uri = null;
	oFF.XWebDAV.prototype.m_httpClient = null;
	oFF.XWebDAV.prototype.releaseObject = function() {
		this.m_uri = null;
		this.m_httpClient = oFF.XObjectExt.release(this.m_httpClient);
		oFF.DfXFileSystem.prototype.releaseObject.call(this);
	};
	oFF.XWebDAV.prototype.setupExt = function(session, uri) {
		this.setupSessionContext(session);
		this.m_uri = uri;
	};
	oFF.XWebDAV.prototype.loadExt = function(nativePath) {
		var request = oFF.HttpRequest.createByUri(this.m_uri);
		var extResponse;
		var fileContent;
		this.m_httpClient = request.newHttpClient(this.getSession());
		extResponse = this.m_httpClient.processHttpRequest(
				oFF.SyncType.BLOCKING, null, null);
		if (extResponse.isValid()) {
			return extResponse.getData();
		}
		fileContent = oFF.XFileContent.createFileContent();
		fileContent.setMessageCollection(extResponse);
		return fileContent;
	};
	oFF.XWebDAV.prototype.getFileSystemType = function() {
		return oFF.XFileSystemType.WEBDAV;
	};
	oFF.XConnection = function() {
	};
	oFF.XConnection.prototype = new oFF.ConnectionPersonalization();
	oFF.XConnection.prototype.m_alias = null;
	oFF.XConnection.prototype.m_host = null;
	oFF.XConnection.prototype.m_port = 0;
	oFF.XConnection.prototype.m_scheme = null;
	oFF.XConnection.prototype.m_path = null;
	oFF.XConnection.prototype.setup = function() {
		this.setAuthenticationType(oFF.AuthenticationType.NONE);
	};
	oFF.XConnection.prototype.releaseObject = function() {
		this.m_host = null;
		this.m_scheme = null;
		this.m_path = null;
		this.m_alias = null;
		oFF.ConnectionPersonalization.prototype.releaseObject.call(this);
	};
	oFF.XConnection.prototype.setFromConnection = function(connection) {
		oFF.XConnectHelper.copyConnection(connection, this);
	};
	oFF.XConnection.prototype.getHost = function() {
		return this.m_host;
	};
	oFF.XConnection.prototype.setHost = function(host) {
		this.m_host = host;
	};
	oFF.XConnection.prototype.getScheme = function() {
		return this.m_scheme;
	};
	oFF.XConnection.prototype.setScheme = function(scheme) {
		this.m_scheme = scheme;
	};
	oFF.XConnection.prototype.getProtocolType = function() {
		if (oFF.isNull(this.m_scheme)) {
			return null;
		}
		return oFF.ProtocolType.lookup(this.m_scheme);
	};
	oFF.XConnection.prototype.setProtocolType = function(type) {
		if (oFF.notNull(type)) {
			this.m_scheme = type.getName();
		} else {
			this.m_scheme = null;
		}
	};
	oFF.XConnection.prototype.getPort = function() {
		return this.m_port;
	};
	oFF.XConnection.prototype.setPort = function(port) {
		this.m_port = port;
	};
	oFF.XConnection.prototype.setPath = function(path) {
		this.m_path = path;
	};
	oFF.XConnection.prototype.getPath = function() {
		return this.m_path;
	};
	oFF.XConnection.prototype.getUriString = function() {
		return oFF.XUri.getUriStringStatic(this, null, true, true, true, true,
				true, true, true, true);
	};
	oFF.XConnection.prototype.getUriStringWithoutAuthentication = function() {
		return oFF.XUri.getUriStringStatic(this, null, true, false, false,
				false, true, true, true, true);
	};
	oFF.XConnection.prototype.getUriStringExt = function(withSchema, withUser,
			withPwd, withAuthenticationType, withHostPort, withPath, withQuery,
			withFragment) {
		return oFF.XUri.getUriStringStatic(this, null, withSchema, withUser,
				withPwd, withAuthenticationType, withHostPort, withPath,
				withQuery, withFragment);
	};
	oFF.XConnection.prototype.toString = function() {
		var buffer = oFF.XStringBuffer.create();
		buffer.append("Protocol: ").appendLine(this.m_scheme);
		buffer.append("Host: ").appendLine(this.m_host);
		buffer.append("Port: ").appendInt(this.m_port).appendNewLine();
		buffer.append("Path: ").appendLine(this.m_path);
		buffer.append("Alias: ").appendLine(this.m_alias);
		buffer.append("User: ").appendLine(this.getUser());
		buffer.append("Authentication: ").appendLine(
				this.getAuthenticationType().getName());
		return buffer.toString();
	};
	oFF.XConnection.prototype.getAlias = function() {
		return this.m_alias;
	};
	oFF.XConnection.prototype.setAlias = function(alias) {
		this.m_alias = alias;
	};
	oFF.AuthenticationType = function() {
	};
	oFF.AuthenticationType.prototype = new oFF.XConstant();
	oFF.AuthenticationType.NONE = null;
	oFF.AuthenticationType.BASIC = null;
	oFF.AuthenticationType.BEARER = null;
	oFF.AuthenticationType.CERTIFICATES = null;
	oFF.AuthenticationType.KERBEROS = null;
	oFF.AuthenticationType.SECURE_LOGIN_PROFILE = null;
	oFF.AuthenticationType.SAML_WITH_PASSWORD = null;
	oFF.AuthenticationType.SAML_WITH_CERTIFICATE = null;
	oFF.AuthenticationType.SAML_WITH_KERBEROS = null;
	oFF.AuthenticationType.SCP_OPEN_CONNECTORS = null;
	oFF.AuthenticationType.SCP_OAUTH_BEARER = null;
	oFF.AuthenticationType.XHR = null;
	oFF.AuthenticationType.s_instances = null;
	oFF.AuthenticationType.staticSetup = function() {
		oFF.AuthenticationType.s_instances = oFF.XHashMapByString.create();
		oFF.AuthenticationType.NONE = oFF.AuthenticationType.create("NONE",
				false, false);
		oFF.AuthenticationType.BASIC = oFF.AuthenticationType.create("BASIC",
				true, true);
		oFF.AuthenticationType.BEARER = oFF.AuthenticationType.create("BEARER",
				false, false);
		oFF.AuthenticationType.CERTIFICATES = oFF.AuthenticationType.create(
				"CERTIFICATES", false, false);
		oFF.AuthenticationType.KERBEROS = oFF.AuthenticationType.create(
				"KERBEROS", true, false);
		oFF.AuthenticationType.SECURE_LOGIN_PROFILE = oFF.AuthenticationType
				.create("SECURE_LOGIN_PROFILE", false, false);
		oFF.AuthenticationType.SAML_WITH_PASSWORD = oFF.AuthenticationType
				.create("SAML_WITH_PASSWORD", true, true);
		oFF.AuthenticationType.SAML_WITH_CERTIFICATE = oFF.AuthenticationType
				.create("SAML_WITH_CERTIFICATE", false, false);
		oFF.AuthenticationType.SAML_WITH_KERBEROS = oFF.AuthenticationType
				.create("SAML_WITH_KERBEROS", false, false);
		oFF.AuthenticationType.SCP_OPEN_CONNECTORS = oFF.AuthenticationType
				.create("SCP_OPEN_CONNECTORS", true, false);
		oFF.AuthenticationType.SCP_OAUTH_BEARER = oFF.AuthenticationType
				.create("SCP_OAUTH_BEARER", false, false);
		oFF.AuthenticationType.XHR = oFF.AuthenticationType.create("XHR",
				false, false);
	};
	oFF.AuthenticationType.create = function(name, hasUserName, hasPassword) {
		var newConstant = new oFF.AuthenticationType();
		newConstant.setName(name);
		newConstant.m_requiresUserName = hasUserName;
		newConstant.m_requiresPassword = hasPassword;
		oFF.AuthenticationType.s_instances.put(name, newConstant);
		return newConstant;
	};
	oFF.AuthenticationType.lookup = function(name) {
		return oFF.AuthenticationType.s_instances.getByKey(name);
	};
	oFF.AuthenticationType.prototype.m_requiresUserName = false;
	oFF.AuthenticationType.prototype.m_requiresPassword = false;
	oFF.AuthenticationType.prototype.hasUserName = function() {
		return this.m_requiresUserName;
	};
	oFF.AuthenticationType.prototype.hasPassword = function() {
		return this.m_requiresPassword;
	};
	oFF.AuthenticationType.prototype.isSaml = function() {
		return this === oFF.AuthenticationType.SAML_WITH_PASSWORD
				|| this === oFF.AuthenticationType.SAML_WITH_CERTIFICATE
				|| this === oFF.AuthenticationType.SAML_WITH_KERBEROS;
	};
	oFF.ProtocolType = function() {
	};
	oFF.ProtocolType.prototype = new oFF.XConstant();
	oFF.ProtocolType.HTTP = null;
	oFF.ProtocolType.HTTPS = null;
	oFF.ProtocolType.FILE = null;
	oFF.ProtocolType.INA_DB = null;
	oFF.ProtocolType.INA_SQL = null;
	oFF.ProtocolType.SQL = null;
	oFF.ProtocolType.UI = null;
	oFF.ProtocolType.DATAPROVIDER = null;
	oFF.ProtocolType.s_instances = null;
	oFF.ProtocolType.staticSetup = function() {
		oFF.ProtocolType.s_instances = oFF.XHashMapByString.create();
		oFF.ProtocolType.HTTP = oFF.ProtocolType.create("http", 80);
		oFF.ProtocolType.HTTPS = oFF.ProtocolType.create("https", 443);
		oFF.ProtocolType.FILE = oFF.ProtocolType.create("file", 0);
		oFF.ProtocolType.INA_DB = oFF.ProtocolType.create("ina_db", 0);
		oFF.ProtocolType.INA_SQL = oFF.ProtocolType.create("ina_sql", 0);
		oFF.ProtocolType.SQL = oFF.ProtocolType.create("sql", 0);
		oFF.ProtocolType.UI = oFF.ProtocolType.create("ui", 0);
		oFF.ProtocolType.DATAPROVIDER = oFF.ProtocolType.create("dp", 0);
	};
	oFF.ProtocolType.create = function(name, defaultPort) {
		var newConstant = new oFF.ProtocolType();
		newConstant.setName(name);
		newConstant.m_uriName = oFF.XStringUtils.concatenate2(name, "://");
		newConstant.m_defaultPort = defaultPort;
		oFF.ProtocolType.s_instances.put(name, newConstant);
		oFF.ProtocolType.s_instances.put(oFF.XString.toLowerCase(name),
				newConstant);
		return newConstant;
	};
	oFF.ProtocolType.lookup = function(name) {
		var lowerCase;
		if (oFF.isNull(name)) {
			return null;
		}
		lowerCase = oFF.XString.toLowerCase(name);
		return oFF.ProtocolType.s_instances.getByKey(lowerCase);
	};
	oFF.ProtocolType.lookupAll = function() {
		return oFF.ProtocolType.s_instances.getIterator();
	};
	oFF.ProtocolType.prototype.m_uriName = null;
	oFF.ProtocolType.prototype.m_defaultPort = 0;
	oFF.ProtocolType.prototype.getUriName = function() {
		return this.m_uriName;
	};
	oFF.ProtocolType.prototype.getDefaultPort = function() {
		return this.m_defaultPort;
	};
	oFF.HttpRequestMethod = function() {
	};
	oFF.HttpRequestMethod.prototype = new oFF.XConstant();
	oFF.HttpRequestMethod.HTTP_GET = null;
	oFF.HttpRequestMethod.HTTP_POST = null;
	oFF.HttpRequestMethod.HTTP_PUT = null;
	oFF.HttpRequestMethod.HTTP_DELETE = null;
	oFF.HttpRequestMethod.s_instances = null;
	oFF.HttpRequestMethod.create = function(name) {
		var newConstant = new oFF.HttpRequestMethod();
		newConstant.setName(name);
		oFF.HttpRequestMethod.s_instances.put(name, newConstant);
		return newConstant;
	};
	oFF.HttpRequestMethod.lookup = function(name) {
		return oFF.HttpRequestMethod.s_instances.getByKey(name);
	};
	oFF.HttpRequestMethod.staticSetup = function() {
		oFF.HttpRequestMethod.s_instances = oFF.XHashMapByString.create();
		oFF.HttpRequestMethod.HTTP_GET = oFF.HttpRequestMethod.create("GET");
		oFF.HttpRequestMethod.HTTP_POST = oFF.HttpRequestMethod.create("POST");
		oFF.HttpRequestMethod.HTTP_PUT = oFF.HttpRequestMethod.create("PUT");
		oFF.HttpRequestMethod.HTTP_DELETE = oFF.HttpRequestMethod
				.create("DELETE");
	};
	oFF.HttpCookie = function() {
	};
	oFF.HttpCookie.prototype = new oFF.XNameValuePair();
	oFF.HttpCookie.createCookie = function() {
		return new oFF.HttpCookie();
	};
	oFF.HttpCookie.createCopy = function(cookie) {
		var newCookie = new oFF.HttpCookie();
		newCookie.setFromCookie(cookie);
		return newCookie;
	};
	oFF.HttpCookie.prototype.m_comment = null;
	oFF.HttpCookie.prototype.m_domain = null;
	oFF.HttpCookie.prototype.m_path = null;
	oFF.HttpCookie.prototype.m_version = 0;
	oFF.HttpCookie.prototype.m_maxAge = 0;
	oFF.HttpCookie.prototype.m_isSecure = false;
	oFF.HttpCookie.prototype.m_isHttpOnly = false;
	oFF.HttpCookie.prototype.releaseObject = function() {
		this.m_comment = null;
		this.m_domain = null;
		this.m_path = null;
		oFF.XNameValuePair.prototype.releaseObject.call(this);
	};
	oFF.HttpCookie.prototype.setByHttpServerResponseValue = function(
			httpHeaderValue) {
		var cookieAttributes;
		var start;
		var cookieName;
		var cookieValue;
		var end;
		var subValue;
		var assignIndex;
		var attributeName;
		var attributeValue;
		var path;
		var domain;
		var secure;
		var isHttpOnly;
		if (oFF.notNull(httpHeaderValue)) {
			cookieAttributes = oFF.XProperties.create();
			start = 0;
			cookieName = null;
			cookieValue = null;
			while (true) {
				end = oFF.XString.indexOfFrom(httpHeaderValue, ";", start);
				subValue = oFF.XString.substring(httpHeaderValue, start, end);
				assignIndex = oFF.XString.indexOf(subValue, "=");
				if (assignIndex === -1) {
					attributeName = subValue;
					attributeValue = "";
				} else {
					attributeName = oFF.XString.substring(subValue, 0,
							assignIndex);
					attributeValue = oFF.XString.substring(subValue,
							assignIndex + 1, -1);
				}
				attributeName = oFF.XString.trim(attributeName);
				attributeValue = oFF.XString.trim(attributeValue);
				if (oFF.isNull(cookieName)) {
					cookieName = attributeName;
					cookieValue = attributeValue;
				} else {
					attributeName = oFF.XString.toLowerCase(attributeName);
					cookieAttributes.putString(attributeName, attributeValue);
				}
				if (end === -1) {
					break;
				}
				start = end + 1;
			}
			this.setName(cookieName);
			this.setValue(cookieValue);
			path = cookieAttributes.getStringByKey("path");
			this.setPath(path);
			domain = cookieAttributes.getStringByKey("domain");
			this.setDomain(domain);
			secure = cookieAttributes.getStringByKey("secure");
			if (oFF.notNull(secure)) {
				this.setIsSecure(true);
			}
			isHttpOnly = cookieAttributes.getStringByKey("httponly");
			if (oFF.notNull(isHttpOnly)) {
				this.setIsHttpOnly(true);
			}
		}
	};
	oFF.HttpCookie.prototype.getComment = function() {
		return this.m_comment;
	};
	oFF.HttpCookie.prototype.setComment = function(comment) {
		this.m_comment = comment;
	};
	oFF.HttpCookie.prototype.getDomain = function() {
		return this.m_domain;
	};
	oFF.HttpCookie.prototype.setDomain = function(domain) {
		this.m_domain = domain;
	};
	oFF.HttpCookie.prototype.getPath = function() {
		return this.m_path;
	};
	oFF.HttpCookie.prototype.setPath = function(path) {
		this.m_path = path;
	};
	oFF.HttpCookie.prototype.getVersion = function() {
		return this.m_version;
	};
	oFF.HttpCookie.prototype.setVersion = function(version) {
		this.m_version = version;
	};
	oFF.HttpCookie.prototype.getMaxAge = function() {
		return this.m_maxAge;
	};
	oFF.HttpCookie.prototype.setMaxAge = function(maxAge) {
		this.m_maxAge = maxAge;
	};
	oFF.HttpCookie.prototype.isSecure = function() {
		return this.m_isSecure;
	};
	oFF.HttpCookie.prototype.setIsSecure = function(isSecure) {
		this.m_isSecure = isSecure;
	};
	oFF.HttpCookie.prototype.isHttpOnly = function() {
		return this.m_isHttpOnly;
	};
	oFF.HttpCookie.prototype.setIsHttpOnly = function(isHttpOnly) {
		this.m_isHttpOnly = isHttpOnly;
	};
	oFF.HttpCookie.prototype.setFromCookie = function(cookie) {
		this.setName(cookie.getName());
		this.setValue(cookie.getValue());
		this.setPath(cookie.getPath());
		this.setComment(cookie.getComment());
		this.setDomain(cookie.getDomain());
		this.setIsSecure(cookie.isSecure());
		this.setMaxAge(cookie.getMaxAge());
		this.setVersion(cookie.getVersion());
		this.setIsHttpOnly(cookie.isHttpOnly());
	};
	oFF.HttpCookie.prototype.toString = function() {
		var buffer = oFF.XStringBuffer.create();
		buffer.append(this.getName());
		if (this.getValue() !== null) {
			buffer.append("=");
			buffer.append(this.getValue());
		}
		if (this.getPath() !== null) {
			buffer.append("; Path=");
			buffer.append(this.getPath());
		}
		if (this.getDomain() !== null) {
			buffer.append("; Domain=");
			buffer.append(this.getDomain());
		}
		if (this.isSecure()) {
			buffer.append("; Secure");
		}
		if (this.isHttpOnly()) {
			buffer.append("; HttpOnly");
		}
		return buffer.toString();
	};
	oFF.HttpResponse = function() {
	};
	oFF.HttpResponse.prototype = new oFF.HttpExchange();
	oFF.HttpResponse.createResponse = function(httpRequest) {
		var response = new oFF.HttpResponse();
		response.setupResponse(httpRequest);
		return response;
	};
	oFF.HttpResponse.prototype.m_statusCode = 0;
	oFF.HttpResponse.prototype.m_statusCodeDetails = null;
	oFF.HttpResponse.prototype.m_httpMethodWithVersion = null;
	oFF.HttpResponse.prototype.m_httpRequest = null;
	oFF.HttpResponse.prototype.setupResponse = function(httpRequest) {
		var cookiesMasterStore;
		this.setup();
		this.m_httpRequest = httpRequest;
		this.m_statusCode = oFF.HttpStatusCode.SC_OK;
		cookiesMasterStore = httpRequest.getCookiesMasterStore();
		this.setCookiesMasterStore(cookiesMasterStore);
	};
	oFF.HttpResponse.prototype.releaseObject = function() {
		this.m_statusCodeDetails = null;
		this.m_httpMethodWithVersion = null;
		oFF.HttpExchange.prototype.releaseObject.call(this);
	};
	oFF.HttpResponse.prototype.getStatusCode = function() {
		return this.m_statusCode;
	};
	oFF.HttpResponse.prototype.setStatusCode = function(statusCode) {
		this.m_statusCode = statusCode;
	};
	oFF.HttpResponse.prototype.getStatusCodeDetails = function() {
		return this.m_statusCodeDetails;
	};
	oFF.HttpResponse.prototype.setStatusCodeDetails = function(details) {
		this.m_statusCodeDetails = details;
	};
	oFF.HttpResponse.prototype.getHttpMethodWithVersion = function() {
		return this.m_httpMethodWithVersion;
	};
	oFF.HttpResponse.prototype.setHttpMethodWithVersion = function(httpMethod) {
		this.m_httpMethodWithVersion = httpMethod;
	};
	oFF.HttpResponse.prototype.getLocation = function() {
		return this.getHeaderFields().getByKey(oFF.HttpConstants.HD_LOCATION);
	};
	oFF.HttpResponse.prototype.setLocation = function(location) {
		this.getHeaderFieldsBase().putString(oFF.HttpConstants.HD_LOCATION,
				location);
	};
	oFF.HttpResponse.prototype.createRawData = function() {
		var httpBuffer = oFF.XStringBuffer.create();
		var contentType;
		var data;
		var isDataSet;
		var postData;
		var binaryContent;
		var httpGetResponse;
		var bytes;
		var full;
		httpBuffer.append(oFF.HttpConstants.HTTP_11);
		httpBuffer.append(" ");
		httpBuffer.append(oFF.XInteger.convertToString(this.getStatusCode()));
		httpBuffer.append(" ");
		httpBuffer.append(this.getStatusCodeDetails());
		httpBuffer.append(oFF.HttpConstants.HTTP_CRLF);
		if (this.getLocation() !== null) {
			httpBuffer.append(oFF.HttpConstants.HD_LOCATION);
			httpBuffer.append(": ");
			httpBuffer.append(this.getLocation());
			httpBuffer.append(oFF.HttpConstants.HTTP_CRLF);
		}
		httpBuffer.append(oFF.HttpConstants.HD_CONTENT_TYPE);
		httpBuffer.append(": ");
		contentType = this.getContentType();
		data = null;
		isDataSet = false;
		if (oFF.isNull(contentType)) {
			httpBuffer.append(this.getContentTypeValue());
		} else {
			httpBuffer.append(contentType.getName());
			if (contentType.isText()) {
				httpBuffer.append(";charset=utf-8");
				postData = this.getString();
				if (oFF.notNull(postData)) {
					data = oFF.XByteArray.convertFromString(postData);
				}
				isDataSet = true;
			}
		}
		httpBuffer.append(oFF.HttpConstants.HTTP_CRLF);
		this.appendCookies(httpBuffer);
		if (!isDataSet) {
			binaryContent = this.getByteArray();
			if (oFF.notNull(binaryContent)) {
				data = binaryContent;
			}
		}
		httpBuffer.append(oFF.HttpConstants.HD_CONTENT_LENGTH);
		httpBuffer.append(": ");
		if (oFF.isNull(data)) {
			httpBuffer.append("0");
		} else {
			httpBuffer.appendInt(data.size());
		}
		httpBuffer.append(oFF.HttpConstants.HTTP_CRLF);
		this.appendHeadFields(httpBuffer);
		httpBuffer.append(oFF.HttpConstants.HTTP_CRLF);
		httpGetResponse = httpBuffer.toString();
		bytes = oFF.XByteArray.convertFromStringWithCharset(httpGetResponse,
				oFF.XCharset.USASCII);
		full = bytes;
		if (oFF.notNull(data)) {
			full = oFF.XByteArray.create(null, bytes.size() + data.size());
			oFF.XByteArray.copy(bytes, 0, full, 0, bytes.size());
			oFF.XByteArray.copy(data, 0, full, bytes.size(), data.size());
		}
		return oFF.HttpRawData.create(null, null, 0, full);
	};
	oFF.HttpResponse.prototype.appendCookies = function(httpBuffer) {
		var cookieContainer = this.getCookies();
		var cookies;
		var i;
		var currentCookie;
		if (oFF.notNull(cookieContainer)) {
			cookies = cookieContainer.getCookies();
			for (i = 0; i < cookies.size(); i++) {
				currentCookie = cookies.get(i);
				httpBuffer.append(oFF.HttpConstants.HD_SET_COOKIE);
				httpBuffer.append(": ");
				httpBuffer.append(currentCookie.getName());
				httpBuffer.append("=");
				httpBuffer.append(currentCookie.getValue());
				httpBuffer.append(";Path=");
				httpBuffer.append(currentCookie.getPath());
				httpBuffer.append(oFF.HttpConstants.HTTP_CRLF);
			}
		}
	};
	oFF.HttpResponse.prototype.appendHeadFields = function(httpBuffer) {
		var headerFields = this.getHeaderFields();
		var keysAsIteratorOfString = headerFields.getKeysAsIteratorOfString();
		var headerName;
		var headerValue;
		while (keysAsIteratorOfString.hasNext()) {
			headerName = keysAsIteratorOfString.next();
			headerValue = headerFields.getByKey(headerName);
			httpBuffer.append(headerName);
			httpBuffer.append(": ");
			httpBuffer.append(headerValue);
			httpBuffer.append(oFF.HttpConstants.HTTP_CRLF);
		}
	};
	oFF.HttpResponse.prototype.getHttpRequest = function() {
		return this.m_httpRequest;
	};
	oFF.HttpResponse.prototype.applyCookiesToMasterStorage = function() {
		var httpRequest;
		var host;
		var path;
		var cookies;
		if (oFF.notNull(this.m_cookiesMasterStore)
				&& oFF.notNull(this.m_cookies)) {
			httpRequest = this.getHttpRequest();
			host = httpRequest.getHost();
			path = httpRequest.getPath();
			cookies = this.getCookies();
			this.m_cookiesMasterStore.applyCookies(host, path, cookies);
		}
	};
	oFF.HttpResponse.prototype.toString = function() {
		var sb = oFF.XStringBuffer.create();
		var contentType;
		var postData;
		var cookieContainer;
		var cookies;
		var currentCookie;
		var i;
		var headerFields;
		var keysAsIteratorOfString;
		var headerName;
		var headerValue;
		sb.appendNewLine();
		sb.appendLine("*************");
		sb.appendLine("HTTP Response");
		sb.appendLine("*************");
		sb.append(oFF.HttpConstants.HTTP_11).append(" ").appendInt(
				this.getStatusCode());
		sb.append(" ").append(this.getStatusCodeDetails());
		sb.append(oFF.HttpConstants.HTTP_CRLF);
		if (this.getLocation() !== null) {
			sb.append(oFF.HttpConstants.HD_LOCATION).append(": ").append(
					this.getLocation()).append(oFF.HttpConstants.HTTP_CRLF);
		}
		contentType = this.getContentType();
		postData = null;
		if (oFF.notNull(contentType)) {
			if (contentType.isText()) {
				postData = this.getString();
			}
		}
		cookieContainer = this.getCookies();
		if (oFF.notNull(cookieContainer)) {
			cookies = cookieContainer.getCookies();
			for (i = 0; i < cookies.size(); i++) {
				currentCookie = cookies.get(i);
				sb.append(oFF.HttpConstants.HD_SET_COOKIE);
				sb.append(": ").append(currentCookie.getName());
				sb.append("=").append(currentCookie.getValue());
				sb.append(";Path=").append(currentCookie.getPath());
				sb.append(oFF.HttpConstants.HTTP_CRLF);
			}
		}
		headerFields = this.getHeaderFields();
		keysAsIteratorOfString = headerFields.getKeysAsIteratorOfString();
		while (keysAsIteratorOfString.hasNext()) {
			headerName = keysAsIteratorOfString.next();
			headerValue = headerFields.getByKey(headerName);
			sb.append(headerName).append(": ").append(headerValue).append(
					oFF.HttpConstants.HTTP_CRLF);
		}
		if (oFF.notNull(postData)) {
			sb.append(oFF.HttpConstants.HTTP_CRLF).append(postData).append(
					oFF.HttpConstants.HTTP_CRLF);
		}
		return sb.toString();
	};
	oFF.ProxyType = function() {
	};
	oFF.ProxyType.prototype = new oFF.XConstant();
	oFF.ProxyType.DEFAULT = null;
	oFF.ProxyType.NONE = null;
	oFF.ProxyType.PROXY = null;
	oFF.ProxyType.WEBDISPATCHER = null;
	oFF.ProxyType.staticSetup = function() {
		oFF.ProxyType.DEFAULT = oFF.XConstant.setupName(new oFF.ProxyType(),
				"Default");
		oFF.ProxyType.NONE = oFF.XConstant.setupName(new oFF.ProxyType(),
				"None");
		oFF.ProxyType.PROXY = oFF.XConstant.setupName(new oFF.ProxyType(),
				"Proxy");
		oFF.ProxyType.WEBDISPATCHER = oFF.XConstant.setupName(
				new oFF.ProxyType(), "Webdispatcher");
	};
	oFF.ProgramArgDef = function() {
	};
	oFF.ProgramArgDef.prototype = new oFF.DfNameTextObject();
	oFF.ProgramArgDef.createOption = function(name, text, values, valueType) {
		var newObj = new oFF.ProgramArgDef();
		newObj.setName(name);
		newObj.setText(text);
		newObj.setValues(values);
		newObj.setValueType(valueType);
		newObj.m_isParameter = false;
		return newObj;
	};
	oFF.ProgramArgDef.createStringParameter = function(name, text) {
		var newObj = new oFF.ProgramArgDef();
		newObj.setName(name);
		newObj.setText(text);
		newObj.setValueType(oFF.XValueType.STRING);
		newObj.m_isParameter = true;
		return newObj;
	};
	oFF.ProgramArgDef.createStringArrayParameter = function(name, text) {
		var newObj = new oFF.ProgramArgDef();
		newObj.setName(name);
		newObj.setText(text);
		newObj.setValueType(oFF.XValueType.ARRAY);
		newObj.m_isParameter = true;
		return newObj;
	};
	oFF.ProgramArgDef.prototype.m_isParameter = false;
	oFF.ProgramArgDef.prototype.m_possibleValues = null;
	oFF.ProgramArgDef.prototype.m_valueType = null;
	oFF.ProgramArgDef.prototype.isParameter = function() {
		return this.m_isParameter;
	};
	oFF.ProgramArgDef.prototype.getPossibleValues = function() {
		return this.m_possibleValues;
	};
	oFF.ProgramArgDef.prototype.setValues = function(values) {
		this.m_possibleValues = values;
	};
	oFF.ProgramArgDef.prototype.getValueType = function() {
		return this.m_valueType;
	};
	oFF.ProgramArgDef.prototype.setValueType = function(valueType) {
		this.m_valueType = valueType;
	};
	oFF.ProgramStartCfg = function() {
	};
	oFF.ProgramStartCfg.prototype = new oFF.DfNameTextObject();
	oFF.ProgramStartCfg.createByCmdLine = function(initArgsString) {
		var startCfg = null;
		var argValues = oFF.ProgramUtils.createArgValueList(initArgsString);
		startCfg = oFF.ProgramStartCfg.createByArgs(argValues, 0, false);
		return startCfg;
	};
	oFF.ProgramStartCfg.createByArgs = function(argValues, startOffset,
			convertToStructure) {
		var prgArgs = null;
		var prgName;
		var factory;
		var programMetadata;
		var theArgValues;
		var i;
		var theArgStructure;
		if (argValues.size() > startOffset) {
			prgName = argValues.get(startOffset);
			factory = oFF.ProgramRegistration.getProgramFactory(prgName);
			if (oFF.notNull(factory)) {
				programMetadata = factory.getProgramMetadata();
				theArgValues = oFF.XListOfString.create();
				for (i = startOffset + 1; i < argValues.size(); i++) {
					theArgValues.add(argValues.get(i));
				}
				if (convertToStructure === true) {
					theArgStructure = oFF.ProgramUtils
							.createArgStructureFromList(programMetadata
									.getArgDefinitions(), theArgValues, 0);
					prgArgs = oFF.ProgramStartCfg.createWithArgStruct(prgName,
							prgName, factory, theArgStructure, null);
				} else {
					prgArgs = oFF.ProgramStartCfg.createWithArgStruct(prgName,
							prgName, factory, null, theArgValues);
				}
			}
		}
		return prgArgs;
	};
	oFF.ProgramStartCfg.createWithArgStruct = function(name, text, factory,
			argStructure, argList) {
		var prgArgs;
		if (oFF.notNull(argStructure)) {
			prgArgs = oFF.ProgramArgs.createWithStructure(argStructure);
		} else {
			prgArgs = oFF.ProgramArgs.createWithList(argList);
		}
		return oFF.ProgramStartCfg.create(name, text, factory, prgArgs);
	};
	oFF.ProgramStartCfg.create = function(name, text, factory, args) {
		var startDef = new oFF.ProgramStartCfg();
		startDef.setName(name);
		startDef.setText(text);
		startDef.setIconImagePath(null);
		startDef.setFactory(factory);
		startDef.setArguments(args);
		return startDef;
	};
	oFF.ProgramStartCfg.createWithIcon = function(name, text, iconPath,
			factory, args) {
		var startDef = new oFF.ProgramStartCfg();
		startDef.setName(name);
		startDef.setText(text);
		startDef.setIconImagePath(iconPath);
		startDef.setFactory(factory);
		startDef.setArguments(args);
		return startDef;
	};
	oFF.ProgramStartCfg.prototype.m_args = null;
	oFF.ProgramStartCfg.prototype.m_factory = null;
	oFF.ProgramStartCfg.prototype.m_iconImagePath = null;
	oFF.ProgramStartCfg.prototype.getArguments = function() {
		return this.m_args;
	};
	oFF.ProgramStartCfg.prototype.setArguments = function(args) {
		this.m_args = args;
	};
	oFF.ProgramStartCfg.prototype.getFactory = function() {
		if (oFF.isNull(this.m_factory) && this.getName() !== null) {
			this.m_factory = oFF.ProgramRegistration.getProgramFactory(this
					.getName());
		}
		return this.m_factory;
	};
	oFF.ProgramStartCfg.prototype.setFactory = function(factory) {
		this.m_factory = factory;
	};
	oFF.ProgramStartCfg.prototype.getIconImagePath = function() {
		return this.m_iconImagePath;
	};
	oFF.ProgramStartCfg.prototype.setIconImagePath = function(path) {
		this.m_iconImagePath = path;
	};
	oFF.SigSelDomain = function() {
	};
	oFF.SigSelDomain.prototype = new oFF.XConstant();
	oFF.SigSelDomain.UI = null;
	oFF.SigSelDomain.DATA = null;
	oFF.SigSelDomain.CONTEXT = null;
	oFF.SigSelDomain.s_all = null;
	oFF.SigSelDomain.staticSetup = function() {
		oFF.SigSelDomain.s_all = oFF.XSetOfNameObject.create();
		oFF.SigSelDomain.UI = oFF.SigSelDomain.create("ui");
		oFF.SigSelDomain.DATA = oFF.SigSelDomain.create("dp");
		oFF.SigSelDomain.CONTEXT = oFF.SigSelDomain.create("Context");
	};
	oFF.SigSelDomain.create = function(name) {
		var domain = new oFF.SigSelDomain();
		domain.setName(name);
		oFF.SigSelDomain.s_all.add(domain);
		return domain;
	};
	oFF.SigSelDomain.lookup = function(name) {
		return oFF.SigSelDomain.s_all.getByKey(name);
	};
	oFF.SigSelIndexType = function() {
	};
	oFF.SigSelIndexType.prototype = new oFF.XConstant();
	oFF.SigSelIndexType.NONE = null;
	oFF.SigSelIndexType.NAME = null;
	oFF.SigSelIndexType.POSITION = null;
	oFF.SigSelIndexType.staticSetup = function() {
		oFF.SigSelIndexType.NONE = oFF.XConstant.setupName(
				new oFF.SigSelIndexType(), "None");
		oFF.SigSelIndexType.NAME = oFF.XConstant.setupName(
				new oFF.SigSelIndexType(), "Name");
		oFF.SigSelIndexType.POSITION = oFF.XConstant.setupName(
				new oFF.SigSelIndexType(), "Position");
	};
	oFF.SigSelType = function() {
	};
	oFF.SigSelType.prototype = new oFF.XConstant();
	oFF.SigSelType.MATCH = null;
	oFF.SigSelType.MATCH_NAME = null;
	oFF.SigSelType.MATCH_ID = null;
	oFF.SigSelType.WILDCARD = null;
	oFF.SigSelType.staticSetup = function() {
		oFF.SigSelType.MATCH = oFF.XConstant.setupName(new oFF.SigSelType(),
				"Match");
		oFF.SigSelType.MATCH_ID = oFF.XConstant.setupName(new oFF.SigSelType(),
				"MatchId");
		oFF.SigSelType.MATCH_NAME = oFF.XConstant.setupName(
				new oFF.SigSelType(), "MatchName");
		oFF.SigSelType.WILDCARD = oFF.XConstant.setupName(new oFF.SigSelType(),
				"Wildcard");
	};
	oFF.SubSystemType = function() {
	};
	oFF.SubSystemType.prototype = new oFF.XConstant();
	oFF.SubSystemType.APPLICATION = null;
	oFF.SubSystemType.UIMANAGER = null;
	oFF.SubSystemType.CONSOLE = null;
	oFF.SubSystemType.staticSetup = function() {
		oFF.SubSystemType.APPLICATION = oFF.XConstant.setupName(
				new oFF.SubSystemType(), "Application");
		oFF.SubSystemType.UIMANAGER = oFF.XConstant.setupName(
				new oFF.SubSystemType(), "UiManager");
		oFF.SubSystemType.CONSOLE = oFF.XConstant.setupName(
				new oFF.SubSystemType(), "Console");
	};
	oFF.WorkingTaskManagerType = function() {
	};
	oFF.WorkingTaskManagerType.prototype = new oFF.XConstant();
	oFF.WorkingTaskManagerType.SINGLE_THREADED = null;
	oFF.WorkingTaskManagerType.MULTI_THREADED = null;
	oFF.WorkingTaskManagerType.UI_DRIVER = null;
	oFF.WorkingTaskManagerType.staticSetup = function() {
		oFF.WorkingTaskManagerType.SINGLE_THREADED = oFF.XConstant.setupName(
				new oFF.WorkingTaskManagerType(), "SingleThreaded");
		oFF.WorkingTaskManagerType.MULTI_THREADED = oFF.XConstant.setupName(
				new oFF.WorkingTaskManagerType(), "MultiThreaded");
		oFF.WorkingTaskManagerType.UI_DRIVER = oFF.XConstant.setupName(
				new oFF.WorkingTaskManagerType(), "UiDriver");
	};
	oFF.XHierarchyAction = function() {
	};
	oFF.XHierarchyAction.prototype = new oFF.SyncAction();
	oFF.XHierarchyAction.createAndRun = function(session, result, listener,
			customIdentifier) {
		var newObj = new oFF.XHierarchyAction();
		newObj.setupSynchronizingObject(session);
		newObj.setData(result);
		newObj.processSyncAction(oFF.SyncType.BLOCKING, listener,
				customIdentifier);
		return newObj;
	};
	oFF.XHierarchyAction.prototype.callListener = function(extResult, listener,
			data, customIdentifier) {
		var children = null;
		if (oFF.notNull(data)) {
			children = data.getChildren();
		}
		listener.onChildFetched(extResult, data, children, customIdentifier);
	};
	oFF.SyncState = function() {
	};
	oFF.SyncState.prototype = new oFF.XConstantWithParent();
	oFF.SyncState.OUT_OF_SYNC = null;
	oFF.SyncState.PROCESSING = null;
	oFF.SyncState.IN_SYNC = null;
	oFF.SyncState.IN_SYNC_WITH_ERROR = null;
	oFF.SyncState.staticSetup = function() {
		oFF.SyncState.OUT_OF_SYNC = oFF.SyncState
				.create("OUT_OF_SYNC", 0, null);
		oFF.SyncState.PROCESSING = oFF.SyncState.create("PROCESSING", 1, null);
		oFF.SyncState.IN_SYNC = oFF.SyncState.create("IN_SYNC", 2, null);
		oFF.SyncState.IN_SYNC_WITH_ERROR = oFF.SyncState.create(
				"IN_SYNC_WITH_ERROR", 2, oFF.SyncState.IN_SYNC);
	};
	oFF.SyncState.create = function(name, level, parent) {
		var syncState = new oFF.SyncState();
		syncState.setupExt(name, parent);
		syncState.setLevel(level);
		return syncState;
	};
	oFF.SyncState.prototype.m_level = 0;
	oFF.SyncState.prototype.getLevel = function() {
		return this.m_level;
	};
	oFF.SyncState.prototype.setLevel = function(level) {
		this.m_level = level;
	};
	oFF.SyncState.prototype.isInSync = function() {
		return this.isTypeOf(oFF.SyncState.IN_SYNC);
	};
	oFF.SyncState.prototype.isNotInSync = function() {
		return !this.isTypeOf(oFF.SyncState.IN_SYNC);
	};
	oFF.SyncActionMultithreading = function() {
	};
	oFF.SyncActionMultithreading.prototype = new oFF.SyncAction();
	oFF.SyncActionMultithreading.prototype.m_workingTaskHandleMain = null;
	oFF.SyncActionMultithreading.prototype.m_workingTaskHandleWorker = null;
	oFF.SyncActionMultithreading.prototype.m_isMultiThreading = false;
	oFF.SyncActionMultithreading.prototype.m_isFinishedOnWorkerThread = false;
	oFF.SyncActionMultithreading.prototype.m_workerSyncType = null;
	oFF.SyncActionMultithreading.prototype.processSynchronizationInternal = function(
			syncType) {
		var doContinue;
		var workingTaskManager;
		if (syncType === oFF.SyncType.NON_BLOCKING) {
			this.m_isMultiThreading = true;
			workingTaskManager = this.getSession().getWorkingTaskManager();
			this.m_workingTaskHandleMain = workingTaskManager
					.createHandle(this);
			this.m_workingTaskHandleMain.addInputChunk(syncType);
			doContinue = true;
		} else {
			doContinue = this.processSynchronization(syncType);
		}
		return doContinue;
	};
	oFF.SyncActionMultithreading.prototype.processInputOnWorkerThread = function(
			handle) {
		if (handle.hasNextInputChunk() && oFF.isNull(this.m_workerSyncType)) {
			this.m_workerSyncType = handle.nextInputChunk();
			this.m_workingTaskHandleWorker = handle;
		}
		this.processSynchronization(this.m_workerSyncType);
	};
	oFF.SyncActionMultithreading.prototype.endSync = function() {
		if (this.m_isMultiThreading) {
			this.m_workingTaskHandleWorker.publishOutputChunk(this.getData());
			this.m_isFinishedOnWorkerThread = true;
		} else {
			this.endSyncInternal();
		}
	};
	oFF.SyncActionMultithreading.prototype.isFinishedOnWorkerThread = function(
			handle) {
		return this.m_isFinishedOnWorkerThread;
	};
	oFF.SyncActionMultithreading.prototype.processOutputOnMainThread = function(
			handle) {
		if (handle.hasNextOutputChunk()) {
			handle.nextOutputChunk();
			this.endSyncInternal();
		}
	};
	oFF.SyncActionSequence = function() {
	};
	oFF.SyncActionSequence.prototype = new oFF.SyncAction();
	oFF.SyncActionSequence.create = function(context) {
		var sequence = new oFF.SyncActionSequence();
		sequence.setupSynchronizingObject(context);
		return sequence;
	};
	oFF.SyncActionSequence.prototype.m_actions = null;
	oFF.SyncActionSequence.prototype.m_mainAction = null;
	oFF.SyncActionSequence.prototype.setupSynchronizingObject = function(
			context) {
		oFF.SyncAction.prototype.setupSynchronizingObject.call(this, context);
		this.m_actions = oFF.XList.create();
	};
	oFF.SyncActionSequence.prototype.releaseObject = function() {
		this.m_actions = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_actions);
		this.m_mainAction = null;
		oFF.SyncAction.prototype.releaseObject.call(this);
	};
	oFF.SyncActionSequence.prototype.addAction = function(action) {
		if (oFF.notNull(this.m_mainAction)) {
			throw oFF.XException
					.createIllegalStateException("Main action already set.");
		}
		this.m_actions.add(action);
	};
	oFF.SyncActionSequence.prototype.setMainAction = function(action) {
		this.addAction(action);
		this.m_mainAction = action;
	};
	oFF.SyncActionSequence.prototype.processSynchronization = function(syncType) {
		var i;
		var syncAction;
		var data;
		var asyncAction;
		oFF.XObjectExt.checkNotNull(this.m_mainAction, "Main action not set.");
		if (syncType === oFF.SyncType.BLOCKING) {
			for (i = 0; i < this.m_actions.size(); i++) {
				syncAction = this.m_actions.get(i);
				syncAction.processSyncGeneric(syncType, null, null);
				this.addAllMessages(syncAction);
				if (syncAction.hasErrors()) {
					break;
				}
			}
			data = this.m_mainAction.getData();
			this.setData(data);
			this.endSync();
			return false;
		}
		if (this.m_actions.size() > 0) {
			asyncAction = this.m_actions.get(0);
			asyncAction.processSyncGeneric(syncType, this, oFF.XIntegerValue
					.create(0));
			return true;
		}
		this.endSync();
		return false;
	};
	oFF.SyncActionSequence.prototype.onSynchronized = function(messages, data,
			customIdentifier) {
		var number;
		var numberValue;
		var isLast;
		var asyncAction;
		this.addAllMessages(messages);
		number = customIdentifier;
		numberValue = number.getInteger();
		isLast = numberValue === this.m_actions.size() - 1;
		if (isLast) {
			this.setData(data);
		}
		if (this.isSyncCanceled()) {
			this.addError(oFF.ErrorCodes.OTHER_ERROR,
					"Sequence execution cancelled");
		}
		if (isLast || messages.hasErrors()) {
			this.endSync();
		} else {
			numberValue = numberValue + 1;
			asyncAction = this.m_actions.get(numberValue);
			asyncAction.processSyncGeneric(oFF.SyncType.NON_BLOCKING, this,
					oFF.XIntegerValue.create(numberValue));
		}
	};
	oFF.SyncActionSequence.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		this.m_mainAction.callListener(extResult, listener, data,
				customIdentifier);
	};
	oFF.ContentType = function() {
	};
	oFF.ContentType.prototype = new oFF.XConstantWithParent();
	oFF.ContentType.BINARY = null;
	oFF.ContentType.TEXT = null;
	oFF.ContentType.STRUCTURED = null;
	oFF.ContentType.JSON = null;
	oFF.ContentType.XML = null;
	oFF.ContentType.ATOM = null;
	oFF.ContentType.URI_PARAMETER = null;
	oFF.ContentType.TEXT_OR_HTML = null;
	oFF.ContentType.WILDCARD = null;
	oFF.ContentType.APPLICATION_JSON = null;
	oFF.ContentType.APPLICATION_FORM = null;
	oFF.ContentType.APPLICATION_XJAVASCRIPT = null;
	oFF.ContentType.APPLICATION_JAVASCRIPT = null;
	oFF.ContentType.APPLICATION_XML = null;
	oFF.ContentType.APPLICATION_ATOM_XML = null;
	oFF.ContentType.APPLICATION_ATOMSVC_XML = null;
	oFF.ContentType.APPLICATION_FLASH = null;
	oFF.ContentType.APPLICATION_OCTETSTREAM = null;
	oFF.ContentType.APPLICATION_XFONT_TTF = null;
	oFF.ContentType.TEXT_HTML = null;
	oFF.ContentType.TEXT_CSS = null;
	oFF.ContentType.TEXT_CSV = null;
	oFF.ContentType.TEXT_PLAIN = null;
	oFF.ContentType.TEXT_XML = null;
	oFF.ContentType.TEXT_JAVASCRIPT = null;
	oFF.ContentType.IMAGE_GIF = null;
	oFF.ContentType.IMAGE_JPEG = null;
	oFF.ContentType.IMAGE_PNG = null;
	oFF.ContentType.IMAGE_XICON = null;
	oFF.ContentType.FONT_WOFF = null;
	oFF.ContentType.s_instances = null;
	oFF.ContentType.s_mimeTypeMapping = null;
	oFF.ContentType.staticSetup = function() {
		oFF.ContentType.s_instances = oFF.XHashMapByString.create();
		oFF.ContentType.s_mimeTypeMapping = oFF.XHashMapByString.create();
		oFF.ContentType.BINARY = oFF.ContentType.create("binary", null);
		oFF.ContentType.TEXT = oFF.ContentType.create("text", null);
		oFF.ContentType.STRUCTURED = oFF.ContentType.create("structured",
				oFF.ContentType.TEXT);
		oFF.ContentType.JSON = oFF.ContentType.create("json",
				oFF.ContentType.STRUCTURED);
		oFF.ContentType.XML = oFF.ContentType.create("xml",
				oFF.ContentType.STRUCTURED);
		oFF.ContentType.ATOM = oFF.ContentType.create("atom",
				oFF.ContentType.STRUCTURED);
		oFF.ContentType.TEXT_OR_HTML = oFF.ContentType.create("text_html",
				oFF.ContentType.TEXT);
		oFF.ContentType.URI_PARAMETER = oFF.ContentType.create("uri_parameter",
				oFF.ContentType.TEXT);
		oFF.ContentType.WILDCARD = oFF.ContentType.create("*/*",
				oFF.ContentType.BINARY);
		oFF.ContentType.TEXT_HTML = oFF.ContentType.create("text/html",
				oFF.ContentType.TEXT_OR_HTML);
		oFF.ContentType.TEXT_CSS = oFF.ContentType.create("text/css",
				oFF.ContentType.TEXT);
		oFF.ContentType.TEXT_CSV = oFF.ContentType.create("text/csv",
				oFF.ContentType.TEXT);
		oFF.ContentType.TEXT_PLAIN = oFF.ContentType.create("text/plain",
				oFF.ContentType.TEXT);
		oFF.ContentType.TEXT_JAVASCRIPT = oFF.ContentType.create(
				"text/javascript", oFF.ContentType.TEXT);
		oFF.ContentType.TEXT_XML = oFF.ContentType.create("text/xml",
				oFF.ContentType.XML);
		oFF.ContentType.APPLICATION_JSON = oFF.ContentType.create(
				"application/json", oFF.ContentType.JSON);
		oFF.ContentType.APPLICATION_FORM = oFF.ContentType.create(
				"application/x-www-form-urlencoded",
				oFF.ContentType.URI_PARAMETER);
		oFF.ContentType.APPLICATION_XJAVASCRIPT = oFF.ContentType.create(
				"application/x-javascript", oFF.ContentType.TEXT);
		oFF.ContentType.APPLICATION_JAVASCRIPT = oFF.ContentType.create(
				"application/javascript", oFF.ContentType.TEXT);
		oFF.ContentType.APPLICATION_XML = oFF.ContentType.create(
				"application/xml", oFF.ContentType.XML);
		oFF.ContentType.APPLICATION_FLASH = oFF.ContentType.create(
				"application/x-shockwave-flash", oFF.ContentType.BINARY);
		oFF.ContentType.APPLICATION_XFONT_TTF = oFF.ContentType.create(
				"application/x-font-ttf", oFF.ContentType.BINARY);
		oFF.ContentType.APPLICATION_ATOM_XML = oFF.ContentType.create(
				"application/atom+xml", oFF.ContentType.XML);
		oFF.ContentType.APPLICATION_ATOMSVC_XML = oFF.ContentType.create(
				"application/atomsvc+xml", oFF.ContentType.XML);
		oFF.ContentType.IMAGE_GIF = oFF.ContentType.create("image/gif",
				oFF.ContentType.BINARY);
		oFF.ContentType.IMAGE_JPEG = oFF.ContentType.create("image/jpeg",
				oFF.ContentType.BINARY);
		oFF.ContentType.IMAGE_PNG = oFF.ContentType.create("image/png",
				oFF.ContentType.BINARY);
		oFF.ContentType.IMAGE_XICON = oFF.ContentType.create("image/x-icon",
				oFF.ContentType.BINARY);
		oFF.ContentType.FONT_WOFF = oFF.ContentType.create("font/woff",
				oFF.ContentType.BINARY);
		oFF.ContentType.APPLICATION_OCTETSTREAM = oFF.ContentType.create(
				"application/octet-stream", oFF.ContentType.BINARY);
		oFF.ContentType.putMapping("txt", oFF.ContentType.TEXT_PLAIN);
		oFF.ContentType.putMapping("html", oFF.ContentType.TEXT_HTML);
		oFF.ContentType.putMapping("htm", oFF.ContentType.TEXT_HTML);
		oFF.ContentType.putMapping("css", oFF.ContentType.TEXT_CSS);
		oFF.ContentType.putMapping("js", oFF.ContentType.TEXT_JAVASCRIPT);
		oFF.ContentType.putMapping("xml", oFF.ContentType.TEXT_XML);
		oFF.ContentType.putMapping("png", oFF.ContentType.IMAGE_PNG);
		oFF.ContentType.putMapping("jpg", oFF.ContentType.IMAGE_JPEG);
		oFF.ContentType.putMapping("jpeg", oFF.ContentType.IMAGE_JPEG);
		oFF.ContentType.putMapping("jpe", oFF.ContentType.IMAGE_JPEG);
		oFF.ContentType.putMapping("gif", oFF.ContentType.IMAGE_GIF);
		oFF.ContentType.putMapping("woff", oFF.ContentType.FONT_WOFF);
		oFF.ContentType.putMapping("properties", oFF.ContentType.TEXT_PLAIN);
		oFF.ContentType.putMapping("json", oFF.ContentType.APPLICATION_JSON);
		oFF.ContentType.putMapping("uqm", oFF.ContentType.APPLICATION_JSON);
	};
	oFF.ContentType.create = function(name, parent) {
		var newConstant = new oFF.ContentType();
		newConstant.setupContentType(name, parent);
		return newConstant;
	};
	oFF.ContentType.clearMappings = function() {
		oFF.ContentType.s_mimeTypeMapping.clear();
	};
	oFF.ContentType.putMapping = function(ending, type) {
		oFF.ContentType.s_mimeTypeMapping.put(ending, type);
	};
	oFF.ContentType.lookupByFileEnding = function(name) {
		return oFF.ContentType.s_mimeTypeMapping.getByKey(name);
	};
	oFF.ContentType.lookup = function(name) {
		return oFF.ContentType.s_instances.getByKey(name);
	};
	oFF.ContentType.prototype.setupContentType = function(name, parent) {
		this.setupExt(name, parent);
		oFF.ContentType.s_instances.put(name, this);
	};
	oFF.ContentType.prototype.isText = function() {
		return this.isTypeOf(oFF.ContentType.TEXT);
	};
	oFF.XFile = function() {
	};
	oFF.XFile.prototype = new oFF.DfXFile();
	oFF.XFile.GZIP_EXTENSION = ".gz";
	oFF.XFile.SLASH = "/";
	oFF.XFile.BACK_SLASH = "\\";
	oFF.XFile.COLON = ":";
	oFF.XFile.FILE_SCHEMA = "file://";
	oFF.XFile.URL_PATTERN = "://";
	oFF.XFile.NATIVE_SLASH = null;
	oFF.XFile.IS_SUPPORTED = false;
	oFF.XFile.DEBUG_MODE = false;
	oFF.XFile.s_fileSystem = null;
	oFF.XFile.s_fileSystems = null;
	oFF.XFile.create = function(session, autoDetectPath) {
		return oFF.XFile.createExt(session, oFF.XFile.s_fileSystem,
				autoDetectPath, oFF.PathFormat.AUTO_DETECT,
				oFF.VarResolveMode.NONE);
	};
	oFF.XFile.createByNativePath = function(session, nativePath) {
		return oFF.XFile.createExt(session, oFF.XFile.s_fileSystem, nativePath,
				oFF.PathFormat.NATIVE, oFF.VarResolveMode.NONE);
	};
	oFF.XFile.createFromSdk = function(session, relativePath) {
		var sdkPath = oFF.XStringUtils
				.concatenate2("$[ff_sdk]$/", relativePath);
		return oFF.XFile.createExt(session, oFF.XFile.s_fileSystem, sdkPath,
				oFF.PathFormat.AUTO_DETECT, oFF.VarResolveMode.DOLLAR);
	};
	oFF.XFile.createByUri = function(session, uri) {
		return oFF.XFile.createExt(session, oFF.XFile.s_fileSystem, uri
				.getUriString(), oFF.PathFormat.URL, oFF.VarResolveMode.NONE);
	};
	oFF.XFile.createExt = function(session, fileSystem, path, pathFormat,
			varResolveMode) {
		var uri = oFF.XFile.convertToUrl(session, path, pathFormat,
				varResolveMode);
		var protocolType;
		var file;
		if (oFF.isNull(uri)) {
			return null;
		}
		protocolType = uri.getProtocolType();
		if (protocolType === oFF.ProtocolType.HTTP
				|| protocolType === oFF.ProtocolType.HTTPS) {
			return oFF.XHttpFile._create(session, uri);
		}
		file = new oFF.XFile();
		file.setupFile(session, fileSystem, uri);
		return file;
	};
	oFF.XFile.setFileSystem = function(fileSystem) {
		oFF.XFile.s_fileSystem = fileSystem;
		if (oFF.isNull(oFF.XFile.s_fileSystems)) {
			oFF.XFile.s_fileSystems = oFF.XHashMapByString.create();
		}
		oFF.XFile.s_fileSystems.putIfNotNull(fileSystem.getFileSystemType()
				.getName(), fileSystem);
	};
	oFF.XFile.getFileSystem = function() {
		return oFF.XFile.s_fileSystem;
	};
	oFF.XFile.setNativeSlash = function(slash) {
		oFF.XFile.NATIVE_SLASH = slash;
	};
	oFF.XFile.convertNativeToNormalizedPath = function(nativePath) {
		var normalized = nativePath;
		if (oFF.XString.isEqual(oFF.XFile.NATIVE_SLASH, oFF.XFile.BACK_SLASH)) {
			normalized = oFF.XString.replace(normalized,
					oFF.XFile.NATIVE_SLASH, oFF.XFile.SLASH);
			if (oFF.XString.containsString(normalized, oFF.XFile.COLON)) {
				normalized = oFF.XStringUtils.concatenate2(oFF.XFile.SLASH,
						normalized);
			}
		}
		return normalized;
	};
	oFF.XFile.convertNormalizedToNativePath = function(normalizedPath) {
		var nativePath = normalizedPath;
		if (oFF.notNull(normalizedPath)
				&& oFF.XString.isEqual(oFF.XFile.NATIVE_SLASH, "/") === false) {
			if (oFF.XString.startsWith(nativePath, "/")) {
				nativePath = oFF.XString.substring(nativePath, 1, -1);
			}
			nativePath = oFF.XString.replace(nativePath, "/",
					oFF.XFile.NATIVE_SLASH);
		}
		return nativePath;
	};
	oFF.XFile.convertToUrl = function(session, path, pathFormat, varResolveMode) {
		var thePath = path;
		var env;
		var uri;
		var thePathFormat;
		if (varResolveMode !== oFF.VarResolveMode.NONE) {
			if (oFF.notNull(session)) {
				env = session.getEnvironment();
			} else {
				env = oFF.XEnvironment.getInstance();
			}
			thePath = env.resolvePath(thePath);
		}
		uri = null;
		if (oFF.notNull(thePath)) {
			thePathFormat = pathFormat;
			if (thePathFormat === oFF.PathFormat.AUTO_DETECT) {
				if (oFF.XString.containsString(thePath, oFF.XFile.BACK_SLASH)) {
					thePathFormat = oFF.PathFormat.NATIVE;
				} else {
					if (oFF.XString.containsString(thePath,
							oFF.XFile.URL_PATTERN)) {
						thePathFormat = oFF.PathFormat.URL;
					} else {
						thePathFormat = oFF.PathFormat.NORMALIZED;
					}
				}
			}
			if (thePathFormat === oFF.PathFormat.NATIVE) {
				thePath = oFF.XFile.convertNativeToNormalizedPath(thePath);
				thePathFormat = oFF.PathFormat.NORMALIZED;
			}
			if (thePathFormat === oFF.PathFormat.NORMALIZED) {
				uri = oFF.XFile.convertNormalizedToUrl(thePath);
			} else {
				if (thePathFormat === oFF.PathFormat.URL) {
					uri = oFF.XUri.createFromUri(thePath);
				}
			}
		}
		return uri;
	};
	oFF.XFile.convertNormalizedToUrl = function(normalizedPath) {
		var uri = oFF.XUri.create();
		uri.setProtocolType(oFF.ProtocolType.FILE);
		uri.setPath(normalizedPath);
		return uri;
	};
	oFF.XFile.prototype.m_activeFileSystem = null;
	oFF.XFile.prototype.m_name = null;
	oFF.XFile.prototype.m_nativePath = null;
	oFF.XFile.prototype.m_normalizedPath = null;
	oFF.XFile.prototype.m_pathElements = null;
	oFF.XFile.prototype.m_fileSystemType = null;
	oFF.XFile.prototype.setupFile = function(session, fileSystem, uri) {
		var endsWithSlash;
		var cutted;
		var elementCount;
		this.setupSessionContext(session);
		if (oFF.isNull(session)) {
			throw oFF.XException
					.createIllegalArgumentException("File instance needs session object");
		}
		if (oFF.notNull(fileSystem)) {
			this.m_activeFileSystem = fileSystem;
		} else {
			this.m_activeFileSystem = oFF.XFile.s_fileSystem;
		}
		if (oFF.notNull(this.m_activeFileSystem)) {
			this.m_fileSystemType = this.m_activeFileSystem.getFileSystemType();
			this.m_normalizedPath = uri.getPath();
			this.m_nativePath = oFF.XFile
					.convertNormalizedToNativePath(this.m_normalizedPath);
			if (oFF.notNull(this.m_normalizedPath)) {
				endsWithSlash = oFF.XString.endsWith(this.m_normalizedPath,
						oFF.XFile.SLASH);
				cutted = this.m_normalizedPath;
				if (endsWithSlash) {
					cutted = oFF.XStringUtils.stripRight(this.m_normalizedPath,
							1);
				}
				this.m_pathElements = oFF.XStringTokenizer.splitString(cutted,
						oFF.XFile.SLASH);
				elementCount = this.m_pathElements.size();
				this.m_name = this.m_pathElements.get(elementCount - 1);
			}
			this.writeDebugMessage("set up");
		}
	};
	oFF.XFile.prototype.releaseObject = function() {
		this.m_activeFileSystem = null;
		this.m_pathElements = oFF.XObjectExt.release(this.m_pathElements);
		oFF.DfXFile.prototype.releaseObject.call(this);
	};
	oFF.XFile.prototype.createChild = function(relativePath) {
		var buffer;
		this.writeDebugMessage(oFF.XStringUtils.concatenate2("create child ",
				relativePath));
		buffer = oFF.XStringBuffer.create();
		buffer.append(this.m_normalizedPath);
		if (oFF.XString.endsWith(this.m_normalizedPath, oFF.XFile.SLASH)) {
			if (!oFF.XString.startsWith(relativePath, oFF.XFile.SLASH)) {
				buffer.append(relativePath);
			} else {
				buffer.append(oFF.XStringUtils.stripChars(relativePath, 1));
			}
		} else {
			if (oFF.XString.startsWith(relativePath, oFF.XFile.SLASH)) {
				buffer.append(relativePath);
			} else {
				buffer.append(oFF.XFile.SLASH).append(relativePath);
			}
		}
		return oFF.XFile.create(this.getSession(), buffer.toString());
	};
	oFF.XFile.prototype.createSibling = function(name) {
		var buffer = oFF.XStringBuffer.create();
		var endOfDirectory = oFF.XString
				.lastIndexOf(this.m_normalizedPath, "/");
		var directory;
		if (endOfDirectory !== -1) {
			directory = oFF.XString.substring(this.m_normalizedPath, 0,
					endOfDirectory + 1);
			buffer.append(directory);
		}
		buffer.append(name);
		return oFF.XFile.create(this.getSession(), buffer.toString());
	};
	oFF.XFile.prototype.isDirectory = function() {
		var result = this.m_activeFileSystem.isDirectory(this.m_nativePath);
		if (result) {
			this.writeDebugMessage("is directory");
		}
		return result;
	};
	oFF.XFile.prototype.isFile = function() {
		var result = this.m_activeFileSystem.isFile(this.m_nativePath);
		if (result) {
			this.writeDebugMessage("is file");
		}
		return result;
	};
	oFF.XFile.prototype.isExisting = function() {
		var result = this.m_activeFileSystem.isExisting(this.m_nativePath);
		if (result) {
			this.writeDebugMessage("is existing");
		}
		return result;
	};
	oFF.XFile.prototype.isHidden = function() {
		var result = this.m_activeFileSystem.isHidden(this.m_nativePath);
		if (result) {
			this.writeDebugMessage("is hidden");
		}
		return result;
	};
	oFF.XFile.prototype.mkdir = function() {
		this.writeDebugMessage("mkdir");
		this.handleErrorMessages(this.m_activeFileSystem
				.mkdir(this.m_nativePath));
	};
	oFF.XFile.prototype.mkdirs = function() {
		this.writeDebugMessage("mkdirs");
		this.handleErrorMessages(this.m_activeFileSystem
				.mkdirs(this.m_nativePath));
	};
	oFF.XFile.prototype.getChildren = function() {
		var roots;
		var fileList;
		var i;
		this.writeDebugMessage("get children");
		roots = this.m_activeFileSystem.getChildren(this.m_nativePath);
		fileList = oFF.XList.create();
		for (i = 0; i < roots.size(); i++) {
			fileList.add(oFF.XFile.createByNativePath(this.getSession(), roots
					.get(i)));
		}
		return fileList;
	};
	oFF.XFile.prototype.getChildElements = function() {
		return oFF.XReadOnlyListWrapper.create(this.getChildren());
	};
	oFF.XFile.prototype.hasChildren = oFF.noSupport;
	oFF.XFile.prototype.supportsSetLastModified = function() {
		this.writeDebugMessage("supports set last modified");
		return true;
	};
	oFF.XFile.prototype.deleteFile = function() {
		this.writeDebugMessage("delete file");
		this.handleErrorMessages(this.m_activeFileSystem
				.deleteFile(this.m_nativePath));
	};
	oFF.XFile.prototype.isWriteable = function() {
		var result = this.m_activeFileSystem.isWriteable(this.m_nativePath);
		if (result) {
			this.writeDebugMessage("is writeable");
		}
		return result;
	};
	oFF.XFile.prototype.setWritable = function(writable, ownerOnly) {
		var sb;
		if (oFF.XFile.DEBUG_MODE) {
			sb = oFF.XStringBuffer.create();
			sb.append("set writeable ").appendBoolean(writable);
			if (ownerOnly) {
				sb.append(" owner only");
			}
			this.writeDebugMessage(sb.toString());
		}
		this.handleErrorMessages(this.m_activeFileSystem.setWritable(
				this.m_nativePath, writable, ownerOnly));
	};
	oFF.XFile.prototype.isReadable = function() {
		var result = this.m_activeFileSystem.isReadable(this.m_nativePath);
		if (result) {
			this.writeDebugMessage("is readable");
		}
		return result;
	};
	oFF.XFile.prototype.isExecutable = function() {
		var result = this.m_activeFileSystem.isExecutable(this.m_nativePath);
		if (result) {
			this.writeDebugMessage("is executable");
		}
		return result;
	};
	oFF.XFile.prototype.supportsRenameTo = function() {
		this.writeDebugMessage("supports rename to");
		return true;
	};
	oFF.XFile.prototype.rename = function(dest) {
		var buffer;
		var i;
		var normalizedPath;
		var destFile;
		this.writeDebugMessage(oFF.XStringUtils.concatenate2("rename ", dest));
		buffer = oFF.XStringBuffer.create();
		for (i = 0; i < this.m_pathElements.size() - 1; i++) {
			buffer.append(oFF.XFile.SLASH).append(this.m_pathElements.get(i));
		}
		buffer.append(oFF.XFile.SLASH).append(dest);
		normalizedPath = buffer.toString();
		destFile = oFF.XFile.create(this.getSession(), normalizedPath);
		this.handleErrorMessages(this.m_activeFileSystem.renameTo(
				this.m_nativePath, destFile.getNativePath()));
	};
	oFF.XFile.prototype.renameTo = function(dest) {
		if (oFF.isNull(dest)) {
			this.writeDebugMessage("Destination was null");
			return;
		}
		this.writeDebugMessage(oFF.XStringUtils.concatenate2("rename to ", dest
				.getNativePath()));
		this.handleErrorMessages(this.m_activeFileSystem.renameTo(
				this.m_nativePath, dest.getNativePath()));
	};
	oFF.XFile.prototype.handleErrorMessages = function(messages) {
		this.clearMessages();
		this.addAllMessages(messages);
		if (oFF.XFile.DEBUG_MODE && this.hasErrors()) {
			this.log(this.getSummary());
		}
	};
	oFF.XFile.prototype.getLastModifiedTimestamp = function() {
		var result = this.m_activeFileSystem
				.getLastModifiedTimestamp(this.m_nativePath);
		this.writeDebugMessage(oFF.XStringUtils.concatenate2(
				"get last modified timestamp ", oFF.XLong
						.convertToString(result)));
		return result;
	};
	oFF.XFile.prototype.load = function() {
		var content = this.loadExt();
		return content.getByteArray();
	};
	oFF.XFile.prototype.processLoading = function(syncType, listener,
			customIdentifier) {
		return null;
	};
	oFF.XFile.prototype.loadExt = function() {
		return this.loadInternal(this.m_nativePath, false);
	};
	oFF.XFile.prototype.loadGzipped = function() {
		return this.loadInternal(this.m_nativePath, true);
	};
	oFF.XFile.prototype.loadInternal = function(path, isGzipped) {
		var content;
		var contentType;
		var data;
		var sb;
		this.writeDebugMessage("load ext");
		this.clearMessages();
		if (isGzipped) {
			content = this.m_activeFileSystem.loadGzipped(path);
		} else {
			content = this.m_activeFileSystem.loadExt(this.m_nativePath);
		}
		this.addAllMessages(content.getMessageCollection());
		if (oFF.XFile.DEBUG_MODE) {
			if (this.hasErrors()) {
				this.log(this.getSummary());
			} else {
				contentType = content.getContentType();
				if (oFF.notNull(contentType)) {
					this.log2("content type: ", contentType.getName());
					if (contentType.isTypeOf(oFF.ContentType.BINARY)) {
						data = content.getByteArray();
						if (oFF.notNull(data)) {
							sb = oFF.XStringBuffer.create();
							sb.append("data with ").appendInt(data.size())
									.append(" bytes");
							this.log(sb.toString());
						}
					}
				}
			}
		}
		return content;
	};
	oFF.XFile.prototype.save = function(data) {
		this.saveInternal(data, this.m_nativePath, false);
	};
	oFF.XFile.prototype.saveGzipped = function(data) {
		this.saveInternal(data, this.m_nativePath, true);
	};
	oFF.XFile.prototype.saveInternal = function(data, path, isGzipped) {
		var sb;
		var messages;
		if (oFF.XFile.DEBUG_MODE) {
			sb = oFF.XStringBuffer.create();
			sb.append("save");
			if (oFF.notNull(data)) {
				sb.append(" data with ").appendInt(data.size())
						.append(" bytes");
			}
			this.writeDebugMessage(sb.toString());
		}
		if (isGzipped) {
			messages = this.m_activeFileSystem.saveGzipped(path, data);
		} else {
			messages = this.m_activeFileSystem.save(path, data);
		}
		this.handleErrorMessages(messages);
	};
	oFF.XFile.prototype.getNormalizedPath = function() {
		return this.m_normalizedPath;
	};
	oFF.XFile.prototype.getNativePath = function() {
		return this.m_nativePath;
	};
	oFF.XFile.prototype.getName = function() {
		return this.m_name;
	};
	oFF.XFile.prototype.getUri = function() {
		var uri = oFF.XUri.create();
		uri.setScheme("file");
		uri.setPath(this.getNormalizedPath());
		return uri;
	};
	oFF.XFile.prototype.getParent = function() {
		return oFF.XFile.create(this.getSession(), this.getParentPath());
	};
	oFF.XFile.prototype.getParentPath = function() {
		var buffer = oFF.XStringBuffer.create();
		var size = this.m_pathElements.size();
		var i;
		for (i = 0; i < size - 1; i++) {
			buffer.append(this.m_pathElements.get(i)).append(oFF.XFile.SLASH);
		}
		return buffer.toString();
	};
	oFF.XFile.prototype.getPathElements = function() {
		return this.m_pathElements;
	};
	oFF.XFile.prototype.getFileSystemType = function() {
		return this.m_fileSystemType;
	};
	oFF.XFile.prototype.isLeaf = function() {
		return !this.isNode();
	};
	oFF.XFile.prototype.isNode = function() {
		return this.isDirectory();
	};
	oFF.XFile.prototype.getChildSetState = function() {
		return oFF.ChildSetState.INITIAL;
	};
	oFF.XFile.prototype.processChildFetch = function(syncType, listener,
			customIdentifier) {
		var result = oFF.XHierarchyResult.create(this, this.getChildElements());
		return oFF.XHierarchyAction.createAndRun(null, result, listener,
				customIdentifier);
	};
	oFF.XFile.prototype.getText = function() {
		return this.getName();
	};
	oFF.XFile.prototype.getComponentType = function() {
		return oFF.IoComponentType.FILE;
	};
	oFF.XFile.prototype.getTagValue = function(tagName) {
		return null;
	};
	oFF.XFile.prototype.getContentElement = function() {
		return this;
	};
	oFF.XFile.prototype.getContentConstant = function() {
		return null;
	};
	oFF.XFile.prototype.writeDebugMessage = function(message) {
		if (!oFF.XFile.DEBUG_MODE) {
			return;
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_nativePath)) {
			this.log4("XFile: ", message, " ", this.m_nativePath);
		} else {
			if (oFF.XStringUtils.isNotNullAndNotEmpty(this.m_normalizedPath)) {
				this.log4("XFile: ", message, " ", this.m_normalizedPath);
			} else {
				this.log2("XFile: ", message);
			}
		}
	};
	oFF.XFile.prototype.toString = function() {
		return this.m_normalizedPath;
	};
	oFF.XHttpFile = function() {
	};
	oFF.XHttpFile.prototype = new oFF.DfXFile();
	oFF.XHttpFile._create = function(session, uri) {
		var file = new oFF.XHttpFile();
		file.setupHttpFile(session, uri);
		return file;
	};
	oFF.XHttpFile.prototype.m_uri = null;
	oFF.XHttpFile.prototype.m_directoryInfo = null;
	oFF.XHttpFile.prototype.setupHttpFile = function(session, uri) {
		oFF.DfXFile.prototype.setupSessionContext.call(this, session);
		this.m_uri = uri;
	};
	oFF.XHttpFile.prototype.getUri = function() {
		return this.m_uri;
	};
	oFF.XHttpFile.prototype.load = oFF.noSupport;
	oFF.XHttpFile.prototype.loadExt = function() {
		var syncAction = this.processLoading(oFF.SyncType.BLOCKING, null, null);
		return syncAction.getData();
	};
	oFF.XHttpFile.prototype.loadGzipped = oFF.noSupport;
	oFF.XHttpFile.prototype.processLoading = function(syncType, listener,
			customIdentifier) {
		return oFF.XHttpFileLoadAction.createAndRun(syncType, this, listener,
				customIdentifier);
	};
	oFF.XHttpFile.prototype.getChildren = function() {
		var children = oFF.XList.create();
		var extResponse;
		var session;
		var fileList;
		var i;
		var fileStructure;
		var name;
		var childUri;
		var childFile;
		if (oFF.isNull(this.m_directoryInfo)) {
			extResponse = oFF.XHttpFileDirAction.createAndRun(
					oFF.SyncType.BLOCKING, this, null, null, false);
			this.addAllMessages(extResponse);
		} else {
			session = this.getSession();
			fileList = this.m_directoryInfo.getListByKey("Files");
			for (i = 0; i < fileList.size(); i++) {
				fileStructure = fileList.getStructureAt(i);
				name = fileStructure.getStringByKey("Name");
				childUri = oFF.XUri.createFromUriWithParent(name, this.m_uri,
						false);
				childFile = oFF.XHttpFile._create(session, childUri);
				children.add(childFile);
			}
		}
		return children;
	};
	oFF.XHttpFile.prototype.createFileList = function() {
		var children = oFF.XList.create();
		var session;
		var fileList;
		var i;
		var fileStructure;
		var name;
		var type;
		var childUri;
		if (oFF.notNull(this.m_directoryInfo)) {
			session = this.getSession();
			fileList = this.m_directoryInfo.getListByKey("Files");
			for (i = 0; i < fileList.size(); i++) {
				fileStructure = fileList.getStructureAt(i);
				name = fileStructure.getStringByKey("Name");
				type = fileStructure.getStringByKeyExt("Type", "File");
				if (oFF.XString.isEqual("Dir", type)) {
					childUri = oFF.XUri.createFromUriWithParent(
							oFF.XStringUtils.concatenate2(name, "/"),
							this.m_uri, false);
				} else {
					childUri = oFF.XUri.createFromUriWithParent(name,
							this.m_uri, false);
				}
				children.add(oFF.XHttpFile._create(session, childUri));
			}
		}
		return children;
	};
	oFF.XHttpFile.prototype.processChildFetch = function(syncType, listener,
			customIdentifier) {
		return oFF.XHttpFileDirAction.createAndRun(syncType, this, listener,
				customIdentifier, true);
	};
	oFF.XHttpFile.prototype.getChildSetState = function() {
		if (this.isFile()) {
			return oFF.ChildSetState.COMPLETE;
		}
		if (oFF.notNull(this.m_directoryInfo)) {
			return oFF.ChildSetState.COMPLETE;
		}
		return oFF.ChildSetState.INITIAL;
	};
	oFF.XHttpFile.prototype.getText = function() {
		return this.getName();
	};
	oFF.XHttpFile.prototype.getName = function() {
		var path = this.m_uri.getPath();
		var endSlash;
		if (oFF.XString.endsWith(path, "/")) {
			if (oFF.XString.size(path) === 1) {
				return "/";
			}
			path = oFF.XStringUtils.stripRight(path, 1);
		}
		endSlash = oFF.XString.lastIndexOf(path, "/");
		return oFF.XString.substring(path, endSlash + 1, -1);
	};
	oFF.XHttpFile.prototype.isDirectory = function() {
		return oFF.XString.endsWith(this.m_uri.getPath(), "/");
	};
	oFF.XHttpFile.prototype.isFile = function() {
		return !this.isDirectory();
	};
	oFF.XHttpFile.prototype.getNormalizedPath = function() {
		return this.m_uri.toString();
	};
	oFF.XHttpFile.prototype.getNativePath = function() {
		return this.m_uri.toString();
	};
	oFF.XHttpFile.prototype.getPathElements = oFF.noSupport;
	oFF.XHttpFile.prototype.mkdir = oFF.noSupport;
	oFF.XHttpFile.prototype.mkdirs = oFF.noSupport;
	oFF.XHttpFile.prototype.getChildElements = function() {
		return oFF.XReadOnlyListWrapper.create(this.getChildren());
	};
	oFF.XHttpFile.prototype.hasChildren = function() {
		return true;
	};
	oFF.XHttpFile.prototype.createSibling = oFF.noSupport;
	oFF.XHttpFile.prototype.getParentPath = oFF.noSupport;
	oFF.XHttpFile.prototype.getParent = function() {
		var path = this.m_uri.getPath();
		var parentSlash = oFF.XString.lastIndexOf(path, "/");
		var parentPath;
		var newUri;
		var parentFile;
		if (parentSlash === -1) {
			return null;
		}
		parentPath = oFF.XString.substring(path, 0, parentSlash + 1);
		newUri = oFF.XUri.createFromOther(this.m_uri);
		newUri.setPath(parentPath);
		parentFile = oFF.XHttpFile._create(this.getSession(), newUri);
		return parentFile;
	};
	oFF.XHttpFile.prototype.createChild = function(relativePath) {
		var newUri = oFF.XUri.createFromUriWithParent(relativePath, this.m_uri,
				false);
		var childFile = oFF.XHttpFile._create(this.getSession(), newUri);
		return childFile;
	};
	oFF.XHttpFile.prototype.supportsSetLastModified = function() {
		return false;
	};
	oFF.XHttpFile.prototype.isWriteable = oFF.noSupport;
	oFF.XHttpFile.prototype.setWritable = oFF.noSupport;
	oFF.XHttpFile.prototype.isReadable = oFF.noSupport;
	oFF.XHttpFile.prototype.isExecutable = oFF.noSupport;
	oFF.XHttpFile.prototype.save = oFF.noSupport;
	oFF.XHttpFile.prototype.saveGzipped = oFF.noSupport;
	oFF.XHttpFile.prototype.deleteFile = oFF.noSupport;
	oFF.XHttpFile.prototype.supportsRenameTo = function() {
		return false;
	};
	oFF.XHttpFile.prototype.renameTo = oFF.noSupport;
	oFF.XHttpFile.prototype.getLastModifiedTimestamp = oFF.noSupport;
	oFF.XHttpFile.prototype.getFileSystemType = function() {
		return oFF.XFileSystemType.SIMPLE_WEB;
	};
	oFF.XHttpFile.prototype.rename = oFF.noSupport;
	oFF.XHttpFile.prototype.isLeaf = function() {
		return !this.isNode();
	};
	oFF.XHttpFile.prototype.isNode = function() {
		return this.isDirectory();
	};
	oFF.XHttpFile.prototype.getComponentType = function() {
		return oFF.IoComponentType.FILE;
	};
	oFF.XHttpFile.prototype.getTagValue = function(tagName) {
		return null;
	};
	oFF.XHttpFile.prototype.getContentElement = function() {
		return this;
	};
	oFF.XHttpFile.prototype.getContentConstant = function() {
		return null;
	};
	oFF.XHttpFile.prototype.isExisting = function() {
		return true;
	};
	oFF.XHttpFile.prototype.isHidden = function() {
		return false;
	};
	oFF.XHttpFile.prototype.getDirectoryInfo = function() {
		return this.m_directoryInfo;
	};
	oFF.XHttpFile.prototype.setDirectoryInfo = function(directoryInfo) {
		this.m_directoryInfo = directoryInfo;
	};
	oFF.XHttpFileDirAction = function() {
	};
	oFF.XHttpFileDirAction.prototype = new oFF.SyncAction();
	oFF.XHttpFileDirAction.createAndRun = function(syncType, context, listener,
			customIdentifier, setData) {
		var object = new oFF.XHttpFileDirAction();
		object.m_setData = setData;
		object.setupActionAndRun(syncType, context, listener, customIdentifier);
		return object;
	};
	oFF.XHttpFileDirAction.prototype.m_setData = false;
	oFF.XHttpFileDirAction.prototype.processSynchronization = function(syncType) {
		var context = this.getActionContext();
		var dirUri;
		var path;
		var request;
		var httpClient;
		if (context.getDirectoryInfo() === null) {
			dirUri = oFF.XUri.createFromOther(context.getUri());
			path = dirUri.getPath();
			oFF.XBooleanUtils.checkTrue(oFF.XString.endsWith(path, "/"),
					"Uri does not denote a directory");
			dirUri.setPath(oFF.XStringUtils.concatenate2(path, ".index.json"));
			request = oFF.HttpRequest.createByUri(dirUri);
			httpClient = request.newHttpClient(this.getSession());
			httpClient.processHttpRequest(syncType, this, null);
			return true;
		}
		this.prepareData();
		return false;
	};
	oFF.XHttpFileDirAction.prototype.onHttpResponse = function(extResult,
			response, customIdentifier) {
		var jsonContent;
		this.addAllMessages(extResult);
		if (extResult.isValid()) {
			if (oFF.HttpStatusCode.isOk(response.getStatusCode())) {
				jsonContent = response.getJsonContent();
				if (oFF.notNull(jsonContent) && jsonContent.isStructure()) {
					this.getActionContext().setDirectoryInfo(jsonContent);
					this.prepareData();
				} else {
					this.addErrorExt(oFF.OriginLayer.IOLAYER,
							oFF.ErrorCodes.SYSTEM_IO, "Missing json content",
							null);
				}
			} else {
				this.addErrorExt(oFF.OriginLayer.IOLAYER,
						oFF.ErrorCodes.SYSTEM_IO_HTTP, response
								.getStatusCodeDetails(), null);
			}
		}
		this.endSync();
	};
	oFF.XHttpFileDirAction.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		var children = null;
		if (oFF.notNull(data)) {
			children = data.getChildren();
		}
		listener.onChildFetched(this, data, children, customIdentifier);
	};
	oFF.XHttpFileDirAction.prototype.prepareData = function() {
		var context;
		var children;
		var list;
		var i;
		var data;
		if (this.m_setData) {
			context = this.getActionContext();
			children = context.createFileList();
			list = oFF.XList.create();
			for (i = 0; i < children.size(); i++) {
				list.add(children.get(i));
			}
			data = oFF.XHierarchyResult.create(context, list);
			this.setData(data);
		}
	};
	oFF.XHttpFileLoadAction = function() {
	};
	oFF.XHttpFileLoadAction.prototype = new oFF.SyncAction();
	oFF.XHttpFileLoadAction.createAndRun = function(syncType, context,
			listener, customIdentifier) {
		var object = new oFF.XHttpFileLoadAction();
		object.setupActionAndRun(syncType, context, listener, customIdentifier);
		return object;
	};
	oFF.XHttpFileLoadAction.prototype.processSynchronization = function(
			syncType) {
		var uri = this.getActionContext().getUri();
		var request = oFF.HttpRequest.createByUri(uri);
		var httpClient = request.newHttpClient(this.getSession());
		httpClient.processHttpRequest(syncType, this, null);
		return true;
	};
	oFF.XHttpFileLoadAction.prototype.onHttpResponse = function(extResult,
			response, customIdentifier) {
		this.addAllMessages(extResult);
		if (extResult.isValid()) {
			if (oFF.HttpStatusCode.isOk(response.getStatusCode())) {
				this.setData(response);
			} else {
				this.addErrorExt(oFF.OriginLayer.IOLAYER,
						oFF.ErrorCodes.SYSTEM_IO_HTTP, response
								.getStatusCodeDetails(), null);
			}
		}
		this.endSync();
	};
	oFF.XHttpFileLoadAction.prototype.callListener = function(extResult,
			listener, data, customIdentifier) {
		listener.onFileLoaded(this, data, customIdentifier);
	};
	oFF.JsonParserGeneric = function() {
	};
	oFF.JsonParserGeneric.prototype = new oFF.DfDocumentParser();
	oFF.JsonParserGeneric.create = function() {
		var object = new oFF.JsonParserGeneric();
		object.setupParser(null, false);
		return object;
	};
	oFF.JsonParserGeneric.createEmbedded = function(source) {
		var object = new oFF.JsonParserGeneric();
		object.setupParser(source, true);
		return object;
	};
	oFF.JsonParserGeneric.prototype.m_source = null;
	oFF.JsonParserGeneric.prototype.m_isEmbedded = false;
	oFF.JsonParserGeneric.prototype.m_stringDelimiter = 0;
	oFF.JsonParserGeneric.prototype.m_rootElement = null;
	oFF.JsonParserGeneric.prototype.m_elementStack = null;
	oFF.JsonParserGeneric.prototype.m_currentStackIndex = 0;
	oFF.JsonParserGeneric.prototype.m_pos = 0;
	oFF.JsonParserGeneric.prototype.m_isInsideString = false;
	oFF.JsonParserGeneric.prototype.m_isInsideVariable = false;
	oFF.JsonParserGeneric.prototype.m_isInsideEscape = false;
	oFF.JsonParserGeneric.prototype.m_isInsideNumber = false;
	oFF.JsonParserGeneric.prototype.m_isInsideDoubleNumber = false;
	oFF.JsonParserGeneric.prototype.m_isInsideUnicode = false;
	oFF.JsonParserGeneric.prototype.m_unicodePos = 0;
	oFF.JsonParserGeneric.prototype.m_stringStartPos = 0;
	oFF.JsonParserGeneric.prototype.m_escapedString = null;
	oFF.JsonParserGeneric.prototype.m_numberStartPos = 0;
	oFF.JsonParserGeneric.prototype.m_structureDepth = 0;
	oFF.JsonParserGeneric.prototype.setupParser = function(source, isEmbedded) {
		this.setupSessionContext(null);
		this.m_isEmbedded = isEmbedded;
		if (this.m_isEmbedded) {
			this.m_stringDelimiter = 39;
		} else {
			this.m_stringDelimiter = 34;
		}
		if (oFF.notNull(source)) {
			this.resetParsing(source);
		}
	};
	oFF.JsonParserGeneric.prototype.releaseObject = function() {
		oFF.DfDocumentParser.prototype.releaseObject.call(this);
		this.resetParsing(null);
	};
	oFF.JsonParserGeneric.prototype.resetParsing = function(source) {
		this.m_rootElement = null;
		this.m_elementStack = oFF.XCollectionUtils
				.releaseEntriesAndCollectionIfNotNull(this.m_elementStack);
		if (oFF.notNull(source)) {
			this.m_elementStack = oFF.XList.create();
		}
		this.m_currentStackIndex = -1;
		this.m_pos = 0;
		this.m_isInsideString = false;
		this.m_isInsideVariable = false;
		this.m_isInsideEscape = false;
		this.m_isInsideNumber = false;
		this.m_isInsideDoubleNumber = false;
		this.m_isInsideUnicode = false;
		this.m_unicodePos = 0;
		this.m_stringStartPos = 0;
		this.m_escapedString = oFF.XObjectExt.release(this.m_escapedString);
		this.m_numberStartPos = 0;
		this.m_structureDepth = 0;
		this.m_source = source;
	};
	oFF.JsonParserGeneric.prototype.parse = function(content) {
		this.resetParsing(content);
		if (oFF.notNull(content)) {
			if (this.runWalker()) {
				return this.m_rootElement;
			}
		}
		return null;
	};
	oFF.JsonParserGeneric.prototype.enterStructure = function() {
		return this.enter(oFF.PrFactory.createStructure());
	};
	oFF.JsonParserGeneric.prototype.raiseWrongCommaError = function() {
		this
				.raiseError("Object properties and array items must be separated by single comma.");
	};
	oFF.JsonParserGeneric.prototype.leaveStructure = function() {
		var topStackElement = this.getTopStackElement();
		if (!topStackElement.finishElements()) {
			this.raiseWrongCommaError();
			return false;
		}
		this.m_currentStackIndex--;
		return true;
	};
	oFF.JsonParserGeneric.prototype.enterArray = function() {
		return this.enter(oFF.PrFactory.createList());
	};
	oFF.JsonParserGeneric.prototype.leaveArray = function() {
		var topStackElement = this.getTopStackElement();
		if (!topStackElement.finishElements()) {
			this.raiseWrongCommaError();
			return false;
		}
		this.m_currentStackIndex--;
		return true;
	};
	oFF.JsonParserGeneric.prototype.checkStructure = function(jsonStackElement) {
		if (!jsonStackElement.isNameSet()) {
			this.raiseError("Name in structure is not set");
			return false;
		}
		if (jsonStackElement.isValueSet()) {
			this.raiseError("Value in structure is already set");
			return false;
		}
		jsonStackElement.setValueSet(true);
		return true;
	};
	oFF.JsonParserGeneric.prototype.checkList = function(jsonStackElement) {
		if (jsonStackElement.isNameSet()) {
			this.raiseError("Name cannot be set in list");
			return false;
		}
		if (jsonStackElement.isValueSet()) {
			this.raiseError("Value in list is already set");
			return false;
		}
		jsonStackElement.setValueSet(true);
		return true;
	};
	oFF.JsonParserGeneric.prototype.enter = function(nextElement) {
		var jsonStackElement;
		var element;
		var type;
		var name;
		var structure;
		var list;
		var nextStackElement;
		if (this.m_currentStackIndex === -1) {
			this.m_rootElement = nextElement;
		} else {
			jsonStackElement = this.getTopStackElement();
			if (!jsonStackElement.addElement()) {
				this.raiseWrongCommaError();
				return false;
			}
			element = jsonStackElement.getElement();
			type = element.getType();
			if (type === oFF.PrElementType.STRUCTURE) {
				if (!this.checkStructure(jsonStackElement)) {
					return false;
				}
				name = jsonStackElement.getName();
				structure = element;
				structure.put(name, nextElement);
			} else {
				if (type === oFF.PrElementType.LIST) {
					if (!this.checkList(jsonStackElement)) {
						return false;
					}
					list = element;
					list.add(nextElement);
				} else {
					this.raiseError("Illegal type");
					return false;
				}
			}
		}
		if (this.m_currentStackIndex === this.m_elementStack.size() - 1) {
			nextStackElement = oFF.JsonParserGenericStackElement.create();
			this.m_elementStack.add(nextStackElement);
		} else {
			nextStackElement = this.m_elementStack
					.get(this.m_currentStackIndex + 1);
			nextStackElement.reset();
		}
		nextStackElement.setElement(nextElement);
		this.m_currentStackIndex++;
		return true;
	};
	oFF.JsonParserGeneric.prototype.setVariable = function(value) {
		var newElement = null;
		var isKey = false;
		var jsonStackElement;
		var element;
		var type;
		var name;
		var structure;
		var list;
		if (oFF.XString.isEqual("true", value)) {
			newElement = oFF.PrFactory.createBoolean(true);
			isKey = true;
		} else {
			if (oFF.XString.isEqual("false", value)) {
				newElement = oFF.PrFactory.createBoolean(false);
				isKey = true;
			} else {
				if (oFF.XString.isEqual("null", value)) {
					isKey = true;
				}
			}
		}
		if (!isKey) {
			if (this.m_isEmbedded) {
				return this.setString(value);
			}
			this.raiseError(oFF.XStringUtils.concatenate2("Unknown value: ",
					value));
			return false;
		}
		jsonStackElement = this.getTopStackElement();
		if (!jsonStackElement.addElement()) {
			this.raiseWrongCommaError();
			return false;
		}
		element = jsonStackElement.getElement();
		type = element.getType();
		if (type === oFF.PrElementType.STRUCTURE) {
			if (!this.checkStructure(jsonStackElement)) {
				return false;
			}
			name = jsonStackElement.getName();
			structure = element;
			structure.put(name, newElement);
		} else {
			if (type === oFF.PrElementType.LIST) {
				if (!this.checkList(jsonStackElement)) {
					return false;
				}
				list = element;
				list.add(newElement);
			} else {
				this.raiseError("Illegal type");
				return false;
			}
		}
		return true;
	};
	oFF.JsonParserGeneric.prototype.setString = function(value) {
		var jsonStackElement = this.getTopStackElement();
		var element = jsonStackElement.getElement();
		var type = element.getType();
		var name;
		var structure;
		var list;
		if (type === oFF.PrElementType.STRUCTURE) {
			if (!jsonStackElement.isNameSet()) {
				if (jsonStackElement.isValueSet()) {
					this.raiseError("Name in structure is not set");
					return false;
				}
				jsonStackElement.setName(value);
			} else {
				if (jsonStackElement.addElement() === false) {
					this.raiseWrongCommaError();
					return false;
				}
				if (this.checkStructure(jsonStackElement) === false) {
					return false;
				}
				name = jsonStackElement.getName();
				structure = element;
				structure.putString(name, value);
			}
		} else {
			if (type === oFF.PrElementType.LIST) {
				if (jsonStackElement.addElement() === false) {
					return false;
				}
				if (this.checkList(jsonStackElement) === false) {
					return false;
				}
				list = element;
				list.add(oFF.PrString.createWithValue(value));
			} else {
				this.raiseError("Illegal type");
				return false;
			}
		}
		return true;
	};
	oFF.JsonParserGeneric.prototype.leaveString = function() {
		return true;
	};
	oFF.JsonParserGeneric.prototype.enterNumber = function() {
		return true;
	};
	oFF.JsonParserGeneric.prototype.leaveNumber = function() {
		return true;
	};
	oFF.JsonParserGeneric.prototype.setDouble = function(value) {
		var jsonStackElement = this.getTopStackElement();
		var element;
		var type;
		var name;
		var structure;
		var list;
		if (jsonStackElement.addElement() === false) {
			this.raiseWrongCommaError();
			return false;
		}
		element = jsonStackElement.getElement();
		type = element.getType();
		if (type === oFF.PrElementType.STRUCTURE) {
			if (this.checkStructure(jsonStackElement) === false) {
				return false;
			}
			name = jsonStackElement.getName();
			structure = element;
			structure.putDouble(name, value);
		} else {
			if (type === oFF.PrElementType.LIST) {
				if (this.checkList(jsonStackElement) === false) {
					return false;
				}
				list = element;
				list.add(oFF.PrDouble.createWithValue(value));
			} else {
				this.raiseError("Illegal type");
				return false;
			}
		}
		return true;
	};
	oFF.JsonParserGeneric.prototype.setInteger = function(value) {
		var jsonStackElement = this.getTopStackElement();
		var element;
		var type;
		var name;
		var structure;
		var list;
		if (jsonStackElement.addElement() === false) {
			this.raiseWrongCommaError();
			return false;
		}
		element = jsonStackElement.getElement();
		type = element.getType();
		if (type === oFF.PrElementType.STRUCTURE) {
			if (this.checkStructure(jsonStackElement) === false) {
				return false;
			}
			name = jsonStackElement.getName();
			structure = element;
			structure.putInteger(name, value);
		} else {
			if (type === oFF.PrElementType.LIST) {
				if (this.checkList(jsonStackElement) === false) {
					return false;
				}
				list = element;
				list.add(oFF.PrFactory.createInteger(value));
			} else {
				this.raiseError("Illegal type");
				return false;
			}
		}
		return true;
	};
	oFF.JsonParserGeneric.prototype.setLong = function(value) {
		var jsonStackElement = this.getTopStackElement();
		var element;
		var type;
		var name;
		var structure;
		var list;
		if (jsonStackElement.addElement() === false) {
			this.raiseWrongCommaError();
			return false;
		}
		element = jsonStackElement.getElement();
		type = element.getType();
		if (type === oFF.PrElementType.STRUCTURE) {
			if (this.checkStructure(jsonStackElement) === false) {
				return false;
			}
			name = jsonStackElement.getName();
			structure = element;
			structure.putLong(name, value);
		} else {
			if (type === oFF.PrElementType.LIST) {
				if (this.checkList(jsonStackElement) === false) {
					return false;
				}
				list = element;
				list.add(oFF.PrLong.createWithValue(value));
			} else {
				this.raiseError("Illegal type");
				return false;
			}
		}
		return true;
	};
	oFF.JsonParserGeneric.prototype.enterValueZone = function() {
		return true;
	};
	oFF.JsonParserGeneric.prototype.nextItem = function() {
		var jsonStackElement = this.getTopStackElement();
		jsonStackElement.setName(null);
		jsonStackElement.setValueSet(false);
		if (jsonStackElement.nextElement() === false) {
			this.raiseWrongCommaError();
			return false;
		}
		return true;
	};
	oFF.JsonParserGeneric.prototype.getTopStackElement = function() {
		return this.m_elementStack.get(this.m_currentStackIndex);
	};
	oFF.JsonParserGeneric.prototype.getRootElement = function() {
		return this.m_rootElement;
	};
	oFF.JsonParserGeneric.prototype.endParsing = function() {
		this.m_escapedString = oFF.XObjectExt.release(this.m_escapedString);
		if (this.m_currentStackIndex === -1) {
			return true;
		}
		this.addParserError(oFF.JsonParserErrorCode.JSON_PARSER_ILLEGAL_STATE,
				"Json does not close correctly");
		return false;
	};
	oFF.JsonParserGeneric.prototype.runWalker = function() {
		var len = oFF.XString.size(this.m_source);
		var c;
		var isValid = true;
		var pos;
		for (pos = 0; pos < len && isValid;) {
			c = oFF.XString.getCharAt(this.m_source, pos);
			if (pos === 0 && c === 65279) {
				pos++;
			} else {
				isValid = this.parseSingleCharacter(c, pos);
				pos++;
			}
		}
		if (isValid) {
			this.endParsing();
		}
		return isValid;
	};
	oFF.JsonParserGeneric.prototype.unicode4 = function(pos) {
		var value = oFF.XString.substring(this.m_source, pos - 3, pos + 1);
		try {
			var intValue = oFF.XInteger.convertFromStringWithRadix(value, 16);
			this.m_escapedString.appendChar(intValue);
		} catch (nfe3) {
			this.addParserError(
					oFF.JsonParserErrorCode.JSON_PARSER_ILLEGAL_STATE,
					oFF.XException.getStackTrace(nfe3, 0));
			return false;
		}
		this.m_isInsideUnicode = false;
		this.m_isInsideEscape = false;
		this.m_stringStartPos = pos + 1;
		return true;
	};
	oFF.JsonParserGeneric.prototype.escapedString = function(c, pos) {
		if (c === 114) {
			this.m_escapedString.append("\r");
		} else {
			if (c === 110) {
				this.m_escapedString.append("\n");
			} else {
				if (c === 116) {
					this.m_escapedString.append("\t");
				} else {
					if (c === 102) {
						this.m_escapedString.append("\f");
					} else {
						if (c === 98) {
							this.m_escapedString.append("\b");
						} else {
							if (c === 34) {
								this.m_escapedString.append('"');
							} else {
								if (c === 92) {
									this.m_escapedString.append("\\");
								} else {
									if (c === 47) {
										this.m_escapedString.append("/");
									} else {
										this
												.addParserError(
														oFF.JsonParserErrorCode.JSON_PARSER_ILLEGAL_STATE,
														"Parser Error");
										return false;
									}
								}
							}
						}
					}
				}
			}
		}
		this.m_isInsideEscape = false;
		this.m_stringStartPos = pos + 1;
		return true;
	};
	oFF.JsonParserGeneric.prototype.parseSingleCharacter = function(c, pos) {
		var value;
		var placeHolder = true;
		this.m_pos = pos;
		while (true) {
			if (this.m_isInsideString) {
				if (this.m_isInsideEscape) {
					if (this.m_isInsideUnicode) {
						this.m_unicodePos++;
						if (this.m_unicodePos === 4) {
							if (this.unicode4(pos) === false) {
								return false;
							}
						}
					} else {
						if (c === 117) {
							this.m_isInsideUnicode = true;
							this.m_unicodePos = 0;
						} else {
							if (this.escapedString(c, pos) === false) {
								return false;
							}
						}
					}
				} else {
					if (c === this.m_stringDelimiter) {
						if (this.insideString(pos) === false) {
							return false;
						}
					} else {
						if (c === 92) {
							this.enterEscapedString(pos);
						}
					}
				}
			} else {
				if (this.m_isInsideNumber) {
					if (c >= 48 && c <= 57 || c === 43 || c === 45) {
						placeHolder = true;
					} else {
						if (c === 46 || c === 101 || c === 69) {
							this.m_isInsideDoubleNumber = true;
						} else {
							value = oFF.XString.substring(this.m_source,
									this.m_numberStartPos, pos);
							if (this.m_isInsideDoubleNumber) {
								if (this.insideDouble(value) === false) {
									return false;
								}
							} else {
								if (this.insideInt(value) === false) {
									return false;
								}
							}
							this.m_isInsideNumber = false;
							this.m_isInsideDoubleNumber = false;
							if (this.leaveNumber() === false) {
								return false;
							}
							continue;
						}
					}
				} else {
					if (this.m_isInsideVariable) {
						if (c === 58 || c === 123 || c === 125 || c === 91
								|| c === 93 || c === 44 || c === 9 || c === 13
								|| c === 10 || c === 32) {
							value = oFF.XString.substring(this.m_source,
									this.m_stringStartPos, pos);
							if (this.setVariable(value) === false) {
								return false;
							}
							this.m_isInsideVariable = false;
							continue;
						}
					} else {
						if (c >= 48 && c <= 57 || c === 45) {
							if (this.enterNumber() === false) {
								return false;
							}
							this.m_isInsideNumber = true;
							this.m_numberStartPos = pos;
						} else {
							if (c === 46) {
								if (this.enterNumber() === false) {
									return false;
								}
								this.m_isInsideNumber = true;
								this.m_isInsideDoubleNumber = true;
								this.m_numberStartPos = pos;
							} else {
								if (c === 123) {
									if (this.enterStructure() === false) {
										return false;
									}
									this.m_structureDepth++;
								} else {
									if (c === 125) {
										if (this.leaveStructure() === false) {
											return false;
										}
										this.m_structureDepth--;
									} else {
										if (c === 91) {
											if (this.enterArray() === false) {
												return false;
											}
										} else {
											if (c === 93) {
												if (this.leaveArray() === false) {
													return false;
												}
											} else {
												if (c === 58) {
													if (this.enterValueZone() === false) {
														return false;
													}
												} else {
													if (c === 44) {
														if (this.nextItem() === false) {
															return false;
														}
													} else {
														if (c === 32 || c === 9
																|| c === 10
																|| c === 13) {
															placeHolder = true;
														} else {
															if (c === this.m_stringDelimiter) {
																this.m_isInsideString = true;
																this.m_stringStartPos = pos + 1;
															} else {
																this.m_isInsideVariable = true;
																this.m_stringStartPos = pos;
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
			break;
		}
		return placeHolder;
	};
	oFF.JsonParserGeneric.prototype.enterEscapedString = function(pos) {
		var value;
		this.m_isInsideEscape = true;
		if (oFF.isNull(this.m_escapedString)) {
			this.m_escapedString = oFF.XStringBuffer.create();
		}
		value = oFF.XString
				.substring(this.m_source, this.m_stringStartPos, pos);
		this.m_escapedString.append(value);
	};
	oFF.JsonParserGeneric.prototype.insideInt = function(value) {
		var intValue;
		var longValue;
		try {
			var isInt = true;
			var leni = oFF.XString.size(value);
			var minus = oFF.XString.getCharAt(value, 0);
			if (minus === 45) {
				isInt = leni <= 10;
			} else {
				isInt = leni <= 9;
			}
			if (isInt) {
				intValue = oFF.XInteger.convertFromString(value);
				if (this.setInteger(intValue) === false) {
					return false;
				}
			} else {
				longValue = oFF.XLong.convertFromString(value);
				if (this.setLong(longValue) === false) {
					return false;
				}
			}
		} catch (nfe2) {
			this.addParserError(
					oFF.JsonParserErrorCode.JSON_PARSER_ILLEGAL_STATE,
					oFF.XException.getStackTrace(nfe2, 0));
			return false;
		}
		return true;
	};
	oFF.JsonParserGeneric.prototype.insideDouble = function(value) {
		try {
			var doubleValue = oFF.XDouble.convertFromString(value);
			if (!this.setDouble(doubleValue)) {
				return false;
			}
		} catch (nfe) {
			this.addParserError(
					oFF.JsonParserErrorCode.JSON_PARSER_ILLEGAL_STATE,
					oFF.XException.getStackTrace(nfe, 0));
			return false;
		}
		return true;
	};
	oFF.JsonParserGeneric.prototype.insideString = function(pos) {
		var value = oFF.XString.substring(this.m_source, this.m_stringStartPos,
				pos);
		if (oFF.notNull(this.m_escapedString)) {
			this.m_escapedString.append(value);
			value = this.m_escapedString.toString();
			this.m_escapedString = oFF.XObjectExt.release(this.m_escapedString);
		}
		if (!this.setString(value)) {
			return false;
		}
		if (!this.leaveString()) {
			return false;
		}
		this.m_isInsideString = false;
		return true;
	};
	oFF.JsonParserGeneric.prototype.addParserError = function(code, message) {
		var start = this.m_pos - 10;
		var end;
		var errorValue;
		var buffer;
		var messageExt;
		if (start < 0) {
			start = 0;
		}
		end = this.m_pos + 10;
		if (end > oFF.XString.size(this.m_source)) {
			end = oFF.XString.size(this.m_source);
		}
		errorValue = oFF.XString.substring(this.m_source, start, end);
		buffer = oFF.XStringBuffer.create();
		buffer.append("Json Parser Error at position ");
		buffer.appendInt(this.m_pos).append(": ").appendLine(message);
		buffer.append("...").append(errorValue).append("...");
		messageExt = buffer.toString();
		return oFF.DfDocumentParser.prototype.addErrorExt.call(this,
				oFF.OriginLayer.IOLAYER, code, messageExt, null);
	};
	oFF.JsonParserGeneric.prototype.raiseError = function(errorText) {
		this.addParserError(oFF.JsonParserErrorCode.JSON_PARSER_ILLEGAL_STATE,
				errorText);
	};
	oFF.JsonParserGeneric.prototype.isEmbeddedParsingFinished = function() {
		return this.m_structureDepth === 0;
	};
	oFF.XUri = function() {
	};
	oFF.XUri.prototype = new oFF.XConnection();
	oFF.XUri.SCHEME_SEPARATOR = ":";
	oFF.XUri.AUTHORITY_SEPARATOR = "//";
	oFF.XUri.PORT_SEPARATOR = ":";
	oFF.XUri.PATH_SEPARATOR = "/";
	oFF.XUri.QUERY_SEPARATOR = "?";
	oFF.XUri.QUERY_AND = "&";
	oFF.XUri.QUERY_ASSIGN = "=";
	oFF.XUri.FRAGMENT_SEPARATOR = "#";
	oFF.XUri.FRAGMENT_QUERY_START = "!";
	oFF.XUri.USERINFO_SEPARATOR = "@";
	oFF.XUri.USER_PWD_SEPARATOR = ":";
	oFF.XUri.SAML_USER_PWD = "saml";
	oFF.XUri.SAML_CERT = "samlcert";
	oFF.XUri.SAML_KERB = "samlkerb";
	oFF.XUri.BASIC = "basic";
	oFF.XUri.ALIAS_SEPARATOR = ";";
	oFF.XUri.ALIAS_ASSIGN = "o=";
	oFF.XUri.create = function() {
		var uri = new oFF.XUri();
		uri.setup();
		return uri;
	};
	oFF.XUri.createFromConnection = function(connection) {
		var uri = oFF.XUri.create();
		uri.setFromConnection(connection);
		return uri;
	};
	oFF.XUri.createFromOther = function(otherUri) {
		var uri = oFF.XUri.create();
		uri.setFromUri(otherUri);
		return uri;
	};
	oFF.XUri.createFromUri = function(uriString) {
		return oFF.XUri.createFromUriWithParent(uriString, null, false);
	};
	oFF.XUri.merge = function(firstUri, secondUri, mergeQueries) {
		return oFF.XUri.createMerge(firstUri, secondUri, mergeQueries)
				.getUriString();
	};
	oFF.XUri.createMerge = function(firstUri, secondUri, mergeQueries) {
		var firstUriObj = oFF.XUri.createFromUri(firstUri);
		return oFF.XUri.createFromUriWithParent(secondUri, firstUriObj,
				mergeQueries);
	};
	oFF.XUri.createFromUriWithParent = function(uriString, parentUri,
			mergeQueries) {
		var uri = oFF.XUri.create();
		uri.setFromUriWithParent(uriString, parentUri, mergeQueries);
		return uri;
	};
	oFF.XUri.getMinimumPositive4 = function(a, b, c, d) {
		var min = oFF.XUri.getMinimumPositive2(a, b);
		min = oFF.XUri.getMinimumPositive2(min, c);
		min = oFF.XUri.getMinimumPositive2(min, d);
		return min;
	};
	oFF.XUri.getMinimumPositive3 = function(a, b, c) {
		var min = oFF.XUri.getMinimumPositive2(a, b);
		min = oFF.XUri.getMinimumPositive2(min, c);
		return min;
	};
	oFF.XUri.getMinimumPositive2 = function(a, b) {
		if (a < 0 && b < 0) {
			return -2;
		} else {
			if (a < 0) {
				return b;
			} else {
				if (b < 0) {
					return a;
				}
			}
		}
		return oFF.XMath.min(a, b);
	};
	oFF.XUri.createFromRelativePath = function(path, parentPath) {
		var buffer;
		var pathSepIndex;
		var parentDirectory;
		if (oFF.XString.startsWith(path, oFF.XUri.PATH_SEPARATOR)) {
			return path;
		}
		buffer = oFF.XStringBuffer.create();
		if (oFF.XString.endsWith(parentPath, oFF.XUri.PATH_SEPARATOR)) {
			buffer.append(parentPath);
		} else {
			pathSepIndex = oFF.XString.lastIndexOf(parentPath,
					oFF.XUri.PATH_SEPARATOR);
			parentDirectory = oFF.XString.substring(parentPath, 0,
					pathSepIndex + 1);
			buffer.append(parentDirectory);
		}
		buffer.append(path);
		return buffer.toString();
	};
	oFF.XUri.encodeQuerySimple = function(nameValuePairs) {
		var nameValuePairList = oFF.XList.create();
		var keys;
		var sortedKeys;
		var i;
		var key;
		var value;
		if (oFF.notNull(nameValuePairs)) {
			keys = nameValuePairs.getKeysAsReadOnlyListOfString();
			sortedKeys = oFF.XListOfString.createFromReadOnlyList(keys);
			sortedKeys.sortByDirection(oFF.XSortDirection.ASCENDING);
			for (i = 0; i < sortedKeys.size(); i++) {
				key = sortedKeys.get(i);
				value = nameValuePairs.getByKey(key);
				nameValuePairList.add(oFF.XNameValuePair.createWithValues(key,
						value));
			}
		}
		return oFF.XUri.encodeQuery(nameValuePairList);
	};
	oFF.XUri.decodeQuerySimple = function(query) {
		var nameValuePairs = oFF.XHashMapOfStringByString.create();
		var nameValuePairList;
		var i;
		var pair;
		if (oFF.notNull(query)) {
			nameValuePairList = oFF.XUri.decodeQuery(query);
			for (i = 0; i < nameValuePairList.size(); i++) {
				pair = nameValuePairList.get(i);
				nameValuePairs.put(pair.getName(), pair.getValue());
			}
		}
		return nameValuePairs;
	};
	oFF.XUri.encodeQuery = function(queryElements) {
		var httpBuffer;
		var i;
		var element;
		if (queryElements.isEmpty()) {
			return null;
		}
		httpBuffer = oFF.XStringBuffer.create();
		for (i = 0; i < queryElements.size(); i++) {
			element = queryElements.get(i);
			if (i > 0) {
				httpBuffer.append(oFF.XUri.QUERY_AND);
			}
			httpBuffer.append(oFF.XHttpUtils.encodeURIComponent(element
					.getName()));
			httpBuffer.append(oFF.XUri.QUERY_ASSIGN);
			httpBuffer.append(oFF.XHttpUtils.encodeURIComponent(element
					.getValue()));
		}
		return httpBuffer.toString();
	};
	oFF.XUri.decodeQuery = function(query) {
		var queryPairs = oFF.XList.create();
		var queryElements;
		var i;
		var element;
		var delimiter;
		var key;
		var value;
		if (oFF.XStringUtils.isNotNullAndNotEmpty(query)) {
			queryElements = oFF.XStringTokenizer.splitString(query,
					oFF.XUri.QUERY_AND);
			for (i = 0; i < queryElements.size(); i++) {
				element = queryElements.get(i);
				delimiter = oFF.XString.indexOf(element, oFF.XUri.QUERY_ASSIGN);
				if (delimiter === -1) {
					key = oFF.XHttpUtils.decodeURIComponent(element);
					value = "";
				} else {
					key = oFF.XString.substring(element, 0, delimiter);
					value = oFF.XString.substring(element, delimiter + 1, -1);
					key = oFF.XHttpUtils.decodeURIComponent(key);
					value = oFF.XHttpUtils.decodeURIComponent(value);
				}
				queryPairs.add(oFF.XNameValuePair.createWithValues(key, value));
			}
		}
		return queryPairs;
	};
	oFF.XUri.getUriStringStatic = function(connection, uri, withSchema,
			withUser, withPwd, withAuthenticationType, withHostPort, withPath,
			withQuery, withFragment) {
		var sb = oFF.XStringBuffer.create();
		var scheme;
		var hasUserPwdInfo;
		var authenticationType;
		var user;
		var pwd;
		var host;
		var protocolType;
		var port;
		var conPath;
		var conAlias;
		var path;
		var uriAlias;
		var query;
		var fragment;
		if (withSchema) {
			scheme = connection.getScheme();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(scheme)) {
				sb.append(scheme).append(oFF.XUri.SCHEME_SEPARATOR);
				if (oFF.notNull(uri)) {
					if (uri.supportsAuthority()) {
						sb.append(oFF.XUri.AUTHORITY_SEPARATOR);
					}
				} else {
					sb.append(oFF.XUri.AUTHORITY_SEPARATOR);
				}
			}
		}
		hasUserPwdInfo = 0;
		authenticationType = connection.getAuthenticationType();
		if (withUser || withPwd) {
			if (oFF.notNull(authenticationType)) {
				if (authenticationType.hasUserName()
						|| authenticationType.hasPassword()) {
					user = connection.getUser();
					pwd = connection.getPassword();
					if (oFF.XStringUtils.isNotNullAndNotEmpty(user) && withUser) {
						sb.append(oFF.XHttpUtils.encodeURIComponent(user));
						hasUserPwdInfo = 1;
					}
					if (oFF.XStringUtils.isNotNullAndNotEmpty(pwd) && withPwd) {
						sb.append(oFF.XUri.USER_PWD_SEPARATOR).append(
								oFF.XHttpUtils.encodeURIComponent(pwd));
						hasUserPwdInfo = 2;
					}
				}
			}
		}
		if (withAuthenticationType && oFF.notNull(authenticationType)) {
			if (authenticationType.isSaml()) {
				if (hasUserPwdInfo < 2) {
					sb.append(oFF.XUri.USER_PWD_SEPARATOR);
				}
				sb.append(oFF.XUri.USER_PWD_SEPARATOR);
				if (authenticationType === oFF.AuthenticationType.SAML_WITH_PASSWORD) {
					sb.append(oFF.XUri.SAML_USER_PWD);
				} else {
					if (authenticationType === oFF.AuthenticationType.SAML_WITH_CERTIFICATE) {
						sb.append(oFF.XUri.SAML_CERT);
					} else {
						if (authenticationType === oFF.AuthenticationType.SAML_WITH_KERBEROS) {
							sb.append(oFF.XUri.SAML_KERB);
						}
					}
				}
				hasUserPwdInfo = 3;
			}
		}
		if (hasUserPwdInfo > 0) {
			sb.append(oFF.XUri.USERINFO_SEPARATOR);
		}
		if (withHostPort) {
			host = connection.getHost();
			if (oFF.XStringUtils.isNotNullAndNotEmpty(host)) {
				sb.append(host);
				protocolType = connection.getProtocolType();
				port = connection.getPort();
				if (port > 0
						&& (port === 80
								&& protocolType === oFF.ProtocolType.HTTP || port === 443
								&& protocolType === oFF.ProtocolType.HTTPS) === false) {
					sb.append(oFF.XUri.PORT_SEPARATOR).appendInt(port);
				}
			}
		}
		if (oFF.isNull(uri)) {
			if (withPath) {
				conPath = connection.getPath();
				if (oFF.XStringUtils.isNotNullAndNotEmpty(conPath)) {
					sb.append(conPath);
					conAlias = connection.getAlias();
					if (oFF.XStringUtils.isNotNullAndNotEmpty(conAlias)) {
						sb.append(oFF.XUri.ALIAS_SEPARATOR).append(
								oFF.XUri.ALIAS_ASSIGN).append(conAlias);
					}
				}
			}
		} else {
			if (withPath) {
				path = uri.getPath();
				if (oFF.XStringUtils.isNotNullAndNotEmpty(path)) {
					sb.append(oFF.XUri.encodePath(path));
					uriAlias = uri.getAlias();
					if (oFF.XStringUtils.isNotNullAndNotEmpty(uriAlias)) {
						sb.append(oFF.XUri.ALIAS_SEPARATOR).append(
								oFF.XUri.ALIAS_ASSIGN).append(uriAlias);
					}
				}
			}
			if (withQuery) {
				query = uri.getQuery();
				if (oFF.XStringUtils.isNotNullAndNotEmpty(query)) {
					sb.append(oFF.XUri.QUERY_SEPARATOR).append(query);
				}
			}
			if (withFragment) {
				fragment = uri.getFragment();
				if (oFF.XStringUtils.isNotNullAndNotEmpty(fragment)) {
					sb.append(oFF.XUri.FRAGMENT_SEPARATOR).append(fragment);
				}
			}
		}
		return sb.toString();
	};
	oFF.XUri.encodePath = function(path) {
		var buffer = oFF.XStringBuffer.create();
		var startIndex = 0;
		var nextIndex;
		var size = oFF.XString.size(path);
		var fragment;
		while (true) {
			nextIndex = oFF.XUri.indexFrom(path, startIndex, size);
			fragment = oFF.XString.substring(path, startIndex, nextIndex);
			buffer.append(oFF.XHttpUtils.encodeURIComponent(fragment));
			if (nextIndex === -1) {
				break;
			}
			buffer.appendChar(oFF.XString.getCharAt(path, nextIndex));
			startIndex = nextIndex + 1;
		}
		return buffer.toString();
	};
	oFF.XUri.indexFrom = function(element, startIndex, size) {
		var i;
		var c;
		for (i = startIndex; i < size; i++) {
			c = oFF.XString.getCharAt(element, i);
			if (c === 33 || c === 36 || c === 39 || c === 40 || c === 41
					|| c === 42 || c === 43 || c === 44 || c === 47 || c === 61
					|| c === 91 || c === 93 || c === 126) {
				return i;
			}
		}
		return -1;
	};
	oFF.XUri.decodePath = function(path) {
		var buffer = oFF.XStringBuffer.create();
		var startIndex = 0;
		var nextIndex;
		var fragment;
		while (true) {
			nextIndex = oFF.XString.indexOfFrom(path, "+", startIndex);
			fragment = oFF.XString.substring(path, startIndex, nextIndex);
			buffer.append(oFF.XHttpUtils.decodeURIComponent(fragment));
			if (nextIndex === -1) {
				break;
			}
			buffer.append("+");
			startIndex = nextIndex + 1;
		}
		return buffer.toString();
	};
	oFF.XUri.prototype.m_queryPairs = null;
	oFF.XUri.prototype.m_fragment = null;
	oFF.XUri.prototype.m_fragmentQueryPairs = null;
	oFF.XUri.prototype.m_supportsAuthority = false;
	oFF.XUri.prototype.setup = function() {
		oFF.XConnection.prototype.setup.call(this);
		this.m_queryPairs = oFF.XList.create();
		this.m_supportsAuthority = true;
	};
	oFF.XUri.prototype.releaseObject = function() {
		this.m_queryPairs = oFF.XObjectExt.release(this.m_queryPairs);
		this.m_fragmentQueryPairs = oFF.XObjectExt
				.release(this.m_fragmentQueryPairs);
		this.m_fragment = null;
		oFF.XConnection.prototype.releaseObject.call(this);
	};
	oFF.XUri.prototype.setUriString = function(uriString) {
		this.setFromUriWithParent(uriString, null, false);
	};
	oFF.XUri.prototype.setFromConnection = function(connection) {
		oFF.XConnectHelper.copyConnection(connection, this);
	};
	oFF.XUri.prototype.setFromUri = function(uri) {
		oFF.XConnectHelper.copyUri(uri, this);
	};
	oFF.XUri.prototype.setFromUriWithParent = function(uriString, parentUri,
			mergeQueries) {
		var start;
		var size;
		var parentQuery;
		var isRelative;
		var schemaIndex;
		var pathCompIndex;
		var supportsAuthority;
		var scheme;
		var authorityIndex;
		var pathIndex;
		var querySeparator;
		var fragmentIndex;
		var min;
		var authIndex;
		var auth;
		var userPwdIndex;
		var user;
		var authType;
		var pwdEnd;
		var authTypeIndex;
		var pwd;
		var portIndex;
		var host;
		var port;
		var portValue;
		var protocolType;
		var defaultPort;
		var path;
		var decodedPath;
		var query;
		var existingQuery;
		var fragment;
		if (oFF.notNull(uriString)) {
			start = 0;
			size = oFF.XString.size(uriString);
			if (oFF.notNull(parentUri) && mergeQueries) {
				parentQuery = parentUri.getQuery();
				if (oFF.XStringUtils.isNotNullAndNotEmpty(parentQuery)) {
					this.setQuery(parentQuery);
				}
			}
			if (oFF.XStringUtils.isNotNullAndNotEmpty(uriString)) {
				isRelative = true;
				schemaIndex = oFF.XString.indexOf(uriString,
						oFF.XUri.SCHEME_SEPARATOR);
				pathCompIndex = oFF.XString.indexOf(uriString,
						oFF.XUri.PATH_SEPARATOR);
				supportsAuthority = false;
				if (schemaIndex > -1
						&& (pathCompIndex === -1 || pathCompIndex > schemaIndex)) {
					scheme = oFF.XString.substring(uriString, start,
							schemaIndex);
					start = schemaIndex + 1;
					if (oFF.XStringUtils.isNotNullAndNotEmpty(scheme)) {
						this.setScheme(scheme);
					}
					isRelative = false;
					authorityIndex = oFF.XString.indexOfFrom(uriString,
							oFF.XUri.AUTHORITY_SEPARATOR, start);
					if (authorityIndex === start) {
						supportsAuthority = true;
						start = start + 2;
					}
				}
				this.setSupportsAuthority(supportsAuthority);
				pathIndex = oFF.XString.indexOfFrom(uriString,
						oFF.XUri.PATH_SEPARATOR, start);
				querySeparator = oFF.XString.indexOfFrom(uriString,
						oFF.XUri.QUERY_SEPARATOR, start);
				fragmentIndex = oFF.XString.indexOfFrom(uriString,
						oFF.XUri.FRAGMENT_SEPARATOR, start);
				if (isRelative) {
					if (oFF.notNull(parentUri)) {
						this.setScheme(parentUri.getScheme());
						this
								.setSupportsAuthority(parentUri
										.supportsAuthority());
						this.setHost(parentUri.getHost());
						this.setPort(parentUri.getPort());
						this.setPath(parentUri.getPath());
					}
					if (start !== querySeparator && start !== fragmentIndex) {
						pathIndex = start;
					}
				} else {
					if (supportsAuthority) {
						authIndex = oFF.XString.indexOfFrom(uriString,
								oFF.XUri.USERINFO_SEPARATOR, start);
						min = oFF.XUri.getMinimumPositive4(authIndex,
								pathIndex, querySeparator, size);
						if (authIndex === min) {
							auth = oFF.XString.substring(uriString, start,
									authIndex);
							userPwdIndex = oFF.XString.indexOf(auth,
									oFF.XUri.USER_PWD_SEPARATOR);
							authType = null;
							if (userPwdIndex > -1) {
								user = oFF.XString.substring(auth, 0,
										userPwdIndex);
								pwdEnd = -1;
								authTypeIndex = oFF.XString.indexOfFrom(auth,
										oFF.XUri.USER_PWD_SEPARATOR,
										userPwdIndex + 1);
								if (authTypeIndex !== -1) {
									pwdEnd = authTypeIndex;
									authType = oFF.XString.substring(auth,
											authTypeIndex + 1, -1);
								}
								pwd = oFF.XString.substring(auth,
										userPwdIndex + 1, pwdEnd);
								pwd = oFF.XHttpUtils.decodeURIComponent(pwd);
								this.setPassword(pwd);
							} else {
								user = auth;
							}
							user = oFF.XHttpUtils.decodeURIComponent(user);
							this.setUser(user);
							if (oFF.XString.isEqual(oFF.XUri.SAML_USER_PWD,
									authType)) {
								this
										.setAuthenticationType(oFF.AuthenticationType.SAML_WITH_PASSWORD);
							} else {
								if (oFF.XString.isEqual(oFF.XUri.SAML_CERT,
										authType)) {
									this
											.setAuthenticationType(oFF.AuthenticationType.SAML_WITH_CERTIFICATE);
								} else {
									if (oFF.XString.isEqual(oFF.XUri.SAML_KERB,
											authType)) {
										this
												.setAuthenticationType(oFF.AuthenticationType.SAML_WITH_KERBEROS);
									} else {
										if (oFF.XString.isEqual(oFF.XUri.BASIC,
												authType)) {
											this
													.setAuthenticationType(oFF.AuthenticationType.BASIC);
										}
									}
								}
							}
							start = authIndex + 1;
							pathIndex = oFF.XString.indexOfFrom(uriString,
									oFF.XUri.PATH_SEPARATOR, start);
							querySeparator = oFF.XString.indexOfFrom(uriString,
									oFF.XUri.QUERY_SEPARATOR, start);
						}
						portIndex = oFF.XString.indexOfFrom(uriString,
								oFF.XUri.PORT_SEPARATOR, start);
						min = oFF.XUri.getMinimumPositive4(portIndex,
								pathIndex, querySeparator, size);
						host = oFF.XString.substring(uriString, start, min);
						start = min;
						if (oFF.XStringUtils.isNotNullAndNotEmpty(host)) {
							this.setHost(host);
						}
						if (portIndex === min) {
							min = oFF.XUri.getMinimumPositive3(pathIndex,
									querySeparator, size);
							port = oFF.XString.substring(uriString,
									portIndex + 1, min);
							start = min;
							if (oFF.XStringUtils.isNotNullAndNotEmpty(port)) {
								portValue = oFF.XInteger
										.convertFromStringWithDefault(port, 0);
								if (portValue > 0) {
									this.setPort(portValue);
								}
							}
						} else {
							protocolType = this.getProtocolType();
							if (oFF.notNull(protocolType)) {
								defaultPort = protocolType.getDefaultPort();
								if (defaultPort !== 0) {
									this.setPort(defaultPort);
								}
							}
						}
					} else {
						pathIndex = start;
					}
				}
				if (pathIndex === start) {
					min = oFF.XUri.getMinimumPositive3(querySeparator,
							fragmentIndex, size);
					path = oFF.XString.substring(uriString, start, min);
					start = min;
					if (oFF.XStringUtils.isNotNullAndNotEmpty(path)) {
						decodedPath = oFF.XUri.decodePath(path);
						if (isRelative
								&& oFF.notNull(parentUri)
								&& oFF.XStringUtils
										.isNotNullAndNotEmpty(parentUri
												.getPath())) {
							decodedPath = oFF.XUri.createFromRelativePath(
									decodedPath, parentUri.getPath());
						}
						this.setPath(decodedPath);
					}
				}
				if (querySeparator === start) {
					min = oFF.XUri.getMinimumPositive2(fragmentIndex, size);
					query = oFF.XString.substring(uriString, start + 1, min);
					start = min;
					if (oFF.XStringUtils.isNotNullAndNotEmpty(query)) {
						existingQuery = this.getQuery();
						if (isRelative
								&& mergeQueries
								&& oFF.XStringUtils
										.isNotNullAndNotEmpty(existingQuery)) {
							query = oFF.XStringUtils.concatenate3(
									existingQuery, oFF.XUri.QUERY_AND, query);
						}
						this.setQuery(query);
					}
				}
				if (fragmentIndex === start) {
					fragment = oFF.XString.substring(uriString, start + 1, -1);
					if (oFF.XStringUtils.isNotNullAndNotEmpty(fragment)) {
						this.setFragment(fragment);
					}
				}
			}
		}
	};
	oFF.XUri.prototype.getQuery = function() {
		return oFF.XUri.encodeQuery(this.getQueryElements());
	};
	oFF.XUri.prototype.setQuery = function(query) {
		this.m_queryPairs = oFF.XUri.decodeQuery(query);
	};
	oFF.XUri.prototype.addQueryElement = function(name, value) {
		this.m_queryPairs.add(oFF.XNameValuePair.createWithValues(name, value));
	};
	oFF.XUri.prototype.getQueryElements = function() {
		return this.m_queryPairs;
	};
	oFF.XUri.prototype.getQueryMap = function() {
		var elements = this.getQueryElements();
		var map = oFF.XHashMapOfStringByString.create();
		var i;
		var nameValuePair;
		for (i = 0; i < elements.size(); i++) {
			nameValuePair = elements.get(i);
			map.put(nameValuePair.getName(), nameValuePair.getValue());
		}
		return map;
	};
	oFF.XUri.prototype.setFragment = function(fragment) {
		this.m_fragment = fragment;
		this.m_fragmentQueryPairs = null;
	};
	oFF.XUri.prototype.getFragment = function() {
		if (oFF.isNull(this.m_fragmentQueryPairs)) {
			return this.m_fragment;
		}
		return oFF.XStringUtils.concatenate2(oFF.XUri.FRAGMENT_QUERY_START,
				oFF.XUri.encodeQuery(this.m_fragmentQueryPairs));
	};
	oFF.XUri.prototype.addFragmentQueryElement = function(name, value) {
		if (oFF.isNull(this.m_fragmentQueryPairs)) {
			this.m_fragmentQueryPairs = oFF.XList.create();
			this.m_fragment = null;
		}
		this.m_fragmentQueryPairs.add(oFF.XNameValuePair.createWithValues(name,
				value));
	};
	oFF.XUri.prototype.getFragmentQueryElements = function() {
		var fragmentQuery;
		if (oFF.isNull(this.m_fragmentQueryPairs)) {
			if (oFF.notNull(this.m_fragment)
					&& oFF.XString.startsWith(this.m_fragment,
							oFF.XUri.FRAGMENT_QUERY_START)) {
				fragmentQuery = oFF.XString.substring(this.m_fragment, 1, -1);
				this.m_fragmentQueryPairs = oFF.XUri.decodeQuery(fragmentQuery);
				this.m_fragment = null;
			}
		}
		return this.m_fragmentQueryPairs;
	};
	oFF.XUri.prototype.getFragmentQueryMap = function() {
		var map = oFF.XHashMapOfStringByString.create();
		var elements = this.getFragmentQueryElements();
		var i;
		var nameValuePair;
		if (oFF.notNull(elements)) {
			for (i = 0; i < elements.size(); i++) {
				nameValuePair = elements.get(i);
				map.put(nameValuePair.getName(), nameValuePair.getValue());
			}
		}
		return map;
	};
	oFF.XUri.prototype.supportsAuthority = function() {
		return this.m_supportsAuthority;
	};
	oFF.XUri.prototype.setSupportsAuthority = function(supportsAuthority) {
		this.m_supportsAuthority = supportsAuthority;
	};
	oFF.XUri.prototype.setUser = function(user) {
		var authenticationType;
		oFF.XConnection.prototype.setUser.call(this, user);
		authenticationType = this.getAuthenticationType();
		if (authenticationType === oFF.AuthenticationType.NONE) {
			if (oFF.XStringUtils.isNotNullAndNotEmpty(user)) {
				this.setAuthenticationType(oFF.AuthenticationType.BASIC);
			}
		}
	};
	oFF.XUri.prototype.isRelativeUri = function() {
		return this.getProtocolType() === null && this.getHost() === null;
	};
	oFF.XUri.prototype.getUriString = function() {
		return oFF.XUri.getUriStringStatic(this, this, true, true, true, false,
				true, true, true, true);
	};
	oFF.XUri.prototype.getUriStringWithoutAuthentication = function() {
		return oFF.XUri.getUriStringStatic(this, this, true, false, false,
				false, true, true, true, true);
	};
	oFF.XUri.prototype.getUriStringExt = function(withSchema, withUser,
			withPwd, withAuthenticationType, withHostPort, withPath, withQuery,
			withFragment) {
		return oFF.XUri.getUriStringStatic(this, this, withSchema, withUser,
				withPwd, withAuthenticationType, withHostPort, withPath,
				withQuery, withFragment);
	};
	oFF.XUri.prototype.toString = function() {
		return this.getUriStringExt(true, true, true, true, true, true, true,
				true);
	};
	oFF.SystemType = function() {
	};
	oFF.SystemType.prototype = new oFF.XConstantWithParent();
	oFF.SystemType.GENERIC = null;
	oFF.SystemType.HANA = null;
	oFF.SystemType.ABAP = null;
	oFF.SystemType.BW = null;
	oFF.SystemType.BPCS = null;
	oFF.SystemType.BPCE = null;
	oFF.SystemType.UNV = null;
	oFF.SystemType.UQAS = null;
	oFF.SystemType.ODATA = null;
	oFF.SystemType.HYBRIS = null;
	oFF.SystemType.ORCA = null;
	oFF.SystemType.ORCA_CLOUD = null;
	oFF.SystemType.VIRTUAL_INA = null;
	oFF.SystemType.VIRTUAL_INA_ODATA = null;
	oFF.SystemType.VIRTUAL_INA_SCP = null;
	oFF.SystemType.VIRTUAL_INA_GSA = null;
	oFF.SystemType.s_instances = null;
	oFF.SystemType.staticSetup = function() {
		oFF.SystemType.s_instances = oFF.XHashMapByString.create();
		oFF.SystemType.GENERIC = oFF.SystemType.create("GENERIC", null, false,
				false, false, null, null, null, null);
		oFF.SystemType.ODATA = oFF.SystemType.create("ODATA",
				oFF.SystemType.GENERIC, false, false, false, null, null, null,
				null);
		oFF.SystemType.HANA = oFF.SystemType.create("HANA",
				oFF.SystemType.GENERIC, true, false, false,
				"/sap/bc/ina/service/v2/GetServerInfo",
				"/sap/bc/ina/service/v2/GetResponse",
				"/sap/hana/xs/formLogin/logout.xscfunc", null);
		oFF.SystemType.ABAP = oFF.SystemType.create("ABAP",
				oFF.SystemType.GENERIC, true, false, false, null, null, null,
				null);
		oFF.SystemType.BW = oFF.SystemType.create("BW", oFF.SystemType.ABAP,
				true, false, false, "/sap/bw/ina/GetServerInfo",
				"/sap/bw/ina/GetResponse", "/sap/bw/ina/Logoff", null);
		oFF.SystemType.BPCS = oFF.SystemType.create("BPCS",
				oFF.SystemType.ABAP, true, false, false,
				"/sap/bpc/ina/GetServerInfo", "/sap/bpc/ina/GetResponse",
				"/sap/bpc/ina/Logoff", null);
		oFF.SystemType.BPCE = oFF.SystemType.create("BPCE", oFF.SystemType.BW,
				true, false, false, null, null, null, null);
		oFF.SystemType.UNV = oFF.SystemType.create("UNV",
				oFF.SystemType.GENERIC, true, false, false,
				"/sap/boc/ina/GetServerInfo", "/sap/boc/ina/GetResponse",
				"/sap/boc/ina/Logoff", null);
		oFF.SystemType.UQAS = oFF.SystemType.create("UQAS",
				oFF.SystemType.GENERIC, true, false, false,
				"/sap/boc/ina/GetServerInfo", "/sap/boc/ina/GetResponse",
				"/sap/boc/ina/Logoff", null);
		oFF.SystemType.HYBRIS = oFF.SystemType.create("HYBRIS",
				oFF.SystemType.GENERIC, true, false, false,
				"/sap/bc/ina/service/v2/GetServerInfo",
				"/sap/bc/ina/service/v2/GetResponse", null, null);
		oFF.SystemType.ORCA = oFF.SystemType.create("ORCA",
				oFF.SystemType.HANA, true, true, false, null, null, null,
				"/sap/fpa/services/rest/epm/session?action=logon");
		oFF.SystemType.ORCA_CLOUD = oFF.SystemType.create("ORCA_CLOUD",
				oFF.SystemType.ORCA, true, true, true, null, null, null, null);
		oFF.SystemType.VIRTUAL_INA = oFF.SystemType.create("VIRTUAL_INA",
				oFF.SystemType.GENERIC, false, false, false, null, null, null,
				null);
		oFF.SystemType.VIRTUAL_INA_ODATA = oFF.SystemType.create(
				"VIRTUAL_INA_ODATA", oFF.SystemType.VIRTUAL_INA, true, false,
				false, oFF.SystemType.BW.m_serverInfoPath,
				oFF.SystemType.BW.m_inaPath, oFF.SystemType.BW.m_logoffPath,
				oFF.SystemType.BW.m_logonPath);
		oFF.SystemType.VIRTUAL_INA_SCP = oFF.SystemType.create(
				"VIRTUAL_INA_SCP", oFF.SystemType.VIRTUAL_INA, true, false,
				false, "/info", "/ina", "/scpLogoff", "/scpLogon");
		oFF.SystemType.VIRTUAL_INA_GSA = oFF.SystemType.create(
				"VIRTUAL_INA_GSA", oFF.SystemType.VIRTUAL_INA, true, false,
				false, "/gsaInfo", "/gsaIna", "/gsaLogoff", "/gsaLogon");
	};
	oFF.SystemType.create = function(name, parent,
			isCapabilityMetadataRequired, isLogonMetadataRequired,
			isPreflightRequired, infoPath, inaPath, logoffPath, logonPath) {
		var systemType = new oFF.SystemType();
		systemType.setupExt(name, parent);
		systemType.m_isCapabilityMetadataRequired = isCapabilityMetadataRequired;
		systemType.m_isLogonMetadataRequired = isLogonMetadataRequired;
		systemType.m_isPreflightRequired = isPreflightRequired;
		systemType.m_serverInfoPath = infoPath;
		systemType.m_inaPath = inaPath;
		systemType.m_logoffPath = logoffPath;
		systemType.m_logonPath = logonPath;
		oFF.SystemType.s_instances.put(name, systemType);
		return systemType;
	};
	oFF.SystemType.lookup = function(name) {
		return oFF.SystemType.s_instances.getByKey(name);
	};
	oFF.SystemType.prototype.m_isPreflightRequired = false;
	oFF.SystemType.prototype.m_isCapabilityMetadataRequired = false;
	oFF.SystemType.prototype.m_isLogonMetadataRequired = false;
	oFF.SystemType.prototype.m_logoffPath = null;
	oFF.SystemType.prototype.m_serverInfoPath = null;
	oFF.SystemType.prototype.m_inaPath = null;
	oFF.SystemType.prototype.m_logonPath = null;
	oFF.SystemType.prototype.isCapabilityMetadataRequired = function() {
		return this.m_isCapabilityMetadataRequired;
	};
	oFF.SystemType.prototype.isLogonMetadataRequired = function() {
		return this.m_isLogonMetadataRequired;
	};
	oFF.SystemType.prototype.getServerInfoPath = function() {
		var parent;
		if (oFF.isNull(this.m_serverInfoPath)) {
			parent = this.getParent();
			if (oFF.isNull(parent)) {
				return null;
			}
			return parent.getServerInfoPath();
		}
		return this.m_serverInfoPath;
	};
	oFF.SystemType.prototype.getInAPath = function() {
		var parent;
		if (oFF.isNull(this.m_inaPath)) {
			parent = this.getParent();
			if (oFF.isNull(parent)) {
				return null;
			}
			return parent.getInAPath();
		}
		return this.m_inaPath;
	};
	oFF.SystemType.prototype.getLogoffPath = function() {
		var parent;
		if (oFF.isNull(this.m_logoffPath)) {
			parent = this.getParent();
			if (oFF.isNull(parent)) {
				return null;
			}
			return parent.getLogoffPath();
		}
		return this.m_logoffPath;
	};
	oFF.SystemType.prototype.getLogonPath = function() {
		var parent;
		if (oFF.isNull(this.m_logonPath)) {
			parent = this.getParent();
			if (oFF.isNull(parent)) {
				return null;
			}
			return parent.getLogonPath();
		}
		return this.m_logonPath;
	};
	oFF.SystemType.prototype.supportsPreflight = function() {
		return this.m_isPreflightRequired;
	};
	oFF.DfHttpClient = function() {
	};
	oFF.DfHttpClient.prototype = new oFF.SyncAction();
	oFF.DfHttpClient.prototype.m_request = null;
	oFF.DfHttpClient.prototype.setupHttpClient = function(sessionContext) {
		this.setupSynchronizingObject(sessionContext);
		this.m_request = oFF.HttpRequest.create();
	};
	oFF.DfHttpClient.prototype.releaseObject = function() {
		if (!this.m_isSyncCanceled) {
			this.m_request = oFF.XObjectExt.release(this.m_request);
		}
		oFF.SyncAction.prototype.releaseObject.call(this);
	};
	oFF.DfHttpClient.prototype.getComponentName = function() {
		return "DfHttpClient";
	};
	oFF.DfHttpClient.prototype.getDefaultMessageLayer = function() {
		return oFF.OriginLayer.IOLAYER;
	};
	oFF.DfHttpClient.prototype.getRequest = function() {
		return this.m_request;
	};
	oFF.DfHttpClient.prototype.setRequest = function(request) {
		this.m_request = request;
	};
	oFF.DfHttpClient.prototype.getResponse = function() {
		return this.getData();
	};
	oFF.DfHttpClient.prototype.prepareRequest = function() {
		var request = this.getRequest();
		request.retrieveCookiesFromMasterStorage();
		request.adaptWebdispatcherRouting(this.getSession());
		return request;
	};
	oFF.DfHttpClient.prototype.processHttpRequest = function(syncType,
			listener, customIdentifier) {
		return this.processSyncAction(syncType, listener, customIdentifier);
	};
	oFF.DfHttpClient.prototype.callListener = function(extResult, listener,
			data, customIdentifier) {
		listener.onHttpResponse(extResult, data, customIdentifier);
	};
	oFF.HttpRequest = function() {
	};
	oFF.HttpRequest.prototype = new oFF.HttpExchange();
	oFF.HttpRequest.create = function() {
		var response = new oFF.HttpRequest();
		response.setup();
		return response;
	};
	oFF.HttpRequest.createByUrl = function(url) {
		var request = new oFF.HttpRequest();
		request.setup();
		request.setUriString(url);
		return request;
	};
	oFF.HttpRequest.createByUri = function(uri) {
		var request = new oFF.HttpRequest();
		request.setup();
		request.setFromUri(uri);
		return request;
	};
	oFF.HttpRequest.createByHttpRequest = function(httpRequest) {
		var request = new oFF.HttpRequest();
		request.setup();
		request.setFromHttpRequest(httpRequest);
		return request;
	};
	oFF.HttpRequest.createByConnectionInfo = function(connectionInfo) {
		var request = new oFF.HttpRequest();
		request.setup();
		request.setFromConnectionInfo(connectionInfo);
		return request;
	};
	oFF.HttpRequest.prototype.m_uri = null;
	oFF.HttpRequest.prototype.m_relativePath = null;
	oFF.HttpRequest.prototype.m_systemName = null;
	oFF.HttpRequest.prototype.m_systemText = null;
	oFF.HttpRequest.prototype.m_prefix = null;
	oFF.HttpRequest.prototype.m_language = null;
	oFF.HttpRequest.prototype.m_timeout = 0;
	oFF.HttpRequest.prototype.m_systemType = null;
	oFF.HttpRequest.prototype.m_acceptContentType = null;
	oFF.HttpRequest.prototype.m_method = null;
	oFF.HttpRequest.prototype.m_proxySettings = null;
	oFF.HttpRequest.prototype.m_useGzipPostEncoding = false;
	oFF.HttpRequest.prototype.m_nativeConnection = null;
	oFF.HttpRequest.prototype.m_isRewritingApplied = false;
	oFF.HttpRequest.prototype.m_isAcceptGzip = false;
	oFF.HttpRequest.prototype.setup = function() {
		var useGzipValue;
		oFF.HttpExchange.prototype.setup.call(this);
		this.m_uri = oFF.XUri.create();
		this.m_method = oFF.HttpRequestMethod.HTTP_GET;
		this.m_acceptContentType = oFF.ContentType.WILDCARD;
		this.m_proxySettings = oFF.ProxySettings.create(null);
		this.m_useGzipPostEncoding = false;
		useGzipValue = oFF.XEnvironment.getInstance().getVariable(
				oFF.XEnvironmentConstants.HTTP_USE_GZIP_ENCODING);
		if (oFF.notNull(useGzipValue)
				&& (oFF.XString.isEqual("true", useGzipValue) || oFF.XString
						.isEqual("TRUE", useGzipValue))) {
			this.m_useGzipPostEncoding = true;
		}
	};
	oFF.HttpRequest.prototype.releaseObject = function() {
		this.m_systemName = null;
		this.m_systemText = null;
		this.m_prefix = null;
		this.m_language = null;
		this.m_systemType = null;
		this.m_acceptContentType = null;
		this.m_method = null;
		this.m_nativeConnection = null;
		this.m_uri = oFF.XObjectExt.release(this.m_uri);
		oFF.HttpExchange.prototype.releaseObject.call(this);
	};
	oFF.HttpRequest.prototype.setFromHttpRequest = function(httpRequest) {
		this.setFromHttpExchange(httpRequest);
		oFF.XConnectHelper.copyConnectionInfo(httpRequest, this);
		this.setPath(httpRequest.getPath());
		this.setQuery(httpRequest.getQuery());
		this.setFragment(httpRequest.getFragment());
		this.setMethod(httpRequest.getMethod());
		this.setAcceptContentType(httpRequest.getAcceptContentType());
		this.setAcceptGzip(httpRequest.isAcceptGzip());
		this.setUseGzipPostEncoding(httpRequest.useGzipPostEncoding());
	};
	oFF.HttpRequest.prototype.setFromPersonalization = function(personalization) {
		oFF.XConnectHelper.copyConnectionPersonalization(personalization, this);
	};
	oFF.HttpRequest.prototype.setFromUri = function(uri) {
		oFF.XConnectHelper.copyUri(uri, this);
	};
	oFF.HttpRequest.prototype.setFromConnectionInfo = function(origin) {
		oFF.XConnectHelper.copyConnectionInfo(origin, this);
	};
	oFF.HttpRequest.prototype.setFromConnectionPersonalization = function(
			connectionPersonalization) {
		oFF.XConnectHelper.copyConnectionPersonalization(
				connectionPersonalization, this);
	};
	oFF.HttpRequest.prototype.getAcceptContentType = function() {
		return this.m_acceptContentType;
	};
	oFF.HttpRequest.prototype.setAcceptContentType = function(contentType) {
		this.m_acceptContentType = contentType;
	};
	oFF.HttpRequest.prototype.isAcceptGzip = function() {
		return this.m_isAcceptGzip;
	};
	oFF.HttpRequest.prototype.setAcceptGzip = function(acceptGzip) {
		this.m_isAcceptGzip = acceptGzip;
	};
	oFF.HttpRequest.prototype.setMethod = function(method) {
		this.m_method = method;
	};
	oFF.HttpRequest.prototype.getMethod = function() {
		return this.m_method;
	};
	oFF.HttpRequest.prototype.createRawData = function() {
		var postData;
		var postDataSize = 0;
		var postDataUtf8 = this.getByteArray();
		var httpHeader;
		var httpGetRequest;
		var rawSummary;
		var requestMethod;
		var full;
		var bytes;
		var host;
		var port;
		if (oFF.isNull(postDataUtf8)) {
			postData = this.getString();
			if (oFF.notNull(postData)) {
				postDataUtf8 = oFF.XByteArray.convertFromString(postData);
				postDataSize = postDataUtf8.size();
			}
		} else {
			postData = oFF.XByteArray.convertToString(postDataUtf8);
			postDataSize = postDataUtf8.size();
		}
		httpHeader = oFF.HttpCoreUtils.populateHeaderFromRequest(this,
				oFF.HttpHeader.create(), this, postDataSize, true);
		httpGetRequest = oFF.HttpCoreUtils.createHttpRequestString(this,
				httpHeader);
		rawSummary = oFF.XStringBuffer.create();
		rawSummary.append(httpGetRequest);
		requestMethod = this.getMethod();
		full = null;
		if (oFF.XLanguage.getLanguage() !== oFF.XLanguage.JAVASCRIPT) {
			bytes = oFF.XByteArray.convertFromStringWithCharset(httpGetRequest,
					oFF.XCharset.USASCII);
			full = bytes;
			if (requestMethod === oFF.HttpRequestMethod.HTTP_POST
					|| requestMethod === oFF.HttpRequestMethod.HTTP_PUT) {
				if (oFF.notNull(postDataUtf8)) {
					full = oFF.XByteArray.create(null, bytes.size()
							+ postDataUtf8.size());
					oFF.XByteArray.copy(bytes, 0, full, 0, bytes.size());
					oFF.XByteArray.copy(postDataUtf8, 0, full, bytes.size(),
							postDataUtf8.size());
				}
			}
		}
		if (requestMethod === oFF.HttpRequestMethod.HTTP_POST
				|| requestMethod === oFF.HttpRequestMethod.HTTP_PUT) {
			if (oFF.notNull(postDataUtf8)) {
				rawSummary.append(postData);
			}
		}
		this.m_rawSummary = rawSummary.toString();
		host = this.getHost();
		port = this.getPort();
		if (this.getProxyHost() !== null) {
			host = this.getProxyHost();
			port = this.getProxyPort();
		}
		return oFF.HttpRawData.create(this.getProtocolType(), host, port, full);
	};
	oFF.HttpRequest.prototype.getProxyHost = function() {
		return this.m_proxySettings.getProxyHost();
	};
	oFF.HttpRequest.prototype.getProxyPort = function() {
		return this.m_proxySettings.getProxyPort();
	};
	oFF.HttpRequest.prototype.setProxyHost = function(host) {
		this.m_proxySettings.setProxyHost(host);
	};
	oFF.HttpRequest.prototype.setProxyPort = function(port) {
		this.m_proxySettings.setProxyPort(port);
	};
	oFF.HttpRequest.prototype.getProxyAuthorization = function() {
		return this.m_proxySettings.getProxyAuthorization();
	};
	oFF.HttpRequest.prototype.setProxyAuthorization = function(authorization) {
		this.m_proxySettings.setProxyAuthorization(authorization);
	};
	oFF.HttpRequest.prototype.getSccLocationId = function() {
		return this.m_proxySettings.getSccLocationId();
	};
	oFF.HttpRequest.prototype.setSccLocationId = function(sccLocationId) {
		this.m_proxySettings.setSccLocationId(sccLocationId);
	};
	oFF.HttpRequest.prototype.getWebdispatcherTemplate = function() {
		return this.m_proxySettings.getWebdispatcherTemplate();
	};
	oFF.HttpRequest.prototype.setWebdispatcherUri = function(template) {
		this.m_proxySettings.setWebdispatcherTemplate(template);
	};
	oFF.HttpRequest.prototype.setWebdispatcherTemplate = function(template) {
		this.m_proxySettings.setWebdispatcherTemplate(template);
	};
	oFF.HttpRequest.prototype.getProxyType = function() {
		return this.m_proxySettings.getProxyType();
	};
	oFF.HttpRequest.prototype.setProxyType = function(type) {
		this.m_proxySettings.setProxyType(type);
	};
	oFF.HttpRequest.prototype.getProxyHttpHeaders = function() {
		return this.m_proxySettings.getProxyHttpHeaders();
	};
	oFF.HttpRequest.prototype.setProxyHttpHeader = function(name, value) {
		this.m_proxySettings.setProxyHttpHeader(name, value);
	};
	oFF.HttpRequest.prototype.useGzipPostEncoding = function() {
		return this.m_useGzipPostEncoding;
	};
	oFF.HttpRequest.prototype.setUseGzipPostEncoding = function(
			useGzipPostEncoding) {
		this.m_useGzipPostEncoding = useGzipPostEncoding;
	};
	oFF.HttpRequest.prototype.setPath = function(path) {
		this.m_uri.setPath(path);
	};
	oFF.HttpRequest.prototype.getPath = function() {
		return this.m_uri.getPath();
	};
	oFF.HttpRequest.prototype.getQueryMap = function() {
		return this.m_uri.getQueryMap();
	};
	oFF.HttpRequest.prototype.addQueryElement = function(name, value) {
		this.m_uri.addQueryElement(name, value);
	};
	oFF.HttpRequest.prototype.getQueryElements = function() {
		return this.m_uri.getQueryElements();
	};
	oFF.HttpRequest.prototype.getFragment = function() {
		return this.m_uri.getFragment();
	};
	oFF.HttpRequest.prototype.getFragmentQueryElements = function() {
		return this.m_uri.getFragmentQueryElements();
	};
	oFF.HttpRequest.prototype.getFragmentQueryMap = function() {
		return this.m_uri.getFragmentQueryMap();
	};
	oFF.HttpRequest.prototype.addFragmentQueryElement = function(name, value) {
		this.m_uri.addFragmentQueryElement(name, value);
	};
	oFF.HttpRequest.prototype.getUriString = function() {
		return this.m_uri.getUriString();
	};
	oFF.HttpRequest.prototype.getUriStringWithoutAuthentication = function() {
		return this.m_uri.getUriStringWithoutAuthentication();
	};
	oFF.HttpRequest.prototype.getUriStringExt = function(withSchema, withUser,
			withPwd, withAuthenticationType, withHostPort, withPath, withQuery,
			withFragment) {
		return this.m_uri.getUriStringExt(withSchema, withUser, withPwd,
				withAuthenticationType, withHostPort, withPath, withQuery,
				withFragment);
	};
	oFF.HttpRequest.prototype.getScheme = function() {
		return this.m_uri.getScheme();
	};
	oFF.HttpRequest.prototype.getProtocolType = function() {
		return this.m_uri.getProtocolType();
	};
	oFF.HttpRequest.prototype.getUser = function() {
		return this.m_uri.getUser();
	};
	oFF.HttpRequest.prototype.getPassword = function() {
		return this.m_uri.getPassword();
	};
	oFF.HttpRequest.prototype.getAuthenticationType = function() {
		return this.m_uri.getAuthenticationType();
	};
	oFF.HttpRequest.prototype.getOrganization = function() {
		return this.m_uri.getOrganization();
	};
	oFF.HttpRequest.prototype.setOrganization = function(organization) {
		this.m_uri.setOrganization(organization);
	};
	oFF.HttpRequest.prototype.getElement = function() {
		return this.m_uri.getElement();
	};
	oFF.HttpRequest.prototype.setElement = function(element) {
		this.m_uri.setElement(element);
	};
	oFF.HttpRequest.prototype.getHost = function() {
		return this.m_uri.getHost();
	};
	oFF.HttpRequest.prototype.getPort = function() {
		return this.m_uri.getPort();
	};
	oFF.HttpRequest.prototype.getX509Certificate = function() {
		return this.m_uri.getX509Certificate();
	};
	oFF.HttpRequest.prototype.getSecureLoginProfile = function() {
		return this.m_uri.getSecureLoginProfile();
	};
	oFF.HttpRequest.prototype.setUriString = function(uriString) {
		this.m_uri.setUriString(uriString);
	};
	oFF.HttpRequest.prototype.setFromUriWithParent = function(uriString,
			parentUri, mergeQueries) {
		this.m_uri.setFromUriWithParent(uriString, parentUri, mergeQueries);
	};
	oFF.HttpRequest.prototype.setFragment = function(fragment) {
		this.m_uri.setFragment(fragment);
	};
	oFF.HttpRequest.prototype.setQuery = function(query) {
		this.m_uri.setQuery(query);
	};
	oFF.HttpRequest.prototype.setFromConnection = function(connection) {
		this.m_uri.setFromConnection(connection);
	};
	oFF.HttpRequest.prototype.setScheme = function(scheme) {
		this.m_uri.setScheme(scheme);
	};
	oFF.HttpRequest.prototype.setProtocolType = function(type) {
		this.m_uri.setProtocolType(type);
	};
	oFF.HttpRequest.prototype.setUser = function(user) {
		this.m_uri.setUser(user);
	};
	oFF.HttpRequest.prototype.setPassword = function(password) {
		this.m_uri.setPassword(password);
	};
	oFF.HttpRequest.prototype.getAuthenticationToken = function() {
		return this.m_uri.getAuthenticationToken();
	};
	oFF.HttpRequest.prototype.setAuthenticationToken = function(token) {
		this.m_uri.setAuthenticationToken(token);
	};
	oFF.HttpRequest.prototype.getAccessToken = function() {
		return this.m_uri.getAccessToken();
	};
	oFF.HttpRequest.prototype.setAccessToken = function(token) {
		this.m_uri.setAccessToken(token);
	};
	oFF.HttpRequest.prototype.supportsAuthority = function() {
		return this.m_uri.supportsAuthority();
	};
	oFF.HttpRequest.prototype.setSupportsAuthority = function(supportsAuthority) {
		this.m_uri.setSupportsAuthority(supportsAuthority);
	};
	oFF.HttpRequest.prototype.setAuthenticationType = function(type) {
		this.m_uri.setAuthenticationType(type);
	};
	oFF.HttpRequest.prototype.setHost = function(host) {
		this.m_uri.setHost(host);
	};
	oFF.HttpRequest.prototype.setPort = function(port) {
		this.m_uri.setPort(port);
	};
	oFF.HttpRequest.prototype.setX509Certificate = function(x509Certificate) {
		this.m_uri.setX509Certificate(x509Certificate);
	};
	oFF.HttpRequest.prototype.setSecureLoginProfile = function(
			secureLoginProfile) {
		this.m_uri.setSecureLoginProfile(secureLoginProfile);
	};
	oFF.HttpRequest.prototype.isRelativeUri = function() {
		return this.m_uri.isRelativeUri();
	};
	oFF.HttpRequest.prototype.getQuery = function() {
		return this.m_uri.getQuery();
	};
	oFF.HttpRequest.prototype.getSystemName = function() {
		return this.m_systemName;
	};
	oFF.HttpRequest.prototype.setSystemName = function(systemName) {
		this.m_systemName = systemName;
	};
	oFF.HttpRequest.prototype.getSystemText = function() {
		return this.m_systemText;
	};
	oFF.HttpRequest.prototype.setSystemText = function(systemText) {
		this.m_systemText = systemText;
	};
	oFF.HttpRequest.prototype.getTimeout = function() {
		return this.m_timeout;
	};
	oFF.HttpRequest.prototype.setTimeout = function(milliseconds) {
		this.m_timeout = milliseconds;
	};
	oFF.HttpRequest.prototype.getSystemType = function() {
		return this.m_systemType;
	};
	oFF.HttpRequest.prototype.setSystemType = function(systemType) {
		this.m_systemType = systemType;
	};
	oFF.HttpRequest.prototype.getPrefix = function() {
		return this.m_prefix;
	};
	oFF.HttpRequest.prototype.setPrefix = function(prefix) {
		this.m_prefix = prefix;
	};
	oFF.HttpRequest.prototype.getLanguage = function() {
		return this.m_language;
	};
	oFF.HttpRequest.prototype.setLanguage = function(language) {
		this.m_language = language;
	};
	oFF.HttpRequest.prototype.getNativeConnection = function() {
		return this.m_nativeConnection;
	};
	oFF.HttpRequest.prototype.setNativeConnection = function(nativeConnection) {
		this.m_nativeConnection = nativeConnection;
	};
	oFF.HttpRequest.prototype.setReferer = function(referer) {
		this.getHeaderFieldsBase().putString(oFF.HttpConstants.HD_REFERER,
				referer);
	};
	oFF.HttpRequest.prototype.getReferer = function() {
		return this.getHeaderFields().getByKey(oFF.HttpConstants.HD_REFERER);
	};
	oFF.HttpRequest.prototype.setOrigin = function(origin) {
		this.getHeaderFieldsBase().putString(oFF.HttpConstants.HD_ORIGIN,
				origin);
	};
	oFF.HttpRequest.prototype.getOrigin = function() {
		return this.getHeaderFields().getByKey(oFF.HttpConstants.HD_ORIGIN);
	};
	oFF.HttpRequest.prototype.retrieveCookiesFromMasterStorage = function() {
		if (oFF.notNull(this.m_cookiesMasterStore)
				&& oFF.isNull(this.m_cookies)) {
			this.m_cookies = this.m_cookiesMasterStore.getCookies(this
					.getHost(), this.getPath());
		}
	};
	oFF.HttpRequest.prototype.newHttpClient = function(session) {
		return this.newHttpClientExt(session, true);
	};
	oFF.HttpRequest.prototype.newHttpClientExt = function(session,
			adaptWebdispatcherRouting) {
		var httpClient;
		if (adaptWebdispatcherRouting) {
			this.adaptWebdispatcherRouting(session);
		}
		httpClient = oFF.HttpClientFactory.newInstanceByConnection(session,
				this);
		httpClient.setRequest(this);
		return httpClient;
	};
	oFF.HttpRequest.prototype.adaptWebdispatcherRouting = function(session) {
		if (this.m_isRewritingApplied === false) {
			oFF.XConnectHelper.applyProxySettings(this, session);
			oFF.XConnectHelper.applyWebdispatcherTemplate(this, this, this,
					session);
			this.m_isRewritingApplied = true;
			session.getLogger().logObj(this);
		}
	};
	oFF.HttpRequest.prototype.isRewritingApplied = function() {
		return this.m_isRewritingApplied;
	};
	oFF.HttpRequest.prototype.setIsRewritingApplied = function(
			isRewritingApplied) {
		this.m_isRewritingApplied = isRewritingApplied;
	};
	oFF.HttpRequest.prototype.getAlias = function() {
		return this.m_uri.getAlias();
	};
	oFF.HttpRequest.prototype.setAlias = function(alias) {
		this.m_uri.setAlias(alias);
	};
	oFF.HttpRequest.prototype.getRelativePath = function() {
		if (oFF.isNull(this.m_relativePath)) {
			return this.getPath();
		} else {
			return this.m_relativePath;
		}
	};
	oFF.HttpRequest.prototype.setRelativePath = function(relativePath) {
		this.m_relativePath = relativePath;
	};
	oFF.HttpRequest.prototype.toString = function() {
		var buffer;
		this.createRawData();
		buffer = oFF.XStringBuffer.create();
		buffer.append(this.m_rawSummary);
		if (this.getProxyType() === oFF.ProxyType.PROXY) {
			buffer.append("=== Proxy Settings ===");
			buffer.append("Host: ").appendLine(this.getProxyHost());
			buffer.append("Port: ").appendInt(this.getProxyPort())
					.appendNewLine();
		}
		return buffer.toString();
	};
	oFF.HttpServerConfig = function() {
	};
	oFF.HttpServerConfig.prototype = new oFF.XConnection();
	oFF.HttpServerConfig.create = function() {
		var obj = new oFF.HttpServerConfig();
		obj.setup();
		return obj;
	};
	oFF.HttpServerConfig.prototype.m_listener = null;
	oFF.HttpServerConfig.prototype.releaseObject = function() {
		this.m_listener = null;
		oFF.XConnection.prototype.releaseObject.call(this);
	};
	oFF.HttpServerConfig.prototype.getCallback = function() {
		return this.m_listener;
	};
	oFF.HttpServerConfig.prototype.setCallback = function(listener) {
		this.m_listener = listener;
	};
	oFF.DfRpcFunction = function() {
	};
	oFF.DfRpcFunction.prototype = new oFF.SyncAction();
	oFF.DfRpcFunction.prototype.m_relativeUri = null;
	oFF.DfRpcFunction.prototype.m_rpcRequest = null;
	oFF.DfRpcFunction.prototype.m_rpcResponse = null;
	oFF.DfRpcFunction.prototype.m_traceInfo = null;
	oFF.DfRpcFunction.prototype.m_isServerMetadataCall = false;
	oFF.DfRpcFunction.prototype.setupFunction = function(context,
			connectionInfo, relativeUri) {
		this.setupSynchronizingObject(context);
		this.m_relativeUri = relativeUri;
		this.m_rpcRequest = oFF.RpcRequest.create(this, connectionInfo);
		this.m_rpcResponse = oFF.RpcResponse.create(this);
	};
	oFF.DfRpcFunction.prototype.releaseObject = function() {
		this.m_relativeUri = null;
		this.m_rpcRequest = oFF.XObjectExt.release(this.m_rpcRequest);
		this.m_rpcResponse = oFF.XObjectExt.release(this.m_rpcResponse);
		this.m_traceInfo = oFF.XObjectExt.release(this.m_traceInfo);
		oFF.SyncAction.prototype.releaseObject.call(this);
	};
	oFF.DfRpcFunction.prototype.getName = function() {
		return this.m_relativeUri.toString();
	};
	oFF.DfRpcFunction.prototype.getRequest = function() {
		return this.m_rpcRequest;
	};
	oFF.DfRpcFunction.prototype.getResponse = function() {
		return this.m_rpcResponse;
	};
	oFF.DfRpcFunction.prototype.getExtResult = function() {
		return this;
	};
	oFF.DfRpcFunction.prototype.callListener = function(extResult, listener,
			data, customIdentifier) {
		listener.onFunctionExecuted(extResult, data, customIdentifier);
	};
	oFF.DfRpcFunction.prototype.processFunctionExecution = function(syncType,
			listener, customIdentifier) {
		return this.processSyncAction(syncType, listener, customIdentifier);
	};
	oFF.DfRpcFunction.prototype.getTraceInfo = function() {
		return this.m_traceInfo;
	};
	oFF.DfRpcFunction.prototype.setTraceInfo = function(traceInfo) {
		this.m_traceInfo = traceInfo;
	};
	oFF.DfRpcFunction.prototype.getTraceType = function() {
		if (oFF.isNull(this.m_traceInfo)) {
			return oFF.TraceType.NONE;
		}
		return this.m_traceInfo.getTraceType();
	};
	oFF.DfRpcFunction.prototype.setIsServerMetadataCall = function(
			isServerMetadataCall) {
		this.m_isServerMetadataCall = isServerMetadataCall;
	};
	oFF.DfRpcFunction.prototype.isServerMetadataCall = function() {
		return this.m_isServerMetadataCall;
	};
	oFF.XmlParser = function() {
	};
	oFF.XmlParser.prototype = new oFF.DfDocumentParser();
	oFF.XmlParser.SLASH = 47;
	oFF.XmlParser.create = function() {
		var xmlParser = new oFF.XmlParser();
		xmlParser.setupSessionContext(null);
		return xmlParser;
	};
	oFF.XmlParser.prototype.parse = function(content) {
		var xmlContent;
		this.clearMessages();
		xmlContent = oFF.XString.trim(content);
		if (oFF.XString.size(xmlContent) === 0) {
			this.addErrorExt(oFF.OriginLayer.PROTOCOL,
					oFF.ErrorCodes.PARSER_ERROR, "The XML content is empty.",
					oFF.XStringValue.create(xmlContent));
			return oFF.PrFactory.createStructure();
		}
		return this.parseInternal(xmlContent);
	};
	oFF.XmlParser.prototype.getClosingTag = function(tagName) {
		return oFF.XStringUtils.concatenate3("</", tagName, ">");
	};
	oFF.XmlParser.prototype.getTagName = function(completeTag) {
		var posFirstSpace = oFF.XString.indexOf(completeTag, " ");
		return oFF.XString.substring(completeTag, 0, posFirstSpace);
	};
	oFF.XmlParser.prototype.getAttributes = function(completeTag) {
		var posFirstSpace = oFF.XString.indexOf(completeTag, " ");
		var attributes;
		if (posFirstSpace === -1) {
			return "";
		}
		attributes = oFF.XString.substring(completeTag, posFirstSpace, -1);
		if (oFF.XString.endsWith(attributes, "/")) {
			return oFF.XStringUtils.stripRight(attributes, 1);
		}
		return attributes;
	};
	oFF.XmlParser.prototype.handleAttributes = function(currentElement,
			attributes) {
		var currentStructure;
		var sizeAttributes;
		var posAttr;
		var posAssign;
		var posEndAttributeValue;
		var quotationChar;
		var isLastAttribute;
		var attributeValue;
		var attributeName;
		if (currentElement.isList()) {
			return;
		}
		currentStructure = currentElement;
		sizeAttributes = oFF.XString.size(attributes);
		posAttr = 0;
		while (posAttr < sizeAttributes) {
			posAssign = oFF.XString.indexOfFrom(attributes, "=", posAttr);
			if (posAssign === -1) {
				break;
			}
			quotationChar = oFF.XString.getCharAt(attributes, posAssign + 1);
			if (quotationChar === 34) {
				posEndAttributeValue = oFF.XString.indexOfFrom(attributes, '"',
						posAssign + 2);
			} else {
				posEndAttributeValue = oFF.XString.indexOfFrom(attributes, "'",
						posAssign + 2);
			}
			isLastAttribute = oFF.XString.indexOfFrom(attributes, " ",
					posAssign) === -1;
			if (isLastAttribute) {
				attributeValue = oFF.XString.substring(attributes,
						posAssign + 1, sizeAttributes);
			} else {
				attributeValue = oFF.XString.substring(attributes,
						posAssign + 1, posEndAttributeValue + 1);
			}
			attributeName = oFF.XStringUtils.concatenate2("-",
					oFF.XString.trim(oFF.XString.substring(attributes, posAttr,
							posAssign)));
			currentStructure.putString(attributeName, oFF.XStringUtils
					.stripChars(attributeValue, 1));
			if (isLastAttribute) {
				break;
			}
			posAttr = posEndAttributeValue + 1;
		}
	};
	oFF.XmlParser.prototype.handleContent = function(currentElement,
			tagContent, tagName) {
		var currentList;
		var currentStructure;
		var closingTag;
		if (currentElement.isList()) {
			currentList = currentElement;
			currentList.addString(tagContent);
			return;
		}
		currentStructure = currentElement;
		closingTag = this.getClosingTag(tagName);
		if (oFF.XString.endsWith(tagContent, closingTag)) {
			currentStructure.putString(tagName, oFF.XStringUtils.stripRight(
					tagContent, oFF.XString.size(closingTag)));
		} else {
			currentStructure.putString(tagName, tagContent);
		}
	};
	oFF.XmlParser.prototype.pop = function(path) {
		return path.removeAt(path.size() - 1);
	};
	oFF.XmlParser.prototype.peek = function(path) {
		if (path.isEmpty()) {
			return null;
		}
		return path.get(path.size() - 1);
	};
	oFF.XmlParser.prototype.navigateToParent = function(xmlRoot, path) {
		var parent = xmlRoot;
		var i;
		var parentList;
		for (i = 0; i < path.size(); i++) {
			if (parent.isStructure()) {
				parent = parent.getByKey(path.get(i));
				if (parent.isList()) {
					parentList = parent.asList();
					parent = parentList.getStructureAt(parentList.size() - 1);
				}
			}
		}
		return parent;
	};
	oFF.XmlParser.prototype.skipTag = function(xmlContent, startCurrentTag) {
		var firstChar = oFF.XString.getCharAt(xmlContent, startCurrentTag + 1);
		return firstChar === 33 || firstChar === 63;
	};
	oFF.XmlParser.prototype.parseInternal = function(xmlContent) {
		var xmlRoot;
		var currentElement;
		var currentList;
		var pathToCurrentElement;
		var pos;
		var sizeXml;
		var startCurrentTag;
		var endOpeningCurrentTag;
		var currentCompleteTag;
		var currentTagName;
		var isCurrentTagClosing;
		var currentAttributes;
		var hasCurrentTagAttributes;
		var currentClosingTag;
		var isCurrentTagSelfClosing;
		var endCurrentTag;
		var content;
		var isContentEmpty;
		var isCurrentTagNested;
		this.addProfileStep("Parse XML");
		xmlRoot = oFF.PrFactory.createStructure();
		currentElement = xmlRoot;
		pathToCurrentElement = oFF.XListOfString.create();
		pos = 0;
		sizeXml = oFF.XString.size(xmlContent);
		while (pos < sizeXml) {
			startCurrentTag = oFF.XString.indexOfFrom(xmlContent, "<", pos);
			if (startCurrentTag === -1) {
				break;
			}
			endOpeningCurrentTag = oFF.XString.indexOfFrom(xmlContent, ">",
					startCurrentTag);
			if (this.skipTag(xmlContent, startCurrentTag)) {
				pos = endOpeningCurrentTag + 1;
				continue;
			}
			currentCompleteTag = oFF.XString.substring(xmlContent,
					startCurrentTag + 1, endOpeningCurrentTag);
			currentTagName = this.getTagName(currentCompleteTag);
			isCurrentTagClosing = oFF.XString.getCharAt(currentTagName, 0) === oFF.XmlParser.SLASH;
			if (isCurrentTagClosing) {
				if (!oFF.XString.endsWith(currentTagName, this
						.peek(pathToCurrentElement))) {
					this.addErrorExt(oFF.OriginLayer.IOLAYER,
							oFF.ErrorCodes.PARSER_ERROR, oFF.XStringUtils
									.concatenate3("The tag '", currentTagName,
											"' is not opened properly."),
							oFF.XStringValue.create(xmlContent));
					break;
				}
				this.pop(pathToCurrentElement);
				currentElement = this.navigateToParent(xmlRoot,
						pathToCurrentElement);
				pos = endOpeningCurrentTag + 1;
				continue;
			}
			currentAttributes = this.getAttributes(currentCompleteTag);
			hasCurrentTagAttributes = oFF.XStringUtils
					.isNotNullAndNotEmpty(currentAttributes);
			currentClosingTag = this.getClosingTag(currentTagName);
			isCurrentTagSelfClosing = oFF.XString.getCharAt(currentCompleteTag,
					oFF.XString.size(currentCompleteTag) - 1) === oFF.XmlParser.SLASH;
			endCurrentTag = oFF.XString.indexOfFrom(xmlContent,
					currentClosingTag, endOpeningCurrentTag);
			if (isCurrentTagSelfClosing && oFF.notNull(currentElement)) {
				if (!hasCurrentTagAttributes) {
					if (xmlRoot.isEmpty() && currentElement.isStructure()) {
						currentElement.asStructure().putNull(
								oFF.XStringUtils.stripRight(currentTagName, 1));
					}
					if (currentElement.isList()) {
						currentElement.addNewStructure();
					}
					pos = endOpeningCurrentTag + 1;
					continue;
				}
			} else {
				if (oFF.XString.indexOf(xmlContent, currentClosingTag) === -1) {
					this.addErrorExt(oFF.OriginLayer.IOLAYER,
							oFF.ErrorCodes.PARSER_ERROR, oFF.XStringUtils
									.concatenate3("The tag '", currentTagName,
											"' is not closed properly."),
							oFF.XStringValue.create(xmlContent));
					break;
				}
			}
			content = "";
			if (!isCurrentTagSelfClosing) {
				content = this.getContent(xmlContent, endOpeningCurrentTag,
						endCurrentTag);
			}
			isContentEmpty = oFF.XString.isEqual(content, "");
			isCurrentTagNested = !isContentEmpty
					&& oFF.XString.getCharAt(content, 0) === 60;
			currentList = this
					.getListForElement(currentElement, currentTagName);
			if (oFF.notNull(currentList)) {
				currentElement = currentList;
				if (hasCurrentTagAttributes || isContentEmpty
						|| isCurrentTagNested) {
					currentElement = currentList.addNewStructure();
				}
			} else {
				if (oFF.notNull(currentElement)) {
					if (hasCurrentTagAttributes || isCurrentTagNested) {
						currentElement = currentElement
								.putNewStructure(currentTagName);
					}
				}
			}
			if (!isContentEmpty && !isCurrentTagNested
					&& !isCurrentTagSelfClosing && oFF.notNull(currentElement)) {
				this.handleContent(currentElement, content, currentTagName);
			}
			if (hasCurrentTagAttributes && oFF.notNull(currentElement)) {
				this.handleAttributes(currentElement, currentAttributes);
			}
			if (isCurrentTagSelfClosing) {
				currentElement = this.navigateToParent(xmlRoot,
						pathToCurrentElement);
			} else {
				pathToCurrentElement.add(currentTagName);
			}
			pos = endOpeningCurrentTag;
		}
		oFF.XObjectExt.release(pathToCurrentElement);
		this.endProfileStep();
		if (this.hasErrors()) {
			return oFF.PrFactory.createStructure();
		}
		if (!xmlRoot.hasElements()) {
			this.addErrorExt(oFF.OriginLayer.IOLAYER,
					oFF.ErrorCodes.PARSER_ERROR, "The XML contains no tags.",
					oFF.XStringValue.create(xmlContent));
		}
		return xmlRoot;
	};
	oFF.XmlParser.prototype.getListForElement = function(currentElement,
			currentTagName) {
		var currentStructure;
		var existingElement;
		var list;
		if (oFF.notNull(currentElement) && currentElement.isStructure()
				&& currentElement.asStructure().containsKey(currentTagName)) {
			currentStructure = currentElement.asStructure();
			existingElement = currentStructure.getByKey(currentTagName);
			list = oFF.PrUtils.convertToList(existingElement);
			currentStructure.put(currentTagName, list);
			return list;
		}
		return null;
	};
	oFF.XmlParser.prototype.getContent = function(xmlContent,
			endOpeningCurrentTag, endCurrentTag) {
		if (endCurrentTag === -1) {
			return oFF.XString.trim(oFF.XString.substring(xmlContent,
					endOpeningCurrentTag + 1, -1));
		}
		return oFF.XString.trim(oFF.XString.substring(xmlContent,
				endOpeningCurrentTag + 1, endCurrentTag));
	};
	oFF.IoComponentType = function() {
	};
	oFF.IoComponentType.prototype = new oFF.XComponentType();
	oFF.IoComponentType.FILE = null;
	oFF.IoComponentType.BINDING_ADAPTER = null;
	oFF.IoComponentType.BINDING_ADAPTER_INT = null;
	oFF.IoComponentType.BINDING_ADAPTER_STRING = null;
	oFF.IoComponentType.BINDING_ADAPTER_JSON = null;
	oFF.IoComponentType.BINDING_SENDER = null;
	oFF.IoComponentType.BINDING_RECEIVER = null;
	oFF.IoComponentType.DATA_PROVIDER = null;
	oFF.IoComponentType.staticSetupIoType = function() {
		oFF.IoComponentType.FILE = oFF.IoComponentType.createIoType("File",
				oFF.XComponentType._ROOT);
		oFF.IoComponentType.BINDING_ADAPTER = oFF.IoComponentType.createIoType(
				"BindingAdapter", oFF.XComponentType._ROOT);
		oFF.IoComponentType.BINDING_ADAPTER_INT = oFF.IoComponentType
				.createIoType("BindingAdapterInt",
						oFF.IoComponentType.BINDING_ADAPTER);
		oFF.IoComponentType.BINDING_ADAPTER_STRING = oFF.IoComponentType
				.createIoType("BindingAdapterString",
						oFF.IoComponentType.BINDING_ADAPTER);
		oFF.IoComponentType.BINDING_ADAPTER_JSON = oFF.IoComponentType
				.createIoType("BindingAdapterJson",
						oFF.IoComponentType.BINDING_ADAPTER);
		oFF.IoComponentType.BINDING_SENDER = oFF.IoComponentType.createIoType(
				"BindingSender", oFF.IoComponentType.BINDING_SENDER);
		oFF.IoComponentType.BINDING_RECEIVER = oFF.IoComponentType
				.createIoType("BindingReceiver",
						oFF.IoComponentType.BINDING_RECEIVER);
		oFF.IoComponentType.DATA_PROVIDER = oFF.IoComponentType.createIoType(
				"DataProvider", oFF.XComponentType._DATASOURCE);
	};
	oFF.IoComponentType.createIoType = function(constant, parent) {
		var mt = new oFF.IoComponentType();
		if (oFF.isNull(parent)) {
			mt.setupExt(constant, oFF.XComponentType._ROOT);
		} else {
			mt.setupExt(constant, parent);
		}
		return mt;
	};
	oFF.HttpFileClient = function() {
	};
	oFF.HttpFileClient.prototype = new oFF.DfHttpClient();
	oFF.HttpFileClient.create = function(session) {
		var newObj = new oFF.HttpFileClient();
		newObj.setupHttpClient(session);
		return newObj;
	};
	oFF.HttpFileClient.prototype.processSynchronization = function(syncType) {
		var request = this.getRequest();
		var path = request.getPath();
		var response = oFF.HttpResponse.createResponse(request);
		var file;
		var mimeType;
		var fileTypeIndex;
		var fileEnding;
		var fileMimeType;
		var data;
		var content;
		this.setData(response);
		file = oFF.XFile.create(this.getSession(), path);
		if (file.isFile()) {
			mimeType = oFF.ContentType.TEXT_PLAIN;
			fileTypeIndex = oFF.XString.lastIndexOf(path, ".");
			if (fileTypeIndex !== -1) {
				fileEnding = oFF.XString.substring(path, fileTypeIndex + 1, -1);
				fileMimeType = oFF.ContentType.lookupByFileEnding(fileEnding);
				if (oFF.notNull(fileMimeType)) {
					mimeType = fileMimeType;
				}
			}
			response.setContentType(mimeType);
			data = file.load();
			response.setByteArray(data);
			if (mimeType.isText()) {
				content = oFF.XByteArray.convertToString(data);
				response.setString(content);
			}
			response.setStatusCode(oFF.HttpStatusCode.SC_OK);
		} else {
			response.setStatusCode(oFF.HttpStatusCode.SC_NOT_FOUND);
		}
		return false;
	};
	oFF.HttpLocalLoopClient = function() {
	};
	oFF.HttpLocalLoopClient.prototype = new oFF.DfHttpClient();
	oFF.HttpLocalLoopClient.create = function(session, serverConfig) {
		var newObj = new oFF.HttpLocalLoopClient();
		newObj.setupLocalLoop(session, serverConfig);
		return newObj;
	};
	oFF.HttpLocalLoopClient.prototype.m_serverConfig = null;
	oFF.HttpLocalLoopClient.prototype.setupLocalLoop = function(session,
			serverConfig) {
		this.setupHttpClient(session);
		this.m_serverConfig = serverConfig;
	};
	oFF.HttpLocalLoopClient.prototype.releaseObject = function() {
		this.m_serverConfig = null;
		oFF.DfHttpClient.prototype.releaseObject.call(this);
	};
	oFF.HttpLocalLoopClient.prototype.processSynchronization = function(
			syncType) {
		var listener;
		this.prepareRequest();
		listener = this.m_serverConfig.getCallback();
		listener.onHttpRequest(this);
		return false;
	};
	oFF.HttpLocalLoopClient.prototype.getClientRequest = function() {
		return this.getRequest();
	};
	oFF.HttpLocalLoopClient.prototype.setResponse = function(serverResponse) {
		serverResponse.applyCookiesToMasterStorage();
		this.setData(serverResponse);
	};
	oFF.HttpSamlClient = function() {
	};
	oFF.HttpSamlClient.prototype = new oFF.DfHttpClient();
	oFF.HttpSamlClient.create = function(session) {
		var client = new oFF.HttpSamlClient();
		client.setupHttpClient(session);
		return client;
	};
	oFF.HttpSamlClient.prototype.m_step = 0;
	oFF.HttpSamlClient.prototype.m_passwordSent = false;
	oFF.HttpSamlClient.prototype.processSynchronization = function(syncType) {
		var request;
		var serviceRequest;
		var serviceRequestClient;
		this.m_step = 1;
		this.m_passwordSent = false;
		request = this.getRequest();
		serviceRequest = oFF.HttpRequest.createByHttpRequest(request);
		serviceRequest.setAuthenticationType(oFF.AuthenticationType.NONE);
		serviceRequest.setAcceptContentType(oFF.ContentType.WILDCARD);
		serviceRequest.setUser(null);
		serviceRequest.setPassword(null);
		serviceRequest.setIsRewritingApplied(true);
		serviceRequestClient = serviceRequest.newHttpClient(this.getSession());
		serviceRequestClient.processHttpRequest(syncType, this, null);
		return true;
	};
	oFF.HttpSamlClient.prototype.onHttpResponse = function(extResult, response,
			customIdentifier) {
		var samlResponse;
		var statusCode;
		var httpContentType;
		var session;
		var originSite;
		var location;
		var locationUri;
		var redirectRequest;
		var cookiesMasterStore;
		var httpClient;
		var stopProcessing;
		var authenticate;
		var contentType;
		var html;
		var identityProviderForm;
		var masterRequest;
		this.addAllMessages(extResult);
		if (this.hasErrors()) {
			this.endSync();
		} else {
			statusCode = response.getStatusCode();
			httpContentType = response.getContentType();
			if (statusCode === oFF.HttpStatusCode.SC_OK
					&& (httpContentType === oFF.ContentType.APPLICATION_JSON || httpContentType === oFF.ContentType.APPLICATION_XML)) {
				this.setData(response);
				this.endSync();
			} else {
				session = this.getSession();
				originSite = response.getHttpRequest();
				if (statusCode === oFF.HttpStatusCode.SC_SEE_OTHER
						|| statusCode === oFF.HttpStatusCode.SC_FOUND) {
					location = response.getLocation();
					if (oFF.notNull(location)) {
						locationUri = oFF.XUri.createFromUriWithParent(
								location, originSite, false);
						redirectRequest = oFF.HttpRequest
								.createByUri(locationUri);
						redirectRequest.setIsRewritingApplied(true);
						redirectRequest
								.setAcceptContentType(oFF.ContentType.WILDCARD);
						redirectRequest
								.setMethod(oFF.HttpRequestMethod.HTTP_GET);
						redirectRequest.getHeaderFieldsBase().put(
								oFF.HttpConstants.HD_CSRF_TOKEN,
								oFF.HttpConstants.VA_CSRF_FETCH);
						cookiesMasterStore = this.getRequest()
								.getCookiesMasterStore();
						redirectRequest
								.setCookiesMasterStore(cookiesMasterStore);
						this.m_step = this.m_step + 1;
						httpClient = redirectRequest.newHttpClient(session);
						httpClient.processHttpRequest(this.getActiveSyncType(),
								this, null);
					} else {
						samlResponse = oFF.HttpResponse.createResponse(this
								.getRequest());
						samlResponse
								.setStatusCode(oFF.HttpStatusCode.SC_NOT_ACCEPTABLE);
						samlResponse
								.setStatusCodeDetails("SAML Response does not contain redirect location");
						this
								.addError(0,
										"SAML Response does not contain redirect location");
						this.setData(samlResponse);
						this.endSync();
					}
				} else {
					stopProcessing = false;
					if (statusCode === oFF.HttpStatusCode.SC_UNAUTHORIZED) {
						authenticate = response.getHeaderFields()
								.getStringByKey(
										oFF.HttpConstants.HD_WWW_AUTHENTICATE);
						if (oFF.XStringUtils.isNotNullAndNotEmpty(authenticate)) {
							if (oFF.XString.startsWith(authenticate,
									oFF.HttpConstants.VA_AUTHORIZATION_BASIC)) {
								this.setData(response);
								this.endSync();
								stopProcessing = true;
							}
						}
					}
					if (stopProcessing === false) {
						contentType = response.getContentType();
						if (contentType.isTypeOf(oFF.ContentType.TEXT_OR_HTML)) {
							html = response.getString();
							identityProviderForm = oFF.HtmlForm.create(
									originSite, html);
							if (identityProviderForm.isValid()) {
								if (identityProviderForm
										.getParameterValue("j_username") !== null) {
									if (this.m_passwordSent
											&& identityProviderForm
													.getParameterValue("SAMLResponse") === null) {
										this
												.addError(0,
														"Failed to login: Bad Username or password");
										samlResponse = oFF.HttpResponse
												.createResponse(this
														.getRequest());
										samlResponse
												.setStatusCode(oFF.HttpStatusCode.SC_UNAUTHORIZED);
										samlResponse
												.setStatusCodeDetails("Failed to login: Bad Username or password");
										this.setData(samlResponse);
										stopProcessing = true;
									} else {
										this.m_passwordSent = true;
										masterRequest = this.getRequest();
										identityProviderForm.set("j_username",
												masterRequest.getUser());
										identityProviderForm.set("j_password",
												masterRequest.getPassword());
									}
								}
								if (stopProcessing) {
									this.endSync();
								} else {
									this.postForm(session,
											identityProviderForm, false);
								}
							} else {
								this.setData(response);
								this.endSync();
							}
						}
					}
				}
			}
		}
	};
	oFF.HttpSamlClient.prototype.postForm = function(session, form,
			useCertificates) {
		var uri;
		var request;
		var masteruri;
		var referer;
		var originUri;
		var origin;
		var cookiesMasterStore;
		var buffer;
		var names;
		var hasValue;
		var name;
		var type;
		var value;
		var valueEnc;
		var content;
		var httpClient;
		this.m_step = this.m_step + 1;
		uri = form.getTarget();
		request = oFF.HttpRequest.createByUri(uri);
		request.setAcceptContentType(oFF.ContentType.WILDCARD);
		if (useCertificates) {
			request.setAuthenticationType(oFF.AuthenticationType.CERTIFICATES);
		} else {
			request.setAuthenticationType(oFF.AuthenticationType.NONE);
		}
		request.setMethod(oFF.HttpRequestMethod.HTTP_POST);
		masteruri = form.getOriginSite();
		referer = masteruri.getUriString();
		request.setReferer(referer);
		originUri = oFF.XUri.createFromOther(masteruri);
		originUri.setFragment(null);
		originUri.setPath(null);
		originUri.setQuery(null);
		originUri.setAuthenticationType(oFF.AuthenticationType.NONE);
		origin = originUri.getUriString();
		request.setOrigin(origin);
		cookiesMasterStore = this.getRequest().getCookiesMasterStore();
		request.setCookiesMasterStore(cookiesMasterStore);
		buffer = oFF.XStringBuffer.create();
		names = form.getNames();
		hasValue = false;
		while (names.hasNext()) {
			name = names.next();
			type = form.getParameterType(name);
			if (!oFF.XString.isEqual(type, "submit")) {
				if (hasValue) {
					buffer.append("&");
				}
				hasValue = true;
				buffer.append(name).append("=");
				value = form.getParameterValue(name);
				valueEnc = oFF.XHttpUtils.encodeURIComponent(value);
				buffer.append(valueEnc);
			}
		}
		content = buffer.toString();
		request.setString(content);
		request.setContentType(oFF.ContentType.APPLICATION_FORM);
		httpClient = request.newHttpClient(session);
		return httpClient.processHttpRequest(this.getActiveSyncType(), this,
				null);
	};
	oFF.ProcessComponentType = function() {
	};
	oFF.ProcessComponentType.prototype = new oFF.XComponentType();
	oFF.ProcessComponentType.SIGSEL_RESULT_LIST = null;
	oFF.ProcessComponentType.staticSetupProcessTypes = function() {
		oFF.ProcessComponentType.SIGSEL_RESULT_LIST = oFF.ProcessComponentType
				.createRuntimeType("SigSelResultList", oFF.XComponentType._ROOT);
	};
	oFF.ProcessComponentType.createRuntimeType = function(constant, parent) {
		var mt = new oFF.ProcessComponentType();
		if (oFF.isNull(parent)) {
			mt.setupExt(constant, oFF.XComponentType._ROOT);
		} else {
			mt.setupExt(constant, parent);
		}
		return mt;
	};
	oFF.IoModule = function() {
	};
	oFF.IoModule.prototype = new oFF.DfModule();
	oFF.IoModule.s_module = null;
	oFF.IoModule.getInstance = function() {
		return oFF.IoModule.initVersion(oFF.XVersion.API_DEFAULT);
	};
	oFF.IoModule.initVersion = function(version) {
		var timestamp;
		if (oFF.isNull(oFF.IoModule.s_module)) {
			oFF.DfModule.checkInitialized(oFF.CoreExtModule
					.initVersion(version));
			timestamp = oFF.DfModule.start("IoModule...");
			oFF.IoModule.s_module = new oFF.IoModule();
			oFF.WorkingTaskManagerType.staticSetup();
			oFF.SyncType.staticSetup();
			oFF.SyncState.staticSetup();
			oFF.Dispatcher.staticSetup();
			oFF.WorkingTaskManager.staticSetup();
			oFF.ListenerType.staticSetup();
			oFF.ProgramRegistration.staticSetup();
			oFF.SystemType.staticSetup();
			oFF.IoComponentType.staticSetupIoType();
			oFF.ChildSetState.staticSetup();
			oFF.HttpClientFactory.staticSetupClientFactory();
			oFF.XFileSystemType.staticSetup();
			oFF.VarResolveMode.staticSetup();
			oFF.ContentType.staticSetup();
			oFF.XmlParserFactory.staticSetupXmlParserFactory();
			oFF.JsonParserGenericFactory.staticSetup();
			oFF.DocumentFormatType.staticSetup();
			oFF.AuthenticationType.staticSetup();
			oFF.ProtocolType.staticSetup();
			oFF.HttpConstants.staticSetup();
			oFF.HttpRequestMethod.staticSetup();
			oFF.RpcFunctionFactory.staticSetupFunctionFactory();
			oFF.HttpFileFactory.staticSetup();
			oFF.HttpSamlClientFactory.staticSetupSamlFactory();
			oFF.NetworkEnv.staticSetup();
			oFF.PathFormat.staticSetup();
			oFF.RpcRequestType.staticSetup();
			oFF.XFileSystemFactory.staticSetupFactory();
			oFF.XWebDAVFactory.staticSetup();
			oFF.ProxyType.staticSetup();
			oFF.ProcessComponentType.staticSetupProcessTypes();
			oFF.SigSelType.staticSetup();
			oFF.SigSelDomain.staticSetup();
			oFF.SigSelIndexType.staticSetup();
			oFF.DfModule.stop(timestamp);
		}
		return oFF.IoModule.s_module;
	};
	oFF.IoModule.getInstance();
})(sap.firefly);