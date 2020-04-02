/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/threejs/Scene",
	"sap/ui/vk/threejs/ViewStateManager",
	"sap/ui/vk/threejs/Viewport",
	"sap/ui/vk/AnimationPlayer",
	"sap/ui/vk/AnimationPlayback",
	"sap/ui/vk/AnimationTrackType",
	"sap/ui/vk/AnimationTrackValueType",
	"sap/ui/vk/View",
	"test-resources/sap/ui/vk/qunit/utils/ModuleWithContentConnector",
	"sap/ui/vk/threejs/thirdparty/three"
], function(
	jQuery,
	Scene,
	ViewStateManager,
	Viewport,
	AnimationPlayer,
	AnimationPlayback,
	AnimationTrackType,
	AnimationTrackValueType,
	View,
	loader,
	three
) {
	"use strict";

	var viewport = new Viewport();
	var viewStateManager, animationPlayer;
	viewport.placeAt("content");

	QUnit.moduleWithContentConnector("AnimationLoad", "test-resources/sap/ui/vk/qunit/media/stand_foot_rests.asm.json", "threejs.test.json", function(assert) {
		viewStateManager = new ViewStateManager({ contentConnector: this.contentConnector });
		viewport.setViewStateManager(viewStateManager);
		viewport.setContentConnector(this.contentConnector);
		animationPlayer = new AnimationPlayer({
			viewStateManager: viewStateManager
		});
	});

	QUnit.test("Animation", function(assert) {

		var scene = viewport.getScene();

		// sequences
		var sequenceName = "Test sequence 1";

		var sequence = scene.createSequence("sq1", {
			name: sequenceName,
			duration: 1.2
		});

		var view = new View();
		var playback = new AnimationPlayback();
		playback.setSequence(sequence);
		view.addPlayback(playback);
		animationPlayer.activateView(view);

		assert.deepEqual(scene.getSequences(), [ sequence ], "sequence list in the scene");

		assert.equal(sequence.getId(), "sq1", "sequence ID");
		assert.equal(sequence.getName(), sequenceName, "sequence name after creation");

		sequenceName = "Test sequence 1.1";
		sequence.setName(sequenceName);
		assert.equal(sequence.getName(), sequenceName, "sequence name after update");

		// joints
		sequence.setJoint([ {
			parent: "a",
			node: "b",
			translation: [ 1 ],
			quaternion: [ 2 ],
			scale: [ 3 ]
		},
		{
			parent: "a",
			node: "c",
			translation: [ 3 ],
			quaternion: [ 4 ],
			scale: [ 5 ]
		} ]);

		assert.ok(viewStateManager.getJoints(), "Joints exist in ViewStateManager");
		assert.equal(viewStateManager.getJoints().length, 2, "Joints updated in ViewStateManager");

		assert.equal(sequence.getJoint().length, 2, "joints count after create");
		assert.equal(sequence.getJoint({
			parent: "a"
		}).length, 2, "getJoint count for parent 'a'");

		assert.equal(sequence.getJoint({
			node: "c"
		}).length, 1, "getJoint count for node 'c'");

		assert.equal(sequence.getJoint({
			node: "invalid"
		}).length, 0, "getJoint count for unknown node ");

		sequence.removeJoint({
			node: "b"
		});
		assert.equal(sequence.getJoint().length, 1, "joints count after remove");
		assert.equal(viewStateManager.getJoints().length, 1, "Joints count in ViewStateManager after remove");

		sequence.removeJoint();
		assert.equal(sequence.getJoint().length, 0, "joints count after remove all");
		assert.equal(viewStateManager.getJoints().length, 0, "Joints count in ViewStateManager after remove all");

		// tracks
		var track = scene.createTrack("trk1", {
			trackValueType: AnimationTrackValueType.Vector3
		});

		assert.deepEqual(scene.getTracks(), [ track ], "track list in the scene");

		assert.equal(track.getId(), "trk1", "track ID");
		assert.equal(track.getKeysType(), AnimationTrackValueType.Vector3, "track key type after creation");
		assert.equal(track.getKeysCount(), 0, "track key count after creation");

		var keyValue = [ 1, 2, 3 ];
		track.insertKey(18, keyValue);
		assert.equal(track.getKeysCount(), 1, "track key count after key creation");

		var key = track.getKey(0);
		assert.equal(key.time, 18, "track key time after key creation");
		assert.deepEqual(key.value, keyValue, "track key value after key creation");

		keyValue = [ 5, 6, 7 ];
		track.updateKey(0, keyValue);

		key = track.getKey(0);
		assert.equal(key.time, 18, "track key time after key update");
		assert.deepEqual(key.value, keyValue, "track key value after key update");

		var keyIndex = track.findKeyIndex(10);
		assert.equal(keyIndex, 0, "track key index after find");

		track.removeKey(0);
		assert.equal(track.getKeysCount(), 0, "track key count after removeKey");

		// playbacks
		playback = new AnimationPlayback("plbk1");
		assert.equal(playback.getId(), "plbk1", "playback ID");
		assert.equal(playback.getStartTime(), 0, "playback start time");
		assert.equal(playback.getSequence(), null, "playback sequence");
		assert.equal(playback.getTimeScale(), 1, "playback speed");
		assert.equal(playback.getPreDelay(), 0, "playback pre delay");
		assert.equal(playback.getPostDelay(), 0, "playback post delay");
		assert.equal(playback.getRepeats(), 1, "playback repeat count");
		assert.equal(playback.getReversed(), false, "playback direction");

		playback.setStartTime(1);
		playback.setSequence(sequence);
		playback.setTimeScale(0.5);
		playback.setPreDelay(2);
		playback.setPostDelay(3);
		playback.setRepeats(4);
		playback.setReversed(true);

		assert.equal(playback.getStartTime(), 1, "playback start time");
		assert.equal(playback.getSequence(), sequence, "playback sequence");
		assert.equal(playback.getTimeScale(), 0.5, "playback speed");
		assert.equal(playback.getPreDelay(), 2, "playback pre delay");
		assert.equal(playback.getPostDelay(), 3, "playback post delay");
		assert.equal(playback.getRepeats(), 4, "playback repeat count");
		assert.equal(playback.getReversed(), true, "playback direction");

		// node's animation
		sequence.setNodeAnimation("node", AnimationTrackType.Opacity, track);
		assert.equal(sequence.getNodeAnimation("node", AnimationTrackType.Opacity), track, "animation for node - node and property set");
		assert.equal(sequence.getNodeAnimation("node", AnimationTrackType.Rotate), null, "animation for node - node and another property set");
		assert.deepEqual(sequence.getNodeAnimation("node", null), {
			opacity: track
		}, "animation for node - node and no property set");
		assert.deepEqual(sequence.getNodeAnimation(null, null), [ {
			nodeRef: "node",
			opacity: track
		} ], "animation for node - no node and no property set");
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
