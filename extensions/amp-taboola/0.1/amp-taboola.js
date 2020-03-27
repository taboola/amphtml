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
                width: config.width
            });

            container.appendChild(taboolaEmbed);
            this.setupAmpEmbedCommunications(taboolaEmbed);
        });
    }

    createTaboolaEmbed({ component, placement, mode, responsive = true, height, width }) {
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

            return taboolaEmbed;
    }

    setupAmpEmbedCommunications(embed) {
        window.addEventListener('message', ({ data }) => {
            if (data.taboola) {
                if (data.loadNextUp) {
                    this.loadNextUp(data.loadNextUp);
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
}

AMP.extension('amp-taboola', '0.1', AMP => {
  AMP.registerElement('amp-taboola', AmpTaboola);
});
