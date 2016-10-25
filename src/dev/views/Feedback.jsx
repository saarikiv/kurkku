import React from 'react'
import { reduxForm } from 'redux-form'

import { sendFeedback } from '../actions/user.js'
import ContactInfo from '../components/home/ContactInfo.jsx'

class Feedback extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  onSubmit(props){
    this.props.sendFeedback(props.feedback)
    this.context.router.push('/user/')
  }

  render() {
    const { fields: { feedback }, handleSubmit } = this.props

    return (
      <div className="container">
        <div className="content-container login-container">
            <form onSubmit={handleSubmit(props => this.onSubmit(props))}>
                <h5>Lähetä palautetta KURKKUjärjestelmästä</h5>
                <textarea type="text" id="feedback" {...feedback}/>
                {feedback.touched && feedback.error && <div className="form-error">{feedback.error}</div>}
                <button type="submit" className="btn-small btn-blue">Lähetä</button>
            </form>
        </div>
      </div>
    )
  }
}

function validate(values) {
  const errors = {}

  if (!values.feedback) {
    errors.feedback = "Palautteella tulee olla sisältö."
  }

  return errors;
}

export default reduxForm({
  form: 'FeedbackForm',
  fields: ['feedback'],
  validate
}, null, { sendFeedback })(Feedback)