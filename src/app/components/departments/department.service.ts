import { Injectable } from '@angular/core';
import { Department } from 'src/app/models/department.model';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { HttpPaginationResponse } from 'src/app/interfaces/httpPaginationResponse.interface';
import { Params } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { HttpDataResponse } from 'src/app/interfaces/httpDataResponse.interface';
import { Doctor } from 'src/app/models/doctor.model';

@Injectable()

export class DepartmentService {
    private departments: Department[] = [];
    departmentsChanged = new Subject<Department[]>();

    constructor(private http: HttpClient) {}

    getAllDepartments(httpParams: Params): Observable<HttpPaginationResponse> {
        const page = httpParams.page || 1;

        return this.http.get<HttpPaginationResponse>('http://127.0.0.1:8001/api/departments?page=' + page, {
            params: httpParams
        }).pipe(
            map(response => {
                response.data = response.data.map(args => {
                    return new Department(args.id, args.name, args.doctors);
                });

                return response;
            }),
            tap(response => {
                this.departments = response.data
            })
        );
    }

    getSelectDepartments(): Observable<HttpDataResponse> {
        return this.http.get<HttpDataResponse>('http://127.0.0.1:8001/api/departments?clean=1').pipe(
            map(response => {
                response.data = response.data.map(args => {
                    return new Department(args.id, args.name);
                });

                return response;
            })
        );
    }

    getDepartment(id: number): Observable<Department> {
        return this.http.get<HttpDataResponse>('http://127.0.0.1:8001/api/departments/' + id)
        .pipe(
            map(response => {
                const args = response.data;
                
                return new Department(args.id, args.name);
            })
        );
    }

    createDepartment(department: Department): Observable<any> {
        return this.http.post('http://127.0.0.1:8001/api/departments', department);
    }

    updateDoctor(id: number, data): Observable<any> {
        return this.http.patch('http://127.0.0.1:8001/api/departments/' + id, data);
    }

    deleteDepartment(id: number): Observable<any> {
        const position = this.departments.findIndex( 
            (departmentEl: Department) => {
                return departmentEl.id === id;
            }
        )

        this.departments.splice(position, 1);
        this.departmentsChanged.next(this.departments);

        return this.http.delete('http://127.0.0.1:8001/api/departments/' + id);
    }

    getDoctors(id: number): Observable<Doctor[]> {
        return this.http.get<HttpDataResponse>('http://127.0.0.1:8001/api/departments/' + id + '/doctors')
        .pipe(
            map(response => {
                console.log(response);

                let data = response.data.map((args: any) => {
                    return new Doctor(
                        args.id, 
                        args.name,
                        args.surname,
                        args.title
                    );
                });

                return data;
            })
        )
    }
}
