import { wpLogin } from '../support/utils';
import { testEnabledForPlugin, cleanupVisitHomePage } from '../support/utils';

describe('Test PHP Version Card visibility and behavior', () => {
    before(() => {
        testEnabledForPlugin('bluehost');
        wpLogin();
        // First-time visit to allow hard reloads later.
        cy.visit('/wp-admin/admin.php?page=nfd-hosting');
    });

    const selectors = {
        phpCard: 'div[data-testid="php-version-card"]',
        textContainer: 'div[data-testid="php-version-card"] .nfd-info-action-card-value',
        button: 'div[data-testid="php-version-card"] button'
    };

    it('Check if card exists', () => {
        cy.get(selectors.phpCard).should('exist');
    });

    context('PHP version not set', () => {
        beforeEach(function () {
            cy.get(selectors.phpCard)
                .invoke('attr', 'data-version')
                .then((version) => {
                    if (version === 'false') {
                        this.versionIsFalse = true;
                    } else {
                        this.skip();
                    }
                });
        });

        it('Show text to notify PHP version is not set, but button must not be available', function () {
            cy.get(selectors.textContainer).invoke('text').should('not.be.empty');
            cy.get(selectors.button).should('not.exist');
        });
    });

    context('PHP version set', () => {
        beforeEach(function () {
            cy.get(selectors.phpCard)
                .invoke('attr', 'data-version')
                .then((version) => {
                    if (version && version !== 'false') {
                        this.versionIsSet = true;
                    } else {
                        this.skip();
                    }
                });
        });

        it('Show PHP version and trigger click on button', function () {
            cy.get(selectors.textContainer).invoke('text').should('not.be.empty');
            cy.get(selectors.button).should('exist');

            cy.window().then((win) => {
                cy.stub(win, 'open').as('windowOpen');
            });

            cy.get(selectors.button).click();

            cy.get('@windowOpen').should('have.been.calledWithMatch', (url) => {
                return url.includes(
                    'https://www.bluehost.com/my-account/hosting/details/sites?utm_source=wp-admin%2Fadmin.php%3Fpage%3Dbluehost%23%2Fhosting&utm_medium=bluehost_plugin'
                );
            });
        });
    });

    // After all tests in the suite, visit the home page to reset the environment
    after(() => {
        cleanupVisitHomePage();
    });
});