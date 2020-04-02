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

	// ////////////////////ERROR CODES://////////////////////////////
	// ENCRYPTED: -19
	// FILENOTFOUND: -18
	// NOTINITIALIZED: -17
	// WRONGVERSION: -16
	// MISSINGEXTENSION: -15
	// ACCESSDENIED: -14
	// NOINTERFACE: -13
	// OUTOFMEMORY: -12
	// INVALIDCALL: -11
	// NOTFOUND: -10
	// BADARG: -9
	// FAIL: -8
	// BADTHREAD: -7
	// BADFORMAT: -6
	// FILEERROR: -5
	// NOTIMPLEMENTED: -4
	// HARDWAREERROR: -3
	// INTERRUPTED: -1
	// FALSE: 0
	// OK: 1
	// PROCESSED: 2
	// ALREADYINITIALIZED: 3

	// ////////////////////////   START   ////////////////////////////
	// var dvlModulePath = "./resources/sap/ve";
	// jQuery.sap.registerModulePath("sap.ve", dvlModulePath);

	// ////////////////    GLOBALS    ///////////////////

	var oViewer, sceneId, childNodes, parts, rendererInstance, libraryInstance, coreToken, rendererToken, canvas;

	////////////////////////////////////////////////////

	oViewer = new Viewer({
		webGLContextAttributes: { preserveDrawingBuffer: true },
		runtimeSettings: { totalMemory: 16777216 }
	});
	oViewer.placeAt("content");

	QUnit.test("Generic tests", function(assertMain) {
		var done = assertMain.async();

		oViewer.attachSceneLoadingFailed(function() {
			assertMain.ok(false, "Model loading failed");
			done();
		});

		oViewer.attachSceneLoadingSucceeded(function() {
			assertMain.ok(true, "Model loading succeeded");

			oViewer.oDvl = oViewer.getGraphicsCore().getApi(GraphicsCoreApi.LegacyDvl);
			sceneId = oViewer.oDvl.Settings.LastLoadedSceneId;
			oViewer.oDvl.Renderer.SetOption(sap.ve.dvl.DVLRENDEROPTION.DVLRENDEROPTION_CLEAR_COLOR_BUFFER, true);

			QUnit.test("Initialization", function(assert) {
				assert.ok(sap.ui.vk, "Library is available");
				assert.ok(!!oViewer, "Viewer control is available");
			});

			// TEST SET
			QUnit.test("Check all globals", function(assert) {
				// Global variables
				sceneId = oViewer.oDvl.Settings.LastLoadedSceneId;
				parts = oViewer.oDvl.Scene.BuildPartsList(sceneId);
				rendererInstance = oViewer.oDvl.Core.GetRendererPtr();
				libraryInstance = oViewer.oDvl.Core.GetLibraryPtr();
				coreToken = oViewer.oDvl.Settings.CoreToken;
				rendererToken = oViewer.oDvl.Settings.RendererToken;
				canvas = oViewer.getGraphicsCore()._canvas.id;
				childNodes = oViewer.oDvl.Scene.RetrieveSceneInfo(sceneId,
					sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_CHILDREN |
					sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_SELECTED |
					sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_LOCALIZATION_PREFIX |
					sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_DIMENSIONS).ChildNodes;
				assert.ok(sceneId, "sceneId: " + sceneId);
				assert.ok(parts, "parts");
				assert.ok(rendererInstance, "rendererInstance: " + rendererInstance);
				assert.ok(libraryInstance, "libraryInstance: " + libraryInstance);
				assert.ok(coreToken, "coreToken: " + coreToken);
				assert.ok(rendererToken, "rendererToken: " + rendererToken);
				assert.ok(canvas, "Canvas ID: " + canvas);
				assert.ok(childNodes, "childNodes: " + childNodes);
			});

			// need to change "ChildNodes" with every dvl build
			QUnit.test("Scene.Retrieve SceneInfo", function(assert) {
				var obj = oViewer.oDvl.Scene.RetrieveSceneInfo(sceneId,
					sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_CHILDREN |
					sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_SELECTED |
					sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_LOCALIZATION_PREFIX |
					sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_DIMENSIONS);
				var childNodes = oViewer.oDvl.Scene.RetrieveSceneInfo(sceneId,
					sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_CHILDREN |
					sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_SELECTED |
					sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_LOCALIZATION_PREFIX |
					sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_DIMENSIONS).ChildNodes;
				assert.ok(sceneId);
				assert.deepEqual(obj,
						{ "ChildNodes": childNodes,
						  "LocalizationPrefix": "",
						  "SceneDimensions": [ -16.665, -56.6285, 54.174, 16.665, 16.665, 112.618 ],
						  "SelectedNodes": []
						});
			});

			// Nothing selected = empty info
			QUnit.test("Scene.GetNodeSelectionInfo", function(assert) {
				var obj = oViewer.oDvl.Scene.GetNodeSelectionInfo(sceneId);
				assert.deepEqual(obj,
						{ "HiddenSelectedNodesCount": 0,
						  "TotalSelectedNodesCount": 0,
						  "VisibleSelectedNodesCount": 0
						});
			});

			QUnit.test("Scene.RetrieveNodeInfo", function(assert) {
				var nodeRef = oViewer.oDvl.Scene.RetrieveSceneInfo(sceneId, sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_CHILDREN |
					sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_SELECTED |
					sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_LOCALIZATION_PREFIX |
					sap.ve.dvl.DVLSCENEINFO.DVLSCENEINFO_DIMENSIONS).ChildNodes[0]; // big box
				var obj = oViewer.oDvl.Scene.RetrieveNodeInfo(sceneId, nodeRef,
						sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_ASSETID |
						sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_CHILDREN |
						sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_FLAGS |
						sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_HIGHLIGHT_COLOR |
						sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_NAME |
						sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_OPACITY |
						sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_PARENTS |
						sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_UNIQUEID |
						sap.ve.dvl.DVLNODEINFO.DVLNODEINFO_URI);

				assert.deepEqual(obj,
						{ "AssetID": "",
						  "ChildNodes": [],
						  "Flags": 536876033,
						  "HighlightColor": 0,
						  "NodeName": "colorBox",
						  "Opacity": 1,
						  "ParentNodes": [],
						  "URIs": [],
						  "UniqueID": "{C6D85041-5F8C-4A46-8824-320479BE102C}\n#16"
						});
			});

			// works, but how to get "nodeName" programmatically?
			QUnit.test("Scene.RetrieveMetadata", function(assert) {
				var nodeName = "smallBox"; // How to get it programmatically?
				var nodeRef = oViewer.oDvl.Scene.FindNodes(sceneId, sap.ve.dvl.DVLFINDNODETYPE.DVLFINDNODETYPE_NODE_NAME,
									sap.ve.dvl.DVLFINDNODEMODE.DVLFINDNODEMODE_SUBSTRING, nodeName).nodes[0];
				var m = oViewer.oDvl.Scene.RetrieveMetadata(sceneId, nodeRef);
				assert.deepEqual(m.metadata, {
					"Colors": {
						"Back": "Purple",
						"Bottom": "Black",
						"Front": "Red",
						"Left": "Yellow",
						"Right": "Green",
						"Top": "Blue"
					},
					"Language1": {
						"Chinese": "您好",
						"English": "Hello",
						"French": "Bonjour",
						"German": "Hallo",
						"Korean": "안녕하세요.",
						"Russian": "Привет"
						},
					"Metadata1": {
						"Name": "Small box"
					}
				});
			});

			// "name" was doubled??, procedures ID is different all the time
			QUnit.test("Scene.RetrieveProcedures and RetrieveThumbnail", function(assert) {
				var res = oViewer.oDvl.Scene.RetrieveProcedures(sceneId);
				assert.deepEqual(res, { "portfolios": [
										{	"id": "i0000000300000002",
											"name": "Portfolio 1",
											"steps": [
												{ "id": "i0000000300000008", "name": "View 1 Right" },
												{ "id": "i0000000300000009", "name": "View 2 Front" }
											]
										},
										{	"id": "i0000000300000003",
											"name": "Portfolio 2",
											"steps": [
												{ "id": "i000000030000000a", "name": "View 1 Top" },
												{ "id": "i000000030000000b", "name": "View 2 Left Top Front" }
											]
										} ],
										"procedures": [
										{	"id": "i0000000300000000",
											"name": "Procedure 1",
											"steps": [
												{ "id": "i0000000300000004", "name": "Step 1-1" },
												{ "id": "i0000000300000005", "name": "Step 1-2" }
											]
										},
										{	"id": "i0000000300000001",
											"name": "Procedure 2",
											"steps": [
												{ "id": "i0000000300000006", "name": "Step 2-1" },
												{ "id": "i0000000300000007", "name": "Step 2-2" }
											]
										} ]
									});

				var procedures = oViewer.oDvl.Scene.RetrieveThumbnail(sceneId, res.procedures[0].steps[0].id);
				var portfolios = oViewer.oDvl.Scene.RetrieveThumbnail(sceneId, res.portfolios[0].steps[0].id);
				assert.deepEqual(procedures, "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");
				assert.deepEqual(portfolios, "iVBORw0KGgoAAAANSUhEUgAAAFAAAAA8CAIAAAB+RarbAAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC0UlEQVRoge1ZvW4UMRCez2zBCYRCEpCQkgJRAEKiQUK6Ap6AgqcgeYO8A38FNS8RKVcjqnSRKAihIBIK1+Qi7hAgpQCZwjly54vDeOx1vF6+5nS3tme+m288Yy966+sAqDWolFJn7UNSVK0KLxFVmIyw1lQ6/0pNMgS0+TwjbxLAlrT5osvlfHIOl8qW7BxuAdq3SysG4ZJSmiVpEJHWRFRA0WJL2gxrfqH2zOHkbAfzB65HV74uChZk5bCFZM3JYP7g1Z3XxqaefnT/+93Hw0eCNSVlKV1zchwMwOasZAVVXpYSRBhTRjDW1tEXmedZ1+HZtldPPRQRjnIe1lrX8ccpjH37TTQkugicPxI2AJnncSIMk2KxOR/7do5ocfwbaZ2FpGuIMAAQNFk7tJG2VNLxDw8RQ+1YB0QESr1LOxFP3gC6P+8R0UyQ6caP6zLP8W5rK9yzBiHrslQH6r8AyOy8UX+Ec2JLssODDJncIgglvXl1UzDLcO7udwVzY0Eo6fcXtl90XspM7gy2ZROjQEgYAfKMu2vcvH2LiD5+2GGOFx4eQggbi7HOG2/ffNnoLfBZKIgQ4qJZQSmhaQsbvYVnzzv88VJJB3AO/L8srK70V1eIXwGEu3RQDs9aDGhO+v3Og4fXdj/tMseLG4+oEQ6I+dLS4draIZ+FsPEIEWX0Vgc+azY+h2m8CzIHiw8PUXPYgu9rHZ/LAHHjIce/LXq65HW/Jc3hAFnyLTLPGwB8cjiHsuS0wpI3Ekg6clk6dTTHF59NSyhpwaS/c6OXJZ9dWlqHU+SwBddbS8CrDmdYlk41ecJO1viy5GnarywJzefUaZFPp4XRcCgwsVftCWYZLP9adj2am7ssWfHp59GTS8yx+DYaSWw0Fv/fPDQXvFuEgiLMI5LuzUMmKEjSk3DLuyBJT8L9Ur5QwuRM6fJz2Oq9C83hCVjxLFfSDrSO8B9HVnf0CofJnwAAAABJRU5ErkJggg==");
			});

			done();
		});

		oViewer.addContentResource(new ContentResource({
			source: "test-resources/sap/ui/vk/qunit/media/box.vds",
			sourceType: "vds",
			sourceId: "abc"
		}));
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
