// Citation for the following: all routes (GET, POST, DELETE), except for one POST route 
// Date: 3/7/2022
// Adapted from: the several steps throughout nodejs-starter-app code
// Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main

// Citation for the following: POST route (app.post('/update-scs'...)
// Date: 3/7/2022
// Adapted from: James Cole (TA) revisions 
// Source URL: https://edstem.org/us/courses/49750/discussion/4472145?comment=10399711

/*
    SETUP
*/
var express = require('express'); // We are using the express library for the web server
var app = express(); // We need to instantiate an express object to interact with the server in our code
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
PORT = 1107; // Set a port number at the top so it's easy to change in the future
const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars'); // Import express-handlebars
app.engine('.hbs', engine({ extname: '.hbs' })); // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs'); // Tell express to use the handlebars engine whenever it encounters a *.hbs file.
var db = require('./database/db-connector');

/*
    GET ROUTES
*/
app.get('/', function (req, res) {
	res.render('index');
});

app.get('/orders', function (req, res) {
	let query1 = `
	SELECT Orders.*, Investors.name AS investorname, Securities.name AS securityname
	FROM Orders
	INNER JOIN Investors ON Orders.investorID = Investors.investorID
	INNER JOIN Securities ON Orders.securityID = Securities.securityID
	GROUP BY Orders.orderID
`;

	let query2 = 'SELECT investorID, name FROM Investors';

	let query3 = 'SELECT securityID, name FROM Securities';


	// Run the 1st query
	db.pool.query(query1, function (error, rows, fields) {
		// Save the scs
		let orders = rows;

		// Run the second query
		db.pool.query(query2, (error, rows, fields) => {
			// Save the securities
			let investors = rows;

			// Run the third query
			db.pool.query(query3, (error, rows, fields) => {
				// Save the security codes
				let securities = rows;

				res.render('orders', {data: orders, investors: investors, securities: securities});
			});
		});
	});
});

app.get('/securities', function (req, res) {
	let query1 = 'SELECT * FROM Securities;';

	db.pool.query(query1, function (error, rows, fields) {
		res.render('securities', { data: rows });
	});
});

app.get('/security-codes', function (req, res) {
	let query1 = 'SELECT * FROM SecurityCodes;';

	db.pool.query(query1, function (error, rows, fields) {
		res.render('security-codes', { data: rows });
	});
});

app.get('/security-codes-securities', function (req, res) {
	let query1 = `
	SELECT SecurityCodesSecurities.*, Securities.name AS name, SecurityCodes.description AS description
	FROM SecurityCodesSecurities
	INNER JOIN Securities ON SecurityCodesSecurities.securityID = Securities.securityID
	INNER JOIN SecurityCodes ON SecurityCodesSecurities.securityCodeID = SecurityCodes.securityCodeID
	GROUP BY SecurityCodesSecurities.scsID
`;

	let query2 = 'SELECT securityID, name FROM Securities';

	let query3 = 'SELECT securityCodeID, description FROM SecurityCodes';

	// Run the 1st query
	db.pool.query(query1, function (error, rows, fields) {
		// Save the scs
		let scs = rows;

		// Run the second query
		db.pool.query(query2, (error, rows, fields) => {
			// Save the securities
			let securities = rows;

			// Run the third query
			db.pool.query(query3, (error, rows, fields) => {
				// Save the security codes
				let securitycodes = rows;

				res.render('security-codes-securities', {data: scs, securities: securities, securitycodes: securitycodes});
			});
		});
	});
});

app.get('/scs-update', function (req, res) {
	console.log(req.query);
	let scsID = req.query.scsID;

	// Query 2 is the same in both cases
	let query2 = 'SELECT * FROM Securities;';

	// Query 3 is the same in both cases
	let query3 = 'SELECT * FROM SecurityCodes;';

	// Run the second query
	db.pool.query(query2, (error, rows, fields) => {
		// Save the securities
		let securities = rows;

		// Run the third query
		db.pool.query(query3, (error, rows, fields) => {
			// Save the security codes
			let securitycodes = rows;
			return res.render('scs-update', {
				scsID: scsID,
				securities: securities,
				securitycodes: securitycodes,
			});
		});
	});
});

app.get('/investors', function (req, res) {
	let query1 = `
	SELECT Investors.*, InvestorTypes.description AS description
	FROM Investors
	INNER JOIN InvestorTypes ON Investors.investorTypeID = InvestorTypes.investorTypeID
	GROUP BY Investors.investorID
`;

	let query2 = 'SELECT investorTypeID, description FROM InvestorTypes';

	// Run the 1st query
	db.pool.query(query1, function (error, rows, fields) {
		// Save the scs
		let investors = rows;

		// Run the second query
		db.pool.query(query2, (error, rows, fields) => {
			// Save the securities
			let investortypes = rows;

			res.render('investors', {data: investors, investortypes: investortypes});
		});
	});
});

app.get('/investor-types', function (req, res) {
	let query1 = 'SELECT * FROM InvestorTypes;';

	db.pool.query(query1, function (error, rows, fields) {
		res.render('investor-types', { data: rows });
	});
});

app.get('/positions', function (req, res) {
	let query1 = `
	SELECT Positions.*, Investors.name AS investorname, Securities.name AS securityname
	FROM Positions
	INNER JOIN Investors ON Positions.investorID = Investors.investorID
	INNER JOIN Securities ON Positions.securityID = Securities.securityID
	GROUP BY Positions.positionID
`;

	let query2 = 'SELECT investorID, name FROM Investors';

	let query3 = 'SELECT securityID, name FROM Securities';

	// Run the 1st query
	db.pool.query(query1, function (error, rows, fields) {
		// Save the scs
		let positions = rows;

		// Run the second query
		db.pool.query(query2, (error, rows, fields) => {
			// Save the securities
			let investors = rows;

			// Run the third query
			db.pool.query(query3, (error, rows, fields) => {
				// Save the security codes
				let securities = rows;

				res.render('positions', {data: positions, investors: investors, securities: securities});
			});
		});
	});
});

app.get('/position-update', function (req, res) {
	let query1 = `
	SELECT Positions.*, Investors.name AS investorname, Securities.name AS securityname
	FROM Positions
	INNER JOIN Investors ON Positions.investorID = Investors.investorID
	INNER JOIN Securities ON Positions.securityID = Securities.securityID
	GROUP BY Positions.positionID
`;

	let query2 = 'SELECT investorID, name FROM Investors';

	let query3 = 'SELECT securityID, name FROM Securities';

	// Run the 1st query
	db.pool.query(query1, function (error, rows, fields) {
		// Save the scs
		let positions = rows;

		// Run the second query
		db.pool.query(query2, (error, rows, fields) => {
			// Save the securities
			let investors = rows;

			// Run the third query
			db.pool.query(query3, (error, rows, fields) => {
				// Save the security codes
				let securities = rows;

				res.render('position-update', {data: positions, investors: investors, securities: securities});
			});
		});
	});
});


/*
    POST ROUTES
*/
app.post('/add-investor-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    console.log("Received data:", data);

    // Check if input-description (investor type) is empty or not provided
    let investorTypeID = data['input-description'] ? `'${data['input-description']}'` : 'NULL';

    // Create the query and run it on the database
    let query1 = `INSERT INTO Investors (investorTypeID, name, cashBalance, portfolioBalance, portfolioPerformance) 
                  VALUES (${investorTypeID}, '${data['input-name']}', '${data['input-cashBalance']}', 
                          '${data['input-portfolioBalance']}', '${data['input-portfolioPerformance']}')`;

    console.log("Query:", query1); // Log the query before executing
    db.pool.query(query1, function (error, rows, fields) {
        // Check for any error
        if (error) {
            // Log the error to the terminal and send an HTTP response 400 (Bad Request)
            console.log("Database error:", error);
            res.sendStatus(400);
        } else {
            console.log("Data inserted successfully:", rows);
            res.redirect('/investors');
        }
    });
});

app.post('/add-security-form', function (req, res) {
	// Capture the incoming data and parse it back to a JS object
	let data = req.body;

	// Create the query and run it on the database
	query1 = `INSERT INTO Securities (name, ticker, currentPrice) VALUES ('${data['input-name']}', '${data['input-ticker']}', '${data['input-currentPrice']}')`;
	db.pool.query(query1, function (error, rows, fields) {
		// Check to see if there was an error
		if (error) {
			// Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
			console.log(error);
			res.sendStatus(400);
		} else {
			res.redirect('/securities');
		}
	});
});

app.post('/add-security-code-form', function (req, res) {
	// Capture the incoming data and parse it back to a JS object
	let data = req.body;

	// Create the query and run it on the database
	query1 = `INSERT INTO SecurityCodes (description) VALUES ('${data['input-description']}')`;
	db.pool.query(query1, function (error, rows, fields) {
		// Check to see if there was an error
		if (error) {
			// Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
			console.log(error);
			res.sendStatus(400);
		} else {
			res.redirect('/security-codes');
		}
	});
});

app.post('/add-scs-form', function (req, res) {
	// Capture the incoming data and parse it back to a JS object
	let data = req.body;

	// Create the query and run it on the database
	query1 = `INSERT INTO SecurityCodesSecurities (securityID, securityCodeID) VALUES ('${data['input-securityID']}', '${data['input-securityCodeID']}')`;
	db.pool.query(query1, function (error, rows, fields) {
		// Check to see if there was an error
		if (error) {
			// Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
			console.log(error);
			res.sendStatus(400);
		} else {
			res.redirect('/security-codes-securities');
		}
	});
});

app.post('/update-scs', function (req, res) {
	let data = req.body;

	// Extract data from the request body
	let securityID = parseInt(data['input-securityID']);
	let securityCodeID = parseInt(data['input-securityCodeID']);
	let scsID = parseInt(data.scsID);

	// Construct the SQL query to update Security Codes Securities
	let queryUpdateSCS = `UPDATE SecurityCodesSecurities SET securityID = ?, securityCodeID = ? WHERE scsID = ?`;

	// Run the query
	db.pool.query(
		queryUpdateSCS,
		[securityID, securityCodeID, scsID],
		function (error, result) {
			if (error) {
				// Log the error
				console.error('Error updating SCS:', error);
				// Send HTTP response indicating a server error
				res.sendStatus(500);
			}
		}
	);

	res.redirect('/security-codes-securities');
});

app.post('/add-investor-type-form', function (req, res) {
	// Capture the incoming data and parse it back to a JS object
	let data = req.body;

	// Create the query and run it on the database
	query1 = `INSERT INTO InvestorTypes (description) VALUES ('${data['input-description']}')`;
	db.pool.query(query1, function (error, rows, fields) {
		// Check to see if there was an error
		if (error) {
			// Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
			console.log(error);
			res.sendStatus(400);
		} else {
			res.redirect('/investor-types');
		}
	});
});

app.post('/add-position-form', function (req, res) {
	// Capture the incoming data and parse it back to a JS object
	let data = req.body;

	// Create the query and run it on the database
	query1 = `INSERT INTO Positions (investorID, securityID, units, initialValue, currentValue, gainLoss) VALUES ('${data['input-investorname']}', '${data['input-securityname']}', '${data['input-units']}', '${data['input-initialValue']}', '${data['input-currentValue']}', '${data['input-gainLoss']}')`;
	db.pool.query(query1, function (error, rows, fields) {
		// Check to see if there was an error
		if (error) {
			// Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
			console.log(error);
			res.sendStatus(400);
		} else {
			res.redirect('/positions');
		}
	});
});

app.post('/update-position', function (req, res) {
	// Capture the incoming data and parse it back to a JS object
	let data = req.body;

	let positionID = parseInt(data['input-position']);
	let inputUnits = parseInt(data['input-units']);
	let initialValue = parseInt(data['input-initialValue']);
	let currentValue = parseInt(data['input-currentValue']);
	let gainLoss = parseInt(data['input-gainLoss']);

	// Create the query and run it on the database
	let positionsUpdateQuery = `
		UPDATE Positions
		SET units = ?,
			initialValue = ?,
			currentValue = ?,
			gainLoss = ?
		WHERE positionID = ?
	`;

	// Run the query
	db.pool.query(
		positionsUpdateQuery,
		[inputUnits, initialValue, currentValue, gainLoss, positionID],
		function (error, result) {
			if (error) {
				// Log the error
				console.error('Error updating Positions:', error);
				// Send HTTP response indicating a server error
				res.sendStatus(500);
			} else {
				// If the query is successful, redirect to the positions page
				res.redirect('/positions');
			}
		}
	);
});

app.post('/add-order-form', function (req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Convert string values to integers using parseInt()
    let investorID = parseInt(data['input-investorID']);
    let securityID = parseInt(data['input-securityID']); 
    let totalUnits = parseInt(data['input-totalUnits']);
    let price      = parseFloat(data['input-price']); 
    
    // positionID might be null
    let positionID = data['input-positionID'] === "" ? null : parseInt(data['input-positionID']);

    // Introduce query variables
    let query1, query2, query3;

    // if positionID already in Positions, run queries concurrently 
    if (positionID !== null) {
        // INSERT INTO Positions
        query1 = `UPDATE Positions 
                  SET units = ${totalUnits} 
                  WHERE positionID = ${positionID}`;

        // INSERT INTO Orders 
        query2 = `INSERT INTO Orders (investorID, securityID, positionID, orderType, 
                                      totalUnits, price, date)
                  VALUES (${investorID}, ${securityID}, ${positionID}, '${data['input-orderType']}', 
                          ${totalUnits}, ${price},'${data['input-date']}')`;

        // Create promises for both queries
        let query1Promise = new Promise((resolve, reject) => {
            db.pool.query(query1, function(error, result) {
                if (error) {
                    reject(error); 
                } else {
                    resolve(result); 
                }
            });
        });

        let query2Promise = new Promise((resolve, reject) => {
            db.pool.query(query2, function(error, result) {
                if (error) {
                    reject(error); 
                } else {
                    resolve(result); 
                }
            });
        });

        // Execute both promises concurrently
        Promise.all([query1Promise, query2Promise])
            .then(() => {
                // If successful, redirect to the orders page
                res.redirect('/orders');
            })
            .catch(error => {
                // Handle errors
                console.log(error);
                res.sendStatus(400);
            });
    } else {
        /* Otherwise run the queries sequentially. Position insert runs first and 
        then inserted positionID is used to insert into Orders*/
        query1 = `INSERT INTO Positions (investorID, securityID, units) 
                  VALUES (${investorID}, ${securityID}, ${totalUnits})`;
				  
        
        db.pool.query(query1, function(error, result) {
            if (error) {
                console.log(error);
                res.sendStatus(400);
            } else {
                let newPositionID = result.insertId; // Get the last inserted positionID
                
                query2 = `INSERT INTO Orders (investorID, securityID, positionID, orderType, 
                                              totalUnits, price, date)
                          VALUES (${investorID}, ${securityID}, ${newPositionID}, '${data['input-orderType']}', 
                                  ${totalUnits}, ${price}, '${data['input-date']}')`;

						
                
                db.pool.query(query2, function(error, result) {
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        // Third query to update Positions table
                        query3 = `UPDATE Positions 
						SET initialValue = 
						(SELECT tradeTotal FROM Orders WHERE positionID = (SELECT MAX(positionID) FROM Positions)),
						currentValue = 
						(SELECT tradeTotal FROM Orders WHERE positionID = (SELECT MAX(positionID) FROM Positions)), 
						gainLoss = 0 WHERE positionID = (SELECT MAX(positionID) FROM Positions)`;
						

                                  
                        db.pool.query(query3, function(error, result) {
                            if (error) {
                                console.log(error);
                                res.sendStatus(400);
                            } else {
                                res.redirect('/orders');
                            }
                        });
                    }
                });
            }
        });
    }
});


/*
    DELETE ROUTE
*/
app.delete('/delete-scs-ajax/', function (req, res) {
	let data = req.body;
	let scsID = parseInt(data.id);
	let deleteSCS = `DELETE FROM SecurityCodesSecurities WHERE scsID = ?`;

	// Run the 1st query
	db.pool.query(deleteSCS, [scsID], function (error, rows, fields) {
		if (error) {
			// Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
			console.log(error);
			res.sendStatus(400);
		} else {
			// Send a success response
			res.send('success');
		}
	});
});


/*
    LISTENER
*/
app.listen(PORT, function () {
	// This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
	console.log(
		'Express started on http://localhost:' +
			PORT +
			'; press Ctrl-C to terminate.'
	);
});
