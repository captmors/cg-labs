#pragma once 

#include <glad/glad.h>
#include <glm/glm.hpp>

class OrthographicProjections {
public:
    static glm::mat4 projectOxy();
    static glm::mat4 projectOxz();
    static glm::mat4 projectOyz();
};
