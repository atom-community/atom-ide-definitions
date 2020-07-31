"use babel"

export async function goToDefinition(providerRegistry, { editor, definitions: knownDefinitions } = {}) {
  if (!editor) {
    return
  }

  const definitions = knownDefinitions || (await getDefinitions(providerRegistry, { editor }))

  if (!definitions || definitions.length === 0) {
    atom.notifications.addError("Sorry, no definitions found.")
    return
  }

  const {
    path,
    position: { row, column },
  } = definitions[0]

  if (editor.getPath() === path) {
    const paneContainer = atom.workspace.paneContainerForItem(editor)
    paneContainer.activate()

    editor.setCursorBufferPosition([row, column])
    editor.scrollToBufferPosition([row, column], { center: true })
  } else {
    await atom.workspace.open(path, {
      initialLine: row,
      initialColumn: column,
      searchAllPanes: true,
      activatePane: true,
      activateItem: true,
    })
  }
}

export async function getDefinitions(providerRegistry, { editor, position: targetPosition } = {}) {
  if (!providerRegistry || !editor) {
    return
  }

  const position = targetPosition || editor.getCursorBufferPosition()

  const provider = providerRegistry.getProviderForEditor(editor)
  if (!provider) {
    return
  }
  const result = await provider.getDefinition(editor, position)

  return result && result.definitions
}
