'use babel';

import { CompositeDisposable } from 'atom';
import { install as installPackageDependencies } from 'atom-package-deps';
import goToDefinition from './goToDefinition';
import createProviderRegistry from './providerRegistry';
import { ClickProvider } from './clickProvider';

function package() {
  const providerRegistry = createProviderRegistry();
  const clickProvider = new ClickProvider({
    clickHandler: () => goToDefinition(providerRegistry),
  });
  let subscriptions;

  function activate() {
    subscriptions = new CompositeDisposable();

    subscriptions.add(
      atom.commands.add('atom-workspace', {
        'atom-ide-go-to-definition:go-to-definition': () =>
          goToDefinition(providerRegistry),
      })
    );

    installPackageDependencies('atom-ide-definitions');
  }

  function deactivate() {
    subscriptions.dispose();
  }

  function consumeDefinitionsService(provider) {
    providerRegistry.addProvider(provider);
  }

  return {
    activate,
    deactivate,
    consumeDefinitionsService,
    getClickProvider: clickProvider.getProvider,
  };
}

export default package();
