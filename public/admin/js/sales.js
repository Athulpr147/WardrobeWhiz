


const all_sales_view = document.getElementById('all_sales_view')
const today_sales_view = document.getElementById('today_sales_view')
const last7days_sales_view = document.getElementById('last7days_sales_view')
const last30days_sales_view = document.getElementById('30days_sales_view')

const all_sales = document.getElementById('all_sales')
const today_sales = document.getElementById('today_sales')
const _7days_sales = document.getElementById('7days_sales')
const _30days_sales = document.getElementById('30days_sales')



all_sales.addEventListener('click',()=>{
    const dropdown_name = document.getElementById('dropdown_name')
    const report_headline = document.getElementById('report_headline')

    dropdown_name.innerHTML = 'All reports'
    report_headline.innerHTML = 'All reports'
    all_sales_view.style.display = 'block'
    today_sales_view.style.display = 'none'
    last7days_sales_view.style.display = 'none'
    last30days_sales_view.style.display = 'none'
})
today_sales.addEventListener('click',()=>{
    const dropdown_name = document.getElementById('dropdown_name')
    const report_headline = document.getElementById('report_headline')
    
    dropdown_name.innerHTML = 'Todays reports'
    report_headline.innerHTML = 'Todays reports'
    all_sales_view.style.display = 'none'
    today_sales_view.style.display = 'block'
    last7days_sales_view.style.display = 'none'
    last30days_sales_view.style.display = 'none'
})
_7days_sales.addEventListener('click',()=>{
    const dropdown_name = document.getElementById('dropdown_name')
    const report_headline = document.getElementById('report_headline')
    
    dropdown_name.innerHTML = 'This Week'
    report_headline.innerHTML = 'This Week'
    all_sales_view.style.display = 'none'
    today_sales_view.style.display = 'none'
    last7days_sales_view.style.display = 'block'
    last30days_sales_view.style.display = 'none'
})
_30days_sales.addEventListener('click',()=>{
    const dropdown_name = document.getElementById('dropdown_name')
    const report_headline = document.getElementById('report_headline')
    
    dropdown_name.innerHTML = 'This Month'
    report_headline.innerHTML = 'This Month'
    all_sales_view.style.display = 'none'
    today_sales_view.style.display = 'none'
    last7days_sales_view.style.display = 'none'
    last30days_sales_view.style.display = 'block'
})
// import PDFDocument from 'pdfkit';
// import fs from 'fs'

let orderReport
let TotalPrice
let todayOrders
let todayTotalPrice
let last7DaysOrders
let thisWeekTotalPrice
let last30DaysOrders
let thisMonthTotalPrice

// const dlAll = document.getElementById('dlAll')
// const dl30_days = document.getElementById('dl30_days')
// const dl30_days = document.getElementById('dl30_days')
// const dl30_days = document.getElementById('dl30_days')

fetch('/admin/fetch_sales_report')
.then(responds=>responds.json())
.then(data=>{
   
    orderReport = data.orderReport
    TotalPrice = data.TotalPrice
    todayOrders = data.todayOrders
    todayTotalPrice = data.todayTotalPrice
    last7DaysOrders = data.last7DaysOrders
    thisWeekTotalPrice = data.thisWeekTotalPrice
    last30DaysOrders = data.last30DaysOrders
    thisMonthTotalPrice = data.thisMonthTotalPrice
    
    
    const currentDate = new Date()
    const date =  `${currentDate.getDate()}-${currentDate.getMonth()}-${currentDate.getFullYear()}`
     //Download All reports-------------> 
    document.getElementById('all_report_dl').addEventListener('click',()=>{
        printPDF(orderReport,TotalPrice,`TotalOrder Report ${date}`)     
})
    //Dowmload Todays report
  document.getElementById('today_report_dl').addEventListener('click',()=>{
    printPDF(todayOrders,todayTotalPrice,`Todays Report ${date}`)
  })
  //Download Last week report
  document.getElementById('weekReport_dl').addEventListener('click',()=>{
    printPDF(last7DaysOrders,thisWeekTotalPrice,`Last Week Report ${date}`)
  })
  //Dowmload This month report
  document.getElementById('monthReport_days').addEventListener('click',()=>{
    printPDF(last30DaysOrders , thisMonthTotalPrice ,`This Month Report ${date}`)
  })
})





function printPDF(orderReport,TotalPrice,pdfName){
    const documentDefinition = {
        content: [
          {
            text: 'Order Data',
            style: 'header',
          },
          {
            style: 'table',
            table: {
              headerRows: 1,
              body: [
                ['Order ID', 'Date', 'Name', 'Product Name', 'Price', 'Payment ID'],
                ...orderReport.map((product) => [
                  product.orderId,
                  product.order_date,
                  product.customerName,
                  product.products.join('\n'),
                  `₹${product.price}.00`,
                  product.paymentId,
                ]),
              ],
            },
          },
          {
            text: `Total : ₹${TotalPrice}.00`,
            style: 'footer',
          },
        ],
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 0, 0, 10],
          },
          table: {
            margin: [0, 0, 0, 0],
          },
        }
      }
    
    
// Generate the PDF
const pdfDoc = pdfMake.createPdf(documentDefinition);
// Download the PDF
pdfDoc.download(`${pdfName}.pdf`)
}