/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        // load the network configuration
        const ccpPath = path.resolve(__dirname,'..','..', '..', 'network', 'organizations', 'peerOrganizations', 'manufacturer.example.com', 'connection-manufacturer.json');
        let ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const identity = await wallet.get('appUser');
        if (!identity) {
            console.log('An identity for the user "appUser" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: 'appUser', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('fabjute');
        
        //create asset
        
        // await contract.submitTransaction('createAsset', 'Bale21');
        // console.log('Bale has been created');

        //sendAsset

        // let transactionObject = contract.createTransaction('SendAsset');
        // transactionObject.setTransient({deliveryId:"123MANINSBale21"});
        // await transactionObject.submit("Bale21")
        // console.log('Asset Dispatched');

        //transferResponsibility to inspectorMSP

        // await contract.submitTransaction('TransferResponsibility','Bale21','inspectorMSP');
        // console.log('Asset Responsibility Transfered');

        // receiveAsset

        // let transactionObject = contract.createTransaction('ReceiveAsset');
        // transactionObject.setTransient({deliveryId:"123INSMANBale21"});
        // await transactionObject.submit("Bale21")
        // console.log('Asset Recieved');

        // send Asset to buyer

        // let transactionObject = contract.createTransaction('SendAsset');
        // transactionObject.setTransient({deliveryId:"123MANBUYBale21"});
        // await transactionObject.submit("Bale21")
        // console.log('Asset Dispatched');
        

        //transferAsset to buyerMSP

        //await contract.submitTransaction('transferAsset','Bale21','buyerMSP');
        //console.log('Asset Transfered');


        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();
