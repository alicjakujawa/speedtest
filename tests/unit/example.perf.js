suite('Array iteration', () => {
  benchmark('_.each', () => {
    Array.from(new Array(1000), () => 'a').forEach((el) => {
      return el
    })
  })
})
