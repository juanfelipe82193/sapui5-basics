/* global QUnit */
/**
 * Defines a module that creates an instance of sap.ui.vk.Viewer.
 *
 * If loading a model succeeds the module context contains field called 'contentConnector'.
 *
 * @example <caption>Example of usage:</caption>
 *
 * <pre>
 *     QUnit.moduleWithContentConnector("Module name", "a/b/c/something.vds", "vds", function(assert) {
 *         this.nodeHierarchy = this.contentConnector.getContent().scene.getDefaultNodeHierarchy();
 *     });
 * </pre>
 *
 * @param {string} name                 Label for this group of tests.
 * @param {string} url                  URL to load the model from.
 * @param {string} sourceType           Source type of the model.
 * @param {function} onLoadingSucceeded A callback that is called when the model is loaded successfully.
 *                                      The callback takes one parameter 'assert'.
 *                                      The 'this' context is the same as in module hooks.
 */

sap.ui.define([
	"sap/ui/vk/dvl/ContentManager",
	"sap/m/App",
	"sap/ui/vk/ContentConnector",
	"sap/ui/vk/ContentResource",
	"sap/ui/vk/threejs/thirdparty/three"
],
function(
	DvlContentManager,
	App,
	ContentConnector,
	ContentResource,
	three
) {
	"use strict";

	DvlContentManager.setRuntimeSettings({ totalMemory: 16777216 * 2 });

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

	QUnit.moduleWithContentConnector = function(name, url, sourceType, onLoadingSucceeded) {
		QUnit.module(name, {
			beforeEach: function(assert) {
				var that = this;
				return new Promise(function(resolve, reject) {
					var contentConnector = new ContentConnector({
							contentResources: [
								new ContentResource({
									source: url,
									sourceType: sourceType,
									sourceId: "abc"
								})
							],
							contentChangesFinished: function(event) {
								var failureReason = event.getParameter("failureReason");
								var content = event.getParameter("content");
								if (failureReason) {
									reject(new Error("Loading model failed."));
								} else if (content) {
									assert.ok(true, "Model loaded successfully.");
									that.contentConnector = this;
									if (onLoadingSucceeded) {
										onLoadingSucceeded.call(that, assert);
									}
									resolve();
								}
							}
						});
					var app = new App();
					app.addDependent(contentConnector);
					app.placeAt("content");
				});
			},

			afterEach: function(assert) {
				if (this.contentConnector) {
					this.contentConnector.destroy();
					assert.ok(this.contentConnector.bIsDestroyed, "ContentConnector destroyed.");
					delete this.contentConnector;
				}
			}
		});
	};
});
