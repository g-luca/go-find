import { acceptHMRUpdate, StateTree, StoreDefinition, _ActionsTree, _GettersTree } from "pinia"

/**
 * Register Pinia Store module to enable HMR
 * @param module Pinia Store module
 */
export function registerModuleHMR(module: StoreDefinition<string, StateTree, _GettersTree<StateTree>, _ActionsTree>) {
    console.log(`[HMR] registered store: ${module.$id}`)
    const hotReload = (import.meta as any).hot
    if (hotReload) {
        hotReload.accept(acceptHMRUpdate(module, hotReload))
    }
}