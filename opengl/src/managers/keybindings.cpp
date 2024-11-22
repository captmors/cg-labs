#include "KeyBindings.h"

#include "../transformations/OrthographicProjections.h"
#include "../transformations/Transformations.h"


TransformationMode KeyBindings::mode = TRANSLATE;

void KeyBindings::handleKey(SDL_Event& event, glm::mat4& model) {
  if (event.type == SDL_KEYDOWN) {
    switch (event.key.keysym.sym) {
    case SDLK_g: mode = TRANSLATE; break;
    case SDLK_s: mode = SCALE; break;
    case SDLK_r: mode = ROTATE; break;

    case SDLK_UP:
      if (mode == TRANSLATE) model = Transformations::translate(model, { 0.0f, 0.1f, 0.0f });
      if (mode == SCALE) model = Transformations::scale(model, { 1.1f, 1.1f, 1.1f });
      if (mode == ROTATE) model = Transformations::rotate(model, 10.0f, { 0.0f, 1.0f, 0.0f });
      break;

    case SDLK_DOWN:
      if (mode == TRANSLATE) model = Transformations::translate(model, { 0.0f, -0.1f, 0.0f });
      if (mode == SCALE) model = Transformations::scale(model, { 0.9f, 0.9f, 0.9f });
      if (mode == ROTATE) model = Transformations::rotate(model, -10.0f, { 0.0f, 1.0f, 0.0f });
      break;

    case SDLK_LEFT:
      if (mode == TRANSLATE) model = Transformations::translate(model, { -0.1f, 0.0f, 0.0f });
      break;

    case SDLK_RIGHT:
      if (mode == TRANSLATE) model = Transformations::translate(model, { 0.1f, 0.0f, 0.0f });
      break;
    }
  }
}

void KeyBindings::handleProjections(const Uint8* state, glm::mat4& projectionMatrix) {
  if (state[SDL_SCANCODE_1]) {
    projectionMatrix = OrthographicProjections::projectOxy();
  }
  else if (state[SDL_SCANCODE_2]) {
    projectionMatrix = OrthographicProjections::projectOxz();
  }
  else if (state[SDL_SCANCODE_3]) {
    projectionMatrix = OrthographicProjections::projectOyz();
  }
}
