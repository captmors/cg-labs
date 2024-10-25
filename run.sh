#!/bin/bash

echo "Starting Python backend"
cd ./back
python main.py
cd ..

echo "Starting frontend development server"
cd ./front
yarn dev
