#include "inputmanager.h"

#include <glm/ext/matrix_transform.hpp>
#include <spdlog/spdlog.h>

TransformationMode InputManager::mode = TRANSLATE;
InputManager::ModeState InputManager::translateState(TRANSFORMATION_MODE_TRANSLATION_SPEED);
InputManager::ModeState InputManager::rotateState(TRANSFORMATION_MODE_ROTATION_SPEED);
InputManager::ModeState InputManager::scaleState(TRANSFORMATION_MODE_SCALE_SPEED);

void InputManager::applyTransformations(const Uint8* keyState, glm::mat4& model) {
    switch (mode) {
    case TRANSLATE:
        if (keyState[SDL_SCANCODE_W])
            model = glm::translate(model, glm::vec3(0.0f, translateState.speed, 0.0f));  // Up
        if (keyState[SDL_SCANCODE_S])
            model = glm::translate(model, glm::vec3(0.0f, -translateState.speed, 0.0f)); // Down
        if (keyState[SDL_SCANCODE_A])
            model = glm::translate(model, glm::vec3(-translateState.speed, 0.0f, 0.0f)); // Left
        if (keyState[SDL_SCANCODE_D])
            model = glm::translate(model, glm::vec3(translateState.speed, 0.0f, 0.0f));  // Right
        if (keyState[SDL_SCANCODE_Q])
            model = glm::translate(model, glm::vec3(0.0f, 0.0f, translateState.speed));  // Forward
        if (keyState[SDL_SCANCODE_E])
            model = glm::translate(model, glm::vec3(0.0f, 0.0f, -translateState.speed)); // Backward
        break;

    case ROTATE:
        if (keyState[SDL_SCANCODE_W])
            model = glm::rotate(model, rotateState.speed, glm::vec3(1.0f, 0.0f, 0.0f));  // Around X
        if (keyState[SDL_SCANCODE_S])
            model = glm::rotate(model, -rotateState.speed, glm::vec3(1.0f, 0.0f, 0.0f));
        if (keyState[SDL_SCANCODE_A])
            model = glm::rotate(model, rotateState.speed, glm::vec3(0.0f, 1.0f, 0.0f));  // Around Y
        if (keyState[SDL_SCANCODE_D])
            model = glm::rotate(model, -rotateState.speed, glm::vec3(0.0f, 1.0f, 0.0f));
        if (keyState[SDL_SCANCODE_Q])
            model = glm::rotate(model, rotateState.speed, glm::vec3(0.0f, 0.0f, 1.0f));  // Around Z
        if (keyState[SDL_SCANCODE_E])
            model = glm::rotate(model, -rotateState.speed, glm::vec3(0.0f, 0.0f, 1.0f));
        break;

    case SCALE:
        float scaleFactorUp = 1.0f + scaleState.speed;
        float scaleFactorDown = 1.0f - scaleState.speed;
        if (keyState[SDL_SCANCODE_W])
            model = glm::scale(model, glm::vec3(scaleFactorUp));    // Scale up uniformly
        if (keyState[SDL_SCANCODE_S])
            model = glm::scale(model, glm::vec3(scaleFactorDown));  // Scale down uniformly
        if (keyState[SDL_SCANCODE_A])
            model = glm::scale(model, glm::vec3(scaleFactorDown, 1.0f, 1.0f));  // Scale X
        if (keyState[SDL_SCANCODE_D])
            model = glm::scale(model, glm::vec3(scaleFactorUp, 1.0f, 1.0f));    // Scale X
        if (keyState[SDL_SCANCODE_Q])
            model = glm::scale(model, glm::vec3(1.0f, scaleFactorDown, 1.0f));  // Scale Y
        if (keyState[SDL_SCANCODE_E])
            model = glm::scale(model, glm::vec3(1.0f, scaleFactorUp, 1.0f));    // Scale Y
        break;
    }
}

void InputManager::applyTransformationsModeChange(SDL_Event& event) {
    if (event.type == SDL_KEYDOWN) {
        switch (event.key.keysym.sym) {
        case SDLK_r: mode = ROTATE; break;
        case SDLK_t: mode = TRANSLATE; break;
        case SDLK_g: mode = SCALE; break;

        case SDLK_UP:
            switch (mode) {
            case TRANSLATE: translateState.increaseSpeed(); break;
            case ROTATE: rotateState.increaseSpeed(); break;
            case SCALE: scaleState.increaseSpeed(); break;
            }
            break;

        case SDLK_DOWN:
            switch (mode) {
            case TRANSLATE: translateState.decreaseSpeed(); break;
            case ROTATE: rotateState.decreaseSpeed(); break;
            case SCALE: scaleState.decreaseSpeed(); break;
            }
            break;
        }
    }
}