'use strict'
const { dagNode } = require('./utils')
class AccessControllerManifest {
  constructor (type, params = {}) {
    this.type = type
    this.params = params
  }

  static async resolve (ipfs, manifestHash) {
    // TODO: ensure this is a valid multihash
    if (manifestHash.indexOf('/ipfs') === 0) { manifestHash = manifestHash.split('/')[2] }

    const data = await dagNode.read(ipfs, manifestHash)
    const { type, params } = data.type ? data : { type: 'ipfs', params: { address: manifestHash } }
    return new AccessControllerManifest(type, params)
  }

  static async create (ipfs, type, params) {
    const manifest = {
      type: type,
      params: params
    }
    return dagNode.write(ipfs, 'dag-cbor', manifest)
  }
}

module.exports = AccessControllerManifest
