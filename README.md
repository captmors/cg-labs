Из корня запустить следующее:
1. 
```
poetry config virtualenvs.path ./back/venv/
poetry config virtualenvs.in-project true
```
2. 
```
poetry install 
```
3. Для сборки/открытия 1 лабы в исполняемом файле:
```
poetry add pyinstaller --dev
poetry run pyinstaller --onefile --windowed lab1/main.py
./dist/main.exe
```
4. Для запуска 2,3 лаб на React/Vite + FastAPI/uvicorn  
```
docker-compose up -d --build
cd front
yarn install
yarn dev 
```
