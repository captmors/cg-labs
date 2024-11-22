#!/bin/bash

# Required environment variables:
# PID_FILE - Path to file storing process IDs

###############################################################################
# Safely terminates a process with a given PID
# Arguments:
#   $1 - Process ID to kill
#   $2 - Process name for logging
# Returns:
#   None
# Example:
#   kill_process "1234" "uvicorn"
###############################################################################
kill_process() {
    local pid="$1"
    local name="$2"
    
    if [ -z "$pid" ]; then
        return
    fi

    if kill -0 "$pid" 2>/dev/null; then
        echo "Stopping $name (PID: $pid)..."
        kill -TERM "$pid" 2>/dev/null
        sleep 3
        if kill -0 "$pid" 2>/dev/null; then
            echo "Forcefully killing $name (PID: $pid)"
            kill -KILL "$pid" 2>/dev/null
        fi
    fi
}

###############################################################################
# Starts a process and logs its PID
# Required environment variables:
#   PID_FILE - Path to file storing process IDs
# Arguments:
#   $1 - Command to execute
#   $2 - Log file path
#   $3 - Process name for logging
#   $4 - (Optional) Remove ANSI color codes from output (true/false)
# Returns:
#   None
# Example:
#   start_process "yarn dev" "./logs/dev.log" "dev_server" true
###############################################################################
start_process() {
    local command="$1"
    local log_file="$2"
    local name="$3"
    local remove_colors="${4:-false}"

    if [ -z "$PID_FILE" ]; then
        echo "Error: PID_FILE environment variable must be set"
        exit 1
    fi

    # By default Vite output colored logs with chalk
    # It might be an ASCII decoding problem so just truncate color
    if [ -n "$log_file" ]; then
        if [ "$remove_colors" = true ]; then
            $command 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | tee "$log_file" &
        else
            $command 2>&1 | tee "$log_file" &
        fi
    else
        if [ "$remove_colors" = true ]; then
            $command 2>&1 | sed 's/\x1b\[[0-9;]*m//g' &
        else
            $command &
        fi
    fi

    local pid=$!
    echo "$pid $name" >> "$PID_FILE"

    echo "Started $name (PID: $pid)"
}

###############################################################################
# Cleanup function to stop all running processes
# Required environment variables:
#   PID_FILE - Path to file storing process IDs
# Arguments:
#   None
# Returns:
#   0 on success, terminates script execution
# Example:
#   trap cleanup SIGINT SIGTERM EXIT
###############################################################################
cleanup() {
    echo "Killing all processes..."

    if [ -z "$PID_FILE" ]; then
        echo "Error: PID_FILxE environment variable must be set"
        exit 1
    fi

    if [ -f "$PID_FILE" ]; then
        while IFS= read -r line || [[ -n "$line" ]]; do
            pid=$(echo "$line" | cut -d' ' -f1)
            name=$(echo "$line" | cut -d' ' -f2-)
            kill_process "$pid" "$name"
        done < "$PID_FILE"

        : > "$PID_FILE"
    fi

    taskkill //F //T //PID $$ 2>/dev/null || true
    echo "All processes are dead."
    read
}