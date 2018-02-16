# Data Block

[Live Demo](https://locphan2207.github.io/Data-block/)

![demo](public/images/tutorial.gif)   

## Overview
Data Block is a 2D game built by purely JavaScript and its data-driven library `D3.js`. In Data Block, players will use the mouse to control a shield to protect a character from being hit by _big blocks of data_ falling down from the sky.   
Each data block has a shape. The size of a block is determined by how large of its corresponding data is.

## Features
* Circles with colors and sizes corresponding to their bounded data
* Data number on the circle
* Basic Physic Laws on all objects (gravity, collision, damping force)
* AI Character's behavior
* Game pause/unpause
* Sounds on collisions. Mute button

## Layout
This game has one single screen with the `svg` element created by `D3`. The playing area is in the center of the screen. There are instructions on the left, score board on the right, mute sound button, and links to my personal sites.   

![Writeframe](others/wireframe.png)

## Architecture and Technologies
This project is implemented with the following technologies:
* Vanilla JavaScript for overall sctructure and game logic,
* D3.js for creating falling objects and bounding data
* Webpack to bundle many files into one

## Physics
### Collision Detection
Knowing when the objects collide is one of the most fundamentals of making game. However, to apply collision detection on every object with different shape is difficult. In Data Block, all objects are circles, which makes the logic less complicated. I use vector positions and circle radius to check if two circles are joining.  

If distance between centers of two circle is less than the sum of their radius, then they are hitting each other:

![](http://mathcentral.uregina.ca/qq/database/qq.09.09/h/hayden1.1.gif)

### Physics
* Gravity - The main force that pulls circles downward
* Spring Force - The force that causes circles change its direction when collision happens. The idea of spring force comes from bouncing ball material. [This article](http://electron6.phys.utk.edu/101/CH3/bouncing_balls.htm) explains this really well.   

Positions are updated after combine all forces applying on the object and calculating new velocity for each time frame.

## AI
The character's behavior is designed to run toward the closest falling object.  
To do it, I need to compare all distances of all circles in game window with the character, then make character move closer along x-axis to the closest circle

## Future features:
- [ ] More data sets. Let players choose which data set to play with.
- [ ] Display whole data set on the right side.
- [ ] More character icons.
- [ ] Implement rectangle objects
