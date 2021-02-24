
export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

export default function reducer(state, action) {
  switch(action.type) {
    case SET_DAY:
      return { ...state, day: action.day };
    case SET_APPLICATION_DATA:
      return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers };
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
      
      return { ...state, days: days, appointments: appointments };

    }

    default: 
      throw new Error(
      `Tried to reduce with unsupported action type: ${action.type}`
    );
  }
}

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
  });

  return newDays;
}