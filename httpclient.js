/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
const { URL } = require('url');

function createOptions(params) {
    let headers = params.headers || {};

    let data = null;
    if (params.body) {
        data = JSON.stringify(params.body);
        let length = Buffer.byteLength(data, 'utf-8');
        headers['Content-Length'] = length;
    }

    let url = new URL(params.url);
    let options = {
        host: url.hostname,
        path: url.pathname + url.search,
        headers: headers,
        protocol: url.protocol,
        port: url.port,
        method: params.requestType,
    };

    return { options, data };
}

function sendRequest(https, params) {
    let call = new Promise((resolve, reject) => {

        let { options, data } = createOptions(params);

        let req = https.request(options, function (response) {
            var str = ''
            response.on('data', function (chunk) {
                str += chunk;
            }).on('end', function () {
                let isJson = false;

                for (let h in response.headers) {
                    if (h.toLowerCase() == 'content-type' && response.headers[h].match('json')) {
                        isJson = true;
                        break;
                    }
                }

                console.debug('Got response from:', params.url, 'status:', response.statusCode, response.statusMessage);
                resolve({
                    statusCode: response.statusCode,
                    statusMessage: response.statusMessage,
                    headers: response.headers,
                    body: isJson ? JSON.parse(str) : str,
                });
            });
        }).on('error', function (e) {
            console.error('Error while invoking:', params.url, ' details:', e);
            reject(e);
        });

        if (data) {
            req.write(data);
        }
        req.end();
    });

    return call;
}

module.exports.sendRequest = sendRequest;
module.exports.createOptions = createOptions;
