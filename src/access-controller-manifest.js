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

    const dag = await dagNode.read(ipfs, manifestHash, [])
    const data = JSON.parse(dag)
    const { type, params } = data.type ? data : { type: 'ipfs', params: { address: manifestHash} }
    return new AccessControllerManifest(type, params)
  }

  static async create (ipfs, type, params) {
    const manifest = {
      type: type,
      params: params
    }
    const buffer = Buffer.from(JSON.stringify(manifest))
    const dag = await ipfs.dag.put(buffer)
    return dag.toBaseEncodedString()
  }
}

module.exports = AccessControllerManifest
