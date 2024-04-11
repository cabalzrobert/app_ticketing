import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiserviceService {
    //readonly apiUrl = 'http://localhost:8090/app/v1/tickeingdashboard/';
    readonly apiUrl = 'http://122.52.219.195:55510/app/v1/stldashboard/';
    readonly photoUrl = "http://localhost:50306/Photos/";

    constructor(private http: HttpClient) { }
    //private readonly http = inject(HttpClient);

    // Department
    getDepartmentList(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'department/GetDepartment');
    }

    addDepartment(dept: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'department/AddDepartment', dept, httpOptions);
    }

    updateDepartment(dept: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.http.put<any>(this.apiUrl + 'department/UpdateDepartment/', dept, httpOptions);
    }

    deleteDepartment(deptId: number): Observable<number> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.http.delete<number>(this.apiUrl + 'department/DeleteDepartment/' + deptId, httpOptions);
    }

    // Employee
    getEmployeeList(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'employee/GetEmployee');
    }

    addEmployee(emp: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.http.post<any>(this.apiUrl + 'employee/AddEmployee', emp, httpOptions);
    }


    //LoadSubscriberListAsyn
    loadSubscriberList(url:string, data:any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        console.log('loadSubsriberList url', url);
        console.log('loadSubsriberList httpOptions', httpOptions);
        return this.http.post<any>(this.apiUrl + url, data, httpOptions )
    }

    updateEmployee(emp: any): Observable<any> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.http.put<any>(this.apiUrl + 'employee/UpdateEmployee/', emp, httpOptions);
    }

    deleteEmployee(empId: number): Observable<number> {
        const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        return this.http.delete<number>(this.apiUrl + 'employee/DeleteEmployee/' + empId, httpOptions);
    }

    uploadPhoto(photo: any) {
        return this.http.post(this.apiUrl + 'employee/savefile', photo);
    }

    getAllDepartmentNames(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl + 'employee/GetAllDepartmentNames');
    }

}