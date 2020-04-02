/*
 * Copyright(c) 2015 SAP SE
 */
/*global QUnit, jQuery, sap */

sap.ui.define("sap/apf/core/utils/tAreRequestOptionsEqual", [
	"sap/apf/core/utils/areRequestOptionsEqual"
], function(areRequestOptionsEqual){
	'use strict';
	QUnit.module("Request Options are Equal or Differ");
	
	QUnit.test("WHEN  empty request options are defined", function(assert){
		var requestOption1 = {};
		var requestOption2 = {};
		assert.ok(areRequestOptionsEqual(requestOption1, requestOption2), "THEN empty request options are equal");
	});
	QUnit.test("WHEN  paging skip request options are defined", function(assert){
		var requestOption1 = { paging : { skip : 0}};
		var requestOption2 = {};
		assert.ok(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are equal with skip 0 defined and not defined");
	
		requestOption1 = { paging : { skip : 0}};
		requestOption2 = { paging : {}};
		assert.ok(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are equal with skip 0 defined and not defined");
	
		requestOption1 = { paging : { skip : 0}};
		requestOption2 = { paging : { skip : 0}};
		assert.ok(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are equal with skip 0 defined");
	
		requestOption1 = { paging : { skip : 3}};
		requestOption2 = { paging : { skip : 3}};
		assert.ok(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are equal with skip 0 defined");
	
		requestOption1 = { paging : { skip : 1}};
		requestOption2 = { paging : { skip : 3}};
		assert.notOk(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are not equal with different skip defined");
	
		requestOption1 = { paging : { skip : 1}};
		requestOption2 = {};
		assert.notOk(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are not equal with skip <> 0 and no skip defined");
	
		requestOption1 = {};
		requestOption2 = { paging : { skip : 1}};
		assert.notOk(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are not equal with skip <> 0 and no skip defined");
	});
	QUnit.test("WHEN  paging top request options are defined", function(assert){
	
		var requestOption1 = { paging : { top : 0}};
		var requestOption2 = {};
		assert.ok(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are equal with top 0 defined and not defined");
	
		requestOption1 = { paging : { top : 0}};
		requestOption2 = { paging : {}};
		assert.ok(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are equal with top 0 defined and not defined");
	
		requestOption1 = { paging : { top : 0}};
		requestOption2 = { paging : { top : 0}};
		assert.ok(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are equal with top 0 defined");
	
		requestOption1 = { paging : { top : 3}};
		requestOption2 = { paging : { top : 3}};
		assert.ok(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are equal with top 0 defined");
	
		requestOption1 = { paging : { top : 1}};
		requestOption2 = { paging : { top : 3}};
		assert.notOk(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are not equal with different top defined");
	
		requestOption1 = { paging : { top : 1}};
		requestOption2 = {};
		assert.notOk(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are not equal with top <> 0 and no top defined");
	
		requestOption1 = {};
		requestOption2 = { paging : { top : 1}};
		assert.notOk(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are not equal with top <> 0 and no top defined");
	
	});
	QUnit.test("WHEN  paging inlinecount request options are defined", function(assert){
		var requestOption1 = { paging : { inlineCount : false}};
		var requestOption2 = {};
		assert.ok(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are equal with inline count defined and not defined");
	
		requestOption1 = { paging : { inlineCount : false}};
		requestOption2 = { paging : {}};
		assert.ok(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are equal with inline count defined and not defined");
	
		requestOption1 = { paging : { inlineCount : false}};
		requestOption2 = { paging : { inlineCount : false}};
		assert.ok(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are equal with inline count as false defined");
	
		requestOption1 = { paging : { inlineCount : true}};
		requestOption2 = { paging : { inlineCount : true}};
	
		assert.ok(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are equal with inline count defined");
	
		requestOption1 = { paging : { inlineCount : false}};
		requestOption2 = { paging : { inlineCount : true}};
		assert.notOk(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are not equal with different inline count defined");
	
		requestOption1 = { paging : { inlineCount : true}};
		requestOption2 = { paging : { inlineCount : false}};
		assert.notOk(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are not equal with different inline count defined");
	
		requestOption1 = { paging : { inlineCount : true}};
		requestOption2 = {};
		assert.notOk(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are not equal with inline count and no inline count defined");
	
		requestOption1 = { paging : { skip : 2, top : 3, inlineCount : true}};
		requestOption2 = { paging : { skip : 2, top : 3, inlineCount : true}};
		assert.ok(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are equal");
	
		requestOption1 = { paging : { skip : 2, top : 4, inlineCount : true}};
		requestOption2 = { paging : { skip : 2, top : 3, inlineCount : true}};
		assert.notOk(areRequestOptionsEqual(requestOption1, requestOption2), "THEN paging options are not equal");
	
	
		requestOption1 = { paging : { skip : 2, top : 3, inlineCount : true}, orderby : 'Property1'};
		requestOption2 = { paging : { skip : 2, top : 3, inlineCount : true}, orderby : 'Property1'};
		assert.ok(areRequestOptionsEqual(requestOption1, requestOption2), "THEN all options are equal");
	
	});
	QUnit.test("WHEN  order by request options are defined", function(assert){
		var orderBy1 = [ { property : "nameProperty1" }, {property : "nameProperty2", ascending : false}];
		var orderBy2 = [ { property : "nameProperty1" }, {property : "nameProperty2", ascending : false}];
		var requestOption1 = { paging : { skip : 2, top : 3, inlineCount : true}, orderby : orderBy1};
		var requestOption2 = { paging : { skip : 2, top : 3, inlineCount : true}, orderby : orderBy2};
	
		assert.ok(areRequestOptionsEqual(requestOption1, requestOption2), "THEN orderby options are equal");
	
		orderBy1 = [ { property : "nameProperty1" }, {property : "nameProperty2", ascending : false}];
		orderBy2 = [ { property : "nameProperty1" }, {property : "nameProperty2", ascending : true}];
		requestOption1 = { paging : { skip : 2, top : 3, inlineCount : true}, orderby : orderBy1};
		requestOption2 = { paging : { skip : 2, top : 3, inlineCount : true}, orderby : orderBy2};
	
		assert.notOk(areRequestOptionsEqual(requestOption1, requestOption2), "THEN orderby options are not equal");
	
		orderBy1 = [ { property : "nameProperty1" }, {property : "nameProperty3", ascending : false}, {property : "nameProperty2", ascending : false}];
		orderBy2 = [ { property : "nameProperty1" }, {property : "nameProperty2", ascending : false}, {property : "nameProperty3", ascending : false}];
		requestOption1 = { paging : { skip : 2, top : 3, inlineCount : true}, orderby : orderBy1};
		requestOption2 = { paging : { skip : 2, top : 3, inlineCount : true}, orderby : orderBy2};
	
		assert.notOk(areRequestOptionsEqual(requestOption1, requestOption2), "THEN orderby options are not equal because of changed positions in order by list");
	
	
		orderBy1 = [ { property : "nameProperty1" }, {property : "nameProperty2", ascending : true}, {property : "nameProperty3", ascending : false}];
		orderBy2 = [ { property : "nameProperty1" }, {property : "nameProperty2", ascending : false}, {property : "nameProperty3", ascending : false}];
		requestOption1 = { paging : { skip : 2, top : 3, inlineCount : true}, orderby : orderBy1};
		requestOption2 = { paging : { skip : 2, top : 3, inlineCount : true}, orderby : orderBy2};
	
		assert.notOk(areRequestOptionsEqual(requestOption1, requestOption2), "THEN orderby options are not equal because of changed ascending in order by list");
	
	});

});