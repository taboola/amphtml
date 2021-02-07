export class AmpTaboola extends AMP.BaseElement {
    /** @override */
    buildCallback() {
        this._publisher = this.element.getAttribute('publisher');
        this._pageType = this.element.getAttribute('page-type');
        this._config = JSON.parse(this.element.textContent);

        Object.entries(this._config).forEach(([placement, config]) => {
            const container = this.element.ownerDocument.getElementById(config.container);

            const taboolaEmbed = this.createTaboolaEmbed({
                component: 'embed',
                placement,
                mode: config.mode,
                height: config.height,
                width: config.width,
                targetType: config.target_type
            });

            container.appendChild(taboolaEmbed);
            this.setupAmpEmbedCommunications(taboolaEmbed);
        });
    }

    createTaboolaEmbed({ component, placement, mode, targetType, responsive = true, height, width }) {
            const taboolaEmbed = this.element.ownerDocument.createElement(`amp-${component}`);
            if (responsive) {
                taboolaEmbed.setAttribute('layout', 'responsive');
            }
            taboolaEmbed.setAttribute('type', 'taboola');
            taboolaEmbed.setAttribute('height', height);
            taboolaEmbed.setAttribute('width', width);
            taboolaEmbed.setAttribute('data-publisher', this._publisher);
            taboolaEmbed.setAttribute('data-placement', placement);
            taboolaEmbed.setAttribute('data-mode', mode);
            taboolaEmbed.setAttribute(`data-${this._pageType}`, 'auto');
            if (targetType) {
                taboolaEmbed.setAttribute('data-target_type', targetType);
            }

            return taboolaEmbed;
    }

    setupAmpEmbedCommunications(embed) {
        window.addEventListener('message', ({ data }) => {
            if (data.taboola) {
                if (data.loadNextUp) {
                    this.loadNextUp(data.loadNextUp);
                }

                if (data.loadReadMore) {
                    this.loadReadMore(data.loadReadMore);
                }

                if (data.loadFeedView) {
                    this.loadFeedView(data.loadFeedView);
                }
            }
        });
    }

    loadNextUp(data) {
        const stickyAd = this.element.ownerDocument.createElement('amp-sticky-ad');
        stickyAd.setAttribute('layout', 'nodisplay');
        const taboolaEmbed = this.createTaboolaEmbed({
            component: 'ad',
            responsive: false,
            placement: 'Ads Example',
            mode: data.mode,
            height: 100,
            width: 300
        });

        stickyAd.appendChild(taboolaEmbed);
        this.element.ownerDocument.body.appendChild(stickyAd);
    }

    loadReadMore(data) {
        const button = this.element.ownerDocument.createElement('button');
        const content = this.element.ownerDocument.querySelector(data.boxSelector);

        content.style.height = `${data.minimizedSize}px`;
        content.style.overflow = 'hidden';
        button.style.width = '100%';
        button.style.height = '80px';
        button.style.display = 'block';
        button.style.backgroundColor = '#fff';
        button.style.border = 'solid 1px #666';
        button.textContent = data.caption;

        content.insertAdjacentElement('afterend', button);

        button.addEventListener('click', () => {
            content.style.height = '';
            content.style.overflow = '';
            content.parentNode.removeChild(button);
        });
    }

    loadFeedView(data) {
        window.history.pushState(
            { inFeedView: true },
            data.title
        );

        const iframe = this.element.ownerDocument.createElement('amp-iframe');
        const placeholder = this.element.ownerDocument.createElement('amp-img');

        placeholder.setAttribute('src', 'https://www.taboola.com/sites/all/themes/taboola2017/images/branding/logo-blue/logo-blue.png');
        placeholder.setAttribute('width', '222');
        placeholder.setAttribute('height', '54');
        placeholder.setAttribute('layout', 'fixed');
        placeholder.style.marginBottom = '128px';
        placeholder.style.backgroundColor = '#fff';

        const placeholderContainer = this.element.ownerDocument.createElement('div');
        placeholderContainer.setAttribute('placeholder', '');
        placeholderContainer.style.backgroundColor = '#fff';
        placeholderContainer.style.display = 'flex';
        placeholderContainer.style.alignItems = 'center';
        placeholderContainer.style.justifyContent = 'center';
        placeholderContainer.appendChild(placeholder);

        iframe.appendChild(placeholderContainer);

        iframe.style.position = 'fixed';
        iframe.style.top = '0';
        iframe.style.left = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100vh';
        iframe.style.backgroundColor = '#fff';
        iframe.setAttribute('width', '480');
        iframe.setAttribute('height', '920');
        iframe.setAttribute('src', data.logger_url);
        iframe.setAttribute('layout', 'responsive');
        this.element.ownerDocument.body.appendChild(iframe);

        const handler = () => {
            const state = window.history.state;
            if (state.hasOwnProperty('inFeedView')) {
                this.element.ownerDocument.body.removeChild(iframe);
                const newState = Object.assign({}, state, { inFeedView: false });
                window.history.replaceState(newState)
                window.removeEventListener('popstate', handler);
            }
        };
        window.addEventListener('popstate', handler);
    }
}

AMP.extension('amp-taboola', '0.1', AMP => {
  AMP.registerElement('amp-taboola', AmpTaboola);
});
