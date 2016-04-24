# lorenz-attractor
Three.js Visualization of Lorenz System

## What is this?

This visualization is based on Edward Lorenz's paper called "Predictability: Does the Flap of a Butterfly’s Wings in Brazil set off a Tornado in Texas?" In this, he describes how a small change in the initial conditions for a given system can result in large differences in a later state. This became known as the "butterfly effect".

He was also known for his work on a dynamical system to model atmospheric convection.  The Lorenz system consists of three differential equations:

```
dx/dt = sigma(y-x),
dy/dt = x(rho-z)-y,
dz/dt = xy - beta*z
```
Of note, Lorenz found that the system exhibited chaotic behavior when **sigma=10**, **rho=28**, and **beta=8/3**, so this uses Three.js to model a solution for this system.

```javascript
var lorenzSystem = function (pos, sigma, rho, beta) {
    var x = sigma * (pos.y - pos.x),
        y = pos.x * (rho - pos.z) - pos.y,
        z = pos.x * pos.y - (beta * pos.z);
    // Returns cartesian coordinates for lorenz system at a point in time
    return new Vector(x, y, z);
};
```

When rho is >= 1, there is a bifurcation, which appears as orbits around two equilibrium points.
