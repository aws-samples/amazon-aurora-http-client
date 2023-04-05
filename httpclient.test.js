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
var https = require('https');
const httclient = require('./httpclient.js');

describe('HTTP Client', () => {

    test('Sends HTTP request', async () => {
        let params = {
            "url": "https://checkip.amazonaws.com/",
            "headers": {
                "Accept-Encoding": "application/json",
                "Accept-Language": "en-US,en;q=0.7,es;q=0.3",
            },
            "requestType": "GET"
        };

        let responsePromise = httclient.sendRequest(https, params);
        let response = await responsePromise;

        expect(response.statusCode).toBe(200);
        expect(typeof response.body).toBe('string');
    });

    test('Sends HTTP request and parse JSON response', async () => {
        let params = {
            "url": "https://my-json-server.typicode.com/typicode/demo/posts",
            "headers": {
                "Accept-Encoding": "application/json",
                "Accept-Language": "en-US,en;q=0.7,es;q=0.3",
            },
            "requestType": "GET"
        };

        let responsePromise = httclient.sendRequest(https, params);
        let response = await responsePromise;

        expect(response.statusCode).toBe(200);
        expect(typeof response.body).toBe('object');
    });

    test('Sends HTTP request without headers', async () => {
        let params = {
            "url": "https://checkip.amazonaws.com/",
            "payload": {
                "this": ["is", "a", "test"],
            },
            "requestType": "POST"
        };

        let responsePromise = httclient.sendRequest(https, params);
        let response = await responsePromise;

        expect(response.statusCode).toBe(200);
    });

    test('Compute Content-Length in bytes', async () => {

        let params = {
            "url": "https://XXX.execute-api.eu-west-1.amazonaws.com/prod/employees/search",
            "body": {
                "nameSearch": "ŁUKASZ",
            },
            "headers": {
                "Accept-Encoding": "application/json",
                "Accept-Language": "en-US,en;q=0.7,es;q=0.3",
            },
            "requestType": "POST"
        };

        let { options, data } = httclient.createOptions(params);

        let stringLength = data.length;
        let byteLength = options.headers['Content-Length'];

        // Ł character is encoded in 2 bytes so the Content-Length is string length + 1
        expect(byteLength).toBe(stringLength + 1);
    });
});
