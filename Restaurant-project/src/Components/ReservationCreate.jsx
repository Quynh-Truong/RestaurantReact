import axios from 'axios'
import {useState} from 'react'
import React from 'react'

export default function ReservationCreate({ refresh }){

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const [noOfPeople, setNoOfPeople] = useState('');
    const [reservationStart, setReservationStart] = useState('');
    const [availableTables, setAvailableTables] = useState([]);
    const [selectedTableId, setSelectedTableId] = useState(null);
    const [showTables, setShowTables] = useState(false);

    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);


        //function for getting AVAILABLE TABLES for specific time and number of people
        async function handleTables(e) {
            e.preventDefault();

            //React and API are using different time formatting, server wants ISO 8601, React does not implement timezones
            const formattedReservationStart = new Date(reservationStart).toISOString();

            const tableInfo = {
                noOfPeople: parseInt(noOfPeople, 10),
                reservationStart: formattedReservationStart
            };

            if (!reservationStart || !noOfPeople) {
                setErrorMessage('Please select a reservation time and number of people.');
                return;
            }
            try {
                console.log(`Fetching available tables for time: ${reservationStart} and people: ${noOfPeople}`);
                //parsing string to int
          

                //needed 'params' for get to be correctly sent as a query
                const response = await axios.get(`https://localhost:7223/api/Reservations/getAvailableTablesForReservation`, {params: tableInfo});

                    console.log('Response data:', response.data);

                    if (response.data) {
                        //updating available tables
                        setAvailableTables(response.data);
                        // //this confirms we will move on to next step of booking
                        setShowTables(true);
                    } else {
                        setErrorMessage('No tables available for the selected time.');
                    }

            }
            catch (error) {
                console.log('Error fetching available tables', error);
                setErrorMessage('Failed fetching available tables');
            }
        };

      
// -------------------- BOOKING FUNKTION --------------------------------------
        async function handleReservation(e) {
            e.preventDefault();

            const formattedReservationStart = new Date(reservationStart).toISOString();

            const reservationInfo = {
                //placeholder-id, API needs this to create reservation
                customerId: 0,
                firstName,
                lastName,
                phoneNo,
                noOfPeople: parseInt(noOfPeople, 10),
                tableId: selectedTableId,
                reservationStart: formattedReservationStart
            };
            if (!firstName || !lastName || !phoneNo ||! noOfPeople || !selectedTableId || !reservationStart) {
                setErrorMessage('Please fill in all fields.');
                return;
            }

            try{ 
                await axios.post('https://localhost:7223/api/Reservations/makeReservation', reservationInfo)
    
                    //message will confirm reservation
            setSuccessMessage('Reservation was successfully made!');   
            window.scrollTo({ top: 0, behavior: 'smooth' });

    
            } catch (error) {
                console.log('Error making reservation', error);
                setErrorMessage('Failed to submit reservation. Try again later.');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
           /*window.location.reload();*/
    
        }

        // ------------------------ form for AVAILABLE TABLES-----------------------------------------
        return (
        <div>
         {/* we will ask for time and number of people visiting, when submitted handleTables kicks in */}
        <div className="container mt-1">
        <h1 className="text-center mb-5">Welcome to <span id="name">BITE ME!</span>'s Reservation Page!</h1>

        {successMessage && (
            <div className='alert alert-success' role="alert">
            {successMessage}
            </div>
        )}
        {errorMessage && (
            <div className='alert alert-danger' role='alert'>
                {errorMessage}
                </div>
        )}

        <h4 className="mb-3">Firstly, choose a time and number of people!</h4>
        <form onSubmit={handleTables}>
          {/* e.preventDefault(); */}
    
        <div>
        <label htmlFor="reservationStart" className="">Reservation Time:</label>
        <input id="reservationStart" type="datetime-local" className="form-control" value={reservationStart} 
        onChange={(e) => setReservationStart(e.target.value)} required
        />
        </div>
       <div className="mt-3">
       <label htmlFor='noOfPeople' className="">Number of People:</label>
        <input id='noOfPeople' type='number' className="form-control" placeholder="How many will you be?" value={noOfPeople}
        onChange={(e) => setNoOfPeople(e.target.value)} required
        />
       </div>
      <div className="d-grid gap-2 mt-3">
        <button type='submit' className="btn btn-outline-success">Find Available Tables</button>
        </div>
    </form>
        
    {/* shows available tables */}   
        {/* if there is a string in errorMessage, the paragraph for error is shown */}
                {showTables && (
                    <div>
                        <h4 className="mt-5 mb-3">Now, choose a table</h4>
                        {availableTables.length > 0 ? (
                            <ul className="list-group">
                                {availableTables.map((table) => (
                                    <li key={table.tableId} className="list-group-item">
                                        <label>
                                            <input type='radio' name='table' value={table.tableId}
                                            onChange={() => setSelectedTableId(table.tableId)}
                                            />    
                                            Table {table.tableId} ( Seats: {table.noOfSeats})   
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            // if no tables:
                            <p>No tables available. Try again later.</p>
                        )}
                    </div>
                 )} 
           

             {/* ------------ if a table has been selcted, we fill in info for RESERVATION ---------- */}
                {selectedTableId && (
                    <div>
                    <h4 className="mt-5 mb-3">Lastly, enter some final details</h4>
                    <form onSubmit={handleReservation}>
                        <label htmlFor='firstName' className="form-label mb-0">First Name:</label>
                        <input id='firstName' type='text' className="form-control mb-3" placeholder='Enter your first name' value={firstName}
                        onChange={(e) => setFirstName(e.target.value)} required
                        />
                        <label htmlFor='lastName' className="form-label mb-0">Last Name:</label>
                        <input id='lastName' type='text' className="form-control mb-3" placeholder='Enter your last name' value={lastName}
                        onChange={(e) => setLastName(e.target.value)} required
                        />
                        <label htmlFor='phoneNo' className="form-label mb-0">Phone Number:</label>
                        <input id='phoneNo' type='text' className="form-control" placeholder='XXX-XXXXXXX' value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value)} required
                        />
                        <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-outline-success">Submit Reservation</button>
                        </div>
                    </form>
                    </div>
                )}
 
            </div>
            </div>
        )              
};
