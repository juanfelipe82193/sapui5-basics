// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
/* eslint camelcase:0 */
sinaDefine(['./template_metadata', './template_details_folklorists', './template_details_legends', './template_details_publications'], function (template_metadata, template_details_folklorists, template_details_legends, template_details_publications) {
    "use strict";


    this.template_metadata = template_metadata;
    this.template_details_folklorists = template_details_folklorists;
    this.template_details_legends = template_details_legends;
    this.template_details_publications = template_details_publications;
    return function (oContext) {

        var gen = {};
        gen.metadata = [];
        gen.metadata2 = [];
        gen.metadata3 = [];
        gen.getMetadataById = function (list, id) {
            var res = null;
            for (var i = 0; i < list.length; i++) {
                if (list[i].id === id) {
                    res = list[i];
                    break;
                }
            }
            return res;
        };

        gen.searchResultSetItemArray = [];
        gen.searchResultSetItemArray2 = [];
        gen.searchResultSetItemArray3 = [];
        gen.chartResultSetArray = [];


        var titleAttributes, detailAttributes;

        gen._init = function (metadataRoot) {
            var metadata1 = metadataRoot.metadata;
            var metadata2 = metadataRoot.metadata2;
            var metadata3 = metadataRoot.metadata3;

            oContext.sina._createDataSource({
                id: "Folklorists",
                label: "Folklorist",
                labelPlural: "Folklorists",
                type: oContext.sina.DataSourceType.BusinessObject,
                attributesMetadata: metadata1
            });
            oContext.sina._createDataSource({
                id: "Urban_Legends",
                label: "Urban Legend",
                labelPlural: "Urban Legends",
                type: oContext.sina.DataSourceType.BusinessObject,
                attributesMetadata: metadata2
            });
            oContext.sina._createDataSource({
                id: "Publications",
                label: "Publication",
                labelPlural: "Publications",
                type: oContext.sina.DataSourceType.BusinessObject,
                attributesMetadata: metadata3
            });
        };

        /*
         *
         *     Metadata
         *
         *
         */

        if (oContext.sina) {
            //metadata for folklorists
            gen.metadata = template_metadata(oContext).metadata;
            //metadata for legends
            gen.metadata2 = template_metadata(oContext).metadata2;
            //metadata for legends
            gen.metadata3 = template_metadata(oContext).metadata3;
        }


        if (oContext.searchQuery && oContext.searchQuery.filter && oContext.searchQuery.filter.dataSource && oContext.sina && oContext.NavigationTarget && oContext.sina.getDataSource("Folklorists")) {

            /*
             *
             *     'folklorist' searchResultSetItem 1: Andrew McCain
             *
             *
             */


            var searchTermsArray = [];
            var searchTerms = oContext.searchQuery.filter.searchTerm;
            /* eslint no-useless-escape:0 */
            searchTerms = searchTerms.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            var searchTermsArray1 = searchTerms.split(" ");
            for (var i = 0; i < searchTermsArray1.length; i++) {
                var elem = searchTermsArray1[i];
                if (elem.match(/\w/) !== null) {
                    searchTermsArray.push(elem);
                }
            }

            titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
                id: 'FOLKLORIST',
                valueHighlighted: '',
                isHighlighted: false,
                label: 'Folklorist',
                value: 'Andrew McCain',
                valueFormatted: 'Andrew McCain',
                metadata: gen.getMetadataById(gen.metadata, "FOLKLORIST")
            })];

            detailAttributes = template_details_folklorists(oContext, gen).george;


            /*
                        create a suv link for George !

                        */

            //oContext.addSuvLinkToSearchResultItem(detailAttributes[10]);
            oContext.addSuvLinkToSearchResultItem(detailAttributes[10], null, searchTermsArray);


            gen.searchResultSetItemArray.push(oContext.sina._createSearchResultSetItem({
                //attributes: [firstName],
                title: titleAttributes[0].valueFormatted,
                titleHighlighted: titleAttributes[0].valueFormatted,
                dataSource: oContext.sina.getDataSource("Folklorists"),
                titleAttributes: titleAttributes,
                titleDescriptionAttributes: [],
                detailAttributes: detailAttributes
            }));

            /*
             *
             *     'folklorists' searchResultSetItem 2:Carol Mandelbaum
             *
             *
             */

            titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
                id: 'FOLKLORIST',
                valueHighlighted: '',
                isHighlighted: false,
                label: 'Folklorist',
                value: 'Carol Mandelbaum',
                valueFormatted: 'Carol Mandelbaum',
                metadata: gen.getMetadataById(gen.metadata, "FOLKLORIST")
            })];

            detailAttributes = template_details_folklorists(oContext, gen).shira;



            gen.searchResultSetItemArray.push(oContext.sina._createSearchResultSetItem({
                //attributes: [firstName],
                title: titleAttributes[0].valueFormatted,
                titleHighlighted: titleAttributes[0].valueFormatted,
                dataSource: oContext.sina.getDataSource("Folklorists"),
                titleAttributes: titleAttributes,
                titleDescriptionAttributes: [],
                detailAttributes: detailAttributes
            }));

            /*
             *
             *     'folklorists' searchResultSetItem 3:Ryan Anderson
             *
             *
             */

            titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
                id: 'FOLKLORIST',
                valueHighlighted: '',
                isHighlighted: false,
                label: 'Folklorist',
                value: 'Ryan Anderson',
                valueFormatted: 'Ryan Anderson',
                metadata: gen.getMetadataById(gen.metadata, "FOLKLORIST")
            })];

            detailAttributes = template_details_folklorists(oContext, gen).benjamin;



            gen.searchResultSetItemArray.push(oContext.sina._createSearchResultSetItem({
                //attributes: [firstName],
                title: titleAttributes[0].valueFormatted,
                titleHighlighted: titleAttributes[0].valueFormatted,
                dataSource: oContext.sina.getDataSource("Folklorists"),
                titleAttributes: titleAttributes,
                titleDescriptionAttributes: [],
                detailAttributes: detailAttributes
            }));
            /*
             *
             *     'folklorists' searchResultSetItem 4:Simon Kingston
             *
             *
             */

            titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
                id: 'FOLKLORIST',
                valueHighlighted: '',
                isHighlighted: false,
                label: 'Folklorist',
                value: 'Simon Kingston',
                valueFormatted: 'Simon Kingston',
                metadata: gen.getMetadataById(gen.metadata, "FOLKLORIST")
            })];

            detailAttributes = template_details_folklorists(oContext, gen).richard;



            gen.searchResultSetItemArray.push(oContext.sina._createSearchResultSetItem({
                //attributes: [firstName],
                title: titleAttributes[0].valueFormatted,
                titleHighlighted: titleAttributes[0].valueFormatted,
                dataSource: oContext.sina.getDataSource("Folklorists"),
                titleAttributes: titleAttributes,
                titleDescriptionAttributes: [],
                detailAttributes: detailAttributes
            }));
            /*
             *
             *     'folklorists' searchResultSetItem 5:Cynthia MacDonald
             *
             *
             */

            titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
                id: 'FOLKLORIST',
                valueHighlighted: '',
                isHighlighted: false,
                label: 'Folklorist',
                value: 'Cynthia MacDonald',
                valueFormatted: 'Cynthia MacDonald',
                metadata: gen.getMetadataById(gen.metadata, "FOLKLORIST")
            })];

            detailAttributes = template_details_folklorists(oContext, gen).rosalie;



            gen.searchResultSetItemArray.push(oContext.sina._createSearchResultSetItem({
                //attributes: [firstName],
                title: titleAttributes[0].valueFormatted,
                titleHighlighted: titleAttributes[0].valueFormatted,
                dataSource: oContext.sina.getDataSource("Folklorists"),
                titleAttributes: titleAttributes,
                titleDescriptionAttributes: [],
                detailAttributes: detailAttributes
            }));

            /*
             *
             *     'folklorists' searchResultSetItem 6:Douglas Milford
             *
             *
             */

            titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
                id: 'FOLKLORIST',
                valueHighlighted: '',
                isHighlighted: false,
                label: 'Folklorist',
                value: 'Douglas Milford',
                valueFormatted: 'Douglas Milford',
                metadata: gen.getMetadataById(gen.metadata, "FOLKLORIST")
            })];

            detailAttributes = template_details_folklorists(oContext, gen).bill;



            gen.searchResultSetItemArray.push(oContext.sina._createSearchResultSetItem({
                //attributes: [firstName],
                title: titleAttributes[0].valueFormatted,
                titleHighlighted: titleAttributes[0].valueFormatted,
                dataSource: oContext.sina.getDataSource("Folklorists"),
                titleAttributes: titleAttributes,
                titleDescriptionAttributes: [],
                detailAttributes: detailAttributes
            }));


            /*
             *
             *     'legends' searchResultSetItem 1: Sewer Alligator
             *
             *
             */

            titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
                id: 'CAPTION',
                valueHighlighted: '',
                isHighlighted: false,
                label: 'Caption',
                value: '',
                valueFormatted: 'Sewer Alligator',
                metadata: gen.getMetadataById(gen.metadata2, "CAPTION")
            })];
            detailAttributes = template_details_legends(oContext, gen).alligator;

            gen.searchResultSetItemArray2.push(oContext.sina._createSearchResultSetItem({
                //attributes: [firstName],
                title: titleAttributes[0].valueFormatted,
                titleHighlighted: titleAttributes[0].valueFormatted,
                dataSource: oContext.sina.getDataSource("Urban_Legends"),
                titleAttributes: titleAttributes,
                titleDescriptionAttributes: [],
                detailAttributes: detailAttributes,
                defaultNavigationTarget: new oContext.NavigationTarget({
                    label: 'Alligators in the Sewers, Wikipedia',
                    targetUrl: 'https://en.wikipedia.org/wiki/Sewer_alligator',
                    target: '_blank'
                })
            }));
            /*
             *
             *     'legends' searchResultSetItem 2: Slender Man
             *
             *
             */

            titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
                id: 'CAPTION',
                valueHighlighted: '',
                isHighlighted: false,
                label: 'Caption',
                value: '',
                valueFormatted: 'Slender Man',
                metadata: gen.getMetadataById(gen.metadata2, "CAPTION")
            })];

            detailAttributes = template_details_legends(oContext, gen).slenderman;


            gen.searchResultSetItemArray2.push(oContext.sina._createSearchResultSetItem({
                //attributes: [firstName],
                title: titleAttributes[0].valueFormatted,
                titleHighlighted: titleAttributes[0].valueFormatted,
                dataSource: oContext.sina.getDataSource("Urban_Legends"),
                titleAttributes: titleAttributes,
                detailAttributes: detailAttributes,
                titleDescriptionAttributes: [],
                defaultNavigationTarget: new oContext.NavigationTarget({
                    label: 'Slender Man, Wikipedia',
                    targetUrl: 'https://en.wikipedia.org/wiki/Slender_Man',
                    target: '_blank'
                })
            }));

            /*
             *
             *     'legends' searchResultSetItem 3: Chupacabra
             *
             *
             */

            titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
                id: 'CAPTION',
                valueHighlighted: '',
                isHighlighted: false,
                label: 'Caption',
                value: '',
                valueFormatted: 'Chupacabra',
                metadata: gen.getMetadataById(gen.metadata2, "CAPTION")
            })];

            detailAttributes = template_details_legends(oContext, gen).chupacabra;



            gen.searchResultSetItemArray2.push(oContext.sina._createSearchResultSetItem({
                //attributes: [firstName],
                title: titleAttributes[0].valueFormatted,
                titleHighlighted: titleAttributes[0].valueFormatted,
                dataSource: oContext.sina.getDataSource("Urban_Legends"),
                titleAttributes: titleAttributes,
                detailAttributes: detailAttributes,
                titleDescriptionAttributes: [],
                defaultNavigationTarget: new oContext.NavigationTarget({
                    label: 'Chupacabra, Wikipedia',
                    targetUrl: 'https://en.wikipedia.org/wiki/Chupacabra',
                    target: '_blank'
                })
            }));

            /*
             *
             *     'legends' searchResultSetItem 3: Vanishing_hitchhiker 1
             *
             *
             */

            titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
                id: 'CAPTION',
                valueHighlighted: '',
                isHighlighted: false,
                label: 'Caption',
                value: '',
                valueFormatted: 'Vanishing Hitchhiker',
                metadata: gen.getMetadataById(gen.metadata2, "CAPTION")
            })];

            detailAttributes = template_details_legends(oContext, gen).hitchhiker;



            gen.searchResultSetItemArray2.push(oContext.sina._createSearchResultSetItem({
                //attributes: [firstName],
                title: titleAttributes[0].valueFormatted,
                titleHighlighted: titleAttributes[0].valueFormatted,
                dataSource: oContext.sina.getDataSource("Urban_Legends"),
                titleAttributes: titleAttributes,
                detailAttributes: detailAttributes,
                titleDescriptionAttributes: [],
                defaultNavigationTarget: new oContext.NavigationTarget({
                    label: 'Vanishing Hitchhiker, Wikipedia',
                    targetUrl: 'https://en.wikipedia.org/wiki/Vanishing_hitchhiker',
                    target: '_blank'
                })
            }));

            /*
             *
             *     'legends' searchResultSetItem 4: Vanishing_hitchhiker 2
             *
             *
             */

            titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
                id: 'CAPTION',
                valueHighlighted: '',
                isHighlighted: false,
                label: 'Caption',
                value: '',
                valueFormatted: 'Vanishing Hitchhiker',
                metadata: gen.getMetadataById(gen.metadata2, "CAPTION")
            })];

            detailAttributes = template_details_legends(oContext, gen).hitchhiker2;


            gen.searchResultSetItemArray2.push(oContext.sina._createSearchResultSetItem({
                //attributes: [firstName],
                title: titleAttributes[0].valueFormatted,
                titleHighlighted: titleAttributes[0].valueFormatted,
                dataSource: oContext.sina.getDataSource("Urban_Legends"),
                titleAttributes: titleAttributes,
                detailAttributes: detailAttributes,
                titleDescriptionAttributes: [],
                defaultNavigationTarget: new oContext.NavigationTarget({
                    label: 'Journal Article "The Vanishing Hitchhiker" by Richard K. Beardsley and Cynthia MacDonald in the California Folklore Quarterly.',
                    targetUrl: 'https://www.jstor.org/stable/1495600',
                    target: '_blank'
                })
            }));
            /*
             *
             *     'legends' searchResultSetItem 5: Baby Train
             *
             *
             */

            titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
                id: 'CAPTION',
                valueHighlighted: '',
                isHighlighted: false,
                label: 'Caption',
                value: '',
                valueFormatted: 'The Baby Train',
                metadata: gen.getMetadataById(gen.metadata2, "CAPTION")
            })];

            detailAttributes = template_details_legends(oContext, gen).babytrain;

            gen.searchResultSetItemArray2.push(oContext.sina._createSearchResultSetItem({
                //attributes: [firstName],
                title: titleAttributes[0].valueFormatted,
                titleHighlighted: titleAttributes[0].valueFormatted,
                dataSource: oContext.sina.getDataSource("Urban_Legends"),
                titleAttributes: titleAttributes,
                detailAttributes: detailAttributes,
                titleDescriptionAttributes: [],
                defaultNavigationTarget: new oContext.NavigationTarget({
                    label: "Baby Train, Wikipedia",
                    targetUrl: 'https://en.wikipedia.org/wiki/Baby_Train',
                    target: '_blank'
                })
            }));

            /*
             *
             *     'publications' searchResultSetItem 1: 
             *
             *
             */


            //git commit --amend --reset-author
            //var addTestCaseSuvs = (document.location.href.indexOf("addFileViewerSuvs=true") > -1);
            titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
                id: 'CAPTION',
                value: 'Sewer Alligator',
                valueFormatted: 'Sewer Alligator',
                valueHighlighted: 'Sewer Alligator',
                isHighlighted: false,
                label: 'Caption',
                metadata: gen.getMetadataById(gen.metadata3, "PUB")
            })];
            detailAttributes = template_details_publications(oContext, gen).alligatorbook;
            //if (addTestCaseSuvs) {
            //    suvPath = "/fileviewer-testdata/test.suv";
            //searchTermsArray = ["said", "aware"];
            //    oContext.addSuvLinkToSearchResultItem(detailAttributes[0], suvPath, searchTermsArray);
            //} else {
            oContext.addSuvLinkToSearchResultItem(detailAttributes[0], null, searchTermsArray);
            //}


            gen.searchResultSetItemArray3.push(oContext.sina._createSearchResultSetItem({
                //attributes: [firstName],
                dataSource: oContext.sina.getDataSource("Publications"),
                title: 'Sewer Alligator',
                titleHighlighted: 'Sewer Alligator',
                titleAttributes: titleAttributes,
                titleDescriptionAttributes: [],
                detailAttributes: detailAttributes
            }));

            /*
             *
             *     'publications' searchResultSetItem 2: 
             *
             *
             */

            titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
                id: 'CAPTION',
                value: 'Slender Man',
                valueFormatted: 'Slender Man',
                valueHighlighted: 'Slender Man',
                isHighlighted: false,
                label: 'Caption',
                metadata: gen.getMetadataById(gen.metadata3, "PUB")
            })];

            detailAttributes = template_details_publications(oContext, gen).slendermanbook;

            // if (addTestCaseSuvs) {
            //     suvPath = "/fileviewer-testdata/spiegel.suv";
            //searchTermsArray = ["said", "aware"];
            //    oContext.addSuvLinkToSearchResultItem(detailAttributes[0], suvPath, searchTermsArray);
            // } else {
            //oContext.addSuvLinkToSearchResultItem(detailAttributes[0],
            //    '/sap/bc/ui5_ui5/ui2/ushell/resources/sap/ushell/renderers/fiori2/search/sinaNext/providers/sample/docs/test2.suv', ['assignment', 'sign']);
            oContext.addSuvLinkToSearchResultItem(detailAttributes[0], null, searchTermsArray);
            // }
            gen.searchResultSetItemArray3.push(oContext.sina._createSearchResultSetItem({
                //attributes: [firstName],
                dataSource: oContext.sina.getDataSource("Publications"),
                title: 'Slender Man',
                titleHighlighted: 'Slender Man',
                titleAttributes: titleAttributes,
                titleDescriptionAttributes: [],
                detailAttributes: detailAttributes
            }));
            /*
             *
             *     'publications' searchResultSetItem 3: 
             *
             *
             */
            titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
                id: 'CAPTION',
                value: 'Chupacabra',
                valueFormatted: 'Chupacabra',
                valueHighlighted: 'Chupacabra',
                isHighlighted: false,
                label: 'Caption',
                metadata: gen.getMetadataById(gen.metadata3, "PUB")
            })];

            detailAttributes = template_details_publications(oContext, gen).chupacabrabook;

            //if (addTestCaseSuvs) {
            //    suvPath = "/fileviewer-testdata/adminguide.suv";
            //searchTermsArray = ['assignment', 'sign'];
            //    oContext.addSuvLinkToSearchResultItem(detailAttributes[0], suvPath, searchTermsArray);
            //} else {

            oContext.addSuvLinkToSearchResultItem(detailAttributes[0], null, searchTermsArray);
            //}
            gen.searchResultSetItemArray3.push(oContext.sina._createSearchResultSetItem({
                //attributes: [firstName],
                dataSource: oContext.sina.getDataSource("Publications"),
                title: 'Chupacabra',
                titleHighlighted: 'Chupacabra',
                titleAttributes: titleAttributes,
                titleDescriptionAttributes: [],
                detailAttributes: detailAttributes
            }));
            /*
             *
             *     'publications' searchResultSetItem 4: 
             *
             *
             */
            titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
                id: 'CAPTION',
                value: 'Vanishing Hitchhiker',
                valueFormatted: 'Vanishing Hitchhiker',
                valueHighlighted: 'Vanishing Hitchhiker',
                isHighlighted: false,
                label: 'Caption',
                metadata: gen.getMetadataById(gen.metadata3, "PUB")
            })];

            detailAttributes = template_details_publications(oContext, gen).hitchhikerbook;
            oContext.addSuvLinkToSearchResultItem(detailAttributes[0], null, searchTermsArray);
            gen.searchResultSetItemArray3.push(oContext.sina._createSearchResultSetItem({
                //attributes: [firstName],
                dataSource: oContext.sina.getDataSource("Publications"),
                title: 'Vanishing Hitchhiker',
                titleHighlighted: 'Vanishing Hitchhiker',
                titleAttributes: titleAttributes,
                titleDescriptionAttributes: [],
                detailAttributes: detailAttributes
            }));
            /*
             *
             *     'publications' searchResultSetItem 5: 
             *
             *
             */
            titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
                id: 'CAPTION',
                value: 'Vanishing Hitchhiker',
                valueFormatted: 'Vanishing Hitchhiker',
                valueHighlighted: 'Vanishing Hitchhiker',
                isHighlighted: false,
                label: 'Caption',
                metadata: gen.getMetadataById(gen.metadata3, "PUB")
            })];

            detailAttributes = template_details_publications(oContext, gen).hitchhiker2book;
            oContext.addSuvLinkToSearchResultItem(detailAttributes[0], null, searchTermsArray);
            gen.searchResultSetItemArray3.push(oContext.sina._createSearchResultSetItem({
                //attributes: [firstName],
                dataSource: oContext.sina.getDataSource("Publications"),
                title: 'Vanishing Hitchhiker',
                titleHighlighted: 'Vanishing Hitchhiker',
                titleAttributes: titleAttributes,
                titleDescriptionAttributes: [],
                detailAttributes: detailAttributes
            }));
            /*
             *
             *     'publications' searchResultSetItem 6: 
             *
             *
             */
            titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
                id: 'CAPTION',
                value: 'The Baby Train',
                valueFormatted: 'The Baby Train',
                valueHighlighted: 'The Baby Train',
                isHighlighted: false,
                label: 'Caption',
                metadata: gen.getMetadataById(gen.metadata3, "PUB")
            })];

            detailAttributes = template_details_publications(oContext, gen).babytrainbook;
            oContext.addSuvLinkToSearchResultItem(detailAttributes[0], null, searchTermsArray);
            gen.searchResultSetItemArray3.push(oContext.sina._createSearchResultSetItem({
                //attributes: [firstName],
                dataSource: oContext.sina.getDataSource("Publications"),
                title: 'The Baby Train',
                titleHighlighted: 'The Baby Train',
                titleAttributes: titleAttributes,
                titleDescriptionAttributes: [],
                detailAttributes: detailAttributes
            }));



        } //end if datasource etc



        return gen;
    };
});
