"use babel"

import { CompositeDisposable } from "atom"
import { goToDefinition } from "./goToDefinition"
import { ProviderRegistry } from "atom-ide-base/commons-atom/ProviderRegistry"
import { ClickProvider } from "./clickProvider"

const providerRegistry = new ProviderRegistry() // <DefinitionsProvider>
const clickProvider = new ClickProvider({
  providerRegistry,
})
const subscriptions = new CompositeDisposable()

export function activate() {
  subscriptions.add(
    atom.commands.add("atom-workspace", {
      "atom-ide-go-to-definition:go-to-definition": () => {
        const editor = atom.workspace.getActiveTextEditor()
        goToDefinition(providerRegistry, { editor })
      },
    })
  )
  require("atom-package-deps").install("atom-ide-definitions", true)
}

export function deactivate() {
  subscriptions.dispose()
}

export function consumeDefinitionsService(provider) {
  providerRegistry.addProvider(provider)
}

export function getClickProvider() {
  return clickProvider.getProvider()
}
