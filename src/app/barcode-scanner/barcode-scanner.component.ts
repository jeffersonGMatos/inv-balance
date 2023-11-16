import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import * as Quagga from "quagga";
import { BehaviorSubject, distinctUntilChanged, filter } from "rxjs";

@Component({
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: "./barcode-scanner.component.html",
  styleUrls: ['./barcode-scanner.component.css']
})
export class BarcodeScannerComponent implements OnInit, AfterViewInit {
  @ViewChild("video") video?: ElementRef<HTMLDivElement>
  @ViewChild("scanArea") scanArea?: ElementRef<HTMLDivElement>

  public status: 'init' | 'scanning' | 'readed' = 'init';
  public code = new BehaviorSubject<string>('');

  constructor(
    private _zone: NgZone
  ) {}

  async startReader() {
    return new Promise<void>((resolve, reject)=> {
      console.log(Quagga);
      const video = this.video!.nativeElement;
      const scanArea = this.scanArea!.nativeElement;
      const w = scanArea.getBoundingClientRect().width / 4;
      const h = scanArea.getBoundingClientRect().height / 4;

      console.log(scanArea.getBoundingClientRect(), window.screen.orientation)
      
      Quagga.onDetected(data => this.code.next(data.codeResult.code));
      Quagga.init({
        frequency: 10,
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: video,
          constraints: {
            video: {
              width: { 
                min: 1024, ideal: 1280, max: 1920 
              },
              height: { 
                min: 576, ideal: 720, max: 1080 
              },
            },
            facingMode: "environment"
          }
        },
        decoder : {
          readers : ["ean_reader"]
        }
      }, (err: any) => {
        if (err)
          reject(err)

        Quagga.start();
        resolve();
      });

      if (window.screen.orientation.type.startsWith("portrait"))
        scanArea.style.borderWidth = `${w}px ${h}px`;
      else
        scanArea.style.borderWidth = `${h}px ${w}px`;
    })
  }

  private beep() {
    const audio = new window.Audio('./assets/beep.mp3');
    Promise.resolve(audio.play())
  }

  private async initializeReader() {
    await this.video!.nativeElement.requestFullscreen();
    (window.screen.orientation as any).lock("landscape");
    this.video!.nativeElement.style.display = "block";
  }

  private closeReader() {
    this._zone.runOutsideAngular(async () => {
      this.beep();
      window.screen.orientation.unlock();
      window.document.exitFullscreen();
      this.video!.nativeElement.style.display = "none";
      Quagga.stop();
    })
  }

  onClickStart() {
    this.status = 'scanning';

    this._zone.runOutsideAngular(async () => {
      await this.initializeReader();
      await this.startReader();
    })
  }

  ngOnInit(): void {
    this.code
    .pipe(
      distinctUntilChanged(),
      filter<string>(value => value.length > 0)
    )
    .subscribe(value => {
      this.closeReader();  
      this._zone.run(() => {
        this.code.next(value);
        this.status = 'readed';
      })
    });
  }

  ngAfterViewInit(): void {
    
  }

}