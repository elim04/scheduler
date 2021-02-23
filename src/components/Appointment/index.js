import React, {useEffect, useState} from "react";

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
  const STATUS = "STATUS"; 
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE= "ERROR_DELETE";

  const [statusMsg, setStatusMsg] = useState("");

  const {mode, transition, back} = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    setStatusMsg("Saving...");

    transition(STATUS);

    props
    .bookInterview(props.id, interview)
    .then(()=> transition(SHOW))
    .catch(() => transition(ERROR_SAVE, true))

  }

  function onDelete() {

    setStatusMsg("Deleting...")

    transition(STATUS, true);

    props
    .cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch(() => transition(ERROR_DELETE, true))

  }

  //make sure correct mode renders after new interview is added or deleted
  useEffect(() => {
    if (mode === EMPTY && props.interview) {
      transition(SHOW)
    } else if (mode === SHOW && !props.interview) {
      transition(EMPTY)
    }
  }, [props.interview, transition, mode]);

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time}/>
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && props.interview && (
        <Show 
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(CREATE)}
        />
      )}
      {mode === CREATE && 
        <Form 
        name={props.interview ? props.interview.student : null}
        interviewers={props.interviewers}
        value={props.interview ? props.interview.interviewer.id : null}
        onSave={save}
        onCancel={back}
        />
      }
      {mode === CONFIRM && 
        <Confirm
          message="Are you sure you would like to delete?"
          onConfirm={onDelete}
          onCancel={back}
        />
      }
      {mode === STATUS && 
        <Status
          message={statusMsg}
        />
      }
      {mode === ERROR_SAVE &&
        <Error
          message="Could not save appointment."
          onClose={back}
        />
      }
      {mode === ERROR_DELETE &&
        <Error
          message="Could not delete appointment."
          onClose={back}
        />
      }
    
    </article>
  )

}