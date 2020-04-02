/* global QUnit */
/**
 * Defines a module that creates an instance of sap.ui.vk.Viewer.
 *
 * If loading a model succeeds the module context contains field called 'viewer'.
 *
 * @example <caption>Example of usage:</caption>
 *
 * <pre>
 *     QUnit.moduleWithViewer("Module name", "a/b/c/something.vds", function(assert) {
 *         this.nodeHierarchy = this.viewer.getScene().getDefaultNodeHierarchy();
 *     });
 * </pre>
 *
 * @param {string} name                 Label for this group of tests.
 * @param {string} url                  URL to load a model from.
 * @param {string} sourceType           Source type of the model.
 * @param {function} onLoadingSucceeded A callback that is called when the model is loaded successfully.
 *                                      The callback takes one parameter 'assert'.
 *                                      The 'this' context is the same as in module hooks.
 */

sap.ui.define([
	"sap/ui/vk/dvl/ContentManager",
	"sap/ui/vk/Viewer",
	"sap/ui/vk/ContentConnector",
	"sap/ui/vk/ContentResource"
],
function(
	DvlContentManager,
	Viewer,
	ContentConnector,
	ContentResource
) {
	"use strict";

	DvlContentManager.setRuntimeSettings({ totalMemory: 16777216 });

	var testLoader = function(parentNode, contentResource) {
		return new Promise(function(resolve, reject) {
			var loader = new THREE.ObjectLoader();
			loader.load(
				contentResource.getSource(),
				function(obj) {
					parentNode.add(obj);
					resolve({
						node: parentNode,
						contentResource: contentResource
					});
				},
				function(xhr) {
				},
				function(xhr) {
					reject(new Error("Not object json"));
				}
			);
		});
	};

	ContentConnector.addContentManagerResolver({
		pattern: "threejs.test.json",
		dimension: 3,
		contentManagerClassName: "sap.ui.vk.threejs.ContentManager",
		settings: {
			loader: testLoader
		}
	});

	QUnit.moduleWithViewer = function(name, url, sourceType, onLoadingSucceeded) {

		QUnit.module(name, {
			beforeEach: function(assert) {
				var that = this;
				return new Promise(function(resolve, reject) {
					new Viewer({
						width: "100%",
						height: "400px",
						contentResources: [
							new ContentResource({
								source: url,
								sourceType: sourceType,
								sourceId: "abc"
							})
						],
						sceneLoadingFailed: function(event) {
							reject(new Error("Loading model failed."));
						},
						sceneLoadingSucceeded: function(event) {
							assert.ok(true, "Model loaded successfully.");
							that.viewer = this;
							if (onLoadingSucceeded) {
								onLoadingSucceeded.call(that, assert);
							}
							resolve();
						}
					}).placeAt("content");
				});
			},

			afterEach: function(assert) {
				if (this.viewer) {
					this.viewer.destroy();
					assert.ok(this.viewer.bIsDestroyed, "Viewer destroyed.");
					delete this.viewer;
				}
			}
		});
	};
});
