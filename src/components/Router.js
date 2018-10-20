import React from 'react';
import {Scene,Router} from 'react-native-router-flux';
import StartPage from './StartPage';
import Login from './Login';
import SignUp from './SignUp';
import Maps from  './Maps';
import uniLogin from './uniLogin';
import MainScreen from './MainScreen'

const RouterComponent=()=>{
    return(
        <Router navigationBarStyle={{backgroundColor:'transparnet'}}>
             <Scene key='root'>
                <Scene key="uniLogin" component={uniLogin} hideNavBar={true} />   
                <Scene key="Login" component={Login} hideNavBar={true}  />
                <Scene key="MainScreen" component={MainScreen} hideNavBar={true} />
                <Scene key="SignUp" component={SignUp} hideNavBar={true} />
            </Scene> 
        </Router>
    )
}
export default RouterComponent;