import React from 'react'
import { reduxForm } from 'redux-form'
import { bindActionCreators } from 'redux'

import * as actionCreators from '../../actions/admin.js'

class SlotForm extends React.Component {

  onSubmit(props) {
    if(this.props.mode === "addNew"){
      this.props.actions.addSlot(props)
    } else {
      this.props.actions.modifySlot(props, this.props.itemkey)
    }
    this.props.actions.minimizeSlotForm()
  }

  componentDidMount(){
    document.getElementById("slotFocusItem").focus()
  }

  renderContent() {
    var buttonText = (this.props.mode === "addNew")? "Luo" : "Päivitä"
    const { fields: { day, start, end , blocked, reserver}, handleSubmit } = this.props

      return (
        <form onSubmit={handleSubmit(props => this.onSubmit(props))}>
          <label htmlFor="slotDay">Viikonpäivä</label>
          <select name="slotDay" {...day} value={day.value || ''}>
            <option>-- Valitse päivä --</option>
            <option value="1">Maanantai</option>
            <option value="2">Tiistai</option>
            <option value="3">Keskiviikko</option>
            <option value="4">Torstai</option>
            <option value="5">Perjantai</option>
            <option value="6">Lauantai</option>
            <option value="7">Sunnuntai</option>
          </select>

          <label htmlFor="slotStart">Alkaa klo.</label>
          <input type="number" id="slotFocusItem" name="slotStart" {...start} placeholder="esim: 800 tai 1000 tai 2130" />

          <label htmlFor="slotEnd">Loppuu klo.</label>
          <input type="number" name="slotEnd" {...end} placeholder="esim: 900 tai 1100 tai 2230" />

          <label htmlFor="oneTime">Vakiovuoro</label>
          <input type="checkbox" name="oneTime" className="checkbox rowbox" {...blocked} />

          <label htmlFor="countTitle">Vakiovuoron varaaja</label>
          <input type="text" name="reserver" {...reserver} placeholder="Varaajan asunnon numero" />

          <button className="btn-small btn-blue" type="submit">{buttonText}</button>
        </form>
      )
  }

  render() {
    return (
      <div className="container transparent-bg">
        <div className="surrounded-container">
          <h2 className="header-collapse">Vuoron tiedot</h2>
          {this.renderContent()}
        </div>
      </div>
    )
  }
}

function validate(values) {
  const errors = {}
  return errors;
  // TODO: form validation
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch)}
}

export default reduxForm({
  form: 'SlotForm',
  fields: ['day', 'start', 'end', 'blocked', 'reserver'],
  validate
}, null, mapDispatchToProps)(SlotForm)
