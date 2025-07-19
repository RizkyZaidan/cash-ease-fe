import { isEmpty } from '@/components/utility';
import axios from '../config';

export async function fetchBalanceList(parameter?: string) {
    if (!isEmpty(parameter)) parameter = `?${parameter}`;
    return axios.get(`/report/balance${parameter || ""}`);
}
export async function fetchTransferList(parameter?: string) {
    if (!isEmpty(parameter)) parameter = `?${parameter}`;
    return axios.get(`/report/transfer${parameter || ""}`);
}
export async function fetchTopupList(parameter?: string) {
    if (!isEmpty(parameter)) parameter = `?${parameter}`;
    return axios.get(`/report/top-up${parameter || ""}`);
}