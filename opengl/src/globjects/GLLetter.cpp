#include "GLLetter.h"
#include <cmath>
#include <glad/glad.h>
#include <numbers>
#include <vector>

namespace {
    constexpr float LETTER_THICKNESS = 0.5f;    // Толщина линий буквы
    constexpr int CYLINDER_SEGMENTS = 5;        // Количество сегментов для цилиндрической поверхности
    constexpr float LH = 8.0f;                  // Высота буквы
    constexpr float LW = 3.0f;                  // Половина ширины буквы

    struct Line {
        float startX, startY;
        float endX, endY;
    };

    const std::vector<Line> LETTER_LINES = {
    {-LW, LH, -LW, LH / 2},      // лев верт
    {-LW, LH / 2, 0, LH / 2},    // гор
    {0, LH, 0, 0},               // пр верт
    };

}

GLLetter::GLLetter(Shader* shader, Texture* texture)
    : GLObject(shader, texture) {
    createBufferObject();
    shader->useSetTextureSampler(texture->getUnit());
}

GLLetter::~GLLetter() {
    glDeleteVertexArrays(1, &buffers.VAO);
    glDeleteBuffers(1, &buffers.VBO);
    glDeleteBuffers(1, &buffers.EBO);
    glDeleteBuffers(1, &buffers.normalVBO);
    glDeleteBuffers(1, &buffers.texcoordVBO);
}

void GLLetter::createBufferObject() {
    createLetterBuffer();
}

void GLLetter::setupBuffers(const LetterGeometry& geometry) {
    glGenVertexArrays(1, &buffers.VAO);
    glGenBuffers(1, &buffers.VBO);
    glGenBuffers(1, &buffers.normalVBO);
    glGenBuffers(1, &buffers.texcoordVBO);
    glGenBuffers(1, &buffers.EBO);

    glBindVertexArray(buffers.VAO);

    // Вершины
    glBindBuffer(GL_ARRAY_BUFFER, buffers.VBO);
    glBufferData(GL_ARRAY_BUFFER, geometry.vertices.size() * sizeof(float),
        geometry.vertices.data(), GL_STATIC_DRAW);
    glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 0, nullptr);
    glEnableVertexAttribArray(0);

    // Нормали
    glBindBuffer(GL_ARRAY_BUFFER, buffers.normalVBO);
    glBufferData(GL_ARRAY_BUFFER, geometry.normals.size() * sizeof(float),
        geometry.normals.data(), GL_STATIC_DRAW);
    glVertexAttribPointer(1, 3, GL_FLOAT, GL_FALSE, 0, nullptr);
    glEnableVertexAttribArray(1);

    // Текстурные координаты
    glBindBuffer(GL_ARRAY_BUFFER, buffers.texcoordVBO);
    glBufferData(GL_ARRAY_BUFFER, geometry.texcoords.size() * sizeof(float),
        geometry.texcoords.data(), GL_STATIC_DRAW);
    glVertexAttribPointer(2, 2, GL_FLOAT, GL_FALSE, 0, nullptr);
    glEnableVertexAttribArray(2);

    // Индексы
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, buffers.EBO);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, geometry.indices.size() * sizeof(unsigned short),
        geometry.indices.data(), GL_STATIC_DRAW);

    indexCount = geometry.indices.size();
}

void GLLetter::createLetterBuffer() {
    LetterGeometry geometry;

    auto addCylinderSegment = [&geometry](const Line& line) {
        float length = std::sqrt(pow(line.endX - line.startX, 2) +
            pow(line.endY - line.startY, 2));
        float angle = std::atan2(line.endY - line.startY,
            line.endX - line.startX);

        unsigned int baseIndex = geometry.vertices.size() / 3;

        for (int i = 0; i <= CYLINDER_SEGMENTS; ++i) {
            float segmentAngle = 2.0f * std::numbers::pi * i / CYLINDER_SEGMENTS;
            float cosA = std::cos(segmentAngle);
            float sinA = std::sin(segmentAngle);

            for (int end = 0; end < 2; ++end) {
                float x = (end == 0 ? line.startX : line.endX) + LETTER_THICKNESS * cosA;
                float y = (end == 0 ? line.startY : line.endY) + LETTER_THICKNESS * sinA;

                geometry.vertices.push_back(x);
                geometry.vertices.push_back(y);
                geometry.vertices.push_back(LETTER_THICKNESS * sinA);  // Z-координата

                float nx = cosA * std::cos(angle);
                float ny = cosA * std::sin(angle);
                float nz = sinA;
                geometry.normals.push_back(nx);
                geometry.normals.push_back(ny);
                geometry.normals.push_back(nz);

                geometry.texcoords.push_back(static_cast<float>(i) / CYLINDER_SEGMENTS);
                geometry.texcoords.push_back(end);
            }
        }

        for (int i = 0; i < CYLINDER_SEGMENTS; ++i) {
            unsigned short idx = baseIndex + i * 2;
            geometry.indices.push_back(idx);
            geometry.indices.push_back(idx + 1);
            geometry.indices.push_back(idx + 2);

            geometry.indices.push_back(idx + 1);
            geometry.indices.push_back(idx + 3);
            geometry.indices.push_back(idx + 2);
        }
        };

    for (const auto& line : LETTER_LINES) {
        addCylinderSegment(line);
    }

    setupBuffers(geometry);
}

void GLLetter::draw() {
    shader->use();
    texture->use();

    glBindVertexArray(buffers.VAO);
    glDrawElements(GL_TRIANGLES, indexCount, GL_UNSIGNED_SHORT, nullptr);
}