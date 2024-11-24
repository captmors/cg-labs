#pragma once

#include "../glutils/shader.h"
#include "../glutils/texture.h"
#include "../utils/Movement.h"


class GLObject : public SineMovement {
public:
    Shader* shader;
    Texture* texture;

    GLObject(Shader* shader, Texture* texture) : shader(shader), texture(texture) {}
    virtual ~GLObject() {};

    virtual void draw() = 0;

private:
    virtual void createBufferObject() = 0;

};