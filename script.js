// import { bubbleSort } from "./bubbleSort.js";
// import { quickSort } from "./quickSort.js";
// import { insertionSort } from "./insertionSort.js";
// import { animate } from "./visualization.js";
const bubbleSortCanvas = document.getElementById("bubbleSortCanvas");
const quickSortCanvas = document.getElementById("quickSortCanvas");
bubbleSortCanvas.width = 800; //500
bubbleSortCanvas.height = 500; //300
quickSortCanvas.width = 800;
quickSortCanvas.height = 500;
const quickSortCtx = quickSortCanvas.getContext("2d");
const bubbleSortCtx = bubbleSortCanvas.getContext("2d");
const startTime = new Date().getTime();

const n = 18; //18
const array = [];

const stringHeight = bubbleSortCanvas.height * 0.4;

const socks = [];
const margin = 30;
const availableWidth = bubbleSortCanvas.width - margin * 2;
const spacing = availableWidth / n;

const colors = [
  "#D35400",
  "#2471A3",
  "#F39C12",
  "#B2BABB",
  "#138D75",
  "#52BE80",
  "#BB8FCE",
  "#555555",
  "#bcf60c",
  "#fabebe",
  "#9a6324",
  "#54A1D3",
  "#aaffc3",
  "#808000",
  "#333333",
];

const sockColors = [];

const tweenLength = 30;

let animationIsRunning = false;

for (let i = 0; i < n / 2; i++) {
  const t = i / (n / 2 - 1);
  sockColors.push(colors[i]);
  sockColors.push(colors[i]);
  array.push(lerp(0.3, 1, t));
  array.push(lerp(0.3, 1, t));
}

for (let i = 0; i < array.length; i++) {
  const j = Math.floor(Math.random() * array.length);
  [array[i], array[j]] = [array[j], array[i]];
  [sockColors[i], sockColors[j]] = [sockColors[j], sockColors[i]];
}

for (let i = 0; i < array.length; i++) {
  const u = Math.sin((i / (array.length - 1)) * Math.PI);
  const x = i * spacing + spacing / 2 + margin;
  const y = stringHeight + u * margin * 0.7;
  const height = bubbleSortCanvas.height * 0.4 * array[i];
  socks[i] = new Sock(x, y, height, sockColors[i]);
}

const bubBird = new Bird(
  socks[0].loc,
  socks[1].loc,
  bubbleSortCanvas.height * 0.2
);
const quickBird = new Bird(
  socks[0].loc,
  socks[1].loc,
  quickSortCanvas.height * 0.2
);

const moves = bubbleSort(array);
moves.shift();

function drawElements(ctx, socks) {
  for (const sock of socks) {
    // Customize the sock drawing here
    ctx.fillStyle = sock.color;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    // Example: Drawing a simple sock as a rectangle
    ctx.beginPath();
    ctx.rect(sock.loc.x, sock.loc.y, sock.width, sock.height);
    ctx.fill();
    ctx.stroke();
  }
}

const startButton = document.getElementById("startButton");
startButton.addEventListener("click", () => {
  if (!animationIsRunning) {
    // Start the animation if it's not already running
    animationIsRunning = true;
    animate();
    startQuickSortVisualization(quickSortCtx, quickSortMoves);
    startButton.textContent = "INCREASE SPEED";
  } else animate();
});

const stopButton = document.getElementById("stopButton");
stopButton.addEventListener("click", () => {
  // Stop the animation
  animationIsRunning = false;
  startButton.textContent = "Start Animation";
});

function animate() {
  if (!animationIsRunning) {
    // Stop the animation if the flag is false
    return;
  }
  bubbleSortCtx.clearRect(
    0,
    0,
    bubbleSortCanvas.width,
    bubbleSortCanvas.height
  );

  bubbleSortCtx.strokeStyle = "black";
  bubbleSortCtx.beginPath();
  bubbleSortCtx.moveTo(0, stringHeight - margin * 0.5);
  bubbleSortCtx.bezierCurveTo(
    bubbleSortCanvas.width / 4,
    stringHeight + margin,
    (3 * bubbleSortCanvas.width) / 4,
    stringHeight + margin,
    bubbleSortCanvas.width,
    stringHeight - margin * 0.5
  );
  bubbleSortCtx.stroke();

  let changed = false;
  for (let i = 0; i < socks.length; i++) {
    changed = socks[i].draw(bubbleSortCtx) || changed;
    Physics.update(socks[i].particles, socks[i].segments);
  }

  changed = bubBird.draw(bubbleSortCtx) || changed;

  if (new Date().getTime() - startTime > 1000 && !changed && moves.length > 0) {
    const nextMove = moves.shift();
    const [i, j] = nextMove.indices;
    if (nextMove.type == "swap") {
      socks[i].moveTo(socks[j].loc, tweenLength);
      socks[j].moveTo(socks[i].loc, tweenLength);
      bubBird.moveTo(socks[j].loc, socks[i].loc, false, tweenLength);
      [socks[i], socks[j]] = [socks[j], socks[i]];
    } else {
      // bird is moving
      bubBird.moveTo(socks[i].loc, socks[j].loc, true, tweenLength);
    }
  }

  requestAnimationFrame(animate);
}

function bubbleSort(array) {
  const moves = [];
  let n = array.length;
  let left = 1;
  do {
    var swapped = false;
    if ((n - left) % 2 == 1) {
      for (let i = left; i < n; i++) {
        moves.push({
          indices: [i - 1, i],
          type: "comparison",
        });
        if (array[i - 1] > array[i]) {
          swapped = true;
          [array[i - 1], array[i]] = [array[i], array[i - 1]];
          moves.push({
            indices: [i - 1, i],
            type: "swap",
          });
        }
      }
      n--;
    } else {
      for (let i = n - 1; i >= left; i--) {
        moves.push({
          indices: [i - 1, i],
          type: "comparison",
        });
        if (array[i - 1] > array[i]) {
          swapped = true;
          [array[i - 1], array[i]] = [array[i], array[i - 1]];
          moves.push({
            indices: [i - 1, i],
            type: "swap",
          });
        }
      }
      left++;
    }
  } while (swapped);
  return moves;
}

function quickSort(array) {
  const moves = [];

  // Helper function for Quick Sort
  function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      moves.push({
        indices: [j, high],
        type: "comparison",
      });
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        moves.push({
          indices: [i, j],
          type: "swap",
        });
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    moves.push({
      indices: [i + 1, high],
      type: "swap",
    });

    return i + 1;
  }

  function quickSortRecursive(arr, low, high) {
    if (low < high) {
      const partitionIndex = partition(arr, low, high);
      quickSortRecursive(arr, low, partitionIndex - 1);
      quickSortRecursive(arr, partitionIndex + 1, high);
    }
  }

  quickSortRecursive(array, 0, array.length - 1);

  return moves;
}
const quickSortMoves = quickSort(array);
// quickSortMoves.shift();
function startQuickSortVisualization(canvas, ctx, moves) {
  let i = 0;
  let animationStartTime = null;
  let animationDuration = 1000; // Duration for partitioning animation in milliseconds
  //quickBird.initialize(canvas.width / 2, canvas.height / 2);

  function animationLoop(timestamp) {
    if (i >= moves.length) {
      return; // All moves are done
    }

    const move = moves[i];

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawElements(ctx, socks);
    //quickBird.draw();

    // ... (existing code for drawing elements)

    if (move.type === "comparison") {
      // Highlight elements being compared (customize as needed)
      socks[move.indices[0]].highlight(comparisonColor);
      socks[move.indices[1]].highlight(comparisonColor);
    } else if (move.type === "swap") {
      // Highlight elements being swapped (customize as needed)
      socks[move.indices[0]].highlight(swapColor);
      socks[move.indices[1]].highlight(swapColor);

      // Perform the swap animation
      socks[move.indices[0]].moveTo(
        socks[move.indices[1]].loc,
        animationDuration
      );
      socks[move.indices[1]].moveTo(
        socks[move.indices[0]].loc,
        animationDuration
      );
      quickBird.moveTo(
        socks[move.indices[1]].loc,
        socks[move.indices[0]].loc,
        false,
        animationDuration
      );

      // Swap elements in your array (if needed)
      [array[move.indices[0]], array[move.indices[1]]] = [
        array[move.indices[1]],
        array[move.indices[0]],
      ];

      // Start the timing for the physics-based animation
      animationStartTime = timestamp;
      requestAnimationFrame(updatePositions);
    }

    // ... (existing code for drawing curves)

    // Request the next animation frame
    requestAnimationFrame(animationLoop);
  }

  function updatePositions(timestamp) {
    if (!animationStartTime) {
      animationStartTime = timestamp;
    }

    const elapsedTime = timestamp - animationStartTime;

    if (elapsedTime < animationDuration) {
      // Calculate the progress and update positions using the Physics class
      const progress = elapsedTime / animationDuration;
      Physics.update(
        socks.map((sock) => sock.particles),
        []
      );

      // Update the bird's animation
      const targetX = socks[moves[i].indices[1]].loc.x;
      const birdStartX = quickBird.lFoot.x;
      const birdEndX = quickBird.rFoot.x;

      quickBird.moveTo(
        {
          x: birdStartX + (targetX - birdStartX) * progress,
          y: quickBird.lFoot.y,
        },
        { x: birdEndX + (targetX - birdEndX) * progress, y: quickBird.rFoot.y },
        true, // Enable bouncing effect (if desired)
        animationDuration
      );

      // Continue the animation loop
      requestAnimationFrame(updatePositions);
    } else {
      // Increment to the next move
      i++;

      // Request the next animation frame
      requestAnimationFrame(animationLoop);
    }
  }

  // Start the animation loop
  requestAnimationFrame(animationLoop);
}

// Add event listener for tab clicks
document.addEventListener("DOMContentLoaded", function () {
  // Function to handle tab clicks and execute the appropriate sorting algorithm
  function handleTabClick(tabName) {
    // Hide all content sections
    var contents = document.getElementsByClassName("content");
    for (var i = 0; i < contents.length; i++) {
      contents[i].style.display = "none";
    }

    // Show the selected content section
    var selectedContent = document.getElementById(tabName + "Content");
    if (selectedContent) {
      selectedContent.style.display = "block";
    }
    if (tabName === "BubbleSort") {
      bubbleSortCtx.clearRect(
        0,
        0,
        bubbleSortCanvas.width,
        bubbleSortCanvas.height
      );
    } else if (tabName === "QuickSort") {
      quickSortCtx.clearRect(
        0,
        0,
        quickSortCanvas.width,
        quickSortCanvas.height
      );
    }

    // Execute the sorting algorithm corresponding to the tab (e.g., Bubble Sort)
    if (tabName === "BubbleSort") {
      const moves = bubbleSort(array); // Call your Bubble Sort function here
      moves.shift(); // Remove the first move if needed
      // Additional logic related to Bubble Sort visualization
    } else if (tabName === "QuickSort") {
      const quickSortMoves = quickSort(array); // Call your Quick Sort function here
      moves.shift(); // Remove the first move if needed
      startQuickSortVisualization(
        quickSortCanvas,
        quickSortCtx,
        quickSortMoves
      );
      // Additional logic related to Quick Sort visualization
    } else if (tabName === "Insertion Sort") {
      const moves = insertionSort(array); // Call your Insertion Sort function here
      moves.shift(); // Remove the first move if needed
      // Additional logic related to Insertion Sort visualization
    }
  }

  // Add click event listeners for each tab
  var tabs = document.getElementsByClassName("nav-link");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener("click", function (event) {
      var tabName = event.target.textContent.trim();
      handleTabClick(tabName);
    });
  }

  // Initially show the default tab content (e.g., Bubble Sort)
  handleTabClick("BubbleSort");
});
