const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Carer {
  id: string;
  status: string;
  title?: string;
  gender?: string;
  forename: string;
  middle_name?: string;
  surname: string;
  date_of_birth?: string;
  email?: string;
  secondary_email?: string;
  landline?: string;
  mobile?: string;
  has_mobile_access: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CarerCreate {
  status?: string;
  title?: string;
  gender?: string;
  forename: string;
  middle_name?: string;
  surname: string;
  date_of_birth?: string;
  email?: string;
  secondary_email?: string;
  landline?: string;
  mobile?: string;
  has_mobile_access?: boolean;
}

export interface CarerUpdate {
  status?: string;
  title?: string;
  gender?: string;
  forename?: string;
  middle_name?: string;
  surname?: string;
  date_of_birth?: string;
  email?: string;
  secondary_email?: string;
  landline?: string;
  mobile?: string;
  has_mobile_access?: boolean;
}

export interface CarersListResponse {
  carers: Carer[];
  total: number;
}

export interface ErrorResponse {
  message: string;
}

async function getAuthHeaders() {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export async function createCarer(carerData: CarerCreate): Promise<Carer> {
  const response = await fetch(`${API_BASE_URL}/carers`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(carerData),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message || 'Failed to create carer.');
  }

  return data as Carer;
}

export async function getAllCarers(
  statusFilter?: string,
  search?: string
): Promise<CarersListResponse> {
  const params = new URLSearchParams();
  if (statusFilter && statusFilter !== 'all') params.append('status_filter', statusFilter);
  if (search) params.append('search', search);

  const url = `${API_BASE_URL}/carers${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: await getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message || 'Failed to fetch carers.');
  }

  return data as CarersListResponse;
}

export async function getCarer(carerId: string): Promise<Carer> {
  const response = await fetch(`${API_BASE_URL}/carers/${carerId}`, {
    method: 'GET',
    headers: await getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message || 'Failed to fetch carer.');
  }

  return data as Carer;
}

export async function updateCarer(
  carerId: string,
  carerData: CarerUpdate
): Promise<Carer> {
  const response = await fetch(`${API_BASE_URL}/carers/${carerId}`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify(carerData),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message || 'Failed to update carer.');
  }

  return data as Carer;
}

export async function deleteCarer(carerId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/carers/${carerId}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    const data = await response.json();
    const error = data as ErrorResponse;
    throw new Error(error.message || 'Failed to delete carer.');
  }
}

