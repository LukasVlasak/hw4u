function formatDateToDDMMYYYY(date: Date) {
    const d = new Date(date);
    let day = '' + d.getDate();
    let month = '' + (d.getMonth() + 1);
    const year = d.getFullYear();
  
    if (day.length < 2) {
      day = '0' + day;
    }
    if (month.length < 2) {
      month = '0' + month;
    }
  
    return new Date([day, month, year].join('.'));
  }

export default formatDateToDDMMYYYY;