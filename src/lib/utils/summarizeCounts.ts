export const summarizeCounts = ({ documents, hours }) => {
  const hourlyData = {};

  documents.forEach((doc) => {
    const timestamp = doc.timestamp.toDate();
    // Calculate the difference in hours
    const hourDifference = Math.floor((Date.now() - timestamp.getTime()) / (1000 * 60 * 60));

    // Only consider data within the last passed hours
    if (hourDifference >= 1 && hourDifference <= hours) {
      const hourKey = `-${hourDifference}`;

      if (!hourlyData[doc.collection]) {
        hourlyData[doc.collection] = {};
      }

      if (!hourlyData[doc.collection][hourKey]) {
        hourlyData[doc.collection][hourKey] = 0;
      }

      hourlyData[doc.collection][hourKey] += doc.count;

    }
  });

  return hourlyData
}