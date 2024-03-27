// Citation for the following functions: deleteSCS and deleteRow
// Date: 2/29/2022
// Adapted from: Node.js - Step 7 - Dynamically Deleting Data
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data

function deleteSCS(scsID) {
    let link = '/delete-scs-ajax/';
    let data = {
      id: scsID
    };
  
    $.ajax({
      url: link,
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: "application/json; charset=utf-8",
      success: function(result) {
        // Check if the result indicates success
        if (result === 'success') {
            // Redirect to the security-codes-securities page
            window.location.href = '/security-codes-securities';
        } else {
            // Handle other cases if needed
        }
      }
    });
  }
  
  function deleteRow(scsID){
      let table = document.getElementById("scs-table");
      for (let i = 0, row; row = table.rows[i]; i++) {
         if (table.rows[i].getAttribute("data-value") == scsID) {
              table.deleteRow(i);
              break;
         }
      }
  }
  
