sap.ui.controller("js.filterTree", {
    onInit: function() {
        var self = this;
        // self.container = sap.ui.getCore().byId("js-filterTree-verticalLayout");
        self.scrollPanelContainer = sap.ui.getCore().byId(CONSTANT.SCROLLPANELCONTAINER);
    },

    onAfterRendering: function() {
        var btnClear = jQuery.sap.domById(CONSTANT.BTNCLEAR);
        btnClear.style.visibility = 'hidden';
    },

    clearTree: function() {
        var self = this;

        // var size = self.container.mAggregations.content.length;
        // //Todo: leave the first positon for filter field.
        // for (var i = 1; i < size; i++) {
        //     self.container.removeContent(1);
        // };

        self.scrollPanelContainer.removeAllContent();
    },

    clearSelection: function() {
        var clearTreeSelection = function(tree) {
            if (!tree) {
                return false;
            }
            var nodes = tree.getNodes();
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].getIsSelected()) {
                    nodes[i].setIsSelected(false);
                    return true;
                } else {
                    if (clearTreeSelection(nodes[i])) {
                        return true;
                    }
                }
            }
            return false;
        };
        var panels = this.scrollPanelContainer.getContent();
        for (var j = 0; j < panels.length; j++) {
            if (panels[j].getIsSelected()) {
                panels[j].isSelected(false);
                return;
            } else {
                var tree = panels[j].getContent()[0];
                if (clearTreeSelection(tree)) {
                    return;
                }
            }
        }
    },
    addTree: function(data) {
        var self = this;
        // Trees in Panel
        var tmpPanel, tmpTree;

        // Initial `self.trees`.
        if (!self.trees) {
            self.trees = [];
        }

        sap.ui.commons.Panel.extend("PortalFilterTreePanel", {
            metadata: {
                properties: {
                    "isSelected": {
                        type: "boolean",
                        defaultValue: false
                    }
                }
            },
            onAfterRendering: function() {
                var that = this;

                // Add click event to <header> in panel.
                $("#" + that.getId() + " > header").each(function(i, element) {
                    $(element).bind("click", function(event) {
                        // Avoid double trigger of collapse.
                        if (event.target.tagName === "A") {
                            that.isSelected(true);
                            return 0;
                        }

                        if (that.getContent() &&
                            that.getContent()[0].getNodes().length !== 0) {
                            if (that.getCollapsed()) {
                                that.setCollapsed(false);
                            } else {
                                that.setCollapsed(true);
                            }
                        }
                        self.clearSelection();
                        self.clickNode(that, true);
                        that.isSelected(true);
                    });
                })
            },
            isSelected: function(isSelected) {
                this.setIsSelected(isSelected);
                if (isSelected) {
                    this.removeStyleClass("transparentBackground");
                    this.addStyleClass("blueBackground");
                } else {
                    this.removeStyleClass("blueBackground");
                    this.addStyleClass("transparentBackground");
                }
            },
            renderer: {}
        });

        sap.ui.commons.Tree.extend("PortalFilterTreePanelTree", {
            onAfterRendering: function() {
                var that = this,
                    parent, parentWidth, basePadding, paddingInterval;

                // parent = that.getParent();
                // parentWidth = $(parent.getDomRef()).outerWidth(true);
                basePadding = 38;
                paddingInterval = 14; // TODO: `0.13` and `0.04` may change to const variable.

                that.poTraversal(function(node, hierarchy) {
                    var currentPaddingLeft = basePadding + paddingInterval * hierarchy;

                    $(node.getDomRef())
                        .css({
                            "padding-left": currentPaddingLeft + "px"
                        });
                });
            },
            poTraversal: function(callback) {
                var that = this,
                    _poTraversal;

                _poTraversal = (function _poTraversal(root, callback, hierarchy) {
                    var children = root.getNodes(),
                        currentHierarchy;

                    // Check whether hierarchy is positive int.
                    if (hierarchy === parseInt(hierarchy, 10) && hierarchy >= 0) {
                        currentHierarchy = hierarchy;
                    } else {
                        currentHierarchy = 0;
                    }

                    // Execute callback.
                    callback(root, currentHierarchy);

                    children.forEach(function(node) {
                        _poTraversal(node, callback, currentHierarchy + 1);
                    });
                });

                that.getNodes().forEach(function(node) {
                    _poTraversal(node, callback);
                });
            },
            renderer: {}
        })

        for (var i = 0; i < data.length; i++) {
            tmpPanel = new PortalFilterTreePanel({
                icon: "resources/img/arrow-down.png",
                showCollapseIcon: true,
                collapsed: true,
                title: new sap.ui.core.Title({
                    text: (data[i]['title'] || data[i]['headline'])
                })
            });

            tmpTree = new PortalFilterTreePanelTree({
                select: function(event) {
                    var parentId = event.getParameter("id");
                    var currentNode = event.getParameter("node");
                    self.clearSelection();
                    // Process expand & collapse
                    if (!currentNode.getExpanded()) {
                        currentNode.expand(false);
                    } else {
                        currentNode.collapse(false);
                    }
                    self.clickNode(currentNode, false);
                }
            });

            tmpPanel.setTooltip(data[i]['title'] || data[i]['headline']);

            tmpTree
                .setShowHeader(false)
                .setTitle("Explorer")
                .setWidth("100%")
                .setHeight("auto")
                .setShowHeaderIcons(false)
                .setShowHorizontalScrollbar(false);
            //.setSelectionMode(sap.ui.commons.TreeSelectionMode.Single);
            this.addCustomData(tmpPanel, data[i]);

            if (!data[i]['pages']) {
                tmpPanel.setShowCollapseIcon(false);
            } else {
                var level = 0;
                self.addNode(data[i]['pages'], tmpTree, level);
            }

            // Save tree in `self.trees`.
            self.trees.push(tmpTree);

            tmpPanel.addContent(tmpTree);
            tmpPanel.addStyleClass("vf-ft-vl-panelContainer");

            // self.container.addContent(tmpPanel);
            self.scrollPanelContainer.addContent(tmpPanel);
        }
    },

    addCustomData: function(node, data) {
        var customDataUrl = new sap.ui.core.CustomData({
            key: "url",
            value: data['url']
        });
        var showCode = new sap.ui.core.CustomData({
            key: "showCode",
            value: data["showCode"]
        });
        var panelData = new sap.ui.core.CustomData({
            key: "panel",
            value: data["panel"]
        });
        var jsurl = new sap.ui.core.CustomData({
            key: "jsurl",
            value: data['jsurl']
        });
        node.addCustomData(customDataUrl);
        node.addCustomData(showCode);
        node.addCustomData(panelData);
        node.addCustomData(jsurl);
    },
    addNode: function(data, container, level) {
        var self = this;
        if (typeof data === "object" && Array.isArray(data)) {
            level += 1;
            for (var i = 0; i < data.length; i++) {
                if (!data[i]) {
                    continue;
                }
                var tmpNode = new sap.ui.commons.TreeNode({
                    expanded: false,
                    text: data[i]['title'],
                    selected: self.nodeSelectedHandler()
                });

                this.addCustomData(tmpNode, data[i]);

                if (data[i].hasOwnProperty("pages") && typeof data[i]['pages'] === "object" && data[i]['pages'].length > 0) {
                    this.addNode(data[i]["pages"], tmpNode, level);
                }
                container.addNode(tmpNode);
            }
        }
    },

    expandNode: function(node, name) {
        if (node) {
            var nodes = node.getNodes();
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].getText() === name) {
                    nodes[i].expand();
                    return nodes[i];
                }
            }
        }
    },
    expandRootNode: function(rootName) {
        var container = this.scrollPanelContainer;
        if (container) {
            var panels = container.getContent();
            if (!rootName && panels.length === 1) {
                panels[0].setCollapsed(false);
            } else {
                for (var j = 0; j < panels.length; j++) {
                    if (panels[j].getText() === rootName) {
                        if (!this.isEmptyPanel(panels[j])) {
                            panels[j].setCollapsed(false);
                            break;
                        }
                    }
                }
            }
        }
    },
    //Called when click the node on tree or panel.
    clickNode: function(node, isPanel) {
        var customData = node.getCustomData();
        var urlTree = util.getUrlFromTreeNode(node);
        var url = util.urlRecorder.recordUrl(urlTree, 2);
        var isLoaded = util.loadPageWithCustomdata(customData, isPanel);
        if (isLoaded) {
            //update url of address bar.
            util.updateLocation(url);
        }
    },
    //
    processSelection: function(selectedItems, queryStr) {
        var self = this;
        var container = this.scrollPanelContainer;
        var expandNodeByDefault = function(node) {
            if (node) {
                var nodes = node.getNodes();
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].expand();
                    if (!util.selectNode(nodes[i], false, queryStr)) {
                        if (expandNodeByDefault(nodes[i])) {
                            return true;
                        }
                    } else {
                        return true;
                    }
                    nodes[i].collapse();
                }
            }
            return false;
        };
        if (container) {
            var panels = container.getContent();
            var bFoundPanel = false;
            for (var j = 0; j < panels.length; j++) {
                if (selectedItems && (panels[j].getText() === selectedItems[0])) {
                    if (!this.isEmptyPanel(panels[j])) {
                        panels[j].setCollapsed(false);
                        var tree = panels[j].getContent()[0];
                        var preNode;
                        var isFoundNode = false;
                        var i;
                        for (i = 1; i < selectedItems.length; i++) {
                            preNode = tree;
                            tree = this.expandNode(tree, selectedItems[i]);
                            if (!tree) {
                                util.log(selectedItems[i] + " is not found!");
                                break;
                            }
                        };
                        if (!tree && i === 1) { //selectedItems[1] is not found in 1st level of tree
                            if (util.selectNode(panels[j], true, queryStr)) { //There is url in panel
                                return true;
                            } else { //expand node to find a url and load it.
                                expandNodeByDefault(panels[j].getContent()[0]);
                            }
                        // } else if (tree && i === 1) { //selectedItems only has panel name
                        //     if (util.selectNode(panels[j], true, queryStr)) { //There is url in panel
                        //         return true;
                        //     }
                        } else {
                            if (tree) {
                                if (util.selectNode(tree, false, queryStr)) {
                                    return true;
                                }
                                //expand to the next node that has custom url;
                                expandNodeByDefault(tree);
                            } else {
                                expandNodeByDefault(preNode);
                            }
                        }
                    } else { //there is no tree under the panel.
                        util.selectNode(panels[j], true, queryStr);
                    }
                    bFoundPanel = true;
                }
            }
            if (panels.length > 0 && (!bFoundPanel || !selectedItems || (selectedItems.length === 0))) { //default selection.
                if (panels.length === 1) {
                    panels[0].setCollapsed(false);
                }
                for (j = 0; j < panels.length; j++) {
                    if (this.isEmptyPanel(panels[j])) {
                        if (util.selectNode(panels[j], true, queryStr)) {
                            return true;
                        }
                    } else {
                        panels[j].setCollapsed(false);
                        var tree = panels[0].getContent()[0];
                        if (tree) {
                            if (expandNodeByDefault(tree)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    },

    nodeSelectedHandler: function() {
        var self = this;

        return function(event) {
            var selectedNode = sap.ui.getCore().byId(event.mParameters.id);
            self.registerSelectedNode(selectedNode);
        };
    },

    registerSelectedNode: function(selectedNode) {
        var self = this;

        if (!self.selectedNodes) {
            self.selectedNodes = [];
        }

        (function() {
            var i;
            for (var i = 0; i < self.selectedNodes.length; i++) {
                self.selectedNodes.pop().setIsSelected(false);
            };
        }());

        self.selectedNodes.push(selectedNode);
    },

    handleInputFilterString: function(string) {
        "use strict";
        var self = this,
            nodesToHide = [],
            tmpNodesToHide = [],
            /*nodesToShow = [],*/
            nodesToExpand = [],
            nodesToCollapse = [];

        function isStringMatched(parentString, childString) {
            return parentString.trim().toLowerCase().indexOf(childString.toLowerCase()) >= 0;
        }

        function poTraversal(node) {
            var childNodes = node.getNodes(),
                nodeState = {};

            nodeState.isMatched = isStringMatched(node.getText(), string);

            if (childNodes && childNodes.length > 0) {
                nodeState.areAllChildrenHidden = true;

                childNodes.forEach(function(node) {
                    var result = poTraversal(node);
                    if (result.isMatched) {
                        nodeState.areAllChildrenHidden = false;
                    }
                });

                if (nodeState.areAllChildrenHidden) {
                    if (nodeState.isMatched) {
                        tmpNodesToHide = [];
                        nodesToCollapse.push(node);
                    } else {
                        tmpNodesToHide.push(node);
                        nodesToHide = nodesToHide.concat(tmpNodesToHide);
                        tmpNodesToHide = [];
                    }
                } else {
                    nodesToExpand.push(node);
                    nodesToHide = nodesToHide.concat(tmpNodesToHide);
                    tmpNodesToHide = [];
                }
            } else {
                if (!nodeState.isMatched) {
                    tmpNodesToHide.push(node);
                }
            }

            return nodeState;
        }

        // Handle btnClear.
        (function(string) {
            var btnClear = jQuery.sap.domById(CONSTANT.BTNCLEAR);
            if (string.length > 0) {
                btnClear.style.visibility = 'visible';
            } else {
                btnClear.style.visibility = 'hidden';
            }
        }(string));

        // Expand all panel.
        self.scrollPanelContainer.getContent().forEach(function(panel) {
            panel.setCollapsed(false);
        });

        if (self.trees) {
            self.trees.forEach(function(tree) {
                tree.getNodes().forEach(function(node) {
                    poTraversal(node);
                    // `tmpNodesToHide` still has elements only if node doesn't have child nodes.
                    if (tmpNodesToHide.length > 0) {
                        nodesToHide = nodesToHide.concat(tmpNodesToHide);
                        tmpNodesToHide = [];
                    }
                });
            });

            if (!self.nodesToShow) {
                self.nodesToShow = nodesToHide;
            } else {
                // Show previous hidden nodes.
                self.nodesToShow.forEach(function(node) {
                    var queryOfNode = jQuery.sap.byId(node.getId());

                    if (queryOfNode.length > 0) {
                        queryOfNode.removeClass("hidden");
                    }
                });

                self.nodesToShow = nodesToHide;
            }

            // Hide nodes.
            nodesToHide.forEach(function(node) {
                var queryOfNode = jQuery.sap.byId(node.getId());

                if (queryOfNode.length > 0) {
                    queryOfNode.addClass("hidden");
                }
            });

            // Collapse nodes.
            nodesToCollapse.forEach(function(node) {
                node.collapse();
            });

            // Expand nodes.
            nodesToExpand.forEach(function(node) {
                node.expand();
            });
        }
    },

    filterFieldHandler: function(event) {
        var key = event.getParameter("liveValue");
        this.handleInputFilterString(key);
    },

    setHeight: function(height) {
        this.scrollPanelContainer.setHeight(height - $("#" + CONSTANT.FILTERTREE_TOOLBAR).outerHeight(true) + "px");
    },

    expandAll: function() {
        var self = this;

        return function() {
            var oController = self;

            oController.scrollPanelContainer.getContent().forEach(function(panel) {
                if (panel.getCollapsed()) {
                    panel.setCollapsed(false);
                }

                panel.getContent().forEach(function(tree) {
                    tree.expandAll();
                });
            });
        }
    },

    collapseAll: function() {
        var self = this;

        return function() {
            var oController = self;

            oController.scrollPanelContainer.getContent().forEach(function(panel) {
                // I only collapse tree in uncollapsed panel.
                if (!panel.getCollapsed()) {
                    panel.getContent().forEach(function(tree) {
                        tree.collapseAll();
                    });

                    panel.setCollapsed(true);
                }
            });
        }
    },
    isEmptyPanel: function(panel) {
        return !panel.getContent() ||
            panel.getContent()[0].getNodes().length === 0;
    }
});
