import React from "react";

import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import useVisualMode from "../../hooks/useVisualMode.js";
import Form from "components/Appointment/Form";
import Confirm from "components/Appointment/Confirm";
import Status from "components/Appointment/Status";
import Error from "components/Appointment/Error";

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE"; 
  const CONFIRM = "CONFIRM";
  const ERROR = "ERROR";
  const STATUS = "STATUS"; 

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
        interviewers={props.interviewers}
        value={props.value}
        // onSave={onSave}
        onCancel={back}
        />
      }
      {mode === CONFIRM && 
        <Confirm
          message="Are you sure you would like to delete?"
          // onConfirm={onDelete}
        />
      }
      {mode === STATUS && 
        <Status
          message="Saving..."
        />
      }
      {mode === ERROR &&
        <Error
          message="Could not delete appointment."
          onClose={back}
        />
      }
    
    </article>
  )

}