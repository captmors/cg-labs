#include "Transformations.h"
#include <glm/ext/matrix_transform.hpp>

glm::mat4 Transformations::translate(const glm::mat4& model, const glm::vec3& offset) {
    return glm::translate(model, offset);
}

glm::mat4 Transformations::scale(const glm::mat4& model, const glm::vec3& factors) {
    return glm::scale(model, factors);
}

glm::mat4 Transformations::rotate(const glm::mat4& model, float angle, const glm::vec3& axis) {
    return glm::rotate(model, glm::radians(angle), axis);
}
