/**
 * Base Abstraction Layer for Data Access
 *
 * This class provides a consistent API for fetching data,
 * hiding the underlying implementation (JSON import vs Real API).
 */
export class BaseService<T> {
    protected simulateDelay(ms: number = 500): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    protected async getFromJSON(data: any): Promise<T[]> {
        await this.simulateDelay();
        return data as T[];
    }

    // Future API implementation
    /*
    protected async getFromAPI(endpoint: string): Promise<T[]> {
        const config = useRuntimeConfig();
        return $fetch<T[]>(`${config.public.apiBase}${endpoint}`);
    }
    */
}
