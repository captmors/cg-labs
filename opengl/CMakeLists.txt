cmake_minimum_required(VERSION 3.22)

project(main)

set(CMAKE_CXX_STANDARD 20)

add_executable(main "src/main.cpp" "src/glutils/shadermanager.h" "src/glutils/shadermanager.cpp" "src/glutils/texturemanager.h" "src/glutils/texturemanager.cpp" "src/app/movingcamera.h" "src/app/movingcamera.cpp" "src/globjects/GLObject.h" "src/glutils/texture.h" "src/glutils/texture.cpp" "src/glutils/shader.h" "src/glutils/shader.cpp" "src/globjects/GLCube.h" "src/globjects/GLCube.cpp"  "src/globjects/GLSphere.h" "src/globjects/GLSphere.cpp" "src/globjects/GLSkybox.h" "src/globjects/GLSkybox.cpp" "src/globjects/GLComposite.cpp" "src/globjects/GLComposite.h" "src/app/inputmanager.h" "src/app/inputmanager.cpp"   "src/app/app.cpp" "src/app/app.h" "src/config.h" "src/utils/Logger.h" "src/utils/Movement.h" "src/utils/Movement.cpp"  )
target_compile_definitions(main PUBLIC PROJECT_ROOT="${CMAKE_SOURCE_DIR}")

find_package(SDL2 CONFIG REQUIRED)
target_link_libraries(main
  PRIVATE
  $<TARGET_NAME_IF_EXISTS:SDL2::SDL2main>
  $<IF:$<TARGET_EXISTS:SDL2::SDL2>,SDL2::SDL2,SDL2::SDL2-static>
)

find_package(OpenGL REQUIRED)
include_directories(${OPENGL_INCLUDE_DIR})
target_link_libraries(main PRIVATE ${OPENGL_LIBRARIES})

find_package(glad CONFIG REQUIRED)
target_link_libraries(main PRIVATE glad::glad)

target_include_directories(main PRIVATE ${CMAKE_SOURCE_DIR}/libs/stb)

find_package(spdlog REQUIRED)
target_link_libraries(main PRIVATE spdlog::spdlog)
