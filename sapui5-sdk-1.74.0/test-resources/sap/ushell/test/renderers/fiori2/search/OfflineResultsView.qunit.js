(function() {
    /*eslint no-unused-vars: 0*/
    "use strict";

    module("sap.ushell.renderers.fiori2.search.OfflineResultsView", {
        setup: function () {

        },
        /**
         * This method is called after each test. Add every restoration code here.
         */
        teardown: function () {
            $q('#page').remove();
        }
    });

    jQuery.sap.registerModulePath("sap.ushell.test.renderers.fiori2.search", "");


    var $q = jQuery;
    // Get the jQuery Object from the original code
    var $, sap;
    QUnit.config.autostart = false;

    $q('body').append('<iframe id="page" width="80%" height="800px"></iframe>');

    // -- open page under test in iframe
    $q('#page').attr('src',"../../ushell/test-resources/sap/ushell/shells/demo/FioriLaunchpad.html");
    // upon load finished start tests
    $q("#page").load(function(){
      $ = window.frames[0].jQuery;
      sap = window.frames[0].sap;
      QUnit.start();
    });

    /*
     * ========================================================================================
    *   SELECTORS
    * ========================================================================================
    * */
    var SEL_SEARCHBOX = "#sf";
    var SEL_SEARCHBOX_OVERLAY = "#sfOverlay-I";
    var SEL_RESULTLIST_ITEM = ".searchResultListItem";
    var SEL_OVERLAY_CLOSE = "#shellOverlay-close";


    /*
     * ========================================================================================
    *   FRAMEWORK functions
    * ========================================================================================
    * */
    function wait_for_page(fn){
        var i, max = 50, re = 0;
        if ($){
            console.debug("$ is available");
            fn();
        } else {
            i = setInterval(function(){
                re++;
                if ($ || re === max){
                    clearInterval(i);
                    console.debug("$ is available after " + re + "sec)");
                    fn();
                }
            }, 1000);
        }
    }

    function find_element(elem,fn){
        var intervalID, maxRetries = 50, retries = 0;
        if ($(elem).length > 0){
            console.debug("find_element: " + $(elem)[0] + " is available");
            fn(elem);
        } else {
            intervalID = setInterval(function(){
                retries++;
                if ($(elem).length > 0 || retries === maxRetries){
                    clearInterval(intervalID);
                    console.debug($(elem)[0] + " is available (after " + retries + "sec)");
                    fn(elem);
                }
            }, 1000);
        }
    }

    function set_search_term(text,fn){

        find_element(SEL_SEARCHBOX,function(elem){

            // - focus searchbox to pull down curtain
            $(elem).focus();
            $(elem).click();

            // - wait for curtain
            find_element(SEL_SEARCHBOX_OVERLAY, function(elem){

                var searchModel = sap.ui.getCore().getModel('searchModel');
                    var mainShell = sap.ui.getCore().byId("mainShell");

                // -- enter text
                if (text.indexOf("\n") >= 0) {
                    // - contains newline -> trigger also search
                    // remove \n
                    text = text.replace(/\n/,"");

                    // - trigger search for text
                    searchModel.setSearchBoxTerm(text);
                    mainShell.getController().switchViewState("searchResults");
                } else { // if string without \n, suggestion will be triggered and clicked
                    searchModel.setSearchBoxTerm(text);
                        searchModel.doSuggestion();
                        mainShell.getController().switchViewState("suggestions");
                }

                // -- call provided function for test to continue
                fn();
            });
        });

    }

    /*
     * ========================================================================================
    *   TESTS
    * ========================================================================================
    * */
    var searchString = "sally";

    /*
     *   TEST: set_search_term - direct search
    * */
    asyncTest("trigger search on UI test", 1, function() {

//        set_search_term(searchString+"\n",function() {
//
//            find_element(SEL_RESULTLIST_ITEM,function(elem){
//                ok($(elem).length === 1);
//                start();
//            });
//
//       });

        ok($q('#page').contents().find(".sapUiBody").length == 1);
        start();

    });

}());
