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
