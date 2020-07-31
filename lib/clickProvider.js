"use babel"

import { goToDefinition, getDefinitions } from "./goToDefinition"

export class ClickProvider {
  constructor(options) {
    this.providerRegistry = options.providerRegistry

    this.suggestionForWordHandler = this.suggestionForWordHandler.bind(this)
    this.getProvider = this.getProvider.bind(this)
  }

  async suggestionForWordHandler(editor, text, range) {
    const { start: position } = range
    const definitions = await getDefinitions(this.providerRegistry, {
      editor,
      position,
    })
    const hasDefinitions = definitions && !!definitions[0]

    const suggestion = hasDefinitions
      ? {
          range,
          callback: () => goToDefinition(this.providerRegistry, { editor, definitions }),
        }
      : false

    return suggestion
  }

  getProvider() {
    const grammarScopes = atom.config.get("atom-ide-definitions.clickGrammarScopes")
    const priority = atom.config.get("atom-ide-definitions.clickPriority")

    return {
      priority,
      // Assign value only if at least one scope is available. Falsey triggers default behaviour, "apply to all".
      grammarScopes: (grammarScopes && !!grammarScopes[0] && grammarScopes) || null,
      getSuggestionForWord: this.suggestionForWordHandler,
    }
  }
}
