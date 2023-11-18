const { forEach } = require("lodash")

function searchData() {
    const data = document.getElementById('searchData').value
    
        const noSearchFound = document.getElementById('noSearchFound')
        const viewSearchUsers = document.getElementById('viewSearchUsers')
        const showUsers = document.getElementById('showUsers')
        const showSearchUsers = document.getElementById('showSearchUsers')
      
        viewSearchUsers.innerHTML = ''

    if (data.length < 1 || data.trim() === " ") {
        console.log("nothing searched")
        showUsers.style.display = 'block'
        showSearchUsers.style.display = 'none'
        return;
    }

    console.log('Data sent:', data);

    fetch('/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ payload: data })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`Error: ${res.status} - ${res.statusText}`);
        }
        return res.json();
    })
    .then(data => {
      
        const userDetails = data.payload;
   console.log(userDetails)
        if (userDetails.length < 1 || userDetails == [] || !userDetails) {  
        console.log("NO search found")
        showUsers.style.display = 'none'
        showSearchUsers.style.display = 'block'
        noSearchFound.style.display = 'flex'
        return
        } 
        console.log("Search found")
        showUsers.style.display = 'none'
        showSearchUsers.style.display = 'block'


        userDetails.forEach(element => {
            // Create a new table row
            const newRow = document.createElement('tr');
        
            // HTML content for the table row
            newRow.innerHTML = `
                
            <td>
            <div class="d-flex px-2 py-1">
              <div>
                <img src="/img/blank-profile-picture.webp" class="avatar avatar-sm me-3 border-radius-lg" alt="#">
              </div>
              <div class="d-flex flex-column justify-content-center">
                <h6 class="mb-0 text-sm">${element.name}</h6>
                <p class="text-xs text-secondary mb-0">${element.email}</p>
              </div>
            </div>
          </td>
          <td>
            <p class="text-xs font-weight-bold mb-0">Manager</p>
            <p class="text-xs text-secondary mb-0">Organization</p>
          </td>
          <td class="align-middle text-center text-sm">
            <span class="badge badge-sm bg-gradient-success">Online</span>
          </td>
          <td class="align-middle text-center">
            <span class="text-secondary text-xs font-weight-bold">${element.phone}</span>
          </td>
          <td class="align-middle">
            <a href="/admin/userProfile/${element._id} " class="text-secondary font-weight-bold text-xs" data-toggle="tooltip" data-original-title="Edit user">
              Edit
            </a>
          </td>

            `;
        
            // Append the new row to the viewSearchUsers element
            document.getElementById('viewSearchUsers').appendChild(newRow);  
            
        })
         
        
            
})
    .catch(error => {
        console.error('Error:', error);
       
    });
}




