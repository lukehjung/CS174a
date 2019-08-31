function configureTest(callback) {

    let scene = new Scene();
    scene.addLight(new SimplePointLight(
        Vec.of(10, 10, -5, 1),
        Vec.of(1, 1, 1)       
    ));

    scene.addObject(new SceneObject(
        new Plane(Vec.of(0, 1, 0, 0), -2),
        new SolidColorMaterial(Vec.of(1,0,0))));

    loadObjFile("../assets/cube.obj", new SolidColorMaterial(Vec.of(0,0,1)),
        Mat4.translation([0,0,-3])
            .times(Mat4.rotation(-Math.PI/6, Vec.of(0,1,0))),
        function(triangles) {
            scene.addObjects(triangles);

            callback({
                renderer: new SimpleRenderer(scene, new PerspectiveCamera(Math.PI / 4, 1, Mat4.identity()), 4),
                width: 600,
                height: 600
            });
        });
}