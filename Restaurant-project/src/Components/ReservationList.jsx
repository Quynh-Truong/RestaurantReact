import axios from 'axios'
import {useState, useEffect} from 'react'

export default function ReservationList(){
    const [reservations, setReservations] = useState([]);

    async function getReservationList(){
        try{
            const response = await axios.get('https://localhost:7223/api/Reservations/getAllReservations')
            console.log(response);
            setReservations(response.data)
        }catch(error){
            console.log("Error when fetching reservations", error)
        }
    }

    useEffect(() => {
        getReservationList();
    }, [])

    return (
        <>
            <h1 className="header">Reservation List:</h1>
            <ul>
                {reservations.map(reservation => (
                    <li key={reservation.reservationId}>
                        Reservation ID: {reservation.reservationId},
                        Customer Name: {reservation.firstName} {reservation.lastName},
                        Phone Number: {reservation.phoneNo},
                        Number of People: {reservation.noOfPeople},
                        Table ID: {reservation.tableId},
                        Reservation Time: {reservation.reservationStart}
                    </li>
                ))}
            </ul>
        </>
    )
}