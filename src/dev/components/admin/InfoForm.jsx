import React from 'react'
import { reduxForm } from 'redux-form'
import { bindActionCreators } from 'redux'

import * as actionCreators from '../../actions/admin.js'

class InfoForm extends React.Component {

  onSubmit(props) {

    if(this.props.mode === "addNew"){
      this.props.actions.addInfo(props)
    } else {
      this.props.actions.modifyInfo(this.props.dbKey, props)
    }
    this.props.actions.minimizeInfoForm();
  }

  renderContent() {

    var buttonText = (this.props.mode === "addNew")? "Luo" : "Päivitä"

    const { fields: { title, content }, handleSubmit } = this.props

    return (
        <form onSubmit={handleSubmit(props => this.onSubmit(props))}>
          <label htmlFor="infotitle">Infon otsikko</label>
          <input type="text" name="infotitle" placeholder="esim: saunasta..." {...title} />

          <label htmlFor="infocontent">Infon kuvaus</label>
          <textarea type="text" name="infocontent" placeholder="esim: sauna on lämmin ja rentoutumiselle omiaan." {...content}/>

          <button className="btn-small btn-blue" type="submit">{buttonText}</button>
        </form>
      )
  }

  render() {


    return (
      <div className="container transparent-bg">
       	<div className="surrounded-container">
          <h2 className="header-collapse">Infon tiedot</h2>
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
  form: 'InfoForm',
  fields: ['title', 'content'],
  validate
}, null, mapDispatchToProps)(InfoForm)
