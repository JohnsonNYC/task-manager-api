//Mocking refers to replacing the real functions that run with function you define within the test environment
// Why do we want this? In the test, emails are being sent to emails that don't exist. 
// We won't actually send those emails off! 

module.exports = {
  setApiKey(){
    //the actual functions don't return anything therefore, these can remain blank
  },
  send(){

  }
}