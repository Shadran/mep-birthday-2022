import { Component, EventEmitter, OnInit, Output, SecurityContext } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.css']
})
export class ImageUploaderComponent implements OnInit {

  uploadError: string = '';
  fileLoadError: string = '';
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
      this.uploadError = '';
      this.fileLoadError = '';
      let file: File = fileList[0];
      let previewSrc = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL, this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file)))!;
      let imageTest = new Image();
      imageTest.onerror = () => {this.fileLoadError = "Cannot load image from specified file :( . Make sure the file is a readable jpg/png file and try again."};
      imageTest.onload = () => {
        this.srcChangedEvent.emit(previewSrc);
      };
      imageTest.src = previewSrc;
    }
  }

  uploadImageUrl() {
    this.uploadError = '';
    this.fileLoadError = '';
    let imageTest = new Image();
    let previewSrc = this.uploadForm.get('fileUrl')?.value;
    imageTest.onerror = () => {this.uploadError = "Cannot load image from specified URL :( . Make sure the link points to a jpg/png image and try again."};
    imageTest.onload = () => {
      this.srcChangedEvent.emit(previewSrc);
    };
    imageTest.src = previewSrc;
  }

}
