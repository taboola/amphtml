/**
 * Copyright 2015 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {createIframePromise} from '../../testing/iframe';
import {installAd} from '../../builtins/amp-ad';
import {installEmbed} from '../../builtins/amp-embed';

describe('amp-embed', () => {

  function getElement(installFn, elementName, attributes) {
    return createIframePromise(undefined)
    .then(iframe => {
      iframe.iframe.style.height = '400px';
      iframe.iframe.style.width = '400px';
      installFn(iframe.win);

      const a = iframe.doc.createElement(elementName);

      const link = iframe.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', 'https://schema.org');
      iframe.doc.head.appendChild(link);

      for (const key in attributes) {
        a.setAttribute(key, attributes[key]);
      }

      return iframe.addElement(a);
    });
  }


  it('and amp-ad should be render the same way', () => {
    const repeatedAttributes = {
      width: 300,
      height: 250,
      type: 'a9',
      src: 'https://testsrc',
      'data-aax_size': '300x250',
      'data-aax_pubname': 'test123',
      'data-aax_src': '302',
    };
    const adElementPromise = getElement(installAd, 'amp-ad',
      repeatedAttributes);
    const embedElementPromise = getElement(installEmbed, 'amp-embed',
      repeatedAttributes);

    return Promise.all([adElementPromise, embedElementPromise])
    .then(elements => {
      expect().fail("Test not implemented yet.");
    });
  });

});
