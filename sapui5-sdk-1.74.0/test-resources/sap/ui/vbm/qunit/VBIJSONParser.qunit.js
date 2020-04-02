// QUnit.config.autostart = false;

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vbm/adapter3d/VBIJSONParser",
	"sap/ui/vbm/adapter3d/ObjectFactory",
	"sap/ui/vbm/library"
], function(
	jQuery,
	VBIJSONParser,
	ObjectFactory,
	library
) {
	"use strict";

	var factory = new ObjectFactory();

	////////////////////////////////////////////////////////////////////////////
	// region: Data Types

	// This is how context.dataTypes should look like.
	var dataTypes = [];

	// DetailData
	var detailData = factory.createDataType();
	dataTypes.push(detailData);
	detailData.name = "DetailData";
	var columnDataType = factory.createDataType();
	detailData.dataTypes.push(columnDataType);
	columnDataType.name = "Column";
	columnDataType.attributes.push(
		{ name: "Text", alias: "T", type: "string" }
	);

	// Boxes
	var boxes = factory.createDataType();
	dataTypes.push(boxes);
	boxes.name = "Boxes";
	boxes.key = "Key";
	boxes.minSel = "0";
	boxes.maxSel = "-1";
	boxes.attributes.push(
		{ "name": "GeoPosition", "alias": "A", "type": "vector" },
		{ "name": "ToolTip", "alias": "B", "type": "string" },
		{ "name": "Color", "alias": "C", "type": "color" },
		{ "name": "BorderColor", "alias": "D", "type": "color" },
		{ "name": "HotColor", "alias": "HC", "type": "string" },
		{ "name": "SelectColor", "alias": "SC", "type": "string" },
		{ "name": "FixDir", "alias": "E", "type": "boolean" },
		{ "name": "FixSize", "alias": "F", "type": "boolean" },
		{ "name": "Texture", "alias": "I", "type": "string" },
		{ "name": "6sidedTex", "alias": "6T", "type": "boolean" },
		{ "name": "Key", "alias": "K", "type": "string" },
		{ "name": "Scale", "alias": "S", "type": "vector" },
		{ "name": "Rotation", "alias": "Y", "type": "vector" },
		{ "name": "DisplayRole", "alias": "R", "type": "string" },
		{ "name": "DragData", "alias": "DD", "type": "string" },
		{ "name": "ZSorting", "alias": "Z", "type": "boolean" }
	);

	// Axles
	var axles = factory.createDataType();
	dataTypes.push(axles);
	axles.name = "Axles";
	axles.key = "Key";
	axles.minSel = "0";
	axles.maxSel = "-1";
	axles.attributes.push(
		{ "name": "GeoPosition", "alias": "A", "type": "vector" },
		{ "name": "ToolTip", "alias": "B", "type": "string" },
		{ "name": "Color", "alias": "C", "type": "color" },
		{ "name": "HotColor", "alias": "HC", "type": "string" },
		{ "name": "SelectColor", "alias": "SC", "type": "string" },
		{ "name": "FixDir", "alias": "E", "type": "boolean" },
		{ "name": "FixSize", "alias": "F", "type": "boolean" },
		{ "name": "Texture", "alias": "I", "type": "string" },
		{ "name": "Key", "alias": "K", "type": "string" },
		{ "name": "Scale", "alias": "S", "type": "vector" },
		{ "name": "Rotation", "alias": "Y", "type": "vector" },
		{ "name": "DisplayRole", "alias": "R", "type": "string" },
		{ "name": "DragData", "alias": "DD", "type": "string" },
		{ "name": "ZSorting", "alias": "Z", "type": "boolean" }
	);

	// Cabins
	var cabins = factory.createDataType();
	dataTypes.push(cabins);
	cabins.name = "Cabins";
	cabins.key = "Key";
	cabins.minSel = "0";
	cabins.maxSel = "-1";
	cabins.attributes.push(
		{ "name": "GeoPosition", "alias": "A", "type": "vector" },
		{ "name": "ToolTip", "alias": "B", "type": "string" },
		{ "name": "Color", "alias": "C", "type": "color" },
		{ "name": "HotColor", "alias": "HC", "type": "string" },
		{ "name": "SelectColor", "alias": "SC", "type": "string" },
		{ "name": "FixDir", "alias": "E", "type": "boolean" },
		{ "name": "FixSize", "alias": "F", "type": "boolean" },
		{ "name": "Texture", "alias": "I", "type": "string" },
		{ "name": "Key", "alias": "K", "type": "string" },
		{ "name": "Scale", "alias": "S", "type": "vector" },
		{ "name": "Rotation", "alias": "Y", "type": "vector" },
		{ "name": "DisplayRole", "alias": "R", "type": "string" },
		{ "name": "DragData", "alias": "DD", "type": "string" },
		{ "name": "ZSorting", "alias": "Z", "type": "boolean" }
	);

	// endregion: Data Types
	////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////
	// region: Scenes

	// This is how context.scene should look like.
	var scenes = [];

	var scene = factory.createScene();
	scenes.push(scene);
	scene.id                   = "MainScene";
	scene.position = "0.0;0.0;0";
	scene.zoom          = "0.8";
	scene.pitch         = "60.0";
	scene.yaw           = "140.0";
	scene.sceneGeo      = false;

	var voGroup;

	voGroup = factory.createVisualObjectGroup(scene);
	voGroup.id                     = "Box";
	voGroup.type                   = "{00100000-2012-0004-B001-BFED458C3076}";
	voGroup.datasource             = "Boxes";
	voGroup.isDataBound            = true;
	voGroup.isDirty                = false;
	voGroup.template.color         = { path: ["Color"] };
	voGroup.template.colorBorder   = { path: ["BorderColor"] };
	voGroup.template.dragdata      = { path: ["DragData"] };
	voGroup.template.fxdir         = { path: ["FixDir"] };
	voGroup.template.fxsize        = { path: ["FixSize"] };
	voGroup.template.hotDeltaColor = { path: ["HotColor"] };
	voGroup.template.normalize     = { value: "true" };
	voGroup.template.pos           = { path: ["GeoPosition"] };
	voGroup.template.rot           = { path: ["Rotation"] };
	voGroup.template.scale         = { path: ["Scale"] };
	voGroup.template.selectColor   = { path: ["SelectColor"] };
	voGroup.template.texture       = { path: ["Texture"] };
	voGroup.template.texture6      = { value: "" };
	voGroup.template.tooltip       = { path: ["ToolTip"] };
	voGroup.template.zsort         = { path: ["ZSorting"] };

	voGroup = factory.createVisualObjectGroup(scene);
	voGroup.id                     = "Axle";
	voGroup.type                   = "{00100000-2012-0070-1000-35762CF28B6B}";
	voGroup.datasource             = "Axles";
	voGroup.isDataBound            = true;
	voGroup.isDirty                = false;
	voGroup.template.color         = { path: ["Color"] };
	voGroup.template.dragdata      = { path: ["DragData"] };
	voGroup.template.fxdir         = { path: ["FixDir"] };
	voGroup.template.fxsize        = { path: ["FixSize"] };
	voGroup.template.hotDeltaColor = { path: ["HotColor"] };
	voGroup.template.model         = { value: "Axle.dae" };
	voGroup.template.normalize     = { value: "true" };
	voGroup.template.pos           = { path: ["GeoPosition"] };
	voGroup.template.rot           = { path: ["Rotation"] };
	voGroup.template.scale         = { path: ["Scale"] };
	voGroup.template.selectColor   = { path: ["SelectColor"] };
	voGroup.template.texture       = { path: ["Texture"] };
	voGroup.template.tooltip       = { path: ["ToolTip"] };
	voGroup.template.zsort         = { path: ["ZSorting"] };

	voGroup = factory.createVisualObjectGroup(scene);
	voGroup.id                     = "Cabin";
	voGroup.type                   = "{00100000-2012-0070-1000-35762CF28B6B}";
	voGroup.datasource             = "Cabins";
	voGroup.isDataBound            = true;
	voGroup.isDirty                = false;
	voGroup.template.color         = { path: ["Color"] };
	voGroup.template.dragdata      = { path: ["DragData"] };
	voGroup.template.fxdir         = { path: ["FixDir"] };
	voGroup.template.fxsize        = { path: ["FixSize"] };
	voGroup.template.hotDeltaColor = { path: ["HotColor"] };
	voGroup.template.model         = { value: "Cabin.dae" };
	voGroup.template.normalize     = { value: "true" };
	voGroup.template.pos           = { path: ["GeoPosition"] };
	voGroup.template.rot           = { path: ["Rotation"] };
	voGroup.template.scale         = { path: ["Scale"] };
	voGroup.template.selectColor   = { path: ["SelectColor"] };
	voGroup.template.texture       = { path: ["Texture"] };
	voGroup.template.tooltip       = { path: ["ToolTip"] };
	voGroup.template.zsort         = { path: ["ZSorting"] };

	// endregion: Scenes
	////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////
	// region: Windows

	// This is how context.windows should look like.
	var windows = [];

	var window = factory.createWindow();
	windows.push(window);
	window.id        = "Main";
	window.caption   = "MainWindow";
	window.type      = "default";
	window.refParent = "";
	window.refScene  = "MainScene";
	window.modal     = "true";

	// endregion: Windows
	////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////
	// region: Data

	// This is how context.data should look like.
	var data;
	var dataResultPromise = jQuery.getJSON("test-resources/sap/ui/vbm/qunit/data/adapter3d-data-result.json");

	// endregion: Data
	////////////////////////////////////////////////////////////////////////////

	////////////////////////////////////////////////////////////////////////////
	// region: Detail Windwow data

	var detailWindowData = [
		{
			"Column": [
				{ "Text": "Width" },
				{ "Text": "Height" },
				{ "Text": "Depth" },
				{ "Text": "Volume" },
				{ "Text": "Specific NetWeight of Package" }
			]
		},
		{
			"Column": [
				{ "Text": "0.500  m" },
				{ "Text": "0.500  m" },
				{ "Text": "0.500  m" },
				{ "Text": "0.125  m³" },
				{ "Text": "6.2500  kg" }
			]
		}
	];

	// endregion: Detail Windwow data
	////////////////////////////////////////////////////////////////////////////

	// The initial VBI JSON.
	var initialVBIJSON;
	var initialVBIJSONPromise = jQuery.getJSON("test-resources/sap/ui/vbm/qunit/data/adapter3d-initial.json");

	// The delta VBI JSON with the Data.Set section.
	var setDataVBIJSON;
	var setDataVBIJSONPromise = jQuery.getJSON("test-resources/sap/ui/vbm/qunit/data/adapter3d-data-set.json");

	// The delta VBI JSON with the Data.Remove section.
	var removeDataVBIJSON;
	var removeDataVBIJSONPromise = jQuery.getJSON("test-resources/sap/ui/vbm/qunit/data/adapter3d-data-remove.json");

	// The delta VBI JSON with detail data Windows, Scenes, and Data sections.
	var setDetailWindowVBIJSON;
	var setDetailWindowVBIJSONPromise = jQuery.getJSON("test-resources/sap/ui/vbm/qunit/data/adapter3d-detail-window-set.json");

	// The delta VBI JSON to remove detail data.
	var removeDetailWindowVBIJSON;
	var removeDetailWindowVBIJSONPromise = jQuery.getJSON("test-resources/sap/ui/vbm/qunit/data/adapter3d-detail-window-remove.json");

	Promise.all([initialVBIJSONPromise, setDataVBIJSONPromise, removeDataVBIJSONPromise, dataResultPromise, setDetailWindowVBIJSONPromise, removeDetailWindowVBIJSONPromise])
		.then(
			function resolved(results) {
				initialVBIJSON            = results[0];
				setDataVBIJSON            = results[1];
				removeDataVBIJSON         = results[2];
				data                      = results[3];
				setDetailWindowVBIJSON    = results[4];
				removeDetailWindowVBIJSON = results[5];
				QUnit.start();
			},
			function rejected(errors) {
				QUnit.only("Loading test data", function(assert) {
					assert.ok(false, "Loading test data failed.");
				});
				QUnit.start();
			}
		);

	QUnit.module("VBI JSON Parser", {
		beforeEach: function(assert) {
			this.context = {
				resources: new Map(),
				dataTypes: [],
				data: {},
				windows: [],
				scenes: [],
				actions: [],
				voQueues: {
					toAdd: new Map(), // scene -> array of visual objects to add
					toUpdate: new Map(), // scene -> array of visual objects to update.
					toRemove: new Map()  // scene -> array of visual objects to remove.
				},
				sceneQueues: {
					toAdd: [],
					toUpdate: [],
					toRemove: []
				},
				windowQueues: {
					toAdd: [],
					toUpdate: [],
					toRemove: []
				}
			};
			this.parser = new VBIJSONParser(this.context);
			this.factory = this.parser._factory;
		},

		afterEach: function(assert) {
			this.parser.destroy();
			this.parser = null;
			this.factory = null;
			this.context = null;
		}
	});

	QUnit.test("Constructor", function(assert) {
		assert.equal(this.parser._context, this.context, "Context is initialized.");
		assert.ok(this.parser._factory, "Object Factory is initialized.");
	});

	QUnit.test("Initial load", function(assert) {
		var parser = this.parser;
		var context = this.context;

		parser.loadVBIJSON(initialVBIJSON);

		assert.equal(context.resources.size, 4, "Parsed 4 resources.");
		assert.equal(context.resources.get("Cabin.dae").length, 63828, "Cabin.dae is parsed successfully.");
		assert.equal(context.resources.get("Axle.dae").length, 178420, "Axle.dae is parsed successfully.");
		assert.equal(context.resources.get("New_Frame_Transparent_2x2.png").length, 3216, "New_Frame_Transparent_2x2.png is parsed successfully.");
		assert.equal(context.resources.get("New_Cross_Frame_Transparent_2x2.png").length, 30796, "New_Cross_Frame_Transparent_2x2.png is parsed successfully.");

		assert.equal(context.dataTypes.length, 4, "Parsed 4 data types.");
		assert.deepEqual(context.dataTypes, dataTypes, "DataTypes are parsed successfully.");

		assert.equal(context.scenes.length, 1, "Parsed 1 scene.");
		assert.equal(context.scenes[0].voGroups.length, 3, "Parsed 3 visual object groups for scene 1.");
		assert.deepEqual(context.scenes, scenes, "Scenes are parsed successfully.");

		assert.equal(context.windows.length, 1, "Parsed 1 window.");
		assert.deepEqual(context.windows, windows, "Windows are parsed successfully.");
	});

	QUnit.test("Loading data", function(assert) {
		var parser = this.parser;
		var context = this.context;

		parser.loadVBIJSON(initialVBIJSON);
		parser.loadVBIJSON(setDataVBIJSON);

		assert.ok("Boxes" in context.data, "Boxes are parsed.");
		assert.ok("Axles" in context.data, "Axles are parsed.");
		assert.ok("Cabins" in context.data, "Cabins are parsed.");
		assert.deepEqual(context.data, data, "Data parsed successfully.");
	});

	QUnit.test("Removing data", function(assert) {
		var parser = this.parser;
		var context = this.context;
		var compare = function(keyValue, item) {
			return item.Key === keyValue;
		};

		parser.loadVBIJSON(initialVBIJSON);
		parser.loadVBIJSON(setDataVBIJSON);

		assert.ok(sap.ui.vbm.findInArray(context.data.Axles, compare.bind(undefined, "QPLpY6+KHueQh/KMyCjtpA==")) !== undefined, "Axle with id 'QPLpY6+KHueQh/KMyCjtpA==' is found.");
		assert.ok(sap.ui.vbm.findInArray(context.data.Boxes, compare.bind(undefined, "QPLpY6+KHueQh/C2vWLtoQ==")) !== undefined, "Box with id 'QPLpY6+KHueQh/C2vWLtoQ==' is found.");
		assert.ok(sap.ui.vbm.findInArray(context.data.Boxes, compare.bind(undefined, "QPLpY6+KHueQh/KMyCiNpA==")) !== undefined, "Box with id 'QPLpY6+KHueQh/KMyCiNpA==' is found.");

		parser.loadVBIJSON(removeDataVBIJSON);

		assert.ok(sap.ui.vbm.findInArray(context.data.Axles, compare.bind(undefined, "QPLpY6+KHueQh/KMyCjtpA==")) === undefined, "Axle with id 'QPLpY6+KHueQh/KMyCjtpA==' is removed successfully.");
		assert.ok(sap.ui.vbm.findInArray(context.data.Boxes, compare.bind(undefined, "QPLpY6+KHueQh/C2vWLtoQ==")) === undefined, "Box with id 'QPLpY6+KHueQh/C2vWLtoQ==' is removed successfully.");
		assert.ok(sap.ui.vbm.findInArray(context.data.Boxes, compare.bind(undefined, "QPLpY6+KHueQh/KMyCiNpA==")) === undefined, "Box with id 'QPLpY6+KHueQh/KMyCiNpA==' is removed successfully.");
	});

	QUnit.test("Loading and removing detail window", function(assert) {
		var parser = this.parser;
		var context = this.context;

		parser.loadVBIJSON(initialVBIJSON);
		parser.loadVBIJSON(setDetailWindowVBIJSON);

		assert.equal(context.scenes.length, 2, "Detail Data scene is loaded successfully.");
		assert.equal(context.windows.length, 2, "Detail Data window is loaded successfully.");
		assert.deepEqual(context.data.DetailData, detailWindowData, "Detail Data is loaded successfully.");

		parser.loadVBIJSON(removeDetailWindowVBIJSON);

		assert.equal(context.scenes.length, 1, "Detail Data scene is removed successfully.");
		assert.equal(context.windows.length, 1, "Detail Data window is removed successfully.");
	});
});
