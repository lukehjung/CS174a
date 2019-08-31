// Create a simple scene class.
class Minimal_Webgl_Demo extends Scene_Component {
    constructor(context, control_panel) {
        // Call the constructor of Scene_Component
        super(context, control_panel);

        // Send a Triangle's vertices to the GPU's buffers.
        this.submit_shapes(context, {
            triangle: new Minimal_Shape()
        });

        // Create a basic shader program.
        this.shader = context.get_instance(Basic_Shader).material();
    }

    // Draw whatever needs to be displayed every frame.
    display(graphics_state) {
        // Draw the triangle.
        this.shapes.triangle.draw(graphics_state, Mat4.identity(), this.shader);
    }

    // Draw buttons, setup their actions and keyboard shortcuts, and monitor live variables.
    make_control_panel() {
        this.control_panel.innerHTML += "(This one has no controls)";
    }
}
;
window.Minimal_Webgl_Demo = window.classes.Minimal_Webgl_Demo = Minimal_Webgl_Demo;
