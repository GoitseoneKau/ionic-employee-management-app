import { SplashScreen } from '@capacitor/splash-screen';
import { Component, computed, signal, ViewChild, effect, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonIcon, IonItemOption, IonItemOptions, IonItemSliding, IonItem, IonSelect, IonSelectOption, IonLabel, IonText, IonList, IonListHeader, IonFabButton, IonFab, IonInput, IonModal, IonButton, IonButtons, IonCard, IonFooter, IonNote, IonAlert, IonMenu, IonMenuButton, IonAvatar, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { DatabaseService, employee } from '../services/database.service';
import { FormsModule, NgModel } from '@angular/forms';
import { CurrencyPipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { IonModalCustomEvent, OverlayEventDetail } from '@ionic/core';
import { addIcons } from 'ionicons';
import { add,addCircleOutline, chevronBackOutline,  pencil, personCircle, trash } from 'ionicons/icons';
import { Router } from '@angular/router';
import { InputCurrencyFormatterDirective } from '../directives/input-currency-formatter.directive';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonAlert, IonMenu, IonMenuButton,
    IonNote, IonFooter, IonCard, FormsModule, NgClass, NgFor, NgIf, TitleCasePipe,
    IonSelect, IonSelectOption, IonButtons, IonButton, IonModal,
    IonInput, IonFab, IonFabButton, IonListHeader, IonList,
    IonText, IonLabel, IonItem, IonItemSliding, IonItemOptions,
    IonItemOption, IonIcon, IonSearchbar, IonHeader, IonToolbar, IonTitle,
    IonContent, IonAvatar,
      InputCurrencyFormatterDirective],
 providers: [CurrencyPipe]
})
export class HomePage {

  // get modal
  @ViewChild('addModal') addModal!: IonModal;

  //get alert
  @ViewChild('deleteAlert') deleteAlert!: IonAlert;
  
db=inject(DatabaseService)

  employees = signal<employee[]>([])
  search = signal<string>("")
  search_employees = computed(() => {

    let search_input = this.search().toLowerCase()

    const filtered_employees = this.employees()
      .filter(employee =>
        employee.name.toLowerCase().includes(search_input) ||
        employee.department.toLowerCase().includes(search_input) ||
        employee.employee_id!.toString().includes(search_input)
      )
    const filtered_list = this.search() == "" ? this.employees() : filtered_employees
    return filtered_list
  })




  data: employee = {
    name: "",
    department: "",
    position: "",
    email: "",
    phone: "",
    salary: 0
  }

  alertButtons = [
    {
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'OK',
      role: 'confirm',
    },
  ];




  constructor( private readonly router: Router) {
    SplashScreen.hide()
    effect(() => this.employees.update(value=>this.db.employees()))
    addIcons({ add, pencil, trash, personCircle,chevronBackOutline,addCircleOutline });
  }


  async ngOnInit() {

    await this.db.initializePlugin()
    await this.db.loadEmployees()

  }

  logout() {
    this.router.navigate([''])
  }


  onSearchChange(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value ?? "";
    this.search.set(query)
  }

  gotoDetails(id: number) {
    this.router.navigate(["details", id]);
  }

  async createEmployee(emp: employee) {
    return await this.db.addEmployee(emp)
  }

  async deleteEmp(employeeId: any) {
    this.removeFocus();
    this.deleteAlert.isOpen = true
    this.deleteAlert.onDidDismiss().then(
      async (eventDetail) => {
        if (eventDetail.role == "confirm") {
          await this.db.deleteEmployee(employeeId)
          alert(" success")

          this.deleteAlert.isOpen = false
        }
      }
    )

  }

  async dismissAlert(event: CustomEvent<OverlayEventDetail>) {

    this.deleteAlert.isOpen = false
    this.deleteAlert.dismiss()
    this.removeFocus()
  }



  async onWillDismiss(event: IonModalCustomEvent<OverlayEventDetail<any>>) {
    this.removeFocus();
    // add task if confirm button is clicked
    if (event.detail.role === 'confirm') {
      const emp = event.detail.data
   

    if(typeof emp.salary === 'string'){
      emp.salary = emp.salary.replace(/^ZAR/, '').replace(/,/g, '').replace(/[^\d]/g, '').replace(/^0+/, '');
    }

      let new_employee = {
      ...emp,
      salary: parseFloat(emp.salary)
    } as employee
      
      await this.createEmployee(new_employee)
      
      alert("insert success")

      this.data = {
        name: "",
        department: "",
        position: "",
        email: "",
        phone: "",
        salary: 0
      }
    }



    this.addModal.dismiss();
  }

  removeFocus(event?: any) {
    // Remove focus from any active element
    const active = document.activeElement as HTMLElement;
  
    if (active && typeof active.blur==='function'){
      active.blur();
    } 
  }

  onWillOpen() {
    this.removeFocus()
  }

  onWillClose() {
    this.removeFocus()
  }

  //close modal
  cancel() {
    this.addModal.dismiss();
  }

  // confirm task in modal
  confirm() {
    this.addModal.dismiss(this.data, 'confirm');
  }


}


