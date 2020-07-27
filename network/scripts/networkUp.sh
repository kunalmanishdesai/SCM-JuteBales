export PATH=${pwd}/../bin:$PATH
export FABRIC_CFG_PATH=$(pwd)/configtx/

mkdir ./channel-artifacts/
configtxgen -profile ThreeOrgsOrdererGenesis -channelID system-channel -outputBlock ./system-genesis-block/genesis.block

docker-compose -f ./docker/docker-compose-test-net.yaml up -d