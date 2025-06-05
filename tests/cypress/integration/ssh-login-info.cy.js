import { wpLogin } from '../support/utils';
import { testEnabledForPlugin, cleanupVisitHomePage } from '../support/utils';

const selectors = {
    manageKeys: '#nfd-hosting-manage-keys',
    informationTooltip: '#nfd-hosting-manage-keys .nfd-information-tooltip',
    sshInfo: '#nfd-hosting-ssh-login-info'
};

describe('Login to Bluehost Panel, Hosting section', () => {
    before(() => {
        testEnabledForPlugin('bluehost');
        wpLogin();
        // First-time visit to allow hard reloads later.
        cy.visit('/wp-admin/admin.php?page=nfd-hosting');
    });

    beforeEach(() => {
        cy.get(selectors.manageKeys).as('manageKeys');
        cy.get(selectors.informationTooltip).as('informationTooltip');
        cy.get(selectors.sshInfo).as('sshInfo');
    });

    it('Should display SSH Login info section', () => {
        cy.get('[data-testid="ssh-login-info-card"]').should('exist');
    });

    it('Should find the tooltip', () => {
        cy.get('@manageKeys').find('svg').should('exist');
        cy.get('@informationTooltip').should('exist');
    });

    it('Should show/hide tooltip on icon hover', () => {
        cy.get('@informationTooltip')
            .find('.nfd-information-tooltip-text')
            .should('have.class', 'nfd-hidden') // check if the element is hidden by default
            .invoke('removeClass', 'nfd-hidden') // remove class in charge to hide the element
            .invoke('addClass', 'nfd-flex');     // force visibility

        cy.get('.nfd-information-tooltip-text').should('be.visible');

        // Simulate hover restoring the CSS class
        cy.get('@informationTooltip')
            .find('.nfd-information-tooltip-text')
            .invoke('removeClass', 'nfd-flex')
            .invoke('addClass', 'nfd-hidden');

        cy.get('.nfd-information-tooltip-text').should('not.be.visible');
    });

    it('Should click on "Manage keys" button', () => {
        cy.window().then((win) => {
            cy.stub(win, 'open').as('windowOpen');
        });

        cy.get('@manageKeys').find('button').click();

        cy.get('@windowOpen').should('have.been.calledWithMatch', (url) => {
            return url.includes('https://www.bluehost.com/my-account/hosting/details/sites');
        });
    });

    it('Should check if SSH username is set', () => {
        cy.get('@sshInfo').find('.nfd-info-action-card-value')
            .invoke('text')
            .should('not.be.empty');
    });

    it('Should click on "Copy" button if visible', () => {
        cy.get('@sshInfo').then(($sshInfo) => {
            if ($sshInfo.find('button').length > 0) {
                cy.window().then((win) => {
                    if (!win.navigator.clipboard) {
                        win.navigator.clipboard = { writeText: cy.stub().as('copyStub') };
                    } else {
                        cy.stub(win.navigator.clipboard, 'writeText').as('copyStub');
                    }
                });

                cy.get('@sshInfo').find('.nfd-info-action-card-value').invoke('text').as('textToCopy');

                cy.get('@sshInfo').find('button').click();

                cy.get('@textToCopy').then((text) => {
                    cy.get('@copyStub').should('have.been.calledWith', text);
                });

                cy.get('.nfd-button-copied').should('be.visible');
            } else {
                cy.log('Button not found, skipping test.');
            }
        });
    });

    // After all tests in the suite, visit the home page to reset the environment
    after(() => {
        cleanupVisitHomePage();
    });
});