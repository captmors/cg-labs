#pragma once

#include "GLSphere.h"
#include <glm/glm.hpp>
#include <vector>

class GLComposite : public GLObject {
private:
    std::vector<GLSphere*> spheres;

public:
    GLComposite(Shader* shader, Texture* texture);
    ~GLComposite() override;

    void addSphere(glm::vec3 position, float scale);
};
