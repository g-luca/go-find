#!/usr/bin/env bash

set -eo pipefail

BUILD=.build
rm -r -f $BUILD
mkdir -p $BUILD

PROTO=$1
rm -r -f "$PROTO"
mkdir -p "$PROTO"

THIRD_PARTY=$2
rm -r -f "$THIRD_PARTY"
mkdir -p "$THIRD_PARTY"

OUT=$3
rm -r -f "$OUT"
mkdir -p "$OUT"

DESMOS_VERSION=$4

# Download the Desmos Protobuf files
DESMOS_ZIP="$BUILD/desmos.zip"
wget -O "$DESMOS_ZIP" "https://github.com/desmos-labs/desmos/archive/v$DESMOS_VERSION.zip"
unzip "$DESMOS_ZIP" -d "$BUILD/" && rm "$DESMOS_ZIP"
DESMOS="$BUILD/desmos-$DESMOS_VERSION"

PROTO_DESMOS=$PROTO/desmos
mkdir -p "$PROTO_DESMOS"
mv -f "$DESMOS/proto/desmos"/* "$PROTO_DESMOS"

mkdir -p "$THIRD_PARTY"
mv -f "$DESMOS/third_party"/* "$THIRD_PARTY"

# Get the missing Protobuf types files
PROTO_PROTOBUF=$THIRD_PARTY/proto/google/protobuf
PROTOBUF_LINK=https://raw.githubusercontent.com/protocolbuffers/protobuf/master/src/google/protobuf
curl "$PROTOBUF_LINK/timestamp.proto" > "$PROTO_PROTOBUF/timestamp.proto"
curl "$PROTOBUF_LINK/duration.proto" > "$PROTO_PROTOBUF/duration.proto"

# Delete unnecessary folders
rm -rf "$DESMOS" "$BUILD"
