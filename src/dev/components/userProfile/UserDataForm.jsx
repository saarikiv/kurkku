import React from 'react'
import { reduxForm } from 'redux-form'
import { bindActionCreators } from 'redux'

import * as actionCreators from '../../actions/user.js'

class UserDataForm extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object
  }

  onSubmit(props) {
    var user = {
      uid: this.props.auth.uid,
      firstname: props.firstname,
      lastname: props.lastname,
      alias: null
    }
    this.props.actions.updateUserDetails(user)
  }

  renderContent() {
    if(!this.props.currentUser) return( <div></div>)

    const { fields: { firstname, lastname, alias }, handleSubmit, load } = this.props

      return (
        <form onSubmit={handleSubmit(props => this.onSubmit(props))}>
          <label htmlFor="firstName">Etunimi</label>
          <input id="firstName" type="text" name="firstname"  {...firstname}/>

          <label htmlFor="lastName">Sukunimi</label>
          <input type="text" name="lastname" {...lastname}/>

          <p>Sähköpostisi: {this.props.currentUser.email}</p>

          <button className="btn-small btn-blue" type="submit">Päivitä</button>
        </form>
      )
  }


  render() {
    return (
      <div className="container bordered-container">
        <div className="content-container">
          <h2 className="header-collapse">Tallennetut tietosi</h2>
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

function mapStateToProps(state) {
  return { initialValues: state.currentUser, auth: state.auth, currentUser: state.currentUser }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch)}
}

export default reduxForm({
  form: 'UserDataForm',
  fields: ['firstname', 'lastname', 'alias']
}, mapStateToProps, mapDispatchToProps)(UserDataForm)
