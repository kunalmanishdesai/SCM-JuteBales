docker-compose -f ./docker/docker-compose-test-net.yaml down --volumes --remove-orphans

rm -rf ./channel-artifacts/ ./system-genesis-block/