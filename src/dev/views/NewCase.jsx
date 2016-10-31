import React from 'react'
import { reduxForm } from 'redux-form'
import { bindActionCreators } from 'redux'

import * as actionCreators from '../actions/user.js'
import ContactInfo from '../components/home/ContactInfo.jsx'

var DatePicker = require('react-datepicker')
var moment = require('moment')

class NewCase extends React.Component {

  constructor(){
    super()
    this.startDate = moment();
    this.startDate.hours(0);
    this.startDate.minutes(0);
    this.startDate.seconds(0);
    this.startDate.milliseconds(0);

  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  onChangeStartDate(date){
    this.startDate = date;
    if(this.endDate < this.startDate){
      this.onChangeEndDate(this.startDate)
    }
    this.startDate.hours(0);
    this.startDate.minutes(0);
    this.startDate.seconds(0);
    this.startDate.milliseconds(0);
    this.forceUpdate();
  }


  onSubmit(props){
    console.log("ON SUBMIT");
    let caseDetails = {
      type: props.caseType,
      description: props.caseDescription,
      additionalInfo: props.additionalInfo,
      contactName: props.contactName,
      contactPhone: props.contactPhone,
      contactEmail: props.contactEmail,
      startDate: this.startDate.toISOString()
    }
    this.props.actions.newCase(caseDetails)
    this.context.router.push('/')
  }

  render() {
    const { fields: { caseType, caseDescription, additionalInfo, contactName, contactPhone, contactEmail }, handleSubmit } = this.props

    return (
      <div className="container">
        <div className="content-container login-container">
            <form onSubmit={handleSubmit(props => this.onSubmit(props))}>
                <h5>Kerro remonttitarpeestasi</h5>

                <label htmlFor="caseType">Remontin tyyppi</label>
                <input type="text" name="caseType" {...caseType} placeholder="esim. Kylpyhuone, Keittiö, Pintaremontti" />

                <label htmlFor="startTime">Remontin toivottu alkuaika</label>
                <DatePicker className="date-start"
                  selected={this.startDate}
                  startDate={this.startDate}
                  endDate={this.endDate}
                  onChange={this.onChangeStartDate.bind(this)} />


                <label htmlFor="caseType">Remontin kuvaus</label>
                <textarea type="text" id="caseDescription" {...caseDescription} placeholder="Vapaamuotoinen kuvas halutusta tehtävästä."/>
                {caseDescription.touched && caseDescription.error && <div className="form-error">{caseDescription.error}</div>}

                <label htmlFor="caseType">Lisätietoja</label>
                <textarea type="text" id="additionalInfo" {...additionalInfo} placeholder="Muuta asiaan liittyvää oleellista tietoa."/>

                <label htmlFor="contactName">Nimesi</label>
                <input type="text" name="contactName" {...contactName} placeholder="Kirjoita nimesi" />

                <label htmlFor="contactPhone">Puhelinnumero</label>
                <input type="text" name="contactPhone" {...contactPhone} placeholder="Numero mistä tavoittaa arkisin" />

                <label htmlFor="contactEmail">Sähköposti</label>
                <input type="text" name="contactEmail" {...contactEmail} placeholder="Sähköpostisi, jota luet usein" />

                <button type="submit" className="btn-small btn-blue">Lähetä</button>
            </form>
        </div>
      </div>
    )
  }
}

function validate(values) {
  const errors = {}
  return errors;
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch)}
}

export default reduxForm({
  form: 'NewCase',
  fields: ['caseType', 'caseDescription', 'additionalInfo', 'contactName', 'contactPhone', 'contactEmail'],
  validate
}, null, mapDispatchToProps )(NewCase)