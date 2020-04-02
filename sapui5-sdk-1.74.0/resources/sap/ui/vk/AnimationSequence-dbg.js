/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"sap/ui/base/Object",
	"./AnimationTrackType",
	"./findIndexInArray",
	"./AnimationPlayer",
	"./Core"
], function(
	BaseObject,
	AnimationTrackType,
	findIndexInArray,
	AnimationPlayer,
	vkCore
) {
	"use strict";

	/**
	 * Constructor for an animation sequence.
	 *
	 * @class Provides the interface for animation sequence. The objects of this class should not be created directly.
	 * @param {string} sId Sequence ID
	 * @param {any} parameters Sequence parameters
	 * @param {string} parameters.name Sequence name
	 * @param {float} parameters.duration Sequence duration
	 *
	 * @private
	 * @author SAP SE
	 * @version 1.74.0
	 * @extends sap.ui.base.Object
	 * @alias sap.ui.vk.AnimationSequence
	 * @implements sap.ui.vk.IJointCollection
	 * @experimental Since 1.67.0 This class is experimental and might be modified or removed in future versions.
	 */
	var AnimationSequence = BaseObject.extend("sap.ui.vk.AnimationSequence", /** @lends sap.ui.vk.AnimationSequence.prototype */ {

		constructor: function(sId, parameters) {
			this._id = sId;

			this._name = parameters && parameters.name ? parameters.name : "";
			this._duration = parameters && parameters.duration ? parameters.duration : 1.0;

			this._joints = [];
			this._animations = new Map();
		}
	});

	/**
	 * Gets the sequence ID.
	 * @returns {string} The sequence ID.
	 * @public
	 */
	AnimationSequence.prototype.getId = function() {
		return this._id;
	};

	/**
	 * Gets the sequence name.
	 * @returns {string} The sequence name.
	 * @public
	 */
	AnimationSequence.prototype.getName = function() {
		return this._name;
	};

	/**
	 * Sets the sequence name.
	 * @param {string} name The sequence name.
	 * @returns {sap.ui.vk.AnimationSequence} <code>this</code> to allow method chaining.
	 * @public
	 */
	AnimationSequence.prototype.setName = function(name) {
		this._name = name;
		return this;
	};

	/**
	 * Gets the sequence duration.
	 * @returns {float} The sequence duration.
	 * @public
	 */
	AnimationSequence.prototype.getDuration = function() {
		return this._duration;
	};

	/**
	 * Sets the sequence duration.
	 * @param {float} duration The sequence duration.
	 * @returns {sap.ui.vk.AnimationSequence} <code>this</code> to allow method chaining.
	 * @public
	 */
	AnimationSequence.prototype.setDuration = function(duration) {
		this._duration = duration;
		return this;
	};

	AnimationSequence.prototype._findJointIndex = function(parent, node) {
		return findIndexInArray(this._joints, function(joint) {
			return (parent ? joint.parent == parent : true) && (node ? joint.node == node : true);
		});
	};

	/**
	 * Sets node joint(s)
	 *
	 * @param {any|any[]} jointData              joint data
	 * @param {any}       jointData.parent       parent node
	 * @param {any}       jointData.node         child node
	 * @param {float[]}   jointData.translation  child's translation relative to parent
	 * @param {float[]}   jointData.quaternion   child's rotation relative to parent
	 * @param {float[]}   jointData.scale        child's scale relative to parent
	 *                                           During rendering, translation rotation and scale components are combined into
	 *                                           a matrix in the RTS order.
	 *
	 * @returns {sap.ui.vk.AnimationSequence} <code>this</code> to allow method chaining.
	 *
	 * @experimental Since 1.71.0 This class is experimental and might be modified or removed in future versions.
	 * @private
	 */
	AnimationSequence.prototype.setJoint = function(jointData) {
		if (!Array.isArray(jointData)) {
			jointData = [ jointData ];
		}

		jointData.forEach(function(data) {

			var index = this._findJointIndex(data.parent, data.node);
			if (index < 0) {
				this._joints.push(data);
			} else {
				this._joints[index].translation = data.translation;
				this._joints[index].quaternion = data.quaternion;
				this._joints[index].scale = data.scale;
			}
		}, this);

		this._fireSequenceChanged();

		return this;
	};

	/**
	 * Gets node joint(s)
	 *
	 * @param {any}     [jointData]                    node joint data. If omited, all node joints will be returned.
	 * @param {any}     [jointData.parent]             parent node.
	 * @param {any}     [jointData.node]               child node. If omited, all children for the specified parent node will be returned.
	 *
	 * @returns {any|any[]} Object(s) containing joint and positioning data or <code>undefined</code> if no such joint present.
	 *
	 * @experimental Since 1.71.0 This class is experimental and might be modified or removed in future versions.
	 * @private
	 */
	AnimationSequence.prototype.getJoint = function(jointData) {
		var result;

		if (!jointData || (!jointData.parent && !jointData.node)) {

			// return all
			result = this._joints;

		} else if (jointData && jointData.node) {

			// return a specific joint
			result = this._joints.filter(function(item) {
				return item.node == jointData.node && (jointData.parent ? item.parent == jointData.parent : true);
			});

		} else if (jointData && jointData.parent && !jointData.node) {

			// return joints for a given parent
			result = this._joints.filter(function(item) {
				return item.parent == jointData.parent;
			});
		}

		return result;
	};

	/**
	 * Removes node joint
	 *
	 * @param {any} [jointData]               joint data. If omited, all node joints will be removed.
	 * @param {any} [jointData.parent]        parent node. If omited, all joints for the specified child will be removed.
	 * @param {any} [jointData.node]          child node. If omited, all joints for the specified parent will be removed.
	 *
	 * @returns {sap.ui.vk.AnimationSequence} <code>this</code> to allow method chaining.
	 *
	 * @experimental Since 1.71.0 This class is experimental and might be modified or removed in future versions.
	 * @private
	 */
	AnimationSequence.prototype.removeJoint = function(jointData) {

		if (!jointData) {

			// remove all joints
			this._joints.splice(0);

		} else if (jointData && (jointData.node || jointData.parent)) {

			var index;
			do {
				index = this._findJointIndex(jointData.parent, jointData.node);
				if (index >= 0) {
					this._joints.splice(index, 1);
				}
			} while (index >= 0);
		}

		this._fireSequenceChanged();

		return this;
	};

	/**
	 * Gets the animation track for specified property for a node.
	 * @param {object} [nodeRef] node to animate
	 * @param {sap.ui.vk.AnimationTrackType} [property] node's property to animate
	 *
	 * @returns {sap.ui.vk.AnimationTrack|any} animation data requested.
	 * @public
	 */
	AnimationSequence.prototype.getNodeAnimation = function(nodeRef, property) {

		var createInfo = function(nodeRef) {
			var data = this._animations.get(nodeRef);
			var result;

			if (data) {
				if (property) {
					result = data[property];
				} else {
					result = {
						nodeRef: nodeRef
					};

					for (var trackType in AnimationTrackType) {
						var type = AnimationTrackType[trackType];
						if (data[type]) {
							result[type] = data[type];
						}
					}
				}
			}

			return result;
		}.bind(this);

		var result;

		if (nodeRef && !Array.isArray(nodeRef)) {
			// get animation track(s) for a specific node
			var data = this._animations.get(nodeRef);
			if (!data) {
				return undefined;
			}

			result = property ? data[property] : data;
		} else if (!nodeRef) {
			// get all animation tracks
			result = [];
			this._animations.forEach(function(data, node) {
				result.push(createInfo(node, property));
			}, this);
		} else {
			// get animation track(s) for the set of nodes
			result = [];
			nodeRef.forEach(function(node) {
				result.push(createInfo(node, property));
			}, this);
		}

		return result;
	};

	/**
	 * Assigns animation track to animate node's specific property.
	 * @param {object} nodeRef node to animate
	 * @param {sap.ui.vk.AnimationTrackType} property node's property to animate
	 * @param {sap.ui.vk.AnimationTrack} track type of values used for animation
	 *
	 * @returns {sap.ui.vk.AnimationSequence} <code>this</code> to allow method chaining.
	 * @public
	 */
	AnimationSequence.prototype.setNodeAnimation = function(nodeRef, property, track) {
		var data = this._animations.get(nodeRef);
		if (!data) {
			data = {};
			this._animations.set(nodeRef, data);
		}

		data[property] = track;

		return this;
	};

	/**
	 * Removes the animation of specified type for a node(s).
	 * @param {object} nodeRef node to remove animation
	 * @param {sap.ui.vk.AnimationTrackType} [property] node's property to animate
	 *
	 * @returns {any} animation data requested.
	 * @public
	 */
	AnimationSequence.prototype.removeNodeAnimation = function(nodeRef, property) {
		if (!property) {
			this._animations.delete(nodeRef);
		} else {
			var data = this._animations.get(nodeRef);
			if (data) {
				delete data[property];
			}
		}

		return this;
	};

	/**
	 * Reset sequence duration to maximium lenght of tracks.
	 * @returns {sap.ui.vk.AnimationSequence} <code>this</code> to allow method chaining
	 * @public
	 */
	AnimationSequence.prototype.resetDuration = function() {

		var maxTrackLength = 0;
		this._animations.forEach(function(data, nodeRef){
			var trackLength;
			for (var trackType in data) {
				var track = data[trackType];
				if (track) {
					if (track.getKeysCount()) {
						var key = track.getKey(track.getKeysCount() - 1);
						trackLength = key.time;
					}
					if (trackLength && trackLength > maxTrackLength) {
						maxTrackLength = trackLength;
					}
				}
			}
		}, this);

		if (maxTrackLength > 0.0) {
			this._duration = maxTrackLength;
		}

		return this;
	};

	AnimationSequence.prototype.getNodesBoundaryValues = function(isStart) {
		var result = new Map();

		var setNodeValue = function(nodeRef, property, value) {
			var data = result.get(nodeRef);
			if (!data) {
				data = {};
				result.set(nodeRef, data);
			}
			data[property] = value;
		};

		this._animations.forEach(function(data, nodeRef) {
			for (var trackType in data) {
				var track = data[trackType];
				if (track) {
					var startKey = AnimationPlayer.getBoundaryKey(track, isStart);
					setNodeValue(nodeRef, trackType, startKey.value);
				}
			}
		});

		return result;
	};

	AnimationSequence.prototype._fireSequenceChanged = function() {
		vkCore.getEventBus().publish("sap.ui.vk", "sequenceChanged", {
			sequenceId: this._id
		});
	};

	return AnimationSequence;
});

