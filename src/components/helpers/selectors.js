
export function getAppointmentsForDay(state, day) {

  const filteredDay = state.days.find((currentDay) => currentDay.name === day);

  //if filteredDay exists, then use map to replace array of ids with the appointment ids and return
  const filteredApp = filteredDay ? filteredDay.appointments.map((id) => state.appointments[id]) : [];

  return filteredApp;

}

export function getInterview({ interviewers }, interview) {

  if (!interview) {
    return null;
  }

  const interviewInfo = interviewers[interview.interviewer];

  const finalInterview = {...interview, interviewer: interviewInfo};

  return finalInterview;
}
