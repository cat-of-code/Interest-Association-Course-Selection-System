function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatDay(date) {
  // console.log(date)
  var year = date.getFullYear()
  var month = date.getMonth() + 1;
  if(month<10){
    month = 0+String(month)
  }
  var day = date.getDate()

  return year+'/'+month+'/'+day
}

function date2num(activity_date){
  console.log(activity_date)
  
  var num2 = parseInt(activity_date.slice(0,3))*10000+parseInt(activity_date.slice(5,6))*100+parseInt(activity_date.slice(8,9))
  console.log(num2)
  return num2
}

module.exports = {
  formatTime: formatTime,
  formatDay: formatDay,
  date2num: date2num
}
