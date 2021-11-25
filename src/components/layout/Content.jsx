import { React } from 'react'
import { Switch, Route } from 'react-router-dom'


import Login from '../business/Login'
import Quiz from '../business/Quiz'
import Quizzes from '../business/Quizzes'
import Home from './Home'
import Tools from '../business/Tools'
import Tool from '../business/Tool'
import CustomerList from '../business/CustomerList'
import Customer from '../business/Customer'
import Respondent from '../business/Respondent'

const Content = props => {
    return (
        <>
            <main className='content'>
                <Switch>
                    <Route exact path='/'>
                        <Home />
                    </Route>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/quizzes" component={Quizzes} />
                    <Route exact path="/quiz/:id" component={Quiz} />
                    <Route exact path="/tools" component={Tools} />
                    <Route exact path="/tool/:id" component={Tool} />
                    <Route exact path="/customerList" component={CustomerList} />
                    <Route exact path="/customer/:id" component={Customer} />
                    <Route exact path="/respondent/:customer/:id" component={Respondent} />
                    <Route path='*'>
                        <h1>Em construção</h1>
                    </Route>
                </Switch>
            </main>
        </>
    )
}

export default Content