#!/usr/bin/env bash

set -eo pipefail

# Define variables
OUT=src/lib/proto
PROTO=proto
THIRD_PARTY=third_party
DESMOS_VERSION=0.16.3

## Download the Protobuf files
source scripts/get_proto.sh $PROTO $THIRD_PARTY $OUT $DESMOS_VERSION

PROTOC="protoc --ts_proto_opt=esModuleInterop=true,outputClientImpl=grpc-web --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=$OUT -I ./$THIRD_PARTY/proto"


# Generate the third party Protobuf implementations
proto_dirs=$(find "$THIRD_PARTY/proto" -path -prune -o -name '*.proto' -print0 | xargs -0 -n1 dirname | sort | uniq)
for dir in $proto_dirs; do
  $PROTOC --proto_path $THIRD_PARTY/proto $(find "${dir}" -maxdepth 1 -name '*.proto')
done


# Generate the Desmos Protobuf implementation
proto_dirs=$(find "$PROTO" -path -prune -o -name '*.proto' -print0 | xargs -0 -n1 dirname | sort | uniq)

for dir in $proto_dirs; do
  $PROTOC -I $PROTO  $(find "${dir}" -maxdepth 1 -name '*.proto')
done