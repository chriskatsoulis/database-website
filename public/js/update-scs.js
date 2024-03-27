// Citation for the following: lines 11-54 and updateRow
// Date: 2/29/2022
// Adapted from: Node.js - Step 8 - Dynamically Updating Data
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data

// Citation for the following: Update SCS functionality 
// Date: 3/7/2022
// Adapted from: James Cole (TA) revisions 
// Source URL: https://edstem.org/us/courses/49750/discussion/4472145?comment=10399711

// Get the form element
let updateSCSForm = document.getElementById('update-scs-form-ajax');

// Add event listener to form submission
updateSCSForm.addEventListener("submit", function (e) {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Get the form fields
    let inputSecurityID = document.getElementById("input-securityID");
    let inputSecurityCodeID = document.getElementById("input-securityCodeID");
    let scsID = document.getElementById("scsID").value; // Assuming there's an input field for scsID in your form

    // Create an object with the form data
    let data = {
        securityID: inputSecurityID.value,
        securityCodeID: inputSecurityCodeID.value,
        scsID: scsID // Include the scsID to identify the row to update
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/put-scs-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4) {
            if (xhttp.status == 200) {
                // Handle successful update
                console.log("SCS updated successfully.");
                updateRow(JSON.stringify(data), scsID); // Call updateRow function to update the UI
            } else {
                // Handle error
                console.error("Error updating SCS.");
            }
        }
    };

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
});

function updateRow(data, scsID) {
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("scs-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
        // Iterate through rows
        // Rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].querySelector("[data-scsID]").getAttribute("data-scsID") == scsID) {
            // Get the location of the row where we found the matching SCS ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get tds of securityID and securityCodeID values
            let tdSecurityID = updateRowIndex.querySelector("[data-securityID]");
            let tdSecurityCodeID = updateRowIndex.querySelector("[data-securityCodeID]");

            // Update securityID and securityCodeID with the updated values
            tdSecurityID.innerHTML = parsedData.securityID;
            tdSecurityCodeID.innerHTML = parsedData.securityCodeID;

            // Break the loop after updating the row
            break;
        }
    }
}
