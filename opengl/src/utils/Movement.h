#pragma once

#include <glm/ext/matrix_transform.hpp>
#include <glm/glm.hpp>


class IMovable {
public:
    virtual glm::mat4 move(float timeMs) = 0;
    virtual ~IMovable() = default;
};


// Туда сюда 
class SineMovement : public IMovable {
    float speed;
    float amplitude;
    float elapsedTime;

public:
    SineMovement(float speed = 0.0015f, float amplitude = 5.0f)
        : speed(speed), amplitude(amplitude), elapsedTime(0.0f) {}

    glm::mat4 move(float deltaTime) override {
        elapsedTime += deltaTime;
        float offset = amplitude * sin(speed * elapsedTime);
        return glm::translate(glm::mat4(1.0f), glm::vec3(offset, 0.0f, 0.0f));
    }
};

// Спиральное движение вокруг оси
class SpiralMovement : public IMovable {
    float radius;
    float verticalSpeed;
    float rotationSpeed;
    float elapsedTime;
public:
    SpiralMovement(float radius = 5.0f, float verticalSpeed = 0.001f, float rotationSpeed = 0.002f)
        : radius(radius), verticalSpeed(verticalSpeed), rotationSpeed(rotationSpeed), elapsedTime(0.0f) {}

    glm::mat4 move(float deltaTime) override {
        elapsedTime += deltaTime;
        float x = radius * cos(rotationSpeed * elapsedTime);
        float z = radius * sin(rotationSpeed * elapsedTime);
        float y = verticalSpeed * elapsedTime;
        return glm::translate(glm::mat4(1.0f), glm::vec3(x, y, z));
    }
};

// Движение по фигуре Лиссажу
class LissajousMovement : public IMovable {
    float amplitudeX, amplitudeY, amplitudeZ;
    float frequencyX, frequencyY, frequencyZ;
    float elapsedTime;
public:
    LissajousMovement(
        float ampX = 5.0f, float ampY = 3.0f, float ampZ = 4.0f,
        float freqX = 0.001f, float freqY = 0.002f, float freqZ = 0.0015f)
        : amplitudeX(ampX), amplitudeY(ampY), amplitudeZ(ampZ),
        frequencyX(freqX), frequencyY(freqY), frequencyZ(freqZ),
        elapsedTime(0.0f) {}

    glm::mat4 move(float deltaTime) override {
        elapsedTime += deltaTime;
        float x = amplitudeX * sin(frequencyX * elapsedTime);
        float y = amplitudeY * sin(frequencyY * elapsedTime);
        float z = amplitudeZ * sin(frequencyZ * elapsedTime);
        return glm::translate(glm::mat4(1.0f), glm::vec3(x, y, z));
    }
};

// Движение по орбите с вращением
class OrbitingMovement : public IMovable {
    float radius;
    float orbitSpeed;
    float rotationSpeed;
    float elapsedTime;
public:
    OrbitingMovement(float radius = 5.0f, float orbitSpeed = 0.001f, float rotationSpeed = 0.003f)
        : radius(radius), orbitSpeed(orbitSpeed), rotationSpeed(rotationSpeed), elapsedTime(0.0f) {}

    glm::mat4 move(float deltaTime) override {
        elapsedTime += deltaTime;
        float x = radius * cos(orbitSpeed * elapsedTime);
        float z = radius * sin(orbitSpeed * elapsedTime);

        glm::mat4 translation = glm::translate(glm::mat4(1.0f), glm::vec3(x, 0.0f, z));
        glm::mat4 rotation = glm::rotate(glm::mat4(1.0f), rotationSpeed * elapsedTime, glm::vec3(0.0f, 1.0f, 0.0f));

        return translation * rotation;
    }
};

// Движение с упругостью (bounce)
class BounceMovement : public IMovable {
    float height;
    float speed;
    float damping;
    float elapsedTime;
public:
    BounceMovement(float height = 5.0f, float speed = 0.003f, float damping = 0.99f)
        : height(height), speed(speed), damping(damping), elapsedTime(0.0f) {}

    glm::mat4 move(float deltaTime) override {
        elapsedTime += deltaTime;
        float y = height * abs(sin(speed * elapsedTime));
        height *= damping;
        if (height < 0.1f) height = 5.0f; // Перезапуск
        return glm::translate(glm::mat4(1.0f), glm::vec3(0.0f, y, 0.0f));
    }
};

// Хаотическое движение (аттрактор Лоренца)
class LorenzMovement : public IMovable {
    float x, y, z;
    float sigma, rho, beta;
    float scale;
public:
    LorenzMovement(float scale = 0.01f, float sigma = 10.0f, float rho = 28.0f, float beta = 8.0f / 3.0f)
        : x(0.1f), y(0.0f), z(0.0f), sigma(sigma), rho(rho), beta(beta), scale(scale) {}

    glm::mat4 move(float deltaTime) override {
        float dx = sigma * (y - x);
        float dy = x * (rho - z) - y;
        float dz = x * y - beta * z;

        x += dx * deltaTime * 0.001f;
        y += dy * deltaTime * 0.001f;
        z += dz * deltaTime * 0.001f;

        return glm::translate(glm::mat4(1.0f), glm::vec3(x, y, z) * scale);
    }
};
