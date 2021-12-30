
const ADDR =  require( "./contractAddress.js");
const ABI= require( "./contractABI.js");
const express = require('express');
var Web3 = require ('web3');
var router = express.Router();
const EthereumTx = require('ethereumjs-tx').Transaction;
const bodyParser = require('body-parser');

var web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/1bbf1e4aba5a4bf29a11300f77ca496d'));

// var publicKey = '0xf67D9611204ca60dB6E6006643fb3cf0EdC8b3CA';

// var contractAddress =  "0xFa32465ddFC3628F8723fe7941F035a494bfbFf2";
// var contractAddress =  "0x2c7716bdf98e181df4cf1b40ad7648a40ee813b9";

const Contract = new web3.eth.Contract(ABI.abi, ADDR.contractAddress);
const RegisterContract = new web3.eth.Contract(ABI.tokenRegistery_ABI, ADDR.tokenRegistery_address);
const DepositManagerContract = new web3.eth.Contract(ABI.depositManager_ABI, ADDR.depositManager_address);
const NameRegistryContract = new web3.eth.Contract(ABI.nameRegistry_ABI, ADDR.nameRegistry_address);
// const MarkleUtilesContract = new web3.eth.Contract(ABI.merkleUtiles_ABI, merkleUtiles_address);
const LoggerContract = new web3.eth.Contract(ABI.logger_ABI, ADDR.logger_address);
// const GovernanceContract = new web3.eth.Contract(ABI.governance_ABI, governance_address);





// write Functions
// SlashAndRollback
router.post('/slash_rollback', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;
        var data = await Contract.methods.SlashAndRollback().encodeABI();
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            // console.log("hash", receipt.transactionHash)
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            // console.log("error", error)
            res.status(500).send(error)
        });
        
    } catch (error) {
        console.log(error)
    }
})
router.post('/submit_batch', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;
        var submitBatch = req.body.submitBatch;
        var txs = req.body.txs;
        var updatedRoot = req.body.updatedRoot;
        var batchType = req.body.batchType;
        var data = await Contract.methods.mint(txs,updatedRoot,batchType).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        submitBatch = web3.utils.fromWei(submitBatch, "ether");
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: submitBatch,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            // console.log("hash", receipt.transactionHash)
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            // console.log("error", error)
            res.status(500).send(error)
        });
    } catch (error) {
        console.log(error)
    }
})
//finaliseDepositsAndSubmitBatch
router.post('/finalise_deposits', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;
        var finaliseDepositsAndSubmitBatch = req.body.finaliseDepositsAndSubmitBatch;
        var subTreeDepth = req.body.subTreeDepth;
        var zero_account_mp = req.body.zero_account_mp;
        var data = await Contract.methods.finaliseDepositsAndSubmitBatch(subTreeDepth, zero_account_mp).encodeABI();
        var privateKey = Buffer.from(key, 'hex');
        finaliseDepositsAndSubmitBatch = web3.utils.fromWei(finaliseDepositsAndSubmitBatch, "ether");
        const txData = {
            gasPrice: web3.utils.toHex(42000000000),
            gasLimit: web3.utils.toHex(90000),
            to: contractAddress,
            from: fromAddress,
            value: finaliseDepositsAndSubmitBatch,
            nonce:  await web3.eth.getTransactionCount(fromAddress),
            data: data
        }

        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            // console.log("hash", receipt.transactionHash)
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            // console.log("error", error)
            res.status(500).send(error)
        });

    } catch (error) {
        console.log(error)
    }
})
//disputeBatch
router.post('/dispute_batch', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;
        var batch_id = req.body.batch_id;
        var txs = req.body.txs;
        var batchProofs = req.body.batchProofs;
        var data = await Contract.methods.disputeBatch(batch_id, txs, batchProofs).encodeABI();
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            // console.log("hash", receipt.transactionHash)
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            // console.log("error", error)
            res.status(500).send(error)
        });
            
        
    } catch (error) {
        console.log(error)
    }
})

//WithdrawStake
router.post('/withdraw_stake', async(req,res) =>{
    try {
        var key = req.body.key
        var fromAddress = req.body.from;
        var batch_id = req.body.batch_id;
        var data = await Contract.methods.WithdrawStake(batch_id).encodeABI();
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

        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
        tx.sign(privateKey);
        const serializedTx = tx.serialize()
        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
        .on('receipt', function(receipt){
            // console.log("hash", receipt.transactionHash)
            res.status(200).send( receipt.transactionHash);
        }).on('error', function(error){
            // console.log("error", error)
            res.status(500).send(error)
        });
            
        
    } catch (error) {
        console.log(error)
    }
})


//get funtions
router.get('/token_registry', async(req, res) =>{
    // console.log("hi", Contract.methods)
    try {
       
        var tokenRegistry = await Contract.methods.tokenRegistry().call();
        console.log(tokenRegistry)
        res.status(200).send(tokenRegistry.toString())
        
    } catch (error) {
        console.log(error)
    }
        
})
router.get('/num_of_batches_submitted', async(req, res) =>{
    try {
       
        var numOfBatchesSubmitted = await Contract.methods.numOfBatchesSubmitted().call();
        console.log(numOfBatchesSubmitted)
        res.status(200).send(numOfBatchesSubmitted.toString())
        
    } catch (error) {
        console.log(error)
    }
        
})

router.get('/name_registry', async(req, res) =>{
    try {
       
        var nameRegistry = await Contract.methods.nameRegistry().call();
        console.log(nameRegistry)
        res.status(200).send(nameRegistry.toString())
        
    } catch (error) {
        console.log(error)
    }
        
})

router.get('/merkle_utils', async(req, res) =>{
    try {
       
        var merkleUtils = await Contract.methods.merkleUtils().call();
        console.log(merkleUtils)
        res.status(200).send(merkleUtils.toString())
        
    } catch (error) {
        console.log(error)
    }
        
})

router.get('/logger', async(req, res) =>{
    try {
       
        var logger = await Contract.methods.logger().call();
        console.log(logger)
        res.status(200).send(logger.toString())
        
    } catch (error) {
        console.log(error)
    }
        
})

router.get('/invalid_batch_marker', async(req, res) =>{
    try {
       
        var invalidBatchMarker = await Contract.methods.invalidBatchMarker().call();
        console.log(invalidBatchMarker)
        res.status(200).send(invalidBatchMarker.toString())
        
    } catch (error) {
        console.log(error)
    }
        
})
//governance

router.get('/governance', async(req, res) =>{
    try {       
        var governance = await Contract.methods.governance().call();
        console.log(governance)
        res.status(200).send(governance.toString())
        
    } catch (error) {
        console.log(error)
    }
        
})

//getLatestBalanceTreeRoot
router.get('/get_latest_balance_tree_root', async(req, res) =>{
    try {       
        var getLatestBalanceTreeRoot = await Contract.methods.getLatestBalanceTreeRoot().call();
        console.log(getLatestBalanceTreeRoot)
        res.status(200).send(getLatestBalanceTreeRoot.toString())
        
    } catch (error) {
        console.log(error)
    }
        
})


//fraudProof
router.get('/fraud_proof', async(req, res) =>{
    try {       
        var fraudProof = await Contract.methods.fraudProof().call();
        console.log(fraudProof)
        res.status(200).send(fraudProof.toString())
        
    } catch (error) {
        console.log(error)
    }
        
})

//depositTree
router.get('/deposit_manager', async(req, res) =>{
    try {       
        var depositManager = await Contract.methods.depositManager().call();
        console.log(depositManager)
        res.status(200).send(depositManager.toString())
        
    } catch (error) {
        console.log(error)
    }
        
})

//accountsTree
router.get('/accounts_tree', async(req, res) =>{
    try {       
        var accountsTree = await Contract.methods.accountsTree().call();
        console.log(accountsTree)
        res.status(200).send(accountsTree.toString())
        
    } catch (error) {
        console.log(error)
    }
        
})

//ZERO_BYTES32
router.get('/zero_bytes32', async(req, res) =>{
    try {       
        var ZERO_BYTES32 = await Contract.methods.ZERO_BYTES32().call();
        console.log(ZERO_BYTES32)
        res.status(200).send(ZERO_BYTES32.toString())
        
    } catch (error) {
        console.log(error)
    }
        
})

//ApplyTx
router.post('/apply_tx', async(req, res) =>{
    try {
        var markelProof = req.body.markelProof;
        var txbytes = req.body.txbytes
        var ApplyTx = await Contract.methods.ApplyTx(markelProof,txbytes).call();
        console.log(ApplyTx)
        res.status(200).send(ApplyTx.toString())
        
    } catch (error) {
        console.log(error)
    }
        
})

//batches
router.post('/batches', async(req, res) =>{
    try {
        var inputs = req.body.inputs;
        var batches = await Contract.methods.ApplyTx(inputs).call();
        console.log(batches)
        res.status(200).send(batches.toString())
        
    } catch (error) {
        console.log(error)
    }
        
})

router.post('/get_batch', async(req, res) =>{
    try {
        var id = req.body.batchID;
        var getBatch = await Contract.methods.ApplyTx(id).call();
        console.log(getBatch)
        res.status(200).send(getBatch.toString())
        
    } catch (error) {
        console.log(error)
    }
        
})

router.post('/process_batch', async(req, res) =>{
    try {
        var initialStateRoot = req.body.initialStateRoot;
        var accountsRoot = req.body.accountsRoot;
        var txs = req.body.txs;
        var batchProofs = req.body.batchProofs;
        var expectedTxRoot = req.body.expectedTxRoot;
        var processBatch = await Contract.methods.processBatch(initialStateRoot,accountsRoot,txs,batchProofs, expectedTxRoot).call();
        console.log(processBatch)
        res.status(200).send(processBatch.toString())
        
    } catch (error) {
        console.log(error)
    }
        
})


router.post('/process_tx', async(req, res) =>{
    try {
        var balanceRoot = req.body.balanceRoot;
        var accountsRoot = req.body.accountsRoot;
        var sig = req.body.sig;
        var txBytes = req.body.txBytes;
        var from_pda_proof = req.body.from_pda_proof;
        var accountProofs = req.body.accountProofs;
        var processTx = await Contract.methods.processTx(balanceRoot,accountsRoot,sig,txBytes, from_pda_proof, accountProofs).call();
        console.log(processTx)
        res.status(200).send(processTx.toString())
        
    } catch (error) {
        console.log(error)
    }
        
})
router.get('/get_rollup_read', async(req,res)=>{
    console.log("hi")

    try {
        var tokenRegistry = await Contract.methods.tokenRegistry().call();
        var numOfBatchesSubmitted = await Contract.methods.numOfBatchesSubmitted().call();
        var nameRegistry = await Contract.methods.nameRegistry().call();
        var merkleUtils = await Contract.methods.merkleUtils().call();
        var logger = await Contract.methods.logger().call();
        var invalidBatchMarker = await Contract.methods.invalidBatchMarker().call();
        var governance = await Contract.methods.governance().call();
        var getLatestBalanceTreeRoot = await Contract.methods.getLatestBalanceTreeRoot().call();
        var fraudProof = await Contract.methods.fraudProof().call();
        var depositManager = await Contract.methods.depositManager().call();
        var accountsTree = await Contract.methods.accountsTree().call();
        var ZERO_BYTES32 = await Contract.methods.ZERO_BYTES32().call();

        // var markelProof = req.body.markelProof;
        // var txbytes = req.body.txbytes
        // var ApplyTx = "";
        // if(markelProof != "" && txbytes != ""){
        //     ApplyTx = await Contract.methods.ApplyTx(markelProof,txbytes).call();
        // }else{
        //     ApplyTx = "";
        // }
        
        // var inputs = req.body.inputs;
        // var batches;
        // if(inputs != ""){
        //     batches = await Contract.methods.ApplyTx(inputs).call();
        // }else{
        //     batches = "";
        // }

        // var initialStateRoot = req.body.initialStateRoot;
        // var accountsRoot = req.body.accountsRoot;
        // var txs = req.body.txs;
        // var batchProofs = req.body.batchProofs;
        // var expectedTxRoot = req.body.expectedTxRoot;
        // var processBatch; 
        // if(initialStateRoot!="" && accountsRoot!="" && txs !="" && batchProofs!="" && expectedTxRoot!=""){
        //     processBatch = await Contract.methods.processBatch(initialStateRoot,accountsRoot,txs,batchProofs, expectedTxRoot).call();
        // }else{
        //     processBatch = ""
        // }

        // var balanceRoot = req.body.balanceRoot;
        // var accountsRoot = req.body.accountsRoot;
        // var sig = req.body.sig;
        // var txBytes = req.body.txBytes;
        // var from_pda_proof = req.body.from_pda_proof;
        // var accountProofs = req.body.accountProofs;
        // var processTx;
        
        // if(balanceRoot!="" && accountsRoot !=""&& sig !=""&& txBytes !=""&& from_pda_proof !=""&&accountProofs != ""){
        //     processTx = await Contract.methods.processTx(balanceRoot,accountsRoot,sig,txBytes, from_pda_proof, accountProofs).call();
        // }else{
        //     processTx = "";
        // }


        sendGetResponse = {
            "tokenRegistry": tokenRegistry,
            "numOfBatchesSubmitted":numOfBatchesSubmitted,
            "nameRegistry": nameRegistry,
            "merkleUtils": merkleUtils,
            "logger":logger,
            "invalidBatchMarker":invalidBatchMarker,
            "governance": governance,
            "getLatestBalanceTreeRoot":getLatestBalanceTreeRoot,
            "fraudProof": fraudProof,
            "depositManager": depositManager,
            "accountsTree":accountsTree,
            "ZERO_BYTES32":ZERO_BYTES32,
            // "ApplyTx":ApplyTx,
            // "batches": batches,
            // "processBatch": processBatch,
            // "processTx": processTx

        }
        res.status(200).send(sendGetResponse)

    } catch (error) {
        res.send(error)
    }
})

//tokenRegister Contract

router.post('/request_token_registration', async(req,res) =>{
    try {
        console.log("hi")
        var key = req.body.key
        var fromAddress = req.body.from;
        var tokenContract= req.body.tokenContract;
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
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
        const tx = new EthereumTx(txData,  {chain:'mainnet', hardfork: 'petersburg'});
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
