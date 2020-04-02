/* global QUnit*/

sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vk/DownloadManager"
],
function(
	jQuery,
	DownloadManager
) {
	"use strict";

	/*
		Methods tested:
			Constructor
			attachItemSucceeded
			attachItemFailed
			attachAllItemsCompleted
			start
	*/

	var testConstructor = function(downloadManager, expectedSources) {
		QUnit.test("Constructor", function(assert) {
			assert.propEqual(downloadManager._sourcesToProcess, expectedSources, "The constructor has set the sources to be downloaded.");
			assert.strictEqual(downloadManager._maxParallelTasks, 4, "The constructor has set the max parallel tasks to 4.");
			assert.strictEqual(downloadManager._sourcesBeingProcessed.length, 0, "At the moment of instantiation, there are no sources being processed.");
		});
	};

	var testAttachItemSucceeded = function(sources, source, response) {
		QUnit.test("attachItemSucceeded", function(assert) {
			assert.notStrictEqual(sources.indexOf(source), -1, "The attached source is in the list of initial sources.");
			assert.ok(response instanceof ArrayBuffer, "The attached file is an instance of ArrayBuffer.");
		});
	};

	var testAttachAllItemsCompleted = function(totalItemsAttached) {
		QUnit.test("attachAllItemsCompleted", function(assert) {
			assert.strictEqual(totalItemsAttached, 2, "In total, two items were attached successfully.");
		});
	};

	var testAttachItemFailed = function(source, status) {
		QUnit.test("attachItemFailed", function(assert) {
			assert.strictEqual(source, "test-resources/sap/ui/vk/qunit/media/this_file_does_not_exist.jpg", "The item that failed to load is 'test-resources/sap/ui/vk/qunit/media/this_file_does_not_exist.jpg'");
			assert.strictEqual(status, 404, "The loading status is 404.");
		});
	};

	var testStart = function(downloadManagerBeforeStart, downloadManagerAfterStart) {
		QUnit.test("start", function(assert) {
			assert.strictEqual(downloadManagerBeforeStart._sourcesToProcess.length, 3, "Before starting, there are 3 sources to process.");
			assert.strictEqual(downloadManagerBeforeStart._sourcesBeingProcessed.length, 0, "Before starting, there are 0 sources being processed.");
			assert.strictEqual(downloadManagerAfterStart._sourcesToProcess.length, 0, "After starting, there are no sources to process.");
			assert.strictEqual(downloadManagerAfterStart._sourcesBeingProcessed.length, 3, "After starting, there are 3 sources being processed.");
		});
	};

	var sources = [
		"test-resources/sap/ui/vk/qunit/media/box.vds",
		"test-resources/sap/ui/vk/qunit/media/cat.jpg",
		"test-resources/sap/ui/vk/qunit/media/this_file_does_not_exist.jpg"
	];

	var downloadManager = new DownloadManager(sources, 4);

	QUnit.test("MAIN TEST", function(assertMain) {
		var done = assertMain.async();

		assertMain.ok(true, "The tests have started.");

		testConstructor(jQuery.extend(true, {}, downloadManager), sources);

		var totalItemsAttached = 0;
		downloadManager.attachItemSucceeded(function(event) {
				totalItemsAttached++;
				var source = event.getParameter("source");
				var response = event.getParameter("response");
				testAttachItemSucceeded(sources, source, response);
			}, this)
			.attachAllItemsCompleted(function(event) {
				testAttachAllItemsCompleted(totalItemsAttached);
				done();
			}, this)
			.attachItemFailed(function(event) {
				testAttachItemFailed(event.getParameter("source"), event.getParameter("status"));
			}, this);

		var downloadManagerBeforeStart = jQuery.extend(true, {}, downloadManager);
		downloadManager.start();
		var downloadManagerAfterStart = jQuery.extend(true, {}, downloadManager);

		testStart(downloadManagerBeforeStart, downloadManagerAfterStart);
	});

	QUnit.done(function() {
		jQuery("#content").hide();
	});
});
