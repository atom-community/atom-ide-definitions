'use babel';

import { CompositeDisposable } from 'atom';

export default {
  subscriptions: null,
  provider: null,

  activate() {
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'atom-ide-go-to-definition:go-to-definition': () =>
          this.goToDefinition(),
      })
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  async goToDefinition() {
    if (!this.provider) {
      return;
    }

    const editor = atom.workspace.getActiveTextEditor();
    const position = editor.getCursorBufferPosition();
    const result = await this.provider.getDefinition(editor, position);

    if (!result) {
      console.log('No definitions found.');
      return;
    }

    const { definitions } = result;

    if (!definitions || definitions.length === 0) {
      console.log('No definitions found.');
      return;
    }

    const {
      path,
      position: { row, column },
    } = definitions[0];

    if (editor.getPath() === path) {
      const paneContainer = atom.workspace.paneContainerForItem(editor);
      paneContainer.activate();

      editor.setCursorBufferPosition([row, column]);
      editor.scrollToBufferPosition([row, column], { center: true });
    } else {
      await atom.workspace.open(path, {
        initialLine: row,
        initialColumn: column,
        searchAllPanes: true,
        activatePane: true,
        activateItem: true,
      });
    }
  },

  consumeDefinitionsService(provider) {
    this.provider = provider;
  },
};
