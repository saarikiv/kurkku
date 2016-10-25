import React from "react"
import { Link } from "react-router"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form'

import * as actionCreators from '../actions/auth.js'
import Terms from '../components/home/Terms.jsx'

class Register extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object
  }

  constructor(){
    super();
    this.email = "";
    this.password = "";
    this.firstName = "";
    this.alias = "";
    this.termsOpen = false;
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.auth.uid){
      this.context.router.push('/user/')
    }
  }

  doRegister(data){
    this.props.actions.register(data.email, data.password, data.firstName, data.lastName, null)
  }

  toggleTerms() {
    if (this.termsOpen === false) {
      document.getElementById("terms-container").classList.remove("hidden")
      this.termsOpen = true
    } else {
      document.getElementById("terms-container").classList.add("hidden")
      this.termsOpen = false
    }
  }

  renderForm() {

    const { fields: { email, password, firstName, lastName, alias, terms }, handleSubmit } = this.props

    return (
      <form onSubmit={handleSubmit(data => { this.doRegister(data) })}>
        <label htmlFor="email">Sähköposti</label>
        <input name="email" type="email" placeholder="Sähköposti" {...email} />
        {email.touched && email.error && <div className="form-error">{email.error}</div>}
        <label htmlFor="password">Salasana</label>
        <input name="password" type="password" placeholder="Salasana" {...password}/>
        {password.touched && password.error && <div className="form-error">{password.error}</div>}
        <label htmlFor="firstName">Etunimi</label>
        <input name="firstName" type="text" placeholder="Etunimi" {...firstName}/>
        {firstName.touched && firstName.error && <div className="form-error">{firstName.error}</div>}
        <label htmlFor="lastName">Sukunimi</label>
        <input name="lastName" type="text" placeholder="Sukunimi" {...lastName}/>
        {lastName.touched && lastName.error && <div className="form-error">{lastName.error}</div>}

        <a className="text-link block centered margin-bottom cursor-pointer" onClick={() => this.toggleTerms()}>Käyttöehdot</a>
        <div id="terms-container" className="hidden">
          <Terms />
        </div>

        <input name="terms" type="checkbox" {...terms} className="checkbox" />
        <label htmlFor="terms" className="inline-label">Hyväksyn käyttöehdot</label>
        {terms.touched && terms.error && <div className="form-error">{terms.error}</div>}
        <button type="submit" className="btn-small btn-blue">Rekisteröidy</button>
      </form>
    );

  }

  render() {
      return (
        <div class="container">
          <div className="centered">
            <Link className="text-link back-btn" to="/">&lt;Takaisin</Link>
          </div>
          <h2 className="centered login-header">Rekisteröidy käyttäjäksi</h2>          
          <div className="content-container login-container">
            <p className="text-fade margin-top margin-bottom small-info pushed">Rekisteröidythän aktiivisella sähköpostilla! Lähetämme mahdolliset kuitit ja vuorojen perumiset sähköpostiisi.</p>
            <p className="text-fade margin-top margin-bottom small-info pushed">Sähköpostiosoitetta käytetään vain vahvistus ja tiedotus viestien lähetykseen. Sähköpostitietoja ei luovuteta kolmannelle osapuolelle mitään tarkoitusta varten.</p>
            {this.renderForm()}
          </div>  
        </div>
      );
  }
}

const validate = values => {
  const errors = {}
  const emailPattern = /(.+)@(.+){2,}\.(.+){2,}/
  if (!emailPattern.test(values.email)) {
    errors.email = 'Sähköpostiosoite on väärässä muodossa.'
  }
  if (!values.password) {
    errors.password = 'Pakollinen kenttä.'
  } else if (values.password.length < 6) {
    errors.password = 'Salasanan on oltava vähintään 6 merkkiä pitkä.'
  }
  if (!values.firstName) {
    errors.firstName = 'Pakollinen kenttä.'
  }
  if (!values.lastName) {
    errors.lastName = 'Pakollinen kenttä.'
  }
  if (!values.terms) {
    errors.terms = 'Sinun tulee hyväksyä käyttöehdot.'
  }
  return errors
}

function mapStateToProps(state) {
  return { auth: state.auth, currentUser: state.currentUser }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) }
}

export default reduxForm({
  form: 'RegisterForm',
  fields: ['email', 'password', 'firstName', 'lastName', 'alias', 'terms'],
  validate
}, mapStateToProps, mapDispatchToProps)(Register)
