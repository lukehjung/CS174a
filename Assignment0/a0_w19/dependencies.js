// Simplest example shader.  Sample pixels from colors that are simply assigned to each vertex.
class Basic_Shader extends Shader {
    // Materials here are minimal, without any settings.
    material() {
        return {
            shader: this
        }
    }
    // We'll pull single values out per vertex by name.  Map those names onto the arrays we'll pull them from.
    map_attribute_name_to_buffer_name(name) {
        return {
            object_space_pos: "positions",
            color: "colors"
        }[name];
    }
    // Define how to synchronize our JavaScript's variables to the GPU's:
    update_GPU(g_state, model_transform, material, gpu=this.g_addrs, gl=this.gl) {
        const [P,C,M] = [g_state.projection_transform, g_state.camera_transform, model_transform]
          , PCM = P.times(C).times(M);
        gl.uniformMatrix4fv(gpu.projection_camera_model_transform_loc, false, Mat.flatten_2D_to_1D(PCM.transposed()));
    }
    // ********* SHARED CODE INCLUDED IN BOTH SHADERS *********
    shared_glsl_code() {
        return `
            precision mediump float;
            varying vec4 VERTEX_COLOR;`;
    }
    // ********* VERTEX SHADER *********
    vertex_glsl_code() {
        return `
            attribute vec4 color;
            attribute vec3 object_space_pos;
            uniform mat4 projection_camera_model_transform;

            void main() {
                // The vertex's final resting place onscreen in normalized coords.
                gl_Position = projection_camera_model_transform * vec4(object_space_pos, 1.0);
                VERTEX_COLOR = color;
            }`;
    }
    // ********* FRAGMENT SHADER *********
    fragment_glsl_code() {
        return `
            void main() {
                gl_FragColor = VERTEX_COLOR;
            }`;
    }
}

// The simplest possible Shape – one triangle.  It has 3 vertices, each
// containing two values: a 3D position and a color.
class Minimal_Shape extends Vertex_Buffer {
    constructor() {
        // Name the values we'll define per each vertex.
        super("positions", "colors");
        // Describe the where the points of a triangle are in space.
        this.positions = [Vec.of(0, 0, 0), Vec.of(1, 0, 0), Vec.of(0, 1, 0), Vec.of(0,1,0), Vec.of(1,0,0), Vec.of(1,1,0)];
        // Besides a position, vertices also have a color.
        this.colors = [Color.of(1, 0, 0, 1), Color.of(0, 1, 0, 1), Color.of(0, 0, 1, 1,), Color.of(0,0,1,1), Color.of(0,1,0,1), Color.of(1,1,0,1)];        // With this turned off, every three vertices will be interpreted as one triangle.
        this.indexed = false;
    }
}

window.Basic_Shader = window.classes.Basic_Shader = Basic_Shader;
window.Minimal_Shape = window.classes.Minimal_Shape = Minimal_Shape;
