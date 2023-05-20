import { NearBindgen, near, call, view, initialize, UnorderedMap } from 'near-sdk-js'

import { assert } from './utils'
import { Record, Diary } from './model'

@NearBindgen({})
class DonationContract {
    beneficiary: string = "v1.faucet.nonofficial.testnet";
    records = new UnorderedMap<Record>('r');

    @initialize({ privateFunction: true })
    init({ beneficiary }: { beneficiary: string }) {
        this.beneficiary = beneficiary
    }

    @call({ payableFunction: true })
    addRecode({ timeStamp = 0, data = "" }: { timeStamp: number, data: string }) {
        const user = near.predecessorAccountId();
        this.records.set(user, { timeStamp: timeStamp, data: data });
    }

    @view({})
    getRecode(): Record {
        const user = near.predecessorAccountId();
        return this.records.get(user);
    }

}
