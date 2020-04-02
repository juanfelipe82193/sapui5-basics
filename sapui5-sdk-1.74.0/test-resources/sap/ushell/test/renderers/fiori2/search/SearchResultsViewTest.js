module("sap.ushell.test.renderers.fiori2.search.SearchResultsViewTest");
//SYSTEM DETAILS: GM6/001 & HT3/350

(function(global) {
/*eslint no-unused-vars: 0*/
"use strict";

var $q = global.$q;
// Get the jQuery Object from the original code
var $, sap;
global.QUnit.config.autostart = false;

// -- open page under test in iframe
$q('#page').attr('src',"/sap/bc/ui5_ui5/ui2/ushell/shells/abap/FioriLaunchpad.html");
// upon load finished start tests
$q("#page").load(function(){
  $ = window.frames[0].jQuery;
  sap = window.frames[0].sap;
  global.QUnit.start();
});




/*
 * ========================================================================================
*   SELECTORS
* ========================================================================================
* */

var SEL_SEARCHBOX = "#sf";
var SEL_SEARCHBOX_OVERLAY = "#sfOverlay-I";
var SEL_RESULTLIST_ITEM = ".searchResultListItem";    //$(".searchLayout-left>div>ul")[0].childNodes.length
//var SEL_RESULTLIST_ITEM_1=".searchLayout-left>div>ul";
var SEL_OVERLAY_CLOSE = "#shellOverlay-close";
var SEL_SUGGESTION_ITEM = ".suggestNavItem";
var SEL_SHOW_MORE = ".resultListFooterContent";        //.resultListMoreFooter
var SEL_DETAIL_ARROW = ".searchResultListItem:nth-child(1) a span";
var SEL_DETAILED_AREA = ".searchResultListItemDetail-attributes";
var SEL_SEARCH_RESULTS_COUNT = ".searchLayout-mainHeaderCount";
var SEL_OTHERS_COUNT = ".searchLayout-bucketCount";
var SEL_RECENT_SEARCH_CURTAIN = "#__layout1";
var SEL_SEARCH_CLOSE_BUTTON = "#sfOverlay-reset";
var SEL_SEARCH_RESET_BUTTON = "#sf-reset";
var SEL_RECENT_SEARCH_TERM = "#__item4-__list1-0 .sapMSLITitleOnly";
var SEL_SEARCH_CLICK = "#sfOverlay-reset";
var SEL_RESULTLIST_DETAIL_BUTTON = ".searchResultListItemButton";
var SEL_RECENTSEARCH_ITEM = ".sapMSLITitleOnly";
var SEL_SEARCHBOX_RESET = "#sfOverlay-reset";
var SEL_SEARCH_LAYOUT = ".searchLayout";
var SEL_NO_RESULT = ".no-result";




/*
 * ========================================================================================
*   FRAMEWORK functions
* ========================================================================================
* */

function find_element(elem,fn){
    var intervalID = 0, maxRetries = 50, retries = 0;
    if ($(elem).length > 0){
        console.info("find_element: " + $(elem)[0] + " is available");
        fn(elem);
    } else {
        intervalID = global.setInterval(function(){
            retries++;
            if ($(elem).length > 0 || retries === maxRetries){
                global.clearInterval(intervalID);
                console.info($(elem)[0] + " is available (after " + retries + "sec)");
                fn(elem);
            }
        }, 1000);
    }
}



function set_search_term(text,fn){
    // "text" could be sth like "HT-1000\n", if string contains \n a search is triggered

                find_element(SEL_SEARCHBOX,function(elem){

                                  // - clicks searchbox to pull down curtain
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
                                          // set text to elem (perhaps not required)
//                                          $(elem).val(text);
                                          // - trigger search for text
//                                          sap.ui.getCore().byId("sfOverlay").fireSearch({'query':text});
                                          searchModel.setSearchBoxTerm(text);
                                          mainShell.getController().switchViewState("searchResults");
                                      } else { // if string without \n, suggestion will be triggered and clicked
//                                          $(elem).val(text);
                                          // - trigger suggestions to be shown
//                                          sap.ui.getCore().getEventBus().publish("searchSuggest", {searchTerm: searchString, activeViews: ["searchSuggestionsView"]});
                                          searchModel.setSearchBoxTerm(text);
                                          searchModel.doSuggestion();
                                          mainShell.getController().switchViewState("suggestions");
                                      }

                                      // -- call provided function for test to continue
                                      fn();
                                  });
                });

}

function hover_mouse(elem){
    $(elem).mouseenter();
}
function click(elem){
    $(elem).click();
}
function focus(elem){
    $(elem).focus();
}



/*
 * ========================================================================================
*   TESTS
* ========================================================================================
* */
var searchString = "eur";

var expectedSummaryResult = new Array(2);
for (var i = 0; i < 2; i++){
    expectedSummaryResult[i] = new Array(10);
}
//eur
expectedSummaryResult[0][0] = "ProductHT-1113ProductCategoryComputer system accessoriesCreated By (First Name)EPMType CodePR";
expectedSummaryResult[0][1] = "Purchase Order300000000Purchase OrderGross Amount13.224,47 EURNet Amount11.113,00 EURTax Amount2.111,47 EUR";
expectedSummaryResult[0][2] = "Sales Order500000019Sales OrderTime Stamp20.131.111.230.000,0000000Currency CodeEURTotal Net Amount1.213,99";
expectedSummaryResult[0][3] = "ProductHT-1117ProductCategoryTelecommunicationCreated By (First Name)EPMType CodePR";
expectedSummaryResult[0][4] = "Purchase Order300000002Purchase OrderGross Amount11.666,69 EURNet Amount9.803,94 EURTax Amount1.862,75 EUR";
expectedSummaryResult[0][5] = "Sales Order500000018Sales OrderTime Stamp20.131.111.230.000,0000000Currency CodeEURTotal Net Amount732,40";
expectedSummaryResult[0][6] = "ProductHT-1120ProductCategoryKeyboardsCreated By (First Name)EPMType CodePR";
expectedSummaryResult[0][7] = "Purchase Order300000017Purchase OrderGross Amount5.055,11 EURNet Amount4.247,99 EURTax Amount807,12 EUR";
expectedSummaryResult[0][8] = "Sales Order500000016Sales OrderTime Stamp20.131.111.230.000,0000000Currency CodeEURTotal Net Amount58,97";
expectedSummaryResult[0][9] = "ProductHT-1210ProductCategoryPCsCreated By (First Name)EPMType CodePR";
//epm
expectedSummaryResult[1][0] = "EmployeesEPM UserEmployeesEmployee ID33Emailuser.epm@itelo.infoLanguageEnglish";
expectedSummaryResult[1][1] = "Sales Order500000019Sales OrderTime Stamp20.131.111.230.000,0000000Currency CodeEURTotal Net Amount1.213,99";
expectedSummaryResult[1][2] = "Purchase Order300000000Purchase OrderGross Amount13.224,47 EURNet Amount11.113,00 EURTax Amount2.111,47 EUR";
expectedSummaryResult[1][3] = "Sales Order500000018Sales OrderTime Stamp20.131.111.230.000,0000000Currency CodeEURTotal Net Amount732,40";
expectedSummaryResult[1][4] = "Purchase Order300000001Purchase OrderGross Amount12.493,73 EURNet Amount10.498,94 EURTax Amount1.994,79 EUR";
expectedSummaryResult[1][5] = "Sales Order500000017Sales OrderTime Stamp20.131.111.230.000,0000000Currency CodeEURTotal Net Amount149,70";
expectedSummaryResult[1][6] = "Purchase Order300000002Purchase OrderGross Amount11.666,69 EURNet Amount9.803,94 EURTax Amount1.862,75 EUR";
expectedSummaryResult[1][7] = "Sales Order500000016Sales OrderTime Stamp20.131.111.230.000,0000000Currency CodeEURTotal Net Amount58,97";
expectedSummaryResult[1][8] = "Purchase Order300000003Purchase OrderGross Amount16.561,23 EURNet Amount13.917,00 EURTax Amount2.644,23 EUR";
expectedSummaryResult[1][9] = "Sales Order500000015Sales OrderTime Stamp20.131.111.230.000,0000000Currency CodeEURTotal Net Amount724,98";

var expectedDetailedResult =  "AddressDE 10001 Berlin WaldhüterpfadSexMale";

var searchTerm = [];
searchTerm [1] = "walter";
searchTerm [2] = "ht-";
searchTerm [3] = "sally";
searchTerm [4] = "summer";
searchTerm [5] = "sap";
searchTerm [6] = "berlin";


/*
 *   TEST 1: set_search_term - suggestion and search
* */
/*asyncTest("set_search_term: search suggestion test", 6, function() {
    //searchString="sally";

        var i;
        for (i=1; i<=6; i++) {
        setTimeout(function() {
         searchString = searchTerm.pop();

          set_search_term(searchString,function(){

          // - search term is set wait for suggestions

          find_element(SEL_SUGGESTION_ITEM,function(elem){
           if ($(elem).length > 0) {
               var item = $(elem)[1];

               item.click();

           }


          // - click on suggest was done - wait for resultlist
          find_element(SEL_RESULTLIST_ITEM,function(elem){

              // - check if search-term is available in all resultItems
              var searchStringNotContainedInItem = 0;
              var searchStringContainedInItem = 0;
              var count=$(SEL_RESULTLIST_ITEM).length;
              for (var itemIdx=0; itemIdx<count; itemIdx++) {
                  global.console.debug("item: " + item + " elem[item]: " + $( $(elem)[item].html()));
                  var item = $($(SEL_RESULTLIST_ITEM)[itemIdx]);
                    //global.ok(true,"text content="+item.text());

                      // check search-string found
                      if (item.text().toLowerCase().indexOf(searchString.toLowerCase())>=0) {
                          // found search string
                          console.info("in item " + itemIdx + " search string " + searchString + " found. '" +item.text() + "'");
                          searchStringContainedInItem++;
                      } else {
                          // search string not found
                          console.info("in item " + itemIdx + " search string " + searchString + " NOT found! '" +item.text() + "'");
                          searchStringNotContainedInItem++;
                      }

              }
              global.ok(true,
                      "Found search string (" + searchString + ") only in " + searchStringContainedInItem
                      + " of " + (searchStringNotContainedInItem + searchStringContainedInItem) + " result list items.");

                });

            });
      });
              },8000*i);
    }
                setTimeout(function()
                {
                    $(SEL_OVERLAY_CLOSE).click();
                    global.start();
                },90000);

});*/
/*
 *   TEST 1: set_search_term - suggestion and search
* */
asyncTest("Test Suggestions-search suggestion test with multiple search terms", function() {
    var searchTerm = [];
    searchTerm [1] = "sap";
    searchTerm [2] = "ht-";
//    searchTerm[3]="berlin";


                var i;
                for (i = 1; i <= 2; i++) {
                   setTimeout(function() {
                   click_and_validate(i, searchTerm);
                   }, 8000 * i);
                }
                // - start tests
                setTimeout(function() {
                    //close the overlay
                    $(SEL_OVERLAY_CLOSE).click();
                    global.start();
                }, 50000);

    });

function click_and_validate(i, searchTerm){
  setTimeout(function(){
      searchString = searchTerm.pop();
      set_search_term(searchString,function(){

          // - search term is set wait for suggestions
          setTimeout(function(){

              find_element(SEL_SUGGESTION_ITEM,function(elem){
                if ($(elem).length > 0) {
                   var item = $(elem)[0];
                   item.click();
                   }
              }, 1000 * i);

              setTimeout(function(){

                  find_element(SEL_RESULTLIST_ITEM,function(elem){

                      // - check if search-term is available in all resultItems
                      var searchStringNotContainedInItem = 0;
                      var searchStringContainedInItem = 0;
                      var count = $(SEL_RESULTLIST_ITEM).length;
                      for (var itemIdx = 0; itemIdx < count; itemIdx++) {
                          //global.console.debug("item: " + item + " elem[item]: " + $( $(elem)[item].html()));
                          var item = $($(SEL_RESULTLIST_ITEM)[itemIdx]);
                            //global.ok(true,"text content="+item.text());

                              // check search-string found
                              if (item.text().toLowerCase().indexOf(searchString.toLowerCase()) >= 0) {
                                  // found search string
                                  console.info("in item " + itemIdx + " search string " + searchString + " found. '" + item.text() + "'");
                                  searchStringContainedInItem++;
                              } else {
                                  // search string not found
                                  console.info("in item " + itemIdx + " search string " + searchString + " NOT found! '" + item.text() + "'");
                                  searchStringNotContainedInItem++;
                              }

                      }
                      global.ok(true,
                              "Found search string (" + searchString + ") only in " + searchStringContainedInItem
                              + " of " + (searchStringNotContainedInItem + searchStringContainedInItem) + " result list items.");

                  });
              }, 1000 * i);
         });
      });
  }, 4000 * i);

}


/*
 *   TEST 2: Result List Validation(summary)
* */

asyncTest("Result List Validation(summary)", function() {
var searchTerm = [];
searchTerm [1] = "epm";
searchTerm [2] = "eur";

            var i;
            for (i = 1; i <= 2; i++) {
               //setTimeout(function() {
               searchString = searchTerm.pop();
               validate(i, searchString);
               //},2000*i);
            }
            // - start tests
            setTimeout(function() {
                //close the overlay
                $(SEL_OVERLAY_CLOSE).click();
                global.start();
            }, 40000);

});

function validate(j, searchString){
    setTimeout(function(){
                  global.ok(true, "search String: " + searchString);
                  set_search_term(searchString + "\n", function() {
                  // - search was triggered - wait for result list

                    //global.ok(true, "Expected Summary: "+expectedSummaryResult[j-1][0]);
                      find_element(SEL_RESULTLIST_ITEM,function(elem){

                        var count = $(SEL_RESULTLIST_ITEM).length;
                        for (var itemIdx = 0; itemIdx < count; itemIdx++) {

                                var item = $($(elem)[itemIdx]);

                                console.info("Expected Summary-" + itemIdx + ": " + expectedSummaryResult[j - 1][itemIdx]);
                                console.info("Result summary-" + itemIdx + ": " + item.text());

                                global.ok(true,"Result summary-" + itemIdx + ": " + item.text());

                                if (item.text() == expectedSummaryResult[j - 1][itemIdx]) {
                                    global.ok(true,"Result summary at index " + itemIdx + " is correct");
                                } else {
                                    global.ok(false ,"Result summary at index " + itemIdx + " is changed");
                                }

                        }
                      });
                });

    }, 5000 * j);
}


/*
 *   TEST 3: Validate detailed search result
* */

asyncTest("Validate detailed search result", function() {

                  global.ok(true, "search String:" + searchString);
                  set_search_term(searchString + "\n",function() {
                  global.ok(true, "search term entered in search box");
                  // - search was triggered - wait for result list
                      find_element(SEL_DETAILED_AREA,function(elem){
                          for (var itemIdx = 0; itemIdx < elem.length; itemIdx++) {

                              var item = $($(elem)[itemIdx]);

                              // elem.length returns a too high number, so check really a resultlistitem is available:
                              if (item && item.html()) {
                                  // check search-string found
                                  global.ok(true,"Item text: " + item.text());

                                  if (item.text().indexOf(expectedDetailedResult) >= 0) {
                                      //global.console.debug("in item " + itemIdx + " search string " + searchString + " found. '" +item.text() + "'");
                                       global.ok(true, "Detailed result is correct");

                                  } else {
                                       global.ok(false, "Detailed result is not correct");
                                      //global.console.debug("in item " + itemIdx + " search string " + searchString + " NOT found! '" +item.text() + "'");
                                  }
                                  global.deepEqual(item.text(), expectedDetailedResult);
                              }
                          }
                           //close the overlay
                          $(SEL_OVERLAY_CLOSE).click();

                          // - start tests
                          setTimeout(function() {
                            global.start();
                          },10000);
                      });
                });
});


/*
 *   TEST 4: Validate Show More button and Total Rows Count
* */


asyncTest("Validate Show More button and Total Rows Count", function() {
              searchString = "mp3";
                  global.ok(true, "search String: " + searchString);

                  set_search_term(searchString + "\n",function() {

                  var j;
                  var counter = 0;
                  var ExpectedResults = 59;
                  var length;

                  var iterations = Math.ceil(ExpectedResults / 10);
                  global.ok(true, "No. of iterations: " + iterations);


                  find_element(SEL_RESULTLIST_ITEM,function(elem){
                    global.ok(true, "No. of items in Result List are: " + $(".searchResultListItem").length);

                   for (var itemIdx = 0; itemIdx < elem.length; itemIdx++) {

                          var item = $( $(elem)[itemIdx]);
                          // elem.length returns a too high number, so check really a resultlistitem is available:

                          if (item && item.html()) {
                              counter++;
                          }
                    }
                    global.ok(true, "Counter(must be less then or equal to 10): " + counter);


                  for (j = 1; j < iterations + 1; j++) {

                    setTimeout(function(){

                    console.info("entered into the loop...!");

                    length = $(".searchResultListItem    ").length;
                    global.ok(true, "Result row Count: " + length);

                    $('#searchResultPage-cont').scrollTop($('#searchResultPage-cont')[0].scrollHeight);
                    $(SEL_SHOW_MORE).click();

                    console.info("Clicked-" + j);
                    global.ok(true, "Clicked");
                    }, 2000 * j);

                    }

                    setTimeout(function(){
                    length = $(".searchResultListItem").length;
                    global.ok(true, "Result row Count: " + length);
                    global.ok(true, "Final count: " + length);

                    if (length == ExpectedResults) {
                        global.ok(true ,"Show more option is working");
                    } else {
                        global.ok(false,"Show more option is not working");
                    }

                    global.deepEqual(length, ExpectedResults);

                    }, 2000 * j);

                    // - start tests
                    setTimeout(function(){
                            global.start();
                       },20000);

            });
     });
});




/*
 *  TEST 5: Validate Search Highlighting Feature(summary & details)
* */
/*asyncTest("Validate Search Highlighting Feature(summary & details)", function() {

                global.ok(true, "Search String: " +searchString);
                set_search_term(searchString+"\n",function() {

                      find_element(SEL_RESULTLIST_ITEM,function(elem){

                        var count=$(SEL_RESULTLIST_ITEM).length;
                        console.info("Result Count: "+count);
                        var itemIdx;
                        for (itemIdx=0; itemIdx<count; itemIdx++) {

                            click_details(itemIdx);

                            validate_highlight(itemIdx);

                        }

                          setTimeout(function()
                          {
                            //close the overlay
                            $(SEL_OVERLAY_CLOSE).click();
                            global.start();
                          },20000);

                      });


                });
});

function click_details(j){
    setTimeout(function(){
    //var param=j;
    console.log("Hello" + j);
    ($(".searchResultListItemButton")[j]).click();
    },1000*(j+1));
}

function validate_highlight(j){
    setTimeout(function(){
        var txt=$(SEL_RESULTLIST_ITEM)[j].outerHTML;

                                if (txt.toLowerCase().indexOf("<b>"+searchString.toLowerCase()+"</b>")>=0){

                                      global.ok(true,"Search term '"+searchString+"' Highlighted at position : '" + txt.toLowerCase().indexOf("<b>"+searchString.toLowerCase()+"</b>") +"' in Summary and so it is correct");

                                  } else {

                                        global.ok(true, "Item Index: "+j);

                                        var detailedTxt=$(".searchResultListItemDetail-attributes")[0].outerHTML;

                                        //global.ok(true, "Detailed Text: "+detailedTxt);

                                        if(detailedTxt.toLowerCase().indexOf("<b>"+searchString.toLowerCase()+"</b>")>=0) {
                                            global.ok(true,"Search term '"+searchString+"' Highlighted at position : '" + detailedTxt.toLowerCase().indexOf("<b>"+searchString.toLowerCase()+"</b>") +"' in Details and so it is correct");
                                        } else {
                                            global.ok(false, "Search String Highlighting is not working for Result Row no.: "+(itemIdx+1));
                                        }

                                    }
    },1000*(j+1));
}



/*
 *   TEST 5: Validate Search Results Total Count         ---EXTENSION(multiple search term)
* */
var expectedSearchResultCount = [];
expectedSearchResultCount[1] = "(2)";    //mp3
expectedSearchResultCount[2] = "(14)";    //notebooks
expectedSearchResultCount[3] = "(42)";    //usd
expectedSearchResultCount[4] = "(83)";    //eur
expectedSearchResultCount[5] = "(41)";    //epm

asyncTest("Validate Search Results Total Count", 20, function() {
var searchTerm = [];
searchTerm [1] = "mp3";
searchTerm [2] = "notebooks";
searchTerm [3] = "usd";
searchTerm [4] = "eur";
searchTerm [5] = "epm";
    var i;
    for (i = 1; i <= 5; i++) {
        setTimeout(function() {

            searchString = searchTerm.pop();

            trigger_search(i, searchString);

            validate_count(i);

        }, 4000 * i);

    }
    // - start tests
    setTimeout(function() {
        $(SEL_OVERLAY_CLOSE).click();
        global.start();
    }, 45000);
});

function trigger_search(j, searchString){
    setTimeout(function(){
            global.ok(true, "search String: " + searchString);
            set_search_term(searchString + "\n",function() {

            });
    }, 1800 * j);
}

function validate_count(j){
    setTimeout(function(){
    find_element(SEL_SEARCH_RESULTS_COUNT,function(elem){

                              var item = $(elem);
                              var expected = expectedSearchResultCount.pop();
                              global.ok(true, "Actual Result Count: " + item.text());

                                  if (item.text() == expected) {
                                      // found search string
                                      //global.console.debug("in item " + itemIdx + " search string " + searchString[k] + " found. '" +item.text() + "'");
                                        global.ok(true, "Search Result Total Count is correct");

                                  } else {
                                      // search string not found
                                        global.ok(false, "Search Result Total Count is not correct, Expected Result Count: " + expected);
                                      //global.console.debug("in item " + itemIdx + " search string " + searchString[k] + " NOT found! '" +item.text() + "'");

                                  }
                               global.deepEqual(item.text(), expected);

                        });

    }, 2200 * j);
}


//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



/* JIAN's CODE:
 *   TEST 6: Passing multiple search terms and validating
* */

asyncTest("Passing multiple search terms and validating(JIAN's CODE)", function() {
var searchTerm = [];
searchTerm [1] = "mp3";
searchTerm [2] = "notebooks";
//searchTerm [3] = "sap";
//searchTerm [4] = "eur";
//searchTerm [5] = "epm";

    var i;
    for (i = 1; i <= 2; i++) {
        setTimeout(function() {
            searchString = searchTerm.pop();
            global.ok(true, "search String: " + searchString);
            set_search_term(searchString + "\n",function() {

                // - search was triggered - wait for result list
                find_element(SEL_RESULTLIST_ITEM,function(elem){

                    // - check if search-term is available in all resultItems
                    var searchStringNotContainedInItem = 0;
                    var searchStringContainedInItem = 0;
                    for (var itemIdx = 0; itemIdx < elem.length; itemIdx++) {
                        //global.console.debug("item: " + item + " elem[item]: " + $( $(elem)[item].html()));
                        var item = $($(elem)[itemIdx]);

                        // elem.length returns a too high number, so check really a resultlistitem is available:
                        if (item && item.html()) {
                            // check search-string found
                            if (item.text().toLowerCase().indexOf(searchString.toLowerCase()) >= 0) {
                                // found search string
                                global.console.debug("in item " + itemIdx + " search string " + searchString + " found. '" + item.text() + "'");
                                searchStringContainedInItem++;
                            } else {
                                // search string not found
                                global.console.debug("in item " + itemIdx + " search string " + searchString + " NOT found! '" + item.text() + "'");
                                searchStringNotContainedInItem++;
                            }
                        }
                    }
                    global.ok(true,
                            "Found search string (" + searchString + ") only in " + searchStringContainedInItem
                            + " of " + (searchStringNotContainedInItem + searchStringContainedInItem) + " result list items.");
                });
            });

        }, 3000 * i);
    }
    setTimeout(function() {
        $(SEL_OVERLAY_CLOSE).click();
        global.start();
    },10000);
});


/*
 *  TEST 7: Validate Search Highlighting Feature(summary & details)     //$$$ search for HT* also...there is some bug in the detailed results.
* */
var counter = 0;
asyncTest("Validate Search Highlighting Feature(summary & details) multiple search terms", 57, function() {
        var searchTermsHighlight = [];
        searchTermsHighlight[1] = "eur";
        searchTermsHighlight[2] = "usd";
        searchTermsHighlight[3] = "berlin";
        for (var i = 1; i <= 3; i++) {
        var counter = 0;
        setTimeout(function() {
            searchString = searchTermsHighlight.pop();
                  global.ok(true, "Search String: " + searchString);
                  set_search_term(searchString + "\n", function() {
                  //global.ok(true, "search term entered in search box");
                  // - search was triggered - wait for result list
                      find_element(SEL_RESULTLIST_ITEM,function(elem){

                          var count = $(SEL_RESULTLIST_ITEM).length;
                          console.info("Result Count: " + count);
                          var itemIdx;
                          //var i=0;
                          for (itemIdx = 0; itemIdx < count; itemIdx++) {

                            click_details(itemIdx, count);
                            //createTimer(itemIdx);
                            //check(itemIdx);






                            //},1000);

                        }


                         //setTimeout(function(){
                //global.ok(counter===count, "All the search results have the search term present");
                //},1000*itemIdx+1);

                      });

                });

                }, 30000 * i + 1);
        }

      setTimeout(function() {
        //close the overlay

        $(SEL_OVERLAY_CLOSE).click();
        global.start();
      },30000 * i + 1);
});

function click_details(j, count){
    setTimeout(function(){
        var param = j;

        global.ok(true,"clicked on detail button of row:" + (j + 1));
        ($(".searchResultListItemButton")[j]).click();

        check(j, count);
        },3000 * j + 1);
}

function check(j, count, counter){

    //setTimeout(function(){
    var txt = $(SEL_RESULTLIST_ITEM)[j].outerHTML;
    var title_text = $(".searchResultListItem-left span[class$='searchResultListItem-title']")[j].innerHTML;
     //global.ok(true, "summary text="+txt);
    //  if (txt.toLowerCase().indexOf("<b>"+searchString.toLowerCase()+"</b>")>=0  || chk.toLowerCase().indexOf("<b>"+searchString.toLowerCase()+"</b>")>=0)
    if (txt.toLowerCase().indexOf("<b>" + searchString.toLowerCase() + "</b>") >= 0){
          // found search string
          //global.ok(true, "summary row"+(j+1));
          global.ok(true,"Search term '" + searchString + "' Highlighted at position : '" + txt.toLowerCase().indexOf("<b>" + searchString.toLowerCase() + "</b>") + "' in Summary and so it is correct");

     } else if (title_text.toLowerCase().indexOf("<b>" + searchString.toLowerCase() + "</b>") >= 0){
          // found search string
          global.ok(true,"title_text=" + title_text);
          global.ok(true,"row number:" + (j + 1));
          global.ok(true,"Search term '" + searchString + "' Highlighted at position : in title'" + txt.toLowerCase().indexOf("<b>" + searchString.toLowerCase() + "</b>") + "' in Summary and so it is correct");
     } else {
        //setTimeout(function() {

    //find_element(SEL_RESULTLIST_DETAIL_BUTTON,function(elem){
        //global.ok(true, "Item Index: "+j);
        //setTimeout(function(){
        //$($(".searchResultListItemButton")[i-1]).click();
        //},1000*i+1);

        //find_element(SEL_DETAILED_AREA, function(elem){

          var detailedTxt = $(".searchResultListItemDetail-attributes")[0].outerHTML;

          //global.ok(true, "Detailed Text: "+detailedTxt);

          if (detailedTxt.toLowerCase().indexOf("<b>" + searchString.toLowerCase() + "</b>") >= 0) {
                global.ok(true,"Search term '" + searchString + "' Highlighted at position : '" + detailedTxt.toLowerCase().indexOf("<b>" + searchString.toLowerCase() + "</b>") + "' in Details and so it is correct");
                //global.ok(true,"row number:"+(j+1));
                //counter=counter+1;
          } else {

                global.ok(false, "Search String Highlighting is not working for Result Row no.: " + (j + 1));
          }

        //});
    //});
    //},1000);
        }


//},1000*j+1);

    }

/*
 *   TEST 8: Validate suggestion highlighting
* */
asyncTest("Validate suggestion highlighting", function() {
    var searchTerm = [];
    searchTerm [1] = "mp";


        var i;
        for (i = 0; i < 1; i++) {
           setTimeout(function() {
           click_and_validate(i, searchTerm);
           },5000 * i);
        }
        // - start tests
        setTimeout(function() {
            //close the overlay
            $(SEL_OVERLAY_CLOSE).click();
            global.start();
        }, 10000);

    });

function click_and_validate(i, searchTerm){
  setTimeout(function(){
      searchString = searchTerm.pop();
      set_search_term(searchString,function(){

          // - search term is set wait for suggestions
          setTimeout(function(){

              find_element(SEL_SUGGESTION_ITEM,function(elem){
                if ($(elem).length > 0) {
                   var item = $(elem)[0];
//                   item.click();
                   console.debug("highlighting node tag:" + item.childNodes[0].tagName);
                   console.debug("highlighting node value:" + item.childNodes[0].innerText);
                   global.ok(item.childNodes[0].tagName === 'B', "tag name is B");
                   global.ok(item.childNodes[0].innerText.toLowerCase() === searchString.toLowerCase(), "search value is highlighted in suggesion");
                   }
              },1000 * i);

         });
      });
  }, 4000 * i);

}



///*
// *   TEST 9: no result page
// * */
//
//asyncTest("No Result Page", function() {
//    var searchTerm = "lasdfhasduh";
//
//    setTimeout(function() {
//        validate(searchTerm);
//    },2000);
//
//    // - start tests
//    setTimeout(function()
//            {
//        //close the overlay
////        $(SEL_OVERLAY_CLOSE).click();
//        global.start();
//
//            },40000);
//
//});
//
//function validate(searchTerm){
////    setTimeout(function(){
//        global.ok(true, "search String: " +searchTerm);
//        set_search_term(searchTerm+"\n",function() {});
//
//            setTimeout(function(){
//                find_element(SEL_SEARCH_LAYOUT,function(elem){
//                    if($(SEL_NO_RESULT).length > 0){
//                        global.console.debug("Found No Result Page.");
//                        global.ok(true, "Found No Result Page.");
//                    }else{
//                        global.console.debug("NOT Found No Result Page.");
//                        global.ok(false, "NOT Found No Result Page.");
//                    }
//                });
//            }, 5000);
////        });
//
//
////    },5000);
//}






/*
 *   TEST 9: Validate No result Page
 * */
asyncTest("Validate No result Page", function() {
    var searchTerm = [];
    searchTerm [1] = "asidlfhsdf";

    var i;
    for (i = 1; i <= 1; i++) {
        setTimeout(function() {

            searchString = searchTerm.pop();

            trigger_search(i, searchString);

            validate_count(i);

        }, 4000 * i);

    }
    // - start tests
    setTimeout(function() {
        $(SEL_OVERLAY_CLOSE).click();
        global.start();
    }, 45000);
});

function trigger_search(j, searchString){
    setTimeout(function(){
        global.ok(true, "search String: " + searchString);
        set_search_term(searchString + "\n",function() {

        });
    },1800 * j);
}

function validate_count(j){
    setTimeout(function(){
        find_element(SEL_SEARCH_RESULTS_COUNT,function(elem){

            var item = $(elem);
//          var expected = expectedSearchResultCount.pop();
            global.ok(true, "Actual Result Count: " + item.text());

            if ($(SEL_NO_RESULT).length > 0){
                global.console.debug("Found No Result Page.");
                global.ok(true, "Found No Result Page.");
            } else {
                global.console.debug("NOT Found No Result Page.");
                global.ok(false, "NOT Found No Result Page.");
            }
        });

    }, 2200 * j);
}

/*
 *   TEST 10: Validate reverse ellipsis of highlighted field
 *   Use Q7D/002 as search backend esh_ret_test/display
 *   Browser resolution must be in destop range
 *   If this test shall be ported to HT3 some result attribute values with long string and highlighting must be found
* */

asyncTest("Validate reverse ellipsis of highlighted field", function() {
                  var localSearchString = "Article 52";
                  validateReverseEllipsis(localSearchString);
                  global.ok(true, "search String:" + localSearchString);
                  // - start tests
                  setTimeout(function() {
                      //close the overlay
                      $(SEL_OVERLAY_CLOSE).click();
                      global.start();
                  },40000);
});

function validateReverseEllipsis(searchString){
    setTimeout(function(){
                  global.ok(true, "search String: " + searchString);
                  set_search_term(searchString + "\n",function() {
                  // - search was triggered - wait for result list
                      find_element(SEL_RESULTLIST_ITEM,function(elem){

                        var count = $(SEL_RESULTLIST_ITEM).length;
//                        setTimeout(function() {
                            for (var itemIdx = 0; itemIdx < count; itemIdx++) {
                                var item = $($(elem)[itemIdx]);

                                var txt = item.html();
                                if (txt.toLowerCase().indexOf("...<b>") >= 0){
                                      global.ok(true, "Found reverse ellipsis.");
                                      return true;
                                }

                            }
//                        }, 3000);
                      });
                });

    },10000);
}

}(window));
