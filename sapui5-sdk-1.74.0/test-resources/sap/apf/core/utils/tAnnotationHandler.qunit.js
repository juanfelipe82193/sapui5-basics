sap.ui.define("sap/apf/core/utils/tAnnotationHandler", [
	"sap/apf/core/utils/annotationHandler",
	"sap/apf/core/utils/uriGenerator",
	"sap/apf/utils/utils",
	'sap/ui/thirdparty/sinon'
], function(AnnotationHandler, uriGenerator, utils, sinon){
	'use strict';
	function createManifests() {
		var manifest = {
			"sap.app" : {
				"id" : "a.deployed",
				"dataSources" : {
					"PathPersistenceServiceRoot" : {
						"uri" : "/sap/opu/odata/sap/BSANLY_APF_RUNTIME_SRV",
						"type" : "OData",
						"settings" : {
							"odataVersion" : "2.0"
						}
					},
					"DataSourceWithOneAnnotation" : {
						"uri" : "/sap/datasource/with/one/annotation/ds.xsodata",
						"type" : "OData",
						"settings" : {
							"odataVersion" : "2.0",
							"annotations" : [ "SingleAnnotation" ]
						}
					},
					"SingleAnnotation" : {
						"uri" : "/sap/datasource/with/one/annotation/singleAnnotation.xml",
						"type" : "ODataAnnotation",
						"settings" : {
							"odataVersion" : "2.0"
						}
					},
					"DataSourceWithOrigin" : {
						"uri" : "/sap/datasource/with/origin/xs.xsodata;o=myCRM",
						"type" : "OData",
						"settings" : {
							"odataVersion" : "2.0",
							"annotations" : [ "AnnotationWithOrigin" ]
						}
					},
					"AnnotationWithOrigin" : {
						"uri" : "/sap/annotation/with/origin/fpcAnnotation.xml;o=myCRM",
						"type" : "ODataAnnotation",
						"settings" : {
							"odataVersion" : "2.0"
						}
					},
					"DataSourceWithTwoAnnotations" : {
						"uri" : "/sap/datasource/with/two/annotations/xs.xsodata",
						"type" : "OData",
						"settings" : {
							"odataVersion" : "2.0",
							"annotations" : [ "Annotation1", "Annotation2" ]
						}
					},
					"DataSourceWithLocalAnnotation" : {
						"uri" : "/sap/datasource/with/local/annotation/xs.xsodata",
						"type" : "OData",
						"settings" : {
							"odataVersion" : "2.0",
							"annotations" : [ "LocalAnnotation" ]
						}
					},
					"DataSourceOnlyWithLocalAnnotation" : {
						"uri" : "/sap/datasource/with/only/local/annotation/xs.xsodata",
						"type" : "OData",
						"settings" : {
							"odataVersion" : "2.0",
							"annotations" : [ "LocalAnnotationOnly" ]
						}
					},
					"DataSourceWithLocalAbsoluteAnnotation" : {
						"uri" : "/sap/datasource/with/local/absolute/annotation/xs.xsodata",
						"type" : "OData",
						"settings" : {
							"odataVersion" : "2.0",
							"annotations" : [ "LocalAbsoluteAnnotation" ]
						}
					},
					"Annotation1" : {
						"uri" : "/sap/datasource/with/two/annotations/fpcAnnotation1.xml",
						"type" : "ODataAnnotation",
						"settings" : {
							"odataVersion" : "2.0"
						}
					},
					"Annotation2" : {
						"uri" : "/sap/datasource/with/two/annotations/fpcAnnotation2.xml",
						"type" : "ODataAnnotation",
						"settings" : {
							"odataVersion" : "2.0"
						}
					},
					"LocalAnnotation" : {
						"uri" : "/sap/datasource/with/local/annotation/Annotation.xml",
						"type" : "ODataAnnotation",
						"settings" : {
							"odataVersion" : "2.0",
							"localUri" : "local/annotation.xml"
						}
					},
					"LocalAnnotationOnly" : {
						"type" : "ODataAnnotation",
						"settings" : {
							"odataVersion" : "2.0",
							"localUri" : "only/local/annotation.xml"
						}
					},
					"LocalAbsoluteAnnotation" : {
						"uri" : "/sap/datasource/with/local/absolute/annotation/Annotation.xml",
						"type" : "ODataAnnotation",
						"settings" : {
							"odataVersion" : "2.0",
							"localUri" : "/deployed/somewhere/annotation.xml"
						}
					}
				}
			},
			"sap.ui5": {
				"dependencies": {
					"libs": {
						"sap.apf": {
							"minVersion" : "1.42.0"
						}
					}
				}
			}
		};

		var baseManifest = {};
		return {
			manifest : manifest,
			baseManifest : baseManifest
		};
	}
	QUnit.module("Annotation files are defined in manifest",{
		beforeEach : function () {
			var that = this;
			var manifests = createManifests();
			this.inject = {
				functions : {
					getSapSystem : function () { return that.sapSystem; },
					getComponentNameFromManifest : utils.getComponentNameFromManifest,
					getODataPath : uriGenerator.getODataPath,
					getBaseURLOfComponent : uriGenerator.getBaseURLOfComponent,
					addRelativeToAbsoluteURL : uriGenerator.addRelativeToAbsoluteURL
				},
				instances : {
					fileExists : {
						check : function(serviceRoot) {
							return false;
						}
					}
				},
				manifests : manifests
			};
			this.annotationHandler = new AnnotationHandler.constructor(this.inject);
		}
	});
	QUnit.test("Get one annotation that is defined in manifest", function(assert){
		var uris = this.annotationHandler.getAnnotationsForService("/sap/datasource/with/one/annotation/ds.xsodata");
		assert.deepEqual(uris, ["/sap/datasource/with/one/annotation/singleAnnotation.xml"], "THEN annotation is found in manifest");
	});
	QUnit.test("Get the two annotations that are defined in manifest", function(assert){
		var uris = this.annotationHandler.getAnnotationsForService("/sap/datasource/with/two/annotations/xs.xsodata");
		assert.deepEqual(uris, ["/sap/datasource/with/two/annotations/fpcAnnotation1.xml", "/sap/datasource/with/two/annotations/fpcAnnotation2.xml"], "THEN annotations are found in manifest");
	});
	QUnit.test("Get absolute and local annotation as relative uri", function(assert){
		var uris = this.annotationHandler.getAnnotationsForService("/sap/datasource/with/local/annotation/xs.xsodata/");
		assert.deepEqual(uris, ["/sap/datasource/with/local/annotation/Annotation.xml", "../../../../../resources/a/deployed/local/annotation.xml"], "THEN absolute and local annotation is found in manifest AND relative url is transformed in absolute URL");
	});
	QUnit.test("Get absolute and local annotation defined as absolute uri", function(assert){
		var uris = this.annotationHandler.getAnnotationsForService("/sap/datasource/with/local/absolute/annotation/xs.xsodata/");
		assert.deepEqual(uris, ["/sap/datasource/with/local/absolute/annotation/Annotation.xml", "/deployed/somewhere/annotation.xml"], "THEN absolute and local annotation with absolute URL is found in manifest");
	});
	QUnit.test("Get local annotation WHEN no uri is defined", function(assert){
		var uris = this.annotationHandler.getAnnotationsForService("/sap/datasource/with/only/local/annotation/xs.xsodata/");
		assert.deepEqual(uris, ["../../../../../resources/a/deployed/only/local/annotation.xml"], "THEN local annotation is found in manifest");
	});
	QUnit.test("Get the two annotations that are defined in manifest AND sap-system is set", function(assert){
		this.sapSystem = "myERP";
		this.annotationHandler = new AnnotationHandler.constructor(this.inject);
		var uris = this.annotationHandler.getAnnotationsForService("/sap/datasource/with/two/annotations/xs.xsodata");
		assert.deepEqual(uris, ["/sap/datasource/with/two/annotations/fpcAnnotation1.xml;o=myERP", "/sap/datasource/with/two/annotations/fpcAnnotation2.xml;o=myERP"], "THEN annotations are found in manifest");
	});
	QUnit.test("Get annotations that are defined in manifest with different origin AND sap-system is set", function(assert){
		this.sapSystem = "myERP";
		this.annotationHandler = new AnnotationHandler.constructor(this.inject);
		var uris = this.annotationHandler.getAnnotationsForService("/sap/datasource/with/origin/xs.xsodata");
		assert.deepEqual(uris, ["/sap/annotation/with/origin/fpcAnnotation.xml;o=myERP"], "THEN annotation are found in manifest");
	});
	QUnit.module("Annotation files are not defined in manifest", {
		beforeEach : function () {
			var that = this;
			var manifests = createManifests();
			this.inject = {
				functions : {
					getSapSystem : function () { return that.sapSystem; },
					getODataPath : uriGenerator.getODataPath
				},
				instances : {
					fileExists : {
						check : function(serviceRoot) {
							return that.annotationFileShallExist;
						}
					}
				},
				manifests : manifests
			};
			this.annotationHandler = new AnnotationHandler.constructor(this.inject);
		}
	});
	QUnit.test("Get default annotation, if nothing defined in manifest and exists", function(assert){
		this.annotationFileShallExist = true;
		var uris = this.annotationHandler.getAnnotationsForService("/not/defined/in/manifest/dd.wca");
		assert.deepEqual(uris, ["/not/defined/in/manifest/annotation.xml"], "THEN default annotation is returned");
	});
	QUnit.test("Get default annotation if SAP-SYSTEM is set, if nothing defined in manifest and exists", function(assert){
		this.annotationFileShallExist = true;
		this.sapSystem = "myERP";
		this.annotationHandler = new AnnotationHandler.constructor(this.inject);
		var uris = this.annotationHandler.getAnnotationsForService("/not/defined/in/manifest/dd.wca");
		assert.deepEqual(uris, ["/not/defined/in/manifest/annotation.xml;o=myERP"], "THEN default annotation is returned");
	});
	QUnit.test("Get default annotation, if nothing defined in manifest and not exists", function(assert){
		this.annotationFileShallExist = false;
		var uris = this.annotationHandler.getAnnotationsForService("/not/defined/in/manifest/dd.wca");
		assert.deepEqual(uris, [], "THEN no annotation is returned");
	});
	QUnit.module("Annotation files are not defined in manifest and sap.apf version is greater 1.44.0", {
		beforeEach : function () {
			
			this.manifests = createManifests();
			this.inject = {
				functions : {
					getODataPath : uriGenerator.getODataPath,
					getSapSystem : function () { return undefined; }
				},
				instances : {
					fileExists : {
						check : function(serviceRoot) {
							return true;
						}
					}
				},
				manifests : this.manifests
			};
		}
	});
	QUnit.test("No default annotation if sap.apf version is greater 1.44.0", function(assert){
		this.manifests.manifest["sap.ui5"].dependencies.libs["sap.apf"].minVersion = "1.44.0";
		this.annotationHandler = new AnnotationHandler.constructor(this.inject);
		var uris = this.annotationHandler.getAnnotationsForService("/not/defined/in/manifest/dd.wca");
		assert.deepEqual(uris, [], "THEN no default annotation is returned");
	});
	QUnit.test("Default annotation if sap.apf version is lower 1.44.0", function(assert){
		this.manifests.manifest["sap.ui5"].dependencies.libs["sap.apf"].minVersion = "1.38.0";
		this.annotationHandler = new AnnotationHandler.constructor(this.inject);
		var uris = this.annotationHandler.getAnnotationsForService("/not/defined/in/manifest/dd.wca");
		assert.deepEqual(uris, ["/not/defined/in/manifest/annotation.xml"], "THEN default annotation is returned");
	});
	QUnit.module("Compability case: No manifest provided to annotation handler", {
		beforeEach : function () {
			var that = this;
			var inject = {
				functions : {
					getODataPath : uriGenerator.getODataPath,
					getSapSystem : function () { return undefined; }
				},
				instances : {
					fileExists : {
						check : function(serviceRoot) {
							return that.annotationFileShallExist;
						}
					}
				}
			};
			this.annotationHandler = new AnnotationHandler.constructor(inject);
		}
	});
	QUnit.test("Get default annotation, if no manifest and default annotation file exists", function(assert){
		this.annotationFileShallExist = true;
		var uris = this.annotationHandler.getAnnotationsForService("/not/defined/in/manifest/dd.wca");
		assert.deepEqual(uris, ["/not/defined/in/manifest/annotation.xml"], "THEN default annotation is returned");
	});
	QUnit.test("Get undefined, if no manifest and default annotation file does not exists", function(assert){
		this.annotationFileShallExist = false;
		var uris = this.annotationHandler.getAnnotationsForService("/not/defined/in/manifest/dd.wca");
		assert.deepEqual(uris, [], "THEN default annotation is returned");
	});
});