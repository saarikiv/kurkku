import React from "react";
import { Link } from "react-router"
import { bindActionCreators } from 'redux'
import { reduxForm } from 'redux-form'

import * as actionCreators from '../actions/user.js'

class ForgotPassword extends React.Component {

    static contextTypes = {
        router: React.PropTypes.object
        
    }

    onSubmit(props) {
        this.props.actions.resetPassword(props.email)
        this.context.router.push('/')
    }

    renderForm() {
        const { fields: { email }, handleSubmit } = this.props

        return (
            <form onSubmit={ handleSubmit(props => this.onSubmit(props)) }>
                <label htmlFor="email">Sähköposti</label>
                <input type="email" name="email" {...email}/>
                <button className="btn-small btn-blue" type="submit">Lähetä</button>
            </form>
        )        
    }

    render() {
        return (
            <div class="container centered">
                <Link className="text-link back-btn" to="/">&lt;Takaisin</Link>
                <h2 className="centered login-header">Unohditko salasanasi?</h2>
                <div className="content-container login-container align-left">
                    <p className="text-fade margin-top margin-bottom small-info pushed">Anna sähköpostiosoitteesi. Lähetämme sinulle salasanan vaihtolinkin.</p>
                    <p className="text-fade margin-top margin-bottom small-info pushed">Sähköpostin saapumisessa voi kestää tovi.</p>
                    {this.renderForm()}
                </div>
            </div>
        )
    }
}


function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch) }
}

export default reduxForm({
  form: 'ForgotPasswordForm',
  fields: ['email']
}, null, mapDispatchToProps)(ForgotPassword)

