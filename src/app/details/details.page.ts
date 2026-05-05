import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar,
  IonNote, IonButtons, IonButton,
  IonSelect, IonSelectOption, IonInput, IonIcon, IonAlert, IonCheckbox, IonTitle } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBackSharp, checkmarkCircle, pencil, chevronBackOutline, addCircleOutline } from 'ionicons/icons';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService, employee } from '../services/database.service';
import { OverlayEventDetail } from '@ionic/core';
import { InputCurrencyFormatterDirective } from '../directives/input-currency-formatter.directive';
import { StatusBar, Animation, Style, BackgroundColorOptions } from '@capacitor/status-bar';
import { Capacitor } from '@capacitor/core';


@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [
    IonCheckbox, IonAlert, IonIcon,
    IonButton, IonButtons, IonNote, IonContent,
    IonHeader, IonToolbar,IonTitle,
    IonSelect, IonSelectOption, IonInput,
    CommonModule, FormsModule,
    InputCurrencyFormatterDirective
  ],
  providers: [CurrencyPipe]
})
export class DetailsPage implements OnInit {

  current = inject(CurrencyPipe)

  //get alert
  @ViewChild('updateAlert') updateAlert!: IonAlert;
  @ViewChild('warningAlert') warningAlert!: IonAlert;
  @ViewChild('editForm') editForm!: NgForm

  employee_details!: employee

  

  alertButtons = [
    {
      text: 'OK',
      role: 'confirm',
    }
  ];
formattedAmount: any;
id = this.activeRoute.snapshot.params['id']


  constructor(
    private readonly router: Router,
    private readonly activeRoute: ActivatedRoute,
    private readonly db: DatabaseService) {
    addIcons({arrowBackSharp,checkmarkCircle,chevronBackOutline,addCircleOutline,pencil});
  }


  ngOnInit() {
      this.setBg()
    this.employee_details = {...this.db.employees().filter(emp => emp.id == this.id)[0]};
    this.formattedAmount = this.current.transform(this.employee_details.salary, 'ZAR', 'symbol', '1.0-0')
  }
  

  async setBg() {
    if (Capacitor.getPlatform() !== 'web') {
      await StatusBar.show()
      //Display statusbar above app
      await StatusBar.setOverlaysWebView({ overlay: true })
      //SET color of status bar i.e Dark=white text,LIGHT=black text
      await StatusBar.setStyle({ style: Style.Light });
      //set mobile status bar background color
      await StatusBar.setBackgroundColor({ color: "#0163aa" });
    
    }
  }

  

  async back() {
    if(this.editForm.invalid){
      this.warningAlert.isOpen = true
    }else{
      this.router.navigate(['home'], { replaceUrl: true })
       if (Capacitor.getPlatform() !== 'web') {
      //SET color of status bar i.e Dark=white text,LIGHT=black text
      await StatusBar.setStyle({ style: Style.Dark });
       }
    }
    
  }

  async editEmp(emp_update: any) {
    const emp = emp_update.value
   

    if(typeof emp.salary === 'string'){
      emp.salary = emp.salary.replace(/^ZAR/, '').replace(/,/g, '').replace(/[^\d]/g, '').replace(/^0+/, '');
    }
    const new_employee_data = {
      ...emp,
      salary: parseFloat(emp.salary)
    }
    
    
    const update = await this.db.updateEmployeeStatus(this.id,new_employee_data)

    if(update){
      this.updateAlert.isOpen = true
    }
  }

  removeFocus(event?: any) {

    // Remove focus from any active element
    const active = document.activeElement as HTMLElement;
    if (active && active.blur) active.blur();
  }

  dismissAlert(event: CustomEvent<OverlayEventDetail>) {
    if (event.detail.role === 'confirm') {
      this.warningAlert.isOpen ? null : this.back()
    }

     this.warningAlert.isOpen = false
    this.updateAlert.isOpen = false
    this.removeFocus()
    this.updateAlert.dismiss()

  }

}
