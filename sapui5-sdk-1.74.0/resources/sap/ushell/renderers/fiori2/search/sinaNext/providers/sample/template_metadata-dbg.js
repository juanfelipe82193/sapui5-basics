// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine([], function () {
    "use strict";
    return function (oContext) {
        var res = {};
        res.metadata = [
            oContext.sina._createAttributeMetadata({
                id: 'FOLKLORIST',
                label: 'Folklorist',
                dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.String,
                usage: {
                    Title: 'Title',
                    AdvancedSearch: {
                        displayOrder: 0
                    }, //necessary to open showmore dialog
                    Facet: {}
                },
                isSortable: true,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'LOCATION',
                label: 'Location', //to do: has no effect??
                dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.String,
                usage: {
                    Detail: 'Detail',
                    AdvancedSearch: {
                        displayOrder: 0
                    }, //necessary to open showmore dialog
                    Facet: {}
                },
                isSortable: true,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'WEBSITE',
                label: 'Website', //to do: has no effect??
                dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.String,
                usage: {
                    Detail: 'Detail',
                    AdvancedSearch: {
                        displayOrder: 0
                    } //necessary to open showmore dialog
                },
                isURL: true,
                isSortable: true,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'SUMMARY',
                label: 'Summary', //to do: has no effect??
                //dataType: oContext.sina.AttributeType.Longtext,
                type: oContext.sina.AttributeType.String,
                format: oContext.sina.AttributeFormatType.LongText,
                usage: {
                    Detail: 'Detail',
                    AdvancedSearch: {
                        displayOrder: 0
                    } //necessary to open showmore dialog
                },
                isURL: true,
                isSortable: true,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'LOC_4326',
                label: 'LOC_4326', //to do: has no effect??
                //dataType: oContext.sina.AttributeType.GeoJson,
                type: oContext.sina.AttributeType.GeoJson,
                usage: {
                    type: 'Detail',
                    displayOrder: 1
                },
                isSortable: true,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'SEX',
                label: 'Sex',
                //dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.String,
                usage: {
                    Title: 'Title',
                    AdvancedSearch: {
                        displayOrder: 0
                    }, //necessary to open showmore dialog
                    Facet: {}
                },
                isSortable: true,
                isKey: false,
                hasDescription: true,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'SEX_DESC',
                label: 'Description for Gender',
                //dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.String,
                usage: {
                    Title: 'Title',
                    AdvancedSearch: {
                        displayOrder: 0
                    }, //necessary to open showmore dialog
                    Facet: {}
                },
                isSortable: false,
                isKey: false,
                isDescription: true,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'DISCIPLINE',
                label: 'Discipline',
                //dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.String,
                usage: 'detail',
                isSortable: true,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'DESC',
                label: 'Descritption',
                //dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.String,
                usage: 'detail',
                isSortable: true,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'PIC',
                label: 'picture',
                //dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.ImageUrl,
                usage: 'title',
                presentationUsage: 'Thumbnail',
                format: 'round',
                isSortable: false,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'SALARY',
                label: 'Salary',
                //dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.Integer,
                usage: 'detail',
                isSortable: true,
                isQuantity: true,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'CURRENCY',
                label: 'Currency',
                //dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.String,
                usage: 'detail',
                isSortable: true,
                isCurrency: true,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'HEIGHT',
                label: 'Height',
                //dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.Integer,
                usage: 'detail',
                isSortable: true,
                isQuantity: true,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'UOM_HEIGHT',
                label: 'Unit of Measure for Height Attribute',
                //dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.String,
                usage: 'detail',
                isSortable: true,
                isUnitOfMeasure: true,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'PHONE',
                label: 'Phone',
                //dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.String,
                usage: 'detail',
                isSortable: true,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'PUB',
                label: 'Publication',
                type: oContext.sina.AttributeType.ImageUrl,
                format: oContext.sina.AttributeFormatType.DocumentThumbnail,
                usage: {
                    Title: 'Title',
                    AdvancedSearch: {
                        displayOrder: 0
                    } //necessary to open showmore dialog
                },
                presentationUsage: 'Thumbnail',
                isSortable: false,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'EMAIL',
                label: 'Email',
                //dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.String,
                usage: 'detail',
                isSortable: true,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            })
        ];

        res.metadata2 = [
            oContext.sina._createAttributeMetadata({
                id: 'CAPTION',
                label: 'Caption',
                dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.String,
                usage: 'title',
                isSortable: true,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'LOCATION',
                label: 'Location',
                dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.String,
                usage: {
                    Detail: 'Detail',
                    AdvancedSearch: {
                        displayOrder: 0
                    }, //necessary to open showmore dialog
                    Facet: {}
                },
                isSortable: true,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'LOC_4326',
                label: 'LOC_4326', //to do: has no effect??
                //dataType: oContext.sina.AttributeType.GeoJson,
                type: oContext.sina.AttributeType.GeoJson,
                usage: {
                    type: 'Detail',
                    displayOrder: 1
                },
                isSortable: true,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'FOLKLORIST',
                label: 'Folklorist',
                dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.String,
                usage: {
                    Title: 'Title',
                    AdvancedSearch: {
                        displayOrder: 0
                    }, //necessary to open showmore dialog
                    Facet: {}
                },
                isSortable: false,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'DESC',
                label: 'Descritption',
                dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.String,
                format: oContext.sina.AttributeFormatType.LongText,
                usage: 'detail',
                isSortable: true,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'PIC',
                label: 'picture',
                //dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.ImageUrl,
                usage: 'title',
                presentationUsage: 'Thumbnail',
                isSortable: false,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'URL',
                label: 'URL',
                dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.String,
                usage: 'detail',
                isSortable: true,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            })
        ];
        /*
                        Publications metadata

        */
        res.metadata3 = [
            oContext.sina._createAttributeMetadata({
                id: 'PUB',
                label: 'Publication',
                dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.ImageUrl,
                format: oContext.sina.AttributeFormatType.DocumentThumbnail,
                usage: {
                    Title: 'Title',
                    AdvancedSearch: {
                        displayOrder: 0
                    } //necessary to open showmore dialog
                },
                presentationUsage: 'Thumbnail',
                isSortable: false,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }), oContext.sina._createAttributeMetadata({
                id: 'FOLKLORIST',
                label: 'Folklorist',
                dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.String,
                usage: {
                    Detail: 'Detail',
                    AdvancedSearch: {
                        displayOrder: 0
                    }, //necessary to open showmore dialog
                    Facet: {}
                },
                isSortable: true,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            }),
            oContext.sina._createAttributeMetadata({
                id: 'DESC',
                label: 'Description',
                dataType: oContext.sina.AttributeType.String,
                type: oContext.sina.AttributeType.String,
                format: oContext.sina.AttributeFormatType.LongText,
                usage: 'detail',
                isSortable: true,
                isKey: false,
                matchingStrategy: oContext.sina.MatchingStrategy.Exact
            })
        ];

        return res;
    };
});
