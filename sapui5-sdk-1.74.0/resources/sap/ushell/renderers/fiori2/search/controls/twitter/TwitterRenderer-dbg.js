// Copyright (c) 2009-2017 SAP SE, All Rights Reserved
sap.ui.define([], function () {

    "use strict";

    var module = {};

    var escapeHtml = function (unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    var extend = function (obj1, obj2) {
        for (var key in obj2) {
            obj1[key] = obj2[key];
        }
        return obj1;
    };

    var decode1 = function (text) {
        var entities = [
            ['amp', '&'],
            ['apos', '\''],
            ['#x27', '\''],
            ['#x2F', '/'],
            ['#39', '\''],
            ['#47', '/'],
            ['lt', '<'],
            ['gt', '>'],
            ['nbsp', ' '],
            ['quot', '"']
        ];
        for (var i = 0, max = entities.length; i < max; ++i) {
            text = text.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);
        }
        return text;
    };

    var decode2 = function (str) {
        return str.replace(/&#(\d+);/g, function (match, dec) {
            return String.fromCharCode(dec);
        });
    };

    var decode = function (text) {
        return decode2(decode1(text));
    };

    module.Token = function () {};
    module.Token.prototype = {
        init: function () {
            var mode = arguments[0];
            if (mode === 'tokenize') {
                this.text = arguments[1];
                this.matches = [];
                this.startIndex = arguments[2];
                this.regExp.lastIndex = this.startIndex;
                var match = this.regExp.exec(this.text);
                this.endIndex = this.startIndex + match[0].length;
            }
            if (mode === 'set') {
                this.text = arguments[1];
                this.matches = arguments[2];
                this.startIndex = 0;
                this.endIndex = this.text.length;
            }
        },
        match: function (text, index) {
            this.regExp.lastIndex = 0;
            return !!this.regExp.exec(text[index]);
        },
        getLength: function () {
            return this.endIndex - this.startIndex;
        },
        toString: function () {
            return this.text.slice(this.startIndex, this.endIndex);
        },
        toHighlightedString: function () {
            var parts = [];
            var index = this.startIndex;
            for (var i = 0; i < this.matches.length; ++i) {
                var match = this.matches[i];
                if (match[0] > index) {
                    parts.push(escapeHtml(this.text.slice(index, match[0])));
                }
                parts.push('<b>' + escapeHtml(this.text.slice(match[0], match[1])) + '</b>');
                index = match[1];
            }
            if (this.endIndex > index) {
                parts.push(escapeHtml(this.text.slice(index, this.endIndex)));
            }
            return parts.join('');
        }
    };

    module.TextToken = function () {
        this.init.apply(this, arguments);
    };
    module.TextToken.prototype = extend(new module.Token(), {
        type: 'Text',
        regExp: new RegExp('[\\w]+', 'g')
    });

    module.SpecialCharactersTextToken = function () {
        this.init.apply(this, arguments);
    };
    module.SpecialCharactersTextToken.prototype = extend(new module.Token(), {
        type: 'SpecialCharactersText',
        regExp: new RegExp('[^\\w\\s@#]+', 'g')
    });

    module.UserToken = function () {
        this.init.apply(this, arguments);
    };
    module.UserToken.prototype = extend(new module.Token(), {
        type: 'User',
        regExp: new RegExp('[@]+', 'g')
    });

    module.HashToken = function () {
        this.init.apply(this, arguments);
    };
    module.HashToken.prototype = extend(new module.Token(), {
        type: 'Hash',
        regExp: new RegExp('[#]+', 'g')
    });

    module.WhitespaceToken = function () {
        this.init.apply(this, arguments);
    };
    module.WhitespaceToken.prototype = extend(new module.Token(), {
        type: 'Whitespace',
        regExp: new RegExp('\\s+', 'g')
    });

    module.MatchStartToken = function () {
        this.init.apply(this, arguments);
    };
    module.MatchStartToken.prototype = extend(new module.Token(), {
        type: 'MatchStart',
        regExp: new RegExp('<b>', 'g'),
        match: function (text, index) {
            return text.slice(index, index + 3) === '<b>';
        }
    });

    module.MatchEndToken = function () {
        this.init.apply(this, arguments);
    };
    module.MatchEndToken.prototype = extend(new module.Token(), {
        type: 'MatchEnd',
        regExp: new RegExp('</b>', 'g'),
        match: function (text, index) {
            return text.slice(index, index + 4) === '</b>';
        }
    });

    var tokenClasses = [module.WhitespaceToken, module.MatchStartToken, module.MatchEndToken, module.HashToken, module.UserToken, module.SpecialCharactersTextToken, module.TextToken];
    var tokenClassMap = {};
    for (var i = 0; i < tokenClasses.length; ++i) {
        var tokenClass = tokenClasses[i];
        tokenClassMap[tokenClass.prototype.type] = tokenClass;
    }

    module.Tokenizer = function () {
        this.init.apply(this, arguments);
    };
    module.Tokenizer.prototype = {
        init: function (text) {
            this.text = text;
            this.index = 0;
        },
        getNextToken: function () {
            if (this.index >= this.text.length) {
                return null;
            }
            for (var i = 0; i < tokenClasses.length; ++i) {
                var tokenClass = tokenClasses[i];
                if (tokenClass.prototype.match(this.text, this.index)) {
                    var token = new tokenClass('tokenize', this.text, this.index);
                    this.index += token.getLength();
                    return token;
                }
            }
            throw 'tokenization error';
        },
        lookAhead: function (count) {
            count = count || 1;
            var position = this.getPosition();
            var tokens = [];
            for (var i = 0; i < count; ++i) {
                var token = this.getNextToken();
                tokens.push(token);
            }
            this.setPosition(position);
            if (count === 1) {
                return tokens[0];
            }
            return tokens;

        },
        getPosition: function () {
            return this.index;
        },
        setPosition: function (position) {
            this.index = position;
        }
    };

    module.MatchTokenizer = function () {
        this.init.apply(this, arguments);
    };
    module.MatchTokenizer.prototype = {
        init: function (text) {
            this.tokenizer = new module.Tokenizer(text);
            this.matchCounter = 0;
        },
        getNextToken: function () {

            var type;
            var tokens = [];

            // get tokens            
            for (;;) {
                var token = this.tokenizer.lookAhead(1);
                if (!token) {
                    break;
                }
                if (token.type === 'MatchStart' || token.type === 'MatchEnd') {
                    this.tokenizer.getNextToken(); // consume 
                    switch (token.type) {
                    case 'MatchStart':
                        this.matchCounter++;
                        break;
                    case 'MatchEnd':
                        this.matchCounter--;
                        break;
                    }
                    continue;
                }
                if (!type) {
                    this.tokenizer.getNextToken(); // consume 
                    type = token.type;
                    token._match = this.matchCounter > 0;
                    tokens.push(token);
                    continue;
                }
                if (type === token.type) {
                    this.tokenizer.getNextToken(); // consume 
                    token._match = this.matchCounter > 0;
                    tokens.push(token);
                    continue;
                }
                break;
            }

            // return merged tokens
            switch (tokens.length) {
            case 0:
                return null;
            case 1:
                var resultToken = tokens[0];
                if (resultToken._match) {
                    resultToken.matches = [
                        [resultToken.startIndex, resultToken.endIndex]
                    ];
                }
                return resultToken;
            default:
                return this.mergeTokens(type, tokens);
            }

        },
        mergeTokens: function (type, tokens) {
            var mergedContent = [];
            var matches = [];
            var length = 0;
            for (var i = 0; i < tokens.length; ++i) {
                var token = tokens[i];
                var tokenContent = token.toString();
                var tokenLength = tokenContent.length;
                mergedContent.push(tokenContent);
                if (token._match) {
                    matches.push([length, length + tokenLength]);
                }
                length += tokenLength;
            }
            var mergedToken = new tokenClassMap[type]('set', mergedContent.join(''), matches);
            return mergedToken;
        },
        lookAhead: function (count) {
            count = count || 1;
            var position = this.getPosition();
            var tokens = [];
            for (var i = 0; i < count; ++i) {
                var token = this.getNextToken();
                tokens.push(token);
            }
            this.setPosition(position);
            if (count === 1) {
                return tokens[0];
            }
            return tokens;

        },
        getPosition: function () {
            return {
                internalPosition: this.tokenizer.getPosition(),
                matchCounter: this.matchCounter
            };
        },
        setPosition: function (position) {
            this.tokenizer.setPosition(position.internalPosition);
            this.matchCounter = position.matchCounter;
        }
    };

    module.TwitterDocument = function () {
        this.init.apply(this, arguments);
    };
    module.TwitterDocument.prototype = {
        init: function (text) {
            text = decode(text);
            this.nodes = [];
            this.parse(text);
        },
        parse: function (text) {
            var tokenizer = new module.MatchTokenizer(text);
            for (;;) {
                var tokens = tokenizer.lookAhead(2);
                var token = tokens[0];
                var nextToken = tokens[1];
                if (!token) {
                    break;
                }
                var node = null;
                switch (token.type) {
                case 'Whitespace':
                    node = new module.TwitterTextNode();
                    break;
                case 'User':
                    if (nextToken && nextToken.type === 'Text') {
                        node = new module.TwitterUserNode();
                    } else {
                        node = new module.TwitterTextNode();
                    }
                    break;
                case 'Hash':
                    node = new module.TwitterHashNode();
                    if (nextToken && nextToken.type === 'Text') {
                        node = new module.TwitterHashNode();
                    } else {
                        node = new module.TwitterTextNode();
                    }
                    break;
                case 'Text':
                    node = new module.TwitterTextNode();
                    if (token.toString().slice(0, 4) === 'http') {
                        node = new module.TwitterLinkNode();
                    } else {
                        node = new module.TwitterTextNode();
                    }
                    break;
                case 'SpecialCharactersText':
                    node = new module.TwitterTextNode();
                    break;
                }
                if (!node) {
                    throw 'parse error ' + token.toString();
                }
                node.parse(tokenizer);
                this.nodes.push(node);
            }
        },
        render: function (oRm) {
            for (var i = 0; i < this.nodes.length; ++i) {
                var node = this.nodes[i];
                node.render(oRm);
            }
        },
        log: function () {
            for (var i = 0; i < this.nodes.length; ++i) {
                var node = this.nodes[i];
                node.log();
            }
        }
    };

    module.TwitterTextNode = function () {};
    module.TwitterTextNode.prototype = {
        type: 'TextNode',
        parse: function (tokenizer) {
            var token = tokenizer.getNextToken();
            this.text = token.toString();
            this.textHighlighted = token.toHighlightedString();
        },
        render: function (oRm) {
            oRm.write('<span style="display:inline" class="sapMText">');
            oRm.write(this.textHighlighted);
            oRm.write('</span>');
        },
        log: function () {
            // not allowed by linter:
            // console.log(this.type + ':' + this.text + ' : ' + this.textHighlighted);
        }
    };

    module.TwitterUserNode = function () {};
    module.TwitterUserNode.prototype = {
        type: 'UserNode',
        parse: function (tokenizer) {
            var atToken = tokenizer.getNextToken();
            this.at = atToken.toString();
            this.atHighlighted = atToken.toHighlightedString();
            var userToken = tokenizer.getNextToken();
            this.user = userToken.toString();
            this.userHighlighted = userToken.toHighlightedString();
        },
        render: function (oRm) {
            oRm.write('<a target="_blank" style="display:inline" class="sapMLnk" href="https://twitter.com/' + this.user + '">');
            oRm.write(this.atHighlighted + this.userHighlighted);
            oRm.write('</a>');
        },
        log: function () {
            // not allowed by linter:
            // console.log(this.type + ': ' + this.at + this.user + ' : ' + this.atHighlighted + this.userHighlighted);
        }
    };

    module.TwitterHashNode = function () {};
    module.TwitterHashNode.prototype = {
        type: 'HashNode',
        parse: function (tokenizer) {
            var hashToken = tokenizer.getNextToken();
            this.hash = hashToken.toString();
            this.hashHighlighted = hashToken.toHighlightedString();
            var tagToken = tokenizer.getNextToken();
            this.tag = tagToken.toString();
            this.tagHighlighted = tagToken.toHighlightedString();
        },
        render: function (oRm) {
            oRm.write('<a target="_blank" style="display:inline" class="sapMLnk" href="https://twitter.com/hashtag/' + this.tag + '?src=hash">');
            oRm.write(this.hashHighlighted + this.tagHighlighted);
            oRm.write('</a>');
        },
        log: function () {
            // not allowed by linter:
            // console.log(this.type + ':' + this.hash + this.tag + ' : ' + this.hashHighlighted + this.tagHighlighted);
        }
    };

    module.TwitterLinkNode = function () {};
    module.TwitterLinkNode.prototype = {
        type: 'LinkNode',
        parse: function (tokenizer) {
            var parts = [];
            var partsHighlighted = [];
            for (;;) {
                var token = tokenizer.lookAhead();
                if (token && (token.type === 'Text' || token.type === 'SpecialCharactersText')) {
                    tokenizer.getNextToken(); // consume
                    parts.push(token.toString());
                    partsHighlighted.push(token.toHighlightedString());
                    continue;
                }
                break;
            }
            this.url = parts.join('');
            this.userHighlighted = partsHighlighted.join('');
        },
        render: function (oRm) {
            /*oRm.write('<a target="_blank" style="display:inline" class="sapMLnk" href="' + this.url + '">');
            oRm.write(this.userHighlighted);
            oRm.write('</a>');*/
        },
        log: function () {
            // not allowed by linter:
            // console.log(this.type + ':' + this.url + ' : ' + this.userHighlighted);
        }
    };

    module.renderTweet = function (oRm, tweet) {
        //tweet = 'this <b>@test1</b>test2<b>test3 is</b> a&lt; h<b>tt</b>p://sap.com';
        //tweet = 'this is a .@te<b>st</b> #test http://sap.com test';
        var twitterDocument = new module.TwitterDocument(tweet);
        twitterDocument.render(oRm);
    };

    module.test1 = function () {
        var tokenizer = new this.Tokenizer('this <b>i</b>s a #test');
        for (var i = 0; i < 20; ++i) {
            var token = tokenizer.getNextToken();
            if (!token) {
                break;
            }
            // not allowed by linter:
            // console.log(token.type, ' \'' + token.toString() + '\'');
        }
    };

    module.test2 = function () {
        var tokenizer = new this.MatchTokenizer('this <b>i</b>s a #test');
        for (var i = 0; i < 20; ++i) {
            var token = tokenizer.getNextToken();
            if (!token) {
                break;
            }
            // not allowed by linter:
            // console.log(token.type, ' \'' + token.toString() + '\'');
        }
    };

    module.test = function () {
        var twitterDocument = new module.TwitterDocument('this <b>@test1test2test3</b> is a h<b>tt</b>p://sap.com');
        twitterDocument.log();
    };

    return module;

});
