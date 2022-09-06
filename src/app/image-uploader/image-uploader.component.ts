import { Component, EventEmitter, OnInit, Output, SecurityContext } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent implements OnInit {

  previewSrc?:string;
  uploadError: string = '';
  uploadForm! : FormGroup;

  @Output() srcChangedEvent = new EventEmitter<string>();


  constructor(private sanitizer:DomSanitizer, private fb:FormBuilder) { }

  ngOnInit(): void {
    this.uploadForm = this.fb.group({
      fileUrl: ['']
    });
  }

  fileChange(event :Event) {
    if (!event || !event.target) return;
    let target = event.target as HTMLInputElement
    if (!target || !target.files) return;
    let fileList: FileList = target.files;
    if(fileList.length > 0) {
        let file: File = fileList[0];
        this.previewSrc = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file)))!;
        this.srcChangedEvent.emit(this.previewSrc);
    }
  }

  uploadImageUrl() {
    let imageTest = new Image();
    imageTest.onerror = () => {this.uploadError = "Cannot load image from specified URL"};
    imageTest.onload = () => {
      this.previewSrc = imageTest.src; 
      this.srcChangedEvent.emit(this.previewSrc);
    };
    imageTest.src = this.uploadForm.get('fileUrl')?.value
  }

  reset() {
    this.previewSrc = '';
  }

}
