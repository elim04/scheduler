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
      case SET_INTERVIEW: {

        const appointment = {
          ...state.appointments[action.id],
          interview: action.interview 
        };
        
        const appointments = {
          ...state.appointments,
          [action.id]: appointment
        };
    
        const days = getDays(action.id, appointments, state);
        
        return { ...state, days: days, appointments: appointments } 

      }

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

  //helper function for updating spots after new appointment scheduled or cancelled
  function getDays (id, appointments, state) {
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

    return axios.put(`/api/appointments/${id}`, { interview })
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview}))

  }

  function cancelInterview(id) {

    return axios.delete(`/api/appointments/${id}`)
      .then(() => dispatch({ type: SET_INTERVIEW, id, interview: null }))

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

  //web socket setup
  useEffect(() => {

    const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    socket.onopen = () => {
      socket.send("ping")
      socket.onmessage = (event) => {
        const aptData = JSON.parse(event.data);
  
        if (aptData.type === "SET_INTERVIEW") {
          dispatch({ type: SET_INTERVIEW, id: aptData.id, interview: aptData.interview })
  
        }
      }
    }
    return () => {
      socket.close()
    } 

  }, [])

  return {state, setDay, bookInterview, cancelInterview}

}