
module.exports.getDate=function getDate(){
let today=new Date();
  let options={
    year:"numeric",
    month:"numeric",
    day:"numeric"
  }
  return today.toLocaleDateString("en-US",options);}
  module.exports.getDay=function getDay(){
    let today=new Date();
      let options={
        weekday:"long",
        year:"numeric",
        
      }
      return today.toLocaleDateString("en-US",options);}
