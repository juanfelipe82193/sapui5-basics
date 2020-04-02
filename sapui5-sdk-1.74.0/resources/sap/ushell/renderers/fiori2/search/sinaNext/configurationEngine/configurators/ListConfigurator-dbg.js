// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../../core/core', './Configurator'], function (core, Configurator) {
    "use strict";

    return Configurator.derive({

        initAsync: function () {
            // create configurator for each list element in configuration
            this.elements = [];
            this.cache = {};
            var promises = [];
            for (var i = 0; i < this.configuration.length; ++i) {
                var elementConfiguration = this.configuration[i];
                promises.push(this.createElementConfiguratorAsync(this.type, elementConfiguration, i));
            }
            return core.Promise.all(promises);
        },

        isSuitable: function (options) {
            if (options.typeContext && options.typeContext.multiple && core.isList(options.configuration)) {
                return true;
            }
        },

        createElementConfiguratorAsync: function (type, configuration, id) {
            return this.createConfiguratorAsync({
                type: type,
                configuration: configuration
            }).then(function (configurator) {
                this.elements.push({
                    configuration: configuration,
                    configurator: configurator,
                    id: id
                });
            }.bind(this));
        },

        getElement: function (listElement) {
            var id = this.typeContext.getElementId(listElement);
            var element = this.cache[id];
            if (element) {
                return element;
            }
            for (var i = 0; i < this.elements.length; ++i) {
                element = this.elements[i];
                if (this.matchId(listElement, element)) {
                    this.cache[id] = element;
                    return element;
                }
            }
        },

        matchId: function (listElement, element) {
            var listElementId = this.typeContext.getElementId(listElement);
            var elementId = this.typeContext.getElementId(element.configuration);
            var match;
            if (core.isObject(elementId) && elementId.hasOwnProperty('regExp')) {
                // regexp compare
                if (!elementId.regExpObj) {
                    elementId.regExpObj = new RegExp(elementId.regExp, elementId.regExpFlags);
                }
                match = elementId.regExpObj.test(listElementId);
            } else {
                // simple compare
                match = listElementId === elementId;
            }
            return match;
        },

        createEmptyUsedElements: function () {
            var usedElements = [];
            for (var i = 0; i < this.elements.length; ++i) {
                usedElements.push(false);
            }
            return usedElements;
        },

        configure: function (list, ctx) {

            // check input parameters and initialization
            if (!list) {
                list = [];
            }
            ctx = this.createContext(ctx, list);
            var usedElements = this.createEmptyUsedElements();
            var element, listElement, newListElement;

            // configure list elements
            for (var i = 0; i < list.length; ++i) {
                listElement = list[i];
                element = this.getElement(listElement);
                if (!element) {
                    continue;
                }
                var configuredListElement = element.configurator.configure(listElement, ctx);
                if (configuredListElement !== listElement) {
                    list[i] = configuredListElement;
                }
                usedElements[element.id] = {
                    index: i
                };
            }

            // create new list elements
            var lastUsedElement;
            var numberInserted = 0;
            if (this.typeContext.createElement) {
                for (var j = 0; j < usedElements.length; ++j) {
                    var usedElement = usedElements[j];
                    element = this.elements[j];
                    if (usedElement) {
                        lastUsedElement = usedElement;
                        continue;
                    }
                    var templateListElement = this.typeContext.createElement(element.configuration, ctx);
                    newListElement = element.configurator.configure(templateListElement, ctx);
                    var insertIndex = (lastUsedElement ? lastUsedElement.index : -1) + numberInserted + 1;
                    list.splice(insertIndex, 0, newListElement);
                    numberInserted++;
                    if (this.typeContext.postProcessCreatedElement) {
                        this.typeContext.postProcessCreatedElement(newListElement, ctx);
                    }
                }
            }
            return list;
        },

        configureAsync: function (list, ctx) {

            // check input parameters and init
            if (!list) {
                list = [];
            }
            ctx = this.createContext(ctx, list);
            var usedElements = this.createEmptyUsedElements();
            var lastUsedElement;
            var numberInserted = 0;

            // configure list element
            var configureListElement = function (listIndex) {
                if (listIndex >= list.length) {
                    return null;
                }
                var listElement = list[listIndex];
                var element = this.getElement(listElement);
                if (!element) {
                    return configureListElement(listIndex + 1);
                }
                usedElements[element.id] = {
                    index: listIndex
                };
                return core.Promise.resolve().then(function () {
                    return element.configurator.configureAsync(listElement, ctx);
                }).then(function (configuredListElement) {
                    if (configuredListElement !== listElement) {
                        list[listIndex] = configuredListElement;
                    }
                    return configureListElement(listIndex + 1);
                });
            }.bind(this);

            // create new list element
            var createNewListElement = function (elementIndex) {
                if (elementIndex >= this.elements.length) {
                    return null;
                }
                var element = this.elements[elementIndex];
                var usedElement = usedElements[elementIndex];
                if (usedElement) {
                    lastUsedElement = usedElement;
                    return createNewListElement(elementIndex + 1);
                }

                var templateListElement = this.typeContext.createElement(element.configuration, ctx);
                return core.Promise.resolve().then(function () {
                    return element.configurator.configureAsync(templateListElement, ctx);
                }).then(function (newListElement) {
                    var insertIndex = (lastUsedElement ? lastUsedElement.index : -1) + numberInserted + 1;
                    list.splice(insertIndex, 0, newListElement);
                    numberInserted++;
                    if (this.typeContext.postProcessCreatedElement) {
                        this.typeContext.postProcessCreatedElement(newListElement, ctx);
                    }
                    return createNewListElement(elementIndex + 1);
                }.bind(this));

            }.bind(this);

            // start recursions
            return core.Promise.resolve().then(function () {
                // start recursion for configuration of existing list elements
                return configureListElement(0);
            }).then(function () {
                // start recursion for creating and configuring new list elements
                if (!this.typeContext.createElement) {
                    return null;
                }
                return createNewListElement(0);
            }.bind(this)).then(function () {
                return list;
            });
        }

    });

});
