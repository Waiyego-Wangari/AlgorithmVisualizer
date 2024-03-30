function insertionSort(array) {
    const moves = [];
    let n = array.length;
  
    for (let i = 1; i < n; i++) {
      let key = array[i];
      let j = i - 1;
  
      // Move elements of array[0..i-1], that are greater than key,
      // to one position ahead of their current position
      while (j >= 0 && array[j] > key) {
        moves.push({
          indices: [j, j + 1],
          type: "comparison",
        });
  
        array[j + 1] = array[j];
        moves.push({
          indices: [j, j + 1],
          type: "swap",
        });
        j = j - 1;
      }
      array[j + 1] = key;
    }
    return moves;
  }
  
