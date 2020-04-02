// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
/* global sinaDefine */
sinaDefine(['./core'], function (core) {
    "use strict";

    var DuplicateException = core.Exception.derive({
        _init: function (properties) {
            properties.message = 'Duplicate node';
            core.Exception.prototype._init.apply(this, arguments);
            this.node = properties.node;
        }
    });

    var Node = core.defineClass({

        _init: function (parent, nodeId, labelCalculator) {
            this.parent = parent;
            this.nodeId = nodeId;
            this.labelCalculator = labelCalculator;
            this.childMap = {};
            this.children = [];
        },

        insert: function (keyPath, obj) {

            // check for end of recursion
            if (keyPath.length === 0) {
                this.data = this.labelCalculator.options.data(obj);
                this.obj = obj;
                this.calculateLabel();
                return;
            }

            // insert recursively into tree
            var key = keyPath[0];
            var subNode = this.childMap[key];
            if (keyPath.length === 1 && subNode) {
                throw new DuplicateException({
                    node: subNode
                });
            }
            if (!subNode) {
                subNode = new Node(this, key, this.labelCalculator);
                this.childMap[key] = subNode;
                this.children.push(subNode);
                if (this.children.length === 2) {
                    this.children[0].recalculateLabels();
                    // whenever a node gets a sibling -> recalculate labels of node because due to
                    // the sibling we need to add more keys to the label to make the label unique
                }
            }
            subNode.insert(keyPath.slice(1), obj);
        },

        recalculateLabels: function () {
            var leafs = [];
            this.collectLeafs(leafs);
            for (var i = 0; i < leafs.length; ++i) {
                leafs[i].calculateLabel();
            }
        },

        collectLeafs: function (leafs) {
            if (this.isLeaf()) {
                leafs.push(this);
                return;
            }
            for (var i = 0; i < this.children.length; ++i) {
                this.children[i].collectLeafs(leafs);
            }
        },

        isLeaf: function () {
            return this.children.length === 0;
        },

        hasSibling: function () {
            return this.parent && this.parent.children.length >= 2;
        },

        isChildOfRoot: function () {
            return this.parent && this.parent.nodeId === '__ROOT';
        },

        collectPath: function (keyPath, force) {
            if (!this.parent) {
                return;
            }
            if (force || this.hasSibling() || this.isChildOfRoot()) {
                keyPath.push(this.nodeId);
                force = true;
            }
            if (this.parent) {
                this.parent.collectPath(keyPath, force);
            }
        },

        calculateLabel: function () {

            // collect keys = labels
            var keyPath = [];
            this.collectPath(keyPath);
            keyPath.reverse();

            // calculate label
            this.labelCalculator.options.setLabel(this.obj, keyPath, this.data);

        }
    });

    return core.defineClass({

        _init: function (options) {
            this.options = options;
            this.rootNode = new Node(null, '__ROOT', this);
        },

        calculateLabel: function (obj) {
            var key = this.options.key(obj);
            try {
                // insert datasource into datasource tree
                // for the inserted datasource a unique label is calculated
                // for datasource in sibling tree branches the label is recalculated
                this.rootNode.insert(key, obj);
            } catch (e) {
                if (e instanceof DuplicateException) {
                    this.options.setFallbackLabel(e.node.obj, e.node.data); // set fallback label for already existing node
                    this.options.setFallbackLabel(obj, this.options.data(obj)); // and for duplicate node
                    return;
                }
                throw e;
            }
        }

        // examples:

        // datasource     system client    --> calculated label
        // Purchase Order CER    002           Purchase Order
        // Sales Order    CER    002           Sales Order

        // datasource     system client    --> calculated label         include system to make label unique
        // Purchase Order CER    002           Purchase Order CER
        // Purchase Order CES    003           Purchase Order CES

        // datasource     system client    --> calculated label        include system and client to make label unique
        // Purchase Order CES    002           Purchase Order CES 002
        // Purchase Order CES    003           Purchase Order CES 003


    });


});
