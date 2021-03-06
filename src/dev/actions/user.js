import axios from "axios"

import {
    UPDATE_USERS_BOOKINGS,
    UPDATE_USERS_TRANSACTIONS,
    USER_ERROR,
    USER_DETAILS_UPDATED_IN_DB,
    STOP_UPDATING_USER_DETAILS_FROM_DB,
    SEND_FEEDBABCK,
    VERIFY_EMAIL,
    PASSWORD_RESET,
    UPDATE_USER_DETAILS
} from './actionTypes.js'

import {
    _hideLoadingScreen,
    _showLoadingScreen
} from './loadingScreen.js'


const Auth = firebase.auth();

var UserRef;
var TransactionsRef;
var BookingsRef;

export function newCase ( caseDetails ){
    return dispatch => {
        console.log("NEW case");
        firebase.database().ref('/newCases').push(
            {
                caseStatus: 'NEW',
                caseDetails: caseDetails
            }
        )
    }
}

export function sendFeedback(feedback){
  return dispatch => {
    //for diagnostics
    dispatch({
      type: SEND_FEEDBABCK
    })
    _showLoadingScreen(dispatch, "Lähetetään palaute")
    let KURKKUURL = typeof(KURKKUSERVER) === "undefined" ? 'http://localhost:3000/feedback' : KURKKUSERVER + '/feedback'
    firebase.auth().currentUser.getToken(true)
    .then(idToken => {
        return axios.post(KURKKUURL, {
            current_user: idToken,
            feedback_message: feedback
        })
    })
    .then(response => {
        _hideLoadingScreen(dispatch, "Palaute lähetetty", true)
    })
    .catch(error => {
        console.error("FEEDBACK_ERROR:", error);
        _hideLoadingScreen(dispatch, "Palautteen lähettämisessä tapahtui virhe: " + error.toString(), false)
        dispatch({
            type: USER_ERROR,
            payload: {
                error: {
                    code: "FEEDBACK_ERROR",
                    message: "Sending feedback failed: " + error.toString()
                }
            }
        })
    });


  }
}

export function updateUserDetails(user) {
    return dispatch => {
        _showLoadingScreen(dispatch, "Päivitetään tiedot")
        firebase.database().ref('/users/' + user.uid).update(user)
            .then(() => {
              dispatch({
                type: UPDATE_USER_DETAILS
              })
                _hideLoadingScreen(dispatch, "Tiedot päivitetty", true)
            })
            .catch(error => {
                console.error("User details update failed: ", error)
                dispatch({
                    type: USER_ERROR,
                    payload: error
                })
                _hideLoadingScreen(dispatch, "Tietojen päivittämisessä tapahtui virhe: " + error.message, false)
            })
    }
}


export function fetchUsersBookings(uid) {
    return dispatch => {
        var oneSlot;
        var allSlots;
        var oneBooking;
        var allBookings;
        var booking = {};
        var returnListBookings = [];
        var returnListHistory = [];
        var slotInfo = {}
        firebase.database().ref('/slots/').once('value')
            .then(snapshot => {
                slotInfo = snapshot.val()
                BookingsRef = firebase.database().ref('/bookingsbyuser/' + uid);
                BookingsRef.on('value', snapshot => {
                    allSlots = snapshot.val();
                    returnListBookings = Object.assign([]);
                    returnListHistory = Object.assign([]);
                    if (allSlots) {
                        for (oneSlot in allSlots) {
                            allBookings = allSlots[oneSlot]
                            for (oneBooking in allBookings) {
                                booking = Object.assign({}, allBookings[oneBooking]);
                                booking.slot = oneSlot;
                                booking.slotInfo = slotInfo[oneSlot];
                                if (!booking.slotInfo) {
                                    dispatch({
                                        type: USER_ERROR,
                                        payload: {
                                            error: {
                                                code: "DB_INTEGRITY_ERR",
                                                message: "Referred slot is missing from database: " + oneSlot
                                            },
                                            bookingsReady: true
                                        }
                                    })
                                } else {
                                    booking.slotInfo.key = oneSlot;
                                    let referenceTime = booking.slotTime + booking.slotInfo.end - booking.slotInfo.start //Find the end time of the slot
                                    if (referenceTime < Date.now()) {
                                        returnListHistory.push(booking)
                                    } else {
                                        returnListBookings.push(booking);
                                    }
                                }
                            }
                        }
                        returnListBookings.sort((a, b) => {
                            return a.slotTime - b.slotTime
                        })
                        returnListHistory.sort((a, b) => {
                            return a.slotTime - b.slotTime
                        })
                    }
                    dispatch({
                        type: UPDATE_USERS_BOOKINGS,
                        payload: {
                            bookingsReady: true,
                            bookings: returnListBookings,
                            history: returnListHistory
                        }
                    })
                }, error => {
                    console.error("Failed getting bookings: ", uid, error);
                    dispatch({
                        type: USER_ERROR,
                        payload: {
                            error,
                            bookingsReady: true
                        }
                    })
                })
            }, error => {
                console.error("Failed getting slot info: ", uid, error);
                dispatch({
                    type: USER_ERROR,
                    payload: {
                        error,
                        bookingsReady: true
                    }
                })
            })
            .catch((error) => {
                console.error("Failed getting bookings: ", uid, error);
                dispatch({
                    type: USER_ERROR,
                    payload: {
                        error,
                        bookingsReady: true
                    }
                })
            })
    }
}

export function fetchUsersTransactions(uid) {
    return dispatch => {
        var transactions = null;
        TransactionsRef = firebase.database().ref('/transactions/' + uid);
        TransactionsRef.on('value', snapshot => {
            var trx = {
                time: 0,
                count: 0,
                firstexpire: 0,
                details: {
                    valid: [],
                    expired: [],
                    oneTime: []
                }
            };
            let now = Date.now();
            let all = snapshot.val();
            let one;
            var trxdetails = {};
            for (one in all) {
                trxdetails = Object.assign({}); //Need new object to be pushed to arrays
                trxdetails.purchasetime = one;
                trxdetails.type = all[one].type;
                trxdetails.expires = all[one].expires;
                trxdetails.paymentInstrumentType = all[one].details.transaction.paymentInstrumentType;
                trxdetails.shopItem = all[one].shopItem;
                trxdetails.shopItemKey = all[one].shopItemKey;
                trxdetails.oneTime = all[one].oneTime || false;
                switch (all[one].type) {
                    case "time":
                        if (all[one].expires > now) {
                            trx.time = all[one].expires;
                        }
                        break;
                    case "count":
                        trxdetails.unusedtimes = all[one].unusedtimes;
                        trxdetails.usetimes = all[one].usetimes;
                        if (all[one].expires > now) {
                            trx.count += all[one].unusedtimes;
                            if (all[one].expires < trx.firstexpire || trx.firstexpire === 0) {
                                if (all[one].unusedtimes > 0) {
                                    trx.firstexpire = all[one].expires;
                                }
                            }
                        }
                        break;
                    default:
                        console.error("undefined transaction type: ", uid, all[one].type, all[one]);
                        break;
                }
                if (trxdetails.expires > now) {
                    trx.details.valid.push(trxdetails);
                } else {
                    trx.details.expired.push(trxdetails);
                }
                if (trxdetails.oneTime) {
                    trx.details.oneTime.push(trxdetails.shopItemKey)
                }
            }
            trx.details.valid.sort((a, b) => {
                return a.expires - b.expires
            });
            trx.details.expired.sort((a, b) => {
                return a.expires - b.expires
            });

            dispatch({
                type: UPDATE_USERS_TRANSACTIONS,
                payload: {
                    transactionsReady: true,
                    transactions: trx
                }
            })
        }, error => {
            console.error("Fetching transactions failed: ", uid, error);
            dispatch({
                type: USER_ERROR,
                payload: {
                    transactionsReady: true,
                    error
                }
            })
        })
    }
}

export function fetchUserDetails(uid) {
    UserRef = firebase.database().ref('/users/' + uid);
    var usr = null;
    let tmp = null
    return dispatch => {
        UserRef.on('value', snapshot => {
            if (snapshot.val()) {
                usr = snapshot.val();
                usr.key = snapshot.key;
                firebase.database().ref('/specialUsers/' + usr.key).once('value')
                    .then(snapshot => {
                        usr.roles = {
                            admin: false,
                            instructor: false
                        }
                        if (snapshot.val()) {
                            if (snapshot.val().admin) {
                                usr.roles.admin = snapshot.val().admin
                            }
                            if (snapshot.val().instructor) {
                                usr.roles.instructor = snapshot.val().instructor
                            }
                            if (snapshot.val().tester) {
                                usr.roles.tester = snapshot.val().tester
                            }
                        }
                        dispatch({
                            type: USER_DETAILS_UPDATED_IN_DB,
                            payload: usr
                        })
                    })
            }
        }, err => {
            console.error("Getting user data failed: ", err);
            dispatch({
                type: USER_ERROR,
                payload: err
            })
        })
    }
}

export function finishedWithUserDetails() {
    if (UserRef) UserRef.off('value');
    if (TransactionsRef) TransactionsRef.off('value');
    if (BookingsRef) BookingsRef.off('value')
    return dispatch => {
        dispatch({
            type: STOP_UPDATING_USER_DETAILS_FROM_DB,
            payload: null
        })
    }
}

export function resetPassword(email) {
    return dispatch => {
        _showLoadingScreen(dispatch, "Lähetetään salasanan uudelleen asetus viesti");
        firebase.auth().sendPasswordResetEmail(email).then(() => {
          dispatch({
            type: PASSWORD_RESET
          })
                _hideLoadingScreen(dispatch, "Viesti lähetetty", true);
            })
            .catch((error) => {
                console.error("Error from: sendPasswordResetEmail - ", error)
                dispatch({
                    type: USER_ERROR,
                    payload: {
                        error: {
                            code: "EMAIL_RESET_ERROR",
                            message: error.message
                        }
                    }
                })
                _hideLoadingScreen(dispatch, "Viestin lähetyksessä tapahtui virhe:" + error.message, false);
            })

    }
}

export function sendEmailVerification() {
    return dispatch => {
        _showLoadingScreen(dispatch, "Lähetetään verifiointilinkki sähköpostiisi")
        firebase.auth().currentUser.sendEmailVerification()
            .then(() => {
              dispatch({
                type: VERIFY_EMAIL
              })
                _hideLoadingScreen(dispatch, "Sähköposti lähetetty", true)
            })
            .catch((error) => {
                console.error("Error from: sendEmailVerification - ", error)
                dispatch({
                    type: USER_ERROR,
                    payload: {
                        error: {
                            code: "EMAIL_VERIFICATION_ERROR",
                            message: error.message
                        }
                    }
                })
                _hideLoadingScreen(dispatch, "Sähköpostin lähetyksessä tapahtui virhe: " + error.message, false)
            })
    }
}

export function createNewUser(user, firstname, lastname, alias) {
    firebase.database().ref('/users/' + user.uid).once('value').then(snapshot => {
        let existingUser = snapshot.val()
        if (existingUser === null) {
            if (firstname === null) {
                firstname = firebase.auth().currentUser.displayName;
            }
            return firebase.database().ref('/users/' + user.uid).update({
                email: user.email,
                uid: user.uid,
                firstname: firstname,
                lastname: lastname,
                alias: alias
            }).catch((error) => {
                if (error) {
                    console.error("Error writing new user to database", error);
                    dispatch({
                        type: AUTH_ERROR,
                        payload: {
                            error: {
                                code: error.code,
                                message: error.message
                            }
                        }
                    })
                }
            })
        }
    })
}
