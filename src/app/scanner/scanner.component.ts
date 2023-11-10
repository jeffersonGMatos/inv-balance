import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, Renderer2, ViewChild } from "@angular/core";
import QrScanner from "qr-scanner";

@Component({
  templateUrl: "scanner.component.html",
  styleUrls: ["./scanner.component.css"]
})
export class ScannerComponent implements OnInit {
  @ViewChild("videoElement")
  private videoElem?: ElementRef<HTMLVideoElement>
  private scanner?: QrScanner
  private readed = false

  public flashon: boolean = false

  constructor(
    private _cdr: ChangeDetectorRef,
    private _zone: NgZone,
    private _renderer: Renderer2
  ) {
    this._cdr.detach();
  }

  private read(result: any): void {
    if (!this.readed) {
      this.readed = true;

      this._zone.runOutsideAngular(() =>
        this.scanner?.stop()
      )

      const data = result.data;
      console.log(data);

      this._cdr.detectChanges();
    }
  }

  private initScanner(): void {
    const videoElem = window.document.getElementById("videoElement") as HTMLVideoElement;
    console.log(videoElem)
    this._zone.runOutsideAngular(() => {
      if (videoElem) {
        this.scanner = new QrScanner(videoElem, 
          result => this.read(result), {
            highlightScanRegion: true,
            maxScansPerSecond: 10,
            highlightCodeOutline: true
          });

    
        this.flashon = this.scanner.isFlashOn();

        if (this.scanner)
          this.scanner.start();
      }
    });

    this._cdr.detectChanges();
  }

  public onClickToggleFlash(): void {
    this.flashon = !this.flashon;
    this._zone.runOutsideAngular(() => 
      this.scanner!.toggleFlash()
    );
    this._cdr.detectChanges();
  }

  ngOnInit() {
    this.initScanner();
  }
}