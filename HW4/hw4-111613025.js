"use strict";

class Calendar {
    constructor(year, month) {
        if (typeof year == "undefined") {
            this.year = (new Date()).getFullYear();
        } else {
            this.year = year;
        }
        if (typeof month == "undefined") {
            this.month = (new Date()).getMonth() + 1;
        } else {
            this.month = month;
        }
    }
    html(year, month) {
        let out = "";
        if (typeof year == "undefined") {
            year = this.year;  //the year of the Calendar object
        }
        if (typeof month == "undefined") {
            month = this.month;
        }
        //console.log(year,month);

        let day = (new Date(year, month-1, 1)).getDay()
        //0:Sunday 6: Saturday

        let amountDays = new Date(new Date(year, (month) % 12, 1)- 1).getDate();
        //the first date of next month - 1 = the last date of this month
        
        //the title for calendar(year, month, day)
        out += `<table>
                    <tr><td colspan='7' class='table-title'>${year} 年 ${month} 月</td></tr>
                    <tr class='week-title'><td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td>
                    </tr>`;

        //add space before day1 start
        for (let i = 0; i < day; i++) {
            out += '<td>&nbsp</>';
        }

        let count = day;
        for (let i = 1; i <= amountDays; i++) {
            out += `<td>${i}</>`;
            count += 1
            if (count % 7 == 0) { //the end of the week
                out += '</tr>'
            }
        }
        out += "</table>"
        return out;
    }
}

let todayCal = new Calendar();
document.write(todayCal.html()); //calendar for current month

let cal = new Calendar(2023,12);
document.write(cal.html()); //calendar for 2023,12
document.write(cal.html(2004,8)); //calendar for 2004,8