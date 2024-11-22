#!/bin/bash

# (!) Works on Windows 
# (!) Terminate via Ctrl+C in cmd. 
#     If forget => kill python/node processes via ./scripts/kill.bat

###############################################################################
# Desc: 
# - Manage running services 
# - And some routine on closing processes on Windows (might be erased) 
#
# Services:
# - Minio storage
# - Python backend (Uvicorn)
# - Frontend (Vite + Electron)
#
# Usage:
#   ./run.sh
#
# Requirements:
#   - Docker and docker-compose installed
#   - Node.js and yarn installed
#   - Python with uvicorn installed
# 
# Defaulted Environment Variables:
#   BASE_DIR - Base directory path
#   PID_FILE - Path to file storing process IDs
#   LOGS_DIR - Directory for log files
###############################################################################

###############################################################################
# Initializes the environment by setting up required directories and files
# Arguments:
#   None
# Returns:
#   None
# Sets environment variables:
#   BASE_DIR, PID_FILE, LOGS_DIR
###############################################################################
init_environment() {
    BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    export PID_FILE="${BASE_DIR}/tmp/.pids"
    export LOGS_DIR="${BASE_DIR}/logs/run"

    echo "Base directory is: $BASE_DIR"

    mkdir -p "${BASE_DIR}/tmp"
    mkdir -p "${LOGS_DIR}"
    touch "$PID_FILE"
}

# Initialize environment
init_environment

# Import helper functions
source "./scripts/proc.sh"

# Error handler
error_handler() {
    local exit_code=$?
    echo "==============================================="
    echo "Error: Script exited with code $exit_code at $(date)"
    echo "Location: ${BASH_SOURCE[1]}:${BASH_LINENO[0]}"
    echo "Command: ${BASH_COMMAND}"
    echo "==============================================="
    echo "Last 20 lines of relevant logs:"
    
    # Show recent logs from all services
    for log in "${LOGS_DIR}"/*.log; do
        if [ -f "$log" ]; then
            echo "=== $(basename "$log") ==="
            tail -n 20 "$log"
            echo
        fi
    done
    
    cleanup
    read
}

# Set up trap handlers
trap error_handler ERR
trap cleanup SIGINT SIGTERM EXIT

# Start services
echo "Starting Minio storage"
docker-compose -f "${BASE_DIR}/docker-compose.yml" up -d minio

echo "Starting Python backend with Uvicorn"
cd "${BASE_DIR}/back" || exit
start_process \
    "uvicorn main:app --reload --host 0.0.0.0 --port 8000" \
    "${LOGS_DIR}/uvicorn.log" \
    "uvicorn"
cd "${BASE_DIR}" || exit

echo "Starting Vite and Electron"
cd "${BASE_DIR}/front" || exit
start_process \
    "yarn dev" \
    "${LOGS_DIR}/vite_electron.log" \
    "vite_electron" \
    true
cd "${BASE_DIR}" || exit

echo "All services started. Press Ctrl+C to stop all processes."

wait