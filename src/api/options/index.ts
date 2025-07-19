import { isEmpty } from '@/components/utility';
import axios from '../config';

export async function fetchOptions(parameter?: string) {
    if (!isEmpty(parameter)) parameter = `?${parameter}`;
    return axios.get(`/options${parameter || ""}`);
}