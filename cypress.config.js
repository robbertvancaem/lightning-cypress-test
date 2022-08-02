const { defineConfig } = require('cypress')
const getCompareSnapshotsPlugin = require('cypress-visual-regression/dist/plugin')

// https://docs.cypress.io/api/plugins/browser-launch-api#Examples

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
  screenshotsFolder: './cypress/snapshots/actual',
  trashAssetsBeforeRuns: true,
})
