interface MyObject {
  [key: string]: number | string | any; // Adjust as needed
}

export const sortByAttribute = (objects: MyObject[], attributeName: string, direction = false): MyObject[] => {
  return objects.sort((a, b) => {
    const valueA = a[attributeName];
    const valueB = b[attributeName];

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return direction ? valueA - valueB : valueB - valueA;
    }

    // Add additional logic for other types if needed

    // Default to comparing as strings if not numbers
    return direction ?
      String(valueA).localeCompare(String(valueB)) : String(valueB).localeCompare(String(valueA));
  });
}