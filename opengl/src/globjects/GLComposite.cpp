#include "GLComposite.h"
#include <glm/ext/matrix_transform.hpp>

GLComposite::GLComposite(Shader* shader, Texture* texture)
    : GLObject(shader, texture) {}

GLComposite::~GLComposite() {
    for (auto* sphere : spheres) {
        delete sphere;
    }
}

void GLComposite::addSphere(glm::vec3 position, float scale) {
    auto* sphere = new GLSphere(shader, texture);
    glm::mat4 model(1.0f);
    model = glm::translate(model, position);
    model = glm::scale(model, glm::vec3(scale));
    sphere->shader->useSetMat4("model", model);
    spheres.push_back(sphere);
}
