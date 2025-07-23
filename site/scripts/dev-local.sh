#!/bin/bash

# Script to run Docusaurus with GitBook docs converted on the fly
# This aligns with Phase 1 of the migration plan

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Use the shared convert-and-run script
exec bash "$SCRIPT_DIR/convert-and-run.sh" start