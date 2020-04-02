/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"sap/ui/base/Object",
	"./AnimationTrackValueType",
	"./findIndexInArray"
], function(
	BaseObject,
	AnimationTrackValueType,
	findIndexInArray
) {

	"use strict";

	/**
	 * Constructor for an animation sequence.
	 *
	 * @class Provides the interface for animation track. The objects of this class should not be created directly.
	 *
	 * @param {string} sId track's ID
	 * @param {any} parameters track's parameters
	 * @param {sap.ui.vk.AnimationTrackValueType} parameters.trackValueType type of values track contains
	 * @param {boolean} parameters.cycleForward cycle forward flag
	 * @param {boolean} parameters.cycleBackward cycle backward flag
	 * @param {boolean} parameters.infinite infinite flag
	 *
	 * @author SAP SE
	 * @version 1.74.0
	 * @extends sap.ui.base.Object
	 * @alias sap.ui.vk.AnimationTrack
	 *
	 * @private
	 * @experimental Since 1.67.0 This class is experimental and might be modified or removed in future versions.
	 */
	var AnimationTrack = BaseObject.extend("sap.ui.vk.AnimationTrack", /** @lends sap.ui.vk.AnimationTrack.prototype */ {

		constructor: function(sId, parameters) {
			this._id = sId;
			this._trackValueType = parameters && parameters.trackValueType ? parameters.trackValueType : AnimationTrackValueType.Scalar;
			this._cycleForward = !!(parameters && parameters.cycleForward);
			this._cycleBackward = !!(parameters && parameters.cycleBackward);
			this._infinite = !!(parameters && parameters.infinite);

			this._keys = [];
		}
	});

	/**
	 * Gets the track ID.
	 * @returns {string} The track ID.
	 * @public
	 */
	AnimationTrack.prototype.getId = function() {
		return this._id;
	};

	/**
	 * Gets the track keys value type.
	 * @returns {sap.ui.vk.AnimationTrackValueType} The keys value type.
	 * @public
	 */
	AnimationTrack.prototype.getKeysType = function() {
		return this._trackValueType;
	};

	/**
	 * Returns value of Cycle Forward flag.
	 * @returns {boolean} value of Cycle Forward flag.
	 * @public
	 */
	AnimationTrack.prototype.isCycleForward = function() {
		return this._cycleForward;
	};

	/**
	 * Sets Cycle Forward flag.
	 * @param {boolean} cycleForward of Cycle Forward flag.
	 * @returns {sap.ui.vk.AnimationTrack} <code>this</code> to allow method chaining.
	 * @public
	 */
	AnimationTrack.prototype.setCycleForward = function(cycleForward) {
		this._cycleForward = cycleForward;
		return this;
	};

	/**
	 * Returns value of Cycle Backward flag.
	 * @returns {boolean} value of Cycle Backward flag.
	 * @public
	 */
	AnimationTrack.prototype.isCycleBackward = function() {
		return this._cycleBackward;
	};

	/**
	 * Sets Cycle Backward flag.
	 * @param {boolean} cycleBackward of Cycle Backward flag.
	 * @returns {sap.ui.vk.AnimationTrack} <code>this</code> to allow method chaining.
	 * @public
	 */
	AnimationTrack.prototype.setCycleBackward = function(cycleBackward) {
		this._cycleBackward = cycleBackward;
		return this;
	};

	/**
	 * Returns value of Play Infinite flag.
	 * @returns {boolean} value of Play Infinite flag.
	 * @public
	 */
	AnimationTrack.prototype.isInfinite = function() {
		return this._infinite;
	};

	/**
	 * Sets Play Infinite flag.
	 * @param {boolean} infinite of Play Infinite flag.
	 * @returns {sap.ui.vk.AnimationTrack} <code>this</code> to allow method chaining.
	 * @public
	 */
	AnimationTrack.prototype.setInfinite = function(infinite) {
		this._infinite = infinite;
		return this;
	};

	/**
	 * Gets the track keys count.
	 * @returns {int} The keys count.
	 * @public
	 */
	AnimationTrack.prototype.getKeysCount = function() {
		return this._keys.length;
	};

	/**
	 * Gets the specified key value.
	 * @param {int} index key's index
	 * @returns {float|float[]} key value.
	 * @public
	 */
	AnimationTrack.prototype.getKey = function(index) {
		if (index < 0 || index >= this._keys.length) {
			return undefined;
		}

		return this._keys[index];
	};

	/**
	 * Updates the specified key value.
	 * @param {int} index key's index
	 * @param {float|float[]} value key's value
	 * @returns {sap.ui.vk.AnimationTrack} <code>this</code> to allow method chaining.
	 * @public
	 */
	AnimationTrack.prototype.updateKey = function(index, value) {
		if (index >= 0 || index < this._keys.length) {
			this._keys[index].value = value;
		}

		return this;
	};

	/**
	 * Removes the specified key from the track.
	 * @param {int} index key's index
	 * @returns {sap.ui.vk.AnimationTrack} <code>this</code> to allow method chaining.
	 * @public
	 */
	AnimationTrack.prototype.removeKey = function(index) {
		if (index >= 0 || index < this._keys.length) {
			this._keys.splice(index, 1);
		}

		return this;
	};

	/**
	 * Finds a nearest key index for the specifie time.
	 * @param {float} time time to find
	 * @returns {int} index key's index or -1 if track has no keys yet
	 * @public
	 */
	AnimationTrack.prototype.findKeyIndex = function(time) {
		var index = -1;
		if (this._keys.length === 1) {
			index = 0;
		} else if (this._keys.length > 1) {
			for (var idx = 1; idx < this._keys.length; idx++) {
				var leftKey = this.getKey(idx - 1);
				var rightKey = this.getKey(idx);
				if (time >= leftKey.time && time <= rightKey.time) {
					index = time - leftKey.time < rightKey.time - time ? idx - 1 : idx;
					break;
				}
			}
		}
		return index;
	};

	/**
	 * Adds a key at time specified.
	 * @param {float} time key's time
	 * @param {float|float[]} value key's value
	 * @returns {sap.ui.vk.AnimationTrack} <code>this</code> to allow method chaining.
	 * @public
	 */
	AnimationTrack.prototype.insertKey = function(time, value) {

		var index = findIndexInArray(this._keys, function(key) {
			return key.time === time;
		});

		if (index < 0) {
			this._keys.push({
				time: time,
				value: value
			});

			this._keys.sort(function(a, b) {
				return a.time - b.time;
			});
		} else {
			this.updateKey(index, value);
		}

		return this;
	};

	return AnimationTrack;
});

