// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['../core/core', '../core/util', './SinaObject'], function (core, util, SinaObject) {
    "use strict";

    return SinaObject.derive({

        _meta: {
            properties: {
                filter: {
                    required: false,
                    default: function () {
                        return this.sina.createFilter();
                    }
                },
                top: {
                    required: false,
                    default: 10,
                    setter: true
                },
                skip: {
                    required: false,
                    default: 0,
                    setter: true
                },
                sortOrder: {
                    required: false,
                    default: function () {
                        return [];
                    },
                    setter: true
                }
            }
        },

        _afterInitProperties: function (properties) {
            if (properties.dataSource) {
                this.filter.setDataSource(properties.dataSource);
            }
            if (properties.searchTerm) {
                this.filter.setSearchTerm(properties.searchTerm);
            }
            if (properties.rootCondition) {
                this.filter.setRootCondition(properties.rootCondition);
            }
            if (this.requestTimeout) {
                this._execute = util.timeoutDecorator(this._execute, this.requestTimeout);
            }
            this._execute = util.refuseOutdatedResponsesDecorator(this._execute);
        },

        _initClone: function (other) {
            this.top = other.top;
            this.skip = other.skip;
            this.filter = other.filter.clone();
            this.sortOrder = core.clone(other.sortOrder);
        },

        _equals: function (other) {
            return this.top === other.top &&
                this.skip === other.skip &&
                this.filter.equals(other.filter) &&
                core.equals(this.sortOrder, other.sortOrder);
        },

        abort: function () {
            this._execute.abort(); // call abort on decorator
        },

        getResultSetAsync: function () {

            // if query has not changed -> return existing result set
            if (this.equals(this._lastQuery, this.sina.EqualsMode.CheckFireQuery)) {
                return this._resultSetPromise;
            }

            // filter changed -> set skip=0
            if (this._lastQuery && !this.filter.equals(this._lastQuery.filter)) {
                this.setSkip(0);
            }

            // create a read only clone
            this._lastQuery = this._createReadOnlyClone();

            // delegate to subclass implementation
            var resultSet;
            this._resultSetPromise = this._execute(this._lastQuery).then(function (iResultSet) {
                resultSet = iResultSet;
            }).then(function () {
                return this._formatResultSetAsync(resultSet);
            }.bind(this)).then(function () {
                return resultSet;
            });
            return this._resultSetPromise;
        },

        _formatResultSetAsync: function (resultSet) {
            // overwrite in subclass
        },

        _setResultSet: function (resultSet) {
            this._lastQuery = this._createReadOnlyClone();
            this._resultSetPromise = core.Promise.resolve().then(function () {
                return this._formatResultSetAsync(resultSet);
            }.bind(this)).then(function () {
                return resultSet;
            });
            return this._resultSetPromise;
        },

        _createReadOnlyClone: function () {
            var query = this.clone();
            query.getResultSetAsync = function () {
                throw new core.Exception('this query is readonly');
            };
            return query;
        },

        resetResultSet: function () {
            this._lastQuery = null;
            this._resultSetPromise = null;
        },

        getSearchTerm: function () {
            return this.filter.searchTerm;
        },

        getDataSource: function () {
            return this.filter.dataSource;
        },

        getRootCondition: function () {
            return this.filter.rootCondition;
        },

        setSearchTerm: function (searchTerm) {
            this.filter.setSearchTerm(searchTerm);
        },

        setDataSource: function (dataSource) {
            this.filter.setDataSource(dataSource);
        },

        setRootCondition: function (rootCondition) {
            this.filter.setRootCondition(rootCondition);
        },

        resetConditions: function () {
            this.filter.resetConditions();
        },

        autoInsertCondition: function (condition) {
            this.filter.autoInsertCondition(condition);
        },

        autoRemoveCondition: function (condition) {
            this.filter.autoRemoveCondition(condition);
        },

        setFilter: function (filter) {
            if (!this.filter.equals(filter)) {
                this.setSkip(0);
            }
            this.filter = filter;
        }

    });

});
