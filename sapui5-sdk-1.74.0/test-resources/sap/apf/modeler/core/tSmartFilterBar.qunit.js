/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
jQuery.sap.require("sap.apf.modeler.core.smartFilterBar");
(function() {
	'use strict';
	QUnit.module("Create", {
		beforeEach: function(){
			this.id  = "SmartFilterBarId";
			this.service = "/test/service";
			this.entitySet = "testEntitySet";
			this.smartFilterBar = new sap.apf.modeler.core.SmartFilterBar(this.id);
		}
	});
	QUnit.test("Create SmartFilterBar", function(assert){
		assert.equal(this.smartFilterBar.getId(), this.id, "SmartFilterBar created and Id retrieved");
	});
	QUnit.test("Set and retrieve service", function(assert){
		this.smartFilterBar.setService(this.service);
		assert.equal(this.smartFilterBar.getService(),this.service, "Service set and retrieved");
	});
	QUnit.test("Set and retrieve entitySet", function(assert){
		this.smartFilterBar.setEntitySet(this.entitySet);
		assert.equal(this.smartFilterBar.getEntitySet(),this.entitySet, "Entity Set has been set and retrieved");
	});
}());