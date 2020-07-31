/** @babel */

import * as main from "../lib/main"

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe("main", () => {
  it("activate", async function () {
    // Trigger deferred activation
    atom.packages.triggerDeferredActivationHooks()
    // Activate activation hook
    atom.packages.triggerActivationHook("core:loaded-shell-environment")

    await atom.packages.activatePackage("atom-ide-definitions")
    expect(atom.packages.isPackageLoaded("atom-ide-definitions")).toBeTruthy()
  })

  it("getClickProvider", () => {
    const provider = main.getClickProvider()

    expect(typeof provider.getSuggestionForWord).toEqual("function")
  })
})
