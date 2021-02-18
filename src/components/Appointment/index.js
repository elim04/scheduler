import React from "react";

import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import useVisualMode from "../../hooks/useVisualMode.js";
import Form from "components/Appointment/Form";

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";  

  const {mode, transition, back} = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  // const toDisplay = props.interview ? <Show student={props.interview.student} interviewer={props.interview.interviewer}/> : <Empty/>;

  return (
    <article className="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show 
          student={props.interview.student}
          interviewer={props.interview.interviewer}
        />
      )}
      {mode === CREATE && 
        <Form 
        name={props.name}
        interviewers={[]}
        value={props.value}
        onSave={() => console.log("onSave")}
        onCancel={() => back()}
        />
      }
    
    </article>
  )

}