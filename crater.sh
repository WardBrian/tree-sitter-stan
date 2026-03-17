#!/bin/bash

set -xeo pipefail

find ~/Dev/ml/stanc3/test/integration/good/ -type f -name '*.stan' -exec tree-sitter parse {} \; > out 2>&1
notify-send "done"
grep "ERR" out
rm out
