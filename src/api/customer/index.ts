import { isEmpty } from '@/components/utility';
import axios from '../config';

export async function fetchCustomerList(parameter?: string) {
    if (!isEmpty(parameter)) parameter = `?${parameter}`;
    return axios.get(`/cif${parameter || ""}`);
}
export async function addCustomer(body: any) {
    return axios.post(`/cif`, body);
}
export async function deleteCustomer(id: string) {
    return axios.delete(`/cif/${id}`);
}