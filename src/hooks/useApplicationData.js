import { useState, useEffect } from "react"
import axios from "axios"

export default function useApplicationData() {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });


  const getDays = function(id, appointments) {
    const newDays = state.days.map((day) =>  {
      if (day.appointments.includes(id)) {
        return {...day, spots: day.appointments.filter((appointmentId) => {
          return (appointments[appointmentId].interview === null)
        }).length }
      } else {
        return day;
      }
    })

    return newDays;
  }


  function bookInterview(id, interview) {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    // const days = state.days.map((day) => {
    //   if (day.appointments.includes(id)) {
    //     return {...day, spots: day.appointments.filter((appointmentId) => {
    //       return (appointments[appointmentId].interview === null)
    //     }).length }
    //   } else {
    //     return day;
    //   }
    // })

    const days = getDays(id, appointments);


    return axios.put(`/api/appointments/${id}`, {interview})
      .then(() => setState(state => ({...state, days, appointments})))

  }

  function cancelInterview(id) {

    const appointment = {
      ...state.appointments[id],
      interview: null
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = getDays(id, appointments);
    // const days = state.days.map((day) => {
    //   if (day.appointments.includes(id)) {
    //     return {...day, spots: day.appointments.filter((appointmentId) => {
    //       return (appointments[appointmentId].interview === null)
    //     }).length }
    //   } else {
    //     return day;
    //   }
    // })

    return axios.delete(`/api/appointments/${id}`)
      .then(() => setState(state => ({...state, days, appointments})))

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