import React from "react";
import { Link } from "react-router"
import { bindActionCreators } from 'redux'
import { reduxForm } from 'redux-form'

import * as actionCreators from '../../actions/auth.js'

class HomeLoginRegister extends React.Component {
  
  static contextTypes = {
    router: React.PropTypes.object
  }

  constructor(){
    super();
  }

  onSubmit(props) {
    this.props.actions.login(props.email, props.password)
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.auth.uid){
      this.context.router.push('/user');
    }
  }

  renderForm() {
    const { fields: { email, password }, handleSubmit } = this.props

    return (
      <form onSubmit={ handleSubmit(props => this.onSubmit(props)) }>            
        <label htmlFor="email">Sähköposti</label>
        <input id="email" type="email" name="email" placeholder="Sähköposti" {...email}/>
        <label htmlFor="password">Salasana</label>
        <input id="password" type="password" name="password" placeholder="Salasana" {...password}/>
        <button className="btn-small btn-blue" type="submit">Kirjaudu</button>
        <Link to="forgotPassword" className="mini-link">Unohditko salasanasi?</Link>  
      </form>
    )
  }


  render() {
    return (
      <div class="container bordered-container centered">

        <h3 className="centered login-header margin-bottom">Kirjaudu sisään</h3>
        <div className="content-container login-container">          
          {this.renderForm()}
        </div>

        <div className="register-container">
          <p>Oletko uusi käyttäjä?</p>
          <Link className="btn-small btn-green text-bold" to="register">Rekisteröidy</Link>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { auth: state.auth, currentUser: state.currentUser }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) }
}

export default reduxForm({
  form: 'LoginForm',
  fields: ['email', 'password']
}, mapStateToProps, mapDispatchToProps)(HomeLoginRegister)