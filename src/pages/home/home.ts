import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {CheckoutPage} from '../checkout/checkout';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    constructor(public navCtrl: NavController) {

    }

    sendToCheckout() {
        this.navCtrl.push(CheckoutPage, {});
    }

}
