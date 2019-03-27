'use babel';

export class ClickProvider {
  constructor(options) {
    this.clickHandler = options.clickHandler;

    this.suggestionForWordHandler = this.suggestionForWordHandler.bind(this);
    this.getProvider = this.getProvider.bind(this);
  }

  suggestionForWordHandler(textEditor, text, range) {
    const targetValue = text && text.trim();
    if (!targetValue) return;

    return {
      range,
      callback: () => this.clickHandler(),
    };
  }

  getProvider() {
    const grammarScopes = atom.config.get(
      'atom-ide-definitions.clickGrammarScopes'
    );
    const priority = atom.config.get('atom-ide-definitions.clickPriority');

    return {
      priority,
      // Assign value only if at least one scope is available. Falsey triggers default behaviour, "apply to all".
      grammarScopes:
        (grammarScopes && !!grammarScopes[0] && grammarScopes) || null,
      getSuggestionForWord: this.suggestionForWordHandler,
    };
  }
}
