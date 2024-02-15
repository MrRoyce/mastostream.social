
type TimeStamp = {
  seconds: number;
  nanoseconds: number;
}

const displayFormat = (date: string) => {
  const split = date.split('T')
  const hhmm = split[1].slice(0, 5)

  return `${split[0]} ${hhmm}`
}

export const formatDate = (ts: TimeStamp) => {
  try {
    const timestamp = {
      nanoseconds: ts.nanoseconds,
      seconds: ts.seconds
    };
    const total_miliseconds = (timestamp.seconds + (timestamp.nanoseconds) * 0.00000001) * 1000;

    const formattedDate = new Date(total_miliseconds).toISOString()

    return displayFormat(formattedDate)
  } catch (error) {
    console.error('Error formatting date:', error);
    throw error; // Propagate the error to the caller
  }
};
