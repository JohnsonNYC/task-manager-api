const {calculateTip, fahrenheitToCelsius, celsiusToFarenheit} = require('../src/math') // Connect to file that this is testing

test('Should calculate total with tip', () => {
  const total = calculateTip(10,.3)
  expect(total).toBe(13)
  // if(total !== 13){
  //   throw new Error('Expected total to be 13. Got ' + total )
  // }
})

test('Should calculate total with default', () => {
  const total = calculateTip(10)
  expect(total).toBe(12.5)
})

test('Should convert 32 F to 0 C', () => {
  const temp = fahrenheitToCelsius(32)
  expect(temp).toBe(0)
})

test('Should convert 0 C to 32 F', () => {
  const temp = celsiusToFarenheit(0)
  expect(temp).toBe(32)
})

// // Why Test 
//   // Testing saves so much time 
//   // Creates reliable software 
//   // Gives flexibility to Devs
//     // Refactoring 
//     // Collaboration
//     // Profiling
//   // Peace of Mind

