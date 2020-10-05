"use babel"

import { CompositeDisposable } from "atom"
import { install as installPackageDependencies } from "atom-package-deps"
import { goToDefinition } from "./goToDefinition"
import { ProviderRegistry } from "atom-ide-base/commons-atom/ProviderRegistry"
import { ClickProvider } from "./clickProvider"

const providerRegistry = new ProviderRegistry() // <DefinitionsProvider>
const clickProvider = new ClickProvider({
  providerRegistry,
})
let subscriptions

export function activate() {
  subscriptions = new CompositeDisposable()

  subscriptions.add(
    atom.commands.add("atom-workspace", {
      "atom-ide-go-to-definition:go-to-definition": () => {
        const editor = atom.workspace.getActiveTextEditor()
        goToDefinition(providerRegistry, { editor })
      },
    })
  )

  installPackageDependencies("atom-ide-definitions", false)
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
