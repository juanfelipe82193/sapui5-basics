/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"sap/ui/core/Element",
	"./Core",
	"./AnimationMath",
	"./AnimationTrackType",
	"./AnimationTrackValueType"
], function(
	Element,
	vkCore,
	AnimationMath,
	AnimationTrackType,
	AnimationTrackValueType
) {
	"use strict";

	/**
	 * Constructor for a new AnimationPlayer.
	 *
	 * The objects of this class contain neccessary information to define how an animation sequence is played
	 *
	 * @class Provides definition for an animation playback
	 *
	 * @private
	 * @author SAP SE
	 * @version 1.74.0
	 * @extends sap.ui.base.Element
	 * @alias sap.ui.vk.AnimationPlayer
	 * @experimental Since 1.67.0 This class is experimental and might be modified or removed in future versions.
	 */
	var AnimationPlayer = Element.extend("sap.ui.vk.AnimationPlayer", /** @lends sap.ui.vk.AnimationPlayer.prototype */ {
		metadata: {
			associations: {
				viewStateManager: { type: "sap.ui.vk.ViewStateManagerBase", multiple: false }
			},
			events: {
				timeChanged: {
					time: {
						type: "float"
					},
					currentPlayback: {
						type: "sap.ui.vk.AnimationPlayback"
					}
				},
				stateChanged: {
					playing: {
						type: "boolean"
					},
					stopped: {
						type: "boolean"
					},
					endOfAnimation: {
						type: "boolean"
					}
				}
			}
		}
	});

	AnimationPlayer.prototype._getViewStateManager = function() {
		var vsm = this.getViewStateManager();
		return vsm ? sap.ui.getCore().byId(vsm) : undefined;
	};

	AnimationPlayer.prototype.init = function() {
		this._step = this._step.bind(this);

		this._playbackCollection = null;
		this._currentPlayback = null;

		// absolute time
		this._time = 0;

		vkCore.getEventBus().subscribe("sap.ui.vk", "readyForAnimation", this._onViewApplied, this);
		vkCore.getEventBus().subscribe("sap.ui.vk", "sequenceChanged", this._onSequenceChanged, this);
	};

	AnimationPlayer.prototype.exit = function() {
		this._playbackCollection = null;
		this._currentPlayback = null;

		vkCore.getEventBus().unsubscribe("sap.ui.vk", "readyForAnimation", this._onViewApplied, this);
		vkCore.getEventBus().unsubscribe("sap.ui.vk", "sequenceChanged", this._onSequenceChanged, this);
	};

	AnimationPlayer.prototype._onViewApplied = function(channel, eventId, event) {
		if (event.source.getId() != this.getViewStateManager()) {
			return;
		}

		var view = event.view;
		var ignoreAnimationPosition = event.ignoreAnimationPosition;

		this.activateView(view, ignoreAnimationPosition);
	};

	AnimationPlayer.prototype._onSequenceChanged = function(channel, eventId, event) {
		if (this._currentPlayback) {
			var viewStateManager = this._getViewStateManager();
			var sequence = this._currentPlayback.getSequence();
			if (viewStateManager && sequence) {
				if (sequence.getId() === event.sequenceId) {
					viewStateManager.setJoints(sequence.getJoint());
				}
			}
		}
	};

	/**
	 * Moves animation to a specified time.
	 * @param {float} time Time to set
	 * @param {int} [playbackIndex] Optional, when specified, <code>time</code> is relative to beginning of specified playback.
	 * @returns {sap.ui.vk.AnimationPlayer} <code>this</code> to allow method chaining.
	 * @public
	 */
	AnimationPlayer.prototype.setTime = function(time, playbackIndex) {

		if (!this._playbackCollection || !Array.isArray(this._playbackCollection.getPlaybacks())) {
			this._currentPlayback = undefined;
			this._time = 0;
		} else {

			if (playbackIndex != null) {
				time = this._getAbsoluteTime(time, playbackIndex);
			}

			var viewStateManager = this._getViewStateManager();

			this._time = time;
			if (time >= 0 && time <= this.getTotalDuration()) {
				var currentPlayback = this._currentPlayback;

				var newPlayback;
				if (playbackIndex != null) {
					newPlayback = this._playbackCollection.getPlayback(playbackIndex);
				} else {
					newPlayback = this._findPlaybackByAbsoluteTime(time);
				}

				this._currentPlayback = newPlayback;
				if (viewStateManager && this._currentPlayback && currentPlayback !== this._currentPlayback) {
					// active playback have been changed, set joints into ViewStateManager
					var sequence = this._currentPlayback.getSequence();
					if (sequence) {
						viewStateManager.setJoints(sequence.getJoint());
					}
				} else if (!this._currentPlayback || !this._currentPlayback.getSequence()) {
					// no active playback or sequence, remove joints from ViewStateManager
					viewStateManager.setJoints(undefined);
				}
			} else if (viewStateManager) {
				viewStateManager.setJoints(undefined);
			}

			if (viewStateManager) {

				var transforms = {
					nodeRefs: [],
					positions: []
				};

				var opacities = {
					nodeRefs: [],
					values: []
				};

				var nodeChanges = this._collectNodeChanges();
				nodeChanges.forEach(function(value, nodeRef) {
					var position = viewStateManager.getTransformation(nodeRef);
					var moved = false;
					if (value.translate) {
						moved = true;
						position.translation = value.translate;
					}
					if (value.rotate) {
						moved = true;
						position.quaternion = value.rotate;
					}
					if (value.scale) {
						moved = true;
						position.scale = value.scale;
					}

					if (moved) {
						transforms.nodeRefs.push(nodeRef);
						transforms.positions.push(position);
					}

					if (value.opacity !== undefined) {
						viewStateManager.setOpacity(nodeRef, value.opacity);

						opacities.nodeRefs.push(nodeRef);
						opacities.values.push(value.opacity);
					}
				}, this);

				viewStateManager.setTransformation(transforms.nodeRefs, transforms.positions);
				viewStateManager.setOpacity(opacities.nodeRefs, opacities.values);
			}
		}

		this.fireTimeChanged({
			time: this._time,
			currentPlayback: this._currentPlayback
		});

		return this;
	};

	/**
	 * Gets current absolute animation time position.
	 * @returns {float} animation time.
	 * @public
	 */
	AnimationPlayer.prototype.getTime = function() {
		return this._time;
	};

	/**
	 * Gets animation playback currently playing.
	 * @returns {sap.ui.vk.AnimationPlayback}} animation playback.
	 * @public
	 */
	AnimationPlayer.prototype.getCurrentPlayback = function() {
		return this._currentPlayback;
	};

	/**
	 * Gets current animation time position in the current animation playback.
	 * @returns {float} animation time.
	 * @public
	 */
	AnimationPlayer.prototype.getCurrentPlaybackTime = function() {
		var time = this._time;
		var playbacks = this._playbackCollection.getPlaybacks();
		if (!Array.isArray(playbacks) || !this.getCurrentPlayback()) {
			return -1;
		}

		var idx = 0;
		while (playbacks[idx] != this.getCurrentPlayback()) {
			time -= playbacks[idx].getDuration();
			idx++;
		}

		return time;
	};

	/**
	 * Gets start time for specified animation playback.
	 * @param {sap.ui.vk.AnimationPlayback|int} playback Animation playback or animation playback index in the current view.
	 * @returns {float} animation start time.
	 * @public
	 */
	AnimationPlayer.prototype.getStartTime = function(playback) {
		if (!this._playbackCollection) {
			return undefined;
		}

		if (typeof playback === "number") {
			playback = this._playbackCollection.getPlayback(playback);
		}

		return playback ? playback.getStartTime() : undefined;
	};

	/**
	 * Gets current total animation duration.
	 * @returns {float} animation duration.
	 * @public
	 */
	AnimationPlayer.prototype.getTotalDuration = function() {
		if (!this._playbackCollection) {
			return 0;
		}

		var time = 0;

		this._playbackCollection.getPlaybacks().forEach(function(playback) {
			time += playback.getDuration();
		});

		return time;
	};

	AnimationPlayer.prototype.shouldAnimateNextFrame = function() {
		return this.getTime() >= 0 && this.getTime() <= this.getTotalDuration();
	};

	// callback for requestAnimationFrame
	AnimationPlayer.prototype._step = function(timestamp) {
		if (!this._lastFrameTimestamp) {
			this._lastFrameTimestamp = timestamp;
		}

		var progress = timestamp - this._lastFrameTimestamp;

		this._lastFrameTimestamp = timestamp;

		this.setTime(this.getTime() + progress / 1000); // time is in seconds

		if (this.shouldAnimateNextFrame()) {
			this._frameId = window.requestAnimationFrame(this._step);
		} else {
			// this._frameId = undefined;
			this.stop();
		}
	};

	AnimationPlayer.prototype._interpolate = function(valueType, keyBracket, track) {
		var q;

		if (!keyBracket.before && !keyBracket.after) {
			return undefined;
		} else if (!keyBracket.before) {
			if (valueType === AnimationTrackValueType.Euler) {
				q = AnimationMath.neutralEulerToGlMatrixQuat(keyBracket.after.value);
				return AnimationMath.glMatrixQuatToNeutral(q);
			} else if (valueType === AnimationTrackValueType.AngleAxis) {
				q = AnimationMath.neutralAngleAxisToGlMatrixQuat(keyBracket.after.value);
				return AnimationMath.glMatrixQuatToNeutral(q);
			} else if (valueType === AnimationTrackValueType.Quaternion) {
				q = AnimationMath.neutralQuatToGlMatrixQuat(keyBracket.after.value);
				return AnimationMath.glMatrixQuatToNeutral(q);
			}
			return keyBracket.after.value;
		} else if (!keyBracket.after) {
			if (valueType === AnimationTrackValueType.Euler) {
				q = AnimationMath.neutralEulerToGlMatrixQuat(keyBracket.before.value);
				return AnimationMath.glMatrixQuatToNeutral(q);
			} else if (valueType === AnimationTrackValueType.AngleAxis) {
				q = AnimationMath.neutralAngleAxisToGlMatrixQuat(keyBracket.before.value);
				return AnimationMath.glMatrixQuatToNeutral(q);
			} else if (valueType === AnimationTrackValueType.Quaternion) {
				q = AnimationMath.neutralQuatToGlMatrixQuat(keyBracket.before.value);
				return AnimationMath.glMatrixQuatToNeutral(q);
			}
			return keyBracket.before.value;
		}

		var k = 0;
		if (keyBracket.before.time !== keyBracket.after.time) {
			k = (keyBracket.time - keyBracket.before.time) / (keyBracket.after.time - keyBracket.before.time);
		}

		return AnimationMath.interpolate(valueType, keyBracket.before, keyBracket.after, k, track);
	};

	AnimationPlayer.getBoundaryKey = function(track, isStart) {

		var keyCount = track.getKeysCount();
		var key;
		if (isStart) {
			key = track.getKey(0);
		} else {
			key = track.getKey(keyCount - 1);
		}

		var valueType = track.getKeysType();
		var q, result;
		if (valueType === AnimationTrackValueType.Euler) {
			q = AnimationMath.neutralEulerToGlMatrixQuat(key.value);
			result = { value: AnimationMath.glMatrixQuatToNeutral(q),
						time: key.time };
		} else if (valueType === AnimationTrackValueType.Quaternion) {
			q = AnimationMath.neutralQuatToGlMatrixQuat(key.value);
			result = { value: AnimationMath.glMatrixQuatToNeutral(q),
				time: key.time };
		} else if (valueType !== AnimationTrackValueType.AngleAxis) {
			result = key;
		} else {
			var key1;
			var k = 0;
			if (isStart) {
				key1 = key;
				if (keyCount > 1) {
					key1 = track.getKey(1);
				}
				k = 0;
			} else {
				key1 = key;
				if (keyCount > 1) {
					key = track.getKey(keyCount - 2);
					k = 1;
				}
			}
			q =  AnimationMath.interpolate(valueType, key, key1,  k, track);
			result = { value: q, time: isStart ? key.time : key1.time };
		}
		return result;
	};


	AnimationPlayer.prototype._getKeyFramesBracket = function(time, track) {
		var keyCount = track.getKeysCount();

		// keybracket: time + keyframe before that time + keyframe after that time.
		var result = {
			time: time,
			before: undefined,
			after: undefined
		};

		// get key before and after time specified
		for (var idx = 0; idx < keyCount; idx++) {
			var key = track.getKey(idx);
			if (key.time === time) {
				result.before = result.after = key;
			} else if (key.time > time) {
				result.before = (idx === 0 ? undefined : track.getKey(idx - 1));
				result.after = key;
				break;
			}
		}

		if (!result.before && !result.after && keyCount > 0) {
			result.before = track.getKey(keyCount - 1);
		}

		// check if we need to cycle forward or backward
		if (keyCount > 1 && (!result.after || !result.before) && (track.isCycleForward() || track.isCycleBackward())) {
			// map requested time to be inside a time range of the track
			var trackStartTime = track.getKey(0).time;
			var trackDuration = track.getKey(keyCount - 1).time - trackStartTime;

			var repetition = Math.floor((time - trackStartTime) / trackDuration);
			var timeInCycle = time - trackDuration * repetition;

			return this._getKeyFramesBracket(timeInCycle, track);
		}

		return result;
	};

	AnimationPlayer.prototype._collectNodeChangesFromSequenceBoundaryKeys = function(nodeChanges, sequence, isFront, isReversed, playbackStartTime) {
		var animations = sequence.getNodeAnimation();

		var addNodeChange = function(node, property, key) {
			if (!node || !property || !key) {
				return;
			}
			var data = nodeChanges.get(node);
			if (data && data.hasOwnProperty(property)) {
				if (data && data.animationProperties && data.animationProperties[property]) { // in actiion sequence
					return;
				}

				if (data && data.isFront && !isFront) { // already defined by the end value of a front sequence, back sequence is not used
					return;
				}

				if (data && data.isFront && isFront && data.keyTime > key.time + playbackStartTime) { // a closer key is already defined
					return;
				}

				if (data && !data.isFront && !isFront && data.keyTime < key.time + playbackStartTime) { // a closer key is already defined
					return;
				}
			}

			if (!data) {
				data = {};
				nodeChanges.set(node, data);
			}

			data[property] = key.value;
			data.keyTime = key.time + playbackStartTime;
			data.isFront = isFront;
		};

		animations.forEach(function(animationData) {
			for (var trackType in AnimationTrackType) {
				var type = AnimationTrackType[trackType];
				var track = animationData[type];
				if (track) {
					var key = AnimationPlayer.getBoundaryKey(track, (!isFront && !isReversed) || (isFront && isReversed));
					addNodeChange(animationData.nodeRef, type, key);
				}
			}
		}, this);
	};

	AnimationPlayer.prototype._collectNodeChangesFromPlaybackBoundaryKeys = function(currentTime, nodeChanges, playback) {
		var sequence = playback.getSequence();

		if (!sequence) {
			return;
		}

		var timeInPlayback = currentTime - playback.getStartTime();
		var playbackPlayTime = sequence.getDuration() * playback.getTimeScale() * playback.getRepeats();

		if (timeInPlayback < 0) {
			this._collectNodeChangesFromSequenceBoundaryKeys(nodeChanges, sequence, false, playback.getReversed(), playback.getStartTime());
		} else if (timeInPlayback > playback.getPreDelay() + playbackPlayTime)  {
			this._collectNodeChangesFromSequenceBoundaryKeys(nodeChanges, sequence, true, playback.getReversed(), playback.getStartTime());
		}
	};


	AnimationPlayer.prototype._collectSequenceNodeChanges = function(time, nodeChanges, sequence, infiniteTracksOnly) {

		var animations = sequence.getNodeAnimation();

		var addNodeChange = function(node, property, value) {
			if (!node || !property || !value) {
				return;
			}

			var data = nodeChanges.get(node);
			if (!data) {
				data = {};
				data.animationProperties = {};
				nodeChanges.set(node, data);
			}
			data[property] = value;
			data.animationProperties[property] = true;
		};

		animations.forEach(function(animationData) {
			var keyBracket;
			for (var trackType in AnimationTrackType) {
				var type = AnimationTrackType[trackType];
				var track = animationData[type];
				if (track && (!infiniteTracksOnly || (infiniteTracksOnly && track.isInfinite()))) {
					keyBracket = this._getKeyFramesBracket(time, track);
					var value = this._interpolate(track.getKeysType(), keyBracket, track);
					addNodeChange(animationData.nodeRef, type, value);
				}
			}

		}, this);
	};

	AnimationPlayer.prototype._collectPlaybackNodeChanges = function(currentTime, nodeChanges, playback) {
		var sequence = playback.getSequence();

		if (!sequence) {
			return;
		}

		var timeInPlayback = currentTime - playback.getStartTime();

		// playback isn't started yet
		if (timeInPlayback < 0) {
			return;
		}

		// playback duration without pre- and post- delays
		var playbackPlayTime = sequence.getDuration() * playback.getTimeScale() * playback.getRepeats();

		// time scaled back to the sequence
		var sequenceTime = (timeInPlayback - playback.getPreDelay()) / playback.getTimeScale();
		// repeats
		if (sequenceTime > 0 && sequenceTime % playback.getSequence().getDuration() === 0) {
			sequenceTime = sequence.getDuration();
		} else {
			sequenceTime = sequenceTime % playback.getSequence().getDuration();
		}

		// take reversed flag into account
		sequenceTime = playback.getReversed() ? playback.getSequence().getDuration() - sequenceTime : sequenceTime;

		if (timeInPlayback < playback.getPreDelay()) {
			// do nothing
		} else if (timeInPlayback > playback.getPreDelay() + playbackPlayTime)  {
			// apply only infinite tracks
			this._collectSequenceNodeChanges(sequenceTime, nodeChanges, playback.getSequence(), true);
		} else {
			// apply all sequence tracks
			this._collectSequenceNodeChanges(sequenceTime, nodeChanges, playback.getSequence(), false);
		}

	};

	AnimationPlayer.prototype._collectNodeChanges = function() {
		var nodeChanges = new Map();
		var playbacks = this._playbackCollection.getPlaybacks();
		var currentTime = this.getTime();
		var idx;
		for (idx = 0; idx < playbacks.length; idx++) {
			this._collectPlaybackNodeChanges(currentTime, nodeChanges, playbacks[idx]);
		}

		for (idx = 0; idx < playbacks.length; idx++) {
			this._collectNodeChangesFromPlaybackBoundaryKeys(currentTime, nodeChanges, playbacks[idx]);
		}

		return nodeChanges;
	};

	/**
	 * Starts playing animation from the current time position.
	 * @returns {sap.ui.vk.AnimationPlayer} <code>this</code> to allow method chaining.
	 * @public
	 */
	AnimationPlayer.prototype.play = function() {
		this._lastFrameTimestamp = undefined;
		this._frameId = window.requestAnimationFrame(this._step);

		vkCore.getEventBus().publish("sap.ui.vk", "animationPlayStateChanged", {
			source: this,
			view: this._playbackCollection,
			playing: true,
			stopped: false,
			endOfAnimation: false
		});

		this.fireStateChanged({
			playing: true,
			stopped: false
		});

		return this;
	};

	/**
	 * Stops playing animation.
	 * @returns {sap.ui.vk.AnimationPlayer} <code>this</code> to allow method chaining.
	 * @public
	 */
	AnimationPlayer.prototype.stop = function() {
		if (this._frameId) {
			window.cancelAnimationFrame(this._frameId);
			this._frameId = undefined;
		}

		this._lastFrameTimestamp = undefined;

		this.fireStateChanged({
			playing: false,
			stopped: true,
			endOfAnimation: this.getTime() >= this.getTotalDuration()
		});

		vkCore.getEventBus().publish("sap.ui.vk", "animationPlayStateChanged", {
			source: this,
			view: this._playbackCollection,
			playing: false,
			stopped: true,
			endOfAnimation: this.getTime() >= this.getTotalDuration()
		});

		return this;
	};

	/**
	 * Activate specified view
	 *
	 * @param {sap.ui.vk.View} view view object definition
	 * @param {boolean} preventAnimation if true, doesn't move object into animation's initial position
	 * @returns {sap.ui.vk.AnimationPlayer} return this
	 * @private
	 */
	AnimationPlayer.prototype.activateView = function(view, preventAnimation) {
		this.stop();

		this._currentPlayback = undefined;

		if (!preventAnimation) {
			this._playbackCollection = view;
		} else {
			this._playbackCollection = undefined;
		}

		this.setTime(0);

		if (preventAnimation) {
			this._playbackCollection = view;
		}

		return this;
	};

	AnimationPlayer.prototype._getAbsoluteTime = function(time, playbackIndex) {
		if (!this._playbackCollection || !Array.isArray(this._playbackCollection.getPlaybacks())) {
			return -1;
		}
		var playbacks = this._playbackCollection.getPlaybacks();
		if (playbackIndex < 0 || playbackIndex >= playbacks.length) {
			return -1;
		}

		var playback = this._playbackCollection.getPlayback(playbackIndex);
		if (!playback || playback.getDuration() < time || time < 0) {
			return -1;
		}

		var absoluteTime = time;
		var idx = 0;
		while (idx < playbackIndex) {
			var duration = playbacks[idx].getDuration();
			absoluteTime += duration;
			idx++;
		}

		return absoluteTime;
	};

	AnimationPlayer.prototype._findPlaybackByAbsoluteTime = function(time) {

		if (!this._playbackCollection || !Array.isArray(this._playbackCollection.getPlaybacks())) {
			return undefined;
		}

		var playbacks = this._playbackCollection.getPlaybacks();
		var lastPlaybackIndex = -1;
		var lastPlaybackStart = -1;
		playbacks.forEach(function(playback, index) {
			if (playback.getStartTime() > lastPlaybackStart) {
				lastPlaybackIndex = index;
				lastPlaybackStart = playback.getStartTime();
			}
		});

		var idx = 0;
		while (idx < playbacks.length) {
			var duration = playbacks[idx].getDuration();
			var startTime = playbacks[idx].getStartTime();


			if ((idx !== lastPlaybackIndex && time >= startTime && time < (startTime + duration)) ||
				(idx === lastPlaybackIndex && time >= startTime && time <= (startTime + duration))) {

				return playbacks[idx];
			}
			idx++;
		}

		return undefined;
	};


	return AnimationPlayer;
});
