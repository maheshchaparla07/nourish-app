const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface Client {
  id: string;
  status: string;
  client_type: string;
  title?: string;
  gender?: string;
  forename: string;
  middle_name?: string;
  surname: string;
  date_of_birth?: string;
  email?: string;
  secondary_email?: string;
  landline?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClientCreate {
  status?: string;
  client_type?: string;
  title?: string;
  gender?: string;
  forename: string;
  middle_name?: string;
  surname: string;
  date_of_birth?: string;
  email?: string;
  secondary_email?: string;
  landline?: string;
}

export interface ClientUpdate {
  status?: string;
  client_type?: string;
  title?: string;
  gender?: string;
  forename?: string;
  middle_name?: string;
  surname?: string;
  date_of_birth?: string;
  email?: string;
  secondary_email?: string;
  landline?: string;
}

export interface ClientsListResponse {
  clients: Client[];
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

export async function createClient(clientData: ClientCreate): Promise<Client> {
  const response = await fetch(`${API_BASE_URL}/clients`, {
    method: 'POST',
    headers: await getAuthHeaders(),
    body: JSON.stringify(clientData),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message || 'Failed to create client.');
  }

  return data as Client;
}

export async function getAllClients(
  statusFilter?: string,
  search?: string
): Promise<ClientsListResponse> {
  const params = new URLSearchParams();
  if (statusFilter && statusFilter !== 'all') params.append('status_filter', statusFilter);
  if (search) params.append('search', search);

  const url = `${API_BASE_URL}/clients${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: await getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message || 'Failed to fetch clients.');
  }

  return data as ClientsListResponse;
}

export async function getClient(clientId: string): Promise<Client> {
  const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
    method: 'GET',
    headers: await getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message || 'Failed to fetch client.');
  }

  return data as Client;
}

export async function updateClient(
  clientId: string,
  clientData: ClientUpdate
): Promise<Client> {
  const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
    method: 'PUT',
    headers: await getAuthHeaders(),
    body: JSON.stringify(clientData),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ErrorResponse;
    throw new Error(error.message || 'Failed to update client.');
  }

  return data as Client;
}

export async function deleteClient(clientId: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/clients/${clientId}`, {
    method: 'DELETE',
    headers: await getAuthHeaders(),
  });

  if (!response.ok) {
    const data = await response.json();
    const error = data as ErrorResponse;
    throw new Error(error.message || 'Failed to delete client.');
  }
}

