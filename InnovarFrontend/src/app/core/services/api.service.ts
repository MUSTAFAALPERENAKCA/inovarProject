import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Patient {
  id: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateOrUpdatePatient {
  nationalId: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  phoneNumber?: string;
  notes?: string;
}

export interface BloodTube {
  id: string;
  barcodeNumber: string;
  patientId: string;
  patient: Patient;
  collectedByUserId: string;
  collectedByUserName: string;
  collectionDateTime: string;
  rackRow: number;
  rackColumn: number;
  status: string;
  notes?: string;
  createdAt: string;
}

export interface CreateBloodTube {
  barcodeNumber: string;
  rackRow: number;
  rackColumn: number;
  notes?: string;
  patient: CreateOrUpdatePatient;
}

export interface LabResult {
  id: string;
  bloodTubeId: string;
  performedByUserId: string;
  performedByUserName: string;
  testType: string;
  resultValues: { [key: string]: string };
  resultStatus: string;
  resultDateTime: string;
  comments?: string;
  createdAt: string;
}

export interface CreateLabResult {
  bloodTubeId: string;
  testType: string;
  resultValues: { [key: string]: string };
  resultStatus: string;
  comments?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Patient endpoints
  createOrUpdatePatient(patient: CreateOrUpdatePatient): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiUrl}/patients`, patient);
  }

  searchPatients(search?: string): Observable<Patient[]> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<Patient[]>(`${this.apiUrl}/patients`, { params });
  }

  getPatient(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/patients/${id}`);
  }

  // Tube endpoints
  createTube(tube: CreateBloodTube): Observable<BloodTube> {
    return this.http.post<BloodTube>(`${this.apiUrl}/tubes`, tube);
  }

  getTubeByPosition(row: number, column: number): Observable<BloodTube> {
    return this.http.get<BloodTube>(`${this.apiUrl}/tubes/by-position`, {
      params: { row: row.toString(), column: column.toString() }
    });
  }

  getTubeByBarcode(barcode: string): Observable<BloodTube> {
    return this.http.get<BloodTube>(`${this.apiUrl}/tubes/by-barcode/${barcode}`);
  }

  getNurseTubes(status?: string): Observable<BloodTube[]> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get<BloodTube[]>(`${this.apiUrl}/tubes/nurse/list`, { params });
  }

  getPendingTubes(): Observable<BloodTube[]> {
    return this.http.get<BloodTube[]>(`${this.apiUrl}/tubes/lab/pending`);
  }

  getTube(id: string): Observable<BloodTube> {
    return this.http.get<BloodTube>(`${this.apiUrl}/tubes/${id}`);
  }

  // Lab Result endpoints
  createLabResult(result: CreateLabResult): Observable<LabResult> {
    return this.http.post<LabResult>(`${this.apiUrl}/labresults`, result);
  }

  updateLabResult(id: string, result: Partial<CreateLabResult>): Observable<LabResult> {
    return this.http.put<LabResult>(`${this.apiUrl}/labresults/${id}`, result);
  }

  getLabResultsByTube(tubeId: string): Observable<LabResult[]> {
    return this.http.get<LabResult[]>(`${this.apiUrl}/labresults/by-tube/${tubeId}`);
  }

  getPatientWithResults(patientId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patients/${patientId}/labresults`);
  }
}

