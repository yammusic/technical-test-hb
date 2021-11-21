class APIService {
  public baseUrl!: string
  public authToken?: string

  async request(url: string, options?: RequestInit) {
    try {
      const method = options?.method || 'GET'
      const headers = new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options?.headers ?? {}),
      })

      if (this.authToken) {
        headers.append('Authorization', `Bearer ${this.authToken}`)
      }

      const response = await fetch(url, {
        ...options,
        method,
        headers,
      })
      return await response.json()
    } catch (error) {
      console.warn('Error in APIService -> request', error)
      return error
    }
  }

  async get(route: string, params?: any, options?: any) {
    try {
      const url = `${this.baseUrl}/${route}`
      const reqOpts = { method: 'GET', ...options }

      return await this.request(url, reqOpts)
    } catch (error) {
      console.warn('Error in APIService -> get', error)
      return error
    }
  }

  async post(route: string, params?: any, options?: any) {
    try {
      const url = `${this.baseUrl}/${route}`
      const reqOpts = { method: 'POST', ...options }
      if (params) {
        reqOpts.body = JSON.stringify(params)
      }

      return await this.request(url, reqOpts)
    } catch (error) {
      console.warn('Error in APIService -> post', error)
      return error
    }
  }

  async patch(route: string, params?: any, options?: any) {
    try {
      const url = `${this.baseUrl}/${route}`
      const reqOpts = { method: 'PATCH', ...options }
      if (params) {
        reqOpts.body = JSON.stringify(params)
      }

      return await this.request(url, reqOpts)
    } catch (error) {
      console.warn('Error in APIService -> patch', error)
      return error
    }
  }

  async delete(route: string, options?: any) {
    try {
      const url = `${this.baseUrl}/${route}`
      const reqOpts = { method: 'DELETE', ...options }

      return await this.request(url, reqOpts)
    } catch (error) {
      console.warn('Error in APIService -> delete', error)
      return error
    }
  }
}

export default APIService