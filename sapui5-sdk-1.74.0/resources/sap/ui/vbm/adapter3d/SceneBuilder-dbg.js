/*!
 * SAP UI development toolkit for HTML5 (SAPUI5) (c) Copyright 2009-2012 SAP AG. All rights reserved
 */

// Provides the base visual object.
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/base/Object",
	"./Utilities",
	"./thirdparty/three",
	"./thirdparty/ColladaLoader",
	"./thirdparty/DecalGeometry",
	"./thirdparty/html2canvas"],
function(jQuery, BaseObject, Utilities, THREE, ColladaLoader, DecalGeometry, html2canvas) {
	"use strict";

	var thisModule = "sap.ui.vbm.adapter3d.SceneBuilder";

	var log      = jQuery.sap.log;
	var degToRad = THREE.Math.degToRad;
	var Box3     = THREE.Box3;
	var Face3    = THREE.Face3;
	var Matrix4  = THREE.Matrix4;
	var Vector2  = THREE.Vector2;
	var Vector3  = THREE.Vector3;

	// Each visual object instance has its own Object3D instance.
	// Each Collada model's Object3D has a full copy of Collada model.
	// Box visual objects share the box geometries.
	// There are two box geometries - one with UV coordinates for 4 sided texture, one for 6 sided texture.
	// Each Mesh instance has its own material instance.
	// Materials share textures.
	// Shared three.js objects have the _sapRefCount property to track the lifetime.
	//
	// Visual object instances can have SceneBuilder specific properties to track changes:
	//   _lastModel    - a Collada model resource name
	//   _lastTexture  - an image resource name,
	//   _lastTexture6 - an indicator to use a 6-sided texture, it affects what box geometry to generate.
	// Technically a delta VBI JSON can assign a new value to the texture or model properties,
	// so we have track that we need to replace three.js objects with new values.
	// All other properties (e.g. color, position etc) will be re-assigned for visual object instances marked as 'updated'.

	var refCountPropertyName = "_sapRefCount";

	// Forward declarations.
	var createBox;
	var createCylinder;
	var removeLightsAndCameras;
	var normalizeObject3D;
	var toBoolean    = Utilities.toBoolean;
	var toFloat      = Utilities.toFloat;      // eslint-disable-line no-unused-vars
	var toVector3    = Utilities.toVector3;
	var toColor      = Utilities.toColor;	   // eslint-disable-line no-unused-vars
	var toDeltaColor = Utilities.toDeltaColor; // eslint-disable-line no-unused-vars
	var applyColor	 = Utilities.applyColor;
	var makeDataUri  = Utilities.makeDataUri;
	var applyColorBorder = Utilities.applyColorBorder;

	/**
	 * Constructor for a new three.js scene builder.
	 *
	 * @class
	 * Provides a base class for three.js scene builder.
	 *
	 * @private
	 * @author SAP SE
	 * @version 1.74.0
	 * @alias sap.ui.vbm.adapter3d.SceneBuilder
	 */
	var SceneBuilder = BaseObject.extend("sap.ui.vbm.adapter3d.SceneBuilder", /** @lends sap.ui.vbm.adapter3d.SceneBuilder.prototype */ {

		constructor: function(context, viewport) {
			BaseObject.call(this);

			this._context = context;

			// to control camera
			this._viewport = viewport;

			// Root for visual objects except Decals
			this._root = viewport.getRoot();

			// scene objects for Decals
			this._scene = viewport.getScene();

			// These two objects are created on first use.
			this._textureLoader = null;
			this._colladaLoader = null;

			// Decal helper object
			this._decalHelper = null;

			// Cached objects.

			// Textures can be shared amongst multiple 3D objects. Their properties are not changed after creation.
			// THREE.Texture objects will have property _sapRefCount.
			this._textures = new Map(); // Texture name -> THREE.Texture;

			// The Box geometry can be shared amongst multiple 3D objects. Its properties are not changed after creation.
			// The Box geometry will have property _sapRefCount.
			this._boxGeometryWith4SidedTexture = null;
			this._boxGeometryWith6SidedTexture = null;

			// The cylinder geometry can be shared amongst multiple 3D objects. Its properties are not changed after creation.
			this._cylinderGeometryWithCaps = null;
			this._cylinderGeometry = null;
			this._cylinderGeometryDefaultSize = 0.1;
		}
	});

	SceneBuilder.prototype.destroy = function() {
		if (this._decalHelper) {
			this._decalHelper.geometry.dispose();
			this._scene.remove(this._decalHelper);
			this._decalHelper = null;
		}
		// Reset references to shared objects.
		this._root = null;
		this._scene = null;
		this._viewport = null;
		this._context = null;

		BaseObject.prototype.destroy.call(this);
	};

	/**
	 * Builds or updates the three.js scene.
	 *
	 * @returns {Promise} A Promise that gets resolved when the scene has been built or updated.
	 * @public
	 */
	SceneBuilder.prototype.synchronize = function() {
		var that = this;

		return new Promise(function(resolve, reject) {
			// More than one Collada model visual object instance can have the same model property.
			// In this case the Collada model is loaded only once.
			// All but the last Collada model visual object instances will get a clone of the Collada model.
			// The last Collada model visual object instance will be assigned the loaded Collada model.
			var models = new Map(); // collada model resource name -> { object3D: THREE.Group, refCount: int }.

			// Adds a model the models map. Counts references to the model.
			// The object3D property will be populated later in the _loadModels method.
			var addModel = function(model) {
				if (models.has(model)) {
					models.get(model).refCount += 1;
				} else {
					models.set(model, { object3D: null, refCount: 1 });
				}
			};

			// A list of textures added during this call to the apply method.
			// The THREE.Texture objects will be created later in the _loadTextures method.
			var textures = new Set(); // image resource names.

			// A list of deferred decals to create in a second pass
			var decals = [];

			// A list of decals with texts needed to be rendered to image
			var decalTexts = [];

			// Find the first 3D window and its scene.
			var window = sap.ui.vbm.findInArray(that._context.windows, function(window) {
				return window.type === "default";
			});

			var scene = window && sap.ui.vbm.findInArray(that._context.scenes, function(scene) {
				return scene.id === window.refScene;
			});

			if (!scene) {
				resolve();
				return;
			}

			// keep it there for future references
			that._context.scene = scene;

			// Setup initial view, is set if most recent payload has 3d scene with camera setup instructions
			if (that._context.setupView) {
				var state = that._context.setupView;
				that._setupView(state.position, state.zoom, state.pitch, state.yaw, state.home, state.flyTo);
				that._context.setupView = undefined; // reset
			}

			// Visual object instances split by types of changes.
			var toAdd    = that._context.voQueues.toAdd.get(scene)    || [];
			var toUpdate = that._context.voQueues.toUpdate.get(scene) || [];
			var toDelete = that._context.voQueues.toRemove.get(scene) || [];

			var toAddOrUpdate = [].concat(toAdd, toUpdate);

			toAddOrUpdate.forEach(function(instance) {
				if (instance.isColladaModel && instance.model && instance.model !== instance._lastModel) {
					addModel(instance.model);
				}
				if (instance.texture && instance.texture !== instance._lastTexture) {
					textures.add(instance.texture);
				}
				if (instance.textureCap && instance.textureCap !== instance._lastTextureCap) {
					textures.add(instance.textureCap);
				}
				if (instance.isDecal && instance.text && (instance.text !== instance._lastText || instance.size !== instance._lastSize)) {
					decalTexts.push(instance);
				}
			});

			that._loadTextures(textures)
				.then(function() {
					return that._loadModels(models);
				})
				.then(function() {
					return that._renderTexts(decalTexts);
				})
				.then(function() {
					toDelete.forEach(that._destroyVisualObjectInstance.bind(that));
					toUpdate.forEach(that._updateVisualObjectInstance.bind(that, models, decals));
					toAdd.forEach(that._addVisualObjectInstance.bind(that, models, decals));

					var targets = new Map();
					// form map of keyable objects: key -> node
					that._root.traverse(function(node) {
						if (node._sapInstance && node._sapInstance.dataInstance) {
							var keyAttribute = node._sapInstance.voGroup.keyAttributeName;
							if (keyAttribute) {
								var key = node._sapInstance.dataInstance[keyAttribute];
								if (key && !targets.get(key)) {
									targets.set(key, node);
								}
								var keyFull = node._sapInstance.voGroup.id + "." + key;
								if (keyFull && !targets.get(keyFull)) {
									targets.set(keyFull, node);
								}
							}
						}
					});
					// create targeted decals when everything else is loaded
					decals.forEach(function(instance) {
						var node = targets.get(instance.target);
						if (node) {
							var mesh = that._findMesh(node);
							if (mesh) {
								that._createDecal(instance, mesh);
								that._assignDecalProperties(instance);
								if (instance.object3D) {
									that._scene.add(instance.object3D);
								}
							} else {
								log.error("Unable to create decal: target object does not have geometry", "", thisModule);
							}
						} else {
							log.error("Unable to create decal: target object is missing", "", thisModule);
						}
					})
					// cleanup
					that._cleanupCache();
					resolve();
				})
				.catch(function(reason) {
					reject(reason);
				});
		});
	};

	SceneBuilder.prototype._findMesh = function(node) {
		var mesh = null;
		node.traverse(function(obj) {
			if (!mesh && obj.isMesh) {
				mesh = obj;
			}
		});
		return mesh;
	};

	SceneBuilder.prototype._getGeometrySize = function() {
		return 2.0; // should be scene bounding box but in VB is't always 2.0
	};

	SceneBuilder.prototype._getZoomFactor = function(position, target) {
		var dir = new Vector3();
		dir.subVectors(target, position);
		return (this._getGeometrySize() * 2) / dir.length();
	};

	SceneBuilder.prototype._setupView = function(position, zoom, pitch, yaw, home, flyTo) {
		var camPos = new Vector3(0, 0, -5);
		var camTarget = new Vector3(0, 0, 0);

		position = position || "0;0;0";

		var tmp = position.split(";");
		position = new Vector3(parseFloat(tmp[0]), parseFloat(tmp[1]), parseFloat(tmp[2]));
		//move root instead of camera as implemented in VB
		var offset = new Vector3(position.x, position.z, -position.y); //swapped components to compensate root rotation
		this._root.position.copy(offset);

		zoom = parseFloat(zoom || "1");
		// use existing VB logic
		if (zoom === 0) {
			zoom = 1;
		} else if (zoom < 0) {
			zoom = 0.1;
		}
		var radius = this._getGeometrySize() * 2 / zoom;

		pitch = parseFloat(pitch || "0");
		yaw = parseFloat(yaw || "0");

		// correct pitch to avoid lock of OrbitControls
		pitch = (pitch % 180 === 0 ? pitch + 1 : pitch);

		// calculate rotation matrices
		var rotX = new Matrix4();
		rotX.makeRotationX(degToRad(pitch + 180));

		var rotZ = new Matrix4();
		rotZ.makeRotationZ(degToRad(-(yaw + 180)));

		var rot = new Matrix4();
		rot.multiplyMatrices(rotZ, rotX);

		// set camera origin
		var pos = new Vector3();
		pos.subVectors(camTarget, camPos);
		pos.normalize();
		pos.multiplyScalar(radius);
		pos.applyMatrix4(rot);

		// ideally "up" should be rotated too
		// var up = new THREE.Vector3(0, 1, 0);
		// up.applyMatrix4(rot);
		// up.normalize();
		// this._camera.up.set(-up.x, -up.z, up.y);
		// but don't touch up vector as OrbitControl is specifically sensitive to it
		// i.e not designed to work with "up" anything but (0,1,0)

		var state = {
			zoom: 1.0,
			target: camTarget.clone(),
			position: new Vector3(-pos.x, -pos.z, pos.y)
		};

		if (home) {
			this._viewport._setCameraHome(state);
			this._viewport._applyCamera(state, flyTo);
		} else {
			this._viewport._applyCamera(state, flyTo);
		}
	};

	SceneBuilder.prototype._getDecalTextKey = function(instance) {
		return instance.size + ";" + instance.text; // hash size with text as rendered image depends on both
	};

	SceneBuilder.prototype._renderTexts = function(instances) {
		var promises = [];
		instances.forEach(function(instance) {
			if (!this._textures.has(this._getDecalTextKey(instance))) {
					promises.push(this._renderText(instance));
			}
		}, this);
		return Promise.all(promises);
	};

	SceneBuilder.prototype._renderText = function(instance) {
		var that = this;
		return new Promise(function(resolve, reject) {
			var size = toVector3(instance.size);
			size = new Vector3(size[0], size[1], size[2]);

			if (size.length() < 1E-6) {
				log.error("Unable render text to html: decal size is invalid", "", thisModule);
				resolve();
			} else {
				var TEXTURE_SIZE = 512;
				var ratio = size.x / size.y;
				var width = Math.ceil(ratio >= 1 ? TEXTURE_SIZE : TEXTURE_SIZE * ratio);
				var height = Math.ceil(ratio <= 1 ? TEXTURE_SIZE : TEXTURE_SIZE / ratio);

				var iframe = document.createElement("iframe");
				iframe.style.visibility = "hidden";
				iframe.width = width;
				iframe.height = height;
				document.body.appendChild(iframe);

				var doc = iframe.contentDocument || iframe.contentWindow.document;
				doc.open();
				doc.close();
				doc.body.innerHTML = instance.text;

				var canvas = document.createElement("canvas");
				canvas.width = iframe.width * window.devicePixelRatio;
				canvas.height = iframe.height * window.devicePixelRatio;
				canvas.style.width = iframe.width + "px";
				canvas.style.height = iframe.height + "px";
				var context = canvas.getContext("2d");
				context.scale(window.devicePixelRatio, window.devicePixelRatio);

				html2canvas(doc.body, {canvas:canvas, width:width, height:height, backgroundColor:null}).then(function(out) {
					if (out.width > 0 && out.height > 0) {
						var texture = new THREE.Texture(out);
						texture.needsUpdate = true;
						texture[refCountPropertyName] = 0;
						that._textures.set(that._getDecalTextKey(instance), texture);
					} else {
						log.error("Failed render text to html", "", thisModule);
					}
					resolve();
				});
			}
		});
	};

	SceneBuilder.prototype._loadTextures = function(textureResourceNames) {
		var promises = [];
		textureResourceNames.forEach(function(textureResourceName) {
			if (!this._textures.has(textureResourceName)) {
				promises.push(this._loadTexture(textureResourceName));
			}
		}, this);
		return Promise.all(promises);
	};

	SceneBuilder.prototype._loadTexture = function(textureResourceName) {
		var that = this;
		var res = this._context.resources.get(textureResourceName);

		if (!res) {
			log.error("Failed to get texture from context: " + textureResourceName, "", thisModule);
			return Promise.resolve(); // Do not fail.
		}
		return new Promise(function(resolve, reject) {
			that._getTextureLoader().load(
				makeDataUri(res),
				function(texture) {
					texture.flipY = false; // Use the Direct3D texture coordinate space where the origin is in the top left corner.
					texture[refCountPropertyName] = 0;
					that._textures.set(textureResourceName, texture);
					resolve();
				},
				null,
				function(xhr) {
					log.error(
						"Failed to load texture from Data URI: " + textureResourceName,
						"status: " + xhr.status + ", status text: " + xhr.statusText,
						thisModule
					);
					resolve(); // Do not fail.
				}
			);
		});
	};

	SceneBuilder.prototype._loadModels = function(models) {
		var promises = [];
		models.forEach(function(content, modelResourceName) {
			promises.push(this._loadModel(modelResourceName, content));
		}, this);
		return Promise.all(promises);
	};

	SceneBuilder.prototype._loadModel = function(modelResourceName, content) {
		var that = this;
		var res = this._context.resources.get(modelResourceName);

		if (!res) {
			log.error("Failed to get model from context: " + modelResourceName, "", thisModule);
			return Promise.resolve(); // Do not fail.
		}

		return new Promise(function(resolve, reject) {
			// check for binary glTF (glb) first as it does have signature
			if (atob(res.slice(0,8)).startsWith("glTF")) {
				// TODO load as glTF
				resolve();
			} else {
				// try COLLADA first
				try {
					that._getColladaLoader().parse(
						atob(res),
						function(collada) {
							removeLightsAndCameras(collada.scene);
							content.object3D = collada.scene;
							// mirror on Z entire collada root which is effectively the same as collada processing with baking transformations and inverting Z coordinates in ActiveX
							collada.scene.scale.set(1,1,-1);
							resolve();
						}
					);
				} catch (ex) {
					// try glTF second
					try {
						// TODO
						resolve();
					} catch (ex) {
						log.error("Failed to parse model: " + modelResourceName, "", thisModule);
						resolve(); // Do not fail
					}
				}
			}
		});
	};

	SceneBuilder.prototype._releaseTexture = function(texture) {
		if (texture.hasOwnProperty(refCountPropertyName)) {
			texture[refCountPropertyName] -= 1;
		} else {
			texture.dispose();
		}
		return this;
	};

	SceneBuilder.prototype._addRefTexture = function(texture) {
		if (!texture.hasOwnProperty(refCountPropertyName)) {
			texture[refCountPropertyName] = 0;
		}
		texture[refCountPropertyName] += 1;
		return this;
	};

	SceneBuilder.prototype._releaseGeometry = function(geometry) {
		if (geometry.hasOwnProperty(refCountPropertyName)) {
			geometry[refCountPropertyName] -= 1;
		} else {
			geometry.dispose();
		}
		return this;
	};

	SceneBuilder.prototype._addRefGeometry = function(geometry) {
		if (!geometry.hasOwnProperty(refCountPropertyName)) {
			geometry[refCountPropertyName] = 0;
		}
		geometry[refCountPropertyName] += 1;
		return this;
	};

	/**
	 * Cleans up the scene builder's cache.
	 *
	 * If some textures are not referenced from materials anymore they will be disposed of.
	 * If there are no more Box visual object instances the box geometry will be disposed of.
	 *
	 * @returns {sap.ui.vbm.adapter3d.SceneBuilder} <code>this</code> to allow method chaining.
	 * @private
	 */
	SceneBuilder.prototype._cleanupCache = function() {
		this._textures.forEach(function(texture) {
			if (texture[refCountPropertyName] === 0) {
				texture.dispose();
				this._textures.delete(texture);
			}
		}, this);

		if (this._boxGeometryWith4SidedTexture && this._boxGeometryWith4SidedTexture[refCountPropertyName] === 0) {
			this._boxGeometryWith4SidedTexture.dispose();
			this._boxGeometryWith4SidedTexture = null;
		}

		if (this._boxGeometryWith6SidedTexture && this._boxGeometryWith6SidedTexture[refCountPropertyName] === 0) {
			this._boxGeometryWith6SidedTexture.dispose();
			this._boxGeometryWith6SidedTexture = null;
		}

		if (this._cylinderGeometryWithCaps && this._cylinderGeometryWithCaps[refCountPropertyName] === 0) {
			this._cylinderGeometryWithCaps.dispose();
			this._cylinderGeometryWithCaps = null;
		}

		if (this._cylinderGeometry && this._cylinderGeometry[refCountPropertyName] === 0) {
			this._cylinderGeometry.dispose();
			this._cylinderGeometry = null;
		}

		return this;
	};

	SceneBuilder.prototype._destroyVisualObjectInstance = function(instance) {
		if (instance.object3D) {
			var that = this;
			instance.object3D.traverse(function(node) {
				if (node.isMesh) {
					var material = node.material;
					var texture;
					[].concat(material).filter(function(m) {return m;}).forEach(function(m) {
						texture = m.map;
						if (texture) {
							that._releaseTexture(texture);
							m.map = null;
						}
						m.dispose();
					});
					node.material = null;
					var geometry = node.geometry;
					if (geometry) {
						that._releaseGeometry(geometry);
						node.geometry = null;
					}
				}
			});
			instance.object3D.parent.remove(instance.object3D);
			instance.object3D = null;
			instance._lastModel = null;
			instance._lastTexture = null;
			instance._lastTextureCap = null;
			instance._lastTexture6 = null;
		}
		return this;
	};

	/**
	 *
	 */
	SceneBuilder.prototype._updateVisualObjectInstance = function(models, decals, instance) {
		if (instance.isColladaModel) {
			if (instance.model !== instance._lastModel) {
				// Collada models could be very complex so it is easier to replace the whole sub-tree with a new one
				this._destroyVisualObjectInstance(instance)._addVisualObjectInstance(models, decals, instance);
			}
			this._assignColladaModelProperties(instance);
		} else if (instance.isBox) {
			this._assignBoxProperties(instance);
		} else if (instance.isCylinder) {
			this._assignCylinderProperties(instance);
		} else if (instance.isPolygon) {
			// non optimal for now, need to optimize later
			this._destroyVisualObjectInstance(instance)._addVisualObjectInstance(models, decals, instance);
		} else if (instance.isDecal) {
			// change in any of geometry related attributes -> recreate decal geometry
			if (instance.position !== instance._lastPosition ||
				instance.direction !== instance._lastDirection ||
				instance.rotation !== instance._lastRotation ||
				instance.size !== instance._lastSize ||
				instance.target !== instance._lastTarget ||
				instance.planeOrigin !== instance._lastPlaneOrigin ||
				instance.planeNormal !== instance._lastPlaneNormal) {
					this._destroyVisualObjectInstance(instance)._addVisualObjectInstance(models, decals, instance);
			} else {
				// if texture or text changed only -> no geometry recreation needed
				this._assignDecalProperties(instance);
			}
		}
		return this;
	};

	SceneBuilder.prototype._addVisualObjectInstance = function(models, decals, instance) {
		if (instance.isColladaModel) {
			instance._lastModel = instance.model;
			var content = models.get(instance.model);
			// The last visual object instance re-uses the loaded Collada model.
			var rootCollada = --content.refCount === 0 ? content.object3D : content.object3D.clone();

			instance.object3D = new THREE.Group();
			instance.object3D.add(rootCollada);

			if (toBoolean(instance.normalize)) {
				normalizeObject3D(rootCollada);
			}
			// Replace materials of all meshes in this sub-tree with a new one.
			this._assignMaterial(instance.object3D, this._createMaterial());
			this._assignColladaModelProperties(instance);
		} else if (instance.isBox) {
			// The geometry will be assigned in the _assignBoxProperties method as it depends on property 'texture6'.
			instance.object3D = new THREE.Group();
			instance.object3D.add(new THREE.Mesh(undefined, this._createMaterial()));
			this._assignBoxProperties(instance);
		} else if (instance.isCylinder) {
			// The geometry will be assigned in the _assignCylinderProperties method.
			instance.object3D = new THREE.Group();
			if (instance.textureCap) {
				// If the cylinder has a cap, then we need to handle materials differently so we initialise them as an array
				instance.object3D.add(new THREE.Mesh(undefined, [this._createMaterial(true), this._createMaterial(true)]));
			} else {
				// If the cylinder is not capped, then we can handle the materials in the same way as a cube
				instance.object3D.add(new THREE.Mesh(undefined, this._createMaterial(true)));
			}
			this._assignCylinderProperties(instance);
		} else if (instance.isPolygon) {
			instance.object3D = new THREE.Group();
			instance.object3D.add(new THREE.Mesh(undefined, this._createMaterial(true)));
			this._assignPolygonProperties(instance);
		} else if (instance.isDecal) {
			if (instance.target) {
				// targeted decals have to be loaded in a second pass when everything else is loaded
				decals.push(instance);
			} else if (instance.planeOrigin && instance.planeNormal) {
				// non targeted decals can be created immediately
				var plane = this._createPlane(instance);
				if (plane) {
					// plane has to be attached to _root (plane is defined in VB space) so ThreeJS is functional
					this._root.add(plane);
					this._createDecal(instance, plane);
					// dispose artificial plane as it's not needed anymore
					plane.geometry.dispose();
					this._root.remove(plane);
					this._assignDecalProperties(instance);
				}
			} else {
				log.error("unable to create decal: no target or no plane defined", "", thisModule);
			}
		}
		// add newely created 3D object to proper parent
		if (instance.object3D) {
			if (instance.isDecal) {
				this._scene.add(instance.object3D);
			} else {
				this._root.add(instance.object3D);
			}
		}
		return this;
	};

	SceneBuilder.prototype._assignColladaModelProperties = function(instance) {
		this._assignProperties(instance);
		return this;
	};

	SceneBuilder.prototype._assignDecalProperties = function(instance) {
		if ((instance._lastTexture && instance._lastTexture !== instance.texture) ||
			(instance._lastText && instance._lastText !== instance.text)) {
			this._removeTexture(instance);
		}
		if (instance.texture || instance.text) {
			this._assignTexture(instance, true);
		}
		instance._lastText = instance.text;
		instance._lastTexture = instance.texture;
		return this;
	};

	SceneBuilder.prototype._assignBoxProperties = function(instance) {
		if (instance._lastTexture6 !== instance.texture6) {
			// The geometry needs to be re-created or initially created.
			// Initially _lastTexture6 is undefined.
			var boxMesh = instance.object3D.children[0];
			if (boxMesh.geometry) {
				this._releaseGeometry(boxMesh.geometry);
			}
			boxMesh.geometry = this._getBoxGeometry(toBoolean(instance.texture6));
			this._addRefGeometry(boxMesh.geometry);

			if (toBoolean(instance.normalize)) {
				normalizeObject3D(boxMesh);
			}
			instance._lastTexture6 = instance.texture6;
		}

		if (instance._lastColorBorder && instance._lastColorBorder !== instance.colorBorder) {
			this._removeColorBorder(instance);
		}

		if (instance.colorBorder && instance._lastColorBorder !== instance.colorBorder) {
			this._assignColorBorder(instance);
		}
		instance._lastColorBorder = instance.colorBorder;

		this._assignProperties(instance);
		return this;
	};

	SceneBuilder.prototype._assignCylinderProperties = function(instance) {
		// Currently does not support textures
		if (instance._lastTexture !== instance.texture) {
			// The geometry needs to be re-created or initially created.
			// Initially _lastTexture6 is undefined.
			var cylinderMesh = instance.object3D.children[0];
			if (cylinderMesh.geometry) {
				this._releaseGeometry(cylinderMesh.geometry);
			}
			cylinderMesh.geometry = this._getCylinderGeometry(toBoolean(instance.isOpen));
			this._addRefGeometry(cylinderMesh.geometry);

			if (toBoolean(instance.normalize)) {
				normalizeObject3D(cylinderMesh);
			}
			instance._lastTexture = instance.texture;
			instance._lastTextureCap = instance.textureCap;
		}

		if (instance._lastColorBorder && instance._lastColorBorder !== instance.colorBorder) {
			this._removeColorBorder(instance);
		}

		if (instance.colorBorder && instance._lastColorBorder !== instance.colorBorder) {
			this._assignColorBorder(instance);
		}
		instance._lastColorBorder = instance.colorBorder;

		this._assignProperties(instance);
		return this;
	};

	/**
	 * Create Decal object based in definition and target geometry
	 *
	 * @param {Object} instance The decal instance
	 * @param {Object} target The decal target object
	 * @private
	 */
	SceneBuilder.prototype._createDecal = function(instance, target) {
		this._root.updateMatrixWorld(true); // make sure all matrices are up to date

		var position = toVector3(instance.position);
		position = new Vector3(position[0], position[1], position[2]);

		var direction = toVector3(instance.direction);
		direction = new Vector3(direction[0], direction[1], direction[2]);
		direction.normalize();

		if (direction.length() < 1E-6) {
			log.error("Unable create decal: direction is invalid", "", thisModule);
			return;
		}
		var rotation = degToRad(toFloat(instance.rotation));

		var size = toVector3(instance.size);
		size = new Vector3(size[0], size[1], size[2]);

		if (size.length() < 1E-6) {
			log.error("Unable create decal: size is invalid", "", thisModule);
			return;
		}
		// to world space both
		position.applyMatrix4(target.matrixWorld);
		direction.transformDirection(target.matrixWorld);

		// find intersection point -> which is our origin for decal
		var rayCaster = new THREE.Raycaster(position, direction);
		var intersections = rayCaster.intersectObject(target);

		if (!intersections.length) {
			log.error("Unable create decal: cannot project decal to plane", "", thisModule);
			return;
		}

		// helper object to sort out decal frustrum rotation
		if (!this._decalHelper) {
			this._decalHelper = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 5));
			this._decalHelper.visible = false;
			this._decalHelper.up.set(0,1,0);
			this._scene.add(this._decalHelper); // add to the scene as we're working in ThreeJS space here
		}

		// sort out decal frustrum rotation
		var inter = intersections[0];
		var origin = inter.point;
		var normal = direction.clone().negate();

		// debug: visualize decal projection
		// this._scene.add(new THREE.ArrowHelper(normal, origin, 8, 0xff00ff, 0.5));

		// use object size (bounding box diagonal)
		var box = new Box3().setFromObject(target);
		var targetSize = box.max.clone().sub(box.min).length();
		normal.multiplyScalar(targetSize);
		normal.add(origin);

		// get rotation using lookAt method
		this._decalHelper.position.copy(origin);
		this._decalHelper.lookAt(normal);
		this._decalHelper.rotation.z += rotation;

		// special decal material
		var material = new THREE.MeshPhongMaterial({
			specular: 0x444444,
			shininess: 0,
			transparent: true,
			depthTest: true,
			depthWrite: false,
			polygonOffset: true,
			polygonOffsetUnits: 0.1,
			polygonOffsetFactor: -1
		} );
		instance.object3D = new THREE.Mesh(new THREE.DecalGeometry(target, origin, this._decalHelper.rotation, size), material);

		// debug: visualize decal geometry normals
		// this._scene.add(new THREE.VertexNormalsHelper(instance.object3D, 0.2, 0x00ff00, 1));

		// debug: visualize desired decal direction
		// this._scene.add(new THREE.ArrowHelper( direction, position, 8, 0xff00ff, 0.5));

		// debug: visualize decal frustrum
		// var cube = new THREE.Mesh(new THREE.BoxGeometry(1,1,1), new THREE.MeshBasicMaterial({color: 0x00ff00}));
		// cube.position.copy(origin);
		// cube.rotation.copy(this._decalHelper.rotation);
		// cube.scale.copy(size);
		// this._scene.add(cube);

		// update LRU values
		instance._lastPosition = instance.position;
		instance._lastDirection = instance.direction;
		instance._lastRotation = instance.rotation;
		instance._lastSize = instance.size;
		instance._lastTarget = instance.target;
	};

	/**
	 * Create plane geometry for non targeted decal instance
	 *
	 * @param {Object} instance The decal instance
	 * @returns {THREE.Mesh} The plane geometry as mesh (or null if failed to create plane)
	 * @private
	 */
	SceneBuilder.prototype._createPlane = function(instance) {
		var origin = toVector3(instance.planeOrigin);
		origin = new Vector3(origin[0], origin[1], origin[2]);

		var normal = toVector3(instance.planeNormal);
		normal = new Vector3(normal[0], normal[1], normal[2]);
		normal.normalize();

		if (normal.length() < 1E-6) {
			log.error("Unable to create plane for decal: normal is invalid", "", thisModule);
			return null;
		}
		// find direction which is "different" to the plane normal
		var dir1 = new Vector3(normal.x  === 0 ? 10 : -normal.x, normal.y  === 0 ? -10 : normal.y, normal.z  === 0 ? 10 : -normal.z );

		// find point which is "different" to the plane origin
		var pos = origin.clone(origin).add(dir1);

		// project point to plane to find another point on the plane in addition to origin: p' = p - normal.dot(pos - origin) * normal
		pos.sub(normal.clone().multiplyScalar(normal.dot(pos.clone().sub(origin))));

		// plane "size" constant
		var PLANE_SIZE = 10000; // better to use whole scene bbox to make sure plane is bigger than the scene but it can be expensive

		// find first direction on the plane
		dir1 = pos.clone().sub(origin).normalize();

		// find second firection on the plane via cross product
		var dir2 = normal.clone().cross(dir1).normalize();

		// scale both direction vectors to plane "size"
		dir1.multiplyScalar(PLANE_SIZE);
		dir2.multiplyScalar(PLANE_SIZE);

		// find 4 points of the 2-triangle plane
		var p1 = origin.clone().add(dir1);
		var p2 = origin.clone().sub(dir1);
		var p3 = origin.clone().add(dir2);
		var p4 = origin.clone().sub(dir2);

		// create plane mesh consisting of 2 triangles
		var geometry = new THREE.Geometry();
		geometry.vertices.push(p1, p3, p2, p4);

		geometry.faces.push(
			new Face3(0, 1, 2, normal), // use plane normal as normal for triangles
			new Face3(2, 3, 0, normal)
		);
		// update LRU values
		instance._lastPlaneOrigin = instance.planeOrigin;
		instance._lastPlaneNormal = instance.planeNormal;

		return new THREE.Mesh(geometry);
	};

	/**
	 * Obtain the polygon geometry based on the vertices and normals.
	 *
	 * Performs triangulation on the given set of vertices and normals, creates indexed THREE.BufferGeometry
	 * out of them.
	 *
	 * @param {string} posarray The list of coordinates of vertices of polygon separated by semi-colon.
	 * @param {string} ON The Outer Normals as obtained for input payload.
	 * @param {string} color The default color of the polygon
	 * @returns {THREE.BufferGeometry} The instance of BufferGeometry.
	 * @private
	 */
	SceneBuilder.prototype._getPolygonGeometry = function(posarray, ON, color) {

		/**
		* Asserts whether a given point indentified by pointToBeTested is inside the triangle
		* formed by the three vertices in earVertices2d
		*/
		var insideTriangle = function(earVertices2d, pointToBeTested) {

			/**
			* Auxiliary Area function
			*/
			var area = function(vertex1, vertex2, vertex3) {
				return Math.abs(
					(vertex1.x * (vertex2.y - vertex3.y)
					+ vertex2.x * (vertex3.y - vertex1.y)
					+ vertex3.x * (vertex1.y - vertex2.y)) / 2);
			};

			// The point forms three separate triangles with three vertices of a triangle.
			var totalArea = area(earVertices2d.vertex1, earVertices2d.vertex2, earVertices2d.vertex3);
			var constituentArea1 = area(pointToBeTested, earVertices2d.vertex2, earVertices2d.vertex3);
			var constituentArea2 = area(earVertices2d.vertex1, pointToBeTested, earVertices2d.vertex3);
			var constituentArea3 = area(earVertices2d.vertex1, earVertices2d.vertex2, pointToBeTested);

			// The point is inside the triangle if the summation of areas of the three separate triangles
			// formed above is equal to the area of the triangle itself.
			return totalArea === constituentArea1 + constituentArea2 + constituentArea3;
		};

		/**
		 * This determines if the points at indices u, v, w form an ear.
		 *
		 * @param {array} vertices The 3D vertex coordinates of the polygon
		 * @param {int} u Index of the point to be used to determine ear
		 * @param {int} v Index of the point to be used to determine ear
		 * @param {int} w Index of the point to be used to determine ear
		 * @param {int} pointsLeft Balance number of points left after ear clipping
		 * @param {object} outerNormals Outer Normals
		 * @param {array} orderedIndices Ordered Indices
		 */
		var IsEar = function(vertices, u, v, w, pointsLeft, outerNormals, orderedIndices) {
			/**
			 * An ear of a polygon is a triangle formed by three consecutive vertices V0, V1, and V2
			 * for which V1 is a convex vertex (the interior angle at the vertex is smaller than π radians),
			 * the line segment from V0 to V2 lies completely inside the polygon, and no vertices of the
			 * polygon are contained in the triangle other than the three vertices of the triangle.
			 *
			 * In the computational geometry jargon, the line segment between V0 and V2 is a diagonal of
			 * the polygon. The vertex V1 is called the ear tip.
			 *
			 */
			var orientation;

			// constant
			var EPSILON = 1.00000001e-10;

			/**
			 * Vertices contain 3D coordinates. Further computations are restricted to 2D.
			 * Which two is determined by the Outer Normal
			 */
			var earVertices2d = {
				vertex1: {
					x: 0.0,
					y: 0.0
				},
				vertex2: {
					x: 0.0,
					y: 0.0
				},
				vertex3: {
					x: 0.0,
					y: 0.0
				}
			};

			if (outerNormals.x) {
				// Triangulation/Ear-clipping has to happend in YZ plane
				earVertices2d.vertex1.x = vertices[orderedIndices[u]].y;
				earVertices2d.vertex1.y = vertices[orderedIndices[u]].z;

				earVertices2d.vertex2.x = vertices[orderedIndices[v]].y;
				earVertices2d.vertex2.y = vertices[orderedIndices[v]].z;

				earVertices2d.vertex3.x = vertices[orderedIndices[w]].y;
				earVertices2d.vertex3.y = vertices[orderedIndices[w]].z;

				orientation = Math.sign(outerNormals.x);
			} else if (outerNormals.y) {
				// Triangulation/Ear-clipping has to happend in ZX plane
				earVertices2d.vertex1.x = vertices[orderedIndices[u]].z;
				earVertices2d.vertex1.y = vertices[orderedIndices[u]].x;

				earVertices2d.vertex2.x = vertices[orderedIndices[v]].z;
				earVertices2d.vertex2.y = vertices[orderedIndices[v]].x;

				earVertices2d.vertex3.x = vertices[orderedIndices[w]].z;
				earVertices2d.vertex3.y = vertices[orderedIndices[w]].x;

				orientation = Math.sign(outerNormals.y);
			} else if (outerNormals.z) {
				// Triangulation/Ear-clipping has to happend in ZX plane
				earVertices2d.vertex1.x = vertices[orderedIndices[u]].x;
				earVertices2d.vertex1.y = vertices[orderedIndices[u]].y;

				earVertices2d.vertex2.x = vertices[orderedIndices[v]].x;
				earVertices2d.vertex2.y = vertices[orderedIndices[v]].y;

				earVertices2d.vertex3.x = vertices[orderedIndices[w]].x;
				earVertices2d.vertex3.y = vertices[orderedIndices[w]].y;

				orientation = Math.sign(outerNormals.z);
			}

			var area = orientation * (((earVertices2d.vertex2.x - earVertices2d.vertex1.x)
										* (earVertices2d.vertex3.y - earVertices2d.vertex1.y))
									-
										((earVertices2d.vertex2.y - earVertices2d.vertex1.y)
										* (earVertices2d.vertex3.x - earVertices2d.vertex1.x)));

			if (area < EPSILON) {
				return false;
			}

			var vertexToBeTested = {
				x: 0.0,
				y: 0.0
			};

			// Perform ear determination.
			for (var p = 0; p < pointsLeft; p++) {
				if ((p === u) || (p === v) || (p === w)) {
					continue;
				}

				if (outerNormals.x) {
					vertexToBeTested.x = vertices[orderedIndices[p]].y;
					vertexToBeTested.y = vertices[orderedIndices[p]].z;
				} else if (outerNormals.y) {
					vertexToBeTested.x = vertices[orderedIndices[p]].z;
					vertexToBeTested.y = vertices[orderedIndices[p]].x;
				} else if (outerNormals.z) {
					vertexToBeTested.x = vertices[orderedIndices[p]].x;
					vertexToBeTested.y = vertices[orderedIndices[p]].y;
				}

				if (insideTriangle(earVertices2d, vertexToBeTested)) {
					return false;
				}
			}

			return true;
		};

		/**
		 * Order vertices according to ear determination
		 *
		 * @param {array} vertices Vertices of polygon
		 * @param {object} outerNormal Outer Normal
		 */
		var calculateIndices = function(vertices, outerNormal) {
			var polygonIndices = [];
			if (vertices.length < 3) {
				return polygonIndices;
			}

			var orientation = 1;

			if (outerNormal.x) {
				orientation = Math.sign(outerNormal.x);
			} else if (outerNormal.y) {
				orientation = Math.sign(outerNormal.y);
			} else if (outerNormal.z) {
				orientation = Math.sign(outerNormal.z);
			}

			var area = function(vertices) {
				var result= 0.0;
				for (var i = vertices.length - 1, j = 0; j < vertices.length; i = j++) {

					if (outerNormal.x) {
						result += vertices[i].y * vertices[j].z - vertices[i].z * vertices[j].y;
					} else if (outerNormal.y) {
						result += vertices[i].z * vertices[j].x - vertices[i].x * vertices[j].z;
					} else if (outerNormal.z) {
						result += vertices[i].x * vertices[j].y - vertices[i].y * vertices[j].x;
					}

				}
				return result * 0.5;
			};

			var areaOr = orientation * area(vertices);
			var orderedIndices = [];
			if (0.0 < areaOr) {
				for (var j = 0; j < vertices.length; j++) {
					orderedIndices[j] = j;
				}
			} else {
				for (var k = 0; k < vertices.length; k++) {
					orderedIndices[k] = (vertices.length - 1) - k;
				}
			}

			var pointsLeft = vertices.length;
			var count = 2 * pointsLeft;

			for (var l = 0, v = pointsLeft - 1; pointsLeft > 2; ) {
				if (0 >= count--) {
					// Not a simple polygon.
					log.error(vertices.map(function(v) {
						return v.x + ":" + v.y + ":" + v.z;
					}).join(";") + " do not form a simple polygon");
				}

				var u = v;
				if (pointsLeft <= u) {
					u = 0;
				}

				v = u + 1;
				if (pointsLeft <= v) {
					v = 0;
				}

				var w = v + 1;
				if (pointsLeft <= w) {
					w = 0;
				}

				if (IsEar(vertices, u, v, w, pointsLeft, outerNormal, orderedIndices)) {
					var s, t;

					polygonIndices.push(orderedIndices[u]);
					polygonIndices.push(orderedIndices[w]);
					polygonIndices.push(orderedIndices[v]);

					l++;

					for (s = v, t = v + 1; t < pointsLeft; s++, t++) {
						orderedIndices[s] = orderedIndices[t];
					}
					pointsLeft--;
					count = 2 * pointsLeft;
				}
			}
			return polygonIndices;
		};

		var triangulatePolygon = function(posarray, ON) {
			// The following is implementation of triangulation by ear-clipping
			// https://www.geometrictools.com/Documentation/TriangulationByEarClipping.pdf
			// Although not the most efficient and a library implementation being available
			// from Three.js, doing to the below to replicate ActiveX functionality.

			/**
			 * - Consecutive vertices are connected by an edge and an edge connects the first and last points.
			 * - Each vertex shares exactly two edges.
			 * - The only place where edges are allowed to intersect are at the vertices.
			 */
			var outerNormal = {
				x: parseFloat("0.0"),
				y: parseFloat("0.0"),
				z: parseFloat("1.0")
			};

			var vertices = [];

			if (ON) {
				var outerNormalValues = ON.split(";").map(parseFloat);

				if (outerNormalValues.length === 3) {
					outerNormal = {
						x: outerNormalValues[0],
						y: outerNormalValues[1],
						z: outerNormalValues[2]
					};
				}
			}

			if (posarray) {
				var verticesCoordinates = posarray.split(";").map(parseFloat);

				while (verticesCoordinates.length > 0) {
					var vertexCoordinates = verticesCoordinates.splice(0, 3);
					vertices.push({
						x: vertexCoordinates[0],
						y: vertexCoordinates[1],
						z: vertexCoordinates[2]
					})
				}
			}

			return calculateIndices(vertices, outerNormal);
		};

		var normalValues = ON ? ON.split(";").map(parseFloat) : [0.0, 0.0, 1];

		var threeJSColor = toColor(color);
		var colorValues = [];
		colorValues.push(threeJSColor.rgb.r, threeJSColor.rgb.g, threeJSColor.rgb.b);

		var positions = [];
		var normals = [];
		var colors = [];

		posarray.split(";").forEach(function(e, i) {
			positions.push(parseFloat(e));
			normals.push(normalValues[i % 3]);
			colors.push(colorValues[i % 3]);
		});

		var geometry = new THREE.BufferGeometry();
		var indices = triangulatePolygon(posarray, ON);
		// Do NOT dispose position array onUpload of BufferGeometry (as shown in the Threejs Samples) - Raycasting won't work.

		geometry.setIndex(indices);
		geometry.addAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
		geometry.addAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
		geometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

		geometry.computeBoundingSphere();
		geometry.computeVertexNormals();
		return geometry;
	};

	SceneBuilder.prototype._assignPolygonProperties = function(instance) {
		var areaMesh = instance.object3D.children[0];
		areaMesh.geometry = this._getPolygonGeometry(instance.posarray, instance.OuterNormal, instance.color);

		if (instance._lastColorBorder && instance._lastColorBorder !== instance.colorBorder) {
			this._removeColorBorder(instance);
		}

		if (instance.colorBorder && instance._lastColorBorder !== instance.colorBorder) {
			this._assignColorBorder(instance);
		}
		instance._lastColorBorder = instance.colorBorder;

		this._assignProperties(instance);
		return this;
	};

	// Assign properties common to Box and Collada Model.
	SceneBuilder.prototype._assignProperties = function(instance) {
		// The texture6 property is not applicable to Collada Model, so handle it in the _assignBoxProperties only.

		if (instance._lastTexture && instance._lastTexture !== instance.texture) {
			this._removeTexture(instance);
		}

		if (instance.texture) {
			this._assignTexture(instance);
		}

		instance._lastTexture = instance.texture;

		applyColor(instance, instance[toBoolean(instance["VB:s"]) ? "selectColor" : "color"]);

		// If object is a cylinder, then we reduce the scale slightly to to
		// Cylinders support two textures, one for the body and one optional for the cap/end
		var scale = toVector3(instance.scale);
		instance.object3D.scale.set(scale[0], scale[1], scale[2]);

		var rotation = toVector3(instance.rot);
		instance.object3D.rotation.set(degToRad(rotation[0]), degToRad(rotation[1]), degToRad(rotation[2]), "YXZ");

		var anchor;
		if (instance.isBox || instance.isCylinder) {
			// see sapvobox.cpp::CSapVoBox::GetAnchorPoint() lines 742-744
			anchor = new Vector3(0, 0, -1);
		} else if (instance.isPolygon) {
			anchor = new Vector3(0, 0, 0);
		} else {
			// see sapvo3d.cpp::CSapVo3D::GetAnchorPoint() lines 801-804
			var box = instance.object3D.children[0].vbBox;
			anchor = new Vector3(0, 0, -1.0 * (box.min.z > 0 ? box.min.z : box.max.z));
		}

		// transform anchor point: apply scale and rotation, follow implementation in sapvosite.h::CalcWorldTransformation lines 5267-5272
		var mat = new Matrix4();
		mat.makeRotationFromEuler(new THREE.Euler(degToRad(rotation[0]), degToRad(rotation[1]), degToRad(rotation[2]), "YXZ"));

		var out = new Matrix4();
		out.makeScale(scale[0], scale[1], scale[2]);
		out.multiply(mat);

		anchor.applyMatrix4(out);
		anchor.z = -anchor.z;

		var pos = toVector3(instance.pos);
		var position = new Vector3(pos[0], pos[1], pos[2]);
		position.sub(anchor);

		instance.object3D.position.set(position.x, position.y, position.z);

		instance.object3D.traverse(function(node) {
			node._sapInstance = instance;
		});

		return this;
	};

	SceneBuilder.prototype._removeTexture = function(instance) {
		if (instance.object3D) {
			var that = this;
			instance.object3D.traverse(function(node) {
				if (node.isMesh && node.material && node.material.map) {
					that._releaseTexture(node.material.texture);
					node.material.map = null;
				} else if (node.isMesh && node.material && node.material.length != 0) {
					for (var i = 0; i < node.material.length; i++) {
						that._releaseTexture(node.material[i].texture || node.material[i].map);
						node.material[i].map = null;
					}
				}
			});
		}
		return this;
	};

	SceneBuilder.prototype._assignTexture = function(instance, flip) {
		var that = this;
		var texture, textureCap;
		if (instance.object3D) {
			texture = this._textures.get(instance.texture);

			if (instance.isDecal && instance.text) {
				texture = this._textures.get(this._getDecalTextKey(instance));
			}
			if (instance.isCylinder && instance.textureCap) {
				textureCap = this._textures.get(instance.textureCap);
			}
			instance.object3D.traverse(function(node) {
				if (node.isMesh && node.material) {
					if (flip) {
						texture.flipY = flip;
					}
					if (instance.isCylinder && instance.textureCap) {
						node.material[0].map = texture;
						node.material[1].map = textureCap;
						that._addRefTexture(texture);
						that._addRefTexture(textureCap);
					} else {
						node.material.map = texture;
						that._addRefTexture(texture);
					}
				}
			});
		}
		return this;
	};

	SceneBuilder.prototype._removeColorBorder = function(instance) {
		if (instance.object3D) {
			instance.object3D.traverse(function(node) {
				var wireframeIndex = sap.ui.vbm.findIndexInArray(
					node.children,
					function(child) { return child.isLineSegments; }
				);

				if (wireframeIndex !== -1) {
					var wireFrame = node.children[wireframeIndex];
					node.remove(wireFrame);
					wireFrame.geometry.dispose();
					wireFrame.material.dispose();
					wireFrame = undefined;
				}
			});
		}
		return this;
	};

	SceneBuilder.prototype._assignColorBorder = function(instance) {
		var mesh = instance.object3D.children[0];
		if (instance.isCylinder) {
			mesh.add(new THREE.LineSegments( new THREE.EdgesGeometry( mesh.geometry, 60 ), this._createLineBasicMaterial()));
		} else {
			mesh.add(new THREE.LineSegments( new THREE.EdgesGeometry( mesh.geometry ), this._createLineBasicMaterial()));
		}
		applyColorBorder(instance, instance.colorBorder);
		return this;
	};

	SceneBuilder.prototype._createMaterial = function(doubleSide) {
		return new THREE.MeshPhongMaterial({
			shininess: 1,
			specular: 0x101009,
			side: doubleSide ? THREE.DoubleSide : THREE.FrontSide
		});
	};

	SceneBuilder.prototype._createLineBasicMaterial = function() {
		return new THREE.LineBasicMaterial({
			// On Mac - linewidth doesn't work with chrome, works with Safari - Issue with WebGL
			// https://github.com/mrdoob/three.js/issues/269,
			// https://github.com/mrdoob/three.js/issues/10357
			linewidth: 1
		});
	};

	SceneBuilder.prototype._assignMaterial = function(object3D, material) {
		//Only used for collada
		object3D.traverse(function(node) {
			if (node.isMesh) {
				// No need to dispose of the old material and textures as the mesh was not rendered yet
				// and there is nothing loaded to the GPU.
				node.material = material;
			}
		});
		return this;
	};

	SceneBuilder.prototype._getBoxGeometry = function(hasSixSidedTexture) {
		var boxGeometryName = hasSixSidedTexture ? "_boxGeometryWith6SidedTexture" : "_boxGeometryWith4SidedTexture";
		return this[boxGeometryName] || (this[boxGeometryName] = createBox(hasSixSidedTexture));
	};

	/**
	 * TODO: Mark as private
	 */
	SceneBuilder.prototype._getCylinderGeometry = function(isOpenEnded) {
		var cylinderGeometryName;
		if (isOpenEnded) {
			cylinderGeometryName = "_cylinderGeometryWithCaps";
		 } else {
			cylinderGeometryName = "_cylinderGeometry";
		 }
		return this[cylinderGeometryName] || (this[cylinderGeometryName] = createCylinder(isOpenEnded));
	};

	SceneBuilder.prototype._getTextureLoader = function() {
		return this._textureLoader || (this._textureLoader = new THREE.TextureLoader());
	};

	SceneBuilder.prototype._getColladaLoader = function() {
		return this._colladaLoader || (this._colladaLoader = new ColladaLoader());
	};

	////////////////////////////////////////////////////////////////////////////

	/**
	 * Removes descendant nodes that are lights or cameras.
	 *
	 * @param {THREE.Object3D} node The node to process.
	 * @returns {THREE.Object3D} The input <code>node</code> parameter to allow method chaining.
	 * @private
	 */
	removeLightsAndCameras = function(node) {
		var objectsToRemove = [];
		node.traverse(function(object) {
			if (object.isLight || object.isCamera) {
				objectsToRemove.push(object);
			}
		});
		objectsToRemove.forEach(function(object) {
			while (object && object !== node) { // Do not remove the top level node.
				var parent = object.parent;
				if (object.children.length === 0) {
					parent.remove(object);
				}
				object = parent;
			}
		});
		return node;
	};

	/**
	 * Normalize the object.
	 *
	 * The node is centered and then scaled uniformly so that vertex coordinates fit into the 3D box defined as range [(-1, -1, -1), (+1, +1, +1)].
	 *
	 * @param {THREE.Object3D} root The node to normalize.
	 * @returns {THREE.Object3D} The input <code></code> parameter to allow method chaining.
	 * @private
	 */
	normalizeObject3D = function(root) {
		// Re-centre according to the VB ActiveX implementation.
		var box = new Box3().setFromObject(root);
		var center = box.getCenter();

		box.min.sub(new Vector3(center.x, center.y, -center.z));
		box.max.sub(new Vector3(center.x, center.y, -center.z));

		// Normalize coordinates (not the size!) according to the VB ActiveX implementation.
		var scaleFactor = Math.max(
			Math.abs(box.min.x),
			Math.abs(box.min.y),
			Math.abs(box.min.z),
			Math.abs(box.max.x),
			Math.abs(box.max.y),
			Math.abs(box.max.z)
		);
		if (scaleFactor) {
			scaleFactor = 1 / scaleFactor;
		}
		box.min.set(box.min.x * scaleFactor, box.min.y * scaleFactor, -box.min.z * scaleFactor);
		box.max.set(box.max.x * scaleFactor, box.max.y * scaleFactor, -box.max.z * scaleFactor);

		Utilities.swap(box, "min", "max");
		root.vbBox = box;

		var m1 = new Matrix4().makeScale(scaleFactor, scaleFactor, scaleFactor);
		var m2 = new Matrix4().makeTranslation(-center.x, -center.y, -center.z);

		root.updateMatrix();
		m1.multiply(m2);
		m1.multiply(root.matrix);
		m1.decompose(root.position, root.quaternion, root.scale);

		return root;
	};

	/**
	 * Creates a box.
	 *
	 * We cannot use the three.js BoxGeometry class as its faces, UVs etc are quite different from what is expected in legacy VB.
	 *
	 * The geometry is generated according to the algorithm in the legacy VB ActiveX control.
	 *
	 * @param {boolean} hasSixSidedTexture If equals <code>true</code> assign UV coordinates for 6-sided texture, otherwise for 4-sided texture.
	 * @returns {THREE.Geometry} The box geometry.
	 * @private
	 */
	createBox = function(hasSixSidedTexture) {
		var geometry = new THREE.Geometry();
		var halfSideLength = 0.1;

		geometry.vertices.push(
			// Top
			new Vector3( halfSideLength,  halfSideLength, -halfSideLength),
			new Vector3( halfSideLength, -halfSideLength, -halfSideLength),
			new Vector3(-halfSideLength, -halfSideLength, -halfSideLength),
			new Vector3(-halfSideLength,  halfSideLength, -halfSideLength),

			// Bottom
			new Vector3( halfSideLength,  halfSideLength,  halfSideLength),
			new Vector3(-halfSideLength,  halfSideLength,  halfSideLength),
			new Vector3(-halfSideLength, -halfSideLength,  halfSideLength),
			new Vector3( halfSideLength, -halfSideLength,  halfSideLength),

			// Right
			new Vector3( halfSideLength,  halfSideLength, -halfSideLength),
			new Vector3( halfSideLength,  halfSideLength,  halfSideLength),
			new Vector3( halfSideLength, -halfSideLength,  halfSideLength),
			new Vector3( halfSideLength, -halfSideLength, -halfSideLength),

			// Front
			new Vector3( halfSideLength, -halfSideLength, -halfSideLength),
			new Vector3( halfSideLength, -halfSideLength,  halfSideLength),
			new Vector3(-halfSideLength, -halfSideLength,  halfSideLength),
			new Vector3(-halfSideLength, -halfSideLength, -halfSideLength),

			// Left
			new Vector3(-halfSideLength, -halfSideLength, -halfSideLength),
			new Vector3(-halfSideLength, -halfSideLength,  halfSideLength),
			new Vector3(-halfSideLength,  halfSideLength,  halfSideLength),
			new Vector3(-halfSideLength,  halfSideLength, -halfSideLength),

			// Back
			new Vector3( halfSideLength,  halfSideLength,  halfSideLength),
			new Vector3( halfSideLength,  halfSideLength, -halfSideLength),
			new Vector3(-halfSideLength,  halfSideLength, -halfSideLength),
			new Vector3(-halfSideLength,  halfSideLength,  halfSideLength)
		);

		var defaultColor = new THREE.Color(0.5, 0.5, 0.5);

		geometry.faces.push(
			// Top
			new Face3(0, 2, 3, new Vector3( 0,  0, -1), defaultColor),
			new Face3(0, 1, 2, new Vector3( 0,  0, -1), defaultColor),

			// Bottom
			new Face3(4, 5, 6, new Vector3( 0,  0,  1), defaultColor),
			new Face3(4, 6, 7, new Vector3( 0,  0,  1), defaultColor),

			// Right
			new Face3(8, 10, 11, new Vector3( 1,  0,  0), defaultColor),
			new Face3(8,  9, 10, new Vector3( 1,  0,  0), defaultColor),

			// Front
			new Face3(12, 14, 15, new Vector3( 0, -1,  0), defaultColor),
			new Face3(12, 13, 14, new Vector3( 0, -1,  0), defaultColor),

			// Left
			new Face3(16, 18, 19, new Vector3(-1,  0,  0), defaultColor),
			new Face3(16, 17, 18, new Vector3(-1,  0,  0), defaultColor),

			// Back
			new Face3(20, 22, 23, new Vector3( 0,  1,  0), defaultColor),
			new Face3(20, 21, 22, new Vector3( 0,  1,  0), defaultColor)
		);

		var uvs;

		if (hasSixSidedTexture) {
			uvs = [
				// Top
				new Vector2(2/3, 0.5),
				new Vector2(1.0, 0.5),
				new Vector2(1.0, 1.0),
				new Vector2(2/3, 1.0),

				// Bottom
				// VB ActiveX incorrectly defines bottom the same as right/left, though the comments say it is the same as top.
				// same botton orientation as in ActiveX, cross oriented to the top face
				new Vector2(2/3, 0.5),
				new Vector2(2/3, 0.0),
				new Vector2(1.0, 0.0),
				new Vector2(1.0, 0.5),

				// Right
				new Vector2(2/3, 0.5),
				new Vector2(2/3, 1.0),
				new Vector2(1/3, 1.0),
				new Vector2(1/3, 0.5),

				// Front
				new Vector2(2/3, 0.0),
				new Vector2(2/3, 0.5),
				new Vector2(1/3, 0.5),
				new Vector2(1/3, 0.0),

				// Left
				new Vector2(1/3, 0.5),
				new Vector2(1/3, 1.0),
				new Vector2(0.0, 1.0),
				new Vector2(0.0, 0.5),

				// Back
				new Vector2(0.0, 0.5),
				new Vector2(0.0, 0.0),
				new Vector2(1/3, 0.0),
				new Vector2(1/3, 0.5)
			];
		} else {
			// Use the Direct3D texture coordinate space where the origin is in the top left corner.
			// If there is a texture with the following quadrants
			// (0,0)                       (1,0)
			//      +----------+----------+
			//      |   BACK   |  FRONT   |
			//      +----------+----------+
			//      |RIGHT/LEFT|TOP/BOTTOM|
			//      +----------+----------+
			// (0,1)                       (1,1)
			// then those quadrants should map to faces as in the comments below.
			uvs = [
				// Top
				new Vector2(0.5, 0.5),
				new Vector2(1.0, 0.5),
				new Vector2(1.0, 1.0),
				new Vector2(0.5, 1.0),

				// Bottom
				// VB ActiveX incorrectly defines bottom the same as right/left, though the comments say it is the same as top.
				new Vector2(0.5, 0.5),
				new Vector2(1.0, 0.5),
				new Vector2(1.0, 1.0),
				new Vector2(0.5, 1.0),

				// Right
				new Vector2(0.5, 0.5),
				new Vector2(0.5, 1.0),
				new Vector2(0.0, 1.0),
				new Vector2(0.0, 0.5),

				// Front
				new Vector2(0.5, 0.5),
				new Vector2(0.5, 0.0),
				new Vector2(1.0, 0.0),
				new Vector2(1.0, 0.5),

				// Left
				new Vector2(0.5, 0.5),
				new Vector2(0.5, 1.0),
				new Vector2(0.0, 1.0),
				new Vector2(0.0, 0.5),

				// Back
				new Vector2(0.0, 0.5),
				new Vector2(0.0, 0.0),
				new Vector2(0.5, 0.0),
				new Vector2(0.5, 0.5)
			];
		}

		geometry.faceVertexUvs[0].push(
			// Top
			[ uvs[0], uvs[2], uvs[3] ],
			[ uvs[0], uvs[1], uvs[2] ],

			// Bottom
			[ uvs[5], uvs[6], uvs[7] ],
			[ uvs[5], uvs[7], uvs[4] ],

			// Right
			[ uvs[8], uvs[10], uvs[11] ],
			[ uvs[8],  uvs[9], uvs[10] ],

			// Front
			[ uvs[12], uvs[14], uvs[15] ],
			[ uvs[12], uvs[13], uvs[14] ],

			// Left
			[ uvs[16], uvs[18], uvs[19] ],
			[ uvs[16], uvs[17], uvs[18] ],

			// Back
			[ uvs[20], uvs[22], uvs[23] ],
			[ uvs[20], uvs[21], uvs[22] ]
		);

		return geometry;
	};

	/**
	 * Creates a cylinder.
	 *
	 * Use standard THREE.Cylinder geometry.
	 *
	 *
	 * @param {boolean} isOpenEnded If equals <code>true</code> will create a hollow cylinder / pipe.
	 * @returns {THREE.Geometry} The cylinder geometry.
	 * @private
	 */
	createCylinder = function(isOpenEnded) {
		var radius = 0.1; // Initial radius for cylinder
		var geometry = new THREE.CylinderGeometry( radius, radius, 2 * radius, 32, 1, isOpenEnded );


		if (!isOpenEnded) {
			// Apply correct texture based on cylinder geometry
			var radius_half = radius / 2;
			for (var z = 0; z < geometry.faces.length; z++) {
				var face = geometry.faces[z];
				if (face.normal.y !== 0) {
					geometry.faceVertexUvs[0][z][0].u = (geometry.vertices[face.a].x + radius_half) / radius;
					geometry.faceVertexUvs[0][z][0].v = (geometry.vertices[face.a].z + radius_half) / radius;
					geometry.faceVertexUvs[0][z][1].u = (geometry.vertices[face.b].x + radius_half) / radius;
					geometry.faceVertexUvs[0][z][1].v = (geometry.vertices[face.b].z + radius_half) / radius;
					geometry.faceVertexUvs[0][z][2].u = (geometry.vertices[face.c].x + radius_half) / radius;
					geometry.faceVertexUvs[0][z][2].v = (geometry.vertices[face.c].z + radius_half) / radius;
					face.materialIndex = 1;
				} else {
					face.materialIndex = 0;
				}
			}
		}

		return geometry;
	};

	return SceneBuilder;
});
