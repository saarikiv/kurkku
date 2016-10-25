import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as actionCreators from '../../actions/shop.js'
import { daysLeft, getDayStrMs } from '../../helpers/timeHelper.js'

class ValidItem extends React.Component {

  constructor(){
    super()
    this.confirmation = false
    this.timeoutId = 0
  }

  componentWillUnmount() {
    if(this.timeoutId !== 0) {
      clearTimeout(this.timeoutId)
    }
  }

  remove(item, user) {
    if(this.confirmation) {
      this.props.actions.removeTransaction (item, user)
      this.confirmation = false
    } else {
      this.confirmation = true
      this.forceUpdate()
      this.timeoutId = setTimeout(() => {
        this.confirmation = false;
        this.forceUpdate()
      }, 2000)
    }
  }

  render() {
    let removeButtonText = (this.confirmation)? "Vahvista poisto" : "Poista"
    const { item, user } = this.props
    return (
      <li>
        <span className="item-row">kortti: {item.shopItem.title}</span>
        <span className="item-row">ostettu: {getDayStrMs(item.purchasetime)} ostotapa: {item.paymentInstrumentType}</span>
        <button className="btn-small btn-red" onClick={() => {this.remove(item, user)}}>{removeButtonText}</button>
      </li>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch)}
}

export default connect(null, mapDispatchToProps)(ValidItem)