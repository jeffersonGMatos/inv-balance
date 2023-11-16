import { Injectable } from "@angular/core";

const products = [
  {
    codproduto: 122,
    gtin: "4740017924",
    codbarras: "4740017924",
    product: "Gil"
  }
]

@Injectable({
  providedIn: "root"
})
export class AppService {

  getProduct() {

  }

}