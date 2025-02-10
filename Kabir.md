## Design Philosophy

I aimed to separate concerns effectively. I wanted to decouple data structures and algorithms from their visual representation and provide a clean mechanism for managing user interactions and animation control. Behavioral design patterns proved particularly relevant for this goal.

## Key Design Patterns and Their Application

### 1. Template Method (for Algorithms)

This pattern is central to my design. It allows me to define the general structure of an algorithm (like sorting) while deferring the specific implementation details to subclasses.

*   **How it helps:** Sorting algorithms share a common structure: initialization, comparisons, swaps, finalization. The Template Method pattern captures this structure in an abstract `SortAlgorithm` class. Concrete algorithms (`BubbleSort`, `MergeSort`) then implement only the *specific* steps. This eliminates redundant code and simplifies adding new algorithms.

*   **Example:** `SortAlgorithm` defines `sort()` (the template) which calls abstract methods like `initialize()`, `step()`, and `isComplete()`. `BubbleSort` extends `SortAlgorithm` and implements these abstract methods with bubble sort logic. Calling `sort()` on a `BubbleSort` instance executes the bubble sort algorithm within the defined template.

### 2. Observer (for Data Updates)

The Observer pattern manages the relationship between the data (Model) and its visual representation (View).

*   **How it helps:** The `DataStructure` (e.g., `ArrayDataStructure`) acts as the *Subject*. The `DataStructureView` is the *Observer*. When the data changes (e.g., during sorting), the `DataStructure` notifies its Observers (the Views) to update the animation. This automatic update mechanism promotes loose coupling and modularity.

*   **Example:** Adding a value to `ArrayDataStructure` triggers a notification to `DataStructureView`, which then redraws the array visualization.

### 3. Strategy (for Visualization)

The Strategy pattern allows me to easily switch between different visualization styles for the same data.

*   **How it helps:** I define separate "visualization strategies" (e.g., `BarVisualization`, `NumberVisualization`). The `DataStructureView` uses a chosen strategy to render the data. Changing visualizations becomes a simple matter of swapping strategy objects. This isolates visualization logic from data and animation logic.

*   **Example:** An array can be visualized as bars (using `BarVisualization`) or numbers (using `NumberVisualization`) without altering the array or sorting algorithm.

### 4. State (for Animation Control)

The State pattern manages the animation's various states (playing, paused, stopped).

*   **How it helps:** It simplifies the `AnimationController` by delegating behavior based on the current state. Instead of numerous `if` statements, the `AnimationController` interacts with the current state object. Each state object defines how to handle actions (play, pause, etc.), leading to cleaner and more extensible code.

*   **Example:** In the `PlayingState`, `animate()` performs a sorting step and requests the next frame. In the `PausedState`, `animate()` does nothing.

### 5. Command (for User Actions - Conceptual)

While not fully implemented in the stubs below, I plan to use the Command pattern to represent user actions (play, pause, add value, reset) as objects.

*   **How it helps:** This will facilitate implementing undo/redo functionality and further decouple the `AnimationController` from specific actions. Each command object will encapsulate the execution and potential undoing of an action.

## Class Structure (Stubs)

```javascript
// Model (Data Structures & Algorithms)
class DataStructure {
  constructor() {
    this.data = [];
    this.observers = [];
  }
  attach(observer) { this.observers.push(observer); }
  detach(observer) { /* ... */ }
  notifyObservers() { this.observers.forEach(o => o.update(this.data)); }
  insert(value) { /* Abstract */ }
  // ... other data structure methods
}

class ArrayDataStructure extends DataStructure {
  insert(value) { this.data.push(value); this.notifyObservers(); }
  // ... other array-specific methods
}

class SortAlgorithm {  // Template Class
  constructor(dataStructure) { this.dataStructure = dataStructure; }
  sort() {
    this.initialize();
    while (!this.isComplete()) {
      this.step();
      this.dataStructure.notifyObservers();
    }
    this.finalize();
  }
  initialize() { /* Abstract */ }
  isComplete() { /* Abstract */ }
  step() { /* Abstract */ }
  finalize() { /* Abstract */ }
}

class BubbleSort extends SortAlgorithm {
  initialize() { /* ... */ }
  isComplete() { /* ... */ }
  step() { /* ... */ }
  finalize() { /* ... */ }
}

// View (Visualization)
class DataStructureView {
  constructor(dataStructure, visualizationStrategy) {
    this.dataStructure = dataStructure;
    this.dataStructure.attach(this);
    this.visualizationStrategy = visualizationStrategy;
  }
  update(data) { this.draw(); }
  draw() { this.visualizationStrategy.visualize(this.dataStructure.data); }
}

class BarVisualization {
  visualize(data) { /* p5.js drawing logic for bars */ }
}

class NumberVisualization {
  visualize(data) { /* p5.js drawing logic for numbers */ }
}

// Controller (User Interaction & Animation Control)
class AnimationController {
  constructor(dataStructure, dataStructureView, sortAlgorithm) {
    this.dataStructure = dataStructure;
    this.dataStructureView = dataStructureView;
    this.sortAlgorithm = sortAlgorithm;
    this.state = new StoppedState(this); // Initial state
  }
  setState(state) { this.state = state; }
  play() { this.state.play(); }
  pause() { this.state.pause(); }
  addValue(value) { this.dataStructure.insert(value); }
  reset() { /* ... */ }
  animate() { this.state.animate(); }
}

// State Pattern
class AnimationState {
  constructor(controller) { this.controller = controller; }
  play() { /* Abstract */ }
  pause() { /* Abstract */ }
  animate() { /* Abstract */ }
}

class PlayingState extends AnimationState {
  play() { /* ... */ }
  pause() { this.controller.setState(new PausedState(this.controller)); }
  animate() {
    this.controller.sortAlgorithm.sort();
    requestAnimationFrame(this.controller.animate.bind(this.controller));
  }
}

class PausedState extends AnimationState {
  play() { this.controller.setState(new PlayingState(this.controller)); this.controller.animate(); }
  pause() { /* ... */ }
  animate() { /* ... */ }
}

class StoppedState extends AnimationState {
    play() {
        this.controller.setState(new PlayingState(this.controller));
        this.controller.animate();
    }
    pause() {}
    animate() {}
}

// p5.js setup and draw functions
let controller;

function setup() {
  createCanvas(400, 400);
  let arrayData = new ArrayDataStructure();
  let barVisualization = new BarVisualization();
  let arrayView = new DataStructureView(arrayData, barVisualization);
  let bubbleSort = new BubbleSort(arrayData);
  controller = new AnimationController(arrayData, arrayView, bubbleSort);

  controller.addValue(5);
  controller.addValue(2);
  controller.addValue(8);
}

function draw() {
  background(220);
}
