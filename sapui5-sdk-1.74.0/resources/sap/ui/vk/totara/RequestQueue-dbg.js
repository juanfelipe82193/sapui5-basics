sap.ui.define([
	"./TotaraUtils",
	"./Command"
], function(
	TotaraUtils,
	Command
) {
	"use strict";

	function ResourceQueue(batchSize) {
		this.batchSize = batchSize;
		this.globalList = new Set();
		this.requestedList = [];
		this.waitingList = new Set();
	}

	ResourceQueue.prototype.push = function(id, requestData) {
		if (!this.globalList.has(id)) {
			this.globalList.add(id);
			this.requestedList.push(requestData || id);
			this.waitingList.add(id);
		}
	};

	ResourceQueue.prototype.fetchBatch = function() {
		return this.requestedList.splice(0, this.batchSize);
	};

	ResourceQueue.prototype.pop = function(id) {
		return this.waitingList.delete(id);
	};

	ResourceQueue.prototype.isReady = function(id) {
		return this.globalList.has(id) && !this.waitingList.has(id);
	};

	ResourceQueue.prototype.clear = function(id) {
		this.globalList.clear();
		this.requestedList = [];
		this.waitingList.clear();
	};

	ResourceQueue.prototype.isEmpty = function() {
		return this.requestedList.length === 0;
	};

	ResourceQueue.prototype.isWaiting = function() {
		return this.waitingList.size > 0;
	};



	function PriorityResourceQueue(batchSize, maxBatchDataSize) {
		ResourceQueue.call(this, batchSize);
		this.maxBatchDataSize = maxBatchDataSize;
		this.minBatchDataSize = maxBatchDataSize >> 1;
		this.priorityMap = new Map();
	}

	PriorityResourceQueue.prototype = Object.create(ResourceQueue.prototype);

	PriorityResourceQueue.prototype.constructor = PriorityResourceQueue;

	PriorityResourceQueue.prototype.push = function(id, priority, size) {
		if (!this.globalList.has(id)) {
			size = size || 1;
			// console.log("push", id, priority, size);
			this.globalList.add(id);
			this.requestedList.push(id);
			this.waitingList.add(id);
			this.priorityMap.set(id, { p: priority, s: size });
		}
	};

	PriorityResourceQueue.prototype.clear = function() {
		ResourceQueue.prototype.clear.call(this);
		this.priorityMap.clear();
	};

	PriorityResourceQueue.prototype.fetchBatch = function() {
		var priorityMap = this.priorityMap;
		this.requestedList.sort(function(a, b) {
			return priorityMap.get(a).p - priorityMap.get(b).p;
		});

		var batch = [];
		var size = 0;
		for (var i = 0; i < this.batchSize && this.requestedList.length > 0; i++) {
			var id = this.requestedList.pop();
			var resSize = priorityMap.get(id).s;
			if (size > this.minBatchDataSize && size + resSize > this.maxBatchDataSize) {
				this.requestedList.push(id);
				break;
			}

			// console.log("id", id, "size", resSize, "priority", priorityMap.get(id).p);
			size += resSize;
			priorityMap.delete(id);
			batch.push(id);
		}
		// console.log(size, batch);
		return batch;
	};



	var RequestQueue = function(context, sceneId) {
		this.context = context; // SceneContext
		this.sceneId = sceneId;
		this.token = context.token || TotaraUtils.generateToken();

		this.meshes = new ResourceQueue(128);
		this.materials = new ResourceQueue(128);
		this.textures = new ResourceQueue(1);
		this.geometries = new PriorityResourceQueue(32, 0x100000); // 1MB
		this.geomMeshes = new PriorityResourceQueue(32, 0x100000); // 1MB
		this.annotations = new ResourceQueue(128);
		this.views = new ResourceQueue(1);
		this.thumbnails = new ResourceQueue(1);
		this.tracks = new ResourceQueue(128);
		this.sequences = new ResourceQueue(128);
		this.highlights = new ResourceQueue(1);
	};

	RequestQueue.prototype.isEmpty = function() {
		return this.meshes.isEmpty()
			&& this.annotations.isEmpty()
			&& this.materials.isEmpty()
			&& this.textures.isEmpty()
			&& this.geometries.isEmpty()
			&& this.geomMeshes.isEmpty()
			&& this.views.isEmpty()
			&& this.thumbnails.isEmpty()
			&& this.tracks.isEmpty()
			&& this.sequences.isEmpty()
			&& this.highlights.isEmpty();
	};

	RequestQueue.prototype.isWaitingForContent = function() {
		return this.meshes.isWaiting()
			|| this.textures.isWaiting()
			|| this.materials.isWaiting()
			|| this.geometries.isWaiting()
			|| this.geomMeshes.isWaiting()
			|| this.annotations.isWaiting()
			|| this.views.isWaiting()
			|| this.thumbnails.isWaiting()
			|| this.tracks.isWaiting()
			|| this.sequences.isWaiting()
			|| this.highlights.isWaiting();
	};

	RequestQueue.prototype.clearContent = function() {
		this.meshes.clear();
		this.annotations.clear();
		this.materials.clear();
		this.textures.clear();
		this.geometries.clear();
		this.geomMeshes.clear();
		this.views.clear();
		this.thumbnails.clear();
		this.tracks.clear();
		this.sequences.clear();
		this.highlights.clear();
	};

	RequestQueue.prototype.createGetContentCommand = function(commandName, ids, extraOptions) {
		var options = {
			sceneId: this.sceneId,
			ids: ids.map(function(id) { return parseInt(id, 10); }),
			token: this.token
		};
		return TotaraUtils.createRequestCommand(commandName, extraOptions ? Object.assign(options, extraOptions) : options);
	};

	RequestQueue.prototype.generateRequestCommand = function() {
		var ids;
		var command = null;

		if (!this.meshes.isEmpty()) {
			ids = this.meshes.fetchBatch();
			command = this.createGetContentCommand(Command.getMesh, ids);
		} else if (!this.annotations.isEmpty()) {
			ids = this.annotations.fetchBatch();
			command = this.createGetContentCommand(Command.getAnnotation, ids);
		} else if (!this.materials.isEmpty()) {
			ids = this.materials.fetchBatch();
			command = this.createGetContentCommand(Command.getMaterial, ids);
		} else if (!this.geometries.isEmpty()) {
			ids = this.geometries.fetchBatch();
			command = this.createGetContentCommand(Command.getGeometry, ids);
			command.sceneId = this.sceneId;
			command.geometryIds = ids;
		} else if (!this.geomMeshes.isEmpty()) {
			ids = this.geomMeshes.fetchBatch();
			command = this.createGetContentCommand(Command.getMesh, ids, { $expand: "geometry" });
			command.sceneId = this.sceneId;
			command.meshIds = ids;
		} else if (!this.textures.isEmpty()) {
			ids = this.textures.fetchBatch();
			command = this.createGetContentCommand(Command.getImage, [ ids[ 0 ].imageId ]);
			command.sceneId = this.sceneId;
			command = Object.assign(command, ids[ 0 ]);
		} else if (!this.sequences.isEmpty()) {
			ids = this.sequences.fetchBatch();
			command = this.createGetContentCommand(Command.getSequence, ids);
		} else if (!this.tracks.isEmpty()) {
			ids = this.tracks.fetchBatch();
			command = this.createGetContentCommand(Command.getTrack, ids);
		} else if (!this.views.isEmpty()) {
			ids = this.views.fetchBatch();
			command = TotaraUtils.createRequestCommand(Command.getView, {
				sceneId: this.sceneId,
				groupId: ids[0].viewGroupId,
				id: ids[0].viewId,
				includeHidden: this.context.includeHidden !== undefined ? this.context.includeHidden : false, // not include hidden by default,
				includeAnimation: this.context.includeAnimation !== undefined ? this.context.includeAnimation : true, // include animation by default,
				token: this.token
			});
		} else if (!this.highlights.isEmpty()) {
			ids = this.highlights.fetchBatch();
			command = TotaraUtils.createRequestCommand(Command.getHighlightStyle, {
				sceneId: this.sceneId,
				id: ids[ 0 ],
				token: this.token
			});
		} else if (!this.thumbnails.isEmpty()) {
			ids = this.thumbnails.fetchBatch();
			command = this.createGetContentCommand(Command.getImage, [ ids[ 0 ].imageId ]);
			command.sceneId = this.sceneId;
			command = Object.assign(command, ids[ 0 ]);
		}

		return command;
	};

	return RequestQueue;
});
