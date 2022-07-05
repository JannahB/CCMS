import { Injectable} from '@angular/core';
import { AuthorizationInterceptor } from '../../interceptors/authorization.interceptor';
import { AuthenticationModel } from '../../model/authentication-model';
import { ToastService } from '../../services/utility/toast.service';
import { UserService } from '../../../common/services/utility/user.service';
import { Router } from '@angular/router';
import { GlobalState } from '../../../common/services/state/global.state';
import { throwToolbarMixedModesError } from '@angular/material';

const CHECK_INTERVAL = 15000 // in ms
const STORE_KEY =  'lastAction';

@Injectable()
export class AutoLogoutService {

  //Key for local store of max user inactivity in minutes and how often to check for last action
  MUAL_KEY = 'MINUTES_UNTIL_AUTO_LOGOUT';
  LACI_KEY = 'LAST_ACTION_CHECK_INTERVAL';

  //Stores id for inactivity timer
  inactivity_timer_id = 0;

  //Stores reference to element container
  app_container: HTMLDivElement = null;

  //Stores event listeners
  app_listener_click = null;
  app_listener_scroll = null;
  app_listener_keyup = null;
  app_listener_keydown = null;
  app_listener_keypress = null;
  app_listener_mouseover = null;
  app_listener_mouseout = null;

 public getLastAction() {
    return parseInt(localStorage.getItem(STORE_KEY));
  }
 public setLastAction(lastAction: number) {
    localStorage.setItem(STORE_KEY, lastAction.toString());
  }

  public setLastActionCheckInterval(lastActionCheckInterval:number){
    localStorage.setItem(this.LACI_KEY,lastActionCheckInterval.toString());
  }

  public getLastActionCheckInterval(){
    
    let laci_val = localStorage.getItem(this.LACI_KEY);

    if(laci_val != null){
      return parseInt(laci_val);
    }
    else{
      return 1;
    }
  }

  public setMaxUserInactivity(maxUserInactivity:number){
    localStorage.setItem(this.MUAL_KEY,maxUserInactivity.toString());
  }

  public getMaxUserInactivity(){

    let mual_val = localStorage.getItem(this.MUAL_KEY);

    if(mual_val != null){
       return parseInt(mual_val);
    }
    else{
      return 5;
    }
    
  }

  constructor(
    private router: Router,
    public authenticationModel: AuthenticationModel,
    public toastSvc: ToastService,
    public usersrvc: UserService,
    public _state: GlobalState
    ) {
    
      //Attempts to fetch the stored setting for max user inactivity
      let mual_val = this.getMaxUserInactivity();

      //If the value is 0, this means that the value has no been set and a default value will be set
      if(mual_val == 0){
         this.setMaxUserInactivity(10);
      }
  }

  initListener() {

    //Stores callback functions for the different events
    this.app_listener_click = (() => {this.reset()});
    
    //Generates throtlled listeners
    let scroll_listener = this.get_throttled_listener(this.reset,500);
    this.app_listener_scroll = (() => {scroll_listener.apply(this)});
    
    let keydown_listener = this.get_throttled_listener(this.reset,1000);
    this.app_listener_keydown = (() => {keydown_listener.apply(this)});

    let keyup_listener = this.get_throttled_listener(this.reset,1000);
    this.app_listener_keyup = (() => {keyup_listener.apply(this)});

    let kepress_listener = this.get_throttled_listener(this.reset,1000);
    this.app_listener_keypress = (() => {kepress_listener.apply(this)});

    let mouseover_listener = this.get_throttled_listener(this.reset,1000);
    this.app_listener_mouseover = (() => {mouseover_listener.apply(this)});

    let mouseout_listener = this.get_throttled_listener(this.reset,1000);
    this.app_listener_mouseout = (() => {mouseout_listener.apply(this)});

    //Adds event listeners
    this.app_container.addEventListener('click', this.app_listener_click);
    this.app_container.addEventListener('keydown',this.app_listener_keydown);
    this.app_container.addEventListener('keypress',this.app_listener_keypress);
    this.app_container.addEventListener('keyup',this.app_listener_keyup);
    this.app_container.addEventListener('mouseover',this.app_listener_mouseover);
    this.app_container.addEventListener('mouseout',this.app_listener_mouseout);

    document.addEventListener('scroll',this.app_listener_scroll,true);
  }

  reset() {
    let nowDate = Date.now()
    this.setLastAction(nowDate);
  }

  //This method sets the container for the app that we will listen for inactivity on
  setContainer(app_container){
      this.app_container = app_container
  }

  initInterval() {

    //Stored as class variable so that the timer can be cleared upon logout
    let timer_id:number; 
    let check_interval = this.getLastActionCheckInterval() * 60000;

    timer_id = setInterval(() => {
      this.check();
    }, check_interval) as any as number;

    this.inactivity_timer_id = timer_id;
  }

  check() {

    //This function should only fire if the user is logged in, hence this check
    if(this.usersrvc.loggedInUser == null || AuthorizationInterceptor.authToken == null){

        //Shuts down the service
        this.stopService();
        return;
    }

    const now = Date.now();
    const timeleft = this.getLastAction() + this.getMaxUserInactivity() * 60 * 1000;
    console.log('Checking for browser inactivity');
    const diff = timeleft - now;
    const isTimeout = diff < 0;

    if (isTimeout && this.usersrvc.loggedInUser != null)  {
      console.log("User time expired at " + new Date(now).toLocaleTimeString());

      //Clears user data and stops the timer
      this.usersrvc.loggedInUser = null;
      AuthorizationInterceptor.authToken = null
      this._state.notifyDataChanged('app.loggedOut', null, true);
      this.stopService();

      //Navigates to login page
      this.router.navigate(["login"])
    }
  }

  //Clears the local interval timer
  stopInterval(){
    clearInterval(this.inactivity_timer_id);
  }

  //Removes listeners
  removeListeners(){
    this.app_container.removeEventListener('click', this.app_listener_click);
    this.app_container.removeEventListener('keydown',this.app_listener_keydown);
    this.app_container.removeEventListener('keypress',this.app_listener_keypress);
    this.app_container.removeEventListener('keyup',this.app_listener_keyup);
    this.app_container.removeEventListener('mouseover',this.app_listener_mouseover);
    this.app_container.removeEventListener('mouseout',this.app_listener_mouseout);
    document.removeEventListener('scroll', this.app_listener_scroll,true);
  }

  //Function used to create callback function to throttle event listener
  get_throttled_listener(callback, interval){

    //Flag to control when the scroll event will be fired
    let fire_event = true;

    //Returns callback function
    return function(...args){

       if(!fire_event){
          return;
       }

       fire_event = false;
       callback.apply(this,args);
       setTimeout((() => fire_event = true),interval);
    }

  }

  //Stops the logout service
  stopService(){
    this.stopInterval();
    this.removeListeners();
    console.log('AutoLogoutService Stopped');
  }


  //Starts the service
  startService(){
    console.log('AutoLogoutService Started');
    this.initListener();
    this.initInterval();
    localStorage.setItem(STORE_KEY,Date.now().toString());
    this.check();   
  }
}