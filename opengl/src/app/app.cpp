#include "../globjects/GLCube.h"
#include "../globjects/GLLetter.h"
#include "app.h"
#include "inputmanager.h"

#define GLM_ENABLE_EXPERIMENTAL
#include <glm/gtx/string_cast.hpp>


void initSceneObjects(AppState& app) {
    try {
        // letter 
        auto* letter = new GLLetter(
            app.shaderManager->createShaderDefault("sphere"),
            app.textureManager->createTextureDefault("sun")
        );

        app.objects.push_back(letter);

        // skybox
        app.skybox = new GLSkybox(
            app.shaderManager->createShaderDefault("skybox"),
            app.textureManager->createCubeboxDefault("field")
        );

    }
    catch (const std::exception& ex) {
        std::cerr << "Error creating scene objects: " << ex.what() << std::endl;
        std::exit(EXIT_FAILURE);
    }

    // init projection matrices

    if (app.skybox) {
        app.skybox->shader->setMat4("projection", app.projection);
    }

    for (auto* object : app.objects) {
        object->shader->useSetMat4("projection", app.projection);
    }
}


void render(AppState& app, float deltaTime) {
    glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);

    app.view = app.camera.getViewMatrix();

    for (auto* object : app.objects) {
        object->shader->setVec3("viewPos", app.camera.getCameraPos());
        object->shader->useSetMat4("view", app.view);
        object->shader->useSetMat4("model", app.model);
        object->shader->useSetMat4("projection", app.projection);
        object->move(deltaTime);
        object->draw();
    }

    if (app.skybox) {
        auto skyboxView = glm::mat4(glm::mat3(app.view));
        app.skybox->shader->useSetMat4("view", skyboxView);
        app.skybox->draw();
    }

    SDL_GL_SwapWindow(app.window);
}


void handleEvents(AppState& app) {
    SDL_Event e;
    const Uint8* state = SDL_GetKeyboardState(NULL);

    // Handle mouse movement for camera
    int xrel, yrel;
    SDL_GetRelativeMouseState(&xrel, &yrel);
    app.camera.handleMouseDirection(xrel, yrel);

    // Keyboard events
    while (SDL_PollEvent(&e) != 0) {
        if (e.type == SDL_QUIT) {
            app.quit = true;
            return;
        }

        switch (e.type) {
        case SDL_KEYDOWN:
            if (e.key.keysym.sym == SDLK_TAB) {
                app.isModelTransformMode = !app.isModelTransformMode;
            }
            else if (e.key.keysym.sym == SDLK_ESCAPE) {
                SDL_SetRelativeMouseMode(SDL_FALSE);
            }
            else if (e.key.keysym.sym == SDLK_q) {
                app.quit = true;
            }
            else if (app.isModelTransformMode) {
                InputManager::applyTransformationsModeChange(e);
            }
            break;

        case SDL_MOUSEBUTTONDOWN:
            if (e.button.button == SDL_BUTTON_LEFT) {
                SDL_SetRelativeMouseMode(SDL_TRUE);
            }
            break;

        case SDL_WINDOWEVENT:
            if (e.window.event == SDL_WINDOWEVENT_RESIZED) {
                glViewport(0, 0, e.window.data1, e.window.data2);
            }
            break;
        }
    }

    if (app.isModelTransformMode) {
        InputManager::applyTransformations(state, app.model);
    }
    else {
        app.camera.handleKeys(state);
    }
}
