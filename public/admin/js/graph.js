
fetch('/admin/topSelling')
.then(responds => responds.json())
.then(incomingData=>{
    console.log(incomingData.label)  

     // Get a reference to the canvas element
const topProductsBarChart = document.getElementById('topProductsBarChart').getContext('2d');
const data = {
    labels: incomingData.label ,
    datasets: [{
        label: 'Sales',
        data: incomingData.data,  
        backgroundColor: 'rgba(185, 151, 61, 0.65)',  // Bar color 
        borderColor: 'rgba(255, 0, 0, 0.73)',  // Border color
        borderWidth: 1,
    }] 
};

const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Sales'
            }
        },
        x: {
            title: {
                display: true,
                text: 'Top selling catagory'
            }
        }
    }
};
// Create the bar chart
const chart = new Chart(topProductsBarChart, {
    type: 'bar',
    data: data,
    options: options
});

})
.catch(err=>{

})



fetch('/admin/revenueChart')
.then(responds => responds.json())
.then(incomingData =>{
    const revenuePieChart = document.getElementById('revenuePieChart').getContext('2d')
    const data = {
        labels : incomingData.label,
        datasets :[
            {
                data :incomingData.data,
                backgroundColor : ['red','green','blue']
            }
        ]
    }
    const options = {
        responsive : true ,
        maintainAspectRatio : false
    }
    const chart = new Chart(revenuePieChart , {
        type : 'pie',
        data : data,
        options : options
    })
})
.catch(err =>{
     
})


// // Sample data (replace with your actual data)
// const data = {
//     labels: ['Womens', 'Mens', 'Kids'],
//     datasets: [{
//         data: [2500, 3500, 1800],  // Replace with your revenue figures
//         backgroundColor: ['red', 'green', 'blue'],  // Colors for each segment
//     }]
// };

// const options = {
//     responsive: true,
//     maintainAspectRatio: false,
// };

// // Create the pie chart
// const chart = new Chart(revenuePieChart, {
//     type: 'pie',
//     data: data,
//     options: options
// });



// async function topProductsBarChart(){
//    // Get a reference to the canvas element
// const topProductsBarChart = document.getElementById('topProductsBarChart').getContext('2d');

// // Sample data (replace with your actual data)
// const data = {
//     labels: [' Shirt', 'Saree', ' C' , 'D' , 'E' , 'F',' A', ' B', ' C' , 'D' , 'E' , 'F'],
//     datasets: [{
//         label: 'Sales',
//         data: [200, 300, 150 , 333 , 66 , 12 ,200, 300, 150 , 333 , 66 , 12],  // Replace with your sales data
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Bar color
//         borderColor: 'rgba(75, 192, 192, 1)',  // Border color
//         borderWidth: 1,
//     }] 
// };

// const options = {
//     responsive: true,
//     maintainAspectRatio: false,
//     scales: {
//         y: {
//             beginAtZero: true,
//             title: {
//                 display: true,
//                 text: 'Sales'
//             }
//         },
//         x: {
//             title: {
//                 display: true,
//                 text: 'Top selling catagory'
//             }
//         }
//     }
// };

// // Create the bar chart
// const chart = new Chart(topProductsBarChart, {
//     type: 'bar',
//     data: data,
//     options: options
// });





// pieChart()
// topProductsBarChart()