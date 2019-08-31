function configureTest(callback) {

    let scene = new Scene();
    scene.addLight(new SimplePointLight(
        Vec.of(10, 10, -5, 1),  // position
        Vec.of(1, 1, 1)         // color
    ));

    scene.addObject(new SceneObject(
        new Plane(Vec.of(1, 1, 0, 0).normalized(), -1),
        new SolidColorMaterial(Vec.of(0,0,1))));

    callback({
        renderer: new SimpleRenderer(scene, new PerspectiveCamera(Math.PI / 4, 1, Mat4.identity()), 4),
        width: 600,
        height: 600
    });

}