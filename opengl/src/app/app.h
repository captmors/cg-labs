#pragma once

#include <glad/glad.h>
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <glm/gtc/type_ptr.hpp>
#include <iostream>
#include <SDL2/SDL.h>
#include <vector>

#include "../config.h"
#include "../globjects/GLObject.h"
#include "../globjects/GLSkybox.h"
#include "../glutils/shadermanager.h"
#include "../glutils/texturemanager.h"
#include "movingcamera.h"


struct AppState;

void render(AppState& app, float deltaTime);
void handleEvents(AppState& app);
void initSceneObjects(AppState& app);


struct AppState {
    bool isModelTransformMode = true;  // true - model transform, false - camera movement
    bool quit = false;
    SDL_Window* window = nullptr;
    SDL_GLContext glContext;

    std::vector<GLObject*> objects;
    GLSkybox* skybox = nullptr;
    TextureManager* textureManager;
    ShaderManager* shaderManager;
    MovingCamera camera;

    glm::mat4 projection;
    glm::mat4 view;
    glm::mat4 model;

    AppState() :
        model(1.0f),
        view(1.0f),
        projection(DEFAULT_PROJECTION_MATRIX)
    {
        initSDL();

        initOpenGL();

        initGlutils();

        initSceneObjects(*this);
    }

    ~AppState() {
        for (auto* obj : objects) {
            delete obj;
        }

        delete textureManager;
        delete shaderManager;

        SDL_GL_DeleteContext(glContext);
        SDL_DestroyWindow(window);
        SDL_Quit();
    }

private:
    void initSDL() {
        if (SDL_Init(SDL_INIT_VIDEO) != 0) {
            std::cerr << "SDL initialization failed: " << SDL_GetError() << std::endl;
            std::exit(EXIT_FAILURE);
        }

        window = SDL_CreateWindow("3D Editor",
            SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED,
            SCR_WIDTH, SCR_HEIGHT,
            SDL_WINDOW_OPENGL);
        if (!window) {
            std::cerr << "Window creation failed: " << SDL_GetError() << std::endl;
            std::exit(EXIT_FAILURE);
        }
    }

    void initOpenGL() {
        glContext = SDL_GL_CreateContext(window);
        if (!gladLoadGLLoader((GLADloadproc)SDL_GL_GetProcAddress)) {
            std::cerr << "Failed to initialize GLAD" << std::endl;
            std::exit(EXIT_FAILURE);
        }

        SDL_SetRelativeMouseMode(SDL_TRUE);
        glEnable(GL_DEPTH_TEST);
    }

    void initGlutils() {
        textureManager = new TextureManager("assets/textures");
        textureManager->setDefaultCubeboxPath("assets/cubeboxes");
        shaderManager = new ShaderManager("assets/shaders");
    }
};
