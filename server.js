/**
 * server - serves static resources locally for developing "earth"
 */

"use strict";

console.log("============================================================");
console.log(new Date().toISOString() + " - Starting");

var util = require("util");
var tool = require(__dirname + "/tool");

/**
 * Returns true if the response should be compressed.
 */
function compressionFilter(req, res) {
    return tool.isCompressionRequired(res.getHeader('Content-Type'));
}

/**
 * Adds headers to a response to enable caching.
 */
function cacheControl() {
    return function(req, res, next) {
        res.setHeader("Cache-Control", tool.cacheControl(req.url));
        return next();
    };
}

function logger() {
    express.logger.token("date", function() {
        return new Date().toISOString();
    });
    express.logger.token("response-all", function(req, res) {
        return (res._header ? res._header : "").trim();
    });
    express.logger.token("request-all", function(req, res) {
        return util.inspect(req.headers);
    });
    return express.logger(
        ':date - info: :remote-addr :req[cf-connecting-ip] :req[cf-ipcountry] :method :url HTTP/:http-version ' +
//      '":user-agent" :referrer :req[cf-ray] :req[accept-encoding]');
        '":user-agent" :referrer :req[cf-ray] :req[accept-encoding]\\n:request-all\\n\\n:response-all\\n');
}

var port = process.argv[2];
var express = require("express");
var app = express();

app.use(cacheControl());
app.use(express.compress({filter: compressionFilter}));
app.use(logger());
app.use(express.static(__dirname + "/public"));

app.listen(port);
console.log("Listening on port " + port + "...");