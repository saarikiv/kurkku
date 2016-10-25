import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import DiagnosticsHeader from '../components/diagnostics/DiagnosticsHeader.jsx'
import DiagnosticsViewer from '../components/diagnostics/DiagnosticsViewer.jsx'

class Diagnostics extends React.Component {

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
          <DiagnosticsHeader />
          <DiagnosticsViewer />
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
export default connect(mapStateToProps, null)(Diagnostics)
