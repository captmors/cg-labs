#define SDL_MAIN_HANDLED

#define STB_IMAGE_IMPLEMENTATION
#include <stb_image.h>

#include <iostream>
#include <SDL2/SDL.h>

#include "app/app.h"
#include "config.h"


int main(int argc, char* argv[]) {
    SDL_SetMainReady();

    AppState app;

    float deltaTime;

    while (!app.quit) {
        Uint32 frameStart = SDL_GetTicks();
        float deltaTime = (SDL_GetTicks() - frameStart) / 1000.0f;

        handleEvents(app);
        render(app, deltaTime);

        int frameTime = SDL_GetTicks() - frameStart;
        if (FRAME_DELAY > frameTime) {
            SDL_Delay(FRAME_DELAY - frameTime);
        }
    }

    return 0;
}
