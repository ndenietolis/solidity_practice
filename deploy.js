var Web3 = require('web3');
var solc = require('solc');
var fs = require('fs');

// connect to the Ganache node
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
// read Solidity source code
var sourceCode = fs.readFileSync('Hello.sol', 'utf-8').toString()
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
var compiled = solc.compile(JSON.stringify(compilerInput))
var compilerOutput = JSON.parse(compiled)
// extract ABI and EVM from output
var abi = compilerOutput.contracts.contract.Hello.abi
var bytecode = compilerOutput.contracts.contract.Hello.evm.bytecode.object
// prepare Contract wrapper and "deploy" transaction, estimate cost for deployment
var helloWorldContract = new web3.eth.Contract(abi);
var helloWorldDeployTx = helloWorldContract.deploy({data: bytecode});
helloWorldDeployTx.estimateGas(function(err, gas){
    console.log("Estimated gas for deployment: " + gas);
});
// deploy from the given account, using up to the given gas amount
// print transaction hash and new contract instance address
helloWorldDeployTx.send({from: '0xEC35B21f97e61d7b72F2C1911faFc54CF1F81322', gas: 1000000})
.on('error', function(error){
    console.log("Error: " + error);
})
.on('transactionHash', function(transactionHash){
    console.log("Deployment txn: " + transactionHash)
})
.on('receipt', function(receipt){
   console.log("New contract address: " + receipt.contractAddress)
});