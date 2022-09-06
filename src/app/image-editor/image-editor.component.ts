import { AfterViewInit, Component, ElementRef, Input, OnChanges, SecurityContext, SimpleChanges, ViewChild } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.component.html',
  styleUrls: ['./image-editor.component.css']
})
export class ImageEditorComponent implements AfterViewInit, OnChanges  {
  @ViewChild('imageCanvas') imageCanvas! : ElementRef<HTMLCanvasElement>;
  @ViewChild('finalImageDownload') finalImageDownload! : ElementRef<HTMLAnchorElement>;

  @Input() resourceUrl?:string;
  finalImageSrc?:SafeResourceUrl;

  public context!: CanvasRenderingContext2D;

  private imageMask?: CanvasImageSource;
  private imageBorder?: CanvasImageSource;

  constructor(private sanitizer:DomSanitizer) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['resourceUrl']) return;
    if (!this.resourceUrl) return;

    let newImage = new Image();
    newImage.crossOrigin = 'Anonymous';
    newImage.onload = () => this.editImage(newImage);
    newImage.src = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(this.resourceUrl))!;

    
  }

  editImage(newImage:HTMLImageElement) : void   {
    this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

    if (!newImage || !newImage.height || !newImage.width){
      this.context.drawImage(this.imageBorder!, 0, 0, this.context.canvas.width, this.context.canvas.height);
      this.finalImageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageCanvas.nativeElement.toDataURL("image/png"));
      return;
    }

    let aspectRatio = newImage.width/newImage.height;
    let targetHeight = 0;
    let targetWidth = 0;
    if (aspectRatio >= 1){
      targetHeight = this.context.canvas.height;
      targetWidth = targetHeight*aspectRatio;
    } else {
      targetWidth = this.context.canvas.width;
      targetHeight = targetWidth/aspectRatio;
    }

    this.context.drawImage(this.imageMask!, 0, 0, this.context.canvas.width, this.context.canvas.height);
    this.context.globalCompositeOperation = 'source-in';
    this.context.drawImage(newImage, (this.context.canvas.width-targetWidth)/2, (this.context.canvas.height-targetHeight)/2, targetWidth, targetHeight);
    this.context.globalCompositeOperation = 'source-over';
    this.context.drawImage(this.imageBorder!, 0, 0, this.context.canvas.width, this.context.canvas.height);

    this.finalImageSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageCanvas.nativeElement.toDataURL("image/png"));
  }

  ngAfterViewInit(): void {
    this.context = this.imageCanvas.nativeElement.getContext('2d')!;
    this.imageMask = new Image();
    this.imageMask.src = "assets/CircleMaskTransparent.png";
    this.imageBorder = new Image();
    this.imageBorder.src = "assets/ProfileBorder.png";
    this.imageBorder.onload = () => this.editImage(new Image());
  }

  downloadImage() : void {
    let url = this.sanitizer.bypassSecurityTrustResourceUrl(this.imageCanvas.nativeElement.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, url)!;
    a.download = "reineBday2022.png";
    a.click();
    window.URL.revokeObjectURL(a.href);
    a.remove();
  }

}
