/* Talking with a contract often involves transforming data, we recommend you to encapsulate that logic into a class */

import { utils } from 'near-api-js'

export class Contract {

  constructor({ contractId, walletToUse }) {
    this.contractId = contractId;
    this.wallet = walletToUse;
  }

  async addRecode(timeStamp, data) {
    data = {
      timeStamp : timeStamp,
      data : data
    }
    let response = await this.wallet.callMethod({ contractId: this.contractId, method: "addRecode", data})
    console.log(response)
    return response
  }

  async getRecode() {
    const result = await this.wallet.callMethod({ contractId: this.contractId, method: "getRecode"})
    console.log(result)
    return result
  }
}
