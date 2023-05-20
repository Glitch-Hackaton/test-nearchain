/* Talking with a contract often involves transforming data, we recommend you to encapsulate that logic into a class */

import { utils } from 'near-api-js'

export class Contract {

  constructor({ contractId, walletToUse }) {
    this.contractId = contractId;
    this.wallet = walletToUse;
  }

  async addRecode(timeStamp, weather, emotion, emotionDetail, thanksDairy) {
    const data = {
      timeStamp : timeStamp,
      weather : weather,
      emotion : emotion,
      emotionDetail : emotionDetail,
      thanksDairy : thanksDairy
    }
    let response = await this.wallet.callMethod({ contractId: this.contractId, method: "addRecode", args : data})
    console.log("res:",response)
    return response
  }

  async getRecode(accountId, startDate, endDate) {
    const data = {
      accountId : accountId,
      startDate : startDate,
      endDate : endDate
    }
    const result = await this.wallet.viewMethod({ contractId: this.contractId, method: "getRecode", args: data})
    // 조건에 맞는 애들 필더링
    const res = [];
    for(let i = 0; i < result.length ; i++){
      const timeStamp = result[i][0];
      if(timeStamp >= startDate && timeStamp < endDate ) {
        res.push(result[i])
      }
    }

    // timestamp sorting
    res.sort(function(a, b) {
      return a[0] - b[0];
    });

    return res
  }

  async setDiary(diaryTypes) {
    console.log(diaryTypes)
    let response = await this.wallet.callMethod({ contractId: this.contractId, method: "setDiary", args : {diaryTypes: diaryTypes}})
    return response
  }

  async getDiary(accountId) {
    const result = await this.wallet.viewMethod({ contractId: this.contractId, method: "getDiary", args: accountId})
    return result
  }
}
