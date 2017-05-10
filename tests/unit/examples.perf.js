import {
  getPeakData as transpiledGetPeakData,
  exampleWithGenerator as transpiledExampleWithGenerator,
  sumOfArray as transpiledSumOfArray
} from '../../src/helpers/experiments'

import {
  getPeakData as nativeGetPeakData,
  exampleWithGenerator as nativeExampleWithGenerator,
  sumOfArray as nativeSumOfArray
} from '!!../../src/helpers/experiments'

suite('Destructuring & string template example', () => {
  const peak = { min: 563, max: 1024, decay: 230.5, threshold: 0, lastPeak: 281 }

  benchmark('transpiled getPeakData', () => {
    transpiledGetPeakData(peak)
  })

  benchmark('native getPeakData', () => {
    nativeGetPeakData(peak)
  })
})

suite('Generator & Array.from examples', () => {
  benchmark('transpiled exampleWithGenerator', () => {
    transpiledExampleWithGenerator()
  })

  benchmark('native exampleWithGenerator', () => {
    nativeExampleWithGenerator()
  })
})

suite('For of loop example', () => {
  benchmark('transpiled sumOfArray', () => {
    transpiledSumOfArray()
  })

  benchmark('native sumOfArray', () => {
    nativeSumOfArray()
  })
})
