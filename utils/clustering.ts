/**
 * Calculates the Euclidean distance between two points (1D).
 */
const distance = (a: number, b: number): number => Math.abs(a - b);

/**
 * Calculates the mean of an array of numbers.
 */
const mean = (arr: number[]): number => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

/**
 * A simple implementation of the K-Means clustering algorithm for 1D data.
 * @param data An array of numbers to cluster.
 * @param k The number of clusters to form.
 * @returns An object containing the final clusters (as arrays of numbers) and their centroids.
 */
export const kmeans1d = (data: number[], k: number): { clusters: number[][], centroids: number[] } => {
  if (data.length < k || k <= 0) {
    return { clusters: [data], centroids: data.length > 0 ? [mean(data)] : [] };
  }
  
  // 1. Initialize centroids by picking k unique random points from the data
  let centroids: number[] = [];
  const uniqueData = Array.from(new Set(data));
  const shuffled = uniqueData.sort(() => 0.5 - Math.random());
  centroids = shuffled.slice(0, k);
  
  // If not enough unique points, fill with random values from range
  if (centroids.length < k) {
      const dataMin = Math.min(...data);
      const dataMax = Math.max(...data);
      while(centroids.length < k) {
          centroids.push(Math.random() * (dataMax - dataMin) + dataMin);
      }
  }


  let iterations = 0;
  const MAX_ITERATIONS = 30;
  let assignments: number[] = new Array(data.length);

  while (iterations < MAX_ITERATIONS) {
    let changed = false;
    
    // 2. Assign each point to the nearest centroid
    data.forEach((point, pointIndex) => {
        let minDistance = Infinity;
        let closestCentroidIndex = -1;
        
        centroids.forEach((centroid, centroidIndex) => {
            const d = distance(point, centroid);
            if (d < minDistance) {
                minDistance = d;
                closestCentroidIndex = centroidIndex;
            }
        });

        if (assignments[pointIndex] !== closestCentroidIndex) {
            changed = true;
        }
        assignments[pointIndex] = closestCentroidIndex;
    });

    if (!changed) break;

    // 3. Recalculate centroids
    const newCentroids: number[] = new Array(k);
    for (let i = 0; i < k; i++) {
        const clusterPoints = data.filter((_, pointIndex) => assignments[pointIndex] === i);
        if (clusterPoints.length > 0) {
            newCentroids[i] = mean(clusterPoints);
        } else {
            // Re-initialize empty clusters to a random point to avoid collapse
            newCentroids[i] = data[Math.floor(Math.random() * data.length)];
        }
    }
    centroids = newCentroids;
    iterations++;
  }
  
  // 4. Group data points into final clusters
  const clusters: number[][] = Array.from({ length: k }, () => []);
  data.forEach((point, index) => {
      clusters[assignments[index]].push(point);
  });
  
  return { clusters, centroids };
};