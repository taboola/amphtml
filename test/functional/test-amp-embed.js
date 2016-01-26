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
      const adElement = elements[0].firstChild;
      const embedElement = elements[1].firstChild;
      expect().fail("Test not implemented yet")
    });
  });

});
