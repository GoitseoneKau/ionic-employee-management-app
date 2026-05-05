import { effect, Injectable, signal } from '@angular/core';
import {
  CapacitorSQLite,
  capSQLiteChanges,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';
import { BehaviorSubject, take } from 'rxjs';


const DB_EMPLOYEES = 'employeedb';

export type employee = {
  id?: number;
  employee_id?: number;
  active?: boolean;
  name: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  salary: number;
};

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private readonly sqlite = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;
  public employees = signal<employee[]>([]);

  constructor() { }

  async initializePlugin() {
    const con = (await this.sqlite.isConnection(DB_EMPLOYEES, false)).result;
    const connectionConsistency = (
      await this.sqlite.checkConnectionsConsistency()
    ).result;

    if (con && connectionConsistency) {
      this.db = await this.sqlite.retrieveConnection(DB_EMPLOYEES, false);
    } else {
      this.db = await this.sqlite.createConnection(
        DB_EMPLOYEES,
        false,
        'no-encryption',
        1,
        false
      );
    }

    await this.db.open();

    if (Capacitor.getPlatform() === 'web') {
      await this.sqlite.saveToStore(DB_EMPLOYEES);
    }

    // Your database operations here
    const SCHEMA = `CREATE TABLE IF NOT EXISTS employees(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            active INTEGER DEFAULT 1,
            employee_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            department TEXT NOT NULL,
            position TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            salary REAL
          );`;

    await this.db.execute(SCHEMA);

    await this.db.close();
  }

  async loadEmployees() {
    await this.db.open();
    const employees = await this.db.query(`SELECT * FROM employees;`);
    this.employees.update((value) => (value = employees.values || []));
    await this.db.close();
  }

  async addEmployee(emp: employee) {

    try {
      await this.db.open();

      const query = `INSERT INTO employees (employee_id,name,department,position,email,phone,salary) 
        VALUES (?,?,?,?,?,?,?);`;

      emp.employee_id = this.employees().length == 0 ? 10110 : Math.max(...this.employees().map((employee) => employee.employee_id!)) + 1


      let result = await this.db.run(query, [
        emp.employee_id,
        emp.name,
        emp.department,
        emp.position,
        emp.email,
        emp.phone,
        emp.salary,
      ]);

      return result;
    } catch (error) {
      console.error('Error insertingemployee status:', error);
      throw error;
    } finally {
      await this.loadEmployees()
    }


  }

  async updateEmployeeStatus(emp_id:number,employee_update:any) {
    try {
      await this.db.open();
 
      const new_emp = {...employee_update}
  
      const query = `UPDATE employees SET 
        active = ?, name = ?, department = ?,
        position = ?, email = ?, phone = ?, salary = ?
      WHERE id=?;`;

        let result: capSQLiteChanges = await this.db.run(query, [
          new_emp.active,
          new_emp.name,
          new_emp.department,
          new_emp.position,
          new_emp.email,
          new_emp.phone,
          new_emp.salary,
          emp_id,
        ]);

        return result;

        
      
      
    } catch (error) {
      console.error('Error updating employee status:', error);
      throw error;
    }finally{
      await this.db.close();
      await this.loadEmployees();
     
    }
  }

  async deleteEmployee(id: any) {
    await this.db.open();
    const query = `DELETE FROM employees WHERE id=${id};`;

    const result = await this.db.query(query);
    await this.db.close();
    this.loadEmployees();

    return result;
  }


}
