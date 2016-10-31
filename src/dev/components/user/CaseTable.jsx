import React from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { mapDay } from '../../helpers/timeHelper.js'
import CaseTableItem from './CaseTableItem.jsx'
import * as actionCreators from '../../actions/slots.js'

class CaseTable extends React.Component {

  componentWillMount() {
    this.props.actions.fetchTimetable();
  }

  componentWillUnmount(){
    this.props.actions.stopFetchCaseTable();
  }

  renderTR(rowName, rowNumber){
    let day = new Date()
    return(
      <tr key={rowNumber}>
        <th>{rowName}</th>
        <CaseTableItem/>
      </tr>
    )
  }

  renderCases() {
    const now = new Date()
    const start = mapDay(now.getDay())
    let row = 0
    let output = []
    const rowNames = [
      'Uudet',
      'Lisäselvitystä vaativat',
      'Valitut',
      'Hylätyt',
      'Käynnissä'
    ]
    do {
      output.push(this.renderTR(rowNames[row], row))
      row++
    } while (row > 4);
    return output
  }

  render() {
    return (
      <div class="container timetable-container">
      <h3 className="centered">Remonttipyyntölista:</h3>
        <table className="centered">
          <tbody>
            {this.renderCases()}
          </tbody>
        </table>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { timetable: state.timetable}
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actionCreators, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(CaseTable)
