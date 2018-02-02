import {Component, NgZone, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {PaymentHttpProvider} from '../../providers/payment-http/payment-http';
import scriptjs from 'scriptjs';

declare let PagSeguroDirectPayment;

/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-checkout',
    templateUrl: 'checkout.html',
})
export class CheckoutPage {
    
    paymentMethod = 'Boleto';
    paymentMethods: Array<any> = [];
    creditCard = {
        num: '',
        cvv: '',
        monthExp: '',
        yearExp: '',
        brand: '',
        token: ''
    }
    
    constructor(public navCtrl: NavController, public navParams: NavParams, 
        public PaymentHttp: PaymentHttpProvider, public zone: NgZone) {
    }

    ionViewDidLoad() {
        //Carrega/Inclui arquivo javascript
        scriptjs('https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js', () => {
            this.PaymentHttp.getSession()
            .subscribe(data => {
                this.initSession(data);
                this.getPaymentMethods();
            })
        });
        
        console.log('ionViewDidLoad CheckoutPage');
        
        
    }
    
    initSession(data){
        //sessionId
        PagSeguroDirectPayment.setSessionId(data.sessionId); 
    }
    
    getPaymentMethods(){
        
        PagSeguroDirectPayment.getPaymentMethods({
            amount: 100,
            success(response){
                console.log(response);
                let paymentsReturned = response.paymentMethods;
                
                this.paymentMethods = Object.keys(paymentsReturned).map(key => paymentsReturned[key]);
                console.log(this.paymentMethods);
            }
        });
    }
    
    doPayment(){
        //Pega dados para mandar para o servidor (Dados do item comprado...)
        let data = {
            dadosItem: {
                price: 12.50,
                name: 'Pedido 1000'
            },
            hash: PagSeguroDirectPayment.getSenderHash(),
            method: this.paymentMethod,
            total: 22.00,
            token: ''
        }
        
        console.log("chamando prepareCreditCard")
        
        if (this.paymentMethod == 'Credit')
        {
            this.prepareCreditCard().then( (retornoToken) => {
                console.log("Sucesso! Token: " + retornoToken.token); 

                //Inclui o token do cartão no objeto data
                //data.token = retornoToken.token;
                data.token = this.creditCard.token;

                //Envia requisição de pagamento para o servidor
                this.PaymentHttp.doPaymentServer(data).subscribe((retorno) => {
                    console.log('Pagamento realizado com sucesso! Retorno: ');
                    console.log(retorno);
                });  
                          
            }, (error) => {
                console.log(error);
            });
        }
        else
        {
            //Não há outra forma implementada
        }
    }
    
    prepareCreditCard(): Promise<any>{
        //Pega a bandeira do cartão
        return this.getCreditCardBrand().then( () => {
            //...e então Pega o token
            return this.getCreditCardToken();
        })
    }
    
    getCreditCardBrand(): Promise<any>{
        return new Promise( (resolve, reject) => {
             PagSeguroDirectPayment.getBrand({
                cardBin: this.creditCard.num.substring(0, 6),
                success: (response) => {
                    console.log(response);
                    this.creditCard.brand = response.brand.name;
                    
                    resolve({brand: response.brand.name});
                },
                error (error){
                    reject(error);
                }
            })
        });
    }
    getCreditCardToken(): Promise<any>{
        return new Promise( (resolve, reject) => {
             PagSeguroDirectPayment.createCardToken({
                cardNumber: this.creditCard.num,
                brand: this.creditCard.brand,
                cvv: this.creditCard.cvv,
                expirationMonth: this.creditCard.monthExp,
                expirationYear: this.creditCard.yearExp,
                success: (response) => {
                    console.log(response);
                    this.creditCard.token = response.card.token;
                    resolve({token: response.card.token});
                },
                error (error){
                    reject(error);
                }
            });
        });
    }

}
