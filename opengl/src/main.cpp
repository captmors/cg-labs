#define STB_IMAGE_IMPLEMENTATION
#include "stb_image.h"
#include <glad/glad.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <iostream>
#include <SDL.h>

#include "globjects/GLLetter.h"
#include "managers/keybindings.h"
#include "managers/shadermanager.h"
#include "managers/texturemanager.h"
#include "movingcamera.h"

int main(int argc, char* argv[]) {
    if (SDL_Init(SDL_INIT_VIDEO) < 0) {
        return -1;
    }

    SDL_Window* window = SDL_CreateWindow("3D Letter and Projections",
        SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED,
        800, 600, SDL_WINDOW_OPENGL);

    SDL_GLContext glContext = SDL_GL_CreateContext(window);
    if (!gladLoadGLLoader((GLADloadproc)SDL_GL_GetProcAddress)) {
        std::cout << "Failed to initialize GLAD" << std::endl;
        return 1;
    }

    TextureManager textureManager("assets/textures");
    textureManager.setDefaultCubeboxPath("assets/cubeboxes");
    ShaderManager shaderManager("assets/shaders");

    GLLetter* letterCh = new GLLetter(
        shaderManager.createShaderDefault("sphere"),
        textureManager.createTextureDefault("sun")
    );

    MovingCamera camera;
    glm::mat4 modelMatrix = glm::mat4(1.0f);
    glm::mat4 projectionMatrix = glm::perspective(glm::radians(45.0f), 4.0f / 3.0f, 0.1f, 100.0f);

    bool running = true;
    SDL_Event event;
    const Uint8* state = SDL_GetKeyboardState(nullptr);

    while (running) {
        while (SDL_PollEvent(&event)) {
            if (event.type == SDL_QUIT) running = false;
            KeyBindings::handleKey(event, modelMatrix);
        }

        KeyBindings::handleProjections(state, projectionMatrix);

        // Render logic
        glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
        glm::mat4 viewMatrix = camera.getViewMatrix();

        letterCh->draw(); // Render the letter

        SDL_GL_SwapWindow(window);
    }

    SDL_DestroyWindow(window);
    SDL_Quit();
    return 0;
}
