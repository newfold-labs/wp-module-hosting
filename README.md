<a href="https://newfold.com/" target="_blank">
    <img src="https://newfold.com/content/experience-fragments/newfold/site-header/master/_jcr_content/root/header/logo.coreimg.svg/1621395071423/newfold-digital.svg" alt="Newfold Logo" title="Newfold Digital" align="right" 
height="42" />
</a>

# WordPress Hosting Module
A Newfold module that manages the Hosting panel on the plugin page and serves as middleware for interacting with hosting services.


## Critical Paths

* The `Hosting` page should provide a central overview of the site's current hosting-related configuration and health status.
* The `Malware Check` section must show the scan status of the website and allow the user to run a full malware scan.
* The `CDN` section must display whether the CDN is enabled or not. If not enabled, users should be able to activate it via the "Enable CDN" button.
* The `SSH Login Info` box should show information about SSH key management and connection status. If unavailable, a warning should be displayed.
* The `Nameservers` section must indicate if name servers have been configured or not.
* The `PHP Version` section must display the current PHP version and offer an option to update if an upgrade is available.
* The `Manage Hosting` button must link users to a control panel or platform-specific management screen for advanced hosting operations.
* The `Refresh` button must update the page data (e.g., scan status, PHP version) in real time or through an API fetch.

## Installation

### 1. Add the Newfold Satis to your `composer.json`.

 ```bash
 composer config repositories.newfold composer https://newfold.github.io/satis
 ```

### 2. Require the `newfold-labs/wp-module-hosting` package.

 ```bash
 composer require newfold-labs/wp-module-hosting
 ```
[More on Newfold WordPress Modules](https://github.com/newfold-labs/wp-module-loader)
