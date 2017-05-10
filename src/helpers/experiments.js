export const getPeakData = peak => {
  const { threshold, decay, min, max, lastPeak } = peak
  return `${threshold}, ${decay}, ${min}, ${max}, ${lastPeak}`
}

const DATA = Array.from({ length: 20 }, (v, k) => k)

function *generator () {
  for (let value in DATA) {
    yield value
  }
}

export const exampleWithGenerator = () => {
  let iterator = generator()
  for (let i = 0; i < DATA.length; i++) {
    iterator.next()
  }
  return iterator.next().done
}

export const sumOfArray = () => {
  let sum = 0
  for (let value in DATA) {
    sum += value
  }
  return sum
}
