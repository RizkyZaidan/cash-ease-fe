import { isEmpty } from '@/components/utility';
import axios from '../config';

export async function topUpBalance(body: any) {
    return axios.post(`/transaction/top-up`, body);
}
export async function transferBalance(body: any) {
    return axios.post(`/transaction/transfer`, body);
}