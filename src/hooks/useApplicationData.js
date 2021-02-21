import { useEffect, useReducer } from "react"
import axios from "axios"

export default function useApplicationData() {

  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  function reducer(state, action) {
    switch(action.type) {
      case SET_DAY:
        return { ...state, day: action.day }
      case SET_APPLICATION_DATA:
        return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }
      case SET_INTERVIEW:
        return { ...state, days: action.days, appointments: action.appointments } 
      default: 
        throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      )
    }
  }
  
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  })

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


    const days = getDays(id, appointments);


    return axios.put(`/api/appointments/${id}`, {interview})
      .then(() => dispatch({ type: SET_INTERVIEW, days, appointments}))

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

    return axios.delete(`/api/appointments/${id}`)
      .then(() => dispatch({ type: SET_INTERVIEW, days, appointments }))

  }
  
  const setDay = day => dispatch({ type: SET_DAY, day });
  
  useEffect(() => {
    
    Promise.all([
      axios.get('/api/days'), 
      axios.get('/api/appointments'), 
      axios.get('/api/interviewers')
    ])
    .then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data, interviewers: all[2].data })
    })
    .catch(err => console.error(err))
  }, [])


  return {state, setDay, bookInterview, cancelInterview}

}