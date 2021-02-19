import { useState, useEffect } from "react"
import axios from "axios"

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    setState(state => ({...state, appointments}))

    return axios.put(`/api/appointments/${id}`, {interview})
      .then(res => console.log(res))

  }

  function cancelInterview(id) {

    const appointments = {
      ...state.appointments
    };

    appointments[id].interview = null;

    return axios.delete(`/api/appointments/${id}`)
      .then(res => console.log(res))

  }
  
  const setDay = day => setState(state => ({...state, day}));
  
  useEffect(() => {
    
    Promise.all([
      axios.get('/api/days'), 
      axios.get('/api/appointments'), 
      axios.get('/api/interviewers')
    ])
    .then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}))
    })
    .catch(err => console.error(err))
  }, [])


  return {state, setDay, bookInterview, cancelInterview}

}