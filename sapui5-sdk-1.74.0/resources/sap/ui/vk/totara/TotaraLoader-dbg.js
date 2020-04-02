sap.ui.define([
	"sap/base/Log",
	"./SceneContext",
	"./CallbackHandler",
	"./Command",
	"./TotaraUtils",
	"../threejs/SceneBuilder",
	"sap/ui/thirdparty/URI"
], function(
	Log,
	SceneContext,
	CallbackHandler,
	Command,
	TotaraUtils,
	SceneBuilder,
	URI
) {
	"use strict";

	var mark = TotaraUtils.mark;  // performance mark

	var TotaraLoader = function() {
		this._pushMesh = false;
		this._url = null;
		this._cid = null;
		this._performanceTimingMsg = [];
		this._isPostable = true;

		this.currentSceneInfo = {}; // TODO: should be removed!

		this.sceneBuilder = new SceneBuilder();

		this.contextMap = new Map();      // sceneId -> SceneContext. One 3D model can consist of multiple 3D scenes loaded from the (same?) storage service.
		this.tokenContextMap = new Map(); // token -> SceneContext

		// event related
		this.onErrorCallbacks = new CallbackHandler();
		this.onImageFinishedCallbacks = new CallbackHandler();
		this.onMaterialFinishedCallbacks = new CallbackHandler();
		this.onSetGeometryCallbacks = new CallbackHandler();
		this.onSetSequenceCallbacks = new CallbackHandler();
		this.onSetTrackCallbacks = new CallbackHandler();
		this.onViewGroupUpdatedCallbacks = new CallbackHandler();
		this.onLoadingFinishedCallbacks = new CallbackHandler();
	};

	TotaraLoader.prototype.init = function(ssurl, correlationId) {
		this._url = ssurl;
		this._cid = correlationId;

		var that = this;
		return new Promise(function(resolve) {
			if (!that._worker) {
				// The script URL cannot be used directly with WebWorker as this causes CORS error with FLP
				// As a workaround we can pass script URL to WebWorker as a Blob

				var uri = new URI(sap.ui.require.toUrl("sap/ui/vk/totara/TotaraLoaderWorker.js"));
				if (uri.is("relative")) {
					uri = uri.absoluteTo(new URI(location.href));
				}

				var scriptList = "'" + uri.toString() + "'";
				if (sap.ui.Device.browser.internet_explorer) {
					// We need to include polyfills for IE11 as they are not automatically loaded in WebWorker
					var polyfillPromise = new URI(sap.ui.require.toUrl("sap/ui/thirdparty/es6-promise.js"));
					var polyfillString = new URI(sap.ui.require.toUrl("sap/ui/thirdparty/es6-string-methods.js"));
					if (polyfillPromise.is("relative")) {
						polyfillPromise = polyfillPromise.absoluteTo(new URI(location.href));
						polyfillString = polyfillString.absoluteTo(new URI(location.href));
					}
					scriptList = "'" + polyfillPromise.toString() + "','" + polyfillString.toString() + "'," + scriptList;
				}

				that._worker = new Worker((window.URL || window.webkitURL).createObjectURL(
					new Blob([ "importScripts(" + scriptList + ");" ], { "type": "application/javascript" })));

				that._worker.onmessage = function(event) {
					var context;
					var data = event.data;
					if (data.ready) {
						// Just an initial signal that worker is ready for processing
						return;
					}

					if (data.name === "getAuthorization") {
						// If the application provided authorization handler then we will call it

						if (data.sceneId) {
							context = that.getContext(data.sceneId);
						}

						if (context && context.authorizationHandler) {
							context.authorizationHandler(data.jsonContent.url).then(function(token) {
								that.postMessage({
									"method": "setAuthorization",
									"authorizationToken": token
								});
							})
							.catch(function(err) {
								that.postMessage({
									"method": "setAuthorization",
									"authorizationToken": null,
									"error": err.toString()
								});
							});
						} else {
							that.postMessage({
								"method": "setAuthorization",
								"authorizationToken": null
							});
						}
						return;
					}

					if (data.name === "protocol") {
						that.protocolVersion = data.jsonContent.version.split(".").map(function(s) { return parseInt(s, 10); });
						return;
					}

					context = that.processCommand(data.name, data.jsonContent, data.binaryContent);

					if (context) {
						that.sendRequest(context.requestQueue);
					}
				};

				that._worker.onerror = function(event) {
					// Log.error("Error in WebWorker", event);
				};
			}
		});
	};

	TotaraLoader.prototype.dispose = function() {
		this.contextMap.forEach(function(context) {
			context.dispose();
		});
		this.contextMap.clear();
		this.tokenContextMap.clear();

		this.postMessage({ method: "close" });
		this._worker = undefined;

		this.currentSceneInfo = null;

		this.sceneBuilder.cleanup();
		this.sceneBuilder = null;

		this.onErrorCallbacks = null;
		this.onMaterialFinishedCallbacks = null;
		this.onImageFinishedCallbacks = null;
		this.onSetGeometryCallbacks = null;
		this.onSetTrackCallbacks = null;
		this.onSetSequenceCallbacks = null;
	};

	TotaraLoader.prototype.cleanup = function() {
		this.currentSceneInfo = {};
		this.contextMap.clear();
		this.tokenContextMap.clear();

		this.sceneBuilder.cleanup();
	};

	// if pushMesh is disabled (which is default), loader will try to request meshes
	// then geometries. If this is set to true, we assume we have everything already and do not
	// request anything
	TotaraLoader.prototype.enablePushMesh = function(enable) {
		this._pushMesh = enable;
	};

	TotaraLoader.prototype.getUrl = function() {
		return this._url;
	};

	TotaraLoader.prototype.getSceneBuilder = function(){
		return this.sceneBuilder;
	};

	TotaraLoader.prototype.getContext = function(sceneId) {
		return this.contextMap.get(sceneId);
	};

	TotaraLoader.prototype.createContext = function(sceneId, params) {
		var context = new SceneContext(sceneId, params, this);

		this.contextMap.set(sceneId, context);
		this.tokenContextMap.set(context.requestQueue.token, context);

		// attach callbacks
		if (context.onActiveCamera) {
			context.onActiveCameraCallbacks.attach(context.onActiveCamera);
			delete context.onActiveCamera;
		}

		if (context.onInitialSceneFinished) {
			context.onInitialSceneFinishedCallbacks.attach(context.onInitialSceneFinished);
			delete context.onInitialSceneFinished;
		}

		if (context.onPartialRetrievalFinished) {
			context.onPartialRetrievalFinishedCallbacks.attach(context.onPartialRetrievalFinished);
			delete context.onPartialRetrievalFinished;
		}

		if (context.onViewPartialRetrievalFinished) {
			context.onViewPartialRetrievalFinishedCallbacks.attach(context.onViewPartialRetrievalFinished);
			delete context.onViewPartialRetrievalFinished;
		}

		if (context.onViewFinished) {
			context.onViewFinishedCallbacks.attach(context.onViewFinished);
			delete context.onViewFinished;
		}

		if (context.onSceneCompleted) {
			context.onSceneCompletedCallbacks.attach(context.onSceneCompleted);
			delete context.onSceneCompleted;
		}

		if (context.onProgressChanged) {
			context.setOnProgressChanged(context.onProgressChanged);
			delete context.onProgressChanged;
		}

		if (context.onLoadingFinished) {
			this.onLoadingFinishedCallbacks.detachAll();
			this.onLoadingFinishedCallbacks.attach(context.onLoadingFinished);
			delete context.onLoadingFinished;
		}

		if (context.onContentChangesProgress) {
			context.onContentChangesProgressCallbacks.attach(context.onContentChangesProgress);
			delete context.onContentChangesProgress;
		}

		return context;
	};

	TotaraLoader.prototype.isLoadingFinished = function() {
		var contextIterator = this.contextMap.values();
		var contextItem = contextIterator.next();
		while (!contextItem.done) {
			if (!contextItem.value.isLoadingFinished()) {
				return false;
			}
			contextItem = contextIterator.next();
		}

		// console.log("!!!!! Loading finished", this);
		return true;
	};

	TotaraLoader.prototype.decrementResourceCountersForDeletedTreeNode = function(context, nodeId) {
		if (context) {
			this.sceneBuilder.decrementResourceCountersForDeletedTreeNode(nodeId, context.sceneId);
		}
	};

	function logPerformance(context, name) {
		if (context.progressLogger) {
			context.progressLogger.logPerformance(name, context.token);
		}
	}

	TotaraLoader.prototype.request = function(sceneVeId, contextParams, authorizationHandler) {
		if (!contextParams.root) {
			throw "context must include root where three js objects are attached to";
		}

		// console.log("!!! request ", contextParams);
		var context = this.createContext(sceneVeId, contextParams);
		context.token = context.requestQueue.token;

		this.currentSceneInfo.id = sceneVeId;
		context.retrievalType = SceneContext.RetrievalType.Initial;
		context.authorizationHandler = authorizationHandler;

		context.initialRequestTime = Date.now();

		if (context.enableLogger) {
			TotaraUtils.createLogger(sceneVeId, context, this);
		}

		context.includeHidden = contextParams.includeHidden;
		context.includeAnimation = contextParams.includeAnimation;
		context.selectField = contextParams.$select;
		context.pushViewGroups = contextParams.pushViewGroups;
		context.pushPMI = contextParams.pushPMI;
		context.metadataFilter = contextParams.metadataFilter;
		context.activateView = contextParams.activateView;

		var commandInStr = TotaraUtils.createCommand(Command.getScene, { sceneId: sceneVeId });

		logPerformance(context, "modelRequested");
		mark("modelRequested");
		this.postMessage({
			method: "initializeConnection",
			url: this._url,
			cid: this._cid,  // correlation ID
			useSecureConnection: contextParams.useSecureConnection,
			token: context.token,
			command: commandInStr,
			sceneId: sceneVeId
		});
	};

	TotaraLoader.prototype.postMessage = function(message) {
		if (this._worker) {
			this._worker.postMessage(message);
		}
	};

	TotaraLoader.prototype.processSetSceneCommand = function(jsonContent) {
		var context = this.getContext(jsonContent.veid);

		if (context) {
			context.defaultViewId = jsonContent.defaultViewId;
			context.defaultViewGroupId = jsonContent.defaultViewGroupId;
			context.sceneThumbnailId = jsonContent.imageId;
			context.dimension = jsonContent.dimension;
			context.defaultRootEntityId = jsonContent.defaultRootEntityId;

			if (context.defaultViewGroupId) {
				context.currentViewGroupId = context.defaultViewGroupId;
			}

			var includeHidden = context.includeHidden !== undefined ? context.includeHidden : true; // include hidden by default
			var includeAnimation = context.includeAnimation !== undefined ? context.includeAnimation : true; // include animation by default
			var selectField = context.$select !== undefined ? context.$select : "name,transform,meshId,annotationId,materialId,contentType,visible,opacity,renderOrder,entityId,highlightStyleId";
			var pushViewGroups = context.pushViewGroups !== undefined ? context.pushViewGroups : true;

			var viewOptions = {
				pushMaterials: true,
				pushMeshes: this._pushMesh,
				sceneId: context.sceneId,
				token: context.token,
				includeHidden: includeHidden,
				includeAnimation: includeAnimation,
				pushViewGroups: pushViewGroups,
				pushPMI: context.pushPMI || false,
				metadataFilter: context.metadataFilter,
				$select: selectField
			};

			viewOptions.context = context.sceneId;

			if (context.activateView) {
				viewOptions.id = context.activateView;
			} else if (context.defaultViewId) {
				viewOptions.id = context.defaultViewId;
			}

			if (viewOptions.id) {
				context.initialViewId = viewOptions.id;
				context.currentViewId = viewOptions.id;
				context.initialViewDecided = true;
			}

			this.postMessage(TotaraUtils.createRequestCommand(Command.getView, viewOptions));
		}
	};

	// Returns promise that performs partial tree retrieval
	// Partial tree retrival is considered finished when we get all the meshes
	// If there is no need to retrieve meshes (e.g delete node), it will finish
	// when the tree building is finished.
	// viewId is optional
	TotaraLoader.prototype.update = function(sceneVeId, sidArray, viewId) {
		this.currentSceneInfo.id = sceneVeId;

		var context = this.getContext(sceneVeId);
		if (!context) {
			return Promise.reject("no context for ${sceneVeId}");
		}

		var that = this;
		return new Promise(function(resolve, reject) {

			// context.nodeSidsForPartialTree.clear();
			context.nodeSidsForPartialTree = new Set(sidArray);

			context.retrievalType = SceneContext.RetrievalType.Partial;
			var includeHidden = context.includeHidden !== undefined ? context.includeHidden : true; // include hidden by default
			var includeAnimation = context.includeAnimation !== undefined ? context.includeAnimation : true; // include animation by default
			var selectField = context.$select !== undefined ? context.$select : "name,transform,meshId,annotationId,materialId,contentType,visible,opacity,renderOrder,entityId";
			var pushViewGroups = context.pushViewGroups !== undefined ? context.pushViewGroups : true;

			var options = {
				sceneId: sceneVeId,
				token: context.token,
				pushMaterials: true,
				pushMeshes: that._pushMesh,
				filter: sidArray.join(),
				includeAnimation: includeAnimation,
				includeHidden: includeHidden,
				pushPMI: context.pushPMI || false,
				metadataFilter: context.metadataFilter,
				pushViewGroups: pushViewGroups,
				$select: selectField,
				breadcrumbs: true
			};


			if (viewId) {
				options.activateView = viewId;
			}

			var commandInStr = TotaraUtils.createCommand(Command.getTree, options);

			var callback = function() {
				context.onPartialRetrievalFinishedCallbacks.detach(callback);
				logPerformance(context, "updateFinished(mesh)");
				var rnks = [];
				var rnvs = [];
				context.replacedNodes.forEach(function(value, key){ rnvs.push(value); rnks.push(key); });

				var replacedNodes = rnks; // Array.from(context.replacedNodes.keys());
				var replacementNodes = rnvs; // Array.from(context.replacedNodes.values());
				resolve({
					sceneVeId: sceneVeId,
					sids: sidArray,
					replacedNodeRefs: replacedNodes,
					replacementNodeRefs: replacementNodes
				}); // succesfully finished partial retrieval
			};

			context.onPartialRetrievalFinishedCallbacks.attach(callback);

			logPerformance(context, "updateRequested");
			// connection.send(commandInStr, context);

			that.postMessage({
				method: "update",
				command: commandInStr
			});
		});
	};

	TotaraLoader.prototype.requestViewGroup = function(sceneVeId, viewGroupId, includeAnimation) {
		if (!viewGroupId) {
			return Promise.reject("invalid arg: viewGroupId undefined");
		}

		var context = this.getContext(sceneVeId);
		if (!context) {
			return Promise.reject("no context for ${sceneVeId}");
		}

		if (includeAnimation !== undefined) {
			context.includeAnimation = includeAnimation;
		}

		var that = this;
		var promise = new Promise(function(resolve, reject) {
			var views = that.sceneBuilder.getViewGroup(viewGroupId, sceneVeId);
			if (views && views.length) {
				resolve(views);
				return;
			}

			var options = {
				sceneId: sceneVeId,
				id: viewGroupId,
				token: context.token
			};

			var callback = function() {
				context.onViewGroupFinishedCallbacks.detach(callback);

				logPerformance(context, "onViewGroupFinished");

				var viewgroup = that.sceneBuilder.getViewGroup(viewGroupId, sceneVeId);
				if (viewgroup && viewgroup.length) {
					resolve(viewgroup);
				} else {
					reject("no view ground data");
				}
			};
			context.onViewGroupFinishedCallbacks.attach(callback);

			context.currentViewGroupId = viewGroupId;

			that.postMessage(TotaraUtils.createRequestCommand(Command.getViewGroups, options));
		});
		return promise;
	};

	TotaraLoader.prototype.requestView = function(sceneVeId, viewType, viewId, playbackIds, includeAnimation) {
		this.currentSceneInfo.id = sceneVeId;

		if (viewType !== "static" && viewType !== "dynamic") {
			return Promise.reject("invalid arg: supported type - static, dynamic");
		}

		if (!viewId) {
			return Promise.reject("invalid arg: viewId undefined");
		}

		var context = this.getContext(sceneVeId);
		if (!context) {
			return Promise.reject("no context for ${sceneVeId}");
		}

		context.currentViewId = viewId;

		var includeHidden = context.includeHidden !== undefined ? context.includeHidden : false; // not include hidden by default

		var includeAnimationOption;
		if (includeAnimation) {
			includeAnimationOption = includeAnimation;
		} else {
			includeAnimationOption = context.includeAnimation !== undefined ? context.includeAnimation : true; // include animation by default
		}

		var selectField = context.$select !== undefined ? context.$select : undefined;

		this.hasAnimation = false;   // will be check on callback of setPlayback.

		var that = this;
		var promise = new Promise(function(resolve, reject) {

			// This piece of code avoids going to server for view info which is already fetched,
			// but also bypasses ViewBuilder.js, which handles node material update,
			// as a temporary fix for node material updating, we comment out the code, and ask for
			// view info from server every time.
			// Refactoring in totara.ViewBuilder and threejs.Viewport is required to properly fix the problem
			/*
			if (useCurrentDataIfAvailable) {
				var view = that.sceneBuilder.getView(viewId, sceneVeId);
				if (view) {
					resolve(view);
					return;
				}
			}
			*/
			var command, options;
			if (viewType === "static") {
				command = Command.getView;

				options = {
					sceneId: sceneVeId,
					id: viewId,
					token: context.token,
					includeHidden: includeHidden,
					includeAnimation: includeAnimationOption,
					$select: selectField
				};

				if (playbackIds && playbackIds.length) {
					options.$expand = "playback";
					context.playbackIds = playbackIds;
				}
			} else {
				command = Command.getDynamicView;

				options = {
					sceneId: sceneVeId,
					type: viewId,
					token: context.token
				};
			}

			context.onSetPlaybackCallbacks.detachAll();
			var setPlaybackCallback = function(resultView) {
				context.onSetPlaybackCallbacks.detach(setPlaybackCallback);

				logPerformance(context, "onSetPlayback");

				if (resultView) {
					resolve(resultView);
				} else {
					reject("no view data");
				}
			};
			context.onSetPlaybackCallbacks.attach(setPlaybackCallback);

			context.onViewFinishedCallbacks.detachAll();
			var callback = function(resultView) {
				context.onViewFinishedCallbacks.detach(callback);

				logPerformance(context, "onViewFinished");

				if (!that.hasAnimation){
					if (resultView) {
						resolve(resultView);
					} else {
						reject("no view data");
					}
				} else {
					context.currentView = resultView;

				}
			};
			context.onViewFinishedCallbacks.attach(callback);

			that.onSetSequenceCallbacks.detachAll();
			var setSequenceCallback = function() {
				that.onSetSequenceCallbacks.detach(setSequenceCallback);

				logPerformance(context, "onSetSequence");

				if (context.currentView){
					resolve(context.currentView);
				} else {
					reject("no view data");
				}

			};
			that.onSetSequenceCallbacks.attach(setSequenceCallback);

			that.onSetTrackCallbacks.detachAll();
			var setTrackCallback = function(resultView) {
				that.onSetTrackCallbacks.detach(setTrackCallback);

				logPerformance(context, "onSetTrack");

				if (context.currentView){
					resolve(context.currentView);
				} else {
					reject("no view data");
				}
			};
			that.onSetTrackCallbacks.attach(setTrackCallback);

			logPerformance(context, "viewRequested");

			that.postMessage(TotaraUtils.createRequestCommand(command, options));
		});

		return promise;
	};

	TotaraLoader.prototype.requestMaterial = function(sceneVeId, materialId) {
		if (!materialId) {
			return Promise.reject("invalid arg: materialId undefined");
		}

		var context = this.getContext(sceneVeId);
		if (!context) {
			return Promise.reject("no context for ${sceneVeId}");
		}

		var that = this;
		var promise = new Promise(function(resolve, reject) {

			var material = context.sceneBuilder.getMaterial(materialId);
			if (material) {
				resolve(material);
				return;
			}

			context.requestQueue.materials.push(materialId);

			var imageFinishedCallback = function(result) {
				var m = that.sceneBuilder.getMaterial(materialId);
				if (m && !m.userData.imageIdsToLoad) {// no more texture images to load, this material is now completed, resolve the promise
					that.onImageFinishedCallbacks.detach(imageFinishedCallback);
					resolve(m);
				}
			};

			var materialFinishedCallback = function(newMaterialId) {
				if (materialId != newMaterialId) {
					return;
				}

				that.onMaterialFinishedCallbacks.detach(materialFinishedCallback);

				var m = that.sceneBuilder.getMaterial(materialId);
				if (!m) {
					that.onImageFinishedCallbacks.detach(imageFinishedCallback);
					reject("no material data");
				}

				if (m.userData.imageIdsToLoad) {
					// we are waiting for material textures to arrive
					return;
				}

				// no texture images to load, detach image callback and resolve the promise
				that.onImageFinishedCallbacks.detach(imageFinishedCallback);
				resolve(m);
			};

			that.onMaterialFinishedCallbacks.attach(materialFinishedCallback);

			that.onImageFinishedCallbacks.attach(imageFinishedCallback);

			that.sendRequest(context.requestQueue);
		});

		return promise;
	};

	TotaraLoader.prototype.sendRequest = function(requestQueue) {
		if (!this._worker) {
			return false;
		}

		var somethingRequested = false;

		while (!requestQueue.isEmpty()) {
			var newCommand = requestQueue.generateRequestCommand();
			// console.log("postMessage", newCommand);
			this.postMessage(newCommand);
			somethingRequested = true;
		}

		return somethingRequested;
	};

	TotaraLoader.prototype.timestamp = function(jsonContent) {
	};

	TotaraLoader.prototype.performanceTiming = function(jsonContent) {
	};

	TotaraLoader.prototype.checkError = function(jsonContent) {
		if (!jsonContent) {
			return true;
		}

		var result = jsonContent.result === "failure";
		if (result) {
			// if error, change the field name a little bit
			if (jsonContent.message) {
				jsonContent.error = jsonContent.message;
				delete jsonContent.message;
			} else {
				jsonContent.error = "Unknown error";
			}
		}

		return result;
	};

	TotaraLoader.prototype.reportError = function(context, errorText) {
		this.onErrorCallbacks.execute({
			error: errorText,
			context: context
		});
	};

	TotaraLoader.prototype.processContextCommand = function(context, name, jsonContent, binaryContent) {
		if (!context) {
			var error = name + " error: unknown context - " + JSON.stringify(jsonContent);
			this.contextMap.forEach(function(context) {
				context[name].call(context, jsonContent, binaryContent);
			});
			return { error: error };
		}

		return context[name].call(context, jsonContent, binaryContent);
	};

	TotaraLoader.prototype.processCommand = function(name, jsonContent, binaryContent) {
		// console.log("process", name, jsonContent.sceneId)
		if (this.checkError(jsonContent)) {
			if (name === Command.setTree) {// ?
				if (jsonContent.events && jsonContent.events.length) { // check if setTree has infomation about the id
					var event = jsonContent.events[ 0 ];
					if (event.values && event.values.id) {
						// setTree context carries scene veid. remove it since failed
						this.contextMap.delete(event.values.id);
					}
				}
			}

			this.onErrorCallbacks.execute(jsonContent);
			return null;
		}

		var context = null;
		if (jsonContent.sceneId !== undefined) {
			context = this.getContext(jsonContent.sceneId);
		} else if (jsonContent.token !== undefined) {
			context = this.tokenContextMap.get(jsonContent.token);
		}
		if (context) {
			this.currentSceneInfo.id = context.sceneId;
		}

		this.setPerformance(name, jsonContent, context ? context.sceneId : null);

		var result;
		switch (name) {
			case Command.setScene:
				this.processSetSceneCommand(jsonContent);
				break;
			case Command.setTree:
			case Command.setTreeNode:
			case Command.notifyFinishedTree:

			case Command.setView:
			case Command.setViewNode:
			case Command.setViewGroup:
			case Command.notifyFinishedView:

			case Command.setCamera:
			case Command.setMesh:
			case Command.setMaterial:
			case Command.setGeometry:
			case Command.setImage:
			case Command.setAnnotation:

			case Command.setPlayback:
			case Command.setHighlightStyle:
			case Command.setSequence:
			case Command.setTrack:

				result = this.processContextCommand(context, name, jsonContent, binaryContent);

				break;

			case Command.notifyError: result = { error: jsonContent.errorText }; break;
			case Command.timestamp: result = this.timestamp(jsonContent); break;
			case Command.performanceTiming: result = this.performanceTiming(jsonContent); break;

			default: result = { error: "Unknown command: " + name }; break;
		}

		if (name !== Command.setView &&
			name !== Command.setViewNode &&
			name !== Command.timestamp &&
			name !== Command.performanceTiming &&
			this.isLoadingFinished()) {
			this.onLoadingFinishedCallbacks.execute();
			Log.info("Loading is finished - all streaming requests are fulfilled.");
		}

		if (result && result.error) {
			Log.error(result.error);
			this.onErrorCallbacks.execute(result);
		}

		return context;
	};

	TotaraLoader.prototype.setPerformance = function(name, jsonContent, sid) {
		var id;
		switch (name) {
			case Command.setGeometry:
				id = jsonContent.id;
				mark("setGeometry-" + id);
				break;
			case Command.setImage:
				id = jsonContent.id;
				mark("setImage-" + id);
				break;
			case Command.setView:
				id = jsonContent.viewId;
				mark("setView-" + id);
				break;
			case Command.setViewGroup:
				id = jsonContent.id;
				mark("setViewGroup-" + id);
				break;
			case Command.setMesh:
				mark("setMesh-" + sid);
				break;
			case Command.setMaterial:
				mark("setMaterial-" + sid);
				break;
			case Command.setTree:
				mark("setTree-" + sid);
				break;
			case Command.performanceTiming:
				this._isPostable = true;
				this.postPerformanceTiming();
				break;
			default:
				break;
		}
	};

	TotaraLoader.prototype.postPerformanceTiming = function(msg) {
		if (msg) {
			this._performanceTimingMsg.push(msg);
		}
		if (this._isPostable && this._performanceTimingMsg.length > 0) {
			this.postMessage(this._performanceTimingMsg.shift());
			this._isPostable = false;
		}
	};

	TotaraLoader.prototype.printLogTokens = function() {
		this.contextMap.forEach(function(context, sceneId) {
			Log.info("log tokens for scene => " + sceneId);
			Log.info("---------------------------------------");
			if (context.progressLogger) {
				context.progressLogger.getTokens().forEach(function(token) {
					Log.info(token);
				});
			}
			Log.info("---------------------------------------");
		});
	};

	return TotaraLoader;
});
