const calculateTip = (total, tipPercent = .25) => {
  const tip = total * tipPercent
  return total + tip
}

const fahrenheitToCelsius = (temp)=>{
  return (temp - 32)/1.8
}

const celsiusToFarenheit = (temp) => {
  return (temp * 1.8) + 32 
}

// Goal
// Export both function and import to test file 
// Create "Should convert 32 F to 0 C"
// Create "Should convert 0 C to 32 F"
// Run Test on Jest to 
module.exports = {
  calculateTip,
  fahrenheitToCelsius,
  celsiusToFarenheit
}