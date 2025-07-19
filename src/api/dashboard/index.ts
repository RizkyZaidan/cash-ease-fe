import { isEmpty } from '@/components/utility';
import axios from '../config';

export async function fetchDashboard() {
    return axios.get(`/dashboard`);
}