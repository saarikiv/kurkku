import React from 'react'
import { Route, IndexRoute  } from 'react-router'

// Views
import Diagnostics from './dev/views/Diagnostics.jsx'
import Admin from './dev/views/Admin.jsx'
import Home from './dev/views/Home.jsx'
import Info from './dev/views/Info.jsx'
import Layout from './dev/views/Layout.jsx'
import Register from './dev/views/Register.jsx'
import User from './dev/views/User.jsx'
import Tests from './dev/views/Tests.jsx'
import UserProfile from './dev/views/UserProfile.jsx'
import ForgotPassword from './dev/views/ForgotPassword.jsx'
import Feedback from './dev/views/Feedback.jsx'
import UserOverview from './dev/views/UserOverview.jsx'
import LockedUser from './dev/views/LockedUser.jsx'

export default (
  <Route path="/" component={Layout}>
    <IndexRoute component={Home}></IndexRoute>
    <Route path="admin" component={Admin} />
    <Route path="info" component={Info} />
    <Route path="user" component={User} />
    <Route path="tests" component={Tests} />
    <Route path="register" component={Register} />
    <Route path="userProfile" component={UserProfile} />
    <Route path="forgotPassword" component={ForgotPassword} />
    <Route path="diagnostics" component={Diagnostics} />
    <Route path="feedback" component={Feedback} />
    <Route path="useroverview" component={UserOverview} />
    <Route path="lockeduser" component={LockedUser} />
  </Route>
)
