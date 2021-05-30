import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { CreatePollBody, GetCurrentUserResponse, GetPollResponse, GetPollsResponse, LoginBody } from 'interfaces';

class ApiService {
    private axiosInstance: AxiosInstance;
    constructor(baseURL = 'https://localhost:3000/api') {
        this.axiosInstance = axios.create({
            baseURL,
            withCredentials: true
        });
    }

    private static responseBody<T>(response: AxiosResponse<T>): T {
        return response.data;
    }

    private async get<T>(url: string): Promise<T> {
        const response = await this.axiosInstance.get<T>(url);
        return ApiService.responseBody<T>(response);
    }
    private async post<T>(url: string, body?: unknown): Promise<T> {
        const response = await this.axiosInstance.post<T>(url, body);
        return ApiService.responseBody<T>(response);
    }
    private async put<T>(url: string, body?: unknown): Promise<T> {
        const response = await this.axiosInstance.put<T>(url, body);
        return ApiService.responseBody<T>(response);
    }
    private async delete<T>(url: string): Promise<T> {
        const response = await this.axiosInstance.delete<T>(url);
        return ApiService.responseBody<T>(response);
    }

    public getCurrentUser(): Promise<GetCurrentUserResponse> {
        return this.get<GetCurrentUserResponse>('/users/current');
    }

    public login(body: LoginBody): Promise<void> {
        return this.post<void>('/auth/login', body);
    }

    public ping(): Promise<void> {
        return this.get<void>('/auth/ping');
    }

    public logout(): Promise<void> {
        return this.post<void>('/auth/logout');
    }

    public createPoll(body: CreatePollBody): Promise<boolean> {
        return this.post<boolean>('/polls', body);
    }

    public getPolls(): Promise<GetPollsResponse> {
        return this.get<GetPollsResponse>('/polls');
    }

    public getPoll(pollId: string): Promise<GetPollResponse> {
        return this.get<GetPollResponse>(`/polls/${pollId}`);
    }
}

export const apiService = new ApiService();
