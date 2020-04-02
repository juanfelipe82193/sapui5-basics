/*!
* SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
*/

/* global THREE */

// Provides control sap.ui.vk.threejs.ContentDeliveryService.
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/ManagedObject",
	"../totara/TotaraLoader",
	"./Material",
	"./thirdparty/three",
	"../getResourceBundle",
	"../ObjectType"
], function(jQuery,
	ManagedObject,
	TotaraLoader,
	Material,
	threeJs,
	getResourceBundle,
	ObjectType
) {
	"use strict";

	/**
	 *  Constructor for a new ContentDeliveryService.
	 *
	 * @class Provides a class to communicate with content delivery service.
	 * @private
	 * @author SAP SE
	 * @version 1.74.0
	 * @extends sap.ui.base.ManagedObject
	 * @alias sap.ui.vk.threejs.ContentDeliveryService
	 */
	var ContentDeliveryService = ManagedObject.extend("sap.ui.vk.threejs.ContentDeliveryService", {
		metadata: {
			properties: {
				/**
				 * Callback functino to provide authorization token.
				 */
				authorizationHandler: "any"
			},
			events: {
				cameraChanged: {
					parameters: {
						sceneId: {
							type: "string"
						},
						camera: {
							type: "any"
						}
					},
					enableEventBubbling: true
				},
				sceneUpdated: {
					parameters: {
					},
					enableEventBubbling: true
				},
				viewGroupUpdated: {
					parameters: {
						currentViewGroupId: "string"
					},
					enableEventBubbling: true
				},
				sceneCompleted: {
					parameters: {
						sceneId: {
							type: "string"
						}
					},
					enableEventBubbling: true
				},
				loadingFinished: {
					parameters: {
						currentViewId: "string",
						currentViewGroupId: "string"
					},
					enableEventBubbling: true
				},
				contentChangesProgress: {
					parameters: {
						percent: "float"
					}
				},
				errorReported: {
					parameters: {
						error: {
							type: "any"
						}
					}
				}
			}
		}
	});

	var basePrototype = ContentDeliveryService.getMetadata().getParent().getClass().prototype;

	ContentDeliveryService.prototype.init = function() {
		if (basePrototype.init) {
			basePrototype.init.call(this);
		}
		this._loader = null;

		// note we keep transientRoot in the map for reference.
		// we do not increase reference counter for resources (e.g geometry)
		// as transient ones will be removed anyway
		// We keep the original tree with userData in '_transientSceneMap'. and give cloned ones
		// when requested.
		// For now, we will keep the transient scene reference for the life time of
		// contentDeliveryService (totara)
		this._transientSceneMap = new Map(); // keeps transient scene. Typically POIs and symbols.

		this._currentNodeHierarchy = null;
	};

	/**
	 * Sets url of content delivery service server.
	 * @param {string} url Url of content delivery service. Allowed protocols are HTTP, HTTPS, WS and WSS.
	 * @param {boolean} keepCachedData flag for keeping cached data in the loader
	 * @param {string} correlationId uuid for X-CorrelationID http header
	 * @returns {Promise} returns promise which will be resolved when initialization is finished.
	 */
	ContentDeliveryService.prototype.initUrl = function(url, keepCachedData, correlationId) {
		var that = this;
		// var connection;
		// var connectionInitPromise;

		function notifyUpdate() {
			that.fireSceneUpdated({});
		}

		function notifyViewGroupUpdate() {
			var currentViewGroupId;
			if (that._loader && that._loader.currentSceneInfo) {
				var context = that._loader.getContext(that._loader.currentSceneInfo.id);
				if (context) {
					currentViewGroupId = context.currentViewGroupId;
				}
			}
			that.fireViewGroupUpdated({ currentViewGroupId: currentViewGroupId });
		}

		if (!this._loader || this._loader.getUrl() !== url) {
			if (this._loader) {
				this._loader.dispose();
			}

			this._loader = new TotaraLoader();
			this._loader.onErrorCallbacks.attach(this._reportError.bind(that));
			this._loader.onMaterialFinishedCallbacks.attach(notifyUpdate);
			this._loader.onImageFinishedCallbacks.attach(notifyUpdate);
			this._loader.onSetGeometryCallbacks.attach(notifyUpdate);
			this._loader.onViewGroupUpdatedCallbacks.attach(notifyViewGroupUpdate);
			// set correlation ID for http header
			var cid = correlationId ? correlationId : THREE.Math.generateUUID().toLowerCase();
			return this._loader.init(url, cid);
		} else if (!keepCachedData) {
			this._loader.cleanup();
		}
		return Promise.resolve("Loader is ready");
	};

	ContentDeliveryService.prototype._reportError = function(error) {
		this.fireErrorReported(error);
	};

	ContentDeliveryService.prototype._createLoadParam = function(resolve, reject, parentNode, contentResource) {
		var that = this;
		var initialCamera;
		var sceneLoaded = false;
		var scene;
		if (this._currentNodeHierarchy) {
			scene = this._currentNodeHierarchy.getScene();
		}

		var contextParams = {
			root: parentNode,
			includeHidden: contentResource.getIncludeHidden(),
			includeAnimation: contentResource.getIncludeAnimation(),
			pushPMI: contentResource.getPushPMI(),
			metadataFilter: contentResource.getMetadataFilter(),
			useSecureConnection: contentResource.getUseSecureConnection(),
			activateView: contentResource.getActivateView(),
			enableLogger: contentResource.getEnableLogger() === true,
			pushViewGroups: contentResource.getPushViewGroups(),
			vkScene: scene,

			onActiveCamera: function(newCam) {
				var isInitialCam = false;
				var context = that._loader.getContext(contentResource.getVeid());
				if (context && context.phase < 2) { // 2 -> FinishedMesh
					// CDS is still getting the model
					initialCamera = newCam;
					isInitialCam = true;
				}

				if (!isInitialCam) {
					that.fireCameraChanged({
						sceneId: contentResource.getVeid(),
						camera: newCam
					});
				}
			},
			onInitialSceneFinished: function(initialView) {
				sceneLoaded = true;
				resolve({
					node: parentNode,
					camera: initialCamera,
					contentResource: contentResource,
					initialView: initialView,
					loader: that // passing cds as loader
				});
			},
			onSceneCompleted: function() {
				that.fireSceneCompleted({
					sceneId: contentResource.getVeid()
				});
			},
			onLoadingFinished: function() {
				var currentViewId, currentViewGroupId;
				if (that._loader && that._loader.currentSceneInfo) {
					var context = that._loader.getContext(that._loader.currentSceneInfo.id);
					if (context) {
						currentViewId = context.currentViewId;
						currentViewGroupId = context.currentViewGroupId;
					}
				}
				that.fireLoadingFinished({ currentViewId: currentViewId,
											currentViewGroupId: currentViewGroupId });
			},
			onContentChangesProgress: function(event) {
				that.fireContentChangesProgress({ source: event.source, phase: event.phase, percentage: event.percentage });
			}
		};

		var errorCallback = function(info) {
			var reason;
			if (info.getParameter("errorText")) {
				reason = info.getParameter("errorText");
			} else if (info.getParameter("error")) {
				reason = info.getParameter("error");
			} else if (info.getParameter("reason")) {
				reason = info.getParameter("reason");
			} else {
				reason = "failed to load: unknown reason";
			}

			if (sceneLoaded) {
				var errorCode = info.getParameter("error");
				if (errorCode && errorCode === 4) {
					// We had a good connection and now we lost it. Try to re-create connection
					that.initUrl(this._loader.getUrl(), true);
				}
			} else {
				that.detachErrorReported(errorCallback);

				// error from server has some detailed info
				if (info.getParameter("events")) {
					reason = reason + "\n" + JSON.stringify(info.getParameter("events"));
				}

				// if error happened before initial scene finished, we reject
				reject(reason);
			}
		};

		that.attachErrorReported(errorCallback);

		return contextParams;
	};

	ContentDeliveryService.prototype.load = function(parentNode, contentResource, authorizationHandler) {
		var that = this;

		var nodeProxy = contentResource.getNodeProxy();
		if (nodeProxy) {
			this._currentNodeHierarchy = nodeProxy.getNodeHierarchy();
		}

		return new Promise(function(resolve, reject) {
			if (!contentResource.getSource() || !contentResource.getVeid()) {
				reject(getResourceBundle().getText("CONTENTDELIVERYSERVICE_MSG_NOURLORVEID"));
				return;
			}

			that.initUrl(contentResource.getSource(), true);

			var contextParams = that._createLoadParam(resolve, reject, parentNode, contentResource);
			if	(that._loader) {
				that._loader.request(contentResource.getVeid(), contextParams, authorizationHandler);
			}
		});
	};

	ContentDeliveryService.prototype.getSceneBuilder = function() {
		if (this._loader) {
			return this._loader.getSceneBuilder();
		}
		return null;
	};

	// as threejs node which is a tree node can be dropped by nodeHierarchy.removeNode, we need to update it to cds
	ContentDeliveryService.prototype.decrementResourceCountersForDeletedTreeNode = function(sid) {
		var context = this._loader.getContext(this._loader.currentSceneInfo.id);
		this._loader.decrementResourceCountersForDeletedTreeNode(context, sid);
	};

	// We want to use this for light scene such as POIs and symbols
	// This is mainly used by authoring and whoever loaded transient scene should remove it when done with it.

	/**
	 * Add the transient scene to target parent.
	 * This method returns a promise which is resolved when we get all geometries for simplicity for now.
	 * @param {string} sceneVeId target scene id to update.
	 * @param {noderef} parentNodeRef parent nodeRef where this transient scene will be added
	 * @param {boolean} useSecureConnection <code>true</code> if use secure connection, otherwise <code>false</code> or <code>undefined</code>
	 * @returns {Promise} returns promise which gives nodeRef for transient scene.
	 */
	ContentDeliveryService.prototype.loadTransientScene = function(sceneVeId, parentNodeRef, useSecureConnection) {
		var that = this;

		return new Promise(function(resolve, reject) {

			if (!sceneVeId || !parentNodeRef) {
				reject(getResourceBundle().getText("CONTENTDELIVERYSERVICE_MSG_INVALIDARGUMENTS"));
				return;
			}

			if (that._transientSceneMap.has(sceneVeId)) {
				// if we already loaded this transientScene, just clone it
				var cloned = that._transientSceneMap.get(sceneVeId).clone(); // note this is cloned

				parentNodeRef.add(cloned);
				resolve({
					nodeRef: cloned
				});
				return;
			}

			if (!that._loader) { // check again
				reject(getResourceBundle().getText("CONTENTDELIVERYSERVICE_MSG_CONTENTDELIVERYSERVICENOTINITIALISED"));
				return;
			}

			var transientRoot = new THREE.Object3D();
			transientRoot.name = "transient";

			var onSceneCompleted = function() {
				var context = that._loader.getContext(sceneVeId);
				context.onSceneCompletedCallbacks.detach(onSceneCompleted); // clean up callback

				that._transientSceneMap.set(sceneVeId, transientRoot);

				var cloned = transientRoot.clone(); // note this is cloned.
				parentNodeRef.add(cloned);

				resolve({
					nodeRef: cloned
				});
			};

			var contextParams = {
				root: transientRoot,
				onSceneCompleted: onSceneCompleted,
				useSecureConnection: useSecureConnection
			};

			that._loader.request(sceneVeId, contextParams); // .request ends

		}); // promise ends
	};

	/**
	 * Update contents from Content delivery service
	 * @param {string} sceneId target scene id to update.
	 * @param {string[]} sids target sids to update.
	 * @param {string} viewId optional. Associated view if exists
	 * @returns {Promise} returns promise of content deliver service update
	 */
	 ContentDeliveryService.prototype.update = function(sceneId, sids, viewId) {
		var that = this;

		return new Promise(function(resolve, reject) {

			if (!that._loader) {
				reject(getResourceBundle().getText("CONTENTDELIVERYSERVICE_MSG_CONTENTDELIVERYSERVICENOTINITIALISED"));
				return;
			}

			that._loader.update(sceneId, sids, viewId).then(function(result){

				if (that._currentNodeHierarchy) {
					for (var i = 0; i < result.replacedNodeRefs.length; i++) {
						that._currentNodeHierarchy.fireNodeReplaced({ ReplacedNodeRef: result.replacedNodeRefs[i],
																	ReplacementNodeRef: result.replacementNodeRefs[i],
																	ReplacedNodeId: result.replacedNodeRefs[i],
																	ReplacementNodeId: result.replacementNodeRefs[i] });
					}
				}
				resolve({
					sceneVeId: result.sceneVeId,
					sids: result.sidArray
				});
			}).catch(function(error) {
				return reject(error);
			});
		}); // promise ends
	};

	ContentDeliveryService.prototype.exit = function() {
		if (basePrototype.exit) {
			basePrototype.exit.call(this);
		}
		if (this._loader) {
			this._loader.dispose();
			this._loader = null;
		}

		this._transientSceneMap = null;
	};

	/**
	 * Gets view object definition
	 * @param {string} sceneId target scene id
	 * @param {string} viewId view id
	 * @param {string} type type of view. (static or dynamic) - default static
	 * @param {boolean} includeAnimation if loading playbacks/animation sequences contained in the view
	 * @returns {sap.ui.vk.View} returns View object with definition
	 */
	ContentDeliveryService.prototype.loadView = function(sceneId, viewId, type, includeAnimation) {

		if (typeof type === "undefined") {
			type = "static";
		}
		var that = this;
		return this._loader.requestView(sceneId, type, viewId, null, includeAnimation).then(function(view) {

			if (that._currentNodeHierarchy && view.updatedNodes) {
				for (var i = 0; i < view.updatedNodes.length; i++) {
					that._currentNodeHierarchy.fireNodeUpdated({ nodeRef: view.updatedNodes[i] });
				}
			}
			that.fireSceneUpdated({});
			return view;
		}).catch(function(error) {
				jQuery.sap.log.error(error);
				return null;
		});
	};

	/**
	 * Gets view object definition
	 * @param {string} sceneId target scene id
	 * @param {string} viewId view id
	 * @param {string[]} playbackIds array of playback ids
	 * @returns {sap.ui.vk.View} returns View object with definition
	 */
	ContentDeliveryService.prototype.updatePlaybacks = function(sceneId, viewId, playbackIds) {

		var that = this;

		return this._loader.requestView(sceneId, "static", viewId, playbackIds, true).then(function(view) {

			if (that._currentNodeHierarchy && view.updatedNodes) {
				for (var i = 0; i < view.updatedNodes.length; i++) {
					that._currentNodeHierarchy.fireNodeUpdated({ nodeRef: view.updatedNodes[i] });
				}
			}
			that.fireSceneUpdated({});
			return view;
		}).catch(function(error) {
				jQuery.sap.log.error(error);
				return null;
		});
	};

	/**
	 * Gets view object definition
	 * @param {string} sceneId target scene id
	 * @param {string} viewGroupId view group id
	 * @param {boolean} includeAnimation if loading playbacks/animation sequences contained in the view
	 * @returns {sap.ui.vk.View[]} returns array of views
	 */
	 ContentDeliveryService.prototype.loadViewGroup = function(sceneId, viewGroupId, includeAnimation) {

		var that = this;
		return this._loader.requestViewGroup(sceneId, viewGroupId, includeAnimation).then(function(views) {
			that.fireSceneUpdated({});
			return views;
		}).catch(function(error) {
				jQuery.sap.log.error(error);
				return null;
		});
	};



	/**
	 * Assign material to an array of nodes, or to the nodes in the scene tree but not in the array of nodes, if a node is not a mesh node
	 * and has no material, the material is assigned to its descendent nodes.
	 * @param {string} sceneId target scene id
	 * @param {string} materialId material id
	 * @param {any[]} nodeRefs the array of node references.
	 * @param {boolean} assignToRestOfSceneTree if <code>false</code> or <code>undefined</code> assign metarial to the nodes in <code>nodeRefs</code>;
	 * 		  if <code>true</code> assign material to the nodes in the scene tree but not in <code>nodeRefs</code>
	 * @returns {Promise} returns promise which gives <code>true</code> if material is successfully assigned, and <code>false</code> otherwise
	 */
	 ContentDeliveryService.prototype.assignMaterialToNodes = function(sceneId, materialId, nodeRefs, assignToRestOfSceneTree) {
		var that = this;
		return this._loader.requestMaterial(sceneId, materialId).then(function(materialRef) {

			function assignMaterial(materialRef, nodeRef, recursive) {

				if (!nodeRef) {
					return;
				}

				if (nodeRef.userData.markedForNotAssigningMaterial) {
					delete nodeRef.userData.markedForNotAssigningMaterial;
					return;
				}

				if (that._currentNodeHierarchy) {
					var nodeProxy = that._currentNodeHierarchy.createNodeProxy(nodeRef);
					var material = new Material();
					material.setMaterialRef(materialRef);
					nodeProxy.assignMaterial(material);
					that._currentNodeHierarchy.destroyNodeProxy(nodeProxy);
				}

				if (recursive) {
					nodeRef.children.forEach(function(child) {
						if (!child || child.userData.objectType === ObjectType.PMI || child.userData.objectType === ObjectType.Hotspot) {
							return;
						}
						assignMaterial(materialRef, child, recursive);
					});
				}
			}

			if (!assignToRestOfSceneTree) {
				for (var i = 0; i < nodeRefs.length; i++) {
					assignMaterial(materialRef, nodeRefs[ i ], true);
				}
			} else {
				for (var j = 0; j < nodeRefs.length; j++) {
					nodeRefs[ j ].userData.markedForNotAssigningMaterial = true;
				}
				var context = that._loader.getContext(sceneId);
				var scene = context.root;
				assignMaterial(materialRef, scene, true);
			}

			that.fireSceneUpdated({});

			return true;
		}).catch(function(error) {
				jQuery.sap.log.error(error);
				return false;
		});
	};

	ContentDeliveryService.prototype.printLogTokens = function() {
		if (this._loader) {
			this._loader.printLogTokens();
			return true;
		} else {
			return false;
		}
	};

	return ContentDeliveryService;
});
