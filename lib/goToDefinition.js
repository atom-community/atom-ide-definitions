'use babel';

async function goToDefinition(providerRegistry) {
  if (!providerRegistry) {
    return;
  }

  const editor = atom.workspace.getActiveTextEditor();
  const provider = providerRegistry.getProviderForEditor(editor);

  const position = editor.getCursorBufferPosition();
  const result = await provider.getDefinition(editor, position);

  if (!result) {
    atom.notifications.addError('Sorry, no definitions found.');
    return;
  }

  const { definitions } = result;

  if (!definitions || definitions.length === 0) {
    atom.notifications.addError('Sorry, no definitions found.');
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
}

export default goToDefinition;
