import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import ReservationItem from './ReservationItem.jsx'

class CaseTableHeader extends React.Component {

  renderBookings(item){
    return(<ReservationItem className="centered" key={item.slotInfo.key} item={item.slotInfo}/> )
  }

  render() {

    const {bookings} = this.props.currentUser

    let currentReservations = null;

    if(bookings.length > 0){
      currentReservations = <h3>Voimassa olevat varauksesi:</h3>
    }

    return (
      <div class="container header-container">
        <div className="content-container">
          <h1 className="nomargin nopadding">Remonttipyynnöt</h1>
          <small className="text-fade margin-top margin-bottom small-info">Tästä voit katsella avoimia pyyntöjä.</small>
          <table>
            <tbody>
                {bookings.map(this.renderBookings.bind(this))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { auth: state.auth, currentUser: state.currentUser}
}

export default connect(mapStateToProps, null)(CaseTableHeader)
