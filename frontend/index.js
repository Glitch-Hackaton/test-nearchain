import 'regenerator-runtime/runtime'
import { Contract } from './near-interface';
import { Wallet } from './near-wallet'

// When creating the wallet you can choose to create an access key, so the user
// can skip signing non-payable methods when interacting with the contract
const wallet = new Wallet({ createAccessKeyFor: "dev-1684566412371-16245245725402" })
console.log(wallet)
// Abstract the logic of interacting with the contract to simplify your project
const contract = new Contract({
  contractId: `dev-1684566412371-16245245725402`,
  walletToUse: wallet,
});

// Setup on page load
window.onload = async () => {
  const isSignedIn = await wallet.startUp();

  if (isSignedIn){
    signedInFlow()
  }else{
    signedOutFlow()
  }

}

// On submit, get the greeting and send it to the contract
document.querySelector('form').onsubmit = async (event) => {
  event.preventDefault()

  // get elements from the form using their id attribute
  const { fieldset, donation } = event.target.elements

  // disable the form while the value gets updated on-chain
  fieldset.disabled = true

  try {
    await contract.donate(donation.value)
  } catch (e) {
    alert(
      'Something went wrong! ' +
      'Maybe you need to sign out and back in? ' +
      'Check your browser console for more info.'
    )
    throw e
  }

  // re-enable the form, whether the call succeeded or failed
  fieldset.disabled = false
}

document.querySelector('#sign-in-button').onclick = () => { wallet.signIn() }
document.querySelector('#sign-out-button').onclick = () => { wallet.signOut() }


// Display the signed-out-flow container
function signedOutFlow() {
  document.querySelector('.signed-out-flow').style.display = 'block'
}

async function signedInFlow() {
  // Displaying the signed in flow container
  document.querySelectorAll('.signed-in-flow').forEach(elem => elem.style.display = 'block')

  // Check if there is a transaction hash in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const txhash = urlParams.get("transactionHashes")

  if(txhash !== null){
    // Get result from the transaction
    // let result = await contract.getDonationFromTransaction(txhash)
    document.querySelector('[data-behavior=donation-so-far]').innerText = result

    // show notification
    document.querySelector('[data-behavior=notification]').style.display = 'block'

    // remove notification again after css animation completes
    setTimeout(() => {
      document.querySelector('[data-behavior=notification]').style.display = 'none'
    }, 11000)
  }

}


window.addRecord = async function(){
  const timeStamp = "1233";
  const weather = "sunny";
  const emotion = "happy";
  const emotionDetail = "mad happy";
  const thanksDairy = ["a","b","c"]
  try {
    const result = await contract.addRecode( timeStamp, weather, emotion, emotionDetail, thanksDairy)
    console.log("결과")
    console.log(result)
  } catch (e) {
    console.error(e)
    alert(
        'Something went wrong! ' +
        'Maybe you need to sign out and back in? ' +
        'Check your browser console for more info.'
    )
    throw e
  }
}

window.getRecode = async function(){
  const accountId = wallet.accountId;
  const startDate = 1233
  const endDate = 1234
  try{
    const result = await contract.getRecode(accountId, startDate, endDate);

    console.log(result)
  }catch (e){
    console.log(e)
  }
}


window.setDiary = async function(){
  const diaryTypes = ["감사","3줄","날씨"]
  try {
    const result = await contract.setDiary(diaryTypes)
    console.log(result)
  } catch (e) {
    console.error(e)
    alert(
        'Something went wrong! ' +
        'Maybe you need to sign out and back in? ' +
        'Check your browser console for more info.'
    )
    throw e
  }
}

window.getDiary = async function(){
  const id = wallet.accountId;
  console.log(id)
  try {
    const result = await contract.getDiary(id);
    console.log(result)
  }catch (e){
    console.log(e)
  }
}
