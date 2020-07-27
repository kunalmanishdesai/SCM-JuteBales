
Steps:<br>
    1) Go to network directory

    2) Run ./scripts/networkUp.sh

    3) To create channel transactions run ./scripts/createChannel OrgName channelName(mychannel)

    4) Start 4 terminals : Orderer,Manufacturer,Buyer,Inspector

    1] Orderer 
        a) Your working terminal can be Orderer
        b) Run command docker container orderer.example.com --follow
    
    2) Manufacturer
        a) Run following commands(Setting environment variables for Manufacturer)

            export ORDERER_CA=$(pwd)/organizations/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem
            export PATH=$(pwd)/../bin:$PATH
            export FABRIC_CFG_PATH=$(pwd)/../config/
            export CORE_PEER_TLS_ENABLED=true
            export CORE_PEER_LOCALMSPID="ManufacturerMSP"
            export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/manufacturer.example.com/peers/peer0.manufacturer.example.com/tls/ca.crt
            export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/manufacturer.example.com/users/Admin@manufacturer.example.com/msp
            export CORE_PEER_ADDRESS=localhost:7051

        b) Creatting channel 

            export ORDERER_CA=$(pwd)/organizations/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem
            peer channel create -o localhost:7050 -c mychannel -f ./channel-artifacts/mychannel.tx --outputBlock ./channel-artifacts/mychannel.block --tls --cafile $ORDERER_CA

        c) Joining peer

            peer channel join -b ./channel-artifacts/mychannel.block

    3) Buyer
        a)Run following commands(Setting environment variables for Buyer)

            export ORDERER_CA=$(pwd)/organizations/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem
            export PATH=$(pwd)/../bin:$PATH
            export FABRIC_CFG_PATH=$(pwd)/../config/
            export CORE_PEER_TLS_ENABLED=true
            export CORE_PEER_LOCALMSPID="BuyerMSP"
            export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/buyer.example.com/peers/peer0.buyer.example.com/tls/ca.crt
            export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/buyer.example.com/users/Admin@buyer.example.com/msp
            export CORE_PEER_ADDRESS=localhost:9051
        
        b) Joining peer

            peer channel join -b ./channel-artifacts/mychannel.block
    
    4) Inspector
        a)Run following commands(Setting environment variables for Inspector)

            export ORDERER_CA=$(pwd)/organizations/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem
            export PATH=$(pwd)/../bin:$PATH
            export FABRIC_CFG_PATH=$(pwd)/../config/
            export CORE_PEER_TLS_ENABLED=true
            export CORE_PEER_LOCALMSPID="InspectorMSP"
            export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/inspector.example.com/peers/peer0.inspector.example.com/tls/ca.crt
            export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/inspector.example.com/users/Admin@inspector.example.com/msp
            export CORE_PEER_ADDRESS=localhost:11051

        b) Joining peer

            peer channel join -b ./channel-artifacts/mychannel.block