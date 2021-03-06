export const randomSpeed = (limit = 20) => {
  let arraySpeed = []
  for(let i = 0; i < limit; i++) {
    arraySpeed.push(Math.floor((Math.random() * 10) + 90))
  }
  return arraySpeed;
}

export const average = arr => arr.reduce((a,b) => a + b, 0) / arr.length;

export const formatDate = date => {
  const fullDate = new Date(date)
  let stringDate = `${fullDate.getDate()}/${fullDate.getMonth()}/${fullDate.getFullYear()} - ${fullDate.getHours()}h${fullDate.getMinutes()}`
  return stringDate;
}