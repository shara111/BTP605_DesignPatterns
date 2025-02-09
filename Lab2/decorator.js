// Label Class
class Label {
    constructor(labelText, x, y) {
        this.labelText = labelText || "";
        this.x = x || 200;
        this.y = y || 200;
    }

    draw() {
        strokeWeight(1);
        stroke(0, 0, 0);
        fill(0, 0, 0);
        textAlign(CENTER, CENTER);
        text(this.labelText, this.x, this.y);
    }
}

// Base Decorator Class
class LabelDecorator {
    constructor(label) {
        this.label = label;
    }

    draw() {
        this.label.draw();
    }
}

// Thin Border Decorator
class ThinBorderDecorator extends LabelDecorator {
    draw() {
        super.draw();
        rectMode(CENTER);
        strokeWeight(1);
        stroke(0, 0, 0);
        noFill();
        rect(this.label.x, this.label.y, textWidth(this.label.labelText) + 20, 40);
    }
}

// Thick Border Decorator
class ThickBorderDecorator extends LabelDecorator {
    draw() {
        super.draw();
        rectMode(CENTER);
        strokeWeight(3);
        stroke(0, 0, 0);
        noFill();
        rect(this.label.x, this.label.y, textWidth(this.label.labelText) + 30, 50);
    }
}

// Dots Border Decorator
class DotsBorderDecorator extends LabelDecorator {
    draw() {
        super.draw();
        ellipseMode(CENTER);
        strokeWeight(1);
        fill(255, 0, 0);
        stroke(255, 0, 0);
        let width = textWidth(this.label.labelText) + 20;
        let height = 40;
        for (let i = 0; i < width / 10 + 1; i++) {
            ellipse((this.label.x - width / 2 + i * 10), (this.label.y - height / 2), 5, 5);
            ellipse((this.label.x - width / 2 + i * 10), (this.label.y + height / 2), 5, 5);
        }
        for (let i = 0; i < height / 10 - 1; i++) {
            ellipse((this.label.x - width / 2), (this.label.y - height / 2 + ((i + 1) * 10)), 5, 5);
            ellipse((this.label.x + width / 2), (this.label.y - height / 2 + ((i + 1) * 10)), 5, 5);
        }
    }
}

// Custom Background Color Decorator
class BackgroundColorDecorator extends LabelDecorator {
    constructor(label, color) {
        super(label);
        this.color = color;
    }

    draw() {
        fill(this.color);
        noStroke();
        rect(this.label.x - textWidth(this.label.labelText) / 2 - 10, this.label.y - 20, textWidth(this.label.labelText) + 20, 40);
        super.draw();
    }
}

var labels = [];
var labelDecoratorStacks = [];
var thickBorderButton;
var borderButton;
var dotButton;
var backgroundColorButton;
var removeButton;
var selectLabelRadio;
var selected;
var numLabels;

/*
  these functions are called when button is pressed
  modify the "add" functions to apply decorator to the 
  selected label.   
*/
function addThinBorder() {
    labels[selected] = new ThinBorderDecorator(labels[selected]);
    labelDecoratorStacks[selected].push('thin');
}

function addThick() {
    labels[selected] = new ThickBorderDecorator(labels[selected]);
    labelDecoratorStacks[selected].push('thick');
}

function addDots() {
    labels[selected] = new DotsBorderDecorator(labels[selected]);
    labelDecoratorStacks[selected].push('dots');
}

function addBackgroundColor() {
    labels[selected] = new BackgroundColorDecorator(labels[selected], color(200, 200, 255));
    labelDecoratorStacks[selected].push('background');
}

function removeLastBorder() {
    if (labelDecoratorStacks[selected].length > 0) {
        labelDecoratorStacks[selected].pop();
        let baseLabel = new Label(labels[selected].labelText, labels[selected].x, labels[selected].y);
        labels[selected] = baseLabel;
        labelDecoratorStacks[selected].forEach(decorator => {
            if (decorator === 'thin') labels[selected] = new ThinBorderDecorator(labels[selected]);
            if (decorator === 'thick') labels[selected] = new ThickBorderDecorator(labels[selected]);
            if (decorator === 'dots') labels[selected] = new DotsBorderDecorator(labels[selected]);
            if (decorator === 'background') labels[selected] = new BackgroundColorDecorator(labels[selected], color(200, 200, 255));
        });
    }
}

/*********************************************************/
/* NOTHING BELOW THIS COMMENT IS TO BE MODIFIED          */
/*********************************************************/

function setup() {
    createCanvas(600, 500);

    thickBorderButton = createButton("Add Thick Border");
    thickBorderButton.mousePressed(addThick);
    thickBorderButton.position(10, 550);

    borderButton = createButton("Add Thin Border");
    borderButton.mousePressed(addThinBorder);
    borderButton.position(160, 550);

    dotButton = createButton("Add Dots Border");
    dotButton.mousePressed(addDots);
    dotButton.position(310, 550);

    backgroundColorButton = createButton("Add Background Color");
    backgroundColorButton.mousePressed(addBackgroundColor);
    backgroundColorButton.position(460, 550);

    removeButton = createButton("Remove Last");
    removeButton.mousePressed(removeLastBorder);
    removeButton.position(610, 550);

    selectLabelRadio = createRadio();
    numLabels = 5;
    for (var i = 0; i < numLabels; i++) {
        selectLabelRadio.option("" + i, "Label " + (i + 1));
        labels[i] = new Label("Label " + (i + 1), random(50, 550), random(20, 480));
        labelDecoratorStacks[i] = []; // Initialize the decorator stack for each label
    }
    selectLabelRadio.selected(0);
}

function draw() {
    selected = selectLabelRadio.value();
    background(255, 255, 255);
    for (var i = 0; i < numLabels; i++) {
        labels[i].draw();
    }
}