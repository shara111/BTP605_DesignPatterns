// Holds the data (e.g., array, linked list).
// Uses Observer to notify views of changes.
// Methods: insert(value), reset(), sort(algorithm).
//Pattern: Observer
class DataStructureModel {
  constructor() {
    this.data = [];
    this.observers = [];
  }
  addObserver(observer) {
    this.observers.push(observer);
  }
  notifyObservers() {
    this.observers.forEach((observer) => observer.update(this.data));
  }
  //METHODS
  //Adds a value to the data array and notifies observers
  insert(value) {
    this.data.push(value);
    this.notifyObservers();
  }
  //Clears the data array and notifies observers
  reset() {
    this.data = [];
    this.notifyObservers();
  }
  //Sorts the data using the provided algorithm and notifies observers
  sort(algorithm) {
    algorithm.sort(this.data);
    this.notifyObservers();
  }
}

// ================== View ==================
// Abstract class for rendering data.

// Subclasses: BarVisual, TextVisual.

// Uses Factory Method to create visuals.
class VisualRepresentation {
  constructor(model) {
    this.model = model;
    this.model.addObserver(this);
  }
  update(data) {
    //Abstract method to be overridden
  }
}

// ================== BarVisual ==================
class BarVisual extends VisualRepresentation {
  update(data) {
    console.log("Rendering bars:", data);
  }
}

// ================== TextVisual ==================
class TextVisual extends VisualRepresentation {
  update(data) {
    console.log("Rendering text:", data);
  }
}

// ================== Factory Method ==================
//For creating visuals
class VisualFactory {
  static createVisual(type, model) {
    if (type === "bar") return new BarVisual(model);
    if (type === "text") return new TextVisual(model);
    throw new Error("Invalid visual type");
  }
}

// ================== AnimationController (Controller) ==================
//Purpose: Manages the animation state (play/pause,speed)
//Pattern: Singleton: Ensures only one instance of the controller exists
//Methods: play(), pause(), setSpeed()
class AnimationController {
  constructor(model) {
    if (AnimationController.instance) {
      return AnimationController.instance;
    }
    this.model = model;
    this.isPlaying = false;
    this.speed = 1;
    AnimationController.instance = this;
  }
  play() {
    this.isPlaying = true;
    console.log("Animation playing...");
  }

  pause() {
    this.isPlaying = false;
    console.log("Animation paused...");
  }

  setSpeed(speed) {
    this.speed = speed;
    console.log("Speed set to:", speed);
  }
}

//Algorithm: Strategy
//Purpose: Encapsulate sorting algorithms
//Key CLasses:
//Bubble sort, Insertion sort
//Strategy Pattern: Allows easy swapping between algorithms

const controller = new AnimationController();
// ================== Algorithms (Strategy) ==================
class Algorithm {
  sort(data) {
    // Abstract method to be overridden
  }
}

// ================== BubbleSort ==================
class BubbleSort extends Algorithm {
  sort(data) {
    console.log("Sorting using BubbleSort...");
    // Implement BubbleSort logic
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data.length - i - 1; j++) {
        if (data[j] > data[j + 1]) {
          [data[j], data[j + 1]] = [data[j + 1], data[j]];
        }
      }
    }
  }
}
class InsertionSort extends Algorithm {
  sort(data) {
    console.log("Sorting using InsertionSort...");
    // Implement InsertionSort logic
    for (let i = 1; i < data.length; i++) {
      let key = data[i];
      let j = i - 1;
      while (j >= 0 && data[j] > key) {
        data[j + 1] = data[j];
        j--;
      }
      data[j + 1] = key;
    }
  }
}
// ================== UI Components (Command) ==================
//Purpose; Handles user actions (eg., play, reset)
//Key Classses: 
//PlayCommand, ResetCommand
//Command pattern: Encapsulates actions as objects
class Command {
  execute() {
    //Abstract method to be overridden
  }
}
class PlayCommand extends Command {
  constructor(controller) {
    super();
    this.controller = controller;
  }
  execute() {
    this.controller.play();
  }
}
class ResetCommand extends Command {
  constructor(model) {
    super();
    this.model = model;
  }
  execute() {
    this.model.reset();
  }
}

// ==================(main)==================
//Initialize model
const model = new DataStructureModel();

//Create visuals using Factory Method
const barVisual = VisualFactory.createVisual("bar", model);
const textVisual = VisualFactory.createVisual("text", model);

//Create UI Commands
const playButton = new PlayCommand(controller);
const resetButton = new ResetCommand(model);

//Simulate user actions
model.insert(5);
model.insert(3);
model.insert(8);

//Play animation
playButton.execute();
// Sort using BubbleSort
const bubbleSort = new BubbleSort();
model.sort(bubbleSort);

// Reset animation
resetButton.execute();

//1.Inserting Values
//What is happening 
//1. The insert(value) method is called three times with values 5, 3, and 8.
//2. Each time a value is inserted, the DataStructureModel notifies its observers (BarVisual and TextVisual)
//2. The observers log the current state of the data array to the console.


//2. Playing Animation
//1. The PlayCommand is executed, which calls the play() method of the AnimationController
//2. The controller logs Animation playing... to indicate the animation has started

//3. Sorting DATA
//1. The sort(algorithm) method is called with an instance of BubbleSort
//2. The BubbleSort algorithm sorts the data array from [5,3,8] to [3,5,8]
//3. After sorting, the DataStructureModel notifies its observers (BarVisual and TextVisual)


//4. Resetting Animation
//1. The ResetCommand is executed, which calls the reset() method of the DataStuctureModel
//2. The data array is cleared and the observers log an empty array