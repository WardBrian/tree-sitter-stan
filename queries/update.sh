#!/bin/bash

rm -f sf-*.scm
# strip out Stan-only queries for use in stanfunctions highlighting
find . -name '*.scm' -exec sh -c 'awk "/; BEGIN_STAN_ONLY/{found=1} !found{print} /; END_STAN_ONLY/{found=0}" $1 > sf-$(echo $1 | cut -d/ -f2)' shell {} \;
