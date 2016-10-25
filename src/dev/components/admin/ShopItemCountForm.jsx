import React from 'react'
import { reduxForm } from 'redux-form'
import { bindActionCreators } from 'redux'

import * as actionCreators from '../../actions/admin.js'

class ShopItemCountForm extends React.Component {
  onSubmit(props) {
    if(this.props.mode === "addNew"){
      this.props.actions.addShopItem(props, "count")
    } else {
      this.props.actions.modifyShopItem(props, "count")
    }
    this.props.actions.minimizeCountShopForm();
  }


  renderContent() {

    var buttonText = (this.props.mode === "addNew")? "Luo" : "Päivitä"


    const { fields: { desc, price, taxpercent, title, usetimes, expiresAfterDays, oneTime }, handleSubmit } = this.props

    if (this.props.cmp.expanded) {
      return (
        <form onSubmit={handleSubmit(props => this.onSubmit(props))}>
          <label htmlFor="countTitle">Otsikko</label>
          <input type="text" name="countTitle" {...title} placeholder="esim: 4 kerran kortti" />

          <label htmlFor="countDesc">Kuvaus</label>
          <textarea type="text" name="countDesc" {...desc} placeholder="esim: 4 kertaa saunomista" />

          <label htmlFor="countUsetimes">Käyttömäärä kertoina</label>
          <input type="number" name="countUsetimes" {...usetimes} placeholder="esim: 4 tai 8" />

          <label htmlFor="countExp">Kortin umpeutumisaika päivinä</label>
          <input type="number" name="countExp" {...expiresAfterDays} placeholder="esim: 30 tai 60" />

          <label htmlFor="countPrice">Verollinen hinta</label>
          <input type="number" step="0.01" name="countPrice" {...price} placeholder="esim: 10.5 tai 50" />

          <label htmlFor="countTaxpercent">Veroprosentti</label>
          <input type="number" step="0.01" name="countTaxpercent" {...taxpercent} placeholder="esim: 10.5 tai 50" />

          <label htmlFor="oneTime">Kerran ostettava tuote</label>
          <input type="checkbox" name="oneTime" className="checkbox rowbox" {...oneTime} />

          <button className="btn-small btn-blue" type="submit">{buttonText}</button>
        </form>
      )
    }
    else {
      return <div></div>
    }
  }

  render() {
    return (
      <div className="container transparent-bg">
        <div className="surrounded-container">
          <h2 className="header-collapse">Kertakortin tiedot</h2>
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
  return { cmp: state.shopItemCountForm }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch)}
}

export default reduxForm({
  form: 'ShopItemCountForm',
  fields: ['desc', 'price', 'taxpercent', 'title', 'usetimes', 'expiresAfterDays', 'oneTime'],
  validate
}, mapStateToProps, mapDispatchToProps)(ShopItemCountForm)
