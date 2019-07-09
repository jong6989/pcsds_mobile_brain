import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { InAppBrowser, InAppBrowserOptions, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  scannedQR: string;
  webApp: InAppBrowserObject;
  browserOptions: InAppBrowserOptions = {
    zoom : 'yes',
    location: 'no',
    hideurlbar: 'yes',
    fullscreen: 'yes'
  }

  constructor(
    private barCodeScanner: BarcodeScanner,
    private iab: InAppBrowser
  ) {
   }

  ngOnInit() {
  }

  loadUrl(url: string) {
    const f = url.match('pcsd.gov.ph');
    console.log(f)
    if(f.length > 0){
      try {
        this.webApp = this.iab.create(url, '_self',this.browserOptions);
        this.webApp.show();
      } catch (error) {
        console.log(error);
      }
    }
  }

  scanQRcode() {
    this.barCodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.scannedQR = barcodeData.text;
      this.loadUrl(barcodeData.text)
     }).catch(err => {
         console.log('Error', err);
     });
  }

}
