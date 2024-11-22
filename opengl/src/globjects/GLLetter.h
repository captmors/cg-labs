#pragma once

#include "GLComposite.h"
#include "GLSphere.h"

class GLLetter : public GLComposite {
private:
    std::vector<GLSphere*> spheres;

public:
    GLLetter(Shader* shader, Texture* texture)
        : GLComposite(shader, texture) {
        createBufferObject();
        shader->useSetTextureSampler(texture->getUnit());
    }

    ~GLLetter() override {
        for (auto* sphere : spheres) {
            delete sphere;
        }
    }

    void draw() override {
        shader->use();
        texture->use();

        for (auto* sphere : spheres) {
            sphere->draw(); // (?) could draw with no use
        }
    }

private:
    void createBufferObject() override {
        // Define the positions for spheres forming the letter "×"
        std::vector<glm::vec3> positions = {
            glm::vec3(-0.5f, 0.3f, 0.0f),
            glm::vec3(-0.5f, 0.6f, 0.0f),
            glm::vec3(-0.5f, 0.9f, 0.0f),
            glm::vec3(0.5f, 0.3f, 0.0f),
            glm::vec3(0.5f, 0.6f, 0.0f),
            glm::vec3(0.0f, 0.3f, 0.0f),
        };

        // Create spheres at specified positions
        for (const auto& pos : positions) {
            GLSphere* sphere = new GLSphere(shader, texture);
            spheres.push_back(sphere);
        }
    }
};
