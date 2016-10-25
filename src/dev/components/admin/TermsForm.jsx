import React from 'react'
import { reduxForm } from 'redux-form'
import { bindActionCreators } from 'redux'

import * as actionCreators from '../../actions/admin.js'

class TermsForm extends React.Component {

  onSubmit(props) {

    if(this.props.mode === "addNew"){
      this.props.actions.addTerms(props)
    } else {
      this.props.actions.modifyTerms(this.props.dbKey, props)
    }
    this.props.actions.minimizeTermsForm();
  }

  renderContent() {

    var buttonText = (this.props.mode === "addNew")? "Luo" : "Päivitä"

    const { fields: { title, content }, handleSubmit } = this.props

    return (
        <form onSubmit={handleSubmit(props => this.onSubmit(props))}>
          <label htmlFor="termstitle">Ehdon otsikko</label>
          <input type="text" name="termstitle" placeholder="esim: Maksuehdot" {...title} />

          <label htmlFor="termscontent">Ehdon kuvaus</label>
          <textarea type="text" name="temrscontent" placeholder="esim: Maksuihin sovelletaan Suomen lakien mukaisia ehtoja." {...content}/>

          <button className="btn-small btn-blue" type="submit">{buttonText}</button>
        </form>
      )
  }

  render() {


    return (
      <div className="container transparent-bg">
       	<div className="surrounded-container">
          <h2 className="header-collapse">Ehdon tiedot</h2>
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
  form: 'TermsForm',
  fields: ['title', 'content'],
  validate
}, null, mapDispatchToProps)(TermsForm)
