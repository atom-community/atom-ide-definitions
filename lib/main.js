'use babel';

import { CompositeDisposable } from 'atom';
import goToDefinition from './goToDefinition';
import createProviderRegistry from './providerRegistry';

function package() {
  const providerRegistry = createProviderRegistry();
  let subscriptions;

  function activate() {
    subscriptions = new CompositeDisposable();

    subscriptions.add(
      atom.commands.add('atom-workspace', {
        'atom-ide-go-to-definition:go-to-definition': () =>
          goToDefinition(providerRegistry),
      })
    );
  }

  function deactivate() {
    subscriptions.dispose();
  }

  function consumeDefinitionsService(provider) {
    providerRegistry.addProvider(provider);
  }

  return { activate, deactivate, consumeDefinitionsService };
}

export default package();
