import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { CreatePollBody, EMembership, GetCurrentUserResponse, GetDelegationsResponse, GetGivenDelegationsResponse, GetPollResponse, GetPollsResponse, GetUsersResponse, LoginBody, ResultsInterface } from 'interfaces';
import { CreateVoteRequestInterface } from 'interfaces/src/requests';
import { IDelegationData } from '../components/custom-table/CustomTableDelegations';

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
    private async patch<T>(url: string, body?: unknown): Promise<T> {
        const response = await this.axiosInstance.patch<T>(url, body);
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

    public deletePoll(pollId: string): Promise<boolean> {
        return this.delete<boolean>(`/polls/${pollId}`);
    }
    public updatePollState(pollId: string): Promise<boolean> {
        return this.patch<boolean>(`/polls/state/${pollId}`);
    }
    public getUsers(): Promise<GetUsersResponse> {
        return this.get<GetUsersResponse>(`/users`);
    }

    public updateMembership(membership: EMembership[], userId: string): Promise<boolean> {
        return this.patch<boolean>(`/users/membership/${userId}`, { membership });
    }

    public async getDelegationsWithUsers(): Promise<IDelegationData[]> {
        const delegations = await this.get<GetDelegationsResponse>('/delegations');
        const users = await this.getUsers()
        const userMap: { [index: string]: string } = users.reduce((map, obj) => {
            map[obj.userId] = obj.name;
            return map;
        }, {} as { [index: string]: string });
        return delegations.map((d) => ({ delegator: userMap[d.userIdDelegator], receiver: userMap[d.userIdReceiver], id: d._id! as unknown as string }));
    }

    public giveDelegation(id1: string, id2: string): Promise<boolean> {
        return this.post<boolean>(`/delegations/${id1}/${id2}`);
    }

    public deleteDelegation(id: string): Promise<boolean> {
        return this.delete<boolean>(`/delegations/${id}`);
    }

    public deleteDelegations(): Promise<boolean> {
        return this.delete<boolean>(`/delegations`);
    }

    public async getGivenDelegations(id: string): Promise<GetGivenDelegationsResponse> {
        return this.get<GetGivenDelegationsResponse>(`/delegations/delegated/${id}`);
    }
    public async getReceivedDelegations(id: string): Promise<GetGivenDelegationsResponse> {
        return this.get<GetGivenDelegationsResponse>(`/delegations/received/${id}`);
    }

    public async addVote(vote: CreateVoteRequestInterface): Promise<boolean> {
        return this.post<boolean>(`/votes`, vote);
    }

    public async addDelegatedVote(id: string, vote: CreateVoteRequestInterface): Promise<boolean> {
        return this.post<boolean>(`/votes/${id}`, vote);
    }

    public async getResults(id: string): Promise<ResultsInterface[]> {
        return this.get<ResultsInterface[]>(`/votes/results/${id}`);
    }
}

export const apiService = new ApiService();
