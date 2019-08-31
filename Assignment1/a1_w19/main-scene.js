class Assignment_One_Scene extends Scene_Component {
    // The scene begins by requesting the camera, shapes, and materials it will need.
    constructor(context, control_box) {
        super(context, control_box);

        // First, include a secondary Scene that provides movement controls:
        if(!context.globals.has_controls)
            context.register_scene_component(new Movement_Controls(context, control_box.parentElement.insertCell()));

        // Locate the camera here (inverted matrix).
        const r = context.width / context.height;
        context.globals.graphics_state.camera_transform = Mat4.translation([0, 0, -35]);
        context.globals.graphics_state.projection_transform = Mat4.perspective(Math.PI / 4, r, .1, 1000);

        // At the beginning of our program, load one of each of these shape
        // definitions onto the GPU.  NOTE:  Only do this ONCE per shape
        // design.  Once you've told the GPU what the design of a cube is,
        // it would be redundant to tell it again.  You should just re-use
        // the one called "box" more than once in display() to draw
        // multiple cubes.  Don't define more than one blueprint for the
        // same thing here.
        const shapes = {
            'box': new Cube(),
            'ball': new Subdivision_Sphere(4),
            'prism': new TriangularPrism(),
            // 'rect': new Rect()
        }
        this.submit_shapes(context, shapes);

        // Make some Material objects available to you:
        this.clay = context.get_instance(Phong_Shader).material(Color.of(.9, .5, .9, 1), {
            ambient: .4,
            diffusivity: .4
        });
        this.plastic = this.clay.override({
            specularity: .6
        });

        this.lights = [new Light(Vec.of(10, 10, 20, 1), Color.of(1, .4, 1, 1), 100000)];

        this.blue = Color.of(0, 0, 1, 1);
        this.yellow = Color.of(1, 1, 0, 1);
        this.red = Color.of(1, 0, 0, 1);


        this.t = 0;
    }


    // Draw the scene's buttons, setup their actions and keyboard shortcuts, and monitor live measurements.
    make_control_panel() {
        this.key_triggered_button("Hover in Place", ["m"], () => {
            this.hover = !this.hover;
        });
        this.key_triggered_button("Pause Time", ["n"], () => {
            this.paused = !this.paused;
        });
    }

    draw_body(graphics_state, m)
    {
        this.shapes.ball.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0, 8, 0))).times(Mat4.scale(Vec.of(2, 2, 2))),
            this.plastic.override({color: this.yellow}));
        this.shapes.ball.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(0, -9, 0))).times(Mat4.scale(Vec.of(1.4, 3, 1.4))),
            this.plastic.override({color: this.yellow}));
        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.scale(Vec.of(1, 6, 1))),
            this.clay.override({color: this.red}));
    }


    draw_wings(graphics_state, m, x) 
    {
        const deg = 2 * Math.sin(this.t*2);
              
        let sign = (deg >= 0) ? 1 : -1;
        let angle = (x == 1) ? 0 : Math.PI;
        m = m.times(Mat4.translation(Vec.of(1*x, 0, 1)))
            .times(Mat4.rotation(angle, Vec.of(0, 1, 0)))
            .times(Mat4.rotation(.2*x * deg, Vec.of(0, 1, 0)))
            .times(Mat4.translation(Vec.of(-1*x, 0, -1)))
            .times(Mat4.translation(Vec.of(1*x, 0, 1 + x/10)))
            .times(Mat4.scale(Vec.of(6, 6, .1)))

        this.shapes.prism.draw(
            graphics_state,
            m,
            this.plastic.override({color: this.yellow}));
        this.shapes.prism.draw(
            graphics_state,
            m.times(Mat4.rotation(Math.PI, Vec.of(1, 0, 0))),
            this.plastic.override({color: this.yellow}));
        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(1, -1, 0)))
            .times(Mat4.scale(Vec.of(.707,.707, 1)))
            .times(Mat4.rotation(Math.PI/4, Vec.of(0, 0, 1))),
            this.plastic.override({color: this.blue}));
        this.shapes.box.draw(
            graphics_state,
            m.times(Mat4.translation(Vec.of(1.41, 1, 0)))
            .times(Mat4.scale(Vec.of(1,1, 1)))
            .times(Mat4.rotation(Math.PI/4, Vec.of(0, 0, 1))),
            this.plastic.override({color: this.blue}));
    }

    draw_antennas(graphics_state, m, x) 
    {
        const deg = .2 * Math.sin(this.t);

        m = m.times(Mat4.translation(Vec.of(-1*x, 10, .5)))
            .times(Mat4.scale(Vec.of(.2,.2,.2)))
            .times(Mat4.rotation(x*Math.PI/8, Vec.of(0,0,1)));
        this.shapes.box.draw(
            graphics_state,
            m,
            this.plastic.override({color: this.yellow}));
        for (var i = 0; i < 9; ++i) 
        {
            let sign = (deg >= 0) ? -1 : 1;
            m = m.times(Mat4.translation(Vec.of(0, 1, -1 * sign)))
                .times(Mat4.rotation( .2 * deg , Vec.of(1, 0, 0)))
                .times(Mat4.translation(Vec.of(0, 1, sign)));
            this.shapes.box.draw(
                graphics_state,
                m,
                this.plastic.override({color: this.yellow}));
        }
        this.shapes.ball.draw(graphics_state,
            m.times(Mat4.translation(Vec.of(0, 3, 0))).times(Mat4.scale(2)),
            this.plastic.override({color: this.yellow}));
    }

    draw_one_leg(graphics_state, m, x) 
    {
        const deg = 2 * Math.abs(Math.sin(this.t));
        for (var i = 0; i < 2; ++i) {
            let sign = (deg >= 0) ? -1 : 1;
            m = m.times(Mat4.translation(Vec.of(-1*x, 0, -2)))
                .times(Mat4.rotation(0.2 * deg * x, Vec.of(0, 1, 0)))
                .times(Mat4.translation(Vec.of(1*x, 0, 2)))
                .times(Mat4.translation(Vec.of(0, 0, -4))),
            this.shapes.box.draw(
                graphics_state,
                m
                .times(Mat4.scale(Vec.of(.5,.5,2)))
                .times(Mat4.translation(Vec.of(-3 * x, -12, .5))),
                this.plastic.override({color: (i %2) ? this.yellow : this.blue}));
        }    
             
     }

     draw_legs(graphics_state, m) 
     {
        for(var i = 0; i < 3; i ++)
        {
            this.draw_one_leg(graphics_state, m = m.times(Mat4.translation(Vec.of(0,3,0))), 1);
            this.draw_one_leg(graphics_state, m, -1)
        }
    
     }

    
   
    display(graphics_state) {
        // Use the lights stored in this.lights.
        graphics_state.lights = this.lights;

        // Variable m will be a temporary matrix that helps us draw most shapes.
        // It starts over as the identity every single frame - coordinate axes at the origin.
        let m = Mat4.identity();
       
        // Find how much time has passed in seconds, and use that to place shapes.
        if (!this.paused)
            this.t += graphics_state.animation_delta_time / 1000;
        const t = this.t;

        if(!this.hover)
        {
            m = m.times(Mat4.rotation(t, Vec.of(0,0,1)))
             .times(Mat4.translation(Vec.of(15,0,0)));
        }
        // TODO: Replace the below example code with your own code to draw the butterfly.
        
        this.draw_body(graphics_state, m);
        this.draw_wings(graphics_state, m, 1);
        this.draw_wings(graphics_state, m, -1);
        this.draw_antennas(graphics_state, m, 1);
        this.draw_antennas(graphics_state, m, -1);
        this.draw_legs(graphics_state, m);


        
        
    }


}

window.Assignment_One_Scene = window.classes.Assignment_One_Scene = Assignment_One_Scene;
