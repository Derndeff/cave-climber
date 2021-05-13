import {Points, PointsMaterial, Geometry, Clock, AdditiveBlending, Vector3, TextureLoader } from 'three';


class ParticleManager{

    constructor(){
        this.clock = new Clock(true);
        this.deltaTime = this.clock.getDelta();
        this.time = undefined;
        this.systems = []
    }

    createSnow(scene) {
        
        // The number of particles in a particle system is not easily changed.
        var particleCount = 50;
        
        // Particles are just individual vertices in a geometry
        // Create the geometry that will hold all of the vertices
        var particles = new Geometry();
    
        // Create the vertices and add them to the particles geometry
        for (var p = 0; p < particleCount; p++) {
        
        // This will create all the vertices in a range of -200 to 200 in all directions
        var x = Math.random() * scene.tileWidth;
        var y = Math.random() * scene.tileHeight * -1;
        var z = 0.1;
                
        // Create the vertex
        var particle = new Vector3(x, y, z);
        
        // Add the vertex to the geometry
        particles.vertices.push(particle);
        }
        // Create the material that will be used to render each vertex of the geometry
        var particleMaterial = new PointsMaterial(
            {color: 0xffffff, 
            size: 1.5,
            //  map: new TextureLoader().load(Snowflake),
            blending: AdditiveBlending,
            transparent: true,
            });
        
        // Create the particle system
         const particleSystem = new Points(particles, particleMaterial);
    
        return particleSystem;	
    }

    animateSnow(particleSystem, scene) {
        this.time = this.clock.elapsedTime;
        var verts = particleSystem.geometry.vertices;
        for(var i = 0; i < verts.length; i++) {
        var vert = verts[i];
        if (vert.y < -scene.tileHeight + 0.2) {
            vert.y = -0.1;
            vert.x = Math.random() * scene.tileWidth;
        }
        vert.y = vert.y - 0.025;
        vert.x += (Math.random()*Math.cos(this.time* i/100) - 0.3) * 0.02
        }
        particleSystem.geometry.verticesNeedUpdate = true;
        particleSystem.rotation.y -= .001 * this.deltaTime;
    }

    createDust(start, end, direction, horizontal) {
        
        // The number of particles in a particle system is not easily changed.
        var particleCount = 10;
        
        // Particles are just individual vertices in a geometry
        // Create the geometry that will hold all of the vertices
        var particles = new Geometry();

        var platformLen = start.clone().sub(end);
    
        // Create the vertices and add them to the particles geometry
        for (var p = 0; p < particleCount; p++) {
        var particle = start.clone();
        particle.z = 0.1;
        particle.add(platformLen.clone().multiplyScalar(p/particleCount));
        // console.log(particle, platformLen, platformLen.clone().multiplyScalar(Math.random()));
               
        // Create the vertex
        
        // Add the vertex to the geometry
        particles.vertices.push(particle);
        }
        // Create the material that will be used to render each vertex of the geometry
        var particleMaterial = new PointsMaterial(
            {color: 0xffffff, 
            size: 4,
            //  map: new TextureLoader().load(Snowflake),
            blending: AdditiveBlending,
            opacity: 1
            // transparent: true,
            });
        
        // Create the particle system
        const particleSystem = new Points(particles, particleMaterial);
        particleSystem.clock = new Clock(true);
        particleSystem.direction = direction;
        particleSystem.horizontal = horizontal;
        particleSystem.name = String(Math.random());
        this.systems.push(particleSystem)
        return particleSystem;	
    }

    animateDust(particleSystem, direction) {
        var verts = particleSystem.geometry.vertices;
        particleSystem.material.opacity -= 0.015;
        // console.log(verts)
        for(var i = 0; i < verts.length; i++) {
            var vert = verts[i];
            // vert.y = -10;
            if (particleSystem.horizontal) {
                vert.x -= particleSystem.material.opacity*(i - verts.length/2)/200;
                // vert.y += (verts.length/2 - Math.abs(i - verts.length/2))/1000
                vert.y += Math.cos((i - verts.length/2)/(verts.length/3))/100;
            }
            else {
                vert.y -= particleSystem.material.opacity*(i - verts.length/2)/200;
                vert.x += Math.cos((i - verts.length/2)/(verts.length/3))/100;
            }
            // vert.add(direction.clone().multiplyScalar(Math.random()*0.1))
        }
        // debugger;
        particleSystem.geometry.verticesNeedUpdate = true;
    }
}

// const instance = new ParticleManager();
export default ParticleManager;

