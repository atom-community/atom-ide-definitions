"use babel"

import { ClickProvider } from "../lib/clickProvider"
import * as goToDefinition from "../lib/goToDefinition"

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe("click provider", () => {
  const editor = atom.workspace.getActiveTextEditor()
  const providerRegistry = {
    getProviderForEditor: () => {},
  }
  const definitions = [
    {
      language: "Lang",
      path: "/path/to/file",
      position: { row: 0, column: 0 },
      range: { start: { row: 0, column: 0 }, end: { row: 0, column: 1 } },
    },
  ]
  const word = "foo"
  const range = { start: { row: 0, column: 0 }, end: { row: 0, column: 3 } }

  let clickProvider
  beforeEach(function () {
    spyOn(atom.config, "get").andCallFake(function (value) {
      const config = {
        "atom-ide-definitions.clickGrammarScopes": [],
        "atom-ide-definitions.clickPriority": 0,
      }
      return config[value]
    })

    clickProvider = new ClickProvider(providerRegistry)
  })

  it("verify provider structure", () => {
    const provider = clickProvider.getProvider()

    expect(provider.priority).toEqual(0)
    expect(provider.grammarScopes).toBeNull()
    expect(typeof provider.getSuggestionForWord).toEqual("function")
  })

  it("getSuggestionForWord returns range and callback if definition is available", async () => {
    const provider = clickProvider.getProvider()
    spyOn(goToDefinition, "getDefinitions").andCallFake(() => definitions)

    const suggestionForWord = await provider.getSuggestionForWord(editor, word, range)

    expect(suggestionForWord.range).toEqual(range)
    expect(typeof suggestionForWord.callback).toEqual("function")
  })

  it("getSuggestionForWord returns false if definition is unavailable", async () => {
    const provider = clickProvider.getProvider()
    spyOn(goToDefinition, "getDefinitions").andCallFake(() => null)

    const suggestionForWord = await provider.getSuggestionForWord(editor, word, range)

    expect(suggestionForWord).toEqual(false)
  })
})
