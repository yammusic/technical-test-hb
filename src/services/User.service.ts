import APIService from './API.service'

class UserService extends APIService {
  async getAll() {
    return await this.get('users')
  }

  async find(id: number) {
    return await this.get(`user/${id}`)
  }

  async create(user: any) {
    return await this.post('user', user)
  }

  async update(id: string, user: any) {
    return await this.patch(`user/${id}`, user)
  }

  async destroy(id: string) {
    return await this.delete(`user/${id}`)
  }

  async getFavorites(userId: number) {
    return await this.get(`user/${userId}/favorites`)
  }

  async addFavorite(userId: number, repoId: number) {
    return await this.post(`user/${userId}/favorite`, { repoId })
  }

  async removeFavorite(userId: number, favoriteId: number) {
    return await this.delete(`user/${userId}/favorite/${favoriteId}`)
  }
}

export default new UserService()