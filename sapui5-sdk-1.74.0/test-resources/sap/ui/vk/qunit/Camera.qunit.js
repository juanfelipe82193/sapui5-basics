/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/Viewer",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/dvl/GraphicsCoreApi"
],
function(
	jQuery,
	Viewer,
	ContentResource,
	GraphicsCoreApi
) {
	"use strict";

	QUnit.test("DVLCamera", function(assert) {
		var done = assert.async();

		var oViewer = new Viewer({
			webGLContextAttributes : {
				preserveDrawingBuffer : true
			},
			runtimeSettings: { totalMemory: 16777216 }
		});
		oViewer.placeAt("content");

		oViewer.addContentResource(new ContentResource({
			source : "test-resources/sap/ui/vk/qunit/media/box.vds",
			sourceType : "vds",
			sourceId : "abc"
		}));

		function floatEqual(a, b) {
			assert.deepEqual(a.toFixed(4), b.toFixed(4));
		}

		function floatArraysEqual(a, b) {
			assert.deepEqual(typeof a, typeof b);
			assert.deepEqual(a.length, b.length);
			var equal = true;
			for (var i = 0; i < a.length; i++) {
				if (Math.abs(a[i] - b[i]) > 0.00001) {
					equal = false;
					break;
				}
			}
			assert.ok(equal, "Matrices are equal");
		}

		function testCamera(dvl, c, tn) {
			dvl.Camera.SetName(c, "Abc123");
			assert.deepEqual(dvl.Camera.GetName(c), "Abc123", "Camera name is ok");

			dvl.Camera.SetOrigin(c, 123, 456, 789);
			floatArraysEqual(dvl.Camera.GetOrigin(c), [ 123, 456, 789 ]);

			dvl.Camera.SetRotation(c, 30, 20, 10);
			floatArraysEqual(dvl.Camera.GetRotation(c), [ 30, 20, 10 ]); // [yaw, pitch, roll]

			floatArraysEqual(dvl.Camera.GetMatrix(c).matrix,
					[ 0.813798, 0.469846, 0.34202, 0,
						-0.543838, 0.823173, 0.163176, 0,
						-0.204874, -0.318796, 0.925417, 0,
						123, 456, 789, 1 ]);

			floatArraysEqual(dvl.Camera.GetTargetDirection(c), [ 0.813798, 0.469846, 0.34202 ]);
			floatArraysEqual(dvl.Camera.GetUpDirection(c), [ -0.204874, -0.318796, 0.925417 ]);

			var testMatrix = [ 	1, 0, 0, 0,
								0, 1, 0, 0,
								0, 0, 1, 0,
								12, 23, 34, 1 ];
			dvl.Camera.SetMatrix(c, testMatrix);
			floatArraysEqual(dvl.Camera.GetMatrix(c).matrix, testMatrix);
			floatArraysEqual(dvl.Camera.GetOrigin(c), [ 12, 23, 34 ]);
			floatArraysEqual(dvl.Camera.GetRotation(c), [ 0, 0, 0 ]);
			floatArraysEqual(dvl.Camera.GetTargetDirection(c), [ 1, 0, 0 ]);
			floatArraysEqual(dvl.Camera.GetUpDirection(c), [ 0, 0, 1 ]);

			dvl.Camera.SetTargetDirection(c, 0, 1, 0);
			floatArraysEqual(dvl.Camera.GetRotation(c), [ 90, 0, 0 ]);

			dvl.Camera.SetUpDirection(c, 0.7071, 0, 0.7071);
			floatArraysEqual(dvl.Camera.GetRotation(c), [ 90, 0, 45 ]);

			dvl.Camera.SetFOV(c, 51.2345);
			floatEqual(dvl.Camera.GetFOV(c), 51.2345);

			dvl.Camera.SetFOVBinding(c, sap.ve.dvl.DVLCAMERAFOVBINDING.HORZ);
			assert.deepEqual(dvl.Camera.GetFOVBinding(c), sap.ve.dvl.DVLCAMERAFOVBINDING.HORZ);
			dvl.Camera.SetFOVBinding(c, 10);
			assert.deepEqual(dvl.Camera.GetFOVBinding(c), sap.ve.dvl.DVLCAMERAFOVBINDING.HORZ);

			dvl.Camera.SetOrthoZoomFactor(c, 0.1234);
			floatEqual(dvl.Camera.GetOrthoZoomFactor(c), 0.1234, "Ortho zoom factor checked");

			assert.notEqual(tn, sap.ve.dvl.DVLID_INVALID);
			assert.notEqual(tn, c);
			dvl.Camera.SetTargetNode(c, tn);
			assert.deepEqual(dvl.Camera.GetTargetNode(c), tn, "Target node confirmed");
		}

		oViewer.attachSceneLoadingSucceeded(function(event) {
			var dvl = oViewer.getGraphicsCore().getApi(GraphicsCoreApi.LegacyDvl);
			var scene = dvl.Settings.LastLoadedSceneId;
			var tn1 = dvl.Scene.FindNodes(scene, sap.ve.dvl.DVLFINDNODETYPE.DVLFINDNODETYPE_NODE_NAME, sap.ve.dvl.DVLFINDNODEMODE.DVLFINDNODEMODE_EQUAL, "colorBox").nodes[0];
			var tn2 = dvl.Scene.FindNodes(scene, sap.ve.dvl.DVLFINDNODETYPE.DVLFINDNODETYPE_NODE_NAME, sap.ve.dvl.DVLFINDNODEMODE.DVLFINDNODEMODE_EQUAL, "smallBox").nodes[0];
			assert.notEqual(typeof tn1, "undefined", "Found node 'colorBox'");
			assert.notEqual(typeof tn2, "undefined", "Found node 'smallBox'");

			var c = dvl.Scene.GetCurrentCamera(scene);
			assert.deepEqual(typeof c, "string", "Camera ID exists");
			assert.notEqual(c, sap.ve.dvl.DVLID_INVALID, "Camera is valid");

			assert.deepEqual(dvl.Camera.GetName(c), "Camera", "Camera name is ok");
			floatArraysEqual(dvl.Camera.GetOrigin(c), [ 109.09, -129.072, 192.63 ]);
			floatArraysEqual(dvl.Camera.GetTargetDirection(c), [ -0.577096, 0.577096, -0.577858 ]);
			floatArraysEqual(dvl.Camera.GetUpDirection(c), [ -0.408611, 0.408603, 0.816138 ]);
			floatArraysEqual(dvl.Camera.GetRotation(c), [ 135, -35.3, -0.0003 ]); // [yaw, pitch, roll]
			assert.deepEqual(dvl.Camera.GetProjection(c), sap.ve.dvl.DVLCAMERAPROJECTION.ORTHOGRAPHIC);
			floatEqual(dvl.Camera.GetFOV(c), 30);
			assert.deepEqual(dvl.Camera.GetFOVBinding(c), 0);
			floatEqual(dvl.Camera.GetOrthoZoomFactor(c), 0.0197);
			assert.deepEqual(dvl.Camera.GetTargetNode(c), "iffffffffffffffff");
			floatArraysEqual(dvl.Camera.GetMatrix(c).matrix,
					[ -0.577096, 0.577096, -0.577858, 0,
						-0.707105, -0.707109, -0.0000044029, 0,
						-0.408611, 0.408603, 0.816138, 0,
						109.09, -129.072, 192.63, 1 ]);

			testCamera(dvl, c, tn1);

			var c2 = dvl.Scene.CreateCamera(scene, sap.ve.dvl.DVLCAMERAPROJECTION.PERSPECTIVE);
			assert.notEqual(c2, sap.ve.dvl.DVLID_INVALID);
			assert.notEqual(c2, c);
			assert.deepEqual(dvl.Camera.GetProjection(c2), sap.ve.dvl.DVLCAMERAPROJECTION.PERSPECTIVE);
			assert.deepEqual(dvl.Scene.RetrieveNodeInfo(scene, c2, sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_PARENTS).ParentNodes.length, 0);
			var res = dvl.Scene.ActivateCamera(scene, c2);
			assert.deepEqual(res, sap.ve.dvl.DVLRESULT.OK);
			assert.deepEqual(c2, dvl.Scene.GetCurrentCamera(scene));

			testCamera(dvl, c2, tn2);

			var c3 = dvl.Scene.CreateCamera(scene, sap.ve.dvl.DVLCAMERAPROJECTION.ORTHOGRAPHIC, tn1);
			assert.notEqual(c3, sap.ve.dvl.DVLID_INVALID);
			assert.notEqual(c3, c);
			assert.notEqual(c3, c2);
			assert.deepEqual(dvl.Camera.GetProjection(c3), sap.ve.dvl.DVLCAMERAPROJECTION.ORTHOGRAPHIC);
			assert.deepEqual(dvl.Scene.RetrieveNodeInfo(scene, c3, sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_PARENTS).ParentNodes[0], tn1);
			res = dvl.Scene.ActivateCamera(scene, c3);
			assert.deepEqual(res, sap.ve.dvl.DVLRESULT.OK);
			assert.deepEqual(c3, dvl.Scene.GetCurrentCamera(scene));

			testCamera(dvl, c3, tn2);
			done();
		});
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
