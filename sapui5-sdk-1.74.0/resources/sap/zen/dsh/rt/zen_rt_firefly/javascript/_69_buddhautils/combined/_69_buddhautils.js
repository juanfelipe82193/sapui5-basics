(function(sap_buddha, oFF) {
	var $Firefly = {
		createByPrototype : function(thePrototype) {
			var F = function() {
			};
			F.prototype = thePrototype;
			return new F();
		},
		createClass : function(fullQualifiedClassName, superClass,
				classDefinition) {
			var namespaceArray;
			if (Object.prototype.toString.call(fullQualifiedClassName) === "[object Array]") {
				namespaceArray = fullQualifiedClassName;
			} else {
				namespaceArray = fullQualifiedClassName.split(".");
			}
			var parent = $Global;
			var currentElementName;
			var currentElement;
			var i;
			var errorMessage;
			var namespaceLen = namespaceArray.length - 1;
			for (i = 0; i < namespaceLen; i++) {
				currentElementName = namespaceArray[i];
				currentElement = parent[currentElementName];
				if (currentElement === undefined) {
					parent[currentElementName] = {};
					currentElement = parent[currentElementName];
				}
				parent = currentElement;
			}
			currentElementName = namespaceArray[namespaceLen];
			var ffClass = function() {
			};
			ffClass.prototype = {};
			if (superClass !== null) {
				if (superClass === undefined) {
					errorMessage = "$Firefly.createClass " + currentElementName
							+ " failed due to missing superClass";
					if ((typeof jstestdriver !== "undefined")
							&& (jstestdriver.console)) {
						jstestdriver.console.log(errorMessage);
					} else {
						if ((typeof $ !== undefined) && ($.db) && ($.db.ina)
								&& ($.trace)) {
							$.trace.debug("Firefly: " + errorMessage);
						} else {
							if ((typeof module !== "undefined")
									&& (this.module !== module)
									&& (module.exports)) {
								console.log(errorMessage);
							} else {
								if ($Global.console) {
									$Global.console.log(errorMessage);
								}
							}
						}
					}
					return;
				}
				ffClass = function() {
					superClass.call(this);
				};
				var SuperClass = superClass;
				ffClass.prototype = new SuperClass();
				ffClass.$superclass = superClass.prototype;
			}
			var myPrototype = ffClass.prototype;
			var property;
			var staticProperty;
			var myStatics;
			for (property in classDefinition) {
				if (classDefinition.hasOwnProperty(property)) {
					if (property === "$statics") {
						myStatics = classDefinition[property];
						for (staticProperty in myStatics) {
							if (myStatics.hasOwnProperty(staticProperty)) {
								ffClass[staticProperty] = myStatics[staticProperty];
							}
						}
					} else {
						myPrototype[property] = classDefinition[property];
					}
				}
			}
			ffClass.clazzName = currentElementName;
			parent[currentElementName] = ffClass;
		}
	};
	$Firefly
			.createClass(
					"sap.buddha.XWindow",
					oFF.XObject,
					{
						$statics : {
							create : function() {
								var w = new sap.buddha.XWindow();
								w.initBase();
								return w;
							}
						},
						oPage : null,
						bSFinMode : false,
						globalVarMap : null,
						toString : function() {
							return "[???]";
						},
						m_booleanValue : false,
						initBase : function() {
							this.context = {};
							this.globalVarMap = oFF.XHashMapByString.create();
							var that = this;
							var bDebugMode = jQuery.sap.debug();
							if (bDebugMode) {
								var myFunction = function(e) {
									if (e.ctrlKey && e.altKey && e.which === 90) {
										that.oPage.getSupportZip();
									}
								};
								$(document).unbind("keydown.dssupportzip")
										.bind("keydown.dssupportzip",
												myFunction);
							}
							this.context.exec = function(s) {
								try {
									with (this) {
										eval(s);
									}
								} catch (e) {
									if (that.oPage) {
										var s = "Error during script execution of ("
												+ s + ")";
										if (e.message) {
											s += ": " + e.message;
											that.oPage
													.createErrorMessage(e.message);
										} else {
											that.oPage
													.createErrorMessage("Error during script execution");
										}
										var logging = that.oPage.getLogging();
										if ((logging != null)
												&& logging
														.isLoggable(
																sap.buddha.XLogging.XDEBUG,
																null)) {
											logging
													.debug(
															"XWindow: exception during script execution",
															s, null);
										} else {
											jQuery.sap.log
													.error(
															"XWindow: exception during script execution",
															s);
										}
									}
									return false;
								}
								return true;
							};
							this.context.putScript = function(name, script) {
								try {
									with (this) {
										that.context[name] = eval(script);
									}
								} catch (e) {
									if (that.oPage) {
										var s = "Error during script execution of ("
												+ s + ")";
										if (e.message) {
											s += ": " + e.message;
										}
										that.oPage.createErrorMessage(s);
									}
									return false;
								}
								return true;
							};
						},
						putInContext : function(name, obj) {
							this.context[name] = obj;
						},
						setEnumContext : function(name, obj) {
							var nativeElement = obj.getNativeElement();
							this.context[name] = nativeElement;
						},
						getContext : function(name) {
							return this.context[name];
						},
						execute : function(script) {
							if (script) {
								try {
									this.context.exec(script);
								} catch (e) {
									if (this.oPage) {
										this.oPage
												.createErrorMessage(e.message);
									}
									return false;
								}
							}
							this.captureGlobalVariables();
							return true;
						},
						toString : function() {
							return "";
						},
						setPage : function(oPageGiven) {
							this.oPage = oPageGiven;
						},
						setSFinMode : function(bSFinMode) {
							this.bSFinMode = bSFinMode;
							sap.zen.getLoadingIndicator(this.bSFinMode);
						},
						dispatchJsonString : function(zenJson, initial) {
							zenJson = unescape(zenJson);
							var doc = jQuery.parseJSON(zenJson);
							var dispatcher = sap.zen.Dispatcher.instance;
							if (initial == false) {
								doc = doc.delta;
								if (!(doc instanceof Array)) {
									var arr = [];
									arr.push(doc);
									doc = arr;
								}
								if (doc.length > 0) {
									setTimeout(function() {
										dispatcher.dispatchDelta(doc);
									}, 1);
								}
							} else {
								var sapbi_phxObj = dispatcher
										.dispatchCreateControl(
												doc.component,
												function(oRootGrid) {
													oRootGrid
															.placeAt(
																	"sapbi_snippet_ROOT",
																	"only");
												});
							}
						},
						showLoadingIndicator : function() {
							var loadingIndicator = sap.zen
									.getLoadingIndicator();
							if (loadingIndicator) {
								loadingIndicator.show();
							}
						},
						showImmediatelyLoadingIndicator : function() {
							var loadingIndicator = sap.zen
									.getLoadingIndicator();
							if (loadingIndicator) {
								loadingIndicator.showImmediately();
							}
						},
						hideLoadingIndicator : function() {
							var loadingIndicator = sap.zen
									.getLoadingIndicator();
							if (loadingIndicator) {
								loadingIndicator.hideAsync();
							}
						},
						setExecuteShowHideLoadingIndicator : function(
								bExecuteShowHide) {
							var loadingIndicator = sap.zen
									.getLoadingIndicator();
							if (loadingIndicator) {
								loadingIndicator
										.setExecuteShowHide(bExecuteShowHide);
							}
						},
						dispatchJsonObject : function(json, initial, pageId) {
							if (!window.buddhaDispatchQueue) {
								window.buddhaDispatchQueue = [];
							}
							if (!this.oPage.hasRootControlBeenRendered()
									|| window.buddhaDispatchQueue.length > 0) {
								var that = this;
								var loInterval = setInterval(
										function() {
											if (that.oPage
													.hasRootControlBeenRendered()
													&& window.buddhaDispatchQueue[0] === loInterval) {
												clearInterval(loInterval);
												window.buddhaDispatchQueue
														.shift();
												that._dispatchJsonObject(json,
														initial, pageId);
											}
										}, 1);
								window.buddhaDispatchQueue.push(loInterval);
								return;
							}
							this._dispatchJsonObject(json, initial, pageId);
						},
						_dispatchJsonObject : function(json, initial, pageId) {
							window.buddhaDispatchQueue.unshift("PROCESSING...");
							var loDispatcher = sap.zen.Dispatcher.instance;
							var ltDoc = json.content.pageContent;
							if (json.content.bInterComponentDragDropEnabled) {
								loDispatcher
										.setInterComponentDragDropEnabled(true);
							} else {
								loDispatcher
										.setInterComponentDragDropEnabled(false);
							}
							require
									.config({
										baseUrl : sapbi_page.staticMimeUrlPrefix,
										paths : {
											"underscore" : "web_scripting/resources/external/underscore"
										},
										shim : {
											"underscore" : {
												exports : "_"
											}
										}
									});
							loDispatcher.dshPrefix = this.oPage
									.getDshControlId();
							if (initial == false) {
								ltDoc = ltDoc.delta;
								if (!(ltDoc instanceof Array)) {
									var ltArray = [];
									ltArray.push(ltDoc);
									ltDoc = ltArray;
								}
								ltDoc = {
									"delta" : ltDoc
								};
							}
							require(json.content.requiredModules,
									function() {
										window.buddhaDispatchQueue.shift();
										sapbi_registerHandlers(arguments);
										sapbi_phx(
												pageId + "sapbi_snippet_ROOT",
												ltDoc);
									});
							jQuery.sap.log
									.info("xwindow dispatchJsonObject: ...");
						},
						getPageObject : function(object) {
							if (object && object.getPageObject) {
								return object.getPageObject();
							}
							return null;
						},
						getLocale : function() {
							var l_lang = "en-GB";
							if (navigator.userLanguage) {
								l_lang = navigator.browserLanguage;
							} else {
								if (navigator.language) {
									l_lang = navigator.language;
								}
							}
							return l_lang;
						},
						setLocale : function(localeString) {
						},
						unwrapXObject : function(object) {
							if (object) {
								if (object.getString) {
									return object.getString();
								}
								if (object.getBoolean) {
									return object.getBoolean();
								}
								if (object.getDouble) {
									return object.getDouble();
								}
								if (object.getInteger) {
									return object.getInteger();
								}
								if (object.size) {
									var result = [];
									for (var i = 0; i < object.size(); i++) {
										result.push(this.unwrapXObject(object
												.get(i)));
									}
									return result;
								}
							}
							return undefined;
						},
						setContextForGlobalVariable : function(sKey, oValue,
								bUrlParam) {
							this.putInContext(sKey, this.unwrapXObject(oValue));
						},
						addUrlParam : function() {
						},
						createJSArray : function(list) {
							var jsArray = [];
							var i = 0;
							for (i = 0; i < list.size(); i++) {
								jsArray.push(list.get(i));
							}
							return jsArray;
						},
						createJSArrayOfStrings : function(list) {
							var jsArray = [];
							var i = 0;
							for (i = 0; i < list.size(); i++) {
								jsArray.push(list.get(i));
							}
							return jsArray;
						},
						wrapAndPutInContext : function(id, obj) {
							var javaScriptWrapperName = obj
									.getJavaScriptWrapperName();
							this.putInContext(id, obj);
							var ok = this
									.execute('sap.zen.dshWrapper.origObjects["'
											+ id + '"] = ' + id + ";");
							ok = this.execute(id
									+ '= sap.zen.dshWrapper.wrap("'
									+ javaScriptWrapperName + '",' + id + ");");
						},
						getGlobalVariables : function(updateValues) {
							if (updateValues) {
								this.captureGlobalVariables();
							}
							return this.globalVarMap;
						},
						captureGlobalVariables : function() {
							if (this.context.APPLICATION_PROPERTIES != null) {
								var names = this.context.APPLICATION_PROPERTIES
										.getGlobalVariableNames();
								this.globalVarMap.clear();
								for (i = 0; i < names.size(); i++) {
									var name = names.get(i);
									var value = this.getContext(name);
									this.globalVarMap.put(name, value);
								}
							}
						},
						putGlobalScriptInContext : function(name, script) {
							this.context.putScript(name, script);
						},
						resetLock : function() {
							window.buddhaHasSendLock = 0;
							jQuery.sap.log.info("xwindow resetLock: "
									+ window.buddhaHasSendLock);
						},
						increaseLock : function() {
							window.buddhaHasSendLock++;
							jQuery.sap.log.info("xwindow increaseLock: "
									+ window.buddhaHasSendLock);
						},
						decreaseLock : function() {
							window.buddhaHasSendLock--;
							if (window.buddhaHasSendLock < 0) {
								window.buddhaHasSendLock = 0;
							}
							jQuery.sap.log.info("xwindow decreaseLock: "
									+ window.buddhaHasSendLock);
						},
						log : function(message) {
							jQuery.sap.log.info(message);
						},
						setMainMode : function(bMainMode) {
							sap.zen.Dispatcher.instance.setMainMode(bMainMode);
						},
						setCompactMode : function(bCompactMode) {
							if (sap.zen.Dispatcher.instance.isMainMode()) {
								sap.zen.Dispatcher.instance
										.setCompactMode(bCompactMode);
							}
						},
						parseJSON : function(json) {
							return JSON.parse(json);
						},
						stringifyJSON : function(object) {
							return JSON.stringify(object);
						}
					});
	$Firefly.createClass("sap.buddha.XJSAndCSSLoader", oFF.XObject, {
		$statics : {
			create : function() {
				var w = new sap.buddha.XJSAndCssLoader();
				return w;
			}
		},
		loadJS : function(libId, url, oPage) {
		},
		loadBuildInJS : function(sVarName) {
			return window[sVarName];
		},
		loadCSS : function(libId, url, oPage) {
			$("head").append(
					'<link rel="stylesheet" href="' + oPage + libId + "/" + url
							+ '" type="text/css" />');
		}
	});
	$Firefly.createClass("sap.buddha.XXmlNode", oFF.XObject, {
		$statics : {
			create : function(root) {
				var node = new sap.buddha.XXmlNode();
				node.setObject(root);
				return node;
			},
			toStringInternal : function(node) {
				var sXML = new XMLSerializer().serializeToString(node);
				return sXML;
			}
		},
		toString : function() {
			var sXML = new XMLSerializer().serializeToString(this.root);
			return sXML;
		},
		root : null,
		setObject : function(node) {
			this.root = node;
		},
		getAttribute : function(name) {
			var attributes = this.root.attributes;
			var obj = attributes[name];
			if (obj == null) {
				return null;
			}
			var value = obj.value;
			return value;
		},
		getText : function() {
			return this.root.textContent;
		},
		getChildren : function(name) {
			var list = oFF.XList.create();
			var cn = this.root.childNodes;
			var nameToFind = "bi:" + name;
			for (var i = 0, len = cn.length; i < len; i++) {
				var node = cn[i];
				if (node.nodeName.toLowerCase() === nameToFind) {
					var xmlNode = sap.buddha.XXmlNode.create(node);
					list.add(xmlNode);
				}
			}
			return list;
		},
		getChildrenWoBiNameSpace : function(name) {
			var list = oFF.XList.create();
			var cn = this.root.childNodes;
			for (var i = 0, len = cn.length; i < len; i++) {
				var node = cn[i];
				if (node.nodeName === name) {
					var xmlNode = sap.buddha.XXmlNode.create(node);
					list.add(xmlNode);
				}
			}
			return list;
		},
		getFirstChild : function(name) {
			return this.getFirstChildWithAttributeValue("bi:" + name, null,
					null, false);
		},
		getFirstChildWoBiNameSpace : function(name) {
			return this
					.getFirstChildWithAttributeValue(name, null, null, false);
		},
		getFirstChildWithNameTag : function(name) {
			return this.getFirstChildWithAttributeValue(null, "name", name,
					false);
		},
		getFirstChildWithAttributeValue : function(tagName, attributName,
				attributeValue, recurse) {
			var cn = this.root.childNodes;
			for (var i = 0, len = cn.length; i < len; i++) {
				var ele = cn[i];
				if (recurse) {
					var xmlNode = sap.buddha.XXmlNode.create(ele)
							.getFirstChildWithAttributeValue(tagName,
									attributName, attributeValue, recurse);
					if (xmlNode !== null) {
						return xmlNode;
					}
				}
				if (tagName == null || tagName === ele.nodeName) {
					var attributes = ele.attributes;
					if (attributes != null) {
						if (attributeValue == null) {
							var xmlNode = sap.buddha.XXmlNode.create(ele);
							return xmlNode;
						}
						var namedItem = attributes[attributName];
						if (namedItem != null
								&& namedItem.value === attributeValue) {
							var xmlNode = sap.buddha.XXmlNode.create(ele);
							return xmlNode;
						}
					}
				}
			}
			return null;
		},
		setAttribute : function(name, value) {
			if (value != null) {
				this.root.setAttribute(name, value);
			} else {
				if (this.root.hasOwnProperty(name)) {
					this.root.removeAttribute(value);
				}
			}
		},
		setCData : function(value) {
			var child = this.root.firstChild;
			if (child != null) {
				this.root.removeChild(child);
			}
			var node = this.root.ownerDocument.createCDATASection(value);
			this.root.appendChild(node);
		},
		createChild : function(name) {
			var node = document.createElement("bi:" + name);
			this.root.appendChild(node);
			var xmlNode = sap.buddha.XXmlNode.create(node);
			return xmlNode;
		},
		createChildWithNameTag : function(name) {
			var node = document.createElement("bi:property");
			this.root.appendChild(node);
			node.setAttribute("name", name);
			var xmlNode = sap.buddha.XXmlNode.create(node);
			return xmlNode;
		},
		setProperty : function(name, value, asCData) {
			var firstChildWithNameTag = this.getFirstChildWithNameTag(name);
			if (firstChildWithNameTag == null) {
				firstChildWithNameTag = this.createChildWithNameTag(name);
			}
			if (asCData) {
				var firstChildWithNameTag2 = firstChildWithNameTag
						.getFirstChild("value");
				if (firstChildWithNameTag2 == null) {
					firstChildWithNameTag2 = firstChildWithNameTag
							.createChild("value");
				}
				firstChildWithNameTag2.setCData(value);
			} else {
				firstChildWithNameTag.setAttribute("value", value);
			}
		},
		asBookmarkString : function() {
			var cloneNode = this.root.cloneNode(false);
			var childNodes = this.root.childNodes;
			for (var i = 0, len = childNodes.length; i < len; i++) {
				var item = childNodes[i];
				var nodeName = item.nodeName;
				var doCopy = !(nodeName === "bi:component");
				var itemAttributes = item.attributes;
				if (itemAttributes != null) {
					doCopy = false;
					var attributeItem = itemAttributes["name"];
					if (attributeItem != null) {
						var attributeItemName = attributeItem.value
								.toUpperCase();
						if (attributeItemName === "DATA_SOURCE_DEFINITION"
								|| attributeItemName === "GLOBALVARIABLES") {
							doCopy = true;
						}
					}
				}
				if (doCopy) {
					var cloneNode2 = item.cloneNode(true);
					cloneNode.appendChild(cloneNode2);
				}
			}
			var s = sap.buddha.XXmlNode.toStringInternal(cloneNode);
			return s;
		},
		asDeltaBookmarkString : function(inputNode) {
			var cloneNode;
			var childNodes;
			if (inputNode == null) {
				cloneNode = this.root.cloneNode(false);
				childNodes = this.root.childNodes;
			} else {
				cloneNode = inputNode;
				cloneNode = cloneNode.cloneNode(false);
				childNodes = inputNode.childNodes;
			}
			var t = "";
			for (var i = 0, len = childNodes.length; i < len; i++) {
				var item = childNodes[i];
				var nodeName = item.nodeName;
				var doCopy = !(nodeName === "bi:component");
				if (doCopy) {
					var cloneNode2 = item.cloneNode(true);
					cloneNode.appendChild(cloneNode2);
				} else {
					var componentNode = item.cloneNode(true);
					var u = this.asDeltaBookmarkString(componentNode);
					t = oFF.XString.concatenate2(t, u);
				}
			}
			var s = sap.buddha.XXmlNode.toStringInternal(cloneNode);
			s = oFF.XString.concatenate2(s, t);
			return s;
		},
		getAllChildren : function() {
			var list = oFF.XList.create();
			var cn = this.root.childNodes;
			for (var i = 0, len = cn.length; i < len; i++) {
				var xmlNode = sap.buddha.XXmlNode.create(cn[i]);
				list.add(xmlNode);
			}
			return list;
		},
		getNode : function() {
			return this.root;
		},
		removeChild : function(child) {
			this.root.removeChild(child.getNode());
		},
		getNodeName : function() {
			return this.root.nodeName;
		},
		appendChild : function(node) {
			this.root.appendChild(node.getNode());
		},
		cloneNode : function(deep) {
			return sap.buddha.XXmlNode.create(this.root.cloneNode(deep));
		}
	});
	$Firefly.createClass("sap.buddha.XXmlUtils", null, {
		$statics : {
			decompress : function(base64) {
				var result = JXG.decompress(base64);
				return result;
			},
			decodeBase64ToByteArray : function(base64) {
				return atob(base64);
			},
			getRootNode : function(xml) {
				if (!xml) {
					return null;
				}
				var xmlDoc = $.parseXML(xml);
				var xmlNode = sap.buddha.XXmlNode.create();
				var cn = xmlDoc.childNodes;
				for (var i = 0, len = cn.length; i < len; i++) {
					var n = cn[i];
					if (n.nodeType === 1) {
						xmlNode.setObject(n);
						break;
					}
				}
				return xmlNode;
			}
		},
		toString : function() {
			return "[???]";
		}
	});
	JXG = {
		exists : (function(undefined) {
			return function(v) {
				return !(v === undefined || v === null);
			};
		})()
	};
	JXG.decompress = function(str) {
		var a = new JXG.Util.Unzip(JXG.Util.Base64.decodeAsArray(str));
		var b = a.unzip();
		return unescape(b[0][0]);
	};
	JXG.Util = {};
	JXG.Util.Unzip = function(barray) {
		var outputArr = [], output = "", debug = false, gpflags, files = 0, unzipped = [], crc, buf32k = new Array(
				32768), bIdx = 0, modeZIP = false, CRC, SIZE, bitReverse = [ 0,
				128, 64, 192, 32, 160, 96, 224, 16, 144, 80, 208, 48, 176, 112,
				240, 8, 136, 72, 200, 40, 168, 104, 232, 24, 152, 88, 216, 56,
				184, 120, 248, 4, 132, 68, 196, 36, 164, 100, 228, 20, 148, 84,
				212, 52, 180, 116, 244, 12, 140, 76, 204, 44, 172, 108, 236,
				28, 156, 92, 220, 60, 188, 124, 252, 2, 130, 66, 194, 34, 162,
				98, 226, 18, 146, 82, 210, 50, 178, 114, 242, 10, 138, 74, 202,
				42, 170, 106, 234, 26, 154, 90, 218, 58, 186, 122, 250, 6, 134,
				70, 198, 38, 166, 102, 230, 22, 150, 86, 214, 54, 182, 118,
				246, 14, 142, 78, 206, 46, 174, 110, 238, 30, 158, 94, 222, 62,
				190, 126, 254, 1, 129, 65, 193, 33, 161, 97, 225, 17, 145, 81,
				209, 49, 177, 113, 241, 9, 137, 73, 201, 41, 169, 105, 233, 25,
				153, 89, 217, 57, 185, 121, 249, 5, 133, 69, 197, 37, 165, 101,
				229, 21, 149, 85, 213, 53, 181, 117, 245, 13, 141, 77, 205, 45,
				173, 109, 237, 29, 157, 93, 221, 61, 189, 125, 253, 3, 131, 67,
				195, 35, 163, 99, 227, 19, 147, 83, 211, 51, 179, 115, 243, 11,
				139, 75, 203, 43, 171, 107, 235, 27, 155, 91, 219, 59, 187,
				123, 251, 7, 135, 71, 199, 39, 167, 103, 231, 23, 151, 87, 215,
				55, 183, 119, 247, 15, 143, 79, 207, 47, 175, 111, 239, 31,
				159, 95, 223, 63, 191, 127, 255 ], cplens = [ 3, 4, 5, 6, 7, 8,
				9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83,
				99, 115, 131, 163, 195, 227, 258, 0, 0 ], cplext = [ 0, 0, 0,
				0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4,
				5, 5, 5, 5, 0, 99, 99 ], cpdist = [ 1, 2, 3, 4, 5, 7, 9, 13,
				17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025,
				1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577 ], cpdext = [
				0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9,
				9, 10, 10, 11, 11, 12, 12, 13, 13 ], border = [ 16, 17, 18, 0,
				8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ], bA = barray, bytepos = 0, bitpos = 0, bb = 1, bits = 0, NAMEMAX = 256, nameBuf = [], fileout;
		function readByte() {
			bits += 8;
			if (bytepos < bA.length) {
				return bA[bytepos++];
			} else {
				return -1;
			}
		}
		function byteAlign() {
			bb = 1;
		}
		function readBit() {
			var carry;
			bits++;
			carry = (bb & 1);
			bb >>= 1;
			if (bb == 0) {
				bb = readByte();
				carry = (bb & 1);
				bb = (bb >> 1) | 128;
			}
			return carry;
		}
		function readBits(a) {
			var res = 0, i = a;
			while (i--) {
				res = (res << 1) | readBit();
			}
			if (a) {
				res = bitReverse[res] >> (8 - a);
			}
			return res;
		}
		function flushBuffer() {
			bIdx = 0;
		}
		function addBuffer(a) {
			SIZE++;
			buf32k[bIdx++] = a;
			outputArr.push(String.fromCharCode(a));
			if (bIdx == 32768) {
				bIdx = 0;
			}
		}
		function HufNode() {
			this.b0 = 0;
			this.b1 = 0;
			this.jump = null;
			this.jumppos = -1;
		}
		var LITERALS = 288;
		var literalTree = new Array(LITERALS);
		var distanceTree = new Array(32);
		var treepos = 0;
		var Places = null;
		var Places2 = null;
		var impDistanceTree = new Array(64);
		var impLengthTree = new Array(64);
		var len = 0;
		var fpos = new Array(17);
		fpos[0] = 0;
		var flens;
		var fmax;
		function IsPat() {
			while (1) {
				if (fpos[len] >= fmax) {
					return -1;
				}
				if (flens[fpos[len]] == len) {
					return fpos[len]++;
				}
				fpos[len]++;
			}
		}
		function Rec() {
			var curplace = Places[treepos];
			var tmp;
			if (debug) {
				document.write("<br>len:" + len + " treepos:" + treepos);
			}
			if (len == 17) {
				return -1;
			}
			treepos++;
			len++;
			tmp = IsPat();
			if (debug) {
				document.write("<br>IsPat " + tmp);
			}
			if (tmp >= 0) {
				curplace.b0 = tmp;
				if (debug) {
					document.write("<br>b0 " + curplace.b0);
				}
			} else {
				curplace.b0 = 32768;
				if (debug) {
					document.write("<br>b0 " + curplace.b0);
				}
				if (Rec()) {
					return -1;
				}
			}
			tmp = IsPat();
			if (tmp >= 0) {
				curplace.b1 = tmp;
				if (debug) {
					document.write("<br>b1 " + curplace.b1);
				}
				curplace.jump = null;
			} else {
				curplace.b1 = 32768;
				if (debug) {
					document.write("<br>b1 " + curplace.b1);
				}
				curplace.jump = Places[treepos];
				curplace.jumppos = treepos;
				if (Rec()) {
					return -1;
				}
			}
			len--;
			return 0;
		}
		function CreateTree(currentTree, numval, lengths, show) {
			var i;
			if (debug) {
				document.write("currentTree " + currentTree + " numval "
						+ numval + " lengths " + lengths + " show " + show);
			}
			Places = currentTree;
			treepos = 0;
			flens = lengths;
			fmax = numval;
			for (i = 0; i < 17; i++) {
				fpos[i] = 0;
			}
			len = 0;
			if (Rec()) {
				if (debug) {
					alert("invalid huffman tree\n");
				}
				return -1;
			}
			if (debug) {
				document.write("<br>Tree: " + Places.length);
				for (var a = 0; a < 32; a++) {
					document.write("Places[" + a + "].b0=" + Places[a].b0
							+ "<br>");
					document.write("Places[" + a + "].b1=" + Places[a].b1
							+ "<br>");
				}
			}
			return 0;
		}
		function DecodeValue(currentTree) {
			var len, i, xtreepos = 0, X = currentTree[xtreepos], b;
			while (1) {
				b = readBit();
				if (debug) {
					document.write("b=" + b);
				}
				if (b) {
					if (!(X.b1 & 32768)) {
						if (debug) {
							document.write("ret1");
						}
						return X.b1;
					}
					X = X.jump;
					len = currentTree.length;
					for (i = 0; i < len; i++) {
						if (currentTree[i] === X) {
							xtreepos = i;
							break;
						}
					}
				} else {
					if (!(X.b0 & 32768)) {
						if (debug) {
							document.write("ret2");
						}
						return X.b0;
					}
					xtreepos++;
					X = currentTree[xtreepos];
				}
			}
			if (debug) {
				document.write("ret3");
			}
			return -1;
		}
		function DeflateLoop() {
			var last, c, type, i, len;
			do {
				last = readBit();
				type = readBits(2);
				switch (type) {
				case 0:
					if (debug) {
						alert("Stored\n");
					}
					break;
				case 1:
					if (debug) {
						alert("Fixed Huffman codes\n");
					}
					break;
				case 2:
					if (debug) {
						alert("Dynamic Huffman codes\n");
					}
					break;
				case 3:
					if (debug) {
						alert("Reserved block type!!\n");
					}
					break;
				default:
					if (debug) {
						alert("Unexpected value %d!\n", type);
					}
					break;
				}
				if (type == 0) {
					var blockLen, cSum;
					byteAlign();
					blockLen = readByte();
					blockLen |= (readByte() << 8);
					cSum = readByte();
					cSum |= (readByte() << 8);
					if (((blockLen ^ ~cSum) & 65535)) {
						document.write("BlockLen checksum mismatch\n");
					}
					while (blockLen--) {
						c = readByte();
						addBuffer(c);
					}
				} else {
					if (type == 1) {
						var j;
						while (1) {
							j = (bitReverse[readBits(7)] >> 1);
							if (j > 23) {
								j = (j << 1) | readBit();
								if (j > 199) {
									j -= 128;
									j = (j << 1) | readBit();
								} else {
									j -= 48;
									if (j > 143) {
										j = j + 136;
									}
								}
							} else {
								j += 256;
							}
							if (j < 256) {
								addBuffer(j);
							} else {
								if (j == 256) {
									break;
								} else {
									var len, dist;
									j -= 256 + 1;
									len = readBits(cplext[j]) + cplens[j];
									j = bitReverse[readBits(5)] >> 3;
									if (cpdext[j] > 8) {
										dist = readBits(8);
										dist |= (readBits(cpdext[j] - 8) << 8);
									} else {
										dist = readBits(cpdext[j]);
									}
									dist += cpdist[j];
									for (j = 0; j < len; j++) {
										var c = buf32k[(bIdx - dist) & 32767];
										addBuffer(c);
									}
								}
							}
						}
					} else {
						if (type == 2) {
							var j, n, literalCodes, distCodes, lenCodes;
							var ll = new Array(288 + 32);
							literalCodes = 257 + readBits(5);
							distCodes = 1 + readBits(5);
							lenCodes = 4 + readBits(4);
							for (j = 0; j < 19; j++) {
								ll[j] = 0;
							}
							for (j = 0; j < lenCodes; j++) {
								ll[border[j]] = readBits(3);
							}
							len = distanceTree.length;
							for (i = 0; i < len; i++) {
								distanceTree[i] = new HufNode();
							}
							if (CreateTree(distanceTree, 19, ll, 0)) {
								flushBuffer();
								return 1;
							}
							if (debug) {
								document.write("<br>distanceTree");
								for (var a = 0; a < distanceTree.length; a++) {
									document.write("<br>" + distanceTree[a].b0
											+ " " + distanceTree[a].b1 + " "
											+ distanceTree[a].jump + " "
											+ distanceTree[a].jumppos);
								}
							}
							n = literalCodes + distCodes;
							i = 0;
							var z = -1;
							if (debug) {
								document.write("<br>n=" + n + " bits: " + bits
										+ "<br>");
							}
							while (i < n) {
								z++;
								j = DecodeValue(distanceTree);
								if (debug) {
									document.write("<br>" + z + " i:" + i
											+ " decode: " + j + "    bits "
											+ bits + "<br>");
								}
								if (j < 16) {
									ll[i++] = j;
								} else {
									if (j == 16) {
										var l;
										j = 3 + readBits(2);
										if (i + j > n) {
											flushBuffer();
											return 1;
										}
										l = i ? ll[i - 1] : 0;
										while (j--) {
											ll[i++] = l;
										}
									} else {
										if (j == 17) {
											j = 3 + readBits(3);
										} else {
											j = 11 + readBits(7);
										}
										if (i + j > n) {
											flushBuffer();
											return 1;
										}
										while (j--) {
											ll[i++] = 0;
										}
									}
								}
							}
							len = literalTree.length;
							for (i = 0; i < len; i++) {
								literalTree[i] = new HufNode();
							}
							if (CreateTree(literalTree, literalCodes, ll, 0)) {
								flushBuffer();
								return 1;
							}
							len = literalTree.length;
							for (i = 0; i < len; i++) {
								distanceTree[i] = new HufNode();
							}
							var ll2 = new Array();
							for (i = literalCodes; i < ll.length; i++) {
								ll2[i - literalCodes] = ll[i];
							}
							if (CreateTree(distanceTree, distCodes, ll2, 0)) {
								flushBuffer();
								return 1;
							}
							if (debug) {
								document.write("<br>literalTree");
							}
							while (1) {
								j = DecodeValue(literalTree);
								if (j >= 256) {
									var len, dist;
									j -= 256;
									if (j == 0) {
										break;
									}
									j--;
									len = readBits(cplext[j]) + cplens[j];
									j = DecodeValue(distanceTree);
									if (cpdext[j] > 8) {
										dist = readBits(8);
										dist |= (readBits(cpdext[j] - 8) << 8);
									} else {
										dist = readBits(cpdext[j]);
									}
									dist += cpdist[j];
									while (len--) {
										var c = buf32k[(bIdx - dist) & 32767];
										addBuffer(c);
									}
								} else {
									addBuffer(j);
								}
							}
						}
					}
				}
			} while (!last);
			flushBuffer();
			byteAlign();
			return 0;
		}
		JXG.Util.Unzip.prototype.unzipFile = function(name) {
			var i;
			this.unzip();
			for (i = 0; i < unzipped.length; i++) {
				if (unzipped[i][1] == name) {
					return unzipped[i][0];
				}
			}
		};
		JXG.Util.Unzip.prototype.unzip = function() {
			if (debug) {
				alert(bA);
			}
			nextFile();
			return unzipped;
		};
		function nextFile() {
			if (debug) {
				alert("NEXTFILE");
			}
			outputArr = [];
			var tmp = [];
			modeZIP = false;
			tmp[0] = readByte();
			tmp[1] = readByte();
			if (debug) {
				alert("type: " + tmp[0] + " " + tmp[1]);
			}
			if (tmp[0] == parseInt("78", 16) && tmp[1] == parseInt("da", 16)) {
				if (debug) {
					alert("GEONExT-GZIP");
				}
				DeflateLoop();
				if (debug) {
					alert(outputArr.join(""));
				}
				unzipped[files] = new Array(2);
				unzipped[files][0] = outputArr.join("");
				unzipped[files][1] = "geonext.gxt";
				files++;
			}
			if (tmp[0] == parseInt("1f", 16) && tmp[1] == parseInt("8b", 16)) {
				if (debug) {
					alert("GZIP");
				}
				skipdir();
				if (debug) {
					alert(outputArr.join(""));
				}
				unzipped[files] = new Array(2);
				unzipped[files][0] = outputArr.join("");
				unzipped[files][1] = "file";
				files++;
			}
			if (tmp[0] == parseInt("50", 16) && tmp[1] == parseInt("4b", 16)) {
				modeZIP = true;
				tmp[2] = readByte();
				tmp[3] = readByte();
				if (tmp[2] == parseInt("3", 16) && tmp[3] == parseInt("4", 16)) {
					tmp[0] = readByte();
					tmp[1] = readByte();
					if (debug) {
						alert("ZIP-Version: " + tmp[1] + " " + tmp[0] / 10
								+ "." + tmp[0] % 10);
					}
					gpflags = readByte();
					gpflags |= (readByte() << 8);
					if (debug) {
						alert("gpflags: " + gpflags);
					}
					var method = readByte();
					method |= (readByte() << 8);
					if (debug) {
						alert("method: " + method);
					}
					readByte();
					readByte();
					readByte();
					readByte();
					var crc = readByte();
					crc |= (readByte() << 8);
					crc |= (readByte() << 16);
					crc |= (readByte() << 24);
					var compSize = readByte();
					compSize |= (readByte() << 8);
					compSize |= (readByte() << 16);
					compSize |= (readByte() << 24);
					var size = readByte();
					size |= (readByte() << 8);
					size |= (readByte() << 16);
					size |= (readByte() << 24);
					if (debug) {
						alert("local CRC: " + crc + "\nlocal Size: " + size
								+ "\nlocal CompSize: " + compSize);
					}
					var filelen = readByte();
					filelen |= (readByte() << 8);
					var extralen = readByte();
					extralen |= (readByte() << 8);
					if (debug) {
						alert("filelen " + filelen);
					}
					i = 0;
					nameBuf = [];
					while (filelen--) {
						var c = readByte();
						if (c == "/" | c == ":") {
							i = 0;
						} else {
							if (i < NAMEMAX - 1) {
								nameBuf[i++] = String.fromCharCode(c);
							}
						}
					}
					if (debug) {
						alert("nameBuf: " + nameBuf);
					}
					if (!fileout) {
						fileout = nameBuf;
					}
					var i = 0;
					while (i < extralen) {
						c = readByte();
						i++;
					}
					CRC = 4294967295;
					SIZE = 0;
					if (size = 0 && fileOut.charAt(fileout.length - 1) == "/") {
						if (debug) {
							alert("skipdir");
						}
					}
					if (method == 8) {
						DeflateLoop();
						if (debug) {
							alert(outputArr.join(""));
						}
						unzipped[files] = new Array(2);
						unzipped[files][0] = outputArr.join("");
						unzipped[files][1] = nameBuf.join("");
						files++;
					}
					skipdir();
				}
			}
		}
		function skipdir() {
			var crc, tmp = [], compSize, size, os, i, c;
			if ((gpflags & 8)) {
				tmp[0] = readByte();
				tmp[1] = readByte();
				tmp[2] = readByte();
				tmp[3] = readByte();
				if (tmp[0] == parseInt("50", 16)
						&& tmp[1] == parseInt("4b", 16)
						&& tmp[2] == parseInt("07", 16)
						&& tmp[3] == parseInt("08", 16)) {
					crc = readByte();
					crc |= (readByte() << 8);
					crc |= (readByte() << 16);
					crc |= (readByte() << 24);
				} else {
					crc = tmp[0] | (tmp[1] << 8) | (tmp[2] << 16)
							| (tmp[3] << 24);
				}
				compSize = readByte();
				compSize |= (readByte() << 8);
				compSize |= (readByte() << 16);
				compSize |= (readByte() << 24);
				size = readByte();
				size |= (readByte() << 8);
				size |= (readByte() << 16);
				size |= (readByte() << 24);
				if (debug) {
					alert("CRC:");
				}
			}
			if (modeZIP) {
				nextFile();
			}
			tmp[0] = readByte();
			if (tmp[0] != 8) {
				if (debug) {
					alert("Unknown compression method!");
				}
				return 0;
			}
			gpflags = readByte();
			if (debug) {
				if ((gpflags & ~(parseInt("1f", 16)))) {
					alert("Unknown flags set!");
				}
			}
			readByte();
			readByte();
			readByte();
			readByte();
			readByte();
			os = readByte();
			if ((gpflags & 4)) {
				tmp[0] = readByte();
				tmp[2] = readByte();
				len = tmp[0] + 256 * tmp[1];
				if (debug) {
					alert("Extra field size: " + len);
				}
				for (i = 0; i < len; i++) {
					readByte();
				}
			}
			if ((gpflags & 8)) {
				i = 0;
				nameBuf = [];
				while (c = readByte()) {
					if (c == "7" || c == ":") {
						i = 0;
					}
					if (i < NAMEMAX - 1) {
						nameBuf[i++] = c;
					}
				}
				if (debug) {
					alert("original file name: " + nameBuf);
				}
			}
			if ((gpflags & 16)) {
				while (c = readByte()) {
				}
			}
			if ((gpflags & 2)) {
				readByte();
				readByte();
			}
			DeflateLoop();
			crc = readByte();
			crc |= (readByte() << 8);
			crc |= (readByte() << 16);
			crc |= (readByte() << 24);
			size = readByte();
			size |= (readByte() << 8);
			size |= (readByte() << 16);
			size |= (readByte() << 24);
			if (modeZIP) {
				nextFile();
			}
		}
	};
	JXG.Util.Base64 = {
		_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
		encode : function(input) {
			var output = [], chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
			input = JXG.Util.Base64._utf8_encode(input);
			while (i < input.length) {
				chr1 = input.charCodeAt(i++);
				chr2 = input.charCodeAt(i++);
				chr3 = input.charCodeAt(i++);
				enc1 = chr1 >> 2;
				enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
				enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
				enc4 = chr3 & 63;
				if (isNaN(chr2)) {
					enc3 = enc4 = 64;
				} else {
					if (isNaN(chr3)) {
						enc4 = 64;
					}
				}
				output.push([ this._keyStr.charAt(enc1),
						this._keyStr.charAt(enc2), this._keyStr.charAt(enc3),
						this._keyStr.charAt(enc4) ].join(""));
			}
			return output.join("");
		},
		decode : function(input, utf8) {
			var output = [], chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
			input = input.replace(new RegExp("[^A-Za-z0-9+/=]", "g"), "");
			while (i < input.length) {
				enc1 = this._keyStr.indexOf(input.charAt(i++));
				enc2 = this._keyStr.indexOf(input.charAt(i++));
				enc3 = this._keyStr.indexOf(input.charAt(i++));
				enc4 = this._keyStr.indexOf(input.charAt(i++));
				chr1 = (enc1 << 2) | (enc2 >> 4);
				chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
				chr3 = ((enc3 & 3) << 6) | enc4;
				output.push(String.fromCharCode(chr1));
				if (enc3 != 64) {
					output.push(String.fromCharCode(chr2));
				}
				if (enc4 != 64) {
					output.push(String.fromCharCode(chr3));
				}
			}
			output = output.join("");
			if (utf8) {
				output = JXG.Util.Base64._utf8_decode(output);
			}
			return output;
		},
		_utf8_encode : function(string) {
			string = string.replace(new RegExp("\r\n", "g"), "\n");
			var utftext = "";
			for (var n = 0; n < string.length; n++) {
				var c = string.charCodeAt(n);
				if (c < 128) {
					utftext += String.fromCharCode(c);
				} else {
					if ((c > 127) && (c < 2048)) {
						utftext += String.fromCharCode((c >> 6) | 192);
						utftext += String.fromCharCode((c & 63) | 128);
					} else {
						utftext += String.fromCharCode((c >> 12) | 224);
						utftext += String.fromCharCode(((c >> 6) & 63) | 128);
						utftext += String.fromCharCode((c & 63) | 128);
					}
				}
			}
			return utftext;
		},
		_utf8_decode : function(utftext) {
			var string = [], i = 0, c = 0, c2 = 0, c3 = 0;
			while (i < utftext.length) {
				c = utftext.charCodeAt(i);
				if (c < 128) {
					string.push(String.fromCharCode(c));
					i++;
				} else {
					if ((c > 191) && (c < 224)) {
						c2 = utftext.charCodeAt(i + 1);
						string.push(String.fromCharCode(((c & 31) << 6)
								| (c2 & 63)));
						i += 2;
					} else {
						c2 = utftext.charCodeAt(i + 1);
						c3 = utftext.charCodeAt(i + 2);
						string.push(String.fromCharCode(((c & 15) << 12)
								| ((c2 & 63) << 6) | (c3 & 63)));
						i += 3;
					}
				}
			}
			return string.join("");
		},
		_destrip : function(stripped, wrap) {
			var lines = [], lineno, i, destripped = [];
			if (wrap == null) {
				wrap = 76;
			}
			stripped.replace(new RegExp(" ", "g"), "");
			lineno = stripped.length / wrap;
			for (i = 0; i < lineno; i++) {
				lines[i] = stripped.substr(i * wrap, wrap);
			}
			if (lineno != stripped.length / wrap) {
				lines[lines.length] = stripped.substr(lineno * wrap,
						stripped.length - (lineno * wrap));
			}
			for (i = 0; i < lines.length; i++) {
				destripped.push(lines[i]);
			}
			return destripped.join("\n");
		},
		decodeAsArray : function(input) {
			var dec = this.decode(input), ar = [], i;
			for (i = 0; i < dec.length; i++) {
				ar[i] = dec.charCodeAt(i);
			}
			return ar;
		},
		decodeGEONExT : function(input) {
			return decodeAsArray(destrip(input), false);
		}
	};
	JXG.Util.asciiCharCodeAt = function(str, i) {
		var c = str.charCodeAt(i);
		if (c > 255) {
			switch (c) {
			case 8364:
				c = 128;
				break;
			case 8218:
				c = 130;
				break;
			case 402:
				c = 131;
				break;
			case 8222:
				c = 132;
				break;
			case 8230:
				c = 133;
				break;
			case 8224:
				c = 134;
				break;
			case 8225:
				c = 135;
				break;
			case 710:
				c = 136;
				break;
			case 8240:
				c = 137;
				break;
			case 352:
				c = 138;
				break;
			case 8249:
				c = 139;
				break;
			case 338:
				c = 140;
				break;
			case 381:
				c = 142;
				break;
			case 8216:
				c = 145;
				break;
			case 8217:
				c = 146;
				break;
			case 8220:
				c = 147;
				break;
			case 8221:
				c = 148;
				break;
			case 8226:
				c = 149;
				break;
			case 8211:
				c = 150;
				break;
			case 8212:
				c = 151;
				break;
			case 732:
				c = 152;
				break;
			case 8482:
				c = 153;
				break;
			case 353:
				c = 154;
				break;
			case 8250:
				c = 155;
				break;
			case 339:
				c = 156;
				break;
			case 382:
				c = 158;
				break;
			case 376:
				c = 159;
				break;
			default:
				break;
			}
		}
		return c;
	};
	JXG.Util.utf8Decode = function(utftext) {
		var string = [];
		var i = 0;
		var c = 0, c1 = 0, c2 = 0, c3;
		if (!JXG.exists(utftext)) {
			return "";
		}
		while (i < utftext.length) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string.push(String.fromCharCode(c));
				i++;
			} else {
				if ((c > 191) && (c < 224)) {
					c2 = utftext.charCodeAt(i + 1);
					string.push(String
							.fromCharCode(((c & 31) << 6) | (c2 & 63)));
					i += 2;
				} else {
					c2 = utftext.charCodeAt(i + 1);
					c3 = utftext.charCodeAt(i + 2);
					string.push(String.fromCharCode(((c & 15) << 12)
							| ((c2 & 63) << 6) | (c3 & 63)));
					i += 3;
				}
			}
		}
		return string.join("");
	};
	JXG.Util.genUUID = function() {
		var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
				.split(""), uuid = new Array(36), rnd = 0, r;
		for (var i = 0; i < 36; i++) {
			if (i == 8 || i == 13 || i == 18 || i == 23) {
				uuid[i] = "-";
			} else {
				if (i == 14) {
					uuid[i] = "4";
				} else {
					if (rnd <= 2) {
						rnd = 33554432 + (Math.random() * 16777216) | 0;
					}
					r = rnd & 15;
					rnd = rnd >> 4;
					uuid[i] = chars[(i == 19) ? (r & 3) | 8 : r];
				}
			}
		}
		return uuid.join("");
	};
	$Firefly
			.createClass(
					"sap.buddha.XJsonObject",
					oFF.XObject,
					{
						$statics : {
							xWindow : null,
							create : function(obj) {
								var jsonObj = new sap.buddha.XJsonObject();
								jsonObj.setObject(obj);
								return jsonObj;
							},
							createFromString : function(obj) {
								var jsonObj = new sap.buddha.XJsonObject();
								jsonObj.setObject(obj);
								return jsonObj;
							},
							createFromJSonString : function(obj) {
								var jsonObj = new sap.buddha.XJsonObject();
								jsonObj.setObject(JSON.parse(obj));
								return jsonObj;
							},
							setXWindow : function(xWindow) {
								sap.buddha.XJsonObject.xWindow = xWindow;
							}
						},
						toString : function() {
							return "[???]";
						},
						obj : null,
						setObject : function(obj) {
							this.obj = obj;
						},
						isString : function() {
							return (typeof this.obj === "string");
						},
						getString : function() {
							if (this.isString()) {
								return this.obj;
							} else {
								if (this.isScriptableMember()) {
									return this.obj.getKey();
								}
							}
							return this.getAsJsonString();
						},
						getAsJsonString : function() {
							return JSON.stringify(this.obj);
						},
						isArray : function() {
							return ((typeof (this.obj) === "object") && (this.obj instanceof Array));
						},
						isDefined : function() {
							if (typeof (this.obj) === "undefined") {
								return false;
							}
							return true;
						},
						getArray : function() {
							return sap.buddha.XJsonArray.create(this.obj);
						},
						isJSON : function() {
							return ((typeof (this.obj) === "object")
									&& !this.isArray() && !this.isPageObject() && !this
									.isScriptableMember());
						},
						getJSON : function() {
							var createMapByString = oFF.XHashMapByString
									.create();
							if (!this.isJSON()) {
								return createMapByString;
							}
							for ( var key in this.obj) {
								if (this.obj.hasOwnProperty(key)) {
									var value = this.obj[key];
									if (typeof (value) === "object") {
										value = JSON.stringify(value);
									}
									createMapByString.put(key, value);
								}
							}
							return createMapByString;
						},
						replace : function(sear, repl) {
							return this.getString().replace(
									new RegExp(sear, "g"), repl);
						},
						isScriptableMember : function() {
							return (typeof (this.obj.clazzName) !== "undefined")
									&& (this.obj.clazzName === "ScriptableMember");
						},
						isPageObject : function() {
							var t = this.obj.getPageObject;
							return (t != null);
						},
						getPageObject : function() {
							if (!this.isPageObject()) {
								return null;
							}
							var t = this.obj.getPageObject();
							return t;
						}
					});
	$Firefly.createClass("sap.buddha.XJsonArray", oFF.XObject, {
		$statics : {
			create : function(obj) {
				var jsonArray = new sap.buddha.XJsonArray();
				jsonArray.setObject(obj);
				return jsonArray;
			}
		},
		toString : function() {
			return "[???]";
		},
		obj : null,
		setObject : function(obj) {
			this.obj = obj;
		},
		size : function() {
			return this.obj.length;
		},
		get : function(i) {
			return sap.buddha.XJsonObject.create(this.obj[i]);
		}
	});
	$Firefly
			.createClass(
					"sap.buddha.XJSonRenderSerializer",
					oFF.XObject,
					{
						$statics : {
							create : function(obj) {
								var jsonSerializer = new sap.buddha.XJSonRenderSerializer();
								jsonSerializer.level = 0;
								jsonSerializer.obj = {};
								jsonSerializer.currentObjStack = [];
								jsonSerializer.currentObjStack
										.push(jsonSerializer.obj);
								jsonSerializer.inArrayStack = [];
								jsonSerializer.inArrayStack.push(false);
								return jsonSerializer;
							}
						},
						writeOpenObject : function() {
							var obj = {};
							this.currentObjStack.push(obj);
							this.inArrayStack.push(false);
							this.level++;
						},
						setWriter : function(writer) {
							this.writer = writer;
						},
						openTag : function(tagName) {
							var obj = {};
							if (this.inArrayStack[this.inArrayStack.length - 1] === true) {
								var obj2 = {};
								this.currentObjStack[this.currentObjStack.length - 1]
										.push(obj2);
								obj2[tagName] = obj;
							} else {
								this.currentObjStack[this.currentObjStack.length - 1][tagName] = obj;
							}
							this.currentObjStack.push(obj);
							this.inArrayStack.push(false);
							this.level++;
						},
						addText : function(text) {
							this.addAttribute("_v", text);
						},
						closeTag : function() {
							this.currentObjStack.pop();
							this.inArrayStack.pop();
							this.level--;
							this.checkAndWrite();
						},
						addNullAttribute : function(name) {
							this.currentObjStack[this.currentObjStack.length - 1][name] = null;
						},
						addAttribute : function(name, value) {
							if (value === null) {
								value = "";
							}
							this.currentObjStack[this.currentObjStack.length - 1][name] = value;
						},
						addAttributeAsNotString : function(name, value) {
							if (value === null) {
								value = "";
							}
							Object
									.defineProperty(
											this.currentObjStack[this.currentObjStack.length - 1],
											name, {
												get : function() {
													return eval(value);
												}
											});
						},
						addAttribute2 : function(name, value) {
							if (value === null) {
								value = "";
							}
							this.currentObjStack[this.currentObjStack.length - 1][name] = value;
						},
						addIntegerAttribute : function(name, value) {
							this.currentObjStack[this.currentObjStack.length - 1][name] = value;
						},
						addDoubleAttribute : function(name, value) {
							this.currentObjStack[this.currentObjStack.length - 1][name] = value;
						},
						addBooleanAttribute : function(name, value) {
							this.currentObjStack[this.currentObjStack.length - 1][name] = value;
						},
						openArray : function(arrayName) {
							var obj = [];
							if (this.inArrayStack[this.inArrayStack.length - 1] === true) {
								var obj2 = {};
								this.currentObjStack[this.currentObjStack.length - 1]
										.push(obj2);
								obj2[arrayName] = obj;
							} else {
								this.currentObjStack[this.currentObjStack.length - 1][arrayName] = obj;
							}
							this.currentObjStack.push(obj);
							this.inArrayStack.push(true);
							this.level++;
						},
						closeArray : function() {
							this.currentObjStack.pop();
							this.inArrayStack.pop();
							this.level--;
							this.checkAndWrite();
						},
						isCurrentWriter : function(writer) {
							return true;
						},
						openJsonArray : function() {
							var obj = [];
							if (this.inArrayStack[this.inArrayStack.length - 1] === true) {
								this.currentObjStack[this.currentObjStack.length - 1]
										.push(obj);
							} else {
								throw "invalid state";
							}
							this.currentObjStack.push(obj);
							this.inArrayStack.push(true);
							this.level++;
						},
						closeJsonArray : function() {
							this.currentObjStack.pop();
							this.inArrayStack.pop();
							this.level--;
							this.checkAndWrite();
						},
						openJsonTag : function() {
							var obj = {};
							if (this.inArrayStack[this.inArrayStack.length - 1] === true) {
								this.currentObjStack[this.currentObjStack.length - 1]
										.push(obj);
							} else {
								throw "invalid state";
							}
							this.currentObjStack.push(obj);
							this.inArrayStack.push(false);
							this.level++;
						},
						closeJsonTag : function() {
							this.currentObjStack.pop();
							this.inArrayStack.pop();
							this.level--;
							this.checkAndWrite();
						},
						addDoubleToArray : function(value) {
							this.currentObjStack[this.currentObjStack.length - 1]
									.push(value.getDouble());
						},
						addIntegerToArray : function(value) {
							this.currentObjStack[this.currentObjStack.length - 1]
									.push(value.getInteger());
						},
						addSimpleValueToArray : function(value) {
							this.currentObjStack[this.currentObjStack.length - 1]
									.push(value);
						},
						addNullToArray : function() {
							this.currentObjStack[this.currentObjStack.length - 1]
									.push(null);
						},
						checkAndWrite : function() {
							if (this.writer != null) {
								if (this.level === 0) {
									var s = JSON.stringify(this.obj);
									this.writer.append(s);
								}
							}
						},
						getRenderedObject : function() {
							return this.obj;
						}
					});
	$Firefly.createClass("sap.buddha.XObjectConverter", oFF.XObject, {
		$statics : {
			getStringArrayFromIXListForSelection : function(listGiven) {
				var result = [];
				var allSelectedItemsAsIterator = listGiven.getIterator();
				while (allSelectedItemsAsIterator.hasNext()) {
					var oneItemOfAllSelectedItems = allSelectedItemsAsIterator
							.next();
					result.push(oneItemOfAllSelectedItems);
				}
				return result;
			},
			getIXListOfStringForSelectionFromStringArray : function(aStrings) {
				var result = oFF.XListOfString.create();
				for (var j = 0; j < aStrings.length; j++) {
					result.add(aStrings[j]);
				}
				return result;
			},
			isString : function(sString) {
				if (sString == null) {
					return true;
				}
				return typeof sString === "string";
			},
			isObjectString : function(oObject) {
				return sap.buddha.XObjectConverter.isString(oObject);
			},
			convertObjectToString : function(oObject) {
				return oObject;
			},
			convertObjectToInt : function(oObject) {
				return oObject;
			},
			isBoolean : function(bBoolean) {
				if (bBoolean == null) {
					return true;
				}
				return typeof bBoolean === "boolean";
			},
			isInteger : function(iInteger) {
				if (iInteger == null) {
					return true;
				}
				return typeof iInteger === "number";
			},
			isDouble : function(dDouble) {
				if (dDouble == null) {
					return true;
				}
				return typeof dDouble === "number";
			}
		}
	});
	$Firefly.createClass("sap.buddha.XSSEncoder", oFF.XObject, {
		$statics : {
			encodeJavaScript : function(s) {
				var regEx = new RegExp("'", "g");
				s = s.replace(regEx, "\\x27");
				return s;
			},
			encodeHtml : function(s) {
				return s;
			},
			encodeXml : function(s) {
				var regEx = new RegExp("[<>&'\"]", "g");
				return s.replace(regEx, function(c) {
					if (c == "<") {
						return "&lt;";
					} else {
						if (c == ">") {
							return "&gt;";
						} else {
							if (c == "&") {
								return "&amp;";
							} else {
								if (c == "'") {
									return "&apos;";
								} else {
									if (c == '"') {
										return "&quot;";
									}
								}
							}
						}
					}
				});
			}
		}
	});
	$Firefly.createClass("sap.buddha.XMathZen", oFF.XObject, {
		$statics : {
			create : function(obj) {
				var jsonArray = new sap.buddha.XMathZen();
				jsonArray.setObject(obj);
				return jsonArray;
			},
			roundDouble : function(dValueGiven) {
				return dValueGiven.toLocaleString(undefined, {
					"maximumFractionDigits" : 2,
					"minimumFractionDigits" : 2
				});
			}
		},
		toString : function() {
			return "[???]";
		},
		obj : null,
		setObject : function(obj) {
			this.obj = obj;
		},
		size : function() {
			return this.obj.length;
		},
		get : function(i) {
			return sap.buddha.XJsonObject.create(this.obj[i]);
		}
	});
	$Firefly.createClass("sap.buddha.XJsonMap", oFF.XObject, {
		getJsonFromMapObject : function(object) {
			return JSON.stringify(object);
		}
	});
	$Firefly
			.createClass(
					"sap.buddha.XJsUI5Utils",
					null,
					{
						$statics : {
							formatDateTimeValue : function(value, dataType,
									isUTC, formatStyle) {
								var lFormattedValue = value;
								var loDataType = sap.buddha.XJsUI5Utils
										.getDateTimeValueObject(value,
												dataType, isUTC);
								var loFormatOptions = {
									style : formatStyle
								};
								dataType = sap.buddha.XJsUI5Utils
										.translateDataType(dataType);
								var loDateTypeFormatter = null;
								if (dataType === "DATE") {
									loDataTypeFormatter = sap.ui.core.format.DateFormat
											.getDateInstance(loFormatOptions,
													sap.ui.getCore()
															.getConfiguration()
															.getLocale());
								} else {
									if (dataType === "TIME") {
										loDataTypeFormatter = sap.ui.core.format.DateFormat
												.getTimeInstance(
														loFormatOptions,
														sap.ui
																.getCore()
																.getConfiguration()
																.getLocale());
									} else {
										if (dataType === "DATETIME") {
											loDataTypeFormatter = sap.ui.core.format.DateFormat
													.getDateTimeInstance(
															loFormatOptions,
															sap.ui
																	.getCore()
																	.getConfiguration()
																	.getLocale());
										}
									}
								}
								if (loDataType && loDataTypeFormatter) {
									lFormattedValue = loDataTypeFormatter
											.format(loDataType);
								}
								return lFormattedValue;
							},
							getDateTimeValue : function(value, dataType, isUTC) {
								var lValue = value;
								var loDataType = sap.buddha.XJsUI5Utils
										.getDateTimeValueObject(value,
												dataType, isUTC);
								var loDataTypeFormatter = sap.buddha.XJsUI5Utils
										.getDateTimeValueFormatter(value,
												dataType);
								if (loDataType && loDataTypeFormatter) {
									lValue = loDataTypeFormatter
											.format(loDataType);
								}
								return lValue;
							},
							getDateTimeValueObject : function(value, dataType,
									isUTC) {
								var loDataType = null;
								var loDataTypeFormatter = sap.buddha.XJsUI5Utils
										.getDateTimeValueFormatter(value,
												dataType);
								if (loDataTypeFormatter) {
									loDataType = loDataTypeFormatter
											.parse(value);
								}
								if (isUTC && loDataType) {
									loDataType.setUTCDate(loDataType.getDate());
									loDataType.setUTCFullYear(loDataType
											.getFullYear());
									loDataType.setUTCMonth(loDataType
											.getMonth());
									loDataType.setUTCHours(loDataType
											.getHours());
									loDataType.setUTCMinutes(loDataType
											.getMinutes());
									loDataType.setUTCSeconds(loDataType
											.getSeconds());
									loDataType.setUTCMilliseconds(loDataType
											.getMilliseconds());
								}
								return loDataType;
							},
							getDateTimeValueFormatter : function(value,
									dataType) {
								var loDataTypeFormatter = null;
								dataType = sap.buddha.XJsUI5Utils
										.translateDataType(dataType);
								if (dataType === "DATE") {
									loDataTypeFormatter = sap.buddha.XJsUI5Utils
											.getDateFormatter(value);
								} else {
									if (dataType === "TIME") {
										loDataTypeFormatter = sap.buddha.XJsUI5Utils
												.getTimeFormatter(value);
									} else {
										if (dataType === "DATETIME") {
											loDataTypeFormatter = sap.buddha.XJsUI5Utils
													.getDateTimeFormatter(value);
										}
									}
								}
								return loDataTypeFormatter;
							},
							getDateFormatter : function(date) {
								var loFormatter = null;
								var lPattern;
								var lOffset = -1;
								lOffset = date.search("([0-9]{8})");
								if (lOffset === 0) {
									lPattern = "yyyyMMdd";
								}
								if (!lPattern) {
									lOffset = date
											.search("([0-9]{4}-[0-9]{2}-[0-9]{2})");
									if (lOffset === 0) {
										lPattern = "yyyy-MM-dd";
									}
								}
								var loDate;
								if (lPattern) {
									loFormatter = sap.ui.core.format.DateFormat
											.getInstance({
												pattern : lPattern
											});
								}
								return loFormatter;
							},
							getTimeFormatter : function(time) {
								var loFormatter = null;
								var lPattern;
								var lOffset = -1;
								lOffset = time.search("([0-9]{6})");
								if (lOffset === 0) {
									lPattern = "HHmmss";
								}
								if (!lPattern) {
									lOffset = time
											.search("([0-9]{2}:[0-9]{2}:[0-9]{2})");
									if (lOffset === 0) {
										lPattern = "HH:mm:ss";
									}
								}
								var loTime;
								if (lPattern) {
									loFormatter = sap.ui.core.format.DateFormat
											.getInstance({
												pattern : lPattern
											});
								}
								return loFormatter;
							},
							getDateTimeFormatter : function(dateTime) {
								var loFormatter = null;
								var lPattern;
								var lOffset = -1;
								lOffset = dateTime.search("^([0-9]{8})");
								if (lOffset === 0) {
									lPattern = "yyyyMMdd";
									lOffset = dateTime.substr(8).search(
											"^([0-9]{6})");
									if (lOffset === 0) {
										lPattern = "yyyyMMddHHmmss";
									}
								}
								if (!lPattern) {
									lOffset = dateTime
											.search("^([0-9]{4}-[0-9]{2}-[0-9]{2})");
									if (lOffset === 0) {
										lPattern = "yyyy-MM-dd";
										lOffset = dateTime
												.substr(10)
												.search(
														"^T([0-9]{2}:[0-9]{2}:[0-9]{2})");
										if (lOffset === 0) {
											lPattern = "yyyy-MM-ddTHH:mm:ss";
										}
									}
								}
								var loDateTime;
								if (lPattern) {
									loFormatter = sap.ui.core.format.DateFormat
											.getInstance({
												pattern : lPattern
											});
								}
								return loFormatter;
							},
							translateDataType : function(dataType) {
								var lDataType = dataType.toUpperCase();
								if (lDataType === "DATE") {
									lDataType = "DATE";
								} else {
									if (lDataType === "TIME") {
										lDataType = "TIME";
									} else {
										if (lDataType === "DATETIME"
												|| lDataType === "DATE_TIME") {
											lDataType = "DATETIME";
										}
									}
								}
								return lDataType;
							}
						},
						toString : function() {
							return "[???]";
						}
					});
	$Firefly.createClass("sap.buddha.XJsUtils", null, {
		$statics : {
			createProperty : function(instance, name, createGetter,
					createSetter) {
				var funcName = name.substring(0, 1).toUpperCase()
						+ name.substring(1);
				if (createGetter === true) {
					Object.defineProperty(instance, name, {
						get : function() {
							return eval("instance.get" + funcName + "()");
						}
					});
				}
				if (createSetter === true) {
					Object.defineProperty(instance, name, {
						set : function(value) {
							return eval("instance.set" + funcName + "(value)");
						}
					});
				}
			},
			createJsIdentifier : function(id) {
				return id.replace(/\W/g, "_").replace(/^(\d)/g, "_$1");
			}
		},
		toString : function() {
			return "[???]";
		}
	});
	$Firefly
			.createClass(
					"sap.buddha.XlsWorkbook",
					oFF.XObject,
					{
						$statics : {
							create : function(openOfficeType, allowStyles) {
								jQuery.sap
										.require("sap.zen.dsh.rt.zen_rt_firefly.js.jszip");
								if (openOfficeType === "SHEETJS_PROTOBI") {
									jQuery.sap
											.require("sap.zen.dsh.rt.zen_rt_firefly.js.xlsx-protobi");
								} else {
									jQuery.sap
											.require("sap.zen.dsh.rt.zen_rt_firefly.js.xlsx");
								}
								function Workbook() {
									if (!(this instanceof Workbook)) {
										return new Workbook();
									}
									this.SheetNames = [];
									this.Sheets = {};
								}
								var loInstance = new sap.buddha.XlsWorkbook();
								loInstance.allowStyles = allowStyles;
								loInstance.wb = new Workbook();
								return loInstance;
							}
						},
						allowStyles : true,
						formatIndexMap : {},
						formatIndex : 164,
						addWorksheet : function(sheetName) {
							var loWorkSheet = {};
							this.wb.SheetNames.push(sheetName);
							this.wb.Sheets[sheetName] = loWorkSheet;
							loWorkSheet.curRow = -1;
							loWorkSheet.maxRow = -1;
							loWorkSheet.maxCol = -1;
							loWorkSheet["!merges"] = [];
							return loWorkSheet;
						},
						closeWorkSheet : function(oXlsWorksheet) {
							var loRange = this.getRange(0, 0,
									oXlsWorksheet.maxRow + 1,
									oXlsWorksheet.maxCol + 1);
							oXlsWorksheet["!ref"] = XLSX.utils
									.encode_range(loRange);
						},
						getRow : function(oXlsWorksheet, rowIndex) {
							var loRow = {};
							loRow.ws = oXlsWorksheet;
							loRow.row = rowIndex;
							loRow.curCol = -1;
							return loRow;
						},
						createRow : function(oXlsWorksheet) {
							oXlsWorksheet.curRow++;
							var loRow = this.getRow(oXlsWorksheet,
									oXlsWorksheet.curRow);
							if (oXlsWorksheet.curRow > oXlsWorksheet.maxRow) {
								oXlsWorksheet.maxRow = oXlsWorksheet.curRow;
							}
							return loRow;
						},
						getCell : function(oXlsWorksheetRow, columnIndex) {
							var loCell = {};
							loCell.ws = oXlsWorksheetRow.ws;
							loCell.row = oXlsWorksheetRow.row;
							loCell.column = columnIndex;
							var lCellRef = this.getCellRef(loCell.row,
									loCell.column);
							oXlsWorksheetRow.ws[lCellRef] = loCell;
							return loCell;
						},
						getCellRef : function(rowIndex, columnIndex) {
							var loCellRef = XLSX.utils.encode_cell({
								r : rowIndex,
								c : columnIndex
							});
							return loCellRef.toString();
						},
						addCell : function(oXlsWorksheetRow) {
							oXlsWorksheetRow.curCol++;
							var loCell = this.getCell(oXlsWorksheetRow,
									oXlsWorksheetRow.curCol);
							if (oXlsWorksheetRow.curCol > oXlsWorksheetRow.ws.maxCol) {
								oXlsWorksheetRow.ws.maxCol = oXlsWorksheetRow.curCol;
							}
							return loCell;
						},
						copyCell : function(oXlsWorkSheetCellSource,
								oXlsWorkSheetCellTarget) {
							if (oXlsWorkSheetCellSource.s) {
								oXlsWorkSheetCellTarget.s = oXlsWorkSheetCellSource.s;
							}
							if (oXlsWorkSheetCellSource.v) {
								oXlsWorkSheetCellTarget.v = oXlsWorkSheetCellSource.v;
							}
							if (oXlsWorkSheetCellSource.t) {
								oXlsWorkSheetCellTarget.t = oXlsWorkSheetCellSource.t;
							}
							if (oXlsWorkSheetCellSource.f) {
								oXlsWorkSheetCellTarget.f = oXlsWorkSheetCellSource.f;
							}
							if (oXlsWorkSheetCellSource.z) {
								oXlsWorkSheetCellTarget.z = oXlsWorkSheetCellSource.z;
							}
							if (oXlsWorkSheetCellSource.w) {
								oXlsWorkSheetCellTarget.w = oXlsWorkSheetCellSource.w;
							}
						},
						mergeCell : function(oXlsWorksheetCell, rowspan,
								colspan) {
							var lRowspan = rowspan, lColspan = colspan;
							if (lRowspan < 1) {
								lRowspan = 1;
							}
							if (lColspan < 1) {
								lColspan = 1;
							}
							var loRange = this.getRange(oXlsWorksheetCell.row,
									oXlsWorksheetCell.column,
									oXlsWorksheetCell.row + lRowspan - 1,
									oXlsWorksheetCell.column + lColspan - 1);
							if (lRowspan > 1 || lColspan > 1) {
								oXlsWorksheetCell.ws["!merges"].push(loRange);
							}
							var loRow = null, loCell = null, i = 0;
							for (i = 1; i < lRowspan; i++) {
								loRow = this.getRow(oXlsWorksheetCell.ws,
										oXlsWorksheetCell.row + i);
								loCell = this.getCell(loRow,
										oXlsWorksheetCell.column);
								this.copyCell(oXlsWorksheetCell, loCell);
							}
							for (i = 1; i < lColspan; i++) {
								loRow = this.getRow(oXlsWorksheetCell.ws,
										oXlsWorksheetCell.row);
								loCell = this.getCell(loRow,
										oXlsWorksheetCell.column + i);
								this.copyCell(oXlsWorksheetCell, loCell);
							}
						},
						getRange : function(fromRowIndex, fromColumnIndex,
								toRowIndex, toColumnIndex) {
							var loRange = {
								s : {
									r : fromRowIndex,
									c : fromColumnIndex
								},
								e : {
									r : toRowIndex,
									c : toColumnIndex
								}
							};
							return loRange;
						},
						setCell : function(oXlsWorksheetCell, value,
								formattedValue, formatString, formula,
								cellValueType, style, rowspan, colspan) {
							if (oXlsWorksheetCell.row > oXlsWorksheetCell.ws.maxRow) {
								oXlsWorksheetCell.ws.maxRow = oXlsWorksheetCell.row;
							}
							if (oXlsWorksheetCell.column > oXlsWorksheetCell.ws.maxCol) {
								oXlsWorksheetCell.ws.maxCol = oXlsWorksheetCell.column;
							}
							var lsRGBFillColorGroup = "FFDCE6F0";
							var lsRGBFillColorBorder = "FFCCCCCC";
							var lsRGBFillColorHeader = "FFE5E5E5";
							var lsRGBFillColorTotal = "FFFFFF00";
							var lsDefaultFontName = "Calibri";
							var lsDefaultFontSize = 11;
							var lsDefaultAlignmentVertical = "top";
							var lsDefaultAlignmentHorizontal = "left";
							var loDefaultBorderValue = {
								style : "medium",
								color : {
									rgb : lsRGBFillColorBorder
								}
							};
							var loDefaultBorder = {
								top : loDefaultBorderValue,
								bottom : loDefaultBorderValue,
								left : loDefaultBorderValue,
								right : loDefaultBorderValue
							};
							var loStyleNone = {
								font : {
									name : lsDefaultFontName,
									sz : lsDefaultFontSize,
									bold : false
								},
								alignment : {
									vertical : lsDefaultAlignmentVertical,
									horizontal : lsDefaultAlignmentHorizontal,
									wrapText : false,
									indent : 0
								}
							};
							var loStyleDefault = {
								font : {
									name : lsDefaultFontName,
									sz : lsDefaultFontSize,
									bold : false
								},
								alignment : {
									vertical : lsDefaultAlignmentVertical,
									horizontal : lsDefaultAlignmentHorizontal,
									wrapText : false,
									indent : 0
								},
								border : loDefaultBorder
							};
							var loStyleGroup = {
								font : {
									name : lsDefaultFontName,
									sz : lsDefaultFontSize,
									bold : false
								},
								fill : {
									fgColor : {
										rgb : lsRGBFillColorGroup
									}
								},
								alignment : {
									vertical : lsDefaultAlignmentVertical,
									horizontal : lsDefaultAlignmentHorizontal,
									wrapText : false,
									indent : 0
								},
								border : loDefaultBorder
							};
							var loStyleHeader = {
								font : {
									name : lsDefaultFontName,
									sz : lsDefaultFontSize,
									bold : false
								},
								fill : {
									fgColor : {
										rgb : lsRGBFillColorHeader
									}
								},
								alignment : {
									vertical : lsDefaultAlignmentVertical,
									horizontal : lsDefaultAlignmentHorizontal,
									wrapText : false,
									indent : 0
								},
								border : loDefaultBorder
							};
							var loStyleTotal = {
								font : {
									name : lsDefaultFontName,
									sz : lsDefaultFontSize,
									bold : false
								},
								fill : {
									fgColor : {
										rgb : lsRGBFillColorTotal
									}
								},
								alignment : {
									vertical : lsDefaultAlignmentVertical,
									horizontal : lsDefaultAlignmentHorizontal,
									wrapText : false,
									indent : 0
								},
								border : loDefaultBorder
							};
							if (style !== "NONE" && this.allowStyles === true) {
								if (style === "GROUP") {
									oXlsWorksheetCell.s = loStyleGroup;
								} else {
									if (style === "HEADER") {
										oXlsWorksheetCell.s = loStyleHeader;
									} else {
										if (style === "TOTAL") {
											oXlsWorksheetCell.s = loStyleTotal;
										} else {
											oXlsWorksheetCell.s = loStyleDefault;
										}
									}
								}
							} else {
								oXlsWorksheetCell.s = loStyleNone;
							}
							if (cellValueType === "NUMBER") {
								oXlsWorksheetCell.s.alignment.horizontal = "right";
								oXlsWorksheetCell.v = value;
								oXlsWorksheetCell.t = "n";
							} else {
								if (cellValueType === "DATE") {
									oXlsWorksheetCell.v = value;
									oXlsWorksheetCell.t = "d";
								} else {
									oXlsWorksheetCell.v = formattedValue;
									oXlsWorksheetCell.t = "s";
								}
							}
							if (formula) {
								oXlsWorksheetCell.f = formula;
							}
							oXlsWorksheetCell.s.numFmt = formatString;
							if (formatString != null && formatString.length > 0) {
								oXlsWorksheetCell.z = formatString;
								var lFormatIndex = this.formatIndexMap[formatString];
								if (!lFormatIndex) {
									while (XLSX.SSF.get_table()[this.formatIndex]) {
										this.formatIndex++;
									}
									lFormatIndex = this.formatIndex;
									this.formatIndexMap[formatString] = lFormatIndex;
									this.formatIndex++;
									XLSX.SSF.load(formatString, lFormatIndex);
								}
								oXlsWorksheetCell.z = XLSX.SSF.get_table()[lFormatIndex];
								XLSX.utils.format_cell(oXlsWorksheetCell);
							} else {
								oXlsWorksheetCell.w = formattedValue;
							}
							this.mergeCell(oXlsWorksheetCell, rowspan, colspan);
						},
						save : function(filename) {
							var lBuffer = this.getAsBinary();
							var lBlob = new Blob([ lBuffer ], {
								type : "application/octet-stream"
							});
							var lUrl = URL.createObjectURL(lBlob);
							var saveData = (function() {
								var lElement = document.createElement("a");
								document.body.appendChild(lElement);
								lElement.style = "display: none";
								return function(lUrl, filename) {
									lElement.href = lUrl;
									lElement.download = filename;
									lElement.click();
								};
							}());
							if (window.navigator
									&& window.navigator.msSaveOrOpenBlob) {
								window.navigator.msSaveOrOpenBlob(lBlob,
										filename);
							} else {
								saveData(lUrl, filename);
							}
							var f = function() {
								window.URL.revokeObjectURL(lUrl);
							};
							setTimeout(f, 1);
						},
						getAsBinary : function() {
							var lWorkbook = XLSX.write(this.wb, {
								bookType : "xlsx",
								bookSST : true,
								type : "binary",
								cellDates : true
							});
							function s2ab(stringValue) {
								var lBuffer = new ArrayBuffer(
										stringValue.length);
								var lView = new Uint8Array(lBuffer);
								for (var i = 0; i != stringValue.length; ++i) {
									lView[i] = stringValue.charCodeAt(i) & 255;
								}
								return lBuffer;
							}
							var lBuffer = s2ab(lWorkbook);
							return lBuffer;
						}
					});
	$Firefly.createClass("sap.buddha.LogEntry", oFF.XObject, {
		$statics : {
			create : function(le) {
				var logEntry = new sap.buddha.LogEntry();
				logEntry.le = le;
				return logEntry;
			}
		},
		getTime : function() {
			return this.le.time;
		},
		getDate : function() {
			return this.le.date;
		},
		getTimeStamp : function() {
			return this.le.timestamp;
		},
		getLevel : function() {
			return this.le.level;
		},
		getMessage : function() {
			return this.le.message;
		},
		getDetails : function() {
			return this.le.details;
		},
		getComponent : function() {
			return this.le.component;
		}
	});
	$Firefly.createClass("sap.buddha.LogEntryIterator", oFF.XObject, {
		$statics : {
			create : function(logEntries) {
				var iterator = new sap.buddha.LogEntryIterator();
				iterator.logEntries = logEntries;
				iterator.ix = 0;
				return iterator;
			}
		},
		logEntries : null,
		hasNext : function() {
			if (this.logEntries == null) {
				return false;
			}
			return (this.ix < this.logEntries.length);
		},
		next : function() {
			if (!this.hasNext()) {
				return null;
			}
			var le = sap.buddha.LogEntry.create(this.logEntries[this.ix]);
			this.ix++;
			return le;
		}
	});
	$Firefly.createClass("sap.buddha.XLogging", null, {
		$statics : {
			create : function() {
				var logger = new sap.buddha.XLogging();
				var bDebugMode = jQuery.sap.debug();
				logger.jQueryLogger = new jQuery.sap.log.getLogger("DSH",
						bDebugMode ? 4 : -1);
				logger.entries = [];
				jQuery.sap.log.addLogListener(logger);
				logger.components = {}, logger.components["DSH"] = true;
				return logger;
			},
			XALL : 6,
			XDEBUG : 4,
			XERROR : 1,
			XFATAL : 0,
			XINFO : 3,
			XNONE : -1,
			XTRACE : 5,
			XWARNING : 2
		},
		onLogEntry : function(le) {
			if (this.components[le.component]) {
				this.entries.push(le);
			}
		},
		setLogLevelInternal : function(sComponent) {
			if (sComponent) {
				this.components[sComponent] = true;
				this.jQueryLogger.setLevel(4, sComponent);
			}
		},
		debug : function(sMessage, sDetails, sComponent) {
			this.setLogLevelInternal(sComponent);
			this.jQueryLogger.debug(sMessage, sDetails, sComponent);
		},
		error : function(sMessage, sDetails, sComponent) {
			this.setLogLevelInternal(sComponent);
			this.jQueryLogger.error(sMessage, sDetails, sComponent);
		},
		fatal : function(sMessage, sDetails, sComponent) {
			this.setLogLevelInternal(sComponent);
			this.jQueryLogger.fatal(sMessage, sDetails, sComponent);
		},
		info : function(sMessage, sDetails, sComponent) {
			this.setLogLevelInternal(sComponent);
			this.jQueryLogger.info(sMessage, sDetails, sComponent);
		},
		isLoggable : function(iLevel) {
			return this.jQueryLogger.isLoggable(iLevel, "DSH");
		},
		trace : function(sMessage, sDetails, sComponent) {
			this.setLogLevelInternal(sComponent);
			this.jQueryLogger.trace(sMessage, sDetails, sComponent);
		},
		warning : function(sMessage, sDetails, sComponent) {
			this.setLogLevelInternal(sComponent);
			this.jQueryLogger.warning(sMessage, sDetails, sComponent);
		},
		toString : function() {
			return "[???]";
		},
		getLogs : function() {
			return sap.buddha.LogEntryIterator.create(this.entries);
		}
	});
	$Firefly.createClass("sap.buddha.XZip", oFF.XObject, {
		$statics : {
			create : function(le) {
				var xZip = new sap.buddha.XZip();
				xZip.zip = new jszip();
				return xZip;
			}
		},
		saveToFile : function(filePath, content) {
			this.zip.file(filePath, content, {
				binary : true
			});
		},
		saveStringToFile : function(filePath, contentAsString) {
			this.zip.file(filePath, contentAsString);
		},
		getZipAsBinary : function() {
			var buf = this.zip.generate({
				type : "uint8array"
			});
			return buf;
		},
		saveZip : function(fileName) {
			var buf = this.zip.generate({
				type : "uint8array"
			});
			var blob = new Blob([ buf ], {
				type : "application/zip"
			});
			var url = URL.createObjectURL(blob);
			var saveData = (function() {
				var a = document.createElement("a");
				document.body.appendChild(a);
				a.style = "display: none";
				return function(url, fileName) {
					a.href = url;
					a.download = fileName;
					a.click();
				};
			}());
			if (window.navigator && window.navigator.msSaveOrOpenBlob) {
				window.navigator.msSaveOrOpenBlob(blob, fileName);
			} else {
				saveData(url, fileName);
			}
			var f = function() {
				window.URL.revokeObjectURL(url);
			};
			setTimeout(f, 1);
		}
	});
	$Firefly
			.createClass(
					"sap.buddha.XLocalization",
					null,
					{
						$statics : {
							createForUrl : function(sUrl) {
								jQuery.sap.require("jquery.sap.resources");
								var localization = new sap.buddha.XLocalization();
								localization.resourceBundle = jQuery.sap
										.resources({
											url : sUrl
										});
								return localization;
							},
							create : function() {
								if (sap.ui.getCore().getLoadedLibraries()
										.hasOwnProperty("sap.zen.dsh")) {
									return sap.buddha.XLocalization
											.createForUrl(sapbi_page.staticMimeUrlPrefix
													+ "localization/localization.properties");
								} else {
									return sap.buddha.XLocalization
											.createForUrl("/aad/buddha/localization/localization.properties");
								}
							}
						},
						propertyMap : null,
						hasText : function(sKey) {
							return this.resourceBundle.hasText(sKey);
						},
						getText : function(sKey) {
							return this.resourceBundle.getText(sKey);
						},
						getText1 : function(sKey, sArg1) {
							return this.resourceBundle.getText(sKey, [ sArg1 ]);
						},
						getText2 : function(sKey, sArg1, sArg2) {
							return this.resourceBundle.getText(sKey, [ sArg1,
									sArg2 ]);
						},
						getText3 : function(sKey, sArg1, sArg2, sArg3) {
							return this.resourceBundle.getText(sKey, [ sArg1,
									sArg2, sArg3 ]);
						},
						getText4 : function(sKey, sArg1, sArg2, sArg3, sArg4) {
							return this.resourceBundle.getText(sKey, [ sArg1,
									sArg2, sArg3, sArg4 ]);
						},
						getText5 : function(sKey, sArg1, sArg2, sArg3, sArg4,
								sArg5) {
							return this.resourceBundle.getText(sKey, [ sArg1,
									sArg2, sArg3, sArg4, sArg5 ]);
						},
						getText6 : function(sKey, sArg1, sArg2, sArg3, sArg4,
								sArg5, sArg6) {
							return this.resourceBundle.getText(sKey, [ sArg1,
									sArg2, sArg3, sArg4, sArg5, sArg6 ]);
						},
						getTranslationMap : function() {
							if (this.propertyMap === null) {
								var jsMap = this.resourceBundle.aPropertyFiles
										&& this.resourceBundle.aPropertyFiles.length > 0
										&& this.resourceBundle.aPropertyFiles[0]
										&& this.resourceBundle.aPropertyFiles[0].mProperties;
								this.propertyMap = oFF.XHashMapOfStringByString
										.create();
								if (typeof jsMap === "object") {
									for ( var key in jsMap) {
										if (jsMap.hasOwnProperty(key)) {
											this.propertyMap.put(key,
													jsMap[key]);
										}
									}
								}
							}
							return this.propertyMap;
						},
						toString : function() {
							return "[???]";
						}
					});
})(sap.buddha, sap.firefly);