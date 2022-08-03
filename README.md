# Lightning Test

[![Cypress Tests](https://github.com/robbertvancaem/lightning-cypress-test/actions/workflows/main.yml/badge.svg)](https://github.com/robbertvancaem/lightning-cypress-test/actions/workflows/main.yml)

This repo shows an example of using [Cypress](https://docs.cypress.io/) in combination with [cypress-visual-regression](https://github.com/mjhea0/cypress-visual-regression) for a Lightning application. By running some commands through Github Actions, it's possible to automatically run visual tests in a headless browser.

Cypress is already perfectly capable of doing so, but it's mostly used when there's a DOM with DOM elements. In the case of Lightning applications, there's only one `<canvas>` element, which asks for a slightly different approach.

## Overview
To add visual regression testing into a project, the following steps should be taken:
- [Installing dependencies](#installing-dependencies)
- [Configuring Cypress](#configuring-cypress)
- [Writing Cypress tests](#writing-cypress-tests)
- [Generating base snapshots](#generating-base-snapshots)
- [Building, serving and image diffing in CI](#building-serving-and-image-diffing-in-ci)
- [Analysing artifacts](#analysing-artifacts)

## Installing dependencies

Run the following command in the working directory to install the dependencies (as `devDependencies`)

`npm install --save-dev @lightningjs/cli cypress cypress-visual-regression`

_\* The `@lightningjs/cli` package needs to be installed so that a build can be made when the code is pushed to Github_

## Configuring Cypress
Cypress is responsible for running a headless browser and visiting some routes as if a user would do so. This tool also allows you to stub external API calls and mimick user interactions, such as typing text into a field or pressing the 'Enter' key.

It's good to know that Cypress can run in two type of ways; through the `GUI`, which you can see if you run `cypress open`. This will open a Chrome tab where you can start individual tests and see how it renders in the browser; or in `runner` mode, which is used when Cypress is ran in CI. You can consider this as an automated way of running Cypress.

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

#### Defining the viewport as 1920x1080
Add the `viewportWidth` and `viewportHeight` to the `cypress.config.js` file to tell Cypress that the application should run in a 1920x1080 viewport when you have the Cypress GUI open.

```js
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  viewportWidth: 1920,
  viewportHeight: 1080,
})
```

#### Register the cypress-visual-regression plugin and command
Cypress provides the option to add third-party or custom plugins and commands by adding a little bit of configuration.

Update the `cypress.config.js` file so that it looks like this:
```js
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      getCompareSnapshotsPlugin(on, config)

      // These dimensions are NOT automatically inherited from viewportWidth and viewportHeight
      on('before:browser:launch', (browser = {}, launchOptions) => {
        if (browser.name === 'electron' && browser.isHeadless) {
          launchOptions.preferences.width = 1920
          launchOptions.preferences.height = 1080
        }

        return launchOptions
      })
    },
  },
  viewportWidth: 1920,
  viewportHeight: 1080,
})
```
The `before:browser:launch` hook is needed so that the screenshots that will be generated obey the dimensions of 1920x1080 when Cypress is ran in `runner` mode.

Cypress utilises as special, chainable syntax which might look familiar if you've worked with jQuery before. An example of a Cypress command is:
```js
cy.visit('http://localhost:8080')
cy.wait(2000)
cy.get('body').type('abc')
```

You can extend these commands by registering them through the `cypress/e2e/support/commands.js` file:
```js
const compareSnapshotCommand = require('cypress-visual-regression/dist/command')

compareSnapshotCommand({
  scale: true,
  errorThreshold: 0.03,
})
```

When this is done, it's possible to use a command like so:
```js
cy.compareSnapshot('home')
```
In this case, 'home' is the name of the screenshot/snapshot that we want to compare. More about these snapshots is documented [here]((#generating-base-snapshots))

## Writing Cypress tests
Cypress makes a distinction between 2 types of tests: end-to-end tests (e2e) and component tests. For now, we ignore the component tests and only focus on e2e tests. In the folder `e2e`, you can add a `*.cy.js`, where the `.cy.js` extension indicates that it concerns a Cypress test. As an example, `spec.cy.js` looks like this:

```js
// Use the 'describe' to give your test a name
describe('Home', () => {
  // The 'it' property indicates a certain condition you're expecting
  it('passes', () => {

    // Navigate to the homepage (make sure it's running)
    cy.visit('http://localhost:8080')

    // Wait for 2 seconds to ensure the opening animation is done
    cy.wait(2000)

    // Mimick a press on the 'Enter' key (note the brackets, otherwise it would type the word 'enter')
    cy.get('body').type('{enter}')

    // Take a screenshot
    cy.compareSnapshot('home-initial')

    // Repeat to toggle the text (see App.js for _handleEnter logic)
    cy.get('body').type('{enter}')
    cy.compareSnapshot('home-pressed')

    cy.get('body').type('{enter}')
    cy.compareSnapshot('home-restored')
  })
})
```

More info on writing tests can be found [here](https://docs.cypress.io/guides/end-to-end-testing/writing-your-first-end-to-end-test)

## Generating base snapshots
To be able to do image diffing, it's important to understand that the image diffing tool will need:
- A reference image; a base image, one that you know is correct
  - This base image needs to be supplied, as the application cannot automagically know what's the correct state. We can generate this by telling the cypress-visual-regression tool to run Cypress in 'snapshot' mode; it will generate and save the base images.
- An actual image; one that you expect to be correct/match the base image
  - This image is taken in CI when the cypress-visual-regression tool is running in 'comparison' mode.
- A diffing image; a comparison between the base and the actual image to detect changes.
  - This image is taken in CI when the cypress-visual-regression tool is running in 'comparison' mode.

Consider this example, where we (accidentaly) moved text up the screen.

#### Base image
This is what we expected the screen to look like
![Base image](/docs/images/base.png?raw=true "Base image")

#### Actual image
This is what was actually observed
![Actual image](/docs/images/actual.png?raw=true "Actual image")

#### Diff image
This is the difference between the two images, which is used by the diffing algorithm to calculate the 'threshold' between the two images; how much do they differ? If that's above a certain threshold, the diffing tool will know that this is wrong behaviour and makes the tests fail.
![Diff image](/docs/images/diff.png?raw=true "Diff image")

_\* Notice that even for unaltered text (such as the version box in the bottom right corner, a slight difference is observed. This is due to a minor difference in how text is aliased in different environments. This requires an errorThreshold to be above 0, since setting it to 0 will always yield false negative results._

## Building, serving and image diffing in CI
Now that we understand what needs to happen, it's time to tie this all together and run this in CI through the use of Github Actions. This enables us to run in an independent, isolated environment which is equal to all contributors to the repository. This reduces the chance of faulty configurations causing tests to behave incorrect.

This can be done by adding a `main.yml` file in the `.github/workflows` directory which instructs Github what steps to take and what to test.

```yml
# The name of our workflow, showing in Github under the 'Actions' panel
name: Cypress Tests

on:
  # Trigger the workflow on every push
  push:
    # Don't run this workflow if ALL changed files are only docs-related
    paths-ignore:
      - 'README.md'
      - 'docs/**'
jobs:
  # The name of our job (you can define multiple jobs per workflow)
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      # Checkout the code using the actions/checkout@v2 action (provided by Github itself)
      - name: Checkout
        uses: actions/checkout@v2

      # Build the app using NPM commands (see package.json)
      - name: Install and build
        run: |
          npm install
          npm run build --if-present

      # Upload the generated dist/es6 folder as a ZIP called 'dist'
      - name: Store artifact
        uses: actions/upload-artifact@v3
        with:
          # This is the name of the artifact/ZIP file
          name: dist
          if-no-files-found: error
          path: dist/es6

      # Run Cypress
      - name: Run Cypress
        uses: cypress-io/github-action@v4
        with:
          # This spawns an http-server using the generated dist bundle
          start: npm run start:dist

          # Wait for port 8080 to be available
          wait-on: 'http://localhost:8080'

          # Run Cypress in 'actual' mode, so that it compares the 'base' images and generates the 'diff' images
          env: type=actual

      # Save the files generated by Cypress into an artifact, so that they can be analysed
      - name: Upload Cypress artifacts
        uses: actions/upload-artifact@v3

        # Only save the artifacts when Cypress failed (saving storage)
        if: ${{ failure() }}
        with:
          # This will be the name of the artifact/ZIP file
          name: cypress-artifacts
          path: |
            cypress/snapshots
            cypress/videos
          if-no-files-found: error
```

## Analysing artifacts
As can be seen in the `main.yml` file, so called 'artifacts' are stored. When you inspect a workflow run through the GUI, you'll see an "Artifacts" section where the 2 generated ZIP files can be found. If you click the filename, they will be downloaded. The `dist` ZIP file contains the generated bundle, and the `cypress-artifacts` ZIP file contains the screenshots Cypress generated. Cypress also records a video

![Artifacts](/docs/images/artifacts.png?raw=true "Artifacts")

