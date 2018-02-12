# Data Block

## Overview
Data Block is a 2D game built with purely JavaScript and its data-driven library `D3.js`. In Data Block, players will use the mouse to control a shield to protect a character from being hit by _big blocks of data_ falling down from the sky.   
Each data block has a shape such as a circle, a bar. The size of a block is determined by the size of its corresponding data which is bounded to it.

## Functionality & MVP
- [ ] Create circles and bars with colors and sizes corresponding to their bounded data.
- [ ] Apply basic Physic Laws on all objects (gravity, collision, damping force)
- [ ] Make sounds on collisions
- [ ] Randomly get data and bound it to a object, and let the object fall from sky
- [ ] Score on hitting the falling data blocks   

In addition:
- [ ] Add character picture
- [ ] Make rotating objects

## Wireframe
This game has one single screen with the `svg` element created by `D3`. The playing area is in the center of the screen. There are instructions on the left, score board on the right, mute sound button, and links to my personal sites.   

![Writeframe](others/Data-block.svg)

## Architecture and Technologies
This project will be implemented with the following technologies:
* Vanilla JavaScript for overall sctructure and game logic,
* D3.js for creating falling objects and bounding data
* Webpack to bundle many files into one

## Timeline
**Weekend**:
- [x] Thinking of ideas.
- [x] Testing out different projects
- [x] Writing proposal
- [x] Set up npm packages(webpack, d3)   

**Day 1**:
- [ ] Create circle objects by D3
- [ ] Create class `Circle`, class `Bar`
- [ ] Find a way to bind D3 element with class
- [ ] Create game loop

**Day 2**:
- [ ] Get gravity working   
- [ ] Create character
- [ ] Create shield
- [ ] Get collision working
- [ ] Learn how to move an object with player mouse

**Day 3**:   
- [ ] Choose and test API call
- [ ] Bind data into object, and test object's size with its data
- [ ] Test game overall

**Day 4**:
- [ ] Add score board
- [ ] Add sounds
- [ ] Add instructions
- [ ] Add personal links
- [ ] Styling
