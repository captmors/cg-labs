#pragma once

#include <glm/ext/matrix_clip_space.hpp>
#include <glm/glm.hpp>
#include <SDL.h>

#include "../config.h"
#include <utility>

enum TransformationMode { TRANSLATE, SCALE, ROTATE };

class InputManager {
public:
    static TransformationMode mode;
    struct ModeState;
    static ModeState translateState;
    static ModeState rotateState;
    static ModeState scaleState;

    static void applyTransformationsModeChange(SDL_Event& event);
    static void applyTransformations(const Uint8* keyState, glm::mat4& model);
};

struct InputManager::ModeState {
    float speed;
    float baseSpeed;
    float speedMultiplier;

    ModeState(float baseSpd = 0.001f) :
        baseSpeed(baseSpd),
        speed(baseSpd),
        speedMultiplier(1.0f) {}

    void increaseSpeed(float amount = 0.1f) {
        speedMultiplier += amount;
        updateSpeed();
    }

    void decreaseSpeed(float amount = 0.1f) {
        speedMultiplier = std::max(speedMultiplier - amount, 0.1f);
        updateSpeed();
    }

private:
    void updateSpeed() {
        speed = baseSpeed * speedMultiplier;
    }
};