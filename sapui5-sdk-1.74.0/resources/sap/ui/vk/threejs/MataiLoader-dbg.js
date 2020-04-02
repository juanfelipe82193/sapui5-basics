/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

// Provides object sap.ui.vk.threejs.MataiLoader.
sap.ui.define([
	"sap/base/Log",
	"sap/ui/base/ManagedObject",
	"../getResourceBundle",
	"./SceneBuilder"
], function(
	Log,
	ManagedObject,
	getResourceBundle,
	SceneBuilder
) {
	"use strict";

	var ProgressPhase = {
		FinishedTree: getResourceBundle().getText("SCENE_CONTEXT_FINISHED_TREE"),
		LoadingGeometries: getResourceBundle().getText("SCENE_CONTEXT_LOADING_GEOMETRIES"),
		LoadingTextures: getResourceBundle().getText("SCENE_CONTEXT_LOADING_TEXTURES"),
		LoadingModelViews: getResourceBundle().getText("SCENE_CONTEXT_LOADING_MODEL_VIEWS")
	};

	var MataiLoader = ManagedObject.extend("sap.ui.vk.threejs.MataiLoader", {
		metadata: {
			events: {
				contentChangesProgress: {
					parameters: {
						source: "any",
						phase: "string",
						percent: "float"
					}
				}
			}
		}
	});

	function updateProgress(sceneBuilder) {
		var progress = sceneBuilder._progress;
		var percentage = 40 + 60 * (progress.totalCount ? progress.count / progress.totalCount : 1);
		// console.log(progress.phase, percentage, progress.count, progress.totalCount);

		sceneBuilder._loader.fireContentChangesProgress({
			source: sceneBuilder._countentResource.getSource(),
			phase: progress.phase,
			percentage: Math.min(percentage, 100)
		});
	}

	var getWorker = (function() {
		var promise;
		return function() {
			return promise || (promise = new Promise(function(resolve) {
				var worker = new Worker(sap.ui.require.toUrl("sap/ui/vk/threejs/MataiLoaderWorker.js"));

				worker.onmessage = function(event) {
					var data = event.data;
					if (data.ready) {
						resolve(worker);
					} else {
						var sceneBuilder = SceneBuilder.getById(data.sceneBuilderId);
						sceneBuilder[data.method].apply(sceneBuilder, data.args);

						switch (data.method) {
							case "setScene":
								var info = data.args[0];
								sceneBuilder._progress = {
									phase: ProgressPhase.FinishedTree,
									totalCount: info.meshCount + info.imageCount + info.modelViewCount,
									count: 0
								};
								updateProgress(sceneBuilder);
								break;
							case "setGeometry":
								if (sceneBuilder._progress) {
									sceneBuilder._progress.phase = ProgressPhase.LoadingGeometries;
									sceneBuilder._progress.count++;
									updateProgress(sceneBuilder);
								}
								break;
							case "createImage":
								if (sceneBuilder._progress) {
									sceneBuilder._progress.phase = ProgressPhase.LoadingTextures;
									sceneBuilder._progress.count++;
									updateProgress(sceneBuilder);
								}
								break;
							case "createThumbnail":
								if (sceneBuilder._progress) {
									sceneBuilder._progress.phase = ProgressPhase.LoadingModelViews;
									sceneBuilder._progress.count++;
									updateProgress(sceneBuilder);
								}
								break;
							default: break;
						}
					}
				};
			}));
		};
	})();

	function loadContent(loader, buffer, url, parentNode, contentResource, resolve, reject) {
		getWorker().then(function(worker) {
			worker.onerror = function(event) {
				Log.error("Error in WebWorker", event);
				reject(getResourceBundle().getText("LOADER_ERRORREADINGFILE"));
			};
			var sceneBuilder = new SceneBuilder(parentNode, contentResource, resolve, reject, loader);
			sceneBuilder._loader = loader;
			worker.postMessage(
				{
					method: "loadSceneFromArrayBuffer",
					sceneBuilderId: sceneBuilder.getId(),
					buffer: buffer,
					fileName: url,
					sourceLocation: "remote"
				},
				[ buffer ]
			);
		});
	}

	MataiLoader.prototype.load = function(parentNode, contentResource) {
		var that = this;
		return new Promise(function(resolve, reject) {
			// download contentResource.source
			// pass it to worker
			if (typeof contentResource.getSource() === "string") {
				var url = contentResource.getSource();
				fetch(url)
					.then(function(response) {
						if (response.ok) {
							return response.arrayBuffer();
						}
						throw (new Error(response.statusText));
					})
					.then(function(buffer) {
						loadContent(that, buffer, url, parentNode, contentResource, resolve, reject);
					})
					.catch(function(err) {
						reject(err);
					});
			} else if (contentResource.getSource() instanceof File) {
				var reader = new FileReader();
				reader.onload = function(e) {
					loadContent(that, e.target.result, contentResource.getSource().name, parentNode, contentResource, resolve, reject);
				};
				reader.onerror = function(err) {
					reject(err);
				};
				reader.readAsArrayBuffer(contentResource.getSource());
			}
		});
	};

	return MataiLoader;
});
