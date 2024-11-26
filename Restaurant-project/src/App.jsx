import './App.css'
// import ReservationList from './Components/ReservationList'
import ReservationCreate from './Components/ReservationCreate'

export default function App() {
  
  function handlePageRefresh(){
    window.location.reload();
  }

  return (
    <>
      {/* <ReservationList /> */}
      <ReservationCreate refresh={handlePageRefresh} />
    </>
  )
}


