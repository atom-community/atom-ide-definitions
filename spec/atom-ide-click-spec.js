'use babel';

import { ClickProvider } from '../lib/clickProvider';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

let clickProvider;
const clickHandlers = {
  goToDefinitions: () => {},
};

describe('AtomIdeClick', () => {
  beforeEach(function() {
    spyOn(atom.config, 'get').andCallFake(function(value) {
      const config = {
        'atom-ide-definitions.clickGrammarScopes': [],
        'atom-ide-definitions.clickPriority': 0,
      };
      return config[value];
    });

    spyOn(clickHandlers, 'goToDefinitions');

    clickProvider = new ClickProvider({
      clickHandler: clickHandlers.goToDefinitions,
    });
  });

  it('verify provider result', () => {
    const provider = clickProvider.getProvider();

    expect(provider.priority).toEqual(0);
    expect(provider.grammarScopes).toBeNull();
    expect(typeof provider.getSuggestionForWord).toEqual('function');
  });

  it('verify suggestionForWord result', () => {
    const suggestionForWord = clickProvider.suggestionForWordHandler(
      'FakeEditor',
      'FakeText',
      'FakeRange'
    );

    expect(suggestionForWord.range).toEqual('FakeRange');
    expect(typeof suggestionForWord.callback).toEqual('function');
  });

  it('verify suggestionForWord handler stops if there is no text value', () => {
    const suggestionForWord = clickProvider.suggestionForWordHandler(
      'FakeEditor',
      '',
      'FakeRange'
    );

    expect(suggestionForWord).toBeUndefined();
  });

  it('verify suggestionForWord callback assignment', () => {
    const suggestionForWord = clickProvider.suggestionForWordHandler(
      'FakeEditor',
      'FakeText',
      'FakeRange'
    );

    expect(typeof suggestionForWord.callback).toEqual('function');

    suggestionForWord.callback();
    expect(clickHandlers.goToDefinitions).toHaveBeenCalled();
  });
});
