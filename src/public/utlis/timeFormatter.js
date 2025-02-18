export function formatTime(time, format) {
  if (!time) return "";

  if (/^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
    const [hours, minutes, seconds = "00"] = time.split(":");
    switch (format) {
      case "HH:mm":
        return `${hours}:${minutes}`;

      case "HH:mm:ss":
        return `${hours}:${minutes}:${seconds}`;

      default:
        return `${hours}:${minutes}:${seconds}`;
    }
  }

  const date = new Date(time);

  switch (format) {
    case "HH:mm":
      return date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });

    case "HH:mm:ss":
      return date.toLocaleTimeString("en-GB");

    case "YYYY-MM-DD":
      return date.toISOString().split("T")[0];

    case "DD/MM/YYYY":
      return date.toLocaleDateString("en-GB");

    case "MM/DD/YYYY":
      return date.toLocaleDateString("en-US");

    case "YYYY-MM-DD HH:mm:ss":
      return `${date.toISOString().split("T")[0]} ${
        date.toTimeString().split(" ")[0]
      }`;

    default:
      return date.toLocaleString();
  }
}
