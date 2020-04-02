module("sap.ushell.test.renderers.fiori2.search.SearchHelper");

(function(global) {
    "use strict";

    // mock sap.ushell.Container.getService("Search").getSina()
    // global.sap.ushell = {
    //     Container: {
    //         getService: function(what){
    //             switch (what) {
    //                 case "Search":
    //                     return {
    //                         getSina: function(){
    //                             return global.sap.bc.ina.api.sina;
    //                         }
    //                     }
    //                     break;
    //                 case "URLParsing":
    //                     return {
    //                         splitHash: function(){
    //                             return {
    //                                 appSpecificRoute: ""
    //                             }
    //                         }
    //                     }
    //                 default:
    //
    //             }
    //         }
    //     }
    // }
    jQuery.sap.require("sap.ushell.renderers.fiori2.search.SearchHelper");
    var sh = global.sap.ushell.renderers.fiori2.search.SearchHelper;

    QUnit.test("parseUrlParameters", function(assert){
        var params = sh.parseUrlParameters("#Action-search&/searchterm=htc&datasource=%7B%22label%22:%22All%22,%22labelPlural%22:%22All%22,%22SchemaName%22:%7B%22label%22:%22%22,%22value%22:%22%22%7D,%22PackageName%22:%7B%22label%22:%22ABAP%22,%22value%22:%22ABAP%22%7D,%22ObjectName%22:%7B%22label%22:%22%22,%22value%22:%22$$ALL$$%22%7D,%22Type%22:%22Category%22%7D&top=10&filter=%7B%22operator%22:%22And%22,%22label%22:%22DefaultRoot%22,%22conditions%22:%5B%5D%7D")
        assert.ok(params.searchterm === "htc", "searchterm is " + params.searchterm);
        assert.ok(params.top === "10", "top is " + params.top);

        var ds = JSON.parse(params.datasource);
        assert.ok(ds.label === "All", "datasource label is " + ds.label);
        assert.ok(ds.labelPlural === "All", "datasource labelPlural is " + ds.labelPlural);
        assert.ok(ds.ObjectName.label === "", "datasource ObjectName.label is " + ds.ObjectName.label);
        assert.ok(ds.ObjectName.value === "$$ALL$$", "datasource ObjectName.value is " + ds.ObjectName.value);
        assert.ok(ds.PackageName.label === "ABAP", "datasource PackageName.label is " + ds.PackageName.label);
        assert.ok(ds.PackageName.value === "ABAP", "datasource PackageName.value is " + ds.PackageName.value);
        assert.ok(ds.SchemaName.label === "", "datasource SchemaName.label is " + ds.SchemaName.label);
        assert.ok(ds.SchemaName.value === "", "datasource SchemaName.value is " + ds.SchemaName.value);
        assert.ok(ds.Type === "Category", "datasource Type is " + ds.Type);

        var f = JSON.parse(params.filter);
        assert.ok(f.conditions.length === 0, "Length of conditions is " + f.conditions.length);
        assert.ok(f.label === "DefaultRoot", "filter.label is " + f.label);
        assert.ok(f.operator === "And", "filter.operator is " + f.operator);

        var params = sh.parseUrlParameters('Action-search&/searchterm=Engagements&datasource={"type":"Category","name":"Apps","label":"Apps","labelPlural":"Apps","key":"Category/ABAP/","schemaName":{"label":"","value":""},"packageName":{"label":"ABAP","value":"ABAP"},"objectName":{"label":"","value":""},"semanticObjectType":"","systemId":"","client":""}');
        assert.ok(params.searchterm === "Engagements", "searchterm is " + params.searchterm);
        assert.ok(params.top === undefined, "top is " + params.top);

        var ds = JSON.parse(params.datasource);
        assert.ok(ds.label === "Apps", "datasource label is " + ds.label);
        assert.ok(ds.labelPlural === "Apps", "datasource labelPlural is " + ds.labelPlural);
        assert.ok(ds.objectName.label === "", "datasource objectName.label is " + ds.objectName.label);
        assert.ok(ds.objectName.value === "", "datasource objectName.value is " + ds.objectName.value);
        assert.ok(ds.packageName.label === "ABAP", "datasource packageName.label is " + ds.packageName.label);
        assert.ok(ds.packageName.value === "ABAP", "datasource packageName.value is " + ds.packageName.value);
        assert.ok(ds.schemaName.label === "", "datasource schemaName.label is " + ds.schemaName.label);
        assert.ok(ds.schemaName.value === "", "datasource schemaName.value is " + ds.schemaName.value);

        assert.ok(params.filter === undefined, "Filter is " + params.filter);
    });

})(window);
