// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global Promise, sinaDefine, sinaRequire, sinaLog */

/* eslint no-fallthrough: 0 */

sinaDefine(['../../core/core', './typeConverter'], function (core, typeConverter) {
    "use strict";

    return core.defineClass({

        _init: function (provider) {
            this.provider = provider;
            this.sina = provider.sina;
            this.presentationUsageConversionMap = {
                TITLE: 'TITLE',
                SUMMARY: 'SUMMARY',
                DETAIL: 'DETAIL',
                IMAGE: 'IMAGE',
                THUMBNAIL: 'THUMBNAIL',
                HIDDEN: 'HIDDEN'
            };
            this.accessUsageConversionMap = {
                AUTO_FACET: 'AUTO_FACET',
                SUGGESTION: 'SUGGESTION'
            };
        },

        _getWindow: function () {
            if (typeof window === "undefined") {
                return new Promise(function (resolve, reject) {
                    sinaRequire(['jsdom', 'fs'], function (jsdom, fs) {
                        var jquery = fs.readFileSync("./node_modules/jquery/dist/jquery.js", "utf-8");

                        jsdom.env({
                            html: "<html><body></body></html>",
                            src: [jquery],
                            done: function (error, window) {
                                if (!error) {
                                    resolve(window);
                                } else {
                                    reject(error);
                                }
                            }
                        });
                    });
                });
            }
            return Promise.resolve(window);

        },

        parseResponse: function (metaXML) {
            var that = this;
            // all in one metadata map
            var allInOneMap = {
                businessObjectMap: {}, // entity map with attributes and entityset name as key
                businessObjectList: [], // list of all entities for convenience
                dataSourceMap: {}, // datasource map with entityset name as key
                dataSourcesList: [] // list of all datasources for convenience
            };

            return this._getWindow().then(function (window) {
                window.$(metaXML).find('Schema').each(function () {
                    var $this = window.$(this);
                    var helperMap = that._parseEntityType($this, window);

                    that._parseEntityContainer($this, helperMap, allInOneMap, window);
                });
                return Promise.resolve(allInOneMap);
            });
        },
        //parse entityset and its attributes from EntityType
        _parseEntityType: function (schema, window) {
            var that = this;
            var helperMap = {};
            schema = window.$(schema);

            schema.find('EntityType').each(function () {
                var entityTypeName = window.$(this).attr('Name');
                var entitySet = {
                    schema: schema.attr('Namespace'),
                    keys: [],
                    attributeMap: {},
                    resourceBundle: '',
                    labelResourceBundle: '',
                    label: '',
                    labelPlural: '',
                    annotations: {}
                };
                helperMap[entityTypeName] = entitySet;

                //oData keys for accessing a entity
                window.$(this).find('Key>PropertyRef').each(function () {
                    entitySet.keys.push(window.$(this).attr('Name'));
                });
                window.$(this).find('Annotation[Term="Search.searchable"]').each(function () {
                    //window.$(this).find('Annotation').each(function () {
                    // if (window.$(this).attr('Term') === 'EnterpriseSearchHana.uiResource.label.bundle') {
                    //     var resourceUrl = window.$(this).attr('String');
                    //     try {
                    //         entitySet.resourceBundle = jQuery.sap.resources({
                    //             url: resourceUrl,
                    //             language: sap.ui.getCore().getConfiguration().getLanguage()
                    //         });
                    //     } catch (e) {
                    //         sinaLog.error("Resource bundle of " + entityTypeName + " '" + resourceUrl + "' can't be found:" + e.toString());
                    //     }

                    //Get sibling annotation element of attr EnterpriseSearchHana.uiResource.label.key
                    window.$(this).siblings('Annotation').each(function () {
                        var $element = window.$(this);
                        var annotationName = $element.attr('Term');
                        if (annotationName !== undefined && annotationName.length > 0) {
                            annotationName = annotationName.toUpperCase();
                            var annotationValue = that._getValueFromElement(this);
                            if (annotationName === 'ENTERPRISESEARCHHANA.UIRESOURCE.LABEL.BUNDLE') {
                                var resourceUrl = annotationValue;
                                try {
                                    entitySet.resourceBundle = jQuery.sap.resources({
                                        url: resourceUrl,
                                        language: sap.ui.getCore().getConfiguration().getLanguage()
                                    });
                                } catch (e) {
                                    sinaLog.error("Resource bundle of " + entityTypeName + " '" + resourceUrl + "' can't be found:" + e.toString());
                                }
                            } else if (annotationName === 'ENTERPRISESEARCHHANA.UIRESOURCE.LABEL.KEY') {
                                var sKey = annotationValue;
                                if (sKey && entitySet.resourceBundle) {
                                    var sTranslatedText = entitySet.resourceBundle.getText(sKey);
                                    if (sTranslatedText) {
                                        entitySet.labelResourceBundle = sTranslatedText;
                                    }
                                }
                            } else if (annotationName === 'UI.HEADERINFO.TYPENAME') {
                                entitySet.label = annotationValue;
                            } else if (annotationName === 'UI.HEADERINFO.TYPENAMEPLURAL') {
                                entitySet.labelPlural = annotationValue;
                            } else if (annotationName === 'UI.HEADERINFO.TITLE.TYPE') {
                                that._setAnnotationValue(entitySet.annotations, annotationName, annotationValue);
                            } else if (annotationName === 'UI.HEADERINFO.TITLE.VALUEQUALIFIER') {
                                that._setAnnotationValue(entitySet.annotations, annotationName, annotationValue);
                            } else {
                                // var annoAttributes = window.$(this)[0].attributes;
                                // // In case of collection, say usageMode, it shall be handled differently
                                // if (annoAttributes.length === 2) {
                                //     var annoTerm = annoAttributes.item(0).value.toUpperCase();
                                //     var annoValue = annoAttributes.item(1).value;
                                //     entitySet.annotations[annoTerm] = annoValue;
                                // }

                                that._setAnnotationValue(entitySet.annotations, annotationName, annotationValue);
                            }
                        }
                    });
                    //}

                });

                //Loop attributes
                window.$(this).find('Property').each(function (index) {

                    var attributeName = window.$(this).attr('Name');
                    var attribute = {
                        labelRaw: attributeName,
                        label: null,
                        type: window.$(this).attr('Type'),
                        presentationUsage: [],
                        // accessUsage: [],
                        isFacet: false,
                        isSortable: false,
                        supportsTextSearch: false,
                        displayOrder: index,
                        annotationsAttr: {},
                        unknownAnnotation: []
                    };

                    entitySet.attributeMap[attributeName] = attribute;

                    window.$(this).find('Annotation').each(function () {
                        var annotationName = window.$(this).attr('Term');
                        if (annotationName !== undefined && annotationName.length > 0) {
                            annotationName = annotationName.toUpperCase();
                            var annotationValue = that._getValueFromElement(this);
                            if (annotationValue == undefined) {
                                window.$(this).children("Collection").children("Record").each(function () {
                                    annotationValue = annotationValue || [];
                                    var arrayEntry = {};
                                    annotationValue.push(arrayEntry);
                                    window.$(this).children("PropertyValue").each(function () {
                                        var entryAnnoName = window.$(this).attr("property");
                                        if (entryAnnoName !== undefined && entryAnnoName.length > 0) {
                                            entryAnnoName = entryAnnoName.toUpperCase();
                                            var entryAnnoValue = that._getValueFromElement(this);
                                            if (entryAnnoValue !== undefined) {
                                                arrayEntry[entryAnnoName] = entryAnnoValue;
                                            }
                                        }
                                    });
                                });
                            }

                            if (annotationValue !== undefined) {
                                switch (annotationName) {
                                case 'SAP.COMMON.LABEL':
                                    if (!attribute.label) {
                                        attribute.label = annotationValue;
                                    }
                                    break;
                                case 'ENTERPRISESEARCHHANA.UIRESOURCE.LABEL.KEY':
                                    if (annotationValue && entitySet.resourceBundle) {
                                        var sTranslatedText = entitySet.resourceBundle.getText(annotationValue);
                                        if (sTranslatedText) {
                                            attribute.label = sTranslatedText;
                                        }
                                    }
                                    break;
                                case 'ENTERPRISESEARCH.KEY':
                                    attribute.isKey = annotationValue;
                                    break;
                                case 'ENTERPRISESEARCH.PRESENTATIONMODE':
                                    window.$(this).find('Collection>String').each(function () {
                                        var presentationUsage = that._getValueFromElement(this);
                                        presentationUsage = that.presentationUsageConversionMap[presentationUsage];
                                        if (presentationUsage) {
                                            attribute.presentationUsage.push(presentationUsage);
                                        }
                                    });
                                    break;
                                    // case 'EnterpriseSearch.usageMode': // No longer available in v5
                                    //     window.$(this).find('Collection>String').each(function() {
                                    //         var accessUsage = annotationValue;
                                    //         accessUsage = that.accessUsageConversionMap[accessUsage];
                                    //         if (accessUsage) {
                                    //             attribute.accessUsage.push(accessUsage);
                                    //         }
                                    //     });
                                    //     break;
                                case 'ENTERPRISESEARCHHANA.ISSORTABLE':
                                    attribute.isSortable = annotationValue;
                                    break;
                                case 'ENTERPRISESEARCHHANA.SUPPORTSTEXTSEARCH':
                                    attribute.supportsTextSearch = annotationValue;
                                    break;
                                case 'ENTERPRISESEARCH.FILTERINGFACET.DEFAULT':
                                    attribute.isFacet = annotationValue;
                                    break;
                                case 'ENTERPRISESEARCH.DISPLAYORDER':
                                    attribute.displayOrder = annotationValue;
                                    break;
                                    // case '@EnterpriseSearch.filteringFacet.numberOfValues':
                                    //     attribute.numberOfFacetValues = annotationValue;
                                default:
                                    if (annotationName.startsWith("UI") || annotationName.startsWith("OBJECTMODEL") || annotationName.startsWith("SEMANTICS")) {
                                        that._setAnnotationValue(attribute.annotationsAttr, annotationName, annotationValue);
                                    } else {
                                        attribute.unknownAnnotation.push(window.$(this));
                                    }
                                }
                            }
                        }
                    });

                    var identification = attribute.annotationsAttr.UI && attribute.annotationsAttr.UI.IDENTIFICATION;
                    if (identification) {
                        if (identification.POSITION !== undefined) {
                            attribute.displayOrder = identification.POSITION;
                        } else if (Array.isArray(identification)) {
                            for (var i = 0; i < identification.length; i++) {
                                if (identification[i].TYPE == undefined && identification[i].POSITION !== undefined) {
                                    attribute.displayOrder = identification[i].POSITION;
                                    break;
                                }
                            }
                        }
                    }
                });
            });

            return helperMap;
        },

        // annotations: Object to store parsed annotations as properties
        // annotationName: Name of annotation in Dot Notation: UI.IDENTIFICATION.POSITION
        // value: can be a single value, like a string, or an array of objects, like UI.IDENTIFICATION = [ { POSITION: 5 }, { POSITION: 6, TYPE:AS_CONNECTED_FIELD, VALUEQUALIFIER:'somegroup' } ]
        _setAnnotationValue: function (annotations, annotationName, value) {
            var annotationParts = annotationName.split(".");
            var annotationPart;
            var annotationPointer = annotations;
            var dummyEntryName = "___temporaryDummyEntriesForArrays___";
            var i;

            // Step 01: create object structure for annoation
            for (i = 0; i < annotationParts.length - 1; i++) {
                annotationPart = annotationParts[i];
                if (annotationPointer[annotationPart] === undefined) {
                    annotationPointer[annotationPart] = {};
                    annotationPointer = annotationPointer[annotationPart];
                } else if (Array.isArray(annotationPointer[annotationPart])) {
                    // at this level an array was created for a previous annotation with the same name
                    // thus we need to create a dummy entry in that array for merging the current
                    // annotation into the array structure
                    annotationPointer[dummyEntryName] = annotationPointer[dummyEntryName] || {};
                    if (!annotationPointer[dummyEntryName][annotationPart]) {
                        annotationPointer[dummyEntryName][annotationPart] = {};
                        annotationPointer[annotationPart].push(annotationPointer[dummyEntryName][annotationPart]);
                    }
                    annotationPointer = annotationPointer[dummyEntryName][annotationPart];
                } else if (typeof annotationPointer[annotationPart] === "object") {
                    annotationPointer = annotationPointer[annotationPart];
                } else if (typeof annotationPointer[annotationPart] === "boolean") {
                    // for handling something like this:
                    //      @Semantics.URL: true
                    //      @Semantics.URL.mimeType: "anotherAttribute"
                    // if @Semantics.URL.mimeType is set, than @Semantics.URL is implicitely assumed to be 'true'
                    annotationPointer[annotationPart] = {};
                    annotationPointer = annotationPointer[annotationPart];
                } else {
                    // should never happen!
                    return;
                }
            }

            // Step 02: set value for annotation.
            if (i < annotationParts.length) {
                annotationPart = annotationParts[i];
                if (annotationPointer[annotationPart] === undefined) {
                    // value can be simple value, like string, or array
                    annotationPointer[annotationPart] = value;
                } else if (Array.isArray(annotationPointer[annotationPart])) {
                    // existing value could be an array, in which case the new value needs to be mixed in
                    if (Array.isArray(value)) {
                        // new value is an array, which can be appended to the existing array value
                        annotationPointer[annotationPart] = annotationPointer[annotationPart].concat(value);
                    } else {
                        // new value is a simple value. In this case create a dummy entry in the existing array
                        // (or use the dummy entry which had been created before) and add the new value to that entry.
                        annotationPointer[dummyEntryName] = annotationPointer[dummyEntryName] || {};
                        if (!annotationPointer[dummyEntryName][annotationPart]) {
                            annotationPointer[dummyEntryName][annotationPart] = value;
                            annotationPointer[annotationPart].push(annotationPointer[dummyEntryName][annotationPart]);
                        } else {
                            for (var propName in value) {
                                if (!annotationPointer[dummyEntryName][annotationPart][propName]) {
                                    annotationPointer[dummyEntryName][annotationPart][propName] = value[propName];
                                }
                            }
                        }
                    }
                }
            }
        },

        _getValueFromElement: function (element) {
            var $element = window.$(element);
            var value = $element.text();
            if (!value || value.trim().length == 0) {
                value = undefined;
                if ($element.attr('string') !== undefined) {
                    value = $element.attr('string');
                } else if ($element.attr('decimal') !== undefined) {
                    try {
                        value = Number.parseFloat($element.attr('decimal'));
                        if (isNaN(value)) {
                            value = undefined;
                        }
                    } catch (e) {
                        value = undefined;
                    }
                } else if ($element.attr('int') !== undefined) {
                    try {
                        value = Number.parseInt($element.attr('int'), 10);
                        if (isNaN(value)) {
                            value = undefined;
                        }
                    } catch (e) {
                        value = undefined;
                    }
                } else if ($element.attr('bool') !== undefined) {
                    value = $element.attr('bool') == "true";
                }
            }
            return value;
        },

        //parse datasources from EntityContainer
        _parseEntityContainer: function (schemaXML, helperMap, allInOneMap, window) {
            var that = this;
            schemaXML.find('EntityContainer>EntitySet').each(function () {
                if (window.$(this).attr('Name') && window.$(this).attr('EntityType')) {
                    var name = window.$(this).attr('Name');
                    var entityTypeFullQualified = window.$(this).attr('EntityType');

                    // var schema = entityTypeFullQualified.slice(0, entityTypeFullQualified.lastIndexOf('.'));
                    var entityType = entityTypeFullQualified.slice(entityTypeFullQualified.lastIndexOf('.') + 1);

                    var entitySet = helperMap[entityType];
                    if (entitySet === undefined) {
                        throw 'EntityType ' + entityType + ' has no corresponding meta data!';
                    }

                    var newDatasource = that.sina._createDataSource({
                        id: name,
                        label: entitySet.labelResourceBundle || entitySet.label || name,
                        labelPlural: entitySet.labelResourceBundle || entitySet.labelPlural || entitySet.label || name,
                        type: that.sina.DataSourceType.BusinessObject,
                        attributesMetadata: [{
                            id: 'dummy'
                        }] // fill with dummy attribute
                    });
                    newDatasource.annotations = entitySet.annotations;
                    allInOneMap.dataSourceMap[newDatasource.id] = newDatasource;
                    allInOneMap.dataSourcesList.push(newDatasource);

                    //that.fillMetadataBuffer(newDatasource, entitySet);
                    entitySet.name = name;
                    entitySet.dataSource = newDatasource;
                    allInOneMap.businessObjectMap[name] = entitySet;
                    allInOneMap.businessObjectList.push(entitySet);
                }
            });
        },

        fillMetadataBuffer: function (dataSource, attributes) {
            if (dataSource.attributesMetadata[0].id !== 'dummy') { // check if buffer already filled
                return;
            }
            dataSource.attributesMetadata = [];
            dataSource.attributeMetadataMap = {};

            var cdsAnnotations = {
                dataSourceAnnotations: {}, // Key-Value-Map for CDS annotations
                attributeAnnotations: {} // Key-Value-Map (keys: attribute names) of Key-Value-Maps (keys: annotation names) for CDS annotations
            };

            cdsAnnotations.dataSourceAnnotations = dataSource.annotations;

            for (var attributeMetadata in attributes.attributeMap) {
                try {
                    this.fillPublicMetadataBuffer(dataSource, attributes.attributeMap[attributeMetadata], cdsAnnotations);
                } catch (e) {
                    // not allowed by linter:
                    // console.error('Attribue ' + attributeMetadata + ' of DataSource ' + dataSource.label + ' can not be filled in meta data' + e.toString());
                }
            }

            var parser = this.sina._createCDSAnnotationsParser({
                dataSource: dataSource,
                cdsAnnotations: cdsAnnotations
            });
            parser.parseCDSAnnotationsForDataSource();
        },

        fillPublicMetadataBuffer: function (dataSource, attributeMetadata, cdsAnnotations) {
            var displayOrderIndex = attributeMetadata.displayOrder;

            // Prepare annotations for being passed over to the CDS annotations parser
            var attributeAnnotations = cdsAnnotations.attributeAnnotations[attributeMetadata.labelRaw] = {};
            // var attributeAnnotationsSrc = attributeMetadata.annotationsAttr;
            jQuery.extend(attributeAnnotations, attributeMetadata.annotationsAttr);
            // if this attribute has a Semantics property but no semantics annotation, create a new semantics annotation that corresponds to Semantics propery.
            // var hasSemanticsAnnotation = false,
            //     semanticsPrefix = "SEMANTICS.";
            // for(var key in attributeAnnotationsSrc){
            //     attributeAnnotations[key] = attributeAnnotationsSrc[key];
            // }
            // for (var j = 0; j < attributeAnnotationsSrc.length; j++) {

            // if (hasSemanticsAnnotation || attributeAnnotationsSrc[j].Name.substr(0, semanticsPrefix.length) == semanticsPrefix) {
            //     hasSemanticsAnnotation = true;
            // }
            // }
            // if (attributeMetadata.Semantics && !hasSemanticsAnnotation) {
            //     var semanticsValue;
            //     switch (attributeMetadata.Semantics) {
            //     case "EMAIL.ADDRESS":
            //     case "TELEPHONE.TYPE":
            //     case "CURRENCYCODE":
            //     case "UNITOFMEASURE":
            //         semanticsValue = "TRUE";
            //         break;
            //     case "QUANTITY.UNITOFMEASURE":
            //     case "AMOUNT.CURRENCYCODE":
            //         semanticsValue = attributeMetadata.UnitAttribute;
            //         break;
            //     }
            //     if (semanticsValue) {
            //         attributeAnnotations[semanticsPrefix + attributeMetadata.Semantics] = semanticsValue;
            //     }
            // }

            var typeAndFormat = this._parseAttributeTypeAndFormat(attributeMetadata);

            if (typeAndFormat.type) {
                var publicAttributeMetadata = this.sina._createAttributeMetadata({
                    id: attributeMetadata.labelRaw,
                    label: attributeMetadata.label || attributeMetadata.labelRaw,
                    isKey: attributeMetadata.isKey || false,
                    isSortable: attributeMetadata.isSortable,
                    usage: this._parseUsage(attributeMetadata, displayOrderIndex) || {},
                    type: typeAndFormat.type,
                    format: typeAndFormat.format,
                    matchingStrategy: this._parseMatchingStrategy(attributeMetadata)
                });

                publicAttributeMetadata._private.semanticObjectType = attributeMetadata.SemanticObjectTypeId;

                dataSource.attributesMetadata.push(publicAttributeMetadata);
                dataSource.attributeMetadataMap[publicAttributeMetadata.id] = publicAttributeMetadata;
            }

        },

        _parseMatchingStrategy: function (attributeMetadata) {
            if (attributeMetadata.supportsTextSearch === true) {
                return this.sina.MatchingStrategy.Text;
            }
            return this.sina.MatchingStrategy.Exact;

        },

        _parseAttributeTypeAndFormat: function (attributeMetadata) {

            for (var i = 0; i < attributeMetadata.presentationUsage.length; i++) {
                var presentationUsage = attributeMetadata.presentationUsage[i] || '';
                switch (presentationUsage.toUpperCase()) {
                case 'SUMMARY':
                    continue;
                case 'DETAIL':
                    continue;
                case 'TITLE':
                    continue;
                case 'HIDDEN':
                    continue;
                case 'FACTSHEET':
                    continue;
                case 'THUMBNAIL':
                case 'IMAGE':
                    return {
                        type: this.sina.AttributeType.ImageUrl
                    };
                case 'LONGTEXT':
                    return {
                        type: this.sina.AttributeType.String,
                        format: this.sina.AttributeFormatType.Longtext
                    };
                default:
                    throw new core.Exception('Unknown presentation usage ' + presentationUsage);
                }
            }

            switch (attributeMetadata.type) {
            case 'Edm.Binary':
                if (attributeMetadata.annotationsAttr) {
                    if (attributeMetadata.annotationsAttr.SEMANTICS && attributeMetadata.annotationsAttr.SEMANTICS.CONTACT && attributeMetadata.annotationsAttr.SEMANTICS.CONTACT.PHOTO ||
                        attributeMetadata.annotationsAttr.SEMANTICS && attributeMetadata.annotationsAttr.SEMANTICS.IMAGEURL) {
                        return {
                            type: this.sina.AttributeType.ImageBlob
                        };
                    }
                }
            case 'Edm.String':
            case 'Edm.Boolean':
            case 'Edm.Byte':
            case 'Edm.Guid':
                return {
                    type: this.sina.AttributeType.String
                };
            case 'Edm.Double':
            case 'Edm.Decimal':
            case 'Edm.Float':
            case 'Edm.Single':
            case 'Edm.SingleRange':
                return {
                    type: this.sina.AttributeType.Double
                };
            case 'Edm.Int16':
            case 'Edm.Int32':
            case 'Edm.Int64':
                return {
                    type: this.sina.AttributeType.Integer
                };
            case 'Edm.Time':
                return {
                    type: this.sina.AttributeType.Time
                };
            case 'Edm.Date':
                return {
                    type: this.sina.AttributeType.Date
                };
            case 'Edm.DateTime':
            case 'Edm.DateTimeOffset':
                if (attributeMetadata.TypeLength !== undefined && attributeMetadata.TypeLength <= 8) { // is this necessary for backwards compatibility??
                    return {
                        type: this.sina.AttributeType.Date
                    };
                }
                return {
                    type: this.sina.AttributeType.Timestamp
                };
            case 'Collection(Edm.String)':
                return {
                    type: this.sina.AttributeType.String
                };
            case 'Edm.GeometryPoint':
                return {
                    type: this.sina.AttributeType.GeoJson
                };
            case 'GeoJson':
                return {
                    type: this.sina.AttributeType.GeoJson
                };
            default:
                //throw new core.Exception('Unknown data type ' + attributeMetadata.type);
                //console.error('Unknown data type ' + attributeMetadata.type);
                return null;
            }
        },

        _parseUsage: function (attributeMetadata, displayOrderIndex) {
            var usage = {};
            for (var i = 0; i < attributeMetadata.presentationUsage.length; i++) {
                var id = attributeMetadata.presentationUsage[i].toUpperCase() || '';
                if (id === "TITLE") {
                    usage.Title = {
                        displayOrder: displayOrderIndex
                    };
                }

                if (id === "SUMMARY" ||
                    id === "DETAIL" ||
                    id === "IMAGE" ||
                    id === "THUMBNAIL" ||
                    id === "LONGTEXT"
                    //||id === "#HIDDEN"
                ) {
                    usage.Detail = {
                        displayOrder: displayOrderIndex
                    };
                }
            }

            if (attributeMetadata.isFacet) {
                usage.AdvancedSearch = {
                    displayOrder: displayOrderIndex
                };
                usage.Facet = {
                    displayOrder: displayOrderIndex
                };
            }

            return usage;
        },

        parseDynamicMetadata: function (searchResult) {

            // check that we have dynamic metadata
            var data = searchResult.data;
            if (!data) {
                return;
            }
            var metadata = data['@com.sap.vocabularies.Search.v1.Metadata'];
            if (!metadata) {
                return;
            }

            // try to extract a unique datasoure from search result
            // if this is not possible -> we don't know to which datasource
            // the dynamic metadata belongs -> return
            // TODO
            var dataSource = this.getUniqueDataSourceFromSearchResult(searchResult);
            if (!dataSource) {
                return;
            }

            // generate attributes from dynamic metadata
            for (var attributeId in metadata) {
                var dynamicAttributeMetadata = metadata[attributeId];
                this.parseDynamicAttributeMetadata(dataSource, attributeId, dynamicAttributeMetadata);
            }

        },

        parseDynamicAttributeMetadata: function (dataSource, attributeId, dynamicAttributeMetadata) {

            var attributeMetadata = dataSource.getAttributeMetadata(attributeId);

            var typeAndFormat = this._parseAttributeTypeAndFormat({
                presentationUsage: [],
                type: dynamicAttributeMetadata.$Type
            });

            if (attributeMetadata) {
                // update
                if (!attributeMetadata._private.dynamic) {
                    return; // only update dynamic attributes
                }
                attributeMetadata.label = dynamicAttributeMetadata['@SAP.Common.Label'];
                attributeMetadata.type = typeAndFormat.type;
                attributeMetadata.format = typeAndFormat.format;
            } else {
                // append
                attributeMetadata = this.sina._createAttributeMetadata({
                    id: attributeId,
                    label: dynamicAttributeMetadata['@SAP.Common.Label'],
                    isKey: false,
                    isSortable: false,
                    usage: {},
                    type: typeAndFormat.type,
                    format: typeAndFormat.format,
                    matchingStrategy: this.sina.MatchingStrategy.Exact,
                    _private: {
                        dynamic: true
                    }
                });
                dataSource.attributesMetadata.push(attributeMetadata);
                dataSource.attributeMetadataMap[attributeMetadata.id] = attributeMetadata;
            }

        },

        getUniqueDataSourceFromSearchResult: function (searchResult) {
            var data = searchResult.data;
            if (!data) {
                return;
            }
            var items = data.value;
            if (!items) {
                return;
            }
            var dataSourceId, prevDataSourceId;
            for (var i = 0; i < items.length; ++i) {
                var item = items[i];
                var context = item['@odata.context'];
                if (!context) {
                    return;
                }
                dataSourceId = context.split('#')[1];
                if (!dataSourceId) {
                    return;
                }
                if (prevDataSourceId && prevDataSourceId !== dataSourceId) {
                    return;
                }
                prevDataSourceId = dataSourceId;
            }
            return this.sina.getDataSource(dataSourceId);
        }

    });
});
