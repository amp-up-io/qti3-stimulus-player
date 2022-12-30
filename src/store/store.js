import { PnpFactory } from '@/shared/helpers/PnpFactory'

export const store = {

  player: null,

  state: {
    item: null,
    itemBody: null,
    identifier: '',
    title: '',
    catalogs: []
  },

  itemContext: {
    guid: null,
    pnp: null
  },

  getCatalog (id) {
    return this.state.catalogs.find(c => c.id === id)
  },

  getCatalogs () {
    return this.state.catalogs
  },

  defineItemBody (itemBodyObject) {
    this.setItemBody(itemBodyObject.node)
  },

  defineCatalog (catalog) {
    let catalogIndex = this.state.catalogs.findIndex(c => c.id == catalog.id)

    if (catalogIndex < 0) {
        // New catalog
        this.state.catalogs.push(catalog)
        return
    }

    // Found the catalog. Replace the old with the new
    this.state.catalogs[catalogIndex] = catalog
  },

  resetAll () {
    this.state.item = null
    this.state.itemBody = null
    this.state.identifier = ''
    this.state.title = ''
    this.state.catalogs.splice(0, this.state.catalogs.length)

    // Reset itemContext
    this.itemContext.guid = null
    this.itemContext.state = null
    this.itemContext.validationMessages.splice(0, this.itemContext.validationMessages.length)
    // For now, do not reset pnp and sessionControl
    // this.itemContext.pnp = null
    // this.itemContext.sc = null
  },

  getItemContextGuid () {
    return this.itemContext.guid
  },

  setItemContextGuid (guid) {
    this.itemContext.guid = guid
  },

  initializeItemContextPnp () {
    this.itemContext.pnp = new PnpFactory()
  },

  getItemContextPnp () {
    return this.itemContext.pnp
  },

  setItemContextPnp (pnp) {
    // Should always be a PnpFactory in itemContext, but check anyway.
    if (this.itemContext.pnp === null) this.initializeItemContextPnp()
    this.itemContext.pnp.setPnp(pnp)
  },

  /**
   * @description Called when the Qti3Player is mounted.  Pass a copy
   * of itself in the playerNode parameter.
   * @param {Object} playerNode - object containing the player component (playerNode.player)
   */
  NotifyPlayerReady (playerNode) {
    this.player = playerNode.player
  },

  /**
   * @description This method should be called after the qti-assessment-item component
   * has been completely loaded and parsed.
   * @param {Object} itemNode - an object containing the qti-assessment-item component itself.
   * e.g., { item: (reference to qti-assessment-item component) }
   */
  NotifyItemReady (itemNode) {
    this.setItem(itemNode)
  }

}
