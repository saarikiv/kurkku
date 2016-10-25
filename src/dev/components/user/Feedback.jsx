import React from "react"
import { reduxForm } from 'redux-form'
import { createFeedback } from '../../actions/feedback.js'

class Feedback extends React.Component {
  render() {
    const { fields: { content }, handleSubmit } = this.props

    return (
      <div className="container">
        <form onSubmit={handleSubmit(this.props.createFeedback)}>
          <label>Kirjoita palaute</label>
          <textarea {...content}></textarea>
          <p className="form-error">
            {content.touched ? content.error : ""}
          </p>
          <button type="submit">Lähetä</button>
        </form>
      </div>
    )
  }
}

function validate(values) {
  const errors = {}

  if (!values.content) {
    errors.content = "Kirjoita jotain."
  }

  return errors
}

export default reduxForm({
  form: 'FeedbackFrom',
  fields: ['content'],
  validate
}, null, {createFeedback})(Feedback)
