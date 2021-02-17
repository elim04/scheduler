
export function getAppointmentsForDay(state, day) {

  const filteredDay = state.days.find((currentDay) => currentDay.name === day);

  const filteredApp = filteredDay ? filteredDay.appointments.map((id) => state.appointments[id]) : [];

  return filteredApp;

}
