import {testEnabledForPlugin, wpLogin} from "../support/utils";
import {interceptPanelAndReplaceKey} from "../support/intercepts";

describe('Disk Space Component', () => {

    before( function () {
        testEnabledForPlugin( 'bluehost' );
        wpLogin();
        cy.visit( '/wp-admin/admin.php?page=nfd-hosting' );
    } );

    context('Test 1: Disk space info not available', () => {

        it('Show message that data re anot available.', () => {
            cy.get('.nfd-disk-space-card').should('have.class', 'nfd-disk-space-not-available');
            cy.contains('p', 'No information available on disk space.').should('exist');
        });
    });

    context('Test 2: disk space available equal or major 40%', () => {

        beforeEach( () => {
            interceptPanelAndReplaceKey( 'disk-space', {
                diskused: '30',
                disklimit: '100',
            } );
            cy.reload( true ); // Use reload to re-trigger the page
            cy.wait( '@getPanelData' );
        } );

        it('Check elements in section', () => {
            cy.get('.nfd-disk-space-card')
                .should('have.class', 'nfd-disk-space-available')
                .invoke('attr', 'data-usagePercentage')
                .then((val) => {
                    const usage = parseInt(val, 10);
                    expect(usage).to.be.lessThan(60);
                });

            cy.get('p.nfd-disk-space-used').invoke('text').then(text => {
                const [used, total] = text.match(/\d+/g).map(Number);
                expect(used).to.be.at.most(total);
            });

            cy.get('.nfd-disk-space-level').should('have.class', 'high-capacity');
            cy.get('.nfd-progress-bar__progress').should('have.css', 'background-color', 'rgb(76, 175, 80)');

            cy.get('.nfd-alert--success')
                .within(() => {
                    cy.get('.nfd-validation-message').should('not.be.empty');
                });

            cy.get('.nfd-change-plan').should('be.visible').and('not.be.disabled');
        });
    });

    context('Test 3: disk space available between 35% e 40%', () => {

        beforeEach( () => {
            interceptPanelAndReplaceKey( 'disk-space', {
                diskused: '70',
                disklimit: '100',
            } );
            cy.reload( true ); // Use reload to re-trigger the page
            cy.wait( '@getPanelData' );
        } );

        it('Check elements in section', () => {
            cy.get('.nfd-disk-space-card')
                .should('have.class', 'nfd-disk-space-available')
                .invoke('attr', 'data-usagePercentage')
                .then((val) => {
                    const usage = parseInt(val, 10);
                    expect(usage).to.be.gte(60).and.to.be.lt(95);
                });

            cy.get('p.nfd-disk-space-used').invoke('text').then(text => {
                const [used, total] = text.match(/\d+/g).map(Number);
                expect(used).to.be.at.most(total);
            });

            cy.get('.nfd-disk-space-level').should('have.class', 'medium-capacity');
            cy.get('.nfd-progress-bar__progress').should('have.css', 'background-color', 'rgb(245, 158, 11)');

            cy.get('.nfd-alert--warning')
                .should('have.css', 'background-color', 'rgb(254, 243, 199)')
                .within(() => {
                    cy.get('.nfd-validation-message--warning').should('not.be.empty');
                });

            cy.get('.nfd-change-plan').should('be.visible').and('not.be.disabled');
        });
    });

    context('Test 4: disk space available between 0 and 5%', () => {

        beforeEach( () => {
            interceptPanelAndReplaceKey( 'disk-space', {
                diskused: '95',
                disklimit: '100',
            } );
            cy.reload( true ); // Use reload to re-trigger the page
            cy.wait( '@getPanelData' );
        } );


        it('Check elements in section', () => {
            cy.get('.nfd-disk-space-card')
                .should('have.class', 'nfd-disk-space-available')
                .invoke('attr', 'data-usagePercentage')
                .then((val) => {
                    const usage = parseInt(val, 10);
                    expect(usage).to.be.at.least(95);
                });

            cy.get('p.nfd-disk-space-used').invoke('text').then(text => {
                const [used, total] = text.match(/\d+/g).map(Number);
                expect(used).to.be.at.most(total);
            });

            cy.get('.nfd-disk-space-level').should('have.class', 'low-capacity');
            cy.get('.nfd-progress-bar__progress').should('have.css', 'background-color', 'rgb(244, 67, 54)');

            cy.get('.nfd-alert--error')
                .should('have.css', 'background-color', 'rgb(254, 226, 226)')
                .within(() => {
                    cy.get('.nfd-validation-message').should('contain', "You're over the storage limit that your plan is designed for.");
                    cy.get('svg.nfd-validation-icon--error').should('exist');
                });

            cy.get('.nfd-change-plan').should('be.visible').and('not.be.disabled');
        });
    });

});