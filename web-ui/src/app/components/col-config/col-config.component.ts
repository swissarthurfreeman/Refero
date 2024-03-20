import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';
import { ConsultationComponent } from "../consultation/consultation.component";
import { MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { RefDataService } from '../../service/ref-data.service';


@Component({
  selector: 'app-col-config',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, 
    MatDividerModule, MatGridListModule, ConsultationComponent, MatButtonModule, MatFormFieldModule, MatCheckboxModule, MatInputModule],
  templateUrl: './col-config.component.html',
  styleUrl: './col-config.component.scss'
})
export class ColConfigComponent {
  fileSelected: boolean = true;
  ColSelected: string = "true";
  KeyType: string = '';
  Required: string = "true";

  _fileColName!: string;
  @Input()
  set FileColName(fileColName: string) {
    this._fileColName = fileColName;
  }

  get FileColName() {
    return this._fileColName;
  }
}
