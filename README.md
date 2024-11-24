## Реализации
1,2,3 - back/lab1, back/lab3, back/lab3

4 - opengl/

## Установка 
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
5. Для запуска 4 лабы: 
```
*install vcpkg* 

vcpkg integrate 
vcpkg install sdl2
vcpkg install glad
vcpkg install glm

cd opengl/libs/ 
git clone https://github.com/nothings/stb.git

*open like CMake project in Visual Studio*
*build&launch*
```
