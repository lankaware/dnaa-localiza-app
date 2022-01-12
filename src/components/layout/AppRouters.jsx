import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from './Home'
import Login from '../business/Login'
import MktEvent from '../business/MktEvent'
import MktEventList from '../business/MktEventList'
import Location from '../business/Location'
import LocationList from '../business/LocationList'
import EmailParms from '../business/EmailParms'

const AppRouters = props => (
    <main className='content'>
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route exact path="/login" component={Login} />
            <Route exact path="/mktevent/:id" component={MktEvent} />
            <Route exact path="/mkteventlist" component={MktEventList} />
            <Route exact path="/location/:id" component={Location} />
            <Route exact path="/locationlist" component={LocationList} />
            <Route exact path="/emailparms" component={EmailParms} />
            <Route path="*">
                <h1>Página em construção.</h1>
            </Route>
        </Switch>
    </main>
)
export default AppRouters
