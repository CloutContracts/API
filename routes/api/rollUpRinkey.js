
const ADDR =  require( "./contractAddress.js");
const ABI= require( "./contractABI.js");
const express = require('express');
var Web3 = require ('web3');
var router = express.Router();
const EthereumTx = require('ethereumjs-tx').Transaction;
const bodyParser = require('body-parser');

var web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/1bbf1e4aba5a4bf29a11300f77ca496d'));

const RegisterContract = new web3.eth.Contract(ABI.tokenRegistery_ABI, ADDR.tokenRegistery_address);
const DepositManagerContract = new web3.eth.Contract(ABI.depositManager_ABI, ADDR.depositManager_address);
const NameRegistryContract = new web3.eth.Contract(ABI.nameRegistry_ABI, ADDR.nameRegistry_address);
// const MarkleUtilesContract = new web3.eth.Contract(ABI.merkleUtiles_ABI, merkleUtiles_address);
const LoggerContract = new web3.eth.Contract(ABI.logger_ABI, ADDR.logger_address);
// const GovernanceContract = new web3.eth.Contract(ABI.governance_ABI, governance_address);





//tokenRegister Contract

router.post('/request_token_registration', async(req,res) =>{
    try {
        console.log("hi")
        var key = req.body.key
        var fromAddress = req.body.from;
        var tokenrinkeby= req.body.tokenContract;
        var data = await RegisterContract.methods.requestTokenRegistration(tokenContract).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        const txData = {
            gasPrice: web3.utils.toHex(40000000000),
            gasLimit: web3.utils.toHex(6000000),
            to: contractAddress,
            from: fromAddress,
            value: 0x0,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'rinkeby', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            console.log("hi hash",receipt.transactionHash)
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            console.log("errp", error)
            res.status(500).send(error)
        });
    } catch (error) {
        
    }
})

router.post('/finalise_token_registration', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;
        var tokenContract = req.body.tokenContract;
        var data = await RegisterContract.methods.finaliseTokenRegistration(tokenContract).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: 0x0,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'rinkeby', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            res.status(500).send(error)
        });
    } catch (error) {
        console.log(error)
    }
})


// Name Registert
router.post('/register_name', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;
        var name = req.body.name;
        var addr = req.body.addr;
        var data = await NameRegistryContract.methods.registerName(name,addr).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: 0x0,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'rinkeby', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            res.status(500).send(error)
        });
    } catch (error) {
        console.log(error)
    }
})
router.post('/update_contract_details', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;
        var name = req.body.name;
        var addr = req.body.addr;
        var data = await NameRegistryContract.methods.updateContractDetails(name,addr).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: 0x0,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'rinkeby', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            res.status(500).send(error)
        });
    } catch (error) {
        console.log(error)
    }
})

//DepositManger
router.post('/deposit', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;
        var _amount = req.body._amount;
        var _tokenType = req.body._tokenType;
        var _pubkey = req.body._pubkey;
        var data = await DepositManagerContract.methods.deposit(_amount,_tokenType,_pubkey).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: 0x0,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'rinkeby', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            res.status(500).send(error)
        });
    } catch (error) {
        console.log(error)
    }
})

router.post('/deposit_for', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;
        var _destination = req.body._destination;
        var _amount = req.body._amount;
        var _tokenType = req.body._tokenType;
        var _pubkey = req.body._pubkey;
        var data = await DepositManagerContract.methods.depositFor(_destination,_amount,_tokenType,_pubkey).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: 0x0,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'rinkeby', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            res.status(500).send(error)
        });
    } catch (error) {
        console.log(error)
    }
})

router.post('/dequeue', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;
        
        var data = await DepositManagerContract.methods.dequeue().encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: 0x0,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'rinkeby', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            res.status(500).send(error)
        });
    } catch (error) {
        console.log(error)
    }
})

router.post('/enqueue', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;
        var newDepositSubtree = req.body.newDepositSubtree;
        
        var data = await DepositManagerContract.methods.enqueue(newDepositSubtree).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: 0x0,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'rinkeby', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            res.status(500).send(error)
        });
    } catch (error) {
        console.log(error)
    }
})

router.post('/finalise_deposits', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;
        var _subTreeDepth = req.body._subTreeDepth;
        var _zero_account_mp = req.body._zero_account_mp;
        var latestBalanceTree = req.body.latestBalanceTree;
        var data = await DepositManagerContract.methods.finaliseDeposits(_subTreeDepth,_zero_account_mp,latestBalanceTree).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: 0x0,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'rinkeby', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            res.status(500).send(error)
        });
    } catch (error) {
        console.log(error)
    }
})

// logger contract
router.post('/log_batch_rollback', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;

        var batch_id = req.body.batch_id;
        var committer = req.body.committer;
        var stateRoot = req.body.stateRoot;
        var txRoot = req.body.txRoot;
        var stakeSlashed = req.body.stakeSlashed;
        var data = await LoggerContract.methods.logBatchRollback(batch_id,committer,stateRoot,txRoot,stakeSlashed).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: 0x0,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'rinkeby', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            res.status(500).send(error)
        });
    } catch (error) {
        console.log(error)
    }
})

router.post('/log_deposit_finalised', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;

        var depositSubTreeRoot = req.body.depositSubTreeRoot;
        var pathToSubTree = req.body.pathToSubTree;
        var data = await LoggerContract.methods.logDepositFinalised(depositSubTreeRoot,pathToSubTree).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: 0x0,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'rinkeby', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            res.status(500).send(error)
        });
    } catch (error) {
        console.log(error)
    }
})

router.post('/log_deposit_leaf', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;
        
        var left = req.body.left;
        var right = req.body.right;
        var newRoot = req.body.newRoot;

        var data = await LoggerContract.methods.logDepositLeafMerged(left,right,newRoot).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: 0x0,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'rinkeby', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            res.status(500).send(error)
        });
    } catch (error) {
        console.log(error)
    }
})

router.post('/log_deposit_queued', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;

        var accountID = req.body.accountID;
        var pubkey = req.body.pubkey;
        var dataa = req.body.data;
        
        var data = await LoggerContract.methods.logDepositQueued(accountID,pubkey,dataa).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: 0x0,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'rinkeby', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            res.status(500).send(error)
        });
    } catch (error) {
        console.log(error)
    }
})

router.post('/log_deposit_subtree', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;

        var root = req.body.root;
       
        var data = await LoggerContract.methods.logDepositSubTreeReady(root).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: 0x0,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'rinkeby', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            res.status(500).send(error)
        });
    } catch (error) {
        console.log(error)
    }
})

router.post('/log_new_batch', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;

        var committer = req.body.committer;
        var txroot = req.body.txroot;
        var updatedRoot = req.body.updatedRoot;
        var index = req.body.index;
        var batchType = req.body.batchType;
        var data = await LoggerContract.methods.logNewBatch(committer,txroot,updatedRoot,index,batchType).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: 0x0,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'rinkeby', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            res.status(500).send(error)
        });
    } catch (error) {
        console.log(error)
    }
})

router.post('/log_new_pubkey', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;

        var accountID = req.body.accountID;
        var pubkey = req.body.pubkey;

        var data = await LoggerContract.methods.logNewPubkeyAdded(accountID,pubkey).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: 0x0,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'rinkeby', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            res.status(500).send(error)
        });
    } catch (error) {
        console.log(error)
    }
})

router.post('/log_registered_token', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;

        var tokenType = req.body.tokenType;
        var tokenContract = req.body.tokenContract;

        var data = await LoggerContract.methods.logRegisteredToken(tokenType,tokenContract).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: 0x0,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'rinkeby', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            res.status(500).send(error)
        });
    } catch (error) {
        console.log(error)
    }
})

router.post('/log_registration_request', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;

        var tokenContract = req.body.tokenContract;

        var data = await LoggerContract.methods.logRegistrationRequest(tokenContract).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: 0x0,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'rinkeby', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            res.status(500).send(error)
        });
    } catch (error) {
        console.log(error)
    }
})

router.post('/log_rollback_final', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;

        var totalBatchesSlashed = req.body.totalBatchesSlashed;

        var data = await LoggerContract.methods.logRollbackFinalisation(totalBatchesSlashed).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: 0x0,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'rinkeby', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            res.status(500).send(error)
        });
    } catch (error) {
        console.log(error)
    }
})

router.post('/log_stake_withdraw', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;

        var committed = req.body.committed;
        var amount = req.body.amount;
        var batch_id = req.body.batch_id;

        var data = await LoggerContract.methods.logStakeWithdraw(committed,amount,batch_id).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: 0x0,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'rinkeby', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            res.status(500).send(error)
        });
    } catch (error) {
        console.log(error)
    }
})



module.exports = router;




