import React from "react";
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import HomeLoginRegister from '../components/home/HomeLoginRegister.jsx'
import ContactInfo from '../components/home/ContactInfo.jsx'

class Home extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object
  }

  componentWillMount(){
    if(this.props.auth.uid) {
      this.context.router.push('user');
    }
  }

  componentWillReceiveProps(nextProps = null){
    if(nextProps.auth.uid) {
      this.context.router.push('user');
    }
  }

  render() {
    return (
      <div>
        <HomeLoginRegister />
        <ContactInfo />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { auth: state.auth }
}

export default connect(mapStateToProps, null)(Home)
