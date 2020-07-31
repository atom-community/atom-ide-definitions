/** @babel */

import { getDefinitions } from "../lib/goToDefinition"

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe("go to definition", () => {
  describe("getDefinitions", () => {
    it("returns undefined if no provider exists for editor", async () => {
      const providerRegistry = {
        getProviderForEditor() {},
      }
      const definitions = await getDefinitions(providerRegistry, { editor: true, position: true })
      expect(definitions).toBeUndefined()
    })
  })
})
