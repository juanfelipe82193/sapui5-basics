sap.ui.define([
	"sap/base/Log",
	"./CallbackHandler",
	"./TotaraUtils",
	"./GeometryFactory",
	"./ProgressCounter",
	"./RequestQueue",
	"../getResourceBundle",
	"../AnimationRotateType"
], function(
	Log,
	CallbackHandler,
	TotaraUtils,
	GeometryFactory,
	ProgressCounter,
	RequestQueue,
	getResourceBundle,
	AnimationRotateType
) {
	"use strict";

	/**
	 * A class with public properties containing helper structures for a single 3D scene loaded from a storage service.
	 *
	 * Instances of this class are owned by an instance of the SceneState class.
	 *
	 * All properties are public without getters/setters.
	 *
	 * @param {string} sceneId The loading scene identifier
	 * @param {any}    params  The ContentDeliveryService loading context parameters
	 * @param {object} loader  The TotaraLoader object
	 *
	 * @private
	 */
	var SceneContext = function(sceneId, params, loader) {

		this.root = null;

		// event related
		this.onActiveCameraCallbacks = new CallbackHandler();
		this.onInitialSceneFinishedCallbacks = new CallbackHandler();
		this.onPartialRetrievalFinishedCallbacks = new CallbackHandler();
		this.onSceneCompletedCallbacks = new CallbackHandler();
		this.onSetPlaybackCallbacks = new CallbackHandler();
		this.onViewFinishedCallbacks = new CallbackHandler();
		this.onViewPartialRetrievalFinishedCallbacks = new CallbackHandler();
		this.onViewGroupFinishedCallbacks = new CallbackHandler();
		this.onContentChangesProgressCallbacks = new CallbackHandler();

		Object.assign(this, params);

		this.sceneId = sceneId;
		this.loader = loader;
		this.sceneBuilder = loader.sceneBuilder;
		this.requestQueue = new RequestQueue(this, sceneId);

		// mesh update related
		// first mesh(bounding box)
		// then geometry (blob)
		this.phase = SceneContext.Phase.Started;
		this.retrievalType = SceneContext.RetrievalType.Initial;
		this.rootNodeId = null;

		this.meshNodes = new Map(); // mesh id -> [ node id ]
		this.annotationNodeMap = new Map(); // annotation id -> node id
		this.leaderLineMaterialIdMap = new Map(); // materialId -> [ leaderLine ]
		this.imageNoteMaterialIdMap = new Map();  // materailId -> [ annotation ]

		this.thumbnailViewMap = new Map(); // imageId -> viewId
		this.viewThumbnailMap = new Map(); // viewId  -> imageId
		this.viewAnimatedThumbnailMap = new Map(); // viewId  -> imageId

		// when geomtries are loaded these temporary bounding box
		// will be replaced with real geometry

		this.progressCount = new ProgressCounter();

		this.treeNodes = []; // for tree

		this.viewIdTreeNodesMap = new Map();

		this.nodeSidsForPartialTree = new Set();

		this.replacedNodes = new Map();    // existing nodes that are replaced - removed first, then reloaded

		this.updatedNodes = new Set();    // existing nodes that are updated (material, opacity)

		this.authorizationHandler = null;

		this.currentViewId = null;

		this.initialViewId = null;

		this.initialViewDecided = false;

		this.eventObject = {};
		this.eventObject.percentage = 0;
		this.loadingGeometry = 0;
	};

	SceneContext.Phase = {
		Started: 0,
		FinishedHierarchy: 1,
		FinishedMesh: 2,
		FinishedGeometry: 3
	};

	SceneContext.RetrievalType = {
		Initial: 0, // Full retrieval when the model is loaded
		Partial: 1  // Partial retrieval for updates
	};

	SceneContext.ProgressPhase = {
		FinishedTree: getResourceBundle().getText("SCENE_CONTEXT_FINISHED_TREE"),
		FinishedMeshes: getResourceBundle().getText("SCENE_CONTEXT_FINISHED_MESHES"),
		FinishedMaterials: getResourceBundle().getText("SCENE_CONTEXT_FINISHED_MATERIALS"),
		FinishedGeomMeshes: getResourceBundle().getText("SCENE_CONTEXT_FINISHED_GEOMETRIES"),
		LoadingGeomMeshes: getResourceBundle().getText("SCENE_CONTEXT_LOADING_GEOMETRIES"),
		FinishedTextures: getResourceBundle().getText("SCENE_CONTEXT_FINISHED_TEXTURES")
	};

	SceneContext.prototype.setOnProgressChanged = function(callback) {
		this.progressCount.setOnProgressChanged(callback);
	};

	SceneContext.prototype.isLoadingFinished = function() {
		if (!this.requestQueue.isEmpty() || this.requestQueue.isWaitingForContent() ||
			this.thumbnailViewMap.size > 0 || this.viewThumbnailMap.size > 0 || this.viewAnimatedThumbnailMap.size > 0 ||
			this.meshNodes.size > 0 || this.annotationNodeMap.size > 0 ||
			this.leaderLineMaterialIdMap.size > 0 || this.imageNoteMaterialIdMap.size > 0 ||
			this.viewIdTreeNodesMap.size > 0 || this.nodeSidsForPartialTree.size > 0) {
			return false;
		}

		// console.log("!!! SceneContext loading finished", this);
		return true;
	};

	// check if the scene is completed
	// meaning we have updated all meshes, textures, geometries.
	// This function should be called after scene tree is built
	SceneContext.prototype.isSceneCompleted = function() {
		return !this.requestQueue.meshes.isWaiting() &&
			!this.requestQueue.annotations.isWaiting() &&
			!this.requestQueue.materials.isWaiting() &&
			!this.requestQueue.geomMeshes.isWaiting() &&
			!this.requestQueue.geometries.isWaiting() &&
			!this.requestQueue.textures.isWaiting();
	};

	SceneContext.prototype._checkSceneCompletion = function() {
		if (this.isSceneCompleted()) {
			if (this.eventObject.percentage < 100){
				this.eventObject.percentage = 100;
				this.onContentChangesProgressCallbacks.execute(this.eventObject);
			}

			this.onSceneCompletedCallbacks.execute();

			Log.info("Scene completed.");
			TotaraUtils.mark("sceneCompleted");
			this.logPerformance("sceneCompleted");
		}
	};

	SceneContext.prototype._fireProgress = function(Phase) {
		switch (Phase) {
			case SceneContext.ProgressPhase.FinishedTree:
				this.eventObject.percentage += 10;
				this.eventObject.phase = SceneContext.ProgressPhase.FinishedTree;
				this.onContentChangesProgressCallbacks.execute(this.eventObject);
				break;
			case SceneContext.ProgressPhase.FinishedMeshes:
				if (!this.requestQueue.meshes.isWaiting()){
					this.eventObject.percentage += 10;
					this.eventObject.phase = SceneContext.ProgressPhase.FinishedMeshes;
					this.onContentChangesProgressCallbacks.execute(this.eventObject);
				}
				break;
			case SceneContext.ProgressPhase.FinishedMaterials:
				if (!this.requestQueue.materials.isWaiting()){
					this.eventObject.percentage += 10;
					this.eventObject.phase = SceneContext.ProgressPhase.FinishedMaterials;
					this.onContentChangesProgressCallbacks.execute(this.eventObject);
				}
				break;
			case SceneContext.ProgressPhase.LoadingGeomMeshes:
				this.eventObject.percentage += 61 * (1 / this.requestQueue.geomMeshes.globalList.size); // Due to using Math.floor in vk Viewer progress would sometime get stuck at 99%, so we use cap geometry at 61% instead of 60% to avoid this
				if (this.eventObject.percentage > 100){ // Occasionally geometry will cause progress to go above 100%, so if it does we set it back to 100%
					this.eventObject.percentage = 100;
				}
				this.loadingGeometry += 61 * (1 / this.requestQueue.geomMeshes.globalList.size);
				if (this.loadingGeometry >= 60){
					this.eventObject.phase = SceneContext.ProgressPhase.FinishedGeomMeshes;
				} else {
					this.eventObject.phase = SceneContext.ProgressPhase.LoadingGeomMeshes;
				}
				this.onContentChangesProgressCallbacks.execute(this.eventObject);
				break;
			case SceneContext.ProgressPhase.FinishedTextures:
				if (!this.requestQueue.textures.isWaiting()){
					this.eventObject.percentage += 10;
					this.eventObject.phase = SceneContext.ProgressPhase.FinishedTextures;
					this.onContentChangesProgressCallbacks.execute(this.eventObject);
				}
				break;
			default:
		}
	};

	SceneContext.prototype.dispose = function() {
		this.sceneId = null;

		this.progressCount = null;

		this.requestQueue = null;
		this.suppressedBoundingBoxListMap = null;

		this.treeNodes = null;

		this.nodeSidsForPartialTree = null;

		this.meshNodes = null;
		this.annotationNodeMap = null;
		this.leaderLineMaterialIdMap = null;
		this.imageNoteMaterialIdMap = null;

		this.thumbnailViewMap = null;
		this.viewThumbnailMap = null;
		this.viewAnimatedThumbnailMap = null;

		this.replacedNodes = null;

		this.updatedNodes = null;

		this.viewIdTreeNodesMap = null;

		this.onActiveCameraCallbacks = null;
		this.onInitialSceneFinishedCallbacks = null;
		this.onPartialRetrievalFinishedCallbacks = null;
		this.onViewPartialRetrievalFinishedCallbacks = null;
		this.onSceneCompletedCallbacks = null;
		this.onViewFinishedCallbacks = null;
		this.onSetPlaybackCallbacks = null;
		this.onContentChangesProgressCallbacks = null;
	};

	SceneContext.prototype.logPerformance = function(name) {
		if (this.progressLogger && this.token) {
			this.progressLogger.logPerformance(name, this.token);
		}
	};

	SceneContext.prototype.setCameraSingle = function(cameraInfo) {
		cameraInfo.near = cameraInfo.near || 1;
		cameraInfo.far = cameraInfo.far || 200000;
		cameraInfo.zoom = cameraInfo.zoom || 0.02;

		this.sceneBuilder.createCamera(cameraInfo, this.sceneId);
		return this.sceneBuilder.getCamera(cameraInfo.id);
	};

	SceneContext.prototype.getPartialTreeNodes = function(treeNodes) {
		var partialTreeRoots = [];
		var partialTreeNodes = [];

		var i, j, treeNode;
		if (treeNodes && treeNodes.length) {
			for (i = 0; i < treeNodes.length; i++) {
				treeNode = treeNodes[ i ];
				if (treeNode == null) {
					continue;
				}

				if (treeNode && treeNode.children) {
					if (treeNode.entityId != null && treeNode.children.length === 1) {
						// Skip single entity root element, this one should not be displayed in the tree
						var rootElementNodeIndex = treeNode.children[ 0 ];
						var rootElementNode = treeNodes[ rootElementNodeIndex ];
						// Make sure child node is an element, not an entity
						if (rootElementNode.entityId == null) {
							rootElementNode.name = treeNode.name;
							treeNode.visualisable = false; // This node shall not be dislayed in scene tree
						}
					}

					if (treeNode.children) {
						for (j = 0; j < treeNode.children.length; j++) {
							var childIndex = treeNode.children[ j ];
							treeNodes[ childIndex ].parentNode = treeNode;
							if (treeNode.renderOrder) {
								treeNodes[ childIndex ].renderOrder = treeNode.renderOrder;
							}
						}
					}
				}
			}
		}

		if (treeNodes && treeNodes.length) {
			for (i = 0; i < treeNodes.length; i++) {
				treeNode = treeNodes[ i ];
				if (treeNode == null) {
					continue;
				}
				if (treeNode.parent) {   // specified root node and nodes without parent
					partialTreeRoots.push(treeNode);
				} else if (!treeNode.parentNode) {
					partialTreeRoots.push(treeNode);
					if (this.rootNodeId) {
						treeNode.parent = this.rootNodeId;
					}
				}

				if (this.nodeSidsForPartialTree.has(treeNode.sid)) {
					partialTreeNodes.push(treeNode);
				}
			}
		}

		this.nodeSidsForPartialTree.clear();

		if (!partialTreeNodes.length) { // full tree retrieval
			return partialTreeRoots;
		}

		partialTreeRoots = [];
		for (j = 0; j < partialTreeNodes.length; j++) {
			var node = partialTreeNodes[ j ];
			var parentNode = node.parentNode;
			while (parentNode) {
				if (this.sceneBuilder.getNode(parentNode.sid, this.sceneId)) {
					node.parent = parentNode.sid;
					partialTreeRoots.push(node);
					break;
				} else {
					node = parentNode;
					parentNode = parentNode.parentNode;
				}
			}
		}

		return partialTreeRoots.length ? partialTreeRoots : partialTreeNodes;
	};

	SceneContext.prototype.buildTree = function() {
		var result = {};

		if (!this.treeNodes || !this.treeNodes.length) {
			result.error = "no tree information";
			return result;
		}

		var treeNodes = this.treeNodes;
		var partialTreeRoots = this.getPartialTreeNodes(treeNodes);

		this.replacedNodes.clear();

		var retryList = []; // depending on the treeNode order, some of the parent(sid) might not have been created yet. so we keep them and try again.
		// if we have any partial trees, we assume this is partial tree update
		var i;
		var parentSid;
		for (i = 0; i < partialTreeRoots.length; i++) {

			parentSid = partialTreeRoots[ i ].parent;

			if (this.sceneBuilder.getNode(parentSid, this.sceneId)) {
				// TODO: add at a certain index when server provides the information
				this.buildNode(partialTreeRoots[ i ], parentSid);
			} else {
				retryList.push(partialTreeRoots[ i ]);
			}
		}

		for (i = 0; i < retryList.length; i++) {
			parentSid = retryList[ i ].parent;
			if (this.sceneBuilder.getNode(parentSid, this.sceneId)) {
				// TODO: add at a certain index when server provides the information
				this.buildNode(partialTreeRoots[ i ], parentSid);
			} else {
				result.error = (result.error || "") + "parent ${parentSid} does not exist in the scene. \n";
			}
		}

		// Reset tree nodes as indices of tree node only valid in one paylod
		// we don't need this list after tree is built.
		// sceneBuilder.resourcesCleanUp(state);
		this.treeNodes = [];

		this.progressCount.mesh.total = this.requestQueue.meshes.globalList.size;

		return result;
	};

	SceneContext.prototype.buildNode = function(tNode, parentId) {
		// console.log("buildNode", tNode, parentId)

		if (!tNode || !parentId) {
			this.loader.reportError(this, "SceneContext - buildNode - invalid args");
			return;
		}

		var existingTreeNode = this.sceneBuilder.getNode(tNode.sid, this.sceneId);

		// This TreeNode is about to be updated and existing one should be removed.
		if (existingTreeNode) {
			this.sceneBuilder.remove(tNode.sid, this.sceneId);
		}

		// TreeNode delete
		if (tNode.suppressed === true) {
			// this is already deleted node. we don't want to build tree for this.
			return;
		}

		if (!tNode.sid) {
			this.loader.reportError(this, "sid is missing in treeNode");
			return;
		}

		tNode.parentId = parentId;
		this.sceneBuilder.createNode(tNode, this.sceneId);

		if (tNode.meshId && !this.sceneBuilder.hasMesh(tNode.meshId)) {
			TotaraUtils.pushElementIntoMapArray(this.meshNodes, tNode.meshId, tNode.sid);
			this.requestQueue.meshes.push(tNode.meshId);
		}

		if (tNode.annotationId) {
			this.annotationNodeMap.set(tNode.annotationId, tNode.sid);
			this.requestQueue.annotations.push(tNode.annotationId);
		}

		var newTreeNode = this.sceneBuilder.getNode(tNode.sid, this.sceneId);

		if (existingTreeNode && newTreeNode) {
			this.replacedNodes.set(existingTreeNode, newTreeNode);
		}

		if (tNode.children) {

			var treeNodes = this.treeNodes;

			for (var i = 0; i < tNode.children.length; i++) {
				var nodeIndex = tNode.children[ i ];
				this.buildNode(treeNodes[ nodeIndex ], tNode.sid);
			}
		}
	};

	SceneContext.prototype.setTree = function(jsonContent) {
		// console.log("setTree", jsonContent);
		// setTree gives root node directly.
		if (jsonContent.sid) {
			var root = this.sceneBuilder.getNode(jsonContent.sid, this.sceneId);
			if (!root || root !== this.root) {
				var rootGroup = this.root;
				// make dummy tree node for root as server only gives sid
				rootGroup.userData.treeNode = {
					sid: jsonContent.sid,
					name: this.root.name ? this.root.name : "root"
				};
				rootGroup.userData.skipIt = !this.root.name; // If application didn't assign name to the root then ignore it in scene tree

				// console.log("setRootNode", rootGroup, jsonContent.sid, this.sceneId, this.vkScene);
				this.sceneBuilder.setRootNode(rootGroup, jsonContent.sid, this.sceneId, this.vkScene);
				this.rootNodeId = jsonContent.sid;
			}
		}

		if (jsonContent.camera) {
			// Don't use view camera as default scene camera for the viewport.
			// This way the view camera will not change when user interacts with the viewport
			jsonContent.camera.id = "initial";
			var camera = this.setCameraSingle(jsonContent.camera);
			if (camera) {
				this.onActiveCameraCallbacks.execute(camera);
			}
		}

		TotaraUtils.measure("setTreeMeasure-" + this.sceneId, "setTree-" + this.sceneId);
	};

	SceneContext.prototype.setTreeNode = function(jsonContent) {
		// console.log("setTreeNode", jsonContent);
		if (!Array.isArray(jsonContent.nodes)) {
			return { error: "setTreeNode error: nodes are not properly defined" };
		}

		this.treeNodes = this.treeNodes.concat(jsonContent.nodes);

		return {};
	};

	SceneContext.prototype.notifyFinishedTree = function(command) {
		// console.log("notifyFinishedTree", command);
		this.buildTree();

		this.phase = SceneContext.Phase.FinishedHierarchy;

		if (!this.loader._pushMesh) {
			if (!this.requestQueue.meshes.isWaiting()) {

				if (this.retrievalType === SceneContext.RetrievalType.Initial) {
					this.onInitialSceneFinishedCallbacks.execute(this.initialView);
				}

				// mesh request can be zero when we do partial tree update which is just delete
				if (this.retrievalType === SceneContext.RetrievalType.Partial) {
					this.onPartialRetrievalFinishedCallbacks.execute();
				}

				this.onViewPartialRetrievalFinishedCallbacks.execute();

				this._checkSceneCompletion();
			}
		}

		this._fireProgress(SceneContext.ProgressPhase.FinishedTree);

		return {};
	};

	SceneContext.prototype.setViewGroup = function(jsonContent) {
		this.sceneBuilder.insertViewGroup(jsonContent, this.sceneId);

		if (!Array.isArray(jsonContent.views)) {
			return;
		}

		var viewGroupId = jsonContent.id;
		var i, view;
		if (!this.currentViewGroupId) {
			if (this.currentViewId) {
				for (i = 0; i < jsonContent.views.length; i++) {
					view = jsonContent.views[ i ];
					if (view.id === this.currentViewId) {
						this.currentViewGroupId = viewGroupId;
						break;
					}
				}
			} else {
				this.currentViewGroupId = viewGroupId;
			}
		}

		if (this.currentViewGroupId !== viewGroupId) {
			return;
		}

		if (!this.currentViewId) {
			this.currentViewId = jsonContent.views[ 0 ].id;
		}

		for (i = 0; i < jsonContent.views.length; i++) {
			view = jsonContent.views[ i ];
			var existingView = this.sceneBuilder.getView(view.id, this.sceneId);

			for (var ti = 0; ti < 2; ti++) {
				var param = [ "thumbnailId", "animatedThumbnailId" ][ ti ];
				var thumbnailId = view[param];
				if (thumbnailId !== undefined) {
					view[param] = thumbnailId = thumbnailId.toString();

					if (this.sceneBuilder.hasImage(thumbnailId)) {
						this.sceneBuilder.setViewThumbnail(thumbnailId, view.id, this.sceneId);
						this.loader.onViewGroupUpdatedCallbacks.execute();
					} else {
						this.thumbnailViewMap.set(thumbnailId, view.id);
						this.requestQueue.thumbnails.push(thumbnailId, { imageId: thumbnailId, viewId: view.id });
					}

					if (!existingView) {
						this[ [ "viewThumbnailMap", "viewAnimatedThumbnailMap" ][ ti ] ].set(view.id, thumbnailId);
					}
				}
			}

			if (existingView) {
				existingView.userData.viewInfo.thumbnailId = view.thumbnailId;
				existingView.userData.viewInfo.animatedThumbnailId = view.animatedThumbnailId;
				continue;
			}

			this.requestQueue.views.push(view.id, { viewId: view.id, viewGroupId: viewGroupId });
		}

		if (!this.requestQueue.views.isWaiting()) {
			this.sceneBuilder.finalizeViewGroups(this.sceneId);
			this.loader.onViewGroupUpdatedCallbacks.execute();
			if (this.requestQueue.sequences.isEmpty()) {
				this.onViewGroupFinishedCallbacks.execute();
			}
		}

		TotaraUtils.measure("setViewGroupMeasure-" + viewGroupId, "setViewGroup-" + viewGroupId);
	};

	SceneContext.prototype.setView = function(jsonContent) {
		// console.log("setViewNode", command);

		var viewId = jsonContent.viewId;
		if (!viewId) {
			this.setTree(jsonContent);
			this.initialViewDecided = true;
			return;
		}

		if (!this.initialViewId && !this.initialViewDecided) {
			this.initialViewId = viewId;
			this.currentViewId = viewId;
			this.initialViewDecided = true;
		}

		var cameraId;
		if (this.initialViewId === viewId) {
			if (jsonContent.camera) {
				cameraId = jsonContent.camera.id; // will be changed in setTree function, so to remember
			}
			this.setTree(jsonContent);
		}

		var thumbnailId = this.viewThumbnailMap.get(viewId);
		if (thumbnailId) {
			this.viewThumbnailMap.delete(viewId);
			jsonContent.thumbnailId = thumbnailId;
		}

		var animatedThumbnailId = this.viewAnimatedThumbnailMap.get(viewId);
		if (animatedThumbnailId) {
			this.viewAnimatedThumbnailMap.delete(viewId);
			jsonContent.animatedThumbnailId = animatedThumbnailId;
		}

		this.sceneBuilder.insertView(jsonContent, this.sceneId);

		var viewNodes = [];
		this.viewIdTreeNodesMap.set(viewId, viewNodes);

		if (jsonContent.camera) {
			if (cameraId) {
				jsonContent.camera.id = cameraId;
			}
			this.setCameraSingle(jsonContent.camera);
			this.sceneBuilder.setViewCamera(jsonContent.camera.id, viewId, this.sceneId);
		}

		this.logPerformance("setView");
		TotaraUtils.measure("setViewMeasure-" + viewId, "setView-" + viewId);
	};

	// View data is actually the same as tree data.
	// however, we process them slightly differently.
	// for existing tree node, we need to update it's properties (e.g) transform, visibility
	// for new tree node, we need to add
	// for missing tree node, we need to hide (or drop). Currently we are only hiding.
	// this is because the actual action is happening async as ActivateView.
	// and it does transition effect. we need them to be alive until activate view is finished.
	SceneContext.prototype.setViewNode = function(command) {
		// console.log("setViewNode", command);
		var result = { context: this };

		if (!command.viewId) {
			this.setTreeNode(command);
			return result;
		}

		if (this.initialViewId === command.viewId) {
			this.setTreeNode(command);
		}

		var view = this.sceneBuilder.getView(command.viewId, command.sceneId);
		if (!view) {
			result.error = "setViewNode error: setViewNode - no setView was in the chain";
			return result;
		}

		if (this.initialViewId === command.viewId) {
			this.initialView = view;
		}

		var treeNodes = this.viewIdTreeNodesMap.get(command.viewId);
		treeNodes = treeNodes.concat(command.nodes);
		this.viewIdTreeNodesMap.set(command.viewId, treeNodes);

		return result;
	};

	SceneContext.prototype.notifyFinishedView = function(jsonContent) {
		var viewId = jsonContent.viewId;
		if (!viewId) {
			return this.notifyFinishedTree(jsonContent);
		}

		this.requestQueue.views.pop(viewId);

		if (this.initialViewId === viewId) {
			this.notifyFinishedTree(jsonContent);
			this.initialViewId = null;  // make sure TreeHandler functions are only called for initial loading
		}

		var view = this.sceneBuilder.getView(viewId, this.sceneId);
		if (!view) {
			return { error: "notifyFinishedView error: setViewNode - no setView was in the chain" };
		}

		// add three js camera if camera id is there
		// note cameraId can be zero, which is a generated camera which is not stored in service side
		if (view.activeCameraId !== undefined) {
			view.setCamera(this.sceneBuilder.getCamera(view.activeCameraId));
		}

		this.updatedNodes.clear();

		var viewResult = this.buildView(viewId);
		this.sceneBuilder.setViewNodeInfos(viewResult.nodeInfos, viewId, this.sceneId);

		// this view does not require any mesh request
		// meaning we can handle the view without any request
		// let't declare view is finished
		view.updatedNodes = Array.from(this.updatedNodes);

		if (!this.requestQueue.views.isWaiting()) {
			this.sceneBuilder.finalizeViewGroups(this.sceneId);
			this.loader.onViewGroupUpdatedCallbacks.execute();
			if (this.requestQueue.sequences.isEmpty()) {
				this.onViewGroupFinishedCallbacks.execute();
			}
		}

		if (!this.requestQueue.meshes.isWaiting()) {
			this.onViewFinishedCallbacks.execute(view);
		} else {
			// seems like we need to get more stuff as some items in the view
			// are not here atm.
			// context.retrievalType = SceneContext.RetrievalType.Partial; // need to get some more items

			var callback = function() {
				setTimeout(function() { this.onViewPartialRetrievalFinishedCallbacks.detach(callback); }.bind(this), 0); // setTimeout is used because the callback detaching brakes the callbacks execution cycle
				this.onViewFinishedCallbacks.execute(view); // now the view is finished
			}.bind(this);
			this.onViewPartialRetrievalFinishedCallbacks.attach(callback);

			this.logPerformance("notifyFinishedView");
		}
	};

	SceneContext.prototype.buildView = function(viewId) {
		var result = {};

		this.treeNodes = this.viewIdTreeNodesMap.get(viewId);
		if (!this.treeNodes || !this.treeNodes.length) {
			result.error = "no tree information in view";
			return result;
		}

		var partialTreeRoots = this.getPartialTreeNodes(this.treeNodes);

		var nodeInfos = []; // nodeInfo { sid, transform(optional), visibility(optional) }
		// if we have any partial trees, we assume this is partial tree update
		for (var i = 0; i < partialTreeRoots.length; i++) {

			var parentSid = partialTreeRoots[ i ].parent;

			this.processNode(viewId, partialTreeRoots[ i ], nodeInfos, parentSid);
		}

		result.nodeInfos = nodeInfos;
		// Reset tree nodes as indices of tree node only valid in one paylod
		// we don't need this list after tree is built.
		// resourcesCleanUp(state); // we currently cannot delete node for view.. so no need to clean up? // TODO: findout how to clean up
		this.treeNodes = [];
		this.viewIdTreeNodesMap.delete(viewId);
		return result;
	};

	// check tree
	// if tree node already exist, we build item list for view which will be passed as info for activate view later
	// if tree node does not exist, we need to retrieve them. we consider view is finished when we retrieve all boundingbox meshes
	SceneContext.prototype.buildViewNode = function(viewId, tNode, nodeInfos) {

		if (!tNode) {
			this.loader.reportError(this, "ViewBuilder - buildViewNode - invalid args");
			return;
		}

		// now this is the parent
		var treeNode = this.sceneBuilder.getNode(tNode.sid, this.sceneId);

		if (tNode.materialId) {
			if (!this.sceneBuilder.checkMaterialExists(tNode.materialId)) {
				this.requestQueue.materials.push(tNode.materialId);
			}
		}

		// push node info
		var nodeInfo = {
			target: treeNode,
			visible: tNode.visible !== undefined ? tNode.visible : true,
			materialId: tNode.materialId,
			opacity: tNode.opacity,
			meshId: tNode.meshId,
			transform: Array.isArray(tNode.transform) ? TotaraUtils.arrayToColumnMajorMatrixArray16(tNode.transform) :
				[ 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0 ]
		};

		nodeInfos.push(nodeInfo);

		var treeNodes = this.treeNodes;
		var existingChildrenSids = this.sceneBuilder.getChildNodeIds(tNode.sid, this.sceneId);
		var incomingChildrenSids = tNode.children ? tNode.children.map(function(index) { return treeNodes[index].sid; }) : [];

		var currentSid;
		var i;
		for (i = 0; i < existingChildrenSids.length; i++) {
			currentSid = existingChildrenSids[ i ];

			for (var j = 0; j < incomingChildrenSids.length; j++) {
				if (currentSid === incomingChildrenSids[ j ]) {
					existingChildrenSids[ i ] = undefined; // we have this sid in new tree as well.. remove it from the list
					break;
				}
			}
		}

		// now existingChildrentSids only contains sids which should be hidden from the new view.
		for (i = 0; i < existingChildrenSids.length; i++) {
			var childSid = existingChildrenSids[ i ];
			if (childSid !== undefined){
				var childNode = this.sceneBuilder.getNode(childSid, this.sceneId);
				var childVisibility = false;
				nodeInfos.push({
					target: childNode,
					visible: childVisibility
				});
			}
		}

		// check other children
		if (tNode.children) {
			for (i = 0; i < tNode.children.length; i++) {

				var nodeIndex = tNode.children[ i ];
				var childTreeNode = this.treeNodes[ nodeIndex ];

				this.processNode(viewId, childTreeNode, nodeInfos, tNode.sid);
			}
		}
	};

	// check if this sid already exist.
	// for now, just check if it is in the map.
	// as we don't restructure tree, checking if exist in the map is good enough
	// if we restrucutre trees, we need to search in the children of existing threejs tree
	SceneContext.prototype.processNode = function(viewId, tNode, nodeInfos, parentSid) {

		var treeNode = this.sceneBuilder.getNode(tNode.sid, this.sceneId);

		if (treeNode) {
			// has tree node already
			this.buildViewNode(viewId, tNode, nodeInfos);
		} else {

			this.buildNode(tNode, parentSid);
			// newly built node should be hidden until we activate the view
			var newlyCreatedNode = this.sceneBuilder.getNode(tNode.sid, this.sceneId);
			if (newlyCreatedNode) { // must exist but just in case...
				newlyCreatedNode.visible = false;

				// but this should be set to correct visiblity when view activated
				nodeInfos.push({
					target: newlyCreatedNode,
					visible: tNode.visible === undefined ? true : tNode.visible
				});
			}
		}

		if (tNode.highlightStyleId) {
			this.sceneBuilder.recordHighlightedNodeInView(tNode.highlightStyleId, tNode.sid, viewId, this.sceneId);
			if (!this.sceneBuilder.highlightStyleExists(tNode.highlightStyleId)) {
				this.requestQueue.highlights.push(tNode.highlightStyleId);
			}
		}
	};

	SceneContext.prototype.setAnnotationSingle = function(annotation) {
		var nodeId = this.annotationNodeMap.get(annotation.id);
		if (nodeId) {
			annotation.nodeId = nodeId;
			if (annotation.detailView || annotation.cutaway) { // detail view
				this.sceneBuilder.createDetailView(annotation, this.sceneId);
			} else if (annotation.labelMaterialId) { // image note
				if (this.sceneBuilder.checkMaterialExists(annotation.labelMaterialId)) {
					this.sceneBuilder.createImageNote(annotation, this.sceneId);
				} else {
					this.requestQueue.materials.push(annotation.labelMaterialId);
					TotaraUtils.pushElementIntoMapArray(this.imageNoteMaterialIdMap, annotation.labelMaterialId, annotation);
				}
			} else { // callout or text note
				this.sceneBuilder.createAnnotation(annotation, this.sceneId);

				var leaderLines = annotation.leaderLines;
				if (leaderLines) {
					for (var i = 0, l = leaderLines.length; i < l; i++) {
						var leaderLine = leaderLines[ i ];
						leaderLine.annotationId = annotation.id;
						if (this.sceneBuilder.checkMaterialExists(leaderLine.materialId)) {
							this.sceneBuilder.insertLeaderLine(leaderLine, this.sceneId);
						} else {
							this.requestQueue.materials.push(leaderLine.materialId);
							TotaraUtils.pushElementIntoMapArray(this.leaderLineMaterialIdMap, leaderLine.materialId, leaderLine);
						}
					}
				}
			}

			this.annotationNodeMap.delete(annotation.id);
			this.requestQueue.annotations.pop(annotation.id);
		}
	};

	SceneContext.prototype.setCamera = function(jsonContent) {
		if (!Array.isArray(jsonContent.cameras)) {
			return { error: "setCamera error: cameras are not properly defined" };
		}

		jsonContent.cameras.forEach(this.setCameraSingle.bind(this));
	};

	SceneContext.prototype.setMeshSingle = function(mesh) {
		var meshId = mesh.id;
		if (this.requestQueue.meshes.pop(meshId)) {
			var bbox = new THREE.Box3();

			if (Array.isArray(mesh.submeshes)) {
				var point = new THREE.Vector3();
				for (var i = 0; i < mesh.submeshes.length; i++) {
					var submesh = mesh.submeshes[ i ];
					submesh.meshId = meshId;

					if (!this.sceneBuilder.checkMaterialExists(submesh.materialId)) {
						this.requestQueue.materials.push(submesh.materialId);
					}

					this.sceneBuilder.insertSubmesh(submesh);

					var lods = submesh.lods;
					if (Array.isArray(lods)) {
						for (var li = 0; li < lods.length; li++) {
							var boundingBox = lods[ li ].boundingBox;
							if (Array.isArray(boundingBox) && boundingBox.length === 6) {
								bbox.min.min(point.fromArray(boundingBox));
								bbox.max.max(point.fromArray(boundingBox, 3));
							}
						}

						// var lod = null;
						// for (var li = 0; li < lods.length; li++) {
						// 	if (lods[ li ].type === undefined || lods[ li ].type === "mesh" || lods[ li ].type === "line") {
						// 		lod = lods[ li ];
						// 	}
						// }

						// if (lod && lod.id) {
						// 	var priority = 0;
						// 	var boundingBox = lod.boundingBox;
						// 	if (Array.isArray(boundingBox) && boundingBox.length === 6) {
						// 		bbox.min.min(point.fromArray(boundingBox));
						// 		bbox.max.max(point.fromArray(boundingBox, 3));
						// 		priority = new THREE.Vector3(boundingBox[ 3 ] - boundingBox[ 0 ], boundingBox[ 4 ] - boundingBox[ 1 ], boundingBox[ 5 ] - boundingBox[ 2 ]).length();
						// 	}

						// 	this.requestQueue.geometries.push(lod.id, priority);
						// }
					}
				}
			}

			var size = new THREE.Vector3();
			bbox.getSize(size);

			var totalScale = 0;
			var meshNodes = this.meshNodes.get(meshId);
			if (meshNodes) {
				this.meshNodes.delete(meshId);
				meshNodes.forEach(function(sid) {
					var treeNode = this.sceneBuilder.getNode(sid, this.sceneId);
					totalScale += treeNode ? treeNode.matrixWorld.getMaxScaleOnAxis() : 1;
				}.bind(this));
			}

			this.requestQueue.geomMeshes.push(meshId, (size.x * size.y + size.y * size.z + size.z * size.x) * totalScale, mesh.geometrySize || 0);

			this.progressCount.mesh.count++;

			if (!this.requestQueue.meshes.isWaiting()) {
				// all meshes were updated for this model
				this.phase = SceneContext.Phase.FinishedMesh;
				this.logPerformance("meshFinished");

				if (this.retrievalType === SceneContext.RetrievalType.Initial) {
					this.onInitialSceneFinishedCallbacks.execute(this.initialView);
				} else if (this.retrievalType === SceneContext.RetrievalType.Partial) {
					this.onPartialRetrievalFinishedCallbacks.execute();
				}

				this.onViewPartialRetrievalFinishedCallbacks.execute();

				this.progressCount.geometry.total = this.requestQueue.geometries.globalList.size;

				this._fireProgress(SceneContext.ProgressPhase.FinishedMeshes);
			}
		} else {// the mesh was requested a 2nd time for geometry data
			this.requestQueue.geomMeshes.pop(meshId.toString());
			this._fireProgress(SceneContext.ProgressPhase.LoadingGeomMeshes);
		}
	};

	SceneContext.prototype.setMesh = function(jsonContent, binaryData) {
		if (!Array.isArray(jsonContent.meshes)) {
			return { error: "setMesh error: meshes are not properly defined" };
		}

		if (binaryData) { // set meshes geometries
			var dataView = new DataView(binaryData.buffer);
			// var version = dataView.getUint16(0, true);
			var bufferCount = dataView.getUint16(2, true), offset = 0;
			while (bufferCount-- > 0 && offset < binaryData.byteLength) {
				var geomInfo = {
					sceneId: this.sceneId,
					id: dataView.getUint32(offset + 4, true).toString(),
					box: [
						dataView.getFloat32(offset + 14, true),
						dataView.getFloat32(offset + 18, true),
						dataView.getFloat32(offset + 22, true),
						dataView.getFloat32(offset + 26, true),
						dataView.getFloat32(offset + 30, true),
						dataView.getFloat32(offset + 34, true)
					]
				};

				var geometryType = dataView.getUint16(offset + 12, true);
				offset += 38;

				if (geometryType !== 3) { // for geometry which is not of type 3 (box)
					geomInfo.flags = dataView.getUint16(offset, true);
					// geomInfo.uvChannelCount = dataView.getUint16(offset + 2, true);
					geomInfo.quality = dataView.getFloat32(offset + 4, true);
					geomInfo.pointCount = dataView.getUint16(offset + 8, true);
					geomInfo.elementCount = dataView.getUint16(offset + 10, true);
					// geomInfo.type = dataView.getUint16(offset + 12, true);
					offset += 14;
				}

				var bufferLength = dataView.getUint32(offset, true);
				var buffer = binaryData.subarray(offset + 4, offset + 4 + bufferLength);
				offset += bufferLength;

				this.setGeometry(geomInfo, buffer);
			}
		}

		jsonContent.meshes.forEach(this.setMeshSingle.bind(this));

		TotaraUtils.measure("setMeshMeasure-" + this.sceneId, "setMesh-" + this.sceneId);

		this._checkSceneCompletion();
	};

	SceneContext.prototype.setMaterialSingle = function(material) {
		var materialId = material.id;
		this.requestQueue.materials.pop(materialId);

		var i;
		var texturesToLoad = this.sceneBuilder.createMaterial(material);
		for (i = 0; i < texturesToLoad.length; i++) {
			var imageId = texturesToLoad[ i ].imageId;
			this.requestQueue.textures.push(imageId, { imageId: imageId, materialId: materialId });
		}

		var leaderLines = this.leaderLineMaterialIdMap.get(materialId);
		if (leaderLines) {
			this.leaderLineMaterialIdMap.delete(materialId);
			for (i = 0; i < leaderLines.length; i++) {
				this.sceneBuilder.insertLeaderLine(leaderLines[i], this.sceneId);
			}
		}

		var imageNotes = this.imageNoteMaterialIdMap.get(materialId);
		if (imageNotes) {
			this.imageNoteMaterialIdMap.delete(materialId);
			for (i = 0; i < imageNotes.length; i++) {
				this.sceneBuilder.createImageNote(imageNotes[i], this.sceneId);
			}
		}

		this.loader.onMaterialFinishedCallbacks.execute(materialId);
	};

	SceneContext.prototype.setMaterial = function(jsonContent) {
		if (!Array.isArray(jsonContent.materials)) {
			return { error: "setMaterial error: materials are not properly defined" };
		}

		jsonContent.materials.forEach(this.setMaterialSingle.bind(this));

		TotaraUtils.measure("setMaterialMeasure-" + this.sceneId, "setMaterial-" + this.sceneId);

		this._fireProgress(SceneContext.ProgressPhase.FinishedMaterials);
		this._checkSceneCompletion();

	};

	SceneContext.prototype.setGeometry = function(jsonContent, binaryContent) {
		var geometryId = jsonContent.id;
		this.requestQueue.geometries.pop(geometryId);

		if (jsonContent.data && !binaryContent) {
			binaryContent = TotaraUtils.base64ToUint8Array(jsonContent.data);
		}

		if (!binaryContent || binaryContent.length === 0) {
			return { error: "setGeometry error: no data for geometry " + geometryId };
		}

		var geometryInfo = GeometryFactory.getGeometryInfo(jsonContent, binaryContent);
		if (!geometryInfo) {
			return { error: "setGeometry error: failed to parse geometry " + geometryId + " data" };
		}
		this.sceneBuilder.setGeometry(geometryInfo);

		// if (jsonContent && jsonContent.flags) {
		// 	var bHasNormals = (jsonContent.flags & 2) > 0;
		// 	if (!bHasNormals) { // PMI
		// 		var materialId = this.geometryIdMaterialIdMap.get(geometryId);
		// 		if (materialId) {
		// 			this.sceneBuilder.updateMaterialForGeometryWithoutNormal(materialId);
		// 		}
		// 	}
		// }

		this.loader.onSetGeometryCallbacks.execute({ id: geometryId });

		// upgrade boundings with actual geometry
		if (!this.requestQueue.geometries.isWaiting()) {
			this.phase = SceneContext.Phase.FinishedGeometry;
			this.logPerformance("geometryFinished");
		}

		this.progressCount.geometry.count++;
		TotaraUtils.measure("setGeometryMeasure-" + geometryId, "setGeometry-" + geometryId);

		this._checkSceneCompletion();
	};

	SceneContext.prototype.setImage = function(jsonContent, binaryContent) {
		var imageId = jsonContent.id;

		if (!binaryContent) {
			return { error: "setImage error: no image content for " + imageId };
		}

		jsonContent.binaryData =  binaryContent;
		this.sceneBuilder.createImage(jsonContent);

		if (this.requestQueue.textures.pop(imageId)) {
			this.loader.onImageFinishedCallbacks.execute({ id: imageId });

			this._fireProgress(SceneContext.ProgressPhase.FinishedTextures);
			this._checkSceneCompletion();
		} else if (this.requestQueue.thumbnails.pop(imageId)) {
			var tileWidth = jsonContent.tileWidth;
			if (tileWidth) {
				this.sceneBuilder._imageIdsAndTileWidths.set(imageId, tileWidth);
			}

			var viewId = this.thumbnailViewMap.get(imageId);
			if (viewId) {
				this.thumbnailViewMap.delete(imageId);
				this.sceneBuilder.setViewThumbnail(imageId, viewId, this.sceneId, tileWidth);
				this.loader.onViewGroupUpdatedCallbacks.execute();
			}
		}

		TotaraUtils.measure("setImageMeasure-" + imageId, "setImage-" + imageId);
	};

	SceneContext.prototype.setAnnotation = function(jsonContent) {
		if (!Array.isArray(jsonContent.annotations)) {
			return { error: "setAnnotation error: annotations are not properly defined" };
		}

		jsonContent.annotations.forEach(this.setAnnotationSingle.bind(this));

		this._checkSceneCompletion();
	};

	SceneContext.prototype.setHighlightStyle = function(jsonContent) {
		jsonContent.id = jsonContent.id.toString();
		this.sceneBuilder.insertHighlightStyle(jsonContent);
		this.requestQueue.highlights.pop(jsonContent.id);
	};

	SceneContext.prototype.setPlayback = function(jsonContent) {
		if (!Array.isArray(jsonContent.playbacks)) {
			return { error: "setPlayback error: playbacks are not properly defined" };
		}

		var view = this.sceneBuilder.getView(jsonContent.viewId, this.sceneId);
		var onlyLoadingPlaybacks = false;
		var i, playback;

		if (this.playbackIds) {
			for (i = 0; i < jsonContent.playbacks.length; i++){
				playback = jsonContent.playbacks[i];
				for (var j = 0; j < this.playbackIds.length; j++) {
					if (playback.id === this.playbackIds[j]) {
						playback.notLoading = false;
						break;
					}
				}
				if (playback.notLoading === undefined) {
					playback.notLoading = true;
				}
			}
			delete this.playbackIds;
			onlyLoadingPlaybacks = true;
		}

		if (Array.isArray(jsonContent.joints)) {// joints must be defined before sequences
			this.sceneBuilder.insertJoints(jsonContent.joints, this.sceneId);
		}

		for (i = 0; i < jsonContent.playbacks.length; i++){
			playback = jsonContent.playbacks[i];

			if (playback.notLoading) {
				continue;
			}

			if (playback.id == null) {
				// This is the case when whole playback is sent inline, there are no playbacks, sequences or tracks ids
				// Usually happens with temporary playbacks. Setting initial positions of objects is typical use case
				// We'll create ids here so that scene builder code treats them like any other playback or sequence
				playback.id = jsonContent.viewId + "-playback";
				playback.sequence.id = jsonContent.viewId + "-cont";
				playback.sequenceId = playback.sequence.id;
				this.setSequence({ sequences: [ playback.sequence ] });
			}
			this.sceneBuilder.insertPlayback(playback, jsonContent.viewId, this.sceneId);
			if (playback.sequenceId) {
				var existingSequence = this.sceneBuilder.getSequence(playback.sequenceId);
				if (existingSequence) {
					// Already received, don't ask for it again
					continue;
				} else {
					// Send it to the queue, to be requested
					this.requestQueue.sequences.push(playback.sequenceId);
				}
			}
		}

		if (!this.requestQueue.sequences.isEmpty()) {
			this.loader.hasAnimation = true;
		} else {
			this.sceneBuilder.finalizeAnimation();
			this.sceneBuilder.finalizePlaybacks();
			this.loader.hasAnimation = false;

			if (onlyLoadingPlaybacks) {
				this.onSetPlaybackCallbacks.execute(view);
			}
		}
	};

	SceneContext.prototype.setSequenceSingle = function(sequence) {
		var sequenceId = sequence.id;
		this.requestQueue.sequences.pop(sequenceId);

		if (sequence.nodes) {
			var nodes = [];
			var inlineTracks = [];
			for (var nj = 0; nj < sequence.nodes.length; nj++){
				var seqNode = sequence.nodes[nj];
				if (seqNode.rotate) {
					var rotateNode = {};

					if (seqNode.rotate.trackId) {
						rotateNode.trackId = seqNode.rotate.trackId;
						this.requestQueue.tracks.push(seqNode.rotate.trackId);
					} else {
						rotateNode.trackId = sequenceId + "ROTATE" + seqNode.sid;
						seqNode.rotate.id = rotateNode.trackId;
						inlineTracks.push(seqNode.rotate);
					}

					rotateNode.sid = seqNode.sid;
					rotateNode.binding = "ROTATE";
					if (seqNode.rotate.pivot) {
						rotateNode.pivot = seqNode.rotate.pivot;
					}
					nodes.push(rotateNode);
				}

				if (seqNode.translate) {
					var translateNode = {};

					if (seqNode.translate.trackId) {
						translateNode.trackId = seqNode.translate.trackId;
						this.requestQueue.tracks.push(seqNode.translate.trackId);
					} else {
						translateNode.trackId = sequenceId + "TRANSLATE" + seqNode.sid;
						seqNode.translate.id = translateNode.trackId;
						inlineTracks.push(seqNode.translate);
					}

					translateNode.sid = seqNode.sid;
					translateNode.binding = "TRANSLATE";
					if (seqNode.translate.pivot) {
						translateNode.pivot = seqNode.translate.pivot;
					}
					nodes.push(translateNode);
				}

				if (seqNode.scale) {
					var scaleNode = {};

					if (seqNode.scale.trackId) {
						scaleNode.trackId = seqNode.scale.trackId;
						this.requestQueue.tracks.push(seqNode.scale.trackId);
					} else {
						scaleNode.trackId = sequenceId + "SCALE" + seqNode.sid;
						seqNode.scale.id = scaleNode.trackId;
						inlineTracks.push(seqNode.scale);
					}

					scaleNode.sid = seqNode.sid;
					scaleNode.binding = "SCALE";
					if (seqNode.scale.pivot) {
						scaleNode.pivot = seqNode.scale.pivot;
					}
					nodes.push(scaleNode);
				}

				if (seqNode.opacity !== undefined) {
					var opacityNode = {};

					if (seqNode.opacity.trackId) {
						opacityNode.trackId = seqNode.opacity.trackId;
						this.requestQueue.tracks.push(seqNode.opacity.trackId);
					} else {
						opacityNode.trackId = sequenceId + "OPACITY" + seqNode.sid;
						seqNode.opacity.id = opacityNode.trackId;
						inlineTracks.push(seqNode.opacity);
					}

					opacityNode.sid = seqNode.sid;
					opacityNode.binding = "OPACITY";
					nodes.push(opacityNode);
				}
			}
			if (inlineTracks.length > 0) {
				this.setTrack({ tracks: inlineTracks });
			}
			sequence.nodes = nodes;
		}

		this.sceneBuilder.insertSequence(sequence, this.sceneId);
	};

	SceneContext.prototype.setSequence = function(jsonContent) {
		if (!Array.isArray(jsonContent.sequences)) {
			return { error: "setSequence error: sequences are not properly defined" };
		}

		if (Array.isArray(jsonContent.joints)) {// joints must be defined before sequences
			this.sceneBuilder.insertJoints(jsonContent.joints, this.sceneId);
		}

		jsonContent.sequences.forEach(this.setSequenceSingle.bind(this));

		if (this.requestQueue.tracks.isEmpty()) {
			this.loader.hasAnimation = false;
			this.loader.onSetSequenceCallbacks.execute();

			if (!this.requestQueue.views.isWaiting()) {
				this.onViewGroupFinishedCallbacks.execute();
			}
		}
	};

	SceneContext.prototype.setTrack = function(jsonContent) {
		if (!Array.isArray(jsonContent.tracks)) {
			return { error: "setTrack error: tracks are not properly defined" };
		}

		var tracks = [];
		for (var ti = 0; ti < jsonContent.tracks.length; ti++) {
			var track = jsonContent.tracks[ ti ];
			this.requestQueue.tracks.pop(track.id);

			// convert track ----------------
			track.times = track.time;
			if (track.vector3) {
				track.values = track.vector3;
			} else if (track.quaternion) {
				track.values = track.quaternion;
				track.rotateType = AnimationRotateType.Quaternion;
				// to be consistent with quaternion defined in three.js
				for (var vi = 3; vi < track.values.length; vi = vi + 4) {
					track.values[vi] = -track.values[vi];
				}
			} else if (track.angleAxis) {
				track.values = track.angleAxis;
				track.rotateType = AnimationRotateType.AngleAxis;
			} else if (track.euler) {
				track.values = track.euler;
				track.rotateType = AnimationRotateType.Euler;
			} else if (track.scalar) {
				track.values = track.scalar;
			}
			track.cyclicInfo = {};
			track.cyclicInfo.cyclicStart = track.cyclicStart;
			track.cyclicInfo.cyclicEnd = track.cyclicEnd;
			// convert track ----------------

			tracks.push(track);
		}

		this.sceneBuilder.insertTracks(tracks);

		if (!this.requestQueue.tracks.isWaiting()) {
			this.sceneBuilder.finalizeAnimation();
			this.sceneBuilder.finalizePlaybacks();
			this.loader.onSetTrackCallbacks.execute();

			if (!this.requestQueue.views.isWaiting() &&
				!this.requestQueue.sequences.isWaiting()) {
				this.onViewGroupFinishedCallbacks.execute();
			}
		}
	};

	SceneContext.prototype.notifyError = function(jsonContent) {
		if (!jsonContent.error) {
			jsonContent.error = "Unknown error";
		}
		return jsonContent;
	};

	return SceneContext;
});
