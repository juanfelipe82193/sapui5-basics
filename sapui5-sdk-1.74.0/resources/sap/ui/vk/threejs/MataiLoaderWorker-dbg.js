/* eslint-disable no-console */
console.log("MataiLoaderWorker started.");

var scriptDirectory = self.location.href.slice(0, self.location.href.lastIndexOf("/") + 1);

self.importScripts(scriptDirectory + "thirdparty/matai.js");

sap.ve.matai.createRuntime({
	prefixURL: scriptDirectory + "thirdparty/"
}).then(function(matai) {
	"use strict";

	console.log("MataiLoaderWorker runtime created.");

	function SceneBuilderProxy(sceneBuilderId) {
		this.sceneBuilderId = sceneBuilderId;
	}

	SceneBuilderProxy.prototype.setScene = function(info) {
		info.cameraId = info.cameraRef;

		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "setScene",
			args: [ info ]
		});
	};

	SceneBuilderProxy.prototype.createNode = function(info) {
		info.parentId = info.parentRef;
		if (info.transformType === 1) {
			info.transformType = "BILLBOARD_VIEW";
		} else if (info.transformType === 257) {
			info.transformType =  "LOCK_TOVIEWPORT";
		}
		info.transform = info.matrix;
		info.sid = info.nodeRef;

		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "createNode",
			args: [ info ]
		}, [ info.transform.buffer ]);
	};

	SceneBuilderProxy.prototype.createMesh = function(info) {
		var transferable = [
			info.boundingBox.buffer
		];
		if (info.transform) {
			transferable.push(info.matrix.buffer);
		}
		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "insertSubmesh",
			args: [ {
				meshId: info.meshRef,
				materialId: info.materialRef,
				transform: info.matrix,
				lods: [ {
					id: info.meshRef,
					boundingBox: info.boundingBox
				} ]
			} ]
		}, transferable);
	};

	SceneBuilderProxy.prototype.setMeshGeometry = function(info) {
		var transferable = [
			info.data.index.buffer,
			info.data.position.buffer
		];
		if (info.data.normal) {
			transferable.push(info.data.normal.buffer);
		}
		if (info.data.uv) {
			transferable.push(info.data.uv.buffer);
		}
		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "setGeometry",
			args: [ {
				id: info.meshRef,
				isPolyline: (info.flags & 1) > 0,
				data: {
					indices: info.data.index,
					points: info.data.position,
					normals: info.data.normal,
					uvs: info.data.uv
				}
			} ]
		}, transferable);
	};

	SceneBuilderProxy.prototype.insertMesh = function(nodeId, meshId) {
		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "setMeshNode",
			args: [ nodeId, meshId ]
		});
	};

	SceneBuilderProxy.prototype.createTextAnnotation = function(info) {
		info.coordinateSpace = 0;
		info.nodeId = info.nodeRef;
		info.fontFace = info.font;
		info.shape = info.style;
		info.backgroundColour = info.backgroundColor;
		info.borderColour = info.borderColor;
		info.textColour = info.textColor;

		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "createAnnotation",
			args: [ info ]
		});
	};

	SceneBuilderProxy.prototype.createTextNote = function(info) {
		info.coordinateSpace = 2;
		info.nodeId = info.nodeRef;
		info.id = info.nodeRef;
		info.sid = info.targetNodeRef;
		info.fontFace = info.font;
		info.shape = info.style;
		info.backgroundColour = info.backgroundColor;
		info.backgroundColour = info.backgroundColor;
		info.borderColour = info.borderColor;

		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "createAnnotation",
			args: [ info ]
		});
	};

	SceneBuilderProxy.prototype.createImageNote = function(info) {
		info.properlyAligned = true;
		info.nodeId = info.nodeRef;
		info.labelMaterialId = info.materialRef;
		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "createImageNote",
			args: [ info ]
		});
	};

	SceneBuilderProxy.prototype.insertLeaderLine = function(info) {
		var points = [];
		for (var i = 0; i < info.points.length; i += 3) {
			var point = [ info.points[i], info.points[i + 1], info.points[i + 2] ];
			points.push(point);
		}
		info.points = points;
		info.annotationId = info.nodeRef;
		info.nodeId = info.nodeRef;
		info.startPointSid = info.targetNodeRef;
		info.materialId = info.materialRef;
		info.startPointHeadStyle = info.startPointStyle;
		info.endPointHeadStyle = info.endPointStyle;
		info.pointHeadConstant = info.styleConstant;

		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "insertLeaderLine",
			args: [ info ]
		});
	};

	SceneBuilderProxy.prototype.createCamera = function(info) {
		info.ortho = info.projection === "orthographic";
		info.near = info.nearClip;
		info.far = info.farClip;
		info.fov = info.fov * Math.PI / 180;
		info.zoom = info.orthoZoomFactor;
		info.id = info.cameraRef;

		var transferable = [
			info.origin.buffer,
			info.up.buffer,
			info.target.buffer
		];
		if (info.matrix) {
			transferable.push(info.matrix.buffer);
		}
		info.notUseDirectionVector = true;
		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "createCamera",
			args: [ info ]
		}, transferable);
	};

	SceneBuilderProxy.prototype.insertCamera = function(nodeRef, cameraRef) {
		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "insertCamera",
			args: [ nodeRef, cameraRef ]
		});
	};

	SceneBuilderProxy.prototype.createViewportGroup = function(info) {
		info.id = info.viewportGroupRef;
		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "insertViewGroup",
			args: [ info ]
		});
	};

	SceneBuilderProxy.prototype.finalizePlaybacks = function(info) {
		info.viewGroupId = info.viewportGroupRef;
		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "setAnimationPlaybacks",
			args: [ info ]
		});
	};

	SceneBuilderProxy.prototype.insertModelView = function(info) {
		info.viewGroupId = info.viewportGroupRef;
		info.viewId = info.modelViewRef;
		info.thumbnailId = info.thumbnail;
		info.cameraId = info.cameraRef;

		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "insertView",
			args: [ info ]
		});
	};

	SceneBuilderProxy.prototype.setModelViewVisibilitySet = function(info) {
		info.viewId = info.modelViewRef;
		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "setModelViewVisibilitySet",
			args: [ info ]
		});
	};

	SceneBuilderProxy.prototype.insertModelViewHighlight = function(info) {
		info.viewId = info.modelViewRef;
		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "insertModelViewHighlight",
			args: [ info ]
		});
	};

	SceneBuilderProxy.prototype.createThumbnail = function(info) {
		info.imageId = info.imageRef;
		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "createThumbnail",
			args: [ info ]
		});
	};

	SceneBuilderProxy.prototype.createDetailView = function(info) {
		info.nodeId = info.nodeRef;
		info.detailViewId = info.detailViewRef;
		info.cameraId = info.cameraRef;
		info.backgroundColour = info.backgroundColor;
		info.borderColour = info.borderColor;
		info.attachment = info.attachmentPoint;

		var transferable = [
			info.origin.buffer,
			info.size.buffer
		];
		if (info.attachment) {
			transferable.push(info.attachment.buffer);
		}
		if (info.visibleNodes) {
			transferable.push(info.visibleNodes.buffer);
		}
		if (info.targetNodes) {
			transferable.push(info.targetNodes.buffer);
		}

		info.properlyAligned = true;
		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "createDetailView",
			args: [ info ]
		}, transferable);
	};

	SceneBuilderProxy.prototype.createMaterial = function(info) {
		info.ambientColour = info.ambient;
		info.diffuseColour = info.diffuse;
		info.specularColour = info.specular;
		info.emissiveColour = info.emissive;

		info.lineWidth = info.linestyle.width;
		info.lineHaloWidth = info.linestyle.haloWidth;
		info.lineColour = info.linestyle.color;
		info.lineEndCapStyle = info.linestyle.endCapStyle;
		info.lineDashPatternScale = info.linestyle.dashPatternScale;
		info.lineDashPattern = info.linestyle.dashPattern;
		info.lineWidthCoordinateSpace = info.linestyle.widthCoordinateSpace;
		info.id = info.materialRef;

		var transferable = [
			info.ambientColour.buffer,
			info.diffuseColour.buffer,
			info.specularColour.buffer,
			info.emissiveColour.buffer
		];

		if (info.lineColour && info.lineDashPattern) {
			transferable.push(
				info.lineColour.buffer,
				info.lineDashPattern.buffer
			);
		}
		if (info.textures) {
			for (var ti = 0; ti < info.textures.length; ti++) {
				var texture = info.textures[ti];
				var textureName = "texture" + texture.type.charAt(0).toUpperCase() + texture.type.slice(1);
				info[textureName] = {
					imageId: texture.imageRef,
					matrix: texture.matrix,
					uvHorizontalScale: texture.scaleX,
					uvVerticalScale: texture.scaleY,
					uvHorizontalOffset: texture.offsetX,
					uvVerticalOffset: texture.offsetY,
					uvRotationAngle: texture.angle,
					influence: texture.amount,
					filterMode: texture.filterMode,
					uvHorizontalTilingEnabled: texture.repeatX,
					uvVerticalTilingEnabled: texture.repeatY,
					uvClampToBordersEnabled: texture.clampToBorder,
					inverted: texture.invert,
					modulate: texture.modulate
				};
			}
		}

		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "createMaterial",
			args: [ info ]
		}, transferable);
	};

	SceneBuilderProxy.prototype.createImage = function(info) {
		info.id = info.imageRef;
		info.binaryData = info.data;
		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "createImage",
			args: [ info ]
		}, [ info.binaryData.buffer ]);
	};

	SceneBuilderProxy.prototype.progress = function(progress) {
		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "progress",
			args: [ progress ]
		});
	};

	SceneBuilderProxy.prototype.insertThrustline = function(info) {
		info.thrustlineId = info.thrustlineRef;
		info.materialId = info.material;
		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "insertThrustline",
			args: [ info ]
		});
	};

	SceneBuilderProxy.prototype.insertAnimationGroup = function(info) {
		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "insertAnimationGroup",
			args: [ info ]
		});
	};

	SceneBuilderProxy.prototype.insertAnimation = function(info) {
		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "insertAnimation",
			args: [ info ]
		});
	};

	SceneBuilderProxy.prototype.insertAnimationTarget = function(info) {
		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "insertAnimationTarget",
			args: [ info ]
		});
	};

	SceneBuilderProxy.prototype.insertAnimationTrack = function(info) {
		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "insertAnimationTrack",
			args: [ info ]
		});
	};

	SceneBuilderProxy.prototype.finalizeAnimation = function(animationRef) {
		self.postMessage({
			sceneBuilderId: this.sceneBuilderId,
			method: "setAnimationTracks",
			args: [ animationRef ]
		});
	};

	self.onmessage = function(event) {
		var data = event.data;
		switch (data.method) {
			case "loadSceneFromArrayBuffer":
				var proxy = new SceneBuilderProxy(data.sceneBuilderId);
				var res = matai.loadSceneFromArrayBuffer(proxy, data.buffer, data.fileName, null /* password */, data.sourceLocation);
				this.postMessage({
					sceneBuilderId: data.sceneBuilderId,
					method: "loadingFinished",
					args: [ { result: res } ]
				});
				break;

			default:
				break;
		}
	};

	self.postMessage({ ready: true });

	console.log("MataiLoaderWorker initialized.");
});

console.log("MataiLoaderWorker starting runtime.");
/* eslint-enable no-console */
