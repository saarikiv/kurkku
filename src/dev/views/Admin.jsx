import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import AdminHeader from '../components/admin/AdminHeader.jsx'
import ShopItemCountForm from '../components/admin/ShopItemCountForm.jsx'
import UserList from '../components/admin/UserList.jsx'
import AdminList from '../components/admin/AdminList.jsx'
import SlotList from '../components/admin/SlotList.jsx'
import ShopList from '../components/admin/ShopList.jsx'
import InfoList from '../components/admin/InfoList.jsx'
import TermsList from '../components/admin/TermsList.jsx'
import PendingTransactionsList from '../components/admin/PendingTransactionsList.jsx'


class Admin extends React.Component {

 constructor(){
   super()
   this.allowShow = false;
 }

 static contextTypes = {
    router: React.PropTypes.object
  }

componentWillMount(){
}

componentWillUnmount(){
}

componentWillReceiveProps(nextProps){
  if(nextProps.currentUser.roles.admin === true){
    this.allowShow = true;
  }
}

  render() {
    if(this.props.currentUser.key === "0"){
      return <div/>
    }
    if(this.allowShow){
      return (
        <div>
          <AdminHeader />
          <PendingTransactionsList />
          <SlotList />
          <ShopList />
          <UserList />
          <AdminList />
          <TermsList />
        </div>
      )
    } else {
      return(
        <div>
          <p>Sinun pitää olla järjestelmän pääkäyttäjä.</p>
          <p>Ota yhteys järjestelmän valvojaan lisäoikeuksien saamiseksi.</p>
       </div>
      )
    }
  }
}

function mapStateToProps(state) {
  return { auth: state.auth, currentUser: state.currentUser }
}
export default connect(mapStateToProps, null)(Admin)
