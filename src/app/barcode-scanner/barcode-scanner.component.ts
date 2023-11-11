import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from "@angular/core";

@Component({
  templateUrl: "./barcode-scanner.component.html",
  styleUrls: ['./barcode-scanner.component.css']
})
export class BarcodeScannerComponent implements OnInit, AfterViewInit {
  @ViewChild("video") video?: ElementRef<HTMLVideoElement>
  @ViewChild("img") img?: ElementRef<HTMLImageElement>

  constructor(
    private _zone: NgZone,
  ) {}

  async read(image: any) {
    console.log(image);
    //this._zone.runOutsideAngular(as() => {
    try {
      let code = await (window as any).javascriptBarcodeReader({
        /* Image ID || HTML5 Image || HTML5 Canvas || HTML5 Canvas ImageData || Image URL */
        image,
        barcode: 'ean-13',
        // barcodeType: 'industrial',
        options: {
          // useAdaptiveThreshold: true // for images with sahded portions
          // singlePass: true
        }
      });

      console.log(code);
    } catch(e) {
      console.error(e)
    }
    
        
    //})
  }

  drawCanvas(img: any): HTMLCanvasElement {
    let canvas: HTMLCanvasElement = window.document.createElement("canvas");
    console.log(img)
    canvas.width = img.width;
    canvas.height = img.height;
    let ratio = Math.min(canvas.width / img.width, canvas.height / img.height);
    let x = (canvas.width - img.width * ratio) / 2;
    let y = (canvas.height - img.height * ratio) / 2;

    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
    canvas
      .getContext("2d")!
      .drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        x,
        y,
        img.width * ratio,
        img.height * ratio,
      );

    return canvas;
  }

  async startCamera() {
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
      let videoElement = this.video?.nativeElement;
      
      let mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: {
            min: 1280,
            max: 1920,
          },
          height: {
            min: 720,
            max: 1080
          },
          facingMode: 'environment'
        }
      });

      if (videoElement)
        videoElement.srcObject = mediaStream;

      const track = mediaStream.getVideoTracks()[0];
      
      let imageCapture = new ImageCapture(track)
      setInterval(async () => {
        const bitmap = await imageCapture.grabFrame();
        const canvas = this.drawCanvas(bitmap);
        await this.read(canvas);
      }, 3000)
    }
  }

  loadScript(): Promise<void> {
    return new Promise(resolve => {
      this._zone.runOutsideAngular(() => {
        let script: HTMLScriptElement = document.createElement('script');
        script.type = 'text/javascript';
        script.src = "//unpkg.com/javascript-barcode-reader";
  
        script.onload = () => {
            resolve();
        };
        script.onerror = (error: any) => console.error(error);
        document.getElementsByTagName('head')[0].appendChild(script);
      })
    })
    
  }

  changeCamera() {
    
  }

  ngOnInit(): void {
    
    
  }

  ngAfterViewInit(): void {
    this._zone.runOutsideAngular(async () => {
      this.loadScript().then(() => {
        this.read(this.img?.nativeElement)
        /*
        let image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = "https://codigosdebarrasbrasil.com.br/wp-content/uploads/2017/09/codigo_de_barras.jpg";
        image.onload = () => {
          this.read(image)
        };
        */
      })
    })
    this._zone.runOutsideAngular(async () => {
      //await this.loadScript();
      //await this.startCamera()

    })
  }

}