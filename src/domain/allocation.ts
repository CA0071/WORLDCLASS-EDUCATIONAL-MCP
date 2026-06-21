/**
 * Distributes an integer total across weighted buckets with the largest remainder method
 * so the returned values always add up to the requested total exactly.
 */
export function allocateByWeights<const T extends readonly number[]>(
  total: number,
  weights: T,
): { [K in keyof T]: number } {
  const rawAllocations = weights.map((weight) => total * weight);
  const floorAllocations = rawAllocations.map((value) => Math.floor(value));
  const remainder = total - floorAllocations.reduce((sum, value) => sum + value, 0);

  const rankedRemainders = rawAllocations
    .map((value, index) => ({ index, remainder: value - floorAllocations[index]! }))
    .sort((first, second) => second.remainder - first.remainder);

  for (const allocation of rankedRemainders.slice(0, remainder)) {
    floorAllocations[allocation.index] = floorAllocations[allocation.index]! + 1;
  }

  return floorAllocations as { [K in keyof T]: number };
}
