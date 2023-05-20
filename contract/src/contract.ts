import {NearBindgen, near, call, view, initialize, UnorderedMap, Vector} from 'near-sdk-js'

import { assert } from './utils'
import { Record, Diary } from './model'

@NearBindgen({})
class DonationContract {
    beneficiary: string = "v1.faucet.nonofficial.testnet";
    records = new UnorderedMap<UnorderedMap<Record>>('records');

    diaryInfo = new UnorderedMap<Diary>('diary');

    @initialize({ privateFunction: true })
    init({ beneficiary }: { beneficiary: string }) {
        this.beneficiary = beneficiary
    }

    @call({ payableFunction: true })
    addRecode({ timeStamp, weather, emotion, emotionDetail, thanksDairy }
                  : { timeStamp: number, weather: string, emotion: string, emotionDetail: string, thanksDairy: string[] }) {
        const user = near.predecessorAccountId();
        const innerMap = this.records.get(user, {
            reconstructor: UnorderedMap.reconstruct,
            defaultValue: new UnorderedMap<Record>("record"),
        });
        innerMap.set( String(timeStamp), {
            weather: weather,
            emotion: emotion,
            emotionDetail: emotionDetail,
            thanksDairy: thanksDairy
        });
        this.records.set(user, innerMap);
    }

    @view([])
    getRecode({ accountId, startDate, endDate }: {accountId : string, startDate : number, endDate: number}) {
        const innerMap = this.records.get(accountId, {
            reconstructor: UnorderedMap.reconstruct,
        });

        if (innerMap === null) {
            return null;
        }
        // const newMap = []
        // for (let i = 0; i < innerMap.keys.length; i++) {
        //     if (innerMap.keys[i] >= startDate && innerMap.keys[i] < endDate) {
        //         newMap.push(innerMap.keys[i], innerMap.values[i]);
        //     }
        // }
        // return innerMap.keys;
        const newMap = new Map();
        for (let i = 0; i < innerMap._keys.length; i++) {
            if (parseInt(innerMap._keys[i]) >= startDate && parseInt(innerMap._keys[i]) < endDate) {
                newMap.set(
                    innerMap._keys[i],
                    innerMap.get(innerMap._keys[i])
                );
            }
        }
        return innerMap.toArray();
    }
    @call({ payableFunction: true })
    setDiary({diaryTypes}: {diaryTypes: string[]}) {
        const user = near.predecessorAccountId();
        this.diaryInfo.set(user, {diary : diaryTypes});
    }

    @view({})
    getDiary({accountId}: {accountId:string}) {
        return this.diaryInfo.toArray();
    }
}
