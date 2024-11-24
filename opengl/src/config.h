#pragma once

static const int SCR_WIDTH = 1280;
static const int SCR_HEIGHT = 720;

static const int TARGET_FPS = 60;
static const int FRAME_DELAY = 1000 / TARGET_FPS;

namespace {
    static const float DEFAULT_FOV = 45.0f; // Field of view in degrees
    static const float NEAR_PLANE = 0.1f;   // Near clipping plane
    static const float FAR_PLANE = 100.0f;  // Far clipping plane
}
static const glm::mat4 DEFAULT_PROJECTION_MATRIX = glm::perspective(glm::radians(DEFAULT_FOV), (float)SCR_WIDTH / (float)SCR_HEIGHT, NEAR_PLANE, FAR_PLANE);

static const float TRANSFORMATION_MODE_SCALE_SPEED = 0.1f;
static const float TRANSFORMATION_MODE_ROTATION_SPEED = 0.1f;
static const float TRANSFORMATION_MODE_TRANSLATION_SPEED = 0.1f;
