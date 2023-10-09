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
