/*!
 * OpenUI5
 * (c) Copyright 2009-2020 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define([
  'jquery.sap.global',
  'sap/ui/base/Object'
],function($, Ui5Object) {
  "use strict";

  var oLogger = $.sap.log.getLogger("sap.ui.test.SampleOpaExtension",
    $.sap.log.Level.DEBUG);

  var Extension = Ui5Object.extend("sap.ui.test.SampleOpaExtension", {
    metadata : {
      publicMethods : [
        "onAfterInit",
        "onBeforeExit" ,
        "getAssertions"
      ]
    },

    onAfterInit : function() {
      oLogger.debug("Default onAfterInit called");
      return $.when();
    },

    onBeforeExit : function(){
      oLogger.debug("Default onBeforeExit called");
      return $.when();
    },

    getAssertions : function(){
      return {
        myCustomAssertion: function() {
          var deferred = $.Deferred();

          // start custom assertion logic, resolve the promise when ready
          setTimeout(function() {
            // Assertion passes
            deferred.resolve({
               result: true,
               message: "Custom assertion passes"
            });
          },0);

          return deferred.promise();
        }
      };
    }
  });

  return Extension;
});