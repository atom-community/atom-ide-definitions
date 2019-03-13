'use babel';

import { Disposable } from 'atom';

function providerRegistry() {
  let providers = [];

  function addProvider(provider) {
    const index = providers.findIndex(p => provider.priority > p.priority);
    if (index === -1) {
      providers.push(provider);
    } else {
      providers.splice(index, 0, provider);
    }

    return new Disposable(() => removeProvider(provider));
  }

  function removeProvider(provider) {
    const index = providers.indexOf(provider);
    if (index !== -1) {
      providers.splice(index, 1);
    }
  }

  function getProviderForEditor(editor) {
    const grammar = editor.getGrammar().scopeName;

    return providers.find(
      provider =>
        !provider.grammarScopes ||
        provider.grammarScopes.indexOf(grammar) !== -1
    );
  }

  return { addProvider, getProviderForEditor };
}

export default providerRegistry;
