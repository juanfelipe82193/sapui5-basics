(function(oFF) {
	if (typeof $ !== "undefined" && $.db && $.db.ina && $.trace) {
		$Global.window = {
			location : {
				protocol : "http:",
				hostname : "localhost",
				port : 8000,
				pathname : "",
				hash : "",
				search : ""
			}
		};
		$Global.console = {
			log : function(text) {
				$.trace.debug("XLogger: " + text);
			}
		};
		$Global.XMLHttpRequest = function() {
			this.headers = {};
		};
		$Global.XMLHttpRequest.clients = {
			"default" : new $.net.http.Client()
		};
		$Global.XMLHttpRequest.prototype.open = function(method, url, async) {
			$.trace.debug("Creating request with method=" + method + ", url="
					+ url + ", async=" + async);
			this.url = url;
			if (method === "GET") {
				this.request = new $.net.http.Request($.net.http.GET, url);
			} else {
				if (method === "POST") {
					this.request = new $.net.http.Request($.net.http.POST, url);
				} else {
					if (method === "PUT") {
						this.request = new $.net.http.Request($.net.http.PUT,
								url);
					}
				}
			}
			if (this.request === undefined) {
				throw new Error(
						"Illegal State: Couldn't create XS-request for method "
								+ method);
			}
		};
		$Global.XMLHttpRequest.prototype.send = function(data) {
			var str = "";
			var aHeaders = this.request.headers;
			var fnDebug = $.trace.debug;
			var sClient = "default";
			for ( var member in this.headers) {
				if (this.headers.hasOwnProperty(member)) {
					aHeaders.set(member, this.headers[member]);
					str += member + "=" + this.headers[member] + "\u000d\u000a";
					if (member === oFF.HttpConstants.HD_AUTHORIZATION) {
						sClient = this.headers[member];
						if (!$Global.XMLHttpRequest.clients
								.hasOwnProperty(sClient)) {
							$Global.XMLHttpRequest.clients[sClient] = new $.net.http.Client();
						}
					}
				}
			}
			fnDebug("Request to send, client key:\n" + sClient);
			var oClient = $Global.XMLHttpRequest.clients[sClient];
			fnDebug("Request to send, headers:\n" + str);
			fnDebug("Request to send, body:\n" + data);
			if (data !== null) {
				this.request.setBody(data);
			}
			oClient.request(this.request, this.url);
			this.response = oClient.getResponse();
			this.readyState = 4;
			this.status = this.response.status;
			this.statusText = "";
			if (!this.response.body) {
				this.responseText = "";
			} else {
				this.responseText = this.response.body.asString();
			}
			this.headers = {};
			fnDebug("Received response, header:\n"
					+ this.getAllResponseHeaders());
			fnDebug("Received response, body:\n" + this.responseText);
		};
		$Global.XMLHttpRequest.prototype.setRequestHeader = function(header,
				value) {
			this.headers[header] = value;
			$.trace.debug("Added field to the header " + header + "=" + value
					+ ", size=" + this.headers.length);
		};
		$Global.XMLHttpRequest.prototype.getAllResponseHeaders = function() {
			var str = "";
			var aHeaders = this.response.headers;
			var len = aHeaders.length;
			for (var i = 0; i < len; ++i) {
				var header = aHeaders[i];
				str += header.name + ": " + header.value + "\u000d\u000a";
			}
			return str;
		};
	}
	oFF.NodeJsXMLHttpRequest = function() {
		this.readyState = oFF.NodeJsXMLHttpRequest.UNSENT;
		this.m_headers = {};
		this.m_options = {};
		this.m_sendFlag = false;
		this.m_method = null;
		this.m_url = null;
		this.m_async = null;
		this.status = null;
		this.statusText = null;
		this.response = null;
		this.responseText = "";
		this.onreadystatechange = null;
		this.m_cookies = null;
	};
	oFF.NodeJsXMLHttpRequest.prototype = new oFF.XObject();
	oFF.NodeJsXMLHttpRequest.UNSENT = 0;
	oFF.NodeJsXMLHttpRequest.OPENED = 1;
	oFF.NodeJsXMLHttpRequest.HEADERS_RECEIVED = 2;
	oFF.NodeJsXMLHttpRequest.DONE = 4;
	oFF.NodeJsXMLHttpRequest.prototype.getResponseHeader = function(header) {
		if (typeof header === "string"
				&& this.readyState > oFF.NodeJsXMLHttpRequest.OPENED
				&& this.response && this.response.headers) {
			return this.response.headers[header.toLowerCase()];
		}
		return null;
	};
	oFF.NodeJsXMLHttpRequest.prototype.getAllResponseHeaders = function() {
		if (this.readyState < oFF.NodeJsXMLHttpRequest.HEADERS_RECEIVED) {
			return "";
		}
		var result = "";
		var headers = this.response.headers;
		for ( var h in headers) {
			if (headers.hasOwnProperty(h)) {
				var headerLower = h.toLowerCase();
				result += headerLower + ": " + headers[headerLower] + "\r\n";
			}
		}
		return result.substr(0, result.length - 2);
	};
	oFF.NodeJsXMLHttpRequest.prototype.isHttpsProtocol = function(url) {
		var parsedUrl = require("url").parse(url.toString());
		var protocolLower = parsedUrl.protocol.toLowerCase();
		return protocolLower === "https:";
	};
	oFF.NodeJsXMLHttpRequest.prototype.setCookies = function(cookies) {
		this.m_cookies = cookies;
	};
	oFF.NodeJsXMLHttpRequest.prototype.setRequestHeader = function(header,
			value) {
		var headerLower = header.toLowerCase();
		if (headerLower !== "cookie") {
			if (this.readyState !== oFF.NodeJsXMLHttpRequest.OPENED) {
				throw new Error("Request is not in OPEN state");
			}
			if (this.m_sendFlag) {
				throw new Error("Request has been already sent");
			}
			this.m_headers[headerLower] = this.m_headers[headerLower] ? this.m_headers[headerLower]
					+ ", " + value
					: value;
		} else {
			this.m_headers[headerLower] = this.m_headers[headerLower] ? this.m_headers[headerLower]
					+ ", " + value
					: value;
		}
	};
	oFF.NodeJsXMLHttpRequest.prototype.open = function(method, url, async) {
		var methodUpper = method.toUpperCase();
		if (methodUpper !== "POST" && methodUpper !== "GET"
				&& methodUpper !== "PUT") {
			throw new Error("Request method is not supported");
		}
		this.m_async = async;
		this.m_headers = {};
		this.m_method = methodUpper;
		this.m_url = url;
		this.m_sendFlag = false;
		this.readyState = oFF.NodeJsXMLHttpRequest.OPENED;
		this.status = 0;
		this.statusText = "";
	};
	oFF.NodeJsXMLHttpRequest.prototype.send = function(body) {
		if (this.readyState !== oFF.NodeJsXMLHttpRequest.OPENED) {
			throw new Error("Request is not in OPEN state");
		}
		if (this.m_sendFlag) {
			throw new Error("Request has been already sent");
		}
		if (this.m_method === "GET") {
			body = null;
		} else {
			if (body) {
				this.setRequestHeader("Content-Length",
						Buffer.isBuffer(body) ? body.length : Buffer
								.byteLength(body));
			} else {
				if (this.m_method === "POST") {
					this.setRequestHeader("Content-Length", 0);
				}
			}
		}
		var parsedUrl = require("url").parse(this.m_url);
		var port = parsedUrl.port
				|| (this.isHttpsProtocol(this.m_url) ? 443 : 80);
		var host;
		var hostname;
		switch (parsedUrl.protocol) {
		case "https:":
		case "http:":
			host = parsedUrl.host;
			hostname = parsedUrl.hostname;
			break;
		default:
			throw new Error("Protocol not supported");
		}
		this.setRequestHeader("Host", host);
		this.setRequestHeader("User-Agent", process.release.name + "/"
				+ process.version + "(" + process.platform + ")");
		if (this.m_cookies !== null) {
			var cookiesList = this.m_cookies.getCookies();
			if (cookiesList.size() !== 0) {
				var cookies = "";
				for (var i = 0; i < cookiesList.size(); i++) {
					cookies += cookiesList.get(i).getName() + "="
							+ cookiesList.get(i).getValue() + "; ";
				}
				this.setRequestHeader("Cookie", cookies.substring(0,
						cookies.length - 2));
			}
		}
		this.m_options = {
			"host" : host,
			"port" : port,
			"path" : parsedUrl.path,
			"hostname" : hostname,
			"protocol" : parsedUrl.protocol,
			"method" : this.m_method,
			"headers" : this.m_headers
		};
		var useProxy = false;
		if (useProxy) {
			var proxyHost = "127.0.0.1";
			var proxyPort = 8888;
			this.m_options.host = proxyHost;
			this.m_options.port = proxyPort;
			this.m_options.path = this.m_url;
			delete this.m_options.hostname;
		}
		var handleResponseEnd = function(resp) {
			var response = JSON.parse(resp);
			this.response = response.data;
			this.status = response.data.statusCode;
			this.statusText = response.data.statusMessage;
			this.responseText = response.data.text;
			this.readyState = oFF.NodeJsXMLHttpRequest.DONE;
			if (this.m_async) {
				this.handleEvent("readystatechange");
			}
		}.bind(this);
		var handleResponseError = function(error) {
			this.response = error;
			this.status = 0;
			this.statusText = "";
			this.responseText = "";
			this.readyState = oFF.NodeJsXMLHttpRequest.DONE;
		}.bind(this);
		var handleRequestError = function(error) {
			this.response = null;
			this.status = error.code;
			this.statusText = error.message;
			this.responseText = error.message;
			this.readyState = oFF.NodeJsXMLHttpRequest.DONE;
		}.bind(this);
		var charsetUTF8 = "UTF-8";
		if (this.m_async) {
			this.m_sendFlag = true;
			var responseText = "";
			var request = require("http"
					+ (this.isHttpsProtocol(this.m_url) ? "s" : "")).request;
			var processResponse = function(response) {
				response.setEncoding(charsetUTF8);
				response.on("data", function(data) {
					responseText += data;
				});
				response.on("end", function() {
					handleResponseEnd(JSON.stringify({
						"error" : null,
						"data" : {
							"statusCode" : response.statusCode,
							"statusMessage" : response.statusMessage,
							"headers" : response.headers,
							"text" : responseText
						}
					}));
				});
				response.on("error", function(error) {
					handleResponseError(error);
				});
			}.bind(this);
			var requestPerformer = request(this.m_options, processResponse);
			requestPerformer.on("error", function(error) {
				handleRequestError(error);
			});
			if (body !== null) {
				requestPerformer.write(body);
			}
			requestPerformer.end();
		} else {
			var fs = require("fs");
			var syncFile = ".nodeHttpSync_" + process.pid;
			fs.writeFileSync(syncFile, "", charsetUTF8);
			var syncReq = 'var request = require("http'
					+ (this.isHttpsProtocol(this.m_url) ? "s" : "")
					+ '").request;'
					+ 'var responseText = "";'
					+ "var processResponse = function(response) {"
					+ 'response.setEncoding("'
					+ charsetUTF8
					+ '");'
					+ 'response.on("data", function(data) {'
					+ "responseText += data;"
					+ "});"
					+ 'response.on("end", function() {'
					+ 'fs.writeFileSync("'
					+ syncFile
					+ '", '
					+ 'JSON.stringify({"error": null, "data": {"statusCode": '
					+ "response.statusCode"
					+ ', "statusMessage": '
					+ "response.statusMessage"
					+ ', "headers": '
					+ "response.headers"
					+ ', "text": '
					+ "responseText"
					+ "}})"
					+ ', "'
					+ charsetUTF8
					+ '");'
					+ "});"
					+ 'response.on("error", function(error) {'
					+ 'fs.writeFileSync("'
					+ syncFile
					+ '", '
					+ 'JSON.stringify({"error": '
					+ "error"
					+ "})"
					+ ', "'
					+ charsetUTF8
					+ '");'
					+ "});"
					+ "};"
					+ "var requestPerformer = request("
					+ JSON.stringify(this.m_options)
					+ ", processResponse);"
					+ 'requestPerformer.on("error", function(error) {'
					+ 'fs.writeFileSync("'
					+ syncFile
					+ '", '
					+ 'JSON.stringify({"error": '
					+ "error"
					+ "})"
					+ ', "'
					+ charsetUTF8
					+ '");'
					+ "});"
					+ (body ? "requestPerformer.write(" + JSON.stringify(body)
							+ ");" : "") + "requestPerformer.end();";
			var spawnSync = require("child_process").spawnSync;
			spawnSync(process.argv[0], [ "-e", syncReq ]);
			var resp = fs.readFileSync(syncFile, charsetUTF8);
			fs.unlinkSync(syncFile);
			var err = JSON.parse(resp).error;
			if (err) {
				handleResponseError(err);
			} else {
				handleResponseEnd(resp);
			}
		}
	};
	oFF.NodeJsXMLHttpRequest.prototype.abort = function() {
	};
	oFF.NodeJsXMLHttpRequest.prototype.handleEvent = function(event) {
		if (typeof this["on" + event] === "function") {
			this["on" + event]();
		}
	};
	oFF.NativeXFileSystem = function() {
		oFF.DfXFileSystem.call(this);
		this._ff_c = "NativeXFileSystem";
	};
	oFF.NativeXFileSystem.prototype = new oFF.DfXFileSystem();
	oFF.NativeXFileSystem.create = function(session) {
		var fs = new oFF.NativeXFileSystem();
		fs.setupSessionContext(session);
		return fs;
	};
	oFF.NativeXFileSystem.staticSetup = function() {
		if (oFF.XSystemUtils.isNode()) {
			var xFile = oFF.XFile;
			xFile.setFileSystem(new oFF.NativeXFileSystem());
			xFile.NATIVE_SLASH = require("path").sep;
			xFile.IS_SUPPORTED = true;
		}
	};
	oFF.NativeXFileSystem.prototype.getRoots = function() {
		var paths = new oFF.XListOfString();
		var isWin = /^win/.test(process.platform);
		if (isWin) {
			paths.add("C:\\");
		} else {
			paths.add("/");
		}
		return paths;
	};
	oFF.NativeXFileSystem.prototype.getChildren = function(inputPath) {
		var nativePath = require("path").normalize(inputPath);
		var xFile = oFF.XFile;
		if (oFF.XStringUtils.isNullOrEmpty(nativePath)) {
			return this.getRoots();
		}
		var paths = new oFF.XListOfString();
		try {
			var files = require("fs").readdirSync(nativePath);
			for ( var i in files) {
				if (files.hasOwnProperty(i)) {
					var path = nativePath + xFile.NATIVE_SLASH + files[i];
					paths.add(path);
				}
			}
		} catch (err) {
		}
		return paths;
	};
	oFF.NativeXFileSystem.prototype.isDirectory = function(inputPath) {
		try {
			var stats = require("fs").statSync(
					require("path").normalize(inputPath));
			return stats.isDirectory();
		} catch (err) {
			return false;
		}
	};
	oFF.NativeXFileSystem.prototype.isFile = function(inputPath) {
		try {
			var stats = require("fs").statSync(
					require("path").normalize(inputPath));
			return stats.isFile();
		} catch (err) {
			return false;
		}
	};
	oFF.NativeXFileSystem.prototype.isExisting = function(inputPath) {
		var nativePath = require("path").normalize(inputPath);
		return this.isDirectory(nativePath) || this.isFile(nativePath);
	};
	oFF.NativeXFileSystem.prototype.loadInternal = function(inputPath,
			messageManager) {
		try {
			var bytes = require("fs").readFileSync(
					require("path").normalize(inputPath));
			var byteArray = new oFF.XByteArray(bytes);
		} catch (err) {
			messageManager.addError(0, err);
		}
		return byteArray;
	};
	oFF.NativeXFileSystem.prototype.load = function(nativePath) {
		var messageManager = oFF.MessageManager.createMessageManager();
		var byteArray = this.loadInternal(nativePath, messageManager);
		return oFF.ExtResult.create(byteArray, messageManager);
	};
	oFF.NativeXFileSystem.prototype.loadExt = function(nativePath) {
		var messageManager = oFF.MessageManager.createMessageManager();
		var byteArray = this.loadInternal(nativePath, messageManager);
		var content = oFF.XFileContent.createFileContent();
		content.setMessageCollection(messageManager);
		content.setContentTypeAutodetect(oFF.ContentType.BINARY, nativePath,
				false);
		content.setByteArray(byteArray);
		return content;
	};
	oFF.NativeXFileSystem.prototype.loadGzipped = function(inputPath) {
		var messageManager = oFF.MessageManager.createMessageManager();
		var nativePath = require("path").normalize(inputPath);
		var bytes = [];
		try {
			bytes = require("fs").readFileSync(nativePath);
			bytes = require("zlib").gunzipSync(bytes);
		} catch (err) {
			messageManager.addError(0, err);
		}
		var content = oFF.XFileContent.createFileContent();
		content.setMessageCollection(messageManager);
		content.setContentTypeAutodetect(oFF.ContentType.BINARY, nativePath,
				true);
		content.setByteArray(new oFF.XByteArray(bytes));
		return content;
	};
	oFF.NativeXFileSystem.prototype.save = function(inputPath, data) {
		var messageManager = oFF.MessageManager.createMessageManager();
		var bytes = data.getNative();
		try {
			var nativePath = require("path").normalize(inputPath);
			require("fs").writeFileSync(nativePath, bytes);
		} catch (err) {
			messageManager.addError(0, err);
		}
		return messageManager;
	};
	oFF.NativeXFileSystem.prototype.mkdirs = function(inputPath) {
		try {
			var pathToCreate = require("path").normalize(inputPath);
			pathToCreate.split(require("path").sep).reduce(
					function(currentPath, folder) {
						currentPath += folder + require("path").sep;
						if (!require("fs").existsSync(currentPath)) {
							require("fs").mkdirSync(currentPath);
						}
						return currentPath;
					}, "");
		} catch (err) {
		}
	};
	oFF.NativeXFileSystem.prototype.mkdir = function(inputPath) {
		try {
			var nativePath = require("path").normalize(inputPath);
			require("fs").mkdirSync(nativePath);
		} catch (err) {
		}
	};
	oFF.NativeXFileSystem.prototype.getLastModifiedTimestamp = function(
			inputPath) {
		try {
			var nativePath = require("path").normalize(inputPath);
			return require("fs").statSync(nativePath).mtime;
		} catch (err) {
			return 0;
		}
	};
	oFF.NativeXFileSystem.prototype.renameTo = function(inputSourcePath,
			inputDestPath) {
		try {
			var sourceNativePath = require("path").normalize(inputSourcePath);
			var destNativePath = require("path").normalize(inputDestPath);
			require("fs").renameSync(sourceNativePath, destNativePath);
		} catch (err) {
		}
	};
	oFF.NativeXFileSystem.prototype.deleteFile = function(inputPath) {
		try {
			var nativePath = require("path").normalize(inputPath);
			if (this.isDirectory(nativePath)) {
				require("fs").rmdirSync(nativePath);
			} else {
				require("fs").unlinkSync(nativePath);
			}
		} catch (err) {
		}
	};
	oFF.NativeXFileSystemFactory = function() {
		oFF.XFileSystemFactory.call(this);
		this._ff_c = "NativeXFileSystemFactory";
	};
	oFF.NativeXFileSystemFactory.prototype = new oFF.XFileSystemFactory();
	oFF.NativeXFileSystemFactory.staticSetup = function() {
		oFF.XFileSystemFactory.registerFactory(oFF.XFileSystemType.OS,
				new oFF.NativeXFileSystemFactory());
	};
	oFF.NativeXFileSystemFactory.prototype.newFileSystem = function(session) {
		return new oFF.NativeXFileSystem.create(session);
	};
	oFF.NativeDispatcher = function() {
		oFF.DfDispatcher.call(this);
		this._ff_c = "NativeDispatcher";
	};
	oFF.NativeDispatcher.prototype = new oFF.DfDispatcher();
	oFF.NativeDispatcher.staticSetup = function() {
		oFF.Dispatcher.replaceInstance(new oFF.NativeDispatcher());
	};
	oFF.NativeDispatcher.prototype.registerInterval = function(milliseconds,
			listener, customIdentifier) {
		var timerItem = new oFF.JsTimerHandle(milliseconds, listener,
				customIdentifier, true);
		timerItem.jsHandle = setInterval(function() {
			timerItem.execute();
		}, milliseconds);
		return timerItem;
	};
	oFF.NativeDispatcher.prototype.unregisterInterval = function(handle) {
		clearInterval(handle.jsHandle);
	};
	oFF.NativeDispatcher.prototype.registerTimer = function(milliseconds,
			listener, customIdentifier) {
		var timerItem = new oFF.JsTimerHandle(milliseconds, listener,
				customIdentifier, false);
		timerItem.jsHandle = setInterval(function() {
			timerItem.execute();
		}, milliseconds);
		return timerItem;
	};
	oFF.NativeDispatcher.prototype.unregisterTimer = function(handle) {
		clearTimeout(handle.jsHandle);
	};
	oFF.NativeDispatcher.prototype.getProcessingTimeReceiverCount = function() {
		return -1;
	};
	oFF.NativeDispatcher.prototype.registerProcessingTimeReceiver = function(
			processingTimeReceiver) {
		return;
	};
	oFF.NativeDispatcher.prototype.unregisterProcessingTimeReceiver = function(
			processingTimeReceiver) {
		return;
	};
	oFF.NativeDispatcher.prototype.shutdown = function() {
		return;
	};
	oFF.NativeDispatcher.prototype.process = function() {
		return;
	};
	oFF.NativeDispatcher.prototype.getSyncState = function() {
		return oFF.SyncState.IN_SYNC;
	};
	oFF.JsTimerHandle = function(milliseconds, listener, customIdentifier,
			isInterval) {
		oFF.TimerItem.call(this);
		oFF.TimerItem.prototype.setupExt.call(this, milliseconds, listener,
				customIdentifier, isInterval);
		this._ff_c = "JsTimerHandle";
	};
	oFF.JsTimerHandle.prototype = new oFF.TimerItem();
	oFF.NativeJsonParser = function() {
		oFF.DfDocumentParser.call(this);
		this._ff_c = "NativeJsonParser";
		this.setupSessionContext(null);
	};
	oFF.NativeJsonParser.prototype = new oFF.DfDocumentParser();
	oFF.NativeJsonParser.prototype.parseUnsafe = function(content) {
		this.clearMessages();
		if (content === null || content === undefined) {
			return null;
		}
		return new oFF.NativeJsonProxyElement(JSON.parse(content));
	};
	oFF.NativeJsonParser.prototype.parse = function(content) {
		var jsonRootElement;
		this.clearMessages();
		if (content === null) {
			return null;
		}
		var regExpBom = /^\uFEFF?|\u200B?/;
		if (regExpBom.test(content)) {
			content = content.replace(regExpBom, "");
		}
		try {
			jsonRootElement = JSON.parse(content);
		} catch (e) {
			this.addError(oFF.JsonParserErrorCode.JSON_PARSER_ROOT_ERROR,
					e.message);
			return null;
		}
		if (jsonRootElement === undefined) {
			return null;
		}
		return new oFF.NativeJsonProxyElement(jsonRootElement);
	};
	oFF.NativeJsonParser.prototype.convertFromNative = function(jsonRootElement) {
		var ocpRootElement;
		this.clearMessages();
		if (jsonRootElement === null || jsonRootElement === undefined) {
			return null;
		}
		try {
			ocpRootElement = new oFF.NativeJsonProxyElement(jsonRootElement);
		} catch (e) {
			this.addError(oFF.JsonParserErrorCode.JSON_PARSER_ROOT_ERROR,
					e.message);
			return null;
		}
		return ocpRootElement;
	};
	oFF.NativeJsonParser.prototype.convertToNative = function(jsonRootElement) {
		this.clearMessages();
		if (jsonRootElement === null || jsonRootElement === undefined) {
			return null;
		} else {
			try {
				var jsonString = oFF.PrUtils.serialize(jsonRootElement, false,
						false, 0);
				var nativeModel = JSON.parse(jsonString);
				return nativeModel;
			} catch (e) {
				this.addError(oFF.JsonParserErrorCode.JSON_PARSER_ROOT_ERROR,
						e.message);
				return null;
			}
		}
	};
	oFF.NativeJsonParserFactory = function() {
		oFF.JsonParserFactory.call(this);
		this._ff_c = "NativeJsonParserFactory";
	};
	oFF.NativeJsonParserFactory.prototype = new oFF.JsonParserFactory();
	oFF.NativeJsonParserFactory.staticSetup = function() {
		oFF.JsonParserFactory
				.setJsonParserFactory(new oFF.NativeJsonParserFactory());
	};
	oFF.NativeJsonParserFactory.prototype.newParserInstance = function() {
		return new oFF.NativeJsonParser();
	};
	oFF.NativeJsonProxyElement = function(jsonRootElement) {
		oFF.DfPrProxyElement.call(this);
		this.m_jsonRootElement = jsonRootElement;
		this._ff_c = "NativeJsonProxyElement";
	};
	oFF.NativeJsonProxyElement.prototype = new oFF.DfPrProxyElement();
	oFF.NativeJsonProxyElement.prototype.releaseObject = function() {
		this.m_jsonRootElement = null;
		oFF.DfPrProxyElement.prototype.releaseObject.call(this);
	};
	oFF.NativeJsonProxyElement.prototype.put = function(name, element) {
		if (element === null) {
			delete this.m_jsonRootElement[name];
		} else {
			this.m_jsonRootElement[name] = element;
		}
	};
	oFF.NativeJsonProxyElement.prototype.putNotNullAndNotEmpty = function(name,
			element) {
		if (oFF.isNull(element)
				|| element.isList()
				&& element.asList().isEmpty()
				|| element.isStructure()
				&& element.asStructure().isEmpty()
				|| element.isString()
				&& oFF.XStringUtils.isNullOrEmpty(element.asString()
						.getString())) {
			return;
		}
		this.put(name, element);
	};
	oFF.NativeJsonProxyElement.prototype.remove = function(key) {
		var element = this.m_jsonRootElement[key];
		delete this.m_jsonRootElement[key];
		return element === undefined ? null : element;
	};
	oFF.NativeJsonProxyElement.prototype.getPermaCopy = function() {
		return new oFF.NativeJsonProxyElement(this.m_jsonRootElement);
	};
	oFF.NativeJsonProxyElement.prototype.asString = function() {
		return this;
	};
	oFF.NativeJsonProxyElement.prototype.asNumber = oFF.NativeJsonProxyElement.prototype.asString;
	oFF.NativeJsonProxyElement.prototype.asBoolean = oFF.NativeJsonProxyElement.prototype.asString;
	oFF.NativeJsonProxyElement.prototype.asNull = oFF.NativeJsonProxyElement.prototype.asString;
	oFF.NativeJsonProxyElement.prototype.asInteger = oFF.NativeJsonProxyElement.prototype.asString;
	oFF.NativeJsonProxyElement.prototype.asLong = oFF.NativeJsonProxyElement.prototype.asString;
	oFF.NativeJsonProxyElement.prototype.asDouble = oFF.NativeJsonProxyElement.prototype.asString;
	oFF.NativeJsonProxyElement.prototype.asList = oFF.NativeJsonProxyElement.prototype.asString;
	oFF.NativeJsonProxyElement.prototype.asStructure = oFF.NativeJsonProxyElement.prototype.asString;
	oFF.NativeJsonProxyElement.prototype.putString = function(name, value) {
		this.m_jsonRootElement[name] = value;
	};
	oFF.NativeJsonProxyElement.prototype.putBoolean = oFF.NativeJsonProxyElement.prototype.putString;
	oFF.NativeJsonProxyElement.prototype.putInteger = oFF.NativeJsonProxyElement.prototype.putString;
	oFF.NativeJsonProxyElement.prototype.putLong = oFF.NativeJsonProxyElement.prototype.putString;
	oFF.NativeJsonProxyElement.prototype.putDouble = oFF.NativeJsonProxyElement.prototype.putString;
	oFF.NativeJsonProxyElement.prototype.putNull = function(name) {
		this.m_jsonRootElement[name] = oFF.PrNull.create();
	};
	oFF.NativeJsonProxyElement.prototype.setNullByName = oFF.NativeJsonProxyElement.prototype.putNull;
	oFF.NativeJsonProxyElement.prototype.set = function(position, element) {
		this.m_jsonRootElement[position] = element;
	};
	oFF.NativeJsonProxyElement.prototype.getType = function() {
		return this.getTypeOf(this.m_jsonRootElement);
	};
	oFF.NativeJsonProxyElement.prototype.hasElements = function() {
		if (this.m_jsonRootElement !== null) {
			for ( var prop in this.m_jsonRootElement) {
				if (this.m_jsonRootElement.hasOwnProperty(prop)) {
					return true;
				}
			}
		}
		return false;
	};
	oFF.NativeJsonProxyElement.prototype.getElementTypeByKey = function(name) {
		var element = this.m_jsonRootElement[name];
		return element === undefined ? null : this.getTypeOf(element);
	};
	oFF.NativeJsonProxyElement.prototype.getTypeOf = function(element) {
		if (element === null) {
			return oFF.PrElementType.THE_NULL;
		}
		switch (typeof element) {
		case "string":
			return oFF.PrElementType.STRING;
		case "boolean":
			return oFF.PrElementType.BOOLEAN;
		case "number":
			return oFF.PrElementType.DOUBLE;
		case "object":
			if (element instanceof Array) {
				return oFF.PrElementType.LIST;
			}
			return oFF.PrElementType.STRUCTURE;
		default:
			return null;
		}
	};
	oFF.NativeJsonProxyElement.prototype.getString = function() {
		return this.m_jsonRootElement;
	};
	oFF.NativeJsonProxyElement.prototype.getStringValue = oFF.NativeJsonProxyElement.prototype.getString;
	oFF.NativeJsonProxyElement.prototype.getInteger = oFF.NativeJsonProxyElement.prototype.getString;
	oFF.NativeJsonProxyElement.prototype.getIntegerValue = oFF.NativeJsonProxyElement.prototype.getString;
	oFF.NativeJsonProxyElement.prototype.getLong = oFF.NativeJsonProxyElement.prototype.getString;
	oFF.NativeJsonProxyElement.prototype.getLongValue = oFF.NativeJsonProxyElement.prototype.getString;
	oFF.NativeJsonProxyElement.prototype.getDouble = oFF.NativeJsonProxyElement.prototype.getString;
	oFF.NativeJsonProxyElement.prototype.getDoubleValue = oFF.NativeJsonProxyElement.prototype.getString;
	oFF.NativeJsonProxyElement.prototype.getBoolean = oFF.NativeJsonProxyElement.prototype.getString;
	oFF.NativeJsonProxyElement.prototype.getBooleanValue = oFF.NativeJsonProxyElement.prototype.getString;
	oFF.NativeJsonProxyElement.prototype.setString = function(value) {
		this.m_jsonRootElement = value;
	};
	oFF.NativeJsonProxyElement.prototype.setInteger = oFF.NativeJsonProxyElement.prototype.setString;
	oFF.NativeJsonProxyElement.prototype.setIntegerValue = oFF.NativeJsonProxyElement.prototype.setString;
	oFF.NativeJsonProxyElement.prototype.setLong = oFF.NativeJsonProxyElement.prototype.setString;
	oFF.NativeJsonProxyElement.prototype.setLongValue = oFF.NativeJsonProxyElement.prototype.setString;
	oFF.NativeJsonProxyElement.prototype.setDouble = oFF.NativeJsonProxyElement.prototype.setString;
	oFF.NativeJsonProxyElement.prototype.setDoubleValue = oFF.NativeJsonProxyElement.prototype.setString;
	oFF.NativeJsonProxyElement.prototype.setBoolean = oFF.NativeJsonProxyElement.prototype.setString;
	oFF.NativeJsonProxyElement.prototype.setBooleanValue = oFF.NativeJsonProxyElement.prototype.setString;
	oFF.NativeJsonProxyElement.prototype.containsKey = function(name) {
		return this.m_jsonRootElement.hasOwnProperty(name);
	};
	oFF.NativeJsonProxyElement.prototype.containsKey = oFF.NativeJsonProxyElement.prototype.containsKey;
	oFF.NativeJsonProxyElement.prototype.getTypeOfElement = function(name) {
		var element = this.m_jsonRootElement[name];
		if (element === undefined) {
			throw new Error("Illegal State: Json Element not available: "
					+ name);
		}
		return this.getTypeOf(element);
	};
	oFF.NativeJsonProxyElement.prototype.getStringByKey = function(name) {
		var element = this.m_jsonRootElement[name];
		return element === undefined ? null : element;
	};
	oFF.NativeJsonProxyElement.prototype.getIntegerByKey = oFF.NativeJsonProxyElement.prototype.getStringByKey;
	oFF.NativeJsonProxyElement.prototype.getLongByKey = oFF.NativeJsonProxyElement.prototype.getStringByKey;
	oFF.NativeJsonProxyElement.prototype.getBooleanByKey = oFF.NativeJsonProxyElement.prototype.getStringByKey;
	oFF.NativeJsonProxyElement.prototype.getDoubleByKey = oFF.NativeJsonProxyElement.prototype.getStringByKey;
	oFF.NativeJsonProxyElement.prototype.getKeysAsReadOnlyListOfString = function() {
		var names = new oFF.XListOfString();
		for ( var attributeName in this.m_jsonRootElement) {
			if (this.m_jsonRootElement.hasOwnProperty(attributeName)) {
				names.add(attributeName);
			}
		}
		return names;
	};
	oFF.NativeJsonProxyElement.prototype.getByKey = function(name) {
		var element = this.m_jsonRootElement[name];
		if (element === null || element === undefined) {
			return null;
		}
		return new oFF.NativeJsonProxyElement(element);
	};
	oFF.NativeJsonProxyElement.prototype.getElementByName = oFF.NativeJsonProxyElement.prototype.getByKey;
	oFF.NativeJsonProxyElement.prototype.getStructureByKey = oFF.NativeJsonProxyElement.prototype.getByKey;
	oFF.NativeJsonProxyElement.prototype.getStructureByName = oFF.NativeJsonProxyElement.prototype.getByKey;
	oFF.NativeJsonProxyElement.prototype.getListByKey = oFF.NativeJsonProxyElement.prototype.getByKey;
	oFF.NativeJsonProxyElement.prototype.getListByName = oFF.NativeJsonProxyElement.prototype.getByKey;
	oFF.NativeJsonProxyElement.prototype.getElementAt = oFF.NativeJsonProxyElement.prototype.getByKey;
	oFF.NativeJsonProxyElement.prototype.getListAt = oFF.NativeJsonProxyElement.prototype.getByKey;
	oFF.NativeJsonProxyElement.prototype.getStructureAt = oFF.NativeJsonProxyElement.prototype.getByKey;
	oFF.NativeJsonProxyElement.prototype.get = oFF.NativeJsonProxyElement.prototype.getByKey;
	oFF.NativeJsonProxyElement.prototype.getStringAt = function(index) {
		return this.m_jsonRootElement[index];
	};
	oFF.NativeJsonProxyElement.prototype.getIntegerAt = oFF.NativeJsonProxyElement.prototype.getStringAt;
	oFF.NativeJsonProxyElement.prototype.getBooleanAt = oFF.NativeJsonProxyElement.prototype.getStringAt;
	oFF.NativeJsonProxyElement.prototype.getLongAt = oFF.NativeJsonProxyElement.prototype.getStringAt;
	oFF.NativeJsonProxyElement.prototype.getDoubleAt = oFF.NativeJsonProxyElement.prototype.getStringAt;
	oFF.NativeJsonProxyElement.prototype.getStringAtExt = function(index,
			defaultValue) {
		if (this.m_jsonRootElement.hasOwnProperty(index)) {
			return this.m_jsonRootElement[index];
		}
		return defaultValue;
	};
	oFF.NativeJsonProxyElement.prototype.getIntegerAtExt = oFF.NativeJsonProxyElement.prototype.getStringAtExt;
	oFF.NativeJsonProxyElement.prototype.getLongAtExt = oFF.NativeJsonProxyElement.prototype.getStringAtExt;
	oFF.NativeJsonProxyElement.prototype.getDoubleAtExt = oFF.NativeJsonProxyElement.prototype.getStringAtExt;
	oFF.NativeJsonProxyElement.prototype.getBooleanAtExt = oFF.NativeJsonProxyElement.prototype.getStringAtExt;
	oFF.NativeJsonProxyElement.prototype.size = function() {
		return this.m_jsonRootElement.length;
	};
	oFF.NativeJsonProxyElement.prototype.isEmpty = function() {
		return this.m_jsonRootElement.length === 0;
	};
	oFF.NativeJsonProxyElement.prototype.getStringByKeyExt = oFF.NativeJsonProxyElement.prototype.getStringAtExt;
	oFF.NativeJsonProxyElement.prototype.getBooleanByKeyExt = oFF.NativeJsonProxyElement.prototype.getStringAtExt;
	oFF.NativeJsonProxyElement.prototype.getIntegerByKeyExt = oFF.NativeJsonProxyElement.prototype.getStringAtExt;
	oFF.NativeJsonProxyElement.prototype.getLongByKeyExt = oFF.NativeJsonProxyElement.prototype.getStringAtExt;
	oFF.NativeJsonProxyElement.prototype.getDoubleByKeyExt = oFF.NativeJsonProxyElement.prototype.getStringAtExt;
	oFF.NativeJsonProxyElement.prototype.getObjectByKeyExt = oFF.NativeJsonProxyElement.prototype.getStringAtExt;
	oFF.NativeJsonProxyElement.prototype.putStringNotNull = function(name,
			value) {
		if (value !== null) {
			this.m_jsonRootElement[name] = value;
		}
	};
	oFF.NativeJsonProxyElement.prototype.putStringNotNullAndNotEmpty = function(
			name, value) {
		if (oFF.XStringUtils.isNotNullAndNotEmpty(value)) {
			this.m_jsonRootElement[name] = value;
		}
	};
	oFF.NativeJsonProxyElement.prototype.putNewList = function(name) {
		this.m_jsonRootElement[name] = [];
		return new oFF.NativeJsonProxyElement(this.m_jsonRootElement[name]);
	};
	oFF.NativeJsonProxyElement.prototype.setNewListByKey = oFF.NativeJsonProxyElement.prototype.putNewList;
	oFF.NativeJsonProxyElement.prototype.addAllStrings = function(list) {
		if (list !== undefined && list !== null) {
			this.m_jsonRootElement.push.apply(this.m_jsonRootElement, list);
		}
		return this;
	};
	oFF.NativeJsonProxyElement.prototype.putNewStructure = function(name) {
		this.m_jsonRootElement[name] = {};
		return new oFF.NativeJsonProxyElement(this.m_jsonRootElement[name]);
	};
	oFF.NativeJsonProxyElement.prototype.setNewStructureByKey = oFF.NativeJsonProxyElement.prototype.putNewStructure;
	oFF.NativeJsonProxyElement.prototype.getKeysAsReadOnlyListOfStringSorted = function() {
		var structureElementNames = this.getKeysAsReadOnlyListOfString();
		if (structureElementNames === null || structureElementNames.isEmpty()) {
			return structureElementNames;
		}
		structureElementNames.sortByDirection(oFF.XSortDirection.ASCENDING);
		return structureElementNames;
	};
	oFF.NativeJsonProxyElement.prototype.hasStringByKey = function(name) {
		if (this.containsKey(name)) {
			return this.getElementTypeByKey(name) === oFF.PrElementType.STRING;
		}
		return false;
	};
	oFF.NativeJsonProxyElement.prototype.hasStringByName = oFF.NativeJsonProxyElement.prototype.hasStringByKey;
	oFF.NativeJsonProxyElement.prototype.getValuesAsReadOnlyList = function() {
		return this;
	};
	oFF.NativeGoogleHttpRequest = function() {
		this.m_options = {
			"headers" : {},
			"followRedirects" : false
		};
		this.m_url = null;
		this.m_response = null;
		this.onreadystatechange = null;
		this.readyState = oFF.NativeGoogleHttpRequest.UNSENT;
		this.status = 0;
		this.statusText = null;
		this.responseText = null;
		this._ff_c = "NativeGoogleHttpRequest";
	};
	oFF.NativeGoogleHttpRequest.prototype = new oFF.XObject();
	oFF.NativeGoogleHttpRequest.UNSENT = 0;
	oFF.NativeGoogleHttpRequest.OPENED = 1;
	oFF.NativeGoogleHttpRequest.DONE = 4;
	oFF.NativeGoogleHttpRequest.prototype.releaseObject = function() {
		this.m_url = null;
		this.m_response = oFF.XObjectExt.release(this.m_response);
		this.onreadystatechange = null;
		this.statusText = null;
		this.responseText = null;
		oFF.XObject.prototype.releaseObject.call(this);
	};
	oFF.NativeGoogleHttpRequest.prototype.setCookies = function(cookies) {
		var cookieList = cookies.getCookies();
		if (cookieList.size() > 0) {
			var cookieStr = "";
			for (var i = 0; i < cookieList.size(); i++) {
				var cookie = cookieList.get(i);
				cookieStr += cookie.getName() + "=" + cookie.getValue() + "; ";
			}
			this.m_options.headers["Cookie"] = cookieStr.substring(0,
					cookieStr.length - 2);
		}
	};
	oFF.NativeGoogleHttpRequest.prototype.open = function(requestMethodName,
			url, isAsync) {
		this.m_options["method"] = requestMethodName.toLowerCase();
		this.m_url = url;
		this.readyState = oFF.NativeGoogleHttpRequest.OPENED;
		this.status = 0;
		this.statusText = null;
		this.responseText = null;
	};
	oFF.NativeGoogleHttpRequest.prototype.setRequestHeader = function(key,
			value) {
		this.m_options.headers[key] = value;
	};
	oFF.NativeGoogleHttpRequest.prototype.send = function(content) {
		if (content) {
			this.m_options["payload"] = content;
		}
		this.m_response = oFF.GoogleUrlFetchApp.fetch(this.m_url,
				this.m_options);
		this.readyState = oFF.NativeGoogleHttpRequest.DONE;
		this.status = this.m_response.getResponseCode();
		this.responseText = this.m_response.getContentText();
		this.onreadystatechange();
	};
	oFF.NativeGoogleHttpRequest.prototype.getResponseHeader = function(header) {
		var allHeaders = this.getAllResponseHeaders();
		return allHeaders ? allHeaders[header] : null;
	};
	oFF.NativeGoogleHttpRequest.prototype.getAllResponseHeaders = function() {
		if (this.m_response) {
			return this.m_response.getAllHeaders();
		}
		return null;
	};
	oFF.NativeHttpClient = function(session) {
		oFF.DfHttpClient.call(this);
		this.m_xmlHttpRequest = null;
		this.m_isOnAjaxEventExecuted = false;
		oFF.DfHttpClient.prototype.setupHttpClient.call(this, session);
		this._ff_c = "NativeHttpClient";
	};
	oFF.NativeHttpClient.prototype = new oFF.DfHttpClient();
	oFF.NativeHttpClient.parseResponseHeaders = function(headerStr,
			headerFields) {
		if (headerStr !== null) {
			if (oFF.XSystemUtils.isGoogleAppsScript()) {
				for ( var h in headerStr) {
					if (h !== oFF.HttpConstants.HD_SET_COOKIE) {
						headerFields.put(h, headerStr[h]);
					}
				}
			} else {
				var headerPairs = headerStr.split("\u000d\u000a");
				var headerLength = headerPairs.length;
				var oHttpConstants = oFF.HttpConstants;
				for (var i = 0; i < headerLength; i++) {
					var headerPair = headerPairs[i];
					var index = headerPair.indexOf("\u003a\u0020");
					if (index > 0) {
						var key = headerPair.substring(0, index).replace(
								/(^\u000d\u000a?)|(^\u000a?)/, "");
						var value = headerPair.substring(index + 2);
						headerFields.put(oHttpConstants.lookupCamelCase(key),
								value);
					}
				}
			}
		}
	};
	oFF.NativeHttpClient.prototype.abort = function() {
		this.m_xmlHttpRequest.abort();
	};
	oFF.NativeHttpClient.prototype.releaseObject = function() {
		this.m_xmlHttpRequest = null;
		this.m_response = oFF.XObjectExt.release(this.m_response);
		this.m_isOnAjaxEventExecuted = null;
		oFF.DfHttpClient.prototype.releaseObject.call(this);
	};
	oFF.NativeHttpClient.prototype.onAjaxEvent = function() {
		var xmlHttpRequest = this.m_xmlHttpRequest;
		if (xmlHttpRequest !== null && xmlHttpRequest.readyState === 4) {
			this.addProfileStep("Receive http response");
			this.m_response = oFF.HttpResponse
					.createResponse(this.getRequest());
			this.m_isOnAjaxEventExecuted = true;
			if (oFF.XSystemUtils.isNode()
					|| oFF.XSystemUtils.isGoogleAppsScript()) {
				var cookies = oFF.HttpCookies.create();
				var cookiesResponseHeaders = xmlHttpRequest
						.getResponseHeader(oFF.HttpConstants.HD_SET_COOKIE);
				for ( var h in cookiesResponseHeaders) {
					if (cookiesResponseHeaders.hasOwnProperty(h)) {
						cookies
								.addByHttpServerResponseValue(cookiesResponseHeaders[h]);
					}
				}
				this.m_response.setCookies(cookies);
				this.m_response.setCookiesMasterStore(this.getRequest()
						.getCookiesMasterStore());
				this.m_response.applyCookiesToMasterStorage();
			}
			this.m_response.setStatusCode(xmlHttpRequest.status);
			this.m_response.setStatusCodeDetails(xmlHttpRequest.statusText);
			var allResponseHeaders = xmlHttpRequest.getAllResponseHeaders();
			var headerFields = this.m_response.getHeaderFieldsBase();
			oFF.NativeHttpClient.parseResponseHeaders(allResponseHeaders,
					headerFields);
			if (xmlHttpRequest.status >= 200 && xmlHttpRequest.status <= 299) {
				var contentTypeValue = headerFields
						.getByKey(oFF.HttpConstants.HD_CONTENT_TYPE);
				if (contentTypeValue !== null) {
					contentTypeValue = contentTypeValue.toLowerCase();
					var delimiter = contentTypeValue.indexOf(";");
					if (delimiter !== -1) {
						contentTypeValue = contentTypeValue.substring(0,
								delimiter);
					}
				}
				var contentType = oFF.ContentType.lookup(contentTypeValue);
				if (contentType === null) {
					this.m_response.setContentTypeValue(contentTypeValue);
				} else {
					this.m_response.setContentType(contentType);
					if (contentType.isText()) {
						var content = xmlHttpRequest.responseText;
						this.m_response.setString(content);
						if (contentType === oFF.ContentType.APPLICATION_JSON) {
							if (content !== null && content.length > 0) {
								try {
									this.addProfileStep("Parse json");
									var jsonRootElement = JSON.parse(content);
									var ocpRootElement = new oFF.NativeJsonProxyElement(
											jsonRootElement);
									this.m_response
											.setJsonObject(ocpRootElement);
								} catch (e) {
									this
											.addError(
													oFF.JsonParserErrorCode.JSON_PARSER_ILLEGAL_STATE,
													e.message);
								}
							}
						}
					}
				}
			}
			this.setData(this.m_response);
			this.endSync();
			this.m_xmlHttpRequest = null;
		}
	};
	oFF.NativeHttpClient.prototype.processSynchronization = function(syncType) {
		var oHttpConstants = oFF.HttpConstants;
		var oHttpRequestMethod = oFF.HttpRequestMethod;
		var request = this.prepareRequest();
		this.m_xmlHttpRequest = null;
		if (oFF.XSystemUtils.isXS()) {
			this.m_xmlHttpRequest = new $Global.XMLHttpRequest();
		} else {
			if (oFF.XSystemUtils.isNode()) {
				this.m_xmlHttpRequest = new oFF.NodeJsXMLHttpRequest();
				var cookies;
				if (typeof window !== "undefined" && window && window.options
						&& window.options.isMobile && oFF.userSession) {
					cookies = oFF.HttpCookies.create();
					cookies
							.addByHttpClientRequestValue(oFF.userSession.cookies);
				} else {
					cookies = this.getRequest().getCookies();
				}
				this.m_xmlHttpRequest.setCookies(cookies);
			} else {
				if (oFF.XSystemUtils.isGoogleAppsScript()) {
					this.m_xmlHttpRequest = new oFF.NativeGoogleHttpRequest();
					this.m_xmlHttpRequest.setCookies(this.getRequest()
							.getCookies());
				} else {
					this.m_xmlHttpRequest = new XMLHttpRequest();
				}
			}
		}
		if (this.m_xmlHttpRequest !== null) {
			var xmlHttpRequest = this.m_xmlHttpRequest;
			var isAsync = syncType === oFF.SyncType.NON_BLOCKING;
			var url = request.getUriStringWithoutAuthentication();
			var oRequestMethod = request.getMethod();
			xmlHttpRequest.open(oRequestMethod.getName(), url, isAsync);
			if (oRequestMethod === oHttpRequestMethod.HTTP_POST
					|| oRequestMethod === oHttpRequestMethod.HTTP_PUT) {
				var requestContentType = request.getContentType().getName()
						+ ";charset=UTF-8";
				xmlHttpRequest.setRequestHeader(oHttpConstants.HD_CONTENT_TYPE,
						requestContentType);
			}
			xmlHttpRequest.setRequestHeader(oHttpConstants.HD_ACCEPT, request
					.getAcceptContentType().getName());
			var authType = request.getAuthenticationType();
			if (authType === oFF.AuthenticationType.BASIC) {
				var valueUnencoded = request.getUser() + ":"
						+ request.getPassword();
				var valueEncoded = oHttpConstants.VA_AUTHORIZATION_BASIC + " "
						+ oFF.Base64.encode(valueUnencoded);
				xmlHttpRequest.setRequestHeader(
						oHttpConstants.HD_AUTHORIZATION, valueEncoded);
			} else {
				if (authType === oFF.AuthenticationType.BEARER) {
					var bearer = request.getAccessToken();
					if (bearer === null) {
						bearer = request.getAuthenticationToken()
								.getAccessToken();
					}
					if (bearer !== null) {
						xmlHttpRequest.setRequestHeader(
								oHttpConstants.HD_AUTHORIZATION,
								oHttpConstants.VA_AUTHORIZATION_BEARER + " "
										+ bearer);
					}
				} else {
					if (authType === oFF.AuthenticationType.SCP_OPEN_CONNECTORS) {
						var user = request.getUser();
						var organization = request.getOrganization();
						var element = request.getElement();
						var authentication = oFF.XStringBuffer.create();
						authentication.append(oHttpConstants.HD_USER).append(
								" ").append(user);
						authentication.append(", ");
						authentication.append(oHttpConstants.HD_ORGANIZATION)
								.append(" ").append(organization);
						authentication.append(", ");
						authentication.append(oHttpConstants.HD_ELEMENT)
								.append(" ").append(element);
						xmlHttpRequest.setRequestHeader(
								oHttpConstants.HD_AUTHORIZATION, authentication
										.toString());
					}
				}
			}
			var lang = request.getLanguage();
			if (lang !== null) {
				xmlHttpRequest.setRequestHeader(
						oHttpConstants.HD_ACCEPT_LANGUAGE, lang);
			}
			var headerFields = request.getHeaderFields();
			var headerKeys = headerFields.getKeysAsIteratorOfString();
			while (headerKeys.hasNext()) {
				var currentKey = headerKeys.next();
				xmlHttpRequest.setRequestHeader(currentKey, headerFields
						.getByKey(currentKey));
			}
			xmlHttpRequest.onreadystatechange = this.onAjaxEvent.bind(this);
			if (this._sendInternal(request) === false) {
				return false;
			}
			if (!isAsync) {
				if (!this.m_isOnAjaxEventExecuted) {
					this.onAjaxEvent();
					this.m_xmlHttpRequest = null;
				}
			}
			return true;
		}
		this.addError(oFF.HttpErrorCode.HTTP_MISSING_NATIVE_DRIVER,
				"XMLHttpRequest not supported");
		return false;
	};
	oFF.NativeHttpClient.prototype._sendInternal = function(request) {
		var oHttpRequestMethod = oFF.HttpRequestMethod;
		try {
			this.m_isOnAjaxEventExecuted = false;
			this.addProfileStep("### SERVER ###");
			if (request.getMethod() === oHttpRequestMethod.HTTP_POST
					|| request.getMethod() === oHttpRequestMethod.HTTP_PUT) {
				this.m_xmlHttpRequest.send(request.getString());
			} else {
				this.m_xmlHttpRequest.send(null);
			}
			return true;
		} catch (e) {
			this.addError(oFF.HttpErrorCode.HTTP_IO_EXCEPTION, e.message);
			return false;
		}
	};
	oFF.NativeHttpClientFactory = function() {
		oFF.HttpClientFactory.call(this);
		this._ff_c = "NativeHttpClientFactory";
	};
	oFF.NativeHttpClientFactory.prototype = new oFF.HttpClientFactory();
	oFF.NativeHttpClientFactory.staticSetup = function() {
		var factory = new oFF.NativeHttpClientFactory();
		oFF.HttpClientFactory.setHttpClientFactoryForProtocol(
				oFF.ProtocolType.HTTPS, factory);
		oFF.HttpClientFactory.setHttpClientFactoryForProtocol(
				oFF.ProtocolType.HTTP, factory);
	};
	oFF.NativeHttpClientFactory.prototype.newHttpClientInstance = function(
			session) {
		return new oFF.NativeHttpClient(session);
	};
	oFF.RpcFunctionInaDB = function() {
		oFF.DfRpcFunction.call(this);
		this.m_name = null;
		this._ff_c = "RpcFunctionInaDB";
	};
	oFF.RpcFunctionInaDB.prototype = new oFF.DfRpcFunction();
	oFF.RpcFunctionInaDB.prototype.setupRpcFunction = function(session,
			connectionInfo, name) {
		this.m_name = name;
		this.setupFunction(session, connectionInfo, null);
	};
	oFF.RpcFunctionInaDB.prototype.releaseObject = function() {
		this.m_name = null;
		oFF.DfRpcFunction.prototype.releaseObject.call(this);
	};
	oFF.RpcFunctionInaDB.prototype.getName = function() {
		return this.m_name;
	};
	oFF.RpcFunctionInaDB.prototype.processSynchronization = function() {
		var path = this.getName();
		var request;
		var response;
		var requestStructure;
		var requestJsonString;
		var responseJsonString = null;
		var jsonParser;
		var jsonElement;
		var fnDebug = $.trace.debug;
		if (oFF.XStringUtils.isNullOrEmpty(path)) {
			this.addError(1001, " path null");
			return false;
		}
		request = this.getRequest();
		if (request === null) {
			this.addError(1002, "request null");
			return false;
		}
		response = this.getResponse();
		if (response === null) {
			this.addError(1003, "response null");
			return false;
		}
		requestStructure = request.getRequestStructure();
		if (requestStructure === null) {
			requestJsonString = "{}";
		} else {
			requestJsonString = oFF.PrUtils.serialize(requestStructure, false,
					false, 0);
		}
		if (path === "/sap/bc/ina/service/v2/GetServerInfo") {
			fnDebug("Ina-Request:");
			fnDebug(requestJsonString);
			responseJsonString = $.db.ina.getServiceInfo(requestJsonString);
			fnDebug("Ina-Response:");
			fnDebug(responseJsonString);
		} else {
			if (path === "/sap/bc/ina/service/v2/GetResponse") {
				fnDebug("Ina-Request:");
				fnDebug(requestJsonString);
				responseJsonString = $.db.ina.getResponse(requestJsonString);
				fnDebug("Ina-Response:");
				fnDebug(responseJsonString);
			} else {
				if (path !== "/sap/hana/xs/formLogin/logout.xscfunc") {
					this.addError(1004, "illegal path");
					return false;
				}
				responseJsonString = null;
			}
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(responseJsonString)) {
			jsonParser = oFF.JsonParserFactory.newInstance();
			jsonElement = jsonParser.parse(responseJsonString);
			if (jsonParser.hasErrors()) {
				this.addAllMessages(jsonParser);
				return false;
			} else {
				if (jsonElement !== null) {
					if (jsonElement.getType() !== oFF.PrElementType.STRUCTURE) {
						this.addError(1005, "wrong json response type");
						return false;
					} else {
						response.setRootElement(jsonElement);
					}
				}
			}
		}
		this.setData(response);
		return false;
	};
	oFF.RpcFunctionInaSql = function() {
		oFF.DfRpcFunction.call(this);
		this.m_name = null;
		this._ff_c = "RpcFunctionInaSql";
	};
	oFF.RpcFunctionInaSql.prototype = new oFF.DfRpcFunction();
	oFF.RpcFunctionInaSql.prototype.setupRpcFunction = function(session,
			connectionInfo, name) {
		this.m_name = name;
		this.setupFunction(session, connectionInfo, null);
	};
	oFF.RpcFunctionInaSql.prototype.releaseObject = function() {
		this.m_name = null;
		oFF.DfRpcFunction.prototype.releaseObject.call(this);
	};
	oFF.RpcFunctionInaSql.prototype.getName = function() {
		return this.m_name;
	};
	oFF.RpcFunctionInaSql.prototype.processSynchronization = function() {
		var path = this.getName();
		var request;
		var response;
		var requestJsonString;
		var responseJsonString;
		var jsonParser;
		var jsonElement;
		var connection;
		var call;
		if (oFF.XStringUtils.isNullOrEmpty(path)) {
			this.addError(1001, " path null");
			return false;
		}
		request = this.getRequest();
		if (request === null) {
			this.addError(1002, "request null");
			return false;
		}
		response = this.getResponse();
		if (response === null) {
			this.addError(1003, "response null");
			return false;
		}
		connection = request.getConnectionInfo().getNativeConnection();
		if (typeof connection.prepareCall !== "function") {
			this
					.addError(1004,
							"Native connection has to be a $.db connection");
			return false;
		}
		if (path === "/sap/bc/ina/service/v2/GetServerInfo") {
			call = connection
					.prepareCall("CALL SYS.EXECUTE_MDS('GetServerInfo', '', '', '', '', '', ?)");
			call.execute();
			responseJsonString = call.getNClob(1);
		} else {
			if (path === "/sap/bc/ina/service/v2/GetResponse") {
				var requestType = request.getRequestType();
				if (requestType === oFF.RpcRequestType.NONE) {
					this.addError(1005, "No request structure was set");
					return false;
				} else {
					if (requestType === oFF.RpcRequestType.UNKNOWN) {
						this.addError(1006, "Unknown request type: "
								+ requestJsonString);
						return false;
					} else {
						if (requestType === oFF.RpcRequestType.BATCH) {
							requestType = oFF.RpcRequestType.ANALYTICS;
						}
					}
				}
				requestJsonString = oFF.PrUtils.serialize(request
						.getRequestStructure(), false, false, 0);
				call = connection.prepareCall("CALL EXECUTE_MDS('"
						+ requestType.getName() + "', '', '', '', '', ?, ?)");
				call.setNClob(1, requestJsonString);
				call.execute();
				responseJsonString = call.getNClob(2);
			} else {
				if (path === "/sap/hana/xs/formLogin/logout.xscfunc") {
					responseJsonString = null;
				} else {
					this.addError(1007, "illegal path");
					return false;
				}
			}
		}
		if (oFF.XStringUtils.isNotNullAndNotEmpty(responseJsonString)) {
			jsonParser = oFF.JsonParserFactory.newInstance();
			jsonElement = jsonParser.parse(responseJsonString);
			if (jsonParser.hasErrors()) {
				this.addAllMessages(jsonParser);
				return false;
			} else {
				if (jsonElement !== null) {
					if (jsonElement.getType() !== oFF.PrElementType.STRUCTURE) {
						this.addError(1008, "wrong json response type");
						return false;
					} else {
						response.setRootElement(jsonElement);
					}
				}
			}
		}
		this.setData(response);
		return false;
	};
	oFF.RpcFunctionInaServerFactory = function() {
		oFF.RpcFunctionFactory.call(this);
		this._ff_c = "RpcFunctionInaServerFactory";
	};
	oFF.RpcFunctionInaServerFactory.prototype = new oFF.RpcFunctionFactory();
	oFF.RpcFunctionInaServerFactory.staticSetup = function() {
		if (typeof $ !== "undefined" && $.db !== undefined
				&& $.db.ina !== undefined) {
			var newFactory = new oFF.RpcFunctionInaServerFactory();
			oFF.RpcFunctionFactory.registerFactory(oFF.ProtocolType.INA_DB,
					null, newFactory);
			oFF.RpcFunctionFactory.registerFactory(oFF.ProtocolType.INA_SQL,
					null, newFactory);
		}
	};
	oFF.RpcFunctionInaServerFactory.prototype.newRpcFunction = function(
			context, connectionInfo, name, systemType, protocolType) {
		var rpcFunction = null;
		if (protocolType === oFF.ProtocolType.INA_DB) {
			rpcFunction = new oFF.RpcFunctionInaDB();
		} else {
			if (protocolType === oFF.ProtocolType.INA_SQL) {
				rpcFunction = new oFF.RpcFunctionInaSql();
			}
		}
		var session = context.getSession();
		rpcFunction.setupRpcFunction(session, connectionInfo, name);
		return rpcFunction;
	};
	oFF.NativeNetworkEnv = function() {
		oFF.NetworkEnv.call(this);
		this._ff_c = "NativeNetworkEnv";
	};
	oFF.NativeNetworkEnv.prototype = new oFF.NetworkEnv();
	oFF.NativeNetworkEnv.staticSetup = function() {
		oFF.NetworkEnv.setNative(new oFF.NativeNetworkEnv());
	};
	oFF.NativeNetworkEnv.prototype.getNativeLocation = function() {
		var oUri = oFF.XUri.create();
		if (oFF.XSystemUtils.isBrowser()) {
			var location = window.location;
			var protocol = location.protocol;
			var index = protocol.indexOf(":");
			if (index !== -1) {
				protocol = protocol.substring(0, index);
			}
			oUri.setScheme(protocol);
			oUri.setHost(location.hostname);
			var port = 0;
			if (location.port !== null && location.port !== "") {
				port = parseInt(location.port);
				if (isNaN(port)) {
					port = 0;
				}
			}
			oUri.setPort(port);
			oUri.setPath(location.pathname);
			var hash = location.hash;
			if (hash !== null && hash !== "") {
				if (hash.indexOf("#") === 0) {
					hash = hash.substring(1);
				}
				hash = decodeURIComponent(hash);
				oUri.setFragment(hash);
			}
			var search = location.search;
			if (search !== null && search !== "") {
				search = decodeURIComponent(search);
				oUri.setQuery(search);
			}
		}
		return oUri;
	};
	oFF.NativeNetworkEnv.prototype.getNativeFragment = function() {
		return this.getNativeLocation().getFragment();
	};
	oFF.NativeNetworkEnv.prototype.setNativeFragment = function(fragment) {
		if (oFF.XSystemUtils.isBrowser()) {
			window.location.hash = fragment;
		}
	};
	oFF.NativeNetworkEnv.prototype.setNativeDomain = function(domain) {
		if (oFF.XSystemUtils.isBrowser()) {
			document.domain = domain;
		}
	};
	oFF.NativeJsonExtractor = function() {
		oFF.DfDocumentParser.call(this);
		this._ff_c = "NativeJsonExtractor";
	};
	oFF.NativeJsonExtractor.prototype = new oFF.DfDocumentParser();
	oFF.NativeJsonExtractor.staticSetup = function() {
		oFF.XJson.setJsonExtractor(new oFF.NativeJsonExtractor());
	};
	oFF.NativeJsonExtractor.prototype.extractJsonContent = function(content) {
		if (content instanceof oFF.XJson) {
			return content.getElement();
		}
		return oFF.PrUtils.deepCopyElement(new oFF.NativeJsonProxyElement(
				content));
	};
	oFF.NativeUserSettingsFactory = function() {
		oFF.XUserSettingsFactory.call(this);
		this._ff_c = "NativeUserSettingsFactory";
	};
	oFF.NativeUserSettingsFactory.prototype = new oFF.XUserSettingsFactory();
	oFF.NativeUserSettingsFactory.staticSetup = function() {
		oFF.XUserSettingsFactory
				.registerFactory(new oFF.NativeUserSettingsFactory());
	};
	oFF.NativeUserSettingsFactory.prototype.newUserSettings = function(session) {
		return oFF.NativeUserSettings.create(session);
	};
	oFF.NativeUserSettings = function(session) {
		this.m_session = session;
		oFF.DfUserSettings.call(this);
		this._ff_c = "NativeUserSettings";
	};
	oFF.NativeUserSettings.prototype = new oFF.DfUserSettings();
	oFF.NativeUserSettings.create = function(session) {
		return new oFF.NativeUserSettings(session);
	};
	oFF.NativeUserSettings.releaseObject = function() {
		this.m_session = null;
		oFF.DfUserSettings.prototype.releaseObject.call(this);
	};
	oFF.NativeUserSettings.prototype.getStringByKey = function(name) {
		return localStorage.getItem(name);
	};
	oFF.NativeUserSettings.prototype.getStringByKeyExt = function(name,
			defaultValue) {
		if (localStorage.getItem(name) === null
				|| localStorage.getItem(name) === undefined) {
			return defaultValue;
		}
		return this.getStringByKey(name);
	};
	oFF.NativeUserSettings.prototype.putString = function(name, value) {
		localStorage.setItem(name, value);
	};
	oFF.NativeUserSettings.prototype.getBooleanByKey = function(name) {
		return localStorage.getItem(name) === "true";
	};
	oFF.NativeUserSettings.prototype.getBooleanByKeyExt = function(name,
			defaultValue) {
		if (localStorage.getItem(name) === null
				|| localStorage.getItem(name) === undefined) {
			return defaultValue;
		}
		return this.getBooleanByKey(name);
	};
	oFF.NativeUserSettings.prototype.putBoolean = function(name, value) {
		localStorage.setItem(name, value);
	};
	oFF.NativeUserSettings.prototype.getIntegerByKey = function(name) {
		return parseInt(localStorage.getItem(name), 10);
	};
	oFF.NativeUserSettings.prototype.getIntegerByKeyExt = function(name,
			defaultValue) {
		if (localStorage.getItem(name) === null
				|| localStorage.getItem(name) === undefined) {
			return defaultValue;
		}
		return this.getIntegerByKey(name);
	};
	oFF.NativeUserSettings.prototype.putInteger = function(name, value) {
		localStorage.setItem(name, value);
	};
	oFF.IoNativeModule = function() {
		oFF.DfModule.call(this);
		this._ff_c = "IoNativeModule";
	};
	oFF.IoNativeModule.prototype = new oFF.DfModule();
	oFF.IoNativeModule.s_module = null;
	oFF.IoNativeModule.getInstance = function() {
		return oFF.IoNativeModule.initVersion(oFF.XVersion.API_DEFAULT);
	};
	oFF.IoNativeModule.initVersion = function(version) {
		var oNativeModule = oFF.IoNativeModule;
		if (oNativeModule.s_module === null) {
			if (oFF.IoModule.initVersion(version) === null) {
				throw new Error("Initialization Exception");
			}
			oNativeModule.s_module = new oFF.IoNativeModule();
			oFF.NativeXFileSystem.staticSetup();
			oFF.NativeXFileSystemFactory.staticSetup();
			oFF.NativeNetworkEnv.staticSetup();
			oFF.NativeDispatcher.staticSetup();
			oFF.NativeJsonParserFactory.staticSetup();
			oFF.NativeHttpClientFactory.staticSetup();
			oFF.RpcFunctionInaServerFactory.staticSetup();
			oFF.NativeJsonExtractor.staticSetup();
			oFF.NativeUserSettingsFactory.staticSetup();
			if (oFF.XSystemUtils.isNode()) {
				oFF.userSession = {};
			}
		}
		return oNativeModule.s_module;
	};
	oFF.IoNativeModule.getInstance();
})(sap.firefly);