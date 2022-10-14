export function getDayOfTheYear() {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = now.getTime() - start.getTime();
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  return day
}
