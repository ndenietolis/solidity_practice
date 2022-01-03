var Web3 = require('web3');
var solc = require('solc');
var fs = require('fs');

// connect to the Ganache node
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
// read Solidity source code
var sourceCode = fs.readFileSync('Hello.sol', 'utf-8').toString();
// prepare compiler input JSON
var compilerInput = {
  language: 'Solidity',
  sources: {
    contract: {
      content: sourceCode
    }
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*']
      }
    }
  }
}
// compile and get output JSON
var compiled = solc.compile(JSON.stringify(compilerInput));
var compilerOutput = JSON.parse(compiled);
// extract ABI from output
var abi = compilerOutput.contracts.contract.Hello.abi;

// create Hello contract instance
var helloInstance = new web3.eth.Contract(abi, '0xREPLACE_ME_WITH_CONTRACT_ADDRESS');
// call the getter
helloInstance.methods.getMessage().call().then( function(result) {
    console.log("Current contract message: " + result);
});
// estimate gas and update the message
var newMessage = "Hello " + Math.floor(Math.random() * 1000);
helloInstance.methods.setMessage(newMessage).estimateGas( function(error, gasAmount){
    console.log('Estimated gas for call:' + gasAmount);
});
helloInstance.methods.setMessage(newMessage).send({from: '0xREPLACE_ME_WITH_ACCOUNT'})
.on('error', function(error) {
    console.log("Error: " + error);
})
.on('transactionHash', function(hash){
    console.log("Txn hash: " + hash);
})
.on('receipt', function(receipt){
    console.log("Updated message.");

    // call the getter again
    helloInstance.methods.getMessage().call().then( function(result) {
        console.log("New contract message: " + result);
    });
})
