#include "OrthographicProjections.h"
#include <glm/ext/matrix_transform.hpp>

glm::mat4 OrthographicProjections::projectOxy() {
    return glm::mat4(1.0f); // Identity matrix for Oxy
}

glm::mat4 OrthographicProjections::projectOxz() {
    return glm::rotate(glm::mat4(1.0f), glm::radians(-90.0f), glm::vec3(1.0f, 0.0f, 0.0f));
}

glm::mat4 OrthographicProjections::projectOyz() {
    return glm::rotate(glm::mat4(1.0f), glm::radians(-90.0f), glm::vec3(0.0f, 1.0f, 0.0f));
}
