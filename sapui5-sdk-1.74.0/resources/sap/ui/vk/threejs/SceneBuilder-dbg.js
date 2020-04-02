/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides object sap.ui.vk.threejs.SceneBuilder.
sap.ui.define([
	"jquery.sap.global",
	"./thirdparty/three",
	"sap/base/Log",
	"./BBoxSubdivider",
	"./UsageCounter",
	"../totara/TotaraUtils",
	"./OrthographicCamera",
	"./PerspectiveCamera",
	"./DetailView",
	"./AnimationHelper",
	"./Thrustline",
	"../View",
	"./Billboard",
	"./Callout",
	"../BillboardCoordinateSpace",
	"../BillboardTextEncoding",
	"../BillboardStyle",
	"../BillboardBorderLineStyle",
	"../BillboardHorizontalAlignment",
	"../LeaderLineMarkStyle",
	"../DetailViewType",
	"../DetailViewShape",
	"../AnimationPlayback",
	"../AnimationRotateType",
	"../RenderMode",
	"./Material",
	"../ObjectType",
	"../getResourceBundle",
	"../NodeContentType",
	"./ThreeExtensions"
], function(
	jQuery,
	three,
	Log,
	BBoxSubdivider,
	UsageCounter,
	TotaraUtils,
	OrthographicCamera,
	PerspectiveCamera,
	DetailView,
	AnimationHelper,
	Thrustline,
	View,
	Billboard,
	Callout,
	BillboardCoordinateSpace,
	BillboardTextEncoding,
	BillboardStyle,
	BillboardBorderLineStyle,
	BillboardHorizontalAlignment,
	LeaderLineMarkStyle,
	DetailViewType,
	DetailViewShape,
	AnimationPlayback,
	AnimationRotateType,
	RenderMode,
	Material,
	ObjectType,
	getResourceBundle,
	NodeContentType,
	ThreeExtensions
) {
	"use strict";

	/**
	 * Provides the ability to create three.js scene from the information retrieved from streaming or vds file.

	 * SceneBuilder allows for creating scene tree, material, and geometry in any order.
	 * It is up to user to maintain the ids of entities that have not been created,
	 * and call the updating functions once the entities are created, for instance,
	 * calling node updating functions after the associated material or geometry is created,
	 * or material updating function after the associted images are created.

	 *
	 * Constructor for a new SceneBuilder
	 *
	 * @param {any} rootNode The reference object of a root node.
	 * 							When <code>rootNode</code> is specified in constructor, it's assumed that
	 * 							the constructed SceneBuilder only deals with one root node, and therefore one single scene.<br/>
	 * 							When no <code>rootNode</code> is not specified, the function setRootNode has to be called for each root node.

	 * @param {any} contentResource From content manager, only used for vds file reading (matai.js).
	 * @param {any} resolve From content manager, called in setScene function, only used for vds file reading (matai.js).
	 * @param {any} reject From content manager, called in serScene function, only used for vds file reading (matai.js).
	 * 	 *
	 * @public
	 * @author SAP SE
	 * @version 1.74.0
	 * @experimental Since 1.60.0 This class is experimental and might be modified or removed in future versions.
	 */
	var SceneBuilder = function(rootNode, contentResource, resolve, reject) {
		this._id = SceneBuilder._nextId++;
		SceneBuilder._add(this);

		// resources below are shared among different scences (represented by root nodes)
		this._callouts = new Map();
		this._cameras = new Map();
		this._images = new Map();
		this._imageIdsAndTileWidths = new Map();
		this._imageTextures = new Map(); // imageId -> [ { materialId, textureType } ]
		this._geometries = new Map();  // geometryId -> THREE.Geometry
		this._meshNodes = new Map(); // meshId -> [ THREE.Group ]
		this._meshSubmeshes = new Map(); // meshId -> [ THREE.Mesh ]
		this._geometryMeshes = new Map(); // geometryId -> [ meshId ]
		this._materialMeshes = new Map(); // materialId -> [ meshId ]
		this._materialClones = new Map(); // materialId -> [ THREE.Material ]
		this._joints = [];

		// resources below are created for each scene
		if (rootNode) {
			this._rootNode = rootNode;
			this._nodes = new Map(); // current map of node Ids and tree nodes , for current root node
			this._tracks = new Map();
			this._trackIdSequenceNodeMap = new Map();
			this._viewGroups = new Map();
			this._views = new Map();
		} else {  // to be initiated in function setRootNode
			this._rootNode = null;
			this._nodes = null;
			this._tracks = null;
			this._trackIdSequenceNodeMap = null;
			this._viewGroups = null;
			this._views = null;
		}

		this._currentSceneId = null;
		this._sceneIdTreeNodesMap = new Map();	// map of scene id and map of tree nodes: sceneId and this._meshSubmeshIds
		this._sceneIdRootNodeMap = new Map();	// map of scene id and root node
		this._sceneIdViewGroupMap = new Map();
		this._sceneIdViewMap = new Map();

		this._animationHelper = new AnimationHelper(this);

		if (contentResource) {
			this._countentResource = contentResource;
			var nodeProxy = contentResource.getNodeProxy();
			var nodeHierarchy = nodeProxy.getNodeHierarchy();
			this._vkScene = nodeHierarchy.getScene();
			var source = contentResource.getSource();
			if (source && source.name) {
				this._sceneIdTreeNodesMap.set(source.name, this._nodes);
				this._sceneIdRootNodeMap.set(source.name, rootNode);
				this._sceneIdViewGroupMap.set(source.name, this._viewGroups);
				this._sceneIdViewMap.set(source.name, this._views);
				this._currentSceneId = source.name;
			}
			if (this._rootNode) {
				if (!this._rootNode.userData) {
					this._rootNode.userData = {};
				}
				this._rootNode.userData.skipIt = !contentResource.name; // If content resource doesn't have name then don't display it in scene tree
			}
		}

		this._viewThumbnails = new Map();
		this._thrustlines = new Map();
		// for reading vds file (matai.js), need to revisit when re-developping animation is done
		this._animations = new Map();
		this._animationTracks = new Map();


		this._resolve = resolve;
		this._reject = reject;
	};

	SceneBuilder._nextId = 1;

	SceneBuilder._map = new Map();

	/**
	 * Get current SceneBuilder id.
	 *
	 * @returns {integer} current SceneBuilder id
	 * @public
	 */
	SceneBuilder.prototype.getId = function() {
		return this._id;
	};

	SceneBuilder.getById = function(id) {
		return this._map.get(id);
	};

	////////////////////////////////////////////////////////////////////////
	// Add current scene builder to the class map
	SceneBuilder._add = function(sceneBuilder) {
		SceneBuilder._map.set(sceneBuilder.getId(), sceneBuilder);
		return this;
	};

	var renderModes = [
		RenderMode.Default, // Default = 0,
		RenderMode.Default, // Solid,
		RenderMode.Default, // Transparent,
		RenderMode.LineIllustration, // LineIllustration,
		RenderMode.SolidOutline, // SolidOutline,
		RenderMode.ShadedIllustration // ShadedIllustration
	];

	/**
	 * Set scene information
	 *
	 * @param {any} info The reference object of root node
	 * @public
	 */
	SceneBuilder.prototype.setScene = function(info) {
		if (info.result !== 1) {
			var err = { status: info.result };
			switch (info.result) {
				case -1: err.errorText = getResourceBundle().getText("LOADER_FILENOTFOUND"); break;
				case -2: err.errorText = getResourceBundle().getText("LOADER_WRONGFILEFORMAT"); break;
				case -3: err.errorText = getResourceBundle().getText("LOADER_WRONGPASSWORD"); break;
				case -4: err.errorText = getResourceBundle().getText("LOADER_ERRORREADINGFILE"); break;
				case -5: err.errorText = getResourceBundle().getText("LOADER_FILECONTENT"); break;
				default: err.errorText = getResourceBundle().getText("LOADER_UNKNOWNERROR");
			}
			this._reject(err);
		} else {
			var camera = this._cameras.get(info.cameraId);
			this._resolve({
				node: this._parentNode,
				camera: camera,
				backgroundTopColor: info.backgroundTopColor,
				backgroundBottomColor: info.backgroundBottomColor,
				// renderMode: renderModes[info.renderMethod],
				contentResource: this._contentResource,
				builder: this
			});
		}
	};

	/**
	 * Set current root node, and create corresponding tree nodes map and mesh ID map
	 *
	 * @param {any} rootNode The reference object of root node
	 * @param {any} nodeId The id of root node in the scene tree
	 * @param {any} sceneId The id of scene with the root node as its top node
	 * @param {sap.ui.vk.threejs.Scene} vkScene scene
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining
	 * @public
	 */
	SceneBuilder.prototype.setRootNode = function(rootNode, nodeId, sceneId, vkScene) {
		this._rootNode = rootNode;
		this._nodes = new Map();
		this._nodes.set(nodeId, rootNode);
		if (!this._rootNode.userData) {
			this._rootNode.userData = {};
		}
		this._tracks = new Map();
		this._trackIdSequenceNodeMap = new Map();
		this._sequenceIdToPlaybacks = new Map();
		this._viewGroups = new Map();
		this._views = new Map();

		if (sceneId) {
			this._sceneIdTreeNodesMap.set(sceneId, this._nodes);
			this._sceneIdRootNodeMap.set(sceneId, rootNode);
			this._sceneIdViewGroupMap.set(sceneId, this._viewGroups);
			this._sceneIdViewMap.set(sceneId, this._views);
			this._currentSceneId = sceneId;
		}

		if (vkScene) {
			this._vkScene = vkScene;
		}
		return this;
	};

	////////////////////////////////////////////////////////////////////////
	// Reset current scene
	SceneBuilder.prototype._resetCurrentScene = function(sceneId) {
		if (sceneId && sceneId !== this._currentSceneId){
			var nodes = this._sceneIdTreeNodesMap.get(sceneId);
			if (nodes) {
				this._nodes = nodes;
			} else {
				this._nodes = null;
			}

			var node = this._sceneIdRootNodeMap.get(sceneId);
			if (node) {
				this._rootNode = node;
			} else {
				this._rootNode = null;
			}

			this._currentSceneId = sceneId;
		}
	};

	/**
	 * Get three.js node
	 * @param {any} nodeId The id of node in the scene tree
	 * @param {any} sceneId The id of scene containing the node
	 * @returns {THREE.Group} three.js group node
	 * @public
	 */
	SceneBuilder.prototype.getNode = function(nodeId, sceneId) {
		if (sceneId) {
			this._resetCurrentScene(sceneId);
			if (this._nodes) {
				return this._nodes.get(nodeId);
			}
		} else {
			var contextIterator = this._sceneIdTreeNodesMap.values();
			var contextItem = contextIterator.next();
			while (!contextItem.done) {
				var node = contextItem.value.get(nodeId);
				if (node) {
					return node;
				}
				contextItem = contextIterator.next();
			}
		}
		return null;
	};

	SceneBuilder.prototype.hasMesh = function(meshId) {
		return this._meshSubmeshes.has(meshId);
	};

	SceneBuilder.prototype.hasImage = function(imageId) {
		return this._images.has(imageId);
	};

	SceneBuilder.prototype.setNodePersistentId = function(nodeRef, nodeId, sceneId) {
		if ((nodeRef.userData.treeNode && nodeRef.userData.treeNode.sid) ||
			this.getNode(nodeId, sceneId)) {
			return false;
		}

		this._resetCurrentScene(sceneId);
		if (!nodeRef.userData.treeNode) {
			nodeRef.userData.treeNode = {};
		}
		nodeRef.userData.treeNode.sid = nodeId;
		if (this._nodes) {
			this._nodes.set(nodeId, nodeRef);
		}
		return true;
	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////
	// Create three.js matrix for an array, which may contain
	// 3 values --> x y z position
	// 12 values --> 4x3 column major matrix
	// 16 values --> 4x4 column major matrix
	var arrayToMatrix = function(arr) {
		var matrix = new THREE.Matrix4();
		if (arr.length === 3) {
			// position only matrix
			matrix.setPosition(new THREE.Vector3().fromArray(arr));
		} else if (arr.length === 12) {
			// 4x3 matrix
			matrix.set(arr[ 0 ], arr[ 3 ], arr[ 6 ], arr[ 9 ], arr[ 1 ], arr[ 4 ], arr[ 7 ], arr[ 10 ], arr[ 2 ], arr[ 5 ], arr[ 8 ], arr[ 11 ], 0.0, 0.0, 0.0, 1.0);
		} else if (arr.length === 16) {
			// 4x4 matrix
			matrix.set(arr[ 0 ], arr[ 4 ], arr[ 8 ], arr[ 12 ], arr[ 1 ], arr[ 5 ], arr[ 9 ], arr[ 13 ], arr[ 2 ], arr[ 6 ], arr[ 10 ], arr[ 14 ], arr[ 3 ], arr[ 7 ], arr[ 11 ], arr[ 15 ]);
		} else {
			throw "Invalid matrix format";
		}
		return matrix;
	};

	var DefaultHighlightingEmissive = { r: 0.0235,
		g: 0.0235,
		b: 0.0235
	};

	var DefaultHighlightingSpecular = { r: 0.0602,
		g: 0.0602,
		b: 0.0602
	};

	////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Create a place-holder material, whose value should be updated when material data is available
	SceneBuilder.prototype._createTemporaryMaterial = function(materialId) {
		var material = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
		material.userData.defaultHighlightingEmissive = DefaultHighlightingEmissive;
		material.userData.defaultHighlightingSpecular = DefaultHighlightingSpecular;
		material.userData.materialUsed = 0;
		material.userData.materialId = materialId;
		material.userData.toBeUpdated = true;
		var vkMaterial = new Material();
		vkMaterial.setMaterialRef(material);
		this._vkScene.setMaterial(materialId, vkMaterial);
		return material;
	};

	////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Get threejs material
	SceneBuilder.prototype._getMaterialRef = function(materialId) {
		var material = this._vkScene.getMaterial(materialId);
		return material ? material.getMaterialRef() : null;
	};

	SceneBuilder.prototype.checkMaterialExists = function(materialId) {
		if (this._getMaterialRef(materialId) === null) {
			this._createTemporaryMaterial(materialId);
			return false;
		}
		return true;
	};

	SceneBuilder.prototype._attachMaterialClone = function(materialId, materialClone) {
		TotaraUtils.pushElementIntoMapArray(this._materialClones, materialId, materialClone);
	};

	SceneBuilder.prototype._addDynamicObject = function(node, updateFunction) {
		if (!this._rootNode.userData._vkDynamicObjects) {
			this._rootNode.userData._vkDynamicObjects = [];
		}
		this._rootNode.userData._vkDynamicObjects.push(node);
		node._vkUpdate = updateFunction;
	};

	/**
	 * Create three.js node.
	 *
	 * @param {any} nodeInfo The node information object containning the following properties <br/>
	 *							<code>sid</code>: String. The id of node.
	 *							<code>name</code>: String. The name of the node. Optional.<br/>
	 *       					<code>transform</code>: matrix as either 12(no shear), 16(full) or 3(position only) values. Optional</br>
	 * 							<code>transformType</code>: string . "BILLBOARD_VIEW" or "LOCK_TOVIEWPORT". Optional</br>
	 *       					<code>visible</code>: Boolean. True if the node is visible. Default true. Optional<br/>
	 * 							<code>visualisable</code>: Boolean. False if the node is skipped. Default true. Optional<br/>
	 * 							<code>selectable</code>: Boolean. True if the node can be selected. Default true. Optional<br/>
	 * 							<code>closed</code>: Boolean. True if the node is close. Default false. Optional<br/>
	 *       					<code>materialId</code>: String. The id of the material the node is associated with. Optional<br/>
	 *       					<code>meshId</code>: String. The id of the mesh. Optional<br/>
	 * 							<code>opacity</code>: String. The opacity of node, to be applied to submesh nodes. Optional<br/>
	 * 							<code>parentId</code>: id of parent node. Optional<br/>
	 * 							<code>renderOrder</code>: order of rendering. Optional<br/>
	 * 							<code>renderMethod</code>: rendering method. Optional<br/>
	 * 							<code>renderStage</code>: rendering stage. Optional<br/>
	 * 							<code>metaData</code>: meta data. Optional<br/>
	 * 							<code>veids</code>: veids. Optional<br/>
	 *
	 *
	 * @param {string} sceneId The id of scene containing the node
	 * @returns {any} The created node<br/>
	*/
	SceneBuilder.prototype.createNode = function(nodeInfo, sceneId) {
		this._resetCurrentScene(sceneId);

		var node = new THREE.Group();
		this._nodes.set(nodeInfo.sid, node);

		var parent = this._nodes.get(nodeInfo.parentId);
		(parent || this._rootNode).add(node);

		var userData = node.userData;
		userData.treeNode = nodeInfo;
		if (nodeInfo.closed) {
			userData.closed = true;
		}
		if (nodeInfo.selectable === false) {
			userData.selectable = false;
		}
		if (nodeInfo.visualisable === false) {
			userData.skipIt = true; // // Don't display this node in scene tree
		}
		if (nodeInfo.metadata) {
			userData.metadata = nodeInfo.metadata;
		}
		if (nodeInfo.veids) {
			userData.veids = nodeInfo.veids;
		}
		if (nodeInfo.name) {
			node.name = nodeInfo.name;
		}
		if (nodeInfo.visible !== undefined) {
			node.layers.mask = nodeInfo.visible ? (1 | 0) : 0;
		}

		if (parent && parent.name && node.name && node.name === parent.name + " offset geometry") {
			node.layers = parent.layers; // offset geometry visibility fix
		} else {
			var ancestor = parent;
			while (ancestor) {
				if (ancestor.userData.closed) {
					node.layers = ancestor.layers; // apply visibility from the first closed ancestor node
					break;
				}
				ancestor = ancestor.parent;
			}
		}

		if (sceneId) {// TODO: Remove this code when visilibity streaming will be fixed.
			var ancestor2 = parent;
			while (ancestor2) {
				if ((ancestor2.layers.mask & 1) === 0) {
					node.layers.mask &= ~1; // the node is invisible if some ancestor is invisible
					break;
				}
				ancestor2 = ancestor2.parent;
			}
		}

		if (nodeInfo.renderOrder) {
			node.renderOrder = nodeInfo.renderOrder;
		}

		if (nodeInfo.opacity !== undefined) {
			userData.opacity = nodeInfo.opacity;
		}

		// if tree has transform, it should overwrite one from the element.
		if (nodeInfo.transform) {
			node.applyMatrix(arrayToMatrix(nodeInfo.transform));
		}
		node.updateMatrixWorld(true);

		if (nodeInfo.transformType) {
			userData.transformType = nodeInfo.transformType;
			switch (nodeInfo.transformType) {
				case "BILLBOARD_VIEW":  this._addDynamicObject(node, Billboard.prototype._billboardViewUpdate); break;
				case "LOCK_TOVIEWPORT": this._addDynamicObject(node, Billboard.prototype._lockToViewportUpdate); break;
				default:  break;
			}
		}

		if (nodeInfo.materialId) {// overriden material for node submeshes
			userData.materialId = nodeInfo.materialId;
		}
		if (nodeInfo.meshId) {
			this.setMeshNode(nodeInfo.sid, nodeInfo.meshId);
		}

		if (node.parent.userData.objectType === ObjectType.Hotspot) {
			userData.objectType = ObjectType.Hotspot;
		} else if (node.parent.userData.objectType === ObjectType.PMI) {
			userData.objectType = ObjectType.PMI;
		} else if (nodeInfo.contentType === "HOTSPOT") {
			userData.objectType = ObjectType.Hotspot;
		} else if (nodeInfo.contentType === "PMI") {
			userData.objectType = ObjectType.PMI;
		}

		if (nodeInfo.contentType === "REFERENCE") {
			node._vkSetNodeContentType(NodeContentType.Reference);
		}

		return node;
	};

	function createSubmesh(geometry, material, lod) {
		var submesh;
		if (geometry.isPolyline) {
			var lineMaterial = new THREE.LineBasicMaterial({
				color: 0xff0000,
				linewidth: 1
				// depthTest: false
			});
			if (material) {
				lineMaterial.color.copy(material.color);
			}
			submesh = new THREE.LineSegments(geometry, lineMaterial);
		} else {
			submesh = new THREE.Mesh(geometry, material);
		}

		if (geometry.isPositionQuantized) {
			updateMeshTransformWithBoundingBox(submesh, lod.boundingBox);
		}

		UsageCounter.increaseGeometryUsed(geometry);

		return submesh;
	}

	/**
	 * Get ids of child nodes of a node.
	 *
	 * @param {any} nodeId The id of node in the scene tree
	 * @param {any} sceneId The id of scene containing the node
	 * @param {boolean} includeMeshNode The id of scene containing the node
	 * @returns {any[]} array of child node ids
	 * @public
	 */
	SceneBuilder.prototype.getChildNodeIds = function(nodeId, sceneId, includeMeshNode) {
		this._resetCurrentScene(sceneId);

		var node = this._nodes.get(nodeId);

		var ids = [];

		if (!node) {
			return ids;
		}

		if (node && node.children) {
			for (var i = 0; i < node.children.length; i++) {
				var child = node.children[i];
				if (child.userData.treeNode && child.userData.treeNode.sid) {
					ids.push(child.userData.treeNode.sid);
				} else if (includeMeshNode && child.userData.submeshInfo && child.userData.submeshInfo.id) {
					ids.push(child.userData.submeshInfo.id);
				}
			}
		}
		return ids;
	};

	function findInnerBoxLOD(lods) {
		for (var i = 0; i < lods.length; i++) {
			if (lods[ i ].type === "box" && lods[ i ].data) {
				return lods[ i ];
			}
		}
		return null;
	}

	function findBestLOD(lods) {
		if (Array.isArray(lods)) {
			for (var i = 0; i < lods.length; i++) {
				if (lods[ i ].type === undefined || lods[ i ].type === "mesh" || lods[ i ].type === "line") {
					return lods[ i ];
				}
			}
		}

		return null;
	}

	function updateMeshTransformWithBoundingBox(mesh, boundingBox) {
		if (boundingBox && boundingBox.length === 6) {
			mesh.position.set(
				(boundingBox[ 3 ] + boundingBox[ 0 ]) * 0.5,
				(boundingBox[ 4 ] + boundingBox[ 1 ]) * 0.5,
				(boundingBox[ 5 ] + boundingBox[ 2 ]) * 0.5);

			mesh.scale.set(
				Math.max(boundingBox[ 3 ] - boundingBox[ 0 ], Number.EPSILON),
				Math.max(boundingBox[ 4 ] - boundingBox[ 1 ], Number.EPSILON),
				Math.max(boundingBox[ 5 ] - boundingBox[ 2 ], Number.EPSILON));
		}
	}

	/**
	 * Insert a submesh to the mesh.
	 *
	 * @param {any} submeshInfo The object of submesh information that have the following properties<br/>
	 *								<code>meshId</code>: string id of mesh that this sub-mesh belongs to<br/>
	 *								<code>materialId</code>: string, id of the material this sub-mesh is associated with, optional<br/>
	 *								<code>bondingBox</code>: [minx, miny, minz, maxx, maxy, maxz], only used for reading vds file (maitai.js)<br/>
	 *								<code>transform</code>: matrix as either 12(no shear), 16(full) or 3(position only) values. Optional</br>
	 *								<code>lods</code>: array of lods each containing the follow properties, only used for <br/>
	 *	 									<code>id</code>: string, geometry id the lod is associated with<br/>
	 *										<code>type</code>: string enum, default is 'mesh', other values are 'box' or 'line', optional<br/>
	 *										<code>boundingBox</code>: [minx, miny, minz, maxx, maxy, maxz]<br/>
	 *										<code>data</code>: inline base64 data for small or box geometry<br/>
	 *
	 * @returns {boolean} true if the submesh was successfully created and inserted in to the mesh.
	 * @public
	 */

	SceneBuilder.prototype.insertSubmesh = function(submeshInfo) {
		// console.log("insertSubmesh", submeshInfo);
		var material = this._getMaterialRef(submeshInfo.materialId) || this._createTemporaryMaterial(submeshInfo.materialId);
		var submesh, geometry;

		if (submeshInfo.lods) {   // streaming with lods
			var lod = findBestLOD(submeshInfo.lods);
			if (!lod) {
				return false;
			}

			geometry = this._geometries.get(lod.id);
			if (geometry) {
				submesh = createSubmesh(geometry, material, lod);

				if (geometry.userData && geometry.userData.noNormal && submeshInfo.materialId) {
					this.updateMaterialForGeometryWithoutNormal(submeshInfo.materialId);
				}
			} else {
				var innerBoxGeometry;
				try {
					var innerBoxLod = findInnerBoxLOD(submeshInfo.lods);
					if (innerBoxLod && innerBoxLod.data) {
						var packedInnerBox = TotaraUtils.base64ToUint8Array(innerBoxLod.data);
						var unpacked = BBoxSubdivider.unpackSubDividedBoundingBox(packedInnerBox);
						innerBoxGeometry = BBoxSubdivider.makeSubDividedBoundingBoxGeometry(unpacked);
					}
				} catch (e) {
					// console.log(e);
				}

				submesh = new THREE.Mesh(innerBoxGeometry ? innerBoxGeometry : new THREE.BoxBufferGeometry(1, 1, 1), material);

				var boundingBox = lod.boundingBox;
				if (boundingBox && boundingBox.length === 6) {
					var mat = new THREE.Matrix4();

					mat.scale(new THREE.Vector3(Math.max(boundingBox[ 3 ] - boundingBox[ 0 ], Number.EPSILON),
						Math.max(boundingBox[ 4 ] - boundingBox[ 1 ], Number.EPSILON),
						Math.max(boundingBox[ 5 ] - boundingBox[ 2 ], Number.EPSILON)));

					mat.setPosition(new THREE.Vector3((boundingBox[ 3 ] + boundingBox[ 0 ]) * 0.5,
						(boundingBox[ 4 ] + boundingBox[ 1 ]) * 0.5,
						(boundingBox[ 5 ] + boundingBox[ 2 ]) * 0.5));

					submesh.geometry.applyMatrix(mat);
				}

				submesh.userData.geometryId = lod.id;
				submesh.userData.lodInfo = lod;
				TotaraUtils.pushElementIntoMapArray(this._geometryMeshes, lod.id, submeshInfo.meshId);
			}
		} else {
			return false;
		}

		// if tree has transform, it should overwrite one from the element.
		if (submeshInfo.transform) {
			submesh.applyMatrix(arrayToMatrix(submeshInfo.transform));
		}

		// submesh.name = "submesh-" + meshId + "-" + submeshInfo.id + "-" + lod.id;
		submesh.userData.submeshId = submeshInfo.id;
		submesh.userData.initialMaterialId = submeshInfo.materialId;
		submesh.userData.meshId = submeshInfo.meshId;
		submesh.userData.materialId = submeshInfo.materialId;
		submesh.userData.submeshInfo = submeshInfo;

		TotaraUtils.pushElementIntoMapArray(this._materialMeshes, submeshInfo.materialId, submeshInfo.meshId);
		TotaraUtils.pushElementIntoMapArray(this._meshSubmeshes, submeshInfo.meshId, submesh);

		var nodes = this._meshNodes.get(submeshInfo.meshId);
		if (nodes) {
			nodes.forEach(function(node) {
				var clonedSubmesh = submesh.clone();
				clonedSubmesh.layers = node.layers;
				if (node.userData.materialId) {// the parent node overrides the original submesh material
					clonedSubmesh.material = this._getMaterialRef(node.userData.materialId) || submesh.material;
				}
				node.add(clonedSubmesh);
				applyNodeOpacityToSubmeshMaterial(node, submeshInfo.materialId, this._materialClones);
			}.bind(this));
		}

		return true;
	};

	function replaceSubmeshGeometry(children, geometryId, geometry, meshId) {
		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			if (geometryId && child.userData.geometryId === geometryId && child.geometry !== geometry) {
				if (child.type === "Mesh" && !geometry.isPolyline) {
					child.geometry = geometry;
					if (geometry.isPositionQuantized) {
						updateMeshTransformWithBoundingBox(child, child.userData.lodInfo.boundingBox);
					}
					UsageCounter.increaseGeometryUsed(geometry);
				} else {
					// console.log("!!!replaceSubmeshGeometry", node, i, newSubmesh, child);
					var newSubmesh = createSubmesh(geometry, child.material, child.userData.lodInfo);
					newSubmesh.userData = child.userData;
					newSubmesh.layers = child.layers;
					newSubmesh.parent = child.parent;
					children[i] = newSubmesh;
					child.parent = null;
				}
			}
		}
	}

	function replaceMaterial(node, materialId, material, materialClones) {
		var nodeOpacity = node.userData.opacity !== undefined ? node.userData.opacity : 1;
		var children = node.children;
		children.forEach(function(child) {
			if (child.userData.materialId === materialId) {
				UsageCounter.increaseMaterialUsed(material);
				child.material = material;
				child.userData.opacity = nodeOpacity;
				delete child.userData.originalMaterial;
				child._vkUpdateMaterialOpacity();
				if (child.material !== material) {
					TotaraUtils.pushElementIntoMapArray(materialClones, materialId, child.material);
				}
			}
		});
	}

	function applyNodeOpacityToSubmeshMaterial(node, materialId, materialClones) {
		var nodeOpacity = node.userData.opacity !== undefined ? node.userData.opacity : 1;
		node.children.forEach(function(child) {
			if (child.material && (!materialId || materialId === child.material.userData.materialId)) {
				var prevMaterial = child.material;
				child.userData.opacity = nodeOpacity;
				child._vkUpdateMaterialOpacity();
				if (child.material !== prevMaterial) {
					TotaraUtils.pushElementIntoMapArray(materialClones, child.material.userData.materialId, child.material);
				}
			}
		});
	}

	/**
	 * Create a geometry from geometry information
	 *
	 * @param {any} geoInfo The object of geometry information that have the following properties<br/>
	 *								<code>id</code> : string, id of this geometry<br/>
	 *								<code>isPolyline</code>: boolean, true if the submesh is polyline<br/>
	 *								<code>isPositionQuantized</code>: boolean, true if the asociated submesh needs to be repositioned to bounding box centre<br/>
	 *								<code>meshId</code>: id of mesh that contains the submesh with the goemetry, optional
	 *								<code>data.indices</code>: array of point index<br/>
	 *								<code>data.points</code>: array of point coordinates<br/>
	 *								<code>data.normals</code>: array of point normal coordinates, optional<br/>
	 *								<code>data.uvs</code>: array of texture uv coordinates, optional<br/>
	 *
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.setGeometry = function(geoInfo) {
		// console.log("setGeometry", geoInfo);
		var geometry = new THREE.BufferGeometry();
		var indexAttribute = new THREE.BufferAttribute(new Uint16Array(geoInfo.data.indices), 1);
		var positionAttribute = new THREE.BufferAttribute(new Float32Array(geoInfo.data.points), 3);

		geometry.setIndex(indexAttribute);
		geometry.addAttribute("position", positionAttribute);

		if (!geometry.userData) {
			geometry.userData = {};
		}

		if (!geoInfo.isPolyline) {
			if (geoInfo.data.normals && geoInfo.data.normals.length === geoInfo.data.points.length) {
				var normalAttribute = new THREE.BufferAttribute(new Float32Array(geoInfo.data.normals), 3);
				geometry.addAttribute("normal", normalAttribute);
			} else {
				geometry.userData.noNormal = true;
			}

			if (geoInfo.data.uvs && geoInfo.data.uvs.length * 3 === geoInfo.data.points.length * 2) {
				geometry.addAttribute("uv", new THREE.BufferAttribute(new Float32Array(geoInfo.data.uvs), 2));
			}
		} else {
			geometry.isPolyline = true; // debug flag
		}

		geometry.computeBoundingBox();
		geometry.computeBoundingSphere();

		geometry.isPositionQuantized = geoInfo.isPositionQuantized;

		geometry.userData.geometryId = geoInfo.id;
		geometry.userData.geometryUsed = 0;

		this._geometries.set(geoInfo.id, geometry);

		var meshIds = this._geometryMeshes.get(geoInfo.id);
		if (meshIds) {
			for (var mi = 0; mi < meshIds.length; mi++) {
				var meshId = meshIds[ mi ];
				var nodes = this._meshNodes.get(meshId);
				if (nodes) {
					for (var ni = 0; ni < nodes.length; ni++) {
						replaceSubmeshGeometry(nodes[ni].children, geoInfo.id, geometry);
					}
				}
				var submeshes = this._meshSubmeshes.get(meshId);
				if (submeshes) {
					replaceSubmeshGeometry(submeshes, geoInfo.id, geometry);
				}
			}
		}

		if (this._fireSceneUpdated) {
			this._fireSceneUpdated();
		}

		return this;
	};

	/**
	 * Set a node as mesh node
	 * @param {string} nodeId The id of node
	 * @param {string} meshId The id of mesh
	 * @public
	 */
	SceneBuilder.prototype.setMeshNode = function(nodeId, meshId) {
		var node = this._nodes.get(nodeId);
		if (node) {
			TotaraUtils.pushElementIntoMapArray(this._meshNodes, meshId, node);
			var submeshes = this._meshSubmeshes.get(meshId); // [ THREE.Mesh ]
			if (submeshes) {
				submeshes.forEach(function(submesh) {
					var clonedSubmesh = submesh.clone();
					clonedSubmesh.layers = node.layers;
					if (node.userData.materialId) {// the parent node overrides the original submesh material
						clonedSubmesh.material = this._getMaterialRef(node.userData.materialId) || submesh.material;
					}
					node.add(clonedSubmesh);
				}.bind(this));
				applyNodeOpacityToSubmeshMaterial(node, null, this._materialClones);
			}
		}
	};

	SceneBuilder.prototype.progress = function(progress) {
		Log.log("reading progress:", progress);
	};

	SceneBuilder.prototype.loadingFinished = function(info) {
		if (this._fireLoadingFinished) {
			this._fireLoadingFinished(info);
		}
	};

	/**
	 * Get three.js geometry
	 * @param {any} geometryId The id of geometry
	 * @returns {THREE.Geometry} three.js geometry
	 * @public
	 */
	SceneBuilder.prototype.getGeometry = function(geometryId) {
		return this._geometries.get(geometryId);
	};

	var annotationStyles = [
		BillboardStyle.RectangularShape,
		BillboardStyle.CircularShape,
		BillboardStyle.None,
		BillboardStyle.TextGlow
	];

	var annotationCoordinateSpaces = [
		BillboardCoordinateSpace.Viewport,
		BillboardCoordinateSpace.Screen,
		BillboardCoordinateSpace.World
	];

	var annotationBorderLineStyles = [
		BillboardBorderLineStyle.None,
		BillboardBorderLineStyle.Solid,
		BillboardBorderLineStyle.Dash,
		BillboardBorderLineStyle.Dot,
		BillboardBorderLineStyle.DashDot,
		BillboardBorderLineStyle.DashDotDot
	];

	var leaderLineMarkStyles = [
		LeaderLineMarkStyle.None,
		LeaderLineMarkStyle.Point,
		LeaderLineMarkStyle.Arrow
	];

	var billboardTextEncodings = [
		BillboardTextEncoding.PlainText,
		BillboardTextEncoding.HtmlText
	];

	var billboardHorizontalAlignments = [
		BillboardHorizontalAlignment.Left,
		BillboardHorizontalAlignment.Center,
		BillboardHorizontalAlignment.Right
	];

	function cssColor(color) {
		var hexColor = color.toString(16);
		if (color.length >= 3){
			hexColor = (((color[0] * 255) << 16) | ((color[1] * 255) << 8) | (color[2] * 255)).toString(16);
		}
		return "#" + "000000".substring(hexColor.length) + hexColor;
	}

	function checkArray(array) {
		for (var i = 0, l = array.length; i < l; i++) {
			if (!isFinite(array[ i ])) {
				return false;
			}
		}
		return true;
	}

	////////////////////////////////////////////////////////////////////////
	// Add an annotation to a node
	SceneBuilder.prototype.createAnnotation = function(annotation, sceneId) {
		if (!checkArray(annotation.position)) {
			// console.error("Incorrect text annotation position", info);
			return;
		}

		this._resetCurrentScene(sceneId);
		var node = this._nodes.get(annotation.nodeId);
		var pos = annotation.position;
		annotation.coordinateSpace |= 0;
		var backgroundOpacity = annotation.backgroundOpacity;
		if (!backgroundOpacity) {
			backgroundOpacity = annotation.backgroundColour ? annotation.backgroundColour[3] : 0;
		}

		var borderOpacity = annotation.borderOpacity;
		if (!borderOpacity) {
			borderOpacity = annotation.borderColour ? annotation.borderColour[3] : 0;
		}
		var params = {
			node: node,
			coordinateSpace: annotationCoordinateSpaces[annotation.coordinateSpace],
			style: annotationStyles[annotation.shape || 0],
			width: annotation.width,
			height: annotation.height,
			backgroundColor: annotation.backgroundColour ? cssColor(annotation.backgroundColour) : "#fff",
			backgroundOpacity: backgroundOpacity,
			borderColor: annotation.borderColour ? cssColor(annotation.borderColour) : "#000",
			borderOpacity: borderOpacity,
			borderWidth: annotation.borderWidth,
			borderLineStyle: annotationBorderLineStyles[annotation.borderLineStyle]
			// horizontalAlignment: billboardHorizontalAlignments[annotation.textHorizontalAlignment]
		};

		if (annotation.encoding !== undefined) {  // for reading vds file (matai.js)
			params.encoding = billboardTextEncodings[annotation.encoding];
			params.font = annotation.font;
			params.fontSize = annotation.fontSize;
			params.fontWeight = Math.min(annotation.fontWeight, 900);
			params.fontItalic = annotation.fontItalic;
			params.textColor = cssColor(annotation.textColor);
			params.link = annotation.link;
			params.horizontalAlignment = billboardHorizontalAlignments[annotation.textHorizontalAlignment];
			params.position = new THREE.Vector3().fromArray(pos);
		} else if (annotation.fontFace) {
			params.encoding = BillboardTextEncoding.PlainText;
			params.font = annotation.fontFace;
			params.fontSize = Math.abs(annotation.fontSize);
			params.fontWeight = Math.min(annotation.fontWeight, 900);
			// params.fontItalic = !!annotation.fontItalic;
			params.textColor = cssColor(annotation.textColour);
		} else {
			params.encoding = BillboardTextEncoding.HtmlText;
		}


		if (annotation.coordinateSpace  < 2) {// billboard (text annotation)
			if (!params.positions) {
				params.position = new THREE.Vector3(pos[0] * 2 - 1, pos[1] * -2 + 1, pos[2]);
			}
			params.renderOrder = (annotation.order | 0) + 1000;
			var billboard = new Billboard(params);
			billboard.setText(annotation.text);
			this._addDynamicObject(node, billboard._update.bind(billboard));
		} else {// callout
			params.anchorNode = this._nodes.get(annotation.sid) || this._rootNode;
			if (!params.postion) {
				params.position = new THREE.Vector3().fromArray(pos);
			}
			params.depthTest = false;
			params.renderOrder = annotation.order | 0;
			if (annotation.alwaysOnTop) {
				params.renderOrder = 1;
			}
			var callout = new Callout(params);
			callout.setText(annotation.text);

			this._callouts.set(annotation.id, callout);
			this._addDynamicObject(node, callout._update.bind(callout));
		}
	};


	SceneBuilder.prototype.createImageNote = function(annotation, sceneId) {
		this._resetCurrentScene(sceneId);
		var node = this._nodes.get(annotation.nodeId);
		// node.position.x = -node.position.x;
		// annotation.position[0] = -annotation.position[0];
		node.updateMatrix();

		var position = new THREE.Vector3().fromArray(annotation.position);
		var width = annotation.width;
		var height = annotation.height;
		if (!annotation.properlyAligned) {
			position.x += annotation.width * 0.5;
			position.y += annotation.height * 0.5;
			position.applyMatrix4(node.matrix);
			width = annotation.width * 0.5 * node.matrix.elements[0];
			height = annotation.height * 0.5 * node.matrix.elements[5];
		}

		var billboard = new Billboard({
			node: node,
			coordinateSpace: BillboardCoordinateSpace.Screen,
			renderOrder: (annotation.order | 0) + 1000,
			position: position,
			width: width,
			height: height
		});
		var material = this._getMaterialRef(annotation.labelMaterialId);
		billboard.setMaterial(material);

		this._addDynamicObject(node, billboard._update.bind(billboard));
	};

	SceneBuilder.prototype.insertLeaderLine = function(leaderLine, sceneId) {
		this._resetCurrentScene(sceneId);
		var callout = this._callouts.get(leaderLine.annotationId);
		if (callout) {
			var vertices = [];
			for (var i = 0, l = leaderLine.points.length; i < l; i++) {
				vertices.push(new THREE.Vector3().fromArray(leaderLine.points[i]));
			}
			var material = this._getMaterialRef(leaderLine.materialId);
			var anchorNode = this._nodes.get(leaderLine.startPointSid) || this._roteNode;
			callout.addLeaderLine(vertices, anchorNode, material,
				leaderLineMarkStyles[leaderLine.startPointHeadStyle], leaderLineMarkStyles[leaderLine.endPointHeadStyle], leaderLine.pointHeadConstant, leaderLine.extensionLength);
		}
	};

	var detailViewTypes = [
		DetailViewType.DetailView,
		DetailViewType.Cutaway
	];

	var detailViewShapes = [
		DetailViewShape.Box,
		DetailViewShape.Circle,
		DetailViewShape.CircleLine,
		DetailViewShape.CirclePointer,
		DetailViewShape.CircleArrow,
		DetailViewShape.CircleBubbles,
		DetailViewShape.BoxLine,
		DetailViewShape.BoxNoOutline,
		DetailViewShape.SolidPointer,
		DetailViewShape.SolidArrow
	];
	SceneBuilder.prototype.createDetailView = function(info, sceneId) {
		this._resetCurrentScene(sceneId);
		var node = this._nodes.get(info.nodeId);
		if (node) {
			if (!info.properlyAligned) {
				if (!info.shape) { // box = 0 or undefined
					info.shape = info.leaderStyle ? DetailViewShape.BoxLine : DetailViewShape.Box;
				} else { // circle = 1
					info.shape = [
						DetailViewShape.Circle,
						DetailViewShape.CircleLine,
						DetailViewShape.CirclePointer,
						DetailViewShape.CircleArrow,
						DetailViewShape.CircleBubbles
					][info.leaderStyle || 0];
				}

				info.type = info.cutaway ? DetailViewType.Cutaway : DetailViewType.DetailView;
				info.camera = info.camera ? this.createCamera(info.camera) : null;
				info.origin = new THREE.Vector2(node.position.x * 2 - 1 + node.scale.x, node.position.y * -2 + 1 - node.scale.x);
				info.size = new THREE.Vector2(node.scale.x, node.scale.y);
				info.renderOrder = node.renderOrder;
			} else {
				info.type = detailViewTypes[info.type];
				info.shape = detailViewShapes[info.shape];
				info.camera = this._cameras.get(info.cameraId);
				info.origin = new THREE.Vector2().fromArray(info.origin);
				info.size = new THREE.Vector2().fromArray(info.size);
			}

			var visibleNodes = [];
			if (info.visibleNodes) {
				info.visibleNodes.forEach(function(nodeRef) {
					var node = this._nodes.get(nodeRef);
					if (node) {
						visibleNodes.push(node);
					} else {
						Log.warning("Unknown detailView visible node reference", nodeRef);
					}
				}.bind(this));
			}

			var targetNodes = [];
			if (info.targetNodes) {
				info.targetNodes.forEach(function(nodeRef) {
					var node = this._nodes.get(nodeRef);
					if (node) {
						targetNodes.push(node);
					} else {
						Log.warning("Unknown detailView target node reference", nodeRef);
					}
				}.bind(this));
			}

			var detailView = new DetailView({
				name: info.name,
				camera: info.camera,
				type: info.type,
				shape: info.shape,
				borderWidth: info.borderWidth || 0,
				backgroundColor: cssColor(info.backgroundColour),
				borderColor: cssColor(info.borderColour),
				origin: info.origin,
				size: info.size,
				attachmentPoint: new THREE.Vector3().fromArray(info.attachment),
				metadata: info.metadata,
				veId: info.veid,
				visibleNodes: visibleNodes,
				targetNodes: targetNodes
			});
			if (!this._rootNode.userData._vkDetailViews) {
				this._rootNode.userData._vkDetailViews = [];
			}
			this._rootNode.userData._vkDetailViews.push({
				detailView: detailView,
				node: node,
				renderOrder: info.renderOrder || 0
			});
		}
	};

	SceneBuilder.prototype.insertThrustline = function(info) {
		var node = this._nodes.get(info.thrustlineId);
		if (node && !this._thrustlines.get(info.thrustlineId)) {
			var thrustline = new Thrustline({
				node: node,
				principleAxis: new THREE.Vector3().fromArray(info.principleAxis),
				material: this._getMaterialRef(info.materialId)
			});

			var items = [];
			var basisAxisCount = 0;
			var boundPointCount = 0;
			var count = 0;
			for (var ii = 0; ii < info.itemCount; ii++) {
				var item = {};
				item.target = this._nodes.get(info.targets[ii]);
				item.majorAxisIndex = info.itemMajorAxisesIndices[ii];

				var bi;

				item.basisAxises = [];
				count = basisAxisCount + info.itemBasisAxisesCounts[ii];
				for (bi = basisAxisCount; bi < count; bi++) {
					var basisAxis = {};
					basisAxis.x = info.itemBasisAxisesCoordinates[bi * 3];
					basisAxis.y = info.itemBasisAxisesCoordinates[bi * 3 + 1];
					basisAxis.z = info.itemBasisAxisesCoordinates[bi * 3 + 2];
					item.basisAxises.push(basisAxis);
				}
				basisAxisCount = count;

				item.dimension = {};
				item.dimension.x = info.itemDimensionsCoordinates[ii * 3];
				item.dimension.y = info.itemDimensionsCoordinates[ii * 3 + 1];
				item.dimension.z = info.itemDimensionsCoordinates[ii * 3 + 2];

				item.center = {};
				item.center.x = info.itemCentersCoordinates[ii * 3];
				item.center.y = info.itemCentersCoordinates[ii * 3 + 1];
				item.center.z = info.itemCentersCoordinates[ii * 3 + 2];

				item.boundPoints = [];
				count = boundPointCount + info.itemBoundPointsCounts[ii];
				for (bi = boundPointCount; bi < count; bi++) {
					var point = {};
					point.x = info.itemBoundPointsCoordinates[bi * 3];
					point.y = info.itemBoundPointsCoordinates[bi * 3 + 1];
					point.z = info.itemBoundPointsCoordinates[bi * 3 + 2];
					item.boundPoints.push(point);
				}
				boundPointCount = count;

				items.push(item);
			}

			thrustline.setItems(items);

			var ratioCount = 0;
			var segments = [];
			for (var si = 0; si < info.segmentCount; si++) {
				var segment = {};
				segment.startItemIndex = info.segmentsStartItemIndices[si];
				segment.endItemIndex = info.segmentsEndItemIndices[si];
				segment.startBoundIndex = info.segmentsStartBoundIndices[si];
				segment.endBoundIndex = info.segmentsEndBoundIndices[si];
				segment.ratios = [];
				count = ratioCount + info.segmentRatioCounts[si];
				for (var ri = 0; ri < count; ri++) {
					var ratio = {};
					ratio.x = info.segmentRatiosCoordinates[ri * 2];
					ratio.y = info.segmentRatiosCoordinates[ri * 2 + 1];
					segment.ratios.push(ratio);
				}
				ratioCount = count;
				segments.push(segment);
			}
			thrustline.setSegments(segments);
			this._thrustlines.set(info.thrustlineId, thrustline);
			this._addDynamicObject(node, thrustline._update.bind(thrustline));
		}
	};


	////////////////////////////////////////////////////////////////////////
	// Decrease material and geometry counters in a node
	SceneBuilder.prototype._decrementResourceCounters = function(target) {
		target.traverse(function(child) { // Gather all geometries of node children
			if (child.isMesh) { // if child is instance of mesh then look for material and geometries

				UsageCounter.decreaseMaterialUsed(child.material);

				UsageCounter.decreaseGeometryUsed(child.geometry);
			}
		});
	};

	/**
	 * Decrease material and geometry counters in nodes
	 * This function should be called after node are deleted without using sceneBuilder "remove" function
	 *
	 * @param {any[]} nodeIds Array of node ids that are deleted
	 * @param {any} sceneId The id of scene containing the nodes
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.decrementResourceCountersForDeletedTreeNode = function(nodeIds, sceneId) {
		this._resetCurrentScene(sceneId);

		var that = this;

		nodeIds = [].concat(nodeIds);
		nodeIds.forEach(function(id) {
			var target = that._nodes.get(id); // search tree node map
			if (target) {
				that._decrementResourceCounters(target);
				that._nodes.delete(id);
			}
		});

		return this;
	};

	/**
	 * Delete array of nodes
	 *
	 * @param {any[]} nodeIds Array of ids of nodes to be deleted
	 * @param {any} sceneId The id of scene containing the nodes
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.remove = function(nodeIds, sceneId) {
		this._resetCurrentScene(sceneId);

		var that = this;

		nodeIds = [].concat(nodeIds);
		nodeIds.forEach(function(id) {
			var target = that._nodes.get(id); // search tree node map
			if (target) {
				that._decrementResourceCounters(target);
				if (target.parent) {
					// this may not have parent as application may removed it already
					// As application wants instance update on deletion, they can remove a node
					// before they get the confirmation from the server
					target.parent.remove(target);
				}
				that._nodes.delete(id);

				for (var i = 0; i < target.children.length; i++) {
					var child = target.children[i];
					if (child.userData && child.userData.treeNode && child.userData.treeNode.sid) {
						that.remove(child.userData.treeNode.sid, sceneId);
					}
				}
			}
		});

		return this;
	};

	/**
	 * Clean up unused materials and geometries
	 *
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.resourcesCleanUp = function() {
		var geoMap = this._geometries;
		geoMap.forEach(function(geo) {
			var geoCount = geo.userData.geometryUsed;
			if (geoCount <= 0) {
				geo.dispose();
			}
		});
		return this;
	};

	/**
	 * Create a three.js camera from camera information
	 *
	 * @param {any} cameraInfo The object of camera information that have the following properties<br/>
	 *								<code>id</code>: string, id of this camera<br/>
	 *								<code>origin</code>: [ float, x, y, z ]<br/>
	 *								<code>target</code>: [ float, x, y, z relative to origin ]<br/>
	 *								<code>up</code>: [ float, x, y, z relative to origin ]<br/>
	 *								<code>ortho</code>: bool,  true - orthographic, false - perspective<br/>
	 *								<code>zoom</code>: float, zoom<br/>
	 *								<code>aspect</code>: float, aspect ratio<br/>
	 *								<code>near</code>: float, near Z plane, negative value for auto-evaluate<br/>
	 *								<code>far</code>: float, far Z plane, negative value for auto-evaluate<br/>
	 *								<code>fov</code>: float, field of view<br/>
	 *
	 * @param {any} sceneId The id of scene containing the nodes
	 *
	 * @returns {THREE.OrthographicCamera|THREE.PerspectiveCamera} The created three.js camera
	 * @public
	 */
	SceneBuilder.prototype.createCamera = function(cameraInfo, sceneId) {
		this._resetCurrentScene(sceneId);

		var nativeCamera;
		if (cameraInfo.ortho) {
			nativeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, cameraInfo.near, cameraInfo.far);
		} else {
			nativeCamera = new THREE.PerspectiveCamera(cameraInfo.fov * 180 / Math.PI, 1, cameraInfo.near, cameraInfo.far);
		}

		// update position and up
		if (cameraInfo.origin) {
			var origin = new THREE.Vector3().fromArray(cameraInfo.origin);
			nativeCamera.position.copy(origin);
		}

		if (cameraInfo.up) {
			var up = new THREE.Vector3().fromArray(cameraInfo.up);
			if (cameraInfo.notUseDirectionVector) {
				up.sub(nativeCamera.position);
			}
			nativeCamera.up.copy(up.normalize());
		}

		// update target
		if (cameraInfo.target) {
			if (cameraInfo.notUseDirectionVector) {
				nativeCamera.lookAt(new THREE.Vector3().fromArray(cameraInfo.target));
			} else {
				nativeCamera.lookAt((new THREE.Vector3().fromArray(cameraInfo.target)).add(nativeCamera.position));
			}
		}

		if (cameraInfo.ortho) {
			nativeCamera.zoom = cameraInfo.zoom || 0.02;
		}

		this._rootNode.userData.camera = nativeCamera;
		// this._cameras.set(info.cameraRef, camera);
		var camera = null;
		if (nativeCamera.isOrthographicCamera) {
			camera = new OrthographicCamera();
		} else if (nativeCamera.isPerspectiveCamera) {
			camera = new PerspectiveCamera();
		}
		camera.setCameraRef(nativeCamera);

		camera.setUsingDefaultClipPlanes(true); // always use auto as specific near far always cause trouble

		if (cameraInfo.zoom === -1) {
			camera.setZoomNeedRecalculate(true);
		}

		var camId = cameraInfo.id;
		if (camId) {
			this._cameras.set(camId, camera);
		}
		this._rootNode.userData.camera = camera;
		return camera;
	};

	/**
	 * Attach camera to a node
	 *
	 * @param {any} nodeId The id of node in the scene tree
	 * @param {any} cameraId The id of camera
	 * @param {any} sceneId The id of scene containing the node
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.insertCamera = function(nodeId, cameraId, sceneId) {
		this._resetCurrentScene(sceneId);
		var node = this._nodes.get(nodeId);
		var camera = this._cameras.get(cameraId);
		if (node && camera) {
			(node || this._rootNode).add(camera.parent ? camera.clone() : camera);
		}
		return this;
	};

	/**
	 * Get three.js camera from camera Id
	 *
	 * @param {any} cameraId The ID of camera
	 * @returns {THREE.OrthographicCamera|THREE.PerspectiveCamera} The created three.js camera
	 * @public
	 */
	SceneBuilder.prototype.getCamera = function(cameraId) {
		return this._cameras.get(cameraId);
	};

	/**
	 * Make three.js material double-sided if geometry does not have normal defined
	 *
	 * @param {any} materialId The id of material
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.updateMaterialForGeometryWithoutNormal = function(materialId) {
		var material = this._getMaterialRef(materialId);
		if (material && material.emissive) {
			material.emissive.copy(material.color);
			material.side = THREE.DoubleSide;
		}
		return this;
	};

	/**
	 * Create a three.js material from material information
	 *
	 * @param {any} materialInfo The object of material information that have the following properties<br/>
	 *								<code>id</code>: string, id of this element<br/>
									<code>name</code>: material name<br/>
									<code>ambientColour</code>: [array of floats describing RGBA values, defaults to 0, 0, 0, 0, optional]<br/>
									<code>diffuseColour</code>: [array of floats describing RGBA values, defaults to 0, 0, 0, 0, optional]<br/>
									<code>specularColour</code>: [array of floats describing RGBA values, defaults to 0, 0, 0, 0, optional]<br/>
									<code>emissiveColour</code>: [array of floats describing RGBA values, defaults to 0, 0, 0, 0, optional]<br/>
									<code>opacity</code>: float, opacity, defaults to 0, optional<br/>
									<code>glossiness</code>: float, glossiness, defaults to 0, optional<br/>
									<code>specularLevel</code>: float, specular level, defaults to 0, optional<br/>
									<code>colourMapEnabled</code>: boolean, affects modulation of some colours in material shader, defaults to false, optional<br/>
									<code>lineDashPattern</code>: [ array of floats of dash pattern, optional]<br/>
									<code>lineDashPatternScale</code> : line's dash pattern segment scale, defaults to 0, optional<br/>
									<code>lineColour</code>: [array of floats describing RGBA values, defaults to 0, 0, 0, 0, optional]<br/>
									<code>lineWidth</code>: float, line's width, defaults to 0, optional<br/>
									<code>lineHaloWidth</code>
									<code>lineEndCapStyle</code>
									<code>lineWidthCoordinateSpace</code>
									<code>textureDiffuse</code>:<br/>
									<code>textureBump</code>:<br/>
									<code>textureOpacity</code>:<br/>
									<code>textureReflection</code>:<br/>
									<code>textureRefraction</code>:<br/>
									<code>textureSpecular</code>:<br/>
									<code>textureAmbient</code>:<br/>
									<code>textureEmissive</code>:<br/>
									<code>textureSpecularLevel</code>:<br/>
									<code>textureGlossiness</code>:<br/>
									<code>textureAmbientOcclusion</code>:<br/>
									<code>textureDecal</code>:<br>
											<code>imageId</code>: string - images session id, optional<br/>
											<code>uvChannelIndex</code>: uint32 - the Uv channel index<br/>
											<code>filterMode</code>: uint32: Bilinear=0, NearestNeighbour=1<br/>
											<code>influence</code>: float  - the influence<br/>
											<code>uvRotationAngle</code>: float - the Uv rotation angle<br/>
											<code>uvHorizontalOffset</code>: float - the Uv horizontal offset<br/>
											<code>uvVerticalOffset</code>: float - the Uv vertical offset<br/>
											<code>uvHorizontalScale</code>: float - the Uv horizontal scale<br/>
											<code>uvVerticalScale</code>: float - the Uv vertical scale<br/>
											<code>uvHorizontalTilingEnabled</code>: boolean - if the Uv horizontal tiling enabled<br/>
											<code>uvVerticalTilingEnabled</code>: boolean - if the Uv vertical tiling enabled<br/>
											<code>uvClampToBordersEnabled</code>: boolean - if the Uv clamp-to-borders enabled<br/>
											<code>inverted</code>: boolean  - if inverted flag is set<br/>
											<code>modulate</code>: boolean - false --> replace, true --> modulate<br/>
											<code>colourMap</code>: boolean - false --> map, true --> do not map<br/>
	 *
	 * @returns {any[]} Array of result objects, and each result contains two properties on an associated texture<br/>
	 * 						  <code>textureType</code>: type of texture to be updated<br/>
							  <code>imageId</code>: id of associated image that has not been created<br/>
	 * @public
	 */
	SceneBuilder.prototype.createMaterial = function(materialInfo) {

		var texturesToLoad = [];
		var materialId = materialInfo.id;
		var material = this._getMaterialRef(materialId);

		if (materialInfo.lineWidth > 0) {
			if (!material || !material.isLineBasicMaterial) {
				material = new THREE.LineBasicMaterial();
				var vkMaterial = new Material(true);
				vkMaterial.setMaterialRef(material);
				this._vkScene.setMaterial(materialId, vkMaterial);
			}

			material.color = new THREE.Color(materialInfo.lineColour[ 0 ], materialInfo.lineColour[ 1 ], materialInfo.lineColour[ 2 ]);
			material.linewidth = materialInfo.lineWidth;
			material.userData.lineStyle = {
				width: materialInfo.lineWidth,
				haloWidth: materialInfo.lineHaloWidth || 0,
				endCapStyle: materialInfo.lineEndRound ? 1 : 0,
				dashPattern: materialInfo.lineDashPattern || [],
				dashPatternScale: materialInfo.lineDashPatternScale,
				widthCoordinateSpace: materialInfo.lineWidthCoordinateSpace
			};
			material.userData.materialInfo = materialInfo;
			material.userData.materialId = materialId;
			return texturesToLoad;
		}

		if (!material) {
			material = this._createTemporaryMaterial(materialId);
		}

		delete material.userData.toBeUpdated;

		material.userData.materialInfo = materialInfo;

		if (materialInfo.diffuseColour) {
			material.color.fromArray(materialInfo.diffuseColour);
		}

		if (materialInfo.specularColour) {
			material.specular.fromArray(materialInfo.specularColour);
		}

		var useAmbientColour = true;
		if (materialInfo.emissiveColour) {
			material.emissive.fromArray(materialInfo.emissiveColour);
			if (material.emissive.r !== 0 || material.emissive.g !== 0 || material.emissive.b !== 0) {
				useAmbientColour = false;
			}
		}

		if (useAmbientColour && materialInfo.ambientColour) { // no ambient colour in three js. use emissive for now
			material.emissive.fromArray(materialInfo.ambientColour);
			material.emissive.multiplyScalar(0.2); // vds cuts ambient colour to 0.2 before rendering
		}

		if (material.opacity !== undefined) {
			material.opacity = materialInfo.opacity;
			material.transparent = materialInfo.opacity < 0.99;
			if (material.transparent) {
				material.side = THREE.DoubleSide;
			}
		}

		var glossiness = material.glossiness ? material.glossiness : 0;
		var specularLevel = material.specularLevel ? material.specularLevel : 0;

		// Empirical approximation of shininess based on glosiness and specular level
		material.shininess = glossiness * 2 + specularLevel * 3;

		material.userData.defaultHighlightingEmissive = DefaultHighlightingEmissive;
		material.userData.defaultHighlightingSpecular = DefaultHighlightingSpecular;

		texturesToLoad = this.updateTextureMaps(materialId);
		if (texturesToLoad.length > 0) {
			material.userData.imageIdsToLoad = new Set();

			for (var ti = 0; ti < texturesToLoad.length; ti++) {
				var textureInfo = texturesToLoad[ ti ];
				TotaraUtils.pushElementIntoMapArray(this._imageTextures, textureInfo.imageId, { textureType: textureInfo.textureType, materialId: materialId });
				material.userData.imageIdsToLoad.add(textureInfo.imageId);
			}
		}

		var meshIds = this._materialMeshes.get(materialId);
		if (meshIds) {
			for (var mi = 0; mi < meshIds.length; mi++) {
				var meshId = meshIds[ mi ];
				var nodes = this._meshNodes.get(meshId);
				if (nodes) {
					for (var ni = 0; ni < nodes.length; ni++) {
						replaceMaterial(nodes[ni], materialId, material, this._materialClones);
					}
				}
			}
		}

		return texturesToLoad;
	};

	/**
	 * Get three.js material
	 *
	 * @param {any} materialId The id of material
	 * @returns {THREE.Material} three.js material.
	 * @public
	 */
	SceneBuilder.prototype.getMaterial = function(materialId) {
		return this._getMaterialRef(materialId);
	};

	var uint8ArrayToString = function(uint8Array) {

		var finalString = "";
		try {
			// if uint8Array is too long, stack runsout in String.fromCharCode.apply
			// so batch it in certain size
			var CHUNK_SIZE = 0x8000; // arbitrary number here, not too small, not too big
			var index = 0;
			var length = uint8Array.length;
			var slice;
			while (index < length) {
				slice = uint8Array.slice(index, Math.min(index + CHUNK_SIZE, length)); // `Math.min` is not really necessary here I think
				finalString += String.fromCharCode.apply(null, slice);
				index += CHUNK_SIZE;
			}
		} catch (e) {
			finalString = "";
			// console.log(e);
		}
		return finalString;
	};

	/**
	 * Create a three.js image from image information
	 *
	 * @param {any} imageInfo The object of image information that have the following properties<br/>
	 *								  <code>id</code>: string, id of this image</br>
	 *								  <code>binaryData</code>: binary image data</br>
	 *
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.createImage = function(imageInfo) {

		var dv = new DataView(imageInfo.binaryData.buffer);

		var isPng = true;
		// rest is image blob
		// check jpeg magic number
		if (dv.getUint8(0, true) === parseInt("0xFF", 16) &&
			dv.getUint8(1, true) === parseInt("0xD8", 16)) {
			// you must be jpg.
			isPng = false; // currently we only support jpg and png
		}

		var imageDataStr = uint8ArrayToString(imageInfo.binaryData);

		var dataUri = "data:image/" + (isPng ? "png" : "jpeg") + ";base64," + btoa(imageDataStr);

		this._images.set(imageInfo.id, dataUri);

		var textures = this._imageTextures.get(imageInfo.id);
		if (textures) {
			this._imageTextures.delete(imageInfo.id);
			for (var i = 0; i < textures.length; i++) {
				var texture = textures[ i ];
				this.updateTextureMap(texture.materialId, texture.textureType);
			}
		}

		return this;
	};

	var textureLoader = new THREE.TextureLoader();

	SceneBuilder.TextureType = {
		Diffuse: 0,
		Bump: 1,
		Opacity: 2,
		Reflection: 3,
		Refraction: 4,
		Specular: 5,
		Ambient: 6,
		Emissive: 7,
		SpecularLevel: 8,
		Glosiness: 9,
		AmbientOcclusion: 10,
		Decal: 11
	};

	/**
	 * Update all textures defined in a material
	 *
	 * @param {any} materialId id of material
	 * @returns {any[]} Array of result objects, and each result contains two properties on a texture<br/>
	 * 						  <code>textureType</code>: type of texture to be updated<br/>
							  <code>imageId</code>: id of associated image that has not been created<br/>
	 * @public
	 */
	SceneBuilder.prototype.updateTextureMaps = function(materialId) {
		var result = [];

		var material = this._getMaterialRef(materialId);
		if (!material) {
			return result;
		}

		var materialInfo = material.userData.materialInfo;
		if (!materialInfo) {
			return result;
		}

		if (materialInfo.textureDiffuse) {
			var diffuseRes = this.updateTextureMap(materialId, SceneBuilder.TextureType.Diffuse);
			if (diffuseRes.imageId) {
				result.push(diffuseRes);
			}
		}

		if (materialInfo.textureBump) {
			var bumpRes = this.updateTextureMap(materialId, SceneBuilder.TextureType.Bump);
			if (bumpRes.imageId) {
				result.push(bumpRes);
			}
		}

		if (materialInfo.textureOpacity) {
			var opacityRes = this.updateTextureMap(materialId,  SceneBuilder.TextureType.Opacity);
			if (opacityRes.imageId) {
				result.push(opacityRes);
			}
		}

		if (materialInfo.textureEmissive) {
			var emissiveRes = this.updateTextureMap(materialId, SceneBuilder.TextureType.Emissive);
			if (emissiveRes.imageId) {
				result.push(emissiveRes);
			}
		}

		if (materialInfo.textureAmbientOcclusion) {
			var aoRes = this.updateTextureMap(materialId, SceneBuilder.TextureType.AmbientOcclusion);
			if (aoRes.imageId) {
				result.push(aoRes);
			}
		}

		if (materialInfo.textureReflection) {
			var reflectionRes = this.updateTextureMap(materialId, SceneBuilder.TextureType.Reflection);
			if (reflectionRes.imageId) {
				result.push(reflectionRes);
			}
		}

		return result;
	};

	/**
	 * Update a texture defined in a material
	 *
	 * @param {any} materialId id of material
	 * @param {any} type Texture type
	 * @returns {any[]} The result object contains two properties on the texture<br/>
	 * 						  <code>textureType</code>: type of texture to be updated<br/>
							  <code>imageId</code>: id of associated image that has not been created<br/>
	 * @public
	 */
	SceneBuilder.prototype.updateTextureMap = function(materialId, type) {
		var result = {
			textureType: type,
			imageId: null
		};

		var material = this._getMaterialRef(materialId);
		if (!material) {
			return result;
		}

		var materialInfo = material.userData.materialInfo;
		if (!materialInfo) {
			return result;
		}

		var infos = null;

		switch (type) {
			case SceneBuilder.TextureType.Diffuse:
				infos = materialInfo.textureDiffuse;
				break;

			case SceneBuilder.TextureType.Bump:
				infos = materialInfo.textureBump;
				break;

			case SceneBuilder.TextureType.Opacity:
				infos = materialInfo.textureOpacity;
				break;

			case SceneBuilder.TextureType.Reflection:
				infos = materialInfo.textureReflection;
				break;

			case SceneBuilder.TextureType.Emissive:
				infos = materialInfo.textureEmissive;
				break;

			case SceneBuilder.TextureType.AmbientOcclusion:
				infos = materialInfo.textureAmbientOcclusion;
				break;
			default:
				break;
		}

		if (!infos) {
			return result;
		}

		var info = infos[0];
		if (!info) {
			info = infos;
		}
		var imageDataUri = this._images.get(info.imageId);

		if (!imageDataUri) {
			result.imageId = info.imageId;
			return result;
		}

		var texture = textureLoader.load(imageDataUri, this._fireSceneUpdated);

		texture.wrapS = info.uvHorizontalTilingEnabled ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
		texture.wrapT = info.uvVerticalTilingEnabled ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
		texture.magFilter = info.filterMode === 1 ? THREE.NearestFilter : THREE.LinearFilter;
		texture.minFilter = info.filterMode === 1 ? THREE.NearestFilter : THREE.LinearMipMapLinearFilter;
		texture.anisotropy = 4;

		var influence = info.influence !== undefined ? info.influence : 0;

		var repeatS = info.uvHorizontalScale !== undefined ? info.uvHorizontalScale : 1;
		var repeatT = info.uvVerticalScale !== undefined ? info.uvVerticalScale : 1;
		var offsetS = info.uvHorizontalOffset !== undefined ? info.uvHorizontalOffset : 0;
		var offsetT = info.uvVerticalOffset !== undefined ? info.uvVerticalOffset : 0;
		texture.repeat.set(repeatS, repeatT);
		texture.center.set(-offsetS, -offsetT);
		texture.offset.set(offsetS, offsetT);
		texture.rotation = -info.uvRotationAngle;

		switch (type) {
			case SceneBuilder.TextureType.Diffuse:
				// If map influence is 0 then color will not be changed but if influence is 1 then color will be white which means use 100% texture
				// Interpolate all intermediate values.
				// Turn off influence for diffuse map, needs further investigation
				// material.color.lerp(new THREE.Color(1.0, 1.0, 1.0), influence);

				material.map = texture;
				// assume it has alpha channel if it is png
				material.transparent |= imageDataUri.startsWith("data:image/png");
				break;

			case SceneBuilder.TextureType.Bump:
				material.bumpMap = texture;
				material.bumpScale = influence;
				break;

			case SceneBuilder.TextureType.Opacity:
				material.alphaMap = texture;
				break;

			case SceneBuilder.TextureType.Reflection:
				texture.mapping = THREE.SphericalReflectionMapping;
				material.envMap = texture;
				material.combine = THREE.AddOperation;
				material.reflectivity = influence;
				break;

			case SceneBuilder.TextureType.Emissive:
				material.emissiveMap = texture;
				material.emissive.setRGB(1, 1, 1);
				break;

			case SceneBuilder.TextureType.AmbientOcclusion:
				material.aoMap = texture;
				break;

			default:
				// console.log("Not implemented map type " + type);
		}

		material.userData.textureAdded = true;
		material.needsUpdate = true;

		if (material.userData.imageIdsToLoad) {
			material.userData.imageIdsToLoad.delete(info.imageId);
			if (material.userData.imageIdsToLoad.size === 0) {
				delete material.userData.imageIdsToLoad;
			}
		}

		var materialClones = this._materialClones.get(materialId);
		if (materialClones) {
			materialClones.forEach(function(materialClone) {
				// console.log("update material clone", materialId, materialClone, material);
				materialClone.copy(material);
				materialClone.needsUpdate = true; // THREE.Material.copy() does not copy this flag
			});
		}

		return result;
	};

	/**
	 * Insert playback data
	 *
	 * @param {any} playbackInfo The object of playback information that have the following properties<br/>
	 *								  <code>sequenceId</code>: string, id of corresponding sequence</br>
	 *								  <code>playbackSpeed</code>: float, corresponding to time scale in threejs AnimationAction</br>
	 *								  <code>playbackPreDelay</code>: float, time of delay before playing animation</br>
	 *								  <code>playbackPostDelay</code>: float, time of delay after playing animation</br>
	 *								  <code>playbackRepeat</code>: int, number of repeats of animation</br>
	 *								  <code>playbackReversed</code>: bool, if track should be reversed</br>
	 *
	 * @param {string} viewId Id of view to which playback belongs to
	 *
	 * @param {string} sceneId Id of scene
	 *
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.insertPlayback = function(playbackInfo, viewId, sceneId) {
		this._resetCurrentScene(sceneId);
		var sequence = this._vkScene.findSequence(playbackInfo.sequenceId);
		var playback = new AnimationPlayback(playbackInfo.id, {
							sequence: sequence,
							timeScale: playbackInfo.speed ? 1.0 / playbackInfo.speed : 1,
							preDelay: playbackInfo.preDelay ? playbackInfo.preDelay : 0,
							postDelay: playbackInfo.postDelay ? playbackInfo.postDelay : 0,
							repeats: playbackInfo.repeat ? Math.abs(playbackInfo.repeat) : 0,
							reversed: playbackInfo.reversed ? true : false,
							startTime: playbackInfo.start ? playbackInfo.start : 0
						});
		var view = this._views.get(viewId);
		if (view) {
			view.addPlayback(playback);
		}

		if (!sequence) {
			TotaraUtils.pushElementIntoMapArray(this._sequenceIdToPlaybacks, playbackInfo.sequenceId, playback);
		}

		return this;
	};

	/**
	 * Insert sequence data
	 *
	 * @param {any} info The object of sequence information
	 * @param {string} sceneId Id of scene
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.insertSequence = function(info, sceneId) {
		var duration;
		if (info.endTime) {
			duration = info.endTime;
		} else {
			duration = 1.0;
		}
		var sequence = this._vkScene.createSequence(info.id, {
			name: info.name,
			duration: duration
		});

		if (Array.isArray(info.joints)) {
			info.joints.forEach(function(index) {
				var joint = this._joints[index];
				if (joint && joint.node && joint.parent) {
					sequence.setJoint(joint);
				}
			}.bind(this));
		}

		if (info.nodes && info.nodes.length > 0) {
			for (var ni = 0; ni < info.nodes.length; ni++) {
				var track = info.nodes[ni];
				TotaraUtils.pushElementIntoMapArray(this._trackIdSequenceNodeMap, track.trackId,
					{ sequenceId: info.id, targetId: track.sid, type: track.binding, pivot: track.pivot });
			}
		}

		var playbacks = this._sequenceIdToPlaybacks.get(info.id);
		if (playbacks) {
			playbacks.forEach(function(playback) {
				playback.setSequence(sequence);
			});
		}

		return this;
	};

	/**
	 * Insert track data
	 *
	 * @param {any[]} tracks array of the object of track information
	 *
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.insertTracks = function(tracks) {

		this._animationHelper.insertTracks(tracks, this._trackIdSequenceNodeMap, this._nodes, this._vkScene);

		return this;
	};

	/**
	 * Insert joint data
	 *
	 * @param {any[]} joints array of the object of joint information
	 * @param {string} sceneId Id of scene
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.insertJoints = function(joints, sceneId) {
		this._resetCurrentScene(sceneId);

		this._joints = [];
		joints.forEach(function(joint) {
			this._joints.push({
				id: joint.id,
				node: this._nodes.get(joint.childSid),
				parent: this._nodes.get(joint.parentSid),
				translation: new Float32Array(joint.t ? joint.t : [ 0, 0, 0 ]),
				quaternion: new Float32Array(joint.q ? joint.q : [ 0, 0, 0, 1 ]),
				scale: new Float32Array(joint.s ? joint.s : [ 1, 1, 1 ])
			});
		}.bind(this));

		return this;
	};

	/**
	 * Finalize animation clip data, should be called after all track data have been read
	 *
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.finalizeAnimation = function() {
		var topNode = this._rootNode;
		if (topNode) {
			while (topNode.parent) {
				topNode = topNode.parent;
			}
			if (!topNode.userData) {
				topNode.userData = {};
			}
			topNode.userData.tracks = this._tracks;
		}

		return this;
	};

	/**
	 * Finalize playback data, should be called after all track data have been read
	 *
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.finalizePlaybacks = function() {
		var topNode = this._rootNode;
		if (topNode) {
			while (topNode.parent) {
				topNode = topNode.parent;
			}
			if (!topNode.userData) {
				topNode.userData = {};
			}
		} else {
			return this;
		}

		if (!topNode.userData.animationNodeOriginalData) {
			topNode.userData.animationNodeOriginalData = new Map();
		}

		var viewGroup;
		var values = this._viewGroups.entries();
		var next = values.next();

		while (!next.done) {
			viewGroup = next.value[1];
			next = values.next();
			var viewsInGroup = [];
			for (var vi = 0; vi < viewGroup.getViews().length; vi++) {
				if (viewGroup.getViews()[vi].id) {
					var view = this._views.get(viewGroup.getViews()[vi].id);
					if (view) {
						viewsInGroup.push(view);
					}
				}
			}
		}
		return this;
	};

	 /**
	 * Finalize view group data, should be called after all views are read
	 *
	 * @param {string} sceneId Id of scene
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.finalizeViewGroups = function(sceneId) {
		this._resetCurrentScene(sceneId);

		var entries = this._viewGroups.entries();
		var next = entries.next();
		while (!next.done) {
			var viewGroup = next.value[1];
			var viewGroupId = next.value[0];
			if (!viewGroup || !viewGroup.views || !viewGroup.views.length) {
				next = entries.next();
				continue;
			}

			viewGroup.removeViews();
			for (var vi = 0; vi < viewGroup.views.length; vi++) {
				var viewId = viewGroup.views[vi].id;
				var view = this._views.get(viewId);
				if (view && view.userData.viewInfo.thumbnailId && !view.thumbnailData) {
					var imageData = this._images.get(view.userData.viewInfo.thumbnailId);
					if (imageData) {
						view.thumbnailData = imageData;
					}
				}
				if (view) {
					view.viewGroupId = viewGroupId;
					viewGroup.addView(view);
				}
			}
			next = entries.next();
		}
		return this;
	};

	/**
	 * Insert a view group
	 *
	 * @param {any} info view group information
	 * @param {any} sceneId The id of scene containing the node
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.insertViewGroup = function(info, sceneId) {
		this._resetCurrentScene(sceneId);

		var viewGroup = this._viewGroups.get(info.id);

		if (!viewGroup) {
			viewGroup = this._vkScene.createViewGroup({
				viewGroupId: info.id,
				name: info.name,
				description: info.description
			});
			this._viewGroups.set(info.id, viewGroup);
		} else {
			viewGroup.setViewGroupId(info.id);
			viewGroup.setName(info.name);
			viewGroup.setDescription(info.description);
		}

		viewGroup.type = info.type;
		viewGroup.metadata = info.metadata;
		viewGroup.veids = info.veids;
		viewGroup.views = info.views;
		viewGroup.sceneId = info.sceneId;

		return this;
	};

	/**
	 * get a view group - array of views
	 *
	 * @param {any} viewGroupId view group information
	 * @param {any} sceneId The id of scene containing the node
	 * @returns {sap.ui.vk.view[]} array of views.
	 * @public
	 */
	SceneBuilder.prototype.getViewGroup = function(viewGroupId, sceneId) {
		this._resetCurrentScene(sceneId);
		var viewGroup = this._viewGroups.get(viewGroupId);
		var views = [];
		if (viewGroup && viewGroup.views) {
			for (var vi = 0; vi < viewGroup.views.length; vi++) {
				var viewId = viewGroup.views[vi].id;
				var view = this._views.get(viewId);
				if (view) {
					views.push(view);
				}
			}
		}

		return views;
	};

	/**
	 * Insert a view
	 *
	 * @param {any} viewInfo View information
	 * @param {any} sceneId The scene identifier
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.insertView = function(viewInfo, sceneId) {
		this._resetCurrentScene(sceneId);

		if (viewInfo.description){
			var reg = new RegExp("^<[^>]*?>"); // matches <> tag at start of description
			if (reg.test(viewInfo.description)){
				var reg2 = new RegExp("(^(<[^>]*?>\s*)+)|((<[^>]*?>\s*)+$)", "g"); // matches all <> tags at start and end of description
				var temporaryDescription = viewInfo.description.replace(reg2, "");
				if (!temporaryDescription){
					viewInfo.description = temporaryDescription;
				}
			}
		}

		var view = this._vkScene.createView({
			viewId: viewInfo.viewId,
			name: viewInfo.name,
			description: viewInfo.description ? "<pre style=\"white-space: pre-wrap;\">" + viewInfo.description + "</pre>" : viewInfo.description // Currently this is plain text so we preserve it's formatting (line breaks)
		});

		view.userData = {};
		view.userData.viewInfo = viewInfo;

		if (viewInfo.thumbnailId) {
			var imageData = this._images.get(viewInfo.thumbnailId);
			if (imageData) {
				view.thumbnailData = imageData;
			} else {
				this._viewThumbnails.set(viewInfo.thumbnailId, view);
			}
		}

		if (viewInfo.animatedThumbnailId){
			var imageData2 = this._images.get(viewInfo.animatedThumbnailId);
			if (imageData2) {
				view.animatedThumbnailData = imageData2;
				view.tileWidth = this._imageIdsAndTileWidths.get(viewInfo.animatedThumbnailId);
			}
		}
		if (viewInfo.cameraId) {
			view.setCamera(this._cameras.get(viewInfo.cameraId));
		}
		view.type = viewInfo.type;
		view.flyToTime = viewInfo.flyToTime;
		view.preDelay = viewInfo.preDelay;
		view.postDelay = viewInfo.postDelay;
		view.navigationMode = viewInfo.navigationMode;
		view.topColor = viewInfo.topColor;
		view.bottomColor = viewInfo.bottomColor;
		view.renderMode = renderModes[viewInfo.renderMethod];
		view.dimension = viewInfo.dimension;
		view.query = viewInfo.query;
		view.metadata = viewInfo.metadata;
		view.veids = viewInfo.veids;

		view.viewGroupId = viewInfo.viewGroupId;
		view.id = viewInfo.viewId;

		this._views.set(viewInfo.viewId, view);

		if (view.viewGroupId) {
			var viewGroup = this._viewGroups.get(view.viewGroupId);
			if (viewGroup) {
				viewGroup.addView(view);
			}
		}
		return this;
	};

	SceneBuilder.prototype.setModelViewVisibilitySet = function(info) {
		var view = this._views.get(info.viewId);
		var visibleNodeInfos = [];
		info.visibleNodes.forEach(function(nodeRef) {
			var node = this._nodes.get(nodeRef);
			if (node) {
				visibleNodeInfos.push({
					target: node,
					visible: true
				});
			} else {
				Log.warning("Unknown modelView visible node reference", nodeRef);
			}
		}.bind(this));

		view.updateNodeInfos(visibleNodeInfos);
	};

	/**
	 * Record a highlighted node
	 *
	 * @param {any} highlightStyleId id of highlight style
	 * @param {any} nodeId id of node
	 * @param {any} viewId id of view
	 * @param {any} sceneId The scene identifier
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.recordHighlightedNodeInView = function(highlightStyleId, nodeId, viewId, sceneId) {
		this._resetCurrentScene(sceneId);
		var view = this._views.get(viewId);
		if (!view) {
			return this;
		}

		var node = this._nodes.get(nodeId);
		if (!node) {
			return this;
		}
		view.addHighlightedNodes(highlightStyleId, node);

		return this;
	};

	/**
	 * Insert highlight styles
	 *
	 * @param {any} info information of the highlight style
	 *
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.insertHighlightStyle = function(info) {
		var highlightStyle = this._vkScene.getHighlight(info.id);

		if (highlightStyle) {
			return this;
		}

		this._vkScene.createHighlight(info.id, info);

		return this;
	};

	SceneBuilder.prototype.insertModelViewHighlight = function(info) {
		var view = this._views.get(info.viewId);
		if (view) {
			var highlightNodes = [];
			info.highlightNodes.forEach(function(nodeId) {
				var node = this._nodes.get(nodeId);
				if (node) {
					highlightNodes.push(node);
				} else {
					// console.warn("Unknown node reference", nodeRef, this._nodes);
				}
			}.bind(this));

			var highlight = {
				duration: info.duration,
				cycles: info.cycles
			};

			if (!info.id) {
				info.id = THREE.Math.generateUUID().toLowerCase();
			}

			var color1 = new THREE.Color(info.color1).toArray();
			var color2 = new THREE.Color(info.color2).toArray();
			color1[3] = ((info.color1 >>> 24) & 255) / 255; // highlighting intensity
			color2[3] = ((info.color2 >>> 24) & 255) / 255; // highlighting intensity
			highlight.colours = [ color1, color2 ];
			highlight.opacities = [ info.opacity1, info.opacity2 ];
			this._vkScene.createHighlight(info.id, highlight);
			view.addHighlightedNodes(info.id, highlightNodes);
		}
	};

	SceneBuilder.prototype.createThumbnail = function(info) {
		var view = this._viewThumbnails.get(info.imageId);
		if (view) {
			view.thumbnailData = "data:image/" + "jpeg" + ";base64," + window.btoa(String.fromCharCode.apply(null, info.data));
			if (this._fireThumbnailLoaded) {
				this._fireThumbnailLoaded({ modelView: view });
			}
		}
	};

	/**
	 * Insert highlight styles
	 *
	 * @param {any} id id of the highlight style
	 *
	 * @returns {boolean} true if exists
	 * @public
	 */
	SceneBuilder.prototype.highlightStyleExists = function(id) {
		var highlightStyle = this._vkScene.getHighlight(id);
		return highlightStyle !== undefined;
	};

	/**
	 * get a view
	 *
	 * @param {any} viewId The id of view
	 * @param {any} sceneId The id of scene
	 * @returns {sap.ui.vk.view} View
	 * @public
	 */
	SceneBuilder.prototype.getView = function(viewId, sceneId) {
		this._resetCurrentScene(sceneId);
		return this._views.get(viewId);
	};

	/**
	 * get a sequence
	 *
	 * @param {any} sequenceId The id of sequence
	 * @returns {sap.ui.vk.animationSequence} View
	 * @public
	 */
	SceneBuilder.prototype.getSequence = function(sequenceId) {
		return this._vkScene.findSequence(sequenceId);
	};

	/**
	 * Add a camera to a view
	 *
	 * @param {any} cameraId The id of camera
	 * @param {any} viewId The id of view
	 * @param {any} sceneId The id of scene
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.setViewCamera = function(cameraId, viewId, sceneId) {
		this._resetCurrentScene(sceneId);
		var camera = this._cameras.get(cameraId);
		var view = this._views.get(viewId);

		if (camera && view) {
			view.setCamera(camera);
		}

		return this;
	};

	/**
	 * Add an array of node infos to a view
	 *
	 * @param {any} nodeInfos array of node info
	 * @param {any} viewId The id of view
	 * @param {any} sceneId The id of scene
	 * @returns {sap.ui.vk.threejs.SceneBuilder} <code>this</code> to allow method chaining.
	 * @public
	 */
	SceneBuilder.prototype.setViewNodeInfos = function(nodeInfos, viewId, sceneId) {
		this._resetCurrentScene(sceneId);
		var view = this._views.get(viewId);
		view.setNodeInfos(nodeInfos);

		return this;
	};

	/**
	 * Add thumbnail image data to view
	 *
	 * @param {any} imageId The id of image data
	 * @param {any} viewId The id of view
	 * @param {any} sceneId The id of scene containing the node
	 * @param {any} tileWidth The width of each individual frame of an animated thumbnail
	 * @returns {sap.ui.vk.view} View
	 * @public
	 */
	SceneBuilder.prototype.setViewThumbnail = function(imageId, viewId, sceneId, tileWidth){
		this._resetCurrentScene(sceneId);
		var view = this._views.get(viewId);
		var imageData = this._images.get(imageId);
		if (view && imageData) {
			if (view.userData !== undefined){
				if (view.userData.viewInfo.thumbnailId === imageId) {
						view.thumbnailData = imageData;
				} else if (view.userData.viewInfo.animatedThumbnailId === imageId){
						view.animatedThumbnailData = imageData;
						view.tileWidth = tileWidth;
				}
			}
		}
		return this;
	};

	/**
	 * Clear all data stored in SceneBuilder
	 *
	 * @public
	 */
	SceneBuilder.prototype.cleanup = function() {
		this._rootNode = null;

		if (this._vkScene) {
			this._vkScene.clearMaterials();
		}

		this._callouts.clear();
		this._cameras.clear();
		this._images.clear();
		this._imageIdsAndTileWidths.clear();
		this._imageTextures.clear();
		this._geometries.clear();
		this._meshNodes.clear();
		this._meshSubmeshes.clear();
		this._geometryMeshes.clear();
		this._materialMeshes.clear();
		this._materialClones.clear();

		this._currentSceneId = null;

		if (this._nodes) {
			this._nodes.clear();
		}

		if (this._tracks) {
			this._tracks.clear();
		}
		if (this._trackIdSequenceNodeMap) {
			this._trackIdSequenceNodeMap.clear();
		}
		if (this._viewGroups) {
			this._viewGroups.clear();
		}
		if (this._views) {
			this._views.clear();
		}

		this._sceneIdTreeNodesMap.clear();
		this._sceneIdRootNodeMap.clear();
		this._sceneIdViewGroupMap.clear();
		this._sceneIdViewMap.clear();

		SceneBuilder._map.delete(this._id);
	};

	// The codes below are for reading animation data from vds file (matai.js), which is not incorporated with the existing codes for animation,
	// as we are in process of re-developping animation
	SceneBuilder.prototype.insertAnimationGroup = function(info) {

		var animationSequence = this._vkScene.findSequence(info.animationGroupRef.toString());
		if (!animationSequence){
			var duration;
			if (info.endTime) {
				if (!info.startTime) {
					info.startTime = 0;
				}
				duration = info.endTime - info.startTime;
			}
			animationSequence = this._vkScene.createSequence(info.animationGroupRef.toString(), {
				name: info.name,
				duration: duration
			});
			if (!animationSequence.userData){
				animationSequence.userData = {};
			}
			animationSequence.userData.animations = [];
		}

		if (info.modelViewRef) {
			var modelView = this._views.get(info.modelViewRef);
			if (modelView) {
				var sequence = this._vkScene.findSequence(info.animationGroupRef.toString());
				var playback = new AnimationPlayback({
					sequence: sequence,
					timeScale: info.playbackSpeed ? 1.0 / info.playbackSpeed : 1,
					preDelay: info.playbackPreDelay ? info.playbackPreDelay : 0,
					postDelay: info.playbackPostDelay ? info.playbackPostDelay : 0,
					repeat: info.playbackRepeat ? Math.abs(info.playbackRepeat) : 0,
					reversed: info.playbackReversed ? true : false,
					startTime: 0
				});

				modelView.addPlayback(playback);
			}
		}
	};

	SceneBuilder.prototype.insertAnimation = function(info) {
		var animation = this._animations.get(info.animationRef);
		if (!animation){
			animation = {};
			animation.type = info.animationType;
			animation.targetRefs = [];
			animation.targetPivots = [];
			animation.sequenceId = info.animationGroupRef.toString();
			animation.animationTracks = new Set();
			this._animations.set(info.animationRef, animation);
		}

		if (info.animationGroupRef) {
			var animationSequence = this._vkScene.findSequence(info.animationGroupRef.toString());
			if (!animationSequence.userData.animations.includes(info.animationRef)) {
				animationSequence.userData.animations.push(info.animationRef);
			}
		}
	};

	SceneBuilder.prototype.insertAnimationTarget = function(info) {
		var animation = this._animations.get(info.animationRef);
		if (animation) {
			if (!animation.targetRefs.includes(info.targetRef)){
				animation.targetRefs.push(info.targetRef);
				animation.targetPivots.push({ x: info.targetPivotX, y: info.targetPivotY, z: info.targetPivotZ });
			}
		}
	};

	SceneBuilder.prototype.insertAnimationTrack = function(info) {
		var animationTrack = this._animationTracks.get(info.animationTrackRef);
		var animationRef = info.animationRef;
		if (!animationTrack){
			delete info.animationRef;
			animationTrack = info;
			this._animationTracks.set(info.animationTrackRef, animationTrack);
		}

		if (!animationRef) {
			return;
		}

		var animation = this._animations.get(animationRef);
		if (!animation || !animation.sequenceId) {
			return;
		}

		if (animation.animationTracks.has(animationTrack.animationTrackRef)) {
			return;
		} else {
			animation.animationTracks.add(animationTrack.animationTrackRef);
		}

		var animationSequence = this._vkScene.findSequence(animation.sequenceId);

		if (!animationSequence) {
			return;
		}
		if (!animationSequence.userData) {
			animationSequence.userData = {};
		}

		if (!animationSequence.userData.tracks) {
			animationSequence.userData.tracks = [];
		}

		for (var ti = 0; animation.targetRefs && ti < animation.targetRefs.length; ti++) {
			var targetRef = animation.targetRefs[ti];
			var targetPivot = animation.targetPivots[ti];
			var node = this._nodes.get(targetRef);
			if (!node) {
				continue;
			}

			var pivot;
			if (targetPivot.x !== 0 || targetPivot.y !== 0 || targetPivot.z !== 0) {
				pivot = [ targetPivot.x, targetPivot.y, targetPivot.z ];
			}

			var type = [ "OPACITY", "COLOUR", "TRANSLATE", "SCALE", "ROTATE" ][ animationTrack.type ] || "";

			TotaraUtils.pushElementIntoMapArray(this._trackIdSequenceNodeMap, info.animationTrackRef,
				{ sequenceId: animation.sequenceId, targetId: targetRef, type: type, pivot: pivot });

			var track = {};
			track.times = Array.prototype.slice.call(animationTrack.times);
			track.values = Array.prototype.slice.call(animationTrack.values);
			track.id = info.animationTrackRef;
			track.cyclicInfo = {};
			track.cyclicInfo.cyclicStart = animationTrack.cyclicStart;
			track.cyclicInfo.cyclicEnd = animationTrack.cyclicEnd;
			var ki;

			if (animation.type === 0){
				if (animationTrack.dataType === 0) { // scalar
					if (animationTrack.values.length !== animationTrack.keyCount ||
						animationTrack.times.length !== animationTrack.keyCount){
						continue;
					}
					if (animationTrack.type === 3) {// scale
						track.values = [];
						for (ki = 0; ki < animationTrack.keyCount; ki++){
							track.values.push(animationTrack.values[ki]);
							track.values.push(animationTrack.values[ki]);
							track.values.push(animationTrack.values[ki]);
						}
					}
				} else if (animationTrack.dataType === 1 || animationTrack.dataType === 3) {

					if (animationTrack.values.length !== 3 * animationTrack.keyCount ||
						animationTrack.times.length !== animationTrack.keyCount){
						continue;
					}

				} else if (animationTrack.dataType === 4 || animationTrack.dataType === 5 || animationTrack.dataType === 6) {

					if (animationTrack.values.length !== 4 * animationTrack.keyCount ||
						animationTrack.times.length !== animationTrack.keyCount){
						continue;
					}

					if (animationTrack.dataType === 4) {
						track.rotateType = AnimationRotateType.AngleAxis;
					} else if (animationTrack.dataType === 6) {
						track.rotateType = AnimationRotateType.Euler;
					} else {
						track.rotateType = AnimationRotateType.Quaternion;
						// to be consistent with quaternion defined in three.js
						for (var vi = 3; vi < track.values.length; vi = vi + 4) {
							track.values[vi] = -track.values[vi];
						}
					}
				}
			}
			animationSequence.userData.tracks.push(track);
		}
	};

	SceneBuilder.prototype.setAnimationTracks = function(animationRef) {
		var animation = this._animations.get(animationRef);
		if (!animation || !animation.sequenceId) {
			return;
		}
		var animationSequence = this._vkScene.findSequence(animation.sequenceId);

		if (animationSequence) {
			if (animationSequence.userData && animationSequence.userData.tracks) {
				this._animationHelper.insertTracks(animationSequence.userData.tracks,
						this._trackIdSequenceNodeMap, this._nodes, this._vkScene);
			}
		}
	};

	SceneBuilder.prototype.setAnimationPlaybacks = function(info) {

		var viewGroup = this._viewGroups.get(info.viewGroupId);


		this._animationHelper.setInitialNodePositionsFromSubsequentViews(viewGroup.getViews(), this._vkScene);

		this._animationHelper.setInitialNodePositionsFromPreviousViews(viewGroup.getViews(), this._vkScene);

		this._animationHelper.setInitialNodePositionsFromCurrenetViews(viewGroup.getViews(), this._vkScene);

		this._animationHelper.setPlaybackStartTimes(viewGroup.getViews(), this._vkScene);

		this._animationHelper.buildViewsInitialState(viewGroup.getViews(), this._vkScene);
	};

	return SceneBuilder;
});
