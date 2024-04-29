function parseTimestampWithNanoseconds(datetimeString) {
    // Parse the datetime string
    const parsedDate = new Date(datetimeString);

    // Get the milliseconds since Unix Epoch
    const milliseconds = parsedDate.getTime();

    // Get the nanoseconds by extracting milliseconds and multiplying by 1e6
    const nanoseconds = parsedDate.getMilliseconds() * 1e6;

    // Return the timestamp object with seconds and nanoseconds
    return {
        seconds: Math.floor(milliseconds / 1000),
        nanoseconds: nanoseconds
    };
}

// Example usage
const datetimeString = '2024-04-28 22:09';
const timestamp = parseTimestampWithNanoseconds(datetimeString);
console.log(timestamp);