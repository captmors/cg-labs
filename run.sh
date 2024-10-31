#!/bin/bash

# (!) Выходить через Ctrl+C

# Директории и файлы
base_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
pid_file="${base_dir}/tmp/.pids"
logs_dir="${base_dir}/../logs/run"

# Создание необходимых директорий
mkdir -p "${base_dir}/tmp"
mkdir -p "${logs_dir}"
touch "$pid_file"

# Функция для безопасного убийства процессов
kill_process() {
    local pid="$1"
    local name="$2"
    
    if [ -z "$pid" ]; then
        return
    fi

    # Проверяем, существует ли процесс
    if kill -0 "$pid" 2>/dev/null; then
        echo "Stopping $name (PID: $pid)..."
        
        # Сначала мягкое завершение
        kill -TERM "$pid" 2>/dev/null
        
        # Ждем 3 секунды
        sleep 3
        
        # Если процесс не завершился, убиваем принудительно
        if kill -0 "$pid" 2>/dev/null; then
            echo "Forcefully killing $name (PID: $pid) "
            kill -KILL "$pid" 2>/dev/null
        fi
    fi
}

# Функция для полной остановки всех процессов
cleanup() {
    echo "Stopping all processes... "
    
    if [ -f "$pid_file" ]; then
        # Читаем PID построчно
        while IFS= read -r line || [[ -n "$line" ]]; do
            # Разбираем строку: PID и имя процесса
            pid=$(echo "$line" | cut -d' ' -f1)
            name=$(echo "$line" | cut -d' ' -f2-)
            
            kill_process "$pid" "$name"
        done < "$pid_file"
        
        # Очищаем файл с PID
        : > "$pid_file"  # Это очищает содержимое файла, но сам файл остается

    fi

    # Принудительное завершение дочерних процессов
    pkill -TERM -P $$

    exit 0
}

# Перехват сигналов
trap cleanup SIGINT SIGTERM EXIT

# Функция для запуска процесса и логирования его PID
start_process() {
    local command="$1"
    local log_file="$2"
    local name="$3"
    local remove_colors="${4:-false}"
    
    # Если нужно убрать цветовые коды
    if [ "$remove_colors" = true ]; then
        $command 2>&1 | sed 's/\x1b\[[0-9;]*m//g' | tee "$log_file" & 
    else
        $command 2>&1 | tee "$log_file" & 
    fi
    
    local pid=$!
    
    # Сохраняем PID с именем процесса
    echo "$pid $name" >> "$pid_file"
    
    return $pid
}

# Запуск FastAPI сервера
echo "Starting Python backend with Uvicorn"
cd "${base_dir}/back" || exit
start_process \
    "uvicorn main:app --reload --host 0.0.0.0 --port 8000" \
    "${logs_dir}/uvicorn.log" \
    "uvicorn"
cd "${base_dir}" || exit

# Запуск Vite + Electron
echo "Starting Vite and Electron"
cd "${base_dir}/front" || exit
start_process \
    "yarn dev" \
    "${logs_dir}/vite_electron.log" \
    "vite_electron" \
    true  # Удаляем цветовые коды
cd "${base_dir}" || exit

# Выводим сообщение
echo "All services started. Press Ctrl+C to stop all processes."

# Ожидаем завершения
wait
