#pragma once
#include "GLObject.h"

class GLLetter : public GLObject {
private:
    struct BufferObjects {
        unsigned int VAO{ 0 };
        unsigned int VBO{ 0 };
        unsigned int EBO{ 0 };
        unsigned int normalVBO{ 0 };
        unsigned int texcoordVBO{ 0 };
    };

    struct LetterGeometry {
        std::vector<float> vertices;
        std::vector<float> normals;
        std::vector<float> texcoords;
        std::vector<unsigned short> indices;
    };

    BufferObjects buffers;
    unsigned int indexCount{ 0 };

    void createBufferObject() override;
    void createLetterBuffer();
    void setupBuffers(const LetterGeometry& geometry);

public:
    GLLetter(Shader* shader, Texture* texture);
    ~GLLetter() override;
    void draw() override;
};
