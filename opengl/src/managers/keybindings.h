#pragma once

#include <glm/glm.hpp>
#include <SDL.h>

enum TransformationMode { TRANSLATE, SCALE, ROTATE };

class KeyBindings {
public:
    static TransformationMode mode;

    static void handleKey(SDL_Event& event, glm::mat4& model);

    static void handleProjections(const Uint8* state, glm::mat4& projectionMatrix);
};
