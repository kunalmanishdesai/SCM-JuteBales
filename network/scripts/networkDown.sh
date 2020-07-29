docker-compose -f ./docker/docker-compose-ca.yaml -f ./docker/docker-compose-couch.yaml -f ./docker/docker-compose-test-net.yaml down --volumes --remove-orphans

rm -rf ./organizations/peerOrganizations/ ./organizations/ordererOrganizations/

rm -rf ./organizations/fabric-ca/buyer ./organizations/fabric-ca/*

rm -rf ./channel-artifacts/ ./system-genesis-block/ fabcar.tar.gz

pushd ../app
    rm -rf app/buyer/javascript/wallet/* app/manufacturer/javascript/wallet/* app/inspector/javascript/wallet/*
popd 

cp -ar ./organizations/backup/. ./organizations/fabric-ca/