export function shortDate(date){
      return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export function longDate(date){
      return new Date(date).toString();
}