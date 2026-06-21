/**
 * Distributes an integer total across weighted buckets with the largest remainder method
 * so the returned values always add up to the requested total exactly.
 */
export function allocateByWeights(total: number, weights: number[]): number[] {
  const rawAllocations = weights.map((weight) => total * weight);
  const floorAllocations = rawAllocations.map((value) => Math.floor(value));
  const remainder = total - floorAllocations.reduce((sum, value) => sum + value, 0);

  const rankedRemainders = rawAllocations
    .map((value, index) => ({ index, remainder: value - floorAllocations[index]! }))
    .sort((first, second) => second.remainder - first.remainder);

  for (const allocation of rankedRemainders.slice(0, remainder)) {
    floorAllocations[allocation.index] = floorAllocations[allocation.index]! + 1;
  }

  return floorAllocations;
}
