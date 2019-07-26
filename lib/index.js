"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dgram = __importStar(require("dgram"));
var xml2js = __importStar(require("xml2js"));
function xmlEncode(str) {
    return str.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
}
// Check from das.domain.fi:715 (UDP) if domain is available
function dasQueryDomainAvailable(domain) {
    return __awaiter(this, void 0, void 0, function () {
        var dasServer, dasPort, query, response, status;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dasServer = 'das.domain.fi';
                    dasPort = 715;
                    query = '<?xml version="1.0" encoding="UTF-8"?>' +
                        '<iris1:request xmlns:iris1="urn:ietf:params:xml:ns:iris1">' +
                        '<iris1:searchSet>' +
                        '<iris1:lookupEntity registryType="dchk1" entityClass="domain-name" entityName="' + xmlEncode(domain) + '"/>' +
                        '</iris1:searchSet>' +
                        '</iris1:request>';
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            var socket = dgram.createSocket('udp4');
                            socket.on('error', function (err) {
                                reject(err);
                                socket.close();
                            });
                            socket.on('message', function (msg, _rinfo) {
                                var response = msg.toString();
                                xml2js.parseString(response, function (err, doc) {
                                    if (err)
                                        reject(err);
                                    else
                                        resolve(doc);
                                });
                                socket.close();
                            });
                            socket.on('close', function () {
                            });
                            socket.on('listening', function () {
                                socket.send(query, dasPort, dasServer);
                            });
                            socket.bind();
                        })];
                case 1:
                    response = (_a.sent());
                    status = response && response.domain && response.domain.status;
                    if (status[0] && status[0].active) {
                        // Taken
                        return [2 /*return*/, false];
                    }
                    else if (status[0] && status[0].available) {
                        // Available
                        return [2 /*return*/, true];
                    }
                    else if (status[0] && status[0].invalid) {
                        // Invalid request
                        throw new Error('Invalid DAS request');
                    }
                    // Invalid response
                    throw new Error('Invalid DAS response');
            }
        });
    });
}
exports.dasQueryDomainAvailable = dasQueryDomainAvailable;
