import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';

/*
  Generated class for the PaymentHttpProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PaymentHttpProvider {

    constructor(public http: HttpClient) {
        console.log('Hello PaymentHttpProvider Provider');
    }
    
    getSession():Observable<Object>{
        return this.http.get('http://localhost/Testes/pag-seguro/sessions.php')
            .map(response => response);
    }

    doPaymentServer(data): Observable<Object> {
        return this.http.post('http://localhost/Testes/pag-seguro/payment.php', data)
            .map(response => response);
    }

}
