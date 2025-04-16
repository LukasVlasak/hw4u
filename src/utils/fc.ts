import { useTranslation } from "react-i18next";

function formatDateToDDMMYYYY(date: Date | undefined): string {
    if (!date) return "";
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
  
    return day + "." + month + "." + year;
}

export const deleteConfirm = (message: string) => {
  return window.confirm(message);
}

export default formatDateToDDMMYYYY;