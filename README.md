# Lightning Test

[![Cypress Tests](https://github.com/robbertvancaem/lightning-cypress-test/actions/workflows/main.yml/badge.svg)](https://github.com/robbertvancaem/lightning-cypress-test/actions/workflows/main.yml)

This repo shows an example of using [Cypress](https://docs.cypress.io/) in combination with [cypress-visual-regression](https://github.com/mjhea0/cypress-visual-regression) for a Lightning application. By running some commands through Github Actions, it's possible to automatically run visual tests in a headless browser.

Cypress is already perfectly capable of doing so, but it's mostly used when there's a DOM with DOM elements. In the case of Lightning applications, there's only one `<canvas>` element, which asks for a slightly different approach.

## Overview {#overview}
To add visual regression testing into a project, the following steps should be taken:
- [Installing dependencies](#dependencies)
- [Configuring Cypress](#configuration)
- [Writing Cypress tests](#writing)
- [Generating base snapshots](#snapshots)
- [Building, serving and image diffing in CI](#ci)
- [Analysing artifacts](#artifacts)

## Installing dependencies {#dependencies}

Run the following command in the working directory to install the dependencies (as `devDependencies`)

`npm install --save-dev @lightningjs/cli cypress cypress-visual-regression`

\* The `@lightningjs/cli` package needs to be installed so that a build can be made when the code is pushed to Github

## Configuring Cypress {#configuration}
Cypress is responsible for running a headless browser and visiting some routes as if a user would do so. This tool also allows you to stub external API calls and mimick user interactions, such as typing text into a field or pressing the 'Enter' key.

When Cypress is installed, it will yield a couple of directories and files by default:
```
|-- cypress.config.js   # A Cypress configuration file
|-- cypress
  |-- downloads
  |-- e2e
    |-- spec.cy.js      # A preview test file, Cypress calls these 'specs'
  |-- fixtures
    |-- example.json    # This is a file that can be used to stub API responses
  |-- support
    |-- commands.js     # A place to register custom/third-party commands
    |-- e2e.js          # Only imports 'commands.js'
```

## Writing Cypress tests {#writing}
## Generating base snapshots {#snapshots}

## Building, serving and image diffing in CI {#ci}

## Analysing artifacts {#artifacts}
