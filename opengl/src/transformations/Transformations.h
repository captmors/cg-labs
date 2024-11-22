#pragma once

#include <glad/glad.h>
#include <glm/glm.hpp>

class Transformations {
public:
    static glm::mat4 translate(const glm::mat4& model, const glm::vec3& offset);
    static glm::mat4 scale(const glm::mat4& model, const glm::vec3& factors);
    static glm::mat4 rotate(const glm::mat4& model, float angle, const glm::vec3& axis);
};