/*global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {

  QUnit.module("css load test");

  QUnit.test('Check load css correctly', function(assert) {
    var done = assert.async();
    require(["css!./styles/style.css"],function(){
      assert.ok(window.define, "windows.define should be exist");
      var properties = window.getComputedStyle(document.getElementById("content"), null);
      assert.equal(properties.getPropertyValue("background-color"), "rgb(255, 0, 0)");
      done();
    });

  });

  QUnit.start();

});
