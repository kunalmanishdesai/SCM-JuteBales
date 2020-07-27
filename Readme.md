
Steps:<br><br>

    1) Go to network directory <br><br>

    2) Run ./scripts/networkUp.sh <br><br>

    3) To create channel transactions run ./scripts/createChannel channelName(mychannel)<br><br>

    4) Start 4 terminals : Orderer,Manufacturer,Buyer,Inspector<br><br>

    1] Orderer <br>
        a) Your working terminal can be Orderer <br>
        b) Run following command to check logs of orderer <br>
            docker container logs orderer.example.com --follow <br><br>
    
    2) Manufacturer <br>
        a) Run following commands(Setting environment variables for Manufacturer) <br><br>

            export ORDERER_CA=$(pwd)/organizations/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem <br>
            export PATH=$(pwd)/../bin:$PATH <br>
            export FABRIC_CFG_PATH=$(pwd)/../config/ <br>
            export CORE_PEER_TLS_ENABLED=true <br>
            export CORE_PEER_LOCALMSPID="ManufacturerMSP" <br>
            export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/manufacturer.example.com/peers/peer0.manufacturer.example.com/tls/ca.crt <br>
            export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/manufacturer.example.com/users/Admin@manufacturer.example.com/msp <br>
            export CORE_PEER_ADDRESS=localhost:7051 <br><br>

        b) Creatting channel <br><br>

            export ORDERER_CA=$(pwd)/organizations/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem
            
            peer channel create -o localhost:7050 -c mychannel -f ./channel-artifacts/mychannel.tx --outputBlock ./channel-artifacts/mychannel.block --tls --cafile $ORDERER_CA <br><br>

        c) Joining peer <br><br>

            peer channel join -b ./channel-artifacts/mychannel.block <br><br>

    3) Buyer <br>
        a)Run following commands(Setting environment variables for Buyer) <br><br>

            export ORDERER_CA=$(pwd)/organizations/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem <br>
            export PATH=$(pwd)/../bin:$PATH <br>
            export FABRIC_CFG_PATH=$(pwd)/../config/ <br>
            export CORE_PEER_TLS_ENABLED=true <br>
            export CORE_PEER_LOCALMSPID="BuyerMSP" <br>
            export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/buyer.example.com/peers/peer0.buyer.example.com/tls/ca.crt <br>
            export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/buyer.example.com/users/Admin@buyer.example.com/msp <br>
            export CORE_PEER_ADDRESS=localhost:9051 <br><br>
        
        b) Joining peer <br><br>

            peer channel join -b ./channel-artifacts/mychannel.block <br><br>
    
    4) Inspector <br>
        a)Run following commands(Setting environment variables for Inspector) <br><br>

            export ORDERER_CA=$(pwd)/organizations/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem <br>
            export PATH=$(pwd)/../bin:$PATH <br>
            export FABRIC_CFG_PATH=$(pwd)/../config/ <br>
            export CORE_PEER_TLS_ENABLED=true <br>
            export CORE_PEER_LOCALMSPID="InspectorMSP" <br>
            export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/inspector.example.com/peers/peer0.inspector.example.com/tls/ca.crt <br>
            export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/inspector.example.com/users/Admin@inspector.example.com/msp <br>
            export CORE_PEER_ADDRESS=localhost:11051 <br><br>

        b) Joining peer <br><br>

            peer channel join -b ./channel-artifacts/mychannel.block <br><br>

Close the network ./scripts/networkDown.sh 