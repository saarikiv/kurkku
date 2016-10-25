import axios from "axios"
import {
    _hideLoadingScreen,
    _showLoadingScreen
} from './loadingScreen.js'


export function test1(url) {
    return dispatch => {
        _showLoadingScreen(dispatch, "Aloitetaan testit")
            axios.get(url)
            .then(response => {
                _hideLoadingScreen(dispatch, "testi1 onnistui", true, 5000)
            })
            .catch(error => {
             console.error("TEST-failed: ", error);
               _hideLoadingScreen(dispatch, "testi1 epäonnistui" + error, false, 5000)
            });
    }
}

export function test2(query) {
    return dispatch => {
        _showLoadingScreen(dispatch, "Aloitetaan testit")
        let KURKKUURL = 'http://localhost:3000/completepaytrail'
        firebase.auth().currentUser.getToken(true)
        .then(idToken => {
            return axios.post(KURKKUURL, {
                current_user: idToken,
                METHOD: query.METHOD,
                ORDER_NUMBER: query.ORDER_NUMBER,
                PAID: query.PAID,
                RETURN_AUTHCODE: query.RETURN_AUTHCODE,
                TIMESTAMP: query.TIMESTAMP
            })
        })
        .then(response => {
            _hideLoadingScreen(dispatch, "Testi 2 onnistui", true)
        })
        .catch(error => {
            console.error("TEST-failed: ", error);
            _hideLoadingScreen(dispatch, "Testi 2 epäonnistui: " + error, false,5000)
        });
    }
}

export function testFirebaseErrorLogging() {
    return dispatch => {
        _showLoadingScreen(dispatch, "Aloitetaan testit")
        let KURKKUURL = typeof(KURKKUSERVER) === "undefined" ? 'http://localhost:3000/test' : KURKKUSERVER + '/test'
        firebase.auth().currentUser.getToken(true)
        .then(idToken => {
            return axios.post(KURKKUURL, {
                current_user: idToken,
                test_case: "firebase_error_log"
            })
        })
        .then(response => {
            _hideLoadingScreen(dispatch, "Testi onnistui", true)
        })
        .catch(error => {
            console.error("TEST-failed: ", error);
            _hideLoadingScreen(dispatch, "Testi epäonnistui: " + error, false, 5000)
        });
    }
}

