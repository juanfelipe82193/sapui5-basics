/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"sap/ui/base/EventProvider"
], function(
	EventProvider
) {
	"use strict";

	/**
	 * Constructor for a new AnimationPlayback.
	 *
	 * The objects of this class contain neccessary information to define how an animation sequence is played
	 *
	 * @class Provides definition for an animation playback
	 *
	 * @private
	 * @author SAP SE
	 * @version 1.74.0
	 * @extends sap.ui.base.EventProvider
	 * @alias sap.ui.vk.AnimationPlayback
	 * @experimental Since 1.67.0 This class is experimental and might be modified or removed in future versions.
	 */
	var AnimationPlayback = EventProvider.extend("sap.ui.vk.AnimationPlayback", /** @lends sap.ui.vk.AnimationPlayback.prototype */ {

		constructor: function(sId, parameters) {

			var uuidv4 = function() {
				return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
				  var r = Math.random() * 16 | 0, v = c == "x" ? r : (r & 0x3 | 0x8);
				  return v.toString(16);
				});
			};

			if (typeof sId === "object") {
				parameters = sId;
				sId = undefined;
			}

			if (sId == null) {
				sId = uuidv4();
			}

			this._id = sId;

			this._startTime = parameters && parameters.startTime ? parameters.startTime : 0;
			this._sequence 	= parameters && parameters.sequence ? parameters.sequence : undefined;
			this._timeScale = parameters && parameters.timeScale ? parameters.timeScale : 1.0;
			this._preDelay 	= parameters && parameters.preDelay ? parameters.preDelay : 0.0;
			this._postDelay = parameters && parameters.postDelay ? parameters.postDelay : 0.0;
			this._repeats 	= parameters && parameters.repeats ? parameters.repeats : 1;
			this._reversed 	= parameters && parameters.reversed ? parameters.reversed : false;
			this._infinite 	= parameters && parameters.infinite ? parameters.infinite : false;
		}
	});

	/**
	 * Gets the playback ID.
	 * @returns {string} The playback ID.
	 * @public
	 */
	AnimationPlayback.prototype.getId = function() {
		return this._id;
	};

	/**
	 * Gets the playback start time.
	 * @returns {float} The sequence to be played.
	 * @public
	 */
	AnimationPlayback.prototype.getStartTime = function() {
		return this._startTime;
	};

	/**
	 * Sets the playback start time.
	 * @param {float} startTime The plyback start time.
	 * @returns {sap.ui.vk.AnimationPlayback} <code>this</code> to allow method chaining.
	 * @public
	 */
	AnimationPlayback.prototype.setStartTime = function(startTime) {
		this._startTime = startTime;
		return this;
	};

	/**
	 * Gets the sequence to be played with the playback.
	 * @returns {sap.ui.vk.AnimationSequence} The sequence to be played.
	 * @public
	 */
	AnimationPlayback.prototype.getSequence = function() {
		return this._sequence;
	};

	/**
	 * Sets the sequence to be played with the playback.
	 * @param {sap.ui.vk.AnimationSequence} sequence The sequence to be played.
	 * @returns {sap.ui.vk.AnimationPlayback} <code>this</code> to allow method chaining.
	 * @public
	 */
	AnimationPlayback.prototype.setSequence = function(sequence) {
		this._sequence = sequence;
		return this;
	};

	/**
	 * Gets the speed of the playback.
	 * @returns {float} The playback's speed.
	 * @public
	 */
	AnimationPlayback.prototype.getTimeScale = function() {
		return this._timeScale;
	};

	/**
	 * Sets the speed of the playback.
	 * @param {float} timeScale playback speed.
	 * @returns {sap.ui.vk.AnimationPlayback} <code>this</code> to allow method chaining.
	 * @public
	 */
	AnimationPlayback.prototype.setTimeScale = function(timeScale) {
		this._timeScale = timeScale;
		return this;
	};

	/**
	 * Gets the delay before starting the playback.
	 * @returns {float} The delay before starting the playback.
	 * @public
	 */
	AnimationPlayback.prototype.getPreDelay = function() {
		return this._preDelay;
	};

	/**
	 * Sets the delay before starting the playback.
	 * @param {float} preDelay delay before starting the playback.
	 * @returns {sap.ui.vk.AnimationPlayback} <code>this</code> to allow method chaining.
	 * @public
	 */
	AnimationPlayback.prototype.setPreDelay = function(preDelay) {
		this._preDelay = preDelay;
		return this;
	};

	/**
	 * Gets the delay after the playback was played.
	 * @returns {float} The delay after the playback was played.
	 * @public
	 */
	AnimationPlayback.prototype.getPostDelay = function() {
		return this._postDelay;
	};

	/**
	 * Sets the delay after the playback was played.
	 * @param {float} postDelay delay after the playback was played.
	 * @returns {sap.ui.vk.AnimationPlayback} <code>this</code> to allow method chaining.
	 * @public
	 */
	AnimationPlayback.prototype.setPostDelay = function(postDelay) {
		this._postDelay = postDelay;
		return this;
	};

	/**
	 * Gets the number of repetitions for the playback.
	 * @returns {int} The number of repetitions for the playback.
	 * @public
	 */
	AnimationPlayback.prototype.getRepeats = function() {
		return this._repeats;
	};

	/**
	 * Sets the number of repetitions for the playback.
	 * @param {int} repeats number of repetitions for the playback.
	 * @returns {sap.ui.vk.AnimationPlayback} <code>this</code> to allow method chaining.
	 * @public
	 */
	AnimationPlayback.prototype.setRepeats = function(repeats) {
		this._repeats = repeats;
		return this;
	};

	/**
	 * Determines if the playback is going to be played in reverse direction.
	 * @returns {boolean} If set to true, animation will be played in reverse direction.
	 * @public
	 */
	AnimationPlayback.prototype.getReversed = function() {
		return this._reversed;
	};

	/**
	 * Determines if the playback is going to be played in reverse direction.
	 * @param {boolean} reversed play animation sequence in reverse direction or not.
	 * @returns {sap.ui.vk.AnimationPlayback} <code>this</code> to allow method chaining.
	 * @public
	 */
	AnimationPlayback.prototype.setReversed = function(reversed) {
		this._reversed = reversed;
		return this;
	};

	/**
	 * Determines if the playback is going to be played infinitely.
	 * @returns {boolean} The number of repetitions for the playback.
	 * @public
	 */
	AnimationPlayback.prototype.getInfinite = function() {
		return this._infinite;
	};

	/**
	 * Determines if the playback is going to be played infinitely.
	 * @param {boolean} infinite play animation sequence infinitely or not.
	 * @returns {sap.ui.vk.AnimationPlayback} <code>this</code> to allow method chaining.
	 * @public
	 */
	AnimationPlayback.prototype.setInfinite = function(infinite) {
		this._infinite = infinite;
		return this;
	};

	/**
	 * Calculates animation playback duration
	 * @returns {float} playback duration.
	 * @public
	 */
	AnimationPlayback.prototype.getDuration = function() {
		var sequenceDuration = this._sequence ? this._sequence.getDuration() : 0;
		return this._preDelay + this._postDelay + sequenceDuration * this._repeats * this._timeScale;
	};

	return AnimationPlayback;
});
